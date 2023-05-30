//SVG -> Turtle Graphics Converter
// Podporuje následující SVG commandy: (velké písmeno = absolutní souřadnice, malé písmeno = relativní souřadnice)
//
// - M,m - přesuň se na souřadnice                   - zvedne tužku, otočí se a dojede na souřadnice      - parametry: x,y (abs/rel)
// - L,l - udělej čáru na souřadnice                 - položí tužku, otočí se a dojede na souřadnice      - parametry: x,y (abs/rel)
// - Z,z - dojeď zpět na start (0,0)                 - položí tužku, otočí se a dojede na souřadnice 0,0  - bez parametrů (bez rozdílu abs/rel)
// - H,h - udělej horizontální čáru na souřadnici x  - položí tužku, otočí se a dojede na souřadnici x    - parametry: x (abs/rel)
// - V,v - udělej vertikální čáru na souřadnici y    - položí tužku, otočí se a dojede na souřadnici y    - parametry: y (abs/rel)
// - Z,z - dojeď zpět na start (0,0)                 - položí tužku, otočí se a dojede na souřadnice 0,0  - bez parametrů (bez rozdílu abs/rel)
function calcTriangle(a, b) {
    var c = Math.sqrt(a * a + b * b);
    var deg = (Math.atan(a / b) * 180 / Math.PI);
    if (b < 0) {
        deg += 180;
    }
    return { c: c, deg: deg };
}

function isValid(letter, valid) {
    if (/^\d$/.test(letter) || letter == " " || letter == ",")
        return false;
    for (var _i = 0, valid_1 = valid; _i < valid_1.length; _i++) {
        var validLetter = valid_1[_i];
        if (letter == validLetter)
            return true;
    }
    return false;
}

function deltaWrite(deltaAngle, output) {
    if (deltaAngle < 0) {
        output.push(["left", -deltaAngle]);
    } else if (deltaAngle <= 180) {
        output.push(["right", deltaAngle]);
    } else if (deltaAngle > 180) {
        output.push(["left", 360 - deltaAngle]);
    }
}

function draw(pen, coords, draw, output) {
    if (draw && !pen.down) {
        output.push(["pendown"]);
        pen.down = true;
    } else if (!draw && pen.down) {
        output.push(["penup"]);
        pen.down = false;
    }
    var triangle = calcTriangle(coords[0], coords[1]);
    var deltaAngle = triangle.deg - pen.bearing;
    deltaWrite(deltaAngle, output);
    output.push(["forward", triangle.c]);
    pen.bearing = triangle.deg;
}
var accuracy = 40;
var rn = ["x", "y"];

function cubicBezier(P0, P1, P2, P3) {
    var res = [];
    for (var t = 0; t <= accuracy; t++) {
        for (var i = 0; i < P0.length; i++) {
            res[t][rn[i]] = (Math.round(((-P0[i] + 3 * P1[i] - 3 * P2[i] + P3[i]) * t * t * t + (3 * P0[i] - 6 * P1[i] + 3 * P2[i]) * t * t + (3 * P1[i] - 3 * P0[i]) * t + P0[i]) * 1000) / 1000);
        }
    }
    return res;
}

function quadBezier(P0, P1, P2) {
    var res = [];
    for (var t = 0; t <= accuracy; t++) {
        for (var i = 0; i < P0.length; i++) {
            res[t][rn[i]] = (Math.round(((P0[i] - 2 * P1[i] + P2[i]) * t * t + (2 * P1[i] - 2 * P0[i]) * t + P0[i]) * 1000) / 1000);
        }
    }
    return res;
}
main();

function main() {
    var startTime = Date.now();

    var path = "M216.5 535C228.1 539.8 264.333 579.667 281 599L367.5 510.5L442 421.5L519 326L570.5 187.5L558 63.5L454.5 1.5L351 28L293 96.5L281 187.5L258 96.5L216.5 28L117.5 1.5L34.5 28L1.5 136L34.5 253.5L117.5 398.5C145.667 442 204.9 530.2 216.5 535Z";
    path = "M172 470L94.5 380L17.5 240.5L1 95L72 11.5L172 47L226 142.5L255 47L322 1L438.5 47L428 157.5L376 320L274 428L201 488.5Z"

    var valid = ["M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z"];
    var commands = [];
    var lastCommand = "";
    for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
        var letter = path_1[_i];
        if (isValid(letter, valid) && lastCommand.length > 0) {
            commands.push(lastCommand);
            lastCommand = "";
        }
        lastCommand += letter;
    }
    commands.push(lastCommand);
    var output = [];
    var pen = {
        coords: [0, 0],
        bearing: 0,
        down: false
    };
    commands.forEach(function(command) {
        var args = command.slice(1).split(" ").map(function(x) { return parseFloat(x); });
        if (command[0] == "L") {
            var newArgs = [args[0] - pen.coords[0], args[1] - pen.coords[1]];
            pen.coords = [args[0], args[1]];
            draw(pen, newArgs, true, output);
        } else if (command[0] == "M") {
            var newArgs = [args[0] - pen.coords[0], args[1] - pen.coords[1]];
            pen.coords = [args[0], args[1]];
            draw(pen, newArgs, false, output);
        } else if (command[0] == "H") {
            var newArg = Math.abs(args[0] - pen.coords[0]);
            pen.coords[0] = args[0];
            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            }
            var deg = newArg < 0 ? 90 : -90;
            var deltaAngle = deg - pen.bearing;
            deltaWrite(deltaAngle, output);
            output.push(["forward", newArg]);
            pen.bearing = deg;
        } else if (command[0] == "V") {
            var newArg = Math.abs(args[0] - pen.coords[1]);
            pen.coords[1] = args[0];
            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            }
            var deg = newArg < 0 ? 180 : 0;
            var deltaAngle = deg - pen.bearing;
            deltaWrite(deltaAngle, output);
            output.push(["forward", newArg]);
            pen.bearing = deg;
        } else if (command[0] == "Z" || command[0] == "z") {
            var newArgs = [0, 0];
            pen.coords = [args[0], args[1]];
            draw(pen, newArgs, true, output);
        } else if (command[0] == "l") {
            pen.coords = [pen.coords[0] + args[0], pen.coords[0] + args[1]];
            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            };
            var triangle = calcTriangle(args[0], args[1]);
            var deltaAngle = triangle.deg - pen.bearing;
            deltaWrite(deltaAngle, output);
            output.push(["forward", triangle.c]);
            pen.bearing = triangle.deg;
        } else if (command[0] == "m") {
            pen.coords = [pen.coords[0] + args[0], pen.coords[0] + args[1]];
            if (pen.down) {
                output.push(["penup"]);
                pen.down = false;
            }
            var triangle = calcTriangle(args[0], args[1]);
            var deltaAngle = triangle.deg - pen.bearing;
            deltaWrite(deltaAngle, output);
            output.push(["forward", triangle.c]);
            pen.bearing = triangle.deg;
        }
    });
    console.log(output)
        /*output.map(function (cmd) { return '\x1b[31m' + cmd.join(" ") + '\x1b[0m'; }).join("\n");
        var i = 0;
        var textOutput = output.map(function (cmd, index) {
            i = index;
            var cmdn = cmd.shift();
            return "\x1b[90m" + (index.toString() + ":").padStart(3, " ") + ' \x1b[31m' + cmdn.padEnd("8") + '\x1b[36m' + cmd.join("") + '\x1b[0m';
        }).join("\n");
        console.log(textOutput);
        console.log("\x1b[4mDone in \x1b[32m" + (Date.now() - startTime) + " ms\x1b[0m");*/
        /*output.forEach(cmd => {
            if (turtle) {
                if (cmd[0] == "penup") turtle.penUp()
                if (cmd[0] == "pendown") turtle.penDown()
                if (cmd[0] == "left") turtle.left(cmd[1])
                if (cmd[0] == "right") turtle.right(cmd[1])
                if (cmd[0] == "forward") turtle.forward(cmd[1])
            }
        })*/
}