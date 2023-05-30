
<script setup>
    import { reactive } from 'vue'
    const lines = reactive([])
    const angles = reactive([])
    let input = [
  [ 'right', 20.100475656834156 ],
  [ 'forward', 500.4837659704858 ],
  [ 'pendown' ],
  [ 'left', 159.36836895712497 ],
  [ 'forward', 118.76973520219703 ],
  [ 'left', 11.834668319093623 ],
  [ 'forward', 159.34004518638747 ],
  [ 'left', 22.42761839544241 ],
  [ 'forward', 146.43257834238938 ],
  [ 'left', 46.84431411456808 ],
  [ 'forward', 109.60497251493656 ],
  [ 'left', 69.17036819723386 ],
  [ 'forward', 106.11432514038809 ],
  [ 'left', 40.96936497529285 ],
  [ 'forward', 109.7098445901734 ],
  [ 'right', 133.62253155724713 ],
  [ 'forward', 99.8060619401447 ],
  [ 'left', 38.636090375289044 ],
  [ 'forward', 81.27115109311545 ],
  [ 'left', 56.018788369938065 ],
  [ 'forward', 125.25274448090948 ],
  [ 'left', 73.88152269620912 ],
  [ 'forward', 110.99774772489755 ],
  [ 'left', 12.316574438946198 ],
  [ 'forward', 170.61726172928692 ],
  [ 'left', 25.618751333326347 ],
  [ 'forward', 148.55302083767936 ],
  [ 'left', 6.985754471146002 ],
  [ 'forward', 94.81165540164352 ]
]
    let coords = [0,0]
    let angle = 0
    let pendown = false
    for (const cmd of input) {
        switch (cmd[0]) {
            case "pendown": 
                pendown = true
                break;
            case "penup": 
                pendown = false
                break;
            case "right": 
                angle = (angle + cmd[1]) % 360
                angles.push({
                    val: "R" + Math.round(cmd[1]*10)/10,
                    rotate:  + "deg",
                    left: coords[0],
                    top: coords[1],
                }) 
                break;
            case "left": 
                angle = (angle - cmd[1]) % 360
                angles.push({
                    val: "L" + Math.round(cmd[1]*10)/10,
                    rotate: 0 + "deg",
                    left: coords[0],
                    top: coords[1],
                })   
                break;
            case "forward": 
                lines.push({
                    pendown: pendown ? "pendown" : "penup",
                    rotate: 90 - angle + "deg",
                    width: cmd[1] + "px",
                    left: coords[0] + "px",
                    top: coords[1] + "px",
                }) 
                let radAngle = angle * Math.PI/180
                coords[0] += Math.sin(radAngle) * cmd[1]
                coords[1] += Math.cos(radAngle) * cmd[1]
                
                break;
        }
    }
    console.log(lines)
    console.log(angles)
</script>

<template>
        <div class="canvas">
            <div class="canvasinner">
                <div v-for="angled in angles" class="angledot" :style="'transform: rotate(' + angled.rotate + '); top: ' + (angled.top-5) + 'px; left: ' + (angled.left-5) + 'px;'"></div>
                <div v-for="angle in angles" class="angle" :style="'transform: rotate(' + angle.rotate + '); top: ' + (angle.top+10) + 'px; left: ' + (angle.left+10) + 'px;'">{{ angle.val }}°</div>
                <div v-for="line in lines" :class="'line ' + line.pendown" :style="'transform: rotate(' + line.rotate + '); width: ' + line.width + '; top: ' + line.top + '; left: ' + line.left + ';'"></div>
            </div>
        </div>
</template>

<style scoped lang="scss">
    .canvas {
        width: 100%;
        height: 100vh;
        position: fixed;
        background: #fff;
        top: 0;
        left: 0;
        .canvasinner {
            position: fixed;
            z-index: 100000;
            top: 20vh;
            left: 50%;
        }
        .line {
            z-index: 100;
            position: absolute;
            height: 5px;
            cursor: pointer;
            transform-origin: top left;
            border-radius: 50px;
            &.pendown {
                background: #000;
                &:hover {
                    background: rgb(206, 12, 12);
                }
            }
            &.penup {
                background: rgba(0, 0, 0, 0.15);
                &:hover {
                    background: rgb(206, 122, 12);
                }
            }
        }
        .angle {
            z-index: 105;
            transform-origin: top left;
            position: absolute;
            color: rgb(12, 73, 206);
            display: block;
            background: rgba(255, 255, 255, 0.8);
            border: 1px solid #fff;
            border-radius: 50px;
            cursor: pointer;
            &:hover {
                color: rgb(7, 38, 104);
                background: #fff;
            }
        }
        .angledot {
            z-index: 110;
            position: absolute;
            background: rgb(12, 73, 206);
            cursor: pointer;
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50px;
            &:hover {
                background: rgb(7, 38, 104);
            }
        }
    }
</style>
