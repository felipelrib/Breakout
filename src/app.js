import * as THREE from '../node_modules/three/build/three.module.js'
import * as Drawer from './drawer.js'
import * as GameLogic from './gamelogic.js'

const LEFT_MOUSE_BTN = 0
const RIGHT_MOUSE_BTN = 2

let scene
let camera
let renderer

let group
let paddle
let bricks
let ball

let direction

let gamePaused
let gameFinished
let animationId

function restartGame() {
    if (!gameFinished) {
        scene.remove(...scene.children)
        setVariables()
    }
}

function finishGame() {
    if (!gameFinished) {
        cancelAnimationFrame(animationId);
        renderer.forceContextLoss();
        renderer.domElement = null;
        renderer = null;
        scene = null;
        camera = null;
        renderer = null;
        gameFinished = true
    }
}

function toggleGamePause() {
    gamePaused = !gamePaused
}

function handleKeypress(event) {
    let key = event.key.toLowerCase()
    switch (key) {
        case 'r':
            restartGame()
            break
        case 'q':
            finishGame()
    }
}

function handleMouseClick(event) {
    let btn = event.button
    switch (btn) {
        case LEFT_MOUSE_BTN:
            toggleGamePause()
            break
        case RIGHT_MOUSE_BTN:
            break
    }
}

function setVariables() {
    gamePaused = true
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
    animationId = requestAnimationFrame(animate);

    let { playerScore, playerLives } = GameLogic.getPlayerInfo()
    if (!gamePaused && playerLives > 0 && playerScore <= Drawer.BRICK_ROWS_AMOUNT * Drawer.BRICK_COLUMNS_AMOUNT) {
        GameLogic.calculateFrame(ball, paddle, bricks, group, direction, camera)
    }

    renderer.render(scene, camera)
}


window.addEventListener("contextmenu", e => e.preventDefault()) // For handling non-left clicks
window.addEventListener("keypress", handleKeypress)
window.addEventListener("mousedown", handleMouseClick)

export { init }
