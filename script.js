/* Smooth embers + candle-crackle toggle (no audio file needed) */

// ------ Floating embers ------
(function embers(){
  const field = document.getElementById('embers');
  if(!field) return;
  const spawn = () => {
    const s = document.createElement('span');
    s.className = 'ember';
    s.style.left = Math.random()*100 + '%';
    s.style.bottom = (Math.random()*12) + '%';
    s.style.animationDuration = (5 + Math.random()*4).toFixed(2) + 's';
    field.appendChild(s);
    setTimeout(()=> s.remove(), 9000);
  };
  // initial scatter
  for(let i=0;i<18;i++) spawn();
  setInterval(spawn, 400);
})();


// ------ Candle crackle via Web Audio (procedural noise bursts) ------
let audioCtx, masterGain, running = false, crackleTimer;

/* Create a soft crackle using random envelope bursts of filtered noise */
function startCrackle(){
  if(running) return;
  running = true;
  if(!audioCtx){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.08; // overall volume (gentle)
    masterGain.connect(audioCtx.destination);
  }

  const makeCrackle = () => {
    if(!running) return;
    // White noise buffer
    const bufferSize = 0.08; // seconds per burst
    const sampleRate = audioCtx.sampleRate;
    const buffer = audioCtx.createBuffer(1, sampleRate*bufferSize, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i=0; i<data.length; i++){
      // sparse spiky noise
      const rnd = Math.random();
      data[i] = (rnd > 0.985 ? (Math.random()*2-1) * 0.9 : (Math.random()*2-1) * 0.02);
    }

    const src = audioCtx.createBufferSource();
    src.buffer = buffer;

    // gentle band-pass to make it crackly, not hissy
    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2500 + Math.random()*1500;
    bp.Q.value = 1.2;

    // envelope
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.4 + Math.random()*0.4, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (0.04 + Math.random()*0.1));

    src.connect(bp);
    bp.connect(gain);
    gain.connect(masterGain);

    src.start();
    src.stop(now + 0.15);
  };

  // irregular bursts (like a candle)
  crackleTimer = setInterval(()=>{
    const bursts = 1 + Math.floor(Math.random()*3);
    for(let i=0;i<bursts;i++){
      setTimeout(makeCrackle, Math.random()*120);
    }
  }, 160);
}

function stopCrackle(){
  running = false;
  if(crackleTimer) clearInterval(crackleTimer);
}

// Toggle button
const btn = document.getElementById('soundToggle');
if(btn){
  btn.addEventListener('click', async () => {
    if(!running){
      await (audioCtx?.resume?.() ?? Promise.resolve());
      startCrackle();
      btn.textContent = '🔊 Candle crackle: On';
    } else {
      stopCrackle();
      btn.textContent = '🔈 Candle crackle: Off';
    }
  });
}

// Optional: auto-resume on user interaction for iOS
window.addEventListener('touchstart', () => audioCtx?.resume?.(), {once:true});
