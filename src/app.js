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

    camera.position.set(0, 0, 1);
    camera.lookAt(0, 0, 0);

    setVariables()

    animate()
}

function animate() {
    requestAnimationFrame(animate);

    GameLogic.calculateFrame(ball, paddle, bricks, group, direction)

    renderer.render(scene, camera)
}

export { init }
