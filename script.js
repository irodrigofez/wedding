/* ========= Config ========= */
const CFG = window.INVITACION_CONFIG || {
  evento: { titulo: "Boda", fechaISO: "2025-07-12T16:00:00", ubicacion: "Ciudad" },
  whatsapp: { numeroDestino: "5210000000000" }
};

/* ========= Parallax suave ========= */
(function parallaxHero(){
  const layer = document.querySelector('.hero-parallax');
  if(!layer) return;
  const update = () => {
    const y = window.scrollY || window.pageYOffset;
    // Mover un poco más lento que el scroll
    layer.style.transform = `translateY(${y * 0.25}px)`;
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
})();

/* ========= Intersection Observer (reveal) ========= */
(function revealOnScroll(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: .16 });
  els.forEach(el=>io.observe(el));
})();

/* ========= Música ========= */
(function musicControls(){
  const audio = document.getElementById('bg-music');
  const btn = document.getElementById('music-toggle');
  if(!audio || !btn) return;

  const setIcon = (playing) => {
    btn.innerHTML = playing ? '<i class="bi bi-pause-fill"></i>' : '<i class="bi bi-play-fill"></i>';
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  };

  btn.addEventListener('click', async ()=>{
    try{
      if(audio.paused){ await audio.play(); setIcon(true); }
      else { audio.pause(); setIcon(false); }
    }catch(e){ console.warn('Autoplay bloqueado:', e); }
  });

  // Sugerir reproducir tras la primera interacción (mejora de UX)
  document.addEventListener('click', function once(){
    document.removeEventListener('click', once);
    // no autoplays here; user already clicked somewhere on the page
  });
})();

/* ========= Countdown ========= */
(function countdown(){
  const box = document.getElementById('countdown');
  if(!box) return;
  const target = new Date(CFG.evento.fechaISO);

  const unit = (num, label) => `
    <div class="unit">
      <div class="number">${String(num).padStart(2, '0')}</div>
      <div class="label">${label}</div>
    </div>`;

  const tick = () => {
    const now = new Date();
    let diff = Math.max(0, target - now);

    const d = Math.floor(diff / (1000*60*60*24)); diff -= d*24*60*60*1000;
    const h = Math.floor(diff / (1000*60*60));    diff -= h*60*60*1000;
    const m = Math.floor(diff / (1000*60));       diff -= m*60*1000;
    const s = Math.floor(diff / 1000);

    box.innerHTML = unit(d,'días') + unit(h,'horas') + unit(m,'min') + unit(s,'seg');
  };
  tick();
  setInterval(tick, 1000);
})();

/* ========= RSVP por WhatsApp ========= */
(function rsvpWhatsApp(){
  const form = document.getElementById('rsvp-form');
  if(!form) return;

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const acomp  = document.getElementById('acompanantes').value.trim();
    const msg    = document.getElementById('mensaje').value.trim();

    if(!nombre){ alert('Por favor, escribe tu nombre.'); return; }

    const lines = [
      `*${CFG.evento.titulo}*`,
      `Asistencia confirmada ✅`,
      `Nombre: ${nombre}`,
      `Acompañantes: ${acomp || 0}`,
      msg ? `Mensaje: ${msg}` : null,
      `—`,
      `Evento: ${new Date(CFG.evento.fechaISO).toLocaleString()}`,
      `Lugar: ${CFG.evento.ubicacion}`
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const phone = CFG.whatsapp.numeroDestino.replace(/[^\d]/g,''); // sanitiza
    if(!phone){ alert('Configura el número de WhatsApp de destino.'); return; }

    const url = `https://wa.me/${phone}?text=${text}`;
    window.open(url, '_blank', 'noopener');
  });
})();

/* ========= Archivo .ics (descarga) ========= */
(function buildICS(){
  const a = document.getElementById('add-ics');
  if(!a) return;
  const title = CFG.evento.titulo || 'Evento';
  const start = new Date(CFG.evento.fechaISO);
  const end   = new Date(start.getTime() + 3*60*60*1000); // 3h por defecto

  const pad = (n)=> String(n).padStart(2,'0');
  const dt = (d)=> `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Invitación Boda//ES',
    'BEGIN:VEVENT',
    `UID:${crypto.randomUUID ? crypto.randomUUID() : Date.now()}@invitacion`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(start)}`,
    `DTEND:${dt(end)}`,
    `SUMMARY:${title}`,
    `LOCATION:${CFG.evento.ubicacion}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], {type:'text/calendar'});
  a.href = URL.createObjectURL(blob);
})();

/* ========= Accesibilidad: enfocar secciones desde navbar ========= */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){ target.setAttribute('tabindex','-1'); target.focus({preventScroll:true}); }
  });
});
