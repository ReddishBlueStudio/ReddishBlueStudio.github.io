document.addEventListener("DOMContentLoaded", () => {
  const wanganBtn = document.getElementById("btnWangan");
  const tougeBtn = document.getElementById("btnTouge");
  const gameBtn = document.getElementById("btnGame");

  const sectionImage = document.getElementById("sectionImage");
  const introSection = document.getElementById("introSection");

  const wanganSection = document.getElementById("wangan");
  const tougeSection = document.getElementById("touge");
  const gameSection = document.getElementById("gameSection");

  let gameStarted = false;

  wanganBtn.addEventListener("click", () => {
    showSection(wanganSection, "images/wangan.jpg");
  });

  tougeBtn.addEventListener("click", () => {
    showSection(tougeSection, "images/touge.jpg");
  });

  gameBtn.addEventListener("click", () => {
    showSection(gameSection, "images/road.jpg");

    if (!gameStarted) {
      startGame();
      gameStarted = true;
    }
  });

  function showSection(targetSection, imagePath) {
    [wanganSection, tougeSection, gameSection].forEach(sec => sec.classList.add("hidden"));
    targetSection.classList.remove("hidden");

    if (imagePath) {
      sectionImage.src = imagePath;
      introSection.classList.remove("hidden");
    } else {
      introSection.classList.add("hidden");
    }
  }
});

function startGame() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const gameSection = document.getElementById("gameSection");

  const ROAD_X = 60;
  const ROAD_WIDTH = 200;

  const player = {
    width: 30,
    height: 50,
    x: canvas.width / 2 - 15,
    y: canvas.height - 70,
    speed: 5,
    color: "blue"
  };

  const enemy = {
    width: 30,
    height: 50,
    x: getRandomLane(),
    y: -60,
    speed: 4,
    color: "red"
  };

  function getRandomLane() {
    const lanes = [ROAD_X + 10, ROAD_X + 85, ROAD_X + 160];
    return lanes[Math.floor(Math.random() * lanes.length)];
  }

  const keys = {};
  document.addEventListener("keydown", e => keys[e.key] = true);
  document.addEventListener("keyup", e => keys[e.key] = false);

  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener("touchstart", () => keys["ArrowLeft"] = true);
    leftBtn.addEventListener("touchend", () => keys["ArrowLeft"] = false);
    rightBtn.addEventListener("touchstart", () => keys["ArrowRight"] = true);
    rightBtn.addEventListener("touchend", () => keys["ArrowRight"] = false);
  }

  function movePlayer() {
    if (keys["ArrowLeft"] && player.x > ROAD_X + 5) {
      player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x + player.width < ROAD_X + ROAD_WIDTH - 5) {
      player.x += player.speed;
    }
  }

  function moveEnemy() {
    enemy.y += enemy.speed;
    if (enemy.y > canvas.height) {
      enemy.y = -60;
      enemy.x = getRandomLane();
    }
  }

  function detectCollision(a, b) {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  function drawCar(car) {
    ctx.fillStyle = car.color;
    ctx.fillRect(car.x, car.y, car.width, car.height);
  }

  function drawRoad() {
    ctx.fillStyle = "#555";
    ctx.fillRect(ROAD_X, 0, ROAD_WIDTH, canvas.height);
  }

  let gameOver = false;

  function loop() {
    // Skip game updates if game section is hidden
    if (gameSection.classList.contains("hidden")) {
      requestAnimationFrame(loop);
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    movePlayer();
    moveEnemy();
    drawCar(player);
    drawCar(enemy);

    if (detectCollision(player, enemy)) {
      gameOver = true;
    }

    if (gameOver) {
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.fillText("GAME OVER", canvas.width / 2 - 70, canvas.height / 2);
      return;
    }

    requestAnimationFrame(loop);
  }

  loop();
}
