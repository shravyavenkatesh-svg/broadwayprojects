// src/constants.js
// Broadway Model Town — Model Town store
// Source: 12June26_I265_BROADWAY_MODEL_TOWN_TIMELINES_SRAT_V01.xlsx (actual version)
// DO NOT link to or reference the source sheet in the UI

export const TEAMS = {
  design:   { name:'Design / Rarefuture', icon:'📐', color:'#b8860b' },
  projects: { name:'Projects / BW',       icon:'🏗️', color:'#1a5fa8' },
  mep:      { name:'MEP',                 icon:'⚡', color:'#5b4aaa' },
  vm:       { name:'VM',                  icon:'🎨', color:'#c47d0e' },
  store:    { name:'Store / IT',          icon:'🏪', color:'#1a7a45' },
  admin:    { name:'Admin',               icon:'👁️', color:'#b8860b' },
};

export const CATS = {
  planning:   'Design & Planning',
  mep:        'MEP Schematics',
  civil_01:   'Civil Drawings Set 01',
  civil_02:   'Civil Drawings Set 02',
  civil_03:   'Civil Drawings Set 03',
  washroom:   'Washroom Drawings',
  boq:        'BOQ & Fixtures',
  wbs_civil:  'Civil & Interior',
  wbs_elec:   'Electrical',
  wbs_hvac:   'HVAC',
  wbs_plumb:  'Plumbing',
  wbs_fire:   'Fire Fighting',
  wbs_int:    'Interior Works',
  wbs_fnf:    'Furniture & Fixtures',
  wbs_light:  'Functional Lighting',
  wbs_sign:   'Signage',
  wbs_media:  'Video & Media',
  wbs_audio:  'Audio & Music',
  wbs_it:     'IT',
  milestone:  'Milestone',
};

export const STATUS_CFG = {
  not_started: { lbl:'Not Started', color:'#7a7a88', bg:'rgba(90,90,100,0.1)' },
  in_progress:  { lbl:'In Progress', color:'#c47d0e', bg:'rgba(196,125,14,0.1)' },
  done:         { lbl:'Done',        color:'#1a7a45', bg:'rgba(26,122,69,0.1)' },
  blocked:      { lbl:'Blocked',     color:'#c0392b', bg:'rgba(192,57,43,0.1)' },
};

// Excel serial date → ISO string
const xl = s => s ? new Date((s - 25569) * 86400 * 1000).toISOString().split('T')[0] : null;

export const PARENT_GROUPS = [
  { id:'grp_design',    name:'Design & Planning',                        team:'design',   category:'planning',  icon:'📋',
    children:['dp1','dp2','dp3','dp4','dp5','dp6','dp7','dp8','dp9','dp10','dp11','dp12','dp13','dp14','dp15','dp16','dp17','dp18'] },
  { id:'grp_mep_sch',   name:'MEP Schematics',                           team:'mep',      category:'mep',       icon:'⚡',
    children:['ms1','ms2','ms3','ms4','ms5','ms6','ms7','ms8','ms9','ms10'] },
  { id:'grp_mep_01',    name:'MEP Set 01 — Floor Conduit & Cable Tray',  team:'mep',      category:'mep',       icon:'🔌',
    children:['m1a','m1b','m1c','m1d'] },
  { id:'grp_mep_02',    name:'MEP Set 02 — Fire & HVAC Layouts',         team:'mep',      category:'mep',       icon:'🔥',
    children:['m2a','m2b','m2c','m2d','m2e','m2f'] },
  { id:'grp_mep_03',    name:'MEP Set 03 — Electrical, Lighting & IT',   team:'mep',      category:'mep',       icon:'💡',
    children:['m3a','m3b','m3c','m3d','m3e','m3f','m3g','m3h','m3i','m3j'] },
  { id:'grp_cds01',     name:'Civil Drawings Set 01 — Layouts',          team:'design',   category:'civil_01',  icon:'📐',
    children:['c1a','c1b','c1c','c1d','c1e','c1f','c1g','c1h','c1i','c1j','c1k'] },
  { id:'grp_cds02',     name:'Civil Drawings Set 02 — Elevations & Facade', team:'design', category:'civil_02', icon:'🏢',
    children:['c2a','c2b','c2c','c2d','c2e','c2f','c2g','c2h','c2i'] },
  { id:'grp_cds03',     name:'Civil Drawings Set 03 — Details & BOQ',    team:'design',   category:'civil_03',  icon:'📏',
    children:['c3a','c3b','c3c','c3d','c3e','c3f','c3g','c3h','c3i','c3j','c3k','c3l','c3m','c3n','c3o'] },
  { id:'grp_boq',       name:'BOQ & Fixtures',                            team:'design',   category:'boq',       icon:'📦',
    children:['bq1','bq2','bq3','bq4','bq5','bq6'] },
  { id:'grp_washroom',  name:'Washroom Drawings (Civil + MEP)',            team:'design',   category:'washroom',  icon:'🚿',
    children:['wr1','wr2','wr3','wr4','wr5','wr6','wr7','wr8','wr9','wr10','wr11','wr12'] },
  { id:'grp_civil_wbs', name:'Civil & Interior Works',                     team:'projects', category:'wbs_civil', icon:'🏗️',
    children:['wc1','wc2','wc3','wc4','wc5'] },
  { id:'grp_int_wbs',   name:'Interior Works',                             team:'projects', category:'wbs_int',   icon:'🏠',
    children:['wi1','wi2','wi3','wi4','wi5','wi6','wi7'] },
  { id:'grp_elec_wbs',  name:'Electrical',                                 team:'projects', category:'wbs_elec',  icon:'⚡',
    children:['we1','we2','we3','we4'] },
  { id:'grp_hvac_wbs',  name:'HVAC',                                       team:'projects', category:'wbs_hvac',  icon:'❄️',
    children:['wh1','wh2'] },
  { id:'grp_plumb_wbs', name:'Plumbing',                                   team:'projects', category:'wbs_plumb', icon:'🚰',
    children:['wp1'] },
  { id:'grp_fire_wbs',  name:'Fire Fighting',                              team:'projects', category:'wbs_fire',  icon:'🔥',
    children:['wf1','wf2','wf3'] },
  { id:'grp_fnf_wbs',   name:'Furniture & Fixtures',                       team:'design',   category:'wbs_fnf',   icon:'🪑',
    children:['wff1'] },
  { id:'grp_light_wbs', name:'Functional Lighting',                        team:'projects', category:'wbs_light', icon:'💡',
    children:['wl1'] },
  { id:'grp_sign_wbs',  name:'Signage',                                    team:'projects', category:'wbs_sign',  icon:'🪧',
    children:['ws1','ws2'] },
  { id:'grp_media_wbs', name:'Video & Media',                              team:'projects', category:'wbs_media', icon:'📺',
    children:['wm1','wm2','wm3'] },
  { id:'grp_audio_wbs', name:'Audio & Music',                              team:'projects', category:'wbs_audio', icon:'🎵',
    children:['wa1'] },
  { id:'grp_it_wbs',    name:'IT',                                         team:'store',    category:'wbs_it',    icon:'💻',
    children:['wit1'] },
];

export const CHILD_TO_PARENT = {};
PARENT_GROUPS.forEach(g => g.children.forEach(c => { CHILD_TO_PARENT[c] = g.id; }));

export const DEFAULT_TASKS = [

  // ── DESIGN & PLANNING ─────────────────────────────────────────────────────
  { id:'dp1',  name:'Site Survey Report (SDR)',           team:'design', category:'planning', duration:1,  deps:[], status:'not_started' },
  { id:'dp2',  name:'Store Carpet Area & Zoning',         team:'design', category:'planning', duration:1,  deps:['dp1'], status:'done', plannedEnd:xl(46106) },
  { id:'dp3',  name:'Business Brief — Document',           team:'design', category:'planning', duration:1,  deps:[], status:'done', plannedEnd:xl(46108) },
  { id:'dp4',  name:'Store Zoning — Version 01',           team:'design', category:'planning', duration:5,  deps:['dp2'], status:'done', plannedEnd:xl(46115) },
  { id:'dp5',  name:'Store Zoning — Version 02',           team:'design', category:'planning', duration:3,  deps:['dp4'], status:'done', plannedEnd:xl(46121) },
  { id:'dp6',  name:'Store Zoning — Version 03',           team:'design', category:'planning', duration:2,  deps:['dp5'], status:'done', plannedEnd:xl(46126) },
  { id:'dp7',  name:'Store Zoning — Version 04',           team:'design', category:'planning', duration:3,  deps:['dp6'], status:'done', plannedEnd:xl(46155), notes:'Change in escalator position by LL — zoning reworked' },
  { id:'dp8',  name:'Store Zoning — Version 05',           team:'design', category:'planning', duration:2,  deps:['dp7'], status:'done', plannedEnd:xl(46161) },
  { id:'dp9',  name:'Approval on Zoning',                  team:'design', category:'planning', duration:1,  deps:['dp8'], status:'done', plannedEnd:xl(46169), isMilestone:true, notes:'CLOSED' },
  { id:'dp10', name:'Layout Version 01',                   team:'design', category:'planning', duration:5,  deps:['dp9'], status:'in_progress', plannedEnd:xl(46176) },
  { id:'dp11', name:'Discussion on Layout V01',            team:'design', category:'planning', duration:1,  deps:['dp10'], status:'not_started', plannedEnd:xl(46177) },
  { id:'dp12', name:'Layout Version 02',                   team:'design', category:'planning', duration:2,  deps:['dp11'], status:'not_started', plannedEnd:xl(46181) },
  { id:'dp13', name:'Layout Version 03',                   team:'design', category:'planning', duration:2,  deps:['dp12'], status:'not_started', plannedEnd:xl(46184) },
  { id:'dp14', name:'Signoff on Final Layout',             team:'design', category:'planning', duration:1,  deps:['dp13'], status:'not_started', plannedEnd:xl(46185), isMilestone:true },
  { id:'dp15', name:'Façade Design Version 01',            team:'design', category:'planning', duration:5,  deps:['dp9'],  status:'done', plannedEnd:xl(46142), notes:'Design closed; working drawing awaiting' },
  { id:'dp16', name:'3D Design',                           team:'design', category:'planning', duration:14, deps:['dp14'], status:'not_started', plannedEnd:xl(46199), notes:'Tentative timelines post layout signoff' },
  { id:'dp17', name:'Discussion on 3D Design',             team:'design', category:'planning', duration:1,  deps:['dp16'], status:'not_started', plannedEnd:xl(46202) },
  { id:'dp18', name:'Signoff on 3D Design',                team:'design', category:'planning', duration:5,  deps:['dp17'], status:'not_started', plannedEnd:xl(46209), isMilestone:true },

  // ── MEP SCHEMATICS ────────────────────────────────────────────────────────
  { id:'ms1',  name:'Power Load (PLC) + SLD',              team:'mep', category:'mep', duration:7,  deps:['dp14'], status:'not_started', plannedEnd:xl(46211), priority:'P1',
    notes:'Deps: HVAC DBR, LED Screens Deck, Lighting Layout, Barrisol Layout, Glow Box Deck, Signage Deck. Drives LT Panel (45+7d=52d)' },
  { id:'ms2',  name:'Heat Load Calculation (HLC)',          team:'mep', category:'mep', duration:7,  deps:['dp14'], status:'not_started', plannedEnd:xl(46211), priority:'P1',
    notes:'Drives HVAC machine supply (45d procurement)' },
  { id:'ms3',  name:'HVAC DBR',                             team:'mep', category:'mep', duration:5,  deps:['dp14'], status:'not_started', plannedEnd:xl(46218), priority:'P1' },
  { id:'ms4',  name:'HVAC Layout',                          team:'mep', category:'mep', duration:5,  deps:['ms3'], status:'not_started', plannedEnd:xl(46225), priority:'P1',
    notes:'Drives HVAC installation (45d). Deliverables: Ducts, Copper Piping, Dampers, Grills, Split AC, Electrical Connections' },
  { id:'ms5',  name:'Lighting Layout to Vendor',            team:'mep', category:'mep', duration:3,  deps:['dp14'], status:'not_started', priority:'P2' },
  { id:'ms6',  name:'LED/TV Screen Presentation',           team:'mep', category:'mep', duration:7,  deps:['dp16'], status:'not_started', plannedEnd:xl(46239), priority:'P1',
    notes:'CRITICAL — drives External LED (45+21=66d) and Internal LED (45+10=55d). Total from now = 91d' },
  { id:'ms7',  name:'Glow Box Presentation',                team:'mep', category:'mep', duration:3,  deps:['ms6'], status:'not_started', plannedEnd:xl(46244), priority:'P2',
    notes:'Procurement: 30d + Installation: 10d = 40d' },
  { id:'ms8',  name:'Signage Docket',                       team:'mep', category:'mep', duration:3,  deps:['dp14'], status:'not_started', plannedEnd:xl(46247), priority:'P2',
    notes:'Drives external signage (30+10=40d) and internal signage (30+10=40d)' },
  { id:'ms9',  name:'PA & Music System — Vendor Scope',     team:'projects', category:'mep', duration:3, deps:['dp14'], status:'not_started', priority:'P3',
    notes:'BW Projects team to fill timeline' },
  { id:'ms10', name:'Network & CCTV Layout',                team:'projects', category:'mep', duration:3, deps:['dp14'], status:'not_started', priority:'P3' },

  // ── MEP SET 01 — Floor Conduit & Cable Tray ──────────────────────────────
  { id:'m1a',  name:'GF — Floor Conduiting Layout',         team:'mep', category:'mep', duration:2, deps:['dp14'], status:'not_started', plannedEnd:xl(46251), priority:'P1' },
  { id:'m1b',  name:'FF — Floor Conduiting Layout',         team:'mep', category:'mep', duration:2, deps:['dp14'], status:'not_started', plannedEnd:xl(46253), priority:'P1' },
  { id:'m1c',  name:'GF — Cable Tray Layout',               team:'mep', category:'mep', duration:2, deps:['m1a'], status:'not_started', priority:'P1' },
  { id:'m1d',  name:'FF — Cable Tray Layout',               team:'mep', category:'mep', duration:2, deps:['m1b'], status:'not_started', priority:'P1' },

  // ── MEP SET 02 — Fire & HVAC ─────────────────────────────────────────────
  { id:'m2a',  name:'GF — Smoke Detector Layout',           team:'mep', category:'mep', duration:3, deps:['ms4'], status:'not_started', plannedEnd:xl(46216), priority:'P1' },
  { id:'m2b',  name:'FF — Smoke Detector Layout',           team:'mep', category:'mep', duration:3, deps:['ms4'], status:'not_started', plannedEnd:xl(46216), priority:'P1' },
  { id:'m2c',  name:'GF — Fire Sprinkler Layout',           team:'mep', category:'mep', duration:2, deps:['m2a'], status:'not_started', plannedEnd:xl(46218), priority:'P1' },
  { id:'m2d',  name:'FF — Fire Sprinkler Layout',           team:'mep', category:'mep', duration:2, deps:['m2b'], status:'not_started', plannedEnd:xl(46218), priority:'P1' },
  { id:'m2e',  name:'GF — HVAC Layout (Detailed)',          team:'mep', category:'mep', duration:3, deps:['ms4'], status:'not_started', plannedEnd:xl(46258), priority:'P1' },
  { id:'m2f',  name:'FF — HVAC Layout (Detailed)',          team:'mep', category:'mep', duration:3, deps:['ms4'], status:'not_started', plannedEnd:xl(46258), priority:'P1' },

  // ── MEP SET 03 — Electrical, Lighting & IT ───────────────────────────────
  { id:'m3a',  name:'GF — Electrical Layout',               team:'mep', category:'mep', duration:4, deps:['ms1'], status:'not_started', plannedEnd:xl(46205), priority:'P1' },
  { id:'m3b',  name:'FF — Electrical Layout',               team:'mep', category:'mep', duration:4, deps:['ms1'], status:'not_started', plannedEnd:xl(46205), priority:'P1' },
  { id:'m3c',  name:'GF — Lighting Looping Layout',         team:'mep', category:'mep', duration:4, deps:['ms5'], status:'not_started', plannedEnd:xl(46262), priority:'P1' },
  { id:'m3d',  name:'FF — Lighting Looping Layout',         team:'mep', category:'mep', duration:4, deps:['ms5'], status:'not_started', plannedEnd:xl(46262), priority:'P1' },
  { id:'m3e',  name:'GF — PA & Music System Layout',        team:'mep', category:'mep', duration:3, deps:['ms9'], status:'not_started', priority:'P1' },
  { id:'m3f',  name:'FF — PA & Music System Layout',        team:'mep', category:'mep', duration:3, deps:['ms9'], status:'not_started', priority:'P1' },
  { id:'m3g',  name:'GF — CCTV Looping Layout',             team:'mep', category:'mep', duration:3, deps:['ms10'], status:'not_started', priority:'P1' },
  { id:'m3h',  name:'FF — CCTV Looping Layout',             team:'mep', category:'mep', duration:3, deps:['ms10'], status:'not_started', priority:'P1' },
  { id:'m3i',  name:'GF — IT Looping Layout',               team:'mep', category:'mep', duration:3, deps:['ms10'], status:'not_started', priority:'P1' },
  { id:'m3j',  name:'FF — IT Looping Layout',               team:'mep', category:'mep', duration:3, deps:['ms10'], status:'not_started', priority:'P1' },

  // ── CIVIL DRAWINGS SET 01 ────────────────────────────────────────────────
  { id:'c1a',  name:'GF — Furniture Layout (with Fix Code)', team:'design', category:'civil_01', duration:2, deps:['dp14'], status:'not_started', plannedEnd:xl(46266), priority:'P1' },
  { id:'c1b',  name:'FF — Furniture Layout (with Fix Code)', team:'design', category:'civil_01', duration:2, deps:['dp14'], status:'not_started', plannedEnd:xl(46268), priority:'P1' },
  { id:'c1c',  name:'GF — Drywall Layout',                   team:'design', category:'civil_01', duration:4, deps:['c1a'], status:'not_started', plannedEnd:xl(46274), priority:'P1' },
  { id:'c1d',  name:'FF — Drywall Layout',                   team:'design', category:'civil_01', duration:4, deps:['c1b'], status:'not_started', plannedEnd:xl(46280), priority:'P1' },
  { id:'c1e',  name:'GF & FF — Drywall Details',             team:'design', category:'civil_01', duration:3, deps:['c1c','c1d'], status:'not_started', priority:'P2' },
  { id:'c1f',  name:'GF — Flooring Layout',                  team:'design', category:'civil_01', duration:2, deps:['c1c'], status:'not_started', plannedEnd:xl(46282), priority:'P3',
    notes:'Conduiting layout must close first. BOQ shareable 17 Jun approx.' },
  { id:'c1g',  name:'FF — Flooring Layout',                  team:'design', category:'civil_01', duration:2, deps:['c1d'], status:'not_started', plannedEnd:xl(46286), priority:'P3' },
  { id:'c1h',  name:'GF — Ceiling Layout',                   team:'design', category:'civil_01', duration:3, deps:['m2e'], status:'not_started', priority:'P1' },
  { id:'c1i',  name:'FF — Ceiling Layout',                   team:'design', category:'civil_01', duration:3, deps:['m2f'], status:'not_started', priority:'P1' },
  { id:'c1j',  name:'GF & FF — Ceiling Details',             team:'design', category:'civil_01', duration:3, deps:['c1h','c1i'], status:'not_started', priority:'P1' },
  { id:'c1k',  name:'BOQ Set 01',                            team:'design', category:'civil_01', duration:3, deps:['c1f','c1g','c1j'], status:'not_started', priority:'P1' },

  // ── CIVIL DRAWINGS SET 02 ────────────────────────────────────────────────
  { id:'c2a',  name:'Facade Drawing',                        team:'design', category:'civil_02', duration:5, deps:['dp15'], status:'in_progress', plannedEnd:xl(46168), priority:'P1',
    notes:'Drawing shared; working drawing still awaited' },
  { id:'c2b',  name:'GF — Trial Room Details',               team:'design', category:'civil_02', duration:3, deps:['c1a'], status:'not_started', priority:'P3' },
  { id:'c2c',  name:'FF — Trial Room Details',               team:'design', category:'civil_02', duration:3, deps:['c1b'], status:'not_started', priority:'P3' },
  { id:'c2d',  name:'GF — Wall Elevations',                  team:'design', category:'civil_02', duration:4, deps:['c1a'], status:'not_started', priority:'P1' },
  { id:'c2e',  name:'FF — Wall Elevations',                  team:'design', category:'civil_02', duration:4, deps:['c1b'], status:'not_started', priority:'P1' },
  { id:'c2f',  name:'LGD Wall Details',                      team:'design', category:'civil_02', duration:3, deps:['c2d'], status:'not_started', priority:'P1' },
  { id:'c2g',  name:'LGD Section Details',                   team:'design', category:'civil_02', duration:3, deps:['c2f'], status:'not_started', priority:'P1' },
  { id:'c2h',  name:'LGD Ceiling Layout & Detail',           team:'design', category:'civil_02', duration:3, deps:['c1h'], status:'not_started', priority:'P1' },
  { id:'c2i',  name:'BOQ Set 02',                            team:'design', category:'civil_02', duration:3, deps:['c2d','c2e','c2h'], status:'not_started', priority:'P1' },

  // ── CIVIL DRAWINGS SET 03 ────────────────────────────────────────────────
  { id:'c3a',  name:'GF — Wall Elevations (Set 03)',         team:'design', category:'civil_03', duration:4, deps:['c1a'], status:'not_started', priority:'P1' },
  { id:'c3b',  name:'FF — Wall Elevations (Set 03)',         team:'design', category:'civil_03', duration:4, deps:['c1b'], status:'not_started', priority:'P1' },
  { id:'c3c',  name:'GF — Skirting Layout',                  team:'design', category:'civil_03', duration:2, deps:['c1f'], status:'not_started', priority:'P2' },
  { id:'c3d',  name:'FF — Skirting Layout',                  team:'design', category:'civil_03', duration:2, deps:['c1g'], status:'not_started', priority:'P2' },
  { id:'c3e',  name:'GF — Wall Finishes Layout',             team:'design', category:'civil_03', duration:3, deps:['c3a'], status:'not_started', priority:'P1' },
  { id:'c3f',  name:'FF — Wall Finishes Layout',             team:'design', category:'civil_03', duration:3, deps:['c3b'], status:'not_started', priority:'P1' },
  { id:'c3g',  name:'GF — Door Detail',                      team:'design', category:'civil_03', duration:2, deps:['c3a'], status:'not_started', priority:'P2' },
  { id:'c3h',  name:'FF — Door Detail',                      team:'design', category:'civil_03', duration:2, deps:['c3b'], status:'not_started', priority:'P2' },
  { id:'c3i',  name:'Stage Detail',                          team:'design', category:'civil_03', duration:3, deps:['dp18'], status:'not_started', priority:'P2' },
  { id:'c3j',  name:'Wall Elevations with Furniture',        team:'design', category:'civil_03', duration:4, deps:['c1a','c1b'], status:'not_started', priority:'P1' },
  { id:'c3k',  name:'GF — Mirror Placement Layout',          team:'design', category:'civil_03', duration:2, deps:['c1a'], status:'not_started', priority:'P2' },
  { id:'c3l',  name:'FF — Mirror Placement Layout',          team:'design', category:'civil_03', duration:2, deps:['c1b'], status:'not_started', priority:'P2' },
  { id:'c3m',  name:'GF — Signage Marking Layout',           team:'design', category:'civil_03', duration:2, deps:['ms8'], status:'not_started', priority:'P2' },
  { id:'c3n',  name:'FF — Signage Marking Layout',           team:'design', category:'civil_03', duration:2, deps:['ms8'], status:'not_started', priority:'P2' },
  { id:'c3o',  name:'BOQ Set 03',                            team:'design', category:'civil_03', duration:3, deps:['c3e','c3f','c3j'], status:'not_started', priority:'P1' },

  // ── BOQ & FIXTURES ───────────────────────────────────────────────────────
  { id:'bq1',  name:'HVAC BOQ',                              team:'mep',    category:'boq', duration:2, deps:['ms4'], status:'not_started', plannedEnd:xl(46288), priority:'P1' },
  { id:'bq2',  name:'Electrical BOQ',                        team:'mep',    category:'boq', duration:3, deps:['ms1'], status:'not_started', priority:'P1' },
  { id:'bq3',  name:'Sprinkler BOQ',                         team:'mep',    category:'boq', duration:2, deps:['m2c','m2d'], status:'not_started', priority:'P1' },
  { id:'bq4',  name:'Fire BOQ',                              team:'mep',    category:'boq', duration:2, deps:['m2a','m2b'], status:'not_started', priority:'P1' },
  { id:'bq5',  name:'Fixture BOQ',                           team:'design', category:'boq', duration:3, deps:['c1a','c1b'], status:'not_started', plannedEnd:xl(46293), priority:'P0',
    notes:'Share 70% common fixtures from Bandra & Pune as BOQ basis current layout. FSA deliverable: ' + xl(46169) },
  { id:'bq6',  name:'Truss Detail Docket',                   team:'design', category:'boq', duration:5, deps:['c1h','c1i'], status:'not_started', priority:'P1' },

  // ── WASHROOM DRAWINGS — Civil Set ─────────────────────────────────────────
  { id:'wr1',  name:'Washroom — Brick Work Layout',          team:'design', category:'washroom', duration:2, deps:[], status:'done', plannedEnd:xl(46162) },
  { id:'wr2',  name:'Washroom — Flooring Layout',            team:'design', category:'washroom', duration:2, deps:['wr1'], status:'not_started', plannedEnd:xl(46168) },
  { id:'wr3',  name:'Washroom — Wall Finishes',              team:'design', category:'washroom', duration:2, deps:['wr1'], status:'not_started', plannedEnd:xl(46168) },
  { id:'wr4',  name:'Washroom — Ceiling Layout',             team:'design', category:'washroom', duration:2, deps:['wr2'], status:'not_started', plannedEnd:xl(46169) },
  { id:'wr5',  name:'Washroom — Elevations & Sections',      team:'design', category:'washroom', duration:2, deps:['wr3'], status:'not_started', plannedEnd:xl(46170) },
  { id:'wr6',  name:'Washroom — Door Details',               team:'design', category:'washroom', duration:1, deps:['wr5'], status:'not_started', plannedEnd:xl(46170) },
  { id:'wr7',  name:'Washroom — Selection of Sanitary Fittings', team:'design', category:'washroom', duration:1, deps:['wr1'], status:'done', plannedEnd:xl(46169) },
  { id:'wr8',  name:'Washroom — Partition Details',          team:'design', category:'washroom', duration:1, deps:['wr5'], status:'not_started', plannedEnd:xl(46170) },
  // MEP Set
  { id:'wr9',  name:'Washroom — Drainage Layout',            team:'mep', category:'washroom', duration:2, deps:['wr1'], status:'done', plannedEnd:xl(46167) },
  { id:'wr10', name:'Washroom — Water Supply Layout',        team:'mep', category:'washroom', duration:2, deps:['wr1'], status:'done', plannedEnd:xl(46167) },
  { id:'wr11', name:'Washroom — Electrical Layout',          team:'mep', category:'washroom', duration:2, deps:['wr4'], status:'not_started', plannedEnd:xl(46168) },
  { id:'wr12', name:'Washroom — 3D Model + Presentation',   team:'design', category:'washroom', duration:3, deps:['wr5'], status:'done', plannedEnd:xl(46164) },

  // ── CIVIL & INTERIOR WORKS (WBS) ─────────────────────────────────────────
  // Durations = procurement + installation as per Summary WBS sheet
  { id:'wc1',  name:'Flooring (21d proc + 40d install = 61d total)', team:'projects', category:'wbs_civil', duration:61, deps:['c1f','c1g','m1a','m1b'], procDays:21, installDays:40, targetStart:'2026-06-10', execStart:'2026-07-01', plannedEnd:'2026-08-10', fsaDate:'2026-06-10', status:'not_started', priority:'P1',
    plannedEnd:xl(46244),
    notes:'Rs.150/sqft paid by LL. Deps: Furniture Layout, Floor Conduit, Wall Fixture Elevations, Elec Points on Columns, Plumbing Layout, RCP Layout, SIS MEP Drawings, Metal Ceiling Truss, Active LED Ticker, Lighting Layout, Barrisol Layout. Share basis 70% approx for procurement' },
  { id:'wc2',  name:'Facade Canopy Fabrication (7d proc + 30d install = 37d)', team:'projects', category:'wbs_civil', duration:37, deps:['c2a'], procDays:7, installDays:30, targetStart:'2026-06-13', execStart:'2026-06-20', plannedEnd:'2026-07-20', fsaDate:'2026-06-11', status:'not_started', priority:'P1',
    plannedEnd:xl(46223),
    notes:'Deps: Facade Elevation, Electrical Drawing, Data Drawing, Metal Structure Drawing. FSA deliverable: ' + xl(46184) },
  { id:'wc3',  name:'Glass Railing (55d proc + 14d install = 69d total)', team:'projects', category:'wbs_civil', duration:69, deps:['dp18'], procDays:55, installDays:14, targetStart:'2026-08-10', execStart:'2026-10-04', plannedEnd:'2026-10-18', fsaDate:'2026-08-19', status:'not_started', priority:'P2',
    plannedEnd:xl(46313),
    notes:'Deps: Glass Railing Layout, C/S or Elevation, Material Specification. FSA deliverable: ' + xl(46253) },
  { id:'wc4',  name:'Toilet Finishing Items (30d proc + 14d install = 44d)', team:'projects', category:'wbs_civil', duration:44, deps:['wr4'], procDays:30, installDays:14, targetStart:'2026-06-20', execStart:'2026-07-20', plannedEnd:'2026-08-02', fsaDate:'2026-06-19', status:'not_started', priority:'P2',
    plannedEnd:xl(46236),
    notes:'Deps: GFC, Finishing Items Layout, HVAC, Plumbing, RCP. Target handover: 16 June. FSA: ' + xl(46192) },
  { id:'wc5',  name:'Landscape Work (7d proc + 14d install = 21d)', team:'projects', category:'wbs_civil', duration:21, deps:['dp18'], procDays:7, installDays:14, targetStart:'2026-08-27', execStart:'2026-09-03', plannedEnd:'2026-09-17', fsaDate:'2026-08-20', status:'not_started', priority:'P3',
    plannedEnd:xl(46282),
    notes:'Deps: Landscape Drawings + BOQ, Electrical Connections, Plumbing provision, Foot Lamp Provisions. FSA: ' + xl(46254) },

  // ── INTERIOR WORKS (WBS) ─────────────────────────────────────────────────
  { id:'wi1',  name:'Special Elements — Metal Ceiling Truss (30d proc + 14d install = 44d)', team:'projects', category:'wbs_int', duration:44, deps:['bq6'], procDays:30, installDays:14, targetStart:'2026-07-12', execStart:'2026-08-11', plannedEnd:'2026-09-24', fsaDate:'2026-06-28', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Truss Docket, RCP Layout. FSA deliverable: ' + xl(46201) },
  { id:'wi2',  name:'Dry Partition & Wall Cladding (14d proc + 45d install = 45d)', team:'projects', category:'wbs_int', duration:45, deps:['c1c','c1d'], procDays:14, installDays:45, targetStart:'2026-06-05', execStart:'2026-06-19', plannedEnd:'2026-08-03', fsaDate:'2026-06-05', status:'not_started', priority:'P1',
    plannedEnd:xl(46237),
    notes:'Target: 20 June. Deps: Wall Cladding Drawing, Elevations, Dry Partition Drawing. FSA: ' + xl(46178) },
  { id:'wi3',  name:'Main Entrance Portal (14d proc + 45d install = 45d)', team:'projects', category:'wbs_int', duration:45, deps:['dp18'], procDays:14, installDays:45, targetStart:'2026-07-27', execStart:'2026-08-10', plannedEnd:'2026-09-24', fsaDate:'2026-07-20', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Air Curtain, Sliding Glass Door, RFID, Finishing Item Drawing. FSA: ' + xl(46223) },
  { id:'wi4',  name:'Finishing Items — Paint + Special (14d proc + 45d install = 45d)', team:'projects', category:'wbs_int', duration:45, deps:['c3e','c3f'], procDays:14, installDays:45, targetStart:'2026-07-20', execStart:'2026-08-03', plannedEnd:'2026-09-17', fsaDate:'2026-07-13', status:'not_started', priority:'P2',
    plannedEnd:xl(46282),
    notes:'Final finishing details will decide actual timelines. Deps: Finishing Items Layout. FSA: ' + xl(46216) },
  { id:'wi5',  name:'LGD Entrance Portal — PVD Cladding (21d proc + 3d install = 24d)', team:'projects', category:'wbs_int', duration:24, deps:['c2f'], procDays:21, installDays:3, targetStart:'2026-08-03', execStart:'2026-08-24', plannedEnd:'2026-08-27', fsaDate:'2026-07-04', status:'not_started', priority:'P1',
    plannedEnd:xl(46261),
    notes:'Deps: PVD Details, Elevation Drawing, Joinery Details. FSA: ' + xl(46207) },
  { id:'wi6',  name:'POP + Putty + Internal Painting (14d proc + 45d install = 45d)', team:'projects', category:'wbs_int', duration:45, deps:['wi1'], procDays:14, installDays:45, targetStart:'2026-07-20', execStart:'2026-08-03', plannedEnd:'2026-09-17', fsaDate:'2026-06-20', status:'not_started', priority:'P1',
    plannedEnd:xl(46282),
    notes:'Start only after: All Ceiling MEP Works, Metal Truss, Barrisol Lights, Light Fixture Supports, Ticker LED. FSA: ' + xl(46193) },
  { id:'wi7',  name:'Toilet Modular Partition (30d proc + 7d install = 37d)', team:'projects', category:'wbs_int', duration:37, deps:['wr9','wr10'], procDays:30, installDays:7, plannedEnd:'2026-09-08', status:'not_started', priority:'P2',
    plannedEnd:xl(46273),
    notes:'Deps: Plumbing Layout, Sanitary Fittings Details, C&I Carpentry + Finishing Drawing, Electrical/Lighting Layout, HVAC Layout' },

  // ── ELECTRICAL (WBS) ─────────────────────────────────────────────────────
  { id:'we1',  name:'LT Panel + Harmonic + DB (45d proc + 7d install = 52d)', team:'projects', category:'wbs_elec', duration:52, deps:['ms1'], procDays:45, installDays:7, targetStart:'2026-08-03', execStart:'2026-09-17', plannedEnd:'2026-09-24', fsaDate:'2026-06-19', status:'not_started', priority:'P0',
    plannedEnd:xl(46289),
    notes:'TARGET: 16 June. Deps: Electrical Load, SLD. Main power cable provided to LT Panel room by LL; BRDW installs panel. FSA: ' + xl(46192) },
  { id:'we2',  name:'DG Set (45d proc + 7d install = 52d)', team:'projects', category:'wbs_elec', duration:52, deps:['ms1'], procDays:45, installDays:7, targetStart:'2026-08-03', execStart:'2026-09-17', plannedEnd:'2026-09-24', fsaDate:'2026-06-19', status:'not_started', priority:'P0',
    plannedEnd:xl(46289),
    notes:'TARGET: 16 June. Deps: Electrical Load, SLD. DG capacity to be shared by BRDW. FSA: ' + xl(46192) },
  { id:'we3',  name:'UPS (30d proc + 3d install = 33d)', team:'projects', category:'wbs_elec', duration:33, deps:['ms1'], procDays:30, installDays:3, targetStart:'2026-08-22', execStart:'2026-09-21', plannedEnd:'2026-09-24', fsaDate:'2026-07-08', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: SLD, Lighting Layout, IT Layout, HVAC Drainage Pump. FSA: ' + xl(46211) },
  { id:'we4',  name:'HVAC High Side Electrical Cabling & Earthing (7d proc + 14d install = 21d)', team:'projects', category:'wbs_elec', duration:21, deps:['ms4'], procDays:7, installDays:14, status:'not_started', priority:'P1',
    notes:'Deps: Cable Specification, Electrical Panel Schedule from OEM' },

  // ── HVAC (WBS) ───────────────────────────────────────────────────────────
  { id:'wh1',  name:'Supply of High Side HVAC Machines (45d procurement)', team:'projects', category:'wbs_hvac', duration:45, deps:['ms3','ms2'], procDays:45, installDays:0, targetStart:'2026-06-26', plannedEnd:'2026-08-10', fsaDate:'2026-06-13', status:'not_started', priority:'P0',
    plannedEnd:xl(46244),
    notes:'TARGET: 16 June. Deps: DBR, Heat Load, Layout, Technical BOQ. FSA: ' + xl(46186) + '. Planned start: ' + xl(46189) },
  { id:'wh2',  name:'HVAC Installation — Low Side (Copper Piping, Grills, Exhaust, Fresh Air = 45d)', team:'projects', category:'wbs_hvac', duration:45, deps:['wh1','ms4'], procDays:0, installDays:45, targetStart:'2026-06-26', execStart:'2026-08-10', plannedEnd:'2026-09-24', fsaDate:'2026-06-13', status:'not_started', priority:'P0',
    plannedEnd:xl(46289),
    notes:'TARGET: 16 June. Deps: HVAC Layout, Technical BOQ, Electrical Power Supply Details. Execution start: ' + xl(46244) },

  // ── PLUMBING (WBS) ───────────────────────────────────────────────────────
  { id:'wp1',  name:'Washroom — Sanitary Fixtures & Faucets (30d proc + 7d install = 37d)', team:'projects', category:'wbs_plumb', duration:37, deps:['wr9','wr10','wr7'], procDays:30, installDays:7, targetStart:'2026-08-18', execStart:'2026-09-17', plannedEnd:'2026-09-24', fsaDate:'2026-07-19', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Plumbing Layout, Sanitary Fittings Details, C&I Carpentry + Finishing Drawing, Electrical/Lighting Layout, HVAC Layout, Toilet Cubicle Details. FSA: ' + xl(46222) },

  // ── FIRE FIGHTING (WBS) ──────────────────────────────────────────────────
  { id:'wf1',  name:'Sprinkler + Smoke Detectors (14d proc + 7d install = 21d)', team:'projects', category:'wbs_fire', duration:21, deps:['m2c','m2d'], procDays:14, installDays:7, targetStart:'2026-09-10', execStart:'2026-09-17', plannedEnd:'2026-09-24', fsaDate:'2026-07-12', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Sprinkler Layout, RCP, False Ceiling Layout. FSA: ' + xl(46215) },
  { id:'wf2',  name:'Fire Alarm System (21d proc + 7d install = 28d)', team:'projects', category:'wbs_fire', duration:28, deps:['m2a','m2b'], procDays:21, installDays:7, targetStart:'2026-08-27', execStart:'2026-09-17', plannedEnd:'2026-09-24', fsaDate:'2026-07-12', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: FAS Drawing (SD + RI). FSA: ' + xl(46215) },
  { id:'wf3',  name:'RF/RFID Antennas (21d proc + 3d install = 24d)', team:'projects', category:'wbs_fire', duration:24, deps:['m3i','m3j'], procDays:21, installDays:3, targetStart:'2026-08-31', execStart:'2026-09-21', plannedEnd:'2026-09-24', status:'not_started', priority:'P2',
    plannedEnd:xl(46289),
    notes:'Deps: Furniture Layout, Electrical Layout, Data Layout' },

  // ── FURNITURE & FIXTURES (WBS) ───────────────────────────────────────────
  { id:'wff1', name:'Furniture Fixtures + Loose Furniture SPIN (75d proc + 45d install = 120d)', team:'design', category:'wbs_fnf', duration:120, deps:['bq5'], procDays:75, installDays:45, targetStart:'2026-05-27', execStart:'2026-08-10', plannedEnd:'2026-09-24', fsaDate:'2026-05-27', status:'not_started', priority:'P0',
    plannedEnd:xl(46289),
    notes:'⚠️ LONGEST LEAD ITEM OVERALL. Deps: Electrical Layout, Wall Elevation mapped with Furniture Elevation, Tiling, Wall Paint, Wall Finishing Cladding, RCP Layout, Driver Locations, Ply Support from Ceiling, Final Furniture Layout, BOQ, Complete Fixture Drawing Docket, Complete Shop Drawing Docket from EFPL. FSA: ' + xl(46169) + '. Execution start: ' + xl(46244) },

  // ── FUNCTIONAL LIGHTING (WBS) ────────────────────────────────────────────
  { id:'wl1',  name:'Track Mounted Linear Downlights + Special Lights (30d proc + 14d install = 44d)', team:'projects', category:'wbs_light', duration:44, deps:['m3c','m3d'], procDays:30, installDays:14, targetStart:'2026-08-11', execStart:'2026-09-10', plannedEnd:'2026-09-24', fsaDate:'2026-07-12', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Lighting Layout incl. Barrisol/Special Lights, RCP, C/S Drawing, BOQ. FSA: ' + xl(46215) },

  // ── SIGNAGE (WBS) ────────────────────────────────────────────────────────
  { id:'ws1',  name:'External Signages (30d proc + 10d install = 40d)', team:'projects', category:'wbs_sign', duration:40, deps:['ms8','c2a'], procDays:30, installDays:10, targetStart:'2026-07-25', execStart:'2026-08-24', plannedEnd:'2026-09-03', fsaDate:'2026-07-11', status:'not_started', priority:'P1',
    plannedEnd:xl(46268),
    notes:'Deps: Signage Docket (height from floor, exact location), Facade Elevation incl. signages, Electrical Layout (power supply points). FSA: ' + xl(46214) },
  { id:'ws2',  name:'Internal Signages (30d proc + 10d install = 40d)', team:'projects', category:'wbs_sign', duration:40, deps:['ms8','c3m','c3n'], procDays:30, installDays:10, targetStart:'2026-08-15', execStart:'2026-09-14', plannedEnd:'2026-09-24', fsaDate:'2026-08-01', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Signage Docket, Internal Elevation incl. signages, Electrical Layout. FSA: ' + xl(46235) },

  // ── VIDEO & MEDIA (WBS) ──────────────────────────────────────────────────
  { id:'wm1',  name:'Internal LED Screens — Straight (45d proc + 10d install = 55d)', team:'projects', category:'wbs_media', duration:55, deps:['ms6'], procDays:45, installDays:10, targetStart:'2026-07-31', execStart:'2026-09-14', plannedEnd:'2026-09-24', fsaDate:'2026-07-17', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'Deps: Ticker LED + Straight LED Docket, Power supply requirements, Data cable requirements, Drawing + Location in layout + Elevation/C/S Drawing. FSA: ' + xl(46220) },
  { id:'wm2',  name:'External LED Screens / Ticker (45d proc + 21d install = 66d)', team:'projects', category:'wbs_media', duration:66, deps:['ms6'], procDays:45, installDays:21, targetStart:'2026-07-20', execStart:'2026-09-03', plannedEnd:'2026-09-24', fsaDate:'2026-07-06', status:'not_started', priority:'P1',
    plannedEnd:xl(46289),
    notes:'⚠️ CRITICAL LEAD ITEM. FSA: ' + xl(46209) + '. Procurement start: ' + xl(46223) },
  { id:'wm3',  name:'TV Screens (7d proc + 3d install = 10d)', team:'projects', category:'wbs_media', duration:10, deps:['m3a','m3b'], procDays:7, installDays:3, targetStart:'2026-09-14', execStart:'2026-09-21', plannedEnd:'2026-09-24', fsaDate:'2026-08-31', status:'not_started', priority:'P3',
    plannedEnd:xl(46289),
    notes:'FSA: ' + xl(46265) },

  // ── AUDIO & MUSIC (WBS) ──────────────────────────────────────────────────
  { id:'wa1',  name:'Music System (21d proc + 3d install = 24d)', team:'projects', category:'wbs_audio', duration:24, deps:['ms9','m3e','m3f'], procDays:21, installDays:3, targetStart:'2026-08-23', execStart:'2026-09-13', plannedEnd:'2026-09-16', fsaDate:'2026-08-09', status:'not_started', priority:'P2',
    plannedEnd:xl(46281),
    notes:'Deps: Final Fixture & Furniture Layout, Technical + Speaker locations from Music Vendor. FSA: ' + xl(46243) },

  // ── IT (WBS) ─────────────────────────────────────────────────────────────
  { id:'wit1', name:'POS & Scanner + Server Rack + Camera Poles', team:'store', category:'wbs_it', duration:30, deps:['m3i','m3j'], status:'not_started', priority:'P1',
    notes:'IT team to confirm procurement and installation durations' },

  // ── LAUNCH MILESTONE ─────────────────────────────────────────────────────
  { id:'LAUNCH', name:'🎯 STORE LAUNCH — BROADWAY MODEL TOWN', team:'admin', category:'milestone', duration:0, isMilestone:true,
    deps:['wc1','wc2','wi1','wi2','wi3','wi4','wi6','we1','we2','wh1','wh2','wp1','wf1','wf2','wff1','wl1','ws1','ws2','wm1','wm2','wit1','bq5','c3o'] },
];
