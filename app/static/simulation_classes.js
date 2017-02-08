function Position (x, y) {
    this.x = x;
    this.y = y;
};

function Vector (pos, magnitude) {
    this.pos = pos; // use a Position object
    this.magnitude = magnitude;
};

function Simm (radius, mass, pos, velocity) {
    this.radius = radius;
    this.mass = mass;
    this.pos = pos;
    this.velocity = velocity;
};

Simm.prototype.move = function() {
    this.pos.x++;
    this.pos.y++;
};

function Simulation (simm_array, canvas, ctx) {
    this.simm_array = simm_array;
    this.canvas = canvas;
    this.ctx = ctx;
};

Simulation.prototype.advanceOne = function() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i=0; i<this.simm_array.length; i++) {
        this.simm_array[i].move(1.0);
    };
    draw_objects_on_canvas(this.ctx, this.canvas, this.simm_array);
};