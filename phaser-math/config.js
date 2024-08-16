// config.js
export const gameConfig = {
    type: Phaser.AUTO,
    width: 900,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 100 }
        }
    },
    scene: []
};
