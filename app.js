// ── STARS ──
(function(){
  const c=document.getElementById('stars');
  const ctx=c.getContext('2d');
  let W,H,stars=[];
  function resize(){W=c.width=window.innerWidth;H=c.height=window.innerHeight;init()}
  function init(){
    stars=[];
    const n=Math.floor((W*H)/6000);
    for(let i=0;i<n;i++){
      stars.push({
        x:Math.random()*W,y:Math.random()*H,
        r:Math.random()*1.2+.2,
        a:Math.random(),
        speed:Math.random()*.4+.1,
        phase:Math.random()*Math.PI*2
      })
    }
  }
  let t=0;
  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=.008;
    stars.forEach(s=>{
      const alpha=s.a*(.5+.5*Math.sin(t*s.speed+s.phase));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',resize);
  resize();draw();
})();

// ── NAV ──
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.style.background=window.scrollY>40?'rgba(8,8,14,.92)':'rgba(8,8,14,.75)';
});
let navOpen=false;
function toggleNav(){
  navOpen=!navOpen;
  document.getElementById('navLinks').classList.toggle('open',navOpen);
}
document.querySelectorAll('#navLinks a').forEach(a=>{
  a.addEventListener('click',()=>{navOpen=false;document.getElementById('navLinks').classList.remove('open')});
});
window.addEventListener('resize',()=>{
  if(window.innerWidth>=900){navOpen=false;document.getElementById('navLinks').classList.remove('open')}
});

// ── PILLS ──
document.querySelectorAll('.pill').forEach(p=>{
  p.addEventListener('click',function(){
    document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── ADD TO CART ──
let cartN=2;
document.querySelectorAll('.pcard-add').forEach(btn=>{
  btn.addEventListener('click',function(e){
    e.stopPropagation();
    this.textContent='✓';
    this.style.background='linear-gradient(135deg,#22c55e,#4ade80)';
    cartN++;
    document.getElementById('cartCount').textContent=cartN;
    setTimeout(()=>{
      this.textContent='+';
      this.style.background='linear-gradient(135deg,#9B47F0,var(--p))';
    },1200);
  });
});

// ── SCROLL REVEAL ──
const ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>ro.observe(el));