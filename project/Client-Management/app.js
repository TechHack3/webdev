// app.js (module)
const STORAGE_KEY = 'cms-data-v1';

// Utilities
const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));
const getById = id => document.getElementById(id);

// default sample data
const sample = {
  clients: [
    { id: 1, name: 'John Smith', email: 'john@gmail.com', phone: '9876543210', company: 'Smith Designs' },
    { id: 2, name: 'Sara Brown', email: 'sara@gmail.com', phone: '9898989898', company: 'Brown Architects' }
  ],
  projects: [
    { id: 1, name: 'Office Building', clientId: 1, status: 'Ongoing', start: '2025-10-01', end: '' },
    { id: 2, name: 'Villa Renovation', clientId: 2, status: 'Completed', start: '2025-05-10', end: '2025-09-25' }
  ],
  meetings: [
    { id:1, clientId:1, projectId:1, date:'2025-10-30', time:'15:00', agenda:'Design approval discussion' }
  ],
  portfolios: [
    { id:1, clientId:1, description:'Completed 5-story office building project.', image:'https://via.placeholder.com/600x400?text=Office+Building' }
  ],
  nextId: { clients:3, projects:3, meetings:2, portfolios:2 }
};

// load / save
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
    return JSON.parse(JSON.stringify(sample));
  }
  return JSON.parse(raw);
}
function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// initialize app state
let state = loadData();

// --- UI Helpers ---
function showPage(id) {
  qsa('.page').forEach(p => p.classList.add('d-none'));
  qs(`#${id}`).classList.remove('d-none');
}

// render clients
function renderClients(filterText='') {
  const tbody = qs('#clientsTable tbody');
  tbody.innerHTML = '';
  const rows = state.clients
    .filter(c => (c.name + ' ' + c.company).toLowerCase().includes(filterText.toLowerCase()));
  rows.forEach((c, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${escapeHtml(c.name)}</td>
      <td>${escapeHtml(c.email||'')}</td>
      <td>${escapeHtml(c.phone||'')}</td>
      <td>${escapeHtml(c.company||'')}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-edit-client" data-id="${c.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger btn-del-client" data-id="${c.id}"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// render projects
function renderProjects() {
  const tbody = qs('#projectsTable tbody');
  tbody.innerHTML = '';
  state.projects.forEach((p, i) => {
    const client = state.clients.find(c => c.id===p.clientId);
    const statusBadge = p.status === 'Completed' ? '<span class="badge bg-success">Completed</span>' : (p.status==='Ongoing' ? '<span class="badge bg-warning text-dark">Ongoing</span>' : '<span class="badge bg-secondary">Planned</span>');
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${escapeHtml(p.name)}</td>
      <td>${escapeHtml(client ? client.name : '—')}</td>
      <td>${statusBadge}</td>
      <td>${p.start||'—'}</td>
      <td>${p.end||'—'}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-edit-project" data-id="${p.id}"><i class="bi bi-pencil"></i></button>
        <button class="btn btn-sm btn-outline-danger btn-del-project" data-id="${p.id}"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// render meetings
function renderMeetings() {
  const tbody = qs('#meetingsTable tbody');
  tbody.innerHTML = '';
  state.meetings.forEach((m, i) => {
    const client = state.clients.find(c => c.id===m.clientId);
    const project = state.projects.find(p => p.id===m.projectId);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i+1}</td>
      <td>${escapeHtml(client ? client.name : '—')}</td>
      <td>${escapeHtml(project ? project.name : '—')}</td>
      <td>${m.date}</td>
      <td>${m.time}</td>
      <td>${escapeHtml(m.agenda)}</td>
      <td>
        <button class="btn btn-sm btn-outline-danger btn-del-meeting" data-id="${m.id}"><i class="bi bi-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// render portfolios
function renderPortfolios() {
  const grid = qs('#portfolioGrid');
  grid.innerHTML = '';
  state.portfolios.forEach(p => {
    const client = state.clients.find(c => c.id===p.clientId);
    const col = document.createElement('div');
    col.className = 'col-md-4 mb-3';
    col.innerHTML = `
      <div class="card card-portfolio">
        <img src="${escapeAttr(p.image || 'assets/placeholder.png')}" alt="portfolio">
        <div class="p-3">
          <h5>${escapeHtml(client ? client.name : '—')}</h5>
          <p class="mb-1">${escapeHtml(p.description)}</p>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-sm btn-outline-primary btn-edit-portfolio" data-id="${p.id}">Edit</button>
            <button class="btn btn-sm btn-outline-danger btn-del-portfolio" data-id="${p.id}">Delete</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

// populate selects
function populateClientSelects() {
  const selects = qsa('#projectClient, #meetingClient, #portfolioClient, #meetingProject');
  selects.forEach(s => {
    s.innerHTML = '<option value="">-- select --</option>';
  });

  state.clients.forEach(c => {
    const opt = `<option value="${c.id}">${escapeHtml(c.name)} (${escapeHtml(c.company||'')})</option>`;
    qsa('#projectClient, #meetingClient, #portfolioClient').forEach(s => s.insertAdjacentHTML('beforeend', opt));
  });

  // projects for meetingProject select
  qsa('#meetingProject').forEach(s => {
    s.innerHTML = '<option value="">-- select --</option>';
    state.projects.forEach(p => s.insertAdjacentHTML('beforeend', `<option value="${p.id}">${escapeHtml(p.name)}</option>`));
  });
}

// add / edit / delete handlers
function openClientModal(editId) {
  const modalEl = qs('#modalClient');
  const bs = bootstrap.Modal.getOrCreateInstance(modalEl);
  const title = qs('#modalClient .modal-title');
  if (editId) {
    title.textContent = 'Edit Client';
    const c = state.clients.find(x=>x.id===editId);
    getById('clientId').value = c.id;
    getById('clientName').value = c.name;
    getById('clientEmail').value = c.email || '';
    getById('clientPhone').value = c.phone || '';
    getById('clientCompany').value = c.company || '';
  } else {
    title.textContent = 'Add Client';
    getById('clientId').value = '';
    getById('clientName').value = '';
    getById('clientEmail').value = '';
    getById('clientPhone').value = '';
    getById('clientCompany').value = '';
  }
  bs.show();
}

function openProjectModal(editId) {
  const modalEl = qs('#modalProject');
  const bs = bootstrap.Modal.getOrCreateInstance(modalEl);
  const title = qs('#modalProject .modal-title');
  populateClientSelects();
  if (editId) {
    title.textContent = 'Edit Project';
    const p = state.projects.find(x=>x.id===editId);
    getById('projectId').value = p.id;
    getById('projectName').value = p.name;
    getById('projectClient').value = p.clientId || '';
    getById('projectStatus').value = p.status || 'Ongoing';
    getById('projectStart').value = p.start || '';
    getById('projectEnd').value = p.end || '';
  } else {
    title.textContent = 'Add Project';
    getById('projectId').value = '';
    getById('projectName').value = '';
    getById('projectClient').value = '';
    getById('projectStatus').value = 'Ongoing';
    getById('projectStart').value = '';
    getById('projectEnd').value = '';
  }
  bs.show();
}

function openMeetingModal(editId) {
  const modalEl = qs('#modalMeeting');
  const bs = bootstrap.Modal.getOrCreateInstance(modalEl);
  const title = qs('#modalMeeting .modal-title');
  populateClientSelects();
  if (editId) {
    title.textContent = 'Edit Meeting';
    const m = state.meetings.find(x=>x.id===editId);
    getById('meetingId').value = m.id;
    getById('meetingClient').value = m.clientId || '';
    getById('meetingProject').value = m.projectId || '';
    getById('meetingDate').value = m.date || '';
    getById('meetingTime').value = m.time || '';
    getById('meetingAgenda').value = m.agenda || '';
  } else {
    title.textContent = 'Schedule Meeting';
    getById('meetingId').value = '';
    getById('meetingClient').value = '';
    getById('meetingProject').value = '';
    getById('meetingDate').value = '';
    getById('meetingTime').value = '';
    getById('meetingAgenda').value = '';
  }
  bs.show();
}

function openPortfolioModal(editId) {
  const modalEl = qs('#modalPortfolio');
  const bs = bootstrap.Modal.getOrCreateInstance(modalEl);
  const title = qs('#modalPortfolio .modal-title');
  populateClientSelects();
  if (editId) {
    title.textContent = 'Edit Portfolio';
    const p = state.portfolios.find(x=>x.id===editId);
    getById('portfolioId').value = p.id;
    getById('portfolioClient').value = p.clientId;
    getById('portfolioDesc').value = p.description;
    getById('portfolioImage').value = p.image;
  } else {
    title.textContent = 'Add Portfolio';
    getById('portfolioId').value = '';
    getById('portfolioClient').value = '';
    getById('portfolioDesc').value = '';
    getById('portfolioImage').value = '';
  }
  bs.show();
}

// form submit handlers
function handleClientForm(e) {
  e.preventDefault();
  const id = Number(getById('clientId').value || 0);
  const name = getById('clientName').value.trim();
  const email = getById('clientEmail').value.trim();
  const phone = getById('clientPhone').value.trim();
  const company = getById('clientCompany').value.trim();
  if (!name) return alert('Client name required');
  if (id) {
    const idx = state.clients.findIndex(c=>c.id===id);
    state.clients[idx] = { ...state.clients[idx], name, email, phone, company };
  } else {
    const newId = state.nextId.clients++;
    state.clients.push({ id:newId, name, email, phone, company});
  }
  saveData(state);
  renderClients(qs('#clientSearch').value || '');
  populateClientSelects();
  bootstrap.Modal.getInstance(qs('#modalClient')).hide();
}

function handleProjectForm(e) {
  e.preventDefault();
  const id = Number(getById('projectId').value || 0);
  const name = getById('projectName').value.trim();
  const clientId = Number(getById('projectClient').value || 0);
  const status = getById('projectStatus').value;
  const start = getById('projectStart').value || '';
  const end = getById('projectEnd').value || '';
  if (!name) return alert('Project name required');
  if (!clientId) return alert('Select client');
  if (id) {
    const idx = state.projects.findIndex(p=>p.id===id);
    state.projects[idx] = { ...state.projects[idx], name, clientId, status, start, end };
  } else {
    const newId = state.nextId.projects++;
    state.projects.push({ id:newId, name, clientId, status, start, end });
  }
  saveData(state);
  renderProjects();
  populateClientSelects();
  bootstrap.Modal.getInstance(qs('#modalProject')).hide();
}

function handleMeetingForm(e) {
  e.preventDefault();
  const id = Number(getById('meetingId').value || 0);
  const clientId = Number(getById('meetingClient').value || 0);
  const projectId = Number(getById('meetingProject').value || 0);
  const date = getById('meetingDate').value;
  const time = getById('meetingTime').value;
  const agenda = getById('meetingAgenda').value.trim();
  if (!clientId) return alert('Select client');
  if (!projectId) return alert('Select project');
  if (!date) return alert('Select date');
  if (id) {
    const idx = state.meetings.findIndex(m=>m.id===id);
    state.meetings[idx] = { ...state.meetings[idx], clientId, projectId, date, time, agenda };
  } else {
    const newId = state.nextId.meetings++;
    state.meetings.push({ id:newId, clientId, projectId, date, time, agenda });
  }
  saveData(state);
  renderMeetings();
  bootstrap.Modal.getInstance(qs('#modalMeeting')).hide();
}

function handlePortfolioForm(e) {
  e.preventDefault();
  const id = Number(getById('portfolioId').value || 0);
  const clientId = Number(getById('portfolioClient').value || 0);
  const desc = getById('portfolioDesc').value.trim();
  const image = getById('portfolioImage').value.trim() || 'https://via.placeholder.com/600x400?text=Portfolio';
  if (!clientId) return alert('Select client');
  if (!desc) return alert('Description required');
  if (id) {
    const idx = state.portfolios.findIndex(p=>p.id===id);
    state.portfolios[idx] = { ...state.portfolios[idx], clientId, description:desc, image };
  } else {
    const newId = state.nextId.portfolios++;
    state.portfolios.push({ id:newId, clientId, description:desc, image });
  }
  saveData(state);
  renderPortfolios();
  bootstrap.Modal.getInstance(qs('#modalPortfolio')).hide();
}

// delete utils
function deleteItem(collection, id) {
  if (!confirm('Are you sure?')) return;
  state[collection] = state[collection].filter(x=>x.id !== id);
  saveData(state);
  renderAll();
}

// render everything
function renderAll() {
  renderClients(qs('#clientSearch').value || '');
  renderProjects();
  renderMeetings();
  renderPortfolios();
  populateClientSelects();
}

// escape helpers (small)
function escapeHtml(s='') {
  return (s+'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;', "'":'&#39;'})[c]);
}
function escapeAttr(s=''){ return escapeHtml(s).replace(/"/g, '&quot;'); }

// initialize events
function init() {
  // nav
  getById('btnShowClients').addEventListener('click', ()=> showPage('page-clients'));
  getById('btnShowProjects').addEventListener('click', ()=> showPage('page-projects'));
  getById('btnShowMeetings').addEventListener('click', ()=> showPage('page-meetings'));
  getById('btnShowPortfolio').addEventListener('click', ()=> showPage('page-portfolio'));

  // add buttons
  getById('btnAddClient').addEventListener('click', ()=> openClientModal());
  getById('btnAddProject').addEventListener('click', ()=> openProjectModal());
  getById('btnAddMeeting').addEventListener('click', ()=> openMeetingModal());
  getById('btnAddPortfolio').addEventListener('click', ()=> openPortfolioModal());

  // search
  getById('clientSearch').addEventListener('input', (e)=> renderClients(e.target.value));

  // forms
  getById('formClient').addEventListener('submit', handleClientForm);
  getById('formProject').addEventListener('submit', handleProjectForm);
  getById('formMeeting').addEventListener('submit', handleMeetingForm);
  getById('formPortfolio').addEventListener('submit', handlePortfolioForm);

  // delegates for edit/delete
  document.addEventListener('click', (e) => {
    const el = e.target.closest && e.target.closest('button');
    if (!el) return;
    if (el.classList.contains('btn-edit-client')) openClientModal(Number(el.dataset.id));
    if (el.classList.contains('btn-del-client')) deleteItem('clients', Number(el.dataset.id));
    if (el.classList.contains('btn-edit-project')) openProjectModal(Number(el.dataset.id));
    if (el.classList.contains('btn-del-project')) deleteItem('projects', Number(el.dataset.id));
    if (el.classList.contains('btn-del-meeting')) deleteItem('meetings', Number(el.dataset.id));
    if (el.classList.contains('btn-edit-portfolio')) openPortfolioModal(Number(el.dataset.id));
    if (el.classList.contains('btn-del-portfolio')) deleteItem('portfolios', Number(el.dataset.id));
  });

  // initial render
  renderAll();

  // show clients page by default
  showPage('page-clients');
}

document.addEventListener('DOMContentLoaded', init);
