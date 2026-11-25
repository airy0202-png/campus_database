(() => {
  "use strict";

  const PAGE_SIZE = 50;
  const STORAGE_KEY = "campusconnect.userId";
  const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const palette = ["blue", "green", "gold", "purple", "rose", "teal"];
  const glyphs = ["✳", "◈", "↗", "✧", "◎", "⌘"];
  const state = { events: [], registrations: [], page: 1, hasMore: false, query: "", filter: "all", userId: localStorage.getItem(STORAGE_KEY) || "", selectedEvent: null, loadingEvents: false, pendingEventId: null };
  const $ = (selector) => document.querySelector(selector);
  const ui = { grid: $("#event-grid"), summary: $("#result-summary"), empty: $("#empty-state"), emptyTitle: $("#empty-title"), emptyCopy: $("#empty-copy"), notice: $("#notice"), pagination: $("#pagination-row"), pageCaption: $("#page-caption"), loadMore: $("#load-more"), registrationList: $("#registration-list"), identityDialog: $("#identity-dialog"), eventDialog: $("#event-dialog"), identityInput: $("#user-id-input"), identityError: $("#identity-error"), forgetId: $("#forget-id") };

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function prettyStatus(status) {
    return String(status || "Status unavailable").trim().replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  function isClosed(status) {
    return /^(closed|cancelled|canceled|inactive|archived|ended)$/i.test(String(status || "").trim());
  }
  function capacityText(capacity) {
    if (capacity === null || capacity === undefined || capacity === "") return "No limit set";
    const number = Number(capacity);
    return Number.isFinite(number) ? `${number.toLocaleString()} ${number === 1 ? "seat" : "seats"}` : String(capacity);
  }
  function shortId(value) {
    const id = String(value || "");
    return id.length > 12 ? `${id.slice(0, 8)}…` : id || "Not listed";
  }

  async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (state.userId) headers.set("X-User-Id", state.userId);
    if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
    let response;
    try { response = await fetch(path, { ...options, headers }); }
    catch { throw new Error("Could not reach the campus API. Start the Flask server and reload this page."); }
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload?.error?.message || `The request failed (${response.status}).`);
    return payload;
  }
  function showNotice(message, kind = "info") {
    ui.notice.textContent = message;
    ui.notice.classList.toggle("error", kind === "error");
    ui.notice.hidden = false;
  }
  function hideNotice() { ui.notice.hidden = true; ui.notice.textContent = ""; }
  function toast(message) {
    $("#toast-message").textContent = message;
    $("#toast").classList.add("visible");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(() => $("#toast").classList.remove("visible"), 3300);
  }
  function updateIdentityLabel() {
    $("#identity-label").textContent = state.userId ? `${state.userId.slice(0, 8)}…` : "Add your campus ID";
    $(".avatar").textContent = state.userId ? "✓" : "U";
  }
  function setLoading(value) {
    state.loadingEvents = value;
    ui.grid.setAttribute("aria-busy", String(value));
    ui.loadMore.disabled = value;
    if (value && !state.events.length) {
      ui.grid.innerHTML = Array.from({ length: 3 }, () => '<div class="event-card skeleton-card" aria-hidden="true"><div class="event-visual"></div><div class="event-body"><div class="skeleton-line short"></div><div class="skeleton-line"></div><div class="skeleton-line medium"></div></div></div>').join("");
      ui.empty.hidden = true;
    }
  }

  async function loadEvents(reset = true) {
    if (state.loadingEvents) return;
    if (reset) { state.page = 1; state.events = []; }
    setLoading(true);
    hideNotice();
    try {
      const payload = await api(`/api/events?page=${state.page}&per_page=${PAGE_SIZE}`);
      const batch = Array.isArray(payload.data) ? payload.data : [];
      state.events = reset ? batch : [...state.events, ...batch];
      state.hasMore = batch.length === PAGE_SIZE;
      drawEvents();
      ui.summary.textContent = `${state.events.length} ${state.events.length === 1 ? "event" : "events"} loaded from your campus`;
      ui.pageCaption.textContent = `Page ${state.page}`;
    } catch (error) {
      if (!state.events.length) {
        ui.grid.innerHTML = "";
        ui.empty.hidden = false;
        ui.emptyTitle.textContent = "Campus events aren’t available yet";
        ui.emptyCopy.textContent = error.message;
      } else showNotice(error.message, "error");
      ui.summary.textContent = "Unable to load campus events";
      ui.pagination.hidden = true;
    } finally { setLoading(false); }
  }
  function filteredEvents() {
    const needle = state.query.trim().toLocaleLowerCase();
    return state.events.filter((event) => {
      const closed = isClosed(event.status);
      if (state.filter === "open" && closed) return false;
      if (state.filter === "closed" && !closed) return false;
      return !needle || [event.title, event.organizer_id, event.status, event.id].some((part) => String(part ?? "").toLocaleLowerCase().includes(needle));
    });
  }
  function drawEvents() {
    const events = filteredEvents();
    const registeredIds = new Set(state.registrations.map((row) => row.event_id));
    ui.grid.innerHTML = events.map((event) => {
      const index = state.events.indexOf(event);
      const registered = registeredIds.has(event.id);
      const closed = isClosed(event.status);
      return `<article class="event-card">
        <div class="event-visual ${palette[index % palette.length]}"><span class="event-mark" aria-hidden="true">${glyphs[index % glyphs.length]}</span><span class="event-visual-label">CAMPUS EVENT</span></div>
        <div class="event-body"><div class="event-topline"><span class="status-badge ${closed ? "closed" : ""}">${escapeHtml(prettyStatus(event.status))}</span><span class="capacity-label"><strong>Capacity · ${escapeHtml(capacityText(event.capacity))}</strong></span></div>
          <h3>${escapeHtml(event.title || "Untitled campus event")}</h3>
          <div class="event-meta"><div class="meta-row"><span class="meta-icon" aria-hidden="true">◎</span><span class="meta-value">Organizer <span class="organizer-value" title="${escapeHtml(event.organizer_id || "Not listed")}">${escapeHtml(shortId(event.organizer_id))}</span></span></div><div class="meta-row"><span class="meta-icon" aria-hidden="true">⌁</span><span class="meta-value">Event ID <span class="event-id-value" title="${escapeHtml(event.id)}">${escapeHtml(shortId(event.id))}</span></span></div></div>
          <div class="event-actions"><button class="event-details" type="button" data-details="${escapeHtml(event.id)}">View details <span aria-hidden="true">↗</span></button>${registered ? '<span class="registered-label">✓ Registered</span>' : `<button class="button button-primary register-button" type="button" data-register="${escapeHtml(event.id)}">Register <span aria-hidden="true">→</span></button>`}</div>
        </div></article>`;
    }).join("");
    const noEvents = events.length === 0;
    ui.empty.hidden = !noEvents;
    ui.grid.hidden = noEvents;
    if (noEvents) {
      ui.emptyTitle.textContent = state.events.length ? "No matching events" : "No events to show";
      ui.emptyCopy.textContent = state.events.length ? "Try a different search or event status filter." : "Your campus hasn’t published any events yet.";
    }
    ui.pagination.hidden = !state.hasMore || Boolean(state.query) || state.filter !== "all";
  }

  function drawRegistrations() {
    if (!state.userId) {
      ui.registrationList.innerHTML = '<div class="registration-placeholder"><span class="placeholder-icon" aria-hidden="true">♧</span><div><strong>Keep your plans in one place</strong><p>Add your campus ID to see your registrations here.</p></div><button class="text-button" id="registration-identity" type="button">Add campus ID →</button></div>';
      $("#registration-identity").addEventListener("click", openIdentity);
      return;
    }
    if (!state.registrations.length) {
      ui.registrationList.innerHTML = '<div class="registration-empty">No registrations yet. Explore the events above to find one for you.</div>';
      return;
    }
    ui.registrationList.innerHTML = state.registrations.map((registration, index) => {
      const event = registration.event || state.events.find((item) => item.id === registration.event_id);
      const title = event?.title || "Campus event";
      const eventId = registration.event_id || event?.id || "—";
      return `<article class="registration-row"><span class="event-mark ${palette[index % palette.length]}" aria-hidden="true">${glyphs[index % glyphs.length]}</span><div class="registration-row-main"><strong>${escapeHtml(title)}</strong><span>Event ID · ${escapeHtml(eventId)}</span></div><span class="registration-date">Registered</span></article>`;
    }).join("");
  }
  async function loadRegistrations() {
    if (!state.userId) { state.registrations = []; drawRegistrations(); return; }
    $("#refresh-registrations").disabled = true;
    try {
      const payload = await api("/api/me/registrations");
      state.registrations = Array.isArray(payload.data) ? payload.data : [];
      drawRegistrations();
      if (!state.loadingEvents) drawEvents();
      hideNotice();
    } catch (error) {
      state.registrations = []; drawRegistrations();
      if (!state.loadingEvents) drawEvents();
      showNotice(`Your campus ID could not load registrations: ${error.message}`, "error");
    } finally { $("#refresh-registrations").disabled = false; }
  }
  function openIdentity() {
    ui.identityInput.value = state.userId;
    ui.identityError.textContent = "";
    ui.forgetId.hidden = !state.userId;
    ui.identityDialog.showModal();
    window.setTimeout(() => ui.identityInput.focus(), 20);
  }
  function openDetails(eventId) {
    const event = state.events.find((item) => item.id === eventId);
    if (!event) return;
    state.selectedEvent = event;
    $("#detail-title").textContent = event.title || "Untitled campus event";
    const status = $("#detail-status");
    status.textContent = prettyStatus(event.status);
    status.classList.toggle("closed", isClosed(event.status));
    const facts = [["Status", prettyStatus(event.status)], ["Capacity", capacityText(event.capacity)], ["Organizer ID", event.organizer_id || "Not listed"], ["Event ID", event.id]];
    $("#detail-facts").innerHTML = facts.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
    const alreadyRegistered = state.registrations.some((row) => row.event_id === event.id);
    const button = $("#detail-register");
    button.disabled = alreadyRegistered;
    button.innerHTML = alreadyRegistered ? 'You’re registered <span aria-hidden="true">✓</span>' : 'Register for this event <span aria-hidden="true">→</span>';
    ui.eventDialog.showModal();
  }
  async function registerForEvent(eventId, button) {
    const event = state.events.find((item) => item.id === eventId);
    if (!event) return;
    if (!state.userId) { state.pendingEventId = eventId; openIdentity(); return; }
    if (button) { button.disabled = true; button.textContent = "Registering…"; }
    try {
      await api("/api/registrations", { method: "POST", body: JSON.stringify({ user_id: state.userId, event_id: eventId }) });
      toast(`You’re registered for ${event.title || "this event"}.`);
      hideNotice();
      await Promise.all([loadEvents(), loadRegistrations()]);
      if (ui.eventDialog.open) ui.eventDialog.close();
    } catch (error) {
      showNotice(error.message, "error");
      if (button) { button.disabled = false; button.innerHTML = 'Register <span aria-hidden="true">→</span>'; }
    }
  }

  $("#identity-trigger").addEventListener("click", openIdentity);
  $("#banner-identity").addEventListener("click", openIdentity);
  $("#registration-identity").addEventListener("click", openIdentity);
  $("#identity-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = ui.identityInput.value.trim();
    if (!UUID_PATTERN.test(value)) { ui.identityError.textContent = "Enter a valid campus user UUID."; ui.identityInput.focus(); return; }
    state.userId = value.toLowerCase();
    localStorage.setItem(STORAGE_KEY, state.userId);
    updateIdentityLabel();
    ui.identityDialog.close();
    await loadRegistrations();
    if (state.pendingEventId) {
      const eventId = state.pendingEventId;
      state.pendingEventId = null;
      await registerForEvent(eventId);
    }
  });
  ui.forgetId.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    state.userId = ""; state.registrations = [];
    updateIdentityLabel(); drawRegistrations(); drawEvents();
    ui.identityDialog.close(); toast("Campus ID removed from this browser.");
  });
  $("#search-form").addEventListener("submit", (event) => {
    event.preventDefault(); state.query = $("#search-input").value;
    $("#clear-search").hidden = !state.query; drawEvents();
    $("#events").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#search-input").addEventListener("input", (event) => { state.query = event.target.value; $("#clear-search").hidden = !state.query; drawEvents(); });
  $("#clear-search").addEventListener("click", () => { $("#search-input").value = ""; state.query = ""; $("#clear-search").hidden = true; drawEvents(); $("#search-input").focus(); });
  document.querySelectorAll(".view-option").forEach((button) => button.addEventListener("click", () => {
    document.querySelectorAll(".view-option").forEach((option) => option.classList.toggle("selected", option === button));
    state.filter = button.dataset.filter; drawEvents();
  }));
  ui.grid.addEventListener("click", (event) => {
    const details = event.target.closest("[data-details]");
    const register = event.target.closest("[data-register]");
    if (details) openDetails(details.dataset.details);
    if (register) registerForEvent(register.dataset.register, register);
  });
  $("#detail-register").addEventListener("click", () => { if (state.selectedEvent) registerForEvent(state.selectedEvent.id, $("#detail-register")); });
  $("#refresh-registrations").addEventListener("click", loadRegistrations);
  $("#retry-events").addEventListener("click", () => loadEvents());
  ui.loadMore.addEventListener("click", () => { if (state.hasMore) { state.page += 1; loadEvents(false); } });

  updateIdentityLabel();
  loadEvents();
  loadRegistrations();
})();
