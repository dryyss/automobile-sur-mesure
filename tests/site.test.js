// Contrôles statiques des pages : fichiers référencés, liens internes,
// attributs en double, conteneurs attendus par les scripts, config Vercel.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { ROOT, read } = require('./helpers');

const PAGES = {
  'index.html': { page: 'home', needs: ['data-featured', 'data-rail', 'data-services', 'data-quick'] },
  'vehicules.html': { page: 'stock', needs: ['data-grid', 'data-chips', 'data-filters-form', 'data-count-results'] },
  'vehicule.html': { page: 'vehicle', needs: ['data-vehicle'] },
  'depot-vente.html': { page: 'depot', needs: ['data-wizard', 'data-dropzone', 'data-previews', 'data-recap', 'data-photo-count'] },
  'contact.html': { page: 'contact', needs: ['data-booking', 'data-days', 'data-slots', 'data-slot-field', 'data-when'] },
  'admin.html': { page: null, needs: ['id="login"', 'id="v-tableau"', 'id="v-vehicules"', 'id="v-demandes"', 'id="car-form"'] }
};

function localRefs(html) {
  const refs = [];
  const re = /\s(?:src|href)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|#|\/\/)/.test(u) || u.includes('{{')) continue;
    refs.push(u.split('#')[0].split('?')[0]);
  }
  return refs.filter(Boolean);
}

for (const [file, spec] of Object.entries(PAGES)) {
  test(`${file} : fichiers et liens locaux existants`, () => {
    const html = read(file);
    for (const ref of localRefs(html)) {
      assert.ok(fs.existsSync(path.join(ROOT, ref)), `${file} référence ${ref} qui n'existe pas`);
    }
  });

  test(`${file} : conteneurs attendus par les scripts`, () => {
    const html = read(file);
    if (spec.page) assert.match(html, new RegExp(`data-page="${spec.page}"`));
    for (const n of spec.needs) assert.ok(html.includes(n), `${file} doit contenir ${n}`);
  });

  test(`${file} : pas d'attribut en double dans une balise`, () => {
    const html = read(file).replace(/<script[\s\S]*?<\/script>/g, '');
    const tags = html.match(/<[a-z][^<>]*>/gi) || [];
    for (const tag of tags) {
      const names = (tag.match(/\s([a-z-:]+)(?==)/gi) || []).map((s) => s.trim().toLowerCase());
      const dup = names.find((n, i) => names.indexOf(n) !== i);
      assert.equal(dup, undefined, `${file} : attribut « ${dup} » en double dans ${tag.slice(0, 90)}…`);
    }
  });

  test(`${file} : bases SEO et accessibilité`, () => {
    const html = read(file);
    assert.match(html, /<html lang="fr">/);
    assert.match(html, /<meta name="viewport"/);
    assert.match(html, /<title>[^<]{10,}<\/title>/);
    const imgs = html.match(/<img\b[^>]*>/g) || [];
    for (const img of imgs) assert.match(img, /\balt="/, `image sans alt : ${img}`);
  });
}

test('les liens générés par le script pointent vers des pages existantes', () => {
  const js = read('js/site.js') + read('js/admin.js');
  const pages = new Set((js.match(/['"]([a-z-]+\.html)/g) || []).map((s) => s.slice(1)));
  assert.ok(pages.size > 0);
  for (const p of pages) assert.ok(fs.existsSync(path.join(ROOT, p)), `page manquante : ${p}`);
});

test('les photos du stock existent', () => {
  const { loadASM } = require('./helpers');
  const { ASM } = loadASM();
  for (const c of ASM.BASE) for (const p of c.photos) assert.ok(fs.existsSync(path.join(ROOT, p)), p);
});

test('syntaxe JavaScript valide', () => {
  for (const f of ['js/data.js', 'js/site.js', 'js/admin.js']) {
    execFileSync(process.execPath, ['--check', path.join(ROOT, f)]);
  }
});

test('vercel.json : JSON valide et anciennes adresses redirigées', () => {
  const cfg = JSON.parse(read('vercel.json'));
  assert.equal(cfg.cleanUrls, true);
  const sources = (cfg.redirects || []).map((r) => r.source);
  for (const old of ['/fiche', '/stock']) assert.ok(sources.includes(old), `redirection manquante : ${old}`);
  for (const r of cfg.redirects) {
    const dest = r.destination.split('?')[0].replace(/^\//, '');
    if (dest.startsWith('maquette/')) assert.ok(fs.existsSync(path.join(ROOT, dest)), dest);
    else if (dest) assert.ok(fs.existsSync(path.join(ROOT, dest + '.html')), `${r.source} → ${r.destination}`);
  }
});
