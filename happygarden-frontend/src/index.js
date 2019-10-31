// Initiate script

document.addEventListener("DOMContentLoaded", function() {
    fetchPlants();
    activateCollapsible();
    addPlantTag();
    saveCanvasAction();
});

// Fetch all plants

const PLANTS_URL = "http://localhost:3000/plants";
const tag_image_src = "https://i.imgur.com/ZFAqmYe.png";

function showTag() {
    let plantId = this.parentNode.getAttribute("data-num");
    document.querySelector('div#show-tag-container').classList.toggle('active');
}

function fetchPlants() {
    fetch(PLANTS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(function(plant) {
            let img = document.createElement("img");
            img.className = "plant";
            img.src = plant.image_url;
            let div = document.createElement("div");
            div.className = "card";
            div.setAttribute("data-num", plant.id);
            div.appendChild(img);
            if(plant.include_tag) {
                let tag = document.createElement("img");
                tag.className = "tag";
                tag.src = tag_image_src;
                div.appendChild(tag);
                tag.addEventListener("click", showTag);
            }
            document.querySelector("div#saved-image-container").prepend(div);
        }));
}

// Show/hide canvas

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
            resetPlantTag();
        }
    });
}

// Show/hide plant tag

function addPlantTag() {
    let active = false;

    document.querySelector("button#add-plant-tag").addEventListener("click", function(e) {
        e.preventDefault();
        active = !active;
        document.querySelector('div#tag-form-container').classList.toggle('active');
        if(!active) {
            resetPlantTag();
        }
    });
}

function resetPlantTag() {
    document.querySelector("input#include-tag-checkbox").checked = false;
    document.querySelector("input#tag-name").value = "";
    document.querySelector("select#include-tag-select").selectedIndex = 4;
    document.querySelector("textarea#tag-notes").value = "";
}

function hidePlantTag() {
    document.querySelector('div#tag-form-container').classList.remove('active');
    resetPlantTag();
}

// Create a plant

function saveCanvasAction() {
    // Declaring common variables
    
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

    // Prepare canvas for drawing
    init();

    // Create a plant upon clicking "plant!"
    document.querySelector("button#save-canvas").addEventListener("click", function(e) {
        e.preventDefault();
        changePotToGround();
        saveCanvas();
        changeGroundToPot();
    });

    function init() {
        pot.onload = prepareCanvas;
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
        // Retrieve tag data
        let includeTag = document.querySelector("input#include-tag-checkbox").checked;
        let name = document.querySelector("input#tag-name").value;
        let menu = document.querySelector("select#include-tag-select");
        let waterFrequency = menu.options[menu.selectedIndex].value;
        let notes = document.querySelector("textarea#tag-notes").value;

        function retrieveTagData() {
            if(includeTag) {
                var tagData = { includeTag: true, name: name, waterFrequency: waterFrequency, notes: notes };
            } else {
                var tagData = { includeTag: false, name: "", waterFrequency: 7, notes: "" };
            }
            return tagData;
        }

        let dataURL = canvas.toDataURL();

        let formData = Object.assign({ imgBase64: dataURL }, retrieveTagData());
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
                div.setAttribute("data-num", plant.id);
                div.appendChild(img);
                document.querySelector("div#saved-image-container").prepend(div);
                if(plant.include_tag) {
                    let tag = document.createElement("img");
                    tag.className = "tag";
                    tag.src = tag_image_src;
                    div.appendChild(tag);
                    tag.addEventListener("click", showTag);
                }
            });
        
        hidePlantTag();
    }
}