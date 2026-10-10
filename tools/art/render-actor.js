/* Pre-rendered 3D -> 2D sprite sheets, without Blender.
   A small software rasteriser runs inside headless Chromium: build a mesh from
   primitives, light it, and render it from 8 isometric directions across an
   animation. Writes an albedo atlas, a normal atlas and a JSON manifest.

   The atlas format is the contract. A Blender render can replace this script
   later and the game will not know the difference.

     node tools/art/render-actor.js tick
*/
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const OUT = path.join(root, 'art', 'out');

const ACTOR = process.argv[2] || 'tick';
const SIZE = 40;          /* frame box at 1x; the tick covers ~26px on screen */
const SCALE = 2;          /* render at 2x for retina, downscale at runtime */
const DIRS = 8;

/* ---------------------------------------------------------------- scene ---
   Everything below runs in the page. Kept in one function so it can be
   handed to evaluate() whole. */
function scene({ ACTOR, SIZE, SCALE, DIRS }) {
  const S = SIZE * SCALE;

  /* ---- tiny vector helpers ---- */
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
  const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0]/l, v[1]/l, v[2]/l]; };
  const dot = (a, b) => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];

  /* ---- primitives -> triangle soup ---- */
  function ellipsoid(c, r, seg, mat) {
    const tris = [], rings = seg, segs = seg * 2;
    const P = (i, j) => {
      const th = Math.PI * i / rings, ph = 2 * Math.PI * j / segs;
      return [c[0] + r[0] * Math.sin(th) * Math.cos(ph),
              c[1] + r[1] * Math.sin(th) * Math.sin(ph),
              c[2] + r[2] * Math.cos(th)];
    };
    for (let i = 0; i < rings; i++) for (let j = 0; j < segs; j++) {
      const a = P(i, j), b = P(i + 1, j), d = P(i + 1, j + 1), e = P(i, j + 1);
      /* analytic normal at the centroid keeps the surface smooth instead of faceted */
      const sn = vs => { const cx = (vs[0][0]+vs[1][0]+vs[2][0])/3, cy = (vs[0][1]+vs[1][1]+vs[2][1])/3,
          cz = (vs[0][2]+vs[1][2]+vs[2][2])/3;
        return norm([(cx-c[0])/(r[0]*r[0]), (cy-c[1])/(r[1]*r[1]), (cz-c[2])/(r[2]*r[2])]); };
      tris.push({ v: [a, b, d], mat, n: sn([a,b,d]) }, { v: [a, d, e], mat, n: sn([a,d,e]) });
    }
    return tris;
  }
  /* a tapered tube between two points: good enough for legs and antennae */
  function limb(p0, p1, r0, r1, seg, mat) {
    const tris = [], ax = norm(sub(p1, p0));
    let up = Math.abs(ax[2]) > .9 ? [1, 0, 0] : [0, 0, 1];
    const u = norm(cross(ax, up)), w = norm(cross(ax, u));
    const ring = (p, r) => {
      const out = [];
      for (let k = 0; k < seg; k++) { const a = 2 * Math.PI * k / seg, c = Math.cos(a) * r, s = Math.sin(a) * r;
        out.push([p[0] + u[0]*c + w[0]*s, p[1] + u[1]*c + w[1]*s, p[2] + u[2]*c + w[2]*s]); }
      return out;
    };
    const A = ring(p0, r0), B = ring(p1, r1);
    const rn = pt => { const d = sub(pt, p0), along = dot(d, ax);
      return norm(sub(d, [ax[0]*along, ax[1]*along, ax[2]*along])); };
    for (let k = 0; k < seg; k++) { const n = (k + 1) % seg;
      tris.push({ v: [A[k], B[k], B[n]], mat, n: rn(A[k]) }, { v: [A[k], B[n], A[n]], mat, n: rn(A[n]) }); }
    tris.push(...ellipsoid(p1, [r1, r1, r1], 4, mat));
    return tris;
  }

  /* ---- the actor ---------------------------------------------------- */
  const MAT = {
    shell:  { col: [0.91, 0.53, 0.18] },   /* #e8862e */
    under:  { col: [0.35, 0.23, 0.11] },   /* #5a3a1c */
    leg:    { col: [0.42, 0.33, 0.26] },
    eye:    { col: [1.00, 0.80, 0.42], emis: 1 }
  };

  function tick(t, moving) {
    /* t is 0..1 through the cycle */
    const tris = [];
    const gait = moving ? 1 : 0.18;
    const bob = Math.sin(t * Math.PI * 2) * (moving ? 0.045 : 0.018);
    const bz = 0.34 + bob;
    /* carapace: low and broad, so it reads as an insect from above, not a ball */
    tris.push(...ellipsoid([0, 0, bz], [0.50, 0.40, 0.21], 12, MAT.shell));
    /* a second plate gives the shell a ridge instead of one smooth dome */
    tris.push(...ellipsoid([-0.08, 0, bz + 0.07], [0.34, 0.27, 0.15], 10, MAT.shell));
    /* underside, darker, peeking below */
    tris.push(...ellipsoid([0, 0, bz - 0.10], [0.44, 0.35, 0.10], 8, MAT.under));
    /* head forward (+x is forward) */
    tris.push(...ellipsoid([0.44, 0, bz - 0.05], [0.19, 0.17, 0.13], 9, MAT.under));
    /* eye, emissive, set forward so it is the first thing you see */
    tris.push(...ellipsoid([0.56, 0, bz + 0.01], [0.115, 0.115, 0.115], 7, MAT.eye));
    /* four legs, alternating tripod gait */
    const hips = [[0.26, 0.26], [-0.14, 0.30], [0.26, -0.26], [-0.14, -0.30]];
    hips.forEach((h, i) => {
      const phase = t * Math.PI * 2 + (i % 2 ? Math.PI : 0) + (i > 1 ? 0.5 : 0);
      const swing = Math.sin(phase) * 0.20 * gait;
      const lift = Math.max(0, Math.sin(phase)) * 0.13 * gait;
      const side = Math.sign(h[1]);
      /* The knee sits below the hip. Raised knees read as antennae when a leg
         happens to point along the camera's depth axis. */
      const knee = [h[0] + swing * 0.6, h[1] + side * 0.50, bz * 0.52];
      const foot = [h[0] + swing,       h[1] + side * 0.60, lift];
      tris.push(...limb([h[0], h[1], bz - 0.02], knee, 0.075, 0.060, 7, MAT.leg));
      tris.push(...limb(knee, foot, 0.060, 0.030, 7, MAT.leg));
    });
    return tris;
  }

  const ACTORS = { tick: { build: tick, frames: { idle: 4, walk: 6 }, fit: 1.25 } };
  const def = ACTORS[ACTOR];

  /* ---- camera + raster --------------------------------------------- */
  const ELEV = 30 * Math.PI / 180;       /* classic iso tilt: ground squashes to 1/2 */
  const SE = Math.sin(ELEV), CE = Math.cos(ELEV);

  function project(p, az, fit) {
    const ca = Math.cos(az), sa = Math.sin(az);
    const x = p[0] * ca - p[1] * sa;
    const y = p[0] * sa + p[1] * ca;
    const sx = x;
    const sy = y * SE - p[2] * CE;
    const depth = y * CE + p[2] * SE;
    return [S / 2 + sx * (S / 2) / fit, S * 0.62 + sy * (S / 2) / fit, depth];
  }
  function rotN(n, az) {
    const ca = Math.cos(az), sa = Math.sin(az);
    const x = n[0] * ca - n[1] * sa, y = n[0] * sa + n[1] * ca;
    return [x, y * SE - n[2] * CE, y * CE + n[2] * SE];
  }

  const KEY = norm([-0.55, -0.72, 0.42]);   /* top-left key, matches STYLE.md */
  const FILL = norm([0.6, 0.3, 0.2]);

  function draw(ctx, nctx, tris, az, fit) {
    const list = [];
    for (const tr of tris) {
      const p = tr.v.map(v => project(v, az, fit));
      const face = norm(cross(sub(tr.v[1], tr.v[0]), sub(tr.v[2], tr.v[0])));
      if (rotN(face, az)[2] < 0) continue;           /* backface, by the true face */
      const n = rotN(tr.n || face, az);              /* shade by the smooth normal */
      list.push({ p, n, mat: tr.mat, z: (p[0][2] + p[1][2] + p[2][2]) / 3 });
    }
    list.sort((a, b) => a.z - b.z);
    for (const t of list) {
      const m = t.mat, nl = t.n;
      let lam = Math.max(0, dot(nl, KEY)), fil = Math.max(0, dot(nl, FILL)) * 0.25;
      const rim = Math.pow(1 - Math.max(0, nl[2]), 2.5) * 0.45;
      let k = m.emis ? 1 : (0.22 + 0.78 * lam + fil);
      const c = m.col.map(v => Math.min(1, v * k + rim * (m.emis ? 0 : 0.55)));
      ctx.fillStyle = 'rgb(' + c.map(v => Math.round(v * 255)).join(',') + ')';
      ctx.beginPath(); ctx.moveTo(t.p[0][0], t.p[0][1]);
      ctx.lineTo(t.p[1][0], t.p[1][1]); ctx.lineTo(t.p[2][0], t.p[2][1]); ctx.closePath();
      ctx.fill();
      /* normal map: camera-space normal packed into rgb */
      nctx.fillStyle = 'rgb(' + Math.round((nl[0] * .5 + .5) * 255) + ',' +
        Math.round((-nl[1] * .5 + .5) * 255) + ',' + Math.round((nl[2] * .5 + .5) * 255) + ')';
      nctx.beginPath(); nctx.moveTo(t.p[0][0], t.p[0][1]);
      nctx.lineTo(t.p[1][0], t.p[1][1]); nctx.lineTo(t.p[2][0], t.p[2][1]); nctx.closePath();
      nctx.fill();
    }
  }

  /* ---- render every direction x frame into one sheet ---------------- */
  const anims = Object.keys(def.frames);
  const total = anims.reduce((n, a) => n + def.frames[a], 0);
  const cols = DIRS, rows = total;
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const sheet = mk(cols * S, rows * S), nsheet = mk(cols * S, rows * S);
  const sctx = sheet.getContext('2d'), nsctx = nsheet.getContext('2d');
  const cell = mk(S, S), ncell = mk(S, S), outlc = mk(S, S);
  const cctx = cell.getContext('2d'), ncctx = ncell.getContext('2d'), outl = outlc.getContext('2d');

  const manifest = { actor: ACTOR, size: SIZE, scale: SCALE, dirs: DIRS, anims: {}, frames: [] };
  let row = 0;
  for (const anim of anims) {
    const n = def.frames[anim];
    manifest.anims[anim] = { row, count: n };
    for (let f = 0; f < n; f++) {
      for (let d = 0; d < DIRS; d++) {
        cctx.clearRect(0, 0, S, S); ncctx.clearRect(0, 0, S, S);
        const az = d / DIRS * Math.PI * 2;
        draw(cctx, ncctx, def.build(f / n, anim === 'walk'), az, def.fit);
        /* Dilate the silhouette into a dark rim, then put the shaded render back on
           top. The drawn game outlines everything; sprites have to match or they
           look pasted on. */
        outl.clearRect(0, 0, S, S);
        const o = Math.max(1, Math.round(SCALE));
        for (let a = 0; a < 8; a++) outl.drawImage(cell,
          Math.round(Math.cos(a * Math.PI / 4) * o), Math.round(Math.sin(a * Math.PI / 4) * o));
        outl.globalCompositeOperation = 'source-in';
        outl.fillStyle = '#17131c'; outl.fillRect(0, 0, S, S);
        outl.globalCompositeOperation = 'source-over';
        outl.drawImage(cell, 0, 0);
        sctx.drawImage(outlc, d * S, (row + f) * S);
        nsctx.drawImage(ncell, d * S, (row + f) * S);
      }
    }
    row += n;
  }
  manifest.cell = S;
  manifest.cols = cols; manifest.rows = rows;
  return { albedo: sheet.toDataURL('image/png'), normal: nsheet.toDataURL('image/png'), manifest };
}

(async () => {
  const b = await chromium.launch({ executablePath: process.env.PW_CHROMIUM || undefined });
  const p = await b.newPage();
  await p.setContent('<!doctype html><html><body></body></html>');
  const r = await p.evaluate(scene, { ACTOR, SIZE, SCALE, DIRS });
  fs.mkdirSync(OUT, { recursive: true });
  const w = (name, dataUrl) => {
    const buf = Buffer.from(dataUrl.split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, name), buf);
    return buf.length;
  };
  const a = w(ACTOR + '.png', r.albedo);
  const n = w(ACTOR + '-n.png', r.normal);
  fs.writeFileSync(path.join(OUT, ACTOR + '.json'), JSON.stringify(r.manifest, null, 1));
  console.log(ACTOR + ': ' + r.manifest.cols + 'x' + r.manifest.rows + ' cells of ' + r.manifest.cell + 'px');
  console.log('  albedo ' + (a / 1024).toFixed(1) + 'KB   normal ' + (n / 1024).toFixed(1) + 'KB');
  console.log('  anims  ' + JSON.stringify(r.manifest.anims));
  await b.close();
})();
