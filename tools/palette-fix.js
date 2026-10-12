/* Propose the smallest palette change that makes an actor read.
   node tools/palette-fix.js [threshold]
   The rule: an actor's body must stand at least dE 18 (OKLab x100) from every
   floor colour of every district it spawns in. The fix is a step in *lightness*,
   keeping the hue, because a figure reads against its ground by value first --
   and because swinging the hue would break the act's palette, which is authored.
   Prints old -> new. It changes nothing on its own. */
const {chromium}=require('playwright');
const path=require('path');
const URL='file://'+path.join(__dirname,'..','dist/Unsubscribe-2087-standalone.html');
const TH=+(process.argv[2]||18);

const srgb=c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4);
const unsrgb=c=>c<=.0031308?c*12.92:1.055*Math.pow(c,1/2.4)-.055;
function lab(hex){const h=hex.replace('#','');
  const f=i=>srgb(parseInt(h.substr(i,2),16)/255);
  const r=f(0),g=f(2),b=f(4);
  const l=Math.cbrt(.4122214708*r+.5363325363*g+.0514459929*b);
  const m=Math.cbrt(.2119034982*r+.6806995451*g+.1073969566*b);
  const s=Math.cbrt(.0883024619*r+.2817188376*g+.6299787005*b);
  return [.2104542553*l+.7936177850*m-.0040720468*s,
          1.9779984951*l-2.4285922050*m+.4505937099*s,
          .0259040371*l+.7827717662*m-.8086757660*s]}
function hex(L,A,B){
  const l_=L+.3963377774*A+.2158037573*B, m_=L-.1055613458*A-.0638541728*B, s_=L-.0894841775*A-1.2914855480*B;
  const l=l_*l_*l_,m=m_*m_*m_,s=s_*s_*s_;
  const v=[4.0767416621*l-3.3077115913*m+.2309699292*s,
          -1.2684380046*l+2.6097574011*m-.3413193965*s,
          -.0041960863*l-.7034186147*m+1.7076147010*s];
  return '#'+v.map(c=>{const n=Math.max(0,Math.min(255,Math.round(unsrgb(c)*255)));
    return n.toString(16).padStart(2,'0')}).join('')}
const dE=(a,b)=>{const x=lab(a),y=lab(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])*100};

(async()=>{
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:430,height:860}});
await p.goto(URL);await p.waitForTimeout(700);
await p.evaluate(()=>__g.skipDisc());await p.waitForTimeout(250);
const data=await p.evaluate(()=>{
  const ZONES=__g.ZONES,ET=__g.ET,STY=__g.STY,floors={};
  for(let zi=0;zi<ZONES.length;zi++){
    const z=ZONES[zi];if(!z||z.town||z.sim||!z.mix)continue;
    const st=STY[z.style];if(!st)continue;
    const kinds=[...new Set(z.mix.map(m=>m[0]))];
    if(z.su&&z.su.k)kinds.push(z.su.k);
    if(z.boss)kinds.push(z.boss);
    for(const k of kinds){if(!ET[k])continue;(floors[k]=floors[k]||{f:[],z:[]});
      for(const c of st.f)if(floors[k].f.indexOf(c)<0)floors[k].f.push(c);
      if(floors[k].z.indexOf(z.n)<0)floors[k].z.push(z.n)}
  }
  const out=[];for(const k in floors)out.push({k,n:ET[k].n,pal:ET[k].pal.slice(),floors:floors[k].f,zones:floors[k].z});
  return out;
});
await b.close();

const fixes=[];
for(const m of data){
  const body=m.pal[0];
  const worst=()=>Math.min(...m.floors.map(f=>dE(body,f)));
  const now=worst();
  if(now>=TH)continue;
  const [L,A,B]=lab(body);
  let best=null;
  /* smallest value step that clears every floor this thing stands on */
  for(let step=.01;step<=.6&&!best;step+=.005){
    for(const dir of [1,-1]){
      const L2=L+dir*step;if(L2<=.06||L2>=.97)continue;
      const cand=hex(L2,A,B);
      const got=Math.min(...m.floors.map(f=>dE(cand,f)));
      if(got>=TH){best={cand,got,dir,step};break}
    }
  }
  fixes.push({...m,now:Math.round(now*10)/10,best});
}
fixes.sort((a,b)=>a.now-b.now);
console.log('rule: an actor body stands at least dE '+TH+' from every floor it spawns on\n');
console.log('monster                  was    now   body     ->  lifted   districts');
for(const f of fixes){
  const t=f.best?(Math.round(f.best.got*10)/10):'--';
  console.log('  '+f.n.slice(0,22).padEnd(23)+String(f.now).padStart(5)+String(t).padStart(7)+'   '+
    f.pal[0]+' -> '+(f.best?f.best.cand:'(no step works)')+'  '+(f.best&&f.best.dir>0?'lighter':'darker ')+
    '  '+f.zones.slice(0,2).join(', ').slice(0,34));
}
console.log('\n'+fixes.length+' of '+data.length+' actors are under the rule.');
console.log('\nPatch pairs:');
console.log(fixes.filter(f=>f.best).map(f=>"  "+f.k+": '"+f.pal[0]+"' -> '"+f.best.cand+"'").join('\n'));
})();
