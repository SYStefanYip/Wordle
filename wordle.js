const testWordList = ["apple","plant","tiger","smile","house","dance","brave","earth","ocean","happy","music","light","round","fresh","cloud","horse","magic","amber","burst","dream"];
let wordList = { valid: [], playable: [] };
const rating = {
    unknown: 0,
    absent: 1,
    present: 2,
    correct: 3
}
function startGame(round) {
    let {
        attemptCount,
        userAtempts,
        highlightedRows,
        keyboard,
        answer,
        status
    } = loadOrStartGame();

    while (attemptCount <= round && status === "in-progress") {
        let currentGuess = prompt("Guess a five letter word:")
        if (validateInput(currentGuess)) {
            console.log(currentGuess)
            attempt = attempt + 1;
            userAtempts.push(currentGuess);
            const highlightedCharacters = getCharactersHighlight(
                currentGuess,
                answer
            );
            highlightedRows.push(highlightedCharacters)
            keyboard = updateKeyboardHighlights(
                keyboard,
                currentGuess,
                highlightedCharacters
            );
            status = updateGameStatus(
                currentGuess,
                answer,
                attemptCount,
                round -1
            );
            attemptCount = attemptCount + 1;
            saveGame({
                attemptCount,
                userAtempts,
                highlightedRows,
                keyboard,
                status
            });


        }
        else {
            retry(currentGuess)
        }
    }
    if (status === "success") {
        alert("Bro, you got it Lol!")
    } else {
        alert(`${word} is not in the word list!`)
    }
}
function validateInput(word) {
    return wordList.playable.includes(word) || wordList.valid.includes(word);
}
 function retry(word) {
    alert( `${word} is not in the word list!`)
 }

 function getCharactersHighlight(word, answer) {
    const wordSplit = word.split("");
    const result = [];
    wordSplit.forEach((character, index) => {
        if (character === answer[index]) {
            result.push("correct");
        } else if (answer.includes(character)) {
            result.push("present")
        } else {
            result.push("absent")
        }
    });  
    
    return result;

 }

 function getKeyboard(){
    const alphabets = "abcdefghijklmnopqrstuvwxyz".split("")
    const entries = [];
    for (const alphabet of alphabets){
        entries.push([alphabet, "unknown"]);
    }
    return Object.fromEntries(entries)
 }

function updateKeyboardHighlights(keyboard, userInput, highlightedCharacters){
    const newKeyboard = Object.assign({}, keyboard);
    for (let i = 0; i < highlightedCharacter.length; i++){
        const character = userInput[i];
        const nextStatus = highlightedCharacter[i];
        const nextRating = rating[nextStatus];
        const previousStatus = newKeyboard[character];
        const previousRating = rating[previousStatus];
        if (nextRating > previousRating){
            newKeyboard[character] = nextStatus;
        }
    }
    return newKeyboard;
}
function updateGameStatus(currentGuess, answer, attemptCount, round) {
    if (currentGuess === answer) {
        return "success";
    }
    if (attemptCount === round) {
        return "failure";
    }
    return "in-progress";
}

function saveGame(gameState) {
    window.localStorage.setItem("PREFACE_WORDLE", JSON.stringify(gameState))
}

function getTodaysAnswer() {
    const offsetFromDate = new Date(2023, 0, 1).getTime();
    const today = new Date().getTime();
    const msOffset = today - offsetFromDate;
    const daysOffset = msOffset / 1000 / 60 / 60 / 24;
    const annswerIndex = Math.floor(daysOffset)
    return wordList.playable[annswerIndex];
}

function isToday(timestamp) {
    const today = new Date();
    const check = new Date(timestamp);
    return today.toDateString() === check.toDateString();
}

async function loadOrStartGame(debug) {
    wordList = await fetch("./src/fixtures/words.json")
        .then(response => {
            return response.json();
        })
        .then(json => {
            return json;
        });
    let answer;
    if (debug) {
        answer = testWordList[0];
    } else {
        answer = getTodaysAnswer();
    }
    const prevGame = JSON.parse(window.localStorage.getItem("PREFACE_WORDLE"));
    if  (prevGame && isToday(prevGame.timestamp)) {
        return {
            ...prevGame,
            answer
        }
    }
    return {
        attemptCount: 0,
        userAtempts: [],
        highlightedRows: [],
        keyboard: getKeyboard(),
        answer,
        status: "in-progress"
    };

}

 



































































































































