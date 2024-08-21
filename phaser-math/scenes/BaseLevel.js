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
        this.themeSound = null;
        this.monsterLaughSound = null;
    }

    preload() {
        this.log("Level " + this.level);
         this.load.image('kid', 'images/kid.png');
        this.load.image('monster' + this.level, 'images/monster' + this.level + '.png');
        this.load.image('backgroundlevel' + this.level, 'images/background' + this.level + '.webp'); 
        this.load.audio('theme', 'sounds/theme.mp3');
        this.load.audio('monsterLaugh', 'sounds/laugh.mp3');
        this.load.image('arrow', 'images/arrow.png');
    }

    create() {
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
        const scoreBackground = this.add.graphics();
        scoreBackground.fillStyle(0xffffff, 0.5);
        scoreBackground.fillRect(0 , 0, this.scale.width, 50);

        const questionBackground = this.add.graphics();
        questionBackground.fillStyle(0xffffff, 0.5);
        questionBackground.fillRect(this.scale.width/2-150 , this.scale.height/2, 380, 100);

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.levelText = this.add.text(200, 16, `Level: ${this.level}`, { fontSize: '32px', fill: '#000' });
        this.questionText = this.add.text(this.scale.width / 2 - 100, this.scale.height/2, 'Question', { fontSize: '48px', fill: '#000' });
        this.inputText = this.add.text(this.scale.width / 2 - 100, this.scale.height/2 + 50, 'Answer: ', { fontSize: '32px', fill: '#000' });
    }

    createMonster() {
        this.kid = this.physics.add.staticSprite(this.scale.width / 2 - 350, this.scale.height - 100, 'kid' );
        this.kid.setScale(0.6);
        this.kid.body.setSize(this.kid.width * 0.7, this.kid.height * 0.7);

        this.monster = this.physics.add.sprite(800, 200, 'monster' + this.level);
        this.monster.setScale(0.4);
        //monster.setBounce(1);
        this.monster.setVelocityX(-20);
        this.monster.setCollideWorldBounds(true);

       
        this.monsterLaughSound = this.sound.add('monsterLaugh');
        //this.monsterLaughSound.play();

        this.monster.setInteractive();
        this.physics.add.collider(this.monster, this.kid, () => {
             this.monsterLaughSound.play();
             monster.setVelocityX(0);
             this.levelLost();

        });

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
        const backButton = this.add.text(this.scale.width - 100, 20, 'Back', { fontSize: '32px', fill: '#000' })
            .setInteractive()
            .on('pointerover', () => backButton.setStyle({ fill: '#baced0' }))
            .on('pointerout', () => backButton.setStyle({ fill: '#000' }))
            .on('pointerdown', () => {
                this.themeSound.stop();
                this.monsterLaughSound.stop();
                this.scene.start('MainMenu');
            });
        
        const pauseButton = this.add.text(this.scale.width - 300, 20, 'Pause', { fontSize: '32px', fill: '#000' })
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
        let num1 = Phaser.Math.Between(this.level * 1, this.level * 10);
        let num2 = Phaser.Math.Between(1, this.level * 10);
        let operation = Phaser.Math.Between(0, 1);

        if (operation === 0) {
            this.currentQuestion = `${num1} + ${num2}`;
            this.answer = num1 + num2;
        } else {
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
            this.currentQuestion = `${num1} - ${num2}`;
            this.answer = num1 - num2;
        }

        this.log("Q: " + this.currentQuestion);
        this.questionText.setText(`${this.currentQuestion} = ?`);
        this.inputText.setText('Answer: ');
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
        let userAnswer = parseInt(this.inputText.text.split(': ')[1]);

        if (userAnswer === this.answer) {
            this.score += 10;
            this.scoreText.setText(`Score: ${this.score}`);
            this.shootArrow(); 

            
        } else {
            this.inputText.setText('Answer: ');
        }
    }

    resetMonster() {
        // Reset monster to the starting position and velocity
        this.monster.setPosition(800, 200); // Set the initial position
        this.monster.setVelocityX(-20);     // Reset the initial velocity
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
        this.physics.pause();
        this.themeSound.stop();
        this.monsterLaughSound.stop();

        // Create a semi-transparent background overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.7);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);

        // Add "Congratulations" text
        const congratsText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 'Well done! you completed level ' + this.level +'.', {
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


    levelLost() {
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
