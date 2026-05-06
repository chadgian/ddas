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

<!-- ═══════════════ LOGIN ═══════════════ -->
<?php include 'components/login.php'; ?>

<!-- ═══════════════ APP ═══════════════ -->
<div id="app">
<div class="layout">

<!-- ── SIDEBAR ── -->
<?php include 'components/sidebar.php'; ?>

<!-- ── MAIN ── -->
<main class="main">
  <header class="topbar">
    <div class="tb-title" id="tbTitle">Dashboard</div>
    <div class="tb-srch">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      <input id="tbQ" placeholder="Quick search documents…" onkeydown="if(event.key==='Enter'){nav('search');doSearch(this.value)}">
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

  <!-- Notification Panel -->
  <div class="notif-panel" id="notifPanel">
    <div class="np-hd"><span class="np-hd-t">Notifications</span><span class="np-clr" onclick="clearNotifs()">Clear All</span></div>
    <div id="notifList"></div>
  </div>

  <!-- ═══ DASHBOARD ═══ -->
  <div class="page active" id="pg-dashboard">
    <div class="ph ph-row">
      <div><h2>Dashboard Overview</h2><p>Policies and Systems Evaluation Division — Document Management</p></div>
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
        <div class="chart-legend"><div class="cl-item"><div class="cl-dot" style="background:var(--accent)"></div>Uploaded</div><div class="cl-item"><div class="cl-dot" style="background:var(--purple)"></div>Archived</div></div>
      </div>
      <div class="card">
        <div class="card-hd"><span class="card-t">By Category</span><span class="card-lnk" onclick="nav('search')">Filter →</span></div>
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
      <div class="tbl"><table><thead><tr><th>Doc ID</th><th>Title</th><th>Source</th><th>Category</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody id="dashTbl"></tbody></table></div>
    </div>
  </div>

  <!-- ═══ UPLOAD ═══ -->
  <div class="page" id="pg-upload">
    <div class="ph"><h2>Upload Document</h2><p>Submit scanned image-based PDF files for archiving and OCR processing</p></div>
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
        <div id="ocrRunning" style="display:none;background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.2);border-radius:var(--r);padding:10px 14px;margin-top:10px;font-size:12px">
          <span class="pulse" style="display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);margin-right:7px;vertical-align:middle"></span>
          <strong>OCR Processing Active</strong> — Extracting text from scanned image…
        </div>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:16px">📋 Document Metadata</div>
        <div class="fld"><label>Document Title *</label><input id="mTitle" placeholder="e.g. Municipal Budget Report 2025"></div>
        <div class="fld"><label>Source (Municipality / Province) *</label>
          <select id="mSource"><option value="">Select source…</option><option>Iloilo City</option><option>Province of Iloilo</option><option>Municipality of Oton</option><option>Municipality of Pavia</option><option>Municipality of Santa Barbara</option><option>Municipality of Leganes</option><option>Municipality of Zarraga</option><option>Municipality of Cabatuan</option></select>
        </div>
        <div class="form-2">
          <div class="fld"><label>Date Received *</label><input id="mDate" type="date"></div>
          <div class="fld"><label>Category *</label>
            <select id="mCat"><option value="">Select…</option><option>Budget & Finance</option><option>Ordinances</option><option>Resolutions</option><option>Administrative</option><option>Legal</option><option>Reports</option><option>Permits</option><option>Correspondence</option></select>
          </div>
        </div>
        <div class="fld"><label>Description</label><textarea id="mDesc" placeholder="Brief description…"></textarea></div>
        <div class="fld"><label>Retention Period</label>
          <select id="mRet"><option>1 Year</option><option>3 Years</option><option selected>5 Years</option><option>10 Years</option><option>Permanent</option></select>
        </div>
        <div class="btn-row" style="gap:7px">
          <button class="btn-add" style="flex:2" onclick="submitUpload()">⬆ Upload & Process</button>
          <button class="btn" onclick="resetUpload()">↺ Reset</button>
        </div>
      </div>
    </div>
  </div>

  <!-- ═══ SEARCH ═══ -->
  <div class="page" id="pg-search">
    <div class="ph"><h2>Search & Retrieve</h2><p>Search across all document metadata and OCR-extracted text content</p></div>
    <div class="card gap-b">
      <div class="search-box">
        <input id="searchInp" placeholder="Search by title, keyword, source, category, content…">
        <button class="btn-search" onclick="doSearch(document.getElementById('searchInp').value)">Search</button>
      </div>
      <div class="filter-bar">
        <select class="fsel" id="fSrc" onchange="applyFilters()"><option value="">All Sources</option><option>Iloilo City</option><option>Province of Iloilo</option><option>Municipality of Oton</option><option>Municipality of Pavia</option><option>Municipality of Santa Barbara</option><option>Municipality of Leganes</option></select>
        <select class="fsel" id="fCat" onchange="applyFilters()"><option value="">All Categories</option><option>Budget & Finance</option><option>Ordinances</option><option>Resolutions</option><option>Administrative</option><option>Legal</option><option>Reports</option><option>Permits</option><option>Correspondence</option></select>
        <select class="fsel" id="fYr" onchange="applyFilters()"><option value="">All Years</option><option>2025</option><option>2024</option><option>2023</option></select>
        <select class="fsel" id="fSt" onchange="applyFilters()"><option value="">All Statuses</option><option>active</option><option>processing</option><option>archived</option><option>pending</option></select>
        <button class="btn" onclick="clearFilters()">✕ Clear</button>
        <button class="btn" onclick="toast('📥','Exported',srchRes.length+' results exported')">📥 Export</button>
      </div>
      <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:8px" id="srchCount"></div>
    </div>
    <div id="srchResults"></div>
    <div class="pager" id="srchPager"></div>
  </div>

  <!-- ═══ REQUIREMENTS ═══ -->
  <div class="page" id="pg-requirements">
    <div class="ph ph-row">
      <div><h2>Requirements & Compliance</h2><p id="req-sub">Document submission checklist and deadlines</p></div>
      <div class="ph-acts" id="req-acts"></div>
    </div>
    <div class="stat-grid sg-4" id="req-stats"></div>
    <div class="card gap-b">
      <div class="filter-bar">
        <input id="reqQ" placeholder="Search requirements…" style="background:var(--navy3);border:1px solid var(--border);border-radius:var(--r);padding:7px 12px;color:var(--text);font-size:12px;outline:none;flex:1;min-width:160px" oninput="renderReqs()">
        <select class="fsel" id="reqFst" onchange="renderReqs()"><option value="">All Statuses</option><option value="pending">Pending</option><option value="submitted">Submitted</option><option value="approved">Approved</option><option value="overdue">Overdue</option><option value="rejected">Rejected</option></select>
        <select class="fsel" id="reqFcat" onchange="renderReqs()"><option value="">All Categories</option><option>Financial</option><option>Legal</option><option>Administrative</option><option>Compliance</option><option>Reports</option></select>
        <select class="fsel" id="reqFpri" onchange="renderReqs()"><option value="">All Priorities</option><option>High</option><option>Medium</option><option>Low</option></select>
        <button class="btn" onclick="clearReqFilters()">✕ Clear</button>
      </div>
    </div>
    <div id="reqList"></div>
  </div>

  <!-- ═══ OCR ═══ -->
  <div class="page" id="pg-ocr">
    <div class="ph ph-row">
      <div><h2>OCR Processing Queue</h2><p>Automatic text extraction from scanned image-based PDF documents</p></div>
      <div class="ph-acts">
        <button class="btn" onclick="refreshOCR()">↺ Refresh</button>
        <button class="btn-add" onclick="processAllOCR()">⚡ Process All</button>
      </div>
    </div>
    <div class="stat-grid sg-3 gap-b" id="ocr-stats"></div>
    <div class="card">
      <div class="card-hd"><span class="card-t">Processing Queue</span><button class="btn" onclick="toast('📥','Exported','OCR log exported')">📥 Export Log</button></div>
      <div class="tbl"><table><thead><tr><th>Doc ID</th><th>Title</th><th>Source</th><th>Date</th><th>Status</th><th>Progress</th><th>Accuracy</th><th>Actions</th></tr></thead><tbody id="ocrTbl"></tbody></table></div>
    </div>
  </div>

  <!-- ═══ ARCHIVE ═══ -->
  <div class="page" id="pg-archive">
    <div class="ph ph-row">
      <div><h2>Document Archive</h2><p>Long-term storage for documents past their retention period</p></div>
      <div class="ph-acts">
        <button class="btn" onclick="runRetentionCheck()">🔍 Retention Check</button>
        <button class="btn" onclick="toast('📥','Exported','Archive list exported')">📥 Export</button>
      </div>
    </div>
    <div class="arch-tabs">
      <div class="a-tab active" id="at-all" onclick="switchArchTab('all',this)">All Archived</div>
      <div class="a-tab" id="at-recent" onclick="switchArchTab('recent',this)">Recently Archived</div>
      <div class="a-tab" id="at-pending" onclick="switchArchTab('pending',this)">Pending Archival</div>
    </div>
    <div class="card">
      <div class="card-hd">
        <span class="card-t" id="archTblTitle">All Archived Documents</span>
        <div class="btn-row">
          <input id="archQ" placeholder="Search…" style="background:var(--navy3);border:1px solid var(--border);border-radius:var(--r);padding:6px 10px;color:var(--text);font-size:12px;outline:none" oninput="buildArchive(this.value)">
          <button class="btn" onclick="sortArch()">↕ Sort</button>
        </div>
      </div>
      <div class="tbl"><table><thead><tr><th>Doc ID</th><th>Title</th><th>Source</th><th>Category</th><th>Date</th><th>Retention</th><th>Actions</th></tr></thead><tbody id="archTbl"></tbody></table></div>
      <div class="pager" id="archPager"></div>
    </div>
  </div>

  <!-- ═══ ACCESS CONTROL ═══ -->
  <div class="page" id="pg-access">
    <div class="ph ph-row">
      <div><h2>Access Control</h2><p>Manage user roles and permissions for DDAS</p></div>
      <div class="ph-acts">
        <button class="btn" onclick="toast('📥','Exported','User list exported')">📥 Export</button>
        <button class="btn-add" onclick="openModal('addUserModal')">+ Add User</button>
      </div>
    </div>
    <div class="stat-grid sg-3 gap-b">
      <div class="stat-card" style="--sc:var(--red);cursor:default"><div class="sc-lbl">Administrators</div><div class="sc-val" style="color:var(--red)">4</div><div class="sc-sub">Full system access</div><div class="sc-ico">👑</div></div>
      <div class="stat-card" style="--sc:var(--accent);cursor:default"><div class="sc-lbl">Staff Members</div><div class="sc-val" style="color:var(--accent)">18</div><div class="sc-sub">Upload & edit access</div><div class="sc-ico">👤</div></div>
      <div class="stat-card" style="--sc:var(--text3);cursor:default"><div class="sc-lbl">Viewers</div><div class="sc-val" style="color:var(--text3)">16</div><div class="sc-sub">View & download only</div><div class="sc-ico">👁</div></div>
    </div>
    <div class="card gap-b">
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <button class="btn btn-blue" onclick="filterUsers('all')">All</button>
        <button class="btn" onclick="filterUsers('Admin')">Admins</button>
        <button class="btn" onclick="filterUsers('Staff')">Staff</button>
        <button class="btn" onclick="filterUsers('Viewer')">Viewers</button>
        <input id="userQ" placeholder="Search users…" style="background:var(--navy3);border:1px solid var(--border);border-radius:var(--r);padding:6px 12px;color:var(--text);font-size:12px;outline:none;margin-left:auto" oninput="searchUsers(this.value)">
      </div>
    </div>
    <div class="users-grid" id="usersGrid"></div>
    <div class="card">
      <div class="card-hd"><span class="card-t">Role Permissions Matrix</span></div>
      <div class="tbl"><table><thead><tr><th>Permission</th><th>Admin</th><th>Staff</th><th>Viewer</th></tr></thead>
      <tbody>
        <tr><td>Upload Documents</td><td>✅</td><td>✅</td><td>❌</td></tr>
        <tr><td>Edit Metadata</td><td>✅</td><td>✅</td><td>❌</td></tr>
        <tr><td>View Documents</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>Download Documents</td><td>✅</td><td>✅</td><td>✅</td></tr>
        <tr><td>Delete Documents</td><td>✅</td><td>❌</td><td>❌</td></tr>
        <tr><td>Archive / Restore</td><td>✅</td><td>✅</td><td>❌</td></tr>
        <tr><td>Manage Requirements</td><td>✅</td><td>❌</td><td>❌</td></tr>
        <tr><td>Submit Compliance</td><td>✅</td><td>✅</td><td>❌</td></tr>
        <tr><td>Manage Users</td><td>✅</td><td>❌</td><td>❌</td></tr>
        <tr><td>View Audit Logs</td><td>✅</td><td>❌</td><td>❌</td></tr>
        <tr><td>System Settings</td><td>✅</td><td>❌</td><td>❌</td></tr>
      </tbody></table></div>
    </div>
  </div>

  <!-- ═══ LOGS ═══ -->
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
        <select class="fsel" id="logAct" onchange="renderLogs()"><option value="">All Actions</option><option>Upload</option><option>Download</option><option>Delete</option><option>View</option><option>Login</option><option>Logout</option><option>Archive</option></select>
        <select class="fsel" id="logUsr" onchange="renderLogs()"><option value="">All Users</option><option>admin.dela_cruz</option><option>maria.santos</option><option>pedro.garcia</option><option>ana.reyes</option><option>luis.mendoza</option></select>
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

  <!-- ═══ SETTINGS ═══ -->
  <div class="page" id="pg-settings">
    <div class="ph ph-row">
      <div><h2>System Settings</h2><p>Configure DDAS preferences and system parameters</p></div>
      <button class="btn-add" onclick="saveAllSettings()">💾 Save All</button>
    </div>
    <div class="settings-grid" id="settingsGrid">
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🔎 OCR Settings</div>
        <div class="fld"><label>OCR Engine</label><select><option>Tesseract OCR</option><option>Google Vision API</option><option>AWS Textract</option></select></div>
        <div class="fld"><label>Language</label><select><option>English</option><option>Filipino</option><option>English + Filipino</option></select></div>
        <div class="fld"><label>Quality Mode</label><select><option>Standard</option><option selected>High Quality</option><option>Maximum</option></select></div>
        <div class="toggle-row">Auto-OCR on Upload <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <button class="btn btn-blue" style="margin-top:12px" onclick="toast('✅','Saved','OCR settings saved')">Save OCR Settings</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🗄 Storage Settings</div>
        <div class="fld"><label>Primary Storage</label><select><option>Local Server</option><option>Network Attached Storage</option><option>Cloud (AWS S3)</option></select></div>
        <div class="fld"><label>Archive Storage</label><select><option>Cold Storage</option><option>Tape Backup</option><option>Cloud Archive</option></select></div>
        <div class="fld"><label>Default Retention</label><select><option>1 Year</option><option>3 Years</option><option selected>5 Years</option><option>10 Years</option><option>Permanent</option></select></div>
        <div class="card-t" style="font-size:11px;color:var(--text3);margin-bottom:5px;font-weight:400">Storage: 47.3 GB / 500 GB</div>
        <div class="storage-bar-outer"><div class="storage-bar-inner" style="width:9.5%"></div></div>
        <button class="btn btn-blue" style="margin-top:10px" onclick="toast('✅','Saved','Storage settings saved')">Save Storage</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🔔 Notifications</div>
        <div class="toggle-row">OCR Complete Alerts <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <div class="toggle-row">New Upload Alerts <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <div class="toggle-row">Requirement Deadline Reminders <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <div class="toggle-row">System Error Alerts <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <div class="toggle-row">Daily Summary Email <label class="toggle"><input type="checkbox" checked><span class="tslider"></span></label></div>
        <button class="btn btn-blue" style="margin-top:12px" onclick="toast('✅','Saved','Notification settings saved')">Save</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">ℹ System Information</div>
        <div class="sys-row"><span class="sys-k">Version</span><span>DDAS v2.5.0</span></div>
        <div class="sys-row"><span class="sys-k">Server Status</span><span style="color:var(--green)">● Online</span></div>
        <div class="sys-row"><span class="sys-k">Last Backup</span><span>Today 03:00 AM</span></div>
        <div class="sys-row"><span class="sys-k">Total Documents</span><span id="sysTotal">2,847</span></div>
        <div class="btn-row" style="margin-top:11px;flex-wrap:wrap">
          <button class="btn btn-blue" onclick="runBackup()">💾 Backup Now</button>
          <button class="btn" onclick="toast('🔄','Up to date','DDAS v2.5.0 is the latest version')">🔄 Updates</button>
          <button class="btn btn-red" onclick="confirmReset()">⚠ Reset</button>
        </div>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">👤 My Profile</div>
        <div class="fld"><label>Full Name</label><input id="profName" value="Admin Dela Cruz"></div>
        <div class="fld"><label>Username</label><input id="profUser" value="admin.dela_cruz"></div>
        <div class="fld"><label>Email</label><input id="profEmail" type="email" value="admin@psed.gov.ph"></div>
        <div class="fld"><label>New Password</label><input id="profPwd" type="password" placeholder="Leave blank to keep current"></div>
        <button class="btn btn-blue" onclick="saveProfile()">Save Profile</button>
      </div>
      <div class="card">
        <div class="card-t" style="margin-bottom:14px">🖨 Print & Export</div>
        <div style="display:flex;flex-direction:column;gap:7px">
          <button class="btn" onclick="toast('🖨','Printing','Monthly report sent to printer')">📄 Print Monthly Report</button>
          <button class="btn" onclick="toast('🖨','Printing','Annual report sent to printer')">📄 Print Annual Report</button>
          <button class="btn" onclick="toast('📥','Exporting','All documents exported as CSV')">📥 Export All Documents (CSV)</button>
          <button class="btn" onclick="toast('📊','Exporting','All documents exported as Excel')">📊 Export All (Excel)</button>
          <button class="btn" onclick="toast('🔒','Exported','Full audit log exported securely')">🔒 Export Audit Log</button>
          <button class="btn btn-red" onclick="confirmPurge()">🗑 Purge Expired Documents</button>
        </div>
      </div>
    </div>
  </div>

</main>
</div>
</div>

<!-- ═══════════════ MODALS ═══════════════ -->

<!-- Document Viewer -->
<div class="overlay" id="docModal">
  <div class="modal lg">
    <div class="modal-hd"><div class="modal-title" id="dmTitle">Document Viewer</div><div class="modal-x" onclick="closeModal('docModal')">✕</div></div>
    <div class="doc-preview"><div style="text-align:center"><div style="font-size:52px;margin-bottom:8px">📄</div><div style="font-family:var(--mono);font-size:10px">SCANNED PDF PREVIEW</div><div style="font-size:10px;color:var(--text3)" id="dmId">—</div></div></div>
    <div class="meta-grid" id="dmMeta"></div>
    <div class="section-lbl">OCR Extracted Text</div>
    <div class="ocr-box-txt" id="dmOcr"></div>
    <div id="dmViewerNote" style="margin-top:10px"></div>
    <div class="modal-acts" id="dmActs"></div>
  </div>
</div>

<!-- Edit Metadata -->
<div class="overlay" id="editMetaModal">
  <div class="modal">
    <div class="modal-hd"><div class="modal-title">Edit Document Metadata</div><div class="modal-x" onclick="closeModal('editMetaModal')">✕</div></div>
    <div class="fld"><label>Document Title</label><input id="emT"></div>
    <div class="form-2">
      <div class="fld"><label>Source</label><select id="emSrc"><option>Iloilo City</option><option>Province of Iloilo</option><option>Municipality of Oton</option><option>Municipality of Pavia</option></select></div>
      <div class="fld"><label>Category</label><select id="emCat"><option>Budget & Finance</option><option>Ordinances</option><option>Resolutions</option><option>Administrative</option><option>Legal</option><option>Reports</option><option>Permits</option><option>Correspondence</option></select></div>
    </div>
    <div class="form-2">
      <div class="fld"><label>Date Received</label><input id="emDate" type="date"></div>
      <div class="fld"><label>Retention</label><select id="emRet"><option>1 Year</option><option>3 Years</option><option>5 Years</option><option>10 Years</option><option>Permanent</option></select></div>
    </div>
    <div class="fld"><label>Description / OCR Notes</label><textarea id="emDesc"></textarea></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('editMetaModal')">Cancel</button>
      <button class="btn btn-blue" onclick="saveMeta()">💾 Save Changes</button>
    </div>
  </div>
</div>

<!-- Add / Edit Requirement (Admin) -->
<div class="overlay" id="addReqModal">
  <div class="modal lg">
    <div class="modal-hd"><div class="modal-title" id="addReqTitle">Add New Requirement</div><div class="modal-x" onclick="closeModal('addReqModal')">✕</div></div>
    <div class="fld"><label>Requirement Title *</label><input id="rqT" placeholder="e.g. Quarterly Budget Report Q1 2025"></div>
    <div class="form-2">
      <div class="fld"><label>Category *</label><select id="rqCat"><option value="">Select…</option><option>Financial</option><option>Legal</option><option>Administrative</option><option>Compliance</option><option>Reports</option></select></div>
      <div class="fld"><label>Priority *</label><select id="rqPri"><option value="">Select…</option><option>High</option><option>Medium</option><option>Low</option></select></div>
    </div>
    <div class="form-2">
      <div class="fld"><label>Deadline Date *</label><input id="rqDl" type="date"></div>
      <div class="fld"><label>Assigned To *</label><select id="rqAsgn"><option value="">Select Staff / Agency…</option></select></div>
    </div>
    <div class="fld"><label>Instructions / Description</label><textarea id="rqDesc" placeholder="Describe required documents, format, submission instructions…"></textarea></div>
    <div class="fld"><label>Required Document Types (comma-separated)</label><input id="rqDocs" placeholder="e.g. Budget Report, Disbursement Voucher, COA Clearance"></div>
    <div class="fld"><label>Reminder Schedule</label>
      <select id="rqRem"><option value="7">7 days before deadline</option><option value="3">3 days before deadline</option><option value="1">1 day before</option><option value="all" selected>7 + 3 + 1 days before</option><option value="none">No reminders</option></select>
    </div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('addReqModal')">Cancel</button>
      <button class="btn btn-blue" onclick="saveReq()">💾 Save Requirement</button>
    </div>
  </div>
</div>

<!-- View / Submit Requirement (Staff) -->
<div class="overlay" id="viewReqModal">
  <div class="modal xl">
    <div class="modal-hd"><div class="modal-title" id="vrT">Requirement Details</div><div class="modal-x" onclick="closeModal('viewReqModal')">✕</div></div>
    <div id="vrBanner" style="border-radius:var(--r);padding:11px 14px;margin-bottom:14px;display:flex;align-items:center;gap:10px;font-size:13px"></div>
    <div id="vrCountdown" style="background:var(--navy3);border-radius:var(--r);padding:13px 16px;margin-bottom:14px;display:flex;align-items:center;justify-content:space-between"></div>
    <div class="meta-grid" id="vrMeta"></div>
    <div class="section-lbl">Instructions from PSED Admin</div>
    <div style="background:var(--navy3);border-radius:var(--r);padding:13px;font-size:13px;color:var(--text2);line-height:1.7" id="vrDesc"></div>
    <div class="section-lbl">Required Documents Checklist</div>
    <div id="vrChecklist"></div>
    <div class="section-lbl">Submission History</div>
    <div id="vrHistory"></div>
    <div id="vrSubmitSec" style="margin-top:14px;padding-top:14px;border-top:1px solid var(--border)">
      <div class="section-lbl" style="margin-top:0">Submit Compliance Document</div>
      <div class="form-2">
        <div class="fld"><label>Document Title *</label><input id="vrDocTitle" placeholder="e.g. Q1 2025 Budget Report"></div>
        <div class="fld"><label>Document Type</label><select id="vrDocType"></select></div>
      </div>
      <div class="fld"><label>Remarks / Notes</label><textarea id="vrRemarks" placeholder="Add any notes for the PSED reviewer…" style="min-height:52px"></textarea></div>
      <div id="vrDrop" style="background:var(--navy3);border:2px dashed var(--border);border-radius:var(--r);padding:18px;text-align:center;cursor:pointer;margin-bottom:10px;transition:all .2s" onclick="document.getElementById('vrFile').click()">
        <div style="font-size:24px;margin-bottom:4px">📎</div>
        <div style="font-size:12px">Click to attach PDF</div>
        <div style="font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:3px">PDF only • Max 50MB</div>
      </div>
      <input type="file" id="vrFile" accept=".pdf" style="display:none" onchange="setVrFile(this.files[0])">
      <div id="vrFileLbl" style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-bottom:10px"></div>
    </div>
    <div class="modal-acts" id="vrActs"></div>
  </div>
</div>

<!-- Admin: View requirement submissions -->
<div class="overlay" id="adminReqModal">
  <div class="modal xl">
    <div class="modal-hd"><div class="modal-title" id="arT">Requirement Submissions</div><div class="modal-x" onclick="closeModal('adminReqModal')">✕</div></div>
    <div class="meta-grid" id="arMeta" style="margin-bottom:14px"></div>
    <div class="section-lbl" style="margin-top:0">Submissions from Staff / Agency</div>
    <div id="arSubs"></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('adminReqModal')">Close</button>
      <button class="btn btn-blue" onclick="editReq(curReqId)">✏ Edit Requirement</button>
      <button class="btn btn-red" onclick="deleteReq(curReqId)">🗑 Delete</button>
    </div>
  </div>
</div>

<!-- Add User -->
<div class="overlay" id="addUserModal">
  <div class="modal md">
    <div class="modal-hd"><div class="modal-title" id="addUserTitle">Add New User</div><div class="modal-x" onclick="closeModal('addUserModal')">✕</div></div>
    <div class="fld"><label>Full Name *</label><input id="nuName" placeholder="e.g. Juan Dela Cruz"></div>
    <div class="form-2">
      <div class="fld"><label>Username *</label><input id="nuUser" placeholder="juan.dela_cruz"></div>
      <div class="fld"><label>Role *</label><select id="nuRole"><option>Admin</option><option>Staff</option><option selected>Viewer</option></select></div>
    </div>
    <div class="fld"><label>Department</label><input id="nuDept" placeholder="e.g. Finance Department"></div>
    <div class="fld"><label>Email</label><input id="nuEmail" type="email" placeholder="juan@psed.gov.ph"></div>
    <div class="fld"><label>Temporary Password</label><input id="nuPwd" type="password" placeholder="Set initial password"></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('addUserModal')">Cancel</button>
      <button class="btn btn-blue" onclick="addUser()">Add User</button>
    </div>
  </div>
</div>

<!-- Edit User -->
<div class="overlay" id="editUserModal">
  <div class="modal md">
    <div class="modal-hd"><div class="modal-title">Edit User</div><div class="modal-x" onclick="closeModal('editUserModal')">✕</div></div>
    <div class="fld"><label>Full Name</label><input id="euName"></div>
    <div class="form-2">
      <div class="fld"><label>Username</label><input id="euUser"></div>
      <div class="fld"><label>Role</label><select id="euRole"><option>Admin</option><option>Staff</option><option>Viewer</option></select></div>
    </div>
    <div class="fld"><label>Department</label><input id="euDept"></div>
    <div class="fld"><label>Email</label><input id="euEmail" type="email"></div>
    <div class="fld"><label>Status</label><select id="euStatus"><option>Active</option><option>Suspended</option></select></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('editUserModal')">Cancel</button>
      <button class="btn btn-blue" onclick="saveEditUser()">Save Changes</button>
    </div>
  </div>
</div>

<!-- Confirm -->
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

<!-- OCR Result -->
<div class="overlay" id="ocrModal">
  <div class="modal">
    <div class="modal-hd"><div class="modal-title">OCR Result</div><div class="modal-x" onclick="closeModal('ocrModal')">✕</div></div>
    <div id="ocrSteps"></div>
    <div class="section-lbl">Extracted Text</div>
    <div class="ocr-box-txt" id="ocrTxt"></div>
    <div class="modal-acts">
      <button class="btn" onclick="closeModal('ocrModal')">Close</button>
      <button class="btn btn-blue" onclick="copyOCR()">📋 Copy Text</button>
      <button class="btn btn-green" onclick="toast('✅','Indexed','Text indexed and searchable');closeModal('ocrModal')">✅ Index Text</button>
    </div>
  </div>
</div>

<!-- Toast -->
<div class="toast" id="toast">
  <div class="toast-ico" id="tIco"></div>
  <div><div class="toast-ttl" id="tTtl"></div><div class="toast-msg" id="tMsg"></div></div>
</div>

<script src="script.js"></script>
<script src="js/jquery-4.0.0.min.js"></script>
</body>
</html>
