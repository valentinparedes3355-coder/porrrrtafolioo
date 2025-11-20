document.addEventListener('DOMContentLoaded', ()=>{
  if(window.gsap){
    try{gsap.registerPlugin(ScrollTrigger);gsap.from('.hero-title',{y:40,opacity:0,duration:1.1,ease:'power3.out'});gsap.from('.hero-sub',{y:20,opacity:0,duration:0.9,delay:0.2});gsap.from('.projects-grid article',{y:30,opacity:0,duration:0.8,stagger:0.12,scrollTrigger:{trigger:'.projects-grid',start:'top 80%'}});gsap.from('.stats .num',{y:10,opacity:0,duration:0.8,stagger:0.15,scrollTrigger:{trigger:'.stats',start:'top 90%'}});}catch(e){console.warn(e)}
  }
  // Project preview handler: open native modal (no iframe)
  const attachPreview = (card) => {
    const overlay = document.getElementById('previewOverlay');
    const titleEl = document.getElementById('previewTitle');
    const descEl = document.getElementById('previewDesc');
    const mediaEl = document.getElementById('previewMedia');
    const openBtn = document.getElementById('previewOpen');
    const url = card.dataset.url || card.getAttribute('data-url') || '';
    if(!overlay || !titleEl || !descEl || !mediaEl || !openBtn){ console.warn('preview modal elements missing'); return; }

    // Fill title / desc from card or defaults
    const cardTitle = (card.querySelector('h3') && card.querySelector('h3').textContent.trim()) || 'Proyecto';
    const cardDesc = (card.querySelector('.muted') && card.querySelector('.muted').textContent.trim()) || 'Descripción no disponible.';
    titleEl.textContent = cardTitle;
    descEl.textContent = cardDesc;

    // Clear previous media
    mediaEl.innerHTML = '';

    if(url){
      openBtn.href = url;
      openBtn.style.display = 'inline-block';
      if(/\.(png|jpe?g|gif|webp|svg)$/i.test(url)){
        const img = document.createElement('img');
        img.src = url;
        img.alt = cardTitle;
        img.className = 'modal-proyecto-img';
        mediaEl.appendChild(img);
      } else {
        // Not an image: try to show the card thumbnail if present
        const thumbImg = card.querySelector('.thumb img');
        if(thumbImg){
          const img = thumbImg.cloneNode(true);
          img.className = 'modal-proyecto-img';
          mediaEl.appendChild(img);
        } else {
          // No thumbnail available: show a placeholder
          const placeholder = document.createElement('div');
          placeholder.className = 'modal-proyecto-img';
          placeholder.style.display = 'flex';
          placeholder.style.alignItems = 'center';
          placeholder.style.justifyContent = 'center';
          placeholder.style.background = '#f3f3f3';
          placeholder.style.color = '#111';
          placeholder.textContent = 'Vista previa no disponible';
          mediaEl.appendChild(placeholder);
        }
      }
    } else {
      openBtn.style.display = 'none';
      const placeholder = document.createElement('div');
      placeholder.className = 'modal-proyecto-img';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.background = '#f3f3f3';
      placeholder.style.color = '#111';
      placeholder.textContent = 'No hay vista previa disponible.';
      mediaEl.appendChild(placeholder);
    }

    overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false');
  };

  document.querySelectorAll('.project-card').forEach(card => {
    const btn = card.querySelector('.view-site');
    if(btn){
      console.log('DEBUG: binding view-site button for card', card, 'data-url=', card.dataset.url);
      btn.addEventListener('click', (ev) => { console.log('DEBUG: view-site clicked', card); ev.preventDefault(); attachPreview(card); });
    } else {
      // fallback: click on card opens preview
      // ignore clicks that come from interactive elements inside the card
      console.log('DEBUG: binding click on card fallback', card, 'data-url=', card.dataset.url);
      card.addEventListener('click', (ev) => {
        console.log('DEBUG: card clicked', ev.target);
        if(ev.target.closest('a') || ev.target.closest('button') || ev.target.closest('input') || ev.target.closest('textarea')) return;
        ev.preventDefault();
        attachPreview(card);
      });
    }
    }
  });

  // Cerrar modal de proyecto cerámica
  document.querySelectorAll('.close-project-modal').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const modal = btn.closest('.overlay');
      if(modal){
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden','true');
      }
    });
  });
  const close = document.getElementById('closePreview'); if(close){ close.addEventListener('click', ()=>{ const overlay = document.getElementById('previewOverlay'); const titleEl = document.getElementById('previewTitle'); const descEl = document.getElementById('previewDesc'); const mediaEl = document.getElementById('previewMedia'); const openBtn = document.getElementById('previewOpen'); if(mediaEl) mediaEl.innerHTML = ''; if(titleEl) titleEl.textContent = ''; if(descEl) descEl.textContent = ''; if(openBtn) openBtn.href = '#'; overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); }); }
  const form = document.getElementById('contactForm');
  if(form){
    const action = (form.getAttribute('action')||'').trim();
    // only attach real network submit if action is provided and not '#'
    if(action && action !== '#'){
      form.addEventListener('submit', async (e)=>{ e.preventDefault(); const data = new FormData(form); const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando...'; try{ const res = await fetch(form.action,{method:'POST',body:data}); const json = await res.json(); if(json.status==='ok'){ document.getElementById('formSuccess').classList.remove('hidden'); form.reset(); } else { alert('Error: '+(json.message||'error')) } }catch(err){ alert('Error al enviar. Intentá de nuevo.'); }finally{btn.disabled=false;btn.textContent='Enviar'} });
    }
  }

  // Tecnologías - modal
  const techCards = document.querySelectorAll('.tech-card');
  const techModal = document.getElementById('techModal');
  const techTitle = document.getElementById('techTitle');
  const techDesc = document.getElementById('techDesc');
  const closeTech = document.getElementById('closeTechModal');
  techCards.forEach(card=>{ card.addEventListener('click', ()=>{
    const name = card.dataset.tech || card.textContent;
    const desc = card.dataset.desc || '';
    if(!techModal) return;
    techTitle.textContent = name;
    techDesc.textContent = desc;
    techModal.classList.remove('hidden');
    techModal.setAttribute('aria-hidden','false');
  })});
  if(closeTech){ closeTech.addEventListener('click', ()=>{ if(!techModal) return; techModal.classList.add('hidden'); techModal.setAttribute('aria-hidden','true'); }); }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          const ans = openItem.querySelector('.faq-answer');
          if(ans) ans.classList.add('hidden');
        }
      });
      // Toggle current
      answer.classList.toggle('hidden', isOpen);
      item.classList.toggle('open', !isOpen);
    });
  });

  // Improve contact form handling: if action is '#' or empty, simulate success
  // handle preselecting package from URL/hash and from price buttons
  const packageInput = document.getElementById('packageInput');
  const serviceSelect = form ? form.querySelector('select[name="service"]') : null;

  function getPackageFromLocation(){
    // check search (?package=) first
    const search = window.location.search;
    if(search){ const params = new URLSearchParams(search); if(params.get('package')) return params.get('package'); }
    // check hash (e.g. #quoteForm?package=Starter)
    const hash = window.location.hash || '';
    const idx = hash.indexOf('package=');
    if(idx>-1){ return decodeURIComponent(hash.slice(idx+8)); }
    return null;
  }

  function applyPackage(pkg){
    if(!pkg) return;
    if(packageInput) packageInput.value = pkg;
    if(serviceSelect){
      // try match option
      const opt = Array.from(serviceSelect.options).find(o=>o.text.toLowerCase().includes(pkg.toLowerCase()));
      if(opt) opt.selected = true;
    }
  }

  // if landing with package param, apply and scroll to form
  const initialPkg = getPackageFromLocation();
  if(initialPkg){ applyPackage(initialPkg); const formEl = document.getElementById('quoteForm'); if(formEl){ setTimeout(()=>{ formEl.scrollIntoView({behavior:'smooth'}); },100); } }

  // Background video: keep fixed while user scrolls; hide it once the projects section is reached
  const bgVideo = document.getElementById('bgVideo');
  // prefer .projects (services page) or .projects-preview (homepage)
  const projectsEl = document.querySelector('.projects') || document.querySelector('.projects-preview');
  // Keep the background video visible and playing at all times (do not hide or pause it).
  function updateBgVideoVisibility(){
    if(!bgVideo) return;
    if(bgVideo.classList.contains('hidden')) bgVideo.classList.remove('hidden');
    try{ if(bgVideo.paused) bgVideo.play(); }catch(e){}
  }
  // ensure video is playing on load
  updateBgVideoVisibility();

  // WhatsApp floating animation (GSAP if available, otherwise CSS fallback)
  const waBtn = document.getElementById('whatsapp-btn');
  if(waBtn){
    if(window.gsap){
      try{ gsap.to(waBtn, { y: -12, repeat: -1, yoyo: true, ease: 'sine.inOut', duration: 1.2 }); }catch(e){ console.warn('GSAP WhatsApp anim error', e); }
    } else {
      waBtn.classList.add('whatsapp-float');
    }
  }

  // price buttons set package and scroll to form (handles same-page clicks)
  document.querySelectorAll('[data-package]').forEach(btn=>{ btn.addEventListener('click', (e)=>{ const pkg = btn.dataset.package || btn.getAttribute('data-package'); if(!pkg) return; applyPackage(pkg); const formEl = document.getElementById('quoteForm'); if(formEl){ formEl.scrollIntoView({behavior:'smooth'}); }
      // if the btn is a link that would navigate, allow navigation (it includes URL with params)
      // prevent default only for same-page anchor patterns
      if(btn.tagName.toLowerCase() === 'a'){
        const href = btn.getAttribute('href')||'';
        if(href.startsWith('#') || href.indexOf(window.location.pathname)!==-1){ e.preventDefault(); window.location.hash = href.split('#')[1] || ''; }
      }
    }); });

  if(form){ const action = (form.getAttribute('action')||'').trim(); if(!action || action==='#'){ form.addEventListener('submit', (ev)=>{ ev.preventDefault(); const btn = form.querySelector('button[type=submit]'); btn.disabled = true; btn.textContent = 'Enviando...'; setTimeout(()=>{ document.getElementById('formSuccess').classList.remove('hidden'); form.reset(); if(packageInput) packageInput.value = ''; btn.disabled = false; btn.textContent = 'Solicitar cotización'; },900); }); } }

  // Ensure project cards have readable title/description and re-enable interactive controls
  document.querySelectorAll('.project-card').forEach(card => {
    try{
      // Title
      const existingTitle = card.querySelector('h3');
      if(!existingTitle || !existingTitle.textContent.trim()){
        const h = existingTitle || document.createElement('h3');
        h.textContent = (existingTitle && existingTitle.textContent.trim()) || 'Proyecto';
        if(!existingTitle) card.insertBefore(h, card.firstChild);
      }
      // Description (muted)
      const existingDesc = card.querySelector('.muted');
      if(!existingDesc || !existingDesc.textContent.trim()){
        const p = existingDesc || document.createElement('p');
        p.className = 'muted';
        p.textContent = (existingDesc && existingDesc.textContent.trim()) || 'Descripción no disponible.';
        if(!existingDesc){
          const titleEl = card.querySelector('h3');
          if(titleEl) titleEl.insertAdjacentElement('afterend', p);
          else card.appendChild(p);
        } else {
          existingDesc.textContent = p.textContent;
        }
      }
      // Re-enable interactive elements inside the card
      card.querySelectorAll('button, a, input, textarea').forEach(el => {
        if(el.disabled) el.disabled = false;
        // If anchor has no meaningful href, try to set a safe one
        if(el.tagName && el.tagName.toLowerCase() === 'a'){
          const href = el.getAttribute('href') || '';
          if(!href || href === '#'){
            if(card.dataset.url){ el.setAttribute('href', card.dataset.url); el.setAttribute('target', '_blank'); }
            else if(el.dataset.package){ el.setAttribute('href', '#quoteForm'); }
          }
        }
      });
    }catch(e){ console.warn('Error sanitizing project card', e); }
  });

});

// Botón de WhatsApp con movimiento suave
const whatsappBtn = document.getElementById('whatsapp-btn');
if (whatsappBtn) {
  let angle = 0;
  function floatButton() {
    angle += 0.04;
    whatsappBtn.style.transform = `translateY(${Math.sin(angle) * 6}px)`;
    requestAnimationFrame(floatButton);
  }
  floatButton();
}

// ====== MODALES SERVICIOS ======
document.querySelectorAll(".ver-mas").forEach(btn => {
  btn.addEventListener("click", () => {
    const modal = document.getElementById(btn.dataset.target);
    modal.style.display = "flex";
  });
});

document.querySelectorAll(".close").forEach(cerrar => {
  cerrar.addEventListener("click", () => {
    cerrar.closest(".modal").style.display = "none";
  });
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// Safety diagnostic: detect fullscreen elements that may be intercepting clicks
(function safetyFix(){
  setTimeout(()=>{
    try{
      const winW = window.innerWidth;
      const winH = window.innerHeight;
      document.querySelectorAll('body *').forEach(el=>{
        try{
          const cs = getComputedStyle(el);
          if((cs.position === 'fixed' || cs.position === 'absolute')){
            const rect = el.getBoundingClientRect();
            if(rect.top <= 0 && rect.left <= 0 && rect.width >= winW && rect.height >= winH){
              // ignore the WhatsApp FAB and known overlays that should intercept
              const id = el.id || '';
              if(id === 'whatsapp-btn') return;
              // If element is a modal overlay but hidden, ensure it doesn't intercept
              if(el.classList.contains('overlay')){
                if(el.classList.contains('hidden')){
                  el.style.pointerEvents = 'none';
                }
              } else {
                // For unexpected full-screen elements, disable pointer-events so clicks pass through
                console.warn('Safety: disabling pointer-events on full-screen element to restore interactivity', el);
                el.style.pointerEvents = 'none';
              }
            }
          }
        }catch(e){}
      });
      // Ensure interactive controls are clickable
      document.querySelectorAll('button, a, input, textarea').forEach(el=>{ el.style.pointerEvents = 'auto'; });
    }catch(e){ console.warn('SafetyFix error', e); }
  }, 200);
})();
