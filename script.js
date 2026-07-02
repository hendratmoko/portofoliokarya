/* ==========================================================
   GALERI KARYA SMKN 1 SANDEN
   script.js
   Bagian 1
========================================================== */

"use strict";

/* ==========================================================
   GLOBAL APP
========================================================== */

const App = {

    theme: "light",

    gallery: [],

    filteredGallery: [],

    comments: {},

    ratings: {},

    initialized: false

};


/* ==========================================================
   SHORTCUT ELEMENT
========================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);


/* ==========================================================
   DOM READY
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});


/* ==========================================================
   INITIALIZE
========================================================== */

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

    console.log("Galeri Karya SMKN 1 Sanden Ready.");

}


/* ==========================================================
   LOADER
========================================================== */

function initLoader(){

    const loader = $("#loader");

    if(!loader) return;

    window.addEventListener("load",()=>{

        setTimeout(()=>{

            loader.style.opacity="0";

            loader.style.visibility="hidden";

        },700);

    });

}


/* ==========================================================
   THEME
========================================================== */

function initTheme(){

    const btn = $("#themeToggle");

    const savedTheme = localStorage.getItem("theme");

    if(savedTheme){

        App.theme = savedTheme;

    }

    applyTheme();

    if(!btn) return;

    btn.addEventListener("click",()=>{

        App.theme =

            App.theme==="light"

            ? "dark"

            : "light";

        applyTheme();

    });

}


function applyTheme(){

    document.documentElement.setAttribute(

        "data-theme",

        App.theme

    );

    localStorage.setItem(

        "theme",

        App.theme

    );

    const icon=$("#themeToggle i");

    if(icon){

        if(App.theme==="dark"){

            icon.className="bi bi-sun-fill";

        }

        else{

            icon.className="bi bi-moon-stars-fill";

        }

    }

}


/* ==========================================================
   NAVBAR SCROLL
========================================================== */

function initNavbar(){

    const navbar=$(".navbar");

    if(!navbar) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY>40){

            navbar.classList.add("scrolled");

        }

        else{

            navbar.classList.remove("scrolled");

        }

    });

}


/* ==========================================================
   BACK TO TOP
========================================================== */

function initBackToTop(){

    const btn=$("#backToTop");

    if(!btn) return;

    window.addEventListener("scroll",()=>{

        if(window.scrollY>350){

            btn.classList.add("show");

        }

        else{

            btn.classList.remove("show");

        }

    });

    btn.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}


/* ==========================================================
   REFRESH
========================================================== */

function initRefreshButton(){

    const btn=$("#refreshGallery");

    if(!btn) return;

    btn.addEventListener("click",()=>{

        btn.style.transform="rotate(360deg)";

        setTimeout(()=>{

            btn.style.transform="";

        },500);

        location.reload();

    });

}


/* ==========================================================
   TOOLTIP
========================================================== */

function initTooltips(){

    if(typeof bootstrap==="undefined") return;

    const tooltipTriggerList=[].slice.call(

        document.querySelectorAll(

            '[data-bs-toggle="tooltip"]'

        )

    );

    tooltipTriggerList.map(el=>{

        return new bootstrap.Tooltip(el);

    });

}


/* ==========================================================
   FADE ANIMATION
========================================================== */

function initFadeAnimation(){

    const observer=new IntersectionObserver(

        entries=>{

            entries.forEach(entry=>{

                if(entry.isIntersecting){

                    entry.target.classList.add("fade-up");

                }

            });

        },

        {

            threshold:.15

        }

    );

    $$("section").forEach(section=>{

        observer.observe(section);

    });

}


/* ==========================================================
   HELP MODAL
========================================================== */

const helpButton=$("#helpButton");

if(helpButton){

    helpButton.addEventListener("click",()=>{

        const modal=new bootstrap.Modal(

            $("#helpModal")

        );

        modal.show();

    });

}


/* ==========================================================
   KEYBOARD SHORTCUT
========================================================== */

document.addEventListener("keydown",(e)=>{

    /* ESC */

    if(e.key==="Escape"){

        const modal=document.querySelector(".modal.show");

        if(modal){

            bootstrap.Modal.getInstance(modal).hide();

        }

    }

    /* CTRL + D */

    if(e.ctrlKey && e.key.toLowerCase()==="d"){

        e.preventDefault();

        const btn=$("#themeToggle");

        if(btn){

            btn.click();

        }

    }

});


/* ==========================================================
   RIPPLE EFFECT
========================================================== */

document.addEventListener("click",(e)=>{

    const btn=e.target.closest(".btn");

    if(!btn) return;

    const ripple=document.createElement("span");

    ripple.className="ripple";

    const rect=btn.getBoundingClientRect();

    ripple.style.left=(e.clientX-rect.left)+"px";

    ripple.style.top=(e.clientY-rect.top)+"px";

    btn.appendChild(ripple);

    setTimeout(()=>{

        ripple.remove();

    },600);

});


/* ==========================================================
   WINDOW RESIZE
========================================================== */

window.addEventListener("resize",()=>{

    console.log(

        "Window :",

        window.innerWidth,

        "x",

        window.innerHeight

    );

});


/* ==========================================================
   END
========================================================== */

console.log("script.js Part 1 Loaded.");

```javascript
/* ==========================================================
   BAGIAN 2
   LOAD DATA.JSON
========================================================== */

async function loadGallery() {

    try {

        showLoading(true);

        const response = await fetch("data.json");

        if (!response.ok)
            throw new Error("Gagal membaca data.json");

        const data = await response.json();

        App.gallery = data.filter(item => item.publish === true);

        App.filteredGallery = [...App.gallery];

        renderGallery(App.filteredGallery);

        updateTotalResult();

        showLoading(false);

    } catch (err) {

        console.error(err);

        showLoading(false);

        $("#galleryContainer").innerHTML = `
            <div class="col-12 text-center py-5">
                <h3>❌ Gagal memuat data galeri</h3>
                <p>${err.message}</p>
            </div>
        `;

    }

}

/* ==========================================================
   LOADING
========================================================== */

function showLoading(show){

    const loading=$("#loadingGallery");

    if(!loading) return;

    loading.classList.toggle("d-none",!show);

}

/* ==========================================================
   RENDER GALERI
========================================================== */

function renderGallery(data){

    const container=$("#galleryContainer");

    if(!container) return;

    container.innerHTML="";

    if(data.length===0){

        $("#emptyState")?.classList.remove("d-none");

        return;

    }

    $("#emptyState")?.classList.add("d-none");

    data.forEach(item=>{

        container.innerHTML += createGalleryCard(item);

    });

}

/* ==========================================================
   CARD TEMPLATE
========================================================== */

function createGalleryCard(item){

    return `

<div class="col-lg-4 col-md-6 fade-up">

<div class="gallery-card">

<div class="card-badge ${item.status.toLowerCase()}">

${item.status}

</div>

<button class="favorite-btn">

<i class="bi bi-heart"></i>

</button>

<div class="media-preview">

${createPreview(item)}

<div class="play-overlay">

<i class="bi bi-play-circle-fill"></i>

</div>

</div>

<div class="card-content">

<div class="media-type">

<span class="badge bg-primary">

${item.jenis.toUpperCase()}

</span>

</div>

<h4 class="card-title">

${item.judul}

</h4>

<p class="card-description">

${item.deskripsi}

</p>

<div class="creator">

<img

class="creator-photo"

src="https://ui-avatars.com/api/?name=${encodeURIComponent(item.pembuat)}&background=2563eb&color=ffffff">

<div>

<strong>

${item.pembuat}

</strong>

<small>

${item.status}

${item.kelas ?? ""}

</small>

</div>

</div>

<div class="meta">

<span>

<i class="bi bi-calendar3"></i>

${item.tahun}

</span>

<span>

<i class="bi bi-book"></i>

${item.mapel}

</span>

</div>

<div class="rating-area">

<div class="stars">

<i class="bi bi-star-fill"></i>

<i class="bi bi-star-fill"></i>

<i class="bi bi-star-fill"></i>

<i class="bi bi-star-fill"></i>

<i class="bi bi-star-half"></i>

</div>

<strong>

4.8

</strong>

</div>

<div class="card-footer-action">

<button

class="btn btn-primary previewBtn"

data-id="${item.id}">

<i class="bi bi-eye"></i>

Lihat Karya

</button>

</div>

</div>

</div>

</div>

`;

}

/* ==========================================================
   PREVIEW
========================================================== */

function createPreview(item){

    switch(item.jenis.toLowerCase()){

        case "youtube":

            return `
            <img
            src="${youtubeThumbnail(item.link)}"
            alt="${item.judul}">
            `;

        case "pdf":

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-pdf-fill file-icon pdf"></i>

            </div>
            `;

        case "word":

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-word-fill file-icon word"></i>

            </div>
            `;

        case "excel":

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-excel-fill file-icon excel"></i>

            </div>
            `;

        case "ppt":

        case "pptx":

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-ppt-fill file-icon ppt"></i>

            </div>
            `;

        case "audio":

        case "mp3":

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-music-fill file-icon audio"></i>

            </div>
            `;

        case "gambar":

        case "image":

        case "jpg":

        case "png":

            return `
            <img
            src="${item.link}">
            `;

        case "video":

        case "mp4":

            return `
            <video muted>

            <source src="${item.link}">

            </video>
            `;

        default:

            return `
            <div class="file-preview">

            <i class="bi bi-file-earmark-fill file-icon"></i>

            </div>
            `;

    }

}

/* ==========================================================
   YOUTUBE THUMBNAIL
========================================================== */

function youtubeThumbnail(url){

    let id="";

    if(url.includes("youtu.be/")){

        id=url.split("youtu.be/")[1].split("?")[0];

    }

    else if(url.includes("watch?v=")){

        id=url.split("watch?v=")[1].split("&")[0];

    }

    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

}

/* ==========================================================
   UPDATE RESULT
========================================================== */

function updateTotalResult(){

    const total=$("#totalResult");

    if(total){

        total.textContent=App.filteredGallery.length;

    }

}

/* ==========================================================
   START
========================================================== */

document.addEventListener("DOMContentLoaded",()=>{

    loadGallery();

});

