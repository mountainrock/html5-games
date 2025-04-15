// config.js
export const gameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,  // Set width based on the window
    height: window.innerHeight,  // Set height based on the window
    scale: {
        mode: Phaser.Scale.FIT,  // Scale the game to fit the screen
        autoCenter: Phaser.Scale.CENTER_BOTH,  // Center the game
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 100 }
        }
    },
    scene: []
};
