import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  LayoutDashboard, BarChart3, Settings, LogOut, Menu, X, Activity, ShieldCheck, 
  User, ZoomIn, ZoomOut, Database, CheckCircle2, AlertCircle, Loader2, ChevronRight, 
  Mail, Lock, Maximize, Home, Layers, TrendingUp, DatabaseZap, Plus, MoreHorizontal, 
  AlertTriangle, Eye 
} from 'lucide-react';

// Importamos auth desde nuestro archivo de configuración seguro
import { auth } from './firebase';
import { 
  signInWithEmailAndPassword, createUserWithEmailAndPassword, 
  updateProfile, signOut, onAuthStateChanged 
} from 'firebase/auth';

const URL_PERFORMANCE = "https://app.powerbi.com/view?r=eyJrIjoiNzk0NWFlN2UtMTZkNi00YTRkLTkyYjctYjJhY2FhM2UwZGI3IiwidCI6IjJjYjQyMzg4LWIxZjYtNDU0Zi1hN2ZmLWQzM2IzODg2ZjBkYyIsImMiOjR9";
const URL_ESTABILIDAD = "https://app.powerbi.com/view?r=eyJrIjoiNmVkNDcwNGUtZjUxOC00YTExLTliYzEtOGQ2ZTMxZDI0MTdlIiwidCI6IjJjYjQyMzg4LWIxZjYtNDU0Zi1hN2ZmLWQzM2IzODg2ZjBkYyIsImMiOjR9";

const NATIVE_REPORT_WIDTH = 1280;

const MOCK_MODELS = [
  { id: 1, name: "Modelo Stock Clientes TC", type: "Clasificación", status: "Activo", lastUpdate: "Hace 5 min" },
  { id: 2, name: "Modelo Riesgo Consumo", type: "Clasificación", status: "Inactivo", lastUpdate: "23/11/2025" },
  { id: 3, name: "Modelo Churn Pre-pago", type: "Regresión", status: "Inactivo", lastUpdate: "15/10/2025" },
  { id: 4, name: "Modelo Detección Fraude", type: "Anomalía", status: "Mantenimiento", lastUpdate: "22/11/2025" },
  { id: 5, name: "Modelo LTV Hipotecario", type: "Regresión", status: "Inactivo", lastUpdate: "01/11/2025" },
];

function App() {
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false); 
  const [appLoading, setAppLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState('');
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false); 

  const [visitedTabs, setVisitedTabs] = useState(new Set());
  const [zoomLevel, setZoomLevel] = useState(1); 
  const containerRef = useRef(null);

  const fitToScreen = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      if (containerWidth > 0) {
        const newZoom = containerWidth / NATIVE_REPORT_WIDTH;
        setZoomLevel(Math.min(newZoom, 1.5)); 
      }
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'performance' || activeTab === 'estabilidad') {
      if (!visitedTabs.has(activeTab)) {
        setAppLoading(true); 
        setTimeout(() => {
          setAppLoading(false);
          setVisitedTabs(prev => new Set(prev).add(activeTab)); 
        }, 6000);
      } 
    } else {
      setAppLoading(false);
    }
  }, [activeTab, user, visitedTabs]);

  useEffect(() => {
    if (!appLoading && user && (activeTab === 'performance' || activeTab === 'estabilidad')) {
      const timer = setTimeout(() => { fitToScreen(); }, 100); 
      return () => clearTimeout(timer);
    }
  }, [appLoading, user, activeTab, fitToScreen]);

  useEffect(() => {
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [fitToScreen]);

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setEmail(''); setPassword(''); setName('');
        } else {
          setUser(null);
          setVisitedTabs(new Set()); 
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    
    try {
      if (isRegistering) {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Credenciales incorrectas o error de conexión.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (auth) await signOut(auth);
    setLoading(false);
    setActiveTab('home');
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#2D243F] relative overflow-hidden font-sans">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#6D28D9', stopOpacity:1}} />
                <stop offset="100%" style={{stopColor:'#4F46E5', stopOpacity:1}} />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="w-full max-w-md p-10 bg-white rounded-3xl shadow-2xl relative z-10 mx-4">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-[#4c3a6e] to-[#6b5299] rounded-2xl flex items-center justify-center mb-4 shadow-lg transform rotate-3">
              <Activity className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#2D243F] tracking-tight">{isRegistering ? 'Crear Cuenta' : 'Hola de nuevo'}</h1>
            <p className="text-slate-400 text-sm mt-2 text-center font-medium">Monitoreo de Modelos de Riesgo</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-6">
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-[#4c3a6e] outline-none transition-all font-medium" placeholder="Tu nombre" required={isRegistering} />
                </div>
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-[#4c3a6e] outline-none transition-all font-medium" placeholder="usuario@dominio.com" required />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wide ml-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-[#4c3a6e] outline-none transition-all font-medium" placeholder="••••••••" required />
              </div>
            </div>
            {errorMsg && <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm flex items-center rounded-r"><AlertCircle className="w-5 h-5 mr-2 flex-shrink-0"/>{errorMsg}</div>}
            <button type="submit" disabled={loading} className="w-full bg-[#4c3a6e] hover:bg-[#3b2c57] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-900/20 transform transition-all active:scale-[0.98] flex justify-center items-center">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <span>{isRegistering ? 'Registrar Cuenta' : 'Iniciar Sesión'}</span>}
            </button>
          </form>
          <div className="mt-8 text-center">
            <button onClick={() => setIsRegistering(!isRegistering)} className="text-[#4c3a6e] text-sm font-semibold hover:underline flex items-center justify-center mx-auto group">
              {isRegistering ? '¿Ya tienes cuenta? Entra aquí' : '¿No tienes cuenta? Regístrate'} <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans overflow-hidden">
      <aside className={`hidden md:flex flex-col w-72 bg-white border-r border-slate-100 z-20`}>
        <div className="p-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#4c3a6e] rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/10"><Activity className="w-5 h-5 text-white" /></div>
          <div><span className="font-bold text-lg text-[#2D243F] tracking-tight block">Monitoreo</span><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analytics</span></div>
        </div>
        <div className="px-6 py-2">
           <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-4 flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-[#EFEBF5] text-[#4c3a6e] rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-[#4c3a6e]/10">{user.displayName ? user.displayName.charAt(0).toUpperCase() : "U"}</div>
              <div className="overflow-hidden flex-1"><p className="text-sm font-bold text-slate-700 truncate">{user.displayName || "Usuario"}</p><div className="flex items-center text-xs text-[#22c55e] mt-0.5 font-medium"><span className="w-2 h-2 bg-[#22c55e] rounded-full mr-1.5"></span>Conectado</div></div>
           </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5">
          <SidebarItem icon={<Home size={20} />} text="Inicio" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
          <SidebarItem icon={<LayoutDashboard size={20} />} text="Performance" active={activeTab === 'performance'} onClick={() => setActiveTab('performance')} />
          <SidebarItem icon={<ShieldCheck size={20} />} text="Estabilidad" active={activeTab === 'estabilidad'} onClick={() => setActiveTab('estabilidad')} />
          <div className="pt-6 mt-6 border-t border-slate-100">
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistema</p>
            <SidebarItem icon={<DatabaseZap size={20} />} text="Gestión de Modelos" active={activeTab === 'conexiones'} onClick={() => setActiveTab('conexiones')} />
            <SidebarItem icon={<Settings size={20} />} text="Configuración" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
          </div>
        </nav>
        <div className="p-6"><button onClick={handleLogout} className="flex items-center space-x-3 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors w-full px-4 py-3 rounded-xl font-medium text-sm group"><LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /><span>Cerrar Sesión</span></button></div>
      </aside>

      <main className="flex-1 flex flex-col relative w-full h-full bg-[#F8FAFC]">
        <header className="bg-white h-16 border-b border-slate-100 flex items-center justify-between px-4 md:hidden z-30 sticky top-0">
          <div className="flex items-center space-x-2"><div className="w-8 h-8 bg-[#4c3a6e] rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-white" /></div><span className="font-bold text-slate-800">Monitoreo</span></div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </header>
        {isMobileMenuOpen && (
           <div className="absolute top-16 left-0 w-full bg-white text-slate-800 z-40 p-4 shadow-xl border-b border-slate-100 animate-in slide-in-from-top-10 md:hidden">
              <nav className="space-y-1">
                <SidebarItem icon={<Home size={20} />} text="Inicio" active={activeTab === 'home'} onClick={() => {setActiveTab('home'); setIsMobileMenuOpen(false)}} />
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Performance" active={activeTab === 'performance'} onClick={() => {setActiveTab('performance'); setIsMobileMenuOpen(false)}} />
                <SidebarItem icon={<ShieldCheck size={20} />} text="Estabilidad" active={activeTab === 'estabilidad'} onClick={() => {setActiveTab('estabilidad'); setIsMobileMenuOpen(false)}} />
                <SidebarItem icon={<DatabaseZap size={20} />} text="Gestión de Modelos" active={activeTab === 'conexiones'} onClick={() => {setActiveTab('conexiones'); setIsMobileMenuOpen(false)}} />
                <div className="border-t border-slate-100 my-2 pt-2"><button onClick={handleLogout} className="flex items-center space-x-3 text-slate-500 hover:text-red-600 p-3 w-full"><LogOut size={18}/><span>Salir</span></button></div>
              </nav>
           </div>
        )}

        <div className="flex-1 overflow-auto p-4 md:p-10">
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#2D243F] tracking-tight">
                {activeTab === 'home' ? 'Portal de Administración' : activeTab === 'performance' ? 'Performance' : activeTab === 'estabilidad' ? 'Estabilidad' : activeTab === 'conexiones' ? 'Gestión de Modelos' : 'Ajustes'}
              </h2>
              <p className="text-slate-400 font-medium mt-1">
                {activeTab === 'home' ? 'Resumen general de modelos y alertas' : activeTab === 'conexiones' ? 'Administración de fuentes de datos y conexiones' : activeTab === 'config' ? 'Preferencias de usuario' : 'Métricas actualizadas en tiempo real'}
              </p>
            </div>
            {activeTab !== 'config' && activeTab !== 'home' && activeTab !== 'conexiones' && !appLoading && (
               <div className="flex items-center space-x-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex items-center space-x-2 border-r border-slate-100 pr-3 pl-2">
                    <button onClick={() => setZoomLevel(prev => Math.max(0.3, prev - 0.1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#4c3a6e] transition-colors"><ZoomOut size={18} /></button>
                    <span className="text-xs font-bold text-slate-600 w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#4c3a6e] transition-colors"><ZoomIn size={18} /></button>
                    <button onClick={fitToScreen} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-[#4c3a6e] transition-colors ml-1 border-l border-slate-100 pl-2"><Maximize size={16} /></button>
                 </div>
                 <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#F0FDF4] rounded-xl mr-1">
                   <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-[#22c55e]"></span></span>
                   <span className="text-xs font-bold text-[#15803d]">LIVE</span>
                 </div>
               </div>
            )}
          </div>

          <div ref={containerRef} className={`${(activeTab === 'home' || activeTab === 'conexiones') ? '' : 'bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 min-h-[600px]'} overflow-hidden relative ring-1 ring-black/5`}>
            
            {appLoading && (activeTab === 'performance' || activeTab === 'estabilidad') ? (
               <div className="absolute inset-0 z-50 flex flex-col items-center justify-start pt-32 bg-white">
                  <div className="relative mb-8"><div className="w-20 h-20 border-[5px] border-[#EFEBF5] border-t-[#4c3a6e] rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center"><Database className="w-8 h-8 text-[#4c3a6e]" /></div></div>
                  <h3 className="text-xl font-bold text-[#2D243F] mb-2">Estableciendo Conexión Segura</h3><p className="text-slate-400 font-medium">Sincronizando Dashboards Corporativos...</p>
               </div>
            ) : null}

            {activeTab === 'home' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Modelos Registrados</p><h3 className="text-3xl font-bold text-[#2D243F] mt-2">5</h3></div><div className="p-3 bg-[#F0FDF4] rounded-xl text-[#16a34a]"><Layers size={24} /></div></div></div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Modelos con Monitoreo</p><h3 className="text-3xl font-bold text-[#2D243F] mt-2">1</h3></div><div className="p-3 bg-[#F0FDF4] rounded-xl text-[#16a34a]"><Eye size={24} /></div></div></div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Indicadores OK</p><h3 className="text-3xl font-bold text-[#2D243F] mt-2">100%</h3></div><div className="p-3 bg-[#F0FDF4] rounded-xl text-[#16a34a]"><TrendingUp size={24} /></div></div></div>
                  <div className="bg-white p-6 rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100"><div className="flex items-start justify-between"><div><p className="text-sm font-bold text-slate-400 uppercase tracking-wide">Alertas Activas</p><h3 className="text-3xl font-bold text-[#2D243F] mt-2">0</h3></div><div className="p-3 bg-[#F8FAFC] rounded-xl text-slate-400"><AlertCircle size={24} /></div></div></div>
                </div>
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex justify-between items-center"><h3 className="text-xl font-bold text-[#2D243F]">Modelos Activos</h3><button className="text-sm font-bold text-[#4c3a6e] hover:underline">Ver todos</button></div>
                  <div className="p-8">
                    <div className="group border border-slate-200 rounded-2xl p-6 hover:border-[#4c3a6e]/30 hover:shadow-lg hover:shadow-purple-900/5 transition-all cursor-pointer" onClick={() => setActiveTab('performance')}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center space-x-4"><div className="w-12 h-12 bg-[#4c3a6e] rounded-xl flex items-center justify-center text-white font-bold text-lg">TC</div><div><h4 className="text-lg font-bold text-[#2D243F] group-hover:text-[#4c3a6e] transition-colors">Modelo Stock Clientes TC</h4><p className="text-sm text-slate-400">Última actualización: Hace 5 min</p></div></div>
                        <div className="flex items-center space-x-6">
                          <div className="flex flex-col items-end"><span className="text-xs font-bold text-slate-400 uppercase">Estado Monitoreo</span><div className="flex items-center mt-1 text-[#16a34a] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#16a34a]/20"><CheckCircle2 size={14} className="mr-1.5" /><span className="text-sm font-bold">Excelente</span></div></div>
                          <div className="flex flex-col items-end"><span className="text-xs font-bold text-slate-400 uppercase">Alertas</span><span className="text-sm font-bold text-slate-600 mt-1">No presenta alertas</span></div>
                          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#4c3a6e] group-hover:text-white transition-all"><ChevronRight size={18} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conexiones' && (
              <div className="space-y-6">
                <div className="flex justify-end"><button onClick={() => setShowAdminModal(true)} className="flex items-center space-x-2 bg-[#4c3a6e] hover:bg-[#3b2c57] text-white px-5 py-3 rounded-xl font-bold shadow-lg shadow-purple-900/20 transition-all transform active:scale-95"><Plus size={20} /><span>Agregar Nuevo Modelo</span></button></div>
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                       <thead><tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50"><th className="p-6">Nombre del Modelo</th><th className="p-6">Tipo de Algoritmo</th><th className="p-6">Estado Actual</th><th className="p-6">Última Actualización</th><th className="p-6 text-right">Acciones</th></tr></thead>
                       <tbody className="text-sm text-slate-600 font-medium">
                         {MOCK_MODELS.map((model) => (
                           <tr key={model.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors group">
                             <td className="p-6 text-[#2D243F] font-bold">{model.name}</td>
                             <td className="p-6">{model.type}</td>
                             <td className="p-6">
                               <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center w-fit ${model.status === 'Activo' ? 'bg-green-50 text-green-600 border border-green-100' : model.status === 'Inactivo' ? 'bg-slate-100 text-slate-500 border border-slate-200' : model.status === 'Mantenimiento' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                                 <span className={`w-1.5 h-1.5 rounded-full mr-2 ${model.status === 'Activo' ? 'bg-green-600' : model.status === 'Inactivo' ? 'bg-slate-500' : model.status === 'Mantenimiento' ? 'bg-blue-600' : 'bg-amber-600'}`}></span>{model.status}
                               </span>
                             </td>
                             <td className="p-6">{model.lastUpdate}</td>
                             <td className="p-6 text-right"><button onClick={() => setShowAdminModal(true)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#4c3a6e] transition-colors"><MoreHorizontal size={20} /></button></td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="p-8 text-center text-slate-500 h-full flex flex-col items-center justify-center min-h-[600px]">
                <div className="w-20 h-20 bg-[#F8FAFC] rounded-full flex items-center justify-center mb-6"><Settings className="w-10 h-10 text-slate-300" /></div>
                <h3 className="text-xl font-bold text-[#2D243F]">Perfil de {user.displayName}</h3><p className="max-w-md mx-auto mt-2 mb-8 text-slate-400">Sesión activa: {user.email}</p>
                <button onClick={handleLogout} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors">Cerrar Sesión</button>
              </div>
            )}

            <div style={{ display: (activeTab === 'performance' || activeTab === 'estabilidad') ? 'block' : 'none' }} className="w-full h-full relative">
                <div className="w-full h-full overflow-hidden bg-white relative" style={{ display: activeTab === 'performance' ? 'block' : 'none' }}>
                    <iframe title="Report Performance" src={URL_PERFORMANCE} frameBorder="0" allowFullScreen={true} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: `${100 / zoomLevel}%`, height: '2000px', border: 'none', position: 'absolute', top: 0, left: 0 }}></iframe>
                    <div style={{ height: `${2000 * zoomLevel}px`, width: '1px' }}></div><div className="absolute bottom-0 left-0 w-full h-12 bg-white z-20 pointer-events-none"></div>
                </div>
                <div className="w-full h-full overflow-hidden bg-white relative" style={{ display: activeTab === 'estabilidad' ? 'block' : 'none' }}>
                    <iframe title="Report Estabilidad" src={URL_ESTABILIDAD} frameBorder="0" allowFullScreen={true} style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left', width: `${100 / zoomLevel}%`, height: '2000px', border: 'none', position: 'absolute', top: 0, left: 0 }}></iframe>
                    <div style={{ height: `${2000 * zoomLevel}px`, width: '1px' }}></div><div className="absolute bottom-0 left-0 w-full h-12 bg-white z-20 pointer-events-none"></div>
                </div>
            </div>

          </div>
        </div>
      </main>

      {showAdminModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-[#2D243F]/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)}></div>
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-in zoom-in-95 duration-200 border border-slate-100">
             <button onClick={() => setShowAdminModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
             <div className="flex flex-col items-center text-center">
               <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-500 border-4 border-white shadow-lg shadow-amber-500/20"><AlertTriangle size={32} /></div>
               <h3 className="text-xl font-bold text-[#2D243F] mb-2">Acceso Restringido</h3><p className="text-slate-500 mb-6 font-medium leading-relaxed">Esta acción requiere permisos elevados de Administrador del sistema.</p>
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 w-full mb-6 text-left"><p className="text-xs font-bold text-slate-400 uppercase mb-1.5 tracking-wider">Contacto de Soporte</p><div className="flex items-center space-x-2 text-[#4c3a6e] bg-white p-2 rounded-lg border border-slate-100"><Mail size={16} /><span className="text-sm font-bold break-all">eduado.jauregui1@unmsm.edu.pe</span></div></div>
               <button onClick={() => setShowAdminModal(false)} className="w-full bg-[#4c3a6e] hover:bg-[#3b2c57] text-white font-bold py-3.5 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-purple-900/20">Entendido</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, text, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-[#4c3a6e] text-white shadow-lg shadow-[#4c3a6e]/20' : 'text-slate-500 hover:bg-slate-50 hover:text-[#4c3a6e]'}`}>
      <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-[#4c3a6e]'} transition-colors`}>{icon}</div>
      <span className="text-sm font-bold">{text}</span>
      {active && <ChevronRight size={16} className="ml-auto text-white/50" />}
    </button>
  );
}

export default App;