// scenes/MainMenu.js
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'images/menu.png'); // Background image
        this.load.image('playButton', 'images/level1-button.png'); // Play button image
    }

    create() {
        // Set background image
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // Add title text
        this.add.text(this.scale.width / 2, this.scale.height / 4, 'Math Monster Game', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        // Add play button
        const playButton = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'playButton').setInteractive();

        // Add button hover and click events
        playButton.on('pointerover', () => playButton.setTint(0x44ff44));
        playButton.on('pointerout', () => playButton.clearTint());
        playButton.on('pointerdown', () => this.startGame());

        // Add instructions text
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'Easy peasy maths', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    }

    startGame() {
        this.scene.start('Level1'); // Change this to the level you want to start
    }
}
