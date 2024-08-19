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
        this.load.image('monster' + this.level, 'images/monster' + this.level + '.png');
        this.load.image('backgroundlevel' + this.level, 'images/background' + this.level + '.webp'); 
        this.load.audio('theme', 'sounds/theme.mp3');
        this.load.audio('monsterLaugh', 'sounds/laugh.mp3');
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
        scoreBackground.fillRect(10, 10, 350, 50);

        const scoreBackground2 = this.add.graphics();
        scoreBackground2.fillStyle(0xffffff, 0.5);
        scoreBackground2.fillRect(90, 440, 350, 100);

        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
        this.levelText = this.add.text(200, 16, `Level: ${this.level}`, { fontSize: '32px', fill: '#000' });
        this.questionText = this.add.text(100, 450, 'Question', { fontSize: '48px', fill: '#000' });
        this.inputText = this.add.text(100, 500, 'Answer: ', { fontSize: '32px', fill: '#000' });
    }

    createMonster() {
        const boundary = this.physics.add.staticGroup();
        boundary.create(this.scale.width / 2 - 200, this.scale.height / 2 - 100, 'dummy').setScale(1, 1).refreshBody();

        const monster = this.physics.add.sprite(400, 300, 'monster' + this.level);
        monster.setScale(0.4);
        monster.setBounce(1);
        monster.setCollideWorldBounds(true);

        monster.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
        monster.setMaxVelocity(300);

        this.monsterLaughSound = this.sound.add('monsterLaugh');
        this.monsterLaughSound.play();

        monster.setInteractive();
        this.physics.add.collider(monster, boundary, () => {
             this.monsterLaughSound.play();
        });
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
            this.levelUp();
        } else {
            this.inputText.setText('Your Answer: ');
        }
    }

    levelUp() {
        if (this.score == this.levelCompleteScore) {
            this.levelComplete();
        } else {
            this.levelText.setText(`Level: ${this.level}`);
            this.generateQuestion();
        }
    }

    levelComplete() {
        // Stop the theme sound
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


    log(str) {
        console.log(str);
    }
}
