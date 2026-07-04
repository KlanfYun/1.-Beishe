/* =================================================================
   EMMA & LUCAS — INVITACIÓN DE BODA
   Lógica: cuenta atrás, animaciones de scroll, hilo dorado, navegación
   ================================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     1. CUENTA ATRÁS
     ✏️ EDITAR: cambia la fecha/hora exacta de la boda aquí.
     Formato: 'AAAA-MM-DDTHH:MM:SS' (hora local del evento)
     --------------------------------------------------------------- */
  const WEDDING_DATE = new Date('2026-06-22T15:30:00');

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    min: document.getElementById('cd-min'),
    sec: document.getElementById('cd-sec'),
  };

  function pad(n){ return String(n).padStart(2, '0'); }

  function updateCountdown(){
    const now = new Date();
    let diff = WEDDING_DATE - now;
    if (diff < 0) diff = 0;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const min = Math.floor((diff / (1000 * 60)) % 60);
    const sec = Math.floor((diff / 1000) % 60);

    setUnit(els.days, pad(days));
    setUnit(els.hours, pad(hours));
    setUnit(els.min, pad(min));
    setUnit(els.sec, pad(sec));
  }

  function setUnit(el, value){
    if (!el) return;
    if (el.textContent !== value){
      el.textContent = value;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);


  /* ---------------------------------------------------------------
     2. SCROLL REVEAL
     Anima cualquier elemento con [data-reveal] al entrar en pantalla,
     y marca la sección padre como .is-inview.
     --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const sectionEls = document.querySelectorAll('.section');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      entry.target.classList.toggle('is-inview', entry.isIntersecting);
    });
  }, { threshold: 0.35 });

  sectionEls.forEach(el => sectionObserver.observe(el));


  /* ---------------------------------------------------------------
     3. HILO DORADO — se dibuja según el progreso total del scroll
     --------------------------------------------------------------- */
  const threadPath = document.getElementById('threadPath');

  function updateThread(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    const length = 1000;
    const offset = length - (length * Math.min(Math.max(progress, 0), 1));
    if (threadPath) threadPath.style.strokeDashoffset = offset;
  }

  window.addEventListener('scroll', updateThread, { passive: true });
  updateThread();


  /* ---------------------------------------------------------------
     4. NAVEGACIÓN DE PUNTOS — resalta la sección activa
     --------------------------------------------------------------- */
  const navDots = document.querySelectorAll('.dots a');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const dot = document.querySelector(`.dots a[href="#${id}"]`);
      if (!dot) return;
      if (entry.isIntersecting){
        navDots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sectionEls.forEach(el => navObserver.observe(el));

});
