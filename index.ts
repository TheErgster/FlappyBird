const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Game variables
const gravity = 0.5;
const birdSize = 30;
let birdY = canvas.height / 2;
let birdVelocity = 0;
let isGameOver = false;
let score = 0;

// Pipe variables
const pipeWidth = 50;
const pipeGap = 150;
let pipeX = canvas.width;
let pipeY = Math.random() * (canvas.height - pipeGap);

// Input
let isFlapping = false;

// Draw the bird
function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(canvas.width / 4, birdY, birdSize / 2, 0, Math.PI * 2);
  ctx.fill();
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "green";

  // Top pipe
  ctx.fillRect(pipeX, 0, pipeWidth, pipeY);

  // Bottom pipe
  ctx.fillRect(pipeX, pipeY + pipeGap, pipeWidth, canvas.height - pipeY - pipeGap);
}

// Update game state
function update() {
  if (isGameOver) return;

  // Bird physics
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Move pipes
  pipeX -= 2;

  // Respawn pipes
  if (pipeX + pipeWidth < 0) {
    pipeX = canvas.width;
    pipeY = Math.random() * (canvas.height - pipeGap);
    score++;
  }

  // Collision detection
  if (
    birdY - birdSize / 2 < 0 || // Hit the top
    birdY + birdSize / 2 > canvas.height || // Hit the bottom
    (pipeX < canvas.width / 4 + birdSize / 2 &&
      pipeX + pipeWidth > canvas.width / 4 - birdSize / 2 &&
      (birdY - birdSize / 2 < pipeY || birdY + birdSize / 2 > pipeY + pipeGap))
  ) {
    isGameOver = true;
  }
}

// Handle input
function flap() {
  if (isGameOver) {
    resetGame();
    return;
  }

  birdVelocity = -8;
}

function resetGame() {
  isGameOver = false;
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipeX = canvas.width;
  score = 0;
}

// Render everything
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();

  // Score
  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "36px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Event listener
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") flap();
});

// Start the game
gameLoop();
