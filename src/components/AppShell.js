// src/components/AppShell.js
import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { TEAMS } from '../constants';
import Dashboard from './Dashboard';
import FixtureTracker from './FixtureTracker';
import GanttView from './GanttView';
import AdminPanel from './AdminPanel';

const TABS_ADMIN = [['dashboard','Dashboard'],['fixtures','Fixtures'],['gantt','Gantt'],['admin','Admin Panel']];
const TABS_USER  = [['dashboard','Dashboard'],['fixtures','Fixtures'],['gantt','Gantt']];

export default function AppShell({ user, team, userName, cfg, setCfg, tasks, fixtures, pos, users }) {
  const [tab, setTab] = useState('dashboard');
  const [countdown, setCountdown] = useState({ d:'--',h:'--',m:'--',s:'--' });
  const t = TEAMS[team] || TEAMS.admin;

  useEffect(() => {
    const tick = () => {
      const diff = new Date(cfg.launchDate+'T00:00:00') - new Date();
      if(diff<=0){ setCountdown({d:0,h:0,m:0,s:0}); return; }
      setCountdown({
        d: Math.floor(diff/86400000),
        h: Math.floor((diff%86400000)/3600000),
        m: Math.floor((diff%3600000)/60000),
        s: Math.floor((diff%60000)/1000),
      });
    };
    tick(); const id = setInterval(tick,1000);
    return ()=>clearInterval(id);
  },[cfg.launchDate]);

  const tabs = team==='admin' ? TABS_ADMIN : TABS_USER;

  const renderTab = () => {
    if(tab==='dashboard') return <Dashboard tasks={tasks} cfg={cfg} team={team} userName={userName} />;
    if(tab==='fixtures')  return <FixtureTracker fixtures={fixtures} team={team} userName={userName} />;
    if(tab==='gantt')     return <GanttView tasks={tasks} cfg={cfg} />;
    if(tab==='admin')     return <AdminPanel users={users} pos={pos} cfg={cfg} setCfg={setCfg} team={team} userName={userName} />;
  };

  const pad = n => String(n).padStart(2,'0');

  return (
    <div style={{ minHeight:'100vh', background:'#f4f4f6' }}>
      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1.5px solid rgba(0,0,0,0.09)', padding:'11px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:22, letterSpacing:2.5 }}>{cfg.projectName||'Broadway'}</span>
          <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, padding:'3px 10px', border:'1px solid rgba(0,0,0,0.09)', borderRadius:4, color:'#7a7a88' }}>Launch: {cfg.launchDate}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {/* Countdown */}
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#f0f0f3', border:'1.5px solid rgba(0,0,0,0.18)', borderRadius:8, padding:'8px 16px' }}>
            {[['d','DAYS'],['h','HRS'],['m','MIN'],['s','SEC']].map(([k,lbl],i)=>(
              <div key={k} style={{ display:'flex', alignItems:'center', gap:8 }}>
                {i>0 && <span style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:28, color:'#7a7a88', paddingBottom:10 }}>:</span>}
                <div style={{ textAlign:'center' }}>
                  <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:36, lineHeight:1, color:k==='d'?'#b8860b':'#0d0d0f', minWidth:40 }}>{k==='d'?countdown[k]:pad(countdown[k])}</div>
                  <div style={{ fontSize:9, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', letterSpacing:1.5 }}>{lbl}</div>
                </div>
              </div>
            ))}
            <div style={{ marginLeft:10, paddingLeft:14, borderLeft:'1.5px solid rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize:9, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', letterSpacing:1.2, marginBottom:3 }}>LAUNCH</div>
              <div style={{ fontSize:13, fontFamily:'JetBrains Mono,monospace', color:'#b8860b', fontWeight:700 }}>25 SEP 2026</div>
            </div>
          </div>
          <span style={{ fontSize:11, fontFamily:'JetBrains Mono,monospace', fontWeight:600, padding:'3px 10px', borderRadius:20, border:`1.5px solid ${t.color}`, color:t.color, background:`${t.color}18` }}>{t.icon} {t.name}</span>
          <span style={{ fontSize:13, color:'#4a4a54', fontWeight:500 }}>{userName}</span>
          <button className="btn btn-ghost btn-sm" onClick={()=>signOut(auth)}>Sign Out</button>
        </div>
      </div>

      {/* Nav */}
      <div style={{ display:'flex', borderBottom:'1.5px solid rgba(0,0,0,0.09)', padding:'0 28px', background:'#fff', overflowX:'auto' }}>
        {tabs.map(([id,lbl])=>(
          <div key={id} onClick={()=>setTab(id)} style={{ padding:'11px 18px', cursor:'pointer', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', fontFamily:'JetBrains Mono,monospace', fontWeight:500, color:tab===id?'#b8860b':'#7a7a88', borderBottom:`2.5px solid ${tab===id?'#b8860b':'transparent'}`, whiteSpace:'nowrap', transition:'all .15s' }}>
            {lbl}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ padding:'24px 28px', maxWidth:1440, margin:'0 auto' }}>
        {renderTab()}
      </div>
    </div>
  );
}
