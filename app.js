(() => {
  "use strict";

  const SECRET_KEY = "WOMANINSTEM";
  const ROUND_SECONDS = 120;

  const missions = [
    "REPORT A POTHOLE",
    "CHECK YOUR BIN DAY",
    "RENEW A LIBRARY BOOK",
    "REPORT FLY TIPPING",
    "REPORT A BROKEN STREETLIGHT",
    "CHECK A PLANNING APPLICATION",
    "APPLY FOR SCHOOL TRANSPORT",
    "FIND YOUR NEAREST LIBRARY",
    "REPORT A MISSED BIN",
    "BOOK A SPORTS SESSION",
    "CHECK A PARKING PERMIT",
    "REPORT A DAMAGED ROAD SIGN",
    "FIND A LOCAL PARK",
    "CHECK A COUNCIL MEETING",
    "REPORT A FLOODED DRAIN",
    "FIND A RECYCLING CENTRE"
  ];

  const hints = [
    "Think about the theme of the event: women working in science, technology, engineering and maths.",
    "The key is three words joined together: WOMAN + IN + STEM.",
    "Try: WOMANINSTEM"
  ];

  const screens = {
    start: document.getElementById("screen-start"),
    key: document.getElementById("screen-key"),
    decode: document.getElementById("screen-decode"),
    success: document.getElementById("screen-success")
  };

  const startButton = document.getElementById("start-button");
  const keyForm = document.getElementById("key-form");
  const keyInput = document.getElementById("key-input");
  const keyFormGroup = document.getElementById("key-form-group");
  const keyError = document.getElementById("key-error");
  const hintButton = document.getElementById("hint-button");
  const hintPanel = document.getElementById("hint-panel");
  const hintText = document.getElementById("hint-text");
  const restartFromKey = document.getElementById("restart-from-key");
  const decodeButton = document.getElementById("decode-button");
  const newMissionButton = document.getElementById("new-mission-button");
  const cipherText = document.getElementById("cipher-text");
  const cipherTextDecode = document.getElementById("cipher-text-decode");
  const plainText = document.getElementById("plain-text");
  const timer = document.getElementById("timer");
  const timerDecode = document.getElementById("timer-decode");
  const keySuccess = document.getElementById("key-success");
  const missionSuccess = document.getElementById("mission-success");
  const resultTime = document.getElementById("result-time");

  let currentMission = "";
  let currentCipher = "";
  let hintIndex = 0;
  let startedAt = null;
  let timerId = null;
  let remainingSeconds = ROUND_SECONDS;

  function normalise(value) {
    return value.toUpperCase().replace(/[^A-Z]/g, "");
  }

  function vigenereEncode(message, key) {
    const cleanKey = normalise(key);
    let keyIndex = 0;
    let output = "";
    for (const character of message.toUpperCase()) {
      if (character >= "A" && character <= "Z") {
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        const encoded = (character.charCodeAt(0) - 65 + shift) % 26;
        output += String.fromCharCode(encoded + 65);
        keyIndex += 1;
      }
    }
    return output.match(/.{1,4}/g)?.join(" ") ?? output;
  }

  function chooseMission() {
    const previous = sessionStorage.getItem("breakTheCode:lastMission");
    const choices = missions.filter((mission) => mission !== previous);
    const mission = choices[Math.floor(Math.random() * choices.length)];
    sessionStorage.setItem("breakTheCode:lastMission", mission);
    return mission;
  }

  function showScreen(name) {
    Object.entries(screens).forEach(([screenName, element]) => {
      element.hidden = screenName !== name;
    });
    const heading = screens[name].querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function updateTimerDisplay() {
    const text = formatTime(remainingSeconds);
    timer.textContent = text;
    timerDecode.textContent = text;
    const urgent = remainingSeconds <= 30;
    timer.classList.toggle("timer--urgent", urgent);
    timerDecode.classList.toggle("timer--urgent", urgent);
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    remainingSeconds = ROUND_SECONDS;
    startedAt = Date.now();
    updateTimerDisplay();
    timerId = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      remainingSeconds = Math.max(0, ROUND_SECONDS - elapsed);
      updateTimerDisplay();
      if (remainingSeconds === 0) stopTimer();
    }, 250);
  }

  function resetError() {
    keyError.hidden = true;
    keyFormGroup.classList.remove("form-group--error");
    keyInput.classList.remove("input--error");
    keyInput.removeAttribute("aria-invalid");
    keyInput.setAttribute("aria-describedby", "key-hint");
  }

  function showError() {
    keyError.hidden = false;
    keyFormGroup.classList.add("form-group--error");
    keyInput.classList.add("input--error");
    keyInput.setAttribute("aria-invalid", "true");
    keyInput.setAttribute("aria-describedby", "key-hint key-error");
    keyInput.focus();
  }

  function setUpMission() {
    currentMission = chooseMission();
    currentCipher = vigenereEncode(currentMission, SECRET_KEY);
    cipherText.textContent = currentCipher;
    cipherTextDecode.textContent = currentCipher;
    plainText.textContent = currentMission;
    hintIndex = 0;
    hintPanel.hidden = true;
    hintText.textContent = "";
    hintButton.disabled = false;
    hintButton.textContent = "Give me a hint";
    keyInput.value = "";
    resetError();
  }

  function beginChallenge() {
    setUpMission();
    startTimer();
    showScreen("key");
    window.setTimeout(() => keyInput.focus(), 0);
  }

  function restartChallenge() {
    stopTimer();
    showScreen("start");
  }

  startButton.addEventListener("click", beginChallenge);
  keyInput.addEventListener("input", resetError);

  keyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (normalise(keyInput.value) === SECRET_KEY) {
      resetError();
      showScreen("decode");
      keySuccess.focus();
      return;
    }
    showError();
  });

  hintButton.addEventListener("click", () => {
    hintPanel.hidden = false;
    hintText.textContent = hints[hintIndex];
    if (hintIndex < hints.length - 1) {
      hintIndex += 1;
      hintButton.textContent = "Another hint";
    } else {
      hintButton.disabled = true;
      hintButton.textContent = "No more hints";
    }
    hintPanel.scrollIntoView({ block: "nearest", behavior: "smooth" });
  });

  restartFromKey.addEventListener("click", restartChallenge);

  decodeButton.addEventListener("click", () => {
    stopTimer();
    const elapsedSeconds = startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0;
    if (elapsedSeconds > ROUND_SECONDS) {
      resultTime.textContent = "You broke the code — even after the two-minute timer ended.";
    } else {
      const minutes = Math.floor(elapsedSeconds / 60);
      const seconds = elapsedSeconds % 60;
      const timeParts = [];
      if (minutes) timeParts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
      if (seconds || !minutes) timeParts.push(`${seconds} second${seconds === 1 ? "" : "s"}`);
      resultTime.textContent = `Mission time: ${timeParts.join(" ")}.`;
    }
    showScreen("success");
    missionSuccess.focus();
  });

  newMissionButton.addEventListener("click", beginChallenge);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && screens.start.hidden) restartChallenge();
  });
})();
