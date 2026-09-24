import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, Filter, Phone, Mail, MoreVertical, X, Check, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function TapClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isAdding, setIsAdding] = useState(false);
  const [activeClient, setActiveClient] = useState<any>(null); // For detail view
  
  // Form State
  const [formData, setFormData] = useState({
    business_name: "",
    contact_name: "",
    phone: "",
    email: "",
    area: "",
    status: "Lead",
    services: [] as string[],
    notes: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [clientsRes, servicesRes] = await Promise.all([
        supabase.from("clients").select("*, cards(id, nfc_taps, qr_scans, serial, status)").order("created_at", { ascending: false }),
        supabase.from("services").select("*").order("name")
      ]);
      
      setClients(clientsRes.data || []);
      setServices(servicesRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchSearch = c.business_name.toLowerCase().includes(search.toLowerCase()) || 
                          (c.phone && c.phone.includes(search));
      const matchService = serviceFilter === "all" ? true : c.services?.includes(serviceFilter);
      const matchStatus = statusFilter === "all" ? true : c.status === statusFilter;
      return matchSearch && matchService && matchStatus;
    });
  }, [clients, search, serviceFilter, statusFilter]);

  async function handleSaveClient(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (activeClient && !isAdding) {
        // Update
        const { data, error } = await supabase.from("clients").update({
          business_name: formData.business_name,
          contact_name: formData.contact_name,
          phone: formData.phone,
          email: formData.email,
          area: formData.area,
          status: formData.status,
          services: formData.services,
          notes: formData.notes,
          updated_at: new Date().toISOString()
        }).eq("id", activeClient.id).select();
        
        if (error) throw error;
        setClients(prev => prev.map(c => c.id === activeClient.id ? { ...c, ...data[0] } : c));
        setActiveClient({ ...activeClient, ...data[0] });
      } else {
        // Insert
        const { data, error } = await supabase.from("clients").insert([{
          business_name: formData.business_name,
          contact_name: formData.contact_name,
          phone: formData.phone,
          email: formData.email,
          area: formData.area,
          status: formData.status,
          services: formData.services,
          notes: formData.notes
        }]).select();
        if (error) throw error;
        // attach empty cards array for local state
        const newClient = { ...data[0], cards: [] };
        setClients([newClient, ...clients]);
        setIsAdding(false);
      }
    } catch (e: any) {
      alert("Error saving client: " + e.message);
    }
  }

  function openEdit(client: any) {
    setFormData({
      business_name: client.business_name || "",
      contact_name: client.contact_name || "",
      phone: client.phone || "",
      email: client.email || "",
      area: client.area || "",
      status: client.status || "Lead",
      services: client.services || [],
      notes: client.notes || ""
    });
    setActiveClient(client);
    setIsAdding(false);
  }

  function openAdd() {
    setFormData({
      business_name: "",
      contact_name: "",
      phone: "",
      email: "",
      area: "",
      status: "Lead",
      services: [],
      notes: ""
    });
    setActiveClient(null);
    setIsAdding(true);
  }

  const getServiceName = (id: string) => {
    return services.find(s => s.id === id)?.name || "Unknown";
  };

  const statusColors: any = {
    "Lead": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Active": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Completed": "bg-gray-500/10 text-gray-400 border-gray-500/20",
    "Churned": "bg-mad-red/10 text-mad-red border-mad-red/20",
  };

  if (loading) return <div className="text-white font-mono text-xs animate-pulse">LOADING CLIENTS...</div>;

  // View: Add/Edit Form or Detail Modal
  if (isAdding || activeClient) {
    const isEditMode = isAdding || (activeClient && activeClient.isEditing);
    
    return (
      <div className="bg-[#151515] border border-white/5 rounded-xl p-6 relative">
        <button 
          onClick={() => { setIsAdding(false); setActiveClient(null); }}
          className="absolute top-6 right-6 text-text-secondary hover:text-white"
        >
          <X size={20} />
        </button>
        
        <h2 className="font-sans font-black text-2xl uppercase text-white mb-6">
          {isAdding ? "New Client" : activeClient.business_name}
        </h2>

        {/* If we are just viewing the client and not adding them */}
        {!isAdding && !activeClient.isEditing && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div>
                <span className="block text-xs font-mono text-text-secondary uppercase mb-1">Contact</span>
                <span className="text-white">{activeClient.contact_name || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-text-secondary uppercase mb-1">Phone</span>
                <span className="text-white">{activeClient.phone || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-text-secondary uppercase mb-1">Email</span>
                <span className="text-white">{activeClient.email || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-mono text-text-secondary uppercase mb-1">Status</span>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${statusColors[activeClient.status] || "text-white"}`}>
                  {activeClient.status}
                </span>
              </div>
            </div>

            <div>
              <span className="block text-xs font-mono text-text-secondary uppercase mb-2">Services Used</span>
              <div className="flex flex-wrap gap-2">
                {activeClient.services?.map((s: string) => (
                  <span key={s} className="bg-white/10 text-white text-xs px-2 py-1 rounded">
                    {getServiceName(s)}
                  </span>
                ))}
                {!activeClient.services?.length && <span className="text-text-secondary text-xs italic">None selected</span>}
              </div>
            </div>

            {activeClient.notes && (
              <div>
                <span className="block text-xs font-mono text-text-secondary uppercase mb-2">Notes</span>
                <div className="bg-black/30 p-3 rounded text-sm text-text-secondary">
                  {activeClient.notes}
                </div>
              </div>
            )}

            <div className="border-t border-white/10 pt-6">
              <h3 className="font-mono text-xs text-text-secondary uppercase mb-4 tracking-widest">
                Assigned Cards
              </h3>
              
              <div className="space-y-3">
                {activeClient.cards?.length === 0 ? (
                  <div className="text-sm text-text-secondary italic">No cards assigned.</div>
                ) : (
                  activeClient.cards?.map((card: any) => {
                    const totalScans = (card.nfc_taps || 0) + (card.qr_scans || 0);
                    return (
                      <div key={card.id} className="flex justify-between items-center bg-black/20 p-3 rounded border border-white/5">
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-white text-sm">#{card.serial}</span>
                          <span className="text-xs text-text-secondary px-2 py-0.5 rounded border border-white/10 bg-white/5">
                            {card.status}
                          </span>
                        </div>
                        <div className="font-mono text-xs">
                          <span className="text-text-secondary">Scans: </span>
                          <span className="text-mad-red font-bold">{totalScans}</span>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={() => setActiveClient({...activeClient, isEditing: true})}
                className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase px-4 py-2 rounded transition-colors"
              >
                Edit Details
              </button>
            </div>
          </div>
        )}

        {/* Edit / Add Form */}
        {isEditMode && (
          <form onSubmit={handleSaveClient} className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Business Name *</label>
                  <input required value={formData.business_name} onChange={e => setFormData({...formData, business_name: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Contact Name</label>
                  <input value={formData.contact_name} onChange={e => setFormData({...formData, contact_name: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Phone</label>
                  <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Email</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Area / Location</label>
                  <input value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none">
                    <option value="Lead">Lead</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Churned">Churned</option>
                  </select>
                </div>
             </div>
             
             <div>
               <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-2">Services</label>
               <div className="flex flex-wrap gap-2">
                 {services.map(s => (
                   <label key={s.id} className="flex items-center gap-2 bg-black/20 border border-white/10 px-3 py-1.5 rounded cursor-pointer hover:bg-white/5 transition-colors">
                     <input 
                       type="checkbox" 
                       className="accent-mad-red"
                       checked={formData.services.includes(s.id)}
                       onChange={e => {
                         if (e.target.checked) setFormData({...formData, services: [...formData.services, s.id]});
                         else setFormData({...formData, services: formData.services.filter(id => id !== s.id)});
                       }}
                     />
                     <span className="text-sm text-white">{s.name}</span>
                   </label>
                 ))}
               </div>
             </div>

             <div>
                <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Notes</label>
                <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                  type="button" 
                  onClick={() => isAdding ? setIsAdding(false) : setActiveClient({...activeClient, isEditing: false})}
                  className="px-4 py-2 text-xs font-mono uppercase text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-mad-red hover:bg-red-600 text-white font-mono text-xs uppercase px-6 py-2 rounded flex items-center gap-2 transition-colors"
                >
                  <Save size={14} />
                  {isAdding ? "Create Client" : "Save Changes"}
                </button>
             </div>
          </form>
        )}
      </div>
    );
  }

  // View: Main List
  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#151515] border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none w-full md:w-64"
            />
          </div>
          
          <select 
            value={serviceFilter} 
            onChange={e => setServiceFilter(e.target.value)}
            className="px-3 py-2 bg-[#151515] border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none"
          >
            <option value="all">All Services</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#151515] border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Lead">Lead</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Churned">Churned</option>
          </select>
        </div>

        <button 
          onClick={openAdd}
          className="bg-white text-black hover:bg-white/90 font-mono text-xs uppercase font-bold tracking-wider px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors flex-shrink-0"
        >
          <Plus size={14} />
          New Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-black/20 font-mono text-[10px] uppercase tracking-wider text-white border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Business Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Services</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Cards</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map(client => (
                <tr 
                  key={client.id} 
                  onClick={() => openEdit(client)}
                  className="hover:bg-white/5 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4 font-sans font-bold text-white">
                    {client.business_name}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-white">{client.contact_name || "—"}</span>
                      {client.phone && <span className="text-[10px] font-mono">{client.phone}</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.services?.slice(0, 2).map((s: string) => (
                        <span key={s} className="bg-white/10 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap">
                          {getServiceName(s)}
                        </span>
                      ))}
                      {client.services?.length > 2 && (
                        <span className="bg-white/5 text-text-secondary text-[9px] px-1.5 py-0.5 rounded">
                          +{client.services.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider border ${statusColors[client.status] || "text-white"}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono">
                    {client.cards?.length || 0}
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-xs italic">
                    No clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
