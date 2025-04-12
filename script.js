document.addEventListener("DOMContentLoaded", function () {
  // Hide loader when page is loaded
  const loader = document.querySelector(".loader");
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => {
      loader.style.display = "none";
    }, 500);
  }, 1500);

  // Lyrics data with timestamps (example format)
  const lyricsData = [
    { text: "Wiesz kto wrócił", time: 0 },
    { text: "wiem, że na to czekałeś", time: 2 },
    { text: "ja chyba też", time: 4 },
    { text: "", time: 6 },
    { text: "Byłem raperem", time: 8 },
    { text: "świadomie nawijam to w czasie przeszłym", time: 10 },
    { text: "bo byłem raperem", time: 14 },
    { text: "lecz postanowiłem że będę kimś lepszym", time: 16 },
    { text: "Scena to festyn, dlatego brocki zrobi z niej brexit", time: 20 },
    { text: "Wyciągnij wnioski kto pisze teksty twoich idoli", time: 24 },
    { text: "Zobacz creditsy czy to nie Jakub Birecki", time: 28 },
    { text: "[Nawet jeśli kiedyś ktoś skreślił cię", time: 32, isChorus: true },
    { text: "Dalej biegnij po swoje", time: 36, isChorus: true },
    { text: "Tyle presji na barkach musiałem nieść", time: 40, isChorus: true },
    { text: "Jeśli będzie trzeba znowu to zrobię]", time: 44, isChorus: true },
    // ... kontynuuj z resztą tekstu
  ];

  // Timeline data
  const timelineData = [
    {
      year: "2005",
      title: "Początki",
      description: "Pierwsze kroki w rapie, lokalne bitwy",
    },
    {
      year: "2010",
      title: "Debiut",
      description: "Wydanie pierwszej płyty 'Gorzka czekolada'",
    },
    {
      year: "2015",
      title: "Przełom",
      description: "Zmiana stylu, eksperymenty muzyczne",
    },
    {
      year: "2020",
      title: "Transformacja",
      description: "Odejście od rapu, nowy kierunek artystyczny",
    },
    {
      year: "2023",
      title: "Sukces",
      description: "Główne stacje radiowe, masowa publiczność",
    },
  ];

  // Initialize elements
  const lyricsElement = document.getElementById("lyrics");
  const timelineElement = document.querySelector(".evolution-timeline");
  const audioElement = document.getElementById("song");
  const playBtn = document.getElementById("play-btn");
  const progressBar = document.getElementById("progress-bar");
  const timeElement = document.querySelector(".time");
  const volumeBtn = document.getElementById("volume-btn");
  const volumeControl = document.getElementById("volume-control");
  const particlesContainer = document.getElementById("particles");
  const navLinks = document.querySelectorAll(".nav-link");
  const cursorFollower = document.querySelector(".cursor-follower");
  const animateOnScrollElements =
    document.querySelectorAll(".animate-on-scroll");

  // Format and display lyrics
  function formatLyrics() {
    let html = "";
    let chorusLines = [];
    let inChorus = false;

    lyricsData.forEach((line) => {
      if (line.text === "") {
        html += `<p class="empty-line"><br></p>`;
      } else if (line.text.startsWith("[") || line.isChorus) {
        if (!inChorus) {
          // Rozpoczęcie refrenu
          inChorus = true;
          chorusLines = [];
        }
        chorusLines.push(line.text.replace("[", "").replace("]", ""));
      } else {
        if (inChorus) {
          // Zakończenie refrenu
          html += `<div class="chorus">${chorusLines.join("<br>")}</div>`;
          inChorus = false;
        }
        html += `<p>${line.text}</p>`;
      }
    });

    // Na wypadek, gdyby refren był na końcu
    if (inChorus) {
      html += `<div class="chorus">${chorusLines.join("<br>")}</div>`;
    }

    lyricsElement.innerHTML = html;
  }

  // Create timeline
  function createTimeline() {
    let html = "";

    timelineData.forEach((item, index) => {
      html += `
                <div class="timeline-item ${
                  index % 2 === 0 ? "left" : "right"
                }">
                    <div class="timeline-year">${item.year}</div>
                    <div class="timeline-content">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                </div>
            `;
    });

    timelineElement.innerHTML = html;
  }

  formatLyrics();
  createTimeline();

  // Audio player functionality
  function togglePlay() {
    if (audioElement.paused) {
      audioElement.play();
      playBtn.textContent = "❚❚";
      document.body.classList.add("music-playing");
    } else {
      audioElement.pause();
      playBtn.textContent = "▶";
      document.body.classList.remove("music-playing");
    }
  }

  function updateProgress() {
    const { duration, currentTime } = audioElement;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Format time
    const durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

    const currentMinutes = Math.floor(currentTime / 60);
    let currentSeconds = Math.floor(currentTime % 60);
    if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;

    if (duration) {
      timeElement.textContent = `${currentMinutes}:${currentSeconds}`;
    }
  }

  function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audioElement.duration;
    audioElement.currentTime = (clickX / width) * duration;
  }

  function toggleMute() {
    if (audioElement.volume === 0) {
      audioElement.volume = volumeControl.value;
      volumeBtn.textContent = "🔊";
    } else {
      audioElement.volume = 0;
      volumeBtn.textContent = "🔇";
    }
  }

  // Highlight current lyric based on audio time
  function highlightLyric() {
    const currentTime = audioElement.currentTime;
    const lyricsP = document.querySelectorAll("#lyrics p");
    const container = document.querySelector(".lyrics-container");

    let activeIndex = -1;

    for (let i = 0; i < lyricsData.length; i++) {
      if (currentTime >= lyricsData[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }

    lyricsP.forEach((p, index) => {
      p.classList.toggle("active", index === activeIndex);

      // Smooth scroll to active lyric
      if (index === activeIndex) {
        const containerHeight = container.clientHeight;
        const lyricPosition = p.offsetTop;
        const scrollTo =
          lyricPosition - containerHeight / 2 + p.clientHeight / 2;

        container.scrollTo({
          top: scrollTo,
          behavior: "smooth",
        });
      }
    });
  }

  // Create particles
  function createParticles(count = 30) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Random position
      const posX = Math.random() * window.innerWidth;
      const posY = Math.random() * window.innerHeight;

      // Random movement
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 200;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      // Random size and color
      const size = 1 + Math.random() * 4;
      const colors = [
        --primary - color,
        --neon - blue,
        --neon - pink,
        --neon - purple,
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      particle.style.left = `${posX}px`;
      particle.style.top = `${posY}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = color;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      particlesContainer.appendChild(particle);

      // Remove particle after animation
      setTimeout(() => {
        particle.remove();
      }, 5000);
    }
  }

  // Animate elements on scroll
  function animateOnScroll() {
    animateOnScrollElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("visible");
      }
    });

    document.querySelectorAll(".timeline-item").forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (itemTop < windowHeight - 100) {
        item.classList.add("visible");
      }
    });

    document.querySelectorAll(".gallery-item").forEach((item) => {
      const itemTop = item.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (itemTop < windowHeight - 100) {
        item.classList.add("visible");
      }
    });
  }

  // Custom cursor
  function moveCursor(e) {
    cursorFollower.style.left = `${e.clientX}px`;
    cursorFollower.style.top = `${e.clientY}px`;
  }

  function activateCursor() {
    cursorFollower.classList.add("active");
  }

  function deactivateCursor() {
    cursorFollower.classList.remove("active");
  }

  // Smooth scrolling for navigation
  function smoothScroll(e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 80,
      behavior: "smooth",
    });
  }

  // Event listeners
  playBtn.addEventListener("click", togglePlay);
  audioElement.addEventListener("timeupdate", updateProgress);
  audioElement.addEventListener("timeupdate", highlightLyric);
  audioElement.addEventListener("ended", () => {
    playBtn.textContent = "▶";
    progressBar.style.width = "0%";
    document.body.classList.remove("music-playing");
  });

  document
    .querySelector(".progress-container")
    .addEventListener("click", setProgress);
  volumeBtn.addEventListener("click", toggleMute);
  volumeControl.addEventListener("input", () => {
    audioElement.volume = volumeControl.value;
    volumeBtn.textContent = audioElement.volume === 0 ? "🔇" : "🔊";
  });

  document.querySelector(".scroll-down").addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", smoothScroll);
  });

  // Initialize animations
  window.addEventListener("scroll", animateOnScroll);
  animateOnScroll(); // Check on load

  // Create initial particles and keep creating them
  createParticles(50);
  setInterval(() => createParticles(20), 3000);

  // Custom cursor events
  document.addEventListener("mousemove", moveCursor);
  document.addEventListener("mouseenter", () => {
    cursorFollower.style.opacity = "1";
  });
  document.addEventListener("mouseleave", () => {
    cursorFollower.style.opacity = "0";
  });

  document
    .querySelectorAll("a, button, .gallery-item, .lyrics-container")
    .forEach((el) => {
      el.addEventListener("mouseenter", activateCursor);
      el.addEventListener("mouseleave", deactivateCursor);
    });

  // GSAP animations
  gsap.from(".header-content", {
    duration: 1.5,
    y: 50,
    opacity: 0,
    ease: "power3.out",
  });

  // Set initial volume
  audioElement.volume = volumeControl.value;
});
