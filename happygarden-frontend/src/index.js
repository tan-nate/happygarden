const canvas = document.getElementById("canvas");
const stage = new createjs.Stage(canvas);
const drawingCanvas = new createjs.Shape();
const pot = new Image;
pot.src = "./assets/pot.png";
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
    stage.addChild(bmp, drawingCanvas);
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

document.addEventListener("DOMContentLoaded", function() {
    init();
    saveCanvasAction();
});

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
     
    fetch("http://localhost:3000/plants", configObj)
      .then(function(response) {
        console.log(response.json());
      })
    //   .then(function(toy) {
    //     console.log(toy)
    //     let card = document.createElement('div')
    //     card.className = 'card'
    //     let h2 = document.createElement('h2');
    //     h2.innerHTML = toy.name
    //     let img = document.createElement('img');
    //     img.className = 'toy-avatar'
    //     img.src = toy.image
    //     let p = document.createElement('p');
    //     p.innerText = `${toy.likes} Likes`
    //     let btn = document.createElement('button');
    //     btn.className = 'like-btn'
    //     btn.innerText = 'Like <3';
    //     [h2, img, p, btn].forEach(function(element) {
    //       card.appendChild(element)
    //     })
    //     card.id = toy.id
    //     document.querySelector('div#toy-collection').appendChild(card)
    //   });
}

function saveCanvasAction() {
    document.querySelector("button#save-canvas").addEventListener("click", function(e) {
        e.preventDefault();
        saveCanvas();
    });
}