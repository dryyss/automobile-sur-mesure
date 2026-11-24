// Tests de la couche de données (js/data.js) : stock, demandes, favoris, calculs.
const test = require('node:test');
const assert = require('node:assert/strict');
const { loadASM, fakeStorage } = require('./helpers');

test('le stock de départ est complet et cohérent', () => {
  const { ASM } = loadASM();
  const stock = ASM.store.getStock();
  assert.ok(stock.length >= 20, 'au moins les 20 véhicules relevés');
  const ids = new Set();
  for (const c of stock) {
    assert.ok(c.id && /^[a-z0-9-]+$/.test(c.id), `identifiant valide : ${c.id}`);
    assert.ok(!ids.has(c.id), `identifiant unique : ${c.id}`);
    ids.add(c.id);
    assert.ok(c.brand && c.model, `marque et modèle : ${c.id}`);
    assert.ok(Number.isInteger(c.year) && c.year > 1950 && c.year <= 2027, `année : ${c.id}`);
    assert.ok(c.km >= 0 && c.price > 0, `km et prix : ${c.id}`);
    assert.ok(['online', 'reserved', 'sold', 'draft'].includes(c.status), `statut : ${c.id}`);
    assert.ok(Array.isArray(c.photos) && Array.isArray(c.equipment), `tableaux : ${c.id}`);
  }
});

test('un seul véhicule à la une', () => {
  const { ASM } = loadASM();
  assert.equal(ASM.store.getStock().filter((c) => c.featured).length, 1);
  assert.equal(ASM.store.featured().id, 'porsche-911-gt3-rs-weissach');
});

test('le site public masque les véhicules vendus et les brouillons', () => {
  const { ASM } = loadASM();
  const pub = ASM.store.publicStock();
  assert.ok(pub.length > 0);
  assert.ok(pub.every((c) => c.status === 'online' || c.status === 'reserved'));
  assert.ok(!pub.some((c) => c.id === 'bmw-m3-competition-xdrive'), 'brouillon masqué');
  assert.ok(!pub.some((c) => c.example), 'exemples vendus masqués');
  assert.ok(pub.some((c) => c.status === 'reserved'), 'un réservé de test est visible');
});

test('un changement de statut côté back-office se répercute sur le site', () => {
  const storage = fakeStorage();
  const { ASM } = loadASM(storage);
  const list = ASM.store.getStock();
  list.find((c) => c.id === 'ferrari-portofino').status = 'sold';
  ASM.store.saveStock(list);
  // Nouvelle "page" qui relit le même navigateur
  const { ASM: site } = loadASM(storage);
  assert.ok(!site.store.publicStock().some((c) => c.id === 'ferrari-portofino'));
  assert.equal(site.store.getCar('ferrari-portofino').status, 'sold');
});

test('la une retombe sur le premier véhicule public si le vedette est vendu', () => {
  const storage = fakeStorage();
  const { ASM } = loadASM(storage);
  const list = ASM.store.getStock();
  list.find((c) => c.featured).status = 'sold';
  ASM.store.saveStock(list);
  const f = ASM.store.featured();
  assert.ok(f, 'il y a toujours un véhicule à afficher');
  assert.notEqual(f.status, 'sold');
});

test('les demandes de test sont créées une fois, puis les nouvelles passent devant', () => {
  const storage = fakeStorage();
  const { ASM } = loadASM(storage);
  const seeds = ASM.store.getLeads();
  assert.equal(seeds.length, ASM.SEED_LEADS.length);
  assert.ok(seeds.every((l) => l.example && l.id && l.createdAt));
  assert.ok(seeds.some((l) => l.status === 'new') && seeds.some((l) => l.status === 'done'));

  const lead = ASM.store.addLead({ type: 'rdv', name: 'Test', phone: '0600000000', subject: 'Essai' });
  assert.equal(lead.status, 'new');
  const { ASM: admin } = loadASM(storage);
  const leads = admin.store.getLeads();
  assert.equal(leads.length, seeds.length + 1);
  assert.equal(leads[0].id, lead.id, 'la dernière demande arrive en tête');
});

test('les types de demandes sont connus du back-office', () => {
  const { ASM } = loadASM();
  for (const l of ASM.store.getLeads()) {
    assert.ok(['depot', 'rdv', 'recherche', 'info'].includes(l.type), l.type);
    if (l.vehicle) assert.ok(ASM.store.getCar(l.vehicle), `véhicule lié existant : ${l.vehicle}`);
  }
});

test('favoris : ajout puis retrait', () => {
  const { ASM } = loadASM();
  assert.equal(ASM.store.toggleFav('bmw-xm'), true);
  assert.deepEqual([...ASM.store.getFavs()], ['bmw-xm']);
  assert.equal(ASM.store.toggleFav('bmw-xm'), false);
  assert.equal(ASM.store.getFavs().length, 0);
});

test('la réinitialisation rend les données de départ', () => {
  const storage = fakeStorage();
  const { ASM } = loadASM(storage);
  ASM.store.saveStock([]);
  ASM.store.addLead({ type: 'info', name: 'X', phone: '0600000000', subject: 'Y' });
  ASM.store.reset();
  assert.equal(ASM.store.getStock().length, ASM.BASE.length);
  assert.equal(ASM.store.getLeads().length, ASM.SEED_LEADS.length);
});

test('localStorage indisponible : le site fonctionne avec les données de base', () => {
  const broken = { getItem() { throw new Error('bloqué'); }, setItem() { throw new Error('bloqué'); }, removeItem() {} };
  const { ASM } = loadASM(broken);
  assert.ok(ASM.store.publicStock().length > 0);
  assert.equal(ASM.store.saveStock([]), false);
});

test('formatage des prix et kilométrages', () => {
  const { ASM } = loadASM();
  assert.equal(ASM.price(399990), '399 990 €');
  assert.equal(ASM.km(1500), '1 500 km');
  assert.equal(ASM.num(999), '999');
});

test('simulateur de financement', () => {
  const { ASM } = loadASM();
  // 100 000 € sur 60 mois à 6 % : 1 933,28 €/mois (formule standard)
  assert.equal(Math.round(ASM.monthly(100000, 60, 6) * 100) / 100, 1933.28);
  assert.equal(ASM.monthly(12000, 12, 0), 1000, 'taux nul');
  assert.ok(ASM.monthly(100000, 84, 5.9) < ASM.monthly(100000, 48, 5.9), 'plus long = mensualité plus faible');
});

test('liste des marques triée par nombre de véhicules', () => {
  const { ASM } = loadASM();
  const b = ASM.brands(ASM.store.publicStock());
  assert.equal(b[0].name, 'Porsche');
  for (let i = 1; i < b.length; i++) assert.ok(b[i - 1].count >= b[i].count);
});
