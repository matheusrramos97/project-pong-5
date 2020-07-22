export default function createGame() {
  const state = {
    players: {},
    balls: {},
    screen: {
      width: 1280,
      height: 720
    }
  }

  const observers = []

  function start(command) {

  }

  function subscribe(observerFunction) {
    observers.push(observerFunction)
  }

  function notifyAll(command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }


  function setState(newState) {
    Object.assign(state, newState)
  }

  function addBall(command) {

    const ballId = command.ballId
    const x = command.x
    const y = command.y
    const dir = command.dir

    state.balls[ballId] = {
      x,
      y,
      size: 20,
      ballSpeedX: 10 * dir,
      ballSpeedY: 10 * dir
    }

    notifyAll({
      type: 'add-ball',
      ballId: ballId,
      x: x,
      y: y,
      dir: dir,
    })

  }

  function addPlayer(command) {
    const playerId = command.playerId
    const playerX = command.playerX
    const playerY = command.playerY

    state.players[playerId] = {
      x: playerX,
      y: playerY,
      width: 20,
      height: 90,
      playerSpeed: 10,
      score: 0,
    }

    notifyAll({
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
      width: 20,
      height: 90,
      playerSpeed: 10,
      score: 0
    })
  }

  function removePlayer(command) {
    const playerId = command.playerId

    delete state.players[playerId]

    notifyAll({
      type: 'remove-player',
      playerId: playerId
    })
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

  function removeBall(command) {

    const ballId = command.ballId

    delete state.balls[ballId]

    notifyAll({
      type: 'remove-ball',
      ballId: ballId
    })

  }

  function movePlayer(command) {
    notifyAll(command)

    const acceptedMoves = {
      ArrowUp(player) {
        if (player.y - 1 >= 0) {
          player.y = player.y - player.playerSpeed
        }
      },
      ArrowDown(player) {
        if (player.y + player.height < state.screen.height) {
          player.y = player.y + player.playerSpeed
        }
      },
    }

    const keyPressed = command.keyPressed
    const playerId = command.playerId
    const player = state.players[playerId]
    const moveFunction = acceptedMoves[keyPressed]

    if (player && moveFunction) {
      moveFunction(player)
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

  return {
    state,
    addBall,
    removeBall,
    addPlayer,
    removePlayer,
    moveBall,
    movePlayer,
    start,
    setState,
    subscribe,
    start
  }
}