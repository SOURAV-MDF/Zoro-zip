// Matrix rain background
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@";
let fontSize = 16;
let columns = 0;
let drops = [];

function resizeMatrix() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  columns = Math.floor(window.innerWidth / fontSize);
  drops = Array.from({ length: columns }, () =>
    Math.floor(Math.random() * (window.innerHeight / fontSize))
  );
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.055)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.fillStyle = "#00ff41";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }

  requestAnimationFrame(drawMatrix);
}

resizeMatrix();
window.addEventListener("resize", resizeMatrix);
drawMatrix();

// Name input
const nameInput = document.getElementById("nameInput");
const enterBtn = document.getElementById("enterBtn");
const output = document.getElementById("output");

function executeName() {
  const name = nameInput.value.trim();

  if (!name) {
    output.textContent = "> ERROR: NAME_REQUIRED";
    return;
  }

  output.textContent = `> ACCESS GRANTED // Welcome, ${name.toUpperCase()}_`;
  nameInput.value = "";
}

enterBtn.addEventListener("click", executeName);
nameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") executeName();
});

// Live terminal clock
const clock = document.getElementById("clock");

function updateClock() {
  const now = new Date();
  clock.textContent = `> local_time: ${now.toLocaleTimeString()}`;
}

updateClock();
setInterval(updateClock, 1000);

// Background music controls.
// Browsers generally block autoplay, so music starts after a user click.
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.textContent = "■ STOP MUSIC";
    } else {
      music.pause();
      musicBtn.textContent = "▶ START MUSIC";
    }
  } catch (error) {
    musicBtn.textContent = "AUDIO BLOCKED";
    console.error("Audio playback failed:", error);
  }
});
