/*==========================
CONFIGURATION
==========================*/
const CONFIG={

/*==========================
GOOGLE APPS SCRIPT
==========================*/
WEBAPP_URL:"https://script.google.com/macros/s/AKfycbzCTvALIe3wBfVGKRe631aJnz15yP2YrE5cFaVlFT1RddYjXODt6tvuoXz1TFE64jsb/exec",

/*==========================
GOOGLE SHEET
==========================*/
SHEET_NAME:"GaleriKarya",

/*==========================
LOGIN ADMIN
==========================*/
ACCESS_CODE:"SMKN1SANDEN2026",

/*==========================
GALERI
==========================*/
ITEM_PER_LOAD:9,
DEFAULT_SORT:"terbaru",
DEFAULT_RATING:5,
DEFAULT_VIEW:0,

/*==========================
SEKOLAH
==========================*/
SCHOOL_NAME:"SMK Negeri 1 Sanden",
SCHOOL_SHORT:"SMKN1 Sanden",
APP_NAME:"Galeri Karya Digital",
APP_VERSION:"1.0.0",

/*==========================
SERTIFIKAT
==========================*/
ENABLE_CERTIFICATE:true,
CERTIFICATE_TEMPLATE:"default",

/*==========================
WHATSAPP
==========================*/
ENABLE_WHATSAPP:true,
COUNTRY_CODE:"62",

/*==========================
ADMIN
==========================*/
SESSION_NAME:"adminLogin",
SESSION_TIMEOUT:86400000,

/*==========================
MEDIA
==========================*/
ALLOW_IMAGE:true,
ALLOW_VIDEO:true,
ALLOW_AUDIO:true,
ALLOW_PDF:true,
ALLOW_WORD:true,
ALLOW_PPT:true,
ALLOW_EXCEL:true,
ALLOW_DRIVE:true,
ALLOW_YOUTUBE:true,

/*==========================
THUMBNAIL
==========================*/
DEFAULT_IMAGE:"assets/file.png",
PDF_IMAGE:"assets/pdf.png",
WORD_IMAGE:"assets/word.png",
PPT_IMAGE:"assets/ppt.png",
EXCEL_IMAGE:"assets/excel.png",
VIDEO_IMAGE:"assets/video.png",
AUDIO_IMAGE:"assets/audio.png",
DRIVE_IMAGE:"assets/drive.png",

/*==========================
ANIMATION
==========================*/
LOADER_DELAY:800,
SEARCH_DELAY:300,
TOAST_DELAY:2500,

/*==========================
THEME
==========================*/
DEFAULT_THEME:"light",

/*==========================
DEBUG
==========================*/
DEBUG:true

};

/*==========================
FREEZE CONFIG
==========================*/
Object.freeze(CONFIG);

/*==========================
HELPER
==========================*/
function getConfig(key){

return CONFIG[key];

}

function isDebug(){

return CONFIG.DEBUG===true;

}

function appVersion(){

return CONFIG.APP_VERSION;

}

function appName(){

return CONFIG.APP_NAME;

}

function schoolName(){

return CONFIG.SCHOOL_NAME;

}

/*==========================
CONSOLE
==========================*/
if(CONFIG.DEBUG){

console.log("================================");

console.log(CONFIG.APP_NAME);

console.log("Version :",CONFIG.APP_VERSION);

console.log("School :",CONFIG.SCHOOL_NAME);

console.log("Debug :",CONFIG.DEBUG);

console.log("================================");

}
