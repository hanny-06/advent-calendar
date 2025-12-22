// Force India timezone
if (!localStorage.getItem("timezone")) {
  localStorage.setItem("timezone", "Asia/Kolkata");
}

// Modal elements
const modal = document.getElementById("modal");
const modalDate = document.getElementById("modal-date");
const modalText = document.getElementById("modal-text");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("closeModal");

const tiles = document.querySelectorAll(".tile");
let notes = {};

// Get current India time
const now = new Date(
  new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
);
const today = now.getDate();

// Load notes from JSON
fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data;
    setupTiles();
  })
  .catch(err => {
    console.error("Failed to load notes.json", err);
  });

// Time remaining function
function timeRemaining(day) {
  const target = new Date(now);
  target.setDate(day);
  target.setHours(0, 0, 0, 0);

  const diff = target - now;

  const totalMinutes = Math.floor(diff / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}


// Tile setup
function setupTiles() {
  tiles.forEach(tile => {
    const tileDay = tile.dataset.day;

    if (tileDay <= today) {
      tile.classList.add("unlocked");
    } else {
      tile.classList.add("locked");
    }

    tile.addEventListener("click", () => {
      modal.classList.remove("hidden");
      modalDate.textContent = `December ${tileDay}`;

      if (tileDay <= today) {
        const note = notes[tileDay];

        modalText.textContent = note?.text || "A special December moment ✨";

        if (note?.image) {
          modalImage.src = note.image;
          modalImage.style.display = "block";
        } else {
          modalImage.style.display = "none";
        }
      } else {
        modalText.textContent = `This door opens in ${timeRemaining(tileDay)}`;
        modalImage.style.display = "none";
      }
    });
  });
}

// Close modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const music = document.getElementById("bg-music");
  const muteBtn = document.getElementById("muteBtn");

  // Ensure autoplay works
  music.muted = true;

  muteBtn.addEventListener("click", async () => {
    if (music.paused) {
      await music.play(); // safety for some browsers
    }

    music.muted = !music.muted;
    muteBtn.textContent = music.muted ? "🔇" : "🔊";
  });
});




