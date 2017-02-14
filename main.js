var stage;

// Current phase tracker, just in case
var currentPhase;
// Tracks whether movement is currently occurring
var movementOccuring = false;
// Map size
var mapSize = 11;

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
    
    createjs.Ticker.setFPS(60);
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
    stage.update(event);
}

function generateMap(){
    // Create the map
    var map = new Array(mapSize);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(mapSize);
    }
    
    // Water tile
    var waterData = {
        images: ["./Images/Water.png"],
        frames: {width:64, height:64},
        framerate: 12,
        animations: {
            exist:[0,15]
        }
    };
    var waterSheet = new createjs.SpriteSheet(waterData);
    
    // Grass tile
    var grassData = {
        images: ["./Images/Grass.png"],
        frames: {width:64, height:64},
        framerate: 4,
        animations: {
            exist:[0,3]
        }
    };
    var grassSheet = new createjs.SpriteSheet(grassData);
    
    // Deciding on the tile for the slot
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var type;
            var block;
            
            if (i === 0 || i === map.length - 1 || j === 0 || j === map.length - 1){ 
                // If the tile is on the edge of the map, make it water
                block = new createjs.Sprite(waterSheet, "exist");
                type = "water";
            } else if (i === 1 || i === map.length - 2 || j === 1 || j === map.length - 2){ 
                // If the tile is the next layer in from the edge, make it 75% chance it is water
                if (randomNumber(1,4) === randomNumber(1,4)){
                    block = new createjs.Sprite(grassSheet, "exist");
                    type = "grass";
                } else {
                    block = new createjs.Sprite(waterSheet, "exist");
                    type = "water";
                }
            } else if (i === 2 || i === map.length - 3 || j === 2 || j === map.length - 3){ 
                // If the tile is 2 layers in, make it 25% chance it is water
                if (randomNumber(1,4) !== randomNumber(1,4)){
                    block = new createjs.Sprite(grassSheet, "exist");
                    type = "grass";
                } else {
                    block = new createjs.Sprite(waterSheet, "exist");
                    type = "water";
                }
            } else{ 
                // All inner tiles have 5% chance of being water
                if (randomNumber(1,20) === randomNumber(1,20)){
                    block = new createjs.Sprite(waterSheet, "exist");
                    type = "water";
                } else {
                    block = new createjs.Sprite(grassSheet, "exist");
                    type = "grass";
                }
            }
            
            // Draw the map
            block.x = i * 64;
            block.y = j * 64;
            stage.addChild(block);
            
            // Add the selected block to the map
            map[i][j] = {type:type, action:""};
        }
    }
}

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}