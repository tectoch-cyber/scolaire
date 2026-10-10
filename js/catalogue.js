/*
 * Catalogue des niveaux. Un niveau sans module s'affiche « Bientôt ».
 * Pour ajouter du contenu : créer js/niveaux/<niveau>/<module>.js qui appelle
 * CATALOGUE.ajouterModule('<niveau>', { ... }) et l'inclure dans index.html.
 */
window.CATALOGUE = {
  niveaux: [
    { id: 'cp',  nom: 'CP',  sousTitre: 'Cours préparatoire',   emoji: '✏️', couleur: '#f59e0b', modules: [] },
    { id: 'ce1', nom: 'CE1', sousTitre: 'Cours élémentaire 1',  emoji: '📏', couleur: '#ec4899', modules: [] },
    { id: 'ce2', nom: 'CE2', sousTitre: 'Cours élémentaire 2',  emoji: '📐', couleur: '#8b5cf6', modules: [] },
    { id: 'cm1', nom: 'CM1', sousTitre: 'Cours moyen 1',        emoji: '📘', couleur: '#0ea5e9', modules: [] },
    { id: 'cm2', nom: 'CM2', sousTitre: 'Cours moyen 2',        emoji: '🚀', couleur: '#6c5ce7', modules: [] },
    { id: '6e',  nom: '6e',  sousTitre: 'Sixième',              emoji: '🏫', couleur: '#10b981', modules: [] },
  ],

  ajouterModule(niveauId, module) {
    const niveau = this.niveaux.find(n => n.id === niveauId);
    if (!niveau) throw new Error('Niveau inconnu : ' + niveauId);
    niveau.modules.push(module);
  },
};
