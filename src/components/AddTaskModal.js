// src/components/AddTaskModal.js
import { useState } from 'react';
import { ref as dbRef, set, update } from 'firebase/database';
import { db } from '../firebase';
import { TEAMS, CATS, PARENT_GROUPS, CHILD_TO_PARENT } from '../constants';

const PID = 'main';

export default function AddTaskModal({ tasks, team, userName, onClose }) {
  const [mode, setMode] = useState('subtask'); // 'subtask' | 'group'
  // Sub-task fields
  const [taskName, setTaskName] = useState('');
  const [taskGroup, setTaskGroup] = useState('');
  const [taskCategory, setTaskCategory] = useState('civil');
  const [taskDuration, setTaskDuration] = useState(7);
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskDeps, setTaskDeps] = useState([]);
  // Group fields
  const [groupName, setGroupName] = useState('');
  const [groupIcon, setGroupIcon] = useState('📋');
  const [groupCategory, setGroupCategory] = useState('civil');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = team === 'admin';

  // Teams that can add: admin can add anywhere, others only to their own groups
  const allowedGroups = isAdmin
    ? PARENT_GROUPS
    : PARENT_GROUPS.filter(g => g.team === team);

  // All tasks for dependency selection
  const allTaskList = Object.values(tasks).filter(t => t.id !== 'LAUNCH');

  const saveSubTask = async () => {
    if (!taskName.trim()) { setError('Task name is required'); return; }
    if (!taskGroup) { setError('Please select a group'); return; }
    setSaving(true);
    const id = 'custom_' + Date.now();
    const task = {
      id, name: taskName.trim(),
      team: PARENT_GROUPS.find(g => g.id === taskGroup)?.team || team,
      category: taskCategory,
      duration: Number(taskDuration) || 7,
      deps: taskDeps,
      assignee: taskAssignee,
      notes: taskNotes,
      status: 'not_started', completion: 0,
      actualStart: null, actualEnd: null,
      plannedStart: null, plannedEnd: null,
      vendor: '', poNumber: '',
      isDefault: false, isCustom: true,
      parentGroup: taskGroup,
      lastUpdated: Date.now(), updatedBy: userName,
    };
    // Add to Firebase tasks
    await set(dbRef(db, `p/${PID}/tasks/${id}`), task);
    // Add to the group's children list in DB
    const group = PARENT_GROUPS.find(g => g.id === taskGroup);
    if (group) {
      const existingChildren = group.children || [];
      await update(dbRef(db, `p/${PID}/customGroups/${taskGroup}`), {
        extraChildren: [...(existingChildren.filter(c => c.startsWith('custom_'))), id]
      });
    }
    setSaving(false);
    onClose();
  };

  const saveGroup = async () => {
    if (!groupName.trim()) { setError('Group name is required'); return; }
    setSaving(true);
    const id = 'grp_custom_' + Date.now();
    await set(dbRef(db, `p/${PID}/customGroups/${id}`), {
      id, name: groupName.trim(), icon: groupIcon,
      team, category: groupCategory,
      children: [], extraChildren: [],
      isCustom: true,
      createdBy: userName, createdAt: Date.now(),
    });
    setSaving(false);
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 300, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }} onClick={onClose}>
      <div style={{ background: '#fff', width: 460, height: '100vh', overflowY: 'auto', padding: 24, boxShadow: '-4px 0 20px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: 'Bebas Neue,sans-serif', fontSize: 22, letterSpacing: 2 }}>Add Task</div>
          <button onClick={onClose} style={{ background: '#f0f0f3', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', background: '#f0f0f3', borderRadius: 8, padding: 4, marginBottom: 20 }}>
          {[['subtask', 'Add Sub-task'], ['group', 'Create New Group']].map(([m, lbl]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              style={{ flex: 1, padding: '8px 0', textAlign: 'center', fontSize: 13, fontWeight: 600, cursor: 'pointer', borderRadius: 6, border: 'none', background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#0d0d0f' : '#7a7a88', boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.08)' : 'none', fontFamily: 'Inter,sans-serif' }}>
              {lbl}
            </button>
          ))}
        </div>

        {error && <div style={{ color: '#c0392b', fontSize: 12, padding: '8px 10px', background: 'rgba(192,57,43,0.07)', borderRadius: 6, marginBottom: 14 }}>{error}</div>}

        {mode === 'subtask' ? (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Task Name *</label>
              <input className="input" value={taskName} onChange={e => setTaskName(e.target.value)} placeholder="e.g. Submit NOC application" autoFocus />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Group *</label>
              <select className="input" value={taskGroup} onChange={e => setTaskGroup(e.target.value)}>
                <option value="">Select a group…</option>
                {allowedGroups.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Category</label>
                <select className="input" value={taskCategory} onChange={e => setTaskCategory(e.target.value)}>
                  {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Duration (days)</label>
                <input type="number" className="input" value={taskDuration} onChange={e => setTaskDuration(e.target.value)} min={1} />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Assignee</label>
              <input className="input" value={taskAssignee} onChange={e => setTaskAssignee(e.target.value)} placeholder="Name or email" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Dependencies <span style={{ fontWeight: 400, color: '#7a7a88' }}>(tasks that must finish first)</span></label>
              <div style={{ maxHeight: 150, overflowY: 'auto', border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 8, padding: 8 }}>
                {allTaskList.slice(0, 30).map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 4px', cursor: 'pointer', fontSize: 13 }}>
                    <input type="checkbox" checked={taskDeps.includes(t.id)} onChange={e => setTaskDeps(d => e.target.checked ? [...d, t.id] : d.filter(x => x !== t.id))} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: TEAMS[t.team]?.color, display: 'inline-block', flexShrink: 0 }} />
                    {t.name.slice(0, 45)}{t.name.length > 45 ? '…' : ''}
                  </label>
                ))}
              </div>
              {taskDeps.length > 0 && <div style={{ fontSize: 11, color: '#b8860b', marginTop: 4, fontFamily: 'JetBrains Mono,monospace' }}>{taskDeps.length} dependency selected</div>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Notes</label>
              <textarea className="input" value={taskNotes} onChange={e => setTaskNotes(e.target.value)} rows={2} style={{ resize: 'vertical' }} placeholder="Context, blockers, links…" />
            </div>
            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 13 }} onClick={saveSubTask} disabled={saving}>
              {saving ? 'Saving…' : '+ Add Sub-task'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: 'rgba(184,134,11,0.07)', border: '1.5px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#4a4a54' }}>
              Create a new master task group that will appear as a collapsible section in the dashboard. You can add sub-tasks to it after creation.
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Group Name *</label>
              <input className="input" value={groupName} onChange={e => setGroupName(e.target.value)} placeholder="e.g. LGD Brand Fitout" autoFocus />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 12, marginBottom: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Icon</label>
                <input className="input" value={groupIcon} onChange={e => setGroupIcon(e.target.value)} placeholder="📋" style={{ textAlign: 'center', fontSize: 20 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Category</label>
                <select className="input" value={groupCategory} onChange={e => setGroupCategory(e.target.value)}>
                  {Object.entries(CATS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#4a4a54', display: 'block', marginBottom: 6 }}>Team</label>
              <div style={{ padding: '10px 14px', background: '#f0f0f3', borderRadius: 8, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: TEAMS[team]?.color, display: 'inline-block' }} />
                {TEAMS[team]?.name} {!isAdmin && <span style={{ color: '#7a7a88', fontSize: 11 }}>(groups are assigned to your team)</span>}
              </div>
            </div>
            <button className="btn btn-gold" style={{ width: '100%', justifyContent: 'center', fontSize: 15, padding: 13 }} onClick={saveGroup} disabled={saving}>
              {saving ? 'Saving…' : '+ Create Group'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
