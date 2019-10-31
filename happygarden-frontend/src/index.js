// Initiate script

document.addEventListener("DOMContentLoaded", function() {
    fetchPlants();
    activateCollapsible();
    saveCanvasAction();
});

// Fetch all plants

const PLANTS_URL = "http://localhost:3000/plants";
const tag_image_src = "https://i.imgur.com/ZFAqmYe.png";

function fetchPlants() {
    fetch(PLANTS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(function(plant) {
            let img = document.createElement("img");
            img.className = "plant";
            img.src = plant.image_url;
            let tag = document.createElement("img");
            tag.className = "tag";
            tag.src = tag_image_src;
            let div = document.createElement("div");
            div.className = "card";
            div.appendChild(img);
            div.appendChild(tag);
            document.querySelector("div#saved-image-container").prepend(div);
        }));
}

// Collapsible logic

function activateCollapsible() {
    let active = false;

    document.querySelector("a#plant-header").addEventListener("click", function(e) {
        e.preventDefault();
        document.querySelector('div#canvas-container').classList.toggle('active');
        document.querySelector('div#tag-form-container').classList.remove('active');
        active = !active;
        
        if(active) {
            this.innerText = "hide";
        }
        else {
            this.innerText = "plant";
        }
    });
}

// Draw on canvas

function saveCanvasAction() {
    const canvas = document.getElementById("canvas");
    const stage = new createjs.Stage(canvas);
    let drawingCanvas = new createjs.Shape();
    drawingCanvas.cache(0,0,300,450);

    const pot = new Image;
    pot.crossOrigin = "anonymous";
    pot.src = "https://i.imgur.com/8109gmp.png";
    const bmp = new createjs.Bitmap(pot);

    const ground = new Image;
    ground.crossOrigin = "anonymous";
    ground.src = "https://i.imgur.com/wpRjDTj.png?1";
    const groundBmp = new createjs.Bitmap(ground);

    let color;
    let stroke;
    let oldPt;
    let oldMidPt;

    init();

    document.querySelector("button#save-canvas").addEventListener("click", function(e) {
        e.preventDefault();
        changePotToGround();
        saveCanvas();
        changeGroundToPot();
    });

    function init() {
        pot.onload = prepareCanvas;

        addPlantTag();

        createjs.Touch.enable(stage);

        stage.addEventListener("stagemousedown", handleMouseDown);
        stage.addEventListener("stagemouseup", handleMouseUp);
        document.querySelector("button#clear-canvas").addEventListener("click", clearCanvas);
    }

    function prepareCanvas() {
        stage.addChild(bmp).y = 270;
        stage.addChild(bmp).x = 10;
        stage.addChild(drawingCanvas);
        stage.update();
    }

    function handleMouseDown(event) {
        if (!event.primary) { return; }
        color = document.querySelector("input#html5colorpicker").value;
        stroke = document.querySelector("input#brush-slider").value / 3;
        oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
        oldMidPt = oldPt.clone();
        stage.addEventListener("stagemousemove", handleMouseMove);
    }

    function handleMouseMove(event) {
        if (!event.primary) { return; }
        let midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);

        drawingCanvas.graphics.setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

        drawingCanvas.updateCache(erase.checked ? "destination-out" : "source-over");

        drawingCanvas.graphics.clear();
        
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

    function clearCanvas() {
        stage.removeChild(drawingCanvas);
        drawingCanvas = new createjs.Shape();
        drawingCanvas.cache(0,0,300,450);
        stage.addChild(drawingCanvas);
        stage.update();
    }

    // Add plant tag

    function addPlantTag() {
        document.querySelector("button#add-plant-tag").addEventListener("click", function(e) {
            e.preventDefault();
            document.querySelector('div#tag-form-container').classList.toggle('active');
        });
    }

    // Save canvas image

    function changePotToGround() {
        stage.removeAllChildren();
        stage.addChild(drawingCanvas).y = 140;
        stage.addChild(groundBmp).y = 270;
        stage.update();
    }

    function changeGroundToPot() {
        stage.removeAllChildren();
        stage.addChild(bmp).y = 270;
        stage.addChild(bmp).x = 10;
        drawingCanvas = new createjs.Shape();
        drawingCanvas.cache(0,0,300,450);
        stage.addChild(drawingCanvas);
        stage.update()
    }

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
                img.className = "plant";
                let div = document.createElement("div");
                div.className = "card";
                div.appendChild(img);
                document.querySelector("div#saved-image-container").prepend(div);
            });
    }
}