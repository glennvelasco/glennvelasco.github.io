/* t155u: the 3-step home valuation form, shared by valuation.html and the home page's "What's your home worth?" section.
   Without JS the fieldsets show as one plain form that posts to FormSubmit.
   With JS: 3 steps, progress, Back, per-step validation, then JSON to FormSubmit's AJAX endpoint and a thank-you screen.
   FormSubmit emails a one-time activation link to glenn.velasco@compass.com on the first real submission.
   Every lookup is scoped to the form's own .vpanel, so the same code runs wherever the panel is placed. */
(function(){
  var ENDPOINT='https://formsubmit.co/ajax/glenn.velasco@compass.com';
  function init(f){
  var P=f.closest('.vpanel')||document;
  var steps=[].slice.call(f.querySelectorAll('.vstep')),prog=P.querySelector('.vprog'),cur=0,opts=f.querySelector('.opts'),
      tl=document.getElementById(opts.getAttribute('aria-describedby')),
      thanks=P.querySelector('.vthanks'),err=P.querySelector('.verror'),mail=err.querySelector('a[href^="mailto:"]'),send=f.querySelector('.vsend');
  f.classList.add('js');
  function go(n,focus){cur=n;steps.forEach(function(s,k){s.hidden=k!==n;});prog.textContent='Step '+(n+1)+' of '+steps.length;
    if(focus!==false){var h=steps[n].querySelector('legend');h.setAttribute('tabindex','-1');h.focus();}}
  function msg(el,t){var id=el.getAttribute('aria-describedby'),m=id&&document.getElementById(id.split(' ')[0]);if(!m)return;m.textContent=t;m.hidden=!t;
    if(el.type!=='radio')el.setAttribute('aria-invalid',t?'true':'false');}
  function check(s){var bad=null;
    s.querySelectorAll('input[required]:not([type=radio])').forEach(function(el){var v=el.value.trim(),t='';
      if(!v)t=el.getAttribute('data-req');else if(el.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))t='Enter a valid email address.';
      msg(el,t);if(t&&!bad)bad=el;});
    var r=s.querySelector('input[type=radio]');if(r){var ok=s.querySelector('input[type=radio]:checked');
      tl.textContent=ok?'':'Choose one option.';tl.hidden=!!ok;opts.setAttribute('aria-invalid',ok?'false':'true');if(!ok&&!bad)bad=r;}
    if(bad)bad.focus();return !bad;}
  f.querySelectorAll('[data-next]').forEach(function(b){b.addEventListener('click',function(){if(check(steps[cur]))go(cur+1);});});
  f.querySelectorAll('[data-back]').forEach(function(b){b.addEventListener('click',function(){go(cur-1);});});
  f.querySelectorAll('.opts input').forEach(function(r){r.addEventListener('change',function(){tl.hidden=true;opts.setAttribute('aria-invalid','false');});});
  f.querySelectorAll('input[required]:not([type=radio])').forEach(function(el){el.addEventListener('input',function(){if(el.getAttribute('aria-invalid')==='true')msg(el,'');});});
  f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&cur<steps.length-1){e.preventDefault();if(check(steps[cur]))go(cur+1);}});
  f.addEventListener('submit',function(e){e.preventDefault();
    for(var k=0;k<steps.length;k++){if(!check(steps[k])){go(k,false);check(steps[k]);return;}}
    var data={};new FormData(f).forEach(function(v,k){data[k]=v;});
    var lines=['Address: '+data.address,'Unit: '+(data.unit||''),'Timeline: '+(data.timeline||''),'Name: '+data.name,'Email: '+data.email,'Phone: '+(data.phone||'')];
    mail.href='mailto:glenn.velasco@compass.com?subject='+encodeURIComponent('Home valuation request')+'&body='+encodeURIComponent(lines.join('\n'));
    err.hidden=true;send.disabled=true;send.setAttribute('aria-busy','true');send.textContent='Sending…';
    fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||!(j.success===true||j.success==='true'))throw new Error(j.message||('HTTP '+r.status));});})
      .then(function(){f.hidden=true;prog.hidden=true;thanks.hidden=false;thanks.focus();})
      .catch(function(){err.hidden=false;err.focus();})
      .then(function(){send.disabled=false;send.removeAttribute('aria-busy');send.textContent='Send request';});
  });
  go(0,false);
  }
  [].forEach.call(document.querySelectorAll('form.vf'),init);
})();
