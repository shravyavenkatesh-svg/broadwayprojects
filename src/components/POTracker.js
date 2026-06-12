// src/components/POTracker.js
import { useState } from 'react';
import { ref as dbRef, set, update } from 'firebase/database';
import { db } from '../firebase';
import { TEAMS } from '../constants';
import { fmts } from '../utils';

const PID = 'main';

const PO_CATS = {
  civil:'Civil', hvac:'HVAC', electrical:'Electrical', interior:'Interior',
  fixtures:'Fixtures', media:'Media/Screens', signage:'Signage',
  it:'IT/POS', vm:'VM/Visual', sis:'SIS Brands', plumbing:'Plumbing',
  fire:'Fire & Safety', furniture:'Furniture', other:'Other',
};

const PO_STATUS = {
  draft:     { lbl:'Draft',            color:'#7a7a88', bg:'rgba(90,90,100,0.1)' },
  submitted: { lbl:'Pending Approval', color:'#c47d0e', bg:'rgba(196,125,14,0.1)' },
  approved:  { lbl:'✓ Approved',       color:'#1a7a45', bg:'rgba(26,122,69,0.1)' },
  rejected:  { lbl:'✗ Rejected',       color:'#c0392b', bg:'rgba(192,57,43,0.1)' },
};

const fmtINR = n => n ? '₹' + Number(n).toLocaleString('en-IN') : '—';
const genPONum = () => 'MT-PO-' + String(Date.now()).slice(-6);

// WhatsApp message sender
const sendWhatsApp = (phone, message) => {
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
};

// EmailJS sender
const sendEmailJS = async (cfg, templateParams) => {
  if (!cfg?.publicKey || !cfg?.serviceId || !cfg?.poTemplate) return false;
  try {
    await window.emailjs.send(cfg.serviceId, cfg.poTemplate, templateParams);
    return true;
  } catch (e) {
    console.warn('EmailJS error:', e.message);
    return false;
  }
};

export default function POTracker({ pos = {}, team, userName, emailCfg = {} }) {
  const [showForm, setShowForm] = useState(false);
  const [editingPO, setEditingPO] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [rejectReason, setRejectReason] = useState({});
  const isAdmin = team === 'admin';

  const allPOs = Object.values(pos).sort((a, b) => b.createdAt - a.createdAt);
  const myPOs = isAdmin ? allPOs : allPOs.filter(p => p.team === team);
  const filtered = myPOs
    .filter(p => !filterStatus || p.status === filterStatus)
    .filter(p => !filterTeam || p.team === filterTeam);

  const totalApproved = allPOs.filter(p => p.status === 'approved').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = allPOs.filter(p => p.status === 'submitted').reduce((s, p) => s + (p.amount || 0), 0);
  const totalAll = allPOs.reduce((s, p) => s + (p.amount || 0), 0);
  const pendingCount = allPOs.filter(p => p.status === 'submitted').length;

  const savePO = async (data, status) => {
    const id = editingPO?.id || 'po_' + Date.now();
    const isNew = !editingPO;
    const po = {
      id, ...data, status,
      team: isAdmin ? (data.team || team) : team,
      createdBy: isNew ? userName : (editingPO.createdBy || userName),
      createdAt: isNew ? Date.now() : (editingPO.createdAt || Date.now()),
      submittedAt: status === 'submitted' ? Date.now() : (editingPO?.submittedAt || null),
      approvedBy: editingPO?.approvedBy || null,
      approvedAt: editingPO?.approvedAt || null,
      rejectionReason: editingPO?.rejectionReason || null,
      lastUpdated: Date.now(), updatedBy: userName,
    };
    await set(dbRef(db, `p/${PID}/pos/${id}`), po);

    // Send notifications if submitted
    if (status === 'submitted') {
      const msg = `🏗️ *New PO Submitted — Broadway Model Town*\n\n📋 *${po.poNumber}* — ${po.title}\n💰 Amount: ${fmtINR(po.amount)}\n🏢 Vendor: ${po.vendor}\n👤 Submitted by: ${userName} (${TEAMS[po.team]?.name})\n\nPlease log in to approve: https://broadwayprojects.onrender.com`;

      // WhatsApp
      if (emailCfg.whatsappPhone) {
        sendWhatsApp(emailCfg.whatsappPhone, msg);
      }
      // EmailJS
      await sendEmailJS(emailCfg, {
        po_number: po.poNumber, po_title: po.title,
        po_vendor: po.vendor, po_amount: fmtINR(po.amount),
        submitted_by: userName, team: TEAMS[po.team]?.name,
        to_email: emailCfg.adminEmail || '',
        tracker_url: 'https://broadwayprojects.onrender.com',
      });
    }
    setShowForm(false); setEditingPO(null);
  };

  const approvePO = async (po) => {
    await update(dbRef(db, `p/${PID}/pos/${po.id}`), {
      status: 'approved', approvedBy: userName,
      approvedAt: Date.now(), lastUpdated: Date.now(),
    });
  };

  const rejectPO = async (po) => {
    await update(dbRef(db, `p/${PID}/pos/${po.id}`), {
      status: 'rejected', approvedBy: userName,
      approvedAt: Date.now(), rejectionReason: rejectReason[po.id] || '',
      lastUpdated: Date.now(),
    });
    setRejectReason(r => ({ ...r, [po.id]: '' }));
  };

  return (
    <div>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 18 }}>
        {[
          ['Total POs', allPOs.length, '#0d0d0f', 'All teams · all statuses'],
          ['Approved Spend', fmtINR(totalApproved), '#1a7a45', `${allPOs.filter(p=>p.status==='approved').length} POs approved`],
          ['Pending Approval', fmtINR(totalPending), '#c47d0e', `${pendingCount} PO${pendingCount!==1?'s':''} awaiting`],
          ['Total Committed', fmtINR(totalAll), '#b8860b', 'Approved + Pending'],
        ].map(([lbl, val, col, sub]) => (
          <div key={lbl} className="card" style={{ padding: '16px 18px' }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace', marginBottom: 4 }}>{lbl}</div>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: typeof val === 'number' ? 38 : 24, lineHeight: 1.1, color: col }}>{val}</div>
            <div style={{ fontSize: 12, color: '#4a4a54', marginTop: 3 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Spend by category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 }}>
        <div className="card">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace', marginBottom: 12 }}>Spend by Team</div>
          {Object.entries(TEAMS).filter(([k]) => k !== 'admin').map(([key, t]) => {
            const tPOs = allPOs.filter(p => p.team === key);
            const amt = tPOs.filter(p => p.status === 'approved').reduce((s, p) => s + (p.amount || 0), 0);
            const pend = tPOs.filter(p => p.status === 'submitted').reduce((s, p) => s + (p.amount || 0), 0);
            if (!tPOs.length) return null;
            return (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: t.color, display: 'inline-block' }} />
                  {t.name} <span style={{ fontSize: 11, color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace' }}>({tPOs.length})</span>
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: '#1a7a45', fontWeight: 500 }}>{fmtINR(amt)}</div>
                  {pend > 0 && <div style={{ fontSize: 11, color: '#c47d0e' }}>{fmtINR(pend)} pending</div>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace', marginBottom: 12 }}>Spend by Category</div>
          {Object.entries(PO_CATS).map(([key, lbl]) => {
            const amt = allPOs.filter(p => p.category === key && p.status === 'approved').reduce((s, p) => s + (p.amount || 0), 0);
            if (!amt) return null;
            return (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', fontSize: 13 }}>
                <span>{lbl}</span><span style={{ color: '#1a7a45', fontWeight: 500 }}>{fmtINR(amt)}</span>
              </div>
            );
          })}
          {!allPOs.filter(p => p.status === 'approved').length && <div style={{ color: '#7a7a88', fontSize: 13, padding: '12px 0' }}>No approved POs yet</div>}
        </div>
      </div>

      {/* Pending approvals for admin */}
      {isAdmin && pendingCount > 0 && (
        <div style={{ background: 'rgba(196,125,14,0.07)', border: '1.5px solid rgba(196,125,14,0.3)', borderRadius: 8, padding: '14px 18px', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, color: '#c47d0e', fontSize: 15, marginBottom: 12 }}>⏳ {pendingCount} PO{pendingCount !== 1 ? 's' : ''} awaiting approval — {fmtINR(totalPending)}</div>
          {allPOs.filter(p => p.status === 'submitted').map(po => (
            <div key={po.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(196,125,14,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{po.poNumber} — {po.title}</div>
                  <div style={{ fontSize: 12, color: '#4a4a54', marginTop: 2 }}>
                    {TEAMS[po.team]?.name} · {po.vendor} · {PO_CATS[po.category] || po.category}
                  </div>
                  {po.description && <div style={{ fontSize: 12, color: '#7a7a88', marginTop: 2 }}>{po.description.slice(0, 120)}</div>}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 24, color: '#0d0d0f' }}>{fmtINR(po.amount)}</div>
                  <div style={{ fontSize: 11, color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace' }}>by {po.createdBy}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center' }}>
                <input placeholder="Rejection reason (optional)" value={rejectReason[po.id] || ''} onChange={e => setRejectReason(r => ({ ...r, [po.id]: e.target.value }))}
                  className="input" style={{ flex: 1, padding: '6px 10px', fontSize: 12 }} />
                <button className="btn btn-sm" style={{ background: 'rgba(192,57,43,0.1)', color: '#c0392b', border: '1.5px solid rgba(192,57,43,0.3)' }} onClick={() => rejectPO(po)}>✗ Reject</button>
                <button className="btn btn-gold btn-sm" onClick={() => approvePO(po)}>✓ Approve {fmtINR(po.amount)}</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PO Table */}
      <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ background: '#f0f0f3', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1.5px solid rgba(0,0,0,0.09)', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{isAdmin ? 'All POs' : 'My Team POs'} — <span style={{ color: '#b8860b' }}>{filtered.length}</span></span>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
            <select className="input" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: 150, padding: '5px 10px', fontSize: 11 }}>
              <option value="">All Status</option>
              {Object.entries(PO_STATUS).map(([k, v]) => <option key={k} value={k}>{v.lbl}</option>)}
            </select>
            {isAdmin && (
              <select className="input" value={filterTeam} onChange={e => setFilterTeam(e.target.value)} style={{ width: 120, padding: '5px 10px', fontSize: 11 }}>
                <option value="">All Teams</option>
                {Object.entries(TEAMS).filter(([k]) => k !== 'admin').map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
              </select>
            )}
            <button className="btn btn-gold btn-sm" onClick={() => { setEditingPO(null); setShowForm(true); }}>+ New PO</button>
          </div>
        </div>

        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 120px 120px 100px 120px', gap: 8, padding: '9px 16px', fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: '#7a7a88', fontFamily: 'JetBrains Mono,monospace', background: '#f0f0f3', borderBottom: '1.5px solid rgba(0,0,0,0.12)' }}>
          <div>PO No.</div><div>Title / Vendor</div><div>Team</div><div>Category</div><div>Amount</div><div>Status</div><div>Date</div>
        </div>

        {filtered.length === 0 && <div style={{ padding: 32, textAlign: 'center', color: '#7a7a88', fontSize: 14 }}>No POs yet. Click "+ New PO" to create one.</div>}

        {filtered.map(po => {
          const st = PO_STATUS[po.status] || PO_STATUS.draft;
          return (
            <div key={po.id} onClick={() => { setEditingPO(po); setShowForm(true); }}
              style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 120px 120px 100px 120px', gap: 8, padding: '11px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)', cursor: 'pointer', alignItems: 'center', fontSize: 13 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: '#1a5fa8', fontWeight: 600 }}>{po.poNumber}</div>
              <div><div style={{ fontWeight: 500 }}>{po.title}</div><div style={{ fontSize: 11, color: '#7a7a88' }}>{po.vendor}</div></div>
              <div style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: TEAMS[po.team]?.color, display: 'inline-block' }} />
                {TEAMS[po.team]?.name}
              </div>
              <div><span style={{ fontSize: 11, fontFamily: 'JetBrains Mono,monospace', padding: '2px 7px', borderRadius: 3, background: '#f0f0f3', color: '#4a4a54' }}>{PO_CATS[po.category] || po.category}</span></div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 14, fontWeight: 700, color: po.status === 'approved' ? '#1a7a45' : '#0d0d0f' }}>{fmtINR(po.amount)}</div>
              <div><span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono,monospace', fontWeight: 500, background: st.bg, color: st.color }}>{st.lbl}</span></div>
              <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11, color: '#7a7a88' }}>{fmts(po.createdAt ? new Date(po.createdAt) : null)}</div>
            </div>
          );
        })}
      </div>

      {/* PO Form Modal */}
      {showForm && <POForm po={editingPO} team={team} userName={userName} isAdmin={isAdmin} onSave={savePO} onClose={() => { setShowForm(false); setEditingPO(null); }} />}
    </div>
  );
}

function POForm({ po, team, userName, isAdmin, onSave, onClose }) {
  const isNew = !po;
  const canEdit = isNew || po.status === 'draft' || isAdmin;
  const [title, setTitle] = useState(po?.title || '');
  const [vendor, setVendor] = useState(po?.vendor || '');
  const [amount, setAmount] = useState(po?.amount || '');
  const [category, setCategory] = useState(po?.category || 'civil');
  const [poTeam, setPoTeam] = useState(po?.team || team);
  const [description, setDescription] = useState(po?.description || '');
  const [notes, setNotes] = useState(po?.notes || '');
  const [poNumber] = useState(po?.poNumber || genPONum());

  const st = PO_STATUS[po?.status] || PO_STATUS.draft;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ background: '#fff', width: 480, height: '100vh', overflowY: 'auto', padding: 24, boxShadow: '-4px 0 20px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, letterSpacing: 2 }}>{isNew ? 'New Purchase Order' : poNumber}</div>
            {po && <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, fontFamily: 'JetBrains Mono,monospace', fontWeight: 500, background: st.bg, color: st.color, marginTop: 6, display: 'inline-block' }}>{st.lbl}</span>}
          </div>
          <button onClick={onClose} style={{ background: '#f0f0f3', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {po?.status === 'approved' && (
          <div style={{ background: 'rgba(26,122,69,0.08)', border: '1.5px solid rgba(26,122,69,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#1a7a45' }}>
            ✓ Approved by {po.approvedBy} on {fmts(po.approvedAt ? new Date(po.approvedAt) : null)}
          </div>
        )}
        {po?.status === 'rejected' && (
          <div style={{ background: 'rgba(192,57,43,0.08)', border: '1.5px solid rgba(192,57,43,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#c0392b' }}>
            ✗ Rejected: {po.rejectionReason || 'No reason given'}
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>PO Title *</label>
          <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. HVAC Equipment Supply" disabled={!canEdit} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Vendor *</label>
            <input className="input" value={vendor} onChange={e => setVendor(e.target.value)} placeholder="Vendor name" disabled={!canEdit} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>PO Number</label>
            <input className="input" value={poNumber} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Amount (INR) *</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: '#4a4a54' }}>₹</span>
            <input type="number" className="input" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 26 }} placeholder="0" disabled={!canEdit} />
          </div>
          {amount > 0 && <div style={{ fontSize: 12, color: '#4a4a54', marginTop: 4 }}>{fmtINR(Number(amount))}</div>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Category</label>
            <select className="input" value={category} onChange={e => setCategory(e.target.value)} disabled={!canEdit}>
              {Object.entries(PO_CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Team</label>
            <select className="input" value={poTeam} onChange={e => setPoTeam(e.target.value)} disabled={!isAdmin}>
              {Object.entries(TEAMS).filter(([k]) => k !== 'admin').map(([k, t]) => <option key={k} value={k}>{t.name}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Scope / Description</label>
          <textarea className="input" value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ resize: 'vertical' }} placeholder="What is being procured..." disabled={!canEdit} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Notes</label>
          <textarea className="input" value={notes} onChange={e => setNotes(e.target.value)} rows={2} style={{ resize: 'vertical' }} disabled={!canEdit} />
        </div>

        {canEdit && (!po || po.status === 'draft' || po.status === 'rejected') && (
          <div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => onSave({ title, vendor, amount: Number(amount), category, team: poTeam, description, notes, poNumber }, 'draft')}>
                Save Draft
              </button>
              <button className="btn btn-gold" style={{ flex: 2 }} onClick={() => { if (!title || !vendor || !amount) { alert('Title, vendor and amount are required'); return; } onSave({ title, vendor, amount: Number(amount), category, team: poTeam, description, notes, poNumber }, 'submitted'); }}>
                Submit for Approval →
              </button>
            </div>
            <p style={{ fontSize: 12, color: '#7a7a88', textAlign: 'center', marginTop: 8 }}>
              Submitting will send an email + WhatsApp notification to admin for approval.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
