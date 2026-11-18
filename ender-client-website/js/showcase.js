/* ═══════════════════════════════════════════════════════════════
   ENDER CLIENT · showcase 3D dei cosmetici
   Due personaggi (skinview3d): quello dell'hero, che cambia look da
   solo, e lo studio, dove il visitatore sceglie. I cosmetici vengono da
   cosmetics-core.js (lo stesso motore del guardaroba del launcher).
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (typeof skinview3d === 'undefined' || typeof THREE === 'undefined' || typeof EnderCosmetics === 'undefined') {
    // Senza WebGL o senza le librerie: un messaggio al posto del personaggio.
    Array.prototype.forEach.call(document.querySelectorAll('#hero-stage, #studio-stage'), function (stage) {
      var msg = document.createElement('p');
      msg.className = 'stage-msg';
      msg.textContent = "L'anteprima 3D non si è caricata. Ricarica la pagina, o provala dal launcher.";
      stage.appendChild(msg);
    });
    return;
  }

  var EC = EnderCosmetics;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DEFAULT_SKIN = (window.ENDER_ASSETS && window.ENDER_ASSETS['assets/skins/imender08.png']) || 'assets/skins/imender08.png';
  EC.setSkinUrl(DEFAULT_SKIN);

  // Look pronti (anche i "set" dello studio).
  var LOOKS = [
    { name: 'Set NewOrder', items: { cape: 'neworder', wings: 'neworder_bat_wings', head: 'neworder_halo', bandana: 'neworder_bandana' } },
    { name: 'Celestiale', items: { cape: 'galaxy', wings: 'cosmic_wings', head: 'ender_halo', extra: 'orbit' } },
    { name: 'Demone', items: { cape: 'red_galaxy', wings: 'demon_wings', head: 'horns', extra: 'demon_tail' } },
    { name: 'Inferno', items: { cape: 'flames', wings: 'black_bat_wings', head: 'crown', bandana: 'purple_flames_bandana' } },
    { name: 'Angelo', items: { cape: 'andromeda', wings: 'angel_wings', head: 'halo', extra: 'sparkles' } },
    { name: 'Hacker', items: { cape: 'hacker', wings: 'galaxy_bat_wings', bandana: 'galaxy_bandana', extra: 'magic_circle' } }
  ];

  // ─── un personaggio con i suoi cosmetici ───
  function Rig(canvas, opts) {
    var stage = canvas.parentElement;
    this.viewer = new skinview3d.SkinViewer({
      canvas: canvas,
      width: stage.clientWidth || 400,
      height: stage.clientHeight || 500,
      skin: DEFAULT_SKIN,
      model: 'auto-detect'
    });
    var v = this.viewer;
    v.controls.enablePan = false;
    v.controls.enableZoom = false;
    v.controls.rotateSpeed = 0.55;
    v.fov = opts.fov || 38;
    v.zoom = opts.zoom || 0.72;
    v.animation = new skinview3d.IdleAnimation();
    v.autoRotate = !!opts.spin && !reduce;
    v.autoRotateSpeed = opts.spinSpeed || 0.7;
    if (v.globalLight) v.globalLight.intensity = 2.2;
    if (v.cameraLight) v.cameraLight.intensity = 0.9;
    this.loadout = {};
    this.attached = [];
    this.key = null;
    this.capeVersion = -1;
    new ResizeObserver(function () {
      if (stage.clientWidth > 0 && stage.clientHeight > 0) v.setSize(stage.clientWidth, stage.clientHeight);
    }).observe(stage);
    // Fuori dallo schermo non si disegna.
    new IntersectionObserver(function (es) { v.renderPaused = !es[0].isIntersecting; }, { threshold: 0.01 }).observe(stage);
  }
  Rig.prototype.set = function (loadout, force) {
    this.loadout = Object.assign({}, loadout);
    var want = Object.keys(this.loadout).map(function (k) { return EC.byId(this.loadout[k]); }, this).filter(Boolean);
    var key = want.map(function (c) { return c.id; }).sort().join(',');
    if (!force && key === this.key) return;
    this.key = key;
    this.attached.forEach(function (a) { a.parent.remove(a.obj); });
    this.attached = [];
    var v = this.viewer, skin = v.playerObject.skin, self = this;
    var cape = want.filter(function (c) { return c.slot === 'cape'; })[0];
    this.capeVersion = -1;
    if (cape) v.loadCape(EC.texture(cape.id).canvas, { backEquipment: 'cape' }); else v.loadCape(null);
    want.forEach(function (c) {
      if (c.slot === 'cape') return;
      var built = EC.build3D(c);
      if (!built) return;
      var parent = built.attach === 'head' ? skin.head : skin;
      parent.add(built.obj);
      self.attached.push({ parent: parent, obj: built.obj });
    });
  };
  Rig.prototype.ids = function () {
    var out = [];
    for (var k in this.loadout) out = out.concat(EC.texIds(this.loadout[k]));
    return out;
  };
  Rig.prototype.update = function (age, dt) {
    var capeId = this.loadout.cape;
    var t = capeId ? EC.texture(capeId) : null;
    if (t && t.version !== this.capeVersion) {
      this.capeVersion = t.version;
      this.viewer.loadCape(t.canvas, { backEquipment: 'cape' });
    }
    this.attached.forEach(function (a) { if (a.obj.userData.update) a.obj.userData.update(age, dt); });
  };

  var rigs = [];
  var cardCanvases = [];
  // Mantelli animati fissi nella pagina (scheda "36 cosmetici" delle novita').
  var fixedCanvases = Array.prototype.map.call(document.querySelectorAll('canvas[data-cape]'), function (cv) {
    return { cv: cv, id: cv.getAttribute('data-cape'), kind: 'cape', version: -1 };
  });

  // ─── hero ───
  (function hero() {
    var canvas = $('#hero-viewer');
    if (!canvas) return;
    var rig = new Rig(canvas, { spin: true, spinSpeed: 0.9, zoom: 0.62, fov: 36 });
    rig.viewer.playerWrapper.rotation.y = Math.PI * 0.82;
    rigs.push(rig);
    var dots = $('#hero-dots'), look = $('#hero-look'), name = $('#hero-look-name');
    dots.innerHTML = LOOKS.map(function (l, i) { return '<button type="button" aria-label="' + l.name + '"' + (i === 0 ? ' class="is-on"' : '') + '></button>'; }).join('');
    var btns = $$('button', dots), cur = 0, timer = null, hover = false;
    function show(i) {
      cur = i;
      look.classList.add('is-swap');
      setTimeout(function () {
        rig.set(LOOKS[i].items);
        name.textContent = LOOKS[i].name;
        look.classList.remove('is-swap');
      }, 220);
      btns.forEach(function (b, k) { b.classList.toggle('is-on', k === i); });
    }
    btns.forEach(function (b, i) { b.addEventListener('click', function () { show(i); restart(); }); });
    function restart() {
      clearInterval(timer);
      if (!reduce) timer = setInterval(function () { if (!hover && !document.hidden) show((cur + 1) % LOOKS.length); }, 5200);
    }
    canvas.addEventListener('pointerenter', function () { hover = true; });
    canvas.addEventListener('pointerleave', function () { hover = false; });
    rig.set(LOOKS[0].items);
    restart();
  })();

  // ─── studio ───
  (function studio() {
    var canvas = $('#studio-viewer');
    if (!canvas) return;
    var rig = new Rig(canvas, { spin: false, zoom: 0.66, fov: 36 });
    rigs.push(rig);
    var v = rig.viewer;
    var loadout = Object.assign({}, LOOKS[0].items);
    var tab = 'cape';
    var tabs = $('#studio-tabs'), cardsBox = $('#studio-cards'), setsBox = $('#studio-sets'), wearing = $('#studio-wearing');
    var status = $('#studio-status');
    var thumbs = {};

    function face(t) {
      // Schiena per mantelli e ali, tre quarti per i pet, quasi di fronte per il resto.
      v.playerWrapper.rotation.y = t === 'cape' || t === 'wings' ? Math.PI * 0.85 : t === 'pet' ? Math.PI * 0.22 : Math.PI * 0.12;
    }
    function hex(c) { return '#' + ('000000' + (c & 0xFFFFFF).toString(16)).slice(-6); }

    // Set pronti
    setsBox.innerHTML = LOOKS.map(function (l, i) {
      var sw = Object.keys(l.items).slice(0, 3).map(function (k) { return '<i style="background:' + hex(EC.byId(l.items[k]).color) + '"></i>'; }).join('');
      return '<button type="button" class="setbtn" data-set="' + i + '"><span class="setbtn__sw">' + sw + '</span>' + l.name + '</button>';
    }).join('');
    setsBox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-set]');
      if (!b) return;
      loadout = Object.assign({}, LOOKS[+b.getAttribute('data-set')].items);
      apply();
    });

    // Schede
    function renderTabs() {
      tabs.innerHTML = EC.SLOTS.map(function (s) {
        return '<button type="button" role="tab" data-tab="' + s.id + '" aria-selected="' + (s.id === tab) + '"' + (s.id === tab ? ' class="is-on"' : '') + '>' +
          s.label + (loadout[s.id] ? '<span class="dot"></span>' : '') + '</button>';
      }).join('');
    }
    tabs.addEventListener('click', function (e) {
      var b = e.target.closest('[data-tab]');
      if (!b) return;
      tab = b.getAttribute('data-tab');
      face(tab);
      renderTabs();
      renderCards();
    });

    // Card
    function renderCards() {
      cardCanvases = [];
      var list = EC.CATALOG.filter(function (c) { return c.slot === tab; });
      cardsBox.innerHTML = list.map(function (c) {
        return '<button type="button" role="option" class="ccard' + (loadout[c.slot] === c.id ? ' is-on' : '') + '" data-id="' + c.id + '" aria-selected="' + (loadout[c.slot] === c.id) + '" title="' + c.description + '" style="--c:' + hex(c.color) + '">' +
          '<span class="ccard__art" data-art="' + c.id + '"></span><span class="ccard__name">' + c.label + '</span>' +
          '<span class="ccard__check"><i class="ic" data-icon="check"></i></span></button>';
      }).join('');
      $$('.ccard__check .ic', cardsBox).forEach(function (el) { el.innerHTML = window.EnderIcon ? window.EnderIcon('check') : ''; });
      $$('[data-art]', cardsBox).forEach(function (el) { fillArt(el, EC.byId(el.getAttribute('data-art'))); });
    }
    cardsBox.addEventListener('click', function (e) {
      var b = e.target.closest('.ccard');
      if (!b) return;
      var c = EC.byId(b.getAttribute('data-id'));
      if (loadout[c.slot] === c.id) delete loadout[c.slot]; else loadout[c.slot] = c.id;
      apply();
    });

    function fillArt(el, c) {
      if (c.slot === 'cape' || c.slot === 'wings') {
        var cv = document.createElement('canvas');
        cv.width = c.slot === 'cape' ? 40 : 112; cv.height = 64;
        if (c.slot === 'cape') { cv.style.width = '50px'; cv.style.height = '80px'; } else { cv.style.width = '120px'; cv.style.height = '69px'; }
        el.appendChild(cv);
        var card = { cv: cv, id: c.id, kind: c.slot, version: -1 };
        cardCanvases.push(card);
        drawCard(card);
        return;
      }
      var url = thumb3D(c, function () { if (tab === c.slot) renderCards(); });
      if (url) { var im = new Image(); im.src = url; im.alt = ''; el.appendChild(im); } else { el.innerHTML = '<span class="ph"></span>'; }
    }
    function drawCard(card) {
      var t = EC.texture(card.id);
      if (!t || card.version === t.version) return;
      card.version = t.version;
      var ctx = card.cv.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.clearRect(0, 0, card.cv.width, card.cv.height);
      if (card.kind === 'cape') {
        var s = t.img.w / 64;
        ctx.drawImage(t.canvas, s, s, 10 * s, 16 * s, 0, 0, 40, 64);
      } else {
        ctx.save(); ctx.drawImage(t.canvas, 0, 0, 256, 256, 56, 4, 56, 56);
        ctx.translate(56, 0); ctx.scale(-1, 1); ctx.drawImage(t.canvas, 0, 0, 256, 256, 0, 4, 56, 56); ctx.restore();
      }
    }
    // Anteprima 3D per le card (si disegna una volta, poi resta immagine).
    var thumbRenderer = null;
    function thumb3D(c, ready) {
      if (thumbs[c.id] !== undefined) return thumbs[c.id];
      try {
        thumbRenderer = thumbRenderer || new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
        thumbRenderer.setSize(184, 184);
        thumbRenderer.outputColorSpace = THREE.SRGBColorSpace;
        var scene = new THREE.Scene();
        scene.add(new THREE.AmbientLight(0xffffff, 2.2));
        var light = new THREE.DirectionalLight(0xffffff, 1.6); light.position.set(2, 3, 4); scene.add(light);
        var obj = EC.build3D(c).obj;
        if (obj.userData.update) obj.userData.update(20, 0);
        var holder = new THREE.Group(); holder.add(obj); scene.add(holder);
        if (c.slot === 'head' || c.slot === 'bandana') {
          var head = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8), new THREE.MeshStandardMaterial({ color: 0x2c2840, roughness: 1 }));
          head.position.y = 4; holder.add(head);
        }
        var render = function () {
          var box = new THREE.Box3().setFromObject(holder);
          var center = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3());
          holder.position.sub(center);
          var dist = Math.max(size.x, size.y, size.z) * 1.35 + 1;
          var cam = new THREE.PerspectiveCamera(32, 1, 0.1, 500);
          var high = c.slot === 'head' || c.slot === 'bandana';
          cam.position.set(dist * 0.55, dist * (high ? 0.8 : 0.45), dist * (high ? 1.05 : 1.25)); cam.lookAt(0, 0, 0);
          thumbRenderer.render(scene, cam);
          return thumbRenderer.domElement.toDataURL('image/png');
        };
        if (c.slot === 'pet') {
          thumbs[c.id] = null;
          EC.loadPet(c.id).then(function (model) {
            if (!model) {
              // Modello non arrivato: si riprova tra poco.
              delete thumbs[c.id];
              setTimeout(ready, 1500);
              return;
            }
            setTimeout(function () { thumbs[c.id] = render(); ready(); }, 40);
          });
          return null;
        }
        thumbs[c.id] = render();
        return thumbs[c.id];
      } catch (err) {
        thumbs[c.id] = null;
        return null;
      }
    }

    function apply() {
      rig.set(loadout);
      renderTabs();
      $$('.ccard', cardsBox).forEach(function (b) {
        var on = loadout[EC.byId(b.getAttribute('data-id')).slot] === b.getAttribute('data-id');
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-selected', String(on));
      });
      $$('.setbtn', setsBox).forEach(function (b) {
        var l = LOOKS[+b.getAttribute('data-set')].items;
        var same = Object.keys(l).length === Object.keys(loadout).length && Object.keys(l).every(function (k) { return loadout[k] === l[k]; });
        b.classList.toggle('is-on', same);
      });
      // Mantello e bandana possono avere lo stesso nome (es. NewOrder): si dice quale.
      var names = Object.keys(loadout).map(function (k) {
        var c = EC.byId(loadout[k]);
        return c.label + (k === 'cape' ? ' (mantello)' : k === 'bandana' ? ' (bandana)' : k === 'pet' ? ' (pet)' : '');
      });
      wearing.innerHTML = names.length ? 'Indossi: <b>' + names.join(', ') + '</b>' : 'Non indossi niente';
    }

    $('#studio-clear').addEventListener('click', function () { loadout = {}; apply(); });

    // Animazione del personaggio
    $('#studio-anim').addEventListener('click', function (e) {
      var b = e.target.closest('[data-anim]');
      if (!b) return;
      var a = b.getAttribute('data-anim');
      v.animation = a === 'walk' ? new skinview3d.WalkingAnimation() : a === 'run' ? new skinview3d.RunningAnimation() : new skinview3d.IdleAnimation();
      $$('button', b.parentElement).forEach(function (x) { x.classList.toggle('is-on', x === b); });
    });
    var spin = $('#studio-spin');
    spin.setAttribute('aria-pressed', 'false');
    spin.addEventListener('click', function () {
      var on = spin.getAttribute('aria-pressed') !== 'true';
      spin.setAttribute('aria-pressed', String(on));
      v.autoRotate = on;
    });

    // La tua skin (anche il Mini te la prende)
    var statusTimer;
    function say(text, err) {
      status.textContent = text;
      status.classList.add('is-on');
      status.classList.toggle('is-err', !!err);
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { status.classList.remove('is-on'); }, 2600);
    }
    $('#skin-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#skin-name').value.trim();
      if (!/^[A-Za-z0-9_]{3,16}$/.test(name)) { say('Scrivi un nome Minecraft valido', true); return; }
      var url = 'https://mc-heads.net/skin/' + encodeURIComponent(name);
      say('Carico la skin di ' + name + '...');
      Promise.resolve(v.loadSkin(url, { model: 'auto-detect' })).then(function () {
        EC.setSkinUrl(url);
        delete thumbs.mini_me;
        rig.set(loadout, true);
        if (tab === 'pet') renderCards();
        say('Ecco la skin di ' + name);
      }).catch(function () { say('Skin non trovata', true); });
    });

    face(tab);
    renderTabs();
    renderCards();
    apply();
  })();

  // ─── animazione: texture a 20 tick al secondo (come in gioco), modelli a ogni frame ───
  function isVisible(el) {
    var r = el.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight;
  }
  var start = performance.now(), last = start, lastTick = -1;
  function frame(now) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(0.1, (now - last) / 1000) * 20;
    last = now;
    var age = (now - start) / 50;
    var tick = Math.floor(age);
    if (tick !== lastTick) {
      lastTick = tick;
      var ids = {};
      rigs.forEach(function (r) { if (!r.viewer.renderPaused) r.ids().forEach(function (id) { ids[id] = 1; }); });
      var flat = cardCanvases.concat(fixedCanvases.filter(function (c) { return isVisible(c.cv); }));
      flat.forEach(function (c) { ids[c.id] = 1; });
      EC.tickTextures(tick, Object.keys(ids));
      flat.forEach(function (c) {
        var t = EC.texture(c.id);
        if (t && t.version !== c.version) {
          c.version = -2;
          var ctx = c.cv.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.clearRect(0, 0, c.cv.width, c.cv.height);
          if (c.kind === 'cape') { var s = t.img.w / 64; ctx.drawImage(t.canvas, s, s, 10 * s, 16 * s, 0, 0, 40, 64); }
          else { ctx.save(); ctx.drawImage(t.canvas, 0, 0, 256, 256, 56, 4, 56, 56); ctx.translate(56, 0); ctx.scale(-1, 1); ctx.drawImage(t.canvas, 0, 0, 256, 256, 0, 4, 56, 56); ctx.restore(); }
          c.version = t.version;
        }
      });
    }
    rigs.forEach(function (r) { if (!r.viewer.renderPaused) r.update(age, dt); });
  }
  requestAnimationFrame(frame);
})();
