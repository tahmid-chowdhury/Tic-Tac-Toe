// Define constants for the game
const BOARD_SIZE = 3;
const EMPTY_SQUARE = "";
const HUMAN_PLAYER = "X";
const COMPUTER_PLAYER = "O";

// Initialize variables for the game
let board = [];
let currentPlayer = HUMAN_PLAYER;

// Function to update the message displayed on the page
function updateMessage(message) {
  const messageElement = document.getElementById("message");
  messageElement.textContent = message;
}

// Function to update the game board on the page
function renderBoard() {
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      const square = document.getElementById(`${row}${col}`);
      square.textContent = board[row][col];
    }
  }
}

// Function to update turn
function updateTurn(turn) {
  const turnElement = document.getElementById("turn");
  turnElement.textContent = turn;
}

//Function that shows whose turn it is
function getTurn() {
  if (currentPlayer === HUMAN_PLAYER) {
    return "Your";
  } else {
    return "computer";
  }
}

// Function to initialize the game board and reset the game state
function initializeGame() {
  board = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => EMPTY_SQUARE)
  );
  currentPlayer = HUMAN_PLAYER;
  updateMessage("");
  updateTurn("");
  renderBoard();
}

// Function to check if a given player has won the game
function checkWin(player) {
  // Check rows
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (
      board[i][0] === player &&
      board[i][1] === player &&
      board[i][2] === player
    ) {
      return true;
    }
  }
  // Check columns
  for (let i = 0; i < BOARD_SIZE; i++) {
    if (
      board[0][i] === player &&
      board[1][i] === player &&
      board[2][i] === player
    ) {
      return true;
    }
  }
  // Check diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    return true;
  }
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    return true;
  }
  // No winning combination found
  return false;
}

// Function to check if the game is a draw
function checkDraw() {
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === "") {
        return false;
      }
    }
  }
  return true;
}

// Function that uses the minimax algorithm to determine the best move for the computer player
function minimax(depth, player) {
  if (checkWin(HUMAN_PLAYER)) {
    return { score: -1 };
  }
  if (checkWin(COMPUTER_PLAYER)) {
    return { score: 1 };
  }
  if (checkDraw()) {
    return { score: 0 };
  }
  let bestMove;
  if (player === COMPUTER_PLAYER) {
    let bestScore = -Infinity;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY_SQUARE) {
          board[i][j] = COMPUTER_PLAYER;
          const score = minimax(depth + 1, HUMAN_PLAYER).score;
          board[i][j] = EMPTY_SQUARE;
          if (score > bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
    return { move: bestMove, score: bestScore };
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === EMPTY_SQUARE) {
          board[i][j] = HUMAN_PLAYER;
          const score = minimax(depth + 1, COMPUTER_PLAYER).score;
          board[i][j] = EMPTY_SQUARE;
          if (score < bestScore) {
            bestScore = score;
            bestMove = [i, j];
          }
        }
      }
    }
    return { move: bestMove, score: bestScore };
  }
}

// Function that makes a move for the computer player
function playComputerMove() {
  const bestMove = minimax(0, COMPUTER_PLAYER).move;
  board[bestMove[0]][bestMove[1]] = COMPUTER_PLAYER;
  renderBoard();
  if (checkWin(COMPUTER_PLAYER)) {
    updateMessage("Computer wins!");
    return;
  } else if (checkDraw()) {
    updateMessage("It's a draw!");
    return;
  } else {
    currentPlayer = HUMAN_PLAYER;
    updateTurn(`${getTurn()} turn (X)`);
  }
}

// Handle a click on a square
function handleSquareClick(event) {
  const row = parseInt(event.target.id.charAt(0));
  const col = parseInt(event.target.id.charAt(1));
  if (board[row][col] === EMPTY_SQUARE && currentPlayer === HUMAN_PLAYER) {
    board[row][col] = HUMAN_PLAYER;
    renderBoard();
    if (checkWin(HUMAN_PLAYER)) {
      updateMessage("Player wins!");
      return;
    } else if (checkDraw()) {
      updateMessage("It's a draw!");
      return;
    } else {
      currentPlayer = COMPUTER_PLAYER;
      updateTurn(`${getTurn()}'s turn (O)`);
      window.setTimeout(playComputerMove, 1000);
    }
  }
}

// Attach a click event listener to each square on the board
const squares = document.querySelectorAll("td");
squares.forEach((square) => {
  square.addEventListener("click", handleSquareClick);
});

// Handle a click on the "New Game" button
function handleNewGame() {
  initializeGame();
}

// Attach a click event listener to the "New Game" button
const newGameButton = document.getElementById("new-game");
newGameButton.addEventListener("click", handleNewGame);

// Initialize the game on load
initializeGame();
