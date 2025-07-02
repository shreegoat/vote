const relatives = [
  { name: "Uncle Raj", img: "raj.jpg", votes: 0 },
  { name: "Auntie Sita", img: "sita.jpg", votes: 0 },
  { name: "Cousin Lila", img: "lila.jpg", votes: 0 },
  { name: "Dai Babu", img: "dai.jpg", votes: 0 },
  { name: "Maiju", img: "maiju.jpg", votes: 0 }
];

const arena = document.getElementById("arena");
const winnerDisplay = document.getElementById("winnerDisplay");

let currentPair = [];

const savedVotes = JSON.parse(localStorage.getItem("votes")) || {};
const lastReset = localStorage.getItem("lastReset") || Date.now();
const now = Date.now();

if (now - lastReset > 3 * 60 * 60 * 1000) {
  relatives.forEach(r => (r.votes = 0));
  localStorage.setItem("lastReset", now);
} else {
  relatives.forEach(r => (r.votes = savedVotes[r.name] || 0));
}

function getRandomExcluding(excludeName) {
  let filtered = relatives.filter(r => r.name !== excludeName);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function renderPair(p1, p2) {
  arena.innerHTML = "";

  [p1, p2].forEach(person => {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <img src="${person.img}" alt="${person.name}">
      <div>${person.name}</div>
    `;
    div.onclick = () => {
      person.votes++;
      saveVotes();
      updateWinner();

      if (person === p1) {
        p2 = getRandomExcluding(p1.name);
      } else {
        p1 = getRandomExcluding(p2.name);
      }
      renderPair(p1, p2);
    };
    arena.appendChild(div);
  });
}

function updateWinner() {
  const champ = relatives.reduce((max, r) => r.votes > max.votes ? r : max, relatives[0]);
  winnerDisplay.textContent = `👑 Winner of the day: ${champ.name}`;
}

function saveVotes() {
  const voteData = {};
  relatives.forEach(r => voteData[r.name] = r.votes);
  localStorage.setItem("votes", JSON.stringify(voteData));
}

const first = relatives[Math.floor(Math.random() * relatives.length)];
const second = getRandomExcluding(first.name);
renderPair(first, second);
updateWinner();
