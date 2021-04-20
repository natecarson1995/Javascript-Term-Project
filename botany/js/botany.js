class Plant {
    constructor(leafLength, leafWidth, stemLength, stemBranching) {
        this.leafLength= leafLength;
        this.leafWidth= leafWidth;
        this.stemLength=stemLength;
        this.stemBranching=stemBranching;
        this.gene = new Gene().fromPlant(this);
        this.plantElement = this.createPlantElement();
    }
    createPlantElement() {
        return $(`
            <div class="plant">
                <section class="name">Plant</section>
                <section class="desc">
                    <p>Leaf Length: ${this.leafLength+1} cm</p>
                    <p>Leaf Width: ${this.leafWidth+1} cm</p>
                    <p>Stem Length: ${this.stemLength+1} cm</p>
                    <p>Stem Branching Coefficient: ${this.stemBranching}</p>
                </section>
            </div>
        `);
    }
    bindToDetailsPane(detailsPane) {
        this.plantElement.on("click", ()=>{
            if (!this.plantElement.hasClass("plantSelected")) {
                $(".oldPlantSelected").removeClass("selected oldPlantSelected");
                $(".plantSelected").addClass("oldPlantSelected");
                $(".plantSelected").removeClass("plantSelected");
                this.plantElement.addClass("selected plantSelected");
            }

            $("#genotype > .desc", detailsPane).text(this.gene.toString());
            let ctx = document.getElementById("canvas").getContext("2d");
            this.drawPlant(ctx);
        })
    }
    drawPlant(ctx) {
        ctx.clearRect(0,0, 900, 900);
        console.log("test");
        let getStemAtAngle = (baseX, baseY, angle) => {
            let actualStemLength = 10 + this.stemLength * 2;
            return [baseX + actualStemLength * Math.cos(angle), baseY + actualStemLength * Math.sin(angle)];
        }
        let drawStem = (baseX, baseY, angle) => {
            ctx.lineWidth = 4;
            ctx.strokeStyle = "brown";
            ctx.beginPath();
            ctx.moveTo(baseX, baseY);
            ctx.lineTo(...getStemAtAngle(baseX, baseY, angle));
            ctx.stroke();
        };
        let drawLeaves = (baseX, baseY) => {
            let opacity = ((this.leafWidth / 16) * .4 + .6).toFixed(2);
            ctx.fillStyle = `rgba(50, 255, 50, ${opacity})`;
            ctx.beginPath();
            ctx.arc(baseX, baseY, 4 + this.leafLength * 2, 0, Math.PI*2);
            ctx.fill();
        }
        let recDrawToEnd = (baseX, baseY, angle, myIteration) => {
            drawStem(baseX, baseY, angle);
            let myBase = getStemAtAngle(baseX, baseY, angle);
            if (myIteration < this.stemBranching) {
                recDrawToEnd(myBase[0], myBase[1], Math.PI*1.9, myIteration+1);
                recDrawToEnd(myBase[0], myBase[1], Math.PI*1.1, myIteration+1);
            } else {
                drawLeaves(myBase[0], myBase[1]);
            }
        }
        recDrawToEnd(200,200, Math.PI*1.5, 1);
    }
    genotype() {
        return "GATTACAGATTACA";
    }
}

class Gene {
    constructor(letters) {
        this.data = letters;
    }
    // Accepts range 1-8
    convertIntToPairOfLetters(number) {
        let bases = ["G", "T", "A", "C"];
        let numberAsBase4 = [Math.floor(number / 4), number % 4];
        return numberAsBase4.map(intAsChar=>bases[parseInt(intAsChar)]).join("");
    }
    // Accepts pairs of [GTAC]
    convertPairOfLettersToInt(pair) {
        let bases = ["G", "T", "A", "C"];
        let numberAsBase4 = pair.split("").map(letter=>bases.indexOf(letter))
        return numberAsBase4[0] * 4 + numberAsBase4[1];
    }

    fromPlant(plant) {
        let data = [plant.leafLength, plant.leafWidth, plant.stemLength, plant.stemBranching].map(this.convertIntToPairOfLetters).join("");
        return new Gene(data);
    }
    toPlant() {
        let characteristics = [];
        for (let index = 0; index < this.data.length; index+=2) {
            characteristics.push(this.convertPairOfLettersToInt(this.data.charAt(index) + this.data.charAt(index+1)));
        }
        return new Plant(...characteristics);
    }
    mixWithGene(otherGene) {
        let myGeneStr = this.data;
        let otherGeneStr = otherGene.data;
        let resultantGeneStr = "";

        for (let index = 0; index < myGeneStr.length; index++) {
            if (Math.random() < .2) {
                resultantGeneStr += this.randomBase();
            } else if (Math.random() < .4) {
                resultantGeneStr += otherGeneStr.charAt(index);
            } else {
                resultantGeneStr += myGeneStr.charAt(index);
            }
        }
        return new Gene(resultantGeneStr);
    }
    randomBase() {
        let bases = ["G", "T", "A", "C"];
        let randomChoice = Math.floor(Math.random()*4);
        return bases[randomChoice];
    }
    toString() {
        return this.data;
    }
}

var plants = [];

function nextGeneration() {
    let plantsToBreed = plants.filter(plant=>$(plant.plantElement).hasClass("selected"));
    if (plantsToBreed.length==2) {
        $(".plants").empty();

        let plantA = plantsToBreed[0];
        let plantB = plantsToBreed[1];

        let newGeneration = [];
        for (let i=0; i < 10; i++) {
            let resultGene = plantA.gene.mixWithGene(plantB.gene);
            newGeneration.push(resultGene.toPlant());
        }
        plants = newGeneration;
        plants.forEach(plant=>{
            plant.bindToDetailsPane($(".details"));
            $(".plants").append(plant.plantElement);
        });
    }

    if (plants.some(plant=> {
        let score = (plant.leafWidth + plant.leafLength + plant.stemBranching + plant.stemLength)/4;
        return score >= 13;
    })) {
        // Show the victory dialog if the plant has an average score >= 13
        $("#victory").dialog({modal:true, width:600, height:400});
    }
}

function init() {
    // Initial generation
    plants = plants = [new Gene("GTGAGTTG").toPlant(), new Gene("GTGAGTTG").toPlant()];
    plants.forEach(plant=>plant.plantElement.addClass("selected"));
    nextGeneration();
    
    // Show the tutorial dialog each time the page loads
    $("#tutorial").dialog({modal:true, width:600, height:400});

    $("#nextGeneration").on("click", ()=> nextGeneration());
}
init();