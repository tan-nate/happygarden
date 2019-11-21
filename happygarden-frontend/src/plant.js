
const PlantIFFE = (function(){
    let allPlants = []
    return class {
        // here is all your class code
        constructor(attrs) {
            this.save()
        }

        save() {
            allPlants.push(this)
        }

        static all() {
            allPlants
        }
    }
})()

// Plant.all() returns an array of all the Plant objects 





class Plant {
    constructor(plant) {
        this.includeTag = plant.include_tag;
        this.name = plant.name;
        this.notes = plant.notes;
        this.imageUrl = plant.image_url;
        this.id = plant.id;
    }

    renderToDOM() {
        let img = document.createElement("img");
        img.src = this.imageUrl;
        img.className = "plant";
        let div = document.createElement("div");
        div.className = "card";
        div.setAttribute("data-num", this.id);
        div.appendChild(img);
        if(this.include_tag) {
            let tag = document.createElement("img");
            tag.className = "tag";
            tag.src = TAG_IMAGE_SRC;
            div.appendChild(tag);
            tag.addEventListener("click", showTag);
        }
        document.querySelector("div#saved-image-container").prepend(div);
    }
}