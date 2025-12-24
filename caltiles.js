const modal = document.getElementById("modal");
const modalDate = document.getElementById("modal-date");
const modalText = document.getElementById("modal-text");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("closeModal");

const audioWrapper = document.getElementById("modal-audio");
const audio = document.getElementById("voice-audio");
const audioSource = document.getElementById("voice-source");
const playBtn = document.getElementById("play-audio-btn");

const tiles = document.querySelectorAll(".tile");
let notes = {};

const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);
const today = now.getDate();

fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    setupTiles();
  });

function timeRemaining(day) {
  const target = new Date(now);
  target.setDate(day);
  target.setHours(0, 0, 0, 0);

  const diff = target - now;
  const totalMinutes = Math.floor(diff / (1000 * 60));

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

function setupTiles() {
  tiles.forEach(tile => {
    const day = Number(tile.dataset.day);

    tile.classList.add(day <= today ? "unlocked" : "locked");

    tile.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modalDate.textContent = `December ${day}`;

      // 🔄 Reset modal state
      modalText.textContent = "";
      modalImage.style.display = "none";
      audioWrapper.classList.add("hidden");
      audio.pause();
      audio.currentTime = 0;
      playBtn.textContent = "▶ Play voice note";

      if (day <= today) {
        const note = notes[day];

        modalText.textContent = note?.text || "";

        if (note?.image) {
          modalImage.src = note.image;
          modalImage.style.display = "block";
        }

        if (note?.audio) {
          audioWrapper.classList.remove("hidden");
          audioSource.src = note.audio;
          audio.load();
        }
      } else {
        // 🔒 Locked tile message
        modalText.textContent = `This door opens in ${timeRemaining(day)}`;
      }
    });
  });
}

playBtn.onclick = () => {
  if (audio.paused) {
    audio.play();
    playBtn.textContent = "⏸ Pause";
  } else {
    audio.pause();
    playBtn.textContent = "▶ Play voice note";
  }
};

closeModal.onclick = () => {
  modal.classList.add("hidden");
  audio.pause();
  audio.currentTime = 0;
};

modal.onclick = e => {
  if (e.target === modal) closeModal.onclick();
};

// Background music
const music = document.getElementById("bg-music");
const muteBtn = document.getElementById("muteBtn");

muteBtn.onclick = async () => {
  if (music.paused) await music.play();
  music.muted = !music.muted;
  muteBtn.textContent = music.muted ? "🔇" : "🔊";
};
