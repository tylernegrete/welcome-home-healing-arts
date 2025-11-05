// Subtle sparkles around the banner
(function(){
  const field = document.querySelector('.sparkle-field');
  if(!field) return;
  const makeSparkle = () => {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.style.left = Math.random()*100 + '%';
    s.style.top = Math.random()*100 + '%';
    s.style.position = 'absolute';
    s.style.width = '4px';
    s.style.height = '4px';
    s.style.borderRadius = '50%';
    s.style.background = '#f3d58b';
    s.style.boxShadow = '0 0 10px #cfae52, 0 0 18px rgba(243,213,139,0.7)';
    s.style.animation = 'drift 6s ease-in-out infinite';
    s.style.opacity = '.85';
    field.appendChild(s);
    setTimeout(()=> s.remove(), 6000);
  };
  for(let i=0;i<12;i++) makeSparkle();
  setInterval(makeSparkle, 1000);
})();
