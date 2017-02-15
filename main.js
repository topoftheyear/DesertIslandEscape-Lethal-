var stage;

// Current phase tracker, just in case
var currentPhase;
// Tracks whether movement is currently occurring
var movementOccuring = false;
// Map
var map;
var mapSize = 15;

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
    map = new Array(mapSize);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(mapSize);
    }
    
    // Water tile
    var waterData = {
        images: ["./Images/Water.png"],
        frames: {width:64, height:64},
        framerate: 10,
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
    
    // Sand tile
    var sandData = {
        images: ["./Images/Sand.png"],
        frames: {width:64, height:64},
        animations: {
            exist:[0]
        }
    };
    var sandSheet = new createjs.SpriteSheet(sandData);
    
    // Tree tile
    var treeData = {
        images: ["./Images/Tree.png"],
        frames: {width: 64, height:64},
        framerate: 4,
        animations: {
            exist:[0,7]
        }
    };
    var treeSheet = new createjs.SpriteSheet(treeData);
    
    // Rock tile
    var rockData = {
        images: ["./Images/Rock.png"],
        frames: {width: 64, height: 64},
        animations: {
            exist:[0]
        }
    }
    var rockSheet = new createjs.SpriteSheet(rockData);
    
    // Initial map placement of either grass or water types
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var type;
            
            if (i === 0 || i === map.length - 1 || j === 0 || j === map.length - 1){ 
                // If the tile is on the edge of the map, make it water
                type = "water";
            } else if (i === 1 || i === map.length - 2 || j === 1 || j === map.length - 2){ 
                // If the tile is the next layer in from the edge, make it 75% chance it is water
                if (randomNumber(1,4) === randomNumber(1,4)){
                    type = "grass";
                } else {
                    type = "water";
                }
            } else if (i === 2 || i === map.length - 3 || j === 2 || j === map.length - 3){ 
                // If the tile is 2 layers in, make it 25% chance it is water
                if (randomNumber(1,4) !== randomNumber(1,4)){
                    type = "grass";
                } else {
                    type = "water";
                }
            } else { 
                // All inner tiles have 4% chance of being water
                if (randomNumber(1,25) === randomNumber(1,25)){
                    type = "water";
                } else {
                    type = "grass";
                }
            }
            
            // Add the selected block to the map
            map[i][j] = {type:type, action:""};
        }
    }
    
    // All inner water tiles have 25% chance of being next to other water tiles
    for (var i = 1; i < map.length - 1; i++){
        for (var j = 1; j < map.length - 1; j++){
            if (map[i-1][j].type === "water" || map[i+1][j].type === "water" || map[i][j-1].type === "water" || map[i][j+1].type === "water"){
                if (randomNumber(1,5) === randomNumber(1,5)){
                    map[i][j].type = "water";
                }
            }
        }
    }
    
    // Replace the tiles next to water with sand
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type === "water"){
                if (i + 1 < map.length - 1){
                    if (map[i+1][j].type === "grass"){
                        map[i+1][j].type = "sand";
                    }
                }
                if (i - 1 > 0){
                    if (map[i-1][j].type === "grass"){
                        map[i-1][j].type = "sand";
                    }
                }
                if (j + 1 < map.length - 1){
                    if (map[i][j+1].type === "grass"){
                        map[i][j+1].type = "sand";
                    }
                }
                if (j - 1 > 0){
                    if (map[i][j-1].type === "grass"){
                        map[i][j-1].type = "sand";
                    }
                }
            }
        }
    }
    
    // Populate island with trees, can't be next to another tree
    var treeCount = 3;
    while (treeCount > 0){
        for (var i = 0; i < map.length; i++){
            for (var j = 0; j < map.length; j++){
                if (map[i][j].type === "grass"){
                    if (randomNumber(1,100) === randomNumber(1,100) && map[i-1][j].type !== "tree" && map[i+1][j].type !== "tree" && map[i][j-1].type !== "tree" && map[i][j+1].type !== "tree"){
                        map[i][j].type = "tree";
                        treeCount--;
                    }
                }
            }
        }
    }
    
    // Populate island with rocks, should probably be next to other rocks
    var first = true;
    var rockCount = mapSize / 6;
    while (rockCount > 0){
        for (var i = 0; i < map.length; i++){
            for (var j = 0; j < map.length; j++){
                if (map[i][j].type === "grass" || map[i][j].type === "sand"){
                    if (first){
                        if (randomNumber(1,50) === randomNumber(1,50)){
                            first = false;
                            map[i][j].type = "rock";
                            rockCount--;
                        }
                    } else {
                        if (map[i-1][j].type === "rock" || map[i+1][j].type === "rock" || map[i][j-1].type === "rock" || map[i][j+1].type === "rock"){
                            if (randomNumber(1,4) === randomNumber(1,4)){
                                map[i][j].type = "rock";
                                rockCount--;
                            }
                        } else {
                            if (randomNumber(1,50) === randomNumber(1,50)){
                                map[i][j].type = "rock";
                                rockCount--;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Draw the map
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            var block;
            if (map[i][j].type === "water"){
                block = new createjs.Sprite(waterSheet, "exist");
            } else if (map[i][j].type === "grass"){
                block = new createjs.Sprite(grassSheet, "exist");
            } else if (map[i][j].type === "sand"){
                block = new createjs.Sprite(sandSheet, "exist");
            } else if (map[i][j].type === "tree"){
                block = new createjs.Sprite(treeSheet, "exist");
            } else if (map[i][j].type === "rock"){
                block = new createjs.Sprite(rockSheet, "exist");
            }
            block.x = i * 64;
            block.y = j * 64;
            stage.addChild(block);
        }
    }
}

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}