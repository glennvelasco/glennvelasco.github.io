/* v13: reveal on scroll + How it works stepper. Progressive: without JS everything is shown. */
(function(){
  var d=document.documentElement;d.classList.add('js');
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function reveal(){
    var els=[].slice.call(document.querySelectorAll('.rv'));
    if(rm||!('IntersectionObserver' in window)){els.forEach(function(x){x.classList.add('in')});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(function(x){io.observe(x)});
  }
  function hiw(){
    var root=document.querySelector('.hw');if(!root)return;
    var tabs=[].slice.call(root.querySelectorAll('[role=tab]')),trs=[].slice.call(root.querySelectorAll('[data-track]'));
    trs.forEach(function(tr){
      var items=[].slice.call(tr.querySelectorAll('.hw-s')),cur=0,cnt=tr.querySelector('.hw-cnt');
      function go(n,focus){cur=Math.max(0,Math.min(items.length-1,n));
        items.forEach(function(li,i){var on=i===cur;li.classList.toggle('on',on);li.querySelector('.hw-b').setAttribute('aria-current',on?'step':'false');});
        cnt.textContent=(cur+1)+' / '+items.length;
        tr.querySelector('.hw-p').disabled=cur===0;tr.querySelector('.hw-x').disabled=cur===items.length-1;
        if(focus)items[cur].querySelector('.hw-b').focus();}
      items.forEach(function(li,i){li.querySelector('.hw-b').addEventListener('click',function(){go(i)});});
      tr.querySelector('.hw-p').addEventListener('click',function(){go(cur-1)});
      tr.querySelector('.hw-x').addEventListener('click',function(){go(cur+1)});
      tr.querySelector('.hw-l').addEventListener('keydown',function(ev){
        if(ev.key==='ArrowDown'||ev.key==='ArrowRight'){ev.preventDefault();go(cur+1,true)}
        else if(ev.key==='ArrowUp'||ev.key==='ArrowLeft'){ev.preventDefault();go(cur-1,true)}});
      tr._go=go;go(0);
    });
    function sel(t,focus){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});if(focus)t.focus();}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(t)});
      t.addEventListener('keydown',function(ev){if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();sel(tabs[(i+1)%tabs.length],true)}});});
    var want=location.hash==='#selling'?tabs[1]:tabs[0];sel(want);
  }
  function init(){reveal();hiw();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
