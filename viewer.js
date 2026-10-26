/* Full-screen photo viewer for listing pages. Vanilla JS: arrows, Esc, swipe, focus trap, focus return. */
(function(){
  var data=document.getElementById('lv-data');if(!data)return;
  var P=JSON.parse(data.textContent),v=document.getElementById('lv'),img=v.querySelector('img'),src=v.querySelector('source'),
      cnt=v.querySelector('.lv-count'),prev=v.querySelector('.lv-prev'),next=v.querySelector('.lv-next'),close=v.querySelector('.lv-close'),
      i=0,opener=null,x0=null,y0=null;
  function show(n){i=(n+P.length)%P.length;var p=P[i];src.srcset=p.webp;img.src=p.jpg;img.alt=p.alt;img.width=p.w;img.height=p.h;cnt.textContent=(i+1)+' / '+P.length;}
  function open(n,from){opener=from||document.activeElement;show(n);v.hidden=false;document.documentElement.classList.add('lv-open');close.focus();}
  function shut(){v.hidden=true;document.documentElement.classList.remove('lv-open');if(opener&&opener.focus)opener.focus();}
  document.querySelectorAll('[data-lv]').forEach(function(b){b.addEventListener('click',function(){open(+b.getAttribute('data-lv'),b);});});
  prev.addEventListener('click',function(){show(i-1);});next.addEventListener('click',function(){show(i+1);});close.addEventListener('click',shut);
  if(P.length<2){prev.hidden=true;next.hidden=true;}
  v.addEventListener('keydown',function(e){
    if(e.key==='Escape'){e.preventDefault();shut();}
    else if(e.key==='ArrowLeft'){e.preventDefault();show(i-1);}
    else if(e.key==='ArrowRight'){e.preventDefault();show(i+1);}
    else if(e.key==='Tab'){var f=[].slice.call(v.querySelectorAll('button')).filter(function(b){return !b.hidden;});var a=f.indexOf(document.activeElement);
      if(e.shiftKey&&a<=0){e.preventDefault();f[f.length-1].focus();}else if(!e.shiftKey&&a===f.length-1){e.preventDefault();f[0].focus();}}
  });
  v.addEventListener('click',function(e){if(e.target===v||e.target.classList.contains('lv-stage'))shut();});
  v.addEventListener('pointerdown',function(e){x0=e.clientX;y0=e.clientY;});
  v.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0,dy=e.clientY-y0;x0=null;
    if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)){show(dx<0?i+1:i-1);}});
  window.glennViewer={open:open,show:show,close:shut};
})();
