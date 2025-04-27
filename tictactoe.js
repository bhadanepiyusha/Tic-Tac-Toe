const vsComputerBtn = document.getElementById('vsComputerBtn');
const twoPlayerBtn = document.getElementById('twoPlayerBtn');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let vsComputer = false;

const winningConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// Menu button handlers
vsComputerBtn.addEventListener('click', () => {
  vsComputer = true;
  startGame();
});

twoPlayerBtn.addEventListener('click', () => {
  vsComputer = false;
  startGame();
});

function startGame() {
  menu.classList.add('hidden');
  game.classList.remove('hidden');
  resetBoard();
}

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (board[index] !== "" || !gameActive) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  checkResult();

  if (vsComputer && gameActive && currentPlayer === "O") {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  let bestMove = getBestMove();
  board[bestMove] = currentPlayer;
  cells[bestMove].textContent = currentPlayer;
  checkResult();
}

function getBestMove() {
  // 1. Try to win
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = currentPlayer;
      if (checkWin(currentPlayer)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  // 2. Try to block player
  const opponent = currentPlayer === "X" ? "O" : "X";
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = opponent;
      if (checkWin(opponent)) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }
  }
  // 3. Random move
  let emptyCells = [];
  board.forEach((cell, index) => {
    if (cell === "") {
      emptyCells.push(index);
    }
  });
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function checkWin(player) {
  return winningConditions.some(condition => {
    return condition.every(index => board[index] === player);
  });
}

function checkResult() {
  let roundWon = false;

  for (let condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
  } else {
    currentPlayer = (currentPlayer === "X") ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  cells.forEach(cell => cell.textContent = "");
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', resetBoard);
