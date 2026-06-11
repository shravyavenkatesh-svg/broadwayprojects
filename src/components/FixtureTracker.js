// src/components/FixtureTracker.js
export default function FixtureTracker({ fixtures, team }) {
  const all = Object.values(fixtures);
  return (
    <div className="card">
      <div style={{ fontSize:11, letterSpacing:2, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', marginBottom:14 }}>Fixture Tracker — {all.length} types</div>
      {all.length===0 ? <div style={{ textAlign:'center', padding:40, color:'#7a7a88' }}>No fixtures added yet. Design team can add fixtures here.</div> : (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'80px 1fr 50px 90px 110px 120px', gap:8, padding:'8px 14px', fontSize:10, letterSpacing:1, textTransform:'uppercase', color:'#7a7a88', fontFamily:'JetBrains Mono,monospace', background:'#f0f0f3', borderBottom:'1.5px solid rgba(0,0,0,0.09)' }}>
            <div>Code</div><div>Name</div><div>Flr</div><div>Vendor</div><div>PO</div><div>Status</div>
          </div>
          {all.map(f=>(
            <div key={f.id} style={{ display:'grid', gridTemplateColumns:'80px 1fr 50px 90px 110px 120px', gap:8, padding:'10px 14px', borderBottom:'1px solid rgba(0,0,0,0.05)', fontSize:13, alignItems:'center' }}>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:'#1a5fa8', fontWeight:600 }}>{f.code}</div>
              <div><div style={{ fontWeight:500 }}>{f.name}</div><div style={{ fontSize:11, color:'#7a7a88', fontFamily:'JetBrains Mono,monospace' }}>{f.cat} · {f.dim}</div></div>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, padding:'2px 6px', borderRadius:3, background:'#f0f0f3', textAlign:'center' }}>{f.floor}</div>
              <div style={{ fontSize:12, color:f.vendor==='TBD'?'#c0392b':'#4a4a54' }}>{f.vendor}</div>
              <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:11, color:!f.poNumber?'#c0392b':'#4a4a54' }}>{f.poNumber||'— No PO'}</div>
              <div><span className={`badge ${f.status==='snagged'||f.status==='installed'?'badge-green':f.status==='not_started'?'badge-muted':'badge-amber'}`}>{f.status?.replace(/_/g,' ')}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
