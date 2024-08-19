import { gameConfig } from '../config.js';
export default class Level3 extends Phaser.Scene {
   

    constructor() {
        super({ key: 'Level3' });
        // Declare variables here, but don't initialize them (they'll be set up in create())
        this.questionText = null;
        this.inputText = null;
        this.currentQuestion = '';
        this.answer = null;
        this.score = 0;
        this.scoreText = null;
        this.level = 3;
        this.levelText = null;
        this.levelCompleteScore = 50;  
        this.themeSound = null;
    }

    preload(){
        this.log("Level " + this.level)
        this.load.image('monster'+this.level, 'images/monster'+this.level+'.png');
        this.load.image('backgroundlevel'+this.level, 'images/background.webp'); 
        this.load.audio('theme', 'sounds/theme.mp3');
        //this.load.audio('monsterLaugh', 'sounds/laugh.mp3');
    }


    create() {
            this.themeSound = this.sound.add('theme', { volume: 0.5, loop: true });
            this.themeSound.play();
            this.add.image(0,0, 'backgroundlevel'+this.level).setOrigin(0, 0).setDisplaySize(gameConfig.width, gameConfig.height);

            const scoreBackground = this.add.graphics();
            scoreBackground.fillStyle(0xffffff, 0.5); // White color with 50% transparency
            scoreBackground.fillRect(10, 10, 350, 50); // Adjust the size and position to fit the text

            const scoreBackground2 = this.add.graphics();
            scoreBackground2.fillStyle(0xffffff, 0.5); // White color with 50% transparency
            scoreBackground2.fillRect(90, 440, 350, 100); // Adjust the size and position to fit the text


            this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
            this.levelText = this.add.text(200, 16, 'Level:' + this.level, { fontSize: '32px', fill: '#000' });
            this.questionText = this.add.text(100, 450, 'Question', { fontSize: '48px', fill: '#000' });

            this.inputText = this.add.text(100, 500, 'Answer: ', { fontSize: '32px', fill: '#000' });

           
            const boundary = this.physics.add.staticGroup();
            boundary.create(this.scale.width/2 -200, this.scale.height/2 -100, 'dummy').setScale(1, 1).refreshBody();

            const monster = this.physics.add.sprite(400, 300, 'monster'+this.level);
            monster.setScale(0.4);  // Scale the monster if needed
            monster.setBounce(1);   // Full bounce when hitting world bounds
            monster.setCollideWorldBounds(true); // Enable collision with world bounds

            // Set random initial velocity for each monster
            monster.setVelocity(Phaser.Math.Between(-200, 200), Phaser.Math.Between(-200, 200));
            monster.setMaxVelocity(300); // Set a maximum velocity to prevent high-speed issues
            this.sound.play('monsterLaugh');
            monster.on('worldbounds', function () {
                console.log('Monster hit world bounds:', monster);
                
            });     
            monster.setInteractive();

            this.physics.add.collider(monster, boundary, () => {
                this.sound.play('monsterLaugh');
            });
            this.generateQuestion();
            this.input.keyboard.on('keydown', this.handleInput, this);
        }


    update() {
        // Game loop logic if needed
    }


    generateQuestion() {
        let num1 = Phaser.Math.Between(this.level * 10, this.level * 100);
        let num2 = Phaser.Math.Between(1, this.level * 10);
        let operation = Phaser.Math.Between(0, 1); // 0 for addition, 1 for subtraction

        if (operation === 0) {
            this.currentQuestion = `${num1} + ${num2}`;
            this.answer = num1 + num2;
        } else {
            if (num1 < num2) { // Ensure no negative answers
                [num1, num2] = [num2, num1];
            }
            this.currentQuestion = `${num1} - ${num2}`;
            this.answer = num1 - num2;
        }

        this.log("Q: "+ this.currentQuestion);
        this.questionText.setText(`${this.currentQuestion} = ?`);
        this.inputText.setText('Answer: ');
    }

    log(str) {
        console.log(str)
    }

    handleInput(event) {
        if (event.keyCode >= 48 && event.keyCode <= 57) { // If number is pressed
            this.inputText.text += event.key;
        } else if (event.keyCode === 8) { // If backspace is pressed
            this.inputText.text = inputText.text.slice(0, -1);
        } else if (event.keyCode === 13) { // If Enter is pressed
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
        if(this.score == 50){
            this.levelComplete();
        }else{
            this.levelText.setText(`Level: ${this.level}`);
            this.generateQuestion();
        }
        
    }

    levelComplete() {
         this.themeSound.stop()
        this.scene.start('MainMenu');
    }
}
