let desynth = new DesynthTool();
$("main > main").append(toolView(desynth));
let reaction = new ReactionTool();
$("main > main").append(toolView(reaction));
let fusion = new FusionChamber();
$("main > main").append(toolView(fusion));
let fission = new FissionChamber();
$("main > main").append(toolView(fission));


let knownElements = [];
let knownCompounds = [];

function isKnownElement(element) {
    return knownElements.map(ele=>ele.symbol).includes(element.symbol);
}
function isKnownCompound(compound) {
    return knownCompounds.map(com=>com.symbol).includes(compound.symbol);
}
function addElement(element) {
    knownElements.push(element);
    $("#elements").replaceWith(elementsListView(knownElements));
    addEventHandlers();
}
function addCompound(compound) {
    knownCompounds.push(compound);
    $("#compounds").replaceWith(compoundsListView(knownCompounds));
    addEventHandlers();
}
function addEventHandlers() {
    parseElement = (elementDOMEle) => {
        let protons = parseInt($(".protons", elementDOMEle).text());
        let symbol = $(".symbol", elementDOMEle).text();
        return new Element(protons, symbol);
    };
    $(".inputElement", "#toolReactionTab").on("drop", function (event, ui) {
        let newElement = parseElement(ui.draggable);
        reaction.addInput(newElement);
    });
    reaction.on.startReact = () => {
        $("main").addClass("reacting");
    }
    reaction.on.endReact = () => {
        reaction.currentOutputs.forEach(compound=> {
            if (!isKnownCompound(compound)) addCompound(compound);
        })
        $("main").removeClass("reacting");
    }
    reaction.on.change = () => {
        $("#toolReactionTab").replaceWith(toolView(reaction));
        addEventHandlers();
    }
    $(".inputCompound", "#toolDesynthTab").on("drop", function (event, ui) {
        let elementsEles = $(".element", ui.draggable).toArray();
        let elements = elementsEles.map(ele=>parseElement(ele));
        desynth.addInput(new Compound(elements));
    });
    desynth.on.change = ()=>{
        $("#toolDesynthTab").replaceWith(toolView(desynth));
        addEventHandlers();
    }
    desynth.on.startReact = () => {
        $("main").addClass("reacting");
    }
    desynth.on.endReact = () => {
        desynth.currentOutputs.forEach(element=> {
            if (!isKnownElement(element)) addElement(element);
        })
        $("main").removeClass("reacting");
    }
    
    $(".inputElement", "#toolFusionTab").on("drop", function (event, ui) {
        let newElement = parseElement(ui.draggable);
        fusion.addInput(newElement);
    });
    fusion.on.change = ()=>{
        $("#toolFusionTab").replaceWith(toolView(fusion));
        addEventHandlers();
    }
    fusion.on.startReact = () => {
        $("main").addClass("reacting");
    }
    fusion.on.endReact = () => {
        fusion.currentOutputs.forEach(element=> {
            if (!isKnownElement(element)) addElement(element);
        })
        $("main").removeClass("reacting");
    }
    
    $(".inputElement", "#toolFissionTab").on("drop", function (event, ui) {
        let newElement = parseElement(ui.draggable);
        fission.addInput(newElement);
    });
    fission.on.change = ()=>{
        $("#toolFissionTab").replaceWith(toolView(fission));
        addEventHandlers();
    }
    fission.on.startReact = () => {
        $("main").addClass("reacting");
    }
    fission.on.endReact = () => {
        fission.currentOutputs.forEach(element=> {
            if (!isKnownElement(element)) addElement(element);
        })
        $("main").removeClass("reacting");
    }

    if (knownElements.length + knownCompounds.length > 30) {
        $("#victory").dialog({modal:true, width:600, height:400});
    }

    $(".inputElement").droppable({accept: ".element", activeClass: "highlight"});
    $(".inputCompound").droppable({accept: ".compound", activeClass: "highlight"});

    
    $("#toolDesynth").on("click", ()=> {
        $(".toolTab").hide();
        $(".toolTab#toolDesynthTab").show();
    })
    $("#toolReact").on("click", ()=> {
        $(".toolTab").hide();
        $(".toolTab#toolReactionTab").show();
    })
    $("#toolFusion").on("click", ()=> {
        $(".toolTab").hide();
        $(".toolTab#toolFusionTab").show();
    })
    $("#toolFission").on("click", ()=> {
        $(".toolTab").hide();
        $(".toolTab#toolFissionTab").show();
    })
    $(".element:not(.compound .element)").draggable({helper:"clone"});
    $(".compound").draggable({helper:"clone"});
    
}
addEventHandlers();

$(".toolTab").hide();
$(".toolTab#toolDesynthTab").show();

// Show the tutorial dialog each time the page loads
$("#tutorial").dialog({modal:true, width:600, height:400});

let e = new Element(1);
let f = new Element(2);
let c = new Compound([e, e, e, f, f]);
addCompound(c);
