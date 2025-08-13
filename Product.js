// ===== Product Page Script =====
(() => {
  // Sample products - replace with your actual data or fetch from JSON API
  const products = [
    {
      id: 'p-2d-01',
      title: 'Modern 2D House Plan - 90 sqm',
      price: 35,
      type: '2d',
      tags: ['residential','interior'],
      thumb: 'images/product-plan-1.jpg',
      images: ['images/product-plan-1.jpg'],
      desc: 'Compact, efficient 2D AutoCAD plan with layers, dimensions, and door/window schedule.',
      meta: { format: 'DWG, PDF', pages: 1 }
    },
    {
      id: 'p-3d-01',
      title: 'Contemporary 3D Model (FBX/OBJ)',
      price: 120,
      type: '3d',
      tags: ['exterior','residential'],
      thumb: 'images/product-3d-1.jpg',
      images: ['images/product-3d-1.jpg'],
      desc: 'Optimized 3D model for visualization: clean topology, PBR-ready materials, LODs included.',
      meta: { verts: '12k', engine: 'Cinema/Blender' }
    },
    {
      id: 'p-bundle-01',
      title: 'Starter Bundle - 2D+3D',
      price: 140,
      type: 'bundle',
      tags: ['residential'],
      thumb: 'images/product-bundle.jpg',
      images: ['images/product-bundle.jpg'],
      desc: 'Bundle includes detailed 2D DWG files + optimized 3D models for fast project starts.',
      meta: { formats: 'DWG, OBJ, FBX' }
    }
  ];

  const grid = document.getElementById('products');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const tagCheckboxes = document.querySelectorAll('.tag-filters input[type="checkbox"]');

  // modal elements
  const modal = document.getElementById('productModal');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');
  const modalTags = document.getElementById('modalTags');
  const modalMeta = document.getElementById('modalMeta');
  const buyNow = document.getElementById('buyNow');
  const modalClose = document.querySelector('.modal-close');

  // render product card
  function renderCard(p) {
    const el = document.createElement('article');
    el.className = 'product-card reveal';
    el.dataset.type = p.type;
    el.dataset.tags = p.tags.join(',');
    el.innerHTML = `
      <a class="product-thumb" href="#" data-id="${p.id}">
        <img loading="lazy" src="${p.thumb}" alt="${p.title}">
      </a>
      <div class="product-meta">
        <div>
          <h3 class="product-title">${p.title}</h3>
          <p class="product-desc">${p.desc.substring(0,70)}...</p>
        </div>
        <div style="text-align:right">
          <div class="price">$${p.price}</div>
          <div class="badge">${p.type.toUpperCase()}</div>
        </div>
      </div>
      <div style="display:flex; gap:.5rem; margin-top:.6rem;">
        <button class="btn quick-view" data-id="${p.id}"><i class="fa fa-eye"></i> Quick view</button>
        <button class="btn add-cart" data-id="${p.id}"><i class="fa fa-shopping-cart"></i> Add</button>
      </div>
    `;
    return el;
  }

  // initial render
  function renderGrid(list) {
    grid.innerHTML = '';
    if (!list.length) {
      grid.innerHTML = '<p class="muted">No products found.</p>';
      return;
    }
    const frag = document.createDocumentFragment();
    list.forEach(p => frag.appendChild(renderCard(p)));
    grid.appendChild(frag);
    hookupCardButtons();
    revealOnScroll(); // activate reveal animations for new cards
  }

  // attach card button listeners
  function hookupCardButtons(){
    document.querySelectorAll('.quick-view').forEach(btn=>{
      btn.onclick = (e)=>{ e.preventDefault(); openModal(btn.dataset.id); };
    });
    document.querySelectorAll('.product-thumb').forEach(a=>{
      a.onclick = (e)=>{ e.preventDefault(); openModal(a.querySelector('img').alt ? a.dataset.id : a.dataset.id); };
    });
    document.querySelectorAll('.add-cart').forEach(btn=>{
      btn.onclick = (e)=>{ e.preventDefault(); addToCart(btn.dataset.id); };
    });
  }

  // open modal
  function openModal(id){
    const p = products.find(x=>x.id===id);
    if(!p) return;
    modalImage.src = p.images[0] || p.thumb;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.desc;
    modalPrice.textContent = `$${p.price}`;
    modalTags.textContent = p.tags.map(t=>t).join(' • ');
    modalMeta.innerHTML = Object.entries(p.meta||{}).map(([k,v])=>`<li>${k}: ${v}</li>`).join('');
    modal.setAttribute('aria-hidden','false');
  }

  // close modal
  modalClose.addEventListener('click', ()=> modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e)=> { if(e.target===modal) modal.setAttribute('aria-hidden','true'); });

  // add to cart stub
  function addToCart(id){
    const p = products.find(x=>x.id===id);
    alert(`Added to cart: ${p.title} — $${p.price}\n(Replace this alert with real cart logic.)`);
  }

  // filtering/search/sort logic
  function getActiveFilters(){
    const activeBtn = document.querySelector('.filter-btn.active');
    const type = activeBtn ? activeBtn.dataset.filter : 'all';
    const tags = Array.from(tagCheckboxes).filter(cb=>cb.checked).map(cb=>cb.dataset.tag);
    const q = (searchInput.value || '').trim().toLowerCase();
    const sort = sortSelect.value;
    return { type, tags, q, sort };
  }

  function applyFilters(){
    const { type, tags, q, sort } = getActiveFilters();
    let list = products.slice();
    if(type !== 'all') list = list.filter(p=> p.type === type);
    if(tags.length) {
      list = list.filter(p=> tags.every(t => p.tags.includes(t)));
    }
    if(q) {
      list = list.filter(p => (p.title + ' ' + p.desc + ' ' + p.tags.join(' ')).toLowerCase().includes(q));
    }
    // sort
    if(sort === 'price-asc') list.sort((a,b)=> a.price - b.price);
    if(sort === 'price-desc') list.sort((a,b)=> b.price - a.price);
    if(sort === 'newest') list.sort((a,b)=> b.id.localeCompare(a.id)); // placeholder
    renderGrid(list);
  }

  // hook up filter button clicks
  filterButtons.forEach(b=>{
    b.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      applyFilters();
    });
  });

  // search, sort, tag listeners
  searchInput.addEventListener('input', debounce(applyFilters, 220));
  sortSelect.addEventListener('change', applyFilters);
  tagCheckboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  // simple debounce
  function debounce(fn, wait=200){
    let t;
    return (...args)=>{ clearTimeout(t); t = setTimeout(()=>fn(...args), wait); };
  }

  // reveal on scroll (reuse your intersection logic or provide a minimal one)
  function revealOnScroll(){
    const items = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if(en.isIntersecting){ en.target.classList.add('in-view'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08 });
    items.forEach(i => io.observe(i));
  }

  // initial boot
  renderGrid(products);
  // run reveal for hero / other elements if they have .reveal
  revealOnScroll();
})();
