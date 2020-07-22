import express from "express"
import socketio from 'socket.io'
import http from 'http'
import createGame from './public/game.js'
const game = createGame()

const app = express()
const server = http.createServer(app)
const sockets = socketio(server)

const players = {
}

game.subscribe((command) => {
  console.log(`> Emitting ${command.type}`)
  sockets.emit(command.type, command)
})

sockets.on("connection", (socket) => {
  const playerId = socket.id
  console.log(`> Player connected: ${playerId}`)

  var countViewers = 1

  if (!players["Player 1"]) {
    players["Player 1"] = playerId
    game.addPlayer({ playerId: playerId, playerX: 10, playerY: 315 })
  } else if (!players["Player 2"]) {
    players["Player 2"] = playerId
    game.addPlayer({ playerId: playerId, playerX: 1250, playerY: 315 })
    game.addBall({ ballId: 1, x: 640, y: 360, dir: +1 })
    game.start({ player1: players["Player 1"], player2: players["Player 1"] })
  } else {
    players[`Viwers ${countViewers}`] = playerId
    countViewers = countViewers + 1
  }
  socket.emit('setup', game.state)

  socket.on('disconnect', () => {
    console.log(`> Player disconnected: ${playerId}`)
    game.removePlayer({ playerId })

    for (const player in players) {
      if (players[player] == playerId) {
        console.log(players[player])
        delete players[player]
        game.removeBall({ ballId: 1 })
      }
    }
  })

  socket.on('move-player', (command) => {
    command.playerId = playerId
    command.type = 'move-player'

    game.movePlayer(command)
  })

})



app.use(express.static("public"))

server.listen(3333, () => {
  console.log("Server is online on port 3333.")
})