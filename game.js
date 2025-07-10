// Obtener canvas y contexto
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño de pantalla
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Jugador
const player = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  size: 30,
  color: "cyan",
  speed: 10
};

// Arreglo de balas
const bullets = [];

// Enemigos
const enemies = [];

// Función para dibujar al jugador
function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);
}

// Disparar
function shoot() {
  bullets.push({
    x: player.x,
    y: player.y - player.size / 2,
    size: 8,
    color: "yellow",
    speed: 12
  });
}

// Dibujar balas
function drawBullets() {
  bullets.forEach((bullet, index) => {
    bullet.y -= bullet.speed;
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x - bullet.size / 2, bullet.y - bullet.size / 2, bullet.size, bullet.size);

    // Eliminar si sale de pantalla
    if (bullet.y < 0) bullets.splice(index, 1);
  });
}

// Crear enemigos
function createEnemy() {
  const size = 30;
  const x = Math.random() * (canvas.width - size) + size / 2;
  enemies.push({
    x,
    y: -size,
    size,
    color: "red",
    speed: 3
  });
}

// Dibujar enemigos
function drawEnemies() {
  enemies.forEach((enemy, eIndex) => {
    enemy.y += enemy.speed;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x - enemy.size / 2, enemy.y - enemy.size / 2, enemy.size, enemy.size);

    // Eliminar si sale de pantalla
    if (enemy.y > canvas.height) enemies.splice(eIndex, 1);

    // Colisión con balas
    bullets.forEach((bullet, bIndex) => {
      if (
        bullet.x < enemy.x + enemy.size / 2 &&
        bullet.x > enemy.x - enemy.size / 2 &&
        bullet.y < enemy.y + enemy.size / 2 &&
        bullet.y > enemy.y - enemy.size / 2
      ) {
        enemies.splice(eIndex, 1);
        bullets.splice(bIndex, 1);
      }
    });
  });
}

// Mover jugador con teclado
const keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shoot(); // Disparar con espacio
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Mover jugador con mouse
window.addEventListener("mousemove", (e) => {
  player.x = e.clientX;
});

// Bucle del juego
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Movimiento con teclas
  if (keys["ArrowLeft"] || keys["a"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += player.speed;

  // Limitar a bordes
  if (player.x < player.size / 2) player.x = player.size / 2;
  if (player.x > canvas.width - player.size / 2) player.x = canvas.width - player.size / 2;

  drawPlayer();
  drawBullets();
  drawEnemies();

  requestAnimationFrame(gameLoop);
}

// Crear enemigos cada cierto tiempo
setInterval(createEnemy, 1000);

// Iniciar juego
gameLoop();
