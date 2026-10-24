import * as THREE from './vendor/three.module.min.js';
import {createAvatar} from './avatar.js';
import {CHAPTERS,poseFor,selectChapter} from './choreography.js';
import {sampleMotion} from './motion.js';
import {sampleTransition} from './transition.js';
import {bookHinge,readingGaze} from './reading.js';
import {welcomeSequence} from './welcome.js';
const canvas=document.querySelector('#universe');let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{document.body.classList.add('no-webgl');document.querySelector('#robot-interact').hidden=true;}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0x101312,0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 let lightTheme=document.documentElement.dataset.theme==='light';
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,70);camera.position.z=11;
 scene.add(new THREE.HemisphereLight(0xd3e8e0,0x263b24,2.6));const key=new THREE.DirectionalLight(0xffffff,4);key.position.set(2,4,5);scene.add(key);const rim=new THREE.DirectionalLight(0xa5c2ff,3);rim.position.set(-4,1,-2);scene.add(rim);
 const applySceneTheme=()=>{lightTheme=document.documentElement.dataset.theme==='light';renderer.toneMappingExposure=lightTheme?.85:1.2;key.intensity=lightTheme?2.4:4;rim.intensity=lightTheme?1.5:3;};applySceneTheme();addEventListener('themechange',applySceneTheme);
 const rig=new THREE.Group();scene.add(rig);const model=createAvatar();rig.add(model.avatar);
 const orbit=new THREE.Group();rig.add(orbit);const ringMat=new THREE.MeshBasicMaterial({color:0xcfff70,transparent:true,opacity:.3});
 for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(2.3+i*.15,.014,6,120),ringMat);r.rotation.set(Math.PI/2+(i===1?.6:0),i*.2,i*.5);r.position.y=-1.8+i*.12;orbit.add(r)}
 const halo=new THREE.Mesh(new THREE.TorusGeometry(1.06,.018,8,100),ringMat);halo.position.set(0,1.3,-.5);rig.add(halo);
 const count=innerWidth<700?90:180,arr=new Float32Array(count*3);let seed=437;for(let i=0;i<arr.length;i++){seed=seed*16807%2147483647;arr[i]=(seed/2147483647-.5)*22}const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(arr,3));const stars=new THREE.Points(pg,new THREE.PointsMaterial({color:0xa8c18c,size:.018,transparent:true,opacity:.6}));scene.add(stars);

 let reduced=document.body.classList.contains('reduced'),active=true,last=0,pointer={x:0,y:0},mode='dev',current='';
 const initial=poseFor('home'),pose={...initial,transit:0},action={tap:0,react:0};let chapterStart=performance.now(),travelTarget=0,travelDirection=1,transitionProgress=1,chapterCross=false,guided=false,nativeSpeed=0,scrollStamp=performance.now(),lastScroll=scrollY;let transition,focusUntil=0,focusTarget=null,sectionRects=[];
 const hud=document.querySelector('.guide-hud');
 const color=new THREE.Color(initial.color),targetColor=new THREE.Color(initial.color);
 function refreshRects(){sectionRects=CHAPTERS.map(c=>({id:c.id,top:document.getElementById(c.id).getBoundingClientRect().top+scrollY}));}
 function resize(){renderer.setSize(innerWidth,innerHeight);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();refreshRects();}resize();addEventListener('resize',resize);
 function setChapter(id){if(id===current)return;current=id;chapterStart=performance.now();focusTarget=null;focusUntil=0;const dest=poseFor(id);document.body.dataset.chapter=id;
 document.querySelector('#guide-chapter').textContent=String(CHAPTERS.findIndex(c=>c.id===id)+1).padStart(2,'0')+' / '+dest.name.toUpperCase();document.querySelector('#guide-hint').textContent=dest.hint;
 targetColor.set(dest.color);if(transition)transition.kill();
 const values={x:dest.x,y:dest.y,scale:dest.scale,turn:dest.turn,left:dest.left,right:dest.right,look:dest.look};
 if(reduced||!window.gsap){Object.assign(pose,values,{transit:0});return;}
 gsap.fromTo(hud,{opacity:.5},{opacity:1,duration:.65,overwrite:true});
 transition=gsap.to(pose,{...values,transit:0,duration:1.05,ease:'sine.inOut',overwrite:true});
 }
 function progress(){const stamp=performance.now(),delta=scrollY-lastScroll;if(!guided)nativeSpeed=Math.min(1,Math.abs(delta)/Math.max(12,stamp-scrollStamp)*.35);lastScroll=scrollY;scrollStamp=stamp;const sections=sectionRects.map(s=>({id:s.id,top:s.top-scrollY}));setChapter(selectChapter(sections,innerHeight));
 // La timeline est aussi un repère du regard et du bras, sans défilement forcé.
 if(current==='journey'&&performance.now()>focusUntil){let closest=null,dist=Infinity;document.querySelectorAll('.chapter').forEach(el=>{const r=el.getBoundingClientRect(),d=Math.abs(r.top+r.height*.4-innerHeight*.48);if(d<dist){dist=d;closest=el}});if(closest){document.querySelectorAll('.chapter').forEach(el=>el.classList.toggle('is-current',el===closest));focusTarget=closest.querySelector('h3');}}
 if(current==='work'&&performance.now()>focusUntil){let nearest=null,dist=Infinity;document.querySelectorAll('.project').forEach(el=>{const r=el.getBoundingClientRect(),d=Math.abs(r.top+r.height*.5-innerHeight*.5);if(d<dist){dist=d;nearest=el}});if(nearest)focusTarget=nearest.querySelector('.project-meta');}
 }addEventListener('scroll',progress,{passive:true});progress();addEventListener('load',()=>{refreshRects();progress()});
 addEventListener('chaptertravel',e=>{guided=e.detail.active;transitionProgress=e.detail.progress;chapterCross=!!e.detail.crossSection;travelTarget=e.detail.active?sampleTransition(transitionProgress).pulse*(chapterCross?1:.25):0;travelDirection=e.detail.direction||travelDirection;document.body.classList.toggle('in-transition',guided&&chapterCross&&!reduced);});
 addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth-.5;pointer.y=e.clientY/innerHeight-.5},{passive:true});
 addEventListener('motionchange',e=>{reduced=e.detail;if(reduced){if(transition)transition.kill();const d=poseFor(current);Object.assign(pose,{x:d.x,y:d.y,scale:d.scale,turn:d.turn,left:d.left,right:d.right,look:d.look,transit:0});action.tap=0;travelTarget=0;nativeSpeed=0;document.body.classList.remove('in-transition');}});
 addEventListener('modechange',e=>{mode=e.detail;if(current==='skills')targetColor.set(mode==='qa'?0xbba2ff:0xcfff70);if(window.gsap&&!reduced)gsap.fromTo(action,{tap:0},{tap:1,duration:.3,repeat:3,yoyo:true});});
 addEventListener('guidefocus',e=>{if(!['journey','skills','work'].includes(current))return;const wanted=e.detail.kind==='skill'?'skills':e.detail.kind==='project'?'work':'journey';if(current!==wanted)return;focusTarget=document.querySelector(e.detail.target);focusUntil=performance.now()+4500;document.querySelector('#guide-hint').textContent=e.detail.text;if(current==='skills'&&window.gsap&&!reduced)gsap.fromTo(action,{tap:0},{tap:1,duration:.25,repeat:3,yoyo:true});});
 document.addEventListener('visibilitychange',()=>{active=!document.hidden;last=0});
 const robotButton=document.querySelector('#robot-interact');let reactionTween;
 robotButton.onclick=()=>{if(reactionTween)reactionTween.kill();if(reduced){document.querySelector('#guide-hint').textContent='P—01 vous accompagne. Choisissez une section ou un projet.';return;}if(window.gsap)reactionTween=gsap.timeline().to(action,{react:1,duration:.2,ease:'power2.out'}).to(action,{react:0,duration:.75,ease:'sine.inOut'});};
 addEventListener('projectinspect',e=>{if(current==='work'){focusTarget=document.querySelector(e.detail.target);focusUntil=performance.now()+1800;}});
 const screenHead=new THREE.Vector3(),visitorTarget=new THREE.Vector3(),wristTarget=new THREE.Vector3();
 const bookWorld=new THREE.Vector3(),bookLocal=new THREE.Vector3();
 const down=new THREE.Vector3(0,-1,0),aim=new THREE.Vector3(),worldTarget=new THREE.Vector3(),shoulderWorld=new THREE.Vector3(),inverseRig=new THREE.Quaternion(),pointQuaternion=new THREE.Quaternion(),armQuaternion=new THREE.Quaternion(),angles=new THREE.Euler();
 const defaults={about:'.metrics',journey:'.chapter.is-current h3',skills:'#perspective-title',work:'.project-meta',contact:'#contact-button'};
 const smoothed={headX:0,headY:0,travel:0,lean:0,book:0,tablet:0};
 function frame(t){requestAnimationFrame(frame);if(!active||t-last<(reduced?120:0))return;const dt=Math.min(.06,last?(t-last)/1000:.016);last=t;
 const blend=reduced?1:1-Math.exp(-dt*7),time=reduced?0:t*.001,mobile=innerWidth<800,dest=poseFor(current),elapsed=reduced?6:(performance.now()-chapterStart)/1000;
 const chapterMotion=sampleTransition(transitionProgress);if(!guided&&performance.now()-scrollStamp>100)nativeSpeed=0;const presenting=reduced?0:travelTarget;
 smoothed.travel+=(presenting-smoothed.travel)*blend;smoothed.lean+=((guided?chapterMotion.turn*travelDirection:0)-smoothed.lean)*blend;
 // La même échelle interpolée sur desktop ET mobile : pas de saut à la frontière.
 const homeWeight=THREE.MathUtils.clamp((pose.scale-.62)/.38,0,1);
 const scale=mobile?.31+homeWeight*.36:pose.scale;
 const screenX=mobile?.88-homeWeight*.15:pose.x,screenY=mobile?.77-homeWeight*.17:pose.y;
 const worldH=2*camera.position.z*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),worldW=worldH*camera.aspect;
 rig.position.set((screenX-.5)*worldW,(.5-screenY)*worldH,0);rig.scale.setScalar(scale);
 rig.rotation.set(0,pose.turn+pointer.x*.035+smoothed.lean,0);
 model.avatar.position.y=0;
 const clip=sampleMotion(dest.gesture,elapsed,smoothed.travel,0,action.tap);const welcome=welcomeSequence(elapsed);
 let target=focusTarget||document.querySelector(defaults[current]||'.hero h1');let rect=target?.getBoundingClientRect();
 if(rect&&(rect.bottom<70||rect.top>innerHeight))rect=null;
 const lookY=rect?THREE.MathUtils.clamp(((rect.top+rect.height*.5)/innerHeight-screenY)*.55,-.25,.3):0;
 if(dest.gesture!=='welcome'&&(dest.gesture!=='read'||smoothed.book<=.1)){smoothed.headX+=(clip.headX+lookY-smoothed.headX)*blend;smoothed.headY+=(pose.look+pointer.x*.035-smoothed.headY)*blend;}
 model.head.rotation.set(smoothed.headX,smoothed.headY,0);
 // Épaules et coudes amortis, y compris lors d'un changement rapide de chapitre.
 for(let i=0;i<2;i++){
  angles.set(i?clip.rightX:clip.leftX,0,i?clip.rightZ:clip.leftZ);armQuaternion.setFromEuler(angles);
  if(i===0&&rect&&['point','invite'].includes(dest.gesture)&&smoothed.travel<.5){
   rig.updateMatrixWorld(true);model.arms[0].getWorldPosition(shoulderWorld);
   worldTarget.set(((Math.min(rect.right,innerWidth*.7)/innerWidth)-.5)*worldW,(.5-THREE.MathUtils.clamp((rect.top+rect.height*.5)/innerHeight,.15,.8))*worldH,.2);
   inverseRig.copy(rig.quaternion).invert();aim.copy(worldTarget).sub(shoulderWorld).normalize().applyQuaternion(inverseRig);pointQuaternion.setFromUnitVectors(down,aim);
   armQuaternion.slerp(pointQuaternion,Math.min(1,elapsed/.8));
  }
  model.arms[i].quaternion.slerp(armQuaternion,blend);
  const elbow=model.elbows[i];elbow.rotation.x+=(-(i?clip.elbowR:clip.elbowL)-elbow.rotation.x)*blend;elbow.rotation.z+=((i?clip.elbowZR:clip.elbowZL)-elbow.rotation.z)*blend;
  const wrist=model.wrists[i];wrist.rotation.z+=((i?clip.wristR:clip.wristL)-wrist.rotation.z)*blend;
 }
 model.legs.forEach(l=>{l.rotation.x+=(0-l.rotation.x)*blend;l.rotation.z+=(0-l.rotation.z)*blend;});
 const holdingBook=dest.gesture==='read',holdingTablet=dest.gesture==='type';
 smoothed.book+=((holdingBook?1:0)*(1-smoothed.travel)-smoothed.book)*blend;
 smoothed.tablet+=((holdingTablet?1:0)*(1-smoothed.travel)-smoothed.tablet)*blend;
 model.book.visible=smoothed.book>.025;model.book.scale.setScalar(Math.max(.001,smoothed.book));
 model.tablet.visible=smoothed.tablet>.025;model.tablet.scale.setScalar(Math.max(.001,smoothed.tablet));
 // Une page toutes les 7 secondes, avec préparation et retour de la main droite.
 const pageClock=reduced?0:(elapsed%7),turn=Math.max(0,Math.min(1,(pageClock-3.2)/1.4));
 model.page.rotation.y=-.56-(Math.PI-1.12)*(turn*turn*(3-2*turn));model.page.visible=holdingBook&&pageClock>=3.2&&pageClock<=4.6;
 if(holdingBook&&!reduced){const touch=Math.sin(turn*Math.PI)*.22;model.wrists[1].rotation.z+=(-.25-touch-model.wrists[1].rotation.z)*blend;}
 model.leaves.forEach((leaf,i)=>leaf.rotation.y=bookHinge(i?1:-1,smoothed.book));
 // Recalcul après les bras : la tête suit le vrai livre dans les deux scènes.
 if(holdingBook&&smoothed.book>.1){
  rig.updateMatrixWorld(true);model.book.localToWorld(bookWorld.set(0,0,.06));bookLocal.copy(bookWorld);model.avatar.worldToLocal(bookLocal);
  const gaze=readingGaze(model.head.position,bookLocal),weight=smoothed.book*(1-smoothed.travel);
  const targetX=clip.headX+lookY+(gaze.pitch-clip.headX-lookY)*weight;
  const targetY=pose.look+(gaze.yaw-pose.look)*weight;
  smoothed.headX+=(targetX-smoothed.headX)*blend;smoothed.headY+=(targetY-smoothed.headY)*blend;
  model.head.rotation.set(smoothed.headX,smoothed.headY,0);
 }
 
 // Sur l'accueil : visée caméra pendant le salut, puis séquence d'attente.
 if(dest.gesture==='welcome'){
  rig.updateMatrixWorld(true);visitorTarget.copy(camera.position);if(!reduced&&welcome.greet<.1){visitorTarget.x+=pointer.x*.9;visitorTarget.y-=pointer.y*.5;}
  model.avatar.worldToLocal(visitorTarget);
  if(welcome.inspect>.01){model.wrists[0].getWorldPosition(wristTarget);model.avatar.worldToLocal(wristTarget);visitorTarget.lerp(wristTarget,welcome.inspect);}
  const gaze=readingGaze(model.head.position,visitorTarget);smoothed.headX+=(gaze.pitch+clip.headX-smoothed.headX)*blend;smoothed.headY+=(gaze.yaw-smoothed.headY)*blend;
  model.head.rotation.set(smoothed.headX,smoothed.headY,0);model.avatar.scale.y=1+(reduced?0:welcome.breathe);
 }else model.avatar.scale.y=1;
 // Petit acquiescement au clic, sans modifier le geste de lecture.
 if(dest.gesture!=='read')model.head.rotation.x+=action.react*.16;
 rig.updateMatrixWorld(true);model.head.getWorldPosition(screenHead);screenHead.project(camera);const headW=1.7*scale/worldW*innerWidth,headH=1.5*scale/worldH*innerHeight;
 robotButton.style.left=((screenHead.x*.5+.5)*innerWidth-headW/2)+'px';robotButton.style.top=((-screenHead.y*.5+.5)*innerHeight-headH/2)+'px';robotButton.style.width=headW+'px';robotButton.style.height=headH+'px';
 const blink=reduced?1:(Math.sin(time*.53)>.998?.2:1);model.eyes.forEach(e=>{e.scale.y=.065*blink*(1+action.react*.3);e.scale.x=.105*(1+action.react*.12);});
 if(current==='skills')targetColor.set(mode==='qa'?0xbba2ff:0xcfff70);color.lerp(targetColor,blend*.5);model.glow.color.copy(color);model.glow.emissive.copy(color);model.glow.emissiveIntensity=1.5+action.react*.8;ringMat.color.copy(color);
 halo.rotation.z=time*.035;halo.scale.setScalar(1+action.react*.08);ringMat.opacity=(lightTheme?.4:.38)+smoothed.travel*.2;orbit.rotation.y=time*.04;
 orbit.children.forEach((r,i)=>r.position.y=-1.8+i*.12);stars.material.color.set(lightTheme?0x6e4a95:0xa8c18c);stars.material.opacity=lightTheme?.3:.6;stars.rotation.y=scrollY*.000008;renderer.render(scene,camera);
 }requestAnimationFrame(frame);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();hud.hidden=true;robotButton.hidden=true});
}
