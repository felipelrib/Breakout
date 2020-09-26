import * as THREE from '../node_modules/three/build/three.module.js'

const BALL_SPEED = 0.01
const PADDLE_MAX_SPEED = 0.02
const MAX_AMOUNT_BALLS = 5
const raycaster = new THREE.Raycaster()

let playerLives = MAX_AMOUNT_BALLS
let playerScore = 0

// Returns score and remaining lives of player in a game
function getPlayerInfo() {
    return {
        'playerLives': playerLives,
        'playerScore': playerScore
    }
}

function resetPlayerInfo() {
    playerLives = MAX_AMOUNT_BALLS
    playerScore = 0
}

function generateBallDirection() {
    let xDirection = Math.random() * 2 - 1
    let yDirection = Math.sqrt(1 - Math.pow(xDirection, 2))
    return new THREE.Vector2(xDirection, yDirection)
}

function getPaddleDirection(xCursorPosition, gameWidth) {
    let xDirection
    if (xCursorPosition === undefined) {
        xDirection = 0
    } else {
        xDirection = (Math.min(xCursorPosition, gameWidth) / gameWidth) * 2 - 1
    }
    return new THREE.Vector2(xDirection, 0)
}

function calculateFrame(ball, paddle, bricks, group, ballDirection, paddleDirection, camera) {
    let ballRadius = ball.geometry.parameters.radius
    let paddleWidth = paddle.geometry.parameters.width
    let ballPosition = ball.position
    let intersection = null
    let events = {
        playerLostLife: false
    }
    if ((ball.position.x - ballRadius) <= -1 || (ball.position.x + ballRadius) >= 1) {
        ballDirection.x = -ballDirection.x
    }
    if ((ball.position.y - ballRadius) <= -1 || (ball.position.y + ballRadius) >= 1) {
        // If ball hit the lower edge of the scene
        if(ball.position.y - ballRadius <= -1) {
            playerLives--
            events.playerLostLife = true
        }

        ballDirection.y = -ballDirection.y
    }

    ball.geometry.vertices.find(vertice => {
        vertice = vertice.clone()
        raycaster.setFromCamera(vertice.add(ballPosition), camera)
        let intersections = raycaster.intersectObjects(group.children)
        intersection = intersections[0]
        return intersections.length > 0
    })

    if (intersection) {
        if(bricks.includes(intersection.object))
            playerScore++

        if (intersection.object !== paddle) {
            group.remove(intersection.object)
        }
        let xDistanceThreshold = ballDirection.x * BALL_SPEED
        let yDistanceThreshold = ballDirection.y * BALL_SPEED
        let vertices = intersection.object.geometry.vertices
        let topLeftVertice = vertices[0].clone().add(intersection.object.position)
        let bottomRightVertice = vertices[3].clone().add(intersection.object.position)
        if (intersection.point.x - xDistanceThreshold < topLeftVertice.x || intersection.point.x - xDistanceThreshold > bottomRightVertice.x) {
            ballDirection.x = -ballDirection.x
        }
        if (intersection.point.y - yDistanceThreshold > topLeftVertice.y || intersection.point.y - yDistanceThreshold < bottomRightVertice.y) {
            ballDirection.y = -ballDirection.y
        }
    }

    ball.position.x += ballDirection.x * BALL_SPEED
    ball.position.y += ballDirection.y * BALL_SPEED

    // Prevent the paddle to go over the wall.
    if (paddleDirection.x < 0) {
        paddle.position.x = Math.max(paddle.position.x + paddleDirection.x * PADDLE_MAX_SPEED, -1 + paddleWidth / 2)
    } else {
        paddle.position.x = Math.min(paddle.position.x + paddleDirection.x * PADDLE_MAX_SPEED, 1 - paddleWidth / 2)
    }

    return events
}

export { generateBallDirection, getPaddleDirection, calculateFrame, getPlayerInfo, resetPlayerInfo }
