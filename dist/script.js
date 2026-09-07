const filters = document.querySelectorAll('.filter');
const projects = document.querySelectorAll('.project');
const languageToggle = document.getElementById('language-toggle');
const descriptionMeta = document.querySelector('meta[name="description"]');

const englishCopy = Object.fromEntries(
  [...document.querySelectorAll('[data-i18n]')].map((element) => [element.dataset.i18n, element.innerHTML])
);

const translations = {
  en: englishCopy,
  id: {
    "asset_rr_wireframes": "Wireframe halaman",
    "asset_rr_sitemap": "Sitemap & target halaman",
    "asset_knitto_overview": "Performa search",
    "asset_knitto_recovery": "Recovery setelah Core Update",
    "asset_knitto_discover_report": "Laporan Google Discover",
    "asset_knitto_discover": "Tampil di Discover",
    "asset_knitto_article": "Artikel SEO",
    "asset_knitto_press": "Press release",
    "asset_knitto_guest": "Guest post · Kompasiana",
    "asset_flin_blog": "Artikel blog",
    "asset_flin_medium": "Artikel Medium",
    "asset_flin_press": "Press release",
    "asset_flin_entertainment": "Entertainment",
    "asset_flin_content": "Edukasi finansial",
    "asset_flin_promotion": "Promosi soft-selling",
    "asset_flin_homepage": "Copy homepage",
    "asset_idn_profile": "Artikel yang terbit",
    "asset_idn_feature": "Cerita featured writer",
    "asset_idn_award": "Penghargaan menulis",
    "asset_idn_award_2": "Apresiasi komunitas",
    "asset_idn_award_3": "Apresiasi komunitas",
    "asset_idn_award_4": "Apresiasi komunitas",
    "asset_linov_before": "Sebelum · homepage lama",
    "asset_linov_revamp": "Sesudah · website revamp",
    "asset_linov_id": "Copy homepage · Indonesia",
    "asset_linov_en": "Copy homepage · Inggris",
    "asset_linov_google": "Hasil pencarian",
    "asset_linov_mobile": "Artikel HR & bisnis",
    "asset_linov_banner": "Banner campaign",
    "asset_personal_analytics": "Analytics creator",
    "asset_personal_viral": "Belanja mingguan",
    "asset_personal_mealprep": "Konten meal prep",
    "asset_personal_profile": "Profil creator",
    "asset_personal_budget": "Belanja hemat",
    "asset_personal_food": "Jajan & kuliner",
    "asset_visit_feature": "Wisata · Cibodas",
    "asset_visit_food": "Kuliner lokal",
    "asset_visit_fashion": "Lokasi prewedding",
    "asset_visit_profile": "Profil Instagram",
    "asset_isipiringku_profile": "Akun edukasi gizi",
    "asset_isipiringku_feed": "Feed edukasi",
    "asset_isipiringku_post": "Konten gizi",
    "asset_truedetox_landing": "Copy landing page",
    "asset_truedetox_ad": "Iklan acquisition",
    "asset_truedetox_feed": "Copy feed",
    "asset_truedetox_story": "Story interaktif",
    "asset_truedetox_copy_1": "Campaign Ramadan",
    "asset_truedetox_webinar": "Promosi webinar",
    "asset_truedetox_copy_2": "Post edukasi",
    "asset_truedetox_story_2": "Story komunitas",
    "moreVisuals": "Visual project lainnya",
    "enlargeVisual": "Klik gambar buat lihat lebih dekat.",
    "closeVisual": "Tutup",
    "originalVisual": "Buka gambar ukuran penuh",

    skip: 'Lewati ke konten',
    navAbout: 'Tentang',
    navWork: 'Karya pilihan',
    navExperience: 'Pengalaman',
    navContact: 'Ngobrol yuk',
    heroEyebrow: 'Jakarta, Indonesia · Terbuka untuk peluang baru',
    heroTitle: 'SEO tetap butuh<br />sentuhan <em>manusia.</em>',
    heroIntro: 'Saya Nadhifa — SEO Specialist dan Content Strategist yang mengubah search intent jadi pengalaman yang berguna dan pertumbuhan bisnis yang bisa diukur.',
    heroWork: 'Lihat karya pilihan',
    downloadCv: 'Unduh CV',
    heroPortfolio: 'Buka portfolio',
    canvaCta: 'Lihat di Canva',
    contactPortfolio: 'Case study lengkap (PDF)',
    contactCanva: 'Deck portfolio interaktif',
    heroYears: '4+ tahun di SEO, content, dan social media',
    scroll: 'Scroll buat lihat karya',
    aboutLabel: 'Tentang saya',
    aboutTitle: 'Bikin brand lebih<br /><span>mudah ditemukan,</span> lalu layak dipilih.',
    aboutOne: 'Saya membantu berbagai brand tumbuh lewat strategi SEO yang menyeluruh, content yang relevan, serta on-page dan off-page optimization yang jalan bareng.',
    aboutTwo: 'Mulai dari keyword research dan technical audit sampai copywriting dan content system, saya menghubungkan kebutuhan audiens dengan target bisnis — lalu memakai data untuk terus memperbaiki hasilnya.',
    metricTrafficGrowth: 'kenaikan traffic',
    metricKnitto: 'Knitto · dalam 6 bulan',
    metricTrafficSurge: 'lonjakan traffic',
    metricViews: 'views artikel',
    metricRevenue: 'kenaikan revenue',
    workLabel: 'Karya pilihan',
    workTitle: 'Strategi yang<br /><span>berdampak ke angka.</span>',
    filterAll: 'Semua karya',
    filterSocial: 'Social media',
    badgePages: 'halaman<br />dipetakan',
    rrIndex: '01 / SEO · Strategi website',
    rrDescription: 'Mengelola strategi website dari nol — mulai dari research, sitemap, information architecture, landing-page copy, sampai analytics setup untuk perusahaan logistik yang sedang tumbuh di Singapura.',
    pagesMapped: 'halaman dipetakan',
    trackingTools: 'tools analytics disiapkan',
    caseDetails: 'Lihat detail case',
    objective: 'Tujuan',
    approach: 'Pendekatan',
    delivery: 'Yang dikerjakan',
    challenge: 'Tantangan',
    recovery: 'Hasil recovery',
    result: 'Hasil',
    role: 'Peran',
    background: 'Latar belakang',
    rrObjective: 'Membangun search visibility dan conversion dari nol untuk bisnis logistik yang sedang berkembang di Singapura.',
    rrApproach: 'Mengelola research, search-intent mapping, sitemap, information architecture, wireframe, content structure, dan arah SEO untuk 30+ halaman service dan company.',
    rrDelivery: 'Menulis page copy, metadata, dan rekomendasi content, lalu bekerja bareng tim design dan development agar kebutuhan UX, SEO, dan conversion tetap sejalan. Search Console, Analytics, dan Ahrefs juga disiapkan untuk tracking.',
    badgeTraffic: 'kenaikan<br />traffic',
    knittoIndex: '02 / SEO · Growth',
    knittoDescription: 'Menyusun dan menjalankan program on-page, off-page, dan technical SEO, didukung content system dan performance analysis agar search visibility benar-benar menghasilkan leads.',
    traffic: 'traffic',
    rankingBoost: 'kenaikan ranking',
    discoverFeatures: 'artikel di Discover',
    knittoChallenge: 'Google Core Update dan libur Lebaran yang panjang membuat traffic turun 14,79% dan impressions turun 30% pada Maret-April 2025.',
    knittoApproach: 'Mengaudit halaman yang turun lewat Search Console dan Semrush, me-refresh content sesuai intent terbaru dan prinsip E-E-A-T, membenahi technical dan mobile UX, memperkuat internal link, lalu menulis topik baru dari cluster yang sudah terbukti.',
    knittoRecovery: 'Pada Mei-Juni, traffic pulih 20,3% dan impressions naik 26% — keduanya berhasil melewati level sebelumnya.',
    flinIndex: '03 / SEO · Content authority',
    flinDescription: 'Menggabungkan artikel finansial, homepage copy yang conversion-minded, press release, dan backlink campaign untuk mendorong pertumbuhan platform debt management di Singapura dan Indonesia.',
    keywordGrowth: 'pertumbuhan keyword',
    contentPillars: 'content pillars',
    socialMedia: 'Social media',
    flinSeo: 'Membangun topical authority lewat artikel finansial, optimasi keyword di homepage, CTA soft-selling, artikel Medium, press release, dan paid backlink campaign.',
    flinSocial: 'Membawa strategi search ke Instagram lewat tiga pilar mingguan — entertainment, education, dan promotion — yang dibuat dekat dengan milenial dan Gen Z.',
    flinResult: 'Semrush mencatat lonjakan traffic 464,75% dan pertumbuhan keyword acquisition sebesar 58%.',
    badgeViews: 'views<br />artikel',
    idnIndex: '04 / SEO · Editorial',
    idnDescription: 'Menggabungkan keyword research berbasis tren dengan artikel listicle yang dekat dengan pembaca — dari lifestyle, travel, health, food, sampai tech — untuk konsisten masuk halaman pertama Google.',
    views: 'views',
    topKeywords: 'keyword di top 10',
    writingAwards: 'penghargaan menulis',
    idnObjective: 'Menaikkan views artikel dan masuk SERP top 10 untuk topik lifestyle, travel, health, food, dan technology.',
    idnApproach: 'Menggabungkan keyword research dengan sinyal dari Google Trends, X, TikTok, dan Instagram, lalu mengemas topik yang sedang naik dalam format listicle ber-CTR tinggi.',
    idnResult: 'Menghasilkan 500+ keyword di top 10, total 2M+ views, dan sepuluh penghargaan menulis dari komunitas.',
    badgeBriefs: 'brief<br />per bulan',
    linovIndex: '05 / SEO · Website revamp',
    linovDescription: 'Menggabungkan content planning berbasis SERP dan UX writing untuk revamp website besar, menjaga search visibility sambil membuat product messaging lebih jelas dan lebih fokus ke conversion.',
    monthlyBriefs: 'brief/bulan',
    monthlyReviews: 'content review/bulan',
    revampedPages: 'halaman di-revamp',
    contentSystem: 'Content system',
    websiteRevamp: 'Website revamp',
    collaboration: 'Kolaborasi',
    linovContent: 'Merencanakan cluster long-tail keyword, membuat 30+ brief tiap bulan, me-review 25+ artikel intern, dan menambahkan product-led CTA tanpa menghilangkan tone editorial yang berguna.',
    linovRevamp: 'Menulis copy yang user-friendly dan conversion-focused untuk 10+ halaman sambil tetap menjaga core keyword dan ranking yang sudah ada.',
    linovCollaboration: 'Bekerja bareng tim Product, Business Development, SEO, UI/UX, dan design, termasuk menerjemahkan website copy ke bahasa Inggris.',
    postViews: 'views<br />post',
    personalIndex: '06 / Social · Personal creator',
    personalTitle: 'Personal Content Lab',
    personalDescription: 'Ruang eksperimen sebagai creator: mulai dari membaca tren dan perilaku audiens, lalu lanjut ke scripting, filming, editing, publishing, sampai mengulik performanya.',
    postViewsInline: 'views post',
    profileViews: 'profile views',
    personalRole: 'Mengembangkan angle kreatif dari nol dan menangani produksi end-to-end: ideation, scripting, filming, editing, sampai publishing.',
    personalApproach: 'Menguji hook, format, dan alur cerita berdasarkan perilaku audiens, sambil tetap membuat sponsored brief terasa natural dengan suara creator sendiri.',
    engagement: 'Snapshot engagement',
    personalEngagement: 'Analytics di portfolio mencatat 2.176 komentar dan 5.463 shares, melengkapi 400K likes.',
    visitIndex: '07 / Social · Personal project',
    visitDescription: 'Membangun channel local discovery dari hulu ke hilir — strategy, production, publishing, dan brand partnership — lewat konten edukatif, entertaining, dan cerita lokal.',
    brandPartnerships: 'brand partnerships',
    visitObjective: 'Mengembangkan akun local discovery dari sisi followers, reach, impressions, engagement, sampai paid brand placement.',
    visitApproach: 'Membangun pilar educational, entertaining, dan branded content, lalu menangani proses lengkap dari ideation dan production sampai publishing dan client pitch.',
    partnerships: 'Partnerships',
    visitPartnerships: 'Mengamankan placement bersama Mustika Ratu Cianjur, BRI Cianjur, CrowdDana, dan PT Honda Prospect Motor.',
    followers: 'followers',
    isipiringkuIndex: '08 / Social · Edukasi gizi',
    isipiringkuDescription: 'Membantu membentuk content edukasi gizi Danone Indonesia agar tetap akurat secara ilmiah, relevan secara budaya, dan gampang dipraktikkan para orang tua.',
    accountFollowers: 'followers akun',
    digitalChannels: 'channel digital',
    danoneBrands: 'brand Danone',
    isipiringkuBackground: 'Danone Indonesia bersama Aqua, Nutricia, dan Sarihusada menjalankan program ini untuk meningkatkan literasi gizi dan membantu menekan stunting.',
    isipiringkuRole: 'Mengawal content planning dan development bersama agency, termasuk mengecek akurasi gizi dan sains sebelum content tayang.',
    isipiringkuApproach: 'Menghubungkan ide content dengan topik yang sedang ramai, lalu merapikan copy agar sesuai tone of voice brand dan terasa dekat dengan para ibu di Instagram dan YouTube.',
    badgeRevenue: 'kenaikan<br />revenue',
    truedetoxIndex: '09 / Social · Integrated campaign',
    truedetoxDescription: 'Membuat content lintas channel dari ide sampai publish, sambil menyelaraskan copy dan creative dengan tim brand, design, dan performance untuk mendorong acquisition.',
    revenueGrowth: 'kenaikan revenue',
    qualifiedLeads: 'kenaikan qualified leads',
    roasImprovement: 'peningkatan ROAS',
    truedetoxObjective: 'Mendorong awareness untuk program TrueDetox yang baru diluncurkan, lalu mengubah perhatian campaign menjadi qualified leads.',
    truedetoxApproach: 'Mengelola content dari ide sampai publication bersama tim brand strategy, design, dan performance marketing untuk landing page, feed, story, dan ads.',
    truedetoxResult: 'Berkontribusi pada kenaikan revenue 1.058%, pertumbuhan qualified leads 34,2%, dan peningkatan ROAS 75%.',
    brandsKicker: 'Kolaborasi brand',
    brandsTitle: 'Content bareng brand yang sudah akrab di keseharian.',
    brandsDescription: 'Pilihan kolaborasi creator dan content dari portfolio lengkap.',
    fullPortfolioPrompt: 'Mau lihat case study, visual, dan prosesnya lebih lengkap?',
    fullPortfolioCta: 'Buka portfolio lengkap',
    experienceLabel: 'Pengalaman',
    experienceTitle: 'Empat tahun<br /><em>membuat search bekerja.</em>',
    experienceIntro: 'Berpengalaman di manufacturing, HR tech, media, logistics, fintech, dan consumer brands.',
    experienceRr: 'Memimpin strategi website end-to-end untuk RR Express dan RR Machinery.',
    experienceKnitto: 'Mengelola content strategy, optimization, audit, dan performance reporting.',
    experienceLinov: 'Membangun content system sekaligus mengerjakan UX writing untuk revamp website utama.',
    experienceBerts: 'Mengembangkan content lintas channel dan menjalankan berbagai brand campaign.',
    capabilitiesLabel: 'Keahlian',
    capabilitiesList: 'On-page &amp; off-page SEO · Technical audit · Content strategy · SEO writing · Copywriting · Keyword research · Content marketing · Social media management · Analytics &amp; reporting · Design &amp; video editing · On-camera talent',
    recognitionLabel: 'Apresiasi &amp; pendidikan',
    recognitionTitle: 'Kerja bagus<br />layak <span>diperhatikan.</span>',
    awardIdnTitle: '10× penghargaan menulis dari IDN Times',
    awardIdnDescription: 'Best Writer, Best Article, Most Viral Article, Most Active Writer, dan Community Writer of the Month.',
    awardSeoTitle: 'Juara SEO Group Project',
    awardSeoDescription: 'RevoU Full Stack Digital Marketing — nilai 96/100.',
    awardAdsTitle: 'Juara 2 Google Ads Mini Competition',
    awardAdsDescription: 'Dipilih sebagai project manager untuk tim berisi lima orang.',
    educationRevou: 'Full Stack Digital Marketing · Nilai 96/100',
    educationMsu: 'International Medical School · Malaysia',
    educationUnair: 'Ilmu Gizi · IPK 3,55/4,00',
    contactEyebrow: 'Ada project yang bisa kita kerjakan bareng?',
    contactTitle: 'Yuk, bikin<br /><em>impact bareng.</em>',
    phone: 'Telepon',
    backToTop: 'Kembali ke atas ↑'
  }
};

const pageMetadata = {
  en: {
    title: 'Nadhifa Arnesya — SEO Specialist & Content Strategist',
    description: 'Portfolio of Nadhifa Aulia Arnesya — SEO Specialist and Content Strategist helping brands grow through search, content, and data.',
    switchLabel: 'Switch to Indonesian'
  },
  id: {
    title: 'Nadhifa Arnesya — SEO Specialist & Content Strategist',
    description: 'Portfolio Nadhifa Aulia Arnesya — SEO Specialist dan Content Strategist yang membantu brand tumbuh lewat search, content, dan data.',
    switchLabel: 'Ganti ke bahasa Inggris'
  }
};

let currentLanguage = 'en';

function setLanguage(language, persist = false) {
  currentLanguage = language === 'id' ? 'id' : 'en';
  const copy = translations[currentLanguage];

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const translated = copy[element.dataset.i18n];
    if (translated) element.innerHTML = translated;
  });

  document.documentElement.lang = currentLanguage;
  document.title = pageMetadata[currentLanguage].title;
  descriptionMeta.setAttribute('content', pageMetadata[currentLanguage].description);
  languageToggle.setAttribute('aria-label', pageMetadata[currentLanguage].switchLabel);
  languageToggle.querySelectorAll('[data-lang-option]').forEach((option) => {
    option.classList.toggle('active', option.dataset.langOption === currentLanguage);
  });

  if (persist) {
    try {
      localStorage.setItem('portfolio-language', currentLanguage);
    } catch (_) {
      // The language still switches if storage is unavailable.
    }
  }
}

let savedLanguage;
try {
  savedLanguage = localStorage.getItem('portfolio-language');
} catch (_) {
  savedLanguage = null;
}

const browserLanguage = navigator.language.toLowerCase().startsWith('id') ? 'id' : 'en';
setLanguage(savedLanguage || browserLanguage);

languageToggle.addEventListener('click', () => {
  setLanguage(currentLanguage === 'en' ? 'id' : 'en', true);
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    projects.forEach((project) => {
      project.hidden = selected !== 'all' && project.dataset.category !== selected;
    });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

// Native dialog traps focus, supports Escape, and keeps the source image intact.
const viewer = document.getElementById('asset-viewer');
const viewerImage = document.getElementById('viewer-image');
let viewerTrigger;
document.querySelectorAll('.asset-open').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !viewer.showModal) return;
    event.preventDefault();
    viewerTrigger = link;
    viewerImage.src = link.href;
    viewerImage.alt = link.querySelector('img').alt;
    document.getElementById('viewer-caption').textContent = link.closest('figure').querySelector('[data-i18n]').textContent;
    document.getElementById('viewer-original').href = link.href;
    viewer.showModal();
    document.body.classList.add('viewing-asset');
  });
});
viewer.addEventListener('click', (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewing-asset');
  viewerImage.removeAttribute('src');
  viewerTrigger?.focus({ preventScroll: true });
});
