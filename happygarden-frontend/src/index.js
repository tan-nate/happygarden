// Initiate script
document.addEventListener("DOMContentLoaded", function() {
    fetchPlants();
    canvasCollapsible();
    plantTagFormCollapsible();
    hideElementsWhenScrolling();
    createPlant();
});

// Fetch all plants
const PLANTS_URL = "http://localhost:3000/plants";
const TAG_IMAGE_SRC = "https://i.imgur.com/vTRPN0A.png";

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
                tag.src = TAG_IMAGE_SRC;
                div.appendChild(tag);
                tag.addEventListener("click", showTag);
            }
            document.querySelector("div#saved-image-container").prepend(div);
        }));
}

// Show plant's tag
function showTag() {
    hideTag();
    hideCanvas();
    hideTagForm();
    let plantId = this.parentNode.getAttribute("data-num");
    let container = document.querySelector('div#show-tag-container');
    container.classList.add('active');
    fetch(`${PLANTS_URL}/${plantId}`)
        .then(resp => resp.json())
        .then(function(plant) {
            document.querySelector("div#show-tag-container").innerHTML = "<br><br><br>";
            document.querySelector("div#show-tag-container").setAttribute("data-num", plantId);
            let nameE = document.createElement("p");
            nameE.id = "plant-name";
            nameE.innerText = plant.name;
            let notesE = document.createElement("p");
            notesE.id = "plant-notes";
            notesE.innerText = plant.notes;
            let rotate = document.createElement("img");
            rotate.src = "https://i.imgur.com/3Y2med9.png";
            rotate.id = "rotate-icon";
            rotate.addEventListener("click", showPlantComments);
            function appendFunction() {
                [nameE, document.createElement("br"), notesE, rotate].forEach(e => document.querySelector("div#show-tag-container").appendChild(e));
            }
            setTimeout(appendFunction, 300);
        });
}

function hideTag() {
    document.querySelector('div#show-tag-container').innerHTML = "";
    document.querySelector('div#show-tag-container').classList.remove("active");
}

// Show plant's comments
function showPlantComments() {
    const COMMENTS_URL = "http://localhost:3000/comments"

    let plantId = this.parentNode.getAttribute("data-num");

    let showTagContainer = document.querySelector('div#show-tag-container');
    showTagContainer.innerHTML = "<br><br>";

    let commentsTitle = document.createElement("p");
    commentsTitle.innerText = "comments:";
    commentsTitle.id = "comments-title";

    let ul = document.createElement("ul");
    ul.id = "comments-ul";

    fetch(`${PLANTS_URL}/${plantId}`)
        .then(resp => resp.json())
        .then(function(plant) {
            plant.last_3_comments.forEach(function(comment) {
                let li = document.createElement("li");
                li.innerText = comment.content;
                li.className = "comment";
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
    addButton.addEventListener("click", postComment);

    [commentsTitle, ul, document.createElement("br"), addComment, addButton].forEach(e => showTagContainer.appendChild(e));
    
    // Post comments
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
        li.className = "comment";
        if(ul.childElementCount === 3) {
            ul.firstChild.remove();
        }
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
    resetPlantTagForm();
    canvasActive = false;
}

function canvasCollapsible() {
    document.querySelector("a#plant-header").addEventListener("click", function() {
        canvasActive = !canvasActive;
        hideTag();
        if(canvasActive) {
            this.innerText = "hide";
            document.querySelector('div#canvas-container').classList.add('active');
        } else {
            hideTagForm();
            hideCanvas();
        }
    });
}

// Show/hide plant tag form
function plantTagFormCollapsible() {
    let active = false;

    document.querySelector("button#add-plant-tag").addEventListener("click", function() {
        active = !active;
        document.querySelector('div#tag-form-container').classList.toggle('active');
        if(!active) {
            resetPlantTagForm();
        }
    });
}

function resetPlantTagForm() {
    document.querySelector("input#include-tag-checkbox").checked = false;
    document.querySelector("input#tag-name").value = "";
    document.querySelector("textarea#tag-notes").value = "";
}

function hideTagForm() {
    document.querySelector('div#tag-form-container').classList.remove('active');
    resetPlantTagForm();
}

// Hide elements when scrolling
function hideElementsWhenScrolling() {
    document.addEventListener("mousewheel", () => {
        hideTag();
        hideTagForm();
        hideCanvas();
    });
}

// Create a plant
function createPlant() {
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

    // Initiate functions below to allow for drawing. Only initiate canvas once pot has loaded. 
    init();

    // Create a plant upon clicking "plant!"
    document.querySelector("button#save-canvas").addEventListener("click", function() {
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
        let notes = document.querySelector("textarea#tag-notes").value;

        class Plant {
            constructor(includeTag, name, notes) {
                this.includeTag = includeTag;
                this.name = name;
                this.notes = notes;
            }
        }

        plant = new Plant(includeTag, name, notes);
        
        function retrieveTagData() {
            if(plant.includeTag) {
                var tagData = { include_tag: true, name: plant.name, notes: plant.notes };
            } else {
                var tagData = { include_tag: false };
            }
            return tagData;
        }

        // Retrieve canvas data
        let dataURL = canvas.toDataURL();

        let formData = Object.assign({ image_url: dataURL }, retrieveTagData());
        let configObj = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        };
        
        // Is it preferred to use this method, or the previously defined javascript object, to create the plant?
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
                    tag.src = TAG_IMAGE_SRC;
                    div.appendChild(tag);
                    tag.addEventListener("click", showTag);
                }
                document.querySelector("div#saved-image-container").prepend(div);
            });
        
        hideTagForm();
    }
}