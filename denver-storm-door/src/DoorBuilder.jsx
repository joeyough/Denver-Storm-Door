import { useState, useRef, useCallback, useEffect } from "react";

/* ━━━ DESIGN TOKENS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const T = {
  bg:"#FAF7F2",warm:"#F3EDE4",cream:"#EDE6DA",
  green:"#1B3A2D",gl:"#2D5E45",gd:"#0F2219",
  auburn:"#C4693A",ab:"#A85530",
  gold:"#C9A961",goldL:"#E0C888",
  dark:"#151413",mid:"#3A3835",muted:"#8A847C",light:"#B5AFA6",
  border:"#E4DDD3",white:"#FEFDFB",
  shadow:"0 4px 24px rgba(15,34,25,.12)",
  shadowLg:"0 12px 48px rgba(15,34,25,.18)",
  shadowGlow:"0 0 40px rgba(201,169,97,.15)",
  r:20,rs:12,
  f:"'DM Sans',sans-serif",fd:"'Playfair Display',serif",
};

/* ━━━ SVG ILLUSTRATIONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DoorSVGs = {
  fullview:(fr="#2A5A44",gl="#B8D8E8",ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="fvW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E8DDD0"/><stop offset="100%" stopColor="#D4C8B8"/></linearGradient><linearGradient id="fvG" x1="90" y1="60" x2="210" y2="340"><stop offset="0%" stopColor={gl} stopOpacity=".6"/><stop offset="40%" stopColor="#EEF6FF" stopOpacity=".35"/><stop offset="100%" stopColor={gl} stopOpacity=".5"/></linearGradient></defs><rect width="300" height="400" fill="url(#fvW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="310" rx="3" fill="url(#fvG)"/><path d="M72 42L160 42L72 200Z" fill="#fff" opacity=".14"/><rect x="148" y="42" width="3" height="310" fill={fr} opacity=".4"/><rect x="204" y="180" width="8" height="50" rx="4" fill={ac}/><circle cx="208" cy="172" r="6" fill={ac}/><ellipse cx="150" cy="386" rx="100" ry="12" fill="rgba(0,0,0,.07)"/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
  screenAway:(fr="#2A5A44",sc="#C8D8C0",ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="saW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E0D8CC"/><stop offset="100%" stopColor="#D0C4B4"/></linearGradient><pattern id="saS" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill={sc} opacity=".3"/><line x1="0" y1="3" x2="6" y2="3" stroke="#888" strokeWidth=".3" opacity=".25"/><line x1="3" y1="0" x2="3" y2="6" stroke="#888" strokeWidth=".3" opacity=".25"/></pattern></defs><rect width="300" height="400" fill="url(#saW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="140" rx="3" fill="#B8D8E8" opacity=".5"/><path d="M72 42L150 42L72 120Z" fill="#fff" opacity=".12"/><rect x="72" y="188" width="156" height="164" rx="3" fill="url(#saS)"/><rect x="68" y="182" width="164" height="8" rx="2" fill={fr}/><path d="M140 195L150 187L160 195" stroke={ac} strokeWidth="2" fill="none"/><path d="M100 225Q125 220 150 225Q175 230 200 225" stroke="#6BC78A" strokeWidth="1" fill="none" opacity=".35"/><path d="M90 255Q130 250 170 255Q200 260 220 255" stroke="#6BC78A" strokeWidth="1" fill="none" opacity=".25"/><rect x="204" y="180" width="8" height="50" rx="4" fill={ac}/><circle cx="208" cy="172" r="6" fill={ac}/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
  security:(fr="#1A1A2E",ms="#888",ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="seW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#D8D0C4"/><stop offset="100%" stopColor="#C8BcAc"/></linearGradient><pattern id="seM" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#E8E4E0"/><line x1="0" y1="4" x2="8" y2="4" stroke={ms} strokeWidth=".4" opacity=".4"/><line x1="4" y1="0" x2="4" y2="8" stroke={ms} strokeWidth=".4" opacity=".4"/></pattern></defs><rect width="300" height="400" fill="url(#seW)"/><rect x="55" y="25" width="190" height="350" rx="3" fill={fr}/><rect x="60" y="30" width="180" height="340" rx="3" fill={fr} stroke={ac} strokeWidth="2"/><rect x="74" y="44" width="152" height="306" rx="2" fill="url(#seM)"/><path d="M150 140L175 155V185C175 200 150 215 150 215S125 200 125 185V155Z" fill={fr} stroke={ac} strokeWidth="2"/><path d="M142 175L148 181L162 165" stroke={ac} strokeWidth="3" fill="none" strokeLinecap="round"/><circle cx="220" cy="100" r="4" fill={ac}/><circle cx="220" cy="200" r="4" fill={ac}/><circle cx="220" cy="300" r="4" fill={ac}/><rect x="200" y="175" width="12" height="55" rx="6" fill={ac}/><rect x="68" y="60" width="8" height="30" rx="3" fill="#555"/><rect x="68" y="180" width="8" height="30" rx="3" fill="#555"/><rect x="68" y="300" width="8" height="30" rx="3" fill="#555"/><rect x="50" y="375" width="200" height="10" rx="2" fill={fr}/></svg>,
  petDoor:(fr="#2A4A3A",ac="#6BC78A")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="pdW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E4DCD0"/><stop offset="100%" stopColor="#D4C8B8"/></linearGradient></defs><rect width="300" height="400" fill="url(#pdW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="180" rx="3" fill="#B8D8E8" opacity=".45"/><path d="M72 42L150 42L72 140Z" fill="#fff" opacity=".1"/><rect x="72" y="228" width="156" height="124" rx="3" fill={fr} opacity=".8"/><rect x="115" y="268" width="70" height="80" rx="6" fill="#D4C8B8" stroke={ac} strokeWidth="2.5"/><rect x="120" y="273" width="60" height="70" rx="4" fill="#E8E2D8"/><g transform="translate(130,290)scale(.5)" fill={ac} opacity=".4"><ellipse cx="8" cy="7" rx="3" ry="4"/><ellipse cx="20" cy="7" rx="3" ry="4"/><ellipse cx="4" cy="16" rx="2.5" ry="3.5"/><ellipse cx="24" cy="16" rx="2.5" ry="3.5"/><path d="M14 28c-4 0-7-3-7.5-6-.4-2 .6-3.5 2.5-4.2 1.2-.4 3-.6 5-.6s3.8.2 5 .6c1.9.7 2.9 2.2 2.5 4.2-.5 3-3.5 6-7.5 6z"/></g><rect x="204" y="150" width="8" height="50" rx="4" fill="#C9A961"/><circle cx="208" cy="142" r="6" fill="#C9A961"/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
  midview:(fr="#4A3520",ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="mvW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E4DCD0"/><stop offset="100%" stopColor="#D4C8B8"/></linearGradient><linearGradient id="mvD" x1="72" y1="220" x2="228" y2="370"><stop offset="0%" stopColor="#8B6914"/><stop offset="30%" stopColor="#A07828"/><stop offset="60%" stopColor="#8B6914"/><stop offset="100%" stopColor="#7A5A10"/></linearGradient></defs><rect width="300" height="400" fill="url(#mvW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="170" rx="3" fill="#B8D8E8" opacity=".5"/><path d="M72 42L160 42L72 150Z" fill="#fff" opacity=".12"/><rect x="72" y="218" width="156" height="134" rx="3" fill="url(#mvD)"/><path d="M80 245Q150 240 220 245" stroke="#6A5010" strokeWidth=".5" opacity=".35"/><path d="M80 270Q140 265 220 270" stroke="#6A5010" strokeWidth=".5" opacity=".3"/><path d="M80 295Q160 290 220 295" stroke="#6A5010" strokeWidth=".5" opacity=".35"/><rect x="68" y="212" width="164" height="8" rx="2" fill={fr}/><rect x="204" y="140" width="8" height="50" rx="4" fill={ac}/><circle cx="208" cy="132" r="6" fill={ac}/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
  screenDoor:(fr="#5A5A3B",ac="#C7C76B")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="sdW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E0D8CC"/><stop offset="100%" stopColor="#D0C4B4"/></linearGradient><pattern id="sdS" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#D8D4D0"/><line x1="0" y1="2" x2="4" y2="2" stroke="#999" strokeWidth=".3"/><line x1="2" y1="0" x2="2" y2="4" stroke="#999" strokeWidth=".3"/></pattern></defs><rect width="300" height="400" fill="url(#sdW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="260" rx="3" fill="url(#sdS)"/><rect x="72" y="308" width="156" height="44" rx="2" fill="#888" opacity=".5"/><path d="M100 100Q130 95 160 100Q190 105 210 100" stroke="#6BA0C7" strokeWidth="1.5" fill="none" opacity=".3"/><path d="M90 155Q130 150 170 155Q200 160 220 155" stroke="#6BA0C7" strokeWidth="1.5" fill="none" opacity=".22"/><rect x="204" y="170" width="8" height="50" rx="4" fill={ac}/><circle cx="208" cy="162" r="6" fill={ac}/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
  guardsman:(ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="gsW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#D4CCC0"/><stop offset="100%" stopColor="#C0B4A4"/></linearGradient></defs><rect width="300" height="400" fill="url(#gsW)"/><rect x="50" y="20" width="200" height="360" rx="2" fill="#1A1A1A"/><rect x="55" y="25" width="190" height="350" rx="2" fill="#222" stroke="#333" strokeWidth="1"/><rect x="70" y="40" width="160" height="300" rx="2" fill="#2A2A2A"/><g stroke={ac} strokeWidth="1.5" fill="none" opacity=".7"><path d="M100 70Q150 40 200 70"/><path d="M110 85Q150 60 190 85"/><line x1="110" y1="85" x2="110" y2="310"/><line x1="150" y1="70" x2="150" y2="310"/><line x1="190" y1="85" x2="190" y2="310"/><line x1="80" y1="130" x2="220" y2="130"/><line x1="80" y1="210" x2="220" y2="210"/><line x1="80" y1="270" x2="220" y2="270"/><circle cx="110" cy="130" r="12"/><circle cx="190" cy="130" r="12"/><circle cx="150" cy="170" r="18"/><path d="M140 160Q150 150 160 160Q170 170 160 180Q150 190 140 180Q130 170 140 160"/></g><rect x="62" y="55" width="12" height="35" rx="4" fill="#444"/><rect x="62" y="175" width="12" height="35" rx="4" fill="#444"/><rect x="62" y="295" width="12" height="35" rx="4" fill="#444"/><rect x="202" y="170" width="14" height="60" rx="7" fill={ac}/><circle cx="209" cy="160" r="8" fill={ac}/><rect x="50" y="375" width="200" height="10" rx="2" fill="#1A1A1A"/></svg>,
  value:(fr="#6A5540",ac="#C9A961")=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><defs><linearGradient id="vlW" x1="0" y1="0" x2="300" y2="400"><stop offset="0%" stopColor="#E4DCD0"/><stop offset="100%" stopColor="#D4C8B8"/></linearGradient></defs><rect width="300" height="400" fill="url(#vlW)"/><rect x="60" y="30" width="180" height="340" rx="4" fill={fr}/><rect x="72" y="42" width="156" height="310" rx="3" fill="#B8D8E8" opacity=".45"/><path d="M72 42L155 42L72 190Z" fill="#fff" opacity=".12"/><circle cx="150" cy="190" r="28" fill={ac} opacity=".12"/><rect x="204" y="190" width="8" height="50" rx="4" fill={ac}/><circle cx="210" cy="168" r="10" fill="#888" stroke="#999" strokeWidth="1"/><rect x="55" y="368" width="190" height="8" rx="2" fill={fr} opacity=".6"/></svg>,
};
const getDoor=(d)=>({
  "456":()=>DoorSVGs.screenAway("#1B3A2D","#C8D8C0","#C9A961"),"459":()=>DoorSVGs.fullview("#5A3A28","#B8D8E8","#D4845A"),
  "449":()=>DoorSVGs.security("#1A1A2E","#888","#7B8CDE"),"450":()=>DoorSVGs.security("#2D2B3D","#AAA","#9B8EC4"),
  "146":()=>DoorSVGs.screenAway("#3A5A1B","#D0E0C0","#A8C76B"),"150":()=>DoorSVGs.fullview("#1B3A3A","#B8E8E8","#6BC7C7"),
  "350":()=>DoorSVGs.value("#6A5540","#C9A961"),"356":()=>DoorSVGs.fullview("#2A3A1B","#C0D8B8","#8AAA5B"),
  "830":()=>DoorSVGs.midview("#3A2A1B","#C9A961"),"370":()=>DoorSVGs.petDoor("#1B2A3A","#6BA0C7"),
  "360-79":()=>DoorSVGs.petDoor("#2A1B3A","#B06BC7"),"360-49":()=>DoorSVGs.petDoor("#1B3A2A","#6BC78A"),
  "360-48":()=>DoorSVGs.screenDoor("#5A5A3B","#C7C76B"),"920-20":()=>DoorSVGs.guardsman("#C9A961"),
  "920-24":()=>DoorSVGs.guardsman("#D4845A"),
}[d.id]||DoorSVGs.fullview)();

const HwSVG=({sw,ac})=><svg viewBox="0 0 300 400" style={{width:"100%",height:"100%"}}><rect width="300" height="400" fill="#F5F0E8"/><rect x="40" y="20" width="30" height="360" fill="#D4C8B8" rx="2"/><rect x="65" y="20" width="8" height="360" fill={sw} opacity=".25"/><rect x="100" y="70" width="80" height="260" rx="40" fill={sw}/><rect x="104" y="74" width="72" height="252" rx="36" fill={sw} opacity=".8"/><ellipse cx="140" cy="120" rx="22" ry="22" fill={sw} stroke={ac} strokeWidth="1"/><rect x="132" y="110" width="16" height="20" rx="3" fill={ac} opacity=".5"/><rect x="120" y="210" width="40" height="14" rx="7" fill={sw}/><rect x="155" y="204" width="70" height="26" rx="13" fill={sw}/><rect x="158" y="207" width="64" height="20" rx="10" fill={ac} opacity=".35"/><circle cx="140" cy="280" r="8" fill="#222" opacity=".25"/><ellipse cx="128" cy="148" rx="14" ry="38" fill="#fff" opacity=".07"/></svg>;

/* ━━━ DATA ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DOORS=[
  {id:"456",label:"Platinum Retractable",sub:"Model 456",cat:"premium",vibe:"The screen vanishes. The light stays.",price:899,feats:["Screen Away","Multi-Point Lock","Hidden Closer"],tag:"Best Seller",bg:"linear-gradient(145deg,#1B3A2D,#2A5A44)",accent:T.gold},
  {id:"459",label:"Platinum Full Glass",sub:"Model 459",cat:"premium",vibe:"Glass or screen. Swap in seconds.",price:849,feats:["Interchangeable","Hidden Closer","Full View"],tag:"Premium",bg:"linear-gradient(145deg,#2C1810,#5A3A28)",accent:T.auburn},
  {id:"449",label:"Platinum Secure Glass",sub:"Model 449",cat:"security",vibe:"They see out. Nobody gets in.",price:949,feats:["Security Shield","Anti-Break-In","Full View"],tag:"Most Secure",bg:"linear-gradient(145deg,#1A1A2E,#2D2D4A)",accent:"#7B8CDE"},
  {id:"450",label:"Platinum Secure Screen",sub:"Model 450",cat:"security",vibe:"Steel mesh. Full breeze. Total control.",price:899,feats:["Steel Mesh","Multi-Point Lock"],tag:"Security",bg:"linear-gradient(145deg,#2D2B3D,#4A4660)",accent:"#9B8EC4"},
  {id:"146",label:"Easy Vent",sub:"Model 146",cat:"standard",vibe:"Retractable screen, pet-door ready.",price:549,feats:["Retractable Screen","Pet Door Option"],tag:"Popular",bg:"linear-gradient(145deg,#3A5A1B,#5A7A3B)",accent:"#A8C76B"},
  {id:"150",label:"Maximum View",sub:"Model 150",cat:"standard",vibe:"The biggest opening. The cleanest close.",price:499,feats:["Largest Window","SureLatch"],tag:"Best View",bg:"linear-gradient(145deg,#1B3A3A,#2A5A5A)",accent:"#6BC7C7"},
  {id:"350",label:"Classic-View",sub:"Model 350",cat:"value",vibe:"Full view, deadbolt included. No-brainer.",price:399,feats:["Interchangeable","Deadbolt"],tag:"Best Value",bg:"linear-gradient(145deg,#4A3520,#6A5540)",accent:T.gold},
  {id:"356",label:"Lifestyle Fullview",sub:"Model 356",cat:"standard",vibe:"Clean lines. Retractable screen. Done.",price:549,feats:["Retractable Screen","Keyed Lock"],tag:null,bg:"linear-gradient(145deg,#2A3A1B,#4A5A3B)",accent:"#8AAA5B"},
  {id:"830",label:"Lifestyle Midview",sub:"Model 830",cat:"standard",vibe:"Solid wood core below. All light above.",price:599,feats:["Solid Wood Core","Midview"],tag:null,bg:"linear-gradient(145deg,#3A2A1B,#5A4A3B)",accent:T.auburn},
  {id:"370",label:"Life-Core",sub:"Model 370",cat:"pet",vibe:"Built-in pet door. Real wood. Multiple configs.",price:549,feats:["Pet Door Options","Wood Core"],tag:"Pet Friendly",bg:"linear-gradient(145deg,#1B2A3A,#3B4A5A)",accent:"#6BA0C7"},
  {id:"360-79",label:"Classic Pet View",sub:"Model 360-79",cat:"pet",vibe:"Dogs up to 100 lbs walk right through.",price:479,feats:["10x17 Pet Door","WearTuff Screen"],tag:"Large Pets",bg:"linear-gradient(145deg,#2A1B3A,#4A3B5A)",accent:"#B06BC7"},
  {id:"360-49",label:"Pet Breeze",sub:"Model 360-49",cat:"pet",vibe:"Puncture-proof screen. Pet-proof entry.",price:449,feats:["PetScreen","Puncture Resistant"],tag:null,bg:"linear-gradient(145deg,#1B3A2A,#3B5A4A)",accent:"#6BC78A"},
  {id:"360-48",label:"WearTuff Screen",sub:"Model 360-48",cat:"screen",vibe:"Tear-proof mesh. Steel kick plate. Tough.",price:349,feats:["Tear-Resistant","Steel Kick"],tag:null,bg:"linear-gradient(145deg,#3A3A1B,#5A5A3B)",accent:"#C7C76B"},
  {id:"920-20",label:"Courtyard",sub:"Model 920-20 · Guardsman",cat:"security",vibe:"Welded steel. Vault pins. Nobody's coming in.",price:1199,feats:["Welded Steel","Vault Pin Hinges"],tag:"Security Door",bg:"linear-gradient(145deg,#0D0D0D,#2A2A2A)",accent:"#C9A961"},
  {id:"920-24",label:"Geneva",sub:"Model 920-24 · Guardsman",cat:"security",vibe:"Iron scrollwork. Fort Knox energy.",price:1299,feats:["Decorative Iron","Vault Pin"],tag:null,bg:"linear-gradient(145deg,#1A1A1A,#3A3A3A)",accent:"#D4845A"},
];
const HW=[
  {id:"hw-mb",label:"Matte Black",vibe:"Modern. Clean. Done.",sw:"#1A1A1A",ac:"#555"},
  {id:"hw-bb",label:"Bright Brass",vibe:"Classic. Warm. Timeless.",sw:"#C5A044",ac:"#E8D088"},
  {id:"hw-ab",label:"Antique Brass",vibe:"Aged warmth. Character.",sw:"#7A6530",ac:"#A08848"},
  {id:"hw-bn",label:"Brushed Nickel",vibe:"Soft silver. Contemporary.",sw:"#A8A8A0",ac:"#CCC"},
  {id:"hw-az",label:"Aged Bronze",vibe:"Deep. Rich. Sophisticated.",sw:"#5A3E28",ac:"#8A6848"},
];
const UPG=[
  {id:"u-sl",label:"SureLatch",desc:"Magnetic close. No slamming. Ever.",price:0},
  {id:"u-le",label:"Low-E Glass",desc:"Blocks UV. Saves energy. Cuts glare.",price:89},
  {id:"u-ne",label:"Neat+ Low-E",desc:"Self-cleaning glass. Seriously.",price:129},
  {id:"u-pd",label:"Pet Door Insert",desc:"Retrofit pet access to your door.",price:149},
  {id:"u-bv",label:"BetterVue Screen",desc:"Water-wicking. Crystal clear view.",price:49},
  {id:"u-ps",label:"PetScreen",desc:"Tear-proof. Claw-proof. Pet-proof.",price:69},
];
const HOMES=[{id:"colonial",l:"Colonial",e:"🏛️"},{id:"ranch",l:"Ranch",e:"🏡"},{id:"modern",l:"Modern",e:"🏢"},{id:"craftsman",l:"Craftsman",e:"🏘️"},{id:"victorian",l:"Victorian",e:"🏰"},{id:"other",l:"Other",e:"🏠"}];
const GOALS=[{id:"light",l:"More Light",d:"Flood your entry with daylight",c:"#E8B84A"},{id:"security",l:"More Security",d:"See everything. Let nobody in.",c:"#5A7ADE"},{id:"pet",l:"Pet Freedom",d:"In and out, on their terms",c:"#6BC78A"},{id:"air",l:"Fresh Air",d:"Breeze in. Bugs out.",c:"#6BA0C7"}];
const STEPS=["hero","home","goals","swipeDoors","pickDoor","swipeHw","pickHw","upgrades","review","price","schedule","done"];

/* ━━━ ICONS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Ic={
  check:(s=20,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  x:(s=20,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  heart:(s=20,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>,
  cam:(s=24,c=T.muted)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  back:(s=22,c=T.green)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  phone:(s=18,c="#fff")=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg>,
  arrow:(s=20,c=T.green)=><svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
};

/* ━━━ TOAST ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const Toast=({msg,vis})=><div style={{position:"fixed",top:16,left:"50%",transform:`translateX(-50%) translateY(${vis?0:-100}px)`,background:T.gd,color:T.goldL,padding:"10px 24px",borderRadius:40,fontFamily:T.f,fontSize:14,fontWeight:600,zIndex:9999,transition:"transform .35s cubic-bezier(.34,1.56,.64,1)",boxShadow:"0 8px 32px rgba(0,0,0,.3)",pointerEvents:"none",whiteSpace:"nowrap",border:`1px solid ${T.gold}33`,backdropFilter:"blur(12px)"}}>{msg}</div>;

/* ━━━ SWIPE DECK ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function SwipeDeck({items,onRight,onLeft,renderCard,onDone,favCount}) {
  const [idx,setIdx]=useState(0);
  const [drag,setDrag]=useState({x:0,on:false,sx:0,vx:0,lx:0,t:0});
  const [leave,setLeave]=useState(null);
  const [pop,setPop]=useState(false);
  const [entering,setEntering]=useState(false);
  const cur=items[idx],nxt=items[idx+1];

  const buzz=(ms=8)=>{try{navigator.vibrate&&navigator.vibrate(ms);}catch(e){}};

  const go=(kept)=>{
    if(kept){setPop(true);buzz(12);setTimeout(()=>setPop(false),400);}
    setEntering(true);
    setTimeout(()=>{
      setLeave(null);setDrag({x:0,on:false,sx:0,vx:0,lx:0,t:0});
      if(idx+1>=items.length)onDone();else setIdx(i=>i+1);
      setTimeout(()=>setEntering(false),50);
    },kept?180:150);
  };

  const hs=e=>{const t=e.touches?e.touches[0]:e;setDrag({x:0,on:true,sx:t.clientX,vx:0,lx:0,t:Date.now()});};
  const hm=e=>{if(!drag.on)return;const t=e.touches?e.touches[0]:e;const nx=t.clientX-drag.sx;const now=Date.now();const dt=Math.max(now-drag.t,1);const vx=(nx-drag.lx)/dt;setDrag(d=>({...d,x:nx,vx,lx:nx,t:now}));
    // threshold haptic tick
    if(Math.abs(nx)>65&&Math.abs(drag.x)<=65)buzz(6);
  };
  const he=()=>{if(!drag.on)return;
    const spd=Math.abs(drag.vx);const committed=Math.abs(drag.x)>65||(spd>.6&&Math.abs(drag.x)>30);
    if(committed&&drag.x>0){setLeave("r");buzz(15);onRight(cur);go(true);}
    else if(committed&&drag.x<0){setLeave("l");buzz(6);onLeft(cur);go(false);}
    else{setDrag(d=>({...d,x:0,on:false}));buzz(4);}
  };
  const doSwipe=(dir)=>{setLeave(dir);buzz(dir==="r"?15:6);if(dir==="r")onRight(cur);else onLeft(cur);go(dir==="r");};

  if(!cur)return null;
  const lx=leave==="r"?700:leave==="l"?-700:0;
  const pct=Math.min(Math.abs(drag.x)/90,1);
  const isR=drag.x>0;
  // spring: cubic-bezier with overshoot for bounce-back
  const springBack="transform .45s cubic-bezier(.175,.885,.32,1.275),opacity .3s";
  const flyOut="transform .22s cubic-bezier(.4,0,1,1),opacity .18s";

  return(
    <div style={{position:"relative",height:480,touchAction:"pan-y"}}>
      {/* NEXT CARD - scales up as you drag, pops on arrival */}
      {nxt&&<div style={{
        position:"absolute",inset:0,padding:"0 12px",zIndex:0,
        transform:`scale(${entering?1:.9+pct*.06})`,
        opacity:entering?1:.25+pct*.35,
        transition:drag.on?"transform .05s linear":"transform .35s cubic-bezier(.34,1.56,.64,1),opacity .3s",
      }}>{renderCard(nxt,true)}</div>}

      {/* CURRENT CARD */}
      <div onTouchStart={hs} onTouchMove={hm} onTouchEnd={he}
        onMouseDown={hs} onMouseMove={hm} onMouseUp={he} onMouseLeave={()=>drag.on&&he()}
        style={{
          position:"absolute",inset:0,padding:"0 12px",zIndex:1,cursor:"grab",
          transform:leave
            ?`translateX(${lx}px) rotate(${lx*.04}deg) scale(.9)`
            :`translateX(${drag.x}px) rotate(${drag.x*.06}deg) scale(${1-pct*.02})`,
          opacity:leave?0:1,
          transition:leave?flyOut:drag.on?"none":springBack,
        }}>
        {renderCard(cur,false)}
        {/* KEEP glow */}
        {drag.x>20&&<div style={{position:"absolute",inset:0,borderRadius:T.r,
          border:`${3+pct*3}px solid rgba(42,140,74,${pct*.8})`,
          boxShadow:`inset 0 0 ${pct*40}px rgba(42,140,74,${pct*.12}), 0 0 ${pct*30}px rgba(42,140,74,${pct*.15})`,
          pointerEvents:"none",zIndex:5,transition:"all .08s"}}>
          <div style={{position:"absolute",top:24,left:24,
            background:`rgba(42,140,74,${.6+pct*.4})`,color:"#fff",
            padding:"8px 22px",borderRadius:10,fontFamily:T.fd,fontWeight:700,fontSize:22,
            transform:`rotate(-12deg) scale(${.7+pct*.3})`,letterSpacing:1.5,
            boxShadow:`0 4px 24px rgba(42,140,74,${pct*.5})`,
            opacity:Math.min(pct*1.5,1),
          }}>KEEP</div>
        </div>}
        {/* NOPE glow */}
        {drag.x<-20&&<div style={{position:"absolute",inset:0,borderRadius:T.r,
          border:`${3+pct*3}px solid rgba(180,60,60,${pct*.8})`,
          boxShadow:`inset 0 0 ${pct*30}px rgba(180,60,60,${pct*.08})`,
          pointerEvents:"none",zIndex:5}}>
          <div style={{position:"absolute",top:24,right:24,
            background:`rgba(180,60,60,${.6+pct*.4})`,color:"#fff",
            padding:"8px 22px",borderRadius:10,fontFamily:T.fd,fontWeight:700,fontSize:22,
            transform:`rotate(12deg) scale(${.7+pct*.3})`,letterSpacing:1.5,
            opacity:Math.min(pct*1.5,1),
          }}>NOPE</div>
        </div>}
      </div>

      {/* Counter + Dots */}
      <div style={{position:"absolute",bottom:6,left:0,right:0,display:"flex",justifyContent:"center",alignItems:"center",gap:8,zIndex:3}}>
        <div style={{display:"flex",gap:2}}>{items.map((_,i)=><div key={i} style={{width:i===idx?18:5,height:5,borderRadius:3,background:i<idx?T.green:i===idx?T.auburn:`${T.muted}44`,transition:"all .25s"}}/>)}</div>
        {favCount>0&&<div style={{
          background:T.green,color:"#fff",padding:"2px 12px",borderRadius:20,
          fontFamily:T.f,fontSize:11,fontWeight:700,boxShadow:T.shadowGlow,
          transform:pop?"scale(1.3)":"scale(1)",
          transition:"transform .3s cubic-bezier(.34,1.56,.64,1)",
        }}>{favCount} kept</div>}
      </div>

      {/* Tap targets */}
      <div style={{position:"absolute",bottom:22,left:12,right:12,display:"flex",justifyContent:"space-between",zIndex:4,pointerEvents:"none"}}>
        <div onClick={()=>doSwipe("l")} style={{background:"rgba(180,60,60,.85)",width:52,height:52,borderRadius:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(180,60,60,.3)",pointerEvents:"auto",cursor:"pointer",backdropFilter:"blur(8px)"}}>{Ic.x(26,"#fff")}</div>
        <div onClick={()=>doSwipe("r")} style={{background:"rgba(42,140,74,.85)",width:52,height:52,borderRadius:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(42,140,74,.3)",pointerEvents:"auto",cursor:"pointer",backdropFilter:"blur(8px)"}}>{Ic.heart(26,"#fff")}</div>
      </div>
    </div>
  );
}

/* ━━━ DOOR CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const DoorCard=({door:d,preview:p})=>(
  <div style={{background:T.white,borderRadius:T.r,overflow:"hidden",boxShadow:p?"none":T.shadowLg,height:460,display:"flex",flexDirection:"column",border:p?"none":`1px solid ${T.border}`}}>
    <div style={{position:"relative",height:270,flexShrink:0}}>
      <div style={{position:"absolute",inset:0}}>{getDoor(d)}</div>
      {d.tag&&<div style={{position:"absolute",top:14,right:14,background:d.accent||T.gold,color:"#fff",padding:"5px 14px",borderRadius:20,fontFamily:T.f,fontSize:11,fontWeight:700,letterSpacing:.5,zIndex:1,boxShadow:"0 2px 12px rgba(0,0,0,.2)"}}>{d.tag}</div>}
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:80,background:"linear-gradient(transparent,rgba(0,0,0,.45))",zIndex:1}}/>
      <div style={{position:"absolute",bottom:14,left:16,right:16,zIndex:2,display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
        <div style={{color:"#fff",fontFamily:T.f,fontSize:12,opacity:.85}}>{d.sub}</div>
        <div style={{fontFamily:T.fd,fontSize:26,fontWeight:700,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,.4)"}}>${d.price}</div>
      </div>
    </div>
    <div style={{padding:"16px 18px",flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
      <div>
        <div style={{fontFamily:T.fd,fontSize:22,fontWeight:700,color:T.dark,lineHeight:1.15}}>{d.label}</div>
        <div style={{fontFamily:T.f,fontSize:13,color:T.muted,marginTop:6,lineHeight:1.5,fontStyle:"italic"}}>{d.vibe}</div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
        {(d.feats||[]).map((f,i)=><span key={i} style={{background:T.warm,color:T.green,padding:"4px 10px",borderRadius:20,fontFamily:T.f,fontSize:10,fontWeight:700,letterSpacing:.3}}>{f}</span>)}
      </div>
    </div>
  </div>
);

/* ━━━ HW CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const HwCardComp=({hw:h,preview:p})=>(
  <div style={{background:T.white,borderRadius:T.r,overflow:"hidden",boxShadow:p?"none":T.shadowLg,height:460,display:"flex",flexDirection:"column",border:p?"none":`1px solid ${T.border}`}}>
    <div style={{height:280,flexShrink:0}}><HwSVG sw={h.sw} ac={h.ac}/></div>
    <div style={{padding:"20px 18px",flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"}}>
      <div style={{width:44,height:44,borderRadius:22,background:h.sw,boxShadow:`0 6px 20px rgba(0,0,0,.3), inset 0 2px 6px rgba(255,255,255,.15)`,border:`2px solid ${h.ac}`,marginBottom:14}}/>
      <div style={{fontFamily:T.fd,fontSize:24,fontWeight:700,color:T.dark}}>{h.label}</div>
      <div style={{fontFamily:T.f,fontSize:14,color:T.muted,marginTop:6,fontStyle:"italic"}}>{h.vibe}</div>
    </div>
  </div>
);

/* ━━━ HOLD BAR ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function HoldBar({onConfirm}) {
  const [p,setP]=useState(0);const iv=useRef(null);const cf=useRef(false);
  const start=()=>{cf.current=false;iv.current=setInterval(()=>{setP(v=>{if(v>=100){clearInterval(iv.current);if(!cf.current){cf.current=true;setTimeout(onConfirm,80);}return 100;}return v+1.8;});},25);};
  const end=()=>{clearInterval(iv.current);if(!cf.current)setP(0);};
  return <div onTouchStart={start} onTouchEnd={end} onTouchCancel={end} onMouseDown={start} onMouseUp={end} onMouseLeave={end}
    style={{position:"relative",height:60,borderRadius:30,overflow:"hidden",background:T.gd,cursor:"pointer",userSelect:"none",WebkitUserSelect:"none",boxShadow:p>0?`0 0 ${p*.4}px rgba(201,169,97,${p*.005})`:T.shadow}}>
    <div style={{position:"absolute",top:0,left:0,bottom:0,width:`${p}%`,background:`linear-gradient(90deg,${T.green},${T.gl},${T.gold})`,transition:p===0?"width .4s cubic-bezier(.4,0,.2,1)":"none",borderRadius:28}}/>
    <div style={{position:"relative",zIndex:1,height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.f,fontSize:15,fontWeight:700,color:p>30?T.gd:T.goldL,transition:"color .3s",letterSpacing:.5}}>
      {p>0&&p<100?<span style={{fontFamily:T.fd,fontSize:18}}>{Math.round(p)}%</span>:p>=100?<span style={{display:"flex",alignItems:"center",gap:8}}>Locked in {Ic.check(18,T.gd)}</span>:<span>Hold to lock in · $49 deposit</span>}
    </div>
  </div>;
}

/* ━━━ MAIN ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function App(){
  const [step,setStep]=useState("hero");
  const [s,setS]=useState({home:null,goal:null,df:[],door:null,hf:[],hw:null,up:[],photo:null,slot:null,measure:null});
  const [toast,setToast]=useState({m:"",v:false});
  const fr=useRef(null);
  const [heroLit,setHeroLit]=useState(false);

  useEffect(()=>{if(step==="hero")setTimeout(()=>setHeroLit(true),600);},[step]);

  const flash=m=>{setToast({m,v:true});setTimeout(()=>setToast(t=>({...t,v:false})),2200);};
  const goTo=useCallback(st=>{setStep(st);window.scrollTo({top:0,behavior:"smooth"});},[]);
  const next=()=>{const i=STEPS.indexOf(step);if(i<STEPS.length-1)goTo(STEPS[i+1]);};
  const u=p=>setS(x=>({...x,...p}));
  const handlePhoto=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{u({photo:ev.target.result});flash("Got it. Looking good.");};r.readAsDataURL(f);};

  const selD=DOORS.find(d=>d.id===s.door),selH=HW.find(h=>h.id===s.hw);
  const upCost=s.up.reduce((a,uid)=>a+(UPG.find(x=>x.id===uid)?.price||0),0);
  const inst=299,dP=selD?.price||0,tot=dP+inst+upCost;
  const dates=[];const now=new Date();for(let i=3;i<17;i++){const d=new Date(now);d.setDate(d.getDate()+i);if(d.getDay()!==0)dates.push(d);}
  const prog=STEPS.indexOf(step)/(STEPS.length-1);

  const render=()=>{switch(step){

    /* ═══════ HERO ═══════ */
    case "hero": return(
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",background:T.gd,position:"relative",overflow:"hidden"}}>
        {/* Animated scene */}
        <div style={{position:"relative",height:420,overflow:"hidden"}}>
          <svg viewBox="0 0 430 420" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>
            <defs>
              <linearGradient id="hFloor" x1="0" y1="350" x2="0" y2="420"><stop offset="0%" stopColor="#2A2218"/><stop offset="100%" stopColor="#1A1610"/></linearGradient>
              <linearGradient id="hWall" x1="0" y1="0" x2="0" y2="350"><stop offset="0%" stopColor="#3A3428"/><stop offset="100%" stopColor="#2A2418"/></linearGradient>
              <linearGradient id="hGlow" x1="215" y1="80" x2="215" y2="380"><stop offset="0%" stopColor="#FFF8E0" stopOpacity={heroLit?.6:0}/><stop offset="100%" stopColor="#FFF8E0" stopOpacity="0"/></linearGradient>
              <radialGradient id="hRad" cx="215" cy="200" r="200"><stop offset="0%" stopColor="#FFF8E0" stopOpacity={heroLit?.25:0}/><stop offset="100%" stopColor="#FFF8E0" stopOpacity="0"/></radialGradient>
            </defs>
            {/* Room */}
            <rect width="430" height="350" fill="url(#hWall)"/>
            <rect y="350" width="430" height="70" fill="url(#hFloor)"/>
            {/* Back wall texture */}
            <line x1="0" y1="80" x2="430" y2="80" stroke="#4A4438" strokeWidth=".5" opacity=".3"/>
            <line x1="0" y1="160" x2="430" y2="160" stroke="#4A4438" strokeWidth=".5" opacity=".2"/>
            {/* Door frame */}
            <rect x="155" y="60" width="120" height="290" rx="3" fill="#1A1610" stroke="#4A4030" strokeWidth="2"/>
            {/* Door - glass panel (the magic) */}
            <rect x="163" y="68" width="104" height="274" rx="2" fill={heroLit?"#8CBDD8":"#2A2820"} opacity={heroLit?.55:.8} style={{transition:"all 1.2s cubic-bezier(.4,0,.2,1)"}}/>
            {/* Glass reflection */}
            <path d="M163 68L220 68L163 180Z" fill="#fff" opacity={heroLit?.15:.02} style={{transition:"opacity 1s"}}/>
            {/* Light pouring through door */}
            <path d={`M175 340L100 420L330 420L255 340Z`} fill="url(#hGlow)" style={{transition:"all 1.2s"}}/>
            <rect x="155" y="60" width="120" height="290" fill="url(#hRad)" style={{transition:"all 1.2s"}}/>
            {/* Handle */}
            <rect x="249" y="195" width="5" height="30" rx="2.5" fill={heroLit?"#C9A961":"#5A5040"} style={{transition:"fill 1s"}}/>
            {/* Outside visible through glass */}
            {heroLit&&<><rect x="170" y="80" width="90" height="20" rx="2" fill="#87CEEB" opacity=".15"/><ellipse cx="195" cy="260" rx="15" ry="12" fill="#4A7A3A" opacity=".12"/><ellipse cx="230" cy="265" rx="12" ry="10" fill="#3A6A2A" opacity=".1"/></>}
            {/* Warm glow on walls */}
            {heroLit&&<><rect x="100" y="200" width="55" height="80" rx="2" fill="#FFF8E0" opacity=".03"/><rect x="275" y="180" width="60" height="100" rx="2" fill="#FFF8E0" opacity=".025"/></>}
            {/* Side table silhouette */}
            <rect x="40" y="280" width="60" height="70" rx="3" fill="#252018" opacity=".6"/>
            <rect x="35" y="275" width="70" height="8" rx="3" fill="#302A20" opacity=".6"/>
            {/* Plant */}
            <ellipse cx="70" cy="268" rx="14" ry="18" fill="#3A5A2A" opacity={heroLit?.25:.1} style={{transition:"opacity 1s"}}/>
            {/* Frame on wall */}
            <rect x="310" y="120" width="50" height="65" rx="2" fill="none" stroke="#4A4030" strokeWidth="1.5" opacity=".3"/>
          </svg>
          {/* Top bar */}
          <div style={{position:"absolute",top:14,left:16,right:16,display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:2}}>
            <div style={{fontFamily:T.fd,fontSize:16,fontWeight:700,color:T.goldL,opacity:.8,letterSpacing:.5}}>Denver Storm Door</div>
            <a href="tel:7205341220" style={{display:"flex",alignItems:"center",gap:5,color:T.goldL,textDecoration:"none",fontFamily:T.f,fontSize:11,fontWeight:600,opacity:.6}}>{Ic.phone(13,T.goldL)} (720) 534-1220</a>
          </div>
        </div>
        {/* Content */}
        <div style={{padding:"0 24px 32px",flex:1,display:"flex",flexDirection:"column",justifyContent:"flex-end",gap:16,position:"relative",zIndex:2,marginTop:-60}}>
          <h1 style={{fontFamily:T.fd,fontSize:38,fontWeight:700,color:T.white,margin:0,lineHeight:1.1,opacity:heroLit?1:.3,transition:"opacity 1s .4s",letterSpacing:-.5}}>
            Let the<br/>light in.
          </h1>
          <p style={{fontFamily:T.f,fontSize:15,color:T.light,lineHeight:1.6,margin:0,maxWidth:300,opacity:heroLit?1:0,transition:"opacity .8s .8s"}}>
            More light. More air. More control.<br/>Your front door, upgraded.
          </p>
          <button onClick={next} style={{
            background:`linear-gradient(135deg,${T.gold},${T.auburn})`,color:T.white,border:"none",
            borderRadius:30,padding:"18px 32px",fontFamily:T.f,fontSize:17,fontWeight:700,
            cursor:"pointer",boxShadow:"0 6px 28px rgba(201,169,97,.35)",
            letterSpacing:.5,marginTop:8,
            opacity:heroLit?1:0,transition:"opacity .6s 1.2s",
            display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            Start swiping {Ic.arrow(18,"#fff")}
          </button>
          <div style={{fontFamily:T.f,fontSize:11,color:T.muted,textAlign:"center",opacity:heroLit?.5:0,transition:"opacity .6s 1.4s"}}>
            2 minutes · zero commitment
          </div>
        </div>
      </div>
    );

    /* ═══════ HOME STYLE ═══════ */
    case "home": return(
      <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Your home</div>
        <h2 style={{fontFamily:T.fd,fontSize:28,color:T.dark,margin:"4px 0 16px",lineHeight:1.1}}>What does it look like?</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {HOMES.map(h=><button key={h.id} onClick={()=>{u({home:h.id});flash(h.l);setTimeout(next,350);}}
            style={{background:s.home===h.id?T.green:T.white,color:s.home===h.id?"#fff":T.dark,
              border:`2px solid ${s.home===h.id?T.green:T.border}`,borderRadius:T.rs,padding:"20px 6px",
              cursor:"pointer",fontFamily:T.f,fontSize:12,fontWeight:600,
              display:"flex",flexDirection:"column",alignItems:"center",gap:6,transition:"all .2s"}}>
            <span style={{fontSize:28}}>{h.e}</span>{h.l}
          </button>)}
        </div>
        {/* Photo */}
        <div style={{marginTop:20,position:"relative"}}>
          <input ref={fr} type="file" accept="image/*" capture="environment" onChange={handlePhoto} style={{display:"none"}}/>
          {s.photo?(
            <div style={{display:"flex",alignItems:"center",gap:14,background:T.warm,borderRadius:T.rs,padding:14}}>
              <img src={s.photo} alt="" style={{width:64,height:64,objectFit:"cover",borderRadius:10,border:`2px solid ${T.green}`}}/>
              <div><div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:T.dark}}>Your entry</div><div style={{fontFamily:T.f,fontSize:12,color:T.green,fontWeight:600}}>Saved ✓</div></div>
            </div>
          ):(
            <button onClick={()=>fr.current?.click()} style={{width:"100%",background:T.warm,border:`2px dashed ${T.border}`,borderRadius:T.rs,padding:"20px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14}}>
              {Ic.cam(28,T.mid)}
              <div style={{textAlign:"left"}}><div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:T.dark}}>Snap your front door</div><div style={{fontFamily:T.f,fontSize:12,color:T.muted,marginTop:2}}>See how it transforms</div></div>
            </button>
          )}
        </div>
      </div>
    );

    /* ═══════ GOALS ═══════ */
    case "goals": return(
      <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>The goal</div>
        <h2 style={{fontFamily:T.fd,fontSize:28,color:T.dark,margin:"4px 0 16px",lineHeight:1.1}}>What do you crave?</h2>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {GOALS.map(g=>{const on=s.goal===g.id;return(
            <button key={g.id} onClick={()=>{u({goal:g.id});flash(g.l);setTimeout(next,350);}}
              style={{background:on?T.gd:T.white,border:`2px solid ${on?T.gd:T.border}`,borderRadius:T.r,padding:"20px 18px",cursor:"pointer",fontFamily:T.f,textAlign:"left",display:"flex",alignItems:"center",gap:14,transition:"all .25s",boxShadow:on?T.shadowLg:"none"}}>
              <div style={{width:50,height:50,borderRadius:25,background:on?`${g.c}33`:`${g.c}15`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:24,transition:"all .25s"}}>
                {g.id==="light"?"☀️":g.id==="security"?"🛡️":g.id==="pet"?"🐾":"🌬️"}
              </div>
              <div><div style={{fontSize:17,fontWeight:700,color:on?T.white:T.dark}}>{g.l}</div><div style={{fontSize:13,color:on?T.light:T.muted,marginTop:3}}>{g.d}</div></div>
            </button>
          );})}
        </div>
      </div>
    );

    /* ═══════ SWIPE DOORS ═══════ */
    case "swipeDoors":{
      const gm={light:["premium","standard"],security:["security"],pet:["pet"],air:["standard","screen"]};
      const rc=gm[s.goal]||[];
      // Show goal-relevant doors first, cap at 8 to avoid fatigue
      const sorted=[...DOORS].sort((a,b)=>(rc.includes(a.cat)?0:1)-(rc.includes(b.cat)?0:1)).slice(0,8);
      const keptDoors=DOORS.filter(d=>s.df.includes(d.id));
      return <div style={{paddingTop:8}}>
        <div style={{padding:"0 20px 8px"}}>
          <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Swipe what hits</div>
          <h2 style={{fontFamily:T.fd,fontSize:24,color:T.dark,margin:"4px 0 0"}}>Right to keep. Left to skip.</h2>
        </div>
        <SwipeDeck items={sorted} favCount={s.df.length}
          onRight={d=>{u({df:[...s.df.filter(f=>f!==d.id),d.id]});flash(`Kept ${d.label}`);}}
          onLeft={()=>{}}
          onDone={()=>{if(!s.df.length){flash("Swipe right on ones you like");return;}goTo("pickDoor");}}
          renderCard={(d,p)=><DoorCard door={d} preview={p}/>}/>
        {/* Collection tray + Done button */}
        {keptDoors.length>0&&<div style={{padding:"12px 20px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{display:"flex",gap:-4}}>
              {keptDoors.slice(0,5).map((d,i)=><div key={d.id} style={{
                width:40,height:40,borderRadius:10,overflow:"hidden",border:`2px solid ${T.white}`,
                marginLeft:i>0?-8:0,boxShadow:T.shadow,position:"relative",zIndex:5-i,
                animation:"popIn .3s cubic-bezier(.34,1.56,.64,1)",
              }}>{getDoor(d)}</div>)}
              {keptDoors.length>5&&<div style={{width:40,height:40,borderRadius:10,background:T.gd,
                display:"flex",alignItems:"center",justifyContent:"center",marginLeft:-8,
                fontFamily:T.f,fontSize:12,fontWeight:700,color:T.goldL,border:`2px solid ${T.white}`,zIndex:0,
              }}>+{keptDoors.length-5}</div>}
            </div>
            <div style={{fontFamily:T.f,fontSize:13,color:T.mid,fontWeight:600}}>{keptDoors.length} door{keptDoors.length>1?"s":""} saved</div>
          </div>
          <button onClick={()=>goTo("pickDoor")} style={{
            background:T.gd,color:T.goldL,border:"none",borderRadius:30,padding:"14px 24px",
            width:"100%",fontFamily:T.f,fontSize:15,fontWeight:700,cursor:"pointer",
            boxShadow:T.shadowLg,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
          }}>
            Done — see my picks {Ic.arrow(18,T.goldL)}
          </button>
        </div>}
      </div>;
    }

    /* ═══════ PICK DOOR ═══════ */
    case "pickDoor":{
      const favs=DOORS.filter(d=>s.df.includes(d.id));
      if(!favs.length)return <div style={{padding:24,textAlign:"center"}}><h2 style={{fontFamily:T.fd,color:T.dark}}>Nothing saved yet</h2><button onClick={()=>goTo("swipeDoors")} style={{background:T.green,color:"#fff",border:"none",borderRadius:28,padding:"14px 28px",fontFamily:T.f,fontWeight:700,cursor:"pointer",marginTop:16}}>← Go back</button></div>;
      return <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Your keepers</div>
        <h2 style={{fontFamily:T.fd,fontSize:24,color:T.dark,margin:"4px 0 16px"}}>Lock in the one.</h2>
        {s.photo&&<div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}><img src={s.photo} alt="" style={{width:40,height:40,borderRadius:8,objectFit:"cover",border:`2px solid ${T.green}`}}/><span style={{fontFamily:T.f,fontSize:12,color:T.muted,fontStyle:"italic"}}>Your entry</span></div>}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {favs.map(d=>{const on=s.door===d.id;return(
            <button key={d.id} onClick={()=>{u({door:d.id});flash(`${d.label}. Yours.`);setTimeout(()=>goTo("swipeHw"),500);}}
              style={{background:on?T.gd:T.white,border:on?"none":`1px solid ${T.border}`,borderRadius:T.r,padding:0,cursor:"pointer",overflow:"hidden",display:"flex",textAlign:"left",transition:"all .25s",boxShadow:on?T.shadowLg:"none"}}>
              <div style={{width:88,height:88,flexShrink:0}}>{getDoor(d)}</div>
              <div style={{padding:"10px 14px",flex:1,display:"flex",alignItems:"center"}}>
                <div style={{flex:1}}><div style={{fontFamily:T.fd,fontSize:17,fontWeight:700,color:on?T.white:T.dark}}>{d.label}</div><div style={{fontFamily:T.f,fontSize:11,color:on?T.light:T.muted,marginTop:2}}>{d.sub}</div></div>
                <div style={{fontFamily:T.fd,fontSize:20,fontWeight:700,color:on?T.goldL:T.green}}>${d.price}</div>
              </div>
            </button>
          );})}
        </div>
        <button onClick={()=>goTo("swipeDoors")} style={{background:"none",border:"none",color:T.auburn,fontFamily:T.f,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:14,padding:"8px 0"}}>← See more doors</button>
      </div>;
    }

    /* ═══════ SWIPE HARDWARE ═══════ */
    case "swipeHw":{
      const keptHw=HW.filter(h=>s.hf.includes(h.id));
      return <div style={{paddingTop:8}}>
      <div style={{padding:"0 20px 8px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>The finish</div>
        <h2 style={{fontFamily:T.fd,fontSize:24,color:T.dark,margin:"4px 0 0"}}>Pick the feel.</h2>
      </div>
      <SwipeDeck items={HW} favCount={s.hf.length}
        onRight={h=>{u({hf:[...s.hf.filter(f=>f!==h.id),h.id]});flash(`Kept ${h.label}`);}}
        onLeft={()=>{}}
        onDone={()=>{if(!s.hf.length){flash("Keep at least one");return;}goTo("pickHw");}}
        renderCard={(h,p)=><HwCardComp hw={h} preview={p}/>}/>
      {keptHw.length>0&&<div style={{padding:"12px 20px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <div style={{display:"flex",gap:4}}>
            {keptHw.map(h=><div key={h.id} style={{width:32,height:32,borderRadius:16,background:h.sw,border:`2px solid ${T.white}`,boxShadow:T.shadow,animation:"popIn .3s cubic-bezier(.34,1.56,.64,1)"}}/>)}
          </div>
          <div style={{fontFamily:T.f,fontSize:13,color:T.mid,fontWeight:600}}>{keptHw.length} finish{keptHw.length>1?"es":""} saved</div>
        </div>
        <button onClick={()=>goTo("pickHw")} style={{
          background:T.gd,color:T.goldL,border:"none",borderRadius:30,padding:"14px 24px",
          width:"100%",fontFamily:T.f,fontSize:15,fontWeight:700,cursor:"pointer",
          boxShadow:T.shadowLg,display:"flex",alignItems:"center",justifyContent:"center",gap:8,
        }}>
          Done — pick my finish {Ic.arrow(18,T.goldL)}
        </button>
      </div>}
    </div>;}


    /* ═══════ PICK HARDWARE ═══════ */
    case "pickHw":{
      const fh=HW.filter(h=>s.hf.includes(h.id));
      return <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Hardware</div>
        <h2 style={{fontFamily:T.fd,fontSize:24,color:T.dark,margin:"4px 0 16px"}}>Which one feels right?</h2>
        <div style={{display:"grid",gridTemplateColumns:fh.length>2?"1fr 1fr":"1fr",gap:10}}>
          {fh.map(h=>{const on=s.hw===h.id;return(
            <button key={h.id} onClick={()=>{u({hw:h.id});flash(`${h.label}. Perfect.`);setTimeout(()=>goTo("upgrades"),450);}}
              style={{background:on?T.gd:T.white,border:on?"none":`1px solid ${T.border}`,borderRadius:T.r,padding:18,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:10,transition:"all .25s",boxShadow:on?T.shadowLg:"none"}}>
              <div style={{width:60,height:60,borderRadius:30,background:h.sw,boxShadow:`0 6px 20px rgba(0,0,0,.25)`,border:on?`3px solid ${T.goldL}`:`2px solid ${h.ac}`}}/>
              <div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:on?T.white:T.dark}}>{h.label}</div>
              {on&&<div style={{fontFamily:T.f,fontSize:11,color:T.goldL,fontWeight:600}}>Selected</div>}
            </button>
          );})}
        </div>
        <button onClick={()=>goTo("swipeHw")} style={{background:"none",border:"none",color:T.auburn,fontFamily:T.f,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:14,padding:"8px 0"}}>← More finishes</button>
      </div>;
    }

    /* ═══════ UPGRADES ═══════ */
    case "upgrades": return(
      <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Worth adding</div>
        <h2 style={{fontFamily:T.fd,fontSize:26,color:T.dark,margin:"4px 0 16px"}}>Small moves, big difference.</h2>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {UPG.map(ug=>{const on=s.up.includes(ug.id);return(
            <button key={ug.id} onClick={()=>{u({up:on?s.up.filter(x=>x!==ug.id):[...s.up,ug.id]});flash(on?`Removed`:`Added ${ug.label}`);}}
              style={{background:on?T.gd:T.white,border:on?"none":`1px solid ${T.border}`,borderRadius:T.rs,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,textAlign:"left",transition:"all .2s",boxShadow:on?T.shadow:"none"}}>
              <div style={{width:40,height:40,borderRadius:20,background:on?T.gold+"33":T.warm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontFamily:T.f,fontSize:18,fontWeight:700,color:on?T.goldL:T.green}}>{on?"✓":"+"}</div>
              <div style={{flex:1}}><div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:on?T.white:T.dark}}>{ug.label}</div><div style={{fontFamily:T.f,fontSize:12,color:on?T.light:T.muted,marginTop:2}}>{ug.desc}</div></div>
              <div style={{fontFamily:T.fd,fontSize:16,fontWeight:700,color:on?T.goldL:T.green,flexShrink:0}}>{ug.price===0?"Free":`+$${ug.price}`}</div>
            </button>
          );})}
        </div>
        <button onClick={next} style={{background:T.gd,color:T.goldL,border:"none",borderRadius:30,padding:"16px",width:"100%",fontFamily:T.f,fontSize:16,fontWeight:700,cursor:"pointer",marginTop:20,boxShadow:T.shadowLg,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          See it on your home {Ic.arrow(18,T.goldL)}
        </button>
        <button onClick={next} style={{background:"none",border:"none",color:T.muted,fontFamily:T.f,fontSize:13,cursor:"pointer",marginTop:6,width:"100%",padding:8}}>Skip for now</button>
      </div>
    );

    /* ═══════ REVIEW — "See it on your home" ═══════ */
    case "review":{
      const homeEmoji=HOMES.find(h=>h.id===s.home);
      // House scene SVG with selected door rendered into it
      const HousePreview=()=>(
        <svg viewBox="0 0 400 360" style={{width:"100%",height:"100%"}}>
          <defs>
            <linearGradient id="pvSky" x1="0" y1="0" x2="0" y2="200"><stop offset="0%" stopColor="#A8D4E6" stopOpacity=".4"/><stop offset="100%" stopColor="#E8DDD0" stopOpacity=".2"/></linearGradient>
            <linearGradient id="pvGround" x1="0" y1="310" x2="0" y2="360"><stop offset="0%" stopColor="#7A9A5A" stopOpacity=".3"/><stop offset="100%" stopColor="#5A7A3A" stopOpacity=".4"/></linearGradient>
            <clipPath id="pvDoorClip"><rect x="172" y="132" width="56" height="128" rx="2"/></clipPath>
          </defs>
          {/* Sky */}
          <rect width="400" height="360" fill="#F5F0E8"/>
          <rect width="400" height="200" fill="url(#pvSky)"/>
          {/* Sun */}
          <circle cx="330" cy="50" r="30" fill="#FFF8E0" opacity=".3"/>
          <circle cx="330" cy="50" r="18" fill="#FFF8E0" opacity=".4"/>
          {/* House body */}
          <rect x="80" y="130" width="240" height="180" fill="#D4C8B8" rx="2"/>
          {/* Roof varies by style */}
          {(s.home==="colonial"||s.home==="victorian")?
            <path d="M60 130 L200 50 L340 130Z" fill="#6A5540"/>:
           s.home==="modern"?
            <rect x="75" y="118" width="250" height="16" fill="#555" rx="1"/>:
            <path d="M70 130 L200 60 L330 130Z" fill="#7A5A10"/>
          }
          {/* Windows */}
          <rect x="100" y="158" width="52" height="52" rx="3" fill="#87CEEB" opacity=".3"/>
          <rect x="100" y="158" width="52" height="52" rx="3" fill="none" stroke="#B8A898" strokeWidth="2"/>
          <line x1="126" y1="158" x2="126" y2="210" stroke="#B8A898" strokeWidth="1.5"/>
          <line x1="100" y1="184" x2="152" y2="184" stroke="#B8A898" strokeWidth="1.5"/>
          <rect x="248" y="158" width="52" height="52" rx="3" fill="#87CEEB" opacity=".3"/>
          <rect x="248" y="158" width="52" height="52" rx="3" fill="none" stroke="#B8A898" strokeWidth="2"/>
          <line x1="274" y1="158" x2="274" y2="210" stroke="#B8A898" strokeWidth="1.5"/>
          <line x1="248" y1="184" x2="300" y2="184" stroke="#B8A898" strokeWidth="1.5"/>
          {/* DOOR OPENING — this is where their selected door goes */}
          <rect x="172" y="132" width="56" height="128" rx="2" fill="#2A2218"/>
          {/* Selected door rendered small in the opening */}
          <g clipPath="url(#pvDoorClip)">
            <g transform="translate(172,132) scale(0.187,0.32)">
              {selD&&getDoor(selD)}
            </g>
          </g>
          {/* Door frame */}
          <rect x="170" y="130" width="60" height="132" rx="2" fill="none" stroke={selH?.sw||"#555"} strokeWidth="3"/>
          {/* Light coming through */}
          <path d="M185 258 L160 340 L240 340 L215 258Z" fill="#FFF8E0" opacity=".08"/>
          {/* Steps */}
          <rect x="165" y="260" width="70" height="8" rx="1" fill="#C0B4A4"/>
          <rect x="158" y="268" width="84" height="8" rx="1" fill="#B8A898"/>
          {/* Landscaping */}
          <ellipse cx="130" cy="300" rx="35" ry="20" fill="#5A8A3A" opacity=".35"/>
          <ellipse cx="270" cy="305" rx="28" ry="16" fill="#4A7A2A" opacity=".3"/>
          <ellipse cx="310" cy="300" rx="22" ry="14" fill="#5A8A3A" opacity=".25"/>
          {/* Ground */}
          <rect y="310" width="400" height="50" fill="url(#pvGround)"/>
          {/* Path */}
          <path d="M200 268 Q200 300 200 340" stroke="#C0B4A4" strokeWidth="24" opacity=".3" fill="none"/>
          {/* Hardware indicator dot */}
          <circle cx="217" cy="200" r="4" fill={selH?.sw||"#C9A961"} stroke="#fff" strokeWidth="1.5"/>
        </svg>
      );

      return(
        <div style={{padding:"20px 20px 28px"}}>
          <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Your build</div>
          <h2 style={{fontFamily:T.fd,fontSize:28,color:T.dark,margin:"4px 0 14px",lineHeight:1.1}}>See it on your home.</h2>

          {/* User photo version OR house illustration */}
          {s.photo?(
            <div style={{position:"relative",borderRadius:T.r,overflow:"hidden",marginBottom:16}}>
              <img src={s.photo} alt="Your home" style={{width:"100%",height:260,objectFit:"cover",display:"block"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,.5))"}}/> 
              {/* Door overlay on photo */}
              <div style={{position:"absolute",bottom:40,left:"50%",transform:"translateX(-50%)",width:80,height:160,borderRadius:4,overflow:"hidden",border:`3px solid ${selH?.sw||"#C9A961"}`,boxShadow:"0 4px 24px rgba(0,0,0,.4)"}}>
                {selD&&getDoor(selD)}
              </div>
              <div style={{position:"absolute",bottom:12,left:16,zIndex:1}}>
                <div style={{fontFamily:T.fd,fontSize:22,fontWeight:700,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,.5)"}}>{selD?.label}</div>
              </div>
              <div style={{position:"absolute",bottom:14,right:16,zIndex:1,display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:20,height:20,borderRadius:10,background:selH?.sw||"#555",border:"2px solid #fff",boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}/>
                <span style={{fontFamily:T.f,fontSize:11,color:"#fff",fontWeight:600}}>{selH?.label}</span>
              </div>
            </div>
          ):(
            <div style={{borderRadius:T.r,overflow:"hidden",marginBottom:16,background:T.warm,border:`1px solid ${T.border}`}}>
              <HousePreview/>
            </div>
          )}

          {/* Door + hardware + upgrades summary */}
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            {selD&&<div style={{flex:1,background:T.white,borderRadius:T.rs,padding:"12px 14px",border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:T.f,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>Your door</div>
              <div style={{fontFamily:T.fd,fontSize:16,fontWeight:700,color:T.dark,marginTop:2}}>{selD.label}</div>
              <div style={{fontFamily:T.f,fontSize:12,color:T.muted,marginTop:1}}>{selD.sub}</div>
              <div style={{fontFamily:T.fd,fontSize:18,fontWeight:700,color:T.green,marginTop:4}}>${selD.price}</div>
            </div>}
            {selH&&<div style={{width:90,background:T.white,borderRadius:T.rs,padding:"12px 10px",border:`1px solid ${T.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
              <div style={{width:36,height:36,borderRadius:18,background:selH.sw,boxShadow:`0 4px 12px rgba(0,0,0,.2)`,border:`2px solid ${selH.ac}`}}/>
              <div style={{fontFamily:T.f,fontSize:11,fontWeight:700,color:T.dark,textAlign:"center"}}>{selH.label}</div>
            </div>}
          </div>

          {s.up.length>0&&<div style={{background:T.white,borderRadius:T.rs,padding:"10px 14px",border:`1px solid ${T.border}`,marginBottom:12}}>
            <div style={{fontFamily:T.f,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Upgrades</div>
            <div style={{fontFamily:T.f,fontSize:13,color:T.dark,fontWeight:600}}>{s.up.map(uid=>UPG.find(x=>x.id===uid)?.label).filter(Boolean).join(" · ")}</div>
          </div>}

          {homeEmoji&&!s.photo&&<div style={{textAlign:"center",fontFamily:T.f,fontSize:12,color:T.muted,marginBottom:8,fontStyle:"italic"}}>
            Shown on a {homeEmoji.l.toLowerCase()} home
          </div>}

          <button onClick={next} style={{background:T.gd,color:T.goldL,border:"none",borderRadius:30,padding:"16px",width:"100%",fontFamily:T.f,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:T.shadowLg,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            Looks right — see my price {Ic.arrow(18,T.goldL)}
          </button>
          <button onClick={()=>goTo("upgrades")} style={{background:"none",border:"none",color:T.auburn,fontFamily:T.f,fontSize:13,fontWeight:600,cursor:"pointer",marginTop:8,width:"100%",padding:8}}>← Change something</button>
        </div>
      );
    }

    /* ═══════ PRICE ═══════ */
    case "price": return(
      <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Estimated price</div>
        <div style={{display:"flex",alignItems:"baseline",gap:6,margin:"8px 0 4px"}}>
          <div style={{fontFamily:T.fd,fontSize:48,fontWeight:700,color:T.dark,letterSpacing:-2}}>${tot}</div>
          <div style={{fontFamily:T.f,fontSize:13,color:T.muted,fontStyle:"italic"}}>estimated</div>
        </div>
        <div style={{fontFamily:T.f,fontSize:13,color:T.mid,marginBottom:16,lineHeight:1.5}}>
          Final price depends on your door opening size. Standard sizes shown here — custom sizing may vary.
        </div>
        <div style={{background:T.white,borderRadius:T.r,padding:20,border:`1px solid ${T.border}`}}>
          {[[selD?.label||"Door",dP],["Professional install",inst],...s.up.map(uid=>{const ug=UPG.find(x=>x.id===uid);return ug&&ug.price>0?[ug.label,ug.price]:null;}).filter(Boolean)].map(([l,p],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",fontFamily:T.f,fontSize:14,borderBottom:i<2?`1px solid ${T.border}`:"none"}}>
              <span style={{color:T.mid}}>{l}</span><span style={{fontWeight:700,color:T.dark}}>${p}</span>
            </div>
          ))}
        </div>

        {/* Measurement options */}
        <div style={{marginTop:18}}>
          <div style={{fontFamily:T.f,fontSize:12,color:T.mid,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:10}}>How do you want to handle sizing?</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{u({measure:"pro"});flash("We'll bring the tape measure");}} style={{
              background:s.measure==="pro"?T.gd:T.white,
              border:s.measure==="pro"?"none":`1px solid ${T.border}`,
              borderRadius:T.rs,padding:"14px 16px",cursor:"pointer",textAlign:"left",
              display:"flex",alignItems:"center",gap:12,transition:"all .2s",
              boxShadow:s.measure==="pro"?T.shadow:"none",
            }}>
              <div style={{width:36,height:36,borderRadius:18,background:s.measure==="pro"?T.gold+"33":T.warm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {s.measure==="pro"?"✓":"📐"}
              </div>
              <div>
                <div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:s.measure==="pro"?T.white:T.dark}}>We measure — free</div>
                <div style={{fontFamily:T.f,fontSize:12,color:s.measure==="pro"?T.light:T.muted,marginTop:2}}>We come out, measure, confirm exact pricing</div>
              </div>
            </button>
            <button onClick={()=>{u({measure:"self"});flash("We'll send you instructions");}} style={{
              background:s.measure==="self"?T.gd:T.white,
              border:s.measure==="self"?"none":`1px solid ${T.border}`,
              borderRadius:T.rs,padding:"14px 16px",cursor:"pointer",textAlign:"left",
              display:"flex",alignItems:"center",gap:12,transition:"all .2s",
              boxShadow:s.measure==="self"?T.shadow:"none",
            }}>
              <div style={{width:36,height:36,borderRadius:18,background:s.measure==="self"?T.gold+"33":T.warm,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>
                {s.measure==="self"?"✓":"📏"}
              </div>
              <div>
                <div style={{fontFamily:T.f,fontSize:14,fontWeight:700,color:s.measure==="self"?T.white:T.dark}}>I'll measure myself</div>
                <div style={{fontFamily:T.f,fontSize:12,color:s.measure==="self"?T.light:T.muted,marginTop:2}}>We'll walk you through it — accuracy is on you</div>
              </div>
            </button>
          </div>
        </div>

        <div style={{background:T.warm,borderRadius:T.rs,padding:14,marginTop:14,textAlign:"center"}}>
          <div style={{fontFamily:T.f,fontSize:13,color:T.mid}}>
            <strong style={{color:T.auburn}}>$49</strong> refundable deposit locks your date.<br/>Balance confirmed after measurement.
          </div>
        </div>
        <button onClick={next} style={{background:T.gd,color:T.goldL,border:"none",borderRadius:30,padding:"16px",width:"100%",fontFamily:T.f,fontSize:16,fontWeight:700,cursor:"pointer",marginTop:20,boxShadow:T.shadowLg,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          Claim your date {Ic.arrow(18,T.goldL)}
        </button>
      </div>
    );

    /* ═══════ SCHEDULE ═══════ */
    case "schedule": return(
      <div style={{padding:"28px 20px"}}>
        <div style={{fontFamily:T.f,fontSize:11,color:T.gold,letterSpacing:3,textTransform:"uppercase",fontWeight:700}}>Almost there</div>
        <h2 style={{fontFamily:T.fd,fontSize:26,color:T.dark,margin:"4px 0 16px"}}>Claim your install date.</h2>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {dates.slice(0,8).map((d,i)=>{const iso=d.toISOString().split("T")[0],dn=d.toLocaleDateString("en-US",{weekday:"short"}),md=d.toLocaleDateString("en-US",{month:"short",day:"numeric"}),on=s.slot===iso;
            return <button key={i} onClick={()=>{u({slot:iso});flash(md);}}
              style={{background:on?T.gd:T.white,border:on?"none":`1px solid ${T.border}`,borderRadius:T.rs,padding:"14px 12px",cursor:"pointer",textAlign:"center",transition:"all .2s",boxShadow:on?T.shadow:"none"}}>
              <div style={{fontFamily:T.f,fontSize:11,color:on?T.light:T.muted,fontWeight:600}}>{dn}</div>
              <div style={{fontFamily:T.fd,fontSize:19,fontWeight:700,color:on?T.goldL:T.dark,marginTop:3}}>{md}</div>
            </button>;
          })}
        </div>
        {s.slot&&<div>
          <div style={{fontFamily:T.f,fontSize:14,color:T.dark,fontWeight:600,textAlign:"center",marginBottom:14}}>
            {new Date(s.slot+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"})}
          </div>
          <HoldBar onConfirm={()=>{flash("You're in.");setTimeout(()=>goTo("done"),500);}}/>
          <div style={{textAlign:"center",fontFamily:T.f,fontSize:11,color:T.muted,marginTop:10}}>Fully refundable · Cancel anytime</div>
        </div>}
      </div>
    );

    /* ═══════ DONE ═══════ */
    case "done": return(
      <div style={{padding:"32px 20px",textAlign:"center"}}>
        <div style={{width:64,height:64,borderRadius:32,background:T.gd,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:T.shadowGlow}}>{Ic.check(32,T.goldL)}</div>
        <h2 style={{fontFamily:T.fd,fontSize:30,color:T.dark,margin:"0 0 6px"}}>Done. It's yours.</h2>
        <p style={{fontFamily:T.f,fontSize:14,color:T.muted,margin:"0 0 20px"}}>We'll call to confirm everything.</p>
        {selD&&<div style={{position:"relative",borderRadius:T.r,overflow:"hidden",marginBottom:20,height:170}}>
          <div style={{position:"absolute",inset:0}}>{getDoor(selD)}</div>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 30%,rgba(0,0,0,.5))"}}/> 
          <div style={{position:"absolute",bottom:14,left:16,zIndex:1}}><div style={{fontFamily:T.fd,fontSize:20,fontWeight:700,color:"#fff"}}>{selD.label}</div><div style={{fontFamily:T.f,fontSize:12,color:"rgba(255,255,255,.8)"}}>{selD.sub}</div></div>
          {s.photo&&<div style={{position:"absolute",top:12,right:12,width:52,height:52,borderRadius:10,overflow:"hidden",border:"2px solid rgba(255,255,255,.8)",boxShadow:T.shadow,zIndex:1}}><img src={s.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
        </div>}
        <div style={{background:T.white,borderRadius:T.r,padding:16,border:`1px solid ${T.border}`,textAlign:"left",marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {[["Door",selD?.label],["Hardware",selH?.label],["Install",s.slot?new Date(s.slot+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"}):"—"],["Est. total",`$${tot}`]].map(([k,v],i)=>(
              <div key={i}><div style={{fontFamily:T.f,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>{k}</div><div style={{fontFamily:i===3?T.fd:T.f,fontSize:i===3?20:14,fontWeight:700,color:i===3?T.green:T.dark,marginTop:2}}>{v||"—"}</div></div>
            ))}
          </div>
          {s.up.length>0&&<div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${T.border}`}}><div style={{fontFamily:T.f,fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Upgrades</div><div style={{fontFamily:T.f,fontSize:13,color:T.dark}}>{s.up.map(uid=>UPG.find(u=>u.id===uid)?.label).filter(Boolean).join(" · ")}</div></div>}
        </div>
        <div style={{background:T.warm,borderRadius:T.rs,padding:14,marginBottom:16}}>
          <div style={{fontFamily:T.f,fontSize:13,color:T.mid}}>
            Deposit <strong style={{color:T.green}}>$49</strong> · Est. balance <strong>${tot-49}</strong> at install
          </div>
          {s.measure&&<div style={{fontFamily:T.f,fontSize:12,color:T.muted,marginTop:6}}>
            {s.measure==="pro"?"We'll come measure and confirm exact pricing — free.":"You'll receive measurement instructions. Final price confirmed after."}
          </div>}
        </div>
        <a href="tel:7205341220" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.gd,color:T.goldL,textDecoration:"none",borderRadius:30,padding:"16px",fontFamily:T.f,fontSize:16,fontWeight:700,boxShadow:T.shadowLg}}>
          {Ic.phone(18,T.goldL)} (720) 534-1220
        </a>
        <div style={{fontFamily:T.f,fontSize:11,color:T.muted,marginTop:10}}>Denver Storm Door · Littleton, CO</div>
      </div>
    );

    default:return null;
  }};

  return(
    <>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet"/>
      <div style={{maxWidth:430,margin:"0 auto",background:T.bg,minHeight:"100vh",fontFamily:T.f,position:"relative"}}>
        {/* Nav */}
        {step!=="hero"&&step!=="done"&&<div style={{position:"sticky",top:0,zIndex:100,background:`${T.bg}F0`,backdropFilter:"blur(16px)",WebkitBackdropFilter:"blur(16px)",padding:"10px 20px 6px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <button onClick={()=>{const i=STEPS.indexOf(step);if(i>0)goTo(STEPS[i-1]);}} style={{background:"none",border:"none",cursor:"pointer",padding:4,display:"flex",alignItems:"center"}}>{Ic.back(22,T.green)}</button>
            {/* Minimal pills */}
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              {s.door&&<span style={{background:T.green,color:"#fff",padding:"3px 10px",borderRadius:20,fontFamily:T.f,fontSize:10,fontWeight:700}}>{DOORS.find(d=>d.id===s.door)?.label}</span>}
              {s.hw&&<span style={{background:T.mid,color:"#fff",padding:"3px 10px",borderRadius:20,fontFamily:T.f,fontSize:10,fontWeight:700}}>{HW.find(h=>h.id===s.hw)?.label}</span>}
            </div>
            <div style={{width:26}}/>
          </div>
          {/* Progress */}
          <div style={{height:2,background:T.border,borderRadius:1,marginTop:8,overflow:"hidden"}}>
            <div style={{height:"100%",background:`linear-gradient(90deg,${T.green},${T.gold})`,borderRadius:1,width:`${prog*100}%`,transition:"width .4s cubic-bezier(.4,0,.2,1)"}}/>
          </div>
        </div>}

        <div key={step} style={{animation:"fadeUp .35s cubic-bezier(.4,0,.2,1)"}}>{render()}</div>
        <Toast msg={toast.m} vis={toast.v}/>
        <style>{`
          @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
          @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
          *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
          body{margin:0;background:${T.bg};-webkit-font-smoothing:antialiased}
          button:active{transform:scale(.97)}
          ::selection{background:${T.gold}44}
        `}</style>
      </div>
    </>
  );
}
