const canvas = document.getElementById("canvas");
const stage = new createjs.Stage(canvas);
let drawingCanvas;
const pot = new Image;
pot.src = "./assets/pot.png";
const bmp = new createjs.Bitmap(pot);
let color = "#1aff00";
let stroke = 20;
let oldPt;
let oldMidPt;

function init() {
    // pot.onload = addPotToCanvas;
    stage.autoClear = false;
	stage.enableDOMEvents(true);

	createjs.Touch.enable(stage);
	createjs.Ticker.framerate = 24;

	drawingCanvas = new createjs.Shape();

	stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);
    
    stage.addChild(drawingCanvas);
	stage.update();
}

function addPotToCanvas() {
    stage.addChild(bmp);
    stage.update();
}

function handleMouseDown(event) {
	if (!event.primary) { return; }
	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
	oldMidPt = oldPt.clone();
	stage.addEventListener("stagemousemove", handleMouseMove);
}

function handleMouseMove(event) {
	if (!event.primary) { return; }
	let midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

	drawingCanvas.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

	oldPt.x = stage.mouseX;
	oldPt.y = stage.mouseY;

	oldMidPt.x = midPt.x;
	oldMidPt.y = midPt.y;

	stage.update();
}

function handleMouseUp(event) {
	if (!event.primary) { return; }
	stage.removeEventListener("stagemousemove", handleMouseMove);
}

document.addEventListener("DOMContentLoaded", init);