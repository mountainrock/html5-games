// Get the canvas element
const canvas = document.getElementById("gameCanvas");
const context = canvas.getContext("2d");

// Set up the player character
const player = {
  width: 66,
  widthStand: 177,
  widthRun: 340,
  height: 400,
  destWidth: 60,
  destHeight: 150,
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
  numberOfFramesRun: 30,
  numberOfFramesStand: 60,
  isJumping: false,
  jumpHeight: 10,
  jumpSpeed: 10,
  gravity: 0.4
};
// Load the player image
player.image.src ="images/spriteStandRight.png"

// Set up the game loop
function gameLoop() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Update the player position
  player.x += player.dx;
  player.y += player.dy;

    // Prevent the player from going out of the canvas vertically
    if (player.y + player.height > canvas.height) {
      player.y = canvas.height - player.destHeight;
      player.isJumping = false;
      player.dy = 0; // Reset the vertical velocity when landing
    }
  // Update the player sprite animation

      player.tickCount++;
      if (player.tickCount > player.ticksPerFrame) {
        player.tickCount = 0;
        player.numberOfFrames = player.dx !== 0  ? player.numberOfFramesRun : player.numberOfFramesStand;

        if (player.frameIndex < player.numberOfFrames - 1) {
          player.frameIndex++;
        } else {
          player.frameIndex = 0;
        }
      }

  // Draw the player character
  player.width = (player.dx !== 0  ? player.widthRun : player.widthStand)
  // Apply gravity to the player's vertical movement
  if (player.isJumping) {
     player.dy += player.gravity;
  }

  console.log(player.width)
  //Debug : Draw the player character bounding box for debugging
  //context.fillStyle = "lightblue";
  //context.fillRect(player.x, player.y, player.destWidth, player.destHeight);

  //drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
  context.drawImage(
    player.image,
    player.frameIndex * player.width,
    0,
    player.width,
    player.height,
    player.x,
    player.y,
    player.destWidth,
    player.destHeight
  );
  // Request the next frame
  requestAnimationFrame(gameLoop);
}

// Handle keyboard input
function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    player.dx = -player.speed;
    player.image.src = player.dx === 0 ? "images/spriteStandLeft.png" : "images/spriteRunLeft.png";
  } else if (event.key === "ArrowRight") {
    player.dx = player.speed;
    player.image.src = player.dx === 0 ? "images/spriteStandRight.png" : "images/spriteRunRight.png";

  } else if (event.key === "ArrowUp" && !player.isJumping) {
    player.isJumping = true;
    player.dy = -player.jumpSpeed;
  }  else if (event.key === "ArrowDown") {
    player.dy = 0;
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowLeft") {
    player.dx = 0;
    player.image.src = "images/spriteStandLeft.png";
  } else if (event.key === "ArrowRight") {
    player.dx = 0;
    player.image.src = "images/spriteStandRight.png";
  } else if (event.key === "ArrowUp") {
       if (player.isJumping) {
            player.isJumping = false;
            player.dy = +player.gravity; // Apply gravity to bring the player down
       }else {
               console.log("up pressed " + player.y)
              player.isJumping = true;
              player.dy = -player.jumpSpeed; // Set the vertical velocity for jumping
       }
    }
}

// Add event listeners for keyboard input
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

// Start the game loop
gameLoop();