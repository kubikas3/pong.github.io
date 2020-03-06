var canvas,
    ctx,
    deltaTime = 0,
    gameTime = 0,
    timeScale = 1,
    frameRate = 0,
    fpsLimit = 60,
    info,
    scale;

var paddle0 = new Paddle(new Vector2(114, 506), new Vector2(28, 3)),
    paddle1 = new Paddle(new Vector2(114, 6), new Vector2(28, 3)),
    ball = new Ball(new Vector2(126, 254), 4);

onresize = setupCanvas;

onload = function(e)
{
    canvas = document.createElement("canvas");
    info = document.getElementById("info");
    canvas.style.transform = "scale(" + (1 / devicePixelRatio) + ")";
    setupCanvas();
    document.body.insertBefore(canvas, document.body.children[0]);
    var upTime = performance.now();
    
    (function loop()
    {
        //var nextFrameTime = upTime + 1000 / fpsLimit;
        
        // while (performance.now() < nextFrameTime)
        //     continue;
        
        deltaTime = (performance.now() - upTime) / 1000;
        upTime = performance.now();
        gameTime += deltaTime;
        frameRate = 1 / deltaTime;
        Input._newState = 
        {
            keys: Array.from(Input._keys),
            touches: Array.from(Input._touches)
        };
        update();
        physics();
        lateUpdate();
        draw();
        Input._oldState =
        {
            keys: Array.from(Input._newState.keys),
            touches: Array.from(Input._newState.touches)
        };
        info.innerHTML = "FPS: " + (1 / deltaTime).toFixed(1);
        requestAnimationFrame(loop);
    })();
}

function setupCanvas()
{
    //canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    canvas.width = canvas.height / 2;
    scale = canvas.width / 256;
    canvas.style.marginLeft = innerWidth / 2 - canvas.width / devicePixelRatio / 2 + "px";
    ctx = canvas.getContext("2d");
    ctx.font = "29px Arial";
    ctx.fillStyle = "rgb(236, 240, 241)";
    ctx.strokeStyle = "rgb(236, 240, 241)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";
    ctx.imageSmoothingQuality = "high";
    ctx.imageSmoothingEnabled = true;
}

function update()
{
    if (Input.touchCount == 1)
    {
        if (ball.velocity.x == 0 && ball.velocity.y == 0)
        {
            ball.velocity = new Vector2(Math.random() * 200, Math.random() * 200);
        }

        var touch = Input.getTouch(0);
        paddle0.position.x = touch.position.x / scale - paddle0.size.x / 2;
    }

    paddle1.position.x = Vector2.lerp(paddle1.position, new Vector2(ball.position.x + ball.radius / 2 - paddle1.size.x / 2, 0), 0.1).x;
}

function lateUpdate()
{
    /*if (Input.touchCount == 1)
    {
        var touch = Input.getTouch(0),
            p1 = Vector2.screenToWorld(touch.prevPosition),
            p2 = Vector2.screenToWorld(touch.position),
            delta = Vector2.subtract(p2, p1),
            vel = Vector2.multiply(delta, 60),
            finger = Ray.raycast(p1, p2);
        
        if (finger && finger.polygon)
        {
            finger.polygon.addForce(finger.point, Vector2.multiply(vel, finger.polygon.mass / 4), finger.normal);
        }
    }
    
    result = null;
    
    if (gameTime > nextTimeToShoot && Input.touchCount > 1)
    {
        nextTimeToShoot = gameTime + 1 / gun.fireRate;
        result = Ray.raycast(gun.getMuzzle(), Vector2.add(gun.getMuzzle(), Vector2.multiply(gun.getDirection(), -10000)));
        
        clouds.push({
            position: Vector2.add(gun.getMuzzle(), Vector2.multiply(gun.getDirection(), -10)),
            rotation: Math.random() * 2 * Math.PI,
            scale: 0.01,
            scaleFactor: 1.02,
            opacity: 0.2,
            velocity: Vector2.add(Vector2.multiply(gun.getDirection(), -40 - Math.random() * 40), new Vector2(0, Math.random() * 60))
        });
        
        if (result.polygon)
        {
            var nAngle = Vector2.angle(result.normal);
            
            clouds.push({
                position: new Vector2(result.point.x - 10 + Math.random() * 20, result.point.y - 10 + Math.random() * 20),
                rotation: Math.random() * 2 * Math.PI,
                scale: 0.01,
                scaleFactor: 1.01,
                opacity: 0.3,
                velocity: Vector2.angleLength(nAngle - 0.2 + Math.random() * 0.4, Math.random() * 50)
            });
            
            result.polygon.addForce(result.point, Vector2.multiply(Vector2.subtract(result.point, result.origin).normalized, 9 * 91000), result.normal);
        }
    }*/
}

function physics()
{
    ball.position.x += ball.velocity.x / fpsLimit * timeScale;
    ball.position.y += ball.velocity.y / fpsLimit * timeScale;

    if (ball.position.x < 0)
    {
        ball.velocity.x *= -1;
        ball.position.x = 0;
    }

    if (ball.position.x + ball.radius > 256)
    {
        ball.velocity.x *= -1;
        ball.position.x = 256 - ball.radius;
    }

    if (ball.position.x + ball.radius > paddle0.position.x &&
        ball.position.x < paddle0.position.x + paddle0.size.x &&
        ball.position.y + ball.radius > paddle0.position.y &&
        ball.position.y < paddle0.position.y + paddle0.size.y)
        {
            ball.position.y = paddle0.position.y - ball.radius;
            ball.velocity.y *= -1.1;
        }

    if (ball.position.x + ball.radius > paddle1.position.x &&
        ball.position.x < paddle1.position.x + paddle1.size.x &&
        ball.position.y + ball.radius > paddle1.position.y &&
        ball.position.y < paddle1.position.y + paddle1.size.y)
        {
            ball.position.y = paddle1.position.y + paddle0.size.y + ball.radius;
            ball.velocity.y *= -1.1;
        }
}

function draw()
{
    ctx.save();
    ctx.fillStyle = "rgb(52, 73, 94)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.save();
    ctx.scale(scale, scale);
    
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(256, 256);
    ctx.lineWidth = 1;
    ctx.setLineDash([8.25, 8.25]);
    ctx.stroke();

    ctx.fillRect(paddle0.position.x, paddle0.position.y, paddle0.size.x, paddle0.size.y);
    ctx.fillRect(paddle1.position.x, paddle1.position.y, paddle1.size.x, paddle1.size.y);
    ctx.fillRect(ball.position.x, ball.position.y, ball.radius, ball.radius);

    ctx.restore();
}

function drawImage(image, position, rotation, scale = new Vector2(1, 1), opacity = 1, offset = new Vector2(0, 0))
{
    var alpha = ctx.globalAlpha;
    ctx.globalAlpha = opacity;
    ctx.translate(position.x, position.y);
    ctx.rotate(rotation);
    ctx.scale(scale.x, -scale.y);
    ctx.drawImage(image, -image.width / 2 + offset.x / scale.x, -image.height / 2 + offset.y / scale.y);
    ctx.scale(1 / scale.x, 1 / -scale.y);
    ctx.rotate(-rotation);
    ctx.translate(-position.x, -position.y);
    ctx.globalAlpha = alpha;
}