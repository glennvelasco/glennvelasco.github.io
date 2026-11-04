/* All six stages remain in HTML. Native scrolling supports touch without intercepting gestures. */
(function(){
 'use strict';
 const root=document.querySelector('[data-buyer-journey]');if(!root)return;
 const track=root.querySelector('.journey-track'),cards=Array.from(track.children),rail=root.querySelector('.journey-rail'),links=Array.from(rail.querySelectorAll('a')),bird=root.querySelector('.journey-pigeon'),controls=root.querySelector('.journey-controls'),prev=root.querySelector('[data-journey-prev]'),next=root.querySelector('[data-journey-next]'),status=root.querySelector('.journey-status'),motion=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:640px)');
 let current=0,last=-1,frame,flightTimer,hoverTimer,nudgeBack,nudgeEnd,nudged=false,interacted=false;
 controls.hidden=false;
 function target(i){return cards[i].offsetLeft-cards[0].offsetLeft}
 function perch(i){const mark=links[i].querySelector('.journey-dot'),r=mark.getBoundingClientRect(),base=rail.getBoundingClientRect(),x=r.left-base.left+r.width/2;bird.style.left=(x-bird.getBoundingClientRect().width/2)+'px';rail.style.setProperty('--journey-progress',x+'px')}
 function paint(i){
  current=i;
  if(i!==last){
   root.classList.toggle('facing-left',last>=0&&i<last);
   if(last>=0&&!motion.matches){root.classList.add('is-flying');clearTimeout(flightTimer);flightTimer=setTimeout(()=>root.classList.remove('is-flying'),800)}
   cards.forEach((c,j)=>c.classList.toggle('is-active',i===j));last=i;
  }
  perch(i);links.forEach((a,j)=>{if(j===i)a.setAttribute('aria-current','step');else a.removeAttribute('aria-current')});prev.disabled=i===0;next.disabled=i===cards.length-1;status.textContent='Step '+(i+1)+' of '+cards.length;
 }
 function cancelNudge(){interacted=true;clearTimeout(nudgeBack);clearTimeout(nudgeEnd);track.classList.remove('is-nudging')}
 function go(i){cancelNudge();i=Math.max(0,Math.min(cards.length-1,i));track.scrollTo({left:target(i),behavior:motion.matches?'auto':'smooth'})}
 function sync(){let i=0,nearest=Infinity;cards.forEach((c,j)=>{const distance=Math.abs(target(j)-track.scrollLeft);if(distance<nearest){nearest=distance;i=j}});paint(i)}
 links.forEach((a,i)=>{a.addEventListener('click',e=>{e.preventDefault();clearTimeout(hoverTimer);go(i)});a.addEventListener('pointerenter',e=>{if(e.pointerType!=='mouse')return;clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>go(i),180)});a.addEventListener('pointerleave',()=>clearTimeout(hoverTimer))});
 prev.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
 track.addEventListener('keydown',e=>{if(e.target!==track)return;if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();go(e.key==='Home'?0:e.key==='End'?cards.length-1:current+(e.key==='ArrowRight'?1:-1))}});
 ['pointerdown','touchstart','wheel','keydown'].forEach(event=>track.addEventListener(event,cancelNudge,{passive:true}));
 track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(sync)},{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(()=>{track.scrollTo({left:target(current),behavior:'auto'});perch(current)}).observe(track);
 if('IntersectionObserver' in window){
  new IntersectionObserver(entries=>root.classList.toggle('in-view',entries[0].isIntersecting),{threshold:.15}).observe(root);
  const hintObserver=new IntersectionObserver(entries=>{
   if(!entries[0].isIntersecting||!mobile.matches||motion.matches||nudged||interacted)return;
   nudged=true;track.classList.add('is-nudging');track.scrollTo({left:24,behavior:'smooth'});
   nudgeBack=setTimeout(()=>{if(!interacted)track.scrollTo({left:0,behavior:'smooth'})},500);
   nudgeEnd=setTimeout(()=>track.classList.remove('is-nudging'),1000);hintObserver.disconnect();
  },{threshold:.55});hintObserver.observe(track);
 }else root.classList.add('in-view');
 paint(0);
})();
