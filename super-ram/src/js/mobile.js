function handleTouchStart(event) {
    const touches = event.touches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        if (touchIsOnLeft(touch)) {
            keys.left.pressed = true;
        } else if (touchIsOnRight(touch)) {
            keys.right.pressed = true;
        } else if (touchIsOnJump(touch)) {
            keys.up.pressed = true;
            player.isJumping = true;
        }
    }
}

function handleTouchEnd(event) {
    const touches = event.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        if (touchIsOnLeft(touch)) {
            keys.left.pressed = false;
        } else if (touchIsOnRight(touch)) {
            keys.right.pressed = false;
        } else if (touchIsOnJump(touch)) {
            keys.up.pressed = false;
            player.isJumping = false;
        }
    }
}

// Helper functions to determine where the touch is on the screen
function touchIsOnLeft(touch) {
    // Define logic to determine if the touch is on the left side of the screen
    return touch.pageX < window.innerWidth / 3; // Example logic
}

function touchIsOnRight(touch) {
    // Define logic to determine if the touch is on the right side of the screen
    return touch.pageX > window.innerWidth * 2 / 3; // Example logic
}

function touchIsOnJump(touch) {
    // Define logic to determine if the touch is on the jump area of the screen
    return touch.pageY < window.innerHeight / 2; // Example logic
}

function preventDefaultTouch(event) {
    event.preventDefault();
}

window.addEventListener('touchstart', preventDefaultTouch, { passive: false });
window.addEventListener('touchmove', preventDefaultTouch, { passive: false });
window.addEventListener('touchend', preventDefaultTouch, { passive: false });