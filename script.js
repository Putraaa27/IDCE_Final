document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("introScreen");
  const enterBtn = document.getElementById("enterBtn");
  const introMapBtn = document.getElementById("introMapBtn");
  const navbar = document.getElementById("navbar");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const scrollProgressBar = document.getElementById("scrollProgressBar");
  const toastStack = document.getElementById("toastStack");
  const celebrationLayer = document.getElementById("celebrationLayer");
  const liveClock = document.getElementById("liveClock");

  function showToast(text) {
    if (!toastStack) return;

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = text;
    toastStack.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(16px) scale(.98)";
      setTimeout(() => toast.remove(), 280);
    }, 2400);
  }

  function celebrate(count = 28) {
    if (!celebrationLayer) return;

    const colors = ["#0f67c7", "#2f85e3", "#e53935", "#15a36d", "#ffb020"];

    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 0.25}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      celebrationLayer.appendChild(piece);
      setTimeout(() => piece.remove(), 1500);
    }
  }

  function applyTheme(mode) {
    const selectedTheme = mode === "dark" ? "dark" : "light";

    document.body.setAttribute("data-theme", selectedTheme);
    localStorage.setItem("idceTheme", selectedTheme);

    if (themeIcon) {
      themeIcon.textContent = selectedTheme === "dark" ? "Light" : "Night";
    }
  }

  const savedTheme = localStorage.getItem("idceTheme") || "light";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      showToast(nextTheme === "dark" ? "Night mode aktif. Teks sudah disesuaikan." : "Light mode aktif. Tampilan kembali terang.");
      celebrate(16);
    });
  }

  function updateLiveClock() {
    if (!liveClock) return;
    const now = new Date();
    liveClock.textContent = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }

  updateLiveClock();
  setInterval(updateLiveClock, 30000);

  document.addEventListener("mousemove", (event) => {
    const x = `${(event.clientX / window.innerWidth) * 100}%`;
    const y = `${(event.clientY / window.innerHeight) * 100}%`;
    document.body.style.setProperty("--mouse-x", x);
    document.body.style.setProperty("--mouse-y", y);
  });

  function updateScrollProgress() {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
  }

  updateScrollProgress();
  window.addEventListener("scroll", updateScrollProgress);

  const missionData = [
    { id: "m1", title: "Explore Virtual Campus", desc: "Membuka modul experience utama.", points: 10 },
    { id: "m2", title: "Open Campus Hotspot", desc: "Klik titik penting pada gedung kampus.", points: 10 },
    { id: "m3", title: "Join Classroom Simulation", desc: "Membuka simulasi pembelajaran.", points: 10 },
    { id: "m4", title: "View Student Story", desc: "Melihat cerita kehidupan mahasiswa.", points: 10 },
    { id: "m5", title: "Check Activity Feed", desc: "Membuka feed aktivitas kampus.", points: 10 },
    { id: "m6", title: "Open Data Dashboard", desc: "Melihat dashboard Data Science IDCE.", points: 15 },
    { id: "m7", title: "Ask Gemini ChatBot", desc: "Mengirim pertanyaan ke Gemini Campus Guide.", points: 20 },
    { id: "m8", title: "Open Social Platform", desc: "Membuka Instagram atau YouTube ITSB.", points: 10 },
    { id: "m9", title: "Open Google Maps", desc: "Melihat lokasi kampus ITSB.", points: 10 },
    { id: "m10", title: "Open PMB Portal", desc: "Membuka portal PMB resmi ITSB.", points: 10 },
    { id: "m11", title: "Read Integrated Marketing", desc: "Membaca alur digital marketing IDCE.", points: 10 },
    { id: "m12", title: "Submit Registration Interest", desc: "Mengirim form daftar minat.", points: 20 }
  ];

  const missionList = document.getElementById("missionList");
  const missionBar = document.getElementById("missionBar");
  const missionCounter = document.getElementById("missionCounter");
  const pointTotal = document.getElementById("pointTotal");
  const missionBadge = document.getElementById("missionBadge");
  const missionText = document.getElementById("missionText");

  const missionState = JSON.parse(localStorage.getItem("idceMissionState") || "{}");

  const saveMissionState = () => {
    localStorage.setItem("idceMissionState", JSON.stringify(missionState));
  };

  function updateMissionProgress() {
    const checkboxes = missionData.map((mission) => document.getElementById(mission.id)).filter(Boolean);
    const completed = checkboxes.filter((item) => item.checked).length;
    const total = missionData.length;
    const points = checkboxes.reduce((sum, item) => item.checked ? sum + Number(item.dataset.points || 0) : sum, 0);
    const percent = total ? (completed / total) * 100 : 0;

    if (missionBar) missionBar.style.width = `${percent}%`;
    if (missionCounter) missionCounter.textContent = `${completed}/${total} misi selesai`;
    if (pointTotal) pointTotal.textContent = points;

    if (missionBadge && missionText) {
      if (completed === total) {
        missionBadge.textContent = "Campus Explorer Completed";
        missionText.textContent = "Semua fitur utama sudah dijelajahi. Pengunjung sudah siap diarahkan ke pendaftaran resmi.";
      } else if (points >= 100) {
        missionBadge.textContent = "Ready to Register";
        missionText.textContent = "Pengunjung sudah memahami mayoritas fitur, data, dan alur PMB.";
      } else if (points >= 50) {
        missionBadge.textContent = "Active Explorer";
        missionText.textContent = "Pengunjung aktif membuka fitur dan mulai memahami pengalaman kampus digital.";
      } else {
        missionBadge.textContent = "New Visitor";
        missionText.textContent = "Mulai eksplorasi dengan membuka fitur pertama.";
      }
    }
  }

  const renderMissions = () => {
    if (!missionList) return;

    missionList.innerHTML = missionData.map((mission) => `
      <label class="mission-item" for="${mission.id}">
        <input type="checkbox" id="${mission.id}" data-points="${mission.points}" ${missionState[mission.id] ? "checked" : ""} />
        <span><strong>${mission.title}</strong><p>${mission.desc} +${mission.points} poin</p></span>
      </label>
    `).join("");

    missionData.forEach((mission) => {
      const checkbox = document.getElementById(mission.id);
      if (checkbox) {
        checkbox.addEventListener("change", () => {
          missionState[mission.id] = checkbox.checked;
          saveMissionState();
          updateMissionProgress();
          if (checkbox.checked) showToast(`${mission.title} selesai. +${mission.points} poin`);
        });
      }
    });

    updateMissionProgress();
  };

  window.markMission = (id) => {
    const checkbox = document.getElementById(id);
    if (!checkbox) return;

    const wasChecked = checkbox.checked;
    checkbox.checked = true;
    missionState[id] = true;
    saveMissionState();
    updateMissionProgress();

    if (!wasChecked) {
      const mission = missionData.find((item) => item.id === id);
      if (mission) showToast(`${mission.title} selesai. +${mission.points} poin`);

      const completed = missionData.filter((item) => missionState[item.id]).length;
      if (completed === missionData.length || completed === 4 || completed === 8) {
        celebrate(completed === missionData.length ? 44 : 24);
      }
    }
  };

  renderMissions();

  setTimeout(() => introScreen && introScreen.classList.add("ready"), 3600);

  if (enterBtn && introScreen) {
    enterBtn.addEventListener("click", () => {
      introScreen.classList.add("hide");
      showToast("Selamat datang di IDCE. Mulai eksplorasi kampus digital.");
      setTimeout(() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }), 320);
    });
  }

  if (introMapBtn && introScreen) {
    introMapBtn.addEventListener("click", () => {
      introScreen.classList.add("hide");
      window.markMission("m9");
    });
  }

  window.addEventListener("scroll", () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  menuToggle?.addEventListener("click", () => navMenu?.classList.toggle("active"));
  document.querySelectorAll(".nav-menu a").forEach((link) => link.addEventListener("click", () => navMenu?.classList.remove("active")));
  document.querySelectorAll("[data-mission-trigger]").forEach((item) => item.addEventListener("click", () => window.markMission(item.dataset.missionTrigger)));

  document.querySelectorAll("[data-console-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.consoleTarget);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("show"));
  }, { threshold: 0.15 });
  revealItems.forEach((item) => revealObserver.observe(item));

  document.querySelectorAll(".data-card, .feature-preview, .chatbot-card, .chatbot-info, .mission-panel, .chart-card, .video-card, .location-card, .register-form, .hotspot-map, .hotspot-info, .simulation-card, .story-card, .activity-card, .hero-image-card, .system-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = `${((event.clientX - rect.left) / rect.width) * 100}%`;
      const y = `${((event.clientY - rect.top) / rect.height) * 100}%`;
      card.style.setProperty("--card-x", x);
      card.style.setProperty("--card-y", y);
    });
  });

  const modal = document.getElementById("infoModal");
  const modalLabel = document.getElementById("modalLabel");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  document.getElementById("modalClose")?.addEventListener("click", () => modal?.close());

  const openModal = (label, title, text) => {
    if (!modal || !modalLabel || !modalTitle || !modalText) return;
    modalLabel.textContent = label;
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.showModal();
  };

  const featureData = {
    virtual: {
      title: "Virtual Campus",
      status: "Campus Mapping Active",
      text: "Pengunjung dapat melihat suasana kampus ITSB melalui visual gedung, alur eksplorasi, dan tombol interaktif yang mengarah ke bagian penting.",
      actions: [{ label: "Buka Hotspot", href: "#hotspot", mission: "m2" }, { label: "Lihat Video", href: "#video", mission: "m3" }]
    },
    guide: {
      title: "Gemini Campus Guide",
      status: "AI Endpoint Integrated",
      text: "ChatBot memakai API Gemini melalui endpoint server sehingga pengunjung dapat bertanya tentang kampus, lokasi, PMB, dan fitur IDCE.",
      actions: [{ label: "Tanya ChatBot", href: "#chatbot", mission: "m7" }]
    },
    student: {
      title: "Student Life Preview",
      status: "Student Journey Active",
      text: "Bagian story dan activity feed membantu calon mahasiswa membayangkan kehidupan akademik, kolaborasi proyek, dan kegiatan kampus.",
      actions: [{ label: "Buka Story", href: "#stories", mission: "m4" }]
    },
    gamification: {
      title: "Gamification Mission",
      status: "Mission Tracker Active",
      text: "Sistem misi memberi poin dan badge ketika pengunjung membuka fitur. Ini membuat eksplorasi terasa lebih nyata dan menarik.",
      actions: [{ label: "Lihat Mission", href: "#mission", mission: "m1" }]
    }
  };

  const featureTitle = document.getElementById("featureTitle");
  const featureText = document.getElementById("featureText");
  const featureStatus = document.getElementById("featureStatus");
  const featureActions = document.getElementById("featureActions");

  function setFeature(key) {
    const data = featureData[key];
    if (!data) return;
    featureTitle.textContent = data.title;
    featureText.textContent = data.text;
    featureStatus.textContent = data.status;
    featureActions.innerHTML = data.actions.map((action) => `<a class="btn soft" href="${action.href}" data-mission-trigger="${action.mission}">${action.label}</a>`).join("");
    featureActions.querySelectorAll("[data-mission-trigger]").forEach((item) => item.addEventListener("click", () => window.markMission(item.dataset.missionTrigger)));
  }

  document.querySelectorAll(".feature-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".feature-tab").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      setFeature(button.dataset.feature);
      window.markMission("m1");
    });
  });

  setFeature("virtual");

  const hotspotData = {
    main: { label: "Hotspot Active", title: "Gedung Utama ITSB", text: "Pusat identitas kampus yang menjadi titik awal pengenalan lingkungan akademik, layanan informasi, dan arah eksplorasi digital ITSB.", list: ["Visual landmark kampus", "Area pengenalan utama", "Gerbang menuju informasi PMB"] },
    classroom: { label: "Classroom Preview", title: "Area Akademik dan Kelas", text: "Area yang menggambarkan suasana pembelajaran, diskusi, dan kegiatan akademik yang relevan untuk calon mahasiswa.", list: ["Simulasi kelas", "Diskusi akademik", "Ruang belajar terarah"] },
    lab: { label: "Facility Preview", title: "Lab dan Area Praktik", text: "Representasi pembelajaran berbasis praktik, project, data, teknologi, dan pengembangan skill mahasiswa.", list: ["Project-based learning", "Eksplorasi teknologi", "Praktik dan riset mahasiswa"] },
    student: { label: "Student Life Area", title: "Area Mahasiswa", text: "Menggambarkan kegiatan mahasiswa, komunitas, organisasi, dan interaksi sosial dalam lingkungan kampus.", list: ["Komunitas mahasiswa", "Kegiatan organisasi", "Kolaborasi lintas prodi"] },
    admission: { label: "Registration Point", title: "Admisi dan PMB", text: "Titik akhir funnel yang menghubungkan calon mahasiswa ke informasi pendaftaran dan portal PMB resmi.", list: ["Informasi PMB", "Form daftar minat", "Portal pendaftaran resmi"] }
  };

  const hotspotLabel = document.getElementById("hotspotLabel");
  const hotspotTitle = document.getElementById("hotspotTitle");
  const hotspotText = document.getElementById("hotspotText");
  const hotspotList = document.getElementById("hotspotList");

  document.querySelectorAll(".hotspot-point").forEach((point) => {
    point.addEventListener("click", () => {
      const data = hotspotData[point.dataset.hotspot];
      document.querySelectorAll(".hotspot-point").forEach((item) => item.classList.remove("active"));
      point.classList.add("active");
      hotspotLabel.textContent = data.label;
      hotspotTitle.textContent = data.title;
      hotspotText.textContent = data.text;
      hotspotList.innerHTML = data.list.map((item) => `<li>${item}</li>`).join("");
      window.markMission("m2");
    });
  });

  const simulationText = {
    lecturer: ["Simulation", "Dosen Menjelaskan Materi", "Bagian ini memberi gambaran penyampaian materi dalam kelas, mulai dari konsep, diskusi, sampai studi kasus."],
    discussion: ["Simulation", "Mahasiswa Diskusi", "Calon mahasiswa melihat contoh budaya kolaborasi, presentasi, dan diskusi kelompok dalam aktivitas kampus."],
    project: ["Simulation", "Project-Based Learning", "Pembelajaran dirancang dekat dengan praktik, data, dan problem solving agar mahasiswa memahami konteks industri."],
    class: ["Simulation", "Live Classroom", "Simulasi kelas membantu pengunjung membayangkan aktivitas akademik sebelum datang langsung ke kampus."]
  };

  document.querySelectorAll("[data-simulation]").forEach((item) => item.addEventListener("click", () => {
    const data = simulationText[item.dataset.simulation];
    openModal(data[0], data[1], data[2]);
    window.markMission("m3");
  }));

  const storyText = {
    day: ["Student Story", "Day in Campus", "Story ini menggambarkan alur harian mahasiswa dari datang ke kampus, mengikuti kelas, diskusi, hingga kegiatan sore."],
    project: ["Student Story", "Project & Collaboration", "Mahasiswa belajar menyelesaikan masalah melalui project, data, riset, presentasi, dan kerja tim."],
    community: ["Student Story", "Community & Organization", "Kehidupan kampus mencakup komunitas, organisasi, seminar, dan kegiatan yang membentuk soft skill mahasiswa."]
  };

  document.querySelectorAll("[data-story]").forEach((item) => item.addEventListener("click", () => {
    const data = storyText[item.dataset.story];
    openModal(data[0], data[1], data[2]);
    window.markMission("m4");
  }));

  document.querySelectorAll("[data-activity]").forEach((item) => item.addEventListener("click", () => {
    openModal("Activity Feed", item.querySelector("h3").textContent, item.querySelector("p").textContent);
    window.markMission("m5");
  }));

  ["igItsbBtn", "igPmbBtn", "youtubeItsbBtn"].forEach((id) => document.getElementById(id)?.addEventListener("click", () => window.markMission("m8")));
  document.querySelectorAll(".platform-table a").forEach((item) => item.addEventListener("click", () => window.markMission("m6")));
  document.getElementById("mapsBtn")?.addEventListener("click", () => window.markMission("m9"));
  document.getElementById("pmbNavBtn")?.addEventListener("click", () => window.markMission("m10"));
  document.getElementById("pmbLocationBtn")?.addEventListener("click", () => window.markMission("m10"));
  document.getElementById("registerForm")?.addEventListener("submit", () => window.markMission("m12"));

  const sectionMissions = [
    ["experience", "m1"], ["simulation", "m3"], ["stories", "m4"], ["activity", "m5"], ["dashboard", "m6"], ["innovation", "m11"], ["location", "m9"]
  ];

  const missionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const pair = sectionMissions.find(([id]) => document.getElementById(id) === entry.target);
      if (pair) window.markMission(pair[1]);
    });
  }, { threshold: 0.35 });

  sectionMissions.forEach(([id]) => {
    const section = document.getElementById(id);
    if (section) missionObserver.observe(section);
  });

  function cleanChatText(text) {
    return String(text || "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/`/g, "")
      .replace(/\$/g, "")
      .replace(/^\s*[-•]\s+/gm, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const chatWindow = document.getElementById("chatWindow");
  const chatStatus = document.getElementById("chatStatus");
  const chatHistory = [];

  const appendMessage = (text, type = "bot") => {
    const message = document.createElement("div");
    message.className = `message ${type === "user" ? "user-message" : type === "error" ? "error-message" : "bot-message"}`;
    message.textContent = cleanChatText(text);
    chatWindow.appendChild(message);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  async function sendToGemini(question) {
    appendMessage(question, "user");
    chatStatus.textContent = "Gemini sedang menjawab...";

    const typing = document.createElement("div");
    typing.className = "message bot-message";
    typing.innerHTML = '<span class="typing-dots"><span></span><span></span><span></span></span>';
    chatWindow.appendChild(typing);
    chatWindow.scrollTop = chatWindow.scrollHeight;

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history: chatHistory.slice(-6) })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gemini API belum dapat merespons.");
      }

      typing.remove();
      appendMessage(data.reply || "Maaf, jawaban kosong dari Gemini.", "bot");
      chatHistory.push({ role: "user", text: question }, { role: "model", text: data.reply || "" });
      chatStatus.textContent = "Gemini aktif";
      window.markMission("m7");
    } catch (err) {
      typing.remove();
      appendMessage(`Gemini belum dapat dijalankan: ${err.message}.`, "error");
      chatStatus.textContent = "Gemini butuh koneksi atau model sedang penuh";
    }
  }

  chatForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = "";
    sendToGemini(question);
  });

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => sendToGemini(button.dataset.prompt));
  });
});
