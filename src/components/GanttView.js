// src/components/GanttView.js
import { CPM, fmt, fmts } from '../utils';
import { TEAMS } from '../constants';

export default function GanttView({ tasks, cfg }) {
  const all = Object.values(tasks);
  if(!all.length) return <div style={{ padding:48, textAlign:'center', color:'#7a7a88' }}>Loading…</div>;
  const r = new CPM(all, cfg.startDate, cfg.launchDate).run();
  const ps = new Date(cfg.startDate||new Date()), pe = r.projLaunch;
  const total = Math.max(1, pe-ps);
  const tPct = n => Math.min(100,Math.max(0,((new Date(n)-ps)/total)*100));
  const todP = tPct(new Date()), tarP = tPct(new Date(cfg.launchDate));
  const TCOL = { legal:'#5b4aaa', projects:'#1a5fa8', design:'#b8860b', vm:'#c47d0e', store:'#1a7a45' };

  return (
    <div className="card" style={{ overflowX:'auto' }}>
      <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>Gantt View — {fmt(ps)} → {fmt(pe)}</div>
      <div style={{ display:'flex', gap:16, marginBottom:14, fontSize:12, fontFamily:'JetBrains Mono,monospace', fontWeight:500 }}>
        <span style={{ color:'#b8860b' }}>◆ Gold line = Target ({fmt(cfg.launchDate)})</span>
        <span style={{ color:'#7a7a88' }}>Today: {fmt(new Date())}</span>
      </div>
      {Object.entries(TEAMS).filter(([k])=>k!=='admin').map(([key,team])=>{
        const tt = all.filter(t=>t.team===key);
        return (
          <div key={key} style={{ marginBottom:14 }}>
            <div style={{ fontSize:10, letterSpacing:2, textTransform:'uppercase', color:TCOL[key], fontFamily:'JetBrains Mono,monospace', fontWeight:600, padding:'6px 0', borderBottom:'1.5px solid rgba(0,0,0,0.09)', marginBottom:4 }}>{team.icon} {team.name}</div>
            {tt.map(t=>{
              const ct=r.tasks[t.id]; if(!ct?.es||!ct?.ef)return null;
              const sp=tPct(ct.es), ep=tPct(ct.ef), wp=Math.max(0.5,ep-sp);
              const col=ct.isCritical?'#c0392b':t.status==='done'?'#1a7a45':TCOL[key];
              return (
                <div key={t.id} style={{ display:'flex', alignItems:'center', gap:8, padding:'5px 0', borderBottom:'1px solid rgba(0,0,0,0.04)' }}>
                  <div style={{ width:220, fontSize:12, flexShrink:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:500 }} title={t.name}>{t.status==='done'?'✓ ':''}{t.name}</div>
                  <div style={{ flex:1, height:18, background:'#e4e4ea', borderRadius:3, position:'relative', overflow:'visible' }}>
                    <div style={{ position:'absolute', top:0, left:`${todP}%`, width:1.5, height:'100%', background:'rgba(0,0,0,0.15)', zIndex:2 }}/>
                    <div style={{ position:'absolute', top:-2, left:`${tarP}%`, width:2, height:22, background:'#b8860b', zIndex:3, borderRadius:1 }}/>
                    <div style={{ position:'absolute', top:2, left:`${sp}%`, width:`${wp}%`, height:14, background:col, borderRadius:2, opacity:t.status==='done'?0.5:0.85, display:'flex', alignItems:'center', paddingLeft:3 }}>
                      <span style={{ fontSize:9, fontFamily:'JetBrains Mono,monospace', color:'rgba(0,0,0,0.75)', whiteSpace:'nowrap' }}>{t.duration}d</span>
                    </div>
                  </div>
                  <span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', color:'#7a7a88', whiteSpace:'nowrap' }}>{fmts(ct.ef)}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
