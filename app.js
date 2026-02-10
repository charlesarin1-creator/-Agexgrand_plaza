(() => {
  const cfg = window.AGEX_CONFIG;

  // Bind persistent links
  const applyBtn = document.getElementById("applyBtn");
  applyBtn.href = cfg.applyUrl;

  // Build nodes
  const map = document.querySelector(".map");
  cfg.districts.forEach(d => {
    const node = document.createElement("div");
    node.className = "node";
    node.style.left = d.x;
    node.style.top  = d.y;
    node.setAttribute("data-id", d.id);
    node.innerHTML = `
      <div class="nodeTop">
        <div class="nodeIcon">${d.icon}</div>
        <div class="nodeName">${d.name}</div>
      </div>
      <div class="nodeOne">${d.one}</div>
    `;
    node.addEventListener("click", () => openOverlay(d.id, true));
    node.addEventListener("mouseenter", () => playChime());
    map.appendChild(node);
  });

  // Overlay refs
  const overlay = document.getElementById("overlay");
  const ovClose = document.getElementById("ovClose");
  const ovIcon = document.getElementById("ovIcon");
  const ovTitle = document.getElementById("ovTitle");
  const ovPurpose = document.getElementById("ovPurpose");
  const ovQuote = document.getElementById("ovQuote");
  const ovVisit = document.getElementById("ovVisit");
  const ovCharter = document.getElementById("ovCharter");

  function openOverlay(id, focusCharterBtn){
  const d = cfg.districts.find(x => x.id === id);
  if (!d) return;

  // ✅ If tour is open, close it (tour should never compete with overlay)
  const tour = document.getElementById("tour");
  if (tour && tour.classList.contains("open")) {
    tour.classList.remove("open");
    tour.setAttribute("aria-hidden","true");
    // do NOT mark as seen; user can still see tour next visit if you want
  }

  ovIcon.textContent = d.icon;
  ovTitle.textContent = d.name;
  ovPurpose.textContent = d.one;
  ovQuote.textContent = `“${d.quote}”`;

  ovVisit.href = d.url;
  ovCharter.href = cfg.charterUrl;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden","false");

  if (focusCharterBtn) ovCharter.focus();
}


  function closeOverlay(){
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
  }

  ovClose.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => { if(e.target === overlay) closeOverlay(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeOverlay(); });

  // Tour
  const tour = document.getElementById("tour");
  const tourTitle = document.getElementById("tourTitle");
  const tourBody = document.getElementById("tourBody");
  const tourNext = document.getElementById("tourNext");
  const tourSkip = document.getElementById("tourSkip");

  const TOUR_KEY = "agex_city_tour_v1";
  const steps = [
    {
      title: "Welcome, Steward.",
      body: "This is AGEx—an integrated ecosystem built on the principle of Stewardship. You are not browsing links. You are entering a city."
    },
    {
      title: "Explore the Districts.",
      body: "Each district is a pillar of the build. Tap any district to open its dossier—no page reload, no noise."
    },
    {
      title: "Begin with the Constitution.",
      body: "Your journey begins with understanding. Open the Charter District, then choose “Read The Charter.”"
    },
    {
      title: "The Gate is Always Visible.",
      body: "When you are ready to build with us, apply for stewardship. The gate remains on every screen."
    }
  ];
  let step = 0;

  function openTour(){
    tour.classList.add("open");
    tour.setAttribute("aria-hidden","false");
    renderTour();
  }
  function closeTour(){
    tour.classList.remove("open");
    tour.setAttribute("aria-hidden","true");
    localStorage.setItem(TOUR_KEY, "seen");
  }
  function renderTour(){
    tourTitle.textContent = steps[step].title;
    tourBody.textContent = steps[step].body;

    // Emphasize actions by step
    if (step === 2) {
      // gently nudge charter overlay opening after a short pause
      setTimeout(() => openOverlay("charter", true), 550);
    }
    if (step === 3) {
      applyBtn.classList.add("pulse");
      setTimeout(() => applyBtn.classList.remove("pulse"), 1200);
    }
    tourNext.textContent = (step === steps.length - 1) ? "Finish" : "Next";
  }

  tourNext.addEventListener("click", () => {
    if (step < steps.length - 1) { step++; renderTour(); }
    else closeTour();
  });
  tourSkip.addEventListener("click", closeTour);

  // Auto-run tour once
  if (!localStorage.getItem(TOUR_KEY)) openTour();

  // Sound (optional)
  const chime = document.getElementById("chime");
  const soundBtn = document.getElementById("soundBtn");
  const SOUND_KEY = "agex_sound_v1";
  let soundOn = localStorage.getItem(SOUND_KEY) === "on";

  function syncSoundUI(){
    soundBtn.setAttribute("aria-pressed", String(soundOn));
    soundBtn.textContent = soundOn ? "🔔 Sound: On" : "🔇 Sound: Off";
  }
  function playChime(){
    if (!soundOn) return;
    if (!chime || !chime.src) return;
    chime.currentTime = 0;
    chime.play().catch(()=>{});
  }
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    localStorage.setItem(SOUND_KEY, soundOn ? "on" : "off");
    syncSoundUI();
    if (soundOn) playChime();
  });
  syncSoundUI();

  // Schema JSON-LD
  const schemaEl = document.getElementById("orgSchema");
  const schema = {
    "@context":"https://schema.org",
    "@type":"Organization",
    "name":"AGEx | Arin’s Global Exchange",
    "url": location.origin + location.pathname,
    "description":"The integrated ecosystem for the new steward. Building dwellings against the horns.",
    "department": cfg.districts.map(d => ({
      "@type":"Organization",
      "name": d.name,
      "description": d.one,
      "url": d.url
    }))
  };
  schemaEl.textContent = JSON.stringify(schema);
})();
