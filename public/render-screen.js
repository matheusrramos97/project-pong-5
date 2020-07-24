export default function renderScreen(screen, game, currentPlayerId) {
  const context = screen.getContext("2d")

  context.clearRect(0, 0, game.state.screen.width, game.state.screen.height)

  for (const balls in game.state.ball) {
    const ball = game.state.ball[balls]
    context.fillStyle = 'black'
    context.fillRect(ball.x, ball.y, ball.size, ball.size)
  }

  for (const playersId in game.state.players) {
    const currentPlayer = game.state.players[currentPlayerId]
    const player = game.state.players[playersId]

    context.font = "30px Arial";

    if (currentPlayer == player) {
      context.fillStyle = '#F0DB4F'

    } else {
      context.fillStyle = 'black'

    }
    context.fillRect(player.x, player.y, player.width, player.height)
  }

  for (const player in game.state.config) {

    const player1Id = game.state.config.player1
    const player2Id = game.state.config.player2

    if (player1Id == currentPlayerId) {
      context.fillStyle = '#F0DB4F'
      context.fillText(`Player 1 Score: ${game.state.players[player1Id].score}`, (game.state.screen.width / 2) - 260, 50);

    } else {
      context.fillStyle = 'black'
      context.fillText(`Player 1 Score: ${game.state.players[player1Id].score}`, (game.state.screen.width / 2) - 260, 50);
    }

    if (player2Id == currentPlayerId) {
      context.fillStyle = '#F0DB4F'
      context.fillText(`Player 2 Score: ${game.state.players[player2Id].score}`, (game.state.screen.width / 2) + 10, 50);

    } else {
      context.fillStyle = 'black'
      context.fillText(`Player 2 Score: ${game.state.players[player2Id].score}`, (game.state.screen.width / 2) + 10, 50);
    }

  }

  context.beginPath();
  context.moveTo(640, 0);
  context.lineTo(640, 720);
  context.stroke();

  requestAnimationFrame(() => {
    renderScreen(screen, game, currentPlayerId, requestAnimationFrame)
  })

}   