/* t218u mockup: Search Homes quick search -> Compass search URL (format read from Compass's own filter UI) */
(function(){var f=document.getElementById('sxf');if(!f)return;
var mn=f.querySelector('#sx-mn'),mx=f.querySelector('#sx-mx'),bd=f.querySelector('#sx-b'),ar=f.querySelector('#sx-a');
function fm(n){return n>=1e6?'$'+(n/1e6)+'M':n>=1e5?'$'+(n/1e3)+'K':'$'+n.toLocaleString('en-US')}
function kind(){var r=f.querySelector('input[name="sx-k"]:checked');return r?r.value:'sale'}
function fill(sel,none,vals){var keep=sel.value;sel.innerHTML='';var o=document.createElement('option');o.value='';o.textContent=none;sel.appendChild(o);
 vals.forEach(function(v){var o=document.createElement('option');o.value=v;o.textContent=fm(+v);sel.appendChild(o)});
 if(vals.indexOf(keep)>-1)sel.value=keep}
function prices(){var v=f.getAttribute(kind()==='rent'?'data-rent':'data-sale').split(',');fill(mn,'No min',v);fill(mx,'No max',v)}
[].forEach.call(f.querySelectorAll('input[name="sx-k"]'),function(r){r.addEventListener('change',prices)});
f.sxUrl=function(){var q={},a=+mn.value||0,b=+mx.value||0,n=bd.value;
 if(a&&b&&a>b){var t=a;a=b;b=t}
 if(a||b){q.price={};if(a)q.price.min={num:a};if(b)q.price.max={num:b}}
 if(n)q.beds={min:{num:+n}};
 var u='https://www.compass.com/'+(kind()==='rent'?'for-rent':'homes-for-sale')+'/'+((f.sxPath&&f.sxPath())||(ar.value||'new-york-ny')+'/')+'?';
 if(q.price||q.beds)u+='searchQuery='+encodeURIComponent(JSON.stringify(q))+'&';
 return u+'agent_id='+f.getAttribute('data-ag')};
f.addEventListener('submit',function(ev){ev.preventDefault();var a=document.createElement('a');a.href=f.sxUrl();a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove()});
})();
