// Word bank (German words)
const words = [
    'programmierung', 'entwickler', 'funktion', 'variable', 'computer',
    'tastatur', 'bildschirm', 'internet', 'software', 'algorithmus',
    'datenbank', 'anwendung', 'schnittstelle', 'browser', 'webseite',
    'netzwerk', 'sicherheit', 'verschluesselung', 'fenster', 'maus'
];

// Game variables
let selectedWord = '';
let guessedLetters = [];
let wrongGuesses = [];
let maxWrongGuesses = 6;

// DOM elements
const wordDisplay = document.getElementById('word-display');
const messageDisplay = document.getElementById('message');
const keyboardDiv = document.getElementById('keyboard');
const newPuzzleBtn = document.getElementById('new-puzzle');
const guessedCircle = document.getElementById('guessed-circle');
const guessesRemaining = document.getElementById('guesses-remaining');

// Body parts in order (including chains)
const bodyParts = ['chain-left', 'chain-right', 'head', 'body', 'left-arm', 'right-arm', 'left-leg', 'right-leg'];

// Initialize game
function initGame() {
    // Reset game state
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    wrongGuesses = [];
    messageDisplay.textContent = '';
    messageDisplay.className = 'message';
    guessesRemaining.textContent = maxWrongGuesses;

    // Hide all body parts
    bodyParts.forEach(part => {
        const element = document.getElementById(part);
        if (element) {
            element.classList.add('hidden');
        }
    });

    // Clear guessed letters circle
    guessedCircle.innerHTML = '';

    // Create keyboard
    createKeyboard();

    // Display word
    updateWordDisplay();
}

// Create on-screen keyboard
function createKeyboard() {
    keyboardDiv.innerHTML = '';
    const alphabet = 'abcdefghijklmnopqrstuvwxyzäöü';

    alphabet.split('').forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter.toUpperCase();
        button.className = 'key';
        button.addEventListener('click', () => handleGuess(letter));
        keyboardDiv.appendChild(button);
    });
}

// Handle letter guess
function handleGuess(letter) {
    // Disable the button
    const buttons = keyboardDiv.querySelectorAll('.key');
    buttons.forEach(btn => {
        if (btn.textContent.toLowerCase() === letter) {
            btn.disabled = true;
        }
    });

    // Check if letter was already guessed
    if (guessedLetters.includes(letter)) {
        return;
    }

    guessedLetters.push(letter);

    // Check if letter is in the word
    const isCorrect = selectedWord.includes(letter);

    // Add to guessed letters circle
    addGuessedLetter(letter, isCorrect);

    if (isCorrect) {
        updateWordDisplay();
        checkWin();
    } else {
        wrongGuesses.push(letter);
        updateHangman();
        updateGuessesRemaining();
        checkLose();
    }
}

// Add letter to guessed circle
function addGuessedLetter(letter, isCorrect) {
    const letterDiv = document.createElement('div');
    letterDiv.className = `guessed-letter ${isCorrect ? 'correct' : 'wrong'}`;
    letterDiv.textContent = letter.toUpperCase();
    guessedCircle.appendChild(letterDiv);
}

// Update guesses remaining
function updateGuessesRemaining() {
    guessesRemaining.textContent = maxWrongGuesses - wrongGuesses.length;
}

// Update word display with ornate letter boxes
function updateWordDisplay() {
    wordDisplay.innerHTML = '';

    selectedWord.split('').forEach(letter => {
        const letterBox = document.createElement('div');
        letterBox.className = 'letter-box';
        letterBox.textContent = guessedLetters.includes(letter) ? letter.toUpperCase() : '';
        wordDisplay.appendChild(letterBox);
    });
}

// Update hangman drawing
function updateHangman() {
    const wrongCount = wrongGuesses.length;
    if (wrongCount > 0 && wrongCount <= bodyParts.length) {
        const element = document.getElementById(bodyParts[wrongCount - 1]);
        if (element) {
            element.classList.remove('hidden');
        }
    }
}

// Check for win
function checkWin() {
    const won = selectedWord.split('').every(letter => guessedLetters.includes(letter));

    if (won) {
        messageDisplay.textContent = '✨ Gewonnen! ✨';
        messageDisplay.classList.add('win');
        disableKeyboard();
    }
}

// Check for lose
function checkLose() {
    if (wrongGuesses.length >= maxWrongGuesses) {
        messageDisplay.textContent = `💀 Verloren! Das Wort war: ${selectedWord.toUpperCase()}`;
        messageDisplay.classList.add('lose');
        disableKeyboard();

        // Reveal the word
        wordDisplay.innerHTML = '';
        selectedWord.split('').forEach(letter => {
            const letterBox = document.createElement('div');
            letterBox.className = 'letter-box';
            letterBox.textContent = letter.toUpperCase();
            wordDisplay.appendChild(letterBox);
        });
    }
}

// Disable all keyboard buttons
function disableKeyboard() {
    const buttons = keyboardDiv.querySelectorAll('.key');
    buttons.forEach(btn => btn.disabled = true);
}

// New puzzle button
newPuzzleBtn.addEventListener('click', initGame);

// Keyboard support
document.addEventListener('keydown', (e) => {
    const letter = e.key.toLowerCase();
    if (/^[a-zäöü]$/.test(letter)) {
        const buttons = keyboardDiv.querySelectorAll('.key');
        buttons.forEach(btn => {
            if (btn.textContent.toLowerCase() === letter && !btn.disabled) {
                btn.click();
            }
        });
    }
});

// Start the game
initGame();
