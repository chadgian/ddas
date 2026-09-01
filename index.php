<?php
require_once 'core/init.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Digital Document Archiving System</title>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Syne:wght@700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="styles.css">
</head>
<body>

<?php include 'components/login.php'; ?>

<div id="app">
<div class="layout">
<?php include 'components/sidebar.php'; ?>

<main class="main">
  <header class="topbar">
    <div class="tb-title" id="tbTitle">Dashboard</div>
    <div class="tb-srch">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input id="tbQ" placeholder="Quick search repository…" onkeydown="if(event.key==='Enter'){nav('search');doSearch(this.value)}">
    </div>
    <div class="tb-acts">
      <div class="ico-btn dot" id="notifBtn" onclick="toggleNotif()" title="Notifications">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
      </div>
      <div class="ico-btn" id="tbUploadBtn" onclick="nav('upload')" title="Upload Document">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      <div class="ico-btn" onclick="refreshCurrent()" title="Refresh">
        <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
      </div>
    </div>
  </header>

  <div class="notif-panel" id="notifPanel">
    <div class="np-hd"><span class="np-hd-t">Notifications</span><span class="np-clr" onclick="clearNotifs()">Clear All</span></div>
    <div id="notifList"></div>
  </div>

  <div class="page" id="pg-dashboard">
    <div class="ph ph-row">
      <div><h2>My Dashboard</h2><p>Policies and Systems Evaluation Division — Internal and Agency document workspace</p></div>
      <div class="ph-acts" id="dash-acts"></div>
    </div>
    <div id="dash-banner"></div>
    <div class="stat-grid sg-4" id="dash-stats"></div>
    <div class="g-charts">
      <div class="card">
        <div class="card-hd"><span class="card-t">Documents Uploaded — Monthly</span>
          <div class="btn-row"><button class="btn" onclick="toast('📊','Exported','Chart exported as image')">Export</button><span class="card-lnk" onclick="nav('search')">View All →</span></div>
        </div>
        <div class="bar-chart" id="barChart"></div>
        <div class="chart-legend"><div class="cl-item"><div class="cl-dot" style="background:var(--accent)"></div>Internal</div><div class="cl-item"><div class="cl-dot" style="background:var(--green)"></div>Agency</div></div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-t">By Document Type</span><span class="card-lnk" onclick="nav('search')">Filter →</span></div>
        <div class="donut-wrap">
          <svg width="130" height="130" viewBox="0 0 36 36" id="donutSvg"></svg>
          <div style="width:100%" id="donutLeg"></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><span class="card-t">Recent Documents</span>
        <div class="btn-row">
          <button class="btn" onclick="exportCSV()">📥 Export CSV</button>
          <button class="btn btn-blue" id="dash-new-btn" onclick="nav('upload')">+ New</button>
          <span class="card-lnk" onclick="nav('search')">View All →</span>
        </div>
      </div>
      <div class="tbl"><table><thead><tr><th>Doc ID</th><th>Title</th><th>Source</th><th>Document Type</th><th>Date Filed</th><th>Status</th><th>Actions</th></tr></thead><tbody id="dashTbl"></tbody></table></div>
    </div>
  </div>

  <div class="page" id="pg-dashboard-agency">
    <div class="ph ph-row">
      <div><h2>PRIME-HRM Dashboard</h2><p>Agency-only homepage for Evidence Requirement uploads and submission tracking.</p></div>
      <div class="ph-acts">
        <button class="btn-add" onclick="nav('requirements')">+ Upload ER</button>
      </div>
    </div>
    <div id="agencyDashBanner"></div>
    <div class="stat-grid sg-3" id="agencyDashStats"></div>
    <div class="g2">
      <div class="card">
        <div class="card-hd"><span class="card-t">Submission Shortcuts</span></div>
        <div style="display:flex;flex-direction:column;gap:10px">
          <button class="btn btn-blue" onclick="nav('requirements')">Open PRIME-HRM Upload</button>
          <button class="btn" onclick="nav('requirements')">Open My Submissions</button>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-t">Agency Notice</span></div>
        <div class="info-banner" style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.18);margin:0">
          <span style="font-size:18px">📎</span>
          <div>This account is for PRIME-HRM Evidence Requirements only. Internal repository and admin functions are not available here.</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:14px">
      <div class="card-hd"><span class="card-t">Recent PRIME-HRM Submissions</span><span style="font-size:10px;color:var(--text3);font-family:var(--mono)" id="agencyDashCount"></span></div>
      <div class="tbl"><table><thead><tr><th>Submission ID</th><th>Saved File</th><th>Folder Path</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody id="agencyDashTbl"></tbody></table></div>
    </div>
  </div>

  <div class="page" id="pg-upload">
    <div class="ph"><h2>Upload Documents</h2><p>Publish internal documents to the repository and control who can view them.</p></div>
    <div style="display:grid;grid-template-columns:1fr 360px;gap:18px">
      <div>
        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInp').click()" ondragover="event.preventDefault();this.classList.add('drag')" ondragleave="this.classList.remove('drag')" ondrop="handleDrop(event)">
          <div style="font-size:40px;margin-bottom:10px">📂</div>
          <h3>Drop your PDF here</h3>
          <p>or <span style="color:var(--accent)">browse files</span> to upload</p>
          <p style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:5px">PDF only • Max 50MB</p>
        </div>
        <input type="file" id="fileInp" accept=".pdf" style="display:none" onchange="handleFile(this.files[0])">
        <div class="file-card" id="fileCard">
          <div style="font-size:26px">📄</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600" id="fName">—</div><div style="font-size:11px;color:var(--text3);font-family:var(--mono)" id="fSize">—</div></div>
          <button class="btn" onclick="clearFile()">✕ Remove</button>
        </div>
        <div class="prog-wrap" id="progWrap">
          <div class="prog-info"><span id="progLbl">Uploading…</span><span style="font-family:var(--mono)" id="progPct">0%</span></div>
          <div class="prog-bar"><div class="prog-fill" id="progFill" style="background:linear-gradient(90deg,var(--accent),var(--purple))"></div></div>
          <div class="prog-txt" id="progTxt">Initializing…</div>
        </div>
        <div id="publishNotice" style="display:none;background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.2);border-radius:var(--r);padding:10px 14px;margin-top:10px;font-size:12px">
          <span class="pulse" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-right:7px;vertical-align:middle"></span>
          <strong>Publishing Document</strong> — Preparing document access and repository indexing.
        </div>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:16px">📋 Document Metadata</div>
        <div class="fld"><label>Document Title *</label><input id="mTitle" placeholder="e.g. Policy Memorandum on Records Retention"></div>
        <div class="fld"><label>Source Office *</label>
          <select id="mSource"><option value="">Select source…</option><option>PSED</option><option>Field Office</option><option>Regional Office</option><option>Legal Division</option><option>Administrative Division</option><option>Finance Division</option></select>
        </div>
        <div class="form-2">
          <div class="fld"><label>Document Type *</label>
            <select id="mType" onchange="renderDocTypeFields()"><option value="">Select…</option><option>Memorandum</option><option>Opinion/Query</option><option>Resolution</option><option>Report</option><option>Advisory</option><option>Others</option></select>
          </div>
          <div class="fld"><label>Retention Period</label>
            <select id="mRet"><option>1 Year</option><option>3 Years</option><option selected>5 Years</option><option>10 Years</option><option>Permanent</option></select>
          </div>
        </div>
        <div class="fld"><label>Roles Allowed To View *</label><div id="mRolesBox" class="role-check-grid"></div></div>
        <div id="docTypeFields"></div>
        <div class="fld"><label>Description</label><textarea id="mDesc" placeholder="Brief description…"></textarea></div>
        <div class="btn-row" style="gap:7px">
          <button class="btn-add" style="flex:2" onclick="submitUpload()">⬆ Upload to Repository</button>
          <button class="btn" onclick="resetUpload()">↺ Reset</button>
        </div>
      </div>
    </div>
  </div>

  <div class="page" id="pg-search">
    <div class="ph"><h2>Document Repository</h2><p>Search internal documents by title, document type, office, access role, and repository status.</p></div>
    <div class="card gap-b">
      <div class="search-box">
        <input id="searchInp" placeholder="Search by title, office, document type, memo subject, or visibility…">
        <button class="btn-search" onclick="doSearch(document.getElementById('searchInp').value)">Search</button>
      </div>
      <div class="filter-bar">
        <select class="fsel" id="fSrc" onchange="applyFilters()"><option value="">All Sources</option><option>PSED</option><option>Field Office</option><option>Regional Office</option><option>Legal Division</option><option>Administrative Division</option><option>Finance Division</option></select>
        <select class="fsel" id="fType" onchange="applyFilters()"><option value="">All Document Types</option><option>Memorandum</option><option>Opinion/Query</option><option>Resolution</option><option>Report</option><option>Advisory</option><option>Others</option></select>
        <select class="fsel" id="fRole" onchange="applyFilters()"><option value="">All Visibility</option><option>All Personnel</option><option>Division Chief</option><option>Field Director</option><option>Division Personnel</option><option>FO Personnel</option><option>Management Committee</option><option>Divisions</option></select>
        <select class="fsel" id="fSt" onchange="applyFilters()"><option value="">All Statuses</option><option>active</option><option>processing</option><option>archived</option><option>pending</option></select>
        <button class="btn" onclick="clearFilters()">✕ Clear</button>
        <button class="btn" onclick="toast('📥','Exported',srchRes.length+' results exported')">📥 Export</button>
      </div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:8px" id="srchCount"></div>
    </div>
    <div id="srchResults"></div>
    <div class="pager" id="srchPager"></div>
  </div>

  <div class="page" id="pg-requirements">
    <div class="ph ph-row">
      <div><h2>PRIME-HRM</h2><p id="req-sub">Agency uploads and registered-agency submission monitoring.</p></div>
      <div class="ph-acts" id="req-acts"></div>
    </div>
    <div class="stat-grid sg-3" id="prime-stats"></div>
    <div class="g2" id="primeUploadWrap">
      <div class="card">
        <div class="card-hd"><span class="card-t">Upload ER</span></div>
        <div class="info-banner" style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.18);margin:0 0 12px 0">
          <span style="font-size:18px">📁</span>
          <div>Your agency account is recorded automatically for every ER upload.</div>
        </div>
        <div class="form-2">
          <div class="fld"><label>Core Area *</label><select id="prFolder1" onchange="updatePrimeFolderSelectors()"></select></div>
          <div class="fld"><label>Pillar *</label><select id="prFolder2" onchange="updatePrimeFolderSelectors()"></select></div>
        </div>
        <div class="form-2">
          <div class="fld"><label>Pillar Element *</label><select id="prFolder3" onchange="updatePrimeFolderSelectors()"></select></div>
          <div class="fld"><label>Indicator *</label><select id="prIndicator" onchange="updatePrimeFolderPreview()"></select></div>
        </div>
        <div class="path-preview" id="primePathPreview">Upload path: Agency</div>
        <div class="dropzone" id="primeDrop" onclick="document.getElementById('prFile').click()">
          <div style="font-size:34px;margin-bottom:8px">📎</div>
          <h3>Attach ER PDF</h3>
          <p>Click to select a file for PRIME-HRM submission</p>
        </div>
        <input type="file" id="prFile" accept=".pdf" style="display:none" onchange="handlePrimeFile(this.files[0])">
        <div class="file-card" id="primeFileCard">
          <div style="font-size:26px">📄</div>
          <div style="flex:1"><div style="font-size:13px;font-weight:600" id="primeFileName">—</div><div style="font-size:11px;color:var(--text3);font-family:var(--mono)" id="primeFileSize">—</div></div>
          <button class="btn" onclick="clearPrimeFile()">✕ Remove</button>
        </div>
        <div class="btn-row" style="margin-top:12px">
          <button class="btn-add" onclick="submitPrime()">⬆ Submit ER</button>
        </div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-t">Submission Guide</span></div>
        <div class="info-banner" style="background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.18);margin:0 0 10px 0">
          <span style="font-size:18px">ℹ</span>
          <div>Use this page for agency PRIME-HRM ER uploads only. Internal documents should be uploaded through the Internal repository.</div>
        </div>
        <div style="font-size:12px;color:var(--text2);line-height:1.8">
          <p>The system automatically records the logged-in agency account for every upload.</p>
          <p>The hierarchy follows <strong>Agency → Core Area → Pillar → Pillar Element → Indicator</strong>.</p>
          <p>Agency users now go directly to selecting <strong>Core Area → Pillar → Pillar Element → Indicator</strong>, then attach the ER file.</p>
          <p>The file name will be prepared in the format <strong>[indicator code]-[filename]</strong>. Indicator codes will be finalized once you provide the exact mappings.</p>
          <p>Submitted ERs appear in My Submissions below for viewing and download tracking.</p>
        </div>
      </div>
    </div>
    <div class="card gap-b" style="margin-top:14px;display:none" id="primeAdminWrap">
      <div class="card-hd"><span class="card-t">Registered Agencies</span><span style="font-size:10px;color:var(--text3);font-family:var(--mono)" id="primeAgencyCount"></span></div>
      <div class="tbl"><table><thead><tr><th>Agency</th><th>Account</th><th>Status</th><th>ER Submissions</th><th>Last Submission</th><th>Actions</th></tr></thead><tbody id="primeAgencyTbl"></tbody></table></div>
    </div>
    <div class="card gap-b" style="margin-top:14px">
      <div class="card-hd"><span class="card-t" id="primeSubTitle">My Submissions</span><span style="font-size:10px;color:var(--text3);font-family:var(--mono)" id="primeCount"></span></div>
      <div class="tbl"><table><thead><tr><th>Submission ID</th><th>Agency</th><th>Original File</th><th>Saved File</th><th>Folder Path</th><th>Submitted</th><th>Status</th><th>Actions</th></tr></thead><tbody id="primeTbl"></tbody></table></div>
    </div>
  </div>

  <div class="page" id="pg-access">
    <div class="ph ph-row">
      <div><h2>User Management</h2><p>Manage PSED Admin, Internal, and Agency user access for DDAS.</p></div>
      <div class="ph-acts">
        <button class="btn" onclick="toast('📥','Exported','User list exported')">📥 Export</button>
        <button class="btn-add" onclick="openModal('addUserModal')">+ Add User</button>
      </div>
    </div>
    <div class="stat-grid sg-3 gap-b">
      <div class="stat-card" style="--sc:var(--red);cursor:default"><div class="sc-lbl">PSED Admin</div><div class="sc-val" style="color:var(--red)" id="umAdminCount">0</div><div class="sc-sub">Full system access</div><div class="sc-ico">👑</div></div>
      <div class="stat-card" style="--sc:var(--accent);cursor:default"><div class="sc-lbl">Internal Users</div><div class="sc-val" style="color:var(--accent)" id="umInternalCount">0</div><div class="sc-sub">Repository upload and view access</div><div class="sc-ico">🏢</div></div>
      <div class="stat-card" style="--sc:var(--green);cursor:default"><div class="sc-lbl">Agency Accounts</div><div class="sc-val" style="color:var(--green)" id="umAgencyCount">0</div><div class="sc-sub">PRIME-HRM uploads</div><div class="sc-ico">🌐</div></div>
    </div>
    <div class="card gap-b">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="filterUsers('all')">All</button>
        <button class="btn" onclick="filterUsers('PSED Admin')">PSED Admin</button>
        <button class="btn" onclick="filterUsers('Internal')">Internal</button>
        <button class="btn" onclick="filterUsers('Agency')">Agency</button>
        <input id="userQ" placeholder="Search users…" style="background:var(--navy3);border:1px solid var(--border);border-radius:var(--r);padding:6px 12px;color:var(--text);font-size:12px;outline:none;margin-left:auto" oninput="searchUsers(this.value)">
      </div>
    </div>
    <div class="users-grid" id="usersGrid"></div>
    <div class="g2">
      <div class="card">
        <div class="card-hd"><span class="card-t">Access Matrix</span></div>
        <div class="tbl"><table><thead><tr><th>Permission</th><th>PSED Admin</th><th>Internal</th><th>Agency</th></tr></thead>
        <tbody>
          <tr><td>Upload Internal Documents</td><td>✅</td><td>✅</td><td>❌</td></tr>
          <tr><td>View Internal Repository</td><td>✅</td><td>✅</td><td>❌</td></tr>
          <tr><td>Submit PRIME-HRM ERs</td><td>✅</td><td>❌</td><td>✅</td></tr>
          <tr><td>Manage Users</td><td>✅</td><td>❌</td><td>❌</td></tr>
          <tr><td>View Activity Logs</td><td>✅</td><td>✅</td><td>❌</td></tr>
          <tr><td>Send Notifications</td><td>✅</td><td>✅</td><td>❌</td></tr>
        </tbody></table></div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-t">Internal Roles</span></div>
        <div id="internalRoleList" class="role-pill-grid"></div>
      </div>
    </div>
  </div>

  <div class="page" id="pg-logs">
    <div class="ph ph-row">
      <div><h2>Activity Logs</h2><p>All user actions recorded for audit and compliance purposes</p></div>
      <div class="ph-acts">
        <button class="btn" onclick="toast('📥','Exported','Activity log exported as CSV')">📥 Export CSV</button>
        <button class="btn btn-red" onclick="confirmClearLogs()">🗑 Clear Logs</button>
      </div>
    </div>
    <div class="card gap-b">
      <div class="filter-bar">
        <select class="fsel" id="logAct" onchange="renderLogs()"><option value="">All Actions</option><option>Upload</option><option>Download</option><option>Delete</option><option>View</option><option>Login</option><option>Logout</option><option>Settings</option></select>
        <select class="fsel" id="logUsr" onchange="renderLogs()"><option value="">All Users</option></select>
        <input type="date" id="logDate" onchange="renderLogs()" style="background:var(--navy3);border:1px solid var(--border);border-radius:var(--r);padding:6px 10px;color:var(--text);font-size:12px;outline:none;font-family:var(--mono)">
        <button class="btn" onclick="resetLogFilters()">✕ Reset</button>
      </div>
    </div>
    <div class="card">
      <div class="card-hd"><span class="card-t">Recent Activity</span><span style="font-size:10px;color:var(--text3);font-family:var(--mono)" id="logCount"></span></div>
      <div id="logsList"></div>
      <div class="pager" id="logsPager"></div>
    </div>
  </div>

  <div class="page" id="pg-settings">
    <div class="ph ph-row">
      <div><h2>System Settings</h2><p>Configure DDAS preferences and system parameters</p></div>
      <button class="btn-add" onclick="saveAllSettings()">💾 Save All</button>
    </div>
    <div class="settings-grid" id="settingsGrid">
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🗄 Storage Settings</div>
        <div class="fld"><label>Main Storage Folder</label><input id="storageRoot" placeholder="e.g. C:\xampp\htdocs\ddas\storage"></div>
        <div class="form-2">
          <div class="fld"><label>Internal Upload Folder</label><input id="internalSubdir" placeholder="internal"></div>
          <div class="fld"><label>PRIME-HRM Upload Folder</label><input id="primeSubdir" placeholder="prime_hrm"></div>
        </div>
        <div class="fld"><label>Default Retention</label><select><option>1 Year</option><option>3 Years</option><option selected>5 Years</option><option>10 Years</option><option>Permanent</option></select></div>
        <div class="card-t" style="font-size:11px;color:var(--text3);margin-bottom:5px;font-weight:400">Storage: 47.3 GB / 500 GB</div>
        <div class="storage-bar-outer"><div class="storage-bar-inner" style="width:9.5%"></div></div>
        <button class="btn btn-blue" style="margin-top:10px" onclick="saveStorageSettings()">Save Storage</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">📣 Send Notification</div>
        <div class="fld"><label>Audience</label><select id="notifAudience"><option>All Personnel</option><option>PSED Admin</option><option>Internal Users</option><option>Agency Accounts</option></select></div>
        <div class="fld"><label>Subject</label><input id="notifSubject" placeholder="e.g. Repository update notice"></div>
        <div class="fld"><label>Message</label><textarea id="notifMessage" placeholder="Type the notification to send…"></textarea></div>
        <button class="btn btn-blue" style="margin-top:12px" onclick="sendNotification()">Send Notification</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">ℹ System Information</div>
        <div class="sys-row"><span class="sys-k">Version</span><span>DDAS v3.0.0</span></div>
        <div class="sys-row"><span class="sys-k">Server Status</span><span style="color:var(--green)">● Online</span></div>
        <div class="sys-row"><span class="sys-k">Last Backup</span><span>Today 03:00 AM</span></div>
        <div class="sys-row"><span class="sys-k">Total Documents</span><span id="sysTotal">0</span></div>
        <div class="btn-row" style="margin-top:11px;flex-wrap:wrap">
          <button class="btn btn-blue" onclick="runBackup()">💾 Backup Now</button>
          <button class="btn" onclick="toast('🔄','Up to date','DDAS v3.0.0 is the latest version')">🔄 Updates</button>
          <button class="btn btn-red" onclick="confirmReset()">⚠ Reset</button>
        </div>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">👤 My Profile</div>
        <div class="fld"><label>Full Name</label><input id="profName" value="Juan Dela Cruz"></div>
        <div class="fld"><label>Username</label><input id="profUser" value="admin.dela_cruz"></div>
        <div class="fld"><label>Email</label><input id="profEmail" type="email" value="admin@psed.gov.ph"></div>
        <div class="fld"><label>Current Password</label><input id="profOldPwd" type="password" placeholder="Required only when changing password"></div>
        <div class="fld"><label>New Password</label><input id="profPwd" type="password" placeholder="Leave blank to keep current"></div>
        <button class="btn btn-blue" onclick="saveProfile()">Save Profile</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🖨 Print & Export</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <button class="btn" onclick="toast('🖨','Printing','Monthly report sent to printer')">📄 Print Monthly Report</button>
          <button class="btn" onclick="toast('📥','Exporting','All documents exported as CSV')">📥 Export All Documents (CSV)</button>
          <button class="btn" onclick="toast('📊','Exporting','All documents exported as Excel')">📊 Export All (Excel)</button>
          <button class="btn" onclick="toast('🔒','Exported','Full audit log exported securely')">🔒 Export Audit Log</button>
        </div>
      </div>
    </div>
  </div>

</main>
</div>
</div>

<div class="overlay" id="docModal">
  <div class="modal lg">
    <div class="modal-hd"><div class="modal-title" id="dmTitle">Document Viewer</div><div class="modal-x" onclick="closeModal('docModal')">✕</div></div>
    <div class="doc-preview"><div style="text-align:center"><div style="font-size:52px;margin-bottom:8px">📄</div><div style="font-family:var(--mono);font-size:10px">PDF PREVIEW</div><div style="font-size:10px;color:var(--text3)" id="dmId">—</div></div></div>
    <div class="meta-grid" id="dmMeta"></div>
    <div class="section-lbl">Document Notes</div>
    <div class="ocr-box-txt" id="dmOcr"></div>
    <div id="dmViewerNote" style="margin-top:10px"></div>
    <div class="modal-acts" id="dmActs"></div>
  </div>
</div>

<div class="overlay" id="editMetaModal">
  <div class="modal">
    <div class="modal-hd"><div class="modal-title">Edit Document Metadata</div><div class="modal-x" onclick="closeModal('editMetaModal')">✕</div></div>
    <div class="fld"><label>Document Title</label><input id="emT"></div>
    <div class="form-2">
      <div class="fld"><label>Source</label><select id="emSrc"><option>PSED</option><option>Field Office</option><option>Regional Office</option><option>Legal Division</option><option>Administrative Division</option><option>Finance Division</option></select></div>
      <div class="fld"><label>Document Type</label><select id="emType"><option>Memorandum</option><option>Opinion/Query</option><option>Resolution</option><option>Report</option><option>Advisory</option><option>Others</option></select></div>
    </div>
    <div class="form-2">
      <div class="fld"><label>Retention</label><select id="emRet"><option>1 Year</option><option>3 Years</option><option>5 Years</option><option>10 Years</option><option>Permanent</option></select></div>
      <div class="fld"><label>Visibility</label><input id="emAudience" placeholder="e.g. All Personnel"></div>
    </div>
    <div class="fld"><label>Description</label><textarea id="emDesc"></textarea></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('editMetaModal')">Cancel</button>
      <button class="btn btn-blue" onclick="saveMeta()">💾 Save Changes</button>
    </div>
  </div>
</div>

<div class="overlay" id="addUserModal">
  <div class="modal md">
    <div class="modal-hd"><div class="modal-title" id="addUserTitle">Add New User</div><div class="modal-x" onclick="closeModal('addUserModal')">✕</div></div>
    <div class="fld"><label>Full Name *</label><input id="nuName" placeholder="e.g. Juan Dela Cruz"></div>
    <div class="form-2">
      <div class="fld"><label>Username *</label><input id="nuUser" placeholder="juan.dela_cruz"></div>
      <div class="fld"><label>Access Group *</label><select id="nuAccess" onchange="toggleUserRoleFields('nu')"><option>PSED Admin</option><option selected>Internal</option><option>Agency</option></select></div>
    </div>
    <div class="fld"><label>Department</label><input id="nuDept" placeholder="e.g. Finance Department"></div>
    <div class="fld" id="nuAgencyField" style="display:none"><label>Agency Name</label><input id="nuAgency" placeholder="e.g. CGO Bago"></div>
    <div class="fld"><label>Email</label><input id="nuEmail" type="email" placeholder="juan@psed.gov.ph"></div>
    <div class="fld" id="nuRolesField"><label>Internal Roles</label><div id="nuRolesBox" class="role-check-grid"></div></div>
    <div class="fld"><label>Temporary Password</label><input id="nuPwd" type="password" placeholder="Set initial password"></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('addUserModal')">Cancel</button>
      <button class="btn btn-blue" onclick="addUser()">Add User</button>
    </div>
  </div>
</div>

<div class="overlay" id="editUserModal">
  <div class="modal md">
    <div class="modal-hd"><div class="modal-title">Edit User</div><div class="modal-x" onclick="closeModal('editUserModal')">✕</div></div>
    <div class="fld"><label>Full Name</label><input id="euName"></div>
    <div class="form-2">
      <div class="fld"><label>Username</label><input id="euUser"></div>
      <div class="fld"><label>Access Group</label><select id="euAccess" onchange="toggleUserRoleFields('eu')"><option>PSED Admin</option><option>Internal</option><option>Agency</option></select></div>
    </div>
    <div class="fld"><label>Department</label><input id="euDept"></div>
    <div class="fld" id="euAgencyField" style="display:none"><label>Agency Name</label><input id="euAgency"></div>
    <div class="fld"><label>Email</label><input id="euEmail" type="email"></div>
    <div class="fld" id="euRolesField"><label>Internal Roles</label><div id="euRolesBox" class="role-check-grid"></div></div>
    <div class="fld"><label>Status</label><select id="euStatus"><option>Active</option><option>Suspended</option></select></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('editUserModal')">Cancel</button>
      <button class="btn btn-blue" onclick="saveEditUser()">Save Changes</button>
    </div>
  </div>
</div>

<div class="overlay" id="confirmModal">
  <div class="modal md">
    <div class="confirm-ico" id="cfIco">⚠️</div>
    <div class="confirm-t" id="cfTitle">Are you sure?</div>
    <div class="confirm-msg" id="cfMsg">This action cannot be undone.</div>
    <div class="modal-acts" style="margin-top:16px">
      <button class="btn" onclick="closeModal('confirmModal')">Cancel</button>
      <button class="btn btn-red" id="cfOk">Confirm</button>
    </div>
  </div>
</div>

<div class="toast" id="toast">
  <div class="toast-ico" id="tIco"></div>
  <div><div class="toast-ttl" id="tTtl"></div><div class="toast-msg" id="tMsg"></div></div>
</div>

<script src="script.js"></script>
<script src="js/jquery-4.0.0.min.js"></script>
</body>
</html>
