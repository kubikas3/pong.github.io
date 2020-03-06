var particleSources = [];

class ParticleSource
{
    contructor(position = new Vector2(0, 0))
    {
        this.position = position;
        this.interval = -1;
        this.nextSpawnTime = 0;
        this.distanceRange = [5, 10];
        this.angularVelocityRange = [0, 0];
        this.velocityDirectionRange = [0, 2 * Math.PI];
        this.velocityMagnitudeRange = [10, 100];
        this.radiusRange = [10, 100];
        this.cornerCount = [3, 8];
        this.particles = [];
        particleSources.push(this);
    }
    
    spawnParticle(count = 1)
    {
        if (gameTime < this.nextSpawnTime || this.interval < 0)
            return;
        
        this.nextSpawnTime = gameTime + this.interval;
        
        for (var i = 0; i < count; i++)
        {
            var points = new Array(this.cornerCount[0] + Math.floor(Math.random() * (this.cornerCount[1] - this.cornerCount[0])));
            
            for (var j = 0; j < points.length; j++)
            {
                points[j] = Vector2.angleLength(j / points.length * 2 * Math.PI, this.radiusRange[0] + Math.random() * (this.radiusRange[1] - this.radiusRange[0]));
            }
            
            particle = new Polygon(Vector2.add(this.position, Vector2.random(this.distanceRange)), points);
            particle.angularVelocity = this.angularVelocityRange[0] + Math.random() * (this.angularVelocityRange[1] - this.angularVelocityRange[0]);
            particle.velocity = Vector2.angleLength(this.velocityDirectionRange[0] + Math.random() * (this.velocityDirectionRange[1] - this.velocityDirectionRange[0]), this.velocityMagnitudeRange[0] + Math.random() * (this.velocityMagnitudeRange[1] - this.velocityMagnitudeRange[0]));
            this.particles.push(particle);
        }
    }
}