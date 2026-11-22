var SEED={role:"client",cur:0,log:[],rooms:[
{name:"Living room",sub:"5.2 × 4.1 m, north windows",options:[
{title:"Option A: Open concept minimalist",desc:"Maximizes natural light with a seamless flow into the dining area.",pal:["#e9e2d3","#2f5d5a","#d9992b"],lay:[[10,10,180,100,"#f4f1e8"],[30,70,70,22,"#2f5d5a"],[130,18,45,45,"#d9992b"],[110,80,60,22,"#b9a27a"]],mats:["Oak herringbone floor|₹1,450/sq ft","Teal wool sofa|₹78,000","Plaster wall, warm white|₹95/sq ft"],st:"pending",rev:1,cm:[]},
{title:"Option B: Media wall",desc:"TV wall with built-in storage, sofa centered.",pal:["#d7dad4","#3b3f46","#8a9a7b"],lay:[[10,10,180,100,"#f1f2ee"],[15,15,12,90,"#3b3f46"],[70,40,70,30,"#8a9a7b"],[155,25,28,60,"#b8bcb4"]],mats:["Vitrified tile|₹210/sq ft","Walnut veneer panel|₹260/sq ft","Charcoal fabric sofa|₹64,000"],st:"pending",rev:1,cm:[]}]},
{name:"Kitchen",sub:"Modular, 3.4 × 2.8 m",options:[
{title:"Option A: L-shaped",desc:"Counter along two walls with a breakfast ledge.",pal:["#f2efe6","#26413f","#c0392b"],lay:[[10,10,180,100,"#f6f4ee"],[10,10,180,24,"#26413f"],[10,10,24,100,"#26413f"],[100,70,70,16,"#b9a27a"]],mats:["Matte laminate shutters|₹1,150/sq ft","Quartz countertop|₹320/sq ft","Brass pull handles|₹180 each"],st:"pending",rev:1,cm:[]},
{title:"Option B: Island",desc:"Central island with seating for three.",pal:["#e6e9e4","#40505a","#d9992b"],lay:[[10,10,180,100,"#f2f3ef"],[10,10,180,20,"#40505a"],[55,55,90,30,"#d9992b"]],mats:["Acrylic shutters|₹1,600/sq ft","Granite countertop|₹260/sq ft","Concealed handles|₹120 each"],st:"pending",rev:1,cm:[]}]},
{name:"Master bedroom",sub:"4.0 × 3.6 m, attached bath",options:[
{title:"Option A: Calm bedroom",desc:"Bed on the long wall, wardrobe wall in sage.",pal:["#e8e6df","#8a9a7b","#5a4a3c"],lay:[[10,10,180,100,"#f3f2ec"],[60,25,60,70,"#8a9a7b"],[10,10,30,100,"#5a4a3c"]],mats:["Engineered wood floor|₹380/sq ft","Sage laminate wardrobe|₹1,100/sq ft","Linen curtains|₹5,200"],st:"pending",rev:1,cm:[]}]}
]};
var S;try{S=JSON.parse(localStorage.getItem("atelier2"))}catch(e){}
if(!S||!S.rooms)S=JSON.parse(JSON.stringify(SEED));
function save(){try{localStorage.setItem("atelier2",JSON.stringify(S))}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
function now(){return new Date().toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}
var LBL={pending:"Awaiting review",approved:"Approved",changes:"Changes requested",rejected:"Rejected"};
/* hero schemes */
var SC=[["Sage",{w:"#dfe7dc",f:"#c9a679",s:"#4f6b5a",a:"#e0a458"}],["Clay",{w:"#f2dfd2",f:"#8a6a52",s:"#b5573a",a:"#2f3e46"}],["Ink",{w:"#dfe3ea",f:"#bfae95",s:"#27364a",a:"#d9b44a"}],["Mist",{w:"#eceef0",f:"#d8c3a5",s:"#8aa1b1",a:"#5b6c5d"}]];
function scheme(n){SC.forEach(function(c,i){document.getElementById("ch"+i).className="chip"+(i==n?" on":"")});
 document.querySelectorAll(".p").forEach(function(e){e.style.fill=SC[n][1][e.getAttribute("data-k")]})}
document.getElementById("chips").innerHTML=SC.map(function(c,i){var v=c[1];return '<button class="chip" id="ch'+i+'" onclick="scheme('+i+')"><span><i style="background:'+v.w+'"></i><i style="background:'+v.s+'"></i><i style="background:'+v.a+'"></i></span>'+c[0]+'</button>'}).join("");
scheme(0);
/* approval studio */
function roomSt(r){var o=r.options;if(o.some(function(x){return x.st=="approved"}))return"approved";if(o.some(function(x){return x.st=="changes"}))return"changes";if(o.every(function(x){return x.st=="rejected"}))return"rejected";return"pending"}
function log(t){S.log.unshift(now()+": "+t);S.log=S.log.slice(0,12)}
function setRole(r){S.role=r;save();draw()}
function pick(i){S.cur=i;save();draw()}
function opt(i){return S.rooms[S.cur].options[i]}
function setSt(i,st){var o=opt(i),n=S.rooms[S.cur].name;
 if(st=="changes"){var t=prompt("What should change?","");if(t===null)return;if(t.trim())o.cm.push({who:"client",t:now(),text:t.trim()})}
 o.st=st;log("Client "+(st=="approved"?"approved":st=="rejected"?"rejected":"requested changes to")+" "+o.title+" ("+n+")");save();draw()}
function reviseDone(i){var o=opt(i);o.rev++;o.st="pending";o.cm.push({who:"designer",t:now(),text:"Revision v"+o.rev+" is ready for your review."});log("Designer sent v"+o.rev+" of "+o.title+" ("+S.rooms[S.cur].name+")");save();draw()}
function tog(i,k){var m=opt(i);m.ok=m.ok||{};m.ok[k]=!m.ok[k];save();draw()}
function addC(i){var v=document.getElementById("c"+i).value.trim();if(!v)return;opt(i).cm.push({who:S.role,t:now(),text:v});log((S.role=="client"?"Client":"Designer")+" commented on "+opt(i).title);save();draw()}
var PH={};
function R(x,y,w,h,f,r,e){return `<rect x='${x}' y='${y}' width='${w}' height='${h}' rx='${r||0}' fill='${f}' ${e||''}/>`}
function kitchen(oi,o){var p=o.pal,W=p[0],M=p[1],A=p[2],i,x,y,t='',G=function(id,a,b,c){return `<linearGradient id='${id}' x1='0' y1='0' x2='${a}' y2='${b}'>${c}</linearGradient>`},S=function(o2,c,op){return `<stop offset='${o2}' stop-color='${c}' stop-opacity='${op==null?1:op}'/>`};
 var s=`<svg class='pic' viewBox='0 0 400 260' role='img' aria-label='Rendered view of ${esc(o.title)}'><defs>`+G('kl',1,0,S(0,'#fff',.5)+S(1,'#fff',0))+G('kf',0,1,S(0,'#d9b98d')+S(1,'#b48a5c'))+G('kc',0,1,S(0,'#fff')+S(1,'#d9d6cf'))+G('ks',0,1,S(0,'#fff',.22)+S(1,'#fff',0))+G('kh',1,0,S(0,'#c9ced2')+S(.5,'#f2f4f5')+S(1,'#aab1b6'))+G('ksky',0,1,S(0,'#bfe0f5')+S(1,'#eaf5fb'))+`<radialGradient id='kv' cx='.5' cy='.5' r='.75'>${S(.6,'#000',0)+S(1,'#000',.28)}</radialGradient></defs>`+R(0,0,400,205,W)+R(0,0,400,205,'url(#kl)')+R(0,200,400,60,'url(#kf)');
 for(x=0;x<400;x+=40)s+=`<path d='M${x} 200L${x-16} 260' stroke='#6b4a2a' stroke-opacity='.18'/>`;
 s+=R(100,96,272,56,'#fbfaf7');for(y=96;y<=150;y+=9){t+=`M100 ${y}H372`;for(x=100+((y-96)/9%2?12:0);x<372;x+=24)t+=`M${x} ${y}v9`}
 s+=`<path d='${t}' stroke='#000' stroke-opacity='.12' fill='none'/>`;
 s+=R(28,36,72,94,'#fff',2)+R(33,41,62,84,'url(#ksky)')+`<path d='M64 41V125M33 83H95' stroke='#fff' stroke-width='3'/>`+R(24,128,80,5,'#f3f1ec',2)+R(40,118,12,10,A,2)+`<ellipse cx='42' cy='108' rx='5' ry='11' fill='#4f8a5b' transform='rotate(-20 42 108)'/><ellipse cx='50' cy='106' rx='5' ry='12' fill='#3f7a4d' transform='rotate(18 50 106)'/>`;
 [[108,60],[172,60],[302,68]].forEach(function(d){s+=R(d[0],24,d[1],72,M,3)+R(d[0]+6,30,d[1]-12,60,'none',2,`stroke='#fff' stroke-opacity='.35'`)+R(d[0],24,d[1],72,'url(#ks)',3)+R(d[0]+d[1]-10,70,3,16,A,1)});
 s+=`<path d='M240 98L254 62H282L296 98Z' fill='url(#kh)'/>`+R(260,22,16,42,'url(#kh)')+R(24,150,348,10,'url(#kc)',2)+R(24,160,348,3,'#000',0,`opacity='.15'`);
 for(i=0;i<6;i++){x=28+i*57.3;s+=R(x,163,55,48,M,3)+R(x+5,168,45,38,'none',2,`stroke='#fff' stroke-opacity='.3'`)+R(x,163,55,48,'url(#ks)',3)+R(x+20,167,15,3,A,1)}
 s+=R(28,211,344,5,'#000',0,`opacity='.4'`)+R(48,146,44,5,'#8f9aa1',2)+`<path d='M70 146V132Q70 126 78 126' stroke='#555' stroke-width='3' fill='none'/>`+R(238,147,56,3,'#1c1c1c',1)+R(250,132,30,15,'#9aa5ab',3)+R(247,130,36,4,'#c3cbd0',2)+R(112,144,34,6,'#b9935f',2)+`<ellipse cx='320' cy='148' rx='16' ry='5' fill='#fff'/><circle cx='313' cy='142' r='5' fill='#e8863a'/><circle cx='320' cy='140' r='5' fill='#c0392b'/><circle cx='327' cy='142' r='5' fill='#8bb04c'/>`+R(346,134,12,16,'#e9e4da',3);
 if(oi){s+=R(56,210,288,30,A,5)+R(56,210,288,30,'url(#ks)',5)+R(44,200,312,11,'url(#kc)',3)+R(44,211,312,3,'#000',0,`opacity='.15'`)+`<ellipse cx='200' cy='198' rx='18' ry='5' fill='#fff'/><circle cx='194' cy='193' r='5' fill='#e8863a'/><circle cx='205' cy='193' r='5' fill='#8bb04c'/>`;[120,200,280].forEach(function(c){s+=`<path d='M${c} 0V108' stroke='#333'/><path d='M${c-14} 124Q${c} 104 ${c+14} 124Z' fill='#222'/><ellipse cx='${c}' cy='125' rx='14' ry='3' fill='#ffd988'/>`+R(c-13,243,26,6,'#2b2b2b',3)+`<path d='M${c-8} 249L${c-10} 259M${c+8} 249L${c+10} 259' stroke='#2b2b2b' stroke-width='3'/>`})}
 else{s+=R(70,236,150,14,A,3,`opacity='.85'`)+R(236,206,150,9,'#b9935f',3)+R(246,215,5,36,'#8f6d3f')+R(372,215,5,36,'#8f6d3f')+R(262,236,26,6,'#2b2b2b',3)+R(322,236,26,6,'#2b2b2b',3)}
 return s+`<polygon points='30,130 100,130 330,260 120,260' fill='#fff' opacity='.12'/>`+R(0,0,400,260,'url(#kv)')+'</svg>'}
function scene(ri,oi,o){if(ri==1)return kitchen(oi,o);if(PH[ri+'-'+oi])return `<img class='pic' src='${PH[ri+'-'+oi]}' alt='Photo of ${esc(o.title)}' style='aspect-ratio:400/260;object-fit:cover'>`;var p=o.pal,W=p[0],M=p[1],A=p[2],i,x,t='',s=`<svg class='pic' viewBox='0 0 400 260' role='img' aria-label='Rendered view of ${esc(o.title)}'>`+R(0,0,400,192,W)+R(0,192,400,68,'#c9a97e');
 for(x=0;x<400;x+=44)s+=`<path d='M${x} 192L${x-18} 260' stroke='#000' stroke-opacity='.07'/>`;
 s+=R(0,192,400,5,'#000',0,`opacity='.12'`);
 if(ri==1){for(x=40;x<=360;x+=20)t+=`M${x} 100V150`;for(i=100;i<=150;i+=17)t+=`M40 ${i}H360`;
  s+=R(40,100,320,50,'#fff',0,`opacity='.55'`)+`<path d='${t}' stroke='#000' stroke-opacity='.1'/>`;
  for(i=0;i<6;i++){x=40+i*54;s+=R(x,28,52,66,M,3)+R(x+(i%2?6:43),66,3,18,A,1)+R(x,160,52,50,M,3)+R(x+18,164,16,3,A,1)}
  s+=R(30,150,340,10,'#efede8',2)+R(90,146,52,5,'#9aa5ab',2)+`<path d='M116 146V130Q116 124 124 124' stroke='#444' stroke-width='3' fill='none'/>`+R(228,146,62,3,'#222')+R(236,100,46,6,'#222',2);
  if(oi){s+=R(70,204,260,40,A,4)+R(58,196,284,10,'#efede8',3);[130,200,270].forEach(function(c){s+=`<path d='M${c} 0V22' stroke='#333'/><ellipse cx='${c}' cy='28' rx='15' ry='9' fill='#222'/><ellipse cx='${c}' cy='38' rx='14' ry='4' fill='#ffd27a' opacity='.8'/>`});[120,200,280].forEach(function(c){s+=R(c-12,238,24,6,'#2b2b2b',3)+`<path d='M${c-8} 244L${c-10} 258M${c+8} 244L${c+10} 258' stroke='#2b2b2b' stroke-width='3'/>`})}
  else{s+=R(215,198,160,10,'#b9a27a',3)+R(225,208,6,40,'#8f7b57')+R(360,208,6,40,'#8f7b57')+R(250,226,26,6,'#2b2b2b',3)+R(310,226,26,6,'#2b2b2b',3)}}
 else if(ri==0){if(!oi){s+=R(250,36,120,100,'#cfe6f2')+`<path d='M310 36V136M250 86H370' stroke='#fff' stroke-width='4'/>`+R(70,48,92,62,'#fff',0,`stroke='#0002'`)+R(78,56,76,46,A)+`<ellipse cx='150' cy='240' rx='120' ry='16' fill='${A}' opacity='.8'/>`+R(48,132,190,52,M,16)+R(42,160,202,52,M,14)+R(58,166,84,32,'#fff',10,`opacity='.15'`)+R(146,166,84,32,'#fff',10,`opacity='.15'`)+`<path d='M300 214V130' stroke='#2a2a2a' stroke-width='3'/><circle cx='300' cy='122' r='18' fill='${A}'/>`+R(336,178,30,36,M,6)+`<ellipse cx='344' cy='168' rx='9' ry='20' fill='#4f8a5b' transform='rotate(-18 344 168)'/><ellipse cx='362' cy='166' rx='9' ry='20' fill='#3f7a4d' transform='rotate(16 362 166)'/>`}
  else{s+=R(20,24,230,168,M,4)+R(70,56,130,70,'#0b0b0b',3)+R(76,62,50,58,'#fff',2,`opacity='.06'`)+R(262,30,60,162,A,3)+`<path d='M262 80H322M262 130H322' stroke='#fff' stroke-opacity='.6' stroke-width='3'/>`+R(344,60,40,60,'#fff',0,`stroke='#0002'`)+R(90,236,230,16,M,8,`opacity='.5'`)+R(110,160,190,56,A,16)+R(122,170,80,30,'#fff',10,`opacity='.18'`)+R(210,170,80,30,'#fff',10,`opacity='.18'`)+R(318,184,26,34,'#b9a27a',4)}}
 else{s+=R(0,28,52,164,M,2)+`<path d='M26 28V192M0 110H52' stroke='#fff' stroke-opacity='.5'/>`+R(320,40,64,110,'#cfe6f2')+R(310,34,14,124,'#e9e2d3',3)+R(110,64,180,86,M,12)+R(92,138,216,72,'#f4f2ee',12)+R(92,164,216,46,A,8)+R(118,124,72,28,'#fff',9)+R(210,124,72,28,'#fff',9)+R(62,150,32,48,M,4)+R(306,150,32,48,M,4)+R(70,134,16,14,A,3)+R(314,134,16,14,A,3)+`<ellipse cx='200' cy='244' rx='130' ry='12' fill='${A}' opacity='.35'/>`}
 return s+'</svg>'}
function plan(o){var s='<svg class="plan" viewBox="0 0 200 120" role="img" aria-label="Floor plan for '+esc(o.title)+'">';
 o.lay.forEach(function(r){s+='<rect x="'+r[0]+'" y="'+r[1]+'" width="'+r[2]+'" height="'+r[3]+'" rx="4" fill="'+r[4]+'" stroke="#15191c" stroke-opacity=".2"/>'});return s+"</svg>"}
function draw(){
 document.getElementById("rc").className=S.role=="client"?"on":"";document.getElementById("rd").className=S.role=="designer"?"on":"";
 var done=S.rooms.filter(function(r){return roomSt(r)=="approved"}).length,pc=Math.round(done/S.rooms.length*100);
 document.getElementById("prog").innerHTML='<div class="row"><b>'+(done==S.rooms.length?"All rooms approved":S.rooms.some(function(r){return roomSt(r)=="changes"})?"Revisions in progress":"In review")+'</b><span class="empty">'+done+' of '+S.rooms.length+' rooms approved</span></div><div class="bar"><i style="width:'+pc+'%"></i></div>';
 document.getElementById("tabs").innerHTML=S.rooms.map(function(r,i){var st=roomSt(r);return '<button class="tab'+(i==S.cur?" on":"")+'" role="tab" aria-selected="'+(i==S.cur)+'" onclick="pick('+i+')"><b>'+esc(r.name)+'</b><span class="badge s-'+st+'">'+LBL[st]+'</span></button>'}).join("");
 var r=S.rooms[S.cur],h='<p class="empty" style="margin:0 0 12px">'+esc(r.sub)+'</p><div class="grid">';
 r.options.forEach(function(o,i){
  h+='<article class="card'+(o.st=="approved"?" approved":"")+'">'+'<div class="ph">'+scene(S.cur,i,o)+'<div class="mini">'+plan(o)+'</div></div><div class="in"><div class="row"><h4>'+esc(o.title)+'</h4><span class="badge s-'+o.st+'">'+LBL[o.st]+' · v'+o.rev+'</span></div><p style="margin:4px 0 12px;color:var(--mute)">'+esc(o.desc)+'</p><div class="pal" aria-label="Color scheme">'+o.pal.map(function(c){return '<i style="background:'+c+'" title="'+c+'"></i>'}).join("")+'</div><h5>Material selections</h5>';
  o.mats.forEach(function(m,k){var p=m.split("|"),on=o.ok&&o.ok[k];h+='<button class="mat'+(on?" ok":"")+'" aria-pressed="'+!!on+'" onclick="tog('+i+','+k+')"><span>'+(on?"✓":"")+'</span>'+esc(p[0])+'<em>'+esc(p[1])+'</em></button>'});
  h+='<h5>Comments</h5>'+(o.cm.length?o.cm.map(function(c){return '<div class="cm '+c.who+'"><small>'+(c.who=="client"?"Client":"Designer")+', '+c.t+'</small>'+esc(c.text)+'</div>'}).join(""):'<p class="empty">No comments yet. Add the first note below.</p>')+'<div class="add"><input type="text" id="c'+i+'" aria-label="Add a comment" placeholder="Write a comment" onkeydown="if(event.key===\'Enter\')addC('+i+')"><button class="btn" onclick="addC('+i+')">Post</button></div>';
  if(S.role=="client")h+='<div class="acts"><button class="btn ok" onclick="setSt('+i+',\'approved\')">Approve</button><button class="btn warn" onclick="setSt('+i+',\'changes\')">Request changes</button><button class="btn bad" onclick="setSt('+i+',\'rejected\')">Reject</button></div>';
  else h+='<div class="acts">'+(o.st=="changes"?'<button class="btn pri" onclick="reviseDone('+i+')">Send revision v'+(o.rev+1)+'</button>':'<span class="empty">'+(o.st=="approved"?"Client approved this option.":o.st=="rejected"?"Client rejected this option.":"Waiting for client feedback.")+'</span>')+'</div>';
  h+='</div></article>'});
 document.getElementById("main").innerHTML=h+"</div>";
 document.getElementById("log").innerHTML=S.log.length?S.log.map(function(l){return "<li>"+esc(l)+"</li>"}).join(""):'<li class="empty">Nothing yet. Approvals, comments and revisions appear here.</li>';
}
draw();
