/* CE2 — Mathématiques (nombres entiers jusqu'à 1 000, pas de décimaux) */
(function () {
  'use strict';
  const { rand, pick, qcmNb } = U;

  /* ================================================================
   * 1. Tables de multiplication (sans le signe ÷)
   * ================================================================ */
  const tables = COMMUNS.themeTables({
    valeurs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    defaut: [2, 3, 4, 5, 10],
    division: false,
  });

  /* ================================================================
   * 2. Calcul rapide
   * ================================================================ */
  const generateursCalcul = [
    function additionUnites() {
      let a;
      do { a = rand(21, 89); } while (a % 10 === 0);
      const b = rand(3, 9), rep = a + b, x = 10 - (a % 10);
      const expl = b > x
        ? `On passe la dizaine : ${a} + ${x} = ${a + x}, puis ${a + x} + ${b - x} = ${rep}.`
        : `${a} + ${b} = ${rep}.`;
      return qcmNb(`${a} + ${b} = ?`, rep, [rep + 10, rep - 10, rep + 1, rep - 1], expl);
    },

    function additionDizaines() {
      const a = rand(12, 59);
      const dz = rand(1, 3) * 10, u = rand(1, 9), b = dz + u, rep = a + b;
      return qcmNb(`${a} + ${b} = ?`, rep, [rep + 10, rep - 10, rep + 1, rep - 1],
        `On ajoute d'abord les dizaines puis les unités : ${a} + ${dz} = ${a + dz}, puis ${a + dz} + ${u} = ${rep}.`);
    },

    function soustractionUnites() {
      let a;
      do { a = rand(21, 99); } while (a % 10 === 0);
      const b = rand(3, 9), rep = a - b, u = a % 10;
      const expl = b > u
        ? `On descend à la dizaine : ${a} − ${u} = ${a - u}, puis ${a - u} − ${b - u} = ${rep}.`
        : `${a} − ${b} = ${rep}.`;
      return qcmNb(`${a} − ${b} = ?`, rep, [rep + 10, rep - 10, rep + 1, rep - 1], expl);
    },

    function soustractionDizaines() {
      const a = rand(40, 99);
      let b;
      do { b = rand(11, a - 10); } while (b % 10 === 0);
      const rep = a - b, dz = b - (b % 10), u = b % 10;
      const erreur = (Math.floor(a / 10) - Math.floor(b / 10)) * 10 + Math.abs((a % 10) - u);
      return qcmNb(`${a} − ${b} = ?`, rep, [erreur, rep + 10, rep - 10],
        `On enlève d'abord les dizaines puis les unités : ${a} − ${dz} = ${a - dz}, puis ${a - dz} − ${u} = ${rep}.`);
    },

    function complement() {
      const t = Math.random();
      if (t < 0.3) {
        const x = rand(1, 9);
        return qcmNb(`${x} + ? = 10`, 10 - x, [11 - x, 9 - x, x],
          `${x} + ${10 - x} = 10.`);
      }
      if (t < 0.6) {
        const x = rand(1, 9) * 10;
        return qcmNb(`${x} + ? = 100`, 100 - x, [110 - x, 90 - x, x],
          `${x / 10} dizaines + ${10 - x / 10} dizaines = 10 dizaines = 100.`);
      }
      let x;
      do { x = rand(11, 89); } while (x % 10 === 0);
      const rep = 100 - x;
      const erreur = (10 - Math.floor(x / 10)) * 10 + (10 - (x % 10));
      return qcmNb(`${x} + ? = 100`, rep, [erreur, rep + 10, rep - 10],
        `${x} + ${rep} = 100. Les unités font 10 (${x % 10} + ${rep % 10}) et les dizaines font 9 (${Math.floor(x / 10)} + ${Math.floor(rep / 10)}).`);
    },

    function doubleMoitie() {
      if (Math.random() < 0.5) {
        const x = rand(11, 49), dz = x - (x % 10), u = x % 10, rep = 2 * x;
        return qcmNb(`Le double de ${x} = ?`, rep, [rep + 10, rep - 10, x + 2],
          `Double de ${dz} = ${2 * dz}, double de ${u} = ${2 * u}, donc ${2 * dz} + ${2 * u} = ${rep}.`);
      }
      const x = rand(6, 49) * 2, rep = x / 2, a = Math.floor(x / 20) * 20, b = x - a;
      const expl = a > 0 && b > 0
        ? `${x} = ${a} + ${b}. Moitié de ${a} = ${a / 2}, moitié de ${b} = ${b / 2}, donc ${rep}.`
        : `${x} ÷ 2 = ${rep}, car ${rep} + ${rep} = ${x}.`;
      return qcmNb(`La moitié de ${x} = ?`, rep, [rep + 5, rep - 5, rep + 10, x * 2], expl);
    },

    function multiplierPar10() {
      if (Math.random() < 0.6) {
        const x = rand(2, 99), rep = x * 10;
        return qcmNb(`${x} × 10 = ?`, rep, [x * 100, x + 10, rep + 1],
          `× 10 : chaque chiffre prend une valeur 10 fois plus grande, on écrit un 0 à droite : ${rep}.`);
      }
      const x = rand(2, 9), rep = x * 100;
      return qcmNb(`${x} × 100 = ?`, rep, [x * 10, x + 100, x * 1000],
        `× 100 : on écrit deux 0 à droite : ${rep}.`);
    },

    function ajoutRetrait() {
      const v = pick([10, 100, 9, 11]);
      const x = rand(110, 890);
      const plus = Math.random() < 0.5;
      const rep = plus ? x + v : x - v;
      let expl;
      if (v === 9) {
        expl = plus ? `Ajouter 9, c'est ajouter 10 puis enlever 1 : ${x + 10} − 1 = ${rep}.`
          : `Enlever 9, c'est enlever 10 puis ajouter 1 : ${x - 10} + 1 = ${rep}.`;
      } else if (v === 11) {
        expl = plus ? `Ajouter 11, c'est ajouter 10 puis 1 : ${x + 10} + 1 = ${rep}.`
          : `Enlever 11, c'est enlever 10 puis 1 : ${x - 10} − 1 = ${rep}.`;
      } else {
        expl = `${plus ? 'Ajouter' : 'Enlever'} ${v}, c'est changer seulement le chiffre des ${v === 10 ? 'dizaines' : 'centaines'} : ${rep}.`;
      }
      const pieges = v === 10 ? [plus ? x + 100 : x - 100, plus ? x + 1 : x - 1]
        : v === 100 ? [plus ? x + 10 : x - 10, plus ? x + 1000 : x]
        : [rep + 1, rep - 1, rep + 2];
      return qcmNb(`${x} ${plus ? '+' : '−'} ${v} = ?`, rep, pieges, expl);
    },

    function nombresRonds() {
      const t = Math.random();
      if (t < 0.4) {
        const a = rand(2, 9), b = rand(2, 9), rep = (a + b) * 10;
        return qcmNb(`${a * 10} + ${b * 10} = ?`, rep, [rep + 10, rep - 10, a + b],
          `${a} dizaines + ${b} dizaines = ${a + b} dizaines = ${rep}.`);
      }
      if (t < 0.7) {
        const a = rand(1, 5), b = rand(1, 9 - a), rep = (a + b) * 100;
        return qcmNb(`${a * 100} + ${b * 100} = ?`, rep, [rep + 100, rep - 100, (a + b) * 10],
          `${a} centaines + ${b} centaines = ${a + b} centaines = ${rep}.`);
      }
      const a = rand(4, 9), b = rand(1, a - 1), rep = (a - b) * 100;
      return qcmNb(`${a * 100} − ${b * 100} = ?`, rep, [rep + 100, rep - 100, (a - b) * 10],
        `${a} centaines − ${b} centaines = ${a - b} centaines = ${rep}.`);
    },

    function sommeMaline() {
      const p = rand(1, 9), q = 10 - p, c = rand(2, 9);
      const rep = 10 + c;
      return qcmNb(`${p} + ${c} + ${q} = ?`, rep, [rep + 1, rep - 1, rep + 10],
        `On regroupe pour faire 10 : ${p} + ${q} = 10, puis 10 + ${c} = ${rep}.`);
    },

    function multiplicationDecomposee() {
      const a = rand(2, 5), b = rand(11, 19), rep = a * b;
      return qcmNb(`${a} × ${b} = ?`, rep, [rep + a, rep - a, a * 10 + (b - 10), rep + 10],
        `${a} × ${b} = ${a} × 10 + ${a} × ${b - 10} = ${a * 10} + ${a * (b - 10)} = ${rep}.`);
    },
  ];

  const methodesCalcul = [
    { recto: 'Les compléments à 10', verso: '1 + 9    2 + 8    3 + 7\n4 + 6    5 + 5', astuce: 'À connaître par cœur !' },
    { recto: 'Compléter à 100 avec des dizaines', verso: 'On compte les dizaines : il en faut 10 en tout.', astuce: '30 + 70 = 100 (3 + 7 = 10 dizaines)' },
    { recto: 'Passer la dizaine', verso: 'On complète d\'abord jusqu\'à la dizaine, puis on ajoute le reste.', astuce: '38 + 5 = 38 + 2 + 3 = 43' },
    { recto: 'Ajouter un nombre à 2 chiffres', verso: 'On ajoute d\'abord les dizaines, puis les unités.', astuce: '46 + 23 = 66 + 3 = 69' },
    { recto: 'Comment ajouter 9 ?', verso: 'On ajoute 10, puis on enlève 1.', astuce: '47 + 9 = 57 − 1 = 56' },
    { recto: 'Comment enlever 9 ?', verso: 'On enlève 10, puis on ajoute 1.', astuce: '63 − 9 = 53 + 1 = 54' },
    { recto: 'Multiplier par 10', verso: 'Chaque chiffre prend une valeur 10 fois plus grande : on écrit un 0 à droite.', astuce: '23 × 10 = 230' },
    { recto: 'Multiplier par 100', verso: 'On écrit deux 0 à droite.', astuce: '7 × 100 = 700' },
    { recto: 'Calculer un double', verso: 'On double les dizaines, puis les unités, et on ajoute.', astuce: 'Double de 34 = 60 + 8 = 68' },
    { recto: 'Calculer une moitié', verso: 'On partage en deux les dizaines, puis les unités.', astuce: 'Moitié de 48 = 20 + 4 = 24' },
    { recto: 'Regrouper pour faire 10', verso: 'On cherche deux nombres qui font 10 ensemble.', astuce: '7 + 5 + 3 = (7 + 3) + 5 = 15' },
    { recto: 'Ajouter des dizaines rondes', verso: 'On compte en dizaines.', astuce: '40 + 70 = 4 dizaines + 7 dizaines = 11 dizaines = 110' },
    { recto: 'Multiplier par 4', verso: 'C\'est le double du double.', astuce: '6 × 4 : 6 → 12 → 24' },
  ];

  const calcul = COMMUNS.themeCalcul({
    description: 'Calcul mental : additions, soustractions, compléments, doubles et moitiés.',
    generateurs: generateursCalcul,
    methodes: methodesCalcul,
    chronoDefaut: 30,
  });

  /* ================================================================
   * 3. Résolution de problèmes
   * ================================================================ */
  const banqueProblemes = [
    { q: 'Dans un bus, il y a 28 personnes. Au premier arrêt, 9 personnes descendent et 14 montent.\nCombien y a-t-il de personnes dans le bus ?', r: '33 personnes', f: ['51 personnes', '5 personnes', '23 personnes'], e: '28 − 9 = 19.\n19 + 14 = 33.' },
    { q: 'Lucas a 45 billes. Emma en a 17 de plus que lui.\nCombien Emma a-t-elle de billes ?', r: '62 billes', f: ['28 billes', '52 billes', '63 billes'], e: '« de plus » → on ajoute : 45 + 17 = 62.' },
    { q: 'Zoé a 75 €. Elle achète un jeu à 38 €.\nCombien lui reste-t-il ?', r: '37 €', f: ['113 €', '47 €', '33 €'], e: '75 − 38 = 37 €.' },
    { q: 'Le fermier remplit 6 boîtes de 8 œufs.\nCombien d\'œufs a-t-il rangés ?', r: '48 œufs', f: ['14 œufs', '42 œufs', '54 œufs'], e: '6 boîtes de 8 : 6 × 8 = 48.' },
    { q: '24 bonbons sont partagés équitablement entre 4 enfants.\nCombien de bonbons reçoit chaque enfant ?', r: '6 bonbons', f: ['20 bonbons', '28 bonbons', '8 bonbons'], e: 'On cherche combien de fois 4 dans 24 : 4 × 6 = 24.\nChaque enfant reçoit 6 bonbons.' },
    { q: 'La maîtresse fait des groupes de 5 élèves. Il y a 30 élèves.\nCombien de groupes peut-elle faire ?', r: '6 groupes', f: ['25 groupes', '35 groupes', '7 groupes'], e: '5 × 6 = 30 : on peut faire 6 groupes.' },
    { q: 'Un livre a 120 pages. Inès en a déjà lu 45.\nCombien de pages lui reste-t-il à lire ?', r: '75 pages', f: ['165 pages', '85 pages', '65 pages'], e: '120 − 45 = 75.' },
    { q: 'Le film commence à 14 h 30 et dure 1 h 30.\nÀ quelle heure se termine-t-il ?', r: '16 h', f: ['15 h', '16 h 30', '15 h 30'], e: '14 h 30 + 1 h = 15 h 30.\n15 h 30 + 30 min = 16 h.' },
    { q: 'Les vacances durent 3 semaines.\nCombien de jours cela fait-il ?', r: '21 jours', f: ['10 jours', '30 jours', '24 jours'], e: '1 semaine = 7 jours.\n3 × 7 = 21 jours.' },
    { q: 'Un carré a des côtés de 5 cm.\nQuelle est la longueur de son tour (son périmètre) ?', r: '20 cm', f: ['10 cm', '25 cm', '15 cm'], e: 'Un carré a 4 côtés de même longueur : 5 + 5 + 5 + 5 = 20 cm.' },
    { q: 'Une ficelle mesure 1 m. On en coupe 35 cm.\nQuelle longueur reste-t-il ?', r: '65 cm', f: ['75 cm', '135 cm', '55 cm'], e: '1 m = 100 cm.\n100 − 35 = 65 cm.' },
    { q: 'Paul a 2 billets de 10 € et 3 pièces de 2 €.\nCombien d\'argent a-t-il ?', r: '26 €', f: ['17 €', '15 €', '32 €'], e: '2 billets de 10 € : 20 €.\n3 pièces de 2 € : 6 €.\n20 + 6 = 26 €.' },
    { q: 'Un cahier coûte 3 €.\nCombien coûtent 7 cahiers ?', r: '21 €', f: ['10 €', '24 €', '18 €'], e: '7 × 3 = 21 €.' },
    { q: 'Maman paie un pull de 13 € avec un billet de 20 €.\nCombien la vendeuse lui rend-elle ?', r: '7 €', f: ['33 €', '8 €', '6 €'], e: 'De 13 € pour aller à 20 €, il manque 7 € : 20 − 13 = 7 €.' },
    { q: 'Dans une école, il y a 256 élèves. 128 sont des filles.\nCombien y a-t-il de garçons ?', r: '128 garçons', f: ['384 garçons', '138 garçons', '118 garçons'], e: '256 − 128 = 128.' },
    { q: 'Dans la salle, il y a 4 rangées de 9 chaises.\nCombien y a-t-il de chaises ?', r: '36 chaises', f: ['13 chaises', '32 chaises', '45 chaises'], e: '4 rangées de 9 : 4 × 9 = 36.' },
    { q: 'Marie a 50 cartes. Elle donne la moitié à son frère.\nCombien de cartes donne-t-elle ?', r: '25 cartes', f: ['50 cartes', '100 cartes', '20 cartes'], e: 'La moitié de 50 : 50 ÷ 2 = 25, car 25 + 25 = 50.' },
    { q: 'Tom a 8 ans. Son papa a 4 fois son âge.\nQuel âge a son papa ?', r: '32 ans', f: ['12 ans', '36 ans', '28 ans'], e: '« 4 fois » → on multiplie : 8 × 4 = 32.' },
    { q: 'Un train part à 9 h et arrive à 11 h 15.\nCombien de temps a duré le voyage ?', r: '2 h 15 min', f: ['2 h', '3 h 15 min', '1 h 15 min'], e: 'De 9 h à 11 h : 2 h.\nDe 11 h à 11 h 15 : 15 min.\nTotal : 2 h 15 min.' },
    { q: 'Papa achète un paquet de farine de 2 kg et un paquet de sucre de 500 g.\nQuelle est la masse totale, en grammes ?', r: '2 500 g', f: ['502 g', '700 g', '2 050 g'], e: '2 kg = 2 000 g.\n2 000 + 500 = 2 500 g.' },
    { q: 'Hugo mesure 1 m 25 cm. Sa petite sœur mesure 15 cm de moins.\nCombien mesure-t-elle ?', r: '1 m 10 cm', f: ['1 m 40 cm', '1 m 15 cm', '1 m'], e: '« de moins » → on enlève : 25 cm − 15 cm = 10 cm.\nElle mesure 1 m 10 cm.' },
    { q: 'La boulangère fait 120 croissants le matin et 85 l\'après-midi.\nCombien de croissants a-t-elle faits dans la journée ?', r: '205 croissants', f: ['195 croissants', '215 croissants', '35 croissants'], e: '120 + 85 = 205.' },
    { q: 'Un parking a 5 rangées de 10 places. 12 places sont vides.\nCombien de voitures sont garées ?', r: '38 voitures', f: ['50 voitures', '62 voitures', '48 voitures'], e: 'Nombre de places : 5 × 10 = 50.\nVoitures : 50 − 12 = 38.' },
    { q: 'Sam a 3 paquets de 10 images et 7 images toutes seules.\nCombien d\'images a-t-il ?', r: '37 images', f: ['20 images', '310 images', '73 images'], e: '3 paquets de 10 = 30 images.\n30 + 7 = 37.' },
    { q: 'La maîtresse a 40 crayons. Elle en donne 3 à chacun de ses 12 élèves.\nCombien de crayons lui reste-t-il ?', r: '4 crayons', f: ['36 crayons', '28 crayons', '25 crayons'], e: 'Crayons donnés : 12 × 3 = 36.\nReste : 40 − 36 = 4.' },
    { q: 'Pour aller à l\'école, Léo marche 450 m.\nQuelle distance fait-il pour l\'aller et le retour ?', r: '900 m', f: ['450 m', '950 m', '800 m'], e: 'Aller-retour = 2 fois le trajet : 450 + 450 = 900 m.' },
    { q: 'Il est 10 h 45. La récréation commence dans 15 minutes.\nÀ quelle heure commence-t-elle ?', r: '11 h', f: ['10 h 60', '10 h 55', '11 h 15'], e: '10 h 45 + 15 min = 11 h.\n(Il n\'y a que 60 minutes dans une heure !)' },
    { q: 'Nina a 100 €. Elle achète un vélo à 65 € et un casque à 20 €.\nCombien lui reste-t-il ?', r: '15 €', f: ['35 €', '185 €', '25 €'], e: 'Dépenses : 65 + 20 = 85 €.\nReste : 100 − 85 = 15 €.' },
    { q: 'Dans le pré, il y a 6 vaches.\nCombien de pattes cela fait-il ?', r: '24 pattes', f: ['10 pattes', '12 pattes', '30 pattes'], e: 'Une vache a 4 pattes : 6 × 4 = 24.' },
    { q: 'Un paquet de 36 gâteaux est partagé entre 3 amis.\nCombien de gâteaux reçoit chacun ?', r: '12 gâteaux', f: ['33 gâteaux', '39 gâteaux', '9 gâteaux'], e: '3 × 12 = 36 : chacun reçoit 12 gâteaux.' },
  ];

  const methodesProblemes = [
    { recto: 'Les 4 étapes pour résoudre un problème', verso: '1. Lire l\'énoncé deux fois.\n2. Chercher la question.\n3. Trouver les nombres utiles.\n4. Calculer et écrire une phrase réponse.' },
    { recto: '« de plus » ou « de moins » ?', verso: '« de plus » → on ajoute (+)\n« de moins » → on enlève (−)', astuce: 'Léa a 5 billes de plus que Tom qui en a 12 : 12 + 5 = 17' },
    { recto: '« fois plus »', verso: 'On multiplie (×).', astuce: '3 fois plus que 8 : 8 × 3 = 24' },
    { recto: 'Partager équitablement', verso: 'Chacun reçoit la même part : on cherche combien de fois le nombre de personnes va dans le total.', astuce: '24 bonbons pour 4 enfants : 4 × 6 = 24 → 6 chacun' },
    { recto: 'Rangées et paquets', verso: 'Des rangées (ou paquets) identiques → on multiplie.', astuce: '4 rangées de 9 chaises : 4 × 9 = 36' },
    { recto: 'Rendre la monnaie', verso: 'On compte ce qui manque pour aller du prix jusqu\'à la somme donnée.', astuce: 'Prix 13 €, billet de 20 € : 13 → 20, il manque 7 €' },
    { recto: 'Heures et minutes', verso: '1 h = 60 min\n1 jour = 24 h\n1 semaine = 7 jours' },
    { recto: 'Quart d\'heure et demi-heure', verso: 'Un quart d\'heure = 15 min\nUne demi-heure = 30 min\nTrois quarts d\'heure = 45 min' },
    { recto: 'Mesures de longueur', verso: '1 m = 100 cm\n1 km = 1 000 m' },
    { recto: 'Mesures de masse', verso: '1 kg = 1 000 g' },
    { recto: 'La monnaie', verso: '1 € = 100 centimes' },
    { recto: 'Aller-retour', verso: 'C\'est 2 fois le trajet.', astuce: '450 m aller → 450 + 450 = 900 m' },
    { recto: 'Le tour d\'une figure (périmètre)', verso: 'On additionne les longueurs de tous les côtés.', astuce: 'Carré de 5 cm : 5 + 5 + 5 + 5 = 20 cm' },
  ];

  const problemes = COMMUNS.themeProblemes({
    description: 'Monnaie, durées, longueurs et masses, partages, « de plus / de moins ».',
    banque: banqueProblemes,
    methodes: methodesProblemes,
  });

  CATALOGUE.ajouterModule('ce2', {
    id: 'maths',
    nom: 'Mathématiques',
    icone: '🔢',
    couleur: '#8b5cf6',
    themes: [tables, calcul, problemes],
  });
})();
