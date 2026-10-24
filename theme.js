// Chargé avant la feuille de style pour éviter un flash de mauvais thème.
(function(){
 let theme='dark';try{theme=localStorage.getItem('orbital-theme')==='light'?'light':'dark'}catch{}
 const root=document.documentElement;
 function apply(next,persist){theme=next;root.dataset.theme=theme;root.style.colorScheme=theme;const b=document.getElementById('theme-toggle');if(b){b.setAttribute('aria-pressed',String(theme==='light'));b.setAttribute('aria-label',theme==='light'?'Activer le thème sombre':'Activer le thème clair');b.querySelector('.theme-label').textContent=theme==='light'?'Sombre':'Clair';b.querySelector('[aria-hidden]').textContent=theme==='light'?'☾':'☼';}if(persist)try{localStorage.setItem('orbital-theme',theme)}catch{};document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='light'?'#f5f2fa':'#0c0c12');window.dispatchEvent(new CustomEvent('themechange',{detail:theme}));}
 apply(theme,false);document.addEventListener('DOMContentLoaded',()=>{apply(theme,false);document.getElementById('theme-toggle').onclick=()=>apply(theme==='dark'?'light':'dark',true)});
})();
