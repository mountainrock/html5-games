
const PLAYER_VELOCITY=3;
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
}


window.addEventListener('unload', function() {
  document.getElementById('music').pause();
});