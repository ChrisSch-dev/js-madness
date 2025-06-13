const ROWS = 6, COLS = 7;
let board, currentPlayer, gameOver;
const gameBoard = document.getElementById('game-board');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart-btn');

// THEME SWITCH LOGIC
const themeToggle = document.getElementById('theme-toggle');
const darkClass = 'dark';

function setTheme(dark) {
  document.body.classList.toggle(darkClass, dark);
  themeToggle.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

// Persist theme in localStorage
function getThemePref() {
  if(localStorage.getItem('connect4-theme')) return localStorage.getItem('connect4-theme') === 'dark';
  // fallback to system
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}
setTheme(getThemePref());
themeToggle.onclick = () => {
  const dark = !document.body.classList.contains(darkClass);
  setTheme(dark);
  localStorage.setItem('connect4-theme', dark ? 'dark' : 'light');
};

// CONNECT 4 LOGIC
function createBoard() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  gameBoard.innerHTML = '';
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.addEventListener('click', handleCellClick);
      gameBoard.appendChild(cell);
    }
  }
}

function handleCellClick(e) {
  if (gameOver) return;
  const col = +e.target.dataset.col;
  // Find lowest empty row in this column
  let rowToFill = -1;
  for (let row = ROWS - 1; row >= 0; row--) {
    if (!board[row][col]) {
      rowToFill = row;
      break;
    }
  }
  if (rowToFill === -1) return; // Column full

  board[rowToFill][col] = currentPlayer;
  updateBoard();
  if (checkWin(rowToFill, col, currentPlayer)) {
    message.textContent = `Player ${currentPlayer === 'red' ? 'Red' : 'Yellow'} wins!`;
    gameOver = true;
  } else if (board.flat().every(cell => cell)) {
    message.textContent = "It's a draw!";
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    message.textContent = `Player ${currentPlayer === 'red' ? 'Red' : 'Yellow'}'s turn`;
  }
}

function updateBoard() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const idx = row * COLS + col;
      const cellDiv = gameBoard.children[idx];
      cellDiv.classList.remove('red', 'yellow');
      if (board[row][col]) cellDiv.classList.add(board[row][col]);
    }
  }
}

function checkWin(row, col, player) {
  function count(dirRow, dirCol) {
    let r = row + dirRow, c = col + dirCol, count = 0;
    while (
      r >= 0 && r < ROWS &&
      c >= 0 && c < COLS &&
      board[r][c] === player
      ) {
      count++;
      r += dirRow; c += dirCol;
    }
    return count;
  }
  // 4 directions: horizontal, vertical, diag1, diag2
  return (
    1 + count(0, 1) + count(0, -1) >= 4 ||
    1 + count(1, 0) + count(-1, 0) >= 4 ||
    1 + count(1, 1) + count(-1, -1) >= 4 ||
    1 + count(1, -1) + count(-1, 1) >= 4
  );
}

function restartGame() {
  createBoard();
  currentPlayer = Math.random() < 0.5 ? 'red' : 'yellow';
  message.textContent = `Player ${currentPlayer === 'red' ? 'Red' : 'Yellow'} starts!`;
  gameOver = false;
}

restartBtn.addEventListener('click', restartGame);

// Start game on load
restartGame();