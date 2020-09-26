import * as THREE from '../node_modules/three/build/three.module.js'

const DIRECTION_SPEED = 0.01

function generateDirection() {
    let xSpeed = Math.random() * DIRECTION_SPEED * 2 - DIRECTION_SPEED
    let ySpeed = Math.sqrt(Math.pow(DIRECTION_SPEED, 2) - Math.pow(xSpeed, 2))
    return new THREE.Vector2(xSpeed, ySpeed)
}

function calculateFrame(ball, paddle, bricks, group, direction) {
    ball.position.x += direction.x
    ball.position.y += direction.y
}

export { generateDirection, calculateFrame }
