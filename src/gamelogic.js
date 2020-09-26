import * as THREE from '../node_modules/three/build/three.module.js'

const DIRECTION_SPEED = 0.01
const MAX_AMOUNT_BALLS = 5
const PADDLE_MAX_SPEED = 2 
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

function generateDirection() {
    let xDirection = Math.random() * 2 - 1
    let yDirection = Math.sqrt(1 - Math.pow(xDirection, 2))
    return new THREE.Vector2(xDirection, yDirection)
}

function calculateFrame(ball, paddle, bricks, group, direction, camera) {
    let ballRadius = ball.geometry.parameters.radius
    let ballPosition = ball.position
    let intersection = null
    if ((ball.position.x - ballRadius) <= -1 || (ball.position.x + ballRadius) >= 1) {
        direction.x = -direction.x
    }
    if ((ball.position.y - ballRadius) <= -1 || (ball.position.y + ballRadius) >= 1) {
        // If ball hit the lower edge of the scene
        if(ball.position.y - ballRadius <= -1)
            playerLives--

        direction.y = -direction.y
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
        let xDistanceThreshold = direction.x * DIRECTION_SPEED
        let yDistanceThreshold = direction.y * DIRECTION_SPEED
        let vertices = intersection.object.geometry.vertices
        let topLeftVertice = vertices[0].clone().add(intersection.object.position)
        let bottomRightVertice = vertices[3].clone().add(intersection.object.position)
        if (intersection.point.x - xDistanceThreshold < topLeftVertice.x || intersection.point.x - xDistanceThreshold > bottomRightVertice.x) {
            direction.x = -direction.x
        }
        if (intersection.point.y - yDistanceThreshold > topLeftVertice.y || intersection.point.y - yDistanceThreshold < bottomRightVertice.y) {
            direction.y = -direction.y
        }
    }

    ball.position.x += direction.x * DIRECTION_SPEED
    ball.position.y += direction.y * DIRECTION_SPEED
}

export { generateDirection, calculateFrame, getPlayerInfo }
