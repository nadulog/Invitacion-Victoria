if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
document.documentElement.classList.add('intro-open');

const $ = (selector) => document.querySelector(selector);
const audio = $('#invitationAudio');
const audioToggle = $('#audioToggle');
const intro = $('#introScreen');
const toast = $('#toast');
let entered = false;

const introTwinkles = $('#introTwinkles');
if (introTwinkles) {
  for (let n = 0; n < 58; n += 1) {
    const star = document.createElement('i');
    star.className = 'intro-twinkle';
    star.style.left = `${4 + Math.random() * 92}%`;
    star.style.top = `${3 + Math.random() * 89}%`;
    star.style.setProperty('--twinkle-size', `${2 + Math.random() * 4.5}px`);
    star.style.setProperty('--twinkle-speed', `${1.35 + Math.random() * 2.35}s`);
    star.style.setProperty('--twinkle-delay', `${-Math.random() * 4}s`);
    star.style.setProperty('--twinkle-opacity', `${.68 + Math.random() * .3}`);
    introTwinkles.appendChild(star);
  }
}

async function enterInvitation(withMusic) {
  if (entered) return;
  entered = true;
  if (withMusic) {
    try { await audio.play(); audioToggle.classList.add('playing'); audioToggle.setAttribute('aria-pressed', 'true'); } catch {}
  }
  const burst = $('#introBurst');
  for (let n = 0; n < 42; n += 1) {
    const particle = document.createElement('i');
    const angle = Math.random() * Math.PI * 2;
    const distance = 45 + Math.random() * 70;
    particle.className = 'intro-particle';
    particle.style.setProperty('--x', `${Math.cos(angle) * distance}vw`);
    particle.style.setProperty('--y', `${Math.sin(angle) * distance}vh`);
    particle.style.setProperty('--delay', `${Math.random() * .16}s`);
    burst.appendChild(particle);
  }
  intro.classList.add('departing');
  setTimeout(() => intro.classList.add('leaving'), 720);
  setTimeout(() => { document.documentElement.classList.remove('intro-open'); intro.remove(); }, 1500);
}

$('#enterWithMusic')?.addEventListener('click', () => enterInvitation(true));
$('#enterWithoutMusic')?.addEventListener('click', () => enterInvitation(false));
audioToggle?.addEventListener('click', async () => {
  if (audio.paused) {
    try { await audio.play(); audioToggle.classList.add('playing'); audioToggle.setAttribute('aria-pressed', 'true'); } catch {}
  } else { audio.pause(); audioToggle.classList.remove('playing'); audioToggle.setAttribute('aria-pressed', 'false'); }
});
audio?.addEventListener('pause', () => audioToggle.classList.remove('playing'));
audio?.addEventListener('play', () => audioToggle.classList.add('playing'));

const target = new Date('2026-10-02T21:30:00-03:00').getTime();
function updateCountdown() {
  const total = Math.floor(Math.max(0, target - Date.now()) / 1000);
  const values = { days: Math.floor(total / 86400), hours: Math.floor((total % 86400) / 3600), minutes: Math.floor((total % 3600) / 60), seconds: total % 60 };
  Object.entries(values).forEach(([key, value]) => { $(`#${key}`).textContent = String(value).padStart(2, '0'); });
}
updateCountdown(); setInterval(updateCountdown, 1000);

const dateReveal = $('#dateReveal');
const canvas = $('#revealCanvas');
const context = canvas?.getContext('2d');
const trail = $('#magicTrail');
let drawing = false, complete = false, gate = false, distanceDrawn = 0, lastPoint = null;

function sizeCanvas() {
  if (!canvas || complete) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio); canvas.height = Math.round(rect.height * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const gradient = context.createLinearGradient(0, 0, 0, rect.height);
  gradient.addColorStop(0, '#020202'); gradient.addColorStop(.48, '#202020'); gradient.addColorStop(1, '#050505');
  context.fillStyle = gradient; context.fillRect(0, 0, rect.width, rect.height);
  for (let n = 0; n < 110; n += 1) { context.beginPath(); context.arc(Math.random()*rect.width, Math.random()*rect.height, Math.random()*1.4+.2, 0, Math.PI*2); context.fillStyle=`rgba(240,240,240,${Math.random()*.75})`; context.fill(); }
}
function activateGate() { if (gate || complete) return; gate = true; dateReveal.classList.add('gate-active'); document.documentElement.classList.add('reveal-locked'); sizeCanvas(); requestAnimationFrame(() => requestAnimationFrame(() => dateReveal.classList.add('gate-visible'))); }
function point(event) { const rect=canvas.getBoundingClientRect(); return {x:event.clientX-rect.left,y:event.clientY-rect.top}; }
function sparkle(at) { for(let n=0;n<3;n+=1){const star=document.createElement('span');star.className='trail-star';star.style.left=`${at.x+(Math.random()-.5)*34}px`;star.style.top=`${at.y+(Math.random()-.5)*34}px`;trail.appendChild(star);setTimeout(()=>star.remove(),900);} }
function finishReveal(){complete=true;drawing=false;dateReveal.classList.add('revealed');setTimeout(()=>{dateReveal.classList.remove('gate-active','gate-visible');canvas.remove();trail.remove();document.documentElement.classList.remove('reveal-locked');dateReveal.scrollIntoView({block:'start'});},850);}
canvas?.addEventListener('pointerdown',event=>{drawing=true;canvas.setPointerCapture(event.pointerId);lastPoint=point(event);dateReveal.classList.add('revealing');});
canvas?.addEventListener('pointermove',event=>{if(!drawing||complete)return;const next=point(event);distanceDrawn+=Math.hypot(next.x-lastPoint.x,next.y-lastPoint.y);context.globalCompositeOperation='destination-out';context.lineWidth=Math.max(58,canvas.clientWidth*.16);context.lineCap='round';context.beginPath();context.moveTo(lastPoint.x,lastPoint.y);context.lineTo(next.x,next.y);context.stroke();context.globalCompositeOperation='source-over';sparkle(next);lastPoint=next;if(distanceDrawn>=canvas.clientWidth*4.4)finishReveal();});
['pointerup','pointercancel'].forEach(name=>canvas?.addEventListener(name,()=>{drawing=false;lastPoint=null;}));
addEventListener('resize',sizeCanvas); requestAnimationFrame(sizeCanvas);
const revealObserver=new IntersectionObserver(entries=>{if(entered&&entries.some(entry=>entry.isIntersecting))activateGate();},{threshold:.18}); revealObserver.observe(dateReveal);

const musicScene=$('#musicScene');
const liveEqualizer = $('#liveEqualizer');
if (liveEqualizer) {
  for (let n = 0; n < 52; n += 1) {
    const bar = document.createElement('i');
    const centerDistance = Math.abs(n - 25.5) / 25.5;
    const envelope = 30 + (1 - centerDistance) * 58;
    bar.style.setProperty('--bar-height', `${envelope * (.45 + Math.random() * .55)}%`);
    bar.style.setProperty('--wave-speed', `${.42 + Math.random() * .72}s`);
    bar.style.setProperty('--wave-delay', `${-Math.random() * 1.2}s`);
    bar.style.setProperty('--bar-opacity', `${.48 + Math.random() * .5}`);
    liveEqualizer.appendChild(bar);
  }
}
const musicObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){musicScene.classList.add('music-active');musicObserver.disconnect();}},{threshold:.3}); musicObserver.observe(musicScene);

const fallingStarsPanel = $('#fallingStarsPanel');
const fallingStars = $('#fallingStars');
function startFallingStars() {
  if (!fallingStars || fallingStars.childElementCount) return;
  const symbols = ['✦', '✧', '⋆', '·'];
  for (let n = 0; n < 34; n += 1) {
    const star = document.createElement('i');
    star.className = 'falling-star';
    star.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    star.style.left = `${Math.random() * 100}%`;
    star.style.fontSize = `${7 + Math.random() * 15}px`;
    star.style.setProperty('--fall-duration', `${5.5 + Math.random() * 7}s`);
    star.style.setProperty('--fall-delay', `${-Math.random() * 11}s`);
    star.style.setProperty('--drift', `${-35 + Math.random() * 70}px`);
    star.style.setProperty('--star-opacity', `${.45 + Math.random() * .55}`);
    fallingStars.appendChild(star);
  }
}
const fallingObserver = new IntersectionObserver(entries => {
  if (entries.some(entry => entry.isIntersecting)) startFallingStars();
}, { threshold: .12 });
if (fallingStarsPanel) fallingObserver.observe(fallingStarsPanel);

function notify(message){toast.textContent=message;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2200);}
$('.calendar')?.addEventListener('click',()=>{
  const event=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//XV Violeta//ES','BEGIN:VEVENT','UID:xv-violeta-20261002@salon-caiuc','DTSTAMP:20260831T120000Z','DTSTART:20261003T003000Z','DTEND:20261003T073000Z','SUMMARY:XV de Violeta','LOCATION:Salón Caiuc - Av. Tristán Cornejo 224','DESCRIPTION:Fiesta de XV de Violeta.','END:VEVENT','END:VCALENDAR'].join('\r\n');
  const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([event],{type:'text/calendar;charset=utf-8'}));link.download='XV-Violeta.ics';link.click();URL.revokeObjectURL(link.href);
});
const modal=$('#locationModal');
$('.location')?.addEventListener('click',()=>modal.showModal());
$('.location-close')?.addEventListener('click',()=>modal.close());
$('.copy-address')?.addEventListener('click',async()=>{const address='Salón Caiuc, Av. Tristán Cornejo 224';try{await navigator.clipboard.writeText(address);notify('Dirección copiada');}catch{notify(address);}});
