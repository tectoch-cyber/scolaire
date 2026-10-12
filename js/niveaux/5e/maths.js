/* 5e — Mathématiques */
(function () {
  'use strict';
  const { rand, pick, nb, qcm, qcmNb, shuffle } = U;

  /* ---------- Nombres relatifs : écriture et QCM ---------- */
  const rel = n => (n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0');
  const par = n => `(${rel(n)})`;
  const nonNul = (min, max) => { let n; do { n = rand(min, max); } while (n === 0); return n; };

  /* ---------- Fractions ---------- */
  const pgcd = (a, b) => (b ? pgcd(b, a % b) : a);

  /** Complément d'explication quand une fraction n/d se simplifie (ex. « , soit 1/2 »). */
  function simplification(n, d) {
    const g = pgcd(n, d);
    if (g === 1) return '';
    return d / g === 1 ? `, soit ${n / g}` : `, qu'on peut simplifier en ${n / g}/${d / g}`;
  }

  /** QCM sur des entiers relatifs (réponses positives ou négatives). */
  function qcmRel(enonce, rep, pieges, explication) {
    const faux = [];
    for (const c of shuffle(pieges).concat(shuffle([rep + 1, rep - 1, rep + 2, rep - 2]))) {
      if (Number.isInteger(c) && c !== rep && !faux.includes(c)) faux.push(c);
      if (faux.length === 3) break;
    }
    return qcm(enonce, rel(rep), faux.map(rel), explication);
  }

  /* ================================================================
   * 1. Tables de multiplication (révision)
   * ================================================================ */
  const tables = COMMUNS.themeTables({
    valeurs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    defaut: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  });

  /* ================================================================
   * 2. Calcul rapide
   * ================================================================ */
  const generateursCalcul = [
    function relatifsAddition() {
      const a = nonNul(-15, 15), b = nonNul(-15, 15), rep = a + b;
      const da = Math.abs(a), db = Math.abs(b);
      const expl = (a > 0) === (b > 0)
        ? `Même signe : on additionne les distances à zéro (${da} + ${db} = ${da + db}) et on garde le signe : ${rel(rep)}.`
        : `Signes contraires : on soustrait les distances à zéro (${Math.max(da, db)} − ${Math.min(da, db)} = ${Math.abs(rep)}) et on prend le signe du nombre le plus éloigné de zéro : ${rel(rep)}.`;
      return qcmRel(`${par(a)} + ${par(b)} = ?`, rep, [-rep, a - b, b - a, da + db], expl);
    },

    function relatifsSoustraction() {
      const a = nonNul(-12, 12), b = nonNul(-12, 12), rep = a - b;
      return qcmRel(`${par(a)} − ${par(b)} = ?`, rep, [a + b, -rep, -(a + b)],
        `Soustraire un nombre, c'est ajouter son opposé : ${par(a)} + ${par(-b)} = ${rel(rep)}.`);
    },

    function priorites() {
      const t = Math.random();
      if (t < 0.3) {
        const a = rand(2, 20), b = rand(2, 9), c = rand(2, 9), rep = a + b * c;
        return qcmNb(`${a} + ${b} × ${c} = ?`, rep, [(a + b) * c, a + b + c],
          `La multiplication est prioritaire : ${b} × ${c} = ${b * c}, puis ${a} + ${b * c} = ${rep}.`);
      }
      if (t < 0.55) {
        const a = rand(2, 9), b = rand(3, 9), c = rand(1, a * b - 1), rep = a * b - c;
        return qcmNb(`${a} × ${b} − ${c} = ?`, rep, [a * (b - c), rep + 10],
          `La multiplication d'abord : ${a} × ${b} = ${a * b}, puis ${a * b} − ${c} = ${rep}.`);
      }
      if (t < 0.8) {
        const a = rand(2, 12), b = rand(2, 9), c = rand(2, 9), rep = (a + b) * c;
        return qcmNb(`(${a} + ${b}) × ${c} = ?`, rep, [a + b * c, a * c + b],
          `Les parenthèses d'abord : ${a} + ${b} = ${a + b}, puis ${a + b} × ${c} = ${rep}.`);
      }
      const a = rand(20, 50), b = rand(5, 15), c = rand(2, 9), rep = a - b + c;
      return qcmNb(`${a} − ${b} + ${c} = ?`, rep, [a - b - c, a + b + c],
        `Additions et soustractions se calculent de gauche à droite : ${a} − ${b} = ${a - b}, puis ${a - b} + ${c} = ${rep}.`);
    },

    function fractionQuantite() {
      const d = pick([3, 4, 5, 6, 8, 10]), k = rand(1, d - 1), n = d * rand(2, 12);
      const rep = (n / d) * k;
      return qcmNb(`${k}/${d} de ${n} = ?`, rep, [n / d, n * k, n - rep],
        `${n} ÷ ${d} = ${n / d}, puis ${n / d} × ${k} = ${rep}.`);
    },

    function simplifier() {
      const [a, b] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5], [1, 6], [5, 6],
        [2, 7], [3, 7], [3, 8], [5, 8], [7, 8], [2, 9], [4, 9], [5, 9], [3, 10], [7, 10]]);
      const k = rand(2, 9);
      const p = [2, 3].find(x => k % x === 0 && k !== x);
      const pieges = [`${b}/${a}`, `${a * k}/${b}`, `${a}/${b * k}`];
      if (p) pieges.unshift(`${(a * k) / p}/${(b * k) / p}`);
      return qcm(`Simplifie au maximum : ${a * k}/${b * k}`, `${a}/${b}`, pieges,
        `On divise le numérateur et le dénominateur par ${k} : ${a * k} ÷ ${k} = ${a} et ${b * k} ÷ ${k} = ${b}.`);
    },

    function additionFractions() {
      if (Math.random() < 0.5) {
        const d = rand(3, 12), a = rand(1, d - 1), b = rand(1, d - 1);
        return qcm(`${a}/${d} + ${b}/${d} = ?`, `${a + b}/${d}`,
          [`${a + b}/${2 * d}`, `${a * b}/${d}`, `${a + b + 1}/${d}`, `${a + b}/${d + 1}`],
          `Même dénominateur : on additionne les numérateurs et on garde le dénominateur : ${a + b}/${d}${simplification(a + b, d)}.`);
      }
      const d = rand(2, 6), m = pick([2, 3]), D = d * m, a = rand(1, d - 1), b = rand(1, D - 1);
      const n = a * m + b;
      return qcm(`${a}/${d} + ${b}/${D} = ?`, `${n}/${D}`,
        [`${a + b}/${d + D}`, `${a + b}/${D}`, `${n + 1}/${D}`],
        `On écrit ${a}/${d} avec le dénominateur ${D} : ${a}/${d} = ${a * m}/${D}. Puis ${a * m}/${D} + ${b}/${D} = ${n}/${D}${simplification(n, D)}.`);
    },

    function multiplierParDecimal() {
      const t = pick([0.1, 0.01, 0.5]);
      if (t === 0.5) {
        const x = rand(6, 99) * 2, rep = x / 2;
        return qcmNb(`${x} × 0,5 = ?`, rep, [x * 5, x * 2, rep + 5],
          `Multiplier par 0,5, c'est prendre la moitié : ${x} ÷ 2 = ${rep}.`);
      }
      const x = pick([rand(11, 999), rand(11, 999) / 10]), rep = x * t;
      return qcmNb(`${nb(x)} × ${nb(t)} = ?`, rep, [x * 10, rep / 10, x * 100],
        `Multiplier par ${nb(t)}, c'est diviser par ${t === 0.1 ? 10 : 100} : ${nb(rep)}.`);
    },

    function produitDecimaux() {
      const a = rand(2, 9), b = rand(2, 9), rep = (a * b) / 100;
      return qcmNb(`0,${a} × 0,${b} = ?`, rep, [(a * b) / 10, (a * b) / 1000],
        `${a} × ${b} = ${a * b}. Il y a 2 chiffres après la virgule en tout dans les facteurs, donc 2 dans le résultat : ${nb(rep)}.`);
    },

    function pourcentage() {
      const p = pick([10, 20, 25, 50, 75]);
      const n = p === 25 || p === 75 ? 4 * rand(3, 30) : p === 50 ? 2 * rand(5, 60) : 10 * rand(2, 30);
      const rep = (n * p) / 100;
      const expl = {
        10: `10 %, c'est diviser par 10 : ${n} ÷ 10 = ${rep}.`,
        20: `20 %, c'est 2 fois 10 % : ${n / 10} × 2 = ${rep}.`,
        25: `25 %, c'est le quart : ${n} ÷ 4 = ${rep}.`,
        50: `50 %, c'est la moitié : ${n} ÷ 2 = ${rep}.`,
        75: `75 %, c'est les trois quarts : ${n} ÷ 4 = ${n / 4}, puis × 3 = ${rep}.`,
      }[p];
      return qcmNb(`${p} % de ${n} = ?`, rep, [n - rep, (n * p) / 10, rep * 2], expl);
    },

    function divisibilite() {
      const d = pick([2, 3, 5, 9, 10]);
      const bon = d * rand(Math.ceil(100 / d), Math.floor(999 / d));
      const faux = [];
      if (d === 9) faux.push(3 * pick([37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107]));
      while (faux.length < 3) {
        const x = rand(100, 999);
        if (x % d !== 0 && !faux.includes(x)) faux.push(x);
      }
      const somme = String(bon).split('').map(Number);
      const regles = {
        2: `Un nombre est divisible par 2 si son chiffre des unités est 0, 2, 4, 6 ou 8 : c'est le cas de ${bon}.`,
        5: `Un nombre est divisible par 5 si son chiffre des unités est 0 ou 5 : c'est le cas de ${bon}.`,
        10: `Un nombre est divisible par 10 si son chiffre des unités est 0 : c'est le cas de ${bon}.`,
        3: `Divisible par 3 si la somme des chiffres est dans la table de 3 : ${somme.join(' + ')} = ${somme.reduce((s, x) => s + x, 0)}.`,
        9: `Divisible par 9 si la somme des chiffres est dans la table de 9 : ${somme.join(' + ')} = ${somme.reduce((s, x) => s + x, 0)}.`,
      };
      return qcm(`Lequel de ces nombres est divisible par ${d} ?`, String(bon), faux.map(String), regles[d]);
    },

    function expressionLitterale() {
      const k = rand(2, 9), c = rand(1, 9), x = rand(2, 9), rep = k * x + c;
      return qcmNb(`Calcule ${k}x + ${c} pour x = ${x}`, rep, [Number(`${k}${x}`) + c, k + x + c, k * (x + c)],
        `${k}x signifie ${k} × x : ${k} × ${x} + ${c} = ${k * x} + ${c} = ${rep}.`);
    },

    function angleTriangle() {
      const a = rand(20, 100), b = rand(20, 150 - a), rep = 180 - a - b;
      return qcmNb(`Un triangle a deux angles de ${a}° et ${b}°.\nCombien mesure le troisième ?`, rep,
        [360 - a - b, a + b, 90 - Math.min(a, b)],
        `La somme des angles d'un triangle vaut 180° : 180 − ${a} − ${b} = ${rep}°.`, '°');
    },
  ];

  const methodesCalcul = [
    { recto: 'Additionner deux relatifs de même signe', verso: 'On additionne les distances à zéro et on garde le signe.', astuce: '(−7) + (−5) = −12' },
    { recto: 'Additionner deux relatifs de signes contraires', verso: 'On soustrait les distances à zéro et on prend le signe du nombre le plus éloigné de zéro.', astuce: '(−9) + (+4) = −5' },
    { recto: 'Soustraire un nombre relatif', verso: 'Soustraire un nombre, c\'est ajouter son opposé.', astuce: '(+3) − (−5) = (+3) + (+5) = +8' },
    { recto: 'Priorités opératoires', verso: '1. Les parenthèses\n2. × et ÷\n3. + et −, de gauche à droite', astuce: '5 + 3 × 4 = 5 + 12 = 17' },
    { recto: 'Fractions égales', verso: 'On peut multiplier ou diviser le numérateur et le dénominateur par un même nombre (non nul).', astuce: '3/4 = 6/8 = 9/12' },
    { recto: 'Simplifier une fraction', verso: 'On divise le numérateur et le dénominateur par un même diviseur commun, jusqu\'à ne plus pouvoir.', astuce: '18/24 = 3/4 (÷ 6)' },
    { recto: 'Additionner deux fractions', verso: 'On les met au même dénominateur, puis on additionne les numérateurs.', astuce: '1/3 + 1/6 = 2/6 + 1/6 = 3/6' },
    { recto: 'Prendre une fraction d\'une quantité', verso: 'On divise par le dénominateur, puis on multiplie par le numérateur.', astuce: '3/5 de 40 = 40 ÷ 5 × 3 = 24' },
    { recto: 'Critères de divisibilité par 2, 5 et 10', verso: 'par 2 : unités 0, 2, 4, 6, 8\npar 5 : unités 0 ou 5\npar 10 : unités 0' },
    { recto: 'Critères de divisibilité par 3 et 9', verso: 'La somme des chiffres est divisible par 3 (ou par 9).', astuce: '387 : 3 + 8 + 7 = 18 → divisible par 3 et par 9' },
    { recto: 'Multiplier par 0,1 ou 0,01', verso: '× 0,1 = ÷ 10\n× 0,01 = ÷ 100', astuce: '45 × 0,1 = 4,5' },
    { recto: 'Multiplier deux décimaux', verso: 'On multiplie sans les virgules, puis on place autant de chiffres après la virgule qu\'il y en a en tout dans les facteurs.', astuce: '0,3 × 0,2 = 0,06' },
    { recto: 'Pourcentages faciles', verso: '10 % = ÷ 10\n25 % = ÷ 4\n50 % = ÷ 2\n75 % = ÷ 4 puis × 3' },
    { recto: 'Calculer une expression littérale', verso: 'On remplace la lettre par sa valeur. Attention : 3x signifie 3 × x.', astuce: '3x + 2 pour x = 5 : 3 × 5 + 2 = 17' },
    { recto: 'Somme des angles d\'un triangle', verso: '180°', astuce: '50° + 60° + 70° = 180°' },
  ];

  const calcul = COMMUNS.themeCalcul({
    description: 'Relatifs, priorités opératoires, fractions, divisibilité, pourcentages.',
    generateurs: generateursCalcul,
    methodes: methodesCalcul,
  });

  /* ================================================================
   * 3. Résolution de problèmes
   * ================================================================ */
  const banqueProblemes = [
    { q: 'Le matin, il fait −4 °C. Dans la journée, la température monte de 9 °C.\nQuelle température fait-il ?', r: '5 °C', f: ['−13 °C', '13 °C', '−5 °C'], e: '(−4) + (+9) = +5.' },
    { q: 'Un plongeur est à −25 m. Il remonte de 12 m.\nÀ quelle profondeur se trouve-t-il ?', r: '−13 m', f: ['−37 m', '13 m', '37 m'], e: '(−25) + (+12) = −13.' },
    { q: 'Il fait −12 °C à Moscou et 7 °C à Paris.\nQuel est l\'écart de température entre les deux villes ?', r: '19 °C', f: ['5 °C', '−19 °C', '12 °C'], e: 'Écart = 7 − (−12) = 7 + 12 = 19 °C.' },
    { q: 'Un ascenseur est au 3e étage. Il descend de 5 étages, puis monte de 7.\nOù est-il ?', r: '5e étage', f: ['1er étage', '15e étage', '2e sous-sol'], e: '3 − 5 + 7 = 5.' },
    { q: '4 stylos coûtent 6 €.\nCombien coûtent 10 stylos ?', r: '15 €', f: ['12 €', '24 €', '20 €'], e: '1 stylo : 6 ÷ 4 = 1,50 €.\n10 stylos : 1,50 × 10 = 15 €.' },
    { q: 'Une recette pour 6 personnes demande 250 g de farine.\nCombien en faut-il pour 9 personnes ?', r: '375 g', f: ['500 g', '253 g', '400 g'], e: '9 personnes = 6 personnes × 1,5.\n250 × 1,5 = 375 g.' },
    { q: 'Dans un collège, 40 % des 30 élèves d\'une classe sont demi-pensionnaires.\nCombien sont-ils ?', r: '12 élèves', f: ['18 élèves', '10 élèves', '14 élèves'], e: '30 × 40 ÷ 100 = 12.' },
    { q: 'Un jean coûte 45 €. Il est soldé à −20 %.\nQuel est son nouveau prix ?', r: '36 €', f: ['25 €', '9 €', '40 €'], e: 'Réduction : 45 × 20 ÷ 100 = 9 €.\nNouveau prix : 45 − 9 = 36 €.' },
    { q: 'Un abonnement à 80 € augmente de 15 %.\nQuel est le nouveau prix ?', r: '92 €', f: ['95 €', '12 €', '68 €'], e: 'Augmentation : 80 × 15 ÷ 100 = 12 €.\nNouveau prix : 80 + 12 = 92 €.' },
    { q: 'Sur une carte à l\'échelle 1/25 000, deux points sont à 4 cm.\nQuelle est la distance réelle ?', r: '1 km', f: ['100 m', '10 km', '25 km'], e: '4 × 25 000 = 100 000 cm = 1 000 m = 1 km.' },
    { q: 'Une voiture roule à 90 km/h pendant 2 h 30 min.\nQuelle distance parcourt-elle ?', r: '225 km', f: ['180 km', '200 km', '270 km'], e: 'En 2 h : 180 km. En 30 min (une demi-heure) : 45 km.\n180 + 45 = 225 km.' },
    { q: 'Un coureur parcourt 10 km en 50 min.\nQuelle est sa vitesse moyenne ?', r: '12 km/h', f: ['5 km/h', '20 km/h', '10 km/h'], e: 'En 10 min : 2 km. En 60 min : 2 × 6 = 12 km.\nVitesse : 12 km/h.' },
    { q: 'Un triangle a une base de 8 cm et une hauteur de 5 cm.\nQuelle est son aire ?', r: '20 cm²', f: ['40 cm²', '13 cm²', '26 cm²'], e: 'Aire = base × hauteur ÷ 2 = 8 × 5 ÷ 2 = 20 cm².' },
    { q: 'Un parallélogramme a une base de 7 cm et une hauteur de 4 cm.\nQuelle est son aire ?', r: '28 cm²', f: ['14 cm²', '22 cm²', '11 cm²'], e: 'Aire = base × hauteur = 7 × 4 = 28 cm².' },
    { q: 'Un cercle a un rayon de 5 cm. On prend π ≈ 3,14.\nQuelle est la longueur du cercle (son périmètre) ?', r: '31,4 cm', f: ['15,7 cm', '78,5 cm', '62,8 cm'], e: 'Périmètre = 2 × π × r = 2 × 3,14 × 5 = 31,4 cm.' },
    { q: 'Un disque a un rayon de 10 cm. On prend π ≈ 3,14.\nQuelle est son aire ?', r: '314 cm²', f: ['62,8 cm²', '31,4 cm²', '628 cm²'], e: 'Aire = π × r × r = 3,14 × 10 × 10 = 314 cm².' },
    { q: 'Une boîte a la forme d\'un pavé droit de 5 cm × 4 cm × 3 cm.\nQuel est son volume ?', r: '60 cm³', f: ['12 cm³', '94 cm³', '600 cm³'], e: 'Volume = L × l × h = 5 × 4 × 3 = 60 cm³.' },
    { q: 'Un aquarium mesure 50 cm × 30 cm × 40 cm.\nQuelle quantité d\'eau peut-il contenir ?', r: '60 L', f: ['6 L', '600 L', '120 L'], e: '50 × 30 × 40 = 60 000 cm³.\n1 L = 1 000 cm³, donc 60 L.' },
    { q: 'Un triangle isocèle a un angle principal de 40°.\nCombien mesure chacun des deux autres angles ?', r: '70°', f: ['140°', '40°', '50°'], e: '180 − 40 = 140°.\nLes deux angles à la base sont égaux : 140 ÷ 2 = 70°.' },
    { q: 'Dans un triangle rectangle, un des angles aigus mesure 35°.\nCombien mesure l\'autre angle aigu ?', r: '55°', f: ['145°', '65°', '45°'], e: '180 − 90 − 35 = 55°.' },
    { q: 'Léo a eu 11, 14, 8 et 15 à ses contrôles.\nQuelle est sa moyenne ?', r: '12', f: ['48', '11,5', '13'], e: '11 + 14 + 8 + 15 = 48.\n48 ÷ 4 = 12.' },
    { q: 'Inès a eu 10 et 13. Elle veut 12 de moyenne sur trois notes.\nQuelle note doit-elle avoir au 3e contrôle ?', r: '13', f: ['12', '11,5', '14'], e: 'Pour 12 de moyenne sur 3 notes, il faut 12 × 3 = 36 points.\n36 − 10 − 13 = 13.' },
    { q: 'Jeanne a 60 €. Elle dépense 1/3 de cette somme en livres et 1/4 en sorties.\nCombien lui reste-t-il ?', r: '25 €', f: ['30 €', '35 €', '40 €'], e: 'Livres : 60 ÷ 3 = 20 €. Sorties : 60 ÷ 4 = 15 €.\nReste : 60 − 20 − 15 = 25 €.' },
    { q: 'Dans une classe de 25 élèves, 3/5 sont des filles.\nCombien y a-t-il de garçons ?', r: '10 garçons', f: ['15 garçons', '5 garçons', '20 garçons'], e: 'Filles : 25 ÷ 5 × 3 = 15.\nGarçons : 25 − 15 = 10.' },
    { q: 'Un sac contient 3 billes rouges, 5 bleues et 2 vertes. On tire une bille au hasard.\nQuelle est la probabilité de tirer une bille bleue ?', r: '1/2', f: ['1/5', '5/3', '3/10'], e: '5 billes bleues sur 10 billes : 5/10 = 1/2.' },
    { q: 'On lance un dé à 6 faces.\nQuelle est la probabilité d\'obtenir un multiple de 3 ?', r: '1/3', f: ['1/6', '1/2', '2/3'], e: 'Multiples de 3 : 3 et 6, soit 2 cas sur 6.\n2/6 = 1/3.' },
    { q: 'Un sirop se prépare avec 1 volume de sirop pour 7 volumes d\'eau.\nQuelle quantité de sirop faut-il pour 2 L de boisson ?', r: '25 cL', f: ['2,5 cL', '20 cL', '28 cL'], e: '1 + 7 = 8 parts en tout.\n2 L ÷ 8 = 0,25 L = 25 cL.' },
    { q: 'Une location de vélo coûte 5 € plus 2 € par heure.\nCombien coûtent 4 heures ?', r: '13 €', f: ['28 €', '11 €', '20 €'], e: '5 + 2 × 4 = 5 + 8 = 13 €.' },
    { q: 'Programme de calcul : choisis 6, multiplie par 3, ajoute 4, puis divise par 2.\nQuel résultat obtiens-tu ?', r: '11', f: ['20', '22', '13'], e: '6 × 3 = 18 ; 18 + 4 = 22 ; 22 ÷ 2 = 11.' },
    { q: 'Un champ mesure 2,5 ha.\nCombien cela fait-il en m² ?', r: '25 000 m²', f: ['2 500 m²', '250 000 m²', '250 m²'], e: '1 ha = 10 000 m².\n2,5 × 10 000 = 25 000 m².' },
    { q: 'Une table rectangulaire mesure 2,5 m sur 1,2 m.\nQuel est son périmètre ?', r: '7,4 m', f: ['3,7 m', '3 m', '8,4 m'], e: '(2,5 + 1,2) × 2 = 3,7 × 2 = 7,4 m.' },
  ];

  const methodesProblemes = [
    { recto: 'Proportionnalité : passage à l\'unité', verso: 'On calcule la valeur pour 1, puis on multiplie.', astuce: '4 stylos → 6 € ; 1 stylo → 1,50 € ; 10 stylos → 15 €' },
    { recto: 'Proportionnalité : coefficient', verso: 'On multiplie toutes les valeurs par le même nombre.', astuce: '6 → 9 personnes : × 1,5' },
    { recto: 'Appliquer un pourcentage', verso: 'p % de x = x × p ÷ 100', astuce: '40 % de 30 = 30 × 40 ÷ 100 = 12' },
    { recto: 'Réduction et augmentation', verso: 'On calcule le pourcentage, puis on l\'enlève (réduction) ou on l\'ajoute (augmentation).', astuce: '45 € −20 % : 45 − 9 = 36 €' },
    { recto: 'Utiliser une échelle', verso: 'Distance réelle = distance sur le plan × dénominateur de l\'échelle (même unité).', astuce: '1/25 000 : 4 cm → 100 000 cm = 1 km' },
    { recto: 'Écart entre deux relatifs', verso: 'On soustrait le plus petit au plus grand.', astuce: '7 − (−12) = 19' },
    { recto: 'Aire d\'un triangle', verso: 'base × hauteur ÷ 2' },
    { recto: 'Aire d\'un parallélogramme', verso: 'base × hauteur' },
    { recto: 'Périmètre d\'un cercle', verso: '2 × π × rayon\n(ou π × diamètre)' },
    { recto: 'Aire d\'un disque', verso: 'π × rayon × rayon' },
    { recto: 'Volume d\'un pavé droit', verso: 'longueur × largeur × hauteur' },
    { recto: 'Volumes et contenances', verso: '1 dm³ = 1 L\n1 000 cm³ = 1 L\n1 m³ = 1 000 L' },
    { recto: 'Aires : hectare', verso: '1 ha = 10 000 m²\n1 m² = 100 dm²' },
    { recto: 'Angles d\'un triangle', verso: 'Leur somme vaut 180°.\nTriangle isocèle : les deux angles à la base sont égaux.' },
    { recto: 'Calculer une moyenne', verso: 'Somme des valeurs ÷ nombre de valeurs.', astuce: '(11 + 14 + 8 + 15) ÷ 4 = 12' },
    { recto: 'Calculer une probabilité', verso: 'nombre de cas favorables ÷ nombre de cas possibles', astuce: 'Dé : obtenir 3 ou 6 → 2/6 = 1/3' },
    { recto: 'Programme de calcul', verso: 'On applique les étapes dans l\'ordre, en notant chaque résultat intermédiaire.' },
  ];

  const problemes = COMMUNS.themeProblemes({
    description: 'Relatifs, proportionnalité, pourcentages, aires et volumes, angles, probabilités.',
    banque: banqueProblemes,
    methodes: methodesProblemes,
  });

  CATALOGUE.ajouterModule('5e', {
    id: 'maths',
    nom: 'Mathématiques',
    icone: '🔢',
    couleur: '#ef4444',
    themes: [tables, calcul, problemes],
  });
})();
