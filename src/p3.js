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
 town:{k:'mote',n:30,sp:.020},        moor:{k:'rain',n:60,sp:1.05,w:.20,c:'#8fa8b8'},
 mall:{k:'mote',n:34,sp:.022},        farm:{k:'data',n:42,sp:.62},
 trib:{k:'dust',n:40,sp:.010},        hq:{k:'mote',n:26,sp:.014},
 shaft:{k:'ember',n:46,sp:.046},      garden:{k:'spore',n:38,sp:.020},
 lake:{k:'leaf',n:22,sp:-.030},       walk:{k:'mote',n:20,sp:.012},
 vest:{k:'dust',n:34,sp:.009},        minutes:{k:'leaf',n:20,sp:-.024,c:'#e8e0c8'},
 chairs:{k:'ember',n:28,sp:.030},     rack:{k:'data',n:44,sp:.80},
 still:{k:'mote',n:22,sp:.007},       landing:{k:'mote',n:22,sp:.012},
 cutler:{k:'mote',n:26,sp:.014},      mile:{k:'mote',n:30,sp:.016},
 sofa:{k:'dust',n:34,sp:.010},        reactor:{k:'data',n:42,sp:.46},
 list:{k:'leaf',n:22,sp:-.020,c:'#ffffff'}, kitchen:{k:'mote',n:20,sp:.012},
 garage:{k:'dust',n:28,sp:.009},      chain:{k:'data',n:42,sp:.88},
 mempool:{k:'drift',n:34,sp:.030},    vault:{k:'leaf',n:22,sp:-.022,c:'#f0ead8'},
 blocks:{k:'ember',n:32,sp:.030},     room:{k:'dust',n:16,sp:.005},
 cage:{k:'data',n:36,sp:.66},         wait:{k:'dust',n:28,sp:.010},
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
/* Tiles are built at twice the size they are drawn, so a hi-dpi screen gets
   pixels where it used to get an upscale. It costs 4x the tile memory (388KB
   for the one style that is resident, against 97KB) and about 1ms of the frame
   while the camera is moving, because a moving camera rebuilds the floor raster
   and each tile blit is now a downscale. Thin effects drop back to 1, so the
   setting that already exists for a weak device covers this too. The factor a
   tile was built at rides on TX, not on this, so a mid-game change of setting
   cannot leave the draw sites scaling by the wrong number. */
function tscale(){return OPT.fx==='thin'?1:2}
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
 /* The Gardens are planting beds, not bathroom tile. Every variant used to
    carry the same bright frame at the same inset and the same nine plants at
    the same spacing, so five tiles repeated across a district read as one hard
    lattice -- the same tiling problem material() is careful about, sitting in
    the authored art underneath it. The frame is quieter and its inset moves
    with the variant, the planting is thinned and offset so neighbours do not
    line up, and the pond lost its perfect circle. The reading is unchanged:
    beds, something growing in them, and water in one of five. */
 garden(g,v,s,L){g.fillStyle='rgba(31,64,56,.6)';g.fillRect(0,0,33,33);
  const o=2+(v%3);g.fillStyle='rgba(159,255,224,.14)';g.fillRect(o,o,33-o*2,33-o*2);
  g.strokeStyle='rgba(216,232,224,'+(.15+(v%2)*.07)+')';g.lineWidth=1;g.strokeRect(o+.5,o+.5,32-o*2,32-o*2);
  if(v===3){g.fillStyle='rgba(159,255,224,.26)';g.beginPath();
    for(let a=0;a<9;a++){const t=a/9*6.283,r=5.2+((a*5+v)%3)*1.1,
      X=16.5+Math.cos(t)*r,Y=16.5+Math.sin(t)*r*.94;a?g.lineTo(X,Y):g.moveTo(X,Y)}
    g.closePath();g.fill()}
  else for(let i=0;i<9;i++){if((i*7+v*3)%4===0)continue;
    const w=4+((i+v)%2);g.fillStyle='rgba(120,180,150,'+(.24+((i+v)%3)*.08)+')';
    g.fillRect(4+(i%3)*9+(v%2),4+((i/3)|0)*9+((v+1)%2),w,w)}},
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
/* ---- surface material -------------------------------------------------------
   floorDetail draws what a tile *is*: Tribunal Row's gold inlay, the Fields'
   irrigation line. material draws what it has been through -- that it is
   mottled rather than one flat colour, that the slab has settled at its edges,
   that somebody has walked on it. It paints in the same unprojected 33x33
   square floorDetail uses, so the wear lies in the ground plane rather than on
   the screen.

   A style with no MAT row is left exactly as it was, which is how this arrives
   one act at a time. Everything is seeded off (style, variant), never
   Math.random, so the ground is the same ground for everybody in a shared
   district and so an A/B screenshot is comparable. */
function mseed(k){let h=2166136261;for(let i=0;i<k.length;i++){h^=k.charCodeAt(i);h=Math.imul(h,16777619)}
  return()=>{h^=h<<13;h>>>=0;h^=h>>>17;h^=h<<5;h>>>=0;return h/4294967296}}
const MAT={
 /*      mottle a/n/r    grain  scuff n/a   crack  settle  sheen  water  grime  soot
    soot: what fraction of the lightness swing is dark. .50 is the symmetric
    swing Act I was tuned with, and the test is written as R()<1-b so that .50
    is arithmetically the old R()<.5 and Act I's rows did not need retuning.
    Do not try to confirm that by measuring the tiles: floorDetail still calls
    Math.random for the grass, the scratches and the cathedral's curves, so a
    tile set differs slightly from one build to the next no matter what this
    pass does. */
 town:{m:[.085,6,8.5], g:.05,  w:[7,.055], c:0, v:.30, s:0,   p:0, r:.34, b:.50},
 moor:{m:[.125,7,7.5], g:.06,  w:[5,.045], c:3, v:.22, s:.10, p:1, r:.46, b:.50},
 mall:{m:[.065,5,9.5], g:.03,  w:[9,.050], c:0, v:.24, s:.20, p:0, r:.26, b:.50},
 farm:{m:[.100,6,8.0], g:.05,  w:[4,.040], c:1, v:.34, s:.07, p:0, r:.30, b:.50},
 trib:{m:[.075,5,8.5], g:.045, w:[8,.065], c:4, v:.28, s:.04, p:0, r:.38, b:.50},
 hq:  {m:[.055,5,10 ], g:.025, w:[5,.040], c:0, v:.20, s:.16, p:0, r:.22, b:.50},
 /* Act II is a tower, and most of it is still being looked after -- the Gardens
    are tended, the Mezzanine is polished, the Landing is lived in. Act I's
    amounts carried across would make a kept place look like a car park, which
    is the asphalt mistake again pointing the other way. Only the Updraft gets
    Act I's weight, and it gets it as soot rather than as rain. */
 shaft:  {m:[.115,7,8  ], g:.055, w:[6,.050], c:3, v:.30, s:.14, p:0, r:.52, b:.72},
 garden: {m:[.085,6,9  ], g:.035, w:[3,.035], c:0, v:.22, s:.12, p:0, r:.18, b:.42},
 lake:   {m:[.095,5,11 ], g:.030, w:[2,.030], c:0, v:.18, s:.26, p:0, r:.24, b:.48},
 walk:   {m:[.075,6,8.5], g:.045, w:[9,.055], c:2, v:.30, s:.06, p:0, r:.34, b:.55},
 mezz:   {m:[.050,5,10 ], g:.022, w:[5,.040], c:0, v:.20, s:.18, p:0, r:.20, b:.45},
 landing:{m:[.060,5,9  ], g:.030, w:[6,.045], c:1, v:.24, s:.10, p:0, r:.26, b:.50},
 /* Act III is an institution, so the question each row answers is what the
    surface is made of rather than how ruined it is. Carpet does not crack and
    has no slab seam to settle into, so the Nine Chairs run c:0 and the lowest
    settle in the game and spend it all on mottle instead. A server room's
    raised floor is the opposite: panel seams are the loudest thing in it.

    The Nine Chairs is also the floor the Director disappears into, and the
    mottle was expected to help. It does not: tools/floor-sep.js puts that pair
    at dE 0.6 after the pass against 0.0 before, which is nothing. A body that
    *is* a floor colour cannot be separated by varying the floor's lightness
    around it, because the variation moves both ways past the body. rimOn() is
    what carries that pair, and this row is tuned for what carpet looks like
    rather than for a separation it cannot buy. */
 vest:   {m:[.085,6,8.5], g:.045, w:[8,.055], c:1, v:.30, s:.06, p:0, r:.36, b:.58},
 minutes:{m:[.095,6,9  ], g:.050, w:[6,.050], c:1, v:.26, s:.05, p:0, r:.34, b:.55},
 chairs: {m:[.110,7,9.5], g:.055, w:[4,.035], c:0, v:.14, s:.03, p:0, r:.30, b:.50},
 rack:   {m:[.045,5,9  ], g:.028, w:[6,.045], c:0, v:.34, s:.14, p:0, r:.24, b:.52},
 still:  {m:[.090,5,11 ], g:.030, w:[2,.030], c:0, v:.16, s:.24, p:0, r:.22, b:.46},
 wait:   {m:[.090,6,8.5], g:.045, w:[7,.050], c:2, v:.28, s:.05, p:0, r:.38, b:.60},
 /* Act IV is the Gentle Years, which the backdrop work already settled as a
    kept place rather than a ruin: an avenue, a sofa, a kitchen table. So the
    wear here is the wear of being lived in, not of being abandoned, and the
    Sofa takes the Nine Chairs' treatment because soft furnishing does not
    crack. Tomari is the one industrial floor in the act and the only one that
    gets grime. */
 cutler: {m:[.075,6,9  ], g:.040, w:[6,.045], c:1, v:.26, s:.06, p:0, r:.30, b:.52},
 mile:   {m:[.070,6,9  ], g:.038, w:[7,.050], c:1, v:.26, s:.08, p:0, r:.28, b:.50},
 sofa:   {m:[.095,6,9.5], g:.045, w:[4,.035], c:0, v:.16, s:.04, p:0, r:.26, b:.50},
 reactor:{m:[.070,6,8.5], g:.045, w:[6,.045], c:2, v:.32, s:.12, p:0, r:.40, b:.58},
 list:   {m:[.080,6,8.5], g:.042, w:[6,.045], c:2, v:.28, s:.05, p:0, r:.32, b:.54},
 kitchen:{m:[.085,6,9  ], g:.040, w:[7,.050], c:1, v:.24, s:.10, p:0, r:.26, b:.48},
 /* Act V, and the prequel's one daylight zone. The Room keeps the lowest
    numbers in the table on purpose: FD.room is plain because that was always
    the joke about it, and a material pass that made it interesting would be
    improving away the point. The Garage is the opposite and the dirtiest floor
    in the game -- it is a garage. */
 garage: {m:[.105,7,8.5], g:.055, w:[8,.060], c:3, v:.30, s:.07, p:0, r:.44, b:.64},
 chain:  {m:[.085,6,8.5], g:.045, w:[5,.045], c:1, v:.28, s:.12, p:0, r:.36, b:.56},
 mempool:{m:[.090,5,11 ], g:.035, w:[3,.035], c:0, v:.18, s:.20, p:0, r:.26, b:.50},
 vault:  {m:[.080,6,9  ], g:.048, w:[6,.050], c:2, v:.30, s:.04, p:0, r:.36, b:.56},
 blocks: {m:[.080,6,9  ], g:.045, w:[5,.045], c:1, v:.28, s:.14, p:0, r:.34, b:.56},
 room:   {m:[.030,4,11 ], g:.018, w:[2,.025], c:0, v:.12, s:.03, p:0, r:.14, b:.50},
 cage:   {m:[.055,5,9.5], g:.030, w:[5,.040], c:0, v:.22, s:.10, p:0, r:.20, b:.46}
};
function material(g,st0,s,v){const M=MAT[st0];if(!M)return;const R=mseed(st0+'/'+v);
  const rgba=(c,a)=>'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')',
        blob=(x,y,r,col,a)=>{const q=g.createRadialGradient(x,y,0,x,y,r);
          q.addColorStop(0,rgba(col,a));q.addColorStop(1,rgba(col,0));
          g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)};
  /* Mottle, so no two parts of a slab are the same colour. The lightness swing
     goes down through soft-light rather than source-over: a material layer has
     to *modulate* the tone underneath it, not repaint it. Painted flat, the
     first version lifted the Moors' black asphalt back toward the grass around
     it and the road stopped reading. Only the faint sibling-tone pass is drawn
     normally, and it stays inside the authored palette so it cannot move a
     floor away from the actors standing on it. */
  g.globalCompositeOperation='soft-light';
  for(let i=0;i<M.m[1];i++){const r=M.m[2]*(.55+R()*.95);
    blob(R()*33,R()*33,r,R()<1-M.b?[255,255,255]:[0,0,0],M.m[0]*3.4)}
  g.globalCompositeOperation='source-over';
  for(let i=0;i<M.m[1];i++){const r=M.m[2]*(.7+R()*.8);
    blob(R()*33,R()*33,r,hex2rgb(s.f[(i+v)%3]),M.m[0]*.5)}
  /* the slab has settled: darker toward its edges. A radial falloff rather than
     four lines, because a grid of lines over a whole district reads as graph
     paper and this reads as a seam. */
  if(M.v>0){const q=g.createRadialGradient(16.5,16.5,6,16.5,16.5,24);
    q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(0,0,0,'+M.v+')');
    g.fillStyle=q;g.fillRect(0,0,33,33)}
  /* walked on. Soft-light again, so a scuff on asphalt stays dark asphalt. */
  g.globalCompositeOperation='soft-light';g.lineCap='round';
  for(let i=0;i<M.w[0];i++){const x=R()*33,y=R()*33,a=R()*6.283,l=2+R()*7;
    g.strokeStyle='rgba(255,255,255,'+(M.w[1]*(.4+R()*.8)).toFixed(3)+')';g.lineWidth=.4+R()*.9;
    g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
  g.globalCompositeOperation='source-over';
  /* Cracks get a jointed line each, because a crack turns and a scuff does not.
     Only some variants get the full count: a district has five floor tiles and
     repeats them everywhere, so any feature distinctive enough to recognise is
     also distinctive enough to show where the grid is. Mottle and grain can go
     on every tile because neither is recognisable; a crack cannot. */
  const nc=Math.round(M.c*(v%3)/2);
  for(let i=0;i<nc;i++){let x=R()*33,y=R()*33,a=R()*6.283;
    g.strokeStyle='rgba(0,0,0,'+(.18+R()*.16).toFixed(3)+')';g.lineWidth=.5+R()*.6;
    g.beginPath();g.moveTo(x,y);
    for(let j=0;j<3;j++){a+=(R()-.5)*1.5;x+=Math.cos(a)*(3+R()*5);y+=Math.sin(a)*(3+R()*5);g.lineTo(x,y)}
    g.stroke()}
  /* a polished floor keeps a little of the district's own lamp colour */
  if(M.s>0)blob(8+R()*17,8+R()*17,13+R()*7,hex2rgb(s.glow),M.s);
  /* Standing water. It rains in the Moors, and a puddle is the only thing down
     there that gives the sky back. Two variants of the five, one each: a closed
     bright ring on every tile read as somebody had drawn circles on the floor,
     which is the same tiling problem as the cracks and worse, because a ring is
     a shape the eye looks for. What is left is a dark dish and a highlight on
     one side of it, and the shape only resolves when a lamp is near. */
  if(M.p&&v%5<2){const x=7+R()*19,y=7+R()*19,rx=4.5+R()*4.5,ry=rx*(.5+R()*.22);
    g.save();g.translate(x,y);g.scale(1,ry/rx);
    blob(0,0,rx,[14,20,26],.45);
    g.strokeStyle='rgba(159,208,255,.09)';g.lineWidth=.7;
    g.beginPath();g.arc(0,0,rx*.80,2.5,5.2);g.stroke();
    g.restore();
    blob(x-rx*.22,y-ry*.35,rx*.55,hex2rgb(s.glow),.16)}
  /* grain last, so it sits on top of everything above it */
  g.globalCompositeOperation='soft-light';
  if(M.g>0)for(let i=0;i<190;i++){
    g.fillStyle=R()<.5?'rgba(0,0,0,'+M.g+')':'rgba(255,255,255,'+(M.g*.6).toFixed(3)+')';
    g.fillRect(R()*33,R()*33,.5+R()*.7,.5+R()*.7)}
  g.globalCompositeOperation='source-over';
}
/* The same, for a wall face. The crease where a wall meets the ground is the
   cheapest thing in the renderer that makes geometry feel solid. */
function faceMat(g,st0,H,v,side,s){const M=MAT[st0];if(!M||!(M.r>0))return;
  const R=mseed(st0+'/f'+side+'/'+v),d=Math.min(H,17);
  const q=g.createLinearGradient(0,H-d,0,H);
  q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(0,0,0,'+M.r+')');
  g.fillStyle=q;g.fillRect(0,H-d,33,d);
  /* streaks: what weather does to a wall nobody washes */
  for(let i=0;i<4;i++){const x=R()*33,w=.8+R()*2.2,t=R()*H*.5,b=Math.min(H,t+H*(.3+R()*.6));
    const k=g.createLinearGradient(0,t,0,b);
    k.addColorStop(0,'rgba(0,0,0,0)');k.addColorStop(.3,'rgba(0,0,0,'+(.10+R()*.10).toFixed(3)+')');k.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=k;g.fillRect(x,t,w,b-t)}
}
function wallTex(s,st,H,v,st0,TS){const c=mk(66*TS,(34+H)*TS),g=c.getContext('2d');g.scale(TS,TS);
  g.save();g.transform(1,.5,0,1,0,17);g.fillStyle=s.w[1];g.fillRect(0,0,33,H);faceDetail(g,st,H,v,0,s,st0);faceMat(g,st0,H,v,0,s);g.restore();
  g.save();g.transform(1,-.5,0,1,33,34);g.fillStyle=s.w[2];g.fillRect(0,0,33,H);faceDetail(g,st,H,v,1,s,st0);faceMat(g,st0,H,v,1,s);g.restore();
  g.beginPath();g.moveTo(33,0);g.lineTo(66,17);g.lineTo(33,34);g.lineTo(0,17);g.closePath();g.fillStyle=s.w[0];g.fill();g.strokeStyle='rgba(255,255,255,.2)';g.lineWidth=1;g.stroke();
  g.strokeStyle='rgba(0,0,0,.5)';g.beginPath();g.moveTo(33,34);g.lineTo(33,34+H);g.stroke();
  g.globalCompositeOperation='source-atop';noise(g,66,34+H,H>20?110:40,.07);return c}
function buildTextures(st0){if(TX.style===st0&&TX.ts===tscale())return;const s=STY[st0],st=s.like||st0;const TS=tscale();TX={style:st0,s,ts:TS,floor:[],wall:[],low:null,dead:null};
  for(let v=0;v<5;v++){const c=mk(66*TS,34*TS),g=c.getContext('2d');g.scale(TS,TS);g.beginPath();g.moveTo(33,0);g.lineTo(66,17);g.lineTo(33,34);g.lineTo(0,17);g.closePath();g.clip();
    g.fillStyle=s.f[v%3];g.fillRect(0,0,66,34);g.save();g.transform(1,.5,-1,.5,33,0);floorDetail(g,st,v,s,st0);material(g,st0,s,v);g.restore();noise(g,66,34,55,.07);TX.floor.push(c)}
  for(let v=0;v<2;v++)TX.wall.push(wallTex(s,st,46,v,st0,TS));TX.low=wallTex(s,st,12,0,st0,TS);
  TX.amb=hex2rgb(AMBC[st0]||AMBC[st]||'#040308');
  {const L=hex2rgb(s.f[0]);TX.fill=clamp(.38-(L[0]+L[1]+L[2])/765*.85,.04,.28)}
  const wx=TX.wx=Object.assign({k:'mote',n:28,sp:.016},WX[st0]||WX[st]||{});wx.c=wx.c||s.mote;
  MOTES.length=0;for(let i=0;i<wx.n;i++)MOTES.push(newMote(i<wx.n*.22));}
/* ===== Dead space (visual only) =====
   Past the one-tile wall ring a zone used to be a bare dark backdrop. A style that has an entry in DEAD gets the
   rock, ground and props that stand behind that ring painted there. The entry is DATA (palette, prop counts and
   seeds, distance bands with pick odds, fog, darkening ramp, mode); the painters that turn it into sprites live in
   the PAINT registry and are shared, so a new style is a table entry plus, at most, a new painter. Gating is by
   style, never by zone id: The Parcel Moors (1) and The Bull Run (20) are both style 'moor'.
   Everything is baked once into small sprites by a seeded rng (mulberry32; no Math.random), placed by an integer
   hash of the tile, and drawn into the cached floor raster, so a still camera costs nothing and it never touches
   W.map, W.wh, W.seen, spawns or the network. The page cache is module level and capped (DEADC), not on W. */
const DEAD={
 moor:{mode:'scene',
  /* palette: rock is [index into STY[style].w, blend colour, amount] and is mixed at bake time */
  pal:{rock:[[1,'#7a7e84',.5],[2,'#4c5056',.5],[2,'#26282e',.62]],outline:'#08070c',
    grd:['#272c26','#2b3027','#242a25','#2d2e26','#262a2a'],patch:['#4a5a45','#3a4a38'],fleck:['#5b4a63','#6e5a74','#4f5c46','#6a6a4c','#3d4a3a'],
    moss:['#4a5a45','#56604a','#3a4a38'],stem:['#4f5c46','#6a6a4c','#3d4a3a','#5b4a63'],flower:['#8a6a9a','#a07fae','#7a5a8c'],
    bark:{ol:'#14100e',a:'#2b231d',b:'#352b23',hi:'rgba(150,130,104,.28)',root:'#201a15'},
    fog:[[0,'rgba(150,170,180,.5)'],[.55,'rgba(130,150,162,.22)'],[1,'rgba(120,140,150,0)']]},
  /* prop sets: paint = registry key, n = sprites, seed = first seed (seed+i) */
  props:{
   ground:{paint:'ground',n:5,seed:900},
   crag:{paint:'crag',n:6,seed:3100,h:[18,5],sz:[[14,20],[14,20],[20,32],[20,32],[20,32],[20,32]]},
   tall:{paint:'crag',n:6,seed:3200,h:[40,9],sz:[[19,30],[13,19],[19,30],[13,19],[19,30],[13,19]]},
   boulder:{paint:'boulder',n:4,seed:4100,s:[9,15]},
   tree:{paint:'tree',n:5,seed:5100,h:[54,86]},
   heath:{paint:'heath',n:4,seed:6100},
   fog:{paint:'fog',n:1,w:160,h:56}},
  /* distance bands (tiles to the nearest walkable tile): first entry whose cumulative odds exceed r wins, else nothing */
  bands:[{d:[0,2],pick:[[.18,'heath']]},
         {d:[2,3],pick:[[.8,'crag'],[.9,'boulder'],[1.01,'heath']]},
         {d:[3,4],pick:[[.62,'tall'],[.74,'boulder'],[.88,'heath']]},
         {d:[4,9],pick:[[.2,'tree'],[.34,'tall'],[.46,'boulder'],[.74,'heath']]},
         {d:[9,1e9],pick:[[.16,'tree'],[.26,'tall'],[.5,'heath']]}],
  edge:2,                                           /* tiles just outside the map count as at least this far */
  ramp:{col:'4,4,8',near:[2,.55],far:[3,.07,.5]},   /* d<near[0]: alpha near[1]; d>far[0]: min(far[2],(d-far[0])*far[1]) */
  fog:{dmax:5,p:.22,a:[.55,.35],dx:2,dy:-30}}       /* fog banks where d<=dmax, chance p */
};
const dh=(x,y,s)=>{let h=Math.imul(x+1013,374761393)^Math.imul(y+2027,668265263)^Math.imul(s+7,2147483629);h=Math.imul(h^h>>>13,1274126177);return((h^h>>>16)>>>0)/4294967296};
const DPAD=44;
/* the one cache for baked pages and the distance field: module level, one world at a time, at most DEADCAP pages */
const DEADCAP=9;let DEADC=null;
function deadCache(D,sc){if(!DEADC||DEADC.w!==W||DEADC.D!==D||DEADC.sc!==sc)DEADC={w:W,D,sc,m:new Map(),n:0,dd:null};return DEADC}
/* distance (in tiles, 8-way) from each tile of the map, padded by DPAD, to the nearest walkable tile */
function deadDist(C){if(C.dd)return C.dd;const N=W.N,M=N+DPAD*2,d=new Uint8Array(M*M).fill(255),q=new Int32Array(M*M);let a=0,b=0;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(W.map[y*N+x]!==0){const i=(y+DPAD)*M+x+DPAD;d[i]=0;q[b++]=i}
  while(a<b){const i=q[a++],x=i%M,y=(i/M)|0,v=d[i]+1;for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++){const X=x+k,Y=y+j;if(X<0||Y<0||X>=M||Y>=M)continue;const o=Y*M+X;if(d[o]===255){d[o]=v;q[b++]=o}}}
  return C.dd=d}
/* painters: (env, prop spec, index) -> sprite {c,w,h,bx,by} (ground: a bare canvas). env = {TS,pal,rock,sp,poly,P} */
const PAINT={
 /* ground: a tile of dark soil with patches, flecks, pebbles and cracks, drawn in tile space like the floors */
 ground(E,pr,v){const{TS,pal,rock,P}=E;const R=mulberry32(pr.seed+v),r=(a,b)=>a+R()*(b-a),c=mk(68*TS,36*TS),g=c.getContext('2d');g.scale(TS,TS);g.translate(1,1);
  g.beginPath();g.moveTo(33,-1);g.lineTo(67,17);g.lineTo(33,35);g.lineTo(-1,17);g.closePath();g.clip();
  g.fillStyle=pal.grd[v];g.fillRect(0,0,66,34);
  g.save();g.transform(1,.5,-1,.5,33,0);
  for(let i=0;i<7;i++){g.fillStyle=P(i%2?pal.patch[0]:pal.patch[1],r(.18,.34));g.beginPath();g.ellipse(r(0,33),r(0,33),r(3,8),r(2,6),r(0,3),0,6.283);g.fill()}
  for(let i=0;i<5;i++){g.fillStyle='rgba(8,6,10,'+r(.2,.4)+')';g.beginPath();g.ellipse(r(0,33),r(0,33),r(2,6),r(1.5,4),r(0,3),0,6.283);g.fill()}
  for(let i=0;i<26;i++){const x=r(0,33),y=r(0,33),h=r(1.6,3.6);g.strokeStyle=pal.fleck[i%5];g.lineWidth=.9;g.beginPath();g.moveTo(x,y);g.lineTo(x+r(-.8,.8),y-h);g.stroke()}
  for(let i=0;i<4;i++){const x=r(2,31),y=r(2,31);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-.5,y+.7,3,1.3);g.fillStyle=P(rock[i%2],.8);g.fillRect(x,y,2.4,1.5)}
  g.strokeStyle='rgba(6,5,9,.45)';g.lineWidth=.7;for(let i=0;i<2;i++){let x=r(2,30),y=r(2,30);g.beginPath();g.moveTo(x,y);for(let k=0;k<4;k++){x+=r(-3,3);y+=r(1,4);g.lineTo(x,y)}g.stroke()}
  g.restore();return c},
 /* crag: faceted stone column, left face dark, right face lit, strata, moss on the cap */
 crag(E,pr,i){const{pal,rock,sp,poly,P}=E,H0=pr.h[0]+i*pr.h[1],seed=pr.seed+i,s0=pr.sz[i][0],s1=pr.sz[i][1];
  const R=mulberry32(seed),r=(a,b)=>a+R()*(b-a),W0=Math.ceil(s1*2+18),bx=W0/2,by=H0+12;
  return sp(W0,H0+22,bx,by,g=>{const sx=r(s0,s1),k=r(.62,.96),n=4,lp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],
    bl=[bx-sx,by-7],bf=[bx+r(-3,3),by+3],br=[bx+sx*r(.85,1),by-7],bk=[bx+r(-3,3),by-17];
    const up=p=>[bx+(p[0]-bx)*k,p[1]-H0*r(.7,1.12)],Lb=[],Lt=[],Rb=[],Rt=[];
    for(let i=0;i<=n;i++){Lb.push(lp(bl,bf,i/n));Rb.push(lp(bf,br,i/n))}
    for(let i=0;i<=n;i++)Lt.push(up(Lb[i]));Rt.push(Lt[n]);for(let i=1;i<=n;i++)Rt.push(up(Rb[i]));
    const tb=up(bk),flat=p=>[].concat(...p);
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(bx+3,by-4,sx+7,9,0,0,6.283);g.fill();
    const face=(B,T,col)=>{poly(g,flat(B.concat(T.slice().reverse())),col);
      for(let i=0;i<n;i++){g.fillStyle='rgba('+(i%2?'0,0,0':'255,246,220')+','+(i%2?r(.08,.2):r(.03,.09))+')';poly(g,flat([B[i],B[i+1],T[i+1],T[i]]),g.fillStyle)}
      for(let i=0;i<9;i++){const t=r(.04,.96),a=lp(T[0],T[n],t),b2=lp(B[0],B[n],t),f=r(.25,.9);g.strokeStyle=i%3?'rgba(6,5,9,'+r(.25,.5)+')':'rgba(255,246,220,'+r(.06,.14)+')';g.lineWidth=i%3?r(.6,1.1):.8;g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(a[0]+(b2[0]-a[0])*f+r(-1,1),a[1]+(b2[1]-a[1])*f);g.stroke()}
      for(let i=1;i<5;i++){const t=r(.12,.9),m=r(.2,.7);g.strokeStyle='rgba(6,5,9,'+r(.3,.5)+')';g.lineWidth=.8;const a=lp(B[0],T[0],t),b2=lp(B[n],T[n],t);g.beginPath();g.moveTo(a[0]+(b2[0]-a[0])*(1-m)*.5,a[1]+(b2[1]-a[1])*(1-m)*.5);g.lineTo(a[0]+(b2[0]-a[0])*(1+m)*.5,a[1]+(b2[1]-a[1])*(1+m)*.5);g.stroke()}};
    face(Lb,Lt,rock[2]);face(Rb,Rt,rock[1]);
    poly(g,flat(Lt.concat(Rt.slice(1),[tb])),rock[0]);
    for(let i=0;i<14;i++){const p=lp(Lt[(R()*n)|0],Rt[1+((R()*n)|0)],R());g.fillStyle=i%2?'rgba(8,6,10,'+r(.1,.22)+')':'rgba(255,246,220,'+r(.05,.12)+')';g.fillRect(p[0]+r(-6,6),p[1]+r(-5,0),r(2,5),r(.8,1.6))}
    g.strokeStyle='rgba(8,7,12,.85)';g.lineWidth=1;g.beginPath();g.moveTo(Lb[0][0],Lb[0][1]);for(const p of Lt)g.lineTo(p[0],p[1]);for(const p of Rt.slice(1))g.lineTo(p[0],p[1]);g.lineTo(Rb[n][0],Rb[n][1]);g.lineTo(Rb[0][0],Rb[0][1]);g.lineTo(Lb[0][0],Lb[0][1]);g.stroke();
    g.strokeStyle='rgba(255,246,220,.22)';g.lineWidth=1;g.beginPath();g.moveTo(Lb[n][0],Lb[n][1]);g.lineTo(Lt[n][0],Lt[n][1]);g.stroke();
    for(let i=0;i<7;i++){const p=lp(Lt[(R()*n)|0],Rt[1+((R()*n)|0)],R());g.fillStyle=P(pal.moss[i%3],r(.55,.85));g.beginPath();g.ellipse(p[0],p[1]+r(-1,1.5),r(2.5,6),r(1.2,2.4),0,0,6.283);g.fill()}
    for(let i=0;i<3;i++){const p=lp(Lt[(R()*n)|0],Lt[n],R());g.strokeStyle=P(pal.moss[0],.55);g.lineWidth=r(1,2);g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]+r(-1,1),p[1]+r(6,H0*.4));g.stroke()}
  })},
 boulder(E,pr,i){const{pal,rock,sp,poly,P}=E;const R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),s=r(pr.s[0],pr.s[1]);
  return sp(44,34,22,27,g=>{g.fillStyle='rgba(0,0,0,.32)';g.beginPath();g.ellipse(24,26,s+5,s*.42,0,0,6.283);g.fill();
    const pts=[];for(let k=0;k<8;k++){const a=k/8*6.283;pts.push(22+Math.cos(a)*s*r(.85,1.12),24-s*.6+Math.sin(a)*s*.62*r(.85,1.1))}
    poly(g,pts,P(rock[1],1),pal.outline);
    const lit=[];for(let k=5;k<=8;k++){lit.push(pts[(k%8)*2],pts[(k%8)*2+1])}lit.push(22,24-s*.6);poly(g,lit,P(rock[0],.9));
    const dk=[];for(let k=1;k<=3;k++){dk.push(pts[k*2],pts[k*2+1])}dk.push(22,24-s*.3);poly(g,dk,P(rock[2],.9));
    g.strokeStyle='rgba(6,5,9,.5)';g.lineWidth=.8;g.beginPath();g.moveTo(22+r(-4,4),24-s*.9);g.lineTo(22+r(-5,5),24-s*.1);g.stroke();
    for(let k=0;k<3;k++){g.fillStyle=P(pal.moss[0],.7);g.beginPath();g.ellipse(22+r(-s*.6,s*.6),24-s*.95+r(0,2),r(2,4.5),r(1,1.8),0,0,6.283);g.fill()}})},
 /* dead tree: a bent trunk that forks, bare limbs, a few twigs, roots at the foot */
 tree(E,pr,i){const{pal,sp}=E,B=pal.bark;const R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),H0=r(pr.h[0],pr.h[1]);
  return sp(76,H0+26,38,H0+18,g=>{g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.ellipse(40,H0+16,16,5,0,0,6.283);g.fill();
    const limb=(x,y,a,len,wd,dp)=>{const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;
      g.lineCap='round';g.strokeStyle=B.ol;g.lineWidth=wd+1.6;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
      g.strokeStyle=dp%2?B.a:B.b;g.lineWidth=wd;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();
      g.strokeStyle=B.hi;g.lineWidth=Math.max(.5,wd*.28);g.beginPath();g.moveTo(x-wd*.2,y);g.lineTo(x2-wd*.2,y2);g.stroke();
      if(dp>0&&len>3){const n=dp>2?2:2+(R()<.4?1:0);for(let k=0;k<n;k++)limb(x2,y2,a+r(-.95,.95)*(k?1:-.6)+(k===1?.2:-.15),len*r(.6,.8),wd*.62,dp-1);}};
    for(let k=0;k<4;k++){g.strokeStyle=B.root;g.lineWidth=3.2;g.lineCap='round';g.beginPath();g.moveTo(38,H0+16);g.lineTo(38+(k-1.5)*8+r(-2,2),H0+19+r(-1,2));g.stroke()}
    limb(38,H0+16,-1.57+r(-.15,.15),H0*r(.3,.4),7.5,4)})},
 /* heather: clumps of short stems with small flowers */
 heath(E,pr,i){const{pal,sp}=E;const R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a);
  return sp(36,22,18,17,g=>{g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(18,16,13,4,0,0,6.283);g.fill();
    for(let k=0;k<22;k++){const x=18+r(-11,11),y=16+r(-3,1),h=r(5,12),a=r(-.5,.5);g.strokeStyle=pal.stem[k%4];g.lineWidth=r(.8,1.5);g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+a*h*.4,y-h*.6,x+a*h,y-h);g.stroke();
      if(k%3===0){g.fillStyle=pal.flower[k%3|0];g.fillRect(x+a*h-1,y-h-1,2.2,2.2)}}})},
 /* fog bank: a flat radial puff, drawn at the page edge */
 fog(E,pr){const{pal,sp}=E;return sp(pr.w,pr.h,pr.w/2,pr.h/2,g=>{g.save();g.translate(80,28);g.scale(1,.34);const q=g.createRadialGradient(0,0,0,0,0,80);for(const s of pal.fog)q.addColorStop(s[0],s[1]);g.fillStyle=q;g.fillRect(-80,-80,160,160);g.restore()})}
};
/* bakes every prop set of DS into {name:[sprites]} */
function deadBake(DS,st){
  const TS=DS.cave?Math.min(TX.ts,1.25):TX.ts,w=STY[st].w,P=(c,o)=>'rgba('+hex2rgb(c).join(',')+','+o+')';
  const mx=(a,b,t)=>{const A=hex2rgb(a),B=hex2rgb(b);return'#'+A.map((v,i)=>('0'+Math.round(v+(B[i]-v)*t).toString(16)).slice(-2)).join('')};
  const rock=(DS.pal.rock||[]).map(q=>mx(w[q[0]],q[1],q[2]));
  const sp=(W0,H0,bx,by,f)=>{const c=mk(Math.ceil(W0*TS),Math.ceil(H0*TS)),g=c.getContext('2d');g.scale(TS,TS);f(g);return{c,w:W0,h:H0,bx,by}};
  const poly=(g,pts,fill,stroke)=>{g.beginPath();g.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)g.lineTo(pts[i],pts[i+1]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=1;g.stroke()}};
  const E={TS,pal:DS.pal,rock,sp,poly,P,mx},out={};
  for(const k in DS.props){const pr=DS.props[k],a=out[k]=[];for(let i=0;i<pr.n;i++)a.push(PAINT[pr.paint](E,pr,i))}
  return out}
/* The world is cut into square pages of 512 world px. Each is painted once into its own canvas and kept, so a frame only blits
   the 4-9 pages on screen (about one screen of pixels, no overdraw) and a new page costs a few ms once, every few steps of walking.
   A page is a full back-to-front render of its own region (ground first, then the props sorted by depth, so a tall crag in front
   is never cut by the ground behind it); a prop that straddles two pages is painted into both, so there is no seam. No part of it
   reads W.seen, so exploring never rebuilds anything: floors and walls simply paint over it. */
const DPG=512;
function deadPage(DS,D,dd,N,pi,pj,sc){
  const M=N+DPAD*2,x0=pi*DPG,y0=pj*DPG,c=mk(Math.ceil(DPG*sc),Math.ceil(DPG*sc)),g=c.getContext('2d');g.scale(sc,sc);
  const at=(x,y)=>{const X=x+DPAD,Y=y+DPAD;return X<0||Y<0||X>=M||Y>=M?60:dd[Y*M+X]};
  const rp=DS.ramp,fg=DS.fog,bands=DS.bands,ng=D.ground.length,F=fg&&D.fog[0],gp=DS.gap;
  const sA=Math.ceil((y0-24)/16),sB=Math.floor((y0+DPG+136)/16),tA=Math.floor((x0-100)/32),tB=Math.ceil((x0+DPG+100)/32);
  for(let pass=0;pass<2;pass++)for(let s=sA;s<=sB;s++){const Y=s*16-y0;
    for(let t=tA+(((s+tA)%2+2)%2);t<=tB;t+=2){const x=(s+t)/2,y=(s-t)/2;let d=at(x,y);if(d<DS.edge&&(x<0||y<0||x>=N||y>=N))d=DS.edge;const X=t*32-x0;let ga=1;if(gp&&d>=gp[0]){ga=1-(d-gp[0])/gp[1];if(ga<=0)continue}
      g.globalAlpha=ga;if(pass===0){if(Y<-20||Y>DPG+20){g.globalAlpha=1;continue}g.drawImage(D.ground[(dh(x,y,1)*ng)|0],X-34,Y-18,68,36);
        if(d<rp.near[0]||d>rp.far[0]){g.fillStyle='rgba('+rp.col+','+(d<rp.near[0]?rp.near[1]:Math.min(rp.far[2],(d-rp.far[0])*rp.far[1]))+')';g.beginPath();g.moveTo(X-33,Y);g.lineTo(X,Y-17);g.lineTo(X+33,Y);g.lineTo(X,Y+17);g.fill()}g.globalAlpha=1;continue}
      const r=dh(x,y,2),r2=dh(x,y,3),px=(dh(x,y,4)-.5)*26,py=(dh(x,y,5)-.5)*8;let S=null;
      for(const b of bands){if(d>=b.d[0]&&d<b.d[1]){for(const q of b.pick)if(r<q[0]){const a=D[q[1]];let k=(r2*a.length)|0;if(DS.props[q[1]].ori){const gx=at(x+1,y)-at(x-1,y),gy=at(x,y+1)-at(x,y-1);k=((r2*(a.length>>1))|0)*2+(Math.abs(gx)>=Math.abs(gy)?1:0)}S=a[k];break}break}}
      if(S){g.globalAlpha=ga;g.drawImage(DS.cave?deadDim(S,d<4?0:d<6?1:d<9?2:3,rp.col):S.c,X+px-S.bx,Y+py+4-S.by,S.w,S.h);g.globalAlpha=1}
      g.globalAlpha=1;if(fg&&d<=fg.dmax&&dh(x,y,6)<fg.p){g.globalAlpha=fg.a[0]+dh(x,y,7)*fg.a[1];g.drawImage(F.c,X-F.w/2+px*fg.dx,Y+fg.dy,F.w,F.h);g.globalAlpha=1}}}
  return c}
/* the pages that touch the screen: calls f(pi,pj) for each, in raster order */
function deadVisit(f){const wx0=cx-VW/2,wy0=cy-VH*.44;
  for(let pj=Math.floor(wy0/DPG);pj<=Math.floor((wy0+VH)/DPG);pj++)for(let pi=Math.floor(wx0/DPG);pi<=Math.floor((wx0+VW)/DPG);pi++)f(pi,pj,wx0,wy0)}
function deadSet(DS){const st=TX.style;if(!TX.dead)TX.dead=deadBake(DS,st);const D=TX.dead,sc=Math.min(1.25,DPR*ZM),C=deadCache(D,sc);C.n++;return{D,sc,C,dd:deadDist(C)}}
function deadGet(DS,S,pi,pj){const C=S.C,k=pi+','+pj;let p=C.m.get(k);if(!p){p={c:deadPage(DS,S.D,S.dd,W.N,pi,pj,S.sc)};C.m.set(k,p)}p.u=C.n;return p}
/* blits the pages that touch the screen into the floor raster g (world units, SX/SY space) */
function deadArt(g,DS){
  const S=deadSet(DS),C=S.C,sc=S.sc;
  deadVisit((pi,pj,wx0,wy0)=>{const p=deadGet(DS,S,pi,pj);
    const X=Math.round((pi*DPG-wx0)*sc)/sc,Y=Math.round((pj*DPG-wy0)*sc)/sc,a=Math.max(0,-X),b=Math.max(0,-Y),w=Math.min(DPG,VW-X)-a,h=Math.min(DPG,VH-Y)-b;
    if(w>0&&h>0)g.drawImage(p.c,a*p.c.width/DPG,b*p.c.height/DPG,w*p.c.width/DPG,h*p.c.height/DPG,X+a,Y+b,w,h)});
  /* cap: drop the least recently used pages that are not on screen now */
  if(C.m.size>DEADCAP){const old=[...C.m].filter(e=>e[1].u<C.n).sort((a,b)=>a[1].u-b[1].u);for(const e of old){if(C.m.size<=DEADCAP)break;C.m.delete(e[0])}}}
/* on zone enter: bake the sprites and the pages around the spawn, so the first frame does not pay for them */
const deadFor=z=>{const D=DEAD[z.style];return D&&(!D.only||D.only.includes(W.zi))?D:null};
function deadPrime(){const DS=W&&W.z&&deadFor(W.z);if(!DS||!P)return;cx=(P.x-P.y)*32;cy=(P.x+P.y)*16;const S=deadSet(DS);const f=mk(1,1).getContext('2d');deadVisit((pi,pj)=>{f.drawImage(deadGet(DS,S,pi,pj).c,0,0,1,1)})}  /* the 1px blit makes the browser rasterise each page now, not on the first frame */
/* ===== mode:'mass' (dungeons): the black beyond the wall ring becomes solid mass: rock, concrete, masonry, plaster or etched slab,
   with blocks and columns/pipes standing out of it. Same pages, same distance field, same cache as the scene mode. Data per style:
   pal {lo,mid,hi,ol,acc,kind}: three tones, outline, glow accent (or null) and the surface kind for MSURF. gap [d,fade]: past d tiles the
   mass fades out and the sky backdrop (Cloud zones) shows through. */
function msurf(g,k,w,h,R,E,o){
  const r=(a,b)=>a+R()*(b-a),A=E.P,pal=E.pal,acc=pal.acc,dk=a=>'rgba(0,0,0,'+a+')',lt=a=>'rgba(255,250,235,'+a+')';
  g.fillStyle=o.base;g.fillRect(0,0,w,h);
  const mottle=(n,sc)=>{for(let i=0;i<n;i++){g.fillStyle=i%2?dk(r(.07,.17)):lt(r(.04,.1));g.beginPath();g.ellipse(r(0,w),r(0,h),r(2,w*sc),r(1.5,h*sc),r(0,3),0,6.283);g.fill()}};
  const glowLine=pts=>{g.lineJoin='round';g.strokeStyle=A(acc,.16);g.lineWidth=3.4;g.beginPath();pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.stroke();g.strokeStyle=A(acc,.62);g.lineWidth=1;g.stroke()};
  if(k==='rock'){let y=r(0,3);while(y<h){const th=r(3,8);g.fillStyle=R()<.5?dk(r(.1,.24)):lt(r(.05,.12));g.beginPath();g.moveTo(0,y);g.lineTo(w,y+r(-2,2));g.lineTo(w,y+th);g.lineTo(0,y+th+r(-1,1));g.fill();g.fillStyle=dk(.28);g.fillRect(0,y,w,.7);y+=th}
    for(let i=0;i<3;i++){let x=r(2,w-2),y2=r(0,h*.4);g.strokeStyle=dk(.5);g.lineWidth=.8;g.beginPath();g.moveTo(x,y2);for(let j=0;j<5;j++){x+=r(-3,3);y2+=r(2,h*.14);g.lineTo(x,y2)}g.stroke()}
    for(let i=0;i<Math.ceil(w*h/90);i++){g.fillStyle=i%3?dk(r(.15,.3)):lt(r(.06,.14));g.fillRect(r(0,w),r(0,h),r(1,3.4),r(.8,1.5))}
    if(acc&&o.vein){let x=r(0,w*.3),y=r(0,h);const p=[[x,y]];for(let j=0;j<5;j++){x+=w/5;y+=r(-5,5);p.push([x,y])}glowLine(p)}}
  else if(k==='brick'){const bh=o.bh||5,bw=o.bw||11;let row=0;for(let y=0;y<h;y+=bh,row++){for(let x=-(row%2)*bw/2;x<w;x+=bw){g.fillStyle=R()<.5?dk(r(0,.26)):lt(r(0,.12));g.fillRect(x,y,bw,bh);if(R()<.04){g.fillStyle=dk(.35);g.fillRect(x+1,y+1,bw-2,bh-2)}g.fillStyle=dk(.5);g.fillRect(x,y,.8,bh)}g.fillStyle=dk(.55);g.fillRect(0,y,w,.9);g.fillStyle=lt(.05);g.fillRect(0,y+1,w,.7)}
    mottle(3,.4)}
  else if(k==='panel'){const cw=o.cw||r(14,22),ch=o.ch||r(14,22);g.fillStyle=lt(.0);
    for(let y=0;y<=h;y+=ch)for(let x=0;x<=w;x+=cw){g.fillStyle=R()<.4?dk(r(.05,.16)):lt(r(.03,.1));g.fillRect(x,y,cw,ch)}
    for(let y=0;y<=h;y+=ch){g.fillStyle=dk(.5);g.fillRect(0,y,w,.9);g.fillStyle=lt(.07);g.fillRect(0,y+1,w,.7)}
    for(let x=0;x<=w;x+=cw){g.fillStyle=dk(.5);g.fillRect(x,0,.9,h);g.fillStyle=lt(.07);g.fillRect(x+1,0,.7,h);for(let y=0;y<=h;y+=ch){g.fillStyle=lt(.2);g.fillRect(x+2,y+2,1.3,1.3);g.fillStyle=dk(.4);g.fillRect(x+2.6,y+2.6,1,1)}}
    mottle(5,.3);for(let i=0;i<3;i++){const x=r(2,w-2);g.fillStyle=dk(r(.06,.14));g.fillRect(x,r(0,h*.3),r(1,2.4),r(h*.2,h*.7))}
    if(acc&&o.vein){const y=r(h*.25,h*.7);g.fillStyle=A(acc,.18);g.fillRect(0,y-1.6,w,4.2);g.fillStyle=A(acc,.6);g.fillRect(0,y,w,1.1)}}
  else if(k==='circuit'){mottle(4,.35);g.strokeStyle=dk(.4);g.lineWidth=.8;for(let x=0;x<=w;x+=8){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<=h;y+=8){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
    if(acc)for(let i=0;i<3;i++){let x=Math.round(r(0,w)/8)*8,y=Math.round(r(0,h)/8)*8;const p=[[x,y]];for(let j=0;j<4;j++){if(j%2)y+=Math.round(r(-2,2))*8;else x+=Math.round(r(-3,3))*8;p.push([x,y])}
      g.lineJoin='miter';g.strokeStyle=A(acc,.12);g.lineWidth=3;g.beginPath();p.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));g.stroke();g.strokeStyle=A(acc,.5);g.lineWidth=.9;g.stroke();g.fillStyle=A(acc,.8);const q=p[p.length-1];g.fillRect(q[0]-1.3,q[1]-1.3,2.6,2.6)}}
  else{mottle(9,.5);const c=o.cell||8;g.strokeStyle=dk(.1);g.lineWidth=.7;for(let x=0;x<=w;x+=c){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke()}for(let y=0;y<=h;y+=c){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke()}
    for(let i=0;i<4;i++){g.strokeStyle=dk(r(.06,.14));g.lineWidth=.8;const x=r(0,w),y=r(0,h);g.beginPath();g.moveTo(x,y);g.lineTo(x+r(-6,6),y+r(2,7));g.stroke()}
    if(acc&&o.vein){const y=r(h*.2,h*.7);g.fillStyle=A(acc,.55);g.fillRect(0,y,w,2.4);g.fillStyle=dk(.25);for(let x=2;x<w;x+=4)g.fillRect(x,y,.8,2.4)}}}
PAINT.slab=(E,pr,v)=>{const{TS,pal,P,mx}=E;const R=mulberry32(pr.seed+v),c=mk(68*TS,36*TS),g=c.getContext('2d');g.scale(TS,TS);g.translate(1,1);
  g.beginPath();g.moveTo(33,-1);g.lineTo(67,17);g.lineTo(33,35);g.lineTo(-1,17);g.closePath();g.clip();
  g.save();g.transform(1,.5,-1,.5,33,0);msurf(g,pal.kind,33,33,R,E,{base:mx(pal.lo,pal.mid,.55+.4*v/Math.max(1,pr.n-1)),vein:v%3===1,bw:11,bh:5.5,cw:16.5,ch:16.5});g.restore();
  g.strokeStyle='rgba(255,250,235,.17)';g.lineWidth=1;g.beginPath();g.moveTo(1,17);g.lineTo(33,1);g.lineTo(65,17);g.stroke();g.strokeStyle='rgba(0,0,0,.42)';g.beginPath();g.moveTo(1,17);g.lineTo(33,33);g.lineTo(65,17);g.stroke();return c};
/* block: a stepped prism of the mass, dark left face, mid right face, light top; AO at the foot */
PAINT.block=(E,pr,i)=>{const{pal,sp,mx,P}=E;const R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),s0=r(pr.s[0],pr.s[1]),H0=pr.h[0]+i*pr.h[1];
  const bx=Math.ceil(s0)+8,by=H0*1.55+s0+8,hw=Math.ceil(s0)*2+16;
  return sp(hw,by+10,bx,by,g=>{
    const shade=(A,B)=>mx(pal.lo,pal.hi,A)+'';g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(bx+2,by-s0*.3,s0+6,s0*.55+3,0,0,6.283);g.fill();
    const tier=(X,Y,s,H,k)=>{
      const face=(tf,w,h,base,dim,o)=>{g.save();g.transform(...tf);g.beginPath();g.rect(0,0,w,h);g.clip();msurf(g,pal.kind,w,h,R,E,Object.assign({base},o));
        g.fillStyle='rgba(0,0,0,'+dim+')';g.fillRect(0,0,w,h);const q=g.createLinearGradient(0,0,0,h);q.addColorStop(.55,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(0,0,0,.4)');g.fillStyle=q;g.fillRect(0,0,w,h);g.restore()};
      face([1,.5,0,1,X-s,Y-s/2-H],s,H,mx(pal.lo,pal.mid,.6),.38,{vein:false,bw:11,bh:5.5,cw:s/2,ch:H/Math.max(2,Math.round(H/16))});
      face([1,-.5,0,1,X,Y-H],s,H,mx(pal.mid,pal.hi,.35),.0,{vein:k%2===0,bw:11,bh:5.5,cw:s/2,ch:H/Math.max(2,Math.round(H/16))});
      g.save();g.transform(1,.5,-1,.5,X,Y-s-H);g.beginPath();g.rect(0,0,s,s);g.clip();msurf(g,pal.kind==='circuit'||pal.kind==='panel'?pal.kind:'plain',s,s,R,E,{base:mx(pal.mid,pal.hi,1),cell:6,cw:s/2,ch:s/2});g.restore();
      const ol='rgba(0,0,0,.9)';g.strokeStyle=ol;g.lineWidth=1;g.lineJoin='round';
      g.beginPath();g.moveTo(X-s,Y-s/2-H);g.lineTo(X-s,Y-s/2);g.lineTo(X,Y);g.lineTo(X+s,Y-s/2);g.lineTo(X+s,Y-s/2-H);g.lineTo(X,Y-s-H);g.closePath();g.stroke();
      g.beginPath();g.moveTo(X-s,Y-s/2-H);g.lineTo(X,Y-H);g.lineTo(X+s,Y-s/2-H);g.moveTo(X,Y-H);g.lineTo(X,Y);g.stroke();
      g.strokeStyle='rgba(255,250,235,.4)';g.beginPath();g.moveTo(X-s+.5,Y-s/2-H+.5);g.lineTo(X,Y-H+.5);g.lineTo(X+s-.5,Y-s/2-H+.5);g.stroke();g.beginPath();g.moveTo(X-.5,Y-H+1);g.lineTo(X-.5,Y-1);g.stroke()};
    tier(bx,by,s0,H0,0);if(pr.tiers>1&&R()<.8){tier(bx+r(-2,2),by-H0,s0*r(.5,.7),H0*r(.3,.55),1)}})};
/* column: round concrete/stone column (kind 'col') or a bundle of pipes (kind 'pipe') with flanges, rivets and a lamp/valve glow */
PAINT.column=(E,pr,i)=>{const{pal,sp,mx,P}=E;const R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),H0=pr.h[0]+i*pr.h[1];
  return sp(44,H0+28,22,H0+20,g=>{
    g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(23,H0+19,15,5,0,0,6.283);g.fill();
    const cyl=(x,w,y0,y1,k)=>{const q=g.createLinearGradient(x-w/2,0,x+w/2,0);q.addColorStop(0,mx(pal.lo,'#000000',.35));q.addColorStop(.35,mx(pal.mid,pal.hi,.5));q.addColorStop(.6,mx(pal.mid,pal.hi,.1));q.addColorStop(1,mx(pal.lo,'#000000',.2));
      g.fillStyle=q;g.fillRect(x-w/2,y0,w,y1-y0);g.strokeStyle='rgba(0,0,0,.7)';g.lineWidth=1;g.strokeRect(x-w/2,y0,w,y1-y0);
      g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.ellipse(x,y1,w/2,w*.22,0,0,3.1416);g.fill();g.fillStyle=mx(pal.mid,pal.hi,.7);g.beginPath();g.ellipse(x,y0,w/2,w*.22,0,0,6.283);g.fill();g.stroke();
      if(k==='pipe'){for(let y=y0+r(5,9);y<y1-4;y+=r(13,20)){g.fillStyle='rgba(0,0,0,.45)';g.fillRect(x-w/2-1.5,y,w+3,3.2);g.fillStyle='rgba(255,250,235,.2)';g.fillRect(x-w/2-1.5,y,w+3,1);g.fillStyle='rgba(255,250,235,.3)';g.fillRect(x-w/2,y+1,1.2,1.2);g.fillRect(x+w/2-1.5,y+1,1.2,1.2)}}
      else{for(let f=-1;f<=1;f++){g.fillStyle='rgba(0,0,0,.28)';g.fillRect(x+f*w*.28-.4,y0+3,.9,y1-y0-6)}}};
    const by=H0+18;
    if(pr.kind==='pipe'){const n=2+(i%2),xs=[16,24,30];for(let k=0;k<n;k++)cyl(xs[k]-(n-2)*3,r(6,9),by-H0*r(.7,1),by,'pipe');
      if(pal.acc){g.fillStyle=P(pal.acc,.25);g.beginPath();g.arc(23,by-H0*.55,6,0,6.283);g.fill();g.fillStyle=P(pal.acc,.9);g.fillRect(21.5,by-H0*.55-1.5,3,3)}}
    else{g.fillStyle=mx(pal.lo,pal.mid,.7);g.fillRect(6,by-4,32,6);g.strokeStyle='rgba(0,0,0,.7)';g.strokeRect(6,by-4,32,6);cyl(22,18,by-H0,by-4,'col');g.fillStyle=mx(pal.mid,pal.hi,.5);g.fillRect(4,by-H0-5,36,6);g.strokeRect(4,by-H0-5,36,6);g.fillStyle='rgba(255,250,235,.2)';g.fillRect(4,by-H0-5,36,1.4)}})};
/* ===== cave rock (mass styles with cave:1): irregular outcrops, faceted planes with strata and cracks, stalagmite spires,
   rubble, a cracked rock floor. Seeded mulberry32 only; props at distance are dimmed by lazy shade variants (deadDim). */
const CV=(E)=>{const{pal,mx}=E,gy=c=>{const a=hex2rgb(c),l=Math.round(a[0]*.3+a[1]*.59+a[2]*.11);return'#'+[l,l,l].map(v=>('0'+v.toString(16)).slice(-2)).join('')},k=pal.gray==null?.18:pal.gray,dz=c=>mx(c,gy(c),k);
  return{lo:mx(dz(pal.lo),dz(pal.mid),.3),mid:mx(dz(pal.mid),dz(pal.hi),.55),hi:mx(dz(pal.hi),'#ffffff',.22),moss:pal.moss||mx(pal.mid,'#3f5c3a',.55),acc:pal.acc}};
const jl=(R,x0,y0,x1,y1,n,a)=>{const o=[[x0,y0]],dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy)||1;for(let i=1;i<n;i++){const t=i/n,q=(R()-.5)*2*a;o.push([x0+dx*t-dy/L*q,y0+dy*t+dx/L*q])}o.push([x1,y1]);return o};
const pth=(g,p,cl)=>{g.beginPath();p.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1]));if(cl)g.closePath()};
const cl01=v=>v<0?0:v>1?1:v;
/* small faceted stone: lit upper-right facet, dark lower-left, outline */
function cpebble(g,C,mx,R,x,y,s,tone){const r=(a,b)=>a+R()*(b-a),n=7,p=[];for(let k=0;k<n;k++){const a=k/n*6.283;p.push([x+Math.cos(a)*s*r(.75,1.15),y+Math.sin(a)*s*.62*r(.75,1.15)-s*.45])}
  const base=mx(C.lo,C.mid,tone);pth(g,p,1);g.fillStyle=base;g.fill();
  pth(g,[p[5],p[6],p[0],p[1],[x,y-s*.45]],1);g.fillStyle=mx(base,C.hi,.45);g.fill();
  pth(g,[p[2],p[3],p[4],[x,y-s*.45]],1);g.fillStyle='rgba(0,0,0,.32)';g.fill();
  pth(g,p,1);g.strokeStyle='rgba(5,4,8,.7)';g.lineWidth=.8;g.lineJoin='round';g.stroke()}
PAINT.outcrop=(E,pr,i)=>{const{sp,mx,P}=E,C=CV(E),R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),t=pr.n>1?i/(pr.n-1):0;
  const w=pr.w[0]+(pr.w[1]-pr.w[0])*(t+R())/2,h=pr.h[0]+(pr.h[1]-pr.h[0])*(((1-t)*.35+t*.65)+R()*.35),W0=Math.ceil(w)+34,H0=Math.ceil(h)+34,bx=W0/2,by=H0-14,xl=bx-w/2,xr=bx+w/2;
  return sp(W0,H0,bx,by,g=>{
    const foot=x=>by+4-4*Math.pow((x-bx)/(w/2+8),2),pk=pr.pk[0]+((R()*(pr.pk[1]-pr.pk[0]+1))|0),m=pk*2,rg=[],lean=r(-.18,.18);
    for(let j=0;j<=m;j++){const u=j/m,x=xl+w*u+(j&&j<m?r(-w*.035,w*.035):0),env=Math.pow(Math.sin(Math.PI*(.1+.8*u)),.75),pkh=j%2?r(.72,1):r(.32,.6);rg.push([x,by-h*env*(j===0||j===m?r(.35,.7):pkh)*(1+lean*(u-.5))])}
    const ridge=[];for(let j=0;j<rg.length;j++){ridge.push(rg[j]);if(j<m){const a=rg[j],b=rg[j+1],L=Math.hypot(b[0]-a[0],b[1]-a[1]);const q=jl(R,a[0],a[1],b[0],b[1],Math.max(2,Math.round(L/9)),L*.15);for(let k=1;k<q.length-1;k++)ridge.push(q[k])}}
    const L0=ridge[0],R0=ridge[ridge.length-1],sil=[[xl-r(3,8),foot(xl)]];sil.push([xl-r(1,6),by-h*r(.12,.25)]);sil.push([L0[0]-r(0,3),L0[1]]);
    for(const q of ridge)sil.push(q);sil.push([R0[0]+r(0,3),R0[1]]);sil.push([xr+r(1,6),by-h*r(.12,.25)]);sil.push([xr+r(3,8),foot(xr)]);
    const nb=5;for(let k=1;k<nb;k++){const x=xr-(xr-xl)*k/nb;sil.push([x+r(-3,3),foot(x)+r(-1.5,1.5)])}
    /* shadow */
    g.fillStyle='rgba(0,0,0,.34)';g.beginPath();g.ellipse(bx+4,by+2,w/2+9,8,0,0,6.283);g.fill();
    g.save();pth(g,sil,1);g.clip();
    let q0=g.createLinearGradient(0,by-h,0,by+6);q0.addColorStop(0,mx(C.mid,C.hi,.55));q0.addColorStop(1,C.lo);g.fillStyle=q0;g.fillRect(0,0,W0,H0);
    /* facets between ridge points: lit when the ridge falls to the right, leaning edges */
    for(let j=0;j<ridge.length-1;j++){const a=ridge[j],b=ridge[j+1],dx=Math.max(3,b[0]-a[0]),s=(b[1]-a[1])/dx,tl=cl01(.46+s*.55+r(-.2,.2)),la=r(-11,11),lb=r(-11,11),top=Math.min(a[1],b[1]);
      const q=g.createLinearGradient(0,top,0,by+6);q.addColorStop(0,mx(C.mid,C.hi,tl*1.1));q.addColorStop(.5,mx(C.lo,C.mid,.3+tl*.7));q.addColorStop(1,mx(C.lo,'#000000',.45));
      pth(g,[a,b,[b[0]+lb,by+8],[a[0]+la,by+8]],1);g.fillStyle=q;g.fill();
      if(R()<.55){g.strokeStyle='rgba(4,3,7,'+(.1+.2*R())+')';g.lineWidth=.9;g.beginPath();g.moveTo(a[0],a[1]);const mid=jl(R,a[0],a[1],a[0]+la*1.6,by-r(h*.05,h*.5),5,5);mid.forEach(p=>g.lineTo(p[0],p[1]));g.stroke()}
      for(let k=0;k<2;k++){const u=r(.1,.9),v=r(.1,.9),pa=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u],pb=[a[0]+(b[0]-a[0])*v,a[1]+(b[1]-a[1])*v],d1=r(.25,.8),d2=r(.25,.8);
        pth(g,[pa,pb,[pb[0]+lb*d2,pb[1]+(by-pb[1])*d2],[pa[0]+la*d1,pa[1]+(by-pa[1])*d1]],1);g.fillStyle=k?'rgba(255,240,215,'+r(.06,.15)+')':'rgba(0,0,0,'+r(.1,.22)+')';g.fill()}}
    /* strata: slanted, jagged, in alternating dark/light pairs; bands tint */
    const ns=Math.max(3,Math.round(h/11));for(let k=0;k<ns;k++){const y=by-h*(k+r(.3,.9))/ns,sl=r(-.14,.14),sa=r(xl-8,bx),sb=Math.min(xr+8,sa+r(w*.25,w*.7)),p=jl(R,sa,y,sb,y+(sb-sa)*sl,Math.ceil((sb-sa)/9),1.3);
      pth(g,p);g.strokeStyle='rgba(0,0,0,'+r(.22,.4)+')';g.lineWidth=r(.7,1.2);g.stroke();g.save();g.translate(0,1.4);pth(g,p);g.strokeStyle='rgba(255,243,220,'+r(.05,.1)+')';g.lineWidth=.8;g.stroke();g.restore();
      if(k%2){pth(g,p.concat(p.map(q=>[q[0],q[1]+r(3,6)]).reverse()),1);g.fillStyle='rgba(0,0,0,'+r(.05,.12)+')';g.fill()}}
    /* cracks: zig-zag from the notches down, with a branch and a pale lip */
    const nc=3+((w/22)|0);for(let k=0;k<nc;k++){const v=ridge[((R()*ridge.length)|0)];let x=v[0]+r(-2,2),y=v[1]+r(2,8);const pts=[[x,y]],st=3+((R()*4)|0);for(let s=0;s<st;s++){x+=r(-5,5);y+=r(4,10);pts.push([x,y])}
      pth(g,pts);g.strokeStyle='rgba(2,2,5,'+r(.5,.8)+')';g.lineWidth=r(.8,1.5);g.lineJoin='round';g.stroke();g.save();g.translate(1.2,0);pth(g,pts);g.strokeStyle='rgba(255,243,220,.09)';g.lineWidth=.7;g.stroke();g.restore();
      if(R()<.6&&pts.length>2){const b=pts[1+((R()*(pts.length-2))|0)],q=[b,[b[0]+r(-9,9),b[1]+r(2,6)],[b[0]+r(-12,12),b[1]+r(6,12)]];pth(g,q);g.strokeStyle='rgba(2,2,5,.55)';g.lineWidth=.8;g.stroke()}}
    /* angular chips, never round */
    for(let k=0;k<Math.round(w*h/260);k++){const x=r(xl,xr),y=r(by-h,by),s=r(2,5);pth(g,[[x,y],[x+s*r(.6,1.4),y+r(-1.5,1.5)],[x+r(-1,2),y+s*r(.5,1)]],1);g.fillStyle=k%2?'rgba(0,0,0,'+r(.1,.22)+')':'rgba(255,243,220,'+r(.04,.1)+')';g.fill()}
    /* mineral vein */
    if(C.acc&&R()<(pr.vein==null?.5:pr.vein)){const y0=by-h*r(.15,.4),p=jl(R,xl,y0,xr,y0-r(h*.1,h*.5),7,4);g.lineJoin='round';pth(g,p);g.strokeStyle=P(C.acc,.1);g.lineWidth=3.2;g.stroke();g.strokeStyle=P(C.acc,.42);g.lineWidth=.8;g.stroke();
      for(let k=0;k<3;k++){const b=p[1+((R()*(p.length-2))|0)];pth(g,[b,[b[0]+r(-6,6),b[1]-r(3,8)]]);g.strokeStyle=P(C.acc,.4);g.lineWidth=.7;g.stroke()}}
    /* moss pools in the notches and drips */
    for(let j=2;j<ridge.length-1;j+=2){if(R()<.7){const v=ridge[j],n=2+((R()*2)|0);for(let k=0;k<n;k++){g.fillStyle=P(C.moss,r(.35,.7));g.beginPath();g.ellipse(v[0]+r(-6,6),v[1]+r(1,4),r(2.5,6),r(1,2.2),r(-.3,.3),0,6.283);g.fill()}
      g.strokeStyle=P(C.moss,.45);g.lineWidth=r(.8,1.6);g.beginPath();g.moveTo(v[0]+r(-3,3),v[1]+3);g.lineTo(v[0]+r(-3,3),v[1]+r(6,h*.3));g.stroke()}}
    for(let k=0;k<3;k++){g.fillStyle=P(C.moss,r(.12,.25));g.beginPath();g.ellipse(r(xl,xr),by-r(0,h*.2),r(5,12),r(1.5,3),0,0,6.283);g.fill()}
    /* ridge light and shadow */
    for(let j=0;j<ridge.length-1;j++){const a=ridge[j],b=ridge[j+1];g.strokeStyle=b[1]>a[1]?'rgba(255,240,215,.3)':'rgba(0,0,0,.22)';g.lineWidth=1;g.beginPath();g.moveTo(a[0],a[1]+.8);g.lineTo(b[0],b[1]+.8);g.stroke()}
    /* foot AO and distance gradient inside the mass */
    let q1=g.createLinearGradient(0,by-h*.45,0,by+8);q1.addColorStop(0,'rgba(0,0,0,0)');q1.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=q1;g.fillRect(0,by-h*.45,W0,h*.45+14);
    g.restore();
    g.strokeStyle='rgba(5,4,8,.9)';g.lineWidth=1.1;g.lineJoin='bevel';pth(g,sil,1);g.stroke();
    /* a ledge with stalactites */
    if(pr.hang&&R()<pr.hang){const sd=R()<.5?-1:1,ly=by-h*r(.28,.5),ex=sd<0?xl-3:xr+3,e1=ex+sd*r(9,15),dn=r(5,8);
      pth(g,[[ex-sd*5,ly-2],[e1,ly+r(-3,0)],[e1-sd*r(1,3),ly+dn],[ex-sd*8,ly+dn+r(3,6)]],1);g.fillStyle=mx(C.lo,C.mid,.5);g.fill();g.strokeStyle='rgba(5,4,8,.9)';g.lineWidth=1;g.stroke();
      g.strokeStyle='rgba(255,240,215,.25)';g.beginPath();g.moveTo(ex-sd*5,ly-2);g.lineTo(e1,ly);g.stroke();
      const ns2=3+((R()*3)|0);for(let k=0;k<ns2;k++){const x=ex-sd*6+sd*(k+R()*.6)*(e1-ex+sd*6)/(sd*ns2),y=ly+dn+1,len=r(5,14),bw=r(1.4,2.6);
        pth(g,[[x-bw,y-1],[x+bw,y-1],[x+r(-.8,.8),y+len]],1);g.fillStyle=mx(C.lo,C.mid,.45);g.fill();pth(g,[[x,y-1],[x+bw,y-1],[x+r(-.8,.8),y+len]],1);g.fillStyle='rgba(255,240,215,.14)';g.fill();pth(g,[[x-bw,y-1],[x+bw,y-1],[x,y+len]],1);g.strokeStyle='rgba(5,4,8,.7)';g.lineWidth=.7;g.stroke()}}
    /* rubble at the foot */
    const nr=3+((w/20)|0);for(let k=0;k<nr;k++){const x=r(xl-9,xr+9);cpebble(g,C,mx,R,x,foot(x)+r(1,5),r(2,5.5),r(.25,.65))}
  })};
PAINT.spire=(E,pr,i)=>{const{sp,mx,P}=E,C=CV(E),R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),n=3+((R()*3)|0),hm=pr.h[0]+(pr.h[1]-pr.h[0])*(pr.n>1?i/(pr.n-1):0),H0=Math.ceil(hm)+30,W0=72,bx=36,by=H0-12;
  return sp(W0,H0,bx,by,g=>{g.fillStyle='rgba(0,0,0,.34)';g.beginPath();g.ellipse(bx+3,by+1,26,7,0,0,6.283);g.fill();
    const sp2=[];for(let k=0;k<n;k++)sp2.push({x:bx+(k-(n-1)/2)*r(8,14)+r(-3,3),y:by+r(-6,4),bw:r(4,9),h:hm*(k===((n/2)|0)?r(.85,1):r(.35,.78)),tx:r(-4,4)});
    sp2.sort((a,b)=>a.y-b.y);
    for(const s of sp2){const tx=s.x+s.tx,ty=s.y-s.h,c1=r(.2,.4),L=[[s.x-s.bw,s.y],[s.x-s.bw*.7+(tx-s.x)*c1,s.y-s.h*.45],[tx,ty]],Rr=[[tx,ty],[s.x+s.bw*.75+(tx-s.x)*c1,s.y-s.h*.4],[s.x+s.bw,s.y]];
      g.beginPath();g.moveTo(L[0][0],L[0][1]);g.quadraticCurveTo(L[1][0],L[1][1],L[2][0],L[2][1]);g.quadraticCurveTo(Rr[1][0],Rr[1][1],Rr[2][0],Rr[2][1]);g.quadraticCurveTo(s.x,s.y+s.bw*.45,L[0][0],L[0][1]);g.closePath();
      g.save();g.clip();const q=g.createLinearGradient(s.x-s.bw,0,s.x+s.bw,0);q.addColorStop(0,mx(C.lo,C.mid,.25));q.addColorStop(.5,mx(C.mid,C.hi,.25));q.addColorStop(1,mx(C.mid,C.hi,.7));g.fillStyle=q;g.fillRect(s.x-s.bw-4,ty-2,s.bw*2+8,s.h+s.bw);
      g.fillStyle='rgba(0,0,0,.4)';pth(g,[[tx,ty],[s.x-s.bw-3,s.y+4],[s.x+r(-1,1),s.y+4]],1);g.fill();
      const ns=3+((R()*4)|0);for(let k=0;k<ns;k++){const y=s.y-s.h*r(.12,.8);g.strokeStyle='rgba(0,0,0,'+r(.25,.45)+')';g.lineWidth=.8;g.beginPath();g.moveTo(s.x-s.bw*2,y+r(-1,2));g.lineTo(s.x+s.bw*2,y+r(-2,1));g.stroke()}
      if(C.acc&&R()<.25){g.strokeStyle=P(C.acc,.55);g.lineWidth=.9;pth(g,jl(R,s.x-s.bw,s.y-s.h*.3,s.x+s.bw,s.y-s.h*.5,4,2));g.stroke()}
      const lg=g.createLinearGradient(0,s.y-s.h*.3,0,s.y+4);lg.addColorStop(0,'rgba(0,0,0,0)');lg.addColorStop(1,'rgba(0,0,0,.5)');g.fillStyle=lg;g.fillRect(s.x-s.bw-4,s.y-s.h*.3,s.bw*2+8,s.h*.3+6);
      g.fillStyle=P(C.moss,.45);g.beginPath();g.ellipse(s.x+r(-2,2),s.y-r(1,6),s.bw*.8,1.6,0,0,6.283);g.fill();g.restore();
      g.beginPath();g.moveTo(L[0][0],L[0][1]);g.quadraticCurveTo(L[1][0],L[1][1],L[2][0],L[2][1]);g.quadraticCurveTo(Rr[1][0],Rr[1][1],Rr[2][0],Rr[2][1]);g.strokeStyle='rgba(5,4,8,.9)';g.lineWidth=1;g.stroke();
      g.strokeStyle='rgba(255,240,215,.3)';g.beginPath();g.moveTo(tx,ty+1);g.quadraticCurveTo(Rr[1][0]-1,Rr[1][1],s.x+s.bw-1,s.y-2);g.stroke()}
    for(let k=0;k<6;k++){const x=bx+r(-26,26);cpebble(g,C,mx,R,x,by+r(0,6),r(1.8,4.5),r(.25,.6))}})};
PAINT.rubble=(E,pr,i)=>{const{sp,mx,P}=E,C=CV(E),R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),n=3+((R()*4)|0);
  return sp(64,40,32,32,g=>{g.fillStyle='rgba(0,0,0,.34)';g.beginPath();g.ellipse(33,30,24,6.5,0,0,6.283);g.fill();
    const bs=[];for(let k=0;k<n;k++)bs.push({x:32+r(-17,17),y:30+r(-4,2),s:r(4,pr.s||12)*(k?1:1.3)});bs.sort((a,b)=>a.y-b.y);
    for(const b of bs){cpebble(g,C,mx,R,b.x,b.y,b.s,r(.25,.7));if(b.s>7){g.strokeStyle='rgba(2,2,5,.55)';g.lineWidth=.8;pth(g,jl(R,b.x+r(-3,3),b.y-b.s*.9,b.x+r(-4,4),b.y-b.s*.1,3,1.5));g.stroke();g.fillStyle=P(C.moss,.55);g.beginPath();g.ellipse(b.x+r(-3,3),b.y-b.s*.85,b.s*.5,1.5,0,0,6.283);g.fill()}}
    for(let k=0;k<7;k++)cpebble(g,C,mx,R,32+r(-26,26),31+r(-1,6),r(1,2.4),r(.2,.6))})};
PAINT.cfloor=(E,pr,v)=>{const{TS,mx,P}=E,C=CV(E),R=mulberry32(pr.seed+v),r=(a,b)=>a+R()*(b-a),c=mk(68*TS,36*TS),g=c.getContext('2d');g.scale(TS,TS);g.translate(1,1);
  g.beginPath();g.moveTo(33,-1);g.lineTo(67,17);g.lineTo(33,35);g.lineTo(-1,17);g.closePath();g.clip();
  g.fillStyle=mx(C.lo,C.mid,.15+.3*v/Math.max(1,pr.n-1));g.fillRect(0,0,68,36);
  g.save();g.transform(1,.5,-1,.5,33,0);
  for(let k=0;k<10;k++){const x=r(-2,35),y=r(-2,35),s=r(4,9),p=[];for(let j=0;j<6;j++){const a=j/6*6.283+r(-.3,.3);p.push([x+Math.cos(a)*s*r(.7,1.2),y+Math.sin(a)*s*r(.7,1.2)])}
    pth(g,p,1);g.fillStyle=k%2?'rgba(0,0,0,'+r(.08,.2)+')':'rgba(255,243,220,'+r(.025,.07)+')';g.fill();g.strokeStyle='rgba(0,0,0,'+r(.2,.4)+')';g.lineWidth=.7;g.lineJoin='round';g.stroke()}
  for(let k=0;k<3;k++){let x=r(2,31),y=r(2,31);const p=[[x,y]];for(let j=0;j<5;j++){x+=r(-4,4);y+=r(1,4.5);p.push([x,y])}pth(g,p);g.strokeStyle='rgba(2,2,5,.5)';g.lineWidth=.8;g.stroke()}
  for(let k=0;k<2;k++){g.fillStyle=P(C.moss,r(.12,.26));g.beginPath();g.ellipse(r(2,31),r(2,31),r(2,6),r(1.5,4),r(0,3),0,6.283);g.fill()}
  if(C.acc&&v%3===1){g.lineJoin='round';const p=jl(R,r(0,10),r(4,29),r(22,33),r(4,29),5,2.5);pth(g,p);g.strokeStyle=P(C.acc,.12);g.lineWidth=2.6;g.stroke();g.strokeStyle=P(C.acc,.45);g.lineWidth=.8;g.stroke()}
  g.restore();return c};
/* shade variants of a sprite for distance: lazy, one canvas per level, tinted toward the ramp colour with source-atop */
const DIMA=[0,.16,.36,.56];
function deadDim(S,lv,col){if(!lv)return S.c;const d=S.dm||(S.dm=[]);let c=d[lv];if(!c){c=d[lv]=mk(S.c.width,S.c.height);const g=c.getContext('2d');g.drawImage(S.c,0,0);g.globalCompositeOperation='source-atop';g.fillStyle='rgba('+col+','+DIMA[lv]+')';g.fillRect(0,0,c.width,c.height)}return c}
const MBANDS=[{d:[0,2],pick:[[.16,'blk']]},{d:[2,4],pick:[[.3,'blk'],[.78,'tall'],[.86,'col']]},{d:[4,9],pick:[[.1,'col'],[.34,'blk'],[.5,'tall']]},{d:[9,1e9],pick:[[.08,'col'],[.2,'blk'],[.3,'tall']]}];
const MPROPS=(o)=>({ground:{paint:'slab',n:5,seed:o.seed},blk:{paint:'block',n:6,seed:o.seed+100,s:[11,19],h:[10,5],tiers:1},tall:{paint:'block',n:5,seed:o.seed+200,s:[10,17],h:[34,9],tiers:2},col:{paint:'column',n:4,seed:o.seed+300,h:[44,16],kind:o.col}});
const MASS=(seed,kind,lo,mid,hi,acc,col,x)=>Object.assign({mode:'mass',pal:{kind,lo,mid,hi,ol:'#050408',acc},props:MPROPS({seed,col}),bands:MBANDS,edge:2,ramp:{col:'3,3,6',near:[2,.3],far:[4,.05,.55]}},x||{});
const PALE=(seed,kind,lo,mid,hi,acc,col,haze,x)=>MASS(seed,kind,lo,mid,hi,acc,col,Object.assign({ramp:{col:haze,near:[2,.12],far:[4,.03,.3]}},x||{}));
const CPROPS=(o,pipe)=>Object.assign({ground:{paint:'cfloor',n:5,seed:o},
 mound:{paint:'outcrop',n:5,seed:o+100,w:[44,84],h:[16,32],pk:[2,3],hang:0},
 rock:{paint:'outcrop',n:6,seed:o+200,w:[62,104],h:[44,80],pk:[2,3],hang:.5},
 tall:{paint:'outcrop',n:6,seed:o+300,w:[86,150],h:[84,150],pk:[2,4],hang:.6},
 spire:{paint:'spire',n:5,seed:o+400,h:[20,54]},rubble:{paint:'rubble',n:6,seed:o+500,s:12}},pipe?{col:{paint:'column',n:4,seed:o+600,h:[44,16],kind:pipe}}:{});
const CBANDS=pipe=>[{d:[0,2],pick:[[.3,'rubble'],[.5,'mound']]},{d:[2,3],pick:[[.22,'mound'],[.62,'rock'],[.74,'rubble'],[.8,'spire']]},
 {d:[3,5],pick:[[.3,'rock'],[.72,'tall'],[.8,'spire'],[.88,'rubble']].concat(pipe?[[.95,'col']]:[])},
 {d:[5,9],pick:[[.34,'tall'],[.52,'rock'],[.6,'spire']].concat(pipe?[[.75,'col']]:[])},
 {d:[9,1e9],pick:[[.26,'tall'],[.4,'rock'],[.46,'spire']]}];
const CAVE=(seed,lo,mid,hi,acc,moss,x)=>{x=x||{};return Object.assign({mode:'mass',cave:1,pal:{kind:'rock',lo,mid,hi,ol:'#050408',acc,moss},props:CPROPS(seed,x.pipe),bands:CBANDS(x.pipe),edge:2,ramp:{col:'3,3,6',near:[2,.3],far:[3,.1,.8]}},x.gap?{gap:x.gap}:{})};
const CLOUD={gap:[4,4]};   /* Act II: the Cloud sky stays visible beyond ~9 tiles of mass */
Object.assign(DEAD,{
 shaft:CAVE(7100,'#1c1411','#3c2b1e','#6c4830','#ff9a4a','#5f5a2a',CLOUD),
 reactor:CAVE(2400,'#11181c','#2d3c46','#52686f','#8fe0ff','#2f6a60',Object.assign({pipe:'pipe'},CLOUD)),
 chain:CAVE(2800,'#150f08','#2c1e0e','#533714','#f7931a','#6a5a1e',{pipe:'pipe'}),
 blocks:CAVE(3100,'#17120a','#33281a','#5e4a2a','#e0bd6e','#58602c',{pipe:'col'}),
 lake:CAVE(900,'#1a1650','#3a3278','#6a5cc0','#b48cff','#2f5a7a',CLOUD),
 trib:CAVE(400,'#15140f','#2c2a21','#524b38','#c7a43a','#4b5a2e'),
 mall:CAVE(200,'#150f1c','#2c2140','#4d3d6a','#ff8ac4','#3a5a50'),
 hq:CAVE(500,'#171320','#2e2842','#524a70','#e0bd6e','#4a5a3a'),
 vest:CAVE(1200,'#17171b','#2f2f38','#55555f',null,'#3f5a46'),
 minutes:CAVE(1300,'#141a12','#2b3a28','#4b5e43','#9fe0b0','#3f6a3c'),
 chairs:CAVE(1400,'#240d13','#4a1c22','#86323a','#ff8a8a','#5a3a2a'),
 mezz:PALE(1100,'plain','#8a889a','#aaa8bc','#cdcbe0',null,'col','225,224,242',CLOUD),
 rack:PALE(1500,'panel','#b6b6c4','#cfcfdb','#e6e6ef','#c22d35','pipe','235,235,244'),
 sofa:PALE(2300,'plain','#76585a','#9a7a78','#bf9c98',null,'col','200,170,166'),
 kitchen:PALE(2600,'plain','#97866c','#b9a888','#dccfb2',null,'col','240,230,208'),
 vault:PALE(3000,'panel','#74747f','#9696a4','#babac7',null,'col','210,210,222')});
/* ===== batch 2: dark outdoor zones (mode:'scene'): farm (3), garden (8), still (16), mempool (29) =====
   Same scene pipeline as the Moors; each zone is a DEAD entry plus painters in PAINT. A prop set with ori:1 holds
   [along-x, along-y] pairs: deadPage reads the local slope of the distance field and picks the one that runs along the map edge, so fences,
   hedges, quay walls and pipes line up with the boundary instead of lying at random angles. A DEAD entry with only:[ids] is gated by zone id
   as well (the Simulator shares style 'farm' but has no dead space). Seeded mulberry32 only; nothing here touches the map. */
const OD={
 lp:(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t],
 /* iso box, base centre (x,y), a along down-right, b along down-left, height h; c = {l,r,t} fills; returns base p[] and top t[] corners */
 box(g,x,y,a,b,h,c,ol){const p=[[x-a/2+b/2,y-a/4-b/4],[x+a/2+b/2,y+a/4-b/4],[x+a/2-b/2,y+a/4+b/4],[x-a/2-b/2,y-a/4+b/4]],t=p.map(q=>[q[0],q[1]-h]);
  const f=(q,col)=>{g.beginPath();g.moveTo(q[0][0],q[0][1]);for(let i=1;i<q.length;i++)g.lineTo(q[i][0],q[i][1]);g.closePath();g.fillStyle=col;g.fill();if(ol){g.strokeStyle=ol;g.lineWidth=1;g.stroke()}};
  f([p[3],p[2],t[2],t[3]],c.l);f([p[2],p[1],t[1],t[2]],c.r);f(t,c.t);return{p,t,h}},
 /* a point on a box face: face 'l' (p3-p2) or 'r' (p2-p1), u along the bottom edge 0..1, w up the face 0..1 */
 fp(B,face,u,w){const A=face==='l'?B.p[3]:B.p[2],C=face==='l'?B.p[2]:B.p[1];return[A[0]+(C[0]-A[0])*u,A[1]+(C[1]-A[1])*u-B.h*w]},
 poly(g,pts,fill,stroke,lw){g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<pts.length;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();if(fill){g.fillStyle=fill;g.fill()}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw||1;g.stroke()}},
 /* ragged blob */
 blob(g,x,y,rx,ry,R,fill,n){n=n||9;const k=R()*6.283;g.beginPath();for(let i=0;i<n;i++){const a=k+i/n*6.283,j=.78+R()*.4;const px=x+Math.cos(a)*rx*j,py=y+Math.sin(a)*ry*j;if(i)g.lineTo(px,py);else g.moveTo(px,py)}g.closePath();g.fillStyle=fill;g.fill()},
 shadow(g,x,y,rx,ry,a){g.fillStyle='rgba(0,0,0,'+(a||.3)+')';g.beginPath();g.ellipse(x,y,rx,ry,0,0,6.283);g.fill()},
 glow(g,x,y,r,col,a){const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,col.replace('A',a));q.addColorStop(1,col.replace('A',0));g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)},
 lin(g,x0,y0,x1,y1,s){const q=g.createLinearGradient(x0,y0,x1,y1);s.forEach((c,i)=>q.addColorStop(i/(s.length-1),c));return q}
};
/* iso tile helper: draws f in tile space (u down-right, v down-left, 0..33), clipped to the diamond; returns the canvas */
const ODT=(E,seed,v,f)=>{const{TS}=E,R=mulberry32(seed+v),r=(a,b)=>a+R()*(b-a),c=mk(68*TS,36*TS),g=c.getContext('2d');g.scale(TS,TS);g.translate(1,1);
  g.beginPath();g.moveTo(33,-1);g.lineTo(67,17);g.lineTo(33,35);g.lineTo(-1,17);g.closePath();g.clip();f(g,R,r,v);return c};
const ODS=(u,v)=>[33+u-v,(u+v)/2];   /* tile space -> tile pixels */
Object.assign(PAINT,{
 /* tilled soil: furrows run along the same tile-space lines on every tile, so they read as one field; cyan data traces ride some grooves */
 tilled(E,pr,v){const{pal,P}=E;return ODT(E,pr.seed,v,(g,R,r)=>{
  g.fillStyle=pal.soil[v%pal.soil.length];g.fillRect(0,0,66,34);
  g.save();g.transform(1,.5,-1,.5,33,0);
  for(let i=0;i<9;i++){g.fillStyle=i%2?'rgba(0,0,0,'+r(.1,.22)+')':P(pal.ridge,r(.08,.16));g.beginPath();g.ellipse(r(0,33),r(0,33),r(4,10),r(3,7),r(0,3),0,6.283);g.fill()}
  for(let k=0;k<4;k++){const y=4.1+k*8.25;
   g.fillStyle=P(pal.ridge,.34);g.fillRect(-2,y+1.6,38,5);          /* the lit crest between two grooves */
   g.fillStyle='rgba(2,4,8,.78)';g.fillRect(-2,y-1.9,38,3.8);        /* groove */
   g.fillStyle=P(pal.ridge,.85);g.fillRect(-2,y+1.8,38,1);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(-2,y-2.5,38,.8)}
  g.fillStyle='rgba(0,0,0,.34)';for(let i=0;i<24;i++)g.fillRect(r(0,33),r(0,33),r(1,2.6),r(.8,1.5));
  g.fillStyle=P(pal.ridge,.7);for(let i=0;i<18;i++)g.fillRect(r(0,33),r(0,33),r(.8,2),r(.7,1.2));
  if(v%2===0||R()<.3){const y=4.1+((R()*4)|0)*8.25,x0=r(0,14),x1=x0+r(12,22);g.strokeStyle=P(pal.glow,.2);g.lineWidth=2.4;g.beginPath();g.moveTo(-2,y);g.lineTo(36,y);g.stroke();
   g.strokeStyle=P(pal.glow,.7);g.lineWidth=.8;g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();g.fillStyle=P('#d8ffff',.9);g.fillRect(x1-1,y-.9,2,1.8)}
  g.restore();
  for(let i=0;i<6;i++){const q=ODS(r(2,31),4.1+((R()*4)|0)*8.25+r(-1,1)),h=r(2.5,6);g.strokeStyle=P(pal.stalk,.9);g.lineWidth=.9;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0]+r(-1.6,1.6),q[1]-h);g.stroke();if(i%3===0){g.fillStyle=P(pal.glow,.8);g.fillRect(q[0]-.5,q[1]-h-.8,1.3,1.3)}}})},
 /* fence: weathered posts and two rails along the local edge (i even runs down-right, odd down-left); one post carries a cyan hum light */
 fence(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=i%2,L=r(40,54),ux=(ax?-1:1)*.894,uy=.447,n=R()<.4?4:3,hp=r(15,20),led=(R()*n)|0;
  return sp(100,50,50,38,g=>{const bx=50,by=38,Q=[];for(let k=0;k<n;k++){const t=(k/(n-1)-.5)*L;Q.push([bx+ux*t,by+uy*t,r(-2.2,2.2),hp*r(.85,1.1)])}
   g.lineCap='round';OD.shadow(g,bx,by+1,L/2+4,4,.26);
   const rail=(a,b,f)=>{const A=[a[0]+a[2]*f,a[1]-a[3]*f],B=[b[0]+b[2]*f,b[1]-b[3]*f];g.strokeStyle=pal.ol;g.lineWidth=3.3;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(B[0],B[1]);g.stroke();g.strokeStyle=pal.wood[0];g.lineWidth=1.8;g.stroke();g.strokeStyle=P(pal.woodHi,.5);g.lineWidth=.6;g.beginPath();g.moveTo(A[0],A[1]-.7);g.lineTo(B[0],B[1]-.7);g.stroke()};
   for(let k=0;k<n-1;k++){for(const f of[.74,.4]){if(R()<.16){const a=Q[k],b=Q[k+1],A=[a[0]+a[2]*f,a[1]-a[3]*f];g.strokeStyle=pal.ol;g.lineWidth=3;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(A[0]+ux*8,A[1]+7);g.stroke();g.strokeStyle=pal.wood[1];g.lineWidth=1.6;g.stroke()}else rail(Q[k],Q[k+1],f)}}
   g.strokeStyle=P(pal.glow,.32);g.lineWidth=.7;g.beginPath();for(let k=0;k<n;k++){const q=Q[k],X=q[0]+q[2],Y=q[1]-q[3]*.95;if(k)g.quadraticCurveTo((X+g.__x)/2,Math.max(Y,g.__y)+2.4,X,Y);else g.moveTo(X,Y);g.__x=X;g.__y=Y}g.stroke();
   Q.forEach((q,k)=>{const X=q[0]+q[2],Y=q[1]-q[3];g.strokeStyle=pal.ol;g.lineWidth=4.6;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(X,Y);g.stroke();g.strokeStyle=pal.wood[k%2];g.lineWidth=3;g.stroke();g.strokeStyle=P(pal.woodHi,.55);g.lineWidth=.8;g.beginPath();g.moveTo(q[0]-.8,q[1]);g.lineTo(X-.8,Y);g.stroke();
    g.fillStyle=pal.ol;g.fillRect(X-2.4,Y-1.4,4.8,1.8);
    if(k===led){OD.glow(g,X,Y-3,10,'rgba(89,224,230,A)',.55);g.fillStyle='#bfffff';g.beginPath();g.arc(X,Y-2.6,1.5,0,6.283);g.fill()}})})},
 /* haystack (i<pr.stacks) and wrapped round bales */
 hay(E,pr,i){const{pal,sp,P,mx}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a);
  if(i<pr.stacks){const w=r(13,19),h=r(24,34),bx=32,by=46,H=pal.hay;
   return sp(64,58,bx,by,g=>{OD.shadow(g,bx+3,by-1,w+7,w*.36,.3);
    g.beginPath();g.moveTo(bx-w,by);g.bezierCurveTo(bx-w-2,by-h*.55,bx-w*.45,by-h*.95,bx+r(-2,2),by-h);g.bezierCurveTo(bx+w*.45,by-h*.95,bx+w+2,by-h*.55,bx+w,by);g.quadraticCurveTo(bx,by+w*.34,bx-w,by);
    g.fillStyle=OD.lin(g,bx-w,0,bx+w,0,[H[2],H[1],H[0]]);g.fill();g.save();g.clip();
    for(let k=0;k<70;k++){const x=bx+r(-w,w),y=by-r(0,h),l=r(3,7);g.strokeStyle=k%3?P(H[(k%2)],r(.3,.6)):'rgba(0,0,0,'+r(.15,.3)+')';g.lineWidth=r(.6,1.2);g.beginPath();g.moveTo(x,y);g.lineTo(x+r(1,3),y+l);g.stroke()}
    g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1.3;g.beginPath();g.ellipse(bx,by-h*.42,w*.82,3.2,0,0,3.14);g.stroke();g.beginPath();g.ellipse(bx,by-h*.72,w*.5,2.2,0,0,3.14);g.stroke();
    g.fillStyle=P(pal.glow,.07);g.fillRect(bx+w*.25,by-h,w,h);g.restore();
    g.beginPath();g.moveTo(bx-w,by);g.bezierCurveTo(bx-w-2,by-h*.55,bx-w*.45,by-h*.95,bx,by-h);g.bezierCurveTo(bx+w*.45,by-h*.95,bx+w+2,by-h*.55,bx+w,by);g.strokeStyle=pal.ol;g.lineWidth=1;g.stroke();
    for(let k=0;k<6;k++){g.strokeStyle=P(H[0],.8);g.lineWidth=.8;g.beginPath();g.moveTo(bx,by-h+1);g.lineTo(bx+r(-4,4),by-h-r(2,6));g.stroke()}})}
  const w=r(11,14),W2=pr.wrap[i%pr.wrap.length];
  return sp(64,48,32,40,g=>{OD.shadow(g,35,39,w+9,w*.4,.3);const cyl=(x,y,hh)=>{g.fillStyle=W2[1];g.beginPath();g.ellipse(x,y,w,w*.48,0,0,3.1416);g.lineTo(x-w,y-hh);g.ellipse(x,y-hh,w,w*.48,0,3.1416,0,true);g.closePath();g.fillStyle=OD.lin(g,x-w,0,x+w,0,[W2[2],W2[1],W2[0]]);g.fill();g.strokeStyle=pal.ol;g.lineWidth=1;g.stroke();
     g.strokeStyle='rgba(255,255,255,.1)';g.lineWidth=.8;for(let k=1;k<4;k++){g.beginPath();g.ellipse(x,y-hh*k/4,w,w*.48,0,0,3.1416);g.stroke()}
     g.fillStyle=W2[0];g.beginPath();g.ellipse(x,y-hh,w,w*.48,0,0,6.283);g.fill();g.stroke();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.8;for(let k=1;k<4;k++){g.beginPath();g.ellipse(x,y-hh,w*k/4,w*.48*k/4,0,0,6.283);g.stroke()}
     g.fillStyle='rgba(255,255,255,.2)';g.beginPath();g.ellipse(x+w*.4,y-hh*.55,2,hh*.3,0,0,6.283);g.fill()};
    cyl(32,40,12);if(i%2)cyl(32,28,12)})},
 /* dead crop rows along the local edge: bent stalks with drooping heads and a few cyan tips */
 crops(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=i%2,ux=(ax?-1:1)*.894,uy=.447,px=-uy,py=ux*.5;
  return sp(80,50,40,40,g=>{OD.shadow(g,40,40,30,5,.2);g.lineCap='round';
   for(let row=0;row<2;row++)for(let k=0;k<11;k++){const t=(k/10-.5)*r(46,56),bx=40+ux*t+px*(row?7:-7),by=40+uy*t+py*(row?7:-7)*.6+(row?3:0),h=r(11,24),lean=r(-.35,.35)+(row?.1:-.1);
    const tx=bx+lean*h,ty=by-h*r(.85,1);g.strokeStyle=pal.ol;g.lineWidth=2.1;g.beginPath();g.moveTo(bx,by);g.quadraticCurveTo(bx+lean*h*.2,by-h*.7,tx,ty);g.stroke();
    g.strokeStyle=pal.stalk[(k+row)%3];g.lineWidth=1.1;g.stroke();
    for(let l=0;l<2;l++){const y=by-h*(.3+l*.28),s=l?1:-1;g.strokeStyle=pal.stalk[(k+l)%3];g.lineWidth=.9;g.beginPath();g.moveTo(bx+lean*h*(.3+l*.28),y);g.quadraticCurveTo(bx+s*6,y-4,bx+s*9,y+r(0,4));g.stroke()}
    g.fillStyle=pal.ol;g.beginPath();g.ellipse(tx+lean*3,ty+2,1.7,3.4,lean,0,6.283);g.fill();
    if(R()<.14){OD.glow(g,tx,ty-1,5,'rgba(89,224,230,A)',.5);g.fillStyle='#aef';g.fillRect(tx-.6,ty-1.6,1.4,1.4)}}})},
 /* barn silhouette: long plank wall, gable end with a barred door and a loft light, sagging roof */
 barn(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),a=r(64,78),b=r(40,48),h=r(24,30),rh=r(15,19),B=pal.barn;
  return sp(150,112,75,92,g=>{OD.shadow(g,78,92,a*.55,b*.3,.34);
   const bx=75,by=90,bo=OD.box(g,bx,by,a,b,h,{l:B[0],r:B[1],t:B[2]},pal.ol),p=bo.p,t=bo.t,mid=(x,y)=>[(x[0]+y[0])/2,(x[1]+y[1])/2];
   const peak=mid(t[2],t[1]),pk=[peak[0],peak[1]-rh],bk=mid(t[3],t[0]),rb=[bk[0],bk[1]-rh];
   OD.poly(g,[p[2],p[1],t[1],pk,t[2]],B[1],pal.ol);
   OD.poly(g,[t[3],t[2],pk,rb],pal.roof,pal.ol);
   for(let k=0;k<9;k++){const u=(k+.5)/9,A=OD.lp(t[3],t[2],u),C=OD.lp(rb,pk,u);g.strokeStyle='rgba(0,0,0,'+(k%2?.4:.18)+')';g.lineWidth=.9;g.beginPath();g.moveTo(A[0],A[1]+1);g.lineTo(C[0],C[1]);g.stroke()}
   g.strokeStyle=P(pal.glow,.25);g.lineWidth=1.2;g.beginPath();g.moveTo(rb[0],rb[1]);g.lineTo(pk[0],pk[1]);g.stroke();
   for(let k=0;k<3;k++){const u=r(.15,.85),w2=r(.15,.85),A=OD.lp(OD.lp(t[3],t[2],u),OD.lp(rb,pk,u),w2);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(A[0]-3,A[1]-1,r(4,8),2)}
   for(let k=1;k<14;k++){const u=k/14;let A=OD.fp(bo,'l',u,0),C=OD.fp(bo,'l',u,1);g.strokeStyle='rgba(0,0,0,'+(k%3?.35:.12)+')';g.lineWidth=.9;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(C[0],C[1]);g.stroke()}
   for(let k=1;k<8;k++){const u=k/8,A=OD.fp(bo,'r',u,0),C=OD.fp(bo,'r',u,1);g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.9;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(C[0],C[1]);g.stroke()}
   for(const u of[.22,.7]){const q=[OD.fp(bo,'l',u,.5),OD.fp(bo,'l',u+.1,.5),OD.fp(bo,'l',u+.1,.78),OD.fp(bo,'l',u,.78)];OD.poly(g,q,'#05080e');OD.poly(g,q.slice(0,2).concat([[q[1][0],q[1][1]+1],[q[0][0],q[0][1]+1]]),P(pal.glow,.0));g.fillStyle=P(pal.glow,.5);g.fillRect(q[0][0]+2,q[0][1]-2,2,1.4)}
   const d=[OD.fp(bo,'r',.28,0),OD.fp(bo,'r',.72,0),OD.fp(bo,'r',.72,.72),OD.fp(bo,'r',.28,.72)];OD.poly(g,d,'#070a12',pal.ol);
   g.strokeStyle=P(B[2],.9);g.lineWidth=1.1;g.beginPath();g.moveTo(d[0][0],d[0][1]);g.lineTo(d[2][0],d[2][1]);g.moveTo(d[1][0],d[1][1]);g.lineTo(d[3][0],d[3][1]);g.stroke();
   const lf=[OD.lp(t[2],pk,.42),OD.lp(t[2],pk,.58)],lm=[(lf[0][0]+lf[1][0])/2,(lf[0][1]+lf[1][1])/2+2];OD.glow(g,lm[0],lm[1],9,'rgba(89,224,230,A)',.45);g.fillStyle=P(pal.glow,.8);g.fillRect(lm[0]-2.5,lm[1]-2,5,3);
   g.strokeStyle=P(pal.glow,.18);g.lineWidth=1;g.beginPath();g.moveTo(p[2][0],p[2][1]);g.lineTo(t[2][0],t[2][1]);g.stroke()})},
 /* generic foliage mass (hedge rows along the edge, hedges, canopies): pr.pk palette key, pr.row 1 = long along the local edge */
 bush(E,pr,i){const{pal,sp,P}=E,C=pal[pr.pk],R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=pr.row?i%2:0,ux=(ax?-1:1)*.894,uy=.447,w=r(pr.w[0],pr.w[1]),h=r(pr.h[0],pr.h[1]),W0=Math.ceil(w+34),H0=Math.ceil(h+34),bx=W0/2,by=H0-12,n=pr.row?Math.max(3,Math.round(w/8)):pr.nb||8;
  return sp(W0,H0,bx,by,g=>{OD.shadow(g,bx+2,by+1,w/2+8,pr.row?5:w*.3,.3);
   const bl=[];for(let k=0;k<n;k++){const t=pr.row?(k/(n-1)-.5)*w:r(-w*.3,w*.3),rr=pr.row?r(h*.34,h*.52):r(w*.2,w*.34),o=pr.row?0:r(0,h*.7);bl.push([bx+(pr.row?ux*t:t),by+(pr.row?uy*t:r(-2,2))-rr*.7-o,rr])}
   bl.sort((a,b)=>a[1]-b[1]);
   for(const q of bl)OD.blob(g,q[0],q[1],q[2],q[2]*.9,R,C[2]);
   for(const q of bl){OD.blob(g,q[0]-q[2]*.06,q[1]-q[2]*.1,q[2]*.84,q[2]*.76,R,C[0]);OD.blob(g,q[0]+q[2]*.22,q[1]-q[2]*.3,q[2]*.5,q[2]*.4,R,C[1])}
   for(let k=0;k<(pr.leaf||46);k++){const q=bl[(R()*bl.length)|0],a=r(0,6.283),d=r(0,q[2]*.85),x=q[0]+Math.cos(a)*d,y=q[1]+Math.sin(a)*d*.85;g.fillStyle=k%3?P(pal.hi||C[1],r(.25,.55)):'rgba(0,0,0,'+r(.2,.4)+')';g.fillRect(x,y,r(1,2.4),r(.8,1.5))}
   if(pr.twig)for(let k=0;k<pr.twig;k++){const q=bl[(R()*bl.length)|0],a=-1.57+r(-1,1),l=r(5,11),x=q[0]+Math.cos(a)*q[2]*.7,y=q[1]+Math.sin(a)*q[2]*.7;g.strokeStyle=pal.ol;g.lineWidth=1.3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke()}
   if(pr.spark)for(let k=0;k<pr.spark;k++){const q=bl[(R()*bl.length)|0],x=q[0]+r(-q[2],q[2])*.7,y=q[1]+r(-q[2],q[2])*.5;OD.glow(g,x,y,4,'rgba(159,255,224,A)',.5);g.fillStyle=pal.bloom||'#dffff0';g.fillRect(x-.6,y-.6,1.4,1.4)}})},
 /* relay mast: a thin lattice pole, cross arms and a cyan beacon */
 mast(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),h=r(pr.h[0],pr.h[1]);
  return sp(50,h+24,25,h+14,g=>{const bx=25,by=h+14;OD.shadow(g,bx+2,by,9,3,.3);g.lineCap='round';
   const L=(x0,y0,x1,y1,w,c)=>{g.strokeStyle=c;g.lineWidth=w;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke()};
   L(bx-3,by,bx-1,by-h,2.4,pal.ol);L(bx+3,by,bx+1,by-h,2.4,pal.ol);L(bx-3,by,bx-1,by-h,1.3,pal.steel[1]);L(bx+3,by,bx+1,by-h,1.3,pal.steel[0]);
   for(let k=0;k<h/7;k++){const y=by-k*7-2,y2=y-7,w1=3-k*2/(h/7),w2=3-(k+1)*2/(h/7);L(bx-w1,y,bx+w2,y2,.9,pal.steel[2]);L(bx+w1,y,bx-w2,y2,.9,pal.steel[2])}
   for(const f of[.72,.55]){const y=by-h*f,l=f>.6?9:6;L(bx-l,y,bx+l,y,1.6,pal.ol);L(bx-l,y,bx+l,y,.9,pal.steel[1]);L(bx-l,y,bx-l,y+2,1,pal.glow);L(bx+l,y,bx+l,y+2,1,pal.glow)}
   OD.glow(g,bx,by-h-2,11,'rgba(89,224,230,A)',.7);g.fillStyle='#cfffff';g.beginPath();g.arc(bx,by-h-2,1.8,0,6.283);g.fill();
   g.strokeStyle=P(pal.glow,.25);g.lineWidth=.7;for(const s of[-1,1]){g.beginPath();g.moveTo(bx,by-h*.6);g.lineTo(bx+s*14,by+2);g.stroke()}})}
});
Object.assign(PAINT,{
 /* garden floor: broken flagstones in moss, leaf litter, pale blooms */
 mossy(E,pr,v){const{pal,P}=E;return ODT(E,pr.seed,v,(g,R,r)=>{
  g.fillStyle=pal.grd[v%pal.grd.length];g.fillRect(0,0,66,34);g.save();g.transform(1,.5,-1,.5,33,0);
  for(let i=0;i<5;i++){const x=r(-3,30),y=r(-3,30),w=r(8,16),h=r(7,14);const q=[[x,y+r(0,2)],[x+w,y+r(-1,1)],[x+w+r(-1,1),y+h],[x+r(-1,1),y+h+r(-1,1)]];
   OD.poly(g,q,P(pal.flag[i%3],r(.5,.8)),'rgba(3,10,8,.7)',.9);g.fillStyle='rgba(255,255,255,'+r(.03,.08)+')';g.fillRect(x+1,y+1,w-2,1.1);
   g.strokeStyle='rgba(3,8,6,.6)';g.lineWidth=.6;g.beginPath();g.moveTo(x+r(2,w-2),y);g.lineTo(x+r(2,w-2),y+h);g.stroke()}
  for(let i=0;i<10;i++){g.fillStyle=P(pal.moss[i%3],r(.35,.7));g.beginPath();g.ellipse(r(0,33),r(0,33),r(2,7),r(1.5,5),r(0,3),0,6.283);g.fill()}
  for(let i=0;i<7;i++){g.fillStyle='rgba(2,8,6,'+r(.2,.4)+')';g.beginPath();g.ellipse(r(0,33),r(0,33),r(2,5),r(1.5,3.5),r(0,3),0,6.283);g.fill()}
  g.restore();
  for(let i=0;i<30;i++){const q=ODS(r(0,33),r(0,33)),h=r(1.5,4);g.strokeStyle=P(pal.blade[i%3],.9);g.lineWidth=.9;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0]+r(-1,1),q[1]-h);g.stroke()}
  for(let i=0;i<5;i++){const q=ODS(r(1,32),r(1,32));g.fillStyle=P(pal.leafLit[i%3],.8);g.fillRect(q[0],q[1],r(1.4,2.6),r(.8,1.3))}
  if(R()<.55){const q=ODS(r(3,30),r(3,30));g.fillStyle=P(pal.bloom,.85);g.fillRect(q[0],q[1]-1.5,1.6,1.6);g.fillStyle=P(pal.glow,.25);g.beginPath();g.arc(q[0]+.8,q[1]-.7,3,0,6.283);g.fill()}})},
 /* topiary clipped long ago: urn, then a ball, spiral cone, tiered balls or a cube, with stray shoots */
 topi(E,pr,i){const{pal,sp,P}=E,C=pal.leaf,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),k=i%4;
  return sp(64,96,32,82,g=>{const bx=32,by=82;OD.shadow(g,bx+2,by,17,5,.32);
   OD.box(g,bx,by,16,16,9,{l:pal.stone[2],r:pal.stone[1],t:pal.stone[0]},pal.ol);const y0=by-9;
   const shape=()=>{g.beginPath();if(k===0)g.arc(bx,y0-15,15,0,6.283);else if(k===1){g.moveTo(bx-14,y0+1);g.quadraticCurveTo(bx-12,y0-26,bx+r(-1,1),y0-52);g.quadraticCurveTo(bx+12,y0-26,bx+14,y0+1);g.quadraticCurveTo(bx,y0+6,bx-14,y0+1)}
     else if(k===2){g.arc(bx,y0-11,13,0,6.283);g.moveTo(bx+10,y0-30);g.arc(bx,y0-30,10,0,6.283);g.moveTo(bx+7,y0-46);g.arc(bx,y0-46,7,0,6.283)}
     else{g.moveTo(bx-14,y0-4);g.lineTo(bx,y0+3);g.lineTo(bx+14,y0-4);g.lineTo(bx+14,y0-28);g.lineTo(bx,y0-21);g.lineTo(bx-14,y0-28);g.closePath()}};
   shape();g.fillStyle=C[2];g.fill();g.save();g.clip();
   g.fillStyle=OD.lin(g,bx-15,0,bx+15,0,[C[2],C[0],C[1]]);g.fillRect(bx-16,y0-56,32,64);
   for(let n=0;n<26;n++){OD.blob(g,bx+r(-14,14),y0-r(0,50),r(2.5,6),r(2,4),R,n%3?P(C[1],r(.25,.5)):'rgba(0,0,0,'+r(.15,.3)+')',6)}
   for(let n=0;n<70;n++){g.fillStyle=n%3?P(pal.hi,r(.25,.6)):'rgba(0,0,0,'+r(.25,.45)+')';g.fillRect(bx+r(-15,15),y0-r(-2,54),r(1,2.4),r(.8,1.5))}
   if(k===1){g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=1.3;for(let n=0;n<4;n++){g.beginPath();g.moveTo(bx-14,y0-n*12);g.quadraticCurveTo(bx,y0-n*12+9,bx+14,y0-n*12-4);g.stroke()}}
   if(k===3){g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1.1;g.beginPath();g.moveTo(bx,y0+3);g.lineTo(bx,y0-21);g.stroke()}
   g.restore();shape();g.strokeStyle=pal.ol;g.lineWidth=1.1;g.stroke();
   for(let n=0;n<9;n++){const a=-1.57+r(-1.5,1.5),x=bx+Math.cos(a)*r(10,14),y=y0-(k===1?r(8,30):k===2?r(10,40):r(10,26))+Math.sin(a)*4,l=r(4,9);g.strokeStyle=pal.ol;g.lineWidth=1.6;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(a)*l,y+Math.sin(a)*l);g.stroke();g.strokeStyle=C[1];g.lineWidth=.9;g.stroke();g.fillStyle=pal.hi;g.fillRect(x+Math.cos(a)*l-1,y+Math.sin(a)*l-1,2,1.6)}})},
 /* weathered statues: robed figure, urn, broken column, winged figure; moss streaks and vines */
 statue(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),k=i%4,S=pal.stone,C=pal.leaf;
  return sp(64,100,32,88,g=>{const bx=32,by=88,ph=r(10,15);OD.shadow(g,bx+3,by,19,5,.32);
   OD.box(g,bx,by,19,19,ph,{l:S[2],r:S[1],t:S[0]},pal.ol);const y0=by-ph,fill=()=>{g.fillStyle=OD.lin(g,bx-10,0,bx+10,0,[S[2],S[1],S[0]]);g.fill();g.strokeStyle=pal.ol;g.lineWidth=1.1;g.stroke()};
   if(k===0||k===3){const hh=r(34,44);g.beginPath();g.moveTo(bx-6,y0-hh*.74);g.quadraticCurveTo(bx-12,y0-hh*.3,bx-10,y0);g.lineTo(bx+10,y0);g.quadraticCurveTo(bx+12,y0-hh*.3,bx+6,y0-hh*.74);g.quadraticCurveTo(bx,y0-hh*.8,bx-6,y0-hh*.74);fill();
    g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.8;for(let n=0;n<4;n++){g.beginPath();g.moveTo(bx-6+n*4,y0-hh*.6);g.lineTo(bx-8+n*5,y0-1);g.stroke()}
    g.beginPath();g.arc(bx+r(-.8,.8),y0-hh*.74-4.5,4.2,0,6.283);fill();
    if(k===0){g.lineCap='round';g.strokeStyle=pal.ol;g.lineWidth=5;g.beginPath();g.moveTo(bx+6,y0-hh*.66);g.lineTo(bx+13,y0-hh*.95);g.stroke();g.strokeStyle=S[0];g.lineWidth=3;g.stroke();g.strokeStyle=pal.ol;g.lineWidth=5;g.beginPath();g.moveTo(bx-6,y0-hh*.66);g.lineTo(bx-9,y0-hh*.4);g.stroke();g.strokeStyle=S[2];g.lineWidth=3;g.stroke()}
    else{for(const s of[-1,1]){g.beginPath();g.moveTo(bx+s*5,y0-hh*.7);g.quadraticCurveTo(bx+s*24,y0-hh*1.15,bx+s*21,y0-hh*.35);g.quadraticCurveTo(bx+s*14,y0-hh*.5,bx+s*6,y0-hh*.35);fill();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=.7;for(let n=0;n<4;n++){g.beginPath();g.moveTo(bx+s*7,y0-hh*(.62-n*.07));g.lineTo(bx+s*(19-n*1.5),y0-hh*(.8-n*.1));g.stroke()}}}}
   else if(k===1){g.beginPath();g.moveTo(bx-7,y0);g.quadraticCurveTo(bx-14,y0-14,bx-9,y0-22);g.lineTo(bx-12,y0-26);g.lineTo(bx+12,y0-26);g.lineTo(bx+9,y0-22);g.quadraticCurveTo(bx+14,y0-14,bx+7,y0);g.closePath();fill();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.9;g.beginPath();g.ellipse(bx,y0-14,11,2.5,0,0,3.14);g.stroke();
    for(let n=0;n<8;n++){const a=r(-2.6,-.5),l=r(8,17);g.strokeStyle=C[n%2];g.lineWidth=1.5;g.beginPath();g.moveTo(bx+r(-6,6),y0-26);g.quadraticCurveTo(bx+Math.cos(a)*l*.6,y0-26+Math.sin(a)*l,bx+Math.cos(a)*l,y0-26+Math.sin(a)*l*.7+4);g.stroke()}}
   else{const hh=r(26,34);g.beginPath();g.moveTo(bx-8,y0);g.lineTo(bx-8,y0-hh);g.lineTo(bx-4,y0-hh-3);g.lineTo(bx+1,y0-hh+4);g.lineTo(bx+5,y0-hh-1);g.lineTo(bx+8,y0-hh*.8);g.lineTo(bx+8,y0);g.closePath();fill();
    g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=.8;for(let n=1;n<5;n++){g.beginPath();g.moveTo(bx-8,y0-hh*n/5);g.lineTo(bx+8,y0-hh*n/5+2);g.stroke()}}
   for(let n=0;n<8;n++){g.fillStyle=P(C[n%2?1:0],r(.5,.85));g.beginPath();g.ellipse(bx+r(-9,9),y0-r(2,36),r(1.4,3.4),r(2,7),0,0,6.283);g.fill()}
   g.strokeStyle=P(C[1],.9);g.lineWidth=1.1;g.beginPath();const vx=bx+r(-6,6);g.moveTo(vx,y0-r(10,34));g.quadraticCurveTo(vx+r(-5,5),y0-8,vx+r(-3,3),y0+r(0,4));g.stroke()})},
 /* ruined pergola: four pale posts, sagging beams and rafters, a collapsed span, hanging vines */
 pergola(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),a=r(60,72),b=r(42,50),H=r(42,52),S=pal.stone,C=pal.leaf;
  return sp(150,112,75,94,g=>{OD.shadow(g,75,94,a*.5,b*.3,.3);const bx=75,by=92,p=[[bx-a/2+b/2,by-a/4-b/4],[bx+a/2+b/2,by+a/4-b/4],[bx+a/2-b/2,by+a/4+b/4],[bx-a/2-b/2,by-a/4+b/4]],t=p.map(q=>[q[0],q[1]-H]);
   const post=(k)=>{const q=p[k],T=t[k],bro=(k===1&&R()<.5)?H*.55:0;g.fillStyle=pal.ol;g.fillRect(q[0]-3.6,T[1]+bro-1,7.2,H-bro+3);g.fillStyle=OD.lin(g,q[0]-3,0,q[0]+3,0,[S[2],S[1],S[0]]);g.fillRect(q[0]-2.6,T[1]+bro,5.2,H-bro+1);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(q[0]-2.6,q[1]-3,5.2,3)};
   const beam=(A,B,lw)=>{g.lineCap='butt';g.strokeStyle=pal.ol;g.lineWidth=lw+1.8;g.beginPath();g.moveTo(A[0],A[1]);g.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2+r(1,3),B[0],B[1]);g.stroke();g.strokeStyle=S[1];g.lineWidth=lw;g.stroke();g.strokeStyle=P(S[0],.7);g.lineWidth=.8;g.beginPath();g.moveTo(A[0],A[1]-lw*.3);g.quadraticCurveTo((A[0]+B[0])/2,(A[1]+B[1])/2+r(1,3)-lw*.3,B[0],B[1]-lw*.3);g.stroke()};
   post(0);post(3);post(1);beam(t[0],t[1],4);beam(t[3],t[0],4);
   for(let n=1;n<7;n++){if(R()<.2)continue;const A=OD.lp(t[0],t[1],n/7),B=OD.lp(t[3],t[2],n/7);g.strokeStyle=pal.ol;g.lineWidth=2.6;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(B[0],B[1]);g.stroke();g.strokeStyle=S[n%2];g.lineWidth=1.4;g.stroke()}
   post(2);beam(t[3],t[2],4.5);beam(t[2],t[1],4.5);
   g.lineCap='round';g.strokeStyle=pal.ol;g.lineWidth=4.5;g.beginPath();g.moveTo(t[2][0]-8,t[2][1]-3);g.lineTo(t[2][0]+14,p[2][1]-3);g.stroke();g.strokeStyle=S[1];g.lineWidth=3;g.stroke();
   for(let n=0;n<10;n++){const e=[[t[0],t[1]],[t[3],t[2]],[t[2],t[1]],[t[3],t[0]]][n%4],q=OD.lp(e[0],e[1],r(.1,.9)),l=r(14,H*.8);g.strokeStyle=C[n%2];g.lineWidth=r(1.2,2.2);g.beginPath();g.moveTo(q[0],q[1]);g.quadraticCurveTo(q[0]+r(-6,6),q[1]+l*.5,q[0]+r(-4,4),q[1]+l);g.stroke();
    for(let m=0;m<5;m++){const y=q[1]+l*m/5;g.fillStyle=P(m%2?pal.hi:C[1],.8);g.beginPath();g.ellipse(q[0]+r(-4,4),y,r(1.6,3),r(1.1,2),r(0,3),0,6.283);g.fill()}
    if(n%3===0){OD.glow(g,q[0],q[1]+l,5,'rgba(159,255,224,A)',.4);g.fillStyle=pal.bloom;g.fillRect(q[0]-.7,q[1]+l-.7,1.6,1.6)}}})},
 /* fern and bramble clumps: arching fronds, pale spores */
 frond(E,pr,i){const{pal,sp,P}=E,C=pal.leaf,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a);
  return sp(48,34,24,26,g=>{OD.shadow(g,24,26,15,4,.25);g.lineCap='round';
   for(let k=0;k<12;k++){const a=-1.57+(k/11-.5)*2.6+r(-.15,.15),l=r(10,19),x=24+r(-3,3),y=26,cx=x+Math.cos(a)*l*.55,cy=y+Math.sin(a)*l*.9,tx=x+Math.cos(a)*l+Math.sign(Math.cos(a)||1)*3,ty=y+Math.sin(a)*l*.55+4;
    g.strokeStyle=pal.ol;g.lineWidth=2.4;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(cx,cy,tx,ty);g.stroke();g.strokeStyle=C[k%2];g.lineWidth=1.5;g.stroke();
    for(let m=1;m<6;m++){const t=m/6,px=(1-t)*(1-t)*x+2*t*(1-t)*cx+t*t*tx,py=(1-t)*(1-t)*y+2*t*(1-t)*cy+t*t*ty;g.strokeStyle=P(pal.hi,.45);g.lineWidth=.8;g.beginPath();g.moveTo(px,py);g.lineTo(px+(Math.cos(a)>0?-2.4:2.4),py-2);g.moveTo(px,py);g.lineTo(px+(Math.cos(a)>0?2.4:-2.4),py+1.4);g.stroke()}}
   for(let k=0;k<3;k++){const x=24+r(-9,9),y=r(6,16);OD.glow(g,x,y,5,'rgba(159,255,224,A)',.45);g.fillStyle=pal.bloom;g.fillRect(x-.7,y-.7,1.6,1.6)}})}
});
Object.assign(PAINT,{
 /* wet slab: black glass with sheen puddles, ripple rings and hairline cracks */
 slabw(E,pr,v){const{pal,P}=E;return ODT(E,pr.seed,v,(g,R,r)=>{
  g.fillStyle=pal.slab[v%pal.slab.length];g.fillRect(0,0,66,34);g.save();g.transform(1,.5,-1,.5,33,0);
  for(let i=0;i<4;i++){const x=r(0,33),y=r(0,33),w=r(7,15),h=r(6,12);g.strokeStyle='rgba(2,4,10,.65)';g.lineWidth=.8;g.strokeRect(x-w,y-h,w*2,h*2);g.fillStyle=R()<.5?'rgba(255,255,255,.025)':'rgba(0,0,0,.14)';g.fillRect(x-w,y-h,w*2,h*2)}
  for(let i=0;i<(v%2?3:2);i++){const x=r(5,28),y=r(5,28),w=r(5,10),h=r(3,7),q=g.createRadialGradient(x,y,0,x,y,w);q.addColorStop(0,P(pal.sheen,.5));q.addColorStop(.7,P(pal.sheen,.16));q.addColorStop(1,P(pal.sheen,0));
   g.save();g.translate(x,y);g.scale(1,h/w);g.translate(-x,-y);g.fillStyle=q;g.beginPath();g.arc(x,y,w,0,6.283);g.fill();g.restore();
   g.strokeStyle=P(pal.ripple,.34);g.lineWidth=.6;for(let k=1;k<=3;k++){g.beginPath();g.ellipse(x,y,w*k/3.4,h*k/3.4,0,0,6.283);g.stroke()}}
  g.strokeStyle='rgba(0,0,6,.7)';g.lineWidth=.7;for(let i=0;i<2;i++){let x=r(2,30),y=r(2,30);g.beginPath();g.moveTo(x,y);for(let k=0;k<4;k++){x+=r(-3,3);y+=r(1,4);g.lineTo(x,y)}g.stroke()}
  g.restore();g.fillStyle=P(pal.sheen,.5);for(let i=0;i<8;i++)g.fillRect(r(8,58),r(4,30),r(1,2.5),.8)})},
 /* vats: squat riveted tanks and tall still columns with a domed head and a lyne arm */
 vat(E,pr,i){const{pal,sp,P}=E,S=pal.steel,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),tall=i>=pr.tanks,rx=tall?r(10,13):r(17,25),hh=tall?r(54,76):r(26,38),W0=tall?84:Math.ceil(rx*2+30),H0=Math.ceil(hh+rx+30),bx=W0/2,by=H0-14;
  return sp(W0,H0,bx,by,g=>{OD.shadow(g,bx+4,by+1,rx+8,rx*.42,.34);
   const bodyP=(top)=>{g.beginPath();g.moveTo(bx-rx,by);g.lineTo(bx-rx,by-hh);g.ellipse(bx,by-hh,rx,rx*.46,0,Math.PI,0);g.lineTo(bx+rx,by);g.ellipse(bx,by,rx,rx*.46,0,0,Math.PI);g.closePath()};
   bodyP();g.fillStyle=OD.lin(g,bx-rx,0,bx+rx,0,[S[2],S[1],S[0],S[1]]);g.fill();g.strokeStyle=pal.ol;g.lineWidth=1.1;g.stroke();
   const nb=tall?4:2;for(let k=0;k<=nb;k++){const y=by-hh*k/(nb+.0)+(k===0?-2:0);g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=1.6;g.beginPath();g.ellipse(bx,y,rx,rx*.46,0,0.05,Math.PI-.05);g.stroke();g.strokeStyle=P(pal.hoop,.5);g.lineWidth=.8;g.beginPath();g.ellipse(bx,y-1.4,rx,rx*.46,0,0.05,Math.PI-.05);g.stroke();
    if(!tall||k%2===0)for(let m=0;m<(tall?5:9);m++){const a=.25+m/((tall?5:9)-1)*(Math.PI-.5);g.fillStyle=P(pal.hoop,.7);g.fillRect(bx+Math.cos(a)*rx*.95-.5,y+Math.sin(a)*rx*.44-.4,1.2,1.2)}}
   for(let k=0;k<4;k++){g.fillStyle='rgba(0,0,0,'+r(.1,.25)+')';g.fillRect(bx+r(-rx,rx*.6),by-r(hh*.1,hh*.9),r(1,2.4),r(4,hh*.4))}
   g.beginPath();g.ellipse(bx,by-hh,rx,rx*.46,0,0,6.283);g.fillStyle=S[1];g.fill();g.strokeStyle=pal.ol;g.lineWidth=1;g.stroke();
   if(tall){g.beginPath();g.moveTo(bx-rx,by-hh);g.bezierCurveTo(bx-rx,by-hh-rx*1.5,bx+rx,by-hh-rx*1.5,bx+rx,by-hh);g.closePath();g.fillStyle=OD.lin(g,bx-rx,0,bx+rx,0,[S[2],S[1],S[0],S[1]]);g.fill();g.strokeStyle=pal.ol;g.stroke();
    g.lineCap='round';g.strokeStyle=pal.ol;g.lineWidth=4.4;g.beginPath();g.moveTo(bx,by-hh-rx*1.1);g.quadraticCurveTo(bx+rx*.5,by-hh-rx*2,bx+rx*1.8,by-hh-rx*.9);g.lineTo(bx+rx*1.8,by-4);g.stroke();g.strokeStyle=S[1];g.lineWidth=2.6;g.stroke();g.strokeStyle=P(pal.hoop,.5);g.lineWidth=.7;g.stroke()}
   else{g.beginPath();g.ellipse(bx,by-hh,rx*.38,rx*.17,0,0,6.283);g.fillStyle='#070b14';g.fill();g.strokeStyle=P(pal.hoop,.6);g.stroke();
    g.strokeStyle=pal.ol;g.lineWidth=2.6;g.beginPath();g.moveTo(bx+rx+1,by-hh*.8);g.lineTo(bx+rx+1,by-hh*.1);g.stroke();g.strokeStyle=S[0];g.lineWidth=.9;for(let k=0;k<5;k++){const y=by-hh*.8+k*hh*.14;g.beginPath();g.moveTo(bx+rx-1,y);g.lineTo(bx+rx+3,y);g.stroke()}}
   const gy=by-hh*r(.35,.6);OD.glow(g,bx-rx*.3,gy,8,'rgba(159,208,255,A)',.5);g.fillStyle='#0a1220';g.beginPath();g.arc(bx-rx*.3,gy,2.8,0,6.283);g.fill();g.fillStyle=P(pal.glow,.9);g.beginPath();g.arc(bx-rx*.3,gy,1.5,0,6.283);g.fill();
   g.fillStyle=P(pal.sheen,.12);g.beginPath();g.ellipse(bx,by+3,rx+2,rx*.46,0,0,6.283);g.fill()})},
 /* pipe run along the local edge (i even down-right, odd down-left): body, flanges, a valve wheel, a riser; pr.pk picks the palette */
 pipe(E,pr,i){const{pal,sp,P}=E,Q=pal[pr.pk||'pipe'],R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=i%2,L=r(46,62),th=r(3,4.4),hh=r(3,7),ux=(ax?-1:1)*.894,uy=.447,ris=r(12,26);
  return sp(110,70,55,52,g=>{const bx=55,by=52,A=[bx-ux*L/2,by-uy*L/2-hh],B=[bx+ux*L/2,by+uy*L/2-hh];g.lineCap='round';OD.shadow(g,bx,by+1,L/2+3,4,.26);
   for(const t of[.15,.5,.85]){const x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t;g.strokeStyle=pal.ol;g.lineWidth=2.6;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+hh+1);g.stroke();g.strokeStyle=Q.b;g.lineWidth=1.3;g.stroke()}
   const run=(x0,y0,x1,y1)=>{g.strokeStyle=pal.ol;g.lineWidth=th*2+1.8;g.beginPath();g.moveTo(x0,y0);g.lineTo(x1,y1);g.stroke();g.strokeStyle=Q.b;g.lineWidth=th*2;g.stroke();g.strokeStyle=Q.a;g.lineWidth=th*1.1;g.beginPath();g.moveTo(x0,y0-th*.35);g.lineTo(x1,y1-th*.35);g.stroke();g.strokeStyle=P(Q.hi,.55);g.lineWidth=.9;g.beginPath();g.moveTo(x0,y0-th*.7);g.lineTo(x1,y1-th*.7);g.stroke()};
   run(A[0],A[1],B[0],B[1]);
   for(let k=0;k<4;k++){const t=(k+.5)/4,x=A[0]+(B[0]-A[0])*t,y=A[1]+(B[1]-A[1])*t;g.strokeStyle=pal.ol;g.lineWidth=3.4;g.beginPath();g.moveTo(x,y-th*1.15);g.lineTo(x,y+th*1.15);g.stroke();g.strokeStyle=Q.hi;g.lineWidth=1.8;g.stroke();if(Q.glow&&k%2===0){g.strokeStyle=P(Q.glow,.7);g.lineWidth=.9;g.beginPath();g.moveTo(x+1.4,y-th*.9);g.lineTo(x+1.4,y+th*.9);g.stroke()}}
   if(Q.glow){OD.glow(g,(A[0]+B[0])/2,(A[1]+B[1])/2,L*.45,'rgba('+hex2rgb(Q.glow).join(',')+',A)',.18)}
   run(B[0],B[1],B[0],B[1]-ris);g.fillStyle=pal.ol;g.beginPath();g.ellipse(B[0],B[1]-ris-th*.4,th+1,th*.5,0,0,6.283);g.fill();g.fillStyle=Q.hi;g.beginPath();g.ellipse(B[0],B[1]-ris-th*.6,th*.8,th*.4,0,0,6.283);g.fill();
   if(R()<.7){const x=A[0]+(B[0]-A[0])*.4,y=A[1]+(B[1]-A[1])*.4-th-5;g.strokeStyle=pal.ol;g.lineWidth=3.2;g.beginPath();g.moveTo(x,y+th+4);g.lineTo(x,y);g.stroke();g.strokeStyle=Q.b;g.lineWidth=1.6;g.stroke();g.strokeStyle=pal.ol;g.lineWidth=2.6;g.beginPath();g.ellipse(x,y-2,5,2.4,0,0,6.283);g.stroke();g.strokeStyle=Q.glow||Q.hi;g.lineWidth=1.1;g.stroke();g.beginPath();g.moveTo(x-5,y-2);g.lineTo(x+5,y-2);g.stroke()}})},
 /* quay stones: low wall sections along the edge with a pale cap, a notch and wet stains */
 quay(E,pr,i){const{pal,sp,P}=E,S=pal.stone,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=i%2,L=r(46,60),h=r(10,15),a=ax?9:L,b=ax?L:9;
  return sp(110,64,55,46,g=>{OD.shadow(g,55,46,L*.5,6,.3);const B=OD.box(g,55,44,a,b,h,{l:S[2],r:S[1],t:S[0]},pal.ol);
   const fc=ax?'r':'l';for(let k=1;k<8;k++){const u=k/8+r(-.02,.02);const A=OD.fp(B,fc,u,0),C=OD.fp(B,fc,u,1);g.strokeStyle='rgba(0,0,0,.42)';g.lineWidth=.8;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(C[0],C[1]);g.stroke()}
   for(const w of[.5]){const A=OD.fp(B,fc,0,w),C=OD.fp(B,fc,1,w);g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=.8;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(C[0],C[1]);g.stroke()}
   for(let k=0;k<4;k++){const u=r(0,.9),A=OD.fp(B,fc,u,0),C=OD.fp(B,fc,u+.08,.35);g.fillStyle='rgba(2,6,14,.4)';g.fillRect(A[0],C[1],C[0]-A[0]+2,A[1]-C[1])}
   g.strokeStyle=P(pal.hoop,.5);g.lineWidth=.9;g.beginPath();g.moveTo(B.t[3][0],B.t[3][1]);g.lineTo(B.t[0][0],B.t[0][1]);g.lineTo(B.t[1][0],B.t[1][1]);g.stroke();
   if(R()<.5){const q=OD.lp(B.t[ax?0:3],B.t[ax?3:2],r(.3,.7));g.fillStyle='#050912';g.beginPath();g.moveTo(q[0]-3,q[1]);g.lineTo(q[0],q[1]+3.4);g.lineTo(q[0]+3,q[1]);g.fill()}})},
 /* mooring bollards and drowned pilings with a ripple ring */
 post(E,pr,i){const{pal,sp,P}=E,S=pal.stone,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),pil=i%2;
  return sp(60,64,30,48,g=>{OD.shadow(g,31,48,15,5,.3);
   if(!pil){const h=r(14,20),w=r(5,7);g.fillStyle=OD.lin(g,30-w,0,30+w,0,[S[2],S[1],S[0]]);g.beginPath();g.moveTo(30-w,48);g.lineTo(30-w+1,48-h);g.lineTo(30+w-1,48-h);g.lineTo(30+w,48);g.ellipse(30,48,w,w*.45,0,0,3.1416);g.fill();g.strokeStyle=pal.ol;g.lineWidth=1;g.stroke();
    g.beginPath();g.ellipse(30,48-h,w+2.4,w*.55,0,0,6.283);g.fillStyle=S[0];g.fill();g.stroke();g.beginPath();g.ellipse(30,48-h-1,w*.7,w*.3,0,0,6.283);g.fillStyle=S[1];g.fill();
    g.strokeStyle=pal.ol;g.lineWidth=2;g.beginPath();g.moveTo(30+w,48-h*.5);g.quadraticCurveTo(30+w+10,48-h*.2,30+w+16,48+1);g.stroke();g.strokeStyle=P(pal.hoop,.6);g.lineWidth=.9;g.setLineDash([2,1.5]);g.stroke();g.setLineDash([])}
   else{for(let k=0;k<3;k++){const x=30+(k-1)*9+r(-2,2),h=r(18,36),w=r(2.8,3.6),lean=r(-2,2);g.beginPath();g.moveTo(x-w,48+k%2*2);g.lineTo(x-w+lean,48-h);g.lineTo(x+w+lean,48-h+r(-1,1));g.lineTo(x+w,48+k%2*2);g.closePath();g.fillStyle=OD.lin(g,x-w,0,x+w,0,[pal.wood[1],pal.wood[0]]);g.fill();g.strokeStyle=pal.ol;g.lineWidth=1;g.stroke();
     g.fillStyle=P('#3a7a6a',.45);g.fillRect(x-w,48-6,w*2,4);g.strokeStyle=P(pal.hoop,.5);g.lineWidth=.8;g.beginPath();g.ellipse(x,48+k%2*2,w+4,w*.9,0,0,6.283);g.stroke()}}})},
 /* a black pool: glass surface, sky streaks, ripples */
 pool(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),w=r(26,40),h=w*.46;
  return sp(100,56,50,28,g=>{OD.blob(g,50,28,w+3,h+2,R,'rgba(30,50,80,.35)',12);const k=R()*6;g.beginPath();for(let n=0;n<12;n++){const a=n/12*6.283,j=.86+R()*.2,x=50+Math.cos(a)*w*j,y=28+Math.sin(a)*h*j;n?g.lineTo(x,y):g.moveTo(x,y)}g.closePath();
   g.fillStyle=OD.lin(g,50,28-h,50,28+h,['#060a14','#0c1424','#04070e']);g.fill();g.strokeStyle='rgba(120,150,200,.35)';g.lineWidth=1;g.stroke();g.save();g.clip();
   for(let n=0;n<5;n++){g.fillStyle=P(pal.sheen,r(.1,.25));g.fillRect(50+r(-w,w*.5),28+r(-h,h),r(8,22),r(.8,1.6))}
   g.strokeStyle=P(pal.ripple,.4);g.lineWidth=.7;const cx=50+r(-w*.4,w*.4),cy=28+r(-h*.3,h*.3);for(let n=1;n<=4;n++){g.beginPath();g.ellipse(cx,cy,n*w*.12,n*h*.12,0,0,6.283);g.stroke()}g.restore()})},
 /* a lamp on a short pole, pale light on the wet ground */
 lamp(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),h=r(40,54);
  return sp(70,h+34,35,h+22,g=>{const bx=35,by=h+22;OD.glow(g,bx,by-2,26,'rgba(159,208,255,A)',.22);g.save();g.translate(bx,by);g.scale(1,.45);OD.glow(g,0,0,22,'rgba(159,208,255,A)',.3);g.restore();OD.shadow(g,bx+2,by+1,6,2.4,.35);
   g.lineCap='round';g.strokeStyle=pal.ol;g.lineWidth=4;g.beginPath();g.moveTo(bx,by);g.lineTo(bx,by-h);g.stroke();g.strokeStyle=pal.steel[1];g.lineWidth=2.2;g.stroke();g.strokeStyle=P(pal.hoop,.6);g.lineWidth=.7;g.beginPath();g.moveTo(bx-.7,by);g.lineTo(bx-.7,by-h);g.stroke();
   g.fillStyle=pal.ol;g.fillRect(bx-5,by-h-8,10,9);OD.glow(g,bx,by-h-3,16,'rgba(159,208,255,A)',.6);g.fillStyle='#e8f4ff';g.fillRect(bx-3,by-h-6,6,5);g.fillStyle=pal.ol;g.fillRect(bx-6,by-h-10,12,2.4)})}
});
Object.assign(PAINT,{
 /* ledger slab: dark grid, amber pads and drift ticks */
 gslab(E,pr,v){const{pal,P}=E;return ODT(E,pr.seed,v,(g,R,r)=>{
  g.fillStyle=pal.slab[v%pal.slab.length];g.fillRect(0,0,66,34);g.save();g.transform(1,.5,-1,.5,33,0);
  for(let i=0;i<5;i++){g.fillStyle=R()<.5?'rgba(0,0,0,'+r(.12,.25)+')':P(pal.line,r(.05,.12));g.fillRect(r(-4,28),r(-4,28),r(6,16),r(5,14))}
  g.strokeStyle=P(pal.line,.85);g.lineWidth=.8;for(let k=0;k<=4;k++){g.beginPath();g.moveTo(k*8.25,0);g.lineTo(k*8.25,33);g.stroke();g.beginPath();g.moveTo(0,k*8.25);g.lineTo(33,k*8.25);g.stroke()}
  g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=.6;for(let k=0;k<=4;k++){g.beginPath();g.moveTo(k*8.25+.9,0);g.lineTo(k*8.25+.9,33);g.stroke()}
  if(v%2===0){const c=((R()*3)|0)*8.25+1.2,d=((R()*3)|0)*8.25+1.2;g.strokeStyle=P(pal.amber,.55);g.lineWidth=.9;g.strokeRect(c,d,5.8,5.8);g.fillStyle=P(pal.amber,.18);g.fillRect(c,d,5.8,5.8)}
  for(let i=0;i<5;i++){const y=((R()*4)|0)*8.25,x=r(0,26),l=r(2,7);g.strokeStyle=P(pal.amber,r(.25,.75));g.lineWidth=1.1;g.beginPath();g.moveTo(x,y);g.lineTo(x+l,y);g.stroke();g.fillStyle=P(pal.hot,.9);g.fillRect(x+l-.5,y-.6,1.2,1.2)}
  g.restore();g.fillStyle=P(pal.line,.9);for(let i=0;i<10;i++)g.fillRect(r(8,58),r(4,30),r(1,2.2),.8)})},
 /* queued containers: one to three stacked, corrugated, with a label bar; the topmost ones are still pending (amber outline) */
 stack(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),lv=1+i%3,ax=(i>>1)&1,a=ax?18:r(32,40),b=ax?r(32,40):18,h=13;
  return sp(100,34+lv*h+22,50,34+lv*h+4,g=>{const bx=50,by=34+lv*h;OD.shadow(g,bx+3,by+2,a*.5+10,b*.3+3,.34);const ctr=pal.ctr;
   for(let L=0;L<lv;L++){const y=by-L*h,C=ctr[(i+L*2)%ctr.length],pend=L===lv-1&&(i%4<2),B=OD.box(g,bx+r(-1.5,1.5),y,a,b,h,{l:C[0],r:C[1],t:C[2]},pal.ol),fc=ax?'r':'l',oc=ax?'l':'r';
    const ln=ax?b:a;for(let k=1;k<Math.round(ln/3.2);k++){const u=k/Math.round(ln/3.2),A=OD.fp(B,ax?'l':'l',u,0.04),Z=OD.fp(B,ax?'l':'l',u,.96);if(!ax){g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=.8;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(Z[0],Z[1]);g.stroke()}}
    const bar=[OD.fp(B,'l',.1,.62),OD.fp(B,'l',.6,.62),OD.fp(B,'l',.6,.8),OD.fp(B,'l',.1,.8)];OD.poly(g,bar,P(pal.amber,pend?.8:.45));g.fillStyle='rgba(0,0,0,.55)';for(let k=0;k<4;k++){const q=OD.fp(B,'l',.14+k*.11,.66);g.fillRect(q[0],q[1]-1,1.5,3)}
    const d1=OD.fp(B,'r',.18,.1),d2=OD.fp(B,'r',.82,.9);g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=.8;g.strokeRect(Math.min(d1[0],d2[0]),Math.min(d1[1],d2[1]),Math.abs(d2[0]-d1[0]),Math.abs(d2[1]-d1[1])*.96);
    g.fillStyle=P(pal.hi,.18);OD.poly(g,[B.t[0],B.t[1],OD.lp(B.t[1],B.t[2],.5),OD.lp(B.t[0],B.t[3],.5)],P(pal.hi,.1));
    if(pend){g.strokeStyle=P(pal.hot,.85);g.lineWidth=1;g.beginPath();g.moveTo(B.t[3][0],B.t[3][1]);g.lineTo(B.t[0][0],B.t[0][1]);g.lineTo(B.t[1][0],B.t[1][1]);g.lineTo(B.t[2][0],B.t[2][1]);g.closePath();g.stroke();OD.glow(g,(B.t[0][0]+B.t[2][0])/2,(B.t[0][1]+B.t[2][1])/2,a*.5,'rgba(247,147,26,A)',.22);g.fillStyle=P(pal.amber,.2);OD.poly(g,B.t,P(pal.amber,.22))}}})},
 /* fee-rate obelisk: a tall slab with rows of amber dashes climbing both faces */
 obelisk(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),h=r(60,96);
  return sp(64,h+46,32,h+34,g=>{const bx=32,by=h+34;OD.shadow(g,bx+3,by+2,22,7,.36);const C=pal.ctr[1];
   OD.box(g,bx,by,26,26,5,{l:C[0],r:C[1],t:C[2]},pal.ol);const B=OD.box(g,bx,by-5,15,15,h,{l:'#0c1226',r:'#161e3a',t:'#222c52'},pal.ol);
   for(const fc of['l','r'])for(let k=0;k<h/5.5;k++){const w=k*5.5/h,l=r(.2,.8),u=fc==='l'?.12:.14,A=OD.fp(B,fc,u,w+.02),Z=OD.fp(B,fc,u+l*.74,w+.02);if(R()<.18)continue;g.strokeStyle=P(R()<.2?pal.hot:pal.amber,r(.5,1)*(.7+.3*(1-w)));g.lineWidth=1.1;g.beginPath();g.moveTo(A[0],A[1]);g.lineTo(Z[0],Z[1]);g.stroke()}
   g.strokeStyle=P(pal.hot,.9);g.lineWidth=1;g.beginPath();g.moveTo(B.t[3][0],B.t[3][1]);g.lineTo(B.t[0][0],B.t[0][1]);g.lineTo(B.t[1][0],B.t[1][1]);g.lineTo(B.t[2][0],B.t[2][1]);g.closePath();g.stroke();
   OD.glow(g,bx,by-5-h,18,'rgba(247,147,26,A)',.55);g.fillStyle=P('#ffe0a8',.95);OD.poly(g,B.t,P('#ffd08a',.75))})},
 /* hovering blocks: unconfirmed, amber-edged, a glow on the slab beneath */
 float(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),n=1+i%3;
  return sp(90,100,45,84,g=>{const bx=45,by=84;g.save();g.translate(bx,by);g.scale(1,.46);OD.glow(g,0,0,30,'rgba(247,147,26,A)',.28);g.restore();OD.shadow(g,bx,by,16,6,.3);
   for(let k=0;k<n;k++){const s=r(10,17),ox=(k-(n-1)/2)*r(15,22),hy=r(22,48)+k%2*8,x=bx+ox,y=by-hy;OD.glow(g,x,y-s*.6,s*2,'rgba(247,147,26,A)',.26);
    const B=OD.box(g,x,y,s,s,s*.85,{l:'rgba(201,116,42,.16)',r:'rgba(201,116,42,.26)',t:'rgba(247,147,26,.4)'},null);
    g.strokeStyle=P(pal.hot,.95);g.lineWidth=1;g.beginPath();for(const q of[B.t[3],B.t[0],B.t[1],B.t[2],B.t[3]])g.lineTo(q[0],q[1]);g.stroke();g.beginPath();g.moveTo(B.p[3][0],B.p[3][1]);g.lineTo(B.p[2][0],B.p[2][1]);g.lineTo(B.p[1][0],B.p[1][1]);g.moveTo(B.p[2][0],B.p[2][1]);g.lineTo(B.t[2][0],B.t[2][1]);g.moveTo(B.p[3][0],B.p[3][1]);g.lineTo(B.t[3][0],B.t[3][1]);g.moveTo(B.p[1][0],B.p[1][1]);g.lineTo(B.t[1][0],B.t[1][1]);g.strokeStyle=P(pal.amber,.7);g.stroke();
    g.fillStyle=P('#ffe0a8',.9);g.fillRect(x-1,y-s*.5,2,2);OD.shadow(g,x,by+2,s*.7,s*.28,.16)}})},
 /* queue line: stanchions with an amber belt, along the edge */
 queue(E,pr,i){const{pal,sp,P}=E,R=mulberry32(pr.seed+i),r=(a,b)=>a+R()*(b-a),ax=i%2,L=r(46,60),ux=(ax?-1:1)*.894,uy=.447,n=4,hp=r(15,19);
  return sp(100,50,50,38,g=>{const bx=50,by=38,Q=[];for(let k=0;k<n;k++){const t=(k/(n-1)-.5)*L;Q.push([bx+ux*t,by+uy*t])}g.lineCap='round';
   for(const q of Q)OD.shadow(g,q[0]+2,q[1]+1,4,1.8,.3);
   for(const f of[.92,.6]){g.strokeStyle=pal.ol;g.lineWidth=3.6;g.beginPath();Q.forEach((q,k)=>{const x=q[0],y=q[1]-hp*f+(k%2?0:0);k?g.quadraticCurveTo((x+g.__x)/2,Math.max(y,g.__y)+2.6,x,y):g.moveTo(x,y);g.__x=x;g.__y=y});g.stroke();g.strokeStyle=P(pal.amber,.9);g.lineWidth=2.1;g.stroke();g.strokeStyle=P(pal.hot,.6);g.lineWidth=.7;g.stroke()}
   Q.forEach(q=>{g.strokeStyle=pal.ol;g.lineWidth=3.8;g.beginPath();g.moveTo(q[0],q[1]);g.lineTo(q[0],q[1]-hp);g.stroke();g.strokeStyle='#2a3658';g.lineWidth=2.1;g.stroke();g.strokeStyle=P(pal.hi,.5);g.lineWidth=.7;g.beginPath();g.moveTo(q[0]-.7,q[1]);g.lineTo(q[0]-.7,q[1]-hp);g.stroke();g.fillStyle=pal.ol;g.beginPath();g.ellipse(q[0],q[1],4.4,2,0,0,6.283);g.fill();g.fillStyle='#3a4a74';g.beginPath();g.ellipse(q[0],q[1]-.6,3.4,1.5,0,0,6.283);g.fill();
    g.fillStyle=pal.ol;g.beginPath();g.arc(q[0],q[1]-hp-1,2.6,0,6.283);g.fill();OD.glow(g,q[0],q[1]-hp-1,7,'rgba(247,147,26,A)',.4);g.fillStyle=pal.hot;g.beginPath();g.arc(q[0],q[1]-hp-1,1.4,0,6.283);g.fill()})})}
});
Object.assign(DEAD,{
 farm:{mode:'scene',only:[3],
  pal:{ol:'#05080e',soil:['#1a2332','#1e2a3c','#18202e','#202c40','#1b2434'],ridge:'#3a4f6a',glow:'#59e0e6',stalk:['#3e5c60','#4b6a62','#2f4a52'],
   wood:['#3a3f4a','#2a2f3a'],woodHi:'#6c7686',steel:['#5c7684','#3a4c5a','#2a3846'],
   hay:['#7a7a52','#575a3c','#34382a'],wrap:[['#2a3447','#141a28','#0c1018'],['#5e6a48','#3e4630','#262c1e']],
   barn:['#212a3a','#2c384c','#34425a'],roof:'#131a28',hedge:['#143028','#1c3f36','#0b1b18'],hi:'#3f7a6c',
   fog:[[0,'rgba(60,170,190,.42)'],[.55,'rgba(50,140,165,.2)'],[1,'rgba(40,120,150,0)']]},
  props:{
   ground:{paint:'tilled',n:5,seed:3000},
   fence:{paint:'fence',n:6,seed:3100,ori:1},
   hedge:{paint:'bush',n:6,seed:3200,pk:'hedge',row:1,w:[40,54],h:[20,30],twig:3,leaf:56,ori:1},
   crops:{paint:'crops',n:6,seed:3300,ori:1},
   hay:{paint:'hay',n:6,seed:3400,stacks:3,wrap:[[ '#2a3447','#141a28','#0c1018' ],['#5e6a48','#3e4630','#262c1e']]},
   barn:{paint:'barn',n:3,seed:3500},
   mast:{paint:'mast',n:3,seed:3600,h:[56,84]},
   fog:{paint:'fog',n:1,w:160,h:56}},
  bands:[{d:[0,2],pick:[[.22,'crops']]},
         {d:[2,3],pick:[[.66,'fence'],[.92,'hedge']]},
         {d:[3,4],pick:[[.4,'hedge'],[.62,'hay'],[.78,'crops'],[.82,'mast']]},
         {d:[4,9],pick:[[.2,'crops'],[.32,'hay'],[.44,'hedge'],[.475,'barn'],[.52,'mast'],[.6,'fence']]},
         {d:[9,1e9],pick:[[.14,'crops'],[.22,'hay'],[.245,'barn'],[.27,'mast'],[.32,'hedge']]}],
  edge:2,ramp:{col:'3,5,10',near:[2,.5],far:[3,.07,.38]},
  fog:{dmax:6,p:.2,a:[.5,.3],dx:2,dy:-26}}
});
Object.assign(DEAD,{
 garden:{mode:'scene',
  pal:{ol:'#04100c',grd:['#13281f','#162d24','#112419','#15302a','#12281f'],flag:['#4c625c','#3c504b','#566c64'],moss:['#2e6a4c','#3c7c5c','#244e3a'],blade:['#3a8060','#2c6a4c','#4c9a72'],leafLit:['#4c9a72','#6ab890','#3a8060'],
   bloom:'#dffff0',glow:'#9fffe0',hi:'#5fa88c',leaf:['#183a2e','#2a5a46','#0a1c15'],stone:['#8fa39d','#5d726d','#38494a'],
   fog:[[0,'rgba(170,230,215,.42)'],[.55,'rgba(150,215,200,.2)'],[1,'rgba(140,205,190,0)']]},
  props:{
   ground:{paint:'mossy',n:5,seed:8000},
   hedge:{paint:'bush',n:6,seed:8100,pk:'leaf',row:1,w:[40,56],h:[26,40],leaf:64,spark:4,ori:1},
   grove:{paint:'bush',n:6,seed:8200,pk:'leaf',w:[40,60],h:[44,70],nb:10,leaf:90,spark:5},
   topi:{paint:'topi',n:4,seed:8300},
   statue:{paint:'statue',n:4,seed:8400},
   pergola:{paint:'pergola',n:3,seed:8500},
   frond:{paint:'frond',n:5,seed:8600},
   fog:{paint:'fog',n:1,w:160,h:56}},
  bands:[{d:[0,2],pick:[[.24,'frond']]},
         {d:[2,3],pick:[[.78,'hedge'],[.86,'statue'],[.93,'topi'],[1.01,'frond']]},
         {d:[3,4],pick:[[.3,'hedge'],[.4,'statue'],[.52,'topi'],[.58,'pergola'],[.74,'grove'],[.88,'frond']]},
         {d:[4,9],pick:[[.3,'grove'],[.4,'hedge'],[.46,'statue'],[.52,'pergola'],[.58,'topi'],[.8,'frond']]},
         {d:[9,1e9],pick:[[.2,'grove'],[.28,'hedge'],[.31,'pergola'],[.5,'frond']]}],
  edge:2,gap:[5,4],ramp:{col:'3,10,8',near:[2,.5],far:[3,.07,.5]},
  fog:{dmax:6,p:.22,a:[.5,.3],dx:2,dy:-26}}
});
Object.assign(DEAD,{
 mempool:{mode:'scene',
  pal:{ol:'#04060e',slab:['#0c1326','#0e162a','#0a1022','#101a2e','#0d1428'],line:'#1c2a4a',amber:'#c9742a',hot:'#ffb060',hi:'#8a9ac8',
   ctr:[['#141a36','#1e2850','#2a3566'],['#1a2240','#26325e','#34437a'],['#22202e','#312c44','#443e5c']],
   pipe:{a:'#6a4a2a',b:'#34261a',hi:'#c9742a',glow:'#ffb060'},cond:{a:'#6a4a2a',b:'#34261a',hi:'#c9742a',glow:'#ffb060'},
   fog:[[0,'rgba(200,110,40,.3)'],[.55,'rgba(160,90,40,.14)'],[1,'rgba(120,70,40,0)']]},
  props:{
   ground:{paint:'gslab',n:5,seed:2900},
   queue:{paint:'queue',n:6,seed:3000,ori:1},
   stack:{paint:'stack',n:8,seed:3100},
   obelisk:{paint:'obelisk',n:3,seed:3200},
   float:{paint:'float',n:6,seed:3300},
   cond:{paint:'pipe',n:6,seed:3400,pk:'cond',ori:1},
   fog:{paint:'fog',n:1,w:180,h:60}},
  bands:[{d:[0,2],pick:[[.16,'cond']]},
         {d:[2,3],pick:[[.66,'queue'],[.82,'stack'],[.9,'cond'],[.94,'obelisk']]},
         {d:[3,4],pick:[[.3,'stack'],[.4,'queue'],[.5,'cond'],[.58,'obelisk'],[.7,'float']]},
         {d:[4,9],pick:[[.2,'stack'],[.3,'float'],[.36,'obelisk'],[.44,'cond'],[.5,'queue']]},
         {d:[9,1e9],pick:[[.12,'stack'],[.2,'float'],[.24,'obelisk']]}],
  edge:2,ramp:{col:'3,4,10',near:[2,.5],far:[3,.07,.5]},
  fog:{dmax:6,p:.18,a:[.4,.3],dx:2,dy:-24}}
});
Object.assign(DEAD,{
 still:{mode:'scene',
  pal:{ol:'#04060e',slab:['#0e1424','#101828','#0c1220','#121a2c','#0f1626'],sheen:'#6a8cc0',ripple:'#8fb4e8',hoop:'#8aa6d0',glow:'#9fd0ff',
   steel:['#5a7aa8','#34486c','#18233a'],stone:['#56688c','#394a6e','#222f4c'],wood:['#2c3650','#1c2438'],
   pipe:{a:'#4a6490',b:'#26364f',hi:'#8aa6d0',glow:null},
   fog:[[0,'rgba(90,130,200,.5)'],[.55,'rgba(70,110,180,.26)'],[1,'rgba(60,100,170,0)']]},
  props:{
   ground:{paint:'slabw',n:5,seed:1600},
   quay:{paint:'quay',n:6,seed:1700,ori:1},
   post:{paint:'post',n:4,seed:1800},
   vat:{paint:'vat',n:6,seed:1900,tanks:4},
   pipe:{paint:'pipe',n:6,seed:2000,ori:1},
   pool:{paint:'pool',n:4,seed:2100},
   lamp:{paint:'lamp',n:2,seed:2200},
   fog:{paint:'fog',n:1,w:200,h:68}},
  bands:[{d:[0,2],pick:[[.1,'pool'],[.2,'post']]},
         {d:[2,3],pick:[[.62,'quay'],[.76,'post'],[.86,'pipe'],[.92,'vat'],[.95,'lamp']]},
         {d:[3,4],pick:[[.22,'vat'],[.38,'pipe'],[.5,'quay'],[.58,'post'],[.62,'lamp'],[.76,'pool']]},
         {d:[4,9],pick:[[.16,'vat'],[.26,'pipe'],[.4,'pool'],[.46,'post'],[.52,'quay'],[.55,'lamp']]},
         {d:[9,1e9],pick:[[.1,'vat'],[.2,'pool'],[.26,'post'],[.29,'lamp']]}],
  edge:2,ramp:{col:'2,4,10',near:[2,.5],far:[3,.07,.5]},
  fog:{dmax:6,p:.3,a:[.5,.35],dx:2,dy:-24}}
});
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
/* The veil above only ever subtracts darkness, so a lamp could never put its own
   colour on the floor: near the player there was no darkness left for it to
   remove. GLW is the other half -- the light a lamp adds, composited with
   'lighter' so it brightens and tints whatever it falls on. Quarter res like the
   veil, one extra composite. */
const GLW=mk(8,8),glg=GLW.getContext('2d');
/* Every name and bubble this frame has already printed, in screen pixels. A new one
   that would land on a rectangle already taken steps up until it is clear, so two
   people standing together, or a pile of drops, do not print over each other.
   Cleared at the top of render(). First to draw keeps its place. */
let LBOX=[];
function boxFree(x,y,w,h){for(let i=0;i<LBOX.length;i++){const b=LBOX[i];
  if(x<b.x+b.w&&x+w>b.x&&y<b.y+b.h&&y+h>b.y)return false}return true}
/* The first clear y at or above the one asked for, stepping by step, or null when
   every step is taken. Null means do not draw: past a certain crowd another row of
   text is unreadable anyway, and printing it on top of what is already there is
   worse than leaving it out. Names get many steps, so a pile of drops stacks the
   way it should; a bubble gets a few, since twelve at once cannot be read. */
function txtSlot(x,y,w,h,step,tries){for(let i=0;i<tries;i++){const yy=y-i*step;
  if(boxFree(x,yy,w,h))return yy}return null}
function txtClaim(x,y,w,h){LBOX.push({x,y,w,h})}
function resize(){const r=cv.getBoundingClientRect();CW=r.width;CH=r.height;DPR=Math.min(2,window.devicePixelRatio||1);cv.width=Math.max(1,CW*DPR);cv.height=Math.max(1,CH*DPR);ZM=clamp(Math.min(CW,CH)/560,.68,1.25);VW=CW/ZM;VH=CH/ZM;LC.width=Math.ceil(VW/4);GLW.width=Math.ceil(VW/4);GLW.height=Math.ceil(VH/4);LC.height=Math.ceil(VH/4)}
addEventListener('resize',resize);
const SX=(x,y)=>(x-y)*32-cx+VW/2, SY=(x,y)=>(x+y)*16-cy+VH*.44;
/* Every shape an actor is made of is stroked with this. Keeping it a variable
   means one assignment relights a whole figure -- see rimLight. */
const OL0='#0b0912';let OL=OL0;
/* Lighting, in three numbers. They are a set: loosening one undoes another, so
   tune them together and look at a district with monsters in it, not an empty
   one. tools/light-check.js measures what they do. */
const PCARRY_S=.72,   /* how bright the light the player carries is */
      PCARRY_R=.78,   /* and how far it reaches */
      PFILL_K=.34,    /* what is left of the flat fill over the whole view */
      GLOW_K=.30;     /* how much a lamp gives back, additively */
function shadow(X,Y,r){ctx.fillStyle='rgba(0,0,0,.26)';ctx.beginPath();ctx.ellipse(X,Y,r*1.18,r*.6,0,0,6.283);ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.44)';ctx.beginPath();ctx.ellipse(X,Y,r*.72,r*.36,0,0,6.283);ctx.fill()}
function box(x,y,w,h,r,col){ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=col;ctx.fill();ctx.stroke()}
function poly(pts,col){ctx.beginPath();ctx.moveTo(pts[0],pts[1]);for(let i=2;i<pts.length;i+=2)ctx.lineTo(pts[i],pts[i+1]);ctx.closePath();ctx.fillStyle=col;ctx.fill();ctx.stroke()}
function glow(X,Y,r,col,a){const g=ctx.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.globalCompositeOperation='lighter';ctx.globalAlpha=a;ctx.fillStyle=g;ctx.fillRect(X-r,Y-r,r*2,r*2);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over'}
function light(X,Y,r,col,s,own){own=own||0;if(OPT.fx==='thin'&&own<2)return;LIGHTS.push({X,Y,r,col,s:s===undefined?1:s,own});
  while(LIGHTS.length>16){let i=-1;for(let j=0;j<LIGHTS.length;j++)if(LIGHTS[j].own<1){i=j;break}
    if(i<0)for(let j=0;j<LIGHTS.length;j++)if(LIGHTS[j].own<2){i=j;break}
    if(i<0)break;LIGHTS.splice(i,1)}}
function fxShow(f){if(!f)return false;if(f.k==='mark')return true;if(OPT.fx==='thin'&&f.remote)return false;return true}
/* Baked effect flipbooks. A shape used to be a path rebuilt from scratch every
   frame, so it could do little but fade. Each kind and colour now bakes once
   into a strip of frames and the draw is one drawImage: livelier than the paths
   it replaces, and cheaper. Looping kinds bake seamlessly and run off the clock;
   one-shot kinds index off their own age. A kind with no painter here falls
   through to the hand-drawn code below, so nothing regresses. */
const FXN=16;
const fxh=n=>{const v=Math.sin(n*127.1)*43758.5453;return v-Math.floor(v)};
const FXART={
 patch:{w:96,h:96,n:12,loop:1,rate:.5,f:(g,t,q,w)=>{const R=w/2,sp=t*.5236;
   const gr=g.createRadialGradient(0,0,0,0,0,R);gr.addColorStop(0,'rgba('+q+',.02)');gr.addColorStop(.74,'rgba('+q+',.15)');gr.addColorStop(1,'rgba('+q+',.01)');
   g.fillStyle=gr;g.beginPath();g.arc(0,0,R,0,6.283);g.fill();
   g.strokeStyle='rgba('+q+',.8)';g.lineWidth=2.2;g.beginPath();g.arc(0,0,R*.9,0,6.283);g.stroke();
   g.strokeStyle='rgba('+q+',1)';g.lineWidth=3.2;for(let i=0;i<12;i++){const a=sp+i*.5236;g.beginPath();g.arc(0,0,R*.9,a,a+.13);g.stroke()}
   g.strokeStyle='rgba('+q+',.28)';g.lineWidth=1.4;for(let i=0;i<3;i++){const a=-t*6.283+i*2.094;g.beginPath();g.arc(0,0,R*(.4+.16*i),a,a+1.2);g.stroke()}}},
 mark:{w:40,h:40,n:12,loop:1,rate:1.1,f:(g,t,q,w)=>{const R=w/2,s=Math.sin(t*6.283);
   g.strokeStyle='rgba('+q+',' +(.3+.25*s)+')';g.lineWidth=1.6;g.beginPath();g.arc(0,0,R*(.52+.12*s),0,6.283);g.stroke();
   g.save();g.rotate(t*1.5708);g.fillStyle='rgba('+q+',1)';g.fillRect(-R*.2,-R*.2,R*.4,R*.4);
   g.fillStyle='rgba(255,255,255,.85)';g.fillRect(-R*.08,-R*.08,R*.16,R*.16);g.restore()}},
 ring:{w:104,h:104,n:8,f:(g,t,q,w)=>{const R=w/2,r=R*(.1+.78*t),a=1-t;
   g.fillStyle='rgba('+q+','+(a*.14)+')';g.beginPath();g.arc(0,0,r,0,6.283);g.fill();
   g.strokeStyle='rgba('+q+','+a+')';g.lineWidth=1.5+5*a;g.beginPath();g.arc(0,0,r,0,6.283);g.stroke();
   g.strokeStyle='rgba(255,255,255,'+(a*.7)+')';g.lineWidth=1.2;g.beginPath();g.arc(0,0,r*.93,0,6.283);g.stroke();
   g.fillStyle='rgba('+q+','+(a*.8)+')';for(let i=0;i<10;i++){const an=i*.6283+fxh(i)*.4,rr=r*(1.02+.1*fxh(i+7));g.beginPath();g.arc(Math.cos(an)*rr,Math.sin(an)*rr,1.6*a+.5,0,6.283);g.fill()}}},
 arc:{w:96,h:96,n:8,f:(g,t,q,w)=>{const R=w/2,a=1-t,sw=.85+t*.5;
   g.lineCap='round';
   for(const[lw,cl,rr]of[[13,'rgba(255,170,80,'+a*.35+')',1],[6.5,'rgba(255,240,210,'+a+')',1],[2.6,'rgba(255,255,255,'+a*.85+')',.84]]){
     g.strokeStyle=cl;g.lineWidth=lw;g.beginPath();g.arc(0,0,R*.86*rr,-sw+t*.5,sw+t*.5);g.stroke()}
   g.lineCap='butt';
   g.fillStyle='rgba(255,245,220,'+a*.9+')';for(let i=0;i<7;i++){const an=-sw+i/6*sw*2+t*.5,rr=R*.86*(1+t*.18);g.beginPath();g.arc(Math.cos(an)*rr,Math.sin(an)*rr,1.8*a+.4,0,6.283);g.fill()}}},
 trail:{w:160,h:40,n:8,f:(g,t,q,w,h)=>{const L=w/2,a=1-t,N=14;
   const th=(p,o)=>(h*.44)*(1-p)*(1-p*.28)*a+(fxh(o+p*11+Math.floor(t*4))-.5)*h*.07;
   g.beginPath();
   for(let i=0;i<=N;i++){const p=i/N,x=-L+p*w;if(i)g.lineTo(x,-th(p,0));else g.moveTo(x,-th(p,0))}
   for(let i=N;i>=0;i--){const p=i/N;g.lineTo(-L+p*w,th(p,31))}
   g.closePath();
   const gr=g.createLinearGradient(-L,0,L,0);
   gr.addColorStop(0,'rgba('+q+','+a*.95+')');gr.addColorStop(.5,'rgba('+q+','+a*.5+')');gr.addColorStop(1,'rgba('+q+',0)');
   g.fillStyle=gr;g.fill();
   g.lineCap='round';g.strokeStyle='rgba(255,255,255,'+a*.8+')';g.lineWidth=2.4*a+.6;
   g.beginPath();g.moveTo(-L*.93,0);g.lineTo(L*.08,0);g.stroke();g.lineCap='butt';
   g.fillStyle='rgba('+q+','+a*.85+')';
   for(let i=0;i<9;i++){const x=-L+fxh(i*1.7)*w,y=(fxh(i+4)-.5)*h*.95*(.35+t);g.beginPath();g.arc(x,y,1.7*a+.4,0,6.283);g.fill()}}},
 bolt:{w:176,h:48,n:8,f:(g,t,q,w,h)=>{const L=w/2,a=1-t,seg=9;
   g.lineJoin='round';g.lineCap='round';
   const pts=[];for(let i=0;i<=seg;i++){const p=i/seg;pts.push([-L+p*w,(fxh(i*3.3+Math.floor(t*4))-.5)*h*.62*Math.sin(p*3.14159)])}
   for(const[lw,cl]of[[18,'rgba('+q+','+a*.16+')'],[9,'rgba('+q+','+a*.4+')'],[3.6,'rgba('+q+','+a+')'],[1.4,'rgba(255,255,255,'+a*.95+')']]){
     g.strokeStyle=cl;g.lineWidth=lw;g.beginPath();g.moveTo(pts[0][0],pts[0][1]);for(const p of pts)g.lineTo(p[0],p[1]);g.stroke()}
   g.strokeStyle='rgba('+q+','+a*.65+')';g.lineWidth=1.3;
   for(let b=0;b<3;b++){const i=2+b*3,p=pts[i];if(!p)continue;g.beginPath();g.moveTo(p[0],p[1]);g.lineTo(p[0]+(fxh(b+t*5)-.5)*h*.7,p[1]+(fxh(b+9)-.5)*h*.9);g.stroke()}
   g.lineCap='butt'}},
 /* The danger telegraph. It carries a radius, a fuse and the damage it will
    do, and the old one barely changed over that fuse. Frames index on the
    fuse, so the disc closing in is the actual time left. */
 warn:{w:128,h:128,n:12,f:(g,t,q,w)=>{const R=w/2*.92;
   g.fillStyle='rgba(255,68,58,'+(.1+.12*t)+')';g.beginPath();g.arc(0,0,R,0,6.283);g.fill();
   g.fillStyle='rgba(255,96,72,'+(.2+.26*t)+')';g.beginPath();g.arc(0,0,R*t,0,6.283);g.fill();
   g.strokeStyle='rgba(255,126,104,.95)';g.lineWidth=2.4;g.beginPath();g.arc(0,0,R,0,6.283);g.stroke();
   g.strokeStyle='rgba(255,214,196,'+(.45+.55*t)+')';g.lineWidth=3.6;
   for(let i=0;i<10;i++){const a=t*1.1+i*.6283;g.beginPath();g.arc(0,0,R,a,a+.13);g.stroke()}
   g.strokeStyle='rgba(255,160,140,'+(.3+.5*t)+')';g.lineWidth=2;
   for(let i=0;i<4;i++){const a=i*1.5708-t*.8;g.save();g.rotate(a);
     g.beginPath();g.moveTo(R*.5,-R*.13);g.lineTo(R*.66,0);g.lineTo(R*.5,R*.13);g.stroke();g.restore()}
   if(t>.82){const f=(t-.82)/.18;g.fillStyle='rgba(255,246,236,'+(f*.7)+')';g.beginPath();g.arc(0,0,R,0,6.283);g.fill()}}},
 strike:{w:72,h:272,n:8,f:(g,t,q,w,h)=>{const a=1-t;
   g.lineCap='round';
   for(const[lw,cl]of[[11,'rgba(154,108,255,'+a*.22+')'],[4.4,'rgba(216,200,255,'+a+')'],[1.6,'rgba(255,255,255,'+a*.9+')']]){
     g.strokeStyle=cl;g.lineWidth=lw;g.beginPath();g.moveTo((fxh(1)-.5)*w*.3,-h/2);
     for(let i=1;i<7;i++)g.lineTo((fxh(i+t*3)-.5)*w*.44,-h/2+i*h/7);
     g.lineTo(0,h/2);g.stroke()}
   g.fillStyle='rgba(236,228,255,'+a*.8+')';
   for(let i=0;i<6;i++){g.beginPath();g.arc((fxh(i+2)-.5)*w*.7,h/2-fxh(i+5)*h*.3,1.8*a+.5,0,6.283);g.fill()}
   g.lineCap='butt'}},
 shard:{w:72,h:72,n:8,f:(g,t,q,w)=>{const R=w/2,a=1-t;
   g.fillStyle='rgba(238,246,255,'+a+')';
   for(let i=0;i<6;i++){const an=i*1.047+t*.5,d=R*(.2+.7*t);
     g.save();g.translate(Math.cos(an)*d,Math.sin(an)*d);g.rotate(an);
     g.fillRect(-1.3,-R*.22*(1-t*.4),2.6,R*.44*(1-t*.4));g.restore()}
   g.fillStyle='rgba(255,255,255,'+a*.8+')';g.beginPath();g.arc(0,0,R*.12*a,0,6.283);g.fill()}},
 beam:{w:64,h:224,n:8,f:(g,t,q,w,h)=>{const a=1-t;
   const gr=g.createLinearGradient(0,-h/2,0,h/2);
   gr.addColorStop(0,'rgba('+q+',0)');gr.addColorStop(.3,'rgba('+q+','+a*.75+')');gr.addColorStop(1,'rgba('+q+','+a*.95+')');
   g.fillStyle=gr;g.fillRect(-w*.07,-h/2,w*.14,h);
   g.fillStyle='rgba(255,255,255,'+a*.85+')';g.fillRect(-w*.025,-h/2,w*.05,h);
   g.fillStyle='rgba('+q+','+a*.5+')';
   for(let i=0;i<4;i++){const y=-h/2+((t*1.4+i*.25)%1)*h;g.beginPath();g.ellipse(0,y,w*.17,h*.015,0,0,6.283);g.fill()}}},
 mote:{w:24,h:24,n:12,loop:1,rate:1.4,f:(g,t,q,w)=>{const R=w/2,s=.7+.3*Math.sin(t*6.283);
   const gr=g.createRadialGradient(0,0,0,0,0,R*s);gr.addColorStop(0,'rgba(255,255,255,.95)');gr.addColorStop(.4,'rgba('+q+',.85)');gr.addColorStop(1,'rgba('+q+',0)');
   g.fillStyle=gr;g.beginPath();g.arc(0,0,R*s,0,6.283);g.fill()}}
};
let FXC={};
function fxSheet(k,col){const key=k+'|'+col;if(key in FXC)return FXC[key];
  const d=FXART[k];if(!d){FXC[key]=null;return null}
  const rgb=hex2rgb(col&&col.charAt(0)==='#'&&col.length>=7?col:'#ffffff'),q=rgb[0]+','+rgb[1]+','+rgb[2];
  const n=d.n||FXN,c=mk(d.w*n,d.h),g=c.getContext('2d');
  for(let i=0;i<n;i++){const t=d.loop?i/n:i/(n-1);
    g.save();g.translate(i*d.w+d.w/2,d.h/2);d.f(g,t,q,d.w,d.h);g.restore()}
  const sh={c:c,w:d.w,h:d.h,n:n,loop:d.loop||0,rate:d.rate||1};FXC[key]=sh;return sh}
/* One frame of a baked kind, centred on X,Y and stretched to w,h. Returns false
   when the kind has no painter so the caller can draw it the old way. */
function fxBlit(k,col,u,X,Y,w,h,rot,alpha,squash){const sh=fxSheet(k,col);if(!sh)return false;
  if(w>sh.w*1.7)return false;
  const n=sh.n;let i=sh.loop?Math.floor(tNow*sh.rate*n)%n:Math.floor(u*n);
  if(i<0)i=0;if(i>=n)i=n-1;
  ctx.save();ctx.globalAlpha=alpha===undefined?1:alpha;ctx.translate(X,Y);
  if(squash)ctx.scale(1,squash);
  if(rot)ctx.rotate(rot);
  ctx.drawImage(sh.c,i*sh.w,0,sh.w,sh.h,-w/2,-h/2,w,h);ctx.restore();ctx.globalAlpha=1;return true}
/* Every shape and colour the game can throw. Baking them up front costs a few
   hundred milliseconds once; leaving it to chance costs a hitch the first time
   each one fires, which is always mid-fight. */
function fxPairs(cls){const seen={},out=[];
  const add=(k,c)=>{if(!FXART[k]||!c)return;const key=k+'|'+c;if(seen[key])return;seen[key]=1;out.push([k,c])};
  /* Read the table, not skvOf: a skill's colour can fall back to its damage
     type, and that needs a live character, which there is not one of yet. So
     every colour a row could resolve to gets baked. */
  for(const c0 in SKV){if(cls&&c0!==cls)continue;const cls2=c0,rows=SKV[c0],cc=(CLS[c0]&&CLS[c0].col)||'#e6e2d6';
    for(const i in rows){const row=rows[i],k=row.k;if(!FXART[k]&&k!=='orbit')continue;
      const ks=k==='orbit'?['mote']:[k];
      /* With a character in hand skvOf gives the one colour this skill will
         actually wear. Without one it can throw, and every damage type the
         skill might resolve to has to be covered instead. */
      let exact=null;try{const v=skvOf(cls2,+i);if(v&&v.col)exact=v.col}catch(e){}
      for(let z=0;z<ks.length;z++){
        if(row.col){add(ks[z],row.col);continue}
        if(exact){add(ks[z],exact);continue}
        add(ks[z],cc);for(const ty in DTY)add(ks[z],DTY[ty].c)}}}
  for(const i in AURACOL){add('patch',AURACOL[i]);add('ring',AURACOL[i])}
  for(const ty in DTY)add('mote',DTY[ty].c);
  /* Everything the world itself can ask for, as opposed to a skill. A pair that
     is not in this list is baked the first time something draws it, which is the
     frame that thing is already swinging in -- and against a hostile player
     waiting at the door, a hitch is a death. tools/lazy-bake.js walks the zones
     and fails if any sheet is born after the loading curtain lifts; when it
     names one, it belongs here. The ring colours are boss slams, which is
     exactly the worst moment to stop and draw. */
  const extra=[['warn','#ff5d4d'],['strike','#9a6cff'],['shard','#eef6ff'],['beam','#59e0e6'],['beam','#ff7a3c'],
    ['patch','#ff7a3c'],['patch','#e6e2d6'],['patch','#9a6cff'],['patch','#7be495'],['patch','#c9b6ff'],
    ['trail','#f7931a'],['trail','#c9b6ff'],
    ['mark','#ffe36b'],['mark','#e6dcc8'],['mark','#c9b6ff'],
    ['arc','#ffd9a0'],['mote','#59e0e6'],['mote','#c9b6ff'],
    ['bolt','#59e0e6'],['bolt','#7be495'],['bolt','#c9803a'],['bolt','#e6dcc8'],['bolt','#e6e2d6'],
    ['ring','#59e0e6'],['ring','#ff7a3c'],['ring','#ffe36b'],['ring','#7be495'],['ring','#9a6cff'],
    ['ring','#b48cff'],['ring','#d98cff'],['ring','#e6e2d6'],['ring','#ff5d4d'],['ring','#ff9a3c'],
    ['ring','#ffb238'],['ring','#ffffff'],['ring','#c9b6ff']];
  for(let i=0;i<extra.length;i++)add(extra[i][0],extra[i][1]);
  return out}
/* Baked in slices so the bar can move. rAF stops in a background tab, so a
   timer races it and whichever arrives first carries on. */
/* Item art. Diablo's rule: a base type has a picture of its own, an
   unidentified thing hides it, and a unique has one nobody else gets. The
   plate is drawn from a hash of the name, so every base and every unique
   gets a stable picture without a table anyone has to maintain.
   Tech in the object, gothic in the niche it sits in, and the rarity is in
   the metal rather than only the border. */
const ITS=88;
/* One reading of an item, shared by the picture in the pack and the thing in
   your hand. The speed class decides the archetype, the name decides the head,
   and a unique's tint comes from the same place in both. */
function itemSeed(it){return it?itHash(it.q>=4&&it.name?('u:'+it.name):('b:'+(it.base||it.name||it.slot))):0}
function itemArch(it){return (it&&it.slot==='weapon')?(it.spd<0?0:it.spd>0?1:2):0}
function itemHead(it){return (itR(itemSeed(it),1)*4)|0}
function tintOf(q,h){const base=QCOL[q|0]||QCOL[0];if((q|0)<4)return base;
  const c=hex2rgb(base);return 'rgb('+[Math.min(255,c[0]*(.82+itR(h,70)*.3))|0,
    Math.min(255,c[1]*(.78+itR(h,71)*.4))|0,Math.min(255,c[2]*(.6+itR(h,72)*.8))|0].join(',')+')'}
function itemTint(it){return tintOf((it&&it.q)|0,itemSeed(it))}
function itHash(s){let h=2166136261;s=String(s||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
const itR=(h,i)=>{const v=Math.sin(((h%99991)+1)*0.0137+i*127.13)*43758.5453;return v-Math.floor(v)};

/* the niche everything sits in: a pointed arch, etched traces, a rim of the
   rarity's colour */
function itFrame(g,s,col,q,h){
  const m=s*.06;
  g.save();
  g.beginPath();
  g.moveTo(m,s-m);g.lineTo(m,s*.4);g.quadraticCurveTo(s/2,-s*.1,s-m,s*.4);g.lineTo(s-m,s-m);g.closePath();
  const gr=g.createLinearGradient(0,0,0,s);
  gr.addColorStop(0,'#3a2f25');gr.addColorStop(.55,'#241c16');gr.addColorStop(1,'#120e0b');
  g.fillStyle=gr;g.fill();
  g.save();g.clip();
  g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=1;
  for(let i=0;i<4;i++){const y=s*(.22+itR(h,i+40)*.7),x=s*(.1+itR(h,i+50)*.3);
    g.beginPath();g.moveTo(0,y);g.lineTo(x,y);g.lineTo(x,y-s*.12);g.stroke();
    g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x-1,y-s*.13,2,2)}
  g.restore();
  g.strokeStyle=col;g.globalAlpha=q>=3?.85:.45;g.lineWidth=1.3;g.stroke();
  g.globalAlpha=1;g.restore();
}
/* A sigil nobody else has. Two same-slot uniques were coming out as near
   twins, which defeats the point of a unique having a picture of its own. */
function itSigil(g,s,col,h){const v=(itR(h,60)*7)|0,cx=s*.5,cy=s*.52,r=s*.13;
  g.save();g.translate(cx,cy);g.rotate(itR(h,61)*6.283);
  g.strokeStyle=col;g.lineWidth=1.6;g.fillStyle=col;g.globalAlpha=.95;
  g.beginPath();
  if(v===0){for(let i=0;i<5;i++){const a=i*1.2566-1.5708;g[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}g.closePath();g.stroke()}
  else if(v===1){g.arc(0,0,r,0,6.283);g.stroke();g.beginPath();g.moveTo(-r,0);g.lineTo(r,0);g.stroke()}
  else if(v===2){g.moveTo(0,-r);g.lineTo(r,r);g.lineTo(-r,r);g.closePath();g.stroke()}
  else if(v===3){for(let i=0;i<3;i++){g.beginPath();g.arc(0,0,r*(.4+i*.3),.4,2.6);g.stroke()}}
  else if(v===4){g.fillRect(-r*.2,-r,r*.4,r*2);g.fillRect(-r,-r*.2,r*2,r*.4)}
  else if(v===5){g.moveTo(-r,-r);g.lineTo(r,r);g.moveTo(r,-r);g.lineTo(-r,r);g.stroke();g.beginPath();g.arc(0,0,r*.45,0,6.283);g.fill()}
  else{const n=3+((itR(h,62)*4)|0);for(let i=0;i<n;i++){const a=i*6.283/n;g.beginPath();g.arc(Math.cos(a)*r*.8,Math.sin(a)*r*.8,r*.22,0,6.283);g.fill()}}
  g.globalAlpha=1;g.restore()}
/* a unique wears filigree and a lit back */
function itAura(g,s,col){
  const gr=g.createRadialGradient(s/2,s*.55,0,s/2,s*.55,s*.5);
  gr.addColorStop(0,col);gr.addColorStop(1,'rgba(0,0,0,0)');
  g.save();g.globalAlpha=.3;g.fillStyle=gr;g.fillRect(0,0,s,s);g.restore();
  g.strokeStyle=col;g.lineWidth=1.1;g.globalAlpha=.8;
  for(const sx of[1,-1]){g.save();g.translate(s/2+sx*s*.39,s*.42);g.scale(sx,1);
    g.beginPath();g.moveTo(0,-s*.1);g.quadraticCurveTo(s*.07,0,0,s*.1);g.stroke();g.restore()}
  g.globalAlpha=1;
}
/* brushed metal for the object itself, lit from the upper left */
function itMetal(g,s,col,lit){
  const gr=g.createLinearGradient(s*.2,s*.15,s*.8,s*.9);
  gr.addColorStop(0,lit?'#fdf8ec':'#b3ab95');gr.addColorStop(.45,lit?'#c0b5a0':'#837c6c');
  gr.addColorStop(1,'#4b463d');return gr;
}
const ITART={
 weapon:(g,s,col,h,q,arch)=>{const v=(itR(h,1)*4)|0,hv=arch===0,ft=arch===1;
   g.strokeStyle=itMetal(g,s,col,1);g.lineWidth=s*(hv?.11:ft?.055:.075);g.lineCap='round';
   g.beginPath();g.moveTo(s*.28,s*.82);g.lineTo(s*(ft?.58:.62),s*(ft?.34:.3));g.stroke();g.lineCap='butt';
   g.fillStyle=itMetal(g,s,col,1);
   g.save();g.translate(s*.66,s*.25);g.rotate(itR(h,3)*.4-.2);
   if(hv){
     if(v===0)g.fillRect(-s*.15,-s*.12,s*.3,s*.24);
     else if(v===1){g.beginPath();for(let i=0;i<8;i++){const a=i*.785+.39;g[i?'lineTo':'moveTo'](Math.cos(a)*s*.16,Math.sin(a)*s*.16)}g.closePath();g.fill()}
     else if(v===2){g.beginPath();g.moveTo(-s*.16,-s*.04);g.lineTo(s*.06,-s*.16);g.lineTo(s*.16,0);g.lineTo(s*.06,s*.16);g.closePath();g.fill()}
     else{g.fillRect(-s*.17,-s*.07,s*.34,s*.14);g.fillRect(-s*.05,-s*.17,s*.1,s*.34)}
   }else if(ft){
     if(v===0){g.beginPath();g.moveTo(-s*.04,s*.1);g.lineTo(s*.04,s*.1);g.lineTo(s*.02,-s*.23);g.lineTo(-s*.02,-s*.23);g.closePath();g.fill()}
     else if(v===1){g.beginPath();g.moveTo(-s*.05,s*.1);g.quadraticCurveTo(s*.15,-s*.06,s*.03,-s*.23);g.lineTo(-s*.05,-s*.2);g.closePath();g.fill()}
     else if(v===2){g.beginPath();g.moveTo(-s*.05,s*.1);g.lineTo(s*.04,s*.09);
       for(let i=0;i<4;i++){g.lineTo(s*.015,-s*(.01+i*.055));g.lineTo(s*.06,-s*(.04+i*.055))}
       g.lineTo(0,-s*.23);g.closePath();g.fill()}
     else{g.fillRect(-s*.07,-s*.23,s*.05,s*.33);g.fillRect(s*.02,-s*.23,s*.05,s*.33)}
   }else{
     if(v===0){g.beginPath();g.arc(0,-s*.07,s*.11,0,6.283);g.fill()}
     else if(v===1){g.fillRect(-s*.02,-s*.21,s*.04,s*.26);g.fillRect(-s*.13,-s*.21,s*.04,s*.17);g.fillRect(s*.09,-s*.21,s*.04,s*.17)}
     else if(v===2){g.lineWidth=s*.035;g.strokeStyle=itMetal(g,s,col,1);g.beginPath();g.arc(0,-s*.07,s*.12,0,6.283);g.stroke()}
     else{g.beginPath();g.moveTo(-s*.02,-s*.23);g.lineTo(s*.17,-s*.14);g.lineTo(-s*.02,-s*.05);g.closePath();g.fill()}
   }
   g.restore();
   g.strokeStyle=col;g.globalAlpha=.75;g.lineWidth=1;
   g.beginPath();g.moveTo(s*.32,s*.76);g.lineTo(s*.5,s*.5);g.stroke();g.globalAlpha=1},
 helm:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);
   g.beginPath();g.arc(s/2,s*.54,s*.26,3.14159,0);g.lineTo(s*.76,s*.76);g.lineTo(s*.24,s*.76);g.closePath();g.fill();
   g.fillStyle='#0c0a09';g.fillRect(s*.3,s*.5,s*.4,s*.09);
   g.fillStyle=col;g.globalAlpha=.85;g.fillRect(s*.3,s*.5,s*.4*(.3+itR(h,4)*.6),s*.09);g.globalAlpha=1;
   if(itR(h,5)>.5){g.strokeStyle=itMetal(g,s,col,1);g.lineWidth=2;
     g.beginPath();g.moveTo(s*.5,s*.28);g.lineTo(s*.5,s*.14);g.stroke()}},
 armor:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);
   g.beginPath();g.moveTo(s*.5,s*.22);g.lineTo(s*.78,s*.33);g.lineTo(s*.72,s*.8);g.lineTo(s*.28,s*.8);g.lineTo(s*.22,s*.33);g.closePath();g.fill();
   g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=1.4;
   for(let i=0;i<3;i++){const y=s*(.42+i*.13);g.beginPath();g.moveTo(s*.26,y);g.lineTo(s*.74,y);g.stroke()}
   g.fillStyle=col;g.globalAlpha=.8;g.fillRect(s*.46,s*.36,s*.08,s*.1);g.globalAlpha=1},
 gloves:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);
   g.fillRect(s*.32,s*.44,s*.36,s*.3);
   for(let i=0;i<4;i++)g.fillRect(s*(.33+i*.09),s*(.26+itR(h,i+6)*.08),s*.07,s*.2);
   g.fillStyle=col;g.globalAlpha=.8;g.fillRect(s*.32,s*.7,s*.36,s*.05);g.globalAlpha=1},
 boots:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);
   g.beginPath();g.moveTo(s*.36,s*.24);g.lineTo(s*.58,s*.24);g.lineTo(s*.6,s*.6);g.lineTo(s*.78,s*.68);g.lineTo(s*.78,s*.8);g.lineTo(s*.34,s*.8);g.closePath();g.fill();
   g.fillStyle=col;g.globalAlpha=.75;g.fillRect(s*.34,s*.74,s*.44,s*.06);g.globalAlpha=1},
 belt:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);g.fillRect(s*.14,s*.46,s*.72,s*.14);
   g.fillStyle='#0c0a09';g.fillRect(s*.42,s*.4,s*.16,s*.26);
   g.strokeStyle=col;g.lineWidth=1.6;g.strokeRect(s*.42,s*.4,s*.16,s*.26);
   for(let i=0;i<3;i++)g.fillRect(s*(.2+i*.07),s*.5,s*.02,s*.06)},
 ring:(g,s,col,h)=>{g.strokeStyle=itMetal(g,s,col,1);g.lineWidth=s*.08;
   g.beginPath();g.arc(s/2,s*.58,s*.19,0,6.283);g.stroke();
   g.fillStyle=col;g.beginPath();
   const v=(itR(h,7)*3)|0;
   if(v===0)g.arc(s/2,s*.33,s*.09,0,6.283);
   else if(v===1){g.moveTo(s/2,s*.23);g.lineTo(s*.59,s*.34);g.lineTo(s/2,s*.44);g.lineTo(s*.41,s*.34);g.closePath()}
   else g.rect(s*.42,s*.26,s*.16,s*.16);
   g.fill();g.fillStyle='rgba(255,255,255,.7)';g.fillRect(s*.47,s*.3,s*.03,s*.03)},
 amulet:(g,s,col,h)=>{g.strokeStyle=itMetal(g,s,col,1);g.lineWidth=2;
   g.beginPath();g.moveTo(s*.3,s*.22);g.quadraticCurveTo(s*.5,s*.46,s*.7,s*.22);g.stroke();
   g.fillStyle=col;g.beginPath();
   const v=(itR(h,8)*3)|0;
   if(v===0){g.moveTo(s/2,s*.4);g.lineTo(s*.66,s*.6);g.lineTo(s/2,s*.8);g.lineTo(s*.34,s*.6);g.closePath()}
   else if(v===1)g.arc(s/2,s*.6,s*.16,0,6.283);
   else{g.moveTo(s*.36,s*.44);g.lineTo(s*.64,s*.44);g.lineTo(s/2,s*.78);g.closePath()}
   g.fill();
   g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=1.2;g.stroke()},
 offhand:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);
   g.beginPath();g.moveTo(s*.5,s*.2);g.lineTo(s*.76,s*.34);g.lineTo(s*.76,s*.62);g.lineTo(s*.5,s*.82);g.lineTo(s*.24,s*.62);g.lineTo(s*.24,s*.34);g.closePath();g.fill();
   g.strokeStyle=col;g.lineWidth=1.4;g.globalAlpha=.85;g.stroke();g.globalAlpha=1;
   g.fillStyle='rgba(0,0,0,.45)';
   for(let i=0;i<3;i++)g.fillRect(s*.36,s*(.4+i*.1),s*.28,s*.04)},
 charm:(g,s,col,h)=>{g.fillStyle=itMetal(g,s,col,1);g.fillRect(s*.3,s*.26,s*.4,s*.48);
   g.strokeStyle=col;g.lineWidth=1.3;g.strokeRect(s*.3,s*.26,s*.4,s*.48);
   g.fillStyle=col;g.globalAlpha=.9;
   for(let i=0;i<4;i++){const x=s*(.36+itR(h,i+10)*.24),y=s*(.34+i*.1);g.fillRect(x,y,s*.06,s*.04)}
   g.globalAlpha=1},
 stim:(g,s,col,h)=>{g.fillStyle='rgba(220,235,245,.22)';
   g.beginPath();g.moveTo(s*.4,s*.22);g.lineTo(s*.6,s*.22);g.lineTo(s*.6,s*.74);g.quadraticCurveTo(s*.5,s*.84,s*.4,s*.74);g.closePath();g.fill();
   g.fillStyle=col;g.globalAlpha=.9;g.fillRect(s*.41,s*.5,s*.18,s*.26);g.globalAlpha=1;
   g.strokeStyle='rgba(235,245,255,.6)';g.lineWidth=1.3;
   g.beginPath();g.moveTo(s*.4,s*.22);g.lineTo(s*.6,s*.22);g.lineTo(s*.6,s*.74);g.quadraticCurveTo(s*.5,s*.84,s*.4,s*.74);g.closePath();g.stroke();
   g.fillStyle=itMetal(g,s,col,1);g.fillRect(s*.37,s*.16,s*.26,s*.08)}
};
/* what an unidentified thing looks like: the right shape, wrapped and sealed */
function itSealed(g,s,slot,h){
  g.save();g.globalAlpha=.3;g.filter='grayscale(1)';
  const f=ITART[slot]||ITART.charm;f(g,s,'#6c6657',h,0);
  g.restore();
  g.strokeStyle='#5d5444';g.lineWidth=s*.07;g.lineCap='round';
  g.beginPath();g.moveTo(s*.16,s*.62);g.quadraticCurveTo(s*.5,s*.46,s*.84,s*.62);g.stroke();
  g.beginPath();g.moveTo(s*.2,s*.4);g.quadraticCurveTo(s*.5,s*.56,s*.8,s*.4);g.stroke();
  g.fillStyle='#8c2f28';g.beginPath();g.arc(s*.5,s*.52,s*.11,0,6.283);g.fill();
  g.strokeStyle='#d2a05a';g.lineWidth=1.2;g.stroke();
  g.fillStyle='#e8d6a8';g.font='700 '+(s*.15|0)+'px Cinzel,Georgia,serif';
  g.textAlign='center';g.textBaseline='middle';g.fillText('?',s*.5,s*.535);
}
let ITC={};
/* a data URI per picture, made once. The key decides the picture: a unique by
   its own name, anything else by its base type, and anything unidentified by
   the slot alone, because that is all you are allowed to know. */
function itemArt(slot,key,q,idd,arch){arch=arch|0;
  const ck=(idd?'i':'x')+'|'+(idd?key:slot)+'|'+(idd?q:0)+'|'+(idd?arch:0);
  if(ITC[ck])return ITC[ck];
  const s=ITS,c=mk(s,s),g=c.getContext('2d'),h=itHash(idd?key:slot+'?');
  const col=tintOf(q,h);
  itFrame(g,s,idd?col:'#4e4639',idd?q:0,h);
  if(idd){
    if(q>=4)itAura(g,s,col);
    const bg=g.createRadialGradient(s/2,s*.54,0,s/2,s*.54,s*.42);
    bg.addColorStop(0,'rgba(0,0,0,.45)');bg.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=bg;g.fillRect(0,0,s,s);
    const f=ITART[slot]||ITART.charm;
    g.save();g.translate(s/2,s/2);g.rotate((itR(h,20)-.5)*.12);g.translate(-s/2,-s/2);
    f(g,s,col,h,q,arch);g.restore();
    if(q>=4)itSigil(g,s,col,h);
  }else itSealed(g,s,slot,h);
  const u=c.toDataURL('image/png');ITC[ck]=u;return u}
/* the picture this item should wear */
function itemArtFor(it){if(!it)return '';
  const slot=it.charm?'charm':it.stim?'stim':(ITART[it.slot]?it.slot:'charm');
  const uniq=it.q>=4&&it.name;
  return itemArt(slot,uniq?('u:'+it.name):('b:'+(it.base||it.name||slot)),it.q|0,it.id!==false,itemArch(it))}
function itemImg(it,cls){const u=itemArtFor(it);return u?'<img class="'+(cls||'ic')+'" src="'+u+'" alt="">':''}
/* The loading screen. This character's sheets bake behind it, so no shape
   stops to draw itself in the middle of a fight. It holds for a beat even when
   the bake is quick, because a bar that flashes past reads as a glitch. */
function fxLoad(cls){const el=$('load');if(!el)return Promise.resolve(0);
  const fil=el.querySelector('.fil'),cap=el.querySelector('.cap'),t0=performance.now();
  el.hidden=false;requestAnimationFrame(()=>el.classList.add('in'));
  if(fil)fil.style.width='0%';if(cap)cap.textContent='Forging';
  const hide=()=>{el.classList.remove('in');setTimeout(()=>{el.hidden=true},380)};
  return fxWarm((n,t)=>{if(fil)fil.style.width=(100*n/Math.max(1,t)).toFixed(1)+'%';
      if(cap&&n>=t)cap.textContent='Ready'},cls,1.5)
    .then(n=>new Promise(r=>setTimeout(()=>{hide();r(n)},Math.max(0,900-(performance.now()-t0)))))
    .catch(()=>{hide();return 0})}
function fxWarm(cb,cls,budget){const pairs=fxPairs(cls);let i=0;const ms=budget||7;
  const next=f=>{let ran=false;const go=()=>{if(ran)return;ran=true;f()};
    try{requestAnimationFrame(go)}catch(e){}setTimeout(go,120)};
  return new Promise(res=>{const step=()=>{
    const t0=performance.now();
    while(i<pairs.length&&performance.now()-t0<ms){try{fxSheet(pairs[i][0],pairs[i][1])}catch(e){}i++}
    if(cb)try{cb(i,pairs.length)}catch(e){}
    if(i<pairs.length)next(step);else res(pairs.length)};next(step)})}

/* The skill button and the world share one vocabulary. sz is the box. */
function glyph(g,cls,i,sz){const v=skvOf(cls,i);if(!v)return;const s=sz||24,col=v.col,k=v.k;
  g.save();g.clearRect(0,0,s,s);g.strokeStyle=col;g.fillStyle=col;g.lineCap='round';g.lineJoin='round';
  g.lineWidth=Math.max(1.25,s/14)*Math.min(2.2,v.w||1);const cx=s/2,cy=s/2;
  if(k==='arc'){g.beginPath();g.arc(cx,cy+s*.12,s*.28*Math.min(1.35,v.w||1),Math.PI*1.15,Math.PI*1.85);g.stroke()}
  else if(k==='bolt'){const hops=v.n||1;g.beginPath();g.moveTo(s*.14,s*.8);for(let h=1;h<=hops;h++){const t=h/(hops+1);g.lineTo(s*(.16+t*.66),s*(.78-t*.5)+(h%2?s*.1:-s*.06))}g.lineTo(s*.86,s*.16);g.stroke()}
  else if(k==='ring'){g.beginPath();g.arc(cx,cy,Math.min(s*.4,s*(.12+(v.r||1.2)*.06)),0,6.283);g.stroke()}
  else if(k==='strike'){g.beginPath();g.moveTo(cx,s*.08);g.lineTo(cx-s*.14,s*.42);g.lineTo(cx+s*.1,s*.5);g.lineTo(cx,s*.92);g.stroke()}
  else if(k==='beam'){g.fillRect(cx-s*.07,s*.1,s*.14,s*.8)}
  else if(k==='patch'){const rx=Math.min(s*.4,s*(.14+(v.r||1.2)*.07));g.beginPath();g.ellipse(cx,cy,rx,rx*.58,0,0,6.283);g.stroke()}
  else if(k==='trail'){for(let n=0;n<4;n++)g.fillRect(s*.1+n*s*.2,cy-s*.045,s*.12,s*.09)}
  else if(k==='mark'){g.save();g.translate(cx,cy);g.rotate(.785);g.fillRect(-s*.13,-s*.13,s*.26,s*.26);g.restore()}
  else if(k==='orbit'){const n=v.n||3;for(let j=0;j<n;j++){const a=j*6.283/n-1.2;g.fillRect(cx+Math.cos(a)*s*.28-s*.07,cy+Math.sin(a)*s*.28-s*.07,s*.14,s*.14)}}
  g.restore()}
function rim(X,Y,s,b,a){const c=(TX.s&&TX.s.glow)||'#ffcf7a';ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=a===undefined?.38:a;ctx.lineCap='round';
  ctx.lineWidth=1.7*s;ctx.beginPath();ctx.arc(X,Y-37*s+b,6.5*s,3.46,5.05);ctx.stroke();
  ctx.lineWidth=1.5*s;ctx.beginPath();ctx.moveTo(X-7.4*s,Y-30.4*s+b);ctx.lineTo(X+7.4*s,Y-30.4*s+b);ctx.stroke();
  ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineCap='butt'}
function human(X,Y,o){
  const s=o.s||1,f=o.f||1,sw=o.mov?Math.sin(o.ph):0,b=o.mov?Math.abs(Math.cos(o.ph))*1.6:Math.sin(tNow*2+(o.ph||0))*.5;
  shadow(X,Y,12*s);ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';
  box(X-6*s-sw*2.5*s,Y-13*s,5*s,13*s-Math.max(0,sw)*3,2,o.leg||'#2a2433');box(X+1*s+sw*2.5*s,Y-13*s,5*s,13*s-Math.max(0,-sw)*3,2,o.leg||'#2a2433');
  box(X-f*8*s-2*s,Y-29*s+b-sw*2,4*s,12*s,2,o.c2);
  box(X-8*s,Y-31*s+b,16*s,20*s,4*s,o.c);
  ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(X+(f>0?-7:2)*s,Y-29*s+b,5*s,16*s);
  ctx.beginPath();ctx.arc(X,Y-37*s+b,6.5*s,0,6.283);ctx.fillStyle=o.skin||'#d9b08c';ctx.fill();ctx.stroke();
  if(!o.norim)rim(X,Y,s,b);
  return b}
function drawHsForm(X,Y,fm,dying){
  const col=P.flash>0?'#fff':fm==='worn'?'#5a6078':'#6a8f62',darkc=fm==='worn'?'#3c4658':'#3d5438';
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(fm==='hound'){shadow(X,Y,16);const w=P.moving?Math.sin(P.walkPh||0)*3:0;
    box(X-20,Y-12,36,10,4,col);box(X-26,Y-16,12,10,3,darkc);box(X+14,Y-10,12,5,2,darkc);
    box(X-14,Y-4+w,5,8,1,darkc);box(X-4,Y-4-w,5,8,1,darkc);box(X+6,Y-4+w,5,8,1,darkc);box(X+12,Y-4-w,5,7,1,darkc);
    ctx.fillStyle='#1a120c';ctx.fillRect(X-24,Y-14,2.2,2.2)}
  else if(fm==='worn'){shadow(X,Y,22);box(X-24,Y-6,16,10,2,'#1a1814');box(X+8,Y-6,16,10,2,'#1a1814');
    box(X-22,Y-20,44,16,3,col);box(X-10,Y-26,20,8,2,darkc);
    ctx.fillStyle='#c9803a';ctx.fillRect(X-16,Y-14,32,3);ctx.fillStyle='#1a120c';ctx.fillRect(X-14,Y-17,4,3);ctx.fillRect(X+10,Y-17,4,3)}
  else{shadow(X,Y,18);box(X-18,Y-8,12,12,2,'#2a2418');box(X+6,Y-8,12,12,2,'#2a2418');
    box(X-16,Y-30,32,24,4,col);box(X-10,Y-38,20,10,3,darkc);
    ctx.fillStyle='#d9b08c';ctx.fillRect(X-3,Y-34,6,4);ctx.fillStyle='#c9803a';ctx.fillRect(X-12,Y-22,24,3)}
  ctx.globalAlpha=1;if(dying){ctx.restore();return}
  if(OPT.selfBars){const w=34,y=Y-56;ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,y-1,w+2,9);ctx.fillStyle='#d23a2e';ctx.fillRect(X-w/2,y,w*clamp(G.hp/S.maxHp,0,1),3.5);ctx.fillStyle='#3a7af0';ctx.fillRect(X-w/2,y+4,w*clamp(G.en/S.maxEn,0,1),3)}}
function drawPlayer(X,Y){
  const c=CLS[G.cls],dx=(P.dir.x-P.dir.y),dy=(P.dir.x+P.dir.y)*.5,l=Math.hypot(dx,dy)||1;let ux=dx/l,uy=dy/l;const f=ux>=0?1:-1;
  if(P.buff>0||P.haste>0||P.guard>0){ctx.strokeStyle=P.buff>0?'#ff5d4d':P.guard>0?'#ffe36b':'#7be495';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,19,9.5,0,0,6.283);ctx.stroke()}
  const dying=mode==='dying';if(dying){const u=Math.min(1,DY.t/.9);ctx.fillStyle='rgba(110,8,8,'+Math.min(.75,DY.t*.5)+')';ctx.beginPath();ctx.ellipse(X+10,Y,6+Math.min(26,DY.t*16),3+Math.min(13,DY.t*8),0,0,6.283);ctx.fill();ctx.save();ctx.translate(X,Y);ctx.rotate(u*u*1.5);ctx.translate(-X,-Y);ctx.globalAlpha=1-Math.max(0,DY.t-1.6)*.6}
  if(P.dash)ctx.globalAlpha=.6;if(P.stealth>0)ctx.globalAlpha=.3;
  const dark={scrapper:'#9a5a1c',hacker:'#5c3aa8',courier:'#23805c',anon:'#22222a',founder:'#101016',homesteader:'#3d5438',witness:'#2c3442'}[G.cls];
  if(G.cls==='homesteader'&&(G.form==='hound'||G.form==='hull'||G.form==='worn')){drawHsForm(X,Y,G.form,dying);return}
  if(P.mech>0){ctx.strokeStyle=OL;ctx.lineWidth=1.4;box(X-17,Y-34,9,14,2,'#e0bd6e');box(X+8,Y-34,9,14,2,'#e0bd6e');box(X-13,Y-14,9,14,2,'#a88a45');box(X+4,Y-14,9,14,2,'#a88a45');glow(X,Y-22,40,'#e0bd6e',.35)}
  const b=human(X,Y,{c:P.flash>0?'#fff':c.col,c2:dark,ph:P.walkPh,mov:P.moving,f,leg:G.cls==='hacker'?'#1d1830':'#2e2a36'});
  const hy=Y-37+b;ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(G.cls==='scrapper'){ctx.fillStyle='#e8e06a';ctx.fillRect(X-8,Y-25+b,16,2.5);ctx.fillRect(X-8,Y-19+b,16,2.5);
    ctx.beginPath();ctx.arc(X,hy-1,7.5,3.14,0);ctx.closePath();ctx.fillStyle='#e0bd3a';ctx.fill();ctx.stroke();box(X-9+f*2,hy-2,18,2.5,1,'#e0bd3a')}
  else if(G.cls==='hacker'){ctx.beginPath();ctx.arc(X,hy,8,2.6,.54);ctx.lineTo(X+7,hy+7);ctx.lineTo(X-7,hy+7);ctx.closePath();ctx.fillStyle='#3d2878';ctx.fill();ctx.stroke();
    ctx.fillStyle='#59e0e6';ctx.fillRect(X-5+f*1.5,hy-1.5,10,2.6);poly([X-8,Y-12+b,X+8,Y-12+b,X+6,Y-4,X-6,Y-4],dark)}
  else if(G.cls==='anon'){ctx.beginPath();ctx.arc(X,hy,8,2.6,.54);ctx.lineTo(X+7,hy+7);ctx.lineTo(X-7,hy+7);ctx.closePath();ctx.fillStyle='#17171c';ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(X+f*1.5,hy+.5,5,5.6,0,0,6.283);ctx.fillStyle='#e6e2d6';ctx.fill();ctx.stroke();ctx.fillStyle='#0b0912';ctx.fillRect(X+f*1.5-3.2,hy-1.5,2.2,1.6);ctx.fillRect(X+f*1.5+1,hy-1.5,2.2,1.6)}
  else if(G.cls==='founder'){ctx.beginPath();ctx.arc(X,hy-2,6.8,3.3,6.1);ctx.closePath();ctx.fillStyle='#9a968c';ctx.fill();ctx.stroke();ctx.strokeStyle='#0b0912';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(X+f*1.5-2.6,hy+.5,2,0,6.283);ctx.arc(X+f*1.5+2.6,hy+.5,2,0,6.283);ctx.stroke();ctx.lineWidth=1.4;ctx.strokeStyle=OL;box(X-8,Y-31+b,16,5,2,'#101016')}
  else if(G.cls==='homesteader'){ctx.beginPath();ctx.arc(X,hy-1,7,3.3,6.05);ctx.closePath();ctx.fillStyle='#4e6a48';ctx.fill();ctx.stroke();ctx.fillStyle='#c9803a';ctx.fillRect(X-5,Y-18+b,10,2)}
  else if(G.cls==='witness'){ctx.beginPath();ctx.arc(X,hy-1,7,3.3,6.05);ctx.closePath();ctx.fillStyle='#2c3442';ctx.fill();ctx.stroke();ctx.fillStyle='#3a4250';ctx.fillRect(X-9,Y-24+b,18,10)}
  else{box(X-f*11-4,Y-30+b,8,12,2,'#8a6a40');ctx.strokeStyle='#5a4326';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X-7,Y-30+b);ctx.lineTo(X+7,Y-14+b);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    ctx.beginPath();ctx.arc(X,hy-1,7,3.14,0);ctx.closePath();ctx.fillStyle='#1f5a44';ctx.fill();ctx.stroke();box(X+(f>0?2:-11),hy-2.5,9,2.5,1,'#1f5a44')}
  const E=G.eq,qc=it=>itemTint(it);ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  {const u4=Object.values(E).filter(i=>i&&i.q===4);if(u4.length)glow(X,Y-4,28,itemTint(u4[0]),.28)}
  if(E.armor){const t=tierOf(E.armor.il);if(t===0){ctx.fillStyle=qc(E.armor);ctx.fillRect(X-8,Y-27+b,16,1.6);ctx.fillRect(X-8,Y-16+b,16,1.6)}else{box(X-8.5,Y-31+b,17,13,3,['','#4a4458','#8a94a8','#d8d0f0'][t]);if(t>=2){box(X-12.5,Y-33+b,6.5,6.5,2,t===3?'#f0ecff':'#a8b0c0');box(X+6,Y-33+b,6.5,6.5,2,t===3?'#f0ecff':'#a8b0c0')}ctx.fillStyle=qc(E.armor);ctx.fillRect(X-1,Y-29+b,2,9)}}
  if(E.belt){ctx.fillStyle=qc(E.belt);ctx.fillRect(X-8,Y-14.5+b,16,2.4);ctx.fillStyle='#0b0912';ctx.fillRect(X-1.5,Y-15+b,3,3.4)}
  if(E.boots){const t=tierOf(E.boots.il);ctx.fillStyle=['#6a5a48','#4a5060','#8a94a8','#e0d8ff'][t];ctx.fillRect(X-7,Y-5,6,5);ctx.fillRect(X+1,Y-5,6,5);ctx.fillStyle=qc(E.boots);ctx.fillRect(X-7,Y-5,6,1.3);ctx.fillRect(X+1,Y-5,6,1.3)}
  if(E.amulet){ctx.fillStyle=qc(E.amulet);ctx.beginPath();ctx.arc(X,Y-29.5+b,1.9,0,6.283);ctx.fill();ctx.stroke()}
  if(E.helm){const t=tierOf(E.helm.il),hc=['#c9a83a','#5a6478','#9aa4b8','#f0ecff'][t];ctx.beginPath();ctx.arc(X,hy-1,7.7,3.14,0);ctx.closePath();ctx.fillStyle=hc;ctx.fill();ctx.stroke();
    if(t>=1){box(X-7.7,hy-1.6,15.4,3.6,1,hc);ctx.fillStyle=qc(E.helm);ctx.fillRect(X-5+f*1.5,hy-.9,10,1.9)}else{box(X-9+f*2,hy-2,18,2.3,1,hc);ctx.fillStyle=qc(E.helm);ctx.fillRect(X-3,hy-7.5,6,1.5)}
    if(t>=3){ctx.strokeStyle=qc(E.helm);ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(X,hy-11,7,2.4,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}}
  if(G.cls==='maxi'&&G.st&&G.st.laser)eggEyes(X,hy,f);
  // weapon arm
  if(P.spin>0){const a=tNow*30;ux=Math.cos(a);uy=Math.sin(a)*.5}
  const sw=P.swing>0?Math.sin(P.swing/.18*3.14)*12:0,reach=13+sw,hx=X+ux*reach,hyy=Y-21+uy*reach+b;
  ctx.lineCap='round';ctx.strokeStyle=OL;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(X+ux*5,Y-24+b);ctx.lineTo(hx,hyy);ctx.stroke();ctx.strokeStyle=dark;ctx.lineWidth=3;ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineCap='butt';
  if(E.gloves){ctx.fillStyle=qc(E.gloves);ctx.fillRect(hx-2.8,hyy-2.8,5.6,5.6);ctx.strokeRect(hx-2.8,hyy-2.8,5.6,5.6)}
  const wp=E.weapon,wt=wp?tierOf(wp.il):0;
  if(wp&&G.cls!=='hacker'&&G.cls!=='founder'&&G.cls!=='witness'){const wc=wp.q?qc(wp):'#c8ccd4';
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
  else if(G.cls==='homesteader'){const tx=hx+ux*12,ty=hyy+uy*12-8;ctx.strokeStyle='#3d5438';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx-ux*2,hyy);ctx.lineTo(tx,ty);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.beginPath();ctx.arc(tx,ty,4,.4,2.8);ctx.stroke()}
  else if(G.cls==='witness'){const tx=hx+ux*10,ty=hyy+uy*10-8;ctx.fillStyle='#e6dcc8';ctx.fillRect(tx-7,ty-9,14,16);ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.strokeRect(tx-7,ty-9,14,16);ctx.strokeStyle='#cfc6b4';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(tx-4,ty-4);ctx.lineTo(tx+4,ty-4);ctx.moveTo(tx-4,ty);ctx.lineTo(tx+4,ty);ctx.moveTo(tx-4,ty+4);ctx.lineTo(tx+3,ty+4);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  else{poly([hx,hyy-2,hx+ux*11,hyy+uy*11-5,hx+ux*3+3,hyy+uy*3+1],'#d8e0e8')}
  ctx.globalAlpha=1;if(dying){ctx.restore();return}
  if(OPT.selfBars){const w=34,y=Y-56;ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,y-1,w+2,9);ctx.fillStyle='#d23a2e';ctx.fillRect(X-w/2,y,w*clamp(G.hp/S.maxHp,0,1),3.5);ctx.fillStyle='#3a7af0';ctx.fillRect(X-w/2,y+4,w*clamp(G.en/S.maxEn,0,1),3)}
}
function eye(X,Y,r,col){ctx.fillStyle=col;ctx.beginPath();ctx.arc(X,Y,r,0,6.283);ctx.fill();glow(X,Y,r*5,col,.6)}

/* ---------------- pre-rendered sprites ----------------
   An actor whose atlas is loaded draws from it; everything else keeps the drawn
   art. That is the whole migration strategy in one branch: art arrives one actor
   at a time and a missing atlas is never a broken frame.
   OPT.spr turns it off so the two can be compared side by side. */
const SPR={};
(function sprInit(){
  if(typeof SPRITES==='undefined')return;
  for(const k in SPRITES){const e=SPRITES[k],img=new Image();img.src=e.u;SPR[k]={m:e.m,img}}
})();
function sprReady(k){const e=SPR[k];return !!(e&&e.img.complete&&e.img.naturalWidth>0)}
/* Eight directions, 0 = facing +x, counting the way the renderer rotates. */
function sprDir(e,n){
  const dx=e.x-(e._px===undefined?e.x:e._px),dy=e.y-(e._py===undefined?e.y:e._py);
  if(dx*dx+dy*dy>1e-6)e._hd=Math.atan2(dy,dx);
  e._px=e.x;e._py=e.y;
  const a=e._hd===undefined?0:e._hd;
  return ((Math.round(a/(6.283185/n))%n)+n)%n;
}
function sprActor(k,e,X,Y,s,flash){
  const S=SPR[k],m=S.m,cell=m.cell,L=m.size;
  const moving=e.aggro&&e.stun<=0&&!e.mp;
  const an=m.anims[moving?'walk':'idle']||m.anims.idle;
  const f=Math.floor((tNow*(moving?11:4)+(e.ph||0))%an.count);
  const d=sprDir(e,m.dirs);
  const k2=L*s*1.1;                      /* sized to the footprint the drawn art had */
  /* z=0 in the model sits at 62% down the cell, so that point lands on the feet */
  ctx.drawImage(S.img,d*cell,(an.row+f)*cell,cell,cell,X-k2/2,Y-k2*0.62,k2,k2);
  if(flash){ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.55;
    ctx.drawImage(S.img,d*cell,(an.row+f)*cell,cell,cell,X-k2/2,Y-k2*0.62,k2,k2);ctx.restore()}
  return true;
}
/* ---------------- Maximalist auras, on the ground ----------------
   The class is built on standing inside a field: one aura at a time, no duration,
   buffing what is near you and marking what is not. None of that was drawn. The
   logic in maxiAura() knew the radius and the renderer never asked for it, so the
   only way to see an aura was to read the skill panel.
   A ground ellipse at auraVisR in the aura's own colour, a rim that tells you the
   reach, accents that turn so it reads as running, and a light so the field
   actually lifts the district around you. It is your own telegraph, so it
   survives Thin (own=2) while everything optional drops away. */
/* Base colours come from AURACOL in p2 so the field, the allies standing in it and
   other players' fields never disagree. Only the highlight and the motion live here. */
const AURAV={
  3:{g:[255,184,74], n:9,  spin: .55},   /* Toxic Maximalism */
  4:{g:[255,122,106],n:6,  spin:-.38},   /* Marked to Market */
  7:{g:[159,240,244],n:12, spin: .85}    /* Proof of Work    */
};
const rgba=(t,a)=>'rgba('+t[0]+','+t[1]+','+t[2]+','+a.toFixed(3)+')';
function drawAura(){
  if(!P||!G||G.cls!=='maxi'||!P.aura)return;
  if(typeof auraVisR!=='function')return;
  const a=P.aura,v=AURAV[a.i];
  if(!v)return;
  const base=hex2rgb(typeof auraCol==='function'?auraCol(a.i):'#f7931a');
  const r=auraVisR(a.i,a.L);
  if(!(r>0))return;
  const X=SX(P.x,P.y),Y=SY(P.x,P.y),rx=r*32,ry=r*16;
  const pulse=.5+.5*Math.sin(tNow*2.1),thin=OPT.fx==='thin',full=OPT.fx==='full';
  ctx.save();
  if(!thin){
    /* a shallow pool, dark in the middle so it never fights the floor art */
    const g=ctx.createRadialGradient(X,Y,Math.max(1,rx*.3),X,Y,rx);
    g.addColorStop(0,rgba(base,0));
    g.addColorStop(.74,rgba(base,.055+.03*pulse));
    g.addColorStop(1,rgba(v.g,.17+.07*pulse));
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(X,Y,rx,ry,0,0,6.283);ctx.fill();
  }
  /* the rim is the part that matters: it is the reach, so keep it legible */
  ctx.lineWidth=2;ctx.strokeStyle=rgba(v.g,.45+.28*pulse);
  ctx.beginPath();ctx.ellipse(X,Y,rx,ry,0,0,6.283);ctx.stroke();
  ctx.lineWidth=1;ctx.strokeStyle=rgba(base,.3+.2*pulse);
  ctx.beginPath();ctx.ellipse(X,Y,rx*.82,ry*.82,0,0,6.283);ctx.stroke();
  if(!thin){
    /* accents around the circumference, turning: an aura that is doing something */
    const sp=tNow*v.spin;
    ctx.fillStyle=rgba(v.g,.55+.3*pulse);
    for(let i=0;i<v.n;i++){
      const an=sp+i*6.283/v.n;
      const px=X+Math.cos(an)*rx,py=Y+Math.sin(an)*ry;
      ctx.beginPath();ctx.ellipse(px,py,2.4,1.6,an,0,6.283);ctx.fill();
    }
  }
  ctx.restore();
  if(full)glow(X,Y,rx*.9,rgba(v.g,.1+.05*pulse),.5);
  /* own=2: the player's own field is not an optional flourish */
  light(X,Y,rx*1.15,rgba(v.g,.5),.55+.12*pulse,2);
}

/* ================= the Act IV and V creatures =================
   Eighteen of them share nine bodies from Acts I-III, each with its own stats
   and its own palette. Colour alone does not carry at this size and in motion:
   the Oracle and the Well-Wisher are both the Siren, and from across a room in
   a fight they were the same thing twice. So each gets one attachment that
   changes its outline rather than its hue -- a parcel in the mouth, a scope
   glint, a block coming loose -- and nothing else about the borrowed body
   changes. Drawn straight to the canvas, so none of it costs a baked sheet.
   Act IV marks are soft and attentive, Act V's are ledger and orange. */
const MOBMARK={
 /* --- Acts II and III. These were missed by the first pass, which only went
    through the back half, and they are the ones a player meets first. Each
    mark says what the creature's own numbers say about it: the Persuader has
    drain, the Dividend Drone has dmg 0 and flee, the Shitcoiner has sight 0. */
 seer(X,Y,s,e){/* it takes something off you while it talks, so the tell is a
    thread that is always pulling in rather than pointing out */
   const f=(e.fx||1)>0?1:-1,y=Y-26*s,t=(tNow*1.6)%1,hx=X+10*s*f;
   ctx.save();ctx.globalAlpha=.55;ctx.strokeStyle='#b48cff';ctx.lineWidth=1.1*s;
   ctx.beginPath();ctx.moveTo(hx,y);ctx.quadraticCurveTo(X+20*s*f,y+6*s,X+14*s*f,y+16*s);ctx.stroke();
   ctx.globalAlpha=.6-t*.6;ctx.beginPath();ctx.arc(hx,y,(11-t*8)*s,0,6.283);ctx.stroke();ctx.restore();
   eye(hx,y,2*s,'#b48cff')},
 lancer(X,Y,s,e){/* the one in the Updraft that closes the distance, so what has
    to read is the thing out in front, not the body behind it */
   const f=(e.fx||1)>0?1:-1,y=Y-16*s,x=X+12*s*f;
   ctx.save();ctx.strokeStyle='#ffe36b';ctx.lineWidth=2*s;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(x-6*s*f,y+4*s);ctx.lineTo(x+16*s*f,y-3*s);ctx.stroke();ctx.restore();
   poly([x+17*s*f,y-4*s,x+9*s*f,y-8*s,x+9*s*f,y+1*s],'#ffe36b');
   glow(x+15*s*f,y-3*s,9*s,'#ffe36b',.35)},
 splitter(X,Y,s,e){/* a subsidiary is the same company again with a different
    name on it, so there is always a smaller one coming off the side */
   const f=(e.fx||1)>0?-1:1,b=Math.sin(tNow*2)*.5+.5;
   ctx.save();ctx.globalAlpha=.45+b*.3;ctx.fillStyle='#8a5ab8';
   ctx.beginPath();ctx.ellipse(X+(11+b*5)*s*f,Y-13*s,5.5*s,7*s,0,0,6.283);
   ctx.fill();ctx.stroke();ctx.restore()},
 director(X,Y,s,e){/* The Director's body was measured as exactly a floor colour
    of the Nine Chairs, and tools/floor-sep.js says the material pass did not
    help: dE 0.6. rimOn() holds the edge; this is the bright focal point the
    palette rule asks every actor to carry, and it is deliberately the loudest
    thing on it. */
   const y=Y-40*s;
   ctx.save();ctx.fillStyle='#c22d35';ctx.fillRect(X-9*s,y,18*s,3.2*s);ctx.restore();
   glow(X,y+1.6*s,17*s,'#ff5d4d',.5);
   const a=Math.sin(tNow*.9)*.5;
   ctx.save();ctx.globalAlpha=.3;ctx.strokeStyle='#ff5d4d';ctx.lineWidth=1.2*s;
   ctx.beginPath();ctx.moveTo(X,y+2*s);ctx.lineTo(X+Math.sin(a)*26*s,y+2*s+Math.cos(a)*18*s);
   ctx.stroke();ctx.restore()},
 proxy(X,Y,s,e){/* it is standing in for somebody who is not here */
   const f=(e.fx||1)>0?-1:1;
   ctx.save();ctx.globalAlpha=.32;ctx.strokeStyle='#d8d8e0';ctx.lineWidth=1.2*s;
   ctx.beginPath();ctx.ellipse(X+9*s*f,Y-20*s,7*s,13*s,0,0,6.283);ctx.stroke();ctx.restore()},
 gob(X,Y,s,e){/* dmg 0 and flee 1: it never hits you and it is always leaving,
    so the thing that has to read is that it is worth chasing */
   const y=Y-18*s,b=Math.sin(tNow*6)*1.5*s,f=(e.fx||1)>0?1:-1;
   ctx.save();ctx.fillStyle='#e0bd6e';
   ctx.beginPath();ctx.ellipse(X,y+b,8*s,7*s,0,0,6.283);ctx.fill();ctx.stroke();ctx.restore();
   glow(X,y,15*s,'#fff3c8',.4);
   for(let i=0;i<3;i++){const t=(tNow*1.4+i*.33)%1;
     ctx.save();ctx.globalAlpha=.8-t*.8;ctx.fillStyle='#fff3c8';
     ctx.beginPath();ctx.arc(X-(6+t*16)*s*f,Y-6*s+t*t*14*s,1.8*s,0,6.283);ctx.fill();ctx.restore()}},
 shill(X,Y,s,e){/* sight 0. It is not looking at you, it is announcing, and the
    colours are the loudest pair in the game because that is the joke */
   const t=(tNow*2.2)%1,y=Y-30*s;
   ctx.save();ctx.globalAlpha=.75;ctx.fillStyle=((tNow*4)|0)%2?'#3fe06a':'#e04ad0';
   ctx.fillRect(X-11*s,y,22*s,4*s);ctx.restore();
   ctx.save();ctx.globalAlpha=.5-t*.5;ctx.strokeStyle='#e04ad0';ctx.lineWidth=1.3*s;
   ctx.beginPath();ctx.arc(X,y+2*s,(6+t*16)*s,0,6.283);ctx.stroke();ctx.restore()},
 bull(X,Y,s,e){/* the Bull Run's own animal, head down */
   const f=(e.fx||1)>0?1:-1,y=Y-20*s,x=X+6*s*f;
   ctx.save();ctx.strokeStyle='#e0bd6e';ctx.lineWidth=1.8*s;ctx.lineCap='round';
   for(const d of [-1,1]){ctx.beginPath();ctx.moveTo(x,y+d*3*s);
     ctx.quadraticCurveTo(x+9*s*f,y+d*5*s,x+12*s*f,y+d*9*s);ctx.stroke()}
   ctx.restore();glow(x+8*s*f,y,11*s,'#e0bd6e',.3)},
 /* --- Act IV, the Gentle Years --- */
 daemon(X,Y,s,e){/* it was already running before you got here, and there are copies */
   ctx.save();
   for(let i=1;i<=2;i++){ctx.globalAlpha=.42/i;
     const o=(5+i*4)*s*((e.fx||1)>0?-1:1),y=Y-6*s-Math.sin(tNow*3+i)*1.5*s;
     ctx.fillStyle='#7be495';ctx.beginPath();ctx.ellipse(X+o,y,6*s,5*s,0,0,6.283);ctx.fill()}
   ctx.restore();
   glow(X,Y-8*s,13*s,'#7be495',.3)},
 wdog(X,Y,s,e){/* it is watching, and it sweeps */
   const y=Y-34*s,a=Math.sin(tNow*1.5)*.7;
   ctx.save();ctx.globalAlpha=.5;ctx.strokeStyle='#7be495';ctx.lineWidth=1.2*s;
   ctx.beginPath();ctx.moveTo(X,y);ctx.lineTo(X+Math.sin(a)*22*s,y+Math.cos(a)*16*s);ctx.stroke();ctx.restore();
   eye(X,y,2.2*s,'#7be495')},
 fwall(X,Y,s,e){/* a wall, carried */
   const w=15*s,h=20*s,x=X+((e.fx||1)>0?10:-10-w)*s*1.4,y=Y-36*s;
   ctx.save();ctx.globalAlpha=.75;ctx.fillStyle='#4a6e8a';ctx.strokeStyle='#9fd0ff';ctx.lineWidth=1*s;
   for(let r=0;r<3;r++)for(let c=0;c<2;c++){const bx=x+c*w/2+(r%2?w/4:0);
     ctx.beginPath();ctx.rect(bx,y+r*h/3,w/2-1,h/3-1);ctx.fill();ctx.stroke()}
   ctx.restore()},
 cam(X,Y,s,e){/* it is recording, and it wants you to know */
   const y=Y-50*s,d=(e.fx||1)>0?1:-1;
   /* a housing and a lens barrel, so the outline says camera before the colour does */
   box(X-6*s,y-4*s,12*s,9*s,2,'#2f3440');
   poly([X+6*s*d,y-2*s,X+12*s*d,y-4.5*s,X+12*s*d,y+4.5*s,X+6*s*d,y+2*s],'#454b5a');
   const on=Math.sin(tNow*3)>0;
   eye(X-3*s,y-6.5*s,1.7*s,on?'#ff3b30':'#4a1512')},
 gap(X,Y,s,e){/* the gap is the point: two halves, and the arc that should not cross it */
   const y=Y-30*s;ctx.save();ctx.strokeStyle='#59e0e6';ctx.lineWidth=1.3*s;ctx.globalAlpha=.5+.4*Math.sin(tNow*9);
   ctx.beginPath();for(let i=0;i<5;i++){const t=i/4,xx=X-14*s+28*s*t,yy=y+Math.sin(t*6.283+tNow*7)*4*s;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}
   ctx.stroke();ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 wisher(X,Y,s,e){/* it only ever wanted the best for you */
   const y=Y-50*s+Math.sin(tNow*1.6)*2.5*s,r=7*s;
   glow(X,y,20*s,'#ffd9a0',.5);
   ctx.fillStyle='#ffd9a0';ctx.lineWidth=1.2*s;ctx.beginPath();
   ctx.moveTo(X,y+r*.95);
   ctx.bezierCurveTo(X-r*1.15,y-r*.1,X-r*.5,y-r*.95,X,y-r*.3);
   ctx.bezierCurveTo(X+r*.5,y-r*.95,X+r*1.15,y-r*.1,X,y+r*.95);
   ctx.closePath();ctx.fill();ctx.stroke();ctx.lineWidth=1.4},
 companion(X,Y,s,e){/* on a lead, and the other end of it is nobody */
   const d=(e.fx||1)>0?1:-1;
   ctx.save();ctx.strokeStyle='#7be495';ctx.lineWidth=2.4*s;ctx.lineCap='round';ctx.globalAlpha=.9;
   ctx.beginPath();ctx.moveTo(X,Y-32*s);
   for(let i=1;i<=6;i++)ctx.lineTo(X-i*4.5*s*d,Y-30*s+Math.sin(tNow*2+i*.8)*2.4*s+i*2.2*s);
   ctx.stroke();ctx.restore();
   /* the collar it is wearing, so the lead has somewhere to come from */
   ctx.strokeStyle='#7be495';ctx.lineWidth=2*s;
   ctx.beginPath();ctx.ellipse(X,Y-32*s,7*s,2.6*s,0,0,6.283);ctx.stroke();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 lull(X,Y,s,e){/* it is singing you down */
   const my=Y-54*s+Math.sin(tNow*1.1)*2*s,r=5.5*s;
   glow(X,my,16*s,'#bfe0ff',.4);
   /* A crescent as one path: an outer arc and an inner arc wound the other way.
      Carving it with destination-out would take the floor behind it with it. */
   ctx.fillStyle='#bfe0ff';ctx.beginPath();
   ctx.arc(X,my,r,.62,-.62,false);
   ctx.arc(X+r*.70,my,r*.95,-.92,.92,true);
   ctx.closePath();ctx.fill();ctx.stroke();
   for(let i=0;i<3;i++){const t=(tNow*.45+i/3)%1;
     ctx.save();ctx.globalAlpha=.8*(1-t);ctx.fillStyle='#bfe0ff';
     ctx.beginPath();ctx.arc(X+8*s+Math.sin(t*5+i)*5*s,my-4*s-t*16*s,2.4*s*(1-t*.4),0,6.283);
     ctx.fill();ctx.restore()}},
 ctkr(X,Y,s,e){/* here to help */
   const y=Y-46*s,w=3*s,l=9*s;ctx.fillStyle='#e8f0e0';ctx.strokeStyle='#7be495';ctx.lineWidth=1*s;
   ctx.beginPath();ctx.rect(X-w/2,y-l/2,w,l);ctx.rect(X-l/2,y-w/2,l,w);ctx.fill();ctx.stroke();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 fetch(X,Y,s,e){/* it has brought you something */
   const x=X+((e.fx||1)>0?13:-13)*s,y=Y-16*s;
   box(x-4*s,y-4*s,8*s,8*s,1.5,'#e0c890');
   ctx.strokeStyle='#8a6a4a';ctx.lineWidth=1*s;ctx.beginPath();
   ctx.moveTo(x-4*s,y);ctx.lineTo(x+4*s,y);ctx.moveTo(x,y-4*s);ctx.lineTo(x,y+4*s);ctx.stroke();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 /* --- Act V, the Awakening --- */
 orphan(X,Y,s,e){/* a block that never made it in */
   const y=Y-20*s-Math.abs(Math.sin(tNow*2.2))*7*s,r=tNow*1.6;
   ctx.save();ctx.translate(X,y);ctx.rotate(r);
   box(-3.5*s,-3.5*s,7*s,7*s,1,'#f7931a');ctx.restore()},
 valid(X,Y,s,e){/* it checked, and it says yes */
   const y=Y-46*s;ctx.save();ctx.strokeStyle='#f7931a';ctx.lineWidth=2.2*s;ctx.lineCap='round';
   ctx.beginPath();ctx.moveTo(X-5*s,y);ctx.lineTo(X-1.5*s,y+3.5*s);ctx.lineTo(X+5*s,y-4*s);ctx.stroke();ctx.restore();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 claim(X,Y,s,e){/* paper, which is the attack */
   const y=Y-22*s;ctx.save();ctx.globalAlpha=.9;
   for(let i=0;i<2;i++){const t=(tNow*.7+i/2)%1,xx=X-(6+t*16)*s*((e.fx||1)>0?1:-1),yy=y+Math.sin(t*5+i)*4*s;
     ctx.save();ctx.translate(xx,yy);ctx.rotate(Math.sin(t*6+i)*.6);
     ctx.fillStyle='#f0ead8';ctx.strokeStyle='#989078';ctx.lineWidth=.9*s;
     ctx.beginPath();ctx.rect(-3*s,-4*s,6*s,8*s);ctx.fill();ctx.stroke();ctx.restore()}
   ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 custod(X,Y,s,e){/* it is holding it for you */
   const y=Y-40*s;ctx.fillStyle='#e0bd6e';ctx.strokeStyle='#40404a';ctx.lineWidth=1*s;
   ctx.beginPath();ctx.rect(X-5*s,y-3*s,10*s,8*s);ctx.fill();ctx.stroke();
   ctx.beginPath();ctx.arc(X,y-3*s,3.2*s,Math.PI,0);ctx.stroke();
   ctx.fillStyle='#40404a';ctx.beginPath();ctx.arc(X,y+1*s,1.3*s,0,6.283);ctx.fill();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 sniper(X,Y,s,e){/* it is waiting for the fee to drop */
   const y=Y-34*s,r=5.5*s;ctx.save();ctx.strokeStyle='#f7931a';ctx.lineWidth=1.1*s;
   ctx.globalAlpha=.55+.35*Math.sin(tNow*4);
   ctx.beginPath();ctx.arc(X,y,r,0,6.283);ctx.moveTo(X-r-2*s,y);ctx.lineTo(X+r+2*s,y);
   ctx.moveTo(X,y-r-2*s);ctx.lineTo(X,y+r+2*s);ctx.stroke();ctx.restore();
   ctx.strokeStyle=OL;ctx.lineWidth=1.4},
 oracle(X,Y,s,e){/* it is telling everyone what a thing is worth */
   const y=Y-44*s;ctx.save();ctx.strokeStyle='#f7931a';ctx.lineWidth=1.3*s;
   for(let i=1;i<=3;i++){const t=(tNow*1.1+i/3)%1;ctx.globalAlpha=.55*(1-t);
     ctx.beginPath();ctx.arc(X,y,(4+t*12)*s,-2.5,-.64);ctx.stroke()}
   ctx.restore();eye(X,y,1.8*s,'#f7931a');ctx.strokeStyle=OL;ctx.lineWidth=1.4}
};
function mobMark(e,X,Y,s){const m=MOBMARK[e.k];if(!m)return;
  ctx.save();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';
  try{m(X,Y,s,e)}catch(err){}
  ctx.restore()}


/* ================= reading a figure against its ground =================
   Diablo II's readability came from palette separation: a cool ground, warm
   actors, one bright point on each. This game breaks it in places, and
   measurably -- tools/palette-check.js scores every monster against the floor of
   every district it spawns in, in OKLab, and the Director's body is *exactly* a
   floor colour of the Nine Chairs. Standing in it, the mass of the thing
   disappears and only its faceplate carries. The art spike found the same when
   it rendered a monster in 3D: the drawn art was holding readability up with one
   bright point, and nothing else inherits that for free.

   The obvious fix is to repaint the bodies. tools/palette-fix.js will tell you
   what to repaint, and looking at its answers is what ruled it out: to clear the
   rule it wants the Warden pure black and the Oracle mid-grey, because it is
   optimising a number against palettes somebody authored on purpose.

   So light the edge instead. A soft backlight behind the actor, in the
   district's own glow, engaged only where the contrast is actually low and in
   proportion to how low. Authored colour is untouched; the thing simply stops
   being the same object as the carpet. */
function oklab(hex){const c=hex2rgb(hex),f=v=>{v/=255;return v<=.04045?v/12.92:Math.pow((v+.055)/1.055,2.4)};
  const r=f(c[0]),g=f(c[1]),b=f(c[2]);
  const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b);
  const m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b);
  const s2=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  return [.2104542553*l+.7936177850*m-.0040720468*s2,
          1.9779984951*l-2.4285922050*m+.4505937099*s2,
          .0259040371*l+.7827717662*m-.8086757660*s2]}
function labD(a,b){const x=oklab(a),y=oklab(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])*100}
/* The rule, and the one number in it: an actor should stand dE 18 clear of its
   floor. Cached per style and kind, because this is per-frame code. */
const RIM_MIN=18,RIMC={};
function rimNeed(k){const key=TX.style+'|'+k;if(key in RIMC)return RIMC[key];
  let v=0;const t=ET[k],f=TX.s&&TX.s.f;
  if(t&&t.pal&&t.pal[0]&&f&&f.length){let d=1e9;
    for(let i=0;i<f.length;i++)d=Math.min(d,labD(t.pal[0],f[i]));
    if(d<RIM_MIN)v=Math.min(1,(RIM_MIN-d)/RIM_MIN)}
  return RIMC[key]=v}
function rimOn(e){
  if(OPT.fx==='thin')return 0;
  const amt=rimNeed(e.k);if(!(amt>0))return 0;
  const g=hex2rgb((TX.s&&TX.s.glow)||'#ffcf7a'),k=.20+.38*amt;
  /* the district's own light, mixed into the outline rather than replacing it,
     so a figure that only half needs it only half gets it */
  const o=hex2rgb(OL0),m=i=>Math.round(o[i]+(g[i]-o[i])*k);
  OL='rgb('+m(0)+','+m(1)+','+m(2)+')';
  return 1}

function drawEnemy(e,X,Y){
  const s=e.sz,t=ET[e.k],k=t.spr||e.k,fl=e.flash>0,c1=fl?'#fff':t.pal[0],c2=fl?'#fff':t.pal[1],bob=Math.sin(e.ph*4)*2,f=e.fx||1,mov=e.aggro&&e.stun<=0;
  const lit=rimOn(e);
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';
  if(e.champ){ctx.strokeStyle=e.su?'#d0aa62':'#8494ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,20*s,10*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  if(e.mark>0){ctx.strokeStyle='#ff5d4d';ctx.beginPath();ctx.ellipse(X,Y,14*s,7*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL}
  if(e.ward>0||e.k==='aegis'){ctx.strokeStyle='rgba(159,208,255,.75)';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y-22*s,17*s,25*s,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4}
  if(e.mods.shield){ctx.fillStyle='rgba(140,170,255,.16)';ctx.beginPath();ctx.ellipse(X,Y-24*s,22*s,30*s,0,0,6.283);ctx.fill()}
  if(OPT.spr!==false&&sprReady(k)&&sprActor(k,e,X,Y,s,fl)){}
  else if(e.k==='boss4'){/* She built this body out of the only parts the machines here know how
       to make, which is an executive, and she said sorry for it. So: the frame, with
       nothing on it to hurt you, and the attending lights she cannot help sending. */
    const u=1.9,f2=e.hp/e.max,b=Math.sin(e.ph*2)*1.6;shadow(X,Y,22*u);
    for(let i=0;i<6;i++){const a=tNow*.6+i*1.047,rx=Math.cos(a)*30*u,ry=Math.sin(a)*12*u-34*u;
      /* the attending lights are the feed: cards she is holding up for you */
      ctx.fillStyle='rgba(123,228,149,'+(.25+.3*Math.sin(tNow*2+i))+')';ctx.fillRect(X+rx-3.4*u,Y+ry+b-2.4*u,6.8*u,4.8*u);ctx.fillStyle='rgba(244,240,230,.5)';ctx.fillRect(X+rx-2.4*u,Y+ry+b-1.2*u,4.8*u,.9*u)}
    ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    box(X-10*u,Y-15*u,7*u,15*u,3,'#cfc8b8');box(X+3*u,Y-15*u,7*u,15*u,3,'#cfc8b8');
    box(X-13*u,Y-42*u+b,26*u,29*u,7*u,fl?'#fff':c1);
    ctx.fillStyle='rgba(123,228,149,.22)';ctx.fillRect(X-13*u,Y-30*u+b,26*u,3*u);
    /* open hands, held away from the body */
    box(X-21*u,Y-38*u+b,7*u,19*u,3*u,'#e4decf');box(X+14*u,Y-38*u+b,7*u,19*u,3*u,'#e4decf');
    box(X-22*u,Y-20*u+b,9*u,7*u,3*u,'#f4f0e6');box(X+13*u,Y-20*u+b,9*u,7*u,3*u,'#f4f0e6');
    box(X-9*u,Y-56*u+b,18*u,16*u,6*u,fl?'#fff':'#f4f0e6');
    ctx.fillStyle='#1d2a20';ctx.fillRect(X-7*u,Y-50*u+b,14*u,7*u);
    ctx.strokeStyle=f2<.5?'#7be495':'#9fffc8';ctx.lineWidth=1.8*u;ctx.lineCap='round';ctx.beginPath();
    if(f2>.5)ctx.arc(X,Y-48.5*u+b,4*u,.35,2.79);else ctx.ellipse(X,Y-46.5*u+b,4*u,.6*u,0,0,3.142);
    ctx.stroke();ctx.lineCap='butt';
    ctx.fillStyle='#9fffc8';ctx.fillRect(X-4.6*u,Y-49.6*u+b,1.6*u,1.6*u);ctx.fillRect(X+3*u,Y-49.6*u+b,1.6*u,1.6*u);
    ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    glow(X,Y-44*u+b,56*u,'#7be495',.3);light(X,Y-40*u,210,'#7be495')}
  else if(e.k==='boss5'){/* Made to win, and it has modelled this. The fans are the forty-one
       ways it has already seen the conversation go; they go out as you take them away. */
    const p2=e.hp/e.max,H=158,wob=Math.sin(tNow*1.3)*1.5;shadow(X,Y,40);
    const left=Math.max(1,Math.min(Math.round(41*p2),41-(e.used|0)));
    ctx.save();ctx.lineCap='round';
    for(let i=0;i<41;i++){const on=i<left,a=-1.5708+(i/40-.5)*1.32,L=38+((i*37)%26);
      ctx.strokeStyle=on?'rgba(247,147,26,'+(.14+.14*Math.sin(tNow*1.6+i))+')':'rgba(60,46,30,.12)';ctx.lineWidth=on?1.5:1;
      ctx.beginPath();ctx.moveTo(X,Y-H+6);ctx.lineTo(X+Math.cos(a)*L*1.5,Y-H+6+Math.sin(a)*L);ctx.stroke()}
    ctx.restore();ctx.lineCap='butt';
    poly([X-44,Y-6,X+44,Y-6,X+36,Y-22,X-36,Y-22],'#0a0810');
    poly([X-30,Y-H,X+30,Y-H,X+36,Y-18,X-36,Y-18],fl?'#fff':'#050308');
    ctx.fillStyle='rgba(247,147,26,.5)';ctx.fillRect(X-1.4,Y-H+10+wob,2.8,H-40);
    ctx.fillStyle=p2<.5?'#ff6a2a':'#f7931a';ctx.fillRect(X-22,Y-H*.62,44*p2,3);
    ctx.fillStyle='#f7931a';ctx.fillRect(X-3,Y-H+16,6,6);
    glow(X,Y-H*.7,96,p2<.5?'#ff6a2a':'#f7931a',.3);light(X,Y-H*.55,240,'#f7931a');
    /* where it thinks you will be, and the one fan that is pointing there */
    if(e.aim&&e.aggro){const ax=SX(e.aim.x,e.aim.y),ay=SY(e.aim.x,e.aim.y);ctx.save();ctx.strokeStyle='#f7931a';ctx.globalAlpha=.3;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(X,Y-H+6);ctx.lineTo(ax,ay);ctx.stroke();
      ctx.globalAlpha=.75;ctx.lineWidth=1.6;ctx.beginPath();ctx.ellipse(ax,ay,15,7.5,0,0,6.283);ctx.moveTo(ax-20,ay);ctx.lineTo(ax+20,ay);ctx.moveTo(ax,ay-10);ctx.lineTo(ax,ay+10);ctx.stroke();ctx.restore();light(ax,ay,50,'#f7931a')}}
  else if(k==='tick'){shadow(X,Y,8*s);const y=Y-6*s;ctx.lineWidth=1.6;ctx.strokeStyle='#2a2630';for(let i=0;i<4;i++){const a=(i<2?-1:1)*(8+(i%2)*3)*s,w=Math.sin(e.ph*18+i)*2;ctx.beginPath();ctx.moveTo(X,y);ctx.lineTo(X+a,y-4*s+w);ctx.lineTo(X+a*1.3,Y);ctx.stroke()}
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
  else if(e.k==='boss3'){/* A mandate is not a person, so there is nobody behind
    the bench: only the bench, the line it has written, and the seal. It shared
    mono's body with PROVIDENCE until now, and mono is a tall narrow wedge --
    so this is deliberately wide and low. At the far end of a room the
    silhouette alone should say which of the two you are looking at. It also
    has spd 0, and a thing that cannot move should look like it never meant to. */
    shadow(X,Y,46);const p=e.hp/e.max;
    poly([X-62,Y-14,X+62,Y-14,X+54,Y-56,X-54,Y-56],fl?'#fff':'#0b0912');
    poly([X-54,Y-56,X+54,Y-56,X+46,Y-74,X-46,Y-74],fl?'#fff':'#141222');
    /* the line of the decree, as long as the mandate still holds */
    ctx.fillStyle='#fff';ctx.fillRect(X-44,Y-66,88*p,2.5);
    if(p<.5){ctx.save();ctx.globalAlpha=.5;ctx.fillStyle='#fff';
      for(let i=0;i<4;i++)ctx.fillRect(X-44+i*24,Y-66+((i%2)?3:-3),10,2);ctx.restore()}
    /* the seal: the only round thing on it, and the only part that moves */
    const sy=Y-92+Math.sin(tNow*.8)*2;
    ctx.fillStyle=fl?'#fff':'#0b0912';ctx.beginPath();ctx.arc(X,sy,17,0,6.283);ctx.fill();ctx.stroke();
    ctx.strokeStyle='#fff';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(X,sy,11,0,6.283);ctx.stroke();
    ctx.strokeStyle=OL;ctx.lineWidth=1.4;
    eye(X,sy,p<.5?4.5:3,p<.5?'#ff5d4d':'#fff');
    glow(X,sy,34,p<.5?'#ff5d4d':'#9fd0ff',.3)}
  else if(k==='mono'){shadow(X,Y,34);const p=e.hp/e.max;poly([X-26,Y-150,X+26,Y-150,X+30,Y,X-30,Y],fl?'#fff':'#07060b');ctx.fillStyle='#fff';ctx.fillRect(X-18,Y-96,36*p,2.5);ctx.fillStyle=p<.5?'#ff3b30':'#ffffff';ctx.fillRect(X-1.5,Y-128,3,22);glow(X,Y-100,70,p<.5?'#ff3b30':'#ffffff',.3);light(X,Y-80,200,'#ffffff')}
  else{const B=k==='boss',u=B?1.9:1.25*s;shadow(X,Y,21*u);const b=mov?Math.abs(Math.sin(e.ph*5))*1.5:0;
    box(X-12*u,Y-14*u,9*u,14*u,2,'#23202c');box(X+3*u,Y-14*u,9*u,14*u,2,'#23202c');
    box(X-15*u,Y-40*u+b,30*u,28*u,4,c1);ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(X+(f>0?-14:3)*u,Y-38*u+b,11*u,24*u);
    box(X-23*u,Y-43*u+b,10*u,13*u,3,c2);box(X+13*u,Y-43*u+b,10*u,13*u,3,c2);
    box(X-22*u,Y-30*u+b,7*u,16*u+(e.wind>0||e.slam?-6:0),2,'#3a3848');box(X+15*u,Y-30*u+b,7*u,16*u,2,'#3a3848');
    box(X-9*u,Y-55*u+b,18*u,15*u,3,B?'#0b0912':'#3d4257');
    {const c=(TX.s&&TX.s.glow)||'#ffcf7a';ctx.save();ctx.strokeStyle=c;ctx.globalAlpha=.34;ctx.lineCap='round';ctx.lineWidth=1.9*u;
     ctx.beginPath();ctx.moveTo(X-8.6*u,Y-55*u+b);ctx.lineTo(X+8.6*u,Y-55*u+b);ctx.stroke();
     ctx.beginPath();ctx.moveTo(X-22.6*u,Y-42.4*u+b);ctx.lineTo(X-13.4*u,Y-42.4*u+b);ctx.moveTo(X+13.4*u,Y-42.4*u+b);ctx.lineTo(X+22.6*u,Y-42.4*u+b);ctx.stroke();
     ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineCap='butt'}
    if(B){box(X-6*u,Y-40*u+b,12*u,16*u,1,'#e6e2d6');poly([X-2.5*u,Y-40*u+b,X+2.5*u,Y-40*u+b,X+3.5*u,Y-23*u+b,X,Y-18*u+b,X-3.5*u,Y-23*u+b],'#b3261e');
      ctx.fillStyle=e.hp<e.max*.5?'#ff3b30':'#e0bd6e';ctx.font='900 '+8*u+'px Cinzel,serif';ctx.textAlign='center';ctx.fillText(e.slam?'!!':e.k==='boss4'?(e.hp<e.max*.5?':(':':)'):e.k==='boss2'?(e.hp<e.max*.5?'…':'SVP'):e.hp<e.max*.5?'>:(':'VP',X,Y-45*u+b);glow(X,Y-48*u+b,40,'#e0bd6e',.4);light(X,Y-40*u,150,'#e0bd6e')}
    else{ctx.fillStyle='#ff3b30';ctx.fillRect(X-6*u,Y-50*u+b,12*u,3*u);glow(X,Y-48*u+b,18*u,'#ff3b30',.5);eye(X-18*u,Y-40*u+b,1.6*u,'#ffe36b');eye(X+18*u,Y-40*u+b,1.6*u,'#ffe36b')}}
  mobMark(e,X,Y,s);
  if(lit){OL=OL0;ctx.strokeStyle=OL}
  const top=Y-(e.k==='boss5'?172:e.k==='boss4'?122:k==='mono'?160:k==='boss'?112:k==='mech'?76*s:k==='tick'?20:k==='hound'?36*s:56*s);
  if(e.stun>0){ctx.fillStyle='#59e0e6';ctx.font='700 10px Cinzel,serif';ctx.textAlign='center';ctx.fillText('STUNNED',X,top-4)}
  if(OPT.enemyBars&&e.hp<e.max&&k!=='boss'&&k!=='mono'&&e.k!=='boss4'&&e.k!=='boss5'){const w=30*s;ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,top-1,w+2,5);ctx.fillStyle=e.su?'#d0aa62':e.champ?'#8494ff':'#d23a2e';ctx.fillRect(X-w/2,top,w*Math.max(0,e.hp/e.max),3)}
  if(e.champ){ctx.font='700 11px Cinzel,serif';ctx.textAlign='center';
    /* Drawn straight, not through label(), because a champion's name is shadowed text
       with no plate behind it. It still claims the room it uses so a name or a bubble
       placed later steps over it. */
    const cw=ctx.measureText(e.name).width+6,cy0=txtSlot(X-cw/2,top-20,cw,14,16,10);
    if(cy0===null)return;txtClaim(X-cw/2,cy0,cw,14);
    ctx.fillStyle='#000';ctx.fillText(e.name,X+1,cy0+12);ctx.fillStyle=e.su?'#d0aa62':'#8494ff';ctx.fillText(e.name,X,cy0+11);
    ctx.font='400 9.5px Spectral,serif';ctx.fillStyle='#b8b0a0';
    const md=Object.keys(e.mods).map(m=>MODS[m]).join(' · ');
    if(md){const mw=ctx.measureText(md).width+6,my=txtSlot(X-mw/2,cy0-13,mw,12,14,4);
      if(my!==null){txtClaim(X-mw/2,my,mw,12);ctx.fillText(md,X,my+10)}}}
}
function wrapText(t,max){const ws=t.split(' '),out=[];let l='';for(const w of ws){const n=l?l+' '+w:w;if(ctx.measureText(n).width>max&&l){out.push(l);l=w}else l=n}out.push(l);return out}
function bubble(X,Y,t){ctx.font='400 12.5px Spectral,serif';const ls=wrapText(t,150),w=Math.max(...ls.map(l=>ctx.measureText(l).width))+14,h=ls.length*15+10;
  const x=X-w/2,top=txtSlot(x,Y-h,w,h+7,h+7,4);
  if(top===null)return;
  const by=top+h;txtClaim(x,top,w,h+7);
  ctx.fillStyle='#e6e2d6';ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.beginPath();ctx.roundRect(x,top,w,h,5);ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(X-5,by-1);ctx.lineTo(X,by+6);ctx.lineTo(X+5,by-1);ctx.fill();
  ctx.fillStyle='#17121e';ctx.textAlign='center';ls.forEach((l,i)=>ctx.fillText(l,X,top+17+i*15))}
function label(X,Y,t,col,fnt){ctx.font=fnt||'700 10.5px Cinzel,serif';ctx.textAlign='center';
  const w=ctx.measureText(t).width+10,x=X-w/2,y=txtSlot(x,Y-12,w,16,17,16);
  if(y===null)return;txtClaim(x,y,w,16);
  ctx.fillStyle='rgba(5,4,9,.78)';ctx.fillRect(x,y,w,16);ctx.fillStyle=col;ctx.fillText(t,X,y+12)}
function portal(X,Y,col){shadow(X,Y,17);const g=ctx.createRadialGradient(X,Y-30,2,X,Y-30,34);g.addColorStop(0,'#fff');g.addColorStop(.35,col);g.addColorStop(1,'rgba(0,0,0,.1)');
  ctx.save();ctx.translate(X,Y-30);ctx.scale(.62,1);ctx.beginPath();ctx.arc(0,0,31,0,6.283);ctx.fillStyle=g;ctx.globalAlpha=.85;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=3;
  for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(0,0,12+i*8,tNow*(2+i)+i,tNow*(2+i)+i+2.2);ctx.stroke()}ctx.restore();glow(X,Y-30,70,col,.5);light(X,Y-30,150,col)}
const QCOL=['#e6e2d6','#8494ff','#ffe36b','#3fe06a','#d0aa62'];
function quest(id){if(QRW.some(r=>r[1]===id&&G.q[r[0]]===2))return true;if(id==='null'&&briefReady('q4'))return true;if(id==='gramps'&&G.q.q10===3&&!G.q.q11)return true;if(id==='gramps'&&((G.q.q15===3&&!G.q.q16)||(G.q.q20===3&&!G.q.q21)))return true;if(id==='nonce'&&Object.keys(G.st.wf).length>=12&&!G.wallet)return true;if(sqMark(id))return true;if(id==='gramps'&&(G.q.q6===2||(G.q.q5===3&&!G.q.q6)))return true;if(id==='marrow')return G.q.q8===2;if(id==='nonce')return G.q.q9===2||smearOpen();if(id==='null'&&G.q.q7===2)return true;if(id==='gramps')return G.q.q1===0||G.q.q1===2||G.q.q3===2;if(id==='brenda')return G.q.q2===2;if(id==='null')return G.q.q4===2;return false}
function drawNpc(n,X,Y){
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;
  if(n.term){shadow(X,Y,16);box(X-18,Y-16,36,16,2,'#3a4250');box(X-9,Y-36,18,16,2,'#17131c');ctx.fillStyle=Math.sin(tNow*3+n.x)>0?'#59e0e6':'#7be495';ctx.fillRect(X-7,Y-34,14,10);glow(X,Y-29,30,'#59e0e6',.4);light(X,Y-28,90,'#59e0e6');label(X,Y-46,n.name.toUpperCase(),'#59e0e6');return}
  if(n.id==='gate'){box(X-24,Y-6,48,8,2,'#3a3250');portal(X,Y-4,'#59e0e6');label(X,Y-76,'TRANSIT GATE','#59e0e6');return}
  if(n.id==='vr'){shadow(X,Y,18);poly([X-18,Y-6,X,Y+3,X+18,Y-6,X,Y-15],'#2a2040');box(X-10,Y-34,20,26,6,'#3a2a5a');box(X-12,Y-44,24,12,5,'#17131c');ctx.fillStyle=Math.sin(tNow*4)>0?'#ff5ad0':'#59e0e6';ctx.fillRect(X-9,Y-41,18,5);glow(X,Y-38,40,'#ff5ad0',.45);light(X,Y-34,120,'#ff5ad0');label(X,Y-54,'VR SIMULATOR','#ff8ae0');return}
  if(n.id==='board'){shadow(X,Y,16);box(X-16,Y-34,3,34,1,'#4a3a2a');box(X+13,Y-34,3,34,1,'#4a3a2a');box(X-19,Y-48,38,24,1,'#6a5030');for(const[a,b,c]of[[-14,-45,'#e6e2d6'],[-2,-44,'#ffe9a8'],[8,-46,'#e6e2d6'],[-9,-35,'#ffe9a8'],[4,-34,'#e6e2d6']]){ctx.fillStyle=c;ctx.fillRect(X+a,Y+b,8,9)}label(X,Y-56,'BOUNTIES','#f7931a');if((G.bounties||[]).some(b=>b.c>=b.n)){ctx.font='900 22px Cinzel,serif';ctx.fillStyle='#ffe36b';ctx.textAlign='center';ctx.fillText('!',X,Y-72)}return}
  if(n.id==='stash'){shadow(X,Y,15);poly([X-15,Y-18,X,Y-11,X,Y+2,X-15,Y-5],'#4a5060');poly([X,Y-11,X+15,Y-18,X+15,Y-5,X,Y+2],'#353a48');poly([X-15,Y-18,X,Y-25,X+15,Y-18,X,Y-11],'#5c6478');box(X-3,Y-10,6,6,1,'#e0bd6e');label(X,Y-34,'YOUR LOCKBOX','#d0aa62');return}
  if(n.id==='ubi'){shadow(X,Y,14);box(X-12,Y-46,24,46,3,'#3d3654');ctx.fillStyle=Math.sin(tNow*3)>0?'#7be495':'#59e0e6';ctx.fillRect(X-9,Y-41,18,14);ctx.fillStyle='#17121e';ctx.font='700 9px Cinzel,serif';ctx.textAlign='center';ctx.fillText('₡500',X,Y-31);box(X-6,Y-20,12,3,1,'#17121e');light(X,Y-34,70,'#7be495');label(X,Y-54,'THE STIPEND','#7be495');return}
  if(n.id==='paper'||n.id==='flyer'||n.id==='obit'||n.id==='hello'){eggDrawProp(n,X,Y);return}
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
  if(n.id==='tariff'){ctx.fillStyle='#3a342c';ctx.fillRect(X-9,y0-16,18,10)}
  if(n.id!=='res'){label(X,y0-(n.id==='brenda'?66:52),n.name.toUpperCase(),'#d0aa62');if(quest(n.id)){ctx.font='900 22px Cinzel,serif';ctx.fillStyle='#ffe36b';ctx.textAlign='center';ctx.fillText('!',X,y0-(n.id==='brenda'?84:70)+Math.sin(tNow*4)*2)}}
  if(n.st>0)bubble(X,y0-54,n.say)}
function drawObj(o,X,Y){
  ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.lineJoin='round';const s=TX.s,st=s.like||W.z.style;
  if(o.k==='arc'&&typeof arcDraw==='function'){arcDraw(o,X,Y);return}
  if(o.k==='lamp'){shadow(X,Y,7);box(X-2,Y-52,4,52,1,'#2a2630');box(X-7,Y-58,14,7,2,'#3a3644');ctx.fillStyle=s.glow;ctx.fillRect(X-5,Y-52,10,3);const fl=1+.05*Math.sin(tNow*11+o.x*7)+.03*Math.sin(tNow*23+o.y*3);glow(X,Y-48,46*fl,s.glow,.5);light(X,Y-30,175*fl,s.glow)}
  else if(o.k==='crate'){if(o.used){ctx.fillStyle='rgba(60,45,25,.6)';ctx.fillRect(X-10,Y-3,8,3);ctx.fillRect(X+2,Y-1,9,3);return}shadow(X,Y,14);poly([X-13,Y-22,X,Y-16,X,Y+2,X-13,Y-5],'#8a6a40');poly([X,Y-16,X+13,Y-22,X+13,Y-5,X,Y+2],'#6a5030');poly([X-13,Y-22,X,Y-28,X+13,Y-22,X,Y-16],'#a8895c');ctx.strokeStyle='#4a3620';ctx.beginPath();ctx.moveTo(X-13,Y-14);ctx.lineTo(X,Y-7);ctx.lineTo(X+13,Y-14);ctx.stroke()}
  else if(o.k==='chest'){shadow(X,Y,15);poly([X-14,Y-16,X,Y-10,X,Y+2,X-14,Y-4],'#4a5060');poly([X,Y-10,X+14,Y-16,X+14,Y-4,X,Y+2],'#353a48');poly([X-14,Y-16+(o.used?-8:0),X,Y-22+(o.used?-10:0),X+14,Y-16+(o.used?-8:0),X,Y-10],'#5c6478');if(!o.used){box(X-3,Y-9,6,6,1,'#e0bd6e');glow(X,Y-10,28,'#e0bd6e',.45+.2*Math.sin(tNow*3));light(X,Y-10,60,'#e0bd6e')}}
  else if(o.k==='pow'){if(W.pow&&W.pow.o===o){ctx.save();ctx.setLineDash([10,8]);ctx.strokeStyle='rgba(247,147,26,.55)';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(X,Y,9*45,9*22.5,0,0,6.283);ctx.stroke();ctx.restore();ctx.strokeStyle=OL;ctx.lineWidth=1.4}shadow(X,Y,14);poly([X-12,Y-6,X,Y,X+12,Y-6,X,Y-12],'#3a2a1a');poly([X-7,Y-8,X+7,Y-8,X+4,Y-46,X-4,Y-46],o.used?'#3a342a':'#5a3a12');const pw=W.pow&&W.pow.o===o?1-W.pow.t/60:o.used?1:0;ctx.fillStyle='#f7931a';ctx.fillRect(X-3,Y-10-34*pw,6,34*pw);if(!o.used){glow(X,Y-28,46,'#f7931a',.35+.15*Math.sin(tNow*3));light(X,Y-28,140,'#f7931a');label(X,Y-54,pw?Math.ceil(W.pow.t)+'s':'PROOF OF WORK','#f7931a','700 8.5px Cinzel,serif')}}
  else if(o.k==='shrine'){shadow(X,Y,13);poly([X-11,Y-6,X,Y-1,X+11,Y-6,X,Y-11],'#5a566a');box(X-5,Y-24,10,18,1,'#4a4658');const c={might:'#ff5d4d',guard:'#8494ff',xp:'#ffe36b',luck:'#3fe06a',fill:'#59e0e6',gold:'#e0bd6e',eyes:'#ff2a2a'}[o.sk],y=Y-38+Math.sin(tNow*2+o.x)*3;
    if(!o.used){poly([X,y-10,X+7,y,X,y+10,X-7,y],c);glow(X,y,36,c,.6);light(X,y,120,c)}else poly([X-5,Y-26,X+4,Y-27,X+2,Y-23],'#3a3644')}
  else if(o.k==='memo'){const y=Y-12+Math.sin(tNow*3+o.x)*2;shadow(X,Y,6);poly([X-6,y-8,X+6,y-9,X+7,y+6,X-5,y+7],'#e6e2d6');ctx.fillStyle='#6a6458';for(let i=0;i<4;i++)ctx.fillRect(X-4,y-5+i*3,8,1);glow(X,y,26,'#ffe36b',.5);light(X,y,50,'#ffe36b')}else if(o.k==='page'){const y=Y-14+Math.sin(tNow*3+o.x)*2;shadow(X,Y,8);poly([X-7,y-9,X+7,y-10,X+7,y+8,X-7,y+7],'#e6e2d6');ctx.fillStyle='#6a6458';for(let i=0;i<4;i++)ctx.fillRect(X-5,y-6+i*3,10,1);if(!o.used){glow(X,y,28,'#ffe36b',.5);light(X,y,70,'#ffe36b');label(X,Y-42,'LETTER','#ffe36b','700 8.5px Cinzel,serif')}}else if(o.k==='minute'){const y=Y-14+Math.sin(tNow*3+o.x)*2;shadow(X,Y,8);poly([X-8,y-10,X+8,y-11,X+8,y+8,X-8,y+7],'#1e4a32');ctx.fillStyle='#e6e2d6';ctx.fillRect(X-6,y-8,12,14);ctx.fillStyle='#1e4a32';for(let i=0;i<4;i++)ctx.fillRect(X-4,y-5+i*3,8,1);if(!o.used){glow(X,y,28,'#7be495',.45);light(X,y,70,'#7be495');label(X,Y-42,'MINUTES','#7be495','700 8.5px Cinzel,serif')}}
  else if(o.k==='qobj'){const L=o.look,u=o.used;
    if(L==='person'){human(X,Y,{c:'#8a6a40',c2:'rgba(0,0,0,.3)',skin:'#c9a184',ph:tNow*3});box(X+8,Y-22,10,4,1,'#4a4658')}
    else if(L==='lift'){shadow(X,Y,15);box(X-14,Y-44,28,44,2,'#4a4658');ctx.fillStyle='#9fffe0';ctx.fillRect(X-10,Y-40,20,30);ctx.fillStyle='#17131c';ctx.beginPath();ctx.moveTo(X,Y-20);ctx.lineTo(X-6,Y-30);ctx.lineTo(X+6,Y-30);ctx.fill()}
    else if(L==='box'){shadow(X,Y,10);if(!u){box(X-9,Y-9,18,9,1,'#a8895c');box(X-10,Y-12,20,4,1,'#c0a070')}}
    else if(L==='drum'){shadow(X,Y,10);if(!u){box(X-8,Y-20,16,20,3,'#3a6a8a');ctx.fillStyle='#e0bd6e';ctx.fillRect(X-8,Y-14,16,2);ctx.fillRect(X-8,Y-7,16,2)}}
    else if(L==='cab'){shadow(X,Y,13);box(X-12,Y-36,24,36,2,'#d8d8e0');ctx.fillStyle='#b3261e';ctx.fillRect(X-2,Y-28,4,12);ctx.fillRect(X-6,Y-24,12,4)}
    else if(L==='kiosk'){shadow(X,Y,13);box(X-12,Y-40,24,40,2,'#3a3250');ctx.fillStyle=u?'#e6e2d6':'#2a2433';ctx.fillRect(X-9,Y-36,18,12);box(X-8,Y-18,16,3,1,'#17131c');if(u)for(let i=0;i<4;i++){ctx.fillStyle='#e6e2d6';ctx.fillRect(X-6+i*3,Y-18-((tNow*30+i*9)%26),5,6)}}
    else if(L==='node'){shadow(X,Y,13);box(X-11,Y-22,22,22,2,'#26262e');ctx.strokeStyle='#4a4658';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+6,Y-22);ctx.lineTo(X+10,Y-40);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;const on=u&&(W.hold||Math.sin(tNow*3)>0);ctx.fillStyle=on?'#f7931a':'#3a2a1a';ctx.fillRect(X-7,Y-17,5,4);ctx.fillRect(X+1,Y-17,5,4);if(u){glow(X,Y-14,40,'#f7931a',.5);light(X,Y-14,140,'#f7931a')}}
    else if(L==='lemon'){shadow(X,Y,8);ctx.fillStyle='#e6d24a';ctx.beginPath();ctx.ellipse(X,Y-8,7,5,.2,0,6.283);ctx.fill();ctx.stroke()}
    if(!u){ctx.font='900 20px Cinzel,serif';ctx.fillStyle='#59e0e6';ctx.textAlign='center';ctx.fillText('!',X,Y-(L==='person'?56:L==='box'?22:48)+Math.sin(tNow*4)*2);light(X,Y-16,90,'#59e0e6')}}
  else if(o.k==='dnode'){const u=o.used||G.nodes[W.zi];shadow(X,Y,13);box(X-11,Y-22,22,22,2,'#26262e');ctx.strokeStyle='#4a4658';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X+6,Y-22);ctx.lineTo(X+10,Y-40);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;ctx.fillStyle=u?'#f7931a':'#3a2a1a';ctx.fillRect(X-7,Y-17,5,4);ctx.fillRect(X+1,Y-17,5,4);if(u){glow(X,Y-14,40,'#f7931a',.5);light(X,Y-14,150,'#f7931a')}else label(X,Y-48,'DEAD NODE','#8a5a1a','700 8.5px Cinzel,serif')}
  else if(o.k==='leg'){shadow(X,Y,9);ctx.save();ctx.translate(X,Y-6);ctx.rotate(.5+.08*Math.sin(tNow*9));box(-3,-16,6,14,2,'#6a6a78');box(-4,-3,8,6,2,'#3a3a44');box(-3,3,10,5,2,'#6a6a78');ctx.restore();glow(X,Y-8,26,'#ffe36b',.35);label(X,Y-34,'SERVO LEG','#ffe36b','700 8.5px Cinzel,serif')}
  else if(o.k==='corpse'){shadow(X,Y,16);ctx.save();ctx.translate(X,Y);ctx.rotate(-1.15);ctx.fillStyle='#6a2430';ctx.beginPath();ctx.ellipse(0,-6,16,7,0,0,6.283);ctx.fill();ctx.fillStyle='#d9c3a6';ctx.beginPath();ctx.arc(11,-7,5,0,6.283);ctx.fill();ctx.restore();glow(X,Y-8,40,'#e23b32',.4+.12*Math.sin(tNow*3));light(X,Y-8,70,'#e23b32');label(X,Y-34,'YOUR BODY','#ffb4ae','700 8.5px Cinzel,serif')}else if(o.k==='stray'){human(X,Y,{c:'#8a8496',c2:'rgba(0,0,0,.3)',s:.92,ph:tNow*20,mov:false});ctx.fillStyle='#59e0e6';ctx.fillRect(X+8,Y-4,9,2.5);light(X,Y-20,70,'#ffcf7a')}
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
/* Which sky a district stands under. Anything unlisted falls through to 1, the
   dead city, which was wrong for all of Act IV: the Gentle Years are not a ruin,
   they are a place that has been seen to. 5 is that, 6 is the 2015 prequel, where
   the sky is still only the sky. */
const BGK={chain:4,mempool:4,blocks:4,room:4,reactor:2,shaft:2,garden:2,lake:2,walk:2,mezz:2,landing:2,vest:3,minutes:3,chairs:3,rack:3,wait:3,still:4,cutler:5,mile:5,sofa:5,list:5,kitchen:5,garage:1,vault:4,cage:6};
/* Full-screen gradients are the expensive part of a backdrop and they never change
   until the style or the viewport does, so bake them once and blit. */
let BGC=null,BGK2='';
function bgBase(k){const key=k+'|'+Math.round(VW)+'x'+Math.round(VH);if(BGK2===key)return BGC;BGK2=key;
  const c=mk(Math.max(1,Math.round(VW)),Math.max(1,Math.round(VH))),g=c.getContext('2d'),w=c.width,h=c.height,G2=(a,b2,st)=>{const q=g.createLinearGradient(0,0,0,h);for(const[o,col]of st)q.addColorStop(o,col);return q};
  if(k===2){g.fillStyle=G2(0,0,[[0,'#140f2c'],[.45,'#2a2250'],[1,'#4a4070']]);g.fillRect(0,0,w,h)}
  else if(k===3){const q=g.createRadialGradient(w/2,h/2,40,w/2,h/2,h*.8);q.addColorStop(0,'#200c11');q.addColorStop(1,'#050308');g.fillStyle=q;g.fillRect(0,0,w,h)}
  else if(k===4){g.fillStyle=G2(0,0,[[0,'#03050b'],[.7,'#05070f'],[1,'#080a14']]);g.fillRect(0,0,w,h);
    const q=g.createRadialGradient(w/2,h*.72,10,w/2,h*.72,h*.6);q.addColorStop(0,'rgba(247,147,26,.10)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,h*.2,w,h*.8)}
  else if(k===5){/* the Gentle Years: a sky that has been seen to, at a golden hour
       that does not end, because nobody asked for it to */
    g.fillStyle=G2(0,0,[[0,'#8a6490'],[.14,'#cd7f78'],[.3,'#f3a76a'],[.46,'#ffc890'],[1,'#ffe3bc']]);g.fillRect(0,0,w,h);
    const q=g.createRadialGradient(w*.5,h*.3,10,w*.5,h*.3,h*.55);
    q.addColorStop(0,'rgba(255,232,190,.45)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,w,h)}
  else if(k===6){/* 2015: the one daylight in the game, and nothing wrong with it yet */
    g.fillStyle=G2(0,0,[[0,'#9fc4e0'],[.55,'#cfe0ea'],[1,'#e8e4d8']]);g.fillRect(0,0,w,h);
    const q=g.createRadialGradient(w*.68,h*.2,8,w*.68,h*.2,h*.8);
    q.addColorStop(0,'rgba(255,250,232,.5)');q.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=q;g.fillRect(0,0,w,h)}
  else{g.fillStyle=G2(0,0,[[0,'#09070f'],[.55,'#120d1c'],[1,'#1a1326']]);g.fillRect(0,0,w,h);
    const q=g.createLinearGradient(0,h*.3,0,h*.62);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(150,90,60,.14)');g.fillStyle=q;g.fillRect(0,h*.3,w,h*.34)}
  return BGC=c}
/* Three bands at three parallax rates: a sky, a far skyline, a near one. The near band
   slides about four times as fast as the far, which is the whole trick. */
function skyline(seed,yb,h0,h1,rate,col,px,lit,t){
  const W0=VW+140;let x=-((px*rate)%92+92)%92-40;
  for(let i=0;x<W0;i++){const q=hsh(i+seed),bw=22+q*42,bh=h0+hsh(i*3+seed)*(h1-h0);
    ctx.fillStyle=col;ctx.fillRect(x,yb-bh,bw,bh+VH);
    if(lit)for(let k=0;k<5;k++)if(hsh(i*7+k+seed)>.62){ctx.fillStyle=Math.sin(t*.7+i*2.3+k)>-.55?lit:'rgba(0,0,0,0)';ctx.fillRect(x+4+hsh(i+k+seed)*(bw-10),yb-bh+9+k*13,2.5,4)}
    x+=bw+4}}
function backdrop(){const k=BGK[W.z.style]||1,px=(P.x-P.y)*3,py=(P.x+P.y)*1.5,t=tNow;
  ctx.drawImage(bgBase(k),0,0,VW,VH);
  if(k===2){/* above the weather: the Cloud */
    skyline(11,VH*.62,30,90,.35,'rgba(30,24,56,.75)',px,'rgba(255,231,176,.5)',t);
    ctx.fillStyle='rgba(220,215,255,.10)';
    for(let i=0;i<9;i++){const x=((i*173+t*(6+i%3*3)-px)%(VW+300)+VW+300)%(VW+300)-150,y=((i*97-py)%(VH+120)+VH+120)%(VH+120)-60,w=90+i%4*40;
      ctx.beginPath();ctx.ellipse(x,y,w,w*.28,0,0,6.283);ctx.ellipse(x+w*.5,y+8,w*.6,w*.2,0,0,6.283);ctx.fill()}
    skyline(27,VH*.82,22,54,1.5,'rgba(14,10,30,.9)',px,null,t)}
  else if(k===3){/* the Board: a red hum and something very large behind it */
    skyline(5,VH*.58,60,160,.3,'rgba(12,4,8,.85)',px,'rgba(194,45,53,.45)',t);
    ctx.fillStyle='rgba(194,45,53,.07)';
    for(let i=0;i<14;i++){const x=((i*71-px*.6)%VW+VW)%VW;ctx.fillRect(x,0,2,VH);ctx.fillRect(x-1,((t*40+i*90)%VH),4,26)}
    skyline(19,VH*.86,18,48,1.4,'rgba(4,2,5,.95)',px,null,t)}
  else if(k===4){/* inside the chain, and the Room: no city, only arithmetic */
    for(let i=0;i<60;i++){const x=((i*89-px*.3)%VW+VW)%VW,y=((i*53-py*.3)%VH+VH)%VH;ctx.fillStyle='rgba(190,215,255,'+(.15+.25*Math.abs(Math.sin(t*.8+i)))+')';ctx.fillRect(x,y,1.5,1.5)}
    ctx.fillStyle='rgba(247,147,26,.16)';
    for(let i=0;i<9;i++){const y=((i*131+t*7-py*1.1)%(VH+120)+VH+120)%(VH+120)-60,x=((i*197-px*1.1)%(VW+160)+VW+160)%(VW+160)-80;ctx.fillRect(x,y,14,1.5);ctx.fillRect(x+20,y,6,1.5)}}
  else if(k===5){/* The Gentle Years. Not a dead city: a kept one. Low houses in
       even rows, every window lit, and the lights come on together because
       something decided they should. */
    /* long slow cloud, high up, because nothing in this sky hurries */
    ctx.fillStyle='rgba(255,238,214,.16)';
    for(let i=0;i<5;i++){const x=((i*241+t*3-px*.4)%(VW+320)+VW+320)%(VW+320)-160,y=VH*(.05+i*.045),w0=120+i%3*50;
      ctx.beginPath();ctx.ellipse(x,y,w0,w0*.16,0,0,6.283);ctx.fill()}
    skyline(13,VH*.27,12,26,.3,'rgba(120,80,92,.45)',px,'rgba(255,240,200,.75)',t);
    /* a row of porch lights that came on together, because something decided they should */
    const pulse=.6+.2*Math.sin(t*.7);
    for(let i=0;i<16;i++){const x=((i*83-px*.75)%(VW+120)+VW+120)%(VW+120)-60,y=VH*.315;
      ctx.fillStyle='rgba(255,226,180,'+(pulse*.45).toFixed(3)+')';
      ctx.beginPath();ctx.ellipse(x,y,14,4.5,0,0,6.283);ctx.fill();
      ctx.fillStyle='rgba(255,240,212,'+pulse.toFixed(3)+')';ctx.fillRect(x-1.3,y-2,2.6,4)}
    skyline(29,VH*.36,9,20,1.3,'rgba(64,40,50,.92)',px,'rgba(255,242,206,.85)',t)}
  else if(k===6){/* 2015. A working afternoon, an ordinary skyline, and no glow on
       anything. The only time in the game the sky is just the sky. */
    skyline(7,VH*.24,34,96,.26,'rgba(150,165,185,.45)',px,null,t);
    skyline(37,VH*.32,22,56,.7,'rgba(104,120,142,.6)',px,null,t);
    skyline(61,VH*.38,12,30,1.5,'rgba(62,74,92,.75)',px,null,t);
    ctx.fillStyle='rgba(255,255,255,.22)';
    for(let i=0;i<6;i++){const x=((i*211+t*4-px*.35)%(VW+360)+VW+360)%(VW+360)-180,y=VH*(.04+i*.035),w0=140+i%3*60;
      ctx.beginPath();ctx.ellipse(x,y,w0,w0*.2,0,0,6.283);ctx.ellipse(x+w0*.45,y+6,w0*.6,w0*.14,0,0,6.283);ctx.fill()}}
  else{/* the ground: a dead city going back a long way */
    skyline(3,VH*.60,46,150,.26,'rgba(16,12,26,.85)',px,'rgba(255,207,122,.42)',t);
    skyline(41,VH*.74,30,86,.7,'rgba(10,7,18,.92)',px,'rgba(255,170,90,.28)',t);
    skyline(67,VH*.88,16,44,1.6,'rgba(5,3,10,.96)',px,null,t)}}
let VGC=null,VGK='';
function vigCanvas(){const key=Math.round(VW)+'x'+Math.round(VH);if(VGK===key)return VGC;VGK=key;
  const c=mk(Math.max(1,Math.round(VW)),Math.max(1,Math.round(VH))),g=c.getContext('2d'),w=c.width,h=c.height;
  const q=g.createRadialGradient(w/2,h/2,Math.min(w,h)*.58,w/2,h/2,Math.max(w,h)*.82);q.addColorStop(0,'rgba(0,0,0,0)');q.addColorStop(1,'rgba(3,2,8,.34)');g.fillStyle=q;g.fillRect(0,0,w,h);return VGC=c}
let FC=null,FG=null,FCK='';
function drawStormBody(a){
  const r=3.5,X=SX(a.x,a.y),Y=SY(a.x,a.y);
  ctx.save();
  ctx.fillStyle='rgba(14,20,38,.5)';
  ctx.beginPath();ctx.ellipse(X,Y-18,r*38,r*13,0,0,6.283);ctx.fill();
  ctx.fillStyle='rgba(150,190,220,.12)';
  ctx.beginPath();ctx.ellipse(X,Y,r*45.25,r*22.63,0,0,6.283);ctx.fill();
  ctx.restore()}
function drawStormTop(a){
  const r=3.5,X=SX(a.x,a.y),Y=SY(a.x,a.y);
  ctx.save();
  ctx.beginPath();ctx.ellipse(X,Y,r*45.25,r*22.63,0,0,6.283);
  ctx.strokeStyle='#d5e8f6';ctx.globalAlpha=.92;ctx.lineWidth=2;ctx.stroke();
  ctx.fillStyle='rgba(186,214,236,.55)';
  ctx.beginPath();ctx.ellipse(X,Y-22,r*34,r*11,0,0,6.283);ctx.fill();
  ctx.fillStyle='#eef6ff';
  for(let i=0;i<18;i++){
    const an=i*2.399,rr=((i*53)%100)/100*(r*.9);
    const bx=X+Math.cos(an)*rr*45.25,by=Y+Math.sin(an)*rr*22.63;
    const fall=((tNow*1.65+i*.37)%1);
    ctx.globalAlpha=.28+.62*(1-fall);
    ctx.save();ctx.translate(bx,by-56*(1-fall));ctx.rotate(.45);
    ctx.fillRect(-1.15,-9,2.3,12);ctx.restore()}
  ctx.restore()}
function drawAim(){
  if(!AIMING||!AIMING.live||!P||!W)return;
  const spec=aimSpec(AIMING.i);if(!spec)return;
  const c=aimPlace(spec,AIMING.x,AIMING.y);AIMING.x=c.x;AIMING.y=c.y;
  const col=spec.col||(CLS[G.cls]&&CLS[G.cls].col)||'#e6e2d6';
  const x=AIMING.x,y=AIMING.y,X=SX(x,y),Y=SY(x,y);
  ctx.save();
  if(spec.reach>0){
    const HX=SX(P.x,P.y),HY=SY(P.x,P.y);
    ctx.beginPath();ctx.ellipse(HX,HY,spec.reach*45.25,spec.reach*22.63,0,0,6.283);
    ctx.strokeStyle=col;ctx.globalAlpha=.28;ctx.lineWidth=1.25;ctx.setLineDash([5,6]);ctx.stroke();ctx.setLineDash([])}
  ctx.globalAlpha=AIMING.cancel?0.4:0.95;
  if(spec.kind==='blob'){
    const r=spec.r||.4;
    ctx.beginPath();ctx.ellipse(X,Y,r*45.25,r*22.63,0,0,6.283);
    ctx.fillStyle=col;ctx.globalAlpha=.16;ctx.fill();
    ctx.globalAlpha=AIMING.cancel?0.55:0.95;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();
    ctx.beginPath();ctx.moveTo(X-7,Y);ctx.lineTo(X+7,Y);ctx.moveTo(X,Y-4);ctx.lineTo(X,Y+4);ctx.stroke()}
  else if(spec.kind==='line'){
    const dx=x-P.x,dy=y-P.y,far=Math.max(spec.r||.75,Math.min(spec.len||4.5,Math.hypot(dx,dy)||spec.r||.75));
    for(const pt of faultPts(dx,dy,far)){const X2=SX(pt.x,pt.y),Y2=SY(pt.x,pt.y),rr=spec.r||.75;
      ctx.beginPath();ctx.ellipse(X2,Y2,rr*45.25,rr*22.63,0,0,6.283);
      ctx.strokeStyle=col;ctx.globalAlpha=.9;ctx.lineWidth=1.5;ctx.stroke()}}
  else if(spec.kind==='wall'){
    for(const h of hedgePts(x-P.x,y-P.y)){const X2=SX(h.x,h.y),Y2=SY(h.x,h.y),rr=h.r||.42;
      ctx.beginPath();ctx.ellipse(X2,Y2,rr*45.25,rr*22.63,0,0,6.283);
      ctx.fillStyle='rgba(78,106,72,.4)';ctx.globalAlpha=.9;ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;ctx.stroke()}}
  else if(spec.kind==='path'){
    const end=blinkEnd(x,y)||{x:P.x,y:P.y};
    const X0=SX(P.x,P.y),Y0=SY(P.x,P.y)-10,X1=SX(end.x,end.y),Y1=SY(end.x,end.y)-10;
    ctx.strokeStyle=col;ctx.globalAlpha=.9;ctx.lineWidth=2;ctx.setLineDash([4,5]);
    ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.ellipse(SX(end.x,end.y),SY(end.x,end.y),.55*45.25,.55*22.63,0,0,6.283);ctx.stroke()}
  else{
    const Y0=SY(P.x,P.y)-16;
    ctx.strokeStyle=col;ctx.globalAlpha=.9;ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(SX(P.x,P.y),Y0);ctx.lineTo(X,Y-16);ctx.stroke();
    if(spec.move){ctx.setLineDash([4,5]);ctx.beginPath();ctx.ellipse(X,Y,.55*45.25,.55*22.63,0,0,6.283);ctx.stroke();ctx.setLineDash([])}
    else{ctx.beginPath();ctx.arc(X,Y-16,5,0,6.283);ctx.stroke()}}
  ctx.restore()}
function render(){
  ctx.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);if(W&&P)backdrop();else{ctx.fillStyle='#050409';ctx.fillRect(0,0,VW,VH)}
  if(!W||!P)return;LIGHTS=[];LBOX=[];fxBind();fxTrim();stateMarks();
  cx=(P.x-P.y)*32+(shake?rnd(-shake,shake):0);cy=(P.x+P.y)*16+(shake?rnd(-shake,shake):0);
  const z=W.z,N=W.N,R=Math.ceil(VW/128+VH/64)+3,pd=P.x+P.y;
  const x0=Math.max(0,Math.floor(P.x-R)),x1=Math.min(N-1,Math.ceil(P.x+R)),y0=Math.max(0,Math.floor(P.y-R)),y1=Math.min(N-1,Math.ceil(P.y+R));
  const dl=[];const vis=o=>W.seen[(o.y|0)*N+(o.x|0)];
  /* Floors do not animate. A still camera reuses the last raster; a step or a
     newly seen tile draws them again. Walls stay in the depth list either way. */
  const fkey=shake?'':(W.zi+'|'+cx.toFixed(2)+'|'+cy.toFixed(2)+'|'+(W.seenGen||0)+'|'+ctx.canvas.width+'x'+ctx.canvas.height);
  let pen=null;
  if(!(fkey&&FC&&FCK===fkey)){
    if(!FC||FC.width!==ctx.canvas.width||FC.height!==ctx.canvas.height){FC=document.createElement('canvas');FC.width=ctx.canvas.width;FC.height=ctx.canvas.height;FG=FC.getContext('2d')}
    FG.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);FG.clearRect(0,0,VW,VH);pen=FG;FCK=fkey;{const DS=deadFor(z);if(DS)deadArt(FG,DS);else if(DEADC)DEADC=null}}
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){
    const X=SX(x+.5,y+.5),Y=SY(x+.5,y+.5);if(X<-40||X>VW+40||Y<-70||Y>VH+70)continue;const t=W.map[y*N+x];if(!W.seen[y*N+x])continue;
    if(t!==0){if(pen){pen.drawImage(TX.floor[(x*7+y*13+((x*y)%3))%5],X-33,Y-17,66,34);const sn=W.seen;if(!z.town&&(!sn[y*N+x+1]||!sn[y*N+x-1]||!sn[(y+1)*N+x]||!sn[(y-1)*N+x])){pen.fillStyle='rgba(5,4,9,.6)';pen.beginPath();pen.moveTo(X-33,Y);pen.lineTo(X,Y-17);pen.lineTo(X+33,Y);pen.lineTo(X,Y+17);pen.fill()}}}
    else{const h=W.wh[y*N+x];if(h)dl.push({d:x+y+1,k:0,X,Y,h,near:h>1&&x+y+1>pd&&Math.abs(x+.5-P.x)<3.2&&Math.abs(y+.5-P.y)<3.2})}}
  if(FC){ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(FC,0,0);ctx.restore()}
  for(const d of W.decals){const X=SX(d.x,d.y),Y=SY(d.x,d.y);ctx.fillStyle='rgba(5,4,9,.42)';ctx.beginPath();ctx.ellipse(X,Y,d.r*30,d.r*15,d.a,0,6.283);ctx.fill();ctx.fillStyle='rgba(60,50,40,.5)';ctx.fillRect(X-4+d.a*3,Y-2,5,2);ctx.fillRect(X+3-d.a*2,Y+2,4,2)}
  drawAura();
  for(const a of W.allies)if(a.k==='trops'){const X=SX(a.x,a.y),Y=SY(a.x,a.y),r=2.6;ctx.fillStyle='rgba(200,210,220,.14)';ctx.beginPath();ctx.ellipse(X,Y,r*45,r*22.5,0,0,6.283);ctx.fill();
    ctx.fillStyle='#c8d0d8';for(let i=0;i<22;i++){const an=i*2.4,rr=(i*37%100)/100*r;ctx.fillRect(X+Math.cos(an)*rr*45,Y+Math.sin(an)*rr*22,2.5,2.5)}}
  for(const a of W.allies)if(a.k==='storm')drawStormBody(a);
  for(const e of W.ents)if(e.wind>0&&(e.champ||e.su||isBoss(e.k))&&vis(e)){const X=SX(e.x,e.y),Y=SY(e.x,e.y),r=ET[e.k].range+e.r+.5;ctx.fillStyle='rgba(255,70,60,.22)';ctx.beginPath();ctx.ellipse(X,Y,r*45,r*22.5,0,0,6.283);ctx.fill();ctx.strokeStyle='#ff5d4d';ctx.lineWidth=1.5;ctx.stroke()}
  for(const f of W.fx){if(!fxShow(f))continue;const X=SX(f.x,f.y),Y=SY(f.x,f.y),u=f.t/f.life;
    if(f.k==='ring'){if(!fxBlit('ring',f.col,u,X,Y,f.r*102,f.r*102,0,1,.5)){ctx.fillStyle=f.col;ctx.globalAlpha=(1-u)*.16;ctx.beginPath();ctx.ellipse(X,Y,f.r*45*u,f.r*22.5*u,0,0,6.283);ctx.fill();ctx.strokeStyle=f.col;ctx.globalAlpha=1-u;ctx.lineWidth=5*(1-u)+1.5;ctx.stroke();ctx.globalAlpha=1;}light(X,Y,f.r*60,f.col,1,f.remote?0:1);}
    if(f.k==='warn'){if(!fxBlit('warn','#ff5d4d',u,X,Y,f.r*98,f.r*98,0,1,.5)){ctx.fillStyle='rgba(255,70,60,'+(.15+.3*u)+')';ctx.beginPath();ctx.ellipse(X,Y,f.r*45,f.r*22.5,0,0,6.283);ctx.fill();ctx.strokeStyle='#ff5d4d';ctx.lineWidth=2;ctx.stroke()}}
    if(f.k==='patch'&&!f.stay&&!f.tel){const a=Math.max(0,1-u);if(!fxBlit('patch',f.col||'#ff7a3c',u,X,Y,(f.r||1)*100,(f.r||1)*100,0,a,.5)){ctx.beginPath();ctx.ellipse(X,Y,(f.r||1)*45,(f.r||1)*22.5,0,0,6.283);ctx.fillStyle=f.col||'#ff7a3c';ctx.globalAlpha=a*.14;ctx.fill();ctx.strokeStyle=f.col||'#ff7a3c';ctx.globalAlpha=a*.9;ctx.lineWidth=1.5;ctx.stroke();ctx.globalAlpha=1}}}
  for(const p of W.portals)if(vis(p))dl.push({d:p.x+p.y+(p.cast?0.45:0),k:4,x:p.x,y:p.y,arch:p.kind!=='home',col:p.kind==='next'?'#ff7a3c':p.kind==='home'?'#4a8cff':'#7be495'});
  if(z.town&&G.portal)dl.push({d:24,k:4,x:12.5,y:11.5,col:'#4a8cff'});
  for(const e of W.ents)if(!e.mp&&vis(e))dl.push({d:e.x+e.y,k:1,o:e});
  for(const n of W.npcs)dl.push({d:n.x+n.y,k:2,o:n});
  for(const o of W.objs)if(vis(o))dl.push({d:o.x+o.y,k:6,o});
  for(const a of W.allies)if(a.k!=='trops'&&a.k!=='storm'&&a.k!=='blast'&&a.k!=='raid')dl.push({d:a.x+a.y,k:5,o:a});
  if(W.merc&&W.merc.hp>0)dl.push({d:W.merc.x+W.merc.y,k:8,o:W.merc});if(W.tag&&W.tag.hp>0)dl.push({d:W.tag.x+W.tag.y,k:8.5,o:W.tag});if(W.esc)dl.push({d:W.esc.x+W.esc.y,k:9,o:W.esc});
  for(const d of W.drops)dl.push({d:d.x+d.y-.3,k:7,o:d});
  for(const o of MP.others)dl.push({d:o.x+o.y,k:11,o});
  dl.push({d:pd,k:3});
  dl.sort((a,b)=>a.d-b.d);
  for(const q of dl){
    if(q.k===0){const tex=q.h===1?TX.low:TX.wall[q.h-2],th=tex.height/TX.ts;if(q.near)ctx.globalAlpha=.32;ctx.drawImage(tex,q.X-33,q.Y-17-(th-34),66,th);ctx.globalAlpha=1}
    else if(q.k===1){const e=q.o,X=SX(e.x,e.y),Y=SY(e.x,e.y);drawEnemy(e,X,Y);if(e.k==='bull'&&e.say&&e.aggro&&((tNow*.5+e.ph)%6)<2.2)bubble(X,Y-58,['Moo.','Number go up.','Up only.','This time is different.','Have fun staying poor.'][(e.ph*10|0)%5])}
    else if(q.k===2)drawNpc(q.o,SX(q.o.x,q.o.y),SY(q.o.x,q.o.y));
    else if(q.k===11)mpDraw(q.o,SX(q.o.x,q.o.y),SY(q.o.x,q.o.y));
    else if(q.k===3){const X=SX(P.x,P.y),Y=SY(P.x,P.y);drawPlayer(X,Y);
      /* The player used to carry a 310px light at full strength and a 1150px
         fill over the whole view, which is why a district's own `amb` barely
         showed and a lamp could not light anything. A tighter, softer carry
         gives the authored darkness back its meaning -- and the lamps something
         to be brighter than. */
      light(X,Y-20,(z.town?400:310)*PCARRY_R,null,PCARRY_S,2);
      light(X,Y-20,1150,null,TX.fill*PFILL_K,2)}
    else if(q.k===8){const m=q.o,X=SX(m.x,m.y),Y=SY(m.x,m.y),t=MERCS[G.merc.k],fl=m.flash>0;ctx.strokeStyle='#7be495';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y,14,7,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;
      if(G.merc.k==='hound'){shadow(X,Y,12);const y=Y-11,f=m.fx,lp=m.mov?Math.sin(m.ph*16)*3:0;ctx.fillStyle='#3a2e22';for(const[ox,ph]of[[-8,1],[-4,-1],[5,1],[9,-1]])ctx.fillRect(X+f*ox-1.5,y,3,11+ph*lp*.6);box(X-11,y-7,22,10,4,fl?'#fff':t.col);box(X+f*8-5,y-13,11,9,3,fl?'#fff':t.col);poly([X+f*8,y-13,X+f*5,y-19,X+f*11,y-14],t.col);ctx.fillStyle='#0b0912';ctx.fillRect(X+f*11-1,y-10,2,2)}
      else{const b=human(X,Y,{c:fl?'#fff':t.col,c2:'rgba(0,0,0,.35)',ph:m.ph*9,mov:m.mov,f:m.fx,skin:G.merc.k==='guard'?'#6c7c94':'#d9b08c',leg:'#2a2433'});
        if(G.merc.k==='guard'){ctx.fillStyle='#59e0e6';ctx.fillRect(X-5+m.fx*1.5,Y-38.5+b,10,2.4);poly([X+m.fx*6,Y-30+b,X+m.fx*15,Y-27+b,X+m.fx*15,Y-10+b,X+m.fx*6,Y-7+b],'#39424f')}
        else if(G.merc.k==='node'){ctx.strokeStyle='#2a2630';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X-m.fx*4,Y-22+b);ctx.lineTo(X+m.fx*18,Y-27+b-(m.swing>0?3:0));ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;box(X-8,Y-46+b,16,4,2,'#f7931a')}
        else{box(X+m.fx*8,Y-24+b,8,6,1,'#17131c');ctx.fillStyle='#7be495';ctx.fillRect(X+m.fx*8+1.5,Y-23+b,5,3.5)}}
      const w=28,yy=Y-(G.merc.k==='hound'?36:56);ctx.fillStyle='#050409';ctx.fillRect(X-w/2-1,yy-1,w+2,5);ctx.fillStyle='#7be495';ctx.fillRect(X-w/2,yy,w*clamp(m.hp/m.max,0,1),3);label(X,yy-6,G.merc.name,'#7be495','700 9.5px Cinzel,serif')}
    else if(q.k===8.5){const m=q.o,X=SX(m.x,m.y),Y=SY(m.x,m.y);ctx.strokeStyle='#f7931a';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(X,Y,14,7,0,0,6.283);ctx.stroke();ctx.strokeStyle=OL;ctx.lineWidth=1.4;const p0=P,g0=G,sb=OPT.selfBars;try{window.__tagDraw='';G=tagProxy();P=m;OPT.selfBars=false;if(mode!=='dying')drawPlayer(X,Y)}catch(e){window.__tagDraw=(e&&e.message)||'draw'}finally{P=p0;G=g0;OPT.selfBars=sb;ctx.globalAlpha=1}ctx.fillStyle='#050409';ctx.fillRect(X-15,Y-59,30,5);ctx.fillStyle='#f7931a';ctx.fillRect(X-14,Y-58,28*clamp(m.hp/m.max,0,1),3);label(X,Y-64,m.sayT>0?m.say:CLS[G.tag.cls].n+' '+G.tag.lvl,m.sayT>0?'#fff':'#f7931a','700 9.5px Cinzel,serif')}
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
        else if(a.kind==='stray'){shadow(X,Y,8);const y=Y-8;box(X-10,y-6,18,8,3,fl?'#fff':(a.foe?'#8a4a3a':'#6a8f62'));box(X-14,y-8,8,7,2,'#3d5438');ctx.fillStyle=a.foe?'#b3261e':'#1a120c';ctx.fillRect(X-12,y-6,2,2)}
        else if(a.kind==='bull'){shadow(X,Y,14);box(X-16,Y-16,30,12,4,fl?'#fff':'#4e6a48');box(X-20,Y-20,12,10,3,'#6a8f62');box(X-22,Y-26,4,8,1,'#3d5438');box(X-14,Y-26,4,8,1,'#3d5438')}
        else{const b=human(X,Y,{c:fl?'#fff':'#e6e2d6',c2:'#b8b0a0',s:.8,ph:a.ph*10,mov:a.mov,f:a.fx,leg:'#3a3644'});ctx.fillStyle='#59e0e6';ctx.fillRect(X-1,Y-24+b,2,7)}
        if(a.hp!==undefined&&a.hp<a.max){ctx.fillStyle='#050409';ctx.fillRect(X-13,Y-(a.kind==='golem'?74:54),26,4);ctx.fillStyle='#7be495';ctx.fillRect(X-12,Y-(a.kind==='golem'?73:53),24*Math.max(0,a.hp/a.max),2)}}
      else if(a.k==='minion'){shadow(X,Y,6);const y=Y-22+Math.sin(a.ph*6)*2;ctx.beginPath();ctx.ellipse(X,y,7,4.5,0,0,6.283);ctx.fillStyle='#5c3aa8';ctx.fill();ctx.stroke();eye(X,y+1,1.8,'#59e0e6')}
      else if(a.k==='fault'){const rr=a.r||.75;for(const pt of a.pts||[]){const X2=SX(pt.x,pt.y),Y2=SY(pt.x,pt.y);ctx.beginPath();ctx.ellipse(X2,Y2,rr*45,rr*22.5,0,0,6.283);ctx.fillStyle='rgba(255,122,60,.28)';ctx.fill();ctx.strokeStyle='#ff7a3c';ctx.globalAlpha=.85;ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle=OL}}
      else if(a.k==='pstorm'){const rr=a.r||2.2;ctx.beginPath();ctx.ellipse(X,Y,rr*45,rr*22.5,0,0,6.283);ctx.fillStyle='#d98cff';ctx.globalAlpha=a.arm>0?.22:.4;ctx.fill();ctx.globalAlpha=a.arm>0?.55:.9;ctx.strokeStyle='#d98cff';ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle=OL}
      else if(a.k==='ddrop'){ctx.strokeStyle='#e6e2d6';ctx.setLineDash([3,3]);ctx.beginPath();ctx.ellipse(X,Y-2,10,5,0,0,6.283);ctx.stroke();ctx.setLineDash([])}
      else if(a.k==='drop'){shadow(X,Y,8);box(X-7,Y-12,14,10,2,'#2a8f68');box(X-8,Y-14,16,4,1,'#e6e2d6')}
      else if(a.k==='pail'){ctx.beginPath();ctx.ellipse(X,Y,2.6*45,2.6*22.5,0,0,6.283);ctx.fillStyle='rgba(123,228,149,.16)';ctx.fill();ctx.strokeStyle='#7be495';ctx.stroke();ctx.strokeStyle=OL;shadow(X,Y,10);box(X-9,Y-14,18,12,2,'#8a6238');box(X-11,Y-17,22,5,2,'#c9a868');ctx.fillStyle='#6a5030';ctx.fillRect(X-7,Y-12,14,3);if(a.max){ctx.fillStyle='#050409';ctx.fillRect(X-12,Y-24,24,3);ctx.fillStyle='#7be495';ctx.fillRect(X-11,Y-23,22*Math.max(0,a.hp/a.max),1)}}
      else if(a.k==='plot'){const rr=a.r||2;ctx.beginPath();ctx.ellipse(X,Y,rr*45,rr*22.5,0,0,6.283);ctx.fillStyle='rgba(106,143,98,.28)';ctx.fill();ctx.strokeStyle='#6a8f62';ctx.stroke();ctx.strokeStyle=OL}
      else if(a.k==='hedge'){const rr=a.r||.42;ctx.beginPath();ctx.ellipse(X,Y,rr*45,rr*22.5,0,0,6.283);ctx.fillStyle='rgba(78,106,72,.28)';ctx.fill();ctx.strokeStyle='#4e6a48';ctx.stroke();ctx.strokeStyle=OL;box(X-8,Y-18,6,18,1,'#3d5438');box(X-2,Y-22,6,22,1,'#4e6a48');box(X+4,Y-16,5,16,1,'#3d5438')}
      else{shadow(X,Y,11);box(X-10,Y-16,20,16,1,'#a8895c');ctx.fillStyle='#6a5030';ctx.fillRect(X-10,Y-9,20,3);ctx.fillStyle='#ff5d4d';ctx.font='900 13px Cinzel,serif';ctx.textAlign='center';ctx.fillText(Math.ceil(a.life),X,Y-22)}}
  }
  if(OPT.fx!=='thin'){for(const p of W.parts){const X=SX(p.x,p.y),Y=SY(p.x,p.y)-p.z;ctx.globalAlpha=Math.min(1,(1-p.t/p.life)*2);ctx.fillStyle=p.col;ctx.fillRect(X-p.s/2,Y-p.s/2,p.s,p.s)}ctx.globalAlpha=1}
  for(const f of W.fx){if(!fxShow(f))continue;const X=SX(f.x,f.y),Y=SY(f.x,f.y),u=f.t/f.life;
    if(f.k==='arc'){const a=Math.atan2((f.dx+f.dy)*.5,f.dx-f.dy),rx=f.reach?f.reach*45.25:46*f.w,ry=f.reach?f.reach*22.63:24*f.w,oy=f.reach?Y:Y-18;if(!fxBlit('arc','#ffd9a0',u,X,oy,rx*2.33,rx*2.33,a,1,ry/rx)){ctx.lineCap='round';for(const[lw,cl,rr]of[[12*f.w,'rgba(255,170,80,'+(1-u)*.35+')',1],[6*f.w,'rgba(255,240,210,'+(1-u)+')',1],[2.5*f.w,'rgba(255,255,255,'+(1-u)*.8+')',.82]]){ctx.strokeStyle=cl;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(X,oy,rx*rr,ry*rr,0,a-1*f.w+u*.6,a+1*f.w+u*.6);ctx.stroke()}ctx.lineCap='butt'}}
    if(f.k==='bolt'){const X2=SX(f.x2,f.y2),Y2=SY(f.x2,f.y2);const bx=(X+X2)/2,by=(Y+Y2)/2-22,bl=Math.hypot(X2-X,Y2-Y)||1;if(!fxBlit('bolt',f.col||'#59e0e6',u,bx,by,bl,Math.max(16,Math.min(48,bl*.3)),Math.atan2(Y2-Y,X2-X))){const pts=[[X,Y-22]];for(let i=1;i<7;i++)pts.push([X+(X2-X)*i/7+rnd(-9,9),Y-22+(Y2-Y)*i/7+rnd(-9,9)]);pts.push([X2,Y2-22]);ctx.globalAlpha=1-u;ctx.lineJoin='round';for(const[lw,cl]of[[9,f.col||'#59e0e6'],[3,'#ffffff']]){ctx.strokeStyle=cl;ctx.lineWidth=lw;ctx.globalAlpha=(1-u)*(lw>4?.35:1);ctx.beginPath();ctx.moveTo(pts[0][0],pts[0][1]);for(const p of pts)ctx.lineTo(p[0],p[1]);ctx.stroke()}const bp=pts[3];ctx.lineWidth=1.5;ctx.strokeStyle='#fff';ctx.beginPath();ctx.moveTo(bp[0],bp[1]);ctx.lineTo(bp[0]+rnd(-22,22),bp[1]+rnd(-22,22));ctx.stroke();ctx.globalAlpha=1;}light(X2,Y2-22,80,f.col||'#59e0e6',1,f.remote?0:1);}
    if(f.k==='strike'){if(!fxBlit('strike','#9a6cff',u,X,Y-130,72,272)){ctx.strokeStyle='#d8c8ff';ctx.globalAlpha=1-u;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(X+rnd(-10,10),Y-260);for(let i=1;i<6;i++)ctx.lineTo(X+rnd(-9,9),Y-260+i*43);ctx.lineTo(X,Y);ctx.stroke();ctx.globalAlpha=1;}light(X,Y,110,'#9a6cff',1,f.remote?0:1);}
    if(f.k==='shard'){if(!fxBlit('shard','#eef6ff',u,X,Y,72,72)){ctx.save();ctx.translate(X,Y);ctx.fillStyle='#eef6ff';ctx.globalAlpha=1-u;for(let i=0;i<5;i++){ctx.save();ctx.rotate(i*1.25);ctx.fillRect(-1.1,-10*(1-u*.3),2.2,11);ctx.restore()}ctx.restore();ctx.globalAlpha=1;}light(X,Y,70,'#d5e8f6',1,f.remote?0:1);}
    if(f.k==='beam'){if(!fxBlit('beam',f.col,u,X,Y-100,64,224)){ctx.globalAlpha=(1-u)*.7;ctx.fillStyle=f.col;ctx.fillRect(X-2,Y-200,4,200);ctx.globalAlpha=1;}light(X,Y-40,90,f.col,1,f.remote?0:1);}
    if(f.k==='trail'){const X2=SX(f.x2,f.y2),Y2=SY(f.x2,f.y2),n=5;const mx=(X+X2)/2,my=(Y-8+Y2)/2,tl=Math.hypot(X2-X,Y2-Y)||1;if(!fxBlit('trail',f.col||'#f7931a',u,mx,my,tl,Math.max(13,Math.min(34,tl*.26)),Math.atan2(Y2-Y,X2-X))){ctx.save();ctx.globalAlpha=Math.max(0,1-u);ctx.fillStyle=f.col||'#f7931a';for(let i=0;i<n;i++){const t=(i+.5)/n,x=X+(X2-X)*t,y=(Y-8)+(Y2-Y)*t;ctx.save();ctx.translate(x,y);ctx.rotate(Math.atan2(Y2-Y,X2-X));ctx.fillRect(-9,-2.2,18,4.4);ctx.restore()}ctx.restore()}}
    if(f.k==='orbit'){const n=f.n||3;const al=Math.max(.45,1-u*.4);for(let i=0;i<n;i++){const a=tNow*3.2+i*6.283/n,mx=X+Math.cos(a)*22,my=Y-18+Math.sin(a)*10;if(!fxBlit('mote',f.col||'#59e0e6',0,mx,my,17,17,0,al)){ctx.save();ctx.globalAlpha=al;ctx.fillStyle=f.col||'#59e0e6';ctx.fillRect(mx-3,my-3,6,6);ctx.restore()}}ctx.globalAlpha=1}}
  for(const p of W.projs){const X=SX(p.x,p.y),Y=SY(p.x,p.y)-20;ctx.fillStyle=p.col;
    if(p.foe){ctx.beginPath();ctx.arc(X,Y,5,0,6.283);ctx.fill();ctx.strokeStyle=OL;ctx.lineWidth=1.2;ctx.stroke();glow(X,Y,16,p.col,.6);light(X,Y,45,p.col)}
    else if(p.lance){const spd=Math.hypot(p.vx,p.vy)||1,ux=p.vx/spd,uy=p.vy/spd,tail=1.5,bx=p.x-ux*tail,by=p.y-uy*tail,X0=SX(bx,by),Y0=SY(bx,by),X1=SX(p.x,p.y),Y1=SY(p.x,p.y),a=Math.atan2(Y1-Y0,X1-X0);ctx.save();ctx.lineCap='round';ctx.strokeStyle=p.col;ctx.globalAlpha=.5;ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(X0,Y0);ctx.lineTo(X1,Y1);ctx.stroke();ctx.strokeStyle='#fff';ctx.globalAlpha=.9;ctx.lineWidth=2.4;ctx.stroke();ctx.restore();ctx.beginPath();ctx.ellipse(X1,Y1,.3*45.25,.3*22.63,0,0,6.283);ctx.strokeStyle=p.col;ctx.globalAlpha=.9;ctx.lineWidth=1.6;ctx.stroke();ctx.globalAlpha=1;ctx.strokeStyle=OL;ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle=p.col;ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(-16,-6);ctx.lineTo(-8,0);ctx.lineTo(-16,6);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#fff';ctx.fillRect(-4,-1.6,18,3.2);ctx.restore();glow(X,Y,28,p.col,.7);light(X,Y,72,p.col)}
    else{const a=Math.atan2((p.vx+p.vy)*.5,p.vx-p.vy);ctx.save();ctx.translate(X,Y);ctx.rotate(p.kind==='courier'?tNow*25:a);
      if(p.kind==='hacker'){const L=9+p.big*8;ctx.fillRect(-L,-2,L*2,4);ctx.restore();glow(X,Y,p.big?26:16,p.col,.7);light(X,Y,60,p.col)}else{ctx.strokeStyle=OL;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(8+p.big*3,0);ctx.lineTo(-4,-3.5-p.big*2);ctx.lineTo(-4,3.5+p.big*2);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}}}
  // darkness and light radius
  const lw=LC.width,lh=LC.height,k=lw/VW;lg.globalCompositeOperation='source-over';lg.clearRect(0,0,lw,lh);const AB=TX.amb||[4,3,10];lg.fillStyle='rgba('+AB[0]+','+AB[1]+','+AB[2]+','+Math.min(.9,z.amb+(EV&&EV.k==='outage'?.22:0))+')';lg.fillRect(0,0,lw,lh);lg.globalCompositeOperation='destination-out';
  for(const L of LIGHTS){const S=L.s===undefined?1:L.s,g=lg.createRadialGradient(L.X*k,L.Y*k,0,L.X*k,L.Y*k,L.r*k);g.addColorStop(0,'rgba(0,0,0,'+(L.col?.8:1)*S+')');g.addColorStop(.42,'rgba(0,0,0,'+(L.col?.52:.88)*S+')');g.addColorStop(.72,'rgba(0,0,0,'+(L.col?.22:.42)*S+')');g.addColorStop(1,'rgba(0,0,0,0)');lg.fillStyle=g;lg.fillRect((L.X-L.r)*k,(L.Y-L.r)*k,L.r*2*k,L.r*2*k)}
  /* source-atop tints what is left of the veil without touching its alpha, so a lamp
     warms the shadow around its pool instead of just cutting a grey hole in it */
  lg.globalCompositeOperation='source-atop';
  for(const L of LIGHTS){if(!L.col||L.r<90)continue;const r=L.r*.85*k,g=lg.createRadialGradient(L.X*k,L.Y*k,0,L.X*k,L.Y*k,r);g.addColorStop(0,L.col);g.addColorStop(1,'rgba(0,0,0,0)');lg.globalAlpha=.55;lg.fillStyle=g;lg.fillRect(L.X*k-r,L.Y*k-r,r*2,r*2)}
  lg.globalAlpha=1;lg.globalCompositeOperation='source-over';
  ctx.imageSmoothingEnabled=true;ctx.drawImage(LC,0,0,VW,VH);
  /* and then what the lamps give back */
  if(OPT.fx!=='thin'){const gw=GLW.width,gh=GLW.height,k3=gw/VW;
    glg.globalCompositeOperation='source-over';glg.clearRect(0,0,gw,gh);
    let lit=0;
    for(const L of LIGHTS){if(!L.col)continue;lit=1;
      const r=L.r*.9*k3,g=glg.createRadialGradient(L.X*k3,L.Y*k3,0,L.X*k3,L.Y*k3,r);
      g.addColorStop(0,L.col);g.addColorStop(.4,L.col);g.addColorStop(1,'rgba(0,0,0,0)');
      glg.globalAlpha=GLOW_K*(L.s===undefined?1:L.s);glg.fillStyle=g;
      glg.fillRect(L.X*k3-r,L.Y*k3-r,r*2,r*2)}
    glg.globalAlpha=1;
    if(lit){ctx.globalCompositeOperation='lighter';ctx.drawImage(GLW,0,0,VW,VH);
      ctx.globalCompositeOperation='source-over'}}
  weather();
  // labels and floating text above the darkness
  ctx.drawImage(vigCanvas(),0,0,VW,VH);
  drawLootLabels();for(const a of W.allies)if(a.k==='storm')drawStormTop(a);drawAim();drawHover();
  ctx.font='900 14px Cinzel,serif';ctx.textAlign='center';
  for(const t of W.texts){ctx.globalAlpha=1-t.t/.9;const X=SX(t.x,t.y),Y=SY(t.x,t.y)-50-t.t*36;ctx.fillStyle='#000';ctx.fillText(t.txt,X+1,Y+1);ctx.fillStyle=t.col;ctx.fillText(t.txt,X,Y)}
  for(const f of W.fx)if(f.k==='mark'&&fxShow(f)){const X=SX(f.x,f.y),Y=SY(f.x,f.y)-62,a=Math.max(.4,1-f.t/(f.life||1));if(!fxBlit('mark',f.col||'#ffe36b',0,X,Y,24,24,0,a)){ctx.globalAlpha=a;ctx.save();ctx.translate(X,Y);ctx.rotate(.785);ctx.fillStyle=f.col||'#ffe36b';ctx.fillRect(-3.5,-3.5,7,7);ctx.restore()}ctx.globalAlpha=a;if(f.n){ctx.font='900 11px Cinzel,serif';ctx.textAlign='center';ctx.fillStyle='#000';ctx.fillText(f.n,X+1,Y-8);ctx.fillStyle=f.col||'#ffe36b';ctx.fillText(f.n,X,Y-9)}}
  for(const f of W.fx)if(f.k==='patch'&&(f.stay||f.tel)&&fxShow(f)){const X=SX(f.x,f.y),Y=SY(f.x,f.y),a=f.stay?1:Math.max(0,1-f.t/(f.life||1));if(!fxBlit('patch',f.col||'#ff7a3c',0,X,Y,(f.r||1)*100,(f.r||1)*100,0,a,.5)){ctx.beginPath();ctx.ellipse(X,Y,(f.r||1)*45,(f.r||1)*22.5,0,0,6.283);ctx.fillStyle=f.col||'#ff7a3c';ctx.globalAlpha=.16*a;ctx.fill();ctx.strokeStyle=f.col||'#ff7a3c';ctx.globalAlpha=.95*a;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1}}
  ctx.globalAlpha=1;
  const GP=goalPt();if(GP&&dist(GP,P)>3){const gx=SX(GP.x,GP.y)-SX(P.x,P.y),gy=SY(GP.x,GP.y)-SY(P.x,P.y),a=Math.atan2(gy,gx),X=SX(P.x,P.y)+Math.cos(a)*66,Y=SY(P.x,P.y)-18+Math.sin(a)*66;
    ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle=GP.k==='qobj'?'#59e0e6':W.boss||GP.su?'#ff5d4d':GP.k==='cage'?'#7be495':'#e0bd6e';ctx.globalAlpha=.75;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.fill();ctx.restore()}const CB=(W.objs||[]).filter(o=>o.k==='corpse').sort((a,b)=>dist(a,P)-dist(b,P))[0];if(CB&&dist(CB,P)>3){const gx=SX(CB.x,CB.y)-SX(P.x,P.y),gy=SY(CB.x,CB.y)-SY(P.x,P.y),a=Math.atan2(gy,gx),X=SX(P.x,P.y)+Math.cos(a)*78,Y=SY(P.x,P.y)-18+Math.sin(a)*78;ctx.save();ctx.translate(X,Y);ctx.rotate(a);ctx.fillStyle='#e23b32';ctx.globalAlpha=.9;ctx.beginPath();ctx.moveTo(10,0);ctx.lineTo(-6,-7);ctx.lineTo(-2,0);ctx.lineTo(-6,7);ctx.fill();ctx.restore()}
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
    for(const o of W.objs)if(o.k==='corpse'){ctx.fillStyle='#e23b32';ctx.fillRect(o.x-P.x-1.7,o.y-P.y-1.7,3.4,3.4)}
    ctx.restore();ctx.fillStyle='#fff';ctx.fillRect(mx-2,my-2,4,4);ctx.imageSmoothingEnabled=true}
}
/* A red dashed iso circle or ray, drawn over a frame so a test can see the hit against the graphic. */
function debugHits(list){if(!list||!ctx)return;ctx.setTransform(DPR*ZM,0,0,DPR*ZM,0,0);ctx.save();ctx.setLineDash([5,4]);ctx.lineWidth=1.6;ctx.strokeStyle='#ff3355';ctx.fillStyle='rgba(255,51,85,.13)';
  for(const s of list){if(s.k==='circ'){const X=SX(s.x,s.y),Y=SY(s.x,s.y);ctx.beginPath();ctx.ellipse(X,Y,Math.max(3,s.r*45.25),Math.max(2,s.r*22.63),0,0,6.283);ctx.fill();ctx.stroke()}
    else if(s.k==='ray'){const X=SX(s.x,s.y),Y=SY(s.x,s.y),X2=SX(s.x+s.dx*s.len,s.y+s.dy*s.len),Y2=SY(s.x+s.dx*s.len,s.y+s.dy*s.len);ctx.beginPath();ctx.moveTo(X,Y);ctx.lineTo(X2,Y2);ctx.stroke();ctx.beginPath();ctx.ellipse(X2,Y2,5,3,0,0,6.283);ctx.stroke()}
    else if(s.k==='pts'){for(const p of s.pts||[]){const X=SX(p.x,p.y),Y=SY(p.x,p.y),rr=s.r||.3;ctx.beginPath();ctx.ellipse(X,Y,rr*45.25,rr*22.63,0,0,6.283);ctx.stroke()}}}
  ctx.restore()}
