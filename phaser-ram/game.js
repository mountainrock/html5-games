// Game configuration
const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

// Game variables
let player;
let platforms;
let cursors;
let background;
let enemy;
let score = 0;
let scoreText;
let healthText;
let isGameMusicOn = false;

// Phaser game instance
const game = new Phaser.Game(config);

function preload() {
  this.load.image('background', 'images/backgroundBig.png');
  this.load.image('platformBig', 'images/platform.png');
  this.load.image('platformSmall', 'images/platformSmallTall.png');
  this.load.spritesheet('player', 'images/spriteRunRight.png', { frameWidth: 220, frameHeight: 350 });
  this.load.spritesheet('enemy', 'images/enemy/enemy-spriteRunLeft.png', { frameWidth: 340, frameHeight: 400 });
}

function create() {
  // Background
  this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

  // Platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(canvasR(this.scale.width, 15), this.scale.height - canvasR(this.scale.height, 23), 'platformBig').setScale(0.5).refreshBody();
  platforms.create(canvasR(this.scale.width, 40), this.scale.height - canvasR(this.scale.height, 30), 'platformBig').setScale(0.5).refreshBody();
  platforms.create(canvasR(this.scale.width, 60), this.scale.height - canvasR(this.scale.height, 40), 'platformBig').setScale(0.5).refreshBody();
  platforms.create(canvasR(this.scale.width, 85), this.scale.height - canvasR(this.scale.height, 10), 'platformSmall').setScale(0.5).refreshBody();
  platforms.create(canvasR(this.scale.width, 110), this.scale.height - canvasR(this.scale.height, 10), 'platformSmall').setScale(0.5).refreshBody();

  // Player
  player = this.physics.add.sprite(100, this.scale.height - 150, 'player');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('player', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'player', frame: 4 }],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('player', { start: 6, end: 11 }),
    frameRate: 10,
    repeat: -1
  });

  // Enemy
  enemy = this.physics.add.sprite(400, this.scale.height - 150, 'enemy');
  enemy.setCollideWorldBounds(true);

  this.anims.create({
    key: 'enemyMove',
    frames: this.anims.generateFrameNumbers('enemy', { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  // Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(enemy, platforms);
  this.physics.add.collider(player, enemy, hitEnemy, null, this);

  // Controls
  cursors = this.input.keyboard.createCursorKeys();

  // Score and health
  scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
  healthText = this.add.text(16, 50, 'health: 100', { fontSize: '32px', fill: '#000' });

  // Music
  // Add code to play music if desired
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);
    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }

  // Update enemy movement and behavior
  // Add collision checks and other logic as needed
}

function canvasR(dim, ratio) {
  return dim * ratio / 100;
}

function hitEnemy(player, enemy) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
}

