(function () {
  'use strict';

  const $app = document.getElementById('app');
  const $crumbs = document.getElementById('crumbs');
  const $total = document.getElementById('total');

  /* ---------------- Stockage (progression locale) ---------------- */
  const CLE = 'cartable-malin:v1';

  function charger() {
    try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; }
  }

  const etat = Object.assign({ scores: {}, flash: {}, options: {}, bonnes: 0 }, charger());

  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible */ }
    majTotal();
  }

  function majTotal() {
    const etoiles = Object.values(etat.scores).reduce((s, x) => s + (x.etoiles || 0), 0);
    $total.innerHTML =
      `<span class="pill" title="Étoiles gagnées">⭐ ${etoiles}</span>` +
      `<span class="pill" title="Bonnes réponses au total">✅ ${etat.bonnes}</span>`;
  }

  /* ---------------- Utilitaires d'affichage ---------------- */
  const esc = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const texte = s => esc(s).replace(/\n/g, '<br>');

  const etoilesDe = pct => (pct >= 100 ? 3 : pct >= 80 ? 2 : pct >= 50 ? 1 : 0);

  /** Note sur 20, arrondie au demi-point. */
  const noteSur20 = (bonnes, total) => (total ? Math.round((bonnes / total) * 40) / 2 : 0);

  function appreciation(note) {
    if (note >= 18) return 'Excellent ! 🏆';
    if (note >= 16) return 'Très bien ! 🌟';
    if (note >= 14) return 'Bien ! 👍';
    if (note >= 12) return 'Assez bien 🙂';
    if (note >= 10) return 'Peut mieux faire 💪';
    return 'À retravailler, courage ! 📚';
  }

  /** Meilleure note d'un thème (les anciennes sauvegardes n'ont que le pourcentage). */
  const meilleureNote = sc => (sc.meilleureNote !== undefined ? sc.meilleureNote : sc.meilleur / 5);

  function etoiles(n, cls = '') {
    let s = `<span class="stars ${cls}" aria-label="${n} étoile${n > 1 ? 's' : ''} sur 3">`;
    for (let i = 0; i < 3; i++) s += `<span class="star ${i < n ? 'on' : ''}" style="--d:${i * 0.15}s">★</span>`;
    return s + '</span>';
  }

  const BRAVO = ['Bravo ! 🎉', 'Super ! 👏', 'Excellent ! 🌟', 'Parfait ! ✨', 'Génial ! 🚀', 'Bien joué ! 💪'];
  const OUPS = ['Pas tout à fait… 🤔', 'Oups ! 😅', 'Presque ! 🙃'];

  let nettoyage = [];
  function nettoyer() {
    nettoyage.forEach(f => f());
    nettoyage = [];
  }
  function surTouche(fn) {
    document.addEventListener('keydown', fn);
    nettoyage.push(() => document.removeEventListener('keydown', fn));
  }

  function ecran(html, fil) {
    nettoyer();
    $app.innerHTML = html;
    $crumbs.innerHTML = fil
      .map((it, i) => (i < fil.length - 1 ? `<a href="${it.href}">${esc(it.label)}</a>` : `<span>${esc(it.label)}</span>`))
      .join('<span class="sep">›</span>');
    window.scrollTo(0, 0);
  }

  const $ = sel => $app.querySelector(sel);
  const $$ = sel => Array.from($app.querySelectorAll(sel));

  function filDe(ctx, dernier) {
    const fil = [{ label: 'Accueil', href: '#/' }];
    if (ctx.niveau) fil.push({ label: ctx.niveau.nom, href: `#/${ctx.niveau.id}` });
    if (ctx.module) fil.push({ label: ctx.module.nom, href: `#/${ctx.niveau.id}/${ctx.module.id}` });
    if (ctx.theme) fil.push({ label: ctx.theme.nom, href: ctx.base });
    if (dernier) fil.push({ label: dernier });
    return fil;
  }

  function confettis() {
    const box = document.createElement('div');
    box.className = 'confetti';
    const emojis = ['🎉', '⭐', '✨', '🎊', '🌟'];
    for (let i = 0; i < 36; i++) {
      const s = document.createElement('span');
      s.textContent = U.pick(emojis);
      s.style.left = Math.random() * 100 + 'vw';
      s.style.animationDelay = Math.random() * 0.8 + 's';
      s.style.fontSize = 16 + Math.random() * 18 + 'px';
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 3500);
  }

  /** Barres des dernières notes /20 : la note du jour est étiquetée, les autres au survol. */
  function graphiqueProgression(historique, parties, couleur) {
    if (historique.length < 2) {
      return '<section class="panel"><h2>Ta progression</h2><p class="muted">Rejoue ce quiz pour voir l\'évolution de tes notes ici.</p></section>';
    }
    const derniere = historique[historique.length - 1];
    const ecart = derniere - historique[historique.length - 2];
    const tendance = ecart > 0 ? `▲ +${U.nb(ecart)} point${ecart > 1 ? 's' : ''} depuis la dernière fois`
      : ecart < 0 ? `▼ ${U.nb(ecart)} point${ecart < -1 ? 's' : ''} depuis la dernière fois`
      : '= même note que la dernière fois';
    const debut = Math.max(0, parties - historique.length);
    const colonnes = historique.map((n, i) => {
      const actuelle = i === historique.length - 1;
      const libelle = actuelle ? 'Aujourd\'hui' : `Partie ${debut + i + 1}`;
      return `
        <div class="histo-col ${actuelle ? 'current' : ''}" tabindex="0">
          <span class="histo-tip">${libelle} : <b>${U.nb(n)}/20</b></span>
          ${actuelle ? `<span class="histo-val">${U.nb(n)}</span>` : ''}
          <div class="histo-bar" style="height:${Math.max(n, 0.4) * 5}%"></div>
        </div>`;
    }).join('');
    return `
      <section class="panel" style="--c:${couleur}">
        <h2>Ta progression</h2>
        <p class="muted small">Tes ${historique.length} dernières notes sur 20 · <b class="tendance">${tendance}</b></p>
        <div class="histo" role="img" aria-label="Notes successives : ${historique.map(n => U.nb(n)).join(', ')} sur 20">
          <div class="histo-grid"><span>20</span><span>10</span><span>0</span></div>
          <div class="histo-plot">${colonnes}</div>
        </div>
      </section>`;
  }

  /* ---------------- Vues de navigation ---------------- */
  function vueNiveaux() {
    const tuiles = CATALOGUE.niveaux.map(n => {
      const actif = n.modules.length > 0;
      const inner = `
        <span class="tile-emoji">${n.emoji}</span>
        <strong class="tile-title">${esc(n.nom)}</strong>
        <small>${esc(n.sousTitre)}</small>
        ${actif ? '' : '<span class="badge">Bientôt</span>'}`;
      return actif
        ? `<a class="tile" href="#/${n.id}" style="--c:${n.couleur}">${inner}</a>`
        : `<div class="tile disabled" style="--c:${n.couleur}" aria-disabled="true">${inner}</div>`;
    }).join('');

    ecran(`
      <section class="hero">
        <h1>Salut ! 👋</h1>
        <p>Choisis ton niveau pour t'entraîner avec des quiz et des flashcards.</p>
      </section>
      <div class="grid grid-niveaux">${tuiles}</div>`,
      [{ label: 'Accueil' }]);
  }

  function vueModules(ctx) {
    const { niveau } = ctx;
    const tuiles = niveau.modules.map(m => {
      const gagnees = m.themes.reduce((s, t) => s + ((etat.scores[`${niveau.id}/${m.id}/${t.id}`] || {}).etoiles || 0), 0);
      return `
        <a class="tile tile-wide" href="#/${niveau.id}/${m.id}" style="--c:${m.couleur}">
          <span class="tile-emoji">${m.icone}</span>
          <div>
            <strong class="tile-title">${esc(m.nom)}</strong>
            <small>${m.themes.length} thèmes · ⭐ ${gagnees} / ${m.themes.length * 3}</small>
          </div>
        </a>`;
    }).join('');

    ecran(`
      <section class="hero" style="--c:${niveau.couleur}">
        <h1>${niveau.emoji} ${esc(niveau.nom)}</h1>
        <p>Quelle matière veux-tu travailler ?</p>
      </section>
      <div class="grid">${tuiles}</div>`,
      filDe(ctx));
  }

  function vueThemes(ctx) {
    const { niveau, module } = ctx;
    const cartes = module.themes.map(t => {
      const base = `#/${niveau.id}/${module.id}/${t.id}`;
      const sc = etat.scores[`${niveau.id}/${module.id}/${t.id}`];
      const fl = etat.flash[`${niveau.id}/${module.id}/${t.id}`];
      return `
        <article class="theme" style="--c:${t.couleur}">
          <div class="theme-head">
            <span class="theme-icon">${t.icone}</span>
            <div>
              <h2>${esc(t.nom)}</h2>
              <p class="muted">${esc(t.description)}</p>
            </div>
          </div>
          <div class="theme-stats">
            ${etoiles(sc ? sc.etoiles : 0)}
            <span class="muted small">${sc
              ? `${sc.derniereNote !== undefined ? `Dernière note : <b>${U.nb(sc.derniereNote)}/20</b> · ` : ''}Record : ${U.nb(meilleureNote(sc))}/20 · ${sc.parties} partie${sc.parties > 1 ? 's' : ''}`
              : 'Pas encore joué'}</span>
            ${fl ? `<span class="muted small">🃏 Dernière série : ${fl.sues} / ${fl.total} sues</span>` : ''}
          </div>
          <div class="theme-actions">
            <a class="btn primary" href="${base}/quiz">🎯 Quiz</a>
            <a class="btn" href="${base}/flashcards">🃏 Flashcards</a>
          </div>
        </article>`;
    }).join('');

    ecran(`
      <section class="hero" style="--c:${module.couleur}">
        <h1>${module.icone} ${esc(module.nom)} · ${esc(niveau.nom)}</h1>
        <p>Choisis un thème, puis entraîne-toi en quiz ou révise avec les flashcards.</p>
      </section>
      <div class="themes">${cartes}</div>`,
      filDe(ctx));
  }

  /* ---------------- Écran de départ (options) ---------------- */
  const MAX_QUESTIONS = 100;

  // La valeur 0 signifie « Toutes » (plafonné à MAX_QUESTIONS) : uniquement pour les thèmes à liste finie (theme.toutes).
  function definitionsOptions(theme, mode) {
    const nombre = mode === 'quiz'
      ? { id: 'nombre', type: 'choix', label: 'Nombre de questions', valeurs: [5, 10, 15, 20, 50, 100], defaut: 10 }
      : { id: 'cartes', type: 'choix', label: 'Nombre de cartes', valeurs: [10, 20, 30], defaut: 20 };
    if (mode !== 'quiz' || theme.toutes) nombre.valeurs.push(0);
    nombre.libelles = nombre.valeurs.map(v => (v === 0 ? 'Toutes' : String(v)));
    return [nombre].concat((theme.options || []).filter(o => !o.mode || o.mode === mode));
  }

  function rendreOption(d, val) {
    if (d.type === 'multi') {
      const chips = d.valeurs.map((v, i) =>
        `<button type="button" class="chip ${val.includes(v) ? 'on' : ''}" data-i="${i}">${esc(v)}</button>`).join('');
      return `<div class="chips" data-id="${d.id}">${chips}<button type="button" class="chip chip-all" data-all>Toutes</button></div>`;
    }
    const boutons = d.valeurs.map((v, i) =>
      `<button type="button" class="${v === val ? 'on' : ''}" data-i="${i}">${esc(d.libelles ? d.libelles[i] : v)}</button>`).join('');
    return `<div class="seg" data-id="${d.id}">${boutons}</div>`;
  }

  function vueDepart(ctx, mode) {
    const { theme } = ctx;
    const defs = definitionsOptions(theme, mode);
    const sauvees = etat.options[ctx.cle] || {};
    const valeurs = {};
    defs.forEach(d => {
      let v = sauvees[d.id];
      if (d.type === 'multi') {
        v = Array.isArray(v) ? v.filter(x => d.valeurs.includes(x)) : [];
        if (!v.length) v = d.defaut.slice();
      } else if (!d.valeurs.includes(v)) {
        v = d.defaut;
      }
      valeurs[d.id] = v;
    });

    const quiz = mode === 'quiz';
    ecran(`
      <section class="panel start" style="--c:${theme.couleur}">
        <div class="start-head">
          <span class="theme-icon big">${theme.icone}</span>
          <div>
            <span class="kicker">${quiz ? '🎯 Quiz QCM' : '🃏 Flashcards'}</span>
            <h1>${esc(theme.nom)}</h1>
            <p class="muted">${esc(theme.description)}</p>
          </div>
        </div>
        ${defs.map(d => `<div class="opt"><div class="opt-label">${esc(d.label)}</div>${rendreOption(d, valeurs[d.id])}</div>`).join('')}
        <p class="muted small tip">${quiz
          ? '⌨️ Astuce : tu peux répondre avec les touches 1 à 4, puis Entrée pour continuer.'
          : '⌨️ Astuce : Espace pour retourner la carte, ← « à revoir », → « je savais ».'}</p>
        <div class="actions">
          <a class="btn" href="#/${ctx.niveau.id}/${ctx.module.id}">← Retour</a>
          <button type="button" class="btn primary big" id="go">C'est parti ! 🚀</button>
        </div>
      </section>`,
      filDe(ctx, quiz ? 'Quiz' : 'Flashcards'));

    $$('.seg').forEach(seg => {
      const d = defs.find(x => x.id === seg.dataset.id);
      seg.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        valeurs[d.id] = d.valeurs[+b.dataset.i];
        seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      });
    });

    $$('.chips').forEach(box => {
      const d = defs.find(x => x.id === box.dataset.id);
      const maj = () => box.querySelectorAll('[data-i]').forEach(x =>
        x.classList.toggle('on', valeurs[d.id].includes(d.valeurs[+x.dataset.i])));
      box.addEventListener('click', e => {
        const b = e.target.closest('button');
        if (!b) return;
        if (b.hasAttribute('data-all')) {
          valeurs[d.id] = d.valeurs.slice();
        } else {
          const v = d.valeurs[+b.dataset.i];
          const sel = valeurs[d.id];
          if (sel.includes(v)) {
            if (sel.length === 1) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
            valeurs[d.id] = sel.filter(x => x !== v);
          } else {
            valeurs[d.id] = sel.concat(v).sort((a, c) => a - c);
          }
        }
        maj();
      });
    });

    $('#go').addEventListener('click', () => {
      etat.options[ctx.cle] = Object.assign({}, sauvees, valeurs);
      sauver();
      const opts = etat.options[ctx.cle];
      if (quiz) lancerQuiz(ctx, opts);
      else lancerFlash(ctx, opts);
    });
  }

  /* ---------------- Quiz ---------------- */
  function lancerQuiz(ctx, opts) {
    const questions = ctx.theme.quiz(Math.min(opts.nombre || MAX_QUESTIONS, MAX_QUESTIONS), opts);
    const s = { i: 0, bonnes: 0, serie: 0, meilleureSerie: 0, erreurs: [], resultats: [] };
    const chrono = opts.chrono || 0;
    afficherQuestion();

    function texteNote() {
      return s.i ? `📝 <b>${U.nb(noteSur20(s.bonnes, s.resultats.length))}</b>/20` : '📝 –/20';
    }

    function afficherQuestion() {
      const q = questions[s.i];
      const n = questions.length;
      const segments = questions.map((_, j) =>
        `<span class="${j < s.resultats.length ? (s.resultats[j] ? 'ok' : 'ko') : j === s.i ? 'cur' : ''}"></span>`).join('');
      ecran(`
        <section class="panel quiz" style="--c:${ctx.theme.couleur}">
          <div class="bar-top">
            <span class="muted">Question <b>${s.i + 1}</b> / ${n}</span>
            <span class="pills">
              <span class="pill note-pill" id="p-note" title="Note en cours, sur 20">${texteNote()}</span>
              <span class="pill" id="p-score" title="Bonnes réponses / questions répondues">✅ ${s.bonnes}/${s.resultats.length}</span>
              <span class="pill ${s.serie >= 3 ? 'hot' : ''}" id="p-serie" title="Série en cours">🔥 ${s.serie}</span>
            </span>
          </div>
          <div class="segments ${n > 40 ? 'dense' : ''}" aria-hidden="true">${segments}</div>
          ${chrono ? '<div class="timer"><div></div></div>' : ''}
          <div class="question ${q.enonce.length > 50 ? 'long' : ''}">${texte(q.enonce)}</div>
          <div class="choices">
            ${q.choix.map((c, k) => `<button type="button" class="choice" data-k="${k}"><span class="key">${k + 1}</span><span>${esc(c)}</span></button>`).join('')}
          </div>
          <div class="feedback" hidden></div>
          <div class="actions"><button type="button" class="btn primary big" id="suivant" hidden></button></div>
        </section>`,
        filDe(ctx, 'Quiz'));

      const boutons = $$('.choice');
      const $suiv = $('#suivant');
      const $fb = $('.feedback');
      let repondu = false, parti = false;
      let arreterChrono = () => {};

      $suiv.textContent = s.i + 1 < n ? 'Question suivante →' : 'Voir mon score 🏆';
      boutons.forEach(b => b.addEventListener('click', () => repondre(+b.dataset.k)));
      $suiv.addEventListener('click', suivant);

      surTouche(e => {
        if (!repondu) {
          const k = '1234'.indexOf(e.key);
          if (k >= 0 && k < boutons.length) repondre(k);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          suivant();
        }
      });

      if (chrono) {
        const $barre = $('.timer > div');
        const debut = performance.now();
        const duree = chrono * 1000;
        const id = setInterval(() => {
          const r = 1 - (performance.now() - debut) / duree;
          $barre.style.width = Math.max(0, r) * 100 + '%';
          $barre.classList.toggle('low', r < 0.3);
          if (r <= 0) repondre(-1);
        }, 50);
        arreterChrono = () => clearInterval(id);
        nettoyage.push(arreterChrono);
      }

      function repondre(k) {
        if (repondu) return;
        repondu = true;
        arreterChrono();
        const ok = k === q.bonne;
        boutons.forEach((b, j) => {
          b.disabled = true;
          if (j === q.bonne) b.classList.add('correct');
          else if (j === k) b.classList.add('wrong');
          else b.classList.add('dim');
        });
        if (ok) {
          s.bonnes++;
          s.serie++;
          s.meilleureSerie = Math.max(s.meilleureSerie, s.serie);
        } else {
          s.serie = 0;
          s.erreurs.push({ q, k });
        }
        s.resultats.push(ok);
        $$('.segments > span')[s.i].className = ok ? 'ok' : 'ko';
        $('#p-score').textContent = `✅ ${s.bonnes}/${s.resultats.length}`;
        const $note = $('#p-note');
        $note.innerHTML = `📝 <b>${U.nb(noteSur20(s.bonnes, s.resultats.length))}</b>/20`;
        $note.classList.remove('bump');
        void $note.offsetWidth;
        $note.classList.add('bump');
        const $serie = $('#p-serie');
        $serie.textContent = `🔥 ${s.serie}`;
        $serie.classList.toggle('hot', s.serie >= 3);

        const titre = ok ? U.pick(BRAVO) : k < 0 ? '⏰ Temps écoulé !' : U.pick(OUPS);
        $fb.className = 'feedback ' + (ok ? 'ok' : 'ko');
        $fb.innerHTML =
          `<strong>${titre}</strong>` +
          (ok ? '' : ` La bonne réponse est <b>${esc(q.choix[q.bonne])}</b>.`) +
          (q.explication ? `<p class="expl">💡 ${texte(q.explication)}</p>` : '');
        $fb.hidden = false;
        $suiv.hidden = false;
        $suiv.focus({ preventScroll: true });
        $fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      function suivant() {
        if (!repondu || parti) return;
        parti = true;
        s.i++;
        if (s.i < n) afficherQuestion();
        else fin();
      }
    }

    function fin() {
      const total = questions.length;
      const pct = Math.round((s.bonnes / total) * 100);
      const et = etoilesDe(pct);
      const note = noteSur20(s.bonnes, total);
      const ancien = etat.scores[ctx.cle];
      const record = ancien && note > meilleureNote(ancien);
      const historique = ((ancien && ancien.historique) || []).concat(note).slice(-10);
      etat.scores[ctx.cle] = {
        meilleur: Math.max(pct, ancien ? ancien.meilleur : 0),
        meilleureNote: Math.max(note, ancien ? meilleureNote(ancien) : 0),
        etoiles: Math.max(et, ancien ? ancien.etoiles : 0),
        parties: (ancien ? ancien.parties : 0) + 1,
        dernier: pct,
        derniereNote: note,
        historique,
      };
      etat.bonnes += s.bonnes;
      sauver();

      const message = pct === 100 ? 'Sans faute, tu es un champion !'
        : pct >= 80 ? 'Encore un petit effort pour le sans-faute.'
        : pct >= 50 ? 'Révise les flashcards pour progresser.'
        : 'Entraîne-toi avec les flashcards, puis réessaie.';

      const erreurs = s.erreurs.map(({ q, k }) => `
        <li>
          <div class="err-q">${texte(q.enonce)}</div>
          <div class="err-a">
            <span class="tag ko">${k < 0 ? 'Pas de réponse' : 'Ta réponse : ' + esc(q.choix[k])}</span>
            <span class="tag ok">Bonne réponse : ${esc(q.choix[q.bonne])}</span>
          </div>
          ${q.explication ? `<div class="muted small">💡 ${texte(q.explication)}</div>` : ''}
        </li>`).join('');

      ecran(`
        <section class="panel result" style="--c:${ctx.theme.couleur}">
          ${etoiles(et, 'big')}
          <div class="note-label">Note finale</div>
          <div class="score-big">${U.nb(note)}<span>/20</span></div>
          <div class="appreciation">${appreciation(note)}</div>
          <div class="score-pct">${s.bonnes} bonne${s.bonnes > 1 ? 's' : ''} réponse${s.bonnes > 1 ? 's' : ''} sur ${total} · ${pct} %</div>
          ${record ? '<div class="badge record">🎖️ Nouveau record !</div>' : ''}
          <p class="result-msg">${message}</p>
          <div class="result-stats">
            <div><b>🔥 ${s.meilleureSerie}</b><span>meilleure série</span></div>
            <div><b>🏅 ${U.nb(etat.scores[ctx.cle].meilleureNote)}/20</b><span>record</span></div>
            <div><b>🎮 ${etat.scores[ctx.cle].parties}</b><span>parties</span></div>
          </div>
          <div class="actions wrap">
            <button type="button" class="btn primary big" id="rejouer">🔄 Rejouer</button>
            <a class="btn" href="${ctx.base}/flashcards">🃏 Flashcards</a>
            <a class="btn" href="#/${ctx.niveau.id}/${ctx.module.id}">← Thèmes</a>
          </div>
        </section>
        ${graphiqueProgression(historique, etat.scores[ctx.cle].parties, ctx.theme.couleur)}
        ${erreurs ? `<section class="panel"><h2>À retenir (${s.erreurs.length})</h2><ul class="erreurs">${erreurs}</ul></section>` : ''}`,
        filDe(ctx, 'Résultat'));

      $('#rejouer').addEventListener('click', () => lancerQuiz(ctx, opts));
      if (et === 3) confettis();
    }
  }

  /* ---------------- Flashcards ---------------- */
  function lancerFlash(ctx, opts, cartesImposees) {
    const revision = !!cartesImposees;
    const cartes = cartesImposees || U.shuffle(ctx.theme.flashcards(opts)).slice(0, opts.cartes || undefined);
    const s = { i: 0, sues: [], aRevoir: [] };
    afficherCarte();

    function afficherCarte() {
      const c = cartes[s.i];
      const n = cartes.length;
      const taille = t => (t.length > 90 ? 'xlong' : t.length > 30 ? 'long' : '');
      ecran(`
        <section class="panel flash" style="--c:${ctx.theme.couleur}">
          <div class="bar-top">
            <span class="muted">Carte <b>${s.i + 1}</b> / ${n}${revision ? ' · révision' : ''}</span>
            <span class="pills">
              <span class="pill" title="Je savais">😀 ${s.sues.length}</span>
              <span class="pill" title="À revoir">😕 ${s.aRevoir.length}</span>
            </span>
          </div>
          <div class="progress"><div style="width:${(s.i / n) * 100}%"></div></div>
          <div class="flashcard" tabindex="0" role="button" aria-label="Retourner la carte">
            <div class="flashcard-inner">
              <div class="face front">
                <span class="face-label">Question</span>
                <div class="face-text ${taille(c.recto)}">${texte(c.recto)}</div>
                <span class="hint">Touche la carte pour voir la réponse 🔄</span>
              </div>
              <div class="face back">
                <span class="face-label">Réponse</span>
                <div class="face-text ${taille(c.verso)}">${texte(c.verso)}</div>
                ${c.astuce ? `<div class="astuce">💡 ${texte(c.astuce)}</div>` : ''}
              </div>
            </div>
          </div>
          <div class="actions flash-actions" hidden>
            <button type="button" class="btn ko big" id="revoir">😕 À revoir</button>
            <button type="button" class="btn ok big" id="savais">😀 Je savais !</button>
          </div>
        </section>`,
        filDe(ctx, 'Flashcards'));

      const $carte = $('.flashcard');
      const $actions = $('.flash-actions');
      let retournee = false, note = false;

      function retourner() {
        retournee = !retournee;
        $carte.classList.toggle('flipped', retournee);
        if (retournee) $actions.hidden = false;
      }
      function noter(su) {
        if (!retournee || note) return;
        note = true;
        (su ? s.sues : s.aRevoir).push(c);
        s.i++;
        if (s.i < n) afficherCarte();
        else fin();
      }

      $carte.addEventListener('click', retourner);
      $('#revoir').addEventListener('click', () => noter(false));
      $('#savais').addEventListener('click', () => noter(true));
      surTouche(e => {
        if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); retourner(); }
        else if (e.key === 'ArrowLeft') noter(false);
        else if (e.key === 'ArrowRight') noter(true);
      });
      $carte.focus({ preventScroll: true });
    }

    function fin() {
      const total = cartes.length;
      if (!revision) {
        etat.flash[ctx.cle] = { sues: s.sues.length, total };
        sauver();
      }
      const pct = Math.round((s.sues.length / total) * 100);
      const liste = s.aRevoir.map(c => `
        <li><b>${texte(c.recto)}</b><span class="muted"> → ${texte(c.verso)}</span></li>`).join('');

      ecran(`
        <section class="panel result" style="--c:${ctx.theme.couleur}">
          <div class="result-emoji">${pct === 100 ? '🏆' : pct >= 70 ? '😀' : '💪'}</div>
          <div class="score-big">${s.sues.length} <span>/ ${total}</span></div>
          <p class="result-msg">${pct === 100
            ? 'Tu connais toutes les cartes ! Lance-toi dans le quiz.'
            : `Encore ${s.aRevoir.length} carte${s.aRevoir.length > 1 ? 's' : ''} à revoir. Tu peux les réviser maintenant !`}</p>
          <div class="actions wrap">
            ${s.aRevoir.length ? `<button type="button" class="btn primary big" id="revoir-tout">🔁 Revoir les ${s.aRevoir.length} carte${s.aRevoir.length > 1 ? 's' : ''}</button>` : ''}
            <button type="button" class="btn ${s.aRevoir.length ? '' : 'primary big'}" id="nouvelles">🃏 Nouvelles cartes</button>
            <a class="btn" href="${ctx.base}/quiz">🎯 Faire le quiz</a>
            <a class="btn" href="#/${ctx.niveau.id}/${ctx.module.id}">← Thèmes</a>
          </div>
        </section>
        ${liste ? `<section class="panel"><h2>Cartes à revoir</h2><ul class="erreurs">${liste}</ul></section>` : ''}`,
        filDe(ctx, 'Flashcards'));

      const $rev = $('#revoir-tout');
      if ($rev) $rev.addEventListener('click', () => lancerFlash(ctx, opts, U.shuffle(s.aRevoir)));
      $('#nouvelles').addEventListener('click', () => lancerFlash(ctx, opts));
      if (pct === 100 && !revision) confettis();
    }
  }

  /* ---------------- Routeur ---------------- */
  function router() {
    const [nivId, modId, themeId, mode] = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!nivId) return vueNiveaux();

    const niveau = CATALOGUE.niveaux.find(n => n.id === nivId);
    const module = niveau && modId ? niveau.modules.find(m => m.id === modId) : null;
    const theme = module && themeId ? module.themes.find(t => t.id === themeId) : null;
    const ctx = { niveau, module, theme };

    if (!niveau || !niveau.modules.length || (modId && !module) || (themeId && !theme)) {
      location.hash = '#/';
      return;
    }
    if (!module) return vueModules(ctx);
    if (!theme) return vueThemes(ctx);

    ctx.cle = `${niveau.id}/${module.id}/${theme.id}`;
    ctx.base = `#/${ctx.cle}`;
    vueDepart(ctx, mode === 'flashcards' ? 'flashcards' : 'quiz');
  }

  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Effacer tous tes scores et ta progression ?')) return;
    etat.scores = {};
    etat.flash = {};
    etat.bonnes = 0;
    sauver();
    router();
  });

  window.addEventListener('hashchange', router);
  majTotal();
  router();
})();
