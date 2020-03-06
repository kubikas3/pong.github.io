var bodies = [];

class Box
{
    constructor(center = Vector2.zero, size = new Vector2(1, 1))
    {
        this.center = center;
        this.centerOfMass = new Vector2(0, 0);
        var hw = size.x / 2, hh = size.y / 2;
        this.points = [
            new Vector2(-hw, hh),
            new Vector2(-hw, -hh),
            new Vector2(hw, -hh),
            new Vector2(hw, hh)
        ];
        var points = this.points.slice();
        this.isDynamic = true;
        this.isVisible = true;
        this.mass = size.x * size.y;
        this.inertia = this.mass * (size.x * size.x + size.y * size.y) / 12;
        this.angularVelocity = 0;
        this.velocity = Vector2.zero;
        this.radius = Math.sqrt(Math.max.apply(null, this.points.map(function(v) { return v.sqrMagnitude; })));
        var r = 0;
        
        Object.defineProperty(this, "rotation",
        {
            get: function()
            {
                return r;
            },
            
            set: function(value)
            {
                var cos = Math.cos(value),
                    sin = Math.sin(value);
                
                for (var i = 0; i < 4; i++)
                    this.points[i] = new Vector2(this.centerOfMass.x + ((points[i].x - this.centerOfMass.x) * cos - (points[i].y - this.centerOfMass.y) * sin), this.centerOfMass.y + ((points[i].x - this.centerOfMass.x) * sin + (points[i].y - this.centerOfMass.y) * cos));
                
                r = (value + 2 * Math.PI) % (2 * Math.PI);
            }
        });
        
        bodies.push(this);
    }
    
    addForce(position, force, normal)
    {
        if (!this.isDynamic)
            return;
        
        var ra = Vector2.subtract(position, Vector2.add(this.center, this.centerOfMass));
        
        if (Vector2.dot(force, normal) > 0)
            return;
        
        var jn = Vector2.multiply(normal, Vector2.dot(force, normal));
        
        this.velocity = Vector2.add(this.velocity, Vector2.divide(jn, this.mass));
        this.angularVelocity += Vector2.cross(ra, jn) / this.inertia;
        
        var tangent = new Vector2(normal.y, -normal.x);
        var jt = Vector2.multiply(tangent, Vector2.dot(force, tangent));
        
        this.velocity = Vector2.add(this.velocity, Vector2.divide(jt, this.mass));
        this.angularVelocity += Vector2.cross(ra, jt) / this.inertia;
    }
    
    isTouching(a)
    {
        for (var i = 0; i < 8; i++)
        {
            var axis;
            
            if (i < 4)
                axis = new Vector2(this.edge(i).y, -this.edge(i).x);
            
            else
                axis = new Vector2(a.edge(i - 4).y, -a.edge(i - 4).x);
            
            if (Box.intervalDistance(Box.projection(this, axis), Box.projection(a, axis)) >= 0)
                return false;
        }
        
        return true;
    }
    
    isPointInside(point)
    {
        for (var i = 0; i < 4; i++)
        {
            var axis = new Vector2(this.edge(i).y, -this.edge(i).x),
                proj = Box.projection(this, axis);
            
            if (Vector2.dot(point, axis) < proj.minDot || Vector2.dot(point, axis) > proj.maxDot)
                return false;
        }
        
        return true; 
    }
    
    edge(index)
    {
        return Vector2.subtract(this.points[(index + 1) % 4], this.points[index % 4]);
    }
    
    static projection(box, onto)
    {
        var d = Vector2.dot(Vector2.add(box.center, box.points[0]), onto),
            result =
            {
                minDot: d,
                maxDot: d,
                min: Vector2.add(box.center, box.points[0]),
                max: Vector2.add(box.center, box.points[0])
            };
        
        for (var i = 1; i < box.points.length; i++)
        {
            d = Vector2.dot(Vector2.add(box.center, box.points[i]), onto);
            
            if (d > result.maxDot)
            {
                result.maxDot = d;
                result.max = Vector2.add(box.center, box.points[i]);
            }
            
            else if (d < result.minDot)
            {
                result.minDot = d;
                result.min = Vector2.add(box.center, box.points[i]);
            }
        }
        
        return result;
    }
    
    static intervalDistance(a, b)
    {
        if (a.minDot < b.minDot)
            return b.minDot - a.maxDot;
        
        return a.minDot - b.maxDot;
    }
}