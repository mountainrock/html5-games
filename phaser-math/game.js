import { gameConfig } from './config.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import Level4 from './scenes/Level4.js';

import MainMenu from './scenes/MainMenu.js';

gameConfig.scene = [MainMenu, Level1, Level2, Level3, Level4]; // Add scenes

const game = new Phaser.Game(gameConfig);


