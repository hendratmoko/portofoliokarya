```javascript
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

