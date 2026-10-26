/* Buyer's Guide flow: pinned one-step-at-a-time on desktop; stacked with a live step counter on phones. */
(function(){
  var root=document.querySelector('.bgf');if(!root)return;
  document.documentElement.classList.add('bgf-js');
  var S=[].slice.call(root.querySelectorAll('.bgf-s')),F=[].slice.call(root.querySelectorAll('.bgf-f')),
      T=[].slice.call(root.querySelectorAll('.bgf-t')),ci=root.querySelector('.bgf-ci'),bar=root.querySelector('.bgf-bar i'),N=S.length,cur=-1;
  var mq=matchMedia('(min-width:900px) and (min-height:560px)');
  var rm=matchMedia('(prefers-reduced-motion: reduce)');
  function pad(n){return (n<10?'0':'')+n}
  function set(i){
    if(i===cur)return;cur=i;
    S.forEach(function(s,k){s.classList.toggle('on',k===i);if(k<=i)s.classList.add('seen')});
    F.forEach(function(f,k){f.classList.toggle('on',k===i)});
    T.forEach(function(t,k){if(k===i)t.setAttribute('aria-current','step');else t.removeAttribute('aria-current')});
    ci.textContent=pad(i+1);bar.style.transform='scaleX('+((i+1)/N)+')';
  }
  function span(){return Math.max(1,root.offsetHeight-innerHeight)}
  function top(){return root.getBoundingClientRect().top+scrollY}
  function upd(){
    if(mq.matches){var p=(scrollY-top())/span();set(Math.max(0,Math.min(N-1,Math.floor(p*N))));return}
    var y=innerHeight*.55,i=0;S.forEach(function(s,k){if(s.getBoundingClientRect().top<y)i=k});set(i);
  }
  var q=false;function tick(){if(q)return;q=true;requestAnimationFrame(function(){q=false;upd()})}
  addEventListener('scroll',tick,{passive:true});addEventListener('resize',function(){cur=-1;tick()});
  T.forEach(function(t,k){t.addEventListener('click',function(ev){
    if(!mq.matches)return;ev.preventDefault();
    scrollTo({top:top()+(k+.5)/N*span(),behavior:rm.matches?'auto':'smooth'});
    history.replaceState(null,'','#step-'+(k+1));
  })});
  function hash(){var m=/^#step-(\d+)$/.exec(location.hash);if(m&&mq.matches){var k=Math.min(N,+m[1])-1;scrollTo(0,top()+(k+.5)/N*span())}}
  hash();upd();
})();
