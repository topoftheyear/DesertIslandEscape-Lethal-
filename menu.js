//Declare Empty Buttons
var leftButton;
var rightButton;
var selectButton;

// leftSprite.addEventListener("mousedown", function(e){
//     leftSprite.gotoAndPlay("held");
//     leftSprite.addEventListener('pressup', function(e){
//         e.target.removeAllEventListeners();
//         leftSprite.gotoAndPlay("normal");
//         });
//     });




// rightSprite.addEventListener("mousedown", function(e){
//     rightSprite.gotoAndPlay("held");
//     rightSprite.addEventListener('pressup', function(e){
//         e.target.removeAllEventListeners();
//         rightSprite.gotoAndPlay("normal");
//         });
//     });



// selectSprite.addEventListener("mousedown", function(e){
// selectSprite.gotoAndPlay("held");
// selectSprite.addEventListener('pressup', function(e){
//     e.target.removeAllEventListeners();
//     selectSprite.gotoAndPlay("normal");
//     });
// });


//Menu container
var menu;
menu.x = 0;
menu.y = 0;
var test_g;
var test_shape;

//Menu boolean
var inMenu = false;

//Test stage
var stage;
function load(){
    init();
}
function init(){
    stage = new createjs.Stage("canvas");
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    startMenu();
}

function tick(event){

}

function startMenu(){
    leftButton = new createjs.Sprite(generateSpriteSheet("./Images/LeftButton.png",64,64,0,{normal:0, held:1}), "normal");
    rightButton = new createjs.Sprite(generateSpriteSheet("./Images/RightButton.png",64,64,0,{normal:0, held:1}),"normal");
    selectButton = new createjs.Sprite(generateSpriteSheet("./Images/SelectButton.png",64,32,0,{normal:0, held:1}),"normal");
    
    test_g = new createjs.Graphic();
    test_g.beginFill("rgba(255,20,20,0.8");
    test_g.drawRect("100,100,100,100");
    test_shape = new createjs.Shape(test_g);
    
    menu = new createjs.Container();
    menu.addChild(test_shape);
    stage.addChild(menu);
}

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