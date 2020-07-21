export default function renderScreen(screen, game) {
  const context = screen.getContext("2d")
  const gameWidth = screen.width
  const gameHeight = screen.height

  context.clearRect(0, 0, gameWidth, gameHeight)

  for (const ballsId in game.state.balls) {
    const ball = game.state.balls[ballsId]
    context.fillStyle = 'black'
    context.fillRect(ball.x, ball.y, ball.size, ball.size)
  }

  for (const playersId in game.state.players) {
    const player = game.state.players[playersId]
    context.fillStyle = 'black'
    context.fillRect(player.x, player.y, player.width, player.height)
  }

  game.moveBall(1)
  game.moveBall(2)
  game.collision()

  context.font = "30px Arial";
  context.fillText(`Player 1 Score: ${game.state.players[1].score}`, (game.state.screen.width / 2) - 260, 50);
  context.fillText(`Player 2 Score: ${game.state.players[2].score}`, (game.state.screen.width / 2) + 10, 50);

  context.beginPath();
  context.moveTo(640, 0);
  context.lineTo(640, 720);
  context.stroke();

  requestAnimationFrame(() => {
    renderScreen(screen, game, requestAnimationFrame)
  })

}   