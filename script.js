const wordContainer = document.querySelector(".word-container");
const complement = document.querySelector("#complement");
const guessesLeftContainer = document.querySelector("#guesses-left-container");
const guessedLettersContainer = document.querySelector(".guessed-letters");
const letterInput = document.querySelector("#letter-input");
const guessButton = document.querySelector("#guess-button");
const resetButton = document.querySelector("#reset-button");
let secretWord = "";
let displayedWord;
let guessesLeft;
let guessedLetters = "";

async function getRandomWord() {
    const response = await fetch("https://random-word-api.vercel.app/api?length=5");
    const data = await response.json();
    return data[0];
}

async function initGame() {
    secretWord = await getRandomWord();
    console.log(secretWord);
    guessesLeft = 10;
    guessedLetters = "";
    displayedWord = Array(secretWord.length).fill("_");

    let revealedCount = 0;
    const maxReveals = 2;
    let revealedLetters = [];

    while (revealedCount < maxReveals && revealedCount < secretWord.length) {
        const randomIndex = Math.floor(Math.random() * secretWord.length);
        if (displayedWord[randomIndex] === "_") {
            const letter = secretWord[randomIndex].toUpperCase();
            displayedWord[randomIndex] = letter;
            revealedCount++;

            if (!revealedLetters.includes(letter)) {
                revealedLetters.push(letter);
                guessedLetters += letter + " ";
            }
        }
    }

    updateDisplay();
    complement.textContent = "Good Luck!";
    complement.style.color = "rgb(8, 61, 62)";
    guessButton.disabled = false;
    letterInput.disabled = false;
}
function updateDisplay() {
    wordContainer.innerHTML = '';

    displayedWord.forEach(char => {
        const charElement = document.createElement('span');
        if (char === '_') {
            charElement.classList.add('dot');
            charElement.textContent = '•';
        } else {
            charElement.classList.add('letter');
            charElement.textContent = char;
        }
        charElement.textContent += " ";
        wordContainer.appendChild(charElement);
    });

    guessesLeftContainer.textContent = `You have ${guessesLeft} guesses remaining.`;
    guessedLettersContainer.textContent = guessedLetters;
    letterInput.value = "";
    if (checkLose()) {
        complement.textContent = "You lose! The word was " + secretWord.toUpperCase();
        complement.style.color = "red";
        gameOver();
        return;
    }
    else if (checkWin()) {
        complement.textContent = "You win! The word was " + secretWord.toUpperCase();
        complement.style.color = "green";
        gameOver();
        return;
    }
}
function checkWin() {
    return displayedWord.join("").toLowerCase() === secretWord.toLowerCase();
}
function checkLose() {
    return guessesLeft <= 0;
}
function gameOver() {
    if (checkLose() || checkWin()) {
        guessButton.disabled = true;
        letterInput.disabled = true;
    }
}
guessButton.addEventListener("click", () => {
    const letter = letterInput.value.toLowerCase();
    let letterIndex;
    if (letter.match(/[a-z]/)) {
        if (guessedLetters.includes(letter.toUpperCase())) {
            complement.textContent = `You already guessed the letter ${letter.toUpperCase()}`;
            complement.style.color = "red";
            letterInput.value = "";
            return;
        }
        else if (secretWord.includes(letter)) {
            for (let i = 0; i < secretWord.length; i++) {
                if (secretWord[i] === letter) {
                    displayedWord[i] = letter.toUpperCase();
                }
            }
            complement.textContent = `Good Guess! The word has letter ${letter.toUpperCase()}`;
            complement.style.color = "green";
        }
        else {
            complement.textContent = `Bad Guess! The word doesn't have letter ${letter.toUpperCase()}`;
            complement.style.color = "red";
            guessesLeft--;
        }
        guessedLetters += letter.toUpperCase() + " ";
    }
    else {
        complement.textContent = "Please enter a valid letter";
        complement.style.color = "red";
    }
    updateDisplay();
});
resetButton.addEventListener("click", () => {
    initGame();
});

letterInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        guessButton.click();
    }
});

initGame();