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
    }
}

Simm.prototype.checkYWallCollision = function(min, max) {
    if (this.pos.y <= min || this.pos.y >= max) {
        this.velocity.flipY();
    }
}

Simm.prototype.move = function() {
    this.pos.x = this.pos.x + this.velocity.x;
    this.pos.y = this.pos.y + this.velocity.y;
};

function Simulation (simm_array, canvas, ctx) {
    this.simm_array = simm_array;
    this.canvas = canvas;
    this.ctx = ctx;
};

Simulation.prototype.advanceOne = function() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.checkWallCollision();
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