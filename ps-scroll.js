/* t244u: desktop Past sales scroll row. Runs after v14-site.js has made .ps .two a .mh-car. Phones: nothing changes. */
(function(){
var c=document.querySelector('.ps .two.mh-car');if(!c)return;
var mq=matchMedia('(min-width:641px)'),rm=matchMedia('(prefers-reduced-motion:reduce)');
var items=[].slice.call(c.children),n=items.length,phoneLabel=c.getAttribute('aria-label');
c.id=c.id||'ps-row';
var ar='<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M%s" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>';
var nav=document.createElement('div');nav.className='ps-nav';
nav.innerHTML='<p class="ps-ctr label"><span></span><i aria-hidden="true"><b></b></i></p><div class="ps-btns">'+
 '<button type="button" class="ps-prev" aria-controls="'+c.id+'" aria-label="Previous past sales">'+ar.replace('%s','11 4 6 9l5 5')+'</button>'+
 '<button type="button" class="ps-next" aria-controls="'+c.id+'" aria-label="Next past sales">'+ar.replace('%s','7 4l5 5-5 5')+'</button></div>';
var cnt=c.nextElementSibling&&c.nextElementSibling.classList.contains('mh-cnt')?c.nextElementSibling:c;
cnt.parentNode.insertBefore(nav,cnt.nextSibling);
var sp=nav.querySelector('span'),bar=nav.querySelector('b'),pv=nav.querySelector('.ps-prev'),nx=nav.querySelector('.ps-next');
function gap(){return parseFloat(getComputedStyle(c).columnGap)||0}
function step(){return items[0].getBoundingClientRect().width+gap()}
function per(){return Math.max(1,Math.floor((c.clientWidth-2*parseFloat(getComputedStyle(c).paddingLeft)+gap()+2)/step()))}
var t=false;function upd(){t=false;if(!mq.matches)return;
 var max=c.scrollWidth-c.clientWidth,k=per(),i=c.scrollLeft>=max-2?n-k:Math.round(c.scrollLeft/step());i=Math.max(0,Math.min(i,n-k));
 sp.textContent=(i+1)+'\u2013'+(i+k)+' of '+n;bar.style.setProperty('--p',(100*k/n)+'%');bar.style.setProperty('--x',(100*i/n)+'%');
 pv.setAttribute('aria-disabled',c.scrollLeft<=2?'true':'false');nx.setAttribute('aria-disabled',c.scrollLeft>=max-2?'true':'false')}
function go(d){if(this.getAttribute('aria-disabled')==='true')return;c.scrollBy({left:d*per()*step(),behavior:rm.matches?'auto':'smooth'})}
pv.addEventListener('click',function(){go.call(pv,-1)});nx.addEventListener('click',function(){go.call(nx,1)});
c.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});
addEventListener('resize',function(){if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});
function mode(){if(mq.matches){c.tabIndex=0;c.setAttribute('aria-label','Past sales, scroll for more')}else{c.removeAttribute('tabindex');c.setAttribute('aria-label',phoneLabel)}upd()}
(mq.addEventListener?mq.addEventListener('change',mode):mq.addListener(mode));mode();
})();
