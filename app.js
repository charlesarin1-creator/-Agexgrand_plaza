/* =========================================================
   AGEx CITY MAP — APP.JS (PHASE 2 FOUNDATION)
   Purpose: Activate the Interactive City Nexus
   ========================================================= */

(() => {
  /* -------------------------------
     CONFIG + ELEMENT REFERENCES
  -------------------------------- */
  const cfg = window.AGEX_CONFIG;
  if (!cfg) {
    console.error("AGEX_CONFIG not found. Check config.js");
    return;
  }

  const map        = document.getElementById("cityMap");
  const applyBtn   = document.getElementById("applyBtn");
  const overlay    = document.getElementById("overlay");
  const ovClose    = document.getElementById("ovClose");
  const ovIcon     = document.getElementById("ovIcon");
  const ovTitle    = document.getElementById("ovTitle");
  const ovPurpose  = document.getElementById("ovPurpose");
  const ovQuote    = document.getElementById("ovQuote");
  const ovVisit    = document.getElementById("ovVisit");
  const ovCharter  = document.getElementById("ovCharter");

  const tour       = document.getElementById("tour");
  const tourTitle  = document.getElementById("tourTitle");
  const tourBody   = document.getElementById("tourBody");
  const tourNext   = document.getElementById("tourNext");
  const tourSkip   = document.getElementById("tourSkip");

  const soundBtn   = document.getElementById("soundBtn");
  const chime      = document.getElementById("chime");

  /* -------------------------------
     CONSTANTS
  -------------------------------- */
  const TOUR_KEY  = "agex_city_tour_seen_v1";
  const SOUND_KEY = "agex_sound_enabled_v1";

  /* -------------------------------
     APPLY GATE (GLOBAL)
  -------------------------------- */
  applyBtn.href = cfg.applyUrl;

  /* -------------------------------
     SOUND SYSTEM (OPTIONAL)
  -------------------------------- */
  let soundEnabled = localStorage.getItem(SOUND_KEY) === "on";

  function syncSoundUI() {
    soundBtn.textContent = soundEnabled ? "🔔 Sound: On" : "🔇 Sound: Off";
    soundBtn.setAttribute("aria-pressed", String(soundEnabled));
  }

  function playChime() {
    if (!soundEnabled || !chime) return;
    try {
      chime.currentTime = 0;
      chime.play();
    } catch (e) {}
  }

  soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem(SOUND_KEY, soundEnabled ? "on" : "off");
    syncSoundUI();
    if (soundEnabled) playChime();
  });

  syncSoundUI();

  /* -------------------------------
     PLAZA BEACON (INJECT ONCE)
  -------------------------------- */
  if (map && !map.querySelector(".plazaBeacon")) {
    const beacon = document.createElement("div");
    beacon.className = "plazaBeacon";
    beacon.setAttribute("aria-hidden", "true");
    map.appendChild(beacon);
  }

  /* -------------------------------
     BUILD DISTRICT NODES
  -------------------------------- */
  cfg.districts.forEach(district => {
    const node = document.createElement("div");
    node.className = "node";
    node.setAttribute("role", "button");
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-label", district.name);

    // Desktop positioning (mobile ignores this)
    if (district.x && district.y) {
      node.style.left = district.x;
      node.style.top  = district.y;
    }

    node.innerHTML = `
      <div class="nodeTop">
        <div class="nodeIcon">${district.icon}</div>
        <div class="nodeName">${district.name}</div>
      </div>
      <div class="nodeOne">${district.one}</div>
    `;

    node.addEventListener("click", () => openOverlay(district));
    node.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") openOverlay(district);
    });
    node.addEventListener("mouseenter", playChime);

    map.appendChild(node);
  });

  /* -------------------------------
     OVERLAY CONTROL
  -------------------------------- */
  function openOverlay(d) {
    // Close tour if active (never compete)
    if (tour && tour.classList.contains("open")) {
      closeTour(false);
    }

    ovIcon.textContent    = d.icon;
    ovTitle.textContent   = d.name;
    ovPurpose.textContent = d.one;
    ovQuote.textContent   = `“${d.quote}”`;

    ovVisit.href   = d.url;
    ovCharter.href = cfg.charterUrl;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    ovCharter.focus();
  }

  function closeOverlay() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  ovClose.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && overlay.classList.contains("open")) {
      closeOverlay();
    }
  });

  /* -------------------------------
     GUIDED WALKTHROUGH (RITUAL)
  -------------------------------- */
  const tourSteps = [
    {
      title: "Welcome, Steward.",
      body: "This is AGEx — an integrated ecosystem built on the principle of Stewardship. You are not browsing links. You are entering a city."
    },
    {
      title: "The Constitution.",
      body: "Every city stands on law. The Charter is our constitution. Understanding comes before access."
    },
    {
      title: "The Gate.",
      body: "When you are ready to build, the gate is always visible. Approach it with intention."
    }
  ];

  let tourIndex = 0;

  function openTour() {
    tour.classList.add("open");
    tour.setAttribute("aria-hidden", "false");
    renderTour();
  }

  function closeTour(markSeen = true) {
    tour.classList.remove("open");
    tour.setAttribute("aria-hidden", "true");
    if (markSeen) localStorage.setItem(TOUR_KEY, "seen");
  }

  function renderTour() {
    const step = tourSteps[tourIndex];
    tourTitle.textContent = step.title;
    tourBody.textContent  = step.body;

    tourNext.textContent =
      tourIndex === tourSteps.length - 1 ? "Enter the City" : "Next";
  }

  tourNext.addEventListener("click", () => {
    if (tourIndex < tourSteps.length - 1) {
      tourIndex++;
      renderTour();
    } else {
      // Final ritual emphasis on the Gate
      applyBtn.classList.add("gatePing");
      setTimeout(() => applyBtn.classList.remove("gatePing"), 950);
      closeTour(true);
    }
  });

  tourSkip.addEventListener("click", () => closeTour(true));

  // Auto-start tour once, after a short pause
  if (!localStorage.getItem(TOUR_KEY)) {
    setTimeout(openTour, 900);
  }

  /* -------------------------------
     SCHEMA.ORG (SEO / SEMANTIC)
  -------------------------------- */
  const schemaEl = document.getElementById("orgSchema");
  if (schemaEl) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AGEx | Arin’s Global Exchange",
      "description": "The integrated ecosystem for the new steward. Building dwellings against the horns.",
      "url": window.location.href,
      "department": cfg.districts.map(d => ({
        "@type": "Organization",
        "name": d.name,
        "description": d.one,
        "url": d.url
      }))
    };
    schemaEl.textContent = JSON.stringify(schema);
  }

})();
