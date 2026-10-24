(function(){
 const reduced=()=>document.body.classList.contains('reduced'),records=[];let heroTimeline;
 function labelOf(el){const clone=el.cloneNode(true);clone.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));return clone.textContent.replace(/\s+/g,' ').trim();}
 function prepare(el){
  const label=labelOf(el),letters=[];el.setAttribute('aria-label',label);el.classList.add('type-heading');
  function visit(parent){for(const node of [...parent.childNodes]){if(node.nodeType===3){const fragment=document.createDocumentFragment();for(const part of node.textContent.split(/(\s+)/)){if(!part)continue;if(/^\s+$/.test(part)){fragment.append(document.createTextNode(part));continue;}const word=document.createElement('span');word.className='type-word';word.setAttribute('aria-hidden','true');for(const char of Array.from(part)){const span=document.createElement('span');span.className='type-char';span.textContent=char;word.append(span);letters.push(span);}fragment.append(word);}node.replaceWith(fragment);}else if(node.nodeType===1&&node.tagName!=='BR')visit(node);}}
  visit(el);const record={el,letters,timer:0,visible:false};records.push(record);return record;
 }
 function reveal(r){clearTimeout(r.timer);r.el.classList.remove('is-typing');r.letters.forEach(c=>{c.style.opacity='1';c.classList.remove('type-caret')});}
 function reset(r){clearTimeout(r.timer);r.el.classList.remove('is-typing');r.letters.forEach(c=>{c.style.opacity='0';c.classList.remove('type-caret')});}
 function type(r){if(!r)return;reset(r);if(reduced()){reveal(r);return;}r.el.classList.add('is-typing');let i=0;
  function tick(){if(reduced()){reveal(r);return;}if(i===r.letters.length){r.el.classList.remove('is-typing');return;}if(i>0)r.letters[i-1].classList.remove('type-caret');const c=r.letters[i++];c.style.opacity='1';c.classList.add('type-caret');r.timer=setTimeout(tick,/[,.:!?]/.test(c.textContent)?180:65);}tick();
 }
 // Uniquement les grands titres statiques : les intitulés dynamiques restent lisibles.
 const headings=[...document.querySelectorAll('main section h2')];
 if(typeof IntersectionObserver!=='undefined'){
  const observer=new IntersectionObserver(entries=>{for(const e of entries){
   const r=records.find(r=>r.el===e.target);if(!r)continue;
   if(e.isIntersecting&&e.intersectionRatio>=.1&&!r.visible){r.visible=true;type(r);}
   else if(!e.isIntersecting||e.intersectionRatio===0){r.visible=false;if(reduced())reveal(r);else reset(r);}
  }},{rootMargin:'0px',threshold:[0,.1]});
  headings.forEach(el=>{const record=prepare(el);if(reduced())reveal(record);try{observer.observe(record.el);}catch{reveal(record);}});
 }
 // CRÉER : assemblage des lettres ; ÉPROUVER : balayage du contour ;
 // Améliorer : révélation de la ligne italique comme une signature.
 const hero=document.querySelector('.hero h1'),lines=[...hero.querySelectorAll('.line')];
 if(window.gsap){
  const label=labelOf(hero);hero.setAttribute('aria-label',label);lines.forEach(l=>l.setAttribute('aria-hidden','true'));
  const first=lines[0],text=first.textContent;first.textContent='';for(const char of Array.from(text)){const span=document.createElement('span');span.className='hero-glyph';span.textContent=char;first.append(span);}
  heroTimeline=gsap.timeline({paused:true,onStart:()=>hero.classList.add('hero-writing'),onComplete:()=>hero.classList.remove('hero-writing')});
  heroTimeline.from(first.children,{yPercent:105,rotationX:65,opacity:0,stagger:.065,duration:.85,ease:'power3.out',clearProps:'all'},.1)
   .fromTo(lines[1],{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 -2% 0 0)',duration:1.05,ease:'power2.inOut',clearProps:'clipPath'},.6)
   .fromTo(lines[2],{clipPath:'polygon(0 0,0 0,0 100%,0 100%)',y:10,opacity:.5},{clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)',y:0,opacity:1,duration:1.2,ease:'power2.inOut',clearProps:'all'},1.2);
  if(reduced())heroTimeline.progress(1);
  if(typeof IntersectionObserver!=='undefined'){
   let visible=false;
   const heroObserver=new IntersectionObserver(entries=>{for(const e of entries){
    if(e.isIntersecting&&e.intersectionRatio>=.1&&!visible){visible=true;if(reduced())heroTimeline.progress(1);else{hero.classList.remove('hero-writing');void hero.offsetWidth;hero.classList.add('hero-writing');heroTimeline.restart();}}
    else if(!e.isIntersecting||e.intersectionRatio===0){visible=false;heroTimeline.pause();hero.classList.remove('hero-writing');}
   }},{threshold:[0,.1]});heroObserver.observe(hero);
  }else if(!reduced())heroTimeline.play();
 }
 addEventListener('motionchange',()=>{if(!reduced())return;records.forEach(reveal);if(heroTimeline){heroTimeline.progress(1).pause();}hero.classList.remove('hero-writing');});
 addEventListener('beforeprint',()=>{records.forEach(reveal);if(heroTimeline)heroTimeline.progress(1).pause();hero.classList.remove('hero-writing');});
})();
