const API = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api/employees'
  : 'https://employee-management-system-p2iq.onrender.com/api/employees';

// ─── AUTH GUARD ───────────────────────────────────────────
function getToken() {
  return localStorage.getItem('ems_token');
}

function getCompany() {
  const c = localStorage.getItem('ems_company');
  return c ? JSON.parse(c) : null;
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// Redirect to login if no token
if (!getToken()) {
  window.location.href = 'login.html';
}

// ─── LOAD COMPANY NAME IN UI ──────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const company = getCompany();
  if (company) {
    const nameEl = document.getElementById('company-name');
    const initEl = document.getElementById('company-initial');
    if (nameEl) nameEl.textContent = company.companyName;
    if (initEl) initEl.textContent = company.companyName.charAt(0).toUpperCase();
  }
  loadDashboard();
});

// ─── LOGOUT ───────────────────────────────────────────────
function logout() {
  if (!confirm('Are you sure you want to sign out?')) return;
  localStorage.removeItem('ems_token');
  localStorage.removeItem('ems_company');
  window.location.href = 'login.html';
}

// ─── NAVIGATION ───────────────────────────────────────────
function showSection(id, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(id).classList.add('active');

  const titles = {
    'dashboard': 'Dashboard',
    'add-employee': 'Add Employee',
    'all-employees': 'All Employees'
  };

  document.getElementById('page-title').textContent = titles[id];
  document.getElementById('topbar-breadcrumb-page').textContent = titles[id].toUpperCase();

  if (el) el.classList.add('active');
  if (id === 'dashboard') loadDashboard();
  if (id === 'all-employees') loadAllEmployees();
  return false;
}

function refreshPage() {
  const active = document.querySelector('.section.active');
  if (active.id === 'dashboard') loadDashboard();
  if (active.id === 'all-employees') loadAllEmployees();
}

// ─── DASHBOARD ────────────────────────────────────────────
async function loadDashboard() {
  try {
    const res = await fetch(API, { headers: authHeaders() });

    if (res.status === 401) { logout(); return; }

    const json = await res.json();
    const employees = json.data || [];

    animateCount('total-employees', employees.length);
    animateCount('active-employees', employees.filter(e => e.status === 'Active').length);
    animateCount('contract-employees', employees.filter(e => e.employmentType === 'Contract').length);
    const depts = new Set(employees.map(e => e.department));
    animateCount('total-departments', depts.size);

    const qs = document.getElementById('qs-fulltime');
    if (qs) {
      document.getElementById('qs-fulltime').textContent  = employees.filter(e => e.employmentType === 'Full-time').length;
      document.getElementById('qs-parttime').textContent  = employees.filter(e => e.employmentType === 'Part-time').length;
      document.getElementById('qs-contract').textContent  = employees.filter(e => e.employmentType === 'Contract').length;
      document.getElementById('qs-inactive').textContent  = employees.filter(e => e.status === 'Inactive').length;
    }

    renderDeptBars(employees);

    const tbody = document.getElementById('recent-tbody');
    const recent = employees.slice(0, 6);

    if (recent.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No employees yet. Add your first employee.</p></td></tr>`;
      return;
    }

    tbody.innerHTML = recent.map(e => `
      <tr>
        <td class="emp-id">${e.employeeId}</td>
        <td style="font-weight:500;color:var(--text);">${e.fullName}</td>
        <td>${e.department}</td>
        <td>${e.designation}</td>
        <td><span class="badge ${e.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${e.status}</span></td>
      </tr>
    `).join('');

  } catch (err) {
    console.error(err);
  }
}

function renderDeptBars(employees) {
  const deptCount = {};
  employees.forEach(e => {
    deptCount[e.department] = (deptCount[e.department] || 0) + 1;
  });

  const sorted = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;
  const container = document.getElementById('dept-bars');
  if (!container) return;

  if (sorted.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:16px;font-size:0.75rem;">No data yet</div>`;
    return;
  }

  container.innerHTML = sorted.map(([dept, count]) => `
    <div class="dept-bar-item">
      <div class="dept-bar-label">
        <span>${dept}</span>
        <span>${count}</span>
      </div>
      <div class="dept-bar-track">
        <div class="dept-bar-fill" style="width:0%" data-width="${Math.round((count / max) * 100)}%"></div>
      </div>
    </div>
  `).join('');

  setTimeout(() => {
    document.querySelectorAll('.dept-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.width;
    });
  }, 100);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let start = 0;
  const duration = 800;
  const startTime = performance.now();
  const update = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

// ─── LOAD ALL EMPLOYEES ───────────────────────────────────
async function loadAllEmployees() {
  const tbody = document.getElementById('employees-tbody');
  tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="fa-solid fa-spinner fa-spin"></i><p>Loading...</p></td></tr>`;

  try {
    const res = await fetch(API, { headers: authHeaders() });
    if (res.status === 401) { logout(); return; }
    const json = await res.json();
    renderTable(json.data || []);
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="fa-solid fa-circle-exclamation"></i><p>Failed to load. Is backend running?</p></td></tr>`;
  }
}

function renderTable(employees) {
  const tbody = document.getElementById('employees-tbody');

  if (employees.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No employees found</p></td></tr>`;
    return;
  }

  tbody.innerHTML = employees.map(e => `
    <tr>
      <td class="emp-id">${e.employeeId}</td>
      <td style="font-weight:500;color:var(--text);">${e.fullName}</td>
      <td style="font-size:0.8rem;">${e.email}</td>
      <td>${e.department}</td>
      <td>${e.designation}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.78rem;">₹${e.salary.toLocaleString('en-IN')}</td>
      <td><span class="type-badge">${e.employmentType}</span></td>
      <td><span class="badge ${e.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${e.status}</span></td>
      <td>
        <div class="action-btns">
          <button class="btn-edit" title="Edit" onclick="openEditModal('${e._id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="btn-delete" title="Delete" onclick="deleteEmployee('${e._id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ─── SEARCH ───────────────────────────────────────────────
async function searchEmployees() {
  const query = document.getElementById('search-input').value.trim();
  if (!query) { loadAllEmployees(); return; }

  try {
    const res = await fetch(
      `${API}/search?name=${encodeURIComponent(query)}&department=${encodeURIComponent(query)}`,
      { headers: authHeaders() }
    );
    if (res.status === 401) { logout(); return; }
    const json = await res.json();
    renderTable(json.data || []);
  } catch (err) {
    console.error(err);
  }
}

// ─── ADD EMPLOYEE ─────────────────────────────────────────
async function addEmployee() {
  const body = {
    fullName:       document.getElementById('fullName').value.trim(),
    email:          document.getElementById('email').value.trim(),
    phoneNumber:    document.getElementById('phoneNumber').value.trim(),
    department:     document.getElementById('department').value.trim(),
    designation:    document.getElementById('designation').value.trim(),
    salary:         Number(document.getElementById('salary').value),
    dateOfJoining:  document.getElementById('dateOfJoining').value,
    employmentType: document.getElementById('employmentType').value,
    status:         document.getElementById('status').value,
  };

  if (!body.fullName || !body.email || !body.phoneNumber || !body.department ||
      !body.designation || !body.salary || !body.dateOfJoining || !body.employmentType) {
    showMessage('error', '⚠ All fields are required.');
    return;
  }

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (res.status === 401) { logout(); return; }
    const json = await res.json();

    if (json.success) {
      showMessage('success', `✓ Employee ${json.data.employeeId} registered successfully.`);
      clearForm();
    } else {
      showMessage('error', `✗ ${json.message || 'Failed to add employee.'}`);
    }
  } catch (err) {
    showMessage('error', '✗ Server error. Make sure backend is running on port 5000.');
  }
}

function showMessage(type, text) {
  const el = document.getElementById('form-message');
  el.className = `form-message ${type}`;
  el.textContent = text;
  setTimeout(() => { el.className = 'form-message'; el.textContent = ''; }, 5000);
}

function clearForm() {
  ['fullName','email','phoneNumber','department','designation',
   'salary','dateOfJoining','employmentType'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('status').value = 'Active';
}

// ─── DELETE ───────────────────────────────────────────────
async function deleteEmployee(id) {
  if (!confirm('Permanently delete this employee record?')) return;
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.status === 401) { logout(); return; }
    const json = await res.json();
    if (json.success) loadAllEmployees();
  } catch (err) {
    console.error(err);
  }
}

// ─── EDIT MODAL ───────────────────────────────────────────
async function openEditModal(id) {
  try {
    const res = await fetch(`${API}/${id}`, { headers: authHeaders() });
    if (res.status === 401) { logout(); return; }
    const json = await res.json();
    const e = json.data;

    document.getElementById('edit-id').value              = e._id;
    document.getElementById('edit-fullName').value        = e.fullName;
    document.getElementById('edit-email').value           = e.email;
    document.getElementById('edit-phoneNumber').value     = e.phoneNumber;
    document.getElementById('edit-department').value      = e.department;
    document.getElementById('edit-designation').value     = e.designation;
    document.getElementById('edit-salary').value          = e.salary;
    document.getElementById('edit-employmentType').value  = e.employmentType;
    document.getElementById('edit-status').value          = e.status;

    document.getElementById('edit-modal').style.display = 'flex';
  } catch (err) {
    console.error(err);
  }
}

function closeModal() {
  document.getElementById('edit-modal').style.display = 'none';
}

document.getElementById('edit-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── UPDATE ───────────────────────────────────────────────
async function updateEmployee() {
  const id = document.getElementById('edit-id').value;
  const body = {
    fullName:       document.getElementById('edit-fullName').value.trim(),
    email:          document.getElementById('edit-email').value.trim(),
    phoneNumber:    document.getElementById('edit-phoneNumber').value.trim(),
    department:     document.getElementById('edit-department').value.trim(),
    designation:    document.getElementById('edit-designation').value.trim(),
    salary:         Number(document.getElementById('edit-salary').value),
    employmentType: document.getElementById('edit-employmentType').value,
    status:         document.getElementById('edit-status').value,
  };

  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    if (res.status === 401) { logout(); return; }
    const json = await res.json();
    if (json.success) { closeModal(); loadAllEmployees(); }
  } catch (err) {
    console.error(err);
  }
}