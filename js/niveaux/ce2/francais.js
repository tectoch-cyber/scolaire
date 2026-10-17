/* CE2 — Français (grammaire, vocabulaire) */
(function () {
  'use strict';

  /* ================================================================
   * 1. Grammaire (nature des mots, sujet, accords, phrases, conjugaison, homophones)
   * ================================================================ */
  const banqueGrammaire = [
    // Nature des mots
    { q: "« Le petit chien aboie. »\nQuelle est la nature du mot « chien » ?", r: "un nom", f: ["un verbe", "un adjectif", "un déterminant"], e: "« chien » désigne un animal, et on peut mettre un déterminant devant (le chien) : c'est un nom." },
    { q: "« Le petit chien aboie. »\nQuelle est la nature du mot « petit » ?", r: "un adjectif", f: ["un nom", "un verbe", "un déterminant"], e: "« petit » donne une précision sur le nom « chien » : c'est un adjectif." },
    { q: "« Les enfants jouent dans la cour. »\nQuelle est la nature du mot « jouent » ?", r: "un verbe", f: ["un nom", "un adjectif", "un pronom"], e: "« jouent » dit ce que font les enfants, et il change avec le temps (hier, ils jouaient) : c'est un verbe." },
    { q: "« Ma sœur lit un livre. »\nQuelle est la nature du mot « Ma » ?", r: "un déterminant", f: ["un pronom", "un nom", "un adjectif"], e: "« Ma » est placé devant le nom « sœur » : c'est un déterminant." },
    { q: "« Elle chante une chanson. »\nQuelle est la nature du mot « Elle » ?", r: "un pronom", f: ["un déterminant", "un nom", "un verbe"], e: "« Elle » remplace un nom (Léa, ma sœur…) : c'est un pronom personnel." },
    { q: "Lequel de ces mots est un verbe ?", r: "courir", f: ["courage", "rapide", "une"], e: "« courir » est une action, on peut le conjuguer (je cours) : c'est un verbe à l'infinitif." },
    { q: "Lequel de ces mots est un adjectif ?", r: "gentil", f: ["gentillesse", "jardin", "jouer"], e: "« gentil » précise un nom (un chien gentil) : c'est un adjectif. « la gentillesse » est un nom." },
    { q: "Lequel de ces mots est un nom ?", r: "bonheur", f: ["heureux", "partir", "les"], e: "On peut dire « le bonheur » : c'est un nom. « heureux » est un adjectif, « partir » un verbe, « les » un déterminant." },

    // Sujet du verbe
    { q: "« Le facteur apporte le courrier. »\nQuel est le sujet du verbe ?", r: "Le facteur", f: ["apporte", "le courrier", "Le"], e: "C'est le facteur qui apporte : « Le facteur » est le sujet." },
    { q: "« Dans la forêt, les oiseaux chantent. »\nQuel est le sujet du verbe ?", r: "les oiseaux", f: ["la forêt", "chantent", "Dans la forêt"], e: "Ce sont les oiseaux qui chantent : « les oiseaux » est le sujet." },
    { q: "« Demain, nous partirons en vacances. »\nQuel est le sujet du verbe ?", r: "nous", f: ["Demain", "vacances", "partirons"], e: "C'est nous qui partirons : le pronom « nous » est le sujet." },
    { q: "« Où vont les enfants ? »\nQuel est le sujet du verbe ?", r: "les enfants", f: ["Où", "vont", "Où vont"], e: "Ce sont les enfants qui vont. Dans une question, le sujet peut être placé après le verbe." },

    // Verbe : infinitif et groupes
    { q: "« Les élèves écoutent la maîtresse. »\nQuel est l'infinitif du verbe ?", r: "écouter", f: ["écoutent", "écoute", "écoutant"], e: "On dit « il faut écouter » : l'infinitif est « écouter »." },
    { q: "« Nous finissons nos devoirs. »\nQuel est l'infinitif du verbe ?", r: "finir", f: ["finissons", "finissez", "fini"], e: "On dit « il faut finir » : l'infinitif est « finir »." },
    { q: "« Tu prends ton manteau. »\nQuel est l'infinitif du verbe ?", r: "prendre", f: ["prends", "pris", "prenez"], e: "On dit « il faut prendre » : l'infinitif est « prendre »." },
    { q: "Quel verbe est du 1er groupe ?", r: "danser", f: ["finir", "prendre", "venir"], e: "Les verbes du 1er groupe ont un infinitif en -er (sauf « aller ») : danser." },

    // Genre et nombre
    { q: "Quel est le féminin de « un boulanger » ?", r: "une boulangère", f: ["une boulangeuse", "une boulangerie", "une boulangette"], e: "-er devient -ère au féminin : un boulanger → une boulangère. (La boulangerie est le magasin.)" },
    { q: "Quel est le féminin de « un chanteur » ?", r: "une chanteuse", f: ["une chanteure", "une chantrice", "une chanteuze"], e: "un chanteur → une chanteuse (-eur → -euse)." },
    { q: "Quel est le féminin de « un acteur » ?", r: "une actrice", f: ["une acteuse", "une actrisse", "une acteure"], e: "un acteur → une actrice (-teur → -trice)." },
    { q: "Quel est le pluriel de « un cheval » ?", r: "des chevaux", f: ["des chevals", "des chevaus", "des chevauxs"], e: "Les noms en -al font leur pluriel en -aux : un cheval → des chevaux." },
    { q: "Quel est le pluriel de « un bijou » ?", r: "des bijoux", f: ["des bijous", "des bijoues", "des bijou"], e: "« bijou » fait partie des 7 mots en -ou qui prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou." },
    { q: "Quel est le pluriel de « un gâteau » ?", r: "des gâteaux", f: ["des gâteaus", "des gâteau", "des gâteauxs"], e: "Les noms en -eau prennent un x au pluriel : des gâteaux." },
    { q: "Quel est le pluriel de « un nez » ?", r: "des nez", f: ["des nezs", "des nezx", "des nés"], e: "Les noms terminés par -s, -x ou -z ne changent pas au pluriel : un nez → des nez." },
    { q: "Quel est le pluriel de « un clou » ?", r: "des clous", f: ["des cloux", "des clou", "des clouts"], e: "Les noms en -ou prennent un s au pluriel (sauf les 7 exceptions en -oux) : des clous." },

    // Accords dans le groupe nominal
    { q: "Complète : « Les fleurs sont … »", r: "jolies", f: ["jolie", "jolis", "joli"], e: "« fleurs » est féminin pluriel : l'adjectif prend -e et -s → jolies." },
    { q: "Complète : « Des chiens … »", r: "noirs", f: ["noir", "noires", "noire"], e: "« chiens » est masculin pluriel : l'adjectif prend un -s → noirs." },
    { q: "Quel groupe nominal est bien accordé ?", r: "de grandes maisons", f: ["de grande maisons", "de grands maisons", "de grandes maison"], e: "« maisons » est féminin pluriel : le nom et l'adjectif s'accordent → de grandes maisons." },
    { q: "Quel groupe nominal est bien accordé ?", r: "une voiture verte", f: ["une voiture vert", "une voitures verte", "un voiture vert"], e: "« voiture » est féminin singulier : une voiture verte." },

    // Types et formes de phrases
    { q: "« Range ta chambre. »\nDe quel type est cette phrase ?", r: "impérative", f: ["interrogative", "exclamative", "déclarative"], e: "La phrase donne un ordre : elle est impérative." },
    { q: "« Quel beau temps ! »\nDe quel type est cette phrase ?", r: "exclamative", f: ["interrogative", "impérative", "déclarative"], e: "Elle exprime une émotion et se termine par un point d'exclamation : elle est exclamative." },
    { q: "« As-tu faim ? »\nDe quel type est cette phrase ?", r: "interrogative", f: ["exclamative", "impérative", "déclarative"], e: "Elle pose une question et se termine par un point d'interrogation : elle est interrogative." },
    { q: "« Le soleil brille. »\nDe quel type est cette phrase ?", r: "déclarative", f: ["interrogative", "exclamative", "impérative"], e: "Elle donne une information et se termine par un point : elle est déclarative." },
    { q: "Quelle est la forme négative de « Je mange des pommes. » ?", r: "Je ne mange pas de pommes.", f: ["Je mange pas de pommes.", "Je ne mange des pommes.", "Je ne pas mange de pommes."], e: "La négation entoure le verbe : ne … pas. Il ne faut oublier ni « ne » ni « pas »." },
    { q: "Quelle phrase est à la forme négative ?", r: "Il ne pleut jamais ici.", f: ["Il pleut souvent ici.", "Pleut-il ici ?", "Comme il pleut !"], e: "« ne … jamais » est une négation, comme « ne … pas » ou « ne … plus »." },

    // Conjugaison au présent
    { q: "Complète avec le verbe être : « Nous … contents. »", r: "sommes", f: ["somme", "êtes", "sont"], e: "être au présent : je suis, tu es, il est, nous sommes, vous êtes, ils sont." },
    { q: "Complète avec le verbe avoir : « Ils … un chien. »", r: "ont", f: ["on", "sont", "avons"], e: "avoir au présent : j'ai, tu as, il a, nous avons, vous avez, ils ont." },
    { q: "Complète avec le verbe aller : « Tu … à l'école. »", r: "vas", f: ["va", "vais", "allez"], e: "aller au présent : je vais, tu vas, il va, nous allons, vous allez, ils vont." },
    { q: "Complète avec le verbe faire : « Vous … un gâteau. »", r: "faites", f: ["faisez", "font", "fesez"], e: "faire au présent : je fais, tu fais, il fait, nous faisons, vous faites, ils font." },
    { q: "Complète avec le verbe chanter : « Je … une chanson. »", r: "chante", f: ["chantes", "chantent", "chanter"], e: "1er groupe au présent : je chante (terminaison -e)." },
    { q: "Complète avec le verbe nager : « Elles … dans la piscine. »", r: "nagent", f: ["nage", "nages", "nagons"], e: "Avec « elles », la terminaison est -ent : elles nagent." },
    { q: "Complète avec le verbe laver : « Tu … ton vélo. »", r: "laves", f: ["lave", "lavent", "lavez"], e: "Avec « tu », la terminaison est -es : tu laves." },
    { q: "Complète avec le verbe jouer : « Nous … du piano. »", r: "jouons", f: ["jouont", "jouez", "joue"], e: "Avec « nous », la terminaison est -ons : nous jouons." },

    // Passé, présent, futur
    { q: "Quelle phrase est au futur ?", r: "Demain, je partirai à la mer.", f: ["Hier, je suis parti à la mer.", "Aujourd'hui, je pars à la mer.", "Avant, je partais à la mer."], e: "« Demain » et « partirai » indiquent une action qui n'a pas encore eu lieu : c'est le futur." },
    { q: "Quelle phrase est au passé ?", r: "La semaine dernière, nous avons visité un château.", f: ["Nous visitons un château.", "Nous visiterons un château.", "Visitons un château !"], e: "« La semaine dernière » et « avons visité » indiquent une action déjà terminée : c'est le passé." },

    // Homophones grammaticaux
    { q: "Complète : « Il … un vélo rouge. »", r: "a", f: ["à", "as", "ah"], e: "On peut dire « Il avait un vélo » : c'est le verbe avoir, sans accent." },
    { q: "Complète : « Je vais … la piscine. »", r: "à", f: ["a", "as", "ha"], e: "On ne peut pas dire « Je vais avait la piscine » : c'est « à » avec un accent." },
    { q: "Complète : « Le ciel … bleu … le soleil brille. »", r: "est / et", f: ["et / est", "est / est", "et / et"], e: "« Le ciel était bleu » → est (verbe être).\n« et puis le soleil brille » → et (mot de liaison)." },
    { q: "Complète : « Mes amis … partis. »", r: "sont", f: ["son", "sons", "sonts"], e: "On peut dire « Mes amis étaient partis » : c'est le verbe être → sont." },
    { q: "Complète : « Il range … cartable. »", r: "son", f: ["sont", "sons", "s'ont"], e: "On peut dire « Il range mon cartable » : c'est le déterminant → son." },
    { q: "Complète : « Les enfants … faim. »", r: "ont", f: ["on", "sont", "onts"], e: "On peut dire « Les enfants avaient faim » : c'est le verbe avoir → ont." },
    { q: "Complète : « … va jouer dehors ? »", r: "On", f: ["Ont", "Sont", "Son"], e: "On peut dire « Il va jouer dehors ? » : c'est le pronom → on." },
  ];

  const fichesGrammaire = [
    { recto: "Le nom", verso: "Il désigne une personne, un animal, une chose ou une idée.\nOn peut mettre un déterminant devant.", astuce: "le chat, une table, la joie" },
    { recto: "Le déterminant", verso: "Le petit mot placé devant le nom.", astuce: "le, la, les, un, une, des, mon, ta, ses, ce, cette…" },
    { recto: "L'adjectif", verso: "Il précise le nom et s'accorde avec lui.", astuce: "une robe bleue, des chats noirs" },
    { recto: "Le verbe", verso: "Il exprime une action ou un état. Il change avec le temps (passé, présent, futur).", astuce: "Aujourd'hui je mange, hier je mangeais" },
    { recto: "Les pronoms personnels", verso: "je, tu, il, elle, on\nnous, vous, ils, elles", astuce: "Ils remplacent un nom : Léa chante → Elle chante." },
    { recto: "Trouver le sujet", verso: "On pose la question « Qui est-ce qui … ? » ou on encadre avec « C'est … qui ».", astuce: "C'est le facteur qui apporte le courrier." },
    { recto: "Trouver l'infinitif", verso: "On dit « Il faut … ».", astuce: "Nous finissons → il faut finir" },
    { recto: "Les 3 groupes de verbes", verso: "1er groupe : -er (sauf aller)\n2e groupe : -ir avec « nous …issons »\n3e groupe : tous les autres", astuce: "chanter (1er), finir (2e), prendre (3e)" },
    { recto: "Le pluriel des noms", verso: "En général : + s\n-s, -x, -z : pas de changement\n-eau, -eu : + x\n-al : -aux", astuce: "des chats, des nez, des gâteaux, des chevaux" },
    { recto: "Les 7 mots en -ou qui prennent un x", verso: "bijou, caillou, chou, genou, hibou, joujou, pou", astuce: "des bijoux, des cailloux, des choux…" },
    { recto: "L'accord dans le groupe nominal", verso: "Le déterminant, le nom et l'adjectif ont le même genre et le même nombre.", astuce: "les petites filles, un grand garçon" },
    { recto: "Les types de phrases", verso: "déclarative . (information)\ninterrogative ? (question)\nexclamative ! (émotion)\nimpérative (ordre)" },
    { recto: "La forme négative", verso: "Deux mots entourent le verbe : ne … pas, ne … jamais, ne … plus, ne … rien.", astuce: "Je ne dors pas." },
    { recto: "Être et avoir au présent", verso: "je suis, tu es, il est, nous sommes, vous êtes, ils sont\nj'ai, tu as, il a, nous avons, vous avez, ils ont" },
    { recto: "Aller et faire au présent", verso: "je vais, tu vas, il va, nous allons, vous allez, ils vont\nje fais, tu fais, il fait, nous faisons, vous faites, ils font" },
    { recto: "Présent des verbes en -er", verso: "Terminaisons : -e, -es, -e, -ons, -ez, -ent", astuce: "je joue, tu joues, il joue, nous jouons, vous jouez, ils jouent" },
    { recto: "a ou à ?", verso: "a = verbe avoir (on peut dire « avait »)\nà = petit mot invariable", astuce: "Il a un vélo. Il va à la plage." },
    { recto: "et ou est ?", verso: "est = verbe être (on peut dire « était »)\net = mot de liaison (on peut dire « et puis »)", astuce: "Le chat est noir et blanc." },
    { recto: "son ou sont ?", verso: "sont = verbe être (on peut dire « étaient »)\nson = déterminant (on peut dire « mon »)", astuce: "Ils sont dans son jardin." },
    { recto: "on ou ont ?", verso: "ont = verbe avoir (on peut dire « avaient »)\non = pronom (on peut dire « il »)", astuce: "On dit qu'ils ont gagné." },
  ];

  /* ================================================================
   * 2. Vocabulaire (synonymes, contraires, familles, préfixes, dictionnaire…)
   * ================================================================ */
  const banqueVocabulaire = [
    // Synonymes
    { q: "Quel est le synonyme de « content » ?", r: "heureux", f: ["triste", "fâché", "fatigué"], e: "Un synonyme a le même sens (ou presque) : content = heureux." },
    { q: "Quel est le synonyme de « commencer » ?", r: "débuter", f: ["finir", "continuer", "arrêter"], e: "commencer = débuter. « finir » est le contraire." },
    { q: "Quel est le synonyme de « une maison » ?", r: "une habitation", f: ["un jardin", "une fenêtre", "une rue"], e: "Une maison est une habitation : un endroit où l'on habite." },
    { q: "Quel est le synonyme de « effrayé » ?", r: "apeuré", f: ["courageux", "calme", "joyeux"], e: "effrayé = qui a peur = apeuré." },
    { q: "Quel est le synonyme de « beau » ?", r: "joli", f: ["laid", "grand", "vieux"], e: "beau = joli. « laid » est le contraire." },
    { q: "Quel est le synonyme de « parler » ?", r: "discuter", f: ["écouter", "se taire", "regarder"], e: "parler avec quelqu'un = discuter." },
    { q: "Quel est le synonyme de « un bateau » ?", r: "un navire", f: ["un avion", "un port", "une voile"], e: "Un navire est un grand bateau." },

    // Contraires
    { q: "Quel est le contraire de « grand » ?", r: "petit", f: ["gros", "haut", "long"], e: "Le contraire (antonyme) de grand est petit." },
    { q: "Quel est le contraire de « ouvrir » ?", r: "fermer", f: ["entrer", "pousser", "tourner"], e: "ouvrir ≠ fermer." },
    { q: "Quel est le contraire de « possible » ?", r: "impossible", f: ["dépossible", "inpossible", "malpossible"], e: "Devant p, b ou m, le préfixe in- devient im- : impossible." },
    { q: "Quel est le contraire de « heureux » ?", r: "malheureux", f: ["inheureux", "déheureux", "imheureux"], e: "Le préfixe mal- forme le contraire : heureux → malheureux." },
    { q: "Quel est le contraire de « monter » ?", r: "descendre", f: ["grimper", "sauter", "rester"], e: "monter ≠ descendre. « grimper » est presque un synonyme de monter." },
    { q: "Quel est le contraire de « le jour » ?", r: "la nuit", f: ["le matin", "le soleil", "la semaine"], e: "le jour ≠ la nuit." },
    { q: "Quel est le contraire de « lisible » ?", r: "illisible", f: ["inlisible", "malisible", "délisible"], e: "Devant l, le préfixe in- devient il- : illisible." },
    { q: "Quel est le contraire de « coller » ?", r: "décoller", f: ["recoller", "incoller", "malcoller"], e: "Le préfixe dé- forme le contraire de certains verbes : coller → décoller." },

    // Familles de mots
    { q: "Quel mot est de la même famille que « dent » ?", r: "dentiste", f: ["danser", "dans", "dinde"], e: "dent, dentiste, dentier : ils ont le même radical « dent » et parlent des dents." },
    { q: "Quel mot est de la même famille que « terre » ?", r: "terrain", f: ["taire", "tirer", "tête"], e: "terre, terrain, terrestre, enterrer : même radical, même idée." },
    { q: "Quel mot n'est pas de la même famille ?\nfleur · fleuriste · fleurir · flûte", r: "flûte", f: ["fleur", "fleuriste", "fleurir"], e: "« flûte » commence pareil mais ne parle pas de fleurs : ce n'est pas la même famille." },
    { q: "Quel mot n'est pas de la même famille ?\nchant · chanter · chanteur · champ", r: "champ", f: ["chant", "chanter", "chanteur"], e: "Un champ est un terrain cultivé : il n'a rien à voir avec le chant." },
    { q: "Quel mot est de la même famille que « jardin » ?", r: "jardinier", f: ["jambe", "jaloux", "jeudi"], e: "Le jardinier s'occupe du jardin : même famille." },

    // Préfixes et suffixes
    { q: "Dans « refaire », quel est le préfixe ?", r: "re-", f: ["-faire", "-aire", "ref-"], e: "Le préfixe se place au début du mot : re- + faire. Il veut dire « de nouveau »." },
    { q: "Que veut dire le préfixe « re- » dans « relire » ?", r: "de nouveau", f: ["le contraire", "avant", "petit"], e: "relire = lire de nouveau." },
    { q: "Dans « boulangerie », que désigne le suffixe « -erie » ?", r: "un lieu (un magasin)", f: ["une personne", "une action", "le contraire"], e: "-erie forme souvent des noms de magasins : boulangerie, pâtisserie, librairie." },
    { q: "Quel suffixe permet de former un nom de métier à partir de « jardin » ?", r: "-ier", f: ["-ette", "-age", "-ment"], e: "jardin + -ier = jardinier (la personne qui s'occupe du jardin)." },
    { q: "Dans « maisonnette », que veut dire le suffixe « -ette » ?", r: "petit", f: ["grand", "plusieurs", "le contraire"], e: "Une maisonnette est une petite maison." },

    // Ordre alphabétique
    { q: "Quel mot vient en premier dans l'ordre alphabétique ?", r: "chat", f: ["cheval", "chien", "chou"], e: "Les trois premières lettres sont « ch » : on compare la 3e lettre. a vient avant e, i et o." },
    { q: "Quel mot vient en premier dans l'ordre alphabétique ?", r: "maison", f: ["marché", "matin", "mouton"], e: "mai… vient avant mar… et mat… (i avant r et t), et ma… avant mo…" },
    { q: "Quel mot vient en dernier dans l'ordre alphabétique ?", r: "voiture", f: ["vélo", "vache", "village"], e: "On compare la 2e lettre : a, e, i, o → vache, vélo, village, voiture." },
    { q: "Quel mot vient en premier dans l'ordre alphabétique ?", r: "pantalon", f: ["papillon", "parapluie", "patin"], e: "On compare la 3e lettre : n, p, r, t → pantalon arrive en premier." },

    // Mots génériques
    { q: "Quel mot générique regroupe « pomme, poire, cerise » ?", r: "des fruits", f: ["des légumes", "des arbres", "des desserts"], e: "Le mot générique désigne toute la catégorie : ce sont des fruits." },
    { q: "Quel mot générique regroupe « marteau, scie, tournevis » ?", r: "des outils", f: ["des jouets", "des meubles", "des armes"], e: "Ce sont des outils." },
    { q: "Quel mot générique regroupe « table, chaise, armoire » ?", r: "des meubles", f: ["des outils", "des pièces", "des objets en fer"], e: "Ce sont des meubles." },
    { q: "Quel mot générique regroupe « bleu, rouge, vert » ?", r: "des couleurs", f: ["des formes", "des peintures", "des drapeaux"], e: "Ce sont des couleurs." },
    { q: "Quel est l'intrus parmi les instruments de musique ?\npiano · guitare · violon · ballon", r: "ballon", f: ["piano", "guitare", "violon"], e: "Le ballon n'est pas un instrument de musique, c'est un jouet." },

    // Dictionnaire, sens, homonymes, niveaux de langue
    { q: "Dans le dictionnaire, quelle abréviation indique un nom ?", r: "n.", f: ["v.", "adj.", "adv."], e: "n. = nom, v. = verbe, adj. = adjectif, adv. = adverbe." },
    { q: "Dans le dictionnaire, que veut dire l'abréviation « v. » ?", r: "verbe", f: ["voir", "vocabulaire", "voyelle"], e: "v. = verbe." },
    { q: "« Il a un cœur de pierre. »\nQue veut dire cette expression ?", r: "Il n'a pas de pitié, il est insensible.", f: ["Son cœur est en pierre.", "Il est très fort.", "Il aime les pierres."], e: "C'est le sens figuré : on compare son cœur à une pierre, dure et froide." },
    { q: "« Il pleut des cordes. »\nQue veut dire cette expression ?", r: "Il pleut très fort.", f: ["Des cordes tombent du ciel.", "Il pleut un peu.", "Il va bientôt pleuvoir."], e: "Expression imagée : la pluie tombe si fort qu'on dirait des cordes." },
    { q: "Complète : « Je bois un … d'eau. »", r: "verre", f: ["vert", "ver", "vers"], e: "verre (récipient), vert (couleur), ver (animal), vers (direction) : ce sont des homonymes." },
    { q: "Complète : « J'ai mal au … »", r: "cou", f: ["coup", "coût", "coud"], e: "le cou (partie du corps), un coup (un choc), le coût (le prix), il coud (verbe coudre)." },
    { q: "Quel mot appartient au langage familier ?", r: "une bagnole", f: ["une voiture", "une automobile", "un véhicule"], e: "« bagnole » est familier ; on dit « voiture » en langage courant." },
    { q: "Quel est le mot courant pour « un bouquin » ?", r: "un livre", f: ["un cahier", "un journal", "une bibliothèque"], e: "« bouquin » est un mot familier pour « livre »." },
  ];

  const fichesVocabulaire = [
    { recto: "Un synonyme", verso: "Un mot qui a le même sens (ou presque) qu'un autre.", astuce: "content = heureux" },
    { recto: "Un contraire (antonyme)", verso: "Un mot de sens opposé.", astuce: "grand ≠ petit, ouvrir ≠ fermer" },
    { recto: "Former un contraire avec un préfixe", verso: "in-, im- (devant p, b, m), il- (devant l), dé-, mal-", astuce: "inconnu, impossible, illisible, décoller, malheureux" },
    { recto: "Une famille de mots", verso: "Des mots construits sur le même radical, qui parlent de la même idée.", astuce: "terre, terrain, terrestre, enterrer" },
    { recto: "Le préfixe", verso: "Il se place au début du mot et change son sens.", astuce: "re- (de nouveau) : refaire, relire" },
    { recto: "Le suffixe", verso: "Il se place à la fin du mot pour former un nouveau mot.", astuce: "-ier (métier) : jardinier\n-ette (petit) : maisonnette" },
    { recto: "L'ordre alphabétique", verso: "Si la 1re lettre est la même, on compare la 2e, puis la 3e…", astuce: "chat < cheval < chien < chou" },
    { recto: "Le mot générique", verso: "Un mot qui désigne toute une catégorie.", astuce: "fruits : pomme, poire, cerise" },
    { recto: "Les abréviations du dictionnaire", verso: "n. = nom\nv. = verbe\nadj. = adjectif\nadv. = adverbe\nm. / f. = masculin / féminin" },
    { recto: "Sens propre et sens figuré", verso: "Sens propre : le sens premier du mot.\nSens figuré : un sens imagé.", astuce: "Une pierre dure (propre) / un cœur de pierre (figuré)" },
    { recto: "Les homonymes", verso: "Des mots qui se prononcent pareil mais ne veulent pas dire la même chose.", astuce: "verre, vert, ver, vers" },
    { recto: "Les niveaux de langue", verso: "familier : une bagnole\ncourant : une voiture\nsoutenu : une automobile" },
  ];

  /* ================================================================
   * 3. Remets dans l'ordre (phrases en désordre, ordre alphabétique)
   * ================================================================ */
  // Phrases à ordre unique : la majuscule et le point indiquent le début et la fin.
  const phrases = [
    "Le petit chat boit du lait .",
    "Ma sœur lit un livre .",
    "Les enfants jouent au ballon .",
    "Le facteur apporte une lettre .",
    "Nous mangeons des pommes rouges .",
    "Tom range sa chambre .",
    "La maîtresse écrit au tableau .",
    "Mon père répare la voiture .",
    "Les oiseaux construisent un nid .",
    "Où est mon cartable ?",
    "As-tu fini tes devoirs ?",
    "Quel beau dessin !",
    "Ferme la porte .",
    "Le boulanger prépare du pain chaud .",
    "Les vaches mangent de l'herbe verte .",
    "Je ne mange pas de bonbons .",
    "Mamie tricote une écharpe bleue .",
    "Le train arrive en gare .",
    "Les élèves écoutent une histoire .",
    "Ma grande sœur joue du piano .",
    "Le lapin blanc mange une carotte .",
    "Quelle heure est-il ?",
    "Le soleil brille dans le ciel bleu .",
    "Mon frère a perdu sa clé .",
    "Les pompiers éteignent le feu .",
  ].map(p => p.split(' '));

  const motsAlphabet = [
    'abeille', 'ami', 'arbre', 'avion', 'anneau', 'assiette',
    'ballon', 'banane', 'bateau', 'bébé', 'bonbon', 'bouteille', 'bus',
    'cahier', 'carotte', 'chat', 'cheval', 'chien', 'citron', 'cochon', 'crayon',
    'dent', 'dessin', 'domino', 'dragon',
    'fée', 'fenêtre', 'feuille', 'fleur', 'fourmi', 'fraise', 'fusée',
    'garçon', 'gâteau', 'girafe', 'glace', 'gomme',
    'lapin', 'lait', 'lampe', 'livre', 'loup', 'lune',
    'maison', 'marché', 'matin', 'mouton', 'montagne', 'musique',
    'pain', 'papillon', 'parapluie', 'pomme', 'poule', 'pirate', 'prince',
    'radis', 'renard', 'robe', 'roi', 'rose', 'ruche',
    'sable', 'salade', 'serpent', 'soleil', 'souris', 'sucre',
    'table', 'tapis', 'tigre', 'tomate', 'train', 'trousse',
    'vache', 'vélo', 'village', 'voiture', 'volcan',
  ];
  const alpha = (a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' });

  function questionPhrase(mots) {
    return U.ordre("Remets les mots dans l'ordre pour former une phrase.", mots,
      "Une phrase commence par une majuscule et se termine par un point (. ? !). Elle doit avoir du sens.", U.phrase);
  }

  function questionAlphabet(nbMots) {
    // Une fois sur deux, des mots qui commencent par la même lettre : il faut regarder la 2e lettre.
    let pool = motsAlphabet;
    if (Math.random() < 0.5) {
      const lettre = U.pick(motsAlphabet)[0];
      const meme = motsAlphabet.filter(m => m[0] === lettre);
      if (meme.length >= nbMots) pool = meme;
    }
    const mots = U.shuffle(pool).slice(0, nbMots).sort(alpha);
    const memeInitiale = mots.every(m => m[0] === mots[0][0]);
    return U.ordre('Range ces mots dans l\'ordre alphabétique.', mots,
      memeInitiale
        ? 'Ils commencent tous par la même lettre : on compare la 2e lettre (puis la 3e si besoin).'
        : 'On compare la première lettre de chaque mot : a, b, c, d…',
      m => m.join(' → '));
  }

  const ordreMots = {
    id: 'ordre', nom: "Remets dans l'ordre", icone: '🔀', couleur: '#f59e0b',
    description: 'Phrases en désordre et mots à ranger dans l\'ordre alphabétique.',
    astuceQuiz: '👆 Touche les mots dans le bon ordre. Touche un mot placé pour le retirer. Au clavier : Retour arrière pour annuler, Entrée pour valider.',
    options: [
      { id: 'exercice', type: 'choix', label: 'Exercice', valeurs: ['les2', 'phrases', 'alphabet'], libelles: ['Les deux', 'Phrases', 'Ordre alphabétique'], defaut: 'les2' },
      { id: 'nbMots', type: 'choix', label: 'Nombre de mots à ranger (ordre alphabétique)', valeurs: [3, 4, 5, 6], defaut: 4 },
    ],

    quiz(n, o) {
      const tirage = U.shuffle(phrases);
      const questions = [];
      for (let i = 0; i < n; i++) {
        const faitPhrase = o.exercice === 'phrases' || (o.exercice === 'les2' && i % 2 === 0);
        if (faitPhrase && tirage.length) {
          questions.push(questionPhrase(tirage.pop()));
        } else if (o.exercice === 'phrases') {
          break; // toutes les phrases ont été posées
        } else {
          questions.push(questionAlphabet(o.nbMots));
        }
      }
      return U.shuffle(questions);
    },

    flashcards(o) {
      const fiches = [
        { recto: 'Une phrase, c\'est…', verso: 'Une suite de mots qui a du sens.\nElle commence par une majuscule et se termine par un point : . ? !' },
        { recto: 'Remettre une phrase en ordre', verso: '1. Cherche le mot avec une majuscule : il va au début.\n2. Le point va à la fin.\n3. Cherche le verbe et son sujet.\n4. Relis la phrase : a-t-elle du sens ?' },
        { recto: 'L\'ordre alphabétique', verso: 'On compare la 1re lettre. Si elle est la même, on compare la 2e, puis la 3e…', astuce: 'chat → cheval → chien → chou' },
        { recto: 'L\'alphabet', verso: 'a b c d e f g h i j k l m\nn o p q r s t u v w x y z' },
      ];
      const exemples = [];
      if (o.exercice !== 'alphabet') U.shuffle(phrases).slice(0, 8).forEach(p => exemples.push(U.versCarte(questionPhrase(p))));
      if (o.exercice !== 'phrases') for (let i = 0; i < 8; i++) exemples.push(U.versCarte(questionAlphabet(o.nbMots)));
      return fiches.concat(exemples);
    },
  };

  const grammaire = COMMUNS.themeBanque({
    id: 'grammaire', nom: 'Grammaire', icone: '✏️', couleur: '#ec4899',
    description: 'Nature des mots, sujet, accords, types de phrases, présent, homophones.',
    banque: banqueGrammaire,
    methodes: fichesGrammaire,
  });

  const vocabulaire = COMMUNS.themeBanque({
    id: 'vocabulaire', nom: 'Vocabulaire', icone: '📖', couleur: '#8b5cf6',
    description: 'Synonymes, contraires, familles de mots, préfixes et suffixes, dictionnaire.',
    banque: banqueVocabulaire,
    methodes: fichesVocabulaire,
  });

  CATALOGUE.ajouterModule('ce2', {
    id: 'francais',
    nom: 'Français',
    icone: '📚',
    couleur: '#ec4899',
    themes: [grammaire, vocabulaire, ordreMots],
  });
})();
