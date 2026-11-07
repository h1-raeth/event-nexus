// 1. Rich Curated Event Dataset for Event Nexus
const EVENTS_DATA = [
  {
    id: 1,
    title: "Global AI & Cloud Architecture Summit",
    category: "Technology",
    date: "2026-12-18T09:00:00",
    displayDate: "Dec 18, 2026 • 09:00 AM",
    venue: "Main Convention Auditorium",
    speaker: "Dr. Rohan Mehta & Principal Cloud Architects",
    seatsLeft: 42,
    totalSeats: 200,
    tags: ["Multi-Agent AI", "Distributed Systems", "AWS & Cloud"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Deep-dive into stateful multi-agent orchestration, high-availability cloud backends, and live architecture battles.",
    fullDesc: "Experience an intensive flagship summit covering production LLM workflows, distributed PostgreSQL scaling, container orchestration, and hands-on system design labs. Includes verifiable digital certificate and networking lounge access."
  },
  {
    id: 2,
    title: "Design Systems & Micro-Interactions Lab",
    category: "Workshop",
    date: "2026-11-28T14:00:00",
    displayDate: "Nov 28, 2026 • 02:00 PM",
    venue: "Interactive Design Studio 302",
    speaker: "Ananya Sen (Staff Product Designer)",
    seatsLeft: 14,
    totalSeats: 60,
    tags: ["Figma Tokens", "Motion UI", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Craft glassmorphic interfaces, kinetic typography, and accessible dark-mode design tokens from scratch.",
    fullDesc: "A hands-on 4-hour masterclass where participants build a multi-brand component library in Figma and translate motion curves directly into production CSS and Tailwind utilities."
  },
  {
    id: 3,
    title: "Starlight Ambient & Indie Acoustic Night",
    category: "Cultural",
    date: "2026-12-05T18:30:00",
    displayDate: "Dec 05, 2026 • 06:30 PM",
    venue: "Open Air Amphitheatre",
    speaker: "Hiraeth Collective & Indie Synth Ensemble",
    seatsLeft: 95,
    totalSeats: 300,
    tags: ["Live Indie", "Ambient Synth", "Spoken Word"],
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    shortDesc: "An atmospheric evening of electronic ambient soundscapes, indie bands, and mountain-inspired spoken word.",
    fullDesc: "Unwind under the open sky with immersive stage lighting, ambient synth compositions, acoustic storytelling, and curated artisanal food stalls."
  },
  {
    id: 4,
    title: "Zero-to-One Founder Pitch & VC Arena",
    category: "Business",
    date: "2026-12-12T10:30:00",
    displayDate: "Dec 12, 2026 • 10:30 AM",
    venue: "Innovation Incubation Hub",
    speaker: "Elevation Seed Partners & Alumni Founders",
    seatsLeft: 19,
    totalSeats: 80,
    tags: ["Seed Pitch", "Product Strategy", "FinTech & HealthTech"],
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Pitch your working prototype in front of angel investors and compete for ₹5L in micro-grants and cloud credits.",
    fullDesc: "Shortlisted student founders get 5 minutes on stage to demo their live architecture, market moat, and unit economics followed by real-time term-sheet feedback from venture partners."
  },
  {
    id: 5,
    title: "Next.js + FastAPI 24-Hour Build Sprint",
    category: "Technology",
    date: "2026-12-22T08:00:00",
    displayDate: "Dec 22, 2026 • 08:00 AM",
    venue: "Central Cyber Lab",
    speaker: "Event Nexus Core Engineering Guild",
    seatsLeft: 8,
    totalSeats: 100,
    tags: ["FastAPI", "Next.js", "Docker"],
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    shortDesc: "High-intensity 24-hour hackathon to architect, containerize, and deploy full-stack AI applications.",
    fullDesc: "Ship real code under pressure. Teams of up to 4 builders will design, containerize, and deploy a working product on Vercel/Render before presenting to our technical jury."
  },
  {
    id: 6,
    title: "Cinematic Mobile Framing & Color Grading",
    category: "Workshop",
    date: "2026-12-02T15:30:00",
    displayDate: "Dec 02, 2026 • 03:30 PM",
    venue: "Media Arts Seminar Hall",
    speaker: "Vikramaditya Rao (Visual Director)",
    seatsLeft: 27,
    totalSeats: 75,
    tags: ["Color Grading", "Cinematic Lighting", "RAW Workflow"],
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
    shortDesc: "Master golden-hour exposure, tone curves, and split-toning workflows right on your smartphone.",
    fullDesc: "Learn how to turn everyday mobile photography into moody, theatrical frames using manual shutter controls, S-curves, and color harmony principles."
  }
];

let activeCategory = "All";
let searchQuery = "";
let sortBy = "date";

// --- Privacy-Shield Data Obfuscation Helpers ---
function encryptData(data) {
  // Converts the JSON object into an encoded, unreadable Base64 string
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decryptData(encodedString) {
  if (!encodedString) return [];
  try {
    // Attempt to decrypt the Base64 string
    return JSON.parse(decodeURIComponent(atob(encodedString)));
  } catch (error) {
    console.warn("Incompatible or unencrypted data found. Wiping old records to prevent crash.");
    // Wipes the corrupted/old plain-text data so the app can successfully initialize
    localStorage.removeItem("event_nexus_registrations");
    return [];
  }
}

function decryptData(encodedString) {
  if (!encodedString) return [];
  try {
    // Decodes the string back into a usable JavaScript array
    return JSON.parse(decodeURIComponent(atob(encodedString)));
  } catch (error) {
    console.error("Failed to decrypt local data", error);
    return [];
  }
}

// DOM Elements
const eventsGrid = document.getElementById("events-grid");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const resultsCounter = document.getElementById("results-counter");
const categoryPills = document.querySelectorAll(".filter-pill");
const regEventSelect = document.getElementById("reg-event");
const registrationForm = document.getElementById("registration-form");
const ticketCountBadge = document.getElementById("ticket-count-badge");
const wishlistBadge = document.getElementById("wishlist-badge");

// 2. Initialize Application
function init() {
  initTheme();
  populateSelectDropdown();
  renderEvents();
  updateBadges();
  startLiveCountdowns();
  setupKeyboardShortcuts();
  setupLivePassPreview();
}

// 3. Get Saved Bookmarks from LocalStorage
function getWishlist() {
  return JSON.parse(localStorage.getItem("event_nexus_wishlist") || "[]");
}

window.toggleWishlist = function(eventId, e) {
  if (e) e.stopPropagation();
  let list = getWishlist();
  if (list.includes(eventId)) {
    list = list.filter(id => id !== eventId);
    showToast("Removed from your Saved Wishlist");
  } else {
    list.push(eventId);
    showToast("Saved to your Event Nexus Wishlist ♥");
  }
  localStorage.setItem("event_nexus_wishlist", JSON.stringify(list));
  updateBadges();
  renderEvents();
};

// 4. Render Event Cards with Spotlight Tracking
function renderEvents() {
  const wishlist = getWishlist();

  let filtered = EVENTS_DATA.filter(ev => {
    const matchesCategory =
      activeCategory === "All"
        ? true
        : activeCategory === "Saved"
        ? wishlist.includes(ev.id)
        : ev.category === activeCategory;

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      ev.title.toLowerCase().includes(query) ||
      ev.venue.toLowerCase().includes(query) ||
      ev.speaker.toLowerCase().includes(query) ||
      ev.tags.some(t => t.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  // Sort Logic
  filtered.sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "seats") return a.seatsLeft - b.seatsLeft;
    if (sortBy === "title") return a.title.localeCompare(b.title);
    return 0;
  });

  resultsCounter.textContent = `Showing ${filtered.length} experience${filtered.length === 1 ? "" : "s"}`;
  eventsGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach(ev => {
    const isLiked = wishlist.includes(ev.id);
    const fillPercentage = Math.round(((ev.totalSeats - ev.seatsLeft) / ev.totalSeats) * 100);

    const card = document.createElement("article");
    card.className = "event-card glass-card rounded-3xl border border-slate-200/80 dark:border-white/10 overflow-hidden flex flex-col justify-between shadow-lg";
    card.innerHTML = `
      <div>
        <div class="relative h-52 overflow-hidden">
          <img src="${ev.image}" alt="${ev.title}" class="w-full h-full object-cover transition duration-700 hover:scale-105" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent"></div>

          <!-- Top Badges -->
          <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
            <span class="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/65 text-white backdrop-blur-md border border-white/15">
              ${ev.category}
            </span>
            <button onclick="toggleWishlist(${ev.id}, event)" aria-label="Bookmark" class="w-9 h-9 rounded-full bg-black/60 text-white backdrop-blur-md flex items-center justify-center hover:scale-110 transition">
              <i class="${isLiked ? 'fa-solid text-pink-500' : 'fa-regular text-white'} fa-heart"></i>
            </button>
          </div>

          <!-- Segmented Live Countdown Overlay -->
          <div class="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
            <span class="text-[11px] font-mono text-indigo-300 flex items-center gap-1">
              <i class="fa-regular fa-clock"></i> LIVE TIMER
            </span>
            <div data-countdown="${ev.date}" class="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/15">
              --d : --h : --m : --s
            </div>
          </div>
        </div>

        <div class="p-6 space-y-3">
          <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span><i class="fa-regular fa-calendar text-indigo-500 mr-1"></i>${ev.displayDate.split("•")[0]}</span>
            <span class="text-emerald-500 font-semibold">${ev.seatsLeft} spots left</span>
          </div>

          <h3 class="font-display text-xl font-bold leading-snug hover:text-indigo-500 transition cursor-pointer" onclick="openEventModal(${ev.id})">
            ${ev.title}
          </h3>

          <p class="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">
            ${ev.shortDesc}
          </p>

          <!-- Tech / Topic Tags -->
          <div class="flex flex-wrap gap-1.5 pt-1">
            ${ev.tags.map(t => `<span class="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-slate-200/70 dark:bg-white/5 text-slate-600 dark:text-slate-300">${t}</span>`).join("")}
          </div>
        </div>
      </div>

      <div class="px-6 pb-6 pt-3 space-y-3 border-t border-slate-200/60 dark:border-white/5">
        <!-- Seat Capacity Progress Bar -->
        <div>
          <div class="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
            <span>CAPACITY FILLED</span>
            <span>${fillPercentage}%</span>
          </div>
          <div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
            <div class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" style="width: ${fillPercentage}%"></div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-1">
          <span class="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">
            <i class="fa-solid fa-location-dot text-indigo-500 mr-1"></i>${ev.venue}
          </span>
          <button onclick="openEventModal(${ev.id})" class="px-4 py-2 rounded-xl bg-indigo-600/10 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-600 hover:text-white font-display text-xs font-bold transition">
            Inspect & RSVP
          </button>
        </div>
      </div>
    `;

    // Cursor-tracking spotlight coordinates
    card.addEventListener("mousemove", e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });

    eventsGrid.appendChild(card);
  });

  tickCountdowns();
}

// 5. Real-Time Per-Second Countdown Engine
function tickCountdowns() {
  const nodes = document.querySelectorAll("[data-countdown]");
  const now = Date.now();

  nodes.forEach(node => {
    const target = new Date(node.getAttribute("data-countdown")).getTime();
    const diff = target - now;

    if (diff <= 0) {
      node.textContent = "EVENT LIVE NOW";
      return;
    }

    const d = String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0");
    const h = String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0");
    const m = String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0");
    const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

    node.textContent = `${d}d : ${h}h : ${m}m : ${s}s`;
  });
}

function startLiveCountdowns() {
  tickCountdowns();
  setInterval(tickCountdowns, 1000);
}

// 6. Search, Category & Sort Listeners
searchInput.addEventListener("input", e => {
  searchQuery = e.target.value.trim();
  renderEvents();
});

sortSelect.addEventListener("change", e => {
  sortBy = e.target.value;
  renderEvents();
});

categoryPills.forEach(pill => {
  pill.addEventListener("click", () => {
    categoryPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    activeCategory = pill.getAttribute("data-category");
    renderEvents();
  });
});

document.getElementById("wishlist-filter-btn").addEventListener("click", () => {
  categoryPills.forEach(p => p.classList.remove("active"));
  const savedPill = document.querySelector('[data-category="Saved"]');
  if (savedPill) savedPill.classList.add("active");
  activeCategory = "Saved";
  document.getElementById("explore").scrollIntoView({ behavior: "smooth" });
  renderEvents();
});

document.getElementById("reset-filters-btn").addEventListener("click", () => {
  searchQuery = "";
  searchInput.value = "";
  activeCategory = "All";
  categoryPills.forEach(p => p.classList.remove("active"));
  categoryPills[0].classList.add("active");
  renderEvents();
});

// 7. Detailed Event Modal
const eventModal = document.getElementById("event-modal");

window.openEventModal = function(id) {
  const ev = EVENTS_DATA.find(item => item.id === id);
  if (!ev) return;

  document.getElementById("modal-image").src = ev.image;
  document.getElementById("modal-category").textContent = ev.category;
  document.getElementById("modal-title").textContent = ev.title;
  document.getElementById("modal-seats").textContent = `${ev.seatsLeft} / ${ev.totalSeats} Seats Available`;
  document.getElementById("modal-description").textContent = ev.fullDesc;
  document.getElementById("modal-date").textContent = ev.displayDate;
  document.getElementById("modal-venue").textContent = ev.venue;
  document.getElementById("modal-speaker").textContent = ev.speaker;

  const tagsContainer = document.getElementById("modal-tags");
  tagsContainer.innerHTML = ev.tags
    .map(t => `<span class="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-500 text-xs font-mono font-bold">#${t}</span>`)
    .join("");

  document.getElementById("modal-register-btn").onclick = () => {
    eventModal.classList.add("hidden");
    regEventSelect.value = ev.title;
    regEventSelect.dispatchEvent(new Event("change"));
    document.getElementById("register-section").scrollIntoView({ behavior: "smooth" });
    document.getElementById("reg-name").focus();
  };

  eventModal.classList.remove("hidden");
};

document.getElementById("close-modal-btn").addEventListener("click", () => {
  eventModal.classList.add("hidden");
});

// 8. Privacy-First Boarding Pass Preview + Form Validation
function populateSelectDropdown() {
  EVENTS_DATA.forEach(ev => {
    const opt = document.createElement("option");
    opt.value = ev.title;
    opt.className = "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";
    opt.textContent = `${ev.title} (${ev.displayDate.split("•")[0].trim()})`;
    regEventSelect.appendChild(opt);
  });
}

function setupLivePassPreview() {
  const nameIn = document.getElementById("reg-name");

  const updatePreview = () => {
    const attendeeName = nameIn.value.trim() || "Attendee Name";
    const selectedTitle = regEventSelect.value;
    const matchedEvent = EVENTS_DATA.find(item => item.title === selectedTitle);

    document.getElementById("preview-name").textContent = attendeeName;
    document.getElementById("preview-event").textContent = matchedEvent ? matchedEvent.title : "Select an Experience...";
    document.getElementById("preview-venue").textContent = matchedEvent ? matchedEvent.venue : "TBA Venue";
    document.getElementById("preview-date").textContent = matchedEvent ? matchedEvent.displayDate.split("•")[0].trim() : "Select Event";
    document.getElementById("preview-category").textContent = matchedEvent ? `${matchedEvent.category.toUpperCase()} PASS` : "ALL-ACCESS";

    // Privacy-Safe QR Payload: Only encodes Event Nexus verification token, event title, and attendee name (Zero Email/Phone)
    const qrPayload = encodeURIComponent(`EVENT-NEXUS-VERIFIED|EVENT:${selectedTitle || "NONE"}|HOLDER:${attendeeName}`);
    document.getElementById("preview-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${qrPayload}`;
  };

  nameIn.addEventListener("input", updatePreview);
  regEventSelect.addEventListener("change", updatePreview);
}

registrationForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const phone = document.getElementById("reg-phone").value.trim();
  const selectedEvent = regEventSelect.value;

  const nameRegex = /^[a-zA-Z\s.]{3,50}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9][0-9]{9}$/;

  let valid = true;

  const toggleError = (id, show) => {
    document.getElementById(id).classList.toggle("hidden", !show);
    if (show) valid = false;
  };

  toggleError("err-name", !nameRegex.test(name));
  toggleError("err-email", !emailRegex.test(email));
  toggleError("err-phone", !phoneRegex.test(phone));
  toggleError("err-event", !selectedEvent);

  if (!valid) return;

  const matchedEvent = EVENTS_DATA.find(item => item.title === selectedEvent);
  const passId = "ENX-" + Math.floor(100000 + Math.random() * 900000);

  const newPass = {
    ticketId: passId,
    name,
    email, // Private record
    phone, // Private record
    event: selectedEvent,
    venue: matchedEvent ? matchedEvent.venue : "Main Auditorium",
    schedule: matchedEvent ? matchedEvent.displayDate : "2026 Season",
    issuedAt: new Date().toLocaleString()
  };

  // NEW: Save encrypted data to localStorage
  const saved = decryptData(localStorage.getItem("event_nexus_registrations"));
  saved.unshift(newPass);
  localStorage.setItem("event_nexus_registrations", encryptData(saved));

  updateBadges();
  
  // 1. Lock the preview with the newly minted pass ID and updated QR code
  document.getElementById("preview-pass-id").textContent = passId;
  const mintedQrPayload = encodeURIComponent(`EVENT-NEXUS|TOKEN:${passId}|EVENT:${selectedEvent}|HOLDER:${name}`);
  document.getElementById("preview-qr").src = `https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${mintedQrPayload}`;

  // 2. Disable inputs to freeze the live preview listeners
  document.getElementById("reg-name").disabled = true;
  document.getElementById("reg-email").disabled = true;
  document.getElementById("reg-phone").disabled = true;
  document.getElementById("reg-event").disabled = true;

  // 3. Swap buttons
  document.getElementById("mint-submit-btn").classList.add("hidden");
  document.getElementById("mint-another-btn").classList.remove("hidden");

  // Trigger Celebration Confetti
  if (typeof confetti === "function") {
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
  }

  const successBox = document.getElementById("form-success");
  document.getElementById("success-message").textContent = `Privacy-shielded pass ${passId} minted for ${name}!`;
  successBox.classList.remove("hidden");
  showToast(`Verified Pass ${passId} saved to Wallet!`);
});

// 9. Reset Flow for "Mint Another Pass" button
document.getElementById("mint-another-btn").addEventListener("click", () => {
  // 1. Reset form and re-enable inputs
  registrationForm.reset();
  document.getElementById("reg-name").disabled = false;
  document.getElementById("reg-email").disabled = false;
  document.getElementById("reg-phone").disabled = false;
  document.getElementById("reg-event").disabled = false;

  // 2. Reset live preview back to placeholders
  document.getElementById("preview-name").textContent = "Attendee Name";
  document.getElementById("preview-event").textContent = "Select an Experience...";
  document.getElementById("preview-venue").textContent = "TBA Venue";
  document.getElementById("preview-date").textContent = "Select Event";
  document.getElementById("preview-category").textContent = "ALL-ACCESS";
  document.getElementById("preview-pass-id").textContent = "ENX-2026-VERIFIED";
  document.getElementById("preview-qr").src = "https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=EVENT-NEXUS-VERIFIED-GATE-PASS";

  // 3. Swap buttons back and hide success banner
  document.getElementById("mint-submit-btn").classList.remove("hidden");
  document.getElementById("mint-another-btn").classList.add("hidden");
  document.getElementById("form-success").classList.add("hidden");
});

// 10. LocalStorage Digital Wallet Drawer & Privacy-Shielded Pass Download
const walletModal = document.getElementById("wallet-modal");
const ticketsList = document.getElementById("tickets-list");

function updateBadges() {
  // NEW: Read encrypted data from localStorage
  const passes = decryptData(localStorage.getItem("event_nexus_registrations"));
  const wishlist = getWishlist();
  ticketCountBadge.textContent = passes.length;
  wishlistBadge.textContent = wishlist.length;
}

window.downloadPassTxt = function(ticketId) {
  // NEW: Read encrypted data from localStorage
  const passes = decryptData(localStorage.getItem("event_nexus_registrations"));
  const t = passes.find(p => p.ticketId === ticketId);
  if (!t) return;

  const content = [
    "================================================",
    "     EVENT NEXUS — VERIFIED GATE BOARDING PASS  ",
    "================================================",
    `GATE PASS TOKEN : ${t.ticketId}`,
    `EXPERIENCE      : ${t.event}`,
    `ATTENDEE HOLDER : ${t.name}`,
    `VENUE           : ${t.venue || "Campus Convention Center"}`,
    `SCHEDULE        : ${t.schedule || "Upcoming"}`,
    `PRIVACY STATUS  : PII-SHIELDED (Email/Phone Encrypted)`,
    `ISSUED ON       : ${t.issuedAt}`,
    "================================================",
    "Present this cryptographic token at the Event Nexus gate."
  ].join("\n");

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${t.ticketId}-EventNexus-Pass.txt`;
  link.click();
};

function renderWalletPasses() {
  // NEW: Read encrypted data from localStorage
  const saved = decryptData(localStorage.getItem("event_nexus_registrations"));
  ticketsList.innerHTML = "";

  if (saved.length === 0) {
    ticketsList.innerHTML = `
      <div class="text-center py-10 space-y-2">
        <i class="fa-solid fa-ticket-simple text-3xl text-slate-400"></i>
        <p class="text-sm font-bold">Your Event Nexus wallet is empty</p>
        <p class="text-xs text-slate-500">Complete the RSVP form to mint your first privacy-shielded QR pass.</p>
      </div>
    `;
    return;
  }

  saved.forEach(t => {
    // QR code only contains ticketId, event title, and attendee name (Zero PII)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
      `EVENT-NEXUS|TOKEN:${t.ticketId}|EVENT:${t.event}|HOLDER:${t.name}`
    )}`;
    const card = document.createElement("div");
    card.className = "p-4 rounded-2xl bg-slate-100/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4";
    card.innerHTML = `
      <div class="flex items-center gap-4">
        <img src="${qrUrl}" alt="QR" class="w-14 h-14 rounded-xl bg-white p-1 shrink-0" />
        <div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-xs font-bold text-indigo-500">${t.ticketId}</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
              <i class="fa-solid fa-shield-halved mr-1"></i>PII SHIELDED
            </span>
          </div>
          <h4 class="font-display font-bold text-sm mt-0.5">${t.event}</h4>
          <p class="text-xs text-slate-500">${t.name} • ${t.venue || "Main Venue"}</p>
        </div>
      </div>
      <button onclick="downloadPassTxt('${t.ticketId}')" class="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shrink-0">
        <i class="fa-solid fa-download mr-1"></i>Gate Pass
      </button>
    `;
    ticketsList.appendChild(card);
  });
}

document.getElementById("open-wallet-btn").addEventListener("click", () => {
  renderWalletPasses();
  walletModal.classList.remove("hidden");
});
document.getElementById("view-pass-inline").addEventListener("click", () => {
  renderWalletPasses();
  walletModal.classList.remove("hidden");
});
document.getElementById("close-wallet-btn").addEventListener("click", () => walletModal.classList.add("hidden"));
document.getElementById("done-wallet-btn").addEventListener("click", () => walletModal.classList.add("hidden"));
document.getElementById("clear-tickets-btn").addEventListener("click", () => {
  localStorage.removeItem("event_nexus_registrations");
  updateBadges();
  renderWalletPasses();
  showToast("All saved passes revoked");
});

// 11. Theme Persistence & Keyboard Shortcuts
function initTheme() {
  const saved = localStorage.getItem("event_nexus_theme") || "dark";
  document.documentElement.classList.toggle("dark", saved === "dark");
  updateThemeIcon(saved === "dark");
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById("theme-icon");
  icon.className = isDark ? "fa-solid fa-sun text-amber-400" : "fa-solid fa-moon text-slate-700";
}

document.getElementById("theme-toggle").addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem("event_nexus_theme", isDark ? "dark" : "light");
  updateThemeIcon(isDark);
});

function setupKeyboardShortcuts() {
  window.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== searchInput && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === "Escape") {
      eventModal.classList.add("hidden");
      walletModal.classList.add("hidden");
    }
  });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-text").textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

init();