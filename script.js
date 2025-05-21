const quotes = [

let startTime, timerInterval, currentQuote = "";  "The automobile revolutionized the way people travel, giving them the freedom to move quickly and independently. Modern cars are equipped with advanced safety features, fuel-efficient engines, and smart infotainment systems.",
  "Electric vehicles are gaining popularity due to their environmental benefits and lower running costs. Companies like Tesla, Nissan, and BMW are leading the way in developing high-performance electric cars.",
  "Car engines convert fuel into motion through a process called internal combustion. This system, although efficient, is being challenged by cleaner and more sustainable alternatives like electric drivetrains and hydrogen fuel cells.",
  "Sports cars are designed for performance, speed, and handling. They often feature aerodynamic bodies, powerful engines, and low-profile tires. Brands like Ferrari, Lamborghini, and Porsche dominate this category.",
  "Autonomous cars use sensors, cameras, and artificial intelligence to navigate roads without human input. While still being tested in many regions, they hold the potential to reduce traffic accidents and improve road safety."
];


const quoteEl = document.getElementById("quote");
const inputEl = document.getElementById("input");
const usernameEl = document.getElementById("username");
const timeEl = document.getElementById("time");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("start-btn");
const leaderboardEl = document.querySelector("#leaderboard tbody");

startBtn.addEventListener("click", () => {
  const name = usernameEl.value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteEl.innerHTML = currentQuote;
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  startTime = new Date();
  timeEl.textContent = "0";
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTime, 1000);
});

inputEl.addEventListener("input", () => {
  highlightText();
});

function updateTime() {
  const now = new Date();
  const seconds = Math.floor((now - startTime) / 1000);
  timeEl.textContent = seconds;

  const typed = inputEl.value;
  const wordsTyped = typed.trim().split(/\s+/).length;
  const minutes = seconds / 60 || 1;
  const wpm = Math.round(wordsTyped / minutes);
  wpmEl.textContent = wpm;

  const correctChars = typed.split('').filter((char, i) => char === currentQuote[i]).length;
  const accuracy = Math.round((correctChars / typed.length) * 100) || 0;
  accuracyEl.textContent = accuracy;

  if (typed.length >= currentQuote.length) {
    clearInterval(timerInterval);
    inputEl.disabled = true;
    saveToLeaderboard(usernameEl.value.trim(), wpm, accuracy);
  }
}

function highlightText() {
  const typed = inputEl.value;
  let result = "";
  for (let i = 0; i < currentQuote.length; i++) {
    if (i < typed.length) {
      if (typed[i] === currentQuote[i]) {
        result += `<span class="correct">${currentQuote[i]}</span>`;
      } else {
        result += `<span class="incorrect">${currentQuote[i]}</span>`;
      }
    } else {
      result += currentQuote[i];
    }
  }
  quoteEl.innerHTML = result;
}

function saveToLeaderboard(name, wpm, accuracy) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};
  if (!leaderboard[name] || leaderboard[name].wpm < wpm) {
    leaderboard[name] = { wpm, accuracy };
  }
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  displayLeaderboard();
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};
  leaderboardEl.innerHTML = "";
  Object.entries(leaderboard)
    .sort((a, b) => b[1].wpm - a[1].wpm)
    .forEach(([name, stats]) => {
      leaderboardEl.innerHTML += `<tr><td>${name}</td><td>${stats.wpm}</td><td>${stats.accuracy}%</td></tr>`;
    });
}

displayLeaderboard();
