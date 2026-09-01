<aside class="sidebar">
  <div class="sb-brand">
    <div class="sb-icon">DD</div>
    <div><div class="sb-brand-txt">PSED <span>DDAS</span></div><div class="sb-brand-sub">Document Archiving</div></div>
  </div>
  <div class="sb-user" onclick="openUserHome()">
    <div class="u-av" id="sbAv"></div>
    <div><div class="u-name" id="sbName"></div><div class="u-role" id="sbRole"></div></div>
  </div>
  <nav class="sb-nav">
    <div class="nav-grp" id="navWorkspaceGrp">Workspace</div>

    <div id="agencyQuickNav" style="display:none">
      <div class="nav-item" id="n-dashboard-agency" onclick="nav('dashboard')">Dashboard</div>
      <div class="nav-item" id="n-requirements-agency" onclick="nav('requirements')">PRIME-HRM</div>
    </div>

    <div class="nav-item nav-parent open" id="n-internal-parent" onclick="toggleMenu('internal')">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 7h18"/><path d="M6 12h12"/><path d="M9 17h6"/></svg>
      Internal
      <span class="nav-chevron">▾</span>
    </div>
    <div class="nav-submenu open" id="n-internal-menu">
      <div class="nav-item nav-subitem active" id="n-dashboard" onclick="nav('dashboard')">Dashboard</div>
      <div class="nav-item nav-subitem" id="n-upload" onclick="nav('upload')">Upload Documents</div>
      <div class="nav-item nav-subitem" id="n-search" onclick="nav('search')">Document Repository</div>
      <div class="nav-item nav-subitem" id="n-logs" onclick="nav('logs')">Activity Logs</div>
      <div class="nav-item nav-subitem" id="n-settings" onclick="nav('settings')">Settings</div>
    </div>

    <div class="nav-item nav-parent" id="n-external-parent" onclick="toggleMenu('external')">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 12a9 9 0 11-9-9"/><path d="M21 3v6h-6"/></svg>
      Agency
      <span class="nav-chevron">▾</span>
    </div>
    <div class="nav-submenu" id="n-external-menu">
      <div class="nav-item nav-subitem" id="n-requirements" onclick="nav('requirements')">PRIME-HRM</div>
    </div>

    <div class="nav-grp" id="navAdminGrp">Administration</div>
    <div class="nav-item" id="n-access" onclick="nav('access')">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
      User Management
    </div>
  </nav>
  <div class="sb-foot">
    <button class="btn-logout" onclick="confirmLogout()">
      <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
      Sign Out
    </button>
  </div>
</aside>
