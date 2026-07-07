let galleryData=[];
let filteredData=[];
let currentPage=1;
let isLoggedIn=false;
/*==========================
ELEMENT
==========================*/
const loader=document.getElementById("loader");
const body=document.body;
const navbar=document.querySelector(".navbar");
const themeToggle=document.getElementById("themeToggle");
const backToTop=document.getElementById("backToTop");
const refreshGallery=document.getElementById("refreshGallery");
const loadingOverlay=document.getElementById("loadingOverlay");
const toastElement=document.getElementById("liveToast");
const toastMessage=document.getElementById("toastMessage");
const toast=new bootstrap.Toast(toastElement);
const USER = {token: null,
    role: "guest",     // guest | guru | siswa | admin
    name: ""};
/*==========================
LOADER
==========================*/
window.addEventListener("load",()=>{
setTimeout(()=>{
loader.style.opacity="0";
loader.style.visibility="hidden";
},800);
});
/*==========================
LOADING OVERLAY
==========================*/
function showLoading(){
loadingOverlay.classList.remove("d-none");
}
function hideLoading(){
loadingOverlay.classList.add("d-none");
}
/*==========================
TOAST
==========================*/
function showToast(message,type="success"){
toastMessage.innerHTML=message;
const icon=toastElement.querySelector("i");
icon.className="me-2";
switch(type){
case"success":
icon.classList.add("bi","bi-check-circle-fill","text-success");
break;
case"error":
icon.classList.add("bi","bi-x-circle-fill","text-danger");
break;
case"warning":
icon.classList.add("bi","bi-exclamation-triangle-fill","text-warning");
break;
default:
icon.classList.add("bi","bi-info-circle-fill","text-primary");
}
toast.show();
}
/*==========================
DARK MODE
==========================*/
function loadTheme(){
const saved=localStorage.getItem("theme")||"light";
document.documentElement.setAttribute("data-theme",saved);
themeToggle.innerHTML=saved==="dark"
?'<i class="bi bi-sun-fill"></i>'
:'<i class="bi bi-moon-stars"></i>';
}
function toggleTheme(){
const current=document.documentElement.getAttribute("data-theme");
const next=current==="light"?"dark":"light";
document.documentElement.setAttribute("data-theme",next);
localStorage.setItem("theme",next);
themeToggle.innerHTML=next==="dark"
?'<i class="bi bi-sun-fill"></i>'
:'<i class="bi bi-moon-stars"></i>';
showToast("Mode "+next+" aktif");
}
themeToggle.addEventListener("click",toggleTheme);
loadTheme();
/*==========================
NAVBAR SCROLL
==========================*/
window.addEventListener("scroll",()=>{
if(window.scrollY>60){
navbar.classList.add("scrolled");
}else{
navbar.classList.remove("scrolled");
}
});
/*==========================
BACK TO TOP
==========================*/
window.addEventListener("scroll",()=>{
if(window.scrollY>400){
backToTop.classList.add("show");
}else{
backToTop.classList.remove("show");
}
});
backToTop.addEventListener("click",()=>{
window.scrollTo({
top:0,
behavior:"smooth"
});
});
/*==========================
REFRESH
==========================*/
refreshGallery.addEventListener("click",()=>{
showLoading();
setTimeout(()=>{
hideLoading();
showToast("Galeri berhasil diperbarui.");
if(typeof loadGallery==="function"){
loadGallery();
}
},800);
});
/*==========================
SESSION LOGIN
==========================*/
function saveLogin(){
sessionStorage.setItem("adminLogin","true");
}
function clearLogin(){
sessionStorage.removeItem("adminLogin");
}
function checkLogin(){
isLoggedIn=sessionStorage.getItem("adminLogin")==="true";
}
/*==========================
HELPER
==========================*/
function formatNumber(num){
return new Intl.NumberFormat("id-ID").format(num);
}
function getStars(score){
let star="";
for(let i=0;i<5;i++){
star+=i<score?"⭐":"☆";
}
return star;
}
function randomColor(){
const color=[
"#2563eb",
"#9333ea",
"#0ea5e9",
"#16a34a",
"#ea580c",
"#db2777"
];
return color[Math.floor(Math.random()*color.length)];
}
/*==========================
INITIAL
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
checkLogin();
});
/*==========================
LOAD DATA GOOGLE SHEETS
==========================*/
async function loadGallery(){
try{
showLoading();
const response=await fetch(CONFIG.WEBAPP_URL);
console.log(response.status);
if(!response.ok){
throw new Error("HTTP "+response.status);
}
const data=await response.json();
galleryData=Array.isArray(data)?data:[];
filteredData=[...galleryData];
populateFilter();
buildStatistic();
buildGallery();
toggleLoadMore();
hideLoading();
}
catch(error){
console.error(error);
hideLoading();
showToast(error.message,"error");
}}
/*==========================
STATISTIK
==========================*/
function buildStatistic(){
document.getElementById("jumlahKarya").textContent=formatNumber(galleryData.length);
document.getElementById("jumlahVideo").textContent=formatNumber(
galleryData.filter(x=>getMediaType(x.link)=="youtube").length
);
document.getElementById("jumlahDokumen").textContent=formatNumber(
galleryData.filter(x=>["pdf","word","ppt","excel"].includes(getMediaType(x.link))).length
);
document.getElementById("jumlahPengguna").textContent=formatNumber(
new Set(galleryData.map(x=>x.author)).size
);
}
/*==========================
BUILD GALLERY
==========================*/
function buildGallery(){
if(!filteredData.length){filteredData=[...galleryData];}
const container=document.getElementById("galleryContainer");
container.innerHTML="";
const max=currentPage*CONFIG.ITEM_PER_LOAD;
const data=filteredData.slice(0,max);
if(data.length==0){
document.getElementById("emptyState").classList.remove("d-none");
document.getElementById("loadingGallery").style.display="none";
return;
}
document.getElementById("emptyState").classList.add("d-none");
document.getElementById("loadingGallery").style.display="none";
data.forEach((item,index)=>{
container.insertAdjacentHTML("beforeend",createCard(item,index));
});
}
/*==========================
CARD TEMPLATE
==========================*/
function createCard(item,index){
const media=getMediaType(item.link);
const badge=getMediaBadge(media);
const thumb=getThumbnail(item.link,media);
const star=getStars(Number(item.rating||5));
const avatar=item.author?item.author.charAt(0).toUpperCase():"A";
return`
<div class="col-xl-4 col-lg-4 col-md-6 fade-up">
<div class="gallery-card">
<div class="gallery-image">
<img src="${thumb}" loading="lazy">
<span class="media-badge">${badge}</span>
<span class="category-badge">${item.category||"-"}</span>
</div>
<div class="gallery-content">
<h5 class="gallery-title">
${item.title}
</h5>
<p class="gallery-description">
${item.description||""}
</p>
<div class="gallery-meta">
<div class="gallery-author">
<div class="gallery-avatar">
${avatar}
</div>
<div>
<strong>${item.author}</strong>
<span>${item.subject||""}</span>
</div>
</div>
<div class="gallery-rating">
${star}
</div>
</div>
<div class="gallery-footer">
<button class="btn btn-primary"
onclick="openPreview(${index})">
Preview
</button>
<button class="btn btn-warning"
onclick="editData('${item.id}')">
Edit
</button>
<button class="btn btn-danger"
onclick="deleteData('${item.id}')">
Hapus
</button>
</div>
</div>
</div>
</div>
`;
}
/*==========================
FILTER OPTION
==========================*/
function populateFilter(){
const tahun=document.getElementById("tahunFilter");
const mapel=document.getElementById("mapelFilter");
const years=[...new Set(galleryData.map(x=>x.year).filter(Boolean))].sort().reverse();
const subjects=[...new Set(galleryData.map(x=>x.subject).filter(Boolean))].sort();
tahun.innerHTML='<option value="">Semua Tahun</option>';
mapel.innerHTML='<option value="">Semua Mata Pelajaran</option>';
years.forEach(y=>{
tahun.innerHTML+=`<option value="${y}">${y}</option>`;
});
subjects.forEach(m=>{
mapel.innerHTML+=`<option value="${m}">${m}</option>`;
});
}
/*==========================
MEDIA TYPE
==========================*/
function getMediaType(url){
url=(url||"").toLowerCase();
if(url.includes("youtube")||url.includes("youtu.be"))return"youtube";
if(url.includes(".pdf"))return"pdf";
if(url.includes(".ppt")||url.includes(".pptx"))return"ppt";
if(url.includes(".doc")||url.includes(".docx"))return"word";
if(url.includes(".xls")||url.includes(".xlsx"))return"excel";
if(url.includes(".mp3")||url.includes(".wav"))return"audio";
if(url.includes(".mp4")||url.includes(".mov"))return"video";
if(url.match(/\.(jpg|jpeg|png|gif|webp)$/))return"image";
if(url.includes("drive.google"))return"drive";
return"link";
}
/*==========================
BADGE
==========================*/
function getMediaBadge(type){
const badge={
youtube:"🎥Video",
pdf:"📕PDF",
ppt:"📊PPT",
word:"📄Word",
excel:"📈Excel",
audio:"🎵Audio",
video:"🎬Video",
image:"🖼️Gambar",
drive:"☁Drive",
link:"🔗Link"
};
return badge[type]||"📁File";
}
/*==========================
THUMBNAIL
==========================*/
function getThumbnail(url,type){
if(type=="youtube"){
const id=getYoutubeId(url);
return`https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
if(type=="image")return url;
if(type=="pdf")return"assets/pdf.png";
if(type=="ppt")return"assets/ppt.png";
if(type=="word")return"assets/word.png";
if(type=="excel")return"assets/excel.png";
if(type=="audio")return"assets/audio.png";
if(type=="video")return"assets/video.png";
if(type=="drive")return"assets/drive.png";
return"assets/file.png";
}
/*==========================
YOUTUBE ID
==========================*/
function getYoutubeId(url){
const reg=/^(?:.*(?:youtu\.be\/|v\/|embed\/|watch\?v=))([^#&?]*).*/;
const match=url.match(reg);
return match&&match[1]?match[1]:"";
}
/*==========================
START
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
loadGallery();
});
/*==========================
ELEMENT FILTER
==========================*/
const searchInput=document.getElementById("searchInput");
const tahunFilter=document.getElementById("tahunFilter");
const mapelFilter=document.getElementById("mapelFilter");
const mediaFilter=document.getElementById("mediaFilter");
const sortFilter=document.getElementById("sortFilter");
const loadMore=document.getElementById("loadMore");
const resetFilter=document.getElementById("resetFilter");
const filterChip=document.querySelectorAll(".filter-chip");
let activeChip="all";
/*==========================
SEARCH
==========================*/
searchInput.addEventListener("input",applyFilter);
tahunFilter.addEventListener("change",applyFilter);
mapelFilter.addEventListener("change",applyFilter);
mediaFilter.addEventListener("change",applyFilter);
sortFilter.addEventListener("change",applyFilter);
/*==========================
FILTER CHIP
==========================*/
filterChip.forEach(btn=>{
btn.addEventListener("click",()=>{
filterChip.forEach(x=>x.classList.remove("active"));
btn.classList.add("active");
activeChip=btn.dataset.filter;
currentPage=1;
applyFilter();
});
});
/*==========================
APPLY FILTER
==========================*/
function applyFilter(){
const keyword=searchInput.value.toLowerCase().trim();
const tahun=tahunFilter.value;
const mapel=mapelFilter.value;
const media=mediaFilter.value.toLowerCase();
filteredData=galleryData.filter(item=>{
const cari=
(item.title||"").toLowerCase().includes(keyword)||
(item.author||"").toLowerCase().includes(keyword)||
(item.subject||"").toLowerCase().includes(keyword)||
(item.category||"").toLowerCase().includes(keyword)||
(item.description||"").toLowerCase().includes(keyword);
const cocokTahun=!tahun||item.year==tahun;
const cocokMapel=!mapel||item.subject==mapel;
const jenis=getMediaType(item.link);
const cocokMedia=!media||jenis==media;
let cocokChip=true;
switch(activeChip){
case"Guru":
cocokChip=(item.category||"").toLowerCase()=="guru";
break;
case"Siswa":
cocokChip=(item.category||"").toLowerCase()=="siswa";
break;
case"youtube":
cocokChip=jenis=="youtube";
break;
case"pdf":
cocokChip=jenis=="pdf";
break;
case"ppt":
cocokChip=jenis=="ppt";
break;
case"word":
cocokChip=jenis=="word";
break;
case"gambar":
cocokChip=jenis=="image";
break;
case"audio":
cocokChip=jenis=="audio";
break;
default:
cocokChip=true;
}
return cari&&cocokTahun&&cocokMapel&&cocokMedia&&cocokChip;
});
sortGallery();
buildGallery();
toggleLoadMore();
}
/*==========================
SORTING
==========================*/
function sortGallery(){
switch(sortFilter.value){
case"nama":
filteredData.sort((a,b)=>
(a.title||"").localeCompare(b.title||""));
break;
case"rating":
filteredData.sort((a,b)=>
Number(b.rating||0)-Number(a.rating||0));
break;
case"populer":
filteredData.sort((a,b)=>
Number(b.view||0)-Number(a.view||0));
break;
default:
filteredData.sort((a,b)=>
Number(b.id||0)-Number(a.id||0));
}
}
/*==========================
LOAD MORE
==========================*/
loadMore.addEventListener("click",()=>{
currentPage++;
buildGallery();
toggleLoadMore();
});
function toggleLoadMore(){
if(filteredData.length<=currentPage*CONFIG.ITEM_PER_LOAD){
loadMore.style.display="none";
}else{
loadMore.style.display="inline-block";
}
}
/*==========================
RESET
==========================*/
resetFilter.addEventListener("click",()=>{
searchInput.value="";
tahunFilter.value="";
mapelFilter.value="";
mediaFilter.value="";
sortFilter.value="terbaru";
activeChip="all";
filterChip.forEach(btn=>{
btn.classList.remove("active");
if(btn.dataset.filter=="all"){
btn.classList.add("active");
}
});
currentPage=1;
applyFilter();
showToast("Filter berhasil direset.");
});
/*==========================
REFRESH DATA
==========================*/
async function refreshData(){
showLoading();
await loadGallery();
currentPage=1;
applyFilter();
hideLoading();
showToast("Galeri berhasil diperbarui.");
}
/*==========================
REFRESH BUTTON
==========================*/
refreshGallery.addEventListener("click",refreshData);
/*==========================
KEYBOARD SHORTCUT
==========================*/
document.addEventListener("keydown",e=>{
if(e.ctrlKey&&e.key==="f"){
e.preventDefault();
searchInput.focus();
}
if(e.key==="Escape"){
searchInput.value="";
applyFilter();
}
});
/*==========================
AUTO SEARCH
==========================*/
let searchTimer;
searchInput.addEventListener("keyup",()=>{
clearTimeout(searchTimer);
searchTimer=setTimeout(()=>{
currentPage=1;
applyFilter();
},300);
});
/*==========================
INIT
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
toggleLoadMore();
});
/*==========================
PREVIEW MODAL
==========================*/
const previewModal=new bootstrap.Modal(document.getElementById("previewModal"));
const previewContainer=document.getElementById("previewContainer");
const previewTitle=document.getElementById("previewTitle");
const previewAuthor=document.getElementById("previewAuthor");
const previewDescription=document.getElementById("previewDescription");
const previewCategory=document.getElementById("previewCategory");
const previewSubject=document.getElementById("previewSubject");
const previewYear=document.getElementById("previewYear");
const previewRating=document.getElementById("previewRating");
const previewLink=document.getElementById("previewLink");
/*==========================
OPEN PREVIEW
==========================*/
function openPreview(index){
const item=filteredData[index];
if(!item)return;
previewTitle.textContent=item.title||"-";
previewAuthor.textContent=item.author||"-";
previewDescription.textContent=item.description||"-";
previewCategory.textContent=item.category||"-";
previewSubject.textContent=item.subject||"-";
previewYear.textContent=item.year||"-";
previewRating.innerHTML=getStars(Number(item.rating||5));
previewLink.href=item.link;
previewLink.target="_blank";
previewContainer.innerHTML=createPreview(item.link);
previewModal.show();
increaseView(item);
}
/*==========================
CREATE PREVIEW
==========================*/
function createPreview(url){
const type=getMediaType(url);
switch(type){
case"youtube":
return youtubePreview(url);
case"pdf":
return pdfPreview(url);
case"drive":
return drivePreview(url);
case"audio":
return audioPreview(url);
case"video":
return videoPreview(url);
case"image":
return imagePreview(url);
case"word":
return officePreview(url);
case"ppt":
return officePreview(url);
case"excel":
return officePreview(url);
default:
return unknownPreview(url);
}
}
/*==========================
YOUTUBE
==========================*/
function youtubePreview(url){
const id=getYoutubeId(url);
return`
<iframe
src="https://www.youtube.com/embed/${id}?autoplay=1"
allowfullscreen
allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope">
</iframe>
`;
}
/*==========================
PDF
==========================*/
function pdfPreview(url){
return`
<iframe
src="${url}">
</iframe>
`;
}
/*==========================
GOOGLE DRIVE
==========================*/
function drivePreview(url){
const id=getDriveId(url);
return`
<iframe
src="https://drive.google.com/file/d/${id}/preview"
allow="autoplay">
</iframe>
`;
}
/*==========================
VIDEO
==========================*/
function videoPreview(url){
return`
<video controls autoplay>
<source src="${url}">
Browser tidak mendukung video.
</video>
`;
}
/*==========================
AUDIO
==========================*/
function audioPreview(url){
return`
<div class="d-flex justify-content-center align-items-center h-100">
<audio controls autoplay style="width:90%;">
<source src="${url}">
Browser tidak mendukung audio.
</audio>
</div>
`;
}
/*==========================
IMAGE
==========================*/
function imagePreview(url){
return`
<img
src="${url}"
class="img-fluid rounded">
`;
}
/*==========================
WORD/PPT/EXCEL
==========================*/
function officePreview(url){
return`
<iframe
src="https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}">
</iframe>
`;
}
/*==========================
UNKNOWN
==========================*/
function unknownPreview(url){
return`
<div class="text-center p-5">
<i class="bi bi-file-earmark fs-1 text-primary"></i>
<h4 class="mt-4">
Preview tidak tersedia
</h4>
<p>
Klik tombol di bawah untuk membuka file.
</p>
<a
href="${url}"
target="_blank"
class="btn btn-primary">
<i class="bi bi-box-arrow-up-right"></i>
Buka File
</a>
</div>
`;
}
/*==========================
GOOGLE DRIVE ID
==========================*/
function getDriveId(url){
let match=url.match(/\/d\/(.*?)\//);
if(match)return match[1];
match=url.match(/[?&]id=([^&]+)/);
if(match)return match[1];
return"";
}
/*==========================
VIEW COUNTER
==========================*/
function increaseView(item){
item.view=Number(item.view||0)+1;
}
/*==========================
CLOSE MODAL
==========================*/
document.getElementById("previewModal").addEventListener("hidden.bs.modal",()=>{
previewContainer.innerHTML="";
});
/*==========================
DOUBLE CLICK CARD
==========================*/
document.addEventListener("dblclick",e=>{
const card=e.target.closest(".gallery-card");
if(!card)return;
const index=[...document.querySelectorAll(".gallery-card")].indexOf(card);
if(index>-1){
openPreview(index);
}
});
/*==========================
ESC CLOSE
==========================*/
document.addEventListener("keydown",e=>{
if(e.key==="Escape"){
previewModal.hide();
}
});
/*==========================
ADMIN ELEMENT
==========================*/
const adminModalEl=document.getElementById("adminModal");
const adminModal=new bootstrap.Modal(adminModalEl);

const loginBox=document.getElementById("loginBox");
const adminPanel=document.getElementById("adminPanel");

const accessCode=document.getElementById("accessCode");
const btnLogin=document.getElementById("btnLogin");
const btnLogout=document.getElementById("btnLogout");
const btnAdmin=document.getElementById("btnAdmin");

const loginMsg=document.getElementById("loginMsg");

const btnSubmit=document.getElementById("btnSubmit");
const btnReset=document.getElementById("btnReset");

const title=document.getElementById("title");
const description=document.getElementById("description");
const category=document.getElementById("category");
const link=document.getElementById("link");
const year=document.getElementById("year");
const subject=document.getElementById("subject");
const author=document.getElementById("author");
const whatsappNumber=document.getElementById("whatsappNumber");
const createCertificate=document.getElementById("createCertificate");
const visibleToggle=document.getElementById("visibleToggle");
const formMsg=document.getElementById("formMsg");
/*==========================
OPEN ADMIN
==========================*/
btnAdmin.addEventListener("click",()=>{
accessCode.value="";
loginMsg.innerHTML="";
if(isLoggedIn){
showDashboard();
}else{
adminModal.show();
}
});
/*==========================
LOGIN
==========================*/
btnLogin.addEventListener("click",loginAdmin);
accessCode.addEventListener("keypress",e=>{
if(e.key==="Enter"){
loginAdmin();
}
});
function loginAdmin(){
const code=accessCode.value.trim();
if(code===""){
loginMsg.innerHTML="Masukkan kode akses.";
return;
}
if(code!==CONFIG.ACCESS_CODE){
loginMsg.innerHTML="Kode akses salah.";
showToast("Kode akses salah.","error");
return;
}
saveLogin();
isLoggedIn=true;
adminModal.hide();
showDashboard();
showToast("Login berhasil.");
}
/*==========================
SHOW DASHBOARD
==========================*/
function showDashboard(){
adminPanel.classList.remove("d-none");
window.scrollTo({
top:adminPanel.offsetTop-70,
behavior:"smooth"
});
updateDashboard();
}
/*==========================
UPDATE DASHBOARD
==========================*/
function updateDashboard(){
document.getElementById("adminTotalKarya").textContent=galleryData.length;
document.getElementById("adminTotalGuru").textContent=
galleryData.filter(x=>
(x.category||"").toLowerCase()=="guru").length;
document.getElementById("adminTotalSiswa").textContent=
galleryData.filter(x=>
(x.category||"").toLowerCase()=="siswa").length;
}
/*==========================
LOGOUT
==========================*/
btnLogout.addEventListener("click",()=>{
clearLogin();
isLoggedIn=false;
adminPanel.classList.add("d-none");
showToast("Logout berhasil.");
window.scrollTo({
top:0,
behavior:"smooth"
});
});
/*==========================
VALIDASI FORM
==========================*/
function validateForm(){
if(title.value.trim()==""){
showError("Judul karya wajib diisi.");
title.focus();
return false;
}
if(description.value.trim()==""){
showError("Deskripsi wajib diisi.");
description.focus();
return false;
}
if(category.value.trim()==""){
showError("Kategori wajib diisi.");
category.focus();
return false;
}
if(link.value.trim()==""){
showError("Link karya wajib diisi.");
link.focus();
return false;
}
if(!isValidUrl(link.value.trim())){
showError("Format URL tidak valid.");
link.focus();
return false;
}
if(author.value.trim()==""){
showError("Nama pembuat wajib diisi.");
author.focus();
return false;
}
if(year.value.trim()==""){
showError("Tahun wajib diisi.");
year.focus();
return false;
}
return true;
}
/*==========================
RESET FORM
==========================*/
btnReset.addEventListener("click",resetForm);
function resetForm(){
title.value="";
description.value="";
category.value="";
link.value="";
year.value="";
subject.value="";
author.value="";
whatsappNumber.value="";
createCertificate.value="no";
visibleToggle.checked=true;
formMsg.innerHTML="";
showToast("Form berhasil direset.");
}
/*==========================
FORM MESSAGE
==========================*/
function showError(message){
formMsg.innerHTML=
'<div class="alert alert-danger">'+message+'</div>';
showToast(message,"error");
}
function showSuccess(message){
formMsg.innerHTML=
'<div class="alert alert-success">'+message+'</div>';
showToast(message,"success");
}
/*==========================
URL VALIDATION
==========================*/
function isValidUrl(url){
try{
new URL(url);
return true;
}catch{
return false;
}
}
/*==========================
CHECK LOGIN
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
if(isLoggedIn){
showDashboard();
}
});
/*==========================
SUBMIT GOOGLE SHEETS
==========================*/
btnSubmit.addEventListener("click",submitData);
async function submitData(){
if(!validateForm())return;
showLoading();
btnSubmit.disabled=true;
const payload={
action:"create",
title:title.value.trim(),
description:description.value.trim(),
category:category.value.trim(),
link:link.value.trim(),
year:year.value.trim(),
subject:subject.value.trim(),
author:author.value.trim(),
whatsappNumber:whatsappNumber.value.trim(),
certificate:createCertificate.value,
visible:visibleToggle.checked,
rating:5,
view:0
};
try{
const formData = new FormData();
for(const key in payload){
    formData.append(key, payload[key]);
}
const response = await fetch(CONFIG.WEBAPP_URL,{
    method:"POST",
    body:formData
});
console.log("Status :", response.status);
const text = await response.text();
console.log("Response :", text);
const result = JSON.parse(text);
hideLoading();
btnSubmit.disabled=false;
if(result.status==="success"){
showSuccess(result.message||"Data berhasil disimpan.");
payload.id=result.id;
galleryData.unshift(payload);
filteredData=[...galleryData];
buildStatistic();
buildGallery();
showToast("Data berhasil disimpan.");
updateDashboard();
if(createCertificate.value==="yes"){
generateCertificate(payload);
}
if(whatsappNumber.value.trim()!==""){
sendWhatsApp(payload);
}
resetForm();
}else{
showError(result.message||"Gagal menyimpan data.");
}
}
catch(error){
    console.error("ERROR:", error);
    alert(error);
    hideLoading();
    btnSubmit.disabled=false;
    showError("Terjadi kesalahan koneksi.");
}}
/*==========================
UPDATE DATA
==========================*/
async function updateData(id){
const payload={
action:"update",
id:id,
title:title.value.trim(),
description:description.value.trim(),
category:category.value.trim(),
link:link.value.trim(),
year:year.value.trim(),
subject:subject.value.trim(),
author:author.value.trim(),
whatsappNumber:whatsappNumber.value.trim(),
certificate:createCertificate.value,
visible:visibleToggle.checked
};
const response=await fetch(CONFIG.WEBAPP_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});
const result=await response.json();
showToast(result.message);
loadGallery();
}
/*==========================
EDIT DATA
==========================*/
function editData(id){
const data=galleryData.find(x=>x.id===id);
if(!data)return;
title.value=data.title;
description.value=data.description;
category.value=data.category;
link.value=data.link;
year.value=data.year;
subject.value=data.subject;
author.value=data.author;
whatsappNumber.value=data.whatsappNumber;
createCertificate.value=data.certificate;
visibleToggle.checked=String(data.visible)=="true";
btnSubmit.onclick=()=>updateData(id);
}
/*==========================
Hapus Data
==========================*/
async function deleteData(id){
if(!confirm("Hapus data ini?"))return;
const payload={
action:"delete",
id:id
};
const response=await fetch(CONFIG.WEBAPP_URL,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify(payload)
});
const result=await response.json();
showToast(result.message);
loadGallery();
}
/*==========================
VALIDASI RESPONSE
==========================*/
function validateResponse(result){
if(!result)return false;
if(typeof result!=="object")return false;
if(!("status" in result))return false;
return true;
}
/*==========================
PING SERVER
==========================*/
async function pingServer(){
try{
const response=await fetch(CONFIG.WEBAPP_URL);
return response.ok;
}catch{
return false;
}
}
/*==========================
CEK SERVER
==========================*/
async function checkServer(){
const ok=await pingServer();
if(!ok){
showToast("Google Apps Script tidak dapat diakses.","error");
}
}
/*==========================
AUTO CHECK
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
checkServer();
});
/*==========================
GENERATE CERTIFICATE
==========================*/
function generateCertificate(data){
const certificate={
name:data.author,
title:data.title,
year:data.year,
subject:data.subject,
date:new Date().toLocaleDateString("id-ID")
};
console.log("Generate Certificate",certificate);
showToast("Sertifikat berhasil dibuat.");
}
/*==========================
WHATSAPP
==========================*/
function sendWhatsApp(data){
const number=normalizePhone(data.whatsappNumber);
if(number==="")return;
const message=
`Halo ${data.author}%0A%0A`+
`Karya Anda telah berhasil dipublikasikan.%0A%0A`+
`Judul : ${data.title}%0A`+
`Mapel : ${data.subject}%0A`+
`Tahun : ${data.year}%0A%0A`+
`Terima kasih.`;
window.open(
`https://wa.me/${number}?text=${message}`,
"_blank"
);
}
/*==========================
PHONE
==========================*/
function normalizePhone(phone){
phone=(phone||"").replace(/\D/g,"");
if(phone==="")return"";
if(phone.startsWith("08")){
phone="62"+phone.substring(1);
}
if(phone.startsWith("+")){
phone=phone.replace("+","");
}
return phone;
}
/*==========================
COPY TEXT
==========================*/
function copyText(text){
navigator.clipboard.writeText(text);
showToast("Berhasil disalin.");
}
/*==========================
DOWNLOAD JSON
==========================*/
function downloadJSON(data,file="gallery.json"){
const blob=new Blob(
[JSON.stringify(data,null,2)],
{type:"application/json"}
);
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download=file;
a.click();
URL.revokeObjectURL(a.href);
}
/*==========================
EXPORT CSV
==========================*/
function exportCSV(){
if(galleryData.length===0){
showToast("Tidak ada data.","warning");
return;
}
const header=Object.keys(galleryData[0]).join(",");
const rows=galleryData.map(item=>
Object.values(item).map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")
);
const csv=[header,...rows].join("\n");
const blob=new Blob([csv],{type:"text/csv"});
const a=document.createElement("a");
a.href=URL.createObjectURL(blob);
a.download="gallery.csv";
a.click();
URL.revokeObjectURL(a.href);
}
/*==========================
DATE
==========================*/
function today(){
return new Date().toLocaleDateString("id-ID",{
day:"2-digit",
month:"long",
year:"numeric"
});
}
/*==========================
TIME
==========================*/
function now(){
return new Date().toLocaleTimeString("id-ID");
}
/*==========================
UUID
==========================*/
function uuid(){
return"ID-"+Date.now()+"-"+
Math.random().toString(36).substring(2,8).toUpperCase();
}
/*==========================
EMPTY
==========================*/
function isEmpty(value){
return value===undefined||
value===null||
String(value).trim()==="";
}
/*==========================
DEBOUNCE
==========================*/
function debounce(fn,delay){
let timer;
return(...args)=>{
clearTimeout(timer);
timer=setTimeout(()=>fn(...args),delay);
};
}
/*==========================
LOG
==========================*/
function log(){
console.log("[Gallery]",...arguments);
}
/*==========================
FINISH
==========================*/
window.addEventListener("beforeunload",()=>{
console.log("Application Closed");
});
document.addEventListener("DOMContentLoaded",()=>{
log("Gallery System Ready");
showToast("Sistem siap digunakan.");
});
/*==========================
KALENDER JAM
==========================*/
document.addEventListener("DOMContentLoaded",()=>{
function updateDateTime(){
const now=new Date();
const tanggal=now.toLocaleDateString("id-ID",{
weekday:"long",
day:"2-digit",
month:"long",
year:"numeric"
});
const jam=now.toLocaleTimeString("id-ID",{
hour:"2-digit",
minute:"2-digit",
second:"2-digit"
});
const date=document.getElementById("todayDate");
const clock=document.getElementById("digitalClock");
if(date)date.textContent=tanggal;
if(clock)clock.textContent=jam;
}
updateDateTime();
setInterval(updateDateTime,1000);
});
