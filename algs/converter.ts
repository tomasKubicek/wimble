//SVG -> Turtle Graphics Converter
// Podporuje následující SVG commandy: (velké písmeno = absolutní souřadnice, malé písmeno = relativní souřadnice)
//
// - M,m - přesuň se na souřadnice                   - zvedne tužku, otočí se a dojede na souřadnice      - parametry: x,y (abs/rel)
// - L,l - udělej čáru na souřadnice                 - položí tužku, otočí se a dojede na souřadnice      - parametry: x,y (abs/rel)
// - Z,z - dojeď zpět na start (0,0)                 - položí tužku, otočí se a dojede na souřadnice 0,0  - bez parametrů (bez rozdílu abs/rel)
// - H,h - udělej horizontální čáru na souřadnici x  - položí tužku, otočí se a dojede na souřadnici x    - parametry: x (abs/rel)
// - V,v - udělej vertikální čáru na souřadnici y    - položí tužku, otočí se a dojede na souřadnici y    - parametry: y (abs/rel)
// - Z,z - dojeď zpět na start (0,0)                 - položí tužku, otočí se a dojede na souřadnice 0,0  - bez parametrů (bez rozdílu abs/rel)

interface TrianglePath {
    c: number,
    deg: number
}
interface Pen {
    coords: number[],
    bearing: number,
    down: boolean
}

function calcTriangle(a: number, b: number) : TrianglePath {
    const c : number = Math.sqrt(a * a + b * b)
    let deg : number = (Math.atan(a / b) * 180 / Math.PI)
    if (b < 0) {
        deg += 180
    }
    return { c, deg }
}

function isValid(letter : string, valid:string[]) : boolean {
    if (/^\d$/.test(letter) || letter == " " || letter == ",") return false
    for (const validLetter of valid) {
        if (letter == validLetter) return true
    }
    return false
}

function deltaWrite (deltaAngle: number, output: any[][]) {
    if (deltaAngle < 0) {
        output.push(["left", -deltaAngle])
    } else if (deltaAngle <= 180) {
        output.push(["right", deltaAngle])
    } else if (deltaAngle > 180) {
        output.push(["left", 360 - deltaAngle])
    }
}

function draw(pen : Pen, coords : number[], draw: boolean, output: any[][]) : void {
    if (draw && !pen.down) {
        output.push(["pendown"]);
        pen.down = true;
    } else if (!draw && pen.down) {
        output.push(["penup"]);
        pen.down = false;
    }
    let triangle = calcTriangle(coords[0], coords[1]);
    const deltaAngle = triangle.deg - pen.bearing
    deltaWrite(deltaAngle, output)
    output.push(["forward", triangle.c])
    pen.bearing = triangle.deg
}

let accuracy = 40
let rn = ["x","y"]
function cubicBezier(P0: number[], P1: number[], P2: number[], P3: number[]) {
    let res : number[][] = []
    for (let t = 0; t <= accuracy; t++) {
        for (let i = 0; i < P0.length; i++) {
            res[t][rn[i]] = (Math.round(((-P0[i] + 3*P1[i] - 3*P2[i] + P3[i]) * t*t*t + (3*P0[i] - 6*P1[i] + 3*P2[i]) * t*t + (3*P1[i] - 3*P0[i]) * t + P0[i])*1000)/1000)
        }
    }    
    return res
}
function quadBezier(P0: number[], P1: number[], P2: number[]) {
    let res : number[][] = []
    for (let t = 0; t <= accuracy; t++) {
        for (let i = 0; i < P0.length; i++) {
            res[t][rn[i]] = (Math.round(((P0[i] - 2*P1[i] + P2[i]) * t*t + (2*P1[i] - 2*P0[i]) * t + P0[i])*1000)/1000)
        }
    }    
    return res
}

main()

function main() {

    const startTime = Date.now()
    const path = "M90.5 0V77.5M156 0V77.5M1 77.5L59 182.5H212L256 77.5"
    const valid = ["M", "m", "L", "l", "H", "h", "V", "v", "C", "c", "S", "s", "Q", "q", "T", "t", "A", "a", "Z", "z"]
    const commands : string[] = []
    let lastCommand: string = ""

    for (const letter of path) {
        if (isValid(letter, valid) && lastCommand.length > 0) {
            commands.push(lastCommand)
            lastCommand = ""
        }
        lastCommand += letter
    }
    commands.push(lastCommand)

    const output : any[][] = []
    const pen : Pen = {
        coords: [0, 0],
        bearing: 0,
        down: false
    }
    commands.forEach(command => {
        let args : number[] = command.slice(1).split(" ").map(x => parseFloat(x))
        if (command[0] == "L") {
            let newArgs = [args[0] - pen.coords[0], args[1] - pen.coords[1]]
            pen.coords = [args[0], args[1]]
            draw(pen, newArgs, true, output)
        } else if (command[0] == "M") {
            let newArgs = [args[0] - pen.coords[0], args[1] - pen.coords[1]]
            pen.coords = [args[0], args[1]]
            draw(pen, newArgs, false, output)
        } else if (command[0] == "H") {

            let newArg = Math.abs(args[0] - pen.coords[0])
            pen.coords[0] = args[0]

            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            }
            let deg = newArg < 0 ? 90 : -90

            const deltaAngle = deg - pen.bearing
            deltaWrite(deltaAngle, output)
            output.push(["forward", newArg])

            pen.bearing = deg
        } else if (command[0] == "V") {

            let newArg = Math.abs(args[0] - pen.coords[1])
            pen.coords[1] = args[0]

            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            }
            let deg = newArg < 0 ? 180 : 0

            const deltaAngle = deg - pen.bearing
            deltaWrite(deltaAngle, output)

            output.push(["forward", newArg])

            pen.bearing = deg
        } else if (command[0] == "Z" || command[0] == "z") {

            let newArgs = [0, 0]
            pen.coords = [args[0], args[1]]

            draw(pen, newArgs, true, output)
        } else if (command[0] == "l") {
            pen.coords = [pen.coords[0] + args[0], pen.coords[0] + args[1]]

            if (!pen.down) {
                output.push(["pendown"]);
                pen.down = true;
            };

            let triangle = calcTriangle(args[0], args[1]);

            const deltaAngle = triangle.deg - pen.bearing
            deltaWrite(deltaAngle, output)
            output.push(["forward", triangle.c])

            pen.bearing = triangle.deg
        } else if (command[0] == "m") {
            pen.coords = [pen.coords[0] + args[0], pen.coords[0] + args[1]]

            if (pen.down) {
                output.push(["penup"]);
                pen.down = false;
            }
            let triangle = calcTriangle(args[0], args[1]);

            const deltaAngle = triangle.deg - pen.bearing
            deltaWrite(deltaAngle, output)
            output.push(["forward", triangle.c])

            pen.bearing = triangle.deg
        }
    })



    output.map(cmd => '\x1b[31m' + cmd.join(" ") + '\x1b[0m').join("\n")
    let i = 0
    const textOutput = output.map((cmd, index) => {
        i = index
        let cmdn = cmd.shift()
        return "\x1b[90m" + (index.toString() + ":").padStart(3, " ") + ' \x1b[31m' + cmdn.padEnd("8") + '\x1b[36m' + cmd.join("") + '\x1b[0m'
    }).join("\n")
    console.log(textOutput);

    console.log("\x1b[4mDone in \x1b[32m" + (Date.now() - startTime) + " ms\x1b[0m");

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