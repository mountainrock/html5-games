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
  background:"images/background.png"
};

class Player{
    constructor(){
        this.width=66
        this.height=400

        this.frameIndex =1
        this.standing= { cropWidth: 177, cropHeight:400, destWidth: 60,  destHeight:150, numberOfFrames: 60 }
        this.running= { cropWidth: 340, numberOfFrames: 29 }

        this.position={ x:100, y: canvas.height - this.standing.destHeight}
        this.velocity={ x:0, y:0}
        this.image= new Image()
        this.image.src = spriteImages.playerStandRight;
        this.height = this.standing.destHeight
    }

    draw(){
        if (this.frameIndex < this.standing.numberOfFrames - 1) {
          this.frameIndex++;
        } else {
          this.frameIndex = 1;
        }
        //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        c.drawImage(
            this.image,
            this.frameIndex * this.standing.cropWidth,0,
            this.standing.cropWidth, this.standing.cropHeight,
            this.position.x, this.position.y,
            this.standing.destWidth, this.standing.destHeight
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


const player = new Player()
const keys ={
    left:{pressed:false},
    right:{pressed:false},   
    up:{pressed:false, jumping : false},   

}

function animate(){
    requestAnimationFrame(animate)
    c.clearRect(0,0, canvas.width, canvas.height)
    player.update()
    
    if(keys.right.pressed)
        player.velocity.x =  5
    else if(keys.left.pressed)
        player.velocity.x = -5
    else
        player.velocity.x =  0

    if(keys.up.pressed)
        player.velocity.y =  -10
    else if(keys.up.jumping)
        player.velocity.y =  10
    
}

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



