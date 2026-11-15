/* NASA Moon Kids — progressive interaction and persistence enhancements.
   Load after the original inline application script. Does not replace its games,
   data, router, Three.js scene, or media handling. */
(function () {
  "use strict";
  if (window.__moonKidsEnhancementsLoaded) return;
  window.__moonKidsEnhancementsLoaded = true;

  var KEY = "moonkids";
  var REDUCED = !!(window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var saveTimer = 0;
  var lastSaved = "";
  var originalSaveNow = typeof window.saveNow === "function" ? window.saveNow : null;

  function safeState() {
    var current = window.S && typeof window.S === "object" ? window.S : {};
    if (!current.a || typeof current.a !== "object" || Array.isArray(current.a)) current.a = {};
    if (typeof current.name !== "string") current.name = "";
    current.name = current.name.slice(0, 14);
    current.mute = !!current.mute;
    return current;
  }

  function serialise() {
    var state = safeState();
    return JSON.stringify({
      a: state.a,
      name: state.name,
      mute: state.mute
    });
  }

  function persist(showFeedback) {
    var payload;
    try {
      payload = serialise();
      if (payload !== lastSaved) {
        window.localStorage.setItem(KEY, payload);
        lastSaved = payload;
      }
      if (showFeedback && typeof window.toast === "function") {
        window.toast("Progress saved!");
        if (typeof window.good === "function") window.good();
      }
      return true;
    } catch (err) {
      if (showFeedback && typeof window.toast === "function") {
        window.toast("Saving is unavailable in this browser.");
      }
      return false;
    }
  }

  // Replace the original empty save() with a debounced, backwards-compatible save.
  window.save = function save() {
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(function () { persist(false); }, 220);
  };

  // Keep the original manual-save feedback and behavior, while flushing pending data.
  window.saveNow = function saveNow() {
    window.clearTimeout(saveTimer);
    return persist(true);
  };

  function flush() {
    window.clearTimeout(saveTimer);
    persist(false);
  }
  window.addEventListener("pagehide", flush);
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });

  // The original script restores its saved object before this file is loaded.
  // Normalize it and establish a baseline so a no-op doesn't cause a write.
  var state = safeState();
  try {
    var raw = window.localStorage.getItem(KEY);
    if (raw) {
      var parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && parsed.a &&
          typeof parsed.a === "object" && !Array.isArray(parsed.a)) {
        state.a = parsed.a;
        if (typeof parsed.name === "string") state.name = parsed.name.slice(0, 14);
        state.mute = !!parsed.mute;
      }
    }
    lastSaved = JSON.stringify({ a: state.a, name: state.name, mute: state.mute });
  } catch (err) {
    // A blocked or malformed storage entry must never prevent the experience loading.
    lastSaved = "";
  }
  window.S = state;

  // Visual styling lives in NASA_Moon_Kids.css. No scripted animations here,
  // so nothing can flicker, jump or reveal late.
  function injectStyles() {}

  // The stars counter was clickable but not keyboard-operable in the original.
  var stars = document.getElementById("stars");
  if (stars) {
    stars.setAttribute("aria-label", "Your collected stars");
    stars.setAttribute("aria-live", "polite");
    stars.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        stars.click();
      }
    });
  }

  function refresh() {
    var nameInput = document.getElementById("nm");
    if (nameInput && window.S && nameInput.value !== window.S.name) {
      nameInput.value = window.S.name;
    }
  }


  /* ---------- Excited childlike machine voice ---------- */
  var voicePick = null;
  var PREFERRED = [
    /aria.*(online|natural)|jenny.*(online|natural)|ana.*(online|natural)/i,
    /\b(aria|jenny|zira|samantha|karen|tessa|moira|fiona|sara|susan)\b/i,
    /google (us|uk|) english/i,
    /female|woman|girl/i
  ];
  function chooseVoice() {
    var synth = window.speechSynthesis;
    if (!synth || !synth.getVoices) return null;
    var list = synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    if (!list.length) return null;
    for (var i = 0; i < PREFERRED.length; i++) {
      for (var j = 0; j < list.length; j++) {
        if (PREFERRED[i].test(list[j].name)) return list[j];
      }
    }
    return list[0];
  }
  if (window.speechSynthesis) {
    voicePick = chooseVoice();
    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener("voiceschanged", function () {
        voicePick = chooseVoice();
      });
    }
  }
  // A bright, delighted, childlike delivery: noticeably excited, but unhurried.
  // The browser's installed voice determines the actual vocal identity.
  window.say = function say(text) {
    if (window.S && window.S.mute) return;
    var synth = window.speechSynthesis;
    if (!synth) {
      if (typeof window.toast === "function") window.toast("Sorry, no voice on this device");
      return;
    }
    synth.cancel();
    if (!voicePick) voicePick = chooseVoice();
    var parts = String(text).match(/[^.!?]+[.!?]*/g) || [String(text)];
    parts.forEach(function (part) {
      part = part.trim();
      if (!part) return;
      var u = new SpeechSynthesisUtterance(part);
      u.lang = voicePick && voicePick.lang ? voicePick.lang : "en-US";
      if (voicePick) u.voice = voicePick;
      var excited = /[!؟?]/.test(part);
      var delighted = /\b(wow|amazing|awesome|incredible|yay|brilliant|fantastic|great)\b/i.test(part);
      // Slower articulation with a lifted, youthful pitch and extra sparkle on excited lines.
      u.pitch = delighted ? 1.62 : (excited ? 1.56 : 1.48);
      u.rate = delighted ? 0.86 : (excited ? 0.85 : 0.82);
      u.volume = 1;
      synth.speak(u);
    });
  };


  /* ---------- Recorded voice: same sound, same loudness, on every device ----------
     Each machine has two pre-recorded, loudness-matched (-16 LUFS) clips in /audio:
       <id>-hi.mp3    short greeting when the picture is tapped
       <id>-read.mp3  the full "Read to me" description
     If a clip cannot load or play, the old speech-synthesis voice is used instead. */
  var voiceEl = null;
  var voiceUnlocked = false;
  function getVoiceEl() {
    if (!voiceEl) {
      voiceEl = new Audio();
      voiceEl.preload = "auto";
      voiceEl.volume = 1;
    }
    return voiceEl;
  }
  window.stopVoice = function stopVoice() {
    if (voiceEl) {
      try { voiceEl.pause(); voiceEl.currentTime = 0; } catch (e) {}
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  };
  window.playVoice = function playVoice(id, kind, fallbackText) {
    if (window.S && window.S.mute) return;
    var el = getVoiceEl();
    function fallback() { if (fallbackText) window.say(fallbackText); }
    try {
      window.stopVoice();
      el.muted = false;
      el.onerror = fallback;
      el.src = "audio/" + id + "-" + kind + ".wav";
      var p = el.play();
      if (p && p.catch) p.catch(fallback);
    } catch (e) { fallback(); }
  };
  // Pause and resume either the recorded narration or browser speech.
  window.pauseVoice = function pauseVoice() {
    var paused = false;
    if (voiceEl && !voiceEl.paused && !voiceEl.ended) {
      voiceEl.pause();
      paused = true;
    }
    if (window.speechSynthesis && window.speechSynthesis.speaking &&
        !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      paused = true;
    }
    return paused;
  };
  window.resumeVoice = function resumeVoice() {
    var resumed = false;
    if (voiceEl && voiceEl.paused && voiceEl.currentTime > 0 && !voiceEl.ended) {
      var p = voiceEl.play();
      if (p && p.catch) p.catch(function () {});
      resumed = true;
    }
    if (window.speechSynthesis && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      resumed = true;
    }
    return resumed;
  };

  // iOS/Safari only allow audio after a tap: unlock the player (and the beep context) on the first touch.
  function unlockAudio() {
    if (voiceUnlocked) return;
    voiceUnlocked = true;
    try {
      var el = getVoiceEl();
      el.muted = true;
      el.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";
      var p = el.play();
      var silent = el.src;
      var done = function () { if (el.src === silent) { el.pause(); el.removeAttribute("src"); } el.muted = false; };
      if (p && p.then) p.then(done, function () { el.muted = false; }); else done();
    } catch (e) {}
    try { if (window.beep && window.beep.c && window.beep.c.resume) window.beep.c.resume(); } catch (e) {}
  }
  document.addEventListener("pointerdown", unlockAudio, { once: true, passive: true });
  document.addEventListener("keydown", unlockAudio, { once: true });

  // Keep the beeps alive on iOS/Safari, where the audio context starts suspended.
  var origBeep = window.beep;
  if (typeof origBeep === "function") {
    window.beep = function (f, d) {
      try { var c = window.beep.c; if (c && c.state === "suspended") c.resume(); } catch (e) {}
      origBeep(f, d);
    };
    window.beep.__orig = origBeep;
  }

  /* ---------- "Tell me more" must vanish once everything is shown ---------- */
  function fixMoreButton() {
    var more = document.getElementById("more");
    var items = document.querySelectorAll("#detail ul li");
    if (!more) return;
    var allShown = true;
    items.forEach(function (li) { if (li.hidden) allShown = false; });
    if (allShown) more.hidden = true;
  }
  var prevDetail = window.detail;
  if (typeof prevDetail === "function") {
    window.detail = function (i) {
      prevDetail(i);
      fixMoreButton();
    };
  }
  document.addEventListener("click", function (event) {
    if (event.target && event.target.closest && event.target.closest("#more")) {
      window.setTimeout(fixMoreButton, 0);
    }
  });

  /* ---------- Clicking anywhere on a card opens that machine's page ---------- */
  var cardsBox = document.getElementById("cards");
  if (cardsBox) {
    cardsBox.addEventListener("click", function (event) {
      var card = event.target.closest && event.target.closest(".card");
      if (!card || event.target.closest("a, button")) return; // links already navigate
      var id = card.getAttribute("data-id");
      if (id && typeof window.go === "function") window.go("#m-" + id);
    });
  }


  /* ---------- Gentle page fade on every navigation ---------- */
  var prevRoute = window.route;
  if (typeof prevRoute === "function") {
    window.route = function () {
      prevRoute();
      var on = document.querySelector(".pg.on");
      if (!on || REDUCED) return;
      on.classList.remove("pg-in");
      void on.offsetWidth; // restart the animation, even when the same section is reused
      on.classList.add("pg-in");
    };
  }

  injectStyles();
  refresh();
  window.addEventListener("hashchange", function () { window.setTimeout(refresh, 0); });
  window.addEventListener("load", refresh, { once: true });

  // Save the current state after initialization without overwriting a valid save.
  if (typeof window.upd === "function") window.upd();
})();
