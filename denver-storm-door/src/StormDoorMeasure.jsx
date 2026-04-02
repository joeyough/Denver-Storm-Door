import { useState, useEffect, useRef } from "react";

const C = {
  cream: "#FBF8F3", green: "#1B3A2D", auburn: "#BF6A3A", gold: "#C9A961",
  white: "#FFFFFF", g100: "#F5F2ED", g200: "#E8E4DE", g300: "#D1CCC4",
  g500: "#8A8580", g700: "#4A4540", red: "#C44B3F", yellow: "#D4A32C", gResult: "#2D8B5E",
};
const F = { d: "'Playfair Display', Georgia, serif", b: "'DM Sans', -apple-system, sans-serif" };

const STEPS = [
  { id: "width_top", label: "Width — Top", desc: "Measure across the top of the frame, inside edge to inside edge.", type: "width", pos: "top" },
  { id: "width_middle", label: "Width — Middle", desc: "Across the middle, roughly at handle height.", type: "width", pos: "middle" },
  { id: "width_bottom", label: "Width — Bottom", desc: "Across the bottom, just above the threshold.", type: "width", pos: "bottom" },
  { id: "height_left", label: "Height — Left", desc: "Top of frame down to threshold, left side.", type: "height", pos: "left" },
  { id: "height_right", label: "Height — Right", desc: "Top of frame down to threshold, right side.", type: "height", pos: "right" },
];

function classify(w) {
  if (w >= 35.75 && w <= 36.375) return "FIT_36";
  if (w >= 31.75 && w <= 32.375) return "FIT_32";
  return "CUSTOM";
}

const fmtIn = (v) => {
  if (v == null) return "—";
  const w = Math.floor(v), f = v - w;
  const m = { 0:"", 0.125:"⅛", 0.25:"¼", 0.375:"⅜", 0.5:"½", 0.625:"⅝", 0.75:"¾", 0.875:"⅞" };
  let cl = 0, md = 999;
  Object.keys(m).forEach(k => { const kn = parseFloat(k); if (Math.abs(f - kn) < md) { md = Math.abs(f - kn); cl = kn; } });
  return cl === 0 ? `${w}"` : `${w} ${m[cl]}"`;
};

// ─── Visual tape measure segment showing marks between two inch lines ───
function TapeMatchPicker({ value, onChange }) {
  // Each option shows a mini tape segment with an arrow pointing at the mark
  const opts = [
    { val: 0,     label: "Right on the line",    shortLabel: "Even" },
    { val: 0.125, label: "One tiny tick past",    shortLabel: "⅛" },
    { val: 0.25,  label: "First small tick",      shortLabel: "¼" },
    { val: 0.375, label: "Three tiny ticks past ¼", shortLabel: "⅜" },
    { val: 0.5,   label: "The big middle tick",   shortLabel: "½" },
    { val: 0.625, label: "One tiny tick past ½",  shortLabel: "⅝" },
    { val: 0.75,  label: "Last small tick",       shortLabel: "¾" },
    { val: 0.875, label: "One tiny tick before next", shortLabel: "⅞" },
  ];

  // Draw a mini tape segment between two inch marks
  const MiniTape = ({ highlight, compact }) => {
    const w = compact ? 200 : 220;
    const h = compact ? 44 : 52;
    const left = 10, right = w - 10;
    const span = right - left;

    // Tick positions (16ths)
    const ticks = [];
    for (let i = 0; i <= 16; i++) {
      const x = left + (i / 16) * span;
      let tickH;
      if (i === 0 || i === 16) tickH = h - 8;      // inch marks
      else if (i === 8) tickH = h * 0.55;            // half
      else if (i % 4 === 0) tickH = h * 0.4;         // quarter
      else if (i % 2 === 0) tickH = h * 0.3;         // eighth
      else tickH = h * 0.2;                           // sixteenth

      const isHL = highlight !== null && i === Math.round(highlight * 16);
      ticks.push({ x, tickH, isHL, i });
    }

    return (
      <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: "block" }}>
        {/* Tape background */}
        <rect x={left - 2} y={0} width={span + 4} height={h} rx={3} fill="#FFF8E7" stroke="#E8D5A8" strokeWidth={1} />

        {/* Ticks */}
        {ticks.map((t, idx) => (
          <line key={idx} x1={t.x} y1={h} x2={t.x} y2={h - t.tickH}
            stroke={t.isHL ? C.auburn : "#8B7355"} strokeWidth={t.isHL ? 2.5 : (t.i === 0 || t.i === 16) ? 1.5 : 1}
            strokeLinecap="round" />
        ))}

        {/* Highlight arrow */}
        {highlight !== null && (() => {
          const hx = left + (highlight / 1) * span;
          return (
            <>
              <circle cx={hx} cy={6} r={4} fill={C.auburn} />
              <line x1={hx} y1={10} x2={hx} y2={h - 4} stroke={C.auburn} strokeWidth={1.5} strokeDasharray="3,2" />
            </>
          );
        })()}
      </svg>
    );
  };

  return (
    <div>
      <p style={{
        fontSize: 14, color: C.g700, textAlign: "center", margin: "0 0 6px",
        fontFamily: F.b, fontWeight: 600, lineHeight: 1.3,
      }}>
        Where does the tape land between inch marks?
      </p>
      <p style={{
        fontSize: 12, color: C.g500, textAlign: "center", margin: "0 0 14px",
        fontFamily: F.b,
      }}>
        Tap the one that matches what you see
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {opts.map((opt) => {
          const active = value === opt.val;
          return (
            <button key={opt.val} onClick={() => onChange(opt.val)}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "8px 12px", borderRadius: 12, border: "none", cursor: "pointer",
                background: active ? C.green : C.white,
                boxShadow: active ? "0 2px 10px rgba(27,58,45,0.2)" : "0 1px 3px rgba(0,0,0,0.06)",
                transition: "all 0.15s ease", width: "100%", textAlign: "left",
              }}>
              {/* Mini tape */}
              <div style={{
                flexShrink: 0, borderRadius: 6, overflow: "hidden",
                border: `1.5px solid ${active ? C.gold : C.g200}`,
                opacity: active ? 1 : 0.7,
              }}>
                <MiniTape highlight={opt.val} compact />
              </div>

              {/* Label */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: 14, fontWeight: active ? 700 : 500,
                  color: active ? C.cream : C.g700, fontFamily: F.b,
                  display: "block", lineHeight: 1.3,
                }}>
                  {opt.label}
                </span>
              </div>

              {/* Fraction badge */}
              <div style={{
                flexShrink: 0, padding: "3px 8px", borderRadius: 6,
                background: active ? "rgba(201,169,97,0.3)" : C.g100,
                fontSize: 14, fontWeight: 700, fontFamily: F.b,
                color: active ? C.gold : C.g500,
              }}>
                {opt.shortLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Door Diagram ───
function DoorDiagram({ type, pos }) {
  const w = 140, h = 195, p = 22;
  const fL = p, fR = w - p, fT = p, fB = h - p;
  const isA = (t, pp) => type === t && pos === pp;
  const lc = (t, pp) => isA(t, pp) ? C.auburn : C.g300;
  const lw = (t, pp) => isA(t, pp) ? 3 : 1.5;

  const arrow = (x1, y1, x2, y2, col, sw) => {
    const a = 5, ang = Math.atan2(y2 - y1, x2 - x1);
    return <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={col} strokeWidth={sw} strokeLinecap="round" />
      <polygon points={`${x2},${y2} ${x2-a*Math.cos(ang-.4)},${y2-a*Math.sin(ang-.4)} ${x2-a*Math.cos(ang+.4)},${y2-a*Math.sin(ang+.4)}`} fill={col} />
      <polygon points={`${x1},${y1} ${x1+a*Math.cos(ang-.4)},${y1+a*Math.sin(ang-.4)} ${x1+a*Math.cos(ang+.4)},${y1+a*Math.sin(ang+.4)}`} fill={col} />
    </>;
  };

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="120" height="168" style={{ display: "block", margin: "0 auto" }}>
      <rect x={fL} y={fT} width={fR-fL} height={fB-fT} rx={3} fill="none" stroke={C.g300} strokeWidth={2.5} />
      {[0,1,2,3,4,5].map(i => <line key={i} x1={fL+i*16} y1={fB} x2={fL+i*16+8} y2={fB+6} stroke={C.g300} strokeWidth={1} />)}
      {["top","middle","bottom"].map(pp => {
        const y = pp==="top"?fT+10:pp==="middle"?(fT+fB)/2:fB-10;
        return <g key={pp} opacity={isA("width",pp)?1:0.25}>{arrow(fL+5,y,fR-5,y,lc("width",pp),lw("width",pp))}</g>;
      })}
      {["left","right"].map(pp => {
        const x = pp==="left"?fL+12:fR-12;
        return <g key={pp} opacity={isA("height",pp)?1:0.25}>{arrow(x,fT+5,x,fB-5,lc("height",pp),lw("height",pp))}</g>;
      })}
    </svg>
  );
}

// ─── Progress ───
function Progress({ current, total }) {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 4, borderRadius: 2,
          background: i < current ? C.green : i === current ? C.auburn : C.g200,
          transition: "background 0.3s",
        }} />
      ))}
    </div>
  );
}

// ─── Result ───
function Result({ m, onEdit }) {
  const wMin = Math.min(m.width_top, m.width_middle, m.width_bottom);
  const hMin = Math.min(m.height_left, m.height_right);
  const wV = Math.max(m.width_top, m.width_middle, m.width_bottom) - wMin;
  const hV = Math.max(m.height_left, m.height_right) - hMin;
  const oos = wV > 0.5 || hV > 0.5;
  const fit = classify(wMin);

  let sColor, sBg, sIcon, sMsg, sSub, status;
  if (fit === "CUSTOM" || oos) {
    status="red"; sColor=C.red; sBg="#FEF2F1"; sIcon="✕";
    sMsg="Custom Fit Required";
    sSub=oos ? `Frame is out of square by ${Math.max(wV,hV).toFixed(2)}". We recommend a pro measurement.`
      : "Your opening doesn't match standard sizes. Let's get a tech out there.";
  } else if (wV > 0.25 || hV > 0.25) {
    status="yellow"; sColor=C.yellow; sBg="#FEF9EC"; sIcon="!";
    sMsg=`Borderline — ${fit==="FIT_36"?'36"':'32"'} May Work`;
    sSub="Close but worth double-checking before you order.";
  } else {
    status="green"; sColor=C.gResult; sBg="#EFFAF3"; sIcon="✓";
    sMsg=`Fits Standard ${fit==="FIT_36"?'36"':'32"'} Door`;
    sSub="You're good to go.";
  }

  return (
    <div style={{ minHeight: "100dvh", background: C.cream, fontFamily: F.b, display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 20px 0", textAlign: "center" }}>
        <p style={{ fontSize: 12, color: C.g500, letterSpacing: 1.5, textTransform: "uppercase", margin: 0, fontWeight: 600 }}>Your Results</p>
      </div>

      <div style={{ margin: "18px 16px", padding: "26px 22px", borderRadius: 20, background: sBg, textAlign: "center" }}>
        <div style={{
          width: 50, height: 50, borderRadius: "50%", margin: "0 auto 12px",
          background: sColor, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: C.white, fontWeight: 800,
        }}>{sIcon}</div>
        <h2 style={{ fontFamily: F.d, fontSize: 22, color: C.green, margin: "0 0 8px", fontWeight: 700, lineHeight: 1.2 }}>{sMsg}</h2>
        <p style={{ fontSize: 14, color: C.g700, margin: 0, lineHeight: 1.5 }}>{sSub}</p>
      </div>

      <div style={{ margin: "0 16px", padding: "16px", borderRadius: 16, background: C.white }}>
        <p style={{ fontSize: 11, color: C.g500, letterSpacing: 1.2, textTransform: "uppercase", margin: "0 0 10px", fontWeight: 600 }}>Measurements</p>
        {[
          ["Width Top", m.width_top], ["Width Mid", m.width_middle], ["Width Bot", m.width_bottom],
          ["Height L", m.height_left], ["Height R", m.height_right],
        ].map(([l,v]) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${C.g100}` }}>
            <span style={{ fontSize: 13, color: C.g700 }}>{l}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{fmtIn(v)}</span>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[["Width Var", wV], ["Height Var", hV]].map(([l,v]) => (
            <div key={l} style={{ flex: 1, padding: 7, borderRadius: 10, background: C.g100, textAlign: "center" }}>
              <p style={{ fontSize: 10, color: C.g500, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: 0.8 }}>{l}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: v > 0.5 ? C.red : C.green, margin: 0 }}>{v.toFixed(3)}"</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 16px", marginTop: "auto", display: "flex", flexDirection: "column", gap: 8 }}>
        {status === "green" && <button style={{ width: "100%", height: 52, borderRadius: 14, border: "none", cursor: "pointer", background: C.green, color: C.cream, fontSize: 17, fontWeight: 700, fontFamily: F.b, boxShadow: "0 3px 14px rgba(27,58,45,0.2)" }}>Browse Doors →</button>}
        {status === "red" && <button style={{ width: "100%", height: 52, borderRadius: 14, border: "none", cursor: "pointer", background: C.auburn, color: C.cream, fontSize: 17, fontWeight: 700, fontFamily: F.b }}>Schedule a Tech Visit</button>}
        {status === "yellow" && <>
          <button style={{ width: "100%", height: 52, borderRadius: 14, border: "none", cursor: "pointer", background: C.green, color: C.cream, fontSize: 17, fontWeight: 700, fontFamily: F.b }}>Browse {fit==="FIT_36"?'36"':'32"'} Doors</button>
          <button style={{ width: "100%", height: 44, borderRadius: 14, border: `2px solid ${C.auburn}`, cursor: "pointer", background: "transparent", color: C.auburn, fontSize: 15, fontWeight: 600, fontFamily: F.b }}>Request Pro Measurement</button>
        </>}
        <button onClick={onEdit} style={{ width: "100%", height: 38, borderRadius: 14, border: "none", cursor: "pointer", background: "transparent", color: C.g500, fontSize: 13, fontWeight: 500, fontFamily: F.b, textDecoration: "underline" }}>Edit Measurements</button>
      </div>
    </div>
  );
}

// ─── Main ───
export default function StormDoorMeasureV3() {
  const [screen, setScreen] = useState("welcome");
  const [hasTape, setHasTape] = useState(null);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState("inches"); // inches | fraction
  const [wholeInput, setWholeInput] = useState("");
  const [fracVal, setFracVal] = useState(null);
  const [measurements, setMeasurements] = useState({
    width_top: null, width_middle: null, width_bottom: null,
    height_left: null, height_right: null,
  });
  const [fadeIn, setFadeIn] = useState(true);
  const inputRef = useRef(null);

  const tr = (fn) => { setFadeIn(false); setTimeout(() => { fn(); setFadeIn(true); }, 180); };

  const cs = STEPS[step];

  // When step changes, reset input phase
  useEffect(() => {
    const existing = cs ? measurements[cs.id] : null;
    if (existing != null) {
      setWholeInput(String(Math.floor(existing)));
      const f = existing - Math.floor(existing);
      const fracs = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875];
      let cl = 0, md = 999;
      fracs.forEach(fr => { if (Math.abs(f - fr) < md) { md = Math.abs(f - fr); cl = fr; } });
      setFracVal(cl);
      setPhase("fraction");
    } else {
      setWholeInput("");
      setFracVal(null);
      setPhase("inches");
    }
  }, [step]);

  useEffect(() => {
    if (screen === "measure" && phase === "inches" && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [step, screen, phase]);

  const wholeNum = parseInt(wholeInput) || 0;
  const canGoToFraction = wholeInput !== "" && wholeNum > 0;
  const canFinishStep = fracVal !== null;
  const fullVal = wholeNum + (fracVal || 0);

  const commitAndAdvance = () => {
    setMeasurements(prev => ({ ...prev, [cs.id]: fullVal }));
    if (step < 4) {
      tr(() => { setStep(step + 1); });
    } else {
      // Set last measurement then go to result
      setTimeout(() => tr(() => setScreen("result")), 50);
    }
  };

  // Update measurement whenever fraction changes
  useEffect(() => {
    if (fracVal !== null && wholeInput !== "") {
      setMeasurements(prev => ({ ...prev, [cs.id]: wholeNum + fracVal }));
    }
  }, [fracVal, wholeInput]);

  // ─── WELCOME ───
  if (screen === "welcome") {
    return (
      <div style={{
        minHeight: "100dvh", background: C.cream, fontFamily: F.b,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "0 20px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <svg width="72" height="90" viewBox="0 0 80 100" style={{ marginBottom: 22 }}>
            <rect x="10" y="5" width="60" height="90" rx="4" fill="none" stroke={C.green} strokeWidth="3" />
            <rect x="18" y="12" width="44" height="36" rx="2" fill={C.green} opacity="0.07" stroke={C.green} strokeWidth="1.5" />
            <rect x="18" y="54" width="44" height="36" rx="2" fill={C.green} opacity="0.07" stroke={C.green} strokeWidth="1.5" />
            <circle cx="58" cy="52" r="3.5" fill={C.gold} />
            <line x1="0" y1="95" x2="80" y2="95" stroke={C.g300} strokeWidth="2" />
          </svg>
          <h1 style={{ fontFamily: F.d, fontSize: 28, color: C.green, margin: "0 0 10px", fontWeight: 700, lineHeight: 1.15 }}>
            Measure Your<br />Door Opening
          </h1>
          <p style={{ fontSize: 15, color: C.g700, margin: "0 0 6px", lineHeight: 1.5, maxWidth: 280 }}>
            5 quick measurements with your tape measure. We'll walk you through it.
          </p>
          <p style={{ fontSize: 13, color: C.g500, margin: 0 }}>About 2 minutes</p>
        </div>
        <div style={{ paddingBottom: 36 }}>
          <button onClick={() => tr(() => setScreen("tools"))} style={{
            width: "100%", height: 56, borderRadius: 14, border: "none", cursor: "pointer",
            background: C.green, color: C.cream, fontSize: 18, fontWeight: 700,
            fontFamily: F.b, boxShadow: "0 4px 16px rgba(27,58,45,0.25)",
          }}>Let's Go</button>
        </div>
      </div>
    );
  }

  // ─── TOOLS ───
  if (screen === "tools") {
    return (
      <div style={{
        minHeight: "100dvh", background: C.cream, fontFamily: F.b,
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "0 20px", opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s",
      }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
          <svg width="60" height="60" viewBox="0 0 72 72" style={{ marginBottom: 18 }}>
            <rect x="8" y="16" width="56" height="40" rx="8" fill={C.gold} opacity="0.15" stroke={C.gold} strokeWidth="2" />
            <line x1="36" y1="20" x2="36" y2="52" stroke={C.gold} strokeWidth="1.5" />
            {[20,28,44,52].map((x,i) => <line key={i} x1={x} y1="20" x2={x} y2={i<2?42:36} stroke={C.gold} strokeWidth="1" opacity={0.5} />)}
          </svg>
          <h2 style={{ fontFamily: F.d, fontSize: 24, color: C.green, margin: "0 0 10px", fontWeight: 700 }}>Grab Your Tape Measure</h2>
          <p style={{ fontSize: 14, color: C.g700, margin: "0 0 24px", lineHeight: 1.5, maxWidth: 280 }}>
            Don't worry about reading the little lines — we'll help you figure that part out.
          </p>
          <button onClick={() => { setHasTape(true); tr(() => setScreen("measure")); }} style={{
            width: "100%", maxWidth: 280, height: 54, borderRadius: 14, border: "none", cursor: "pointer",
            background: C.green, color: C.cream, fontSize: 16, fontWeight: 700, fontFamily: F.b,
            boxShadow: "0 3px 14px rgba(27,58,45,0.2)",
          }}>I'm Ready</button>
          <button onClick={() => { setHasTape(false); tr(() => setScreen("measure")); }} style={{
            marginTop: 10, background: "none", border: "none", color: C.g500, fontSize: 14,
            cursor: "pointer", fontFamily: F.b, padding: 8,
          }}>I don't have one</button>
        </div>
        <div style={{ paddingBottom: 36 }}>
          <button onClick={() => tr(() => setScreen("welcome"))} style={{
            background: "none", border: "none", color: C.g500, fontSize: 14,
            cursor: "pointer", fontFamily: F.b, width: "100%", padding: 8,
          }}>← Back</button>
        </div>
      </div>
    );
  }

  // ─── MEASURE ───
  if (screen === "measure") {
    return (
      <div style={{
        minHeight: "100dvh", background: C.cream, fontFamily: F.b,
        display: "flex", flexDirection: "column",
        opacity: fadeIn ? 1 : 0, transition: "opacity 0.15s",
      }}>
        {/* Header */}
        <div style={{ padding: "14px 18px 10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <button onClick={() => {
              if (phase === "fraction") { setPhase("inches"); return; }
              if (step > 0) tr(() => setStep(step - 1));
              else tr(() => setScreen("tools"));
            }} style={{ background: "none", border: "none", color: C.g500, fontSize: 14, cursor: "pointer", fontFamily: F.b }}>← Back</button>
            <span style={{ fontSize: 12, color: C.g500, fontWeight: 600 }}>Step {step + 1} of 5</span>
          </div>
          <Progress current={step} total={5} />
        </div>

        {hasTape === false && step === 0 && (
          <div style={{ margin: "0 16px 6px", padding: "8px 12px", borderRadius: 10, background: "#FEF9EC", fontSize: 13, color: C.g700, lineHeight: 1.4 }}>
            💡 Use a yardstick, ruler, or string measured against a ruler.
          </div>
        )}

        {/* Step content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "10px 18px 0", overflowY: "auto" }}>
          <h2 style={{ fontFamily: F.d, fontSize: 21, color: C.green, margin: "0 0 4px", fontWeight: 700, textAlign: "center" }}>
            {cs.label}
          </h2>
          <p style={{ fontSize: 13, color: C.g500, margin: "0 0 12px", textAlign: "center", lineHeight: 1.4 }}>
            {cs.desc}
          </p>

          <DoorDiagram type={cs.type} pos={cs.pos} />

          <div style={{ marginTop: 14 }}>
            {phase === "inches" ? (
              /* ── PHASE 1: Just the big number ── */
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, color: C.g700, margin: "0 0 4px", fontFamily: F.b, fontWeight: 600 }}>
                  What's the big number on the tape?
                </p>
                <p style={{ fontSize: 12, color: C.g500, margin: "0 0 14px", fontFamily: F.b }}>
                  Just the inches — ignore the little lines for now
                </p>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <input ref={inputRef} type="number" inputMode="numeric" pattern="[0-9]*"
                    value={wholeInput}
                    onChange={e => setWholeInput(e.target.value)}
                    placeholder="36"
                    style={{
                      width: 100, height: 64, fontSize: 36, fontFamily: F.b, fontWeight: 800,
                      textAlign: "center", border: `2.5px solid ${C.g300}`, borderRadius: 14,
                      background: C.white, color: C.green, outline: "none",
                      WebkitAppearance: "none", MozAppearance: "textfield",
                    }}
                    onFocus={e => e.target.style.borderColor = C.auburn}
                    onBlur={e => e.target.style.borderColor = C.g300}
                    onKeyDown={e => { if (e.key === "Enter" && canGoToFraction) setPhase("fraction"); }}
                  />
                  <span style={{ fontSize: 22, color: C.g500, fontFamily: F.b, fontWeight: 600 }}>inches</span>
                </div>
              </div>
            ) : (
              /* ── PHASE 2: Visual tape matching ── */
              <div>
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  marginBottom: 14, padding: "8px 14px", borderRadius: 10, background: C.g100,
                }}>
                  <span style={{ fontSize: 13, color: C.g500, fontFamily: F.b }}>You entered</span>
                  <span style={{ fontSize: 18, fontWeight: 800, color: C.green, fontFamily: F.b }}>{wholeInput}"</span>
                  <button onClick={() => setPhase("inches")} style={{
                    background: "none", border: "none", color: C.auburn, fontSize: 12,
                    cursor: "pointer", fontFamily: F.b, fontWeight: 600, textDecoration: "underline",
                  }}>change</button>
                </div>

                <TapeMatchPicker value={fracVal} onChange={setFracVal} />
              </div>
            )}
          </div>
        </div>

        {/* Bottom button */}
        <div style={{ padding: "14px 18px 32px" }}>
          {phase === "inches" ? (
            <button onClick={() => { if (canGoToFraction) setPhase("fraction"); }}
              disabled={!canGoToFraction}
              style={{
                width: "100%", height: 54, borderRadius: 14, border: "none",
                cursor: canGoToFraction ? "pointer" : "default",
                background: canGoToFraction ? C.green : C.g200,
                color: canGoToFraction ? C.cream : C.g500,
                fontSize: 17, fontWeight: 700, fontFamily: F.b,
                transition: "all 0.2s", boxShadow: canGoToFraction ? "0 3px 14px rgba(27,58,45,0.2)" : "none",
              }}>
              Next — Now the Little Lines
            </button>
          ) : (
            <button onClick={commitAndAdvance}
              disabled={!canFinishStep}
              style={{
                width: "100%", height: 54, borderRadius: 14, border: "none",
                cursor: canFinishStep ? "pointer" : "default",
                background: canFinishStep ? C.green : C.g200,
                color: canFinishStep ? C.cream : C.g500,
                fontSize: 17, fontWeight: 700, fontFamily: F.b,
                transition: "all 0.2s", boxShadow: canFinishStep ? "0 3px 14px rgba(27,58,45,0.2)" : "none",
              }}>
              {step < 4 ? `Next — ${fmtIn(fullVal)} locked in` : `See Results — ${fmtIn(fullVal)}`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT ───
  if (screen === "result") {
    return <Result m={measurements} onEdit={() => { setStep(0); tr(() => setScreen("measure")); }} />;
  }

  return null;
}
