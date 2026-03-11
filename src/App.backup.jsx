import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const SUPABASE_URL = "https://gzhijhgdwwngdotsndbw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6aGlqaGdkd3duZ2RvdHNuZGJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MzUzNTUsImV4cCI6MjA4ODUxMTM1NX0.DDuzmydQKC1L1INbkL-BJ1gQft8nET6p7q9drI-o_9Y";
const ADMIN_EMAIL = "jyothsnarbipandu@gmail.com";
const PLACEMENT_DATE = new Date("2026-06-30");
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AVATARS = ["🦊","🐼","🦁","🐨","🦋","🐸","🦄","🐺","🐯","🦝","🐻","🐙","🐧","🦉","🦚","🦜","🐱","🐶","🐭","🐰","🐮","🐷","🐉","🦸"];
const PIE_COLORS = ["#a855f7","#6366f1","#ec4899","#f59e0b","#10b981","#06b6d4","#f97316"];

const QUOTES = [
  "End is not the end. E.N.D. means Efforts Never Dies. – Abdul Kalam",
  "Education is the most powerful weapon you can use to change the world. – Nelson Mandela",
  "A person who never made a mistake never tried anything new. – Albert Einstein",
  "Don't allow yourself to become an obstacle in your own path. – Ralph Marston",
  "Only I can change my life. No one can do it for me. – Carol Burnett",
  "Learning is never done without error and defeat. – Vladimir Lenin",
  "Be the change you wish to see in the world. – Mahatma Gandhi",
  "There is no substitute for hard work. – Thomas Edison",
  "Don't wait for the opportunity. Create it. – George Bernard Shaw",
  "Success is the sum of all efforts, repeated day-in and day-out. – R. Collier",
  "Failure will never overtake me if my determination is strong enough. – Og Mandino",
  "Self-belief and hard work will always earn you success. – Virat Kohli",
  "Your time is limited. Don't waste it living someone else's life. – Steve Jobs",
  "When you reach the end of your rope, tie a knot and hang on. – F.D. Roosevelt",
  "Tell me and I forget. Involve me and I learn. – Benjamin Franklin",
  "Every day is a second chance.",
  "I never dreamed about success. I worked for it. – Estée Lauder",
  "Wake up with determination. Go to bed with satisfaction.",
  "If you get tired, learn to rest — not to quit. – Banksy",
  "Make each day your masterpiece. – John Wooden",
  "I have not failed. I've found 10,000 ways that won't work. – Thomas Edison",
  "Failure is another steppingstone to greatness. – Oprah Winfrey",
  "The biggest risk is not taking any risk. – Mark Zuckerberg",
  "The best revenge is massive success. – Frank Sinatra",
  "You cannot change your future, but you can change your habits. – Abdul Kalam",
  "Doubt kills more dreams than failure ever will. – Karim Seddiki",
  "Hard work beats talent when talent doesn't work hard.",
  "Believe you can and you're halfway there.",
  "A little progress each day adds up to big results.",
  "The future belongs to those who believe in their dreams. – Eleanor Roosevelt",
  "Don't watch the clock. Do what it does. Keep going. – Sam Levenson",
];

const DARK={bg:"#07070f",card:"linear-gradient(135deg,#0f0f2a,#130f2a)",cardBorder:"rgba(168,85,247,0.15)",text:"#e2e0ff",muted:"#9ca3af",dim:"#6b7280",inputBg:"rgba(168,85,247,0.08)",inputBorder:"rgba(168,85,247,0.25)",navBg:"rgba(9,9,20,0.97)",headerBg:"rgba(7,7,15,0.97)",statCard:"rgba(168,85,247,0.1)",taskRow:"rgba(168,85,247,0.03)",taskRowDone:"rgba(168,85,247,0.12)",modalBg:"#0f0f2a",stripBg:"rgba(168,85,247,0.05)"};
const LIGHT={bg:"#f0eeff",card:"linear-gradient(135deg,#ffffff,#faf6ff)",cardBorder:"rgba(168,85,247,0.2)",text:"#1a0a2e",muted:"#4b5563",dim:"#6b7280",inputBg:"rgba(168,85,247,0.07)",inputBorder:"rgba(168,85,247,0.3)",navBg:"rgba(255,255,255,0.97)",headerBg:"rgba(240,238,255,0.97)",statCard:"rgba(168,85,247,0.08)",taskRow:"rgba(168,85,247,0.04)",taskRowDone:"rgba(168,85,247,0.14)",modalBg:"#ffffff",stripBg:"rgba(168,85,247,0.04)"};

const todayStr=()=>new Date().toISOString().split("T")[0];
const dateStr=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const fmtMins=(m)=>!m?"0m":m<60?`${m}m`:`${Math.floor(m/60)}h ${m%60>0?m%60+"m":""}`.trim();
const fmtStudyTime=(m)=>{if(!m)return"0m";if(m<60)return`${m}m`;const h=Math.floor(m/60);if(h<24)return`${h}h${m%60>0?" "+m%60+"m":""}`;const d=Math.floor(h/24),rh=h%24;return rh>0?`${d}d ${rh}h`:`${d}d`;};
const fmtSecs=(s)=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const localTime24=()=>{const n=new Date();return`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;};
const parseHour24=(t)=>{if(!t)return 0;if(/[ap]m/i.test(t)){const parts=t.trim().split(/\s+/);const hmParts=parts[0].split(':');let h=parseInt(hmParts[0]);const ampm=parts[1]||'';if(/pm/i.test(ampm)&&h!==12)h+=12;if(/am/i.test(ampm)&&h===12)h=0;return h;}return parseInt(t.split(':')[0]);};
const fmtTime12=(t)=>{if(!t)return'';const[hStr,mStr]=t.split(':');let h=parseInt(hStr),m=mStr||'00';const ampm=h>=12?'PM':'AM';h=h%12||12;return`${h}:${m} ${ampm}`;};
const getDailyQuote=()=>QUOTES[new Date().getDate()%QUOTES.length];
const getWeekMins=(sessions)=>{
  const now=new Date();
  // Week starts Monday (adjust so Monday=0)
  const day=now.getDay(); // 0=Sun,1=Mon,...,6=Sat
  const diffToMon=day===0?6:day-1;
  const monday=new Date(now.getFullYear(),now.getMonth(),now.getDate()-diffToMon);
  const startStr=dateStr(monday);
  return sessions.filter(s=>s.date>=startStr).reduce((a,s)=>a+s.duration,0);
};
const getMonthMins=(sessions)=>{const p=`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;return sessions.filter(s=>s.date.startsWith(p)).reduce((a,s)=>a+s.duration,0);};
const getTotalMins=(s)=>s.reduce((a,x)=>a+(x.duration||0),0);
const getDayMins=(s,d)=>s.filter(x=>x.date===d).reduce((a,x)=>a+x.duration,0);

function computeStreaks(sessions){
  if(!sessions.length)return{current:0,longest:0};
  // Sum minutes per day across all sessions (any subject)
  const dayMins={};
  sessions.forEach(s=>{dayMins[s.date]=(dayMins[s.date]||0)+s.duration;});
  // Only days with >= 60 total mins count toward streak
  const studyDays=Object.entries(dayMins).filter(([,m])=>m>=60).map(([d])=>d).sort();
  if(!studyDays.length)return{current:0,longest:0};
  // Build all streak segments
  let longest=1,cur=1;
  for(let i=1;i<studyDays.length;i++){
    const d1=new Date(studyDays[i-1]+"T00:00:00");
    const d2=new Date(studyDays[i]+"T00:00:00");
    const diff=Math.round((d2-d1)/86400000);
    if(diff===1){
      cur++;
      if(cur>longest)longest=cur;
    } else {
      // Break — reset streak, starts at 1 from that day
      cur=1;
    }
  }
  // Current streak: only active if last qualifying day is today or yesterday
  const last=studyDays[studyDays.length-1];
  const today=todayStr();
  const yesterday=dateStr(new Date(Date.now()-86400000));
  const currentStreak=(last===today||last===yesterday)?cur:0;
  return{current:currentStreak,longest};
}

function checkPasswordStrength(p){
  const rules=[p.length>=8,/[A-Z]/.test(p),/[a-z]/.test(p),/[0-9]/.test(p),/[^A-Za-z0-9]/.test(p)];
  const score=rules.filter(Boolean).length;
  if(!p)return{score:0,label:"",color:"#374151"};
  if(score<=2)return{score:2,label:"Weak",color:"#ef4444"};
  if(score===3)return{score:3,label:"Fair",color:"#f59e0b"};
  if(score===4)return{score:4,label:"Good",color:"#6366f1"};
  return{score:5,label:"Strong 💪",color:"#10b981"};
}

const makeCSS=(T)=>`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'Space Grotesk',sans-serif;background:${T.bg};color:${T.text};overflow-x:hidden;transition:background 0.3s,color 0.3s;}
  ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:#7c3aed;border-radius:4px;}
  .mono{font-family:'JetBrains Mono',monospace;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
  @keyframes glow{0%,100%{text-shadow:0 0 20px rgba(168,85,247,0.6);}50%{text-shadow:0 0 40px rgba(168,85,247,1),0 0 80px rgba(168,85,247,0.4);}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
  @keyframes grow-tree{0%{transform:scale(0.2) translateY(30px);opacity:0;}60%{transform:scale(1.05) translateY(-4px);}100%{transform:scale(1) translateY(0);opacity:1;}}
  @keyframes spin{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
  @keyframes slideIn{from{opacity:0;transform:scale(0.92);}to{opacity:1;transform:scale(1);}}
  .fadeup{animation:fadeUp 0.5s ease forwards;}
  .glow-text{animation:glow 2s ease-in-out infinite;}
  .float{animation:float 3s ease-in-out infinite;}
  .tree-grow{animation:grow-tree 1s cubic-bezier(.175,.885,.32,1.275) forwards;}
  .spin{animation:spin 1s linear infinite;}
  .modal-in{animation:slideIn 0.2s ease forwards;}
  .card{background:${T.card};border:1px solid ${T.cardBorder};border-radius:16px;}
  .btn-purple{background:linear-gradient(135deg,#7c3aed,#a855f7);border:none;border-radius:12px;color:white;cursor:pointer;font-family:'Space Grotesk',sans-serif;font-weight:700;transition:all 0.2s;}
  .btn-purple:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(168,85,247,0.4);}
  .btn-purple:disabled{opacity:0.6;transform:none;}
  .btn-ghost{background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:10px;color:#c084fc;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:all 0.2s;}
  .btn-ghost:hover{background:rgba(168,85,247,0.2);}
  .btn-danger{background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:10px;color:#f87171;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:all 0.2s;}
  .btn-danger:hover{background:rgba(239,68,68,0.2);}
  .btn-warn{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:10px;color:#fbbf24;cursor:pointer;font-family:'Space Grotesk',sans-serif;transition:all 0.2s;}
  .btn-warn:hover{background:rgba(245,158,11,0.2);}
  .nav-btn{background:none;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif;color:${T.dim};transition:color 0.2s;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;padding:4px 8px;}
  .nav-btn.active{color:#a855f7;}
  .stars{position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;overflow:hidden;}
  .star{position:absolute;border-radius:50%;background:#a855f7;opacity:0.12;animation:float 4s ease-in-out infinite;}
  input[type=text],input[type=email],input[type=password],input[type=number]{background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:10px;color:${T.text};font-family:'Space Grotesk',sans-serif;font-size:14px;padding:12px 14px;width:100%;outline:none;transition:border 0.2s;}
  input[type=text]:focus,input[type=email]:focus,input[type=password]:focus,input[type=number]:focus{border-color:#a855f7;}
  input[type=range]{-webkit-appearance:none;height:4px;border-radius:4px;background:rgba(168,85,247,0.2);border:none;padding:0;width:100%;}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#a855f7;cursor:pointer;}
  input[type=checkbox]{accent-color:#a855f7;width:16px;height:16px;cursor:pointer;}
  .task-row{transition:all 0.2s;border-radius:12px;padding:14px 16px;border:1px solid ${T.cardBorder};margin-bottom:10px;cursor:pointer;background:${T.taskRow};}
  .task-row:hover{border-color:rgba(168,85,247,0.3);}
  .task-row.done{background:${T.taskRowDone};border-color:rgba(168,85,247,0.4);}
  .cal-day{border-radius:10px;cursor:pointer;transition:all 0.15s;border:1px solid transparent;aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;font-size:11px;}
  .cal-day:hover{border-color:rgba(168,85,247,0.4);background:rgba(168,85,247,0.08);}
  .cal-day.today{background:rgba(168,85,247,0.2);border-color:#a855f7;}
  .timer-ring{transform:rotate(-90deg);}
  .stat-card{background:${T.statCard};border:1px solid rgba(168,85,247,0.2);border-radius:14px;padding:14px;}
  .lb-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;border:1px solid ${T.cardBorder};margin-bottom:8px;background:${T.taskRow};}
  .lb-row.me{border-color:rgba(168,85,247,0.6);background:rgba(168,85,247,0.15);}
  .av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#7c3aed,#a855f7);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;}
  .av-opt{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;cursor:pointer;border:2px solid transparent;transition:all 0.15s;background:rgba(168,85,247,0.08);}
  .av-opt:hover{border-color:rgba(168,85,247,0.5);}
  .av-opt.sel{border-color:#a855f7;background:rgba(168,85,247,0.2);}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;}
  .modal-box{background:${T.modalBg};border:1px solid rgba(168,85,247,0.3);border-radius:20px;padding:28px 24px;width:100%;max-width:340px;}
  .pass-rule{display:flex;align-items:center;gap:7px;font-size:11px;margin-bottom:4px;}
  .quote-strip{background:${T.stripBg};padding:7px 18px;text-align:center;font-size:11px;color:#9b59d6;font-style:italic;border-bottom:1px solid #a855f7;}
  .sub-tab{padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;font-weight:700;font-family:'Space Grotesk',sans-serif;border:none;transition:all 0.2s;}
  .notif-banner{background:linear-gradient(135deg,rgba(168,85,247,0.15),rgba(99,102,241,0.1));border-bottom:1px solid rgba(168,85,247,0.3);padding:8px 16px;display:flex;align-items:center;gap:10px;}
  .hrs-ctrl{display:flex;align-items:center;gap:0;border:1px solid rgba(168,85,247,0.3);border-radius:10px;overflow:hidden;background:rgba(168,85,247,0.05);}
  .hrs-btn{background:none;border:none;cursor:pointer;color:#a855f7;font-size:16px;font-weight:700;padding:8px 12px;transition:background 0.15s;font-family:'Space Grotesk',sans-serif;}
  .hrs-btn:hover{background:rgba(168,85,247,0.15);}
  .hrs-val{color:${T.text};font-size:14px;font-weight:600;min-width:"36px";text-align:center;padding:0 6px;}
`;

const Stars=()=><div className="stars">{[...Array(12)].map((_,i)=><div key={i} className="star" style={{width:Math.random()*4+1,height:Math.random()*4+1,left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*4}s`,animationDuration:`${3+Math.random()*3}s`}}/>)}</div>;
const Spinner=()=><div className="spin" style={{width:22,height:22,border:"3px solid rgba(168,85,247,0.3)",borderTopColor:"#a855f7",borderRadius:"50%",margin:"0 auto"}}/>;

function ConfirmModal({title,desc,confirmLabel,isDelete,onConfirm,onCancel}){
  return(
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box modal-in" onClick={e=>e.stopPropagation()}>
        <div style={{fontSize:"32px",textAlign:"center",marginBottom:"10px"}}>{isDelete?"⚠️":"🚪"}</div>
        <h3 style={{fontWeight:800,fontSize:"17px",textAlign:"center",marginBottom:"8px"}}>{title}</h3>
        <p style={{color:"#9ca3af",fontSize:"13px",textAlign:"center",marginBottom:"22px",lineHeight:1.5}}>{desc}</p>
        <div style={{display:"flex",gap:"10px"}}>
          <button className="btn-ghost" onClick={onCancel} style={{flex:1,padding:"12px",fontSize:"14px"}}>Cancel</button>
          <button className={isDelete?"btn-danger":"btn-warn"} onClick={onConfirm} style={{flex:1,padding:"12px",fontSize:"14px",borderRadius:"10px"}}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ─── HRS CONTROL ───────────────────────────────────────────────────────────
function HrsControl({value,onChange}){
  return(
    <div className="hrs-ctrl">
      <button className="hrs-btn" onClick={()=>onChange(Math.max(0.5,+(value-0.5).toFixed(1)))}>−</button>
      <span className="hrs-val">{value}h</span>
      <button className="hrs-btn" onClick={()=>onChange(Math.min(8,+(value+0.5).toFixed(1)))}>+</button>
    </div>
  );
}

// ─── NOTIFICATION BANNER ───────────────────────────────────────────────────
function NotifBanner({T}){
  const [msg,setMsg]=useState(null);
  const [dismissed,setDismissed]=useState(false);

  useEffect(()=>{
    const check=async()=>{
      const {data}=await supabase.from("notifications").select("*").order("created_at",{ascending:false}).limit(1);
      if(data&&data[0]){
        const lastSeen=localStorage.getItem("jyoo_last_notif");
        if(lastSeen!==data[0].id){setMsg(data[0]);setDismissed(false);}
      }
    };
    check();
    const interval=setInterval(check,2000);
    return()=>clearInterval(interval);
  },[]);

  const dismiss=()=>{if(msg)localStorage.setItem("jyoo_last_notif",msg.id);setDismissed(true);};
  if(!msg||dismissed)return null;
  return(
    <div className="notif-banner">
      <span style={{fontSize:"14px"}}>📣</span>
      <span style={{flex:1,fontSize:"12px",color:T.text,fontWeight:500}}>{msg.message}</span>
      <button onClick={dismiss} style={{background:"none",border:"none",cursor:"pointer",fontSize:"14px",color:T.dim}}>✕</button>
    </div>
  );
}

// ─── AUTH PAGE ─────────────────────────────────────────────────────────────
function AuthPage({onAuth}){
  const [mode,setMode]=useState("login");
  const [identifier,setIdentifier]=useState("");
  const [username,setUsername]=useState("");
  const [pass,setPass]=useState("");
  const [showPass,setShowPass]=useState(false);
  const [keep,setKeep]=useState(true);
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const strength=checkPasswordStrength(pass);
  const quote=getDailyQuote();
  const passRules=[
    {ok:pass.length>=8,text:"At least 8 characters"},
    {ok:/[A-Z]/.test(pass),text:"One uppercase letter"},
    {ok:/[a-z]/.test(pass),text:"One lowercase letter"},
    {ok:/[0-9]/.test(pass),text:"One number"},
    {ok:/[^A-Za-z0-9]/.test(pass),text:"One symbol (!@#$...)"},
  ];

  const handleSubmit=async()=>{
    setErr("");setLoading(true);
    try{
      if(mode==="signup"){
        if(!username.trim()){setErr("Enter a username");setLoading(false);return;}
        if(!passRules.every(r=>r.ok)){setErr("Password doesn't meet all requirements");setLoading(false);return;}
        // Check username uniqueness
        const {data:existing}=await supabase.from("users").select("id").eq("username",username.trim()).single();
        if(existing){setErr("Username already taken. Please choose another.");setLoading(false);return;}
        const {data,error}=await supabase.auth.signUp({email:identifier,password:pass});
        if(error)throw error;
        if(data.user){
          await supabase.from("users").insert({id:data.user.id,username:username.trim(),email:identifier,tasks:[],avatar:"🦊",total_mins:0,current_streak:0,longest_streak:0,theme:"dark"});
          try{await supabase.from("admin_logs").insert({user_id:data.user.id,username:username.trim(),email:identifier,action:"signup",data:{username:username.trim(),date:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}});}catch(_){}
          localStorage.setItem("jyoo_keep",keep?"1":"0");
          sessionStorage.setItem("jyoo_active","1");
          onAuth(data.user);
        }
      }else{
        let emailToUse=identifier;
        if(!identifier.includes("@")){
          const {data:ud}=await supabase.from("users").select("email").eq("username",identifier).single();
          if(!ud)throw new Error("Username not found. Try your email.");
          emailToUse=ud.email;
        }
        const {data,error}=await supabase.auth.signInWithPassword({email:emailToUse,password:pass});
        if(error)throw error;
        localStorage.setItem("jyoo_keep",keep?"1":"0");
        sessionStorage.setItem("jyoo_active","1");
        onAuth(data.user);
      }
    }catch(e){
      const msg=e.message||"";
      if(msg.includes("already registered"))setErr("Email already registered. Login instead.");
      else if(msg.includes("Invalid login"))setErr("Wrong email/username or password.");
      else setErr("Something went wrong. Please refresh the page and try again.");
    }
    setLoading(false);
  };

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 20px",position:"relative",zIndex:1}}>
      <Stars/>
      <div className="fadeup" style={{textAlign:"center",marginBottom:"22px"}}>
        <div style={{fontSize:"48px",marginBottom:"8px"}} className="float">🌙</div>
        <h1 className="glow-text" style={{fontSize:"clamp(22px,7vw,36px)",fontWeight:800,color:"#a855f7",marginBottom:"4px"}}>Jyoo Study Tracker</h1>
        <p style={{color:"#6b7280",fontSize:"12px",fontStyle:"italic"}}>"{quote}"</p>
      </div>
      <div className="fadeup card" style={{width:"100%",maxWidth:"380px",padding:"24px 20px",animationDelay:"0.1s"}}>
        <div style={{display:"flex",background:"rgba(168,85,247,0.08)",borderRadius:"10px",padding:"4px",marginBottom:"20px"}}>
          {["login","signup"].map(m=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");setPass("");}} style={{flex:1,padding:"9px",borderRadius:"7px",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:700,fontSize:"14px",background:mode===m?"#a855f7":"transparent",color:mode===m?"white":"#9ca3af",transition:"all 0.2s"}}>
              {m==="login"?"Login":"Sign Up"}
            </button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {mode==="signup"&&(
            <div>
              <input type="text" placeholder="Username (shown on leaderboard)" value={username} onChange={e=>setUsername(e.target.value)}/>
              <p style={{fontSize:"11px",color:"#7c3aed",marginTop:"4px",paddingLeft:"2px"}}>👤 Friends see this — not your real name</p>
            </div>
          )}
          <input type={mode==="signup"?"email":"text"} placeholder={mode==="login"?"Email or Username":"Email address"} value={identifier} onChange={e=>setIdentifier(e.target.value)}/>
          <div style={{position:"relative"}}>
            <input type={showPass?"text":"password"} placeholder={mode==="signup"?"Password (min 8 chars)":"Password"} value={pass} onChange={e=>setPass(e.target.value)} style={{paddingRight:"44px"}}/>
            <button onClick={()=>setShowPass(p=>!p)} style={{position:"absolute",right:"12px",top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:"16px",color:"#6b7280"}}>{showPass?"🙈":"👁️"}</button>
          </div>
          {mode==="signup"&&pass.length>0&&(
            <div style={{padding:"12px",background:"rgba(168,85,247,0.06)",borderRadius:"10px",border:"1px solid rgba(168,85,247,0.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"8px"}}>
                <div style={{flex:1,height:"5px",background:"rgba(255,255,255,0.1)",borderRadius:"3px",overflow:"hidden"}}>
                  <div style={{width:`${(strength.score/5)*100}%`,height:"100%",background:strength.color,borderRadius:"3px",transition:"all 0.3s"}}/>
                </div>
                <span style={{fontSize:"11px",color:strength.color,fontWeight:600,minWidth:"60px"}}>{strength.label}</span>
              </div>
              {passRules.map((r,i)=><div key={i} className="pass-rule" style={{color:r.ok?"#10b981":"#6b7280"}}><span>{r.ok?"✓":"○"}</span><span>{r.text}</span></div>)}
            </div>
          )}
          {err&&<p style={{color:"#f87171",fontSize:"12px",textAlign:"center",padding:"8px",background:"rgba(239,68,68,0.1)",borderRadius:"8px"}}>{err}</p>}
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <input type="checkbox" id="keep" checked={keep} onChange={e=>setKeep(e.target.checked)}/>
            <label htmlFor="keep" style={{fontSize:"13px",color:"#9ca3af",cursor:"pointer"}}>Keep me signed in</label>
          </div>
          <button className="btn-purple" onClick={handleSubmit} style={{padding:"14px",fontSize:"15px"}} disabled={loading}>
            {loading?<Spinner/>:mode==="login"?"Login →":"Create Account →"}
          </button>
        </div>
        {mode==="login"&&<p style={{textAlign:"center",marginTop:"12px",fontSize:"12px",color:"#6b7280"}}>No account? <span onClick={()=>setMode("signup")} style={{color:"#a855f7",cursor:"pointer",fontWeight:600}}>Sign up free</span></p>}
      </div>
    </div>
  );
}

// ─── SETUP PAGE ────────────────────────────────────────────────────────────
function SetupPage({user,onDone,onCancel,existingTasks,T}){
  const newT=()=>({key:`t${Date.now()}${Math.random().toString(36).slice(2)}`,label:"",sub:"",hours:1,cat:""});
  const [tasks,setTasks]=useState(existingTasks&&existingTasks.length?existingTasks.map(t=>({...t})):[newT(),newT(),newT()]);
  const [saving,setSaving]=useState(false);
  const [err,setErr]=useState("");

  const upd=(i,f,v)=>{const u=[...tasks];u[i]={...u[i],[f]:v};setTasks(u);};
  const save=async()=>{
    const valid=tasks.filter(t=>t.label.trim());
    if(!valid.length){setErr("Add at least one subject!");return;}
    setSaving(true);setErr("");
    try{
      const cleaned=valid.map(t=>({...t,cat:t.label.trim()}));
      const {error}=await supabase.from("users").update({tasks:cleaned}).eq("id",user.id);
      if(error)throw error;
      try{await supabase.from("admin_logs").insert({user_id:user.id,action:"subjects_updated",data:{subjects:cleaned.map(t=>t.label).join(", "),count:cleaned.length}});}catch(_){}
      onDone(cleaned);
    }catch(e){
      setErr("Something went wrong. Please refresh the page and try again.");
    }
    setSaving(false);
  };

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
        <div>
          <h2 style={{fontSize:"19px",fontWeight:800,color:"#a855f7"}}>✏️ Your Study Subjects</h2>
          <p style={{color:T.dim,fontSize:"12px",marginTop:"2px"}}>Add your daily topics (up to 10)</p>
        </div>
        {onCancel&&<button className="btn-ghost" onClick={onCancel} style={{padding:"7px 13px",fontSize:"13px"}}>✕ Cancel</button>}
      </div>
      {tasks.map((t,i)=>(
        <div key={t.key} className="card" style={{padding:"12px",marginBottom:"10px"}}>
          <div style={{display:"flex",gap:"8px",marginBottom:"8px",alignItems:"center"}}>
            <input type="text" placeholder={`Subject ${i+1} name`} value={t.label} onChange={e=>upd(i,"label",e.target.value)} style={{flex:1}}/>
            <HrsControl value={t.hours} onChange={v=>upd(i,"hours",v)}/>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <input type="text" placeholder="Platform / source" value={t.sub} onChange={e=>upd(i,"sub",e.target.value)} style={{flex:1}}/>
            <button className="btn-danger" onClick={()=>setTasks(tasks.filter((_,j)=>j!==i))} style={{padding:"8px 12px",fontSize:"15px",borderRadius:"10px"}}>✕</button>
          </div>
        </div>
      ))}
      {err&&<p style={{color:"#f87171",fontSize:"12px",textAlign:"center",marginBottom:"8px"}}>{err}</p>}
      <button className="btn-ghost" onClick={()=>{if(tasks.length<10)setTasks([...tasks,newT()]);}} style={{width:"100%",padding:"12px",fontSize:"14px",marginBottom:"12px"}}>+ Add Subject</button>
      <button className="btn-purple" onClick={save} style={{width:"100%",padding:"14px",fontSize:"16px"}} disabled={saving}>{saving?<Spinner/>:"Save & Start 🚀"}</button>
    </div>
  );
}

// ─── CALENDAR PAGE ─────────────────────────────────────────────────────────
function CalendarPage({user,userData,sessions,onSelectDate,T}){
  const [viewDate,setViewDate]=useState(new Date());
  const [monthTasks,setMonthTasks]=useState({});
  const year=viewDate.getFullYear(),month=viewDate.getMonth();
  const firstDay=new Date(year,month,1).getDay();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const today=todayStr();
  const monthStr=`${year}-${String(month+1).padStart(2,"0")}`;
  const streaks=useMemo(()=>computeStreaks(sessions),[sessions]);
  const daysLeft=Math.max(0,Math.ceil((PLACEMENT_DATE-new Date())/86400000));
  const totalTasks=(userData?.tasks||[]).length;

  useEffect(()=>{
    supabase.from("daily_tasks").select("date,checked").eq("user_id",user.id).like("date",`${monthStr}%`)
      .then(({data})=>{
        const map={};(data||[]).forEach(row=>{map[row.date]={done:Object.values(row.checked||{}).filter(Boolean).length,total:totalTasks};});
        setMonthTasks(map);
      });
  },[monthStr,user.id,totalTasks]);

  const dayMins=useMemo(()=>{
    const m={};sessions.filter(s=>s.date.startsWith(monthStr)).forEach(s=>{m[s.date]=(m[s.date]||0)+s.duration;});
    return m;
  },[sessions,monthStr]);

  const getInd=(key)=>{
    const dt=monthTasks[key];
    if(dt&&dt.total>0){if(dt.done===dt.total)return{sym:"✓✓",color:"#10b981"};if(dt.done>0)return{sym:"✓",color:"#10b981"};}
    if((dayMins[key]||0)>=1)return{sym:"●",color:"#a855f7"};
    return null;
  };

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
        <div>
          <h2 style={{fontSize:"17px",fontWeight:800,color:"#a855f7",letterSpacing:"0.5px"}}>WELCOME FRIEND!</h2>
          <p style={{fontSize:"11px",color:T.dim}}>Keep going!</p>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:"10px",color:T.dim}}>Placement in</div>
          <div className="mono" style={{fontSize:"14px",color:"#f59e0b",fontWeight:700}}>{daysLeft} days</div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"14px"}}>
        {[{label:"Today",val:fmtMins(getDayMins(sessions,today)),icon:"⚡"},{label:"This Week",val:fmtMins(getWeekMins(sessions)),icon:"📅"},{label:"This Month",val:fmtMins(getMonthMins(sessions)),icon:"📆"},{label:"All Time",val:fmtStudyTime(getTotalMins(sessions)),icon:"🏆"}].map(s=>(
          <div key={s.label} className="stat-card">
            <div style={{fontSize:"16px"}}>{s.icon}</div>
            <div className="mono" style={{fontSize:"17px",fontWeight:600,color:"#a855f7",margin:"3px 0 1px"}}>{s.val}</div>
            <div style={{fontSize:"10px",color:T.dim}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:"12px 16px",marginBottom:"14px",display:"flex",justifyContent:"space-around"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:"22px"}}>🔥</div><div className="mono" style={{fontSize:"20px",fontWeight:700,color:"#f59e0b"}}>{streaks.current}</div><div style={{fontSize:"10px",color:T.dim}}>Streak</div></div>
        <div style={{width:"1px",background:"rgba(168,85,247,0.2)"}}/>
        <div style={{textAlign:"center"}}><div style={{fontSize:"22px"}}>🏅</div><div className="mono" style={{fontSize:"20px",fontWeight:700,color:"#a855f7"}}>{streaks.longest}</div><div style={{fontSize:"10px",color:T.dim}}>Best Streak</div></div>
      </div>
      <div className="card" style={{padding:"14px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px"}}>
          <button className="btn-ghost" onClick={()=>setViewDate(new Date(year,month-1,1))} style={{padding:"5px 11px"}}>‹</button>
          <span style={{fontWeight:700,fontSize:"14px",color:T.text}}>{viewDate.toLocaleString("default",{month:"long",year:"numeric"})}</span>
          <button className="btn-ghost" onClick={()=>setViewDate(new Date(year,month+1,1))} style={{padding:"5px 11px"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px",marginBottom:"5px"}}>
          {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontSize:"10px",color:T.dim,padding:"3px",fontWeight:600}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px"}}>
          {[...Array(firstDay)].map((_,i)=><div key={`e${i}`}/>)}
          {[...Array(daysInMonth)].map((_,i)=>{
            const d=i+1,key=`${monthStr}-${String(d).padStart(2,"0")}`;
            const isToday=key===today,ind=getInd(key);
            return(
              <div key={d} className={`cal-day ${isToday?"today":""}`} onClick={()=>onSelectDate(key)} style={{fontWeight:isToday?700:400,color:isToday?"#a855f7":T.text}}>
                {d}
                {ind&&<div style={{position:"absolute",bottom:"2px",left:"50%",transform:"translateX(-50%)",fontSize:"7px",color:ind.color,fontWeight:700,whiteSpace:"nowrap"}}>{ind.sym}</div>}
              </div>
            );
          })}
        </div>
        <div style={{display:"flex",gap:"10px",justifyContent:"center",marginTop:"10px",fontSize:"10px",flexWrap:"wrap"}}>
          <span style={{color:"#10b981"}}>✓✓ Completed</span>
          <span style={{color:"#10b981"}}>✓ Partial</span>
          <span style={{color:"#a855f7",background:"rgba(168,85,247,0.2)",padding:"1px 6px",borderRadius:"4px"}}>Today</span>
        </div>
      </div>
    </div>
  );
}

// ─── DAILY TASKS ───────────────────────────────────────────────────────────
function DailyPage({user,date,taskDefs,onBack,T}){
  const [checked,setChecked]=useState({});
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    supabase.from("daily_tasks").select("checked").eq("user_id",user.id).eq("date",date).single()
      .then(({data})=>{
        if(data?.checked)setChecked(data.checked);
        else{const init={};taskDefs.forEach(t=>{init[t.key]=false;});setChecked(init);}
        setLoading(false);
      });
  },[date]);

  const toggle=async(key)=>{
    const next={...checked,[key]:!checked[key]};setChecked(next);
    await supabase.from("daily_tasks").upsert({user_id:user.id,date,checked:next},{onConflict:"user_id,date"});
  };

  const doneCount=Object.values(checked).filter(Boolean).length;
  const pct=taskDefs.length?Math.round((doneCount/taskDefs.length)*100):0;
  if(loading)return<div style={{display:"flex",justifyContent:"center",padding:"60px"}}><Spinner/></div>;
  const d=new Date(date+"T00:00:00");

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <button className="btn-ghost" onClick={onBack} style={{padding:"7px 13px",fontSize:"13px",marginBottom:"14px"}}>← Back</button>
      <h2 style={{fontSize:"15px",fontWeight:700,color:"#a855f7",marginBottom:"14px"}}>{d.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}</h2>
      <div style={{marginBottom:"16px"}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
          <span style={{fontSize:"12px",color:T.muted}}>Progress</span>
          <span className="mono" style={{fontSize:"13px",color:pct===100?"#10b981":"#a855f7",fontWeight:600}}>{pct}%</span>
        </div>
        <div style={{height:"5px",background:"rgba(168,85,247,0.15)",borderRadius:"3px",overflow:"hidden"}}>
          <div style={{width:`${pct}%`,height:"100%",background:pct===100?"#10b981":"#a855f7",borderRadius:"3px",transition:"width 0.4s ease"}}/>
        </div>
      </div>
      {taskDefs.map((t,i)=>(
        <div key={t.key} className={`task-row ${checked[t.key]?"done":""}`} onClick={()=>toggle(t.key)}>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"22px",height:"22px",borderRadius:"7px",border:`2px solid ${checked[t.key]?PIE_COLORS[i%PIE_COLORS.length]:"rgba(168,85,247,0.3)"}`,background:checked[t.key]?PIE_COLORS[i%PIE_COLORS.length]:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.2s",fontSize:"13px"}}>{checked[t.key]&&"✓"}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:600,fontSize:"14px",color:checked[t.key]?T.text:T.muted}}>{t.label}</div>
              <div style={{fontSize:"11px",color:T.dim,marginTop:"2px"}}>{t.sub} · {t.hours}h</div>
            </div>
          </div>
        </div>
      ))}
      {pct===100&&<div className="fadeup" style={{textAlign:"center",marginTop:"16px",padding:"14px",background:"rgba(16,185,129,0.1)",borderRadius:"12px",border:"1px solid rgba(16,185,129,0.3)"}}><div style={{fontSize:"26px"}}>🏆</div><div style={{fontWeight:700,color:"#10b981",marginTop:"6px"}}>Perfect Day! All tasks done!</div></div>}
    </div>
  );
}

// ─── TIMER PAGE ────────────────────────────────────────────────────────────
function TimerPage({user,taskDefs,onComplete,T}){
  const [duration,setDuration]=useState(25);
  const [active,setActive]=useState(false);
  const [total,setTotal]=useState(25*60);
  const [remaining,setRemaining]=useState(25*60);
  const [done,setDone]=useState(false);
  const [completedSession,setCompletedSession]=useState(null);
  const [category,setCategory]=useState(taskDefs[0]?.cat||"Study");
  const intervalRef=useRef(null);
  const startRef=useRef(null);
  const onCompleteRef=useRef(onComplete);
  const treeEmojis=["🌱","🌿","🌳","🌲","🎄"];
  const presets=[25,45,60,90];

  // Keep ref always fresh — no stale closure
  useEffect(()=>{onCompleteRef.current=onComplete;},[onComplete]);

  // Fire onComplete once completedSession is set
  useEffect(()=>{
    if(completedSession){
      onCompleteRef.current(completedSession);
      setCompletedSession(null);
    }
  },[completedSession]);

  useEffect(()=>{
    if('Notification' in window)Notification.requestPermission();
    const saved=JSON.parse(localStorage.getItem("jyoo_timer")||"null");
    if(saved){
      const elapsed=Math.floor((Date.now()-saved.startTs)/1000);
      if(elapsed>=saved.totalSecs){
        localStorage.removeItem("jyoo_timer");
        setDone(true);
        setCompletedSession({date:todayStr(),start_time:saved.startTime,end_time:localTime24(),duration:Math.floor(saved.totalSecs/60),category:saved.category});
      }else{
        setTotal(saved.totalSecs);setRemaining(saved.totalSecs-elapsed);
        setCategory(saved.category);setDuration(Math.round(saved.totalSecs/60));
        startRef.current=saved.startTime;setActive(true);
      }
    }
  },[]);

  useEffect(()=>{
    if(!active)return;
    intervalRef.current=setInterval(()=>{
      const saved=JSON.parse(localStorage.getItem("jyoo_timer")||"null");
      if(!saved){clearInterval(intervalRef.current);return;}
      const elapsed=Math.floor((Date.now()-saved.startTs)/1000);
      const rem=Math.max(0,saved.totalSecs-elapsed);
      setRemaining(rem);
      if(rem<=0){
        clearInterval(intervalRef.current);
        setActive(false);
        setDone(true);
        localStorage.removeItem("jyoo_timer");
        if('Notification' in window&&Notification.permission==='granted')
          new Notification("🌳 Focus Complete!",{body:`+${Math.floor(saved.totalSecs/60)}m of ${saved.category} logged!`,icon:'/icon-192.png'});
        setCompletedSession({date:todayStr(),start_time:saved.startTime,end_time:localTime24(),duration:Math.floor(saved.totalSecs/60),category:saved.category});
      }
    },1000);
    return()=>clearInterval(intervalRef.current);
  },[active]);

  const setTime=(m)=>{setDuration(m);setRemaining(m*60);setTotal(m*60);};
  const startTimer=()=>{
    const startTime=localTime24();
    startRef.current=startTime;
    localStorage.setItem("jyoo_timer",JSON.stringify({startTs:Date.now(),totalSecs:total,category,startTime}));
    setActive(true);setDone(false);
  };
  const endTimer=()=>{clearInterval(intervalRef.current);setActive(false);localStorage.removeItem("jyoo_timer");setRemaining(total);};

  const progress=(total-remaining)/total;
  const radius=88,circ=2*Math.PI*radius;
  const center={minHeight:"calc(100vh - 120px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"20px 16px",position:"relative",zIndex:1,textAlign:"center"};

  if(done)return<div style={center}><div className="tree-grow" style={{fontSize:"72px",marginBottom:"16px"}}>🌳</div><h2 style={{fontSize:"22px",fontWeight:800,color:"#10b981",marginBottom:"6px"}}>Focus Complete! 🎉</h2><p style={{color:T.muted}}>+{Math.floor(total/60)} mins · {category}</p><button className="btn-purple" onClick={()=>{setDone(false);setTime(duration);}} style={{padding:"13px 28px",fontSize:"15px",marginTop:"24px"}}>Start Another</button></div>;

  if(active)return(
    <div style={center}>
      <p style={{fontSize:"11px",color:"#7c3aed",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"4px"}}>🌿 Growing your tree...</p>
      <p style={{fontSize:"11px",color:T.dim,marginBottom:"20px"}}>Timer runs even if you leave!</p>
      <div style={{position:"relative",display:"inline-block",marginBottom:"24px"}}>
        <svg width="210" height="210" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r={radius} fill="none" stroke="rgba(168,85,247,0.1)" strokeWidth="8"/>
          <circle cx="110" cy="110" r={radius} fill="none" stroke="#a855f7" strokeWidth="8" strokeDasharray={circ} strokeDashoffset={circ*(1-progress)} strokeLinecap="round" className="timer-ring" style={{transition:"stroke-dashoffset 1s linear",filter:"drop-shadow(0 0 8px #a855f7)"}}/>
        </svg>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)"}}>
          <div style={{fontSize:"36px",marginBottom:"4px"}} className="float">{treeEmojis[Math.min(Math.floor(progress*4),4)]}</div>
          <div className="mono" style={{fontSize:"30px",fontWeight:700,color:T.text}}>{fmtSecs(remaining)}</div>
          <div style={{fontSize:"11px",color:T.dim,marginTop:"2px"}}>{category}</div>
        </div>
      </div>
      <button className="btn-ghost" onClick={endTimer} style={{padding:"12px 28px",fontSize:"14px"}}>End Session</button>
    </div>
  );

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"22px",fontWeight:800,color:"#a855f7",marginBottom:"4px",letterSpacing:"0.5px"}}>FOCUS TIMER</h2>
      <p style={{color:T.dim,fontSize:"13px",marginBottom:"18px"}}>Plant a tree, Stay focused!</p>
      <div style={{fontSize:"54px",textAlign:"center",marginBottom:"16px"}} className="float">🌱</div>
      <div className="card" style={{padding:"16px",marginBottom:"12px"}}>
        <p style={{fontSize:"11px",color:T.muted,marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>Category</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:"7px"}}>
          {taskDefs.map(t=><button key={t.key} onClick={()=>setCategory(t.cat)} className={category===t.cat?"btn-purple":"btn-ghost"} style={{padding:"6px 11px",fontSize:"12px",borderRadius:"8px"}}>{t.cat}</button>)}
        </div>
      </div>
      <div className="card" style={{padding:"16px",marginBottom:"12px"}}>
        <p style={{fontSize:"11px",color:T.muted,marginBottom:"10px",letterSpacing:"1px",textTransform:"uppercase"}}>Duration</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"7px",marginBottom:"14px"}}>
          {presets.map(p=><button key={p} onClick={()=>setTime(p)} className={duration===p?"btn-purple":"btn-ghost"} style={{padding:"10px 4px",fontSize:"13px",fontWeight:600,borderRadius:"8px"}}>{p}m</button>)}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:"6px"}}>
          <p style={{fontSize:"12px",color:T.dim}}>Custom duration</p>
          <p className="mono" style={{fontSize:"12px",color:"#a855f7",fontWeight:600}}>{duration} min</p>
        </div>
        <input type="range" min="5" max="180" value={duration} onChange={e=>setTime(+e.target.value)}/>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}><span style={{fontSize:"10px",color:T.dim}}>5m</span><span style={{fontSize:"10px",color:T.dim}}>3h</span></div>
      </div>
      <button className="btn-purple" onClick={startTimer} style={{width:"100%",padding:"15px",fontSize:"16px"}}>🌱 Start Focus</button>
    </div>
  );
}

// ─── LEADERBOARD ───────────────────────────────────────────────────────────
function LeaderboardPage({currentUserId,T,refreshKey}){
  const [users,setUsers]=useState([]);
  const [loading,setLoading]=useState(true);
  const [tab,setTab]=useState("time");
  const medals=["🥇","🥈","🥉"];
  const sortKey=tab==="time"?"total_mins":tab==="streak"?"current_streak":"longest_streak";

  const fetchUsers=useCallback(()=>{
    supabase.from("users").select("id,username,avatar,total_mins,current_streak,longest_streak").order(sortKey,{ascending:false})
      .then(({data})=>{setUsers(data||[]);setLoading(false);});
  },[sortKey]);

  // Re-fetch when tab changes OR when a new session is recorded (refreshKey = sessions.length)
  useEffect(()=>{setLoading(true);fetchUsers();},[fetchUsers,refreshKey]);
  useEffect(()=>{
    const ch=supabase.channel("lb").on("postgres_changes",{event:"*",schema:"public",table:"users"},fetchUsers).subscribe();
    return()=>supabase.removeChannel(ch);
  },[fetchUsers]);

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"22px",fontWeight:800,color:"#a855f7",marginBottom:"4px",letterSpacing:"0.5px"}}>LEADERBOARD</h2>
      <p style={{color:T.dim,fontSize:"13px",marginBottom:"14px"}}>Live rankings · updates in real time</p>
      <div style={{display:"flex",gap:"7px",marginBottom:"16px"}}>
        {[{k:"time",l:"⏱ Study Time"},{k:"streak",l:"🔥 Streak"},{k:"best",l:"🏅 Best"}].map(s=>(
          <button key={s.k} onClick={()=>setTab(s.k)} style={{flex:1,padding:"8px 4px",borderRadius:"8px",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:"11px",background:tab===s.k?"#a855f7":"rgba(168,85,247,0.1)",color:tab===s.k?"white":T.muted,transition:"all 0.2s"}}>{s.l}</button>
        ))}
      </div>
      {loading?<div style={{display:"flex",justifyContent:"center",padding:"40px"}}><Spinner/></div>:
        users.map((u,i)=>{
          const isMe=u.id===currentUserId;
          const val=tab==="time"?fmtStudyTime(u.total_mins||0):`${u[sortKey]||0}d`;
          return(
            <div key={u.id} className={`lb-row ${isMe?"me":""}`}>
              <div style={{fontSize:"20px",width:"26px",textAlign:"center"}}>{i<3?medals[i]:<span className="mono" style={{fontSize:"13px",color:T.dim}}>#{i+1}</span>}</div>
              <div className="av">{u.avatar||"🦊"}</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:"14px",color:isMe?"#c084fc":T.text}}>{u.username||"Anonymous"}{isMe&&<span style={{fontSize:"10px",color:"#7c3aed",marginLeft:"6px"}}>← you</span>}</div>
                <div style={{fontSize:"11px",color:T.dim,marginTop:"1px"}}>🔥 {u.current_streak||0} day streak</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div className="mono" style={{fontSize:"15px",fontWeight:700,color:isMe?"#c084fc":"#a855f7"}}>{val}</div>
                <div style={{fontSize:"10px",color:T.dim}}>{tab==="time"?"studied":"streak"}</div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
}

// ─── STATS PAGE ────────────────────────────────────────────────────────────
function StatsPage({sessions,T}){
  const [tab,setTab]=useState("analytics");
  const [period,setPeriod]=useState("week");
  const [histFilter,setHistFilter]=useState("week");

  const getChartData=()=>{
    if(period==="day"){
      const hours=[];
      for(let h=6;h<=23;h++){
        const label=h===0?"12AM":h<12?`${h}AM`:h===12?"12PM":`${h-12}PM`;
        const mins=sessions.filter(s=>s.date===todayStr()&&parseHour24(s.start_time)===h).reduce((a,s)=>a+s.duration,0);
        hours.push({label,hours:+(mins/60).toFixed(2)});
      }
      return hours;
    }
    if(period==="week")return[...Array(7)].map((_,i)=>{const d=new Date(Date.now()-(6-i)*86400000);return{label:d.toLocaleDateString("en",{weekday:"short"}),hours:+(getDayMins(sessions,dateStr(d))/60).toFixed(1)};});
    if(period==="month"){const now=new Date(),dim=new Date(now.getFullYear(),now.getMonth()+1,0).getDate();return[...Array(dim)].map((_,i)=>{const d=new Date(now.getFullYear(),now.getMonth(),i+1);return{label:`${i+1}`,hours:+(getDayMins(sessions,dateStr(d))/60).toFixed(1)};});}
    return[...Array(12)].map((_,i)=>{const pfx=`${new Date().getFullYear()}-${String(i+1).padStart(2,"0")}`;const m=sessions.filter(s=>s.date.startsWith(pfx)).reduce((a,s)=>a+s.duration,0);return{label:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],hours:+(m/60).toFixed(1)};});
  };

  const catData=useMemo(()=>{const map={};sessions.forEach(s=>{map[s.category]=(map[s.category]||0)+s.duration;});return Object.entries(map).map(([name,value])=>({name,value:+(value/60).toFixed(1)})).sort((a,b)=>b.value-a.value);},[sessions]);
  const ts={background:T.modalBg,border:"1px solid rgba(168,85,247,0.3)",borderRadius:"8px",color:T.text};
  // Memoize so chart re-renders whenever sessions or period changes
  const chartData=useMemo(()=>getChartData(),[sessions,period]);

  const filtered=useMemo(()=>{
    const now=new Date(),td=todayStr();
    const sw=dateStr(new Date(now.getFullYear(),now.getMonth(),now.getDate()-now.getDay()));
    const pfx=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
    return sessions.filter(s=>{if(histFilter==="today")return s.date===td;if(histFilter==="week")return s.date>=sw;if(histFilter==="month")return s.date.startsWith(pfx);return true;});
  },[sessions,histFilter]);
  const grouped=useMemo(()=>{const g={};filtered.forEach(s=>{(g[s.date]=g[s.date]||[]).push(s);});return Object.entries(g).sort(([a],[b])=>b.localeCompare(a));},[filtered]);

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"22px",fontWeight:800,color:"#a855f7",marginBottom:"16px",letterSpacing:"0.5px"}}>STUDY CHECKPOINT</h2>
      <div style={{display:"flex",gap:"8px",marginBottom:"18px"}}>
        {[{k:"analytics",l:"📊 Analytics"},{k:"history",l:"📚 History"}].map(t=>(
          <button key={t.k} className="sub-tab" onClick={()=>setTab(t.k)} style={{flex:1,background:tab===t.k?"#a855f7":"rgba(168,85,247,0.1)",color:tab===t.k?"white":T.muted}}>{t.l}</button>
        ))}
      </div>

      {tab==="analytics"&&(
        <>
          <div style={{display:"flex",gap:"6px",marginBottom:"14px"}}>
            {["day","week","month","year"].map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{flex:1,padding:"6px 4px",borderRadius:"7px",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:"11px",background:period===p?"#a855f7":"rgba(168,85,247,0.1)",color:period===p?"white":T.muted,transition:"all 0.2s",textTransform:"capitalize"}}>{p}</button>
            ))}
          </div>
          <div className="card" style={{padding:"16px",marginBottom:"14px"}}>
            <h3 style={{fontSize:"11px",color:T.muted,marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>Study Hours — {period.charAt(0).toUpperCase()+period.slice(1)}</h3>
            {sessions.length===0?<p style={{color:T.dim,fontSize:"13px",textAlign:"center",padding:"20px"}}>No data yet. Start a timer!</p>:(
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={chartData} margin={{top:4,right:4,left:-24,bottom:period==="day"?24:4}}>
                  <XAxis dataKey="label" tick={{fill:T.dim,fontSize:9}} axisLine={false} tickLine={false} interval={period==="month"?4:0} angle={period==="day"?-45:0} textAnchor={period==="day"?"end":"middle"}/>
                  <YAxis tick={{fill:T.dim,fontSize:10}} axisLine={false} tickLine={false}/>
                  <Tooltip contentStyle={ts} formatter={v=>[`${v}h`,"Hours"]}/>
                  <Bar dataKey="hours" fill="#a855f7" radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {catData.length>0&&(
            <div className="card" style={{padding:"16px",marginBottom:"14px"}}>
              <h3 style={{fontSize:"11px",color:T.muted,marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>Category Split</h3>
              <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                <ResponsiveContainer width={120} height={120}><PieChart><Pie data={catData} cx={55} cy={55} innerRadius={30} outerRadius={52} paddingAngle={3} dataKey="value">{catData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie></PieChart></ResponsiveContainer>
                <div style={{flex:1}}>{catData.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"5px"}}><div style={{width:"8px",height:"8px",borderRadius:"2px",background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}}/><span style={{fontSize:"11px",color:T.muted,flex:1}}>{c.name}</span><span className="mono" style={{fontSize:"11px",color:T.text}}>{c.value}h</span></div>)}</div>
              </div>
            </div>
          )}
          <div className="card" style={{padding:"16px"}}>
            <h3 style={{fontSize:"11px",color:T.muted,marginBottom:"12px",textTransform:"uppercase",letterSpacing:"1px"}}>Summary</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
              {[{label:"Sessions",val:sessions.length,icon:"📌"},{label:"Total Time",val:fmtStudyTime(getTotalMins(sessions)),icon:"⏱"},{label:"Avg Session",val:sessions.length?`${Math.round(getTotalMins(sessions)/sessions.length)}m`:"—",icon:"📊"},{label:"Top Category",val:catData[0]?.name||"—",icon:"🏆"}].map(s=>(
                <div key={s.label} style={{padding:"11px",background:"rgba(168,85,247,0.05)",borderRadius:"10px",border:"1px solid rgba(168,85,247,0.1)"}}>
                  <div style={{fontSize:"15px",marginBottom:"3px"}}>{s.icon}</div>
                  <div className="mono" style={{fontSize:"14px",fontWeight:600,color:"#a855f7"}}>{s.val}</div>
                  <div style={{fontSize:"10px",color:T.dim}}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab==="history"&&(
        <>
          <div style={{display:"flex",gap:"7px",marginBottom:"14px"}}>
            {[{k:"today",l:"Today"},{k:"week",l:"Week"},{k:"month",l:"Month"},{k:"all",l:"All"}].map(f=>(
              <button key={f.k} onClick={()=>setHistFilter(f.k)} className={histFilter===f.k?"btn-purple":"btn-ghost"} style={{padding:"7px 12px",fontSize:"12px",borderRadius:"8px"}}>{f.l}</button>
            ))}
          </div>
          {grouped.length===0?<div style={{textAlign:"center",padding:"48px 20px",color:T.dim}}><div style={{fontSize:"36px",marginBottom:"10px"}}>📖</div><p>No sessions yet. Start the timer!</p></div>:
            grouped.map(([date,sList])=>{
              const d=new Date(date+"T00:00:00");
              return(
                <div key={date} style={{marginBottom:"20px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
                    <span style={{fontWeight:700,fontSize:"13px",color:T.text}}>{d.toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"})}</span>
                    <span className="mono" style={{fontSize:"12px",color:"#a855f7"}}>{fmtMins(sList.reduce((a,s)=>a+s.duration,0))} total</span>
                  </div>
                  {sList.map((s,i)=>(
                    <div key={i} style={{borderLeft:"2px solid rgba(168,85,247,0.3)",paddingLeft:"13px",marginLeft:"6px",position:"relative",marginBottom:"9px"}}>
                      <div style={{position:"absolute",left:"-5px",top:"6px",width:"8px",height:"8px",borderRadius:"50%",background:"#a855f7"}}/>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div><div style={{fontSize:"13px",fontWeight:600,color:"#c084fc"}}>{s.category}</div><div className="mono" style={{fontSize:"10px",color:T.dim,marginTop:"1px"}}>{fmtTime12(s.start_time)} → {fmtTime12(s.end_time)}</div></div>
                        <div className="mono" style={{fontSize:"13px",color:"#a855f7",fontWeight:600}}>{s.duration}m</div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })
          }
        </>
      )}
    </div>
  );
}

// ─── SETTINGS ──────────────────────────────────────────────────────────────
function SettingsPage({user,userData,onUpdateTasks,onLogout,onDeleteAccount,onRefresh,isDark,toggleTheme,T}){
  const [showSetup,setShowSetup]=useState(false);
  const [editUser,setEditUser]=useState(false);
  const [newU,setNewU]=useState(userData?.username||"");
  const [savingU,setSavingU]=useState(false);
  const [uErr,setUErr]=useState("");
  const [showAvs,setShowAvs]=useState(false);
  const [showLogout,setShowLogout]=useState(false);
  const [showDelete,setShowDelete]=useState(false);

  const saveUsername=async()=>{
    if(!newU.trim())return;
    setUErr("");setSavingU(true);
    // Check uniqueness (exclude self)
    const {data:existing}=await supabase.from("users").select("id").eq("username",newU.trim()).single();
    if(existing&&existing.id!==user.id){setUErr("Username already taken.");setSavingU(false);return;}
    await supabase.from("users").update({username:newU.trim()}).eq("id",user.id);
    await onRefresh();setSavingU(false);setEditUser(false);
  };

  const selAvatar=async(av)=>{await supabase.from("users").update({avatar:av}).eq("id",user.id);await onRefresh();setShowAvs(false);};

  if(showSetup)return<SetupPage user={user} onDone={t=>{onUpdateTasks(t);setShowSetup(false);}} onCancel={()=>setShowSetup(false)} existingTasks={userData?.tasks||[]} T={T}/>;

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"22px",fontWeight:800,color:"#a855f7",marginBottom:"18px",letterSpacing:"0.5px"}}>SETTINGS</h2>

      <div className="card" style={{padding:"18px",marginBottom:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"14px"}}>
          <div style={{position:"relative"}}>
            <div className="av" style={{width:"52px",height:"52px",fontSize:"26px",cursor:"pointer"}} onClick={()=>setShowAvs(p=>!p)}>{userData?.avatar||"🦊"}</div>
            <div style={{position:"absolute",bottom:"-2px",right:"-2px",background:"#a855f7",borderRadius:"50%",width:"16px",height:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",cursor:"pointer"}} onClick={()=>setShowAvs(p=>!p)}>✏️</div>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:"10px",color:"#7c3aed",marginBottom:"2px",fontWeight:600}}>👤 SHOWN ON LEADERBOARD</div>
            <div style={{fontWeight:700,fontSize:"16px",color:T.text}}>{userData?.username||"User"}</div>
            <div style={{fontSize:"12px",color:T.dim}}>{user.email}</div>
          </div>
        </div>

        {showAvs&&(
          <div style={{marginBottom:"14px"}}>
            <p style={{fontSize:"11px",color:T.muted,marginBottom:"8px"}}>Choose your character</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>{AVATARS.map(av=><div key={av} className={`av-opt ${userData?.avatar===av?"sel":""}`} onClick={()=>selAvatar(av)}>{av}</div>)}</div>
          </div>
        )}

        {editUser?(
          <div style={{marginBottom:"10px"}}>
            <input type="text" value={newU} onChange={e=>{setNewU(e.target.value);setUErr("");}} placeholder="New username"/>
            {uErr&&<p style={{color:"#f87171",fontSize:"11px",marginTop:"4px"}}>{uErr}</p>}
            <div style={{display:"flex",gap:"8px",marginTop:"8px"}}>
              <button className="btn-purple" onClick={saveUsername} style={{flex:1,padding:"10px",fontSize:"13px"}} disabled={savingU}>{savingU?<Spinner/>:"Save"}</button>
              <button className="btn-ghost" onClick={()=>{setEditUser(false);setUErr("");}} style={{padding:"10px 14px",fontSize:"13px"}}>Cancel</button>
            </div>
          </div>
        ):(
          <button className="btn-ghost" onClick={()=>setEditUser(true)} style={{width:"100%",padding:"10px",fontSize:"13px",marginBottom:"8px"}}>👤 Change Username</button>
        )}
        <button className="btn-ghost" onClick={()=>setShowSetup(true)} style={{width:"100%",padding:"11px",fontSize:"14px"}}>✏️ Edit My Subjects</button>
      </div>

      {(userData?.tasks||[]).length>0&&(
        <div className="card" style={{padding:"16px",marginBottom:"12px"}}>
          <h3 style={{fontSize:"12px",fontWeight:700,color:T.text,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.5px"}}>My Subjects</h3>
          {userData.tasks.map((t,i)=>(
            <div key={t.key} style={{display:"flex",alignItems:"center",gap:"10px",padding:"7px 0",borderBottom:"1px solid rgba(168,85,247,0.08)"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}}/>
              <div style={{flex:1,fontSize:"13px",color:T.text}}>{t.label}</div>
              <div style={{fontSize:"11px",color:T.dim}}>{t.hours}h</div>
            </div>
          ))}
        </div>
      )}

      <div className="card" style={{padding:"16px",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontWeight:600,fontSize:"14px",color:T.text}}>{isDark?"🌙 Dark Mode":"☀️ Light Mode"}</div><div style={{fontSize:"11px",color:T.dim,marginTop:"2px"}}>Toggle theme</div></div>
        <div onClick={toggleTheme} style={{width:"48px",height:"26px",borderRadius:"13px",background:isDark?"#a855f7":"rgba(168,85,247,0.2)",cursor:"pointer",position:"relative",transition:"background 0.3s"}}>
          <div style={{position:"absolute",top:"3px",left:isDark?"24px":"3px",width:"20px",height:"20px",borderRadius:"50%",background:"white",transition:"left 0.3s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
        </div>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:"10px",marginBottom:"12px"}}>
        <button className="btn-warn" onClick={()=>setShowLogout(true)} style={{width:"100%",padding:"13px",fontSize:"14px",fontWeight:600,borderRadius:"10px"}}>Log Out</button>
        <button className="btn-danger" onClick={()=>setShowDelete(true)} style={{width:"100%",padding:"13px",fontSize:"14px",fontWeight:600,borderRadius:"10px"}}>Delete Account</button>
      </div>

      {/* Admin Announcement — visible to ALL users */}
      <AdminAnnouncementBox isAdmin={user.email===ADMIN_EMAIL} T={T}/>

      {showLogout&&<ConfirmModal title="Log Out" desc="Are you sure you want to log out? Your data is saved. You can log back in anytime." confirmLabel="Yes, Log Out" isDelete={false} onConfirm={()=>{setShowLogout(false);onLogout();}} onCancel={()=>setShowLogout(false)}/>}
      {showDelete&&<ConfirmModal title="Delete Account" desc={`Your deletion request will be sent to the admin. You'll be logged out now. The admin will remove your account manually.\n\nUsername: ${userData?.username}\nEmail: ${user.email}`} confirmLabel="Yes, Send Request & Log Out" isDelete={true} onConfirm={()=>{setShowDelete(false);onDeleteAccount();}} onCancel={()=>setShowDelete(false)}/>}
    </div>
  );
}

// ─── ADMIN ANNOUNCEMENT BOX (shown to all users) ───────────────────────────
function AdminAnnouncementBox({isAdmin,T}){
  const [latest,setLatest]=useState(null);
  const [notifMsg,setNotifMsg]=useState("");
  const [sending,setSending]=useState(false);
  const [sent,setSent]=useState(false);

  useEffect(()=>{
    const fetch=()=>supabase.from("notifications").select("*").order("created_at",{ascending:false}).limit(1)
      .then(({data})=>{if(data&&data[0])setLatest(data[0]);});
    fetch();
    const interval=setInterval(fetch,2000);
    return()=>clearInterval(interval);
  },[]);

  const sendNotif=async()=>{
    if(!notifMsg.trim())return;
    setSending(true);
    await supabase.from("notifications").insert({message:notifMsg.trim()});
    setSent(true);setNotifMsg("");setSending(false);
    setTimeout(()=>setSent(false),3000);
    // refresh
    supabase.from("notifications").select("*").order("created_at",{ascending:false}).limit(1).then(({data})=>{if(data&&data[0])setLatest(data[0]);});
  };

  return(
    <div className="card" style={{padding:"18px",marginBottom:"12px",border:"1px solid rgba(168,85,247,0.25)"}}>
      <h3 style={{fontSize:"13px",fontWeight:700,color:"#a855f7",marginBottom:"12px",letterSpacing:"0.5px"}}>📣 ADMIN ANNOUNCEMENT</h3>
      {latest?(
        <div style={{background:"rgba(168,85,247,0.08)",borderRadius:"10px",padding:"12px",border:"1px solid rgba(168,85,247,0.2)",marginBottom:isAdmin?"12px":"0"}}>
          <div style={{fontSize:"10px",color:T.dim,marginBottom:"5px"}}>{new Date(latest.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
          <p style={{fontSize:"13px",color:T.text,lineHeight:1.6}}>{latest.message}</p>
        </div>
      ):(
        <p style={{fontSize:"12px",color:T.dim,marginBottom:isAdmin?"12px":"0",fontStyle:"italic"}}>No announcements yet.</p>
      )}
      {isAdmin&&(
        <>
          <textarea value={notifMsg} onChange={e=>setNotifMsg(e.target.value)} placeholder="Type new announcement..."
            style={{width:"100%",padding:"12px",borderRadius:"10px",border:"1px solid rgba(168,85,247,0.3)",background:T.inputBg,color:T.text,fontFamily:"'Space Grotesk',sans-serif",fontSize:"14px",minHeight:"80px",resize:"vertical",outline:"none",marginBottom:"8px"}}/>
          {sent&&<p style={{color:"#10b981",fontSize:"12px",marginBottom:"6px"}}>✓ Sent to all users!</p>}
          <button className="btn-purple" onClick={sendNotif} style={{width:"100%",padding:"12px",fontSize:"14px"}} disabled={sending||!notifMsg.trim()}>
            {sending?<Spinner/>:"📣 Send Announcement"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── ADMIN PAGE ────────────────────────────────────────────────────────────
const ACTION_ICONS={"signup":"🆕","login":"🔑","session_complete":"⏱","subjects_updated":"📚","username_changed":"✏️","avatar_changed":"🎭","streak_update":"🔥","logout":"🚪","account_deleted":"🗑️","delete_requested":"🚨","setup_subjects":"📝","deleted":"✅"};
const ACTION_COLORS={"signup":"#10b981","login":"#6366f1","session_complete":"#a855f7","subjects_updated":"#f59e0b","username_changed":"#06b6d4","avatar_changed":"#ec4899","streak_update":"#f97316","logout":"#9ca3af","account_deleted":"#ef4444","delete_requested":"#ef4444","setup_subjects":"#10b981","deleted":"#10b981"};

function AdminUserDetail({user:u,logs,sessions,T,onBack}){
  const userLogs=logs.filter(l=>l.user_id===u.id||l.email===u.email);
  const userSessions=sessions.filter(s=>s.user_id===u.id);
  const [tab,setTab]=useState("overview");

  const catMap={};userSessions.forEach(s=>{catMap[s.category]=(catMap[s.category]||0)+s.duration;});
  const topCat=Object.entries(catMap).sort((a,b)=>b[1]-a[1])[0];
  const streaks=computeStreaks(userSessions);

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <button className="btn-ghost" onClick={onBack} style={{padding:"7px 13px",fontSize:"13px",marginBottom:"14px"}}>← Back</button>
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"16px"}}>
        <div className="av" style={{width:"48px",height:"48px",fontSize:"24px"}}>{u.avatar||"🦊"}</div>
        <div>
          <div style={{fontWeight:800,fontSize:"17px",color:"#f59e0b"}}>{u.username}</div>
          <div style={{fontSize:"12px",color:T.dim}}>{u.email}</div>
          <div style={{fontSize:"10px",color:T.dim}}>Joined: {new Date(u.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:"14px"}}>
        {[
          {icon:"⏱",val:fmtStudyTime(u.total_mins||0),label:"Total Study"},
          {icon:"🔥",val:`${u.current_streak||0}d`,label:"Streak"},
          {icon:"🏅",val:`${u.longest_streak||0}d`,label:"Best Streak"},
          {icon:"📌",val:userSessions.length,label:"Sessions"},
          {icon:"📚",val:(u.tasks||[]).length,label:"Subjects"},
          {icon:"🏆",val:topCat?topCat[0].slice(0,8):"—",label:"Top Subject"},
        ].map(s=>(
          <div key={s.label} style={{padding:"10px",background:"rgba(245,158,11,0.07)",borderRadius:"10px",border:"1px solid rgba(245,158,11,0.2)",textAlign:"center"}}>
            <div style={{fontSize:"14px"}}>{s.icon}</div>
            <div className="mono" style={{fontSize:"13px",fontWeight:700,color:"#f59e0b",margin:"2px 0"}}>{s.val}</div>
            <div style={{fontSize:"9px",color:T.dim}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:"6px",marginBottom:"14px"}}>
        {[{k:"overview",l:"📊 Overview"},{k:"sessions",l:"⏱ Sessions"},{k:"logs",l:"📋 Logs"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{flex:1,padding:"7px 4px",borderRadius:"7px",border:"none",cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",fontWeight:600,fontSize:"10px",background:tab===t.k?"#f59e0b":"rgba(245,158,11,0.1)",color:tab===t.k?"#1a0a2e":T.muted}}>{t.l}</button>
        ))}
      </div>

      {tab==="overview"&&(
        <>
          {/* Subjects */}
          {(u.tasks||[]).length>0&&(
            <div className="card" style={{padding:"14px",marginBottom:"12px"}}>
              <h4 style={{fontSize:"11px",color:T.muted,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Current Subjects</h4>
              {u.tasks.map((t,i)=>(
                <div key={i} style={{display:"flex",gap:"8px",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(168,85,247,0.08)"}}>
                  <div style={{width:"7px",height:"7px",borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0}}/>
                  <span style={{flex:1,fontSize:"12px",color:T.text}}>{t.label}</span>
                  <span style={{fontSize:"11px",color:T.dim}}>{t.sub}</span>
                  <span className="mono" style={{fontSize:"11px",color:"#a855f7"}}>{t.hours}h</span>
                </div>
              ))}
            </div>
          )}
          {/* Subject study time breakdown */}
          {Object.entries(catMap).length>0&&(
            <div className="card" style={{padding:"14px"}}>
              <h4 style={{fontSize:"11px",color:T.muted,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"1px"}}>Study Time by Subject</h4>
              {Object.entries(catMap).sort((a,b)=>b[1]-a[1]).map(([cat,mins])=>(
                <div key={cat} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(168,85,247,0.08)"}}>
                  <span style={{fontSize:"12px",color:T.text}}>{cat}</span>
                  <span className="mono" style={{fontSize:"12px",color:"#a855f7"}}>{fmtStudyTime(mins)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {tab==="sessions"&&(
        <div>
          {userSessions.length===0?<p style={{color:T.dim,textAlign:"center",padding:"30px"}}>No sessions yet</p>:
            userSessions.slice(0,50).map((s,i)=>(
              <div key={i} style={{padding:"10px",background:"rgba(168,85,247,0.05)",borderRadius:"10px",border:"1px solid rgba(168,85,247,0.1)",marginBottom:"7px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                  <span style={{fontSize:"12px",fontWeight:600,color:"#c084fc"}}>{s.category}</span>
                  <span className="mono" style={{fontSize:"12px",color:"#a855f7",fontWeight:700}}>{s.duration}m</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:"10px",color:T.dim}}>{s.date}</span>
                  <span className="mono" style={{fontSize:"10px",color:T.dim}}>{fmtTime12(s.start_time)} → {fmtTime12(s.end_time)}</span>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {tab==="logs"&&(
        <div>
          {userLogs.length===0?<p style={{color:T.dim,textAlign:"center",padding:"30px"}}>No logs yet</p>:
            userLogs.map(l=>(
              <div key={l.id} style={{padding:"10px",background:"rgba(168,85,247,0.04)",borderRadius:"10px",border:"1px solid rgba(168,85,247,0.1)",marginBottom:"7px"}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:"3px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                    <span style={{fontSize:"14px"}}>{ACTION_ICONS[l.action]||"📌"}</span>
                    <span style={{fontSize:"11px",fontWeight:600,color:ACTION_COLORS[l.action]||"#a855f7"}}>{l.action.replace(/_/g," ").toUpperCase()}</span>
                  </div>
                  <span style={{fontSize:"9px",color:T.dim}}>{new Date(l.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                {l.data&&<div style={{fontSize:"10px",color:T.dim,marginTop:"3px",lineHeight:1.5}}>
                  {Object.entries(l.data).map(([k,v])=><span key={k} style={{display:"inline-block",marginRight:"10px"}}><span style={{color:"#7c3aed"}}>{k}:</span> {String(v).slice(0,30)}</span>)}
                </div>}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}

function AdminPage({T,refreshKey}){
  const [users,setUsers]=useState([]);
  const [logs,setLogs]=useState([]);
  const [allSessions,setAllSessions]=useState([]);
  const [tab,setTab]=useState("users");
  const [loading,setLoading]=useState(true);
  const [selectedUser,setSelectedUser]=useState(null);

  const fetchAll=useCallback(()=>{
    Promise.all([
      supabase.from("users").select("*").order("created_at",{ascending:false}),
      supabase.from("admin_logs").select("*").order("created_at",{ascending:false}).limit(1000),
      supabase.from("sessions").select("*").order("date",{ascending:false}),
    ]).then(([ur,lr,sr])=>{setUsers(ur.data||[]);setLogs(lr.data||[]);setAllSessions(sr.data||[]);setLoading(false);});
  },[]);

  useEffect(()=>{fetchAll();},[fetchAll,refreshKey]);
  useEffect(()=>{const i=setInterval(fetchAll,2000);return()=>clearInterval(i);},[fetchAll]);

  if(selectedUser)return<AdminUserDetail user={selectedUser} logs={logs} sessions={allSessions} T={T} onBack={()=>setSelectedUser(null)}/>;

  const totalStudyMins=users.reduce((a,u)=>a+(u.total_mins||0),0);

  return(
    <div style={{padding:"20px 16px",position:"relative",zIndex:1}}>
      <h2 style={{fontSize:"20px",fontWeight:800,color:"#f59e0b",marginBottom:"4px"}}>⚡ ADMIN PANEL</h2>
      <p style={{fontSize:"12px",color:T.dim,marginBottom:"12px"}}>Full access — only visible to you</p>

      {/* Summary — just counts */}
      <div style={{display:"flex",gap:"10px",marginBottom:"16px"}}>
        {[{icon:"👥",val:users.length,label:"Total Users"},{icon:"📋",val:logs.length,label:"Total Logs"}].map(s=>(
          <div key={s.label} style={{flex:1,padding:"12px",background:"rgba(245,158,11,0.07)",borderRadius:"10px",border:"1px solid rgba(245,158,11,0.2)",textAlign:"center"}}>
            <div style={{fontSize:"20px"}}>{s.icon}</div>
            <div className="mono" style={{fontSize:"18px",fontWeight:700,color:"#f59e0b"}}>{s.val}</div>
            <div style={{fontSize:"10px",color:T.dim,marginTop:"2px"}}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:"8px",marginBottom:"16px"}}>
        {[{k:"users",l:"👥 Users"},{k:"logs",l:"📋 All Logs"}].map(t=>(
          <button key={t.k} className="sub-tab" onClick={()=>setTab(t.k)} style={{flex:1,background:tab===t.k?"#f59e0b":"rgba(245,158,11,0.1)",color:tab===t.k?"#1a0a2e":T.muted,fontSize:"12px"}}>{t.l}</button>
        ))}
      </div>

      {loading&&<div style={{display:"flex",justifyContent:"center",padding:"40px"}}><Spinner/></div>}

      {!loading&&tab==="users"&&(()=>{
        const now=Date.now();
        const oneYear=365*24*60*60*1000;
        // For each user, find their last session date
        const lastSessionMap={};
        allSessions.forEach(s=>{
          if(!lastSessionMap[s.user_id]||s.date>lastSessionMap[s.user_id])
            lastSessionMap[s.user_id]=s.date;
        });
        // User is inactive if NO session >= 5 mins in the past year
        const activeUserIds=new Set(
          allSessions
            .filter(s=>s.duration>=5&&(now-new Date(s.date+"T00:00:00").getTime())<oneYear)
            .map(s=>s.user_id)
        );
        const inactive=users.filter(u=>!activeUserIds.has(u.id));
        return(
          <>
            {inactive.length>0&&(
              <div style={{padding:"12px 14px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.35)",borderRadius:"12px",marginBottom:"14px"}}>
                <div style={{fontWeight:700,fontSize:"13px",color:"#f87171",marginBottom:"6px"}}>⚠️ {inactive.length} Inactive User{inactive.length>1?"s":""} (1+ year)</div>
                <p style={{fontSize:"11px",color:"#fca5a5",marginBottom:"8px",lineHeight:1.5}}>These users haven't had a session in over a year. You can manually remove them from Supabase → Table Editor → users & auth.users.</p>
                {inactive.map(u=>(
                  <div key={u.id} style={{padding:"7px 10px",background:"rgba(239,68,68,0.1)",borderRadius:"8px",marginBottom:"5px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <span style={{fontSize:"12px",fontWeight:700,color:"#f87171"}}>{u.username}</span>
                      <span style={{fontSize:"10px",color:"#fca5a5",marginLeft:"8px"}}>{u.email}</span>
                    </div>
                    <span style={{fontSize:"10px",color:"#fca5a5",whiteSpace:"nowrap"}}>
                      {lastSessionMap[u.id]?`Last: ${lastSessionMap[u.id]}`:"Never studied"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <p style={{fontSize:"12px",color:T.dim,marginBottom:"10px"}}>{users.length} users · tap any to see full history</p>
            {users.map(u=>{
              const uSessions=allSessions.filter(s=>s.user_id===u.id);
              const lastDate=lastSessionMap[u.id];
              const isInactive=inactive.some(x=>x.id===u.id);
              return(
                <div key={u.id} onClick={()=>setSelectedUser(u)}
                  style={{padding:"12px",background:isInactive?"rgba(239,68,68,0.05)":"rgba(245,158,11,0.05)",borderRadius:"12px",border:`1px solid ${isInactive?"rgba(239,68,68,0.25)":"rgba(245,158,11,0.2)"}`,marginBottom:"8px",cursor:"pointer",transition:"all 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.opacity="0.8"}
                  onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
                  <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                    <div style={{position:"relative"}}>
                      <div style={{fontSize:"22px"}}>{u.avatar||"🦊"}</div>
                      {isInactive&&<div style={{position:"absolute",top:"-4px",right:"-4px",width:"10px",height:"10px",borderRadius:"50%",background:"#ef4444"}}/>}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:"14px",color:isInactive?"#f87171":T.text}}>{u.username}</div>
                      <div style={{fontSize:"11px",color:T.dim}}>{u.email}</div>
                      <div style={{fontSize:"10px",color:T.dim}}>
                        Joined {new Date(u.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
                        {lastDate&&<span style={{marginLeft:"8px",color:isInactive?"#f87171":T.dim}}>· Last session: {lastDate}</span>}
                        {!activeUserIds.has(u.id)&&!lastDate&&<span style={{marginLeft:"8px",color:"#f87171"}}> · Never studied</span>}
                        {!activeUserIds.has(u.id)&&lastDate&&<span style={{marginLeft:"8px",color:"#f87171"}}> · No recent study</span>}
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div className="mono" style={{fontSize:"13px",color:isInactive?"#f87171":"#f59e0b",fontWeight:700}}>{fmtStudyTime(u.total_mins||0)}</div>
                      <div style={{fontSize:"10px",color:T.dim}}>🔥 {u.current_streak||0} · 🏅 {u.longest_streak||0}</div>
                      <div style={{fontSize:"10px",color:T.dim}}>{uSessions.length} sessions</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        );
      })()}

      {!loading&&tab==="logs"&&(()=>{
        const [confirmDone,setConfirmDone]=React.useState(null);
        const markDone=async(log)=>{
          // Update log action to "deleted" in DB
          await supabase.from("admin_logs").update({action:"deleted",data:{...log.data,marked_done_at:new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}}).eq("id",log.id);
          // Insert a new "deleted" log entry for history
          try{await supabase.from("admin_logs").insert({user_id:log.user_id,username:log.username,email:log.email,action:"deleted",data:{...log.data,deleted_by:"admin",deleted_at:new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}});}catch(_){}
          setConfirmDone(null);
          fetchAll();
        };
        return(<>
          {/* Delete requests pinned to top */}
          {logs.filter(l=>l.action==="delete_requested").length>0&&(
            <div style={{padding:"12px 14px",background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"12px",marginBottom:"14px"}}>
              <div style={{fontWeight:700,fontSize:"13px",color:"#f87171",marginBottom:"8px"}}>🚨 Pending Deletion Requests ({logs.filter(l=>l.action==="delete_requested").length})</div>
              {logs.filter(l=>l.action==="delete_requested").map(l=>(
                <div key={l.id} style={{padding:"8px 10px",background:"rgba(239,68,68,0.1)",borderRadius:"8px",marginBottom:"6px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"3px"}}>
                    <span style={{fontWeight:700,fontSize:"13px",color:"#f87171"}}>{l.username||"unknown"}</span>
                    <span style={{fontSize:"9px",color:"#fca5a5"}}>{new Date(l.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                  </div>
                  <div style={{fontSize:"10px",color:"#fca5a5"}}>📧 {l.email}</div>
                  {l.data&&<div style={{fontSize:"10px",color:"#fca5a5",marginTop:"3px"}}>
                    {l.data.total_study&&<span style={{marginRight:"10px"}}>⏱ {l.data.total_study}</span>}
                    {l.data.sessions&&<span style={{marginRight:"10px"}}>{l.data.sessions} sessions</span>}
                    {l.data.subjects&&<span>📚 {l.data.subjects}</span>}
                  </div>}
                  <div style={{fontSize:"10px",color:"#f87171",marginTop:"4px",fontStyle:"italic"}}>→ Remove manually from Supabase → users table + Authentication</div>
                  <button onClick={()=>setConfirmDone(l)} style={{marginTop:"8px",width:"100%",padding:"8px",background:"rgba(16,185,129,0.15)",border:"1px solid rgba(16,185,129,0.4)",borderRadius:"8px",color:"#10b981",fontWeight:700,fontSize:"12px",cursor:"pointer",fontFamily:"Space Grotesk,sans-serif"}}>✅ Mark as Done (Account Deleted)</button>
                </div>
              ))}
            </div>
          )}
          {/* Confirm Done Modal */}
          {confirmDone&&(
            <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100,padding:"20px"}}>
              <div style={{background:"#1a0a2e",borderRadius:"16px",padding:"24px",width:"100%",maxWidth:"360px",border:"1px solid rgba(16,185,129,0.3)"}}>
                <div style={{fontSize:"28px",textAlign:"center",marginBottom:"10px"}}>✅</div>
                <div style={{fontWeight:700,fontSize:"16px",color:"#10b981",textAlign:"center",marginBottom:"8px"}}>Confirm Account Deleted</div>
                <p style={{fontSize:"12px",color:"#9ca3af",textAlign:"center",marginBottom:"16px"}}>Confirm that you have manually removed <strong style={{color:"#f87171"}}>{confirmDone.username}</strong> ({confirmDone.email}) from Supabase. This will update the log status to "deleted".</p>
                <div style={{display:"flex",gap:"10px"}}>
                  <button onClick={()=>setConfirmDone(null)} style={{flex:1,padding:"11px",borderRadius:"10px",background:"rgba(156,163,175,0.1)",border:"1px solid rgba(156,163,175,0.3)",color:"#9ca3af",fontFamily:"Space Grotesk,sans-serif",cursor:"pointer",fontSize:"13px"}}>Cancel</button>
                  <button onClick={()=>markDone(confirmDone)} style={{flex:1,padding:"11px",borderRadius:"10px",background:"rgba(16,185,129,0.2)",border:"1px solid rgba(16,185,129,0.4)",color:"#10b981",fontFamily:"Space Grotesk,sans-serif",fontWeight:700,cursor:"pointer",fontSize:"13px"}}>Yes, Done ✓</button>
                </div>
              </div>
            </div>
          )}
          <p style={{fontSize:"12px",color:T.dim,marginBottom:"10px"}}>{logs.length} log entries · latest on top · all time preserved</p>
          {logs.map(l=>{
            const isSession=l.action==="session_complete";
            return(
              <div key={l.id} style={{padding:"11px 12px",background:isSession?"rgba(168,85,247,0.06)":"rgba(245,158,11,0.04)",borderRadius:"10px",border:`1px solid ${isSession?"rgba(168,85,247,0.15)":"rgba(245,158,11,0.12)"}`,marginBottom:"7px"}}>
                {/* Row 1: Username + action badge + time */}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"5px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
                    <span style={{fontSize:"13px"}}>{ACTION_ICONS[l.action]||"📌"}</span>
                    <span style={{fontSize:"13px",fontWeight:700,color:T.text}}>{l.username||"deleted user"}</span>
                    <span style={{fontSize:"10px",fontWeight:600,color:ACTION_COLORS[l.action]||"#a855f7",background:`${ACTION_COLORS[l.action]||"#a855f7"}20`,padding:"1px 6px",borderRadius:"4px"}}>{l.action.replace(/_/g," ")}</span>
                  </div>
                  <span style={{fontSize:"9px",color:T.dim,whiteSpace:"nowrap"}}>{new Date(l.created_at).toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
                </div>
                {/* Row 2: Email */}
                <div style={{fontSize:"10px",color:T.dim,marginBottom:"4px"}}>📧 {l.email||"—"}</div>
                {/* Row 3: Session details if applicable */}
                {isSession&&l.data&&(
                  <div style={{display:"flex",flexWrap:"wrap",gap:"8px",marginTop:"4px"}}>
                    {l.data.subject&&<span style={{fontSize:"11px",background:"rgba(168,85,247,0.12)",color:"#c084fc",padding:"2px 8px",borderRadius:"6px"}}>📚 {l.data.subject}</span>}
                    {l.data.duration_mins&&<span style={{fontSize:"11px",background:"rgba(16,185,129,0.12)",color:"#10b981",padding:"2px 8px",borderRadius:"6px"}}>⏱ {l.data.duration_mins}m</span>}
                    {l.data.date&&<span style={{fontSize:"11px",background:"rgba(99,102,241,0.12)",color:"#818cf8",padding:"2px 8px",borderRadius:"6px"}}>📅 {l.data.date}</span>}
                    {l.data.streak!==undefined&&<span style={{fontSize:"11px",background:"rgba(245,158,11,0.12)",color:"#f59e0b",padding:"2px 8px",borderRadius:"6px"}}>🔥 streak {l.data.streak}</span>}
                    {l.data.total_study&&<span style={{fontSize:"11px",background:"rgba(168,85,247,0.08)",color:"#a855f7",padding:"2px 8px",borderRadius:"6px"}}>🏆 {l.data.total_study} total</span>}
                  </div>
                )}
                {/* Row 3: Non-session data — clean display per action type */}
                {!isSession&&l.data&&(
                  <div style={{fontSize:"10px",color:T.dim,lineHeight:1.8,marginTop:"3px"}}>
                    {(l.action==="login"||l.action==="logout")&&<>
                      {l.data.streak!==undefined&&<span style={{marginRight:"10px"}}>🔥 streak {l.data.streak}</span>}
                      {l.data.total_study&&<span style={{marginRight:"10px"}}>⏱ {l.data.total_study}</span>}
                      {l.data.time&&<span style={{marginRight:"10px"}}>🕐 {l.data.time}</span>}
                    </>}
                    {l.action==="signup"&&<>
                      {l.data.username&&<span style={{marginRight:"10px"}}>👤 {l.data.username}</span>}
                      {l.data.time&&<span>🕐 {l.data.time}</span>}
                    </>}
                    {l.action==="deleted"&&l.data&&<>
                      {l.data.deleted_at&&<span style={{display:"block",color:"#10b981",marginBottom:"2px"}}>✅ Deleted: {l.data.deleted_at}</span>}
                      {l.data.total_study&&<span style={{marginRight:"10px"}}>⏱ {l.data.total_study}</span>}
                      {l.data.subjects&&<span style={{display:"block",marginTop:"2px"}}>📚 {l.data.subjects}</span>}
                    </>}
                    {l.action==="delete_requested"&&<>
                      {l.data.requested_on&&<span style={{display:"block",color:"#f87171",marginBottom:"2px"}}>🗓 Requested: {l.data.requested_on}</span>}
                      {l.data.total_study&&<span style={{marginRight:"10px"}}>⏱ {l.data.total_study}</span>}
                      {l.data.sessions!==undefined&&<span style={{marginRight:"10px"}}>{l.data.sessions} sessions</span>}
                      {l.data.subjects&&<span style={{display:"block",marginTop:"2px"}}>📚 {l.data.subjects}</span>}
                      <span style={{display:"block",marginTop:"4px",color:"#f87171",fontStyle:"italic"}}>→ {l.data.note}</span>
                    </>}
                    {(l.action==="subjects_updated"||l.action==="setup_subjects")&&l.data.subjects&&<span>📚 {l.data.subjects}</span>}
                    {l.action==="username_changed"&&l.data.new_username&&<span>✏️ → {l.data.new_username}</span>}
                    {!["login","logout","signup","delete_requested","deleted","subjects_updated","setup_subjects","username_changed"].includes(l.action)&&
                      Object.entries(l.data).slice(0,4).map(([k,v])=>(
                        <span key={k} style={{display:"inline-block",marginRight:"10px"}}><span style={{color:"#7c3aed"}}>{k}:</span> {String(v).slice(0,30)}</span>
                      ))
                    }
                  </div>
                )}
              </div>
            );
          })}
        </>);})()}
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
const NAV=[{key:"calendar",icon:"🏠",label:"Home"},{key:"timer",icon:"⏰",label:"Timer"},{key:"leaderboard",icon:"🏆",label:"Ranks"},{key:"stats",icon:"📊",label:"Stats"},{key:"settings",icon:"⚙️",label:"Me"}];

export default function App(){
  const [authUser,setAuthUser]=useState(null);
  const [userData,setUserData]=useState(null);
  const [sessions,setSessions]=useState([]);
  const [activePage,setActivePage]=useState("calendar");
  const [selectedDate,setSelectedDate]=useState(todayStr());
  const [showDaily,setShowDaily]=useState(false);
  const [showSetup,setShowSetup]=useState(false);
  const [authLoading,setAuthLoading]=useState(true);
  const [dataLoading,setDataLoading]=useState(false);
  const [forceAuth,setForceAuth]=useState(false);
  const [refreshKey,setRefreshKey]=useState(0);
  const [isDark,setIsDark]=useState(true);
  const T=isDark?DARK:LIGHT;
  const CSS=makeCSS(T);
  const quote=getDailyQuote();
  const isAdmin=authUser?.email===ADMIN_EMAIL;

  const loadUserData=useCallback(async(uid)=>{const {data}=await supabase.from("users").select("*").eq("id",uid).single();setUserData(data);if(data?.theme)setIsDark(data.theme!=="light");return data;},[]);
  const loadSessions=useCallback(async(uid)=>{const {data}=await supabase.from("sessions").select("*").eq("user_id",uid).order("date",{ascending:false});setSessions(data||[]);},[]);

  // Load both in parallel — much faster than sequential
  const loadAll=useCallback(async(uid)=>{
    const [ud]=await Promise.all([loadUserData(uid),loadSessions(uid)]);
    return ud;
  },[loadUserData,loadSessions]);

  // Realtime subscriptions — instant updates, no polling lag
  useEffect(()=>{
    if(!authUser)return;
    const uid=authUser.id;
    // Subscribe to user row changes (streak, total_mins)
    const userCh=supabase.channel("user-"+uid)
      .on("postgres_changes",{event:"*",schema:"public",table:"users",filter:`id=eq.${uid}`},
        ()=>loadUserData(uid))
      .subscribe();
    // Subscribe to new sessions
    const sessCh=supabase.channel("sess-"+uid)
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"sessions",filter:`user_id=eq.${uid}`},
        ()=>loadSessions(uid))
      .subscribe();
    // Fallback poll every 2s for anything missed
    const interval=setInterval(()=>loadAll(uid),1000);
    return()=>{supabase.removeChannel(userCh);supabase.removeChannel(sessCh);clearInterval(interval);};
  },[authUser]);

  const toggleTheme=async()=>{const next=!isDark;setIsDark(next);await supabase.from("users").update({theme:next?"dark":"light"}).eq("id",authUser.id);};

  useEffect(()=>{
    const init=async()=>{
      const keep=localStorage.getItem("jyoo_keep")!=="0";
      const active=sessionStorage.getItem("jyoo_active")==="1";
      if(!keep&&!active){await supabase.auth.signOut();setAuthLoading(false);return;}
      const {data:{session}}=await supabase.auth.getSession();
      if(session){
        sessionStorage.setItem("jyoo_active","1");setAuthUser(session.user);setDataLoading(true);
        const ud=await loadAll(session.user.id);setDataLoading(false);if(!ud?.tasks?.length)setShowSetup(true);
      }
      setAuthLoading(false);
    };
    init();
    const {data:{subscription}}=supabase.auth.onAuthStateChange(async(ev,session)=>{
      if(ev==="SIGNED_OUT"){
        setAuthUser(null);setUserData(null);setSessions([]);
        setShowSetup(false);setDataLoading(false);
      }
    });
    return()=>subscription.unsubscribe();
  },[]);

  const logAction=async(action,data={})=>{
    try{await supabase.from("admin_logs").insert({user_id:authUser.id,username:userData?.username,email:authUser.email,action,data});}catch(_){}
  };

  const handleComplete=useCallback(async(session)=>{
    // 1. Insert session into DB
    const {data:ins,error}=await supabase.from("sessions").insert({user_id:authUser.id,...session}).select().single();
    if(error||!ins){console.error("Session insert failed",error);return;}

    // 2. Fetch ALL sessions fresh from DB — ensures total_mins is always accurate
    const {data:allSessions}=await supabase.from("sessions").select("*").eq("user_id",authUser.id);
    const freshSessions=allSessions||[];
    setSessions(freshSessions);

    // 3. Recompute totals from fresh DB data
    const streaks=computeStreaks(freshSessions);
    const newTotal=getTotalMins(freshSessions);

    // 4. Update user record in DB
    await supabase.from("users").update({
      total_mins:newTotal,
      current_streak:streaks.current,
      longest_streak:streaks.longest,
    }).eq("id",authUser.id);

    // 5. Log to admin
    try{await supabase.from("admin_logs").insert({user_id:authUser.id,username:userData?.username,email:authUser.email,action:"session_complete",data:{subject:session.category,duration_mins:session.duration,date:session.date,start:session.start_time,end:session.end_time,streak:streaks.current,best_streak:streaks.longest,total_study:fmtStudyTime(newTotal),total_sessions:freshSessions.length}});}catch(_){}

    // 6. Reload everything in parallel so ALL pages update immediately
    await loadAll(authUser.id);
    setRefreshKey(k=>k+1);
  },[authUser,userData,loadAll]);

  const handleLogout=async()=>{
    try{await supabase.from("admin_logs").insert({user_id:authUser.id,username:userData?.username,email:authUser.email,action:"logout",data:{total_study:fmtStudyTime(userData?.total_mins||0),streak:userData?.current_streak||0,date:todayStr(),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}});}catch(_){}
    sessionStorage.removeItem("jyoo_active");
    localStorage.removeItem("jyoo_keep");
    // Force auth page FIRST, then clean up
    setForceAuth(true);
    setAuthUser(null);setUserData(null);setSessions([]);setShowSetup(false);setDataLoading(false);
    await supabase.auth.signOut();
    setForceAuth(false);
  };

  const handleDeleteAccount=async()=>{
    // 1. Log deletion request with full details for admin
    try{await supabase.from("admin_logs").insert({user_id:authUser.id,username:userData?.username,email:authUser.email,action:"delete_requested",data:{username:userData?.username,email:authUser.email,requested_on:new Date().toLocaleString("en-IN",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),total_study:fmtStudyTime(userData?.total_mins||0),sessions:sessions.length,streak:userData?.current_streak||0,best_streak:userData?.longest_streak||0,subjects:(userData?.tasks||[]).map(t=>t.label).join(", "),note:"Remove manually: Supabase → users table + Authentication tab"}});}catch(_){}
    // 2. Force auth page immediately
    sessionStorage.removeItem("jyoo_active");
    localStorage.removeItem("jyoo_keep");
    localStorage.removeItem("jyoo_timer");
    setForceAuth(true);
    setAuthUser(null);setUserData(null);setSessions([]);setShowSetup(false);setDataLoading(false);
    await supabase.auth.signOut();
    setForceAuth(false);
  };

  const handleUpdateTasks=async(tasks)=>{setDataLoading(true);setShowSetup(false);await loadAll(authUser.id);setDataLoading(false);};
  const handleRefresh=()=>loadUserData(authUser.id);

  const LS=({text})=>(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:T.bg,flexDirection:"column",gap:"14px"}}>
      <style>{CSS}</style>
      <div style={{fontSize:"38px"}} className="float">🌙</div>
      {text&&<p style={{color:T.dim,fontSize:"12px",fontFamily:"Space Grotesk,sans-serif"}}>{text}</p>}
      <Spinner/>
    </div>
  );

  if(forceAuth)return<div style={{background:T.bg,minHeight:"100vh",maxWidth:"480px",margin:"0 auto"}}><style>{CSS}</style><AuthPage onAuth={async u=>{setForceAuth(false);setDataLoading(true);setAuthUser(u);const ud=await loadAll(u.id);setDataLoading(false);if(!ud?.tasks?.length)setShowSetup(true);try{await supabase.from("admin_logs").insert({user_id:u.id,username:ud?.username,email:u.email,action:"login",data:{streak:ud?.current_streak||0,total_study:fmtStudyTime(ud?.total_mins||0),date:todayStr(),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}});}catch(_){}}}/></div>;
  if(authLoading||dataLoading)return<LS/>;
  if(!authUser)return<div style={{background:T.bg,minHeight:"100vh",maxWidth:"480px",margin:"0 auto"}}><style>{CSS}</style><AuthPage onAuth={async u=>{setDataLoading(true);setAuthUser(u);const ud=await loadAll(u.id);setDataLoading(false);if(!ud?.tasks?.length)setShowSetup(true);try{await supabase.from("admin_logs").insert({user_id:u.id,username:ud?.username,email:u.email,action:"login",data:{streak:ud?.current_streak||0,total_study:fmtStudyTime(ud?.total_mins||0),date:todayStr(),time:new Date().toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"})}});}catch(_){}}}/></div>;

  if(showSetup)return(
    <div style={{background:T.bg,minHeight:"100vh",maxWidth:"480px",margin:"0 auto",paddingBottom:"30px"}}>
      <style>{CSS}</style><Stars/>
      <div style={{padding:"18px 16px 0",position:"relative",zIndex:1}}>
        <h2 style={{fontSize:"16px",fontWeight:800,color:"#a855f7"}}>Welcome, {userData?.username||"friend"}! 👋</h2>
        <p style={{fontSize:"12px",color:T.dim,marginTop:"2px",marginBottom:"14px"}}>Set up your study subjects</p>
      </div>
      <SetupPage user={authUser} onDone={handleUpdateTasks} existingTasks={[]} T={T}/>
    </div>
  );

  if(showDaily)return(
    <div style={{background:T.bg,minHeight:"100vh",maxWidth:"480px",margin:"0 auto",paddingBottom:"30px"}}>
      <style>{CSS}</style><Stars/>
      <DailyPage user={authUser} date={selectedDate} taskDefs={userData?.tasks||[]} onBack={()=>setShowDaily(false)} T={T}/>
    </div>
  );

  return(
    <div style={{background:T.bg,minHeight:"100vh",maxWidth:"480px",margin:"0 auto",paddingBottom:"72px"}}>
      <style>{CSS}</style><Stars/>
      <div style={{position:"sticky",top:0,zIndex:10,background:T.headerBg,backdropFilter:"blur(12px)"}}>
        <div style={{borderBottom:"1px solid #a855f7",padding:"11px 18px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"17px"}}>🌙</span>
            <span style={{fontWeight:800,color:"#a855f7",fontSize:"15px",letterSpacing:"0.5px"}}>Jyoo Study</span>
          </div>
          <div className="mono" style={{fontSize:"11px",color:T.dim}}>{new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</div>
        </div>
        <div style={{borderBottom:"1px solid #a855f7"}} className="quote-strip">"{quote}"</div>
        <NotifBanner T={T}/>
      </div>

      {activePage==="calendar"&&<CalendarPage user={authUser} userData={userData} sessions={sessions} onSelectDate={d=>{setSelectedDate(d);setShowDaily(true);}} T={T}/>}
      {activePage==="timer"&&<TimerPage user={authUser} taskDefs={userData?.tasks||[]} onComplete={handleComplete} T={T}/>}
      {activePage==="leaderboard"&&<LeaderboardPage currentUserId={authUser.id} T={T} refreshKey={refreshKey}/>}
      {activePage==="stats"&&<StatsPage sessions={sessions} T={T}/>}
      {activePage==="settings"&&<SettingsPage user={authUser} userData={userData} onUpdateTasks={handleUpdateTasks} onLogout={handleLogout} onDeleteAccount={handleDeleteAccount} onRefresh={handleRefresh} isDark={isDark} toggleTheme={toggleTheme} T={T}/>}
      {activePage==="admin"&&isAdmin&&<AdminPage T={T} refreshKey={refreshKey}/>}

      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:"480px",background:T.navBg,backdropFilter:"blur(16px)",borderTop:"1px solid rgba(168,85,247,0.2)",display:"flex",justifyContent:"space-around",padding:"8px 0 12px",zIndex:20}}>
        {[...NAV,...(isAdmin?[{key:"admin",icon:"⚡",label:"Admin"}]:[])].map(n=>(
          <button key={n.key} className={`nav-btn ${activePage===n.key?"active":""}`} onClick={()=>setActivePage(n.key)}>
            <span style={{fontSize:"20px"}}>{n.icon}</span>
            <span>{n.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
