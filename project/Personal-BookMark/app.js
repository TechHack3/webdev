// Personal Bookmark Dashboard — vanilla JS (module)
const STORAGE_KEY = 'bookmark-dashboard:v1';

const sample = [
  {id: id(), title: 'MDN JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', category: 'Dev'},
  {id: id(), title: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Dev'},
  {id: id(), title: 'YouTube', url: 'https://youtube.com', category: 'Media'},
  {id: id(), title: 'Hacker News', url: 'https://news.ycombinator.com', category: 'News'}
];

const dom = {
  grid: document.getElementById('grid'),
  addBtn: document.getElementById('addBtn'),
  modal: document.getElementById('modal'),
  form: document.getElementById('bookmarkForm'),
  title: document.getElementById('title'),
  url: document.getElementById('url'),
  category: document.getElementById('category'),
  cancelBtn: document.getElementById('cancelBtn'),
  search: document.getElementById('search'),
  categoryFilter: document.getElementById('categoryFilter'),
  exportBtn: document.getElementById('exportBtn'),
  importBtn: document.getElementById('importBtn'),
  importFile: document.getElementById('importFile'),
  cardTemplate: document.getElementById('cardTemplate')
};

let bookmarks = load() || sample.slice();
let editingId = null;
let draggedEl = null;

// Utilities
function id(){ return Math.random().toString(36).slice(2,9); }
function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks)); }
function load(){
  try{ const raw = localStorage.getItem(STORAGE_KEY); return raw ? JSON.parse(raw) : null; }
  catch(e){ console.error('Could not parse bookmarks from storage', e); return null; }
}
function sanitizeUrl(u){
  try{
    const url = new URL(u);
    return url.href;
  }catch(e){
    return null;
  }
}

// Rendering
function render(){
  dom.grid.innerHTML = '';
  const q = dom.search.value.trim().toLowerCase();
  const cat = dom.categoryFilter.value;
  const data = bookmarks.filter(b=>{
    if(cat && b.category !== cat) return false;
    if(!q) return true;
    return (b.title && b.title.toLowerCase().includes(q)) || (b.url && b.url.toLowerCase().includes(q));
  });

  data.forEach(b => {
    const tpl = dom.cardTemplate.content.cloneNode(true);
    const card = tpl.querySelector('.card');
    card.dataset.id = b.id;
    tpl.querySelector('.title').textContent = b.title;
    tpl.querySelector('.url').textContent = b.url.replace(/^https?:\/\//,'');
    // Open on click (except when clicking action buttons)
    card.addEventListener('click', (ev)=>{
      if(ev.target.closest('.card-actions')) return;
      window.open(b.url, '_blank', 'noopener');
    });

    // actions
    tpl.querySelector('.edit').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      openModal(b);
    });
    tpl.querySelector('.delete').addEventListener('click', (ev)=>{
      ev.stopPropagation();
      if(confirm(`Delete "${b.title}"?`)){ bookmarks = bookmarks.filter(x => x.id !== b.id); save(); render(); populateCategories(); }
    });

    // drag & drop
    card.addEventListener('dragstart', (e)=>{ draggedEl = card; card.classList.add('dragging'); e.dataTransfer.effectAllowed='move'; });
    card.addEventListener('dragend', ()=>{ draggedEl = null; card.classList.remove('dragging'); });

    card.addEventListener('dragover', (e)=>{ e.preventDefault(); });
    card.addEventListener('drop', (e)=>{
      e.preventDefault();
      const toId = card.dataset.id;
      if(!draggedEl || draggedEl === card) return;
      const fromId = draggedEl.dataset.id;
      reorder(fromId, toId);
    });

    // keyboard support: Enter opens, Ctrl+E edit, Delete key delete
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter') window.open(b.url, '_blank', 'noopener');
      if(e.key.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey)) openModal(b);
      if(e.key === 'Delete') {
        if(confirm(`Delete "${b.title}"?`)){ bookmarks = bookmarks.filter(x => x.id !== b.id); save(); render(); populateCategories(); }
      }
    });

    dom.grid.appendChild(tpl);
  });
}

// Reorder function: move 'from' item before 'to' item
function reorder(fromId, toId){
  const fromIndex = bookmarks.findIndex(x => x.id === fromId);
  const toIndex = bookmarks.findIndex(x => x.id === toId);
  if(fromIndex < 0 || toIndex < 0) return;
  const [item] = bookmarks.splice(fromIndex, 1);
  bookmarks.splice(toIndex, 0, item);
  save();
  render();
}

// Modal controls
function openModal(bookmark){
  editingId = bookmark?.id || null;
  dom.modal.classList.remove('hidden');
  dom.title.value = bookmark?.title || '';
  dom.url.value = bookmark?.url || '';
  dom.category.value = bookmark?.category || '';
  dom.title.focus();
}
function closeModal(){
  dom.modal.classList.add('hidden');
  editingId = null;
  dom.form.reset();
}

// Form submit
dom.form.addEventListener('submit', (e)=>{
  e.preventDefault();
  const rawUrl = dom.url.value.trim();
  const valid = sanitizeUrl(rawUrl) || (rawUrl.startsWith('www.') ? sanitizeUrl('https://' + rawUrl) : null);
  if(!valid){ alert('Please enter a valid URL (include https://)'); return; }

  const newItem = {
    id: editingId || id(),
    title: dom.title.value.trim() || valid,
    url: valid,
    category: dom.category.value.trim() || 'General'
  };

  if(editingId){
    bookmarks = bookmarks.map(b => b.id === editingId ? newItem : b);
  } else {
    bookmarks.unshift(newItem);
  }
  save();
  populateCategories();
  render();
  closeModal();
});

// Buttons
dom.addBtn.addEventListener('click', ()=> openModal());
dom.cancelBtn.addEventListener('click', (e)=>{ e.preventDefault(); closeModal(); });

// Outside click to close modal
dom.modal.addEventListener('click', (e)=>{ if(e.target === dom.modal) closeModal(); });

// Search & filter
dom.search.addEventListener('input', ()=> render());
dom.categoryFilter.addEventListener('change', ()=> render());

// Populate categories dropdown
function populateCategories(){
  const cats = Array.from(new Set(bookmarks.map(b => b.category || 'General'))).sort();
  dom.categoryFilter.innerHTML = '<option value="">All categories</option>';
  cats.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.textContent = c; dom.categoryFilter.appendChild(opt);
  });
}

// Export / Import
dom.exportBtn.addEventListener('click', ()=>{
  const blob = new Blob([JSON.stringify(bookmarks, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'bookmarks.json'; document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

dom.importBtn.addEventListener('click', ()=> dom.importFile.click());
dom.importFile.addEventListener('change', async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const data = JSON.parse(text);
    if(!Array.isArray(data)) throw new Error('Invalid file format');
    // basic validation
    const cleaned = data.filter(d => d.title && d.url).map(d => ({ id: d.id || id(), title: d.title, url: d.url, category: d.category || 'General' }));
    bookmarks = cleaned;
    save(); populateCategories(); render();
    alert('Imported successfully');
  }catch(err){
    alert('Could not import: ' + err.message);
  } finally {
    dom.importFile.value = '';
  }
});

// Init
populateCategories();
render();
