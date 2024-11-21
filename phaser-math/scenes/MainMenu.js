// scenes/MainMenu.js
export default class MainMenu extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        this.load.image('background', 'images/menu.png'); // Background image
    }

    create() {
        // Set background image and make it responsive
        this.add.image(0, 0, 'background').setOrigin(0, 0).setDisplaySize(this.scale.width, this.scale.height);

        // Responsive title text
        const titleFontSize = Math.min(this.scale.width / 20, 46); // Adjust font size based on screen width
        this.add.text(this.scale.width / 2, this.scale.height / 3 + (this.scale.height / 600), 'MATH FUN', 
            { fontSize: `${titleFontSize}px`, fill: '#8ca0b6' }).setOrigin(0.5);

        // Responsive level buttons
        const baseX = this.scale.width / 2 - 150 * (this.scale.width / 800); // Adjust base X position
        const baseY = this.scale.height / 2 - 20 * (this.scale.height / 600); // Adjust base Y position
        const buttonWidth = 100 * (this.scale.width / 800); // Adjust button width
        const buttonHeight = 60 * (this.scale.height / 600); // Adjust button height
        const buttonSpacingX = 120 * (this.scale.width / 800); // Adjust horizontal spacing
        const buttonSpacingY = 70 * (this.scale.height / 600); // Adjust vertical spacing
        const buttonFontSize = Math.min(this.scale.width / 25, 32); // Adjust button font size based on screen width

        for (let i = 1; i <= 4; i++) {
            let row = Math.floor((i - 1) / 4); // 0, 1, 2 for three rows
            let col = (i - 1) % 4;             // 0, 1, 2, 3 for four columns

            let x = baseX + col * buttonSpacingX; // Responsive horizontal position
            let y = baseY + row * buttonSpacingY; // Responsive vertical position

            // Draw rectangle with responsive size
            let rect = this.add.graphics();
            rect.fillStyle(0xbaced0, 0.6)
                .fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight);
            rect.setInteractive(new Phaser.Geom.Rectangle(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight), Phaser.Geom.Rectangle.Contains);

            // Add level number text with responsive font size
            let levelText = this.add.text(x, y, `${i}`, { fontSize: `${buttonFontSize}px`, fill: '#fff' }).setOrigin(0.5).setInteractive();

            // Add button hover and click events
            levelText.on('pointerover', () => rect.fillStyle(0x000000, 0.6).fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight)); // Darker color on hover
            levelText.on('pointerout', () => rect.fillStyle(0xbaced0, 0.6).fillRect(x - buttonWidth / 2, y - buttonHeight / 2, buttonWidth, buttonHeight));  // Revert to light blue on hover out
            levelText.on('pointerdown', () => this.startLevel(i)); // Start the corresponding level on click
            rect.on('pointerdown', () => this.startLevel(i)); 
            
        }

        // Responsive instructions text
        const instructionsFontSize = Math.min(this.scale.width / 36, 22); // Adjust font size based on screen width
        this.scene.start(`Level1`);
    }


     startLevel(level) {
        this.scene.start(`Level${level}`); // Start the selected level
    }
}
