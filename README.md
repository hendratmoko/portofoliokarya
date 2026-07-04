# portofoliokarya
Produk Hasil Pembelajaran

Bertindaklah sebagai Senior Full-Stack Web Developer dan Sistem Analis berpengalaman. Saya ingin membuat sebuah platform web interaktif, informatif, dan modern untuk SMKN 1 Sanden. 

Web ini berfungsi sebagai "Galeri Unjuk Kerja" bagi seluruh Siswa serta Guru (Adaptif, Normatif, dan Produktif) yang dapat diakses oleh publik (umum). Sistem backend web ini harus terintegrasi langsung dengan Google Sheets sebagai database utamanya.

Berikut adalah spesifikasi detail alur sistem dan fitur yang saya butuhkan:

1. FITUR HALAMAN DEPAN (FRONTEND - PUBLIK)
- Bagian atas (head) terdapat tulisan GALERI KARYA SMK NEGERI 1 SANDEN
- Di kanan atas terdapat icon Help, icon tema Gelap/Terang, icon Daftar (untuk masuk FITUR SISTEM PENDAFTARAN & KODE AKSES)
- Desain: Bagus, modern, bersih, responsif (mobile-friendly), dan interaktif dan tanpa password.
- Konten Utama: Menampilkan "Grid/Card Preview" dari karya siswa dan guru. 
- Preview Media: Jika link berupa YouTube, tampilkan embed video/thumbnail. Jika berupa Google Drive (Word, PPTX, PDF, MP3, gambar dll), tampilkan preview atau icon yang sesuai atau embed preview yang rapi beserta keterangan/deskripsi pembuatan yang boleh dipublish. Sertakan Bintang dan tanggapan untuk masing-masing karya.
- Navigasi & Filter: Pencarian berdasarkan nama, kategori (Siswa / Guru / Tahun produksi/Mata Pelajaran/Subjek pelajaran), dan jenis media.
- Bagian bawah terdapat link fitur LOGIN (jika mengetik kode akses dengan benar tanpa enter, otomatis masuk ke FITUR HALAMAN BACKEND /INPUT DATA).

2. FITUR HALAMAN BACKEND (INPUT DATA)
- Untuk masuk ke halaman ini, terdapat icon di bagian kanan atas berjajar dengan mode gelap terang dan Bahasa.
- User masuk ke halaman backend menggunakan KODE AKSES yang sudah didapatkan dari FITUR SISTEM PENDAFTARAN & KODE AKSES
- Di dalam backend, terdapat form sederhana untuk menginput: Judul Karya, Deskripsi Singkat (keterangan pembuatan seperti alat, bahan, software, lama produksi, sebagai syarat mata pelajaran, nama pengajar dan selengkap-lengkapnya), Kategori, dan Link (YouTube atau Google Drive) serta icon untuk boleh/tidak ditayangkan.
- Data yang diinput secara otomatis tersinkronisasi (terketik) ke Google Sheets (https://docs.google.com/spreadsheets/d/1A9zJC2ROfRCNz6FRONTM00xr3Ez-3V74H1S_-dcwtG8/edit?gid=2046791563#gid=2046791563 dengan nama sheet LMSANDEN) dan langsung muncul di halaman depan setelah disubmit.
- Terdapat Fitur print Sertifikat skill Passport pada bagian Bawah yang isinya sesuai dengan produk/karya yang telah diupload dan data sebagaimana sertifikat Skill Passport dengan bentuk PDF dan dikirimkan ke WhatsApp. Dan tayangkan di galeri jika karya sudah tersertifikasi.
- User mendapatkan lencana sertifikat yang berupa bintang tertera di Galeri dan Sertifikat Skill Passport jika menyelesaikan 10 soal yang berkaitan dengan projek dengan benar. Sesuaikan jumlah lencana dengan jawaban yang benar. Jika tidak ada yang benar, tidak mencapatkan Sertifikat.
3. FITUR SISTEM PENDAFTARAN & KODE AKSES
- Untuk masuk ke halaman ini, terdapat icon di bagian kanan atas berjajar dengan mode geap terang dan Bahasa.
- Sebelum masuk ke backend, Siswa dan Guru harus mengisi formulir pendaftaran singkat (Nama, Status: Siswa/Guru, Jurusan/Mata Pelajaran, Email/No.HP).
- Setelah mendaftar, sistem secara otomatis men-generate "KODE AKSES" unik (misal: BYS245 untuk nama Bayu Susanto) yang dikirimkan ke WhatsApp user atau ditampilkan di layar. Kode ini juga tercatat di Google Sheets khusus data pengguna.

4. TEKNOLOGI YANG DISARANKAN
Berikan arsitektur yang paling efisien, mudah dideploy, dan gratis/murah untuk skala sekolah. Saya mempertimbangkan penggunaan:
- HTML, Tailwind CSS, JavaScript murni di Frontend, dan Google Apps Script sebagai Backend & API (Tanpa perlu sewa hosting mahal, memanfaatkan Google Drive/Sheets sepenuhnya).
- Terdapat pilihan mode gelap dan mode terang.
- Mode Bahasa Indonesia dan Inggris
- Otomatisasi soal melalui AI, sehingga sesuai dengan hasil input user. Soal dibuat dengan level susah.

SAYA MINTA:
1. Alur Logika Sistem atau langkah-langkah (User Flow) dalam bentuk poin-poin yang jelas.
2. Struktur Kolom Google Sheets yang dibutuhkan (1 sheet). Alamat Spreadsheet: https://docs.google.com/spreadsheets/d/1zILB3V4dl1f-7xjV_-WYoPQWvGNT8Xwqw0D52boogwk/edit?usp=drivesdk
3. Kode lengkap (atau boilerplate terstruktur) untuk Frontend (Halaman Depan & Form) menggunakan single HTML + Tailwind CSS agar tampilannya estetis beserta keterangan kodenya (contoh: "<!-- bagian css -->")
4. Kode Google Apps Script untuk menangani proses pendaftaran (generate kode), validasi login kode akses, dan proses post data link ke Google Sheets dibuat tersendiri.

Buatlah sistem ini dengan standar keamanan dasar agar kode akses tidak mudah dimanipulasi di sisi client (frontend).
