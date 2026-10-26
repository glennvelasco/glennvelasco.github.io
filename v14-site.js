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

/* t110u: About stats count up once when scrolled into view; final values are already in the HTML. */
(function(){
  var els=[].slice.call(document.querySelectorAll('.abs .cu'));
  if(!els.length||!('IntersectionObserver' in window))return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  function fmt(el,v){var d=+el.dataset.dec;return el.dataset.pre+v.toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d})+el.dataset.suf}
  els.forEach(function(el){el.textContent=fmt(el,0)});
  function run(el){var to=+el.dataset.to,d=+el.dataset.dec,t0=null,D=1800;
    function step(t){if(t0===null)t0=t;var k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3),v=to*e;
      v=d?Math.round(v*Math.pow(10,d))/Math.pow(10,d):Math.round(v);
      el.textContent=k<1?fmt(el,v):fmt(el,to);if(k<1)requestAnimationFrame(step)}
    requestAnimationFrame(step)}
  var box=document.querySelector('.abs');
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){io.disconnect();els.forEach(run)}})},{threshold:.35});
  io.observe(box);
})();
