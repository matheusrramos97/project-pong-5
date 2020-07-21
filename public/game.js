export default function createGame() {
  const state = {
    players: {},
    balls: {},
    screen: {
      width: 1280,
      height: 720
    }
  }

  function addBall(ballId, x, y, dir) {
    state.balls[ballId] = {
      x,
      y,
      size: 20,
      ballSpeedX: 10 * dir,
      ballSpeedY: 10 * dir
    }
  }

  function addPlayer(playerId, x, y) {
    state.players[playerId] = {
      x,
      y,
      width: 20,
      height: 90,
      playerSpeed: 10,
      score: 0
    }
  }

  function moveBall(ballId) {

    const ball = state.balls[ballId]
    const player2 = state.players[2]
    const player1 = state.players[1]

    if (!ball) { return }

    ball.x = ball.x + ball.ballSpeedX
    ball.y = ball.y + ball.ballSpeedY

    if (ball.x + ball.size >= player2.x
      && ball.y <= player2.y + player2.height
      && ball.y >= player2.y) {

      ball.ballSpeedX = -ball.ballSpeedX

    }

    if (ball.x < player1.x + player1.width &&
      ball.y + ball.size > player1.y &&
      ball.y < player1.y + player1.height) {

      ball.ballSpeedX = -ball.ballSpeedX

    }

    if (ball.y + ball.size > state.screen.height) {
      ball.ballSpeedY = -ball.ballSpeedY
    }

    if (ball.y / 2 < 0) {
      ball.ballSpeedY = -ball.ballSpeedY
    }
  }

  function removeBall(ballId) {

    const ball = state.balls[ballId]

    if (!ball) { return }

    delete state.balls[ballId]

  }

  function movePlayer(keyPressed) {

    const player1 = state.players[1]
    const player2 = state.players[2]

    if ((keyPressed == "w") && (player1.y - 1 >= 0)) {
      player1.y = player1.y - player1.playerSpeed
    }
    if (keyPressed == "s" && (player1.y + player1.height + 1 < state.screen.height)) {
      player1.y = player1.y + player1.playerSpeed
    }

    if (keyPressed == "ArrowUp" && (player2.y - 1 >= 0)) {
      player2.y -= player2.playerSpeed
    }
    if (keyPressed == "ArrowDown" && (player2.y + player2.height + 1 < state.screen.height)) {
      player2.y += player2.playerSpeed
    }

  }

  function score() {

    const player1 = state.players[1]
    const player2 = state.players[2]

    for (const ballId in state.balls) {

      const ball = state.balls[ballId]

      if (ball.x + ball.size > state.screen.width) {
        player1.score += 1
        //console.log("Player 1 Score: " + player1.score)
        removeBall(ballId)
        addBall(1, 640, 360, -1)
      }

      if (ball.x / 2 < 0) {
        player2.score += 1
        //console.log("Player 2 Score: " + player2.score)
        removeBall(ballId)
        addBall(1, 640, 360, +1)
      }

    }

  }

  function collision() {
    score()

  }

  return {
    state,
    addBall,
    addPlayer,
    moveBall,
    movePlayer,
    collision
  }
}