// src/components/AwaitScreen.js
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function AwaitScreen() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#f4f4f6' }}>
      <div style={{ maxWidth:400, textAlign:'center', padding:'48px 24px' }}>
        <div style={{ fontSize:56, marginBottom:20 }}>⏳</div>
        <div style={{ fontFamily:'Bebas Neue,sans-serif', fontSize:32, letterSpacing:2.5, marginBottom:10 }}>Account Created!</div>
        <div style={{ color:'#4a4a54', fontSize:15, lineHeight:1.7, marginBottom:24 }}>
          Your account is set up. An admin needs to assign you to your team (Legal, Projects, Design, VM, or Store).<br/><br/>
          Once assigned, refresh this page to access the tracker.
        </div>
        <button className="btn btn-ghost" onClick={()=>window.location.reload()} style={{ marginRight:10 }}>↻ Refresh</button>
        <button className="btn btn-ghost" onClick={()=>signOut(auth)}>Sign Out</button>
      </div>
    </div>
  );
}
