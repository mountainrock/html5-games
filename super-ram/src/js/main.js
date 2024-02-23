// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

const spriteImages = {
  playerStandRight: "images/spriteStandRight.png",
  playerStandLeft: "images/spriteStandLeft.png",
  playerRunRight: "images/spriteRunRight.png",
  playerRunLeft: "images/spriteRunLeft.png",
  platformBig:"images/platform.png",
  platformSmall:"images/platformSmallTall.png",
  background:"images/background.png"
};

// Set up the player character
const player = {
  width: 66,
  height: 400,
  destWidth: 60,
  destHeight: 150,
  standing: {
      cropWidth: 177,
      numberOfFrames: 60
    },
    running: {
      cropWidth: 340,
      numberOfFrames: 29
  },
  x: 50,
  y: canvas.height - 150,
  speed: 8,
  dx: 0,
  dy: 0,
  image: new Image(),
  frameIndex: 0,
  tickCount: 0,
  ticksPerFrame: 1,
  numberOfFrames: 0,
  isJumping: false,
  jumpHeight: 10,
  jumpSpeed: 10,
  gravity: 0.4
};
// Load the player image
player.image.src = spriteImages.playerStandRight;

const platform = {
  x: 200, // X position of the platform
  y: canvas.height - 200, // Y position of the platform
  width: 300, // Width of the platform
  height: 60, // Height of the platform
  image: new Image(),
};

platform.image.src = spriteImages.platformBig;

const platformSmall = {
  x: 700, // X position of the platform
  y: canvas.height - 100, // Y position of the platform
  width: 150, // Width of the platform
  height: 100, // Height of the platform
  image: new Image(),
};

platformSmall.image.src = spriteImages.platformSmall;

const backgroundImage = new Image();
backgroundImage.src = spriteImages.background;

// Set up the game loop
function gameLoop() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Update the player position
    player.x += player.dx;
    player.y += player.dy;

    // Update the platform position based on the player's movement
    platform.x -= player.dx;
    platformSmall.x -= player.dx;

 // Draw the parallax background
    const backgroundX = -player.x * 0.2; // Adjust the parallax speed as needed
    context.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);

    preventPlayerCanvasMovingOut();

    // Update the player sprite animation
    player.tickCount++;
    if (player.tickCount > player.ticksPerFrame) {
        player.tickCount = 0;
        player.numberOfFrames = player.dx !== 0  ? player.running.numberOfFrames : player.standing.numberOfFrames;

        if (player.frameIndex < player.numberOfFrames - 1) {
          player.frameIndex++;
        } else {
          player.frameIndex = 0;
        }
    }


    // Apply gravity to the player's vertical movement
    if (player.isJumping) {
      player.dy += player.gravity;
      player.y += player.dy;

      // Check if the player has landed
      if (player.y + player.destHeight > canvas.height) {
        player.y = canvas.height - player.destHeight;
        player.isJumping = false;
        player.dy = 0; // Reset the vertical velocity when landing
      }

    }
    // Draw the player character
    player.width = player.dx !== 0  ?  player.running.cropWidth : player.standing.cropWidth;


    //Debug : Draw the player character bounding box for debugging
    //context.fillStyle = "lightblue";
    //context.fillRect(player.x, player.y, player.destWidth, player.destHeight);

    //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
    context.drawImage(
        player.image,
        player.frameIndex * player.width,0,
        player.width, player.height,
        player.x, player.y,
        player.destWidth, player.destHeight
    );

    // Draw the platform
    context.drawImage(platform.image, platform.x, platform.y, platform.width, platform.height);
    context.drawImage(platformSmall.image, platformSmall.x, platformSmall.y, platformSmall.width, platformSmall.height);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

function preventPlayerCanvasMovingOut(){
    // Prevent the player from going out of the canvas vertically
    if (player.y < 0) {
      player.y = 0;
      player.dy = 0;
    }else if (player.y + player.destHeight > canvas.height) {
         player.y = canvas.height - player.destHeight;
         player.dy = 0;
    }

    // Prevent the player from going out of the canvas horizontally
    if (player.x < 0) {
      player.x = 0;
      player.dx = 0;
    } else if (player.x + player.destWidth > canvas.width) {
      player.x = canvas.width - player.destWidth;
      player.dx = 0;
    }

    // Apply gravity to the player's vertical movement
      if (player.isJumping) {
        player.dy += player.gravity;
        player.y += player.dy;

        // Check if the player has landed on the platform
        if (isPlayerOnPlatform()) {
          player.y = platform.y - player.destHeight;
          player.isJumping = false;
          player.dy = 0; // Reset the vertical velocity when landing
        } else if (player.y + player.destHeight > canvas.height) {
          player.y = canvas.height - player.destHeight;
          player.isJumping = false;
          player.dy = 0; // Reset the vertical velocity when landing
        }
      }
}

function isPlayerOnPlatform() {
  return (
    player.y + player.destHeight >= platform.y &&
    player.y + player.destHeight <= platform.y + player.dy &&
    player.x + player.destWidth >= platform.x &&
    player.x <= platform.x + platform.width
  );
}


// Handle keyboard input
function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    player.dx = -player.speed;
    player.image.src = player.dx === 0 ? spriteImages.playerStandLeft : spriteImages.playerRunLeft;
  } else if (event.key === "ArrowRight") {
    player.dx = player.speed;
    player.image.src = player.dx === 0 ? spriteImages.playerStandRight : spriteImages.playerRunRight;

  } else if (event.key === "ArrowUp" && !player.isJumping) {
    player.isJumping = true;
    player.dy = -player.jumpSpeed;
  }  else if (event.key === "ArrowDown") {
    player.dy = player.speed;
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft") {
        player.dx = 0;
        player.image.src = spriteImages.playerStandLeft;
  } else if (event.key === "ArrowRight") {
        player.dx = 0;
        player.image.src = spriteImages.playerStandRight;
  } else if (event.key === "ArrowUp") {
       if (player.isJumping) {
          player.isJumping = false;
          player.dy = +player.gravity; // Apply gravity to bring the player down
       }else {
          log("up pressed " + player.y)
          player.isJumping = true;
          player.dy = -player.jumpSpeed; // Set the vertical velocity for jumping
       }
    }
}

function log(msg){
    console.log(msg)
}
// Add event listeners for keyboard input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

log("Start the game loop");
gameLoop();