const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let enemies = [];
let score = 0;
let gameOver = false;
let timer = 10;

function spawnEnemy() {
  const isBot = Math.random() < 0.5;
  const enemy = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 30,
    isBot: isBot,
    color: isBot ? "red" : "blue",
  };
  enemies.push(enemy);
}

function drawEnemy(enemy) {
  ctx.fillStyle = enemy.color;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
  ctx.fill();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  enemies.forEach(drawEnemy);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Temps: ${timer}`, canvas.width - 100, 30);
}

function updateGame() {
  if (gameOver) return;
  drawGame();
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  enemies = enemies.filter((enemy) => {
    const distance = Math.sqrt(
      (x - enemy.x) ** 2 + (y - enemy.y) ** 2
    );
    if (distance < enemy.size) {
      if (enemy.isBot) {
        score++;
        return false;
      } else {
        gameOver = true;
        document.getElementById("game-status").textContent = "Échec : tu as cliqué sur un civil !";
      }
    }
    return true;
  });
});

setInterval(() => {
  if (!gameOver) spawnEnemy();
}, 1000);

const countdown = setInterval(() => {
  if (timer > 0 && !gameOver) {
    timer--;
  } else {
    clearInterval(countdown);
    gameOver = true;
    document.getElementById("game-status").textContent =
      score >= 5 ? "Succès : tu as protégé la forteresse !" : "Échec : trop peu de bots éliminés !";
  }
}, 1000);

function gameLoop() {
  updateGame();
  if (!gameOver) requestAnimationFrame(gameLoop);
}
gameLoop();
