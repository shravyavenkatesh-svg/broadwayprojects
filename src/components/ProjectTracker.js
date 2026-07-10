// src/components/ProjectTracker.js
// Tracks progress of each WBS item across GFC → Procurement → Manufacturing → Handover

import { useState } from 'react';
import { ref as dbRef, set, update } from 'firebase/database';
import { db } from '../firebase';

const PID = 'main';

// ── WBS Structure from Projects sheet ────────────────────────────────────────
const WBS_GROUPS = [
  { id: 'prop', name: 'Property Readiness & Statutory Compliance', items: [
    'Advance Rental', 'Lease Registration Charges', 'Lease Stamp Duty',
    'Brokerage / Property Consultant Fee', 'Legal & Due Diligence Fees',
    'Property Taxes / Local Levies', 'Statutory Approvals & NOCs',
    'Insurance (During Fit-out)', 'Temporary Power Connection Charges',
    'Water & Drainage Connection Fees', 'Site Survey and As-Built Drawings',
  ]},
  { id: 'civil', name: 'Civil & Interiors', items: [
    'Demolition', 'Escalators / Lift / Staircase (Vertical Circulation)',
    'Glazing, Sliding Door and Store Front Facade / Portal',
    'Fabrication — Railing, Rolling Shutter', 'Toilet Civil Works',
    'Flooring / Tiles and Floor Covering', 'False Ceiling', 'POP and Putty',
    'In-Store Skin Finishes & Internal Painting', 'Partition and Cladding',
    'Site Carpentry, Trial Rooms, False Flooring', 'PCC Platform for DG',
    'Deep Cleaning & Polishing', 'Core Cutting & Openings',
    'Pest Control / Anti-Termite Treatment', 'PCC & Floor Base Works',
    'Waterproofing', 'Masonry Works & Plaster Works',
    'ACP & Facade Works', 'Metal Fabrication',
    'Partition Works / Drywall & Cladding / Carpentry and Joinery',
    'Doors & Hardware', 'Escalator & Staircase Civil Interface', 'Deep Cleaning & Handover',
  ]},
  { id: 'struct', name: 'Structural Steel', items: [
    'CWIP — Structural Works, Demolition',
  ]},
  { id: 'hvac', name: 'HVAC', items: [
    'High Side — Machines', 'Low Side — Ducting, Grills etc.',
    'Exhaust, Fresh Air System', 'Diffusers / Grilles / Dampers',
    'Insulation / Refrigerant Piping / Condensate Drainage',
    'Ventilation Accessories', 'Controls & BMS Interface',
    'Testing & Commissioning', 'HVAC Consumables',
  ]},
  { id: 'elec', name: 'Electricals', items: [
    'Wiring, DB and Panels (Conduit, Power, Data, Cable Tray)',
    'High Side Electrical Cabling / Earthing', 'DG Sets with Auto Change Over System',
    'Main LT Panels', 'Distribution Boards', 'Cable Tray & Raceway',
    'Conduit Works', 'Power Cabling', 'Wiring', 'Earthing System',
    'Power Sockets', 'Isolators & Switchgear', 'DG Integration', 'UPS Integration',
    'Signage Power', 'Equipment Power', 'Testing & Commissioning', 'Electrical Consumables',
  ]},
  { id: 'plumb', name: 'Plumbing', items: [
    'Water Supply Line / Tap-off', 'Drain Line', 'Sanitary Fixtures',
    'Pump or Pressure System', 'Drainage System', 'Sewer Connection',
    'Overhead / Underground Tanks', 'CP Fittings', 'Hot Water System',
    'Floor Drains', 'Pipe Supports', 'Waterproof Testing', 'Testing & Commissioning',
  ]},
  { id: 'light', name: 'Light Fixtures', items: [
    'Light Fixtures, Emergency Lights', 'Decorative, Stage Lighting',
  ]},
  { id: 'fire', name: 'Fire Fighting Services (FFS) & SLP', items: [
    'Check Points / Sensomatic', 'RFID & Tag Smart POS',
    'Sprinkler System (Low Side)', 'Fire Extinguishers / Hose Reels',
    'Emergency Exit Signage',
  ]},
  { id: 'av', name: 'Audio & Video', items: [
    'Display Screens / Digital Signage',
    'Active LED Screens and Media Player', 'Music / PA System',
  ]},
  { id: 'it', name: 'IT', items: [
    'Inverter', 'UPS', 'Data and Networking', 'CCTV System',
    'Access Control System', 'IOT (Automation & Monitoring)',
    'Software', 'Printing',
  ]},
  { id: 'fnf', name: 'Fixtures & Furniture', items: [
    'Furniture Fixtures + Loose Furniture (SPIN)',
  ]},
  { id: 'vm', name: 'VM', items: [
    'In-Store VM, Props and Negative Areas', 'Mannequins', 'Rugs / Carpets',
  ]},
  { id: 'boh', name: 'BOH Furniture & Equipment', items: [
    'POS Machine & Scanner', 'Printers & Peripherals', "Server & Office PC's",
  ]},
  { id: 'consult', name: 'Consultants', items: [
    'Concept Design', 'Interior GFC Design', 'MEP Consultancy',
    'Construction Management / PMC',
  ]},
  { id: 'misc', name: 'Others / Miscellaneous', items: [
    'Bought Out / Miscellaneous',
  ]},
];

const STAGE_STATUS = ['—', 'Not Started', 'In Progress', 'Done', 'On Hold', 'Blocked'];
const STATUS_STYLE = {
  '—':           { color:'#999', bg:'#fff',     border:'#ddd' },
  'Not Started': { color:'#000', bg:'#f5f5f5',  border:'#ccc' },
  'In Progress': { color:'#000', bg:'#e8e8e8',  border:'#000' },
  'Done':        { color:'#fff', bg:'#000',     border:'#000' },
  'On Hold':     { color:'#000', bg:'#fff',     border:'#000', fontStyle:'italic' },
  'Blocked':     { color:'#fff', bg:'#555',     border:'#555' },
};

// Track columns per phase
const PHASES = [
  { key:'gfc',      label:'GFC / Shop Drawings',         cols:['GFC Drawings','Vendor Shop Drawings','Consultant Approvals','Costing / BOQ'] },
  { key:'proc',     label:'Procurement',                  cols:['Commercial Comparison','Vendor Shortlisting','PO Released','Order No.','Amount (₹)','Payment %'] },
  { key:'mfg',      label:'Manufacturing',                cols:['Production Lead','Factory QC','Dispatch Status','ETA on Site'] },
  { key:'handover', label:'Fit-out / Handover',           cols:['Installation','T&C','Visual Snagging','Snagging Closed'] },
];

const makeKey = (groupId, item) => `${groupId}__${item.replace(/[^a-zA-Z0-9]/g,'_').slice(0,40)}`;

export default function ProjectTracker({ projectData = {}, team, userName }) {
  const [collapsed, setCollapsed] = useState({});
  const [activePhase, setActivePhase] = useState('gfc');
  const [editCell, setEditCell] = useState(null); // {key, col}
  const [saving, setSaving] = useState(false);

  const isAdmin = team === 'admin';
  const phase = PHASES.find(p => p.key === activePhase);

  const getValue = (key, col) => projectData?.[key]?.[col] || '';

  const setValue = async (key, col, val) => {
    setSaving(true);
    await update(dbRef(db, `p/${PID}/projectTracker/${key}`), { [col]: val, updatedBy: userName, updatedAt: Date.now() });
    setSaving(false);
    setEditCell(null);
  };

  const toggleGroup = (id) => setCollapsed(c => ({ ...c, [id]: !c[id] }));

  const getRowCompletion = (key) => {
    const allCols = PHASES.flatMap(p => p.cols.filter(c => !['Order No.','Amount (₹)','Payment %'].includes(c)));
    const filled = allCols.filter(c => {
      const v = getValue(key, c);
      return v === 'Done';
    }).length;
    return Math.round((filled / allCols.length) * 100);
  };

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      {saving && <div style={{ position:'fixed', top:16, right:16, background:'#000', color:'#fff', padding:'6px 14px', borderRadius:4, fontSize:12, zIndex:999 }}>Saving…</div>}

      {/* Phase tabs */}
      <div style={{ display:'flex', gap:0, marginBottom:20, borderBottom:'2px solid #000' }}>
        {PHASES.map(p => (
          <button key={p.key} onClick={() => setActivePhase(p.key)}
            style={{ padding:'10px 20px', fontSize:12, fontFamily:'JetBrains Mono,monospace', fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', cursor:'pointer', border:'none', borderBottom: activePhase===p.key ? '3px solid #000' : '3px solid transparent', background:'#fff', color: activePhase===p.key ? '#000' : '#666', marginBottom:-2 }}>
            {p.label}
          </button>
        ))}
        <div style={{ flex:1 }} />
        <div style={{ fontSize:11, color:'#999', fontFamily:'JetBrains Mono,monospace', alignSelf:'center', paddingRight:4 }}>
          Click any cell to update · {Object.keys(projectData).length} rows tracked
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:12 }}>
          <thead>
            <tr style={{ background:'#000', color:'#fff' }}>
              <th style={{ padding:'10px 14px', textAlign:'left', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', width:40, whiteSpace:'nowrap' }}>WBS</th>
              <th style={{ padding:'10px 14px', textAlign:'left', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', minWidth:220 }}>Item</th>
              <th style={{ padding:'10px 14px', textAlign:'center', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', width:70 }}>Overall</th>
              {phase.cols.map(col => (
                <th key={col} style={{ padding:'10px 14px', textAlign:'center', fontFamily:'JetBrains Mono,monospace', fontSize:10, letterSpacing:1.2, textTransform:'uppercase', minWidth:120, whiteSpace:'nowrap' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {WBS_GROUPS.map(g => (
              <>
                {/* Group header */}
                <tr key={g.id} style={{ background:'#f0f0f0', cursor:'pointer' }} onClick={() => toggleGroup(g.id)}>
                  <td colSpan={3 + phase.cols.length} style={{ padding:'9px 14px', fontWeight:700, fontSize:13, borderBottom:'1.5px solid #000', userSelect:'none', display:'table-cell' }}>
                    <span style={{ marginRight:10, fontFamily:'JetBrains Mono,monospace' }}>{collapsed[g.id] ? '▶' : '▼'}</span>
                    {g.name}
                    <span style={{ marginLeft:12, fontSize:11, fontWeight:400, color:'#666', fontFamily:'JetBrains Mono,monospace' }}>{g.items.length} items</span>
                  </td>
                </tr>

                {/* Item rows */}
                {!collapsed[g.id] && g.items.map((item, idx) => {
                  const key = makeKey(g.id, item);
                  const pct = getRowCompletion(key);
                  return (
                    <tr key={key} style={{ borderBottom:'1px solid #e8e8e8', background: idx%2===0 ? '#fff' : '#fafafa' }}>
                      <td style={{ padding:'9px 14px', color:'#999', fontFamily:'JetBrains Mono,monospace', fontSize:11, textAlign:'center' }}>{idx+1}</td>
                      <td style={{ padding:'9px 14px', fontWeight:500, color:'#000' }}>{item}</td>
                      <td style={{ padding:'9px 14px', textAlign:'center' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:4, justifyContent:'center' }}>
                          <div style={{ width:40, height:5, background:'#e8e8e8', borderRadius:2, overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background:'#000', borderRadius:2 }}/>
                          </div>
                          <span style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:'#666' }}>{pct}%</span>
                        </div>
                      </td>
                      {phase.cols.map(col => {
                        const val = getValue(key, col);
                        const isEditing = editCell?.key === key && editCell?.col === col;
                        const isTextCol = ['Order No.','Amount (₹)','Payment %'].includes(col);
                        const st = STATUS_STYLE[val] || STATUS_STYLE['—'];

                        return (
                          <td key={col} style={{ padding:'6px 10px', textAlign:'center' }}>
                            {isEditing ? (
                              isTextCol ? (
                                <input autoFocus defaultValue={val}
                                  style={{ width:'100%', border:'1.5px solid #000', padding:'4px 8px', fontSize:12, fontFamily:'JetBrains Mono,monospace', outline:'none' }}
                                  onBlur={e => setValue(key, col, e.target.value)}
                                  onKeyDown={e => { if(e.key==='Enter') setValue(key,col,e.target.value); if(e.key==='Escape') setEditCell(null); }}/>
                              ) : (
                                <select autoFocus defaultValue={val}
                                  style={{ width:'100%', border:'1.5px solid #000', padding:'4px', fontSize:11, fontFamily:'JetBrains Mono,monospace', outline:'none', cursor:'pointer' }}
                                  onChange={e => setValue(key, col, e.target.value)}
                                  onBlur={() => setEditCell(null)}>
                                  {STAGE_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              )
                            ) : (
                              <div onClick={() => setEditCell({ key, col })}
                                style={{ padding:'4px 10px', borderRadius:3, fontSize:11, fontFamily:'JetBrains Mono,monospace', cursor:'pointer', display:'inline-block', minWidth:90, border:`1px solid ${st.border}`, background:st.bg, color:st.color, fontStyle:st.fontStyle||'normal', whiteSpace:'nowrap' }}>
                                {val || '—'}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
