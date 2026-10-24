// Angle intérieur du livre : 116° à pleine ouverture (pas un pli inversé).
export function bookHinge(side,openness){const open=Math.max(0,Math.min(1,openness));return -side*(Math.PI/2-.03-open*(Math.PI/2-.03-.56));}
// Cible en coordonnées locales du parent de la tête, indépendante du chapitre.
// Le modèle regarde le long de +Z ; rotation X positive = regard vers le bas.
export function readingGaze(headPosition,target){
 const x=target.x-headPosition.x,y=target.y-headPosition.y,z=target.z-headPosition.z;
 return {pitch:Math.max(-.9,Math.min(.95,Math.atan2(-y,Math.hypot(x,z)))),yaw:Math.max(-.7,Math.min(.7,Math.atan2(x,Math.max(.15,z))))};
}
