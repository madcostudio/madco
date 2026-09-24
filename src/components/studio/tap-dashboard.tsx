import React, { useEffect, useState } from "react";
import { Users, CreditCard, Activity, BarChart2, Smartphone, QrCode } from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function TapDashboard() {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeCards: 0,
    blankCards: 0,
    scansThisMonth: 0,
    nfcScans: 0,
    qrScans: 0,
  });
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [topCards, setTopCards] = useState<any[]>([]);
  const [recentCards, setRecentCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      // Fetch basic stats
      const [
        { count: totalClients },
        { count: activeCards },
        { count: blankCards },
        { data: scanEvents },
        { data: topCardsData },
        { data: recentCardsData }
      ] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("cards").select("*", { count: "exact", head: true }).eq("status", "Active"),
        supabase.from("cards").select("*", { count: "exact", head: true }).eq("status", "Blank"),
        supabase.from("scan_events").select("id, source, scanned_at").gte("scanned_at", firstDayOfMonth),
        supabase.from("cards")
          .select("id, serial, nfc_taps, qr_scans, client_id, clients(business_name)")
          .order("nfc_taps", { ascending: false }) // Approximate top by just ordering nfc for simplicity or fetching all and sorting in memory if dataset is small. For now we will fetch top by nfc_taps+qr_scans manually
          .limit(20), // Fetch 20, sort in memory for accuracy
        supabase.from("cards")
          .select("id, serial, assigned_date, clients(business_name)")
          .not("assigned_date", "is", null)
          .order("assigned_date", { ascending: false })
          .limit(5)
      ]);

      // Calculate Scans
      const scans = scanEvents || [];
      const nfcCount = scans.filter(s => s.source === 'nfc').length;
      const qrCount = scans.filter(s => s.source === 'qr').length;

      setStats({
        totalClients: totalClients || 0,
        activeCards: activeCards || 0,
        blankCards: blankCards || 0,
        scansThisMonth: scans.length,
        nfcScans: nfcCount,
        qrScans: qrCount
      });

      // Process Chart Data (group by day)
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const dailyData = Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        date: new Date(now.getFullYear(), now.getMonth(), i + 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        scans: 0
      }));

      scans.forEach(scan => {
        const d = new Date(scan.scanned_at).getDate();
        if (d >= 1 && d <= daysInMonth) {
          dailyData[d - 1].scans += 1;
        }
      });
      setChartData(dailyData);

      // Process Top Cards
      let cardsList = topCardsData || [];
      cardsList = cardsList.sort((a, b) => ((b.nfc_taps + b.qr_scans) - (a.nfc_taps + a.qr_scans)));
      setTopCards(cardsList.slice(0, 5));

      setRecentCards(recentCardsData || []);

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-white font-mono text-xs animate-pulse">LOADING DASHBOARD DATA...</div>;
  }

  const nfcPct = stats.scansThisMonth > 0 ? Math.round((stats.nfcScans / stats.scansThisMonth) * 100) : 0;
  const qrPct = stats.scansThisMonth > 0 ? Math.round((stats.qrScans / stats.scansThisMonth) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "TOTAL CLIENTS", value: stats.totalClients, icon: Users, color: "text-blue-400" },
          { label: "ACTIVE CARDS", value: stats.activeCards, icon: CreditCard, color: "text-emerald-400" },
          { label: "BLANK CARDS", value: stats.blankCards, icon: CreditCard, color: "text-text-secondary" },
          { label: "SCANS THIS MONTH", value: stats.scansThisMonth, icon: Activity, color: "text-mad-red" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#151515] border border-white/5 rounded-xl p-5 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                {stat.label}
              </span>
              <stat.icon size={16} className={stat.color} />
            </div>
            <span className="font-sans font-black text-3xl text-white">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#151515] border border-white/5 rounded-xl p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={16} className="text-mad-red" />
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-secondary">
              Scans Over Time (Current Month)
            </h3>
          </div>
          <div className="flex-grow min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090909', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontFamily: 'monospace' }}
                  labelStyle={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}
                />
                <Line type="monotone" dataKey="scans" stroke="#F5250F" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#F5250F' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Split & Lists */}
        <div className="space-y-6">
          {/* Scan Source Split */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-4">
              Scan Source (This Month)
            </h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="flex items-center gap-1.5 text-white font-mono uppercase"><Smartphone size={12}/> NFC Taps</span>
                  <span className="text-text-secondary">{stats.nfcScans} ({nfcPct}%)</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 transition-all" style={{ width: `${nfcPct}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="flex items-center gap-1.5 text-white font-mono uppercase"><QrCode size={12}/> QR Scans</span>
                  <span className="text-text-secondary">{stats.qrScans} ({qrPct}%)</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-mad-red transition-all" style={{ width: `${qrPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Cards */}
          <div className="bg-[#151515] border border-white/5 rounded-xl p-5">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-secondary mb-4">
              Top Scanned Cards
            </h3>
            <div className="space-y-3">
              {topCards.length === 0 ? (
                <div className="text-xs text-text-secondary italic">No scans yet.</div>
              ) : (
                topCards.map((card, i) => (
                  <div key={card.id} className="flex justify-between items-center text-xs">
                    <div className="flex flex-col">
                      <span className="text-white font-bold truncate max-w-[150px]">
                        {card.clients?.business_name || "Unknown"}
                      </span>
                      <span className="text-text-secondary font-mono text-[9px]">
                        {card.serial}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-mad-red bg-mad-red/10 px-2 py-1 rounded">
                      {card.nfc_taps + card.qr_scans}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
