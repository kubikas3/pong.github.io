class Ray
{
    static raycast(origin, point)
    {
        var info =
        {
            origin: origin,
            point: point,
            polygon: null,
            edge: new Vector2(0, 0),
            normal: new Vector2(0, 0)
        };
        
        var r = Vector2.subtract(point, origin),
            min = 1;
        
        for (var i = 0; i < bodies.length; i++)
        {
            var cur = bodies[i];
            
            for (var j = 0; j < cur.points.length; j++)
            {
                var s = cur.edge(j),
                    d = r.x * s.y - r.y * s.x,
                    c = new Vector2(cur.center.x + cur.points[j].x - origin.x, cur.center.y + cur.points[j].y - origin.y),
                    u = (c.x * r.y - c.y * r.x) / d,
                    t = (c.x * s.y - c.y * s.x) / d;
                
                if (t >= 0 && u >= 0 && u <= 1 && t < min)
                {
                    info.polygon = cur;
                    info.edge = s;
                    min = t;
                }
            }
        }
        
        info.normal = new Vector2(info.edge.y, -info.edge.x).normalized;
        info.point = Vector2.add(origin, Vector2.multiply(Vector2.subtract(point, origin), min));
        return info;
    }
}