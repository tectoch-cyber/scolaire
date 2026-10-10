/* CM2 — Mathématiques */
(function () {
  'use strict';
  const { rand, pick, nb, qcmNb } = U;

  /* ================================================================
   * 1. Tables de multiplication
   * ================================================================ */
  const tables = COMMUNS.themeTables({
    valeurs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    defaut: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  });

  /* ================================================================
   * 2. Calcul rapide (calcul mental)
   * ================================================================ */
  const generateursCalcul = [
    function addition() {
      const a = rand(15, 89);
      const dz = rand(1, 7) * 10, u = rand(1, 9), b = dz + u;
      const rep = a + b;
      return qcmNb(`${a} + ${b} = ?`, rep, [rep + 10, rep - 10, rep + 1, rep - 1],
        `On ajoute d'abord les dizaines puis les unités : ${a} + ${dz} = ${a + dz}, puis ${a + dz} + ${u} = ${rep}.`);
    },

    function soustraction() {
      const a = rand(50, 99);
      let b;
      do { b = rand(11, a - 10); } while (b % 10 === 0);
      const rep = a - b, dz = b - (b % 10), u = b % 10;
      const erreur = (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + Math.abs((a % 10) - u);
      return qcmNb(`${a} − ${b} = ?`, rep, [erreur, rep + 10, rep - 10],
        `On enlève d'abord les dizaines puis les unités : ${a} − ${dz} = ${a - dz}, puis ${a - dz} − ${u} = ${rep}.`);
    },

    function multiplierPar10() {
      const k = pick([10, 100, 1000]);
      const x = pick([rand(2, 99), rand(11, 999) / 10, rand(101, 9999) / 100]);
      const rangs = String(k).length - 1;
      const rep = x * k;
      return qcmNb(`${nb(x)} × ${nb(k)} = ?`, rep, [rep * 10, rep / 10, x + k],
        `Multiplier par ${nb(k)}, c'est rendre chaque chiffre ${nb(k)} fois plus grand : la virgule se décale de ${rangs} rang${rangs > 1 ? 's' : ''} vers la droite (on ajoute des zéros si besoin).`);
    },

    function diviserPar10() {
      const k = pick([10, 100]);
      const x = pick([rand(20, 999), rand(101, 9999)]);
      const rangs = String(k).length - 1;
      const rep = x / k;
      return qcmNb(`${nb(x)} ÷ ${k} = ?`, rep, [rep * 10, rep / 10],
        `Diviser par ${k}, c'est rendre chaque chiffre ${k} fois plus petit : la virgule se décale de ${rangs} rang${rangs > 1 ? 's' : ''} vers la gauche.`);
    },

    function doubleMoitie() {
      if (Math.random() < 0.5) {
        const x = rand(13, 99), dz = x - (x % 10), u = x % 10, rep = 2 * x;
        return qcmNb(`Le double de ${x} = ?`, rep, [rep + 10, rep - 10, x + 2],
          `Double de ${dz} = ${2 * dz}, double de ${u} = ${2 * u}, donc ${2 * dz} + ${2 * u} = ${rep}.`);
      }
      const x = rand(15, 198), rep = x / 2, a = Math.floor(x / 20) * 20, b = x - a;
      const expl = a > 0 && b > 0
        ? `${x} = ${a} + ${b}. Moitié de ${a} = ${a / 2}, moitié de ${b} = ${nb(b / 2)}, donc ${nb(rep)}.`
        : `${x} ÷ 2 = ${nb(rep)}.`;
      return qcmNb(`La moitié de ${x} = ?`, rep, [rep + 5, rep - 5, rep + 10, x * 2], expl);
    },

    function complement() {
      if (Math.random() < 0.6) {
        let x;
        do { x = rand(11, 89); } while (x % 10 === 0);
        const rep = 100 - x;
        const erreur = (10 - Math.floor(x / 10)) * 10 + (10 - (x % 10));
        return qcmNb(`${x} + ? = 100`, rep, [erreur, rep + 10, rep - 10],
          `${x} + ${rep} = 100. Astuce : les unités font 10 (${x % 10} + ${rep % 10}) et les dizaines font 9 (${Math.floor(x / 10)} + ${Math.floor(rep / 10)}).`);
      }
      let x;
      do { x = rand(11, 99) * 10; } while (x % 100 === 0);
      const rep = 1000 - x;
      return qcmNb(`${x} + ? = 1 000`, rep, [rep + 100, rep - 100, rep + 10],
        `${x} + ${rep} = 1 000. Les dizaines font 10 et les centaines font 9.`);
    },

    function astuceMultiplication() {
      const t = pick([5, 9, 11, 25]);
      let x, expl;
      if (t === 5) {
        x = rand(12, 98);
        expl = `× 5, c'est × 10 puis ÷ 2 : ${x} × 10 = ${x * 10}, puis ${x * 10} ÷ 2 = ${x * 5}.`;
      } else if (t === 9) {
        x = rand(12, 49);
        expl = `× 9, c'est × 10 puis on enlève le nombre une fois : ${x * 10} − ${x} = ${x * 9}.`;
      } else if (t === 11) {
        x = rand(12, 49);
        expl = `× 11, c'est × 10 puis on ajoute le nombre une fois : ${x * 10} + ${x} = ${x * 11}.`;
      } else {
        x = rand(2, 12) * 4;
        expl = `× 25, c'est × 100 puis ÷ 4 : ${x * 100} ÷ 4 = ${x * 25}.`;
      }
      const rep = x * t;
      return qcmNb(`${x} × ${t} = ?`, rep, [rep + x, rep - x, rep + 10, rep - 10], expl);
    },

    function additionDecimaux() {
      const a = rand(11, 99) / 10, b = rand(11, 99) / 10, rep = a + b;
      const ua = Math.floor(a), ub = Math.floor(b);
      const da = Math.round(a * 10) % 10, db = Math.round(b * 10) % 10;
      const pieges = [rep + 1, rep - 1];
      if (da + db >= 10) pieges.unshift(Number(`${ua + ub}.${da + db}`));
      return qcmNb(`${nb(a)} + ${nb(b)} = ?`, rep, pieges,
        `Unités : ${ua} + ${ub} = ${ua + ub}. Dixièmes : ${da} + ${db} = ${da + db}${da + db >= 10 ? ' (10 dixièmes = 1 unité)' : ''}. Résultat : ${nb(rep)}.`);
    },

    function ajoutRetrait() {
      const v = pick([9, 19, 99, 11, 21]);
      const r = Math.round(v / 10) * 10;
      const d = r - v; // +1 ou -1
      const x = rand(120, 899);
      if (Math.random() < 0.5) {
        const rep = x + v;
        return qcmNb(`${x} + ${v} = ?`, rep, [rep + 1, rep - 1, rep + 2],
          `Ajouter ${v}, c'est ajouter ${r} puis ${d > 0 ? 'enlever' : 'ajouter'} 1 : ${x} + ${r} = ${x + r}, puis ${rep}.`);
      }
      const rep = x - v;
      return qcmNb(`${x} − ${v} = ?`, rep, [rep + 1, rep - 1, rep - 2],
        `Enlever ${v}, c'est enlever ${r} puis ${d > 0 ? 'ajouter' : 'enlever'} 1 : ${x} − ${r} = ${x - r}, puis ${rep}.`);
    },

    function sommeMaline() {
      const [p, q] = pick([[25, 75], [36, 64], [45, 55], [18, 82], [47, 53], [12, 88]]);
      const c = rand(11, 89);
      const rep = 100 + c;
      return qcmNb(`${p} + ${c} + ${q} = ?`, rep, [rep + 10, rep - 10, rep + 1],
        `On regroupe les nombres qui vont bien ensemble : ${p} + ${q} = 100, puis 100 + ${c} = ${rep}.`);
    },

    function multiplicationDecomposee() {
      const a = rand(3, 9), b = rand(12, 19), rep = a * b;
      return qcmNb(`${a} × ${b} = ?`, rep, [rep + a, rep - a, a * 10 + (b - 10), rep + 10],
        `${a} × ${b} = ${a} × 10 + ${a} × ${b - 10} = ${a * 10} + ${a * (b - 10)} = ${rep}.`);
    },

    function dizainesRondes() {
      const a = rand(2, 9), b = rand(2, 9);
      const za = pick([10, 100]), rep = a * za * b * 10;
      return qcmNb(`${nb(a * za)} × ${b * 10} = ?`, rep, [rep * 10, rep / 10],
        `On calcule ${a} × ${b} = ${a * b}, puis on ajoute les zéros : ${nb(rep)}.`);
    },

    function divisionTable() {
      const a = rand(3, 9), b = rand(3, 9), p = a * b;
      return qcmNb(`${p} ÷ ${a} = ?`, b, [b + 1, b - 1, a],
        `${a} × ${b} = ${p}, donc ${p} ÷ ${a} = ${b}.`);
    },
  ];

  const methodesCalcul = [
    { recto: 'Multiplier par 10, 100, 1 000', verso: 'Chaque chiffre devient 10, 100, 1 000 fois plus grand : la virgule se décale de 1, 2 ou 3 rangs vers la droite.', astuce: '4,25 × 100 = 425' },
    { recto: 'Diviser par 10, 100, 1 000', verso: 'Chaque chiffre devient 10, 100, 1 000 fois plus petit : la virgule se décale de 1, 2 ou 3 rangs vers la gauche.', astuce: '385 ÷ 100 = 3,85' },
    { recto: 'Comment multiplier par 5 ?', verso: 'On multiplie par 10, puis on divise par 2.', astuce: '48 × 5 = 480 ÷ 2 = 240' },
    { recto: 'Comment multiplier par 9 ?', verso: 'On multiplie par 10, puis on enlève le nombre une fois.', astuce: '23 × 9 = 230 − 23 = 207' },
    { recto: 'Comment multiplier par 11 ?', verso: 'On multiplie par 10, puis on ajoute le nombre une fois.', astuce: '34 × 11 = 340 + 34 = 374' },
    { recto: 'Comment multiplier par 25 ?', verso: 'On multiplie par 100, puis on divise par 4.', astuce: '16 × 25 = 1 600 ÷ 4 = 400' },
    { recto: 'Comment multiplier par 4 ? par 8 ?', verso: '× 4 = le double du double.\n× 8 = le double du double du double.', astuce: '13 × 4 → 26 → 52' },
    { recto: 'Comment ajouter 9 ? 99 ?', verso: 'On ajoute 10 (ou 100), puis on enlève 1.', astuce: '457 + 99 = 557 − 1 = 556' },
    { recto: 'Comment enlever 19 ?', verso: 'On enlève 20, puis on ajoute 1.', astuce: '83 − 19 = 63 + 1 = 64' },
    { recto: 'Trouver le complément à 100', verso: 'Les unités doivent faire 10 et les dizaines 9.', astuce: '63 + 37 = 100 (3 + 7 = 10 et 6 + 3 = 9)' },
    { recto: 'Calculer une moitié', verso: 'On découpe le nombre en morceaux faciles à partager.', astuce: 'Moitié de 76 = moitié de 60 + moitié de 16 = 30 + 8 = 38' },
    { recto: 'Décomposer pour multiplier', verso: 'On découpe un des nombres en dizaines + unités.', astuce: '7 × 14 = 7 × 10 + 7 × 4 = 70 + 28 = 98' },
    { recto: 'Regrouper pour additionner', verso: 'On change l\'ordre pour faire des nombres ronds.', astuce: '25 + 37 + 75 = (25 + 75) + 37 = 137' },
    { recto: 'Multiplier par 0,5', verso: 'Multiplier par 0,5, c\'est prendre la moitié.', astuce: '46 × 0,5 = 23' },
  ];

  const calcul = COMMUNS.themeCalcul({
    description: 'Calcul mental : astuces, décimaux, compléments, doubles et moitiés.',
    generateurs: generateursCalcul,
    methodes: methodesCalcul,
  });

  /* ================================================================
   * 3. Résolution de problèmes
   * ================================================================ */
  const banqueProblemes = [
    { q: 'Une boîte contient 24 crayons. L\'école achète 15 boîtes.\nCombien de crayons l\'école a-t-elle achetés ?', r: '360 crayons', f: ['39 crayons', '340 crayons', '3 600 crayons'], e: 'On cherche 15 fois 24 : 24 × 15 = 360.' },
    { q: 'Léa a 50 €. Elle achète un livre à 12,50 € et un stylo à 3,75 €.\nCombien lui reste-t-il ?', r: '33,75 €', f: ['33,25 €', '16,25 €', '34,75 €'], e: 'Dépense : 12,50 + 3,75 = 16,25 €.\nReste : 50 − 16,25 = 33,75 €.' },
    { q: 'Un car part à 8 h 45 et arrive à 11 h 20.\nCombien de temps a duré le trajet ?', r: '2 h 35 min', f: ['3 h 35 min', '2 h 25 min', '3 h 25 min'], e: '8 h 45 → 10 h 45 : 2 h.\n10 h 45 → 11 h 20 : 35 min.\nTotal : 2 h 35 min.' },
    { q: '156 élèves partent en sortie dans des cars de 52 places, tous remplis.\nCombien de cars faut-il ?', r: '3 cars', f: ['4 cars', '2 cars', '104 cars'], e: '156 ÷ 52 = 3, car 52 × 3 = 156.' },
    { q: '125 élèves partent en sortie dans des cars de 40 places.\nCombien de cars faut-il au minimum ?', r: '4 cars', f: ['3 cars', '5 cars', '85 cars'], e: '125 = 40 × 3 + 5.\nAvec 3 cars, 5 élèves resteraient sur le trottoir : il faut donc 4 cars !' },
    { q: 'Un terrain rectangulaire mesure 12 m de long et 8 m de large.\nQuel est son périmètre ?', r: '40 m', f: ['20 m', '96 m', '48 m'], e: 'Périmètre du rectangle = (longueur + largeur) × 2 = (12 + 8) × 2 = 40 m.' },
    { q: 'Un potager rectangulaire mesure 15 m de long et 6 m de large.\nQuelle est son aire ?', r: '90 m²', f: ['42 m²', '21 m²', '900 m²'], e: 'Aire du rectangle = longueur × largeur = 15 × 6 = 90 m².' },
    { q: '3 kg de pommes coûtent 7,20 €.\nCombien coûtent 5 kg de pommes ?', r: '12 €', f: ['12,20 €', '10,80 €', '36 €'], e: 'Prix d\'1 kg : 7,20 ÷ 3 = 2,40 €.\nPrix de 5 kg : 2,40 × 5 = 12 €.' },
    { q: 'Un paquet contient 48 bonbons. Tom en mange le quart (1/4).\nCombien de bonbons Tom a-t-il mangés ?', r: '12 bonbons', f: ['16 bonbons', '4 bonbons', '44 bonbons'], e: 'Le quart, c\'est diviser par 4 : 48 ÷ 4 = 12.' },
    { q: 'Dans une classe de 28 élèves, les 3/4 mangent à la cantine.\nCombien d\'élèves mangent à la cantine ?', r: '21 élèves', f: ['7 élèves', '24 élèves', '12 élèves'], e: '1/4 de 28 = 28 ÷ 4 = 7.\n3/4 de 28 = 7 × 3 = 21.' },
    { q: 'Nina a eu 12, 15 et 9 à ses trois contrôles.\nQuelle est sa moyenne ?', r: '12', f: ['36', '13', '11'], e: 'On additionne les notes : 12 + 15 + 9 = 36.\nPuis on divise par le nombre de notes : 36 ÷ 3 = 12.' },
    { q: 'Paul a 27 billes. Pierre en a 3 fois plus que Paul.\nCombien Pierre a-t-il de billes ?', r: '81 billes', f: ['30 billes', '9 billes', '54 billes'], e: '« 3 fois plus » → on multiplie : 27 × 3 = 81.' },
    { q: 'Pierre a 84 billes. C\'est 4 fois plus que Paul.\nCombien Paul a-t-il de billes ?', r: '21 billes', f: ['336 billes', '80 billes', '88 billes'], e: 'Paul en a 4 fois moins → on divise : 84 ÷ 4 = 21.' },
    { q: 'Sarah mesure 1,42 m et son frère 1,67 m.\nQuelle est leur différence de taille ?', r: '25 cm', f: ['35 cm', '2,5 cm', '3,09 m'], e: '1,67 − 1,42 = 0,25 m, soit 25 cm.' },
    { q: 'Un cycliste roule à 18 km par heure.\nQuelle distance parcourt-il en 3 h 30 min ?', r: '63 km', f: ['54 km', '60 km', '72 km'], e: 'En 3 h : 18 × 3 = 54 km.\nEn 30 min (la moitié d\'une heure) : 9 km.\nTotal : 54 + 9 = 63 km.' },
    { q: 'Pour un gâteau de 4 personnes, il faut 200 g de farine.\nCombien en faut-il pour 10 personnes ?', r: '500 g', f: ['800 g', '2 000 g', '400 g'], e: 'Pour 1 personne : 200 ÷ 4 = 50 g.\nPour 10 personnes : 50 × 10 = 500 g.' },
    { q: 'Une place de cinéma coûte 7,50 €. Une famille de 4 personnes paie avec un billet de 50 €.\nCombien lui rend-on ?', r: '20 €', f: ['30 €', '22,50 €', '12,50 €'], e: 'Prix des 4 places : 7,50 × 4 = 30 €.\nMonnaie : 50 − 30 = 20 €.' },
    { q: 'Un film dure 1 h 45 min. Il commence à 20 h 30.\nÀ quelle heure se termine-t-il ?', r: '22 h 15', f: ['22 h 05', '21 h 15', '22 h 25'], e: '20 h 30 + 1 h = 21 h 30.\n21 h 30 + 45 min = 22 h 15.' },
    { q: 'Un pull coûte 40 €. Pendant les soldes, il y a 25 % de réduction.\nQuel est son nouveau prix ?', r: '30 €', f: ['15 €', '35 €', '10 €'], e: '25 %, c\'est le quart : 40 ÷ 4 = 10 € de réduction.\nNouveau prix : 40 − 10 = 30 €.' },
    { q: 'Un fermier remplit 6 sacs de 2,5 kg de pommes de terre.\nQuelle masse a-t-il mise en sacs ?', r: '15 kg', f: ['12,5 kg', '8,5 kg', '150 kg'], e: '2,5 × 6 = 15 kg.' },
    { q: 'Trois amis se partagent 37,50 € en parts égales.\nCombien chacun reçoit-il ?', r: '12,50 €', f: ['12,05 €', '11,50 €', '13,50 €'], e: '37,50 ÷ 3 = 12,50 €.' },
    { q: 'Une bibliothèque possède 1 245 livres. Elle en prête 378, puis reçoit 150 livres neufs.\nCombien de livres y a-t-il maintenant dans les rayons ?', r: '1 017 livres', f: ['717 livres', '1 773 livres', '1 027 livres'], e: '1 245 − 378 = 867.\n867 + 150 = 1 017.' },
    { q: 'Sur une carte, 1 cm représente 5 km.\nDeux villes sont à 7 cm l\'une de l\'autre sur la carte. Quelle est la distance réelle ?', r: '35 km', f: ['12 km', '75 km', '3,5 km'], e: '7 × 5 = 35 km.' },
    { q: 'Un fermier a ramassé 156 œufs. Il les range dans des boîtes de 12.\nCombien de boîtes peut-il remplir ?', r: '13 boîtes', f: ['12 boîtes', '14 boîtes', '144 boîtes'], e: '156 ÷ 12 = 13, car 12 × 13 = 156.' },
    { q: 'Victor Hugo est né en 1802 et mort en 1885.\nÀ quel âge est-il mort ?', r: '83 ans', f: ['73 ans', '93 ans', '87 ans'], e: '1885 − 1802 = 83.' },
    { q: 'Un tour de piste mesure 400 m. Lina fait 7 tours et demi.\nQuelle distance a-t-elle parcourue ?', r: '3 km', f: ['2,8 km', '3,2 km', '30 km'], e: '7 tours : 400 × 7 = 2 800 m.\nUn demi-tour : 200 m.\nTotal : 3 000 m = 3 km.' },
    { q: 'Une bouteille contient 1,5 L de jus.\nCombien de verres de 25 cL peut-on remplir ?', r: '6 verres', f: ['4 verres', '60 verres', '5 verres'], e: '1,5 L = 150 cL.\n150 ÷ 25 = 6 verres.' },
    { q: 'Un marchand achète 20 kg de cerises à 4 € le kg. Il les revend 6,50 € le kg.\nQuel est son bénéfice ?', r: '50 €', f: ['130 €', '2,50 €', '80 €'], e: 'Achat : 20 × 4 = 80 €.\nVente : 20 × 6,50 = 130 €.\nBénéfice : 130 − 80 = 50 €.' },
    { q: 'Il est 14 h 50.\nQuelle heure sera-t-il dans 25 minutes ?', r: '15 h 15', f: ['14 h 75', '15 h 05', '15 h 25'], e: '14 h 50 + 10 min = 15 h.\n15 h + 15 min = 15 h 15.\n(Attention : il n\'y a que 60 minutes dans une heure !)' },
    { q: 'Max et sa sœur ont 23 ans à eux deux. Max a 5 ans de plus que sa sœur.\nQuel âge a sa sœur ?', r: '9 ans', f: ['14 ans', '18 ans', '11 ans'], e: 'Sans les 5 ans d\'écart : 23 − 5 = 18.\nOn partage : 18 ÷ 2 = 9 ans pour la sœur (et 14 ans pour Max).' },
    { q: 'Dans une classe de 26 élèves, il y a 4 filles de plus que de garçons.\nCombien y a-t-il de garçons ?', r: '11 garçons', f: ['15 garçons', '13 garçons', '22 garçons'], e: '26 − 4 = 22.\n22 ÷ 2 = 11 garçons (et 15 filles).' },
    { q: '5 cahiers coûtent 6 €.\nCombien coûtent 15 cahiers ?', r: '18 €', f: ['16 €', '30 €', '90 €'], e: '15 cahiers, c\'est 3 fois 5 cahiers : 6 × 3 = 18 €.' },
    { q: 'Un carré a un périmètre de 36 cm.\nQuelle est la longueur de son côté ?', r: '9 cm', f: ['6 cm', '18 cm', '144 cm'], e: 'Un carré a 4 côtés égaux : 36 ÷ 4 = 9 cm.' },
    { q: 'Emma court 2,8 km lundi et 3,45 km mardi.\nQuelle distance a-t-elle courue en tout ?', r: '6,25 km', f: ['5,25 km', '6,15 km', '6,35 km'], e: '2,80 + 3,45 = 6,25 km.\n(On aligne bien les virgules !)' },
    { q: 'Une salle de spectacle a 18 rangées de 24 sièges.\nCombien y a-t-il de sièges ?', r: '432 sièges', f: ['42 sièges', '422 sièges', '4 320 sièges'], e: '24 × 18 = 432.' },
    { q: 'Un sac de riz coûte 8,75 €.\nCombien coûtent 4 sacs ?', r: '35 €', f: ['32,75 €', '35,75 €', '12,75 €'], e: '8,75 × 4 = 35 €.' },
  ];

  const methodesProblemes = [
    { recto: 'Les 4 étapes pour résoudre un problème', verso: '1. Lire et relire l\'énoncé.\n2. Trouver la question.\n3. Repérer les données utiles.\n4. Calculer, puis écrire une phrase réponse.' },
    { recto: '« 3 fois plus » ou « 3 fois moins » ?', verso: '3 fois plus → × 3\n3 fois moins → ÷ 3' },
    { recto: 'Calculer une durée', verso: 'On avance par étapes jusqu\'aux heures rondes.', astuce: '8 h 45 → 9 h (15 min) → 11 h (2 h) → 11 h 20 (20 min) = 2 h 35 min' },
    { recto: 'Heures, minutes, secondes', verso: '1 h = 60 min\n1 min = 60 s\n1 jour = 24 h', astuce: 'Une demi-heure = 30 min, un quart d\'heure = 15 min' },
    { recto: 'Périmètre d\'un rectangle', verso: '(longueur + largeur) × 2', astuce: '(12 + 8) × 2 = 40 m' },
    { recto: 'Périmètre d\'un carré', verso: 'côté × 4' },
    { recto: 'Aire d\'un rectangle', verso: 'longueur × largeur\n(en unités carrées : cm², m²…)', astuce: '15 m × 6 m = 90 m²' },
    { recto: 'Proportionnalité : le passage à l\'unité', verso: 'On cherche d\'abord la valeur pour 1, puis on multiplie.', astuce: '3 kg → 7,20 € ; 1 kg → 2,40 € ; 5 kg → 12 €' },
    { recto: 'Prendre une fraction d\'une quantité', verso: 'On divise par le nombre du bas (dénominateur), puis on multiplie par celui du haut (numérateur).', astuce: '3/4 de 20 : 20 ÷ 4 = 5, puis 5 × 3 = 15' },
    { recto: 'Calculer une moyenne', verso: 'On additionne toutes les valeurs, puis on divise par le nombre de valeurs.', astuce: '(12 + 15 + 9) ÷ 3 = 12' },
    { recto: 'Division avec un reste : que faire ?', verso: 'Ça dépend de la question ! S\'il faut transporter tout le monde, on ajoute 1 au quotient.', astuce: '125 élèves, cars de 40 places : 125 = 40 × 3 + 5 → 4 cars' },
    { recto: 'Pourcentages faciles', verso: '50 % = la moitié\n25 % = le quart\n10 % = diviser par 10', astuce: '25 % de 80 = 80 ÷ 4 = 20' },
    { recto: 'Utiliser une échelle', verso: 'On multiplie la distance sur la carte par la valeur d\'1 cm.', astuce: '1 cm pour 5 km : 7 cm → 35 km' },
    { recto: 'Conversions de longueur', verso: '1 km = 1 000 m\n1 m = 100 cm\n1 cm = 10 mm' },
    { recto: 'Conversions de masse', verso: '1 kg = 1 000 g\n1 t = 1 000 kg' },
    { recto: 'Conversions de contenance', verso: '1 L = 100 cL = 1 000 mL' },
  ];

  const problemes = COMMUNS.themeProblemes({
    description: 'Durées, monnaie, fractions, proportionnalité, périmètres et aires.',
    banque: banqueProblemes,
    methodes: methodesProblemes,
  });

  CATALOGUE.ajouterModule('cm2', {
    id: 'maths',
    nom: 'Mathématiques',
    icone: '🔢',
    couleur: '#6c5ce7',
    themes: [tables, calcul, problemes],
  });
})();
