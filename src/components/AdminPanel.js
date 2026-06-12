// src/components/AdminPanel.js
import { ref as dbRef, update, set } from 'firebase/database';
import { db } from '../firebase';
import { TEAMS } from '../constants';
import { fmts } from '../utils';

const PID = 'main';

export default function AdminPanel({ users, cfg, setCfg, team, userName, emailCfg = {} }) {
  if(team!=='admin') return <div style={{ padding:48, textAlign:'center', color:'#7a7a88' }}>Admin access only.</div>;

  const userList = Object.entries(users||{});
  const unassigned = userList.filter(([,u])=>!u.team);

  const assignTeam = async (uid, t) => {
    if(!t)return;
    await update(dbRef(db, `users/${uid}`), { team:t, assignedAt:Date.now() });
  };

  const saveSettings = async (field, val) => {
    await update(dbRef(db, `p/${PID}/settings`), { [field]:val });
    if(field==='projectName') setCfg(c=>({...c,projectName:val}));
    if(field==='startDate') setCfg(c=>({...c,startDate:val}));
    if(field==='targetDate') setCfg(c=>({...c,launchDate:val}));
  };

  const saveEmailCfg = async () => {
    const cfg = {
      adminEmail: document.getElementById('ec-email')?.value?.trim(),
      whatsappPhone: document.getElementById('ec-whatsapp')?.value?.trim(),
      publicKey: document.getElementById('ec-key')?.value?.trim(),
      serviceId: document.getElementById('ec-svc')?.value?.trim(),
      poTemplate: document.getElementById('ec-t2')?.value?.trim(),
      newUserTemplate: document.getElementById('ec-t1')?.value?.trim(),
    };
    await set(dbRef(db, 'emailConfig'), cfg);
    if(cfg.publicKey && window.emailjs){
      try { window.emailjs.init({ publicKey: cfg.publicKey }); } catch(e) {}
    }
    alert('Notification settings saved!');
  };

  return (
    <div>
      {unassigned.length>0 && (
        <div style={{ background:'rgba(196,125,14,0.08)', border:'1.5px solid rgba(196,125,14,0.25)', borderRadius:8, padding:'14px 18px', marginBottom:16, display:'flex', gap:14, alignItems:'flex-start' }}>
          <span style={{ fontSize:20 }}>👤</span>
          <div>
            <div style={{ fontWeight:700, color:'#c47d0e', fontSize:15 }}>{unassigned.length} user{unassigned.length>1?'s':''} waiting for team assignment</div>
            <div style={{ fontSize:13, color:'#4a4a54', marginTop:3 }}>Assign their teams below to grant access.</div>
          </div>
        </div>
      )}

      {/* User management */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>👥 User Management</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 110px 130px', gap:10, padding:'8px 14px', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', background:'#f0f0f3', borderBottom:'1.5px solid rgba(0,0,0,0.09)' }}>
          <div>User</div><div>Team</div><div>Joined</div><div>Assign</div>
        </div>
        {userList.map(([uid,u])=>(
          <div key={uid} style={{ display:'grid', gridTemplateColumns:'1fr 130px 110px 130px', gap:10, padding:'12px 14px', borderBottom:'1px solid rgba(0,0,0,0.05)', alignItems:'center', background:!u.team?'rgba(196,125,14,0.03)':'transparent' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>{u.displayName||'—'}{!u.team?' ⏳':''}</div>
              <div style={{ fontSize:12, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace' }}>{u.email}</div>
            </div>
            <div>{u.team ? <span style={{ fontSize:12, fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8,height:8,borderRadius:'50%',background:TEAMS[u.team]?.color,display:'inline-block' }}/>{TEAMS[u.team]?.name}</span> : <span style={{ fontSize:12, color:'#c47d0e', fontWeight:500 }}>Unassigned</span>}</div>
            <div style={{ fontSize:12, fontFamily:'JetBrains Mono,monospace', color:'#7a7a88' }}>{u.createdAt?fmts(new Date(u.createdAt)):'—'}</div>
            <div>
              <select className="input" defaultValue={u.team||''} onChange={e=>assignTeam(uid,e.target.value)} style={{ padding:'5px 8px', fontSize:12, width:120 }}>
                <option value="">Assign…</option>
                {Object.entries(TEAMS).filter(([k])=>k!=='admin').map(([k,t])=><option key={k} value={k}>{t.name}</option>)}
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
        {userList.length===0 && <div style={{ padding:20, textAlign:'center', color:'#7a7a88', fontSize:14 }}>No users yet.</div>}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        {/* Project Settings */}
        <div className="card">
          <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>⚙ Project Settings</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Project Name</label>
              <input className="input" defaultValue={cfg.projectName} onBlur={e=>saveSettings('projectName',e.target.value)}/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Fit-out Start Date</label>
              <input type="date" className="input" defaultValue={cfg.startDate} onBlur={e=>saveSettings('startDate',e.target.value)}/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Target Launch Date</label>
              <input type="date" className="input" defaultValue={cfg.launchDate} onBlur={e=>saveSettings('targetDate',e.target.value)}/>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card">
          <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>📧 Notification Settings</div>
          <div style={{ fontSize:12, color:'#4a4a54', marginBottom:12, lineHeight:1.6 }}>
            When a PO is submitted, an <strong>email</strong> (via EmailJS) + <strong>WhatsApp</strong> message will be sent to you for approval.
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>Admin Email</label>
              <input className="input" id="ec-email" defaultValue={emailCfg?.adminEmail||''} placeholder="admin@broadwaylive.in"/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>WhatsApp Number</label>
              <input className="input" id="ec-whatsapp" defaultValue={emailCfg?.whatsappPhone||''} placeholder="919876543210"/>
              <div style={{ fontSize:11, color:'#7a7a88', marginTop:3 }}>With country code, no + or spaces (e.g. 919876543210)</div>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>EmailJS Public Key</label>
              <input className="input" id="ec-key" defaultValue={emailCfg?.publicKey||''} placeholder="user_xxxxx"/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>EmailJS Service ID</label>
              <input className="input" id="ec-svc" defaultValue={emailCfg?.serviceId||''} placeholder="service_xxxxx"/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>PO Alert Template ID</label>
              <input className="input" id="ec-t2" defaultValue={emailCfg?.poTemplate||''} placeholder="template_xxxxx"/>
            </div>
            <div>
              <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:4 }}>New User Alert Template ID</label>
              <input className="input" id="ec-t1" defaultValue={emailCfg?.newUserTemplate||''} placeholder="template_xxxxx"/>
            </div>
            <button className="btn btn-gold btn-sm" onClick={saveEmailCfg}>Save Notification Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const PID = 'main';

export default function AdminPanel({ users, cfg, setCfg, team, userName }) {
  if(team!=='admin') return <div style={{ padding:48, textAlign:'center', color:'#7a7a88' }}>Admin access only.</div>;

  const userList = Object.entries(users||{});
  const unassigned = userList.filter(([,u])=>!u.team);

  const assignTeam = async (uid, t) => {
    if(!t)return;
    await update(dbRef(db, `users/${uid}`), { team:t, assignedAt:Date.now() });
  };

  const saveSettings = async (field, val) => {
    const update_ = { [field]:val };
    await update(dbRef(db, `p/${PID}/settings`), update_);
    if(field==='projectName') setCfg(c=>({...c,projectName:val}));
    if(field==='startDate') setCfg(c=>({...c,startDate:val}));
    if(field==='targetDate') setCfg(c=>({...c,launchDate:val}));
  };

  return (
    <div>
      {unassigned.length>0 && (
        <div style={{ background:'rgba(196,125,14,0.08)', border:'1.5px solid rgba(196,125,14,0.25)', borderRadius:8, padding:'14px 18px', marginBottom:16, display:'flex', gap:14, alignItems:'flex-start' }}>
          <span style={{ fontSize:20 }}>👤</span>
          <div>
            <div style={{ fontWeight:700, color:'#c47d0e', fontSize:15 }}>{unassigned.length} user{unassigned.length>1?'s':''} waiting for team assignment</div>
            <div style={{ fontSize:13, color:'#4a4a54', marginTop:3 }}>Assign their teams below to grant access.</div>
          </div>
        </div>
      )}

      {/* User management */}
      <div className="card" style={{ marginBottom:20 }}>
        <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>👥 User Management</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 130px 110px 130px', gap:10, padding:'8px 14px', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', background:'#f0f0f3', borderBottom:'1.5px solid rgba(0,0,0,0.09)' }}>
          <div>User</div><div>Team</div><div>Joined</div><div>Assign</div>
        </div>
        {userList.map(([uid,u])=>(
          <div key={uid} style={{ display:'grid', gridTemplateColumns:'1fr 130px 110px 130px', gap:10, padding:'12px 14px', borderBottom:'1px solid rgba(0,0,0,0.05)', alignItems:'center', background:!u.team?'rgba(196,125,14,0.03)':'transparent' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:600 }}>{u.displayName||'—'}{!u.team?' ⏳':''}</div>
              <div style={{ fontSize:12, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace' }}>{u.email}</div>
            </div>
            <div>{u.team ? <span style={{ fontSize:12, fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8,height:8,borderRadius:'50%',background:TEAMS[u.team]?.color,display:'inline-block' }}/>{TEAMS[u.team]?.name}</span> : <span style={{ fontSize:12, color:'#c47d0e', fontWeight:500 }}>Unassigned</span>}</div>
            <div style={{ fontSize:12, fontFamily:'JetBrains Mono,monospace', color:'#7a7a88' }}>{u.createdAt?fmts(new Date(u.createdAt)):'—'}</div>
            <div>
              <select className="input" defaultValue={u.team||''} onChange={e=>assignTeam(uid,e.target.value)} style={{ padding:'5px 8px', fontSize:12, width:120 }}>
                <option value="">Assign…</option>
                {Object.entries(TEAMS).filter(([k])=>k!=='admin').map(([k,t])=><option key={k} value={k}>{t.name}</option>)}
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        ))}
        {userList.length===0 && <div style={{ padding:20, textAlign:'center', color:'#7a7a88', fontSize:14 }}>No users yet.</div>}
      </div>

      {/* Settings */}
      <div className="card">
        <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>⚙ Project Settings</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Project Name</label>
            <input className="input" defaultValue={cfg.projectName} onBlur={e=>saveSettings('projectName',e.target.value)}/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Fit-out Start Date</label>
            <input type="date" className="input" defaultValue={cfg.startDate} onBlur={e=>saveSettings('startDate',e.target.value)}/>
          </div>
          <div>
            <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Target Launch Date</label>
            <input type="date" className="input" defaultValue={cfg.launchDate} onBlur={e=>saveSettings('targetDate',e.target.value)}/>
          </div>
        </div>
      </div>
    </div>
  );
}
