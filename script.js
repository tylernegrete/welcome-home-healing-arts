// subtle parallax on hero banner
(function(){
  const banner = document.querySelector('.hero-banner');
  const hero = document.querySelector('.hero');
  function onScroll(){
    const rect = hero.getBoundingClientRect();
    const winH = window.innerHeight || document.documentElement.clientHeight;
    if(rect.bottom > 0 && rect.top < winH){
      const progress = (winH - rect.top) / (winH + rect.height);
      const translate = (progress * 16 - 8);
      banner.style.transform = `translate3d(0, ${translate}px, 0)`;
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
})();

// floating dust particles
(function(){
  const field = document.getElementById('dust');
  if(!field) return;
  const style = document.createElement('style');
  style.textContent = `
    .speck{position:absolute; width:3px; height:3px; border-radius:50%;
      background:#f3d58b; box-shadow:0 0 10px #cfae52, 0 0 22px rgba(243,213,139,.7);
      opacity:.85; animation:risedrift 10s ease-in-out forwards}
    @keyframes risedrift{
      0%{ transform: translate(0,0) scale(1); opacity:.85 }
      50%{ transform: translate(10px,-50px) scale(1.3); opacity:.6 }
      100%{ transform: translate(-10px,-120px) scale(1.05); opacity:0 }
    }`;
  document.head.appendChild(style);
  const spawn = () => {
    const s = document.createElement('span');
    s.className = 'speck';
    s.style.left = Math.random()*100 + '%';
    s.style.bottom = (Math.random()*20 - 5) + '%';
    s.style.animationDuration = (6 + Math.random()*6).toFixed(2) + 's';
    field.appendChild(s);
    setTimeout(()=> s.remove(), 14000);
  };
  for(let i=0;i<20;i++) spawn();
  setInterval(spawn, 600);
})();
