elementShortView = element => `
    <div class="element">
        <header class="protons">${element.protons}</header>
        <main class="symbol">${element.symbol}</main>
    </div>
`;
compoundShortView = compound => `
    <div class="compound">
        <main class="symbol">${compound.symbol}</main>
        ${compound.elements.map(elementShortView).join("\n")}
    </div>
`;

elementsListView = elements => `
    <footer id="elements">
        <div>
            Discovered Elements
        </div>
        ${elements.map(elementShortView).join("\n")}
    </footer>
`;
compoundsListView = compounds => `
    <footer id="compounds">
        <div>
            Discovered Compounds
        </div>
        ${compounds.map(compoundShortView).join("\n")}
    </footer>
`;

inputChemicalView = chemical => `
    <div class="input input${chemical.shortTypeName()}">
        <p>Input ${chemical.prettyTypeName()}</p>
        <p class="name">${chemical.symbol}</p>
    </div>
`;
outputChemicalView = chemical => `
    <div class="output output${chemical.shortTypeName()}">
        <p>Output ${chemical.prettyTypeName()}</p>
        <p class="name">${chemical.symbol}</p>
    </div>
`;

toolView = tool => `
    <div class="toolTab" id="tool${tool.shortName()}Tab">
    ${tool.displayInputs.map(inputChemicalView).join('\n')}
    <div class="spacer">
    </div>
    ${tool.displayOutputs.map(outputChemicalView).join('\n')};
`;