const relatives = [
  { name: "Sano Mama/Uncle/Papa", img: "Sanjay.jpg", votes: 0 },
  { name: "Sano maiju/Aunt/Mummy", img: "Seema.jpg", votes: 0 },
  { name: "Maiju/Badi mummy/Mummy", img: "Archana.jpg", votes: 0 },
  { name: "Santosh Mama/Bade papa/Papa", img: "Santosh.jpg", votes: 0 },
  { name: "Mummy/Buwa", img: "Chanda.jpg", votes: 0 },
  { name: "Baba/Fupaji", img: "Bigyan .jpg", votes: 0 },
{name: "Nanaji/Dadaji", img: "Nana.jpg", votes: 0 },
{name: "Nani/Dadi", img: "Nani.jpg", votes: 0 }
];

const arena = document.getElementById('arena');
const winnerDisplay = document.getElementById('winnerDisplay');
const voteDisplay = document.getElementById('voteDisplay');

const storedVotes = JSON.parse(localStorage.getItem('votes')) || {};
const lastReset = localStorage.getItem('lastReset') || Date.now();
const now = Date.now();

if (now - lastReset > 3 * 60 * 60 * 1000) {
  relatives.forEach(r => r.votes = 0);
  localStorage.setItem('lastReset', now);
} else {
  relatives.forEach(r => {
    r.votes = storedVotes[r.name] || 0;
  });
}

function getRandomPair() {
  let idx1 = Math.floor(Math.random() * relatives.length);
  let idx2;
  do {
    idx2 = Math.floor(Math.random() * relatives.length);
  } while (idx1 === idx2);
  return [relatives[idx1], relatives[idx2]];
}

function updateArena() {
  const [p1, p2] = getRandomPair();
  arena.innerHTML = '';

  [p1, p2].forEach(person => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${person.img}" alt="${person.name}">
      <div>${person.name}</div>
    `;
    div.onclick = () => {
      person.votes++;
      saveVotes();
      updateWinner();
      updateArena();
    };
    arena.appendChild(div);
  });
}

function getSortedVoteList() {
  const sorted = relatives.slice().sort((a, b) => b.votes - a.votes);
  let listHTML = `<ul>`;
  sorted.forEach((r, i) => {
    let medalClass = '';
    if (i === 0) medalClass = 'rank-1';
    else if (i === 1) medalClass = 'rank-2';
    else if (i === 2) medalClass = 'rank-3';

    const medalEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '';
    listHTML += `<li class="${medalClass}">${medalEmoji} ${r.name}: ${r.votes} votes</li>`;
  });
  listHTML += `</ul>`;
  return listHTML;
}

function updateWinner() {
  const champ = relatives.reduce((max, r) => r.votes > max.votes ? r : max, relatives[0]);
  winnerDisplay.innerHTML = `
    👑 Current Champ:<br>
    <img src="${champ.img}" alt="${champ.name}">
    <div style="margin-top: 5px;">${champ.name} — ${champ.votes} votes</div>
  `;
  voteDisplay.innerHTML = getSortedVoteList();
}

function saveVotes() {
  const voteData = {};
  relatives.forEach(r => voteData[r.name] = r.votes);
  localStorage.setItem("votes", JSON.stringify(voteData));
}

updateWinner();
updateArena();
