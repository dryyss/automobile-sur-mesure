/* Données de démonstration + petit "magasin" en localStorage.
   Le stock vient de data/vehicules.json (relevé du site actuel, page 1).
   Le back-office de démo écrit dans localStorage : le site public relit
   ces données, donc un changement de statut ou une demande envoyée
   apparaît immédiatement de l'autre côté. */
(function () {
  'use strict';

  var P = 'assets/photos/';

  var BASE = [
    { id: 'porsche-911-gt3-rs-weissach', brand: 'Porsche', model: '911 GT3 RS', version: '992 · 4.0 PDK · Pack Weissach', year: 2023, km: 1500, power: 525, gearbox: 'PDK', fuel: 'Essence', price: 399990, photos: [P + 'gt3rs.jpg'], equipment: ['Pack Weissach'], featured: true },
    { id: 'lamborghini-urus-performante', brand: 'Lamborghini', model: 'Urus Performante', version: '4.0 V8 Biturbo', year: 2025, km: 4990, power: 666, gearbox: 'Automatique', fuel: 'Essence', price: 324990, photos: [P + 'urus.jpg'] },
    { id: 'porsche-911-targa-4-gts-e-hybrid', brand: 'Porsche', model: '911 Targa 4 GTS', version: '992.2 · 3.6 E-Hybrid', year: 2025, km: 7990, power: 541, gearbox: 'PDK', fuel: 'Hybride', price: 259990, photos: [P + 'targa.jpg'] },
    { id: 'porsche-911-gt3-touring', brand: 'Porsche', model: '911 GT3 Touring', version: '992 · 4.0', year: 2023, km: 4490, power: 510, gearbox: null, fuel: 'Essence', price: 259990, photos: [] },
    { id: 'bentley-continental-gtc-centenary', brand: 'Bentley', model: 'Continental GTC', version: 'W12 6.0 · Centenary Edition', year: 2019, km: 19990, power: 635, gearbox: 'Automatique', fuel: 'Essence', price: 229990, photos: [P + 'bentley.jpg'] },
    { id: 'ferrari-portofino', brand: 'Ferrari', model: 'Portofino', version: '3.9 V8', year: 2018, km: 24990, power: 600, gearbox: 'Automatique', fuel: 'Essence', price: 209990, photos: [P + 'portofino.jpg'] },
    { id: 'mercedes-amg-s63-e-performance', brand: 'Mercedes-AMG', model: 'S 63 E Performance', version: 'Limousine · 4.0 V8', year: 2023, km: 19990, power: 802, gearbox: 'Automatique', fuel: 'Hybride', price: 174990, photos: [P + 's63.jpg'] },
    { id: 'audi-rs6-performance', brand: 'Audi', model: 'RS6 Avant Performance', version: '4.0 V8 TFSI', year: 2023, km: 8990, power: 630, gearbox: 'Automatique', fuel: 'Essence', price: 157990, photos: [] },
    { id: 'porsche-911-targa-4-gts-2023', brand: 'Porsche', model: '911 Targa 4 GTS', version: '992 · 3.0', year: 2023, km: 29990, power: 480, gearbox: null, fuel: 'Essence', price: 154992, photos: [] },
    { id: 'mercedes-amg-cle-53', brand: 'Mercedes-AMG', model: 'CLE 53', version: '3.0 6 cylindres', year: 2024, km: 1990, power: 449, gearbox: 'Automatique', fuel: 'Essence', price: 149990, photos: [] },
    { id: 'bmw-m3-cs', brand: 'BMW', model: 'M3 CS', version: 'Berline G80', year: 2023, km: 14990, power: 550, gearbox: 'Automatique', fuel: 'Essence', price: 142990, photos: [] },
    { id: 'porsche-911-carrera-4-gts-cabriolet', brand: 'Porsche', model: '911 Carrera 4 GTS Cabriolet', version: '991 · 3.0 PDK', year: 2017, km: 39990, power: 450, gearbox: 'PDK', fuel: 'Essence', price: 139990, photos: [] },
    { id: 'bmw-xm', brand: 'BMW', model: 'XM', version: 'G09 · 4.4 V8', year: 2023, km: 7450, power: 653, gearbox: 'Automatique', fuel: 'Hybride', price: 134990, photos: [] },
    { id: 'porsche-911-carrera-s-2019', brand: 'Porsche', model: '911 Carrera S', version: '992 · 3.0', year: 2019, km: 44990, power: 450, gearbox: null, fuel: 'Essence', price: 131990, photos: [] },
    { id: 'porsche-911-carrera-s-coupe-pdk', brand: 'Porsche', model: '911 Carrera S Coupé', version: '992 · 3.0 PDK', year: 2019, km: 39990, power: 450, gearbox: 'PDK', fuel: 'Essence', price: 131990, photos: [] },
    { id: 'range-rover-sport-autobiography', brand: 'Land Rover', model: 'Range Rover Sport', version: 'Autobiography · 3.0 P510e', year: 2023, km: 1500, power: 510, gearbox: 'Automatique', fuel: 'Hybride', price: 129990, photos: [] },
    { id: 'audi-rs6-c8', brand: 'Audi', model: 'RS6 Avant', version: 'C8 · 4.0 V8 TFSI', year: 2022, km: 39990, power: 600, gearbox: 'Automatique', fuel: 'Essence', price: 127990, photos: [] },
    { id: 'bentley-bentayga-w12', brand: 'Bentley', model: 'Bentayga', version: '6.0 W12', year: 2017, km: 34990, power: 608, gearbox: 'Automatique', fuel: 'Essence', price: 124990, photos: [] },
    { id: 'bmw-m3-competition-xdrive', brand: 'BMW', model: 'M3 Competition xDrive', version: 'G80 LCI · 3.0', year: 2023, km: 11990, power: 510, gearbox: 'Automatique', fuel: 'Essence', price: 124990, photos: [] },
    { id: 'audi-r8-spyder-v10', brand: 'Audi', model: 'R8 Spyder', version: '5.2 V10', year: 2017, km: 44990, power: 540, gearbox: 'Automatique', fuel: 'Essence', price: 121990, photos: [] }
  ];
  BASE.forEach(function (c) {
    c.status = c.status || 'online';
    c.featured = !!c.featured;
    c.equipment = c.equipment || [];
  });

  /* Données de test : statuts variés pour montrer le back-office.
     Les véhicules marqués example: true sont fictifs (historique de démo). */
  var TEST_STATUS = { 'porsche-911-targa-4-gts-2023': 'reserved', 'bmw-m3-competition-xdrive': 'draft' };
  BASE.forEach(function (c) { if (TEST_STATUS[c.id]) c.status = TEST_STATUS[c.id]; });
  BASE.push(
    { id: 'exemple-porsche-911-turbo-s', brand: 'Porsche', model: '911 Turbo S', version: '992 · 3.7 PDK', year: 2021, km: 18500, power: 650, gearbox: 'PDK', fuel: 'Essence', price: 214990, photos: [], equipment: [], status: 'sold', featured: false, example: true },
    { id: 'exemple-mclaren-720s', brand: 'McLaren', model: '720S Coupé', version: '4.0 V8', year: 2019, km: 21000, power: 720, gearbox: 'Automatique', fuel: 'Essence', price: 219990, photos: [], equipment: [], status: 'sold', featured: false, example: true }
  );

  var SERVICES = [
    { t: 'Recherche personnalisée', d: 'Le modèle, la couleur, les options : nous le trouvons pour vous, en France ou à l\'étranger.' },
    { t: 'Transport et livraison', d: 'Votre véhicule livré chez vous, en camion plateau fermé.' },
    { t: 'Atelier mécanique', d: 'Entretien et révision par des spécialistes du prestige.' },
    { t: 'Carrosserie', d: 'Remise en état dans les règles de l\'art.' },
    { t: 'Detailing', d: 'Préparation esthétique intérieure et extérieure, protection céramique.' },
    { t: 'Administratif', d: 'Carte grise, import, quitus fiscal : les démarches sont prises en charge.' },
    { t: 'Garantie', d: 'Des solutions de garantie adaptées à votre véhicule.' },
    { t: 'Assurance', d: 'Une couverture pensée pour les véhicules d\'exception.' }
  ];

  var SEED_LEADS = [
    { type: 'depot', name: 'Thomas R.', phone: '06 00 00 00 01', email: 'exemple@demo.fr', subject: 'Porsche 911 Carrera S, 2021, 28 000 km', details: { 'Prix souhaité': '125 000 €', Photos: '6 photos' }, hoursAgo: 2 },
    { type: 'rdv', name: 'Sarah K.', phone: '06 00 00 00 02', email: 'exemple@demo.fr', subject: 'Visite · Lamborghini Urus Performante', vehicle: 'lamborghini-urus-performante', details: { Créneau: 'Samedi, 11:00', Reprise: 'Non' }, hoursAgo: 4 },
    { type: 'recherche', name: 'Yanis M.', phone: '06 00 00 00 03', email: 'exemple@demo.fr', subject: 'Cherche Audi RS6 Performance', details: { Budget: '150 000 €', Délai: '3 mois' }, hoursAgo: 22 },
    { type: 'info', name: 'Claire D.', phone: '06 00 00 00 04', email: 'exemple@demo.fr', subject: 'Informations · Ferrari Portofino', vehicle: 'ferrari-portofino', details: { Message: 'Historique d\'entretien disponible ?' }, hoursAgo: 28, status: 'done' },
    { type: 'rdv', name: 'Marc L.', phone: '06 00 00 00 05', email: 'exemple@demo.fr', subject: 'Essai · Porsche 911 GT3 RS', vehicle: 'porsche-911-gt3-rs-weissach', details: { Créneau: 'Vendredi, 15:00', Reprise: 'Oui', Message: 'Reprise possible de ma 718 Cayman GTS ?' }, hoursAgo: 6 },
    { type: 'depot', name: 'Julien P.', phone: '06 00 00 00 06', email: 'exemple@demo.fr', subject: 'Mercedes-AMG GT R, 2018, 32 000 km', details: { 'Prix souhaité': '139 000 €', Photos: '9 photos', Entretien: 'Complet, réseau constructeur' }, hoursAgo: 30 },
    { type: 'recherche', name: 'Nadia B.', phone: '06 00 00 00 07', email: 'exemple@demo.fr', subject: 'Cherche Range Rover Sport SV', details: { Budget: 'Plus de 150 000 €', Délai: '1 à 3 mois', Message: 'Couleur sombre, toit panoramique' }, hoursAgo: 50, status: 'done' },
    { type: 'rdv', name: 'Antoine V.', phone: '06 00 00 00 08', email: 'exemple@demo.fr', subject: 'Visite · Bentley Continental GTC', vehicle: 'bentley-continental-gtc-centenary', details: { Créneau: 'Samedi, 14:00', Reprise: 'Non' }, hoursAgo: 75, status: 'done' },
    { type: 'info', name: 'Sophie G.', phone: '06 00 00 00 09', email: 'exemple@demo.fr', subject: 'Informations · Audi RS6 Avant Performance', vehicle: 'audi-rs6-performance', details: { Message: 'Le véhicule est-il garanti ? Livraison à Lyon possible ?' }, hoursAgo: 96 }
  ];

  var K = { stock: 'asm:stock:v3', leads: 'asm:leads:v3', favs: 'asm:favs' };

  function read(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function write(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function fmt(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  var store = {
    keys: K,
    getStock: function () { return read(K.stock, null) || clone(BASE); },
    saveStock: function (list) { return write(K.stock, list); },
    publicStock: function () { return store.getStock().filter(function (c) { return c.status === 'online' || c.status === 'reserved'; }); },
    getCar: function (id) { return store.getStock().filter(function (c) { return c.id === id; })[0] || null; },
    featured: function () {
      var pub = store.publicStock();
      return pub.filter(function (c) { return c.featured; })[0] || pub[0];
    },
    getLeads: function () {
      var l = read(K.leads, null);
      if (!l) {
        var now = Date.now();
        l = SEED_LEADS.slice().sort(function (a, b) { return a.hoursAgo - b.hoursAgo; }).map(function (s, i) {
          var o = clone(s);
          o.id = 'seed-' + i;
          o.example = true;
          o.status = s.status || 'new';
          o.createdAt = new Date(now - s.hoursAgo * 3600e3).toISOString();
          delete o.hoursAgo;
          return o;
        });
        write(K.leads, l);
      }
      return l;
    },
    saveLeads: function (l) { return write(K.leads, l); },
    addLead: function (lead) {
      var l = store.getLeads();
      lead.id = 'l-' + Date.now().toString(36);
      lead.createdAt = new Date().toISOString();
      lead.status = 'new';
      l.unshift(lead);
      write(K.leads, l);
      return lead;
    },
    getFavs: function () { return read(K.favs, []); },
    toggleFav: function (id) {
      var f = store.getFavs();
      var i = f.indexOf(id);
      if (i >= 0) f.splice(i, 1); else f.push(id);
      write(K.favs, f);
      return i < 0;
    },
    reset: function () {
      try { localStorage.removeItem(K.stock); localStorage.removeItem(K.leads); } catch (e) {}
    }
  };

  window.ASM = {
    BASE: BASE,
    SERVICES: SERVICES,
    SEED_LEADS: SEED_LEADS,
    // Mensualité d'un crédit classique (utilisée par la fiche véhicule)
    monthly: function (capital, months, annualRatePct) {
      var r = annualRatePct / 100 / 12;
      return r ? capital * r / (1 - Math.pow(1 + r, -months)) : capital / months;
    },
    store: store,
    price: function (n) { return fmt(n) + ' €'; },
    km: function (n) { return fmt(n) + ' km'; },
    num: fmt,
    title: function (c) { return c.brand + ' ' + c.model; },
    brands: function (list) {
      var seen = {};
      (list || BASE).forEach(function (c) { seen[c.brand] = (seen[c.brand] || 0) + 1; });
      return Object.keys(seen).sort(function (a, b) { return seen[b] - seen[a] || a.localeCompare(b); }).map(function (b) { return { name: b, count: seen[b] }; });
    },
    phone: '06 87 42 64 46',
    tel: '+33687426446',
    whatsapp: 'https://wa.me/33687426446',
    email: 'contact@automobilesurmesure.com',
    address: '8 avenue Roland Moreno, 95740 Frépillon',
    maps: 'https://www.google.com/maps/search/?api=1&query=8+avenue+Roland+Moreno+95740+Fr%C3%A9pillon',
    // Mardi (2) à samedi (6), 10h-12h et 13h-19h
    hours: { days: [2, 3, 4, 5, 6], ranges: [[10, 12], [13, 19]] }
  };
})();
