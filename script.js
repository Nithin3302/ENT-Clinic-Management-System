const stateKeys = {
  patients: 'ent-patients',
  appointments: 'ent-appointments',
  consultations: 'ent-consultations',
  entExams: 'ent-exams',
  phonosurgery: 'ent-phonosurgery',
  balanceDisorders: 'ent-balance-disorders',
  audiology: 'ent-audiology',
};

const sections = document.querySelectorAll('nav button');
const panels = document.querySelectorAll('.panel');

function switchSection(id) {
  sections.forEach(button => button.classList.toggle('active', button.dataset.section === id));
  panels.forEach(panel => panel.classList.toggle('active', panel.id === id));
}

sections.forEach(button => {
  button.addEventListener('click', () => switchSection(button.dataset.section));
});

function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadData(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function renderTable(key, tableId, mapper) {
  const rows = loadData(key).map(mapper);
  const tbody = document.querySelector(`#${tableId} tbody`);
  if (!tbody) return;
  tbody.innerHTML = rows.join('');
}

function displayPatientDetails(patient) {
  const container = document.getElementById('patient-details');
  const clearButton = document.getElementById('patient-details-clear');
  if (!patient) {
    container.innerHTML = '';
    container.classList.add('hidden');
    clearButton.classList.add('hidden');
    return;
  }

  container.innerHTML = `
    <h4>Patient Details</h4>
    <div class="detail-grid">
      <div><strong>ID</strong><p>${patient.id}</p></div>
      <div><strong>Name</strong><p>${patient.fullName}</p></div>
      <div><strong>Age</strong><p>${patient.age}</p></div>
      <div><strong>Gender</strong><p>${patient.gender}</p></div>
      <div><strong>DOB</strong><p>${patient.dob || '-'}</p></div>
      <div><strong>Mobile</strong><p>${patient.mobile}</p></div>
      <div><strong>Email</strong><p>${patient.email || '-'}</p></div>
      <div><strong>Blood Group</strong><p>${patient.bloodGroup || '-'}</p></div>
      <div><strong>Allergies</strong><p>${patient.allergies || '-'}</p></div>
      <div class="detail-wide"><strong>Address</strong><p>${patient.address || '-'}</p></div>
      <div class="detail-wide"><strong>Medical History</strong><p>${patient.history || '-'}</p></div>
      <div class="detail-wide"><strong>Saved At</strong><p>${new Date(patient.createdAt).toLocaleString()}</p></div>
    </div>
  `;
  container.classList.remove('hidden');
  clearButton.classList.remove('hidden');
}

function createRecord(key, record) {
  const records = loadData(key);
  records.unshift(record);
  saveData(key, records);
}

function createFormHandler(formId, key, buildRecord, tableId, mapper) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const record = buildRecord();
    createRecord(key, record);
    form.reset();
    renderTable(key, tableId, mapper);
  });
}

createFormHandler('patient-form', stateKeys.patients, () => ({
  id: generateId('patient'),
  fullName: document.getElementById('patient-fullName').value.trim(),
  age: document.getElementById('patient-age').value,
  gender: document.getElementById('patient-gender').value,
  dob: document.getElementById('patient-dob').value,
  mobile: document.getElementById('patient-mobile').value.trim(),
  email: document.getElementById('patient-email').value.trim(),
  address: document.getElementById('patient-address').value.trim(),
  bloodGroup: document.getElementById('patient-bloodGroup').value.trim(),
  allergies: document.getElementById('patient-allergies').value.trim(),
  history: document.getElementById('patient-history').value.trim(),
  createdAt: new Date().toISOString(),
}), 'patient-table', item => `<tr><td>${item.id}</td><td>${item.fullName}</td><td>${item.age}</td><td>${item.gender}</td><td>${item.mobile}</td><td>${item.email}</td><td><button class="view-detail-button" data-patient-id="${item.id}">View Details</button></td></tr>`);

createFormHandler('appointment-form', stateKeys.appointments, () => ({
  id: generateId('appointment'),
  patientId: document.getElementById('appointment-patientId').value.trim(),
  doctor: document.getElementById('appointment-doctor').value.trim(),
  date: document.getElementById('appointment-date').value,
  time: document.getElementById('appointment-time').value,
  type: document.getElementById('appointment-type').value,
  status: document.getElementById('appointment-status').value,
  createdAt: new Date().toISOString(),
}), 'appointment-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.doctor}</td><td>${item.date}</td><td>${item.time}</td><td>${item.type}</td><td>${item.status}</td></tr>`);

createFormHandler('consultation-form', stateKeys.consultations, () => ({
  id: generateId('consultation'),
  patientId: document.getElementById('consultation-patientId').value.trim(),
  complaints: document.getElementById('consultation-complaints').value.trim(),
  symptoms: document.getElementById('consultation-symptoms').value.trim(),
  diagnosis: document.getElementById('consultation-diagnosis').value.trim(),
  observations: document.getElementById('consultation-observations').value.trim(),
  treatment: document.getElementById('consultation-treatment').value.trim(),
  followup: document.getElementById('consultation-followup').value,
  createdAt: new Date().toISOString(),
}), 'consultation-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.diagnosis}</td><td>${item.followup || '-'}</td></tr>`);

createFormHandler('ent-form', stateKeys.entExams, () => ({
  id: generateId('ent'),
  patientId: document.getElementById('ent-patientId').value.trim(),
  ear: document.getElementById('ent-ear').value.trim(),
  nose: document.getElementById('ent-nose').value.trim(),
  throat: document.getElementById('ent-throat').value.trim(),
  larynx: document.getElementById('ent-larynx').value.trim(),
  remarks: document.getElementById('ent-remarks').value.trim(),
  createdAt: new Date().toISOString(),
}), 'ent-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.ear || '-'}</td><td>${item.nose || '-'}</td><td>${item.throat || '-'}</td></tr>`);

createFormHandler('phonosurgery-form', stateKeys.phonosurgery, () => ({
  id: generateId('phonosurgery'),
  patientId: document.getElementById('phono-patientId').value.trim(),
  disorder: document.getElementById('phono-disorder').value.trim(),
  vocalCord: document.getElementById('phono-vocalCord').value.trim(),
  procedure: document.getElementById('phono-procedure').value.trim(),
  preop: document.getElementById('phono-preop').value.trim(),
  postop: document.getElementById('phono-postop').value.trim(),
  createdAt: new Date().toISOString(),
}), 'phonosurgery-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.disorder || '-'}</td><td>${item.procedure || '-'}</td></tr>`);

createFormHandler('balance-form', stateKeys.balanceDisorders, () => ({
  id: generateId('balance'),
  patientId: document.getElementById('balance-patientId').value.trim(),
  symptoms: document.getElementById('balance-symptoms').value.trim(),
  tests: document.getElementById('balance-tests').value.trim(),
  diagnosis: document.getElementById('balance-diagnosis').value.trim(),
  treatment: document.getElementById('balance-treatment').value.trim(),
  createdAt: new Date().toISOString(),
}), 'balance-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.symptoms || '-'}</td><td>${item.diagnosis || '-'}</td></tr>`);

createFormHandler('audiology-form', stateKeys.audiology, () => ({
  id: generateId('audiology'),
  patientId: document.getElementById('audio-patientId').value.trim(),
  leftDb: document.getElementById('audio-leftDb').value,
  rightDb: document.getElementById('audio-rightDb').value,
  lossType: document.getElementById('audio-lossType').value.trim(),
  diagnosis: document.getElementById('audio-diagnosis').value.trim(),
  createdAt: new Date().toISOString(),
}), 'audiology-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.leftDb || '-'}</td><td>${item.rightDb || '-'}</td><td>${item.lossType || '-'}</td></tr>`);

function updateStats() {
  const stats = {
    patients: loadData(stateKeys.patients).length,
    appointments: loadData(stateKeys.appointments).length,
    consultations: loadData(stateKeys.consultations).length,
    audiology: loadData(stateKeys.audiology).length,
  };

  const map = {
    patients: 'stats-patients',
    appointments: 'stats-appointments',
    consultations: 'stats-consultations',
    audiology: 'stats-audiology',
  };

  Object.keys(stats).forEach(key => {
    const el = document.getElementById(map[key]);
    if (el) el.textContent = stats[key];
  });
}

function renderAll() {
  renderTable(stateKeys.patients, 'patient-table', item => `<tr><td>${item.id}</td><td>${item.fullName}</td><td>${item.age}</td><td>${item.gender}</td><td>${item.mobile}</td><td>${item.email}</td><td><button class="view-detail-button" data-patient-id="${item.id}">View Details</button></td></tr>`);
  renderTable(stateKeys.appointments, 'appointment-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.doctor}</td><td>${item.date}</td><td>${item.time}</td><td>${item.type}</td><td>${item.status}</td></tr>`);
  renderTable(stateKeys.consultations, 'consultation-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.diagnosis || '-'}</td><td>${item.followup || '-'}</td></tr>`);
  renderTable(stateKeys.entExams, 'ent-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.ear || '-'}</td><td>${item.nose || '-'}</td><td>${item.throat || '-'}</td></tr>`);
  renderTable(stateKeys.phonosurgery, 'phonosurgery-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.disorder || '-'}</td><td>${item.procedure || '-'}</td></tr>`);
  renderTable(stateKeys.balanceDisorders, 'balance-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.symptoms || '-'}</td><td>${item.diagnosis || '-'}</td></tr>`);
  renderTable(stateKeys.audiology, 'audiology-table', item => `<tr><td>${item.id}</td><td>${item.patientId}</td><td>${item.leftDb || '-'}</td><td>${item.rightDb || '-'}</td><td>${item.lossType || '-'}</td></tr>`);
  updateStats();
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll();
  switchSection('patient-management');

  const patientTableBody = document.querySelector('#patient-table tbody');
  const clearButton = document.getElementById('patient-details-clear');

  if (patientTableBody) {
    patientTableBody.addEventListener('click', event => {
      const button = event.target.closest('.view-detail-button');
      if (!button) return;
      const patientId = button.dataset.patientId;
      const patient = loadData(stateKeys.patients).find(item => item.id === patientId);
      if (patient) displayPatientDetails(patient);
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => displayPatientDetails(null));
  }
});
