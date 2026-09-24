import React, { useEffect, useState, useMemo } from "react";
import { Plus, Search, Download, Edit2, Link as LinkIcon, Ban, QrCode, ClipboardCopy, X, Check } from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "@/lib/supabase";

export function TapCards() {
  const [cards, setCards] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
  const [bulkCount, setBulkCount] = useState(10);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQRs, setGeneratedQRs] = useState<{serial: string, dataUrl: string}[]>([]);
  
  const [assignModal, setAssignModal] = useState<any>(null);
  
  // Track copying state for UI feedback
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      const [cardsRes, clientsRes] = await Promise.all([
        supabase.from("cards").select("*, clients(business_name)").order("serial", { ascending: false }),
        supabase.from("clients").select("id, business_name").order("business_name")
      ]);
      setCards(cardsRes.data || []);
      setClients(clientsRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // --- Generation Logic ---
  
  function generateRandomToken(length = 8) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"; // No confusing chars
    let token = "";
    for (let i = 0; i < length; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
  }

  async function getNextSerialIndex(): Promise<number> {
    const { data } = await supabase.from("cards").select("serial").order("serial", { ascending: false }).limit(1);
    if (!data || data.length === 0) return 1;
    const lastSerial = data[0].serial; // e.g. "0001"
    return parseInt(lastSerial, 10) + 1;
  }

  async function generateQRWithSerial(url: string, serial: string): Promise<string> {
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      margin: 4,
      width: 1000,
      color: { dark: '#000000', light: '#FFFFFF' }
    });

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 1000; // Use the exact same size, draw inside the white margin
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(qrDataUrl);

        // Draw QR code (which comes with a white margin from QRCode.toDataURL)
        ctx.drawImage(img, 0, 0);

        // Draw serial text closer to the black QR code area (inside the bottom margin)
        ctx.fillStyle = "#000000";
        ctx.font = "bold 28px monospace"; // Slightly larger for print readability
        ctx.textAlign = "center";
        ctx.fillText(`#${serial}`, 500, 960); // Placed up higher, closer to the black squares

        resolve(canvas.toDataURL("image/png"));
      };
      img.src = qrDataUrl;
    });
  }

  async function handleGenerate(count: number) {
    try {
      setIsGenerating(true);
      setGeneratedQRs([]);
      
      const startIndex = await getNextSerialIndex();
      const newCards = [];
      const generated = [];
      
      for (let i = 0; i < count; i++) {
        const serial = String(startIndex + i).padStart(4, "0");
        const token = generateRandomToken();
        newCards.push({
          serial,
          token,
          status: "Blank"
        });
        
        // Generate QR code data URL with serial overlay
        const url = `https://madco.in/r/${token}?s=q`;
        const dataUrl = await generateQRWithSerial(url, serial);
        
        generated.push({ serial, dataUrl });
      }
      
      const { error } = await supabase.from("cards").insert(newCards);
      if (error) throw error;
      
      setGeneratedQRs(generated);
      fetchData(); // refresh list
    } catch (e: any) {
      alert("Error generating cards: " + e.message);
    } finally {
      setIsGenerating(false);
    }
  }

  // --- Actions ---

  function downloadFile(dataUrl: string, filename: string) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  function downloadAllQRs() {
    generatedQRs.forEach((qr, index) => {
      // Slight delay to avoid browser blocking multiple downloads
      setTimeout(() => {
        downloadFile(qr.dataUrl, `MADCO_${qr.serial}.png`);
      }, index * 300);
    });
  }
  
  function copyNfcUrl(token: string) {
    const url = `https://madco.in/r/${token}?s=n`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleDisable(id: string) {
    if (!confirm("Are you sure you want to disable this card? It will no longer redirect.")) return;
    try {
      await supabase.from("cards").update({ status: "Disabled" }).eq("id", id);
      setCards(prev => prev.map(c => c.id === id ? { ...c, status: "Disabled" } : c));
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function handleAssign(e: React.FormEvent) {
    e.preventDefault();
    try {
      const updates = {
        client_id: assignModal.client_id,
        destination_url: assignModal.destination_url,
        card_type: assignModal.card_type,
        notes: assignModal.notes,
        status: "Active",
        assigned_date: assignModal.card.status === "Blank" ? new Date().toISOString() : assignModal.card.assigned_date
      };
      
      await supabase.from("cards").update(updates).eq("id", assignModal.card.id);
      
      setAssignModal(null);
      fetchData();
    } catch (e: any) {
      alert(e.message);
    }
  }

  async function viewQR(card: any) {
    const url = `https://madco.in/r/${card.token}?s=q`;
    const dataUrl = await generateQRWithSerial(url, card.serial);
    setGeneratedQRs([{ serial: card.serial, dataUrl }]); // Re-use the generation view
  }

  // --- Filtering ---
  
  const filteredCards = useMemo(() => {
    return cards.filter(c => {
      const matchSearch = c.serial.includes(search) || 
                          c.clients?.business_name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" ? true : c.status === statusFilter;
      const matchType = typeFilter === "all" ? true : c.card_type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [cards, search, statusFilter, typeFilter]);


  if (loading) return <div className="text-white font-mono text-xs animate-pulse">LOADING CARDS...</div>;

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-[#151515] border border-white/5 rounded-xl p-5 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h3 className="font-sans font-black text-xl text-white uppercase mb-1">Generate Cards</h3>
          <p className="text-xs text-text-secondary">Create new blank inventory. Tokens are securely randomized.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => handleGenerate(1)}
            disabled={isGenerating}
            className="bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Plus size={14} /> One
          </button>
          
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              min="1" max="100" 
              value={bulkCount} 
              onChange={e => setBulkCount(parseInt(e.target.value) || 1)}
              className="w-16 bg-black/30 border border-white/10 text-white rounded p-2 text-center font-mono text-sm focus:border-mad-red focus:outline-none"
            />
            <button 
              onClick={() => handleGenerate(bulkCount)}
              disabled={isGenerating}
              className="bg-mad-red hover:bg-red-600 text-white font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              Generate Bulk
            </button>
          </div>
        </div>
      </div>

      {/* Generated QRs Display */}
      {generatedQRs.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-mono font-bold text-emerald-400 uppercase tracking-widest text-sm">
                Successfully Generated {generatedQRs.length} Card{generatedQRs.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-text-secondary mt-1">Ready for print production.</p>
            </div>
            <div className="flex gap-3">
              {generatedQRs.length > 1 && (
                <button 
                  onClick={downloadAllQRs}
                  className="bg-emerald-500 text-black font-mono text-xs uppercase font-bold px-4 py-2 rounded hover:bg-emerald-400 transition-colors flex items-center gap-2"
                >
                  <Download size={14} /> Download All ({generatedQRs.length})
                </button>
              )}
              <button onClick={() => setGeneratedQRs([])} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {generatedQRs.map(qr => (
              <div key={qr.serial} className="bg-black/50 p-4 rounded-lg flex flex-col items-center gap-3 border border-white/5">
                <img src={qr.dataUrl} alt={`QR ${qr.serial}`} className="w-full aspect-square rounded" />
                <div className="w-full flex justify-between items-center">
                  <span className="font-mono text-xs text-white">#{qr.serial}</span>
                  <button 
                    onClick={() => downloadFile(qr.dataUrl, `MADCO_${qr.serial}.png`)}
                    className="text-text-secondary hover:text-white p-1"
                    title="Download PNG"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Table */}
      <div className="bg-[#151515] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-wrap gap-4">
          <div className="relative flex-grow md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={14} />
            <input 
              type="text" 
              placeholder="Search serial or client..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none"
            />
          </div>
          <select 
            value={statusFilter} 
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Blank">Blank</option>
            <option value="Active">Active</option>
            <option value="Disabled">Disabled</option>
          </select>
          <select 
            value={typeFilter} 
            onChange={e => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm text-white focus:border-mad-red focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Tap-to-Review">Tap-to-Review</option>
            <option value="Tap-to-Menu">Tap-to-Menu</option>
            <option value="Tap-to-Order">Tap-to-Order</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-text-secondary">
            <thead className="bg-black/20 font-mono text-[10px] uppercase tracking-wider text-white border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Serial</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-center">Scans (NFC/QR)</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCards.map(card => {
                const isBlank = card.status === "Blank";
                const isDisabled = card.status === "Disabled";
                return (
                  <tr key={card.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-white font-bold">{card.serial}</span>
                      <span className="block text-[9px] font-mono opacity-50 mt-0.5">{card.token}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider border ${
                        isBlank ? 'bg-white/5 text-text-secondary border-white/10' :
                        isDisabled ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {card.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {isBlank ? <span className="text-xs italic opacity-50">Unassigned</span> : 
                        <div>
                          <span className="text-white font-bold">{card.clients?.business_name}</span>
                          {card.destination_url && (
                            <a href={card.destination_url.startsWith('http') ? card.destination_url : `https://${card.destination_url}`} target="_blank" rel="noreferrer" className="block text-[10px] text-blue-400 hover:underline mt-1 truncate max-w-[200px]" title={card.destination_url}>
                              {card.destination_url}
                            </a>
                          )}
                        </div>
                      }
                    </td>
                    <td className="px-6 py-4 text-xs">{card.card_type}</td>
                    <td className="px-6 py-4 text-center font-mono">
                      <div className="flex justify-center items-center gap-1">
                        <span className="text-blue-400">{card.nfc_taps || 0}</span>
                        <span className="opacity-30">/</span>
                        <span className="text-mad-red">{card.qr_scans || 0}</span>
                      </div>
                      <div className="text-[10px] mt-1 opacity-50">
                        {card.nfc_taps + card.qr_scans} Total
                      </div>
                    </td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button onClick={() => setAssignModal({ card, client_id: card.client_id || "", destination_url: card.destination_url || "", card_type: card.card_type || "Tap-to-Review", notes: card.notes || "" })} className="p-1.5 text-text-secondary hover:text-white bg-white/5 rounded transition-colors" title={isBlank ? "Assign" : "Edit"}>
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => copyNfcUrl(card.token)} className="p-1.5 text-text-secondary hover:text-blue-400 bg-white/5 rounded transition-colors" title="Copy NFC URL">
                        {copied === card.token ? <Check size={14} /> : <LinkIcon size={14} />}
                      </button>
                      <button onClick={() => viewQR(card)} className="p-1.5 text-text-secondary hover:text-emerald-400 bg-white/5 rounded transition-colors" title="View/Download QR">
                        <QrCode size={14} />
                      </button>
                      {!isDisabled && (
                        <button onClick={() => handleDisable(card.id)} className="p-1.5 text-text-secondary hover:text-mad-red bg-white/5 rounded transition-colors" title="Disable">
                          <Ban size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
              {filteredCards.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-xs italic">
                    No cards found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign / Edit Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAssign} className="bg-[#151515] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-sans font-black text-xl text-white uppercase">
                {assignModal.card.status === "Blank" ? "Assign Card" : "Edit Card"} #{assignModal.card.serial}
              </h3>
              <button type="button" onClick={() => setAssignModal(null)} className="text-text-secondary hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Client</label>
                <select 
                  required
                  value={assignModal.client_id}
                  onChange={e => setAssignModal({...assignModal, client_id: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none"
                >
                  <option value="" disabled>Select a client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.business_name}</option>)}
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Destination URL (Google Review Link)</label>
                <input 
                  type="url" required
                  placeholder="https://g.page/r/..."
                  value={assignModal.destination_url}
                  onChange={e => setAssignModal({...assignModal, destination_url: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Card Type</label>
                <select 
                  value={assignModal.card_type}
                  onChange={e => setAssignModal({...assignModal, card_type: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none"
                >
                  <option value="Tap-to-Review">Tap-to-Review</option>
                  <option value="Tap-to-Menu">Tap-to-Menu</option>
                  <option value="Tap-to-Order">Tap-to-Order</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono tracking-wider text-text-secondary uppercase mb-1">Internal Notes</label>
                <textarea 
                  rows={2}
                  value={assignModal.notes}
                  onChange={e => setAssignModal({...assignModal, notes: e.target.value})}
                  className="w-full bg-black/30 border border-white/10 text-white rounded p-2.5 font-sans text-sm focus:border-mad-red focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-white/10">
              <button 
                type="button" 
                onClick={() => setAssignModal(null)}
                className="px-4 py-2 text-xs font-mono uppercase text-text-secondary hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-mad-red hover:bg-red-600 text-white font-mono text-xs uppercase px-6 py-2 rounded transition-colors"
              >
                Save Card
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
