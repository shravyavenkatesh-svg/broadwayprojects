// src/utils.js

// ── Date helpers ──────────────────────────────
export const fmt = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}) : '—';
export const fmts = d => d ? new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short'}) : '—';
export const fiso = d => d ? new Date(d).toISOString().split('T')[0] : '';
export const addDays = (d,n) => { const r=new Date(d); r.setDate(r.getDate()+Math.round(n)); return r; };
export const daysBetween = (a,b) => Math.round((new Date(b)-new Date(a))/86400000);

// ── CPM Engine ────────────────────────────────
export class CPM {
  constructor(tasks, startDate, targetDate) {
    this.m = {};
    tasks.forEach(t => { this.m[t.id] = { ...t }; });
    this.start = new Date(startDate);
    this.target = new Date(targetDate);
    this.today = new Date(); this.today.setHours(0,0,0,0);
  }
  ad(d,n){ const r=new Date(d); r.setDate(r.getDate()+Math.round(n)); return r; }
  db(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
  ed(t){ if(t.status==='done')return 0; if(t.status==='in_progress')return Math.max(1,Math.ceil(t.duration*(1-(t.completion||0)/100))); return t.duration||0; }
  topo(){
    const vis=new Set(), res=[];
    const dfs=id=>{ if(vis.has(id))return; vis.add(id); (this.m[id]?.deps||[]).forEach(d=>{ if(this.m[d])dfs(d); }); res.push(id); };
    Object.keys(this.m).forEach(id=>dfs(id));
    return res;
  }
  run(){
    const s=this.topo(), ES={}, EF={};
    for(const id of s){
      const t=this.m[id]; if(!t)continue;
      if(t.status==='done'&&t.actualEnd){ EF[id]=new Date(t.actualEnd); ES[id]=t.actualStart?new Date(t.actualStart):EF[id]; continue; }
      let dm=new Date(this.start);
      for(const d of(t.deps||[])){ if(EF[d]&&EF[d]>dm)dm=EF[d]; }
      if(t.status==='in_progress'&&t.actualStart){ ES[id]=new Date(t.actualStart); if(dm>ES[id])ES[id]=dm; } else { ES[id]=dm; }
      EF[id]=this.ed(t)===0?new Date(ES[id]):this.ad(ES[id],this.ed(t));
    }
    const pe=EF['LAUNCH']||Object.values(EF).reduce((m,d)=>d>m?d:m,this.start);
    const sc={}; Object.values(this.m).forEach(t=>{ (t.deps||[]).forEach(d=>{ if(!sc[d])sc[d]=[]; sc[d].push(t.id); }); });
    const LS={}, LF={}, rs=[...s].reverse();
    for(const id of rs){
      const t=this.m[id]; if(!t)continue;
      if(!sc[id]||!sc[id].length){ LF[id]=new Date(pe); }
      else{ let ml=null; for(const x of sc[id]){ if(LS[x]&&(ml===null||LS[x]<ml))ml=LS[x]; } LF[id]=ml?new Date(ml):new Date(pe); }
      LS[id]=this.ad(new Date(LF[id]),-(this.ed(t)));
    }
    const res={};
    for(const id of s){
      const t=this.m[id]; if(!t)continue;
      const ef=EF[id]||new Date(this.start), lf=LF[id]||new Date(pe);
      const fl=this.db(ef,lf);
      res[id]={ ...t, es:ES[id], ef, ls:LS[id], lf, float:fl, isCritical:fl<=0 };
    }
    return { tasks:res, projLaunch:pe, gap:this.db(pe,this.target), dtt:this.db(this.today,this.target),
             cp:Object.values(res).filter(t=>t.isCritical&&t.id!=='LAUNCH').map(t=>t.id) };
  }
}

// ── Priority Engine ───────────────────────────
export const computePriority = (tasks, cpmTasks) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const candidates = Object.values(tasks).filter(t => t.id!=='LAUNCH' && (t.status==='not_started'||t.status==='in_progress'));
  const scored = candidates.map(t => {
    const ef = cpmTasks?.[t.id]?.ef;
    const daysToFinish = ef ? Math.max(0,Math.round((ef-today)/86400000)) : t.duration;
    const remaining = t.status==='in_progress' ? Math.ceil(t.duration*(1-(t.completion||0)/100)) : t.duration;
    return { id:t.id, leadTime: daysToFinish+remaining };
  }).sort((a,b)=>b.leadTime-a.leadTime);
  const map = {};
  scored.forEach((s,i) => {
    const pct = (i/Math.max(1,scored.length-1))*100;
    map[s.id] = pct<=20 ? 'P1' : pct<=50 ? 'P2' : 'P3';
  });
  return map;
};

// ── Ripple Engine ─────────────────────────────
export const getRippleImpact = (changedId, oldTasks, newTasks, startDate, targetDate) => {
  const oldCPM = new CPM(Object.values(oldTasks), startDate, targetDate).run();
  const newCPM = new CPM(Object.values(newTasks), startDate, targetDate).run();
  // BFS downstream
  const downstream = {};
  Object.values(newTasks).forEach(t => { (t.deps||[]).forEach(d => { if(!downstream[d])downstream[d]=[]; downstream[d].push(t.id); }); });
  const visited = new Set(); const queue = [changedId];
  while(queue.length){ const cur=queue.shift(); if(visited.has(cur))continue; if(cur!==changedId)visited.add(cur); (downstream[cur]||[]).forEach(d=>queue.push(d)); }
  const impacts = [];
  visited.forEach(id => {
    const t = newTasks[id]; if(!t||id==='LAUNCH')return;
    const oldEF = oldCPM.tasks[id]?.ef;
    const newEF = newCPM.tasks[id]?.ef;
    if(!oldEF||!newEF)return;
    const shift = Math.round((newEF-oldEF)/86400000);
    if(shift!==0) impacts.push({ id, name:t.name, team:t.team, oldDate:oldEF, newDate:newEF, shift });
  });
  return { impacts, oldLaunch:oldCPM.projLaunch, newLaunch:newCPM.projLaunch };
};

// ── Group progress ────────────────────────────
export const calcGroupProgress = (group, tasks) => {
  const children = group.children.map(id=>tasks[id]).filter(Boolean);
  if(!children.length)return{pct:0,done:0,total:0,status:'not_started'};
  const done=children.filter(t=>t.status==='done').length;
  const blocked=children.filter(t=>t.status==='blocked').length;
  const wip=children.filter(t=>t.status==='in_progress').length;
  const pct=Math.round(children.reduce((s,t)=>{ if(t.status==='done')return s+100; return s+(t.completion||0); },0)/children.length);
  let status='not_started';
  if(done===children.length)status='done';
  else if(blocked>0)status='blocked';
  else if(wip>0||done>0)status='in_progress';
  return{pct,done,total:children.length,status};
};
