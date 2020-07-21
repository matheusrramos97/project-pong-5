export default function createKeyboardListener(document, game) {
  document.addEventListener('keydown', handleKeydown)
  function handleKeydown(event) {
    const keyPressed = event.key
    game.movePlayer(keyPressed)
  }
}