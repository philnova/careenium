// helper function to draw generic objects on canvas
function draw_objects_on_canvas(context, canvas, objects) {
    for (var i=0; i<objects.length; i++) {
        context.fillStyle = "#000000";
        context.beginPath();
        context.arc(objects[i].pos.x, objects[i].pos.y, objects[i].radius, 0, 2*Math.PI);
        context.fill();
    };
};

$(document).ready(function() { 

    canvas = $('#game-canvas').get(0);
    ctx = canvas.getContext("2d");

    SIMMS = []; // global array to hold simm objects as they are created
    SIMM_RADIUS = 10;
    SIMM_MAX_RADIUS = 15;
    SIMM_X_VEL = 5;
    SIMM_Y_VEL = 5;
    SIMM_DENSITY = 1;

    delta = 0;
    fps = 2;
    maxFPS = 50;
    started = false;
    timestep = 1000 / 60;

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
        SIMMS.push(new Simm(SIMM_RADIUS, findMassOfSimm(SIMM_RADIUS, SIMM_DENSITY), new Position(mousePos.x, mousePos.y), new Position(SIMM_X_VEL, SIMM_Y_VEL)));

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

    document.getElementById("btn-clear-simms").onclick = function() {
        clearSimms();
    };

    document.getElementById("btn-create-random-simms").onclick = function() {
        SIMMS = [];
        simulation_instance = new Simulation(SIMMS, canvas, ctx);
        createRandomSimms(500);
        start();
    };


    function getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      };

    function panic () {
        delta = 0;
    }

    function stop () {
        running = false;
        started = false;
        cancelAnimationFrame(frameID);
    };

    function clearSimms () {
        stop();
        SIMMS = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function createRandomSimms (n) {
        for (var i=0; i < n; i++) {
            var x = getRandomInt(0, canvas.width);
            var y = getRandomInt(0, canvas.height);
            var radius = getRandomInt(1, SIMM_MAX_RADIUS);
            var xVel = getRandomInt(-5, 5);
            var yVel = getRandomInt(-5, 5)
            SIMMS.push(new Simm(radius, findMassOfSimm(radius, SIMM_DENSITY), new Position(x, y), new Position(xVel, yVel)));
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        draw_objects_on_canvas(ctx, canvas, SIMMS);
    };

    function start () {
        if (!started) {
            started = true;

            frameID = requestAnimationFrame(function(timestamp) {
                simulation_instance.advanceOne();
                running = true;
                lastFrameTimeMs = timestamp;
                lastFpsUpdate = timestamp;
                framesThisSecond = 0;
                frameID = requestAnimationFrame(mainLoop);
            });
        };
    };

    function mainLoop(timestamp) {
        // Throttle the frame rate.    
        if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
            frameID = requestAnimationFrame(mainLoop);
            return;
        }
        delta += timestamp - lastFrameTimeMs;
        lastFrameTimeMs = timestamp;

        if (timestamp > lastFpsUpdate + 1000) {
            fps = 0.25 * framesThisSecond + 0.75 * fps;

            lastFpsUpdate = timestamp;
            framesThisSecond = 0;
        }
        framesThisSecond++;

        var numUpdateSteps = 0;
        while (delta >= timestep) {
            delta -= timestep;
            if (++numUpdateSteps >= 240) {
                panic();
                break;
            };
        };
        simulation_instance.advanceOne();
        frameID = requestAnimationFrame(mainLoop);
    };

});