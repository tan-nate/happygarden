const pot = new Image;
pot.src = "./assets/pot.png";

function init() {
    pot.onload = addPotToCanvas;
}

function addPotToCanvas() {
    const canvas = document.getElementById("canvas");
	const stage = new createjs.Stage(canvas);
	const bmp = new createjs.Bitmap(pot);
    stage.addChild(bmp);
    stage.update();
}

document.addEventListener("DOMContentLoaded", init);