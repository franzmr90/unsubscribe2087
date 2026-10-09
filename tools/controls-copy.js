/* Fails if the pre-mouse control wording comes back.
   Scans the player-facing source and the living docs. Archived playthrough
   notes are a record of an older session and are left alone.
   node tools/controls-copy.js */
const fs=require('fs');
const path=require('path');
const root=path.join(__dirname,'..');
const files=[
  'src/p0.html','src/p1.js','src/p2.js','src/p3.js','src/p4.js','src/p5.js','src/p6.js',
  'src/p7.js','src/p8.js','src/p9.js','src/p10.js','src/p11.js','src/p12.js','src/p13.js',
  'README.md','CLAUDE.md','notes/walkthrough.md'
];
const stale=[
  'press the action button',
  "title:'Three buttons'",
  'Hold Attack, or hold the left button',
  'Stand on a drop and it comes up',
  'use the action button to take it',
  'from Options, or from the title',
  'The number on a thumb button is its key',
  'Open Skills to put three more',
  'touch joystick'
];
const need=[
  ['src/p4.js','On a desk, left click walks'],
  ['src/p4.js','On a phone, the stick walks'],
  ['src/p4.js','On a desk, hold the left button on a machine'],
  ['src/p4.js','left click a drop'],
  ['src/p4.js','F1 through F8'],
  ['src/p4.js','or with H'],
  ['src/p4.js','Key ${k+1}'],
  ['src/p4.js','Tap the stim'],
  ['src/p4.js','Drag it, then let go'],
  ['src/p4.js','Drag away from the button'],
  ['src/p4.js','Further from the button'],
  ['src/p4.js','A quick tap on a ground skill'],
  ['src/p4.js','will not land on a machine'],
  ['src/p4.js','Buttons 1, 2 and 3 sit under your thumb'],
  ['src/p0.html','content:"1"'],
  ['src/p0.html','content:"Space"'],
  ['src/p0.html','data-ui-copy="touch"'],
  ['src/p0.html','data-ui-copy="mouse"'],
  ['README.md','left click walks and strikes'],
  ['notes/walkthrough.md','where a skill sits'],
  ['tools/text/export.js','MODE: '],
  ['tools/text/export.js','mode: mode'],
  ['tools/text/export.js',"name === 'uiSay'"]
];
const fail=[];
for(const rel of files){
  const text=fs.readFileSync(path.join(root,rel),'utf8');
  const lines=text.split('\n');
  stale.forEach(s=>{
    lines.forEach((line,i)=>{if(line.includes(s))fail.push(rel+':'+(i+1)+' still says '+JSON.stringify(s))});
  });
}
for(const [rel,s] of need){
  const text=fs.readFileSync(path.join(root,rel),'utf8');
  if(!text.includes(s))fail.push(rel+' is missing '+JSON.stringify(s));
}
if(fail.length){console.error(fail.join('\n'));process.exit(1)}
console.log('controls copy ok',files.length,'files');
