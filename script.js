const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const d = DATA;
document.documentElement.classList.add('js');

document.title = `${d.name} | ${d.role}`;

$('status').textContent = d.status;
$('heroName').textContent = d.name;
$('roleLine').textContent = d.role;
$('lead').textContent = d.lead;
$('aboutText').innerHTML = d.about.map(p => `<p>${esc(p)}</p>`).join('');
$('skillGrid').innerHTML = Object.entries(d.skills).map(([g, list]) =>
  `<div class="skill"><h3>${esc(g)}</h3><ul>${list.map(s => `<li>${esc(s)}</li>`).join('')}</ul></div>`).join('');
const proof = (f, label) => f ? `<a class="proof" href="${esc(f)}" target="_blank" rel="noopener">${label}</a>` : '';
$('expGrid').innerHTML = d.experience.map(e => `
  <article class="card exp">
    <div class="exp-head"><h3>${esc(e.role)}</h3><span>${esc(e.period)}</span></div>
    <p class="org">${esc(e.org)}</p>
    <ul>${e.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul>
    ${proof(e.file, 'View internship certificate')}
  </article>`).join('');
$('projGrid').innerHTML = d.projects.map(p => `
  <article class="card proj${p.featured ? ' featured' : ''}">
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.desc)}</p>
    <p class="impact">${esc(p.impact)}</p>
    <ul class="tags">${p.tech.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <div class="links">
      <a href="${esc(p.github)}" target="_blank" rel="noopener">GitHub repository</a>
      ${p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener">Live demo</a>` : ''}
    </div>
  </article>`).join('');
$('achList').innerHTML = d.achievements.map(a =>
  `<li><time>${esc(a.when)}</time><div><h3>${esc(a.title)}</h3><p>${esc(a.text)}</p>${proof(a.file, 'View certificate')}</div></li>`).join('');
$('certGrid').innerHTML = d.certifications.map(c => `
  <article class="card cert">
    <h3>${esc(c.title)}</h3><p>${esc(c.issuer)}${c.year ? ', ' + esc(c.year) : ''}</p>
    ${proof(c.file, 'View certificate')}
  </article>`).join('');
$('contactText').textContent = d.contact.text;
$('contactLinks').innerHTML = `
  <a class="btn" href="mailto:${esc(d.contact.email)}">${esc(d.contact.email)}</a>
  <a class="btn ghost" href="${esc(d.contact.github)}" target="_blank" rel="noopener">GitHub</a>
  <a class="btn ghost" href="${esc(d.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>`;


/* Page background: transparent curved lines that run the full width and scroll with the content.
   One tall tile (two mirrored sections) repeats down the page, fading softly at its seams. */
const pt = (x, y) => `${x} ${y.toFixed(1)}`;
const famA = t => [pt(-80, 860 - t * 130), pt(380, 900 - t * 860), pt(1060, -120 + t * 980), pt(1520, 60 + t * 260)];
const famB = t => [pt(-80, 60 + t * 120), pt(420, -140 + t * 560), pt(980, 1040 - t * 640), pt(1520, 840 - t * 160)];
const ribbon = (fam, n, k) => Array.from({ length: n }, (_, i) => {
  const t = i / (n - 1), p = fam(t), o = ((.2 + .7 * Math.sin(Math.PI * t) ** .6) * k).toFixed(2);
  return `<path d="M${p[0]} C${p[1]},${p[2]},${p[3]}" stroke-opacity="${o}"/>`;
}).join('');
const section = tr => `<g transform="${tr}"><g mask="url(#vm)"><circle cx="1050" cy="350" r="520" fill="url(#gl)"/><g fill="none" stroke="url(#rg)" stroke-width="1">${ribbon(famB, 14, .26)}${ribbon(famA, 24, .42)}</g></g></g>`;
const TILE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 1800"><defs>
<linearGradient id="rg" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1440" y2="0"><stop offset="0" stop-color="#7DA0E6" stop-opacity="0"/><stop offset=".12" stop-color="#7DA0E6"/><stop offset=".88" stop-color="#7DA0E6"/><stop offset="1" stop-color="#7DA0E6" stop-opacity="0"/></linearGradient>
<radialGradient id="gl"><stop offset="0" stop-color="#1E3F8F" stop-opacity=".3"/><stop offset="1" stop-color="#1E3F8F" stop-opacity="0"/></radialGradient>
<linearGradient id="vf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".1" stop-color="#fff"/><stop offset=".9" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="vm" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900"><rect width="1440" height="900" fill="url(#vf)"/></mask></defs>
${section('')}${section('translate(1440 900) scale(-1 1)')}</svg>`;
$('bg').style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(TILE)}")`;

/* Optional photo on the right of the hero (set data.photo) */
const vis = $('visual');
if (d.photo) vis.innerHTML = `<img class="photo" src="${esc(d.photo)}" alt="Portrait of ${esc(d.name)}">`;
else { vis.hidden = true; vis.parentElement.classList.add('no-photo'); }

const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Scroll reveal with a gentle stagger */
const targets = document.querySelectorAll('section.wrap:not(.hero) h2, .about > *, .skill, .card, .timeline li, .contact p, .contact .actions');
if (calm || !('IntersectionObserver' in window)) { /* leave everything visible */ } else {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; io.unobserve(el);
    el.classList.add('in');
    setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.transitionDelay = ''; }, 1500);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(el => {
    const i = [...el.parentElement.children].indexOf(el);
    el.classList.add('reveal'); el.style.transitionDelay = `${Math.min(i, 5) * 90}ms`;
    io.observe(el);
  });
}

/* Cursor glow on cards */
document.addEventListener('pointermove', e => {
  const c = e.target.closest && e.target.closest('.card, .skill');
  if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', `${e.clientX - r.left}px`);
  c.style.setProperty('--my', `${e.clientY - r.top}px`);
});

/* Scroll progress bar and active nav link */
const bar = $('progress');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    ticking = false;
  });
}, { passive: true });
const links = [...document.querySelectorAll('.nav nav a')];
const spy = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
}), { rootMargin: '-45% 0px -50% 0px' });
links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) spy.observe(s); });
