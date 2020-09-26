import * as THREE from '../node_modules/three/build/three.module.js'

// The heights and widths are always defined as proportion of the screen.
const SCREEN_SIZE = 2

const PADDLE_HEIGHT = 0.05
const PADDLE_WIDTH = 0.2
const PADDLE_BOTTOM = -0.8

const BRICK_WIDTH = 0.12
const BRICK_HEIGHT = 0.05
const BRICK_ROWS_AMOUNT = 8
const BRICK_COLUMNS_AMOUNT = 12
const BRICK_WALL_PADDING = 0.1
const BRICK_HORIZONTAL_PADDING = (SCREEN_SIZE - ((2 * BRICK_WALL_PADDING) + (BRICK_COLUMNS_AMOUNT * BRICK_WIDTH))) / (BRICK_COLUMNS_AMOUNT - 1)
const BRICK_VERTICAL_PADDING = 0.02

const BALL_RADIUS = 0.025
const BALL_BOTTOM = -0.6


function drawPaddle() {
    let material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    let geometry = new THREE.PlaneGeometry(PADDLE_WIDTH, PADDLE_HEIGHT);
    let paddle = new THREE.Mesh(geometry, material);
    paddle.position.y = PADDLE_BOTTOM
    return paddle
}

function drawBall() {
    let material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
    let geometry = new THREE.CircleGeometry(BALL_RADIUS, 32);
    let ball = new THREE.Mesh(geometry, material);
    ball.position.y = BALL_BOTTOM
    return ball
}

function drawBricks() {
    let bricks = []
    let colors = [0x00ff00, 0xff8800, 0x0000ff]
    for (let i = 0; i < BRICK_ROWS_AMOUNT; i++) {
        for (let j = 0; j < BRICK_COLUMNS_AMOUNT; j++) {
            let hardness = i === 0 ? 2 : (i < 5 ? 1 : 0)
            let color = colors[hardness]
            let material = new THREE.MeshBasicMaterial({color, side: THREE.DoubleSide});
            let geometry = new THREE.PlaneGeometry(BRICK_WIDTH, BRICK_HEIGHT);
            let brick = new THREE.Mesh(geometry, material);
            brick.colors = colors
            brick.hardness = hardness
            brick.position.x = (-1 + BRICK_WALL_PADDING + (BRICK_WIDTH / 2)) + (j * (BRICK_HORIZONTAL_PADDING + BRICK_WIDTH))
            brick.position.y = (1 - BRICK_WALL_PADDING) - (i * (BRICK_HEIGHT + BRICK_VERTICAL_PADDING))
            bricks.push(brick)
        }
    }
    return bricks
}

export { drawPaddle, drawBall, drawBricks, BRICK_COLUMNS_AMOUNT, BRICK_ROWS_AMOUNT }
