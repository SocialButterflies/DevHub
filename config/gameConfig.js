import Phaser from 'phaser'
import SceneMain from '../client/components/scene'

const config = {
  type: Phaser.AUTO,
  parent: 'theGame',
  width: window.innerHeight * 0.85, // because the board is square (equal number of spaces on all sides)
  height: window.innerHeight * 0.85,
  resizeInterval: 800,
  scene: [SceneMain]
}

export default config