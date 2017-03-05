//Button Images
var leftButton_img = new Image();
    leftButton_img.crossOrigin = "Anonymous";
    leftButton_img.src="./Images/LeftButton.png";

var rightButton_img = new Image();
    rightButton_img.crossOrigin = "Anonymous";
    rightButton_img.src="./Images/RightButton.png";

var selectButton_img = new Image();
    selectButton_img.crossOrigin = "Anonymous";
    selectButton_img.src="./Images/SelectButton.png";

//Button Shapes


var leftButtonData = {
    images:[leftButton_img],
    frames: {width: 64, height:64},
    animations: {
        normal:0,
        held:1
    }
}
var leftSprite = new createjs.Sprite(new createjs.SpriteSheet(leftButtonData), "normal");
leftSprite.addEventListener("mousedown", function(e){
    leftSprite.gotoAndPlay("held");
    leftSprite.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        leftSprite.gotoAndPlay("normal");
        });
    });
leftSprite.x = 300; leftSprite.y = -300;

var rightButtonData = {
    images:[rightButton_img],
    frames: {width: 64, height:64},
    animations: {
        normal:0,
        held:1
    }
}
var rightSprite = new createjs.Sprite(new createjs.SpriteSheet(rightButtonData),"normal");
rightSprite.addEventListener("mousedown", function(e){
    rightSprite.gotoAndPlay("held");
    rightSprite.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        rightSprite.gotoAndPlay("normal");
        });
    });
rightSprite.x = 500; rightSprite.y = -300;

var selectButtonData = {
    images:[selectButton_img],
    frames: {width: 64, height:64},
    animations: {
        normal:[0],
        held:[1]
    }
}
var selectSprite = new createjs.Sprite(new createjs.SpriteSheet(selectButtonData),"normal");
selectSprite.addEventListener("mousedown", function(e){
    selectSprite.gotoAndPlay("held");
    selectSprite.addEventListener('pressup', function(e){
        e.target.removeAllEventListeners();
        selectSprite.gotoAndPlay("normal");
        });
    });
selectSprite.x = 400; selectSprite.y = -300;

//Menu container
var menu = new createjs.Container();
menu.x = 0;
menu.y = 0;

//Menu boolean
var inMenu = false;

//Test stage
var stage = new createjs.Stage("canvas");
stage.enableMouseOver(10);
function load(){
    init();
}
function init(){
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    startMenu();
}

function tick(event){

}

function lButton(event){

}

function rButton(event){

}

function sButton(event) {

}

function startMenu(){
    menu.addChild(leftSprite,rightSprite,selectSprite);
    stage.addChild(menu);
}