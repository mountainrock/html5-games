// scenes/BaseLevel.js
import { gameConfig } from '../config.js';

export default class BaseLevel extends Phaser.Scene {
    constructor(levelKey) {
        super({ key: levelKey });
        this.levelKey = levelKey;
        this.questionText = null;
        this.inputText = null;
        this.currentQuestion = '';
        this.answer = null;
        this.score = 0;
        this.scoreText = null;
        this.level = 1;
        this.levelText = null;
        this.levelCompleteScore = 50;
        this.themeSound = this.shootSound = this.monsterLaughSound = null;
        this.maxLevel = 4;
        this.menuFontColor = '#5f6c7a';
        
    }

    preload() {
        this.log("Level " + this.level);
         this.load.image('kid', 'images/kid.png');
        this.load.image('monster' + this.level, 'images/monster' + this.level + '.png');
        for(var i = 1;i<= this.maxLevel;i++){
            this.load.image('monster' + i, 'images/monster' + i + '.png');
        }
        this.load.image('backgroundlevel' + this.level, 'images/background' + this.level + '.webp'); 

        this.load.audio('theme', 'sounds/theme.mp3');
        this.load.audio('cheer', 'sounds/cheer.mp3');
        this.load.audio('monsterLaugh', 'sounds/laugh.mp3');
        this.load.audio('shoot', 'sounds/shoot.mp3');
        this.load.audio('game-over', 'sounds/game-over.mp3');
    
        this.load.image('arrow', 'images/arrow.png');
        this.load.image('cup', 'images/cup.png');

        const widthScaleFactor = this.scale.width / 800;
        this.menuFontSize = Math.round(26 * widthScaleFactor);
    }

    create() {
        this.lostSound = this.sound.add('game-over', { volume: 0.5, loop: false });
        this.shootSound = this.sound.add('shoot', { volume: 0.5, loop: false });
        this.themeSound = this.sound.add('theme', { volume: 0.5, loop: true });
        this.themeSound.play();
        this.add.image(0, 0, 'backgroundlevel' + this.level).setOrigin(0, 0).setDisplaySize(gameConfig.width, gameConfig.height);

        this.createScoreBoard();
        this.createMonster();
        this.createBackButton();

        this.generateQuestion();
        this.input.keyboard.on('keydown', this.handleInput, this);
    }

    createScoreBoard() {
        // Calculate scale factors based on screen width and height
        const widthScaleFactor = this.scale.width / 800;  // Assuming 800 as a base width for scaling
        const heightScaleFactor = this.scale.height / 600;  // Assuming 600 as a base height for scaling

        // Responsive font sizes based on the screen size

        const scoreFontSize = this.menuFontSize;  // Scale font size based on screen width
        const questionFontSize = Math.round(48 * widthScaleFactor);
        const scoreFontColor = this.menuFontColor; 

        // Score background
        const scoreBackground = this.add.graphics();
        scoreBackground.fillStyle(0xffffff, 0.5);
        scoreBackground.fillRect(0, 0, this.scale.width, Math.round(75 * heightScaleFactor));  // Adjust height based on scale

        // Score and level text
        this.scoreText = this.add.text(16 * widthScaleFactor, 16 * heightScaleFactor, 'Score 0', { fontSize: `${scoreFontSize}px`, fill: scoreFontColor });
        this.levelText = this.add.text(200 * widthScaleFactor, 16 * heightScaleFactor, `Level ${this.level}`, { fontSize: `${scoreFontSize}px`, fill: scoreFontColor });

        // Question background
        const questionBackground = this.add.graphics();
        const questionBgWidth = 280 * widthScaleFactor;
        const questionBgHeight = 300 * heightScaleFactor;
        questionBackground.fillStyle(0xffffff, 0.5);
        questionBackground.fillRect(this.scale.width / 2 - questionBgWidth / 2, this.scale.height / 2 -50, questionBgWidth, questionBgHeight);

        // Question and input text
        this.questionText = this.add.text(
            this.scale.width / 2 - (100 * widthScaleFactor),
            this.scale.height / 2 -50,
            'Question',
            { fontSize: `${questionFontSize}px`, fill: '#000' }
        );
        this.inputText = this.add.text(
            this.scale.width / 2 - (70 * widthScaleFactor),
            this.scale.height / 2 + (130 * heightScaleFactor),
            '',
            { fontSize: `${questionFontSize}px`, fill: '#000' }
        );
    }

createMonster() {
    // Calculate scale factors based on screen width and height
    const widthScaleFactor = this.scale.width / 800;  // Assuming 800 as a base width for scaling
    const heightScaleFactor = this.scale.height / 600;  // Assuming 600 as a base height for scaling

    // Responsive positions for the kid and monster
    const kidX = this.scale.width / 2 - 350 * widthScaleFactor;  // Adjust position based on scale
    const kidY = this.scale.height - 100 * heightScaleFactor;    // Adjust position based on scale
    const monsterX = this.scale.width - 50 * widthScaleFactor;   // Place monster near the right edge
    const monsterY = 200 * heightScaleFactor; // Initial monster position based on screen height

    // Kid sprite
    this.kid = this.physics.add.staticSprite(kidX, kidY, 'kid');
    this.kid.setScale(0.6 * Math.min(widthScaleFactor, heightScaleFactor));  // Adjust scale based on screen size
    this.kid.setSize(this.kid.width * 0.7, this.kid.height * 0.7);

    // Monster sprite
    this.monster = this.physics.add.sprite(monsterX, monsterY, 'monster' + this.level);
    this.monsterCount = this.level + 1;
    this.monster.setScale(0.4 * Math.min(widthScaleFactor, heightScaleFactor));  // Adjust scale based on screen size

    // Ensure the monster is active and dynamic
    this.monster.setCollideWorldBounds(true);
    
    // Monster sounds
    this.monsterLaughSound = this.sound.add('monsterLaugh');
    this.monsterLaughSound.play();

    // Collision between monster and kid
    this.physics.add.collider(this.monster, this.kid, () => {
        this.monsterLaughSound.play();
        this.monster.setVelocityX(0);  // Stop the monster when it collides with the kid
        this.levelLost();
    });

    this.monster.setVelocityX(-20); // Set a fixed negative velocity for the monster

    // Create an arrow group
    this.arrows = this.physics.add.group();
}



    // Function to shoot an arrow
    shootArrow() {
         const arrow = this.arrows.create(this.kid.x, this.kid.y, 'arrow');
        arrow.setScale(0.7);  // Adjust arrow size if needed
        arrow.setOrigin(0.5, 0.5);  // Set the origin to the center

        // Calculate direction and set velocity
        const direction = new Phaser.Math.Vector2(this.monster.x - this.kid.x, this.monster.y - this.kid.y-15).normalize();
        const speed = 500;  // Adjust speed as needed
        arrow.setVelocity(direction.x * speed, direction.y * speed);

        // Set up collision detection between the arrow and the monster
        this.physics.add.collider(arrow, this.monster, this.hitMonster, null, this);


    }

    // Handle arrow-monster collision
    hitMonster(arrow, monster) {
        arrow.destroy();  // Destroy the arrow on collision
        this.monster.setVelocityX(0);  
        this.levelUp();
    }

    createBackButton() {
        const backButton = this.add.text(this.scale.width - 100, 20, 'Back', { fontSize: this.menuFontSize, fill: this.menuFontColor })
            .setInteractive()
            .on('pointerover', () => backButton.setStyle({ fill: '#baced0' }))
            .on('pointerout', () => backButton.setStyle({ fill: '#000' }))
            .on('pointerdown', () => {
                this.themeSound.stop();
                this.monsterLaughSound.stop();
                this.scene.start('MainMenu');
            });
        
        const pauseButton = this.add.text(this.scale.width - 300, 20, 'Pause', { fontSize: this.menuFontSize, fill: this.menuFontColor })
            .setInteractive()
            .on('pointerdown', () => this.togglePause());


    }


    togglePause() {
        if (this.physics.world.isPaused) {
            // Unpause the game
            this.physics.resume();
            this.monsterLaughSound.resume();  // Resume monster laugh sound
            
            // Remove the pause overlay and resume button
            this.pauseOverlay.clear();
            this.resumeButton.destroy();
            this.pauseText.destroy();

        } else {
            // Pause the game
            this.pauseOverlay = this.add.graphics();
            this.pauseOverlay.fillStyle(0x000000, 0.7);
            this.pauseOverlay.fillRect(0, 0, this.scale.width, this.scale.height);

            // Add "Paused" text
            this.pauseText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 'Paused', { fontSize: '64px', fill: '#fff' })
                .setOrigin(0.5);

            // Add resume button
            this.resumeButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Resume', { fontSize: '32px', fill: '#fff' })
                .setOrigin(0.5)
                .setInteractive()
                .on('pointerdown', () => this.togglePause());

            this.physics.pause();
            this.monsterLaughSound.pause();  // Pause monster laugh sound
        }
    }


generateQuestion() {
    // Define the range for num1 and num2 based on the level
    let min = Math.pow(10, this.level - 1); // Minimum number based on level
    let max = Math.pow(10, this.level) - 1; // Maximum number based on level

    let num1 = Phaser.Math.Between(min, max);
    let num2 = Phaser.Math.Between(min, max);

    let operation = Phaser.Math.Between(0, 1);

    /* Ensure num1 is always the larger number for subtraction
    if (operation === 1 && num1 < num2) {
        [num1, num2] = [num2, num1];
    }*/

    // Convert numbers to strings to calculate their lengths
    let num1Str = num1.toString();
    let num2Str = num2.toString();

    // Calculate the maximum length of the two numbers
    let maxLength = Math.max(num1Str.length, num2Str.length);

    // Pad the numbers with leading spaces to ensure alignment
    num1Str = num1Str.padStart(maxLength, ' ');
    num2Str = num2Str.padStart(maxLength, ' ');

    if (operation === 0) { // Addition operation
        // Format the question for vertical addition
        this.currentQuestion = `  ${num1Str}\n+ ${num2Str}\n${'-'.repeat(maxLength + 2)}`;
        this.answer = num1 + num2;
    } else { // Subtraction operation
        if (num1 < num2) {
            [num1Str, num2Str] = [num2Str, num1Str];
        }
        // Format the question for vertical subtraction
        this.currentQuestion = `  ${num1Str}\n- ${num2Str}\n${'-'.repeat(maxLength + 2)}`;
        this.answer = num1 - num2;
    }

    this.log("Q: " + this.currentQuestion);

    // Set the question text to the formatted vertical question
    this.questionText.setText(this.currentQuestion);
    this.inputText.setText(' ');
}


    handleInput(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57) {
            this.inputText.text += event.key;
        } else if (event.keyCode === 8) {
            this.inputText.text = this.inputText.text.slice(0, -1);
        } else if (event.keyCode === 13) {
            this.checkAnswer();
        }
    }

    checkAnswer() {
        let userAnswer = parseInt(this.inputText.text);
        this.log(userAnswer +"actual answer : "+ this.answer)
 
        if (userAnswer ==  Math.abs(this.answer)) {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.shootArrow(); 
            this.shootSound.play();
            
        } else {
            this.inputText.setText('');
        }
    }

    resetMonster() {
        // Reset monster to the starting position and velocity
        this.monster.destroy()
        this.monster = this.physics.add.sprite(800, 200, 'monster' + this.monsterCount);
        this.monsterCount++;
        this.monster.setScale(0.4);
        this.monster.setPosition(800, 200); // Set the initial position
        this.monster.setVelocityX(-20);     // Reset the initial velocity
        this.monster.setCollideWorldBounds(true);

       
        this.monsterLaughSound.play();
        this.monster.setInteractive();

        this.physics.add.collider(this.monster, this.kid, () => {
             this.monsterLaughSound.play();
             this.monster.setVelocityX(0);
             this.levelLost();

        });
    }

    levelUp() {
        if (this.score == this.levelCompleteScore) {
            this.levelComplete();
        } else {
            this.levelText.setText(`Level: ${this.level}`);

            this.generateQuestion();
            this.resetMonster();
        }
    }

    levelComplete() {


        this.cheerSound = this.sound.add('cheer', { volume: 0.8, loop: false });
        this.cheerSound.play();

        this.physics.pause();
        this.themeSound.stop();
        this.monsterLaughSound.stop();

        // Create a semi-transparent background overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);

        // Add "Congratulations" text
        const congratsText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 120, '    WELL DONE!\n LEVEL ' + this.level + ' COMPLETE ' , {
            fontSize: '42px',
            fill: '#F4C2C2',
        }).setOrigin(0.5);

        // Add the prize image
        const prizeImage = this.add.image(this.scale.width / 2 -250, this.scale.height / 2 +50, 'cup');
        prizeImage.setScale(0.5); // Adjust the scale of the image if necessary

        // Add a button to go to the main menu
        const mainMenuButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Main Menu', {
            fontSize: '32px',
            fill: '#FFF',
            backgroundColor: '#baced0', 
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();

        // Add button hover and click events
        mainMenuButton.on('pointerover', () => mainMenuButton.setStyle({ fill: '#ff0' }));
        mainMenuButton.on('pointerout', () => mainMenuButton.setStyle({ fill: '#fff' }));
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenu'); // Navigate to the Main Menu scene
        });
    }


    levelLost() {
        this.lostSound.play();
        
        this.themeSound.stop();
        this.monsterLaughSound.stop();

        // Create a semi-transparent background overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);

        // Add "Congratulations" text
        const lostText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'You Lost ' + this.level +'.', {
            fontSize: '32px',
            fill: '#fff',
        }).setOrigin(0.5);

        // Add a button to go to the main menu
        const mainMenuButton = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, 'Main Menu', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#baced0', 
            padding: { x: 10, y: 5 },
        }).setOrigin(0.5).setInteractive();

        // Add button hover and click events
        mainMenuButton.on('pointerover', () => mainMenuButton.setStyle({ fill: '#ff0' }));
        mainMenuButton.on('pointerout', () => mainMenuButton.setStyle({ fill: '#fff' }));
        mainMenuButton.on('pointerdown', () => {
            this.scene.start('MainMenu'); // Navigate to the Main Menu scene
        });
    }


    log(str) {
        console.log(str);
    }
}
