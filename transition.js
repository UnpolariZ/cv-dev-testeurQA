// Transition de présentation, pieds stables : préparation, orientation, geste.
export function sampleTransition(progress){
 const p=Math.max(0,Math.min(1,progress));
 const pulse=Math.sin(p*Math.PI)**2;
 return {pulse,turn:Math.sin(p*Math.PI*2)*.12,hand:pulse*.35};
}
