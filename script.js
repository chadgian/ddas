'use strict';

const INTERNAL_ROLES = [
  'Division Chief',
  'Field Director',
  'Division Personnel',
  'FO Personnel',
  'Management Committee',
  'Divisions',
];

const PRIME_FOLDER_TREE = {
  'Recruitment, Selection and Placement (RSP)': {
    Governance: [
      'Policy',
      'Structure and Roles',
      'Review Mechanism',
      'Information and Communication (Use of Technology)',
      'Information and Communication (Database Content)',
    ],
    'Talent Planning': ['Staffing and Workforce Plan'],
    'Talent Sourcing': ['Recruitment Plan', 'Talent Attraction', 'EEOP'],
    'Talent Selection and Placement': [
      'Selection Criteria',
      'Assessment and Selection Process',
      'EEOP',
      'Onboarding',
    ],
  },
  'Learning and Development (L&D)': {
    Governance: [
      'Policy including EOP',
      'Structure and Roles',
      'Review Mechanisms',
      'Information and Communication I',
      'Information and Communication II',
    ],
    'Planning and M&E': ['L&D Planning', 'L&D Monitoring and Evaluation'],
    Execution: [
      'Design I',
      'Design II',
      'Development',
      'Delivery',
      'Learning Service Provider Management',
    ],
  },
  'Performance Management (PM)': {
    Governance: [
      'Policy',
      'Structure and Roles',
      'Review Mechanisms',
      'Information and Communication (Use of Technology)',
      'Information and Communication (Database Content)',
    ],
    'Performance Planning and Commitment': ['Target Setting', 'Standard Setting'],
    'Performance Monitoring and Coaching': ['Performance Tracking', 'Providing Performance Support'],
    'Performance Review and Evaluation': [
      'Performance Review and Evaluation',
      'Calibrating Performance Assessments',
    ],
    'Development Planning': ['Development Planning Documents'],
  },
  'Rewards and Recognition (R&R)': {
    Governance: [
      'Policy including EOP',
      'Structure and Roles',
      'Review Mechanisms',
      'Information and Communication I',
      'Information and Communication II',
    ],
    Planning: ['Planning I', 'Planning II'],
    Implementation: ['R&R Screening and Selection Criteria'],
  },
  'Other Documentary Requirements': {
    'Other Documentary Requirements': ['Supplementary / Miscellaneous ER'],
  },
};

const INDICATOR_PLACEHOLDER = 'Indicator pending configuration';
const INDICATOR_CODE_PLACEHOLDER = 'PENDING-CODE';
const SAMPLE_INDICATOR_CODES = ['SAMPLE-01', 'SAMPLE-02', 'SAMPLE-03'];

let ROLE = 'PSED Admin';
let UNAME = 'admin.dela_cruz';
let curDocId = null;
let editUserId = null;
let confirmCB = null;
let selFile = null;
let primeFile = null;
let primeAgencyFilter = '';
let srchRes = [];
let srchPage = 1;
let logsPage = 1;
let SETTINGS = {
  storage_root: '',
  internal_subdir: 'internal',
  prime_subdir: 'prime_hrm',
};
const PP = 5;
const LP = 8;

const DOCS = [
  {
    id: 'DOC-2026-0101',
    title: 'Records Retention Memorandum',
    src: 'PSED',
    docType: 'Memorandum',
    date: '2026-05-04',
    status: 'active',
    size: '1.4 MB',
    pages: 5,
    audience: ['All Personnel'],
    retention: '5 Years',
    notes: 'Implementation guidance for document retention and repository filing.',
    details: {
      memoNumber: 'MEMO-2026-014',
      addressee: 'All Personnel',
      subject: 'Records Retention and Filing Workflow',
      memoDate: '2026-05-02',
      memoAuthor: 'Juan Dela Cruz',
    },
  },
  {
    id: 'DOC-2026-0100',
    title: 'Opinion on Leave Monetization',
    src: 'Legal Division',
    docType: 'Opinion/Query',
    date: '2026-05-02',
    status: 'active',
    size: '0.9 MB',
    pages: 3,
    audience: ['Division Chief', 'Field Director', 'Management Committee'],
    retention: 'Permanent',
    notes: 'Legal interpretation on leave monetization for retiring personnel.',
    details: {
      addressee: 'Field Director',
      subject: 'Leave Monetization Request',
      opinionDate: '2026-04-29',
    },
  },
  {
    id: 'DOC-2026-0098',
    title: 'Quarterly Operational Report',
    src: 'Field Office',
    docType: 'Report',
    date: '2026-04-28',
    status: 'active',
    size: '2.7 MB',
    pages: 12,
    audience: ['Division Personnel', 'FO Personnel'],
    retention: '3 Years',
    notes: 'Quarterly accomplishments and operational updates.',
    details: {},
  },
  {
    id: 'DOC-2026-0092',
    title: 'Committee Resolution on Process Review',
    src: 'Regional Office',
    docType: 'Resolution',
    date: '2026-04-19',
    status: 'archived',
    size: '1.1 MB',
    pages: 4,
    audience: ['Management Committee'],
    retention: '10 Years',
    notes: 'Resolution documenting process review findings and next steps.',
    details: {},
  },
];

const USERS = [
  {
    id: 1,
    name: 'Juan Dela Cruz',
    user: 'admin.dela_cruz',
    dept: 'PSED',
    agency: '',
    access: 'PSED Admin',
    roles: ['Division Chief', 'Management Committee'],
    email: 'admin@psed.gov.ph',
    status: 'Active',
    av: 'linear-gradient(135deg,#ef4444,#b91c1c)',
    ini: 'JD',
    perms: ['Internal Upload', 'Repository Access', 'User Management', 'Notifications', 'Logs'],
  },
  {
    id: 2,
    name: 'Maricel Santos',
    user: 'maricel.santos',
    dept: 'PSED',
    agency: '',
    access: 'Internal',
    roles: ['Division Personnel', 'Divisions'],
    email: 'maricel.santos@psed.gov.ph',
    status: 'Active',
    av: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    ini: 'MS',
    perms: ['Internal Upload', 'Repository Access', 'Notifications'],
  },
  {
    id: 3,
    name: 'Ramon Garcia',
    user: 'ramon.garcia',
    dept: 'Field Office',
    agency: '',
    access: 'Internal',
    roles: ['FO Personnel', 'Field Director'],
    email: 'ramon.garcia@psed.gov.ph',
    status: 'Active',
    av: 'linear-gradient(135deg,#10b981,#047857)',
    ini: 'RG',
    perms: ['Internal Upload', 'Repository Access'],
  },
  {
    id: 4,
    name: 'CGO Bago Agency Account',
    user: 'cgo.bago',
    dept: 'Agency',
    agency: 'CGO Bago',
    access: 'Agency',
    roles: [],
    email: 'cgo.bago@agency.gov.ph',
    status: 'Active',
    av: 'linear-gradient(135deg,#f59e0b,#b45309)',
    ini: 'CB',
    perms: ['PRIME-HRM Upload'],
  },
];

const PRIME_SUBMISSIONS = [
  {
    id: 'ER-2026-021',
    agency: 'CGO Bago',
    account: 'cgo.bago',
    originalFileName: 'evidence-package.pdf',
    savedFileName: 'PENDING-CODE-evidence-package.pdf',
    folderPath: 'CGO Bago / Recruitment, Selection and Placement (RSP) / Governance / Policy',
    coreArea: 'Recruitment, Selection and Placement (RSP)',
    pillar: 'Governance',
    element: 'Policy',
    indicator: INDICATOR_PLACEHOLDER,
    indicatorCode: INDICATOR_CODE_PLACEHOLDER,
    submitted: '2026-05-06',
    status: 'submitted',
    size: '1.8 MB',
  },
  {
    id: 'ER-2026-020',
    agency: 'CGO Bago',
    account: 'cgo.bago',
    originalFileName: 'ld-planning.pdf',
    savedFileName: 'PENDING-CODE-ld-planning.pdf',
    folderPath: 'CGO Bago / Learning and Development (L&D) / Planning and M&E / L&D Planning',
    coreArea: 'Learning and Development (L&D)',
    pillar: 'Planning and M&E',
    element: 'L&D Planning',
    indicator: INDICATOR_PLACEHOLDER,
    indicatorCode: INDICATOR_CODE_PLACEHOLDER,
    submitted: '2026-05-03',
    status: 'received',
    size: '0.7 MB',
  },
  {
    id: 'ER-2026-019',
    agency: 'CGO Bago',
    account: 'cgo.bago',
    originalFileName: 'pm-review.pdf',
    savedFileName: 'PENDING-CODE-pm-review.pdf',
    folderPath: 'CGO Bago / Performance Management (PM) / Performance Review and Evaluation / Performance Review and Evaluation',
    coreArea: 'Performance Management (PM)',
    pillar: 'Performance Review and Evaluation',
    element: 'Performance Review and Evaluation',
    indicator: INDICATOR_PLACEHOLDER,
    indicatorCode: INDICATOR_CODE_PLACEHOLDER,
    submitted: '2026-05-01',
    status: 'under review',
    size: '2.1 MB',
  },
];

const LOGS = [
  { act: 'Uploaded DOC-2026-0101', usr: 'admin.dela_cruz', type: 'Upload', time: '2026-05-06 09:12', ico: '📤', bg: 'rgba(14,165,233,.14)' },
  { act: 'Submitted ER-2026-021', usr: 'cgo.bago', type: 'Upload', time: '2026-05-06 08:41', ico: '📎', bg: 'rgba(16,185,129,.14)' },
  { act: 'Viewed DOC-2026-0100', usr: 'maricel.santos', type: 'View', time: '2026-05-05 16:30', ico: '👁', bg: 'rgba(100,116,139,.14)' },
  { act: 'Sent notification to All Personnel', usr: 'admin.dela_cruz', type: 'Settings', time: '2026-05-05 14:12', ico: '📣', bg: 'rgba(139,92,246,.14)' },
];

let NOTIFS = [
  { txt: 'New repository upload: Records Retention Memorandum', time: '10 min ago', col: 'var(--accent)' },
  { txt: 'PRIME-HRM submission received from CGO Bago', time: '35 min ago', col: 'var(--green)' },
  { txt: 'Restricted document updated for Management Committee', time: '1 hr ago', col: 'var(--yellow)' },
];

function replaceArray(target, source) {
  target.length = 0;
  target.push(...source);
}

function getAvatarGradient(access) {
  if (access === 'PSED Admin') return 'linear-gradient(135deg,#ef4444,#b91c1c)';
  if (access === 'Agency') return 'linear-gradient(135deg,#10b981,#047857)';
  return 'linear-gradient(135deg,#0ea5e9,#0369a1)';
}

function decorateUser(user) {
  return {
    ...user,
    av: user.av || getAvatarGradient(user.access),
    ini: user.ini || (user.name || user.user || 'U').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    perms: user.perms || buildPermissions(user.access),
  };
}

function decorateLog(log) {
  const map = {
    Upload: { ico: '📤', bg: 'rgba(14,165,233,.14)' },
    Update: { ico: '✏', bg: 'rgba(139,92,246,.14)' },
    Delete: { ico: '🗑', bg: 'rgba(239,68,68,.14)' },
    View: { ico: '👁', bg: 'rgba(100,116,139,.14)' },
    Login: { ico: '🔑', bg: 'rgba(139,92,246,.14)' },
    Logout: { ico: '🚪', bg: 'rgba(100,116,139,.14)' },
    Settings: { ico: '⚙', bg: 'rgba(100,116,139,.14)' },
    Download: { ico: '📥', bg: 'rgba(16,185,129,.14)' },
  };
  const visual = map[log.type] || { ico: '📝', bg: 'rgba(100,116,139,.14)' };
  return { ...log, ...visual };
}

async function apiJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

function applySettingsToForm() {
  if (document.getElementById('storageRoot')) document.getElementById('storageRoot').value = SETTINGS.storage_root || '';
  if (document.getElementById('internalSubdir')) document.getElementById('internalSubdir').value = SETTINGS.internal_subdir || 'internal';
  if (document.getElementById('primeSubdir')) document.getElementById('primeSubdir').value = SETTINGS.prime_subdir || 'prime_hrm';
}

function hydrateState(data) {
  if (!data.authenticated || !data.user) {
    document.getElementById('loginWrap').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
    return;
  }

  ROLE = data.user.access;
  UNAME = data.user.user;
  SETTINGS = { ...SETTINGS, ...(data.settings || {}) };

  replaceArray(DOCS, data.documents || []);
  replaceArray(PRIME_SUBMISSIONS, data.prime_submissions || []);
  replaceArray(USERS, (data.users && data.users.length ? data.users : [data.user]).map(decorateUser));
  if (!USERS.find(user => user.user === data.user.user)) USERS.unshift(decorateUser(data.user));
  replaceArray(LOGS, (data.logs || []).map(decorateLog));

  document.getElementById('loginWrap').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  initApp();
  applySettingsToForm();
}

async function hydrateFromServer(showToast = false) {
  try {
    const data = await apiJson('process/bootstrapData.php');
    hydrateState(data);
    if (showToast) toast('↺', 'Refreshed', 'Page data updated');
  } catch (error) {
    toast('⚠', 'Load Failed', error.message);
  }
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function getCurrentUser() {
  return USERS.find(user => user.user === UNAME) || null;
}

function getPrimeAgencyName() {
  const user = getCurrentUser();
  return user?.agency || user?.name || 'Agency';
}

function normalizeAccess(role, username) {
  const local = USERS.find(user => user.user === username);
  if (local) return local.access;
  const mapped = String(role || '').toLowerCase();
  if (mapped === 'admin' || mapped === 'psed admin') return 'PSED Admin';
  if (mapped === 'agency' || mapped === 'external') return 'Agency';
  if (mapped === 'internal') return 'Internal';
  return 'Internal';
}

function ensureRuntimeUser(username, access) {
  let user = USERS.find(item => item.user === username);
  if (user) return user;
  const name = username.replace(/\./g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  user = {
    id: USERS.length + 1,
    name,
    user: username,
    dept: access === 'Agency' ? 'Agency' : 'PSED',
    agency: access === 'Agency' ? name : '',
    access,
    roles: access === 'Internal' ? ['Division Personnel'] : [],
    email: `${username}@psed.gov.ph`,
    status: 'Active',
    av: 'linear-gradient(135deg,#64748b,#334155)',
    ini: name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    perms: buildPermissions(access),
  };
  USERS.push(user);
  return user;
}

async function doLogin() {
  const username = document.getElementById('lusr').value.trim();
  const password = document.getElementById('lpwd').value.trim();
  if (!username || !password) {
    document.getElementById('loginErr').style.display = 'block';
    return;
  }
  document.getElementById('loginErr').style.display = 'none';
  try {
    const form = new URLSearchParams({ username, password });
    const result = await apiJson('process/loginProcess.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: form.toString(),
    });
    await hydrateFromServer();
    const firstName = (result.user?.full_name || username).split(' ')[0];
    toast('✅', 'Login Successful', `Welcome back, ${firstName}!`);
  } catch (error) {
    document.getElementById('loginErr').style.display = 'block';
    toast('⚠', 'Login Failed', error.message || 'Invalid username or password.');
  }
}

function confirmLogout() {
  showConfirm('Sign Out', '⬅', 'Are you sure you want to sign out?', () => {
    fetch('process/logoutProcess.php', { method: 'POST' })
      .then(() => location.reload())
      .catch(() => location.reload());
  });
}

function initApp() {
  const user = getCurrentUser() || ensureRuntimeUser(UNAME, ROLE);
  const roleColors = {
    'PSED Admin': 'linear-gradient(135deg,#ef4444,#b91c1c)',
    Internal: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
    Agency: 'linear-gradient(135deg,#10b981,#047857)',
  };

  document.getElementById('sbAv').style.background = user.av || roleColors[user.access];
  document.getElementById('sbAv').textContent = user.ini;
  document.getElementById('sbName').textContent = user.access === 'Agency' ? (user.agency || user.name) : user.name;
  document.getElementById('sbRole').textContent = user.access === 'Agency' ? 'Agency Account' : (user.access === 'PSED Admin' ? 'System Administrator' : user.access);
  document.getElementById('sbRole').style.color = user.access === 'PSED Admin' ? 'var(--red)' : user.access === 'Internal' ? 'var(--accent)' : 'var(--green)';

  document.getElementById('profName').value = user.name;
  document.getElementById('profUser').value = user.user;
  document.getElementById('profEmail').value = user.email;
  renderRoleCheckboxes('mRolesBox');
  renderRoleCheckboxes('nuRolesBox');
  renderRoleCheckboxes('euRolesBox');
  renderDocTypeFields();
  renderPrimeFolderSelectors();
  toggleUserRoleFields('nu');
  toggleUserRoleFields('eu');
  applyPermissions();
  buildAll();
  nav('dashboard');
}

function applyPermissions() {
  const blockedByRole = {
    'PSED Admin': [],
    Internal: ['requirements', 'access'],
    Agency: ['upload', 'search', 'logs', 'access', 'settings'],
  };
  window.BLOCKED = blockedByRole;

  document.getElementById('tbUploadBtn').style.display = ROLE === 'Agency' ? 'none' : '';
  document.getElementById('n-access').style.display = ROLE === 'PSED Admin' ? '' : 'none';
  document.getElementById('n-logs').style.display = ROLE === 'Agency' ? 'none' : '';
  document.getElementById('tbQ').disabled = ROLE === 'Agency';
  document.getElementById('tbQ').placeholder = ROLE === 'Agency' ? 'PRIME-HRM access only' : 'Quick search repository…';
  document.getElementById('dash-acts').innerHTML = ROLE === 'Agency'
    ? `<button class="btn-add" onclick="nav('requirements')">+ Submit PRIME-HRM ER</button>`
    : `<button class="btn-add" onclick="nav('upload')">+ Upload Document</button>`;
  document.getElementById('dash-new-btn').style.display = ROLE === 'Agency' ? 'none' : '';
  ['storageRoot', 'internalSubdir', 'primeSubdir'].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.disabled = ROLE !== 'PSED Admin';
  });

  const internalParent = document.getElementById('n-internal-parent');
  const internalMenu = document.getElementById('n-internal-menu');
  const workspaceGroup = document.getElementById('navWorkspaceGrp');
  const adminGroup = document.getElementById('navAdminGrp');
  const externalParent = document.getElementById('n-external-parent');
  const externalMenu = document.getElementById('n-external-menu');
  const agencyQuickNav = document.getElementById('agencyQuickNav');

  if (ROLE === 'Agency') {
    if (internalParent) internalParent.style.display = 'none';
    if (internalMenu) internalMenu.style.display = 'none';
    if (adminGroup) adminGroup.style.display = 'none';
    if (workspaceGroup) workspaceGroup.style.display = 'none';
    if (agencyQuickNav) agencyQuickNav.style.display = 'block';
    if (externalParent) externalParent.style.display = 'none';
    if (externalMenu) externalMenu.style.display = 'none';
  } else {
    if (internalParent) internalParent.style.display = '';
    if (internalMenu) internalMenu.style.display = '';
    if (adminGroup) adminGroup.style.display = '';
    if (workspaceGroup) {
      workspaceGroup.style.display = '';
      workspaceGroup.textContent = 'Workspace';
    }
    if (agencyQuickNav) agencyQuickNav.style.display = 'none';
    if (externalParent) externalParent.style.display = '';
    if (externalMenu) externalMenu.style.display = '';
  }
}

function openUserHome() {
  nav('dashboard');
}

function getPageElementId(route) {
  if (route === 'dashboard' && ROLE === 'Agency') return 'pg-dashboard-agency';
  return `pg-${route}`;
}

function getNavElementId(route) {
  if (ROLE === 'Agency') {
    if (route === 'dashboard') return 'n-dashboard-agency';
    if (route === 'requirements') return 'n-requirements-agency';
  }
  return `n-${route}`;
}

function toggleMenu(menu) {
  const parent = document.getElementById(`n-${menu}-parent`);
  const submenu = document.getElementById(`n-${menu}-menu`);
  if (!parent || !submenu) return;
  parent.classList.toggle('open');
  submenu.classList.toggle('open');
}

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  upload: 'Upload Documents',
  search: 'Document Repository',
  requirements: 'PRIME-HRM',
  access: 'User Management',
  logs: 'Activity Logs',
  settings: 'Settings',
};

function nav(id) {
  const blocked = (window.BLOCKED && window.BLOCKED[ROLE]) || [];
  if (blocked.includes(id)) {
    toast('🚫', 'Access Restricted', `The ${ROLE} access group cannot open ${PAGE_TITLES[id] || id}.`);
    return;
  }
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const page = document.getElementById(getPageElementId(id));
  if (page) page.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const navItem = document.getElementById(getNavElementId(id));
  if (navItem) navItem.classList.add('active');
  if (['dashboard', 'upload', 'search', 'logs', 'settings'].includes(id)) {
    document.getElementById('n-internal-parent').classList.add('open');
    document.getElementById('n-internal-menu').classList.add('open');
  }
  if (id === 'requirements') {
    document.getElementById('n-external-parent').classList.add('open');
    document.getElementById('n-external-menu').classList.add('open');
  }
  document.getElementById('tbTitle').textContent = id === 'dashboard' && ROLE === 'Agency' ? 'PRIME-HRM Dashboard' : (PAGE_TITLES[id] || id);
  closeNotif();
  if (id === 'search') setTimeout(() => document.getElementById('searchInp').focus(), 80);
}

function refreshCurrent() {
  hydrateFromServer(true);
}

function buildAll() {
  buildDashStats();
  buildBarChart();
  buildDonut();
  buildDashTable();
  buildAgencyDashboard();
  applyFilters();
  buildPrime();
  buildUsers(USERS);
  renderLogs();
  buildNotifs();
  renderInternalRoleList();
  updateLogUserFilter();
  document.getElementById('sysTotal').textContent = DOCS.length.toLocaleString();
  addDashboardBanner();
}

function addDashboardBanner() {
  const host = document.getElementById('dash-banner');
  const message = ROLE === 'Agency'
    ? 'Agency access is active. Use PRIME-HRM to upload ERs and monitor your submissions.'
    : ROLE === 'Internal'
      ? 'Internal access is active. Upload documents and control visibility by role.'
      : 'PSED Admin access is active. You can manage both Internal and Agency workspaces.';
  host.innerHTML = `<div class="info-banner" style="background:rgba(14,165,233,.07);border:1px solid rgba(14,165,233,.2);"><span style="font-size:18px">ℹ</span><div>${message}</div></div>`;
}

function buildDashStats() {
  const restrictedDocs = DOCS.filter(doc => !doc.audience.includes('All Personnel')).length;
  const myAgencySubs = PRIME_SUBMISSIONS.filter(item => item.account === UNAME).length;
  const cards = [
    { lbl: 'Total Documents', val: DOCS.length, sub: 'Repository records', sc: 'var(--accent)', ico: '📄', click: `nav('search')` },
    { lbl: 'Internal Documents', val: DOCS.filter(doc => doc.status !== 'archived').length, sub: 'Active repository files', sc: 'var(--green)', ico: '🏢', click: `nav('search')` },
    { lbl: 'PRIME-HRM Submissions', val: ROLE === 'Agency' ? myAgencySubs : PRIME_SUBMISSIONS.length, sub: ROLE === 'Agency' ? 'This agency uploads' : 'Agency ER uploads', sc: 'var(--yellow)', ico: '📎', click: `nav('requirements')` },
    { lbl: 'Restricted Documents', val: restrictedDocs, sub: 'Role-limited access', sc: 'var(--purple)', ico: '🔒', click: `nav('search')` },
  ];
  document.getElementById('dash-stats').innerHTML = cards.map(card => `
    <div class="stat-card" style="--sc:${card.sc}" onclick="${card.click}">
      <div class="sc-lbl">${card.lbl}</div>
      <div class="sc-val" style="color:${card.sc}">${Number(card.val).toLocaleString()}</div>
      <div class="sc-sub">${card.sub}</div>
      <div class="sc-ico">${card.ico}</div>
    </div>
  `).join('');
}

function buildBarChart() {
  const months = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];
  const internal = [44, 51, 47, 55, 61, 58];
  const agency = [12, 10, 14, 9, 11, 16];
  const max = Math.max(...internal, ...agency);
  document.getElementById('barChart').innerHTML = months.map((month, i) => `
    <div class="bw">
      <div class="bar-inner">
        <div class="bar" style="height:${(internal[i] / max) * 100}%;background:rgba(14,165,233,${i === 5 ? '.9' : '.45'})" onclick="toast('📊','${month} Internal Uploads','${internal[i]} document(s) uploaded')"><div class="bar-tip">${internal[i]}</div></div>
        <div class="bar" style="height:${(agency[i] / max) * 100}%;background:rgba(16,185,129,.55)" onclick="toast('📊','${month} Agency Uploads','${agency[i]} ER submission(s) received')"><div class="bar-tip">${agency[i]}</div></div>
      </div>
      <div class="bar-lbl">${month}</div>
    </div>
  `).join('');
}

function buildDonut() {
  const counts = {};
  DOCS.forEach(doc => { counts[doc.docType] = (counts[doc.docType] || 0) + 1; });
  const colors = ['#0ea5e9', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#64748b'];
  const items = Object.entries(counts).map(([label, value], index) => ({ label, value, color: colors[index % colors.length] }));
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let offset = 0;
  let paths = '';
  items.forEach(item => {
    const portion = item.value / total;
    const large = portion > 0.5 ? 1 : 0;
    const x1 = 18 + 13 * Math.sin(offset * 2 * Math.PI);
    const y1 = 18 - 13 * Math.cos(offset * 2 * Math.PI);
    offset += portion;
    const x2 = 18 + 13 * Math.sin(offset * 2 * Math.PI);
    const y2 = 18 - 13 * Math.cos(offset * 2 * Math.PI);
    paths += `<path d="M18 18 L${x1} ${y1} A13 13 0 ${large} 1 ${x2} ${y2} Z" fill="${item.color}" opacity=".88" style="cursor:pointer" onclick="filterDocType('${item.label}')"/>`;
  });
  document.getElementById('donutSvg').innerHTML = `${paths}<circle cx="18" cy="18" r="7" fill="var(--panel)"/>`;
  document.getElementById('donutLeg').innerHTML = items.map(item => `<div class="leg-item" onclick="filterDocType('${item.label}')"><div class="leg-dot" style="background:${item.color}"></div><span>${item.label}</span><span class="leg-pct">${Math.round((item.value / total) * 100)}%</span></div>`).join('');
}

function filterDocType(type) {
  nav('search');
  document.getElementById('fType').value = type;
  applyFilters();
}

function buildDashTable() {
  document.getElementById('dashTbl').innerHTML = DOCS.slice(0, 6).map(doc => `
    <tr>
      <td class="mono-sm">${doc.id}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${doc.title}">${doc.title}</td>
      <td>${doc.src}</td>
      <td><span class="badge" style="background:var(--navy3);color:var(--text2)">${doc.docType}</span></td>
      <td class="mono-sm" style="color:var(--text2)">${doc.date}</td>
      <td><span class="badge b-${doc.status}">${doc.status}</span></td>
      <td><div class="btn-row"><button class="btn btn-blue" onclick="openDoc('${doc.id}')">👁 View</button><button class="btn" onclick="dlDoc('${doc.id}')">⬇</button>${ROLE !== 'Agency' ? `<button class="btn" onclick="openEditMeta('${doc.id}')">✏</button>` : ''}${ROLE === 'PSED Admin' ? `<button class="btn btn-red" onclick="delDoc('${doc.id}')">🗑</button>` : ''}</div></td>
    </tr>
  `).join('');
}

function openDoc(id) {
  const doc = DOCS.find(item => item.id === id);
  if (!doc) return;
  curDocId = id;
  document.getElementById('dmTitle').textContent = doc.title;
  document.getElementById('dmId').textContent = doc.id;
  document.getElementById('dmMeta').innerHTML = `
    <div class="meta-item"><div class="meta-k">Document ID</div><div class="meta-v" style="font-family:var(--mono)">${doc.id}</div></div>
    <div class="meta-item"><div class="meta-k">Source</div><div class="meta-v">${doc.src}</div></div>
    <div class="meta-item"><div class="meta-k">Document Type</div><div class="meta-v">${doc.docType}</div></div>
    <div class="meta-item"><div class="meta-k">Date Filed</div><div class="meta-v" style="font-family:var(--mono)">${doc.date}</div></div>
    <div class="meta-item"><div class="meta-k">Status</div><div class="meta-v"><span class="badge b-${doc.status}">${doc.status}</span></div></div>
    <div class="meta-item"><div class="meta-k">Visible To</div><div class="meta-v">${doc.audience.join(', ')}</div></div>
  `;
  document.getElementById('dmOcr').textContent = buildDocNotes(doc);
  document.getElementById('dmViewerNote').innerHTML = '';
  document.getElementById('dmActs').innerHTML = `<button class="btn btn-blue" onclick="dlDoc('${doc.id}')">⬇ Download</button><button class="btn" onclick="printDoc()">🖨 Print</button>${ROLE !== 'Agency' ? `<button class="btn btn-blue" onclick="closeModal('docModal');openEditMeta('${doc.id}')">✏ Edit</button>` : ''}<button class="btn" onclick="closeModal('docModal')">✕ Close</button>`;
  addLog(`Viewed ${id}`, UNAME, 'View', '👁', 'rgba(100,116,139,.14)');
  openModal('docModal');
}

function buildDocNotes(doc) {
  const lines = [
    `Visible To: ${doc.audience.join(', ')}`,
    `Retention: ${doc.retention}`,
    '',
    doc.notes || 'No additional description.',
  ];
  Object.entries(doc.details || {}).forEach(([key, value]) => {
    lines.push(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}: ${value}`);
  });
  return lines.join('\n');
}

function dlDoc(id) {
  const doc = DOCS.find(item => item.id === id);
  if (!doc) return;
  addLog(`Downloaded ${id}`, UNAME, 'Download', '📥', 'rgba(16,185,129,.14)');
  toast('📥', 'Download Started', doc.title);
}

function printDoc() {
  toast('🖨', 'Print Initiated', 'Document sent to printer');
}

function delDoc(id) {
  if (ROLE !== 'PSED Admin') {
    toast('🚫', 'Denied', 'Only PSED Admin can delete documents.');
    return;
  }
  const doc = DOCS.find(item => item.id === id);
  if (!doc) return;
  showConfirm('Delete Document', '🗑', `Delete "${doc.title}"? This cannot be undone.`, () => {
    const form = new FormData();
    form.append('action', 'delete');
    form.append('id', doc.dbId);
    apiJson('process/documentProcess.php', { method: 'POST', body: form })
      .then(() => hydrateFromServer())
      .then(() => {
        toast('🗑', 'Deleted', `${id} removed from the repository.`);
        closeModal('docModal');
      })
      .catch(error => toast('⚠', 'Delete Failed', error.message));
  });
}

function renderRoleCheckboxes(containerId, selected = ['All Personnel']) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const items = ['All Personnel', ...INTERNAL_ROLES];
  container.innerHTML = items.map(role => `<label class="role-check"><input type="checkbox" value="${role}" ${selected.includes(role) ? 'checked' : ''}><span>${role}</span></label>`).join('');
}

function getSelectedRoles(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return ['All Personnel'];
  const checked = [...container.querySelectorAll('input:checked')].map(input => input.value);
  return checked.length ? checked : ['All Personnel'];
}

function renderDocTypeFields() {
  const type = document.getElementById('mType').value;
  const host = document.getElementById('docTypeFields');
  if (!host) return;
  if (type === 'Memorandum') {
    host.innerHTML = `<div class="form-2"><div class="fld"><label>Memo Number</label><input id="mMemoNumber"></div><div class="fld"><label>Addressee</label><input id="mAddressee"></div></div><div class="form-2"><div class="fld"><label>Subject</label><input id="mSubject"></div><div class="fld"><label>Date of Memo</label><input id="mMemoDate" type="date"></div></div><div class="fld"><label>Memo Author</label><input id="mMemoAuthor"></div>`;
    return;
  }
  if (type === 'Opinion/Query') {
    host.innerHTML = `<div class="form-2"><div class="fld"><label>Addressee</label><input id="mAddressee"></div><div class="fld"><label>Subject</label><input id="mSubject"></div></div><div class="fld"><label>Date of Opinion</label><input id="mOpinionDate" type="date"></div>`;
    return;
  }
  host.innerHTML = `<div class="info-banner" style="background:rgba(100,116,139,.08);border:1px solid rgba(100,116,139,.18);margin:0 0 10px 0"><span style="font-size:18px">📄</span><div>No additional fields are required for this document type.</div></div>`;
}

function handleDrop(event) {
  event.preventDefault();
  document.getElementById('dropzone').classList.remove('drag');
  if (event.dataTransfer.files[0]) handleFile(event.dataTransfer.files[0]);
}

function handleFile(file) {
  if (!file.name.toLowerCase().endsWith('.pdf')) return toast('❌', 'Invalid', 'PDF files only.');
  if (file.size > 50 * 1024 * 1024) return toast('❌', 'Too Large', 'Max 50MB.');
  selFile = file;
  document.getElementById('fileCard').classList.add('show');
  document.getElementById('fName').textContent = file.name;
  document.getElementById('fSize').textContent = `${(file.size / 1024).toFixed(1)} KB`;
  toast('📄', 'File Ready', file.name);
}

function clearFile() {
  selFile = null;
  document.getElementById('fileCard').classList.remove('show');
  document.getElementById('fileInp').value = '';
  document.getElementById('progWrap').style.display = 'none';
  document.getElementById('publishNotice').style.display = 'none';
}

function resetUpload() {
  clearFile();
  ['mTitle', 'mDesc'].forEach(id => document.getElementById(id).value = '');
  ['mSource', 'mType'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('mRet').value = '5 Years';
  renderRoleCheckboxes('mRolesBox');
  renderDocTypeFields();
  toast('↺', 'Reset', 'Upload form cleared.');
}

function collectDocTypeDetails() {
  const type = document.getElementById('mType').value;
  if (type === 'Memorandum') {
    return {
      memoNumber: document.getElementById('mMemoNumber')?.value.trim() || '',
      addressee: document.getElementById('mAddressee')?.value.trim() || '',
      subject: document.getElementById('mSubject')?.value.trim() || '',
      memoDate: document.getElementById('mMemoDate')?.value || '',
      memoAuthor: document.getElementById('mMemoAuthor')?.value.trim() || '',
    };
  }
  if (type === 'Opinion/Query') {
    return {
      addressee: document.getElementById('mAddressee')?.value.trim() || '',
      subject: document.getElementById('mSubject')?.value.trim() || '',
      opinionDate: document.getElementById('mOpinionDate')?.value || '',
    };
  }
  return {};
}

async function submitUpload() {
  if (ROLE === 'Agency') return toast('🚫', 'Denied', 'Agency users cannot upload to the internal repository.');
  const title = document.getElementById('mTitle').value.trim();
  const source = document.getElementById('mSource').value;
  const docType = document.getElementById('mType').value;
  if (!title || !source || !docType || !selFile) return toast('⚠', 'Required', 'Complete the required fields and attach a PDF.');

  const progressWrap = document.getElementById('progWrap');
  progressWrap.style.display = 'block';
  document.getElementById('progFill').style.width = '25%';
  document.getElementById('progPct').textContent = '25%';
  document.getElementById('progLbl').textContent = 'Uploading to Repository…';
  document.getElementById('progTxt').textContent = 'Saving document and metadata…';

  const formData = new FormData();
  formData.append('action', 'upload');
  formData.append('title', title);
  formData.append('source_office', source);
  formData.append('document_type', docType);
  formData.append('description', document.getElementById('mDesc').value.trim());
  formData.append('retention_period', document.getElementById('mRet').value);
  getSelectedRoles('mRolesBox').forEach(role => formData.append('visibility_roles[]', role));
  formData.append('extra_metadata', JSON.stringify(collectDocTypeDetails()));
  formData.append('file', selFile);

  try {
    const result = await apiJson('process/documentProcess.php', { method: 'POST', body: formData });
    document.getElementById('progFill').style.width = '100%';
    document.getElementById('progPct').textContent = '100%';
    document.getElementById('progTxt').textContent = 'Done!';
    document.getElementById('publishNotice').style.display = 'block';
    NOTIFS.unshift({ txt: `New repository upload: ${title}`, time: 'Just now', col: 'var(--accent)' });
    await hydrateFromServer();
    toast('✅', 'Upload Successful', `${result.document.id} added to the repository.`);
    setTimeout(resetUpload, 900);
  } catch (error) {
    document.getElementById('progWrap').style.display = 'none';
    toast('⚠', 'Upload Failed', error.message);
  }
}

function openEditMeta(id) {
  if (ROLE === 'Agency') return toast('🚫', 'Denied', 'Agency users cannot edit repository metadata.');
  const doc = DOCS.find(item => item.id === id);
  if (!doc) return;
  curDocId = id;
  document.getElementById('emT').value = doc.title;
  document.getElementById('emSrc').value = doc.src;
  document.getElementById('emType').value = doc.docType;
  document.getElementById('emRet').value = doc.retention;
  document.getElementById('emAudience').value = doc.audience.join(', ');
  document.getElementById('emDesc').value = doc.notes || '';
  openModal('editMetaModal');
}

async function saveMeta() {
  const doc = DOCS.find(item => item.id === curDocId);
  if (!doc) return;
  const form = new FormData();
  form.append('action', 'update');
  form.append('id', doc.dbId);
  form.append('title', document.getElementById('emT').value.trim() || doc.title);
  form.append('source_office', document.getElementById('emSrc').value || doc.src);
  form.append('document_type', document.getElementById('emType').value || doc.docType);
  form.append('retention_period', document.getElementById('emRet').value || doc.retention);
  form.append('description', document.getElementById('emDesc').value.trim() || doc.notes);
  document.getElementById('emAudience').value.split(',').map(v => v.trim()).filter(Boolean).forEach(role => form.append('visibility_roles[]', role));
  form.append('extra_metadata', JSON.stringify(doc.details || {}));
  try {
    await apiJson('process/documentProcess.php', { method: 'POST', body: form });
    await hydrateFromServer();
    toast('✅', 'Metadata Saved', `${curDocId} updated.`);
    closeModal('editMetaModal');
  } catch (error) {
    toast('⚠', 'Save Failed', error.message);
  }
}

function applyFilters() {
  const query = document.getElementById('searchInp').value.toLowerCase();
  const source = document.getElementById('fSrc').value;
  const docType = document.getElementById('fType').value;
  const role = document.getElementById('fRole').value;
  const status = document.getElementById('fSt').value;
  srchRes = DOCS.filter(doc => {
    const text = [doc.title, doc.src, doc.docType, doc.notes, doc.audience.join(' '), ...Object.values(doc.details || {})].join(' ').toLowerCase();
    return (!query || text.includes(query))
      && (!source || doc.src === source)
      && (!docType || doc.docType === docType)
      && (!role || doc.audience.includes(role))
      && (!status || doc.status === status);
  });
  srchPage = 1;
  renderSearch();
}

function doSearch(query) {
  document.getElementById('searchInp').value = query;
  applyFilters();
}

function renderSearch() {
  const query = document.getElementById('searchInp').value.trim();
  const regex = query ? new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi') : null;
  const highlight = value => regex ? String(value).replace(regex, match => `<span class="hl">${match}</span>`) : value;
  const paged = srchRes.slice((srchPage - 1) * PP, srchPage * PP);
  document.getElementById('srchCount').textContent = `${srchRes.length} document(s) found`;
  document.getElementById('srchResults').innerHTML = paged.length ? paged.map(doc => `
    <div class="res-card" onclick="openDoc('${doc.id}')">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:6px"><div class="res-title">${highlight(doc.title)}</div><span class="badge b-${doc.status}">${doc.status}</span></div>
      <div class="res-meta"><span>📍 ${highlight(doc.src)}</span><span>📂 ${highlight(doc.docType)}</span><span>🔒 ${highlight(doc.audience.join(', '))}</span><span>📅 ${doc.date}</span><span>${doc.id}</span></div>
      <div style="font-size:11px;color:var(--text2);margin-top:6px;line-height:1.6">${highlight((doc.notes || 'No description available.').slice(0, 120))}</div>
      <div class="btn-row" style="margin-top:10px" onclick="event.stopPropagation()"><button class="btn btn-blue" onclick="openDoc('${doc.id}')">👁 View</button><button class="btn" onclick="dlDoc('${doc.id}')">⬇ Download</button>${ROLE !== 'Agency' ? `<button class="btn" onclick="openEditMeta('${doc.id}')">✏ Edit</button>` : ''}</div>
    </div>
  `).join('') : `<div class="empty-state"><div class="empty-ico">🔍</div><div>No documents match your search.</div></div>`;
  buildPager('srchPager', srchRes.length, PP, srchPage, page => { srchPage = page; renderSearch(); });
}

function clearFilters() {
  ['fSrc', 'fType', 'fRole', 'fSt'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('searchInp').value = '';
  applyFilters();
}

function exportCSV() {
  toast('📥', 'Exported', 'Documents exported as CSV.');
}

function setSelectOptions(selectId, options, placeholder) {
  const select = document.getElementById(selectId);
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = [`<option value="">${placeholder}</option>`, ...options.map(option => `<option value="${option}">${option}</option>`)].join('');
  if (options.includes(currentValue)) select.value = currentValue;
}

function renderPrimeFolderSelectors() {
  setSelectOptions('prFolder1', Object.keys(PRIME_FOLDER_TREE), 'Select core area…');
  const coreAreaSelect = document.getElementById('prFolder1');
  if (coreAreaSelect && !coreAreaSelect.value && coreAreaSelect.options.length > 1) {
    coreAreaSelect.selectedIndex = 1;
  }
  setSelectOptions('prFolder2', [], 'Select pillar…');
  setSelectOptions('prFolder3', [], 'Select pillar element…');
  setSelectOptions('prIndicator', [], 'Select indicator…');
  updatePrimeFolderSelectors();
}

function updatePrimeFolderSelectors() {
  const coreArea = document.getElementById('prFolder1').value;
  const pillarSelect = document.getElementById('prFolder2');
  const elementSelect = document.getElementById('prFolder3');
  const indicatorSelect = document.getElementById('prIndicator');

  const pillarOptions = coreArea ? Object.keys(PRIME_FOLDER_TREE[coreArea] || {}) : [];
  setSelectOptions('prFolder2', pillarOptions, 'Select pillar…');
  if (pillarOptions.length && !pillarSelect.value) {
    pillarSelect.value = pillarOptions[0];
  }

  const pillar = pillarSelect.value;
  const elementOptions = coreArea && pillar ? (PRIME_FOLDER_TREE[coreArea]?.[pillar] || []) : [];
  setSelectOptions('prFolder3', elementOptions, 'Select pillar element…');
  if (elementOptions.length && !elementSelect.value) {
    elementSelect.value = elementOptions[0];
  }

  const indicatorOptions = elementSelect.value ? buildIndicatorOptions(elementSelect.value) : [];
  setSelectOptions('prIndicator', indicatorOptions, 'Select indicator…');
  if (indicatorOptions.length && !indicatorSelect.value) {
    indicatorSelect.value = indicatorOptions[0];
  }

  pillarSelect.disabled = !pillarOptions.length;
  elementSelect.disabled = !elementOptions.length;
  indicatorSelect.disabled = !indicatorOptions.length;
  updatePrimeFolderPreview();
}

function buildIndicatorOptions(element) {
  return SAMPLE_INDICATOR_CODES.map(code => `${code} - ${element} (${INDICATOR_PLACEHOLDER})`);
}

function getPrimeFolderPath() {
  const parts = [getPrimeAgencyName()];
  ['prFolder1', 'prFolder2', 'prFolder3'].forEach(id => {
    const value = document.getElementById(id).value;
    if (value) parts.push(value);
  });
  return parts.join(' / ');
}

function updatePrimeFolderPreview() {
  const indicator = document.getElementById('prIndicator').value;
  document.getElementById('primePathPreview').textContent = `Upload path: ${getPrimeFolderPath()}${indicator ? ` / ${indicator}` : ''}`;
}

function isPrimeFolderSelectionComplete() {
  return !!(document.getElementById('prFolder1').value && document.getElementById('prFolder2').value && document.getElementById('prFolder3').value && document.getElementById('prIndicator').value);
}

function handlePrimeFile(file) {
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.pdf')) return toast('❌', 'Invalid', 'PDF only.');
  primeFile = file;
  document.getElementById('primeFileCard').classList.add('show');
  document.getElementById('primeFileName').textContent = file.name;
  document.getElementById('primeFileSize').textContent = `${(file.size / 1024).toFixed(1)} KB`;
}

function clearPrimeFile() {
  primeFile = null;
  document.getElementById('prFile').value = '';
  document.getElementById('primeFileCard').classList.remove('show');
}

function buildPrime() {
  const isAdmin = ROLE === 'PSED Admin';
  document.getElementById('req-acts').innerHTML = `
    <button class="btn" onclick="toast('📥','Exported','Submission list exported')">📥 Export ${isAdmin ? 'Agency List' : 'My Submissions'}</button>
    ${isAdmin && primeAgencyFilter ? `<button class="btn" onclick="clearPrimeAgencyFilter()">↺ Show All Agencies</button>` : ''}
  `;
  document.getElementById('primeUploadWrap').style.display = isAdmin ? 'none' : '';
  document.getElementById('primeAdminWrap').style.display = isAdmin ? '' : 'none';
  if (isAdmin && primeAgencyFilter) {
    const agencyUser = USERS.find(user => user.user === primeAgencyFilter);
    document.getElementById('primeSubTitle').textContent = `${agencyUser?.agency || agencyUser?.name || primeAgencyFilter} ER Submissions`;
  } else {
    document.getElementById('primeSubTitle').textContent = isAdmin ? 'Recent ER Submissions' : 'My Submissions';
  }
  buildPrimeStats();
  buildPrimeAgencyTable();
  buildPrimeTable();
}

function buildPrimeStats() {
  const agencies = USERS.filter(user => user.access === 'Agency');
  const isAdmin = ROLE === 'PSED Admin';
  const mySubs = PRIME_SUBMISSIONS.filter(item => item.account === UNAME).length;
  const submitted = PRIME_SUBMISSIONS.filter(item => item.status === 'submitted').length;
  const inReview = PRIME_SUBMISSIONS.filter(item => item.status === 'under review').length;
  const received = PRIME_SUBMISSIONS.filter(item => item.status === 'received').length;
  document.getElementById('prime-stats').innerHTML = `
    <div class="stat-card" style="--sc:var(--accent);cursor:default"><div class="sc-lbl">${isAdmin ? 'Registered Agencies' : 'My ER Submissions'}</div><div class="sc-val" style="color:var(--accent)">${isAdmin ? agencies.length : mySubs}</div><div class="sc-sub">${isAdmin ? 'Agency accounts managed by admin' : 'Uploads from this agency account'}</div><div class="sc-ico">📎</div></div>
    <div class="stat-card" style="--sc:var(--yellow);cursor:default"><div class="sc-lbl">Submitted / In Review</div><div class="sc-val" style="color:var(--yellow)">${submitted + inReview}</div><div class="sc-sub">Pending acknowledgment</div><div class="sc-ico">⏳</div></div>
    <div class="stat-card" style="--sc:var(--green);cursor:default"><div class="sc-lbl">Received</div><div class="sc-val" style="color:var(--green)">${received}</div><div class="sc-sub">Accepted by PSED</div><div class="sc-ico">✅</div></div>
  `;
}

function buildPrimeAgencyTable() {
  const body = document.getElementById('primeAgencyTbl');
  const count = document.getElementById('primeAgencyCount');
  if (!body || !count) return;
  const agencies = USERS.filter(user => user.access === 'Agency');
  count.textContent = `${agencies.length} registered agenc${agencies.length === 1 ? 'y' : 'ies'}`;
  body.innerHTML = agencies.length ? agencies.map(user => {
    const submissions = PRIME_SUBMISSIONS.filter(item => item.account === user.user);
    const lastSubmission = submissions.length ? submissions[0].submitted : 'No submission';
    return `<tr><td>${user.agency || user.name}</td><td class="mono-sm">${user.user}</td><td><span class="badge b-${user.status === 'Active' ? 'active' : 'failed'}">${user.status}</span></td><td>${submissions.length}</td><td class="mono-sm">${lastSubmission}</td><td><div class="btn-row"><button class="btn btn-blue" onclick="viewAgencySubmissions('${user.user}')">👁 View Submissions</button></div></td></tr>`;
  }).join('') : `<tr><td colspan="6"><div class="empty-state"><div class="empty-ico">🌐</div><div>No registered agencies yet.</div></div></td></tr>`;
}

function buildPrimeTable() {
  let list = ROLE === 'PSED Admin' ? PRIME_SUBMISSIONS : PRIME_SUBMISSIONS.filter(item => item.account === UNAME);
  if (ROLE === 'PSED Admin' && primeAgencyFilter) {
    list = list.filter(item => item.account === primeAgencyFilter);
  }
  document.getElementById('primeCount').textContent = `${list.length} submission(s)`;
  document.getElementById('primeTbl').innerHTML = list.length ? list.map(item => `
    <tr>
      <td class="mono-sm">${item.id}</td>
      <td>${item.agency}</td>
      <td>${item.originalFileName}</td>
      <td>${item.savedFileName}</td>
      <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${item.folderPath}">${item.folderPath}</td>
      <td class="mono-sm">${item.submitted}</td>
      <td><span class="badge b-${item.status === 'received' ? 'approved' : item.status === 'under review' ? 'processing' : 'submitted'}">${item.status}</span></td>
      <td><div class="btn-row"><button class="btn btn-blue" onclick="viewPrimeSubmission('${item.id}')">👁 View</button><button class="btn" onclick="downloadPrimeSubmission('${item.id}')">⬇ Download</button></div></td>
    </tr>
  `).join('') : `<tr><td colspan="8"><div class="empty-state"><div class="empty-ico">📭</div><div>No ER submissions found for this agency.</div></div></td></tr>`;
}

function legacySubmitPrime() {
  if (ROLE !== 'Agency') return toast('🚫', 'Denied', 'Only agency accounts can upload ERs.');
  if (!primeFile || !isPrimeFolderSelectionComplete()) return toast('⚠', 'Required', 'Select the PRIME-HRM hierarchy, indicator, and attach a PDF.');
  const user = getCurrentUser();
  const agency = user?.agency || user?.name || 'Agency';
  const id = `ER-2026-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
  const indicator = document.getElementById('prIndicator').value;
  const indicatorCode = indicator.split(' - ')[0] || INDICATOR_CODE_PLACEHOLDER;
  const savedFileName = `${indicatorCode}-${primeFile.name}`;
  PRIME_SUBMISSIONS.unshift({
    id,
    agency,
    account: UNAME,
    originalFileName: primeFile.name,
    savedFileName,
    folderPath: getPrimeFolderPath(),
    coreArea: document.getElementById('prFolder1').value,
    pillar: document.getElementById('prFolder2').value,
    element: document.getElementById('prFolder3').value,
    indicator,
    indicatorCode,
    submitted: todayISO(),
    status: 'submitted',
    size: `${(primeFile.size / 1024).toFixed(1)} KB`,
  });
  addLog(`Submitted ${id}`, UNAME, 'Upload', '📎', 'rgba(16,185,129,.14)');
  NOTIFS.unshift({ txt: `PRIME-HRM submission received from ${agency}`, time: 'Just now', col: 'var(--green)' });
  clearPrimeFile();
  renderPrimeFolderSelectors();
  buildAll();
  toast('✅', 'Submitted', `${savedFileName} added to My Submissions.`);
}

function viewPrimeSubmission(id) {
  const item = PRIME_SUBMISSIONS.find(entry => entry.id === id);
  if (!item) return;
  toast('👁', 'Submission Details', `${item.savedFileName} • ${item.folderPath}`);
}

function downloadPrimeSubmission(id) {
  const item = PRIME_SUBMISSIONS.find(entry => entry.id === id);
  if (!item) return;
  addLog(`Downloaded ${id}`, UNAME, 'Download', '📥', 'rgba(16,185,129,.14)');
  toast('📥', 'Download Started', item.savedFileName);
}

function viewAgencySubmissions(userName) {
  const list = PRIME_SUBMISSIONS.filter(item => item.account === userName);
  const user = USERS.find(item => item.user === userName);
  const agency = user?.agency || user?.name || userName;
  primeAgencyFilter = userName;
  buildPrime();
  toast('👁', 'Agency Submissions', `${agency} has ${list.length} submission(s).`);
}

function clearPrimeAgencyFilter() {
  primeAgencyFilter = '';
  buildPrime();
}

function buildUsers(list) {
  document.getElementById('umAdminCount').textContent = USERS.filter(user => user.access === 'PSED Admin').length;
  document.getElementById('umInternalCount').textContent = USERS.filter(user => user.access === 'Internal').length;
  document.getElementById('umAgencyCount').textContent = USERS.filter(user => user.access === 'Agency').length;
  document.getElementById('usersGrid').innerHTML = list.map(user => `
    <div class="user-card">
      <div class="uc-hd"><div class="uc-av" style="background:${user.av}">${user.ini}</div><div><div class="uc-name">${user.name}</div><div class="uc-dept">${user.agency || user.dept}</div></div></div>
      <div class="uc-role r-${user.access.toLowerCase().replace(/\s+/g, '-')}">${user.access}</div>
      <div class="perms-wrap">${user.roles.length ? user.roles.map(role => `<span class="perm">${role}</span>`).join('') : '<span class="perm">No internal role</span>'}</div>
      <div class="status-dot" style="color:${user.status === 'Active' ? 'var(--green)' : 'var(--red)'}">● ${user.status}</div>
      <div class="btn-row">${ROLE === 'PSED Admin' ? `<button class="btn btn-blue" onclick="openEditUser(${user.id})">✏ Edit</button>` : ''}${ROLE === 'PSED Admin' && user.user !== UNAME ? `<button class="btn btn-red" onclick="suspendUser(${user.id})">${user.status === 'Active' ? 'Suspend' : 'Activate'}</button>` : ''}</div>
    </div>
  `).join('');
}

function renderInternalRoleList() {
  document.getElementById('internalRoleList').innerHTML = INTERNAL_ROLES.map(role => `<span class="role-pill">${role}</span>`).join('');
}

function filterUsers(access) {
  buildUsers(access === 'all' ? USERS : USERS.filter(user => user.access === access));
}

function searchUsers(query) {
  const value = query.toLowerCase();
  buildUsers(USERS.filter(user => [user.name, user.user, user.dept, user.agency, user.access, user.roles.join(' ')].join(' ').toLowerCase().includes(value)));
}

function toggleUserRoleFields(prefix) {
  const access = document.getElementById(`${prefix}Access`).value;
  const roleField = document.getElementById(`${prefix}RolesField`);
  const agencyField = document.getElementById(`${prefix}AgencyField`);
  if (roleField) roleField.style.display = access === 'Internal' ? '' : 'none';
  if (agencyField) agencyField.style.display = access === 'Agency' ? '' : 'none';
}

function getUserRoles(prefix) {
  return getSelectedRoles(`${prefix}RolesBox`).filter(role => role !== 'All Personnel');
}

function openEditUser(id) {
  const user = USERS.find(item => item.id === id);
  if (!user) return;
  editUserId = id;
  document.getElementById('euName').value = user.name;
  document.getElementById('euUser').value = user.user;
  document.getElementById('euAccess').value = user.access;
  document.getElementById('euDept').value = user.dept;
  document.getElementById('euAgency').value = user.agency || '';
  document.getElementById('euEmail').value = user.email;
  document.getElementById('euStatus').value = user.status;
  renderRoleCheckboxes('euRolesBox', user.roles.length ? user.roles : ['All Personnel']);
  toggleUserRoleFields('eu');
  openModal('editUserModal');
}

function legacySaveEditUser() {
  const user = USERS.find(item => item.id === editUserId);
  if (!user) return;
  user.name = document.getElementById('euName').value.trim() || user.name;
  user.user = document.getElementById('euUser').value.trim() || user.user;
  user.access = document.getElementById('euAccess').value;
  user.dept = document.getElementById('euDept').value.trim() || user.dept;
  user.agency = user.access === 'Agency' ? (document.getElementById('euAgency').value.trim() || user.name) : '';
  user.email = document.getElementById('euEmail').value.trim() || user.email;
  user.status = document.getElementById('euStatus').value;
  user.roles = user.access === 'Internal' ? getUserRoles('eu') : [];
  user.perms = buildPermissions(user.access);
  addLog(`Edited user: ${user.name}`, UNAME, 'Upload', '✏', 'rgba(139,92,246,.1)');
  buildAll();
  toast('✅', 'Saved', `${user.name} updated.`);
  closeModal('editUserModal');
}

function legacySuspendUser(id) {
  const user = USERS.find(item => item.id === id);
  if (!user) return;
  showConfirm(user.status === 'Active' ? 'Suspend User' : 'Reactivate User', '⚠', `${user.status === 'Active' ? 'Suspend' : 'Reactivate'} account for ${user.name}?`, () => {
    user.status = user.status === 'Active' ? 'Suspended' : 'Active';
    addLog(`${user.status === 'Active' ? 'Activated' : 'Suspended'}: ${user.name}`, UNAME, 'Upload', '⚠', 'rgba(239,68,68,.1)');
    buildAll();
    toast('✅', 'Done', `${user.name} account updated.`);
  });
}

function legacyAddUser() {
  const name = document.getElementById('nuName').value.trim();
  const userName = document.getElementById('nuUser').value.trim();
  const access = document.getElementById('nuAccess').value;
  if (!name || !userName) return toast('⚠', 'Required', 'Name and username are required.');
  USERS.push({
    id: USERS.length + 1,
    name,
    user: userName,
    dept: document.getElementById('nuDept').value.trim() || 'PSED',
    agency: access === 'Agency' ? (document.getElementById('nuAgency').value.trim() || name) : '',
    access,
    roles: access === 'Internal' ? getUserRoles('nu') : [],
    email: document.getElementById('nuEmail').value.trim() || `${userName}@psed.gov.ph`,
    status: 'Active',
    av: ['linear-gradient(135deg,#0ea5e9,#0369a1)', 'linear-gradient(135deg,#10b981,#047857)', 'linear-gradient(135deg,#f97316,#b45309)'][Math.floor(Math.random() * 3)],
    ini: name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase(),
    perms: buildPermissions(access),
  });
  addLog(`New user: ${name} (${access})`, UNAME, 'Upload', '👤', 'rgba(14,165,233,.1)');
  ['nuName', 'nuUser', 'nuDept', 'nuAgency', 'nuEmail', 'nuPwd'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('nuAccess').value = 'Internal';
  renderRoleCheckboxes('nuRolesBox');
  toggleUserRoleFields('nu');
  buildAll();
  toast('✅', 'User Added', `${name} (${access})`);
  closeModal('addUserModal');
}

function buildPermissions(access) {
  if (access === 'PSED Admin') return ['Internal Upload', 'Repository Access', 'User Management', 'Notifications', 'Logs'];
  if (access === 'Agency') return ['PRIME-HRM Upload'];
  return ['Internal Upload', 'Repository Access', 'Notifications'];
}

function addLog(act, usr, type, ico, bg) {
  LOGS.unshift({ act, usr, type, time: new Date().toISOString().slice(0, 16).replace('T', ' '), ico, bg });
  if (document.getElementById('pg-logs').classList.contains('active')) renderLogs();
}

function updateLogUserFilter() {
  const select = document.getElementById('logUsr');
  const current = select.value;
  select.innerHTML = '<option value="">All Users</option>' + USERS.map(user => `<option>${user.user}</option>`).join('');
  select.value = current;
}

function renderLogs() {
  const action = document.getElementById('logAct').value;
  const user = document.getElementById('logUsr').value;
  const date = document.getElementById('logDate').value;
  const filtered = LOGS.filter(log => (!action || log.type === action || log.act.toLowerCase().includes(action.toLowerCase())) && (!user || log.usr === user) && (!date || log.time.startsWith(date)));
  document.getElementById('logCount').textContent = `${filtered.length} record(s)`;
  const paged = filtered.slice((logsPage - 1) * LP, logsPage * LP);
  document.getElementById('logsList').innerHTML = paged.length ? paged.map(log => `<div class="log-item"><div class="log-ico" style="background:${log.bg}">${log.ico}</div><div style="flex:1"><div class="log-act">${log.act}</div><div class="log-usr">by ${log.usr}</div></div><div class="log-time">${log.time}</div></div>`).join('') : `<div class="empty-state"><div class="empty-ico">📋</div><div>No log entries found.</div></div>`;
  buildPager('logsPager', filtered.length, LP, logsPage, page => { logsPage = page; renderLogs(); });
}

function resetLogFilters() {
  ['logAct', 'logUsr'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('logDate').value = '';
  logsPage = 1;
  renderLogs();
}

function confirmClearLogs() {
  showConfirm('Clear All Logs', '⚠', 'This will permanently delete all activity logs.', () => {
    LOGS.length = 0;
    renderLogs();
    toast('🗑', 'Cleared', 'All logs removed.');
  });
}

function legacySaveAllSettings() {
  toast('💾', 'All Settings Saved', 'All configurations updated successfully.');
}

function legacySaveProfile() {
  const user = getCurrentUser();
  if (!user) return;
  user.name = document.getElementById('profName').value.trim() || user.name;
  user.user = document.getElementById('profUser').value.trim() || user.user;
  user.email = document.getElementById('profEmail').value.trim() || user.email;
  addLog('Updated profile settings', UNAME, 'Settings', '⚙', 'rgba(100,116,139,.1)');
  toast('✅', 'Profile Saved', `${user.name} profile updated.`);
  document.getElementById('profPwd').value = '';
  initApp();
}

function sendNotification() {
  const audience = document.getElementById('notifAudience').value;
  const subject = document.getElementById('notifSubject').value.trim();
  const message = document.getElementById('notifMessage').value.trim();
  if (!subject || !message) return toast('⚠', 'Required', 'Subject and message are required.');
  NOTIFS.unshift({ txt: `${subject} — ${audience}`, time: 'Just now', col: 'var(--purple)' });
  addLog(`Sent notification to ${audience}`, UNAME, 'Settings', '📣', 'rgba(139,92,246,.14)');
  document.getElementById('notifSubject').value = '';
  document.getElementById('notifMessage').value = '';
  buildNotifs();
  toast('📣', 'Notification Sent', 'Notification added to the activity stream.');
}

function runBackup() {
  toast('💾', 'Backup Started', 'Creating system backup…');
  setTimeout(() => toast('✅', 'Backup Complete', 'All data backed up.'), 2200);
}

function confirmReset() {
  showConfirm('Reset System', '⚠', 'Reset all system settings to defaults? Data will not be deleted.', () => {
    toast('⚙', 'Reset', 'Settings restored to defaults.');
  });
}

function buildNotifs() {
  const list = document.getElementById('notifList');
  if (!NOTIFS.length) {
    list.innerHTML = `<div class="np-empty">No notifications</div>`;
    document.getElementById('notifBtn').classList.remove('dot');
    return;
  }
  list.innerHTML = NOTIFS.map((notif, index) => `<div class="np-item" onclick="dismissNotif(${index})"><div class="np-dot" style="background:${notif.col}"></div><div><div class="np-txt">${notif.txt}</div><div class="np-time">${notif.time}</div></div></div>`).join('');
  document.getElementById('notifBtn').classList.add('dot');
}

function dismissNotif(index) {
  NOTIFS.splice(index, 1);
  buildNotifs();
}

function clearNotifs() {
  NOTIFS = [];
  buildNotifs();
  closeNotif();
}

function toggleNotif() {
  document.getElementById('notifPanel').classList.toggle('open');
}

function closeNotif() {
  document.getElementById('notifPanel').classList.remove('open');
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

window.addEventListener('click', event => {
  if (event.target.classList.contains('overlay')) event.target.classList.remove('open');
  if (!event.target.closest('#notifPanel') && !event.target.closest('#notifBtn')) closeNotif();
});

function showConfirm(title, icon, message, callback) {
  document.getElementById('cfIco').textContent = icon;
  document.getElementById('cfTitle').textContent = title;
  document.getElementById('cfMsg').textContent = message;
  confirmCB = callback;
  document.getElementById('cfOk').onclick = () => {
    if (confirmCB) confirmCB();
    closeModal('confirmModal');
  };
  openModal('confirmModal');
}

function buildPager(containerId, total, perPage, current, onPage) {
  const pages = Math.ceil(total / perPage);
  const container = document.getElementById(containerId);
  if (pages <= 1) return container.innerHTML = '';
  let html = `<span class="pg-info">Page ${current}/${pages}</span>`;
  html += `<button class="pg-btn" onclick="(${onPage.toString()})(1)" ${current === 1 ? 'disabled' : ''}>«</button>`;
  html += `<button class="pg-btn" onclick="(${onPage.toString()})(${current - 1})" ${current === 1 ? 'disabled' : ''}>‹</button>`;
  for (let page = Math.max(1, current - 1); page <= Math.min(pages, current + 1); page += 1) html += `<button class="pg-btn${page === current ? ' on' : ''}" onclick="(${onPage.toString()})(${page})">${page}</button>`;
  html += `<button class="pg-btn" onclick="(${onPage.toString()})(${current + 1})" ${current === pages ? 'disabled' : ''}>›</button>`;
  html += `<button class="pg-btn" onclick="(${onPage.toString()})(${pages})" ${current === pages ? 'disabled' : ''}>»</button>`;
  container.innerHTML = html;
}

let toastTimer;
function toast(icon, title, message, delay = 0) {
  clearTimeout(toastTimer);
  const el = document.getElementById('toast');
  setTimeout(() => {
    document.getElementById('tIco').textContent = icon;
    document.getElementById('tTtl').textContent = title;
    document.getElementById('tMsg').textContent = message || '';
    el.classList.add('show');
    toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
  }, delay);
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.overlay.open').forEach(overlay => overlay.classList.remove('open'));
});

async function saveStorageSettings() {
  if (ROLE !== 'PSED Admin') return toast('🚫', 'Denied', 'Only PSED Admin can update storage settings.');
  const formData = new FormData();
  formData.append('action', 'save_storage');
  formData.append('storage_root', document.getElementById('storageRoot').value.trim());
  formData.append('internal_subdir', document.getElementById('internalSubdir').value.trim());
  formData.append('prime_subdir', document.getElementById('primeSubdir').value.trim());

  try {
    await apiJson('process/settingsProcess.php', { method: 'POST', body: formData });
    await hydrateFromServer();
    toast('✅', 'Saved', 'Storage settings updated.');
  } catch (error) {
    toast('⚠', 'Save Failed', error.message);
  }
}

async function saveAllSettings() {
  await saveStorageSettings();
}

async function saveProfile() {
  const formData = new FormData();
  formData.append('action', 'save_profile');
  formData.append('full_name', document.getElementById('profName').value.trim());
  formData.append('username', document.getElementById('profUser').value.trim());
  formData.append('email', document.getElementById('profEmail').value.trim());
  formData.append('old_password', document.getElementById('profOldPwd').value.trim());
  formData.append('new_password', document.getElementById('profPwd').value.trim());

  try {
    await apiJson('process/settingsProcess.php', { method: 'POST', body: formData });
    document.getElementById('profOldPwd').value = '';
    document.getElementById('profPwd').value = '';
    await hydrateFromServer();
    toast('✅', 'Profile Saved', 'Profile updated successfully.');
  } catch (error) {
    toast('⚠', 'Save Failed', error.message);
  }
}

async function addUser() {
  const name = document.getElementById('nuName').value.trim();
  const userName = document.getElementById('nuUser').value.trim();
  const access = document.getElementById('nuAccess').value;
  const password = document.getElementById('nuPwd').value.trim();
  if (!name || !userName || !password) return toast('⚠', 'Required', 'Name, username, and temporary password are required.');

  const formData = new FormData();
  formData.append('action', 'create');
  formData.append('full_name', name);
  formData.append('username', userName);
  formData.append('password', password);
  formData.append('access_group', access);
  formData.append('department', document.getElementById('nuDept').value.trim());
  formData.append('agency_name', document.getElementById('nuAgency').value.trim());
  formData.append('email', document.getElementById('nuEmail').value.trim());
  getUserRoles('nu').forEach(role => formData.append('roles[]', role));

  try {
    await apiJson('process/userProcess.php', { method: 'POST', body: formData });
    ['nuName', 'nuUser', 'nuDept', 'nuAgency', 'nuEmail', 'nuPwd'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    document.getElementById('nuAccess').value = 'Internal';
    renderRoleCheckboxes('nuRolesBox');
    toggleUserRoleFields('nu');
    await hydrateFromServer();
    toast('✅', 'User Added', `${name} (${access})`);
    closeModal('addUserModal');
  } catch (error) {
    toast('⚠', 'Create Failed', error.message);
  }
}

async function saveEditUser() {
  const formData = new FormData();
  formData.append('action', 'update');
  formData.append('id', String(editUserId));
  formData.append('full_name', document.getElementById('euName').value.trim());
  formData.append('username', document.getElementById('euUser').value.trim());
  formData.append('access_group', document.getElementById('euAccess').value);
  formData.append('department', document.getElementById('euDept').value.trim());
  formData.append('agency_name', document.getElementById('euAgency').value.trim());
  formData.append('email', document.getElementById('euEmail').value.trim());
  formData.append('status', document.getElementById('euStatus').value);
  getUserRoles('eu').forEach(role => formData.append('roles[]', role));

  try {
    await apiJson('process/userProcess.php', { method: 'POST', body: formData });
    await hydrateFromServer();
    toast('✅', 'Saved', 'User updated.');
    closeModal('editUserModal');
  } catch (error) {
    toast('⚠', 'Save Failed', error.message);
  }
}

function suspendUser(id) {
  const user = USERS.find(item => item.id === id);
  if (!user) return;
  showConfirm(user.status === 'Active' ? 'Suspend User' : 'Reactivate User', '⚠', `${user.status === 'Active' ? 'Suspend' : 'Reactivate'} account for ${user.name}?`, () => {
    const formData = new FormData();
    formData.append('action', 'toggle_status');
    formData.append('id', String(id));
    apiJson('process/userProcess.php', { method: 'POST', body: formData })
      .then(() => hydrateFromServer())
      .then(() => toast('✅', 'Done', `${user.name} account updated.`))
      .catch(error => toast('⚠', 'Update Failed', error.message));
  });
}

async function submitPrime() {
  if (ROLE !== 'Agency') return toast('🚫', 'Denied', 'Only agency accounts can upload ERs.');
  if (!primeFile || !isPrimeFolderSelectionComplete()) return toast('⚠', 'Required', 'Select the PRIME-HRM hierarchy, indicator, and attach a PDF.');
  const indicator = document.getElementById('prIndicator').value;
  const indicatorCode = indicator.split(' - ')[0] || INDICATOR_CODE_PLACEHOLDER;
  const formData = new FormData();
  formData.append('action', 'upload');
  formData.append('core_area', document.getElementById('prFolder1').value);
  formData.append('pillar', document.getElementById('prFolder2').value);
  formData.append('pillar_element', document.getElementById('prFolder3').value);
  formData.append('indicator_code', indicatorCode);
  formData.append('indicator_label', indicator);
  formData.append('file', primeFile);

  try {
    const result = await apiJson('process/primeProcess.php', { method: 'POST', body: formData });
    NOTIFS.unshift({ txt: `PRIME-HRM submission received from ${getPrimeAgencyName()}`, time: 'Just now', col: 'var(--green)' });
    clearPrimeFile();
    renderPrimeFolderSelectors();
    await hydrateFromServer();
    toast('✅', 'Submitted', `${result.prime_submission.stored_filename} added to My Submissions.`);
  } catch (error) {
    toast('⚠', 'Submission Failed', error.message);
  }
}

function buildAgencyDashboard() {
  const statsHost = document.getElementById('agencyDashStats');
  const bannerHost = document.getElementById('agencyDashBanner');
  const tableHost = document.getElementById('agencyDashTbl');
  const countHost = document.getElementById('agencyDashCount');
  if (!statsHost || !bannerHost || !tableHost || !countHost) return;

  const mySubs = PRIME_SUBMISSIONS.filter(item => item.account === UNAME);
  const submitted = mySubs.filter(item => item.status === 'submitted').length;
  const inReview = mySubs.filter(item => item.status === 'under review').length;
  const received = mySubs.filter(item => item.status === 'received').length;

  bannerHost.innerHTML = `<div class="info-banner" style="background:rgba(16,185,129,.07);border:1px solid rgba(16,185,129,.18);"><span style="font-size:18px">📁</span><div>${getPrimeAgencyName()} is signed in. This workspace is limited to PRIME-HRM Evidence Requirements only.</div></div>`;
  statsHost.innerHTML = `
    <div class="stat-card" style="--sc:var(--accent);cursor:default"><div class="sc-lbl">My Submissions</div><div class="sc-val" style="color:var(--accent)">${mySubs.length}</div><div class="sc-sub">All uploaded ERs</div><div class="sc-ico">📎</div></div>
    <div class="stat-card" style="--sc:var(--yellow);cursor:default"><div class="sc-lbl">Submitted / In Review</div><div class="sc-val" style="color:var(--yellow)">${submitted + inReview}</div><div class="sc-sub">Pending PSED action</div><div class="sc-ico">⏳</div></div>
    <div class="stat-card" style="--sc:var(--green);cursor:default"><div class="sc-lbl">Received</div><div class="sc-val" style="color:var(--green)">${received}</div><div class="sc-sub">Accepted submissions</div><div class="sc-ico">✅</div></div>
  `;
  countHost.textContent = `${mySubs.length} submission(s)`;
  tableHost.innerHTML = mySubs.length ? mySubs.slice(0, 6).map(item => `
    <tr>
      <td class="mono-sm">${item.id}</td>
      <td>${item.savedFileName}</td>
      <td style="max-width:240px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${item.folderPath}">${item.folderPath}</td>
      <td class="mono-sm">${item.submitted}</td>
      <td><span class="badge b-${item.status === 'received' ? 'approved' : item.status === 'under review' ? 'processing' : 'submitted'}">${item.status}</span></td>
      <td><div class="btn-row"><button class="btn btn-blue" onclick="viewPrimeSubmission('${item.id}')">👁 View</button><button class="btn" onclick="downloadPrimeSubmission('${item.id}')">⬇ Download</button></div></td>
    </tr>
  `).join('') : `<tr><td colspan="6"><div class="empty-state"><div class="empty-ico">📭</div><div>No PRIME-HRM submissions yet.</div></div></td></tr>`;
}

document.addEventListener('DOMContentLoaded', () => {
  hydrateFromServer();
});
