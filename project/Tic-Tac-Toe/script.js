const chooseX = document.getElementById("chooseX");
const chooseO = document.getElementById("chooseO");
const symbolSelection = document.getElementById("symbol-selection");
const gameBoard = document.getElementById("game-board");
const cells = document.querySelectorAll("[data-cell]");
const turnInfo = document.getElementById("turn-info");
const gameResult = document.getElementById("game-result");
const restartBtn = document.getElementById("restart-btn");

const X_CLASS = "X";
const O_CLASS = "O";

let currentTurn = X_CLASS;
let player1Symbol = "";
let player2Symbol = "";
let circleTurn = false;

const WINNING_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Choose X or O
chooseX.addEventListener("click", () => initializeGame(X_CLASS));
chooseO.addEventListener("click", () => initializeGame(O_CLASS));

function initializeGame(symbol) {
  player1Symbol = symbol;
  player2Symbol = symbol === X_CLASS ? O_CLASS : X_CLASS;
  circleTurn = player1Symbol === O_CLASS;

  symbolSelection.classList.add("hidden");
  gameBoard.classList.remove("hidden");
  turnInfo.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
  gameResult.classList.add("hidden");

  startBoard();
}

function startBoard() {
  cells.forEach((cell) => {
    cell.classList.remove(X_CLASS, O_CLASS);
    cell.textContent = "";
    cell.addEventListener("click", handleClick, { once: true });
  });
  updateTurnInfo();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = circleTurn ? O_CLASS : X_CLASS;

  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    updateTurnInfo();
  }
}

function placeMark(cell, currentClass) {
  cell.textContent = currentClass;
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function updateTurnInfo() {
  const playerTurn = circleTurn ? `Player 2 (${player2Symbol})` : `Player 1 (${player1Symbol})`;
  turnInfo.textContent = `${playerTurn}'s turn`;
}

function checkWin(currentClass) {
  return WINNING_COMBOS.some((combo) =>
    combo.every((index) => cells[index].classList.contains(currentClass))
  );
}

function isDraw() {
  return [...cells].every(
    (cell) => cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)
  );
}

function endGame(draw) {
  if (draw) {
    gameResult.textContent = "🤝 It's a Draw!";
  } else {
    const winner = circleTurn ? "Player 2" : "Player 1";
    gameResult.textContent = `🏆 ${winner} Wins!`;
  }
  gameResult.classList.remove("hidden");
  turnInfo.classList.add("hidden");
}

restartBtn.addEventListener("click", () => {
  symbolSelection.classList.remove("hidden");
  gameBoard.classList.add("hidden");
  turnInfo.classList.add("hidden");
  gameResult.classList.add("hidden");
  restartBtn.classList.add("hidden");
});
