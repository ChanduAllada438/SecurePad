import React, { useState } from 'react';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { 
  ShieldCheck, Zap, FileUp, DownloadCloud, EyeOff, 
  Lock, FileText, PlayCircle, Image as ImageIcon, 
  RefreshCcw, ChevronLeft, ShieldAlert 
} from 'lucide-react';

// Initialize Supabase Client
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [password, setPassword] = useState('');
  const [view, setView] = useState('gateway'); 
  const [roomData, setRoomData] = useState(null); 
  const [textContent, setTextContent] = useState('');
  const [file, setFile] = useState(null);
  const [settings, setSettings] = useState({ burnOnRead: false, allowDownload: true });
  const [loading, setLoading] = useState(false);

  // 1. GATEWAY ACCESS
  const handleAccess = async () => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/access', { password });
      setRoomData(data);
      setView('viewer');
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setView('upload');
      } else {
        alert("Server connection failed. Is the backend running?");
      }
    }
  };

  // 2. CREATE SECURE ROOM
  const handleCreateRoom = async () => {
    setLoading(true);
    let fileUrl = '';
    let fileType = 'text';

    try {
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error } = await supabase.storage.from('files').upload(fileName, file);
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage.from('files').getPublicUrl(fileName);
        fileUrl = publicUrlData.publicUrl;
        fileType = file.type;
      }

      await axios.post('http://localhost:5000/api/create-room', {
        roomPassword: password,
        fileUrl,
        fileType,
        textContent,
        settings
      });

      alert("🎉 Room Secured and Encrypted!");
      setView('gateway');
      setPassword('');
      setFile(null);
      setTextContent('');
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-cyan-500/30">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-12 group cursor-default">
        <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:border-cyan-400 transition-colors">
          <ShieldCheck className="text-cyan-400 w-10 h-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
        </div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Secure <span className="text-cyan-400">Pad</span>
        </h1>
      </div>

      {/* VIEW: GATEWAY */}
      {view === 'gateway' && (
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl w-full max-w-md transition-all animate-in fade-in zoom-in duration-300">
          <p className="text-slate-500 text-center mb-6 text-xs font-bold uppercase tracking-[0.3em]">Identity Verification</p>
          <div className="relative mb-6 group">
            <Lock className="absolute left-4 top-4 text-slate-600 group-focus-within:text-cyan-500 transition-colors w-5 h-5" />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all text-white placeholder:text-slate-700"
              placeholder="Enter Room Key..."
            />
          </div>
          <button 
            onClick={handleAccess} 
            className="w-full bg-gradient-to-br from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20 active:scale-95 transition-all uppercase tracking-widest"
          >
            <Zap className="w-5 h-5 fill-current" /> Access Pad
          </button>
        </div>
      )}

      {/* VIEW: UPLOAD/CREATION */}
      {view === 'upload' && (
        <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl w-full max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-cyan-400 tracking-tight flex items-center gap-2">
              <RefreshCcw className="w-6 h-6 animate-spin-slow" /> New Room: {password}
            </h2>
            <button onClick={() => setView('gateway')} className="text-slate-500 hover:text-white flex items-center gap-1 text-sm font-bold">
              <ChevronLeft className="w-4 h-4" /> Change Key
            </button>
          </div>
          
          <textarea 
            className="w-full bg-slate-950/50 border border-slate-800 rounded-3xl p-6 mb-6 h-48 focus:ring-2 focus:ring-cyan-500/30 outline-none transition-all text-slate-300 placeholder:text-slate-700 resize-none font-mono text-sm"
            placeholder="Write your encrypted message here..."
            onChange={(e) => setTextContent(e.target.value)}
          />

          <div className="relative group mb-8">
            <input type="file" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="fileInput" />
            <label 
              htmlFor="fileInput" 
              className="cursor-pointer flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed border-slate-800 rounded-[2rem] group-hover:border-cyan-500/50 group-hover:bg-cyan-500/5 transition-all"
            >
              <div className="p-4 bg-slate-800 rounded-full group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all shadow-xl">
                <FileUp className="w-8 h-8 text-cyan-400" />
              </div>
              <span className="font-bold text-slate-500 group-hover:text-cyan-400 transition-colors uppercase text-xs tracking-widest">
                {file ? file.name : "Attach Secure Media"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
              onClick={() => setSettings({...settings, burnOnRead: !settings.burnOnRead})}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 justify-center font-black transition-all text-xs uppercase tracking-widest ${
                settings.burnOnRead 
                ? 'bg-red-500/10 border-red-500 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                : 'bg-slate-800/50 border-transparent text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <EyeOff className="w-4 h-4" /> Burn on Read
            </button>
            <button 
              onClick={() => setSettings({...settings, allowDownload: !settings.allowDownload})}
              className={`p-4 rounded-2xl border-2 flex items-center gap-3 justify-center font-black transition-all text-xs uppercase tracking-widest ${
                settings.allowDownload 
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                : 'bg-slate-800/50 border-transparent text-slate-500 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <DownloadCloud className="w-4 h-4" /> Downloads
            </button>
          </div>

          <button 
            onClick={handleCreateRoom}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-[0_0_30px_rgba(8,145,178,0.3)] py-5 rounded-2xl font-black uppercase tracking-[0.3em] active:scale-[0.97] transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Encrypting Room..." : "Deploy Security Protocol"}
          </button>
        </div>
      )}

      {/* VIEW: SECURE VIEWER */}
      {view === 'viewer' && roomData && (
        <div className="bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[3rem] border border-slate-800 shadow-2xl w-full max-w-3xl animate-in zoom-in-95 duration-500">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-black text-cyan-400 flex items-center gap-3 tracking-tighter uppercase italic">
              <ShieldAlert className="w-7 h-7 animate-pulse text-red-500" /> Secure Terminal
            </h2>
            <button onClick={() => window.location.reload()} className="bg-slate-800 hover:bg-red-500/20 hover:text-red-500 px-5 py-2 rounded-full text-xs font-black uppercase tracking-tighter transition-all">Destroy Session</button>
          </div>

          {roomData.textContent && (
            <div className="bg-slate-950/80 p-8 rounded-3xl border border-slate-800 mb-8 relative group overflow-hidden shadow-inner">
              <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
              <FileText className="absolute top-6 right-6 text-slate-800 group-hover:text-cyan-900 transition-colors w-8 h-8" />
              <pre className="whitespace-pre-wrap font-mono text-slate-300 text-sm leading-relaxed">{roomData.textContent}</pre>
            </div>
          )}

          {roomData.fileUrl && (
            <div className="bg-slate-950/50 rounded-[2rem] p-6 border border-slate-800/50 flex flex-col items-center shadow-2xl">
              {roomData.fileType.includes('image') && (
                <div className="relative group">
                  <img src={roomData.fileUrl} className="max-h-[30rem] rounded-2xl shadow-2xl transition-transform group-hover:scale-[1.01]" alt="Secure" />
                  <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.5)] pointer-events-none"></div>
                </div>
              )}
              {roomData.fileType.includes('video') && <video src={roomData.fileUrl} controls className="w-full rounded-2xl shadow-2xl mb-4" />}
              {roomData.fileType.includes('audio') && <audio src={roomData.fileUrl} controls className="w-full mt-4" />}
              
              {!roomData.fileType.includes('image') && !roomData.fileType.includes('video') && !roomData.fileType.includes('audio') && (
                <div className="flex flex-col items-center gap-4 py-8">
                   <div className="p-6 bg-slate-900 rounded-full border border-slate-800"><FileText className="w-12 h-12 text-cyan-500" /></div>
                   <span className="text-slate-400 font-bold text-sm tracking-widest uppercase italic">Binary Data Locked</span>
                </div>
              )}

              {roomData.settings.allowDownload && (
                <a href={roomData.fileUrl} download className="mt-8 bg-slate-800 hover:bg-cyan-600 hover:shadow-[0_0_20px_rgba(8,145,178,0.4)] px-8 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all border border-slate-700">
                  <DownloadCloud className="w-5 h-5" /> Save to Disk
                </a>
              )}
            </div>
          )}

          {roomData.settings.burnOnRead && (
            <div className="mt-10 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl">
              <p className="text-center text-red-500 text-[0.6rem] uppercase tracking-[0.4em] font-black animate-pulse flex items-center justify-center gap-2">
                <ShieldAlert className="w-3 h-3" /> Data self-destruct sequence initiated. Room burned.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;