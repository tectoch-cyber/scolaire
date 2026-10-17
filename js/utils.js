/* Outils partagés par les contenus et l'application. */
window.U = {
  rand(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1));
  },

  pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  arrondi(x, d = 3) {
    const p = Math.pow(10, d);
    return Math.round(x * p) / p + 0; // + 0 : transforme -0 en 0
  },

  /** Formate un nombre à la française : 1 234,5 */
  nb(x) {
    return U.arrondi(x).toLocaleString('fr-FR', { maximumFractionDigits: 3 });
  },

  decimales(x) {
    const s = String(U.arrondi(x));
    const i = s.indexOf('.');
    return i < 0 ? 0 : s.length - i - 1;
  },

  /** Construit une question QCM : la bonne réponse + jusqu'à 3 pièges, mélangés. */
  qcm(enonce, bonne, faux, explication) {
    const b = String(bonne);
    const vus = new Set([b]);
    const f = [];
    for (const x of faux) {
      const s = String(x);
      if (!vus.has(s)) { vus.add(s); f.push(s); }
      if (f.length === 3) break;
    }
    const choix = U.shuffle([b, ...f]);
    return { enonce, choix, bonne: choix.indexOf(b), explication };
  },

  /** QCM numérique : complète les pièges fournis avec des valeurs proches. */
  qcmNb(enonce, reponse, pieges, explication, unite = '') {
    const rep = U.arrondi(reponse);
    const pas = Math.pow(10, -U.decimales(rep));
    const candidats = U.shuffle(pieges).map(x => U.arrondi(x));
    for (const e of U.shuffle([1, -1, 2, -2, 10, -10, 3, -3, 5, -5])) {
      candidats.push(U.arrondi(rep + e * pas));
    }
    const faux = [];
    for (const c of candidats) {
      if (Number.isFinite(c) && c >= 0 && c !== rep && !faux.includes(c)) faux.push(c);
      if (faux.length === 3) break;
    }
    const fmt = x => U.nb(x) + unite;
    return U.qcm(enonce, fmt(rep), faux.map(fmt), explication);
  },

  /** Génère n questions sans doublon d'énoncé. */
  uniques(n, gen) {
    const out = [];
    const vus = new Set();
    for (let essais = 0; out.length < n && essais < n * 50; essais++) {
      const q = gen();
      if (!vus.has(q.enonce)) { vus.add(q.enonce); out.push(q); }
    }
    return out;
  },

  /**
   * Question « remettre dans l'ordre » : les mots sont proposés mélangés,
   * l'élève les touche dans l'ordre. joindre(solution) donne le texte de la bonne réponse.
   */
  ordre(enonce, solution, explication, joindre = mots => mots.join(' · ')) {
    let mots = U.shuffle(solution);
    for (let i = 0; i < 20 && mots.join('|') === solution.join('|'); i++) mots = U.shuffle(solution);
    return { type: 'ordre', enonce, mots, solution, reponse: joindre(solution), joindre, explication };
  },

  /** Recompose une phrase à partir de ses mots (pas d'espace avant le point). */
  phrase(mots) {
    return mots.join(' ').replace(/ \./g, '.').replace(/ ([?!])/g, ' $1');
  },

  /** Texte de la bonne réponse, quel que soit le type de question. */
  bonneReponse(q) {
    return q.type === 'ordre' ? q.reponse : q.choix[q.bonne];
  },

  /** Transforme une question en flashcard. */
  versCarte(q) {
    const recto = q.type === 'ordre' ? `${q.enonce}\n${q.mots.join(' · ')}` : q.enonce;
    return { recto, verso: U.bonneReponse(q), astuce: q.explication };
  },
};
