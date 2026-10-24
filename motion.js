import {welcomeSequence} from './welcome.js';
// Petits clips de gestes : les rotations sont interpolées dans la scène.
// Les coudes se replient indépendamment des épaules.
export function sampleMotion(gesture,t,travel=0,wave=0,tap=0){
 const s={leftZ:-.12,rightZ:.12,leftX:0,rightX:0,elbowL:.15,elbowR:.15,elbowZL:0,elbowZR:0,wristL:0,wristR:0,headX:0};
 const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const enter=ease(t/1.1);
 if(gesture==='welcome'){
  const a=welcomeSequence(t);
  // Main près du casque, avant-bras dans le plan frontal ; le poignet salue.
  s.rightZ=.12+a.greet*1.28;s.elbowR=.15*(1-a.greet);s.elbowZR=a.greet*1.15;s.wristR=a.wave;
  s.leftX=-a.inspect*.65;s.elbowL=.15+a.inspect*1.05;s.wristL=-a.inspect*.12;
  s.leftZ-=a.present*.8;s.elbowZL=-a.present*.25;
  s.headX=a.nod*Math.sin(t*2)*.07;
 }
 if(gesture==='present'){s.leftZ=-.65*enter;s.rightZ=.4*enter;s.elbowL=.7*enter;s.elbowR=.6*enter;s.wristL=-.35*enter;s.wristR=.35*enter;}
 if(gesture==='point'){s.leftZ=-1.25*enter;s.elbowL=.1;s.rightZ=.12;s.elbowR=.35;}
 if(gesture==='type'){s.leftX=-.75*enter;s.rightX=-.6*enter;s.leftZ=-.2;s.rightZ=-.08;s.elbowL=1*enter;s.elbowR=.8*enter;s.wristR=Math.sin(t*4)*.06+tap*.22;s.headX=.1;}
 if(gesture==='read'){s.leftX=-.65*enter;s.rightX=-.65*enter;s.leftZ=-.12;s.rightZ=-.15;s.elbowL=.95*enter;s.elbowR=1.1*enter;s.wristL=-.08;s.wristR=-.25;s.headX=.25*enter;}
 if(gesture==='float'){s.leftZ=-.25;s.rightZ=.25;s.elbowL=.25;s.elbowR=.25;}
 if(gesture==='invite'){s.leftZ=-.85*enter;s.elbowL=.55*enter;s.rightZ=.5*enter;s.elbowR=.55*enter;s.wristL=-.25;}
 // Entre les chapitres : petit geste de présentation, corps stable.
 // Le livre reste tenu par la même main, sans repli de type « vol ».
 if(gesture!=='read'&&gesture!=='type'){
  s.rightZ+=travel*.4;s.elbowR+=travel*.3;s.wristR+=travel*.12;
 }
 s.rightZ+=wave*1.9;s.elbowR+=wave*.65;s.wristR+=wave*Math.sin(t*8)*.25;
 return s;
}
