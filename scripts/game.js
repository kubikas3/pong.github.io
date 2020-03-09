var canvas,
    ctx,
    deltaTime = 0,
    gameTime = 0,
    timeScale = 1,
    frameRate = 0,
    fpsLimit = 60,
    info,
    scale,
    ws,
    uuid,
    pingSent = 0,
    pingSum = 0,
    pingCount = 0,
    ping = 0,
    roomIsFull = false;

var players,
    ball,
    ballTrace = [];

onresize = setupCanvas;
onorientationchange = setupCanvas;

onload = function(e)
{
    canvas = document.createElement("canvas");
    info = document.getElementById("info");
    canvas.style.transform = "scale(" + (1 / devicePixelRatio) + ")";
    setupCanvas();
    document.body.insertBefore(canvas, document.body.children[0]);
    ws = new WebSocket("wss://78.61.204.80:8081");
    ws.onmessage = function(ev)
    {
        var msg = JSON.parse(ev.data);
        
        switch (msg.type)
        {
            case 'uuid':
                uuid = msg.data;
                break;

            case 'objects':
                if (players)
                {
                    for (var i = 0; i < players.length; i++)
                    {
                        players[i].newpos = msg.data.players[i].position;
                        players[i].score = msg.data.players[i].score;
                        players[i].size = msg.data.players[i].size;
                        players[i].online = msg.data.players[i].online;
                    }
                }
                else
                {
                    players = msg.data.players;
                }
                if (ball)
                {
                    ball.newpos = msg.data.ball.position;
                    ball.radius = msg.data.ball.radius;
                }
                else
                {
                    ball = msg.data.ball;
                }

                break;
            case 'message':
                if (msg.data == 'room is full')
                {
                    roomIsFull = true;
                }
                break;
            case 'pong':
                if (pingCount > 100)
                {
                    pingCount = 0;
                    pingSum = 0;
                }

                pingSum += performance.now() - pingSent;
                pingCount++;
                ping = pingSum / pingCount;
                
                pingSent = performance.now();
                ws.send(JSON.stringify({type: "ping", data: ""}));
                break;
        }
    }
    ws.onopen = function(ev)
    {
        pingSent = performance.now();
        ws.send(JSON.stringify({type: "ping", data: ""}));
    }

    upTime = performance.now();
    
    (function loop()
    {
        deltaTime = (performance.now() - upTime) / 1000;
        upTime = performance.now();
        gameTime += deltaTime;
        frameRate = 1 / deltaTime;
        update();
        draw();
        info.innerHTML = "FPS: " + (1 / deltaTime).toFixed(1) + "\nPing: " + Math.round(ping) + " ms";//;
        requestAnimationFrame(loop);
    })();
}

function setupCanvas()
{
    if (innerHeight / innerWidth > 2)
    {
        canvas.width = innerWidth * devicePixelRatio;
        canvas.height = canvas.width * 2;
    }
    else
    {
        canvas.height = innerHeight * devicePixelRatio;
        canvas.width = canvas.height / 2;
    }
    scale = canvas.width / 256;
    canvas.style.marginTop = innerHeight - canvas.height / devicePixelRatio + "px";
    canvas.style.marginLeft = innerWidth / 2 - canvas.width / devicePixelRatio / 2 + "px";
    ctx = canvas.getContext("2d");
    ctx.font = devicePixelRatio * 40 + "px Arial";
    ctx.fillStyle = "rgb(236, 240, 241)";
    ctx.strokeStyle = "rgb(236, 240, 241)";
    ctx.lineWidth = 2;
    ctx.lineJoin = "round";
    ctx.lineCap = "butt";
    ctx.imageSmoothingQuality = "high";
    ctx.imageSmoothingEnabled = true;
}

ontouchstart = function(e)
{
    ws.send(JSON.stringify({ type: 'input', data: (e.touches[0].clientX - canvas.offsetLeft) * devicePixelRatio / scale}));
}

ontouchmove = function(e)
{
    ws.send(JSON.stringify({ type: 'input', data: (e.touches[0].clientX - canvas.offsetLeft) * devicePixelRatio / scale}));
}

// ontouchend = function(e)
// {
//     var doc = window.document;
//     var docEl = doc.documentElement;
//     var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    
//     if(requestFullScreen && !doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement)
//     {
//         requestFullScreen.call(docEl);
//         screen.orientation.lock("portrait");
//     }
// }

// ontouchcancel = function(e)
// {

// }

function update()
{
    if (ballTrace.length >= 10)
    {
        ballTrace.splice(0, 1);
    }

    if (players)
    {
        for (var i = 0; i < players.length; i++)
        {
            if (players[i].newpos)
            {
                players[i].position = Vector2.lerp(players[i].position, players[i].newpos, 0.7);
            }
        }
    }

    if (ball)
    {
        if (ball.newpos)
        {
            ball.position = Vector2.lerp(ball.position, ball.newpos, 0.7);
            //ball.position.x = ball.newpos.x + ball.velocity.x * deltaTime;
            //ball.position.y = ball.newpos.y + ball.velocity.y * deltaTime;
        }

        ballTrace.push(ball.position);
    }
}

function draw()
{
    ctx.save();
    ctx.fillStyle = "rgb(52, 73, 94)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    ctx.save();

    if (roomIsFull)
    {
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("The room is full", 128 * scale, 256 * scale);
        ctx.restore();
        return;
    }

    if (uuid == 'player1')
    {
        if (players)
        {
            ctx.textBaseline = "top";
            ctx.fillText(players[0].score, 10, 260 * scale);
            ctx.textBaseline = "alphabetic";
            ctx.textAlign = "right";
            ctx.fillText(players[1].score, 252 * scale, 249 * scale);
        }
        ctx.scale(-scale, -scale);
        ctx.translate(-256, -512);
    }
    else
    {
        if (players)
        {
            ctx.textBaseline = "top"
            ctx.fillText(players[1].score, 10, 260 * scale);

            ctx.textBaseline = "alphabetic";
            ctx.textAlign = "right";
            ctx.fillText(players[0].score, 252 * scale, 249 * scale);
        }

        ctx.scale(scale, scale);
    }
    
    ctx.beginPath();
    ctx.moveTo(0, 256);
    ctx.lineTo(256, 256);
    ctx.lineWidth = 1;
    ctx.setLineDash([8.25, 8.25]);
    ctx.stroke();

    ctx.save();

    if (players)
    {
        for (var i = 0; i < players.length; i++)
        {
            ctx.fillStyle = "rgb(236, 240, 241)";

            if (!players[i].online)
            {
                ctx.fillStyle = 'rgb(30, 30, 30)';
            }

            ctx.fillRect(players[i].position.x - players[i].size.x / 2, players[i].position.y - players[i].size.y / 2, players[i].size.x, players[i].size.y);
        }
    }

    ctx.restore();

    if (ballTrace.length > 0)
    {
        var start = ballTrace[0],
            end = ballTrace[ballTrace.length - 1],
            gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);

        gradient.addColorStop(0, "rgba(236, 240, 241, 0)");
        gradient.addColorStop(1, "rgba(236, 240, 241, 1)");
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        
        for (var i = 1; i < ballTrace.length; i++)
        {
            ctx.lineTo(ballTrace[i].x, ballTrace[i].y);
        }

        ctx.lineWidth = 4;
        ctx.strokeStyle = gradient;
        ctx.setLineDash([]);
        ctx.lineCap = "round";
        ctx.stroke();
    }

    if (ball)
    {
        ctx.beginPath();
        ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

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