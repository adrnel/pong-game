const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 35;
const paddleHeight = 100;
const ballSize = 10;
const initialBallSpeed = 5;
const paddleCollisionOffset = 7; // Adjust this value to increase or decrease the collision box size
const speedLimit = 17; // Adjust this value to increase or decrease the maximum speed of the ball

let delayBall = false;
let delayStartTime;

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
let ballSpeedX = initialBallSpeed;
let ballSpeedY = initialBallSpeed;
let currentBallSpeed = initialBallSpeed;
let difficulty = 0.14; // Default difficulty (medium)

let ballTrail = [];
const trailLength = 3; // Length of the trail

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw paddles and ball
  ctx.fillStyle = 'white';
  ctx.fillRect(0, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(canvas.width - paddleWidth, cpuY, paddleWidth, paddleHeight);

  // Draw the ball as a circle instead of a square
  ctx.beginPath();
  ctx.arc(ballX + ballSize / 2, ballY + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
  ctx.fill();

  for (let i = 0; i < ballTrail.length; i++) {
    const ratio = (ballTrail.length - i) / ballTrail.length;
    ctx.fillStyle = `rgba(255, 255, 255, ${ratio / 2})`;
    const pos = ballTrail[i];
    ctx.beginPath();
    ctx.arc(pos.x + ballSize / 2, pos.y + ballSize / 2, ballSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Display scores
  displayScores();
}

function update() {

  ballTrail.unshift({x: ballX, y: ballY});
  if (ballTrail.length > trailLength) {
    ballTrail.pop();
  }

  // Delay ball movement for half a second at the start of each point
  if (delayBall) {
    if (Date.now() - delayStartTime >= 500) {
      // After half a second, reset ball speed
      ballSpeedX = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
      ballSpeedY = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
      delayBall = false;
    }
  } else {
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }

  // Collision with walls
  if (ballY <= 0) {
    ballY = 0;
    ballSpeedY = -ballSpeedY;
  } else if (ballY + ballSize >= canvas.height) {
    ballY = canvas.height - ballSize;
    ballSpeedY = -ballSpeedY;
  }

// Collision with paddles
if (
  (ballX <= paddleWidth && ballY + ballSize >= playerY - paddleCollisionOffset && ballY <= playerY + paddleHeight + paddleCollisionOffset)
) {
  let relativeIntersectY = (playerY + (paddleHeight / 2)) - ballY;
  let normalizedRelativeIntersectionY = (relativeIntersectY / (paddleHeight / 2));
  let bounceAngle = (normalizedRelativeIntersectionY * 30 + 15) * (Math.PI / 180);

  // Calculate total speed before the bounce
  let totalSpeed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);

  // Increase speed
  totalSpeed *= 1.05;

  // Apply speed limit
  totalSpeed = Math.min(totalSpeed, speedLimit);

  // Apply that total speed to the new angle
  ballSpeedX = totalSpeed * Math.cos(bounceAngle);
  ballSpeedY = totalSpeed * -Math.sin(bounceAngle);
} else if (
  (ballX + ballSize >= canvas.width - paddleWidth && ballY + ballSize >= cpuY - paddleCollisionOffset && ballY <= cpuY + paddleHeight + paddleCollisionOffset)
) {
  let relativeIntersectY = (cpuY + (paddleHeight / 2)) - ballY;
  let normalizedRelativeIntersectionY = (relativeIntersectY / (paddleHeight / 2));
  let bounceAngle = (normalizedRelativeIntersectionY * 30 + 15) * (Math.PI / 180);

  // Calculate total speed before the bounce
  let totalSpeed = Math.sqrt(ballSpeedX * ballSpeedX + ballSpeedY * ballSpeedY);

  // Increase speed
  totalSpeed *= 1.05;

  // Apply speed limit
  totalSpeed = Math.min(totalSpeed, speedLimit);

  // Apply that total speed to the new angle
  ballSpeedX = totalSpeed * -Math.cos(bounceAngle);
  ballSpeedY = totalSpeed * -Math.sin(bounceAngle);
}



  // ballSpeedX = ballSpeedX > speedLimit ? speedLimit : ballSpeedX;
  // ballSpeedX = ballSpeedX < -speedLimit ? -speedLimit : ballSpeedX;
  // ballSpeedY = ballSpeedY > speedLimit ? speedLimit : ballSpeedY;


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
    ballSpeedX = 0;
    ballSpeedY = 0;
    currentBallSpeed = initialBallSpeed;

    // Delay ball movement
    delayBall = true;
    delayStartTime = Date.now();
  }

  // Delay ball movement for half a second at the start of each point
  if (delayBall) {
    if (Date.now() - delayStartTime >= 500) {
      // After half a second, reset ball speed
      ballSpeedX = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
      ballSpeedY = initialBallSpeed * (Math.random() < 0.5 ? -1 : 1);
      delayBall = false;
    }
  } else {
    // Update ball position
    ballX += ballSpeedX;
    ballY += ballSpeedY;
  }


  // CPU paddle movement
  let cpuNextY = cpuY + (ballY - (cpuY + paddleHeight / 2)) * difficulty;
  cpuY = cpuNextY < 0 ? 0 : cpuNextY + paddleHeight > canvas.height ? canvas.height - paddleHeight : cpuNextY;

  draw();
}

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  let scale = canvas.height / rect.height;
  let mouseY = (event.clientY - rect.top) * scale - paddleHeight / 2;
  playerY = mouseY < 0 ? 0 : mouseY + paddleHeight > canvas.height ? canvas.height - paddleHeight : mouseY;
});

canvas.addEventListener('touchmove', function(event) {
  event.preventDefault(); // Prevent scrolling when interacting with the canvas
  
  const rect = canvas.getBoundingClientRect();
  let scale = canvas.height / rect.height;
  let touchY = (event.touches[0].clientY - rect.top) * scale - paddleHeight / 2;
  playerY = touchY < 0 ? 0 : touchY + paddleHeight > canvas.height ? canvas.height - paddleHeight : touchY;
}, { passive: false }); // passive: false is required for preventDefault() to work in certain browsers



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

  // Set delayBall to true
  delayBall = true;
  delayStartTime = Date.now();

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
  ballSpeedX = initialBallSpeed;
  ballSpeedY = initialBallSpeed;
  currentBallSpeed = initialBallSpeed;
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
  ballSpeedX = initialBallSpeed;
  ballSpeedY = initialBallSpeed;
  currentBallSpeed = initialBallSpeed;
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

