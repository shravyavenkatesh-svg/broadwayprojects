// src/App.js
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, get, set, onValue } from 'firebase/database';
import { auth, db, PROJECT_CFG } from './firebase';
import { DEFAULT_TASKS } from './constants';
import AuthScreen from './components/AuthScreen';
import AwaitScreen from './components/AwaitScreen';
import AppShell from './components/AppShell';
import './App.css';

const PID = PROJECT_CFG.PID;

function App() {
  const [screen, setScreen] = useState('loading'); // loading | auth | await | app
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const [userName, setUserName] = useState('');
  const [cfg, setCfg] = useState(PROJECT_CFG);
  const [tasks, setTasks] = useState({});
  const [fixtures, setFixtures] = useState({});
  const [pos, setPOs] = useState({});
  const [users, setUsers] = useState({});

  // Init tasks in DB if not present
  const initTasks = async (startDate) => {
    const snap = await get(ref(db, `p/${PID}/tasks`));
    // Check if tasks are outdated by looking for new task IDs
    const existing = snap.exists() ? snap.val() : {};
    const hasNewTasks = DEFAULT_TASKS.some(t => !existing[t.id]);
    const hasOldTasks = Object.keys(existing).some(k => !DEFAULT_TASKS.find(t => t.id === k) && k !== 'LAUNCH');
    if(snap.exists() && !hasNewTasks && !hasOldTasks) return;
    console.log('Re-initializing tasks from constants...');
    const taskMap = {};
    DEFAULT_TASKS.forEach(t => {
      taskMap[t.id] = { ...t, deps:t.deps||[], status:'not_started', completion:0,
        actualStart:null, actualEnd:null, plannedStart:null, plannedEnd:null,
        notes:'', assignee:'', vendor:'', poNumber:'', isDefault:true,
        lastUpdated:Date.now(), updatedBy:'system' };
    });
    await set(ref(db, `p/${PID}/tasks`), taskMap);
    await set(ref(db, `p/${PID}/settings`), { startDate, targetDate:PROJECT_CFG.launchDate, projectName:PROJECT_CFG.projectName, createdAt:Date.now() });
  };

  const initFixtures = async () => {
    const snap = await get(ref(db, `p/${PID}/fixtures`));
    if(!snap.exists()) await set(ref(db, `p/${PID}/fixtures`), {});
  };

  const initPOs = async () => {
    const snap = await get(ref(db, `p/${PID}/pos`));
    if(!snap.exists()) await set(ref(db, `p/${PID}/pos`), {});
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if(!firebaseUser){ setScreen('auth'); return; }
      setUser(firebaseUser);
      setUserName(firebaseUser.displayName || firebaseUser.email);

      const userSnap = await get(ref(db, `users/${firebaseUser.uid}`));
      if(!userSnap.exists()){
        await set(ref(db, `users/${firebaseUser.uid}`), {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email,
          team: null, createdAt: Date.now()
        });
        setScreen('await'); return;
      }
      const userData = userSnap.val();
      if(!userData.team){ setScreen('await'); return; }
      setTeam(userData.team);

      // Load DB settings
      const settingsSnap = await get(ref(db, `p/${PID}/settings`));
      if(settingsSnap.exists()){
        const s = settingsSnap.val();
        setCfg(prev => ({
          ...prev,
          ...(s.targetDate && { launchDate: s.targetDate }),
          ...(s.startDate && { startDate: s.startDate }),
          ...(s.projectName && { projectName: s.projectName }),
        }));
      }

      await initTasks(PROJECT_CFG.startDate);
      await initFixtures();
      await initPOs();

      // Real-time listeners
      onValue(ref(db, `p/${PID}/tasks`), snap => setTasks(snap.val() || {}));
      onValue(ref(db, `p/${PID}/fixtures`), snap => setFixtures(snap.val() || {}));
      onValue(ref(db, `p/${PID}/pos`), snap => setPOs(snap.val() || {}));
      onValue(ref(db, `users`), snap => setUsers(snap.val() || {}));
      onValue(ref(db, `p/${PID}/settings`), snap => {
        if(snap.exists()){
          const s=snap.val();
          setCfg(prev => ({
            ...prev,
            ...(s.targetDate && { launchDate: s.targetDate }),
            ...(s.startDate && { startDate: s.startDate }),
            ...(s.projectName && { projectName: s.projectName }),
          }));
        }
      });

      setScreen('app');
    });
    return () => unsub();
  }, []);

  if(screen === 'loading') return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f4f6' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:38, letterSpacing:5, color:'#b8860b', marginBottom:8 }}>Broadway</div>
        <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:13, color:'#7a7a88' }}>Loading tracker…</div>
      </div>
    </div>
  );

  if(screen === 'auth') return <AuthScreen onSuccess={() => {}} />;
  if(screen === 'await') return <AwaitScreen user={user} />;

  return (
    <AppShell
      user={user}
      team={team}
      userName={userName}
      cfg={cfg}
      setCfg={setCfg}
      tasks={tasks}
      fixtures={fixtures}
      pos={pos}
      users={users}
    />
  );
}

export default App;
