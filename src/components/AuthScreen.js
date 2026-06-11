// src/components/AuthScreen.js
import { useState } from 'react';
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { ref, get, set } from 'firebase/database';
import { auth, db, googleProvider } from '../firebase';

export default function AuthScreen() {
  const [tab, setTab] = useState('in');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const authErr = (e) => {
    const map = {
      'auth/user-not-found':'No account found with this email.',
      'auth/wrong-password':'Incorrect password.',
      'auth/invalid-credential':'Invalid email or password.',
      'auth/email-already-in-use':'An account already exists with this email.',
      'auth/weak-password':'Password too weak (min 6 chars).',
      'auth/popup-closed-by-user':'',
    };
    return map[e.code] || e.message;
  };

  const handleGoogle = async () => {
    setLoading(true); setErr(''); setInfo('');
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const u = cred.user;
      const snap = await get(ref(db, `users/${u.uid}`));
      if(!snap.exists()){
        await set(ref(db, `users/${u.uid}`), { email:u.email, displayName:u.displayName||u.email, team:null, createdAt:Date.now() });
      }
    } catch(e) {
      const msg = authErr(e);
      if(msg) setErr(msg);
    } finally { setLoading(false); }
  };

  const handleSignIn = async (e) => {
    e.preventDefault(); if(!email||!pass){setErr('Enter email and password.');return;}
    setLoading(true); setErr('');
    try { await signInWithEmailAndPassword(auth, email, pass); }
    catch(e){ setErr(authErr(e)); }
    finally { setLoading(false); }
  };

  const handleSignUp = async (e) => {
    e.preventDefault(); if(!name||!email||!pass){setErr('All fields required.');return;}
    if(pass.length<6){setErr('Password must be at least 6 characters.');return;}
    setLoading(true); setErr('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      await set(ref(db, `users/${cred.user.uid}`), { email, displayName:name, team:null, createdAt:Date.now() });
    } catch(e){ setErr(authErr(e)); }
    finally { setLoading(false); }
  };

  const handleForgot = async () => {
    if(!email){setErr('Enter your email first.');return;}
    try { await sendPasswordResetEmail(auth, email); setInfo('Password reset email sent. Check your inbox.'); }
    catch(e){ setErr(e.message); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'#f4f4f6' }}>
      <div style={{ width:'100%', maxWidth:440 }}>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:52, letterSpacing:5, background:'linear-gradient(135deg,#b8860b,#d4a843)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', marginBottom:4, lineHeight:1 }}>Broadway</div>
        <div style={{ color:'#4a4a54', fontSize:16, marginBottom:32 }}>Model Town — Store Launch Tracker</div>

        <div style={{ background:'#fff', border:'1.5px solid rgba(0,0,0,0.09)', borderRadius:12, padding:32 }}>
          {/* Google */}
          <button onClick={handleGoogle} disabled={loading} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:12, background:'#fff', border:'1.5px solid #dadce0', color:'#3c4043', fontSize:15, padding:'13px 20px', borderRadius:8, cursor:'pointer', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', fontFamily:'Inter,sans-serif', fontWeight:500 }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            {loading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'20px 0' }}>
            <div style={{ flex:1, height:1, background:'rgba(0,0,0,0.09)' }}/>
            <span style={{ fontSize:13, color:'#7a7a88' }}>or use email</span>
            <div style={{ flex:1, height:1, background:'rgba(0,0,0,0.09)' }}/>
          </div>

          {info && <div style={{ background:'rgba(26,95,168,0.08)', border:'1.5px solid rgba(26,95,168,0.2)', borderRadius:6, padding:'10px 14px', marginBottom:14, fontSize:13, color:'#1a5fa8' }}>{info}</div>}

          {/* Tab */}
          <div style={{ display:'flex', background:'#f0f0f3', borderRadius:8, padding:4, marginBottom:20 }}>
            {['in','up'].map(t => (
              <button key={t} onClick={()=>{setTab(t);setErr('');}} style={{ flex:1, padding:'8px 0', textAlign:'center', fontSize:13, fontWeight:600, cursor:'pointer', borderRadius:6, border:'none', background:tab===t?'#fff':'transparent', color:tab===t?'#0d0d0f':'#7a7a88', boxShadow:tab===t?'0 1px 3px rgba(0,0,0,0.08)':'none', transition:'all .15s', fontFamily:'Inter,sans-serif' }}>
                {t==='in' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'in' ? (
            <form onSubmit={handleSignIn}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Email</label>
                <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Password</label>
                <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••"/>
              </div>
              {err && <div style={{ color:'#c0392b', fontSize:12, fontFamily:'JetBrains Mono,monospace', padding:'8px 10px', background:'rgba(192,57,43,0.07)', borderRadius:6, marginBottom:10 }}>{err}</div>}
              <button type="submit" disabled={loading} className="btn btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:13 }}>Sign In →</button>
              <div style={{ textAlign:'center', marginTop:14 }}><span style={{ fontSize:13, color:'#7a7a88', cursor:'pointer' }} onClick={handleForgot}>Forgot password?</span></div>
            </form>
          ) : (
            <form onSubmit={handleSignUp}>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Full Name</label>
                <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Your Name"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Work Email</label>
                <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:13, fontWeight:600, color:'#4a4a54', display:'block', marginBottom:6 }}>Password (min 6 chars)</label>
                <input className="input" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Choose a password"/>
              </div>
              {err && <div style={{ color:'#c0392b', fontSize:12, fontFamily:'JetBrains Mono,monospace', padding:'8px 10px', background:'rgba(192,57,43,0.07)', borderRadius:6, marginBottom:10 }}>{err}</div>}
              <button type="submit" disabled={loading} className="btn btn-gold" style={{ width:'100%', justifyContent:'center', fontSize:15, padding:13 }}>Create Account →</button>
              <p style={{ fontSize:13, color:'#7a7a88', textAlign:'center', marginTop:10 }}>After creating your account, an admin will assign you to your team.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
