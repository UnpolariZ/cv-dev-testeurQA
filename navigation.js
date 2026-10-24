export function layoutTop(el){let y=0;for(let n=el;n;n=n.offsetParent)y+=n.offsetTop||0;return y;}
export function buildStops(sections,viewport,max,header=96){
 const points=[],space=viewport-header-32;
 const add=(y,id)=>{y=Math.max(0,Math.min(max,y));if(!points.length||y>points.at(-1).y+12)points.push({y,id});};
 for(const s of sections){const start=Math.max(0,s.top-header);add(s.id==='contact'&&s.height<=space+64?max:start,s.id);
  if(s.id==='contact'&&s.height<=space+64)continue;
  if(s.anchors?.length){for(const a of s.anchors){if(a.height<=space)add(a.top+a.height/2-(header+(viewport-header)/2),s.id);else{const begin=a.top-header-12,end=a.top+a.height-viewport+12;add(begin,s.id);const n=Math.ceil((end-begin)/space);for(let i=1;i<=n;i++)add(begin+(end-begin)*i/n,s.id);}}}
  else{const end=Math.min(max,s.top+s.height-viewport+24),n=end-start>130?Math.ceil((end-start)/space):0;for(let i=1;i<=n;i++)add(start+(end-start)*i/n,s.id);}
 }return points;
}
export function installNavigation(){
 const root=document.documentElement,sections=[...document.querySelectorAll('main>section[id]')];let frame=0,busy=false,dir=0,lastWheel=-Infinity,lastIntent=-Infinity,lastSign=0,amount=0;
 const reduced=()=>document.body.classList.contains('reduced');
 function positions(){return buildStops(sections.map(el=>({id:el.id,top:layoutTop(el),height:el.offsetHeight,anchors:el.id==='work'?[...el.querySelectorAll('.project')].map(c=>({top:layoutTop(c),height:c.offsetHeight})):null})),innerHeight,Math.max(0,root.scrollHeight-innerHeight),innerWidth<800?80:96);}
 function cancel(){cancelAnimationFrame(frame);frame=0;busy=false;window.dispatchEvent(new CustomEvent('chaptertravel',{detail:{progress:1,active:false}}));}
 function go(target){if(!target)return;cancel();const from=scrollY,distance=target.y-from;if(Math.abs(distance)<3)return;if(reduced()){window.scrollTo({top:target.y,behavior:'instant'});return;}busy=true;dir=Math.sign(distance);const start=performance.now(),duration=Math.min(1000,560+Math.sqrt(Math.abs(distance))*8);
  function tick(now){const p=Math.min(1,(now-start)/duration),v=p*p*p*(p*(p*6-15)+10);window.scrollTo({top:from+distance*v,behavior:'instant'});window.dispatchEvent(new CustomEvent('chaptertravel',{detail:{progress:p,active:p<1,direction:dir,target:target.id,crossSection:true}}));if(p<1)frame=requestAnimationFrame(tick);else busy=false;}frame=requestAnimationFrame(tick);
 }
 function move(sign){const p=positions();go(sign>0?(p.find(s=>s.y>scrollY+18)||p.at(-1)):([...p].reverse().find(s=>s.y<scrollY-18)||p[0]));}
 function internal(target,sign){for(let n=target;n&&n!==document.body;n=n.parentElement){if(/auto|scroll/.test(getComputedStyle(n).overflowY)&&n.scrollHeight>n.clientHeight+2&&(sign>0?n.scrollTop+n.clientHeight<n.scrollHeight-2:n.scrollTop>2))return true;}return false;}
 addEventListener('wheel',e=>{const sign=Math.sign(e.deltaY);if(!sign||e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.target.closest?.('input,textarea,select,[contenteditable],dialog[open]')||internal(e.target,sign))return;
  e.preventDefault();const now=performance.now(),fresh=now-lastWheel>170,reverse=lastSign&&lastSign!==sign;lastWheel=now;if(fresh||reverse)amount=0;amount+=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?innerHeight:1);if(Math.abs(amount)<28)return;
  if(busy&&!reverse)return;if(!fresh&&!reverse&&now-lastIntent<950)return;if(!fresh&&!reverse&&Math.abs(e.deltaY)<20)return;
  lastIntent=now;lastSign=sign;amount=0;move(sign);
 },{passive:false});
 addEventListener('keydown',e=>{if(e.key==='Escape'){cancel();return;}if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest?.('input,textarea,select,[contenteditable],dialog[open]'))return;if(e.target.closest?.('button,a')&&e.key===' ')return;const sign=['ArrowDown','PageDown',' '].includes(e.key)?(e.shiftKey?-1:1):['ArrowUp','PageUp'].includes(e.key)?-1:0;if(sign){e.preventDefault();if(!busy&&!e.repeat)move(sign);}});
 addEventListener('touchstart',cancel,{passive:true});addEventListener('pointerdown',e=>{if(e.clientX>=root.clientWidth)cancel();},{passive:true});
 document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const target=positions().find(p=>p.id===a.getAttribute('href').slice(1));if(!target)return;e.preventDefault();go(target);history.replaceState(null,'','#'+target.id);}));
 document.querySelector('#chapter-prev').onclick=()=>move(-1);document.querySelector('#chapter-next').onclick=()=>move(1);
 function buttons(){document.querySelector('#chapter-prev').disabled=scrollY<5;document.querySelector('#chapter-next').disabled=scrollY>=root.scrollHeight-innerHeight-5;}addEventListener('scroll',buttons,{passive:true});buttons();addEventListener('motionchange',cancel);addEventListener('resize',cancel);return {move,cancel,positions};
}
if(typeof document!=='undefined')installNavigation();
