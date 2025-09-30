// ---- Typewriter: "Feliz cumpleaños, Ailu."
const typeText = "Feliz cumpleaños, Ailu.";
const typeTarget = document.getElementById('typeTarget');
let i = 0;
(function type(){
  typeTarget.textContent = typeText.slice(0, i++);
  if (i <= typeText.length) setTimeout(type, 45);
  else typeTarget.classList.remove('type');
})();

// ---- Cerrar modal de carta
const modal = document.getElementById('letterModal');
document.getElementById('closeLetter').addEventListener('click', ()=> modal.close());

// ---- Desbloqueo por contraseña (intentos ilimitados)
document.querySelectorAll('.mystery-card').forEach(card=>{
  const form = card.querySelector('.unlock-form');
  const input = form.querySelector('.pass');
  const feedback = form.querySelector('.feedback');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const passOk = (input.value || "").trim();
    const expected = card.getAttribute('data-pass');

    if(passOk === expected){
      feedback.textContent = "";
      input.value = "";
      handleUnlock(card);
    }else{
      feedback.textContent = "Contraseña incorrecta. Probá de nuevo 😉";
      input.focus();
      input.select?.();
    }
  });
});

function handleUnlock(card){
  const type = card.getAttribute('data-type');
  const targetSel = card.getAttribute('data-target');
  const targetEl = targetSel ? document.querySelector(targetSel) : null;

  if(type === 'letter'){
    modal.showModal();
  }else if(type === 'game' && targetEl){
    targetEl.classList.remove('hidden');
    if(!targetEl.dataset.ready){ setupGame(); targetEl.dataset.ready = "1"; }
    targetEl.scrollIntoView({behavior:'smooth', block:'start'});
  }else if(type === 'pics' && targetEl){
    targetEl.classList.remove('hidden');
    targetEl.scrollIntoView({behavior:'smooth', block:'start'});
  }
}

// ---- Juego: encuentra el corazón distinto
function setupGame(){
  const grid = document.getElementById('gameGrid');
  const msg = document.getElementById('gameMsg');
  grid.innerHTML = '';
  msg.textContent = '';

  const total = 24;
  const oddIndex = Math.floor(Math.random() * total);

  for(let i=0;i<total;i++){
    const b = document.createElement('button');
    b.setAttribute('aria-label', 'corazón');
    b.textContent = '♥';
    if(i === oddIndex) b.classList.add('odd');

    b.addEventListener('click', ()=>{
      if(i === oddIndex){
        msg.textContent = '¡Ganaste! Ahora volve conmigo po✨';
        confettiMini(b);
        setTimeout(setupGame, 2000);
      }else{
        b.style.opacity = '0.5';
      }
    });

    grid.appendChild(b);
  }
}

function confettiMini(anchor){
  const burst = document.createElement('div');
  burst.style.position = 'fixed';
  burst.style.pointerEvents = 'none';
  const rect = anchor.getBoundingClientRect();
  burst.style.left = (rect.left + rect.width/2) + 'px';
  burst.style.top  = (rect.top  + rect.height/2) + 'px';
  burst.style.transform = 'translate(-50%,-50%)';
  document.body.appendChild(burst);

  const bits = 14;
  for(let i=0;i<bits;i++){
    const s = document.createElement('span');
    s.textContent = ['✨','💖','🎉','⭐'][i%4];
    s.style.position = 'absolute';
    s.style.fontSize = (14 + Math.random()*10) + 'px';
    s.style.left = '0'; s.style.top = '0';
    s.style.transition = 'transform .8s ease, opacity .8s ease';
    burst.appendChild(s);
    requestAnimationFrame(()=>{
      const dx = (Math.random()*2-1)*120;
      const dy = (Math.random()*2-1)*120;
      s.style.transform = `translate(${dx}px, ${dy}px) rotate(${Math.random()*360}deg)`;
      s.style.opacity = '0';
    });
  }
  setTimeout(()=> burst.remove(), 900);
}
