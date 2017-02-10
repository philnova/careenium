function Position (x, y) {
    this.x = x;
    this.y = y;
};

Position.prototype.flipX = function() {
    this.x = -this.x;
}

Position.prototype.flipY = function() {
    this.y = -this.y;
}

function Simm (radius, mass, pos, velocity) {
    this.radius = radius;
    this.mass = mass;
    this.pos = pos;
    this.velocity = velocity;
};

Simm.prototype.checkXWallCollision = function(min, max) {
    if (this.pos.x <= min || this.pos.x >= max) {
        this.velocity.flipX();
        this.move();
    };
};

Simm.prototype.checkYWallCollision = function(min, max) {
    if (this.pos.y <= min || this.pos.y >= max) {
        this.velocity.flipY();
        this.move();
    };
};

function findMassOfSimm (radius, density) {
    var area = Math.PI * (radius) ** 2;
    return area * density;
};

function findSquaredDistance (simm1, simm2) {
    return (Math.abs(simm1.pos.x - simm2.pos.x) ** 2) + (Math.abs(simm1.pos.y - simm2.pos.y) ** 2)
};

function findClosestSimm(needle, haystack) {
    var closest = null;
    var distance = Number.POSITIVE_INFINITY;
    for (var i=0; i<haystack.length; i++) {
        if (haystack[i] != needle) {
            sd = findSquaredDistance(needle, haystack[i]);
            if (sd < distance) {
                distance = sd;
                closest = i;
            };
        };
    };
    return {closest: closest, distance: distance}
};

Simm.prototype.move = function() {
    this.pos.x = this.pos.x + this.velocity.x;
    this.pos.y = this.pos.y + this.velocity.y;
};

function Simulation (simm_array, canvas, ctx) {
    this.simm_array = simm_array;
    this.canvas = canvas;
    this.ctx = ctx;
};

Simm.prototype.collide = function(other) {
    newVelX = (this.velocity.x * (this.mass - other.mass) + (2 * other.mass * other.velocity.x)) / (this.mass + other.mass);
    newVelY = (this.velocity.y * (this.mass - other.mass) + (2 * other.mass * other.velocity.y)) / (this.mass + other.mass);
    newVelOtherX = (other.velocity.x * (other.mass - this.mass) + (2 * this.mass * this.velocity.x)) / (this.mass + other.mass);
    newVelOtherY = (other.velocity.y * (other.mass - this.mass) + (2 * this.mass * this.velocity.y)) / (this.mass + other.mass);

    // move balls apart one frame so they don't get stuck together
    this.pos.x = this.pos.x + newVelX;
    this.pos.y = this.pos.y + newVelY;
    other.pos.x = other.pos.x + newVelOtherX;
    other.pos.y = other.pos.y + newVelOtherY;

    this.velocity.x = newVelX;
    this.velocity.y = newVelY;
    other.velocity.x = newVelOtherX;
    other.velocity.y = newVelOtherY;
}

Simulation.prototype.checkSimmCollisions = function() {
    checked = new Array(this.simm_array.length).fill(0);
    for (var i=0; i<this.simm_array.length; i++) {
        if (checked[i] == 0) {
            closestData = findClosestSimm(this.simm_array[i], this.simm_array);
            if (Math.sqrt(closestData.distance) <= this.simm_array[i].radius + this.simm_array[closestData.closest].radius) {
                // collision!
                this.simm_array[i].collide(this.simm_array[closestData.closest])
                checked[closestData.closest] = 1;
            };
            checked[i] = 1;
        };
    };
};

Simulation.prototype.advanceOne = function() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.checkWallCollision();
    this.checkSimmCollisions();

    for (var i=0; i<this.simm_array.length; i++) {
        this.simm_array[i].move();
    };
    draw_objects_on_canvas(this.ctx, this.canvas, this.simm_array);
};

Simulation.prototype.checkWallCollision = function() {
    for (var i=0; i<this.simm_array.length; i++) {
        this.simm_array[i].checkXWallCollision(0, canvas.width);
        this.simm_array[i].checkYWallCollision(0, canvas.height);
    }
};