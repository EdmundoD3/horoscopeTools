let currentPage = 1;
const pageSize = 10;

async function loadEntries() {
  const sign = document.getElementById('sign').value;
  const lang = document.getElementById('lang').value;
  const theme = document.getElementById("theme").value;
  const type = document.getElementById("type").value;
  const search = document.getElementById("search").value;

  const url = new URL('api/entries', window.location.origin);
  url.searchParams.set('page', currentPage);
  url.searchParams.set('pageSize', pageSize);
  if (sign) url.searchParams.set('sign', sign);
  if (lang) url.searchParams.set('lang', lang);
  if (theme) url.searchParams.set('theme', theme);
  if (type) url.searchParams.set('type', type);
  if (search) url.searchParams.set('search', search);

  const res = await fetch(url);
  const { entries, total } = await res.json();
  renderTable(entries);
  document.getElementById('pageIndicator').textContent = `Página ${currentPage}`;
}

function renderTable(entries) {
  const tbody = document.querySelector('#entryTable tbody');
  tbody.innerHTML = '';

  entries.forEach(e => {
    const row = document.createElement('tr');
    row.innerHTML = `
          <td>${e.id}</td>
          <td>${e.sign}</td>
          <td>${e.type}</td>
          <td>${e.lang}</td>
          <td>${e.theme}</td>
          <td>${e.title}</td>
          <td>${e.content}</td>
          <td>
            <button onclick="deleteEntry(${e.id})">🗑️</button>
            <button onclick="editEntry(${e.id})">✏️</button>
          </td>
        `;
    tbody.appendChild(row);
  });
}

function nextPage() {
  currentPage++;
  loadEntries();
}

function prevPage() {
  if (currentPage > 1) currentPage--;
  loadEntries();
}

async function deleteEntry(id) {
  if (!confirm('¿Eliminar esta entrada?')) return;
  const res = await fetch(`api/entries/${id}`, { method: 'DELETE' });
  if (res.ok) {
    alert('Eliminado.');
    loadEntries();
  } else {
    alert('Error al eliminar.');
  }
}

function editEntry(id) {
  window.location.href = `/edit-entry.html?id=${id}`;
}

loadEntries();