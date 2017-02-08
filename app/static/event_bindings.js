// display mouse position in HTML on mousemove
canvas.addEventListener('mousemove', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    $('#x-coord-display').text(mousePos.x);
    $('#y-coord-display').text(mousePos.y);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#a8a8a8";
    ctx.beginPath();
    ctx.arc(mousePos.x, mousePos.y, SIMM_RADIUS, 0, 2*Math.PI);
    ctx.fill();

    draw_objects_on_canvas(ctx, canvas, SIMMS);

}, false);

// register mouse click
canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);
    SIMMS.push(new Simm(SIMM_RADIUS, 1, new Position(mousePos.x, mousePos.y), 0));

    //erase canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_objects_on_canvas(ctx, canvas, SIMMS);
}, false);

document.getElementById("btn-start-simulation").onclick = function() {
    simulation_instance = new Simulation(SIMMS, canvas, ctx);
    start();
};

document.getElementById("btn-stop-simulation").onclick = function() {
    stop();
};