// The defintion of an element in our game
class Element {
    // An integer for protons and electrons, string for symbol
    constructor(protons, electrons, symbol) {
        this.protons = protons;
        this.electrons = electrons;
        this.symbol = symbol;
    }

    // Creates and binds a DOM element to the object
    createDOMElement() {
        this.DOMElement = $(`
            <div class="element">
                <header class="protons">${this.protons}</header>
                <main class="symbol">${this.symbol}</main>
            </div>`);
        this.DOMElement.draggable({helper:"clone"});
        return this.DOMElement;
    }
}

// The definition of a compound, just a group of elements
class Compound {
    // A list of element objects
    constructor(elements) {
        this.elements = elements;
        let elementCounts = elements.reduce((accumulator, element)=>{
            accumulator[element.symbol] = (accumulator[element.symbol] || 0) + 1;
            return accumulator;
        }, {})
        this.symbol="";
        Object.keys(elementCounts).forEach(key=>{
            let quantity = elementCounts[key];
            if (quantity<2) quantity="";
            else quantity=quantity.toString();
            this.symbol += `${quantity}${key}`;
        })
    }
    
    // Creates and binds a DOM element to the object
    createDOMElement() {
        this.DOMElement = $(`
            <div class="compound">
                <main class="symbol">${this.symbol}</main>
            </div>`);
        this.DOMElement.draggable({helper:"clone"});
        return this.DOMElement;
    }
}

$(".toolTab").hide();
$(".toolTab#toolDesynthTab").show();

let e = new Element(16, 12, "Fe");
$("#elements").append(e.createDOMElement());

let c = new Compound([e, e]);
$("#compounds").append(c.createDOMElement());


$("#toolDesynth").on("click", ()=> {
    $(".toolTab").hide();
    $(".toolTab#toolDesynthTab").show();
})
$("#toolReact").on("click", ()=> {
    $(".toolTab").hide();
    $(".toolTab#toolReactTab").show();
})
$("#toolDesynthTab .input").droppable({accept:".compound", activeClass:"highlight"});
$("#toolReactTab .input").droppable({accept:".element", activeClass: "highlight"});
$(".input").on("drop", function (event, ui) {
    $(".name", $(this)).text(ui.draggable.text());
})

function init() {
    console.log("test");
}
$(init);
