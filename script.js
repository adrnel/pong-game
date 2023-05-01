const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

// Add score variables
let playerScore = 0;
let cpuScore = 0;

// Function to display the scores
function displayScores() {
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(playerScore, canvas.width / 4, 30);
  ctx.fillText(cpuScore, (3 * canvas.width) / 4, 30);
}

function showWinner(winner) {
  clearInterval(gameInterval);
  gamePaused = true;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '36px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(winner + ' wins!', canvas.width / 2, canvas.height / 2);

  resetGame();
}

let playerY = (canvas.height - paddleHeight) / 2;
let cpuY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let difficulty = 0.1; // Default difficulty (medium)

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles and ball
  ctx.fillStyle = 'white';
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, cpuY, paddleWidth, paddleHeight);
  ctx.fillRect(ballX, ballY, ballSize, ballSize);

  // Display scores
  displayScores();
}


function update() {
  // Update ball position
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Collision with walls
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Collision with paddles
  if (
    (ballX <= paddleWidth && ballY >= playerY && ballY <= playerY + paddleHeight) ||
    (ballX + ballSize >= canvas.width - paddleWidth && ballY >= cpuY && ballY <= cpuY + paddleHeight)
  ) {
    ballSpeedX = -ballSpeedX * 1.1; // Increase ball speed by 10% after each hit
    ballSpeedY *= 1.1;
  }

  // Ball out of bounds
  if (ballX <= 0 || ballX + ballSize >= canvas.width) {
    // Increment scores
    if (ballX <= 0) {
      cpuScore++;
    } else {
      playerScore++;
    }

    // Check for winner
    if (playerScore >= 10 || cpuScore >= 10) {
      showWinner(playerScore >= 10 ? 'Player' : 'CPU');
      return;
    }

    // Reset ball position and speed
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = 5;
    ballSpeedY = 5;
  }

  // CPU paddle movement
  cpuY += (ballY - (cpuY + paddleHeight / 2)) * difficulty;

  draw();
}

// Mouse event listener for player movement
canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  playerY = event.clientY - rect.top - paddleHeight / 2;
});

// Game UI functionality
const mainMenu = document.getElementById('mainMenu');
const gameCanvas = document.getElementById('gameCanvas');
const difficultySelect = document.getElementById('difficulty');
const startButton = document.getElementById('startButton');
const gameUI = document.getElementById('gameUI');
const pauseButton = document.getElementById('pauseButton');
const quitButton = document.getElementById('quitButton');

let gameInterval;
let gamePaused = false;

function startGame() {
  difficulty = parseFloat(difficultySelect.value);
  mainMenu.style.display = 'none';
  gameCanvas.style.display = 'block';
  gameUI.style.display = 'block';
  // Start the game loop
  gameInterval = setInterval(update, 1000 / 60);
}

function quitGame() {
  clearInterval(gameInterval);
  gamePaused = false;
  gameUI.style.display = 'none';
  gameCanvas.style.display = 'none';
  mainMenu.style.display = 'block';

  // Reset game state
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 5;
  playerY = (canvas.height - paddleHeight) / 2;
  cpuY = (canvas.height - paddleHeight) / 2;
  pauseButton.innerText = 'Pause';
  resetGame();
}

function resetGame() {
  // Reset scores
  playerScore = 0;
  cpuScore = 0;

  // Reset ball position and speed
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 5;
  ballSpeedY = 5;
}

function pauseGame() {
  if (!gamePaused) {
    clearInterval(gameInterval); // Stop the game loop when the game is paused
    pauseButton.innerText = 'Resume'; // Change the button text to 'Resume'
  } else {
    gameInterval = setInterval(update, 1000 / 60); // Restart the game loop when the game is resumed
    pauseButton.innerText = 'Pause'; // Change the button text back to 'Pause'
  }
  gamePaused = !gamePaused; // Toggle the gamePaused variable to its opposite value
}


window.onload = function () {
  // Attach event listeners to buttons
  startButton.addEventListener('click', startGame);
  pauseButton.addEventListener('click', pauseGame);
  quitButton.addEventListener('click', quitGame);
};