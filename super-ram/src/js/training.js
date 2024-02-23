console.log("Game begins")

const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

const gravity = 0.5

const spriteImages = {
  playerStandRight: "images/spriteStandRight.png",
  playerStandLeft: "images/spriteStandLeft.png",
  playerRunRight: "images/spriteRunRight.png",
  playerRunLeft: "images/spriteRunLeft.png",
  platformBig:"images/platform.png",
  platformSmall:"images/platformSmallTall.png",
  background:"images/background.png",
  backgroundBig:"images/backgroundBig.jpeg"
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
          c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
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
          c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
    }
}


class Player{
    constructor(){
        this.frameIndex =0
        this.standing= { cropWidth: 177, cropHeight:400, destWidth: 60,  destHeight:150, numberOfFrames: 60 }
        this.running=  { cropWidth: 340, cropHeight:400, destWidth: 120,destHeight: 150, numberOfFrames: 29 }
        this.action = "standing"
        this.direction = "right"

        this.position={ x:100, y: canvas.height - this.standing.destHeight}
        this.velocity={ x:0, y:0}
        this.image= new Image()

        this.width= this.standing.destWidth
        this.height = this.standing.destHeight
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
            log(this.direction +" ::" + this.image.src)
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
        c.drawImage(
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

function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0, canvas.width, canvas.height)

    if(keys.right.pressed){
        player.direction ="right"
        player.velocity.x =  5
    }else if(keys.left.pressed){
        player.direction ="left"
        player.velocity.x = -5
        log(player.direction)
    }else{
        player.velocity.x =  0
    }

    if(keys.up.pressed)
        player.velocity.y =  -10
    else if(keys.up.jumping)
        player.velocity.y =  10

    player.action = player.velocity.x !==0 ? "running" : "standing"
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
       platform.draw();
     });

     //prevent player from going out of canvas
     if(player.position.x < 0 || player.position.x > canvas.width-player.width){
        player.velocity.x=0
        if( player.position.x > canvas.width-player.width)
            player.position.x= canvas.width-player.width
        if(player.position.x < 0)
            player.position.x =  0
     }

    player.update()
}

const player = new Player()
const platforms = [
                    new Platform(200, 200, 300, 60, spriteImages.platformBig),
                    new Platform(500, 300, 300, 60, spriteImages.platformBig),
                    new Platform(900, 400, 300, 60, spriteImages.platformBig),
                    new Platform(1020, 100, 150, 100, spriteImages.platformSmall)
                 ]

const backgrounds =[
                        new Background(0,0,canvas.width-10,canvas.height-10, spriteImages.backgroundBig)
                   ]
animate();

window.addEventListener('keydown', ({key}) =>{
     switch(key){
         case "ArrowLeft": 
            keys.left.pressed= true
            break
         case "ArrowRight": 
            keys.right.pressed= true
            break
         case "ArrowUp": 
            keys.up.pressed = true
            keys.up.jumping = true
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
            keys.up.jumping = false
            break
         case "ArrowDown": 
            console.log("Down")
            break
     }
})

function log(msg){
    console.log(msg)
}


