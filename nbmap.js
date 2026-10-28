/* Home Search Homes map: click/tap a neighborhood to set the quick-search Neighborhood field (sx.js builds the Compass URL). */
(function(){var D=window.NBMAP,fig=document.getElementById('sxm'),f=document.getElementById('sxf');if(!D||!fig||!f)return;
var ar=f.querySelector('#sx-a'),NS='http://www.w3.org/2000/svg',rd=fig.querySelector('.sxm-r'),wrap=fig.querySelector('.sxm-c');
var tabs=[].slice.call(fig.querySelectorAll('.sxm-t button'));
function el(t,a){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);return e}
var svg=el('svg',{'class':'sxm-s','aria-hidden':'true',focusable:'false',preserveAspectRatio:'xMidYMid meet'});
svg.appendChild(el('path',{d:D.ctx,'class':'sxm-x'}));
svg.appendChild(el('path',{d:D.park,'class':'sxm-p'}));
var g=el('g',{'class':'sxm-g'}),by={};svg.appendChild(g);
D.f.forEach(function(o){var p=el('path',{d:o.d,'class':'sxm-n'});p._o=o;(by[o.s]=by[o.s]||[]).push(p);g.appendChild(p)});
by['nolita-manhattan-ny']=by['soho-manhattan-ny'];   /* no NTA of its own: Nolita sits inside SoHo-Little Italy */
wrap.appendChild(svg);fig.classList.add('on');
function boro(s){return /brooklyn-ny$/.test(s)?'B':/(manhattan|queens)-ny$/.test(s)?'M':null}
var cur=null,anim=0,red=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Manhattan framed from the top of Morningside Heights (y 524) down to the Battery: square box on phones, 4:5 box on desktop. Brooklyn keeps D.v.B. */
var mq=window.matchMedia&&matchMedia('(max-width:640px)'),MP=[722,524,508,508],MD=[772,524,406,508];
function vb(v){return v==='M'?(mq&&mq.matches?MP:MD):D.v[v]}
function view(v,now){tabs.forEach(function(t){t.setAttribute('aria-pressed',t.dataset.v===v?'true':'false')});
 if(cur===v)return;var to=vb(v),from=cur&&svg.getAttribute('viewBox');cur=v;cancelAnimationFrame(anim);
 if(!from||now||red){svg.setAttribute('viewBox',to.join(' '));return}
 var a=from.split(' ').map(Number),t0=performance.now();
 (function st(t){var k=Math.min(1,(t-t0)/380);k=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  svg.setAttribute('viewBox',a.map(function(x,i){return x+(to[i]-x)*k}).join(' '));if(k<1)anim=requestAnimationFrame(st)})(t0)}
function mark(cls,s){[].forEach.call(g.querySelectorAll('.'+cls),function(p){p.classList.remove(cls)});
 (by[s]||[]).forEach(function(p){p.classList.add(cls);if(cls==='on')g.appendChild(p)})}
function name(s){var o=ar.querySelector('option[value="'+s+'"]');return o?o.textContent:''}
function say(){var s=ar.value,n=name(s);
 rd.innerHTML=/^(new-york|manhattan|brooklyn|queens)-ny$/.test(s)?'<span>Pick a neighborhood on the map, or use the list</span>':'<b></b><span></span>';
 if(rd.firstChild.tagName==='B'){rd.firstChild.textContent=n;rd.lastChild.textContent=s==='nolita-manhattan-ny'?' · shown within SoHo–Little Italy':s==='central-park-south-manhattan-ny'?' · not drawn on the map':' · selected'}}
function sync(){var s=ar.value;mark('on',s);var b=boro(s);if(b)view(b);say()}
function pick(o){if(!ar.querySelector('option[value="'+o.s+'"]')){var gp=ar.querySelector('optgroup[data-more]');
  if(!gp){gp=document.createElement('optgroup');gp.label='More on the map';gp.setAttribute('data-more','');ar.appendChild(gp)}
  var op=document.createElement('option');op.value=o.s;op.textContent=o.l;gp.appendChild(op)}
 ar.value=o.s;ar.dispatchEvent(new Event('change',{bubbles:true}))}
g.addEventListener('pointerover',function(e){var o=e.target._o;if(!o)return;mark('hv',o.s);
 rd.innerHTML='<b></b><span></span>';rd.firstChild.textContent=o.l;rd.lastChild.textContent=o.l.replace(/’/g,"'").indexOf(o.nta.split('-')[0].replace(/’/g,"'"))<0?' · '+o.nta:''});
g.addEventListener('pointerout',function(e){if(!e.relatedTarget||!e.relatedTarget._o){mark('hv','');say()}});
g.addEventListener('click',function(e){var o=e.target._o;if(o)pick(o)});
tabs.forEach(function(t){t.addEventListener('click',function(){var v=t.dataset.v;view(v);
 if(boro(ar.value)!==v||ar.value==='queens-ny'){ar.value=v==='B'?'brooklyn-ny':'manhattan-ny';sync()}})});
ar.addEventListener('change',sync);
view(boro(ar.value)==='B'?'B':'M',true);sync();
if(mq){var re=function(){if(cur)svg.setAttribute('viewBox',vb(cur).join(' '))};mq.addEventListener?mq.addEventListener('change',re):mq.addListener(re)}
})();
