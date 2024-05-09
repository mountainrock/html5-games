
const PLAYER_VELOCITY=3;
const ENEMY_VELOCITY = -1;
const DEBUG_CANVAS = true;

var score=0;
var level=1;

/** % Relative size to the canvas to make game responsive
eg size = 1000, percent =10  will return 10% of size = 100
*/
function canvasR(size, percent){
    return size * percent/100;
}

function playMusic(src){
     var music = document.getElementById('music')
     music.loop=false
     music.src = "Sounds/Sounds/mp3/"+src +".mp3"
     if(music.paused){
        music.play();
     }
}
function pauseMusic(src){
 if(music.paused == false){
        music.play();
     }
}
function playTheme(src){
     var theme = document.getElementById('theme')
     theme.loop=true
     theme.src = "Sounds/Themes/mp3/"+src +".mp3"
     if(theme.paused){
        theme.play();
     }
}

function log(msg){
    console.log(msg)
    if(DEBUG_CANVAS){
        drawTextBG(msg, 12, 100, 100);
    }
}

function drawTextBG(txt, fontSize, x, y) {
    ctx.save();     /// lets save current state as we make a lot of changes
    ctx.font = fontSize.toString() + "px monospace";
    ctx.globalCompositeOperation = 'xor';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#f50';     /// color for background
    var width = ctx.measureText(txt).width;
    ctx.fillRect(x-5, y-5, width+10, parseInt(ctx.font, 10)+10);        /// draw background rect assuming height of font
    ctx.fillStyle = '#000';// text color
    ctx.fillText(txt, x, y);    /// draw text on top
    ctx.restore();     /// restore original state
}


window.addEventListener('unload', function() {
  document.getElementById('music').pause();
});