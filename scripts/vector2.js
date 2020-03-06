class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
    
    normalize()
    {
        var len = this.magnitude;
        this.x /= len;
        this.y /= len;
    }
    
    toString(precision = 2)
    {
        if (!isNaN(precision))
        {
            return "(" + this.x.toFixed(precision) + ", " + this.y.toFixed(precision) + ")";
        }
        
        return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")";
    }
    
    clone()
    {
        return new Vector2(this.x, this.y);
    }
    
    get sqrMagnitude()
    {
        return this.x * this.x + this.y * this.y;
    }
    
    get magnitude()
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    
    get normalized()
    {
        var len = this.magnitude;
        return new Vector2(this.x / len, this.y / len);
    }
    
    get negative()
    {
        return new Vector2(-this.x, -this.y);
    }
    
    static rotateAround(vector, anchor, angle)
    {
        var cos = Math.cos(angle),
            sin = Math.sin(angle),
            dx = vector.x - anchor.x,
            dy = vector.y - anchor.y;
        
        return new Vector2(anchor.x + (dx * cos - dy * sin), anchor.y + (dx * sin + dy * cos));
    }
    
    static angle(a)
    {
        return Math.atan2(a.y, a.x);
    }
    
    static angleLength(angle, length)
    {
        return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
    }
    
    static screenToWorld(point)
    {
        return new Vector2(camera.x + (point.x - canvas.width / 2) / (canvas.height / scale), camera.y - (point.y - canvas.height / 2) / (canvas.height / scale));
    }
    
    static random(radiusRange)
    {
        var r = radiusRange[0] + Math.random() * (radiusRange[1] - radiusRange[0]),
            d = Math.random() * 2 * Math.PI;
        
        return new Vector2(Math.cos(d) * r, Math.sin(d) * r);
    }
    
    static project(vector, onto)
    {
        var t = Vector2.dot(vector, onto) / onto.magnitudeSqr;
        
        return new Vector2(vector.x * t, vector.y * t);
    }
    
    static cross(a, b)
    {
        if (!isNaN(a))
        {
            return new Vector2(-a * b.y, a * b.x);
        }
        
        else if (!isNaN(b))
        {
            return new Vector2(b * a.y, -b * a.x);
        }
        
        return a.x * b.y - a.y * b.x;
    }
    
    static dot(a, b)
    {
        return a.x * b.x + a.y * b.y;
    }
    
    static lerp(a, b, t)
    {
        var d = new Vector2(b.x - a.x, b.y - a.y);
        
        return new Vector2(a.x + d.x * t, a.y + d.y * t);
    }
    
    static add(left, right)
    {
        return new Vector2(left.x + right.x, left.y + right.y);
    }
    
    static subtract(left, right)
    {
        return new Vector2(left.x - right.x, left.y - right.y);
    }
    
    static multiply(left, right)
    {
        if (!isNaN(left))
            return new Vector2(left * right.x, left * right.y);
        
        return new Vector2(left.x * right, left.y * right);
    }
    
    static divide(left, right)
    {
        if (!isNaN(left))
            return new Vector2(left / right.x, left / right.y);
        
        return new Vector2(left.x / right, left.y / right);
    }
    
    static get zero()
    {
        return new Vector2(0, 0);
    }
    
    static get left()
    {
        return new Vector2(-1, 0);
    }
    
    static get right()
    {
        return new Vector2(1, 0);
    }
    
    static get down()
    {
        return new Vector2(0, -1);
    }
    
    static get up()
    {
        return new Vector2(0, 1);
    }
}