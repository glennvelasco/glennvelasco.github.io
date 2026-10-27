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
  var map=[['about','#about'],['listings','#listings'],['search','#search'],['valuation','#valuation'],['buyers-guide','#resources'],['resources','#resources']];
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
  function set(o){h.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');b.textContent=o?(document.documentElement.lang==='it'?'Chiudi':'Close'):'Menu'}
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

/* t166u/t167u (v14k): contact sheet. Every [data-ct] link (hero "Send a message", pinned-bar and header "Contact") opens the dialog;
   without JS (or without <dialog>) the links keep their own targets (the footer's phone and email, or a mailto).
   Esc, the Close button and a click on the backdrop close it; Tab wraps inside it; focus returns to the link that opened it.
   The form sends JSON to FormSubmit's AJAX endpoint with _subject "Website contact". */
(function(){
  var d=document.getElementById('ct-dlg');if(!d||typeof d.showModal!=='function')return;
  var ENDPOINT='https://formsubmit.co/ajax/glenn.velasco@compass.com',opener=null,root=document.documentElement;
  var f=d.querySelector('form'),thanks=d.querySelector('.ctm-thanks'),err=d.querySelector('.ctm-err'),send=f.querySelector('.ct-send'),
      opts=f.querySelector('.opts'),lk=document.getElementById(opts.getAttribute('aria-describedby')),mail=err.querySelector('a[href^="mailto:"]');
  function open(e){if(e){e.preventDefault()}opener=document.activeElement;
    if(thanks.hidden===false){thanks.hidden=true;f.hidden=false;f.reset()}
    err.hidden=true;root.classList.add('ct-lock');d.showModal();d.scrollTop=0;d.querySelector('.ctm-x').focus()}
  function close(){if(d.open)d.close()}
  d.addEventListener('close',function(){root.classList.remove('ct-lock');if(opener&&opener.focus){opener.focus()}opener=null});
  [].forEach.call(document.querySelectorAll('[data-ct]'),function(a){a.addEventListener('click',open)});
  d.querySelector('.ctm-x').addEventListener('click',close);
  d.addEventListener('click',function(e){if(e.target===d)close()});
  d.addEventListener('keydown',function(e){
    if(e.key!=='Tab')return;
    var q=[].filter.call(d.querySelectorAll('a[href],button:not([disabled]),input:not([type=hidden]):not([tabindex="-1"]),textarea,select,[tabindex="0"]'),function(el){return el.offsetParent!==null||el.getClientRects().length});
    // radios: only the checked one (or the first when none is) is in the tab order
    q=q.filter(function(el){if(el.type!=='radio')return true;var g=f.querySelectorAll('input[name="'+el.name+'"]'),c=f.querySelector('input[name="'+el.name+'"]:checked');return c?el===c:el===g[0]});
    if(!q.length)return;var a=q[0],z=q[q.length-1];
    if(e.shiftKey&&(document.activeElement===a||!d.contains(document.activeElement))){e.preventDefault();z.focus()}
    else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}
  });
  function msg(el,t){var m=document.getElementById(el.getAttribute('aria-describedby'));if(!m)return;m.textContent=t;m.hidden=!t;el.setAttribute('aria-invalid',t?'true':'false')}
  function check(){var bad=null;
    f.querySelectorAll('input[required]:not([type=radio]),textarea[required]').forEach(function(el){var v=el.value.trim(),t='';
      if(!v)t=el.getAttribute('data-req');else if(el.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))t='Enter a valid email address.';
      msg(el,t);if(t&&!bad)bad=el});
    var ok=f.querySelector('.opts input:checked');lk.textContent=ok?'':'Choose one option.';lk.hidden=!!ok;opts.setAttribute('aria-invalid',ok?'false':'true');
    if(!ok&&!bad)bad=f.querySelector('.opts input');
    if(bad)bad.focus();return !bad}
  f.querySelectorAll('input[required]:not([type=radio]),textarea[required]').forEach(function(el){el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true')msg(el,'')})});
  f.querySelectorAll('.opts input').forEach(function(r){r.addEventListener('change',function(){lk.hidden=true;opts.setAttribute('aria-invalid','false')})});
  f.setAttribute('novalidate','');
  f.addEventListener('submit',function(e){e.preventDefault();if(!check())return;
    var data={};new FormData(f).forEach(function(v,k){data[k]=v});
    var lines=['Name: '+data.name,'Email: '+data.email,'Phone: '+(data.phone||''),"I'm looking to: "+(data.looking_to||''),'','Message:',data.message];
    mail.href='mailto:glenn.velasco@compass.com?subject='+encodeURIComponent('Website contact')+'&body='+encodeURIComponent(lines.join('\n'));
    err.hidden=true;send.disabled=true;send.setAttribute('aria-busy','true');send.textContent='Sending…';
    fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {}}).then(function(j){if(!r.ok||!(j.success===true||j.success==='true'))throw new Error(j.message||('HTTP '+r.status))})})
      .then(function(){f.hidden=true;thanks.hidden=false;thanks.focus()})
      .catch(function(){err.hidden=false;err.focus()})
      .then(function(){send.disabled=false;send.removeAttribute('aria-busy');send.textContent='Send message'});
  });
})();
/* sticky overhead bar (t173u), off by default */
(function(){
var R=document.documentElement,mq=matchMedia('(max-width:640px)');
var hero=document.querySelector('.hero.h13'),mbar=document.querySelector('.mbar'),ibar=document.querySelector('.ibar');
/* sticky bar */
var bar=hero?mbar:ibar;
if(bar){
 var lastY=scrollY,up=0,tk=false,UP=10;
 function hide(h){bar.classList.toggle('mh-off',h)}
 function heroEnd(){return hero.getBoundingClientRect().bottom+scrollY}
 function tick(){tk=false;var y=Math.max(0,scrollY),dy=y-lastY;lastY=y;
  if(!mq.matches){if(hero)hide(true);else hide(false);return}
  if(R.classList.contains('mh-open')||bar.classList.contains('open')){up=0;return}
  if(hero){if(y<heroEnd()){hide(true);up=0;return}}
  else if(y<=bar.offsetHeight){hide(false);up=0;return}
  if(dy>0){up=0;hide(true)}else if(dy<0){up-=dy;if(up>=UP)hide(false)}}
 addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(tick)}},{passive:true});
 addEventListener('resize',function(){if(!tk){tk=true;requestAnimationFrame(tick)}},{passive:true});
 tick();}
})();
/* swipeable listings (t174u), off by default */
(function(){
var R=document.documentElement,mq=matchMedia('(max-width:640px)');
var hero=document.querySelector('.hero.h13'),mbar=document.querySelector('.mbar'),ibar=document.querySelector('.ibar');
/* swipeable listings: counter + progress rule */
[].forEach.call(document.querySelectorAll('.act .two,.ps .two,.cards.pf'),function(c,k){
 var items=c.children,n=items.length;if(n<2)return;
 c.classList.add('mh-car');c.setAttribute('role','region');c.setAttribute('aria-roledescription','carousel');
 var sec=c.closest('section'),h=sec&&sec.querySelector('h1,h2');c.setAttribute('aria-label',(h?h.textContent.trim():'Listings')+', swipe for more');
 var cnt=document.createElement('p');cnt.className='mh-cnt label mh-only';cnt.setAttribute('aria-hidden','true');cnt.innerHTML='<span>1 / '+n+'</span><i><b></b></i>';
 c.parentNode.insertBefore(cnt,c.nextSibling);var sp=cnt.firstChild,bar=cnt.querySelector('b');
 bar.style.setProperty('--p',(100/n)+'%');
 var t=false;function upd(){t=false;var w=items[0].getBoundingClientRect().width+parseFloat(getComputedStyle(c).columnGap||12);
  var max=c.scrollWidth-c.clientWidth,i=c.scrollLeft>=max-2?n-1:Math.round(c.scrollLeft/w);sp.textContent=(i+1)+' / '+n;bar.style.setProperty('--x',(i*100)+'%')}
 c.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});
 c.addEventListener('focusin',function(e){var a=e.target.closest('.mh-car>*');if(a&&mq.matches)a.scrollIntoView({block:'nearest',inline:'start',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
});
})();
/* t181u: phone menu panel. Burgers (.mh-menu hero, .mb-menu home bar, .ib-menu inner bar) open #mnav; X / Esc close; focus trapped, returned to the burger. */
(function(){
var R=document.documentElement,P=document.getElementById('mnav');if(!P)return;
var mq=matchMedia('(max-width:640px)'),rm=matchMedia('(prefers-reduced-motion:reduce)'),X=P.querySelector('.mn-x'),opener=null,tm=0;
var burgers=[].slice.call(document.querySelectorAll('.mh-menu,.mb-menu,.ib-menu'));
function ex(o){burgers.forEach(function(b){b.setAttribute('aria-expanded',o?'true':'false')})}
function open(b){clearTimeout(tm);opener=b;var r=b.getBoundingClientRect();
 P.style.setProperty('--xt',Math.max(0,r.top)+'px');P.style.setProperty('--xr',Math.max(0,innerWidth-r.right)+'px');
 P.hidden=false;R.classList.add('mh-open');ex(true);P.scrollTop=0;X.focus({preventScroll:true});
 if(rm.matches)P.classList.add('on');else requestAnimationFrame(function(){requestAnimationFrame(function(){P.classList.add('on')})})}
function close(back){if(P.hidden)return;P.classList.remove('on');R.classList.remove('mh-open');ex(false);
 if(rm.matches)P.hidden=true;else tm=setTimeout(function(){P.hidden=true},200);
 if(back&&opener)opener.focus({preventScroll:true});opener=null}
burgers.forEach(function(b){b.setAttribute('aria-label',document.documentElement.lang==='it'?'Apri menu':'Open menu');b.setAttribute('aria-controls','mnav');b.setAttribute('aria-haspopup','dialog');
 b.addEventListener('click',function(e){if(!mq.matches)return;e.preventDefault();e.stopImmediatePropagation();open(b)},true)});
X.addEventListener('click',function(){close(true)});
document.addEventListener('keydown',function(e){if(P.hidden)return;
 if(e.key==='Escape'){e.preventDefault();close(true);return}
 if(e.key==='Tab'){var f=[].filter.call(P.querySelectorAll('a[href],button'),function(n){return n.getClientRects().length});if(!f.length)return;
  var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
[].forEach.call(P.querySelectorAll('.mn-tg'),function(t){var s=document.getElementById(t.getAttribute('aria-controls'));
 t.addEventListener('click',function(){var o=t.getAttribute('aria-expanded')!=='true';t.setAttribute('aria-expanded',o?'true':'false');s.hidden=!o})});
P.addEventListener('click',function(e){var a=e.target.closest('a');if(a)close(false)});
(mq.addEventListener?mq.addEventListener('change',function(){close(false)}):0);
})();
