(() => {
  "use strict";
  const engagementDate = new Date(2026, 9, 2, 0, 0, 0); // 2 October 2026 (month is zero-based)
  const audio = document.getElementById("backgroundMusic");
  const musicToggle = document.getElementById("musicToggle");
  const openEnvelope = document.getElementById("openEnvelope");
  const letter = document.getElementById("letter");
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }

  async function toggleMusic() {
    if (!audio.getAttribute("src") || audio.getAttribute("src").endsWith("music.mp3") && audio.readyState === 0) {
      // Try playback anyway: this also lets the browser report a missing audio file.
    }
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.innerHTML = "♫ <span>إيقاف الموسيقى</span>";
        musicToggle.setAttribute("aria-label", "إيقاف الموسيقى");
      } catch (error) {
        showToast("ضيف ملف الأغنية باسم music.mp3 داخل مجلد audio");
      }
    } else {
      audio.pause();
      musicToggle.innerHTML = "♫ <span>تشغيل الموسيقى</span>";
      musicToggle.setAttribute("aria-label", "تشغيل الموسيقى");
    }
  }

  musicToggle.addEventListener("click", toggleMusic);
  openEnvelope.addEventListener("click", async () => {
    openEnvelope.classList.add("opened");
    letter.classList.add("visible");
    letter.scrollIntoView({ behavior: "smooth", block: "start" });
    if (audio.paused) {
      try {
        await audio.play();
        musicToggle.innerHTML = "♫ <span>إيقاف الموسيقى</span>";
        musicToggle.setAttribute("aria-label", "إيقاف الموسيقى");
      } catch (error) {
        showToast("الظرف اتفتح ❤️ اضغط تشغيل الموسيقى بعد إضافة ملف الأغنية");
      }
    }
  });

  function updateTimer() {
    const now = new Date();
    let diff = Math.max(0, now - engagementDate);
    const day = 86400000, hour = 3600000, minute = 60000;
    const days = Math.floor(diff / day); diff %= day;
    const hours = Math.floor(diff / hour); diff %= hour;
    const minutes = Math.floor(diff / minute); diff %= minute;
    const seconds = Math.floor(diff / 1000);
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
  }
  updateTimer();
  setInterval(updateTimer, 1000);

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  const photoCards = [...document.querySelectorAll(".photo-card")];
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  let currentPhoto = 0;
  function showPhoto(index) {
    currentPhoto = (index + photoCards.length) % photoCards.length;
    lightboxImage.src = photoCards[currentPhoto].dataset.photo;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closePhoto() { lightbox.hidden = true; document.body.style.overflow = ""; }
  photoCards.forEach((card, index) => card.addEventListener("click", () => showPhoto(index)));
  document.getElementById("closeLightbox").addEventListener("click", closePhoto);
  document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(currentPhoto - 1));
  document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(currentPhoto + 1));
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closePhoto(); });
  document.addEventListener("keydown", event => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") closePhoto();
    if (event.key === "ArrowLeft") showPhoto(currentPhoto + 1);
    if (event.key === "ArrowRight") showPhoto(currentPhoto - 1);
  });

  // Friendly fallback if an image hasn't been added yet.
  photoCards.forEach((card, index) => {
    const img = card.querySelector("img");
    img.addEventListener("error", () => {
      card.classList.add("missing-photo");
      img.style.display = "none";
      card.style.background = "radial-gradient(circle at 50% 35%, #493526, #211914 70%)";
      let placeholder = card.querySelector(".placeholder-text");
      if (!placeholder) {
        placeholder = document.createElement("div");
        placeholder.className = "placeholder-text";
        placeholder.textContent = `الصورة ${index + 1}`;
        placeholder.style.cssText = "position:absolute;inset:0;display:grid;place-items:center;color:#d6b477;font-family:Cairo,sans-serif;font-size:14px";
        card.appendChild(placeholder);
      }
    });
  });
})();