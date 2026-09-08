/* ── LOADING SCREEN ── */
window.addEventListener('load',function(){
  var bar=document.getElementById('loaderBar');
  var w=0;
  var interval=setInterval(function(){
    w+=Math.random()*15+5;
    if(w>=100){w=100;clearInterval(interval);setTimeout(function(){document.getElementById('loader').classList.add('hidden')},400)}
    bar.style.width=w+'%';
  },150);
});

/* ── SCROLL BACK TO TOP ── */
window.addEventListener('scroll',function(){
  var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
  var btt=document.getElementById('backToTop');
  if(scrollTop>500){btt.classList.add('visible')}else{btt.classList.remove('visible')}
});

/* ── THEME ── */
function toggleTheme(){
  var h=document.documentElement;
  h.setAttribute('data-theme',h.getAttribute('data-theme')==='dark'?'light':'dark');
  showToast('Theme switched to '+(h.getAttribute('data-theme')==='dark'?'Dark':'Light'));
}

/* ── TOAST ── */
function showToast(msg){
  var container=document.getElementById('toastContainer');
  var toast=document.createElement('div');
  toast.className='toast';
  toast.innerHTML='<i class="fa fa-check-circle"></i><span>'+msg+'</span>';
  container.appendChild(toast);
  setTimeout(function(){toast.remove()},3000);
}

/* ── COPY TO CLIPBOARD ── */
function copyToClipboard(el){
  var text=el.innerText.replace('Click to copy','').trim();
  navigator.clipboard.writeText(text).then(function(){showToast('Copied to clipboard!')});
}

/* ── MODAL ── */
function openTutorial(title,content){
  document.getElementById('modalTitle').textContent=title;
  document.getElementById('modalBody').innerHTML=content;
  document.getElementById('modalOverlay').classList.add('active');
  document.body.style.overflow='hidden';
}
function closeModal(e){
  if(!e||e.target.id==='modalOverlay'){
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow='';
  }
}
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});

/* ── HERO CANVAS (Matrix Rain) ── */
(function(){
  var c=document.getElementById('heroCanvas');
  if(!c)return;
  var ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight}
  resize();
  window.addEventListener('resize',resize);
  var chars='01アカサタナハマヤラワ>_#$%&'.split('');
  var cols=Math.floor(c.width/14);
  var drops=Array.from({length:cols},function(){return Math.random()*-50|0});
  function draw(){
    ctx.fillStyle='rgba(5,7,9,0.12)';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.font='12px monospace';
    drops.forEach(function(y,i){
      ctx.fillStyle=i%7===0?'rgba(0,255,136,0.9)':'rgba(0,255,136,0.35)';
      ctx.fillText(chars[Math.random()*chars.length|0],i*14,y*14);
      if(y*14>c.height&&Math.random()>.97)drops[i]=0;
      drops[i]++;
    });
  }
  setInterval(draw,55);
})();

/* ── PARTICLE CANVAS ── */
(function(){
  var c=document.getElementById('particleCanvas');
  if(!c)return;
  var ctx=c.getContext('2d');
  function resize(){c.width=c.offsetWidth;c.height=c.offsetHeight}
  resize();
  window.addEventListener('resize',resize);
  var particles=[];
  for(var i=0;i<50;i++){
    particles.push({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*2+1,dx:(Math.random()-.5)*.5,dy:(Math.random()-.5)*.5});
  }
  function draw(){
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(function(p){
      p.x+=p.dx;p.y+=p.dy;
      if(p.x<0||p.x>c.width)p.dx*=-1;
      if(p.y<0||p.y>c.height)p.dy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle='rgba(0,255,136,'+(Math.random()*.3+.1)+')';
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ── TYPEWRITER ── */
(function(){
  var el=document.getElementById('typedCmd');
  if(!el)return;
  var phrases=['apt list --installed','pkg install nmap','./metasploit.rb','hydra -l root -P pass.txt','nmap -sV target'];
  var pi=0,ci=0,deleting=false;
  function type(){
    var phrase=phrases[pi];
    if(!deleting){
      el.textContent=phrase.slice(0,ci+1);
      ci++;
      if(ci===phrase.length){deleting=true;setTimeout(type,1800);return}
    } else {
      el.textContent=phrase.slice(0,ci-1);
      ci--;
      if(ci===0){deleting=false;pi=(pi+1)%phrases.length}
    }
    setTimeout(type,deleting?45:90);
  }
  type();
})();

/* ── FILTER BY CATEGORY ── */
var catColors={
  exploit:'#ff4444',network:'#00aaff',phishing:'#b060ff',
  osint:'#00ff88',recon:'#f5c518',password:'#ff7f50',
  system:'#38bdf8',style:'#e879f9',distro:'#fb923c',emulator:'#34d399',all:'#00ff88'
};

function filterCat(cat,clickedEl){
  document.querySelectorAll('.cs-btn').forEach(function(b){b.classList.remove('act')});
  document.querySelectorAll('.ftab').forEach(function(b){b.classList.remove('act');b.style.background='';b.style.color='';b.style.borderColor=''});
  document.querySelectorAll('.cat-list-item').forEach(function(b){b.style.background=''});

  if(clickedEl){
    clickedEl.classList.add('act');
    if(clickedEl.classList.contains('ftab')){
      var c=catColors[cat]||'#00ff88';
      clickedEl.style.background=c;
      clickedEl.style.color='#000';
      clickedEl.style.borderColor=c;
    }
  }

  var allCards=document.querySelectorAll('[data-cat]');
  var anyVisible=false;

  allCards.forEach(function(card){
    if(cat==='all'||card.getAttribute('data-cat')===cat){
      card.style.display='';
      anyVisible=true;
    } else {
      card.style.display='none';
    }
  });

  document.querySelectorAll('.cat-section-hd').forEach(function(hd){
    var sec=hd.getAttribute('data-section');
    if(cat==='all'||cat===sec){hd.style.display=''}
    else{hd.style.display='none'}
  });

  document.querySelectorAll('.info-box,.warn-box').forEach(function(b){
    b.style.display=(cat==='all'||cat==='phishing')?'':'none';
  });

  var featGrid=document.querySelector('.tools-grid-2');
  if(featGrid){featGrid.style.display=(cat==='all')?'':'none'}
  var featHd=document.querySelector('.sh');
  if(featHd){featHd.style.display=(cat==='all')?'':'none'}

  document.getElementById('noResults').style.display=anyVisible?'none':'block';
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ── LIVE SEARCH ── */
function liveSearch(q){
  q=q.toLowerCase().trim();
  var allCards=document.querySelectorAll('[data-cat]');
  var anyVisible=false;

  allCards.forEach(function(card){
    var name=(card.getAttribute('data-name')||'').toLowerCase();
    var desc=(card.querySelector('.tc-desc')||card.querySelector('.tcf-desc')||{innerText:''}).innerText.toLowerCase();
    var match=!q||name.includes(q)||desc.includes(q);
    card.style.display=match?'':'none';
    if(match)anyVisible=true;
  });

  document.querySelectorAll('.cat-section-hd,.tools-grid-2,.sh,.info-box,.warn-box').forEach(function(el){
    el.style.display=q?'none':'';
  });

  document.getElementById('noResults').style.display=anyVisible?'none':'block';
}

document.getElementById('heroSearch').addEventListener('input',function(){
  liveSearch(this.value);
});

/* ── CAT STRIP CLICK ── */
document.querySelectorAll('.cs-btn').forEach(function(btn){
  btn.addEventListener('click',function(){
    document.querySelectorAll('.cs-btn').forEach(function(b){b.classList.remove('act')});
    this.classList.add('act');
  });
});

/* ── SPOTLIGHT EFFECT ON CARDS ── */
document.querySelectorAll('.tool-card,.tool-card-feat').forEach(function(card){
  card.addEventListener('mousemove',function(e){
    var rect=card.getBoundingClientRect();
    var x=((e.clientX-rect.left)/rect.width)*100;
    var y=((e.clientY-rect.top)/rect.height)*100;
    card.style.setProperty('--mouse-x',x+'%');
    card.style.setProperty('--mouse-y',y+'%');
  });
});

/* ── REVEAL ON SCROLL ── */
(function(){
  var reveals=document.querySelectorAll('.reveal');
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('active')}});
  },{threshold:.1});
  reveals.forEach(function(el){observer.observe(el)});
})();

/* ── ANIMATED COUNTERS ── */
(function(){
  var counters=document.querySelectorAll('.counter');
  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var el=entry.target;
        var target=parseInt(el.getAttribute('data-target'));
        var suffix=el.textContent.replace(/[0-9]/g,'');
        var current=0;
        var increment=target/40;
        var timer=setInterval(function(){
          current+=increment;
          if(current>=target){el.textContent=target+suffix;clearInterval(timer)}
          else{el.textContent=Math.floor(current)+suffix}
        },30);
        observer.unobserve(el);
      }
    });
  },{threshold:.5});
  counters.forEach(function(c){observer.observe(c)});
})();

/* ── CURRENT DATE ── */
(function(){
  var days=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var months=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  var d=new Date();
  var str=days[d.getDay()]+' · '+d.getDate()+' '+months[d.getMonth()]+' '+d.getFullYear();
  document.getElementById('tbDate').textContent=str;
})();
