
'use strict';
// ═══════════════════════════════════════
//  DATA
// ═══════════════════════════════════════
let ROLE = 'Admin', UNAME = 'admin.dela_cruz';

const DOCS = [
  {id:'DOC-2025-0891',title:'Iloilo City Supplemental Budget 2025-Q2',src:'Iloilo City',cat:'Budget & Finance',date:'2025-02-14',status:'active',size:'2.4 MB',pages:12,ocr:'Supplemental Budget Resolution No. 2025-SB-042\nAmount: PHP 45,234,000.00\nPurpose: Capital Outlay for Infrastructure Projects\nApproved by: City Council, February 10, 2025'},
  {id:'DOC-2025-0890',title:'Resolution No. 2025-089 Road Infrastructure',src:'Province of Iloilo',cat:'Resolutions',date:'2025-02-13',status:'processing',size:'1.8 MB',pages:4,ocr:'RESOLUTION NO. 2025-089\nSeries of 2025\nWHEREAS the Sangguniang Panlalawigan has deliberated upon matters pertaining to road infrastructure improvements in the province...'},
  {id:'DOC-2025-0889',title:'Barangay Ordinance Series 2025 — Waste Management',src:'Municipality of Oton',cat:'Ordinances',date:'2025-02-12',status:'active',size:'3.1 MB',pages:8,ocr:'ORDINANCE NO. 2025-03\nAn ordinance establishing a comprehensive solid waste management program...\nSection 1: This ordinance shall be known as the Oton Solid Waste Management Ordinance of 2025.'},
  {id:'DOC-2025-0888',title:'Administrative Order No. 14 — Personnel Guidelines',src:'Province of Iloilo',cat:'Administrative',date:'2025-02-11',status:'active',size:'1.2 MB',pages:6,ocr:'ADMINISTRATIVE ORDER NO. 14\nSeries of 2025\nSUBJECT: Guidelines on Work-from-Home Arrangements for Provincial Government Employees...'},
  {id:'DOC-2025-0887',title:'Building Permit Application Batch Feb 2025',src:'Municipality of Pavia',cat:'Permits',date:'2025-02-10',status:'active',size:'5.7 MB',pages:24,ocr:'BUILDING PERMIT APPLICATIONS\nBatch Reference: BP-PAV-2025-FEB\nTotal Applications: 24\nProcessed by: Pavia Engineering Office...'},
  {id:'DOC-2025-0886',title:'Correspondence — DILG Compliance Report',src:'Municipality of Leganes',cat:'Correspondence',date:'2025-02-09',status:'pending',size:'0.9 MB',pages:3,ocr:'Re: Full Disclosure Policy Compliance Report Q4 2024\nTo: DILG Regional Office VI\nThis office certifies compliance with RA 9184...'},
  {id:'DOC-2024-0712',title:'Annual Financial Report FY 2024',src:'Iloilo City',cat:'Budget & Finance',date:'2025-01-15',status:'archived',size:'8.2 MB',pages:56,ocr:'ANNUAL FINANCIAL REPORT\nFiscal Year 2024\nIloilo City Government\nTotal Revenue: PHP 2,345,678,000.00\nTotal Expenditure: PHP 2,112,344,000.00'},
  {id:'DOC-2024-0701',title:'Resolution No. 2024-201 Environmental Protection',src:'Province of Iloilo',cat:'Resolutions',date:'2025-01-10',status:'archived',size:'1.5 MB',pages:5,ocr:'RESOLUTION NO. 2024-201\nRESOLUTION APPROVING THE PROVINCIAL ENVIRONMENTAL MANAGEMENT PLAN 2024-2029...'},
  {id:'DOC-2023-0145',title:'Budget Execution Report FY 2023',src:'Province of Iloilo',cat:'Budget & Finance',date:'2024-03-01',status:'archived',size:'4.3 MB',pages:32,ocr:'BUDGET EXECUTION REPORT\nFiscal Year 2023\nProvince of Iloilo...'},
];

const USERS = [
  {id:1,name:'Juan Dela Cruz',user:'admin.dela_cruz',dept:'PSED — Admin Office',role:'Admin',email:'jdc@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#ef4444,#b91c1c)',ini:'JD',perms:['Upload','Edit','Delete','View','Archive','Manage Users','Requirements']},
  {id:2,name:'Maria Santos',user:'maria.santos',dept:'Budget & Finance',role:'Staff',email:'ms@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#0ea5e9,#0369a1)',ini:'MS',perms:['Upload','Edit','View','Archive','Submit Compliance']},
  {id:3,name:'Pedro Garcia',user:'pedro.garcia',dept:'Legal Division',role:'Staff',email:'pg@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#10b981,#047857)',ini:'PG',perms:['Upload','Edit','View','Archive','Submit Compliance']},
  {id:4,name:'Ana Reyes',user:'ana.reyes',dept:'Records Division',role:'Viewer',email:'ar@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#64748b,#334155)',ini:'AR',perms:['View','Download']},
  {id:5,name:'Luis Mendoza',user:'luis.mendoza',dept:'ICT Division',role:'Admin',email:'lm@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#8b5cf6,#6d28d9)',ini:'LM',perms:['Upload','Edit','Delete','View','Archive','Manage Users','Requirements']},
  {id:6,name:'Rosa Bautista',user:'rosa.bautista',dept:'Planning Office',role:'Viewer',email:'rb@psed.gov.ph',status:'Active',av:'linear-gradient(135deg,#f59e0b,#b45309)',ini:'RB',perms:['View','Download']},
];

const LOGS = [
  {act:'Uploaded DOC-2025-0891',usr:'maria.santos',type:'Upload',time:'2025-02-15 09:12',ico:'📤',bg:'rgba(14,165,233,.14)'},
  {act:'Downloaded DOC-2024-0712 (Annual Report)',usr:'pedro.garcia',type:'Download',time:'2025-02-15 08:54',ico:'📥',bg:'rgba(16,185,129,.14)'},
  {act:'Viewed DOC-2025-0890 (Resolution)',usr:'ana.reyes',type:'View',time:'2025-02-15 08:30',ico:'👁',bg:'rgba(100,116,139,.14)'},
  {act:'Archived DOC-2024-0701',usr:'admin.dela_cruz',type:'Archive',time:'2025-02-14 17:22',ico:'📦',bg:'rgba(245,158,11,.14)'},
  {act:'User login: rosa.bautista',usr:'rosa.bautista',type:'Login',time:'2025-02-14 16:45',ico:'🔑',bg:'rgba(139,92,246,.14)'},
  {act:'Deleted DOC-2023-0112 (Expired)',usr:'admin.dela_cruz',type:'Delete',time:'2025-02-14 15:10',ico:'🗑',bg:'rgba(239,68,68,.14)'},
  {act:'OCR Completed for DOC-2025-0889',usr:'SYSTEM',type:'Upload',time:'2025-02-14 14:33',ico:'🔎',bg:'rgba(14,165,233,.1)'},
  {act:'Edited metadata DOC-2025-0888',usr:'luis.mendoza',type:'Upload',time:'2025-02-14 13:05',ico:'✏️',bg:'rgba(139,92,246,.1)'},
  {act:'Downloaded DOC-2025-0887',usr:'pedro.garcia',type:'Download',time:'2025-02-14 11:44',ico:'📥',bg:'rgba(16,185,129,.14)'},
  {act:'New user added: Rosa Bautista',usr:'admin.dela_cruz',type:'Upload',time:'2025-02-13 10:20',ico:'👤',bg:'rgba(14,165,233,.1)'},
];

const OCR_Q = [
  {id:'DOC-2025-0890',title:'Resolution No. 2025-089 Road Infrastructure',src:'Province of Iloilo',date:'2025-02-13',status:'processing',prog:67,acc:'—'},
  {id:'DOC-2025-0892',title:'Municipal Finance Statement Q1',src:'Municipality of Zarraga',date:'2025-02-15',status:'pending',prog:0,acc:'—'},
  {id:'DOC-2025-0893',title:'Barangay Assembly Minutes Feb',src:'Iloilo City',date:'2025-02-15',status:'pending',prog:0,acc:'—'},
  {id:'DOC-2025-0894',title:'Contract for Road Widening Project',src:'Province of Iloilo',date:'2025-02-14',status:'failed',prog:0,acc:'—'},
  {id:'DOC-2025-0895',title:'Health Certificate Batch February',src:'Municipality of Cabatuan',date:'2025-02-14',status:'failed',prog:0,acc:'—'},
];

let REQS = [
  {id:'REQ-2025-001',title:'Quarterly Budget Execution Report Q1 2025',cat:'Financial',pri:'High',deadline:'2025-03-31',assignedTo:'maria.santos',assignedName:'Maria Santos',desc:'Submit the complete Budget Execution Report (BER) for Q1 2025 covering January to March. Include all obligated amounts, disbursements, and unreleased allotments. Attach certified copies of all supporting documents.',docTypes:['Budget Execution Report','Disbursement Voucher','SARO','Allotment Release Order'],reminder:'all',status:'pending',subs:[{docId:'DOC-2025-0887',title:'Partial BER Q1 Draft',type:'Budget Execution Report',by:'maria.santos',at:'2025-02-20',status:'rejected',remarks:'Incomplete — missing SARO attachment.'}]},
  {id:'REQ-2025-002',title:'Annual Compliance Report — RA 9184 Procurement',cat:'Compliance',pri:'High',deadline:'2025-02-28',assignedTo:'pedro.garcia',assignedName:'Pedro Garcia',desc:'Submit the Annual Procurement Compliance Report as required under RA 9184 and its IRR. Include all BAC resolutions, procurement activities, and PhilGEPS postings for CY 2024.',docTypes:['BAC Resolution','PhilGEPS Posting Proof','Procurement Monitoring Report','Annual Procurement Plan'],reminder:'all',status:'overdue',subs:[]},
  {id:'REQ-2025-003',title:'Organizational Performance Indicator Framework (OPIF)',cat:'Administrative',pri:'Medium',deadline:'2025-04-15',assignedTo:'maria.santos',assignedName:'Maria Santos',desc:'Submit the updated OPIF targets and accomplishments for FY 2024. Coordinate with the Planning Office for data consolidation. Use the prescribed DBM format.',docTypes:['OPIF Form','Accomplishment Report','Planning Data Sheet'],reminder:'7',status:'pending',subs:[]},
  {id:'REQ-2025-004',title:'Full Disclosure Policy — Q4 2024 Posting',cat:'Legal',pri:'Medium',deadline:'2025-01-31',assignedTo:'pedro.garcia',assignedName:'Pedro Garcia',desc:'Post and submit proof of compliance with the Full Disclosure Policy (FDP) for Q4 2024. All required documents must be posted on the LGU website and submitted to DILG.',docTypes:['FDP Compliance Certification','Website Screenshot','Transmittal Letter'],reminder:'3',status:'approved',subs:[{docId:'DOC-2025-0886',title:'FDP Q4 2024 Compliance Package',type:'FDP Compliance Certification',by:'pedro.garcia',at:'2025-01-28',status:'approved',remarks:'Complete and compliant.'}]},
  {id:'REQ-2025-005',title:'Monthly Financial Report — January 2025',cat:'Reports',pri:'Low',deadline:'2025-02-15',assignedTo:'maria.santos',assignedName:'Maria Santos',desc:'Submit the Monthly Financial Report (MFR) for January 2025 using the prescribed COA format. Include trial balance and bank reconciliation statement.',docTypes:['Monthly Financial Report','Trial Balance','Bank Reconciliation Statement'],reminder:'1',status:'submitted',subs:[{docId:'DOC-2025-0888',title:'MFR January 2025',type:'Monthly Financial Report',by:'maria.santos',at:'2025-02-14',status:'submitted',remarks:'Submitted on time, awaiting PSED review.'}]},
];

let NOTIFS = [
  {txt:'OCR Processing complete for DOC-2025-0891',time:'2 min ago',col:'var(--accent)'},
  {txt:'New document uploaded by Maria Santos',time:'18 min ago',col:'var(--accent)'},
  {txt:'DOC-2023-0145 approaching retention limit',time:'1 hr ago',col:'var(--yellow)'},
];

// State
let curDocId=null,curReqId=null,editReqId=null,editUserId=null,confirmCB=null,vrFile=null,selFile=null;
let archTab='all',archSort='desc',archPage=1;
let srchRes=[],srchPage=1,logsPage=1;
const PP=5,LP=8,AP=6;

// ═══════════════════════════════════════
//  LOGIN
// ═══════════════════════════════════════
function pickRole(el,role){document.querySelectorAll('.role-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active'); ROLE=role;
  const hints={Admin:'admin.dela_cruz',Staff:'maria.santos',Viewer:'ana.reyes'};
  document.getElementById('lusr').value=hints[role];
}
function doLogin(){
  const u=document.getElementById('lusr').value.trim(), p=document.getElementById('lpwd').value.trim();
  if(!u||!p){document.getElementById('loginErr').style.display='block';return;}
  UNAME=u;
  document.getElementById('loginErr').style.display='none';
  document.getElementById('loginWrap').style.transition='opacity .4s';
  document.getElementById('loginWrap').style.opacity='0';
  addLog(`Login: ${u}`,u,'Login','🔑','rgba(139,92,246,.14)');
  setTimeout(()=>{

    $.ajax({
      url:'process/loginProcess.php ?u='+encodeURIComponent(u)+'&p='+encodeURIComponent(p)+'&r='+encodeURIComponent(ROLE),
      method:'GET',
      success:function(data){
        document.getElementById('loginWrap').style.display='none';
        document.getElementById('app').style.display='block';initApp();
        const res=JSON.parse(data);

        if(res.success){
          toast('✅','Login Successful',`Welcome back, ${UNAME.split('.')[0].toUpperCase()}!`);
        } else {
          toast('⚠️','Login Failed',res.message||'Invalid credentials or role. Please try again.');
          // Reset to login state
          document.getElementById('loginWrap').style.display='block';
          document.getElementById('app').style.display='none';
        }
      }
    });
  },400);
}
function confirmLogout(){
  showConfirm('Sign Out','⬅️','Are you sure you want to sign out?',()=>{
    addLog(`Logout: ${UNAME}`,UNAME,'Logout','🚪','rgba(100,116,139,.1)');
    location.reload();
  });
}

// ═══════════════════════════════════════
//  INIT & PERMISSIONS
// ═══════════════════════════════════════
function initApp(){
  const ini=UNAME.split('.').map(s=>s[0].toUpperCase()).join('').slice(0,2);
  const roleColors={Admin:'linear-gradient(135deg,#ef4444,#b91c1c)',Staff:'linear-gradient(135deg,#0ea5e9,#0369a1)',Viewer:'linear-gradient(135deg,#64748b,#334155)'};
  const roleLabels={Admin:'Administrator',Staff:'Staff — Agency',Viewer:'Viewer'};
  document.getElementById('sbAv').style.background=roleColors[ROLE];
  document.getElementById('sbAv').textContent=ini;
  document.getElementById('sbName').textContent=UNAME.replace('.',' ').replace(/\b\w/g,c=>c.toUpperCase());
  document.getElementById('sbRole').textContent=roleLabels[ROLE];
  document.getElementById('sbRole').style.color=ROLE==='Admin'?'var(--red)':ROLE==='Staff'?'var(--accent)':'var(--text3)';

  applyPermissions();
  buildAll();
}

function applyPermissions(){
  const isAdmin=ROLE==='Admin', isViewer=ROLE==='Viewer', isStaff=ROLE==='Staff';
  // Nav visibility — unified sidebar, just hide what's not allowed
  if(isViewer){
    ['n-upload','n-ocr','n-access','n-logs','n-requirements'].forEach(id=>{
      const el=document.getElementById(id); if(el) el.style.display='none';
    });
    document.getElementById('tbUploadBtn').style.display='none';
  }
  if(isStaff){
    document.getElementById('n-access').style.display='none';
    document.getElementById('n-logs').style.display='none';
  }
  if(!isAdmin){
    // hide admin-only elements in settings after build
  }
  // Dashboard header action button
  const da=document.getElementById('dash-acts');
  if(da && !isViewer) da.innerHTML=`<button class="btn-add" onclick="nav('upload')">+ Upload Document</button>`;
  // Dashboard new button
  const nb=document.getElementById('dash-new-btn');
  if(nb) nb.style.display=isViewer?'none':'';
}

const PAGE_TITLES={dashboard:'Dashboard',upload:'Upload Document',search:'Search & Retrieve',requirements:'Requirements & Compliance',ocr:'OCR Queue',archive:'Document Archive',access:'Access Control',logs:'Activity Logs',settings:'Settings'};
const BLOCKED={Viewer:['upload','ocr','access','logs','requirements'],Staff:['access','logs']};

function nav(id){
  const blk=BLOCKED[ROLE]||[];
  if(blk.includes(id)){toast('🚫','Access Restricted',`The ${ROLE} role does not have access to ${PAGE_TITLES[id]||id}`);return;}
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg=document.getElementById('pg-'+id); if(pg) pg.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  const ni=document.getElementById('n-'+id); if(ni) ni.classList.add('active');
  document.getElementById('tbTitle').textContent=PAGE_TITLES[id]||id;
  closeNotif();
  if(id==='search') setTimeout(()=>document.getElementById('searchInp').focus(),80);
}
function refreshCurrent(){toast('↺','Refreshed','Page data updated');}

function buildAll(){
  buildBarChart(); buildDonut(); buildDashTable(); buildDashStats();
  buildOCR(); buildUsers(USERS); renderLogs(); buildArchive(); buildNotifs();
  populateSearch('');
  buildReqs();
  injectDeadlineNotifs();
  updateReqBadge();
  if(ROLE==='Viewer') setTimeout(addViewerBanner,50);
}

// ═══════════════════════════════════════
//  DASHBOARD
// ═══════════════════════════════════════
function buildDashStats(){
  const arch=DOCS.filter(d=>d.status==='archived').length;
  const req=REQS.filter(r=>r.status==='pending'||r.status==='overdue').length;
  const html=[
    {lbl:'Total Documents',val:DOCS.length.toLocaleString(),sub:'↑ 12% this month',sc:'var(--accent)',ico:'📄',click:"nav('search')"},
    {lbl:'Pending OCR',val:OCR_Q.filter(o=>o.status!=='active').length,sub:'↑ 2 new today',sc:'var(--yellow)',ico:'🔎',click:"nav('ocr')"},
    {lbl:'Archived',val:arch,sub:'↑ 8 this week',sc:'var(--green)',ico:'📦',click:"nav('archive')"},
    ROLE!=='Viewer'
      ?{lbl:ROLE==='Admin'?'Pending Requirements':'My Requirements',val:req,sub:ROLE==='Admin'?'Across all staff':'Assigned to me',sc:'var(--purple)',ico:'📋',click:"nav('requirements')"}
      :{lbl:'Active Users',val:38,sub:'5 online now',sc:'var(--purple)',ico:'👥',click:''},
  ];
  document.getElementById('dash-stats').innerHTML=html.map(s=>`
    <div class="stat-card" style="--sc:${s.sc}" onclick="${s.click}">
      <div class="sc-lbl">${s.lbl}</div><div class="sc-val" style="color:${s.sc}">${s.val}</div>
      <div class="sc-sub">${s.sub}</div><div class="sc-ico">${s.ico}</div>
    </div>`).join('');
}

function addViewerBanner(){
  const pg=document.getElementById('pg-dashboard');
  if(!pg||document.getElementById('viewerBanner'))return;
  const b=document.createElement('div');
  b.id='viewerBanner';
  b.className='info-banner';
  b.style.cssText='background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.2);';
  b.innerHTML='<span style="font-size:18px">👁</span><div><strong style="color:var(--accent)">Viewer Access</strong> — You can search, view, and download documents. Upload and edit functions are restricted.</div>';
  const head=pg.querySelector('.ph');
  if(head) head.after(b);
}

// ═══════════════════════════════════════
//  BAR CHART & DONUT
// ═══════════════════════════════════════
function buildBarChart(){
  const months=['Sep','Oct','Nov','Dec','Jan','Feb'],vals=[112,98,145,89,167,134],arch=[18,22,31,15,28,19];
  const mx=Math.max(...vals);
  document.getElementById('barChart').innerHTML=months.map((m,i)=>`
    <div class="bw">
      <div class="bar-inner">
        <div class="bar" style="height:${(vals[i]/mx)*100}%;background:rgba(14,165,233,${i===5?'.9':'.45'})" onclick="toast('📊','${m} Uploads','${vals[i]} documents uploaded')"><div class="bar-tip">${vals[i]}</div></div>
        <div class="bar" style="height:${(arch[i]/mx)*100}%;background:rgba(139,92,246,.5)" onclick="toast('📦','${m} Archived','${arch[i]} documents archived')"><div class="bar-tip">${arch[i]}</div></div>
      </div>
      <div class="bar-lbl">${m}</div>
    </div>`).join('');
}

function buildDonut(){
  const cats=[{l:'Budget & Finance',v:35,c:'#0ea5e9'},{l:'Resolutions',v:22,c:'#8b5cf6'},{l:'Ordinances',v:18,c:'#10b981'},{l:'Administrative',v:14,c:'#f59e0b'},{l:'Others',v:11,c:'#64748b'}];
  const tot=cats.reduce((a,b)=>a+b.v,0);let off=0,paths='';
  cats.forEach(c=>{const p=c.v/tot,big=p>.5?1:0,a=p*2*Math.PI,x1=18+13*Math.sin(off*2*Math.PI),y1=18-13*Math.cos(off*2*Math.PI);off+=p;const x2=18+13*Math.sin(off*2*Math.PI),y2=18-13*Math.cos(off*2*Math.PI);
    paths+=`<path d="M18 18 L${x1} ${y1} A13 13 0 ${big} 1 ${x2} ${y2} Z" fill="${c.c}" opacity=".85" style="cursor:pointer;transition:opacity .2s" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=.85" onclick="filterCat('${c.l}')"/>`;
  });
  document.getElementById('donutSvg').innerHTML=paths+'<circle cx="18" cy="18" r="7" fill="var(--panel)"/>';
  document.getElementById('donutLeg').innerHTML=cats.map(c=>`<div class="leg-item" onclick="filterCat('${c.l}')"><div class="leg-dot" style="background:${c.c}"></div><span>${c.l}</span><span class="leg-pct">${c.v}%</span></div>`).join('');
}
function filterCat(cat){nav('search');document.getElementById('fCat').value=cat;applyFilters();}

// ═══════════════════════════════════════
//  DASHBOARD TABLE
// ═══════════════════════════════════════
function buildDashTable(){
  const t=document.getElementById('dashTbl');t.innerHTML='';
  DOCS.slice(0,6).forEach(d=>{
    const isV=ROLE==='Viewer',isA=ROLE==='Admin';
    t.innerHTML+=`<tr>
      <td class="mono-sm">${d.id}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${d.title}">${d.title}</td>
      <td>${d.src}</td><td><span class="badge" style="background:var(--navy3);color:var(--text2)">${d.cat}</span></td>
      <td class="mono-sm" style="color:var(--text2)">${d.date}</td>
      <td><span class="badge b-${d.status}">${d.status}</span></td>
      <td><div class="btn-row">
        <button class="btn btn-blue" onclick="openDoc('${d.id}')">👁 View</button>
        <button class="btn" onclick="dlDoc('${d.id}')">⬇</button>
        ${!isV?`<button class="btn" onclick="openEditMeta('${d.id}')">✏</button>`:''}
        ${isA?`<button class="btn btn-red" onclick="delDoc('${d.id}')">🗑</button>`:''}
      </div></td></tr>`;
  });
}

// ═══════════════════════════════════════
//  DOCUMENT VIEWER
// ═══════════════════════════════════════
function openDoc(id){
  const d=DOCS.find(x=>x.id===id);if(!d)return;
  curDocId=id;
  document.getElementById('dmTitle').textContent=d.title;
  document.getElementById('dmId').textContent=d.id;
  document.getElementById('dmMeta').innerHTML=`
    <div class="meta-item"><div class="meta-k">Document ID</div><div class="meta-v" style="font-family:var(--mono)">${d.id}</div></div>
    <div class="meta-item"><div class="meta-k">Source</div><div class="meta-v">${d.src}</div></div>
    <div class="meta-item"><div class="meta-k">Category</div><div class="meta-v">${d.cat}</div></div>
    <div class="meta-item"><div class="meta-k">Date Received</div><div class="meta-v" style="font-family:var(--mono)">${d.date}</div></div>
    <div class="meta-item"><div class="meta-k">Status</div><div class="meta-v"><span class="badge b-${d.status}">${d.status}</span></div></div>
    <div class="meta-item"><div class="meta-k">File</div><div class="meta-v" style="font-family:var(--mono)">${d.size} • ${d.pages} pages</div></div>`;
  document.getElementById('dmOcr').textContent=d.ocr||'No OCR text available.';
  const isV=ROLE==='Viewer',isA=ROLE==='Admin';
  document.getElementById('dmViewerNote').innerHTML=isV?`<div class="info-banner" style="background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.18);font-size:11px"><span>👁</span><span>Viewer mode — you can download this document. Contact Admin to request edits.</span></div>`:'';
  let btns=`<button class="btn btn-blue" onclick="dlDoc('${d.id}')">⬇ Download</button><button class="btn" onclick="printDoc()">🖨 Print</button><button class="btn" onclick="closeModal('docModal')">✕ Close</button>`;
  if(!isV) btns+=`<button class="btn btn-blue" onclick="closeModal('docModal');openEditMeta('${d.id}')">✏ Edit</button>`;
  if(isA){
    btns+=d.status!=='archived'?`<button class="btn btn-yellow" onclick="archDoc('${d.id}')">📦 Archive</button>`:`<button class="btn btn-green" onclick="restoreDoc('${d.id}')">♻ Restore</button>`;
    btns+=`<button class="btn btn-red" onclick="delDoc('${d.id}')">🗑 Delete</button>`;
  }
  document.getElementById('dmActs').innerHTML=btns;
  addLog(`Viewed ${id}: ${d.title.slice(0,30)}`,UNAME,'View','👁','rgba(100,116,139,.14)');
  openModal('docModal');
}
function dlDoc(id){const d=DOCS.find(x=>x.id===id);addLog(`Downloaded ${id}`,UNAME,'Download','📥','rgba(16,185,129,.14)');toast('📥','Download Started',d.title.slice(0,40));closeModal('docModal');}
function printDoc(){toast('🖨','Print Initiated','Document sent to printer');}
function archDoc(id){
  if(ROLE==='Viewer'){toast('🚫','Denied','Viewers cannot archive documents');return;}
  const d=DOCS.find(x=>x.id===id);
  showConfirm('Archive Document','📦',`Archive "${d.title.slice(0,40)}"? It will move to archive storage.`,()=>{
    d.status='archived';addLog(`Archived ${id}`,UNAME,'Archive','📦','rgba(245,158,11,.14)');
    buildDashTable();buildArchive();applyFilters();buildDashStats();
    toast('📦','Archived',id+' moved to archive');closeModal('docModal');
  });
}
function restoreDoc(id){
  if(ROLE!=='Admin'){toast('🚫','Denied','Only Admins can restore documents');return;}
  const d=DOCS.find(x=>x.id===id);d.status='active';
  addLog(`Restored ${id}`,UNAME,'Archive','♻️','rgba(16,185,129,.1)');
  buildDashTable();buildArchive();applyFilters();buildDashStats();
  toast('♻️','Restored',id+' is now active');closeModal('docModal');
}
function delDoc(id){
  if(ROLE!=='Admin'){toast('🚫','Denied','Only Admins can delete documents');return;}
  const d=DOCS.find(x=>x.id===id)||{id,title:id};
  showConfirm('Delete Document','🗑',`Permanently delete "${d.title.slice(0,40)}"? This cannot be undone.`,()=>{
    DOCS.splice(DOCS.findIndex(x=>x.id===id),1);
    addLog(`Deleted ${id}`,UNAME,'Delete','🗑','rgba(239,68,68,.14)');
    buildDashTable();buildArchive();applyFilters();buildDashStats();
    toast('🗑','Deleted',id+' permanently removed');closeModal('docModal');closeModal('confirmModal');
  });
}

// ═══════════════════════════════════════
//  EDIT METADATA
// ═══════════════════════════════════════
function openEditMeta(id){
  if(ROLE==='Viewer'){toast('🚫','Denied','Viewers cannot edit metadata');return;}
  const d=DOCS.find(x=>x.id===id);if(!d)return;
  curDocId=id;
  document.getElementById('emT').value=d.title;
  document.getElementById('emSrc').value=d.src;
  document.getElementById('emCat').value=d.cat;
  document.getElementById('emDate').value=d.date;
  document.getElementById('emDesc').value=d.ocr||'';
  openModal('editMetaModal');
}
function saveMeta(){
  if(ROLE==='Viewer'){toast('🚫','Denied');return;}
  const d=DOCS.find(x=>x.id===curDocId);if(!d)return;
  d.title=document.getElementById('emT').value||d.title;
  d.src=document.getElementById('emSrc').value||d.src;
  d.cat=document.getElementById('emCat').value||d.cat;
  d.date=document.getElementById('emDate').value||d.date;
  d.ocr=document.getElementById('emDesc').value;
  addLog(`Edited metadata for ${curDocId}`,UNAME,'Upload','✏️','rgba(139,92,246,.1)');
  buildDashTable();applyFilters();buildArchive();
  toast('✅','Metadata Saved',curDocId+' updated');closeModal('editMetaModal');
}

// ═══════════════════════════════════════
//  UPLOAD
// ═══════════════════════════════════════
function handleDrop(e){e.preventDefault();document.getElementById('dropzone').classList.remove('drag');if(e.dataTransfer.files[0])handleFile(e.dataTransfer.files[0]);}
function handleFile(f){
  if(!f.name.toLowerCase().endsWith('.pdf')){toast('❌','Invalid','PDF files only');return;}
  if(f.size>50*1024*1024){toast('❌','Too Large','Max 50MB');return;}
  selFile=f;
  const fc=document.getElementById('fileCard');fc.classList.add('show');
  document.getElementById('fName').textContent=f.name;
  document.getElementById('fSize').textContent=(f.size/1024).toFixed(1)+' KB';
  toast('📄','File Ready',f.name);
}
function clearFile(){
  selFile=null;document.getElementById('fileCard').classList.remove('show');
  document.getElementById('fileInp').value='';
  document.getElementById('progWrap').style.display='none';
  document.getElementById('ocrRunning').style.display='none';
}
function resetUpload(){clearFile();['mTitle','mDesc'].forEach(i=>document.getElementById(i).value='');['mSource','mCat'].forEach(i=>document.getElementById(i).value='');document.getElementById('mDate').value='';toast('↺','Reset','Upload form cleared');}
function submitUpload(){
  if(ROLE==='Viewer'){toast('🚫','Denied','Viewers cannot upload');return;}
  const t=document.getElementById('mTitle').value.trim(),src=document.getElementById('mSource').value,dt=document.getElementById('mDate').value,cat=document.getElementById('mCat').value;
  if(!t||!src||!dt||!cat){toast('⚠️','Required','Fill all required fields (*)');return;}
  const pw=document.getElementById('progWrap');pw.style.display='block';
  let p=0;
  const steps=['Validating PDF…','Assigning Document ID…','Uploading to server…','Initiating OCR…','Extracting text…','Indexing content…','Saving…','Done!'];
  const iv=setInterval(()=>{
    p+=Math.random()*14;if(p>100)p=100;
    document.getElementById('progFill').style.width=p+'%';
    document.getElementById('progPct').textContent=Math.floor(p)+'%';
    document.getElementById('progLbl').textContent='Uploading & Processing…';
    document.getElementById('progTxt').textContent=steps[Math.min(Math.floor(p/13),steps.length-1)];
    if(p>=100){
      clearInterval(iv);
      document.getElementById('ocrRunning').style.display='block';
      const nid='DOC-2025-'+String(Math.floor(Math.random()*9000)+1000);
      DOCS.unshift({id:nid,title:t,src,cat,date:dt,status:'processing',size:selFile?(selFile.size/1024).toFixed(1)+' KB':'1.2 MB',pages:Math.floor(Math.random()*20+1),ocr:'OCR processing in queue…'});
      OCR_Q.unshift({id:nid,title:t,src,date:dt,status:'pending',prog:0,acc:'—'});
      addLog(`Uploaded ${nid}: ${t.slice(0,30)}`,UNAME,'Upload','📤','rgba(14,165,233,.14)');
      buildDashTable();buildOCR();applyFilters();buildDashStats();
      NOTIFS.unshift({txt:`Upload complete: ${nid}`,time:'Just now',col:'var(--green)'});buildNotifs();
      toast('✅','Upload Successful',nid+' — OCR processing started');
      setTimeout(()=>{pw.style.display='none';document.getElementById('progFill').style.width='0%';document.getElementById('ocrRunning').style.display='none';},3000);
    }
  },200);
}

// ═══════════════════════════════════════
//  SEARCH
// ═══════════════════════════════════════
function doSearch(q){document.getElementById('searchInp').value=q;applyFilters();}
function applyFilters(){
  const q=document.getElementById('searchInp').value.toLowerCase(),src=document.getElementById('fSrc').value,cat=document.getElementById('fCat').value,yr=document.getElementById('fYr').value,st=document.getElementById('fSt').value;
  srchRes=DOCS.filter(d=>{
    const mQ=!q||(d.title+d.src+d.cat+d.id+(d.ocr||'')).toLowerCase().includes(q);
    return mQ&&(!src||d.src===src)&&(!cat||d.cat===cat)&&(!yr||d.date.startsWith(yr))&&(!st||d.status===st);
  });
  srchPage=1;renderSearch();
}
function renderSearch(){
  const q=document.getElementById('searchInp').value.toLowerCase();
  const hl=t=>q?t.replace(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'),m=>`<span class="hl">${m}</span>`):t;
  const paged=srchRes.slice((srchPage-1)*PP,srchPage*PP);
  const isV=ROLE==='Viewer',isA=ROLE==='Admin';
  document.getElementById('srchCount').textContent=srchRes.length+' document(s) found';
  document.getElementById('srchResults').innerHTML=paged.length?paged.map(d=>`
    <div class="res-card" onclick="openDoc('${d.id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px">
        <div class="res-title">${hl(d.title)}</div><span class="badge b-${d.status}">${d.status}</span>
      </div>
      <div class="res-meta"><span>📍 ${hl(d.src)}</span><span>📂 ${hl(d.cat)}</span><span>📅 ${d.date}</span><span>${d.id}</span></div>
      ${q&&d.ocr?`<div style="font-size:11px;color:var(--text2);margin-top:6px;line-height:1.6">${hl(d.ocr.slice(0,120)+'…')}</div>`:''}
      <div class="btn-row" style="margin-top:10px" onclick="event.stopPropagation()">
        <button class="btn btn-blue" onclick="openDoc('${d.id}')">👁 View</button>
        <button class="btn" onclick="dlDoc('${d.id}')">⬇ Download</button>
        ${!isV?`<button class="btn" onclick="openEditMeta('${d.id}')">✏ Edit</button>`:''}
        ${isA&&d.status!=='archived'?`<button class="btn btn-yellow" onclick="archDoc('${d.id}')">📦 Archive</button>`:''}
      </div>
    </div>`).join(''):`<div class="empty-state"><div class="empty-ico">🔍</div><div>No documents match your search</div></div>`;
  buildPager('srchPager',srchRes.length,PP,srchPage,p=>{srchPage=p;renderSearch();});
}
function clearFilters(){['fSrc','fCat','fYr','fSt'].forEach(i=>document.getElementById(i).value='');document.getElementById('searchInp').value='';applyFilters();}
function populateSearch(q){document.getElementById('searchInp').value=q;applyFilters();}
function exportCSV(){toast('📥','Exported','Documents exported as CSV');}

// ═══════════════════════════════════════
//  REQUIREMENTS
// ═══════════════════════════════════════
function daysUntil(ds){const n=new Date();n.setHours(0,0,0,0);const d=new Date(ds);d.setHours(0,0,0,0);return Math.round((d-n)/86400000);}
function dlChip(ds,st){
  if(st==='approved')return`<span class="dl-chip dl-ok">✅ Approved</span>`;
  const d=daysUntil(ds);
  if(d<0)return`<span class="dl-chip dl-over">🚨 Overdue ${Math.abs(d)}d</span>`;
  if(d===0)return`<span class="dl-chip dl-hot">🔴 Due TODAY</span>`;
  if(d<=3)return`<span class="dl-chip dl-hot">🔴 ${d}d left</span>`;
  if(d<=7)return`<span class="dl-chip dl-warn">⚠️ ${d}d left</span>`;
  return`<span class="dl-chip dl-ok">📅 ${d}d left</span>`;
}
function stBadge(st){const m={pending:{bg:'rgba(14,165,233,.12)',c:'var(--accent)',l:'⏳ Pending'},submitted:{bg:'rgba(139,92,246,.12)',c:'var(--purple)',l:'📤 Submitted'},approved:{bg:'rgba(16,185,129,.12)',c:'var(--green)',l:'✅ Approved'},rejected:{bg:'rgba(239,68,68,.12)',c:'var(--red)',l:'❌ Rejected'},overdue:{bg:'rgba(239,68,68,.2)',c:'var(--red)',l:'🚨 Overdue'}};const s=m[st]||m.pending;return`<span style="background:${s.bg};color:${s.c};padding:3px 9px;border-radius:20px;font-size:10px;font-family:var(--mono)">${s.l}</span>`;}

function getMyReqs(){
  if(ROLE==='Admin') return REQS;
  return REQS.filter(r=>r.assignedTo===UNAME);
}

function buildReqs(){
  // Setup header
  const isAdmin=ROLE==='Admin';
  document.getElementById('req-sub').textContent=isAdmin?'Manage all agency requirements and compliance deadlines':'Your assigned requirements and compliance checklist from PSED Admin';
  document.getElementById('req-acts').innerHTML=isAdmin
    ?`<button class="btn" onclick="toast('📥','Exported','Compliance report exported')">📥 Export Report</button><button class="btn-add" onclick="openAddReq()">+ Add Requirement</button>`
    :`<button class="btn" onclick="toast('📥','Exported','Your compliance report exported')">📥 My Compliance Report</button>`;
  // Populate assigned-to dropdown
  const sel=document.getElementById('rqAsgn');
  if(sel){sel.innerHTML='<option value="">Select Staff / Agency…</option>';
    USERS.filter(u=>u.role==='Staff').forEach(u=>sel.innerHTML+=`<option value="${u.user}">${u.name} — ${u.dept}</option>`);}
  renderReqStats();renderReqs();updateReqBadge();
}

function renderReqStats(){
  const list=getMyReqs();
  REQS.forEach(r=>{if(r.status==='pending'&&daysUntil(r.deadline)<0)r.status='overdue';});
  const tot=list.length,comp=list.filter(r=>r.status==='approved').length,pend=list.filter(r=>r.status==='pending'||r.status==='submitted').length,over=list.filter(r=>r.status==='overdue').length;
  document.getElementById('req-stats').innerHTML=`
    <div class="stat-card" style="--sc:var(--accent);cursor:default"><div class="sc-lbl">${ROLE==='Admin'?'Total Requirements':'Assigned To Me'}</div><div class="sc-val">${tot}</div><div class="sc-sub">Active checklists</div><div class="sc-ico">📋</div></div>
    <div class="stat-card" style="--sc:var(--green);cursor:default"><div class="sc-lbl">Approved</div><div class="sc-val" style="color:var(--green)">${comp}</div><div class="sc-sub">Completed on time</div><div class="sc-ico">✅</div></div>
    <div class="stat-card" style="--sc:var(--yellow);cursor:default"><div class="sc-lbl">Pending / Submitted</div><div class="sc-val" style="color:var(--yellow)">${pend}</div><div class="sc-sub">Awaiting action</div><div class="sc-ico">⏳</div></div>
    <div class="stat-card" style="--sc:var(--red);cursor:default"><div class="sc-lbl">Overdue</div><div class="sc-val" style="color:var(--red)">${over}</div><div class="sc-sub">Past deadline</div><div class="sc-ico">🚨</div></div>`;
}

function renderReqs(){
  const q=(document.getElementById('reqQ')||{value:''}).value.toLowerCase();
  const fst=(document.getElementById('reqFst')||{value:''}).value;
  const fcat=(document.getElementById('reqFcat')||{value:''}).value;
  const fpri=(document.getElementById('reqFpri')||{value:''}).value;
  REQS.forEach(r=>{if(r.status==='pending'&&daysUntil(r.deadline)<0)r.status='overdue';});
  let list=getMyReqs();
  if(q)list=list.filter(r=>(r.title+r.cat+r.desc).toLowerCase().includes(q));
  if(fst)list=list.filter(r=>r.status===fst);
  if(fcat)list=list.filter(r=>r.cat===fcat);
  if(fpri)list=list.filter(r=>r.pri===fpri);
  list.sort((a,b)=>(a.status==='overdue'?-1:0)-(b.status==='overdue'?-1:0)||new Date(a.deadline)-new Date(b.deadline));
  const isAdmin=ROLE==='Admin';
  const el=document.getElementById('reqList');
  if(!list.length){el.innerHTML=`<div class="empty-state"><div class="empty-ico">📋</div><div>${isAdmin?'No requirements. Click "+ Add Requirement" to create one.':'No requirements assigned to you yet.'}</div></div>`;return;}
  el.innerHTML=list.map(r=>{
    const done=r.subs.filter(s=>s.status==='approved').length,tot=r.docTypes.length;
    const pct=tot?Math.round((done/tot)*100):0;
    const pc=pct===100?'var(--green)':r.status==='overdue'?'var(--red)':'var(--accent)';
    return`<div class="req-card p-${r.pri}">
      <div class="req-hd">
        <div class="req-title">${r.title}</div>
        <div class="req-badge-row">
          <span class="pri-chip pc-${r.pri}">${r.pri}</span>
          ${stBadge(r.status)}
          ${dlChip(r.deadline,r.status)}
        </div>
      </div>
      <div class="req-meta-row">
        <span>📂 ${r.cat}</span><span>📅 Deadline: ${r.deadline}</span>
        <span>👤 ${isAdmin?r.assignedName:'Assigned to me'}</span>
        <span>📋 ${r.docTypes.length} doc(s) required</span>
        ${r.subs.length?`<span>📤 ${r.subs.length} submission(s)</span>`:''}
      </div>
      <div class="req-prog-wrap">
        <div class="req-prog-lbl"><span>Compliance Progress</span><span style="color:${pc}">${pct}% (${done}/${tot} approved)</span></div>
        <div class="req-prog-bar"><div class="req-prog-fill" style="width:${pct}%;background:${pc}"></div></div>
      </div>
      <div class="req-desc">${r.desc.slice(0,130)}…</div>
      <div class="req-acts">
        ${isAdmin
          ?`<button class="btn btn-blue" onclick="openAdminReq('${r.id}')">📊 View Submissions</button>
             <button class="btn" onclick="editReq('${r.id}')">✏ Edit</button>
             <button class="btn" onclick="sendReminder('${r.id}')">🔔 Send Reminder</button>
             <button class="btn btn-red" onclick="deleteReq('${r.id}')">🗑 Delete</button>`
          :`<button class="btn btn-blue" onclick="openReqView('${r.id}')">📋 View Details</button>
             ${r.status!=='approved'?`<button class="btn btn-green" onclick="openReqView('${r.id}')">📤 Submit Document</button>`:`<button class="btn" style="opacity:.5;cursor:default">✅ Completed</button>`}`
        }
      </div>
    </div>`;
  }).join('');
}
function clearReqFilters(){['reqQ','reqFst','reqFcat','reqFpri'].forEach(i=>{const el=document.getElementById(i);if(el)el.value='';});renderReqs();}
function updateReqBadge(){
  const urgent=getMyReqs().filter(r=>r.status!=='approved'&&daysUntil(r.deadline)<=7).length;
  const b=document.getElementById('nb-req');if(b){b.textContent=urgent;b.style.display=urgent>0?'':'none';}
}

// Admin: Add/Edit
function openAddReq(){
  editReqId=null;
  document.getElementById('addReqTitle').textContent='Add New Requirement';
  ['rqT','rqDocs'].forEach(i=>document.getElementById(i).value='');
  ['rqCat','rqPri','rqAsgn'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('rqDesc').value='';document.getElementById('rqDl').value='';
  openModal('addReqModal');
}
function editReq(id){
  const r=REQS.find(x=>x.id===id);if(!r)return;
  editReqId=id;document.getElementById('addReqTitle').textContent='Edit Requirement';
  document.getElementById('rqT').value=r.title;document.getElementById('rqCat').value=r.cat;
  document.getElementById('rqPri').value=r.pri;document.getElementById('rqDl').value=r.deadline;
  document.getElementById('rqAsgn').value=r.assignedTo;document.getElementById('rqDesc').value=r.desc;
  document.getElementById('rqDocs').value=r.docTypes.join(', ');
  closeModal('adminReqModal');openModal('addReqModal');
}
function saveReq(){
  const t=document.getElementById('rqT').value.trim(),cat=document.getElementById('rqCat').value,pri=document.getElementById('rqPri').value,dl=document.getElementById('rqDl').value,asgn=document.getElementById('rqAsgn').value;
  if(!t||!cat||!pri||!dl||!asgn){toast('⚠️','Required','Fill all required fields');return;}
  const desc=document.getElementById('rqDesc').value,dts=document.getElementById('rqDocs').value.split(',').map(s=>s.trim()).filter(Boolean);
  const u=USERS.find(x=>x.user===asgn),an=u?u.name:asgn;
  if(editReqId){
    const r=REQS.find(x=>x.id===editReqId);
    Object.assign(r,{title:t,cat,pri,deadline:dl,assignedTo:asgn,assignedName:an,desc,docTypes:dts.length?dts:r.docTypes});
    toast('✅','Updated',t.slice(0,40));
  } else {
    const nid='REQ-2025-'+String(REQS.length+1).padStart(3,'0');
    REQS.push({id:nid,title:t,cat,pri,deadline:dl,assignedTo:asgn,assignedName:an,desc,docTypes:dts.length?dts:['Required Document'],reminder:'all',status:'pending',subs:[]});
    NOTIFS.unshift({txt:`New requirement assigned to ${an}: ${t.slice(0,35)}`,time:'Just now',col:'var(--yellow)'});buildNotifs();
    toast('✅','Requirement Created',t.slice(0,40));
  }
  addLog(`${editReqId?'Edited':'Created'} requirement: ${t.slice(0,30)}`,UNAME,'Upload','📋','rgba(14,165,233,.1)');
  closeModal('addReqModal');buildReqs();
}
function deleteReq(id){
  const r=REQS.find(x=>x.id===id);if(!r)return;
  showConfirm('Delete Requirement','🗑',`Delete "${r.title.slice(0,40)}"? All submission history will be lost.`,()=>{
    REQS.splice(REQS.indexOf(r),1);addLog(`Deleted requirement: ${r.title.slice(0,30)}`,UNAME,'Delete','🗑','rgba(239,68,68,.14)');
    toast('🗑','Deleted',r.title.slice(0,40));closeModal('adminReqModal');buildReqs();
  });
}
function sendReminder(id){
  const r=REQS.find(x=>x.id===id);if(!r)return;
  NOTIFS.unshift({txt:`Reminder sent to ${r.assignedName}: ${r.title.slice(0,40)} — deadline ${r.deadline}`,time:'Just now',col:'var(--yellow)'});buildNotifs();
  addLog(`Sent deadline reminder for ${id} to ${r.assignedName}`,UNAME,'Upload','🔔','rgba(245,158,11,.14)');
  toast('🔔','Reminder Sent',`Deadline reminder sent to ${r.assignedName}`);
}

// Admin: View submissions
function openAdminReq(id){
  const r=REQS.find(x=>x.id===id);if(!r)return;
  curReqId=id;
  document.getElementById('arT').textContent=r.title;
  document.getElementById('arMeta').innerHTML=`
    <div class="meta-item"><div class="meta-k">Req. ID</div><div class="meta-v" style="font-family:var(--mono)">${r.id}</div></div>
    <div class="meta-item"><div class="meta-k">Deadline</div><div class="meta-v">${r.deadline} ${dlChip(r.deadline,r.status)}</div></div>
    <div class="meta-item"><div class="meta-k">Assigned To</div><div class="meta-v">${r.assignedName}</div></div>
    <div class="meta-item"><div class="meta-k">Status</div><div class="meta-v">${stBadge(r.status)}</div></div>`;
  document.getElementById('arSubs').innerHTML=!r.subs.length
    ?`<div class="empty-state" style="padding:24px"><div class="empty-ico">📄</div><div>No submissions yet</div></div>`
    :r.subs.map((s,i)=>`
      <div class="sub-row">
        <span style="font-size:18px">📄</span>
        <div style="flex:1">
          <div style="font-size:13px;font-weight:600">${s.title}</div>
          <div style="font-size:11px;color:var(--text2);font-family:var(--mono)">${s.type} • by ${s.by} on ${s.at}</div>
          ${s.remarks?`<div style="font-size:11px;color:var(--text3);margin-top:2px">"${s.remarks}"</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px">
          <span class="badge b-${s.status}">${s.status}</span>
          <div class="btn-row">
            <button class="btn btn-green" onclick="reviewSub('${id}',${i},'approved')">✅ Approve</button>
            <button class="btn btn-red" onclick="reviewSub('${id}',${i},'rejected')">❌ Reject</button>
          </div>
        </div>
      </div>`).join('');
  openModal('adminReqModal');
}
function reviewSub(rid,si,dec){
  const r=REQS.find(x=>x.id===rid);if(!r||!r.subs[si])return;
  r.subs[si].status=dec;
  if(dec==='approved'){if(r.subs.every(s=>s.status==='approved'))r.status='approved';toast('✅','Approved',r.subs[si].title);}
  else{r.status=daysUntil(r.deadline)<0?'overdue':'pending';toast('❌','Rejected',r.subs[si].title+' — feedback sent');NOTIFS.unshift({txt:`Submission rejected for: ${r.title.slice(0,35)}`,time:'Just now',col:'var(--red)'});buildNotifs();}
  addLog(`${dec==='approved'?'Approved':'Rejected'} submission for ${rid}`,UNAME,'Upload',dec==='approved'?'✅':'❌','rgba(14,165,233,.1)');
  buildReqs();openAdminReq(rid);
}

// Staff: View & Submit
function openReqView(id){
  const r=REQS.find(x=>x.id===id);if(!r)return;
  curReqId=id;vrFile=null;
  document.getElementById('vrT').textContent=r.title;
  const bm={pending:{bg:'rgba(14,165,233,.09)',bc:'rgba(14,165,233,.25)',ico:'⏳',msg:'This requirement is pending your submission.'},submitted:{bg:'rgba(139,92,246,.09)',bc:'rgba(139,92,246,.25)',ico:'📤',msg:'Your submission is under review by PSED Admin.'},approved:{bg:'rgba(16,185,129,.09)',bc:'rgba(16,185,129,.25)',ico:'✅',msg:'This requirement has been approved. No further action needed.'},rejected:{bg:'rgba(239,68,68,.09)',bc:'rgba(239,68,68,.3)',ico:'❌',msg:'Your submission was rejected. Please review feedback and resubmit.'},overdue:{bg:'rgba(239,68,68,.12)',bc:'rgba(239,68,68,.4)',ico:'🚨',msg:'This requirement is OVERDUE. Submit immediately.'}};
  const b=bm[r.status]||bm.pending;
  document.getElementById('vrBanner').style.cssText=`background:${b.bg};border:1px solid ${b.bc};border-radius:var(--r);padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;font-size:13px`;
  document.getElementById('vrBanner').innerHTML=`<span style="font-size:20px">${b.ico}</span><div>${b.msg}</div>`;
  const d=daysUntil(r.deadline),dc=r.status==='approved'?'var(--green)':d<0?'var(--red)':d<=3?'var(--red)':d<=7?'var(--yellow)':'var(--accent)';
  document.getElementById('vrCountdown').innerHTML=`
    <div><div class="countdown-lbl">PSED DEADLINE</div><div style="font-size:13px;font-family:var(--mono);margin-top:2px">${r.deadline}</div></div>
    <div style="text-align:center"><div class="countdown-val" style="color:${dc}">${r.status==='approved'?'DONE':d<0?Math.abs(d):d===0?'NOW':d}</div><div class="countdown-lbl">${r.status==='approved'?'Completed':d<0?'DAYS OVERDUE':d===0?'DUE TODAY':'DAYS LEFT'}</div></div>
    <div style="text-align:right"><div class="countdown-lbl">PRIORITY</div><div class="pri-chip pc-${r.pri}" style="margin-top:3px;display:inline-block">${r.pri}</div></div>`;
  document.getElementById('vrMeta').innerHTML=`
    <div class="meta-item"><div class="meta-k">Req. ID</div><div class="meta-v" style="font-family:var(--mono)">${r.id}</div></div>
    <div class="meta-item"><div class="meta-k">Category</div><div class="meta-v">${r.cat}</div></div>
    <div class="meta-item"><div class="meta-k">Issued By</div><div class="meta-v">PSED Admin</div></div>
    <div class="meta-item"><div class="meta-k">Status</div><div class="meta-v">${stBadge(r.status)}</div></div>`;
  document.getElementById('vrDesc').textContent=r.desc;
  const done=r.subs.filter(s=>s.status==='approved').map(s=>s.type);
  document.getElementById('vrChecklist').innerHTML=r.docTypes.map(dt=>{const ok=done.includes(dt);return`<div class="doc-check-item"><div class="dc-icon ${ok?'dc-done':'dc-todo'}">${ok?'✓':'○'}</div><span style="${ok?'text-decoration:line-through;color:var(--text3)':''}">${dt}</span>${ok?`<span style="margin-left:auto;font-size:9px;color:var(--green);font-family:var(--mono)">Approved</span>`:''}</div>`;}).join('');
  document.getElementById('vrHistory').innerHTML=!r.subs.length?`<div style="font-size:12px;color:var(--text3);padding:8px 0">No submissions yet.</div>`:r.subs.map(s=>`<div class="sub-row"><span style="font-size:16px">📄</span><div style="flex:1"><div style="font-size:13px;font-weight:600">${s.title}</div><div style="font-size:11px;color:var(--text2);font-family:var(--mono)">${s.type} • ${s.at}</div>${s.remarks?`<div style="font-size:11px;color:var(--text3);margin-top:2px">"${s.remarks}"</div>`:''}</div><span class="badge b-${s.status}">${s.status}</span></div>`).join('');
  const sel=document.getElementById('vrDocType');sel.innerHTML=r.docTypes.map(dt=>`<option>${dt}</option>`).join('');
  document.getElementById('vrDocTitle').value='';document.getElementById('vrRemarks').value='';document.getElementById('vrFileLbl').textContent='';
  document.getElementById('vrDrop').style.borderColor='var(--border)';
  document.getElementById('vrSubmitSec').style.display=r.status==='approved'?'none':'block';
  document.getElementById('vrActs').innerHTML=`<button class="btn" onclick="closeModal('viewReqModal')">✕ Close</button>${r.status!=='approved'?`<button class="btn btn-blue" onclick="submitCompliance('${r.id}')">📤 Submit Document</button>`:''}`;
  openModal('viewReqModal');
}
function setVrFile(f){if(!f)return;if(!f.name.toLowerCase().endsWith('.pdf')){toast('❌','Invalid','PDF only');return;}vrFile=f;document.getElementById('vrFileLbl').textContent='📎 '+f.name;document.getElementById('vrDrop').style.borderColor='var(--accent)';}
function submitCompliance(rid){
  const r=REQS.find(x=>x.id===rid);if(!r)return;
  const t=document.getElementById('vrDocTitle').value.trim(),tp=document.getElementById('vrDocType').value,rm=document.getElementById('vrRemarks').value.trim();
  if(!t){toast('⚠️','Required','Enter the document title');return;}
  const nid='DOC-2025-'+String(Math.floor(Math.random()*9000)+1000);
  r.subs.push({docId:nid,title:t,type:tp,by:UNAME,at:new Date().toISOString().slice(0,10),status:'submitted',remarks:rm});
  r.status='submitted';
  DOCS.push({id:nid,title:t,src:'PSED Compliance Submission',cat:r.cat,date:new Date().toISOString().slice(0,10),status:'active',size:vrFile?(vrFile.size/1024).toFixed(1)+' KB':'0.5 MB',pages:1,ocr:`COMPLIANCE SUBMISSION\nRequirement: ${r.title}\nSubmitted by: ${UNAME}\n${rm?'Remarks: '+rm:''}`});
  addLog(`Submitted compliance for ${rid}: ${t}`,UNAME,'Upload','📤','rgba(139,92,246,.14)');
  NOTIFS.unshift({txt:`Compliance submitted for review: ${r.title.slice(0,40)}`,time:'Just now',col:'var(--purple)'});buildNotifs();
  toast('📤','Submitted',`"${t}" submitted to PSED Admin for review`);
  buildReqs();openReqView(rid);
}
function injectDeadlineNotifs(){
  getMyReqs().forEach(r=>{
    if(r.status==='approved')return;
    const d=daysUntil(r.deadline);
    if(d<0)NOTIFS.unshift({txt:`🚨 OVERDUE: ${r.title.slice(0,40)} (${Math.abs(d)}d ago)`,time:'Alert',col:'var(--red)'});
    else if(d<=7)NOTIFS.unshift({txt:`📋 Due in ${d===0?'TODAY':d+'d'}: ${r.title.slice(0,40)}`,time:'Reminder',col:d<=3?'var(--red)':'var(--yellow)'});
  });
  buildNotifs();
}

// ═══════════════════════════════════════
//  OCR
// ═══════════════════════════════════════
function buildOCR(){
  const pend=OCR_Q.filter(x=>x.status==='pending').length,fail=OCR_Q.filter(x=>x.status==='failed').length;
  document.getElementById('nb-ocr').textContent=pend+fail;
  document.getElementById('ocr-stats').innerHTML=`
    <div class="stat-card" style="--sc:var(--yellow);cursor:default"><div class="sc-lbl">Pending Queue</div><div class="sc-val" style="color:var(--yellow)">${pend}</div><div class="sc-sub">Awaiting processing</div></div>
    <div class="stat-card" style="--sc:var(--green);cursor:default"><div class="sc-lbl">Completed Today</div><div class="sc-val" style="color:var(--green)">87</div><div class="sc-sub">98.8% avg accuracy</div></div>
    <div class="stat-card" style="--sc:var(--red);cursor:default"><div class="sc-lbl">Failed / Retry</div><div class="sc-val" style="color:var(--red)">${fail}</div><div class="sc-sub">Need attention</div></div>`;
  const t=document.getElementById('ocrTbl');t.innerHTML='';
  OCR_Q.forEach((d,i)=>{
    const ph=d.status==='processing'?`<div><div class="mini-prog"><div class="mini-fill" style="width:${d.prog}%"></div></div><div style="font-size:9px;font-family:var(--mono);color:var(--text3);margin-top:2px">${d.prog}%</div></div>`:(d.status==='failed'?`<span style="color:var(--red);font-size:10px">Error</span>`:`<span style="color:var(--text3);font-size:10px">Queued</span>`);
    t.innerHTML+=`<tr><td class="mono-sm">${d.id}</td><td style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.title}</td><td>${d.src}</td><td class="mono-sm">${d.date}</td><td><span class="badge b-${d.status}">${d.status}</span></td><td>${ph}</td><td class="mono-sm">${d.acc}</td>
    <td><div class="btn-row">${d.status==='failed'?`<button class="btn btn-yellow" onclick="retryOCR(${i})">Retry</button>`:`<button class="btn btn-blue" onclick="processOCR(${i})">Process</button>`}<button class="btn" onclick="viewOCRResult('${d.id}')">Result</button>${ROLE==='Admin'?`<button class="btn btn-red" onclick="removeOCR(${i})">✕</button>`:''}</div></td></tr>`;
  });
}
function processOCR(i){
  const it=OCR_Q[i];if(!it)return;
  if(it.status==='processing'){toast('⚡','Processing',it.id+' is already running');return;}
  it.status='processing';it.prog=0;buildOCR();
  let p=0;const iv=setInterval(()=>{p+=Math.random()*12;if(p>100)p=100;it.prog=Math.floor(p);buildOCR();
    if(p>=100){clearInterval(iv);it.status='active';it.acc='98.'+Math.floor(Math.random()*9)+'%';
      const d=DOCS.find(x=>x.id===it.id);if(d){d.status='active';d.ocr='OCR EXTRACTED TEXT\n\n'+it.title+'\n\nText successfully extracted. Accuracy: '+it.acc+'\n\nContent available for full-text search...';}
      addLog(`OCR completed for ${it.id}`,`SYSTEM`,'Upload','🔎','rgba(14,165,233,.1)');
      buildOCR();buildDashTable();toast('✅','OCR Complete',it.id+' — accuracy '+it.acc);
    }},180);
}
function retryOCR(i){OCR_Q[i].status='pending';OCR_Q[i].prog=0;buildOCR();processOCR(i);}
function removeOCR(i){OCR_Q.splice(i,1);buildOCR();toast('🗑','Removed','Item removed from queue');}
function processAllOCR(){const p=OCR_Q.filter(x=>x.status==='pending'||x.status==='failed');if(!p.length){toast('ℹ','Empty','No pending items in queue');return;}p.forEach((_,j)=>{const idx=OCR_Q.indexOf(p[j]);if(idx>=0)setTimeout(()=>processOCR(idx),j*900);});toast('⚡','Processing All',`Started OCR for ${p.length} document(s)`);}
function refreshOCR(){buildOCR();toast('↺','Refreshed','OCR queue updated');}
function viewOCRResult(id){
  const it=OCR_Q.find(x=>x.id===id),d=DOCS.find(x=>x.id===id);
  const steps=[{s:'File Validation',r:'PDF confirmed',ok:true},{s:'Image Extraction',r:'Pages extracted',ok:true},{s:'Text Recognition',r:it?.status==='failed'?'Error: Low image quality':'Text extracted',ok:it?.status!=='failed'},{s:'Post-processing',r:it?.status==='active'?'Text normalized':'Pending',ok:it?.status==='active'},{s:'Indexing',r:it?.status==='active'?'Indexed for search':'Pending',ok:it?.status==='active'}];
  document.getElementById('ocrSteps').innerHTML=steps.map(s=>`<div class="ocr-step"><div class="step-ico" style="background:${s.ok?'rgba(16,185,129,.18)':'rgba(239,68,68,.18)'}">${s.ok?'✅':'❌'}</div><div><div style="font-weight:600">${s.s}</div><div style="font-size:11px;color:var(--text2)">${s.r}</div></div></div>`).join('');
  document.getElementById('ocrTxt').textContent=(d&&d.ocr)?d.ocr:'Awaiting OCR processing…';
  openModal('ocrModal');
}
function copyOCR(){const t=document.getElementById('ocrTxt').textContent;navigator.clipboard&&navigator.clipboard.writeText(t);toast('📋','Copied','OCR text copied to clipboard');}

// ═══════════════════════════════════════
//  ARCHIVE
// ═══════════════════════════════════════
function buildArchive(filter=''){
  let list=DOCS.filter(d=>d.status==='archived');
  if(archTab==='recent')list=list.slice(0,4);
  else if(archTab==='pending')list=DOCS.filter(d=>d.status==='active'||d.status==='processing').slice(0,3);
  if(filter)list=list.filter(d=>(d.title+d.src).toLowerCase().includes(filter.toLowerCase()));
  if(archSort==='asc')list=[...list].sort((a,b)=>a.date.localeCompare(b.date));
  const paged=list.slice((archPage-1)*AP,archPage*AP);
  const t=document.getElementById('archTbl');t.innerHTML='';
  if(!paged.length){t.innerHTML=`<tr><td colspan="7"><div class="empty-state"><div class="empty-ico">📦</div><div>No archived documents found</div></div></td></tr>`;document.getElementById('archPager').innerHTML='';return;}
  const isA=ROLE==='Admin';
  paged.forEach(d=>{
    t.innerHTML+=`<tr><td class="mono-sm">${d.id}</td><td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.title}</td><td>${d.src}</td><td><span class="badge" style="background:var(--navy3);color:var(--text2)">${d.cat}</span></td><td class="mono-sm">${d.date}</td><td class="mono-sm">5 Years</td>
    <td><div class="btn-row"><button class="btn btn-blue" onclick="openDoc('${d.id}')">👁 View</button><button class="btn" onclick="dlDoc('${d.id}')">⬇</button>${isA?`<button class="btn btn-green" onclick="restoreDoc('${d.id}')">♻ Restore</button><button class="btn btn-red" onclick="delDoc('${d.id}')">🗑</button>`:''}</div></td></tr>`;
  });
  buildPager('archPager',list.length,AP,archPage,p=>{archPage=p;buildArchive(document.getElementById('archQ').value);});
}
function switchArchTab(tab,el){document.querySelectorAll('.a-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');archTab=tab;archPage=1;const m={all:'All Archived Documents',recent:'Recently Archived',pending:'Pending Archival'};document.getElementById('archTblTitle').textContent=m[tab];buildArchive();}
function sortArch(){archSort=archSort==='desc'?'asc':'desc';buildArchive(document.getElementById('archQ').value);toast('↕','Sorted','Date '+(archSort==='asc'?'ascending':'descending'));}
function runRetentionCheck(){toast('🔍','Retention Check','3 documents approaching retention limit. Review recommended.');}

// ═══════════════════════════════════════
//  ACCESS CONTROL
// ═══════════════════════════════════════
function buildUsers(list){
  document.getElementById('usersGrid').innerHTML=list.map(u=>{
    const isA=ROLE==='Admin',isSelf=u.user===UNAME;
    return`<div class="user-card">
      <div class="uc-hd"><div class="uc-av" style="background:${u.av}">${u.ini}</div><div><div class="uc-name">${u.name}</div><div class="uc-dept">${u.dept}</div></div></div>
      <div class="uc-role r-${u.role.toLowerCase()}">${u.role==='Admin'?'🔴':u.role==='Staff'?'🔵':'⚪'} ${u.role}</div>
      <div class="perms-wrap">${u.perms.map(p=>`<span class="perm">${p}</span>`).join('')}</div>
      <div class="status-dot" style="color:${u.status==='Active'?'var(--green)':'var(--red)'}">● ${u.status}</div>
      <div class="btn-row">
        ${isA?`<button class="btn btn-blue" onclick="openEditUser(${u.id})">✏ Edit</button>`:''}
        ${isA?`<button class="btn" onclick="changeRole(${u.id})">⇄ Role</button>`:''}
        ${isA&&!isSelf?`<button class="btn btn-red" onclick="suspendUser(${u.id})">${u.status==='Active'?'Suspend':'Activate'}</button>`:''}
      </div>
    </div>`;
  }).join('');
}
function filterUsers(role){buildUsers(role==='all'?USERS:USERS.filter(u=>u.role===role));}
function searchUsers(q){buildUsers(USERS.filter(u=>(u.name+u.user+u.dept).toLowerCase().includes(q.toLowerCase())));}
function openEditUser(id){const u=USERS.find(x=>x.id===id);if(!u)return;editUserId=id;document.getElementById('euName').value=u.name;document.getElementById('euUser').value=u.user;document.getElementById('euRole').value=u.role;document.getElementById('euDept').value=u.dept;document.getElementById('euEmail').value=u.email;document.getElementById('euStatus').value=u.status;openModal('editUserModal');}
function saveEditUser(){const u=USERS.find(x=>x.id===editUserId);if(!u)return;u.name=document.getElementById('euName').value||u.name;u.user=document.getElementById('euUser').value||u.user;u.role=document.getElementById('euRole').value;u.dept=document.getElementById('euDept').value||u.dept;u.email=document.getElementById('euEmail').value||u.email;u.status=document.getElementById('euStatus').value;addLog(`Edited user: ${u.name}`,UNAME,'Upload','✏️','rgba(139,92,246,.1)');buildUsers(USERS);toast('✅','Saved',u.name+' updated');closeModal('editUserModal');}
function changeRole(id){const u=USERS.find(x=>x.id===id);if(!u)return;const roles=['Admin','Staff','Viewer'],next=roles[(roles.indexOf(u.role)+1)%3];showConfirm('Change Role','👤',`Change ${u.name}'s role from ${u.role} to ${next}?`,()=>{u.role=next;u.perms=next==='Admin'?['Upload','Edit','Delete','View','Archive','Manage Users']:next==='Staff'?['Upload','Edit','View','Archive','Submit Compliance']:['View','Download'];addLog(`Role changed: ${u.name} → ${next}`,UNAME,'Upload','👤','rgba(14,165,233,.1)');buildUsers(USERS);toast('✅','Role Changed',`${u.name} is now ${next}`);});}
function suspendUser(id){const u=USERS.find(x=>x.id===id);if(!u)return;showConfirm(u.status==='Active'?'Suspend User':'Reactivate User','⚠️',`${u.status==='Active'?'Suspend':'Reactivate'} account for ${u.name}?`,()=>{u.status=u.status==='Active'?'Suspended':'Active';addLog(`${u.status==='Active'?'Activated':'Suspended'}: ${u.name}`,UNAME,'Upload','⚠️','rgba(239,68,68,.1)');buildUsers(USERS);toast('✅','Done',u.name+' account updated');});}
function addUser(){const n=document.getElementById('nuName').value.trim(),u=document.getElementById('nuUser').value.trim();if(!n||!u){toast('⚠️','Required','Name and username required');return;}const role=document.getElementById('nuRole').value;const cs=['linear-gradient(135deg,#0ea5e9,#0369a1)','linear-gradient(135deg,#10b981,#047857)','linear-gradient(135deg,#f97316,#b45309)'];USERS.push({id:USERS.length+1,name:n,user:u,dept:document.getElementById('nuDept').value||'PSED',role,email:document.getElementById('nuEmail').value||u+'@psed.gov.ph',status:'Active',av:cs[Math.floor(Math.random()*cs.length)],ini:n.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase(),perms:role==='Admin'?['Upload','Edit','Delete','View','Archive','Manage Users']:role==='Staff'?['Upload','Edit','View','Archive','Submit Compliance']:['View','Download']});addLog(`New user: ${n} (${role})`,UNAME,'Upload','👤','rgba(14,165,233,.1)');buildUsers(USERS);toast('✅','User Added',n+' ('+role+')');closeModal('addUserModal');['nuName','nuUser','nuDept','nuEmail','nuPwd'].forEach(i=>document.getElementById(i).value='');}
function exportUsers(){toast('📥','Exported','User list exported as CSV');}

// ═══════════════════════════════════════
//  LOGS
// ═══════════════════════════════════════
function addLog(act,usr,type,ico,bg){LOGS.unshift({act,usr,type,time:new Date().toISOString().slice(0,16).replace('T',' '),ico,bg});if(document.getElementById('pg-logs').classList.contains('active'))renderLogs();}
function renderLogs(){
  const fa=document.getElementById('logAct').value,fu=document.getElementById('logUsr').value,fd=document.getElementById('logDate').value;
  const fl=LOGS.filter(l=>(!fa||l.type===fa||l.act.toLowerCase().includes(fa.toLowerCase()))&&(!fu||l.usr===fu)&&(!fd||l.time.startsWith(fd)));
  document.getElementById('logCount').textContent=fl.length+' records';
  const paged=fl.slice((logsPage-1)*LP,logsPage*LP);
  document.getElementById('logsList').innerHTML=paged.length?paged.map(l=>`<div class="log-item"><div class="log-ico" style="background:${l.bg}">${l.ico}</div><div style="flex:1"><div class="log-act">${l.act}</div><div class="log-usr">by ${l.usr}</div></div><div class="log-time">${l.time}</div></div>`).join(''):`<div class="empty-state"><div class="empty-ico">📋</div><div>No log entries found</div></div>`;
  buildPager('logsPager',fl.length,LP,logsPage,p=>{logsPage=p;renderLogs();});
}
function resetLogFilters(){['logAct','logUsr'].forEach(i=>document.getElementById(i).value='');document.getElementById('logDate').value='';renderLogs();}
function confirmClearLogs(){showConfirm('Clear All Logs','⚠️','This will permanently delete all activity logs.',()=>{LOGS.length=0;renderLogs();toast('🗑','Cleared','All logs removed');});}

// ═══════════════════════════════════════
//  SETTINGS
// ═══════════════════════════════════════
function saveAllSettings(){toast('💾','All Settings Saved','All configurations updated successfully');}
function saveProfile(){const n=document.getElementById('profName').value;addLog('Updated profile settings',UNAME,'Upload','⚙️','rgba(100,116,139,.1)');toast('✅','Profile Saved',n+' profile updated');document.getElementById('profPwd').value='';}
function runBackup(){toast('💾','Backup Started','Creating system backup…');setTimeout(()=>toast('✅','Backup Complete','All data backed up'),2500);}
function confirmReset(){showConfirm('Reset System','⚠️','Reset ALL system settings to defaults? Data will not be deleted.',()=>toast('⚙️','Reset','Settings restored to defaults'));}
function confirmPurge(){showConfirm('Purge Expired','⚠️','Permanently delete all archived documents past their retention period?',()=>toast('🗑','Purged','Expired documents removed'));}

// ═══════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════
function buildNotifs(){
  const el=document.getElementById('notifList');
  if(!NOTIFS.length){el.innerHTML=`<div class="np-empty">No notifications</div>`;document.getElementById('notifBtn').classList.remove('dot');return;}
  el.innerHTML=NOTIFS.map((n,i)=>`<div class="np-item" onclick="dismissNotif(${i})"><div class="np-dot" style="background:${n.col}"></div><div><div class="np-txt">${n.txt}</div><div class="np-time">${n.time}</div></div></div>`).join('');
  document.getElementById('notifBtn').classList.toggle('dot',NOTIFS.length>0);
}
function dismissNotif(i){NOTIFS.splice(i,1);buildNotifs();}
function clearNotifs(){NOTIFS=[];buildNotifs();closeNotif();}
function toggleNotif(){document.getElementById('notifPanel').classList.toggle('open');}
function closeNotif(){document.getElementById('notifPanel').classList.remove('open');}

// ═══════════════════════════════════════
//  MODALS / CONFIRM / PAGER / TOAST
// ═══════════════════════════════════════
function openModal(id){document.getElementById(id).classList.add('open');}
function closeModal(id){document.getElementById(id).classList.remove('open');}
window.addEventListener('click',e=>{
  if(e.target.classList.contains('overlay'))e.target.classList.remove('open');
  if(!e.target.closest('#notifPanel')&&!e.target.closest('#notifBtn'))closeNotif();
});
function showConfirm(title,ico,msg,cb){
  document.getElementById('cfIco').textContent=ico;document.getElementById('cfTitle').textContent=title;document.getElementById('cfMsg').textContent=msg;
  confirmCB=cb;document.getElementById('cfOk').onclick=()=>{confirmCB&&confirmCB();closeModal('confirmModal');};
  openModal('confirmModal');
}
function buildPager(cid,total,pp,cur,onP){
  const pgs=Math.ceil(total/pp);const el=document.getElementById(cid);
  if(pgs<=1){el.innerHTML='';return;}
  let h=`<span class="pg-info">Page ${cur}/${pgs}</span>`;
  h+=`<button class="pg-btn" onclick="(${onP.toString()})(1)" ${cur===1?'disabled':''}>«</button>`;
  h+=`<button class="pg-btn" onclick="(${onP.toString()})(${cur-1})" ${cur===1?'disabled':''}>‹</button>`;
  for(let p=Math.max(1,cur-1);p<=Math.min(pgs,cur+1);p++)h+=`<button class="pg-btn${p===cur?' on':''}" onclick="(${onP.toString()})(${p})">${p}</button>`;
  h+=`<button class="pg-btn" onclick="(${onP.toString()})(${cur+1})" ${cur===pgs?'disabled':''}>›</button>`;
  h+=`<button class="pg-btn" onclick="(${onP.toString()})(${pgs})" ${cur===pgs?'disabled':''}>»</button>`;
  el.innerHTML=h;
}
let _tt;
function toast(ico,ttl,msg,delay=0){
  clearTimeout(_tt);const t=document.getElementById('toast');
  setTimeout(()=>{document.getElementById('tIco').textContent=ico;document.getElementById('tTtl').textContent=ttl;document.getElementById('tMsg').textContent=msg||'';t.classList.add('show');_tt=setTimeout(()=>t.classList.remove('show'),3200);},delay);
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.overlay.open').forEach(o=>o.classList.remove('open'));});