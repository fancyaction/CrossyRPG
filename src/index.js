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

// scene parameters (custom -- not part of Phaser API)
gameScene.init = function() {
  this.playerSpeed = 1.5;
  this.enemyMaxY = 280;
  this.enemyMinY = 80;

  //end the game
  gameScene.gameOver = function() {
    // set player to dead
    this.isPlayerAlive = false;

    this.cameras.main.shake(500);

    // fade camera
    this.time.delayedCall(
      250,
      () => {
        this.cameras.main.fade(250);
      },
      [],
      this
    );
    // restart game
    this.time.delayedCall(
      500,
      () => {
        this.scene.restart();
      },
      [],
      this
    );
  };
};

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
    .setScale(0.4);

  this.isPlayerAlive = true;

  this.treasure = this.add
    .sprite(
      this.sys.game.config.width - 80,
      this.sys.game.config.height / 2,
      'treasure'
    )
    .setScale(0.6);

  this.enemies = this.add.group({
    key: 'dragon',
    repeat: 5,
    setXY: {
      x: 110,
      y: 100,
      stepX: 80,
      stepY: 20
    }
  });
  Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
  Phaser.Actions.Call(
    this.enemies.getChildren(),
    enemy => {
      enemy.speed = Math.random() * 1 + 0.5;
    },
    this
  );

  // reset camera effects
  this.cameras.main.resetFX();
};

gameScene.update = function() {
  if (!this.isPlayerAlive) {
    return;
  }

  // player movement
  // if user clicks/touches screen ...
  if (this.input.activePointer.isDown) {
    // player walks
    this.player.x += this.playerSpeed;
  }

  //   treasure collision
  if (
    Phaser.Geom.Intersects.RectangleToRectangle(
      this.player.getBounds(),
      this.treasure.getBounds()
    )
  ) {
    this.gameOver();
  }

  // enemy movement
  let enemies = this.enemies.getChildren();

  for (let i = 0; i < enemies.length; i++) {
    // move enemies
    enemies[i].y += enemies[i].speed;

    // reverse movement when edge is reached
    if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
      enemies[i].speed *= -1;
    } else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
      enemies[i].speed *= -1;
    }

    // enemy collision
    if (
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.player.getBounds(),
        enemies[i].getBounds()
      )
    ) {
      this.gameOver();
      break;
    }
  }
};
