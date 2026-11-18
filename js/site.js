/* ═══════════════════════════════════════════════════════════════
   ENDER CLIENT · sito (tutto tranne il 3D, che sta in showcase.js)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var E = window.ENDER;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── icone ───
  function icon(name) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (E.ICONS[name] || E.ICONS.sparkle) + '</svg>';
  }
  function paintIcons(root) {
    $$('.ic[data-icon]', root).forEach(function (el) {
      if (!el.firstChild) el.innerHTML = icon(el.getAttribute('data-icon'));
    });
  }
  window.EnderIcon = icon;

  // ─── nav ───
  var nav = $('#nav');
  var burger = $('#nav-burger');
  var links = $('#nav-links');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') !== 'true';
    burger.setAttribute('aria-expanded', String(open));
    links.classList.toggle('is-open', open);
  });
  $$('a', links).forEach(function (a) {
    a.addEventListener('click', function () {
      burger.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    });
  });

  var progress = $('#progress');
  var sections = $$('main section[id]');
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 20);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    var current = null;
    sections.forEach(function (s) { if (s.getBoundingClientRect().top < window.innerHeight * 0.35) current = s.id; });
    $$('a', links).forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── cielo: stelle che brillano e costellazioni attirate dal mouse (come nei menu del gioco) ───
  (function sky() {
    var canvas = $('#sky');
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    var w = 0, h = 0, stars = [], nodes = [];
    var mouse = { x: -9999, y: -9999, active: false };
    var scroll = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }
    function build() {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var area = w * h;
      stars = [];
      var n = Math.min(420, Math.round(area / 4200));
      for (var i = 0; i < n; i++) {
        stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.pow(Math.random(), 3) * 1.5 + 0.3, p: Math.random() * 6.28, s: rand(0.6, 2.2), depth: rand(0.02, 0.18), tint: Math.random() < 0.18 });
      }
      nodes = [];
      var m = Math.min(70, Math.round(area / 22000));
      for (var j = 0; j < m; j++) {
        nodes.push({ x: Math.random() * w, y: Math.random() * h, hx: 0, hy: 0, vx: rand(-0.08, 0.08), vy: rand(-0.08, 0.08), ox: 0, oy: 0 });
      }
      nodes.forEach(function (nd) { nd.hx = nd.x; nd.hy = nd.y; });
    }
    build();
    window.addEventListener('resize', build);
    window.addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true; }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.active = false; });
    window.addEventListener('scroll', function () { scroll = window.scrollY; }, { passive: true });

    var shooting = null, nextShoot = performance.now() + 3000;
    function frame(t) {
      requestAnimationFrame(frame);
      if (document.hidden) return;
      ctx.clearRect(0, 0, w, h);
      // stelle (parallasse leggera con lo scroll)
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var y = ((s.y - scroll * s.depth) % h + h) % h;
        var tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(t * 0.001 * s.s + s.p);
        ctx.globalAlpha = tw * (s.r > 1.2 ? 1 : 0.75);
        ctx.fillStyle = s.tint ? '#c4b5fd' : '#ffffff';
        ctx.beginPath(); ctx.arc(s.x, y, s.r, 0, 6.283); ctx.fill();
        if (s.r > 1.45) {
          ctx.globalAlpha = tw * 0.25;
          ctx.fillRect(s.x - 3.5, y - 0.4, 7, 0.8); ctx.fillRect(s.x - 0.4, y - 3.5, 0.8, 7);
        }
      }
      ctx.globalAlpha = 1;
      // nodi delle costellazioni: vagano piano, il mouse li attira
      var R = 170;
      for (var k = 0; k < nodes.length; k++) {
        var nd = nodes[k];
        if (!reduce) {
          nd.hx += nd.vx; nd.hy += nd.vy;
          if (nd.hx < -20) nd.hx = w + 20; if (nd.hx > w + 20) nd.hx = -20;
          if (nd.hy < -20) nd.hy = h + 20; if (nd.hy > h + 20) nd.hy = -20;
        }
        var tx = 0, ty = 0;
        if (mouse.active) {
          var dx = mouse.x - nd.hx, dy = mouse.y - nd.hy, d = Math.hypot(dx, dy);
          if (d < R * 1.6) { var pull = (1 - d / (R * 1.6)) * 0.35; tx = dx * pull; ty = dy * pull; }
        }
        nd.ox += (tx - nd.ox) * 0.08; nd.oy += (ty - nd.oy) * 0.08;
        nd.x = nd.hx + nd.ox; nd.y = nd.hy + nd.oy;
      }
      ctx.lineWidth = 1;
      for (var a = 0; a < nodes.length; a++) {
        var na = nodes[a];
        var ma = mouse.active ? Math.hypot(mouse.x - na.x, mouse.y - na.y) : 9999;
        for (var b = a + 1; b < nodes.length; b++) {
          var nb = nodes[b];
          var dd = Math.hypot(na.x - nb.x, na.y - nb.y);
          if (dd > 150) continue;
          var mb = mouse.active ? Math.hypot(mouse.x - nb.x, mouse.y - nb.y) : 9999;
          var near = Math.max(0, 1 - Math.min(ma, mb) / R);
          var alpha = (1 - dd / 150) * (0.06 + 0.5 * near);
          if (alpha < 0.01) continue;
          ctx.strokeStyle = 'rgba(167,139,250,' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(nb.x, nb.y); ctx.stroke();
        }
        if (ma < R) {
          ctx.strokeStyle = 'rgba(196,181,253,' + ((1 - ma / R) * 0.4).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        var glow = Math.max(0, 1 - ma / R);
        ctx.fillStyle = 'rgba(221,214,254,' + (0.35 + 0.65 * glow).toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(na.x, na.y, 1.3 + glow * 1.6, 0, 6.283); ctx.fill();
      }
      // stella cadente ogni tanto
      if (!reduce) {
        if (!shooting && t > nextShoot) {
          shooting = { x: rand(w * 0.2, w), y: rand(0, h * 0.4), vx: -rand(9, 14), vy: rand(3, 6), life: 1 };
          nextShoot = t + rand(5000, 11000);
        }
        if (shooting) {
          var sh = shooting;
          var grd = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 9, sh.y - sh.vy * 9);
          grd.addColorStop(0, 'rgba(255,255,255,' + sh.life + ')'); grd.addColorStop(1, 'rgba(167,139,250,0)');
          ctx.strokeStyle = grd; ctx.lineWidth = 1.6;
          ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x - sh.vx * 9, sh.y - sh.vy * 9); ctx.stroke();
          sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.012;
          if (sh.life <= 0 || sh.x < -100 || sh.y > h + 100) shooting = null;
        }
      }
    }
    requestAnimationFrame(frame);
  })();

  // ─── comparse allo scroll ───
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  function watch(root) {
    $$('.reveal', root).forEach(function (el, i) {
      if (!el.style.getPropertyValue('--d') && el.parentElement) {
        var sib = $$('.reveal', el.parentElement).indexOf(el);
        if (sib > 0) el.style.setProperty('--d', Math.min(sib, 6) * 0.08 + 's');
      }
      io.observe(el);
    });
  }

  // ─── numeri che contano ───
  var countIo = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      countIo.unobserve(e.target);
      var el = e.target, to = +el.getAttribute('data-count'), t0 = performance.now();
      if (reduce) return;
      (function step(t) {
        var p = Math.min(1, (t - t0) / 1400);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { countIo.observe(el); });

  // ─── marquee ───
  var words = ['Kill Effect Valorant', 'Amici e chat', 'Mantelli animati', 'Hitbox', 'Keystrokes', 'Zoom', 'Ali da pipistrello', 'Freelook',
    'Block Outline', 'Emote', 'Item Physic', 'Spotify in gioco', 'Waypoint', 'Pet che ti seguono', 'Profili condivisibili', 'Sposta HUD',
    '1.20.1 → 26.3', 'Tema spazio', 'Fake Player', 'Hit Color'];
  var track = $('#marquee');
  var html = words.map(function (w) { return '<span>' + w + '</span>'; }).join('');
  track.innerHTML = html + html;

  // ─── notifica finta sopra lo screenshot degli amici ───
  (function toast() {
    var el = $('#toastdemo');
    if (!el) return;
    var msgs = ['ci sei? entra in bedwars', 'guarda il mio mantello nuovo', 'gg! rivincita?', 'ti ho mandato la config'];
    var i = 0, visible = false;
    var tIo = new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }, { threshold: 0.3 });
    tIo.observe(el.parentElement);
    function cycle() {
      if (visible) {
        $('#toastdemo-msg').textContent = msgs[i++ % msgs.length];
        el.classList.add('is-in');
        setTimeout(function () { el.classList.remove('is-in'); }, 3400);
      }
      setTimeout(cycle, 4800);
    }
    setTimeout(cycle, 1200);
  })();

  // ─── inclinazione al passaggio del mouse ───
  $$('[data-tilt]').forEach(function (el) {
    if (reduce || window.matchMedia('(hover: none)').matches) return;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'perspective(1400px) rotateY(' + (px * 6) + 'deg) rotateX(' + (-py * 5) + 'deg)';
    });
    el.addEventListener('pointerleave', function () { el.style.transform = ''; });
  });

  // ─── moduli ───
  (function modules() {
    var grid = $('#mods'), empty = $('#mods-empty'), cats = $('#mod-cats'), search = $('#mod-search');
    var cat = 'all';
    var order = { combat: 0, hud: 1, visual: 2, misc: 3 };
    var list = E.MODS.slice().sort(function (a, b) {
      if (!!b.tag !== !!a.tag) return b.tag ? 1 : -1;
      return order[a.c] - order[b.c] || a.n.localeCompare(b.n);
    });
    var tabs = [{ id: 'all', n: 'Tutti' }].concat(Object.keys(E.CATS).map(function (k) { return { id: k, n: E.CATS[k].n }; }));
    cats.innerHTML = tabs.map(function (t) {
      var count = t.id === 'all' ? E.MODS.length : E.MODS.filter(function (m) { return m.c === t.id; }).length;
      return '<button type="button" data-cat="' + t.id + '"' + (t.id === 'all' ? ' class="is-on"' : '') + '>' + t.n + ' <span class="n">' + count + '</span></button>';
    }).join('');
    grid.innerHTML = list.map(function (m) {
      return '<div class="mod" role="button" tabindex="0" data-id="' + m.id + '" data-cat="' + m.c + '" aria-expanded="false">' +
        '<span class="mod__top"><span class="mod__icon"><i class="ic" data-icon="' + m.i + '"></i></span>' +
        '<span><span class="mod__name">' + m.n + '</span><span class="mod__cat">' + E.CATS[m.c].n + '</span></span>' +
        (m.tag ? '<span class="mod__new">' + m.tag + '</span>' : '') + '</span>' +
        '<span class="mod__desc">' + m.d + '</span>' +
        '<ul class="mod__opts">' + (m.o || []).map(function (o) { return '<li>' + o + '</li>'; }).join('') + '</ul></div>';
    }).join('');
    paintIcons(grid);
    var cards = $$('.mod', grid);
    cards.forEach(function (c) {
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); }
      });
      c.addEventListener('click', function () {
        var open = !c.classList.contains('is-open');
        c.classList.toggle('is-open', open);
        c.setAttribute('aria-expanded', String(open));
        var ul = $('.mod__opts', c);
        ul.style.maxHeight = open ? ul.scrollHeight + 'px' : '0px';
      });
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    function filter() {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var m = E.MODS.filter(function (x) { return x.id === c.getAttribute('data-id'); })[0];
        var text = (m.n + ' ' + m.d + ' ' + (m.o || []).join(' ') + ' ' + E.CATS[m.c].n).toLowerCase();
        var ok = (cat === 'all' || m.c === cat) && (!q || text.indexOf(q) >= 0);
        c.hidden = !ok;
        if (ok) shown++;
      });
      empty.hidden = shown > 0;
    }
    cats.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) return;
      cat = b.getAttribute('data-cat');
      $$('button', cats).forEach(function (x) { x.classList.toggle('is-on', x === b); });
      filter();
    });
    search.addEventListener('input', filter);
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); search.focus(); }
    });
  })();

  // ─── launcher ───
  (function launcher() {
    var feats = [
      ['login', 'Login Microsoft', 'Più account e modalità Demo'],
      ['layers', 'Vanilla, Fabric, Forge', 'Qualsiasi versione'],
      ['users', 'Amici e chat', 'Anche fuori dal gioco'],
      ['hanger', 'Guardaroba 3D', 'I cosmetici col tuo personaggio'],
      ['package', 'Istanze .enderpack', 'Esporta e reimporta tutto'],
      ['puzzle', 'Catalogo CurseForge', 'Cerca, preferiti, import'],
      ['discord', 'Discord', 'Rich Presence della partita'],
      ['refresh', 'Aggiornamenti', 'Automatici e leggeri']
    ];
    $('#lfeats').innerHTML = feats.map(function (f) {
      return '<li><i class="ic" data-icon="' + f[0] + '"></i><span><b>' + f[1] + '</b><span>' + f[2] + '</span></span></li>';
    }).join('');
    var imgs = $$('#window-screens img'), tabs = $('#window-tabs'), title = $('#window-title'), cur = 0, timer;
    tabs.innerHTML = imgs.map(function (im, i) { return '<button type="button"' + (i === 0 ? ' class="is-on"' : '') + '>' + im.getAttribute('data-title') + '</button>'; }).join('');
    var btns = $$('button', tabs);
    function show(i) {
      cur = i;
      imgs.forEach(function (im, k) { im.classList.toggle('is-on', k === i); });
      btns.forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
      title.textContent = imgs[i].getAttribute('data-title');
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i); clearInterval(timer); timer = setInterval(next, 6000); }); });
    function next() { show((cur + 1) % imgs.length); }
    timer = setInterval(next, 6000);
  })();

  // ─── versioni come una costellazione ───
  (function versions() {
    var box = $('#constel');
    var list = E.VERSIONS.filter(function (v) { return v.ender; });
    box.innerHTML = '<svg aria-hidden="true"><path/></svg>' +
      list.map(function (v, i) {
        return '<div class="vnode' + (i === list.length - 1 ? ' vnode--new' : '') + '" role="listitem" style="--d:' + (i * 0.07) + 's">' +
          '<span class="vnode__star"></span><span class="vnode__v">' + v.v + '</span><span class="vnode__t">' + v.t + '</span></div>';
      }).join('');
    var path = $('svg path', box);
    function draw() {
      var r = box.getBoundingClientRect();
      var pts = $$('.vnode__star', box).map(function (s) {
        var q = s.getBoundingClientRect();
        return [q.left - r.left + q.width / 2, q.top - r.top + q.height / 2];
      });
      path.setAttribute('d', pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' '));
    }
    draw();
    window.addEventListener('resize', draw);
    setTimeout(draw, 600);
    var soon = E.VERSIONS.filter(function (v) { return v.soon; })[0];
    if (!soon) $('#constel-note').hidden = true;
  })();

  // ─── changelog ───
  (function changelog() {
    var log = $('#log'), more = $('#log-more');
    log.innerHTML = E.CHANGELOG.map(function (c, i) {
      return '<li' + (i > 2 ? ' class="is-hidden"' : '') + '><span class="log__when">' + c.when + '</span><span class="log__tag">' + c.tag + '</span>' +
        '<ul>' + c.items.map(function (it) { return '<li>' + it + '</li>'; }).join('') + '</ul></li>';
    }).join('');
    if (E.CHANGELOG.length <= 3) more.hidden = true;
    more.addEventListener('click', function () {
      $$('li.is-hidden', log).forEach(function (li) { li.classList.remove('is-hidden'); });
      more.hidden = true;
    });
  })();

  // ─── download non ancora disponibile ───
  // per riattivare il download basta togliere data-soon dai link in index.html
  (function soon() {
    var box = $('#soon');
    if (!box) return;
    var t;
    $$('[data-soon]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        box.classList.add('is-in');
        clearTimeout(t);
        t = setTimeout(function () { box.classList.remove('is-in'); }, 3200);
      });
    });
  })();

  paintIcons(document);
  watch(document);
})();
