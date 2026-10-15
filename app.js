(function () {
  const A = window.AULA;
  const $ = (sel) => document.querySelector(sel);
  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  // ---------- Armazenamento local (só para conveniência) ----------
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignora */ }
    }
  };

  // ---------- Placar ----------
  let teams = store.get("unit4-equipes", [
    { name: "Equipe A", pts: 0 },
    { name: "Equipe B", pts: 0 },
    { name: "Equipe C", pts: 0 },
    { name: "Equipe D", pts: 0 }
  ]);

  function saveTeams() { store.set("unit4-equipes", teams); }

  function renderScoreboard() {
    const box = $("#scoreboard");
    box.innerHTML = "";
    teams.forEach((t, i) => {
      const wrap = el("div", "team");
      const name = el("span", "name", t.name);
      name.title = "Clique duas vezes para renomear";
      name.addEventListener("dblclick", () => {
        const novo = prompt("Nome da equipe:", t.name);
        if (novo && novo.trim()) { t.name = novo.trim().slice(0, 20); saveTeams(); renderScoreboard(); renderAwardButtons(); }
      });
      const minus = el("button", null, "−");
      minus.title = "Tirar 1 ponto";
      minus.addEventListener("click", () => { t.pts = Math.max(0, t.pts - 1); saveTeams(); renderScoreboard(); });
      const pts = el("span", "pts", String(t.pts));
      const plus = el("button", null, "+");
      plus.title = "Dar 1 ponto";
      plus.addEventListener("click", () => { t.pts += 1; saveTeams(); renderScoreboard(); });
      wrap.append(name, minus, pts, plus);
      box.appendChild(wrap);
    });
    const reset = el("button", "ghost", "Zerar");
    reset.style.color = "#fff";
    reset.style.borderColor = "#fff";
    reset.addEventListener("click", () => {
      if (confirm("Zerar o placar?")) { teams.forEach((t) => (t.pts = 0)); saveTeams(); renderScoreboard(); }
    });
    box.appendChild(reset);
  }

  function awardPoint(teamIndex) {
    teams[teamIndex].pts += 1;
    saveTeams();
    renderScoreboard();
  }

  // ---------- Sinal sonoro ----------
  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.value = 0.2;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    } catch (e) { /* sem som */ }
  }

  // ---------- Slides (todos empilhados, rolagem contínua) ----------
  function renderSlides() {
    const box = $("#pages");
    A.slides.forEach((s) => {
      const num = String(s.n).padStart(2, "0");
      const fig = el("figure", "page");
      fig.id = "slide-" + s.n;
      const img = el("img");
      img.src = `slide-${num}.jpg`;
      img.alt = `Slide ${s.n}: ${s.title}`;
      img.loading = "lazy";
      fig.appendChild(img);
      fig.appendChild(el("figcaption", null, `${s.n} / 40 · ${s.title}`));
      box.appendChild(fig);
    });
  }

  $("#topBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    $("#topBtn").hidden = window.scrollY < 600;
  });

  // ---------- Abas ----------
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      btn.classList.add("active");
      $("#tab-" + btn.dataset.tab).classList.add("active");
    });
  });

  // ---------- Timer genérico ----------
  function makeTimer(seconds, onTick, onEnd) {
    let left = seconds;
    let handle = null;
    onTick(left);
    return {
      start() {
        if (handle) return;
        handle = setInterval(() => {
          left -= 1;
          onTick(left);
          if (left <= 0) { this.stop(); onEnd(); }
        }, 1000);
      },
      stop() { clearInterval(handle); handle = null; },
      reset(s) { this.stop(); left = s; onTick(left); }
    };
  }

  // ---------- Quiz ----------
  let quizOrder = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizTimer = null;
  let answered = false;

  function startQuiz() {
    quizOrder = A.quiz.map((_, i) => i).sort(() => Math.random() - 0.5);
    quizIndex = 0;
    quizScore = 0;
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const card = $("#quizCard");
    card.innerHTML = "";
    if (quizIndex >= quizOrder.length) {
      card.append(el("p", "score-line", `Resultado: ${quizScore} de ${quizOrder.length}`));
      const again = el("button", null, "Recomeçar");
      again.addEventListener("click", startQuiz);
      card.append(again);
      return;
    }
    const item = A.quiz[quizOrder[quizIndex]];
    answered = false;

    card.append(el("div", "meta", `Pergunta ${quizIndex + 1} de ${quizOrder.length} · Slide ${item.slide}`));
    card.append(el("div", "quiz-q", item.q));

    const bar = el("div", "timer-bar");
    const fill = el("div");
    bar.appendChild(fill);
    card.append(bar);

    const opts = el("div", "opts");
    item.options.forEach((txt, i) => {
      const b = el("button", "opt", txt);
      b.addEventListener("click", () => choose(i, item, opts));
      opts.appendChild(b);
    });
    card.append(opts);

    const next = el("button", null, quizIndex === quizOrder.length - 1 ? "Ver resultado" : "Próxima");
    next.id = "quizNext";
    next.style.marginTop = "16px";
    next.disabled = true;
    next.addEventListener("click", () => { quizIndex++; renderQuizQuestion(); });
    card.append(next);

    card.append(el("div", "score-line", `Acertos: ${quizScore}`));

    quizTimer = makeTimer(
      30,
      (s) => { fill.style.width = (s / 30) * 100 + "%"; },
      () => { if (!answered) { revealAnswer(item, opts); answered = true; $("#quizNext").disabled = false; beep(); } }
    );
    quizTimer.start();
  }

  function choose(i, item, opts) {
    if (answered) return;
    answered = true;
    if (quizTimer) quizTimer.stop();
    const buttons = opts.querySelectorAll(".opt");
    buttons.forEach((b) => (b.disabled = true));
    if (i === item.answer) {
      buttons[i].classList.add("right");
      quizScore++;
    } else {
      buttons[i].classList.add("wrong");
      buttons[item.answer].classList.add("right");
    }
    $("#quizNext").disabled = false;
    $("#quizCard .score-line").textContent = `Acertos: ${quizScore}`;
  }

  function revealAnswer(item, opts) {
    const buttons = opts.querySelectorAll(".opt");
    buttons.forEach((b) => (b.disabled = true));
    buttons[item.answer].classList.add("right");
  }

  // ---------- Completar ----------
  const norm = (s) => String(s || "").trim().toLowerCase().replace(/\s+/g, " ");
  const isNoArticle = (s) => ["", "-", "—", "(no article)", "(sem artigo)"].includes(norm(s));
  function matches(answer, typed) {
    if (answer === "—") return isNoArticle(typed);
    return norm(answer) === norm(typed);
  }

  function renderFill() {
    const box = $("#fillArea");
    box.innerHTML = "";
    A.fill.forEach((block, bi) => {
      const card = el("div", "card fill-block");
      card.append(el("h2", null, `Slide ${block.slide} · ${block.title}`));
      block.items.forEach((item, ii) => {
        const line = el("div", "fill-line");
        const ctrl = item.blank.options ? el("select") : el("input");
        ctrl.setAttribute("aria-label", `Lacuna ${ii + 1}`);
        if (item.blank.options) {
          const first = el("option", null, "—");
          first.value = "";
          ctrl.appendChild(first);
          item.blank.options.forEach((o) => {
            const opt = el("option", null, o);
            opt.value = o;
            ctrl.appendChild(opt);
          });
        } else {
          ctrl.type = "text";
          ctrl.placeholder = "escreva";
          ctrl.autocomplete = "off";
        }
        ctrl.dataset.block = bi;
        ctrl.dataset.item = ii;
        if (item.before) line.append(el("span", null, item.before));
        line.append(ctrl);
        if (item.after) line.append(el("span", null, item.after));
        line.append(el("span", "answer"));
        card.append(line);
      });
      const actions = el("div", "row");
      actions.style.marginTop = "12px";
      const check = el("button", null, "Verificar");
      const show = el("button", "ghost", "Mostrar respostas");
      const result = el("span", "fill-result");
      check.addEventListener("click", () => checkBlock(card, block, result));
      show.addEventListener("click", () => showAnswers(card, block));
      actions.append(check, show, result);
      card.append(actions);
      box.appendChild(card);
    });
  }

  function controlValue(c) { return c.value; }

  function checkBlock(card, block, result) {
    let right = 0;
    const lines = card.querySelectorAll(".fill-line");
    block.items.forEach((item, i) => {
      const line = lines[i];
      line.classList.remove("ok", "bad");
      line.querySelector(".answer").textContent = "";
      const ctrl = line.querySelector("input, select");
      const typed = controlValue(ctrl);
      const ok = item.blank.answers.some((a) => matches(a, typed));
      line.classList.add(ok ? "ok" : "bad");
      if (ok) right++;
    });
    result.textContent = `${right} / ${block.items.length} corretas`;
  }

  function showAnswers(card, block) {
    const lines = card.querySelectorAll(".fill-line");
    block.items.forEach((item, i) => {
      const line = lines[i];
      line.classList.remove("ok", "bad");
      const shown = item.blank.answers[0] === "—" ? "(sem artigo)" : item.blank.answers[0];
      line.querySelector(".answer").textContent = "→ " + shown;
    });
  }

  // ---------- Missões ----------
  let missionIndex = 0;
  let activeTile = null;
  const taskCard = $("#taskCard");
  const timerEl = $("#taskTimer");
  let taskTimer = null;

  function renderMissionSwitch() {
    const box = $("#missionSwitch");
    box.innerHTML = "";
    A.missions.forEach((m, i) => {
      const b = el("button", i === missionIndex ? "active" : "", m.name);
      b.addEventListener("click", () => { missionIndex = i; renderMissionSwitch(); renderTiles(); closeTask(); });
      box.appendChild(b);
    });
  }

  let doneTiles = {};
  function renderTiles() {
    const box = $("#tiles");
    box.innerHTML = "";
    const mission = A.missions[missionIndex];
    mission.tasks.forEach((t, i) => {
      const key = missionIndex + "-" + i;
      const b = el("button", "tile" + (doneTiles[key] ? " done" : ""));
      b.append(el("span", "num", String(i + 1)), document.createTextNode(t));
      b.addEventListener("click", () => openTask(i, key, t));
      box.appendChild(b);
    });
  }

  function openTask(i, key, text) {
    activeTile = key;
    $("#taskPrompt").textContent = text;
    taskCard.hidden = false;
    $("#awardRow").hidden = true;
    timerEl.textContent = "30";
    timerEl.classList.remove("low");
    $("#startTask").disabled = false;
    $("#startTask").textContent = "Iniciar 30s";
    taskCard.scrollIntoView({ behavior: "smooth", block: "center" });
    if (taskTimer) taskTimer.stop();
    taskTimer = makeTimer(
      30,
      (s) => { timerEl.textContent = String(s); timerEl.classList.toggle("low", s <= 5); },
      () => {
        beep();
        timerEl.textContent = "Tempo!";
        $("#startTask").disabled = true;
        $("#awardRow").hidden = false;
      }
    );
  }

  function closeTask() {
    taskCard.hidden = true;
    if (taskTimer) taskTimer.stop();
  }

  function renderAwardButtons() {
    const box = $("#awardButtons");
    box.innerHTML = "";
    teams.forEach((t, i) => {
      const b = el("button", null, t.name);
      b.addEventListener("click", () => {
        awardPoint(i);
        if (activeTile) { doneTiles[activeTile] = true; activeTile = null; renderTiles(); }
        closeTask();
      });
      box.appendChild(b);
    });
    const none = el("button", "ghost", "Ninguém");
    none.addEventListener("click", () => {
      if (activeTile) { doneTiles[activeTile] = true; activeTile = null; renderTiles(); }
      closeTask();
    });
    box.appendChild(none);
  }

  $("#startTask").addEventListener("click", () => {
    if (taskTimer) taskTimer.start();
    $("#startTask").disabled = true;
    $("#startTask").textContent = "Valendo!";
  });
  $("#closeTask").addEventListener("click", closeTask);

  // ---------- Speaking (gravação de áudio) ----------
  const recordings = {}; // slide -> lista de { url, label }
  let mediaRecorder = null;
  let chunks = [];
  let speakIndex = 0;

  function renderSpeak() {
    const card = $("#speakCard");
    card.innerHTML = "";
    const item = A.speaking[speakIndex];

    card.append(el("div", "meta", `Speaking ${speakIndex + 1} de ${A.speaking.length} · Slide ${item.slide}`));
    card.append(el("p", "speak-prompt", item.prompt));
    card.append(el("p", "speak-hint", item.hint));

    const nav = el("div", "row");
    const prev = el("button", "ghost", "← Anterior");
    prev.disabled = speakIndex === 0;
    prev.addEventListener("click", () => { stopRecording(); speakIndex--; renderSpeak(); });
    const next = el("button", "ghost", "Próximo →");
    next.disabled = speakIndex === A.speaking.length - 1;
    next.addEventListener("click", () => { stopRecording(); speakIndex++; renderSpeak(); });
    nav.append(prev, next);
    card.append(nav);

    const recRow = el("div", "row");
    recRow.style.marginTop = "16px";
    const rec = el("button", "rec-btn", "● Gravar resposta");
    rec.id = "recBtn";
    rec.addEventListener("click", () => toggleRecording(rec, item));
    const timerLabel = el("span", "", "");
    timerLabel.id = "recTimer";
    recRow.append(rec, timerLabel);
    card.append(recRow);

    const list = el("ul", "rec-list");
    (recordings[item.slide] || []).forEach((r, idx) => {
      const li = el("li");
      li.append(el("span", "label", `Gravação ${idx + 1}`));
      const audio = el("audio");
      audio.controls = true;
      audio.src = r.url;
      const del = el("button", "ghost", "Apagar");
      del.addEventListener("click", () => {
        URL.revokeObjectURL(r.url);
        recordings[item.slide].splice(idx, 1);
        renderSpeak();
      });
      li.append(audio, del);
      list.appendChild(li);
    });
    card.append(list);

    const note = el("p", "note", "As gravações ficam só nesta página (são apagadas ao fechar ou recarregar). Use o navegador com permissão de microfone.");
    card.append(note);
  }

  function toggleRecording(btn, item) {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      stopRecording();
      return;
    }
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Este navegador não permite gravar áudio aqui.");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      chunks = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || "audio/webm" });
        (recordings[item.slide] = recordings[item.slide] || []).push({ url: URL.createObjectURL(blob) });
        renderSpeak();
      };
      mediaRecorder.start();
      btn.textContent = "■ Parar";
      btn.classList.add("recording");
      startRecTimer();
    }).catch(() => {
      alert("Não foi possível acessar o microfone. Verifique a permissão do navegador.");
    });
  }

  let recTick = null;
  function startRecTimer() {
    let s = 0;
    const label = $("#recTimer");
    clearInterval(recTick);
    recTick = setInterval(() => { s++; if (label) label.textContent = `${s}s`; }, 1000);
  }

  function stopRecording() {
    clearInterval(recTick);
    if (mediaRecorder && mediaRecorder.state === "recording") mediaRecorder.stop();
  }

  // ---------- Inicialização ----------
  renderScoreboard();
  renderSlides();
  startQuiz();
  renderFill();
  renderMissionSwitch();
  renderTiles();
  renderAwardButtons();
  renderSpeak();
})();
