/* All step content is in HTML. Navigation enhances native horizontal scrolling. */
(function(){
 'use strict';
 var root=document.querySelector('[data-buyer-journey]');if(!root)return;
 var track=root.querySelector('.journey-track'),cards=Array.from(track.children),rail=root.querySelector('.journey-rail'),links=Array.from(rail.querySelectorAll('a')),controls=root.querySelector('.journey-controls'),prev=root.querySelector('[data-journey-prev]'),next=root.querySelector('[data-journey-next]'),status=root.querySelector('.journey-status'),motion=matchMedia('(prefers-reduced-motion:reduce)'),current=0,frame,walkTimer,hoverTimer,last=-1;
 controls.hidden=false;
 function paint(i){current=i;if(i!==last){rail.style.setProperty('--walker-step',i);if(last>=0&&!motion.matches){root.classList.add('is-walking');clearTimeout(walkTimer);walkTimer=setTimeout(function(){root.classList.remove('is-walking')},600)}cards.forEach(function(c,j){c.classList.toggle('is-active',i===j)});last=i;}links.forEach(function(a,j){if(i===j)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});rail.style.setProperty('--journey-progress',((i+.0)/6*100)+'%');prev.disabled=i===0;next.disabled=i===cards.length-1;status.textContent='Step '+(i+1)+' of '+cards.length}
 function go(i){i=Math.max(0,Math.min(cards.length-1,i));track.scrollTo({left:i*track.clientWidth,behavior:motion.matches?'auto':'smooth'})}
 function sync(){paint(Math.max(0,Math.min(cards.length-1,Math.round(track.scrollLeft/track.clientWidth))))}
 links.forEach(function(a,i){a.addEventListener('click',function(e){e.preventDefault();clearTimeout(hoverTimer);go(i)});a.addEventListener('pointerenter',function(e){if(e.pointerType!=='mouse')return;clearTimeout(hoverTimer);hoverTimer=setTimeout(function(){go(i)},160)});a.addEventListener('pointerleave',function(){clearTimeout(hoverTimer)})});
 prev.addEventListener('click',function(){go(current-1)});next.addEventListener('click',function(){go(current+1)});
 track.addEventListener('keydown',function(e){if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(current+(e.key==='ArrowRight'?1:-1))}else if(e.key==='Home'||e.key==='End'){e.preventDefault();go(e.key==='Home'?0:cards.length-1)}});
 track.addEventListener('scroll',function(){cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)},{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(function(){track.scrollTo({left:current*track.clientWidth,behavior:'auto'})}).observe(track);
 if('IntersectionObserver' in window)new IntersectionObserver(function(entries){root.classList.toggle('in-view',entries[0].isIntersecting)},{threshold:.15}).observe(root);else root.classList.add('in-view');
 paint(0);
})();
