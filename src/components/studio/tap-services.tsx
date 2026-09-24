import React, { useEffect, useState } from "react";
import { Plus, Users, Save, X, Edit2, Power } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function TapServices({ onNavigateToClients }: { onNavigateToClients?: (serviceId: string) => void }) {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: "", slug: "", active: true });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      setLoading(true);
      // Fetch services
      const { data: svcData } = await supabase.from("services").select("*").order("name");
      
      // Fetch clients to count them per service
      // A client has a `services` UUID[] array
      const { data: clientsData } = await supabase.from("clients").select("services");
      
      const counts: Record<string, number> = {};
      if (clientsData) {
        clientsData.forEach(client => {
          if (client.services) {
            client.services.forEach((s: string) => {
              counts[s] = (counts[s] || 0) + 1;
            });
          }
        });
      }
      
      const enhanced = (svcData || []).map(s => ({ ...s, clientCount: counts[s.id] || 0 }));
      setServices(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase.from("services")
          .update({ name: formData.name, slug: formData.slug, active: formData.active })
          .eq("id", editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services")
          .insert([{ name: formData.name, slug: formData.slug, active: formData.active }]);
        if (error) throw error;
      }
      setIsAdding(false);
      setEditingId(null);
      fetchServices();
    } catch (e: any) {
      alert("Error saving service: " + e.message);
    }
  }

  async function toggleActive(id: string, currentActive: boolean) {
    try {
      const { error } = await supabase.from("services").update({ active: !currentActive }).eq("id", id);
      if (error) throw error;
      setServices(prev => prev.map(s => s.id === id ? { ...s, active: !currentActive } : s));
    } catch (e: any) {
      alert(e.message);
    }
  }

  if (loading) return <div className="text-white font-mono text-xs animate-pulse">LOADING SERVICES...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="font-sans font-black text-2xl uppercase text-white">Services</h2>
        <button 
          onClick={() => {
            setFormData({ name: "", slug: "", active: true });
            setEditingId(null);
            setIsAdding(true);
          }}
          className="bg-white text-black hover:bg-white/90 font-mono text-xs uppercase font-bold tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={14} />
          New Service
        </button>
      </div>

      {/* Form (Add/Edit) */}
      {(isAdding || editingId) && (
        <form onSubmit={handleSave} className="bg-[#151515] border border-white/10 rounded-xl p-5 mb-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-white">
              {editingId ? "Edit Service" : "Add Service"}
            </h3>
            <button type="button" onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-text-secondary hover:text-white">
              <X size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Service Name</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Slug (for URLs/filtering)</label>
              <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
              <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="accent-mad-red" />
              Active Status
            </label>
            <div className="flex-grow" />
            <button type="submit" className="bg-mad-red text-white px-6 py-2 rounded font-mono text-xs uppercase flex items-center gap-2 hover:bg-red-600 transition-colors">
              <Save size={14} /> Save
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map(service => (
          <div key={service.id} className={`bg-[#151515] border rounded-xl p-5 transition-all ${service.active ? 'border-white/10 hover:border-white/20' : 'border-white/5 opacity-60'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-sans font-black text-lg text-white uppercase">{service.name}</h3>
                <span className="font-mono text-[10px] tracking-wider text-text-secondary">/{service.slug}</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    setFormData({ name: service.name, slug: service.slug, active: service.active });
                    setEditingId(service.id);
                    setIsAdding(false);
                  }}
                  className="p-1.5 text-text-secondary hover:text-white bg-white/5 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={() => toggleActive(service.id, service.active)}
                  className={`p-1.5 rounded transition-colors ${service.active ? 'text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20' : 'text-text-secondary bg-white/5 hover:text-white'}`}
                  title={service.active ? "Deactivate" : "Activate"}
                >
                  <Power size={12} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-2 text-text-secondary">
                <Users size={14} />
                <span className="font-mono text-xs">{service.clientCount} active clients</span>
              </div>
              
              <button 
                onClick={() => onNavigateToClients?.(service.id)}
                className="font-mono text-[10px] uppercase tracking-wider text-white border border-white/10 hover:bg-white/5 px-3 py-1.5 rounded transition-colors"
              >
                View Clients
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
