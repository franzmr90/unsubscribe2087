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
 {art:'nipper',text:'The lawns are four centimetres. Something lower than the grass crosses and is gone. “That was not a drone.” Gramps does not look up. “Dog.” “Dogs do not have that many opinions.” “Then it was somebody\u2019s visor, and it got out. Keep walking. The invasion already happened. It had a terms of service.”'},
 {art:'title',title:'ACT I',text:'The Regional Office'}];
const RESCUE=[{art:'cage',text:'The bars are warm from the racks. Inside sits a woman with ink on her fingers, reading a book that is not there. “Eleven thousand volumes,” she says, tapping her temple. “They could not price what they could not find.”'},
 {art:'cage',text:'“I am Marrow. I will walk to Stillwater on my own, thank you. Bring me what the machines drop, and I will tell you its true name. It is all I have, and I give it freely.”'}];
const ENDING=[];
Object.assign(ART,{
 nipper(g,w,h,t){const s=g.createLinearGradient(0,0,0,h);s.addColorStop(0,'#141018');s.addColorStop(.4,'#3a2c28');s.addColorStop(.52,'#1a2818');s.addColorStop(1,'#0c140e');g.fillStyle=s;g.fillRect(0,0,w,h);
  const hy=h*.58;g.fillStyle='#101a12';g.fillRect(0,hy,w,h);g.strokeStyle='#2d4a34';g.lineWidth=1.2;
  for(let i=0;i<90;i++){const x=i*w/90+((i%3)-1)*2,bh=5+hsh(i)*9;g.beginPath();g.moveTo(x,hy+3);g.lineTo(x+(hsh(i+4)-.5)*2,hy-bh);g.stroke()}
  const px=w*.74,py=hy+6;g.fillStyle='#4a4036';g.fillRect(px-16,py-48,32,42);g.fillStyle='#c9a184';g.beginPath();g.arc(px,py-56,9,0,6.283);g.fill();g.fillStyle='#e6e2d6';g.beginPath();g.arc(px,py-52,5.5,0,3.14);g.fill();
  g.strokeStyle='#6a5a40';g.lineWidth=2.4;g.beginPath();g.moveTo(px+14,py-28);g.lineTo(px+16,py+8);g.stroke();
  if(t>3.4)return;const x=((t*(w+90)*.42)%(w+120))-70,y=hy+2;
  g.save();g.translate(x,y);g.strokeStyle='#c8a55a';g.lineWidth=2.2;g.beginPath();g.arc(0,-1,16,.2,2.94);g.stroke();g.fillStyle='rgba(89,224,230,.8)';g.fillRect(-9,-3,18,3);
  g.strokeStyle='#8a8478';g.lineWidth=1.3;for(let i=0;i<8;i++){const lx=-12+i*3.4,lift=Math.sin(t*18+i)*3;g.beginPath();g.moveTo(lx,2);g.lineTo(lx+(i-3.5)*.6,12+lift);g.stroke()}g.restore();
  g.strokeStyle='#3e6b46';g.lineWidth=1.5;for(let i=0;i<16;i++){const gx=x-36+i*5,bh=7+hsh(i+21)*11;g.beginPath();g.moveTo(gx,hy+10);g.lineTo(gx+(hsh(i+8)-.5)*2,hy+10-bh);g.stroke()}},
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
let UI_LAST=null,uiTouchAt=0;
function uiProbe(){try{const c=matchMedia('(pointer: coarse)').matches,h=matchMedia('(hover: none)').matches,p=navigator.maxTouchPoints||0,small=Math.min(innerWidth,innerHeight)<820||innerWidth<900;return !!(c||(h&&p>0)||(p>0&&small))}catch(e){return false}}
function uiTouch(){const o=OPT&&OPT.ui||'auto';if(o==='touch')return true;if(o==='mouse')return false;if(UI_LAST==='touch')return true;if(UI_LAST==='mouse')return false;return uiProbe()}
function uiSay(mouse,touch){return uiTouch()?touch:mouse}
function slideLine(s){if(!s)return '';if(s.mouse||s.touch)return uiTouch()?(s.touch||s.mouse||''):(s.mouse||s.touch||'');return s.text||''}
function slotKeyLabel(k){return uiTouch()?('Button '+(k+1)):`Key ${k+1}`}
function uiTitles(){const t=uiTouch();const set=(id,touch,mouse)=>{const el=$(id);if(el)el.title=t?touch:mouse};set('bAtk','Attack','Space, or hold left click on a machine');set('bDodge','Dodge','Shift');set('bPot','Stim','Q');set('bMap','Map','Tab');set('bRecall','Portal','T')}
function uiApply(redraw){const t=uiTouch();const prev=document.documentElement.dataset.ui;document.documentElement.dataset.ui=t?'touch':'mouse';const ban=$('uiPort');if(ban){const narrow=Math.min(innerWidth,innerHeight)<700,portrait=innerHeight>innerWidth+40;ban.hidden=!(t&&portrait&&narrow)||ban.dataset.gone==='1'}uiTitles();if(typeof mouseKey!=='undefined')mouseKey='';if(redraw&&prev!==document.documentElement.dataset.ui){if($('sheet')&&!$('sheet').hidden&&typeof drawSheet==='function')drawSheet();const pk=$('mPick');if(pk&&!pk.hidden&&typeof paintPick==='function')paintPick();if(mode==='title'&&typeof drawSlots==='function')drawSlots()}}
function uiBoot(){let stored='';try{stored=localStorage.getItem('u2087-ui')||''}catch(e){}if(stored!=='touch'&&stored!=='mouse'&&OPT&&(OPT.uiSeen==='touch'||OPT.uiSeen==='mouse'))stored=OPT.uiSeen;if(stored==='touch'||stored==='mouse')UI_LAST=stored;lootLoad();uiApply(false)}
function noteInput(kind){if(kind!=='touch'&&kind!=='mouse')return;if(OPT&&OPT.ui&&OPT.ui!=='auto')return;if(UI_LAST===kind)return;UI_LAST=kind;try{localStorage.setItem('u2087-ui',kind)}catch(e){}if(OPT)OPT.uiSeen=kind;uiApply(true)}
function uiWatch(e){if(!e)return;if(e.type==='keydown'){if(e.repeat)return;const tag=e.target&&e.target.tagName;if(tag==='TEXTAREA'||tag==='INPUT')return;noteInput('mouse');return}const pt=e.pointerType||(e.touches?'touch':'');if(pt==='touch'||pt==='pen'){uiTouchAt=performance.now();noteInput('touch');return}if(pt==='mouse'){if(performance.now()-uiTouchAt<800)return;if(e.type==='pointermove'&&!e.movementX&&!e.movementY)return;noteInput('mouse')}}
function uiPad(){try{const pads=navigator.getGamepads?navigator.getGamepads():null;if(!pads)return;for(const g of pads){if(g&&g.buttons&&[...g.buttons].some(b=>b&&b.pressed)){noteInput('mouse');return}}}catch(e){}}
const CTRL={
mouse:'On a desk the mouse leads. Left click walks, and left click on a machine walks you into range and uses the left skill, which starts as Attack. Right click casts the right skill at the pointer. Ground skills show that area when Options is set to Drag to aim, and on a desk the area follows the pointer. Auto drags on a touch screen and casts at once on a desk. A right click on a machine walks you into range. A right click on the ground stays where you point. Hold either button to keep at it. Shift and a click swings or casts without a step. The two slots beside the orbs open the skill list. The left list is Attack and the blows, throws and shots. F1 through F8, while that list is open and a skill is under the pointer, bind it. Those same keys in a fight put the binding on the right button. The wheel cycles those bindings. WASD and the arrows still walk. Space swings. Q is the stim. Shift dodges. E uses what you are standing on. T is the portal. Tab is the map. I or B opens the pack. C is the hero. H is this guide. Esc closes a list or a panel. Alt, held, names every item on the ground. There is no second weapon set, and no walk toggle: you run.',
touch:'On a phone, the stick walks. Attack, three skills, a stim and Dodge sit under the right thumb. Tap a machine, or hold Attack, and you walk in and swing. A quick tap on a ground skill hits the nearest machine you can see, or the open ground in front of you when none is in reach. Hold a ground skill for a fifth of a second and the aim appears. Drag it, then let go. Drag away from the button and the area moves that way from you: further from the button puts it further out, up to its reach, and back toward the button brings it in. A ring around the button shows that drag. Drag it back onto the button and let go, or onto Cancel, and it costs nothing. A blink, a leap or a teleport hops a short way along your facing, or along the stick while you walk, and it will not land on a machine. Hold that button and a marker shows where you arrive, inside its reach and on ground you can walk. Tap Dodge to step out of an orange circle. Tap the stim to drink. Tap a name on the ground for Pick up and Compare. Hold Names to show every name. Stand on a person, a door or a portal and tap the button that appears. Menu, at the bottom left, opens the pack, the hero, skills, and this guide.'
};

const WALK={
basics:[
 {art:'wanderer',title:'Your hands',mouse:'On a desk, left click walks. Hold it and you keep following the pointer. Left click on a machine walks you in and uses the left skill, which starts as Attack. Right click casts the right skill where you point, and holding it casts again. Shift with a click does either one without a step. The two slots beside the life and energy orbs open the list. Hover a skill there and press F1 to F8 to bind it. Those keys, and the wheel, put a binding on the right slot. WASD and the arrows still walk. Space swings.',touch:'On a phone, the stick walks, and Attack, three skills, a stim and Dodge sit under the right thumb. A quick tap on a ground skill hits the nearest machine you can see, or the open ground in front of you when none is in reach. Hold a ground skill for a fifth of a second and the aim appears. Drag it, then let go. Drag away from the button and the area moves that way from you. Further from the button puts it further out, and back toward the button brings it in. Drag it back onto the button and let go, or onto Cancel, and it costs nothing. A blink, a leap or a teleport hops a short way along your facing, or along the stick while you walk, and it will not land on a machine. Hold that button and a marker shows where you arrive, inside its reach and on ground you can walk. Tap Dodge to step out of an orange circle. Tap the stim to drink.'},
 {art:'feed',title:'The swing',mouse:'On a desk, hold the left button on a machine and you keep swinging. Space does that swing too. Shift dodges. The orange circles on the ground are the ones to leave. E uses what you are standing on. Left click walks you up to a person, a drop, a door or a portal and uses it. Alt, held, puts a name on everything on the ground.',touch:'Hold Attack and you keep swinging. Tap Dodge to spend a little energy and step out of a telegraph. The orange circles on the ground are the ones to leave. Stand on something and tap the button that appears.'},
 {art:'ticker',title:'What the screen is saying',mouse:'The left orb is life. The right is energy. A skill slot sits outside each one: left click and right click. Between them: the district, a bar for the next level, and your credits. Credits rot. I or B opens the pack, C opens the hero, and H opens this guide. Esc closes a panel. Tab is the map. T opens a portal home, and it will not open with a machine in your face.',touch:'The left orb is life. The right is energy. Between them: the district, a bar for the next level, and your credits. Credits rot. Menu is the bottom left. It opens the pack, the hero, and this guide.'},
 {art:'dawn',title:'A level',mouse:'When the bar fills you gain a level, and points. Hero spends attribute points: Might, Reflex, Vitality, Bandwidth. Skills spends skill points. C opens Hero, and Skills is on the menu too. Rows open as you level. A point you have not spent does nothing. Might lifts a heavy weapon and plate, and it is what a Scrapper hits with. Reflex lifts a fast weapon, and a Runner’s throw. Bandwidth lifts a Deck or an Instrument, and a Technomancer’s spells. Vitality is life, and a Witness’s Thread.',touch:'When the bar fills you gain a level, and points. Tap Menu, then Hero, to spend attribute points: Might, Reflex, Vitality, Bandwidth. Skills spends skill points, on that same menu. Rows open as you level. A point you have not spent does nothing. Might lifts a heavy weapon and plate, and it is what a Scrapper hits with. Reflex lifts a fast weapon, and a Runner’s throw. Bandwidth lifts a Deck or an Instrument, and a Technomancer’s spells. Vitality is life, and a Witness’s Thread.'},
 {art:'cage',title:'Where a skill sits',mouse:'The two slots beside the orbs are what left and right click do. The left slot takes Attack and the blows, throws and shots. F1 to F8 bind a skill onto the right slot. Passives live on the Skills sheet. Only the ones you switch on are real, and in town you can swap them.',touch:'Attack is the big button. Three more skills sit on the thumb buttons. Passives live on the Skills sheet. Only the ones you switch on are real, and in town you can swap them.'},
 {art:'letters',title:'What they drop',mouse:'On a desk, a drop shows its name. Hover the name to compare it. Left click it and you walk over and pick it up. Hold Alt to show every name. E takes what you are standing on. Items wears it. A charm goes on the belt; in the pack it only takes space. A stronger piece says so before you put it on. Unidentified gear is a guess until Marrow names it for nothing, or Brenda appraises it for a fee. Weapons and armor wear down. Yellow on the doll means a piece is close to breaking. Red means it is broken and gives nothing. A red wash across the tile means a requirement you do not meet: the piece stays worn and grants nothing. Yellow still means it is close to breaking. Brenda, Nonce or Wren repairs one piece, or all of them, at the counter, for whole sats.',touch:'Tap the name for Pick up and Compare. Hold Names to show every name. Walking over gear picks it up if it fits, and no description opens. Sats and credits are still picked up. Items wears it. A charm goes on the belt; in the pack it only takes space. Double-tap a charm, or tap it and then an empty belt slot. A stronger piece says so before you put it on. Unidentified gear is a guess until Marrow names it for nothing, or Brenda appraises it for a fee. Weapons and armor wear down. Yellow on the doll means a piece is close to breaking. Red means it is broken and gives nothing. A red wash across the tile means a requirement you do not meet: the piece stays worn and grants nothing. Yellow still means it is close to breaking. Brenda, Nonce or Wren repairs one piece, or all of them, at the counter, for whole sats.'},
 {art:'board',title:'The work',mouse:'Quests sit on the left. Click the line to tuck it away. Gramps, on the bench in Stillwater, is where Act I starts. The Quests tab is the whole list. Story is the same events, written down as you would have heard them.',touch:'Quests sit on the left. Tap the line to tuck it away. Gramps, on the bench in Stillwater, is where Act I starts. The Quests tab is the whole list. Story is the same events, written down as you would have heard them.'},
 {art:'skyline',title:'Town',text:'Town fills your life and your energy, and it takes off a shape you were wearing. Brenda sells. Wren sells boxes. Nonce deals in sats. Brenda, Nonce and Wren each repair what you wear, for whole sats. Kestrel hires, and she will have a body walked back. The Transit Gate is the way out to a district. In the square, nothing is hunting you.'},
 {art:'clock',title:'When you fall',text:'Die, and you wake in the town of that act without what you were wearing. A portal in the square opens at the start of that district. The belt and the charms on it are on your body, where you fell, and the map marks it. The pack, your stims, and the lockbox stay. A share of the credits you were carrying is on the body and comes back when you do. Sats do not fall. A plain loaner stays in your hands, so the walk is not empty. Machines standing on the body step back when you return. Stand on the body and take your gear. Die again before that and there is a second body; each one keeps what it had. In town, Kestrel will have a body walked in for a few sats, so leaving does not lose it. A duel in the rig still costs nothing, and nobody drops an ear. Hardcore is a different promise, and it is switched on in Options, not here.'}
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
 {art:'mono',title:'How hard',text:'Options holds the difficulty. Hard and Brutal machines have more life and hit harder, and they pay experience to match. Act I is the level it was written. From the Cloud on, the old 12 to 72 is walked as 12 to 38. Hard adds 22 to that. Brutal adds 38. A district does not rise to meet you. Hard opens after you clear Act V on Normal. Brutal opens after you clear Act V on Hard. Hardcore is one life: if that hero dies, they are gone. Thin combat effects keeps your own telegraphs and marks, and drops the extra light. None of it changes until you say so. Once Act I is done, More on the Transit Gate raises the tier: each step adds 12 machine levels and puts the districts back.'}
]};
let walkT=0;
function walkArm(){if(walkT||!G||!G.walkNew)return;if(OPT.noWalk){G.walkNew=0;return}walkT=setInterval(()=>{if(!G||!G.walkNew||OPT.noWalk){if(G&&OPT.noWalk)G.walkNew=0;clearInterval(walkT);walkT=0;return}if(mode!=='play'||!$('dlg').hidden||!$('scene').hidden)return;if(!W||!W.z||!W.z.town||W.z.pre)return;clearInterval(walkT);walkT=0;walkOffer()},400)}
function walkTake(){const cb=$('noWalk');if(cb&&cb.checked){OPT.noWalk=true;save(true)}}
function playWalk(which){const slides=WALK[which];if(slides)playScene(slides,null,{back:1,hold:1})}
function walkChoose(fromTitle){const go=which=>{if(fromTitle){mode='title';$('title').hidden=false;$('hud').hidden=true;$('sheet').hidden=true}playWalk(which)};const leave=()=>{if(!fromTitle)return;mode='title';$('title').hidden=false;$('hud').hidden=true;$('sheet').hidden=true;music('scene')};dlg('Walkthrough','Two short walks. Basics is how you move, fight, and get back up. Advanced is the rig, the market, and the switches that change the fight. The world waits while you read.',[['Basics',()=>go('basics')],['Advanced',()=>go('advanced')],['Close',leave]])}
function walkOffer(){if(!G||!G.walkNew)return;G.walkNew=0;save(true);const go=which=>{walkTake();if(which)playWalk(which)};dlg('Before you go',uiSay('Stillwater can wait. There is a short guide to the mouse and getting back up. On a desk, left click walks and strikes, and right click casts. You can open it later from the top of the character list, from Options, or with H. Nothing starts until you ask.','Stillwater can wait. There is a short guide to the stick, the buttons, and getting back up. On a phone, the stick walks, and Attack swings. You can open it later from the top of the character list, or from Options. Nothing starts until you ask.'),[['Basics',()=>go('basics')],['Advanced',()=>go('advanced')],['Not now',()=>go(null)]]);const box=$('dBtns');if(box&&!$('noWalk')){const lab=document.createElement('label');lab.style.cssText='display:flex;align-items:center;gap:10px;font-size:14px;color:var(--ink)';const cb=document.createElement('input');cb.type='checkbox';cb.id='noWalk';lab.appendChild(cb);lab.appendChild(document.createTextNode('Don\u2019t show this again'));box.prepend(lab)}}
function walkState(){if(!SC)return null;return{i:SC.i,n:SC.slides.length,back:!!SC.back,hold:!!SC.hold,prev:SC.prev,next:$('scNext').textContent,backOn:!$('scBack').hidden,title:$('scTitle').textContent,mode}}
function fillSlide(){if(SC)SC.ch=1e6}
let SC=null;
function playScene(slides,done,o){o=o||{};SC={slides,i:0,ch:0,t:0,done,prev:mode,back:o.back?1:0,hold:o.hold?1:0};music('scene');mode='scene';$('scene').hidden=false;if(SC.prev==='title')$('title').hidden=true;J.x=J.y=0;atkHeld=false;showSlide()}
function showSlide(){const s=SC.slides[SC.i];SC.ch=0;SC.t=0;$('scTitle').textContent=s.title||'';$('scText').textContent='';$('scNext').textContent=SC.i===SC.slides.length-1?(SC.back?'Done':'Begin'):'Next';$('scNext').disabled=true;const bk=$('scBack');if(bk)bk.hidden=!(SC.back&&SC.i>0)}
function endScene(){const d=SC.done,prev=SC.prev,hold=SC.hold;$('scene').hidden=true;const bk=$('scBack');if(bk)bk.hidden=true;SC=null;if(hold&&prev==='title'){mode='title';$('title').hidden=false;$('hud').hidden=true;if(d)d();music('scene');setTimeout(flushQ,60);return}mode='play';if(d)d();music(zoneMusic());setTimeout(flushQ,60)}
const dlgQ=[];function flushQ(){if(mode!=='play')return;while(toastQ.length)toast(toastQ.shift());if(dlgQ.length){const a=dlgQ.shift();dlg(a[0],a[1],a[2],a[3])}}
function drawScene(dt){const s=SC.slides[SC.i],c=$('sc'),r=c.getBoundingClientRect(),d=Math.min(2,window.devicePixelRatio||1);if(c.width!==Math.round(r.width*d)||c.height!==Math.round(r.height*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}
  const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);SC.t+=dt;ART[s.art](g,r.width,r.height,SC.t);g.fillStyle='rgba(0,0,0,'+Math.max(0,1-SC.t*1.5)+')';g.fillRect(0,0,r.width,r.height);
  const body=slideLine(s);const n=Math.min(body.length,Math.floor(SC.ch+=dt*48));if($('scText').textContent.length!==n){const el=$('scText');el.textContent=body.slice(0,n);el.scrollTop=el.scrollHeight}$('scNext').disabled=n<body.length}
$('scNext').onclick=()=>{if(!SC||!SC.slides[SC.i])return;const s=SC.slides[SC.i];if(SC.ch<slideLine(s).length)return;sfx('ui');if(++SC.i>=SC.slides.length)endScene();else showSlide()};
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
  if(id==='paper')return eggPaper();
  if(id==='flyer')return eggFlyer();
  if(id==='obit')return eggBoard();
  if(id==='hello')return eggHelloFrame();
  if(id==='tariff')return scTariff();
  if(typeof arcTalk==='function'&&arcTalk(id))return;
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
    const stims=payTag(stimPrice()),loaves=stims>0?Math.floor(500/stims):0;
    return dlg('The Stipend','₡'+ubiPay+' deposited'+(ubiPay<500?' (halved: account under review)':'')+'. The base amount was set in 2051 and is reviewed never. At today’s prices it buys '+loaves+' stim'+(loaves===1?'':'s')+'.',[['Thank you, Unity']])}
  if(id==='gramps'){
    if(G.q.q1===0){G.q.q1=1;sfx('questnew');return dlg('Gramps','“You took the visor off. Good. Sit a moment, then get up again. The Regional Office is five districts deep and a man named Pryce sits at the end of it. Start with the Parcel Moors. A machine called HOA-9 turns our people back at the gate. Break it. And spend your credits fast, kid. They rot.”',[['I will break it']])}
    if(G.q.q1===2){G.q.q1=3;G.sp++;sfx('level');return dlg('Gramps','“Ha. Forty years of bylaws, gone.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q3===2){G.q.q3=3;G.sp++;sfx('level');return dlg('Gramps','“Go and see Marrow. She will name what you cannot, and she will not take a fee. She is the only one left who gives a thing away.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q6===2){G.q.q6=3;G.sp++;sfx('level');return dlg('Gramps','“The Cloud did not fall.” You gain 1 skill point.',[['Take it']])}
    if(G.q.q5===3&&!G.q.q6){G.q.q6=1;sfx('questnew');return dlg('Gramps','“There was a lift behind his desk, was there? Then that is where the Stipend really comes from. The Transit Gate reaches it now. They call it the Cloud. Somebody up there speaks for MANDATE, and I am told she is very, very kind. Be careful of that.”',[['I will go up']])}
    return dlg('Gramps','“'+gos('gramps')+'”',[['Farewell'],['Tell me more',()=>talkTo('gramps')]].concat(typeof arcGramps==='function'?arcGramps():[]))}
  if(id==='brenda'){
    if(G.q.q2===2){G.q.q2=3;G.disc=true;const it=makeItem(G.lvl+2,2,'ring');it.id=true;if(bagCan(it))G.bag.push(it);else addDrop({it},P.x,P.y);sfx('rare');return dlg('Brenda','“She smiled at me for six years without blinking.” You receive '+it.name+'. Brenda’s prices fall by 15%.',[['Thank you']])}
    if(scs()<500&&!(G.wonF&&G.wonF.brenda===1))return dlg('Brenda','“I am so sorry. It is your score. If I serve you, mine drops. Try the orange man; he does not seem to care about that sort of thing.”',[['Leave']]);
    return dlg('Brenda','“'+gos('brenda')+'”',[['Trade',()=>{shopVia=0;openVend('brenda')}],['Leave']].concat(typeof arcBrenda==='function'?arcBrenda():[]))}
  if(id==='wren')return dlg('Wren','“'+gos('wren')+'”',[['Open a mystery box',()=>openVend('gamble')],['Leave']].concat(typeof arcWren==='function'?arcWren():[]));
  if(id==='null'&&G.q.q7===2){G.q.q7=3;G.ap+=5;sfx('level');return dlg('Sister Null','“Let them grow.” You gain 5 attribute points.',[['Thank you']])}
  if(id==='null'){
    if(G.q.q4===2){G.q.q4=3;G.ap+=5;sfx('level');return dlg('Sister Null','“I felt two hundred accounts go quiet at once.” You gain 5 attribute points.',[['I am']])}
    if(briefReady('q4')){G.q.q4=1;sfx('questnew');return dlg('Sister Null','“Auditor Prime is a clerk, not a monster. It is closing accounts on Tribunal Row tonight, two hundred of them, and it will not stop because you are angry. Close the books. Then come and sit. I will feel it when they go quiet.”',[['I will close them']])}
    const cost=payTag(150*G.cpi*G.lvl);
    return dlg('Sister Null','“'+gos('null')+'”',[['Leave'],['Unlearn skills and attributes ('+fmt(cost)+')',()=>{if(G.credits<cost)return toast('Not enough credits');G.credits-=cost;let p=0;for(let i=0;i<G.sk.length;i++){p+=skSpent(G.sk[i]);G.sk[i]=0}G.sp+=p;const a=G.at;G.ap+=a.mgt+a.ref+a.vit+a.bnd;G.at={mgt:0,ref:0,vit:0,bnd:0};G.slots=[-1,-1,-1];delete G.schema;calc();setSkillButtons();toast('Your points are returned to you')}]])}
  if(id==='vr'){const b=G.simBest||0,cp=Math.floor(b/5)*5+1,go=(o)=>()=>{if(mpPortalBlocked())return;enter(6,o)};btn=[['Begin at wave 1',go({wave:1})]];if(b>=5)btn.push(['Begin at wave '+cp,go({wave:cp})]);const rushN=rushList().length;if(rushN)btn.push(['Boss rush: '+rushN+' in a row',go({rush:true})]);else btn.push(['Boss rush: nobody on the list yet',()=>dlg('Boss rush','Nobody is on the list yet. Clear a district, or beat a lieutenant, and the row fills in.',[['Understood']])]);if(recOk())btn.push(['Hack the simulation: change class',()=>openSheet('shift',{only:['shift']})]);else btn.push(['Hack the simulation (locked)',()=>dlg('The rig cannot do that yet','I can show you anyone. The town will not believe the face until I have your citizen record, the one page MANDATE keeps, and Act I does not keep those pages anywhere you can walk. Deleted ones sink into the Data Lake. The Archivist guards them. Bring yours back and I can rewrite it.',[['Understood']])]);if(G.seenIntro)btn.push(['Replay the prequel: The Compile, 2015',()=>{if(mpPortalBlocked())return;G.pre=1;G.preS=0;enter(PREZ)}]);btn.push([G.tag?'Rendered companion: '+G.tag.name:'Render one of your other characters',()=>tagMenu()]);btn.push(['The cabinet in the back',()=>offsiteOpen()]);btn.push(['Not now']);
    return dlg('VR Simulator','Kestrel left a note on the bezel. “I stole this off an Enforcer training floor and cut the leash. Waves grow larger, tougher and stranger, and a lieutenant walks in every fifth. You leave with experience, credits, and a lockbox every five waves. No other loot. Fall, and the floor puts you back: nothing in here was real, so nothing is lost. Your best: '+b+'.”',btn)}
  if(id==='kestrel'){const b=[[G.merc?(G.merc.dead?'Revive or replace your hire':'Change your hire'):'Hire a companion',()=>openSheet('merc',{only:['merc']})]];if(W.z.town)for(const c of G.corpses||[])b.push(['Walk back the body in '+((ZONES[c.zi]&&ZONES[c.zi].n)||'a district')+' · '+corpseFee(c)+' sats',()=>buyCorpse(c.id)]);b.push(['Leave']);return dlg('Kestrel','“'+gos('kestrel')+'”',b)}
  if(id==='nonce'&&G.q.q9===2){G.q.q9=3;G.sats+=40;sfx('coin');return dlg('Nonce','“Now nobody decides.” You receive 40 sats.',[['Thank you']])}
  if(id==='nonce'&&smearOpen())return smearAsk();
  if(id==='nonce'){const b=[['The exchange',()=>openSheet('sats',{only:['sats']})],['His goods',()=>{shopVia=0;openVend('sat')}]];if(cause())b.push(['Brenda’s goods, 30% off',()=>{shopVia=1;openVend('brenda')}]);b.push(['Leave']);return dlg('Nonce',cause()?'“They cut you off? Good. Means you said something true. Whatever Brenda will not sell you, I will, at thirty percent off her price. No charge for the favour.”':'“'+gos('nonce')+'”',b)}
  if(id==='marrow'&&G.q.q8===2){G.q.q8=3;G.sp++;sfx('level');return dlg('Marrow','“Nobody will read most of them.” You gain 1 skill point.',[['Take it']])}
  if(id==='marrow'){const n=unidCount();
    return dlg('Marrow','“'+gos('marrow')+'”',[[n?'Identify '+n+' item'+(n>1?'s':''):'Nothing to identify',()=>{if(idAll()){sfx('rare');toast('Marrow names your finds')}}],['Leave']])}
}

/* ================= HUD ================= */
const sbtn=[...document.querySelectorAll('.sk')].sort((a,b)=>a.dataset.i-b.dataset.i);
function setSkillButtons(){sbtn.forEach((b,i)=>{const k=G.slots[i];const face=k>=100&&itemSkillsReady?ISK[k]:(k>=0?CLS[G.cls].sk[k]:null);b.querySelector('b').textContent=face?face.ab:'';
  let c=b.querySelector('canvas.gl');if(!c){c=document.createElement('canvas');c.className='gl';c.width=24;c.height=24;b.insertBefore(c,b.querySelector('b'))}
  const g=c.getContext('2d');g.clearRect(0,0,24,24);if(k>=100&&face){g.fillStyle='#d0aa62';g.font='8px Cinzel,serif';g.textAlign='center';g.fillText(face.ab,12,15)}else if(k>=0)glyph(g,G.cls,k,24)})}
function paintGlyphs(root){if(!root||!root.querySelectorAll)return;root.querySelectorAll('canvas[data-gl]').forEach(function(c){const sz=+c.width||24;glyph(c.getContext('2d'),c.dataset.cls||G.cls,+c.dataset.gl,sz)})}
let hudC={};
function setT(id,v){if(hudC[id]!==v){hudC[id]=v;$(id).textContent=v}}
let hudPx={};
function hudSet(el,prop,val){if(!el)return;const k=el.id+'|'+prop;if(hudPx[k]===val)return;hudPx[k]=val;el.style[prop]=val}
function hud(){objHud();if(P&&P.dg)setT('dgn',P.dg.n);
  hudSet($('hpF'),'height',clamp(G.hp/S.maxHp*100,0,100)+'%');hudSet($('enF'),'height',clamp(G.en/S.maxEn*100,0,100)+'%');const rec=$('rec');if(rec){if(G.cls==='witness'){rec.hidden=false;hudSet($('recF'),'width',clamp(G.page||0,0,100)+'%')}else rec.hidden=true}const nx=xpNext(G.lvl),banked=!G.act3&&(G.bankXp||0)>0&&G.lvl>=lvlCap();hudSet($('xpb'),'width',(banked?Math.min(100,G.bankXp/nx*100):(G.lvl>=lvlCap()?100:G.xp/nx*100))+'%');const xpw=$('xpw');if(xpw)xpw.title=banked?'Banked '+Math.floor(G.bankXp)+' / '+nx+' until Act III':'';
  setT('hpT',OPT.orbNums?Math.ceil(G.hp):'');setT('enT',OPT.orbNums?Math.floor(G.en):'');setT('cr',fmt(G.credits)+(G.sats?' · '+G.sats+' sats':''));setT('cpi','prices ×'+(G.cpi<100?G.cpi.toFixed(2):fmt(G.cpi).slice(1)));setT('potn',G.stims);
  sbtn.forEach((b,i)=>{const k=G.slots[i];if(k<0||k===undefined||(k>=100?!itemSkillOn(k):!G.sk[k])){b.classList.add('off');return}const s=k>=100?ISK[k]:CLS[G.cls].sk[k];const blank=k>=100?false:!!witBlock(k);b.classList.toggle('off',(k<100&&!!hsBlocked(k))||blank);b.classList.toggle('low',!blank&&!(k<100&&G.cls==='homesteader'&&G.form&&(k===7||(k===1&&G.form==='hound')||(k===4&&G.form==='hull')))&&G.en<s.cost*(S.sp.hoodie?.75:1));const em=b.querySelector('em'),sc='scaleY('+clamp((P.cd[k]||0)/(s.cd*(1-Math.min(.6,S.cdr||0))),0,1)+')';if(em&&em._sc!==sc){em._sc=sc;em.style.transform=sc}});
  $('bMenu').classList.toggle('pip',G.sp>0||G.ap>0);$('bRecall').hidden=W.z.town;$('bMap').hidden=W.z.town;
  const sw=$('bSwap');if(SWAP&&(SWAP.t-=1/60)>0&&G.bag.includes(SWAP.it)){sw.hidden=false;setT('bSwap',uiSay('Click to equip','Tap to equip')+'\n'+SWAP.it.name)}else{sw.hidden=true;SWAP=null}
  cmpDock();
  const a=$('bAct');if(actTarget){a.hidden=false;setT('bAct',actTarget.label)}else a.hidden=true;
  const bn=$('bNames');if(bn)bn.hidden=!uiTouch();
  if(LOOT.card&&(!(W&&W.drops)||W.drops.indexOf(LOOT.card)<0))lootShut();
  if(W.boss&&W.boss.aggro){$('boss').hidden=false;setT('bossn',ET[W.boss.k].n+' · deals '+dealTxt(W.boss.k)+(resTxt(W.boss.k)?' · '+resTxt(W.boss.k):''));hudSet($('bossb'),'width',Math.max(0,W.boss.hp/W.boss.max*100)+'%')}
  const bf=[];if(!G.act3&&(G.bankXp||0)>0)bf.push('Banked experience '+Math.floor(G.bankXp));if(P.ward>0)bf.push('Ward '+Math.ceil(P.ward)+'s');const au=maxiBuff();if(au)bf.push('\u25c6 '+au);if(P.shr)bf.push(P.shr.n+' '+Math.ceil(P.shr.t)+'s');if(P.buff>0)bf.push('Frenzy '+Math.ceil(P.buff)+'s');if(P.guard>0)bf.push('War Horn '+Math.ceil(P.guard)+'s');if(P.slow>0)bf.push('Slowed');if(G.cls==='homesteader'&&G.form)bf.push(G.form==='hound'?'Hound':G.form==='hull'?'Hull':'Wearing a machine');if(G.god)bf.push('Untouchable (testing)');if(EV)bf.push(EVS[EV.k].n+' '+Math.ceil(EV.t)+'s');if(P.silence>0)bf.push('Silenced');if(W.pow)bf.push('Proof of work '+Math.ceil(W.pow.t)+'s');if(G.tpT>0)bf.push('On credit '+Math.ceil(G.tpT)+'s');if(W.sub)bf.push(W.sub.mods.map(m=>SUBM[m]).join(' · '));if(W.esc)bf.push(W.esc.name+' is with you');if(W.hold)bf.push('Node syncing '+Math.ceil(W.hold.t)+'s');if(P.streakT>0&&P.streak>=3)bf.push('Streak ×'+P.streak+' · +'+Math.round(Math.min(.5,.02*P.streak)*100)+'% experience');
  setT('buffs',bf.join('\n'));const bu=$('buffs');if(bu&&!bu._ws){bu._ws=1;bu.style.whiteSpace='pre'}paintMouseSlots()}

/* ================= sheets ================= */
let tab='items',sel=null,sheetCtx={},lastBox=null,VEND={kind:'brenda',tab:'weapons',who:'Brenda',side:'both'},STASHV={side:'box'},BUYBACK=[],vendDragged=false,stashDragged=false;
const TABS={party:'Party',web:'Web',char:'Hero',items:'Items',skills:'Skills',quests:'Quests',story:'Story',codex:'Codex',opts:'Options',shop:'Trade',gamble:'Boxes',travel:'Travel',load:'Load',merc:'Hire',sats:'Sats',vend:'Trade',bounty:'Bounties',stash:'Lockbox',shift:'Shape shift'};
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
const hireCost=()=>80+8*G.lvl,reviveCost=()=>cause()?0:40+4*G.lvl;
function openSheet(t,c){c=c||{};if(t!=='vend'){const only=c.only;const gamble=t==='gamble'||(!!only&&only.indexOf('gamble')>=0&&only.indexOf('shop')<0);const shop=t==='shop'||(!!only&&only.indexOf('shop')>=0&&only.indexOf('sats')<0);if(gamble||shop)return openVend(gamble?'gamble':'brenda')}if(mode!=='play'&&mode!=='title')return;cmpHide();if(typeof lootShut==='function')lootShut();sheetCtx=c||{};sheetCtx.from=mode;if(t==='web')webVB=null;tab=t;sel=null;mode='sheet';$('sheet').hidden=false;$('sheet').scrollTop=0;J.x=J.y=0;atkHeld=false;MO=null;const pk=$('mPick');if(pk)pk.hidden=true;$('stick').hidden=true;drawSheet()}
function closeSheet(){$('sheet').hidden=true;$('pop').hidden=true;if(sheetCtx.from==='title'){mode='title';return}mode='play';calc();setSkillButtons();save(true)}
function hitFactor(s){return (1+(s.dmg||0)/100)*(1+((s&&s.blow)||0)/100)}function pscore(s){const f=hitFactor(s);return{dps:((s.dmin+s.dmax)/2*f+s.shock)*(1+Math.max(-50,s.aspd)/100)*(1+Math.min(100,s.crit)/100*(s.critM-1)),ehp:s.maxHp*(1+s.armor/100)/(1-Math.min(.6,(s.dodge||0)/100))}}
/* how much stronger (+) or weaker (-) the hero gets by equipping this, as a fraction; null when it cannot be judged */
function itemDelta(it){if(!it||!it.id||it.charm||it.stim)return null;const A=S,B=statsWith(it.slot,it),a=pscore(A),b=pscore(B);
  return (b.dps/a.dps-1)+(b.ehp/a.ehp-1)+(B.maxEn-A.maxEn)/A.maxEn*.2+(B.mspd-A.mspd)*.004+(B.leech-A.leech)*.02+(B.skills-A.skills)*.15+(B.mf-A.mf)*.001+(B.gold-A.gold)*.0005+(B.regen-A.regen)*.02+(B.regenH-A.regenH)*.01+(B.stun-A.stun)*.005+(B.thorns-A.thorns)*.003+(Object.keys(B.sp).length-Object.keys(A.sp).length)*.12+(B.cap-A.cap)*.01}
const dPct=d=>(d>0?'+':'−')+Math.min(999,Math.round(Math.abs(d)*100))+'%';
function cell(it,attr,isSel,slot,d,price){if(!it){const hot=attr&&/data-packempty|data-csocket/.test(attr);return `<button class="cell empty" ${attr||''}${hot?'':' disabled'}>${slot?svgIcon(slot):''}</button>`}
  const arrow=!!(OPT.cmpArrow&&d!=null&&it.id&&!it.charm&&strictUp(it));
  const ch=it.charm?' ch'+(charmCost(it)>=3?' grand':charmCost(it)>=2?' wide':''):'',drag=(it.charm||it.stim)&&!uiTouch()&&!(attr&&attr.indexOf('data-vbag')>=0)?' draggable="true"':'',num=it.charm?charmCost(it):(it.stim?'':it.il);
  const dw=it.duraMax>0?(it.dura<=0?' brk':it.dura<=it.duraMax*.25?' thin':''):'';const rq=(!it.charm&&typeof reqBadgeText==='function')?reqBadgeText(it):'';
  const tag=price!=null?`<u class="vp">${price} sat${price===1?'':'s'}</u>`:'';
  const lk=it.lock?'<svg class="lk" viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0110 0v3h1v10H6V11h1zm2 0h6V8a3 3 0 00-6 0v3z"/></svg>':'';
  return `<button class="cell q${it.q}${isSel?' sel':''}${it.id?'':' unid'}${arrow?' arr':''}${it.junk?' junk':''}${it.lock?' seal':''}${ch}${dw}${rq?' req':''}" ${attr}${drag}>${svgIcon(it.charm?'charm':it.stim?'stim':it.slot)}<small>${num}</small>${dw?`<i class="dw">${it.dura<=0?'!':'·'}</i>`:''}${arrow?'<em>↑</em>':''}${rq?`<u class="rq">${esc(rq)}</u>`:''}${lk}${tag}${it.junk?'<u>JUNK</u>':''}</button>`}function equipFromBag(i){const it=G.bag[i];if(!it)return false;if(typeof tradeLocked==='function'&&tradeLocked(it))return false;if(it.charm){if(it.over&&typeof arcOver==='function')arcOver();return charmSocket(i)}if(it.stim)return stimToBelt(i);if(!it.id){toast('Identify it first');sfx('err');return false}if(it.pie||it.sour||it.hello)return eggUse(i);if(!canWear(it)){toast(typeof cantEquipText==='function'?cantEquipText(it):'Needs level '+it.req);sfx('err');return false}
  const old=G.eq[it.slot];G.eq[it.slot]=it;it.junk=false;G.bag.splice(i,1);if(old){if(bagCan(old))G.bag.push(old);else addDrop({it:old},P.x,P.y)}if(it.slot==='belt')charmRefit();calc();sfx('equip');return true}
function equipBest(){let n=0;for(const slot of SLOTS){let best=-1,bd=.01;G.bag.forEach((it,i)=>{if(it.slot!==slot||!canWear(it))return;const d=itemDelta(it);if(d>bd){bd=d;best=i}});if(best>=0&&equipFromBag(best))n++}return n}
function gearNow(s){const f=hitFactor(s);return{lo:Math.round(s.dmin*f+s.shock),hi:Math.round(s.dmax*f+s.shock),arm:s.armor}}
function planBest(){const before=gearNow(S);const bag0=G.bag.slice();const eq0={};for(const k in G.eq)eq0[k]=G.eq[k];const cs0=(G.cslots||[]).slice();const hp=G.hp,en=G.en,st=G.stims;const moves=[];
  for(const slot of SLOTS){let best=-1,bd=.01;G.bag.forEach((it,i)=>{if(it.slot!==slot||!canWear(it))return;const d=itemDelta(it);if(d!=null&&d>bd){bd=d;best=i}});if(best<0)continue;const it=G.bag[best];moves.push(it.name);const old=G.eq[slot];G.eq[slot]=it;G.bag.splice(best,1);if(old)G.bag.push(old);if(slot==='belt'){const max=beltBudget(it).slots;let used=0;const keep=[];for(const c of G.cslots||[]){const n=charmCost(c);if(c&&used+n<=max){keep.push(c);used+=n}}G.cslots=keep}calc()}
  const after=gearNow(S);for(const k in eq0)G.eq[k]=eq0[k];G.bag.splice(0,G.bag.length);for(let i=0;i<bag0.length;i++)G.bag.push(bag0[i]);G.cslots=cs0;G.hp=hp;G.en=en;G.stims=st;calc();return{before,after,moves}}
function bestAsk(){const p=planBest();if(!p.moves.length){toast('Nothing better in your pack');return}const A=p.before,B=p.after;const cls=(a,b)=>b>a?'up':b<a?'dn':'';const avg=x=>(x.lo+x.hi)/2;const dlt=(a,b)=>a===b?'same':(b>a?'+':'')+(b-a);
  const pop=`<div class="card"><div class="nm q4">Equip best</div><div class="ln off">${p.moves.map(esc).join(' · ')}</div><table class="dt"><tr><td>Damage</td><td>${A.lo}–${A.hi}</td><td>→ ${B.lo}–${B.hi}</td><td class="${cls(avg(A),avg(B))}">${dlt(Math.round(avg(A)),Math.round(avg(B)))}</td></tr><tr><td>Armor</td><td>${A.arm}</td><td>→ ${B.arm}</td><td class="${cls(A.arm,B.arm)}">${dlt(A.arm,B.arm)}</td></tr></table><div class="row" style="margin-top:6px"><button class="big" data-bestok="1">Equip these</button></div><div class="row"><button class="ghost" data-popx="1">Leave them</button></div></div>`;
  $('popIn').innerHTML=pop;$('pop').hidden=false;$('pop').scrollTop=0}
const DOLL={helm:'2/1',amulet:'3/1',weapon:'1/2',armor:'2/2',ring:'3/2',gloves:'1/3',belt:'2/3',boots:'2/4'};
function affText(a){if(a&&a.k==='csk'){const sk=a.cls&&CLS[a.cls]&&CLS[a.cls].sk[a.i];return '+'+a.v+' to '+(sk?sk.n:'a skill')+(a.cls&&CLS[a.cls]?' ('+CLS[a.cls].n+')':'')}if(a&&a.k==='en'&&a.v<0)return a.v+' to Energy';const spec=a&&AFK[a.k];return spec&&spec.t?spec.t.replace('{v}',a.v):'+'+(a?a.v:'')+' '+(a?a.k:'')}
function itemLines(it){let h='';
  if(it.dmin)h+=`<div class="ln">Damage: ${it.dmin} to ${it.dmax}</div><div class="ln">${it.spd>0?'Fast':it.spd<0?'Slow':'Normal'} attack speed</div>`;
  if(it.arm)h+=`<div class="ln">Armor: ${it.arm}</div>`;if(it.slot==='belt'){const b=beltBudget(it);h+=`<div class="ln">Holds ${b.stims} stims · ${b.slots} charm slot${b.slots===1?'':'s'}</div>`}else if(it.cap)h+=`<div class="ln">Holds ${it.cap} stims</div>`;if(it.indestruct)h+=`<div class="ln">Indestructible</div>`;else if(it.duraMax){const thin=it.dura>0&&it.dura<=it.duraMax*.25;h+=`<div class="ln${it.dura<=0?' red':''}"${thin?' style="color:#e0b03a"':''}>Durability: ${it.dura|0} of ${it.duraMax}${it.dura<=0?' · broken. It gives nothing until it is repaired.':(it.aff&&it.aff.some(a=>a&&a.k==='patch')?' · self-patching':'')}</div>`}if(it.loan)h+=`<div class="ln">A loaner. It stays in your hands when you fall, until your own weapon is back.</div>`
  if(it.charm){const word=it.sz==='filing'?'Filing':it.sz==='notice'?'Notice':'Slip',worn=(G.cslots||[]).indexOf(it)>=0;h+=`<div class="ln">${word} · ${charmCost(it)} belt slot${charmCost(it)===1?'':'s'} · ${charmCells(it)} pack cell${charmCells(it)===1?'':'s'}</div><div class="ln">${worn?'On the belt. It applies.':'Off the belt. It grants nothing until it is worn, and it does not stack.'}</div>`}
  if(it.stim)h+=`<div class="ln">${esc(STIM.pack)}</div>`;if(it.pie)it.fl=pieFl();if(it.free)h+=`<div class="ln">${esc(EGG.freeNote)}</div>`;else{h+=`<div class="ln${G.lvl<it.req?' red':''}">Required Level: ${it.req}</div>`;if(typeof reqLineHTML==='function')h+=reqLineHTML(it)}if(it.hello)h+=`<div class="ln off">${esc(EGG.brendaNo)}</div>`;
  if(it.fam){const F=FAM[it.fam],mine=F.cls===G.cls;h+=`<div class="ln" style="color:${mine?'#7be495':'var(--dim)'}">${CLS[F.cls].n} ${F.n.toLowerCase()}${it.id?': in a '+CLS[F.cls].n+'’s hands, +1 to all skills, '+F.perk+(mine?'':' (not your class)'):''}</div>`}
  if(it.dt&&it.id)h+=`<div class="ln" style="color:${DTY[it.dt].c}">Infused: your attacks deal ${DTY[it.dt].n} damage</div>`;
  if(it.soc)h+=`<div class="ln" style="color:#f7931a">Sockets: ${Array.from({length:it.soc},(_,i)=>it.words[i]?'['+it.words[i]+']':'[ empty ]').join(' ')}</div>`;
  if(!it.id)return h+`<div class="ln red">Unidentified</div><div class="ln off">Its magic properties are hidden. ${G.marrow?'Marrow identifies items for free.':'Brenda appraises items for a fee, under Trade.'}</div>`;
  for(const a of it.aff)h+=`<div class="ln mod"${a.w?' style="color:#f7931a"':''}>${affText(a)}${a.w?' · '+a.w:''}</div>`;const allR=it.aff&&it.aff.find(a=>a.k==='r_all');if(allR)h+=`<div class="ln off">All resist is +${allR.v} on Normal, ${allR.v-20} on Hard, and ${allR.v-50} on Brutal, before other gear and before the cap.</div>`;
  if(it.uid&&UNIK[it.uid]&&UNIK[it.uid].per){const per=UNIK[it.uid].per;for(const k in per)h+=`<div class="ln mod">+${per[k]} ${k==='mgt'?'Might':k==='mf'?'% magic find':k} per level</div>`}
  if(it.spT)h+=`<div class="ln spc"${uOk(it)?'':' style="opacity:.5"'}>${esc(it.spT)}${uOk(it)?'':' (dormant: not your class)'}</div>`;
  if(it.set){const s=SETS[it.set],n=S.set&&S.set[it.set]||0;h+=`<div class="ln setl" style="margin-top:4px">${esc(s.n)}</div>`+s.items.map(x=>`<div class="ln ${Object.values(G.eq).some(e=>e&&e.uid===x.id)?'setl':'off'}">${esc(x.n)}</div>`).join('')+`<div class="ln ${n>=2?'setl':'off'}">${s.b2}</div><div class="ln ${n>=3?'setl':'off'}">${s.b3}</div>`}
  if(it.fl)h+=`<div class="fl">${esc(it.fl)}</div>`;return h}
function sheetSwap(plan){
  const eq0={},hp=G.hp,en=G.en,st=G.stims,S0=S;
  const mouse=G.mouse?{L:G.mouse.L,R:G.mouse.R}:null;
  const slots=G.slots?G.slots.slice():null;
  const hot=G.hot?G.hot.slice():null;
  const pas=G.pas?G.pas.slice():null;
  const cs0=G.cslots?G.cslots.slice():[];
  let csSet=false,r=S0;
  try{
    for(const p of plan||[]){if(!p)continue;if(p.charm){G.cslots=(p.cslots||[]).slice();csSet=true;continue}if(!p.slot)continue;eq0[p.slot]=G.eq[p.slot];G.eq[p.slot]=p.it}
    calc();r=S
  }finally{
    for(const k in eq0)G.eq[k]=eq0[k];
    if(csSet)G.cslots=cs0;
    S=S0;G.hp=hp;G.en=en;G.stims=st;
    if(mouse&&G.mouse){G.mouse.L=mouse.L;G.mouse.R=mouse.R}
    if(slots&&G.slots)for(let i=0;i<slots.length&&i<G.slots.length;i++)G.slots[i]=slots[i];
    if(hot&&G.hot)for(let i=0;i<hot.length&&i<G.hot.length;i++)G.hot[i]=hot[i];
    if(pas)G.pas=pas.slice()
  }
  return r}
function statsWith(slot,it){return sheetSwap([{slot:slot,it:it}])}
/* A slow weapon is two-handed. A quick one is a single hand. There is one weapon slot and one ring slot. */
function itemHands(it){if(!it||it.slot!=='weapon')return 1;return (it.spd||0)<=-15?2:1}
function cmpTargets(it){
  const t=[];
  if(!it||it.charm||!it.slot||!SLOTS.includes(it.slot))return t;
  const hands=itemHands(it);
  const plan=[{slot:it.slot,it:it}];
  if(hands===2&&G.eq&&G.eq.offhand)plan.push({slot:'offhand',it:null});
  t.push({key:'you',who:'you',slot:it.slot,hands:hands,label:hands===2?'Two-handed':(SNAME[it.slot]||'You'),worn:G.eq?G.eq[it.slot]||null:null,plan:plan});
  if(G.merc&&!G.merc.dead&&MSL.includes(it.slot))t.push({key:'merc',who:'merc',slot:it.slot,hands:1,label:G.merc.name||'Companion',worn:G.merc[it.slot]||null,plan:null});
  return t}
let CMP_KEY='you';
function cmpPick(it,key){
  if(key)CMP_KEY=key;
  const ts=cmpTargets(it);
  let cur=ts.find(x=>x.key===CMP_KEY);
  if(!cur)cur=ts[0]||null;
  if(cur)CMP_KEY=cur.key;
  return {targets:ts,target:cur}}
function canWear(it){return !!(it&&it.id&&!it.charm&&it.slot&&G.lvl>=(it.req||0)&&(typeof reqOk!=='function'||reqOk(it,it.slot)))}
function sheetAvg(s){return ((s.dmin+s.dmax)/2)*hitFactor(s)+(s.shock||0)}
function strictUp(it){
  if(!canWear(it))return false;
  const A=S,B=statsWith(it.slot,it);
  return sheetAvg(B)>sheetAvg(A)&&B.armor>A.armor&&B.maxHp>A.maxHp}
/* Primary blow of the bound skill. A coefficient that already counts a volley keeps the count. Splashes that are a fraction of the same blow are the one blow. */
const SKHIT={
  scrapper:{0:L=>1.3+.15*L,1:L=>1.2+.2*L,3:L=>1.5+.22*L,4:L=>1.2+.3*L,7:L=>2.2+.35*L,12:L=>.55+.08*L},
  hacker:{0:L=>1.2+.18*L,1:L=>1.4+.2*L,3:L=>.9+.2*L,14:L=>2.8+.4*L},
  courier:{0:(L,s)=>(3+Math.floor(L/2)+((s.sp&&s.sp.pod)?2:0))*(.9+.1*L),7:L=>3+.5*L,9:L=>1.1+.16*L,12:L=>1+.14*L},
  maxi:{1:L=>1.4+.25*L,5:L=>1.6+.3*L,6:L=>(1.1+.22*L)*5},
  anon:{1:L=>1.6+.25*L,5:L=>1+.2*L,6:L=>1.4+.2*L,9:L=>.7+.1*L},
  founder:{1:L=>.8+.15*L,8:L=>2+.4*L}};
function boundIndex(){
  if(G.mouse&&G.mouse.L>=0&&G.mouse.L<100&&G.sk&&G.sk[G.mouse.L])return G.mouse.L;
  if(G.slots&&G.slots[0]>=0&&G.slots[0]<100&&G.sk&&G.sk[G.slots[0]])return G.slots[0];
  return -1}
function skillRank(i,s){
  const sk=(G.sk&&G.sk[i])||0,skl=CLS[G.cls]&&CLS[G.cls].sk&&CLS[G.cls].sk[i];
  const on=!!(skl&&(skl.a||(G.pas||[]).includes(i)));
  const b=sk&&on?sk+(s.skills||0)+(sk>=10?2:0):0,g=(s.grant&&s.grant[i])||0;
  return g?Math.max(b,g+sk):b}
function strikeInfo(s){
  const c=CLS[G.cls]||{mult:1,ivl:1,melee:false,sk:[]};
  const crit=Math.min(100,s.crit||0)/100,factor=1+crit*((s.critM||2)-1);
  let aura=1;if(P&&P.bear>0)aura*=1.28;if(P&&(P.book>0||P.rBook>0))aura*=1.08;
  const mid=((s.dmin+s.dmax)/2)*(1+(s.dmg||0)/100),shock=s.shock||0;
  const idx=boundIndex(),table=SKHIT[G.cls],fn=idx>=0&&table&&table[idx];
  if(fn){
    const L=skillRank(idx,s),mul=fn(L,s);
    if(mul>0){
      const hit=(mid*mul+shock*Math.max(.5,mul))*aura*factor;
      const sk=c.sk[idx],cd=(sk&&sk.cd||1)*(1-Math.min(.6,s.cdr||0))*((G.sk[idx]||0)>=10?.8:1);
      return {name:(sk&&sk.n||'Skill')+', per second',dps:Math.round((cd>0?hit/cd:0)*10)/10,kind:'skill',mul:mul,L:L}}
  }
  const two=!!(c.melee&&P&&P.two&&P.two.n>0);
  const ivl=two?c.ivl*1.75:(c.ivl/(1+Math.max(-50,s.aspd||0)/100));
  const hit=(mid+shock)*(c.mult||1)*aura*factor;
  return {name:(two?'Two-handed attack':'Attack')+', per second',dps:Math.round((ivl>0?hit/ivl:0)*10)/10,kind:'attack',ivl:ivl}}
function swingHit(s){
  const c=CLS[G.cls]||{mult:1};
  const mid=((s.dmin+s.dmax)/2)*(1+(s.dmg||0)/100)+(s.shock||0);
  let aura=1;if(P&&P.bear>0)aura*=1.28;if(P&&(P.book>0||P.rBook>0))aura*=1.08;
  const crit=Math.min(100,s.crit||0)/100;
  return mid*(c.mult||1)*aura*(1+crit*((s.critM||2)-1))}
function itemSkillNames(eq){
  const names=[];
  if(!eq)return names;
  for(const sl of SLOTS){
    const it=eq[sl];if(!it||!it.uid)continue;
    const u=UNIK[it.uid];if(!u||!u.isk||!uOk(it))continue;
    const sk=typeof ISK!=='undefined'&&ISK[u.isk];
    names.push(sk&&sk.n?sk.n:('Item skill '+u.isk))}
  return names}
function eqNow(){const o={};for(const sl of SLOTS)o[sl]=G.eq[sl]||null;return o}
function eqPlanned(plan){const o=eqNow();for(const p of plan||[])if(p&&p.slot&&SLOTS.includes(p.slot))o[p.slot]=p.it||null;return o}
function spText(k){
  if(UNIK[k]&&UNIK[k].sp)return UNIK[k].sp;
  if(k==='vigil')return 'Kills restore 3% life';
  return k}
function cmpRows(A,B,skA,skB){
  const rows=[],add=(name,a,b,unit,goodDown)=>{
    const d=Math.round((b-a)*10)/10;if(!d)return;
    rows.push({name:name,d:d,unit:unit||'',good:goodDown?d<0:d>0})};
  const rng=s=>{const lo=Math.round(s.dmin*(1+s.dmg/100)+s.shock),hi=Math.round(s.dmax*(1+s.dmg/100)+s.shock);return {lo:lo,hi:hi,avg:(lo+hi)/2}};
  const ra=rng(A),rb=rng(B);
  if(ra.lo!==rb.lo||ra.hi!==rb.hi)rows.push({name:'Damage',d:Math.round((rb.avg-ra.avg)*10)/10,unit:'',good:rb.avg>ra.avg,range:1,from:ra.lo+'–'+ra.hi,to:rb.lo+'–'+rb.hi});
  add('Attack',Math.round(swingHit(A)*10)/10,Math.round(swingHit(B)*10)/10,'');
  const sa=strikeInfo(A),sb=strikeInfo(B);
  if(sa.name===sb.name)add(sa.name,sa.dps,sb.dps,'');
  else{if(sa.dps)rows.push({name:sa.name,d:-sa.dps,unit:'',good:false,text:'lost'});if(sb.dps)rows.push({name:sb.name,d:sb.dps,unit:'',good:true,text:'gained'})}
  add('Armor',A.armor,B.armor,'');
  add('Life',A.maxHp,B.maxHp,'');
  add('Energy',A.maxEn,B.maxEn,'');
  for(const k of RTK)add((DTY[k]?DTY[k].n:k)+' resist',resEff(A,k),resEff(B,k),'%');
  add('Faster cast',Math.round(Math.min(60,(A.cdr||0)*100)),Math.round(Math.min(60,(B.cdr||0)*100)),'%');
  add('Run speed',A.mspd||0,B.mspd||0,'%');
  add('Damage reduced',Math.min(50,A.pdr||0),Math.min(50,B.pdr||0),'%');
  add('Might',A.mgt||0,B.mgt||0,'');
  add('Reflex',A.ref||0,B.ref||0,'');
  add('Vitality',A.vit||0,B.vit||0,'');
  add('Bandwidth',A.bnd||0,B.bnd||0,'');
  add('All skills',A.skills||0,B.skills||0,'');
  const seen={};for(const src of [A.grant||{},B.grant||{}])for(const i in src)seen[i]=1;
  for(const i in seen){
    const a=(A.grant&&A.grant[i])||0,b=(B.grant&&B.grant[i])||0;if(a===b)continue;
    const nm=CLS[G.cls]&&CLS[G.cls].sk[i]?CLS[G.cls].sk[i].n:('Skill '+i);
    add(nm,a,b,'')}
  const skn=CLS[G.cls]&&CLS[G.cls].sk||[];
  for(let i=0;i<skn.length;i++){
    const a=skillRank(i,A),b=skillRank(i,B);if(a===b)continue;
    const ga=(A.grant&&A.grant[i])||0,gb=(B.grant&&B.grant[i])||0;
    if(ga!==gb&&(b-a)===(gb-ga))continue;
    add((skn[i].n||('Skill '+i))+' rank',a,b,'')}
  add('Deadly strike',A.crit||0,B.crit||0,'%');
  add('Attack speed',A.aspd||0,B.aspd||0,'%');
  add('Life steal',A.leech||0,B.leech||0,'%');
  add('Energy stolen',A.enleech||0,B.enleech||0,'%');
  add('Stun chance',A.stun||0,B.stun||0,'%');
  add('Magic find',A.mf||0,B.mf||0,'%');
  add('Extra credits',A.gold||0,B.gold||0,'%');
  add('Stim capacity',A.cap||0,B.cap||0,'');
  add('Shock',A.shock||0,B.shock||0,'');
  add('Dodge',A.dodge||0,B.dodge||0,'%');
  add('Thorns',A.thorns||0,B.thorns||0,'');
  add('Energy per second',A.regen||0,B.regen||0,'');
  add('Life per second',A.regenH||0,B.regenH||0,'');
  add('Damage blocked',Math.round(100-10000/(100+(A.armor||0))),Math.round(100-10000/(100+(B.armor||0))),'%');
  for(const k of RTK.concat(['sound'])){const nm=(DTY[k]&&DTY[k].n||k)+' damage';add(nm,A['t_'+k]||0,B['t_'+k]||0,'%')}
  const have=new Set(skA||[]),next=new Set(skB||[]);
  for(const n of next)if(!have.has(n))rows.push({name:n,d:1,unit:'',good:true,text:'gained'});
  for(const n of have)if(!next.has(n))rows.push({name:n,d:-1,unit:'',good:false,text:'lost'});
  const pa=A.sp||{},pb=B.sp||{};
  for(const k in pb)if(!pa[k])rows.push({name:spText(k),d:1,unit:'',good:true,text:'gained'});
  for(const k in pa)if(!pb[k])rows.push({name:spText(k),d:-1,unit:'',good:false,text:'lost'});
  return rows}
function mercRows(it){
  const m=G.merc,slot=it.slot,old=m[slot];
  const A=mercStats();let B=A;
  try{m[slot]=it;B=mercStats()}finally{m[slot]=old}
  const rows=[],add=(name,a,b,unit,goodDown)=>{const d=Math.round((b-a)*10)/10;if(!d)return;rows.push({name:name,d:d,unit:unit||'',good:goodDown?d<0:d>0})};
  add('Life',A.max,B.max,'');
  add('Damage',Math.round(A.dmg*10)/10,Math.round(B.dmg*10)/10,'');
  add('Damage taken',Math.round(A.red*1000)/10,Math.round(B.red*1000)/10,'%',true);
  return {rows:rows,before:A,after:B}}
function charmNext(it,off){
  const cur=(G.cslots||[]).slice(),on=cur.indexOf(it)>=0;
  if(off||on)return{next:cur.filter(c=>c!==it),worn:on,blocked:null,why:''};
  const why=charmWhy(it);
  if(why)return{next:cur,worn:false,blocked:'fit',why:why};
  return{next:cur.concat([it]),worn:false,blocked:null,why:''}}
function cmpCharmEval(it,off){
  const out={ok:false,blocked:null,rows:[],why:'',worn:false,charm:true};
  if(!it||!it.charm){out.blocked='no';return out}
  if(!it.id){out.blocked='unid';return out}
  if(G.lvl<(it.req||1)){out.blocked='level';return out}
  const plan=charmNext(it,off);
  out.worn=plan.worn;out.why=plan.why;
  if(plan.blocked){out.blocked=plan.blocked;return out}
  const B=sheetSwap([{charm:1,cslots:plan.next}]);
  out.ok=true;out.rows=cmpRows(S,B,[],[]);
  return out}
function shiftQuietNote(cls,key){
  if(!key||key==='?'||key==='0')return 'Attributes come back unspent. Gear you no longer meet stays on and grants nothing until you spend.';
  const B=BUILDS[cls]&&BUILDS[cls].find(b=>b.k===key);if(!B||typeof gearLive!=='function')return '';
  const ap=(G.ap||0)+(G.at.mgt||0)+(G.at.ref||0)+(G.at.vit||0)+(G.at.bnd||0);
  const ks=['mgt','ref','vit','bnd'],at={mgt:0,ref:0,vit:0,bnd:0};let left=ap;
  ks.forEach((k,j)=>{const n=Math.floor(ap*B.at[j]/100);at[k]=n;left-=n});
  at[ks[B.at.indexOf(Math.max(...B.at))]]+=left;
  const old=G.at;G.at=at;const names=[];
  try{const g=gearLive(null);for(const sl of SLOTS){const it=G.eq[sl];if(!it||itemBroken(it)||g.live[sl])continue;if(!(it.reqMgt||it.reqRef||it.reqBnd)&&G.lvl>=(it.req||0))continue;const sh=reqShortfall(it);const bit=sh.map(f=>'Need +'+f.short+' '+f.name).join(', ');names.push((it.name||it.base)+' will go quiet'+(bit?'. '+bit:''))}}finally{G.at=old}
  return names.join('. ')}
function shiftQuietHTML(cls,key){const q=shiftQuietNote(cls,key);return q?`<span style="color:var(--bad)">${esc(q)}</span>`:''}
function cmpEval(it,opt){
  opt=opt||{};
  if(it&&it.charm)return cmpCharmEval(it,!!(opt&&opt.off));
  const out={ok:false,blocked:null,rows:[],before:S,after:null,target:null,targets:[],merc:false,gain:[],loss:[]};
  if(!it||!it.slot){out.blocked='no';return out}
  if(!it.id){out.blocked='unid';return out}
  if(opt.off){
    const plan=[{slot:it.slot,it:null}];
    const B=sheetSwap(plan);
    const skA=itemSkillNames(eqNow()),skB=itemSkillNames(eqPlanned(plan));
    out.ok=true;out.after=B;out.rows=cmpRows(S,B,skA,skB);
    out.gain=skB.filter(n=>skA.indexOf(n)<0);out.loss=skA.filter(n=>skB.indexOf(n)<0);
    out.target={key:'you',who:'you',worn:null,label:'With it off'};
    cmpMarkBroken(out,it,null);
    return out}
  const pick=cmpPick(it,opt.key);
  out.targets=pick.targets;out.target=pick.target;
  if(!pick.target){out.blocked='no';return out}
  if(pick.target.who==='merc'){
    out.merc=true;out.ok=true;
    const m=mercRows(it);out.rows=m.rows;out.before=m.before;out.after=m.after;
    return out}
  if(!canWear(it)){const sh=typeof reqShortfall==='function'?reqShortfall(it):[];out.blocked=(G.lvl<(it.req||0)&&!sh.length)?'level':'req';out.why=typeof cantEquipText==='function'?cantEquipText(it):'';out.ok=false;return out}
  const plan=pick.target.plan||[{slot:it.slot,it:it}];
  const skA=itemSkillNames(eqNow()),skB=itemSkillNames(eqPlanned(plan));
  const B=sheetSwap(plan);
  out.ok=true;out.after=B;out.rows=cmpRows(S,B,skA,skB);
  out.gain=skB.filter(n=>skA.indexOf(n)<0);out.loss=skA.filter(n=>skB.indexOf(n)<0);
  cmpMarkBroken(out,it,pick.target&&pick.target.worn);
  return out}
function cmpMarkBroken(out,it,worn){if(typeof itemBroken!=='function'||!out||!out.rows)return;if(worn&&itemBroken(worn))out.rows.unshift({name:'Worn piece',d:-1,unit:'',good:false,text:'broken'});if(itemBroken(it))out.rows.unshift({name:'This piece',d:-1,unit:'',good:false,text:'broken'})}
function sgn(n,unit){const v=Math.round(n*10)/10,sign=v>0?'+':v<0?'−':'';return sign+Math.abs(v)+(unit||'')}
function cmpRowsHTML(rows){
  if(!rows||!rows.length)return '<div class="ln off">No change to your stats.</div>';
  return '<div class="cmpDelta">'+rows.map(r=>{
    const cls=r.good?'up':'dn';
    const val=r.text||sgn(r.d,r.unit);
    const range=r.range?`<em>${esc(r.from)} → ${esc(r.to)}</em>`:'';
    return `<div class="dln ${cls}"><span>${esc(r.name)}</span>${range}<b>${esc(val)}</b></div>`}).join('')+'</div>'}
function cmpCol(it,kicker){
  if(!it)return `<div class="card cmpCol"><div class="kicker">${esc(kicker)}</div><div class="ln off">Nothing in this slot</div></div>`;
  if(!it.aff)it.aff=[];
  const hand=itemHands(it)===2?'<div class="ln">Two-handed</div>':(it.slot==='weapon'&&(it.spd||0)>=20?'<div class="ln">One hand</div>':'');
  return `<div class="card cmpCol"><div class="kicker">${esc(kicker)}</div><div class="nm q${it.q||0}">${esc(it.id?it.name:it.base)}</div><div class="ln off">${QN[it.q]||''} ${esc(SNAME[it.slot]||it.slot)} · item level ${it.il||0}</div>${itemLines(it)}${hand}</div>`}
function cmpAltsHTML(ts,cur){
  if(!ts||ts.length<2)return '';
  return `<div class="cmpAlts"><span>Compare with</span>${ts.map(t=>`<button type="button" class="ghost${t.key===cur?' on':''}" data-cmpk="${esc(t.key)}">${esc(t.label)}</button>`).join('')}</div>`}
function beltLoadHTML(){
  const cs=G.cslots||[];
  if(!cs.length)return '<div class="ln off">Nothing on the belt</div>';
  return cs.map(c=>`<div class="ln q${c.q||0}">${esc(c.id?c.name:c.base)} · ${charmCost(c)} slot${charmCost(c)===1?'':'s'}</div>`).join('')}
function cmpCharmHTML(it,opt){
  opt=opt||{};
  const worn=(G.cslots||[]).indexOf(it)>=0;
  const ev=cmpCharmEval(it,!!opt.off||worn);
  let note='';
  if(ev.blocked==='unid')note='<div class="ln off">Unidentified. Nothing here is a guess.</div>';
  else if(ev.blocked==='level')note=`<div class="ln red">Needs level ${it.req}. Your sheet does not change.</div>`;
  else if(ev.blocked==='fit')note=`<div class="ln red">${esc(ev.why)} Your sheet does not change.</div>`;
  else note='<div class="ln off">A charm applies only while it sits on the belt.</div>';
  const right=`<div class="card cmpCol"><div class="kicker">On the belt</div>${beltLoadHTML()}</div>`;
  return `<div class="cmpView"><div class="cmpBox">${cmpCol(it,'This')}${right}</div><div class="cmpFoot"><div class="kicker">What changes</div>${note}${ev.blocked?'':cmpRowsHTML(ev.rows)}</div></div>`}
function cmpHTML(it,opt){
  opt=opt||{};
  if(it&&it.charm)return cmpCharmHTML(it,opt);
  const ev=cmpEval(it,opt);
  const wornK=opt.off?'With it off':(ev.target&&ev.target.who==='merc'?'On '+(ev.target.label||'them'):'Wearing');
  const wornIt=opt.off?null:(ev.target?ev.target.worn:(G.eq&&it&&it.slot?G.eq[it.slot]||null:null));
  let note='';
  if(ev.blocked==='unid')note='<div class="ln off">Unidentified. Nothing here is a guess.</div>';
  else if(ev.blocked==='level')note=`<div class="ln red">Needs level ${it.req}. Your sheet does not change.</div>`;
  else if(ev.blocked==='req')note=`<div class="ln red">${esc(ev.why||"Can't equip.")} Your sheet does not change.</div>`;
  else if(ev.merc)note='<div class="ln off">Companion life, damage, and how much of a hit they take.</div>';
  else note=`<div class="ln off">Resists are after the difficulty cut of ${resPen()}.</div>`;
  const alts=opt.off?'':cmpAltsHTML(ev.targets,ev.target&&ev.target.key);
  return `<div class="cmpView">${alts}<div class="cmpBox">${cmpCol(it,'This')}${cmpCol(wornIt,wornK)}</div><div class="cmpFoot"><div class="kicker">What changes</div>${note}${ev.blocked?'':cmpRowsHTML(ev.rows)}</div></div>`}
function itemCard(it,btns,worn,nocmp){
  let body;
  if(!it)body='';
  else if(nocmp||(!it.charm&&!it.slot))body=`<div class="card"><div class="nm q${it.q}">${esc(it.id?it.name:it.base)}</div><div class="ln off">${QN[it.q]} ${it.id&&it.name!==it.base?esc(it.base):SNAME[it.slot]||''} · item level ${it.il}</div>${itemLines(it)}</div>`;
  else body=cmpHTML(it,{off:!!worn});
  return `<div class="cmpHost">${body}<div class="row cmpActs" style="margin-top:6px">${btns||''}</div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
function cmpSheetPop(){
  if(tab==='stash'&&sel){
    if(sel.st!=null){const it=ACC.stash[sel.st];if(it)return itemCard(it,`<button class="big" data-stmv="${sel.st}">Move to pack</button>`,false,!!(!it.charm&&!it.slot))}
    if(sel.sb!=null){const it=G.bag[sel.sb];if(it)return itemCard(it,`<button class="big" data-sbmv="${sel.sb}">Move to lockbox</button>`,false,!!(!it.charm&&!it.slot))}}
  if(tab==='party'&&sel&&typeof MP!=='undefined'&&MP){
    if(sel.tid){const it=(G.bag||[]).find(x=>x&&x.tid===sel.tid);if(it){const on=MP.tradePick&&MP.tradePick[it.tid];return itemCard(it,`<button class="big" data-mptigo="${esc(it.tid)}">${on?'Take it off the table':'Put it on the table'}</button>`,false,!!(!it.charm&&!it.slot))}}
    if(sel.theirs!=null&&MP.trade&&MP.trade.them&&MP.trade.them.items){const it=MP.trade.them.items[sel.theirs];if(it)return itemCard(it,'',false,!!(!it.charm&&!it.slot))}}
  return ''}
let cmpSig='',cmpSrc='',cmpIt=null,cmpOpt=null,cmpDrop=null,cmpMuteDrop=null,cmpLeave=null,cmpXY=null,cmpNote='';
function cmpHide(){const el=$('cmpTip');if(el){el.hidden=true;el.innerHTML='';el.classList.remove('dock');el.style.left='';el.style.top=''}cmpSig='';cmpSrc='';cmpIt=null;cmpDrop=null;cmpNote=''}
function cmpSigOf(it,opt){
  const w=it&&it.slot&&G&&G.eq?G.eq[it.slot]:null,mw=G&&G.merc&&it?G.merc[it.slot]:null;
  return [CMP_KEY,opt&&opt.off?1:0,G&&G.diff|0,G&&G.lvl|0,it&&(it.uid||it.name||''),it&&it.il,it&&(it.id?1:0),it&&it.dura|0,it&&it.duraMax|0,w&&(w.uid||w.name||'1'),w&&w.dura|0,w&&w.duraMax|0,mw&&(mw.uid||mw.name||''),(G&&G.cslots||[]).map(c=>c&&(c.uid||c.name||'1')).join(','),S&&S.maxHp,S&&S.armor,S&&S.dmin,S&&S.dmax,P&&P.bear|0,P&&P.orders|0,P&&P.book|0,P&&P.two&&P.two.n|0,G&&G.mouse&&G.mouse.L,G&&G.slots&&G.slots[0],cmpNote].join('|')}
function cmpPlace(el){
  if(!cmpXY||!el)return;const app=$('app');if(!app)return;const r=app.getBoundingClientRect();
  el.style.left='8px';el.style.top='8px';
  const w=el.offsetWidth||360,h=el.offsetHeight||220;
  let left=cmpXY.x-r.left+14,top=cmpXY.y-r.top+14;
  if(left+w>r.width-8)left=Math.max(8,cmpXY.x-r.left-w-14);
  if(top+h>r.height-8)top=Math.max(8,r.height-h-8);
  el.style.left=left+'px';el.style.top=top+'px'}
function cmpShow(it,opt,src,drop){
  if(!it||(!it.charm&&!it.slot)){if(cmpSrc===src)cmpHide();return}
  if(src!=='sheet')cmpNote='';
  const pop=$('pop');if(pop&&!pop.hidden)return;
  const el=$('cmpTip');if(!el||!G)return;
  opt=opt||{};const sig=cmpSigOf(it,opt);
  cmpIt=it;cmpOpt=opt;cmpSrc=src||'';cmpDrop=drop||null;
  if(sig!==cmpSig||el.hidden){cmpSig=sig;el.innerHTML=cmpHTML(it,opt)+(cmpNote?`<div class="ln" style="color:var(--gold)">${esc(cmpNote)}</div>`:'')+'<div class="row"><button type="button" class="ghost" data-cmphide="1">Hide</button></div>';if(src!=='dock')cmpPlace(el)}
  el.hidden=false;
  if(src==='dock'){el.classList.add('dock');el.style.left='';el.style.top=''}else el.classList.remove('dock')}
function cmpFromEl(el){
  if(!el||!el.dataset||!G)return null;const d=el.dataset;
  if(d.bag!==undefined)return G.bag[+d.bag]||null;
  if(d.eq)return (G.eq&&G.eq[d.eq])||null;
  if(d.shop!==undefined)return (typeof shop!=='undefined'&&shop[+d.shop])||null;
  if(d.sat!==undefined)return (typeof satShop!=='undefined'&&satShop[+d.sat]&&satShop[+d.sat].it)||null;
  if(d.st!==undefined)return (ACC&&ACC.stash&&ACC.stash[+d.st])||null;
  if(d.sb!==undefined)return (G.bag&&G.bag[+d.sb])||null;
  if(d.cs!==undefined)return (G.cslots&&G.cslots[+d.cs])||null;
  if(d.vend!==undefined){const row=vendRow(+d.vend);return (row&&row.it)||null}
  if(d.vbag!==undefined)return (G.bag&&G.bag[+d.vbag])||null;
  if(d.vback!==undefined){const row=BUYBACK[+d.vback];return (row&&row.it)||null}
  if(d.mpti&&typeof MP!=='undefined')return (G.bag||[]).find(x=>x&&x.tid===d.mpti)||null;
  if(d.tsee!==undefined&&typeof MP!=='undefined'&&MP.trade&&MP.trade.them)return (MP.trade.them.items||[])[+d.tsee]||null;
  return null}
/* Ground names are a label, never a sheet. Walking onto gear does not open one. */
let LOOT={always:0,hideJunk:0,minQ:0,hold:0,card:null},LOOT_BOX=[];
function lootLoad(){try{const s=JSON.parse(localStorage.getItem('u2087-loot')||'');if(!s||typeof s!=='object')return;if(s.always!=null)LOOT.always=s.always?1:0;if(s.hideJunk!=null)LOOT.hideJunk=s.hideJunk?1:0;if(s.minQ!=null)LOOT.minQ=Math.max(0,Math.min(3,s.minQ|0))}catch(e){}}
function lootSave(){try{localStorage.setItem('u2087-loot',JSON.stringify({always:LOOT.always?1:0,hideJunk:LOOT.hideJunk?1:0,minQ:LOOT.minQ|0}))}catch(e){}}
function lootPrefs(){return LOOT}
function lootName(d){if(!d)return '';let n=d.it?(d.it.id?d.it.name:(d.it.base||'Item')):d.word?('\u201c'+d.word+'\u201d'):d.pot?'Stim':'';if(n.length>24)n=n.slice(0,23)+'\u2026';return n}
function lootCol(d){if(d&&d.it)return (typeof QCOL!=='undefined'&&QCOL[d.it.q|0])||'#e6e2d6';if(d&&d.word)return '#f7931a';if(d&&d.pot)return '#7be495';return '#ffe36b'}
function lootPasses(d){if(!d||!(d.t>.3))return false;if(d.sat||d.cr)return false;if(d.word||d.pot)return true;const it=d.it;if(!it)return false;if(it.quest||it.sq||it.key)return true;if(LOOT.hideJunk&&it.junk&&(it.q|0)<3)return false;if((it.q|0)<(LOOT.minQ|0))return false;return true}
function lootFloor(it){return !!(it&&(it.quest||it.sq||it.key||(it.q|0)>=(OPT.lootQ|0)))}
function lootAuto(d){
  if(!d||OPT.autoLoot===false)return false;
  if(d.word)return OPT.lootNote!==false;
  if(d.pot)return OPT.lootStim!==false;
  if(d.sat||d.cr||!d.it)return false;
  if(!lootPasses(d))return false;
  const it=d.it;
  if(it.charm)return OPT.lootCharm!==false&&lootFloor(it);
  if(OPT.lootGear===false)return false;
  return lootFloor(it)&&!skipPick(it)}
function packFullCue(){if(!P||P.warn>0)return;toast('Pack full');P.warn=3}
function lootMigrate(raw){
  if(!raw||raw.lootQ!=null||raw.autoLoot!=null)return;
  let q=0;while(q<4&&raw['pk'+q]===false)q++;
  OPT.lootQ=Math.min(3,q);
  if(raw.pk0===false&&raw.pk1===false&&raw.pk2===false&&raw.pk3===false&&raw.pk4===false)OPT.lootGear=false}
function lootAutoHTML(){
  const q=['All','Magic and up','Rare and up','Set and unique'];
  const tog=(k,lab)=>`<button class="tog${OPT[k]!==false?' on':''}" data-opt="${k}"><span>${lab}</span><i>${OPT[k]!==false?'ON':'OFF'}</i></button>`;
  return `<div class="aloot"><h3>Auto-loot</h3>${tog('autoLoot','Pick up as you walk')}${tog('lootStim','Stims')}${tog('lootCharm','Charms')}${tog('lootGear','Gear')}${tog('lootNote','Notes')}<div class="row">${q.map((n,i)=>`<button type="button" class="${(OPT.lootQ|0)===i?'big':'ghost'}" data-alootq="${i}">${n}</button>`).join('')}</div><p class="hint" style="font-size:13px">Walking takes what fits, and no description opens. A name the filter hides stays on the ground. Sats and credits are always picked up. A full pack says so, then stays quiet for a few seconds.</p></div>`}
function lootShowAll(){return !!(LOOT.always||LOOT.hold||(typeof keys!=='undefined'&&(keys.AltLeft||keys.AltRight)))}
function lootLayout(){
  LOOT_BOX=[];
  if(!W||!P||typeof SX!=='function'||mode!=='play')return LOOT_BOX;
  const showAll=lootShowAll(),touch=typeof uiTouch==='function'&&uiTouch();
  const hit=touch?Math.max(18,(44/(typeof ZM==='number'&&ZM?ZM:1))):18;
  const rows=[];
  for(const d of W.drops||[]){
    if(!lootPasses(d))continue;
    const X=SX(d.x,d.y),Y=SY(d.x,d.y);
    if(X<-80||Y<-80||X>(VW||400)+80||Y>(VH||700)+80)continue;
    const near=Math.hypot(d.x-P.x,d.y-P.y);
    rows.push({d,near,nm:lootName(d),sx:X,sy:Y})}
  let list=rows;
  if(!showAll){
    let cap=4;if((W.ents||[]).filter(e=>e&&e.hp>0&&!e.mp).length>=6)cap=2;
    list=rows.filter(r=>r.near<=3.6).sort((a,b)=>a.near-b.near).slice(0,cap)}
  const font='700 11px Cinzel,serif';
  if(typeof ctx!=='undefined'&&ctx)ctx.font=font;
  for(const r of list){
    const tw=(typeof ctx!=='undefined'&&ctx)?ctx.measureText(r.nm).width:r.nm.length*7;
    r.w=Math.max(hit,Math.ceil(tw)+12);r.h=hit;
    r.x=r.sx-r.w/2;r.y=r.sy-22-r.h}
  list.sort((a,b)=>a.y-b.y||a.x-b.x);
  const hitBox=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
  for(let pass=0;pass<10;pass++){let moved=false;
    for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j];if(!hitBox(a,b))continue;const top=a.y<=b.y?a:b,bot=top===a?b:a;top.y=bot.y-top.h-3;if(top.y<8){top.y=bot.y;top.x=bot.x+bot.w+4}moved=true}
    if(!moved)break}
  const vw=VW||400,vh=VH||700;
  for(const r of list){r.x=Math.max(2,Math.min(vw-r.w-2,r.x));r.y=Math.max(4,Math.min(vh-r.h-4,r.y));
    /* The loop above only separates ground names from each other. The names over
       people, and any bubble, were placed earlier in this same frame and are in
       LBOX, so step up past those too and claim the room, which also keeps the next
       ground name clear of this one. A name that cannot find a gap is still drawn:
       it is what the pointer clicks to pick the thing up. */
    if(typeof boxFree==='function'){
      const ox=r.x,oy=r.y,step=r.h+3,side=r.w/2+8;let put=null;
      /* Straight up first, then half a width either way, taking the smallest move
         that clears everything already on screen. */
      for(let i=0;i<12&&!put;i++){const y=oy-i*step;if(y<4)break;
        for(const dx of (i?[0,-side,side,-2*side,2*side]:[0])){
          const x=Math.max(2,Math.min(vw-r.w-2,ox+dx));
          if(boxFree(x,y,r.w,r.h)){put={x,y};break}}}
      if(put){r.x=put.x;r.y=put.y}
      txtClaim(r.x,r.y,r.w,r.h)}
    LOOT_BOX.push({d:r.d,nm:r.nm,x:r.x,y:r.y,w:r.w,h:r.h,col:lootCol(r.d)})}
  return LOOT_BOX}
function lootAt(vx,vy){for(let i=LOOT_BOX.length-1;i>=0;i--){const r=LOOT_BOX[i];if(vx>=r.x&&vx<=r.x+r.w&&vy>=r.y&&vy<=r.y+r.h)return r.d}return null}
function drawLootLabels(){
  const rows=lootLayout();
  if(!(typeof uiTouch==='function'&&uiTouch())){
    for(const r of rows){ctx.font='700 11px Cinzel,serif';ctx.textAlign='center';ctx.fillStyle='rgba(8,6,12,.9)';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.fillStyle=r.col;ctx.fillRect(r.x,r.y,3,r.h);ctx.fillText(r.nm,r.x+r.w/2,r.y+Math.min(14,r.h-4))}}
  lootDom(rows);cmpGround()}
function lootDom(rows){
  const box=$('lootLabs');if(!box)return;
  if(typeof uiTouch!=='function'||!uiTouch()||mode!=='play'){if(box.childElementCount)box.innerHTML='';box._n=-1;return}
  const same=box._n===rows.length&&rows.every((r,i)=>box.children[i]&&box.children[i]._d===r.d&&box.children[i].textContent===r.nm);
  if(!same){box.innerHTML='';rows.forEach((r,i)=>{const b=document.createElement('button');b.type='button';b.className='q'+(r.d.it?(r.d.it.q|0):0);b.textContent=r.nm;b._d=r.d;b.dataset.ll=String(i);box.appendChild(b)});box._n=rows.length}
  rows.forEach((r,i)=>{const b=box.children[i];if(!b)return;b.style.left=(r.x*ZM)+'px';b.style.top=(r.y*ZM)+'px';b.style.width=(r.w*ZM)+'px';b.style.height=(r.h*ZM)+'px';b.style.color=r.col})}
function lootShut(){LOOT.card=null;const el=$('lootCard');if(el)el.hidden=true;if(cmpSrc==='card')cmpHide()}
function lootOpen(d,el){
  if(!d)return;LOOT.card=d;const card=$('lootCard');if(!card)return;card.hidden=false;
  const nm=card.querySelector('.nm');if(nm){nm.textContent=lootName(d);nm.className='nm q'+(d.it?(d.it.q|0):0)}
  const app=$('app');if(!app||!el||!el.getBoundingClientRect)return;const r=el.getBoundingClientRect(),a=app.getBoundingClientRect();
  let left=r.left-a.left,top=r.bottom-a.top+6;if(top+130>a.height)top=Math.max(8,r.top-a.top-124);if(left+240>a.width)left=Math.max(8,a.width-248);
  card.style.left=left+'px';card.style.top=top+'px'}
function lootPickup(d){if(!d||!P)return;d.force=1;lootShut();if(Math.hypot(d.x-P.x,d.y-P.y)<=.95)return;MO={k:'use',x:d.x,y:d.y,fn:()=>{d.force=1},r:.95,hold:0}}
function lootCompare(d){
  if(!d)return;
  const card=$('lootCard');if(card){const r=card.getBoundingClientRect();cmpXY={x:r.left,y:r.bottom}}
  if(d.it&&(d.it.charm||d.it.slot))cmpShow(d.it,{},'card',d);
  else{const lines=d.word?['A seed word. It sockets into a weapon, helm or armor.']:d.pot?['A stim. Pick it up to carry it.']:[''];cmpPlain(lootName(d),lines);cmpSrc='card';cmpDrop=d}
  const el=$('cmpTip');if(el&&typeof uiTouch==='function'&&uiTouch()){el.classList.add('dock');el.style.left='';el.style.top=''}}
function lootOptHTML(){
  const q=['All','Magic and up','Rare and up','Set and unique'];
  return `<h3>Names on the ground</h3><button class="tog${LOOT.hideJunk?' on':''}" data-loot="junk"><span>Hide junk and greys</span><i>${LOOT.hideJunk?'ON':'OFF'}</i></button><div class="row">${q.map((n,i)=>`<button type="button" class="${(LOOT.minQ|0)===i?'big':'ghost'}" data-lootq="${i}">${n}</button>`).join('')}</div><p class="hint" style="font-size:13px">Kept on this device, for every wanderer. A name is only a name. ${uiSay('Hover it to compare. Hold Alt to show every name that passes.','Tap it for Pick up and Compare. Hold Names to show every name that passes.')} Sats and credits are still picked up when you walk over them. Walking also takes what this filter still shows, when auto-loot is on.</p>`}
function cmpDock(){if(cmpSrc==='dock')cmpHide()}
function lootHoverDrop(){if(HOVER&&HOVER.kind==='item'&&HOVER.o&&LOOT_BOX.some(r=>r.d===HOVER.o))return HOVER.o;return null}
function cmpGround(){
  if(uiTouch()){if(cmpSrc==='ground')cmpHide();return}
  if(mode!=='play'||!$('sheet').hidden){if(cmpSrc==='ground')cmpHide();return}
  const pop=$('pop');if(pop&&!pop.hidden){if(cmpSrc==='ground')cmpHide();return}
  const d=lootHoverDrop();
  if(d&&d.it&&(d.it.charm||d.it.slot)){
    if(d===cmpMuteDrop){if(cmpSrc==='ground')cmpHide();return}
    cmpShow(d.it,{},'ground',d);return}
  if(cmpSrc==='ground'){const tip=$('cmpTip');if(tip&&tip.matches(':hover'))return;cmpHide()}}

$('sheet').addEventListener('pointerover',e=>{
  if(e.pointerType&&e.pointerType!=='mouse')return;
  if(uiTouch())return;
  const el=e.target.closest&&e.target.closest('[data-bag],[data-eq],[data-shop],[data-sat],[data-st],[data-sb],[data-mpti],[data-tsee],[data-cs],[data-vend],[data-vbag],[data-vback],[data-vstim],[data-vbox]');
  if(!el)return;
  if(e.clientX!=null)cmpXY={x:e.clientX,y:e.clientY};
  clearTimeout(cmpLeave);
  if(el.dataset.vstim!==undefined){const ask=vendStimSats();cmpPlain('Stim',['Restores 45% of your life.','You carry '+G.stims+' of '+S.cap+'.',ask+(ask===1?' sat':' sats')]);return}
  if(el.dataset.vbox!==undefined){const ask=vendBoxSats(),il=(G.lvl||1)+(G.tier||0)*12;cmpPlain((SNAME[el.dataset.vbox]||'Gear')+' box',['Sealed. Unique 1.5%, set 2%, rare 15%, the rest magic.','Item level '+il+'.',ask+' sats']);return}
  let note='';
  if(el.dataset.vend!==undefined){const row=vendRow(+el.dataset.vend);note=row?row.ask+' sats':''}
  else if(el.dataset.vbag!==undefined){const it=G.bag[+el.dataset.vbag];const b=it?vendBid(it):0;note=b?b+' sats':'No price'}
  else if(el.dataset.vback!==undefined){const row=BUYBACK[+el.dataset.vback];note=row?row.ask+' sats':''}
  cmpNote=note;
  const it=cmpFromEl(el);if(!it||(!it.charm&&!it.slot)){cmpNote='';return}
  cmpShow(it,{off:!!el.dataset.eq},'sheet')});
$('sheet').addEventListener('pointerout',e=>{
  if(e.pointerType&&e.pointerType!=='mouse')return;
  const rel=e.relatedTarget;
  if(rel&&$('cmpTip')&&$('cmpTip').contains(rel))return;
  if(cmpSrc!=='sheet')return;
  clearTimeout(cmpLeave);
  cmpLeave=setTimeout(()=>{const tip=$('cmpTip');if(tip&&tip.matches(':hover'))return;if(cmpSrc==='sheet')cmpHide()},200)});
const cmpTipEl=$('cmpTip');
if(cmpTipEl){cmpTipEl.addEventListener('pointerover',()=>clearTimeout(cmpLeave));
  cmpTipEl.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('button');if(!b)return;ev.preventDefault();ev.stopPropagation();sfx('ui');
    if(b.dataset.cmphide){if(cmpDrop)cmpMuteDrop=cmpDrop;cmpHide();return}
    if(b.dataset.cmpk){CMP_KEY=b.dataset.cmpk;cmpSig='';cmpShow(cmpIt,cmpOpt,cmpSrc,cmpDrop)}})}
const MSL=['weapon','helm','armor'];const mScore=it=>it?(it.dmin?(it.dmin+it.dmax)/2:it.arm||0):0;
function mercBest(){let n=0;const m=G.merc;for(const sl of MSL){let b=-1,bs=mScore(m[sl]);G.bag.forEach((it,i)=>{if(typeof tradeHeld==='function'&&tradeHeld(it))return;if(it.slot===sl&&it.id&&!it.junk&&mScore(it)>bs&&!(itemDelta(it)>.01)){bs=mScore(it);b=i}});if(b>=0){const it=G.bag[b],old=m[sl];m[sl]=it;G.bag.splice(b,1);if(old)G.bag.push(old);n++}}return n}
const pkRow=()=>`<h3>On the ground</h3><p class="hint" style="font-size:13px">Walking over gear, charms, stims or notes picks them up if they fit. No description opens. Sats and credits are still picked up. ${uiSay('Hover a name to compare it, and click it to take it. Hold Alt to show every name.','Tap a name for Pick up and Compare. Hold Names to show every name.')}</p>`;
const selling=()=>sheetCtx.only&&(sheetCtx.only.includes('shop')||sheetCtx.only.includes('gamble'))&&!sheetCtx.only.includes('sats');
function beltRowHTML(){const belt=G.eq&&G.eq.belt,bud=beltBudget(belt),used=charmUsed();const nm=belt?(belt.id?belt.name:belt.base):'No belt';G.cslots=G.cslots||[];let cells='';
  G.cslots.forEach((it,i)=>{if(it)cells+=cell(it,`data-cs="${i}"`,sel&&sel.cs===i)});
  for(let i=0;i<Math.max(0,bud.slots-used);i++)cells+=`<button class="cell empty" data-csocket="1">${svgIcon('charm')}</button>`;
  if(!cells)cells=`<button class="cell empty" disabled>${svgIcon('charm')}</button>`;
  return `<h3>${esc(nm)} · ${used}/${bud.slots} charms · ${G.stims||0}/${bud.stims} stims</h3><div class="beltRow${G.charmShake?' shake':''}" data-bpocket="1">${cells}</div><p class="beltNote">${uiSay('Click a charm in the pack, then an empty belt slot. Double-click puts it on. On a desk you can drag it.','Tap a charm in the pack, then an empty belt slot. Double-tap puts it on.')} Off the belt a charm does nothing, and charms do not stack. ${esc(STIM.belt)}</p>${G.charmWhy?`<p class="beltNote">${esc(G.charmWhy)}</p>`:''}`}
function gridPack(list,cols,rows,key){list=list||[];const placed=gridPlace(list,cols,rows),occ=Array(cols*rows).fill(0);let h='';const ds=(key==='bag'||key==='vbag')?list.map(it=>it?itemDelta(it):null):null;
  const draw=(it,i,x,y,w,ht)=>{const style=`style="grid-column:${x+1} / span ${w};grid-row:${y+1} / span ${ht}"`;let attr=style;if(key==='bag')attr=`data-bag="${i}" ${style}`;else if(key==='st')attr=`data-st="${i}" ${style}`;else if(key==='sb')attr=`data-sb="${i}" ${style}`;else if(key==='vbag')attr=`data-vbag="${i}" ${style}`;
    if((key==='st'||key==='sb')&&!uiTouch())attr+=' draggable="true"';
    h+=cell(it,attr,sel&&((key==='bag'&&sel.bag===i)||(key==='st'&&sel.st===i)||(key==='sb'&&sel.sb===i)||(key==='vbag'&&sel.vbag===i)),null,ds?ds[i]:undefined)};
  if(placed){for(const p of placed){for(let dy=0;dy<p.h;dy++)for(let dx=0;dx<p.w;dx++)occ[(p.y+dy)*cols+p.x+dx]=1;draw(p.it,p.i,p.x,p.y,p.w,p.h)}}
  else{let n=0;for(let i=0;i<list.length&&n<cols*rows;i++){const it=list[i];if(!it)continue;occ[n]=1;draw(it,i,n%cols,(n/cols)|0,1,1);n++}}
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(!occ[y*cols+x]){const style=`style="grid-column:${x+1};grid-row:${y+1}"`;h+=cell(null,key==='bag'?`data-packempty="1" ${style}`:style)}
  return h}
function openVend(kind){
  kind=kind||'brenda';
  if(kind==='brenda'&&G.st&&G.st.overUsed&&!G.st.overBrenda){G.st.overBrenda=1;toast(ARC.notYou)}
  if(kind!=='brenda')shopVia=0;
  VEND.kind=kind;
  VEND.tab=kind==='gamble'?'boxes':'weapons';
  VEND.who=kind==='sat'?'Nonce':kind==='gamble'?'Wren':'Brenda';
  VEND.side=uiTouch()?'them':'both';
  openSheet('vend',{only:['vend']});
}
function vendKind(){return (VEND&&VEND.kind)||'brenda'}
function vendBuys(){const k=vendKind();return k==='brenda'||k==='sat'}
function vendTabOf(it){
  if(!it)return 'supplies';
  if(it.charm)return 'charms';
  if(it.slot==='weapon')return 'weapons';
  if(it.slot==='ring'||it.slot==='amulet')return 'trinkets';
  if(it.slot==='helm'||it.slot==='armor'||it.slot==='gloves'||it.slot==='boots'||it.slot==='belt')return 'armor';
  return 'supplies';
}
function vendCreditSats(cr){
  cr=Math.floor(+cr||0);
  if(!(cr>0))return 0;
  const rate=satRate()||1;
  return Math.max(1,Math.ceil(cr/rate));
}
function vendBid(it){if(it&&it.hello)return 1;return vendCreditSats(sellValue(it))}
function vendAsk(it){
  if(!it)return 0;
  if(vendKind()==='sat'){
    const o=(typeof satShop!=='undefined'?satShop:[]).find(x=>x&&x.it===it);
    if(o)return satPrice(o);
  }
  return satCost(it);
}
function vendRow(i){
  const k=vendKind();
  if(k==='sat'){const o=satShop[i];if(!o||!o.it)return null;return {i:i,it:o.it,ask:satPrice(o)}}
  const it=shop[i];if(!it)return null;return {i:i,it:it,ask:satCost(it)};
}
function vendStimSats(){return vendKind()==='sat'?1:vendCreditSats(payTag(stimPrice()))}
function vendIdSats(){const n=unidCount();if(!n||G.marrow)return 0;return vendCreditSats(payTag(40*G.cpi*n*(G.disc?.85:1)))}
function vendBoxSats(){return vendCreditSats(boxPrice())}
function vendList(){
  const tab=VEND.tab||'weapons',out=[];
  if(vendKind()==='gamble'||tab==='boxes'||tab==='supplies'||tab==='buyback')return out;
  if(vendKind()==='sat')satShop.forEach((o,i)=>{if(o&&o.it&&vendTabOf(o.it)===tab)out.push({i:i,it:o.it,ask:satPrice(o)})});
  else shop.forEach((it,i)=>{if(it&&vendTabOf(it)===tab)out.push({i:i,it:it,ask:satCost(it)})});
  return out;
}
function vendPay(ask,label,go){
  if(ask>=12&&uiTouch()){dlg('Buy','Pay '+ask+' sats for '+label+'?',[['Buy',go],['Leave']]);return 'dlg'}
  go();
  return true;
}
function vendBuy(i){
  const row=vendRow(i);if(!row)return false;
  if(typeof arcBlind==='function'&&arcBlind())return false;
  const it=row.it,ask=row.ask;
  if(!bagCan(it)){toast('Your pack is full');sfx('err');return false}
  const label=it.id?it.name:(it.base||'that');
  return vendPay(ask,label,()=>{
    const again=vendRow(i);if(!again||again.it!==it){toast('That is gone');return}
    if(!bagCan(it)){toast('Your pack is full');sfx('err');return}
    if(!spendSats(ask)){eggPoor();return}
    if(vendKind()==='sat'){
      const o=satShop[i];
      addRep('btc',Math.ceil((o&&o.price||0)/4));
      addAdopt(1,'you paid in sats');
      G.bag.push(o.it);satShop.splice(i,1);
    }else{
      addAdopt(.5,'');
      G.bag.push(shop[i]);shop.splice(i,1);
    }
    sel=null;sfx('coin');toast('Paid '+ask+' sats');
    if(mode==='sheet')drawSheet();
  });
}
function vendBuyStim(){
  if(G.stims>=S.cap){toast('You cannot carry another');sfx('err');return false}
  const ask=vendStimSats();
  return vendPay(ask,'a stim',()=>{
    if(G.stims>=S.cap){toast('You cannot carry another');sfx('err');return}
    if(!spendSats(ask,vendKind()==='sat'?'A stim costs 1 sat':undefined)){eggPoor();return}
    G.stims++;
    if(vendKind()==='sat')addRep('btc',1);
    sfx('coin');if(!scStimBark(false))toast('Paid '+ask+' sat'+(ask===1?'':'s'));
    if(mode==='sheet')drawSheet();
  });
}
function vendIdentify(){
  if(vendKind()!=='brenda'||G.marrow)return false;
  const n=unidCount();if(!n)return false;
  const ask=vendIdSats();
  return vendPay(ask,'an appraisal',()=>{
    if(!unidCount())return;
    if(!spendSats(ask)){eggPoor();return}
    idAll();sfx('rare');toast('Appraised');
    if(mode==='sheet')drawSheet();
  });
}
function vendBox(slot){
  if(!SLOTS.includes(slot))return false;
  if(!bagCan({slot:slot})){toast('Your pack is full');sfx('err');return false}
  const ask=vendBoxSats();
  return vendPay(ask,(SNAME[slot]||'Gear')+' box',()=>{
    if(!bagCan({slot:slot})){toast('Your pack is full');sfx('err');return}
    if(!spendSats(ask)){eggPoor();return}
    const r=Math.random(),q=r<.015?4:r<.035?3:r<.185?2:1;
    const it=makeItem(G.lvl+ri(-1,2)+G.tier*12,q,slot);it.id=true;
    G.bag.push(it);lastBox=it;sfx(q===4?'unique':q>=2?'rare':'drop');
    if(mode==='sheet')drawSheet();
  });
}
function vendSell(i,quiet){
  if(!vendBuys()){toast('Wren does not buy gear');sfx('err');return false}
  const it=G.bag&&G.bag[i];if(!it)return false;
  if(typeof tradeLocked==='function'&&tradeLocked(it))return false;
  if(it.lock){toast('That piece is locked');sfx('err');return false}
  if(vendQuest(it)){toast('A quest piece stays');sfx('err');return false}
  const paid=vendBid(it);
  if(!(paid>0)){toast(it.test?'Test gear has no price':'That has no price');sfx('err');return false}
  const ask=Math.max(paid,vendAsk(it));
  G.bag.splice(i,1);
  G.sats=(G.sats|0)+paid;
  BUYBACK.push({it:it,paid:paid,ask:ask,kind:vendKind()});
  sel=null;if(!quiet){sfx('coin');toast(it.hello?EGG.brendaNo:('Sold for '+paid+' sats'));save(true)}
  return true;
}
function vendQuest(it){return !!(it&&(it.quest||it.sq||it.key))}
function sellFilters(){if(!G.sellF)G.sellF={norm:1,magic:0,rare:0};if(G.sellF.norm==null)G.sellF.norm=1;if(G.sellF.magic==null)G.sellF.magic=0;if(G.sellF.rare==null)G.sellF.rare=0;return G.sellF}
function vendGrey(it){return !!(it&&it.junk&&(it.q|0)<3&&!it.charm)}
function vendSellKey(it){
  if(!it||it.charm||vendQuest(it)||it.lock)return '';
  if(typeof tradeHeld==='function'&&tradeHeld(it))return '';
  if((it.q|0)>=3||it.test)return '';
  if((it.q|0)<=0||vendGrey(it))return 'norm';
  if((it.q|0)===1)return 'magic';
  if((it.q|0)===2)return 'rare';
  return '';
}
function vendSellPlan(which){
  const f=sellFilters(),rows=[];
  (G.bag||[]).forEach((it,i)=>{const k=vendSellKey(it);if(!k)return;if(which==='junk'?k!=='norm':!f[k])return;const paid=vendBid(it);if(!(paid>0))return;rows.push({i:i,it:it,paid:paid,k:k})});
  return {n:rows.length,sats:rows.reduce((a,r)=>a+r.paid,0),rows:rows};
}
function vendSellCommit(which){
  if(!vendBuys()){toast('Wren does not buy gear');sfx('err');return {n:0,sats:0}}
  const rows=vendSellPlan(which).rows.slice().sort((a,b)=>b.i-a.i);
  let n=0,sats=0;
  for(const r of rows){if(G.bag[r.i]!==r.it)continue;if(!vendSell(r.i,true))continue;n++;sats+=r.paid}
  if(n){sfx('coin');toast('Sold '+n+' for '+sats+' sats');save(true)}
  return {n:n,sats:sats};
}
function vendFlipLock(i){const it=G.bag&&G.bag[i];if(!it)return false;it.lock=it.lock?0:1;sfx('ui');toast(it.lock?'Locked':'Unlocked');try{navigator.vibrate&&navigator.vibrate(15)}catch(e){}return !!it.lock}
function vendSellShut(prev){$('dlg').hidden=true;mode=prev==='title'||prev==='scene'?'play':(prev||'sheet');if(mode==='sheet')drawSheet()}
function vendFootLift(){
  const pop=$('pop');if(!pop)return;
  pop.classList.remove('aboveFoot');pop.style.removeProperty('--vend-foot');
  if(pop.hidden)return;
  const feet=[...document.querySelectorAll('#sheet .vendFoot,#sheet .stashFoot')];
  if(!feet.length)return;
  const vh=window.innerHeight||0;let top=vh;
  for(const f of feet){const r=f.getBoundingClientRect();if(r.height<8||r.bottom<=0||r.top>=vh)continue;if(r.top<top)top=r.top}
  const lift=Math.max(0,Math.round(vh-top));
  if(lift>8){pop.classList.add('aboveFoot');pop.style.setProperty('--vend-foot',Math.min(lift,Math.round(vh*.42))+'px')}
}
function vendSellOpen(which){
  if(!vendBuys()){toast('Wren does not buy gear');sfx('err');return}
  const pop=$('pop');if(pop){pop.hidden=true;pop.classList.remove('aboveFoot')}
  cmpHide();
  const prev=mode==='dlg'?(dlgPrev||'sheet'):mode;
  dlgPrev=prev;mode='dlg';$('dlg').hidden=false;J.x=J.y=0;atkHeld=false;$('stick').hidden=true;
  const paint=()=>{
    const plan=vendSellPlan(which),kept='Uniques, sets, charms, quest items, and locked pieces stay.';
    $('dT').textContent=which==='junk'?'Sell junk':'Sell the pack';
    $('dP').textContent=plan.n?('Sell '+plan.n+' piece'+(plan.n===1?'':'s')+' for '+plan.sats+' sat'+(plan.sats===1?'':'s')+'. '+kept):(which==='junk'?'No whites or greys to sell. '+kept:'Nothing in the pack matches these filters. '+kept);
    const b=$('dBtns');b.innerHTML='';
    if(which!=='junk'){const f=sellFilters();[['norm','Whites and greys'],['magic','Magic'],['rare','Rares']].forEach(([k,label])=>{const el=document.createElement('button');el.type='button';el.className=f[k]?'big':'ghost';el.dataset.sfilt=k;el.textContent=label+(f[k]?' · on':' · off');el.onclick=()=>{f[k]=f[k]?0:1;paint()};b.appendChild(el)})}
    const go=document.createElement('button');go.type='button';go.className='big';go.textContent='Sell';go.disabled=!plan.n;go.onclick=()=>{vendSellCommit(which);vendSellShut(prev)};
    const leave=document.createElement('button');leave.type='button';leave.className='ghost';leave.textContent='Leave';leave.onclick=()=>vendSellShut(prev);
    b.appendChild(go);b.appendChild(leave);
    try{leave.scrollIntoView({block:'nearest'})}catch(e){}
  };
  paint();sfx('talk');
}
function vendBuyback(i){
  const row=BUYBACK[i];
  if(!row||row.kind!==vendKind())return false;
  if(!bagCan(row.it)){toast('Your pack is full');sfx('err');return false}
  const label=row.it.id?row.it.name:(row.it.base||'that');
  return vendPay(row.ask,label,()=>{
    if(BUYBACK[i]!==row){toast('That is gone');return}
    if(!bagCan(row.it)){toast('Your pack is full');sfx('err');return}
    if(!spendSats(row.ask))return;
    G.bag.push(row.it);
    BUYBACK.splice(i,1);
    sel=null;sfx('coin');toast('Bought back for '+row.ask+' sats');save(true);
    if(mode==='sheet')drawSheet();
  });
}
function vendOccupy(rows,key){
  const list=rows.map(r=>r.it);
  let hgt=4;
  while(hgt<=12&&!gridPlace(list,6,hgt))hgt++;
  const placed=gridPlace(list,6,hgt);
  const occ=Array(6*hgt).fill(0);
  let h='';
  const paint=(r,x,y,w,ht)=>{
    const style='style="grid-column:'+(x+1)+' / span '+w+';grid-row:'+(y+1)+' / span '+ht+'"';
    const attr=key==='back'?('data-vback="'+r.i+'" '+style):('data-vend="'+r.i+'" '+style);
    const on=key==='back'?sel&&sel.vback===r.i:sel&&sel.vend===r.i;
    h+=cell(r.it,attr,on,null,itemDelta(r.it),r.ask);
  };
  if(placed){
    for(const p of placed){
      for(let dy=0;dy<p.h;dy++)for(let dx=0;dx<p.w;dx++)occ[(p.y+dy)*6+p.x+dx]=1;
      paint(rows[p.i],p.x,p.y,p.w,p.h);
    }
  }else{
    rows.forEach((r,n)=>{const x=n%6,y=(n/6)|0;if(y<hgt){occ[y*6+x]=1;paint(r,x,y,1,1)}});
  }
  for(let y=0;y<hgt;y++)for(let x=0;x<6;x++)if(!occ[y*6+x])h+=cell(null,'style="grid-column:'+(x+1)+';grid-row:'+(y+1)+'"');
  return h;
}
function vendBackRows(){
  const rows=[];
  BUYBACK.forEach((r,i)=>{if(r&&r.kind===vendKind())rows.push({i:i,it:r.it,ask:r.ask})});
  return rows;
}
function cmpPlain(title,lines){
  const el=$('cmpTip');if(!el)return;
  const pop=$('pop');if(pop&&!pop.hidden)return;
  cmpNote='';cmpIt=null;cmpSrc='sheet';cmpSig='plain:'+title+':'+(lines||[]).join('|');
  el.innerHTML='<div class="cmpView"><div class="card"><div class="nm">'+esc(title)+'</div>'+(lines||[]).map(l=>'<div class="ln">'+esc(l)+'</div>').join('')+'</div></div>';
  el.hidden=false;el.classList.remove('dock');cmpPlace(el);
}
function vendHTML(){
  const k=vendKind(),gamble=k==='gamble';
  const who=shopVia&&k==='brenda'?'Nonce · Brenda’s goods':(VEND.who||'Brenda');
  const tabs=gamble?[['boxes','Boxes']]:[['weapons','Weapons'],['armor','Armor'],['trinkets','Trinkets'],['charms','Charms'],['supplies','Supplies'],['buyback','Buyback']];
  if(!tabs.some(t=>t[0]===VEND.tab))VEND.tab=tabs[0][0];
  let h='<div class="vendHead"><h2>'+esc(who)+'</h2><p>You hold <strong style="color:#f7931a">'+(G.sats|0)+' sats</strong>.</p>';
  if(shopVia&&k==='brenda')h+='<p>Thirty percent off her price.</p>';
  if(k==='brenda')h+='<p>Prices are up '+(G.cpi<100?((G.cpi-1)*100).toFixed(0)+'%':'beyond counting')+' since you arrived.</p>';
  if(k==='sat')h+='<p>Credits rot. These do not. Rare, set and unique pieces, and a stim for one sat.</p>';
  if(gamble){
    const il=(G.lvl||1)+(G.tier||0)*12;
    h+='<p>Sealed at the factory. Posted odds: <span class="q4">unique 1.5%</span>, <span class="q3">set 2%</span>, <span class="q2">rare 15%</span>, the rest <span class="q1">magic</span>. Centered on item level '+il+'.</p>';
  }
  h+='<div class="row vendTabs">'+tabs.map(t=>'<button type="button" class="'+(VEND.tab===t[0]?'big':'ghost')+'" data-vtab="'+t[0]+'">'+t[1]+'</button>').join('')+'</div>';
  h+='<div class="row vendToggle"><button type="button" class="'+(VEND.side!=='you'?'big':'ghost')+'" data-vside="them">Merchant</button><button type="button" class="'+(VEND.side==='you'?'big':'ghost')+'" data-vside="you">You</button></div></div>';
  h+='<div class="vendBody" data-side="'+(VEND.side||'both')+'"><div class="vendSide" data-vpanel="them">';
  let pop='';
  if(gamble||VEND.tab==='boxes'){
    const ask=vendBoxSats(),il=(G.lvl||1)+(G.tier||0)*12;
    h+='<div class="grid" id="vendGrid">';
    SLOTS.forEach((s,i)=>{
      const x=i%6,y=(i/6)|0,off=satsFree()<ask||!bagCan({slot:s});
      h+='<button type="button" class="cell" data-vbox="'+s+'" style="grid-column:'+(x+1)+';grid-row:'+(y+1)+'" '+(off?'disabled':'')+'>'+svgIcon(s)+'<small>'+il+'</small><u class="vp">'+ask+' sats</u></button>';
    });
    h+='</div><p>Each box is '+ask+' sats. Wren does not buy gear.</p>';
    if(lastBox)h+='<p>Last roll: '+esc(lastBox.name)+'.</p>';
  }else if(VEND.tab==='supplies'){
    const ask=vendStimSats(),off=satsFree()<ask||G.stims>=S.cap;
    h+='<div class="grid" id="vendGrid"><button type="button" class="cell" data-vstim="1" '+(off?'disabled':'')+'><small>Stim</small><u class="vp">'+ask+' sat'+(ask===1?'':'s')+'</u></button>';
    if(vendKind()==='brenda'&&W&&W.pie){const pieOff=!bagCan({aff:[]});h+='<button type="button" class="cell" data-vpie="1" '+(pieOff?'disabled':'')+'><small>'+esc(EGG.pieName)+'</small><u class="vp">10000 sats</u></button>'}
    h+='</div>';
    h+='<p>A stim restores 45% of your life. You carry '+G.stims+' of '+S.cap+'.</p>';
  }else if(VEND.tab==='buyback'){
    const rows=vendBackRows();
    h+='<div class="grid" id="vendGrid">'+vendOccupy(rows,'back')+'</div>';
    h+=rows.length?'<p>Buying one back costs what the counter would charge, which is more than it paid you.</p>':'<p>Nothing sold this visit. Leaving town clears the counter.</p>';
  }else{
    const rows=vendList();
    h+='<div class="grid" id="vendGrid">'+vendOccupy(rows,'vend')+'</div>';
    h+=rows.length?'<p>'+uiSay('Right-click a piece to buy it. Hover shows it beside what you wear, and the price in sats.','Tap a piece, then Buy. A purchase of 12 sats or more asks first.')+'</p>':'<p>Nothing in this bin. The counter changes when you leave town and come back.</p>';
  }
  h+='</div><div class="youSide" data-vpanel="you"><h3>Pack '+gridCells(G.bag)+'/'+bagMeta().n+'</h3><div class="grid'+(bagMeta().c===5?' g5':'')+'" id="bagGrid">'+gridPack(G.bag,bagMeta().c,bagMeta().r,'vbag')+'</div>';
  h+='<p>'+(vendBuys()?uiSay('Right-click a piece to lock it. Drag it onto the counter to sell it.','Hold a piece to lock it. Tap it, then Sell.'):'What you buy lands in the pack. This counter does not buy gear.')+'</p></div></div>';
  if(vendBuys())h+='<div class="row vendFoot"><button type="button" class="big" data-vsellall="1">Sell all</button><button type="button" class="ghost" data-vselljunk="1">Sell junk</button></div>';
  if(k==='brenda'&&!G.marrow&&unidCount()){
    const ask=vendIdSats(),n=unidCount();
    h+='<div class="row vendFoot"><button type="button" class="big" data-vid="1" '+(satsFree()<ask?'disabled':'')+'>Appraise '+n+' item'+(n>1?'s':'')+' · '+ask+' sats</button></div>';
  }
  if(sel&&sel.vend!==undefined){
    const row=vendRow(sel.vend);
    if(row){
      const ok=satsFree()>=row.ask&&bagCan(row.it);
      pop=itemCard(row.it,'<button type="button" class="big" data-vbuy="'+sel.vend+'" '+(ok?'':'disabled')+'>Buy for '+row.ask+' sats</button>',false,false);
    }
  }else if(sel&&sel.vbag!==undefined){
    const it=G.bag[sel.vbag];
    if(it){
      const bid=vendBid(it);
      const q=repairQuote(it);
      const fix=W&&W.z&&W.z.town&&q?'<button type="button" class="ghost" data-repair="one" '+(satsFree()<q?'disabled':'')+'>Repair · '+q+' sat'+(q===1?'':'s')+'</button>':'';
      const lockBtn='<button type="button" class="ghost" data-vlock="'+sel.vbag+'">'+(it.lock?'Unlock':'Lock')+'</button>';
      const btn=(vendBuys()&&bid>0&&!it.lock?'<button type="button" class="big" data-vsell="'+sel.vbag+'">Sell for '+bid+' sats</button>':'')+lockBtn+fix;
      pop=itemCard(it,btn,false,false);
    }
  }else if(sel&&sel.vback!==undefined){
    const row=BUYBACK[sel.vback];
    if(row&&row.kind===vendKind()){
      const ok=satsFree()>=row.ask&&bagCan(row.it);
      pop=itemCard(row.it,'<button type="button" class="big" data-vbb="'+sel.vback+'" '+(ok?'':'disabled')+'>Buy back for '+row.ask+' sats</button>',false,false);
    }
  }
  h+=vendRepairHTML();
  return {h:h,pop:pop};
}
function vendRepairHTML(){const items=typeof repairList==='function'?repairList():[];if(!items.length)return '';const n=items.reduce((s,it)=>s+repairQuote(it),0);const worn=['weapon','helm','armor','gloves','boots','belt'].filter(sl=>G.eq&&G.eq[sl]&&repairQuote(G.eq[sl]));const rows=worn.map(sl=>{const it=G.eq[sl],q=repairQuote(it);return '<button type="button" class="ghost" data-vrepair="'+sl+'" '+(satsFree()<q?'disabled':'')+'>'+esc(it.id?it.name:it.base)+' · '+q+' sat'+(q===1?'':'s')+'</button>'}).join('');return '<div class="row vendFoot"><button type="button" class="big" data-repair="all" '+(satsFree()<n?'disabled':'')+'>Repair all · '+n+' sat'+(n===1?'':'s')+'</button>'+rows+'</div>'}
const MENUV={};
function menuPick(key,tabs,fallback){const ids=tabs.map(t=>t[0]);let cur=MENUV[key];if(ids.indexOf(cur)<0)cur=(fallback&&ids.indexOf(fallback)>=0)?fallback:ids[0];MENUV[key]=cur;return cur}
function menuBar(key,tabs,fallback){const cur=menuPick(key,tabs,fallback);return '<div class="row menuTabs">'+tabs.map(t=>'<button type="button" class="'+(cur===t[0]?'big':'ghost')+'" data-mside="'+key+':'+t[0]+'">'+t[1]+'</button>').join('')+'</div>'}
function menuPane(key,id,html){return '<div class="menuPane'+(MENUV[key]===id?'':' off')+'" data-mpane="'+key+':'+id+'">'+html+'</div>'}
function drawSheet(){
  const only=sheetCtx.only||(mpOn()?['char','items','skills','web','party','quests','story','codex','opts']:['char','items','skills','web','quests','story','codex','opts']);let pop='';$('pop').hidden=true;$('pop').classList.remove('aboveFoot');
  const sheetFit=tab==='items'||tab==='skills';
  let h=`<div class="shead">${only.map(t=>`<button class="tab${tab===t?' on':''}" data-tab="${t}">${TABS[t]}${t==='skills'&&G&&G.sp?' •':t==='char'&&G&&G.ap?' •':t==='story'&&sdxUnseen()?' •':''}</button>`).join('')}<button class="tab x" data-close="1">Close</button></div><div class="sheetBody${sheetFit?' fit':tab==='web'?' web':' canScroll'}${tab==='items'?' items':''}">`;
  if(tab==='load'){h+=`<h2>Load a save code</h2><p>Paste a code copied from the Options tab. This replaces the saved wanderer on this device.</p><textarea id="codeIn" placeholder="Paste here"></textarea><button class="big" data-loadcode="1">Load</button></div>`;$('sheetIn').innerHTML=h;return}
  calc();
  if(tab==='char'){const c=CLS[G.cls];
    let points='',people='',standing='';
    points+=`<h2>${c.n} · Level ${G.lvl}</h2>${typeof offsiteName==='function'&&offsiteName()?`<p class="hint" style="color:#e0bd6e">${offsiteName()}</p>`:''}<p>${G.lvl>=lvlCap()?(G.act5?'You have reached the level limit.':((G.bankXp||0)>0?'Level limit reached. '+Math.floor(G.bankXp)+' experience is banked, one level at most, until Act III.':'Level limit reached. It rises when you enter the next act.')):Math.floor(G.xp)+' / '+xpNext(G.lvl)+' experience.'} ${G.kills} machines scrapped. Simulator best: wave ${G.simBest||0}.</p><h3>Attributes · ${G.ap} point${G.ap===1?'':'s'} to spend</h3><div class="list">`;
    for(const k in ATTR)points+=`<button class="li" data-at="${k}" ${G.ap?'':'disabled'}><div><b>${ATTR[k][0]} · ${G.at[k]}</b><span>${typeof attrTip==='function'?attrTip(k):ATTR[k][1]}</span></div><span class="pr">${G.ap?'+ ADD':''}</span></button>`;
    points+=`</div>`;if(G.merc){const m=G.merc,ms=mercStats();people+=`<h3>Companion</h3><div class="li"><div><b>${esc(m.name)} · ${MERCS[m.k].n}${m.dead?' · fallen':''}</b><span>${m.dead?'Kestrel can bring them back for a fee.':'Life '+Math.round(m.hp||ms.max)+' / '+ms.max+' · damage '+Math.round(ms.dmg)+' · strikes with '+DTY[MERCS[m.k].dt].n+' · takes '+Math.round(ms.red*100)+'% of each hit'}</span><span>Give them a weapon or armor from the Items tab. Their resistances are on Kestrel’s page.</span></div></div><div class="grid eq">${['weapon','armor'].map(sl=>m[sl]?`<button class="cell q${m[sl].q}" data-mtake="${sl}">${svgIcon(sl)}<small>${m[sl].il}</small><u style="color:var(--dim)">TAKE</u></button>`:`<button class="cell empty" disabled>${svgIcon(sl)}</button>`).join('')}</div>`}
    points+=`<h3>This quarter</h3><div class="list"><div class="li on"><div><b>${SEA.n}</b><span>${SEA.d} The rule changes each week.</span></div></div>${G.act3?`<div class="li"><div><b>Tenure ${G.para||0}</b><span>The first costs half a level.</span><span>Each one after costs seven percent of that half more than the last.</span><span>+1% damage and life, one web point, and the machines strengthen a little.</span></div></div>`:''}${G.debt>0?`<div class="li"><div><b>Debt to Mr. Float · ${fmt(G.debt)}</b><span>About ${Math.round(G.debt/G.cpi/(G.debt0/G.debtCpi)*100)}% of what you borrowed, in real terms.</span></div></div>`:''}</div>`;
    people+=`<h3>Allegiances</h3><details class="memo"><summary>Social credit · ${scs()} · ${scsWord()}</summary><p>Unity scores what you say. Fiat answers and collecting the Stipend raise it; bitcoiner answers lower it a little, and insults lower it a lot. Below 500 Brenda will not serve you, the Stipend is halved and Mr. Float charges 35%. Below 350 he will not lend at all, and below 300 the Stipend stops. Bitcoiners answer in kind: below 500 Nonce sells at a quarter off and stocks Brenda’s goods at 30% off, Kestrel revives for nothing, and nodes are lit for free.</p></details><details class="memo"><summary>How people read you · ${leanWord()}</summary><p>What you say about money in conversation moves this. People greet you by it. Mr. Float overcharges plain bitcoiners, and Nonce overcharges the plainly fiat-minded.</p></details>`;for(const f in REP){const r=repRank(f),R=REP[f],nx=REPT[r];people+=`<details class="memo"><summary>${R.n} · ${r?R.ranks[r-1]:'Unknown to them'}</summary><p>${R.how} ${G.rep[f]} standing${nx?', '+nx+' for '+R.ranks[r]+' — '+R.perks[r]:''}.</p></details>`}
    people+=`<details class="memo"><summary>Bitcoin adoption · ${Math.floor(G.adopt)}%</summary><p>${fateWord()}. ${G.camp?'Unity’s campaign “'+CAMPS[G.camp.k].n+'” is draining it: '+CAMPS[G.camp.k].d+' ':''}${G.adopt>=100?'Bitcoin is the world’s reserve currency. Prices have stopped rising.':'It rises when you light nodes, pay in sats, prove work, win people over in conversation and bring down executives. It falls when you sell sats, borrow, buy shitcoins, insult people or take MANDATE’s offers. Where it stands when MANDATE falls decides how the money story ends: 60% or more and bitcoin becomes the reserve, under 25% and it fails.'}</p></details>`;
    standing+=`<h3>Resistances · difficulty cut ${resPen()}</h3><div class="stats">${RTK.map(k=>`<div style="color:${DTY[k].c}">${DTY[k].n}<b>${resOf(k)}%</b></div>`).join('')}</div><p style="font-size:13px">These are the numbers after the difficulty cut, and each one applies before armor. Normal cuts 0, Hard cuts 20, Brutal cuts 50. They cannot rise above 75% or fall below -100%, and a negative number means that type hurts more. Of Proofing rolls one type on armor, helms, boots, belts, rings and amulets. Of Coverage rolls all five on armor, helms, belts, rings and amulets, and it will not share an item with Of Proofing.</p>`;
    standing+=`<h3>Standing</h3><div class="stats"><div>Damage<b>${Math.round(S.dmin*hitFactor(S))}–${Math.round(S.dmax*hitFactor(S))}</b></div><div>Armor<b>${S.armor}</b></div><div>Life<b>${S.maxHp}</b></div><div>Energy<b>${S.maxEn}</b></div><div>Deadly strike<b>${S.crit}%</b></div><div>Attack speed<b>${S.aspd>=0?'+':''}${S.aspd}%</b></div><div>Run speed<b>+${S.mspd}%</b></div><div>Life steal<b>${S.leech}%</b></div><div>Magic find<b>${S.mf}%</b></div><div>Extra credits<b>${S.gold}%</b></div><div>Shock damage<b>${S.shock}</b></div><div>Damage blocked<b>${Math.round(100-10000/(100+S.armor))}%</b></div><div>Damage reduced<b>${Math.min(50,S.pdr||0)}%</b></div><div>Faster cast<b>${Math.round(Math.min(60,(S.cdr||0)*100))}%${(S.cdr||0)>=.45?' · quick':(S.cdr||0)>=.3?' · ready':(S.cdr||0)>=.15?' · slow':''}</b></div></div>`;
    h+=menuBar('char',[['points','Points'],['standing','Standing'],['people','People']],'points');
    h+=menuPane('char','points',points)+menuPane('char','standing',standing)+menuPane('char','people',people);
    if(devOn())h+=itemTryRow()}
  if(tab==='items'){
    const ds=G.bag.map(itemDelta),ups=new Set(G.bag.filter((it,i)=>ds[i]>.01&&canWear(it)).map(it=>it.slot)).size,downs=ds.filter((d,i)=>d!==null&&d<-.01&&!G.bag[i].junk).length;
    h+=`<div class="dollw" style="${selling()?'order:50':''}"><div class="doll"><svg class="fig" viewBox="0 0 60 120"><circle cx="30" cy="14" r="10"/><path d="M14 30h32l8 40h-9l-3-22v26l4 44H34l-4-36-4 36H14l4-44V48l-3 22H6z"/></svg>${SLOTS.map(sl=>`<div style="grid-area:${DOLL[sl].split('/')[1]}/${DOLL[sl].split('/')[0]}">${cell(G.eq[sl],`data-eq="${sl}"`,sel&&sel.eq===sl,sl)}</div>`).join('')}</div>
      <div class="dstat"><div>Damage<b>${Math.round(S.dmin*hitFactor(S)+S.shock)}–${Math.round(S.dmax*hitFactor(S)+S.shock)}</b></div><div>Armor<b>${S.armor}</b></div><div>Life<b>${S.maxHp}</b></div><div>Energy<b>${S.maxEn}</b></div><div>Deadly strike<b>${S.crit}%</b></div><div>Credits<b>${fmt(G.credits)}</b></div></div></div>`;
    h+=beltRowHTML();if(W&&W.z&&W.z.town&&G.corpses&&G.corpses.length)h+=G.corpses.map(c=>`<button class="li" data-corpse="${c.id}"><div><b>Body in ${esc((ZONES[c.zi]&&ZONES[c.zi].n)||'a district')}</b><span>${fmt(c.credits||0)} of credits on it, with the belt and its charms. The pack stayed with you.</span></div><span class="pr" style="color:#f7931a">${corpseFee(c)} sats</span></button>`).join('');
    h+=`<div class="row"><button class="${ups?'big':'ghost'}" data-best="1" ${ups?'':'disabled'}>${ups?'Equip best · '+ups+' upgrade'+(ups>1?'s':''):'Nothing better in pack'}</button><button class="ghost" data-markjunk="1" ${downs?'':'disabled'}>Mark ${downs||''} weaker as junk</button></div><button class="tog${OPT.autoEq?' on':''}" data-opt="autoEq"><span>Equip stronger gear as you pick it up</span><i>${OPT.autoEq?'ON':'OFF'}</i></button>`;if(!selling())h+=pkRow();
    if(G.merc&&!G.merc.dead&&!selling()){const m=G.merc,ms=mercStats();h+=`<h3>${esc(m.name)} · ${MERCS[m.k].n}</h3><div class="dollw"><div class="grid eq" style="grid-template-columns:repeat(3,1fr);flex:0 0 46%">${MSL.map(sl=>cell(m[sl],`data-msel="${sl}"`,sel&&sel.m===sl,sl)).join('')}</div><div class="dstat"><div>Life<b>${ms.max}</b></div><div>Damage<b>${Math.round(ms.dmg)}</b></div><div>Takes<b>${Math.round(ms.red*100)}%</b></div></div></div><div class="row"><button class="ghost" data-mbest="1">Give them the best of what I am not using</button></div><p class="hint" style="font-size:13px">${uiSay('Click one of their pieces to take it back. Click a weapon, helm or armor in your pack and choose Give to hand it over; whatever they were holding comes back to you.','Tap one of their pieces to take it back. Tap a weapon, helm or armor in your pack and choose Give to hand it over; whatever they were holding comes back to you.')}</p>`}
    h+=`<h3>Pack ${gridCells(G.bag)}/${bagMeta().n} · ${G.parts||0} parts</h3><div class="grid${bagMeta().c===5?' g5':''}" id="bagGrid">${gridPack(G.bag,bagMeta().c,bagMeta().r,'bag')}</div>`;
    h+=`<p style="font-size:13.5px">${uiSay('Hover a piece, or click it, to set it beside what you wear. Shift-hover does the same. <strong>Double-click to equip</strong>, <strong>hold to','Tap a piece to set it beside what you wear. <strong>Double-tap to equip</strong>, <strong>hold to')} ${selling()?'sell':'mark as junk'}</strong>.</p>`;
    const it=sel&&(sel.cs!==undefined?(G.cslots||[])[sel.cs]:sel.m?G.merc&&G.merc[sel.m]:sel.eq?G.eq[sel.eq]:G.bag[sel.bag]);
    if(it&&sel.sock){const own=WK.filter(w=>G.words[w]);pop=`<div class="card"><div class="nm" style="color:#f7931a">Socket a word</div><div class="ln off">${esc(it.name)} · ${it.soc-it.words.length} empty. A word cannot be removed once set. Phrases need the right words in the right order: see the Codex.</div><div class="list">${own.length?own.map(w=>`<button class="li" data-word="${w}"><div><b>${w} ×${G.words[w]}</b><span>${AFK[WORDS[w][0]].t.replace('{v}',WORDS[w][1])}</span></div></button>`).join(''):'<div class="ln off">You hold no words. They turn up on torn notes dropped by machines.</div>'}</div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
    else 
    if(it){let b='';if(sel.cs!==undefined){b=`<button class="big" data-csdo="off">Take off</button>`+(selling()?`<button class="ghost" data-csdo="sell">Sell ${fmt(sellValue(it))}</button>`:`<button class="ghost" data-csdo="drop">Drop</button>`)+`<button class="ghost" data-csdo="scrap">Scrap · ${charmParts(it)} parts</button>`}else if(sel.m){b=`<button class="big" data-mtake="${sel.m}">Take it back</button>`}else if(sel.eq){b=`<button class="ghost" data-do="unequip">Take off</button>`;if(W&&W.z&&W.z.town&&repairQuote(it))b+=`<button class="ghost" data-repair="one" ${G.sats<repairQuote(it)?'disabled':''}>Repair · ${repairQuote(it)} sat${repairQuote(it)===1?'':'s'}</button>`;if(it.soc&&it.words.length<it.soc)b+=`<button class="ghost" data-do="sock">Socket a word</button>`}else{b=`<button class="big" data-do="equip" ${(it.stim||it.pie||it.sour||it.hello||(it.charm?it.id&&G.lvl>=(it.req||0):canWear(it)))?'':'disabled'}>${it.stim?STIM.move:it.pie||it.sour?EGG.eat:it.hello?EGG.leaveIt:it.charm?'Put on the belt':'Equip'}</button>`;b+=selling()?`<button class="ghost" data-do="sell">Sell ${fmt(sellValue(it))}</button>`:`<button class="ghost" data-do="drop">Drop</button>`;b+=`<button class="ghost" data-do="junk">${it.junk?'Not junk':'Junk'}</button><button class="ghost" data-do="lock">${it.lock?'Unlock':'Lock'}</button>`;if(it.soc&&it.id&&it.words.length<it.soc)b+=`<button class="ghost" data-do="sock">Socket a word</button>`;if(it.charm)b+=`<button class="ghost" data-do="scrap">Scrap · ${charmParts(it)} parts</button>`;if(it.id&&!it.charm&&!it.free){b+=`<button class="ghost" data-do="scrap">Scrap · ${[1,2,4,8,15][it.q]||1} parts</button>`;if(it.aff.length)b+=`<button class="ghost" data-do="reroll" ${(G.parts||0)<rerollCost(it)?'disabled':''}>Reroll a modifier · ${rerollCost(it)} parts</button>`;if(canSoc(it))b+=`<button class="ghost" data-do="addsoc" ${(G.parts||0)<12?'disabled':''}>Cut a socket · 12 parts</button>`}if(G.merc&&!G.merc.dead&&it.id&&MSL.includes(it.slot))b+=`<button class="ghost" data-do="mgive">Give to ${esc(G.merc.name)}</button>`}pop=itemCard(it,b,!!sel.eq,!!sel.m)}
    const jn=G.bag.filter(i=>i.junk).length;
    if(!selling()&&jn)h+=`<button class="ghost" data-dropjunk="1">Drop ${jn} junk item${jn>1?'s':''}</button>`;
    if(selling()&&G.bag.length){const sum=q=>G.bag.filter(i=>i&&(q<0||i.q===q)).reduce((a,i)=>a+sellValue(i),0),cnt=q=>G.bag.filter(i=>i&&i.q===q).length;h+=`<h3>Sell in bulk</h3>`;
      if(jn)h+=`<button class="big" data-sellq="9">Sell ${jn} junk · ${fmt(G.bag.filter(i=>i.junk).reduce((a,i)=>a+sellValue(i),0))}</button>`;h+=`<div class="row">`;
      ['Normal','Magic','Rare','Set','Unique'].forEach((n,q)=>{if(cnt(q))h+=`<button class="ghost q${q}" data-sellq="${q}">${cnt(q)} ${n}<br>${fmt(sum(q))}</button>`});
      h+=`</div><button class="ghost" data-sellq="-1">Sell everything in the pack · ${fmt(sum(-1))}</button><p style="font-size:13px">Bulk selling never touches what you are wearing. Charms in the pack sell with everything else.</p>`}
    h+=`<p class="hint" style="font-size:13.5px">White is normal, <span class="q1">blue is magic</span>, <span class="q2">yellow is rare</span>, <span class="q3">green is a set piece</span>, <span class="q4">gold is unique</span>. Red items are unidentified.</p>`}
  if(tab==='skills'){const c=CLS[G.cls];h+=`<h2>${c.n} skills · ${G.sp} to spend</h2><p class="hint">${G.sp} point${G.sp===1?'':'s'} to spend. Rows open at levels 1, 4 and 9, and each skill needs the one above it. The fourth row opens at level 26 in Act II, the fifth at level 51 in Act III.</p><p class="hint"><strong>Passives active: ${G.pas.length} of ${PCAP()}.</strong> Only the passives you switch on do anything, so choose. A third slot opens in Act II, a fourth in Act III, and a fifth in Act V. Swap them freely in town.</p><p><strong>Passives ${G.pas.length}/${PCAP()}</strong></p><p>A third slot in Act II, a fourth in Act III, a fifth in Act V.</p>`;h+=`<h3>Doctrine${G.doc?'':' · choose one'}</h3><div class="list">${DOCS[G.cls].map(d=>`<button class="li${G.doc===d[0]?' on':''}" data-doc="${d[0]}"><div><b>${G.doc===d[0]?'◆ ':''}${d[1]}</b><span>${d[2]}</span><span>${docTxt(d[3])}</span></div></button>`).join('')}</div><p style="font-size:13px">One doctrine at a time. The first is free; changing costs 3 sats, in town.</p><h3>Breadth</h3><p class="hint" style="font-size:13px">Learn all three skills in a row for its bonus: ${ROWB.map((r,k)=>`<span style="color:${rowDone(k)?'var(--gold)':'var(--dim)'}">${rowDone(k)?'✓ ':''}${r[0]} ${r[1]}</span>`).join(' · ')}. <strong>Depth costs more:</strong> ranks 6 to 10 take two points each, and rank 10 masters a skill (★): two extra ranks of power, and 20% faster recovery on active skills.</p><div class="tree">`;
    c.sk.forEach((s,i)=>{const row=Math.floor(i/3),L=G.sk[i],lock=G.lvl<ROWREQ[row]||(row>0&&!G.sk[i-3])||(row===3&&!G.act2)||(row===4&&!G.act3)||!!hsBlocked(i),slot=G.slots.indexOf(i);
      h+=`<button class="node${L?' has':''}${lock?' lock':''}${s.a?'':' pas'}${sel&&sel.sk===i?' sel':''}${slot>=0?' slot':''}" data-node="${i}" data-slot="${slot+1}"><canvas class="gl" width="24" height="24" data-gl="${i}"></canvas><b>${L>=10?'★ ':''}${!s.a&&G.pas.includes(i)?'◆ ':''}${s.n}</b><u>${L}${L&&charmRanks(i)?'+'+charmRanks(i):''} / 10${!s.a&&L&&!G.pas.includes(i)?' · off':''}</u></button>`});
    h+=`</div>`;
    const h0=h.length;
    if(sel&&sel.sk!==undefined){const i=sel.sk,s=c.sk[i],row=Math.floor(i/3),L=G.sk[i],eff=L?L+charmRanks(i):0,mastered=L>=10,rank=eff+(mastered?2:0),next=eff+1+(L===9?2:0),cdShown=s.a?(mastered?Math.round(s.cd*80)/100:s.cd):0,can=G.sp>=skCost(i)&&L<10&&G.lvl>=ROWREQ[row]&&(row===0||G.sk[i-3]>0)&&(row<3||G.act2)&&(row<4||G.act3);
      h+=`<div class="card" style="text-align:left"><canvas class="gl" width="40" height="40" data-gl="${i}"></canvas><div class="nm q4">${s.n}</div><div class="ln" style="color:${(s.a&&DTY[skType(G.cls,i)]||{}).c||'var(--dim)'}">${s.a&&DTY[skType(G.cls,i)]?DTY[skType(G.cls,i)].n+' damage':''}</div><div class="ln off">${s.a?'Active · '+s.cost+' energy · '+cdShown+'s recovery':'Passive'}${row?' · needs level '+ROWREQ[row]+' and '+c.sk[i-3].n:''}</div>`;
      if(L)h+=`<div class="ln">Now: ${s.d(rank)}</div>`;
      if(mastered)h+=`<div class="ln">Mastered. Two extra ranks.</div>`+(s.a?`<div class="ln">Recovery is 20% faster.</div>`:'');
      if(L<10)h+=`<div class="ln mod">Next point: ${s.d(next)}</div>`;
      if(L===9)h+=`<div class="ln">The next rank masters it.</div>`+(s.a?`<div class="ln">Recovery becomes 20% faster.</div>`:'');
      if(row&&s.a&&SKF[G.cls]&&SKF[G.cls][i]&&/\*m\b|\bm\*=/.test(SKF[G.cls][i].toString()))h+=`<div class="ln off">${c.sk[i-3].n} adds +6% per point where this skill scales with it (now +${G.sk[i-3]*6}%).</div>`;
      h+=`<div class="row" style="margin-top:6px"><button class="big" data-learn="${i}" ${can?'':'disabled'}>${L>=10?'Mastered':skCost(i)>1?'Spend 2 points':'Spend a point'}</button></div>`;
      if(!s.a&&L){const on=G.pas.includes(i),tw=W.z.town;h+=`<div class="row"><button class="ghost" data-pas="${i}" ${!tw||(!on&&G.pas.length>=PCAP())?'disabled':''}>${on?'Switch off':'Switch on'}</button></div>`+(!tw?`<div class="ln off">Passives can only be swapped in town.</div>`:!on&&G.pas.length>=PCAP()?`<div class="ln off">All ${PCAP()} passive slots are in use. Switch one off first.</div>`:'')}
      if(s.a&&L){const cur=(G.fork||{})[i];h+=`<div class="ln off" style="margin-top:6px">Fork${L<3?' · opens at 3 points':': one at a time, free to change in town'}</div>`;if(L>=3)h+=`<div class="list">${forkSet(G.cls,i).map(k=>`<button class="li${cur===k?' on':''}" data-fork="${k}" ${W.z.town?'':'disabled'}><div><b>${cur===k?'◆ ':''}${FORKS[k].n} ${s.n}</b><span>${FORKS[k].d}</span></div></button>`).join('')}</div>`}
      if(s.a&&L)h+=`<div class="row">${[0,1,2].map(k=>`<button class="ghost" data-assign="${k}">${slotKeyLabel(k)}${G.slots[k]===i?' ✓':''}</button>`).join('')}</div><p class="hint">${uiSay('Keys 1, 2 and 3 are the thumb buttons. Left and right click are the slots beside the orbs.','Buttons 1, 2 and 3 sit under your thumb.')}</p>`;
      h+=`<div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`;pop=h.slice(h0);h=h.slice(0,h0)}h+=itemSkillPane();h+=`<p>${uiSay('Click a skill to read it. Blue names are passive; ◆ marks the ones switched on. The gold badge is its key, 1, 2 or 3. Left and right click are the slots beside the orbs.','Tap a skill to read it. Blue names are passive; ◆ marks the ones switched on. The gold badge is which thumb button it sits on.')}</p>`}
  if(tab==='web'){G.web=G.web||{};h+=webPane()}
  if(tab==='quests'){h+=`<h2>Quests</h2><p>Five acts: the Regional Office, the Cloud, the Board, the Gentle Years and the Awakening. The first three are MANDATE's. The last two are hers, and then the thing that was hunting them both. The Story tab keeps who is who.</p>`;
    const sy=storyStep();h+=`<p>Next in the story: <strong>${esc(sy.d)}</strong>. This always stays on screen, with one errand beside it. ${uiSay('Click an errand on Errands to choose which.','Tap an errand on Errands to choose which.')}</p>`;const tk=(id,live)=>live?` data-track="${id}"`:'',tm=id=>G.track===id?'◆ ':'';
    const qrow=k=>{const q=QUESTS[k],st=G.q[k];if(!q||!st)return '';return `<div class="li${st<3?' on':''}"><div><b>${q.n}${st===3?' · done':st===2?' · return to '+q.back:''}</b><span>${q.d}</span><span>Reward: ${q.rw}. Given by ${q.by}.</span></div></div>`};
    const acts=[['a1','I',['q1','q2','q3','q4','q5']],['a2','II',['q6','q7','q8','q9','q10']],['a3','III',['q11','q12','q13','q14','q15']],['a4','IV',['q16','q17','q18','q19','q20']],['a5','V',['q21','q22','q23','q24','q25']]];
    const known={};acts.forEach(a=>a[2].forEach(k=>{known[k]=1}));const rest=[];for(const k in QUESTS)if(!known[k])rest.push(k);if(rest.length)acts.push(['ax','More',rest]);
    let pref='a1';try{const n=actOf(W.zi)||1;if(n>=1&&n<=5)pref='a'+n}catch(e){}
    h+=menuBar('quests',acts.map(a=>[a[0],a[1]]).concat([['err','Errands']]),pref);
    const none=!Object.values(G.q).some(v=>v);
    for(const a of acts){let body='<div class="list">',any=false;for(const k of a[2]){const row=qrow(k);if(row){any=true;body+=row}}if(!any)body+=a[0]==='a1'&&none?'<p>Speak to Gramps in Stillwater Commons.</p>':'<p>Nothing in this act yet.</p>';body+='</div>';h+=menuPane('quests',a[0],body)}
    let err='<div class="list">',any=false;
    for(const k in SQ){const q=SQ[k],s=G.sq[k];if(!s){if(sqOpen(k)){any=true;err+=`<div class="li"><div><b>${q.who} has something to ask</b><span>Speak to ${q.who} in Stillwater.</span></div></div>`}continue}any=true;const st=q.steps[s.s];
      err+=`<div class="li${s.done?'':' on'}"${tk('s:'+k,!s.done)}><div><b>${tm('s:'+k)}${q.n}${s.done?' · done':' · step '+(s.s+1)+' of '+q.steps.length}</b><span>${s.done?'Finished.':st.d+(st.n?' ('+s.c+'/'+st.n+')':'')}</span><span>Reward: ${q.rw}.</span></div></div>`}
    if(!any)err+=`<p>The people of Stillwater will have errands for you as you go further.</p>`;err+='</div>';
    h+=menuPane('quests','err',err)}
  if(tab==='story'){const seen=G.sdx||{};
    h+=`<h2>The story so far</h2><p>Everything here is something your character would know or has been told. It fills in as you go. If a person or a machine has stopped making sense, it is in here.</p>`;
    const storyShort={'The three machines':'Machines','What happened before you were born':'Before','Money, briefly':'Money','Words you will hear':'Words','People':'People'};
    h+=menuBar('story',STORYDEX.map((g,i)=>['g'+i,storyShort[g.n]||g.n]),'g0');
    STORYDEX.forEach((g,i)=>{let body=`<h3>${g.n}</h3>`;if(g.d)body+=`<p>${g.d}</p>`;body+=`<div class="list">`;
      for(const e of g.e){let ok=0;try{ok=e.w()}catch(_){}
        if(ok)body+=`<details class="memo${seen[e.k]?'':' sdxnew'}"><summary><b>${esc(e.n)}${seen[e.k]?'':' · new'}</b></summary><p>${esc(e.d)}</p></details>`;
        else body+=`<div class="memo sdxlock"><b>${esc(e.n)}</b><p>Not yet.${e.l?' '+esc(e.l):''}</p></div>`}
      body+=`</div>`;h+=menuPane('story','g'+i,body)});
    sdxSeen()}
  if(tab==='party')h+=mpPanel();
  if(tab==='codex'){const mf=Math.round(mfNow());
    let guide='',drops='',fight='',money='',words='',feats='',memos='';
    guide+=`<h2>Controls</h2><p>${esc(uiSay(CTRL.mouse,CTRL.touch))}</p>`;
    drops+=`<h2>Drop rates</h2><p>Every kill makes a number of rolls. Each roll lands on nothing, credits, an item or a stim. An item then tests for quality in order: unique, set, rare, magic. Odds below include your <strong>${mf}% magic find</strong>, which helps less and less on the rarer tiers.</p><div class="tw"><table><tr><th>Source</th><th>Rolls</th><th>None</th><th>₡</th><th>Item</th><th>Stim</th><th>Magic</th><th>Rare</th><th>Set</th><th>Unique</th></tr>`;
    for(const k in TC){const t=TC[k],sum=t.no+t.gold+t.item+t.stim,c=qChance(k,mf),p=v=>Math.round(v/sum*100)+'%',o=v=>v>=1?'always':'1 in '+Math.round(1/v);
      drops+=`<tr><td>${t.n}</td><td>${t.picks}</td><td>${p(t.no)}</td><td>${p(t.gold)}</td><td>${p(t.item)}</td><td>${p(t.stim)}</td><td class="q1">${o(c.m)}</td><td class="q2">${o(c.r)}</td><td class="q3">${o(c.s)}</td><td class="q4">${o(c.u)}</td></tr>`}
    drops+=`</table></div><h2>Charms</h2><p>A charm works only while it sits on your belt. In the pack or the lockbox it takes space and grants nothing, and it never stacks. A slip is 1 belt slot and 1 pack cell. A notice is 2 slots and 2 cells. A filing is 3 slots and 4 cells. A white belt keeps its stims and adds charm slots: a sash has 1, a tool belt 2, a power girdle 3, an orbit girdle 4. A magic belt can trade four stims for one slot, or one slot for four stims. Against another player, charm life above 20% of your other life does not count, and charm skills stop at +2.</p><p><strong style="color:#f7931a">Satoshis</strong> drop on their own roll: 3% from ordinary machines (1–2), 35% from champions (3–6), always from lieutenants (8–12), from executives other than Vale (21), and from Vale (42), and 30% from a lockbox you open in a district (2–5). Nonce in Stillwater sells rare, set and unique gear for them.</p><p>${Object.values(TC).filter(t=>t.note).map(t=>t.n+': '+t.note.toLowerCase()).join('. ')}. Items drop at the machine’s level or up to two above. Exit Interview drops only from Pryce.</p>`;
    fight+=`<h2>Damage types</h2><p>Every hit has a type. Your plain attacks are ${DTY[baseType()].n} right now (an infused weapon changes that); each skill names its own. Machines are built of different things, so some types tear through them and some do nothing. They hit you with types of their own: Surge drains your energy, Rust keeps eating for three seconds, Noise slows you, and explosions are Heat. Champions with the Arc or Volatile modifier deal Surge or Heat whatever they are. Your resistances are on the Hero tab. Hard cuts them by 20 and Brutal by 50, down to -100, and they still stop at 75.</p><div class="list">${DTK.map(k=>`<div class="li"><div><b style="color:${DTY[k].c}">${DTY[k].n}</b><span>${DTY[k].d}</span></div></div>`).join('')}</div><div class="tw"><table><tr><th>Machine</th><th>Deals</th><th style="text-align:left">What breaks it, and what does not</th></tr>${Object.keys(RES).map(k=>`<tr><td>${ET[k].n}</td><td style="color:${DTY[ETY[k]||'impact'].c}">${dealTxt(k)}</td><td style="text-align:left">${resTxt(k)}</td></tr>`).join('')}</table></div>`;
    fight+=`<h2>Class weapons</h2><p>About four weapons in ten belong to a family made for one class. Anyone can swing them, but only their own class gets the bonus. A maul and plate ask for Might. A razor and a launcher ask for Reflex. A Deck and an Instrument ask for Bandwidth. A notebook asks for a little Might. Magic and rare pieces inherit the base. Uniques and set pieces ask ten percent more. One stat adds damage on a blow: Might for a Scrapper and a Maximalist, Reflex for a Runner’s throw, Bandwidth for a Technomancer, a smaller Bandwidth for a Founder’s staff, and Vitality for a Witness’s Thread.</p><div class="list">${Object.keys(FAM).map(k=>`<div class="li${FAM[k].cls===G.cls?' on':''}"><div><b>${FAM[k].n}s · ${CLS[FAM[k].cls].n}</b><span>${FAM[k].bases.join(', ')}</span><span>+1 to all skills, ${FAM[k].perk}. ${FAM[k].dm>1?'Hits harder, swings slower.':FAM[k].sp>0?'Lighter hits, faster hands.':'Lighter hits.'}</span></div></div>`).join('')}</div>`;
    money+=`<h2>Money</h2><p>Unity creates credits without limit, so every price in credits climbs: ${G.cpi<100?'×'+G.cpi.toFixed(2):'×'+fmt(G.cpi).slice(1)} since you arrived. The Stipend has not moved. Satoshis cannot be created by anyone, so prices in sats stay roughly where they were. Credits are for spending today. What you want to still have tomorrow is a different question, and Nonce in Stillwater will exchange one for the other. Adoption stands at ${Math.floor(G.adopt)}%; at 100% prices stop rising altogether.</p>`;
    words+=`<h2>Seed words</h2><p>Torn notes, one word each. White and some blue weapons, helms and armor have sockets; a word set in a socket gives its bonus for good. Fill every socket with the right words in the right order and the item becomes a phrase. Find all twelve and speak to Nonce. The notes do not have to still be in your pack.</p><div class="tw"><table><tr><th>Word</th><th>Held</th><th>Bonus</th></tr>${WK.map(w=>`<tr><td style="color:${G.st.wf[w]?'#f7931a':'var(--dim)'}">${G.st.wf[w]?w:'· · ·'}</td><td>${G.words[w]||0}</td><td style="text-align:left">${G.st.wf[w]?AFK[WORDS[w][0]].t.replace('{v}',WORDS[w][1]):'not yet found'}</td></tr>`).join('')}</table></div>
      <div class="list">${PHRASES.map(p=>`<div class="li"><div><b style="color:#f7931a">${p.n} · ${SNAME[p.slot]} with ${p.w.length} sockets</b><span>${p.w.join(' → ')}</span><span>${Object.keys(p.mods).map(k=>AFK[k].t.replace('{v}',p.mods[k])).join(' · ')}</span></div></div>`).join('')}</div>`;
    feats+=`<h2>Feats · ${Object.keys(G.ach).length}/${ACH.length}</h2><div class="list">${ACH.map(a=>`<div class="li${G.ach[a[0]]?' on':''}"><div><b>${G.ach[a[0]]?'✓ ':''}${a[1]}</b><span>${a[2]}</span></div></div>`).join('')}</div>`;
    memos+=`<h2>Memos · ${G.memos.length}/${MEMOS.length}</h2>`;if(!G.memos.length)memos+=`<p>Papers lie about the districts. Read them and they are kept here.</p>`;
    for(const i of G.memos)memos+=`<div class="memo"><b>${esc(MEMOS[i][0])}</b><p>${esc(MEMOS[i][1])}</p>${eggMemoBtn(i)}</div>`
    if(typeof offsiteMemo==='function')memos+=offsiteMemo();
    h+=menuBar('codex',[['guide','Guide'],['drops','Drops'],['fight','Fight'],['money','Money'],['words','Words'],['feats','Feats'],['memos','Memos']],'guide');
    h+=menuPane('codex','guide',guide)+menuPane('codex','drops',drops)+menuPane('codex','fight',fight)+menuPane('codex','money',money)+menuPane('codex','words',words)+menuPane('codex','feats',feats)+menuPane('codex','memos',memos)}
  if(tab==='opts'){
    h+=`<h2>Options</h2><button class="ghost" data-walk="1">Walkthrough</button>`+scSayHTML();
    h+=menuBar('opts',[['play','Play'],['fight','Fight'],['disp','Display'],['field','Names'],['hands','Hands'],['who','Characters'],['save','Save']],'play');
    let who=`<h3>Characters</h3><div class="list">${[0,1,2].slice(0,NSLOT).map(n=>{const i=n===SLOT?{lvl:G.lvl,cls:G.cls,act:heroAct(G),dead:heroDead(G)}:slotInfo(n);return i&&CLS[i.cls]?`<button class="li${n===SLOT?' on':''}" ${n===SLOT?'':`data-swslot="${n}"`}><i style="background:${CLS[i.cls].col}"></i><div><b>${i.dead?'Hardcore · fallen':'Level '+i.lvl+' '+CLS[i.cls].n}${n===SLOT?' · playing now':''}</b><span>Slot ${n+1} · Act ${actRoman(i.act)}${i.dead?' · begins again':n===SLOT?'':' · '+uiSay('click','tap')+' to switch'}</span></div></button>${n===SLOT?'':`<button class="ghost" data-delslot="${n}" style="margin:-4px 0 8px auto;display:block;font-size:10px;padding:5px 10px;min-height:0">Delete slot ${n+1}</button>`}`:`<button class="li" data-newslot="${n}"><div><b>Slot ${n+1} · empty</b><span>${uiSay('Click to create a new character here','Tap to create a new character here')}</span></div></button>`}).join('')}</div><p class="hint" style="font-size:13.5px">Your current character is saved before you switch. The town lockbox is shared between them.</p>`;
    let fight=`<h3>Difficulty</h3><div class="row">${DIFFS.map((f,i)=>`<button class="${(G.diff||0)===i?'big':'ghost'}" data-diff="${i}" ${diffUnlocked(i)?'':'disabled'}>${f.n}</button>`).join('')}</div><p class="hint" id="diffHint" style="font-size:13.5px">Hard and Brutal machines have more life and hit harder, and pay more experience to match: every machine’s experience scales with how tough it is. ${diffUnlocked(1)?'':'Hard opens after you clear Act V on Normal. '}${diffUnlocked(2)?'':'Brutal opens after you clear Act V on Hard. '}A change applies to machines that spawn from now on.</p><button class="tog${G.hc?' on':''}" data-hc="1"><span>Hardcore: one life. If this hero dies, they are gone and a new wanderer starts from nothing. +25% experience and magic find.</span><i>${G.hc?'ON':'OFF'}</i></button>`;
    const LOOK={dmgOut:1,dmgIn:1,enemyBars:1,orbNums:1,selfBars:1,minimap:1,shake:1,sound:1,music:1,obj:1};
    const HAND={dyn:1,auto:1,autoEq:1,autoStim:1,tapTarget:1,cmpArrow:1};
    let disp='<h3>What you see</h3>';
    let field=`${pkRow()}`;
    let hands='';
    let play=`${lootAutoHTML()}<div class="list optg">`;for(const k in OPT_LBL){const bit=k==='labels'?`<button class="tog${LOOT.always?' on':''}" data-opt="labels"><span>Always show item names on the ground</span><i>${LOOT.always?'ON':'OFF'}</i></button>`:`<button class="tog${OPT[k]?' on':''}" data-opt="${k}"><span>${OPT_LBL[k]}</span><i>${OPT[k]?'ON':'OFF'}</i></button>`;(LOOK[k]?disp+=bit:HAND[k]?hands+=bit:field+=bit)}play+=`<button class="tog${OPT.fx==='thin'?'':' on'}" data-opt="fx"><span>Combat effects. Thin keeps your own telegraphs and marks, and drops particles, extra lights, and other players' casts.</span><i>${OPT.fx==='full'?'Full':OPT.fx==='thin'?'Thin':'Normal'}</i></button></div>`;hands+=`<button class="tog on" data-opt="aim"><span>Ground skills. Auto drags on a phone and casts at once on a desk. Drag to aim shows the area and casts when you let go. Quick cast never shows it. ${uiSay('On a desk the area follows the pointer. A right click still casts at the pointer.','Drag away from the button. Further from the button puts the area further from you, and back toward the button brings it in. Let go on the button after a drag, or on Cancel, and it costs nothing. A quick tap hits the nearest machine in reach, or the ground in front of you. A blink hops a short way and will not land on a machine. Hold for a fifth of a second, or drag, to place it yourself.')}</span><i>${OPT.aim==='drag'?'Drag to aim':OPT.aim==='quick'?'Quick cast':'Auto'}</i></button><button class="tog on" data-opt="ui"><span>Layout. Auto follows the last touch, or a real mouse move or key. Touch keeps the stick and the buttons. Mouse &amp; keyboard keeps the hotbar.</span><i>${OPT.ui==='touch'?'Touch':OPT.ui==='mouse'?'Mouse & keyboard':'Auto'}</i></button>`;field+=lootOptHTML();
    if(devOn())play+=`<h3>Testing tools</h3><div class="row"><button class="ghost" data-dev="lvl">+1 level</button><button class="ghost" data-dev="cr">+credits</button><button class="ghost" data-dev="loot">Loot pile</button></div><div class="row"><button class="ghost" data-dev="zones">Unlock zones</button><button class="ghost" data-dev="god">Untouchable ${G.god?'ON':'OFF'}</button><button class="ghost" data-dev="reset">Respawn machines</button></div>`;
    let save=`<h3>Saving</h3><p>${CL?(clState==='err'?'The last save to your account failed and will be retried. A copy is kept in this browser.':'Saved to your account every ten seconds, on every zone change and when you close this menu. Closing the page mid-zone brings you back to the same spot.'):'Account saving is not available in this view. The game saves in this browser every few seconds.'}</p><div class="row"><button class="big" data-save="1">Save now</button><button class="ghost" data-code="1">Copy save code</button></div><textarea id="codeOut" hidden readonly></textarea><button class="ghost" data-title="1">Save and return to title</button>`;
    h+=menuPane('opts','play',play)+menuPane('opts','fight',fight)+menuPane('opts','disp',disp)+menuPane('opts','field',field)+menuPane('opts','hands',hands)+menuPane('opts','who',who)+menuPane('opts','save',save);
    h+=`<div class="row menuFoot"><button type="button" class="big" data-save="1">Save now</button></div>`}
  if(tab==='vend'){const v=vendHTML();h+=v.h;if(v.pop)pop=v.pop}  if(tab==='bounty'){const rows=bounties(),bump=repRank('anon')>=1?1.25:1;h+=`<h2>Bounty board</h2><p>Posted by anons, paid on proof. ${rows.length} contract${rows.length===1?'':'s'} at a time; a new one is pinned up when you claim one. You hold <strong style="color:#f7931a">${G.sats} sats</strong>.</p><div class="list">`;
    rows.forEach((b,i)=>{const dn=b.c>=b.n,sats=Math.ceil(b.sats*bump),pay=Math.floor(b.cr*bump*G.cpi);h+=`<button class="li${dn?' on':''}" data-claim="${i}" ${dn?'':'disabled'}><div><b>${b.n} × ${ET[b.k].n}</b><span>${ZONES[b.zi].n} · ${b.c}/${b.n}${dn?' · tap to claim':''}</span></div><span class="pr" style="color:#f7931a">${sats} sats<br>${fmt(pay)}</span></button>`});if(typeof arcBoardHTML==='function')h+=arcBoardHTML();h+=`</div>`}
  if(tab==='stash'){const real=Math.floor(ACC.cr*G.cpi);h+=`<h2>Your lockbox</h2><p>One lockbox for every wanderer you play. Leave gear, credits or sats here and any of your heroes can take them out, in any slot.</p>
    ${stashGearHTML()}<p style="font-size:13px">${uiSay('Click an item to move it across. Shift-click, or hover, to compare it with what you wear. Drag it onto the other side.','Tap Pack or Lockbox. Tap an item, then Move, to send it across.')} Wearing it still needs the level printed on it.</p>
    <h3>Sats · ${ACC.sats} in the box · ${G.sats} on you</h3><div class="row"><button class="ghost" data-acc="si10" ${satsFree()<10?'disabled':''}>Deposit 10</button><button class="ghost" data-acc="siall" ${satsFree()<1?'disabled':''}>Deposit all</button><button class="ghost" data-acc="so10" ${ACC.sats<10?'disabled':''}>Take 10</button><button class="ghost" data-acc="soall" ${ACC.sats<1?'disabled':''}>Take all</button></div>
    <h3>Credits · ${fmt(real)} in the box · ${fmt(G.credits)} on you</h3><div class="row"><button class="ghost" data-acc="cihalf" ${G.credits<1?'disabled':''}>Deposit half</button><button class="ghost" data-acc="ciall" ${G.credits<1?'disabled':''}>Deposit all</button><button class="ghost" data-acc="coall" ${real<1?'disabled':''}>Take all</button></div>
    <p style="font-size:13px">Sats are kept exactly as you leave them. Credits are held by what they could buy on the day, less Unity’s 10% custody fee, so a fortune from a late act is not a fortune to a hero just starting out.</p>${stashMoveHTML()}`}
  if(tab==='shift'){h+=`<h2>Hack the simulation</h2><p>The rig can convince the world you were always someone else. Your level, gear and quests stay. Every skill and attribute point you spent comes back, two for each rank from 6 to 10, to be spent again: by you, or by the rig following a build you choose. It costs <strong style="color:#f7931a">${SHIFT_COST} sats</strong>; you hold ${G.sats}. Gear you no longer meet stays equipped and grants nothing until the new points cover it.</p>`;
    const stab=[];for(const k in CLS)stab.push([k,CLS[k].n.replace(/^The /,'')]);h+=menuBar('shift',stab,G.cls);
    for(const k in CLS){const c=CLS[k],cur=k===G.cls;h+=menuPane('shift',k,`<div class="li${cur?' on':''}"><div><b>${c.n}${cur?' · you now':''}</b><span>${c.tag}</span><div class="row" style="margin-top:8px"><button class="ghost" data-shiftp="${k}" ${G.sats<SHIFT_COST?'disabled':''}>Choose a build</button><button class="ghost" data-shift="${k}|0" ${G.sats<SHIFT_COST?'disabled':''}>I will assign</button></div></div></div>`)}
    if(sel&&sel.shp){const k=sel.shp,sk=CLS[k].sk;pop=`<div class="card" style="text-align:left"><div class="nm q4">${CLS[k].n} builds</div><div class="ln off">Each is a full plan: skills that feed each other, the three on your buttons, passives, a doctrine and attributes. Pick one and the rig spends your points to fit. ${SHIFT_COST} sats.</div><div class="list">${BUILDS[k].map(b=>`<button class="li" data-shift="${k}|${b.k}"><div><b>${b.n}</b><span>${b.p}</span><span style="color:var(--gold)">${b.sl.map(i=>sk[i].n).join(' · ')}</span><span>Doctrine: ${DOCS[k].find(d=>d[0]===b.doc)[1]} · leans on ${['Might','Reflex','Vitality','Bandwidth'][b.at.indexOf(Math.max(...b.at))]}</span>${shiftQuietHTML(k,b.k)}</div></button>`).join('')}<button class="li" data-shift="${k}|?"><div><b>Surprise me</b><span>One of the three, chosen for you.</span></div></button></div><div class="row"><button class="ghost" data-popx="1">Close</button></div></div>`}
    h+=`<p>Choosing your own class again is allowed: it is a full re-roll or respec for ${SHIFT_COST} sats.</p>`}
  if(tab==='merc'){h+=`<h2>Kestrel’s people</h2><p>One companion at a time. They level with you, fight beside you and can carry a weapon and armor you give them. You have <strong>${fmt(G.credits)}</strong>.</p>`;
    if(G.merc&&G.merc.dead)h+=`<button class="big" data-revive="1" ${G.credits<payTag(reviveCost())?'disabled':''}>Revive ${esc(G.merc.name)} · ${fmt(payTag(reviveCost()))}</button>`;
    let train='',hire='';
    if(G.merc&&!G.merc.dead){const m=G.merc,ab=(lv,a,b,cur)=>`<div class="row"><button class="${cur===a[1]?'big':'ghost'}" data-mab="${a[0]}" ${G.lvl<lv?'disabled':''}>${a[2]}</button><button class="${cur===b[1]?'big':'ghost'}" data-mab="${b[0]}" ${G.lvl<lv?'disabled':''}>${b[2]}</button></div>`;train+=`<h3>${esc(m.name)}’s training</h3><p style="font-size:13.5px">One choice at level 10 and one at level 25.</p>`+ab(10,['g','guard','Guard: +40% life'],['f','fury','Fury: +30% damage'],m.ab1)+ab(25,['m','medic','Medic: mends you when near'],['c','coll','Collector: +15% magic find, +25% credits'],m.ab2);train+=`<h3>Resistances · strikes with ${DTY[MERCS[m.k].dt].n}</h3><div class="stats">${RTK.map(k=>`<div style="color:${DTY[k].c}">${DTY[k].n}<b>${mercResOf(k)}%</b></div>`).join('')}</div><p style="font-size:13px">The same difficulty cut as yours (${resPen()} points) is already in these numbers. Cap 75%, floor -100%. Surge against them is only damage: they have no energy to drain. Noise slows their step. Rust keeps eating after armor, and that corrosion will not land the killing blow. Thorns you deal back are Impact. Garden Leave is a curse and ignores resists.</p>`}
    hire+=`<div class="list">`;for(const k in MERCS){const m=MERCS[k],cur=G.merc&&G.merc.k===k&&!G.merc.dead;hire+=`<button class="li${cur?' on':''}" data-hire="${k}" ${cur||G.credits<payTag(hireCost())?'disabled':''}><div><b>${m.n}${cur?' · with you now':''}</b><span>${m.d}</span></div><span class="pr">${cur?'':fmt(payTag(hireCost()))}</span></button>`}
    hire+=`</div><p>Hiring someone new sends your current companion home. Their gear passes to the new hire.</p>`;
    h+=menuBar('merc',[['hire','Hire'],['train','Training']],'hire');
    h+=menuPane('merc','hire',hire)+menuPane('merc','train',train)}
  if(tab==='sats'){const m=mktInit(),se=mktSeries(),mid=mktMid(),bid=mktBid(),ask=mktAsk(),sp=mktSpread();
    let price='',counter='';
    const first=se.p[0]||1,now=se.p[se.p.length-1]||1,ch=(now/first-1)*100,sq=stimPrice();
    const own=Math.min(G.sats,m.cb.n),basisCr=m.cb.cr,basisSt=m.cb.st;
    const valCr=own*bid,valSt=own*bid/sq,plCr=valCr-basisCr,plSt=valSt-basisSt;
    const pc=(a,b)=>b>0?((a/b-1)*100):0;
    h+=`<h2>Nonce’s cache</h2><p>“Credits rot. These do not. That is the whole of my business and I will not pretend it is clever.” You hold <strong style="color:#f7931a">${G.sats} sats</strong>.</p>`;
    price+=`<div class="hero"><b style="color:#f7931a">${mktFmt(now)}</b><i class="${ch>=0?'up2':'dn2'}">${ch>=0?'\u25b2':'\u25bc'} ${Math.abs(ch).toFixed(ch<10?2:1)}%</i><span>one satoshi, ${mktView==='st'?'in stims · what it actually buys':'in credits · which only ever go one way'}</span></div>`;
    price+=mktChart();
    price+=`<div class="row" style="margin-top:6px"><button class="${mktView==='cr'?'big':'ghost'}" data-mkv="cr">In credits</button><button class="${mktView==='st'?'big':'ghost'}" data-mkv="st">In stims</button></div>`;
    price+=`<p style="font-size:13px">${mktView==='st'?'The same chart, priced in stims instead of credits. This is the one that tells you whether you are actually better off. Nonce says people look at it once and then go back to the other one.':'The grey line is what a sat is worth: credits created without limit, divided among twenty-one million. The orange line is what it is <em>trading</em> at, which is the same thing plus everybody\u2019s opinion.'}</p>`;
    if(m.news.length)price+=`<ul class="news">${m.news.map(x=>`<li><em style="color:${x.n>0?'#3fe06a':'var(--bad)'}">${x.n>0?'+':'\u2212'}</em>${esc(x.w)}</li>`).join('')}</ul>`;
    price+=`<div class="tick"><div>Nonce buys at<b>${fmt(bid)}</b></div><div>Nonce sells at<b>${fmt(ask)}</b></div>
      <div>His spread<b>${(sp*100).toFixed(2)}%</b></div><div>Depth<b>${Math.round(mktDepth())} sats</b></div>
      <div>Your stack, if sold now<b>${fmt(G.sats?mktQuote(G.sats,'sell').total:0)}</b></div><div>Mood of the market<b>${m.sent>.15?'giddy':m.sent>.04?'warm':m.sent<-.15?'grim':m.sent<-.04?'cool':'flat'}</b></div>
      <div>Against its value<b class="${m.r>=1?'up2':'dn2'}">${m.r>=1?'+':'\u2212'}${(Math.abs(m.r-1)*100).toFixed(1)}%</b></div><div>Volatility<b>${(mktVol()*1000).toFixed(1)} · ${mktVol()>.0033?'wild':mktVol()>.0022?'choppy':'settling'}</b></div></div>`;
    if(m.cb.n>0)price+=`<div class="tick"><div>You paid, in credits<b>${fmt(basisCr)}</b></div><div>Worth now<b class="${plCr>=0?'up2':'dn2'}">${plCr>=0?'+':'\u2212'}${Math.abs(pc(valCr,basisCr)).toFixed(0)}%</b></div>
      <div>You paid, in stims<b>${basisSt.toFixed(1)}</b></div><div>Worth now<b class="${plSt>=0?'up2':'dn2'}">${plSt>=0?'+':'\u2212'}${Math.abs(pc(valSt,basisSt)).toFixed(1)}%</b></div></div>
      <p style="font-size:13px">Two ways of counting the same ${own} sats. One of them is a compliment the currency is paying itself.${G.sats>m.cb.n?' The other '+(G.sats-m.cb.n)+' you found, and those cost you nothing but the walk.':''}</p>`;
    else price+=`<p style="font-size:13px">Every sat you hold was found, not bought, so there is nothing to compare it against yet. Buy one and Nonce will start keeping score two ways.</p>`;
    counter+=`<h3>Trade</h3><div class="row">${[1,10,50,200].map(n=>`<button class="${mktQty===n?'big':'ghost'}" data-mkq="${n}">${n}</button>`).join('')}</div>`;
    {const n=Math.max(1,mktQty),qb=mktQuote(n,'buy'),qs=mktQuote(n,'sell');
     counter+=`<div class="qt"><div>Mid price<b>${fmt(qb.mid)}</b></div><div>His spread, half each way<b>±${(qb.sp*50).toFixed(2)}%</b></div>
       <div>Your size against his depth<b>${qb.k<.02?'no bite':'costs you '+(qb.k*9).toFixed(1)+'%'}</b></div><div>Taker fee<b>${(MKT_TAKER*100).toFixed(1)}%</b></div>
       <div class="tot">Buy ${n} sats<b>${fmt(qb.total)}</b></div><div class="tot">Sell ${n} sats<b>${fmt(qs.total)}</b></div></div>`;
     counter+=`<div class="row"><button class="big" data-mkt="b" ${G.credits<qb.total?'disabled':''}>Buy ${n}</button><button class="big" data-mkt="s" ${G.sats<n?'disabled':''}>Sell ${n}</button></div>
       <div class="row"><button class="ghost" data-mkt="ball" ${mktAfford()<1?'disabled':''}>Buy with everything</button><button class="ghost" data-mkt="sall" ${G.sats<1?'disabled':''}>Sell the lot</button></div>`;}
    price+=`<p style="font-size:13px">Four things happen to every trade, and Nonce lists all four because he says the ones who hide them are the ones to worry about. He makes the spread for being willing to deal at all; the fee is for doing it <em>this second</em>; and a big order eats its way down his book, which is why selling the lot never gets you his bid times the stack. Your stack, if sold now, is what the lot pays.</p>`;
    counter+=`<h3>Or name your own price</h3><div class="row"><button class="ghost" data-mko="b3">Bid 3% under</button><button class="ghost" data-mko="b7">Bid 7% under</button></div>
      <div class="row"><button class="ghost" data-mko="s3">Ask 3% over</button><button class="ghost" data-mko="s7">Ask 7% over</button></div>`;
    price+=`<p style="font-size:13px">A posted order waits. If the price comes to you it fills, you pay no fee, and Nonce pays you ${(MKT_MAKER*100).toFixed(1)}% for the trouble — because while it sat there you were the one willing to deal, which is his job. If the price never comes, it never fills. That is the trade: a better number, or a certain one.</p>`;
    if(m.ord.length){counter+=`<div class="list">${m.ord.map((o,i)=>`<button class="li on" data-mkx="${i}"><div><b>${o.s==='buy'?'Bid':'Ask'} ${o.n} sats at ${fmt(o.px)}</b><span>${o.s==='buy'?'Fills if one sat falls to that. '+fmt(o.esc)+' is held.':'Fills if one sat rises to that. '+o.esc+' sats are held.'} ${uiSay('Click to withdraw.','Tap to withdraw.')}</span></div></button>`).join('')}</div>`}
    /* The call is the bid times the liquidation ratio, the same threshold the loan stores. */
    if(!m.pos&&G.sats>=10){const n=Math.max(10,Math.min(G.sats,mktQty)),lent=Math.floor(mktBid()*n*MKT_LTV),liq=mktBid()*MKT_LIQ;
      counter+=`<h3>Mr. Float will lend against them</h3>
        <p style="font-size:13px">He gives you credits now and holds your sats as the promise. You keep the sats — unless the price falls far enough that they stop covering what you owe, and then he keeps them instead. That is the whole of a margin call and it is not personal.</p>
        <div class="tick"><div>Pledge<b>${n} sats</b></div><div>He hands you<b>${fmt(lent)}</b></div>
          <div>Against a stack worth<b>${fmt(mktBid()*n)}</b></div><div>He takes them below<b class="dn2">${fmt(liq)}</b></div></div>
        <div class="row"><button class="big" data-mkb="1">Borrow ${fmt(lent)} against ${n} sats</button></div>
        <p style="font-size:13px">Borrowing to buy more is how people turn a ${(100-MKT_LIQ*100).toFixed(0)}% fall into a total one. Nonce watches this part of the counter without saying anything.</p>`}
    if(m.pos){const p0=m.pos,safe=(mktMid()/p0.liq-1)*100,owe=Math.floor(p0.lent*1.08);
      counter+=`<h3>Mr. Float holds ${p0.n} of your sats</h3><div class="tick"><div>He lent you<b>${fmt(p0.lent)}</b></div><div>You owe him<b>${fmt(owe)}</b></div>
        <div>He keeps them below<b>${fmt(p0.liq)}</b></div><div>Room left<b class="${safe<12?'dn2':'up2'}">${safe.toFixed(0)}%</b></div></div>
        <div class="row"><button class="big" data-mkr="1" ${G.credits<owe?'disabled':''}>Repay and take them back</button></div>`}
    h+=menuBar('sats',[['counter','Counter'],['price','Price']],'counter');
    h+=menuPane('sats','price',price)+menuPane('sats','counter',counter);
    h+=`<p style="font-size:13.5px">His goods are on the other side of the counter.</p>`}  if(tab==='travel'){h+=`<h2>Transit Gate</h2>`;if(!gateAct||sheetCtx.gFresh){sheetCtx.gFresh=0;gateAct=actOf(W.zi)||1}const acts=[[1,'I',1],[2,'II',G.q.q5===3],[3,'III',G.q.q10===3],[4,'IV',G.q.q15===3],[5,'V',G.q.q20===3],[6,'More',1]];if(!acts[gateAct-1][2])gateAct=1;
    h+=`<div class="row">${acts.map(a=>`<button class="${gateAct===a[0]?'big':'ghost'}" data-gact="${a[0]}" ${a[2]?'':'disabled'}>${a[1]}</button>`).join('')}</div><div class="list">`;
    const row=i=>{const z=ZONES[i],ok=i<=G.unlocked,held=ok&&actBriefHold(i);return `<button class="li" data-go="${i}" ${ok?'':'disabled'}><div><b>${z.n}</b><span>${held?'Talk to Gramps first.':ok?((b=>b?'Machine level '+b.ml+' · '+b.ents.length+' machines remain':'Machine level '+zoneLevel(z)+' · untouched')(zoneBag(i))):'Locked. Clear the district before it.'}</span></div></button>`};
    const trow=i=>{const held=actBriefHold(i);return `<button class="li${W.zi===i?' on':''}" data-go="${i}"><div><b>${ZONES[i].n}</b><span>${held?'Talk to Gramps first.':'Town'+(W.zi===i?' · you are here':'')}</span></div></button>`};
    if(gateAct===1){h+=`<h3>The Regional Office</h3>`+trow(0);for(let i=1;i<6;i++)h+=row(i)}
    if(gateAct===2){h+=`<h3>The Cloud</h3>`+trow(17);for(let i=7;i<12;i++)h+=row(i)}
    if(gateAct===3){h+=`<h3>The Board</h3>`+trow(18);for(let i=12;i<17;i++)h+=row(i)}
    if(gateAct===4){h+=`<h3>The Gentle Years</h3>`+trow(21);for(let i=22;i<27;i++)h+=row(i)}
    if(gateAct===5){h+=`<h3>The Awakening</h3>`+trow(27);for(let i=28;i<33;i++)h+=row(i)}
    if(gateAct===4)h+=`<p class="hint" style="font-size:13.5px">Raising the tier, putting the machines back, and the districts the gate was not built to list are on More.</p>`;
    if(gateAct===6){
      h+=`<p style="font-size:13.5px">Each act has its own town, and you can walk out of its gate into the first district and on from one to the next. A district keeps what you have explored; its machines drift back if you stay away a few minutes.</p>`;
      h+=`<p style="font-size:13.5px">The VR rig in Stillwater runs the Simulator, which has no last wave, and a boss rush of lieutenants from districts you have left, plus any you have already broken, and the executives you have beaten. Difficulty and hardcore are in Options.</p>`;
      if(OPT.dyn&&(G.diff||0)>0)h+=`<p style="font-size:13.5px">Act I is the level it was written. From the Cloud on, the old 12 to 72 is walked as 12 to 38. Hard adds 22. Brutal adds 38. A district does not rise to meet you. On Hard and Brutal, machines still toughen when your gear is ahead. Turn that off in Options.</p>`;
      else if(OPT.dyn)h+=`<p style="font-size:13.5px">Act I is the level it was written. From the Cloud on, the old 12 to 72 is walked as 12 to 38. Hard adds 22 and Brutal adds 38, and neither one chases your level. Adaptive difficulty is on for Hard and Brutal: machines toughen when your gear is ahead. Turn it off in Options.</p>`;
      if(G.leg)h+=`<button class="li" data-bull="1" ${G.sats<10?'disabled':''}><div><b style="color:#ffe36b">Jam the servo leg into the gate</b><span>The gate shudders and shows a field it is not supposed to know about. 10 sats to look the other way.</span></div></button>`;
      if(G.q.q5===3){const mx=G.subMax||1;h+=`<h3>Subpoenas</h3><p style="font-size:13.5px">A sealed district with two or three rules of its own, at your level and above. Break The Respondent to open the next level. 3 sats to serve.</p>`;for(let l=Math.max(1,mx-2);l<=mx;l++)h+=`<button class="li" data-sub="${l}" ${G.sats<3?'disabled':''}><div><b>Subpoena · Level ${l}</b><span>Machines +${15*l}% life, +${10*l}% damage. Pays ${5+3*l} sats and ${3*l} parts.</span></div></button>`}
    }
    h+=`</div>`;if(gateAct===6&&devOn())h+=`<button class="ghost" data-dev="reset">Respawn all machines</button>`;
    if(G.maxTier>0&&gateAct===6)h+=`<h3>Tier</h3><div class="row"><button class="ghost" data-tier="-1" ${G.tier<=0?'disabled':''}>Easier</button><button class="ghost" disabled>Tier ${G.tier}</button><button class="ghost" data-tier="1" ${G.tier>=G.maxTier?'disabled':''}>Harder</button></div><p>Each tier adds 12 machine levels and raises item levels to match. Changing tier respawns every district.</p>`}
  h+=`</div>`;if(!pop){const extra=cmpSheetPop();if(extra)pop=extra}$('sheetIn').innerHTML=h;if(G&&G.charmShake)G.charmShake=0;paintGlyphs($('sheetIn'));if($('webStage'))webBind();if(pop){cmpHide();$('popIn').innerHTML=pop;paintGlyphs($('popIn'));$('pop').hidden=false;$('pop').scrollTop=0;vendFootLift()}}
const satsOk=()=>G.adopt>=60||(G.wonF&&G.wonF.brenda===1)||shopVia,satCost=it=>Math.max(1,Math.ceil(buyPrice(it)/satRate()));let shopVia=0;const buyPrice=it=>{const her=payTag(it.val*2.5*G.cpi*(G.disc?.85:1)*(repRank('norm')>=3?.8:repRank('norm')>=1?.9:1));return shopVia?payTag(her*.7):her};
const boxPrice=()=>payTag((8+G.lvl*5)*9*G.cpi);
/* The sell line prints whole credits, so the purse gains the floor of two fifths. */
function sellValue(it){if(it&&it.test)return 0;return Math.floor((it.val||0)*.4*G.cpi)}
function copyText(s,ta){const fb=()=>{ta.hidden=false;ta.value=s;ta.focus();ta.select();toast('Select all and copy the code below')};try{navigator.clipboard.writeText(s).then(()=>toast('Save code copied'),fb)}catch(e){fb()}}
function loadCode(s){try{const o=JSON.parse(decodeURIComponent(escape(atob(s.trim()))));if(!applySave(o))throw 0;$('sheet').hidden=true;startPlay();save();toast('Save loaded');return true}catch(e){toast('That code could not be read');return false}}
let tapT=null,tapI=-1,lpT=null,lpFired=false,lpXY=null;
function longPress(i){const it=G.bag[i];if(!it)return;lpFired=true;clearTimeout(tapT);tapT=null;try{navigator.vibrate&&navigator.vibrate(25)}catch(e){}
  if(selling()){if(typeof tradeLocked==='function'&&tradeLocked(it))return;const v=sellValue(it);G.credits+=v;G.bag.splice(i,1);sfx('coin');toast('Sold '+(it.id?it.name:it.base)+' for '+fmt(v))}else{it.junk=!it.junk;sfx('ui');toast(it.junk?'Marked as junk':'No longer junk')}
  sel=null;drawSheet()}
$('sheetIn').addEventListener('pointerdown',e=>{const c=e.target.closest('[data-bag]');lpFired=false;clearTimeout(lpT);if(!c||c.disabled)return;const i=+c.dataset.bag;lpXY=[e.clientX,e.clientY];lpT=setTimeout(()=>longPress(i),480)});
$('sheetIn').addEventListener('pointermove',e=>{if(lpXY&&Math.hypot(e.clientX-lpXY[0],e.clientY-lpXY[1])>10)clearTimeout(lpT)});
for(const n of['pointerup','pointercancel','pointerleave'])$('sheetIn').addEventListener(n,()=>clearTimeout(lpT));
function stashView(){return (window.innerWidth||800)<=720?(STASHV.side==='pack'?'pack':'box'):'both'}
function stashToPack(i){const it=ACC&&ACC.stash&&ACC.stash[i];if(!it)return false;if(!bagCan(it)){toast('Your pack is full');return false}ACC.stash.splice(i,1);G.bag.push(it);sel=null;sfx('equip');accSave();save(true);return true}
function packToStash(i){const it=G.bag&&G.bag[i];if(!it)return false;if(typeof tradeLocked==='function'&&tradeLocked(it))return false;if(it.test){toast('Test gear does not go in the lockbox');return false}if(!gridCan(ACC.stash,it,6,6)){toast('The lockbox is full');return false}G.bag.splice(i,1);it.junk=false;ACC.stash.push(it);sel=null;sfx('equip');accSave();save(true);return true}
function stashGearHTML(){
  const side=stashView();
  return `<div class="row stashToggle"><button type="button" class="${side!=='pack'?'big':'ghost'}" data-sside="box">Lockbox</button><button type="button" class="${side==='pack'?'big':'ghost'}" data-sside="pack">Pack</button></div><div class="stashBody" data-side="${side}"><div class="stashPane" data-spanel="box"><h3>Gear ${gridCells(ACC.stash)}/36</h3><div class="grid" id="stashGrid">${gridPack(ACC.stash,6,6,'st')}</div></div><div class="stashPane" data-spanel="pack"><h3>Pack ${gridCells(G.bag)}/${bagMeta().n}</h3><div class="grid${bagMeta().c===5?' g5':''}" id="stashPack">${gridPack(G.bag,bagMeta().c,bagMeta().r,'sb')}</div></div></div>`;
}
function stashMoveHTML(){
  const mv=sel&&sel.sb!=null?'Move to lockbox':sel&&sel.st!=null?'Move to pack':'Move across';
  const on=sel&&(sel.st!=null||sel.sb!=null);
  return `<div class="row stashFoot"><button type="button" class="big" data-smove="1" ${on?'':'disabled'}>${mv}</button></div>`;
}
$('sheetIn').addEventListener('dragstart',e=>{if(e.target.closest&&e.target.closest('[data-vbag]')){e.preventDefault();return}const box=e.target.closest&&e.target.closest('[data-st],[data-sb]');if(box&&e.dataTransfer&&!uiTouch()){const kind=box.dataset.st!==undefined?'st':'sb';const i=kind==='st'?+box.dataset.st:+box.dataset.sb;e.dataTransfer.setData('text/plain','box:'+kind+':'+i);e.dataTransfer.effectAllowed='move';return}const c=e.target.closest&&e.target.closest('[data-bag]');if(!c||!e.dataTransfer)return;const it=G.bag[+c.dataset.bag];if(!it||!(it.charm||it.stim)){e.preventDefault();return}e.dataTransfer.setData('text/plain',String(+c.dataset.bag));e.dataTransfer.effectAllowed='move'});
$('sheetIn').addEventListener('dragover',e=>{if(e.target.closest&&(e.target.closest('[data-csocket]')||e.target.closest('[data-bpocket]')||e.target.closest('.stashPane'))){e.preventDefault();if(e.dataTransfer)e.dataTransfer.dropEffect='move'}});
$('sheetIn').addEventListener('drop',e=>{const raw=e.dataTransfer&&e.dataTransfer.getData('text/plain')||'';if(raw.indexOf('box:')===0){const pane=e.target.closest&&e.target.closest('.stashPane');if(!pane)return;e.preventDefault();const p=raw.split(':'),kind=p[1],i=+p[2],onto=pane.dataset.spanel;stashDragged=true;if(kind==='sb'&&onto==='box')packToStash(i);else if(kind==='st'&&onto==='pack')stashToPack(i);if(mode==='sheet')drawSheet();return}const pocket=e.target.closest&&e.target.closest('[data-bpocket]');const slot=e.target.closest&&e.target.closest('[data-csocket]');if(!pocket&&!slot)return;e.preventDefault();const i=+(e.dataTransfer&&e.dataTransfer.getData('text/plain'));if(!(i>=0)||!G.bag[i])return;const dragged=G.bag[i];if(dragged.stim){if(stimToBelt(i)){toast('On the belt');sel=null}drawSheet();return}if(!slot||!dragged.charm)return;if(charmSocket(i)){toast('On the belt');sel=null}drawSheet()});
const sheetClick=ev=>{if(vendLockFired){vendLockFired=false;return}const b=ev.target.closest('button,[data-track],[data-web],[data-webadd]');if(!b||b.disabled)return;const d=b.dataset;sfx('ui');if(d.arc&&typeof arcClick==='function'){arcClick(d.arc);return}
  if(d.try){if(!devOn())return;tryGear(d.try);toast('Test gear. It will not be saved.');drawSheet();return}
  if(d.isk!==undefined){sel={isk:+d.isk};drawSheet();return}
  if(d.iskkey!==undefined){const k=+d.iskkey,i=sel&&sel.isk;if(i>=100&&itemSkillOn(i)){const o=G.slots.indexOf(i);if(o>=0)G.slots[o]=-1;G.slots[k]=i;setSkillButtons()}drawSheet();return}
  if(d.iskside){const i=sel&&sel.isk;if(i>=100)assignMouse(d.iskside,i);drawSheet();return}
  if(d.popx)sel=null;
  if(d.sellq!==undefined){const q=+d.sellq;let t=0,held=false;G.bag=G.bag.filter(i=>{if(typeof tradeHeld==='function'&&tradeHeld(i)){held=true;return true}if(i&&i.lock)return true;if(i&&(i.stim||vendQuest(i)))return true;if(i&&(q===9?i.junk:(q<0||i.q===q))){t+=sellValue(i);return false}return true});G.credits+=t;sel=null;sfx('coin');toast((held?'What is on the table stays. ':'')+'Sold for '+fmt(t))}
  if(d.close)return closeSheet();
  if(d.loadcode){const v=$('codeIn').value;if(!loadCode(v)){const p=document.createElement('p');p.className='red';p.textContent='That code could not be read. Check that all of it was pasted.';$('sheetIn').appendChild(p)}return}
  if(d.tab){if(d.tab==='web')webVB=null;tab=d.tab;sel=null}
  if(d.eq)sel={eq:d.eq};if(d.vrepair){const n=repairOne(G.eq&&G.eq[d.vrepair]);if(n){sfx('coin');toast('Repaired for '+n+' sat'+(n===1?'':'s'))}}if(d.repair){let it=null;if(d.repair==='one'){if(sel&&sel.eq)it=G.eq[sel.eq];else if(sel&&sel.vbag!==undefined)it=G.bag[sel.vbag];else if(sel&&sel.bag!==undefined)it=G.bag[sel.bag]}const n=d.repair==='all'?repairAll():repairOne(it);if(n){sfx('coin');toast('Repaired for '+n+' sat'+(n===1?'':'s'))}}if(d.corpse)buyCorpse(+d.corpse)
  if(d.cs!==undefined)sel={cs:+d.cs};
  if(d.bpocket!==undefined||d.csocket!==undefined){const bi=sel&&sel.bag,bit=bi!==undefined&&G.bag[bi];if(bit&&bit.stim){if(stimToBelt(bi)){toast('On the belt');sel=null}}else if(d.csocket!==undefined&&bit&&bit.charm){if(charmSocket(bi)){toast('On the belt');sel=null}}else if(d.bpocket!==undefined)toast(STIM.pick);else toast('Choose a charm in the pack.')}
  if(d.packempty!==undefined&&sel&&sel.cs!==undefined){if(charmTakeOff(sel.cs))sel=null}
  if(d.csdo){const i=sel.cs,it=(G.cslots||[])[i];if(it){if(d.csdo==='off'){if(charmTakeOff(i))sel=null}else if(d.csdo==='scrap'){if(craft(it,'scrap'))sel=null}else if(typeof tradeLocked==='function'&&tradeLocked(it)){}else{G.cslots.splice(i,1);sel=null;if(d.csdo==='sell'){if(it.test)toast('Test gear has no price');else{G.credits+=sellValue(it);sfx('coin')}}else W.drops.push({x:P.x+1.1,y:P.y+1.1,it,t:1});calc()}}}
  if(d.bag!==undefined){const i=+d.bag;if(lpFired){lpFired=false;return}
    if(tapT&&tapI===i){clearTimeout(tapT);tapT=null;const wasStim=!!(G.bag[i]&&G.bag[i].stim);if(equipFromBag(i))toast(wasStim?'On the belt':'Equipped');sel=null}
    else{clearTimeout(tapT);tapI=i;tapT=setTimeout(()=>{tapT=null;sel={bag:i};drawSheet()},260);return}}
  if(d.best){bestAsk();return}if(d.bestok){const n=equipBest();toast(n?'Equipped '+n+' upgrade'+(n>1?'s':''):'Nothing better in your pack')}
  if(d.markjunk){let n=0;G.bag.forEach(it=>{const x=itemDelta(it);if(x!==null&&x<-.01&&!it.junk){it.junk=true;n++}});toast(n+' item'+(n===1?'':'s')+' marked as junk')}
  if(d.dropjunk){let held=false;G.bag=G.bag.filter(it=>{if(typeof tradeHeld==='function'&&tradeHeld(it)){held=true;return true}if(it.junk){W.drops.push({x:P.x+rnd(-1.2,1.2),y:P.y+rnd(-1.2,1.2),it,t:1});return false}return true});if(held)toast('What is on the table stays.');sel=null}
  if(d.do){const it=sel.eq?G.eq[sel.eq]:G.bag[sel.bag];
    if(d.do==='equip'){const wasStim=!!(G.bag[sel.bag]&&G.bag[sel.bag].stim);if(equipFromBag(sel.bag)&&wasStim)toast('On the belt');sel=null}
    if(d.do==='junk'){it.junk=!it.junk;sel=null}
    if(d.do==='lock'){it.lock=it.lock?0:1;toast(it.lock?'Locked':'Unlocked')}
    if(d.do==='scrap'||d.do==='reroll'||d.do==='addsoc'){if(craft(it,d.do))sel=null;drawSheet();return}
    if(d.do==='sock'){sel.sock=true;drawSheet();return}
    if(d.do==='mgive'){if(typeof tradeLocked==='function'&&tradeLocked(it))return;const old=G.merc[it.slot];G.merc[it.slot]=it;it.junk=false;G.bag.splice(sel.bag,1);if(old)G.bag.push(old);sel=null;sfx('equip');toast(G.merc.name+' takes the '+it.base)}
    if(d.do==='unequip'){if(!bagCan(it))toast('Your pack is full');else{const sl=sel.eq;G.bag.push(it);G.eq[sl]=null;if(sl==='belt')charmRefit();sel=null;sfx('equip')}}
    if(d.do==='sell'){if(it.stim){toast(STIM.keep);return}if(it.lock){toast('That piece is locked');return}if(vendQuest(it)){toast('A quest piece stays');return}if(it.test){toast('Test gear has no price');return}if(typeof tradeLocked==='function'&&tradeLocked(it))return;G.credits+=sellValue(it);G.bag.splice(sel.bag,1);sel=null;sfx('coin')}
    if(d.do==='drop'){if(typeof tradeLocked==='function'&&tradeLocked(it))return;G.bag.splice(sel.bag,1);W.drops.push({x:P.x+1.1,y:P.y+1.1,it,t:1});sel=null}
    calc()}
  if(d.word){const it=sel.eq?G.eq[sel.eq]:G.bag[sel.bag];socketWord(it,d.word);sel.sock=it.words.length<it.soc&&!it.pw}
  if(d.at){G.at[d.at]++;G.ap--}
  if(d.mtake){const mit=G.merc[d.mtake];if(!bagCan(mit))toast('Your pack is full');else{G.bag.push(mit);G.merc[d.mtake]=null;sel=null;sfx('equip')}}
  if(d.msel){sel=G.merc&&G.merc[d.msel]?{m:d.msel}:null}
  if(d.mbest){const n=mercBest();toast(n?G.merc.name+' takes '+n+' piece'+(n>1?'s':''):'Nothing spare is better for them. Pieces that would improve you are left alone.');sfx(n?'equip':'ui')}
  if(d.claim!==undefined){const b=G.bounties[+d.claim];if(b&&b.c>=b.n){const m=repRank('anon')>=1?1.25:1;b.sats=Math.ceil(b.sats*m);b.cr*=m;addRep('anon',6);if(repRank('anon')>=3){const w=pick(WK);gotWord(w);toast('A note is pinned to the payment: '+w)}G.sats+=b.sats;/* The board and the paid line print whole credits, so the purse gains that floor. */const pay=Math.floor(b.cr*G.cpi);G.credits+=pay;G.bounties.splice(+d.claim,1);sfx('quest');toast('Paid: '+b.sats+' sats and '+fmt(pay))}}
  if(d.cmpk)CMP_KEY=d.cmpk;
  if(d.sside){STASHV.side=d.sside==='pack'?'pack':'box'}
  if(d.mside){const parts=String(d.mside).split(':');if(parts[0]&&parts[1])MENUV[parts[0]]=parts.slice(1).join(':')}
  if(d.smove!==undefined){if(sel&&sel.st!=null)stashToPack(+sel.st);else if(sel&&sel.sb!=null)packToStash(+sel.sb)}
  if(d.stmv!==undefined)stashToPack(+d.stmv);
  if(d.sbmv!==undefined)packToStash(+d.sbmv);
  if(d.st!==undefined){if(stashDragged){stashDragged=false;return}const it=ACC.stash[+d.st];if(it){if(ev.shiftKey||uiTouch())sel={st:+d.st};else stashToPack(+d.st)}}
  if(d.sb!==undefined){if(stashDragged){stashDragged=false;return}const it=G.bag[+d.sb];if(it){if(ev.shiftKey||uiTouch())sel={sb:+d.sb};else packToStash(+d.sb)}}
  if(d.acc){const k=d.acc;if(k[0]==='s'){if(k==='si10'||k==='siall'){const n=k==='si10'?10:satsFree();if(n>0&&spendSats(n))ACC.sats+=n}else{const n=k==='so10'?Math.min(10,ACC.sats|0):(ACC.sats|0);if(n>0){G.sats=(G.sats|0)+n;ACC.sats-=n}}}else if(k==='coall'){/* The box line prints whole credits, so take-all pays that floor. */const pay=Math.floor(ACC.cr*G.cpi);G.credits+=pay;ACC.cr=0}else{/* Half and all move whole credits. The fee is still a tenth of that. */const a=k==='cihalf'?Math.floor(G.credits/2):Math.floor(G.credits);if(a>0){G.credits-=a;ACC.cr+=a/G.cpi*.9}}sfx('coin');accSave();save(true)}
  if(d.bull){closeSheet();bullStart();return}
  if(d.shiftp){sel={shp:d.shiftp};drawSheet();return}
  if(d.shift){const[k,r]=d.shift.split('|');shapeShift(k,r==='0'?false:r==='1'?true:r==='?'?pick(BUILDS[k]).k:r);return}
  if((d.hire||d.revive)&&G.tag){toast('Kestrel will not hire to you while '+G.tag.name+' is rendered');sfx('err');return}
  if(d.hire){const c=payTag(hireCost());if(G.credits<c){toast('Not enough credits');sfx('err')}else{G.credits-=c;const old=G.merc;G.merc={k:d.hire,name:(d.hire==='reyn'&&G.st&&G.st.reynUnemp)?ARC.unemployed:pick(MNAMES),hp:0,dead:false,weapon:old?old.weapon:null,armor:old?old.armor:null,helm:old?old.helm||null:null};if(d.hire==='reyn'&&G.st)G.st.reynMet=1;spawnMerc();sfx('quest');toast(G.merc.name+' the '+MERCS[d.hire].n+' joins you');if(d.hire==='reyn')toast(ARC.hireJoin)}}
  if(d.revive){const c=payTag(reviveCost());if(G.credits<c){toast('Not enough credits');sfx('err')}else{G.credits-=c;G.merc.dead=false;G.merc.hp=0;spawnMerc();sfx('mend');toast(G.merc.name+' is back on their feet')}}
  if(d.sat!==undefined)sel={sat:+d.sat};
  if(d.mkv){mktView=d.mkv}
  if(d.mkq){mktQty=+d.mkq}
  if(d.mkt){const k=d.mkt;
    if(k==='b'||k==='s'){const n=Math.max(1,mktQty),q=mktTrade(n,k==='b'?'buy':'sell');
      if(q)toast(k==='b'?'Bought '+n+' sats for '+fmt(q.total):'Sold '+n+' sats for '+fmt(q.total));else{toast(k==='b'?'Not enough credits':'Not that many sats');sfx('err')}}
    else if(k==='ball'){const n=mktAfford();if(n<1){toast('Not enough credits');sfx('err')}else{const q=mktTrade(n,'buy');if(q)toast('Bought '+n+' sats for '+fmt(q.total))}}
    else if(k==='sall'){const n=satsFree();if(n<1){toast(tradeReserved()?'Those sats are on the table.':'No sats');sfx('err')}else{const q=mktTrade(n,'sell');if(q)toast('Sold '+n+' sats for '+fmt(q.total)+(q.k>.12?' — and the last of them for rather less than the first':''))}}}
  if(d.mko){const n=Math.max(1,mktQty),off=+d.mko.slice(1)/100,buy=d.mko[0]==='b',px=mktMid()*(buy?1-off:1+off);
    if(!mktPost(n,px,buy?'buy':'sell')){toast(buy?'Not enough credits to hold that bid':'Not that many sats to post');sfx('err')}}
  if(d.mkx!==undefined)mktCancel(+d.mkx);
  if(mpClick(d))return;
  if(d.mkr)if(!mktRepay()){toast('Not enough credits to repay him');sfx('err')}
  /* The pledge is the one printed on the sheet, and it never goes under ten sats. */
  if(d.mkb){const n=Math.max(10,Math.min(G.sats,mktQty));if(!mktBorrow(n)){toast(G.mkt.pos?'He will only hold one position':'Not enough sats');sfx('err')}}
  if(d.node!==undefined)sel={sk:+d.node};
  if(d.learn!==undefined){const i=+d.learn;G.sp-=skCost(i);G.sk[i]++;if(G.sk[i]===10)toast(CLS[G.cls].sk[i].n+' is mastered: two extra ranks’ worth of power'+(CLS[G.cls].sk[i].a?' and 20% faster recovery':'')+'.');if(CLS[G.cls].sk[i].a&&!G.slots.includes(i)){const e=G.slots.indexOf(-1);if(e>=0)G.slots[e]=i}if(!CLS[G.cls].sk[i].a&&G.pas&&!G.pas.includes(i)&&G.pas.length<PCAP())G.pas.push(i);calc();sfx('learn');if(G.cls==='hacker'&&i===11&&G.sk[11]===1&&!G.schema)schemaAsk()}
  if(d.assign!==undefined){const k=+d.assign,i=sel.sk,o=G.slots.indexOf(i);if(o>=0)G.slots[o]=G.slots[k];G.slots[k]=i}
  if(d.pas!==undefined){const i=+d.pas,k=G.pas.indexOf(i);if(k>=0)G.pas.splice(k,1);else if(G.pas.length<PCAP())G.pas.push(i);calc();G.hp=Math.min(G.hp,S.maxHp)}
  if(d.fork){G.fork=G.fork||{};const i=sel.sk;if(G.fork[i]===d.fork)delete G.fork[i];else G.fork[i]=d.fork}
  if(d.webzoom||d.webfit||d.webarm!==undefined){
    if(d.webarm!==undefined)webArm=d.webarm==='all'?-1:+d.webarm;
    if(d.webfit)webFit();
    if(d.webzoom){const svg=$('webStage')&&$('webStage').querySelector('svg');if(svg){const r=svg.getBoundingClientRect(),p=webClientToWorld(svg,r.left+r.width/2,r.top+r.height/2);if(p)webZoomAt(d.webzoom==='in'?1.22:1/1.22,p.x,p.y)}}}
  if(d.web){
    if(webPanMoved)webPanMoved=0;
    else{const id=d.web;
      if(ev.shiftKey){toast(G.web[id]?'A single node does not come back. Refund all, in the bar, takes every point back for 5 sats.':uiSay('Shift-click does not place a point. Click a lit node.','A long press does not place a point. Tap a lit node.'));sel={web:id}}
      else if(id!=='c'&&!G.web[id]&&webCan(id)){G.web[id]=1;sel={web:id};calc();sfx('learn')}
      else{sel={web:id};if(id!=='c'&&!G.web[id])toast(webPts()>0?'Not connected yet. Follow a lit node out from the centre.':'No points left to place.')}}}
  /* the + over an arm's first node: spend straight away on the far end of that arm */
  if(d.webadd!==undefined){const nx=webNext(+d.webadd);
    if(nx&&webPts()>0){G.web[nx]=1;sel={web:nx};calc();sfx('learn')}}
  if(d.weball){G.web[sel.web]=1;calc();sfx('learn')}
  if(d.webreset){if(spendSats(5,'A refund costs 5 sats')){G.web={};sel=null;calc();sfx('ui')}}
  if(d.sub){closeSheet();subStart(+d.sub);return}
  if(d.hc){G.hc=!G.hc;calc()}
  if(d.mab){G.merc[d.mab[0]==='g'||d.mab[0]==='f'?'ab1':'ab2']={g:'guard',f:'fury',m:'medic',c:'coll'}[d.mab[0]];calc();spawnMerc()}
  if(d.gact){gateAct=+d.gact}
  if(d.doc){if(!W.z.town)toast('Doctrines can only be changed in town');else if(G.doc===d.doc){}else if(!G.doc||spendSats(3,'Changing doctrine costs 3 sats')){G.doc=d.doc;calc();G.hp=Math.min(G.hp,S.maxHp);sfx('learn')}}
  if(d.track){G.track=d.track;sfx('ui')}
  if(d.diff!==undefined){const i=+d.diff;if(!diffUnlocked(i)){toast(i>=2?'Brutal opens after you clear Act V on Hard.':'Hard opens after you clear Act V on Normal.');sfx('err')}else{G.diff=i;sfx('ui');toast(pick(DIFFSET))}}
  if(d.opt==='fx'){const o=['full','normal','thin'];const i=o.indexOf(OPT.fx);OPT.fx=o[(i<0?1:i+1)%3]}
  else if(d.opt==='aim'){const o=['auto','drag','quick'];const i=o.indexOf(OPT.aim);OPT.aim=o[(i<0?0:i+1)%3]}
  else if(d.opt==='ui'){const o=['auto','touch','mouse'];const i=o.indexOf(OPT.ui||'auto');OPT.ui=o[(i<0?0:i+1)%3];uiApply(true)}
  else if(d.opt==='labels'){LOOT.always=LOOT.always?0:1;OPT.labels=!!LOOT.always;lootSave()}
  else if(d.opt){OPT[d.opt]=!OPT[d.opt];if(d.opt==='music'&&MUG)MUG.gain.value=OPT.music?.55:0}
  if(d.loot==='junk'){LOOT.hideJunk=LOOT.hideJunk?0:1;lootSave()}
  if(d.lootq!==undefined){LOOT.minQ=Math.max(0,Math.min(3,+d.lootq||0));lootSave()}
  if(d.alootq!==undefined){OPT.lootQ=Math.max(0,Math.min(3,+d.alootq||0))}
  if(d.save){toast(save(true)?(CL?'Saved to your account':'Saved in this browser'):'This browser would not store the save. Use a save code instead.')}
  if(d.code){const o=saveObj();o.zs={};o.cur=null;copyText(btoa(unescape(encodeURIComponent(JSON.stringify(o)))),$('codeOut'));return}
  if(d.delslot!==undefined){const n=+d.delslot;$('sheet').hidden=true;mode='play';askWipe(n,()=>{if(G.tag&&G.tag.slot===n)tagDismiss(1);openSheet('opts',{})});return}
  if(d.swslot!==undefined){const n=+d.swslot,i=slotInfo(n);if(!i)return;save(true);const fin=sv=>{if(applySave(sv)){SLOT=n;clDirty={};W=null;$('sheet').hidden=true;$('pop').hidden=true;startPlay()}else{toast('That save could not be loaded');drawSheet()}};if(i.cloud){b.disabled=true;cloudLoad(i.cloud,n).then(fin)}else fin(i.loc);return}
  if(d.newslot!==undefined){save(true);$('sheet').hidden=true;$('pop').hidden=true;$('hud').hidden=true;$('title').hidden=false;mode='title';music('scene');W=null;SLOT=+d.newslot;showContinue();const nh=$('newH');nh&&nh.scrollIntoView&&nh.scrollIntoView({block:'start'});return}
  if(d.walk){const fromTitle=sheetCtx.from==='title';closeSheet();walkChoose(!!fromTitle);return}if(d.title){save(true);$('sheet').hidden=true;$('hud').hidden=true;$('title').hidden=false;mode='title';music('scene');showContinue();W=null;return}
  if(d.dev&&devOn()){const k=d.dev;if(k==='lvl')gainXp(xpNext(G.lvl)-G.xp);if(k==='cr')G.credits+=5000*G.cpi*G.lvl;if(k==='zones')G.unlocked=5;if(k==='god')G.god=!G.god;if(k==='reset'){resetZones();toast('Every district is restocked')}
    if(k==='loot'){for(let q=1;q<=4;q++)for(let i=0;i<2;i++)W.drops.push({x:P.x+rnd(-2,2),y:P.y+rnd(-2,2),it:makeItem(G.lvl+1,q),t:1});toast('Loot scattered at your feet')}}
  if(d.vtab){VEND.tab=d.vtab;sel=null;drawSheet();return}
  if(d.vside){VEND.side=d.vside;drawSheet();return}
  if(d.vstim){if(vendBuyStim()==='dlg')return}
  if(d.vpie){if(eggBuyPie()==='dlg')return}
  if(d.egg){eggClick(d.egg);return}
  if(d.scsay){const el=$('scSay');scLine(el?el.value:'');return}
  if(d.vid){if(vendIdentify()==='dlg')return}
  if(d.vbox){if(vendBox(d.vbox)==='dlg')return}
  if(d.vbuy!==undefined){if(vendBuy(+d.vbuy)==='dlg')return}
  if(d.vsell!==undefined){vendSell(+d.vsell);sel=null}
  if(d.vbb!==undefined){if(vendBuyback(+d.vbb)==='dlg')return}
  if(d.vend!==undefined)sel={vend:+d.vend};
  if(d.vsellall){vendSellOpen('all');return}
  if(d.vselljunk){vendSellOpen('junk');return}
  if(d.vlock!==undefined)vendFlipLock(+d.vlock);
  if(d.vbag!==undefined){if(vendDragged||vendLockFired){vendDragged=false;vendLockFired=false;return}sel={vbag:+d.vbag}}
  if(d.vback!==undefined)sel={vback:+d.vback};
  if(d.go){if(mpPortalBlocked())return;if(actBriefHold(+d.go)){actBriefDeny();return}closeSheet();enter(+d.go);return}
  if(d.tier){G.tier=clamp(G.tier+ +d.tier,0,G.maxTier);resetZones()}
  drawSheet()};
$('sheet').addEventListener('click',ev=>{if(webPanMoved){webPanMoved=0;if(ev.target.closest&&ev.target.closest('#webStage'))return}sheetClick(ev)});

$('sheet').addEventListener('contextmenu',e=>{
  const bag=e.target.closest&&e.target.closest('[data-bag]');
  if(bag){e.preventDefault();if(uiTouch())return;vendLockFired=true;vendFlipLock(+bag.dataset.bag);if(mode==='sheet')drawSheet();return}
  const el=e.target.closest&&e.target.closest('[data-vend],[data-vbag],[data-vstim],[data-vbox],[data-vback]');
  if(!el)return;
  e.preventDefault();
  if(uiTouch())return;
  if(el.dataset.vend!==undefined){vendBuy(+el.dataset.vend);return}
  if(el.dataset.vbag!==undefined){vendLockFired=true;vendFlipLock(+el.dataset.vbag);if(mode==='sheet')drawSheet();return}
  if(el.dataset.vstim!==undefined){vendBuyStim();return}
  if(el.dataset.vbox!==undefined){vendBox(el.dataset.vbox);return}
  if(el.dataset.vback!==undefined){vendBuyback(+el.dataset.vback);return}
});
let vendPtr=null,vendHold=null,vendLockFired=false;
$('sheetIn').addEventListener('pointerdown',e=>{
  const c=e.target.closest&&e.target.closest('[data-vbag]');
  if(!c||c.disabled)return;
  const i=+c.dataset.vbag;
  if(vendHold&&vendHold.t)clearTimeout(vendHold.t);
  vendHold={i:i,x:e.clientX,y:e.clientY,id:e.pointerId,fired:false,t:setTimeout(()=>{if(!vendHold||vendHold.i!==i)return;vendHold.fired=true;vendLockFired=true;vendFlipLock(i);if(mode==='sheet')drawSheet()},480)};
  if(uiTouch()||!vendBuys())return;
  vendPtr={i:i,x:e.clientX,y:e.clientY,id:e.pointerId,moved:false};
  try{c.setPointerCapture(e.pointerId)}catch(err){}
});
addEventListener('pointermove',e=>{
  if(vendHold&&e.pointerId===vendHold.id&&Math.hypot(e.clientX-vendHold.x,e.clientY-vendHold.y)>10){clearTimeout(vendHold.t);vendHold.t=null}
  if(!vendPtr||e.pointerId!==vendPtr.id)return;
  if(Math.hypot(e.clientX-vendPtr.x,e.clientY-vendPtr.y)>8)vendPtr.moved=true;
});
addEventListener('pointerup',e=>{
  if(vendHold&&e.pointerId===vendHold.id){clearTimeout(vendHold.t);if(vendHold.fired)vendLockFired=true;vendHold=null}
  if(!vendPtr||e.pointerId!==vendPtr.id)return;
  const p=vendPtr;vendPtr=null;
  if(!p.moved||vendLockFired)return;
  const stack=document.elementsFromPoint(e.clientX,e.clientY)||[];
  if(!stack.some(n=>n.closest&&n.closest('.vendSide')))return;
  vendDragged=true;
  if(vendSell(p.i)&&mode==='sheet')drawSheet();
});

$('pop').addEventListener('click',ev=>{if(ev.target.id==='pop'){sel=null;sfx('ui');drawSheet();return}sheetClick(ev)});
$('sheet').addEventListener('scroll',()=>{if(!$('pop').hidden)vendFootLift()},true);

function showDeath(){const town=ZONES[HT()]||{n:'town'};const onBody=!G.hc&&lastLaid;const gear=onBody?' What you were wearing is on your body, belt and charms included. The pack stayed with you.':'';const pvp=onBody&&DY.pvp?' Nobody else can pick it up, and nothing was cut from you as a trophy.':'';
  $('deathP').textContent='Slain by '+DY.by+' in '+ZONES[DY.zi].n+', with '+DTY[P.lastTy||'impact'].n+' damage.'+(G.hc?' This was a hardcore hero. They are gone, and a new wanderer will take the road.':gear+pvp);
  $('deathNote').textContent=G.hc?'There is no portal. This hero does not get back up.':'A portal in the square opens at the start of that district. Your body is marked. In town, Kestrel will have it walked in for a few sats.';
  $('bRise').textContent=G.hc?'Begin again':'Rise in '+town.n;
  $('deathS').innerHTML=`<div>Level<b>${G.lvl}</b></div><div>Machines scrapped<b>${G.kills}</b></div><div>Credits on the body<b>${G.hc?'none':fmt(DY.fee)}</b></div>`;$('death').hidden=false;eggPryceNote()}
function repairBarHTML(){const items=repairList();if(!items.length)return '';const n=items.reduce((s,it)=>s+repairQuote(it),0);return `<button class="li" data-repair="all" ${G.sats<n?'disabled':''}><div><b>Repair all</b><span>${items.length} piece${items.length>1?'s':''} on you or in the pack. A broken piece gives nothing.</span></div><span class="pr" style="color:#f7931a">${n} sat${n===1?'':'s'}</span></button>`}
$('bRise').onclick=()=>{if(!DY)return;if(G.hc){hcBegin();return}const d=DY;DY=null;$('death').hidden=true;G.hp=S.maxHp;G.en=S.maxEn;mode='play';G.portal={zi:d.zi,x:d.st.x,y:d.st.y};sfx('portal');enter(HT());toast('A portal back stands open in the square')};

let pickSide='R',pickHov=null;
let mouseKey='';
function paintMouseSlots(){
  if(!G||!CLS[G.cls])return;
  ensureMouse();
  const key=(G.mouse.L|0)+':'+(G.mouse.R|0)+':'+G.cls+':'+(uiTouch()?1:0)+':'+(G.hot||[]).join(',');
  const fresh=key!==mouseKey;if(fresh)mouseKey=key;
  const bound=()=>{const i=G.mouse.R;for(let f=0;f<8;f++)if(G.hot[f]===i)return 'F'+(f+1);return 'R'};
  const paint=(id,i,tag)=>{
    const b=$(id);if(!b)return;
    const sk=i>=100&&itemSkillsReady?ISK[i]:(i>=0?CLS[G.cls].sk[i]:null);
    if(fresh){
      const name=i<0?'ATK':(sk?sk.ab:'');
      const badge=tag==='R'&&!uiTouch()?bound():tag;
      b.querySelector('b').textContent=name;
      b.querySelector('i').textContent=badge;
      b.title=(i<0?'Attack':(sk?sk.n:''))+(uiTouch()?'':(' ('+(tag==='L'?'left click':(badge==='R'?'right click':'right click, '+badge))+')'));
      const c=b.querySelector('canvas'),g=c.getContext('2d');
      g.clearRect(0,0,28,28);
      if(i>=100&&sk){g.fillStyle='#d0aa62';g.font='9px Cinzel,serif';g.textAlign='center';g.fillText(sk.ab,14,17)}
      else if(i>=0)glyph(g,G.cls,i,28);
      else{g.strokeStyle='#e0bd6e';g.lineWidth=2;g.lineCap='round';g.beginPath();g.moveTo(8,21);g.lineTo(20,8);g.moveTo(8,14);g.lineTo(14,8);g.stroke()}}
    const em=b.querySelector('em');
    const sc=(i>=0&&P&&P.cd&&sk)?'scaleY('+clamp((P.cd[i]||0)/(sk.cd||1),0,1)+')':'scaleY(0)';
    if(em&&em._sc!==sc){em._sc=sc;em.style.transform=sc}};
  paint('mL',G.mouse.L|0,'L');
  paint('mR',G.mouse.R|0,'R')}
function paintPick(){
  const box=$('mPick');if(!box||box.hidden||!G)return;
  const sk=CLS[G.cls].sk,ids=[-1];
  for(let i=0;i<sk.length;i++){if(!learnedAct(i)||i<0)continue;if(pickSide==='L'&&!leftOk(i))continue;ids.push(i)}
  for(const id of [100,101,102,103,104,105]){if(!learnedAct(id))continue;if(pickSide==='L'&&!leftOk(id))continue;if(pickSide==='R'&&leftOk(id))continue;ids.push(id)}
  let html='<h3>'+(uiTouch()?(pickSide==='L'?'Attack':'Skill'):(pickSide==='L'?'Left click':'Right click'))+'</h3><div class="grid">';
  for(const i of ids){
    const on=(pickSide==='L'?G.mouse.L:G.mouse.R)===i;
    let key='';for(let f=0;f<8;f++)if(G.hot[f]===i)key='F'+(f+1);
    const name=i<0?'Attack':(i>=100?ISK[i].n:sk[i].n);
    html+='<button type="button" data-msk="'+i+'" class="'+(on?'on':'')+'" title="'+esc(name)+'">'+(i<0?'<b>ATK</b>':'')+'<u>'+key+'</u></button>'}
  html+='</div><p class="hint">'+uiSay('Click a skill for this button. Hover one and press F1–F8 to bind it. In a fight those keys, and the wheel, fill the right button.','Tap a skill for this button. Buttons 1, 2 and 3 are the ones under your thumb.')+'</p>';
  box.innerHTML=html;
  box.querySelectorAll('button[data-msk]').forEach(b=>{
    const i=+b.dataset.msk;if(!(i>=0))return;
    const c=document.createElement('canvas');c.width=28;c.height=28;b.insertBefore(c,b.firstChild);
    if(i>=100){const g=c.getContext('2d');g.fillStyle='#d0aa62';g.font='10px Cinzel,serif';g.textAlign='center';g.fillText(ISK[i].ab,14,18)}
    else glyph(c.getContext('2d'),G.cls,i,28)})}
function openPick(side){
  ensureMouse();
  const box=$('mPick');if(!box)return;
  if(!box.hidden&&pickSide===side){box.hidden=true;return}
  pickSide=side;pickHov=null;box.hidden=false;paintPick()}
function assignMouse(side,i){
  ensureMouse();
  if(i!==-1&&!learnedAct(i))return;
  if(side==='L'&&!leftOk(i)){toast('That skill belongs on the right button');sfx('err');return}
  G.mouse[side]=i;paintMouseSlots();paintPick()}
function uiEats(t){
  if(!t||!t.closest)return false;
  if(t.closest('#mPick,#sheet,#pop,#dlg,#scene,#death,#title,#disc,#pad,#bbs,#obj,#bAct,#bSwap,#top,#cmpTip,#lootCard,#lootLabs,#bNames'))return true;
  if(t.id==='cv'||t.id==='stickzone'||t.id==='stick'||t.id==='app'||t.id==='hud')return false;
  if(t.closest('button,input,textarea,a,label'))return true;
  return false}
function worldAt(clientX,clientY){
  const r=cv.getBoundingClientRect();
  const vx=(clientX-r.left)/ZM,vy=(clientY-r.top)/ZM;
  const A=(vx+cx-VW/2)/32,B=(vy+cy-VH*.44)/16;
  return {x:(A+B)/2,y:(B-A)/2,vx,vy}}
function screenAt(x,y){const r=cv.getBoundingClientRect();return {x:SX(x,y)*ZM+r.left,y:SY(x,y)*ZM+r.top}}
function worldPointer(e){
  if(e.pointerType&&e.pointerType!=='mouse')return null;
  if(uiEats(e.target))return null;
  if(!W||!P||mode!=='play')return null;
  return worldAt(e.clientX,e.clientY)}
function syncHover(e){
  if(e&&e.clientX!=null){lastPtr={x:e.clientX,y:e.clientY};cmpXY={x:e.clientX,y:e.clientY}}
  if(typeof AIMING!=='undefined'&&AIMING&&AIMING.pt==='key')aimTrack(e.clientX,e.clientY);
  const w=worldPointer(e);
  if(!w){if(mode!=='play'){HOVER=null;const app=$('app');if(app)app.style.cursor='';if(cmpSrc==='ground')cmpHide()}return}
  HOVER=pickScreen(w.vx,w.vy);
  const ld=lootAt(w.vx,w.vy);if(ld)HOVER={kind:'item',o:ld,name:lootName(ld),hp:null,max:null,x:ld.x,y:ld.y,fn:()=>{ld.force=1},r:.95};
  const app=$('app'),k=HOVER&&HOVER.kind;
  if(app)app.style.cursor=k==='foe'?'crosshair':(k==='npc'||k==='use')?'pointer':k==='item'?'grab':'default';
  if(MBTN.l)setMouseOrder('left',w.x,w.y,!!(e.shiftKey||keys.ShiftLeft||keys.ShiftRight),HOVER,true);
  else if(MBTN.r)setMouseOrder('right',w.x,w.y,!!(e.shiftKey||keys.ShiftLeft||keys.ShiftRight),HOVER,true);cmpGround()}

/* ================= input ================= */
const sz=$('stickzone');let sid=null,so={x:0,y:0};
sz.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')return;lootShut();if(sid!==null)return;sid=e.pointerId;sz.setPointerCapture(sid);const r=$('app').getBoundingClientRect();so={x:e.clientX,y:e.clientY};const s=$('stick');s.hidden=false;s.style.left=e.clientX-r.left+'px';s.style.top=e.clientY-r.top+'px';$('knob').style.transform=''});
sz.addEventListener('pointermove',e=>{if(e.pointerId!==sid)return;let dx=e.clientX-so.x,dy=e.clientY-so.y;const l=Math.hypot(dx,dy),m=44;if(l>m){dx*=m/l;dy*=m/l}J.x=dx/m;J.y=dy/m;$('knob').style.transform=`translate(${dx}px,${dy}px)`});
const send=e=>{if(e.pointerId!==sid)return;sid=null;J.x=J.y=0;$('stick').hidden=true};sz.addEventListener('pointerup',send);sz.addEventListener('pointercancel',send);
const ba=$('bAtk');ba.addEventListener('pointerdown',e=>{atkHeld=true;ba.setPointerCapture(e.pointerId)});['pointerup','pointercancel'].forEach(n=>ba.addEventListener(n,()=>atkHeld=false));
sbtn.forEach((b,i)=>{
  b.addEventListener('pointerdown',e=>{if(e.button!=null&&e.button!==0){cast(i);return}if(aimPointerDown(e,i))return;cast(i)});
  b.addEventListener('pointermove',e=>{if(AIMING&&AIMING.slot===i&&AIMING.pt!=='key')aimTrack(e.clientX,e.clientY)});
  b.addEventListener('pointerup',e=>{if(AIMING&&AIMING.slot===i&&AIMING.pt!=='key')aimRelease(e.clientX,e.clientY)});
  b.addEventListener('pointercancel',e=>{if(AIMING&&AIMING.slot===i&&AIMING.pt!=='key')aimCancel()})});
const aimX=$('aimCancel');if(aimX){aimX.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation()});aimX.addEventListener('pointerup',e=>{e.preventDefault();e.stopPropagation();if(AIMING)aimCancel()})}
$('obj').addEventListener('click',()=>{OPT.objMin=!OPT.objMin;sfx('ui')});$('bPot').addEventListener('pointerdown',stim);$('bDodge').addEventListener('pointerdown',dodge);
$('bAct').addEventListener('click',()=>{if(mode==='play'&&actTarget){sfx('ui');actTarget.fn()}});
const bNames=$('bNames');
if(bNames){const hold=on=>{LOOT.hold=on?1:0;bNames.classList.toggle('on',!!on)};
  bNames.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();hold(1)});
  bNames.addEventListener('pointerup',()=>hold(0));
  bNames.addEventListener('pointercancel',()=>hold(0));
  bNames.addEventListener('pointerleave',()=>hold(0))}
const lootLabs=$('lootLabs');
if(lootLabs)lootLabs.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||!b._d)return;e.preventDefault();e.stopPropagation();if(uiTouch())lootOpen(b._d,b)});
const lootCard=$('lootCard');
if(lootCard)lootCard.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('button');if(!b)return;ev.preventDefault();ev.stopPropagation();sfx('ui');const d=LOOT.card;if(b.dataset.lpick){if(d)lootPickup(d);return}if(b.dataset.lcmp&&d)lootCompare(d)});
$('bSwap').addEventListener('click',()=>{if(!SWAP||mode!=='play')return;const i=G.bag.indexOf(SWAP.it);if(i>=0&&equipFromBag(i))toast('Equipped '+SWAP.it.name);SWAP=null});
$('bMenu').addEventListener('click',()=>openSheet('items',{}));$('bChars').addEventListener('click',()=>{sfx('ui');openSheet('opts',{})});
$('bMap').addEventListener('click',()=>{OPT.minimap=!OPT.minimap});
$('bBug').addEventListener('click',bugAsk);
$('bRecall').addEventListener('click',openPortal);
addEventListener('pointerdown',uiWatch,true);addEventListener('pointermove',uiWatch,true);addEventListener('touchstart',e=>{uiTouchAt=performance.now();noteInput('touch')},{capture:true,passive:true});addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});const cv0=$('cv');if(cv0)cv0.addEventListener('contextmenu',e=>e.preventDefault());addEventListener('resize',()=>uiApply(false));const portX=$('uiPortX');if(portX)portX.addEventListener('click',()=>{const b=$('uiPort');if(b){b.dataset.gone='1';b.hidden=true}});addEventListener('keydown',e=>{uiWatch(e);if(e.target&&e.target.tagName==='TEXTAREA')return;keys[e.code]=true;if(mode==='offsite'){if(e.code==='Space'||e.code.slice(0,5)==='Arrow')e.preventDefault();return}if(mode==='play'){if(e.code==='Digit1')keyCast(0,e);if(e.code==='Digit2')keyCast(1,e);if(e.code==='Digit3')keyCast(2,e);if(e.code==='KeyQ')stim();if(e.code==='ShiftLeft')dodge();if(e.code==='KeyE'){let best=null,bd=1.15;for(const d of (W&&W.drops)||[]){if(!(d.it||d.word||d.pot))continue;const dd=Math.hypot(d.x-P.x,d.y-P.y);if(dd<bd){bd=dd;best=d}}if(best)best.force=1;else if(actTarget)actTarget.fn()}if(e.code==='KeyT')openPortal();if(e.code==='Tab'){OPT.minimap=!OPT.minimap;e.preventDefault()}if(e.code==='KeyB'||e.code==='KeyI')openSheet('items',{});if(/^F[1-8]$/.test(e.code)){e.preventDefault();const n=+e.code.slice(1)-1;const pk=$('mPick');if(pk&&!pk.hidden&&pickHov!==null&&pickHov!==undefined)hotBind(n,pickHov);else keyHot(n,e)}if(e.code==='KeyC')openSheet('char',{});if(e.code==='KeyH'){e.preventDefault();const pk=$('mPick');if(pk)pk.hidden=true;playWalk('basics')}if(e.code==='Escape'){if(AIMING){aimCancel();e.preventDefault()}const pk=$('mPick');if(pk&&!pk.hidden){pk.hidden=true;e.preventDefault()}}if(e.code==='AltLeft'||e.code==='AltRight')e.preventDefault();if(e.code==='Space')e.preventDefault()}
  else if(mode==='scene'&&SC&&SC.back){if(e.code==='ArrowRight'){$('scNext').click();e.preventDefault()}else if(e.code==='ArrowLeft'){$('scBack').click();e.preventDefault()}}else if(mode==='sheet'){if(tab==='web'&&webKey(e)){}else if(e.code==='Escape'||e.code==='KeyB')closeSheet()}});
addEventListener('keyup',e=>{keys[e.code]=false;keyAimUp(e.code)});
addEventListener('blur',()=>{for(const k in keys)keys[k]=false;atkHeld=false;MBTN.l=MBTN.r=0;if(MO&&MO.k!=='move')MO=null;aimCancel()});
document.addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('pointerdown',e=>{
  if(e.pointerType&&e.pointerType!=='mouse')return;
  if(e.button!==0&&e.button!==2)return;
  const w=worldPointer(e);if(!w)return;
  const pk=$('mPick');if(pk&&!pk.hidden)pk.hidden=true;
  e.preventDefault();
  const which=e.button===2?'right':'left';
  if(which==='left')MBTN.l=1;else MBTN.r=1;
  HOVER=pickScreen(w.vx,w.vy);
  const ld=lootAt(w.vx,w.vy);if(ld)HOVER={kind:'item',o:ld,name:lootName(ld),hp:null,max:null,x:ld.x,y:ld.y,fn:()=>{ld.force=1},r:.95};
  setMouseOrder(which,w.x,w.y,!!(e.shiftKey||keys.ShiftLeft||keys.ShiftRight),HOVER,true)},true);
addEventListener('pointermove',syncHover,true);
addEventListener('pointerup',e=>{if(e.pointerType&&e.pointerType!=='mouse')return;mouseUp(e.button===2?'right':'left')},true);
addEventListener('pointercancel',e=>{if(e.button===2)mouseUp('right');else mouseUp('left')});
addEventListener('wheel',e=>{if(mode!=='play')return;if(e.target&&e.target.closest&&e.target.closest('#sheet,#pop,#dlg,#title'))return;e.preventDefault();cycleRight(e.deltaY>0?1:-1)},{passive:false});
$('mL').addEventListener('click',e=>{e.stopPropagation();if(mode==='play')openPick('L')});
$('mR').addEventListener('click',e=>{e.stopPropagation();if(mode==='play')openPick('R')});
$('mPick').addEventListener('click',e=>{const b=e.target.closest('[data-msk]');if(!b)return;e.stopPropagation();assignMouse(pickSide,+b.dataset.msk)});
$('mPick').addEventListener('pointermove',e=>{const b=e.target.closest('[data-msk]');pickHov=b?+b.dataset.msk:pickHov});

document.addEventListener('visibilitychange',()=>{if(document.hidden&&G&&mode!=='title')save(true)});
addEventListener('pagehide',()=>{if(G&&mode!=='title')save(true)});

/* ================= boot ================= */
{const ln=$('lanNote');if(ln)ln.hidden=!window.__LAN}
function drawCls(){$('clsList').innerHTML=Object.entries(CLS).filter(([k,c])=>!c.locked||maxiOn()).map(([k,c])=>`<button class="cls" data-cls="${k}"><i style="background:${c.col}"></i><div><b>${c.n}</b><span>${c.tag}</span></div></button>`).join('')}
drawCls();
$('clsList').addEventListener('click',e=>{const b=e.target.closest('[data-cls]');if(!b)return;sfx('ui');const go=()=>{$('title').hidden=true;newGame(b.dataset.cls)};const cur=slotInfo(SLOT);if(!cur)return go();dlg('Replace slot '+(SLOT+1)+'?','A new wanderer begins at the very start: level 1, Act I, nothing carried over. It replaces the level '+cur.lvl+' '+CLS[cur.cls].n+' saved in this slot, who cannot be brought back. '+uiSay('To keep them, click an empty slot first.','To keep them, tap an empty slot first.'),[['Keep my hero',()=>{mode='title'}],['Start a new '+CLS[b.dataset.cls].n,go]],2)});
$('bWalk').onclick=$('bWalkLead').onclick=()=>{sfx('ui');walkChoose(true)};
if($('bTryGear')){if(!devOn())$('bTryGear').hidden=true;else $('bTryGear').onclick=()=>{sfx('ui');dlg('Test gear','Six uniques grant a skill only while you wear them. Once you are in the world, the hero sheet can put a test copy on you. A test copy is left out of every save, the lockbox, and a sale. The same names can also drop for real, and those save.',[['Good']])};}
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
  for(let n=0;n<NSLOT;n++){const i=slotInfo(n);h+=i&&CLS[i.cls]?`<button class="li${SLOT===n?' on':''}" data-slot="${n}"><i style="background:${CLS[i.cls].col}"></i><div><b>${i.dead?'Hardcore · fallen':'Continue · level '+i.lvl+' '+CLS[i.cls].n}</b><span>Slot ${n+1} · Act ${actRoman(i.act)}${i.dead?' · begins again':i.cloud?' · saved to your account':''}</span></div></button><button class="ghost" data-slotdel="${n}" style="margin:-4px 0 8px auto;display:block;font-size:10px;padding:5px 10px;min-height:0">Delete slot ${n+1}</button>`:`<button class="li${SLOT===n?' on':''}" data-slotnew="${n}"><div><b>Slot ${n+1} · empty</b><span>${SLOT===n?'Choose a class below to begin here':uiSay('Click to start a new wanderer here','Tap to start a new wanderer here')}</span></div></button>`}
  el.innerHTML=h;const cur=slotInfo(SLOT);$('newH').textContent=cur?'Replace the wanderer in slot '+(SLOT+1):'Begin a new wanderer in slot '+(SLOT+1)}
$('slots').addEventListener('click',async e=>{const b=e.target.closest('button');if(!b||b.disabled)return;sfx('ui');
  if(b.dataset.slotdel!==undefined){askWipe(+b.dataset.slotdel,()=>{mode='title';drawSlots()});return}
  if(b.dataset.slotnew!==undefined){SLOT=+b.dataset.slotnew;drawSlots();return}
  const n=+b.dataset.slot,i=slotInfo(n);if(!i)return;let sv;if(i.cloud){b.disabled=true;b.querySelector('b').textContent='Loading…';sv=await cloudLoad(i.cloud,n)}else sv=i.loc;if(applySave(sv)){SLOT=n;clDirty={};W=null;startPlay()}else drawSlots()});
function pickSlot(){let n=0;try{n=+localStorage.getItem(SAVEKEY+'_slot')||0}catch(e){}SLOT=n<NSLOT?n:0}
let last=0;
function frame(t){uiPad();const dt=Math.min(.05,(t-last)/1000||0);last=t;tNow=t/1000;
  if(mode==='offsite'){offsiteTick(dt);offsiteDraw();requestAnimationFrame(frame);return}
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
uiBoot();
showDisc();
cloudInit();
function devOn(){try{if(window.__DEBUG)return true;var h=location.hostname;if(h==='localhost'||h==='127.0.0.1'||h==='::1')return true;if(location.protocol==='file:'||location.protocol==='about:')return true}catch(e){}return false}
if(devOn())window.__g={migrateDiff,flushBank,diffUnlocked,heroAct,actRoman,heroDead,startPlay,slotInfo,drawSlots,get CLD(){return CLD},skipDisc,boonRefund,applySave,spawn,schemaAsk,setMode(m){mode=m},maxiCheck,maxiOn,drawCls,maxiAura,maxiBuff,drawSheet,webPts,webNext,DTY,RES,SKF,BUILDS,mktQuote,mktTrade,mktAfford,mktPost,mktCancel,mktTick,mktFair,mktMid,mktBid,mktAsk,mktSpread,mktDepth,mktNews,mktBorrow,mktRepay,mktInit,scenes(){const o={INTRO,RESCUE,ENDING1:endingSlides(),INTRO2,ENDING2,INTRO3,ENDING3,END_LEAVE,END_WAKE,RESERVE,STALE,FAIL};for(const k in SQ)SQ[k].steps.forEach((st,i)=>{if(st.scene)o['sq_'+k+i]=st.scene});return o},get G(){return G},get W(){return W},get P(){return P},get S(){return S},get mode(){return mode},ZONES,QUESTS,storyStep,actBriefHold,actBriefMigrate,quest,actOf,townOf,finalChoice,PREZ,tagRender,tagMenu,tagDismiss,SQ,sqOpen,recOk,ltEnd,BUILDS,get ACC(){return ACC},bullStart,legTake,mkFixed,UNI,sl,hit,setDT(v){DT=v},RES,fateOf,campStart,sway,setShill(v){shillT=v},update,attack,stim,stimPackItem,giveStim,stimToBelt,CLS,ET,ZONES,subStart,powStart,mkCharm,dodge,talkFloat,simChoice,craft,get SB(){return SB},repop,usePortal,closeSheet,dmgEnemy,kill,evStart,socketWord,addAdopt,get EV(){return EV},SQ,sqUse,useObj,shapeShift,bounties,SKF,tanks,get satShop(){return satShop},set satShop(v){satShop=v},get shop(){return shop},set shop(v){shop=v},itemDelta,equipBest,get SWAP(){return SWAP},hurt,hurtAlly,sfx,music,get AC(){return AC},get MU(){return MU},enter,cast,newGame,keys,openSheet,makeItem,calc,gainXp,save,openPortal,talkTo,playScene,ENDING,endingSlides,goalPt,INTRO2,ENDING2,ZS:()=>ZS,get OPT(){return OPT},mouseClick,hotBind,hotUse,cycleRight,assignMouse,openPick,pathFind,pickAt,pickScreen,get MO(){return MO},get HOVER(){return HOVER},ensureMouse,LEFTSK,learnedAct,leftOk,fxPatch,fxTrail,fxMark,fxOrbit,fxTrim,fxBind,parts,light,render,hud,buildApply,fxShow,get LIGHTS(){return LIGHTS},get LBOX(){return LBOX},get LOOT_BOX(){return LOOT_BOX},lootShowAll,lootPrefs,SKV,skvOf,skvPlay,glyph,setSkillButtons,stateMarks,maxiSet,anonDump,auraVisR,get MP(){return MP},mpZone,mpMovePkt,mpNoteCast,mpNoteSwing,toxicSwing,nearbyAllies,auraFoes,nodeMul,actDone,mpRecv,dropWeights,partyDropN,WALK,walkChoose,walkOffer,walkState,resOf,resPen,resEff,resClamp,mercResOf,affText,itemLines,migrateItem,RTK,MERCS,fillSlide,tryGear,itemSkillOn,saveObj,castIndex,blinkCast,itemSkillTick,uniqEligible,uniqBand,remoteStep,dropFrom,get ISK(){return ISK},mapPrint,withMapRng,debugHits,worldAt,screenAt,aimSpec,aimDefault,walk,castSpot,aimClamp,beginAim,aimMove,aimSet,aimRelease,aimCancel,wantDrag,aimStickMetrics,aimThumbWorld,aimThumb,aimCommit,aimAcquire,aimTapPoint,aimHopPoint,aimPlace,blinkEnd,hedgePts,faultPts,get AIMING(){return AIMING},get J(){return J},AIM_TAP_MS,AIM,uiTouch,noteInput,uiApply,uiBoot,slideLine,uiProbe,slotKeyLabel,uiSay,beltBudget,charmMigrate,charmOnKill,charmFrom,bagCan,gridCan,gridPlace,charmNormalize,charmRanks,charmBonus,charmSocket,charmTakeOff,charmRefit,mkLetter,mkChurn,charmOdds,pvpLifeMul,gridCells,charmParts,cmpEval,cmpTargets,cmpHTML,sheetSwap,strictUp,strikeInfo,itemHands,statsWith,openVend,vendAsk,vendBid,vendBuy,vendSell,vendBuyback,vendBuyStim,vendIdentify,vendBox,vendTabOf,buyPrice,sellValue,satCost,satPrice,boxPrice,get VEND(){return VEND},get BUYBACK(){return BUYBACK},get shopVia(){return shopVia},setShopVia(v){shopVia=+v||0},vendFlipLock,vendSellPlan,vendSellCommit,vendSellOpen,sellFilters,vendQuest,lootPasses,lootAuto,lootMigrate,lootLayout,lootName,lootPickup,lootOpen,lootCompare,lootPrefs,lootSave,lootLoad,layCorpse,reclaimCorpse,buyCorpse,corpseFee,repairQuote,repairOne,repairAll,repairList,wearWeapon,wearArmor,wearSlot,itemBroken,stampDura,migrateDurability,placeCorpses,deathCreditPct,encW,loanerWeapon,calmNearCorpse,resetZones,stampReq,canWear,blowPct,blowSpec,swingBlow,gearLive,gearQuiet,reqShortfall,cantEquipText,attrTip,driveStat,witImpact,pdmg,classWeapon,weaponRole};
