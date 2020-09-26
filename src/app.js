import * as THREE from '../node_modules/three/build/three.module.js'
import * as Drawer from './drawer.js'
import * as GameLogic from './gamelogic.js'

let scene
let camera
let renderer

let group
let paddle
let bricks
let ball

let direction

function handleKeypress(event) {
    let key = event.key.toLowerCase()
    switch (key) {
        case 'r':
            scene.remove(...scene.children)
            setVariables()
            break
    }
}

function setVariables() {
    group = new THREE.Group();

    paddle = Drawer.drawPaddle()
    bricks = Drawer.drawBricks()
    ball = Drawer.drawBall()

    group.add(paddle)
    bricks.forEach(brick => group.add(brick))

    scene.add(ball)
    scene.add(group)

    direction = GameLogic.generateDirection()

    renderer.render(scene, camera)
}

function init() {
    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    renderer = new THREE.WebGLRenderer()

    renderer.setSize(window.innerHeight - 20, window.innerHeight - 20)
    document.body.appendChild(renderer.domElement)

    setVariables()

    animate()
}

function animate() {
    requestAnimationFrame(animate);

    GameLogic.calculateFrame(ball, paddle, bricks, group, direction, camera)

    renderer.render(scene, camera)
}

window.addEventListener("keypress", handleKeypress)

export { init }
