// Whole stage
var stage;
// Container the map and characters go into
var gameWorld;

// Current phase tracker, just in case
var currentPhase;

// Tracks whether movement is currently occurring
var movementOccuring = false;
var actionOccuring = false;
var firstTime = false;

// Map
var map;
var mapSize = 17;
var spawn = {x:0, y:0};

// Side Menu
var sideMenu = new createjs.Container();
var foodPile;
var woodPile;
var movesLeft = 0;
var daysRemaining = 0;

// Characters
var character1 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character2 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character3 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var character4 = {sprite:null, food:0, movement:0, sight:0, i:0, j:0, class:""};
var currentCharacter = character1;
var currentArrow;


function load(){
    init();
}

function init(){
    gameWorld = new createjs.Container();
    sideMenu = new createjs.Container();
    stage = new createjs.Stage("canvas");
    gameWorld.x = 256;
    gameWorld.y = 0;
    
    currentPhase = "menu";
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
        
    this.document.onkeydown = keyDown;
}

// Keyboard input
function keyDown(event){
    if (!movementOccuring && currentPhase !== "gameOver" && !actionOccuring){
        var key = event.keyCode;
        
        if (key === 65){
            // A
            if (map[currentCharacter.i-1][currentCharacter.j].type !== "water" && map[currentCharacter.i-1][currentCharacter.j].rock === false && map[currentCharacter.i-1][currentCharacter.j].volcano === false){
                movementOccuring = true;
                currentCharacter.sprite.gotoAndPlay("walkLeft");
                createjs.Tween.get(currentArrow, {override:false}).to({x:currentCharacter.sprite.x - 64}, 1000);
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({x:currentCharacter.sprite.x - 64}, 1000).call(handleComplete);
                currentCharacter.i = currentCharacter.i - 1;
            }
        } else if (key === 68){
            // D
            if (map[currentCharacter.i+1][currentCharacter.j].type !== "water" && map[currentCharacter.i+1][currentCharacter.j].rock === false && map[currentCharacter.i+1][currentCharacter.j].volcano === false){
                movementOccuring = true;
                currentCharacter.sprite.gotoAndPlay("walk");
                createjs.Tween.get(currentArrow, {override:false}).to({x:currentCharacter.sprite.x + 64}, 1000);
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({x:currentCharacter.sprite.x + 64}, 1000).call(handleComplete);
                currentCharacter.i = currentCharacter.i + 1;
            }
        } else if (key === 87){
            // W
            if (map[currentCharacter.i][currentCharacter.j-1].type !== "water" && map[currentCharacter.i][currentCharacter.j-1].rock === false && map[currentCharacter.i][currentCharacter.j-1].volcano === false){
                movementOccuring = true;
                currentCharacter.sprite.gotoAndPlay("walkLeft");
                createjs.Tween.get(currentArrow, {override:false}).to({y:currentCharacter.sprite.y - 64 - 32}, 1000);
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({y:currentCharacter.sprite.y - 64}, 1000).call(handleComplete);
                currentCharacter.j = currentCharacter.j - 1;
            }
        } else if (key === 83){
            // S
            if (map[currentCharacter.i][currentCharacter.j+1].type !== "water" && map[currentCharacter.i][currentCharacter.j+1].rock === false && map[currentCharacter.i][currentCharacter.j+1].volcano === false){
                movementOccuring = true;
                currentCharacter.sprite.gotoAndPlay("walk");
                createjs.Tween.get(currentArrow, {override:false}).to({y:currentCharacter.sprite.y + 64 - 32}, 1000);
                createjs.Tween.get(currentCharacter.sprite, {override:false}).to({y:currentCharacter.sprite.y + 64}, 1000).call(handleComplete);
                currentCharacter.j = currentCharacter.j + 1;
            }
        } else if (key === 13){
            // Enter key for temporary menu bypass
            currentPhase = "gameStart";
        }
    }
}

function handleComplete(){
    movementOccuring = false;
    currentCharacter.sprite.gotoAndPlay("exist");
    movesLeft--;
}

// Mouse map drag and drop
function mouseDnD(e){
    gameWorld.posX = e.stageX;
    gameWorld.posY = e.stageY;
    gameWorld.addEventListener('pressmove', function (e) {
        if (!actionOccuring){
            gameWorld.x = -gameWorld.posX + e.stageX + gameWorld.x; 
            gameWorld.y = -gameWorld.posY + e.stageY + gameWorld.y; 
        
            gameWorld.posX = e.stageX;
            gameWorld.posY = e.stageY;
        
            if (gameWorld.x > 256){
                gameWorld.x = 256;
            } else if (gameWorld.x + (mapSize * 64) < stage.width){
                gameWorld.x = stage.width - (mapSize * 64);
            }
            
            if (gameWorld.y > 0){
                gameWorld.y = 0;
            } else if (gameWorld.y + (mapSize * 64) < stage.height){
                gameWorld.y = stage.height - (mapSize * 64);
            }
        }
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
        stage.height = cnv.height;
        stage.width = cnv.width;
        
    }
    
    if (currentPhase === "menu"){
        
    }
    
    if (!actionOccuring){
        if (currentPhase === "gameStart"){
            generateMap();
            generateCharacters("default", "default", "default", "default");
            generateSideMenu();
    
            // Map movement by mouse added
            gameWorld.addEventListener('mousedown', mouseDnD);
    
            // Current player marker
            currentArrow = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/CurrentArrow.png", 32, 32, 8, {exist:[0,3]})), "exist");
            gameWorld.addChild(currentArrow);
        
            stage.addChild(gameWorld);
            stage.addChild(sideMenu);
        
            // Game Initialization
            currentPhase = "turnStart";
            foodPile = 16;
            woodPile = 0;
            daysRemaining = 7;
            currentCharacter = character1;
        
    
            currentPhase = "turnStart";
        }
    
        // Sets up the turn
        if (currentPhase === "turnStart"){
            currentPhase = "turn";
            movesLeft = currentCharacter.movement;
            currentArrow.x = currentCharacter.sprite.x;
            currentArrow.y = currentCharacter.sprite.y - 32;
        } else if (currentPhase === "turnEnd"){
            foodPile = foodPile - character1.food - character2.food - character3.food - character4.food;
            daysRemaining--;
            currentPhase = "turnStart";
        }
    
        // Checks if the space the current character is on has an action
        if (currentPhase === "turn" && map[currentCharacter.i][currentCharacter.j].action !== "nothing" && map[currentCharacter.i][currentCharacter.j].action !== "spawn" && !movementOccuring){
            actionOccuring = true;
            firstTime = true;
        }
    
        // Next character selector
        if (movesLeft === 0 && currentPhase === "turn"){
            nextCharacter();
            if (currentCharacter === character1){
                currentPhase = "turnEnd";
            } else{
                currentPhase = "turnStart";
            }
        }
    
        // Game loss check
        if (currentPhase !== "menu" && currentPhase !== "gameStart" && daysRemaining === 0 || foodPile < 0){
            currentPhase = "gameOver";
        }
    } else{
        if (firstTime){
            var yesSprite = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/YesButton.png", 64, 64, 0, {exist:[0], held:[1]})), "exist");
            var noSprite = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/NoButton.png", 64, 64, 0, {exist:[0], held:[1]})), "exist");
            //yesSprite.x = ((stage.width - 256) / 2 - 10);
            //yesSprite.y = 54;
            //noSprite.x = ((stage.width - 256) / 2 + 74);
            //noSprite.y = 54;
            
            popup = new createjs.Container();
            popup.x = ((stage.width - 256) / 2) - 128;
            popup.y = -256;
    
            var g1 = new createjs.Graphics().beginFill("black").drawRoundRect((stage.width - 256) / 2 - 128, -128, 384, 256, 10);
            var popupBackground = new createjs.Shape(g1);
            var g2 = new createjs.Graphics().beginFill("#d3d3d3").drawRoundRect((stage.width - 256) / 2 - 123, -123, 374, 246, 30);
            var popupBackground2 = new createjs.Shape(g2);
            popup.addChild(popupBackground, popupBackground2);
            
            action = map[currentCharacter.i][currentCharacter.j];
            //if (action === "food"){
                yesSprite.x = ((stage.width - 256) / 2 + 32);
                yesSprite.y = 54;
                
                popup.addChild(yesSprite);
                
                var text1 = new createjs.Text("You wandered across a bush", "32px VT323", "black");
                text1.x = ((stage.width - 256) / 2 - 128 + 24);
                text1.y = -118;
                popup.addChild(text1);
                
                var text2 = new createjs.Text("and found some food in it!", "32px VT323", "black");
                text2.x = ((stage.width - 256) / 2 - 128 + 24);
                text2.y = -76;
                popup.addChild(text2);
            //}
            stage.addChild(popup);
            
            createjs.Tween.get(popup, {override:false}).to({y:stage.height / 2}, 1000);
            firstTime = false;
        }            
    }
    
    // Game stuff update
    if (currentPhase !== "menu" && currentPhase !== "gameStart"){
        sideMenu.getChildAt(1).text = (":" + foodPile);
        sideMenu.getChildAt(3).text = (":" + woodPile);
        sideMenu.getChildAt(5).text = (":" + daysRemaining);
        sideMenu.getChildAt(7).text = (":" + movesLeft);
    }
    
    stage.update(event);
}

// Whaow
function generateSpriteSheet(source, w, h, fps, anime){
    var img = new Image();
    img.crossOrigin="Anonymous";
    img.src = source;
    var data = {
        images: [img],
        frames: {width:w, height:h},
        framerate: fps,
        animations: anime
    }
    return data;
}

// Generates the map, complete with events and stuff
function generateMap(){
    // Create the map
    map = new Array(mapSize);
    for (var i = 0; i < map.length; i++){
        map[i] = new Array(mapSize);
    }
    
    var waterSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Water.png", 64, 64, 10, {exist:[0,15]}));
    var grassSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Grass.png", 64, 64, 4, {exist:[0,3]}));
    var sandSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Sand.png", 64, 64, 0, {exist:[0]}));
    var treeSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Tree.png", 64, 64, 4, {exist:[0,7]}));
    var rockSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Rock.png", 64, 64, 15, {exist:[0], destroy:[1,10]}));
    var bushSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Bush.png", 64, 64, 4, {exist:[0,3]}));
    var volcanoSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Volcano.png", 64, 64, 10, {exist:[0,1]}));
    var actionSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Action.png", 64, 64, 12, {exist:[0,13]}));
    
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
                    if (randomNumber(1,3) === randomNumber(1,3)){
                        map[i][j].action = "enemy";
                    } else if (randomNumber(1,5) === randomNumber(1,5)){
                        map[i][j].action = "pit";
                    } else {
                        map[i][j].action = "food";
                    }
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
    var defaultCharacterSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/DefaultCharacter.png", 32, 32, 5, {exist:[0], walk:[1,4], walkLeft:[5,8], punch:[9,10]}));
    
    for (var i = 1; i < 5; i++){
        var type;
        switch(i){
            case 1:
                currentCharacter = character1;
                type = type1;
                break;
            case 2:
                currentCharacter = character2;
                type = type2;
                break;
            case 3:
                currentCharacter = character3;
                type = type3;
                break;
            case 4:
                currentCharacter = character4;
                type = type4;
                break;
        }
        
        if (type === "default"){
            currentCharacter.class = "default";
            currentCharacter.sprite = new createjs.Sprite(defaultCharacterSheet, "exist");
            currentCharacter.food = 2;
            currentCharacter.movement = 4;
            currentCharacter.sight = 1;
        }
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

// Generate the side menu
function generateSideMenu(){
    // Side menu
    var g1 = new createjs.Graphics().beginFill("#d3d3d3").drawRect(0, 0, 256, window.innerHeight);
    var sideMenuBackground = new createjs.Shape(g1);
    sideMenu.addChild(sideMenuBackground);
    
    // 0
    var foodText = new createjs.Text(":" + foodPile, "64px VT323", "black");
    foodText.x = 128;
    foodText.y = 128;
    sideMenu.addChild(foodText);
    
    // 1
    var foodSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Apple.png", 64, 64, 0, {exist:[0]}));
    var foodSprite = new createjs.Sprite(foodSheet, "exist");
    foodSprite.x = 64;
    foodSprite.y = 128;
    sideMenu.addChild(foodSprite);
    
    // 2
    var woodText = new createjs.Text(":" + woodPile, "64px VT323", "black");
    woodText.x = 128;
    woodText.y = 192;
    sideMenu.addChild(woodText);
    
    // 3
    var woodSheet = new createjs.SpriteSheet(generateSpriteSheet("./Images/Log.png", 64, 64, 0, {exist:[0]}));
    var woodSprite = new createjs.Sprite(woodSheet, "exist");
    woodSprite.x = 64;
    woodSprite.y = 192;
    sideMenu.addChild(woodSprite);
    
    // 4
    var daysText = new createjs.Text(":" + daysRemaining, "64px VT323", "black");
    daysText.x = 128;
    daysText.y = 256;
    sideMenu.addChild(daysText);
    
    // 5
    var daysText2 = new createjs.Text("Days Left", "32px VT323", "black");
    daysText2.x = 10;
    daysText2.y = 272;
    sideMenu.addChild(daysText2);
    
    // 7
    var movesText = new createjs.Text(":" + movesLeft, "64px VT323", "black");
    movesText.x = 128;
    movesText.y = 320;
    sideMenu.addChild(movesText);
    
    // 8
    var movesText2 = new createjs.Text("Moves", "32px VT323", "black");
    movesText2.x = 64;
    movesText2.y = 336;
    sideMenu.addChild(movesText2);
    
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