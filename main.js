var stage;

var circle;
var g_circle;


function load(){
    init();
}

function init(){
    stage = new createjs.Stage("canvas");
    var g = new createjs.Graphics();
    
    g.beginFill("rgba(100,100,50,1.0");
    g.drawCircle(0,0,30)
    g_circle = g.command;
    
    circle = new createjs.Shape(g);
    
    circle.x = 50;
    circle.y = 50;
    
    stage.addChild(circle);
    
    stage.addChild(circle);
    
    stage.update();
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
        
    this.document.onkeydown = keyDown;
}

// Keyboard input
function keyDown(event){
    switch(event.keyCode){
        case 65: // A
            circle.x--;
            break;
        case 68: // D
            circle.x++;
            break;
        case 87: // W
            circle.y--;
            break;
        case 83: // S
            circle.y++;
            break;
    }
}

// This method is essentially what should happen every frame regardless of events
function tick(event){
    stage.update();
}