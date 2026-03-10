import { useState } from "react";

const INITIAL_PROPERTIES = [
  { id: 1, name: "Sunset Loft", location: "Miami Beach, FL", img: "🏖️", color: "#6B8FBF" },
  { id: 2, name: "Mountain Cabin", location: "Asheville, NC", img: "🏔️", color: "#5BA58C" },
  { id: 3, name: "Downtown Studio", location: "Charlotte, NC", img: "🏙️", color: "#9B85C4" },
];
const EMOJIS = ["🏖️","🏔️","🏙️","🏡","🏠","🏢","🌴","🏕️","🌊","🏗️","🛖","🏘️"];
const COLORS = ["#6B8FBF","#5BA58C","#9B85C4","#D97B6C","#E0A96D","#7BAAAA","#B07BB0","#7B9E7B","#C4A882","#8899BB"];

const today = new Date();
const fmt = (d) => d.toISOString().split("T")[0];
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

const INITIAL_BOOKINGS = [
  { id: 1, propertyId: 1, guest: "James & Sarah K.", checkIn: fmt(addDays(today, -2)), checkOut: fmt(addDays(today, 3)), nights: 5, rate: 220, status: "active", platform: "Airbnb" },
  { id: 2, propertyId: 1, guest: "Maria Lopez", checkIn: fmt(addDays(today, 8)), checkOut: fmt(addDays(today, 12)), nights: 4, rate: 220, status: "upcoming", platform: "Airbnb" },
  { id: 3, propertyId: 2, guest: "Tom & Lily W.", checkIn: fmt(addDays(today, 1)), checkOut: fmt(addDays(today, 6)), nights: 5, rate: 185, status: "upcoming", platform: "Vrbo" },
  { id: 4, propertyId: 3, guest: "Derek Chen", checkIn: fmt(addDays(today, -5)), checkOut: fmt(addDays(today, -1)), nights: 4, rate: 130, status: "completed", platform: "Airbnb" },
  { id: 5, propertyId: 3, guest: "Anna Patel", checkIn: fmt(addDays(today, 3)), checkOut: fmt(addDays(today, 7)), nights: 4, rate: 130, status: "upcoming", platform: "Direct" },
];

const INITIAL_MAINTENANCE = [
  { id: 1, propertyId: 1, title: "AC unit making noise", priority: "high", status: "open", date: fmt(addDays(today, -1)), cost: null, notes: "Guest reported loud rattling" },
  { id: 2, propertyId: 2, title: "Replace porch light bulbs", priority: "low", status: "open", date: fmt(addDays(today, -3)), cost: null, notes: "" },
  { id: 3, propertyId: 3, title: "Deep clean after long stay", priority: "medium", status: "in-progress", date: fmt(today), cost: 180, notes: "Scheduled with CleanCo" },
  { id: 4, propertyId: 1, title: "Fix bathroom faucet drip", priority: "medium", status: "resolved", date: fmt(addDays(today, -7)), cost: 95, notes: "Plumber fixed" },
];

const PRIORITY_COLORS = { high: "#D97B6C", medium: "#E0A96D", low: "#5BA58C" };
const STATUS_COLORS = { open: "#D97B6C", "in-progress": "#E0A96D", resolved: "#5BA58C", active: "#5BA58C", upcoming: "#6B8FBF", completed: "#A8B4C0" };

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0A0A0A;
    --surface: #141414;
    --surface2: #1E1E1E;
    --border: #2A2A2A;
    --text: #EDEAE4;
    --muted: #666666;
    --accent: #6B8FBF;
    --accent2: #5BA58C;
    --font-display: 'Playfair Display', serif;
    --font-body: 'DM Sans', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  .app { display: flex; min-height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column; padding: 28px 0;
    position: sticky; top: 0; height: 100vh;
  }
  .logo { padding: 0 24px 28px; border-bottom: 1px solid var(--border); }
  .logo-title { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--text); }
  .logo-sub { font-size: 11px; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; }

  .nav { padding: 20px 12px; flex: 1; }
  .nav-label { font-size: 10px; letter-spacing: 2px; color: var(--muted); text-transform: uppercase; padding: 0 12px; margin-bottom: 8px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 400;
    color: var(--muted); transition: all 0.15s; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent); color: #fff; font-weight: 500; }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .properties-mini { padding: 0 12px 20px; border-top: 1px solid var(--border); margin-top: 8px; padding-top: 20px; }
  .prop-chip {
    display: flex; align-items: center; gap: 8px; padding: 8px 10px;
    border-radius: 6px; cursor: pointer; margin-bottom: 4px;
    font-size: 13px; color: var(--muted); transition: all 0.15s;
  }
  .prop-chip:hover { background: var(--surface2); color: var(--text); }
  .prop-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

  /* Main */
  .main { flex: 1; overflow-y: auto; }
  .topbar {
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 20px 32px; display: flex; align-items: center; justify-content: space-between;
    position: sticky; top: 0; z-index: 10;
  }
  .page-title { font-family: var(--font-display); font-size: 26px; font-weight: 700; }
  .page-sub { font-size: 13px; color: var(--muted); margin-top: 2px; }
  .top-actions { display: flex; gap: 10px; align-items: center; }
  .btn {
    padding: 9px 18px; border-radius: 8px; border: none; cursor: pointer;
    font-family: var(--font-body); font-size: 13px; font-weight: 500; transition: all 0.15s;
  }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: #d45f3a; }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-ghost:hover { background: var(--border); }
  .btn-sm { padding: 6px 12px; font-size: 12px; }

  .content { padding: 28px 32px; }

  /* Cards */
  .stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px;
    padding: 20px; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  }
  .stat-card.orange::before { background: #D97B6C; }
  .stat-card.green::before { background: #5BA58C; }
  .stat-card.blue::before { background: #6B8FBF; }
  .stat-card.yellow::before { background: #E0A96D; }
  .stat-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
  .stat-value { font-family: var(--font-display); font-size: 32px; font-weight: 700; margin: 8px 0 4px; }
  .stat-change { font-size: 12px; color: var(--muted); }
  .stat-change.up { color: #5BA58C; }

  /* Grid layouts */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .section-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden;
  }
  .section-header {
    padding: 18px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .section-title { font-family: var(--font-display); font-size: 16px; font-weight: 500; }
  .section-body { padding: 0; }

  /* Booking rows */
  .booking-row {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 14px;
  }
  .booking-row:last-child { border-bottom: none; }
  .prop-emoji { font-size: 20px; }
  .booking-info { flex: 1; }
  .booking-guest { font-size: 14px; font-weight: 500; }
  .booking-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .booking-right { text-align: right; }
  .booking-revenue { font-size: 14px; font-weight: 600; color: var(--accent); }
  .status-badge {
    display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 11px;
    font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;
  }

  /* Maintenance */
  .maint-row {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: flex-start; gap: 12px;
  }
  .maint-row:last-child { border-bottom: none; }
  .maint-dot { width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
  .maint-info { flex: 1; }
  .maint-title { font-size: 14px; font-weight: 500; }
  .maint-sub { font-size: 12px; color: var(--muted); margin-top: 3px; }
  .maint-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }

  /* Calendar */
  .cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; padding: 16px 20px; }
  .cal-day-label { text-align: center; font-size: 11px; color: var(--muted); padding: 4px 0; font-weight: 600; }
  .cal-day {
    aspect-ratio: 1; border-radius: 6px; display: flex; align-items: center; justify-content: center;
    font-size: 13px; cursor: pointer; position: relative; transition: all 0.1s;
  }
  .cal-day:hover { background: var(--surface2); }
  .cal-day.today { background: var(--accent); color: #fff; font-weight: 600; }
  .cal-day.booked { background: rgba(76, 175, 130, 0.15); color: #4CAF82; }
  .cal-day.other-month { color: #BCC3CF; }
  .cal-day-dot { position: absolute; bottom: 3px; width: 4px; height: 4px; border-radius: 50%; background: var(--accent); }

  /* Finance */
  .finance-row {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .finance-row:last-child { border-bottom: none; }
  .finance-label { font-size: 14px; }
  .finance-amount { font-size: 15px; font-weight: 600; }
  .finance-amount.income { color: #4CAF82; }
  .finance-amount.expense { color: #E07070; }
  .finance-period { font-size: 11px; color: var(--muted); margin-top: 2px; }


  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75);
    display: flex; align-items: center; justify-content: center; z-index: 100;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 28px; width: 460px; max-width: 95vw;
  }
  .modal-title { font-family: var(--font-display); font-size: 20px; margin-bottom: 20px; }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .form-input, .form-select, .form-textarea {
    width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px;
    padding: 10px 14px; color: var(--text); font-family: var(--font-body); font-size: 14px;
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--accent); }
  .form-select option { background: #141414; color: var(--text); }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }

  /* Tabs */
  .tabs { display: flex; gap: 4px; padding: 12px 20px; border-bottom: 1px solid var(--border); }
  .tab {
    padding: 7px 14px; border-radius: 6px; font-size: 13px; cursor: pointer;
    color: var(--muted); transition: all 0.15s;
  }
  .tab.active { background: var(--accent); color: #fff; font-weight: 500; }
  .tab:hover:not(.active) { background: var(--surface2); color: var(--text); }

  /* Empty state */
  .empty { padding: 40px 20px; text-align: center; color: var(--muted); font-size: 14px; }


  /* Finance */
  .finance-row {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .finance-row:last-child { border-bottom: none; }
  .finance-label { font-size: 14px; }
  .finance-amount { font-size: 15px; font-weight: 600; }
  .finance-amount.income { color: #4E9E7A; }
  .finance-amount.expense { color: #C0735A; }
  .finance-period { font-size: 11px; color: var(--muted); margin-top: 2px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #C8CDD8; border-radius: 3px; }
`;

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = [];
  for (let i = 0; i < first.getDay(); i++) {
    const d = new Date(year, month, -i);
    days.unshift({ date: d, current: false });
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push({ date: new Date(year, month, d), current: true });
  }
  while (days.length % 7 !== 0) {
    const last2 = days[days.length - 1].date;
    days.push({ date: addDays(last2, 1), current: false });
  }
  return days;
}

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [properties, setProperties] = useState(INITIAL_PROPERTIES);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [maintenance, setMaintenance] = useState(INITIAL_MAINTENANCE);
  const [filterProp, setFilterProp] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMaintModal, setShowMaintModal] = useState(false);
  const [showPropModal, setShowPropModal] = useState(false);
  const [editProp, setEditProp] = useState(null);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [newBooking, setNewBooking] = useState({ propertyId: 1, guest: "", checkIn: "", checkOut: "", rate: "", platform: "Airbnb", status: "upcoming" });
  const [newMaint, setNewMaint] = useState({ propertyId: 1, title: "", priority: "medium", status: "open", date: fmt(today), cost: "", notes: "" });
  const [newProp, setNewProp] = useState({ name: "", location: "", img: "🏡", color: "#6B8FBF" });

  const filtered = (arr) => filterProp ? arr.filter(b => b.propertyId === filterProp) : arr;
  const activeBookings = bookings.filter(b => b.status === "active").length;
  const totalRevenue = bookings.filter(b => b.status !== "upcoming").reduce((s, b) => s + b.nights * b.rate, 0);
  const openIssues = maintenance.filter(m => m.status !== "resolved").length;
  const totalCosts = maintenance.reduce((s, m) => s + (m.cost || 0), 0);

  const calDays = getCalendarDays(calYear, calMonth);
  const bookedDates = new Set(
    bookings.flatMap(b => {
      if (filterProp && b.propertyId !== filterProp) return [];
      const dates = [];
      let d = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      while (d < end) { dates.push(fmt(d)); d = addDays(d, 1); }
      return dates;
    })
  );


  function addBooking() {
    const nights = Math.max(1, Math.round((new Date(newBooking.checkOut) - new Date(newBooking.checkIn)) / 86400000));
    setBookings([...bookings, { ...newBooking, id: Date.now(), nights, rate: Number(newBooking.rate), propertyId: Number(newBooking.propertyId) }]);
    setShowBookingModal(false);
    setNewBooking({ propertyId: 1, guest: "", checkIn: "", checkOut: "", rate: "", platform: "Airbnb", status: "upcoming" });
  }

  function addMaint() {
    setMaintenance([...maintenance, { ...newMaint, id: Date.now(), cost: newMaint.cost ? Number(newMaint.cost) : null, propertyId: Number(newMaint.propertyId) }]);
    setShowMaintModal(false);
    setNewMaint({ propertyId: 1, title: "", priority: "medium", status: "open", date: fmt(today), cost: "", notes: "" });
  }

  function toggleMaintStatus(id) {
    setMaintenance(maintenance.map(m => m.id === id ? { ...m, status: m.status === "resolved" ? "open" : "resolved" } : m));
  }

  function saveProperty() {
    if (!newProp.name.trim()) return;
    if (editProp) {
      setProperties(properties.map(p => p.id === editProp.id ? { ...editProp, ...newProp } : p));
      setEditProp(null);
    } else {
      setProperties([...properties, { ...newProp, id: Date.now() }]);
    }
    setShowPropModal(false);
    setNewProp({ name: "", location: "", img: "🏡", color: "#6B8FBF" });
  }

  function deleteProperty(id) {
    setProperties(properties.filter(p => p.id !== id));
    setBookings(bookings.filter(b => b.propertyId !== id));
    setMaintenance(maintenance.filter(m => m.propertyId !== id));
    if (filterProp === id) setFilterProp(null);
  }

  function openEditProp(p) {
    setEditProp(p);
    setNewProp({ name: p.name, location: p.location, img: p.img, color: p.color });
    setShowPropModal(true);
  }

  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <div className="logo-title">HostDesk</div>
            <div className="logo-sub">Property Manager</div>
          </div>
          <div className="nav">
            <div className="nav-label">Menu</div>
            {[
              { id: "dashboard", icon: "◈", label: "Dashboard" },
              { id: "bookings", icon: "📅", label: "Bookings" },
              { id: "calendar", icon: "🗓", label: "Calendar" },
              { id: "maintenance", icon: "🔧", label: "Maintenance" },
              { id: "finances", icon: "💰", label: "Finances" },
              { id: "properties", icon: "🏠", label: "Properties" },
            ].map(n => (
              <div key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>{n.label}
              </div>
            ))}
          </div>
          <div className="properties-mini">
            <div className="nav-label">Properties</div>
            <div className={`prop-chip ${!filterProp ? "active" : ""}`} onClick={() => setFilterProp(null)} style={!filterProp ? { color: "#F0EDE8" } : {}}>
              <div className="prop-dot" style={{ background: "#888" }} /> All Properties
            </div>
            {properties.map(p => (
              <div key={p.id} className="prop-chip" onClick={() => setFilterProp(filterProp === p.id ? null : p.id)} style={filterProp === p.id ? { background: "#222", color: "#F0EDE8" } : {}}>
                <div className="prop-dot" style={{ background: p.color }} />{p.name}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="main">
          <div className="topbar">
            <div>
              <div className="page-title">
                {tab === "dashboard" && "Overview"}
                {tab === "bookings" && "Bookings"}
                {tab === "calendar" && "Calendar"}
                {tab === "maintenance" && "Maintenance"}
                {tab === "finances" && "Finances"}
                {tab === "properties" && "Properties"}
              </div>
              <div className="page-sub">{filterProp ? properties.find(p => p.id === filterProp)?.name : "All Properties"} · {today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</div>
            </div>
            <div className="top-actions">
              {tab === "bookings" && <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>+ New Booking</button>}
              {tab === "maintenance" && <button className="btn btn-primary" onClick={() => setShowMaintModal(true)}>+ New Issue</button>}
              {tab === "properties" && <button className="btn btn-primary" onClick={() => { setEditProp(null); setNewProp({ name: "", location: "", img: "🏡", color: "#6B8FBF" }); setShowPropModal(true); }}>+ Add Property</button>}
            </div>
          </div>

          <div className="content">
            {/* DASHBOARD */}
            {tab === "dashboard" && (
              <>
                <div className="stat-grid">
                  <div className="stat-card orange">
                    <div className="stat-label">Active Stays</div>
                    <div className="stat-value">{activeBookings}</div>
                    <div className="stat-change">Guests checked in now</div>
                  </div>
                  <div className="stat-card green">
                    <div className="stat-label">Total Revenue</div>
                    <div className="stat-value">${totalRevenue.toLocaleString()}</div>
                    <div className="stat-change up">↑ All time</div>
                  </div>
                  <div className="stat-card yellow">
                    <div className="stat-label">Open Issues</div>
                    <div className="stat-value">{openIssues}</div>
                    <div className="stat-change">Maintenance pending</div>
                  </div>
                  <div className="stat-card blue">
                    <div className="stat-label">Upcoming</div>
                    <div className="stat-value">{bookings.filter(b => b.status === "upcoming").length}</div>
                    <div className="stat-change">Bookings this month</div>
                  </div>
                </div>

                <div className="two-col">
                  <div className="section-card">
                    <div className="section-header">
                      <div className="section-title">Recent Bookings</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setTab("bookings")}>View all</button>
                    </div>
                    <div className="section-body">
                      {filtered(bookings).slice(0, 4).map(b => {
                        const prop = properties.find(p => p.id === b.propertyId);
                        return (
                          <div className="booking-row" key={b.id}>
                            <span className="prop-emoji">{prop?.img}</span>
                            <div className="booking-info">
                              <div className="booking-guest">{b.guest}</div>
                              <div className="booking-meta">{prop?.name} · {b.checkIn} → {b.checkOut}</div>
                            </div>
                            <div className="booking-right">
                              <div className="booking-revenue">${(b.nights * b.rate).toLocaleString()}</div>
                              <span className="status-badge" style={{ background: STATUS_COLORS[b.status] + "22", color: STATUS_COLORS[b.status] }}>{b.status}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="section-card">
                    <div className="section-header">
                      <div className="section-title">Maintenance Issues</div>
                      <button className="btn btn-ghost btn-sm" onClick={() => setTab("maintenance")}>View all</button>
                    </div>
                    <div className="section-body">
                      {filtered(maintenance).slice(0, 4).map(m => {
                        const prop = properties.find(p => p.id === m.propertyId);
                        return (
                          <div className="maint-row" key={m.id}>
                            <div className="maint-dot" style={{ background: PRIORITY_COLORS[m.priority] }} />
                            <div className="maint-info">
                              <div className="maint-title">{m.title}</div>
                              <div className="maint-sub">{prop?.name} · {m.date}</div>
                            </div>
                            <span className="status-badge" style={{ background: STATUS_COLORS[m.status] + "22", color: STATUS_COLORS[m.status] }}>{m.status}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Properties overview */}
                <div className="section-card">
                  <div className="section-header"><div className="section-title">Properties</div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0 }}>
                    {properties.map(p => {
                      const rev = bookings.filter(b => b.propertyId === p.id && b.status !== "upcoming").reduce((s, b) => s + b.nights * b.rate, 0);
                      const active = bookings.find(b => b.propertyId === p.id && b.status === "active");
                      return (
                        <div key={p.id} style={{ padding: "20px", borderRight: "1px solid #2A2A2A", cursor: "pointer" }} onClick={() => setFilterProp(filterProp === p.id ? null : p.id)}>
                          <div style={{ fontSize: 32, marginBottom: 10 }}>{p.img}</div>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", margin: "4px 0 12px" }}>{p.location}</div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div style={{ fontSize: 18, fontWeight: 700, color: p.color }}>${rev.toLocaleString()}</div>
                            {active ? <span className="status-badge" style={{ background: "#4A7E6B22", color: "#4A7E6B" }}>Occupied</span> : <span className="status-badge" style={{ background: "#33333355", color: "#888" }}>Vacant</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {/* BOOKINGS */}
            {tab === "bookings" && (
              <div className="section-card">
                <div className="tabs">
                  {["all", "active", "upcoming", "completed"].map(s => (
                    <div key={s} className={`tab ${filterProp === null && s === "all" ? "" : ""}`}
                      style={{ background: "transparent", color: "var(--muted)", cursor: "default" }}>
                    </div>
                  ))}
                </div>
                <div>
                  {filtered(bookings).length === 0 && <div className="empty">No bookings found.</div>}
                  {filtered(bookings).map(b => {
                    const prop = properties.find(p => p.id === b.propertyId);
                    return (
                      <div className="booking-row" key={b.id} style={{ alignItems: "flex-start" }}>
                        <span className="prop-emoji" style={{ fontSize: 24, marginTop: 2 }}>{prop?.img}</span>
                        <div className="booking-info">
                          <div className="booking-guest">{b.guest}</div>
                          <div className="booking-meta" style={{ marginBottom: 4 }}>{prop?.name} · {b.platform}</div>
                          <div className="booking-meta">{b.checkIn} → {b.checkOut} · {b.nights} nights</div>
                        </div>
                        <div className="booking-right">
                          <div className="booking-revenue" style={{ fontSize: 18 }}>${(b.nights * b.rate).toLocaleString()}</div>
                          <div style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 6px" }}>${b.rate}/night</div>
                          <span className="status-badge" style={{ background: STATUS_COLORS[b.status] + "22", color: STATUS_COLORS[b.status] }}>{b.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CALENDAR */}
            {tab === "calendar" && (
              <div className="section-card">
                <div className="section-header">
                  <button className="btn btn-ghost btn-sm" onClick={() => { let m = calMonth - 1; let y = calYear; if (m < 0) { m = 11; y--; } setCalMonth(m); setCalYear(y); }}>← Prev</button>
                  <div className="section-title">{monthNames[calMonth]} {calYear}</div>
                  <button className="btn btn-ghost btn-sm" onClick={() => { let m = calMonth + 1; let y = calYear; if (m > 11) { m = 0; y++; } setCalMonth(m); setCalYear(y); }}>Next →</button>
                </div>
                <div className="cal-grid">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d} className="cal-day-label">{d}</div>)}
                  {calDays.map((d, i) => {
                    const isToday = fmt(d.date) === fmt(today);
                    const isBooked = bookedDates.has(fmt(d.date));
                    return (
                      <div key={i} className={`cal-day ${isToday ? "today" : ""} ${isBooked && !isToday ? "booked" : ""} ${!d.current ? "other-month" : ""}`}>
                        {d.date.getDate()}
                      </div>
                    );
                  })}
                </div>
                <div style={{ padding: "12px 20px 20px", display: "flex", gap: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "#E8704A" }} /> Today
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: "rgba(74,126,107,0.3)" }} /> Booked
                  </div>
                </div>
              </div>
            )}

            {/* MAINTENANCE */}
            {tab === "maintenance" && (
              <div className="section-card">
                <div className="section-header">
                  <div className="section-title">All Issues</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 13, color: "var(--muted)" }}>{openIssues} open</span>
                  </div>
                </div>
                {filtered(maintenance).length === 0 && <div className="empty">No maintenance issues. 🎉</div>}
                {filtered(maintenance).map(m => {
                  const prop = properties.find(p => p.id === m.propertyId);
                  return (
                    <div className="maint-row" key={m.id}>
                      <div className="maint-dot" style={{ background: PRIORITY_COLORS[m.priority], marginTop: 6 }} />
                      <div className="maint-info">
                        <div className="maint-title" style={{ textDecoration: m.status === "resolved" ? "line-through" : "none", opacity: m.status === "resolved" ? 0.5 : 1 }}>{m.title}</div>
                        <div className="maint-sub">{prop?.name} · {m.date}{m.notes ? ` · ${m.notes}` : ""}</div>
                        {m.cost && <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 3 }}>Cost: ${m.cost}</div>}
                      </div>
                      <div className="maint-right">
                        <span className="status-badge" style={{ background: STATUS_COLORS[m.status] + "22", color: STATUS_COLORS[m.status] }}>{m.status}</span>
                        <button className="btn btn-ghost btn-sm" style={{ marginTop: 6, fontSize: 11 }} onClick={() => toggleMaintStatus(m.id)}>
                          {m.status === "resolved" ? "Reopen" : "Resolve"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PROPERTIES */}
            {tab === "properties" && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 20 }}>
                  {properties.map(p => {
                    const rev = bookings.filter(b => b.propertyId === p.id && b.status !== "upcoming").reduce((s, b) => s + b.nights * b.rate, 0);
                    const active = bookings.find(b => b.propertyId === p.id && b.status === "active");
                    const bCount = bookings.filter(b => b.propertyId === p.id).length;
                    const mCount = maintenance.filter(m => m.propertyId === p.id && m.status !== "resolved").length;
                    return (
                      <div key={p.id} className="section-card" style={{ overflow: "visible" }}>
                        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ fontSize: 36, lineHeight: 1 }}>{p.img}</div>
                              <div>
                                <div style={{ fontFamily: "var(--font-display)", fontSize: 17, fontWeight: 600 }}>{p.name}</div>
                                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 3 }}>{p.location}</div>
                              </div>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => openEditProp(p)}>Edit</button>
                              <button className="btn btn-ghost btn-sm" style={{ color: "#D97B6C" }} onClick={() => { if(window.confirm("Delete " + p.name + "? This removes all its bookings and maintenance too.")) deleteProperty(p.id); }}>✕</button>
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Revenue</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: p.color, marginTop: 4 }}>${rev.toLocaleString()}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Bookings</div>
                            <div style={{ fontSize: 18, fontWeight: 700, marginTop: 4 }}>{bCount}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 1 }}>Issues</div>
                            <div style={{ fontSize: 18, fontWeight: 700, color: mCount > 0 ? "#D97B6C" : "var(--text)", marginTop: 4 }}>{mCount}</div>
                          </div>
                        </div>
                        <div style={{ padding: "0 20px 16px" }}>
                          {active
                            ? <span className="status-badge" style={{ background: "#5BA58C22", color: "#5BA58C" }}>● Occupied now</span>
                            : <span className="status-badge" style={{ background: "#33333355", color: "#666" }}>Vacant</span>}
                        </div>
                      </div>
                    );
                  })}
                  {properties.length === 0 && (
                    <div className="section-card">
                      <div className="empty">No properties yet. Click <strong>+ Add Property</strong> to get started.</div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* FINANCES */}
            {tab === "finances" && (
              <>
                <div className="stat-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  <div className="stat-card green">
                    <div className="stat-label">Gross Revenue</div>
                    <div className="stat-value">${totalRevenue.toLocaleString()}</div>
                    <div className="stat-change">All completed bookings</div>
                  </div>
                  <div className="stat-card orange">
                    <div className="stat-label">Maintenance Costs</div>
                    <div className="stat-value">${totalCosts.toLocaleString()}</div>
                    <div className="stat-change">Logged expenses</div>
                  </div>
                  <div className="stat-card blue">
                    <div className="stat-label">Net Income</div>
                    <div className="stat-value">${(totalRevenue - totalCosts).toLocaleString()}</div>
                    <div className="stat-change up">↑ Revenue minus costs</div>
                  </div>
                </div>

                <div className="two-col">
                  <div className="section-card">
                    <div className="section-header"><div className="section-title">Revenue by Property</div></div>
                    {properties.map(p => {
                      const rev = filtered(bookings).filter(b => b.propertyId === p.id && b.status !== "upcoming").reduce((s, b) => s + b.nights * b.rate, 0);
                      const pct = totalRevenue ? Math.round(rev / totalRevenue * 100) : 0;
                      return (
                        <div className="finance-row" key={p.id}>
                          <div>
                            <div className="finance-label">{p.img} {p.name}</div>
                            <div className="finance-period">{p.location}</div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div className="finance-amount income">${rev.toLocaleString()}</div>
                            <div style={{ fontSize: 11, color: "var(--muted)" }}>{pct}% of total</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="section-card">
                    <div className="section-header"><div className="section-title">Maintenance Expenses</div></div>
                    {filtered(maintenance).filter(m => m.cost).map(m => {
                      const prop = properties.find(p => p.id === m.propertyId);
                      return (
                        <div className="finance-row" key={m.id}>
                          <div>
                            <div className="finance-label">{m.title}</div>
                            <div className="finance-period">{prop?.name} · {m.date}</div>
                          </div>
                          <div className="finance-amount expense">-${m.cost}</div>
                        </div>
                      );
                    })}
                    {filtered(maintenance).filter(m => m.cost).length === 0 && <div className="empty">No expenses logged yet.</div>}
                  </div>
                </div>
              </>
            )}

            {/* AI ASSISTANT */}
          </div>
        </div>

        {/* New Booking Modal */}
        {showBookingModal && (
          <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">New Booking</div>
              <div className="form-group">
                <label className="form-label">Property</label>
                <select className="form-select" value={newBooking.propertyId} onChange={e => setNewBooking({ ...newBooking, propertyId: e.target.value })}>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Guest Name</label>
                <input className="form-input" placeholder="Full name" value={newBooking.guest} onChange={e => setNewBooking({ ...newBooking, guest: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Check In</label>
                  <input type="date" className="form-input" value={newBooking.checkIn} onChange={e => setNewBooking({ ...newBooking, checkIn: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Check Out</label>
                  <input type="date" className="form-input" value={newBooking.checkOut} onChange={e => setNewBooking({ ...newBooking, checkOut: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nightly Rate ($)</label>
                  <input type="number" className="form-input" placeholder="200" value={newBooking.rate} onChange={e => setNewBooking({ ...newBooking, rate: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Platform</label>
                  <select className="form-select" value={newBooking.platform} onChange={e => setNewBooking({ ...newBooking, platform: e.target.value })}>
                    {["Airbnb", "Vrbo", "Direct", "Booking.com"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setShowBookingModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={addBooking}>Add Booking</button>
              </div>
            </div>
          </div>
        )}

        {/* New Maintenance Modal */}
        {showMaintModal && (
          <div className="modal-overlay" onClick={() => setShowMaintModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">New Maintenance Issue</div>
              <div className="form-group">
                <label className="form-label">Property</label>
                <select className="form-select" value={newMaint.propertyId} onChange={e => setNewMaint({ ...newMaint, propertyId: e.target.value })}>
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Issue Title</label>
                <input className="form-input" placeholder="e.g. Leaking faucet in bathroom" value={newMaint.title} onChange={e => setNewMaint({ ...newMaint, title: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select className="form-select" value={newMaint.priority} onChange={e => setNewMaint({ ...newMaint, priority: e.target.value })}>
                    {["high", "medium", "low"].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Cost ($)</label>
                  <input type="number" className="form-input" placeholder="Optional" value={newMaint.cost} onChange={e => setNewMaint({ ...newMaint, cost: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" placeholder="Any additional details..." value={newMaint.notes} onChange={e => setNewMaint({ ...newMaint, notes: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => setShowMaintModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={addMaint}>Add Issue</button>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Property Modal */}
        {showPropModal && (
          <div className="modal-overlay" onClick={() => { setShowPropModal(false); setEditProp(null); }}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-title">{editProp ? "Edit Property" : "Add New Property"}</div>
              <div className="form-group">
                <label className="form-label">Property Name</label>
                <input className="form-input" placeholder="e.g. Beachfront Villa" value={newProp.name} onChange={e => setNewProp({ ...newProp, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="e.g. Miami Beach, FL" value={newProp.location} onChange={e => setNewProp({ ...newProp, location: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {EMOJIS.map(e => (
                    <div key={e} onClick={() => setNewProp({ ...newProp, img: e })}
                      style={{ fontSize: 24, cursor: "pointer", padding: "6px 10px", borderRadius: 8,
                        border: newProp.img === e ? "2px solid var(--accent)" : "2px solid var(--border)",
                        background: newProp.img === e ? "var(--surface2)" : "transparent" }}>
                      {e}
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {COLORS.map(c => (
                    <div key={c} onClick={() => setNewProp({ ...newProp, color: c })}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: c, cursor: "pointer",
                        border: newProp.color === c ? "3px solid #fff" : "3px solid transparent",
                        boxShadow: newProp.color === c ? "0 0 0 2px " + c : "none" }}>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-ghost" onClick={() => { setShowPropModal(false); setEditProp(null); }}>Cancel</button>
                <button className="btn btn-primary" onClick={saveProperty}>{editProp ? "Save Changes" : "Add Property"}</button>
              </div>
            </div>
          </div>
        )}
    </>
  );
}
