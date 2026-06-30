"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  LogIn,
  LogOut,
  Users,
  ClipboardList,
  Tag,
  BookOpen,
  Plus,
  Check,
  Info,
  Camera,
  ChevronLeft,
  Trash2,
  Copy,
  Search,
  Shield,
  Circle,
  Eye,
  Key,
} from "lucide-react";
import {
  loginAction,
  logoutAction,
  getSession,
  changePasswordAction,
  addCrewAction,
  toggleCrewActiveAction,
  deleteCrewAction,
  addClientAction,
  updateClientAction,
  deleteClientAction,
  toggleChecklistStepAction,
  getClientsAction,
  getCrewAction,
  getOverviewStatsAction,
  assignClientAction,
} from "./actions";
import { SessionData } from "@/lib/auth";
import { PKG_MAP, makeChecklist, progressOf, currentStep, ADD_ONS } from "@/lib/checklist";

/* ---------------- Progress Ring Component ---------------- */
function ProgressRing({ pct = 0, size = 64, stroke = 5, label = true }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = circumference - (pct / 100) * circumference;
  
  // Completed = green (#10b981), In Progress = red (#FF2E2E), Empty = dark gray (#222)
  const strokeColor = pct === 100 ? "#10b981" : pct > 0 ? "#FF2E2E" : "#333336";
  const ticks = Array.from({ length: 24 });

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#1f1f23"
          strokeWidth={stroke}
        />
        {/* Progress track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Aesthetic dial ticks */}
        {ticks.map((_, i) => {
          const angle = (i / 24) * 2 * Math.PI;
          const x1 = size / 2 + (r - stroke / 2) * Math.cos(angle);
          const y1 = size / 2 + (r - stroke / 2) * Math.sin(angle);
          const x2 = size / 2 + (r - stroke / 2 - 1.5) * Math.cos(angle);
          const y2 = size / 2 + (r - stroke / 2 - 1.5) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
          );
        })}
      </svg>
      {label && (
        <div 
          className="absolute font-mono font-bold text-center" 
          style={{ fontSize: size * 0.22, color: strokeColor }}
        >
          {pct}
          <span className="text-[8px] font-sans font-normal opacity-70">%</span>
        </div>
      )}
    </div>
  );
}

/* ---------------- Badge Component ---------------- */
function Badge({ pct }: { pct: number }) {
  if (pct === 100) {
    return (
      <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
        <Check size={10} /> Completed
      </span>
    );
  }
  if (pct > 0) {
    return (
      <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full flex items-center gap-1 select-none">
        <Circle size={4} fill="currentColor" className="text-blue-400" /> In Progress
      </span>
    );
  }
  return (
    <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-white/10 bg-white/5 text-text-secondary px-2 py-0.5 rounded-full select-none">
      Not Started
    </span>
  );
}

export default function StudioPage() {
  // Authentication & Session state
  const [session, setSession] = useState<SessionData | null>(null);
  const [isSessionLoaded, setIsSessionLoaded] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [forcePasswordReset, setForcePasswordReset] = useState(false);

  // Layout & view states
  const [view, setView] = useState("overview");
  const [clients, setClients] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    crewCount: 0,
    activeClients: 0,
    inProgressCount: 0,
    completedCount: 0,
  });
  const [openClient, setOpenClient] = useState<string | null>(null);
  const [openHow, setOpenHow] = useState<Record<string, boolean>>({});
  const [clientSearch, setClientSearch] = useState("");

  // Modals state
  const [modal, setModal] = useState<any>(null);

  // Load Session on Mount
  useEffect(() => {
    async function loadSession() {
      const res = await getSession();
      if (res) {
        setSession(res);
        setView(res.role === "admin" ? "overview" : "jobs");
      }
      setIsSessionLoaded(true);
    }
    loadSession();
  }, []);

  // Fetch Firestore Data
  const refreshData = async () => {
    if (!session) return;

    const clientsRes = await getClientsAction();
    if (clientsRes.success && clientsRes.clients) {
      setClients(clientsRes.clients);
    }

    if (session.role === "admin") {
      const crewRes = await getCrewAction();
      if (crewRes.success && crewRes.crew) {
        setCrew(crewRes.crew);
      }
      
      const statsRes = await getOverviewStatsAction();
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
      }
    }
  };

  // Reload data whenever session changes
  useEffect(() => {
    if (session) {
      refreshData();
    }
  }, [session]);

  // Auth Handlers
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setLoginError("");

    try {
      const res = await loginAction(loginUsername, loginPassword);
      if (res.success) {
        if (res.forcePasswordChange) {
          setForcePasswordReset(true);
        } else {
          const userSession = await getSession();
          setSession(userSession);
          setView(userSession?.role === "admin" ? "overview" : "jobs");
        }
      } else {
        setLoginError(res.error || "Login failed.");
      }
    } catch {
      setLoginError("Failed to connect to authentication server.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAction();
    setSession(null);
    setForcePasswordReset(false);
    setLoginUsername("");
    setLoginPassword("");
    setOpenClient(null);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newPass = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
    const confirmPass = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }

    const res = await changePasswordAction(newPass);
    if (res.success) {
      alert("Password updated successfully!");
      setForcePasswordReset(false);
      const userSession = await getSession();
      setSession(userSession);
      setView(userSession?.role === "admin" ? "overview" : "jobs");
    } else {
      alert(res.error || "Failed to update password.");
    }
  };

  // Toggling Checklist Step
  const handleToggleStep = async (clientId: string, stepId: string, currentVal: boolean) => {
    // Optimistic UI update
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const progress = { ...(c.progress || {}) };
          if (!currentVal) {
            progress[stepId] = true;
          } else {
            delete progress[stepId];
          }
          return { ...c, progress };
        }
        return c;
      })
    );

    const res = await toggleChecklistStepAction(clientId, stepId, !currentVal);
    if (!res.success) {
      // Revert on error
      alert("Update failed: " + res.error);
      refreshData();
    } else {
      // Quietly update stats in background
      if (session?.role === "admin") {
        const statsRes = await getOverviewStatsAction();
        if (statsRes.success && statsRes.stats) {
          setStats(statsRes.stats);
        }
      }
    }
  };

  // Add Crew Logic
  const handleAddCrew = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const crewName = (form.elements.namedItem("crewName") as HTMLInputElement).value;

    const res = await addCrewAction(crewName);
    if (res.success) {
      setModal({
        type: "showCreds",
        name: crewName,
        username: res.username,
        password: res.password,
      });
      refreshData();
    } else {
      alert(res.error || "Failed to create crew member.");
    }
  };

  // Toggle Crew Active Status
  const handleToggleCrewActive = async (crewId: string, currentStatus: boolean) => {
    const res = await toggleCrewActiveAction(crewId, !currentStatus);
    if (res.success) {
      refreshData();
    } else {
      alert(res.error);
    }
  };

  // Delete Crew
  const handleDeleteCrew = async (crewId: string, crewName: string) => {
    if (
      confirm(
        `Are you sure you want to remove ${crewName}? All their assigned clients will become unassigned.`
      )
    ) {
      const res = await deleteCrewAction(crewId);
      if (res.success) {
        refreshData();
      } else {
        alert(res.error);
      }
    }
  };

  // Add Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const bizName = (form.elements.namedItem("bizName") as HTMLInputElement).value;
    const conName = (form.elements.namedItem("conName") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const area = (form.elements.namedItem("area") as HTMLInputElement).value;
    const pkg = (form.elements.namedItem("package") as HTMLSelectElement).value;
    const assign = (form.elements.namedItem("assign") as HTMLSelectElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    const res = await addClientAction(
      bizName,
      conName,
      phone,
      area,
      pkg,
      assign || null,
      notes
    );
    if (res.success) {
      setModal(null);
      refreshData();
    } else {
      alert(res.error);
    }
  };

  // Edit/Update Client
  const handleUpdateClient = async (e: React.FormEvent, clientId: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const bizName = (form.elements.namedItem("bizName") as HTMLInputElement).value;
    const conName = (form.elements.namedItem("conName") as HTMLInputElement).value;
    const phone = (form.elements.namedItem("phone") as HTMLInputElement).value;
    const area = (form.elements.namedItem("area") as HTMLInputElement).value;
    const pkg = (form.elements.namedItem("package") as HTMLSelectElement).value;
    const assign = (form.elements.namedItem("assign") as HTMLSelectElement).value;
    const notes = (form.elements.namedItem("notes") as HTMLTextAreaElement).value;

    const res = await updateClientAction(
      clientId,
      bizName,
      conName,
      phone,
      area,
      pkg,
      assign || null,
      notes
    );
    if (res.success) {
      setModal(null);
      refreshData();
      // Update open client detail header if open
      if (openClient === clientId) {
        setOpenClient(clientId);
      }
    } else {
      alert(res.error);
    }
  };

  // Delete Client
  const handleDeleteClient = async (clientId: string, bizName: string) => {
    if (confirm(`Are you sure you want to permanently delete the job for "${bizName}"?`)) {
      const res = await deleteClientAction(clientId);
      if (res.success) {
        setOpenClient(null);
        setModal(null);
        refreshData();
      } else {
        alert(res.error);
      }
    }
  };

  // Helper mapping package names
  const getPackageName = (key: string) => {
    return PKG_MAP[key]?.name || key;
  };

  // Filtered clients list based on search
  const filteredClients = useMemo(() => {
    return clients.filter(
      (c) =>
        c.businessName.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.contactName.toLowerCase().includes(clientSearch.toLowerCase()) ||
        c.area.toLowerCase().includes(clientSearch.toLowerCase())
    );
  }, [clients, clientSearch]);

  const activeClientObject = useMemo(() => {
    return clients.find((c) => c.id === openClient) || null;
  }, [clients, openClient]);

  // Loading Screen
  if (!isSessionLoaded) {
    return (
      <div className="min-h-screen bg-[#090909] grid place-items-center text-text-secondary font-mono text-xs">
        // CONNECTING SECURE OPS SHELL...
      </div>
    );
  }

  /* ---------------- FORCE PASSWORD RESET VIEW ---------------- */
  if (forcePasswordReset) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-morphism p-8 rounded-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-[100px] w-[100px] bg-mad-red/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-2 mb-6">
            <Key className="text-mad-red" size={20} />
            <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
              // INITIAL SECURITY LOCK
            </h1>
          </div>
          <h2 className="font-sans font-black text-2xl tracking-tighter uppercase mb-2">
            Reset Password
          </h2>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            This is your first login. To secure your account, you must set a new password.
          </p>

          <form onSubmit={handlePasswordReset} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">
                New Password (min 6 chars)
              </label>
              <input
                name="newPassword"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-[#151515] border border-white/10 text-white rounded p-3 font-mono text-sm focus:border-mad-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">
                Confirm New Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full bg-[#151515] border border-white/10 text-white rounded p-3 font-mono text-sm focus:border-mad-red focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-mad-red hover:bg-red-600 text-white font-mono font-bold uppercase text-xs tracking-wider py-3.5 rounded transition-all duration-300"
            >
              SAVE PASSWORD & ENTER
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- LOGIN BOX VIEW ---------------- */
  if (!session) {
    return (
      <div className="min-h-screen bg-[#090909] text-white flex items-center justify-center p-4 relative overflow-hidden">
        {/* Dynamic backdrop SVG rings */}
        <div className="absolute inset-0 grid place-items-center pointer-events-none opacity-20">
          <svg width="600" height="600" viewBox="0 0 600 600">
            <circle cx="300" cy="300" r="280" fill="none" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="5 5" />
            <circle cx="300" cy="300" r="200" fill="none" stroke="#FF2E2E" strokeWidth="0.5" />
            <circle cx="300" cy="300" r="120" fill="none" stroke="#FF2E2E" strokeWidth="1" strokeDasharray="20 10" />
            <circle cx="300" cy="300" r="60" fill="none" stroke="#FF2E2E" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="w-full max-w-sm glass-morphism p-8 rounded-2xl relative z-10 shadow-2xl shadow-black/80">
          <div className="flex items-center gap-1.5 mb-2 select-none">
            <span className="h-2 w-2 rounded-full bg-mad-red animate-pulse" />
            <span className="font-sans font-black text-xl tracking-tighter uppercase text-white">
              MAD.CO
            </span>
          </div>
          <div className="text-text-secondary font-mono text-[9px] tracking-widest uppercase mb-6">
            // FIELD VISUALS MANAGEMENT PORTAL
          </div>

          <h2 className="font-sans font-black text-2xl tracking-tighter uppercase mb-1">
            Sign In
          </h2>
          <p className="text-xs text-text-secondary mb-6 leading-relaxed">
            Enter your field credentials to access assigned jobs, checklist tasks, and technical guidebook specifications.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="e.g. arjun07"
                className="w-full bg-[#151515] border border-white/10 text-white rounded p-3 font-mono text-sm focus:border-mad-red focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#151515] border border-white/10 text-white rounded p-3 font-mono text-sm focus:border-mad-red focus:outline-none"
              />
            </div>

            {loginError && (
              <div className="text-xs text-mad-red font-mono uppercase bg-mad-red/5 border border-mad-red/20 p-3 rounded">
                // ERROR: {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-2 bg-mad-red hover:bg-red-600 text-white font-mono font-bold uppercase text-xs tracking-wider py-3.5 rounded transition-all duration-300 disabled:opacity-50"
            >
              {isLoggingIn ? "AUTHENTICATING..." : "AUTHORIZE ACCESS"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- LOGGED IN LAYOUT ---------------- */
  const isAdmin = session.role === "admin";
  const navItems = isAdmin
    ? [
        ["overview", "Overview", ClipboardList],
        ["crew", "Crew Logins", Users],
        ["clients", "Client Jobs", Camera],
        ["pricing", "Prices & Scope", Tag],
        ["guide", "Field SOP", BookOpen],
      ]
    : [
        ["jobs", "My Assigned Jobs", Camera],
        ["pricing", "Prices & Scope", Tag],
        ["guide", "Field SOP", BookOpen],
      ];

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col md:flex-row">
      {/* 1. Navigation Shell */}
      <nav className="w-full md:w-60 md:flex-shrink-0 border-b md:border-b-0 md:border-r border-white/5 bg-[#0F0F10] flex flex-row md:flex-col p-4 md:p-6 gap-2 md:gap-1.5 overflow-x-auto md:overflow-x-visible md:h-screen md:sticky md:top-0 scrollbar-none">
        
        {/* Brand Header */}
        <div className="hidden md:flex items-center gap-1.5 mb-6 px-2">
          <span className="h-2.5 w-2.5 rounded-full bg-mad-red animate-pulse" />
          <span className="font-sans font-black text-xl tracking-tighter uppercase text-white">
            MAD.CO <span className="text-text-secondary font-mono text-[9px] tracking-wider ml-1">// OPS</span>
          </span>
        </div>

        {/* Tab Item Selectors */}
        {navItems.map(([key, label, Icon]: any) => (
          <button
            key={key}
            onClick={() => {
              setView(key);
              setOpenClient(null);
            }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded font-mono text-xs uppercase tracking-wider transition-all duration-300 flex-shrink-0 md:w-full ${
              view === key && !openClient
                ? "bg-mad-red/10 border border-mad-red/30 text-white font-bold"
                : "border border-transparent text-text-secondary hover:text-white hover:bg-white/5"
            }`}
          >
            <Icon size={14} className={view === key && !openClient ? "text-mad-red" : ""} />
            <span>{label}</span>
          </button>
        ))}

        <div className="md:mt-auto hidden md:block" />

        {/* User Info / Logout block */}
        <div className="ml-auto md:ml-0 flex items-center md:items-start gap-4 md:flex-col md:gap-3 border-l border-white/10 pl-4 md:border-l-0 md:pl-0 md:border-t md:border-white/5 md:pt-4 flex-shrink-0">
          <div className="flex flex-col">
            <span className="font-sans font-black text-xs text-white uppercase truncate max-w-[120px] md:max-w-none">
              {session.name}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-text-secondary uppercase">
              @{session.username} ({session.role})
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 border border-white/10 hover:border-mad-red hover:text-mad-red px-3 py-1.5 rounded font-mono text-[9px] tracking-wider uppercase transition-colors"
          >
            <LogOut size={10} />
            <span>EXIT</span>
          </button>
        </div>
      </nav>

      {/* 2. Main Content Dashboard Container */}
      <main className="flex-grow p-4 md:p-8 max-w-6xl w-full mx-auto">
        
        {/* VIEW: Client Detail (if one is open) */}
        {openClient && activeClientObject ? (
          <div>
            {/* Back Button & Header actions */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={() => setOpenClient(null)}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-text-secondary hover:text-white transition-colors"
              >
                <ChevronLeft size={14} />
                <span>BACK TO LIST</span>
              </button>
              
              {isAdmin && (
                <button
                  onClick={() =>
                    setModal({
                      type: "editClient",
                      client: activeClientObject,
                    })
                  }
                  className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 text-white font-mono text-[10px] tracking-wider uppercase px-3 py-1.5 rounded transition-all"
                >
                  Edit Job Info
                </button>
              )}
            </div>

            {/* Client card overview */}
            {(() => {
              const pr = progressOf(activeClientObject);
              const assignedCrew = crew.find((u) => u.id === activeClientObject.assignedTo);
              const clientChecklist = makeChecklist(activeClientObject.package);

              return (
                <div>
                  <div className="glass-morphism p-6 rounded-xl flex flex-col sm:flex-row sm:items-center gap-6 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-[120px] w-[120px] bg-mad-red/5 blur-3xl rounded-full" />
                    
                    {/* Ring Signature */}
                    <div className="flex-shrink-0 flex justify-center">
                      <ProgressRing pct={pr.pct} size={80} stroke={6} />
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <h2 className="font-sans font-black text-2xl tracking-tighter uppercase text-white truncate max-w-md">
                          {activeClientObject.businessName}
                        </h2>
                        <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-mad-red/30 bg-mad-red/10 text-mad-red px-2 py-0.5 rounded-full">
                          {getPackageName(activeClientObject.package)}
                        </span>
                        {pr.pct === 100 ? (
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check size={10} /> Completed
                          </span>
                        ) : pr.pct > 0 ? (
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-blue-500/30 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">
                            In Progress
                          </span>
                        ) : (
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-white/10 bg-white/5 text-text-secondary px-2 py-0.5 rounded-full">
                            Not Started
                          </span>
                        )}
                      </div>

                      <div className="font-sans text-xs text-text-secondary flex flex-wrap gap-x-4 gap-y-1 mb-3">
                        <span><strong>Contact:</strong> {activeClientObject.contactName}</span>
                        <span><strong>Phone:</strong> {activeClientObject.phone}</span>
                        <span><strong>Area:</strong> {activeClientObject.area}</span>
                        {assignedCrew && (
                          <span><strong>Assigned Crew:</strong> {assignedCrew.name}</span>
                        )}
                      </div>

                      {activeClientObject.notes && (
                        <div className="text-xs text-text-secondary max-w-2xl bg-black/30 border border-white/5 p-3 rounded leading-relaxed mb-3">
                          <span className="font-mono text-[9px] text-white tracking-widest uppercase block mb-1">
                            // WORK ORDER NOTES:
                          </span>
                          {activeClientObject.notes}
                        </div>
                      )}

                      <div className="font-mono text-[10px] tracking-wider text-text-secondary">
                        {pr.done} of {pr.total} steps checked off · Next:{" "}
                        <span className="text-white font-bold">{currentStep(activeClientObject)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Checklist Phases rendering */}
                  <div className="space-y-10">
                    {clientChecklist.map((phase: any, phaseIndex: number) => (
                      <div key={phase.name} className="relative">
                        {/* Section Header Eyebrow */}
                        <div className="flex items-center gap-2 mb-4 select-none">
                          <span className="font-mono text-mad-red text-xs font-bold tracking-widest">
                            //{String(phaseIndex + 1).padStart(2, "0")}
                          </span>
                          <h3 className="font-mono font-bold text-xs uppercase tracking-widest text-text-secondary">
                            {phase.name}
                          </h3>
                        </div>

                        {/* List items */}
                        <div className="space-y-2">
                          {phase.items.map((item: any) => {
                            const isChecked = !!activeClientObject.progress?.[item.id];
                            const isOpen = !!openHow[activeClientObject.id + item.id];
                            const key = activeClientObject.id + item.id;
                            
                            // Permission: can edit if admin or assigned crew
                            const canEdit = isAdmin || activeClientObject.assignedTo === session.userId;

                            return (
                              <div
                                key={item.id}
                                className={`border border-white/5 rounded-lg overflow-hidden transition-all duration-300 ${
                                  isChecked ? "bg-white/[0.01]" : "bg-[#0F0F10]"
                                }`}
                              >
                                <div className="flex items-center gap-4 p-4 min-h-[48px]">
                                  {/* Custom Checkbox */}
                                  <button
                                    disabled={!canEdit}
                                    onClick={() =>
                                      handleToggleStep(
                                        activeClientObject.id,
                                        item.id,
                                        isChecked
                                      )
                                    }
                                    className={`h-5 w-5 rounded border flex items-center justify-center transition-all ${
                                      isChecked
                                        ? "bg-emerald-500 border-emerald-500 text-[#090909]"
                                        : "border-white/20 hover:border-mad-red bg-transparent text-transparent"
                                    } disabled:opacity-50`}
                                  >
                                    <Check size={14} strokeWidth={3} />
                                  </button>

                                  {/* Step Text */}
                                  <span
                                    className={`flex-grow text-xs leading-relaxed transition-all ${
                                      isChecked
                                        ? "text-text-secondary line-through"
                                        : "text-white font-medium"
                                    }`}
                                  >
                                    {item.text}
                                  </span>

                                  {/* Info Toggle Button */}
                                  <button
                                    onClick={() =>
                                      setOpenHow((prev) => ({
                                        ...prev,
                                        [key]: !prev[key],
                                      }))
                                    }
                                    className={`h-7 w-7 rounded border flex items-center justify-center transition-colors ${
                                      isOpen
                                        ? "border-mad-red/40 bg-mad-red/10 text-mad-red"
                                        : "border-white/5 hover:border-white/10 text-text-secondary hover:text-white"
                                    }`}
                                  >
                                    <Info size={13} />
                                  </button>
                                </div>

                                {/* Expanded detailed instructions info box */}
                                {isOpen && (
                                  <div className="px-5 pb-4 pt-3 border-t border-white/5 bg-black/40 text-text-secondary text-[11px] leading-relaxed whitespace-pre-line font-sans">
                                    <span className="font-mono text-[9px] text-white tracking-wider block mb-1">
                                      // TECHNICAL METHOD:
                                    </span>
                                    {item.how}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* STANDARD TAB VIEWS */
          <div>
            {/* VIEW: ADMIN OVERVIEW */}
            {view === "overview" && isAdmin && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <ClipboardList className="text-mad-red" size={18} />
                  <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                    // STUDIO OVERVIEW
                  </h1>
                </div>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {[
                    ["Active Clients", stats.activeClients],
                    ["In Progress", stats.inProgressCount],
                    ["Completed", stats.completedCount],
                    ["Field Crew", stats.crewCount],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="glass-morphism p-6 rounded-xl flex flex-col justify-between hover:border-mad-red/35 transition-all duration-300"
                    >
                      <span className="text-text-secondary font-mono text-[10px] uppercase tracking-wider">
                        {label}
                      </span>
                      <span className="text-3xl font-sans font-black tracking-tighter mt-4">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Crew Workload list */}
                <div className="glass-morphism p-6 rounded-xl">
                  <h2 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary mb-4">
                    // CREW WORKLOAD & PROGRESS
                  </h2>
                  <div className="divide-y divide-white/5">
                    {crew.map((u) => {
                      const userClients = clients.filter((c) => c.assignedTo === u.id);
                      const avgPct =
                        userClients.length > 0
                          ? Math.round(
                              userClients.reduce((sum, c) => sum + progressOf(c).pct, 0) /
                                userClients.length
                            )
                          : 0;

                      return (
                        <div key={u.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded bg-white/5 border border-white/10 flex items-center justify-center font-sans font-black text-xs text-white">
                              {u.name[0]}
                            </div>
                            <div>
                              <div className="font-sans font-bold text-sm text-white">{u.name}</div>
                              <div className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
                                @{u.username} · {userClients.length} job{userClients.length !== 1 ? "s" : ""} assigned
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] text-text-secondary hidden sm:inline">
                              AVG. PROGRESS
                            </span>
                            <ProgressRing pct={avgPct} size={42} stroke={4} />
                          </div>
                        </div>
                      );
                    })}

                    {crew.length === 0 && (
                      <div className="text-center py-6 text-xs text-text-secondary font-mono">
                        // NO CREW CREATED YET
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: CREW MANAGEMENT */}
            {view === "crew" && isAdmin && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="text-mad-red" size={18} />
                    <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                      // CREW LOGINS & SYSTEM ACCESS
                    </h1>
                  </div>
                  <button
                    onClick={() => setModal({ type: "addCrew" })}
                    className="flex items-center gap-1.5 bg-mad-red hover:bg-red-600 text-white font-mono font-bold uppercase text-[10px] tracking-wider px-3.5 py-2 rounded transition-all duration-300"
                  >
                    <Plus size={12} /> ADD NEW CREW
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {crew.map((u) => {
                    const assignedJobs = clients.filter((c) => c.assignedTo === u.id).length;
                    return (
                      <div
                        key={u.id}
                        className="glass-morphism p-5 rounded-xl flex flex-col justify-between gap-4 hover:border-mad-red/35 transition-all duration-300"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded bg-white/5 border border-white/10 flex items-center justify-center font-sans font-black text-xs text-white">
                              {u.name[0]}
                            </div>
                            <div>
                              <div className="font-sans font-bold text-sm text-white">{u.name}</div>
                              <div className="font-mono text-[9px] text-text-secondary tracking-widest uppercase">
                                @{u.username}
                              </div>
                            </div>
                          </div>

                          {/* Active / Deactivated indicator */}
                          <button
                            onClick={() => handleToggleCrewActive(u.id, u.isActive)}
                            className={`font-mono text-[9px] uppercase tracking-wider border px-2 py-0.5 rounded-full font-bold ${
                              u.isActive
                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                                : "border-mad-red/30 bg-mad-red/10 text-mad-red"
                            }`}
                          >
                            {u.isActive ? "ACTIVE" : "SUSPENDED"}
                          </button>
                        </div>

                        <div className="font-sans text-xs text-text-secondary">
                          Assigned Workload: <strong>{assignedJobs}</strong> active client jobs.
                        </div>

                        <div className="flex gap-2 border-t border-white/5 pt-3">
                          <button
                            onClick={() =>
                              setModal({
                                type: "showCreds",
                                name: u.name,
                                username: u.username,
                                password: null, // Hidden unless re-seeded
                              })
                            }
                            className="flex-grow flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20 bg-white/5 text-white font-mono text-[9px] tracking-wider uppercase py-2 rounded transition-all"
                          >
                            <Shield size={10} /> VIEW DETAILS
                          </button>
                          <button
                            onClick={() => handleDeleteCrew(u.id, u.name)}
                            className="border border-white/10 hover:border-mad-red hover:text-mad-red bg-white/5 text-text-secondary px-3 py-2 rounded transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {crew.length === 0 && (
                    <div className="col-span-full border border-dashed border-white/10 p-12 text-center text-text-secondary text-xs font-mono rounded-xl">
                      // NO CREW LOGINS DETECTED. CLICK "ADD NEW CREW" TO GENERATE ONE.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: CLIENTS DASHBOARD (ADMIN) */}
            {view === "clients" && isAdmin && (
              <div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Camera className="text-mad-red" size={18} />
                    <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                      // MASTER CLIENT RECORDS
                    </h1>
                  </div>

                  <div className="flex w-full sm:w-auto items-center gap-2 flex-wrap">
                    {/* Search Field */}
                    <div className="flex items-center gap-2 bg-[#151515] border border-white/10 rounded px-3 py-2 text-xs font-mono text-white flex-grow sm:flex-grow-0 sm:w-60">
                      <Search size={12} className="text-text-secondary" />
                      <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        placeholder="Search clients / areas…"
                        className="bg-transparent border-0 outline-none text-white w-full text-xs font-sans"
                      />
                    </div>

                    <button
                      onClick={() => setModal({ type: "addClient" })}
                      className="bg-mad-red hover:bg-red-600 text-white font-mono font-bold uppercase text-[10px] tracking-wider px-3.5 py-2.5 rounded transition-all duration-300 flex-shrink-0"
                    >
                      <Plus size={12} /> ADD CLIENT JOB
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredClients.map((c) => {
                    const pr = progressOf(c);
                    const assignedCrew = crew.find((u) => u.id === c.assignedTo);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setOpenClient(c.id)}
                        className="glass-morphism p-5 rounded-xl flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 hover:border-mad-red/35 hover:-translate-y-0.5 shadow-md shadow-black/40"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="font-sans font-black text-lg tracking-tighter uppercase text-white truncate">
                              {c.businessName}
                            </h3>
                            <span className="font-mono text-[8px] tracking-widest text-text-secondary uppercase">
                              {c.area}
                            </span>
                          </div>
                          <ProgressRing pct={pr.pct} size={46} stroke={4.5} />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-mad-red/30 bg-mad-red/10 text-mad-red px-2 py-0.5 rounded-full">
                            {getPackageName(c.package)}
                          </span>
                          <Badge pct={pr.pct} />
                        </div>

                        <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] font-mono text-text-secondary">
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <span className="opacity-80">CREW:</span>
                            <select
                              value={c.assignedTo || ""}
                              onChange={async (e) => {
                                const val = e.target.value || null;
                                // Optimistically update state
                                setClients((prev) =>
                                  prev.map((item) =>
                                    item.id === c.id ? { ...item, assignedTo: val } : item
                                  )
                                );
                                const res = await assignClientAction(c.id, val);
                                if (!res.success) {
                                  alert(res.error || "Failed to update assignment.");
                                  refreshData();
                                }
                              }}
                              className="bg-[#151515] border border-white/10 hover:border-mad-red/50 rounded px-1.5 py-0.5 text-[9px] font-mono text-white focus:outline-none transition-colors cursor-pointer"
                            >
                              <option value="">UNASSIGNED</option>
                              {crew.map((u) => (
                                <option key={u.id} value={u.id}>
                                  {u.name.toUpperCase()}
                                </option>
                              ))}
                            </select>
                          </div>
                          <span className="text-white font-bold">{pr.pct}%</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredClients.length === 0 && (
                    <div className="col-span-full border border-dashed border-white/10 p-12 text-center text-text-secondary text-xs font-mono rounded-xl">
                      // NO CLIENT JOBS MATCHING FILTER
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: CREW JOBS PANEL (CREW ROLE) */}
            {view === "jobs" && !isAdmin && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Camera className="text-mad-red" size={18} />
                  <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                    // MY ASSIGNED JOBS
                  </h1>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clients.map((c) => {
                    const pr = progressOf(c);
                    return (
                      <div
                        key={c.id}
                        onClick={() => setOpenClient(c.id)}
                        className="glass-morphism p-5 rounded-xl flex flex-col justify-between gap-4 cursor-pointer transition-all duration-300 hover:border-mad-red/35 hover:-translate-y-0.5 shadow-md shadow-black/40"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="font-sans font-black text-lg tracking-tighter uppercase text-white truncate">
                              {c.businessName}
                            </h3>
                            <span className="font-mono text-[8px] tracking-widest text-text-secondary uppercase">
                              {c.area}
                            </span>
                          </div>
                          <ProgressRing pct={pr.pct} size={46} stroke={4.5} />
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold border border-mad-red/30 bg-mad-red/10 text-mad-red px-2 py-0.5 rounded-full">
                            {getPackageName(c.package)}
                          </span>
                          <Badge pct={pr.pct} />
                        </div>

                        <div className="border-t border-white/5 pt-3 font-mono text-[10px] text-text-secondary truncate">
                          Next: <span className="text-white font-bold">{currentStep(c)}</span>
                        </div>
                      </div>
                    );
                  })}

                  {clients.length === 0 && (
                    <div className="col-span-full border border-dashed border-white/10 p-12 text-center text-text-secondary text-xs font-mono rounded-xl">
                      // NO CLIENT JOBS ASSIGNED TO YOU YET. CHECK WITH THE OWNER.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* VIEW: PRICES & SCOPE TAB (READ-ONLY FOR EVERYONE) */}
            {view === "pricing" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <Tag className="text-mad-red" size={18} />
                  <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                    // PACKAGES & INTERNAL SCOPE
                  </h1>
                </div>

                {/* Main Website Packages */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  {Object.values(PKG_MAP)
                    .filter((p) => p.key !== "growth_care")
                    .map((p) => (
                      <div
                        key={p.key}
                        className="glass-morphism p-6 rounded-xl flex flex-col justify-between gap-6 hover:border-mad-red/35 transition-all duration-300"
                      >
                        <div>
                          <h3 className="font-sans font-black text-xl tracking-tighter uppercase text-white mb-1">
                            {p.name}
                          </h3>
                          <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-2xl font-mono font-bold text-mad-red">
                              ₹{p.priceFounding.toLocaleString()}
                            </span>
                            <span className="text-xs text-text-secondary line-through">
                              ₹{p.priceOriginal.toLocaleString()}
                            </span>
                          </div>

                          <ul className="text-xs text-text-secondary space-y-2 border-t border-white/5 pt-4">
                            <li>
                              <strong>Capture Points:</strong> {p.points} points
                            </li>
                            <li>
                              <strong>Edited Still Photos:</strong> {p.stills}
                            </li>
                            <li>
                              <strong>Hosting Duration:</strong>{" "}
                              {p.key === "starter" ? "2-Year" : p.key === "pro" ? "3-Year" : "5-Year"}
                            </li>
                            <li className="flex items-center gap-1">
                              <strong>Business Optimization:</strong>{" "}
                              {p.optimize ? (
                                <span className="text-emerald-400">Yes</span>
                              ) : (
                                <span className="opacity-50">No</span>
                              )}
                            </li>
                            <li className="flex items-center gap-1">
                              <strong>Interactive Tour Branded App:</strong>{" "}
                              {p.hosted ? (
                                <span className="text-emerald-400">Yes</span>
                              ) : (
                                <span className="opacity-50">No</span>
                              )}
                            </li>
                            <li className="flex items-center gap-1">
                              <strong>Social Reel Included:</strong>{" "}
                              {p.reel ? (
                                <span className="text-emerald-400">Yes</span>
                              ) : (
                                <span className="opacity-50">No</span>
                              )}
                            </li>
                          </ul>
                        </div>
                        <div className="text-[10px] font-mono text-text-secondary tracking-wide uppercase border-t border-white/5 pt-4">
                          TIMELINE: {p.timeline}
                        </div>
                      </div>
                    ))}
                </div>

                {/* Growth Care Plan & Internal Add-ons */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Growth Care */}
                  <div className="glass-morphism p-6 rounded-xl flex flex-col justify-between hover:border-mad-red/35 transition-all duration-300">
                    <div>
                      <h3 className="font-sans font-black text-xl tracking-tighter uppercase text-white mb-1">
                        Growth Care Plan
                      </h3>
                      <div className="text-xl font-mono font-bold text-mad-red mb-4">
                        ₹2,999 <span className="text-xs font-sans text-text-secondary">/ month</span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed mb-4">
                        Monthly recurring upkeep package designed to keep client Google Business Profiles optimized and virtual tours live and active.
                      </p>
                      <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1.5">
                        <li>Log into Google Business Profile.</li>
                        <li>Post 1–2 fresh photos monthly.</li>
                        <li>Update hours / offers.</li>
                        <li>Confirm 360 tour remains online.</li>
                        <li>Monthly Performance report sent to client.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Add-ons list */}
                  <div className="glass-morphism p-6 rounded-xl">
                    <h3 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary mb-4">
                      // INTERNAL SERVICES ADD-ONS (Quote On Spot)
                    </h3>
                    <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2">
                      {ADD_ONS.map((addon) => (
                        <div
                          key={addon.name}
                          className="py-2.5 flex items-center justify-between text-xs gap-4 first:pt-0 last:pb-0"
                        >
                          <span className="text-text-secondary font-medium">{addon.name}</span>
                          <span className="font-mono font-bold text-mad-red">
                            {typeof addon.price === "number" ? `₹${addon.price}` : addon.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: GUIDEBOOK / FIELD WORKER SOP */}
            {view === "guide" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <BookOpen className="text-mad-red" size={18} />
                  <h1 className="font-mono text-xs uppercase font-bold tracking-widest text-text-secondary">
                    // FIELD WORKER SOP & GUIDEBOOK
                  </h1>
                </div>

                <div className="glass-morphism p-6 md:p-8 rounded-xl space-y-8 font-sans leading-relaxed text-text-secondary text-sm">
                  
                  {/* Section: Image Specifications */}
                  <div>
                    <h3 className="font-mono text-white text-xs uppercase tracking-widest mb-3 font-bold">
                      01. 360 Image Specifications
                    </h3>
                    <p className="mb-3">
                      Every panorama uploaded must conform exactly to these constraints, otherwise the Google Maps processor will reject it:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 mb-3">
                      <li><strong>Resolution:</strong> 4K or higher (minimum 7.5 megapixels).</li>
                      <li><strong>Aspect Ratio:</strong> Exactly 2:1 width-to-height (e.g. 5760 x 2880).</li>
                      <li><strong>Format:</strong> High-quality JPEG.</li>
                      <li><strong>Projection:</strong> Equirectangular format with 360 spatial metadata kept.</li>
                    </ul>
                    <div className="border-l-2 border-mad-red bg-mad-red/5 p-3 rounded text-xs text-white leading-relaxed">
                      <strong>TIP:</strong> If a modified/edited photo fails Google verification, do not resize it. Run the JPEG through PanoCool's free optimizer tool to re-inject standard spatial metadata tags.
                    </div>
                  </div>

                  {/* Section: PanoCool Walkthrough */}
                  <div>
                    <h3 className="font-mono text-white text-xs uppercase tracking-widest mb-3 font-bold">
                      02. PanoCool Connected Tours Walkthrough
                    </h3>
                    <p className="mb-3">
                      To publish connected walkthrough tours where the customer can click arrows to walk from room to room:
                    </p>
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Go to <strong>https://pano.cool/tools/street-view-publisher</strong> and authorize access using your company Google account.</li>
                      <li>Drag and drop all finished 360 JPEGs.</li>
                      <li>Assign the photos to the client's place on Google Maps using the place search.</li>
                      <li>Position the red dots representing each photo onto the floor plan map correctly.</li>
                      <li>Rotate the blue anchor node to align the view direction with the real room layout.</li>
                      <li>Create links (connections) between adjacent dots so visitors can navigate.</li>
                      <li>Click <strong>Start Upload & Publish</strong>.</li>
                    </ol>
                    <p className="mt-2 text-xs italic">
                      Note: Walking arrows can take up to 4 days to compile on Google Maps. Warn the client.
                    </p>
                  </div>

                  {/* Section: Google Business Profile integration */}
                  <div>
                    <h3 className="font-mono text-white text-xs uppercase tracking-widest mb-3 font-bold">
                      03. Google Business Profile setup
                    </h3>
                    <p className="mb-3">
                      Attach the best 360 panorama directly to their Business Profile dashboard to make the visual link appear:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1.5">
                      <li>Log into <strong>business.google.com</strong> (requires manager access).</li>
                      <li>Go to Photos → 360 → Upload.</li>
                      <li>Select the equirectangular images.</li>
                      <li>Select the best panorama and define it as the <strong>Interior cover photo</strong>.</li>
                    </ol>
                  </div>

                  {/* Section: Client Handoff Message */}
                  <div>
                    <h3 className="font-mono text-white text-xs uppercase tracking-widest mb-3 font-bold">
                      04. Delivery Message Template
                    </h3>
                    <p className="mb-3">
                      Copy and modify this template when delivering a finalized pack via WhatsApp or Email:
                    </p>
                    <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-xs text-white whitespace-pre-wrap select-all leading-normal">
{`Hello [Client Name], your MAD.CO Google 360 virtual tour is complete. 🎉

Included in your [Package] package:
• Final tour link: [paste link]
• Edited photos: [attached / drive link]
• QR code: [attached, if applicable]
• Google Business Profile updated: ✅

How to use it:
- Add the link to your website, Google profile, and social bio.
- Print the QR code on your menu/poster so customers can scan and explore.

Note: the full walkthrough with connecting arrows can take a few days to fully appear on Google Maps.

Please review everything and reply to confirm you've received it. Thank you for choosing MAD.CO!`}
                    </div>
                  </div>

                  {/* Section: Internal Rules */}
                  <div>
                    <h3 className="font-mono text-white text-xs uppercase tracking-widest mb-3 font-bold">
                      05. Core Internal Rules
                    </h3>
                    <ul className="list-disc pl-5 space-y-1.5">
                      <li>Anything not in the sold package is an ADD-ON. Never give free extras.</li>
                      <li>Never publish blurry, messy, or crooked tours. Re-check the lens on-site.</li>
                      <li>Always test links and QR codes on your own phone before sending them to the client.</li>
                      <li>Keep all raw files backed up until the client confirms receipt and signs off.</li>
                    </ul>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ---------------- MODALS LAYER ---------------- */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm grid place-items-center p-4 z-50">
          
          {/* MODAL: ADD CREW */}
          {modal.type === "addCrew" && (
            <div className="w-full max-w-sm glass-morphism p-6 rounded-xl relative">
              <h3 className="font-sans font-black text-xl uppercase text-white mb-4">
                Add Crew Login
              </h3>
              <form onSubmit={handleAddCrew} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">
                    Crew Member Name
                  </label>
                  <input
                    name="crewName"
                    type="text"
                    required
                    placeholder="e.g. Arjun Dev"
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="border border-white/10 hover:bg-white/5 text-text-secondary px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-mad-red hover:bg-red-600 text-white px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Generate Credentials
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL: SHOW CREATIVE CREDENTIALS */}
          {modal.type === "showCreds" && (
            <div className="w-full max-w-sm glass-morphism p-6 rounded-xl">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <Shield size={16} />
                <h3 className="font-sans font-black text-lg uppercase">
                  Account Created
                </h3>
              </div>
              <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                Hand these temporary credentials over to <strong>{modal.name}</strong>. They will be forced to set a new password on their first sign in.
              </p>

              <div className="space-y-3 bg-black/45 border border-white/5 p-4 rounded text-xs mb-4">
                <div>
                  <span className="text-[9px] font-mono text-text-secondary uppercase block mb-1">
                    Username
                  </span>
                  <div className="font-mono text-white font-bold flex items-center justify-between">
                    <span>{modal.username}</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(modal.username);
                        alert("Username copied!");
                      }}
                      className="text-text-secondary hover:text-white"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>

                {modal.password && (
                  <div>
                    <span className="text-[9px] font-mono text-text-secondary uppercase block mb-1">
                      Temporary Password
                    </span>
                    <div className="font-mono text-mad-red font-bold flex items-center justify-between">
                      <span>{modal.password}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(modal.password);
                          alert("Password copied!");
                        }}
                        className="text-text-secondary hover:text-white"
                      >
                        <Copy size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setModal(null)}
                className="w-full bg-white/5 hover:bg-white/10 text-white font-mono text-[10px] tracking-wider uppercase py-2.5 rounded transition-all"
              >
                DONE & CLOSE
              </button>
            </div>
          )}

          {/* MODAL: ADD CLIENT JOB */}
          {modal.type === "addClient" && (
            <div className="w-full max-w-md glass-morphism p-6 rounded-xl">
              <h3 className="font-sans font-black text-xl uppercase text-white mb-4">
                Add Client Job
              </h3>
              <form onSubmit={handleAddClient} className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Business Name
                    </label>
                    <input
                      name="bizName"
                      type="text"
                      required
                      placeholder="Coastal Brew Cafe"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Contact Name
                    </label>
                    <input
                      name="conName"
                      type="text"
                      required
                      placeholder="Roy Fernandes"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="text"
                      required
                      placeholder="+91 9876543210"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Area / Neighborhood
                    </label>
                    <input
                      name="area"
                      type="text"
                      required
                      placeholder="Balmatta, Mangalore"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Package Selection
                    </label>
                    <select
                      name="package"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    >
                      {Object.values(PKG_MAP).map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Assign To Crew
                    </label>
                    <select
                      name="assign"
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {crew.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                    Job Instructions / Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Enter any custom landmarks, specific shoot times, or client requirements..."
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none resize-none font-sans"
                  />
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="border border-white/10 hover:bg-white/5 text-text-secondary px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-mad-red hover:bg-red-600 text-white px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MODAL: EDIT CLIENT JOB */}
          {modal.type === "editClient" && (
            <div className="w-full max-w-md glass-morphism p-6 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-sans font-black text-xl uppercase text-white">
                  Edit Client Job
                </h3>
                <button
                  type="button"
                  onClick={() => handleDeleteClient(modal.client.id, modal.client.businessName)}
                  className="text-text-secondary hover:text-mad-red p-1 rounded transition-colors"
                  title="Delete Client"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <form
                onSubmit={(e) => handleUpdateClient(e, modal.client.id)}
                className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto pr-2"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Business Name
                    </label>
                    <input
                      name="bizName"
                      type="text"
                      required
                      defaultValue={modal.client.businessName}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Contact Name
                    </label>
                    <input
                      name="conName"
                      type="text"
                      required
                      defaultValue={modal.client.contactName}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Phone Number
                    </label>
                    <input
                      name="phone"
                      type="text"
                      required
                      defaultValue={modal.client.phone}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Area / Neighborhood
                    </label>
                    <input
                      name="area"
                      type="text"
                      required
                      defaultValue={modal.client.area}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Package Selection
                    </label>
                    <select
                      name="package"
                      defaultValue={modal.client.package}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    >
                      {Object.values(PKG_MAP).map((p) => (
                        <option key={p.key} value={p.key}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                      Assign To Crew
                    </label>
                    <select
                      name="assign"
                      defaultValue={modal.client.assignedTo || ""}
                      className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {crew.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono tracking-wider text-text-secondary uppercase mb-1.5">
                    Job Instructions / Notes
                  </label>
                  <textarea
                    name="notes"
                    rows={3}
                    defaultValue={modal.client.notes}
                    placeholder="Enter any custom landmarks, specific shoot times, or client requirements..."
                    className="w-full bg-[#151515] border border-white/10 text-white rounded p-2.5 text-xs focus:border-mad-red focus:outline-none resize-none font-sans"
                  />
                </div>

                <div className="flex gap-2 justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="border border-white/10 hover:bg-white/5 text-text-secondary px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-mad-red hover:bg-red-600 text-white px-4 py-2 rounded font-mono text-[10px] tracking-wider uppercase transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
