Kaipo

Bagi per entry point (Pasien baru)
70%
1. Isi dari admin (via whatsapp admin / nomor klinik / IG) - Reservasi online flow
- Admin balas WA pasien kalau klinik buka jam sekian/dokter available jam sekian
- Admin isi data BASIC via form
- 

25%
2. Isi dari admin (manual) - Walk in flow
- 95% pasien reguler (sudah pernah datang) - 5% pasien baru
- Admin tanya data pasien & keluhan
- Admin isi data BASIC via form
- 

5%
3. Pasien isi sendiri - Website flow (Kayak halodoc) 
- Isi dari web landing, data basic (nama, no telp, keluhan)
- Admin isi data BASIC via form
- 


Data BASIC (nama, keluhan, nomor hp, dokter, jam, klinik)
- Data kembar / input berulang gak masalah, (karena diseleksi admin scr manual)
- Data ini gunanya untuk follow up dan lanjut ke ENCOUNTER
- Untuk jadi data RME, lewat konversi BASIC -> RME oleh Admin
- Fuzzy matching via Nama ATAU Nomer HP, match kasih label kalo existing

# Konversi BASIC ke RME

Data RME
- Data harus unik
- Matching via NIK / Nama
- NIK, Data pribadi, Alamat lengkap, Histori penyakit, alergi, dll 
- Lebih lengkap, Bisa dikembangkan dari Data BASIC (dari konversi), 
- Bisa dari awal (fungsi utk migrasi data lama, data hilang, admin lupa ngisi)
Jenis data RME :
    1. Data pasien baru
    2. Data pasien visit di org sama
    3. Data pasien visit shared di org


# Owner
1. Profil klinik (Nama, foto profil, icon, alamat)
2. CRUD utk register dokter, admin, perawat
3. Payment & Subscription Kaipo
4. Jadwal kerja karyawan & Absensi 
5. Stock gudang
6. Keuangan klinik & Penggajian


Question - PR
1. Pastikan asumsi porsi per entri poin
2. Pindah ke docs -> Jira dipakai Dev kalo fitur udah fix, Jira yang udah ada biarin aja utk referensi
3. Rombak status jadi ikut satu sehat

