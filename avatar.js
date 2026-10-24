import * as T from './vendor/three.module.min.js';
// Modèle original procédural, sans fichier distant ni texture externe.
export function createAvatar(){
 const avatar=new T.Group();
 const armor=new T.MeshPhysicalMaterial({color:0xe8e4df,roughness:.24,metalness:.28,clearcoat:1,clearcoatRoughness:.16});
 const dark=new T.MeshStandardMaterial({color:0x161722,roughness:.48,metalness:.5});
 const glass=new T.MeshPhysicalMaterial({color:0x111827,roughness:.1,metalness:.65,clearcoat:1,clearcoatRoughness:.08});
 const glow=new T.MeshStandardMaterial({color:0xcfff70,emissive:0xa8ef42,emissiveIntensity:1.5,roughness:.35});
 const accent=new T.MeshStandardMaterial({color:0x81758f,roughness:.28,metalness:.6});
 const sphereGeometry=new T.SphereGeometry(1,28,20);
 function ball(parent,x,y,z,sx,sy,sz,mat){const m=new T.Mesh(sphereGeometry,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m}
 function box(parent,x,y,z,sx,sy,sz,mat){const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),mat);m.position.set(x,y,z);parent.add(m);return m}
 // Corps avec plastron, col, réacteur dorsal et articulations distinctes.
 ball(avatar,0,.25,0,.67,.82,.4,dark);
 ball(avatar,0,.38,.08,.65,.65,.4,armor);
 box(avatar,0,.3,.468,.32,.22,.045,dark);box(avatar,0,.32,.5,.22,.035,.02,glow);
 for(let i=0;i<3;i++)box(avatar,-.07+i*.07,.23,.5,.035,.045,.02,accent);
 ball(avatar,0,-.35,0,.5,.32,.33,dark);ball(avatar,0,-.35,.16,.45,.18,.3,accent);
 const backpack=box(avatar,0,.38,-.37,.78,.95,.32,dark);
 for(const x of [-.44,.44]){ball(avatar,x,.2,-.37,.14,.48,.17,armor);ball(avatar,x,-.2,-.38,.09,.12,.1,glow)}
 const head=new T.Group();head.position.y=1.27;avatar.add(head);
 ball(head,0,0,0,.79,.73,.67,armor);ball(head,0,-.04,.38,.66,.46,.39,glass);
 // Visage d'origine : yeux lumineux et barre de communication.
 const eyes=[];for(const x of [-.23,.23])eyes.push(ball(head,x,.02,.745,.105,.065,.025,glow));
 for(let i=0;i<5;i++)box(head,-.08+i*.04,-.2,.748,.018,.025+Math.abs(2-i)*.009,.02,accent);
 for(const x of [-.78,.78]){ball(head,x,0,0,.12,.25,.25,dark);ball(head,x*1.025,0,.035,.07,.14,.14,accent)}
 const antenna=box(head,.42,.71,-.1,.035,.35,.035,dark);ball(head,.42,.91,-.1,.065,.065,.065,glow);
 const arms=[],elbows=[],wrists=[];
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(side*.72,.69,0);avatar.add(arm);
  ball(arm,0,-.03,0,.24,.28,.27,accent);ball(arm,side*.06,-.29,0,.22,.34,.23,armor);
  const elbow=new T.Group();elbow.position.set(side*.06,-.58,0);arm.add(elbow);ball(elbow,0,0,0,.18,.18,.19,dark);
  ball(elbow,0,-.22,.02,.22,.26,.23,armor);box(elbow,0,-.22,.25,.19,.12,.035,glow);
  const wrist=new T.Group();wrist.position.set(0,-.46,.025);elbow.add(wrist);ball(wrist,0,-.045,0,.19,.17,.2,dark);
  arms.push(arm);elbows.push(elbow);wrists.push(wrist);
 }
 const legs=[];for(const side of [-1,1]){const leg=new T.Group();leg.position.set(side*.3,-.53,0);avatar.add(leg);ball(leg,0,-.28,0,.26,.43,.27,armor);ball(leg,0,-.57,.06,.21,.2,.22,dark);ball(leg,0,-.85,.015,.24,.32,.24,armor);ball(leg,0,-1.08,.15,.29,.19,.4,dark);box(leg,0,-1.05,.48,.23,.045,.02,glow);legs.push(leg)}
 // Tablette holographique solidaire de la main gauche.
 const tablet=new T.Group();tablet.position.set(0,-.1,.22);tablet.rotation.set(-.6,0,0);wrists[0].add(tablet);
 const panelMat=new T.MeshBasicMaterial({color:0x9effcc,transparent:true,opacity:.15,side:T.DoubleSide,depthWrite:false});
 box(tablet,0,0,0,.64,.45,.025,dark);box(tablet,0,0,.025,.57,.38,.01,panelMat);
 for(let i=0;i<4;i++)box(tablet,-.08,-.12+i*.075,.04,.3-i*.045,.013,.01,glow);
 // Livre : deux couvertures, pages ivoire et feuillet mobile.
 const book=new T.Group();book.position.set(.12,-.08,.28);book.rotation.set(-.4,0,.02);wrists[0].add(book);
 const cover=new T.MeshStandardMaterial({color:0x493369,roughness:.5,metalness:.15});
 const paper=new T.MeshStandardMaterial({color:0xe6e2d0,roughness:.9,side:T.DoubleSide});
 const leaves=[];
 for(const side of [-1,1]){const leaf=new T.Group();leaf.rotation.y=-side*.56;book.add(leaf);box(leaf,side*.22,0,0,.44,.58,.045,cover);box(leaf,side*.22,0,.032,.39,.52,.025,paper);for(let i=0;i<5;i++)box(leaf,side*.22,.15-i*.065,.049,.27-i*.018,.009,.005,accent);leaves.push(leaf);}
 const page=new T.Group();book.add(page);const sheet=new T.Mesh(new T.PlaneGeometry(.39,.51),paper);sheet.position.set(.195,0,.06);page.add(sheet);book.visible=false;
 // Finitions : joints usinés, col, bord de visière et inserts métalliques.
 const metal=new T.MeshStandardMaterial({color:0x787587,metalness:.86,roughness:.22});
 const violet=new T.MeshStandardMaterial({color:0xb39bdf,emissive:0x4b2c78,emissiveIntensity:.35,metalness:.6,roughness:.25});
 const softLight=new T.MeshBasicMaterial({color:0xd8e5ff,transparent:true,opacity:.2,depthWrite:false});
 function ring(parent,x,y,z,radius,tube,mat,sx=1,sy=1){const mesh=new T.Mesh(new T.TorusGeometry(radius,tube,8,64),mat);mesh.position.set(x,y,z);mesh.scale.set(sx,sy,1);parent.add(mesh);return mesh;}
 const collar=ring(avatar,0,.92,0,.35,.055,metal);collar.rotation.x=Math.PI/2;
 ring(head,0,-.04,.61,.55,.018,metal,1.17,.79);
 // Reflet géométrique de softbox sur le verre, sans texture externe.
 const reflection=ball(head,-.22,.19,.716,.21,.025,.012,softLight);reflection.rotation.z=-.22;
 ball(head,.36,-.18,.699,.07,.012,.01,softLight);
 for(const side of [-1,1]){
  const ear=ring(head,side*.86,0,.035,.145,.018,metal);ear.rotation.y=Math.PI/2;
  const led=ring(head,side*.87,0,.035,.102,.012,violet);led.rotation.y=Math.PI/2;
  for(let i=0;i<3;i++)box(head,side*.55,-.39+i*.06,.49,.085,.016,.015,dark);
  const shoulder=ring(arms[side<0?0:1],0,-.04,0,.21,.025,metal);shoulder.rotation.y=Math.PI/2;
  const cuff=ring(wrists[side<0?0:1],0,.08,0,.18,.02,metal);cuff.rotation.x=Math.PI/2;
 }
 // Panneau pectoral et petits repères gravés.
 ring(avatar,.32,.49,.425,.068,.013,violet);
 box(avatar,-.31,.54,.42,.16,.022,.018,metal);box(avatar,-.34,.48,.444,.1,.012,.012,violet);
 for(let i=0;i<3;i++)box(avatar,0,-.12-i*.065,.38,.34-i*.035,.019,.015,dark);
 for(const leg of legs){ball(leg,0,-.58,.205,.15,.13,.045,metal);box(leg,0,-.79,.25,.1,.19,.025,violet);}
 return {avatar,head,arms,elbows,wrists,legs,eyes,glow,accent,tablet,book,page,leaves};
}
