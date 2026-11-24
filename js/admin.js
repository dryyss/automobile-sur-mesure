/* Back-office de démonstration : tout est stocké dans localStorage,
   le site public relit les mêmes données (js/data.js). */
(function () {
  'use strict';

  var A = window.ASM;
  var S = A.store;
  var doc = document;
  function $(s, el) { return (el || doc).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var STATUS = { online: 'En ligne', reserved: 'Réservé', sold: 'Vendu', draft: 'Brouillon' };
  var TYPES = { depot: 'Dépôt-vente', rdv: 'Rendez-vous', recherche: 'Recherche', info: 'Info véhicule' };
  var STAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" stroke-linejoin="round"/></svg>';

  var state = { view: 'tableau', q: '', st: '', tab: 'all', lead: null };
  var lastLeadCount = S.getLeads().length;

  /* ---------- Utilitaires ---------- */
  function toast(msg) {
    var box = $('.atoasts');
    var el = doc.createElement('div');
    el.className = 'atoast';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () { el.classList.add('is-out'); setTimeout(function () { el.remove(); }, 400); }, 3000);
  }
  function ago(iso) {
    var d = new Date(iso);
    var s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return 'À l\'instant';
    if (s < 3600) return 'Il y a ' + Math.floor(s / 60) + ' min';
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var hm = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    if (d >= today) return 'Aujourd\'hui, ' + hm;
    var y = new Date(today); y.setDate(y.getDate() - 1);
    if (d >= y) return 'Hier, ' + hm;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) + ', ' + hm;
  }
  function thumb(c) {
    return '<span class="thumbx">' + (c.photos && c.photos[0] ? '<img src="' + esc(c.photos[0]) + '" alt="">' : 'ASM') + '</span>';
  }
  function slug(s) {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function badges() {
    var stock = S.getStock();
    var pending = S.getLeads().filter(function (l) { return l.status === 'new'; }).length;
    $('[data-badge-stock]').textContent = stock.filter(function (c) { return c.status === 'online' || c.status === 'reserved'; }).length;
    var b = $('[data-badge-leads]');
    var prev = b.textContent;
    b.textContent = pending ? String(pending) : '';
    if (prev && +prev < pending) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }

  /* ---------- Navigation ---------- */
  function go(view) {
    if (['tableau', 'vehicules', 'demandes'].indexOf(view) < 0) view = 'tableau';
    state.view = view;
    $$('.view').forEach(function (v) { v.classList.toggle('is-active', v.id === 'v-' + view); });
    $$('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === view) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    render();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', function () { go(location.hash.slice(1)); });

  function render() {
    badges();
    if (state.view === 'tableau') renderDash();
    if (state.view === 'vehicules') renderStock();
    if (state.view === 'demandes') renderLeads();
  }

  /* ---------- Tableau de bord ---------- */
  function renderDash() {
    var stock = S.getStock();
    var leads = S.getLeads();
    var live = stock.filter(function (c) { return c.status === 'online' || c.status === 'reserved'; });
    var online = stock.filter(function (c) { return c.status === 'online'; }).length;
    var reserved = stock.filter(function (c) { return c.status === 'reserved'; }).length;
    var value = live.reduce(function (a, c) { return a + c.price; }, 0);
    var pending = leads.filter(function (l) { return l.status === 'new'; }).length;
    var f = S.featured();

    var brands = {};
    live.forEach(function (c) { brands[c.brand] = (brands[c.brand] || 0) + c.price; });
    var bl = Object.keys(brands).map(function (b) { return { b: b, v: brands[b], n: live.filter(function (c) { return c.brand === b; }).length }; }).sort(function (a, b) { return b.v - a.v; });
    var max = bl.length ? bl[0].v : 1;

    $('#v-tableau').innerHTML =
      '<div class="head"><div><p>' + new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + '</p><h1 id="h-tableau">Bonjour</h1></div>' +
        '<div class="toolbar"><a class="abtn" href="index.html" target="_blank" rel="noopener">Voir le site ↗</a><button class="abtn abtn--dark" type="button" data-add>+ Ajouter un véhicule</button></div></div>' +
      '<div class="tip"><span class="tip__dot"></span><span><b>Démo en direct :</b> ouvrez le <a href="contact.html" target="_blank" rel="noopener">site dans un autre onglet</a>, envoyez une demande, elle arrive ici sans recharger. Changez un statut ici, il change sur le site.</span></div>' +
      '<div class="kpis">' +
        '<div class="kpi" style="--d:0s"><span>En ligne</span><strong>' + online + '</strong><small>véhicules visibles sur le site</small></div>' +
        '<div class="kpi" style="--d:.06s"><span>Réservés</span><strong>' + reserved + '</strong><small>affichés avec un badge</small></div>' +
        '<div class="kpi" style="--d:.12s"><span>Valeur du stock</span><strong>' + A.price(value) + '</strong><small>prix affichés, TTC</small></div>' +
        '<div class="kpi" style="--d:.18s"><span>Demandes à traiter</span><strong>' + pending + '</strong><small>' + leads.length + ' au total</small></div>' +
      '</div>' +
      '<div class="grid2">' +
        '<div class="card"><div class="card__head"><h2>Dernières demandes</h2><a href="#demandes">Tout voir</a></div><div>' +
          (leads.slice(0, 5).map(leadRow).join('') || '<div class="empty-a">Aucune demande pour l\'instant.</div>') +
        '</div></div>' +
        '<div style="display:flex;flex-direction:column;gap:16px">' +
          (f ? '<div class="card"><div class="card__head"><h2>À la une sur l\'accueil</h2><a href="#vehicules">Changer</a></div><div class="card__body feat">' + (f.photos[0] ? '<img src="' + esc(f.photos[0]) + '" alt="">' : '<span class="ph"></span>') +
            '<div><b style="display:block;font-weight:600">' + esc(A.title(f)) + '</b><span style="color:#555;font-size:13px">' + f.year + ' · ' + A.km(f.km) + '</span><br><span style="font-weight:600">' + A.price(f.price) + '</span></div></div></div>' : '') +
          '<div class="card"><div class="card__head"><h2>Stock par marque</h2></div><div class="card__body bars">' +
            bl.map(function (x) { return '<div class="bar"><span>' + esc(x.b) + ' <small style="color:#999">(' + x.n + ')</small></span><span class="bar__track"><span class="bar__fill" data-w="' + (x.v / max * 100) + '"></span></span><span>' + A.price(x.v) + '</span></div>'; }).join('') +
          '</div></div>' +
        '</div>' +
      '</div>';
    var fills = $$('.bar__fill');
    void doc.body.offsetWidth; // force le rendu à 0 pour que la transition se joue
    fills.forEach(function (b) { b.style.width = b.getAttribute('data-w') + '%'; });
  }

  function leadRow(l) {
    var fresh = l.status === 'new' && !l.example && (Date.now() - new Date(l.createdAt).getTime()) < 15 * 60e3;
    return '<button type="button" class="lead' + (l.status === 'done' ? ' is-done' : '') + (l._fresh ? ' is-fresh' : '') + '" data-lead="' + esc(l.id) + '"' + (state.lead === l.id ? ' aria-current="true"' : '') + '>' +
      '<span class="tag tag--' + l.type + '">' + TYPES[l.type] + '</span>' +
      '<span class="lead__who"><b>' + (l.status === 'new' ? '<span class="new-dot" aria-label="Nouvelle"></span>' : '') + esc(l.name) + (l.example ? ' <span class="ex">exemple</span>' : '') + (fresh ? ' <span class="ex" style="color:#d9480f;border-color:#f3c9b5">nouveau</span>' : '') + '</b><span>' + esc(l.subject) + '</span></span>' +
      '<time datetime="' + esc(l.createdAt) + '">' + ago(l.createdAt) + '</time></button>';
  }

  /* ---------- Véhicules ---------- */
  function renderStock() {
    var host = $('#v-vehicules');
    if (!$('.table-wrap', host)) {
      host.innerHTML =
        '<div class="head"><div><p>Les véhicules « Vendu » et « Brouillon » ne s\'affichent pas sur le site.</p><h1 id="h-vehicules">Véhicules</h1></div><button class="abtn abtn--dark" type="button" data-add>+ Ajouter un véhicule</button></div>' +
        '<div class="toolbar"><input class="ainput" type="search" placeholder="Rechercher un modèle…" data-q aria-label="Rechercher"><select class="aselect" data-st aria-label="Filtrer par statut"><option value="">Tous les statuts</option><option value="online">En ligne</option><option value="reserved">Réservé</option><option value="sold">Vendu</option><option value="draft">Brouillon</option></select><span data-stock-count style="font-size:13px;color:#777"></span></div>' +
        '<div class="table-wrap"><table class="t"><thead><tr><th>Véhicule</th><th>Année</th><th>Km</th><th>Prix</th><th>Statut</th><th>À la une</th><th style="text-align:right">Actions</th></tr></thead><tbody data-tbody></tbody></table></div>';
      $('[data-q]', host).addEventListener('input', function (e) { state.q = e.target.value.trim().toLowerCase(); fillStock(); });
      $('[data-st]', host).addEventListener('change', function (e) { state.st = e.target.value; fillStock(); });
    }
    fillStock();
  }
  function fillStock(flashId) {
    var list = S.getStock().filter(function (c) {
      if (state.st && c.status !== state.st) return false;
      if (state.q && (c.brand + ' ' + c.model + ' ' + c.version).toLowerCase().indexOf(state.q) < 0) return false;
      return true;
    });
    $('[data-stock-count]').textContent = list.length + ' véhicule' + (list.length > 1 ? 's' : '');
    $('[data-tbody]').innerHTML = list.map(function (c) {
      return '<tr data-row="' + esc(c.id) + '"' + (flashId === c.id ? ' class="flash"' : '') + '>' +
        '<td><div class="veh">' + thumb(c) + '<div><b>' + esc(c.brand) + ' ' + esc(c.model) + (c.example ? ' <span class="ex">exemple</span>' : '') + '</b><small>' + esc(c.version || '') + '</small></div></div></td>' +
        '<td class="num">' + esc(c.year) + '</td><td class="num">' + A.num(c.km) + '</td><td class="price">' + A.price(c.price) + '</td>' +
        '<td><select class="pill" data-s="' + c.status + '" data-status="' + esc(c.id) + '" aria-label="Statut">' +
          Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (k === c.status ? ' selected' : '') + '>' + STATUS[k] + '</option>'; }).join('') + '</select></td>' +
        '<td><button class="star' + (c.featured ? ' is-on' : '') + '" type="button" data-star="' + esc(c.id) + '" aria-pressed="' + !!c.featured + '" aria-label="Mettre à la une">' + STAR + '</button></td>' +
        '<td class="acts"><a href="vehicule.html?v=' + encodeURIComponent(c.id) + '" target="_blank" rel="noopener">Voir</a><button class="abtn abtn--sm" type="button" data-edit="' + esc(c.id) + '">Modifier</button></td></tr>';
    }).join('') || '<tr><td colspan="7" class="empty-a">Aucun véhicule.</td></tr>';
  }

  function updateCar(id, fn) {
    var list = S.getStock();
    list.forEach(function (c) { if (c.id === id) fn(c, list); });
    S.saveStock(list);
  }

  doc.addEventListener('change', function (e) {
    var sel = e.target.closest('[data-status]');
    if (!sel) return;
    var id = sel.getAttribute('data-status');
    updateCar(id, function (c) { c.status = sel.value; });
    sel.setAttribute('data-s', sel.value);
    var msg = { online: 'visible sur le site', reserved: 'affiché « Réservé » sur le site', sold: 'retiré du site', draft: 'masqué (brouillon)' }[sel.value];
    toast('Statut mis à jour : ' + msg);
    badges();
  });

  doc.addEventListener('click', function (e) {
    var t = e.target;
    var star = t.closest('[data-star]');
    if (star) {
      var id = star.getAttribute('data-star');
      var on = !star.classList.contains('is-on');
      var list = S.getStock();
      list.forEach(function (c) { c.featured = on ? c.id === id : (c.id === id ? false : c.featured); });
      S.saveStock(list);
      fillStock();
      var car = S.getCar(id);
      toast(on ? A.title(car) + ' est à la une sur l\'accueil' : 'Retiré de la une');
      return;
    }
    var ed = t.closest('[data-edit]');
    if (ed) { openCar(ed.getAttribute('data-edit')); return; }
    if (t.closest('[data-add]')) { openCar(null); return; }
    var ld = t.closest('[data-lead]');
    if (ld) {
      state.lead = ld.getAttribute('data-lead');
      if (state.view !== 'demandes') { location.hash = 'demandes'; return; }
      renderLeads();
      var d = $('.detail');
      if (d && window.innerWidth < 1100) d.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    var tab = t.closest('[data-tab]');
    if (tab) { state.tab = tab.getAttribute('data-tab'); renderLeads(); return; }
    var done = t.closest('[data-done]');
    if (done) {
      var lid = done.getAttribute('data-done');
      var leads = S.getLeads();
      leads.forEach(function (l) { if (l.id === lid) l.status = l.status === 'done' ? 'new' : 'done'; });
      S.saveLeads(leads);
      renderLeads();
      badges();
      return;
    }
    var del = t.closest('[data-del-lead]');
    if (del && confirm('Supprimer cette demande ?')) {
      var did = del.getAttribute('data-del-lead');
      S.saveLeads(S.getLeads().filter(function (l) { return l.id !== did; }));
      state.lead = null;
      renderLeads();
      badges();
      toast('Demande supprimée');
      return;
    }
    if (t.closest('[data-reset-demo]') && confirm('Revenir aux données de départ (stock et demandes) ?')) {
      S.reset();
      state = { view: state.view, q: '', st: '', tab: 'all', lead: null };
      $('#v-vehicules').innerHTML = '';
      lastLeadCount = S.getLeads().length;
      render();
      toast('Démo réinitialisée');
    }
  });

  /* ---------- Fiche véhicule (ajout / modification) ---------- */
  var modal = $('#car-modal');
  var form = $('#car-form');
  var editing = null;
  var photos = [];

  function opt(list, val) {
    return list.map(function (o) { return '<option' + (o === val ? ' selected' : '') + '>' + o + '</option>'; }).join('');
  }
  function openCar(id) {
    var c = id ? S.getCar(id) : { brand: '', model: '', version: '', year: new Date().getFullYear(), km: '', power: '', gearbox: 'Automatique', fuel: 'Essence', price: '', status: 'online', featured: false, photos: [], equipment: [], maskPlate: true, studio: true };
    editing = id;
    photos = (c.photos || []).slice();
    var brands = A.brands(S.getStock()).map(function (b) { return b.name; });
    form.innerHTML =
      '<div class="amodal__head"><div><p style="margin:0;font-size:12px;color:#777">' + (id ? 'Modifier' : 'Nouveau véhicule') + '</p><h2 id="car-modal-t">' + (id ? esc(A.title(c)) : 'Ajouter un véhicule') + '</h2></div>' +
        '<div class="toolbar"><button class="abtn abtn--ghost" type="button" data-close>Annuler</button><button class="abtn abtn--dark" type="submit">' + (id ? 'Enregistrer' : 'Publier sur le site') + '</button></div></div>' +
      '<div class="amodal__body">' +
        '<fieldset class="fs"><legend>Informations</legend>' +
          '<label class="afield">Marque<input class="ainput" name="brand" list="brand-list" value="' + esc(c.brand) + '" required><datalist id="brand-list">' + brands.map(function (b) { return '<option value="' + esc(b) + '">'; }).join('') + '</datalist></label>' +
          '<label class="afield">Modèle<input class="ainput" name="model" value="' + esc(c.model) + '" placeholder="911 GT3 RS" required></label>' +
          '<label class="afield full">Version<input class="ainput" name="version" value="' + esc(c.version || '') + '" placeholder="992 · 4.0 PDK · Pack Weissach"></label>' +
          '<label class="afield">Année<input class="ainput" name="year" type="number" min="1950" max="2030" value="' + esc(c.year) + '" required></label>' +
          '<label class="afield">Kilométrage<input class="ainput" name="km" type="number" min="0" value="' + esc(c.km) + '" required></label>' +
          '<label class="afield">Puissance (ch)<input class="ainput" name="power" type="number" min="0" value="' + esc(c.power || '') + '"></label>' +
          '<label class="afield">Prix (€ TTC)<input class="ainput" name="price" type="number" min="0" step="10" value="' + esc(c.price) + '" required></label>' +
          '<label class="afield">Boîte<select class="aselect" name="gearbox">' + opt(['Automatique', 'PDK', 'Manuelle', 'À préciser'], c.gearbox || 'À préciser') + '</select></label>' +
          '<label class="afield">Énergie<select class="aselect" name="fuel">' + opt(['Essence', 'Hybride', 'Diesel', 'Électrique'], c.fuel) + '</select></label>' +
          '<label class="afield">Couleur<input class="ainput" name="color" value="' + esc(c.color || '') + '"></label>' +
          '<label class="afield">Garantie<input class="ainput" name="warranty" value="' + esc(c.warranty || '') + '" placeholder="12 mois"></label>' +
          '<label class="afield">Statut<select class="aselect" name="status">' + Object.keys(STATUS).map(function (k) { return '<option value="' + k + '"' + (k === c.status ? ' selected' : '') + '>' + STATUS[k] + '</option>'; }).join('') + '</select></label>' +
          '<label class="afield full">Équipements (un par ligne)<textarea class="atextarea" name="equipment" rows="4">' + esc((c.equipment || []).join('\n')) + '</textarea></label>' +
          '<label class="acheck full"><input type="checkbox" name="featured"' + (c.featured ? ' checked' : '') + '>Mettre en avant sur la page d\'accueil (« À la une »)</label>' +
        '</fieldset>' +
        '<fieldset class="fs" style="grid-template-columns:1fr"><legend>Photos</legend>' +
          '<div class="photos" data-photos></div>' +
          '<label class="adrop" data-adrop><b>Glissez vos photos ici</b><span>ou cliquez pour les ajouter · la première est la photo principale</span><input type="file" accept="image/*" multiple style="position:absolute;opacity:0;pointer-events:none;width:1px"></label>' +
          '<label class="switch"><span><b>Masquer la plaque</b><small>Détection et masquage automatiques à l\'enregistrement</small></span><input type="checkbox" name="maskPlate"' + (c.maskPlate !== false ? ' checked' : '') + '></label>' +
          '<label class="switch"><span><b>Fond studio</b><small>Remplace le décor par le fond showroom (l\'original est conservé)</small></span><input type="checkbox" name="studio"' + (c.studio !== false ? ' checked' : '') + '></label>' +
        '</fieldset>' +
        (id ? '<div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap"><a class="abtn" href="vehicule.html?v=' + encodeURIComponent(id) + '" target="_blank" rel="noopener">Voir la fiche ↗</a><button class="abtn abtn--danger" type="button" data-delete>Supprimer ce véhicule</button></div>' : '') +
      '</div>';
    renderPhotos();
    var drop = $('[data-adrop]', form);
    var input = $('input[type=file]', drop);
    input.addEventListener('change', function () { addPhotos(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
    drop.addEventListener('drop', function (e) { addPhotos(e.dataTransfer.files); });
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    doc.body.style.overflow = 'hidden';
    setTimeout(function () { var f = $('input[name=' + (id ? 'price' : 'brand') + ']', form); if (f) f.focus(); }, 80);
  }
  function closeCar() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    doc.body.style.overflow = '';
  }
  function renderPhotos(processingFrom) {
    $('[data-photos]', form).innerHTML = photos.map(function (p, i) {
      return '<div class="ph-item' + (processingFrom != null && i >= processingFrom ? ' is-processing' : '') + '"><img src="' + esc(p) + '" alt="Photo ' + (i + 1) + '">' + (i === 0 ? '<span class="main">Principale</span>' : '') + '<button class="rm" type="button" data-rm-photo="' + i + '" aria-label="Retirer la photo ' + (i + 1) + '">×</button></div>';
    }).join('');
  }
  function compress(file) {
    return new Promise(function (resolve) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var max = 1400;
        var r = Math.min(1, max / Math.max(img.width, img.height));
        var cv = doc.createElement('canvas');
        cv.width = Math.round(img.width * r);
        cv.height = Math.round(img.height * r);
        cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
        URL.revokeObjectURL(url);
        resolve(cv.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = function () { URL.revokeObjectURL(url); resolve(null); };
      img.src = url;
    });
  }
  function addPhotos(files) {
    var list = Array.prototype.slice.call(files).filter(function (f) { return /^image\//.test(f.type); }).slice(0, 10);
    var from = photos.length;
    Promise.all(list.map(compress)).then(function (res) {
      res.forEach(function (d) { if (d) photos.push(d); });
      renderPhotos(from);
    });
  }
  form.addEventListener('click', function (e) {
    var rm = e.target.closest('[data-rm-photo]');
    if (rm) { photos.splice(+rm.getAttribute('data-rm-photo'), 1); renderPhotos(); return; }
    if (e.target.closest('[data-close]')) { closeCar(); return; }
    if (e.target.closest('[data-delete]') && confirm('Supprimer définitivement ce véhicule ?')) {
      S.saveStock(S.getStock().filter(function (c) { return c.id !== editing; }));
      closeCar();
      render();
      toast('Véhicule supprimé');
    }
  });
  modal.addEventListener('click', function (e) { if (e.target === modal) closeCar(); });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeCar(); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var el = form.elements;
    var bad = null;
    ['brand', 'model', 'year', 'km', 'price'].forEach(function (n) {
      var f = el[n].closest('.afield');
      var ko = !el[n].value.trim();
      f.classList.toggle('is-error', ko);
      if (ko && !bad) bad = el[n];
    });
    if (bad) { bad.focus(); toast('Complétez les champs obligatoires'); return; }
    var data = {
      brand: el.brand.value.trim(), model: el.model.value.trim(), version: el.version.value.trim(),
      year: +el.year.value, km: +el.km.value, power: +el.power.value || null, price: +el.price.value,
      gearbox: el.gearbox.value === 'À préciser' ? null : el.gearbox.value, fuel: el.fuel.value,
      color: el.color.value.trim() || null, warranty: el.warranty.value.trim() || null, status: el.status.value,
      featured: el.featured.checked, maskPlate: el.maskPlate.checked, studio: el.studio.checked,
      equipment: el.equipment.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
      photos: photos.slice()
    };
    var list = S.getStock();
    var id = editing;
    if (id) {
      list = list.map(function (c) { return c.id === id ? Object.assign({}, c, data) : c; });
    } else {
      id = slug(data.brand + '-' + data.model + '-' + data.year);
      var base = id, n = 2;
      while (list.some(function (c) { return c.id === id; })) id = base + '-' + n++;
      data.id = id;
      list.unshift(data);
    }
    if (data.featured) list.forEach(function (c) { if (c.id !== id) c.featured = false; });
    if (!S.saveStock(list)) { toast('Stockage du navigateur plein : retirez quelques photos'); return; }
    closeCar();
    if (state.view !== 'vehicules') location.hash = 'vehicules';
    else { renderStock(); fillStock(id); }
    badges();
    toast(editing ? 'Modifications enregistrées' : 'Véhicule publié : il apparaît maintenant sur le site');
  });

  /* ---------- Demandes ---------- */
  function renderLeads() {
    var all = S.getLeads();
    var tabs = [['all', 'Toutes'], ['new', 'À traiter'], ['depot', 'Dépôt-vente'], ['rdv', 'Rendez-vous'], ['recherche', 'Recherche'], ['info', 'Info']];
    function match(l, t) { return t === 'all' || (t === 'new' ? l.status === 'new' : l.type === t); }
    var list = all.filter(function (l) { return match(l, state.tab); });
    if (state.lead && !all.some(function (l) { return l.id === state.lead; })) state.lead = null;
    if (!state.lead && list.length && window.innerWidth >= 1100) state.lead = list[0].id;
    var cur = all.filter(function (l) { return l.id === state.lead; })[0];

    $('#v-demandes').innerHTML =
      '<div class="head"><div><p>Formulaires du site : dépôt-vente, rendez-vous, recherche, fiche véhicule</p><h1 id="h-demandes">Demandes</h1></div></div>' +
      '<div class="tabs">' + tabs.map(function (t) {
        var n = all.filter(function (l) { return match(l, t[0]); }).length;
        return '<button class="tab" type="button" data-tab="' + t[0] + '" aria-pressed="' + (state.tab === t[0]) + '">' + t[1] + ' <sup>' + n + '</sup></button>';
      }).join('') + '</div>' +
      '<div class="inbox"><div class="leads">' + (list.map(leadRow).join('') || '<div class="empty-a">Aucune demande dans cette catégorie.</div>') + '</div>' +
      (cur ? detail(cur) : '<div class="detail"><p class="empty-a" style="padding:30px 0">Sélectionnez une demande pour l\'afficher.</p></div>') + '</div>';
  }
  function detail(l) {
    var car = l.vehicle ? S.getCar(l.vehicle) : null;
    var rows = [['Reçue', new Date(l.createdAt).toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })], ['Téléphone', '<a href="tel:' + esc(l.phone) + '">' + esc(l.phone) + '</a>'], ['Email', l.email ? '<a href="mailto:' + esc(l.email) + '">' + esc(l.email) + '</a>' : '—']];
    if (car) rows.push(['Véhicule', '<a href="vehicule.html?v=' + encodeURIComponent(car.id) + '" target="_blank" rel="noopener" style="text-decoration:underline">' + esc(A.title(car)) + ' ↗</a>']);
    Object.keys(l.details || {}).forEach(function (k) { rows.push([esc(k), esc(l.details[k])]); });
    var tel = (l.phone || '').replace(/\D/g, '').replace(/^0/, '33');
    return '<div class="detail" aria-live="polite">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="tag tag--' + l.type + '">' + TYPES[l.type] + '</span>' + (l.example ? '<span class="ex">exemple de démonstration</span>' : '') + '</div>' +
      '<h2>' + esc(l.name) + '</h2><p style="margin:-8px 0 0;color:#555">' + esc(l.subject) + '</p>' +
      '<dl>' + rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>'; }).join('') + '</dl>' +
      '<div class="detail__acts">' +
        '<a class="abtn abtn--dark" href="tel:' + esc(l.phone) + '">Appeler</a>' +
        (l.email ? '<a class="abtn" href="mailto:' + esc(l.email) + '?subject=' + encodeURIComponent('Automobile sur Mesure · ' + l.subject) + '">Répondre par email</a>' : '') +
        (tel.length >= 11 ? '<a class="abtn" href="https://wa.me/' + tel + '" target="_blank" rel="noopener">WhatsApp</a>' : '') +
        '<button class="abtn" type="button" data-done="' + esc(l.id) + '">' + (l.status === 'done' ? 'Rouvrir' : '✓ Marquer traitée') + '</button>' +
        '<button class="abtn abtn--ghost abtn--danger" type="button" data-del-lead="' + esc(l.id) + '">Supprimer</button>' +
      '</div>' +
      '<p style="margin:0;font-size:12px;color:#8a8780">Dans la version finale, chaque demande arrive aussi par email à ' + esc(A.email) + ', avec les photos jointes pour le dépôt-vente, et un accusé de réception part automatiquement au client.</p>' +
    '</div>';
  }

  /* ---------- Synchronisation avec le site (autre onglet) ---------- */
  window.addEventListener('storage', function (e) {
    if (e.key === S.keys.leads) {
      var leads = S.getLeads();
      if (leads.length > lastLeadCount) {
        var nl = leads[0];
        toast('Nouvelle demande : ' + TYPES[nl.type] + ' · ' + nl.name);
        nl._fresh = true;
      }
      lastLeadCount = leads.length;
      render();
    }
    if (e.key === S.keys.stock || e.key === null) render();
  });
  setInterval(function () {
    $$('time[datetime]').forEach(function (t) { t.textContent = ago(t.getAttribute('datetime')); });
  }, 30000);

  /* ---------- Connexion ---------- */
  var login = $('#login');
  function enter() {
    try { sessionStorage.setItem('asm:admin', '1'); } catch (e) {}
    login.classList.add('is-gone');
    setTimeout(function () { login.remove(); }, 800);
    go(location.hash.slice(1) || 'tableau');
  }
  var logged = false;
  try { logged = sessionStorage.getItem('asm:admin') === '1'; } catch (e) {}
  if (logged) { login.remove(); go(location.hash.slice(1) || 'tableau'); }
  else {
    $('#login-form').addEventListener('submit', function (e) { e.preventDefault(); enter(); });
    $('#login-form button').focus();
  }
})();
