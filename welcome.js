const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const envelope=(t,start,end)=>smooth((t-start)/.65)*(1-smooth((t-end)/.65));
export function welcomeSequence(t){
 const greet=envelope(t,0,2.5),cycle=Math.max(0,t-5)%24;
 const inspect=t<5?0:envelope(cycle,3,6),present=t<5?0:envelope(cycle,10,13),nod=t<5?0:envelope(cycle,18,20);
 return {greet,inspect,present,nod,wave:Math.sin(Math.max(0,t-.6)*6)*.18*greet,breathe:Math.sin(t*1.3)*.012};
}
