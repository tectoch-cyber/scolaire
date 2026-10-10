/*
 * Fabriques de thèmes partagées entre les niveaux.
 * Chaque niveau ne fournit que son contenu (tables proposées, générateurs, problèmes…).
 */
window.COMMUNS = (function () {
  'use strict';
  const { rand, pick, qcm, qcmNb, uniques, shuffle, versCarte } = U;

  /** Tous les couples [table, multiplicateur] de ×1 à ×10. */
  function produits(listeTables) {
    const liste = [];
    for (const a of listeTables) {
      for (let b = 1; b <= 10; b++) liste.push([a, b]);
    }
    return liste;
  }

  /**
   * Tables de multiplication : chaque produit des tables choisies, tiré sans remise.
   * division: false → pas de questions avec le signe ÷ (avant le CM1).
   */
  function themeTables({ valeurs, defaut, division = true }) {
    return {
      id: 'tables',
      nom: 'Tables de multiplication',
      icone: '✖️',
      couleur: '#f97316',
      description: division
        ? 'Produits, facteurs manquants et divisions, de ×1 à ×10.'
        : 'Produits et facteurs manquants, de ×1 à ×10.',
      toutes: true,
      options: [
        { id: 'tables', type: 'multi', label: 'Quelles tables ?', valeurs, defaut },
      ],

      quiz(n, o) {
        return shuffle(produits(o.tables)).slice(0, n).map(([table, b]) => {
          let a = table;
          const p = a * b;
          const t = Math.random();
          if (t < 0.65 || (!division && t < 0.8)) {
            if (Math.random() < 0.5) [a, b] = [b, a];
            const inverse = Number(String(p).split('').reverse().join(''));
            return qcmNb(`${a} × ${b} = ?`, p,
              [p + a, p - a, p + b, p - b, (a + 1) * b, a * (b + 1), inverse],
              `${a} × ${b} = ${p}`);
          }
          if (t < 0.85 || !division) {
            return qcmNb(`${a} × ? = ${p}`, b, [b + 1, b - 1, b + 2, a],
              `${a} × ${b} = ${p}, donc le nombre manquant est ${b}.`);
          }
          return qcmNb(`${p} ÷ ${a} = ?`, b, [b + 1, b - 1, b + 2, b - 2],
            `${a} × ${b} = ${p}, donc ${p} ÷ ${a} = ${b}.`);
        });
      },

      flashcards(o) {
        return produits(o.tables).map(([a, b]) => ({ recto: `${a} × ${b}`, verso: String(a * b) }));
      },
    };
  }

  /** Calcul rapide : générateurs aléatoires + fiches d'astuces. */
  function themeCalcul({ description, generateurs, methodes, chronoDefaut = 15 }) {
    return {
      id: 'calcul',
      nom: 'Calcul rapide',
      icone: '⚡',
      couleur: '#0ea5e9',
      description,
      options: [
        { id: 'chrono', type: 'choix', mode: 'quiz', label: 'Chrono par question', valeurs: [0, 10, 15, 30], libelles: ['Sans', '10 s', '15 s', '30 s'], defaut: chronoDefaut },
      ],

      quiz(n) {
        return uniques(n, () => pick(generateurs)());
      },

      flashcards() {
        const exemples = uniques(8, () => pick(generateurs)()).map(versCarte);
        return methodes.concat(exemples);
      },
    };
  }

  /** Résolution de problèmes : banque d'énoncés { q, r, f, e } + fiches méthode. */
  function themeProblemes({ description, banque, methodes }) {
    const versQcm = p => qcm(p.q, p.r, p.f, p.e);
    return {
      id: 'problemes',
      nom: 'Résolution de problèmes',
      icone: '🧩',
      couleur: '#10b981',
      description,
      toutes: true,

      quiz(n) {
        return shuffle(banque).slice(0, n).map(versQcm);
      },

      flashcards() {
        const exemples = shuffle(banque).slice(0, 8).map(p => versCarte(versQcm(p)));
        return methodes.concat(exemples);
      },
    };
  }

  return { themeTables, themeCalcul, themeProblemes };
})();
