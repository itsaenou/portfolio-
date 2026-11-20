/* travel_log · editor visual de Ainoa. Se carga solo con …/portfolio-/#editar.
   Edita sobre el mismo mapa y la misma pantalla completa que ven los visitantes, y publica con un solo
   commit en GitHub (cartel, fotos y viajes/viajes.json). La clave de GitHub se guarda solo en este navegador. */
(async function(){
const REPO='itsaenou/portfolio-',BRANCH='main',API='https://api.github.com/repos/'+REPO;
const TYPES=[['comer','Comer'],['ver','Ver'],['dormir','Dormir'],['otro','Otro']];
let dirty=false,saving=false;
const getTok=()=>{try{return localStorage.getItem('tv-token')||''}catch(_){return''}};
const setTok=v=>{try{v?localStorage.setItem('tv-token',v):localStorage.removeItem('tv-token')}catch(_){}};
const slug=t=>norm(t).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'pais';
const srcOf=x=>x&&typeof x==='object'?x.url:x;
const mark=()=>{dirty=true;bar()};
addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue=''}});

/* ---------- estilos ---------- */
const st=document.createElement('style');st.textContent=`
.tve .body{display:flex;flex-direction:column;background:#fff}
.tve-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 14px;background:var(--yellow);font:11px/1.3 var(--mono);letter-spacing:.06em}
.tve-bar b{font:700 12px var(--sans);letter-spacing:0}
.tve-bar .s{flex:1 1 160px;min-width:0}
.tve-btn{height:34px;padding:0 14px;border-radius:7px;font:600 13px var(--sans);background:#111110;color:#fff}
.tve-btn.ghost{background:transparent;color:#111110;border:1px solid #111110}
.tve-btn:disabled{opacity:.4;cursor:default}
.tve-btn:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.tve-help{padding:10px 14px 0;margin:0;font:12px/1.45 var(--sans);color:#55554f}
.tve .tv-top{border-bottom:0}
.tve-add{position:absolute;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#fff;border:1px solid #b9b09d;color:#8a826f;font:12px/14px var(--sans);text-align:center;padding:0;z-index:1;transition:transform .15s}
.tve-add:hover,.tve-add:focus-visible{transform:translate(-50%,-50%) scale(1.5);background:var(--blue);border-color:var(--blue);color:#fff;z-index:4}
.tve-add.hit{background:var(--yellow);border-color:#111110;color:#111110;transform:translate(-50%,-50%) scale(1.4);z-index:4}
.tve-tip{position:absolute;z-index:5;pointer-events:none;transform:translate(-50%,-150%);background:#111110;color:#fff;font:11px var(--mono);padding:3px 6px;border-radius:3px;white-space:nowrap}
.tve-tok{padding:16px 18px 18px;display:grid;gap:10px;font:13px/1.5 var(--sans)}
.tve-tok ol{margin:0;padding-left:20px}.tve-tok li{margin:3px 0}
.tve-tok input{font:14px var(--mono);padding:9px 10px;border:1px solid #11111044;border-radius:7px;width:100%}
.tve-tok p{margin:0}.tve-tok .ok{color:#127a3a}.tve-tok .bad{color:#c4210f}
/* pantalla completa en modo edición */
.tvx .tv-po.drop,.tvx .drop{outline:2px dashed #ffffff55;outline-offset:-2px;border-radius:2px}
.tvx .slot{position:relative;display:block;width:min(calc(70dvh*.707),calc(100vw - 140px));aspect-ratio:1240/1754;flex:none;background:#ffffff0d;color:#cfcfca;cursor:pointer}
.tvx .slot img,.tvx .slot .tv-po{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tvx .slot .hint{position:absolute;inset:0;display:grid;place-items:center;text-align:center;padding:20px;font:12px/1.5 var(--mono);letter-spacing:.06em;background:#0008;opacity:0;transition:opacity .2s}
.tvx .slot:hover .hint,.tvx .slot:focus-visible .hint,.tvx .slot.empty .hint,.tvx .over .hint{opacity:1}
.tvx .slot.empty{outline:2px dashed #ffffff66;outline-offset:-2px}
.tvx .slot.empty .hint{background:transparent}
.tvx .over{outline:3px solid var(--yellow)!important}
.tvx .when{background:transparent;border:0;border-bottom:1px dashed #ffffff44;color:#cfcfca;font:12px var(--mono);letter-spacing:.06em;text-align:center;padding:4px;width:220px}
.tvx .when:focus{outline:none;border-bottom-color:var(--yellow)}
.tvx .rm{position:absolute;top:6px;right:6px;width:28px;height:28px;border-radius:50%;background:#111110cc;color:#fff;font-size:13px;display:grid;place-items:center}
.tvx .rm:hover,.tvx .rm:focus-visible{background:var(--red)}
.tvx .phg{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px}
.tvx .phg>div,.tvx .phg>button{position:relative;aspect-ratio:1;background:#222}
.tvx .phg img{width:100%;height:100%;object-fit:cover;display:block}
.tvx .addph{display:grid;place-items:center;border:2px dashed #ffffff44;color:#cfcfca;font:12px/1.5 var(--mono);letter-spacing:.06em;text-align:center;padding:10px}
.tvx .addph:hover,.tvx .addph:focus-visible{border-color:var(--yellow);color:#fff}
.tvx .tv-rec li{position:relative;gap:8px}
.tvx .tv-rec input,.tvx .tv-rec textarea{background:transparent;border:0;border-bottom:1px dashed #ffffff33;color:#f3f3f0;font:13px/1.4 var(--sans);padding:3px 0;width:100%;resize:vertical}
.tvx .tv-rec input.n{font:600 15px/1.25 var(--sans)}
.tvx .tv-rec input:focus,.tvx .tv-rec textarea:focus{outline:none;border-bottom-color:var(--yellow)}
.tvx .chips{display:flex;flex-wrap:wrap;gap:4px}
.tvx .chips button{font:10px var(--mono);letter-spacing:.08em;text-transform:uppercase;padding:3px 7px;border-radius:10px;border:1px solid #ffffff33;color:#cfcfca}
.tvx .chips button[aria-pressed="true"]{background:var(--yellow);border-color:var(--yellow);color:#111110}
.tvx .tv-rec .rm{top:8px;right:8px}
.tvx .addrec{border:2px dashed #ffffff44!important;display:grid!important;place-items:center;min-height:120px;color:#cfcfca;font:12px var(--mono);letter-spacing:.06em}
.tvx .addrec:hover,.tvx .addrec:focus-visible{border-color:var(--yellow)!important;color:#fff}
.tvx-foot{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:402;display:flex;gap:10px;align-items:center;background:#111110ee;border:1px solid #ffffff26;border-radius:12px;padding:8px 8px 8px 14px;font:11px var(--mono);color:#cfcfca;max-width:calc(100vw - 24px)}
.tvx-foot .tve-btn{background:var(--yellow);color:#111110}
.tvx-foot .del{background:transparent;color:#ff8a7a;border:1px solid #ff8a7a55}
.tvx .tv-more{padding-bottom:120px}
`;document.head.appendChild(st);

await TV_READY.catch(()=>{});
$('#travelli').hidden=false;

/* ---------- GitHub ---------- */
async function gh(path,opt={}){const r=await fetch(API+path,{...opt,headers:{Authorization:'Bearer '+getTok(),Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...(opt.body?{'Content-Type':'application/json'}:{})}});
  if(!r.ok){const e=new Error((await r.json().catch(()=>({}))).message||r.statusText);e.status=r.status;throw e}return r.json()}
const b64=buf=>{let s='';const u=new Uint8Array(buf);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
async function shrink(file,max,q){const bmp=await createImageBitmap(file).catch(()=>null);if(!bmp)return file.arrayBuffer();
  const k=Math.min(1,max/Math.max(bmp.width,bmp.height)),c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);
  const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(bmp,0,0,c.width,c.height);
  return new Promise(r=>c.toBlob(b=>b.arrayBuffer().then(r),'image/jpeg',q))}
function toJSON(){return JSON.stringify({paises:TRIPS.map(t=>{const o={pais:t.pais};if(t.cuando)o.cuando=t.cuando;o.cartel=srcOf(t.cartel)||'';o.fotos=t.fotos.map(srcOf);
  o.sitios=t.sitios.filter(x=>x.nombre&&x.nombre.trim()).map(x=>{const r={nombre:x.nombre.trim()};if(x.ciudad)r.ciudad=x.ciudad.trim();r.tipo=x.tipo||'otro';if(x.nota)r.nota=x.nota.trim();if(x.url)r.url=x.url;return r});
  if(t.latC!=null){o.lat=t.latC;o.lon=t.lonC}return o})},null,2)+'\n'}
async function publish(){
  if(saving)return;if(!getTok()){tokenPanel();return}
  saving=true;bar('Preparando…');
  try{
    const ts=Date.now().toString(36),files=[];
    for(const t of TRIPS){const sl=slug(t.pais);
      if(t.cartel&&typeof t.cartel==='object')files.push({obj:t,key:'cartel',path:`viajes/${sl}/cartel-${ts}.jpg`,file:t.cartel.file,max:2000,q:.88});
      t.fotos.forEach((f,i)=>{if(f&&typeof f==='object')files.push({arr:t.fotos,i,path:`viajes/${sl}/${ts}-${String(i+1).padStart(2,'0')}.jpg`,file:f.file,max:1600,q:.84})})}
    const ref=await gh('/git/ref/heads/'+BRANCH),head=ref.object.sha,base=(await gh('/git/commits/'+head)).tree.sha,tree=[];
    let k=0;for(const f of files){bar(`Subiendo imágenes ${++k}/${files.length}…`);
      const blob=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:b64(await shrink(f.file,f.max,f.q)),encoding:'base64'})});
      tree.push({path:f.path,mode:'100644',type:'blob',sha:blob.sha})}
    const json=(()=>{const keep=files.map(f=>f.obj?[f.obj,f.obj.cartel]:[f.arr,f.arr[f.i]]);files.forEach(f=>{if(f.obj)f.obj.cartel=f.path;else f.arr[f.i]=f.path});
      const j=toJSON();return{j,undo:()=>files.forEach((f,n)=>{if(f.obj)f.obj.cartel=keep[n][1];else f.arr[f.i]=keep[n][1]})}})();
    bar('Publicando…');
    try{const jb=await gh('/git/blobs',{method:'POST',body:JSON.stringify({content:b64(new TextEncoder().encode(json.j)),encoding:'base64'})});
      tree.push({path:'viajes/viajes.json',mode:'100644',type:'blob',sha:jb.sha});
      const nt=await gh('/git/trees',{method:'POST',body:JSON.stringify({base_tree:base,tree})});
      const cm=await gh('/git/commits',{method:'POST',body:JSON.stringify({message:'travel_log: actualizar viajes desde el editor',tree:nt.sha,parents:[head]})});
      await gh('/git/refs/heads/'+BRANCH,{method:'PATCH',body:JSON.stringify({sha:cm.sha})});
    }catch(e){json.undo();throw e}
    dirty=false;saving=false;bar('Publicado ✓ Se verá en la web en 1–2 minutos.');redrawAll();
  }catch(e){saving=false;bar(e.status===401||e.status===403||e.status===404?'La clave de GitHub no funciona o no tiene permiso. Revísala en «Clave».':e.status===409||e.status===422?'Alguien cambió la web a la vez. Recarga la página y vuelve a guardar.':'No se ha podido publicar: '+e.message)}}

/* ---------- barra de estado ---------- */
let msg='';
function bar(m){if(m!=null)msg=m;const s=msg||(dirty?'Tienes cambios sin publicar.':'Todo publicado.');
  $$('.tve-st').forEach(x=>x.textContent=s);$$('.tve-pub').forEach(b=>b.disabled=saving||!dirty)}

/* ---------- ventana de edición: mapa ---------- */
function tokenPanel(){const el=win({id:'w-tvtok',title:'Clave de GitHub',cls:'tve',w:470,x:.5,y:.4,html:`<div class="tve-tok">
  <p>Para publicar desde aquí, la web necesita una clave tuya de GitHub. Se guarda solo en este navegador.</p>
  <ol><li>Abre <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">github.com → nueva clave (fine-grained token)</a>.</li>
  <li><b>Token name</b>: travel_log · <b>Expiration</b>: la que quieras (por ejemplo, 1 año).</li>
  <li><b>Repository access</b> → <i>Only select repositories</i> → <b>portfolio-</b>.</li>
  <li><b>Permissions</b> → <b>Contents</b> → <i>Read and write</i>.</li>
  <li><b>Generate token</b>, cópiala y pégala aquí:</li></ol>
  <input type="password" id="tvtokin" placeholder="github_pat_…" autocomplete="off" spellcheck="false" value="${esc(getTok())}">
  <p class="r" aria-live="polite"></p>
  <div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="tve-btn" id="tvtokok">Guardar y comprobar</button><button type="button" class="tve-btn ghost" id="tvtokrm">Borrar clave</button></div></div>`});
  const r=$('.r',el);
  $('#tvtokok',el).onclick=async()=>{setTok($('#tvtokin',el).value.trim());r.className='r';r.textContent='Comprobando…';
    try{const d=await gh('');if(d.permissions&&d.permissions.push){r.className='r ok';r.textContent='Funciona ✓ Ya puedes publicar.';bar()}else{r.className='r bad';r.textContent='La clave lee el repositorio pero no puede escribir: activa Contents → Read and write.'}}
    catch(e){r.className='r bad';r.textContent='Esta clave no funciona ('+(e.status||e.message)+'). Revisa que sea de portfolio- y que no haya caducado.'}};
  $('#tvtokrm',el).onclick=()=>{setTok('');$('#tvtokin',el).value='';r.className='r';r.textContent='Clave borrada de este navegador.'};
  return el}

let mapDraw=null;
function addCountry(name){const e=EU[norm(name)];const key=Object.keys(EU).find(k=>k===norm(name));if(!key)return-1;
  const label=({'españa':'España','monaco':'Mónaco','belgica':'Bélgica','paises bajos':'Países Bajos','chequia':'Chequia','hungria':'Hungría','turquia':'Turquía','rumania':'Rumanía','reino unido':'Reino Unido','macedonia del norte':'Macedonia del Norte','bosnia y herzegovina':'Bosnia y Herzegovina','san marino':'San Marino'})[key]||key.charAt(0).toUpperCase()+key.slice(1);
  let i=TRIPS.findIndex(t=>norm(t.pais)===key);if(i>=0)return i;
  TRIPS.push({pais:label,cuando:'',cartel:'',fotos:[],sitios:[],lat:e[0],lon:e[1],key:key+'|'+norm(e[2])});mark();return TRIPS.length-1}
const NAMES=Object.keys(EU);
OPEN.travel=()=>{
  const fresh=!document.getElementById('w-tvedit');
  const el=win({id:'w-tvedit',title:'travel_log · editar',cls:'travel tve',w:720,x:.5,y:.46,html:`<div class="tve-bar"><b>MODO EDICIÓN</b><span class="s tve-st"></span><button type="button" class="tve-btn ghost" data-tok>Clave</button><button type="button" class="tve-btn tve-pub" disabled>Guardar y publicar</button></div>
    <p class="tve-help">Pulsa un <b>+</b> del mapa para añadir un país, o un cartel para editarlo. Dentro arrastra el cartel y las fotos y escribe tus sitios.</p>
    <div class="tv-top"><input class="tv-q" type="search" placeholder="Busca o añade un país…" aria-label="Busca o añade un país" autocomplete="off" spellcheck="false"></div><p class="tv-msg" aria-live="polite"></p><div class="tv-view"></div>`});
  if(!fresh)return el;
  const draw=()=>{const q=norm($('.tv-q',el).value);const have=new Set(TRIPS.map(t=>norm(t.pais)));
    const adds=NAMES.filter(n=>!have.has(n)).map(n=>{const[x,y]=tvXY(EU[n][0],EU[n][1]);const hit=q&&(n+'|'+norm(EU[n][2])).includes(q);return `<button type="button" class="tve-add${hit?' hit':''}" data-add="${esc(n)}" style="left:${x}%;top:${y}%" aria-label="Añadir ${esc(n)}" title="Añadir ${esc(n)}">+</button>`}).join('');
    $('.tv-view',el).innerHTML=tvMapHTML(q,adds);
    $('.tv-msg',el).textContent=q&&!TRIPS.some(t=>t.key.includes(q))?(NAMES.some(n=>(n+'|'+norm(EU[n][2])).includes(q))?'Pulsa Enter para añadirlo.':'No encuentro ese país en Europa.'):'';bar()};
  mapDraw=draw;
  el.addEventListener('click',e=>{const a=e.target.closest('[data-add]');if(a){const i=addCountry(a.dataset.add);draw();edit(i);return}
    const p=e.target.closest('[data-i]');if(p){edit(+p.dataset.i);return}
    if(e.target.closest('[data-tok]'))tokenPanel();if(e.target.closest('.tve-pub'))publish()});
  tvHover(el);
  $('.tv-q',el).addEventListener('input',draw);
  $('.tv-q',el).addEventListener('keydown',e=>{if(e.key!=='Enter')return;e.preventDefault();const q=norm(e.target.value);if(!q)return;
    let i=TRIPS.findIndex(t=>t.key.includes(q));if(i<0){const n=NAMES.find(n=>(n+'|'+norm(EU[n][2])).includes(q));if(n)i=addCountry(n)}
    if(i>=0){e.target.value='';draw();edit(i)}});
  draw();return el};
function redrawAll(){mapDraw&&mapDraw();const fs=$('#tvedfs');if(fs&&!fs.hidden)edit(+fs.dataset.i,true)}

/* ---------- pantalla completa editable ---------- */
function pick(multiple,cb){const inp=document.createElement('input');inp.type='file';inp.accept='image/*';inp.multiple=multiple;inp.onchange=()=>cb([...inp.files]);inp.click()}
const asObj=f=>({file:f,url:URL.createObjectURL(f)});
function dropOn(node,cb){node.addEventListener('dragover',e=>{e.preventDefault();node.classList.add('over')});node.addEventListener('dragleave',()=>node.classList.remove('over'));
  node.addEventListener('drop',e=>{e.preventDefault();node.classList.remove('over');const fs=[...e.dataTransfer.files].filter(f=>f.type.startsWith('image/'));if(fs.length)cb(fs)})}
window.tvOpenFS=i=>edit(i);
function edit(i,keepScroll){
  let fs=$('#tvedfs');
  if(!fs){fs=document.createElement('section');fs.id='tvedfs';fs.className='tv-fs';fs.setAttribute('role','dialog');fs.setAttribute('aria-modal','true');document.body.appendChild(fs)}
  if(!fs.dataset.ed){fs.dataset.ed=1;
    fs.addEventListener('keydown',e=>{if(e.key==='Escape'&&!e.target.matches('input,textarea')){e.stopPropagation();closeEd()}},true)}
  fs.classList.add('tvx');const n=TRIPS.length;if(!n){closeEd();return}i=(i+n)%n;const t=TRIPS[i];fs.dataset.i=i;
  const y=fs.scrollTop,tt={...t,cartel:srcOf(t.cartel)};
  fs.innerHTML=`<button type="button" class="tv-x" data-a="x" aria-label="Volver al mapa">✕</button>${n>1?`<button type="button" class="tv-nav p" data-a="p" aria-label="País anterior">‹</button><button type="button" class="tv-nav n" data-a="n" aria-label="País siguiente">›</button>`:''}
    <div class="tv-hero"><button type="button" class="slot${tt.cartel?'':' empty'}" data-a="cartel" aria-label="Cambiar el cartel de ${esc(t.pais)}">${tt.cartel?`<img src="${esc(tt.cartel)}" alt="">`:''}<span class="hint">${tt.cartel?'Cambiar cartel<br>(pulsa o suelta una imagen)':'Suelta aquí tu cartel<br>o pulsa para elegirlo<br><br>vertical A · 1240×1754 px'}</span></button>
      <p><b>${esc(t.pais)}</b></p><input class="when" value="${esc(t.cuando||'')}" placeholder="¿Cuándo fuiste? (opcional)" aria-label="Cuándo fuiste"></div>
    <div class="tv-more"><h3>Fotos · ${t.fotos.length}</h3><div class="phg">${t.fotos.map((f,k)=>`<div><img src="${esc(srcOf(f))}" alt=""><button type="button" class="rm" data-a="rmph" data-k="${k}" aria-label="Quitar foto ${k+1}">✕</button></div>`).join('')}<button type="button" class="addph" data-a="addph">+ Añadir fotos<br>(pulsa o suéltalas aquí)</button></div>
    <h3>Recomendaciones · ${t.sitios.length}</h3><ul class="tv-rec">${t.sitios.map((s,k)=>`<li data-k="${k}"><button type="button" class="rm" data-a="rmrec" aria-label="Quitar sitio">✕</button>
      <div class="chips">${TYPES.map(([v,l])=>`<button type="button" data-a="tipo" data-v="${v}" aria-pressed="${(s.tipo||'otro')===v}">${l}</button>`).join('')}</div>
      <input class="n" data-f="nombre" value="${esc(s.nombre||'')}" placeholder="Nombre del sitio" aria-label="Nombre del sitio"><input data-f="ciudad" value="${esc(s.ciudad||'')}" placeholder="Ciudad" aria-label="Ciudad"><textarea data-f="nota" rows="2" placeholder="Tu recomendación (opcional)" aria-label="Tu recomendación">${esc(s.nota||'')}</textarea></li>`).join('')}
      <li class="addrec" role="button" tabindex="0" data-a="addrec">+ Añadir sitio</li></ul></div>
    <div class="tvx-foot"><span class="tve-st"></span><button type="button" class="tve-btn del" data-a="del">Quitar país</button><button type="button" class="tve-btn tve-pub" data-a="pub">Guardar y publicar</button></div>`;
  const slot=$('.slot',fs);dropOn(slot,f=>{t.cartel=asObj(f[0]);mark();edit(i,true)});dropOn($('.phg',fs),f=>{t.fotos.push(...f.map(asObj));mark();edit(i,true)});
  $('.when',fs).oninput=e=>{t.cuando=e.target.value;mark()};
  $$('.tv-rec li[data-k]',fs).forEach(li=>{const s=t.sitios[+li.dataset.k];$$('[data-f]',li).forEach(inp=>inp.oninput=()=>{s[inp.dataset.f]=inp.value;mark()})});
  fs.onclick=e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
    if(a==='x')closeEd();else if(a==='p')edit(i-1);else if(a==='n')edit(i+1);
    else if(a==='cartel')pick(false,f=>{if(f[0]){t.cartel=asObj(f[0]);mark();edit(i,true)}});
    else if(a==='addph')pick(true,f=>{t.fotos.push(...f.map(asObj));mark();edit(i,true)});
    else if(a==='rmph'){t.fotos.splice(+b.dataset.k,1);mark();edit(i,true)}
    else if(a==='addrec'){t.sitios.push({nombre:'',ciudad:'',tipo:'comer',nota:''});mark();edit(i,true);const ins=$$('.tv-rec input.n',fs);ins[ins.length-1].focus()}
    else if(a==='rmrec'){t.sitios.splice(+b.closest('li').dataset.k,1);mark();edit(i,true)}
    else if(a==='tipo'){t.sitios[+b.closest('li').dataset.k].tipo=b.dataset.v;mark();$$('[data-a=tipo]',b.closest('li')).forEach(x=>x.setAttribute('aria-pressed',x===b))}
    else if(a==='del'){if(b.dataset.sure){TRIPS.splice(i,1);mark();mapDraw&&mapDraw();TRIPS.length?edit(i):closeEd()}else{b.dataset.sure=1;b.textContent='¿Seguro? Pulsa otra vez'}}
    else if(a==='pub')publish()};
  $('.addrec',fs).onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.click()}};
  if(fs.hidden!==false||!fs.dataset.on){fs.hidden=false;fs.dataset.on=1;document.documentElement.style.overflow='hidden'}
  fs.scrollTop=keepScroll?y:0;if(!keepScroll)$('.tv-x',fs).focus({preventScroll:true});bar()}
function closeEd(){const fs=$('#tvedfs');if(!fs)return;fs.hidden=true;delete fs.dataset.on;document.documentElement.style.overflow='';mapDraw&&mapDraw()}

$$('.win').forEach(w=>{if(w.id==='w-travel')w.remove()});
OPEN.travel();bar();
})();
