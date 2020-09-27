import * as THREE from '../node_modules/three/build/three.module.js'
import * as Drawer from './drawer.js'
import * as GameLogic from './gamelogic.js'

const LEFT_MOUSE_BTN = 0
const RIGHT_MOUSE_BTN = 2

// Make it square to prevent ball radius distortion.
const RENDER_HEIGTH = window.innerHeight - 80
const RENDER_WIDTH = RENDER_HEIGTH

let scene
let camera
let renderer

let group
let paddle
let bricks
let ball

let ballDirection
let paddleDirection

let gamePaused
let gameFinished
let animationId

function restartGame() {
    if (!gameFinished) {
        scene.remove(...scene.children)
        setVariables()
        setInitialScoreAndLivesOnScreen()
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

// Checks if there's more than one right click before another left click
let subsequentRightClick = false

// When game begins, right clicking first does nothing.
let previousClickLeft = false

function handleMouseClick(event) {
    let btn = event.button
    switch (btn) {
        case RIGHT_MOUSE_BTN:

            // Only treats this case when user is constantly right clicking or
            // when user right clicks, the game wasn't paused by a left click
            if((previousClickLeft && !gamePaused) || subsequentRightClick) {
                toggleGamePause()
                if(subsequentRightClick) {
                    let events = GameLogic.calculateFrame(ball, paddle, bricks, group, ballDirection, paddleDirection, camera)

                    // So that the ball won't bounce off the lower edge in case the user clicks at just the 'right' time
                    if(events.playerLostLife) {
                        resetBallPosition()
                        break
                    }
                    toggleGamePause()
                    console.clear()
                }
                printGameStats()
                subsequentRightClick = true
                previousClickLeft = false
            }
            break
        case LEFT_MOUSE_BTN:
            toggleGamePause()
            previousClickLeft = true
            subsequentRightClick = false
            console.clear()
            break
    }
}

function handleMouseMove(event) {
    paddleDirection = GameLogic.getPaddleDirection(event.clientX, RENDER_WIDTH)
}

function resetBallPosition() {
    gamePaused = true

    scene.remove(ball)
    group.remove(paddle)

    ball = Drawer.drawBall()
    paddle = Drawer.drawPaddle()

    scene.add(ball)
    group.add(paddle)

    ballDirection = GameLogic.generateBallDirection()
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

    ballDirection = GameLogic.generateBallDirection()
    paddleDirection = paddleDirection || GameLogic.getPaddleDirection()

    GameLogic.resetPlayerInfo()

    renderer.render(scene, camera)
}

function setInitialScoreAndLivesOnScreen() {
    document.querySelector('#player-stats').style.width = `${RENDER_WIDTH}px`
    document.querySelector('#player-stats h1').innerText = `0 ${GameLogic.MAX_AMOUNT_BALLS}`
}

function printPlayerStats(playerScore, playerLives) {
    document.getElementById('player-stats').classList.remove('hide')
    document.querySelector('#player-stats h1').innerText = `${playerScore} ${playerLives}`
}

function printGameStats() {
    let ballX = ball.position.x
    let ballY = ball.position.y
    let theBricks = group.children.filter(child => child != paddle)
    let thePaddle = group.children.find(child => child === paddle)

    theBricks.forEach(brick => {
        let { x, y } = brick.position
        console.log('Coordenadas tijolo: ', x.toPrecision(8), y.toPrecision(8))
    })
    let { x, y } = thePaddle.position
    console.log('Velocidade do paddle: ', (paddleDirection.x * GameLogic.PADDLE_MAX_SPEED).toPrecision(8))
    console.log('Coordenadas (x, y) do paddle: ', x.toPrecision(8), y.toPrecision(8))

    console.log('Coordenadas (x, y) da bola: ', ballX.toPrecision(8), ballY.toPrecision(8));
}

function init() {
    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    renderer = new THREE.WebGLRenderer()

    renderer.setSize(RENDER_WIDTH, RENDER_HEIGTH)
    document.getElementById('game').appendChild(renderer.domElement)

    setInitialScoreAndLivesOnScreen()
    setVariables()

    animate()
}

function animate() {
    animationId = requestAnimationFrame(animate);
    let events = {}
    let { playerScore, playerLives } = GameLogic.getPlayerInfo() // To check if game is not over yet
    if (!gamePaused && playerLives > 0 && playerScore <= Drawer.BRICK_ROWS_AMOUNT * Drawer.BRICK_COLUMNS_AMOUNT) {
        events = GameLogic.calculateFrame(ball, paddle, bricks, group, ballDirection, paddleDirection, camera)
    }

    // After a frame moved
    playerScore = GameLogic.getPlayerInfo()['playerScore']
    playerLives = GameLogic.getPlayerInfo()['playerLives']
    if(events.playerScoreChanged)
        printPlayerStats(playerScore, playerLives)
    if (events.playerLostLife) {
        resetBallPosition()
        printPlayerStats(playerScore, playerLives)
    }

    renderer.render(scene, camera)
}


window.addEventListener("contextmenu", e => e.preventDefault()) // For handling non-left clicks
window.addEventListener("keypress", handleKeypress)
window.addEventListener("mousedown", handleMouseClick)
window.addEventListener("mousemove", handleMouseMove)

export { init }
