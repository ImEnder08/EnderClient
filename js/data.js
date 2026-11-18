/* Dati del sito: moduli, config pronte, versioni, novita, mod del launcher.
   Per aggiornare il sito basta cambiare questo file. */
window.ENDER = (function () {
  "use strict";

  // Icone (24x24, solo contorno). Ogni voce e' il contenuto di un <svg>.
  var I = {
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    sparkle: '<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 17l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/>',
    crosshair: '<circle cx="12" cy="12" r="7"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
    music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    box: '<path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M4 7l8 4 8-4M12 11v10"/>',
    scale: '<path d="M4 14v6h6M20 10V4h-6M4 20l7-7M20 4l-7 7"/>',
    apple: '<path d="M12 7c-2-2-7-1-7 5 0 5 3 9 7 9s7-4 7-9c0-6-5-7-7-5z"/><path d="M12 7c0-2 1-4 3-4"/>',
    shield: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
    gauge: '<path d="M4 17a8 8 0 1116 0"/><path d="M12 17l4-5"/>',
    signal: '<path d="M4 20v-3M9 20v-7M14 20V9M19 20V4"/>',
    mouse: '<rect x="7" y="3" width="10" height="18" rx="5"/><path d="M12 7v4"/>',
    totem: '<circle cx="12" cy="6" r="3"/><path d="M8 21l1-8h6l1 8zM5 13h14"/>',
    flameoff: '<path d="M12 3c1 4 5 6 5 11a5 5 0 01-10 0c0-3 2-5 2-7 1 1 2 2 3 4"/><path d="M4 4l16 16"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>',
    dots: '<path d="M5 8h.01M12 5h.01M19 9h.01M8 15h.01M16 15h.01M12 19h.01M3 13h.01M21 15h.01"/>',
    pin: '<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    wind: '<path d="M3 8h11a3 3 0 10-3-3M3 12h16a3 3 0 11-3 3M3 16h7"/>',
    zoom: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-5-5M11 8v6M8 11h6"/>',
    run: '<path d="M13 5l7 7-7 7M5 5l7 7-7 7"/>',
    ruler: '<path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>',
    flask: '<path d="M9 3h6M10 3v6l-5 9a2 2 0 002 3h10a2 2 0 002-3l-5-9V3"/><path d="M7 15h10"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z"/>',
    sword: '<path d="M20 4L9 15M20 4h-5M20 4v5M7 13l4 4M5 19l2-2"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
    move: '<path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8l6 4-6 4z"/>',
    monitor: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="M8 21h8M12 17v4"/>',
    vignette: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>',
    command: '<path d="M9 6a3 3 0 10-3 3h12a3 3 0 10-3-3v12a3 3 0 103-3H6a3 3 0 103 3z"/>',
    userx: '<circle cx="10" cy="8" r="4"/><path d="M3 20c0-4 3-6 7-6M16 14l5 5M21 14l-5 5"/>',
    flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
    rotate: '<path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"/>',
    grid: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
    swap: '<path d="M4 8h14l-4-4M20 16H6l4 4"/>',
    fall: '<path d="M12 4v13M6 11l6 6 6-6M5 21h14"/>',
    contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 010 18z" fill="currentColor" stroke="none"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><path d="M7.5 7.5h.01"/>',
    zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    user: '<circle cx="12" cy="7" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M4 19h16"/>',
    login: '<path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
    rocket: '<path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2M14 4c4-2 6 0 6 0s2 2 0 6l-7 7-6-6z"/><circle cx="15" cy="9" r="1.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    package: '<path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10M7.5 5l9 4"/>',
    puzzle: '<path d="M10 3h4v3a2 2 0 104 0V3h3v7h-3a2 2 0 100 4h3v7h-7v-3a2 2 0 10-4 0v3H3v-7h3a2 2 0 100-4H3V3z"/>',
    skin: '<rect x="8" y="2" width="8" height="7" rx="1"/><path d="M6 10h12v6H6zM8 16v6M16 16v6M12 16v6"/>',
    server: '<rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/>',
    discord: '<path d="M8 8.5c2.6-1 5.4-1 8 0M7.5 16c2.8 1.2 6.2 1.2 9 0"/><path d="M6.5 6.5L5 17l3 2 1-2M17.5 6.5L19 17l-3 2-1-2"/><circle cx="9.5" cy="12.5" r="1"/><circle cx="14.5" cy="12.5" r="1"/>',
    refresh: '<path d="M20 11a8 8 0 10-2.3 5.7M20 4v7h-7"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 018 0v4"/>',
    memory: '<rect x="3" y="7" width="18" height="10" rx="1.5"/><path d="M7 7V4M12 7V4M17 7V4M7 20v-3M12 20v-3M17 20v-3"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrowL: '<path d="M15 5l-7 7 7 7"/>',
    arrowR: '<path d="M9 5l7 7-7 7"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"/><path d="M16 4.6a3.5 3.5 0 010 6.8M18 14.3c2.2.6 3.5 2.8 3.5 5.7"/>',
    hanger: '<path d="M12 7.5a2.2 2.2 0 10-2.2-2.2"/><path d="M12 7.5v1.4L3.2 15.6A1.6 1.6 0 004.2 18.5h15.6a1.6 1.6 0 001-2.9L12 8.9"/>',
    bell: '<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',
    cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1.5 0 2-1 2-2s-1-1.6-1-2.5 1-1.5 2-1.5h2a4 4 0 004-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1.2"/><circle cx="10" cy="7" r="1.2"/><circle cx="15" cy="7.5" r="1.2"/>',
    windows: '<path d="M3 5.5l7.5-1v7H3zM12.5 4.2L21 3v8.5h-8.5zM3 12.5h7.5v7L3 18.5zM12.5 12.5H21V21l-8.5-1.2z"/>'
  };

  var CATS = {
    combat: { n: "Combat", d: "Per il PvP: hitbox, vita del bersaglio, effetti e allenamento." },
    hud: { n: "HUD", d: "Informazioni a schermo, ognuna spostabile e con il suo stile." },
    visual: { n: "Visual", d: "Come vedi il mondo: luce, mirino, mano, colori e animazioni." },
    misc: { n: "Misc", d: "Utilità per giocare comodo: sprint, macro, waypoint, Spotify." }
  };

  // n = nome, c = categoria, i = icona, d = descrizione, o = opzioni principali.
  var MODS = [
    { id: "kill_effect", n: "Kill Effect", c: "combat", i: "sparkle", d: "Effetti quando uccidi: totem, fulmine, flash colorato e finisher in stile Valorant.", o: ["Finisher: Aemondir, Primordium, Kuronami, Reaver", "Corpo che sale in aria come un angelo, poi crolla", "Flash dello schermo con colore e intensità", "Pulsante Prova per vederli subito"] },
    { id: "hitbox", n: "Hitbox", c: "combat", i: "box", d: "Hitbox colorate con filtri per tipo di entità, e un colore diverso quando sei a portata.", o: ["Colore normale e colore a portata di colpo", "Linea degli occhi e della direzione", "Giocatori, mob, item, proiettili e altri gruppi", "Distanza massima e la tua hitbox in terza persona"] },
    { id: "health_indicator", n: "Health Indicator", c: "combat", i: "heart", d: "Cuori sopra la testa di giocatori e mob, più l'HUD di chi stai puntando.", o: ["Cuori oppure numero + cuore", "Cuori dorati dell'assorbimento", "Grandezza e altezza sopra la testa", "HUD con testa, nome e vita del bersaglio"] },
    { id: "hit_color", n: "Hit Color", c: "combat", i: "zap", d: "Il lampeggio di chi colpisci prende il colore che vuoi, con l'intensità che vuoi.", o: ["Colore dalla ruota, anche RGB", "Intensità: vanilla è rosso al 30%"] },
    { id: "fake_player", n: "Fake Player", c: "combat", i: "user", d: "Un giocatore finto, solo sul tuo client, da colpire per allenarti.", o: ["Fermo, oppure salto + planata con le elytra ogni tot colpi", "Knockback e critici come in vanilla", "Ping simulato da 0 a 300 ms", "La tua skin con tutti i layer e la tua armatura"] },
    { id: "reach", n: "Reach Display", c: "combat", i: "ruler", d: "La distanza a cui hai colpito l'ultimo avversario, in blocchi.", o: ["1 o 2 decimali", "Con o senza la scritta Reach"] },
    { id: "armor_status", n: "Armor Status", c: "combat", i: "shield", d: "Armatura e durabilità di ogni pezzo nell'HUD.", o: ["Caselle vuote opzionali", "Grandezza in percentuale"] },
    { id: "gap_counter", n: "Gap Counter", c: "combat", i: "apple", d: "Quante mele d'oro hai addosso, sempre a schermo.", o: ["Testo + icona o solo icona", "Sfondo, colore e ombra"] },

    { id: "fps", n: "FPS", c: "hud", i: "gauge", d: "Gli FPS a schermo.", o: ["Opacità e colore dello sfondo", "Ombra del testo"] },
    { id: "ping", n: "Ping", c: "hud", i: "signal", d: "La latenza col server, in millisecondi.", o: ["\"Ping: 45ms\" o solo \"45ms\""] },
    { id: "cps", n: "CPS", c: "hud", i: "mouse", d: "Click al secondo del tasto sinistro e destro.", o: ["Tre formati: CPS: 5 3, 5 | 3, CPS: 5 | 3"] },
    { id: "keystrokes", n: "Keystrokes", c: "hud", i: "keyboard", d: "WASD, spazio e click del mouse, che si illuminano quando li premi.", o: ["Sfondo e colori dei tasti", "CPS sotto i tasti del mouse"] },
    { id: "coordinates", n: "Coordinate", c: "hud", i: "pin", d: "Coordinate con direzione e bioma.", o: ["Su una riga o su tre righe", "Direzione cardinale", "Bioma attuale"] },
    { id: "clock", n: "Clock", c: "hud", i: "clock", d: "Ora, data e tempo di gioco della sessione.", o: ["Ora, data, data e ora o solo sessione", "Secondi e formato 12 ore"] },
    { id: "potion_status", n: "Potion Status", c: "hud", i: "flask", d: "Effetti attivi con icona, nome e tempo rimasto.", o: ["Icone, nomi e tempo", "Nasconde le icone vanilla in alto a destra"] },
    { id: "totem_counter", n: "Totem Counter", c: "hud", i: "totem", d: "Quanti totem ti restano.", o: ["Testo + icona o solo icona"] },
    { id: "hud_tweaks", n: "HUD", c: "hud", i: "layout", d: "Sposta e ridimensiona boss bar, titoli e scoreboard.", o: ["Posizione e scala di ogni elemento", "Focus mode: un tasto nasconde quello che scegli, anche la chat", "Scoreboard senza numeri rossi e con lo sfondo che vuoi"] },
    { id: "chat", n: "Chat", c: "hud", i: "chat", d: "La chat come vuoi tu, con l'orario di ogni messaggio.", o: ["Orario all'inizio o alla fine, col formato che scrivi tu", "Colore dalla ruota o con i codici &", "Posizione, grandezza e sfondo", "Ding quando ti scrivono e il tuo nick colorato"] },
    { id: "mouse_movement", n: "Mouse Movement", c: "hud", i: "move", d: "Mostra come muovi il mouse, con una piccola scia.", o: ["Grandezza e sensibilità", "Scia accesa o spenta"] },
    { id: "inventory_view", n: "Inv View", c: "hud", i: "grid", d: "L'inventario sempre visibile a schermo.", o: ["Caselle vuote opzionali", "Grandezza"] },

    { id: "crosshair", n: "Crosshair", c: "visual", i: "crosshair", d: "Croce, punto, cerchio, oppure disegnato da te pixel per pixel.", o: ["Griglia 15x15 con simmetria", "Dimensione, spessore e opacità", "Colore con ruota, trasparenza e RGB", "Attack indicator sotto il mirino"] },
    { id: "fullbright", n: "Fullbright", c: "visual", i: "sun", d: "Vedi tutto anche nelle grotte e di notte, senza pozioni.", o: ["Si accende e si spegne al volo"] },
    { id: "zoom", n: "Zoom", c: "visual", i: "zoom", d: "Zoom su un tasto, come un cannocchiale.", o: ["Da 2x a 10x", "Morbido, con la sua velocità", "Rotella per regolarlo", "Tieni premuto o premi una volta"] },
    { id: "motion_blur", n: "Motion Blur", c: "visual", i: "wind", d: "Una scia di movimento quando giri la visuale.", o: ["Intensità dal 10% al 90%"] },
    { id: "viewmodel", n: "ViewModel", c: "visual", i: "sword", d: "Posizione, rotazione e scala della mano in prima persona.", o: ["Assi X, Y e Z per ognuno", "Importa i config di Viewmodel Changer"] },
    { id: "swing", n: "Change Swing", c: "visual", i: "rotate", d: "L'animazione del colpo più lenta o più veloce, e la mano più ferma.", o: ["Durata in tick", "Haste e fatica mineraria come in vanilla", "Mano ferma quando giri la visuale", "Mano che scende durante il colpo"] },
    { id: "contrast", n: "Contrast", c: "visual", i: "contrast", d: "Contrasto, saturazione e luminosità del mondo.", o: ["Tre slider, l'HUD resta uguale"] },
    { id: "visual_ratio", n: "Visual Ratio", c: "visual", i: "monitor", d: "Il mondo in 4:3 stretched, o con il rapporto che vuoi.", o: ["Da 1:1 a 4:1", "HUD e menu restano normali"] },
    { id: "damage_vignette", n: "Damage Vignette", c: "visual", i: "vignette", d: "Bordi rossi dello schermo quando hai poca vita.", o: ["Soglia e intensità", "Pulsazione", "Scossone del danno regolabile"] },
    { id: "nametags", n: "Nametags", c: "visual", i: "tag", d: "La tua name tag in terza persona.", o: ["Solo nome, nome + vita o come la manda il server", "Ombra e sfondo"] },
    { id: "item_physic", n: "Item Physic", c: "visual", i: "fall", d: "Gli item a terra cadono e girano come oggetti veri.", o: ["Rotazione mentre cadono", "Velocità di rotazione"] },
    { id: "item_outline", n: "Item Outline", c: "visual", i: "sparkle", d: "Un bordo colorato attorno agli item a terra e a quello che tieni in mano.", o: ["Colore singolo, gradiente, arcobaleno o rarità", "Visibile anche attraverso i blocchi", "Spessore e opacità (fino alla 1.21.1)"] },
    { id: "block_outline", n: "Block Outline", c: "visual", i: "cube", d: "Il contorno del blocco che punti, col colore e lo spessore che vuoi.", o: ["Colore dalla ruota, anche RGB, con la trasparenza", "Spessore da 1 a 6 pixel", "Colora anche la faccia puntata o tutto il blocco"], tag: "Nuovo" },
    { id: "item_switch", n: "Item Switch", c: "visual", i: "swap", d: "Texture personalizzate per i tuoi item, senza resource pack.", o: ["Un'immagine per ogni item", "Anche sul blocco piazzato, con la sua forma"] },
    { id: "item_size", n: "Item Dim", c: "visual", i: "scale", d: "Cambia la grandezza degli oggetti.", o: ["Da 0.5x a 3x"] },
    { id: "particles", n: "Particle", c: "visual", i: "dots", d: "Quante particelle vedere, fino a nessuna.", o: ["Tutte, ridotte, minime oppure off"] },
    { id: "no_fire", n: "No Fire", c: "visual", i: "flameoff", d: "Toglie il fuoco che copre lo schermo quando bruci.", o: ["Vedi bene anche col fuoco addosso"] },

    { id: "toggle_sprint", n: "Toggle Sprint", c: "misc", i: "run", d: "Corsa e sneak attivi senza tenere premuto il tasto.", o: ["Sprint e sneak separati", "Scritta nell'HUD"] },
    { id: "freelook", n: "Freelook", c: "misc", i: "eye", d: "Guardati intorno senza girare il personaggio.", o: ["Tieni premuto o premi una volta", "Vista da davanti", "Distanza della telecamera con la rotella"] },
    { id: "spotify", n: "Spotify", c: "misc", i: "play", d: "Il brano che stai ascoltando nell'HUD, con i controlli su un tasto.", o: ["Artista, copertina, barre e progresso", "Larghezza massima"] },
    { id: "macros", n: "Macro", c: "misc", i: "command", d: "Messaggi e comandi su un tasto.", o: ["Macro protette da codice per le password", "Restano solo tue"] },
    { id: "waypoints", n: "Waypoint", c: "misc", i: "flag", d: "Punti nel mondo con raggio colorato, nome e distanza.", o: ["Fino a 50 per mondo", "Waypoint automatico dove muori", "Tasto per aggiungerne uno dove sei"] },
    { id: "nick_hider", n: "Nick Hider", c: "misc", i: "userx", d: "Sostituisce il tuo nick con uno scelto da te, solo sul tuo schermo.", o: ["Comodo per registrare e fare stream"] },
    { id: "sound_click", n: "Soundclick", c: "misc", i: "music", d: "Un suono a ogni click e il rumore di una tastiera meccanica.", o: ["8 suoni per il mouse, con volume e tono", "Switch per la tastiera", "Mouse e tastiera separati"] }
  ];

  var PRESETS = [
    { id: "pvp", n: "PvP", d: "Tutto per il combattimento", mods: ["keystrokes", "cps", "fps", "ping", "hitbox", "reach", "health_indicator", "armor_status", "gap_counter", "totem_counter", "toggle_sprint", "zoom", "hit_color", "crosshair", "no_fire", "fullbright"] },
    { id: "survival", n: "Survival", d: "Esplorare e costruire", mods: ["coordinates", "clock", "waypoints", "fullbright", "potion_status", "armor_status", "item_physic", "zoom", "toggle_sprint", "fps"] },
    { id: "streamer", n: "Streamer", d: "Pulito e senza il tuo nick", mods: ["nick_hider", "spotify", "clock", "fps", "cps", "keystrokes", "crosshair", "contrast", "mouse_movement"] },
    { id: "minimal", n: "Minimal", d: "Solo l'essenziale", mods: ["fps", "crosshair", "zoom"] }
  ];

  // ender: mod Ender disponibile; soon: in arrivo. Il launcher le avvia tutte.
  var VERSIONS = [
    { v: "1.7.10", t: "Classica", ender: false, note: "Per le mod storiche." },
    { v: "1.8.9", t: "PvP classico", soon: true, note: "La versione del PvP storico. La mod Ender per la 1.8.9 è in lavorazione." },
    { v: "1.12.2", t: "Modpack", ender: false, note: "La versione dei grandi modpack." },
    { v: "1.16.5", t: "Nether Update", ender: false, note: "" },
    { v: "1.19.4", t: "The Wild", ender: false, note: "" },
    { v: "1.20.1", t: "Trails & Tales", ender: true, note: "" },
    { v: "1.20.4", t: "Trails & Tales", ender: true, note: "" },
    { v: "1.21.1", t: "Tricky Trials", ender: true, note: "" },
    { v: "1.21.4", t: "Garden Awakens", ender: true, note: "" },
    { v: "1.21.11", t: "Ultima 1.21", ender: true, note: "" },
    { v: "26.2", t: "Nuova numerazione", ender: true, note: "" },
    { v: "26.3", t: "La più recente", ender: true, note: "Con il nuovo motore grafico di Minecraft." }
  ];

  var CHANGELOG = [
    { when: "10 novembre 2026", tag: "Mod e launcher, tutte le versioni", items: [
      "Amici e chat: lista amici in gioco (tasto O) e nel launcher, chat private e gruppi fino a 10 persone, soprannomi, notifiche col suono che vuoi e il server dove giocano",
      "Guardaroba: 36 cosmetici tra mantelli, ali, aureole, bandane, pet ed extra, anche nel launcher con l'anteprima 3D; nuovo set NewOrder, Volpe bianca e Mini te",
      "Emote con la ruota (tasto B): Loser, Griddy, Twerk e altre",
      "Nuovo look a tema spazio in tutti i menu, con le costellazioni che seguono il mouse",
      "Nuovo modulo Block Outline",
      "Logo nitido ovunque e caricamento col logo che si riempie di luce"
    ] },
    { when: "28 ottobre 2026", tag: "Mod, tutte le versioni", items: [
      "Nuovo modulo Chat: la parte chat del modulo HUD ha un modulo tutto suo",
      "Orario dei messaggi in chat, all'inizio o alla fine, col formato e il colore che vuoi (anche con i codici &)"
    ] },
    { when: "27 ottobre 2026", tag: "Mod, tutte le versioni", items: [
      "Nuovo modulo Item Outline: bordo colorato attorno agli item a terra e in mano",
      "Item Switch: la tua texture anche sul blocco piazzato, che tiene la sua forma"
    ] },
    { when: "25 ottobre 2026", tag: "Mod, tutte le versioni", items: [
      "Hit Color: il colore del colpo lo scegli tu",
      "Fake Player: bersaglio per allenarsi, fermo o con le elytra, knockback vanilla e ping simulato",
      "Kill Effect Custom: Angelo e Unicorno",
      "HUD del giocatore puntato come Health Indicator TXF",
      "Caricamento e menu principale di Ender Client",
      "Trasparenza in tutte le ruote dei colori",
      "RGB più lento e con la velocità separata per ogni colore"
    ] },
    { when: "20 ottobre 2026", tag: "Mod, tutte le versioni", items: [
      "Finisher Kuronami rifatta",
      "Change Swing: la mano scende durante il colpo",
      "Nuovi moduli Nametags e Contrast",
      "Profili con codice di condivisione",
      "Macro, anche protette da codice"
    ] },
    { when: "3 ottobre 2026", tag: "Mod", items: [
      "Una sola mod per 7 versioni: 1.20.1, 1.20.4, 1.21.1, 1.21.4, 1.21.11, 26.2 e 26.3"
    ] }
  ];

  // Catalogo d'esempio della pagina Mod nel launcher finto.
  var LAUNCHER_MODS = [
    { n: "Sodium", t: "Prestazioni", d: "Più FPS con un motore di rendering riscritto." },
    { n: "Iris Shaders", t: "Shader", d: "Shader pack compatibili con Sodium." },
    { n: "Lithium", t: "Prestazioni", d: "Ottimizza fisica, IA e tick del mondo." },
    { n: "Fabric API", t: "Libreria", d: "Serve alla maggior parte delle mod Fabric." },
    { n: "Mod Menu", t: "Utilità", d: "La lista delle mod installate, con le loro impostazioni." },
    { n: "Entity Culling", t: "Prestazioni", d: "Non disegna le entità che non vedi." },
    { n: "FerriteCore", t: "Memoria", d: "Usa meno RAM." },
    { n: "Litematica", t: "Costruzione", d: "Schemi olografici per costruire." }
  ];

  return { ICONS: I, CATS: CATS, MODS: MODS, PRESETS: PRESETS, VERSIONS: VERSIONS, CHANGELOG: CHANGELOG, LAUNCHER_MODS: LAUNCHER_MODS };
})();
