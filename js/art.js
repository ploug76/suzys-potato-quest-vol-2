/* art.js — Suzy's Potato Quest 2 characters (all vector, jointed limb rigs) */
(function(){
const g=K.g,TAU=Math.PI*2;
const A=window.ART={};
function E(x,y,rx,ry,c,rot){g.fillStyle=c;g.beginPath();g.ellipse(x,y,Math.abs(rx),Math.abs(ry),rot||0,0,TAU);g.fill()}
A.E=E;
A.HATS={straw:{name:'Straw Hat',price:0},bonnet:{name:'Sun Bonnet',price:40},cowboy:{name:'Cowgirl Hat',price:80},flower:{name:'Flower Crown',price:120},chef:{name:'Chef Hat',price:160},crown:{name:'Fair Crown',price:300}};
function hat(kind,u){
 if(kind==='bonnet'){E(0,-39*u,10*u,8*u,'#ffd6e7');g.fillStyle='#ffd6e7';g.beginPath();g.ellipse(0,-37*u,13*u,5*u,0,Math.PI,TAU);g.fill();g.strokeStyle='#ff8fb8';g.lineWidth=1.6*u;g.beginPath();g.moveTo(-8*u,-34*u);g.lineTo(-6*u,-27*u);g.stroke();E(-6*u,-27*u,2*u,1.4*u,'#ff8fb8');return}
 if(kind==='cowboy'){E(0,-41*u,15*u,3.5*u,'#9c5b2e');g.fillStyle='#b8733d';g.beginPath();g.moveTo(-8*u,-41*u);g.quadraticCurveTo(-8*u,-52*u,-3*u,-50*u);g.quadraticCurveTo(0,-47*u,3*u,-50*u);g.quadraticCurveTo(8*u,-52*u,8*u,-41*u);g.fill();g.fillStyle='#e35d6a';g.fillRect(-8*u,-44*u,16*u,2.4*u);return}
 if(kind==='flower'){for(let i=0;i<7;i++){const a=Math.PI+i*Math.PI/6;E(Math.cos(a)*8*u,-38*u+Math.sin(a)*5*u,2.6*u,2.6*u,['#ff8fb8','#ffe066','#8fe9ff','#c3a6ff','#ff9f43','#b9ff8f','#ff8fb8'][i]);E(Math.cos(a)*8*u,-38*u+Math.sin(a)*5*u,1*u,1*u,'#fff7')}return}
 if(kind==='chef'){g.fillStyle='#fff';g.fillRect(-7*u,-46*u,14*u,7*u);E(-5*u,-48*u,5*u,5*u,'#fff');E(0,-51*u,6*u,6*u,'#fff');E(5*u,-48*u,5*u,5*u,'#fff');g.strokeStyle='#ddd';g.lineWidth=u;g.strokeRect(-7*u,-44*u,14*u,5*u);return}
 if(kind==='crown'){g.fillStyle='#ffd23f';g.beginPath();g.moveTo(-9*u,-40*u);g.lineTo(-9*u,-48*u);g.lineTo(-4.5*u,-44*u);g.lineTo(0,-51*u);g.lineTo(4.5*u,-44*u);g.lineTo(9*u,-48*u);g.lineTo(9*u,-40*u);g.closePath();g.fill();g.strokeStyle='#c58b00';g.lineWidth=u;g.stroke();E(0,-45*u,1.6*u,1.6*u,'#e35d6a');E(-6*u,-43*u,1.2*u,1.2*u,'#4dabf7');E(6*u,-43*u,1.2*u,1.2*u,'#4dabf7');return}
 /* straw */E(0,-40*u,15*u,3.6*u,'#f2c94c');E(0,-43*u,8*u,5*u,'#f2c94c');g.fillStyle='#e35d6a';g.fillRect(-8*u,-42.5*u,16*u,2.2*u);E(7*u,-42*u,2.5*u,2.5*u,'#ff8fb8');
 g.strokeStyle='rgba(160,110,20,.5)';g.lineWidth=.7*u;g.beginPath();for(let i=-12;i<=12;i+=4){g.moveTo(i*u,-41.5*u);g.lineTo(i*1.1*u,-39*u)}g.stroke()}
A.hat=hat;
/* Suzy. x,y = feet on ground. h = total height (px). o: {dir, mode:'idle'|'walk'|'run'|'dig'|'climb'|'wave'|'cheer'|'hurt', ph, t, face:0 happy/1 big smile/2 ouch, hat, shovel:true} */
A.suzy=function(x,y,h,o){const u=h/50,dir=o.dir||1,t=o.t||K.t;let mode=o.mode||'idle';let G;
 const run=mode==='run',walk=mode==='walk'||mode==='dig';const stir=mode==='stir';if(stir)mode='dig';
 if((run||walk)&&!stir)G=K.gait(o.ph||0,run?1.3:1.35,run);else G=K.gait(0,0,false);
 let bob=G.bob*u,lean=run?.12:walk?.05:0;
 // arm poses (shoulder angle, elbow bend) for near (R) / far (L)
 let shN=G.shR,elN=G.elR,shF=G.shL,elF=G.elL,shovelHeld=false,shovelA=0;
 let hipN=G.hipR,knN=G.kneeR,hipF=G.hipL,knF=G.kneeL;
 if(mode==='idle'){const b=Math.sin(t*2)*.04;shN=.12+b;shF=-.1-b;elN=.35;elF=.3;bob=Math.sin(t*2)*.6*u}
 if(mode==='dig'){const d=(o.digT||0)%1,s=Math.sin(d*TAU);shN=.9+s*.55;elN=.9-s*.45;shF=.75+s*.5;elF=1.0-s*.4;shovelHeld=true;shovelA=1.9+s*.6}
 if(mode==='climb'){const p=(o.ph||0)*TAU;shN=Math.PI*.92+Math.sin(p)*.32;elN=.35+(.5+.5*Math.cos(p))*.75;shF=Math.PI*.92-Math.sin(p)*.32;elF=.35+(.5-.5*Math.cos(p))*.75;
  hipN=.45+Math.sin(p)*.45;knN=.5+(.5+.5*Math.sin(p))*.9;hipF=.45-Math.sin(p)*.45;knF=.5+(.5-.5*Math.sin(p))*.9;bob=Math.abs(Math.sin(p))*1.2*u}
 if(mode==='wave'){shN=1.75;elN=1.15+Math.sin(t*7)*.35;shF=-.1;elF=.3}
 if(mode==='cheer'){const j=Math.abs(Math.sin(t*6));shN=1.95+j*.25;elN=1.0;shF=2.45+j*.2;elF=.7;bob=j*5*u;hipN=.1;hipF=-.1;knN=.25*j;knF=.25*j}
 if(mode==='hurt'){shN=1.9;elN=1.4;shF=1.7;elF=1.3}
 g.save();g.translate(x,y-bob);g.scale(dir,1);g.rotate(lean);
 const hipY=-17*u,shY=-29*u,TH=9*u,SH=8.5*u,UA=7*u,FA=6.5*u;
 const foot=(c)=>(fx,fy,a)=>{g.fillStyle=c;g.save();g.translate(fx,fy);g.rotate(-a*.2);g.beginPath();g.ellipse(2*u,1*u,4*u,2.2*u,0,0,TAU);g.fill();g.restore()};
 const hand=(fx,fy)=>{E(fx,fy,2.1*u,2.1*u,'#ffd7b5')};
 // carried shovel on back
 if(o.shovel!==false&&!shovelHeld){g.save();g.translate(-4*u,-24*u);g.rotate(-.5);g.strokeStyle='#8b5a2b';g.lineWidth=2.2*u;g.lineCap='round';g.beginPath();g.moveTo(0,-12*u);g.lineTo(0,10*u);g.stroke();g.fillStyle='#b8c2cc';g.beginPath();g.moveTo(-3.5*u,9*u);g.lineTo(3.5*u,9*u);g.lineTo(0,17*u);g.closePath();g.fill();g.restore()}
 // far arm + far leg (darker)
 K.limb(-1*u,shY,shF,elF,UA,FA,3.6*u,'#e8789f',1,-1,hand);
 K.limb(-1.5*u,hipY,hipF,knF,TH,SH,4.4*u,'#2f4f8f',1,1,foot('#5a2e12'));
 // torso: pink shirt + overalls
 g.fillStyle='#ff8fb8';K.rr(-7*u,shY-2*u,14*u,9*u,3*u);g.fill();
 g.fillStyle='#4a78d0';g.beginPath();g.moveTo(-7*u,shY+5*u);g.lineTo(7*u,shY+5*u);g.lineTo(7.5*u,hipY+2*u);g.lineTo(-7.5*u,hipY+2*u);g.closePath();g.fill();
 g.fillRect(-5.5*u,shY-1*u,2.6*u,7*u);g.fillRect(3*u,shY-1*u,2.6*u,7*u);E(-4.2*u,shY+5*u,1*u,1*u,'#ffd23f');E(4.2*u,shY+5*u,1*u,1*u,'#ffd23f');
 g.fillStyle='#3a62b8';K.rr(-3*u,shY+8*u,6*u,4*u,1*u);g.fill();
 // near leg
 K.limb(1.5*u,hipY,hipN,knN,TH,SH,4.6*u,'#4a78d0',1,1,foot('#6d3a1a'));
 // near arm (+ held shovel)
 const nearArm=()=>K.limb(1*u,shY,shN,elN,UA,FA,3.8*u,'#ff8fb8',1,-1,(hx,hy2,a)=>{if(shovelHeld){g.save();g.translate(hx,hy2);g.rotate(-shovelA+Math.PI/2);if(o.tool==='spoon'){g.strokeStyle='#b07d4b';g.lineWidth=2*u;g.beginPath();g.moveTo(-3*u,0);g.lineTo(11*u,0);g.stroke();E(13*u,0,3.4*u,2.2*u,'#b07d4b')}else{g.strokeStyle='#8b5a2b';g.lineWidth=2.2*u;g.beginPath();g.moveTo(-6*u,0);g.lineTo(14*u,0);g.stroke();g.fillStyle='#c5ced6';g.beginPath();g.moveTo(13*u,-4*u);g.lineTo(13*u,4*u);g.lineTo(21*u,0);g.closePath();g.fill()}g.restore()}hand(hx,hy2)});
 // head
 const hy=-37*u;E(-7*u,hy+3*u,3*u,6.5*u,'#8b4513');E(7*u,hy+3*u,3*u,6.5*u,'#8b4513');
 E(0,hy,8*u,8*u,'#ffd7b5');E(-6*u,hy+6*u,2.2*u,2.2*u,'#e35d6a');E(6*u,hy+6*u,2.2*u,2.2*u,'#e35d6a');
 g.strokeStyle='#222';g.lineWidth=1.2*u;g.lineCap='round';const f=o.face||0;
 if(f===1){g.beginPath();g.arc(-3*u,hy,1.6*u,Math.PI,0);g.moveTo(4.6*u,hy);g.arc(3*u,hy,1.6*u,Math.PI,0);g.stroke();E(0,hy+4*u,2.6*u,1.8*u,'#c0392b')}
 else if(f===2){g.beginPath();g.moveTo(-4.5*u,hy-1.5*u);g.lineTo(-1.5*u,hy+.5*u);g.moveTo(-4.5*u,hy+.5*u);g.lineTo(-1.5*u,hy-1.5*u);g.moveTo(1.5*u,hy-1.5*u);g.lineTo(4.5*u,hy+.5*u);g.moveTo(1.5*u,hy+.5*u);g.lineTo(4.5*u,hy-1.5*u);g.stroke();E(0,hy+4.5*u,1.4*u,1.8*u,'#c0392b')}
 else{if((t*60|0)%200<7){g.beginPath();g.moveTo(-4*u,hy);g.lineTo(-2*u,hy);g.moveTo(2*u,hy);g.lineTo(4*u,hy);g.stroke()}else{E(-3*u,hy,1*u,1.25*u,'#222');E(3.2*u,hy,1*u,1.25*u,'#222')}g.beginPath();g.arc(.5*u,hy+3*u,2.2*u,.3,2.8);g.stroke()}
 E(-4*u,hy+2.5*u,1.5*u,.9*u,'#ff9e9e');E(4.5*u,hy+2.5*u,1.5*u,.9*u,'#ff9e9e');
 g.save();g.translate(0,-2.6*u);hat(o.hat||'straw',u);g.restore();
 nearArm();
 g.restore();
 return{x:x-12*u,y:y-52*u,w:24*u,h:52*u}};
/* Mole: x,y = feet. s = size px (length). o:{dir,ph,col,ghost,squash,mad} 4 jointed legs */
A.mole=function(x,y,s,o){const u=s/30,dir=o.dir||1,G=K.gait(o.ph||0,o.moving?1:0,false);g.save();g.translate(x,y);g.scale(dir,1);if(o.ghost)g.globalAlpha=.55;if(o.squash){g.scale(1.4,.35)}
 const bodyY=-8*u-G.bob*.4*u;const legs=[[-7,G.hipL,G.kneeL,1],[6,G.hipR,G.kneeR,1],[-5,G.hipR,G.kneeR,0],[8,G.hipL,G.kneeL,0]];
 for(const L of legs){if(L[3])K.limb(L[0]*u,bodyY+2*u,L[1]*.8,L[2]*.9,3.6*u,3.4*u,2.4*u,'#c06a7f',1,1,(fx,fy)=>E(fx+1*u,fy,2*u,1.2*u,'#ff8fab'))}
 E(0,bodyY,14*u,9*u,o.col||'#7a5548');E(2*u,bodyY+3*u,8*u,5*u,'#d7b899');
 for(const L of legs){if(!L[3])K.limb(L[0]*u,bodyY+3*u,L[1]*.8,L[2]*.9,3.6*u,3.4*u,2.6*u,'#e08ea1',1,1,(fx,fy)=>E(fx+1*u,fy,2.2*u,1.3*u,'#ff8fab'))}
 E(13*u,bodyY-1*u,4.5*u,3.4*u,'#ff8fab');E(4*u,bodyY-4*u,2.1*u,2.1*u,'#fff');E(8.5*u,bodyY-4*u,2.1*u,2.1*u,'#fff');E(4.4*u,bodyY-3.6*u,1.05*u,1.05*u,'#222');E(8.9*u,bodyY-3.6*u,1.05*u,1.05*u,'#222');
 g.strokeStyle='#222';g.lineWidth=1.4*u;g.beginPath();if(o.mad){g.moveTo(2*u,bodyY-8*u);g.lineTo(6*u,bodyY-6.5*u);g.moveTo(11*u,bodyY-8*u);g.lineTo(7*u,bodyY-6.5*u)}g.stroke();
 g.lineWidth=.7*u;g.beginPath();g.moveTo(16*u,bodyY-1*u);g.lineTo(21*u,bodyY-3*u);g.moveTo(16*u,bodyY);g.lineTo(21*u,bodyY+1.5*u);g.stroke();
 g.restore();return{x:x-14*u,y:y-20*u,w:30*u,h:20*u}};
/* Gopher: upright, buck teeth, jointed arms that dig + legs */
A.gopher=function(x,y,s,o){const u=s/30,dir=o.dir||1,G=K.gait(o.ph||0,o.moving?1.1:0,false);g.save();g.translate(x,y);g.scale(dir,1);
 const hipY=-8*u;K.limb(-2*u,hipY,G.hipL,G.kneeL,4*u,4*u,3*u,'#9a6a3c',1,1,(fx,fy)=>E(fx+1.5*u,fy,2.6*u,1.3*u,'#6b4423'));
 E(0,-15*u,7.5*u,10*u,'#b07d4b');E(1*u,-13*u,4.5*u,7*u,'#e8c9a0');
 K.limb(2*u,hipY,G.hipR,G.kneeR,4*u,4*u,3.2*u,'#b07d4b',1,1,(fx,fy)=>E(fx+1.5*u,fy,2.6*u,1.3*u,'#6b4423'));
 E(2*u,-27*u,6.5*u,6*u,'#b07d4b');E(6.5*u,-25.5*u,2.8*u,2.2*u,'#e8c9a0');E(8.6*u,-26*u,1.2*u,1*u,'#3b2314');g.fillStyle='#fff';g.fillRect(5*u,-23.8*u,2.6*u,3*u);
 E(3.5*u,-29*u,1.3*u,1.5*u,'#222');E(-2*u,-32*u,2*u,2*u,'#9a6a3c');
 const d=(o.digT||0);K.limb(3*u,-19*u,1.2+Math.sin(d*TAU)*.5,.8-Math.sin(d*TAU)*.4,4*u,3.5*u,2.6*u,'#b07d4b',1,-1,(fx,fy)=>E(fx,fy,1.8*u,1.8*u,'#e8c9a0'));
 g.restore();return{x:x-9*u,y:y-34*u,w:20*u,h:34*u}};
/* Beetle: 6 jointed legs */
A.beetle=function(x,y,s,o){const u=s/30,dir=o.dir||1,G=K.gait(o.ph||0,1,true);g.save();g.translate(x,y);g.scale(dir,1);
 for(let i=0;i<3;i++){const ph=i%2?G.hipL:G.hipR,kn=i%2?G.kneeL:G.kneeR;K.limb((-6+i*6)*u,-6*u,ph*.7,kn*.7+.4,4*u,4*u,1.6*u,'#222',1,1)}
 E(0,-8*u,11*u,6*u,o.col||'#2b8a3e');g.strokeStyle='#0b3d1b';g.lineWidth=u;g.beginPath();g.moveTo(-10*u,-8*u);g.lineTo(9*u,-8*u);g.stroke();E(11*u,-8*u,3.5*u,3*u,'#222');E(12*u,-9*u,1*u,1*u,'#fff');
 g.restore()};
A.potato=function(x,y,rx,ry,o){o=o||{};g.save();g.translate(x,y);g.rotate(o.rot||0);const seed=o.seed||1,col=o.gold?'#ffd23f':o.col||'#d9a15b';g.fillStyle=col;g.beginPath();for(let i=0;i<=20;i++){const a=i/20*TAU,w=1+.07*Math.sin(a*3+seed)+.04*Math.sin(a*5+seed*2);g.lineTo(Math.cos(a)*rx*w,Math.sin(a)*ry*w)}g.closePath();g.fill();
 g.strokeStyle=o.gold?'#c58b00':'rgba(110,60,20,.55)';g.lineWidth=Math.max(1,rx*.08);g.stroke();
 for(let i=0;i<5;i++){const a=seed+i*1.3;E(Math.cos(a)*rx*.55,Math.sin(a*1.7)*ry*.5,rx*.06,ry*.07,o.gold?'#e0a800':'rgba(90,50,20,.45)')}
 if(o.dirt>0){g.globalAlpha=Math.min(1,o.dirt);for(let i=0;i<9;i++){const a=seed*3+i*.7;E(Math.cos(a)*rx*.6,Math.sin(a*1.3)*ry*.55,rx*(.22+.08*Math.sin(i)),ry*(.2+.06*Math.cos(i)),'#5b3a1e')}g.globalAlpha=1}
 if(o.peel!=null&&o.peel<1){/* peeled patches */g.save();g.globalAlpha=.9;for(let i=0;i<Math.floor((1-o.peel)*8);i++){const a=seed+i*.8;E(Math.cos(a)*rx*.45,Math.sin(a*1.4)*ry*.4,rx*.3,ry*.25,'#fff2c2',a)}g.restore()}
 if(o.peel===0){g.fillStyle='#fff2c2';g.beginPath();g.ellipse(0,0,rx*.98,ry*.98,0,0,TAU);g.fill()}
 E(-rx*.3,-ry*.35,rx*.25,ry*.12,'rgba(255,255,255,.3)',-.3);if(o.gold&&o.shine){K.star(rx*.6,-ry*.6,rx*.35,'#fff')}g.restore()};
A.rock=function(x,y,w,o){o=o||{};const s=w/30;g.save();g.translate(x,y);g.fillStyle=o.col||'#8d8d8d';g.beginPath();g.moveTo(-14*s,12*s);g.lineTo(-15*s,-2*s);g.lineTo(-7*s,-13*s);g.lineTo(8*s,-13*s);g.lineTo(15*s,-1*s);g.lineTo(13*s,12*s);g.closePath();g.fill();
 g.fillStyle='rgba(255,255,255,.25)';g.beginPath();g.moveTo(-10*s,-4*s);g.lineTo(-5*s,-11*s);g.lineTo(5*s,-11*s);g.lineTo(0,-5*s);g.fill();g.fillStyle='rgba(0,0,0,.2)';g.fillRect(-13*s,6*s,26*s,6*s);g.restore()};
A.crate=function(x,y,w,kind){const s=w/30;g.save();g.translate(x,y);g.fillStyle='#b0763a';K.rr(-12*s,-12*s,24*s,24*s,3*s);g.fill();g.strokeStyle='#6b4423';g.lineWidth=2*s;g.stroke();g.beginPath();g.moveTo(-12*s,-12*s);g.lineTo(12*s,12*s);g.stroke();
 K.text({hat:'⛑️',boots:'👢',whistle:'📯',heart:'❤️',coin:'🪙'}[kind]||'?',0,0,16*s,'#fff',{stroke:false});g.restore()};
/* Judge (Grandma Pearl / Mayor Biggs) with jointed clapping arms */
A.judge=function(x,y,h,o){const u=h/50,t=K.t;g.save();g.translate(x,y);const clap=o.clap?Math.abs(Math.sin(t*10)):0;
 // body
 g.fillStyle=o.coat||'#6a4c93';K.rr(-10*u,-30*u,20*u,22*u,5*u);g.fill();g.fillStyle='#3d3d3d';g.fillRect(-7*u,-9*u,5*u,9*u);g.fillRect(2*u,-9*u,5*u,9*u);E(-4.5*u,0,4*u,1.8*u,'#222');E(4.5*u,0,4*u,1.8*u,'#222');
 const hy=-37*u;E(0,hy,8*u,8*u,'#f1c7a5');if(o.hair)E(0,hy-6*u,9*u,5*u,o.hair);if(o.bun)E(0,hy-11*u,4*u,4*u,o.hair);
 if(o.glasses){g.strokeStyle='#333';g.lineWidth=1*u;g.beginPath();g.arc(-3*u,hy,2.2*u,0,TAU);g.moveTo(5.2*u,hy);g.arc(3*u,hy,2.2*u,0,TAU);g.stroke()}else{E(-3*u,hy,1*u,1.2*u,'#222');E(3*u,hy,1*u,1.2*u,'#222')}
 g.strokeStyle='#222';g.lineWidth=1.2*u;g.beginPath();g.arc(0,hy+3*u,2.4*u,.3,2.8);g.stroke();if(o.tophat){g.fillStyle='#222';g.fillRect(-6*u,hy-17*u,12*u,10*u);g.fillRect(-9*u,hy-8*u,18*u,2*u)}
 if(o.mustache){g.fillStyle='#ddd';E(-2.5*u,hy+2*u,3*u,1.2*u,'#ddd');E(2.5*u,hy+2*u,3*u,1.2*u,'#ddd')}
 // arms (jointed), clap: forearms meet in front
 const sh=-27*u,a1=.9+clap*.5,e1=1.2-clap*.3;
 K.limb(-9*u,sh,a1,e1,8*u,7*u,3.6*u,o.coat||'#6a4c93',-1,-1,(hx,hy2)=>E(hx,hy2,2.2*u,2.2*u,'#f1c7a5'));
 K.limb(9*u,sh,a1,e1,8*u,7*u,3.6*u,o.coat||'#6a4c93',1,-1,(hx,hy2)=>E(hx,hy2,2.2*u,2.2*u,'#f1c7a5'));
 g.restore();return{x:x-12*u,y:y-50*u,w:24*u,h:50*u}};
})();
