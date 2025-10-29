let startTime, endTime, timeout;
const box = document.getElementById("box");
const msg = document.getElementById("message");

function startGame() {
  box.style.background = "crimson";
  msg.textContent = "Wait for green...";
  const delay = Math.random() * 3000 + 1000;

  timeout = setTimeout(() => {
    box.style.background = "lime";
    startTime = Date.now();
    msg.textContent = "Click now!";
  }, delay);
}

box.onclick = function () {
  if (box.style.background === "lime") {
    endTime = Date.now();
    const reaction = (endTime - startTime) / 1000;
    msg.textContent = `⏱ Reaction Time: ${reaction}s`;
    box.style.background = "blue";
    clearTimeout(timeout);
    setTimeout(startGame, 2000);
  } else {
    msg.textContent = "Too early! Wait for green...";
    clearTimeout(timeout);
    setTimeout(startGame, 1500);
  }
};

startGame();
