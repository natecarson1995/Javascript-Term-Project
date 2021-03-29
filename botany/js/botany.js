class Plant {
    constructor(leafLength, leafWidth, stemLength, stemBranching) {
        this.leafLength= leafLength;
        this.leafWidth= leafWidth;
        this.stemLength=stemLength;
        this.stemBranching=stemBranching;
        this.plantElement = this.createPlantElement();
    }
    createPlantElement() {
        return $(`
            <div class="plant">
                <section class="name">Plant</section>
                <section class="desc">
                    <p>Leaf Length: ${this.leafLength} cm</p>
                    <p>Leaf Width: ${this.leafWidth} cm</p>
                    <p>Stem Length: ${this.stemLength} cm</p>
                    <p>Stem Branching Coefficient: ${this.stemBranching}</p>
                </section>
            </div>
        `);
    }
    bindToDetailsPane(detailsPane) {
        this.plantElement.on("click", ()=>{
            $("#genotype > .desc", detailsPane).text(this.genotype());
            let ctx = document.getElementById("canvas").getContext("2d");
            ctx.drawImage(document.getElementById("botanyimg"), 0 ,0, 400,200);
        })
    }
    genotype() {
        return "GATTACAGATTACA";
    }
}

var plants = [];

function init() {
    let plant1 = new Plant(4, 2, 1, 2);
    let plant2 = new Plant(1, 2, 1, 1);

    $(".plants").append(plant1.plantElement);
    plant1.bindToDetailsPane($(".details"));
    $(".plants").append(plant2.plantElement);
    plant2.bindToDetailsPane($(".details"));

}
init();