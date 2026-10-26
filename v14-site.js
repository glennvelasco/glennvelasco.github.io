/* Resources dropdown: hover/focus on desktop (CSS), tap to open on touch, Esc to close; keeps aria-expanded true to state. */
(function(){
  var L=[].slice.call(document.querySelectorAll('a.res'));if(!L.length)return;
  var touch=matchMedia('(hover:none)');
  L.forEach(function(a){
    var p=document.getElementById(a.getAttribute('aria-controls')),box=a.parentNode.classList.contains('dd')?a.parentNode:null,t;
    function set(o){a.setAttribute('aria-expanded',o?'true':'false')}
    function on(){clearTimeout(t);set(true)} function off(){t=setTimeout(function(){set(false)},120)}
    [a,p,box].forEach(function(el){if(!el)return;el.addEventListener('mouseenter',function(){if(!touch.matches)on()});el.addEventListener('mouseleave',function(){if(!touch.matches)off()})});
    a.addEventListener('click',function(e){if(touch.matches&&a.getAttribute('aria-expanded')!=='true'){e.preventDefault();set(true)}});
    [a,p].forEach(function(el){el.addEventListener('focusin',on);el.addEventListener('focusout',function(e){if(!(box||p).contains(e.relatedTarget)&&e.relatedTarget!==a)off()})});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&a.getAttribute('aria-expanded')==='true'){set(false);a.focus();clearTimeout(t);set(false)}});
    document.addEventListener('click',function(e){if(e.target!==a&&!a.contains(e.target)&&!p.contains(e.target))set(false)});
  });
})();
/* Sticky nav band (home, >=641px): show the fixed copy once the hero nav row would scroll past the top. */
(function(){
  var bar=document.querySelector('.sbar'),src=document.querySelector('.hero nav a');if(!bar||!src)return;
  var mq=matchMedia('(min-width:641px)'),de=document.documentElement,on=false,links=bar.querySelectorAll('nav>a,nav>.dd>a');
  function fit(){var cs=getComputedStyle(src);links.forEach(function(a){a.style.fontSize=cs.fontSize;a.style.letterSpacing=cs.letterSpacing;a.style.fontWeight=cs.fontWeight;a.style.fontFamily=cs.fontFamily;a.style.textTransform=cs.textTransform});
    de.style.setProperty('--sbh',bar.offsetHeight+'px');de.classList.toggle('has-sbar',mq.matches)}
  function tick(){var show=mq.matches&&src.getBoundingClientRect().bottom<=bar.offsetHeight;if(show!==on){on=show;bar.classList.toggle('on',on);if(on)bar.removeAttribute('inert');else bar.setAttribute('inert','')}}
  bar.setAttribute('inert','');fit();tick();
  addEventListener('scroll',function(){requestAnimationFrame(tick)},{passive:true});
  addEventListener('resize',function(){fit();tick()});
})();

/* t110u/t153u: About stats count up when scrolled into view, and again each time the block comes back after being fully off screen
   (a partial scroll does not retrigger it; never while a count is running). Final values are already in the HTML; reduced motion = static. */
(function(){
  var els=[].slice.call(document.querySelectorAll('.abs .cu'));
  if(!els.length||!('IntersectionObserver' in window))return;
  var mq=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)');
  if(mq&&mq.matches)return;
  function fmt(el,v){var d=+el.dataset.dec;return el.dataset.pre+v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+el.dataset.suf}
  els.forEach(function(el){el.textContent=fmt(el,0)});
  var busy=0,away=true;
  function run(el){var to=+el.dataset.to,d=+el.dataset.dec,t0=null,D=1800;busy++;el.textContent=fmt(el,0);
    function step(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3),v=to*e;
      v=d?Math.round(v*Math.pow(10,d))/Math.pow(10,d):Math.round(v);
      el.textContent=k<1?fmt(el,v):fmt(el,to);if(k<1)requestAnimationFrame(step);else busy--}
    requestAnimationFrame(step)}
  var box=document.querySelector('.abs');
  var io=new IntersectionObserver(function(es){es.forEach(function(en){
    if(!en.isIntersecting){away=true;return}
    if(en.intersectionRatio>=.34){var go=away&&!busy;away=false;if(!go)return;if(mq&&mq.matches){els.forEach(function(el){el.textContent=fmt(el,+el.dataset.to)});return}els.forEach(run)}
  })},{threshold:[0,.35]});
  io.observe(box);
})();

/* t131u: home scroll highlight. The home menu row (hero row and its pinned copy) underlines the section crossing the upper third of the viewport.
   Nothing on the hero; the Buyer's Guide preview and Resources both light Resources. No animation; the bar is desktop-only (>=641px). */
(function(){
  var bar=document.querySelector('.sbar');if(!bar||!('IntersectionObserver' in window))return;
  var map=[['about','#about'],['listings','#listings'],['neighborhoods','#neighborhoods'],['valuation','#valuation'],['buyers-guide','#resources'],['resources','#resources']];
  var secs=[],cur=null;
  map.forEach(function(m){var s=document.getElementById(m[0]),a=[].slice.call(document.querySelectorAll('.sbar nav a[href="'+m[1]+'"],.hero nav a[href="'+m[1]+'"]'));if(s&&a.length)secs.push({s:s,a:a})});
  if(!secs.length)return;
  function pick(){
    var line=innerHeight/3,hit=null;
    for(var i=0;i<secs.length;i++){if(secs[i].s.getBoundingClientRect().top<=line)hit=secs[i].a}
    if(hit===cur)return;
    if(cur)cur.forEach(function(a){a.removeAttribute('aria-current')});
    if(hit)hit.forEach(function(a){a.setAttribute('aria-current','location')});
    cur=hit;
  }
  var io=new IntersectionObserver(pick,{rootMargin:'-33% 0px -66% 0px',threshold:0});
  secs.forEach(function(x){io.observe(x.s)});
  addEventListener('resize',pick);pick();
})();
/* t156u: inner-page header menu (phones). Without JS the links simply show under the logo. */
(function(){
  var h=document.querySelector('.ibar'),b=h&&h.querySelector('.ib-menu');if(!b)return;
  h.classList.add('ib-js');
  function set(o){h.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');b.textContent=o?'Close':'Menu'}
  b.addEventListener('click',function(){set(!h.classList.contains('open'))});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&h.classList.contains('open')){set(false);b.focus()}});
  var mq=matchMedia('(min-width:641px)');(mq.addEventListener?mq.addEventListener('change',function(){set(false)}):mq.addListener(function(){set(false)}));
})();
/* t155u: FAQ rows. Desktop (real hover): resting on a row for a moment opens it with a short drop-down; rows opened by hover close together when the
   pointer leaves the list, so nothing above the pointer collapses and the rows never jump under it. Click, tap, Enter or Space toggle a row and keep it.
   Reduced motion: no animation. */
(function(){
  var lists=[].slice.call(document.querySelectorAll('.faq'));if(!lists.length)return;
  var hov=matchMedia('(hover:hover) and (pointer:fine)'),rm=matchMedia('(prefers-reduced-motion: reduce)'),D=240;
  function anim(d,open){
    var s=d.querySelector('summary');if(d._a){d._a.cancel();d._a=null}
    if(open===d.open&&!d._closing)return;
    if(rm.matches||!d.animate){d.open=open;d._closing=false;return}
    var from=d.getBoundingClientRect().height;
    if(open){d.open=true;d._closing=false}
    var to=open?d.getBoundingClientRect().height:s.getBoundingClientRect().height+parseFloat(getComputedStyle(d).borderBottomWidth||0);
    d._closing=!open;
    var a=d.animate([{height:from+'px'},{height:to+'px'}],{duration:D,easing:'cubic-bezier(.2,.7,.2,1)'});d._a=a;
    a.onfinish=function(){d._a=null;if(!open){d.open=false;d._closing=false}};
  }
  lists.forEach(function(L){
    var items=[].slice.call(L.querySelectorAll('details'));
    items.forEach(function(d){
      var s=d.querySelector('summary'),t=null;
      s.addEventListener('click',function(e){e.preventDefault();clearTimeout(t);
        var isOpen=d.open&&!d._closing;
        if(isOpen&&d._hover){d._hover=false;d._pin=true;return}   /* opened by hover: a click keeps it open */
        d._hover=false;d._pin=!isOpen;anim(d,!isOpen)});
      d.addEventListener('mouseenter',function(){if(!hov.matches)return;clearTimeout(t);
        t=setTimeout(function(){if(!(d.open&&!d._closing)){d._hover=true;anim(d,true)}},110)});
      d.addEventListener('mouseleave',function(){clearTimeout(t)});
    });
    L.addEventListener('mouseleave',function(){if(!hov.matches)return;
      items.forEach(function(d){if(d._hover&&!d._pin){d._hover=false;anim(d,false)}})});
  });
})();
