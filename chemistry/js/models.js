class Chemical {
    constructor(symbol) {
        this.symbol = symbol;
    }
    prettyTypeName() {
        return "Chemical";
    }
    shortTypeName() {
        return "Chemical";
    }
}

var allElements = [""];
function randomizeElements() {
    let shuffle = (array) => {
        return array.sort(() => Math.random() - 0.5);
    };
    let vowels = ['a','e','i','o','u','y'];
    let consonants = ['b','c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z'];
    vowels=shuffle(vowels);
    consonants=shuffle(consonants);

    consonants.forEach(c=> {
        vowels.forEach(v=> {
            allElements.push(c.toUpperCase() + v);
        })
    })
}
randomizeElements();

// The defintion of an element in our game
class Element extends Chemical {
    constructor(protons=0) {
        let symbol = allElements[protons];
        super(symbol);
        this.protons = protons;
    }

    shortTypeName() {
        return "Element";
    }
    prettyTypeName() {
        return "Element";
    }
}

// The definition of a compound, just a group of elements
class Compound extends Chemical {
    // A list of element objects
    constructor(elements=[]) {
        super();
        elements = elements.sort((a,b) => a.symbol.localeCompare(b.symbol));
        this.elements = elements;
        let elementCounts = elements.reduce((accumulator, element)=>{
            accumulator[element.symbol] = (accumulator[element.symbol] || 0) + 1;
            return accumulator;
        }, {})
        this.symbol="";
        Object.keys(elementCounts).forEach(key=>{
            let quantity = elementCounts[key];
            if (quantity <= 1) quantity = "";
            else quantity=quantity.toString();
            this.symbol += `${quantity}${key}`;
        })
    }

    shortTypeName() {
        return "Compound";
    }
    prettyTypeName() {
        return "Compound";
    }
}

// The definition of a tool that works on chemicals
class Tool {
    // The tool's name, and what it accepts as inputs and outputs
    constructor(acceptsInputs, acceptsOutputs) {
        this.acceptsInputs = acceptsInputs;
        this.acceptsOutputs = acceptsOutputs;
        this.currentInputs = [];
        this.currentOutputs = [];
        this.displayInputs = this.acceptsInputs.map(AcceptableInput=>new AcceptableInput());
        this.displayOutputs = this.acceptsOutputs.map(AcceptableOutput=>new AcceptableOutput());
        this.on = {};
    }
    shortName() {
        return "tool";
    }
    prettyName() {
        return "Tool";
    }

    canAcceptInput(chemical) {
        let currentInputTypes = this.currentInputs.map(input=>input.shortTypeName());
        let remainingInputs = this.acceptsInputs.map(acceptable=>acceptable.name);
        currentInputTypes.forEach(inputType=>{
            delete remainingInputs[remainingInputs.indexOf(inputType)];
        })
        remainingInputs = remainingInputs.filter(remainingInput=>remainingInput);

        return remainingInputs.some(remainingInput=>chemical.shortTypeName()==remainingInput);
    }

    fillRemaining(currents, accepts) {
        let currentTypes = currents.map(current=>current.shortTypeName());
            
        let remainingNames = accepts.map(acceptable=>acceptable.name);
        let remaining = [...accepts];
        currentTypes.forEach(type=>{
            let index = remainingNames.indexOf(type);
            delete remainingNames[index]
            delete remaining[index];
        })
        let temp = [...currents];
        remaining.forEach(RemainingType => temp.push(new RemainingType()));
        return temp;
    }
    addInput(chemical) {
        if (this.canAcceptInput(chemical)) {
            this.currentInputs.push(chemical);
            this.displayInputs = this.fillRemaining(this.currentInputs, this.acceptsInputs);
            if (this.on.change) this.on.change();

            if (this.canReact()) this.startReact();
        }
    }

    canReact() {
        let currentInputTypes = this.currentInputs.map(input=>input.shortTypeName());
        let remainingInputs = this.acceptsInputs.map(acceptable=>acceptable.name);
        currentInputTypes.forEach(inputType=>{
            delete remainingInputs[remainingInputs.indexOf(inputType)];
        })
        remainingInputs = remainingInputs.filter(remainingInput=>remainingInput);
        return remainingInputs.length<=0; 
    }
    startReact() {
        if (this.on.startReact) this.on.startReact();
        if (this.on.change) this.on.change();
    }
    endReact() {
        if (this.on.endReact) this.on.endReact();
        if (this.on.change) this.on.change();
    }
}

class DesynthTool extends Tool {
    constructor() {
        super([Compound], [Element, Element]);
    }
    shortName() {
        return "Desynth";
    }
    prettyName() {
        return "Compound Desynthesizer";
    }
    startReact() {
        super.startReact();
        setTimeout(()=>this.endReact(), 3000);
    }
    endReact() {
        let inputElements = this.currentInputs[0].elements;
        let uniqueEles = {};
        inputElements.forEach(inputElement=> {
            uniqueEles[inputElement.symbol] = inputElement;
        })
        uniqueEles = Object.values(uniqueEles);

        this.currentInputs=[];
        this.displayInputs = this.fillRemaining([], this.acceptsInputs);
        this.currentOutputs=uniqueEles;
        this.displayOutputs = this.fillRemaining(this.currentOutputs, this.acceptsOutputs);

        super.endReact();
    }
}
class ReactionTool extends Tool {
    constructor() {
        super([Element, Element], [Compound]);
    }
    shortName() {
        return "Reaction";
    }
    prettyName() {
        return "Chemical Reaction Chamber";
    }
    
    startReact() {
        super.startReact();
        setTimeout(()=>this.endReact(), 3000);
    }
    endReact() {
        let outCompound = new Compound(this.currentInputs);
        this.currentInputs=[];
        this.displayInputs = this.fillRemaining([], this.acceptsInputs);
        this.currentOutputs=[outCompound];
        this.displayOutputs = this.fillRemaining(this.currentOutputs, this.acceptsOutputs);

        super.endReact();
    }
}
class FusionChamber extends Tool {
    constructor() {
        super([Element, Element], [Element]);
    }
    shortName() {
        return "Fusion";
    }
    prettyName() {
        return "Fusion Chamber";
    }
    
    startReact() {
        super.startReact();
        setTimeout(()=>this.endReact(), 3000);
    }
    endReact() {
        let resultProtons = this.currentInputs.map(ele=>ele.protons).reduce((a,b)=>a+b, 0);
        resultProtons = Math.min(resultProtons, 100);
        let outElement = new Element(resultProtons);
        this.currentInputs=[];
        this.displayInputs = this.fillRemaining([], this.acceptsInputs);
        this.currentOutputs=[outElement];
        this.displayOutputs = this.fillRemaining(this.currentOutputs, this.acceptsOutputs);

        super.endReact();
    }
}

class FissionChamber extends Tool {
    constructor() {
        super([Element], [Element, Element]);
    }
    shortName() {
        return "Fission";
    }
    prettyName() {
        return "Fission Chamber";
    }
    
    startReact() {
        super.startReact();
        setTimeout(()=>this.endReact(), 3000);
    }
    endReact() {
        console.log(this.currentInputs[0])
        let resultProtons = [Math.floor(this.currentInputs[0].protons/2), Math.ceil(this.currentInputs[0].protons/2)];
        resultProtons = resultProtons.map(p=>Math.max(p,1));
        let outElements = resultProtons.map(p=>new Element(p));
        this.currentInputs=[];
        this.displayInputs = this.fillRemaining([], this.acceptsInputs);
        this.currentOutputs=outElements;
        this.displayOutputs = this.fillRemaining(this.currentOutputs, this.acceptsOutputs);

        super.endReact();
    }
}