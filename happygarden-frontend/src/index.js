// Draw on canvas

const canvas = document.getElementById("canvas");
const stage = new createjs.Stage(canvas);
const drawingCanvas = new createjs.Shape();
const pot = new Image;
pot.crossOrigin = "anonymous";
pot.src = "https://i.imgur.com/yteHSyv.png?2";

const bmp = new createjs.Bitmap(pot);
let color = "#1aff00";
let stroke = 20;
let oldPt;
let oldMidPt;

function init() {
    pot.onload = prepareCanvas;

	createjs.Touch.enable(stage);

	stage.addEventListener("stagemousedown", handleMouseDown);
    stage.addEventListener("stagemouseup", handleMouseUp);
}

function prepareCanvas() {
    stage.addChild(bmp).y = 200;
    stage.addChild(drawingCanvas);
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

	drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

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

// Fetch all plants

const PLANTS_URL = "http://localhost:3000/plants";

function fetchPlants() {
    fetch(PLANTS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(function(plant) {
            let img = document.createElement("img");
            img.src = plant.image_url;
            document.querySelector("div#saved-image-container").appendChild(img);
        }));
}

// Save canvas image

function saveCanvas() {
    let dataURL = canvas.toDataURL();
    
    let formData = {
        imgBase64: dataURL
    };
     
    let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
    };
     
    fetch(PLANTS_URL, configObj)
        .then(response => response.json())
        .then(function(plant) {
            let img = document.createElement("img");
            img.src = plant.image_url;
            document.querySelector("div#saved-image-container").appendChild(img);
        });
}

function saveCanvasAction() {
    document.querySelector("button#save-canvas").addEventListener("click", function(e) {
        e.preventDefault();
        saveCanvas();
    });
}

// Initiate script

document.addEventListener("DOMContentLoaded", function() {
    init();
    fetchPlants();
    saveCanvasAction();
});