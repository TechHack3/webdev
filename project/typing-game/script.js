const words = ["hello", "world", "javascript", "coding", "speed", "challenge"];
let currentWord, score = 0, time = 10;

const wordEl = document.getElementById('word');
const inputEl = document.getElementById('input');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
  currentWord = getRandomWord();
  wordEl.textContent = currentWord;
}

inputEl.addEventListener('input', () => {
  if (inputEl.value === currentWord) {
    score++;
    scoreEl.textContent = score;
    inputEl.value = '';
    currentWord = getRandomWord();
    wordEl.textContent = currentWord;
    time += 2;
  }
});

const timeInterval = setInterval(() => {
  time--;
  timeEl.textContent = time;
  if (time === 0) {
    clearInterval(timeInterval);
    alert(`Game Over! Final Score: ${score}`);
  }
}, 1000);

startGame();
