const player = document.getElementById("player");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");
const startBtn = document.getElementById("startBtn");

let score = 0;
let bestScore = localStorage.getItem("blockDodgerBest") || 0;
let gameActive = false;
let speed = 3;
let spawnInterval;
let gameLoop;
let startTime;

bestDisplay.textContent = bestScore;

// Player movement
let playerX = 130;
let moveLeft = false;
let moveRight = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") moveLeft = true;
  if (e.key === "ArrowRight") moveRight = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") moveLeft = false;
  if (e.key === "ArrowRight") moveRight = false;
});

// Start game
startBtn.addEventListener("click", startGame);

function startGame() {
  if (gameActive) return;

  // Reset state
  gameActive = true;
  score = 0;
  speed = 3;
  startTime = Date.now();
  startBtn.disabled = true;
  scoreDisplay.textContent = score;

  // Clear old enemies
  document.querySelectorAll(".enemy").forEach(e => e.remove());

  // Spawn enemies
  spawnInterval = setInterval(spawnEnemy, 1000);
  gameLoop = requestAnimationFrame(updateGame);
}

// Game update loop
function updateGame() {
  if (!gameActive) return;

  // Move player
  if (moveLeft) playerX -= 5;
  if (moveRight) playerX += 5;

  playerX = Math.max(0, Math.min(playerX, gameArea.clientWidth - 40));
  player.style.left = playerX + "px";

  // Check collisions
  document.querySelectorAll(".enemy").forEach(enemy => {
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      endGame();
    }

    // Remove off-screen enemies
    if (enemy.offsetTop > 400) enemy.remove();
  });

  // Update score
  score = Math.floor((Date.now() - startTime) / 100);
  scoreDisplay.textContent = score;

  // Increase difficulty
  if (score % 100 === 0) speed += 0.02;

  requestAnimationFrame(updateGame);
}

// Spawn falling enemies
function spawnEnemy() {
  if (!gameActive) return;
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");
  const x = Math.random() * (gameArea.clientWidth - 40);
  enemy.style.left = `${x}px`;
  enemy.style.animationDuration = `${3 - speed * 0.05}s`;
  gameArea.appendChild(enemy);
}

// End game
function endGame() {
  gameActive = false;
  startBtn.disabled = false;
  clearInterval(spawnInterval);
  cancelAnimationFrame(gameLoop);

  // Save best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("blockDodgerBest", bestScore);
  }
  bestDisplay.textContent = bestScore;

  alert(`💥 Game Over! Your score: ${score}`);
}
