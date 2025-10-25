// Sample texts
const texts = [
    "The quick brown fox jumps over the lazy dog.",
    "In a hole in the ground there lived a hobbit.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "The only way to do great work is to love what you do.",
    "Life is what happens to you while you're busy making other plans.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "You miss 100% of the shots you don't take.",
    "The best way to predict the future is to create it.",
    "Believe you can and you're halfway there."
];

// DOM elements
const textEl = document.getElementById('text');
const inputEl = document.getElementById('input');
const wpmEl = document.getElementById('wpm');
const accEl = document.getElementById('acc');
const timeEl = document.getElementById('time');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const newTextBtn = document.getElementById('newText');
const difficultySel = document.getElementById('difficulty');
const oppW = document.querySelector('.oppW');

// Game state
let chars = [];
let currentIndex = 0;
let totalTyped = 0;
let correctTyped = 0;
let started = false;
let startTime = 0;
let opponentWPM = 45;
let opponentProgress = 0;
let playerProgress = 0;

// Functions
function setTextsList() {
    // Already defined above
}

function pickText() {
    return texts[Math.floor(Math.random() * texts.length)];
}

function renderText(text) {
    textEl.innerHTML = '';
    chars = [];
    for (let char of text) {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char;
        textEl.appendChild(span);
        chars.push(span);
    }
}

function updateStats() {
    const time = started ? (Date.now() - startTime) / 1000 : 0;
    const wpm = time > 0 ? Math.round((correctTyped / 5) / (time / 60)) : 0;
    const acc = totalTyped > 0 ? Math.round((correctTyped / totalTyped) * 100) : 100;
    wpmEl.textContent = wpm;
    accEl.textContent = acc + '%';
    timeEl.textContent = time.toFixed(1) + 's';
}

function movePlayer() {
    playerProgress = currentIndex / chars.length;
    const playerPos = document.querySelector('.player .pos');
    playerPos.style.transform = `translateX(${playerProgress * 100}%)`;
}

function moveOpponent() {
    if (!started) return;
    const time = (Date.now() - startTime) / 1000;
    const opponentCharsTyped = (opponentWPM / 60) * time * 5; // 5 chars per word
    opponentProgress = Math.min(opponentCharsTyped / chars.length, 1);
    const opponentPos = document.querySelector('.opponent .pos');
    opponentPos.style.transform = `translateX(${opponentProgress * 100}%)`;
}

function finalizeResult() {
    started = false;
    inputEl.disabled = true;
    // You can add more logic here for end of game
}

function resetAll() {
    started = false;
    startTime = 0;
    currentIndex = 0;
    totalTyped = 0;
    correctTyped = 0;
    playerProgress = 0;
    opponentProgress = 0;
    inputEl.value = '';
    inputEl.disabled = false;
    chars.forEach(ch => ch.classList.remove('correct', 'incorrect', 'current'));
    updateStats();
    movePlayer();
    moveOpponent();
}

// Event listeners
inputEl.addEventListener('input', (e) => {
    if (!started) {
        started = true;
        startTime = Date.now();
    }
    const val = e.target.value;
    totalTyped = val.length;
    // check char by char and color
    for (let i = 0; i < chars.length; i++) {
        const ch = chars[i];
        const expected = ch.textContent;
        ch.classList.remove('correct', 'incorrect', 'current');
        if (i < val.length) {
            if (val[i] === expected) { ch.classList.add('correct'); }
            else { ch.classList.add('incorrect'); }
        }
    }
    // set current
    currentIndex = Math.min(val.length, chars.length);
    if (chars[currentIndex]) chars[currentIndex].classList.add('current');

    // correctTyped count
    let correct = 0;
    for (let i = 0; i < val.length && i < chars.length; i++) if (val[i] === chars[i].textContent) correct++;
    correctTyped = correct;

    updateStats();
    movePlayer();
    moveOpponent();

    if (currentIndex >= chars.length) {
        finalizeResult();
    }
});

startBtn.addEventListener('click', () => {
    resetAll();
    inputEl.focus();
    started = true;
    startTime = Date.now();
});

resetBtn.addEventListener('click', () => { renderText(pickText()); resetAll(); });
newTextBtn.addEventListener('click', () => { renderText(pickText()); resetAll(); });

difficultySel.addEventListener('change', () => {
    opponentWPM = parseFloat(difficultySel.value);
    oppW.textContent = opponentWPM;
});

// init
setTextsList();
renderText(pickText());
oppW.textContent = opponentWPM;

// accessibility: start typing on Enter
document.addEventListener('keydown', (e) => { if (e.key === 'Enter') { inputEl.focus(); } });
