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
var leftButton = {
    images:[leftButton_img],
    frames: {width: 64, height:64},
    animations: {
        exist:[0],
        select:[1]
    }
};
var rightButton = {
    images:[rightButton_img],
    frames: {width: 64, height:64},
    animations: {
        exist:[0],
        select:[1]
    }
};
var selectButton = {
    images:[selectButton_img],
    frames: {width: 64, height:64},
    animations: {
        exist:[0],
        select:[1]
    }
};
function init(){load();}
function load(){startMenu();}
//Menu container
var menu = new createjs.Container();
menu.x = 300;
menu.y = 300;

var stage = new createjs.Stage("canvas");
function startMenu(){
    leftButton.x = 300;
    leftButton.y = 300;
    rightButton.x = 500;
    rightButton.y = 300;
    selectButton.x = 400;
    selectButton.y = 300;
    menu.addChild(leftButton,rightButton,selectButton);
    stage.addChild(menu);
}