About:
This is an interesting kids math game (like math game by speedyminds on playstore https://play.google.com/store/apps/details?id=net.speedymind.mental.arithmetic.trainer.learning.games.practice.k5.grade.math.vs.slimes&hl=en_US). Suggest you install this game to get the idea.

The concept is to let kids solve the math (add, substract) and destroy the monster and move up the level limited by time.
With Indian theme for the game the main character will be Little Krishna killing all the monsters from Mahabharath/Ramayana (Ravana/ bakasura/ types)

TODO:
2. Build interesting level with different background and music upto 10 levels
3. Compress resource and optimize it
4. Fix for mobile resolution
5. Release to playstore
6. integrate ads or level based subscription

Done:
1. Create BaseScene and add common theme and laugh sounds in one place


How to run locally
------------------
1. copy the folder phaser-math into apache htdocs
2. Open http://localhost/phaser-math/ should launch the game

Code walkthrough:
----------------
1. index.html includes game.js
2. game.js creates the phaser game with all levels
3. Each scene is represented as individual file
4. MainMenu.js - this is the starting dashboard scene
    preload() - loads initial images like background. This is phaser lifecycle method
    create() - this is called after preload and all actions and buttons are added here. This is phaser lifecycle method
5. BaseLevel.js - all common use level related code is included in this.
   LevelN.js - this extends BaseLevel.js


Adding a new level
1. Create LevelN.js (refer Level1.js)
2. Update game.js to import this file with LevelN.js and add to gameConfig.scene