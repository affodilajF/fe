export type Language = "en" | "id";

export const translations = {
  en: {
    // Navigation
    monitoring: "Real-time Monitoring",
    video_streaming: "Video Streaming",
    analytics: "Analytics",
    reports: "Reports",
    management: "Management",
    compliance_dashboard: "Compliance Dashboard",
    ai_detection_system: "AI Detection System",
    ppe_monitor: "PPE Monitor",

    // Common Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    reset: "Reset",
    search: "Search",
    loading: "Loading...",
    settings: "Settings",
    language: "Language",
    browse: "Browse",
    saving: "Saving...",
    save_configuration: "Save Configuration",

    // Settings Dialog
    detection_params_title: "Detection Parameters Setting",
    detection_params_desc: "Configuration for detection model",
    detection_zone_boundaries: "Detection Zone Boundaries",
    choose_preview: "Choose image or video to preview",
    visual_area: "Visual Area",
    zone_boundary_hint:
      "Hold and drag the line for the zone boundary. Entry detection is always top to bottom.",
    run_image_analysis: "Run Image Analysis",
    run_video_analysis: "Run Video Analysis",
    no_file_chosen: "No file chosen",
    files_selected: "files selected",
    minute: "Minute",
    detailed_image_view: "Detailed Image View",
    dashboard: "Dashboard",

    // Auth
    app_title: "PPE Compliance Monitoring Dashboard",
    welcome_back: "Welcome back",
    login_subtitle: "Sign in to continue to your dashboard.",
    create_account_subtitle: "Create an account to get started.",
    login: "Login",
    log_out: "Log out",
    register_success: "Registration successful! Please sign in to your account.",
    email: "Email",
    password: "Password",
    no_account: "Don't have an account?",
    sign_up_now: "Sign Up now",
    create_account: "Create New Account",
    username: "Username",
    input_username: "Input username",
    sign_up: "Sign Up",
    have_account: "Already have an account?",
    login_now: "Login now",

    // Compliance Dashboard
    workers_detected: "workers detected",
    total: "Total",
    filters: "Filters",
    summary: "Summary",
    stats: "Stats",
    search_by_name: "Search by Name",
    type_name: "Type name...",
    start_date: "Start Date",
    end_date: "End Date",
    summary_analysis: "Summary Analysis",
    no_summary_provided: "No summary provided",
    compliance_over_time: "Compliance Over Time",
    compliance_by_hour: "Compliance by Hour",
    violation_distribution: "Violation Distribution",
    no_data_found: "No data found for the selected filters.",

    // Upload & Detect
    video_analysis: "Video Analysis",
    image_analysis: "Image Analysis",
    video_analysis_desc:
      "Fill in the details and upload the recording to run AI detection analysis.",
    image_analysis_desc:
      "Fill in the details and upload images to run AI detection analysis.",
    title: "Title",
    example_room: "Example: Room No 3",
    video_date: "Video Date",
    video_time: "Video Time",
    image_date: "Image Date",
    image_time: "Image Time",
    upload_video: "Upload Video Recording",
    upload_images: "Upload Images",
    run_detection: "Run Detection Analysis",
    multiple_images_hint: "You can select multiple images for analysis.",
    entry_direction: "Entry Direction",
    detection_zone: "Detection Zone",
    settings_zone_hint: "Open settings to set the detection zone.",

    // Dashboard Charts & Summaries
    loading_wait: "Please wait while we process the latest data...",
    stats_ppe_audit: "Statistics & PPE Audit",
    total_workers: "Total Workers",
    compliant_workers: "Compliant Workers",
    non_compliant_workers: "Non-Compliant Workers",
    compliance_rate: "Compliance Rate",
    total_workers_desc: "Total individuals detected based on active filters.",
    compliant_workers_desc:
      "Number of persons wearing COMPLETE safety equipment.",
    non_compliant_workers_desc:
      "Number of persons missing at least one PPE component.",
    compliance_rate_desc:
      "Percentage of compliant workers compared to total workers.",
    adherence_percentage: "Adherence percentage",
    ppe_item: "PPE Item",
    status: "Status",
    compliance: "Compliance",
    pass: "Pass",
    fail: "Fail",
    quick_audit: "Quick Audit",
    quick_audit_desc:
      "Instant Pass/Fail counts for each specific PPE category.",
    updating_chart: "Updating Chart...",
    top_violation_factors: "Top Violation Factors",
    top_violation_factors_desc:
      "Breakdown of specific PPE items that failed most frequently.",
    no_violations_detected: "No non-compliant cases detected.",
    fails: "Fails",
    trend_analysis: "Trend Analysis",
    daily_history: "Daily History",
    hourly_history: "Hourly History",
    missing_apron: "Missing Apron",
    missing_gloves: "Missing Gloves",
    missing_boots: "Missing Boots",
    missing_mask: "Missing Mask",
    missing_hairnet: "Missing Hairnet",
    hour: "Hour",
    no_data_available: "No detection data available.",
    page: "Page",
    no: "No",
    name: "Name",
    date: "Date",
    time: "Time",
    image: "Image",
    video: "Video",
    created_at: "Created At",
    detailed_ppe_performance: "Detailed PPE Performance",
    detailed_ppe_performance_desc:
      "Comprehensive comparison of Pass and Fail detections for all required safety equipment.",
    pass_complete: "Pass (Complete PPE)",
    fail_missing: "Fail (Missing PPE)",
    ready_to_start: "Ready to Start PPE Analysis?",
    no_model_running_desc:
      "No AI model is running yet. Upload your image or video and let our system analyze it for you automatically.",
    confirm_cancel: "Confirm Cancellation",
    confirm_cancel_desc: "Detection results will not be saved if you continue.",
    continue: "Continue",
    success: "Success!",
    success_stored_desc: "Detection result successfully stored to database",
    ok: "OK",
    process_running: "Detection process is running. Please wait...",
    process_completed: "Detection process is completed!",
    ai_analysis: "AI Detection Analysis",
    processing: "Processing",
    finished: "Finished",
    frame_processing: "Frame Processing",
    frames: "frames",
    job_id: "Job ID",
    delete_result: "Delete Result",
    store_result: "Store Result",
    storing: "Storing...",
    see_result: "See Result",
    person: "Person",
    no_detail_data:
      "No detailed compliance data available for this detection result.",
    no_visuals: "No visuals available",
    close_report: "Close Report",
    detection_results: "Detection Results",
    source: "Source",
    actions: "Actions",
    showing_data: "Showing {count} data from {total} data",

    // PPE Names
    apron: "Apron",
    gloves: "Gloves",
    boots: "Boots",
    mask: "Mask",
    hairnet: "Hairnet",
  },
  id: {
    // Navigation
    monitoring: "Pemantauan Real-time",
    video_streaming: "Streaming Video",
    analytics: "Analitik",
    reports: "Laporan",
    management: "Manajemen",
    compliance_dashboard: "Dasbor Kepatuhan",
    ai_detection_system: "Sistem Deteksi AI",
    ppe_monitor: "Monitor APD",

    // Common Actions
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Ubah",
    reset: "Atur Ulang",
    search: "Cari",
    loading: "Memuat...",
    settings: "Pengaturan",
    language: "Bahasa",
    browse: "Telusuri",
    saving: "Menyimpan...",
    save_configuration: "Simpan Konfigurasi",

    // Settings Dialog
    detection_params_title: "Pengaturan Parameter Deteksi",
    detection_params_desc: "Konfigurasi untuk model deteksi",
    detection_zone_boundaries: "Batas Zona Deteksi",
    choose_preview: "Pilih gambar atau video untuk pratinjau",
    visual_area: "Area Visual",
    zone_boundary_hint:
      "Tahan dan seret garis untuk menentukan batas zona. Deteksi masuk selalu dari atas ke bawah.",
    run_image_analysis: "Jalankan Analisis Gambar",
    run_video_analysis: "Jalankan Analisis Video",
    no_file_chosen: "Belum ada file dipilih",
    files_selected: "file dipilih",
    minute: "Menit",
    detailed_image_view: "Tampilan Gambar Detail",
    dashboard: "Dasbor",

    // Auth
    app_title: "Dashboard Monitoring Kepatuhan Alat Pelindung Diri (APD)",
    welcome_back: "Selamat datang kembali",
    login_subtitle: "Masuk untuk melanjutkan ke dasbor Anda.",
    create_account_subtitle: "Buat akun untuk memulai.",
    login: "Masuk",
    log_out: "Keluar",
    register_success: "Registrasi berhasil! Silakan masuk ke akun Anda.",
    email: "Email",
    password: "Kata Sandi",
    no_account: "Belum punya akun?",
    sign_up_now: "Daftar sekarang",
    create_account: "Buat Akun Baru",
    username: "Nama Pengguna",
    input_username: "Masukkan nama pengguna",
    sign_up: "Daftar",
    have_account: "Sudah punya akun?",
    login_now: "Masuk sekarang",

    // Compliance Dashboard
    workers_detected: "pekerja terdeteksi",
    total: "Total",
    filters: "Filter",
    summary: "Ringkasan",
    stats: "Statistik",
    search_by_name: "Cari berdasarkan Nama",
    type_name: "Ketik nama...",
    start_date: "Tanggal Mulai",
    end_date: "Tanggal Selesai",
    summary_analysis: "Analisis Ringkasan",
    no_summary_provided: "Ringkasan tidak tersedia",
    compliance_over_time: "Kepatuhan dari Waktu ke Waktu",
    compliance_by_hour: "Kepatuhan per Jam",
    violation_distribution: "Distribusi Pelanggaran",
    no_data_found: "Tidak ada data yang ditemukan untuk filter yang dipilih.",

    // Upload & Detect
    video_analysis: "Analisis Video",
    image_analysis: "Analisis Gambar",
    video_analysis_desc:
      "Isi detail dan unggah rekaman untuk menjalankan analisis deteksi AI.",
    image_analysis_desc:
      "Isi detail dan unggah gambar untuk menjalankan analisis deteksi AI.",
    title: "Judul",
    example_room: "Contoh: Ruang No 3",
    video_date: "Tanggal Pengambilan Video",
    video_time: "Waktu Pengambilan Video",
    image_date: "Tanggal Pengambilan Gambar",
    image_time: "Waktu Pengambilan Gambar",
    upload_video: "Unggah Rekaman Video",
    upload_images: "Unggah Gambar",
    run_detection: "Jalankan Analisis Deteksi",
    multiple_images_hint: "Anda dapat memilih beberapa gambar untuk analisis.",
    entry_direction: "Arah Masuk",
    detection_zone: "Zona Deteksi",
    settings_zone_hint: "Buka pengaturan untuk mengatur zona deteksi.",

    // Dashboard Charts & Summaries
    loading_wait: "Mohon tunggu sementara kami memproses data terbaru...",
    stats_ppe_audit: "Statistik & Audit APD",
    total_workers: "Total Pekerja",
    compliant_workers: "Pekerja Patuh",
    non_compliant_workers: "Pekerja Tidak Patuh",
    compliance_rate: "Tingkat Kepatuhan",
    total_workers_desc:
      "Total individu yang terdeteksi berdasarkan filter aktif.",
    compliant_workers_desc:
      "Jumlah orang yang mengenakan peralatan keselamatan LENGKAP.",
    non_compliant_workers_desc:
      "Jumlah orang yang kehilangan setidaknya satu komponen APD.",
    compliance_rate_desc:
      "Persentase pekerja yang patuh dibandingkan dengan total pekerja.",
    adherence_percentage: "Persentase kepatuhan",
    ppe_item: "Item APD",
    status: "Status",
    compliance: "Kepatuhan",
    pass: "Lulus",
    fail: "Gagal",
    quick_audit: "Audit Cepat",
    quick_audit_desc:
      "Jumlah Lulus/Gagal instan untuk setiap kategori APD tertentu.",
    updating_chart: "Memperbarui Bagan...",
    top_violation_factors: "Faktor Pelanggaran Teratas",
    top_violation_factors_desc:
      "Rincian item APD tertentu yang paling sering gagal.",
    no_violations_detected: "Tidak ada kasus ketidakpatuhan yang terdeteksi.",
    fails: "Gagal",
    trend_analysis: "Analisis Tren",
    daily_history: "Riwayat Harian",
    hourly_history: "Riwayat Per Jam",
    missing_apron: "Tanpa Apron",
    missing_gloves: "Tanpa Sarung Tangan",
    missing_boots: "Tanpa Sepatu Boots",
    missing_mask: "Tanpa Masker",
    missing_hairnet: "Hairnet",
    hour: "Jam",
    no_data_available: "Tidak ada data deteksi yang tersedia.",
    page: "Halaman",
    no: "No",
    name: "Nama",
    date: "Tanggal",
    time: "Waktu",
    image: "Gambar",
    video: "Video",
    created_at: "Dibuat Pada",
    detailed_ppe_performance: "Kinerja APD Terperinci",
    detailed_ppe_performance_desc:
      "Perbandingan komprehensif deteksi Lulus dan Gagal untuk semua peralatan keselamatan yang diperlukan.",
    pass_complete: "Lulus (APD Lengkap)",
    fail_missing: "Gagal (Tanpa APD)",
    ready_to_start: "Siap Memulai Analisis APD?",
    no_model_running_desc:
      "Belum ada model AI yang berjalan. Unggah gambar atau video untuk mulai analisis.",
    confirm_cancel: "Konfirmasi Pembatalan",
    confirm_cancel_desc:
      "Hasil deteksi tidak akan disimpan ke database jika Anda melanjutkan.",
    continue: "Lanjutkan",
    success: "Berhasil!",
    success_stored_desc: "Hasil deteksi berhasil disimpan ke database",
    ok: "OK",
    process_running: "Proses deteksi sedang berjalan. Harap tunggu...",
    process_completed: "Proses deteksi selesai!",
    ai_analysis: "Analisis Deteksi AI",
    processing: "Memproses",
    finished: "Selesai",
    frame_processing: "Pemrosesan Frame",
    frames: "frame",
    job_id: "ID Pekerjaan",
    delete_result: "Hapus Hasil",
    store_result: "Simpan Hasil",
    storing: "Menyimpan...",
    see_result: "Lihat Hasil",
    person: "Orang",
    no_detail_data:
      "Tidak ada data kepatuhan terperinci yang tersedia untuk hasil deteksi ini.",
    no_visuals: "Tidak ada visual tersedia",
    close_report: "Tutup Laporan",
    detection_results: "Hasil Deteksi",
    source: "Sumber",
    actions: "Aksi",
    showing_data: "Menampilkan {count} data dari {total} data",

    // PPE Names
    apron: "Apron",
    gloves: "Sarung Tangan",
    boots: "Sepatu Boots",
    mask: "Masker",
    hairnet: "Hairnet",
  },
};

const LANG_STORAGE_KEY = "app_lang";

// Default for both SSR and the first client render (keeps hydration consistent).
// The stored language is applied after mount via LanguageProvider.
export let CURRENT_LANG: Language = "id";

const listeners = new Set<() => void>();

// Subscribe to language changes (used by LanguageProvider to re-render).
export function subscribeLanguage(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

// Apply the persisted language (client only). Returns true if it changed.
export function applyStoredLanguage(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
  if ((stored === "en" || stored === "id") && stored !== CURRENT_LANG) {
    CURRENT_LANG = stored;
    return true;
  }
  return false;
}

// Persist + switch language live (no page reload); notifies subscribers.
export function setLanguage(lang: Language) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
  if (CURRENT_LANG === lang) return;
  CURRENT_LANG = lang;
  listeners.forEach((cb) => cb());
}

export const t = (key: keyof typeof translations.en) => {
  return translations[CURRENT_LANG][key] || translations.en[key];
};
