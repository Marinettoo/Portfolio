/* ==========================================================================
   Portfolio — Jesús Pérez Marinetto
   JavaScript sin dependencias: idioma (ES/EN), tema, navbar, menú móvil, carrusel.
   El texto en español vive en index.html; aquí solo están las traducciones al inglés.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ----------------------------- Utilidades ----------------------------- */
  function qa(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }

  /* ----------------------------- Traducciones ----------------------------- */
  var EN = {
    navAria: 'Main',
    navAbout: 'About',
    navStack: 'Stack',
    navExperience: 'Experience',
    navCerts: 'Certifications',
    navProjects: 'Projects',
    navContact: 'Contact',
    heroRole: 'Network Systems Administrator',
    scrollHint: 'Scroll down',
    aboutTitle: 'About',
    aboutText: 'I am a systems and network administrator, and I am specializing in artificial intelligence, Big Data, data management and model training.',
    factLocation: 'Location',
    factLocationValue: 'Granada, Spain',
    factLanguages: 'Languages',
    langEs: 'Spanish',
    langEsLevel: 'Native',
    langEsAria: 'Spanish, native',
    langEn: 'English',
    langEnAria: 'English, level C1 of C2',
    stackTitle: 'Stack',
    groupOs: 'Operating systems and virtualization',
    groupNet: 'Network services',
    groupSec: 'Cybersecurity',
    groupDev: 'Development and databases',
    groupCloud: 'Cloud and automation',
    groupDesign: 'Design',
    groupData: 'Data and artificial intelligence',
    experienceTitle: 'Experience',
    exp1Role: 'Systems Administrator',
    exp1Dates: 'Feb 2026 – Jun 2026',
    exp2Role: 'Database Manager and Web Designer',
    exp2Dates: 'Dec 2023 – Jan 2026',
    exp3Role: 'Systems Administrator',
    exp3Dates: 'Jan 2025 – Jun 2025',
    certsTitle: 'Certifications',
    certText: 'Cybersecurity fundamentals: attack types, social engineering, cryptography and strategies to prevent, detect and respond to incidents.',
    certLink: 'View verified credential',
    projectsTitle: 'Projects',
    proj1: 'Self-hosted home backup server.',
    proj2: 'DNS query redirection.',
    proj3: 'Android app.',
    proj4: 'DHCP server lab for the Network Services and Internet module.',
    allRepos: 'All repositories on GitHub',
    contactTitle: 'Contact',
    openText: 'Open to new projects',
    contactText: 'The fastest way to reach me is by email.'
  };
  var UI = {
    es: { themeToDark: 'Cambiar a modo oscuro', themeToLight: 'Cambiar a modo claro', openMenu: 'Abrir menú', closeMenu: 'Cerrar menú',
          desc: 'Jesús Pérez Marinetto, administrador de sistemas informáticos y redes, especializándose en inteligencia artificial, Big Data, gestión de datos y entrenamiento de modelos.' },
    en: { themeToDark: 'Switch to dark mode', themeToLight: 'Switch to light mode', openMenu: 'Open menu', closeMenu: 'Close menu',
          desc: 'Jesús Pérez Marinetto, systems and network administrator, specializing in artificial intelligence, Big Data, data management and model training.' }
  };

  // Guardar el texto original (español) de cada elemento traducible
  qa('[data-i18n]').forEach(function (el) { el.setAttribute('data-es', el.textContent); });
  qa('[data-i18n-label]').forEach(function (el) { el.setAttribute('data-es-label', el.getAttribute('aria-label') || ''); });

  var lang = root.lang === 'en' ? 'en' : 'es';
  var theme = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  var roleEl = document.getElementById('hero-role');
  var metaDesc = document.querySelector('meta[name="description"]');
  var toggle = document.getElementById('nav-toggle');
  var panel = document.getElementById('nav-panel');
  var navIcon = document.getElementById('nav-icon');
  var header = document.getElementById('site-header');

  function setLang(next, persist) {
    lang = next;
    root.lang = next;
    qa('[data-i18n]').forEach(function (el) {
      var v = next === 'en' ? EN[el.getAttribute('data-i18n')] : null;
      el.textContent = v != null ? v : el.getAttribute('data-es');
    });
    qa('[data-i18n-label]').forEach(function (el) {
      var v = next === 'en' ? EN[el.getAttribute('data-i18n-label')] : null;
      el.setAttribute('aria-label', v != null ? v : el.getAttribute('data-es-label'));
    });
    qa('.lang-btn').forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === next ? 'true' : 'false');
    });
    if (metaDesc) metaDesc.setAttribute('content', UI[next].desc);
    if (roleEl) root.style.setProperty('--steps', String(roleEl.textContent.length));
    syncLabels();
    if (persist) store('lang', next);
  }

  function setTheme(next, persist) {
    theme = next;
    root.setAttribute('data-theme', next);
    syncLabels();
    if (persist) store('theme', next);
  }

  function syncLabels() {
    qa('.js-theme').forEach(function (b) {
      b.setAttribute('aria-label', theme === 'dark' ? UI[lang].themeToLight : UI[lang].themeToDark);
    });
    var open = panel.classList.contains('open');
    toggle.setAttribute('aria-label', open ? UI[lang].closeMenu : UI[lang].openMenu);
  }

  qa('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang'), true); });
  });
  qa('.js-theme').forEach(function (b) {
    b.addEventListener('click', function () { setTheme(theme === 'dark' ? 'light' : 'dark', true); });
  });

  // Si el usuario no ha elegido tema, seguir el del sistema
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onScheme = function (e) { if (!load('theme')) setTheme(e.matches ? 'dark' : 'light', false); };
    if (mq.addEventListener) mq.addEventListener('change', onScheme);
    else if (mq.addListener) mq.addListener(onScheme);
  }

  /* ----------------------------- Navbar ----------------------------- */
  var brand = document.getElementById('brand');
  var scrolled = false;
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var s = y > 24;
      if (s === scrolled) return;
      scrolled = s;
      header.classList.toggle('is-scrolled', s);
      // La marca solo es accesible cuando se ve
      brand.setAttribute('tabindex', s ? '0' : '-1');
      brand.setAttribute('aria-hidden', s ? 'false' : 'true');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------- Menú móvil ----------------------------- */
  function setMenu(open) {
    panel.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navIcon.setAttribute('d', open ? 'M5 5l14 14M19 5L5 19' : 'M3 6h18M3 12h18M3 18h18');
    syncLabels();
  }
  toggle.addEventListener('click', function () { setMenu(!panel.classList.contains('open')); });
  qa('.panel-link', panel).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('click', function (e) {
    if (panel.classList.contains('open') && !header.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  window.addEventListener('resize', function () {
    if (window.innerWidth > 980 && panel.classList.contains('open')) setMenu(false);
  });

  /* ----------------------------- Carrusel de tecnologías ----------------------------- */
  // [nombre, clave del icono en icons.js, color]
  var TECH = [
    ['Windows', 'windows', '#0078D6'], ['Linux', 'linux', '#E5B800'], ['Ubuntu', 'ubuntu', '#E95420'],
    ['Debian', 'debian', '#D70A53'], ['macOS', 'apple', 'var(--ink)'], ['Proxmox', 'proxmox', '#E57000'],
    ['VirtualBox', 'virtualbox', '#3B6FB6'], ['Docker', 'docker', '#2496ED'], ['Active Directory', 'ad', '#0078D6'],
    ['Cisco', 'cisco', '#1BA0D7'], ['DNS', 'dns', '#2E9E4F'], ['DHCP', 'dhcp', '#14A38F'],
    ['Apache', 'apache', '#D22128'], ['Nginx', 'nginx', '#009639'], ['Samba', 'samba', '#2F7BD6'],
    ['VPN', 'vpn', '#7C5CE0'], ['Firewalls', 'firewall', '#E03A3A'], ['Kali Linux', 'kalilinux', '#557C94'],
    ['Metasploit', 'metasploit', '#2596CD'], ['Wireshark', 'wireshark', '#1679A7'], ['Nmap', 'nmap', '#4682B4'],
    ['Python', 'python', '#4B8BBE'], ['SQL', 'sql', '#4479A1'], ['MySQL', 'mysql', '#4479A1'],
    ['MariaDB', 'mariadb', '#1F9BB5'], ['PHP', 'php', '#777BB4'], ['Shell', 'gnubash', '#4EAA25'],
    ['PowerShell', 'powershell', '#5391FE'], ['JavaScript', 'javascript', '#F7DF1E'], ['HTML', 'html5', '#E34F26'],
    ['CSS', 'css', '#8A5CD6'], ['Vue', 'vue', '#4FC08D'], ['Git', 'git', '#F05133'], ['GitHub', 'github', 'var(--ink)'],
    ['Pandas', 'pandas', '#E70488'], ['NumPy', 'numpy', '#4D77CF'], ['Matplotlib', 'chart', '#3B8BC4'],
    ['Jupyter', 'jupyter', '#F37626'], ['Power BI', 'powerbi', '#F2C811'], ['Excel', 'excel', '#21A366'],
    ['Office', 'office', '#E8512A'], ['AWS', 'aws', '#FF9900'], ['APIs', 'api', '#8E8E93'], ['n8n', 'n8n', '#EA4B71'],
    ['Dify', 'dify', '#4D6BFF'], ['Figma', 'figma', '#F24E1E'], ['Canva', 'canva', '#00C4CC'],
    ['Machine Learning', 'ml', '#F7931E'], ['Big Data', 'apachespark', '#E25A1C']
  ];
  var NS = 'http://www.w3.org/2000/svg';

  function buildItem(t, dup) {
    var B = window.TECH_BRAND || {}, S = window.TECH_STROKE || {};
    var brand = t[1] in B;
    var item = document.createElement('div');
    item.className = 'mitem' + (dup ? ' mdup' : '');

    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '32');
    svg.setAttribute('height', '32');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', brand ? 'currentColor' : 'none');
    svg.setAttribute('stroke', brand ? 'none' : 'currentColor');
    svg.setAttribute('stroke-width', '1.5');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.style.color = t[2];

    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', brand ? B[t[1]] : (S[t[1]] || ''));
    svg.appendChild(p);
    if (B[t[1] + '2']) { // logos de dos colores (Python)
      var p2 = document.createElementNS(NS, 'path');
      p2.setAttribute('d', B[t[1] + '2']);
      p2.style.color = '#FFD43B';
      svg.appendChild(p2);
    }
    var label = document.createElement('span');
    label.textContent = t[0];
    item.appendChild(svg);
    item.appendChild(label);
    return item;
  }

  var track = document.getElementById('mtrack');
  if (track) {
    var frag = document.createDocumentFragment();
    TECH.forEach(function (t) { frag.appendChild(buildItem(t, false)); });
    TECH.forEach(function (t) { frag.appendChild(buildItem(t, true)); }); // copia para el bucle continuo
    track.appendChild(frag);
  }

  /* ----------------------------- Inicio ----------------------------- */
  setLang(lang, false);
  setTheme(theme, false);
})();
