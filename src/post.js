/* ---------- the finishing pass (WebGL) ----------
   Stage 1 of the engine plan (2026-11-03): the canvas draws the world exactly as before,
   then, before the labels and the HUD go on, the finished world goes through WebGL once:
   a bright pass blurred into bloom, ripples where heavy blows land, a red-blue split on
   heavy trauma, and a colour grade for each act. The result is drawn back onto the same
   canvas, so input, labels, the minimap and every test see one canvas as they always did.
   No WebGL, a shader that will not compile, or a lost context: the pass turns itself off
   and the frame is exactly what the canvas drew. Settings: OPT.post. */
let PG=null,PG_OFF=0,PG_T=0;const WAVES=[];
/* a ripple at a point on the screen, in view units; s is how hard */
function postWave(X,Y,s){if(!OPT.post||PG_OFF)return;if(WAVES.length>7)WAVES.shift();WAVES.push({X,Y,t:0,s:Math.min(1.6,s||1)})}
/* per act: lift (shadows), gain (highlights), saturation, bloom */
const GRADE={0:[[.010,.008,.020],[1.02,1.00,1.04],1.10,1.1],1:[[.018,.010,.004],[1.06,1.00,.95],1.12,1.1],2:[[.004,.012,.024],[.97,1.02,1.08],1.18,1.25],3:[[.006,.010,.020],[.98,1.00,1.05],1.06,1.1],
  4:[[.020,.012,.006],[1.05,1.00,.93],1.04,1.05],5:[[.022,.010,.002],[1.08,.99,.91],1.10,1.2],pre:[[.000,.014,.020],[.95,1.02,1.06],.95,1.15]};
function postGrade(){const z=W&&W.z;if(!z)return GRADE[0];if(z.pre)return GRADE.pre;let a=1;try{a=typeof actOf==='function'?actOf(W.zi):1}catch(e){}return GRADE[a]||GRADE[1]}
function postInit(){
  const c=document.createElement('canvas'),o={alpha:false,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,preserveDrawingBuffer:false,powerPreference:'high-performance'};
  const gl=c.getContext('webgl',o)||c.getContext('experimental-webgl',o);if(!gl)return postOff('no WebGL');
  c.addEventListener('webglcontextlost',e=>{e.preventDefault();postOff('context lost')});
  const sh=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(x));return x};
  const VS='attribute vec2 p;varying vec2 v;void main(){v=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const prog=(fs,names)=>{const p=gl.createProgram();gl.attachShader(p,sh(gl.VERTEX_SHADER,VS));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,'precision mediump float;varying vec2 v;'+fs));gl.bindAttribLocation(p,0,'p');gl.linkProgram(p);
    if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));const u={};for(const n of names)u[n]=gl.getUniformLocation(p,n);return{p,u}};
  try{
    PG={c,gl,
      /* bright pass, four taps so the quarter-size target is a box filter, not a skip. Only bright AND
         coloured light blooms: a white wall is bright but it is not a lamp */
      br:prog('uniform sampler2D s;uniform vec2 px;uniform float th;void main(){vec3 c=(texture2D(s,v+px*vec2(-.5,-.5)).rgb+texture2D(s,v+px*vec2(.5,-.5)).rgb+texture2D(s,v+px*vec2(-.5,.5)).rgb+texture2D(s,v+px*vec2(.5,.5)).rgb)*.25;'+
        'float l=max(c.r,max(c.g,c.b)),ch=l-min(c.r,min(c.g,c.b));gl_FragColor=vec4(c*smoothstep(th,th+.25,l)*(.15+.85*smoothstep(.18,.55,ch)),1.);}',['s','px','th']),
      bl:prog('uniform sampler2D s;uniform vec2 d;void main(){vec3 c=texture2D(s,v).rgb*.227;c+=(texture2D(s,v+d*1.385).rgb+texture2D(s,v-d*1.385).rgb)*.316;c+=(texture2D(s,v+d*3.231).rgb+texture2D(s,v-d*3.231).rgb)*.070;gl_FragColor=vec4(c,1.);}',['s','d']),
      /* the composite: ripples bend where the scene is read from, then the split, the bloom and the grade */
      cm:prog('uniform sampler2D s,b;uniform float asp,ca,bk,sat;uniform vec3 lift,gain;uniform vec4 w[8];'+
        'void main(){vec2 uv=v;for(int i=0;i<8;i++){vec4 q=w[i];if(q.w<=0.)continue;vec2 d=uv-q.xy;d.x*=asp;float L=length(d)+1e-4;float x=L-q.z;float m=exp(-x*x*1400.)*q.w;uv-=d/L*m*vec2(1./asp,1.)*.018;}'+
        'vec3 c;if(ca>0.){vec2 o=(uv-.5)*ca;c=vec3(texture2D(s,uv+o).r,texture2D(s,uv).g,texture2D(s,uv-o).b);}else c=texture2D(s,uv).rgb;'+
        'vec3 bl=texture2D(b,v).rgb*bk;c=1.-(1.-c)*(1.-bl);c=c*gain+lift*(1.-c);c=mix(c,c*c*(3.-2.*c),.22);float g=dot(c,vec3(.299,.587,.114));c=mix(vec3(g),c,sat);gl_FragColor=vec4(c,1.);}',['s','b','asp','ca','bk','sat','lift','gain','w'])};
  }catch(e){return postOff('shader: '+e.message)}
  const q=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,q);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  const tex=()=>{const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);for(const[k,v]of[[gl.TEXTURE_MIN_FILTER,gl.LINEAR],[gl.TEXTURE_MAG_FILTER,gl.LINEAR],[gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE],[gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE]])gl.texParameteri(gl.TEXTURE_2D,k,v);return t};
  PG.scene=tex();PG.t=[tex(),tex()];PG.f=[gl.createFramebuffer(),gl.createFramebuffer()];PG.w=0;PG.h=0;
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);gl.disable(gl.BLEND);return PG}
function postOff(why){PG_OFF=1;PG=null;WAVES.length=0;if(typeof console!=='undefined')console.warn('finishing pass off: '+why);return null}
function postSize(w,h){const{gl}=PG,bw=Math.max(1,w>>2),bh=Math.max(1,h>>2);PG.c.width=w;PG.c.height=h;PG.w=w;PG.h=h;PG.bw=bw;PG.bh=bh;
  for(let i=0;i<2;i++){gl.bindTexture(gl.TEXTURE_2D,PG.t[i]);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,bw,bh,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.bindFramebuffer(gl.FRAMEBUFFER,PG.f[i]);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,PG.t[i],0)}
  gl.bindFramebuffer(gl.FRAMEBUFFER,null)}
/* called from render() once the world and its darkness are drawn, before any label */
function postFx(){if(!OPT.post||PG_OFF)return;if(!PG&&!postInit())return;
  const dt=Math.min(.05,Math.max(0,tNow-(PG_T||tNow)));PG_T=tNow;
  const{gl}=PG,cvs=ctx.canvas,w=cvs.width,h=cvs.height;if(w<4||h<4)return;if(w!==PG.w||h!==PG.h)postSize(w,h);
  /* the heavy rings the fights already draw are the blows worth a ripple */
  for(const f of W.fx)if(f.k==='ring'&&!f.pw&&(f.r||0)>=1.4&&f.t<.1){f.pw=1;postWave(SX(f.x,f.y),SY(f.x,f.y),Math.min(1.4,f.r/2.2))}
  for(const q of WAVES)q.t+=dt;while(WAVES.length&&WAVES[0].t>.7)WAVES.shift();
  try{
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,PG.scene);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,cvs);
    const gr=postGrade(),thin=OPT.fx==='thin';
    /* bloom at a quarter size: bright pass into A, blur A into B across, B into A down */
    gl.viewport(0,0,PG.bw,PG.bh);
    gl.useProgram(PG.br.p);gl.bindFramebuffer(gl.FRAMEBUFFER,PG.f[0]);gl.uniform1i(PG.br.u.s,0);gl.uniform2f(PG.br.u.px,1/PG.bw*.5,1/PG.bh*.5);gl.uniform1f(PG.br.u.th,.62);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    gl.useProgram(PG.bl.p);gl.uniform1i(PG.bl.u.s,0);
    for(let pass=0;pass<2;pass++){gl.bindFramebuffer(gl.FRAMEBUFFER,PG.f[1]);gl.bindTexture(gl.TEXTURE_2D,PG.t[0]);gl.uniform2f(PG.bl.u.d,1.4/PG.bw,0);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
      gl.bindFramebuffer(gl.FRAMEBUFFER,PG.f[0]);gl.bindTexture(gl.TEXTURE_2D,PG.t[1]);gl.uniform2f(PG.bl.u.d,0,1.4/PG.bh);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
    /* composite to the screen */
    gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,w,h);gl.useProgram(PG.cm.p);
    gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,PG.scene);gl.uniform1i(PG.cm.u.s,0);
    gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,PG.t[0]);gl.uniform1i(PG.cm.u.b,1);gl.activeTexture(gl.TEXTURE0);
    gl.uniform1f(PG.cm.u.asp,w/h);gl.uniform1f(PG.cm.u.ca,OPT.calm?0:Math.max(0,shake-.35)*.012);gl.uniform1f(PG.cm.u.bk,thin?gr[3]*.5:gr[3]);gl.uniform1f(PG.cm.u.sat,gr[2]);
    gl.uniform3fv(PG.cm.u.lift,gr[0]);gl.uniform3fv(PG.cm.u.gain,gr[1]);
    const wv=new Float32Array(32);if(!OPT.calm)WAVES.forEach((q,i)=>{const u=q.t/.7;wv[i*4]=q.X/VW;wv[i*4+1]=1-q.Y/VH;wv[i*4+2]=u*.22;wv[i*4+3]=q.s*(1-u)});gl.uniform4fv(PG.cm.u.w,wv);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    if(gl.isContextLost())return;
    ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.globalCompositeOperation='copy';ctx.drawImage(PG.c,0,0);ctx.restore()
  }catch(e){postOff('frame: '+e.message)}}
