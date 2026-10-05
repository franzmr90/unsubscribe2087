/* ================= textures ================= */
/* ================= air =================
   What the dark in a place is made of, and what drifts through it.
   AMBC tints the shadow veil, so a zone's palette still reads where no lamp reaches:
   the Moors go cold and wet, the Galleria stays bruised pink, the chain runs hot.
   WX is one weather spec per style, drawn in two layers for parallax. */
const AMBC={town:'#0b0a1e',moor:'#070e12',mall:'#180a18',farm:'#04121c',trib:'#120f06',hq:'#140f1e',
 shaft:'#1a0c04',garden:'#031612',lake:'#0a0624',walk:'#121018',vest:'#0a0a10',minutes:'#0c1008',
 chairs:'#160408',rack:'#140406',still:'#040a18',landing:'#0a1020',cutler:'#140f06',mile:'#180f04',
 sofa:'#160808',reactor:'#061018',list:'#0c0c12',kitchen:'#141004',garage:'#140c02',chain:'#180c01',
 mempool:'#060a16',vault:'#0c0c12',blocks:'#140c02',room:'#000000',cage:'#04121a',wait:'#160604',mezz:'#120e22'};
const WX={
 town:{k:'mote',n:30,sp:.020},        moor:{k:'rain',n:84,sp:1.05,w:.20,c:'#8fa8b8'},
 mall:{k:'mote',n:34,sp:.022},        farm:{k:'data',n:56,sp:.62},
 trib:{k:'dust',n:40,sp:.010},        hq:{k:'mote',n:26,sp:.014},
 shaft:{k:'ember',n:46,sp:.046},      garden:{k:'spore',n:38,sp:.020},
 lake:{k:'leaf',n:22,sp:-.030},       walk:{k:'mote',n:20,sp:.012},
 vest:{k:'dust',n:34,sp:.009},        minutes:{k:'leaf',n:20,sp:-.024,c:'#e8e0c8'},
 chairs:{k:'ember',n:28,sp:.030},     rack:{k:'data',n:66,sp:.80},
 still:{k:'mote',n:22,sp:.007},       landing:{k:'mote',n:22,sp:.012},
 cutler:{k:'mote',n:26,sp:.014},      mile:{k:'mote',n:30,sp:.016},
 sofa:{k:'dust',n:34,sp:.010},        reactor:{k:'data',n:42,sp:.46},
 list:{k:'leaf',n:22,sp:-.020,c:'#ffffff'}, kitchen:{k:'mote',n:20,sp:.012},
 garage:{k:'dust',n:28,sp:.009},      chain:{k:'data',n:62,sp:.88},
 mempool:{k:'drift',n:34,sp:.030},    vault:{k:'leaf',n:22,sp:-.022,c:'#f0ead8'},
 blocks:{k:'ember',n:32,sp:.030},     room:{k:'dust',n:16,sp:.005},
 cage:{k:'data',n:48,sp:.66},         wait:{k:'dust',n:28,sp:.010},
 mezz:{k:'mote',n:24,sp:.012}};
const hex2rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const STY={
 town:{f:['#3a3448','#352f43','#403950'],w:['#6d6088','#4f4566','#3a3250'],glow:'#ffcf7a',mote:'#ffcf7a'},
 moor:{f:['#333d34','#2e382f','#38433a'],w:['#a8997e','#7d705a','#5c5242'],glow:'#ffcf7a',mote:'#c9b58a'},
 mall:{f:['#4a4460','#544d6c','#403a55'],w:['#c05a8c','#8e3f68','#662c4b'],glow:'#ff8ac4',mote:'#ff8ac4'},
 farm:{f:['#1a2738','#16212f','#1f2e42'],w:['#2f6f78','#22525a','#183c43'],glow:'#59e0e6',mote:'#59e0e6'},
 trib:{f:['#40403a','#393934','#484842'],w:['#c7a43a','#93782a','#6a561e'],glow:'#ffe36b',mote:'#b8b09a'},
 hq:{f:['#6a6278','#5f586c','#756d84'],w:['#e0bd6e','#a88a45','#7a632f'],glow:'#ffe7b0',mote:'#ffe7b0'},
 shaft:{like:'trib',f:['#3d3028','#352a23','#46382e'],w:['#b86a3a','#8a4e2a','#63381e'],glow:'#ffb060',mote:'#ffb060'},
 garden:{like:'moor',f:['#1f4038','#1b3832','#254a40'],w:['#d8e8e0','#a8c0b8','#809890'],glow:'#9fffe0',mote:'#9fffe0'},
 lake:{like:'farm',f:['#221f4a','#1c1a3e','#292556'],w:['#5a4ab8','#40348a','#2c2463'],glow:'#b48cff',mote:'#b48cff'},
 walk:{like:'mall',f:['#6a6a78','#74748a','#5e5e6c'],w:['#f0ead8','#c0b8a0','#989078'],glow:'#ffe7b0',mote:'#ffffff'},
 vest:{like:'trib',f:['#2a2a30','#24242a','#303038'],w:['#e6e2d6','#b0aca0','#807c70'],glow:'#ffffff',mote:'#ffffff'},
 minutes:{like:'hq',f:['#3a3028','#342a22','#42362c'],w:['#3a6a4a','#2a4e36','#1e3828'],glow:'#9fe0b0',mote:'#c8b890'},
 chairs:{like:'mall',f:['#3a1a22','#44202a','#30161c'],w:['#c22d35','#8a1f26','#5c151a'],glow:'#ff8a8a',mote:'#ff8a8a'},
 rack:{like:'farm',f:['#c8c8d4','#bcbcc8','#d4d4de'],w:['#c22d35','#8a1f26','#5c151a'],glow:'#ff5d4d',mote:'#ff5d4d'},
 still:{like:'town',f:['#1b2338','#161d2e','#202a42'],w:['#2a3a5a','#1e2a44','#141e30'],glow:'#9fd0ff',mote:'#9fd0ff'},
 landing:{like:'mall',f:['#8a94a8','#7e889c','#96a0b4'],w:['#e8f0ff','#b0c0e0','#8090b8'],glow:'#bfe0ff',mote:'#ffffff'},
 cutler:{like:'town',f:['#5a5440','#52503c','#625c46'],w:['#f0d8a0','#c8a870','#987c50'],glow:'#ffe7b0',mote:'#ffe7b0'},
 mile:{like:'mall',f:['#6a6450','#746e58','#5e5846'],w:['#ffd9a0','#c9a070','#98744c'],glow:'#ffd9a0',mote:'#fff3c8'},
 sofa:{like:'hq',f:['#4a3a3a','#443434','#524040'],w:['#d8a0a0','#a87474','#7c5454'],glow:'#ffc8b0',mote:'#ffc8b0'},
 reactor:{like:'farm',f:['#2a3438','#242e32','#303c40'],w:['#7a9aa0','#587278','#3e5258'],glow:'#9fe0ff',mote:'#d0f0ff'},
 list:{like:'moor',f:['#3a3a44','#34343e','#42424c'],w:['#e0dcd0','#aca89c','#7c786c'],glow:'#ffe7b0',mote:'#ffffff'},
 kitchen:{like:'hq',f:['#6a5a48','#605040','#746450'],w:['#f0e8d8','#c0b8a0','#989078'],glow:'#fff3c8',mote:'#fff3c8'},
 garage:{like:'town',f:['#2e2a26','#282420','#34302a'],w:['#6a5a48','#4e4236','#382e26'],glow:'#f7931a',mote:'#f7931a'},
 chain:{like:'farm',f:['#2c2214','#251c10','#35291a'],w:['#c47a1c','#8a5410','#5c3808'],glow:'#f7931a',mote:'#f7931a'},
 mempool:{like:'farm',f:['#151e32','#111828','#1b2740'],w:['#c9742a','#8a4e1a','#5c3410'],glow:'#ffb060',mote:'#f7931a'},
 vault:{like:'trib',f:['#44444c','#3c3c44','#4e4e58'],w:['#f0ead8','#c0b8a0','#989078'],glow:'#ffffff',mote:'#f0ead8'},
 blocks:{like:'hq',f:['#302615','#291f11','#3a2d1b'],w:['#e0bd6e','#a88a45','#7a632f'],glow:'#f7931a',mote:'#ffe7b0'},
 room:{like:'town',f:['#1d1d20','#19191c','#232326'],w:['#3a3a3a','#2a2a2a','#1c1c1c'],glow:'#ffffff',mote:'#f7931a'},
 cage:{like:'farm',f:['#1c2228','#181e24','#20282e'],w:['#5a6a78','#404e5a','#2c3842'],glow:'#59e0e6',mote:'#59e0e6'},
 wait:{like:'trib',f:['#2a1418','#24101a','#321a1e'],w:['#6a5a4a','#4e4236','#382e26'],glow:'#ffb080',mote:'#ff8a6a'},
 mezz:{like:'hq',f:['#8a8898','#7e7c8c','#9694a4'],w:['#f4f0ff','#b8b0d8','#8a82b0'],glow:'#d8c8ff',mote:'#d8c8ff'}};
let TX={};
function mk(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return c}
function noise(g,w,h,n,a){for(let i=0;i<n;i++){g.fillStyle=Math.random()<.5?`rgba(0,0,0,${a})`:`rgba(255,255,255,${a*.6})`;g.fillRect(rnd(0,w),rnd(0,h),rnd(1,2.5),rnd(1,2.5))}}
function floorDetail(g,st,v,s,st0){
  const L=(x0,y0,x1,y1,c,w)=>{g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()};
  if(FD[st0]){FD[st0](g,v,s,L);return}
  if(st==='town'){L(0,16.5,33,16.5,'rgba(0,0,0,.28)');L(16.5,0,16.5,33,'rgba(0,0,0,.28)');L(0,.5,33,.5,'rgba(0,0,0,.35)');L(.5,0,.5,33,'rgba(0,0,0,.35)');if(v===3){g.fillStyle='rgba(255,255,255,.06)';g.fillRect(1,1,15,15)}}
  if(st==='moor'){if(v===3){g.fillStyle='#2b2b32';g.fillRect(0,0,33,33);g.fillStyle='#b89a3a';g.fillRect(4,15,9,3);g.fillRect(20,15,9,3)}else{for(let i=0;i<26;i++){const x=rnd(0,33),y=rnd(0,33);L(x,y,x+rnd(-1,1),y-rnd(1.5,3.5),Math.random()<.5?'#4a5a45':'#56604a')}if(v===4){g.fillStyle='#a8895c';g.fillRect(10,12,8,6);g.fillStyle='#7d6540';g.fillRect(10,14,8,1.5)}}}
  if(st==='mall'){g.fillStyle='rgba(255,255,255,.07)';g.fillRect(0,0,16.5,16.5);g.fillRect(16.5,16.5,16.5,16.5);L(0,.5,33,.5,'rgba(0,0,0,.3)');L(.5,0,.5,33,'rgba(0,0,0,.3)');L(4,28,28,4,'rgba(255,255,255,.08)',3);if(v===4){g.fillStyle='rgba(255,138,196,.25)';g.fillRect(12,12,9,9)}}
  if(st==='farm'){L(0,.5,33,.5,'rgba(0,0,0,.45)');L(.5,0,.5,33,'rgba(0,0,0,.45)');L(3,3,30,3,'rgba(255,255,255,.05)');if(v%2){L(0,16.5,33,16.5,'rgba(89,224,230,.45)',1.2);g.fillStyle='#9ff';g.fillRect(rnd(4,28),15.5,2,2)}else L(16.5,0,16.5,33,'rgba(89,224,230,.18)',1);for(let i=0;i<4;i++){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(4+i*7,24,4,5)}}
  if(st==='trib'){L(0,.5,33,.5,'rgba(0,0,0,.35)');L(.5,0,.5,33,'rgba(0,0,0,.35)');if(v===3){for(let i=0;i<6;i++){g.fillStyle=i%2?'#1c1c1a':'#c7a43a';g.beginPath();g.moveTo(i*6,12);g.lineTo(i*6+6,12);g.lineTo(i*6+2,20);g.lineTo(i*6-4,20);g.fill()}}else{const x=rnd(5,25),y=rnd(5,25);L(x,y,x+rnd(-8,8),y+rnd(-8,8),'rgba(0,0,0,.3)')}}
  if(st==='hq'){for(let i=0;i<3;i++){g.strokeStyle='rgba(255,255,255,.13)';g.lineWidth=rnd(.5,1.5);g.beginPath();g.moveTo(rnd(0,33),0);g.bezierCurveTo(rnd(0,33),11,rnd(0,33),22,rnd(0,33),33);g.stroke()}L(0,.5,33,.5,'rgba(0,0,0,.25)');L(.5,0,.5,33,'rgba(0,0,0,.25)');if(v===4){g.strokeStyle='rgba(224,189,110,.7)';g.lineWidth=1.2;g.strokeRect(5,5,23,23)}}
}
/* Floor detail for the styles that used to borrow someone else's. Each one draws the
   sentence in the zone's own intro: the chain is made of settled payments, the Mempool
   of ones still waiting, the Vaults of paper written against coins nobody holds, and
   the Room is plain because that was always the joke about it. */
const FD={
 chain(g,v,s,L){for(let y=2;y<33;y+=8){for(let x=2;x<31;x+=5){g.fillStyle=(x+y+v)%3?'rgba(247,147,26,.30)':'rgba(247,147,26,.68)';g.fillRect(x,y,3.4,2.2)}L(0,y+5.5,33,y+5.5,'rgba(247,147,26,.14)')}
  if(v===3){g.fillStyle='rgba(255,208,140,.5)';g.font='700 5px monospace';g.fillText('00000000',3,30)}},
 mempool(g,v,s,L){for(let i=0;i<7;i++){const y=2+i*4.4,w=6+((i*11+v*7)%20);g.fillStyle='rgba(247,147,26,'+(.5-i*.055)+')';g.fillRect(1,y,w,2.2)}
  L(0,.5,33,.5,'rgba(0,0,0,.4)');L(.5,0,.5,33,'rgba(0,0,0,.4)');if(v%2){g.fillStyle='rgba(255,176,96,.22)';g.fillRect(0,0,33,33)}},
 blocks(g,v,s,L){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,0,33,33);g.fillStyle='rgba(240,234,216,.82)';g.fillRect(9,7,15,19);g.fillStyle='rgba(60,50,36,.65)';for(let i=0;i<6;i++)g.fillRect(11,10+i*3,11-((i*5+v)%5),1);
  g.fillStyle='rgba(247,147,26,.5)';g.fillRect(9,26,15,1.4);L(0,.5,33,.5,'rgba(0,0,0,.4)');L(.5,0,.5,33,'rgba(0,0,0,.4)')},
 vault(g,v,s,L){for(let i=0;i<5;i++){const x=2+i*6.2;g.fillStyle='rgba(240,234,216,'+(.5+((i+v)%3)*.14)+')';g.fillRect(x,6,5,21);g.fillStyle='rgba(0,0,0,.32)';g.fillRect(x+4.2,6,.9,21)}
  if(v===4){g.strokeStyle='rgba(194,45,53,.6)';g.lineWidth=1.4;g.beginPath();g.arc(16.5,16.5,7,0,6.283);g.stroke()}
  L(0,.5,33,.5,'rgba(0,0,0,.35)');L(.5,0,.5,33,'rgba(0,0,0,.35)')},
 room(g,v,s,L){L(0,.5,33,.5,'rgba(0,0,0,.5)');L(.5,0,.5,33,'rgba(0,0,0,.5)');g.fillStyle='rgba(255,255,255,.025)';g.fillRect(1,1,31,31);
  if(v===2){g.strokeStyle='rgba(247,147,26,.10)';g.lineWidth=1;g.beginPath();g.arc(16.5,16.5,12,0,6.283);g.stroke()}},
 still(g,v,s,L){g.strokeStyle='rgba(159,208,255,.16)';g.lineWidth=1;for(let r=5;r<30;r+=7){g.beginPath();g.arc(16.5+((v*7)%9)-4,16.5,r,0,6.283);g.stroke()}
  g.fillStyle='rgba(159,208,255,.07)';g.fillRect(0,0,33,33);L(0,16.5,33,16.5,'rgba(159,208,255,.10)')},
 lake(g,v,s,L){g.fillStyle='rgba(180,140,255,.09)';g.fillRect(0,0,33,33);
  if(v%2){g.save();g.translate(16.5,16.5);g.rotate((v*1.3)%3.14);g.fillStyle='rgba(224,220,240,.30)';g.fillRect(-6,-8,12,16);g.fillStyle='rgba(90,74,184,.5)';for(let i=0;i<4;i++)g.fillRect(-4,-5+i*4,8,1);g.restore()}
  g.strokeStyle='rgba(180,140,255,.22)';g.lineWidth=1;g.beginPath();g.arc(16.5,16.5,9+((v*5)%7),.4,2.6);g.stroke()},
 rack(g,v,s,L){L(0,.5,33,.5,'rgba(0,0,0,.30)');L(.5,0,.5,33,'rgba(0,0,0,.30)');
  g.fillStyle='rgba(60,60,70,.55)';for(let x=3;x<30;x+=6)g.fillRect(x,4,3,25);
  if(v%2){g.fillStyle='rgba(194,45,53,.5)';g.fillRect(0,15.5,33,2)}else{g.fillStyle='rgba(120,120,135,.35)';g.fillRect(14,0,5,33)}},
 garden(g,v,s,L){g.fillStyle='rgba(31,64,56,.6)';g.fillRect(0,0,33,33);g.fillStyle='rgba(159,255,224,.14)';g.fillRect(3,3,27,27);
  g.strokeStyle='rgba(216,232,224,.45)';g.lineWidth=1;g.strokeRect(3.5,3.5,26,26);
  if(v===3){g.fillStyle='rgba(159,255,224,.3)';g.beginPath();g.arc(16.5,16.5,6,0,6.283);g.fill()}
  else for(let i=0;i<9;i++){g.fillStyle='rgba(120,180,150,.4)';g.fillRect(5+(i%3)*9,5+((i/3)|0)*9,5,5)}},
 cage(g,v,s,L){L(0,.5,33,.5,'rgba(0,0,0,.55)');L(.5,0,.5,33,'rgba(0,0,0,.55)');
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(2,2,29,29);for(const[x,y]of[[6,6],[27,6],[6,27],[27,27]]){g.fillStyle='rgba(140,150,165,.5)';g.fillRect(x-1,y-1,2,2)}
  if(v===1){g.fillStyle='rgba(200,200,190,.55)';g.fillRect(0,14,33,3.4);g.fillStyle='rgba(89,224,230,.6)';g.fillRect(0,15.2,33,1)}},
 garage(g,v,s,L){L(0,16.5,33,16.5,'rgba(0,0,0,.35)');L(16.5,0,16.5,33,'rgba(0,0,0,.35)');
  if(v===2){g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(18,19,7,4,.4,0,6.283);g.fill()}
  if(v===4){g.fillStyle='rgba(247,147,26,.2)';g.fillRect(8,8,17,17)}
  for(let i=0;i<10;i++){g.fillStyle='rgba(255,255,255,.04)';g.fillRect(rnd(0,33),rnd(0,33),2,1)}},
 kitchen(g,v,s,L){for(let y=0;y<33;y+=8.25)for(let x=0;x<33;x+=8.25){g.fillStyle=(((x+y)/8.25)|0)%2?'rgba(255,243,200,.10)':'rgba(0,0,0,.10)';g.fillRect(x,y,8.25,8.25)}
  if(v===3){g.strokeStyle='rgba(120,80,40,.5)';g.lineWidth=1.3;g.beginPath();g.arc(16.5,16.5,5.5,0,6.283);g.stroke()}},
 sofa(g,v,s,L){g.fillStyle='rgba(216,160,160,.12)';g.fillRect(0,0,33,33);
  for(let i=0;i<5;i++){g.strokeStyle='rgba(255,200,176,.18)';g.lineWidth=1;g.beginPath();g.moveTo(0,i*7+(v%3));g.lineTo(33,i*7+(v%3)+3);g.stroke()}
  if(v===4){g.fillStyle='rgba(0,0,0,.22)';g.fillRect(7,10,19,13)}},
 mile(g,v,s,L){L(0,.5,33,.5,'rgba(0,0,0,.26)');L(.5,0,.5,33,'rgba(0,0,0,.26)');
  g.fillStyle='rgba(255,243,200,.10)';g.fillRect(2,2,29,29);
  if(v%2){g.fillStyle='rgba(255,217,160,.3)';g.fillRect(4,28,25,2)}}};
/* Wall faces for the same set. */
const WD={
 chain(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.32)';g.fillRect(0,H-3,33,3);
  for(let y=3;y<H-2;y+=5){g.fillStyle='rgba(0,0,0,.38)';g.fillRect(2,y,29,4);g.font='700 3.4px monospace';
   for(let x=3;x<30;x+=3.6){g.fillStyle=((x*7+y*3+v)|0)%4?'rgba(247,147,26,.55)':'rgba(255,220,170,.95)';g.fillText('0123456789abcdef'[((x*13+y*7+v*5)|0)%16],x,y+3.2)}}},
 rack(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.4)';g.fillRect(0,H-3,33,3);
  for(let y=3;y<H-3;y+=4.4){g.fillStyle='rgba(30,10,12,.75)';g.fillRect(2,y,29,3.4);
   for(let x=4;x<30;x+=3){g.fillStyle=((x+y*3+v)|0)%5?'rgba(194,45,53,.55)':'#ff8a7a';g.fillRect(x,y+1,1.4,1.4)}}},
 vault(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,H-3,33,3);
  for(let y=4;y<H-4;y+=9){g.fillStyle='rgba(0,0,0,.42)';g.fillRect(2,y,29,8);
   for(let x=3;x<30;x+=4){g.fillStyle='rgba(240,234,216,'+(.45+((x+y+v)%3)*.18)+')';g.fillRect(x,y+1,3,6)}}},
 garden(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(0,H-3,33,3);
  g.fillStyle='rgba(255,255,255,.14)';g.fillRect(0,0,33,2);
  for(let y=4;y<H;y+=6)for(let x=2;x<32;x+=6){g.fillStyle=((x+y+v)%2)?'rgba(130,190,165,.30)':'rgba(90,150,125,.30)';g.fillRect(x,y,5,5)}},
 room(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,H-3,33,3);g.fillStyle='rgba(255,255,255,.05)';g.fillRect(0,0,33,1.5);
  if(H>20){g.fillStyle='rgba(247,147,26,.14)';g.fillRect(14,H*.35,5,5)}},
 blocks(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.3)';g.fillRect(0,H-3,33,3);
  for(let y=3;y<H-3;y+=11){g.fillStyle='rgba(240,234,216,.72)';g.fillRect(4+side*2,y,24,8);g.fillStyle='rgba(80,66,48,.7)';for(let i=0;i<4;i++)g.fillRect(6+side*2,y+1.4+i*1.8,19-((i+v)%6),.9)}},
 mempool(g,H,v,side,s){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(0,H-3,33,3);
  for(let y=2;y<H;y+=3.4){const w=4+((y*5+v*9)%25);g.fillStyle='rgba(247,147,26,'+(.18+(y%7)*.05)+')';g.fillRect(1,y,w,2)}}};
function faceDetail(g,st,H,v,side,s,st0){
  if(WD[st0]){WD[st0](g,H,v,side,s);return}
  const tall=H>20;g.fillStyle='rgba(0,0,0,.28)';g.fillRect(0,H-3,33,3);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,0,33,1.5);
  const win=(x,y,w,h,c)=>{g.fillStyle='#0b0912';g.fillRect(x-1,y-1,w+2,h+2);g.fillStyle=c;g.fillRect(x,y,w,h)};
  if(st==='moor'||st==='town'){for(let y=6;y<H;y+=6){g.fillStyle='rgba(0,0,0,.16)';g.fillRect(0,y,33,1)}if(tall&&(v+side)%2===0)win(11,12,11,13,st==='town'?'#ffcf7a':'#e8c880');if(tall&&st==='town'&&(v+side)%2){g.fillStyle='rgba(0,0,0,.2)';for(let x=4;x<33;x+=8)g.fillRect(x,0,1,H)}}
  if(st==='mall'){g.fillStyle='#ff8ac4';g.fillRect(0,5,33,2);if(tall){win(6,14,21,18,v?'#59e0e6':'#ffe36b');g.fillStyle='rgba(0,0,0,.5)';g.fillRect(9,18,15,2);g.fillRect(9,23,10,2)}}
  if(st==='farm'){for(let y=5;y<H-4;y+=5){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(3,y,27,3);for(let x=5;x<28;x+=4){g.fillStyle=Math.random()<.5?'#59e0e6':Math.random()<.5?'#7be495':'#16303a';g.fillRect(x,y+1,1.5,1.2)}}}
  if(st==='trib'){for(let i=0;i<7;i++){g.fillStyle=i%2?'#1c1c1a':'#e0bd3a';g.fillRect(i*5,H-8,5,5)}if(tall){win(10,9,13,16,'#1b1b22');g.fillStyle='#93782a';for(let x=12;x<23;x+=3)g.fillRect(x,9,1,16)}}
  if(st==='hq'){g.fillStyle='rgba(20,24,40,.6)';g.fillRect(2,3,29,H-7);for(let x=2;x<33;x+=10){g.fillStyle=s.w[0];g.fillRect(x,3,1.2,H-7)}for(let y=3;y<H-4;y+=11){g.fillStyle=s.w[0];g.fillRect(2,y,29,1.2)}g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(4,H-6);g.lineTo(14,4);g.lineTo(19,4);g.lineTo(9,H-6);g.fill()}
}
function wallTex(s,st,H,v,st0){const c=mk(66,34+H),g=c.getContext('2d');
  g.save();g.transform(1,.5,0,1,0,17);g.fillStyle=s.w[1];g.fillRect(0,0,33,H);faceDetail(g,st,H,v,0,s,st0);g.restore();
  g.save();g.transform(1,-.5,0,1,33,34);g.fillStyle=s.w[2];g.fillRect(0,0,33,H);faceDetail(g,st,H,v,1,s,st0);g.restore();
  g.beginPath();g.moveTo(33,0);g.lineTo(66,17);g.lineTo(33,34);g.lineTo(0,17);g.closePath();g.fillStyle=s.w[0];g.fill();g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=1;g.stroke();
  g.strokeStyle='rgba(0,0,0,.5)';g.beginPath();g.moveTo(33,34);g.lineTo(33,34+H);g.stroke();
  g.globalCompositeOperation='source-atop';noise(g,66,34+H,H>20?110:40,.07);return c}
function buildTextures(st0){if(TX.style===st0)return;const s=STY[st0],st=s.like||st0;TX={style:st0,s,floor:[],wall:[],low:null};
  for(let v=0;v<5;v++){const c=mk(66,34),g=c.getContext('2d');g.beginPath();g.moveTo(33,0);g.lineTo(66,17);g.lineTo(33,34);g.lineTo(0,17);g.closePath();g.clip();
    g.fillStyle=s.f[v%3];g.fillRect(0,0,66,34);g.save();g.transform(1,.5,-1,.5,33,0);floorDetail(g,st,v,s,st0);g.restore();noise(g,66,34,55,.07);TX.floor.push(c)}
  for(let v=0;v<2;v++)TX.wall.push(wallTex(s,st,46,v,st0));TX.low=wallTex(s,st,12,0,st0);
  TX.amb=hex2rgb(AMBC[st0]||AMBC[st]||'#040308');
  {const L=hex2rgb(s.f[0]);TX.fill=clamp(.38-(L[0]+L[1]+L[2])/765*.85,.04,.28)}
  const wx=TX.wx=Object.assign({k:'mote',n:28,sp:.016},WX[st0]||WX[st]||{});wx.c=wx.c||s.mote;
  MOTES.length=0;for(let i=0;i<wx.n;i++)MOTES.push(newMote(i<wx.n*.22));}
const MOTES=[];
/* near particles are bigger, faster and fainter, and slide against the camera; that
   difference is the whole parallax effect. */
function newMote(near){return{x:Math.random(),y:Math.random(),p:rnd(0,6.283),j:rnd(.6,1.5),near:near?1:0,s:rnd(1,2.4)*(near?2.1:1),v:rnd(.7,1.35)*(near?2.2:1)}}
let wLast=0;
function weather(){const wx=TX.wx;if(!wx)return;const dt=Math.min(.05,Math.max(0,tNow-wLast));wLast=tNow;const k=wx.k,px=cx*.00022,py=cy*.00022;
  ctx.globalCompositeOperation='lighter';ctx.fillStyle=wx.c;
  for(const m of MOTES){
    const v=wx.sp*m.v;
    if(k==='rain'||k==='data'){m.y+=v*dt;m.x+=(wx.w||0)*v*dt*.35;if(m.y>1.06){m.y=-.06;m.x=Math.random()}}
    else{m.y-=v*dt;m.x+=Math.sin(tNow*m.j+m.p)*.00045*(1+m.near);
      if(m.y<-.06){m.y=1.06;m.x=Math.random()}else if(m.y>1.06){m.y=-.06;m.x=Math.random()}}
    if(m.x>1.08)m.x-=1.16;else if(m.x<-.08)m.x+=1.16;
    const X=(m.x-(m.near?px:px*.35))*VW,Y=(m.y-(m.near?py:py*.35))*VH,s=m.s;
    ctx.globalAlpha=(m.near?.10:.26)+(k==='rain'||k==='data'?.08:.22)*Math.sin(tNow*2*m.j+m.p);
    if(k==='rain'){ctx.fillRect(X,Y,1,7+s*2.4)}
    else if(k==='data'){ctx.fillRect(X,Y,1.4,3+s*3.2);if(((tNow*3+m.p)|0)%4===0)ctx.fillRect(X,Y-7,1.4,2)}
    else if(k==='leaf'){ctx.save();ctx.translate(X,Y);ctx.rotate(tNow*.5*m.j+m.p);ctx.fillRect(-s*1.7,-s*2.3,s*3.4,s*4.6);ctx.restore()}
    else if(k==='ember'){ctx.fillRect(X,Y,s,s);ctx.globalAlpha*=.4;ctx.fillRect(X-s*.6,Y+s*1.6,s*2.2,s*2.2)}
    else if(k==='drift'){ctx.beginPath();ctx.ellipse(X,Y,s*3.4,s*1.3,0,0,6.283);ctx.fill()}
    else if(k==='spore'){ctx.beginPath();ctx.arc(X,Y,s*.9,0,6.283);ctx.fill()}
    else ctx.fillRect(X,Y,s,s)}
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}

/* ================= canvas ================= */
const cv=$('cv'),ctx=cv.getContext('2d');let VW=400,VH=700,ZM=1,DPR=1,CW=400,CH=700,cx=0,cy=0;
const LC=mk(8,8),lg=LC.getContext('2d');let LIGHTS=[];
function resize(){const r=cv.getBoundingClientRect();CW=r.width;CH=r.height;DPR=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,CW*DPR);cv.height=Math.max(1,CH*DPR);ZM=clamp(Math.min(CW,CH)/560,.68,1.25);VW=CW/ZM;VH=CH/ZM;LC.width=Math.ceil(VW/4);LC.height=Math.ceil(VH/4)}
addEventListener('resize',resize);
const SX=(x,y)=>(x-y)*32-cx+VW/2, SY=(x,y)=>(x+y)*16-cy+VH*.44;
const OL='#0b0912';
function shadow(X,Y,r){ctx.fillStyle='rgba(0,0,0,.42)';ctx.beginPath();ctx.ellipse(X,Y,r,r*.5,0,0,6.283);ctx.fill()}
function box(x,y,w,h,r,col){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=col;ctx.fill();ctx.stroke()}
function poly(pts,col){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.stroke()}
function glow(X,Y,r,col,a){const g=ctx.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(X-r,Y-r,r*2,r*2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
function light(X,Y,r,col,s){LIGHTS.push({X,Y,r,col,s:s===undefined?1:s})}
function human(X,Y,o){
  const s=o.s||1,f=o.f||1,sw=o.mov?Math.sin(o.ph):0,b=o.mov?Math.abs(Math.cos(o.ph))*1.6:Math.sin(tNow*2+(o.ph||0))*.5;
  shadow(X,Y,12*s);ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';
  box(X-6*s-sw*2.5*s,Y-13*s,5*s,13*s-Math.max(0,sw)*3,2,o.leg||'#2a2433');box(X+1*s+sw*2.5*s,Y-13*s,5*s,13*s-Math.max(0,-sw)*3,2,o.leg||'#2a2433');
  box(X-f*8*s-2*s,Y-29*s+b-sw*2,4*s,12*s,2,o.c2);
  box(X-8*s,Y-31*s+b,16*s,20*s,4*s,o.c);
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(X+(f>0?-7:2)*s,Y-29*s+b,5*s,16*s);
  ctx.beginPath();ctx.arc(X,Y-37*s+b,6.5*s,0,6.283);ctx.fillStyle=o.skin||'#d9b08c';ctx.fill();ctx.stroke();
  return b}
function drawPlayer(X,Y){
  const c=CLS[G.cls],dx=(P.dir.x-P.dir.y),dy=(P.dir.x+P.dir.y)*.5,l=Math.hypot(dx,dy)||1;let ux=dx/l,uy=dy/l;const f=ux>=0?1:-1;
  if(P.buff>0||P.haste>0||P.guard>0){ctx.strokeStyle=P.buff>0?'#ff5d4d':P.guard>0?'#ffe36b':'#7be495';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,19,9.5,0,0,6.283);ctx.stroke()}
  const dying=mode==='dying';if(dying){const u=Math.min(1,DY.t/.9);ctx.fillStyle='rgba(110,8,8,'+Math.min(.75,DY.t*.5)+')';ctx.beginPath();ctx.ellipse(X+10,Y,6+Math.min(26,DY.t*16),3+Math.min(13,DY.t*8),0,0,6.283);ctx.fill();ctx.save();ctx.translate(X,Y);ctx.rotate(u*u*1.5);ctx.translate(-X,-Y);ctx.globalAlpha=1-Math.max(0,DY.t-1.6)*.6}
  if(P.dash)ctx.globalAlpha=.6;if(P.stealth>0)ctx.globalAlpha=.3;
  const dark={scrapper:'#9a5a1c',hacker:'#5c3aa8',courier:'#23805c',anon:'#22222a',founder:'#101016'}[G.cls];
  if(P.mech>0){ctx.strokeStyle=OL;ctx.lineWidth=1.4;box(X-17,Y-34,9,14,2,'#e0bd6e');box(X+8,Y-34,9,14,2,'#e0bd6e');box(X-13,Y-14,9,14,2,'#a88a45');box(X+4,Y-14,9,14,2,'#a88a45');glow(X,Y-22,40,'#e0bd6e',.35)}
  const b=human(X,Y,{c:P.flash>0?'#fff':c.col,c2:dark,ph:P.walkPh,mov:P.moving,f,leg:G.cls==='hacker'?'#1d1830':'#2e2a36'});
  const hy=Y-37+b;ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(G.cls==='scrapper'){ctx.fillStyle='#e8e06a';ctx.fillRect(X-8,Y-25+b,16,2.5);ctx.fillRect(X-8,Y-19+b,16,2.5);
    ctx.beginPath();ctx.arc(X,hy-1,7.5,3.14,0);ctx.closePath();ctx.fillStyle='#e0bd3a';ctx.fill();ctx.stroke();box(X-9+f*2,hy-2,18,2.5,1,'#e0bd3a')}
  else if(G.cls==='hacker'){ctx.beginPath();ctx.arc(X,hy,8,2.6,.54);ctx.lineTo(X+7,hy+7);ctx.lineTo(X-7,hy+7);ctx.closePath();ctx.fillStyle='#3d2878';ctx.fill();ctx.stroke();
    ctx.fillStyle='#59e0e6';ctx.fillRect(X-5+f*1.5,hy-1.5,10,2.6);poly([X-8,Y-12+b,X+8,Y-12+b,X+6,Y-4,X-6,Y-4],dark)}
  else if(G.cls==='anon'){ctx.beginPath();ctx.arc(X,hy,8,2.6,.54);ctx.lineTo(X+7,hy+7);ctx.lineTo(X-7,hy+7);ctx.closePath();ctx.fillStyle='#17171c';ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(X+f*1.5,hy+.5,5,5.6,0,0,6.283);ctx.fillStyle='#e6e2d6';ctx.fill();ctx.stroke();ctx.fillStyle='#0b0912';ctx.fillRect(X+f*1.5-3.2,hy-1.5,2.2,1.6);ctx.fillRect(X+f*1.5+1,hy-1.5,2.2,1.6)}
  else if(G.cls==='founder'){ctx.beginPath();ctx.arc(X,hy-2,6.8,3.3,6.1);ctx.closePath();ctx.fillStyle='#9a968c';ctx.fill();ctx.stroke();ctx.strokeStyle='#0b0912';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(X+f*1.5-2.6,hy+.5,2,0,6.283);ctx.arc(X+f*1.5+2.6,hy+.5,2,0,6.283);ctx.stroke();ctx.lineWidth=1.4;ctx.strokeStyle=OL;box(X-8,Y-31+b,16,5,2,'#101016')}
  else{box(X-f*11-4,Y-30+b,8,12,2,'#8a6a40');ctx.strokeStyle='#5a4326';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X-7,Y-30+b);ctx.lineTo(X+7,Y-14+b);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(X,hy-1,7,3.14,0);ctx.closePath();ctx.fillStyle='#1f5a44';ctx.fill();ctx.stroke();box(X+(f>0?2:-11),hy-2.5,9,2.5,1,'#1f5a44')}
  const E=G.eq,qc=it=>QCOL[it.q];ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(sl(11)>0&&!W.z.town){ctx.strokeStyle='rgba(180,140,255,.28)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,3.2*45,3.2*22.5,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  if(Object.values(E).some(i=>i&&i.q===4))glow(X,Y-4,28,'#d0aa62',.28);
  if(E.armor){const t=tierOf(E.armor.il);if(t===0){ctx.fillStyle=qc(E.armor);ctx.fillRect(X-8,Y-27+b,16,1.6);ctx.fillRect(X-8,Y-16+b,16,1.6)}else{box(X-8.5,Y-31+b,17,13,3,['','#4a4458','#8a94a8','#d8d0f0'][t]);if(t>=2){box(X-12.5,Y-33+b,6.5,6.5,2,t===3?'#f0ecff':'#a8b0c0');box(X+6,Y-33+b,6.5,6.5,2,t===3?'#f0ecff':'#a8b0c0')}ctx.fillStyle=qc(E.armor);ctx.fillRect(X-1,Y-29+b,2,9)}}
  if(E.belt){ctx.fillStyle=qc(E.belt);ctx.fillRect(X-8,Y-14.5+b,16,2.4);ctx.fillStyle='#0b0912';ctx.fillRect(X-1.5,Y-15+b,3,3.4)}
  if(E.boots){const t=tierOf(E.boots.il);ctx.fillStyle=['#6a5a48','#4a5060','#8a94a8','#e0d8ff'][t];ctx.fillRect(X-7,Y-5,6,5);ctx.fillRect(X+1,Y-5,6,5);ctx.fillStyle=qc(E.boots);ctx.fillRect(X-7,Y-5,6,1.3);ctx.fillRect(X+1,Y-5,6,1.3)}
  if(E.amulet){ctx.fillStyle=qc(E.amulet);ctx.beginPath();ctx.arc(X,Y-29.5+b,1.9,0,6.283);ctx.fill();ctx.stroke()}
  if(E.helm){const t=tierOf(E.helm.il),hc=['#c9a83a','#5a6478','#9aa4b8','#f0ecff'][t];ctx.beginPath();ctx.arc(X,hy-1,7.7,3.14,0);ctx.closePath();ctx.fillStyle=hc;ctx.fill();ctx.stroke();
    if(t>=1){box(X-7.7,hy-1.6,15.4,3.6,1,hc);ctx.fillStyle=qc(E.helm);ctx.fillRect(X-5+f*1.5,hy-.9,10,1.9)}else{box(X-9+f*2,hy-2,18,2.3,1,hc);ctx.fillStyle=qc(E.helm);ctx.fillRect(X-3,hy-7.5,6,1.5)}
    if(t>=3){ctx.strokeStyle=qc(E.helm);ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(X,hy-11,7,2.4,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}}
  // weapon arm
  if(P.spin>0){const a=tNow*30;ux=Math.cos(a);uy=Math.sin(a)*.5}
  const sw=P.swing>0?Math.sin(P.swing/.18*3.14)*12:0,reach=13+sw,hx=X+ux*reach,hyy=Y-21+uy*reach+b;
  ctx.lineCap='round';ctx.strokeStyle=OL;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X+ux*5,Y-24+b);ctx.lineTo(hx,hyy);ctx.stroke();ctx.strokeStyle=dark;ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineCap='butt';
  if(E.gloves){ctx.fillStyle=qc(E.gloves);ctx.fillRect(hx-2.8,hyy-2.8,5.6,5.6);ctx.strokeRect(hx-2.8,hyy-2.8,5.6,5.6)}
  const wp=E.weapon,wt=wp?tierOf(wp.il):0;
  if(wp&&G.cls!=='hacker'&&G.cls!=='founder'){const wc=wp.q?qc(wp):'#c8ccd4';
    if(wp.spd<0){const tx=hx+ux*(13+wt),ty=hyy+uy*(13+wt)-10;ctx.strokeStyle='#8f8a80';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx-ux*4,hyy+3);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
      if(wt===0){const p=[];for(let i=0;i<8;i++){const a=i*.785+.39;p.push(tx+Math.cos(a)*8,ty+Math.sin(a)*8)}poly(p,'#c22d35');ctx.fillStyle='#fff';ctx.fillRect(tx-4.5,ty-1.2,9,2.4)}
      else{box(tx-7-wt,ty-6-wt,14+wt*2,11+wt*2,2,['','#6a6e7a','#8a94a8','#e0d8ff'][wt]);ctx.fillStyle=wc;ctx.fillRect(tx-7-wt,ty-1,14+wt*2,2)}}
    else if(wp.spd>0){const L=11+wt*2.5;poly([hx,hyy-2,hx+ux*L,hyy+uy*L-5,hx+ux*3+3,hyy+uy*3+1],wt>=2?'#eef2f8':'#d8e0e8');ctx.strokeStyle=wc;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(hx,hyy-2);ctx.lineTo(hx+ux*L,hyy+uy*L-5);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
    else{const L=15+wt*2,tx=hx+ux*L,ty=hyy+uy*L-8;ctx.strokeStyle=wt?'#5a6478':'#8f8a80';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx-ux*3,hyy+2);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(tx,ty,2.5+wt*.8,0,6.283);ctx.fillStyle=wc;ctx.fill();ctx.stroke();if(wt>=2)glow(tx,ty,14,wc,.6)}
    if(wp.q>=2)glow(hx+ux*10,hyy+uy*10-6,16,wc,.35)}
  else if(G.cls==='scrapper'){const tx=hx+ux*14,ty=hyy+uy*14-10;ctx.strokeStyle='#8f8a80';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx-ux*4,hyy+3);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    const p=[];for(let i=0;i<8;i++){const a=i*.785+.39;p.push(tx+Math.cos(a)*8,ty+Math.sin(a)*8)}poly(p,'#c22d35');ctx.fillStyle='#fff';ctx.fillRect(tx-4.5,ty-1.2,9,2.4)}
  else if(G.cls==='hacker'){const r=4.5+wt*.8+Math.sin(tNow*8);if(wp&&wp.q)glow(hx,hyy-3,18+wt*3,qc(wp),.5);ctx.beginPath();ctx.arc(hx,hyy-3,r,0,6.283);ctx.fillStyle='#c8fbff';ctx.fill();glow(hx,hyy-3,22,'#59e0e6',.7);light(hx,hyy-3,60,'#59e0e6')}
  else if(G.cls==='founder'){box(hx-5,hyy-9,10,8,1,'#17131c');ctx.fillStyle='#59e0e6';ctx.fillRect(hx-3.5,hyy-7.5,7,5);glow(hx,hyy-5,14,'#59e0e6',.4)}
  else{poly([hx,hyy-2,hx+ux*11,hyy+uy*11-5,hx+ux*3+3,hyy+uy*3+1],'#d8e0e8')}
  ctx.globalAlpha=1;if(dying){ctx.restore();return}
  if(OPT.selfBars){const w=34,y=Y-56;ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,y-1,w+2,9);ctx.fillStyle='#d23a2e';ctx.fillRect(X-w/2,y,w*clamp(G.hp/S.maxHp,0,1),3.5);ctx.fillStyle='#3a7af0';ctx.fillRect(X-w/2,y+4,w*clamp(G.en/S.maxEn,0,1),3)}
}
function eye(X,Y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(X,Y,r,0,6.283);ctx.fill();glow(X,Y,r*5,col,.6)}
function drawEnemy(e,X,Y){
  const s=e.sz,t=ET[e.k],k=t.spr||e.k,fl=e.flash>0,c1=fl?'#fff':t.pal[0],c2=fl?'#fff':t.pal[1],bob=Math.sin(e.ph*4)*2,f=e.fx||1,mov=e.aggro&&e.stun<=0;
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';
  if(e.champ){ctx.strokeStyle=e.su?'#d0aa62':'#8494ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,20*s,10*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  if(e.mark>0){ctx.strokeStyle='#ff5d4d';ctx.beginPath();ctx.ellipse(X,Y,14*s,7*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL}
  if(e.ward>0||e.k==='aegis'){ctx.strokeStyle='rgba(159,208,255,.75)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y-22*s,17*s,25*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  if(e.mods.shield){ctx.fillStyle='rgba(140,170,255,.16)';ctx.beginPath();ctx.ellipse(X,Y-24*s,22*s,30*s,0,0,6.283);ctx.fill()}
  if(k==='tick'){shadow(X,Y,8*s);const y=Y-6*s;ctx.lineWidth=1.6;ctx.strokeStyle='#2a2630';for(let i=0;i<4;i++){const a=(i<2?-1:1)*(8+(i%2)*3)*s,w=Math.sin(e.ph*18+i)*2;ctx.beginPath();ctx.moveTo(X,y);ctx.lineTo(X+a,y-4*s+w);ctx.lineTo(X+a*1.3,Y);ctx.stroke()}
    ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(X,y,6*s,5*s,0,0,6.283);ctx.fillStyle=c2;ctx.fill();ctx.stroke();eye(X,y-1,2.2*s,Math.sin(e.ph*14)>0?'#ffb84a':'#ff5d4d')}
  else if(k==='drone'){shadow(X,Y,10*s);const y=Y-28*s+bob;ctx.fillStyle='rgba(200,200,220,.35)';ctx.beginPath();ctx.ellipse(X-12*s,y-7*s,8*s,2,0,0,6.283);ctx.ellipse(X+12*s,y-7*s,8*s,2,0,0,6.283);ctx.fill();
    ctx.strokeStyle='#2a2630';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X-12*s,y-6*s);ctx.lineTo(X-6*s,y);ctx.moveTo(X+12*s,y-6*s);ctx.lineTo(X+6*s,y);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.ellipse(X,y,11*s,7*s,0,0,6.283);ctx.fillStyle=c1;ctx.fill();ctx.stroke();ctx.fillStyle=c2;ctx.fillRect(X-10*s,y-1,20*s,2.5);
    eye(X+f*4*s,y+2,2.4*s,'#ff5d4d');ctx.strokeStyle='#2a2630';ctx.beginPath();ctx.moveTo(X-3,y+6*s);ctx.lineTo(X-5,y+13*s);ctx.moveTo(X+3,y+6*s);ctx.lineTo(X+5,y+13*s);ctx.stroke();ctx.strokeStyle=OL}
  else if(k==='bot'){const b=human(X,Y,{c:c1,c2,skin:c2,s,ph:e.ph*7,mov,f,leg:'#2a2e3a'});const hy=Y-37*s+b;
    box(X-7*s,hy-6*s,14*s,12*s,2,c1);ctx.fillStyle='#ff3b30';ctx.fillRect(X-5*s+f*1.5,hy-1.5*s,10*s,2.6*s);glow(X+f*2,hy,14*s,'#ff3b30',.5);
    poly([X+f*6*s,Y-30*s+b,X+f*15*s,Y-27*s+b,X+f*15*s,Y-10*s+b,X+f*6*s,Y-7*s+b],'#39424f');
    const wr=e.wind>0?-10:0;ctx.strokeStyle='#1c1c22';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(X-f*9*s,Y-20*s+b);ctx.lineTo(X-f*14*s,Y-34*s+b+wr);ctx.stroke();ctx.lineWidth=1.4;ctx.strokeStyle=OL}
  else if(k==='hound'){shadow(X,Y,13*s);const y=Y-12*s,lp=e.lunge?0:Math.sin(e.ph*14)*(mov?3:0);ctx.fillStyle='#2a2e36';for(const[ox,ph]of[[-8,1],[-4,-1],[5,1],[9,-1]])ctx.fillRect(X+f*ox*s-1.5,y,3,12*s+ph*lp*.6);
    box(X-11*s,y-7*s,22*s,10*s,4,c1);box(X+f*8*s-5*s,y-13*s,11*s,9*s,3,c1);poly([X+f*8*s,y-13*s,X+f*5*s,y-19*s,X+f*11*s,y-14*s],c1);
    eye(X+f*11*s,y-9*s,1.8*s,'#ff3b30');ctx.fillStyle=c2;ctx.fillRect(X-9*s,y-4*s,18*s,2);ctx.strokeStyle='#2a2630';ctx.beginPath();ctx.moveTo(X-f*11*s,y-5*s);ctx.lineTo(X-f*17*s,y-14*s);ctx.stroke();ctx.strokeStyle=OL}
  else if(k==='ad'){shadow(X,Y,11*s);const y=Y-30*s+bob;ctx.strokeStyle='#2a2630';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X,Y-3);ctx.lineTo(X,y+8*s);ctx.moveTo(X-8*s,Y);ctx.lineTo(X,Y-8*s);ctx.lineTo(X+8*s,Y);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    poly([X-15*s,y-4*s,X-22*s,y-9*s,X-22*s,y+7*s,X-15*s,y+2*s],c2);poly([X+15*s,y-4*s,X+22*s,y-9*s,X+22*s,y+7*s,X+15*s,y+2*s],c2);
    box(X-15*s,y-12*s,30*s,22*s,3,'#17121e');const on=Math.sin(e.ph*6)>0;ctx.fillStyle=fl?'#fff':on?c1:'#ffe36b';ctx.fillRect(X-12*s,y-9*s,24*s,16*s);
    ctx.fillStyle='#17121e';ctx.font='900 '+9*s+'px Cinzel,serif';ctx.textAlign='center';ctx.fillText(e.k==='censor'?(on?'NO':'■■'):on?'BUY':'NOW',X,y+2.5*s);glow(X,y,34*s,c1,.35);light(X,y,70,c1)}
  else if(k==='hr'){const b=human(X,Y,{c:c1,c2,skin:'#e8eef0',s,ph:e.ph*7,mov,f,leg:'#2e3a3a'});const hy=Y-37*s+b;
    box(X-7*s,hy-7*s,14*s,13*s,3,'#e8eef0');ctx.fillStyle='#17121e';ctx.beginPath();ctx.arc(X-3*s,hy-2*s,1.3*s,0,6.283);ctx.arc(X+3*s,hy-2*s,1.3*s,0,6.283);ctx.fill();
    ctx.strokeStyle='#17121e';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(X,hy,3.6*s,.3,2.84);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    poly([X-1.5*s,Y-30*s+b,X+1.5*s,Y-30*s+b,X+2.5*s,Y-19*s+b,X,Y-16*s+b,X-2.5*s,Y-19*s+b],'#b3261e');box(X+f*8*s,Y-24*s+b,7*s,9*s,1,'#f0ead8')}
  else if(k==='mono'){shadow(X,Y,34);const p=e.hp/e.max;poly([X-26,Y-150,X+26,Y-150,X+30,Y,X-30,Y],fl?'#fff':'#07060b');ctx.fillStyle='#fff';ctx.fillRect(X-18,Y-96,36*p,2.5);ctx.fillStyle=p<.5?'#ff3b30':'#ffffff';ctx.fillRect(X-1.5,Y-128,3,22);glow(X,Y-100,70,p<.5?'#ff3b30':'#ffffff',.3);light(X,Y-80,200,'#ffffff')}
  else{const B=k==='boss',u=B?1.9:1.25*s;shadow(X,Y,21*u);const b=mov?Math.abs(Math.sin(e.ph*5))*1.5:0;
    box(X-12*u,Y-14*u,9*u,14*u,2,'#23202c');box(X+3*u,Y-14*u,9*u,14*u,2,'#23202c');
    box(X-15*u,Y-40*u+b,30*u,28*u,4,c1);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(X+(f>0?-14:3)*u,Y-38*u+b,11*u,24*u);
    box(X-23*u,Y-43*u+b,10*u,13*u,3,c2);box(X+13*u,Y-43*u+b,10*u,13*u,3,c2);
    box(X-22*u,Y-30*u+b,7*u,16*u+(e.wind>0||e.slam?-6:0),2,'#3a3848');box(X+15*u,Y-30*u+b,7*u,16*u,2,'#3a3848');
    box(X-9*u,Y-55*u+b,18*u,15*u,3,B?'#0b0912':'#3d4257');
    if(B){box(X-6*u,Y-40*u+b,12*u,16*u,1,'#e6e2d6');poly([X-2.5*u,Y-40*u+b,X+2.5*u,Y-40*u+b,X+3.5*u,Y-23*u+b,X,Y-18*u+b,X-3.5*u,Y-23*u+b],'#b3261e');
      ctx.fillStyle=e.hp<e.max*.5?'#ff3b30':'#e0bd6e';ctx.font='900 '+8*u+'px Cinzel,serif';ctx.textAlign='center';ctx.fillText(e.slam?'!!':e.k==='boss4'?(e.hp<e.max*.5?':(':':)'):e.k==='boss2'?(e.hp<e.max*.5?'…':'SVP'):e.hp<e.max*.5?'>:(':'VP',X,Y-45*u+b);glow(X,Y-48*u+b,40,'#e0bd6e',.4);light(X,Y-40*u,150,'#e0bd6e')}
    else{ctx.fillStyle='#ff3b30';ctx.fillRect(X-6*u,Y-50*u+b,12*u,3*u);glow(X,Y-48*u+b,18*u,'#ff3b30',.5);eye(X-18*u,Y-40*u+b,1.6*u,'#ffe36b');eye(X+18*u,Y-40*u+b,1.6*u,'#ffe36b')}}
  const top=Y-(k==='mono'?160:k==='boss'?112:k==='mech'?76*s:k==='tick'?20:k==='hound'?36*s:56*s);
  if(e.stun>0){ctx.fillStyle='#59e0e6';ctx.font='700 10px Cinzel,serif';ctx.textAlign='center';ctx.fillText('STUNNED',X,top-4)}
  if(OPT.enemyBars&&e.hp<e.max&&k!=='boss'&&k!=='mono'){const w=30*s;ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,top-1,w+2,5);ctx.fillStyle=e.su?'#d0aa62':e.champ?'#8494ff':'#d23a2e';ctx.fillRect(X-w/2,top,w*Math.max(0,e.hp/e.max),3)}
  if(e.champ){ctx.font='700 11px Cinzel,serif';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText(e.name,X+1,top-8);ctx.fillStyle=e.su?'#d0aa62':'#8494ff';ctx.fillText(e.name,X,top-9);
    ctx.font='400 9.5px Spectral,serif';ctx.fillStyle='#b8b0a0';ctx.fillText(Object.keys(e.mods).map(m=>MODS[m]).join(' · '),X,top-21)}
}
function wrapText(t,max){const ws=t.split(' '),out=[];let l='';for(const w of ws){const n=l?l+' '+w:w;if(ctx.measureText(n).width>max&&l){out.push(l);l=w}else l=n}out.push(l);return out}
function bubble(X,Y,t){ctx.font='400 12.5px Spectral,serif';const ls=wrapText(t,150),w=Math.max(...ls.map(l=>ctx.measureText(l).width))+14,h=ls.length*15+10;
  ctx.fillStyle='#e6e2d6';ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(X-w/2,Y-h,w,h,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(X-5,Y-1);ctx.lineTo(X,Y+6);ctx.lineTo(X+5,Y-1);ctx.fill();
  ctx.fillStyle='#17121e';ctx.textAlign='center';ls.forEach((l,i)=>ctx.fillText(l,X,Y-h+17+i*15))}
function label(X,Y,t,col,fnt){ctx.font=fnt||'700 10.5px Cinzel,serif';ctx.textAlign='center';const w=ctx.measureText(t).width+10;ctx.fillStyle='rgba(5,4,9,.78)';ctx.fillRect(X-w/2,Y-12,w,16);ctx.fillStyle=col;ctx.fillText(t,X,Y)}
function portal(X,Y,col){shadow(X,Y,17);const g=ctx.createRadialGradient(X,Y-30,2,X,Y-30,34);g.addColorStop(0,'#fff');g.addColorStop(.35,col);g.addColorStop(1,'rgba(0,0,0,.1)');
  ctx.save();ctx.translate(X,Y-30);ctx.scale(.62,1);ctx.beginPath();ctx.arc(0,0,31,0,6.283);ctx.fillStyle=g;ctx.globalAlpha=.85;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=3;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,12+i*8,tNow*(2+i)+i,tNow*(2+i)+i+2.2);ctx.stroke()}ctx.restore();glow(X,Y-30,70,col,.5);light(X,Y-30,150,col)}
const QCOL=['#e6e2d6','#8494ff','#ffe36b','#3fe06a','#d0aa62'];
function quest(id){if(QRW.some(r=>r[1]===id&&G.q[r[0]]===2))return true;if(id==='gramps'&&G.q.q10===3&&!G.q.q11)return true;if(id==='gramps'&&((G.q.q15===3&&!G.q.q16)||(G.q.q20===3&&!G.q.q21)))return true;if(id==='nonce'&&Object.keys(G.st.wf).length>=12&&!G.wallet)return true;if(sqMark(id))return true;if(id==='gramps'&&(G.q.q6===2||(G.q.q5===3&&!G.q.q6)))return true;if(id==='marrow')return G.q.q8===2;if(id==='nonce')return G.q.q9===2;if(id==='null'&&G.q.q7===2)return true;if(id==='gramps')return G.q.q1===0||G.q.q1===2||G.q.q3===2;if(id==='brenda')return G.q.q2===2;if(id==='null')return G.q.q4===2;return false}
function drawNpc(n,X,Y){
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(n.term){shadow(X,Y,16);box(X-18,Y-16,36,16,2,'#3a4250');box(X-9,Y-36,18,16,2,'#17131c');ctx.fillStyle=Math.sin(tNow*3+n.x)>0?'#59e0e6':'#7be495';ctx.fillRect(X-7,Y-34,14,10);glow(X,Y-29,30,'#59e0e6',.4);light(X,Y-28,90,'#59e0e6');label(X,Y-46,n.name.toUpperCase(),'#59e0e6');return}
  if(n.id==='gate'){box(X-24,Y-6,48,8,2,'#3a3250');portal(X,Y-4,'#59e0e6');label(X,Y-76,'TRANSIT GATE','#59e0e6');return}
  if(n.id==='vr'){shadow(X,Y,18);poly([X-18,Y-6,X,Y+3,X+18,Y-6,X,Y-15],'#2a2040');box(X-10,Y-34,20,26,6,'#3a2a5a');box(X-12,Y-44,24,12,5,'#17131c');ctx.fillStyle=Math.sin(tNow*4)>0?'#ff5ad0':'#59e0e6';ctx.fillRect(X-9,Y-41,18,5);glow(X,Y-38,40,'#ff5ad0',.45);light(X,Y-34,120,'#ff5ad0');label(X,Y-54,'VR SIMULATOR','#ff8ae0');return}
  if(n.id==='board'){shadow(X,Y,16);box(X-16,Y-34,3,34,1,'#4a3a2a');box(X+13,Y-34,3,34,1,'#4a3a2a');box(X-19,Y-48,38,24,1,'#6a5030');for(const[a,b,c]of[[-14,-45,'#e6e2d6'],[-2,-44,'#ffe9a8'],[8,-46,'#e6e2d6'],[-9,-35,'#ffe9a8'],[4,-34,'#e6e2d6']]){ctx.fillStyle=c;ctx.fillRect(X+a,Y+b,8,9)}label(X,Y-56,'BOUNTIES','#f7931a');if((G.bounties||[]).some(b=>b.c>=b.n)){ctx.font='900 22px Cinzel,serif';ctx.fillStyle='#ffe36b';ctx.textAlign='center';ctx.fillText('!',X,Y-72)}return}
  if(n.id==='stash'){shadow(X,Y,15);poly([X-15,Y-18,X,Y-11,X,Y+2,X-15,Y-5],'#4a5060');poly([X,Y-11,X+15,Y-18,X+15,Y-5,X,Y+2],'#353a48');poly([X-15,Y-18,X,Y-25,X+15,Y-18,X,Y-11],'#5c6478');box(X-3,Y-10,6,6,1,'#e0bd6e');label(X,Y-34,'YOUR LOCKBOX','#d0aa62');return}
  if(n.id==='ubi'){shadow(X,Y,14);box(X-12,Y-46,24,46,3,'#3d3654');ctx.fillStyle=Math.sin(tNow*3)>0?'#7be495':'#59e0e6';ctx.fillRect(X-9,Y-41,18,14);ctx.fillStyle='#17121e';ctx.font='700 9px Cinzel,serif';ctx.textAlign='center';ctx.fillText('₡500',X,Y-31);box(X-6,Y-20,12,3,1,'#17121e');light(X,Y-34,70,'#7be495');label(X,Y-54,'THE STIPEND','#7be495');return}
  if(n.id==='brenda'){box(X-28,Y-18,56,20,2,'#5a2848');for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#e6e2d6':'#d9659b';ctx.fillRect(X-30+i*15,Y-66,15,9)}ctx.strokeRect(X-30,Y-66,60,9);ctx.fillStyle='#4a4458';ctx.fillRect(X-29,Y-57,2.5,40);ctx.fillRect(X+26.5,Y-57,2.5,40)}
  if(n.id==='tam'){box(X-20,Y-6,40,7,2,'#4a3a2a');for(let i=0;i<4;i++){ctx.fillStyle='#3a8a4a';ctx.fillRect(X-17+i*10,Y-13,2,8);ctx.fillStyle='#c22d35';ctx.beginPath();ctx.arc(X-16+i*10,Y-14,2.5,0,6.283);ctx.fill()}}
  if(n.id==='wren'){box(X-22,Y-10,14,12,1,'#7a6040');box(X+8,Y-12,15,14,1,'#8a6a48');ctx.fillStyle='#ffe36b';ctx.font='900 10px Cinzel,serif';ctx.textAlign='center';ctx.fillText('?',X-15,Y);ctx.fillText('?',X+15.5,Y-1)}
  const y0=n.id==='brenda'?Y-8:Y;
  const b=human(X,y0,{c:n.col,c2:'rgba(0,0,0,.35)',ph:(n.ph||0)*9,mov:n.mov,f:n.fx||1,skin:n.id==='gramps'?'#c9a184':'#d9b08c'});
  const hy=y0-37+b;
  if(n.id==='res'){if(!(G.adopt>=100||(G.adopt>=60&&((n.ph*10|0)%2))||(G.adopt>=40&&((n.ph*10|0)%4===0)))){ctx.fillStyle='#0b0912';ctx.fillRect(X-7,hy-3,14,4.5);ctx.fillStyle='#59e0e6';ctx.fillRect(X-6,hy-2,12,1.2)}box(X+(n.fx||1)*9,y0-18,6,8,1,'#e6e2d6')}
  if(n.id==='gramps'){ctx.fillStyle='#e6e2d6';ctx.beginPath();ctx.arc(X,hy+3,5.5,0,3.14);ctx.fill();ctx.strokeStyle='#6a5a40';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X+11,y0-26);ctx.lineTo(X+12,y0);ctx.stroke()}
  if(n.id==='null'){ctx.beginPath();ctx.arc(X,hy,8,2.5,.64);ctx.lineTo(X+8,hy+8);ctx.lineTo(X-8,hy+8);ctx.closePath();ctx.fillStyle='#f0ecff';ctx.fill();ctx.stroke()}
  if(n.id==='marrow'){box(X-9,y0-20,9,11,1,'#6a4a30');ctx.fillStyle='#e6e2d6';ctx.fillRect(X-8,y0-19,7,1.5);ctx.strokeStyle='#17121e';ctx.beginPath();ctx.arc(X-3,hy,2.4,0,6.283);ctx.arc(X+3,hy,2.4,0,6.283);ctx.stroke()}
  if(n.id==='nonce'){box(X-8,hy-7,16,4,2,'#f7931a');ctx.beginPath();ctx.arc(X+12,y0-22,5,0,6.283);ctx.fillStyle='#f7931a';ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 7px Cinzel,serif';ctx.textAlign='center';ctx.fillText('B',X+12,y0-19.5)}
  if(n.id==='kestrel'){box(X-9,hy-6,18,3,1,'#2a2630');ctx.fillStyle='#0b0912';ctx.fillRect(X-6,hy-2,12,3)}
  if(n.id==='float'){box(X-8,hy-11,16,8,1,'#17131c');box(X-11,hy-4,22,2.5,1,'#17131c')}
  if(n.id==='wren'){box(X-8,hy-8,16,5,2,'#3a4a3a');box(X-11,hy-4,22,2.5,1,'#3a4a3a')}
  if(n.id!=='res'){label(X,y0-(n.id==='brenda'?66:52),n.name.toUpperCase(),'#d0aa62');if(quest(n.id)){ctx.font='900 22px Cinzel,serif';ctx.fillStyle='#ffe36b';ctx.textAlign='center';ctx.fillText('!',X,y0-(n.id==='brenda'?84:70)+Math.sin(tNow*4)*2)}}
  if(n.st>0)bubble(X,y0-54,n.say)}
function drawObj(o,X,Y){
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';const s=TX.s,st=s.like||W.z.style;
  if(o.k==='lamp'){shadow(X,Y,7);box(X-2,Y-52,4,52,1,'#2a2630');box(X-7,Y-58,14,7,2,'#3a3644');ctx.fillStyle=s.glow;ctx.fillRect(X-5,Y-52,10,3);const fl=1+.05*Math.sin(tNow*11+o.x*7)+.03*Math.sin(tNow*23+o.y*3);glow(X,Y-48,46*fl,s.glow,.5);light(X,Y-30,175*fl,s.glow)}
  else if(o.k==='crate'){if(o.used){ctx.fillStyle='rgba(60,45,25,.6)';ctx.fillRect(X-10,Y-3,8,3);ctx.fillRect(X+2,Y-1,9,3);return}shadow(X,Y,14);poly([X-13,Y-22,X,Y-16,X,Y+2,X-13,Y-5],'#8a6a40');poly([X,Y-16,X+13,Y-22,X+13,Y-5,X,Y+2],'#6a5030');poly([X-13,Y-22,X,Y-28,X+13,Y-22,X,Y-16],'#a8895c');ctx.strokeStyle='#4a3620';ctx.beginPath();ctx.moveTo(X-13,Y-14);ctx.lineTo(X,Y-7);ctx.lineTo(X+13,Y-14);ctx.stroke()}
  else if(o.k==='chest'){shadow(X,Y,15);poly([X-14,Y-16,X,Y-10,X,Y+2,X-14,Y-4],'#4a5060');poly([X,Y-10,X+14,Y-16,X+14,Y-4,X,Y+2],'#353a48');poly([X-14,Y-16+(o.used?-8:0),X,Y-22+(o.used?-10:0),X+14,Y-16+(o.used?-8:0),X,Y-10],'#5c6478');if(!o.used){box(X-3,Y-9,6,6,1,'#e0bd6e');glow(X,Y-10,28,'#e0bd6e',.45+.2*Math.sin(tNow*3));light(X,Y-10,60,'#e0bd6e')}}
  else if(o.k==='pow'){if(W.pow&&W.pow.o===o){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(247,147,26,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,9*45,9*22.5,0,0,6.283);ctx.stroke();ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4}shadow(X,Y,14);poly([X-12,Y-6,X,Y,X+12,Y-6,X,Y-12],'#3a2a1a');poly([X-7,Y-8,X+7,Y-8,X+4,Y-46,X-4,Y-46],o.used?'#3a342a':'#5a3a12');const pw=W.pow&&W.pow.o===o?1-W.pow.t/60:o.used?1:0;ctx.fillStyle='#f7931a';ctx.fillRect(X-3,Y-10-34*pw,6,34*pw);if(!o.used){glow(X,Y-28,46,'#f7931a',.35+.15*Math.sin(tNow*3));light(X,Y-28,140,'#f7931a');label(X,Y-54,pw?Math.ceil(W.pow.t)+'s':'PROOF OF WORK','#f7931a','700 8.5px Cinzel,serif')}}
  else if(o.k==='shrine'){shadow(X,Y,13);poly([X-11,Y-6,X,Y-1,X+11,Y-6,X,Y-11],'#5a566a');box(X-5,Y-24,10,18,1,'#4a4658');const c={might:'#ff5d4d',guard:'#8494ff',xp:'#ffe36b',luck:'#3fe06a',fill:'#59e0e6',gold:'#e0bd6e'}[o.sk],y=Y-38+Math.sin(tNow*2+o.x)*3;
    if(!o.used){poly([X,y-10,X+7,y,X,y+10,X-7,y],c);glow(X,y,36,c,.6);light(X,y,120,c)}else poly([X-5,Y-26,X+4,Y-27,X+2,Y-23],'#3a3644')}
  else if(o.k==='memo'){const y=Y-12+Math.sin(tNow*3+o.x)*2;shadow(X,Y,6);poly([X-6,y-8,X+6,y-9,X+7,y+6,X-5,y+7],'#e6e2d6');ctx.fillStyle='#6a6458';for(let i=0;i<4;i++)ctx.fillRect(X-4,y-5+i*3,8,1);glow(X,y,26,'#ffe36b',.5);light(X,y,50,'#ffe36b')}
  else if(o.k==='qobj'){const L=o.look,u=o.used;
    if(L==='person'){human(X,Y,{c:'#8a6a40',c2:'rgba(0,0,0,.3)',skin:'#c9a184',ph:tNow*3});box(X+8,Y-22,10,4,1,'#4a4658')}
    else if(L==='lift'){shadow(X,Y,15);box(X-14,Y-44,28,44,2,'#4a4658');ctx.fillStyle='#9fffe0';ctx.fillRect(X-10,Y-40,20,30);ctx.fillStyle='#17131c';ctx.beginPath();ctx.moveTo(X,Y-20);ctx.lineTo(X-6,Y-30);ctx.lineTo(X+6,Y-30);ctx.fill()}
    else if(L==='box'){shadow(X,Y,10);if(!u){box(X-9,Y-9,18,9,1,'#a8895c');box(X-10,Y-12,20,4,1,'#c0a070')}}
    else if(L==='drum'){shadow(X,Y,10);if(!u){box(X-8,Y-20,16,20,3,'#3a6a8a');ctx.fillStyle='#e0bd6e';ctx.fillRect(X-8,Y-14,16,2);ctx.fillRect(X-8,Y-7,16,2)}}
    else if(L==='cab'){shadow(X,Y,13);box(X-12,Y-36,24,36,2,'#d8d8e0');ctx.fillStyle='#b3261e';ctx.fillRect(X-2,Y-28,4,12);ctx.fillRect(X-6,Y-24,12,4)}
    else if(L==='kiosk'){shadow(X,Y,13);box(X-12,Y-40,24,40,2,'#3a3250');ctx.fillStyle=u?'#e6e2d6':'#2a2433';ctx.fillRect(X-9,Y-36,18,12);box(X-8,Y-18,16,3,1,'#17131c');if(u)for(let i=0;i<4;i++){ctx.fillStyle='#e6e2d6';ctx.fillRect(X-6+i*3,Y-18-((tNow*30+i*9)%26),5,6)}}
    else if(L==='node'){shadow(X,Y,13);box(X-11,Y-22,22,22,2,'#26262e');ctx.strokeStyle='#4a4658';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+6,Y-22);ctx.lineTo(X+10,Y-40);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;const on=u&&(W.hold||Math.sin(tNow*3)>0);ctx.fillStyle=on?'#f7931a':'#3a2a1a';ctx.fillRect(X-7,Y-17,5,4);ctx.fillRect(X+1,Y-17,5,4);if(u){glow(X,Y-14,40,'#f7931a',.5);light(X,Y-14,140,'#f7931a')}}
    if(!u){ctx.font='900 20px Cinzel,serif';ctx.fillStyle='#59e0e6';ctx.textAlign='center';ctx.fillText('!',X,Y-(L==='person'?56:L==='box'?22:48)+Math.sin(tNow*4)*2);light(X,Y-16,90,'#59e0e6')}}
  else if(o.k==='dnode'){const u=o.used||G.nodes[W.zi];shadow(X,Y,13);box(X-11,Y-22,22,22,2,'#26262e');ctx.strokeStyle='#4a4658';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+6,Y-22);ctx.lineTo(X+10,Y-40);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.fillStyle=u?'#f7931a':'#3a2a1a';ctx.fillRect(X-7,Y-17,5,4);ctx.fillRect(X+1,Y-17,5,4);if(u){glow(X,Y-14,40,'#f7931a',.5);light(X,Y-14,150,'#f7931a')}else label(X,Y-48,'DEAD NODE','#8a5a1a','700 8.5px Cinzel,serif')}
  else if(o.k==='leg'){shadow(X,Y,9);ctx.save();ctx.translate(X,Y-6);ctx.rotate(.5+.08*Math.sin(tNow*9));box(-3,-16,6,14,2,'#6a6a78');box(-4,-3,8,6,2,'#3a3a44');box(-3,3,10,5,2,'#6a6a78');ctx.restore();glow(X,Y-8,26,'#ffe36b',.35);label(X,Y-34,'SERVO LEG','#ffe36b','700 8.5px Cinzel,serif')}
  else if(o.k==='stray'){human(X,Y,{c:'#8a8496',c2:'rgba(0,0,0,.3)',s:.92,ph:tNow*20,mov:false});ctx.fillStyle='#59e0e6';ctx.fillRect(X+8,Y-4,9,2.5);light(X,Y-20,70,'#ffcf7a')}
  else if(o.k==='cage'){shadow(X,Y,16);if(!o.used){human(X,Y-2,{c:'#8f7cc0',c2:'rgba(0,0,0,.3)',s:.85})}poly([X-15,Y-6,X,Y+1,X+15,Y-6,X,Y-13],'#2a2630');ctx.strokeStyle='#8a8898';ctx.lineWidth=2;for(const[dx,dy]of[[-15,-6],[-7,-2.5],[0,1],[7,-2.5],[15,-6],[-7,-9.5],[7,-9.5],[0,-13]]){if(o.used&&dx>=0&&dy>-9)continue;ctx.beginPath();ctx.moveTo(X+dx,Y+dy);ctx.lineTo(X+dx,Y+dy-44);ctx.stroke()}ctx.strokeStyle=OL;ctx.lineWidth=1.4;poly([X-15,Y-50,X,Y-43,X+15,Y-50,X,Y-57],'#3a3644');if(!o.used)label(X,Y-64,'MARROW','#d0aa62')}
  else if(o.k==='holo'){shadow(X,Y,18);poly([X-18,Y-8,X,Y,X+18,Y-8,X,Y-16],'#3a3250');const y=Y-52+Math.sin(tNow*1.5)*3;ctx.globalAlpha=.75;ctx.strokeStyle='#59e0e6';ctx.lineWidth=3;ctx.beginPath();ctx.arc(X,y,20,0,6.283);ctx.stroke();ctx.beginPath();ctx.arc(X,y+2,11,.3,2.84);ctx.stroke();ctx.fillStyle='#59e0e6';ctx.fillRect(X-8,y-8,3.5,5);ctx.fillRect(X+4.5,y-8,3.5,5);ctx.globalAlpha=1;glow(X,y,60,'#59e0e6',.4);light(X,y,170,'#59e0e6');label(X,Y-86,'UNITY SEES YOU SMILE','#59e0e6','700 8.5px Cinzel,serif')}
  else if(o.k==='board'){shadow(X,Y,10);box(X-2,Y-40,4,40,1,'#2a2630');const t=[['CONSUME','#ff8ac4'],['OBEY THE FEED','#59e0e6'],['DEBT IS LOVE','#ffe36b']][o.v];box(X-34,Y-74,68,34,2,'#120e17');ctx.fillStyle=t[1];ctx.globalAlpha=.8+.2*Math.sin(tNow*5+o.v);ctx.font='900 10px Cinzel,serif';ctx.textAlign='center';ctx.fillText(t[0],X,Y-53);ctx.globalAlpha=1;glow(X,Y-57,50,t[1],.3);light(X,Y-57,110,t[1])}
  else if(o.k==='crates'||(o.k==='prop'&&o.v===0)){shadow(X,Y,16);const c=st==='farm'?['#2f5a66','#22424c','#3c7480']:st==='hq'?['#b89a58','#8a7240','#d8ba74']:['#a8895c','#7d6540','#c0a070'];
    for(const[dx,dy,z]of[[-7,-2,0],[7,-3,0],[0,-5,13]]){const x=X+dx,y=Y+dy-z;poly([x-8,y-12,x,y-8,x,y+2,x-8,y-2],c[0]);poly([x,y-8,x+8,y-12,x+8,y-2,x,y+2],c[1]);poly([x-8,y-12,x,y-16,x+8,y-12,x,y-8],c[2])}}
  else if(o.k==='prop'&&o.v===1){shadow(X,Y,12);
    if(st==='farm'){box(X-10,Y-50,20,50,2,'#16212f');for(let i=0;i<7;i++){ctx.fillStyle=(i+Math.floor(tNow*3+o.x))%3?'#59e0e6':'#7be495';ctx.fillRect(X-7,Y-46+i*6.5,3,2);ctx.fillStyle='#2a3a4a';ctx.fillRect(X-2,Y-46+i*6.5,9,2)}light(X,Y-25,60,'#59e0e6')}
    else if(st==='hq'){box(X-8,Y-64,16,64,2,'#8a8298');box(X-11,Y-68,22,6,1,'#e0bd6e');box(X-11,Y-5,22,6,1,'#e0bd6e')}
    else if(st==='trib'){box(X-10,Y-40,20,40,1,'#5a5a52');for(let i=0;i<3;i++){box(X-8,Y-37+i*12,16,10,1,'#48483f');ctx.fillStyle='#c7a43a';ctx.fillRect(X-3,Y-33+i*12,6,2)}}
    else if(st==='mall'){box(X-12,Y-30,24,30,2,'#3a3250');ctx.fillStyle='#ff8ac4';ctx.fillRect(X-9,Y-27,18,10);glow(X,Y-22,26,'#ff8ac4',.4);light(X,Y-22,70,'#ff8ac4')}
    else{box(X-2,Y-26,4,26,1,'#3a3644');box(X-8,Y-36,16,11,3,'#8a3a32');ctx.fillStyle='#e6e2d6';ctx.fillRect(X+8,Y-34,2,7)}}
  else if(o.k==='prop'){shadow(X,Y,12);
    if(st==='farm'||st==='trib'){ctx.strokeStyle='#4a4658';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X,Y-58);ctx.moveTo(X-9,Y-40);ctx.lineTo(X+9,Y-40);ctx.moveTo(X-6,Y-50);ctx.lineTo(X+6,Y-50);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;eye(X,Y-60,2,'#ff3b30')}
    else if(st==='hq'){box(X-8,Y-14,16,14,1,'#8a8298');ctx.beginPath();ctx.arc(X,Y-26,8,0,6.283);ctx.fillStyle='#c8c0d8';ctx.fill();ctx.stroke();box(X-6,Y-19,12,6,2,'#c8c0d8')}
    else{box(X-2.5,Y-30,5,30,1,'#4a3a2a');ctx.strokeStyle='#4a3a2a';ctx.lineWidth=2.5;for(const[a,b]of[[-12,-44],[10,-48],[-6,-54],[14,-36],[2,-58]]){ctx.beginPath();ctx.moveTo(X,Y-28);ctx.lineTo(X+a,Y+b);ctx.stroke()}ctx.strokeStyle=OL;ctx.lineWidth=1.4;if(st==='mall'){for(const[a,b]of[[-12,-44],[10,-48],[2,-58]]){ctx.beginPath();ctx.arc(X+a,Y+b,5,0,6.283);ctx.fillStyle='#3a8a5a';ctx.fill();ctx.stroke()}}}}
}

/* ================= frame ================= */
/* what lies beyond the edge of a district: weather for the Cloud, a red hum for the Board, a far city for the ground */
const BGK={chain:4,mempool:4,blocks:4,room:4,reactor:2,shaft:2,garden:2,lake:2,walk:2,mezz:2,landing:2,vest:3,minutes:3,chairs:3,rack:3,wait:3,still:4};
function backdrop(){const k=BGK[W.z.style]||1,px=(P.x-P.y)*3,py=(P.x+P.y)*1.5,t=tNow;
  if(k===2){const g=ctx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'#1c1836');g.addColorStop(1,'#3a3460');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);ctx.fillStyle='rgba(220,215,255,.10)';for(let i=0;i<9;i++){const x=((i*173+t*(6+i%3*3)-px)%(VW+300)+VW+300)%(VW+300)-150,y=((i*97-py)%(VH+120)+VH+120)%(VH+120)-60,w=90+i%4*40;ctx.beginPath();ctx.ellipse(x,y,w,w*.28,0,0,6.283);ctx.ellipse(x+w*.5,y+8,w*.6,w*.2,0,0,6.283);ctx.fill()}}
  else if(k===3){const g=ctx.createRadialGradient(VW/2,VH/2,40,VW/2,VH/2,VH*.8);g.addColorStop(0,'#1c0a0e');g.addColorStop(1,'#050308');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);ctx.fillStyle='rgba(194,45,53,.07)';for(let i=0;i<14;i++){const x=((i*71-px*.6)%VW+VW)%VW;ctx.fillRect(x,0,2,VH);ctx.fillRect(x-1,((t*40+i*90)%VH),4,26)}}
  else if(k===4){ctx.fillStyle='#04060d';ctx.fillRect(0,0,VW,VH);for(let i=0;i<60;i++){const x=((i*89-px*.3)%VW+VW)%VW,y=((i*53-py*.3)%VH+VH)%VH;ctx.fillStyle='rgba(190,215,255,'+(.15+.25*Math.abs(Math.sin(t*.8+i)))+')';ctx.fillRect(x,y,1.5,1.5)}}
  else{const g=ctx.createLinearGradient(0,0,0,VH);g.addColorStop(0,'#0a0812');g.addColorStop(1,'#140f1c');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);ctx.fillStyle='rgba(120,100,160,.07)';for(let i=0;i<16;i++){const x=((i*61-px*.5)%(VW+80)+VW+80)%(VW+80)-40,h=40+((i*37)%90),y=VH*.5+((i%3)*VH*.16)-py*.2%40;ctx.fillRect(x,y-h,22+i%3*10,h+VH)}}}
function render(){
  ctx.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);ctx.fillStyle='#050409';ctx.fillRect(0,0,VW,VH);if(W&&P)backdrop();
  if(!W||!P)return;LIGHTS=[];
  cx=(P.x-P.y)*32+(shake?rnd(-shake,shake):0);cy=(P.x+P.y)*16+(shake?rnd(-shake,shake):0);
  const z=W.z,N=W.N,R=Math.ceil(VW/128+VH/64)+3,pd=P.x+P.y;
  const x0=Math.max(0,Math.floor(P.x-R)),x1=Math.min(N-1,Math.ceil(P.x+R)),y0=Math.max(0,Math.floor(P.y-R)),y1=Math.min(N-1,Math.ceil(P.y+R));
  const dl=[];const vis=o=>W.seen[(o.y|0)*N+(o.x|0)];
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const X=SX(x+.5,y+.5),Y=SY(x+.5,y+.5);if(X<-40||X>VW+40||Y<-70||Y>VH+70)continue;const t=W.map[y*N+x];if(!W.seen[y*N+x])continue;
    if(t!==0){ctx.drawImage(TX.floor[(x*7+y*13+((x*y)%3))%5],X-33,Y-17);const sn=W.seen;if(!z.town&&(!sn[y*N+x+1]||!sn[y*N+x-1]||!sn[(y+1)*N+x]||!sn[(y-1)*N+x])){ctx.fillStyle='rgba(5,4,9,.6)';ctx.beginPath();ctx.moveTo(X-33,Y);ctx.lineTo(X,Y-17);ctx.lineTo(X+33,Y);ctx.lineTo(X,Y+17);ctx.fill()}}
    else{const h=W.wh[y*N+x];if(h)dl.push({d:x+y+1,k:0,X,Y,h,near:h>1&&x+y+1>pd&&Math.abs(x+.5-P.x)<3.2&&Math.abs(y+.5-P.y)<3.2})}}
  for(const d of W.decals){const X=SX(d.x,d.y),Y=SY(d.x,d.y);ctx.fillStyle='rgba(5,4,9,.42)';ctx.beginPath();ctx.ellipse(X,Y,d.r*30,d.r*15,d.a,0,6.283);ctx.fill();ctx.fillStyle='rgba(60,50,40,.5)';ctx.fillRect(X-4+d.a*3,Y-2,5,2);ctx.fillRect(X+3-d.a*2,Y+2,4,2)}
  for(const a of W.allies)if(a.k==='trops'||a.k==='storm'){const X=SX(a.x,a.y),Y=SY(a.x,a.y),r=a.k==='trops'?2.6:3.5;ctx.fillStyle=a.k==='trops'?'rgba(200,210,220,.14)':'rgba(40,30,80,.35)';ctx.beginPath();ctx.ellipse(X,Y,r*45,r*22.5,0,0,6.283);ctx.fill();
    if(a.k==='trops'){ctx.fillStyle='#c8d0d8';for(let i=0;i<22;i++){const an=i*2.4,rr=(i*37%100)/100*r;ctx.fillRect(X+Math.cos(an)*rr*45,Y+Math.sin(an)*rr*22,2.5,2.5)}}}
  for(const e of W.ents)if(e.wind>0&&(e.champ||e.su||isBoss(e.k))&&vis(e)){const X=SX(e.x,e.y),Y=SY(e.x,e.y),r=ET[e.k].range+e.r+.5;ctx.fillStyle='rgba(255,70,60,.22)';ctx.beginPath();ctx.ellipse(X,Y,r*45,r*22.5,0,0,6.283);ctx.fill();ctx.strokeStyle='#ff5d4d';ctx.lineWidth=1.5;ctx.stroke()}
  for(const f of W.fx){const X=SX(f.x,f.y),Y=SY(f.x,f.y),u=f.t/f.life;
    if(f.k==='ring'){ctx.fillStyle=f.col;ctx.globalAlpha=(1-u)*.16;ctx.beginPath();ctx.ellipse(X,Y,f.r*45*u,f.r*22.5*u,0,0,6.283);ctx.fill();ctx.strokeStyle=f.col;ctx.globalAlpha=1-u;ctx.lineWidth=5*(1-u)+1.5;ctx.stroke();ctx.globalAlpha=1;light(X,Y,f.r*60,f.col)}
    if(f.k==='warn'){ctx.fillStyle='rgba(255,70,60,'+(.15+.3*u)+')';ctx.beginPath();ctx.ellipse(X,Y,f.r*45,f.r*22.5,0,0,6.283);ctx.fill();ctx.strokeStyle='#ff5d4d';ctx.lineWidth=2;ctx.stroke()}}
  for(const p of W.portals)if(vis(p))dl.push({d:p.x+p.y,k:4,x:p.x,y:p.y,arch:p.kind!=='home',col:p.kind==='next'?'#ff7a3c':p.kind==='home'?'#4a8cff':'#7be495'});
  if(z.town&&G.portal)dl.push({d:24,k:4,x:12.5,y:11.5,col:'#4a8cff'});
  for(const e of W.ents)if(vis(e))dl.push({d:e.x+e.y,k:1,o:e});
  for(const n of W.npcs)dl.push({d:n.x+n.y,k:2,o:n});
  for(const o of W.objs)if(vis(o))dl.push({d:o.x+o.y,k:6,o});
  for(const a of W.allies)if(a.k!=='trops'&&a.k!=='storm'&&a.k!=='blast'&&a.k!=='raid')dl.push({d:a.x+a.y,k:5,o:a});
  if(W.merc&&W.merc.hp>0)dl.push({d:W.merc.x+W.merc.y,k:8,o:W.merc});if(W.tag&&W.tag.hp>0)dl.push({d:W.tag.x+W.tag.y,k:8.5,o:W.tag});if(W.esc)dl.push({d:W.esc.x+W.esc.y,k:9,o:W.esc});
  for(const d of W.drops)dl.push({d:d.x+d.y-.3,k:7,o:d});
  dl.push({d:pd,k:3});
  dl.sort((a,b)=>a.d-b.d);
  for(const q of dl){
    if(q.k===0){const tex=q.h===1?TX.low:TX.wall[q.h-2];if(q.near)ctx.globalAlpha=.32;ctx.drawImage(tex,q.X-33,q.Y-17-(tex.height-34));ctx.globalAlpha=1}
    else if(q.k===1){const e=q.o,X=SX(e.x,e.y),Y=SY(e.x,e.y);drawEnemy(e,X,Y);if(e.k==='bull'&&e.say&&e.aggro&&((tNow*.5+e.ph)%6)<2.2)bubble(X,Y-58,['Moo.','Number go up.','Up only.','This time is different.','Have fun staying poor.'][(e.ph*10|0)%5])}
    else if(q.k===2)drawNpc(q.o,SX(q.o.x,q.o.y),SY(q.o.x,q.o.y));
    else if(q.k===3){const X=SX(P.x,P.y),Y=SY(P.x,P.y);drawPlayer(X,Y);light(X,Y-20,z.town?400:310,null);light(X,Y-20,1150,null,TX.fill)}
    else if(q.k===8){const m=q.o,X=SX(m.x,m.y),Y=SY(m.x,m.y),t=MERCS[G.merc.k],fl=m.flash>0;ctx.strokeStyle='#7be495';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y,14,7,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
      if(G.merc.k==='hound'){shadow(X,Y,12);const y=Y-11,f=m.fx,lp=m.mov?Math.sin(m.ph*16)*3:0;ctx.fillStyle='#3a2e22';for(const[ox,ph]of[[-8,1],[-4,-1],[5,1],[9,-1]])ctx.fillRect(X+f*ox-1.5,y,3,11+ph*lp*.6);box(X-11,y-7,22,10,4,fl?'#fff':t.col);box(X+f*8-5,y-13,11,9,3,fl?'#fff':t.col);poly([X+f*8,y-13,X+f*5,y-19,X+f*11,y-14],t.col);ctx.fillStyle='#0b0912';ctx.fillRect(X+f*11-1,y-10,2,2)}
      else{const b=human(X,Y,{c:fl?'#fff':t.col,c2:'rgba(0,0,0,.35)',ph:m.ph*9,mov:m.mov,f:m.fx,skin:G.merc.k==='guard'?'#6c7c94':'#d9b08c',leg:'#2a2433'});
        if(G.merc.k==='guard'){ctx.fillStyle='#59e0e6';ctx.fillRect(X-5+m.fx*1.5,Y-38.5+b,10,2.4);poly([X+m.fx*6,Y-30+b,X+m.fx*15,Y-27+b,X+m.fx*15,Y-10+b,X+m.fx*6,Y-7+b],'#39424f')}
        else if(G.merc.k==='node'){ctx.strokeStyle='#2a2630';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X-m.fx*4,Y-22+b);ctx.lineTo(X+m.fx*18,Y-27+b-(m.swing>0?3:0));ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;box(X-8,Y-46+b,16,4,2,'#f7931a')}
        else{box(X+m.fx*8,Y-24+b,8,6,1,'#17131c');ctx.fillStyle='#7be495';ctx.fillRect(X+m.fx*8+1.5,Y-23+b,5,3.5)}}
      const w=28,yy=Y-(G.merc.k==='hound'?36:56);ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,yy-1,w+2,5);ctx.fillStyle='#7be495';ctx.fillRect(X-w/2,yy,w*clamp(m.hp/m.max,0,1),3);label(X,yy-6,G.merc.name,'#7be495','700 9.5px Cinzel,serif')}
    else if(q.k===8.5){const m=q.o,X=SX(m.x,m.y),Y=SY(m.x,m.y);ctx.strokeStyle='#f7931a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y,14,7,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;const p0=P,g0=G,sb=OPT.selfBars;try{G=tagProxy();P=m;OPT.selfBars=false;if(mode!=='dying')drawPlayer(X,Y)}catch(e){}finally{P=p0;G=g0;OPT.selfBars=sb;ctx.globalAlpha=1}ctx.fillStyle='#050409';ctx.fillRect(X-15,Y-59,30,5);ctx.fillStyle='#f7931a';ctx.fillRect(X-14,Y-58,28*clamp(m.hp/m.max,0,1),3);label(X,Y-64,m.sayT>0?m.say:CLS[G.tag.cls].n+' '+G.tag.lvl,m.sayT>0?'#fff':'#f7931a','700 9.5px Cinzel,serif')}
    else if(q.k===9){const m=q.o,X=SX(m.x,m.y),Y=SY(m.x,m.y);ctx.strokeStyle='#59e0e6';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y,14,7,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;human(X,Y,{c:m.flash>0?'#fff':'#6a9a5a',c2:'rgba(0,0,0,.3)',ph:m.ph*9,mov:m.mov,f:m.fx});ctx.fillStyle='#c22d35';ctx.beginPath();ctx.arc(X+m.fx*9,Y-20,3.5,0,6.283);ctx.fill();ctx.stroke();ctx.fillStyle='#050409';ctx.fillRect(X-15,Y-57,30,5);ctx.fillStyle='#59e0e6';ctx.fillRect(X-14,Y-56,28*clamp(m.hp/m.max,0,1),3);label(X,Y-62,m.name,'#59e0e6','700 9.5px Cinzel,serif')}
    else if(q.k===4){const X=SX(q.x,q.y),Y=SY(q.x,q.y);if(q.arch){shadow(X,Y,20);const g=ctx.createLinearGradient(0,Y-58,0,Y);g.addColorStop(0,q.col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalAlpha=.45+.1*Math.sin(tNow*3);ctx.fillStyle=g;ctx.fillRect(X-15,Y-58,30,56);ctx.globalAlpha=1;box(X-21,Y-62,6,62,1,'#3a3250');box(X+15,Y-62,6,62,1,'#3a3250');box(X-23,Y-70,46,9,2,'#4a4266');ctx.fillStyle=q.col;ctx.fillRect(X-4,Y-67,8,3);light(X,Y-30,120,q.col)}else portal(X,Y,q.col)}
    else if(q.k===6)drawObj(q.o,SX(q.o.x,q.o.y),SY(q.o.x,q.o.y));
    else if(q.k===7){const d=q.o,X=SX(d.x,d.y),hop=d.t<.35?Math.sin(d.t/.35*3.14)*22:0,Y=SY(d.x,d.y)-hop;if(d.it&&d.it.q>=2&&!d.it.charm){const bh=d.it.q>=4?150:d.it.q===3?120:90,bg=ctx.createLinearGradient(0,Y-bh,0,Y);bg.addColorStop(0,'rgba(0,0,0,0)');bg.addColorStop(1,QCOL[d.it.q]);ctx.globalAlpha=.55+.15*Math.sin(tNow*4+d.x);ctx.fillStyle=bg;ctx.fillRect(X-3,Y-bh,6,bh);ctx.globalAlpha=1;light(X,Y-20,70,QCOL[d.it.q])}ctx.strokeStyle=OL;ctx.lineWidth=1.2;
      if(d.word){poly([X-7,Y-12,X+6,Y-13,X+7,Y-2,X-6,Y-1],'#e6dcc0');ctx.fillStyle='#f7931a';ctx.fillRect(X-4,Y-9,8,1.6);ctx.fillRect(X-4,Y-6,5,1.6);glow(X,Y-7,18,'#f7931a',.45);light(X,Y-7,45,'#f7931a')}
      else if(d.sat){ctx.beginPath();ctx.arc(X,Y-7,6.5,0,6.283);ctx.fillStyle='#f7931a';ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.font='900 9px Cinzel,serif';ctx.textAlign='center';ctx.fillText('B',X,Y-4);ctx.fillRect(X-1.6,Y-12.5,1,2);ctx.fillRect(X+.8,Y-12.5,1,2);glow(X,Y-7,18,'#f7931a',.5);light(X,Y-7,45,'#f7931a')}
      else if(d.cr){for(let i=0;i<3;i++){ctx.beginPath();ctx.ellipse(X+(i-1)*4,Y-3-i%2*2,5,3.2,0,0,6.283);ctx.fillStyle=i%2?'#ffe9a8':'#e0bd3a';ctx.fill();ctx.stroke()}}
      else if(d.pot){box(X-4,Y-13,8,12,2,'#b3261e');box(X-2.5,Y-16,5,4,1,'#e6e2d6');glow(X,Y-7,14,'#ff5d4d',.4)}
      else{const c=QCOL[d.it.q];box(X-7,Y-11,14,11,2,'#2a2433');ctx.fillStyle=c;ctx.fillRect(X-4,Y-8,8,5);if(d.it.q>0){glow(X,Y-6,20,c,.45);light(X,Y-6,45,c)}}}
    else{const a=q.o,X=SX(a.x,a.y),Y=SY(a.x,a.y);ctx.strokeStyle=OL;ctx.lineWidth=1.4;
      if(a.k==='turret'){shadow(X,Y,11);box(X-9,Y-10,18,10,3,'#3d3a52');box(X-4,Y-18,8,9,2,'#5a5670');eye(X,Y-14,2.5,'#59e0e6');light(X,Y-12,70,'#59e0e6')}
      else if(a.k==='mine'){ctx.beginPath();ctx.ellipse(X,Y-2,8,4.5,0,0,6.283);ctx.fillStyle='#2a2630';ctx.fill();ctx.stroke();if(a.arm<=0)eye(X,Y-3,2,Math.sin(tNow*10)>0?'#ff3b30':'#7a1a14')}
      else if(a.k==='minion'&&a.kind){const fl=a.flash>0;
        if(a.kind==='conv'){ctx.strokeStyle='#7be495';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,16,8,0,0,6.283);ctx.stroke();drawEnemy(a.e,X,Y)}
        else if(a.kind==='drone'){shadow(X,Y,7);const y=Y-26+Math.sin(a.ph*6)*2;ctx.beginPath();ctx.ellipse(X,y,8,5,0,0,6.283);ctx.fillStyle='#26262e';ctx.fill();ctx.stroke();ctx.fillStyle='#e0bd6e';ctx.fillRect(X-7,y-1,14,2);eye(X,y+2,1.8,'#e0bd6e')}
        else if(a.kind==='golem'){const b=human(X,Y,{c:fl?'#fff':'#26262e',c2:'#101016',skin:'#8f8a80',s:1.55,ph:a.ph*6,mov:a.mov,f:a.fx,leg:'#101016'});box(X-4,Y-47+b,8,13,1,'#e6e2d6');poly([X-2,Y-47+b,X+2,Y-47+b,X+2.5,Y-37+b,X,Y-34+b,X-2.5,Y-37+b],'#b3261e');eye(X+a.fx*3,Y-58+b,1.6,'#e0bd6e')}
        else if(a.kind==='clone'){ctx.globalAlpha=.6;const b=human(X,Y,{c:fl?'#fff':'#3f3f4c',c2:'#22222a',skin:'#e6e2d6',ph:a.ph*9,mov:a.mov,f:a.fx,leg:'#17171c'});ctx.fillStyle='#0b0912';ctx.fillRect(X-3,Y-38.5+b,2.2,1.6);ctx.fillRect(X+1,Y-38.5+b,2.2,1.6);ctx.globalAlpha=1}
        else{const b=human(X,Y,{c:fl?'#fff':'#e6e2d6',c2:'#b8b0a0',s:.8,ph:a.ph*10,mov:a.mov,f:a.fx,leg:'#3a3644'});ctx.fillStyle='#59e0e6';ctx.fillRect(X-1,Y-24+b,2,7)}
        if(a.hp!==undefined&&a.hp<a.max){ctx.fillStyle='#050409';ctx.fillRect(X-13,Y-(a.kind==='golem'?74:54),26,4);ctx.fillStyle='#7be495';ctx.fillRect(X-12,Y-(a.kind==='golem'?73:53),24*Math.max(0,a.hp/a.max),2)}}
      else if(a.k==='minion'){shadow(X,Y,6);const y=Y-22+Math.sin(a.ph*6)*2;ctx.beginPath();ctx.ellipse(X,y,7,4.5,0,0,6.283);ctx.fillStyle='#5c3aa8';ctx.fill();ctx.stroke();eye(X,y+1,1.8,'#59e0e6')}
      else{shadow(X,Y,11);box(X-10,Y-16,20,16,1,'#a8895c');ctx.fillStyle='#6a5030';ctx.fillRect(X-10,Y-9,20,3);ctx.fillStyle='#ff5d4d';ctx.font='900 13px Cinzel,serif';ctx.textAlign='center';ctx.fillText(Math.ceil(a.life),X,Y-22)}}
  }
  for(const p of W.parts){const X=SX(p.x,p.y),Y=SY(p.x,p.y)-p.z;ctx.globalAlpha=Math.min(1,(1-p.t/p.life)*2);ctx.fillStyle=p.col;ctx.fillRect(X-p.s/2,Y-p.s/2,p.s,p.s)}ctx.globalAlpha=1;
  for(const f of W.fx){const X=SX(f.x,f.y),Y=SY(f.x,f.y),u=f.t/f.life;
    if(f.k==='arc'){const a=Math.atan2((f.dx+f.dy)*.5,f.dx-f.dy);ctx.lineCap='round';for(const[lw,cl,rr]of[[12*f.w,'rgba(255,170,80,'+(1-u)*.35+')',1],[6*f.w,'rgba(255,240,210,'+(1-u)+')',1],[2.5*f.w,'rgba(255,255,255,'+(1-u)*.8+')',.82]]){ctx.strokeStyle=cl;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(X,Y-18,46*f.w*rr,24*f.w*rr,0,a-1*f.w+u*.6,a+1*f.w+u*.6);ctx.stroke()}ctx.lineCap='butt'}
    if(f.k==='bolt'){const X2=SX(f.x2,f.y2),Y2=SY(f.x2,f.y2);const pts=[[X,Y-22]];for(let i=1;i<7;i++)pts.push([X+(X2-X)*i/7+rnd(-9,9),Y-22+(Y2-Y)*i/7+rnd(-9,9)]);pts.push([X2,Y2-22]);ctx.globalAlpha=1-u;ctx.lineJoin='round';for(const[lw,cl]of[[9,f.col||'#59e0e6'],[3,'#ffffff']]){ctx.strokeStyle=cl;ctx.lineWidth=lw;ctx.globalAlpha=(1-u)*(lw>4?.35:1);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)ctx.lineTo(p[0],p[1]);ctx.stroke()}const bp=pts[3];ctx.lineWidth=1.5;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(bp[0],bp[1]);ctx.lineTo(bp[0]+rnd(-22,22),bp[1]+rnd(-22,22));ctx.stroke();ctx.globalAlpha=1;light(X2,Y2-22,80,f.col||'#59e0e6')}
    if(f.k==='strike'){ctx.strokeStyle='#d8c8ff';ctx.globalAlpha=1-u;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X+rnd(-10,10),Y-260);for(let i=1;i<6;i++)ctx.lineTo(X+rnd(-9,9),Y-260+i*43);ctx.lineTo(X,Y);ctx.stroke();ctx.globalAlpha=1;light(X,Y,110,'#9a6cff')}
    if(f.k==='beam'){ctx.globalAlpha=(1-u)*.7;ctx.fillStyle=f.col;ctx.fillRect(X-2,Y-200,4,200);ctx.globalAlpha=1;light(X,Y-40,90,f.col)}}
  for(const p of W.projs){const X=SX(p.x,p.y),Y=SY(p.x,p.y)-20;ctx.fillStyle=p.col;
    if(p.foe){ctx.beginPath();ctx.arc(X,Y,5,0,6.283);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.stroke();glow(X,Y,16,p.col,.6);light(X,Y,45,p.col)}
    else{const a=Math.atan2((p.vx+p.vy)*.5,p.vx-p.vy);ctx.save();ctx.translate(X,Y);ctx.rotate(p.kind==='courier'?tNow*25:a);
      if(p.kind==='hacker'){ctx.fillRect(-9,-2,18,4);ctx.restore();glow(X,Y,p.big?26:16,p.col,.7);light(X,Y,60,p.col)}else{ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(8+p.big*3,0);ctx.lineTo(-4,-3.5-p.big*2);ctx.lineTo(-4,3.5+p.big*2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}}}
  // darkness and light radius
  const lw=LC.width,lh=LC.height,k=lw/VW;lg.globalCompositeOperation='source-over';lg.clearRect(0,0,lw,lh);const AB=TX.amb||[4,3,10];lg.fillStyle='rgba('+AB[0]+','+AB[1]+','+AB[2]+','+Math.min(.9,z.amb+(EV&&EV.k==='outage'?.22:0))+')';lg.fillRect(0,0,lw,lh);lg.globalCompositeOperation='destination-out';
  for(const L of LIGHTS){const S=L.s===undefined?1:L.s,g=lg.createRadialGradient(L.X*k,L.Y*k,0,L.X*k,L.Y*k,L.r*k);g.addColorStop(0,'rgba(0,0,0,'+(L.col?.8:1)*S+')');g.addColorStop(.42,'rgba(0,0,0,'+(L.col?.52:.88)*S+')');g.addColorStop(.72,'rgba(0,0,0,'+(L.col?.22:.42)*S+')');g.addColorStop(1,'rgba(0,0,0,0)');lg.fillStyle=g;lg.fillRect((L.X-L.r)*k,(L.Y-L.r)*k,L.r*2*k,L.r*2*k)}
  /* source-atop tints what is left of the veil without touching its alpha, so a lamp
     warms the shadow around its pool instead of just cutting a grey hole in it */
  lg.globalCompositeOperation='source-atop';
  for(const L of LIGHTS){if(!L.col)continue;const r=L.r*.85*k,g=lg.createRadialGradient(L.X*k,L.Y*k,0,L.X*k,L.Y*k,r);g.addColorStop(0,L.col);g.addColorStop(1,'rgba(0,0,0,0)');lg.globalAlpha=.55;lg.fillStyle=g;lg.fillRect(L.X*k-r,L.Y*k-r,r*2,r*2)}
  lg.globalAlpha=1;lg.globalCompositeOperation='source-over';
  ctx.imageSmoothingEnabled=true;ctx.drawImage(LC,0,0,VW,VH);
  weather();
  // labels and floating text above the darkness
  {const vg=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*.58,VW/2,VH/2,Math.max(VW,VH)*.82);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(3,2,8,.34)');ctx.fillStyle=vg;ctx.fillRect(0,0,VW,VH)}
  if(OPT.labels)for(const d of W.drops)if(d.it&&d.t>.3){const X=SX(d.x,d.y),Y=SY(d.x,d.y);label(X,Y-20,d.it.id?d.it.name:d.it.base,QCOL[d.it.q],'700 10px Cinzel,serif')}
  ctx.font='900 14px Cinzel,serif';ctx.textAlign='center';
  for(const t of W.texts){ctx.globalAlpha=1-t.t/.9;const X=SX(t.x,t.y),Y=SY(t.x,t.y)-50-t.t*36;ctx.fillStyle='#000';ctx.fillText(t.txt,X+1,Y+1);ctx.fillStyle=t.col;ctx.fillText(t.txt,X,Y)}
  ctx.globalAlpha=1;
  const GP=goalPt();if(GP&&dist(GP,P)>3){const gx=SX(GP.x,GP.y)-SX(P.x,P.y),gy=SY(GP.x,GP.y)-SY(P.x,P.y),a=Math.atan2(gy,gx),X=SX(P.x,P.y)+Math.cos(a)*66,Y=SY(P.x,P.y)-18+Math.sin(a)*66;
    ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle=GP.k==='qobj'?'#59e0e6':W.boss||GP.su?'#ff5d4d':GP.k==='cage'?'#7be495':'#e0bd6e';ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.fill();ctx.restore()}
  const hf=G.hp/S.maxHp;
  if(hf<.4&&!z.town){const k=(.4-hf)/.4,al=.07+k*.5+Math.sin(tNow*(3+k*5))*(.02+k*.08),g=ctx.createRadialGradient(VW/2,VH/2,Math.min(VW,VH)*(.52-k*.2),VW/2,VH/2,Math.max(VW,VH)*.72);g.addColorStop(0,'rgba(150,0,0,0)');g.addColorStop(1,'rgba(170,8,4,'+al+')');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH)}
  if(BLOOD.length){BLOOD=BLOOD.filter(b=>tNow-b.b<b.life);for(const b of BLOOD){const ag=tNow-b.b;if(ag<0)continue;const u=ag/b.life,pop=Math.min(1,ag/.12),a=(u<.6?1:1-(u-.6)/.4)*.8,X=b.x*VW,Y=b.y*VH,r=b.r*pop,dl=Math.min(1,ag/1.6)*b.d;
      ctx.globalAlpha=a;ctx.fillStyle='#7a0606';ctx.beginPath();ctx.roundRect(X-r*.28,Y,r*.56,dl,r*.28);ctx.fill();ctx.beginPath();ctx.arc(X,Y+dl,r*.36,0,6.283);ctx.fill();
      ctx.fillStyle='#a30c0c';ctx.beginPath();ctx.arc(X,Y,r,0,6.283);ctx.arc(X+r*(b.k-.5)*2.2,Y-r*.7,r*.4,0,6.283);ctx.arc(X-r*.9,Y+r*(b.k-.3),r*.3,0,6.283);ctx.fill();
      ctx.fillStyle='rgba(255,120,110,.5)';ctx.beginPath();ctx.arc(X-r*.3,Y-r*.3,r*.22,0,6.283);ctx.fill()}ctx.globalAlpha=1}
  if(mode==='dying'){ctx.fillStyle='rgba(70,0,0,'+Math.min(.5,DY.t*.4)+')';ctx.fillRect(0,0,VW,VH);ctx.fillStyle='rgba(0,0,0,'+clamp((DY.t-1.2)*.6,0,.7)+')';ctx.fillRect(0,0,VW,VH)}
  // map
  if(OPT.minimap&&!z.town){ctx.setTransform(DPR,0,0,DPR,0,0);const mx=CW-78,my=196;ctx.save();ctx.beginPath();ctx.rect(CW-150,128,142,136);ctx.clip();ctx.globalAlpha=.8;ctx.translate(mx,my);ctx.transform(1.7,.85,-1.7,.85,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(W.mm,-P.x,-P.y);
    for(const p of W.portals)if(W.seen[(p.y|0)*N+(p.x|0)]){ctx.fillStyle=p.kind==='next'?'#ff7a3c':'#4a8cff';ctx.fillRect(p.x-P.x-1.2,p.y-P.y-1.2,2.4,2.4)}
    for(const o of W.objs)if(!o.used&&(o.k==='shrine'||o.k==='chest'||o.k==='cage')&&W.seen[(o.y|0)*N+(o.x|0)]){ctx.fillStyle=o.k==='shrine'?'#59e0e6':'#ffe36b';ctx.fillRect(o.x-P.x-.8,o.y-P.y-.8,1.6,1.6)}
    ctx.restore();ctx.fillStyle='#fff';ctx.fillRect(mx-2,my-2,4,4);ctx.imageSmoothingEnabled=true}
}
