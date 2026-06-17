
// ── AGE GATE ──
(function(){
  const gate = document.getElementById('age-gate');
  if(!gate) return;
  if(localStorage.getItem('orbitz_age_verified')){
    gate.style.display='none';
  }
})();

function ageGateEnter(){
  localStorage.setItem('orbitz_age_verified','1');
  const gate = document.getElementById('age-gate');
  gate.classList.add('hidden');
  setTimeout(()=>gate.style.display='none', 500);
}

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

// ── AUTH (shared with /account via localStorage) ──
const ORBITZ_LS_AUTH='orbitz_acct_authed';
const ORBITZ_LS_ROUTE='orbitz_acct_route';
let welcomeTimer=null;

const orbitzAuth={
  authed(){return localStorage.getItem(ORBITZ_LS_AUTH)==='1';},
  render(){
    const a=this.authed();
    const out=document.getElementById('navAuthOut');
    const inn=document.getElementById('navAuthIn');
    if(out) out.hidden=a;
    if(inn) inn.hidden=!a;
    if(!a) this.closeMenu();
  },
  // ----- modal -----
  open(mode){
    const m=document.getElementById('authModal');
    m.hidden=false;
    this.setTab(mode||'signin');
    document.body.style.overflow='hidden';
  },
  close(){
    const m=document.getElementById('authModal');
    if(m) m.hidden=true;
    document.body.style.overflow='';
  },
  setTab(mode){
    const reg=mode==='register';
    document.getElementById('segSignin').classList.toggle('active',!reg);
    document.getElementById('segRegister').classList.toggle('active',reg);
    document.getElementById('nameField').hidden=!reg;
    document.getElementById('authTitle').textContent=reg?'Create your account':'Welcome back, explorer';
    document.getElementById('authSub').textContent=reg
      ?'Join ORBITZ for same-day delivery, live tracking, and rewards.'
      :'Sign in to track deliveries, reorder favorites, and bank your rewards.';
    document.getElementById('authSubmit').textContent=reg?'Create account →':'Sign in →';
  },
  submit(e){
    e.preventDefault();
    localStorage.setItem(ORBITZ_LS_AUTH,'1');
    this.close();
    this.render();
    this.welcome();
  },
  welcome(){
    const t=document.getElementById('welcomeToast');
    if(!t) return;
    t.hidden=false;
    requestAnimationFrame(()=>t.classList.add('show'));
    if(welcomeTimer) clearTimeout(welcomeTimer);
    welcomeTimer=setTimeout(()=>{
      t.classList.remove('show');
      setTimeout(()=>{t.hidden=true;},400);
    },4200);
  },
  // ----- account dropdown -----
  toggleMenu(){
    const dd=document.getElementById('acctDropdown');
    const btn=document.getElementById('acctBtn');
    const willOpen=dd.hidden;
    dd.hidden=!willOpen;
    btn.setAttribute('aria-expanded',willOpen?'true':'false');
  },
  closeMenu(){
    const dd=document.getElementById('acctDropdown');
    const btn=document.getElementById('acctBtn');
    if(dd) dd.hidden=true;
    if(btn) btn.setAttribute('aria-expanded','false');
  },
  goAccount(screen){
    try{localStorage.setItem(ORBITZ_LS_ROUTE,JSON.stringify([{screen,params:{}}]));}catch(e){}
    window.location.href='account/index.html';
  },
  signOut(){
    localStorage.setItem(ORBITZ_LS_AUTH,'0');
    this.closeMenu();
    this.render();
  },
};
window.orbitzAuth=orbitzAuth;
orbitzAuth.render();

// close dropdown on outside click; close modal on Escape
document.addEventListener('click',(e)=>{
  const menu=document.querySelector('.acct-menu');
  if(menu && !menu.contains(e.target)) orbitzAuth.closeMenu();
});
document.addEventListener('keydown',(e)=>{
  if(e.key==='Escape'){orbitzAuth.close();orbitzAuth.closeMenu();}
});