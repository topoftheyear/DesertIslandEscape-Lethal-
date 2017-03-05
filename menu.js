//Declare Empty Buttons
var leftButton;
var rightButton;
var selectButton;

//Menu container
var menu;
var test_g;
var test_shape;

//Test stage
var stage;
function load(){
    init();
}
function init(){
    stage = new createjs.Stage("canvas");
    createjs.Ticker.addEventListener("tick",tick);
    createjs.Ticker.setFPS(60);
    startMenu();
}

function tick(event){

}

function startMenu(){
    leftButton = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/LeftButton.png",64,64,0,{normal:0, held:1}), "normal"));
    rightButton = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/RightButton.png",64,64,0,{normal:0, held:1}),"normal"));
    selectButton = new createjs.Sprite(new createjs.SpriteSheet(generateSpriteSheet("./Images/SelectButton.png",128,64,0,{normal:0, held:1}),"normal"));
    leftButton.addEventListener('mousedown', function(e){
    leftButton.gotoAndPlay("normal");
    leftButton.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        leftButton.gotoAndPlay("exist");
        });
    });
    rightButton.addEventListener('mousedown', function(e){
    rightButton.gotoAndPlay("normal");
    rightButton.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        rightButton.gotoAndPlay("exist");
        });
    });
        selectButton.addEventListener('mousedown', function(e){
    selectButton.gotoAndPlay("normal");
    selectButton.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        selectButton.gotoAndPlay("exist");
        });
    });

    menu = new createjs.Container();
    menu.x = 100; menu.y = -100;
    menu.addChild(leftButton,rightButton,selectButton);
    stage.addChild(test_shape, menu);
}