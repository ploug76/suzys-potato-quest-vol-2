/* game.js — Suzy's Potato Quest 2: The County Fair */
(function(){
'use strict';
const g=K.g,TAU=Math.PI*2,A=ART;K.ns='spq2';
const DEF={unl:1,stars:{},coins:0,best:0,hats:['straw'],hat:'straw',upg:{heart:0,shovel:0,boots:0},story:false,ribbons:{},done:false,seenW:{}};
let SV=Object.assign({},DEF,K.save.get('data',{}));SV.upg=Object.assign({},DEF.upg,SV.upg||{});
const save=()=>K.save.set('data',SV);
const WORLDS=[
 {name:'Sunny Meadow',sky:['#7cc8f2','#c9ecff'],dirt:['#c8955e','#b07c47','#9a6a3c','#86592f'],grass:'#6cc04a',recipe:'Mashed Potatoes',rk:'mash',emoji:'🥣',
  song:{bpm:132,wave:'triangle',lv:.05,bass:[48,0,55,0,52,0,55,0,53,0,57,0,55,0,52,0],lead:[72,74,76,0,79,0,76,74,72,0,74,76,74,0,72,0,77,76,74,0,72,0,74,76,79,0,76,0,74,72,74,0]}},
 {name:'Rocky Ridge',sky:['#f2b880','#ffe2b8'],dirt:['#b9a089','#a08670','#86705c','#6f5c4b'],grass:'#8fae4a',recipe:'Golden Fries',rk:'fries',emoji:'🍟',
  song:{bpm:140,wave:'square',lv:.03,drum:1,bass:[45,0,45,52,0,45,50,0,43,0,43,50,0,43,48,0],lead:[69,0,72,74,0,72,69,0,67,0,69,72,0,0,74,76,77,0,76,74,0,72,69,0,67,69,72,0,69,0,0,0]}},
 {name:'Moonlight Patch',sky:['#1b2550','#3c3f7a'],dirt:['#6e5a7e','#5d4b6c','#4c3d5a','#3d304a'],grass:'#3f7f5a',recipe:'Baked Potato',rk:'baked',emoji:'🥔',night:1,
  song:{bpm:108,wave:'sine',lv:.06,bass:[45,0,0,0,52,0,0,0,50,0,0,0,48,0,0,0],lead:[76,0,79,0,81,0,79,76,74,0,76,0,72,0,0,0,76,0,79,0,84,0,83,79,81,0,79,0,76,0,0,0]}},
 {name:"Grandma's Garden",sky:['#9be3c9','#e9fff5'],dirt:['#a8784e','#946640','#7e5535','#69452a'],grass:'#4fb36b',recipe:'Fair Potato Salad',rk:'salad',emoji:'🥗',
  song:{bpm:126,wave:'triangle',lv:.05,drum:1,bass:[48,0,52,0,55,0,52,0,50,0,53,0,57,0,53,0],lead:[79,77,76,0,72,0,76,79,81,0,79,77,76,0,0,0,77,76,74,0,71,0,74,77,79,0,77,76,74,0,72,0]}}];
const NL=16;const worldOf=L=>Math.floor((L-1)/4),isKitchen=L=>L%4===0;
K.loadLogo('logo-boh.png');
/* ---------------- common UI bits */
function bg(w,t){const W=WORLDS[w||0];const gr=g.createLinearGradient(0,0,0,K.H);gr.addColorStop(0,W.sky[0]);gr.addColorStop(1,W.sky[1]);g.fillStyle=gr;g.fillRect(0,0,K.W,K.H);
 if(W.night){for(let i=0;i<40;i++){const x=(i*97.3%1)*K.W,y=(i*61.7%1)*K.H*.6;g.fillStyle='rgba(255,255,255,'+(.4+.4*Math.sin(K.t*2+i))+')';g.fillRect((i*137)%K.W,(i*71)%(K.H*.5),2,2)}A.E(K.W*.8,K.H*.12,26*K.S,26*K.S,'#fff7d6')}
 else{A.E(K.W*.85,K.H*.1,28*K.S,28*K.S,'#ffe066');for(let i=0;i<3;i++){const x=((K.t*8*(i+1)+i*300)%(K.W+200))-100,y=K.H*(.08+i*.07);A.E(x,y,40*K.S,14*K.S,'rgba(255,255,255,.85)');A.E(x+25*K.S,y-6*K.S,28*K.S,14*K.S,'rgba(255,255,255,.85)')}}}
function ground(y,w){const W=WORLDS[w||0];g.fillStyle=W.dirt[0];g.fillRect(0,y,K.W,K.H-y);g.fillStyle=W.grass;g.fillRect(0,y-8*K.S,K.W,14*K.S);for(let x=0;x<K.W;x+=10*K.S){g.beginPath();g.moveTo(x,y-6*K.S);g.lineTo(x+5*K.S,y-16*K.S);g.lineTo(x+10*K.S,y-6*K.S);g.fill()}}
function panel(x,y,w,h,col){g.save();K.rr(x,y,w,h,18*K.S);g.fillStyle=col||'rgba(255,248,230,.95)';g.fill();g.lineWidth=4*K.S;g.strokeStyle='#e8892b';g.stroke();g.restore()}
function iconBtn(id,x,y,icon,cb,col){const s=48*K.S;return K.button({id,x,y,w:s,h:s,r:s/2,label:icon,fs:22*K.S,color:col||'#7048e8',cb})}
function muteBtn(x,y){return iconBtn('mute',x,y,K.muted?'🔇':'🔊',()=>K.toggleMute(),'#9c36b5')}
function titleText(cx,y,sz){const word="Suzy's",cols=['#ffd23f','#ff8fb8','#8fe9ff','#b9ff8f','#ff9f43'];g.save();g.font=K.font(sz*.75);let w=g.measureText(word).width;let x=cx-w/2;
 for(let i=0;i<word.length;i++){const ch=word[i];const cw=g.measureText(ch).width;K.text(ch,x+cw/2,y+Math.sin(K.t*3+i)*3*K.S,sz*.75,cols[i%5],{stroke:'#5b3a1e',sw:sz*.12});x+=cw}
 const w2='Potato Quest 2';g.font=K.font(sz);w=g.measureText(w2).width;x=cx-w/2;for(let i=0;i<w2.length;i++){const ch=w2[i];const cw=g.measureText(ch).width;K.text(ch,x+cw/2,y+sz*.95+Math.sin(K.t*3+i*.7)*3*K.S,sz,cols[(i+2)%5],{stroke:'#5b3a1e',sw:sz*.12});x+=cw}g.restore()}
/* ---------------- TITLE */
const Title={enter(){K.music.play(WORLDS[0].song)},
 draw(){bg(0);const S=K.S,W=K.W,H=K.H,P=K.portrait,sf=K.safe;let charR,btnTop,tb;
  if(P){const bw=Math.min(W-40*S,360*S),bh=58*S,gap=12*S;const total=bh*1.25+gap+bh+gap+bh*.85;btnTop=H-sf.b-18*S-total;
   const tby=sf.t+64*S,tbh=Math.min(150*S,H*.17);tb={x:(W-Math.min(W-30*S,400*S))/2,y:tby,w:Math.min(W-30*S,400*S),h:tbh};
   const gy=btnTop-26*S;barn(W*.8,gy,Math.min(150*S,(gy-tb.y-tb.h)*.55));fence(gy);ground(gy,0);const sh=Math.min(250*S,gy-(tb.y+tb.h)-40*S);
   panel(tb.x,tb.y,tb.w,tb.h);titleText(W/2,tb.y+tb.h*.3,Math.min(44*S,tb.w/9.2));K.text('The County Fair',W/2,tb.y+tb.h*.86,17*S,'#5b3a1e',{stroke:false});
   charR=A.suzy(W/2,gy,sh,{mode:'wave',hat:SV.hat,dir:1});K.markChar(charR.x,charR.y,charR.w,charR.h,'suzy');
   const mr=A.mole(W/2-sh*.62,gy,sh*.36,{dir:1,ph:K.t*1.5,moving:true});K.markChar(mr.x,mr.y,mr.w,mr.h,'mole');
   A.potato(W/2+sh*.55,gy-sh*.1,sh*.1,sh*.075,{seed:3,gold:true,shine:true});
   let y=btnTop;const x=(W-bw)/2;K.button({id:'play',x,y,w:bw,h:bh*1.25,label:SV.unl>1?'▶ Continue':'▶ Play',color:'#2f9e44',primary:true,fs:30*S,cb:playNext});y+=bh*1.25+gap;
   const hw=(bw-gap)/2;K.button({id:'levels',x,y,w:hw,h:bh,label:'🗺️ Levels',color:'#1c7ed6',cb:()=>K.go(MapS)});K.button({id:'shop',x:x+hw+gap,y,w:hw,h:bh,label:'👒 Shop',color:'#e8590c',cb:()=>K.go(Shop)});y+=bh+gap;
   K.button({id:'help',x,y,w:hw,h:bh*.85,label:'❓ How to Play',color:'#5f3dc4',cb:()=>K.go(Help)});K.button({id:'story',x:x+hw+gap,y,w:hw,h:bh*.85,label:'📖 Story',color:'#c2255c',cb:()=>K.go(storyScene(()=>K.go(Title)))});
  }else{const colW=W*.5;tb={x:sf.l+16*S,y:sf.t+12*S,w:colW-32*S,h:Math.min(118*S,H*.3)};const gy=H-sf.b-20*S;
   barn(tb.x+tb.w*.85,gy,Math.min(120*S,(gy-tb.y-tb.h)*.6));fence(gy);ground(gy,0);panel(tb.x,tb.y,tb.w,tb.h);titleText(tb.x+tb.w/2,tb.y+tb.h*.3,Math.min(38*S,tb.w/9.2));K.text('The County Fair',tb.x+tb.w/2,tb.y+tb.h*.86,15*S,'#5b3a1e',{stroke:false});
   const sh=Math.min(gy-(tb.y+tb.h)-24*S,200*S);charR=A.suzy(tb.x+tb.w/2,gy,sh,{mode:'wave',hat:SV.hat});K.markChar(charR.x,charR.y,charR.w,charR.h,'suzy');
   const mr=A.mole(tb.x+tb.w/2-sh*.6,gy,sh*.34,{dir:1,ph:K.t*1.5,moving:true});K.markChar(mr.x,mr.y,mr.w,mr.h,'mole');
   const bw=Math.min(W*.42,340*S),x=W*.5+(W*.5-bw)/2-sf.r/2,bh=Math.min(54*S,(H-sf.t-sf.b-70*S)/5.2),gap=10*S;let y=Math.max(sf.t+64*S,(H-(bh*4.3+gap*3))/2);
   K.button({id:'play',x,y,w:bw,h:bh*1.3,label:SV.unl>1?'▶ Continue':'▶ Play',color:'#2f9e44',primary:true,fs:28*S,cb:playNext});y+=bh*1.3+gap;
   const hw=(bw-gap)/2;K.button({id:'levels',x,y,w:hw,h:bh,label:'🗺️ Levels',color:'#1c7ed6',cb:()=>K.go(MapS)});K.button({id:'shop',x:x+hw+gap,y,w:hw,h:bh,label:'👒 Shop',color:'#e8590c',cb:()=>K.go(Shop)});y+=bh+gap;
   K.button({id:'help',x,y,w:hw,h:bh,label:'❓ How to Play',color:'#5f3dc4',cb:()=>K.go(Help)});K.button({id:'story',x:x+hw+gap,y,w:hw,h:bh,label:'📖 Story',color:'#c2255c',cb:()=>K.go(storyScene(()=>K.go(Title)))});y+=bh+gap;
   K.text('🪙 '+SV.coins+'   ★ '+totalStars()+'/48',x+bw/2,y+bh*.4,17*S,'#fff')}
  muteBtn(W-sf.r-60*S,sf.t+8*S);
  if(P)K.text('🪙 '+SV.coins+'   ★ '+totalStars()+'/48',W/2,sf.t+34*S,17*S,'#fff');
  const avoid=K.btns.concat(K.charRects,[tb]);for(const c of ['tl','br','bl'])if(K.drawLogo(c,64*S,avoid))break},
 back(){}};
function barn(x,y,h){const w=h*1.1;g.fillStyle='#c92a2a';g.fillRect(x-w/2,y-h*.65,w,h*.65);g.fillStyle='#a51d1d';g.beginPath();g.moveTo(x-w*.6,y-h*.62);g.lineTo(x,y-h);g.lineTo(x+w*.6,y-h*.62);g.closePath();g.fill();
 g.strokeStyle='#fff';g.lineWidth=Math.max(2,h*.03);g.strokeRect(x-w*.18,y-h*.42,w*.36,h*.42);g.beginPath();g.moveTo(x-w*.18,y-h*.42);g.lineTo(x+w*.18,y);g.moveTo(x+w*.18,y-h*.42);g.lineTo(x-w*.18,y);g.stroke();g.fillStyle='#fff';g.fillRect(x-w*.08,y-h*.8,w*.16,h*.1)}
function fence(y){const S=K.S;g.fillStyle='#f1e3c8';for(let x=4*S;x<K.W;x+=26*S){g.fillRect(x,y-34*S,8*S,34*S)}g.fillRect(0,y-28*S,K.W,5*S);g.fillRect(0,y-16*S,K.W,5*S)}
function totalStars(){let n=0;for(const k in SV.stars)n+=SV.stars[k];return n}
function playNext(){if(!SV.story){SV.story=true;save();K.go(storyScene(()=>startLevel(1)));return}let L=1;for(let i=1;i<=NL;i++){if(i<=SV.unl)L=i}startLevel(Math.min(L,NL))}
/* ---------------- STORY (with SKIP) */
function storyScene(done){const sc=(f)=>t=>{bg(f.w||0);const gy=K.H*.62;ground(gy,f.w||0);f.d(t,gy)};
 return K.storyScene([
  {who:'Suzy',text:"Big news! The County Fair is coming, and the Golden Spud Trophy goes to the best potato cook in the whole county!",draw:sc({d:(t,gy)=>{A.suzy(K.W*.5,gy,K.H*.24,{mode:'cheer',hat:SV.hat});K.text('🏆',K.W*.5,K.H*.16,60*K.S,'#fff',{stroke:false})}})},
  {who:'Grandma Pearl',text:"Our family recipes need the finest spuds, dearie. Dig them up from four farms, then cook them for the judges.",draw:sc({d:(t,gy)=>{A.judge(K.W*.35,gy,K.H*.22,{coat:'#c2255c',hair:'#ddd',bun:1,glasses:1});A.suzy(K.W*.66,gy,K.H*.22,{mode:'idle',hat:SV.hat,dir:-1})}})},
  {who:'Suzy',text:"But watch out for grumpy moles, sneaky gophers and falling rocks. Dig under a rock to drop it on a mole!",draw:sc({d:(t,gy)=>{A.mole(K.W*.3,gy,K.H*.1,{dir:1,ph:t/30,moving:true,mad:1});A.gopher(K.W*.55,gy,K.H*.12,{dir:-1,ph:t/30,moving:true});A.rock(K.W*.78,gy-K.H*.05,K.H*.09)}})},
  {who:'Suzy',text:"Swipe to dig. Tap to stop. Grab every potato, and find the shiny golden one for an extra star!",draw:sc({d:(t,gy)=>{A.suzy(K.W*.4,gy,K.H*.22,{mode:'run',ph:t/20,hat:SV.hat});A.potato(K.W*.7,gy-K.H*.05,K.H*.04,K.H*.03,{gold:true,shine:true})}})},
  {who:'Suzy',text:"Let's go win that trophy! Spud-tacular!",draw:sc({d:(t,gy)=>{A.suzy(K.W*.5,gy,K.H*.26,{mode:'cheer',hat:SV.hat});K.burst(K.W*.5,K.H*.3,1,{sp:4})}})}],done,{edge:'#e8892b'})}
/* ---------------- MAP / LEVEL SELECT */
const MapS={draw(){bg(0);const S=K.S,W=K.W,H=K.H,sf=K.safe;K.text('Pick a Level',W/2,sf.t+34*S,30*S,'#fff');
  iconBtn('back',sf.l+10*S,sf.t+10*S,'⬅',()=>K.go(Title),'#495057');K.text('🪙 '+SV.coins,W-sf.r-14*S,sf.t+34*S,18*S,'#ffe066',{al:'right'});
  const P=K.portrait,cols=P?1:2,top=sf.t+70*S,gap=10*S,cw=(W-sf.l-sf.r-24*S-gap*(cols-1))/cols,ch=Math.min(P?(H-top-sf.b-16*S-gap*3)/4:(H-top-sf.b-12*S-gap)/2,170*S);
  WORLDS.forEach((Wd,wi)=>{const cx=sf.l+12*S+(wi%cols)*(cw+gap),cy=top+Math.floor(wi/cols)*(ch+gap);g.save();K.rr(cx,cy,cw,ch,16*S);const gr=g.createLinearGradient(0,cy,0,cy+ch);gr.addColorStop(0,Wd.sky[0]);gr.addColorStop(1,Wd.dirt[1]);g.fillStyle=gr;g.fill();g.lineWidth=3*S;g.strokeStyle='#fff';g.stroke();g.restore();
   K.text((wi+1)+'. '+Wd.name,cx+14*S,cy+20*S,19*S,'#fff',{al:'left'});K.text(Wd.emoji+' '+Wd.recipe+(SV.ribbons[wi]?'  '+['','🎗️','🥈','🏅'][SV.ribbons[wi]]:''),cx+cw-12*S,cy+20*S,14*S,'#fff',{al:'right',maxW:cw*.5});
   const bw=Math.min((cw-24*S-3*gap)/4,96*S),bh=Math.min(ch-46*S,74*S);for(let i=0;i<4;i++){const L=wi*4+i+1,lock=L>SV.unl,st=SV.stars[L]||0;
    K.button({id:'L'+L,x:cx+12*S+i*(bw+gap),y:cy+36*S,w:bw,h:bh,label:lock?'🔒':(isKitchen(L)?'🍳':String(L)),sub:lock?'':('★'.repeat(st)+'☆'.repeat(3-st)),color:lock?'#868e96':isKitchen(L)?'#e8590c':'#2f9e44',dis:lock,fs:24*S,primary:L===Math.min(SV.unl,NL),cb:()=>startLevel(L)})}})},
 back(){K.go(Title)}};
/* ---------------- SHOP */
const UPG=[{k:'heart',name:'Extra Heart',desc:'Start with 4 hearts',price:150,max:1},{k:'shovel',name:'Sharp Shovel',desc:'Dig faster',price:120,max:1},{k:'boots',name:'Lucky Boots',desc:'Start each level with Speedy Boots',price:100,max:1}];
const Shop={draw(){bg(3);const S=K.S,W=K.W,H=K.H,sf=K.safe,P=K.portrait;K.text("Suzy's Shop",W/2,sf.t+34*S,30*S,'#fff');iconBtn('back',sf.l+10*S,sf.t+10*S,'⬅',()=>K.go(Title),'#495057');K.text('🪙 '+SV.coins,W-sf.r-14*S,sf.t+34*S,20*S,'#ffe066',{al:'right'});
  const prevH=P?Math.min(H*.22,170*S):Math.min(H*.55,190*S);const pvx=P?W/2:sf.l+W*.18,pvy=P?sf.t+70*S+prevH:H*.5+prevH/2;const r=A.suzy(pvx,pvy,prevH,{mode:'wave',hat:SV.hat});K.markChar(r.x,r.y,r.w,r.h,'suzy');
  const gx=P?sf.l+12*S:W*.36,gw=P?W-sf.l-sf.r-24*S:W*.62-sf.r,gy=P?pvy+16*S:sf.t+64*S;const cols=3,gap=8*S,bw=(gw-gap*(cols-1))/cols,bh=P?60*S:Math.min(50*S,(H-gy-sf.b-30*S)/4.6);let i=0;
  for(const k in A.HATS){const h=A.HATS[k],own=SV.hats.includes(k),on=SV.hat===k;const x=gx+(i%cols)*(bw+gap),y=gy+Math.floor(i/cols)*(bh+gap);i++;
   const lock=k==='crown'&&!SV.done&&!own;K.button({id:'hat-'+k,x,y,w:bw,h:bh,label:h.name,sub:on?'✔ wearing':own?'wear':lock?'win the fair':'🪙 '+h.price,color:on?'#2f9e44':own?'#1c7ed6':lock?'#868e96':'#e8590c',dis:lock,fs:15*S,cb:()=>{if(own){SV.hat=k;save();K.sfx.good()}else if(SV.coins>=h.price){SV.coins-=h.price;SV.hats.push(k);SV.hat=k;save();K.sfx.coin();K.burst(pvx,pvy-prevH,20)}else{K.sfx.bad();K.float('Need more coins',W/2,H*.5,'#ffe066')}}})}
  const uy=gy+2*(bh+gap)+10*S;UPG.forEach((u,j)=>{const own=SV.upg[u.k]>=u.max;const y=uy+j*(bh+gap);K.button({id:'up-'+u.k,x:gx,y,w:gw,h:bh,label:u.name+' — '+u.desc,sub:own?'✔ owned':'🪙 '+u.price,color:own?'#2f9e44':'#7048e8',dis:own,fs:15*S,cb:()=>{if(SV.coins>=u.price){SV.coins-=u.price;SV.upg[u.k]=1;save();K.sfx.coin()}else{K.sfx.bad();K.float('Need more coins',W/2,H*.5,'#ffe066')}}})})},
 back(){K.go(Title)}};
/* ---------------- HELP */
const Help={draw(){bg(0);const S=K.S,W=K.W,H=K.H,sf=K.safe;iconBtn('back',sf.l+10*S,sf.t+10*S,'⬅',()=>K.go(Title),'#495057');K.text('How to Play',W/2,sf.t+34*S,30*S,'#fff');
  const bw=Math.min(W-30*S,620*S),x=(W-bw)/2,y=sf.t+66*S,h=H-y-sf.b-86*S;panel(x,y,bw,h);
  const L=['👆 Swipe up, down, left or right to dig. Tap to stop.','🎮 Controller: stick or D-pad to dig, Start to pause. Keyboard: arrow keys.','🥔 Grab every potato to clear the level. Find the golden one for a bonus star.','🐀 Moles bite, gophers dig after you, and falling rocks bonk. You have 3 hearts.','🪨 Dig under a rock to drop it on a mole!','📦 Crates: ⛑️ hard hat blocks one hit · 👢 speedy boots · 📯 whistle freezes moles · ❤️ heart','🍳 Every 4th level is a kitchen level: cook the recipe for the fair judges.','★ Stars: clear it, grab the golden potato, and take no hits.'];
  let yy=y+20*S;const fs=Math.min(18*S,h/(L.length*2.6));for(const l of L){yy+=K.textBox(l,x+18*S,yy,bw-36*S,fs,'#3a2410',{al:'left',w:700,stroke:false})+fs*.5}
  K.button({id:'ok',x:(W-220*S)/2,y:H-sf.b-72*S,w:220*S,h:58*S,label:'Got it!',primary:true,color:'#2f9e44',cb:()=>K.go(Title)})},back(){K.go(Title)}};
/* ---------------- PLAY (dig) */
const COLS=11;let L,WD,G;
function startLevel(n){L=n;WD=WORLDS[worldOf(n)];if(!SV.seenW[worldOf(n)]&&worldOf(n)>0){SV.seenW[worldOf(n)]=1;save();K.go(worldIntro(worldOf(n),()=>startLevel(n)));return}
 if(isKitchen(n)){K.go(Kitchen,n);return}K.go(Play,n)}
function worldIntro(w,done){const W=WORLDS[w];const lines=[["On to "+W.name+"! "+['','Rocks everywhere, and the gophers dig their own tunnels. Careful!','It is dark at night. Your lantern only shines a little way, and some moles turn into sneaky ghosts!','Grandma\'s own garden. Beetles scurry fast through the tunnels. Last stop before the fair!'][w]],["At the end, cook "+W.recipe+" "+W.emoji+" for the judges."]];
 return K.storyScene(lines.map(l=>({who:'Suzy',text:l[0],draw:t=>{bg(w);const gy=K.H*.62;ground(gy,w);A.suzy(K.W*.5,gy,K.H*.24,{mode:'run',ph:t/22,hat:SV.hat})}})),done)}
function gen(n){const w=worldOf(n),li=(n-1)%4;const R=Math.random;const rows=16+w*2+li;const dug=[...Array(rows)].map(()=>Array(COLS).fill(false));dug[0].fill(true);
 const moles=[],rocks=[],pots=[],crates=[];const k=w*3+li;
 const nm=Math.min(7,2+Math.floor(k*.6));for(let i=0;i<nm;i++){const r=4+Math.floor(R()*(rows-5)),c0=Math.floor(R()*(COLS-3));for(let j=0;j<3;j++)dug[r][c0+j]=true;if(R()<.4&&r+1<rows)dug[r+1][c0+1]=true;
  const type=w>=3&&i%3===2?'beetle':'mole';moles.push(mkEnemy(type,c0+1,r,k))}
 if(w>=1){for(let i=0;i<1+Math.floor(li/2)+(w>=3?1:0);i++){const r=6+Math.floor(R()*(rows-7)),c=1+Math.floor(R()*(COLS-2));dug[r][c]=true;moles.push(mkEnemy('gopher',c,r,k))}}
 const rockAt=(c,r)=>rocks.some(q=>q.c===c&&Math.round(q.r)===r);
 const nr=Math.min(12,3+Math.floor(k/2)+(w===1?4:0));for(let i=0;i<nr;i++){for(let t=0;t<50;t++){const c=Math.floor(R()*COLS),r=2+Math.floor(R()*(rows-4));if(!dug[r][c]&&!dug[r+1][c]&&!rockAt(c,r)&&!(Math.abs(c-5)<=1&&r<4)){rocks.push({c,r,st:'still',tm:0});break}}}
 const free=(c,r)=>r>0&&r<rows&&!dug[r][c]&&!rockAt(c,r)&&!pots.some(p=>p.c===c&&p.r===r)&&!crates.some(p=>p.c===c&&p.r===r);
 const N=8;while(pots.length<N){const r=1+Math.floor(R()*(rows-1)),c=Math.floor(R()*COLS);if(free(c,r))pots.push({c,r,got:false,seed:R()*9})}
 for(let t=0;t<200;t++){const r=Math.floor(rows*.6)+Math.floor(R()*(rows*.4)),c=Math.floor(R()*COLS);if(r<rows&&free(c,r)){pots.push({c,r,got:false,seed:R()*9,gold:true});break}}
 const kinds=['hat','boots','whistle','heart','coin'];for(let i=0;i<3;i++){for(let t=0;t<60;t++){const r=3+Math.floor(R()*(rows-4)),c=Math.floor(R()*COLS);if(free(c,r)){crates.push({c,r,kind:kinds[(i+n)%kinds.length],got:false});break}}}
 return{rows,dug,moles,rocks,pots,crates,N}}
function mkEnemy(type,c,r,k){return{type,c,r,tc:c,tr:r,p:0,x:c,y:r,dir:[Math.random()<.5?1:-1,0],face:1,ph:Math.random(),
 sp:type==='beetle'?2.0:type==='gopher'?.9:Math.min(1.6,.95+.05*k),gt:4+Math.random()*7,ghost:0,dig:0,col:K.pick(['#8d6e63','#6d4c41','#a1887f']),digT:0}}
const Play={play:true,
 enter(n){const lv=gen(n);G=Object.assign(lv,{n,hearts:3+(SV.upg.heart?1:0),score:0,got:0,gold:false,hits:0,inv:1.5,t:0,s:{c:5,r:0,tc:5,tr:0,p:0,x:5,y:0,dir:[0,0],want:[0,0],face:1,ph:0,digT:0,mode:'idle',moved:0},
  pw:{hat:0,boots:SV.upg.boots?10:0,whistle:0},msg:'Level '+n+': dig up '+lv.N+' potatoes!',msgT:3,faceT:0,faceK:0,cam:-1e9,over:false,pops:[]});this.paused=false;K.parts.length=0;K.music.play(WD.song)},
 isDug(c,r){return r===0||(r>0&&r<G.rows&&c>=0&&c<COLS&&G.dug[r][c])},
 rockAt(c,r){return G.rocks.find(k=>k.st!=='gone'&&k.c===c&&Math.round(k.r)===r)},
 canEnter(c,r){return c>=0&&c<COLS&&r>=0&&r<G.rows&&!this.rockAt(c,r)},
 geom(){const S=K.S,sf=K.safe,P=K.portrait,hud=(P?66:52)*S+sf.t;let CW,CH;if(P){CW=Math.min((K.W-sf.l-sf.r)/COLS,64*S);CH=CW*1.25}else{CH=(K.H-hud)/6.6;CW=CH/1.25}
  const gx=(K.W-CW*COLS)/2;return{hud,CW,CH,gx,gy:hud,vh:K.H-hud}},
 update(dt){if(G.over)return;const s=G.s,me=this;G.t+=dt;if(G.inv>0)G.inv-=dt;if(G.msgT>0)G.msgT-=dt;if(G.faceT>0)G.faceT-=dt;for(const k in G.pw)if(G.pw[k]>0&&k!=='hat')G.pw[k]=Math.max(0,G.pw[k]-dt);
  const gm=this.geom();
  // held input (keys / pad) overrides swipe direction while held
  let hx=(K.keys.ArrowRight||K.keys.d?1:0)-(K.keys.ArrowLeft||K.keys.a?1:0),hy=(K.keys.ArrowDown||K.keys.s?1:0)-(K.keys.ArrowUp||K.keys.w?1:0);
  if(!hx&&!hy&&(K.pad.x||K.pad.y)){if(Math.abs(K.pad.x)>Math.abs(K.pad.y))hx=Math.sign(K.pad.x);else hy=Math.sign(K.pad.y)}
  if(hx||hy){s.want=hx?[hx,0]:[0,hy];this._held=true}else if(this._held){this._held=false;s.want=[0,0]}
  if(window.__T&&__T.bot)bot();
  // movement
  if(s.p===0){const w=s.want;if(w&&!(w[0]||w[1]))s.dir=[0,0];else if(w&&this.canEnter(s.c+w[0],s.r+w[1]))s.dir=w;else if(!this.canEnter(s.c+s.dir[0],s.r+s.dir[1]))s.dir=[0,0];
   if(s.dir[0]||s.dir[1]){s.tc=s.c+s.dir[0];s.tr=s.r+s.dir[1]}}
  else if(s.want&&(s.want[0]||s.want[1])&&s.want[0]===-s.dir[0]&&s.want[1]===-s.dir[1]){[s.c,s.tc]=[s.tc,s.c];[s.r,s.tr]=[s.tr,s.r];s.p=1-s.p;s.dir=s.want}
  s.mode='idle';
  if(s.dir[0]||s.dir[1]){const open=this.isDug(s.tc,s.tr);const boots=G.pw.boots>0?1.3:1;const sp=(open?2.0:(SV.upg.shovel?1.35:1.15))*boots;const dp=sp*dt;s.p+=dp;
   const horiz=!!s.dir[0];const dist=dp*(horiz?gm.CW:gm.CH);
   if(horiz){const stride=(open?.68:.55)*gm.CW*boots;s.ph=K.stepPhase(s.ph,dist,stride);s.mode=open?'run':'dig';s.face=s.dir[0]}
   else{s.ph=K.stepPhase(s.ph,dist,.5*gm.CH);s.mode=open?'climb':'dig'}
   if(!open){s.digT+=dt*2.4;if(Math.random()<.3)K.burst(gm.gx+(s.tc+.5)*gm.CW,gm.gy+(s.tr+.5)*gm.CH-G.cam,1,{col:WD.dirt[2],sp:2,life:25})}
   if(s.p>.45&&s.tr>0&&!G.dug[s.tr][s.tc]){G.dug[s.tr][s.tc]=true;G.score+=1;K.noise(.06,{fr:500,v:.06})}
   if(s.p>=1){s.c=s.tc;s.r=s.tr;s.p=0}}
  s.x=s.c+(s.tc-s.c)*s.p;s.y=s.r+(s.tr-s.r)*s.p;
  // pickups
  for(const p of G.pots)if(!p.got&&Math.hypot(s.x-p.c,s.y-p.r)<.6){p.got=true;if(p.gold){G.gold=true;G.score+=500;K.float('GOLDEN SPUD! +500',sx(p.c),sy(p.r)-20*K.S,'#ffe066',22);K.sfx.win()}else{G.got++;G.score+=100;K.float(K.pick(['Spud-tacular!','Tater-rific!','Hello, potato!','Po-tay-to!','Mash-terpiece!']),sx(p.c),sy(p.r)-20*K.S,'#fff',18);K.sfx.pop()}
   G.faceK=1;G.faceT=.8;K.burst(sx(p.c),sy(p.r),14,{col:['#ffe066','#ff8fd8','#8fe9ff','#fff'],grav:.05});if(G.got>=G.N){finishLevel();return}}
  for(const cr of G.crates)if(!cr.got&&Math.hypot(s.x-cr.c,s.y-cr.r)<.6){cr.got=true;K.sfx.good();const m={hat:'Hard hat! Blocks one hit',boots:'Speedy boots!',whistle:'Mole whistle! Moles freeze',heart:'+1 heart',coin:'+25 coins'}[cr.kind];K.float(m,sx(cr.c),sy(cr.r)-20*K.S,'#b9ff8f',18);
   if(cr.kind==='hat')G.pw.hat=1;if(cr.kind==='boots')G.pw.boots=10;if(cr.kind==='whistle'){G.pw.whistle=6;K.tone(1400,.4,{type:'square',v:.08,f2:900})}if(cr.kind==='heart')G.hearts=Math.min(5,G.hearts+1);if(cr.kind==='coin'){SV.coins+=25;save();K.sfx.coin()}}
  // enemies
  const frozen=G.pw.whistle>0;
  for(const m of G.moles){if(m.dead){m.squash-=dt;continue}m.moving=false;if(frozen&&m.type!=='beetle'){}else{m.gt-=dt;
   const spd=m.sp*dt;
   if(m.type==='mole'&&worldOf(G.n)>=2&&!m.ghost&&m.gt<=0&&Math.random()<.01){m.ghost=1}
   if(m.ghost){const a=Math.atan2(s.y-m.y,s.x-m.x),gs=.55*dt;m.x+=Math.cos(a)*gs;m.y+=Math.sin(a)*gs;m.ghost+=dt;m.face=Math.cos(a)<0?-1:1;m.moving=true;m.ph+=gs*2;
    const mc=Math.round(m.x),mr=Math.round(m.y);if(m.ghost>3&&this.isDug(mc,mr)&&mr>0&&Math.abs(m.x-mc)<.08&&Math.abs(m.y-mr)<.08){m.x=m.c=m.tc=mc;m.y=m.r=m.tr=mr;m.p=0;m.ghost=0;m.gt=6+Math.random()*6;m.dir=[0,0]}}
   else if(m.type==='gopher'&&m.dig>0){/* tunnel toward Suzy */if(m.p===0){const dx=Math.sign(Math.round(s.x)-m.c),dy=Math.sign(Math.round(s.y)-m.r);let d=Math.abs(s.x-m.c)>Math.abs(s.y-m.r)?[dx,0]:[0,dy];if(!d[0]&&!d[1])d=[1,0];
     if(this.canEnter(m.c+d[0],m.r+d[1])&&m.r+d[1]>0){m.dir=d;m.tc=m.c+d[0];m.tr=m.r+d[1]}else{m.dig=0}}
    if(m.dig>0){m.p+=.8*dt;m.digT+=dt*2;m.moving=true;if(m.p>.5&&!G.dug[m.tr][m.tc]){G.dug[m.tr][m.tc]=true}if(m.p>=1){m.c=m.tc;m.r=m.tr;m.p=0;m.dig--}}if(m.dir[0])m.face=m.dir[0]}
   else{if(m.p===0){const opts=[[1,0],[-1,0],[0,1],[0,-1]].filter(d=>{const nc=m.c+d[0],nr=m.r+d[1];return nr>0&&this.isDug(nc,nr)&&!this.rockAt(nc,nr)});
     const fwd=opts.filter(d=>!(d[0]===-m.dir[0]&&d[1]===-m.dir[1]));const ch=fwd.length?fwd:opts;
     if(m.type==='gopher'&&m.gt<=0){m.dig=4+Math.floor(Math.random()*4);m.gt=7+Math.random()*5}
     else if(ch.length){if(m.type!=='beetle'&&Math.random()<Math.min(.6,.1+.04*G.n)){ch.sort((a,b)=>Math.hypot(m.c+a[0]-s.x,m.r+a[1]-s.y)-Math.hypot(m.c+b[0]-s.x,m.r+b[1]-s.y));m.dir=ch[0]}else m.dir=K.pick(ch);m.tc=m.c+m.dir[0];m.tr=m.r+m.dir[1]}else m.dir=[0,0]}
    if(m.dir[0]||m.dir[1]){m.p+=spd;m.moving=true;if(m.dir[0])m.face=m.dir[0];if(m.p>=1){m.c=m.tc;m.r=m.tr;m.p=0}}}
   if(!m.ghost){m.x=m.c+(m.tc-m.c)*m.p;m.y=m.r+(m.tr-m.r)*m.p}
   if(m.moving){const strideM=(m.type==='beetle'?.3:m.type==='gopher'?.32:.3)*gm.CW;m.ph=K.stepPhase(m.ph,spd*gm.CW,strideM)}}
   if(Math.hypot(m.x-s.x,m.y-s.y)<.65){if(frozen&&m.type!=='beetle'){m.dead=true;m.squash=.6;G.score+=100;K.float('Shoo! +100',sx(m.x),sy(m.y)-20*K.S,'#b9ff8f',18);K.sfx.pop()}
    else if(G.inv<=0)hurt(m.type==='gopher'?'Gopher nibble!':m.type==='beetle'?'Beetle pinch!':K.pick(['Eek, a grumpy mole!','Hey, no biting!','Mole-y moly!']))}}
  // rocks
  for(const rk of G.rocks){if(rk.st==='still'){const below=rk.r+1<G.rows&&G.dug[rk.r+1][rk.c];const under=Math.abs(s.x-rk.c)<.5&&Math.abs(s.y-(rk.r+1))<.6;if(below&&!under){rk.st='wob';rk.tm=.75}}
   else if(rk.st==='wob'){rk.tm-=dt;if(rk.tm<=0)rk.st='fall'}
   else if(rk.st==='fall'){rk.r+=6*dt;const nr=Math.floor(rk.r)+1;
    if(G.inv<=0&&Math.abs(s.x-rk.c)<.6&&Math.abs(s.y-rk.r)<.7)hurt('Bonk! Rock on the hat!');
    for(const m of G.moles)if(!m.dead&&Math.abs(m.x-rk.c)<.6&&Math.abs(m.y-rk.r)<.7){m.dead=true;m.squash=.7;G.score+=200;K.float('+200 Flat '+m.type+'!',sx(rk.c),sy(rk.r)-20*K.S,'#ffe066',18)}
    if(nr>=G.rows||!G.dug[nr][rk.c]){rk.r=Math.floor(rk.r);rk.st='crumble';rk.tm=.5;K.sfx.thud();K.shake=8*K.S}}
   else if(rk.st==='crumble'){rk.tm-=dt;if(rk.tm<=0){rk.st='gone';K.burst(sx(rk.c),sy(rk.r),10,{col:'#8d8d8d',sp:3})}}}
  G.moles=G.moles.filter(m=>!(m.dead&&m.squash<=0));
  // camera
  const want=(s.y+.5)*gm.CH-gm.vh*.45;const minC=-gm.CH*2.2,maxC=Math.max(minC,G.rows*gm.CH-gm.vh+gm.CH*.3);const tgt=K.clamp(want,minC,maxC);G.cam=G.cam<-1e8?tgt:K.lerp(G.cam,tgt,Math.min(1,dt*5))},
 draw(){const gm=this.geom(),S=K.S,s=G.s,W=K.W,H=K.H,CW=gm.CW,CH=gm.CH;const cam=G.cam<-1e8?0:G.cam;
  // sky + surface
  const surfY=gm.gy-cam;const sk=g.createLinearGradient(0,0,0,Math.max(1,surfY));sk.addColorStop(0,WD.sky[0]);sk.addColorStop(1,WD.sky[1]);g.fillStyle=sk;g.fillRect(0,0,W,Math.max(0,surfY+CH));
  if(surfY>gm.hud){if(WD.night){A.E(W*.8,surfY-CH*1.4,18*S,18*S,'#fff7d6')}else A.E(W*.85,surfY-CH*1.5,20*S,20*S,'#ffe066')}
  // dirt bands
  for(let r=1;r<G.rows+3;r++){const y=gm.gy+r*CH-cam;if(y>H||y+CH<gm.hud)continue;g.fillStyle=WD.dirt[Math.min(3,Math.floor((r-1)/G.rows*4))];g.fillRect(0,y,W,CH+1)}
  g.fillStyle=WD.grass;g.fillRect(0,surfY+CH*.82,W,CH*.22);
  // tunnels
  g.fillStyle=WD.night?'#1e1626':'#4a2f1a';for(let r=1;r<G.rows;r++){const y=gm.gy+r*CH-cam;if(y>H||y+CH<gm.hud-CH)continue;for(let c=0;c<COLS;c++)if(G.dug[r][c]){const x=gm.gx+c*CW;const pad=CW*.06;
   K.rr(x+pad,y+pad,CW-pad*2,CH-pad*2,CW*.3);g.fill();if(c+1<COLS&&G.dug[r][c+1])g.fillRect(x+CW*.5,y+pad,CW,CH-pad*2);if(r+1<G.rows&&G.dug[r+1][c])g.fillRect(x+pad,y+CH*.5,CW-pad*2,CH);if(r===1)g.fillRect(x+pad,y-CH*.2,CW-pad*2,CH*.5)}}
  // pebbles
  g.fillStyle='rgba(0,0,0,.12)';const hsh=v=>{const x=Math.sin(v*12.9898+G.n*7.1)*43758.5453;return x-Math.floor(x)};for(let i=0;i<G.rows*4;i++){const c=hsh(i)*COLS,r=1+hsh(i+999)*(G.rows-1);const y=gm.gy+r*CH-cam;if(y<gm.hud||y>H)continue;if(!G.dug[Math.floor(r)][Math.floor(c)])A.E(gm.gx+c*CW,y,2.5*S,1.8*S,'rgba(0,0,0,.15)')}
  // pots, crates, rocks
  for(const p of G.pots)if(!p.got){const y=sy(p.r);if(y<gm.hud-CH||y>H+CH)continue;A.potato(sx(p.c),y+Math.sin(K.t*2+p.seed)*1.5*S,CW*.34,CH*.22,{seed:p.seed,gold:p.gold,shine:p.gold&&K.frame%40<20})}
  for(const c of G.crates)if(!c.got)A.crate(sx(c.c),sy(c.r),CW*.9,c.kind);
  for(const rk of G.rocks)if(rk.st!=='gone'){g.save();if(rk.st==='crumble')g.globalAlpha=Math.max(0,rk.tm/.5);A.rock(sx(rk.c)+(rk.st==='wob'?Math.sin(K.t*40)*2*S:0),sy(rk.r),CW*.95,{col:worldOf(G.n)===2?'#7d7f9a':'#8d8d8d'});g.restore()}
  // enemies
  for(const m of G.moles){const x=sx(m.x),y=sy(m.y)+CH*.42;const o={dir:m.face,ph:m.ph,moving:m.moving&&G.pw.whistle<=0,ghost:m.ghost,squash:m.dead,col:m.col,mad:1,digT:m.digT};
   if(m.type==='gopher')A.gopher(x,y,CW*1.0,o);else if(m.type==='beetle')A.beetle(x,y,CW*.75,o);else A.mole(x,y,CW*.9,o);if(G.pw.whistle>0&&m.type!=='beetle')K.text('💤',x,y-CH*.7,14*S,'#fff',{stroke:false});if(m.ghost)K.text('💢',x,y-CH*.75,12*S,'#fff',{stroke:false})}
  // Suzy
  const blink=G.inv>0&&K.frame%10<5;if(!blink){A.suzy(sx(s.x),sy(s.y)+CH*.46,CH*1.02,{dir:s.face,mode:s.mode,ph:s.ph,digT:s.digT,face:G.faceT>0?G.faceK:0,hat:G.pw.hat?'cowboy':SV.hat})}
  if(G.pw.hat){K.text('⛑️',sx(s.x)+CW*.4,sy(s.y)-CH*.5,12*S,'#fff',{stroke:false})}
  if(gm.gx>2){g.fillStyle='rgba(30,18,8,.55)';g.fillRect(0,gm.hud,gm.gx,H);g.fillRect(gm.gx+COLS*CW,gm.hud,W,H)}
  // night lantern
  if(WD.night){const lx=sx(s.x),ly=sy(s.y);g.save();const rad=CW*3.2;const gr=g.createRadialGradient(lx,ly,rad*.25,lx,ly,rad);gr.addColorStop(0,'rgba(5,5,20,0)');gr.addColorStop(1,'rgba(5,5,20,.9)');g.fillStyle=gr;g.fillRect(0,Math.max(gm.hud,surfY+CH),W,H);g.restore();
   for(let i=0;i<8;i++){const fx=(Math.sin(K.t*.5+i*2)*.5+.5)*W,fy=surfY-CH*(.4+((i*37)%10)/10*1.5);A.E(fx,fy,2.5*S,2.5*S,'rgba(255,255,140,'+(.5+.5*Math.sin(K.t*4+i))+')')}}
  // HUD
  g.fillStyle='rgba(60,35,15,.92)';g.fillRect(0,0,W,gm.hud);const sf=K.safe,hy=sf.t+(gm.hud-sf.t)/2;
  K.text('❤️'.repeat(Math.max(0,G.hearts)),sf.l+12*S,hy-11*S,16*S,'#fff',{al:'left',stroke:false});K.text('Level '+G.n+'  ·  '+G.score,sf.l+12*S,hy+12*S,16*S,'#fff',{al:'left'});
  K.text('🥔 '+G.got+'/'+G.N+(G.gold?'  🌟':''),W/2+(K.portrait?20*S:0),hy,20*S,'#ffe066');
  const bs=Math.min(46*S,gm.hud-sf.t-8*S);K.button({id:'pause',x:W-sf.r-bs-8*S,y:hy-bs/2,w:bs,h:bs,r:bs/2,label:'⏸',fs:20*S,color:'#e8590c',cb:()=>this.pause()});
  let px=W-sf.r-bs*2-16*S;for(const k of ['boots','whistle']){if(G.pw[k]>0){K.text((k==='boots'?'👢':'📯')+Math.ceil(G.pw[k]),px,hy,15*S,'#fff',{al:'right'});px-=50*S}}
  if(G.msgT>0){g.globalAlpha=Math.min(1,G.msgT);K.text(G.msg,W/2,gm.hud+40*S,20*S,'#fff',{maxW:W-20*S});g.globalAlpha=1}
  if(G.t<4&&!K.padUsed)K.text('Swipe to dig · Tap to stop',W/2,H-K.safe.b-30*S,17*S,'#fff')},
 drawPause(){pauseOverlay(this,()=>K.go(Play,G.n))},
 down(p){},
 move(p){if(G.over)return;const dx=p.x-p.sx,dy=p.y-p.sy;if(dx*dx+dy*dy>(22*K.S)**2){G.s.want=Math.abs(dx)>Math.abs(dy)?[Math.sign(dx),0]:[0,Math.sign(dy)];p.sx=p.x;p.sy=p.y;p.swiped=1}},
 up(p,c){if(c)return;if(!p.swiped&&Math.hypot(p.x-p.sx,p.y-p.sy)<14*K.S&&performance.now()-p.st<400)G.s.want=[0,0]},
 padDir(dx,dy,p){return true},
 pause(){if(!G.over){this.paused=true;K.music.stop()}},resume(){this.paused=false;K.music.resume()},back(){if(this.paused)this.resume();else this.pause()}};
function sx(c){const gm=Play.geom();return gm.gx+(c+.5)*gm.CW}
function sy(r){const gm=Play.geom();return gm.gy+(r+.5)*gm.CH-(G.cam<-1e8?0:G.cam)}
function hurt(msg){if(G.pw.hat){G.pw.hat=0;G.inv=1.2;K.float('Hard hat saved you!',sx(G.s.x),sy(G.s.y)-30*K.S,'#b9ff8f',18);K.sfx.thud();return}
 G.hearts--;G.hits++;G.inv=2;K.shake=12*K.S;K.sfx.bad();G.faceK=2;G.faceT=1;G.msg=msg;G.msgT=1.5;if(G.hearts<=0){G.over=true;setTimeout(()=>K.go(Results,{n:G.n,fail:true,score:G.score}),900)}}
function finishLevel(){G.over=true;K.sfx.win();const st=1+(G.gold?1:0)+(G.hits===0?1:0);G.score+=50*G.n;setTimeout(()=>K.go(Results,{n:G.n,stars:st,score:G.score,coins:G.got*2+st*5+(G.gold?10:0)}),700)}
function pauseOverlay(sc,restart){const S=K.S,W=K.W,H=K.H;g.fillStyle='rgba(0,0,0,.6)';g.fillRect(0,0,W,H);K.text('Paused',W/2,H*.2,40*S,'#fff');const bw=Math.min(W-60*S,320*S),bh=58*S,gap=12*S,x=(W-bw)/2;let y=Math.max(H*.28,(H-4*(bh+gap))/2);
 K.button({id:'resume',x,y,w:bw,h:bh,label:'▶ Resume',color:'#2f9e44',primary:true,cb:()=>sc.resume()});y+=bh+gap;
 K.button({id:'restart',x,y,w:bw,h:bh,label:'↻ Restart level',color:'#1c7ed6',cb:()=>{sc.paused=false;restart()}});y+=bh+gap;
 K.button({id:'map',x,y,w:bw,h:bh,label:'🗺️ Levels',color:'#e8590c',cb:()=>{sc.paused=false;K.go(MapS)}});y+=bh+gap;
 K.button({id:'mute2',x,y,w:bw,h:bh,label:K.muted?'🔇 Sound off':'🔊 Sound on',color:'#9c36b5',cb:()=>K.toggleMute()})}
/* ---------------- RESULTS */
const Results={enter(o){this.o=o;const n=o.n;if(!o.fail){SV.stars[n]=Math.max(SV.stars[n]||0,o.stars);SV.coins+=o.coins;SV.unl=Math.max(SV.unl,Math.min(NL,n+1));SV.best=Math.max(SV.best,o.score);if(n===NL){SV.done=true;if(!SV.hats.includes('crown'))SV.hats.push('crown')}save();K.burst(K.W/2,K.H*.3,60,{sp:6})}this.t=0},
 update(dt){this.t+=dt},
 draw(){const o=this.o,S=K.S,W=K.W,H=K.H,sf=K.safe,P=K.portrait,w=worldOf(o.n);bg(w);const gy=P?H*.5:H*.62;ground(gy,w);
  const r=A.suzy(P?W/2:W*.25,gy,P?H*.2:H*.42,{mode:o.fail?'hurt':'cheer',face:o.fail?2:1,hat:SV.hat});K.markChar(r.x,r.y,r.w,r.h,'suzy');
  const cx=P?W/2:W*.66;K.text(o.fail?'Oh no, out of hearts!':(o.n===NL?'You won the Fair!':isKitchen(o.n)?'Dish served!':'Level '+o.n+' clear!'),cx,sf.t+46*S,30*S,o.fail?'#ffa8a8':'#ffe066',{maxW:P?W-20*S:W*.6});
  if(!o.fail){for(let i=0;i<3;i++){const on=i<o.stars,sc=Math.min(1,Math.max(0,this.t*3-i*.6));if(sc>0)K.star(cx+(i-1)*52*S,sf.t+104*S,22*S*(on?(.8+.2*sc):.8),on?'#ffd23f':'rgba(255,255,255,.35)')}
   K.text('Score '+o.score+'   🪙 +'+o.coins,cx,sf.t+150*S,20*S,'#fff');if(o.ribbon)K.text(['','White ribbon 🎗️','Red ribbon 🥈','Blue ribbon 🏅'][o.ribbon]+' from the judges',cx,sf.t+178*S,17*S,'#fff')}
  const bw=Math.min(P?W-60*S:W*.4,320*S),bh=58*S,gap=12*S,x=P?(W-bw)/2:cx-bw/2;let y=P?gy+28*S:Math.max(sf.t+200*S,H-sf.b-3*(bh+gap)-6*S);
  if(!o.fail&&o.n<NL){K.button({id:'next',x,y,w:bw,h:bh,label:'▶ Next level',color:'#2f9e44',primary:true,cb:()=>startLevel(o.n+1)});y+=bh+gap}
  if(!o.fail&&o.n===NL){K.button({id:'next',x,y,w:bw,h:bh,label:'🏆 Trophy time!',color:'#2f9e44',primary:true,cb:()=>K.go(Finale)});y+=bh+gap}
  K.button({id:'retry',x,y,w:bw,h:bh,label:'↻ Try again',color:o.fail?'#2f9e44':'#1c7ed6',primary:!!o.fail,cb:()=>startLevel(o.n)});y+=bh+gap;
  K.button({id:'map',x,y,w:bw,h:bh,label:'🗺️ Levels',color:'#e8590c',cb:()=>K.go(MapS)})},back(){K.go(MapS)}};
/* ---------------- KITCHEN */
const RECIPES={mash:['wash','peel','boil','mash'],fries:['wash','peel','chop','fry'],baked:['wash','poke','bake','top'],salad:['wash','chop','boil','mix','top']};
const STEPNAME={wash:'Scrub the potatoes 🫧',peel:'Peel them 🔪',boil:'Pop the bubbles so the pot won\'t boil over 🍲',mash:'Mash! Tap tap tap 💪',chop:'Chop on the lines 🔪',fry:'Tap when the fries are golden 🍟',poke:'Poke holes with the fork 🍴',bake:'Stop the oven in the green 🔥',top:'Add the toppings in order 🧈',mix:'Stir it round and round 🥄'};
const TOPS={baked:['🧈','🧀','🥓','🌿'],salad:['🥚','🥒','🧅','🌿']};
const Kitchen={play:true,
 enter(n){this.n=n;this.w=worldOf(n);this.rk=WORLDS[this.w].rk;this.steps=RECIPES[this.rk];this.si=0;this.pts=0;this.t=0;this.paused=false;this.cookPh=0;K.music.play(WORLDS[this.w].song);this.intro=2.2;this.startStep()},
 startStep(){const st=this.steps[this.si];this.st=st;this.k={i:0,prog:0,n:3,acc:0,spots:[],tries:0,score:0,bub:[],over:0,needle:0,nd:1,order:0,time:0,last:0};
  if(st==='boil'){this.k.n=1;this.k.need=10}if(st==='mash'||st==='mix'){this.k.n=1}if(st==='fry'||st==='bake'){this.k.n=3}if(st==='top'){this.k.n=1;this.k.order=0}
  this.mkSpots();this.banner=1.6},
 mkSpots(){const k=this.k,st=this.st;k.spots=[];if(st==='chop'){for(let i=0;i<4;i++)k.spots.push({fx:-.6+i*.4,fy:0,hit:false})}if(st==='poke'){for(let i=0;i<5;i++)k.spots.push({fx:Math.cos(i*1.26)*.5,fy:Math.sin(i*1.26)*.45,hit:false})}
  if(st==='top'){const T=TOPS[this.rk];T.forEach((e,i)=>k.spots.push({e,i,hit:false}))}},
 lay(){const S=K.S,W=K.W,H=K.H,P=K.portrait,sf=K.safe;const top=sf.t+60*S;if(P){return{chef:{x:W*.2,y:H*.42,h:H*.16},judges:[{x:W*.62,y:H*.42},{x:W*.84,y:H*.42}],jh:H*.13,work:{x:W/2,y:H*.66,r:Math.min(W*.3,H*.15)},top}}
  return{chef:{x:W*.12,y:H*.9,h:H*.42},judges:[{x:W*.82,y:H*.9},{x:W*.93,y:H*.9}],jh:H*.32,work:{x:W*.47,y:H*.58,r:Math.min(W*.18,H*.28)},top}},
 update(dt){this.t+=dt;if(this.intro>0){this.intro-=dt;return}if(this.banner>0)this.banner-=dt;const k=this.k,st=this.st;k.time+=dt;this.cookPh+=dt*1.8;
  if(window.__T&&__T.bot)this.botStep(dt);
  if(st==='boil'){if(Math.random()<dt*(1.6+this.w*.3)){k.bub.push({x:K.rnd(-.7,.7),y:.2,r:K.rnd(.12,.2),vy:K.rnd(.12,.22)})}for(const b of k.bub){b.y-=b.vy*dt}const lost=k.bub.filter(b=>b.y<-.8);if(lost.length){k.over+=lost.length;K.sfx.bad()}k.bub=k.bub.filter(b=>b.y>=-.8);if(k.over>=6){k.over=0;k.prog=Math.max(0,k.prog-2)}}
  if(st==='fry'||st==='bake'){k.needle+=k.nd*dt*(.75+this.w*.12+k.i*.1);if(k.needle>1){k.needle=1;k.nd=-1}if(k.needle<0){k.needle=0;k.nd=1}}
  if(st==='mash'){k.prog=Math.max(0,k.prog-dt*.04)}},
 action(p){/* p in screen coords or null (button A) */const k=this.k,st=this.st,l=this.lay(),w=l.work;if(this.intro>0||this.banner>.9)return;
  if(st==='mash'){k.prog+=1/22;K.noise(.1,{fr:300,v:.15});K.burst(w.x,w.y,4,{col:'#fff2c2',sp:3});if(k.prog>=1)this.doneStep(1)}
  else if(st==='boil'){let tgt=null;if(p){for(const b of k.bub){const bx=w.x+b.x*w.r,by=w.y+b.y*w.r;if(Math.hypot(p.x-bx,p.y-by)<b.r*w.r+18*K.S){tgt=b;break}}}else tgt=k.bub.slice().sort((a,b)=>a.y-b.y)[0];
   if(tgt){k.bub.splice(k.bub.indexOf(tgt),1);k.prog++;K.sfx.pop();K.burst(w.x+tgt.x*w.r,w.y+tgt.y*w.r,6,{col:'#cfefff',sp:2});if(k.prog>=k.need)this.doneStep(1)}}
  else if(st==='fry'||st==='bake'){const d=Math.abs(k.needle-.5);const sc=d<.08?3:d<.18?2:1;k.score+=sc;K.float(['','Oops, a bit off','Nice!','Perfect!'][sc],w.x,w.y-w.r,sc===3?'#b9ff8f':'#fff',22);sc>1?K.sfx.good():K.sfx.bad();k.i++;k.needle=0;k.nd=1;if(k.i>=k.n)this.doneStep(k.score/(3*k.n))}
  else if(st==='chop'||st==='poke'){let s=null;if(p){for(const q of k.spots){if(q.hit)continue;const qx=w.x+q.fx*w.r,qy=w.y+q.fy*w.r*.7;if(Math.hypot(p.x-qx,p.y-qy)<34*K.S){s=q;break}}if(!s){k.miss=(k.miss||0)+1;K.sfx.bad();return}}else s=k.spots.find(q=>!q.hit);
   if(s){s.hit=true;K.tone(st==='chop'?900:1200,.07,{type:'square',v:.08});K.burst(w.x+s.fx*w.r,w.y+s.fy*w.r*.7,6,{col:'#fff2c2',sp:2});if(k.spots.every(q=>q.hit)){k.i++;if(k.i>=k.n)this.doneStep(Math.max(.4,1-(k.miss||0)*.08));else{this.mkSpots();K.sfx.good()}}}}
  else if(st==='top'){const T=k.spots;let s=null;if(p){const pos=this.topPos();for(let i=0;i<T.length;i++){if(Math.hypot(p.x-pos[i].x,p.y-pos[i].y)<32*K.S){s=T[i];break}}}else s=T[k.order];
   if(s){if(s.i===k.order){s.hit=true;k.order++;K.sfx.good();if(k.order>=T.length)this.doneStep(Math.max(.4,1-(k.miss||0)*.15))}else if(!s.hit){k.miss=(k.miss||0)+1;K.sfx.bad();K.float('Not yet!',p?p.x:w.x,(p?p.y:w.y)-20*K.S,'#ffa8a8',18)}}}
  else if(st==='wash'||st==='peel'||st==='mix'){if(!p){this.scrub(40*K.S)}}},
 scrub(d){const k=this.k;k.acc+=d;const need=(this.st==='mix'?2200:this.st==='peel'?700:600)*K.S;k.prog=k.acc/need;if(K.frame-k.last>6){K.noise(.05,{fr:3000,ft:'highpass',v:.05});k.last=K.frame}
  const w=this.lay().work;if(Math.random()<.4)K.burst(w.x+K.rnd(-w.r*.5,w.r*.5),w.y+K.rnd(-w.r*.3,w.r*.3),1,{col:this.st==='wash'?'#cfefff':'#fff2c2',grav:this.st==='wash'?-.03:.15,sp:1.5});
  if(k.prog>=1){k.i++;k.acc=0;k.prog=0;K.sfx.good();if(k.i>=k.n)this.doneStep(Math.max(.5,1-k.time/(30+this.w*5)))}},
 topPos(){const l=this.lay(),w=l.work,T=this.k.spots,n=T.length;return T.map((t,i)=>({x:w.x+(i-(n-1)/2)*Math.min(70*K.S,(K.W*.8)/n),y:w.y+w.r*1.25}))},
 doneStep(q){this.pts+=Math.round(100*K.clamp(q,0,1));this.si++;K.sfx.win();K.burst(K.W/2,K.H*.4,30,{sp:5});if(this.si>=this.steps.length){this.finish();return}this.startStep()},
 finish(){const avg=this.pts/this.steps.length;const rib=avg>=85?3:avg>=65?2:1;SV.ribbons[this.w]=Math.max(SV.ribbons[this.w]||0,rib);save();const score=Math.round(this.pts*10);
  setTimeout(()=>K.go(Results,{n:this.n,stars:rib,score,coins:20+rib*15,ribbon:rib}),900);this.st='done'},
 botStep(dt){this._bt=(this._bt||0)+dt;const st=this.st;if(st==='done')return;if(st==='wash'||st==='peel'||st==='mix'){this.scrub(900*K.S*dt);return}
  if(st==='fry'||st==='bake'){if(Math.abs(this.k.needle-.5)<.05&&this._bt>.2){this._bt=0;this.action(null)}return}if(this._bt>.18){this._bt=0;this.action(null)}},
 draw(){const S=K.S,W=K.W,H=K.H,l=this.lay(),w=l.work,k=this.k,st=this.st;
  // kitchen background: wallpaper + counter
  g.fillStyle='#fff1d6';g.fillRect(0,0,W,H);g.fillStyle='rgba(255,143,184,.25)';for(let x=0;x<W;x+=34*S)for(let y=0;y<H;y+=34*S)A.E(x+((y/34|0)%2)*17*S,y,3*S,3*S,'rgba(255,143,184,.35)');
  g.fillStyle='#ffd6e7';g.fillRect(0,0,W,l.top);const ct=K.portrait?H*.44:H*.9;g.fillStyle='#c98b52';g.fillRect(0,ct,W,H-ct);g.fillStyle='#a66d3a';g.fillRect(0,ct,W,8*S);
  // bunting
  for(let i=0;i<W/30;i++){g.fillStyle=['#ff6b6b','#ffd23f','#4dabf7','#69db7c'][i%4];g.beginPath();g.moveTo(i*30*S,l.top);g.lineTo(i*30*S+24*S,l.top);g.lineTo(i*30*S+12*S,l.top+20*S);g.fill()}
  // chef Suzy (stirring / working, jointed arms)
  const cp=l.chef;const r=A.suzy(cp.x,cp.y,cp.h,{mode:this.intro>0?'wave':'stir',digT:this.cookPh*.6,hat:'chef',shovel:false,tool:'spoon',dir:1,face:this.banner>0?1:0});K.markChar(r.x,r.y,r.w,r.h,'suzy');
  // judges
  const J=[{coat:'#c2255c',hair:'#ddd',bun:1,glasses:1},{coat:'#364fc7',hair:'#333',tophat:1,mustache:1}];l.judges.forEach((p,i)=>{const jr=A.judge(p.x,p.y,l.jh,Object.assign({clap:this.banner>0&&this.si>0},J[i]));K.markChar(jr.x,jr.y,jr.w,jr.h,'judge')});
  if(K.portrait){K.text('Judges',(l.judges[0].x+l.judges[1].x)/2,l.judges[0].y+14*S,13*S,'#fff')}
  // work area
  if(this.intro<=0&&st!=='done')this.drawWork(w,k,st);
  // header
  K.text(WORLDS[this.w].emoji+' '+WORLDS[this.w].recipe,K.safe.l+14*S,K.safe.t+24*S,19*S,'#5b3a1e',{al:'left',stroke:false});
  K.text('Step '+Math.min(this.si+1,this.steps.length)+'/'+this.steps.length,K.safe.l+14*S,K.safe.t+46*S,14*S,'#5b3a1e',{al:'left',stroke:false,w:700});
  const bs=46*S;K.button({id:'pause',x:W-K.safe.r-bs-8*S,y:K.safe.t+8*S,w:bs,h:bs,r:bs/2,label:'⏸',fs:20*S,color:'#e8590c',cb:()=>this.pause()});
  if(this.intro>0){K.text("Kitchen time!",W/2,H*.2+l.top,34*S,'#ffd23f');K.text('Cook '+WORLDS[this.w].recipe+' for the judges',W/2,H*.2+l.top+40*S,18*S,'#fff',{maxW:W-30*S})}
  else if(st!=='done'){const bt=K.portrait?w.y-w.r-50*S:l.top+40*S;K.text(STEPNAME[st],W/2,bt,19*S,'#fff',{maxW:W-24*S});
   if(k.n>1)K.text((st==='fry'||st==='bake'?'Try ':'Potato ')+Math.min(k.i+1,k.n)+' of '+k.n,W/2,bt+26*S,15*S,'#ffe066')}
  if(K.padUsed&&st!=='done'&&this.intro<=0)K.text('Ⓐ to '+({wash:'scrub',peel:'peel',mix:'stir'}[st]||'tap'),W/2,H-K.safe.b-18*S,15*S,'#fff')},
 drawWork(w,k,st){const S=K.S;const R=w.r;
  if(st==='boil'||st==='mix'){g.fillStyle=st==='boil'?'#868e96':'#f1f3f5';g.beginPath();g.ellipse(w.x,w.y+R*.2,R*1.05,R*.85,0,0,TAU);g.fill();g.fillStyle=st==='boil'?'#74c0fc':'#fff2c2';g.beginPath();g.ellipse(w.x,w.y,R*.9,R*.35,0,0,TAU);g.fill();
   if(st==='mix'){for(let i=0;i<8;i++){const a=i*.8+k.acc*.01;A.E(w.x+Math.cos(a)*R*.5,w.y+Math.sin(a)*R*.18,R*.12,R*.08,['#fff2c2','#69db7c','#ffd23f'][i%3])}}
   if(st==='boil'){for(const b of k.bub){A.E(w.x+b.x*R,w.y+b.y*R,b.r*R,b.r*R,'rgba(220,245,255,.85)');g.strokeStyle='#4dabf7';g.lineWidth=2*S;g.beginPath();g.arc(w.x+b.x*R,w.y+b.y*R,b.r*R,0,TAU);g.stroke()}
    const bw=R*1.6;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(w.x-bw/2,w.y+R*1.15,bw,12*S);g.fillStyle='#69db7c';g.fillRect(w.x-bw/2,w.y+R*1.15,bw*Math.min(1,k.prog/k.need),12*S)}}
  else if(st==='mash'){g.fillStyle='#e9ecef';g.beginPath();g.ellipse(w.x,w.y+R*.2,R*1.1,R*.75,0,0,Math.PI);g.fill();A.E(w.x,w.y+R*.2,R*1.1,R*.3,'#dee2e6');
   const lumps=Math.round((1-k.prog)*7);for(let i=0;i<lumps;i++)A.potato(w.x+(i-3)*R*.25,w.y+R*.1,R*.16,R*.11,{seed:i,peel:0});A.E(w.x,w.y+R*.18,R*.95*k.prog,R*.22*k.prog,'#fff2c2');
   const bw=R*1.6;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(w.x-bw/2,w.y+R*.9,bw,12*S);g.fillStyle='#ffd23f';g.fillRect(w.x-bw/2,w.y+R*.9,bw*Math.min(1,k.prog),12*S)}
  else if(st==='fry'||st==='bake'){const c=st==='fry'?['#fff2c2','#ffd23f','#e8590c']:['#c98b52','#8b5a2b','#3b2314'];
   if(st==='fry'){g.fillStyle='#495057';K.rr(w.x-R,w.y-R*.3,R*2,R*.9,10*S);g.fill();A.E(w.x,w.y-R*.25,R*.95,R*.15,'#ffd8a8');for(let i=0;i<9;i++){g.fillStyle=k.needle<.4?c[0]:k.needle<.62?c[1]:c[2];g.fillRect(w.x-R*.6+i*R*.14,w.y-R*.6+(i%3)*4*S,R*.08,R*.5)}}
   else{g.fillStyle='#343a40';K.rr(w.x-R,w.y-R*.7,R*2,R*1.3,12*S);g.fill();g.fillStyle='rgba(255,'+(160-k.needle*120|0)+',60,.8)';K.rr(w.x-R*.75,w.y-R*.5,R*1.5,R*.8,8*S);g.fill();A.potato(w.x,w.y-R*.1,R*.38,R*.24,{seed:2,col:k.needle<.4?'#d9a15b':k.needle<.62?'#a86b32':'#4a2b14'})}
   const mw=R*1.9,mx=w.x-mw/2,my=w.y+R*.85;g.fillStyle='#ff6b6b';g.fillRect(mx,my,mw,22*S);g.fillStyle='#ffd43b';g.fillRect(mx+mw*.32,my,mw*.36,22*S);g.fillStyle='#51cf66';g.fillRect(mx+mw*.42,my,mw*.16,22*S);
   g.fillStyle='#212529';g.fillRect(mx+mw*k.needle-3*S,my-8*S,6*S,38*S);K.text('TAP!',w.x,my+48*S,18*S,'#fff')}
  else if(st==='top'){A.potato(w.x,w.y,R*.9,R*.55,{seed:4,col:this.rk==='baked'?'#a86b32':'#fff2c2'});const T=k.spots;T.forEach((t,i)=>{if(t.hit)K.text(t.e,w.x+(i-1.5)*R*.35,w.y-R*.15+(i%2)*R*.2,28*S,'#fff',{stroke:false})});
   const pos=this.topPos();T.forEach((t,i)=>{const p=pos[i];g.fillStyle=t.hit?'rgba(0,0,0,.15)':'#fff';g.beginPath();g.arc(p.x,p.y,28*S,0,TAU);g.fill();g.strokeStyle=i===k.order?'#2f9e44':'#adb5bd';g.lineWidth=4*S;g.stroke();if(!t.hit)K.text(t.e,p.x,p.y,28*S,'#fff',{stroke:false});K.text(String(i+1),p.x+20*S,p.y-20*S,13*S,'#5b3a1e',{stroke:false})})}
  else{/* wash / peel / chop / poke: a potato on the board */g.fillStyle='#e9c48a';K.rr(w.x-R*1.2,w.y-R*.75,R*2.4,R*1.5,14*S);g.fill();
   if(st==='wash'){g.fillStyle='rgba(116,192,252,.5)';K.rr(w.x-R*1.2,w.y-R*.75,R*2.4,R*1.5,14*S);g.fill()}
   A.potato(w.x,w.y,R*.85,R*.55,{seed:k.i+1,dirt:st==='wash'?1-k.prog:0,peel:st==='peel'?1-k.prog:(st==='chop'?0:undefined)});
   if(st==='chop'){for(const q of k.spots){const qx=w.x+q.fx*R;g.strokeStyle=q.hit?'#c92a2a':'rgba(201,42,42,.5)';g.setLineDash(q.hit?[]:[6*S,5*S]);g.lineWidth=(q.hit?4:3)*S;g.beginPath();g.moveTo(qx,w.y-R*.6);g.lineTo(qx,w.y+R*.6);g.stroke();g.setLineDash([])}}
   if(st==='poke'){for(const q of k.spots){const qx=w.x+q.fx*R,qy=w.y+q.fy*R*.7;if(q.hit)A.E(qx,qy,4*S,4*S,'#5b3a1e');else{g.strokeStyle='#fff';g.lineWidth=3*S;g.beginPath();g.arc(qx,qy,14*S+Math.sin(K.t*6)*3*S,0,TAU);g.stroke()}}}
   if(st==='wash'||st==='peel'){const bw=R*1.6;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(w.x-bw/2,w.y+R*.85,bw,12*S);g.fillStyle='#4dabf7';g.fillRect(w.x-bw/2,w.y+R*.85,bw*Math.min(1,k.prog),12*S);K.text(st==='wash'?'Rub the potato!':'Swipe across it!',w.x,w.y+R*1.2,16*S,'#fff')}}},
 down(p){if(this.st==='wash'||this.st==='peel'||this.st==='mix')return;this.action(p)},
 move(p){const st=this.st;if(st!=='wash'&&st!=='peel'&&st!=='mix')return;const w=this.lay().work;if(Math.hypot(p.x-w.x,p.y-w.y)>w.r*1.6)return;const d=Math.hypot(p.x-(p.lx==null?p.sx:p.lx),p.y-(p.ly==null?p.sy:p.ly));p.lx=p.x;p.ly=p.y;if(this.intro<=0)this.scrub(d)},
 padBtn(n,p){if(n==='a'&&p&&!this.paused){this.action(null);return true}},
 key(k,d){if(d&&(k===' '||k==='Enter')&&!this.paused){this.action(null);return true}},
 drawPause(){pauseOverlay(this,()=>K.go(Kitchen,this.n))},
 pause(){this.paused=true;K.music.stop()},resume(){this.paused=false;K.music.resume()},back(){if(this.paused)this.resume();else this.pause()}};
/* ---------------- FINALE */
const Finale={enter(){this.t=0;K.music.play(WORLDS[3].song)},update(dt){this.t+=dt;if(K.frame%6===0)K.burst(K.rnd(0,K.W),-10,3,{sp:2,grav:.08,life:120})},
 draw(){const S=K.S,W=K.W,H=K.H,P=K.portrait,sf=K.safe;bg(3);const gy=P?H*.6:H*.78;ground(gy,3);
  g.fillStyle='#c92a2a';K.rr(W/2-90*S,gy-26*S,180*S,26*S,6*S);g.fill();K.text('COUNTY FAIR',W/2,gy-13*S,14*S,'#fff');
  const r=A.suzy(W/2,gy-26*S,P?H*.2:H*.36,{mode:'cheer',face:1,hat:'crown'});K.markChar(r.x,r.y,r.w,r.h,'suzy');K.text('🏆',W/2+(P?H*.2:H*.36)*.42,gy-26*S-(P?H*.2:H*.36)*.95,40*S,'#fff',{stroke:false});
  const j1=A.judge(W*.18,gy,P?H*.14:H*.28,{coat:'#c2255c',hair:'#ddd',bun:1,glasses:1,clap:1}),j2=A.judge(W*.82,gy,P?H*.14:H*.28,{coat:'#364fc7',hair:'#333',tophat:1,mustache:1,clap:1});[j1,j2].forEach(j=>K.markChar(j.x,j.y,j.w,j.h,'judge'));
  K.text('Golden Spud Champion!',W/2,sf.t+44*S,30*S,'#ffd23f',{maxW:W-20*S});K.text('Suzy won the County Fair! The Fair Crown is yours to wear.',W/2,sf.t+84*S,16*S,'#fff',{maxW:W-30*S});
  const bw=Math.min(W-60*S,300*S),bh=56*S;K.button({id:'home',x:(W-bw)/2,y:P?gy+30*S:H-sf.b-bh-6*S,w:P?bw:bw*.7,h:bh,label:'🏠 Home',color:'#2f9e44',primary:true,cb:()=>K.go(Title)})},back(){K.go(Title)}};
/* ---------------- QA bot: BFS toward nearest potato (dig allowed, avoids rocks & enemies' cells) */
function bot(){const s=G.s;if(s.p!==0)return;const R=G.rows,me=Play;const goals=G.pots.filter(p=>!p.got&&!p.gold);if(!goals.length)return;
 const key=(c,r)=>r*COLS+c;const prev=new Map();const q=[[s.c,s.r]];prev.set(key(s.c,s.r),null);let found=null;
 const danger=new Set();for(const m of G.moles)if(!m.dead){danger.add(key(Math.round(m.x),Math.round(m.y)));danger.add(key(m.tc,m.tr))}
 for(const rk of G.rocks){if(rk.st!=='gone'){for(let d=1;d<=4;d++)danger.add(key(rk.c,rk.r+d))}}
 while(q.length){const [c,r]=q.shift();if(goals.some(p=>p.c===c&&p.r===r)){found=[c,r];break}for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const nc=c+d[0],nr=r+d[1];if(nc<0||nc>=COLS||nr<0||nr>=R)continue;const kk=key(nc,nr);if(prev.has(kk)||me.rockAt(nc,nr))continue;if(danger.has(kk)&&!goals.some(p=>p.c===nc&&p.r===nr))continue;prev.set(kk,[c,r]);q.push([nc,nr])}}
 if(!found){s.want=[0,0];return}let cur=found,p=prev.get(key(cur[0],cur[1]));while(p&&!(p[0]===s.c&&p[1]===s.r)){cur=p;p=prev.get(key(cur[0],cur[1]))}s.want=[cur[0]-s.c,cur[1]-s.r]}
/* ---------------- boot */
K.initPad({});
window.__T={get scene(){return K.scene===Title?'title':K.scene===Play?'play':K.scene===Kitchen?'kitchen':K.scene===Results?'results':K.scene===MapS?'map':K.scene===Shop?'shop':K.scene===Help?'help':K.scene===Finale?'finale':'story'},
 get G(){return G},get SV(){return SV},startLevel,Title,Play,Kitchen,MapS,Results,Finale,bot:false,reset(){SV=JSON.parse(JSON.stringify(DEF));save()},unlockAll(){SV.unl=NL;save()}};
const q=new URLSearchParams(location.search);K.start(Title);if(q.get('level')){setTimeout(()=>startLevel(Math.max(1,Math.min(NL,+q.get('level')))),50)}
})();
