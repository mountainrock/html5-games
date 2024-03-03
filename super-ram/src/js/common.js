/** % Relative size to the canvas to make game responsive
eg size = 1000, percent =10  will return 10% of size = 100
*/
function canvasR(size, percent){
    return size * percent/100;
}

function playMusic(){
     var music = document.getElementById('music')
     if(music.paused){
        music.play();
     }
}


function log(msg){
    console.log(msg)
}


window.addEventListener('unload', function() {
  document.getElementById('music').pause();
});