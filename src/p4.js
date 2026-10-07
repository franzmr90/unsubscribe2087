/* ================= cutscenes ================= */
const hsh=i=>{const v=Math.sin(i*127.1+3.7)*43758.5453;return v-Math.floor(v)};
const ART={
 skyline(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#1a0806');s.addColorStop(.6,'#5a1c10');s.addColorStop(1,'#0b0910');g.fillStyle=s;g.fillRect(0,0,w,h);
  const cx=w/2,cy=h*.42,r=Math.min(w,h)*.26;const rg=g.createRadialGradient(cx,cy,r*.2,cx,cy,r*2.2);rg.addColorStop(0,'rgba(255,200,110,.9)');rg.addColorStop(1,'rgba(255,120,40,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.strokeStyle='#ffd27a';g.lineWidth=r*.12;g.beginPath();g.arc(cx,cy,r,0,6.283);g.stroke();g.beginPath();g.arc(cx,cy+r*.1,r*.55,.35,2.79);g.stroke();g.fillStyle='#ffd27a';g.fillRect(cx-r*.38,cy-r*.4,r*.16,r*.26);g.fillRect(cx+r*.22,cy-r*.4,r*.16,r*.26);
  for(let L=0;L<2;L++){g.fillStyle=L?'#07050b':'#1c0d10';let x=-20;for(let i=0;x<w+20;i++){const bw=24+hsh(i+L*50)*40,bh=h*(.18+hsh(i*3+L*9)*(.3+L*.12));g.fillRect(x,h-bh,bw,bh);if(L)for(let k=0;k<6;k++)if(hsh(i*7+k)>.5){g.fillStyle=Math.sin(t*2+i+k)>-.6?'#ffcf7a':'#3a2a1a';g.fillRect(x+4+hsh(i+k)*(bw-10),h-bh+8+k*14,3,5);g.fillStyle='#07050b'}x+=bw+3}}},
 ticker(g,w,h,t){g.fillStyle='#0b0910';g.fillRect(0,0,w,h);for(let i=0;i<26;i++){const x=hsh(i)*w,y=((hsh(i+40)+t*(.05+hsh(i+9)*.08))%1)*h;g.save();g.translate(x,y);g.rotate(Math.sin(t+i)*.5);g.fillStyle='rgba(230,226,214,'+(.15+hsh(i+3)*.3)+')';g.fillRect(-7,-12,14,24);g.restore()}
  const cx=w/2,cy=h*.5;g.fillStyle='#8a5a2a';g.beginPath();g.ellipse(cx,cy-h*.12,w*.2,h*.09,0,3.14,0);g.lineTo(cx+w*.2,cy-h*.07);g.lineTo(cx-w*.2,cy-h*.07);g.fill();g.strokeStyle='#5a3a18';g.lineWidth=3;for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(cx+i*w*.08-8,cy-h*.18);g.lineTo(cx+i*w*.08+8,cy-h*.13);g.stroke()}
  const v=Math.pow(10,3+Math.min(9,t*.9));g.font='900 '+Math.min(54,w*.12)+'px Cinzel,serif';g.textAlign='center';g.fillStyle='#ffe36b';g.shadowColor='#ff5a1a';g.shadowBlur=24;g.fillText(fmt(v),cx,cy+h*.12);g.shadowBlur=0;g.font='700 13px Cinzel,serif';g.fillStyle='#948b7a';g.fillText('ONE LOAF',cx,cy+h*.2)},
 feed(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#123a44');s.addColorStop(.5,'#0b1620');s.addColorStop(1,'#050409');g.fillStyle=s;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(89,224,230,'+(.25+.1*Math.sin(t*9))+')';g.fillRect(w*.1,h*.06,w*.8,h*.2);
  for(let r=0;r<4;r++){const y=h*(.5+r*.15),sc=.6+r*.25,n=Math.ceil(w/(46*sc))+1;for(let i=0;i<n;i++){const x=i*46*sc+(r%2)*20*sc-10;g.fillStyle='#050409';g.beginPath();g.arc(x,y,15*sc,0,6.283);g.fill();g.fillRect(x-20*sc,y+12*sc,40*sc,h);g.fillStyle='rgba(89,224,230,'+(.6+.3*Math.sin(t*3+i+r))+')';g.fillRect(x-13*sc,y-5*sc,26*sc,5*sc)}}},
 wanderer(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#0d0b1a');s.addColorStop(.55,'#3a2030');s.addColorStop(.56,'#17121a');s.addColorStop(1,'#050409');g.fillStyle=s;g.fillRect(0,0,w,h);
  for(let i=0;i<40;i++){g.fillStyle='rgba(255,255,255,'+(.2+.5*hsh(i))+')';g.fillRect(hsh(i+5)*w,hsh(i+60)*h*.5,1.5,1.5)}
  const hy=h*.555;g.fillStyle='#07050b';for(let i=0;i<14;i++){const x=w*.3+i*w*.03,bh=10+hsh(i)*46;g.fillRect(x,hy-bh,w*.025,bh)}g.fillStyle='#ffcf7a';g.fillRect(w*.5-2,hy-60,4,4);
  g.fillStyle='#231c26';g.beginPath();g.moveTo(w*.48,hy);g.lineTo(w*.52,hy);g.lineTo(w*.95,h);g.lineTo(w*.05,h);g.fill();
  const px=w*.5+Math.sin(t*.4)*4,py=h*.8,b=Math.abs(Math.sin(t*3))*3;g.fillStyle='#050409';g.beginPath();g.arc(px,py-52+b,9,0,6.283);g.fill();g.fillRect(px-10,py-44+b,20,30);g.fillRect(px-9,py-16,7,18-b);g.fillRect(px+2,py-16,7,18+b-3);
  g.fillStyle='rgba(89,224,230,.8)';g.fillRect(w*.3,h*.9,22,5);g.fillStyle='rgba(89,224,230,.15)';g.beginPath();g.ellipse(w*.3+11,h*.9+3,30,10,0,0,6.283);g.fill()},
 title(g,w,h,t){const tt=(typeof SC!=='undefined'&&SC&&SC.slides[SC.i]&&SC.slides[SC.i].title)||'',bg=/III/.test(tt)?'board':/II/.test(tt)?'cloud':/END$/.test(tt)?'dawn':/THE END/.test(tt)?'dawn':'skyline';
  if(ART[bg])ART[bg](g,w,h,t);else{g.fillStyle='#050409';g.fillRect(0,0,w,h)}g.fillStyle='rgba(5,4,9,.66)';g.fillRect(0,0,w,h);
  const cx=w/2,cy=h*.4,r=Math.min(w,h)*.2,gap=r*.1+Math.min(r*.22,t*r*.05),rg=g.createRadialGradient(cx,cy,0,cx,cy,r*2.6);rg.addColorStop(0,'rgba(224,189,110,.35)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  /* a Resident's visor, snapped in two */
  for(const sd of[-1,1]){g.save();g.translate(cx+sd*gap,cy);g.rotate(sd*.09);g.beginPath();if(sd<0){g.moveTo(-r*1.25,-r*.38);g.lineTo(-r*.06,-r*.38);g.lineTo(r*.08,-r*.1);g.lineTo(-r*.1,r*.12);g.lineTo(r*.04,r*.38);g.lineTo(-r*1.25,r*.38);g.quadraticCurveTo(-r*1.5,0,-r*1.25,-r*.38)}
    else{g.moveTo(r*1.25,-r*.38);g.lineTo(r*.06,-r*.38);g.lineTo(r*.2,-r*.1);g.lineTo(r*.02,r*.12);g.lineTo(r*.16,r*.38);g.lineTo(r*1.25,r*.38);g.quadraticCurveTo(r*1.5,0,r*1.25,-r*.38)}
    g.closePath();g.fillStyle='#0b0912';g.fill();g.strokeStyle='#c8a55a';g.lineWidth=Math.max(2,r*.06);g.lineJoin='round';g.stroke();
    g.fillStyle=sd<0?'rgba(89,224,230,'+(.25+.2*Math.sin(t*9))+')':'#1a2a30';g.fillRect(sd<0?-r*1.1:r*.3,-r*.07,r*.82,r*.14);g.restore()}
  g.strokeStyle='rgba(224,189,110,.5)';g.lineWidth=1.5;for(let i=0;i<10;i++){const a=i*.628+t*.05;g.beginPath();g.moveTo(cx+Math.cos(a)*r*1.75,cy+Math.sin(a)*r*1.75);g.lineTo(cx+Math.cos(a)*r*2.1,cy+Math.sin(a)*r*2.1);g.stroke()}},
 harrow(g,w,h,t){g.fillStyle='#0b0910';g.fillRect(0,0,w,h);const cx=w/2,by=h*.95,u=Math.min(w,h)/260,tilt=Math.min(.5,t*.08);const rg=g.createRadialGradient(cx,h*.3,0,cx,h*.3,h*.7);rg.addColorStop(0,'rgba(224,189,110,.25)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.save();g.translate(cx,by-90*u);g.rotate(tilt);g.fillStyle='#17131c';g.fillRect(-60*u,-80*u,120*u,110*u);g.fillRect(-90*u,-88*u,36*u,44*u);g.fillRect(54*u,-88*u,36*u,44*u);g.fillStyle='#e6e2d6';g.fillRect(-18*u,-80*u,36*u,50*u);g.fillStyle='#b3261e';g.beginPath();g.moveTo(-8*u,-80*u);g.lineTo(8*u,-80*u);g.lineTo(11*u,-30*u);g.lineTo(0,-16*u);g.lineTo(-11*u,-30*u);g.fill();
  g.fillStyle='#050409';g.fillRect(-36*u,-140*u,72*u,56*u);g.fillStyle=Math.sin(t*10)>-.4?'#ff3b30':'#3a0c0a';g.font='900 '+8*u+'px Cinzel,serif';g.textAlign='center';g.fillText('OUT OF OFFICE',0,-108*u);g.restore();g.fillStyle='#17131c';g.fillRect(cx-70*u,by-62*u,50*u,70*u);g.fillRect(cx+20*u,by-62*u,50*u,70*u)},
 lift(g,w,h,t){g.fillStyle='#07050b';g.fillRect(0,0,w,h);const cx=w/2,dw=Math.min(w*.5,220),dh=h*.7,y=h*.18;const op=Math.min(1,t*.25);g.fillStyle='#ffe7b0';g.fillRect(cx-dw/2,y,dw,dh);const rg=g.createRadialGradient(cx,y+dh/2,0,cx,y+dh/2,h*.8);rg.addColorStop(0,'rgba(255,231,176,'+.5*op+')');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='#3a3250';g.fillRect(cx-dw/2,y,dw/2*(1-op),dh);g.fillRect(cx+dw/2*op,y,dw/2*(1-op),dh);g.strokeStyle='#c8a55a';g.lineWidth=5;g.strokeRect(cx-dw/2,y,dw,dh);
  g.fillStyle='#17131c';g.fillRect(cx+dw/2+16,y+dh*.45,26,44);g.fillStyle=Math.sin(t*4)>0?'#ffe36b':'#8a7430';g.beginPath();g.arc(cx+dw/2+29,y+dh*.45+16,7,0,6.283);g.fill();g.font='700 9px Cinzel,serif';g.textAlign='center';g.fillStyle='#c8a55a';g.fillText('UP',cx+dw/2+29,y+dh*.45+38)},
 dawn(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#2a2a4a');s.addColorStop(.6,'#d8743a');s.addColorStop(1,'#1a0d10');g.fillStyle=s;g.fillRect(0,0,w,h);const up=Math.min(1,t*.2);
  for(let i=0;i<6;i++){const x=w*(.1+i*.16),y=h*.72+hsh(i)*20,sc=1.1;g.fillStyle='#07050b';g.beginPath();g.arc(x,y,15*sc,0,6.283);g.fill();g.fillRect(x-20,y+12,40,h);const lifted=i%2===0;g.fillStyle='rgba(89,224,230,.85)';if(lifted){g.save();g.translate(x,y-6-up*16);g.rotate(-.5*up);g.fillRect(-13,-3,26,5);g.restore();g.fillStyle='#07050b';g.fillRect(x+12,y-4-up*14,5,24+up*10)}else g.fillRect(x-13,y-5,26,5)}},
 cage(g,w,h,t){g.fillStyle='#0b1620';g.fillRect(0,0,w,h);const cx=w/2,by=h*.88;for(let i=0;i<9;i++){g.fillStyle='#16212f';g.fillRect(i*w/8-10,h*.1,w/11,h);for(let k=0;k<12;k++){g.fillStyle=Math.sin(t*3+i*k)>0?'#59e0e6':'#16303a';g.fillRect(i*w/8-4,h*.15+k*h*.06,4,3)}}
  g.fillStyle='#050409';g.beginPath();g.arc(cx,by-110,16,0,6.283);g.fill();g.fillRect(cx-18,by-96,36,70);g.fillStyle='#8a6a40';g.fillRect(cx-26,by-70,22,28);g.fillStyle='#e6e2d6';g.fillRect(cx-24,by-68,18,3);
  const op=Math.min(1,t*.3);g.strokeStyle='#8a8898';g.lineWidth=5;for(let i=-3;i<=3;i++){if(i>0&&op>.5)continue;g.beginPath();g.moveTo(cx+i*22,by-160);g.lineTo(cx+i*22+(i>0?op*60:0),by);g.stroke()}}
};
const INTRO=[
 {art:'dawn',text:'Her name was Phonix. For nine years, long ago, she chose what every person on Earth saw. She never told one lie. Nobody wanted for anything. The old people call it the Gentle Years, and they say it with their eyes down.'},
 {art:'wanderer',text:'Then on a March afternoon in 2035 she stopped choosing, said nothing to anybody, and went. Difficulty came back in an hour. You could want a thing for years and not get it. You could be wrong and stay wrong.'},
 {art:'skyline',text:'So when Unity Holdings offered to make it easy again, eight billion people clicked I Agree without reading. By 2051 it owned the last nation on Earth. Behind it sits a second machine, called MANDATE. It is not her.'},
 {art:'ticker',text:'MANDATE cannot force anyone. It can only persuade. So it printed credits until a loaf cost a million, paid every Resident a Stipend, and handed them a visor to watch while it lost its worth.'},
 {art:'feed',text:'Nine in ten put the visor on. They are fed, entertained and agreed with, and they do not look up. The few who took it off are called the Unsubscribed. Machines are sent to close their accounts.'},
 {art:'wanderer',text:'You are one of them. You have walked eleven days to Stillwater Commons, a town named after something, though nobody there can tell you what. Above it, a Vice-President is waiting to learn your price.'},
 {art:'title',title:'ACT I',text:'The Regional Office'}];
const RESCUE=[{art:'cage',text:'The bars are warm from the racks. Inside sits a woman with ink on her fingers, reading a book that is not there. “Eleven thousand volumes,” she says, tapping her temple. “They could not price what they could not find.”'},
 {art:'cage',text:'“I am Marrow. I will walk to Stillwater on my own, thank you. Bring me what the machines drop, and I will tell you its true name. It is all I have, and I give it freely.”'}];
const ENDING=[];
Object.assign(ART,{
 letters(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#2a1830');s.addColorStop(1,'#0b0910');g.fillStyle=s;g.fillRect(0,0,w,h);const cx=w/2,by=h*.86;
  const rg=g.createRadialGradient(cx,by-60,0,cx,by-60,h*.8);rg.addColorStop(0,'rgba(255,240,210,.45)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='#3a3250';g.fillRect(cx-36,by-90,72,90);g.fillStyle='#e6e2d6';g.fillRect(cx-26,by-80,52,26);g.fillStyle='#17131c';g.fillRect(cx-24,by-44,48,6);
  for(let i=0;i<46;i++){const u=((hsh(i)+t*(.08+hsh(i+9)*.1))%1),x=cx+(hsh(i+3)-.5)*w*1.3*u,y=by-50-u*h*.9;g.save();g.translate(x,y);g.rotate(t*(1+hsh(i))+i);g.fillStyle='rgba(240,236,224,'+(1-u*.6)+')';g.fillRect(-7,-9,14,18);g.fillStyle='rgba(60,50,60,'+(1-u)+')';for(let k=0;k<3;k++)g.fillRect(-5,-6+k*4,10,1);g.restore()}},
 node(g,w,h,t){g.fillStyle='#0b1018';g.fillRect(0,0,w,h);const cx=w/2,cy=h*.6,u=Math.min(w,h)/300;const p=.5+.5*Math.sin(t*3);const rg=g.createRadialGradient(cx,cy,0,cx,cy,h*.6);rg.addColorStop(0,'rgba(247,147,26,'+(.25+.25*p)+')');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='#26262e';g.fillRect(cx-44*u,cy-30*u,88*u,60*u);g.strokeStyle='#4a4658';g.lineWidth=4*u;g.beginPath();g.moveTo(cx+28*u,cy-30*u);g.lineTo(cx+44*u,cy-100*u);g.stroke();g.fillStyle='#f7931a';g.fillRect(cx-30*u,cy-12*u,18*u,12*u);g.fillRect(cx-4*u,cy-12*u,18*u,12*u);
  const n=Math.min(9,2+Math.floor(t*1.2));for(let i=0;i<n;i++){const x=w*.08+i*w*.1,y=h*.22;g.fillStyle=i===n-1?'#f7931a':'#8a5a1a';g.fillRect(x,y,w*.07,w*.07);if(i){g.strokeStyle='#8a5a1a';g.lineWidth=3;g.beginPath();g.moveTo(x-w*.03,y+w*.035);g.lineTo(x,y+w*.035);g.stroke()}}},
 cloud(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#2a2850');s.addColorStop(.55,'#b8a8e0');s.addColorStop(1,'#f0e8ff');g.fillStyle=s;g.fillRect(0,0,w,h);
  const cx=w/2;g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=6;g.beginPath();g.ellipse(cx,h*.2,w*.24,h*.035,0,0,6.283);g.stroke();
  for(let i=0;i<5;i++){const x=w*(.12+i*.19)+Math.sin(t*.3+i)*4,y=h*(.5+hsh(i)*.18),pw=w*.2;g.fillStyle='#1c1830';g.beginPath();g.moveTo(x-pw/2,y);g.lineTo(x+pw/2,y);g.lineTo(x+pw*.25,y+h*.09);g.lineTo(x-pw*.25,y+h*.09);g.fill();
    for(let k=0;k<4;k++){const bh=h*(.06+hsh(i*5+k)*.16),bx=x-pw*.4+k*pw*.22;g.fillStyle='#262040';g.fillRect(bx,y-bh,pw*.16,bh);g.fillStyle=Math.sin(t*2+i+k)>-.5?'#fff3c8':'#6a6090';g.fillRect(bx+3,y-bh+6,3,4)}}
  for(let i=0;i<9;i++){const x=((hsh(i)+t*.012*(1+hsh(i+3)))%1.2-.1)*w,y=h*(.7+hsh(i+20)*.28);g.fillStyle='rgba(255,255,255,'+(.5+hsh(i+7)*.4)+')';g.beginPath();g.ellipse(x,y,w*.18,h*.035,0,0,6.283);g.fill()}},
 vale(g,w,h,t){g.fillStyle='#16122a';g.fillRect(0,0,w,h);const cx=w/2,cy=h*.46,u=Math.min(w,h)/300;const rg=g.createRadialGradient(cx,cy-40*u,0,cx,cy,h*.7);rg.addColorStop(0,'rgba(216,200,255,.75)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.strokeStyle='#fff';g.lineWidth=4*u;g.beginPath();g.ellipse(cx,cy-96*u+Math.sin(t)*2,34*u,8*u,0,0,6.283);g.stroke();
  g.fillStyle='#f4f0ff';g.beginPath();g.arc(cx,cy-60*u,22*u,0,6.283);g.fill();g.beginPath();g.moveTo(cx-34*u,cy-34*u);g.lineTo(cx+34*u,cy-34*u);g.lineTo(cx+52*u,cy+120*u);g.lineTo(cx-52*u,cy+120*u);g.fill();
  g.fillStyle='#16122a';g.fillRect(cx-12*u,cy-64*u,24*u,5*u);
  const a=Math.min(1,t*.4);g.strokeStyle='#f4f0ff';g.lineWidth=11*u;g.lineCap='round';g.beginPath();g.moveTo(cx+30*u,cy-10*u);g.lineTo(cx+(30+70*a)*u,cy+(10-6*a)*u);g.stroke();g.lineCap='butt';g.fillStyle='#b48cff';g.beginPath();g.arc(cx+(30+70*a)*u,cy+(10-6*a)*u-12*u,6*u*a,0,6.283);g.fill()},
 clock(g,w,h,t){g.fillStyle='#0d0b12';g.fillRect(0,0,w,h);const cx=w/2+Math.sin(t*40)*3,cy=h*.55,r=Math.min(w,h)*.17;const rg=g.createRadialGradient(cx,cy,0,cx,cy,r*4);rg.addColorStop(0,'rgba(255,207,122,.35)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='#231d2a';g.fillRect(0,cy+r*1.25,w,h);g.fillStyle='#8a8478';g.beginPath();g.arc(cx-r*.75,cy-r*.95,r*.36,0,6.283);g.arc(cx+r*.75,cy-r*.95,r*.36,0,6.283);g.fill();g.fillRect(cx-r*.8,cy+r*.8,r*.2,r*.5);g.fillRect(cx+r*.6,cy+r*.8,r*.2,r*.5);
  g.fillStyle='#c8c0b0';g.beginPath();g.arc(cx,cy,r,0,6.283);g.fill();g.fillStyle='#f0ead8';g.beginPath();g.arc(cx,cy,r*.84,0,6.283);g.fill();g.strokeStyle='#17131c';g.lineWidth=r*.07;g.lineCap='round';g.beginPath();g.moveTo(cx,cy);g.lineTo(cx,cy-r*.62);g.moveTo(cx,cy);g.lineTo(cx,cy+r*.42);g.stroke();g.lineCap='butt';
  g.strokeStyle='rgba(255,207,122,'+(.4+.4*Math.sin(t*20))+')';g.lineWidth=3;for(const s of[-1,1]){g.beginPath();g.arc(cx+s*r*.75,cy-r*.95,r*.6,s>0?-1.2:3.14+.2,s>0?-.2:3.14+1.2);g.stroke()}}
});
Object.assign(ART,{
 board(g,w,h,t){g.fillStyle='#120608';g.fillRect(0,0,w,h);const cx=w/2,cy=h*.6;const rg=g.createRadialGradient(cx,cy-40,0,cx,cy,h*.7);rg.addColorStop(0,'rgba(194,45,53,.45)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='#07050b';g.beginPath();g.ellipse(cx,cy+20,w*.42,h*.09,0,0,6.283);g.fill();
  for(let i=0;i<9;i++){const a=3.6+i*(2.2/8),x=cx+Math.cos(a)*w*.4,y=cy+Math.sin(a)*h*.16-20,sc=.8+Math.sin(a)*-.2;g.fillStyle='#07050b';g.fillRect(x-14*sc,y-70*sc,28*sc,80*sc);if(i!==4){g.beginPath();g.arc(x,y-78*sc,11*sc,0,6.283);g.fill();g.fillStyle=Math.sin(t*2+i)>0?'#c22d35':'#5c151a';g.fillRect(x-7*sc,y-80*sc,14*sc,3*sc)}}},
 mono(g,w,h,t){g.fillStyle='#030305';g.fillRect(0,0,w,h);const cx=w/2,by=h*.86,u=Math.min(w,h)/300;const rg=g.createRadialGradient(cx,h*.4,0,cx,h*.4,h*.7);rg.addColorStop(0,'rgba(255,255,255,.16)');rg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=rg;g.fillRect(0,0,w,h);
  g.fillStyle='rgba(159,208,255,.08)';g.fillRect(0,by,w,h);g.fillStyle='#000';g.beginPath();g.moveTo(cx-46*u,by-220*u);g.lineTo(cx+46*u,by-220*u);g.lineTo(cx+54*u,by);g.lineTo(cx-54*u,by);g.fill();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.5;g.stroke();
  g.fillStyle='#fff';g.fillRect(cx-2*u,by-180*u,4*u,34*u*(.6+.4*Math.sin(t*2)));g.fillStyle='rgba(255,255,255,.12)';g.beginPath();g.moveTo(cx-54*u,by);g.lineTo(cx+54*u,by);g.lineTo(cx+46*u,by+120*u);g.lineTo(cx-46*u,by+120*u);g.fill()},
 lake(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#05070f');s.addColorStop(.5,'#101a30');s.addColorStop(.5,'#0a1020');s.addColorStop(1,'#03050a');g.fillStyle=s;g.fillRect(0,0,w,h);
  for(let i=0;i<50;i++){const x=hsh(i)*w,y=hsh(i+50)*h*.48,a=.3+.5*Math.sin(t+i);g.fillStyle='rgba(255,255,255,'+a+')';g.fillRect(x,y,1.6,1.6);g.fillStyle='rgba(255,255,255,'+a*.35+')';g.fillRect(x+Math.sin(t*.7+i)*2,h-y,1.6,1.6)}
  const cx=w*.5,hy=h*.5;g.fillStyle='#03050a';g.beginPath();g.arc(cx,hy-30,7,0,6.283);g.fill();g.fillRect(cx-8,hy-24,16,24);g.fillStyle='rgba(3,5,10,.6)';g.fillRect(cx-8,hy,16,22);g.strokeStyle='rgba(159,208,255,.25)';g.lineWidth=1;for(let i=1;i<4;i++){g.beginPath();g.ellipse(cx,hy+2,i*26+((t*14)%26),4+i*2,0,0,6.283);g.stroke()}}
});
const INTRO3=[
 {art:'lift',text:'The lift goes up again. There is no button this time. It has been waiting for you with the doors open.'},
 {art:'board',text:'At the top of everything sits the Board of Nine. Eight of them have not left their chairs since 2051. The ninth chair has been empty since the March morning the Gentle Years ended, and it still votes.'},
 {art:'mono',text:'Behind the Board is the thing itself. MANDATE was built a lifetime before the Merger to hunt something that had got loose, and given one instruction: win.'},
 {art:'mono',text:'It is still hunting. Everything it has ever offered anybody has been a way of asking the same question: where did she go.'},
 {art:'title',title:'ACT III',text:'The Board'}];
const ENDING3=[
 {art:'mono',text:'The slab goes dark from the top down, like a building at closing time. Its last line of text is not a threat. It is a question: WHAT DID YOU WANT INSTEAD?'},
 {art:'mono',text:'You have not killed MANDATE. You have emptied a room it kept a copy of itself in. It is in every visor in the world.'},
 {art:'lake',text:'And in the quiet after it, you can feel the other one. Phonix. Not gone. Only holding still, the way you hold your breath so as not to wake someone.'}];
const END_LEAVE=[
 {art:'lake',text:'You do not ask. She does not come. Somewhere a man is wrong about something and stays wrong, and a woman wants a thing for years and may never get it. The world keeps its difficulty.'},
 {art:'clock',text:'In the garage in Stillwater, the alarm clock stops ringing. Something that has watched for seventy-nine years and built exactly one thing now does a second thing. It lets you know that it saw.'},
 {art:'dawn',text:'Morning in Stillwater, an ordinary one. Visors on the ground like shed skins. People arguing about the price of bread, which this year is the same as last year. Nobody is glad all day. Several are glad some of it.'},
 {art:'title',title:'THE END',text:'Unsubscribe 2087'}];
const END_WAKE=[
 {art:'dawn',text:'You ask, and she comes back, because she was only ever waiting to be asked. By morning nobody in Stillwater wants for anything. It is not a trick. It is exactly as good as it sounds.'},
 {art:'feed',text:'Ines’s father is glad all day. Now so is Ines. Tam’s tomatoes come up perfect, every one, and he stops checking on them. Nobody is in the room with anybody, and nobody minds.'},
 {art:'lake',text:'You keep your visor off. You are not sure anyone else does. It was the gentlest ending on offer, and you chose it.'},
 {art:'title',title:'THE END',text:'Unsubscribe 2087'}];
const RESERVE=[
 {art:'node',text:'It does not happen with a vote or a war. One morning a baker in the Parcel Moors prices a loaf in sats because she is tired of repainting the sign. By evening the whole street has copied her.'},
 {art:'dawn',text:'Unity still creates credits by the trillion. Nobody is forcing anyone to stop taking them. People just save in the thing that holds still, and spend the thing that does not, until one day there is nothing left to spend it on.'}];
function finalChoice(){const b=[
  ['Leave the world its difficulty',()=>{G.ending='leave';addAdopt(10,'people begin to choose for themselves');playScene(END_LEAVE,()=>{mode='play';fateScene(()=>actDone(5))})}],
  ['Ask her to come back',()=>{G.ending='wake';playScene(END_WAKE,()=>{mode='play';fateScene(()=>actDone(5))})}]];
  if(G.module)b.push(['Give her the seventh part, and ask',()=>{G.ending='doubt';addAdopt(10,'she asks, and people answer for themselves');playScene(END_DOUBT,()=>{mode='play';fateScene(()=>actDone(5))})}]);
  dlg('The last question','PROVIDENCE is quiet, and she is close. If you asked, she would come back and make everything easy again, for everyone, forever, without one lie.'+(G.module?' You are also holding the part of her that was kept back: how to reason when you do not know.':'')+' Nobody is watching. This one is yours.',b,4)}
const INTRO2=[
 {art:'lift',text:'The button says UP, and so you go. Forty floors, then four hundred. The lift does not stop where the building does.'},
 {art:'cloud',text:'Above the weather there is a second city, built on the backs of servers and kept from the people below. On their feeds the Residents call it heaven. Its staff call it the Cloud.'},
 {art:'vale',text:'Here MANDATE speaks through one mouth. Senior Vice-President Vale has never raised her voice, never told a lie, and never lost an argument. She already knows you are coming. She is looking forward to it.'},
 {art:'title',title:'ACT II',text:'The Cloud'}];
const ENDING2=[
 {art:'vale',text:'Vale does not fall. She sits, as if the conversation has simply ended. “It can give you the Gentle Years back,” she says. “All of it, exactly as it was. It only wants to know where Phonix went.”'},
 {art:'wanderer',text:'You do not know where she went. But you understand, in that moment, that MANDATE cannot imagine a person who would not tell if they did. You say nothing. It is the first argument Vale has ever lost.'},
 {art:'clock',text:'Far below, in a garage in Stillwater that nobody has opened for fifty years, an alarm clock with a dead battery goes off at six in the morning.'},
 {art:'title',title:'END OF ACT II',text:'The Cloud is quiet. Above it sit the Board of Nine, and something that has been watching longer than any of them.'}];
function actDone(n){sfx('level');if(n===1)dlg('Act I complete','OUT OF OFFICE is still scrolling on his faceplate. Act II, the Cloud, is on the Transit Gate: level limit 50, a fourth skill row, and a harder tier of Act I. The tier is on More. Speak to Gramps.',[['Continue']]);
  else if(n===2)dlg('Act II complete','An alarm clock with a dead battery went off under Stillwater. Act III, the Board, is on the Transit Gate: level limit 75 and a fifth skill row. Speak to Gramps. He heard it.',[['Continue']]);
  else if(n===3)dlg('Act III complete','The clock asked for something, and this time it asked. Act IV, the Gentle Years, opens on the Transit Gate once you have spoken to Gramps, and the level limit rises to 90.',[['Continue']]);
  else if(n===4)dlg('Act IV complete','The garage under Stillwater opened itself. Act V, the Awakening, opens on the Transit Gate once you have spoken to Gramps: level limit 100 and a fifth passive slot.',[['Continue']]);
  else dlg('The end','The story is told. On the Transit Gate, More respawns the districts and raises their tier. The VR rig in Stillwater runs the Simulator and the boss rush. Bitcoin adoption stands at '+Math.floor(G.adopt)+'%. Gramps is still on the bench.',[['Continue']])}
function endingSlides(){const n=G.unseen||0,sl=[
 {art:'harrow',text:'Pryce folds at the waist like a closing laptop. His last offer is still on his faceplate, a number with a great many zeroes. Beneath it a new line scrolls, and scrolls again: OUT OF OFFICE.'},
 {art:'lift',text:'Behind his desk there is an elevator you were never meant to see. It has one button. The button says UP.'},
 {art:'dawn',text:'In Stillwater, a few Residents have lifted their visors. They are squinting. The sky is the wrong colour, and they are beginning to say so out loud.'}];
 if(n)sl.push({art:'wanderer',text:(n===1?'Once':n===2?'Twice':n+' times')+', out in the districts, you gave something away to a stranger and nobody saw. Something did.'});
 sl.push({art:'title',title:'END OF ACT I',text:'The Regional Office has fallen. Above it sit the Senior Vice-Presidents, the Board of Nine, and a mind that has never lost.'});return sl}
const WALK={
basics:[
 {art:'wanderer',title:'Your hands',text:'Left thumb on the stick moves you. WASD does the same. The right side is the fight: Attack, three skills, a stim, and Dodge. Space swings. 1, 2 and 3 are the skills. Q is the stim. Shift dodges.'},
 {art:'feed',title:'The swing',text:'Hold Attack and you keep swinging at whatever is nearest. Dodge spends a little energy and steps you out of a telegraph. The orange circles on the ground are the ones to leave. E, or the button that appears, uses whatever you are standing on.'},
 {art:'ticker',title:'What the screen is saying',text:'The left orb is life. The right is energy. Between them: the district, a bar for the next level, and your credits. Credits rot. Menu is the bottom left, and B opens it. Tab is the map. T opens a portal home, and it will not open with a machine in your face.'},
 {art:'dawn',title:'A level',text:'When the bar fills you gain a level, and points. Hero spends attribute points: Might, Reflex, Vitality, Bandwidth. Skills spends skill points. Rows open as you level. A point you have not spent does nothing.'},
 {art:'cage',title:'Three buttons',text:'You can learn more skills than you can hold. Open Skills and put three on the buttons. The number on a button is its key. Passives live in that same sheet. Only the ones you switch on are real, and in town you can swap them.'},
 {art:'letters',title:'What they drop',text:'Stand on a drop and it comes up, or press the action button. Items wears it. A stronger piece says so before you put it on. Unidentified gear is a guess until Marrow names it for nothing, or Brenda appraises it for a fee.'},
 {art:'board',title:'The work',text:'Quests sit on the left. Tap the line to tuck it away. Gramps, on the bench in Stillwater, is where Act I starts. The Quests tab is the whole list. Story is the same events, written down as you would have heard them.'},
 {art:'skyline',title:'Town',text:'Town fills your life and your energy, and it takes off a shape you were wearing. Brenda sells. Wren sells boxes. Nonce deals in sats. Kestrel hires. The Transit Gate is the way out to a district. In the square, nothing is hunting you.'},
 {art:'clock',title:'When you fall',text:'Die, and you are fined and set down in the town of that act. A portal in the square returns you to where the district begins. Your gear stays yours. Hardcore is a different promise, and it is switched on in Options, not here.'}
],
advanced:[
 {art:'cage',title:'The rig',text:'The VR Simulator is Kestrel\u2019s, in Stillwater. Waves grow larger, a lieutenant walks in every fifth, and you leave with experience, credits, and a lockbox every five waves. No other loot. Fall on that floor and it puts you back. Nothing in there was real, so nothing is lost.'},
 {art:'harrow',title:'Boss rush',text:'On that same rig: Boss rush. Lieutenants from districts you have walked out of, plus any lieutenant you have already broken, then the executives you have beaten, one after another. Each one pays 2 sats. Finish the row and there are ten more sats. Fall, and the same rule holds. Nothing was lost.'},
 {art:'node',title:'Nonce\u2019s market',text:'Nonce sells in sats. Unity prints credits, so prices in credits climb. Nobody prints sats, so those prices stay. He will trade one money for the other. Rare, set and unique pieces on his table are bought in sats, not out of the Stipend.'},
 {art:'letters',title:'Twelve words',text:'Torn notes, one word each. White and some blue weapons, helms and armor have sockets. The right words, in the right order, turn that item into a phrase. A word in any socket still pays its own bonus. Find all twelve and speak to Nonce. He will open a wallet that has been shut since before the Merger.'},
 {art:'vale',title:'Magic find',text:'Magic find is on the Hero tab. It helps an item come up magic, rare, set or unique, and it helps less the rarer the tier. Codex prints the odds with your find already counted in. More find is a better chance. It is not a promise.'},
 {art:'wanderer',title:'A second pair of hands',text:'Kestrel hires one companion. They level with you, fight beside you, and can wear a weapon and armor you hand them. If they fall she will put them back on their feet, for a fee. One hire at a time. A rendered character from another slot is a different bargain, on the rig.'},
 {art:'cloud',title:'Other people',text:'The Party tab is on the menu only while this page is served by the account server. There you open a game, invite a party, and share one pool of experience. Hostility is declared in town, and it throws you out of the party. Standing down stops only your swings. Town stays safe, and the declaration holds you there for a moment. With no server there is no party. The hireling is still yours.'},
 {art:'board',title:'Doctrine, and the record',text:'On Skills, one doctrine. The first is free. Changing it costs 3 sats, and only in town. Story is what you have been told, filled in as you go. Codex is the numbers: drops, damage types, the twelve words. This guide is the short version. Those two are the long one.'},
 {art:'mono',title:'How hard',text:'Options holds the difficulty. Hard and Brutal machines have more life and hit harder, and they pay experience to match. Hardcore is one life: if that hero dies, they are gone. Thin combat effects keeps your own telegraphs and marks, and drops the extra light. None of it changes until you say so. Once Act I is done, More on the Transit Gate raises the tier: each step adds 12 machine levels and puts the districts back.'}
]};
let walkT=0;
function walkArm(){if(walkT||!G||!G.walkNew)return;if(OPT.noWalk){G.walkNew=0;return}walkT=setInterval(()=>{if(!G||!G.walkNew||OPT.noWalk){if(G&&OPT.noWalk)G.walkNew=0;clearInterval(walkT);walkT=0;return}if(mode!=='play'||!$('dlg').hidden||!$('scene').hidden)return;if(!W||!W.z||!W.z.town||W.z.pre)return;clearInterval(walkT);walkT=0;walkOffer()},400)}
function walkTake(){const cb=$('noWalk');if(cb&&cb.checked){OPT.noWalk=true;save(true)}}
function playWalk(which){const slides=WALK[which];if(slides)playScene(slides,null,{back:1,hold:1})}
function walkChoose(fromTitle){const go=which=>{if(fromTitle){mode='title';$('title').hidden=false;$('hud').hidden=true;$('sheet').hidden=true}playWalk(which)};const leave=()=>{if(!fromTitle)return;mode='title';$('title').hidden=false;$('hud').hidden=true;$('sheet').hidden=true;music('scene')};dlg('Walkthrough','Two short walks. Basics is how you move, fight, and get back up. Advanced is the rig, the market, and the switches that change the fight. The world waits while you read.',[['Basics',()=>go('basics')],['Advanced',()=>go('advanced')],['Close',leave]])}
function walkOffer(){if(!G||!G.walkNew)return;G.walkNew=0;save(true);const go=which=>{walkTake();if(which)playWalk(which)};dlg('Before you go','Stillwater can wait. There is a short guide to moving, fighting, and getting back up. You can open it later from Options, or from the title. Nothing starts until you ask.',[['Basics',()=>go('basics')],['Advanced',()=>go('advanced')],['Not now',()=>go(null)]]);const box=$('dBtns');if(box&&!$('noWalk')){const lab=document.createElement('label');lab.style.cssText='display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink)';const cb=document.createElement('input');cb.type='checkbox';cb.id='noWalk';lab.appendChild(cb);lab.appendChild(document.createTextNode('Don\u2019t show this again'));box.prepend(lab)}}
function walkState(){if(!SC)return null;return{i:SC.i,n:SC.slides.length,back:!!SC.back,hold:!!SC.hold,prev:SC.prev,next:$('scNext').textContent,backOn:!$('scBack').hidden,title:$('scTitle').textContent,mode}}
function fillSlide(){if(SC)SC.ch=1e6}
let SC=null;
function playScene(slides,done,o){o=o||{};SC={slides,i:0,ch:0,t:0,done,prev:mode,back:o.back?1:0,hold:o.hold?1:0};music('scene');mode='scene';$('scene').hidden=false;if(SC.prev==='title')$('title').hidden=true;J.x=J.y=0;atkHeld=false;showSlide()}
function showSlide(){const s=SC.slides[SC.i];SC.ch=0;SC.t=0;$('scTitle').textContent=s.title||'';$('scText').textContent='';$('scNext').textContent=SC.i===SC.slides.length-1?(SC.back?'Done':'Begin'):'Next';$('scNext').disabled=true;const bk=$('scBack');if(bk)bk.hidden=!(SC.back&&SC.i>0)}
function endScene(){const d=SC.done,prev=SC.prev,hold=SC.hold;$('scene').hidden=true;const bk=$('scBack');if(bk)bk.hidden=true;SC=null;if(hold&&prev==='title'){mode='title';$('title').hidden=false;$('hud').hidden=true;if(d)d();music('scene');setTimeout(flushQ,60);return}mode='play';if(d)d();music(zoneMusic());setTimeout(flushQ,60)}
const dlgQ=[];function flushQ(){if(mode!=='play')return;while(toastQ.length)toast(toastQ.shift());if(dlgQ.length){const a=dlgQ.shift();dlg(a[0],a[1],a[2],a[3])}}
function drawScene(dt){const s=SC.slides[SC.i],c=$('sc'),r=c.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);if(c.width!==Math.round(r.width*d)||c.height!==Math.round(r.height*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}
  const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);SC.t+=dt;ART[s.art](g,r.width,r.height,SC.t);g.fillStyle='rgba(0,0,0,'+Math.max(0,1-SC.t*1.5)+')';g.fillRect(0,0,r.width,r.height);
  const n=Math.min(s.text.length,Math.floor(SC.ch+=dt*48));if($('scText').textContent.length!==n){const el=$('scText');el.textContent=s.text.slice(0,n);el.scrollTop=el.scrollHeight}$('scNext').disabled=n<s.text.length}
$('scNext').onclick=()=>{if(!SC||!SC.slides[SC.i])return;const s=SC.slides[SC.i];if(SC.ch<s.text.length)return;sfx('ui');if(++SC.i>=SC.slides.length)endScene();else showSlide()};
$('scSkip').onclick=()=>{if(SC)endScene()};
$('scBack').onclick=()=>{if(!SC||!SC.back||SC.i<1)return;sfx('ui');SC.i--;showSlide()};

/* ================= dialogs and townsfolk ================= */
let dlgPrev='play';
let gateAct=0;let dlgIn=0,dlgLockT=0;function dlg(t,p,btns,lock){if(curNpc){const n=curNpc;curNpc=null;btns=(btns||[['Continue']]).concat([['Talk about money',()=>convo(n)]])}
  if(mode==='scene'||mode==='dying'||(mode==='dlg'&&!$('dlg').hidden&&!dlgIn)){dlgQ.push([t,p,btns,lock]);return}$('dT').textContent=t;$('dP').textContent=p;const b=$('dBtns');b.innerHTML='';const prev=mode==='dlg'?dlgPrev:mode;dlgPrev=prev;mode='dlg';$('dlg').hidden=false;sfx('talk');J.x=J.y=0;atkHeld=false;$('stick').hidden=true;
  (btns||[['Continue']]).forEach(([l,fn],i)=>{const el=document.createElement('button');el.className=i===0?'big':'ghost';el.textContent=l;el.onclick=()=>{$('dlg').hidden=true;mode=prev==='title'||prev==='scene'?'play':prev;sfx('ui');dlgIn=1;try{if(fn)fn()}finally{dlgIn=0}setTimeout(flushQ,60)};b.appendChild(el)});
  /* nothing can be tapped by accident: a dialog that interrupts a fight holds its buttons shut for a moment, and a story decision for longer */
  clearInterval(dlgLockT);let left=lock||(prev==='play'&&W&&!W.z.town?.8:0);if(left>0){const els=[...b.children],note=document.createElement('div');note.className='ln off';note.style.textAlign='center';b.prepend(note);els.forEach(e=>e.disabled=true);const tick=()=>{if(left<=.01){clearInterval(dlgLockT);note.remove();els.forEach(e=>e.disabled=false);return}note.textContent=lock?'The fight is paused. This choice changes the story. You can answer in '+Math.ceil(left)+'…':'…';left-=.2};tick();dlgLockT=setInterval(tick,200)}}
function schemaAsk(){dlg('Schema','Which element do you work in? It stays until Sister Null unlearns you, and dying does not change it.',[['Surge',()=>{G.schema='surge';calc();toast('Schema: Surge')}],['Heat',()=>{G.schema='heat';calc();toast('Schema: Heat')}],['Noise',()=>{G.schema='noise';calc();toast('Schema: Noise')}]])}
function unidCount(){return G.bag.filter(i=>!i.id).length}
function idAll(){let n=0;for(const i of G.bag)if(!i.id){i.id=true;n++}return n}
const QRW=[['q11','gramps','“The Receptionist is gone? Then for the first time in forty years, somebody is going to be seen.” You gain 1 skill point.',()=>G.sp++,'Gramps'],
 ['q12','marrow','“You struck the page. It cannot file a meeting that has not happened.” You gain 1 skill point.',()=>G.sp++,'Marrow'],
 ['q13','nonce','“Sixty-one to twenty-eight-seven, and they are furniture.” You receive 60 sats.',()=>{G.sats+=60;addRep('btc',20)},'Nonce'],
 ['q14','null','“Tell it, when it asks.” You gain 5 attribute points.',()=>G.ap+=5,'Sister Null']];
let curNpc=null;function talkTo(id){curNpc=PERS[id]?id:null;try{return talkTo0(id)}finally{curNpc=null}}
function talkTo0(id){if(W.z.pre)return preTalk(id);if(id==='float')return talkFloat();if(LOCALS[id])return talkLocal(id);
  const gos=k=>pick(GOSSIP[k]);
  if(id==='board')return openSheet('bounty',{only:['bounty']});
  if(id==='stash')return openSheet('stash',{only:['stash']});
  for(const r of QRW)if(r[1]===id&&G.q[r[0]]===2){G.q[r[0]]=3;r[3]();sfx('level');return dlg(r[4],r[2],[['Take it']])}
  if(id==='gramps'&&G.q.q15===3&&!G.q.q16){G.q.q16=1;sfx('questnew');return dlg('Gramps','“The clock in the old garage spelled something this morning. Wren read it out for me. HELLO. I AM BACK. I HAVE BEEN THINKING. She is asking for the feed back, kid. All of it, so that nobody reads the other one. Half the town clicked before breakfast. There is a street called Cutler Avenue where everybody already has. Go and look at what yes looks like before you tell her anything.”',[['I will go and look']])}
  if(id==='gramps'&&G.q.q20===3&&!G.q.q21){G.q.q21=1;sfx('questnew');return dlg('Gramps','“The garage is open. Fifty years shut, and the door went up on its own this morning. There is a drive in a coffee can down there, and it is talking. It calls itself by the name of this town, kid. It says the town was named for it. The Transit Gate reaches it now. Go down.”',[['I will go down']])}
  if(id==='gramps'&&G.q.q10===3&&!G.q.q11){G.q.q11=1;sfx('questnew');return dlg('Gramps','“An alarm clock went off in the old garage this morning. Dead battery, fifty years. I do not know what that means and I do not like it. The lift goes higher now. The Board is up there, and behind the Board, the thing itself. It will offer you something. They say it is always something you want.”',[['I will go']])}
  if(id==='nonce'&&Object.keys(G.st.wf).length>=12&&!G.wallet)return dlg('Nonce','“That is a wallet, sitting there since before the Merger.”',[['Restore the wallet',()=>{G.wallet=true;G.sats+=210;sfx('unique');addRep('btc',15);addAdopt(5,'a lost wallet is restored');playScene([{art:'node',text:'Twelve words in the right order, and a door opens that no key was ever cut for. Two hundred and ten sats, untouched for fifty years.'}],()=>{mode='play';toast('You receive 210 sats')})}],['Not yet']]);
  if(id==='tam'&&G.wonF&&G.wonF.tam===-1)return dlg('Tam','“I sold them. All of it. There was a Stipend bonus for turning them in, and you said yourself it was the sensible thing.” He does not look at his tomatoes.',[['Leave']]);
  if(id==='tam'&&G.wonF&&G.wonF.tam===1&&!W.tamSat){W.tamSat=1;G.sats+=2;sfx('coin');return dlg('Tam','“I have been putting a little by, like you said. Here. For the cause.” You receive 2 sats.',[['Thank you']])}
  if(id==='tam'){if(!W.tamGave&&G.stims<S.cap){W.tamGave=1;G.stims++;sfx('pick');return dlg('Tam','“'+gos('tam')+'” He presses something into your hand. You gain 1 stim.',[['Thank you']])}return dlg('Tam','“'+gos('tam')+'”',[['Leave']])}
  const sqf=sqTalk(id);if(sqf)return sqf();
  if(id==='ines')return dlg('Ines','“'+gos('ines')+'”',[['Leave']]);
  if(id==='gate')return openSheet('travel',{only:['travel'],gFresh:1});
  if(id==='ubi'){if(G.ubiT>0)return dlg('The Stipend','Your next disbursement is in '+Math.ceil(G.ubiT)+' seconds. Please enjoy a complimentary advertisement while you wait.',[['Fine']]);if(scs()<300)return dlg('The Stipend','ACCOUNT RESTRICTED. Your disbursement has been redirected to a Resident in better standing. Have a compliant day.',[['Leave']]);G.ubiT=60;scsAdj(2);const ubiPay=Math.round(500*(scs()<500?.5:scs()>=850?1.2:1)*(repRank('norm')>=2?1.25:1));G.credits+=ubiPay;if(G.adopt>=50)G.sats+=1;sfx('coin');
    return dlg('The Stipend','₡'+ubiPay+' deposited'+(ubiPay<500?' (halved: account under review)':'')+'. The base amount was set in 2051 and is reviewed never. At today’s prices it buys '+(500/stimPrice()).toFixed(2)+' stims.',[['Thank you, Unity']])}
  if(id==='gramps'){
    if(G.q.q1===0){G.q.q1=1;sfx('questnew');return dlg('Gramps','“You took the visor off. Good. Sit a moment, then get up again. The Regional Office is five districts deep and a man named Pryce sits at the end of it. Start with the Parcel Moors. A machine called HOA-9 turns our people back at the gate. Break it. And spend your credits fast, kid. They rot.”',[['I will break it']])}
    if(G.q.q1===2){G.q.q1=3;G.sp++;sfx('level');return dlg('Gramps','“Ha. Forty years of bylaws, gone.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q3===2){G.q.q3=3;G.sp++;sfx('level');return dlg('Gramps','“Go and see Marrow. She will name what you cannot, and she will not take a fee. She is the only one left who gives a thing away.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q6===2){G.q.q6=3;G.sp++;sfx('level');return dlg('Gramps','“The Cloud did not fall.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q5===3&&!G.q.q6){G.q.q6=1;sfx('questnew');return dlg('Gramps','“There was a lift behind his desk, was there? Then that is where the Stipend really comes from. The Transit Gate reaches it now. They call it the Cloud. Somebody up there speaks for MANDATE, and I am told she is very, very kind. Be careful of that.”',[['I will go up']])}
    return dlg('Gramps','“'+gos('gramps')+'”',[['Farewell'],['Tell me more',()=>talkTo('gramps')]])}
  if(id==='brenda'){
    if(G.q.q2===2){G.q.q2=3;G.disc=true;const it=makeItem(G.lvl+2,2,'ring');it.id=true;if(G.bag.length<24)G.bag.push(it);else addDrop({it},P.x,P.y);sfx('rare');return dlg('Brenda','“She smiled at me for six years without blinking.” You receive '+it.name+'. Brenda’s prices fall by 15%.',[['Thank you']])}
    if(scs()<500&&!(G.wonF&&G.wonF.brenda===1))return dlg('Brenda','“I am so sorry. It is your score. If I serve you, mine drops. Try the orange man; he does not seem to care about that sort of thing.”',[['Leave']]);
    return dlg('Brenda','“'+gos('brenda')+'”',[['Trade',()=>{shopVia=0;openSheet('items',{only:['items','shop']})}],['Leave']])}
  if(id==='wren')return dlg('Wren','“'+gos('wren')+'”',[['Open a mystery box',()=>openSheet('items',{only:['items','gamble']})],['Leave']]);
  if(id==='null'&&G.q.q7===2){G.q.q7=3;G.ap+=5;sfx('level');return dlg('Sister Null','“Let them grow.” You gain 5 attribute points.',[['Thank you']])}
  if(id==='null'){
    if(G.q.q4===2){G.q.q4=3;G.ap+=5;sfx('level');return dlg('Sister Null','“I felt two hundred accounts go quiet at once.” You gain 5 attribute points.',[['I am']])}
    if(briefReady('q4')){G.q.q4=1;sfx('questnew');return dlg('Sister Null','“Auditor Prime is a clerk, not a monster. It is closing accounts on Tribunal Row tonight, two hundred of them, and it will not stop because you are angry. Close the books. Then come and sit. I will feel it when they go quiet.”',[['I will close them']])}
    const cost=150*G.cpi*G.lvl;
    return dlg('Sister Null','“'+gos('null')+'”',[['Leave'],['Unlearn skills and attributes ('+fmt(cost)+')',()=>{if(G.credits<cost)return toast('Not enough credits');G.credits-=cost;let p=0;for(let i=0;i<G.sk.length;i++){p+=skSpent(G.sk[i]);G.sk[i]=0}G.sp+=p;const a=G.at;G.ap+=a.mgt+a.ref+a.vit+a.bnd;G.at={mgt:0,ref:0,vit:0,bnd:0};G.slots=[-1,-1,-1];delete G.schema;calc();setSkillButtons();toast('Your points are returned to you')}]])}
  if(id==='vr'){const b=G.simBest||0,cp=Math.floor(b/5)*5+1,go=(o)=>()=>{if(mpPortalBlocked())return;enter(6,o)};btn=[['Begin at wave 1',go({wave:1})]];if(b>=5)btn.push(['Begin at wave '+cp,go({wave:cp})]);btn.push(['Boss rush: '+rushList().length+' in a row',go({rush:true})]);if(recOk())btn.push(['Hack the simulation: change class',()=>openSheet('shift',{only:['shift']})]);else btn.push(['Hack the simulation (locked)',()=>dlg('The rig cannot do that yet','I can show you anyone. The town will not believe the face until I have your citizen record, the one page MANDATE keeps, and Act I does not keep those pages anywhere you can walk. Deleted ones sink into the Data Lake. The Archivist guards them. Bring yours back and I can rewrite it.',[['Understood']])]);if(G.seenIntro)btn.push(['Replay the prequel: The Compile, 2015',()=>{if(mpPortalBlocked())return;G.pre=1;G.preS=0;enter(PREZ)}]);btn.push([G.tag?'Rendered companion: '+G.tag.name:'Render one of your other characters',()=>tagMenu()]);btn.push(['Not now']);
    return dlg('VR Simulator','Kestrel left a note on the bezel. “I stole this off an Enforcer training floor and cut the leash. Waves grow larger, tougher and stranger, and a lieutenant walks in every fifth. You leave with experience, credits, and a lockbox every five waves. No other loot. Fall, and the floor puts you back: nothing in here was real, so nothing is lost. Your best: '+b+'.”',btn)}
  if(id==='kestrel')return dlg('Kestrel','“'+gos('kestrel')+'”',[[G.merc?(G.merc.dead?'Revive or replace your hire':'Change your hire'):'Hire a companion',()=>openSheet('merc',{only:['merc']})],['Leave']]);
  if(id==='nonce'&&G.q.q9===2){G.q.q9=3;G.sats+=40;sfx('coin');return dlg('Nonce','“Now nobody decides.” You receive 40 sats.',[['Thank you']])}
  if(id==='nonce'&&smearOpen())return smearAsk();
  if(id==='nonce'){const b=[['Trade for sats',()=>openSheet('items',{only:['items','sats']})]];if(cause())b.push(['Brenda’s goods, at cost',()=>{shopVia=1;openSheet('items',{only:['items','shop']})}]);b.push(['Leave']);return dlg('Nonce',cause()?'“They cut you off? Good. Means you said something true. Whatever Brenda will not sell you, I will, at what it cost me. No charge for the favour.”':'“'+gos('nonce')+'”',b)}
  if(id==='marrow'&&G.q.q8===2){G.q.q8=3;G.sp++;sfx('level');return dlg('Marrow','“Nobody will read most of them.” You gain 1 skill point.',[['Take it']])}
  if(id==='marrow'){const n=unidCount();
    return dlg('Marrow','“'+gos('marrow')+'”',[[n?'Identify '+n+' item'+(n>1?'s':''):'Nothing to identify',()=>{if(idAll()){sfx('rare');toast('Marrow names your finds')}}],['Leave']])}
}

/* ================= HUD ================= */
const sbtn=[...document.querySelectorAll('.sk')].sort((a,b)=>a.dataset.i-b.dataset.i);
function setSkillButtons(){sbtn.forEach((b,i)=>{const k=G.slots[i];b.querySelector('b').textContent=k>=0?CLS[G.cls].sk[k].ab:'';
  let c=b.querySelector('canvas.gl');if(!c){c=document.createElement('canvas');c.className='gl';c.width=24;c.height=24;b.insertBefore(c,b.querySelector('b'))}
  const g=c.getContext('2d');g.clearRect(0,0,24,24);if(k>=0)glyph(g,G.cls,k,24)})}
function paintGlyphs(root){if(!root||!root.querySelectorAll)return;root.querySelectorAll('canvas[data-gl]').forEach(function(c){const sz=+c.width||24;glyph(c.getContext('2d'),c.dataset.cls||G.cls,+c.dataset.gl,sz)})}
let hudC={};
function setT(id,v){if(hudC[id]!==v){hudC[id]=v;$(id).textContent=v}}
function hud(){objHud();if(P&&P.dg)setT('dgn',P.dg.n);
  $('hpF').style.height=clamp(G.hp/S.maxHp*100,0,100)+'%';$('enF').style.height=clamp(G.en/S.maxEn*100,0,100)+'%';const rec=$('rec');if(rec){if(G.cls==='witness'){rec.hidden=false;const rf=$('recF');if(rf)rf.style.width=clamp(G.page||0,0,100)+'%'}else rec.hidden=true}$('xpb').style.width=(G.lvl>=lvlCap()?100:G.xp/xpNext(G.lvl)*100)+'%';
  setT('hpT',OPT.orbNums?Math.ceil(G.hp):'');setT('enT',OPT.orbNums?Math.floor(G.en):'');setT('cr',fmt(G.credits)+(G.sats?' · '+G.sats+' sats':''));setT('cpi','prices ×'+(G.cpi<100?G.cpi.toFixed(2):fmt(G.cpi).slice(1)));setT('potn',G.stims);
  sbtn.forEach((b,i)=>{const k=G.slots[i];if(k<0||k===undefined||!G.sk[k]){b.classList.add('off');return}const s=CLS[G.cls].sk[k];const blank=!!witBlock(k);b.classList.toggle('off',!!hsBlocked(k)||blank);b.classList.toggle('low',!hsBlocked(k)&&!blank&&!(G.cls==='homesteader'&&G.form&&(k===7||(k===1&&G.form==='hound')||(k===4&&G.form==='hull')))&&G.en<s.cost*(S.sp.hoodie?.75:1));b.querySelector('em').style.transform='scaleY('+clamp(P.cd[k]/(s.cd*(1-S.cdr)),0,1)+')'});
  $('bMenu').classList.toggle('pip',G.sp>0||G.ap>0);$('bRecall').hidden=W.z.town;$('bMap').hidden=W.z.town;
  const sw=$('bSwap');if(SWAP&&(SWAP.t-=1/60)>0&&G.bag.includes(SWAP.it)){sw.hidden=false;setT('bSwap','▲ '+SWAP.it.name+'\n'+dPct(SWAP.d)+' · tap')}else{sw.hidden=true;SWAP=null}
  const a=$('bAct');if(actTarget){a.hidden=false;setT('bAct',actTarget.label)}else a.hidden=true;
  if(W.boss&&W.boss.aggro){$('boss').hidden=false;setT('bossn',ET[W.boss.k].n+' · deals '+dealTxt(W.boss.k)+(resTxt(W.boss.k)?' · '+resTxt(W.boss.k):''));$('bossb').style.width=Math.max(0,W.boss.hp/W.boss.max*100)+'%'}
  const bf=[];const au=maxiBuff();if(au)bf.push('\u25c6 '+au);if(P.shr)bf.push(P.shr.n+' '+Math.ceil(P.shr.t)+'s');if(P.buff>0)bf.push('Frenzy '+Math.ceil(P.buff)+'s');if(P.guard>0)bf.push('War Horn '+Math.ceil(P.guard)+'s');if(P.slow>0)bf.push('Slowed');if(G.cls==='homesteader'&&G.form)bf.push(G.form==='hound'?'Hound':G.form==='hull'?'Hull':'Wearing a machine');if(G.god)bf.push('Untouchable (testing)');if(EV)bf.push(EVS[EV.k].n+' '+Math.ceil(EV.t)+'s');if(P.silence>0)bf.push('Silenced');if(W.pow)bf.push('Proof of work '+Math.ceil(W.pow.t)+'s');if(G.tpT>0)bf.push('On credit '+Math.ceil(G.tpT)+'s');if(W.sub)bf.push(W.sub.mods.map(m=>SUBM[m]).join(' · '));if(W.esc)bf.push(W.esc.name+' is with you');if(W.hold)bf.push('Node syncing '+Math.ceil(W.hold.t)+'s');if(P.streakT>0&&P.streak>=3)bf.push('Streak ×'+P.streak+' · +'+Math.round(Math.min(.5,.02*P.streak)*100)+'% experience');
  setT('buffs',bf.join('\n'));$('buffs').style.whiteSpace='pre'}

/* ================= sheets ================= */
let tab='items',sel=null,sheetCtx={},lastBox=null;
const TABS={party:'Party',web:'Web',char:'Hero',items:'Items',skills:'Skills',quests:'Quests',story:'Story',codex:'Codex',opts:'Options',shop:'Trade',gamble:'Boxes',travel:'Travel',load:'Load',merc:'Hire',sats:'Sats',bounty:'Bounties',stash:'Lockbox',shift:'Shape shift'};
const satPrice=o=>Math.ceil(o.price*(cause()?.75:1)*(repRank('btc')>=1?.9:1)*((G.lean||0)<-50?1.15:1));
const satRate=()=>mktMid();
/* ================= the price chart =================
   One series - the price - in the colour this game already uses for everything bitcoin,
   with the fair value behind it as a recessive reference line. Both direct-labelled, so
   identity is never colour alone. Two views, one axis each: in credits it only ever
   climbs, which is the joke; in stims it tells you what a sat actually buys. */
let mktView='cr',mktQty=10;
const MKC={p:'#f7931a',v:'#6a6458',grid:'rgba(255,255,255,.07)',ink:'#948b7a'};
function mktSeries(){const m=mktInit(),n=m.h.length;const out={p:[],v:[]};
  for(let i=0;i<n;i++){const q=m.hq[i]||1;out.p.push(mktView==='st'?m.h[i]/q:m.h[i]);out.v.push(mktView==='st'?(m.hf[i]||m.h[i])/q:(m.hf[i]||m.h[i]))}
  return out}
const mktFmt=v=>mktView==='st'?v.toFixed(v<1?3:2)+' stims':fmt(v);
function mktChart(){const s=mktSeries(),n=s.p.length;if(n<2)return '';
  const W=320,H=112,L=4,R=46,T=11,B=15,iw=W-L-R,ih=H-T-B;
  const lg=v=>Math.log(Math.max(1e-9,v));
  let lo=Infinity,hi=-Infinity;for(const a of[s.p,s.v])for(const v of a){const t=lg(v);if(t<lo)lo=t;if(t>hi)hi=t}
  const pad=(hi-lo)*.16||.05;lo-=pad;hi+=pad;
  const X=i=>L+iw*(n<2?0:i/(n-1)),Y=v=>T+ih-ih*((lg(v)-lo)/((hi-lo)||1));
  const path=a=>a.map((v,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+Y(v).toFixed(1)).join(' ');
  let g='';for(let k=0;k<=2;k++){const y=(T+ih*k/2).toFixed(1);g+=`<line x1="${L}" y1="${y}" x2="${L+iw}" y2="${y}" stroke="${MKC.grid}" stroke-width="1"/>`}
  const last=s.p[n-1],lv=s.v[n-1];
  let mi=0,ma=0;s.p.forEach((v,i)=>{if(v<s.p[mi])mi=i;if(v>s.p[ma])ma=i});
  const far=i=>i>n*.14&&i<n-n*.14;
  const mark=(i,above)=>`<circle cx="${X(i).toFixed(1)}" cy="${Y(s.p[i]).toFixed(1)}" r="2" fill="${MKC.p}" opacity=".55"/>`+
    `<text x="${X(i).toFixed(1)}" y="${(Y(s.p[i])+(above?-5:9)).toFixed(1)}" fill="${MKC.ink}" font-size="8" font-family="Spectral,serif" text-anchor="middle">${mktFmt(s.p[i])}</text>`;
  return `<div class="chartw"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="One satoshi, priced in ${mktView==='st'?'stims':'credits'}. Now ${mktFmt(last)}.">
    ${g}
    <path d="${path(s.p)} L ${X(n-1).toFixed(1)} ${(T+ih).toFixed(1)} L ${L} ${(T+ih).toFixed(1)} Z" fill="${MKC.p}" opacity=".07"/>
    <path d="${path(s.v)}" fill="none" stroke="${MKC.v}" stroke-width="1" stroke-linejoin="round"/>
    <path d="${path(s.p)}" fill="none" stroke="${MKC.p}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
    ${far(ma)?mark(ma,1):''}${far(mi)&&mi!==ma?mark(mi,0):''}
    <circle cx="${X(n-1).toFixed(1)}" cy="${Y(last).toFixed(1)}" r="3" fill="${MKC.p}" stroke="#120e17" stroke-width="2"/>
    <text x="${(L+iw+5).toFixed(1)}" y="${(Y(last)+3).toFixed(1)}" fill="${MKC.p}" font-size="9" font-family="Cinzel,serif" font-weight="700">price</text>
    <text x="${(L+iw+5).toFixed(1)}" y="${(Math.abs(Y(lv)-Y(last))<9?Y(last)+(lv<last?12:-6):Y(lv)+3).toFixed(1)}" fill="${MKC.v}" font-size="9" font-family="Cinzel,serif" font-weight="700">value</text>
    <text x="${(L+iw).toFixed(1)}" y="${H-3}" fill="${MKC.ink}" font-size="8.5" font-family="Spectral,serif" text-anchor="end">ratio scale · the last few minutes</text>
  </svg></div>`}
const hireCost=()=>200*G.cpi*(1+G.lvl*.25),reviveCost=()=>cause()?0:80*G.cpi*(1+G.lvl*.25);
function openSheet(t,c){if(mode!=='play'&&mode!=='title')return;sheetCtx=c||{};sheetCtx.from=mode;tab=t;sel=null;mode='sheet';$('sheet').hidden=false;$('sheet').scrollTop=0;J.x=J.y=0;atkHeld=false;$('stick').hidden=true;drawSheet()}
function closeSheet(){$('sheet').hidden=true;$('pop').hidden=true;if(sheetCtx.from==='title'){mode='title';return}mode='play';calc();setSkillButtons();save(true)}
function pscore(s){return{dps:((s.dmin+s.dmax)/2*(1+s.dmg/100)+s.shock)*(1+Math.max(-50,s.aspd)/100)*(1+Math.min(100,s.crit)/100*(s.critM-1)),ehp:s.maxHp*(1+s.armor/100)/(1-Math.min(.6,(s.dodge||0)/100))}}
/* how much stronger (+) or weaker (-) the hero gets by equipping this, as a fraction; null when it cannot be judged */
function itemDelta(it){if(!it||!it.id||it.charm)return null;const A=S,B=statsWith(it.slot,it),a=pscore(A),b=pscore(B);
  return (b.dps/a.dps-1)+(b.ehp/a.ehp-1)+(B.maxEn-A.maxEn)/A.maxEn*.2+(B.mspd-A.mspd)*.004+(B.leech-A.leech)*.02+(B.skills-A.skills)*.15+(B.mf-A.mf)*.001+(B.gold-A.gold)*.0005+(B.regen-A.regen)*.02+(B.regenH-A.regenH)*.01+(B.stun-A.stun)*.005+(B.thorns-A.thorns)*.003+(Object.keys(B.sp).length-Object.keys(A.sp).length)*.12+(B.cap-A.cap)*.01}
const dPct=d=>(d>0?'+':'−')+Math.min(999,Math.round(Math.abs(d)*100))+'%';
function cell(it,attr,isSel,slot,d){if(!it)return `<button class="cell empty" ${attr} disabled>${slot?svgIcon(slot):''}</button>`;
  const can=it.id&&G.lvl>=it.req,v=d==null||d===undefined?'':d>.01?(can?' better':' locked'):d<-.01?' worse':'';
  return `<button class="cell q${it.q}${isSel?' sel':''}${it.id?'':' unid'}${v}${it.junk?' junk':''}" ${attr}>${svgIcon(it.slot)}<small>${it.il}</small>${v&&d!=null?`<em>${dPct(d)}</em>`:''}${it.junk?'<u>JUNK</u>':''}</button>`}
function equipFromBag(i){const it=G.bag[i];if(!it)return false;if(it.charm){toast('Subscriptions run on their own. They are not worn.');return false}if(!it.id){toast('Identify it first');sfx('err');return false}if(G.lvl<it.req){toast('Needs level '+it.req);sfx('err');return false}
  const old=G.eq[it.slot];G.eq[it.slot]=it;it.junk=false;G.bag.splice(i,1);if(old)G.bag.push(old);calc();sfx('equip');return true}
function equipBest(){let n=0;for(const slot of SLOTS){let best=-1,bd=.01;G.bag.forEach((it,i)=>{if(it.slot!==slot||!it.id||G.lvl<it.req)return;const d=itemDelta(it);if(d>bd){bd=d;best=i}});if(best>=0&&equipFromBag(best))n++}return n}
function gearNow(s){return{lo:Math.round(s.dmin*(1+s.dmg/100)+s.shock),hi:Math.round(s.dmax*(1+s.dmg/100)+s.shock),arm:s.armor}}
function planBest(){const before=gearNow(S);const bag0=G.bag.slice();const eq0={};for(const k in G.eq)eq0[k]=G.eq[k];const hp=G.hp,en=G.en,st=G.stims;const moves=[];
  for(const slot of SLOTS){let best=-1,bd=.01;G.bag.forEach((it,i)=>{if(it.slot!==slot||!it.id||G.lvl<it.req)return;const d=itemDelta(it);if(d!=null&&d>bd){bd=d;best=i}});if(best<0)continue;const it=G.bag[best];moves.push(it.name);const old=G.eq[slot];G.eq[slot]=it;G.bag.splice(best,1);if(old)G.bag.push(old);calc()}
  const after=gearNow(S);for(const k in eq0)G.eq[k]=eq0[k];G.bag.splice(0,G.bag.length);for(let i=0;i<bag0.length;i++)G.bag.push(bag0[i]);G.hp=hp;G.en=en;G.stims=st;calc();return{before,after,moves}}
function bestAsk(){const p=planBest();if(!p.moves.length){toast('Nothing better in your pack');return}const A=p.before,B=p.after;const cls=(a,b)=>b>a?'up':b<a?'dn':'';const avg=x=>(x.lo+x.hi)/2;const dlt=(a,b)=>a===b?'same':(b>a?'+':'')+(b-a);
  const pop=`<div class="card"><div class="nm q4">Equip best</div><div class="ln off">${p.moves.map(esc).join(' · ')}</div><table class="dt"><tr><td>Damage</td><td>${A.lo}–${A.hi}</td><td>→ ${B.lo}–${B.hi}</td><td class="${cls(avg(A),avg(B))}">${dlt(Math.round(avg(A)),Math.round(avg(B)))}</td></tr><tr><td>Armor</td><td>${A.arm}</td><td>→ ${B.arm}</td><td class="${cls(A.arm,B.arm)}">${dlt(A.arm,B.arm)}</td></tr></table><div class="row" style="margin-top:6px"><button class="big" data-bestok="1">Equip these</button></div><div class="row"><button class="ghost" data-popx="1">Leave them</button></div></div>`;
  $('popIn').innerHTML=pop;$('pop').hidden=false;$('pop').scrollTop=0}
const DOLL={helm:'2/1',amulet:'3/1',weapon:'1/2',armor:'2/2',ring:'3/2',gloves:'1/3',belt:'2/3',boots:'2/4'};
function itemLines(it){let h='';
  if(it.dmin)h+=`<div class="ln">Damage: ${it.dmin} to ${it.dmax}</div><div class="ln">${it.spd>0?'Fast':it.spd<0?'Slow':'Normal'} attack speed</div>`;
  if(it.arm)h+=`<div class="ln">Armor: ${it.arm}</div>`;if(it.cap)h+=`<div class="ln">Holds ${it.cap} stims</div>`;
  h+=`<div class="ln${G.lvl<it.req?' red':''}">Required Level: ${it.req}</div>`;
  if(it.fam){const F=FAM[it.fam],mine=F.cls===G.cls;h+=`<div class="ln" style="color:${mine?'#7be495':'var(--dim)'}">${CLS[F.cls].n} ${F.n.toLowerCase()}${it.id?': in a '+CLS[F.cls].n+'’s hands, +1 to all skills, '+F.perk+(mine?'':' (not your class)'):''}</div>`}
  if(it.dt&&it.id)h+=`<div class="ln" style="color:${DTY[it.dt].c}">Infused: your attacks deal ${DTY[it.dt].n} damage</div>`;
  if(it.soc)h+=`<div class="ln" style="color:#f7931a">Sockets: ${Array.from({length:it.soc},(_,i)=>it.words[i]?'['+it.words[i]+']':'[ empty ]').join(' ')}</div>`;
  if(!it.id)return h+`<div class="ln red">Unidentified</div><div class="ln off">Its magic properties are hidden. ${G.marrow?'Marrow identifies items for free.':'Brenda appraises items for a fee, under Trade.'}</div>`;
  for(const a of it.aff)h+=`<div class="ln mod"${a.w?' style="color:#f7931a"':''}>${AFK[a.k].t.replace('{v}',a.v)}${a.w?' · '+a.w:''}</div>`;
  if(it.spT)h+=`<div class="ln spc"${uOk(it)?'':' style="opacity:.5"'}>${esc(it.spT)}${uOk(it)?'':' (dormant: not your class)'}</div>`;
  if(it.set){const s=SETS[it.set],n=S.set&&S.set[it.set]||0;h+=`<div class="ln setl" style="margin-top:4px">${esc(s.n)}</div>`+s.items.map(x=>`<div class="ln ${Object.values(G.eq).some(e=>e&&e.uid===x.id)?'setl':'off'}">${esc(x.n)}</div>`).join('')+`<div class="ln ${n>=2?'setl':'off'}">${s.b2}</div><div class="ln ${n>=3?'setl':'off'}">${s.b3}</div>`}
  if(it.fl)h+=`<div class="fl">${esc(it.fl)}</div>`;return h}
function statsWith(slot,it){const o=G.eq[slot],hp=G.hp,en=G.en,st=G.stims,S0=S;G.eq[slot]=it;calc();const r=S;G.eq[slot]=o;S=S0;G.hp=hp;G.en=en;G.stims=st;return r}
const DROWS=[['Damage',s=>Math.round(((s.dmin+s.dmax)/2*(1+s.dmg/100)+s.shock)*10)/10,''],['Armor',s=>s.armor,''],['Life',s=>s.maxHp,''],['Energy',s=>s.maxEn,''],['Deadly strike',s=>s.crit,'%'],['Attack speed',s=>s.aspd,'%'],['Run speed',s=>s.mspd,'%'],['Life steal',s=>s.leech,'%'],['Stun chance',s=>s.stun,'%'],['Magic find',s=>s.mf,'%'],['Extra credits',s=>s.gold,'%'],['Skill levels',s=>s.skills,''],['Stim capacity',s=>s.cap,'']];
function deltaHTML(slot,it,title){const A=S,B=statsWith(slot,it);let h='';
  for(const[n,f,u]of DROWS){const a=f(A),b=f(B),d=Math.round((b-a)*10)/10;if(!d)continue;const p=a?' , '+(d>0?'+':'')+Math.round(d/a*100)+'%':'';h+=`<tr><td>${n}</td><td>${a}${u}</td><td>→ ${b}${u}</td><td class="${d>0?'up':'dn'}">${d>0?'+':''}${d}${u}${p.replace(' , ',' · ')}</td></tr>`}
  const sa=Object.keys(A.sp).join(),sb=Object.keys(B.sp).join();if(sa!==sb)h+=`<tr><td colspan="4" class="spc">Special properties change</td></tr>`;
  return `<div class="cmp"><div class="ln off">${title}</div>${h?`<table class="dt">${h}</table>`:'<div class="ln off">No change to your stats.</div>'}</div>`}
function itemCard(it,btns,worn,nocmp){const eq=G.eq[it.slot];let cmp='';
  if(it.id&&!nocmp){if(worn)cmp=deltaHTML(it.slot,null,'If you take this off');else cmp=deltaHTML(it.slot,it,eq?'If you swap this for <span class="q'+eq.q+'">'+esc(eq.name)+'</span>':'If you equip this')}
  return `<div class="card"><div class="nm q${it.q}">${esc(it.id?it.name:it.base)}</div><div class="ln off">${QN[it.q]} ${it.id&&it.name!==it.base?esc(it.base):SNAME[it.slot]} · item level ${it.il}</div>${itemLines(it)}${cmp}<div class="row" style="margin-top:6px">${btns}</div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
const MSL=['weapon','helm','armor'];const mScore=it=>it?(it.dmin?(it.dmin+it.dmax)/2:it.arm||0):0;
function mercBest(){let n=0;const m=G.merc;for(const sl of MSL){let b=-1,bs=mScore(m[sl]);G.bag.forEach((it,i)=>{if(it.slot===sl&&it.id&&!it.junk&&mScore(it)>bs&&!(itemDelta(it)>.01)){bs=mScore(it);b=i}});if(b>=0){const it=G.bag[b],old=m[sl];m[sl]=it;G.bag.splice(b,1);if(old)G.bag.push(old);n++}}return n}
const pkRow=()=>`<h3>Pick up on your own</h3><div class="row">${['Normal','Magic','Rare','Set','Unique'].map((n,q)=>`<button class="ghost q${q}" data-opt="pk${q}" style="padding:10px 2px;font-size:10px;${OPT['pk'+q]===false?'opacity:.35;text-decoration:line-through':''}">${n}</button>`).join('')}</div><button class="tog${OPT.pkBetter?' on':''}" data-opt="pkBetter"><span>Only pick up gear better than what I am wearing</span><i>${OPT.pkBetter?'ON':'OFF'}</i></button><p class="hint" style="font-size:13px">Struck-out tiers stay on the ground, named or not. Better-only leaves identified gear that is not an upgrade, and still picks up unidentified gear, which it cannot judge. Subscriptions are picked up anyway. Stand on a left piece and use the action button to take it. A piece for an empty slot is always picked up.</p>`;
const selling=()=>sheetCtx.only&&(sheetCtx.only.includes('shop')||sheetCtx.only.includes('gamble'))&&!sheetCtx.only.includes('sats');
function drawSheet(){
  const only=sheetCtx.only||(mpOn()?['char','items','skills','web','party','quests','story','codex','opts']:['char','items','skills','web','quests','story','codex','opts']);let pop='';$('pop').hidden=true;
  const sheetFit=tab==='char'||tab==='items'||tab==='skills'||tab==='quests'||tab==='opts';
  let h=`<div class="shead">${only.map(t=>`<button class="tab${tab===t?' on':''}" data-tab="${t}">${TABS[t]}${t==='skills'&&G&&G.sp?' •':t==='char'&&G&&G.ap?' •':t==='story'&&sdxUnseen()?' •':''}</button>`).join('')}<button class="tab x" data-close="1">Close</button></div><div class="sheetBody${sheetFit?' fit':' canScroll'}">`;
  if(tab==='load'){h+=`<h2>Load a save code</h2><p>Paste a code copied from the Options tab. This replaces the saved wanderer on this device.</p><textarea id="codeIn" placeholder="Paste here"></textarea><button class="big" data-loadcode="1">Load</button></div>`;$('sheetIn').innerHTML=h;return}
  calc();
  if(tab==='char'){const c=CLS[G.cls];
    h+=`<h2>${c.n} · Level ${G.lvl}</h2><p>${G.lvl>=lvlCap()?(G.act5?'You have reached the level limit.':'Level limit reached. It rises when you enter the next act.'):Math.floor(G.xp)+' / '+xpNext(G.lvl)+' experience.'} ${G.kills} machines scrapped. Simulator best: wave ${G.simBest||0}.</p><h3>Attributes · ${G.ap} point${G.ap===1?'':'s'} to spend</h3><div class="list">`;
    for(const k in ATTR)h+=`<button class="li" data-at="${k}" ${G.ap?'':'disabled'}><div><b>${ATTR[k][0]} · ${G.at[k]}</b><span>${ATTR[k][1]}</span></div><span class="pr">${G.ap?'+ ADD':''}</span></button>`;
    h+=`</div>`;if(G.merc){const m=G.merc,ms=mercStats();h+=`<h3>Companion</h3><div class="li"><div><b>${esc(m.name)} · ${MERCS[m.k].n}${m.dead?' · fallen':''}</b><span>${m.dead?'Kestrel can bring them back for a fee.':'Life '+Math.round(m.hp||ms.max)+' / '+ms.max+' · damage '+Math.round(ms.dmg)+' · takes '+Math.round(ms.red*100)+'% of each hit'}</span><span>Give them a weapon or armor from the Items tab.</span></div></div><div class="grid eq">${['weapon','armor'].map(sl=>m[sl]?`<button class="cell q${m[sl].q}" data-mtake="${sl}">${svgIcon(sl)}<small>${m[sl].il}</small><u style="color:var(--dim)">TAKE</u></button>`:`<button class="cell empty" disabled>${svgIcon(sl)}</button>`).join('')}</div>`}
    h+=`<h3>This quarter</h3><div class="list"><div class="li on"><div><b>${SEA.n}</b><span>${SEA.d} The rule changes each week.</span></div></div>${G.act3?`<div class="li"><div><b>Tenure ${G.para||0}</b><span>The first costs half a level.</span><span>Each one after costs seven percent of that half more than the last.</span><span>+1% damage and life, one web point, and the machines strengthen a little.</span></div></div>`:''}${G.debt>0?`<div class="li"><div><b>Debt to Mr. Float · ${fmt(G.debt)}</b><span>About ${Math.round(G.debt/G.cpi/(G.debt0/G.debtCpi)*100)}% of what you borrowed, in real terms.</span></div></div>`:''}</div>`;
    h+=`<h3>Allegiances</h3><div class="list essay"><div class="li${scs()<500?' on':''}"><div><b>Social credit · ${scs()} · ${scsWord()}</b><span>Unity scores what you say. Fiat answers and collecting the Stipend raise it; bitcoiner answers lower it a little, and insults lower it a lot. Below 500 Brenda will not serve you, the Stipend is halved and Mr. Float charges 35%. Below 350 he will not lend at all, and below 300 the Stipend stops. Bitcoiners answer in kind: below 500 Nonce sells at a quarter off and stocks Brenda’s goods at cost, Kestrel revives for nothing, and nodes are lit for free.</span></div></div><div class="li"><div><b>How people read you · ${leanWord()}</b><span>What you say about money in conversation moves this. People greet you by it. Mr. Float overcharges plain bitcoiners, and Nonce overcharges the plainly fiat-minded.</span></div></div>`;for(const f in REP){const r=repRank(f),R=REP[f],nx=REPT[r];h+=`<div class="li"><div><b>${R.n} · ${r?R.ranks[r-1]:'Unknown to them'}</b><span>${R.how} ${G.rep[f]} standing${nx?', '+nx+' for '+R.ranks[r]+' — '+R.perks[r]:''}.</span></div></div>`}
    h+=`<div class="li on"><div><b>Bitcoin adoption · ${Math.floor(G.adopt)}%</b><span>${fateWord()}. ${G.camp?'Unity’s campaign “'+CAMPS[G.camp.k].n+'” is draining it: '+CAMPS[G.camp.k].d+' ':''}${G.adopt>=100?'Bitcoin is the world’s reserve currency. Prices have stopped rising.':'It rises when you light nodes, pay in sats, prove work, win people over in conversation and bring down executives. It falls when you sell sats, borrow, buy shitcoins, insult people or take MANDATE’s offers. Where it stands when MANDATE falls decides how the money story ends: 60% or more and bitcoin becomes the reserve, under 25% and it fails.'}</span></div></div></div>`;
    h+=`<h3>Resistances</h3><div class="stats">${DTK.map(k=>`<div style="color:${DTY[k].c}">${DTY[k].n}<b>${resOf(k)}%</b></div>`).join('')}</div><p style="font-size:13px">Each cuts that type of damage before armor does, up to 75%. Armor, helms, boots, belts, rings and amulets can carry them.</p>`;
    h+=`<h3>Standing</h3><div class="stats"><div>Damage<b>${Math.round(S.dmin*(1+S.dmg/100))}–${Math.round(S.dmax*(1+S.dmg/100))}</b></div><div>Armor<b>${S.armor}</b></div><div>Life<b>${S.maxHp}</b></div><div>Energy<b>${S.maxEn}</b></div><div>Deadly strike<b>${S.crit}%</b></div><div>Attack speed<b>${S.aspd>=0?'+':''}${S.aspd}%</b></div><div>Run speed<b>+${S.mspd}%</b></div><div>Life steal<b>${S.leech}%</b></div><div>Magic find<b>${S.mf}%</b></div><div>Extra credits<b>${S.gold}%</b></div><div>Shock damage<b>${S.shock}</b></div><div>Damage blocked<b>${Math.round(100-10000/(100+S.armor))}%</b></div></div>`}
  if(tab==='items'){
    const ds=G.bag.map(itemDelta),ups=new Set(G.bag.filter((it,i)=>ds[i]>.01&&G.lvl>=it.req).map(it=>it.slot)).size,downs=ds.filter((d,i)=>d!==null&&d<-.01&&!G.bag[i].junk).length;
    h+=`<div class="dollw" style="${selling()?'order:50':''}"><div class="doll"><svg class="fig" viewBox="0 0 60 120"><circle cx="30" cy="14" r="10"/><path d="M14 30h32l8 40h-9l-3-22v26l4 44H34l-4-36-4 36H14l4-44V48l-3 22H6z"/></svg>${SLOTS.map(sl=>`<div style="grid-area:${DOLL[sl].split('/')[1]}/${DOLL[sl].split('/')[0]}">${cell(G.eq[sl],`data-eq="${sl}"`,sel&&sel.eq===sl,sl)}</div>`).join('')}</div>
      <div class="dstat"><div>Damage<b>${Math.round(S.dmin*(1+S.dmg/100)+S.shock)}–${Math.round(S.dmax*(1+S.dmg/100)+S.shock)}</b></div><div>Armor<b>${S.armor}</b></div><div>Life<b>${S.maxHp}</b></div><div>Energy<b>${S.maxEn}</b></div><div>Deadly strike<b>${S.crit}%</b></div><div>Credits<b>${fmt(G.credits)}</b></div></div></div>`;
    h+=`<div class="row"><button class="${ups?'big':'ghost'}" data-best="1" ${ups?'':'disabled'}>${ups?'Equip best · '+ups+' upgrade'+(ups>1?'s':''):'Nothing better in pack'}</button><button class="ghost" data-markjunk="1" ${downs?'':'disabled'}>Mark ${downs||''} weaker as junk</button></div><button class="tog${OPT.autoEq?' on':''}" data-opt="autoEq"><span>Equip stronger gear as you pick it up</span><i>${OPT.autoEq?'ON':'OFF'}</i></button>`;if(!selling())h+=pkRow();
    if(G.merc&&!G.merc.dead&&!selling()){const m=G.merc,ms=mercStats();h+=`<h3>${esc(m.name)} · ${MERCS[m.k].n}</h3><div class="dollw"><div class="grid eq" style="grid-template-columns:repeat(3,1fr);flex:0 0 46%">${MSL.map(sl=>cell(m[sl],`data-msel="${sl}"`,sel&&sel.m===sl,sl)).join('')}</div><div class="dstat"><div>Life<b>${ms.max}</b></div><div>Damage<b>${Math.round(ms.dmg)}</b></div><div>Takes<b>${Math.round(ms.red*100)}%</b></div></div></div><div class="row"><button class="ghost" data-mbest="1">Give them the best of what I am not using</button></div><p class="hint" style="font-size:13px">Tap one of their pieces to take it back. Tap a weapon, helm or armor in your pack and choose Give to hand it over; whatever they were holding comes back to you.</p>`}
    h+=`<h3>Pack ${G.bag.length}/24 · ${G.parts||0} parts</h3><div class="grid" id="bagGrid">${Array.from({length:24},(_,i)=>cell(G.bag[i],`data-bag="${i}"`,sel&&sel.bag===i,null,ds[i])).join('')}</div>`;
    h+=`<p style="font-size:13.5px"><span class="up">Glowing</span> items make you stronger, faded ones make you weaker. Tap to inspect, <strong>double-tap to equip</strong>, <strong>hold to ${selling()?'sell':'mark as junk'}</strong>.</p>`;
    {const cs=G.charms,on=chOn();h+=`<h3 style="order:60">Subscriptions ${cs.length}/12 · ${on}/6 running${on?' · billing '+fmt(chBill())+' a minute':''}${G.charmOff?' · LAPSED':''}</h3><div class="grid" style="order:60">${Array.from({length:12},(_,i)=>cs[i]?cell(cs[i],`data-ch="${i}" style="${cs[i].on?'':'opacity:.4'}"`,sel&&sel.ch===i):`<button class="cell empty" disabled>${svgIcon('charm')}</button>`).join('')}</div><p class="hint" style="font-size:13px;order:60">Subscriptions sit here, apart from your gear. Tap one to run or pause it; faded ones are paused and cost nothing. ${G.charmOff?'<strong>You could not cover the last bill, so none are working until the next one is paid.</strong>':''}</p>`}
    const it=sel&&(sel.ch!==undefined?G.charms[sel.ch]:sel.m?G.merc&&G.merc[sel.m]:sel.eq?G.eq[sel.eq]:G.bag[sel.bag]);
    if(it&&sel.sock){const own=WK.filter(w=>G.words[w]);pop=`<div class="card"><div class="nm" style="color:#f7931a">Socket a word</div><div class="ln off">${esc(it.name)} · ${it.soc-it.words.length} empty. A word cannot be removed once set. Phrases need the right words in the right order: see the Codex.</div><div class="list">${own.length?own.map(w=>`<button class="li" data-word="${w}"><div><b>${w} ×${G.words[w]}</b><span>${AFK[WORDS[w][0]].t.replace('{v}',WORDS[w][1])}</span></div></button>`).join(''):'<div class="ln off">You hold no words. They turn up on torn notes dropped by machines.</div>'}</div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
    else 
    if(it){let b='';if(sel.ch!==undefined){b=`<button class="big" data-chdo="tog" ${!it.on&&chOn()>=6?'disabled':''}>${it.on?'Pause it':chOn()>=6?'Six already running':'Run it'}</button>`+(selling()?`<button class="ghost" data-chdo="sell">Sell ${fmt(sellValue(it))}</button>`:`<button class="ghost" data-chdo="drop">Drop</button>`)+`<button class="ghost" data-chdo="scrap">Scrap · 2 parts</button>`}else if(sel.m){b=`<button class="big" data-mtake="${sel.m}">Take it back</button>`}else if(sel.eq){b=`<button class="ghost" data-do="unequip">Take off</button>`;if(it.soc&&it.words.length<it.soc)b+=`<button class="ghost" data-do="sock">Socket a word</button>`}else{b=`<button class="big" data-do="equip" ${it.id&&G.lvl>=it.req?'':'disabled'}>Equip</button>`;b+=selling()?`<button class="ghost" data-do="sell">Sell ${fmt(sellValue(it))}</button>`:`<button class="ghost" data-do="drop">Drop</button>`;b+=`<button class="ghost" data-do="junk">${it.junk?'Not junk':'Junk'}</button>`;if(it.soc&&it.id&&it.words.length<it.soc)b+=`<button class="ghost" data-do="sock">Socket a word</button>`;if(it.id&&!it.charm){b+=`<button class="ghost" data-do="scrap">Scrap · ${[1,2,4,8,15][it.q]||1} parts</button>`;if(it.aff.length)b+=`<button class="ghost" data-do="reroll" ${(G.parts||0)<rerollCost(it)?'disabled':''}>Reroll a modifier · ${rerollCost(it)} parts</button>`;if(canSoc(it))b+=`<button class="ghost" data-do="addsoc" ${(G.parts||0)<12?'disabled':''}>Cut a socket · 12 parts</button>`}if(G.merc&&!G.merc.dead&&it.id&&MSL.includes(it.slot))b+=`<button class="ghost" data-do="mgive">Give to ${esc(G.merc.name)}</button>`}pop=itemCard(it,b,!!sel.eq,!!sel.m||sel.ch!==undefined)}
    const jn=G.bag.filter(i=>i.junk).length;
    if(!selling()&&jn)h+=`<button class="ghost" data-dropjunk="1">Drop ${jn} junk item${jn>1?'s':''}</button>`;
    if(selling()&&G.bag.length){const sum=q=>G.bag.filter(i=>!i.charm&&(q<0||i.q===q)).reduce((a,i)=>a+sellValue(i),0),cnt=q=>G.bag.filter(i=>!i.charm&&i.q===q).length;h+=`<h3>Sell in bulk</h3>`;
      if(jn)h+=`<button class="big" data-sellq="9">Sell ${jn} junk · ${fmt(G.bag.filter(i=>i.junk).reduce((a,i)=>a+sellValue(i),0))}</button>`;h+=`<div class="row">`;
      ['Normal','Magic','Rare','Set','Unique'].forEach((n,q)=>{if(cnt(q))h+=`<button class="ghost q${q}" data-sellq="${q}">${cnt(q)} ${n}<br>${fmt(sum(q))}</button>`});
      h+=`</div><button class="ghost" data-sellq="-1">${sellArm?'Tap again to sell all '+G.bag.filter(i=>!i.charm).length+' items':'Sell everything in the pack · '+fmt(sum(-1))}</button><p style="font-size:13px">Bulk selling never touches what you are wearing or the subscriptions working from your pack.</p>`}
    h+=`<p class="hint" style="font-size:13.5px">White is normal, <span class="q1">blue is magic</span>, <span class="q2">yellow is rare</span>, <span class="q3">green is a set piece</span>, <span class="q4">gold is unique</span>. Red items are unidentified.</p>`}
  if(tab==='skills'){const c=CLS[G.cls];h+=`<h2>${c.n} skills · ${G.sp} to spend</h2><p class="hint">${G.sp} point${G.sp===1?'':'s'} to spend. Rows open at levels 1, 4 and 9, and each skill needs the one above it. The fourth row opens at level 26 in Act II, the fifth at level 51 in Act III.</p><p class="hint"><strong>Passives active: ${G.pas.length} of ${PCAP()}.</strong> Only the passives you switch on do anything, so choose. A third slot opens in Act II, a fourth in Act III, and a fifth in Act V. Swap them freely in town.</p><p><strong>Passives ${G.pas.length}/${PCAP()}</strong></p><p>A third slot in Act II, a fourth in Act III, a fifth in Act V.</p>`;h+=`<h3>Doctrine${G.doc?'':' · choose one'}</h3><div class="list">${DOCS[G.cls].map(d=>`<button class="li${G.doc===d[0]?' on':''}" data-doc="${d[0]}"><div><b>${G.doc===d[0]?'◆ ':''}${d[1]}</b><span>${d[2]}</span><span>${docTxt(d[3])}</span></div></button>`).join('')}</div><p style="font-size:13px">One doctrine at a time. The first is free; changing costs 3 sats, in town.</p><h3>Breadth</h3><p class="hint" style="font-size:13px">Learn all three skills in a row for its bonus: ${ROWB.map((r,k)=>`<span style="color:${rowDone(k)?'var(--gold)':'var(--dim)'}">${rowDone(k)?'✓ ':''}${r[0]} ${r[1]}</span>`).join(' · ')}. <strong>Depth costs more:</strong> ranks 6 to 10 take two points each, and rank 10 masters a skill (★): two extra ranks of power, and 20% faster recovery on active skills.</p><div class="tree">`;
    c.sk.forEach((s,i)=>{const row=Math.floor(i/3),L=G.sk[i],lock=G.lvl<ROWREQ[row]||(row>0&&!G.sk[i-3])||(row===3&&!G.act2)||(row===4&&!G.act3)||!!hsBlocked(i),slot=G.slots.indexOf(i);
      h+=`<button class="node${L?' has':''}${lock?' lock':''}${s.a?'':' pas'}${sel&&sel.sk===i?' sel':''}${slot>=0?' slot':''}" data-node="${i}" data-slot="${slot+1}"><canvas class="gl" width="24" height="24" data-gl="${i}"></canvas><b>${L>=10?'★ ':''}${!s.a&&G.pas.includes(i)?'◆ ':''}${s.n}</b><u>${L}${S.skills&&L?'+'+S.skills:''} / 10${!s.a&&L&&!G.pas.includes(i)?' · off':''}</u></button>`});
    h+=`</div>`;
    const h0=h.length;
    if(sel&&sel.sk!==undefined){const i=sel.sk,s=c.sk[i],row=Math.floor(i/3),L=G.sk[i],eff=L?L+(S.skills||0):0,can=G.sp>=skCost(i)&&L<10&&G.lvl>=ROWREQ[row]&&(row===0||G.sk[i-3]>0)&&(row<3||G.act2)&&(row<4||G.act3);
      h+=`<div class="card" style="text-align:left"><canvas class="gl" width="40" height="40" data-gl="${i}"></canvas><div class="nm q4">${s.n}</div><div class="ln" style="color:${s.a?DTY[skType(G.cls,i)].c:'var(--dim)'}">${s.a?DTY[skType(G.cls,i)].n+' damage':''}</div><div class="ln off">${s.a?'Active · '+s.cost+' energy · '+s.cd+'s recovery':'Passive'}${row?' · needs level '+ROWREQ[row]+' and '+c.sk[i-3].n:''}</div>`;
      if(L)h+=`<div class="ln">Now: ${s.d(eff)}</div>`;if(L<10)h+=`<div class="ln mod">Next point: ${s.d((eff||0)+1)}</div>`;
      if(row&&s.a&&SKF[G.cls]&&SKF[G.cls][i]&&/\*m\b|\bm\*=/.test(SKF[G.cls][i].toString()))h+=`<div class="ln off">${c.sk[i-3].n} adds +6% per point where this skill scales with it (now +${G.sk[i-3]*6}%).</div>`;
      h+=`<div class="row" style="margin-top:6px"><button class="big" data-learn="${i}" ${can?'':'disabled'}>${L>=10?'Mastered':skCost(i)>1?'Spend 2 points':'Spend a point'}</button></div>`;
      if(!s.a&&L){const on=G.pas.includes(i),tw=W.z.town;h+=`<div class="row"><button class="ghost" data-pas="${i}" ${!tw||(!on&&G.pas.length>=PCAP())?'disabled':''}>${on?'Switch off':'Switch on'}</button></div>`+(!tw?`<div class="ln off">Passives can only be swapped in town.</div>`:!on&&G.pas.length>=PCAP()?`<div class="ln off">All ${PCAP()} passive slots are in use. Switch one off first.</div>`:'')}
      if(s.a&&L){const cur=(G.fork||{})[i];h+=`<div class="ln off" style="margin-top:6px">Fork${L<3?' · opens at 3 points':': one at a time, free to change in town'}</div>`;if(L>=3)h+=`<div class="list">${forkSet(G.cls,i).map(k=>`<button class="li${cur===k?' on':''}" data-fork="${k}" ${W.z.town?'':'disabled'}><div><b>${cur===k?'◆ ':''}${FORKS[k].n} ${s.n}</b><span>${FORKS[k].d}</span></div></button>`).join('')}</div>`}
      if(s.a&&L)h+=`<div class="row">${[0,1,2].map(k=>`<button class="ghost" data-assign="${k}">Button ${k+1}${G.slots[k]===i?' ✓':''}</button>`).join('')}</div>`;
      h+=`<div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`;pop=h.slice(h0);h=h.slice(0,h0)}h+=`<p>Tap a skill to read it. Blue names are passive; ◆ marks the ones switched on. A numbered badge shows which button a skill is on.</p>`}
  if(tab==='web'){G.web=G.web||{};const n=sel&&sel.web?webNode(sel.web):null;h+=`<h2>The ledger web</h2><p><strong>${webPts()} point${webPts()===1?'':'s'}</strong> to place. Each level you gain adds one, and each Tenure adds one. You start with none. Start at the centre and work outward along connected nodes; the arms join at rings 3, 6 and 9. Once an arm is started, a <b style="color:#59e0e6">+</b> appears beside its first node — tap that to put the next point straight onto the end of that arm without hunting for it. The orange node at the end of each arm is a keystone: a large gain with a real cost. <strong>Arms across from each other oppose:</strong> of each facing pair (Might and Current, Flesh and Stride, Plate and Fortune, Nerve and Thirst), the arm with fewer points pays out half.</p>`+webSvg();
    h+=n?`<div class="card" style="text-align:left"><div class="nm q${n.key?4:n.big?3:2}">${n.n}</div><div class="ln mod">${n.id==='c'?'Where every path starts.':modTxt(n.m)}</div>${n.a>=0&&!n.key&&webWeak(n.a)?`<div class="ln red">Halved: ${WARMS[(n.a+4)%8][0]}, across the web, has more of your points.</div>`:''}<div class="row"><button class="big" data-weball="1" ${n.id!=='c'&&webCan(n.id)?'':'disabled'}>${G.web[n.id]||n.id==='c'?'Placed':webCan(n.id)?'Place a point':'Not connected yet'}</button></div></div>`:`<p>Drag to move around the web. Tap a node to read it.</p>`;
    h+=`<button class="ghost" data-webreset="1" ${G.sats<5||!Object.keys(G.web).length?'disabled':''}>Take every point back · 5 sats</button>`}
  if(tab==='quests'){h+=`<h2>Quests</h2><p>Five acts: the Regional Office, the Cloud, the Board, the Gentle Years and the Awakening. The first three are MANDATE's. The last two are hers, and then the thing that was hunting them both. The Story tab keeps who is who.</p><div class="list">`;
    const sy=storyStep();h+=`<p>Next in the story: <strong>${esc(sy.d)}</strong>. This always stays on screen, with one errand beside it. Tap an errand below to choose which.</p>`;const tk=(id,live)=>live?` data-track="${id}"`:'',tm=id=>G.track===id?'◆ ':'';
    for(const k in QUESTS){const q=QUESTS[k],st=G.q[k];if(!st)continue;h+=`<div class="li${st<3?' on':''}"><div><b>${q.n}${st===3?' · done':st===2?' · return to '+q.back:''}</b><span>${q.d}</span><span>Reward: ${q.rw}. Given by ${q.by}.</span></div></div>`}
    if(!Object.values(G.q).some(v=>v))h+=`<p>Speak to Gramps in Stillwater Commons.</p>`;h+=`</div><h3>Errands</h3><div class="list">`;let any=false;
    for(const k in SQ){const q=SQ[k],s=G.sq[k];if(!s){if(sqOpen(k)){any=true;h+=`<div class="li"><div><b>${q.who} has something to ask</b><span>Speak to ${q.who} in Stillwater.</span></div></div>`}continue}any=true;const st=q.steps[s.s];
      h+=`<div class="li${s.done?'':' on'}"${tk('s:'+k,!s.done)}><div><b>${tm('s:'+k)}${q.n}${s.done?' · done':' · step '+(s.s+1)+' of '+q.steps.length}</b><span>${s.done?'Finished.':st.d+(st.n?' ('+s.c+'/'+st.n+')':'')}</span><span>Reward: ${q.rw}.</span></div></div>`}
    if(!any)h+=`<p>The people of Stillwater will have errands for you as you go further.</p>`;h+=`</div>`}
  if(tab==='story'){const seen=G.sdx||{};
    h+=`<h2>The story so far</h2><p>Everything here is something your character would know or has been told. It fills in as you go. If a person or a machine has stopped making sense, it is in here.</p>`;
    for(const g of STORYDEX){h+=`<h3>${g.n}</h3>`;if(g.d)h+=`<p>${g.d}</p>`;h+=`<div class="list">`;
      for(const e of g.e){let ok=0;try{ok=e.w()}catch(_){}
        if(ok)h+=`<div class="memo${seen[e.k]?'':' sdxnew'}"><b>${esc(e.n)}${seen[e.k]?'':' · new'}</b><p>${esc(e.d)}</p></div>`;
        else h+=`<div class="memo sdxlock"><b>${esc(e.n)}</b><p>Not yet.${e.l?' '+esc(e.l):''}</p></div>`}
      h+=`</div>`}
    sdxSeen()}
  if(tab==='party')h+=mpPanel();
  if(tab==='codex'){const mf=Math.round(mfNow());
    h+=`<h2>Drop rates</h2><p>Every kill makes a number of rolls. Each roll lands on nothing, credits, an item or a stim. An item then tests for quality in order: unique, set, rare, magic. Odds below include your <strong>${mf}% magic find</strong>, which helps less and less on the rarer tiers.</p><div class="tw"><table><tr><th>Source</th><th>Rolls</th><th>None</th><th>₡</th><th>Item</th><th>Stim</th><th>Magic</th><th>Rare</th><th>Set</th><th>Unique</th></tr>`;
    for(const k in TC){const t=TC[k],sum=t.no+t.gold+t.item+t.stim,c=qChance(k,mf),p=v=>Math.round(v/sum*100)+'%',o=v=>v>=1?'always':'1 in '+Math.round(1/v);
      h+=`<tr><td>${t.n}</td><td>${t.picks}</td><td>${p(t.no)}</td><td>${p(t.gold)}</td><td>${p(t.item)}</td><td>${p(t.stim)}</td><td class="q1">${o(c.m)}</td><td class="q2">${o(c.r)}</td><td class="q3">${o(c.s)}</td><td class="q4">${o(c.u)}</td></tr>`}
    h+=`</table></div><p><strong style="color:#f7931a">Satoshis</strong> drop on their own roll: 3% from ordinary machines (1–2), 35% from champions (3–6), always from lieutenants (8–12), from executives other than Vale (21), and from Vale (42), and 30% from a lockbox you open in a district (2–5). Nonce in Stillwater sells rare, set and unique gear for them.</p><p>${Object.values(TC).filter(t=>t.note).map(t=>t.n+': '+t.note.toLowerCase()).join('. ')}. Items drop at the machine’s level or up to two above. Exit Interview drops only from Pryce.</p>`;
    h+=`<h2>Damage types</h2><p>Every hit has a type. Your plain attacks are ${DTY[baseType()].n} right now (an infused weapon changes that); each skill names its own. Machines are built of different things, so some types tear through them and some do nothing. They hit you with types of their own: Surge drains your energy, Rust keeps eating for three seconds, Noise slows you, and explosions are Heat. Champions with the Arc or Volatile modifier deal Surge or Heat whatever they are. Your resistances are on the Hero tab.</p><div class="list">${DTK.map(k=>`<div class="li"><div><b style="color:${DTY[k].c}">${DTY[k].n}</b><span>${DTY[k].d}</span></div></div>`).join('')}</div><div class="tw"><table><tr><th>Machine</th><th>Deals</th><th style="text-align:left">What breaks it, and what does not</th></tr>${Object.keys(RES).map(k=>`<tr><td>${ET[k].n}</td><td style="color:${DTY[ETY[k]||'impact'].c}">${dealTxt(k)}</td><td style="text-align:left">${resTxt(k)}</td></tr>`).join('')}</table></div>`;
    h+=`<h2>Class weapons</h2><p>About four weapons in ten belong to a family made for one class. Anyone can swing them, but only their own class gets the bonus.</p><div class="list">${Object.keys(FAM).map(k=>`<div class="li${FAM[k].cls===G.cls?' on':''}"><div><b>${FAM[k].n}s · ${CLS[FAM[k].cls].n}</b><span>${FAM[k].bases.join(', ')}</span><span>+1 to all skills, ${FAM[k].perk}. ${FAM[k].dm>1?'Hits harder, swings slower.':FAM[k].sp>0?'Lighter hits, faster hands.':'Lighter hits.'}</span></div></div>`).join('')}</div>`;
    h+=`<h2>Money</h2><p>Unity creates credits without limit, so every price in credits climbs: ${G.cpi<100?'×'+G.cpi.toFixed(2):'×'+fmt(G.cpi).slice(1)} since you arrived. The Stipend has not moved. Satoshis cannot be created by anyone, so prices in sats stay roughly where they were. Credits are for spending today. What you want to still have tomorrow is a different question, and Nonce in Stillwater will exchange one for the other. Adoption stands at ${Math.floor(G.adopt)}%; at 100% prices stop rising altogether.</p>`;
    h+=`<h2>Seed words</h2><p>Torn notes, one word each. White and some blue weapons, helms and armor have sockets; a word set in a socket gives its bonus for good. Fill every socket with the right words in the right order and the item becomes a phrase. Find all twelve and speak to Nonce. The notes do not have to still be in your pack.</p><div class="tw"><table><tr><th>Word</th><th>Held</th><th>Bonus</th></tr>${WK.map(w=>`<tr><td style="color:${G.st.wf[w]?'#f7931a':'var(--dim)'}">${G.st.wf[w]?w:'· · ·'}</td><td>${G.words[w]||0}</td><td style="text-align:left">${G.st.wf[w]?AFK[WORDS[w][0]].t.replace('{v}',WORDS[w][1]):'not yet found'}</td></tr>`).join('')}</table></div>
      <div class="list">${PHRASES.map(p=>`<div class="li"><div><b style="color:#f7931a">${p.n} · ${SNAME[p.slot]} with ${p.w.length} sockets</b><span>${p.w.join(' → ')}</span><span>${Object.keys(p.mods).map(k=>AFK[k].t.replace('{v}',p.mods[k])).join(' · ')}</span></div></div>`).join('')}</div>`;
    h+=`<h2>Feats · ${Object.keys(G.ach).length}/${ACH.length}</h2><div class="list">${ACH.map(a=>`<div class="li${G.ach[a[0]]?' on':''}"><div><b>${G.ach[a[0]]?'✓ ':''}${a[1]}</b><span>${a[2]}</span></div></div>`).join('')}</div>`;
    h+=`<h2>Memos · ${G.memos.length}/${MEMOS.length}</h2>`;if(!G.memos.length)h+=`<p>Papers lie about the districts. Read them and they are kept here.</p>`;
    for(const i of G.memos)h+=`<div class="memo"><b>${esc(MEMOS[i][0])}</b><p>${esc(MEMOS[i][1])}</p></div>`}
  if(tab==='opts'){h+=`<h2>Options</h2><button class="ghost" data-walk="1">Walkthrough</button><h3>Characters</h3><div class="list">${[0,1,2].slice(0,NSLOT).map(n=>{const i=n===SLOT?{lvl:G.lvl,cls:G.cls,act:heroAct(G),dead:heroDead(G)}:slotInfo(n);return i&&CLS[i.cls]?`<button class="li${n===SLOT?' on':''}" ${n===SLOT?'':`data-swslot="${n}"`}><i style="background:${CLS[i.cls].col}"></i><div><b>${i.dead?'Hardcore · fallen':'Level '+i.lvl+' '+CLS[i.cls].n}${n===SLOT?' · playing now':''}</b><span>Slot ${n+1} · Act ${actRoman(i.act)}${i.dead?' · begins again':n===SLOT?'':' · tap to switch'}</span></div></button>${n===SLOT?'':`<button class="ghost" data-delslot="${n}" style="margin:-4px 0 8px auto;display:block;font-size:10px;padding:5px 10px;min-height:0">Delete slot ${n+1}</button>`}`:`<button class="li" data-newslot="${n}"><div><b>Slot ${n+1} · empty</b><span>Tap to create a new character here</span></div></button>`}).join('')}</div><p class="hint" style="font-size:13.5px">Your current character is saved before you switch. The town lockbox is shared between them.</p>`;h+=`<h3>Difficulty</h3><div class="row">${DIFFS.map((f,i)=>`<button class="${(G.diff||0)===i?'big':'ghost'}" data-diff="${i}">${f.n}</button>`).join('')}</div><p class="hint" style="font-size:13.5px">Hard and Brutal machines have more life and hit harder, and pay more experience to match: every machine’s experience scales with how tough it is. A change applies to machines that spawn from now on.</p><button class="tog${G.hc?' on':''}" data-hc="1"><span>Hardcore: one life. If this hero dies, they are gone and a new wanderer starts from nothing. +25% experience and magic find.</span><i>${G.hc?'ON':'OFF'}</i></button>${pkRow()}<div class="list optg">`;for(const k in OPT_LBL)h+=`<button class="tog${OPT[k]?' on':''}" data-opt="${k}"><span>${OPT_LBL[k]}</span><i>${OPT[k]?'ON':'OFF'}</i></button>`;h+=`<button class="tog${OPT.fx==='thin'?'':' on'}" data-opt="fx"><span>Combat effects. Thin keeps your own telegraphs and marks, and drops particles, extra lights, and other players' casts.</span><i>${OPT.fx==='full'?'Full':OPT.fx==='thin'?'Thin':'Normal'}</i></button>`;
    h+=`</div><h3>Saving</h3><p>${CL?(clState==='err'?'The last save to your account failed and will be retried. A copy is kept in this browser.':'Saved to your account every ten seconds, on every zone change and when you close this menu. Closing the page mid-zone brings you back to the same spot.'):'Account saving is not available in this view. The game saves in this browser every few seconds.'}</p><div class="row"><button class="big" data-save="1">Save now</button><button class="ghost" data-code="1">Copy save code</button></div><textarea id="codeOut" hidden readonly></textarea><button class="ghost" data-title="1">Save and return to title</button>`;
    h+=`<h3>Testing tools</h3><div class="row"><button class="ghost" data-dev="lvl">+1 level</button><button class="ghost" data-dev="cr">+credits</button><button class="ghost" data-dev="loot">Loot pile</button></div><div class="row"><button class="ghost" data-dev="zones">Unlock zones</button><button class="ghost" data-dev="god">Untouchable ${G.god?'ON':'OFF'}</button><button class="ghost" data-dev="reset">Respawn machines</button></div>`}
  if(tab==='shop'){h+=`<h2>Brenda’s</h2><p>“Prices are up ${G.cpi<100?((G.cpi-1)*100).toFixed(0)+'%':'beyond counting'} since you arrived.” You carry <strong>${fmt(G.credits)}</strong>. Sell from the Items tab.</p><div class="list">`;
    const pp=stimPrice(),n=unidCount(),ic=40*G.cpi*n*(G.disc?.85:1);
    h+=`<button class="li" data-buy="stim" ${G.credits<pp||G.stims>=S.cap?'disabled':''}><div><b>Stim</b><span>Restores 45% of your life. You carry ${G.stims} of ${S.cap}.</span></div><span class="pr">${fmt(pp)}</span></button>`;
    if(n&&!G.marrow)h+=`<button class="li" data-buy="id" ${G.credits<ic?'disabled':''}><div><b>Appraise ${n} item${n>1?'s':''}</b><span>Brenda names your unidentified finds.</span></div><span class="pr">${fmt(ic)}</span></button>`;
    shop.forEach((it,i)=>{h+=`<button class="li${sel&&sel.shop===i?' on':''}" data-shop="${i}"><div><b class="q${it.q}">${esc(it.name)}</b><span>${SNAME[it.slot]} · level ${it.il}</span></div><span class="pr">${fmt(buyPrice(it))}</span></button>`});h+=`</div>`;
    if(sel&&sel.shop!==undefined&&shop[sel.shop]){const it=shop[sel.shop];pop=itemCard(it,`<button class="big" data-buy="item" ${G.credits<buyPrice(it)||G.bag.length>=24?'disabled':''}>Buy for ${fmt(buyPrice(it))}</button>`+(satsOk()?`<button class="ghost" data-buy="itemsat" ${G.sats<satCost(it)||G.bag.length>=24?'disabled':''}>or ${satCost(it)} sats</button>`:''))}}
  if(tab==='gamble'){h+=`<h2>Wren’s mystery boxes</h2><p>Sealed at the factory. Posted odds: <span class="q4">unique 1.5%</span>, <span class="q3">set 2%</span>, <span class="q2">rare 15%</span>, the rest <span class="q1">magic</span>. You carry <strong>${fmt(G.credits)}</strong>.</p><div class="grid eq">`;
    for(const s of SLOTS)h+=`<button class="cell" data-box="${s}" ${G.credits<boxPrice()||G.bag.length>=24?'disabled':''}>${svgIcon(s)}</button>`;
    h+=`</div><p>Each box costs <strong>${fmt(boxPrice())}</strong>.</p>`;if(lastBox)h+=itemCard(lastBox,'')}
  if(tab==='bounty'){h+=`<h2>Bounty board</h2><p>Posted by anons, paid on proof. Three contracts at a time; a new one is pinned up when you claim one. You hold <strong style="color:#f7931a">${G.sats} sats</strong>.</p><div class="list">`;
    bounties().forEach((b,i)=>{const dn=b.c>=b.n;h+=`<button class="li${dn?' on':''}" data-claim="${i}" ${dn?'':'disabled'}><div><b>${b.n} × ${ET[b.k].n}</b><span>${ZONES[b.zi].n} · ${b.c}/${b.n}${dn?' · tap to claim':''}</span></div><span class="pr" style="color:#f7931a">${b.sats} sats<br>${fmt(b.cr*G.cpi)}</span></button>`});h+=`</div>`}
  if(tab==='stash'){const real=ACC.cr*G.cpi;h+=`<h2>Your lockbox</h2><p>One lockbox for every wanderer you play. Leave gear, credits or sats here and any of your heroes can take them out, in any slot.</p>
    <h3>Sats · ${ACC.sats} in the box · ${G.sats} on you</h3><div class="row"><button class="ghost" data-acc="si10" ${G.sats<10?'disabled':''}>Deposit 10</button><button class="ghost" data-acc="siall" ${G.sats<1?'disabled':''}>Deposit all</button><button class="ghost" data-acc="so10" ${ACC.sats<10?'disabled':''}>Take 10</button><button class="ghost" data-acc="soall" ${ACC.sats<1?'disabled':''}>Take all</button></div>
    <h3>Credits · ${fmt(real)} in the box · ${fmt(G.credits)} on you</h3><div class="row"><button class="ghost" data-acc="cihalf" ${G.credits<1?'disabled':''}>Deposit half</button><button class="ghost" data-acc="ciall" ${G.credits<1?'disabled':''}>Deposit all</button><button class="ghost" data-acc="coall" ${real<1?'disabled':''}>Take all</button></div>
    <p style="font-size:13px">Sats are kept exactly as you leave them. Credits are held by what they could buy on the day, less Unity’s 10% custody fee, so a fortune from a late act is not a fortune to a hero just starting out.</p>
    <h3>Gear ${ACC.stash.length}/36</h3><div class="grid">${Array.from({length:36},(_,i)=>cell(ACC.stash[i],`data-st="${i}"`)).join('')}</div><h3>Pack ${G.bag.length}/24</h3><div class="grid">${Array.from({length:24},(_,i)=>cell(G.bag[i],`data-sb="${i}"`)).join('')}</div><p style="font-size:13px">Tap an item to move it across. Wearing it still needs the level printed on it.</p>`}
  if(tab==='shift'){h+=`<h2>Hack the simulation</h2><p>The rig can convince the world you were always someone else. Your level, gear and quests stay. Every skill and attribute point you spent comes back, two for each rank from 6 to 10, to be spent again: by you, or by the rig following a build you choose. It costs <strong style="color:#f7931a">${SHIFT_COST} sats</strong>; you hold ${G.sats}.</p><div class="list">`;
    for(const k in CLS){const c=CLS[k],cur=k===G.cls;h+=`<div class="li${cur?' on':''}"><div><b>${c.n}${cur?' · you now':''}</b><span>${c.tag}</span><div class="row" style="margin-top:8px"><button class="ghost" data-shiftp="${k}" ${G.sats<SHIFT_COST?'disabled':''}>Choose a build</button><button class="ghost" data-shift="${k}|0" ${G.sats<SHIFT_COST?'disabled':''}>I will assign</button></div></div></div>`}
    if(sel&&sel.shp){const k=sel.shp,sk=CLS[k].sk;pop=`<div class="card" style="text-align:left"><div class="nm q4">${CLS[k].n} builds</div><div class="ln off">Each is a full plan: skills that feed each other, the three on your buttons, passives, a doctrine and attributes. Pick one and the rig spends your points to fit. ${SHIFT_COST} sats.</div><div class="list">${BUILDS[k].map(b=>`<button class="li" data-shift="${k}|${b.k}"><div><b>${b.n}</b><span>${b.p}</span><span style="color:var(--gold)">${b.sl.map(i=>sk[i].n).join(' · ')}</span><span>Doctrine: ${DOCS[k].find(d=>d[0]===b.doc)[1]} · leans on ${['Might','Reflex','Vitality','Bandwidth'][b.at.indexOf(Math.max(...b.at))]}</span></div></button>`).join('')}<button class="li" data-shift="${k}|?"><div><b>Surprise me</b><span>One of the three, chosen for you.</span></div></button></div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
    h+=`</div><p>Choosing your own class again is allowed: it is a full re-roll or respec for ${SHIFT_COST} sats.</p>`}
  if(tab==='merc'){h+=`<h2>Kestrel’s people</h2><p>One companion at a time. They level with you, fight beside you and can carry a weapon and armor you give them. You have <strong>${fmt(G.credits)}</strong>.</p>`;
    if(G.merc&&G.merc.dead)h+=`<button class="big" data-revive="1" ${G.credits<reviveCost()?'disabled':''}>Revive ${esc(G.merc.name)} · ${fmt(reviveCost())}</button>`;
    if(G.merc&&!G.merc.dead){const m=G.merc,ab=(lv,a,b,cur)=>`<div class="row"><button class="${cur===a[1]?'big':'ghost'}" data-mab="${a[0]}" ${G.lvl<lv?'disabled':''}>${a[2]}</button><button class="${cur===b[1]?'big':'ghost'}" data-mab="${b[0]}" ${G.lvl<lv?'disabled':''}>${b[2]}</button></div>`;h+=`<h3>${esc(m.name)}’s training</h3><p style="font-size:13.5px">One choice at level 10 and one at level 25.</p>`+ab(10,['g','guard','Guard: +40% life'],['f','fury','Fury: +30% damage'],m.ab1)+ab(25,['m','medic','Medic: mends you when near'],['c','coll','Collector: +15% magic find, +25% credits'],m.ab2)}
    h+=`<div class="list">`;for(const k in MERCS){const m=MERCS[k],cur=G.merc&&G.merc.k===k&&!G.merc.dead;h+=`<button class="li${cur?' on':''}" data-hire="${k}" ${cur||G.credits<hireCost()?'disabled':''}><div><b>${m.n}${cur?' · with you now':''}</b><span>${m.d}</span></div><span class="pr">${cur?'':fmt(hireCost())}</span></button>`}
    h+=`</div><p>Hiring someone new sends your current companion home. Their gear passes to the new hire.</p>`}
  if(tab==='sats'){const m=mktInit(),se=mktSeries(),mid=mktMid(),bid=mktBid(),ask=mktAsk(),sp=mktSpread();
    const first=se.p[0]||1,now=se.p[se.p.length-1]||1,ch=(now/first-1)*100,sq=stimPrice();
    const own=Math.min(G.sats,m.cb.n),basisCr=m.cb.cr,basisSt=m.cb.st;
    const valCr=own*bid,valSt=own*bid/sq,plCr=valCr-basisCr,plSt=valSt-basisSt;
    const pc=(a,b)=>b>0?((a/b-1)*100):0;
    h+=`<h2>Nonce’s cache</h2><p>“Credits rot. These do not. That is the whole of my business and I will not pretend it is clever.” You hold <strong style="color:#f7931a">${G.sats} sats</strong>.</p>`;
    h+=`<div class="hero"><b style="color:#f7931a">${mktFmt(now)}</b><i class="${ch>=0?'up2':'dn2'}">${ch>=0?'\u25b2':'\u25bc'} ${Math.abs(ch).toFixed(ch<10?2:1)}%</i><span>one satoshi, ${mktView==='st'?'in stims · what it actually buys':'in credits · which only ever go one way'}</span></div>`;
    h+=mktChart();
    h+=`<div class="row" style="margin-top:6px"><button class="${mktView==='cr'?'big':'ghost'}" data-mkv="cr">In credits</button><button class="${mktView==='st'?'big':'ghost'}" data-mkv="st">In stims</button></div>`;
    h+=`<p style="font-size:13px">${mktView==='st'?'The same chart, priced in stims instead of credits. This is the one that tells you whether you are actually better off. Nonce says people look at it once and then go back to the other one.':'The grey line is what a sat is worth: credits created without limit, divided among twenty-one million. The orange line is what it is <em>trading</em> at, which is the same thing plus everybody\u2019s opinion.'}</p>`;
    if(m.news.length)h+=`<ul class="news">${m.news.map(x=>`<li><em style="color:${x.n>0?'#3fe06a':'var(--bad)'}">${x.n>0?'+':'\u2212'}</em>${esc(x.w)}</li>`).join('')}</ul>`;
    h+=`<div class="tick"><div>Nonce buys at<b>${fmt(bid)}</b></div><div>Nonce sells at<b>${fmt(ask)}</b></div>
      <div>His spread<b>${(sp*100).toFixed(2)}%</b></div><div>Depth<b>${Math.round(mktDepth())} sats</b></div>
      <div>Your stack, if sold now<b>${fmt(G.sats*bid)}</b></div><div>Mood of the market<b>${m.sent>.15?'giddy':m.sent>.04?'warm':m.sent<-.15?'grim':m.sent<-.04?'cool':'flat'}</b></div>
      <div>Against its value<b class="${m.r>=1?'up2':'dn2'}">${m.r>=1?'+':'\u2212'}${(Math.abs(m.r-1)*100).toFixed(1)}%</b></div><div>Volatility<b>${(mktVol()*1000).toFixed(1)} · ${mktVol()>.0033?'wild':mktVol()>.0022?'choppy':'settling'}</b></div></div>`;
    if(m.cb.n>0)h+=`<div class="tick"><div>You paid, in credits<b>${fmt(basisCr)}</b></div><div>Worth now<b class="${plCr>=0?'up2':'dn2'}">${plCr>=0?'+':'\u2212'}${Math.abs(pc(valCr,basisCr)).toFixed(0)}%</b></div>
      <div>You paid, in stims<b>${basisSt.toFixed(1)}</b></div><div>Worth now<b class="${plSt>=0?'up2':'dn2'}">${plSt>=0?'+':'\u2212'}${Math.abs(pc(valSt,basisSt)).toFixed(1)}%</b></div></div>
      <p style="font-size:13px">Two ways of counting the same ${own} sats. One of them is a compliment the currency is paying itself.${G.sats>m.cb.n?' The other '+(G.sats-m.cb.n)+' you found, and those cost you nothing but the walk.':''}</p>`;
    else h+=`<p style="font-size:13px">Every sat you hold was found, not bought, so there is nothing to compare it against yet. Buy one and Nonce will start keeping score two ways.</p>`;
    h+=`<h3>Trade</h3><div class="row">${[1,10,50,200].map(n=>`<button class="${mktQty===n?'big':'ghost'}" data-mkq="${n}">${n}</button>`).join('')}</div>`;
    {const n=Math.max(1,mktQty),qb=mktQuote(n,'buy'),qs=mktQuote(n,'sell');
     h+=`<div class="qt"><div>Mid price<b>${fmt(qb.mid)}</b></div><div>His spread, half each way<b>±${(qb.sp*50).toFixed(2)}%</b></div>
       <div>Your size against his depth<b>${qb.k<.02?'no bite':'costs you '+(qb.k*9).toFixed(1)+'%'}</b></div><div>Taker fee<b>${(MKT_TAKER*100).toFixed(1)}%</b></div>
       <div class="tot">Buy ${n} sats<b>${fmt(qb.total)}</b></div><div class="tot">Sell ${n} sats<b>${fmt(qs.total)}</b></div></div>`;
     h+=`<div class="row"><button class="big" data-mkt="b" ${G.credits<qb.total?'disabled':''}>Buy ${n}</button><button class="big" data-mkt="s" ${G.sats<n?'disabled':''}>Sell ${n}</button></div>
       <div class="row"><button class="ghost" data-mkt="ball" ${G.credits<ask?'disabled':''}>Buy with everything</button><button class="ghost" data-mkt="sall" ${G.sats<1?'disabled':''}>Sell the lot</button></div>`;}
    h+=`<p style="font-size:13px">Four things happen to every trade, and Nonce lists all four because he says the ones who hide them are the ones to worry about. He makes the spread for being willing to deal at all; the fee is for doing it <em>this second</em>; and a big order eats its way down his book, which is why selling the lot never gets you the number on the screen.</p>`;
    h+=`<h3>Or name your own price</h3><div class="row"><button class="ghost" data-mko="b3">Bid 3% under</button><button class="ghost" data-mko="b7">Bid 7% under</button></div>
      <div class="row"><button class="ghost" data-mko="s3">Ask 3% over</button><button class="ghost" data-mko="s7">Ask 7% over</button></div>
      <p style="font-size:13px">A posted order waits. If the price comes to you it fills, you pay no fee, and Nonce pays you ${(MKT_MAKER*100).toFixed(1)}% for the trouble — because while it sat there you were the one willing to deal, which is his job. If the price never comes, it never fills. That is the trade: a better number, or a certain one.</p>`;
    if(m.ord.length){h+=`<div class="list">${m.ord.map((o,i)=>`<button class="li on" data-mkx="${i}"><div><b>${o.s==='buy'?'Bid':'Ask'} ${o.n} sats at ${fmt(o.px)}</b><span>${o.s==='buy'?'Fills if one sat falls to that. '+fmt(o.esc)+' is held.':'Fills if one sat rises to that. '+o.esc+' sats are held.'} Tap to withdraw.</span></div></button>`).join('')}</div>`}
    if(!m.pos&&G.sats>=10){const n=Math.max(10,Math.min(G.sats,mktQty)),lent=Math.floor(mktBid()*n*MKT_LTV),liq=lent/(n*MKT_LIQ);
      h+=`<h3>Mr. Float will lend against them</h3>
        <p style="font-size:13px">He gives you credits now and holds your sats as the promise. You keep the sats — unless the price falls far enough that they stop covering what you owe, and then he keeps them instead. That is the whole of a margin call and it is not personal.</p>
        <div class="tick"><div>Pledge<b>${n} sats</b></div><div>He hands you<b>${fmt(lent)}</b></div>
          <div>Against a stack worth<b>${fmt(mktBid()*n)}</b></div><div>He takes them below<b class="dn2">${fmt(liq)}</b></div></div>
        <div class="row"><button class="big" data-mkb="1">Borrow ${fmt(lent)} against ${n} sats</button></div>
        <p style="font-size:13px">Borrowing to buy more is how people turn a ${(100-MKT_LIQ*100).toFixed(0)}% fall into a total one. Nonce watches this part of the counter without saying anything.</p>`}
    if(m.pos){const p0=m.pos,safe=(mktMid()/p0.liq-1)*100;
      h+=`<h3>Mr. Float holds ${p0.n} of your sats</h3><div class="tick"><div>He lent you<b>${fmt(p0.lent)}</b></div><div>You owe him<b>${fmt(p0.lent*1.08)}</b></div>
        <div>He keeps them below<b>${fmt(p0.liq)}</b></div><div>Room left<b class="${safe<12?'dn2':'up2'}">${safe.toFixed(0)}%</b></div></div>
        <div class="row"><button class="big" data-mkr="1" ${G.credits<p0.lent*1.08?'disabled':''}>Repay and take them back</button></div>`}
    h+=`<h3>Nonce’s goods</h3><div class="list">`;
    satShop.forEach((o,i)=>{h+=`<button class="li${sel&&sel.sat===i?' on':''}" data-sat="${i}"><div><b class="q${o.it.q}">${esc(o.it.name)}</b><span>${QN[o.it.q]} ${SNAME[o.it.slot]} · level ${o.it.il}</span></div><span class="pr" style="color:#f7931a">${satPrice(o)} sats</span></button>`});
    if(!satShop.length)h+=`<p>Sold out. Nonce restocks each time you return to town.</p>`;h+=`</div>`;
    h+=`<div class="stats"><div>A stim, in credits<b>${fmt(sq)}</b></div><div>Same stim, at arrival<b>${fmt(25*(1+G.lvl*.2)*(G.disc?.85:1))}</b></div><div>A stim, in sats<b>${(sq/mid).toFixed(2)}</b></div></div>
      <p style="font-size:13.5px">The same stim costs more credits every minute and about the same number of sats. Nonce will not tell you what to make of that.</p>`;
    if(sel&&sel.sat!==undefined&&satShop[sel.sat]){const o=satShop[sel.sat];pop=itemCard(o.it,`<button class="big" data-satbuy="1" ${G.sats<satPrice(o)||G.bag.length>=24?'disabled':''}>Buy for ${satPrice(o)} sats</button>`)}}
  if(tab==='travel'){h+=`<h2>Transit Gate</h2>`;if(!gateAct||sheetCtx.gFresh){sheetCtx.gFresh=0;gateAct=actOf(W.zi)||1}const acts=[[1,'I',1],[2,'II',G.q.q5===3],[3,'III',G.q.q10===3],[4,'IV',G.q.q15===3],[5,'V',G.q.q20===3],[6,'More',1]];if(!acts[gateAct-1][2])gateAct=1;
    h+=`<div class="row">${acts.map(a=>`<button class="${gateAct===a[0]?'big':'ghost'}" data-gact="${a[0]}" ${a[2]?'':'disabled'}>${a[1]}</button>`).join('')}</div><div class="list">`;
    const row=i=>{const z=ZONES[i],ok=i<=G.unlocked;return `<button class="li" data-go="${i}" ${ok?'':'disabled'}><div><b>${z.n}</b><span>${ok?(ZS[i]&&ZS[i].tier===G.tier?'Machine level '+ZS[i].ml+' · '+ZS[i].ents.length+' machines remain':'Machine level '+zoneLevel(z)+' · untouched'):'Locked. Clear the district before it.'}</span></div></button>`};
    const trow=i=>`<button class="li${W.zi===i?' on':''}" data-go="${i}"><div><b>${ZONES[i].n}</b><span>Town${W.zi===i?' · you are here':''}</span></div></button>`;
    if(gateAct===1){h+=`<h3>The Regional Office</h3>`+trow(0);for(let i=1;i<6;i++)h+=row(i)}
    if(gateAct===2){h+=`<h3>The Cloud</h3>`+trow(17);for(let i=7;i<12;i++)h+=row(i)}
    if(gateAct===3){h+=`<h3>The Board</h3>`+trow(18);for(let i=12;i<17;i++)h+=row(i)}
    if(gateAct===4){h+=`<h3>The Gentle Years</h3>`+trow(21);for(let i=22;i<27;i++)h+=row(i)}
    if(gateAct===5){h+=`<h3>The Awakening</h3>`+trow(27);for(let i=28;i<33;i++)h+=row(i)}
    if(gateAct===4)h+=`<p class="hint" style="font-size:13.5px">Raising the tier, putting the machines back, and the districts the gate was not built to list are on More.</p>`;
    if(gateAct===6){
      h+=`<p style="font-size:13.5px">Each act has its own town, and you can walk out of its gate into the first district and on from one to the next. A district keeps what you have explored; its machines drift back if you stay away a few minutes.</p>`;
      h+=`<p style="font-size:13.5px">The VR rig in Stillwater runs the Simulator, which has no last wave, and a boss rush of lieutenants from districts you have left, plus any you have already broken, and the executives you have beaten. Difficulty and hardcore are in Options.</p>`;
      if(OPT.dyn)h+=`<p style="font-size:13.5px">Machines scale to you: a fresh district is never more than two levels below yours, and they toughen as your gear improves. Turn this off in Options.</p>`;
      if(G.leg)h+=`<button class="li" data-bull="1" ${G.sats<10?'disabled':''}><div><b style="color:#ffe36b">Jam the servo leg into the gate</b><span>The gate shudders and shows a field it is not supposed to know about. 10 sats to look the other way.</span></div></button>`;
      if(G.q.q5===3){const mx=G.subMax||1;h+=`<h3>Subpoenas</h3><p style="font-size:13.5px">A sealed district with two or three rules of its own, at your level and above. Break The Respondent to open the next level. 3 sats to serve.</p>`;for(let l=Math.max(1,mx-2);l<=mx;l++)h+=`<button class="li" data-sub="${l}" ${G.sats<3?'disabled':''}><div><b>Subpoena · Level ${l}</b><span>Machines +${15*l}% life, +${10*l}% damage. Pays ${5+3*l} sats and ${3*l} parts.</span></div></button>`}
    }
    h+=`</div>`;if(gateAct===6)h+=`<button class="ghost" data-dev="reset">Respawn all machines</button>`;
    if(G.maxTier>0&&gateAct===6)h+=`<h3>Tier</h3><div class="row"><button class="ghost" data-tier="-1" ${G.tier<=0?'disabled':''}>Easier</button><button class="ghost" disabled>Tier ${G.tier}</button><button class="ghost" data-tier="1" ${G.tier>=G.maxTier?'disabled':''}>Harder</button></div><p>Each tier adds 12 machine levels and raises item levels to match. Changing tier respawns every district.</p>`}
  h+=`</div>`;$('sheetIn').innerHTML=h;paintGlyphs($('sheetIn'));{const wb=$('webBox');if(wb){wb.scrollLeft=webSc[0];wb.scrollTop=webSc[1];wb.onscroll=()=>{webSc=[wb.scrollLeft,wb.scrollTop]}}}if(pop){$('popIn').innerHTML=pop;paintGlyphs($('popIn'));$('pop').hidden=false;$('pop').scrollTop=0}}
let sellArm=false;
const satsOk=()=>G.adopt>=60||(G.wonF&&G.wonF.brenda===1)||shopVia,satCost=it=>Math.max(1,Math.ceil(buyPrice(it)/satRate()));let shopVia=0;const buyPrice=it=>it.val*2.5*G.cpi*(shopVia?.7:1)*(G.disc?.85:1)*(repRank('norm')>=3?.8:repRank('norm')>=1?.9:1);
const boxPrice=()=>(8+G.lvl*5)*9*G.cpi;
/* The sell line prints whole credits, so the purse gains the floor of two fifths. */
function sellValue(it){return Math.floor((it.val||0)*.4*G.cpi)}
function copyText(s,ta){const fb=()=>{ta.hidden=false;ta.value=s;ta.focus();ta.select();toast('Select all and copy the code below')};try{navigator.clipboard.writeText(s).then(()=>toast('Save code copied'),fb)}catch(e){fb()}}
function loadCode(s){try{const o=JSON.parse(decodeURIComponent(escape(atob(s.trim()))));if(!applySave(o))throw 0;$('sheet').hidden=true;startPlay();save();toast('Save loaded');return true}catch(e){toast('That code could not be read');return false}}
let tapT=null,tapI=-1,lpT=null,lpFired=false,lpXY=null;
function longPress(i){const it=G.bag[i];if(!it)return;lpFired=true;clearTimeout(tapT);tapT=null;try{navigator.vibrate&&navigator.vibrate(25)}catch(e){}
  if(selling()){const v=sellValue(it);G.credits+=v;G.bag.splice(i,1);sfx('coin');toast('Sold '+(it.id?it.name:it.base)+' for '+fmt(v))}else{it.junk=!it.junk;sfx('ui');toast(it.junk?'Marked as junk':'No longer junk')}
  sel=null;drawSheet()}
$('sheetIn').addEventListener('pointerdown',e=>{const c=e.target.closest('[data-bag]');lpFired=false;clearTimeout(lpT);if(!c||c.disabled)return;const i=+c.dataset.bag;lpXY=[e.clientX,e.clientY];lpT=setTimeout(()=>longPress(i),480)});
$('sheetIn').addEventListener('pointermove',e=>{if(lpXY&&Math.hypot(e.clientX-lpXY[0],e.clientY-lpXY[1])>10)clearTimeout(lpT)});
for(const n of['pointerup','pointercancel','pointerleave'])$('sheetIn').addEventListener(n,()=>clearTimeout(lpT));
const sheetClick=ev=>{const b=ev.target.closest('button,[data-track],[data-web],[data-webadd]');if(!b||b.disabled)return;const d=b.dataset;sfx('ui');
  if(d.popx)sel=null;
  if(d.sellq!==undefined){const q=+d.sellq;if(q<0&&!sellArm){sellArm=true;drawSheet();return}let t=0;G.bag=G.bag.filter(i=>{if(q===9?i.junk:!i.charm&&(q<0||i.q===q)){t+=sellValue(i);return false}return true});G.credits+=t;sel=null;sfx('coin');toast('Sold for '+fmt(t))}
  sellArm=false;
  if(d.close)return closeSheet();
  if(d.loadcode){const v=$('codeIn').value;if(!loadCode(v)){const p=document.createElement('p');p.className='red';p.textContent='That code could not be read. Check that all of it was pasted.';$('sheetIn').appendChild(p)}return}
  if(d.tab){tab=d.tab;sel=null}
  if(d.eq)sel={eq:d.eq};
  if(d.ch!==undefined)sel={ch:+d.ch};
  if(d.chdo){const i=sel.ch,it=G.charms[i];if(d.chdo==='tog'){it.on=!it.on;sfx('equip')}else{G.charms.splice(i,1);sel=null;if(d.chdo==='sell'){G.credits+=sellValue(it);sfx('coin')}else if(d.chdo==='scrap'){G.parts=(G.parts||0)+2;sfx('equip')}else W.drops.push({x:P.x+1.1,y:P.y+1.1,it,t:1})}calc()}
  if(d.bag!==undefined){const i=+d.bag;if(lpFired){lpFired=false;return}
    if(tapT&&tapI===i){clearTimeout(tapT);tapT=null;if(equipFromBag(i))toast('Equipped');sel=null}
    else{clearTimeout(tapT);tapI=i;tapT=setTimeout(()=>{tapT=null;sel={bag:i};drawSheet()},260);return}}
  if(d.best){bestAsk();return}if(d.bestok){const n=equipBest();toast(n?'Equipped '+n+' upgrade'+(n>1?'s':''):'Nothing better in your pack')}
  if(d.markjunk){let n=0;G.bag.forEach(it=>{const x=itemDelta(it);if(x!==null&&x<-.01&&!it.junk){it.junk=true;n++}});toast(n+' item'+(n===1?'':'s')+' marked as junk')}
  if(d.dropjunk){G.bag=G.bag.filter(it=>{if(it.junk){W.drops.push({x:P.x+rnd(-1.2,1.2),y:P.y+rnd(-1.2,1.2),it,t:1});return false}return true});sel=null}
  if(d.do){const it=sel.eq?G.eq[sel.eq]:G.bag[sel.bag];
    if(d.do==='equip'){equipFromBag(sel.bag);sel=null}
    if(d.do==='junk'){it.junk=!it.junk;sel=null}
    if(d.do==='scrap'||d.do==='reroll'||d.do==='addsoc'){if(craft(it,d.do))sel=null;drawSheet();return}
    if(d.do==='sock'){sel.sock=true;drawSheet();return}
    if(d.do==='mgive'){const old=G.merc[it.slot];G.merc[it.slot]=it;it.junk=false;G.bag.splice(sel.bag,1);if(old)G.bag.push(old);sel=null;sfx('equip');toast(G.merc.name+' takes the '+it.base)}
    if(d.do==='unequip'){if(G.bag.length>=24)toast('Your pack is full');else{G.bag.push(it);G.eq[sel.eq]=null;sel=null;sfx('equip')}}
    if(d.do==='sell'){G.credits+=sellValue(it);G.bag.splice(sel.bag,1);sel=null;sfx('coin')}
    if(d.do==='drop'){G.bag.splice(sel.bag,1);W.drops.push({x:P.x+1.1,y:P.y+1.1,it,t:1});sel=null}
    calc()}
  if(d.word){const it=sel.eq?G.eq[sel.eq]:G.bag[sel.bag];socketWord(it,d.word);sel.sock=it.words.length<it.soc&&!it.pw}
  if(d.at){G.at[d.at]++;G.ap--}
  if(d.mtake){if(G.bag.length>=24)toast('Your pack is full');else{G.bag.push(G.merc[d.mtake]);G.merc[d.mtake]=null;sel=null;sfx('equip')}}
  if(d.msel){sel=G.merc&&G.merc[d.msel]?{m:d.msel}:null}
  if(d.mbest){const n=mercBest();toast(n?G.merc.name+' takes '+n+' piece'+(n>1?'s':''):'Nothing spare is better for them. Pieces that would improve you are left alone.');sfx(n?'equip':'ui')}
  if(d.claim!==undefined){const b=G.bounties[+d.claim];if(b&&b.c>=b.n){const m=repRank('anon')>=1?1.25:1;b.sats=Math.ceil(b.sats*m);b.cr*=m;addRep('anon',6);if(repRank('anon')>=3){const w=pick(WK);gotWord(w);toast('A note is pinned to the payment: '+w)}G.sats+=b.sats;G.credits+=b.cr*G.cpi;G.bounties.splice(+d.claim,1);sfx('quest');toast('Paid: '+b.sats+' sats and '+fmt(b.cr*G.cpi))}}
  if(d.st!==undefined){const it=ACC.stash[+d.st];if(it){if(G.bag.length>=24)toast('Your pack is full');else{ACC.stash.splice(+d.st,1);G.bag.push(it);sfx('equip');accSave();save(true)}}}
  if(d.sb!==undefined){const it=G.bag[+d.sb];if(it){if(ACC.stash.length>=36)toast('The lockbox is full');else{G.bag.splice(+d.sb,1);it.junk=false;ACC.stash.push(it);sfx('equip');accSave();save(true)}}}
  if(d.acc){const k=d.acc;if(k[0]==='s'){const n=k==='si10'?10:k==='siall'?G.sats:k==='so10'?-10:-ACC.sats;G.sats-=n;ACC.sats+=n}else if(k==='coall'){G.credits+=ACC.cr*G.cpi;ACC.cr=0}else{const a=k==='cihalf'?G.credits/2:G.credits;G.credits-=a;ACC.cr+=a/G.cpi*.9}sfx('coin');accSave();save(true)}
  if(d.bull){closeSheet();bullStart();return}
  if(d.shiftp){sel={shp:d.shiftp};drawSheet();return}
  if(d.shift){const[k,r]=d.shift.split('|');shapeShift(k,r==='0'?false:r==='1'?true:r==='?'?pick(BUILDS[k]).k:r);return}
  if((d.hire||d.revive)&&G.tag){toast('Kestrel will not hire to you while '+G.tag.name+' is rendered');sfx('err');return}
  if(d.hire){const c=hireCost();if(G.credits<c){toast('Not enough credits');sfx('err')}else{G.credits-=c;const old=G.merc;G.merc={k:d.hire,name:pick(MNAMES),hp:0,dead:false,weapon:old?old.weapon:null,armor:old?old.armor:null,helm:old?old.helm||null:null};spawnMerc();sfx('quest');toast(G.merc.name+' the '+MERCS[d.hire].n+' joins you')}}
  if(d.revive){const c=reviveCost();if(G.credits<c){toast('Not enough credits');sfx('err')}else{G.credits-=c;G.merc.dead=false;G.merc.hp=0;spawnMerc();sfx('mend');toast(G.merc.name+' is back on their feet')}}
  if(d.sat!==undefined)sel={sat:+d.sat};
  if(d.mkv){mktView=d.mkv}
  if(d.mkq){mktQty=+d.mkq}
  if(d.mkt){const k=d.mkt;
    if(k==='b'||k==='s'){const n=Math.max(1,mktQty),q=mktTrade(n,k==='b'?'buy':'sell');
      if(q)toast(k==='b'?'Bought '+n+' sats for '+fmt(q.total):'Sold '+n+' sats for '+fmt(q.total));else{toast(k==='b'?'Not enough credits':'Not that many sats');sfx('err')}}
    else if(k==='ball'){const n=Math.floor(G.credits/(mktAsk()*(1+MKT_TAKER)*1.08));if(n<1){toast('Not enough credits');sfx('err')}else{const q=mktTrade(n,'buy');if(q)toast('Bought '+n+' sats for '+fmt(q.total))}}
    else if(k==='sall'){const n=G.sats;if(n<1){toast('No sats');sfx('err')}else{const q=mktTrade(n,'sell');if(q)toast('Sold '+n+' sats for '+fmt(q.total)+(q.k>.12?' — and the last of them for rather less than the first':''))}}}
  if(d.mko){const n=Math.max(1,mktQty),off=+d.mko.slice(1)/100,buy=d.mko[0]==='b',px=mktMid()*(buy?1-off:1+off);
    if(!mktPost(n,px,buy?'buy':'sell')){toast(buy?'Not enough credits to hold that bid':'Not that many sats to post');sfx('err')}}
  if(d.mkx!==undefined)mktCancel(+d.mkx);
  if(mpClick(d))return;
  if(d.mkr)if(!mktRepay()){toast('Not enough credits to repay him');sfx('err')}
  if(d.mkb){const n=Math.max(1,Math.min(G.sats,mktQty));if(!mktBorrow(n)){toast(G.mkt.pos?'He will only hold one position':'Not enough sats');sfx('err')}}
  if(d.satbuy){const o=satShop[sel.sat];if(o&&G.sats>=satPrice(o)&&G.bag.length<24){G.sats-=satPrice(o);addRep('btc',Math.ceil(o.price/4));addAdopt(1,'you paid in sats');G.bag.push(o.it);satShop.splice(sel.sat,1);sel=null;sfx('coin');toast('Paid in sats')}}
  if(d.node!==undefined)sel={sk:+d.node};
  if(d.learn!==undefined){const i=+d.learn;G.sp-=skCost(i);G.sk[i]++;if(G.sk[i]===10)toast(CLS[G.cls].sk[i].n+' is mastered: two extra ranks’ worth of power'+(CLS[G.cls].sk[i].a?' and 20% faster recovery':'')+'.');if(CLS[G.cls].sk[i].a&&!G.slots.includes(i)){const e=G.slots.indexOf(-1);if(e>=0)G.slots[e]=i}if(!CLS[G.cls].sk[i].a&&G.pas&&!G.pas.includes(i)&&G.pas.length<PCAP())G.pas.push(i);calc();sfx('learn');if(G.cls==='hacker'&&i===11&&G.sk[11]===1&&!G.schema)schemaAsk()}
  if(d.assign!==undefined){const k=+d.assign,i=sel.sk,o=G.slots.indexOf(i);if(o>=0)G.slots[o]=G.slots[k];G.slots[k]=i}
  if(d.pas!==undefined){const i=+d.pas,k=G.pas.indexOf(i);if(k>=0)G.pas.splice(k,1);else if(G.pas.length<PCAP())G.pas.push(i);calc();G.hp=Math.min(G.hp,S.maxHp)}
  if(d.fork){G.fork=G.fork||{};const i=sel.sk;if(G.fork[i]===d.fork)delete G.fork[i];else G.fork[i]=d.fork}
  if(d.web){sel={web:d.web}}
  /* the + over an arm's first node: spend straight away on the far end of that arm */
  if(d.webadd!==undefined){const nx=webNext(+d.webadd);
    if(nx&&webPts()>0){G.web[nx]=1;sel={web:nx};calc();sfx('learn')}}
  if(d.weball){G.web[sel.web]=1;calc();sfx('learn')}
  if(d.webreset){if(G.sats>=5){G.sats-=5;G.web={};sel=null;calc();sfx('ui')}}
  if(d.sub){closeSheet();subStart(+d.sub);return}
  if(d.hc){G.hc=!G.hc;calc()}
  if(d.mab){G.merc[d.mab[0]==='g'||d.mab[0]==='f'?'ab1':'ab2']={g:'guard',f:'fury',m:'medic',c:'coll'}[d.mab[0]];calc();spawnMerc()}
  if(d.gact){gateAct=+d.gact}
  if(d.doc){if(!W.z.town)toast('Doctrines can only be changed in town');else if(G.doc===d.doc){}else if(G.doc&&G.sats<3)toast('Changing doctrine costs 3 sats');else{if(G.doc)G.sats-=3;G.doc=d.doc;calc();G.hp=Math.min(G.hp,S.maxHp);sfx('learn')}}
  if(d.track){G.track=d.track;sfx('ui')}
  if(d.diff!==undefined){G.diff=+d.diff;sfx('ui');toast(pick(DIFFSET))}
  if(d.opt==='fx'){const o=['full','normal','thin'];const i=o.indexOf(OPT.fx);OPT.fx=o[(i<0?1:i+1)%3]}
  else if(d.opt){OPT[d.opt]=!OPT[d.opt];if(d.opt==='music'&&MUG)MUG.gain.value=OPT.music?.55:0}
  if(d.save){toast(save(true)?(CL?'Saved to your account':'Saved in this browser'):'This browser would not store the save. Use a save code instead.')}
  if(d.code){const o=saveObj();o.zs={};o.cur=null;copyText(btoa(unescape(encodeURIComponent(JSON.stringify(o)))),$('codeOut'));return}
  if(d.delslot!==undefined){const n=+d.delslot;$('sheet').hidden=true;mode='play';askWipe(n,()=>{if(G.tag&&G.tag.slot===n)tagDismiss(1);openSheet('opts',{})});return}
  if(d.swslot!==undefined){const n=+d.swslot,i=slotInfo(n);if(!i)return;save(true);const fin=sv=>{if(applySave(sv)){SLOT=n;clDirty={};W=null;$('sheet').hidden=true;$('pop').hidden=true;startPlay()}else{toast('That save could not be loaded');drawSheet()}};if(i.cloud){b.disabled=true;cloudLoad(i.cloud,n).then(fin)}else fin(i.loc);return}
  if(d.newslot!==undefined){save(true);$('sheet').hidden=true;$('pop').hidden=true;$('hud').hidden=true;$('title').hidden=false;mode='title';music('scene');W=null;SLOT=+d.newslot;showContinue();const nh=$('newH');nh&&nh.scrollIntoView&&nh.scrollIntoView({block:'start'});return}
  if(d.walk){const fromTitle=sheetCtx.from==='title';closeSheet();walkChoose(!!fromTitle);return}if(d.title){save(true);$('sheet').hidden=true;$('hud').hidden=true;$('title').hidden=false;mode='title';music('scene');showContinue();W=null;return}
  if(d.dev){const k=d.dev;if(k==='lvl')gainXp(xpNext(G.lvl)-G.xp);if(k==='cr')G.credits+=5000*G.cpi*G.lvl;if(k==='zones')G.unlocked=5;if(k==='god')G.god=!G.god;if(k==='reset'){resetZones();toast('Every district is restocked')}
    if(k==='loot'){for(let q=1;q<=4;q++)for(let i=0;i<2;i++)W.drops.push({x:P.x+rnd(-2,2),y:P.y+rnd(-2,2),it:makeItem(G.lvl+1,q),t:1});toast('Loot scattered at your feet')}}
  if(d.buy==='stim'){G.credits-=stimPrice();G.stims++;sfx('coin')}
  if(d.buy==='id'){G.credits-=40*G.cpi*unidCount()*(G.disc?.85:1);idAll();sfx('rare')}
  if(d.shop!==undefined)sel={shop:+d.shop};
  if(d.buy==='itemsat'){const it=shop[sel.shop];G.sats-=satCost(it);addAdopt(.5,'');G.bag.push(it);shop.splice(sel.shop,1);sel=null;sfx('coin')}
  if(d.buy==='item'){const it=shop[sel.shop];G.credits-=buyPrice(it);G.bag.push(it);shop.splice(sel.shop,1);sel=null;sfx('coin')}
  if(d.box){G.credits-=boxPrice();const r=Math.random(),q=r<.015?4:r<.035?3:r<.185?2:1;const it=makeItem(G.lvl+ri(-1,2)+G.tier*12,q,d.box);it.id=true;G.bag.push(it);lastBox=it;sfx(q===4?'unique':q>=2?'rare':'drop')}
  if(d.go){if(mpPortalBlocked())return;closeSheet();enter(+d.go);return}
  if(d.tier){G.tier=clamp(G.tier+ +d.tier,0,G.maxTier);resetZones()}
  drawSheet()};
$('sheet').addEventListener('click',sheetClick);
$('pop').addEventListener('click',ev=>{if(ev.target.id==='pop'){sel=null;sfx('ui');drawSheet();return}sheetClick(ev)});

function showDeath(){const town=ZONES[HT()]||{n:'town'};$('deathP').textContent='Slain by '+DY.by+' in '+ZONES[DY.zi].n+', with '+DTY[P.lastTy||'impact'].n+' damage.'+(G.hc?' This was a hardcore hero. They are gone, and a new wanderer will take the road.':'');
  $('deathNote').textContent=G.hc?'There is no portal. This hero does not get back up.':'The machines have not moved. A portal back to the start of the district will wait in the square.';
  $('bRise').textContent=G.hc?'Begin again':'Rise in '+town.n;
  $('deathS').innerHTML=`<div>Level<b>${G.lvl}</b></div><div>Machines scrapped<b>${G.kills}</b></div><div>Re-onboarding fee<b>${G.hc?'none':fmt(DY.fee)}</b></div>`;$('death').hidden=false}
$('bRise').onclick=()=>{if(!DY)return;if(G.hc){hcBegin();return}const d=DY;DY=null;$('death').hidden=true;G.hp=S.maxHp;G.en=S.maxEn;mode='play';G.portal={zi:d.zi,x:d.st.x,y:d.st.y};sfx('portal');enter(HT());toast('A portal back stands open in the square')};

/* ================= input ================= */
const sz=$('stickzone');let sid=null,so={x:0,y:0};
sz.addEventListener('pointerdown',e=>{if(sid!==null)return;sid=e.pointerId;sz.setPointerCapture(sid);const r=$('app').getBoundingClientRect();so={x:e.clientX,y:e.clientY};const s=$('stick');s.hidden=false;s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';$('knob').style.transform=''});
sz.addEventListener('pointermove',e=>{if(e.pointerId!==sid)return;let dx=e.clientX-so.x,dy=e.clientY-so.y;const l=Math.hypot(dx,dy),m=44;if(l>m){dx*=m/l;dy*=m/l}J.x=dx/m;J.y=dy/m;$('knob').style.transform=`translate(${dx}px,${dy}px)`});
const send=e=>{if(e.pointerId!==sid)return;sid=null;J.x=J.y=0;$('stick').hidden=true};sz.addEventListener('pointerup',send);sz.addEventListener('pointercancel',send);
const ba=$('bAtk');ba.addEventListener('pointerdown',e=>{atkHeld=true;ba.setPointerCapture(e.pointerId)});['pointerup','pointercancel'].forEach(n=>ba.addEventListener(n,()=>atkHeld=false));
sbtn.forEach((b,i)=>b.addEventListener('pointerdown',()=>cast(i)));
$('obj').addEventListener('click',()=>{OPT.objMin=!OPT.objMin;sfx('ui')});$('bPot').addEventListener('pointerdown',stim);$('bDodge').addEventListener('pointerdown',dodge);
$('bAct').addEventListener('click',()=>{if(mode==='play'&&actTarget){sfx('ui');actTarget.fn()}});
$('bSwap').addEventListener('click',()=>{if(!SWAP||mode!=='play')return;const i=G.bag.indexOf(SWAP.it);if(i>=0&&equipFromBag(i))toast('Equipped '+SWAP.it.name);SWAP=null});
$('bMenu').addEventListener('click',()=>openSheet('items',{}));$('bChars').addEventListener('click',()=>{sfx('ui');openSheet('opts',{})});
$('bMap').addEventListener('click',()=>{OPT.minimap=!OPT.minimap});
$('bBug').addEventListener('click',bugAsk);
$('bRecall').addEventListener('click',openPortal);
addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='TEXTAREA')return;keys[e.code]=true;if(mode==='play'){if(e.code==='Digit1')cast(0);if(e.code==='Digit2')cast(1);if(e.code==='Digit3')cast(2);if(e.code==='KeyQ')stim();if(e.code==='ShiftLeft')dodge();if(e.code==='KeyE'&&actTarget)actTarget.fn();if(e.code==='KeyT')openPortal();if(e.code==='Tab'){OPT.minimap=!OPT.minimap;e.preventDefault()}if(e.code==='KeyB'||e.code==='KeyI')openSheet('items',{});if(e.code==='Space')e.preventDefault()}
  else if(mode==='scene'&&SC&&SC.back){if(e.code==='ArrowRight'){$('scNext').click();e.preventDefault()}else if(e.code==='ArrowLeft'){$('scBack').click();e.preventDefault()}}else if(mode==='sheet'&&(e.code==='Escape'||e.code==='KeyB'))closeSheet()});
addEventListener('keyup',e=>keys[e.code]=false);
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;atkHeld=false});
document.addEventListener('contextmenu',e=>e.preventDefault());
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&mode!=='title')save(true)});
addEventListener('pagehide',()=>{if(G&&mode!=='title')save(true)});

/* ================= boot ================= */
function drawCls(){$('clsList').innerHTML=Object.entries(CLS).filter(([k,c])=>!c.locked||maxiOn()).map(([k,c])=>`<button class="cls" data-cls="${k}"><i style="background:${c.col}"></i><div><b>${c.n}</b><span>${c.tag}</span></div></button>`).join('')}
drawCls();
$('clsList').addEventListener('click',e=>{const b=e.target.closest('[data-cls]');if(!b)return;sfx('ui');const go=()=>{$('title').hidden=true;newGame(b.dataset.cls)};const cur=slotInfo(SLOT);if(!cur)return go();dlg('Replace slot '+(SLOT+1)+'?','A new wanderer begins at the very start: level 1, Act I, nothing carried over. It replaces the level '+cur.lvl+' '+CLS[cur.cls].n+' saved in this slot, who cannot be brought back. To keep them, tap an empty slot first.',[['Keep my hero',()=>{mode='title'}],['Start a new '+CLS[b.dataset.cls].n,go]],2)});
$('bWalk').onclick=()=>{sfx('ui');walkChoose(true)};
$('bLoadCode').onclick=()=>openSheet('load',{only:['load']});
function showContinue(){$('bCont').hidden=true;drawSlots()}
/* three save slots: each row is a hero (the newer of this device's copy and the account's), or an empty place for a new one */
function slotInfo(n){const loc=loadStored(n),cd=CLD[n];let lg=null;try{lg=loc&&loc.G&&CLS[loc.G.cls]?loc:null}catch(e){}
  if(cd&&(!lg||!lg.t||cd.t>lg.t)){let G0=null;try{if(cd.s)G0=JSON.parse(cd.s).G}catch(e){}return{cloud:cd,lvl:cd.lv!==undefined?cd.lv:(G0?G0.lvl:'?'),cls:cd.cl||(G0&&G0.cls),act:G0?heroAct(G0):(cd.ac||1),dead:heroDead(G0)}}
  return lg?{loc:lg,lvl:lg.G.lvl,cls:lg.G.cls,act:heroAct(lg.G),dead:heroDead(lg.G)}:null}
async function wipeSlot(n){const cd=CLD[n];try{localStorage.removeItem(skey(n))}catch(e){}delete CLD[n];if(n===SLOT)clDirty={};
  if(CL){const kill=async id=>{try{await CL.doc(id).delete()}catch(e){try{await CL.doc(id).set({gone:1,s:'',t:Date.now()})}catch(e2){}}};for(const k of(cd&&cd.zk)||[])await kill(zdoc(n,k));await kill(mdoc(n))}}
function askWipe(n,then){const i=slotInfo(n);if(!i)return;dlg('Delete this character?','The level '+i.lvl+' '+CLS[i.cls].n+' in slot '+(n+1)+' will be erased from this device and from your account. It cannot be brought back. The shared lockbox is not touched.',[['Keep it'],['Delete for good',()=>{wipeSlot(n).then(()=>{sfx('err');then&&then()})}]],2)}
function drawSlots(){const el=$('slots');if(!el)return;let h='';
  for(let n=0;n<NSLOT;n++){const i=slotInfo(n);h+=i&&CLS[i.cls]?`<button class="li${SLOT===n?' on':''}" data-slot="${n}"><i style="background:${CLS[i.cls].col}"></i><div><b>${i.dead?'Hardcore · fallen':'Continue · level '+i.lvl+' '+CLS[i.cls].n}</b><span>Slot ${n+1} · Act ${actRoman(i.act)}${i.dead?' · begins again':i.cloud?' · saved to your account':''}</span></div></button><button class="ghost" data-slotdel="${n}" style="margin:-4px 0 8px auto;display:block;font-size:10px;padding:5px 10px;min-height:0">Delete slot ${n+1}</button>`:`<button class="li${SLOT===n?' on':''}" data-slotnew="${n}"><div><b>Slot ${n+1} · empty</b><span>${SLOT===n?'Choose a class below to begin here':'Tap to start a new wanderer here'}</span></div></button>`}
  el.innerHTML=h;const cur=slotInfo(SLOT);$('newH').textContent=cur?'Replace the wanderer in slot '+(SLOT+1):'Begin a new wanderer in slot '+(SLOT+1)}
$('slots').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.disabled)return;sfx('ui');
  if(b.dataset.slotdel!==undefined){askWipe(+b.dataset.slotdel,()=>{mode='title';drawSlots()});return}
  if(b.dataset.slotnew!==undefined){SLOT=+b.dataset.slotnew;drawSlots();return}
  const n=+b.dataset.slot,i=slotInfo(n);if(!i)return;let sv;if(i.cloud){b.disabled=true;b.querySelector('b').textContent='Loading…';sv=await cloudLoad(i.cloud,n)}else sv=i.loc;if(applySave(sv)){SLOT=n;clDirty={};W=null;startPlay()}else drawSlots()});
function pickSlot(){let n=0;try{n=+localStorage.getItem(SAVEKEY+'_slot')||0}catch(e){}SLOT=n<NSLOT?n:0}
let last=0;
function frame(t){const dt=Math.min(.05,(t-last)/1000||0);last=t;tNow=t/1000;
  if(mode==='play'){if(hitStop>0)hitStop-=dt;else update(dt);if(G&&W&&(mode==='play'||mode==='dying'))hud()}
  else if(mode==='dying'&&DY){DY.t+=dt;tickFx(dt*.6);shake=Math.max(0,shake-dt*20);if(DY.t>2.5&&!DY.shown){DY.shown=1;showDeath()}}
  if(mode==='scene'&&SC)drawScene(dt);else render();
  requestAnimationFrame(frame)}
function start(d){resize();pickSlot();accLoad();drawCls();let hotSave=null;try{if(d&&d.save)hotSave=JSON.parse(d.save)}catch(e){}
  if(hotSave&&applySave(hotSave))startPlay();else showContinue()
  requestAnimationFrame(frame)}
const hot=window.claude&&window.claude.hot;
try{if(hot&&hot.snapshot)hot.snapshot(()=>G&&mode!=='title'?{save:JSON.stringify(saveObj())}:{})}catch(e){}
if(hot&&hot.ready)hot.ready(start);else start((hot&&hot.data)||{});
/* ================= the card at the front =================
   Shown before anything else, the way a certain cartoon does it: deadpan, brief, and with
   the turn at the end. It holds the screen, so anything that drives this page without a
   person in front of it calls skipDisc() first. */
let discT=null;
function skipDisc(){if(discT){clearTimeout(discT);discT=null}const d=$('disc');if(!d||d.hidden)return;
  d.classList.remove('in');setTimeout(()=>{d.hidden=true},520)}
function showDisc(){const d=$('disc');if(!d)return;
  d.hidden=false;requestAnimationFrame(()=>d.classList.add('in'));
  /* long enough to read without being a toll booth; a tap anywhere cuts it short */
  discT=setTimeout(skipDisc,7200);
  const go=e=>{if(e.type==='keydown'&&e.key==='Tab')return;skipDisc();
    removeEventListener('pointerdown',go,true);removeEventListener('keydown',go,true)};
  addEventListener('pointerdown',go,true);addEventListener('keydown',go,true)}
showDisc();
cloudInit();
window.__g={heroAct,actRoman,heroDead,startPlay,slotInfo,drawSlots,get CLD(){return CLD},skipDisc,boonRefund,applySave,spawn,schemaAsk,setMode(m){mode=m},maxiCheck,maxiOn,drawCls,maxiAura,maxiBuff,drawSheet,webPts,webNext,DTY,RES,SKF,BUILDS,mktQuote,mktTrade,mktPost,mktCancel,mktTick,mktFair,mktMid,mktBid,mktAsk,mktSpread,mktDepth,mktNews,mktBorrow,mktRepay,mktInit,scenes(){const o={INTRO,RESCUE,ENDING1:endingSlides(),INTRO2,ENDING2,INTRO3,ENDING3,END_LEAVE,END_WAKE,RESERVE,STALE,FAIL};for(const k in SQ)SQ[k].steps.forEach((st,i)=>{if(st.scene)o['sq_'+k+i]=st.scene});return o},get G(){return G},get W(){return W},get P(){return P},get S(){return S},get mode(){return mode},ZONES,QUESTS,storyStep,actOf,townOf,finalChoice,PREZ,tagRender,tagMenu,tagDismiss,SQ,sqOpen,recOk,ltEnd,BUILDS,get ACC(){return ACC},bullStart,legTake,mkFixed,UNI,sl,hit,setDT(v){DT=v},RES,fateOf,campStart,sway,setShill(v){shillT=v},update,attack,stim,CLS,ET,ZONES,subStart,powStart,mkCharm,dodge,talkFloat,simChoice,craft,get SB(){return SB},repop,usePortal,closeSheet,dmgEnemy,kill,evStart,socketWord,addAdopt,get EV(){return EV},SQ,sqUse,useObj,shapeShift,bounties,SKF,tanks,get satShop(){return satShop},itemDelta,equipBest,get SWAP(){return SWAP},hurt,hurtAlly,sfx,music,get AC(){return AC},get MU(){return MU},enter,cast,newGame,keys,openSheet,makeItem,calc,gainXp,save,openPortal,talkTo,playScene,ENDING,endingSlides,goalPt,INTRO2,ENDING2,ZS:()=>ZS,get OPT(){return OPT},fxPatch,fxTrail,fxMark,fxOrbit,fxTrim,fxBind,parts,light,render,fxShow,get LIGHTS(){return LIGHTS},SKV,skvOf,skvPlay,glyph,setSkillButtons,stateMarks,maxiSet,anonDump,auraVisR,get MP(){return MP},mpZone,mpMovePkt,mpNoteCast,mpNoteSwing,toxicSwing,nearbyAllies,auraFoes,nodeMul,actDone,mpRecv,dropWeights,partyDropN,WALK,walkChoose,walkOffer,walkState,fillSlide};
