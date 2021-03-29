var lastWordClicked;
var wordReplacements = {};

// This is the model for each word, as logic and presentation are programmed together
class Word {
    constructor(text) {
        this.text = text;
        this.originalWord = text;
        this.prettyWord = text.toLowerCase();
        this.isCorrect=false;
    }
    createDOMElement() {
        this.DOMElement = $(`
            <span class="word" original="${this.prettyWord}">${this.originalWord} </span>
        `);
        return this.DOMElement;
    }
}

// This is the model for the whole text, which contains a list of words, and their presentation
class Text {
    constructor(text) {
        this.text = text;
        this.words = text.split(/\W+/).map(wordString => new Word(wordString));
        this.wordReplacements = {};
    }

    // This function replaces one of the words with the person's guess, and color codes it if correct
    setReplacementWord(from, to, isCorrect) {
        this.wordReplacements[from] = to;
        this.words.forEach(word=>{
            if (word.prettyWord == from) {
                word.DOMElement.text(to);
                word.DOMElement.addClass("replacedWord");
                if (isCorrect) word.DOMElement.addClass("correctWord");
                else word.DOMElement.removeClass("correctWord");
                word.isCorrect = isCorrect;
            }
        })
    }

    // The text is only fully correct if each word is correct
    isCorrect() {
        return this.words.every(word=>word.isCorrect);
    }


    createDOMElement() {
        this.DOMElement = $(`
            <section class="text"></section>
        `);

        // Each word needs to have a trigger added to its click event
        this.words.forEach(word=> {
            let wordDOMElement = word.createDOMElement();
            wordDOMElement.on("click", () => {
                lastWordClicked = word.prettyWord;
                $(".detailWord").text(word.prettyWord);
                $("#wordReplace").val(this.wordReplacements[word.prettyWord] || "");
                $("#wordReplace").focus();
            })
            this.DOMElement.append(wordDOMElement);
        });

        return this.DOMElement;
    }
}


function randomInt(min, max) {
    let range = max-min;
    let num = Math.random() * range;
    return (num + min).toFixed(0);
}
function randomVowel() {
    let vowels = ['a','e','i','o','u', 'y'];
    return vowels[randomInt(0,5)];
}
function randomConsonant() {
    let consonants = ['b', 'c','d','f','g','h','j','k','l','m','n','p','q','r','s','t','v','w','x','z'];
    return consonants[randomInt(0,19)];
}


var dictionary = {};
// TranslateToAlien translates from English to Alien, generating the word it if it doesn't exist
function translateToAlien(word) {
    word = word.toLowerCase();
    if (word in dictionary) {
        return dictionary[word];
    } else {
        let newWord = "";
        
        for (let i=0; i<randomInt(1, 2); i++) newWord += randomConsonant();
        for (let i=0; i<randomInt(1, 3); i++) newWord += randomVowel();
        for (let i=0; i<randomInt(1, 2); i++) newWord += randomConsonant();
        for (let i=0; i<randomInt(1, 3); i++) newWord += randomVowel();
        dictionary[word] = newWord;
        return newWord;
    }
}

// This tells us how many of each word is present in the text
function getWordCounts(wordList) {
    return wordList.reduce((accumulator, value) => {
        if (accumulator[value]) {
            accumulator[value]++;
        } else {
            accumulator[value] = 1;
        }
        return accumulator;
    }, {});
}

function init() {
    let text;
    // When the text file containing our English text is loaded,
    // We need to turn it into alien words, and initialize our text object
    $.get("text.txt", (data)=>{
        let originalWords = data.toString().split(/\W+/).map(word=>word.toLowerCase());
        let wordCounts = getWordCounts(originalWords);

        // This shuffles the words in our textbox's "autocorrect", so they aren't in story order
        Object.keys(wordCounts).sort( () => .5 - Math.random() ).forEach(word=>{
            $("#possibleWordsList").append(`<option value="${word}">`)
        })

        let parsedData = 
            originalWords
                .map(word => translateToAlien(word))
                .join(' ');

        text = new Text(parsedData);
        $("body > main").prepend(text.createDOMElement());
    });

    // Every time our person makes a guess, we need to replace this and all similar words
    // Then check if all of them are correct for the win condition
    $("#wordReplace").on("change", function () {
        let replaceWord = $(this).val();
        console.log(translateToAlien(replaceWord));
        let isCorrect = (translateToAlien(replaceWord) == lastWordClicked);
        text.setReplacementWord(lastWordClicked, replaceWord, isCorrect);

        if (text.isCorrect()) {
            $("#victory").dialog({modal:true, width:600, height:400});
        }
    })

    // Show the tutorial dialog each time the page loads
    $("#tutorial").dialog({modal:true, width:600, height:400});
}
init();