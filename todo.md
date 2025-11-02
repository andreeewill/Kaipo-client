Kaipo - UPDATED FLOW IMPLEMENTATION ✅

## Entry Points Implementation (COMPLETED)

### 1. Website Entry Point (5%) ✅
- Location: `/clinics` page
- Creates BASIC data with source: 'WEBSITE'
- Status: CREATED → awaits admin review

### 2. WhatsApp Entry Point (70%) ✅
- Admin-assisted registration via `/dashboard/basic-patients`
- Creates BASIC data with source: 'WHATSAPP'  
- Status: CREATED → awaits admin review

### 3. Walk-in Entry Point (25%) ✅
- Admin-assisted registration via `/dashboard/basic-patients`
- Creates BASIC data with source: 'WALKIN'
- Status: CREATED → awaits admin review

## Data Flow Implementation ✅

### BASIC Data Structure:
- Name, Phone, Complaint, Source, Status
- Allows duplicates (admin handles manually)
- Fuzzy matching capabilities (planned)
- Status tracking: CREATED → UNDER_REVIEW → SCHEDULED → ENCOUNTER_READY → COMPLETED

### Admin Workflow Pages:

#### 1. Data BASIC Pasien (`/dashboard/basic-patients`) ✅
- View all BASIC data from all sources
- Stats dashboard by source
- Manual registration for WhatsApp/Walk-in
- Duplicate detection (planned)

#### 2. Konfirmasi Jadwal (`/dashboard/scheduling-confirmation`) ✅  
- Review pending confirmations
- Admin scheduling confirmation process
- Direct confirm, reschedule, or first-time schedule
- WhatsApp notifications

#### 3. Manajemen Appointment (`/dashboard/appointment-management`) ✅
- Manage scheduled appointments
- Updated status tracking for scheduled patients
- Focus on confirmed appointments only

#### 4. Antrian Encounter (`/dashboard/queue-management`) ✅
- Queue management for encounter-ready patients
- Patient encounter preparation
- Doctor-patient meeting coordination

## Navigation Structure ✅
Updated sidebar "Pendaftaran" menu:
- Pendaftaran Online (public entry point)
- Data BASIC Pasien (admin view all sources)
- Konfirmasi Jadwal (admin scheduling) 
- Daftar Reservasi (scheduled appointments)
- Antrian Encounter (ready for doctor)

## Status Flow ✅
CREATED (from any entry point)
↓
UNDER_REVIEW (admin checking)
↓  
SCHEDULED (admin confirmed schedule)
↓
ENCOUNTER_READY (patient arrived/ready)
↓
IN_ENCOUNTER (with doctor)
↓
COMPLETED (finished)

## Next Implementation Steps:
1. API endpoints for new flow
2. Fuzzy duplicate detection
3. WhatsApp integration automation
4. Patient arrival confirmation system
5. Integration with RME system


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



## Modul RME
1. Data Basic ke RME
2. Data Riwayat Medis
3. Antrian Dokter 

- New Patient flow
Isi Riwayat Awal

- Existing Patient flow
View only on history / basic detail



4. Pemeriksaan klinis
    Pilih lokasi, 
        if ALL, langsung isi tindakan
        if RA/RB (pilih rahang), langsung isi tindakan
        IF kode gigi - nama gigi
            Pilih Keadaan
            Pilih Jenis Restorasi
            Visualkan hasil pilihannya ke Odontogram chart

    Keterangan / Keluhan
        Ada teks template di text area nya



5. Diagnosa
Change AI Diagnosis to Diagnosa
Move the content for AI Diagnosis summary to below, on top of it, should have an autocomplete for Diagnosa and ICD 10 with an AI icon (suggesting that the Diagnosa input box have an AI feature to find the matching ICD 10).

Below it, If ALL/ RA/ RB is chosen on Pemeriksaan, show the summary on the Keterangan / Keluhan
