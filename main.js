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
    
    // Test stuff
    var g = new createjs.Graphics();
    
    g.beginFill("rgba(100,100,50,1.0");
    g.drawCircle(0,0,25)
    g_circle = g.command;
    
    circle = new createjs.Shape(g);
    
    circle.x = 25;
    circle.y = 25;
    
    stage.addChild(circle);
    
    stage.addChild(circle);
    
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
                if (circle.x - 50 > 0){
                    createjs.Tween.get(circle, {override:false}).to({x:circle.x - 50}, 500).call(handleComplete);
                    movementOccuring = true;
                }
                break;
            case 68: // D
                if (circle.x + 50 < 800){
                    createjs.Tween.get(circle, {override:false}).to({x:circle.x + 50}, 500).call(handleComplete);
                    movementOccuring = true;
                }
                break;
            case 87: // W
                if (circle.y - 50 > 0){
                    createjs.Tween.get(circle, {override:false}).to({y:circle.y - 50}, 500).call(handleComplete);
                    movementOccuring = true;
                }
                break;
            case 83: // S
                if (circle.y + 50 < 600){
                    createjs.Tween.get(circle, {override:false}).to({y:circle.y + 50}, 500).call(handleComplete);
                    movementOccuring = true;
                }
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