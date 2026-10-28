/* t264u: desktop "More exclusive listings" = first 4 cards + "See all exclusive listings" (aria-expanded) that expands in place;
   "Show fewer listings" collapses again. Phones: CSS hides the button and keeps the swipe row. 4 or fewer cards: nothing happens. */
(function(){
var s=document.querySelector('section.act'),g=s&&s.querySelector('.two');if(!g)return;
var items=[].slice.call(g.children).filter(function(x){return x.tagName==='ARTICLE'}),N=4;if(items.length<=N)return;
var rm=matchMedia('(prefers-reduced-motion:reduce)'),more=items.slice(N);
g.id=g.id||'xm-grid';
var w=document.createElement('div');w.className='xm';
w.innerHTML='<button type="button" class="xm-btn" aria-expanded="false" aria-controls="'+g.id+'"><span class="xm-ic" aria-hidden="true"></span><span class="xm-t">See all exclusive listings</span></button>';
var after=g.nextElementSibling&&g.nextElementSibling.classList.contains('mh-cnt')?g.nextElementSibling:g;
after.parentNode.insertBefore(w,after.nextSibling);
var b=w.firstChild,t=b.querySelector('.xm-t');
s.classList.add('xm-on');
function done(){g.classList.remove('xm-anim');g.style.height=''}
g.addEventListener('transitionend',function(e){if(e.target===g&&e.propertyName==='height')done()});
b.addEventListener('click',function(){
 var open=b.getAttribute('aria-expanded')!=='true',h0=g.offsetHeight;
 more.forEach(function(x){x.classList.toggle('xm-new',open);if(open)x.classList.add('in')});
 s.classList.toggle('xm-open',open);b.setAttribute('aria-expanded',open?'true':'false');
 t.textContent=open?'Show fewer listings':'See all exclusive listings';
 if(!rm.matches){var h1=g.offsetHeight;g.style.height=h0+'px';g.classList.add('xm-anim');void g.offsetHeight;g.style.height=h1+'px';setTimeout(done,600)}
 if(open){var a=more[0].querySelector('a');if(a)a.focus({preventScroll:true})}
 else{var r=b.getBoundingClientRect();if(r.top<0||r.bottom>innerHeight)b.scrollIntoView({block:'center',behavior:rm.matches?'auto':'smooth'})}
});
})();
