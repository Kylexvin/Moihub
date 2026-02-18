import { useState, useEffect } from "react";
import { Phone, MessageCircle, X, ChevronLeft, MapPin, Star, CheckCircle, Loader2, AlertCircle } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_ID = "6972884cf20310f7b238930b";

const ROUTES = [
  { label: "Moi Uni → Eldoret Town",  fare: 80 },
  { label: "Moi Uni → Kapsabet",      fare: 60 },
  { label: "Moi Uni → Turbo",         fare: 50 },
  { label: "Moi Uni → Mosoriot",      fare: 90 },
  { label: "Moi Uni → Webuye",        fare: 120 },
];

const TIMES = ["06:00 AM","07:30 AM","09:00 AM","11:00 AM","01:00 PM","03:30 PM","05:00 PM","07:00 PM"];

// ─────────────────────────────────────────────────────────────────────────────
function useProviders() {
  const [providers, setProviders] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;
    fetch(`https://moihub.onrender.com/api/services/providers/${CATEGORY_ID}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => { if (!cancelled) { setProviders(d.providers || []); setStatus("ok"); } })
      .catch(() => { if (!cancelled) setStatus("err"); });
    return () => { cancelled = true; };
  }, []);

  return { providers, status };
}

function formatWhatsApp(phone, name) {
  const d = phone.replace(/\D/g, "");
  const n = d.startsWith("0") ? `254${d.slice(1)}` : d;
  const m = encodeURIComponent(`Hi ${name}, I'd like to book a seat from Moi University.`);
  return `https://wa.me/${n}?text=${m}`;
}

function initials(name = "") {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOKING SCREEN
function BookingScreen({ provider, onBack }) {
  const [route,   setRoute]   = useState(0);
  const [time,    setTime]    = useState(0);
  const [seats,   setSeats]   = useState(1);
  const [state,   setState]   = useState("idle"); // idle | loading | done

  function submit() {
    setState("loading");
    setTimeout(() => setState("done"), 1600);
  }

  if (state === "done") {
    return (
      <div style={s.screen}>
        <div style={s.successWrap}>
          <div style={s.successIcon}><CheckCircle size={40} color="#16a34a" /></div>
          <h2 style={s.successTitle}>Booking Confirmed</h2>
          <p style={s.successSub}>
            {provider.name} has been notified. They'll contact you shortly.
          </p>
          <div style={s.successCard}>
            <Row label="Route"    value={ROUTES[route].label} />
            <Row label="Time"     value={TIMES[time]} />
            <Row label="Seats"    value={seats} />
            <Row label="Fare"     value={`Ksh ${ROUTES[route].fare * seats}`} bold />
          </div>
          {provider.phone && (
            <a href={`tel:${provider.phone}`} style={s.btnPrimary}>
              <Phone size={15} /> Call to confirm
            </a>
          )}
          <button style={s.btnGhost} onClick={onBack}>Back to operators</button>
        </div>
      </div>
    );
  }

  return (
    <div style={s.screen}>
      <div style={s.bookingHeader}>
        <button style={s.backBtn} onClick={onBack}>
          <ChevronLeft size={18} /> Back
        </button>
        <div style={s.bookingOperator}>
          <div style={s.avatarSm}>{initials(provider.name)}</div>
          <span style={s.bookingOpName}>{provider.name}</span>
        </div>
      </div>

      <h2 style={s.bookingTitle}>Book a seat</h2>

      <div style={s.form}>
        <div style={s.field}>
          <label style={s.label}>Route</label>
          <div style={s.radioGroup}>
            {ROUTES.map((r, i) => (
              <button
                key={i}
                style={{ ...s.radioBtn, ...(route === i ? s.radioBtnActive : {}) }}
                onClick={() => setRoute(i)}
              >
                <span style={s.radioLabel}>{r.label}</span>
                <span style={{ ...s.radioFare, ...(route === i ? s.radioFareActive : {}) }}>
                  Ksh {r.fare}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Departure time</label>
          <div style={s.timeGrid}>
            {TIMES.map((t, i) => (
              <button
                key={i}
                style={{ ...s.timeBtn, ...(time === i ? s.timeBtnActive : {}) }}
                onClick={() => setTime(i)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div style={s.field}>
          <label style={s.label}>Seats</label>
          <div style={s.stepper}>
            <button style={s.stepBtn} onClick={() => setSeats(Math.max(1, seats - 1))}>−</button>
            <span style={s.stepVal}>{seats}</span>
            <button style={s.stepBtn} onClick={() => setSeats(Math.min(8, seats + 1))}>+</button>
          </div>
        </div>

        <div style={s.summary}>
          <span style={s.summaryLabel}>Total</span>
          <span style={s.summaryTotal}>Ksh {ROUTES[route].fare * seats}</span>
        </div>

        <button style={s.btnPrimary} onClick={submit} disabled={state === "loading"}>
          {state === "loading"
            ? <Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} />
            : <><Phone size={15} /> Confirm &amp; Notify Operator</>
          }
        </button>

        {provider.phone && (
          <a
            href={formatWhatsApp(provider.phone, provider.name)}
            target="_blank"
            rel="noreferrer"
            style={s.btnWa}
          >
            <MessageCircle size={15} /> Book via WhatsApp
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVIDER LIST SCREEN
function ProviderListScreen({ providers, status, onSelect }) {
  const [search, setSearch] = useState("");

  const list = providers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={s.screen}>
      <div style={s.listHeader}>
        <div>
          <h1 style={s.listTitle}>Matatu Operators</h1>
          <p style={s.listSub}>Moi University · Tap to book or call</p>
        </div>
        {status === "ok" && <span style={s.countBadge}>{providers.length} online</span>}
      </div>

      <input
        style={s.search}
        placeholder="Search operator…"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {status === "loading" && (
        <div style={s.stateBox}>
          <Loader2 size={26} color="#15803d" style={{ animation: "spin 1s linear infinite" }} />
          <span style={s.stateText}>Loading…</span>
        </div>
      )}

      {status === "err" && (
        <div style={s.stateBox}>
          <AlertCircle size={26} color="#dc2626" />
          <span style={{ ...s.stateText, color: "#dc2626" }}>Couldn't load. Check connection.</span>
        </div>
      )}

      {status === "ok" && list.length === 0 && (
        <div style={s.stateBox}>
          <span style={s.stateText}>{search ? `No results for "${search}"` : "No operators right now."}</span>
        </div>
      )}

      {status === "ok" && list.length > 0 && (
        <div style={s.list}>
          {list.map(p => (
            <ProviderRow key={p.id || p.name} provider={p} onTap={() => onSelect(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProviderRow({ provider, onTap }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      style={{ ...s.row, ...(hov ? s.rowHov : {}) }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={s.rowLeft}>
        <div style={s.avatar}>{initials(provider.name)}</div>
        <div style={s.rowInfo}>
          <span style={s.rowName}>{provider.name}</span>
          {provider.address && (
            <span style={s.rowAddress}><MapPin size={11} /> {provider.address}</span>
          )}
          {provider.rating > 0 && (
            <span style={s.rowRating}><Star size={11} fill="#FBBF24" color="#FBBF24" /> {provider.rating}</span>
          )}
        </div>
      </div>

      <div style={s.rowActions}>
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            style={s.actionCall}
            onClick={e => e.stopPropagation()}
          >
            <Phone size={14} />
          </a>
        )}
        <button style={s.actionBook} onClick={onTap}>
          Book →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
export default function App() {
  const { providers, status } = useProviders();
  const [selected, setSelected] = useState(null);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f4f4f4; font-family: system-ui, -apple-system, sans-serif; }
        a { text-decoration: none; }
        button, a { cursor: pointer; }
      `}</style>

      <div style={s.root}>
        {selected
          ? <BookingScreen provider={selected} onBack={() => setSelected(null)} />
          : <ProviderListScreen providers={providers} status={status} onSelect={setSelected} />
        }
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Tiny helper
function Row({ label, value, bold }) {
  return (
    <div style={s.summaryRow}>
      <span style={s.summaryRowLabel}>{label}</span>
      <span style={{ ...s.summaryRowVal, ...(bold ? { fontWeight: 700, color: "#15803d" } : {}) }}>{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
const C = {
  bg:       "#F5F5F5",
  white:    "#FFFFFF",
  ink:      "#111111",
  sub:      "#6B7280",
  border:   "#E5E7EB",
  green:    "#15803d",
  greenBg:  "#f0fdf4",
  greenBdr: "#bbf7d0",
  wa:       "#25D366",
  amber:    "#FBBF24",
  red:      "#dc2626",
};

const s = {
  root: {
    minHeight: "100vh",
    background: C.bg,
    display: "flex",
    justifyContent: "center",
    padding: "0 0 40px",
  },

  screen: {
    width: "100%",
    maxWidth: 520,
    display: "flex",
    flexDirection: "column",
    padding: "0 16px",
  },

  // ── List screen
  listHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: "32px 0 20px",
  },
  listTitle: {
    fontSize: 24,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: C.ink,
    marginBottom: 4,
  },
  listSub: {
    fontSize: 13,
    color: C.sub,
  },
  countBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: C.green,
    background: C.greenBg,
    border: `1px solid ${C.greenBdr}`,
    padding: "4px 10px",
    borderRadius: 100,
    marginTop: 4,
  },
  search: {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.white,
    fontSize: 14,
    color: C.ink,
    fontFamily: "inherit",
    outline: "none",
    marginBottom: 16,
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "14px 14px",
    gap: 12,
    transition: "box-shadow .15s, border-color .15s",
  },
  rowHov: {
    borderColor: "#d1fae5",
    boxShadow: "0 2px 12px rgba(0,0,0,.06)",
  },
  rowLeft: { display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  avatar: {
    width: 42, height: 42, flexShrink: 0,
    background: C.greenBg,
    color: C.green,
    borderRadius: 11,
    display: "grid",
    placeItems: "center",
    fontSize: 14,
    fontWeight: 700,
  },
  rowInfo: { display: "flex", flexDirection: "column", gap: 3, minWidth: 0 },
  rowName: {
    fontSize: 14, fontWeight: 600, color: C.ink,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  rowAddress: { display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.sub },
  rowRating:  { display: "flex", alignItems: "center", gap: 3, fontSize: 12, color: C.amber },
  rowActions: { display: "flex", alignItems: "center", gap: 8, flexShrink: 0 },
  actionCall: {
    width: 36, height: 36,
    borderRadius: 9,
    border: `1px solid ${C.border}`,
    background: C.white,
    display: "grid", placeItems: "center",
    color: C.ink,
  },
  actionBook: {
    padding: "8px 14px",
    borderRadius: 9,
    border: "none",
    background: C.green,
    color: "#fff",
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "inherit",
  },

  // ── Booking screen
  bookingHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 0 8px",
  },
  backBtn: {
    display: "flex", alignItems: "center", gap: 4,
    fontSize: 14, fontWeight: 500, color: C.sub,
    background: "none", border: "none",
    fontFamily: "inherit",
  },
  bookingOperator: { display: "flex", alignItems: "center", gap: 8 },
  avatarSm: {
    width: 28, height: 28,
    background: C.greenBg, color: C.green,
    borderRadius: 7,
    display: "grid", placeItems: "center",
    fontSize: 11, fontWeight: 700,
  },
  bookingOpName: { fontSize: 13, fontWeight: 600, color: C.ink },
  bookingTitle: {
    fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em",
    color: C.ink, marginBottom: 24, marginTop: 4,
  },
  form: { display: "flex", flexDirection: "column", gap: 24 },
  field: { display: "flex", flexDirection: "column", gap: 10 },
  label: { fontSize: 12, fontWeight: 700, color: C.sub, textTransform: "uppercase", letterSpacing: "0.07em" },

  radioGroup: { display: "flex", flexDirection: "column", gap: 6 },
  radioBtn: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 14px",
    borderRadius: 10,
    border: `1px solid ${C.border}`,
    background: C.white,
    cursor: "pointer", fontFamily: "inherit",
    transition: "border-color .15s, background .15s",
  },
  radioBtnActive: { borderColor: C.green, background: C.greenBg },
  radioLabel: { fontSize: 14, fontWeight: 500, color: C.ink },
  radioFare:  { fontSize: 13, fontWeight: 600, color: C.sub },
  radioFareActive: { color: C.green },

  timeGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 },
  timeBtn: {
    padding: "9px 4px",
    borderRadius: 8,
    border: `1px solid ${C.border}`,
    background: C.white,
    fontSize: 12, fontWeight: 500, color: C.ink,
    cursor: "pointer", fontFamily: "inherit",
    transition: "border-color .15s, background .15s",
  },
  timeBtnActive: { borderColor: C.green, background: C.greenBg, color: C.green, fontWeight: 700 },

  stepper: { display: "flex", alignItems: "center", gap: 0, width: "fit-content" },
  stepBtn: {
    width: 40, height: 40,
    border: `1px solid ${C.border}`,
    background: C.white,
    fontSize: 18, fontWeight: 500, color: C.ink,
    cursor: "pointer", fontFamily: "inherit",
    borderRadius: 8,
  },
  stepVal: { fontSize: 18, fontWeight: 700, width: 48, textAlign: "center" },

  summary: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px",
    background: C.greenBg,
    borderRadius: 10,
    border: `1px solid ${C.greenBdr}`,
  },
  summaryLabel: { fontSize: 13, fontWeight: 600, color: C.sub },
  summaryTotal: { fontSize: 20, fontWeight: 800, color: C.green, letterSpacing: "-0.02em" },

  btnPrimary: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: C.green, color: "#fff",
    fontSize: 15, fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  },
  btnWa: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    padding: "13px",
    borderRadius: 12,
    border: `1px solid #86efac`,
    background: C.white, color: C.wa,
    fontSize: 14, fontWeight: 600,
  },
  btnGhost: {
    background: "none", border: "none",
    fontSize: 13, color: C.sub, fontFamily: "inherit",
    padding: "8px 0",
  },

  // ── Success
  successWrap: {
    display: "flex", flexDirection: "column", alignItems: "center",
    textAlign: "center", padding: "48px 0 24px", gap: 12,
  },
  successIcon: {
    width: 72, height: 72,
    background: C.greenBg, borderRadius: "50%",
    display: "grid", placeItems: "center",
    marginBottom: 4,
  },
  successTitle: { fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: C.ink },
  successSub:   { fontSize: 14, color: C.sub, maxWidth: 280, lineHeight: 1.6 },
  successCard: {
    width: "100%",
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    overflow: "hidden",
    margin: "8px 0",
    textAlign: "left",
  },
  summaryRow: {
    display: "flex", justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: `1px solid ${C.border}`,
    fontSize: 14,
  },
  summaryRowLabel: { color: C.sub },
  summaryRowVal:   { color: C.ink, fontWeight: 500 },

  // ── States
  stateBox: {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 10, padding: "64px 0",
  },
  stateText: { fontSize: 14, color: C.sub },
};