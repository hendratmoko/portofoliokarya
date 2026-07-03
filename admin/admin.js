// Admin JS for backend input page
// GANTI WEBAPP_URL dengan URL WebApp Anda setelah deploy Google Apps Script
const WEBAPP_URL = 'WEBAPP_URL_PLACEHOLDER';

const loginBox = document.getElementById('loginBox');
const formBox = document.getElementById('formBox');
const btnLogin = document.getElementById('btnLogin');
const loginMsg = document.getElementById('loginMsg');

btnLogin.addEventListener('click', async () => {
  const code = document.getElementById('accessCode').value.trim();
  if (!code) { loginMsg.textContent = 'Masukkan kode akses'; return; }
  try {
    const res = await fetch(WEBAPP_URL + '?action=verifyCode&code=' + encodeURIComponent(code));
    const j = await res.json();
    if (j && j.valid) {
      loginBox.classList.add('d-none');
      formBox.classList.remove('d-none');
      sessionStorage.setItem('accessCode', code);
    } else {
      loginMsg.textContent = 'Kode akses tidak valid';
    }
  } catch (err) {
    loginMsg.textContent = 'Gagal verifikasi kode akses: ' + err.message;
  }
});

document.getElementById('btnReset').addEventListener('click', () => {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('category').value = '';
  document.getElementById('link').value = '';
  document.getElementById('author').value = '';
  document.getElementById('whatsappNumber').value = '';
});

document.getElementById('btnSubmit').addEventListener('click', async () => {
  const payload = {
    action: 'submitKarya',
    accessCode: sessionStorage.getItem('accessCode') || document.getElementById('accessCode').value.trim(),
    title: document.getElementById('title').value.trim(),
    description: document.getElementById('description').value.trim(),
    category: document.getElementById('category').value.trim(),
    link: document.getElementById('link').value.trim(),
    visible: document.getElementById('visibleToggle').checked ? 'YA' : 'TIDAK',
    year: document.getElementById('year').value.trim(),
    subject: document.getElementById('subject').value.trim(),
    whatsapp: document.getElementById('whatsappNumber').value.trim(),
    author: document.getElementById('author').value.trim(),
    createCertificate: document.getElementById('createCertificate').value
  };

  if (!payload.title || !payload.description) {
    document.getElementById('formMsg').textContent = 'Judul dan deskripsi wajib diisi.';
    return;
  }

  try {
    const res = await fetch(WEBAPP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const j = await res.json();
    if (j.success) {
      document.getElementById('formMsg').innerHTML = '<span class="text-success">Data tersimpan. ID: ' + j.rowId + '</span>';
      if (j.certificateUrl) {
        document.getElementById('formMsg').innerHTML += '<div class="mt-2">Sertifikat: <a href="' + j.certificateUrl + '" target="_blank">Download</a></div>';
      }
    } else {
      document.getElementById('formMsg').textContent = 'Gagal: ' + (j.error || 'unknown');
    }
  } catch (err) {
    document.getElementById('formMsg').textContent = 'Error: ' + err.message;
  }
});
