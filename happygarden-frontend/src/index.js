const canvas = document.getElementById("canvas");
const stage = new createjs.Stage(canvas);
const pot = new Image;
pot.src = "./assets/pot.png";
const bmp = new createjs.Bitmap(pot);
let color
let stroke

function init() {
    bmp.onload = addPotToCanvas;
}

function addPotToCanvas() {
    stage.addChild(bmp);
    stage.update();
}

function handleMouseDown(event) {
	if (!event.primary) { return; }
	color = "#828b20";
	stroke = 8;
	oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
	oldMidPt = oldPt.clone();
	stage.addEventListener("stagemousemove", handleMouseMove);
}

document.addEventListener("DOMContentLoaded", init);