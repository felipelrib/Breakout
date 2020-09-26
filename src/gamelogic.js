import * as THREE from '../node_modules/three/build/three.module.js'

const DIRECTION_SPEED = 0.01

function generateDirection() {
    let xSpeed = Math.random() * DIRECTION_SPEED * 2 - DIRECTION_SPEED
    let ySpeed = Math.sqrt(Math.pow(DIRECTION_SPEED, 2) - Math.pow(xSpeed, 2))
    return new THREE.Vector2(xSpeed, ySpeed)
}

function calculateFrame(ball, paddle, bricks, group, direction) {
    let ballRadius = ball.geometry.parameters.radius
    if ((ball.position.x - ballRadius) <= -1 || (ball.position.x + ballRadius) >= 1) {
        direction.x = -direction.x
    }
    if ((ball.position.y - ballRadius) <= -1 || (ball.position.y + ballRadius) >= 1) {
        direction.y = -direction.y
    }
    ball.position.x += direction.x
    ball.position.y += direction.y
}

export { generateDirection, calculateFrame }
