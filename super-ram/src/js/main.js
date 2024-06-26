console.log("Game begins")

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d')
canvas.width  = window.innerWidth
canvas.height  = window.innerHeight

const cWidth = canvas.width, cHeight = canvas.height
const gravity = 0.5
var isGameMusicOn = false

const spriteImages = {
    playerStandRight: "images/spriteStandRight.png", //spriteStandRight.png
    playerStandLeft: "images/spriteStandLeft.png",
    playerRunRight: "images/spriteRunRight.png",
    playerRunLeft: "images/spriteRunLeft.png",
    platformBig:"images/platform.png",
    platformSmall:"images/platformSmallTall.png",
    background:"images/background.png",
    backgroundBig:"images/background.webp", //backgroundBig.jpeg

    enemyStandRight: "images/enemy/enemy-spriteRunLeft.png", //spriteStandRight.png
    enemyStandLeft: "images/enemy/enemy-spriteRunLeft.png",
    enemyRunRight: "images/enemy/enemy-spriteStandLeft.png",
    enemyRunLeft: "images/enemy/enemy-spriteRunLeft.png",
};

const keys ={
    left:{pressed:false},
    right:{pressed:false},
    up:{pressed:false, jumping : false},

}

class Platform{
    constructor(x1, y1, width1, height1, spriteImage){
        this.position ={ x:x1, y:canvas.height - y1}
        this.width = width1
        this.height= height1
        this.image= new Image()
        this.image.src = spriteImage
    }

    draw(){
          ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}

class Background{
    constructor(x1, y1, width1, height1, spriteImage){
        this.position ={ x:x1, y: y1}
        this.width = width1
        this.height= height1
        this.image= new Image()
        this.image.src = spriteImage
    }

    draw(){
          ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}


class Enemy{
    constructor(){
        this.frameIndex =0
        this.standing= { cropWidth: 340, cropHeight:400, destWidth: canvasR(cWidth,6),
                        destHeight:canvasR(cHeight,40), numberOfFrames: 29 }
        this.running=  { cropWidth: 340, cropHeight:400, destWidth: canvasR(cWidth,8),
                        destHeight: canvasR(cHeight,45), numberOfFrames: 60 }
        this.action = "standing"
        this.direction = "right"

        this.position={ x: canvasR(cWidth,90), y: canvas.height - this.standing.destHeight}
        this.velocity={ x: ENEMY_VELOCITY, y:0}
        this.isJumping = false
        this.image= new Image()

        this.width= this.standing.destWidth
        this.height = this.standing.destHeight
    }

    draw(){
        var numberOfFrames, cropWidth, cropHeight, destWidth,destHeight =0
        if(this.action == "standing"){
            this.image.src = this.direction == "right" ? spriteImages.enemyStandRight : spriteImages.enemyStandLeft;
            numberOfFrames = this.standing.numberOfFrames
            cropWidth = this.standing.cropWidth
            cropHeight = this.standing.cropHeight
            destWidth = this.standing.destWidth
            destHeight = this.standing.destHeight
        }
        else if(this.action == "running"){
            this.image.src = this.direction == "right" ? spriteImages.enemyRunRight : spriteImages.enemyRunLeft;
            log(this.direction )
            numberOfFrames = this.running.numberOfFrames
            cropWidth = this.running.cropWidth
            cropHeight = this.running.cropHeight
            destWidth = this.running.destWidth
            destHeight = this.running.destHeight
        }

        if (this.frameIndex < numberOfFrames - 1) {
          this.frameIndex++;
        } else {
          this.frameIndex = 0;
        }
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            this.image,
            this.frameIndex * cropWidth,0,
            cropWidth, cropHeight, this.position.x, this.position.y,
            destWidth, destHeight
         );

    }

    update(){

        this.draw();
        this.position.x +=this.velocity.x
        this.position.y +=this.velocity.y
        if(this.position.y + this.height+ this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }else{
            this.velocity.y=0
        }


    }
}

class Player{
    constructor(){
        this.frameIndex =0
        this.standing= { cropWidth: 200, cropHeight:350, destWidth: canvasR(cWidth,5),
                        destHeight:canvasR(cHeight,20), numberOfFrames: 60 }
        this.running=  { cropWidth: 220, cropHeight:350, destWidth: canvasR(cWidth,6),
                        destHeight: canvasR(cHeight,20), numberOfFrames: 60 }
        this.action = "standing"
        this.direction = "right"

        this.position={ x: canvasR(cWidth,5), y: canvas.height - this.standing.destHeight}
        this.velocity={ x:0, y:0}
        this.isJumping = false
        this.image= new Image()

        this.width= this.standing.destWidth
        this.height = this.standing.destHeight
        this.health =100
    }

    draw(){
        var numberOfFrames, cropWidth, cropHeight, destWidth,destHeight =0
        if(this.action == "standing"){
            this.image.src = this.direction == "right" ? spriteImages.playerStandRight : spriteImages.playerStandLeft;
            numberOfFrames = this.standing.numberOfFrames
            cropWidth = this.standing.cropWidth 
            cropHeight = this.standing.cropHeight
            destWidth = this.standing.destWidth
            destHeight = this.standing.destHeight
        }
        else if(this.action == "running"){
            this.image.src = this.direction == "right" ? spriteImages.playerRunRight : spriteImages.playerRunLeft;
            log(this.direction)
            numberOfFrames = this.running.numberOfFrames
            cropWidth = this.running.cropWidth 
            cropHeight = this.running.cropHeight
            destWidth = this.running.destWidth
            destHeight = this.running.destHeight
        }

        if (this.frameIndex < numberOfFrames - 1) {
          this.frameIndex++;
        } else {
          this.frameIndex = 0;
        }
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx.drawImage(
            this.image,
            this.frameIndex * cropWidth,0,
            cropWidth, cropHeight, this.position.x, this.position.y,
            destWidth, destHeight
         );
        
    }

    update(){
        
        this.draw();
        this.position.x +=this.velocity.x
        this.position.y +=this.velocity.y
        if(this.position.y + this.height+ this.velocity.y <= canvas.height){
            this.velocity.y += gravity
        }else{
            this.velocity.y=0
        }

        drawTextBG("SCORE : "+ score, 22, canvasR(cWidth,80), canvasR(cHeight,10));
        drawTextBG("HEALTH : "+ this.health, 22, canvasR(cWidth,60), canvasR(cHeight,10));

    }
}


function animate(){
    requestAnimationFrame(animate)
    ctx.clearRect(0,0, cWidth, canvas.height)
    if(keys.right.pressed)
        player.direction ="right"
    else if(keys.left.pressed)
        player.direction ="left"

    if(keys.right.pressed && player.position.x < canvasR(cWidth,40) ){
        player.velocity.x =  PLAYER_VELOCITY;
        player.action = "running"
    }else if(keys.left.pressed && player.position.x >canvasR(cWidth,3)){
        player.velocity.x =  -PLAYER_VELOCITY
        player.action = "running"
    }else{
        player.action = "standing"
        player.velocity.x =  0

        if(keys.right.pressed){ //parallax scroll
                     platforms.forEach(platform => {
                       platform.position.x -= PLAYER_VELOCITY;
                       player.action = "running"
                     });
        }else if(keys.left.pressed){  //parallax scroll
                     platforms.forEach(platform => {
                       platform.position.x += PLAYER_VELOCITY;
                       player.action = "running"
                     });
         }
    }

    if(keys.up.pressed){
        if(player.velocity.y >=0)
            player.velocity.y =  -12
    }else if(player.isJumping){
        player.velocity.y =  12
    }

    if(player.velocity.y ==0){
        player.isJumping = false

    }

    backgrounds.forEach(background => {
        background.draw();
    });

    platforms.forEach(platform => {
        //check if player is on platform
        if(player.position.y + player.height <= platform.position.y
           && player.position.y + player.height +player.velocity.y >= platform.position.y
           && player.position.x + player.width >= platform.position.x
           && player.position.x + player.width < platform.position.x+platform.width){
           player.velocity.y=0

       }
       //check if player is below platform
       if(player.position.y + player.height <= platform.position.y
                  && player.position.y + player.height +player.velocity.y >= platform.position.y
                  && player.position.x + player.width >= platform.position.x
                  && player.position.x + player.width < platform.position.x+platform.width){
                  player.velocity.y= - player.velocity.y
              }
       platform.draw();
     });

     //prevent player from going out of canvas
     if(player.position.x < 0 || player.position.x > cWidth-player.width){
        player.velocity.x=0
        if( player.position.x > cWidth-player.width)
            player.position.x= cWidth-player.width
        if(player.position.x < 0)
            player.position.x =  0
     }

     //check if enemy collides
    if(player.position.x > enemy.position.x ){
        drawTextBG("GAME ENDS  ", 40, canvasR(cWidth,40), canvasR(cHeight,40));
        enemy.velocity.x =0
    }

    player.update()
    enemy.update()
}

const player = new Player()
const enemy = new Enemy()
const platforms = [
                    new Platform(x = canvasR(cWidth,15), y = canvasR(cHeight,23), canvasR(cWidth,20), canvasR(canvas.height,8), spriteImages.platformBig),
                    new Platform(canvasR(cWidth,40), canvasR(cHeight,30), canvasR(cWidth,20), canvasR(canvas.height,8), spriteImages.platformBig),
                    new Platform(canvasR(cWidth,60), canvasR(cHeight,40), canvasR(cWidth,20), canvasR(canvas.height,8), spriteImages.platformBig),
                    new Platform(canvasR(cWidth,85), canvasR(cHeight,10), canvasR(cWidth,15), canvasR(canvas.height,10), spriteImages.platformSmall),
                    new Platform(canvasR(cWidth,110), canvasR(cHeight,10), canvasR(cWidth,15), canvasR(canvas.height,10), spriteImages.platformSmall)
                 ]

const backgrounds =[
                        new Background(0,0,cWidth,canvas.height, spriteImages.backgroundBig)
                   ]
animate();


window.addEventListener('keydown', function(event){
    if(isGameMusicOn ==false){
     playTheme("ramayana-theme");
     isGameMusicOn = true;
    }

     key = event.key;
     switch(key){
         case "ArrowLeft": 
            keys.left.pressed= true
            break
         case "ArrowRight": 
            keys.right.pressed= true
            break
         case "ArrowUp":
            playMusic("Jump Super");
            keys.up.pressed = true
            player.isJumping = true
             break
         case "ArrowDown": 
            console.log("Down")
            break
     }
})

window.addEventListener('keyup', ({key}) =>{
     switch(key){
         case "ArrowLeft": 
            keys.left.pressed= false
            break
         case "ArrowRight": 
            keys.right.pressed= false
            break
         case "ArrowUp": 
            keys.up.pressed = false
            player.isJumping = false
            break
         case "ArrowDown": 
            console.log("Down")
            break
     }
})



