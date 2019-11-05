// Initiate script

document.addEventListener("DOMContentLoaded", function() {
    fetchPlants();
    activateCollapsible();
    addPlantTag();
    hideTagsWhenScrolling();
    saveCanvasAction();
});

// Fetch all plants

const PLANTS_URL = "http://localhost:3000/plants";
const tag_image_src = "https://i.imgur.com/vTRPN0A.png";

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

function showTag() {
    hideShowTag();
    hideCanvas();
    hideFormTag();
    let plantId = this.parentNode.getAttribute("data-num");
    let container = document.querySelector('div#show-tag-container');
    Element
    container.classList.add('active');
    fetch(`${PLANTS_URL}/${plantId}`)
        .then(resp => resp.json())
        .then(function(plant) {
            document.querySelector("div#show-tag-container").innerHTML = "<br><br><br>";
            document.querySelector("div#show-tag-container").setAttribute("data-num", plantId);
            let name = plant.name;
            let notes = plant.notes;
            let nameE = document.createElement("p");
            nameE.style = "width: 70%; margin: 0 auto; font-size: 1.3em;"
            nameE.innerText = name;
            let notesE = document.createElement("p");
            notesE.style = "width: 70%; margin: 0 auto;"
            notesE.innerText = notes;
            let br = document.createElement("br");
            let rotate = document.createElement("img");
            rotate.src = "https://i.imgur.com/3Y2med9.png";
            rotate.id = "rotate-icon";
            rotate.style = "width: 10%; bottom: 100px; right: 135px; position: absolute;"
            rotate.addEventListener("click", showPlantComments);
            function appendFunction() {
                [nameE, br, notesE, rotate].forEach(e => document.querySelector("div#show-tag-container").appendChild(e));
            }
            setTimeout(appendFunction, 300);
        });
}

function hideShowTag() {
    document.querySelector('div#show-tag-container').innerHTML = "";
    document.querySelector('div#show-tag-container').classList.remove("active");
}

// Hide show tag by scrolling
function hideTagsWhenScrolling() {
    document.addEventListener("mousewheel", () => {
        hideShowTag();
        hideFormTag();
        hideCanvas();
    });
}

function showPlantComments() {
    const COMMENTS_URL = "http://localhost:3000/comments"

    let plantId = this.parentNode.getAttribute("data-num");

    let showTagContainer = document.querySelector('div#show-tag-container');
    showTagContainer.innerHTML = "<br><br>";

    let commentsTitle = document.createElement("p");
    commentsTitle.innerText = "comments:";
    commentsTitle.style = "text-decoration: underline;"

    let ul = document.createElement("ul");
    ul.style = "width: 60%; padding: 0; margin: 0 auto; list-style-type: none;"

    fetch(`${PLANTS_URL}/${plantId}`)
        .then(resp => resp.json())
        .then(function(plant) {
            debugger
            plant.last_3_comments.forEach(function(comment) {
                let li = document.createElement("li");
                li.innerText = comment.content;
                ul.appendChild(li);
            });
        });

    let addComment = document.createElement("input");
    addComment.type = "text";
    addComment.maxLength = "50";
    addComment.placeholder = "add a comment:";

    let addButton = document.createElement("button");
    addButton.id = "add-comment-button";
    addButton.innerText = "add!";
    addButton.style = "bottom: 150px; right: 130px; position: absolute;"
    addButton.addEventListener("click", postComment);

    [commentsTitle, ul, document.createElement("br"), addComment, addButton].forEach(e => showTagContainer.appendChild(e));

    function postComment() {
        class Comment {
            constructor(content) {
                this.content = content;
            }
        }
        let comment = new Comment(addComment.value);

        let formData = { content: comment.content, plant_id: plantId };
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        };

        fetch(COMMENTS_URL, configObj);

        let li = document.createElement("li");
        li.innerText = comment.content;
        ul.appendChild(li);
        addComment.style = "display: none;";
        addButton.style = "display: none;";
    }
}

// Show/hide canvas

let canvasActive = false;

function hideCanvas() {
    document.querySelector('div#canvas-container').classList.remove('active');
    document.querySelector("a#plant-header").innerText = "plant";
    resetPlantTag();
    canvasActive = false;
}

function activateCollapsible() {
    document.querySelector("a#plant-header").addEventListener("click", function() {
        canvasActive = !canvasActive;
        hideShowTag();
        if(canvasActive) {
            this.innerText = "hide";
            document.querySelector('div#canvas-container').classList.toggle('active');
        } else {
            hideFormTag();
            hideCanvas();
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

function hideFormTag() {
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
    pot.src = "https://i.imgur.com/M1GHzVq.png";
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
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
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
                if(plant.include_tag) {
                    let tag = document.createElement("img");
                    tag.className = "tag";
                    tag.src = tag_image_src;
                    div.appendChild(tag);
                    tag.addEventListener("click", showTag);
                }
                document.querySelector("div#saved-image-container").prepend(div);
            });
        
        hideFormTag();
    }
}