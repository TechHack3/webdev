let timer;
let isRunning = false;
let timeLeft = 25 * 60;

const timeDisplay = document.getElementById("time");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resetBtn = document.getElementById("reset");

function updateDisplay() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
  if (isRunning) return;
  isRunning = true;
  timer = setInterval(() => {
    timeLeft--;
    updateDisplay();
    if (timeLeft === 0) {
      clearInterval(timer);
      alert("Time's up! Take a break!");
      isRunning = false;
    }
  }, 1000);
}

pauseBtn.onclick = () => { clearInterval(timer); isRunning = false; };
resetBtn.onclick = () => { clearInterval(timer); isRunning = false; timeLeft = 25 * 60; updateDisplay(); };
startBtn.onclick = startTimer;
updateDisplay();
