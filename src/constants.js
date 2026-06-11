// src/constants.js — Updated from Broadway Model Town Master Timeline Sheet

export const TEAMS = {
  design:   { name:'Design',    icon:'📐', color:'#b8860b' },
  projects: { name:'Projects',  icon:'🏗️', color:'#1a5fa8' },
  mep:      { name:'MEP',       icon:'⚡', color:'#5b4aaa' },
  vm:       { name:'VM',        icon:'🎨', color:'#c47d0e' },
  store:    { name:'Store',     icon:'🏪', color:'#1a7a45' },
  admin:    { name:'Admin',     icon:'👁️', color:'#b8860b' },
};

export const CATS = {
  planning:'Design & Planning', mep:'MEP', civil:'Civil Drawings',
  fixtures:'Fixtures', electrical:'Electrical', hvac:'HVAC',
  fire:'Fire & Safety', signage:'Signage', media:'Video/Media',
  audio:'Audio', it:'IT', plumbing:'Plumbing', washroom:'Washroom',
  boq:'BOQ', milestone:'Milestone',
};

export const STATUS_CFG = {
  not_started: { lbl:'Not Started', color:'#7a7a88', bg:'rgba(90,90,100,0.1)' },
  in_progress:  { lbl:'In Progress', color:'#c47d0e', bg:'rgba(196,125,14,0.1)' },
  done:         { lbl:'Done',        color:'#1a7a45', bg:'rgba(26,122,69,0.1)' },
  blocked:      { lbl:'Blocked',     color:'#c0392b', bg:'rgba(192,57,43,0.1)' },
};

export const PARENT_GROUPS = [
  { id:'grp_planning', name:'Design & Planning',        team:'design',   category:'planning',   icon:'📋',
    children:['dp1','dp2','dp3','dp4','dp5','dp6','dp7','dp8','dp9','dp10','dp11','dp12'] },
  { id:'grp_mep_sch',  name:'MEP Schematics',           team:'mep',      category:'mep',        icon:'⚡',
    children:['ms1','ms2','ms3','ms4','ms5','ms6','ms7','ms8','ms9','ms10'] },
  { id:'grp_mep1',     name:'MEP Set 01 — Conduit & Cable Tray', team:'mep', category:'electrical', icon:'🔌',
    children:['m1a','m1b','m1c','m1d'] },
  { id:'grp_mep2',     name:'MEP Set 02 — Fire & HVAC Layouts', team:'mep', category:'fire',       icon:'🔥',
    children:['m2a','m2b','m2c','m2d','m2e','m2f'] },
  { id:'grp_mep3',     name:'MEP Set 03 — Electrical & IT Layouts', team:'mep', category:'electrical', icon:'💡',
    children:['m3a','m3b','m3c','m3d','m3e','m3f','m3g','m3h','m3i','m3j'] },
  { id:'grp_cds1',     name:'Civil Drawings Set 01 — Layouts',  team:'design', category:'civil',   icon:'📐',
    children:['c1a','c1b','c1c','c1d','c1e','c1f','c1g','c1h','c1i','c1j','c1k'] },
  { id:'grp_cds2',     name:'Civil Drawings Set 02 — Elevations', team:'design', category:'civil', icon:'🏗️',
    children:['c2a','c2b','c2c','c2d','c2e','c2f','c2g','c2h','c2i'] },
  { id:'grp_cds3',     name:'Civil Drawings Set 03 — Details',  team:'design', category:'civil',   icon:'📏',
    children:['c3a','c3b','c3c','c3d','c3e','c3f','c3g','c3h','c3i','c3j','c3k','c3l','c3m','c3n','c3o'] },
  { id:'grp_boq',      name:'BOQ & Fixtures',            team:'projects', category:'boq',        icon:'📦',
    children:['bq1','bq2','bq3','bq4','bq5','bq6'] },
  { id:'grp_washroom', name:'Washroom Drawings',          team:'design',   category:'washroom',   icon:'🚿',
    children:['wr1','wr2','wr3','wr4','wr5','wr6','wr7','wr8','wr9'] },
  { id:'grp_civil_wbs',name:'Civil & Interior Works (WBS)', team:'projects', category:'civil',    icon:'🏢',
    children:['wbs1','wbs2','wbs3','wbs4','wbs5','wbs6','wbs7','wbs8','wbs9'] },
  { id:'grp_elect',    name:'Electrical & HVAC Procurement', team:'projects', category:'electrical', icon:'⚡',
    children:['el1','el2','el3','el4','el5'] },
  { id:'grp_misc',     name:'Signage, Media & IT',        team:'projects', category:'signage',    icon:'📺',
    children:['sg1','sg2','sg3','sg4','sg5','sg6'] },
];

export const CHILD_TO_PARENT = {};
PARENT_GROUPS.forEach(g => g.children.forEach(c => { CHILD_TO_PARENT[c] = g.id; }));

// Excel dates: serial numbers — 46106 = 25 Mar 2025, offset from 1 Jan 1900
const xlDate = (serial) => {
  if(!serial || isNaN(serial)) return null;
  const d = new Date((serial - 25569) * 86400 * 1000);
  return d.toISOString().split('T')[0];
};

export const DEFAULT_TASKS = [

  // ── DESIGN & PLANNING ────────────────────────────────────────
  { id:'dp1',  name:'Site Survey Report (SDR)',         team:'design', category:'planning', duration:3,  deps:[], status:'not_started' },
  { id:'dp2',  name:'Store Carpet Area & Zoning',       team:'design', category:'planning', duration:5,  deps:['dp1'], status:'done', plannedEnd:xlDate(46115) },
  { id:'dp3',  name:'Store Zoning — Final Approval',    team:'design', category:'planning', duration:2,  deps:['dp2'], status:'done', plannedEnd:xlDate(46169), isMilestone:true },
  { id:'dp4',  name:'Layout Version_01',                team:'design', category:'planning', duration:5,  deps:['dp3'], status:'in_progress', plannedEnd:xlDate(46176) },
  { id:'dp5',  name:'Layout Version_02',                team:'design', category:'planning', duration:2,  deps:['dp4'], status:'not_started', plannedEnd:xlDate(46181) },
  { id:'dp6',  name:'Layout Version_03',                team:'design', category:'planning', duration:2,  deps:['dp5'], status:'not_started', plannedEnd:xlDate(46184) },
  { id:'dp7',  name:'Signoff on Final Layout',          team:'design', category:'planning', duration:1,  deps:['dp6'], status:'not_started', plannedEnd:xlDate(46185), isMilestone:true },
  { id:'dp8',  name:'Façade Design Version_01',         team:'design', category:'planning', duration:7,  deps:['dp3'], status:'done', plannedEnd:xlDate(46178) },
  { id:'dp9',  name:'3D Design',                        team:'design', category:'planning', duration:14, deps:['dp7'], status:'not_started', plannedEnd:xlDate(46199) },
  { id:'dp10', name:'Discussion on 3D Design',          team:'design', category:'planning', duration:1,  deps:['dp9'], status:'not_started' },
  { id:'dp11', name:'Updated 3D Design',                team:'design', category:'planning', duration:5,  deps:['dp10'], status:'not_started', plannedEnd:xlDate(46209) },
  { id:'dp12', name:'Signoff on 3D Design',             team:'design', category:'planning', duration:1,  deps:['dp11'], status:'not_started', isMilestone:true },

  // ── MEP SCHEMATICS ───────────────────────────────────────────
  { id:'ms1',  name:'Power Load (PLC) + SLD',           team:'mep', category:'electrical', duration:7,  deps:['dp9'], status:'not_started', plannedEnd:xlDate(46265) },
  { id:'ms2',  name:'Heat Load Calculation (HLC)',       team:'mep', category:'hvac',       duration:7,  deps:['dp9'], status:'not_started', plannedEnd:xlDate(46273) },
  { id:'ms3',  name:'HVAC DBR',                          team:'mep', category:'hvac',       duration:5,  deps:['dp7'], status:'not_started', plannedEnd:xlDate(46278) },
  { id:'ms4',  name:'HVAC Layout',                       team:'mep', category:'hvac',       duration:5,  deps:['ms3'], status:'not_started', plannedEnd:xlDate(46263) },
  { id:'ms5',  name:'Lighting Layout to Vendor',         team:'mep', category:'electrical', duration:3,  deps:['dp7'], status:'not_started' },
  { id:'ms6',  name:'LED/TV Screen Presentation',        team:'mep', category:'media',      duration:7,  deps:['dp9'], status:'not_started', plannedEnd:xlDate(46239) },
  { id:'ms7',  name:'Glow Box Presentation',             team:'mep', category:'media',      duration:3,  deps:['ms6'], status:'not_started', plannedEnd:xlDate(46244) },
  { id:'ms8',  name:'Signage Docket',                    team:'mep', category:'signage',    duration:3,  deps:['dp7'], status:'not_started', plannedEnd:xlDate(46247) },
  { id:'ms9',  name:'PA & Music System from Vendor',     team:'projects', category:'audio', duration:3,  deps:['dp7'], status:'not_started' },
  { id:'ms10', name:'Network & CCTV Layout',             team:'projects', category:'it',    duration:3,  deps:['dp7'], status:'not_started' },

  // ── MEP SET 01 — Conduit & Cable Tray ───────────────────────
  { id:'m1a',  name:'GF — Floor Conduiting Layout',      team:'mep', category:'electrical', duration:2,  deps:['dp7'], status:'not_started', plannedEnd:xlDate(46251) },
  { id:'m1b',  name:'FF — Floor Conduiting Layout',      team:'mep', category:'electrical', duration:2,  deps:['dp7'], status:'not_started', plannedEnd:xlDate(46253) },
  { id:'m1c',  name:'GF — Cable Tray Layout',            team:'mep', category:'electrical', duration:2,  deps:['m1a'], status:'not_started' },
  { id:'m1d',  name:'FF — Cable Tray Layout',            team:'mep', category:'electrical', duration:2,  deps:['m1b'], status:'not_started' },

  // ── MEP SET 02 — Fire & HVAC ─────────────────────────────────
  { id:'m2a',  name:'GF — Smoke Detector Layout',        team:'mep', category:'fire',       duration:3,  deps:['ms4'], status:'not_started', plannedEnd:xlDate(46216) },
  { id:'m2b',  name:'FF — Smoke Detector Layout',        team:'mep', category:'fire',       duration:3,  deps:['ms4'], status:'not_started', plannedEnd:xlDate(46216) },
  { id:'m2c',  name:'GF — Fire Sprinkler Layout',        team:'mep', category:'fire',       duration:3,  deps:['m2a'], status:'not_started', plannedEnd:xlDate(46218) },
  { id:'m2d',  name:'FF — Fire Sprinkler Layout',        team:'mep', category:'fire',       duration:3,  deps:['m2b'], status:'not_started', plannedEnd:xlDate(46218) },
  { id:'m2e',  name:'GF — HVAC Layout (Detailed)',       team:'mep', category:'hvac',       duration:3,  deps:['ms4'], status:'not_started', plannedEnd:xlDate(46258) },
  { id:'m2f',  name:'FF — HVAC Layout (Detailed)',       team:'mep', category:'hvac',       duration:3,  deps:['ms4'], status:'not_started', plannedEnd:xlDate(46258) },

  // ── MEP SET 03 — Electrical & IT ────────────────────────────
  { id:'m3a',  name:'GF — Electrical Layout',            team:'mep', category:'electrical', duration:4,  deps:['ms1'], status:'not_started', plannedEnd:xlDate(46205) },
  { id:'m3b',  name:'FF — Electrical Layout',            team:'mep', category:'electrical', duration:4,  deps:['ms1'], status:'not_started', plannedEnd:xlDate(46205) },
  { id:'m3c',  name:'GF — Lighting Looping Layout',      team:'mep', category:'electrical', duration:4,  deps:['ms5'], status:'not_started', plannedEnd:xlDate(46262) },
  { id:'m3d',  name:'FF — Lighting Looping Layout',      team:'mep', category:'electrical', duration:4,  deps:['ms5'], status:'not_started', plannedEnd:xlDate(46262) },
  { id:'m3e',  name:'GF — PA & Music System Layout',     team:'mep', category:'audio',      duration:3,  deps:['ms9'], status:'not_started' },
  { id:'m3f',  name:'FF — PA & Music System Layout',     team:'mep', category:'audio',      duration:3,  deps:['ms9'], status:'not_started' },
  { id:'m3g',  name:'GF — CCTV Looping Layout',          team:'mep', category:'it',         duration:3,  deps:['ms10'], status:'not_started' },
  { id:'m3h',  name:'FF — CCTV Looping Layout',          team:'mep', category:'it',         duration:3,  deps:['ms10'], status:'not_started' },
  { id:'m3i',  name:'GF — IT Looping Layout',            team:'mep', category:'it',         duration:3,  deps:['ms10'], status:'not_started' },
  { id:'m3j',  name:'FF — IT Looping Layout',            team:'mep', category:'it',         duration:3,  deps:['ms10'], status:'not_started' },

  // ── CIVIL DRAWINGS SET 01 ────────────────────────────────────
  { id:'c1a',  name:'GF — Furniture Layout (with Fix Code)', team:'design', category:'civil', duration:2, deps:['dp7'], status:'not_started', plannedEnd:xlDate(46266) },
  { id:'c1b',  name:'FF — Furniture Layout (with Fix Code)', team:'design', category:'civil', duration:2, deps:['dp7'], status:'not_started', plannedEnd:xlDate(46268) },
  { id:'c1c',  name:'GF — Drywall Layout',               team:'design', category:'civil',    duration:4,  deps:['c1a'], status:'not_started', plannedEnd:xlDate(46274) },
  { id:'c1d',  name:'FF — Drywall Layout',               team:'design', category:'civil',    duration:4,  deps:['c1b'], status:'not_started', plannedEnd:xlDate(46280) },
  { id:'c1e',  name:'GF & FF — Drywall Details',         team:'design', category:'civil',    duration:3,  deps:['c1c','c1d'], status:'not_started' },
  { id:'c1f',  name:'GF — Flooring Layout',              team:'design', category:'civil',    duration:2,  deps:['c1c'], status:'not_started', plannedEnd:xlDate(46282) },
  { id:'c1g',  name:'FF — Flooring Layout',              team:'design', category:'civil',    duration:2,  deps:['c1d'], status:'not_started', plannedEnd:xlDate(46286) },
  { id:'c1h',  name:'GF — Ceiling Layout',               team:'design', category:'civil',    duration:3,  deps:['m2e'], status:'not_started' },
  { id:'c1i',  name:'FF — Ceiling Layout',               team:'design', category:'civil',    duration:3,  deps:['m2f'], status:'not_started' },
  { id:'c1j',  name:'GF & FF — Ceiling Details',         team:'design', category:'civil',    duration:3,  deps:['c1h','c1i'], status:'not_started' },
  { id:'c1k',  name:'BOQ Set 01',                        team:'design', category:'boq',      duration:3,  deps:['c1f','c1g','c1j'], status:'not_started' },

  // ── CIVIL DRAWINGS SET 02 ────────────────────────────────────
  { id:'c2a',  name:'Facade Drawing',                    team:'design', category:'civil',    duration:5,  deps:['dp8'], status:'in_progress', plannedEnd:xlDate(46168) },
  { id:'c2b',  name:'GF — Trial Room Details',           team:'design', category:'civil',    duration:3,  deps:['c1a'], status:'not_started' },
  { id:'c2c',  name:'FF — Trial Room Details',           team:'design', category:'civil',    duration:3,  deps:['c1b'], status:'not_started' },
  { id:'c2d',  name:'GF — Wall Elevations',              team:'design', category:'civil',    duration:4,  deps:['c1a'], status:'not_started' },
  { id:'c2e',  name:'FF — Wall Elevations',              team:'design', category:'civil',    duration:4,  deps:['c1b'], status:'not_started' },
  { id:'c2f',  name:'LGD Wall Details',                  team:'design', category:'civil',    duration:3,  deps:['c2d'], status:'not_started' },
  { id:'c2g',  name:'LGD Section Details',               team:'design', category:'civil',    duration:3,  deps:['c2f'], status:'not_started' },
  { id:'c2h',  name:'LGD Ceiling Layout & Detail',       team:'design', category:'civil',    duration:3,  deps:['c1h'], status:'not_started' },
  { id:'c2i',  name:'BOQ Set 02',                        team:'design', category:'boq',      duration:3,  deps:['c2d','c2e','c2h'], status:'not_started' },

  // ── CIVIL DRAWINGS SET 03 ────────────────────────────────────
  { id:'c3a',  name:'GF — Wall Elevations (Set 03)',     team:'design', category:'civil',    duration:4,  deps:['c1a'], status:'not_started' },
  { id:'c3b',  name:'FF — Wall Elevations (Set 03)',     team:'design', category:'civil',    duration:4,  deps:['c1b'], status:'not_started' },
  { id:'c3c',  name:'GF — Skirting Layout',              team:'design', category:'civil',    duration:2,  deps:['c1f'], status:'not_started' },
  { id:'c3d',  name:'FF — Skirting Layout',              team:'design', category:'civil',    duration:2,  deps:['c1g'], status:'not_started' },
  { id:'c3e',  name:'GF — Wall Finishes Layout',         team:'design', category:'civil',    duration:3,  deps:['c3a'], status:'not_started' },
  { id:'c3f',  name:'FF — Wall Finishes Layout',         team:'design', category:'civil',    duration:3,  deps:['c3b'], status:'not_started' },
  { id:'c3g',  name:'GF — Door Detail',                  team:'design', category:'civil',    duration:2,  deps:['c3a'], status:'not_started' },
  { id:'c3h',  name:'FF — Door Detail',                  team:'design', category:'civil',    duration:2,  deps:['c3b'], status:'not_started' },
  { id:'c3i',  name:'Stage Detail',                      team:'design', category:'civil',    duration:3,  deps:['dp12'], status:'not_started' },
  { id:'c3j',  name:'Wall Elevations with Furniture',    team:'design', category:'civil',    duration:4,  deps:['c1a','c1b'], status:'not_started' },
  { id:'c3k',  name:'GF — Mirror Placement Layout',      team:'design', category:'civil',    duration:2,  deps:['c1a'], status:'not_started' },
  { id:'c3l',  name:'FF — Mirror Placement Layout',      team:'design', category:'civil',    duration:2,  deps:['c1b'], status:'not_started' },
  { id:'c3m',  name:'GF — Signage Marking Layout',       team:'design', category:'signage',  duration:2,  deps:['ms8'], status:'not_started' },
  { id:'c3n',  name:'FF — Signage Marking Layout',       team:'design', category:'signage',  duration:2,  deps:['ms8'], status:'not_started' },
  { id:'c3o',  name:'BOQ Set 03',                        team:'design', category:'boq',      duration:3,  deps:['c3e','c3f','c3j'], status:'not_started' },

  // ── BOQ & FIXTURES ───────────────────────────────────────────
  { id:'bq1',  name:'HVAC BOQ',                          team:'mep',     category:'boq',     duration:2,  deps:['ms4'], status:'not_started', plannedEnd:xlDate(46288) },
  { id:'bq2',  name:'Electrical BOQ',                    team:'mep',     category:'boq',     duration:3,  deps:['ms1'], status:'not_started' },
  { id:'bq3',  name:'Sprinkler BOQ',                     team:'mep',     category:'boq',     duration:2,  deps:['m2c','m2d'], status:'not_started' },
  { id:'bq4',  name:'Fire Alarm BOQ',                    team:'mep',     category:'boq',     duration:2,  deps:['m2a','m2b'], status:'not_started' },
  { id:'bq5',  name:'Fixture BOQ',                       team:'design',  category:'fixtures',duration:3,  deps:['c1a','c1b'], status:'not_started', plannedEnd:xlDate(46293) },
  { id:'bq6',  name:'Truss Detail Docket',               team:'design',  category:'fixtures',duration:5,  deps:['c1h','c1i'], status:'not_started' },

  // ── WASHROOM DRAWINGS ────────────────────────────────────────
  { id:'wr1',  name:'Washroom — Brick Work Layout',      team:'design', category:'washroom', duration:2,  deps:['dp3'], status:'done', plannedEnd:xlDate(46162) },
  { id:'wr2',  name:'Washroom — Flooring Layout',        team:'design', category:'washroom', duration:2,  deps:['wr1'], status:'not_started', plannedEnd:xlDate(46168) },
  { id:'wr3',  name:'Washroom — Wall Finishes',          team:'design', category:'washroom', duration:2,  deps:['wr1'], status:'not_started', plannedEnd:xlDate(46168) },
  { id:'wr4',  name:'Washroom — Ceiling Layout',         team:'design', category:'washroom', duration:2,  deps:['wr2'], status:'not_started', plannedEnd:xlDate(46169) },
  { id:'wr5',  name:'Washroom — Elevations & Sections',  team:'design', category:'washroom', duration:2,  deps:['wr3'], status:'not_started', plannedEnd:xlDate(46170) },
  { id:'wr6',  name:'Washroom — Drainage Layout',        team:'mep',    category:'plumbing', duration:2,  deps:['wr1'], status:'done', plannedEnd:xlDate(46170) },
  { id:'wr7',  name:'Washroom — Water Supply Layout',    team:'mep',    category:'plumbing', duration:2,  deps:['wr1'], status:'done', plannedEnd:xlDate(46170) },
  { id:'wr8',  name:'Washroom — Electrical Layout',      team:'mep',    category:'electrical',duration:2, deps:['wr4'], status:'not_started', plannedEnd:xlDate(46168) },
  { id:'wr9',  name:'Washroom — 3D Model & Presentation',team:'design', category:'washroom', duration:3,  deps:['wr5'], status:'done', plannedEnd:xlDate(46168) },

  // ── CIVIL & INTERIOR WORKS (WBS) ─────────────────────────────
  { id:'wbs1', name:'Flooring (Procurement + Install)',  team:'projects', category:'civil',   duration:61, deps:['c1f','c1g'], status:'not_started', notes:'Rs.150/sqft paid by LL. Total 61 days (21 proc + 40 install)' },
  { id:'wbs2', name:'Facade Canopy (Fabrication)',       team:'projects', category:'civil',   duration:37, deps:['c2a'], status:'not_started', notes:'7d procurement + 30d installation' },
  { id:'wbs3', name:'Glass Railing',                     team:'projects', category:'civil',   duration:52, deps:['dp12'], status:'not_started', notes:'45d procurement + 7d installation' },
  { id:'wbs4', name:'Landscape Work',                    team:'projects', category:'civil',   duration:21, deps:['dp12'], status:'not_started' },
  { id:'wbs5', name:'Special Elements — Metal Ceiling Truss', team:'projects', category:'civil', duration:44, deps:['bq6'], status:'not_started', notes:'30d procurement + 14d installation' },
  { id:'wbs6', name:'Dry Partition & Wall Cladding',     team:'projects', category:'civil',   duration:45, deps:['c1c','c1d'], status:'not_started' },
  { id:'wbs7', name:'Main Entrance Portal',              team:'projects', category:'civil',   duration:45, deps:['dp12'], status:'not_started', notes:'Air curtain, sliding glass door, RFID' },
  { id:'wbs8', name:'POP + Putty + Internal Painting',   team:'projects', category:'civil',   duration:45, deps:['wbs5'], status:'not_started', notes:'Post MEP ceiling works completion' },
  { id:'wbs9', name:'Toilet Modular Partition',          team:'projects', category:'washroom',duration:37, deps:['wr4','wr6'], status:'not_started', notes:'30d procurement + 7d installation' },

  // ── ELECTRICAL & HVAC PROCUREMENT ───────────────────────────
  { id:'el1',  name:'LT Panel + Harmonic + DB (Procurement + Install)', team:'projects', category:'electrical', duration:52, deps:['ms1'], status:'not_started', notes:'45d procurement + 7d installation' },
  { id:'el2',  name:'UPS',                               team:'projects', category:'electrical', duration:33, deps:['ms1'], status:'not_started', notes:'30d procurement + 3d installation' },
  { id:'el3',  name:'HVAC High Side Electrical Cabling', team:'projects', category:'hvac',   duration:21, deps:['ms4'], status:'not_started' },
  { id:'el4',  name:'HVAC — Supply of High Side Machines', team:'projects', category:'hvac', duration:60, deps:['ms3'], status:'not_started', notes:'DBR + Heat Load + Layout + Technical BOQ needed' },
  { id:'el5',  name:'HVAC — Installation & Low Side Copper Piping', team:'projects', category:'hvac', duration:45, deps:['el4','ms4'], status:'not_started' },

  // ── SIGNAGE, MEDIA & IT ──────────────────────────────────────
  { id:'sg1',  name:'Fire Alarm System',                 team:'projects', category:'fire',    duration:28, deps:['m2a','m2b'], status:'not_started', notes:'21d procurement + 7d installation' },
  { id:'sg2',  name:'Functional Lighting — Track & Special', team:'projects', category:'electrical', duration:35, deps:['m3c','m3d'], status:'not_started', notes:'21d procurement + 14d installation' },
  { id:'sg3',  name:'RF/RFID Antennas',                  team:'projects', category:'it',      duration:24, deps:['m3i','m3j'], status:'not_started', notes:'21d procurement + 3d installation' },
  { id:'sg4',  name:'External Signage',                  team:'projects', category:'signage', duration:40, deps:['ms8','c2a'], status:'not_started', notes:'30d procurement + 10d installation' },
  { id:'sg5',  name:'Internal Signage',                  team:'projects', category:'signage', duration:40, deps:['ms8','c3m','c3n'], status:'not_started', notes:'30d procurement + 10d installation' },
  { id:'sg6',  name:'Internal LED Screens + Ticker (Curve & External)', team:'projects', category:'media', duration:91, deps:['ms6'], status:'not_started', notes:'70d procurement + 21d installation — LONGEST LEAD ITEM' },

  // ── LAUNCH MILESTONE ─────────────────────────────────────────
  { id:'LAUNCH', name:'🎯 STORE LAUNCH READY', team:'admin', category:'milestone', duration:0, isMilestone:true,
    deps:['wbs1','wbs2','wbs5','wbs6','wbs7','wbs8','el1','el2','el4','el5','sg1','sg2','sg4','sg5','sg6','bq5','c3o','dp12'] },
];
