// Whole stage
var stage;
// Container the map and characters go into
var gameWorld;

// Current phase tracker, just in case
var currentPhase;

// Tracks whether movement is currently occurring
var movementOccuring = false;

// Map
var map;
var mapSize = 17;
var spawn = {x:0, y:0};

// Side Menu
var g1;
var sideMenu;

// Characters
var character1 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character2 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character3 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character4 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var currentCharacter = character1;

// Game stuff
var movesLeft = 0;


function load(){
    init();
}

function init(){
    gameWorld = new createjs.Container();
    stage = new createjs.Stage("canvas");
    gameWorld.x = 0;
    gameWorld.y = 0;
    
    currentPhase = "menu";
    
    generateMap();
    generateCharacters("default", "default", "default", "default");
    
    // Side menu
    g1 = new createjs.Graphics().beginFill("#d3d3d3").drawRect(0, 0, 256, window.innerHeight);
    sideMenu = new createjs.Shape(g1);
    
    // Map movement by mouse added
    gameWorld.addEventListener('mousedown', mouseDnD);
    
    stage.addChild(gameWorld);
    stage.addChild(sideMenu);
    
    currentPhase = "turnStart";
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
        
    this.document.onkeydown = keyDown;
}

// Keyboard input
function keyDown(event){
    if (!movementOccuring){
        var key = event.keyCode;
        
        if (key === 65){
            // A
            if (!movementOccuring){
                movementOccuring = true;
                movesLeft--;
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({x:currentCharacter.sprite.x - 64}, 500).call(handleComplete);
                currentCharacter.i = currentCharacter.i - 1;
            }
        } else if (key === 68){
            // D
            if (!movementOccuring){
                movementOccuring = true;
                movesLeft--;
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({x:currentCharacter.sprite.x + 64}, 500).call(handleComplete);
                currentCharacter.i = currentCharacter.i + 1;
            }
        } else if (key === 87){
            // W
            if (!movementOccuring){
                movementOccuring = true;
                movesLeft--;
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({y:currentCharacter.sprite.y - 64}, 500).call(handleComplete);
                currentCharacter.j = currentCharacter.j - 1;
            }
        } else if (key === 83){
            // S
            if (!movementOccuring){
                movementOccuring = true;
                movesLeft--;
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({y:currentCharacter.sprite.y + 64}, 500).call(handleComplete);
                currentCharacter.j = currentCharacter.j + 1;
            }
        }
    }
}

function handleComplete(){
    movementOccuring = false;
}

// Mouse map drag and drop
function mouseDnD(e){
    gameWorld.posX = e.stageX;
    gameWorld.posY = e.stageY;
    gameWorld.addEventListener('pressmove', function (e) {
        gameWorld.x = -gameWorld.posX + e.stageX + gameWorld.x; 
        gameWorld.y = -gameWorld.posY + e.stageY + gameWorld.y; 
        
        gameWorld.posX = e.stageX;
        gameWorld.posY = e.stageY;
    });
    gameWorld.addEventListener('pressup', function (e) {
        e.target.removeAllEventListeners();
    });
}

// This method is essentially what should happen every frame regardless of events
function tick(event){
    // Window resizing
    if (window.innerHeight < 960 + 256)
    {
        var cnv = document.getElementById("canvas");
        cnv.height = window.innerHeight - 10;
        cnv.width = window.innerHeight - 10 + 256;
        
    }
    
    if (currentPhase === "turnStart"){
        currentPhase = "turn";
        movesLeft = currentCharacter.movement;
    }
    
    if (movesLeft === 0){
        nextCharacter();
        currentPhase = "turnStart";
    }
    
    stage.update(event);
}

// Generates the map, complete with events and stuff
function generateMap(){
    // Create the map
    map = new Array(mapSize);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(mapSize);
    }
    
    // Water tile
    var img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Water.png";
    var waterData = {
        images: [img],
        frames: {width:64, height:64},
        framerate: 10,
        animations: {
            exist:[0,15]
        }
    };
    var waterSheet = new createjs.SpriteSheet(waterData);
    
    // Grass tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Grass.png";
    var grassData = {
        images: [img],
        frames: {width:64, height:64},
        framerate: 4,
        animations: {
            exist:[0,3]
        }
    };
    var grassSheet = new createjs.SpriteSheet(grassData);
    
    // Sand tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Sand.png";
    var sandData = {
        images: [img],
        frames: {width:64, height:64},
        animations: {
            exist:[0]
        }
    };
    var sandSheet = new createjs.SpriteSheet(sandData);
    
    // Tree tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Tree.png";
    var treeData = {
        images: [img],
        frames: {width: 64, height:64},
        framerate: 4,
        animations: {
            exist:[0,7]
        }
    };
    var treeSheet = new createjs.SpriteSheet(treeData);
    
    // Rock tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Rock.png";
    var rockData = {
        images: [img],
        frames: {width: 64, height: 64},
        animations: {
            exist:[0]
        }
    }
    var rockSheet = new createjs.SpriteSheet(rockData);
    
    // Bush tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Bush.png";
    var bushData = {
        images: [img],
        frames: {width: 64, height: 64},
        framerate: 4,
        animations: {
            exist:[0,3]
        }
    }
    var bushSheet = new createjs.SpriteSheet(bushData);
    
    // Volcano tile
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Volcano.png";
    var volcanoData = {
        images: [img],
        frames: {width: 64, height: 64},
        framerate: 10,
        animations: {
            exist:[0,1]
        }
    }
    var volcanoSheet = new createjs.SpriteSheet(volcanoData);
    
    // Action item
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/Action.png";
    var actionData = {
        images: [img],
        frames: {width: 64, height: 64},
        framerate: 12,
        animations: {
            exist:[0,13]
        }
    }
    var actionSheet = new createjs.SpriteSheet(actionData);
    
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
            map[i][j] = {type:type, action:"nothing", rock:false, bush:false, spawn:false, fog:false, volcano:false};
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
                    if (randomNumber(1,100) === randomNumber(1,100) && map[i-1][j].type !== "tree" && map[i+1][j].type !== "tree" && map[i][j-1].type !== "tree" && map[i][j+1].type !== "tree" && map[i-1][j + 1].type !== "tree" && map[i+1][j-1].type !== "tree" && map[i+1][j+1].type !== "tree" && map[i-1][j-1].type !== "tree"){
                        map[i][j].type = "tree";
                        treeCount--;
                    }
                }
            }
        }
    }
    
    // Populate island with rocks, should probably be next to other rocks
    var first = true;
    var rockCount = mapSize / 5;
    while (rockCount > 0){
        for (var i = 0; i < map.length; i++){
            for (var j = 0; j < map.length; j++){
                if (map[i][j].type === "grass" || map[i][j].type === "sand"){
                    if (first){
                        if (randomNumber(1,50) === randomNumber(1,50)){
                            first = false;
                            map[i][j].rock = true;
                            rockCount--;
                        }
                    } else {
                        if (map[i-1][j].rock === true || map[i+1][j].rock === true || map[i][j-1].rock === true || map[i][j+1].rock === true){
                            if (randomNumber(1,4) === randomNumber(1,4)){
                                map[i][j].rock = true;
                                rockCount--;
                            }
                        } else {
                            if (randomNumber(1,50) === randomNumber(1,50)){
                                map[i][j].rock = true;
                                rockCount--;
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Populate island with bushes, biased towards spawning with other bushes
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type === "grass" && map[i][j].rock !== true){
                if (map[i-1][j].bush === true || map[i+1][j].bush === true || map[i][j-1].bush === true || map[i][j+1].bush === true){
                    if (randomNumber(1,2) === randomNumber(1,2)){
                        map[i][j].bush = true;
                    }
                } else {
                    if (randomNumber(1,4) === randomNumber(1,4)){
                        map[i][j].bush = true;
                    }
                }
            }
        }
    }
    
    // Add a volcano (important)
    var volcanoCount = 1;
    while (volcanoCount > 0){
        for (var i = 2; i < map.length - 2; i++){
            if (volcanoCount === 0){
                break;
            }
        
            for (var j = 2; j < map.length - 2; j++){
                if (volcanoCount === 0){
                    break;
                }
            
                if (map[i][j].type === "grass" || map[i][j].type === "sand"){
                    if (map[i][j].rock === false && map[i][j].bush === false){
                        if (randomNumber(1,100) === randomNumber(1,100)){
                            map[i][j].volcano = true;
                            volcanoCount--;
                        }
                    }
                } 
            }
        }
    }
    
    // Add events to the tiles
    for (var i = 0; i < map.length; i++){
        for (var j = 0; j < map.length; j++){
            if (map[i][j].type !== "water" || map[i][j].rock === true){
                if (map[i][j].bush === true){
                    map[i][j].action = "something";
                } else if (map[i][j].type === "tree"){
                    map[i][j].action = "tree";
                }
            }
        }
    }
    
    // Set spawn
    var spawnStop = false;
    for (var i = 0; i < map.length; i++){
        if (spawnStop){
            break;
        }
        for (var j = 0; j < map.length; j++){
            if (spawnStop){
                break;
            }
            if (map[i][j].type === "grass" && map[i-1][j].rock === false && map[i-1][j].volcano === false){
                spawn.x = i-1;
                spawn.y = j;
                map[i-1][j].action = "spawn";
                spawnStop = true;
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
            }
            block.x = i * 64;
            block.y = j * 64;
            gameWorld.addChild(block);
            
            if (map[i][j].rock === true){
                block = new createjs.Sprite(rockSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            } else if (map[i][j].bush === true){
                block = new createjs.Sprite(bushSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            } else if (map[i][j].volcano === true){
                block = new createjs.Sprite(volcanoSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            }
            
            if (map[i][j].action !== "nothing" && map[i][j].action !== "spawn"){
                block = new createjs.Sprite(actionSheet, "exist");
                block.x = i * 64;
                block.y = j * 64;
                gameWorld.addChild(block);
            }
        }
    }
}

// Character generation based on classes given
function generateCharacters(type1, type2, type3, type4){
    // Give the character the stats based on the respective type given
    // Default
    img = new Image();
    img.crossOrigin="Anonymous";
    img.src = "./Images/DefaultCharacter.png";
    var defaultCharacterData = {
        images: [img],
        frames: {width: 32, height: 32},
        framerate: 5,
        animations: {
            exist:[0],
            walk:[1,4],
            walkLeft:[5,8],
            punch:[9,10]
        }
    }
    var defaultCharacterSheet = new createjs.SpriteSheet(defaultCharacterData);
    
    if (type1 === 'default'){
        character1.class = "default";
        character1.sprite = new createjs.Sprite(defaultCharacterSheet, "exist");
        character1.food = 2;
        character1.movement = 4;
        character1.sight = 1;
    }
    if (type2 === 'default'){
        character2.class = "default";
        character2.sprite = new createjs.Sprite(defaultCharacterSheet, "exist");
        character2.food = 2;
        character2.movement = 4;
        character2.sight = 1;
    }
    if (type3 === 'default'){
        character3.class = "default";
        character3.sprite = new createjs.Sprite(defaultCharacterSheet, "exist");
        character3.food = 2;
        character3.movement = 4;
        character3.sight = 1;
    }
    if (type4 === 'default'){
        character4.class = "default";
        character4.sprite = new createjs.Sprite(defaultCharacterSheet, "exist");
        character4.food = 2;
        character4.movement = 4;
        character4.sight = 1;
    }
    // Put them in the map[][] at spawn, and draw them in staggered per corner
    character1.i = spawn.x;
    character1.j = spawn.y;
    character1.sprite.x = spawn.x * 64;
    character1.sprite.y = spawn.y * 64;
    gameWorld.addChild(character1.sprite);
    
    character2.i = spawn.x;
    character2.j = spawn.y;
    character2.sprite.x = spawn.x * 64 + 32;
    character2.sprite.y = spawn.y * 64;
    gameWorld.addChild(character2.sprite);
    
    character3.i = spawn.x;
    character3.j = spawn.y;
    character3.sprite.x = spawn.x * 64;
    character3.sprite.y = spawn.y * 64 + 32;
    gameWorld.addChild(character3.sprite);
    
    character4.i = spawn.x;
    character4.j = spawn.y;
    character4.sprite.x = spawn.x * 64 + 32;
    character4.sprite.y = spawn.y * 64 + 32;
    gameWorld.addChild(character4.sprite);
}

// Lets the next character take their turn
function nextCharacter(){
    if (currentCharacter === character1){
        currentCharacter = character2;
    } else if (currentCharacter === character2){
        currentCharacter = character3;
    } else if (currentCharacter === character3){
        currentCharacter = character4;
    } else{
        currentCharacter = character1;
    }
}

function randomNumber(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}