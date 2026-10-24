// Interactions décoratives : elles respectent le mouvement réduit et le tactile.
(function(){
 document.querySelectorAll('.project-art,.perspective-console').forEach(el=>{const film=document.createElement('span');film.className='holo-film';film.setAttribute('aria-hidden','true');el.append(film);});
 const root=document.documentElement,reduce=()=>document.body.classList.contains('reduced'),fine=matchMedia('(pointer:fine)').matches;
 document.addEventListener('click',e=>{
  const button=e.target.closest?.('button');if(!button||reduce()||button.id==='robot-interact')return;
  const r=button.getBoundingClientRect(),size=Math.min(180,Math.max(r.width,r.height)*1.2),ripple=document.createElement('span');ripple.className='click-ripple';ripple.setAttribute('aria-hidden','true');
  const x=e.detail===0?r.width/2:e.clientX-r.left,y=e.detail===0?r.height/2:e.clientY-r.top;
  Object.assign(ripple.style,{left:x-size/2+'px',top:y-size/2+'px',width:size+'px',height:size+'px'});button.append(ripple);ripple.addEventListener('animationend',()=>ripple.remove(),{once:true});setTimeout(()=>ripple.remove(),800);
 });
 document.querySelectorAll('#perspective-tabs,.mode-switch').forEach(el=>el.addEventListener('click',()=>{if(reduce())return;const diagram=document.querySelector('.blueprint');diagram.classList.remove('diagram-pulse');void diagram.offsetWidth;diagram.classList.add('diagram-pulse');}));
 if(!fine)return;let x=50,y=40,pending=false;
 addEventListener('pointermove',e=>{if(reduce())return;x=e.clientX/innerWidth*100;y=e.clientY/innerHeight*100;if(!pending){pending=true;requestAnimationFrame(()=>{root.style.setProperty('--pointer-x',x+'%');root.style.setProperty('--pointer-y',y+'%');pending=false;})}},{passive:true});
 // Traînée d'étoiles limitée à l'accueil et à 10 éléments simultanés.
 const hero=document.querySelector('#home');let lastSpark=0,sparks=0;
 hero.addEventListener('pointermove',e=>{
  if(reduce()||performance.now()-lastSpark<100||sparks>=10)return;lastSpark=performance.now();sparks++;
  const star=document.createElement('span');star.className='pointer-star';star.setAttribute('aria-hidden','true');star.textContent='✦';star.style.left=e.clientX+'px';star.style.top=e.clientY+'px';document.body.append(star);
  setTimeout(()=>{star.remove();sparks--},700);
 });
 document.querySelectorAll('.project').forEach(card=>{
  const art=card.querySelector('.project-art');let raf=0,last;
  function reset(){cancelAnimationFrame(raf);raf=0;for(const k of ['--tilt-x','--tilt-y','--shine-x','--shine-y'])art.style.removeProperty(k);}
  card.addEventListener('pointermove',e=>{if(reduce())return;last={x:e.clientX,y:e.clientY};if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=art.getBoundingClientRect(),x=(last.x-r.left)/r.width-.5,y=(last.y-r.top)/r.height-.5;art.style.setProperty('--tilt-x',(-y*4)+'deg');art.style.setProperty('--tilt-y',(x*4)+'deg');art.style.setProperty('--shine-x',((x+.5)*100)+'%');art.style.setProperty('--shine-y',((y+.5)*100)+'%');window.dispatchEvent(new CustomEvent('projectinspect',{detail:{target:'[data-project="'+card.dataset.project+'"] .project-meta'}}));})});
  card.addEventListener('pointerleave',reset);addEventListener('motionchange',reset);
 });
 document.querySelectorAll('.cta,.mode-switch button').forEach(button=>{
  button.classList.add('magnetic');let raf=0,last;
  const reset=()=>{cancelAnimationFrame(raf);raf=0;button.style.removeProperty('translate')};
  button.addEventListener('pointermove',e=>{if(reduce())return;last=e;if(!raf)raf=requestAnimationFrame(()=>{raf=0;const r=button.getBoundingClientRect();const x=Math.max(-5,Math.min(5,(last.clientX-r.left-r.width/2)*.07)),y=Math.max(-3,Math.min(3,(last.clientY-r.top-r.height/2)*.07));button.style.translate=x+'px '+y+'px';});});button.addEventListener('pointerleave',reset);button.addEventListener('blur',reset);addEventListener('motionchange',reset);
 });
 const diagram=document.querySelector('.blueprint');if(diagram){diagram.addEventListener('pointermove',e=>{if(reduce())return;const r=diagram.getBoundingClientRect();diagram.style.setProperty('--diagram-x',((e.clientX-r.left)/r.width-.5)*10+'px');diagram.style.setProperty('--diagram-y',((e.clientY-r.top)/r.height-.5)*10+'px');});diagram.addEventListener('pointerleave',()=>{diagram.style.setProperty('--diagram-x','0px');diagram.style.setProperty('--diagram-y','0px');});}
})();
