const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");
const startOverlay = document.getElementById("start-overlay");
const startBtn = document.getElementById("start-btn");

// Activar música y hero
startBtn.addEventListener("click", () => {
  music.play();
  startOverlay.classList.add("fade-out");
  toggleBtn.innerHTML = `<i class="bi bi-pause-fill"></i>`;
  setTimeout(() => { document.getElementById("hero").classList.add("active-hero"); }, 400);
});

// Botón música manual
toggleBtn.onclick = () => {
  if (music.paused) { music.play(); toggleBtn.innerHTML = `<i class="bi bi-pause-fill"></i>`; }
  else { music.pause(); toggleBtn.innerHTML = `<i class="bi bi-play-fill"></i>`; }
};

// Scroll reveal
const reveals = document.querySelectorAll(".reveal");
function revealOnScroll() {
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight - 80) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Parallax hero
window.addEventListener("scroll", () => {
  const hero = document.getElementById("hero");
  hero.style.backgroundPositionY = `-${window.pageYOffset * 0.25}px`;
});

// WhatsApp confirmación
document.getElementById("whatsapp-send").href =
"https://wa.me/5210000000000?text=Hola,%20confirmo%20mi%20asistencia%20a%20la%20boda%20de%20Diego%20y%20Lourdes.%20💙";
