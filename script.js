/* ==========================================================
   GALERI KARYA SMKN 1 SANDEN
   script.js - loader & DOM ready fixes
========================================================== */

"use strict";

const App = {
    theme: "light",
    gallery: [],
    filteredGallery: [],
    currentFilter: "all",
    itemsPerPage: 9,
    currentPage: 1,
    initialized: false
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function bootApp(){
    initializeApp();
    loadGallery();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}

function initializeApp(){
    if(App.initialized) return;
    App.initialized = true;

    initTheme();
    initNavbar();
    initLoader();
    initBackToTop();
    initRefreshButton();
    initTooltips();
    initFadeAnimation();

    console.log("✅ Galeri Karya SMKN 1 Sanden Ready.");
}

function initLoader(){
    const loader = $("#loader");
    if(!loader) return;

    // If the page already finished loading, hide immediately
    if (document.readyState === 'complete') {
        hideTopLoader(loader);
        return;
    }

    window.addEventListener("load", ()=>{
        setTimeout(()=>{ hideTopLoader(loader); },700);
    });

    // safety fallback: if after X seconds page still showing loader, hide it and show message
    setTimeout(()=> {
        if (loader && loader.style.visibility !== 'hidden') {
            console.warn('Top loader fallback hide after timeout');
            hideTopLoader(loader);
        }
    }, 8000);
}

function hideTopLoader(loader){
    try{
        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        setTimeout(()=>{ if(loader.parentNode) loader.parentNode.removeChild(loader); },500);
    }catch(e){
        // ignore
    }
}

function initTheme(){
    const btn = $("#themeToggle");
    const savedTheme = localStorage.getItem("theme");

    if(savedTheme){ App.theme = savedTheme; }
    applyTheme();

    if(!btn) return;
    btn.addEventListener("click",()=>{
        App.theme = App.theme==="light" ? "dark" : "light";
        applyTheme();
    });
}

function applyTheme(){
    document.documentElement.setAttribute("data-theme", App.theme);
    localStorage.setItem("theme", App.theme);

    const icon=$("#themeToggle i");
    if(icon){
        if(App.theme==="dark"){ icon.className="bi bi-sun-fill"; }
        else { icon.className="bi bi-moon-stars-fill"; }
    }
}

function initNavbar(){
    const navbar=$(".navbar");
    if(!navbar) return;
    window.addEventListener("scroll",()=>{ navbar.classList.toggle("scrolled", window.scrollY>40); });
}

function initBackToTop(){
    const btn=$("#backToTop");
    if(!btn) return;
    window.addEventListener("scroll",()=>{ btn.classList.toggle("show", window.scrollY>350); });
    btn.addEventListener("click",()=>{ window.scrollTo({ top:0, behavior:"smooth" }); });
}

function initRefreshButton(){
    const btn=$("#refreshGallery");
    if(!btn) return;
    btn.addEventListener("click",()=>{
        btn.style.transform="rotate(360deg)";
        setTimeout(()=>{ btn.style.transform=""; },500);
        location.reload();
    });
}

function initTooltips(){
    if(typeof bootstrap==="undefined") return;
    const tooltipTriggerList=[].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el=> new bootstrap.Tooltip(el));
}

function initFadeAnimation(){
    const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add("fade-up"); });
    }, { threshold:.15 });
    $$("section").forEach(section=> observer.observe(section));
}

document.addEventListener("keydown",(e)=>{
    if(e.key==="Escape"){
        const modal=document.querySelector(".modal.show");
        if(modal){ bootstrap.Modal.getInstance(modal).hide(); }
    }
    if(e.ctrlKey && e.key.toLowerCase()==="d"){
        e.preventDefault();
        const btn=$("#themeToggle");
        if(btn) btn.click();
    }
});

document.addEventListener("click",(e)=>{
    const btn=e.target.closest(".btn");
    if(!btn) return;
    const ripple=document.createElement("span"); ripple.className="ripple";
    const rect=btn.getBoundingClientRect();
    ripple.style.left=(e.clientX-rect.left)+"px";
    ripple.style.top=(e.clientY-rect.top)+"px";
    btn.appendChild(ripple);
    setTimeout(()=>{ ripple.remove(); },600);
});

async function loadGallery() {
    try {
        showLoading(true);

        const response = await fetch("data.json", {cache: "no-store"});

        if (!response.ok) throw new Error("Gagal membaca data.json (status " + response.status + ")");

        const data = await response.json();

        App.gallery = Array.isArray(data) ? data.filter(item => item.publish === true) : [];
        App.filteredGallery = [...App.gallery];

        populateFilters();
        renderGallery(App.filteredGallery.slice(0, App.itemsPerPage));
        updateStatistics();
        initSearch();
        initFilterEvents();

        showLoading(false);

    } catch (err) {
        console.error("❌", err);
        showLoading(false);

        const container = $("#galleryContainer");
        if(container){
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <h3>❌ Gagal memuat data galeri</h3>
                    <p>${err.message}</p>
                </div>
            `;
        }
    }
}

function showLoading(show){
    const loading = $("#loadingGallery");
    if(loading) loading.classList.toggle("d-none", !show);

    const topLoader = $("#loader");
    if(!topLoader) return;

    if(show){
        topLoader.style.opacity = "1";
        topLoader.style.visibility = "visible";
    } else {
        topLoader.style.opacity = "0";
        topLoader.style.visibility = "hidden";
        setTimeout(()=>{ if(topLoader.parentNode) topLoader.parentNode.removeChild(topLoader); },500);
    }
}

function renderGallery(data){
    const container=$("#galleryContainer");
    if(!container) return;
    container.innerHTML="";
    if(data.length===0){ $("#emptyState")?.classList.remove("d-none"); return; }
    $("#emptyState")?.classList.add("d-none");
    const html = data.map(item => createGalleryCard(item)).join("");
    container.innerHTML = html;
    attachCardEventListeners();
}

function createGalleryCard(item){
    const stars = createStars(item.rating || 4.0);
    const rating = (item.rating || 4.0).toFixed(1);
    return `
    <div class="col-lg-4 col-md-6 fade-up">
        <article class="gallery-card">
            <div class="card-badge ${item.status ? item.status.toLowerCase() : ''}">
                <i class="bi bi-${item.status === 'Guru' ? 'award' : 'stars'}"></i>
                ${item.status || ''}
            </div>
            <button class="favorite-btn" data-id="${item.id}"><i class="bi bi-heart"></i></button>
            <div class="media-preview">${createPreview(item)}<div class="play-overlay"><i class="bi bi-play-circle-fill"></i></div></div>
            <div class="card-content">
                <div class="media-type"><span class="badge bg-primary">${item.jenis ? item.jenis.toUpperCase() : ''}</span></div>
                <h4 class="card-title">${item.judul}</h4>
                <p class="card-description">${item.deskripsi}</p>
                <div class="creator">
                    <img class="creator-photo" src="https://ui-avatars.com/api/?name=${encodeURIComponent(item.pembuat || 'User')}&background=2563eb&color=ffffff">
                    <div><strong>${item.pembuat || ''}</strong><small>${item.status || ''} ${item.kelas ?? ""}</small></div>
                </div>
                <div class="meta"><span><i class="bi bi-calendar3"></i> ${item.tahun || ''}</span><span><i class="bi bi-book"></i> ${item.mapel || ''}</span></div>
                <div class="rating-area"><div class="stars">${stars}</div><strong>${rating}</strong></div>
                <div class="card-footer-action"><button class="btn btn-primary w-100 previewBtn" data-id="${item.id}"><i class="bi bi-eye"></i> Lihat Karya</button></div>
            </div>
        </article>
    </div>
    `;
}

function createStars(rating){
    let stars = "";
    for(let i = 1; i <= 5; i++){
        if(i <= rating){ stars += `<i class="bi bi-star-fill"></i>`; }
        else if(i - rating < 1){ stars += `<i class="bi bi-star-half"></i>`; }
        else { stars += `<i class="bi bi-star"></i>`; }
    }
    return stars;
}

function createPreview(item){
    const jenis = (item.jenis || '').toLowerCase();
    switch(jenis){
        case "youtube": return `<img src="${youtubeThumbnail(item.link)}" alt="${item.judul}">`;
        case "pdf": return `<div class="file-preview"><i class="bi bi-file-earmark-pdf-fill file-icon pdf"></i></div>`;
        case "word": return `<div class="file-preview"><i class="bi bi-file-earmark-word-fill file-icon word"></i></div>`;
        case "excel": return `<div class="file-preview"><i class="bi bi-file-earmark-excel-fill file-icon excel"></i></div>`;
        case "ppt": case "pptx": return `<div class="file-preview"><i class="bi bi-file-earmark-ppt-fill file-icon ppt"></i></div>`;
        case "audio": case "mp3": return `<div class="file-preview"><i class="bi bi-file-earmark-music-fill file-icon audio"></i></div>`;
        case "gambar": case "image": case "jpg": case "png": return `<img src="${item.link}" alt="${item.judul}">`;
        case "video": case "mp4": return `<video muted><source src="${item.link}"></video>`;
        default: return `<div class="file-preview"><i class="bi bi-file-earmark-fill file-icon"></i></div>`;
    }
}

function youtubeThumbnail(url){
    let id="";
    try{
        if(!url) return '';
        if(url.includes("youtu.be/")){ id=url.split("youtu.be/")[1].split("?")[0]; }
        else if(url.includes("watch?v=")){ id=url.split("watch?v=")[1].split("&")[0]; }
    }catch(e){ id=''; }
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function attachCardEventListeners(){
    $$(".previewBtn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.closest(".previewBtn").dataset.id);
            const item = App.gallery.find(i => i.id === id);
            if(item) showPreview(item);
        });
    });

    $$(".favorite-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(e.target.closest(".favorite-btn").dataset.id);
            toggleFavorite(id);
            e.target.closest(".favorite-btn").classList.toggle("active");
        });
    });
}

function showPreview(item){
    const modal = new bootstrap.Modal($("#previewModal"));
    $("#previewTitle").textContent = item.judul;
    $("#previewAuthor").textContent = `${item.pembuat} • ${item.status}`;
    $("#previewDescription").textContent = item.deskripsi;
    const container = $("#previewContainer");
    container.innerHTML = "";
    const jenis = (item.jenis || '').toLowerCase();
    if(jenis === "youtube"){
        const videoId = item.link.includes("youtu.be/") ? item.link.split("youtu.be/")[1].split("?")[0] : (item.link.includes("watch?v=") ? item.link.split("watch?v=")[1].split("&")[0] : '');
        container.innerHTML = `<iframe width="100%" height="600" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    } else if(jenis === "pdf"){
        container.innerHTML = `<embed src="${item.link}" type="application/pdf" width="100%" height="600">`;
    } else if(["gambar","image","jpg","png"].includes(jenis)){
        container.innerHTML = `<img src="${item.link}" style="max-width:100%; height:auto;">`;
    } else if(["audio","mp3"].includes(jenis)){
        container.innerHTML = `<audio controls style="width:100%;"><source src="${item.link}"></audio>`;
    } else {
        container.innerHTML = `<p>Preview tidak tersedia untuk tipe file ini</p>`;
    }
    modal.show();
}

function toggleFavorite(id){
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if(favorites.includes(id)){ favorites = favorites.filter(fav => fav !== id); } else { favorites.push(id); }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

function populateFilters(){
    const years = [...new Set(App.gallery.map(item => item.tahun))].sort((a,b)=>b-a);
    const tahunSelect = $("#tahunFilter");
    if(tahunSelect){ years.forEach(year => { const option=document.createElement("option"); option.value=year; option.textContent=year; tahunSelect.appendChild(option); }); }
    const subjects = [...new Set(App.gallery.map(item => item.mapel))].sort();
    const mapelSelect = $("#mapelFilter";
    if(mapelSelect){ subjects.forEach(subject => { const option=document.createElement("option"); option.value=subject; option.textContent=subject; mapelSelect.appendChild(option); }); }
}

function initSearch(){ const searchInput=$("#searchInput"); if(!searchInput) return; searchInput.addEventListener("input", applyFilters); }

function initFilterEvents(){
    const filterChips = $$(".filter-chip"); const tahunFilter = $("#tahunFilter"); const mapelFilter = $("#mapelFilter"); const mediaFilter = $("#mediaFilter"); const sortFilter = $("#sortFilter"); const resetBtn = $("#resetFilter"); const loadMoreBtn = $("#loadMore");
    filterChips.forEach(chip=>chip.addEventListener("click",(e)=>{ filterChips.forEach(c=>c.classList.remove("active")); e.target.classList.add("active"); App.currentFilter = e.target.dataset.filter; App.currentPage=1; applyFilters(); }));
    tahunFilter?.addEventListener("change", applyFilters); mapelFilter?.addEventListener("change", applyFilters); mediaFilter?.addEventListener("change", applyFilters); sortFilter?.addEventListener("change", applyFilters);
    resetBtn?.addEventListener("click", ()=>{ $("#searchInput").value=""; filterChips.forEach(chip=>chip.classList.toggle("active", chip.dataset.filter==="all")); tahunFilter.value=""; mapelFilter.value=""; mediaFilter.value=""; sortFilter.value="terbaru"; App.currentFilter="all"; App.currentPage=1; applyFilters();});
    loadMoreBtn?.addEventListener("click", ()=>{ App.currentPage++; const start=(App.currentPage-1)*App.itemsPerPage; const newItems=App.filteredGallery.slice(start, start+App.itemsPerPage); if(newItems.length>0){ const container=$("#galleryContainer"); container.innerHTML += newItems.map(item=>createGalleryCard(item)).join(""); attachCardEventListeners(); } else { loadMoreBtn.disabled=true; loadMoreBtn.textContent="Tidak ada karya lagi"; }});
}

function applyFilters(){
    let filtered=[...App.gallery];
    const searchTerm = $("#searchInput")?.value.toLowerCase() || "";
    if(searchTerm){ filtered = filtered.filter(item => (item.judul||"").toLowerCase().includes(searchTerm) || (item.pembuat||"").toLowerCase().includes(searchTerm) || (item.mapel||"").toLowerCase().includes(searchTerm)); }
    if(App.currentFilter !== "all"){ if(["Siswa","Guru"].includes(App.currentFilter)) filtered = filtered.filter(item => item.status === App.currentFilter); else filtered = filtered.filter(item => (item.jenis||"").toLowerCase() === App.currentFilter.toLowerCase()); }
    const tahun = $("#tahunFilter")?.value; if(tahun) filtered = filtered.filter(item => item.tahun == tahun);
    const mapel = $("#mapelFilter")?.value; if(mapel) filtered = filtered.filter(item => item.mapel === mapel);
    const media = $("#mediaFilter")?.value; if(media) filtered = filtered.filter(item => (item.jenis||"").toLowerCase() === media.toLowerCase());
    const sort = $("#sortFilter")?.value || "terbaru"; switch(sort){ case "terbaru": filtered.sort((a,b)=>(b.tahun||0)-(a.tahun||0)); break; case "rating": filtered.sort((a,b)=>(b.rating||0)-(a.rating||0)); break; case "nama": filtered.sort((a,b)=>(a.judul||"").localeCompare(b.judul||"")); break; }
    App.filteredGallery = filtered; App.currentPage=1; renderGallery(filtered.slice(0, App.itemsPerPage));
    const loadMoreBtn = $("#loadMore"); if(loadMoreBtn){ loadMoreBtn.disabled = filtered.length <= App.itemsPerPage; loadMoreBtn.textContent = filtered.length <= App.itemsPerPage ? "Tidak ada karya lagi" : "Muat Karya Lainnya"; }
}

function updateStatistics(){ $("#jumlahKarya").textContent = App.gallery.length; const videos = App.gallery.filter(item => (item.jenis||"").toLowerCase() === "youtube").length; $("#jumlahVideo").textContent = videos; const dokumen = App.gallery.filter(item => ["pdf","word","ppt","pptx"].includes((item.jenis||"").toLowerCase())).length; $("#jumlahDokumen").textContent = dokumen; const creators = [...new Set(App.gallery.map(item=>item.pembuat))].length; $("#jumlahPengguna").textContent = creators; }

console.log("✅ script.js Loaded Successfully");
