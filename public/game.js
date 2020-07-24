export default function createGame() {
  const state = {
    players: {},
    ball: {},
    screen: {
      width: 1280,
      height: 720
    },
    config: {}
  }

  const observers = []

  function start(command) {

    console.log(state.players)

    setInterval(() => gameStarted(), 10)

    function gameStarted() {
      if (state.ball[1] && state.players[command.player1] && state.players[command.player1]) {
        calcMoveBall(1, command.player1, command.player2)
      }
    }

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

  function addBall() {

    const ball = 1
    const x = 640
    const y = 360

    state.ball[ball] = {
      x,
      y,
      size: 20,
      speed: 5,
      dirX: 1,
      dirY: 1
    }

    notifyAll({
      type: 'add-ball',
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

  function calcMoveBall(Ball, Player1, Player2) {

    if (!Ball && !Player1 && !Player2) { return }

    const ball = state.ball[Ball]
    const player1 = state.players[Player1]
    const player2 = state.players[Player2]
    const dirX = ball.dirX
    const dirY = ball.dirY
    var NewDirX = dirX
    var NewDirY = dirY


    if (Object.keys(state.players).length < 2) { return }

    if ((ball.x + ball.size + ball.speed) > (state.screen.width)) {
      NewDirX = - dirX
      addScore({ player: Player1 })
      console.log("Player 1 Score: " + player1.score)
    } else if (((ball.x + ball.size) >= (player2.x)) && ((ball.y) > (player2.y)) && ((ball.y + ball.size) < (player2.y + player2.height))) {
      NewDirX = - dirX
    }

    if ((ball.x + ball.speed) < 0) {
      NewDirX = -dirX
      addScore({ player: Player2 })
      console.log("Player 2 Score: " + player2.score)
    } else if (ball.x < player1.x + player1.width &&
      ball.y + ball.size > player1.y &&
      ball.y < player1.y + player1.height) {
      NewDirX = - dirX
    }

    if ((ball.y + ball.size + ball.speed) > state.screen.height) {
      NewDirY = - dirY
    }
    if ((ball.y + ball.speed) < 0) {
      NewDirY = - dirY
    }

    var NewBallX = ball.x + ball.speed * NewDirX
    var NewBallY = ball.y + ball.speed * NewDirY

    moveBall({ NewBallX, NewBallY, NewDirX, NewDirY })
  }

  function moveBall(command) {

    const newBallX = command.NewBallX
    const newBallY = command.NewBallY
    const newDirX = command.NewDirX
    const newDirY = command.NewDirY


    const ball = state.ball[1]

    ball.x = newBallX
    ball.y = newBallY
    ball.dirX = newDirX
    ball.dirY = newDirY

    notifyAll({
      type: 'move-ball',
      NewBallX: newBallX,
      NewBallY: newBallY,
      newDirX,
      newDirY
    })
  }

  function removeBall() {

    delete state.ball[1]

    notifyAll({
      type: 'remove-ball',
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

  function addScore(command) {
    const player = command.player

    state.players[player].score++

    notifyAll({
      type: 'add-score',
      player
    })
  }

  function setPlayers(command) {

    const player1 = command.player1
    const player2 = command.player2

    state.config = {
      player1: command.player1,
      player2: command.player2
    }

    notifyAll({
      type: 'set-players',
      player1,
      player2
    })
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
    start,
    addScore,
    setPlayers
  }
}