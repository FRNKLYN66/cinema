// If you open index.html directly from your computer, talk to localhost.
// After deployment (served by the server), use the same website address.
const BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
const API = BASE + '/api/showtimes';

const form = document.getElementById('showForm');
const tableBody = document.getElementById('tableBody');
const saveBtn = document.getElementById('saveBtn');
const cancelBtn = document.getElementById('cancelBtn');
const fields = ['movie_title', 'genre', 'cinema_hall', 'show_date', 'show_time', 'ticket_price', 'available_seats'];

// Stops text from being treated as HTML (safety)
function esc(v) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// READ: load and show all records
async function loadShowtimes() {
  const res = await fetch(API);
  const data = await res.json();
  tableBody.innerHTML = data.map(s => `
    <tr>
      <td>${s.id}</td>
      <td>${esc(s.movie_title)}</td>
      <td>${esc(s.genre)}</td>
      <td>${esc(s.cinema_hall)}</td>
      <td>${esc(s.show_date)}</td>
      <td>${esc(s.show_time)}</td>
      <td>${esc(s.ticket_price)}</td>
      <td>${esc(s.available_seats)}</td>
      <td>
        <button class="edit" onclick="startEdit(${s.id})">Edit</button>
        <button class="del" onclick="removeShowtime(${s.id})">Delete</button>
      </td>
    </tr>`).join('');
}

// CREATE or UPDATE when the form is submitted
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {};
  fields.forEach(f => body[f] = document.getElementById(f).value);
  body.ticket_price = body.ticket_price === '' ? null : Number(body.ticket_price);
  body.available_seats = body.available_seats === '' ? null : Number(body.available_seats);

  const id = document.getElementById('id').value;
  const url = id ? `${API}/${id}` : API;
  const method = id ? 'PUT' : 'POST';

  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) { alert((await res.json()).error); return; }

  resetForm();
  loadShowtimes();   // refresh the table
});

// EDIT: put the record's values back into the form
async function startEdit(id) {
  const s = await (await fetch(`${API}/${id}`)).json();
  document.getElementById('id').value = s.id;
  fields.forEach(f => document.getElementById(f).value = s[f] ?? '');
  saveBtn.textContent = 'Update Showtime';
  cancelBtn.style.display = 'inline-block';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// DELETE
async function removeShowtime(id) {
  if (!confirm('Delete this showtime?')) return;
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  loadShowtimes();
}

function resetForm() {
  form.reset();
  document.getElementById('id').value = '';
  saveBtn.textContent = 'Add Showtime';
  cancelBtn.style.display = 'none';
}
cancelBtn.addEventListener('click', resetForm);

loadShowtimes();
