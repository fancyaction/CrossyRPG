import 'phaser';

// create new scene named "Game"
let gameScene = new Phaser.Scene('Game');

let config = {
  type: Phaser.AUTO,
  width: 640,
  height: 360,
  scene: gameScene
};

// create game with config
let game = new Phaser.Game(config);

// load assets
gameScene.preload = function() {
  this.load.image('bg', 'src/assets/images/background.png');
  this.load.image('player', 'src/assets/images/player.png');
  this.load.image('dragon', 'src/assets/images/dragon.png');
  this.load.image('treasure', 'src/assets/images/treasure.png');
};

// executed once, after assets were loaded
gameScene.create = function() {
  this.add.sprite(0, 0, 'bg').setOrigin(0, 0);

  this.player = this.add
    .sprite(40, this.sys.game.config.height / 2, 'player')
    .setScale(0.5);
};
