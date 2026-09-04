// Krishna Janmashtami — interactive experience

const questions = [
  {
    q: "Krishna Janmashtami celebrates the birth of whom?",
    a: ["Lord Krishna", "Lord Shiva", "Lord Ganesha", "Lord Hanuman"],
    correct: 0
  },
  {
    q: "At what traditional time is Krishna's birth celebrated?",
    a: ["Sunrise", "Noon", "Midnight", "Sunset"],
    correct: 2
  },
  {
    q: "Which instrument is famously associated with Krishna?",
    a: ["Tabla", "Flute", "Veena", "Mridangam"],
    correct: 1
  },
  {
    q: "Which city is traditionally associated with Krishna's childhood?",
    a: ["Ayodhya", "Mathura", "Varanasi", "Ujjain"],
    correct: 1
  },
  {
    q: "What food is strongly associated with Krishna's childhood stories?",
    a: ["Makhan (butter)", "Rice", "Laddu", "Kheer"],
    correct: 0
  }
];

let current = 0;
let score = 0;
let answered = false;

const $ = id => document.getElementById(id);

function renderQuestion() {
  const item = questions[current];
  $("questionNo").textContent = `Question ${current + 1} / ${questions.length}`;
  $("scoreLabel").textContent = `Score: ${score}`;
  $("question").textContent = item.q;
  $("progress").style.width = `${((current + 1) / questions.length) * 100}%`;
  $("nextBtn").disabled = true;
  answered = false;

  const box = $("answers");
  box.innerHTML = "";

  item.a.forEach((answer, index) => {
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = answer;
    btn.addEventListener("click", () => chooseAnswer(index, btn));
    box.appendChild(btn);
  });
}

function chooseAnswer(index, clicked) {
  if (answered) return;
  answered = true;

  const item = questions[current];
  const all = document.querySelectorAll(".answer");
  all.forEach(btn => btn.disabled = true);

  if (index === item.correct) {
    clicked.classList.add("correct");
    score++;
    showToast("✨ Correct! Jai Shri Krishna!");
  } else {
    clicked.classList.add("wrong");
    all[item.correct].classList.add("correct");
    showToast("🙏 Not quite — keep learning!");
  }

  $("scoreLabel").textContent = `Score: ${score}`;
  $("nextBtn").disabled = false;
}

$("nextBtn").addEventListener("click", () => {
  if (current < questions.length - 1) {
    current++;
    renderQuestion();
  } else {
    showResult();
  }
});

function showResult() {
  $("quizBox").classList.add("hidden");
  $("resultBox").classList.remove("hidden");

  const percent = Math.round((score / questions.length) * 100);
  let title = "Keep exploring!";
  if (percent === 100) title = "Divine Knowledge! 🦚";
  else if (percent >= 60) title = "Wonderful! ✨";
  else if (percent >= 40) title = "Good start! 🌙";

  $("resultTitle").textContent = title;
  $("resultText").textContent =
    `You scored ${score} out of ${questions.length} (${percent}%). ` +
    (percent >= 60
      ? "May this Janmashtami bring peace, joy and wisdom into your life."
      : "Every question is a chance to learn something beautiful about Krishna.");
}

$("restartBtn").addEventListener("click", () => {
  current = 0;
  score = 0;
  $("resultBox").classList.add("hidden");
  $("quizBox").classList.remove("hidden");
  renderQuestion();
  document.querySelector("#quiz").scrollIntoView({ behavior: "smooth" });
});

renderQuestion();

// Countdown: next Janmashtami date. Update the date here each year if needed.
function getNextJanmashtami() {
  const now = new Date();
  let year = now.getFullYear();
  // Janmashtami 2026 is September 4. For future years, this fallback
  // keeps the experience functional; you can replace with exact yearly dates.
  const dates = {
    2026: "2026-09-04T00:00:00",
    2027: "2027-08-25T00:00:00",
    2028: "2028-08-14T00:00:00",
    2029: "2029-09-03T00:00:00",
    2030: "2030-08-24T00:00:00"
  };
  if (dates[year] && now < new Date(dates[year])) return new Date(dates[year]);
  year++;
  return new Date(dates[year] || `${year}-08-20T00:00:00`);
}

const target = getNextJanmashtami();

function updateCountdown() {
  let diff = target - new Date();
  if (diff < 0) diff = 0;
  const sec = Math.floor(diff / 1000);
  const days = Math.floor(sec / 86400);
  const hours = Math.floor((sec % 86400) / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  $("days").textContent = String(days).padStart(2, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Reveal-on-scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// Cursor glow
document.addEventListener("pointermove", e => {
  document.querySelector(".cursor-glow").style.left = `${e.clientX}px`;
  document.querySelector(".cursor-glow").style.top = `${e.clientY}px`;
});

// Diya interaction
document.querySelectorAll("[data-diya]").forEach(diya => {
  diya.addEventListener("click", () => {
    diya.classList.toggle("off");
    const flame = diya.querySelector("i");
    if (diya.classList.contains("off")) {
      flame.style.opacity = "0";
      showToast("🪔 Light returns whenever you choose it.");
    } else {
      flame.style.opacity = "1";
      showToast("🪔 Let your inner light shine!");
    }
  });
});

// Symbol interaction
document.querySelectorAll(".symbol").forEach(card => {
  card.addEventListener("click", () => {
    const messages = {
      feather: "🦚 Beauty can be graceful and humble.",
      flute: "🪈 A simple flute becomes music in surrendered hands.",
      matki: "🏺 Childhood stories bring joy to devotion.",
      diya: "🪔 Even a small light can defeat darkness."
    };
    showToast(messages[card.dataset.symbol]);
  });
});

// Toast
let toastTimer;
function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Canvas particles
const canvas = $("particles");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
resizeCanvas();
addEventListener("resize", resizeCanvas);

for (let i = 0; i < 110; i++) {
  particles.push({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    r: Math.random() * 1.6 + .2,
    a: Math.random(),
    speed: Math.random() * .18 + .03
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  particles.forEach(p => {
    p.y -= p.speed;
    if (p.y < -5) p.y = innerHeight + 5;
    p.a += (Math.random() - .5) * .03;
    p.a = Math.max(.15, Math.min(1, p.a));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(247,200,115,${p.a})`;
    ctx.fill();
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// Click anywhere in hero for a small burst
$("home").addEventListener("click", e => {
  if (e.target.closest("a,button")) return;
  for (let i = 0; i < 12; i++) {
    particles.push({
      x: e.clientX,
      y: e.clientY,
      r: Math.random() * 2 + .5,
      a: 1,
      speed: -(Math.random() * 1.4 + .3)
    });
  }
  showToast("✨ Radhe Radhe");
});

// Ambient sound button — no external audio file required.
let soundOn = false;
$("soundBtn").addEventListener("click", () => {
  soundOn = !soundOn;
  $("soundBtn").textContent = soundOn ? "🔊" : "🔇";
  showToast(soundOn
    ? "🔊 Sound mode enabled — add your own bhajan in script.js if desired."
    : "🔇 Sound mode disabled.");
});
