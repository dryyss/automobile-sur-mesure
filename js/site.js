/* Automobile sur Mesure · comportements communs + pages publiques */
(function () {
  'use strict';

  var A = window.ASM;
  var S = A.store;
  var doc = document;
  var root = doc.documentElement;
  var page = doc.body.getAttribute('data-page') || '';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(s, el) { return (el || doc).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || doc).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function params() { return new URLSearchParams(location.search); }

  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.4 4.5 6.9 4.5c2 0 3.5 1.1 5.1 3 1.6-1.9 3.1-3 5.1-3 3.5 0 5.5 3.5 4.2 6.8-1.8 4.6-9.3 9.2-9.3 9.2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 3v13M7 8l5-5 5 5M5 13v7h14v-7"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.3-.6-.5-1-1.1-1.4-1.8-.1-.2 0-.4.1-.5l.4-.5.3-.4v-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.3.3-1 .9-1 2.2s1 2.6 1.1 2.8c.1.2 2 3 4.8 4.2 1.8.8 2.5.8 3.4.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/></svg>',
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    left: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    right: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    check: '<svg class="success__icon" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="32" cy="32" r="30"/><path d="M20 33l8 8 16-17"/></svg>'
  };
  A.ICON = ICON;
  A.esc = esc;

  /* ---------- Gabarit commun ---------- */
  function navLink(href, label, key) {
    return '<a class="nav__link" href="' + href + '"' + (key && page === key ? ' aria-current="page"' : '') + '>' + label + '</a>';
  }
  function buildLayout() {
    var overlay = doc.body.getAttribute('data-header') === 'overlay';
    var h = doc.getElementById('site-header');
    if (h) {
      h.outerHTML =
        '<header class="header' + (overlay ? '' : ' is-solid') + '" id="header">' +
          '<div class="topbar"><div class="wrap">' +
            '<span class="status-dot" data-open-status>Showroom sur rendez-vous · Mardi au samedi</span>' +
            '<span class="topbar__links"><a href="tel:' + A.tel + '">' + A.phone + '</a><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a></span>' +
          '</div></div>' +
          '<div class="wrap nav">' +
            '<nav class="nav__group nav__group--left" aria-label="Navigation principale">' +
              navLink('vehicules.html', 'Nos véhicules', 'stock') +
              navLink('depot-vente.html', 'Dépôt-vente', 'depot') +
              navLink('index.html#services', 'Services') +
            '</nav>' +
            '<a class="logo" href="index.html" aria-label="Automobile sur Mesure, accueil"><img src="assets/logo-asm.jpg" alt="Automobile sur Mesure" width="186" height="58"></a>' +
            '<div class="nav__group nav__group--right">' +
              navLink('index.html#societe', 'La société') +
              navLink('contact.html', 'Contact', 'contact') +
              '<a class="fav-link nav__fav" href="vehicules.html?favoris=1" aria-label="Mes favoris">' + ICON.heart + '<span class="fav-count" data-fav-count></span></a>' +
              '<a class="btn btn--sm" href="contact.html">Rendez-vous</a>' +
              '<button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span></button>' +
            '</div>' +
          '</div>' +
        '</header>' +
        '<div class="mobile-menu" id="mobile-menu" aria-hidden="true">' +
          '<nav aria-label="Menu mobile">' +
            '<a href="index.html">Accueil</a><a href="vehicules.html">Nos véhicules</a><a href="depot-vente.html">Dépôt-vente</a>' +
            '<a href="index.html#services">Services</a><a href="index.html#societe">La société</a><a href="contact.html">Rendez-vous</a>' +
          '</nav>' +
          '<div class="mobile-menu__foot"><span class="status-dot" data-open-status></span><a href="tel:' + A.tel + '">' + A.phone + '</a><a href="mailto:' + A.email + '">' + A.email + '</a></div>' +
        '</div>';
    }
    var f = doc.getElementById('site-footer');
    if (f) {
      f.outerHTML =
        '<footer class="footer">' +
          '<div class="wrap footer__top">' +
            '<div class="footer__brand"><img src="assets/logo-asm.jpg" alt="Automobile sur Mesure" width="180" height="56"><p>Véhicules de sport, de prestige et d\'exception. Achat, vente, dépôt-vente et importation depuis Frépillon (95).</p></div>' +
            '<div class="footer__col"><small>Showroom</small><a href="vehicules.html">Nos véhicules</a><a href="depot-vente.html">Dépôt-vente</a><a href="contact.html?motif=recherche">Recherche personnalisée</a><a href="vehicules.html?favoris=1">Mes favoris</a></div>' +
            '<div class="footer__col"><small>Maison</small><a href="index.html#societe">La société</a><a href="index.html#services">Services</a><a href="contact.html">Contact et rendez-vous</a><a href="admin.html">Espace gestion</a></div>' +
            '<div class="footer__col"><small>Nous trouver</small><a href="' + A.maps + '" target="_blank" rel="noopener">8 avenue Roland Moreno<br>95740 Frépillon</a><a href="tel:' + A.tel + '">' + A.phone + '</a><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a></div>' +
          '</div>' +
          '<div class="footer__giant" aria-hidden="true">Sur mesure</div>' +
          '<div class="wrap footer__bottom"><span>© ' + new Date().getFullYear() + ' Automobile sur Mesure · Frépillon</span><span><a href="#">Mentions légales</a> · <a href="#">Confidentialité</a></span></div>' +
        '</footer>';
    }
    var fl = doc.createElement('div');
    fl.className = 'floating';
    fl.innerHTML =
      '<button class="fab fab--top" type="button" aria-label="Revenir en haut">' + ICON.up + '</button>' +
      '<a class="fab" href="' + A.whatsapp + '" target="_blank" rel="noopener" aria-label="Nous écrire sur WhatsApp">' + ICON.wa + '</a>';
    doc.body.appendChild(fl);
    var t = doc.createElement('div');
    t.className = 'toasts';
    t.setAttribute('role', 'status');
    t.setAttribute('aria-live', 'polite');
    doc.body.appendChild(t);
  }

  /* ---------- Toast ---------- */
  function toast(msg) {
    var box = $('.toasts');
    if (!box) return;
    var el = doc.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(function () {
      el.classList.add('is-out');
      setTimeout(function () { el.remove(); }, 450);
    }, 3200);
  }
  A.toast = toast;

  /* ---------- En-tête : défilement, menu ---------- */
  function initHeader() {
    var header = $('#header');
    if (!header) return;
    root.style.setProperty('--header-h', header.offsetHeight + 'px');
    var top = $('.fab--top');
    var ticking = false;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (top) top.classList.toggle('is-visible', y > 900);
      root.style.setProperty('--hh', header.offsetHeight + 'px');
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
    setTimeout(onScroll, 600);
    if (top) top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); });

    var burger = $('.burger');
    var menu = $('#mobile-menu');
    function setMenu(open) {
      doc.body.classList.toggle('menu-open', open);
      doc.body.classList.toggle('no-scroll', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
    }
    if (burger && menu) {
      burger.addEventListener('click', function () { setMenu(!doc.body.classList.contains('menu-open')); });
      $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
      doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    }
  }

  /* ---------- Horaires : ouvert / fermé ---------- */
  var DAY = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  function openStatus() {
    var now = new Date();
    var d = now.getDay();
    var h = now.getHours() + now.getMinutes() / 60;
    var H = A.hours;
    if (H.days.indexOf(d) >= 0) {
      for (var i = 0; i < H.ranges.length; i++) {
        var r = H.ranges[i];
        if (h >= r[0] && h < r[1]) return { open: true, text: 'Ouvert · jusqu\'à ' + r[1] + 'h' };
        if (h < r[0]) return { open: false, text: 'Fermé · ouvre à ' + r[0] + 'h' };
      }
    }
    for (var k = 1; k <= 7; k++) {
      var nd = (d + k) % 7;
      if (H.days.indexOf(nd) >= 0) return { open: false, text: 'Fermé · ouvre ' + (k === 1 ? 'demain' : DAY[nd]) + ' à ' + H.ranges[0][0] + 'h' };
    }
    return { open: false, text: 'Sur rendez-vous' };
  }
  function initOpenStatus() {
    var st = openStatus();
    $$('[data-open-status]').forEach(function (el) {
      el.classList.toggle('is-open', st.open);
      el.textContent = st.text + ' · Sur rendez-vous';
    });
  }

  /* ---------- Apparition au défilement ---------- */
  var io = null;
  function reveal(scope) {
    var els = $$('[data-reveal]:not(.is-in), .step:not(.is-in)', scope);
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) {
        el.classList.add('is-in');
        if (el.hasAttribute('data-count')) el.textContent = A.num(+el.getAttribute('data-count')) + (el.getAttribute('data-suffix') || '');
      });
      return;
    }
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
            if (en.target.hasAttribute('data-count')) countUp(en.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    }
    els.forEach(function (el) { io.observe(el); });
  }
  A.reveal = reveal;

  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduced) { el.textContent = A.num(end) + suffix; return; }
    var t0 = null;
    var dur = 1800;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur);
      var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = A.num(end * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Intro et transitions ---------- */
  function initIntro() {
    var loader = $('#loader');
    var intro = root.classList.contains('is-intro');
    function ready() { root.classList.add('is-ready'); }
    if (intro && loader && !reduced) {
      var t0 = Date.now();
      var done = false;
      var finish = function () {
        if (done) return;
        done = true;
        var wait = Math.max(0, 1500 - (Date.now() - t0));
        setTimeout(function () {
          loader.classList.add('is-done');
          setTimeout(ready, 350);
          setTimeout(function () { loader.remove(); }, 1300);
        }, wait);
      };
      if (doc.readyState === 'complete') finish(); else window.addEventListener('load', finish);
      setTimeout(finish, 3500);
      try { sessionStorage.setItem('asm:intro', '1'); } catch (e) {}
    } else {
      if (loader) loader.remove();
      requestAnimationFrame(function () { setTimeout(ready, 60); });
    }
  }

  function initTransitions() {
    if (reduced) return;
    doc.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (a.hasAttribute('download')) return;
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#') return;
      if (!/^https?:$/.test(a.protocol) || a.origin !== location.origin) return;
      if (a.pathname === location.pathname && a.search === location.search && a.hash) return;
      e.preventDefault();
      doc.body.classList.add('is-leaving');
      setTimeout(function () { location.href = a.href; }, 320);
    });
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) doc.body.classList.remove('is-leaving');
    });
  }

  /* ---------- Favoris ---------- */
  function updateFavCount(bump) {
    var n = S.getFavs().length;
    $$('[data-fav-count]').forEach(function (el) {
      el.textContent = n ? String(n) : '';
      if (bump) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
    });
  }
  function initFavs() {
    updateFavCount(false);
    doc.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-fav]');
      if (!b) return;
      e.preventDefault();
      e.stopPropagation();
      var id = b.getAttribute('data-fav');
      var on = S.toggleFav(id);
      $$('[data-fav="' + id + '"]').forEach(function (x) {
        x.classList.toggle('is-on', on);
        x.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      updateFavCount(true);
      toast(on ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
      doc.dispatchEvent(new CustomEvent('asm:favs'));
    });
  }

  /* ---------- Carte véhicule ---------- */
  function media(c, cls) {
    if (c.photos && c.photos.length) {
      return '<img src="' + esc(c.photos[0]) + '" alt="' + esc(A.title(c)) + '" loading="lazy"' + (cls ? ' class="' + cls + '"' : '') + '>';
    }
    return '<div class="placeholder" role="img" aria-label="Photos de la ' + esc(A.title(c)) + ' en préparation"><span class="placeholder__mono">ASM</span><span class="placeholder__brand">' + esc(c.brand) + '</span><span class="placeholder__note">Photos en préparation</span></div>';
  }
  A.media = media;

  function carCard(c, i) {
    var favs = S.getFavs();
    var fav = favs.indexOf(c.id) >= 0;
    var reserved = c.status === 'reserved';
    var badges = '';
    if (reserved) badges += '<span class="badge badge--warn">Réservé</span>';
    else if (c.featured) badges += '<span class="badge badge--light">À la une</span>';
    if (c.km < 5000) badges += '<span class="badge">Faible km</span>';
    return '<article class="car' + (reserved ? ' is-reserved' : '') + '" style="--d:' + Math.min(i || 0, 12) * 0.06 + 's">' +
      '<div class="car__media">' + media(c) + '<div class="car__badges">' + badges + '</div></div>' +
      '<div class="car__fav"><button class="fav-btn' + (fav ? ' is-on' : '') + '" type="button" data-fav="' + esc(c.id) + '" aria-pressed="' + fav + '" aria-label="Favori : ' + esc(A.title(c)) + '">' + ICON.heart + '</button></div>' +
      '<div class="car__body"><span class="car__brand">' + esc(c.brand) + '</span><h3 class="car__title">' + esc(c.model) + '</h3><span class="car__version">' + esc(c.version || '') + '</span></div>' +
      '<div class="car__specs"><div><span>Année</span><span>' + esc(c.year) + '</span></div><div><span>Km</span><span>' + A.num(c.km) + '</span></div><div><span>Puissance</span><span>' + (c.power ? c.power + ' ch' : '—') + '</span></div></div>' +
      '<div class="car__foot"><span class="car__price">' + A.price(c.price) + '</span><span class="car__cta">Découvrir <i>→</i></span></div>' +
      '<a class="car__link" href="vehicule.html?v=' + encodeURIComponent(c.id) + '" aria-label="Voir la fiche : ' + esc(A.title(c)) + '"></a>' +
    '</article>';
  }
  A.carCard = carCard;

  /* ---------- Formulaires ---------- */
  function validate(form) {
    var ok = true;
    var first = null;
    $$('[data-req]', form).forEach(function (input) {
      var f = input.closest('.field') || input.closest('.check');
      var v = (input.type === 'checkbox') ? input.checked : input.value.trim();
      var err = '';
      if (!v) err = input.getAttribute('data-req') || 'Champ requis';
      else if (input.type === 'tel' && input.value.replace(/\D/g, '').length < 10) err = 'Numéro incomplet';
      else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) err = 'Adresse email invalide';
      if (f) {
        f.classList.toggle('is-error', !!err);
        var m = $('.field__err', f);
        if (!m && err) {
          m = doc.createElement('span');
          m.className = 'field__err';
          f.appendChild(m);
        }
        if (m) m.textContent = err;
      }
      if (err) { ok = false; if (!first) first = input; }
    });
    if (first) first.focus();
    return ok;
  }
  A.validate = validate;
  doc.addEventListener('input', function (e) {
    var f = e.target.closest && e.target.closest('.is-error');
    if (f) f.classList.remove('is-error');
  });
  doc.addEventListener('change', function (e) {
    var f = e.target.closest && e.target.closest('.is-error');
    if (f) f.classList.remove('is-error');
  });

  function success(container, title, text, extra) {
    container.innerHTML = '<div class="success" tabindex="-1">' + ICON.check +
      '<h3 class="display h3">' + title + '</h3><p class="lead">' + text + '</p>' + (extra || '') + '</div>';
    var s = $('.success', container);
    s.focus();
    container.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
  }
  A.success = success;

  function setRangeFill(r) {
    var p = (r.value - r.min) / (r.max - r.min) * 100;
    r.style.setProperty('--p', p + '%');
  }

  /* ================================================================
     Accueil
     ================================================================ */
  function initHome() {
    var pub = S.publicStock();
    var f = S.featured();
    var fe = $('[data-featured]');
    if (fe && f) {
      fe.href = 'vehicule.html?v=' + encodeURIComponent(f.id);
      fe.innerHTML =
        '<div class="featured__img">' + (f.photos[0] ? '<img src="' + esc(f.photos[0]) + '" alt="' + esc(A.title(f)) + '">' : '') + '</div>' +
        '<div class="featured__body"><span class="featured__tag">À la une</span><span class="featured__title">' + esc(A.title(f)) + '</span><span class="featured__meta">' + f.year + ' · ' + A.km(f.km) + ' · ' + A.price(f.price) + '</span></div>';
    }

    $$('[data-stat="stock"]').forEach(function (el) { el.setAttribute('data-count', pub.length); });
    $$('[data-stat="brands"]').forEach(function (el) { el.setAttribute('data-count', A.brands(pub).length); });
    $$('[data-count]').forEach(function (el) { el.setAttribute('data-reveal', 'fade'); });

    var rail = $('[data-rail]');
    if (rail) {
      var sel = pub.slice().sort(function (a, b) {
        var pa = a.photos.length ? 1 : 0, pb = b.photos.length ? 1 : 0;
        return pb - pa || b.price - a.price;
      }).slice(0, 8);
      rail.innerHTML = sel.map(carCard).join('');
      initRail(rail);
    }

    var sv = $('[data-services]');
    if (sv) {
      sv.innerHTML = A.SERVICES.map(function (s, i) {
        return '<div class="service" data-reveal style="--d:' + (i % 2) * 0.08 + 's"><span class="service__n">' + String(i + 1).padStart(2, '0') + '</span>' +
          '<div><span class="service__t">' + s.t + '</span><span class="service__d">' + s.d + '</span></div><span class="service__a" aria-hidden="true">→</span></div>';
      }).join('');
    }

    var qf = $('[data-quick]');
    if (qf) {
      qf.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = new URLSearchParams();
        var m = qf.elements.modele.value.trim();
        var k = qf.elements.km.value.trim();
        if (m) q.set('modele', m);
        if (k) q.set('km', k);
        doc.body.classList.add('is-leaving');
        setTimeout(function () { location.href = 'depot-vente.html' + (q.toString() ? '?' + q : '') + '#estimation'; }, reduced ? 0 : 320);
      });
    }
  }

  function initRail(rail) {
    var prev = $('[data-rail-prev]');
    var next = $('[data-rail-next]');
    var bar = $('[data-rail-progress]');
    function stepW() {
      var c = rail.firstElementChild;
      return c ? c.getBoundingClientRect().width + 24 : 400;
    }
    function upd() {
      var max = rail.scrollWidth - rail.clientWidth;
      var p = max > 0 ? rail.scrollLeft / max : 1;
      var vis = Math.min(1, rail.clientWidth / rail.scrollWidth);
      if (!bar) return;
      bar.style.width = (vis * 100) + '%';
      bar.style.transform = 'translateX(' + (p * (1 / vis - 1) * 100) + '%)';
    }
    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -stepW(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: stepW(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    window.addEventListener('resize', upd);
    upd();

    var down = false, sx = 0, sl = 0, moved = false;
    rail.addEventListener('pointerdown', function (e) {
      if (e.pointerType !== 'mouse' || e.target.closest('button')) return;
      down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (Math.abs(dx) > 5) { moved = true; rail.classList.add('is-drag'); }
      if (moved) rail.scrollLeft = sl - dx;
    });
    window.addEventListener('pointerup', function () {
      if (!down) return;
      down = false;
      setTimeout(function () { rail.classList.remove('is-drag'); }, 0);
    });
    rail.addEventListener('dragstart', function (e) { e.preventDefault(); });
  }

  /* ================================================================
     Catalogue
     ================================================================ */
  function initStock() {
    var grid = $('[data-grid]');
    var chips = $('[data-chips]');
    var form = $('[data-filters-form]');
    var countEl = $('[data-count-results]');
    var all = S.publicStock();
    var p = params();
    var st = {
      marque: p.get('marque') || '',
      q: p.get('q') || '',
      budget: p.get('budget') || '',
      annee: p.get('annee') || '',
      km: p.get('km') || '',
      tri: p.get('tri') || 'prix-desc',
      favoris: p.get('favoris') === '1'
    };
    ['q', 'budget', 'annee', 'km', 'tri'].forEach(function (k) { if (form.elements[k]) form.elements[k].value = st[k]; });

    function chipsHtml() {
      var favN = S.getFavs().filter(function (id) { return all.some(function (c) { return c.id === id; }); }).length;
      var html = '<button class="chip" type="button" data-brand="" aria-pressed="' + (!st.marque && !st.favoris) + '">Toutes <sup>' + all.length + '</sup></button>';
      A.brands(all).forEach(function (b) {
        html += '<button class="chip" type="button" data-brand="' + esc(b.name) + '" aria-pressed="' + (st.marque === b.name && !st.favoris) + '">' + esc(b.name) + ' <sup>' + b.count + '</sup></button>';
      });
      html += '<button class="chip" type="button" data-favs aria-pressed="' + st.favoris + '">♥ Favoris <sup>' + favN + '</sup></button>';
      html += '<button class="chip filters__toggle" type="button" data-toggle-filters aria-expanded="false">Filtres +</button>';
      chips.innerHTML = html;
    }

    function apply() {
      var favs = S.getFavs();
      var list = all.filter(function (c) {
        if (st.favoris && favs.indexOf(c.id) < 0) return false;
        if (st.marque && c.brand !== st.marque) return false;
        if (st.budget && c.price > +st.budget) return false;
        if (st.annee && c.year < +st.annee) return false;
        if (st.km && c.km > +st.km) return false;
        if (st.q) {
          var hay = (c.brand + ' ' + c.model + ' ' + c.version).toLowerCase();
          var ok = st.q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) >= 0; });
          if (!ok) return false;
        }
        return true;
      });
      var sorters = {
        'prix-desc': function (a, b) { return b.price - a.price; },
        'prix-asc': function (a, b) { return a.price - b.price; },
        recents: function (a, b) { return b.year - a.year || a.km - b.km; },
        km: function (a, b) { return a.km - b.km; },
        puissance: function (a, b) { return (b.power || 0) - (a.power || 0); }
      };
      list.sort(sorters[st.tri] || sorters['prix-desc']);

      if (list.length) {
        grid.innerHTML = list.map(carCard).join('');
      } else {
        grid.innerHTML = '<div class="empty"><span class="display h3">' + (st.favoris ? 'Aucun favori pour l\'instant' : 'Aucun véhicule ne correspond') + '</span>' +
          '<p class="muted" style="margin:0;max-width:420px">' + (st.favoris ? 'Touchez le cœur d\'un véhicule pour le retrouver ici.' : 'Élargissez vos critères, ou confiez-nous votre recherche : nous trouvons le modèle pour vous.') + '</p>' +
          '<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center"><button class="btn btn--sm" type="button" data-reset>Voir tout le stock</button><a class="btn btn--sm btn--solid" href="contact.html?motif=recherche">Recherche personnalisée</a></div></div>';
      }
      countEl.innerHTML = '<strong>' + list.length + '</strong>' + (list.length > 1 ? 'véhicules disponibles' : 'véhicule disponible');
      chipsHtml();

      var q = new URLSearchParams();
      if (st.marque) q.set('marque', st.marque);
      if (st.q) q.set('q', st.q);
      if (st.budget) q.set('budget', st.budget);
      if (st.annee) q.set('annee', st.annee);
      if (st.km) q.set('km', st.km);
      if (st.tri !== 'prix-desc') q.set('tri', st.tri);
      if (st.favoris) q.set('favoris', '1');
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
    }

    function reset() {
      st = { marque: '', q: '', budget: '', annee: '', km: '', tri: 'prix-desc', favoris: false };
      form.reset();
      apply();
    }

    chips.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      if (b.hasAttribute('data-toggle-filters')) {
        var box = $('.filters');
        var open = !box.classList.contains('is-open');
        box.classList.toggle('is-open', open);
        b.setAttribute('aria-expanded', open);
        b.textContent = open ? 'Filtres −' : 'Filtres +';
        return;
      }
      if (b.hasAttribute('data-favs')) { st.favoris = !st.favoris; st.marque = ''; }
      else { st.marque = b.getAttribute('data-brand'); st.favoris = false; }
      apply();
    });
    var qTimer;
    form.addEventListener('input', function (e) {
      var n = e.target.name;
      if (!n) return;
      clearTimeout(qTimer);
      qTimer = setTimeout(function () { st[n] = e.target.value.trim(); apply(); }, n === 'q' ? 220 : 0);
    });
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    doc.addEventListener('click', function (e) { if (e.target.closest('[data-reset]')) reset(); });
    doc.addEventListener('asm:favs', function () { if (st.favoris) apply(); else chipsHtml(); });
    apply();
  }

  /* ================================================================
     Fiche véhicule
     ================================================================ */
  function initVehicle() {
    var id = params().get('v');
    var car = id ? S.getCar(id) : null;
    if (!car) car = S.featured();
    var mount = $('[data-vehicle]');
    if (!car) { mount.innerHTML = '<p class="wrap">Véhicule introuvable.</p>'; return; }

    var title = A.title(car);
    doc.title = title + ' · ' + car.year + ' · ' + A.price(car.price) + ' · Automobile sur Mesure';
    var md = $('meta[name="description"]');
    if (md) md.setAttribute('content', title + ' ' + (car.version || '') + ', ' + car.year + ', ' + A.km(car.km) + '. Visible au showroom de Frépillon sur rendez-vous.');
    $$('[data-car-title]').forEach(function (el) { el.textContent = title; });

    var ld = doc.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Car', name: title, brand: { '@type': 'Brand', name: car.brand },
      model: car.model, vehicleModelDate: String(car.year), mileageFromOdometer: { '@type': 'QuantitativeValue', value: car.km, unitCode: 'KMT' },
      image: car.photos.map(function (p) { return new URL(p, location.href).href; }),
      offers: { '@type': 'Offer', price: car.price, priceCurrency: 'EUR', availability: car.status === 'sold' ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock', seller: { '@type': 'AutoDealer', name: 'Automobile sur Mesure' } }
    });
    doc.head.appendChild(ld);

    var sold = car.status === 'sold' || car.status === 'draft';
    var reserved = car.status === 'reserved';
    var favs = S.getFavs();
    var fav = favs.indexOf(car.id) >= 0;
    var slots = ['Intérieur', 'Arrière', 'Moteur', 'Détails'];
    var thumbs = car.photos.map(function (p, i) {
      return '<button class="thumb' + (i === 0 ? ' is-active' : '') + '" type="button" data-thumb="' + i + '" aria-label="Photo ' + (i + 1) + '"><img src="' + esc(p) + '" alt=""></button>';
    });
    for (var t = 0; thumbs.length < 5; t++) thumbs.push('<div class="thumb thumb--empty" aria-hidden="true">' + (car.photos.length ? slots[t] || 'Photo' : (t === 0 ? 'Extérieur' : slots[t - 1] || 'Photo')) + '</div>');

    var waText = encodeURIComponent('Bonjour, je suis intéressé(e) par la ' + title + ' (' + car.year + ', ' + A.price(car.price) + ') : ' + location.href);
    var status = sold ? '<span class="badge">Vendu</span>' : reserved ? '<span class="badge badge--warn">Réservé</span>' : '<span class="badge badge--light">Disponible</span>';

    mount.innerHTML =
      '<div class="wrap"><nav class="crumbs" aria-label="Fil d\'Ariane" data-reveal><a href="index.html">Accueil</a><span>/</span><a href="vehicules.html">Nos véhicules</a><span>/</span><a href="vehicules.html?marque=' + encodeURIComponent(car.brand) + '">' + esc(car.brand) + '</a><span>/</span><span aria-current="page">' + esc(car.model) + '</span></nav></div>' +
      '<section class="wrap vd">' +
        '<div class="gallery" data-reveal>' +
          '<div class="gallery__main" data-open-lightbox role="button" tabindex="0" aria-label="Agrandir la photo">' + media(car) +
            '<div class="car__badges">' + status + '</div>' +
            (car.photos.length ? '<span class="gallery__zoom">⤢ Plein écran</span>' : '') + '</div>' +
          '<div class="gallery__thumbs">' + thumbs.join('') + '</div>' +
        '</div>' +
        '<aside class="summary" aria-label="Résumé du véhicule" data-reveal style="--d:.12s">' +
          '<div class="summary__top"><span class="eyebrow eyebrow--plain">' + esc(car.brand) + '</span><div class="summary__actions">' +
            '<button class="icon-btn' + (fav ? ' is-on' : '') + '" type="button" data-fav="' + esc(car.id) + '" aria-pressed="' + fav + '" aria-label="Ajouter aux favoris">' + ICON.heart + '</button>' +
            '<button class="icon-btn" type="button" data-share aria-label="Partager">' + ICON.share + '</button></div></div>' +
          '<h1>' + esc(car.model) + (car.version ? '<br><em style="font-size:.62em;color:#bdbdbd">' + esc(car.version) + '</em>' : '') + '</h1>' +
          '<span class="summary__price">' + A.price(car.price) + '</span>' +
          '<span class="summary__monthly">ou à partir de <b data-monthly-short>…</b> par mois · <a href="#financement">simuler</a></span>' +
          '<div class="keyfacts"><div><span>Année</span><span>' + car.year + '</span></div><div><span>Kilométrage</span><span>' + A.km(car.km) + '</span></div><div><span>Puissance</span><span>' + (car.power ? car.power + ' ch' : '—') + '</span></div><div><span>Boîte</span><span>' + esc(car.gearbox || 'À préciser') + '</span></div></div>' +
          (sold ? '<p class="summary__note">Ce véhicule n\'est plus disponible. Nous pouvons en rechercher un équivalent pour vous.</p><a class="btn btn--solid btn--block" href="contact.html?motif=recherche">Lancer une recherche</a>' :
          '<a class="btn btn--solid btn--block" href="#interet">' + (reserved ? 'Être prévenu si disponible' : 'Demander un rendez-vous') + ' <span class="arrow">→</span></a>' +
          '<div class="summary__row"><a class="btn btn--sm" href="tel:' + A.tel + '">Appeler</a><a class="btn btn--sm" href="https://wa.me/33687426446?text=' + waText + '" target="_blank" rel="noopener">WhatsApp</a></div>') +
          '<p class="summary__note"><span aria-hidden="true">◆</span>Visible au showroom de Frépillon, sur rendez-vous. Livraison et démarches administratives possibles.</p>' +
        '</aside>' +
      '</section>' +

      '<section class="section section--dark"><div class="wrap specs">' +
        '<div data-reveal><h2 class="display h3" style="margin-bottom:28px">Caractéristiques</h2><dl class="dl">' +
          '<dt>Marque</dt><dd>' + esc(car.brand) + '</dd><dt>Modèle</dt><dd>' + esc(car.model) + '</dd>' +
          '<dt>Version</dt><dd>' + esc(car.version || '—') + '</dd><dt>Année</dt><dd>' + car.year + '</dd>' +
          '<dt>Kilométrage</dt><dd>' + A.km(car.km) + '</dd><dt>Puissance</dt><dd>' + (car.power ? car.power + ' ch' : '—') + '</dd>' +
          '<dt>Énergie</dt><dd>' + esc(car.fuel || '—') + '</dd><dt>Boîte</dt><dd' + (car.gearbox ? '>' + esc(car.gearbox) : ' class="todo">À préciser') + '</dd>' +
          '<dt>Couleur</dt><dd' + (car.color ? '>' + esc(car.color) : ' class="todo">Depuis le back-office') + '</dd>' +
          '<dt>Garantie</dt><dd' + (car.warranty ? '>' + esc(car.warranty) : ' class="todo">Depuis le back-office') + '</dd>' +
        '</dl></div>' +
        '<div data-reveal style="--d:.1s"><h2 class="display h3" style="margin-bottom:28px">Équipements</h2><ul class="equip">' +
          car.equipment.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') +
          '<li class="todo">Liste complète des options saisie depuis le back-office</li>' +
        '</ul><p class="muted" style="margin:28px 0 0;font-size:14px;line-height:1.85;max-width:560px">' + esc(title) + ' de ' + car.year + ', ' + A.km(car.km) + (car.power ? ', ' + car.power + ' ch' : '') + '. Véhicule sélectionné et contrôlé par nos soins, présenté au showroom de Frépillon sur rendez-vous. Historique, entretien et options détaillés sur simple demande.</p></div>' +
      '</div></section>' +

      (sold ? '' :
      '<section class="section" id="financement"><div class="wrap calc">' +
        '<div class="calc__result" data-reveal><p class="eyebrow">Simulation de financement</p>' +
          '<span class="calc__amount"><span data-monthly>…</span><small>€ / mois</small></span>' +
          '<span class="muted" data-calc-summary></span>' +
          '<p class="calc__legal">Exemple indicatif de crédit classique, hors assurance facultative, sans valeur d\'offre. Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager. Solutions LOA / LLD sur demande.</p></div>' +
        '<div class="calc__panel" data-reveal style="--d:.1s">' +
          '<div class="range"><div class="range__top"><label for="r-apport">Apport</label><output data-out="apport"></output></div><input id="r-apport" type="range" min="0" max="' + Math.round(car.price * 0.6 / 1000) * 1000 + '" step="1000" value="' + Math.round(car.price * 0.2 / 1000) * 1000 + '"></div>' +
          '<div class="range"><div class="range__top"><label for="r-duree">Durée</label><output data-out="duree"></output></div><input id="r-duree" type="range" min="12" max="84" step="12" value="60"></div>' +
          '<div class="range"><div class="range__top"><label for="r-taux">Taux annuel indicatif</label><output data-out="taux"></output></div><input id="r-taux" type="range" min="2.9" max="8.9" step="0.1" value="5.9"></div>' +
          '<a class="btn btn--block" href="#interet">Étudier mon financement <span class="arrow">→</span></a>' +
        '</div>' +
      '</div></section>' +

      '<section class="section section--dark" id="interet"><div class="wrap contact__inner" style="align-items:start">' +
        '<div style="display:flex;flex-direction:column;gap:20px" data-reveal><p class="eyebrow">' + (reserved ? 'Véhicule réservé' : 'Rendez-vous') + '</p><h2 class="display h2">Ce véhicule<br><em>vous intéresse ?</em></h2>' +
          '<p class="lead">Laissez vos coordonnées : nous vous rappelons pour organiser une visite ou un essai au showroom.</p>' +
          '<div class="info-grid" style="margin-top:14px"><div><small>Téléphone</small><a href="tel:' + A.tel + '">' + A.phone + '</a></div><div><small>Horaires</small>Mardi au samedi<br>10h–12h · 13h–19h</div></div></div>' +
        '<div data-form-box data-reveal style="--d:.1s;border:1px solid var(--line);padding:clamp(24px,3.6vw,40px)">' +
          '<form class="form-grid" data-interest novalidate>' +
            '<label class="field">Nom et prénom<input class="input" name="name" autocomplete="name" data-req="Indiquez votre nom"></label>' +
            '<label class="field">Téléphone<input class="input" name="phone" type="tel" autocomplete="tel" data-req="Indiquez votre téléphone"></label>' +
            '<label class="field">Email (facultatif)<input class="input" name="email" type="email" autocomplete="email"></label>' +
            '<label class="field">Jour souhaité<input class="input" name="day" type="date" min="' + new Date().toISOString().slice(0, 10) + '"></label>' +
            '<div class="field full">Reprise de votre véhicule ?<div class="seg"><input type="radio" id="rp-n" name="reprise" value="Non" checked><label for="rp-n">Non</label><input type="radio" id="rp-o" name="reprise" value="Oui"><label for="rp-o">Oui</label></div></div>' +
            '<label class="field full">Message (facultatif)<textarea class="textarea" name="msg" rows="3" placeholder="Essai, financement, question sur l\'historique…"></textarea></label>' +
            '<input class="hp" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">' +
            '<label class="check full"><input type="checkbox" name="rgpd" data-req="Merci d\'accepter pour envoyer">J\'accepte que mes données soient utilisées pour traiter ma demande.</label>' +
            '<button class="btn btn--solid full" type="submit">Envoyer ma demande <span class="arrow">→</span></button>' +
          '</form></div>' +
      '</div></section>') +

      '<section class="section"><div class="wrap"><div class="section-head"><div class="section-head__title"><p class="eyebrow" data-reveal>Dans le même esprit</p><h2 class="display h2" data-reveal>Vous aimerez aussi</h2></div><a class="link" href="vehicules.html" data-reveal>Tout le stock</a></div><div class="grid-cars" data-similar></div></div></section>';

    // Galerie + visionneuse
    var cur = 0;
    var mainBox = $('.gallery__main', mount);
    function show(i) {
      cur = (i + car.photos.length) % car.photos.length;
      var img = $('img', mainBox);
      if (img) {
        var n = img.cloneNode();
        n.src = car.photos[cur];
        img.replaceWith(n);
      }
      $$('[data-thumb]', mount).forEach(function (b) { b.classList.toggle('is-active', +b.getAttribute('data-thumb') === cur); });
    }
    $$('[data-thumb]', mount).forEach(function (b) { b.addEventListener('click', function () { show(+b.getAttribute('data-thumb')); }); });
    if (car.photos.length) {
      var lb = buildLightbox(car.photos, title);
      mainBox.addEventListener('click', function () { lb.open(cur); });
      mainBox.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lb.open(cur); } });
    } else {
      mainBox.style.cursor = 'default';
      mainBox.removeAttribute('role');
      mainBox.removeAttribute('tabindex');
    }

    // Partage
    var sh = $('[data-share]', mount);
    sh.addEventListener('click', function () {
      var data = { title: title, text: title + ' · ' + A.price(car.price), url: location.href };
      if (navigator.share) navigator.share(data).catch(function () {});
      else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(function () { toast('Lien copié dans le presse-papiers'); });
    });

    // Simulateur
    if (!sold) {
      var ra = $('#r-apport'), rd = $('#r-duree'), rt = $('#r-taux');
      var calc = function () {
        [ra, rd, rt].forEach(setRangeFill);
        var capital = car.price - +ra.value;
        var n = +rd.value;
        var m = A.monthly(capital, n, +rt.value);
        $('[data-out="apport"]').textContent = A.price(+ra.value);
        $('[data-out="duree"]').textContent = n + ' mois';
        $('[data-out="taux"]').textContent = (+rt.value).toFixed(1).replace('.', ',') + ' %';
        $('[data-monthly]').textContent = A.num(m);
        $('[data-calc-summary]').textContent = 'Montant financé ' + A.price(capital) + ' · coût total du crédit ' + A.price(m * n - capital);
      };
      [ra, rd, rt].forEach(function (r) { r.addEventListener('input', calc); });
      calc();
      $('[data-monthly-short]').textContent = A.price(A.monthly(car.price * 0.8, 84, 5.9));

      var f = $('[data-interest]');
      f.addEventListener('submit', function (e) {
        e.preventDefault();
        if (f.elements.website.value) return;
        if (!validate(f)) return;
        var el = f.elements;
        var day = el.day.value ? new Date(el.day.value + 'T12:00').toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) : 'À convenir';
        S.addLead({
          type: 'rdv', name: el.name.value.trim(), phone: el.phone.value.trim(), email: el.email.value.trim(),
          subject: (reserved ? 'Liste d\'attente · ' : 'Visite · ') + title, vehicle: car.id,
          details: { 'Jour souhaité': day, Reprise: el.reprise.value, Message: el.msg.value.trim() || '—', Prix: A.price(car.price) }
        });
        success($('[data-form-box]'), 'Merci, c\'est bien reçu.', 'Nous revenons vers vous très vite au sujet de la ' + esc(title) + '. Votre demande est déjà visible dans l\'espace gestion.', '<a class="link" href="admin.html#demandes">Voir côté back-office (démo)</a>');
      });
    } else {
      var ms = $('.summary__monthly', mount);
      if (ms) ms.remove();
    }

    // Similaires
    var others = S.publicStock().filter(function (c) { return c.id !== car.id; });
    others.sort(function (a, b) {
      var sa = (a.brand === car.brand ? 0 : 1) + Math.abs(a.price - car.price) / car.price;
      var sb = (b.brand === car.brand ? 0 : 1) + Math.abs(b.price - car.price) / car.price;
      return sa - sb;
    });
    $('[data-similar]').innerHTML = others.slice(0, 3).map(carCard).join('');
  }

  function buildLightbox(photos, caption) {
    var el = doc.createElement('div');
    el.className = 'lightbox';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Photos : ' + caption);
    el.innerHTML = '<div class="lightbox__bar"><span data-lb-count></span><button class="icon-btn" type="button" data-lb-close aria-label="Fermer">' + ICON.close + '</button></div>' +
      '<div class="lightbox__stage"><button class="icon-btn lightbox__nav lightbox__nav--prev" type="button" data-lb-prev aria-label="Photo précédente">' + ICON.left + '</button><img alt=""><button class="icon-btn lightbox__nav lightbox__nav--next" type="button" data-lb-next aria-label="Photo suivante">' + ICON.right + '</button></div>' +
      '<div class="lightbox__caption">' + esc(caption) + '</div>';
    doc.body.appendChild(el);
    var i = 0, last = null;
    var img = $('img', el);
    function set(n) {
      i = (n + photos.length) % photos.length;
      img.src = photos[i];
      img.alt = caption + ', photo ' + (i + 1);
      $('[data-lb-count]', el).textContent = String(i + 1).padStart(2, '0') + ' / ' + String(photos.length).padStart(2, '0');
      var multi = photos.length > 1;
      $('[data-lb-prev]', el).style.visibility = multi ? '' : 'hidden';
      $('[data-lb-next]', el).style.visibility = multi ? '' : 'hidden';
    }
    function close() {
      el.classList.remove('is-open');
      doc.body.classList.remove('no-scroll');
      if (last) last.focus();
    }
    $('[data-lb-close]', el).addEventListener('click', close);
    $('[data-lb-prev]', el).addEventListener('click', function () { set(i - 1); });
    $('[data-lb-next]', el).addEventListener('click', function () { set(i + 1); });
    el.addEventListener('click', function (e) { if (e.target === el || e.target.classList.contains('lightbox__stage')) close(); });
    doc.addEventListener('keydown', function (e) {
      if (!el.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') set(i - 1);
      if (e.key === 'ArrowRight') set(i + 1);
    });
    var sx = null;
    el.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) set(i + (dx < 0 ? 1 : -1));
      sx = null;
    });
    return {
      open: function (n) {
        last = doc.activeElement;
        set(n || 0);
        el.classList.add('is-open');
        doc.body.classList.add('no-scroll');
        $('[data-lb-close]', el).focus();
      }
    };
  }

  /* ================================================================
     Dépôt-vente (formulaire en 3 étapes)
     ================================================================ */
  function initDepot() {
    var form = $('[data-wizard]');
    if (!form) return;
    var steps = $$('.wizard__step', form);
    var dots = $$('.wizard__dot');
    var cur = 0;
    var files = [];
    var p = params();
    if (p.get('modele')) form.elements.modele.value = p.get('modele');
    if (p.get('km')) form.elements.km.value = p.get('km');

    function go(n) {
      steps[cur].classList.remove('is-active');
      cur = n;
      steps[cur].classList.add('is-active');
      dots.forEach(function (d, i) {
        d.classList.toggle('is-done', i < cur);
        d.classList.toggle('is-current', i === cur);
      });
      if (cur === 2) recap();
      var top = form.closest('.wizard').getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduced ? 'auto' : 'smooth' });
      var focus = $('input, textarea, select', steps[cur]);
      if (focus) setTimeout(function () { focus.focus({ preventScroll: true }); }, 50);
    }
    form.addEventListener('click', function (e) {
      if (e.target.closest('[data-next]')) {
        if (validate(steps[cur])) go(cur + 1);
      }
      if (e.target.closest('[data-prev]')) go(cur - 1);
    });

    // Photos
    var dz = $('[data-dropzone]');
    var input = $('input[type=file]', dz);
    var pv = $('[data-previews]');
    function addFiles(list) {
      Array.prototype.slice.call(list).forEach(function (f) {
        if (!/^image\//.test(f.type) || files.length >= 12) return;
        files.push({ file: f, url: URL.createObjectURL(f) });
      });
      renderPv();
    }
    function renderPv() {
      pv.innerHTML = files.map(function (f, i) {
        return '<div class="preview"><img src="' + f.url + '" alt="Photo ' + (i + 1) + '"><button type="button" data-rm="' + i + '" aria-label="Retirer la photo ' + (i + 1) + '">×</button></div>';
      }).join('');
      $('[data-photo-count]').textContent = files.length ? files.length + ' photo' + (files.length > 1 ? 's' : '') + ' ajoutée' + (files.length > 1 ? 's' : '') : '';
    }
    pv.addEventListener('click', function (e) {
      var b = e.target.closest('[data-rm]');
      if (!b) return;
      var i = +b.getAttribute('data-rm');
      URL.revokeObjectURL(files[i].url);
      files.splice(i, 1);
      renderPv();
    });
    input.addEventListener('change', function () { addFiles(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { dz.addEventListener(ev, function (e) { e.preventDefault(); dz.classList.remove('is-over'); }); });
    dz.addEventListener('drop', function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

    function val(n) { var el = form.elements[n]; return el ? el.value.trim() : ''; }
    function recap() {
      var rows = [['Véhicule', (val('marque') + ' ' + val('modele')).trim()], ['Année', val('annee')], ['Kilométrage', val('km')], ['Prix souhaité', val('prix') || 'À définir ensemble'], ['Photos', files.length ? files.length + ' photo(s)' : 'Aucune']];
      $('[data-recap]').innerHTML = rows.map(function (r) { return '<dt>' + r[0] + '</dt><dd>' + esc(r[1] || '—') + '</dd>'; }).join('');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website.value) return;
      if (!validate(steps[cur])) return;
      S.addLead({
        type: 'depot', name: val('name'), phone: val('phone'), email: val('email'),
        subject: (val('marque') + ' ' + val('modele')).trim() + (val('annee') ? ', ' + val('annee') : '') + (val('km') ? ', ' + val('km') : ''),
        details: { 'Prix souhaité': val('prix') || '—', Photos: files.length + ' photo(s)', Entretien: form.elements.carnet.value, Précisions: val('notes') || '—' }
      });
      dots.forEach(function (d) { d.classList.add('is-done'); });
      success(form.parentNode, 'Merci, votre demande est envoyée.', 'Notre équipe étudie votre véhicule et vous rappelle sous 24 h ouvrées pour l\'estimation.', '<div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn--dark btn--sm" href="depot-vente.html">Nouvelle demande</a><a class="btn btn--dark btn--solid btn--sm" href="admin.html#demandes">Voir côté back-office</a></div>');
    });
  }

  /* ================================================================
     Contact et prise de rendez-vous
     ================================================================ */
  function initContact() {
    var form = $('[data-booking]');
    if (!form) return;
    var daysEl = $('[data-days]');
    var slotsEl = $('[data-slots]');
    var chosen = { day: null, slot: null };
    var p = params();

    var motif = p.get('motif');
    if (motif) {
      var r = form.querySelector('input[name=motif][value="' + motif + '"]');
      if (r) r.checked = true;
    }
    var vid = p.get('v');
    var vcar = vid ? S.getCar(vid) : null;
    if (vcar) form.elements.msg.value = 'Véhicule : ' + A.title(vcar) + ' (' + A.price(vcar.price) + ')';

    function syncMotif() {
      var m = form.elements.motif.value;
      $$('[data-if]').forEach(function (el) { el.classList.toggle('is-on', el.getAttribute('data-if') === m); });
    }
    form.addEventListener('change', function (e) { if (e.target.name === 'motif') syncMotif(); });
    syncMotif();

    var days = [];
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    while (days.length < 12) {
      if (A.hours.days.indexOf(d.getDay()) >= 0) days.push(new Date(d));
      d.setDate(d.getDate() + 1);
    }
    daysEl.innerHTML = days.map(function (x, i) {
      return '<button class="day" type="button" data-day="' + i + '" aria-pressed="false"><small>' + x.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '') + '</small><b>' + x.getDate() + '</b><small>' + x.toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '') + '</small></button>';
    }).join('');

    var SLOTS = ['10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    function renderSlots() {
      if (chosen.day === null) {
        slotsEl.innerHTML = '<p class="muted" style="grid-column:1/-1;margin:0;font-size:13px;letter-spacing:0;text-transform:none">Choisissez d\'abord un jour.</p>';
        return;
      }
      var day = days[chosen.day];
      var now = new Date();
      slotsEl.innerHTML = SLOTS.map(function (s) {
        var h = parseInt(s, 10);
        var past = day.toDateString() === now.toDateString() && h <= now.getHours() + 1;
        return '<button class="slot" type="button" data-slot="' + s + '" aria-pressed="' + (chosen.slot === s) + '"' + (past ? ' disabled' : '') + '>' + s + '</button>';
      }).join('');
    }
    function label() {
      var l = $('[data-when]');
      if (chosen.day === null) { l.textContent = ''; return; }
      l.textContent = days[chosen.day].toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + (chosen.slot ? ' · ' + chosen.slot : '');
    }
    daysEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-day]');
      if (!b) return;
      chosen.day = +b.getAttribute('data-day');
      chosen.slot = null;
      $$('[data-day]', daysEl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $('[data-slot-field]').classList.remove('is-error');
      renderSlots();
      label();
    });
    slotsEl.addEventListener('click', function (e) {
      var b = e.target.closest('[data-slot]');
      if (!b || b.disabled) return;
      chosen.slot = b.getAttribute('data-slot');
      $$('[data-slot]', slotsEl).forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      $('[data-slot-field]').classList.remove('is-error');
      label();
    });
    renderSlots();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.elements.website.value) return;
      var ok = validate(form);
      var sf = $('[data-slot-field]');
      var m = form.elements.motif.value;
      var needSlot = m !== 'recherche';
      if (needSlot && (chosen.day === null || !chosen.slot)) {
        sf.classList.add('is-error');
        $('.field__err', sf).textContent = chosen.day === null ? 'Choisissez un jour' : 'Choisissez un horaire';
        if (ok) sf.scrollIntoView({ behavior: 'smooth', block: 'center' });
        ok = false;
      }
      if (!ok) return;
      var el = form.elements;
      var when = chosen.day !== null ? days[chosen.day].toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) + (chosen.slot ? ', ' + chosen.slot : '') : 'À convenir';
      var labels = { visite: 'Visite du showroom', essai: 'Essai d\'un véhicule', depot: 'Dépôt-vente', recherche: 'Recherche personnalisée', autre: 'Autre demande' };
      var details = { Motif: labels[m], Créneau: when, Message: el.msg.value.trim() || '—' };
      var subject = labels[m];
      if (m === 'recherche') {
        details['Modèle recherché'] = el.wish.value.trim() || '—';
        details.Budget = el.budget.value || '—';
        details.Délai = el.delai.value || '—';
        subject = 'Cherche ' + (el.wish.value.trim() || 'un véhicule') + (el.budget.value ? ', budget ' + el.budget.value : '');
      }
      S.addLead({
        type: m === 'recherche' ? 'recherche' : m === 'depot' ? 'depot' : 'rdv',
        name: el.name.value.trim(), phone: el.phone.value.trim(), email: el.email.value.trim(),
        subject: subject, vehicle: vcar ? vcar.id : undefined, details: details
      });
      success(form.parentNode, m === 'recherche' ? 'Recherche enregistrée.' : 'Rendez-vous demandé.',
        m === 'recherche' ? 'Nous lançons la recherche et revenons vers vous avec des propositions.' : 'Demande pour ' + esc(when) + '. Nous vous confirmons le créneau par téléphone ou par email.',
        '<a class="link" href="admin.html#demandes">Voir côté back-office (démo)</a>');
    });
  }

  /* ---------- Démarrage ---------- */
  buildLayout();
  initHeader();
  initOpenStatus();
  initFavs();
  initTransitions();
  if (page === 'home') initHome();
  if (page === 'stock') initStock();
  if (page === 'vehicle') initVehicle();
  if (page === 'depot') initDepot();
  if (page === 'contact') initContact();
  reveal();
  initIntro();
})();
