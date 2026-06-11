// src/components/Dashboard.js
import { useState, useRef } from 'react';
import { ref as dbRef, update } from 'firebase/database';
import { db } from '../firebase';
import { TEAMS, CATS, STATUS_CFG, PARENT_GROUPS, CHILD_TO_PARENT } from '../constants';
import { CPM, computePriority, getRippleImpact, calcGroupProgress, fmt, fmts, fiso } from '../utils';

const PID = 'main';

function badge(status) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.not_started;
  const cls = status==='done'?'badge-green':status==='in_progress'?'badge-amber':status==='blocked'?'badge-red':'badge-muted';
  return <span className={`badge ${cls}`}>{cfg.lbl}</span>;
}

function PriBadge({ p }) {
  if(!p) return null;
  return <span className={`pri-p${p[1]}`}>{p}</span>;
}

export default function Dashboard({ tasks, cfg, team, userName }) {
  const [collapsed, setCollapsed] = useState({});
  const [rippleBanner, setRippleBanner] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [qeOpen, setQeOpen] = useState(null);
  const [filterTeam, setFilterTeam] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCrit, setFilterCrit] = useState(false);
  const heroRef = useRef(null);

  const allTasks = Object.values(tasks);
  if(!allTasks.length) return <div style={{ padding:48, textAlign:'center', color:'#7a7a88' }}>Loading tasks…</div>;

  const cpm = new CPM(allTasks, cfg.startDate, cfg.launchDate).run();
  const { projLaunch, gap, dtt, cp, tasks: ct } = cpm;
  const all = allTasks.filter(t => t.id !== 'LAUNCH');
  const done = all.filter(t=>t.status==='done').length;
  const blk  = all.filter(t=>t.status==='blocked').length;
  const wip  = all.filter(t=>t.status==='in_progress').length;
  const ns   = all.filter(t=>t.status==='not_started').length;
  const pct  = Math.round(all.reduce((s,t)=>{ if(t.status==='done')return s+100; return s+(t.completion||0); },0)/(all.length||1));
  const isAhead = gap >= 0;
  const ps = new Date(cfg.startDate||new Date());
  const totalMs = Math.max(1, projLaunch-ps);
  const todayPct = Math.min(100,Math.max(0,((new Date()-ps)/totalMs)*100));
  const targetPct = Math.min(100,((new Date(cfg.launchDate)-ps)/totalMs)*100);

  const priorities = computePriority(tasks, ct);
  const p1 = all.filter(t=>priorities[t.id]==='P1');
  const p2 = all.filter(t=>priorities[t.id]==='P2');
  const p3 = all.filter(t=>priorities[t.id]==='P3');

  const canEdit = (taskTeam) => team==='admin' || team===taskTeam;

  const saveField = async (id, field, val) => {
    const oldTasks = { ...tasks };
    const upd = { [field]:val, lastUpdated:Date.now(), updatedBy:userName||team };
    await update(dbRef(db, `p/${PID}/tasks/${id}`), upd);
    const newTasks = { ...tasks, [id]:{ ...tasks[id], ...upd } };
    const { impacts, oldLaunch, newLaunch } = getRippleImpact(id, oldTasks, newTasks, cfg.startDate, cfg.launchDate);
    if(impacts.length) {
      const shift = Math.round((newLaunch-oldLaunch)/86400000);
      setRippleBanner({ impacts, shift, newLaunch });
      setTimeout(()=>setRippleBanner(null), 8000);
    }
  };

  const saveQE = async (id, data) => {
    const oldTasks = { ...tasks };
    const upd = { ...data, lastUpdated:Date.now(), updatedBy:userName||team };
    if(data.status==='done') upd.completion=100;
    await update(dbRef(db, `p/${PID}/tasks/${id}`), upd);
    const newTasks = { ...tasks, [id]:{ ...tasks[id], ...upd } };
    const { impacts, oldLaunch, newLaunch } = getRippleImpact(id, oldTasks, newTasks, cfg.startDate, cfg.launchDate);
    if(impacts.length){
      const shift = Math.round((newLaunch-oldLaunch)/86400000);
      setRippleBanner({ impacts, shift, newLaunch });
      setTimeout(()=>setRippleBanner(null), 8000);
    }
    setQeOpen(null);
  };

  const toggleGroup = (id) => setCollapsed(c=>({...c,[id]:c[id]===false?true:false}));
  const expandAll   = () => { const m={}; PARENT_GROUPS.forEach(g=>m[g.id]=false); setCollapsed(m); };
  const collapseAll = () => { const m={}; PARENT_GROUPS.forEach(g=>m[g.id]=true); setCollapsed(m); };

  return (
    <div>
      {/* Ripple Banner */}
      {rippleBanner && (
        <div style={{ background:'rgba(212,168,67,0.1)', border:'1.5px solid rgba(212,168,67,0.4)', borderRadius:8, padding:'14px 18px', marginBottom:16, display:'flex', alignItems:'flex-start', gap:14 }}>
          <div style={{ fontSize:22, flexShrink:0 }}>↻</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:'#b8860b', marginBottom:8 }}>
              {rippleBanner.impacts.length} task{rippleBanner.impacts.length!==1?'s':''} recalculated{rippleBanner.shift!==0?` · Launch ${rippleBanner.shift>0?'delayed +'+rippleBanner.shift+'d':'pulled forward '+Math.abs(rippleBanner.shift)+'d'}`:''}
            </div>
            {rippleBanner.impacts.slice(0,4).map(imp=>(
              <div key={imp.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', borderBottom:'1px solid rgba(212,168,67,0.15)', fontSize:13 }}>
                <span style={{ flex:1, fontWeight:500 }}>{imp.name}</span>
                <span style={{ color:'#7a7a88', textDecoration:'line-through', fontFamily:'JetBrains Mono,monospace', fontSize:11 }}>{fmts(imp.oldDate)}</span>
                <span style={{ color:'#7a7a88', margin:'0 4px' }}>→</span>
                <span style={{ color:'#b8860b', fontFamily:'JetBrains Mono,monospace', fontSize:13, fontWeight:700 }}>{fmts(imp.newDate)}</span>
                <span style={{ fontSize:10, padding:'1px 6px', borderRadius:3, fontFamily:'JetBrains Mono,monospace', background:imp.shift>0?'rgba(192,57,43,0.1)':'rgba(26,122,69,0.1)', color:imp.shift>0?'#c0392b':'#1a7a45' }}>{imp.shift>0?'+':''}{imp.shift}d</span>
              </div>
            ))}
          </div>
          <button onClick={()=>setRippleBanner(null)} style={{ background:'none', border:'none', color:'#7a7a88', cursor:'pointer', fontSize:16, flexShrink:0 }}>✕</button>
        </div>
      )}

      {/* Summary Strip */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
        {/* Priority */}
        <div className="card">
          <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>Pending Tasks by Priority</div>
          {[['P1','URGENT',p1,'#c0392b'],['P2','HIGH',p2,'#c47d0e'],['P3','NORMAL',p3,'#1a5fa8']].map(([p,lbl,arr,col])=>(
            <div key={p} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className={`pri-p${p[1]}`}>{p} {lbl}</span>
                  <span style={{ fontSize:12, color:'#7a7a88' }}>{p==='P1'?'Act now':'Schedule soon'}</span>
                </div>
                <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:22, fontWeight:700, color:col }}>{arr.length}</span>
              </div>
              <div style={{ height:6, background:'#e4e4ea', borderRadius:3, overflow:'hidden' }}>
                <div style={{ width:`${Math.round((arr.length/Math.max(1,all.length))*100)}%`, height:'100%', background:col, borderRadius:3, transition:'width .4s' }}/>
              </div>
              {p==='P1' && arr.length>0 && <div style={{ fontSize:11, color:'#7a7a88', marginTop:3, fontFamily:'JetBrains Mono,monospace' }}>{arr.slice(0,2).map(t=>`· ${t.name.slice(0,24)}${t.name.length>24?'…':''}`).join('  ')}{arr.length>2?` +${arr.length-2} more`:''}</div>}
            </div>
          ))}
        </div>

        {/* Status distribution */}
        <div className="card">
          <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>Task Status Distribution</div>
          <div style={{ display:'flex', height:28, borderRadius:6, overflow:'hidden', marginBottom:14, gap:2 }}>
            {done>0&&<div style={{ width:`${Math.round((done/all.length)*100)}%`, background:'#1a7a45', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#fff', fontWeight:700 }}>{Math.round((done/all.length)*100)}%</div>}
            {wip>0&&<div style={{ width:`${Math.round((wip/all.length)*100)}%`, background:'#c47d0e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#fff', fontWeight:700 }}>{Math.round((wip/all.length)*100)}%</div>}
            {blk>0&&<div style={{ width:`${Math.round((blk/all.length)*100)}%`, background:'#c0392b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#fff', fontWeight:700 }}>{blk}</div>}
            <div style={{ flex:1, background:'#e4e4ea', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#7a7a88', fontWeight:500 }}>{Math.round((ns/all.length)*100)}%</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['Done',done,'#1a7a45','rgba(26,122,69,0.06)','rgba(26,122,69,0.15)'],['In Progress',wip,'#c47d0e','rgba(196,125,14,0.06)','rgba(196,125,14,0.15)'],['Blocked',blk,'#c0392b','rgba(192,57,43,0.06)','rgba(192,57,43,0.15)'],['Not Started',ns,'#7a7a88','#f0f0f3','rgba(0,0,0,0.09)']].map(([lbl,cnt,col,bg,border])=>(
              <div key={lbl} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 10px', background:bg, borderRadius:6, border:`1px solid ${border}` }}>
                <span style={{ fontSize:13, color:col, fontWeight:500 }}>{lbl}</span>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:18, fontWeight:700, color:col, lineHeight:1 }}>{cnt}</div>
                  <div style={{ fontSize:10, color:col, fontFamily:'JetBrains Mono,monospace' }}>{Math.round((cnt/Math.max(1,all.length))*100)}%</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:10, paddingTop:10, borderTop:'1.5px solid rgba(0,0,0,0.09)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:13, color:'#4a4a54' }}>Total tasks tracked</span>
            <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:15, fontWeight:700 }}>{all.length}</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div ref={heroRef} className={`card`} style={{ padding:'28px 32px', marginBottom:20, background:'linear-gradient(135deg,#fff,#fafafa)', border:'1.5px solid rgba(0,0,0,0.15)' }}>
        <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:6 }}>🔮 Critical Path Engine — Projected Launch</div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:56, letterSpacing:3, lineHeight:1, color:isAhead?'#1a7a45':'#c0392b' }}>{fmt(projLaunch)}</div>
        <div style={{ fontSize:14, fontFamily:'JetBrains Mono,monospace', margin:'6px 0 16px', fontWeight:500, color:isAhead?'#1a7a45':'#c0392b' }}>
          {isAhead ? `✓  ${gap} days ahead of target (${fmt(cfg.launchDate)})` : `⚠  ${Math.abs(gap)} days BEHIND target`}
        </div>
        <div style={{ maxWidth:660 }}>
          <div style={{ height:10, background:'#e4e4ea', borderRadius:5, position:'relative' }}>
            <div style={{ width:`${todayPct}%`, height:'100%', borderRadius:5, background:isAhead?'#1a7a45':'#c0392b' }}/>
            <div style={{ position:'absolute', top:-3, left:`${targetPct}%`, width:2.5, height:16, background:'#b8860b', borderRadius:2 }}/>
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:5, fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#7a7a88' }}>
            <span>{fmt(cfg.startDate)} — Start</span>
            <span style={{ color:'#b8860b' }}>◆ Target: {fmt(cfg.launchDate)}</span>
            <span style={{ color:isAhead?'#1a7a45':'#c0392b' }}>Projected: {fmt(projLaunch)}</span>
          </div>
        </div>
        {cp.length>0 && (
          <div style={{ marginTop:12 }}>
            <div style={{ fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:6 }}>⚡ Critical Path:</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {cp.slice(0,8).map(id=><span key={id} style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', padding:'3px 9px', borderRadius:4, background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', color:'#c0392b' }}>⚡ {tasks[id]?.name||id}</span>)}
              {cp.length>8&&<span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', padding:'3px 9px', borderRadius:4, background:'rgba(192,57,43,0.08)', border:'1px solid rgba(192,57,43,0.2)', color:'#c0392b' }}>+{cp.length-8} more</span>}
            </div>
          </div>
        )}
        <div style={{ display:'flex', gap:24, marginTop:18, flexWrap:'wrap' }}>
          {[['Days to Target',dtt,'#b8860b'],[isAhead?'Days Buffer':'Days Behind',Math.abs(gap),isAhead?'#1a7a45':'#c0392b'],['Done',done,'#1a7a45'],['In Progress',wip,'#c47d0e'],['Blocked',blk,'#c0392b'],['Overall',`${pct}%`,'#0d0d0f']].map(([lbl,val,col])=>(
            <div key={lbl} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:30, lineHeight:1, color:col }}>{val}</div>
              <div style={{ fontSize:10, textTransform:'uppercase', letterSpacing:1.5, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginTop:2 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Task table */}
      <div style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.09)', borderRadius:8, overflow:'hidden' }}>
        {/* Toolbar */}
        <div style={{ background:'#f0f0f3', padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1.5px solid rgba(0,0,0,0.09)', flexWrap:'wrap', gap:8 }}>
          <span style={{ fontSize:14, fontWeight:500 }}>All Tasks — <span style={{ color:'#b8860b' }}>{all.length}</span> in <span style={{ color:'#b8860b' }}>{PARENT_GROUPS.length}</span> groups</span>
          <div style={{ display:'flex', gap:7, flexWrap:'wrap', alignItems:'center' }}>
            <button className="btn btn-ghost btn-sm" onClick={expandAll}>Expand All</button>
            <button className="btn btn-ghost btn-sm" onClick={collapseAll}>Collapse All</button>
            <select className="input" value={filterTeam} onChange={e=>setFilterTeam(e.target.value)} style={{ width:110, padding:'5px 10px', fontSize:11 }}>
              <option value="">All Teams</option>
              {Object.entries(TEAMS).filter(([k])=>k!=='admin').map(([k,t])=><option key={k} value={k}>{t.name}</option>)}
            </select>
            <select className="input" value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ width:130, padding:'5px 10px', fontSize:11 }}>
              <option value="">All Status</option>
              {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.lbl}</option>)}
            </select>
            <select className="input" value={filterPriority} onChange={e=>setFilterPriority(e.target.value)} style={{ width:110, padding:'5px 10px', fontSize:11 }}>
              <option value="">All Priority</option>
              <option value="P1">P1 Urgent</option>
              <option value="P2">P2 High</option>
              <option value="P3">P3</option>
            </select>
            <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#4a4a54', cursor:'pointer' }}>
              <input type="checkbox" checked={filterCrit} onChange={e=>setFilterCrit(e.target.checked)}/> Critical only
            </label>
          </div>
        </div>

        {/* Column header */}
        <div style={{ display:'grid', gridTemplateColumns:'42px 26px 1fr 90px 90px 80px 80px 60px 90px 110px 80px', gap:6, padding:'9px 16px', fontSize:10, letterSpacing:1.2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', fontWeight:500, background:'#f0f0f3', borderBottom:'1.5px solid rgba(0,0,0,0.12)' }}>
          <div>Pri</div><div>#</div><div>Task</div><div>Team</div><div>Category</div><div>Planned</div><div>Projected</div><div>Float</div><div>Progress</div><div>Status</div><div>Updated</div>
        </div>

        {/* Groups */}
        {PARENT_GROUPS.map(g => {
          if(filterTeam && g.team!==filterTeam) return null;
          const children = g.children.map(id=>tasks[id]).filter(Boolean).filter(t=>{
            if(filterStatus && t.status!==filterStatus) return false;
            if(filterCrit && !ct?.[t.id]?.isCritical) return false;
            if(filterPriority && priorities[t.id]!==filterPriority) return false;
            return true;
          });
          if((filterStatus||filterCrit||filterPriority) && !children.length) return null;
          const prog = calcGroupProgress(g, tasks);
          const isCol = collapsed[g.id] !== false;
          const hasCrit = children.some(t=>ct?.[t.id]?.isCritical);

          return (
            <div key={g.id}>
              {/* Parent row */}
              <div style={{ display:'grid', gridTemplateColumns:'42px 26px 1fr 90px 90px 80px 80px 60px 90px 110px 80px', gap:6, padding:'10px 16px', background:'#f0f0f3', borderLeft:`3px solid ${hasCrit?'#c0392b':'#b8860b'}`, borderBottom:'1.5px solid rgba(0,0,0,0.09)', alignItems:'center' }}>
                <div/>
                <div><button onClick={()=>toggleGroup(g.id)} style={{ width:22, height:22, borderRadius:4, background:'#e4e4ea', border:'none', cursor:'pointer', fontSize:11, display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#4a4a54' }}>{isCol?'▶':'▼'}</button></div>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ fontSize:15 }}>{g.icon}</span>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15 }}>{g.name}</div>
                      <div style={{ fontSize:11, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginTop:1 }}>{prog.done}/{prog.total} complete</div>
                    </div>
                  </div>
                  <div style={{ height:5, background:'#e4e4ea', borderRadius:3, overflow:'hidden', marginTop:4, maxWidth:200 }}>
                    <div style={{ width:`${prog.pct}%`, height:'100%', background:'linear-gradient(90deg,#b8860b,#d4a843)', borderRadius:3, transition:'width .4s' }}/>
                  </div>
                </div>
                <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:TEAMS[g.team]?.color, display:'inline-block' }}/>
                  {TEAMS[g.team]?.name}
                </div>
                <div><span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', padding:'2px 7px', borderRadius:3, background:'#e4e4ea', color:'#4a4a54' }}>{CATS[g.category]||g.category}</span></div>
                <div>—</div><div>—</div><div>—</div>
                <div><span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:13, fontWeight:700, color:prog.pct>=70?'#1a7a45':prog.pct>=30?'#c47d0e':'#c0392b' }}>{prog.pct}%</span></div>
                <div>{badge(prog.status)}</div>
                <div/>
              </div>

              {/* Child rows */}
              {!isCol && children.sort((a,b)=>{
                const pa=priorities[a.id]==='P1'?0:priorities[a.id]==='P2'?1:2;
                const pb=priorities[b.id]==='P1'?0:priorities[b.id]==='P2'?1:2;
                if(pa!==pb)return pa-pb;
                const ac=ct?.[a.id]?.isCritical?0:1,bc=ct?.[b.id]?.isCritical?0:1;
                return ac-bc;
              }).map((t,i)=>{
                const ct2=ct?.[t.id]; const fl=ct2?.float??null; const isCrit=ct2?.isCritical;
                const pri=priorities[t.id]; const ce=canEdit(t.team);
                const isQE=qeOpen===t.id;
                return (
                  <div key={t.id} style={{ borderBottom:'1.5px solid rgba(0,0,0,0.06)' }}>
                    <div data-task-id={t.id} style={{ display:'grid', gridTemplateColumns:'42px 26px 1fr 90px 90px 80px 80px 60px 90px 110px 80px', gap:6, padding:'10px 16px', background:'#fff', borderLeft:`3px solid ${isCrit?'#c0392b':'rgba(0,0,0,0.09)'}`, alignItems:'center', cursor:'pointer' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(0,0,0,0.01)'}
                      onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                      <div><PriBadge p={pri}/></div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#7a7a88', paddingLeft:6 }}>{i+1}</div>
                      <div style={{ paddingLeft:16 }}>
                        {/* Inline name edit */}
                        {editingTask===t.id ? (
                          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                            <input autoFocus defaultValue={t.name} id={`ne-${t.id}`} style={{ flex:1, background:'#fff', border:'1.5px solid #b8860b', borderRadius:4, padding:'3px 8px', fontSize:14, fontWeight:500, outline:'none' }}
                              onKeyDown={e=>{ if(e.key==='Enter'){saveField(t.id,'name',e.target.value);setEditingTask(null);} if(e.key==='Escape')setEditingTask(null); }}/>
                            <button onClick={e=>{e.stopPropagation();const v=document.getElementById(`ne-${t.id}`).value.trim();if(v){saveField(t.id,'name',v);}setEditingTask(null);}} style={{ padding:'3px 10px', background:'#b8860b', color:'#fff', border:'none', borderRadius:4, fontSize:11, fontWeight:700, cursor:'pointer' }}>Save</button>
                            <button onClick={e=>{e.stopPropagation();setEditingTask(null);}} style={{ padding:'3px 8px', background:'#e4e4ea', border:'none', borderRadius:4, fontSize:11, cursor:'pointer', color:'#4a4a54' }}>✕</button>
                          </div>
                        ) : (
                          <div>
                            <span onClick={e=>{e.stopPropagation();if(ce)setEditingTask(t.id);}} style={{ fontWeight:500, fontSize:14, cursor:ce?'text':'default', borderRadius:4, padding:'2px 5px', border:'1px dashed transparent', transition:'all .12s' }}
                              onMouseEnter={e=>{ if(ce)e.target.style.borderColor='rgba(184,134,11,0.4)'; e.target.style.background='rgba(184,134,11,0.06)'; }}
                              onMouseLeave={e=>{ e.target.style.borderColor='transparent'; e.target.style.background='transparent'; }}>
                              {t.name}
                            </span>
                            {ce && <button onClick={e=>{e.stopPropagation();setQeOpen(isQE?null:t.id);}} style={{ marginLeft:8, padding:'1px 7px', fontSize:10, borderRadius:3, border:'1px solid rgba(0,0,0,0.09)', background:'#f0f0f3', color:'#7a7a88', cursor:'pointer', fontFamily:'JetBrains Mono,monospace' }}>✎ edit</button>}
                          </div>
                        )}
                        <div style={{ fontSize:11, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginTop:2 }}>{t.duration}d{isCrit?' · ⚡ Critical':''}</div>
                      </div>
                      <div style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:4 }}>
                        <span style={{ width:8, height:8, borderRadius:'50%', background:TEAMS[t.team]?.color, display:'inline-block', flexShrink:0 }}/>
                        {TEAMS[t.team]?.name}
                      </div>
                      <div><span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', padding:'2px 7px', borderRadius:3, background:'#f0f0f3', color:'#4a4a54' }}>{CATS[t.category]||t.category}</span></div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12 }}>{fmts(t.plannedEnd)||'—'}</div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:isCrit?'#c0392b':'#4a4a54' }}>{fmts(ct2?.ef)||'—'}</div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:fl===null?'#7a7a88':fl<0?'#c0392b':fl<7?'#c47d0e':'#1a7a45' }}>{fl!==null?fl+'d':'—'}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div className="pw" style={{ width:52 }}><div className={`pf ${t.status==='done'?'pf-g':'pf-a'}`} style={{ width:`${t.status==='done'?100:(t.completion||0)}%` }}/></div>
                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12 }}>{t.status==='done'?100:(t.completion||0)}%</span>
                      </div>
                      <div>{badge(t.status)}</div>
                      <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:'#7a7a88' }}>{t.lastUpdated?fmts(new Date(t.lastUpdated)):'—'}</div>
                    </div>

                    {/* Quick Edit Bar */}
                    {isQE && ce && <QuickEditBar task={t} onSave={data=>saveQE(t.id,data)} onClose={()=>setQeOpen(null)} />}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function QuickEditBar({ task:t, onSave, onClose }) {
  const [name,setName]=useState(t.name||'');
  const [assignee,setAssignee]=useState(t.assignee||'');
  const [duration,setDuration]=useState(t.duration||0);
  const [completion,setCompletion]=useState(t.completion||0);
  const [status,setStatus]=useState(t.status||'not_started');
  const [plannedStart,setPlannedStart]=useState(fiso(t.plannedStart));
  const [plannedEnd,setPlannedEnd]=useState(fiso(t.plannedEnd));
  const [actualStart,setActualStart]=useState(fiso(t.actualStart));
  const [actualEnd,setActualEnd]=useState(fiso(t.actualEnd));
  const [vendor,setVendor]=useState(t.vendor||'');
  const [poNumber,setPoNumber]=useState(t.poNumber||'');
  const [notes,setNotes]=useState(t.notes||'');

  const fields = [
    ['Task name',name,setName,'text','flex:2;min-width:180px'],
    ['Assignee',assignee,setAssignee,'text','min-width:120px'],
    ['Duration (days)',duration,v=>setDuration(Number(v)),'number','width:80px'],
    ['Completion %',completion,v=>setCompletion(Number(v)),'number','width:80px'],
    ['Vendor',vendor,setVendor,'text','min-width:120px'],
    ['PO Number',poNumber,setPoNumber,'text','min-width:120px'],
    ['Notes',notes,setNotes,'text','flex:2;min-width:160px'],
  ];

  return (
    <div style={{ background:'#f0f0f3', borderTop:'1.5px solid rgba(0,0,0,0.09)', padding:'12px 16px 14px 42px', display:'flex', flexWrap:'wrap', gap:10, alignItems:'flex-end' }}>
      {fields.map(([lbl,val,setter,type,style])=>(
        <div key={lbl} style={{ display:'flex', flexDirection:'column', gap:3, ...Object.fromEntries((style||'').split(';').filter(Boolean).map(s=>s.split(':').map(x=>x.trim())).filter(([k])=>k)) }}>
          <span style={{ fontSize:10, fontWeight:500, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, textTransform:'uppercase' }}>{lbl}</span>
          <input type={type} value={val} onChange={e=>setter(e.target.value)} className="input" style={{ padding:'5px 9px', fontSize:12 }}/>
        </div>
      ))}
      {/* Status */}
      <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
        <span style={{ fontSize:10, fontWeight:500, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, textTransform:'uppercase' }}>Status</span>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="input" style={{ padding:'5px 9px', fontSize:12, width:130 }}>
          {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.lbl}</option>)}
        </select>
      </div>
      {/* Dates */}
      {[['Planned Start',plannedStart,setPlannedStart],['Planned End',plannedEnd,setPlannedEnd],['Actual Start',actualStart,setActualStart],['Actual End',actualEnd,setActualEnd]].map(([lbl,val,setter])=>(
        <div key={lbl} style={{ display:'flex', flexDirection:'column', gap:3 }}>
          <span style={{ fontSize:10, fontWeight:500, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', letterSpacing:1, textTransform:'uppercase' }}>{lbl}</span>
          <input type="date" value={val} onChange={e=>setter(e.target.value)} className="input" style={{ padding:'5px 9px', fontSize:12 }}/>
        </div>
      ))}
      <button className="btn btn-gold btn-sm" onClick={()=>onSave({name,assignee,duration:Number(duration),completion:Number(completion),status,plannedStart:plannedStart||null,plannedEnd:plannedEnd||null,actualStart:actualStart||null,actualEnd:actualEnd||null,vendor,poNumber,notes})}>Save all</button>
      <button className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
    </div>
  );
}
