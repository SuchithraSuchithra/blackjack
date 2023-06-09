const SOUNDS = {
  welcome: './sounds/welcome.mp3',
}

const PLAYER = new Audio()

window.onload = function () {
  playSound('welcome')
}

function playSound(soundSourceKey) {
  PLAYER.src = SOUNDS[soundSourceKey]
  PLAYER.play()
}
