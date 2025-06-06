import { HoroscopeEntry } from '/shared/models/horoscopoEntry.js';

const params = new URLSearchParams(window.location.search);
const entryId = params.get('id');
async function fetchEntry() {
  const res = await fetch(`/api/entries/${entryId}`);
  if (!res.ok) {
    return alert('Error al obtener la entrada.');
  }
  const entry = await res.json();
  const horoscopeEntry = new HoroscopeEntry(entry)
  document.getElementById('entryId').value = horoscopeEntry.id;
  document.getElementById('title').value = horoscopeEntry.title;
  document.getElementById('content').value = horoscopeEntry.content;
  document.getElementById('sign').value = horoscopeEntry.sign;
  document.getElementById('type').value = horoscopeEntry.type;
  document.getElementById('lang').value = horoscopeEntry.lang;
  document.getElementById('theme').value = horoscopeEntry.theme;
}

document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const entry = new HoroscopeEntry({
    type: document.getElementById('type').value,
    title: document.getElementById('title').value,
    content: document.getElementById('content').value,
    sign: document.getElementById('sign').value,
    lang: document.getElementById('lang').value,
    theme: document.getElementById('theme').value,
    id:entryId
  })
  console.log(entry);

  const res = await fetch(`/api/entries/${entryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });

  if (res.ok) {
    alert('Cambios guardados');
    window.location.href = '/manage';
  } else {
    alert('Error al guardar');
  }
});

fetchEntry();