/* Home Search Homes map: click/tap neighborhoods to add or remove them from the quick search (sx.js builds the Compass URL). */
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
/* t242u mockup: pick several neighborhoods. Each tap toggles one; Compass takes the first as the page and the rest as locations=<ids> (ids read from Compass's own search, 2026-10-28). */
var ID={"bath-beach-brooklyn-ny":21450,"bay-ridge-brooklyn-ny":21554,"bedford-stuyvesant-brooklyn-ny":21478,"bensonhurst-brooklyn-ny":21528,"borough-park-brooklyn-ny":21488,"brighton-beach-brooklyn-ny":21541,"brooklyn-heights-brooklyn-ny":21452,"brownsville-brooklyn-ny":21496,"bushwick-brooklyn-ny":21522,"canarsie-brooklyn-ny":21442,"central-harlem-manhattan-ny":161868,"central-park-south-manhattan-ny":21527,"chelsea-manhattan-ny":21509,"chinatown-manhattan-ny":21474,"clinton-hill-brooklyn-ny":21499,"cobble-hill-brooklyn-ny":21446,"coney-island-brooklyn-ny":21487,"crown-heights-brooklyn-ny":21532,"ditmas-park-brooklyn-ny":21524,"downtown-brooklyn-brooklyn-ny":21435,"dyker-heights-brooklyn-ny":21479,"east-flatbush-brooklyn-ny":21471,"east-harlem-manhattan-ny":21454,"east-new-york-brooklyn-ny":21505,"east-village-manhattan-ny":21533,"east-williamsburg-brooklyn-ny":162029,"financial-district-manhattan-ny":21558,"flatbush-brooklyn-ny":21530,"flatlands-brooklyn-ny":21546,"fort-greene-brooklyn-ny":21556,"gramercy-manhattan-ny":21485,"gravesend-brooklyn-ny":21484,"greenpoint-brooklyn-ny":21437,"greenwich-village-manhattan-ny":21469,"hamilton-heights-manhattan-ny":21448,"hells-kitchen-manhattan-ny":21480,"inwood-manhattan-ny":21513,"kensington-brooklyn-ny":21518,"long-island-city-queens-ny":21508,"lower-east-side-manhattan-ny":21462,"manhattanville-manhattan-ny":162025,"marine-park-brooklyn-ny":21449,"midtown-east-manhattan-ny":21547,"midtown-south-manhattan-ny":21466,"midwood-brooklyn-ny":21551,"morningside-heights-manhattan-ny":21519,"murray-hill-manhattan-ny":21552,"nolita-manhattan-ny":21483,"ocean-hill-brooklyn-ny":368300,"park-slope-brooklyn-ny":21455,"peter-cooper-village-manhattan-ny":161910,"prospect-heights-brooklyn-ny":21489,"prospect-lefferts-gardens-brooklyn-ny":21516,"roosevelt-island-manhattan-ny":21539,"sheepshead-bay-brooklyn-ny":21545,"soho-manhattan-ny":21491,"sunset-park-brooklyn-ny":21526,"theater-district-manhattan-ny":301085,"tribeca-manhattan-ny":21537,"upper-east-side-manhattan-ny":21443,"upper-west-side-manhattan-ny":21523,"washington-heights-manhattan-ny":21550,"west-village-manhattan-ny":21468,"williamsburg-brooklyn-ny":21473,"windsor-terrace-brooklyn-ny":21482};
var P=[],scope=ar.value,box=ar.parentNode,mo=document.createElement('option');
mo.value='__multi';mo.disabled=true;mo.hidden=true;ar.insertBefore(mo,ar.firstChild);
var pw=document.createElement('div');pw.className='sxf-p';pw.hidden=true;
pw.innerHTML='<ul class="sxf-c" aria-label="Chosen neighborhoods"></ul><button type="button" class="sxf-x">Clear neighborhoods</button>';
box.appendChild(pw);var ul=pw.firstChild,clr=pw.lastChild;
function area(s){return !!s&&!/^(new-york|manhattan|brooklyn|queens)-ny$/.test(s)&&s!=='__multi'}
function mark(cls,list){[].forEach.call(g.querySelectorAll('.'+cls),function(p){p.classList.remove(cls)});
 list.forEach(function(s){(by[s]||[]).forEach(function(p){p.classList.add(cls);if(cls==='on')g.appendChild(p)})})}
function name(s){var o=ar.querySelector('option[value="'+s+'"]');return o?o.textContent:''}
function opt(o){if(!ar.querySelector('option[value="'+o.s+'"]')){var gp=ar.querySelector('optgroup[data-more]');
  if(!gp){gp=document.createElement('optgroup');gp.label='More on the map';gp.setAttribute('data-more','');ar.appendChild(gp)}
  var op=document.createElement('option');op.value=o.s;op.textContent=o.l;gp.appendChild(op)}}
function say(){var n=P.length;
 if(!n){rd.innerHTML='<span>Pick one or more neighborhoods on the map, or use the list</span>';return}
 rd.innerHTML='<b></b><span></span>';
 if(n>1){rd.firstChild.textContent=n+' neighborhoods';rd.lastChild.textContent=' · selected';return}
 var s=P[0];rd.firstChild.textContent=name(s);rd.lastChild.textContent=s==='nolita-manhattan-ny'?' · shown within SoHo–Little Italy':s==='central-park-south-manhattan-ny'?' · not drawn on the map':' · selected'}
function render(){mark('on',P);var n=P.length;
 if(!n)ar.value=scope;else if(n===1)ar.value=P[0];else{mo.textContent=name(P[0])+' + '+(n-1)+' more';mo.selected=true}
 ul.innerHTML='';P.forEach(function(s){var li=document.createElement('li'),b=document.createElement('button');
  b.type='button';b.dataset.s=s;b.setAttribute('aria-label','Remove '+name(s));b.innerHTML='<span></span><i aria-hidden="true">×</i>';b.firstChild.textContent=name(s);li.appendChild(b);ul.appendChild(li)});
 pw.hidden=!n;say()}
function toggle(o){var s=o.s,i=P.indexOf(s),nl=P.indexOf('nolita-manhattan-ny');
 if(s==='soho-manhattan-ny'&&i<0&&nl>-1)P.splice(nl,1);else if(i>-1)P.splice(i,1);else{opt(o);P.push(s)}render()}
g.addEventListener('pointerover',function(e){var o=e.target._o;if(!o)return;mark('hv',[o.s]);
 rd.innerHTML='<b></b><span></span>';rd.firstChild.textContent=o.l;rd.lastChild.textContent=o.l.replace(/’/g,"'").indexOf(o.nta.split('-')[0].replace(/’/g,"'"))<0?' · '+o.nta:''});
g.addEventListener('pointerout',function(e){if(!e.relatedTarget||!e.relatedTarget._o){mark('hv',[]);say()}});
g.addEventListener('click',function(e){var o=e.target._o;if(o)toggle(o)});
tabs.forEach(function(t){t.addEventListener('click',function(){var v=t.dataset.v;view(v);
 if(!P.length&&(boro(scope)!==v||scope==='queens-ny')){scope=v==='B'?'brooklyn-ny':'manhattan-ny';render()}})});
ar.addEventListener('change',function(){var v=ar.value;if(v==='__multi')return;
 if(area(v)){if(P.indexOf(v)<0)P.push(v);var b=boro(v);if(b)view(b)}else{P=[];scope=v;view(boro(v)==='B'?'B':'M')}render()});
ul.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var i=P.indexOf(b.dataset.s);if(i<0)return;P.splice(i,1);render();
 var nx=ul.querySelectorAll('button')[Math.min(i,P.length-1)];(nx||ar).focus()});
clr.addEventListener('click',function(){P=[];render();ar.focus();rd.innerHTML='<span>Neighborhoods cleared. Pick one or more on the map, or use the list</span>'});
f.sxPath=function(){if(!P.length)return null;var r=P.slice(1).map(function(s){return ID[s]}).filter(Boolean);return P[0]+'/'+(r.length?'locations='+r.join(',')+'/':'')};
if(area(ar.value))P=[ar.value];else scope=ar.value;
view(boro(ar.value)==='B'?'B':'M',true);render();
if(mq){var re=function(){if(cur)svg.setAttribute('viewBox',vb(cur).join(' '))};mq.addEventListener?mq.addEventListener('change',re):mq.addListener(re)}
})();
