// Poses déclaratives : positions normalisées dans le viewport, bras et regard.
// 0 = bras gauche, 1 = bras droit. Le robot se place dans la marge réservée.
export const CHAPTERS=[
 {id:'home',name:'Bienvenue',hint:'Créativité au bout des doigts. Descendez pour faire connaissance.',x:.80,y:.49,scale:1,turn:0,left:-.2,right:.35,look:0,gesture:'welcome',color:0xcfff70},
 {id:'about',name:'Une double perspective',hint:'Deux regards : construire une interface et éprouver sa fiabilité.',x:.86,y:.48,scale:.66,turn:-.3,left:-1.15,right:.9,look:-.3,gesture:'present',color:0xbba2ff},
 {id:'journey',name:'Suivre la trajectoire',hint:'Chaque étape ajoute une nouvelle façon de penser le produit.',x:.87,y:.46,scale:.62,turn:-.42,left:-1.45,right:.1,look:-.45,gesture:'read',color:0xcfff70},
 {id:'skills',name:'Changer de regard',hint:'Choisissez une approche : je vous accompagne dans les détails.',x:.86,y:.43,scale:.63,turn:-.25,left:-.35,right:.6,look:-.25,gesture:'type',color:0xbba2ff},
 {id:'work',name:'Explorer les projets',hint:'Survolez ou sélectionnez un projet : je vous le présente.',x:.87,y:.45,scale:.62,turn:-.4,left:-1.6,right:.15,look:-.35,gesture:'point',color:0xcfff70},
 {id:'philosophy',name:'Garder le cap',hint:'La curiosité fait avancer. La rigueur donne une direction.',x:.84,y:.46,scale:.7,turn:0,left:-.18,right:.18,look:0,gesture:'read',color:0xbba2ff},
 {id:'contact',name:'À vous de jouer',hint:'Un projet à construire ? Voici la prochaine étape.',x:.85,y:.43,scale:.68,turn:-.25,left:-1.2,right:1.6,look:-.3,gesture:'invite',color:0xcfff70}
];
export function poseFor(id){return CHAPTERS.find(p=>p.id===id)||CHAPTERS[0]}
export function selectChapter(sections,height){let selected=sections[0];for(const s of sections)if(s.top<=height*.48)selected=s;return selected?.id||'home'}
