var stage;

// Current phase tracker, just in case
var currentPhase;
// Tracks whether movement is currently occurring
var movementOccuring = false;

var circle;
var g_circle;


function load(){
    init();
}

function init(){
    stage = new createjs.Stage("canvas");
    currentPhase = "menu";
    
    generateMap();
    
    stage.update();
    
    createjs.Ticker.setFPS(120);
    createjs.Ticker.addEventListener("tick", tick);
        
    this.document.onkeydown = keyDown;
}

// Keyboard input
function keyDown(event){
    if (!movementOccuring){
        switch(event.keyCode){
            case 65: // A
                break;
            case 68: // D
                break;
            case 87: // W
                break;
            case 83: // S
                break;
        }
    }
}

function handleComplete(){
    movementOccuring = false;
}

// This method is essentially what should happen every frame regardless of events
function tick(event){
    stage.update();
}

function generateMap(){
    // Create the map
    var map = new Array(11);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(11);
    }
    
    // Water tile
    var waterData = {
        images: ["./Images/Water.png"],
        frames: {width:32, height:32},
        animations: {
            exist:[0,15]
        }
    };
    var waterSheet = new createjs.SpriteSheet(waterData);
    var waterAnimation = new createjs.Sprite(waterSheet, "exist");
    
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            waterAnimation.x = i * 16;
            waterAnimation.y = j * 16;
            stage.addChild(waterAnimation);
        }
    }
}