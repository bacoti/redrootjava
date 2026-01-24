/* ============================================
   RED ROOT JAVA - INTERNATIONALIZATION (i18n)
   Language Switcher: Indonesian (ID) & English (EN)
   ============================================ */

const I18n = (() => {
  'use strict';

  // ============================================
  // TRANSLATION DICTIONARY
  // ============================================
  const translations = {
    id: {
      // Navigation
      'nav.home': 'Beranda',
      'nav.problem': 'Mengapa Penting',
      'nav.solution': 'Solusi Kami',
      'nav.products': 'Produk',
      'nav.benefits': 'Manfaat',
      'nav.reviews': 'Ulasan',
      'nav.order': 'Pesan Sekarang',

      // Hero Section
      'hero.badge': 'Peringatan Kesehatan',
      'hero.title1': 'Seberapa Sering Kamu',
      'hero.title2': 'Sakit Bulan Ini?',
      'hero.subtitle': 'Tubuh yang lemah bukan kebetulan — itu peringatan. Sistem imun kamu sedang meminta tolong, dan mengabaikannya bisa lebih mahal dari sekadar hari sakit.',
      'hero.cta1': 'Lindungi Tubuhku Sekarang',
      'hero.cta2': 'Pelajari Lebih Lanjut',
      'hero.stat1': 'Pelanggan Puas',
      'hero.stat2': '% Alami',
      'hero.stat3': 'Tahun Dipercaya',
      'hero.product': 'Bubuk Jahe Premium',
      'hero.certified': 'Tersertifikasi',
      'hero.organic': '100% Organik',
      'hero.rating': 'Rating',

      // Problem Section
      'problem.subtitle': 'Bahaya Tersembunyi',
      'problem.title': 'Tubuhmu Sedang Mengirim<br>Tanda Peringatan',
      'problem.desc': 'Setiap hari, jutaan orang mengabaikan gejala ini. Jangan tunggu sampai terlambat.',
      'problem.card1.title': 'Kelelahan Terus-Menerus',
      'problem.card1.text': 'Merasa lelah meski sudah tidur 8 jam? Tubuhmu sedang berjuang melawan racun dan stres harian.',
      'problem.card2.title': 'Sering Sakit',
      'problem.card2.text': 'Sakit setiap bulan? Sistem imun yang lemah membuatmu rentan terhadap infeksi dan penyakit.',
      'problem.card3.title': 'Ketergantungan Obat Kimia',
      'problem.card3.text': 'Bergantung pada obat sintetis? Penggunaan jangka panjang bisa merusak hati dan menimbulkan efek samping berbahaya.',
      'problem.warning': 'Tahukah kamu? 70% sistem imun ada di usus. Apa yang kamu konsumsi langsung mempengaruhi kesehatanmu.',

      // Solution Section
      'solution.image': 'Kekuatan Penyembuhan Alam',
      'solution.badge': '100% Alami',
      'solution.subtitle': 'Jawaban Alami',
      'solution.title': 'Memperkenalkan Red Root Java<br>Bubuk Jahe Premium',
      'solution.text': 'Selama berabad-abad, jahe Indonesia telah menjadi rahasia umur panjang dan vitalitas. Kami mengemas kearifan kuno ini menjadi solusi modern dan praktis yang memperkuat sistem imun secara alami.',
      'solution.feature1.title': 'Jahe Merah Premium',
      'solution.feature1.text': 'Bersumber dari dataran tinggi vulkanik Jawa, Indonesia',
      'solution.feature2.title': 'Tanpa Pengawet',
      'solution.feature2.text': 'Tanpa bahan kimia buatan, pewarna, atau zat aditif berbahaya',
      'solution.feature3.title': 'Proses Tradisional',
      'solution.feature3.text': 'Dijemur dan digiling menggunakan metode turun-temurun',
      'solution.feature4.title': 'Terbukti Ilmiah',
      'solution.feature4.text': 'Didukung penelitian tentang manfaat anti-inflamasi jahe',

      // Products Section
      'products.subtitle': 'Produk Kami',
      'products.title': 'Pilih Rasa Favoritmu',
      'products.desc': 'Tiga varian lezat, semuanya dengan manfaat penguat imun yang sama kuatnya.',
      'products.order': 'Pesan Sekarang',
      'products.original.image': 'Jahe Merah Original',
      'products.original.badge': 'Terlaris',
      'products.original.name': 'Original',
      'products.original.variant': 'Bubuk Jahe Merah Murni',
      'products.original.feat1': 'Tanpa Gula',
      'products.original.feat2': 'Khasiat Maksimal',
      'products.coconut.image': 'Perpaduan Kelapa Pandan',
      'products.coconut.badge': 'Rasa Baru',
      'products.coconut.name': 'Kelapa Pandan',
      'products.coconut.variant': 'Perpaduan Tropis Creamy',
      'products.coconut.feat1': 'Rasa Creamy',
      'products.coconut.feat2': 'Aromatik',
      'products.mango.image': 'Mangga Menyegarkan',
      'products.mango.badge': 'Populer',
      'products.mango.name': 'Mangga',
      'products.mango.variant': 'Manis & Menyegarkan',
      'products.mango.feat1': 'Segar Buah',
      'products.mango.feat2': 'Kaya Vitamin',

      // Benefits Section
      'benefits.subtitle': 'Manfaat Kesehatan',
      'benefits.title': 'Apa yang Red Root Java Lakukan<br>Untuk Tubuhmu',
      'benefits.desc': 'Rasakan kekuatan transformatif jahe alami untuk kesehatan dan kesejahteraan menyeluruh.',
      'benefits.card1.title': 'Meningkatkan Imunitas',
      'benefits.card1.text': 'Memperkuat pertahanan alami melawan infeksi dan penyakit.',
      'benefits.card2.title': 'Mengurangi Peradangan',
      'benefits.card2.text': 'Senyawa anti-inflamasi kuat meredakan nyeri sendi dan otot.',
      'benefits.card3.title': 'Memperbaiki Pencernaan',
      'benefits.card3.text': 'Mendukung fungsi usus sehat dan meredakan kembung serta mual.',
      'benefits.card4.title': 'Meningkatkan Energi',
      'benefits.card4.text': 'Senyawa alami meningkatkan metabolisme dan melawan kelelahan kronis.',

      // Testimonials Section
      'testimonials.subtitle': 'Ulasan Pelanggan',
      'testimonials.title': 'Dipercaya Ribuan<br>Pelanggan Puas',
      'testimonials.desc': 'Kisah nyata dari orang-orang yang mengubah kesehatannya dengan Red Root Java.',
      'testimonials.review1.text': '"Dulu saya sakit setiap bulan. Setelah minum Red Root Java selama 3 bulan, saya belum pernah flu lagi! Energi saya luar biasa meningkat."',
      'testimonials.review1.role': 'Karyawan Kantoran, Jakarta',
      'testimonials.review2.text': '"Sebagai ibu 3 anak, saya butuh semua energi yang bisa saya dapatkan. Bubuk jahe ini sudah jadi ritual pagi saya. Seluruh keluarga minum dan kami tidak pernah merasa lebih baik!"',
      'testimonials.review2.role': 'Ibu & Pengusaha, Bandung',
      'testimonials.review3.text': '"Awalnya saya skeptis, tapi hasilnya berbicara sendiri. Nyeri sendi saya berkurang drastis dan saya merasa 10 tahun lebih muda. Sangat direkomendasikan!"',
      'testimonials.review3.role': 'Pensiunan, Surabaya',

      // How to Use Section
      'howtouse.subtitle': 'Cara Penyajian',
      'howtouse.title': 'Mudah & Praktis<br>Dalam 3 Langkah',
      'howtouse.desc': 'Nikmati Red Root Java kapan saja, di mana saja. Cukup 3 langkah sederhana untuk hidup lebih sehat.',
      'howtouse.step1.title': 'Ambil 1-2 Sendok',
      'howtouse.step1.text': 'Masukkan 1-2 sendok teh bubuk jahe ke dalam gelas atau cangkir favoritmu.',
      'howtouse.step2.title': 'Tuang Air Panas',
      'howtouse.step2.text': 'Tambahkan 150-200ml air panas (tidak mendidih) untuk menjaga kandungan nutrisi.',
      'howtouse.step3.title': 'Aduk & Nikmati',
      'howtouse.step3.text': 'Aduk rata dan nikmati hangatnya. Minum 1-2 kali sehari untuk hasil optimal.',
      'howtouse.tips.title': 'Tips Pro',
      'howtouse.tips.text': 'Tambahkan madu atau lemon untuk rasa yang lebih nikmat. Bisa juga dicampur dengan susu hangat untuk minuman yang lebih creamy!',

      // FAQ Section
      'faq.subtitle': 'FAQ',
      'faq.title': 'Pertanyaan yang<br>Sering Ditanyakan',
      'faq.desc': 'Temukan jawaban untuk pertanyaan umum tentang produk Red Root Java.',
      'faq.q1': 'Apakah Red Root Java aman dikonsumsi setiap hari?',
      'faq.a1': 'Ya, Red Root Java 100% terbuat dari jahe merah alami tanpa bahan kimia berbahaya. Aman dikonsumsi 1-2 kali sehari. Namun, untuk ibu hamil, menyusui, atau yang memiliki kondisi medis tertentu, disarankan konsultasi dengan dokter terlebih dahulu.',
      'faq.q2': 'Berapa lama sampai saya merasakan manfaatnya?',
      'faq.a2': 'Kebanyakan pelanggan merasakan peningkatan energi dalam 1-2 minggu pertama. Untuk manfaat optimal seperti peningkatan imunitas, disarankan konsumsi rutin selama minimal 1-3 bulan.',
      'faq.q3': 'Apakah produk ini sudah tersertifikasi BPOM?',
      'faq.a3': 'Ya, semua produk Red Root Java sudah terdaftar dan tersertifikasi BPOM RI. Kami berkomitmen untuk menyediakan produk yang aman dan berkualitas tinggi untuk keluarga Indonesia.',
      'faq.q4': 'Bagaimana cara penyimpanan yang benar?',
      'faq.a4': 'Simpan di tempat kering dan sejuk, hindari paparan sinar matahari langsung. Setelah dibuka, tutup rapat dan gunakan dalam waktu 3 bulan untuk kualitas terbaik. Tidak perlu disimpan di kulkas.',
      'faq.q5': 'Apakah ada garansi uang kembali?',
      'faq.a5': 'Ya! Kami memberikan garansi 30 hari uang kembali. Jika Anda tidak puas dengan produk kami, hubungi customer service kami dan kami akan memproses pengembalian dana Anda.',

      // Floating Buttons
      'float.whatsapp': 'Chat WhatsApp',
      'float.backtop': 'Kembali ke Atas',

      // Navigation
      'nav.faq': 'FAQ',

      // Comparison Table
      'comparison.subtitle': 'Perbandingan Produk',
      'comparison.title': 'Bandingkan Varian Kami',
      'comparison.desc': 'Pilih varian yang paling sesuai dengan selera dan kebutuhan Anda.',
      'comparison.feature': 'Fitur',
      'comparison.original': 'Original',
      'comparison.coconut': 'Kelapa Pandan',
      'comparison.mango': 'Mangga',
      'comparison.row1': 'Kandungan Jahe Merah',
      'comparison.row2': 'Tanpa Gula Tambahan',
      'comparison.row3': 'Rasa Manis Alami',
      'comparison.row4': 'Cocok untuk Diet',
      'comparison.row5': 'Khasiat Anti-Inflamasi',
      'comparison.row6': 'Boost Imunitas',
      'comparison.row7': 'Rasa Creamy',
      'comparison.row8': 'Vitamin Tambahan',
      'comparison.row9': 'Tersertifikasi BPOM',
      'comparison.order': 'Pesan',
      'comparison.scrollHint': 'Geser untuk melihat semua kolom',

      // Cookie Consent
      'cookie.title': 'Kami Menggunakan Cookies',
      'cookie.text': 'Website ini menggunakan cookies untuk meningkatkan pengalaman Anda. Dengan melanjutkan, Anda menyetujui penggunaan cookies.',
      'cookie.accept': 'Terima',
      'cookie.decline': 'Tolak',

      // CTA Section
      'cta.title': 'Jangan Tunggu Sampai Tubuhmu<br>Memberi Peringatan Terakhir',
      'cta.text': 'Ambil kendali kesehatanmu hari ini. Bergabunglah dengan ribuan orang Indonesia yang telah menemukan cara alami menuju hidup lebih kuat dan sehat.',
      'cta.whatsapp': 'Pesan via WhatsApp',
      'cta.viewproducts': 'Lihat Semua Produk',
      'cta.trust1': 'Gratis Ongkir',
      'cta.trust2': 'Garansi Uang Kembali',
      'cta.trust3': 'Pembayaran Aman',
      'cta.trust4': 'Tersertifikasi BPOM',

      // Footer
      'footer.desc': 'Bubuk jahe alami premium dari jantung Indonesia. Memberdayakan keluarga untuk hidup lebih sehat dan kuat sejak 2020.',
      'footer.quicklinks': 'Tautan Cepat',
      'footer.link.home': 'Beranda',
      'footer.link.products': 'Produk',
      'footer.link.benefits': 'Manfaat',
      'footer.link.reviews': 'Ulasan',
      'footer.link.order': 'Pesan Sekarang',
      'footer.products': 'Produk',
      'footer.product.original': 'Jahe Merah Original',
      'footer.product.coconut': 'Kelapa Pandan',
      'footer.product.mango': 'Rasa Mangga',
      'footer.product.gift': 'Paket Hadiah',
      'footer.product.wholesale': 'Grosir',
      'footer.contact': 'Hubungi Kami',
      'footer.copyright': '© 2026 Red Root Java. Hak cipta dilindungi.',
      'footer.privacy': 'Kebijakan Privasi',
      'footer.terms': 'Syarat Layanan',
      'footer.refund': 'Kebijakan Pengembalian'
    },

    en: {
      // Navigation
      'nav.home': 'Home',
      'nav.problem': 'Why It Matters',
      'nav.solution': 'Our Solution',
      'nav.products': 'Products',
      'nav.benefits': 'Benefits',
      'nav.reviews': 'Reviews',
      'nav.order': 'Order Now',

      // Hero Section
      'hero.badge': 'Health Alert',
      'hero.title1': 'How Often Do You Get',
      'hero.title2': 'Sick This Month?',
      'hero.subtitle': 'A weak body is not a coincidence — it\'s a warning. Your immune system is crying for help, and ignoring it could cost you more than just sick days.',
      'hero.cta1': 'Protect My Body Now',
      'hero.cta2': 'Learn More',
      'hero.stat1': 'Happy Customers',
      'hero.stat2': '% Natural',
      'hero.stat3': 'Years Trusted',
      'hero.product': 'Premium Ginger Powder',
      'hero.certified': 'Certified',
      'hero.organic': '100% Organic',
      'hero.rating': 'Rating',

      // Problem Section
      'problem.subtitle': 'The Hidden Danger',
      'problem.title': 'Your Body Is Sending You<br>Warning Signs',
      'problem.desc': 'Every day, millions of people ignore these symptoms. Don\'t wait until it\'s too late.',
      'problem.card1.title': 'Constant Fatigue',
      'problem.card1.text': 'Feeling tired even after 8 hours of sleep? Your body is struggling to keep up with daily toxins and stress.',
      'problem.card2.title': 'Frequent Illness',
      'problem.card2.text': 'Getting sick every month? A weakened immune system leaves you vulnerable to infections and diseases.',
      'problem.card3.title': 'Chemical Dependency',
      'problem.card3.text': 'Relying on synthetic medicines? Long-term use can damage your liver and create dangerous side effects.',
      'problem.warning': 'Did you know? 70% of your immune system is in your gut. What you consume directly affects your health.',

      // Solution Section
      'solution.image': 'Nature\'s Healing Power',
      'solution.badge': '100% Natural',
      'solution.subtitle': 'The Natural Answer',
      'solution.title': 'Introducing Red Root Java<br>Premium Ginger Powder',
      'solution.text': 'For centuries, Indonesian ginger has been the secret to longevity and vitality. We\'ve harnessed this ancient wisdom into a modern, convenient solution that strengthens your immune system naturally.',
      'solution.feature1.title': 'Premium Red Ginger',
      'solution.feature1.text': 'Sourced from the volcanic highlands of Java, Indonesia',
      'solution.feature2.title': 'Zero Preservatives',
      'solution.feature2.text': 'No artificial chemicals, colors, or harmful additives',
      'solution.feature3.title': 'Traditional Process',
      'solution.feature3.text': 'Sun-dried and ground using time-honored methods',
      'solution.feature4.title': 'Scientifically Proven',
      'solution.feature4.text': 'Backed by research on ginger\'s anti-inflammatory benefits',

      // Products Section
      'products.subtitle': 'Our Products',
      'products.title': 'Choose Your Favorite Flavor',
      'products.desc': 'Three delicious variants, all with the same powerful immune-boosting benefits.',
      'products.order': 'Order Now',
      'products.original.image': 'Original Red Ginger',
      'products.original.badge': 'Best Seller',
      'products.original.name': 'Original',
      'products.original.variant': 'Pure Red Ginger Powder',
      'products.original.feat1': 'No Sugar',
      'products.original.feat2': 'Maximum Potency',
      'products.coconut.image': 'Coconut Pandan Blend',
      'products.coconut.badge': 'New Flavor',
      'products.coconut.name': 'Coconut Pandan',
      'products.coconut.variant': 'Tropical Creamy Blend',
      'products.coconut.feat1': 'Creamy Taste',
      'products.coconut.feat2': 'Aromatic',
      'products.mango.image': 'Refreshing Mango',
      'products.mango.badge': 'Popular',
      'products.mango.name': 'Mango',
      'products.mango.variant': 'Sweet & Refreshing',
      'products.mango.feat1': 'Fruity Fresh',
      'products.mango.feat2': 'Vitamin Rich',

      // Benefits Section
      'benefits.subtitle': 'Health Benefits',
      'benefits.title': 'What Red Root Java Does<br>For Your Body',
      'benefits.desc': 'Experience the transformative power of natural ginger for your overall health and wellbeing.',
      'benefits.card1.title': 'Boosts Immunity',
      'benefits.card1.text': 'Strengthens your natural defenses against infections and diseases.',
      'benefits.card2.title': 'Reduces Inflammation',
      'benefits.card2.text': 'Powerful anti-inflammatory compounds soothe joint pain and muscle aches.',
      'benefits.card3.title': 'Improves Digestion',
      'benefits.card3.text': 'Promotes healthy gut function and relieves bloating and nausea.',
      'benefits.card4.title': 'Increases Energy',
      'benefits.card4.text': 'Natural compounds boost metabolism and fight chronic fatigue.',

      // Testimonials Section
      'testimonials.subtitle': 'Customer Reviews',
      'testimonials.title': 'Trusted by Thousands<br>of Happy Customers',
      'testimonials.desc': 'Real stories from real people who transformed their health with Red Root Java.',
      'testimonials.review1.text': '"I used to get sick every month. After drinking Red Root Java for 3 months, I haven\'t had a single cold! My energy levels are through the roof."',
      'testimonials.review1.role': 'Office Worker, Jakarta',
      'testimonials.review2.text': '"As a mother of 3, I need all the energy I can get. This ginger powder is my morning ritual now. My whole family drinks it and we\'ve never felt better!"',
      'testimonials.review2.role': 'Mother & Entrepreneur, Bandung',
      'testimonials.review3.text': '"I was skeptical at first, but the results speak for themselves. My joint pain has reduced significantly and I feel 10 years younger. Highly recommend!"',
      'testimonials.review3.role': 'Retiree, Surabaya',

      // How to Use Section
      'howtouse.subtitle': 'How to Serve',
      'howtouse.title': 'Easy & Practical<br>In 3 Steps',
      'howtouse.desc': 'Enjoy Red Root Java anytime, anywhere. Just 3 simple steps to a healthier life.',
      'howtouse.step1.title': 'Take 1-2 Spoons',
      'howtouse.step1.text': 'Put 1-2 teaspoons of ginger powder into your favorite glass or cup.',
      'howtouse.step2.title': 'Pour Hot Water',
      'howtouse.step2.text': 'Add 150-200ml of hot water (not boiling) to preserve the nutrients.',
      'howtouse.step3.title': 'Stir & Enjoy',
      'howtouse.step3.text': 'Stir well and enjoy the warmth. Drink 1-2 times daily for optimal results.',
      'howtouse.tips.title': 'Pro Tips',
      'howtouse.tips.text': 'Add honey or lemon for a better taste. You can also mix it with warm milk for a creamier drink!',

      // FAQ Section
      'faq.subtitle': 'FAQ',
      'faq.title': 'Frequently Asked<br>Questions',
      'faq.desc': 'Find answers to common questions about Red Root Java products.',
      'faq.q1': 'Is Red Root Java safe for daily consumption?',
      'faq.a1': 'Yes, Red Root Java is 100% made from natural red ginger without harmful chemicals. Safe to consume 1-2 times daily. However, for pregnant women, breastfeeding mothers, or those with certain medical conditions, please consult your doctor first.',
      'faq.q2': 'How long until I feel the benefits?',
      'faq.a2': 'Most customers feel an energy boost within the first 1-2 weeks. For optimal benefits like improved immunity, we recommend regular consumption for at least 1-3 months.',
      'faq.q3': 'Is this product BPOM certified?',
      'faq.a3': 'Yes, all Red Root Java products are registered and certified by BPOM RI. We are committed to providing safe and high-quality products for Indonesian families.',
      'faq.q4': 'How should I store it properly?',
      'faq.a4': 'Store in a dry and cool place, avoid direct sunlight exposure. After opening, seal tightly and use within 3 months for best quality. No need to refrigerate.',
      'faq.q5': 'Is there a money-back guarantee?',
      'faq.a5': 'Yes! We offer a 30-day money-back guarantee. If you are not satisfied with our product, contact our customer service and we will process your refund.',

      // Floating Buttons
      'float.whatsapp': 'Chat WhatsApp',
      'float.backtop': 'Back to Top',

      // Navigation
      'nav.faq': 'FAQ',

      // Comparison Table
      'comparison.subtitle': 'Product Comparison',
      'comparison.title': 'Compare Our Variants',
      'comparison.desc': 'Choose the variant that best suits your taste and needs.',
      'comparison.feature': 'Feature',
      'comparison.original': 'Original',
      'comparison.coconut': 'Coconut Pandan',
      'comparison.mango': 'Mango',
      'comparison.row1': 'Red Ginger Content',
      'comparison.row2': 'No Added Sugar',
      'comparison.row3': 'Natural Sweetness',
      'comparison.row4': 'Diet Friendly',
      'comparison.row5': 'Anti-Inflammatory',
      'comparison.row6': 'Immunity Boost',
      'comparison.row7': 'Creamy Taste',
      'comparison.row8': 'Added Vitamins',
      'comparison.row9': 'BPOM Certified',
      'comparison.order': 'Order',
      'comparison.scrollHint': 'Swipe to see all columns',

      // Cookie Consent
      'cookie.title': 'We Use Cookies',
      'cookie.text': 'This website uses cookies to enhance your experience. By continuing, you agree to our use of cookies.',
      'cookie.accept': 'Accept',
      'cookie.decline': 'Decline',

      // CTA Section
      'cta.title': 'Don\'t Wait Until Your Body<br>Gives You a Final Warning',
      'cta.text': 'Take control of your health today. Join thousands of Indonesians who have discovered the natural way to a stronger, healthier life.',
      'cta.whatsapp': 'Order via WhatsApp',
      'cta.viewproducts': 'View All Products',
      'cta.trust1': 'Free Shipping',
      'cta.trust2': 'Money-Back Guarantee',
      'cta.trust3': 'Secure Payment',
      'cta.trust4': 'BPOM Certified',

      // Footer
      'footer.desc': 'Premium natural ginger powder from the heart of Indonesia. Empowering families to live healthier, stronger lives since 2020.',
      'footer.quicklinks': 'Quick Links',
      'footer.link.home': 'Home',
      'footer.link.products': 'Products',
      'footer.link.benefits': 'Benefits',
      'footer.link.reviews': 'Reviews',
      'footer.link.order': 'Order Now',
      'footer.products': 'Products',
      'footer.product.original': 'Original Red Ginger',
      'footer.product.coconut': 'Coconut Pandan',
      'footer.product.mango': 'Mango Flavor',
      'footer.product.gift': 'Gift Packages',
      'footer.product.wholesale': 'Wholesale',
      'footer.contact': 'Contact Us',
      'footer.copyright': '© 2026 Red Root Java. All rights reserved.',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Service',
      'footer.refund': 'Refund Policy'
    }
  };

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    defaultLang: 'id',
    storageKey: 'rrj_language',
    supportedLangs: ['id', 'en']
  };

  // ============================================
  // STATE
  // ============================================
  let currentLang = CONFIG.defaultLang;

  // ============================================
  // CORE FUNCTIONS
  // ============================================

  /**
   * Get translation by key
   */
  const t = (key) => {
    return translations[currentLang]?.[key] || translations[CONFIG.defaultLang]?.[key] || key;
  };

  /**
   * Get saved language from localStorage
   */
  const getSavedLanguage = () => {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved && CONFIG.supportedLangs.includes(saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('localStorage not available');
    }
    return CONFIG.defaultLang;
  };

  /**
   * Save language to localStorage
   */
  const saveLanguage = (lang) => {
    try {
      localStorage.setItem(CONFIG.storageKey, lang);
    } catch (e) {
      console.warn('Could not save language preference');
    }
  };

  /**
   * Update all translatable elements
   */
  const updateContent = () => {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = t(key);

      // Use innerHTML for keys containing <br> tags
      if (translation.includes('<br>')) {
        el.innerHTML = translation;
      } else {
        el.textContent = translation;
      }
    });

    // Update html lang attribute
    document.documentElement.lang = currentLang;
  };

  /**
   * Update switcher UI
   */
  const updateSwitcherUI = () => {
    const buttons = document.querySelectorAll('.lang-switcher__btn');

    buttons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      const isActive = lang === currentLang;

      btn.classList.toggle('lang-switcher__btn--active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });
  };

  /**
   * Switch language
   */
  const switchLanguage = (lang) => {
    if (!CONFIG.supportedLangs.includes(lang) || lang === currentLang) {
      return;
    }

    currentLang = lang;
    saveLanguage(lang);
    updateContent();
    updateSwitcherUI();

    // Dispatch custom event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

    console.log(`🌐 Language switched to: ${lang === 'id' ? 'Bahasa Indonesia' : 'English'}`);
  };

  /**
   * Get current language
   */
  const getCurrentLang = () => currentLang;

  /**
   * Bind event listeners
   */
  const bindEvents = () => {
    const buttons = document.querySelectorAll('.lang-switcher__btn');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });

    // Keyboard navigation
    const switcher = document.querySelector('.lang-switcher');
    if (switcher) {
      switcher.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
          e.preventDefault();
          const newLang = currentLang === 'id' ? 'en' : 'id';
          switchLanguage(newLang);

          // Focus the new active button
          const activeBtn = document.querySelector(`.lang-switcher__btn[data-lang="${newLang}"]`);
          if (activeBtn) activeBtn.focus();
        }
      });
    }
  };

  /**
   * Initialize i18n
   */
  const init = () => {
    // Get saved or default language
    currentLang = getSavedLanguage();

    // Update content and UI
    updateContent();
    updateSwitcherUI();

    // Bind events
    bindEvents();

    console.log(`🌐 i18n initialized with language: ${currentLang === 'id' ? 'Bahasa Indonesia' : 'English'}`);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================
  // PUBLIC API
  // ============================================
  return {
    t,
    switchLanguage,
    getCurrentLang,
    translations
  };
})();
