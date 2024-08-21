// scenes/MainMenu.js
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'images/menu.png'); // Background image
    }

    create() {
        // Set background image
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // Add title text
        this.add.text(this.scale.width / 2, this.scale.height / 4 +50, 'MATH MONSTER', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        // Generate level buttons from 1 to 10 in 3 rows
        for (let i = 1; i <= 10; i++) {
            // Calculate position in 3 rows and 4 columns
            let row = Math.floor((i - 1) / 4); // 0, 1, 2 for three rows
            let col = (i - 1) % 4;             // 0, 1, 2, 3 for four columns

            let x = this.scale.width / 2 - 150 + col * 120; // Horizontal spacing
            let y = this.scale.height / 2 - 70 + row * 70;  // Vertical spacing

            // Draw rectangle
            let rect = this.add.graphics();
            rect.fillStyle(0xbaced0, 0.6); // Black color with 80% opacity
            rect.fillRect(x - 40, y - 20, 80, 40); // Position and size of the rectangle

            // Add level number text on top of the rectangle
            let levelText = this.add.text(x, y, `${i}`, { fontSize: '32px', fill: '#fff' }).setOrigin(0.5).setInteractive();

            // Add button hover and click events
            // Add button hover and click events
            levelText.on('pointerover', () => rect.fillStyle(0x000000, 0.6).fillRect(x - 40, y - 20, 80, 40)); // Deep blue color on hover
            levelText.on('pointerout', () => rect.fillStyle(0xbaced0, 0.6).fillRect(x - 40, y - 20, 80, 40));  // Revert to black with 80% opacity on hover out
            levelText.on('pointerdown', () => this.startLevel(i)); // Start the corresponding level on click
        }


        // Add instructions text
        this.add.text(this.scale.width / 2, this.scale.height / 2 + 120, 'EASY PEASY', { fontSize: '22px', fill: '#fff' }).setOrigin(0.5);
    }

     startLevel(level) {
        this.scene.start(`Level${level}`); // Start the selected level
    }
}
