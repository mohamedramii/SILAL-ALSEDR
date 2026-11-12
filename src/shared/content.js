// Thilal Al Sidr (ظلال السدر) — every fact the designs may use, in Arabic and English.
// Sources (9 Nov 2026): the Company Profile PDF (research/brand/thilal-al-sidr.pdf, wording kept as written),
// instagram.com/thilal_alsidr (bio, highlights, reel captions), linktr.ee/thilal_alsidr (store, WhatsApp, email,
// TikTok, catalogue). Nothing here is invented: no numbers, results, prices or testimonials beyond what the brand shows.
// Design-specific wording belongs in src/vN/copy.js and follows the same rule.

export const BRAND = {
  nameAr: 'ظلال السدر',
  nameEn: 'Thilal Al Sidr',
  handle: '@thilal_alsidr',
  owner: { ar: 'بدر السعيدي', en: 'Badar Al Saidi' },
  company: 'BADAR ALSAIDI TRADING',
  since: 2020,
  // from the logo: the big leaf and the outer ring, the small leaf, the inner ring and the wordmark
  dark: '#5A7848',
  light: '#93BC59',
};

export const LINKS = {
  whatsapp: 'https://wa.me/96877151582',
  phone: 'tel:+96877151582',
  phoneText: '+968 77151582',
  email: 'mailto:info@sedraom.com',
  emailText: 'info@sedraom.com',
  store: 'https://sedraom.com/Category/208713/products',
  profile: 'https://drive.google.com/file/d/16P3GR113aRM5BZnVQUnZF6T6Nuzg8fn9/view',
  catalogue: 'https://drive.google.com/file/d/1fw_K-y0jB1wli97WB321YpPEOQUfCpUT/view',
  instagram: 'https://www.instagram.com/thilal_alsidr/',
  tiktok: 'https://www.tiktok.com/@thilal_alsidr',
  linktree: 'https://linktr.ee/thilal_alsidr',
};

export const COUNTRIES = { ar: ['سلطنة عُمان', 'الإمارات', 'قطر'], en: ['Oman', 'UAE', 'Qatar'] };

// Real numbers the brand states itself (profile + Instagram bio). Use only these.
export const FACTS = [
  { value: 70, plus: true, ar: 'صنفًا موثقًا من السدر من حول العالم', en: 'documented Sidr varieties from around the world' },
  { value: 50, plus: true, ar: 'صنفًا من البيذام (اللوز)', en: 'almond (bitham) varieties' },
  { value: 2020, plus: false, ar: 'خبرة ميدانية موثقة منذ', en: 'documented field experience since' },
  { value: 3, plus: false, ar: 'دول خليجية: عُمان، الإمارات، قطر', en: 'Gulf countries: Oman, UAE, Qatar' },
];

// Public reels on the account (newest first). Media files: assets/instagram/raw/<id>.mp4 (+ <id>.json).
export const REELS = [
  { id: 'DfKiwSPB854', date: '2026-10-31' },
  { id: 'DeE_S50pT_k', date: '2026-10-04' },
  { id: 'Dd6x46AJjoB', date: '2026-09-30' },
  { id: 'DdO9ZiOt5uO', date: '2026-09-13', caption: 'هالصنف لو امدحه ليل نهار ما بوفي حقه' },
  { id: 'DdCEmV9NwQR', date: '2026-09-08', caption: 'اول مره فحياتي اشوف نبق حجمه تفاحي ولونه احمر' },
  { id: 'DcQqXgOtnpX', date: '2026-08-20' },
  { id: 'DYcco7etiDD', date: '2026-05-17' },
  { id: 'DXG-PkFDaKA', date: '2026-04-14' },
  { id: 'DUiDxsPDbKk', date: '2026-02-09' },
  { id: 'DTDjQsWjc04', date: '2026-01-03' },
].map((r) => ({ ...r, url: `https://www.instagram.com/thilal_alsidr/reel/${r.id}/` }));
export const POSTS = [{ id: 'DdhDZxXt-LJ', date: '2026-09-20', caption: 'اللي ما جرب هالصنف كأنه ما اكل نبق', url: 'https://www.instagram.com/thilal_alsidr/p/DdhDZxXt-LJ/' }];

// Instagram highlights (their story topics)
export const HIGHLIGHTS = {
  ar: ['شتلات', 'تطعيم اللوز', 'تطعيم السدر', 'تطعيم المانجو', 'إدارة المزارع', 'قطر', 'من نحن', 'منتجات العناية', 'لماذا السدر', 'في الإعلام'],
  en: ['Seedlings', 'Almond grafting', 'Sidr grafting', 'Mango grafting', 'Farm management', 'Qatar', 'About us', 'Care products', 'Why Sidr', 'In the media'],
};

export const content = {
  ar: {
    dir: 'rtl',
    meta: {
      title: 'ظلال السدر | مستقبل السدر في عُمان والخليج',
      description: 'ظلال السدر علامة تجارية عُمانية متخصصة في تطوير شجرة السدر منذ عام 2020: تطعيم، شتلات منتخبة لأكثر من 70 صنفًا، تشجير، إدارة مزارع، ثمار فاخرة، منتجات عناية وغذائية، وورش وتجارب.',
    },
    nav: { about: 'من نحن', services: 'خدماتنا', varieties: 'الأصناف', why: 'لماذا ظلال السدر', founder: 'المؤسس', contact: 'تواصل معنا', store: 'المتجر' },
    langSwitch: 'English',
    // as written on the profile
    tagline: 'من السدر العُماني... تبدأ الحكاية',
    taglineEnd: 'رحلة السدر... ما زالت في بدايتها',
    linktree: 'مستقبل السدر في عُمان والخليج',
    brandBy: 'علامة من بدر السعيدي للتجارة',
    about:
      'ظلال السدر هي علامة تجارية عُمانية متخصصة في تطوير شجرة السدر منذ عام 2020 وتحويلها إلى منظومة زراعية وتجارية متكاملة تجمع بين الزراعة، التشجير، المنتجات الطبيعية والمنتجات الغذائية المستوحاة من السدر العُماني.',
    pillars: ['الهوية والتجارب', 'التشجير والاستدامة', 'الزراعة والتطوير', 'المنتجات والتصنيع'],
    quote: 'السدر جزء من الهوية والتراث الخليجي، ونسعى لتقديمه برؤية حديثة ومستدامة تعكس قيمته الزراعية والثقافية والاقتصادية',
    founder: { name: 'بدر السعيدي', role: 'مؤسس ظلال السدر', text: 'متخصص في تطوير وتطعيم أصناف السدر منذ 2020' },
    vision: {
      title: 'الرؤية',
      text: 'أن تصبح ظلال السدر مرجعًا رائدًا لشجرة السدر في الخليج، من خلال إنشاء منظومة متكاملة تجمع بين الزراعة، الإنتاج، السياحة، والتصنيع، لتقديم تجربة مستوحاة من السدر العُماني بهوية حديثة ومستدامة.',
    },
    mission: {
      title: 'الرسالة',
      text: 'نسعى إلى تطوير شجرة السدر وتحويلها إلى قيمة زراعية وتجارية وثقافية مستدامة عبر إنتاج الأصناف المنتخبة، تطوير المنتجات الطبيعية والغذائية، وإنشاء بيئة متكاملة تضم المزارع، المشاتل، التجارب السياحية، والتصنيع المرتبط بالسدر، بخبرة ميدانية وجودة تعكس الهوية الخليجية.',
    },
    future: {
      title: 'رؤيتنا المستقبلية',
      text: 'نعمل على تطوير منظومة متكاملة مرتبطة بشجرة السدر تشمل الزراعة، التشجير، التصنيع، والتجارب المرتبطة بالسدر، ضمن رؤية طويلة المدى لبناء وجهة متخصصة وفريدة في الخليج تجمع بين الإنتاج، السياحة، والهوية الزراعية الحديثة. كما نعمل على بناء مرجع متكامل ومتخصص لشجرة السدر في الخليج، يجمع بين المعرفة، التجربة، والإنتاج المستدام.',
    },
    services: [
      { key: 'grafting', title: 'تطعيم السدر', where: 'عُمان | الإمارات | قطر', text: 'نحوّل أشجار السدر القديمة إلى أشجار منتجة تضم عدة أصناف سدر فاخرة ومختارة باستخدام تقنيات تطعيم احترافية وتجارب ميدانية موثقة في الخليج.' },
      { key: 'seedlings', title: 'إنتاج شتلات السدر', text: 'إنتاج شتلات سدر منتخبة تضم أكثر من 70 صنفًا من أصناف السدر من حول العالم، تم اختيارها وتجربتها بعناية لتناسب الإنتاج التجاري، التشجير، والمزارع الخاصة.' },
      { key: 'afforestation', title: 'تشجير الشوارع والمشاريع', text: 'نوفر أصناف سدر قائمة ومنتخبة مناسبة للتشجير، تتميز بالقوة والجمال وتحمّل الظروف المناخية الخليجية، لتناسب الشوارع، الحدائق، والمشاريع الحكومية والخاصة. كما تتميز بعض الأصناف بانخفاض احتياجها للمياه وملاءمتها للبيئة الخليجية بما يدعم مفاهيم الاستدامة والتشجير طويل المدى.' },
      { key: 'farms', title: 'إدارة الحدائق والمزارع', where: 'سلطنة عُمان | الإمارات | قطر', text: 'تقديم خدمات إدارة ومتابعة الحدائق والمزارع بخبرة ميدانية متخصصة في العناية بالسدر والأشجار المرتبطة بالبيئة الخليجية.' },
      { key: 'fruit', title: 'ثمار السدر الفاخرة', text: 'توفير ثمار سدر مختارة خلال موسم الإنتاج، بأصناف عالية الجودة مناسبة للبيع الطازج والتصنيع الغذائي.' },
      { key: 'care', title: 'منتجات العناية بخلاصة السدر', text: 'مجموعة متكاملة من منتجات العناية الطبيعية المستوحاة من السدر العُماني للعناية بالشعر والبشرة والجسم.' },
      { key: 'food', title: 'منتجات غذائية من ثمار السدر', text: 'تطوير منتجات غذائية مبتكرة مستوحاة من ثمار السدر، تجمع بين الجودة والطابع التراثي العصري.' },
      { key: 'workshops', title: 'الورش والتجارب', text: 'تنظيم ورش وتجارب تعليمية متخصصة مرتبطة بعالم السدر، تجمع بين المعرفة، التطبيق، والخبرة الميدانية.' },
    ],
    why: {
      title: 'لماذا ظلال السدر؟',
      points: ['أكثر من 70 صنف سدر من حول العالم', 'خبرة ميدانية موثقة منذ 2020', 'أعمال وخدمات في عدة دول خليجية', 'تطوير منتجات مستوحاة من السدر العُماني', 'حلول مناسبة للمناخ الخليجي', 'أعمال وتجارب ميدانية موثقة'],
      line: 'رؤية تجمع بين الزراعة والهوية والاستدامة',
    },
    identity: { title: 'هويتنا', text: 'نحوّل شجرة السدر من رمز تراثي إلى منظومة زراعية وتجارية متكاملة.' },
    contact: {
      title: 'تواصل معنا',
      whatsapp: 'تواصل مباشر واتساب',
      email: 'تواصل معنا عبر الإيميل',
      store: 'للطلب من خلال المتجر الإلكتروني',
      profile: 'الملف التعريفي',
      catalogue: 'كتالوج أصناف السدر',
      place: 'سلطنة عُمان',
    },
    follow: { title: 'تابعونا', instagram: 'إنستجرام', tiktok: 'تيك توك' },
    footer: { rights: 'جميع الحقوق محفوظة.' },
  },

  en: {
    dir: 'ltr',
    meta: {
      title: 'Thilal Al Sidr | The future of Sidr in Oman and the Gulf',
      description: 'Thilal Al Sidr is an Omani brand developing the Sidr tree since 2020: grafting, selected seedlings of more than 70 varieties, afforestation, farm management, premium fruit, care and food products, and workshops.',
    },
    nav: { about: 'About', services: 'Services', varieties: 'Varieties', why: 'Why us', founder: 'Founder', contact: 'Contact', store: 'Store' },
    langSwitch: 'عربي',
    tagline: 'From the Omani Sidr… the story begins',
    taglineEnd: 'The Sidr journey… is only beginning',
    linktree: 'The future of Sidr in Oman and the Gulf',
    brandBy: 'A brand by Badar Alsaidi Trading',
    about:
      'Thilal Al Sidr is an Omani brand that has specialised in developing the Sidr tree since 2020, turning it into an integrated agricultural and commercial system that brings together farming, afforestation, natural products and food products inspired by the Omani Sidr.',
    pillars: ['Identity & experiences', 'Afforestation & sustainability', 'Farming & development', 'Products & manufacturing'],
    quote: 'Sidr is part of Gulf identity and heritage, and we aim to present it with a modern, sustainable vision that reflects its agricultural, cultural and economic value',
    founder: { name: 'Badar Al Saidi', role: 'Founder of Thilal Al Sidr', text: 'Specialised in developing and grafting Sidr varieties since 2020' },
    vision: {
      title: 'Vision',
      text: 'For Thilal Al Sidr to become a leading reference for the Sidr tree in the Gulf, by building an integrated system that brings together farming, production, tourism and manufacturing, offering an experience inspired by the Omani Sidr with a modern, sustainable identity.',
    },
    mission: {
      title: 'Mission',
      text: 'We develop the Sidr tree and turn it into lasting agricultural, commercial and cultural value: producing selected varieties, developing natural and food products, and building an integrated environment of farms, nurseries, tourism experiences and Sidr-based manufacturing, with field expertise and quality that reflect Gulf identity.',
    },
    future: {
      title: 'Our future vision',
      text: 'We are building an integrated system around the Sidr tree that covers farming, afforestation, manufacturing and Sidr experiences, within a long-term vision of a unique, specialised destination in the Gulf that brings together production, tourism and a modern agricultural identity, and a complete reference for the Sidr tree that combines knowledge, experience and sustainable production.',
    },
    services: [
      { key: 'grafting', title: 'Sidr grafting', where: 'Oman | UAE | Qatar', text: 'We turn old Sidr trees into productive trees carrying several premium, selected Sidr varieties, using professional grafting techniques and documented field work in the Gulf.' },
      { key: 'seedlings', title: 'Sidr seedlings', text: 'Selected Sidr seedlings covering more than 70 varieties from around the world, carefully chosen and tested for commercial production, afforestation and private farms.' },
      { key: 'afforestation', title: 'Streets & projects afforestation', text: 'Established, selected Sidr varieties suited to afforestation: strong, beautiful and able to withstand the Gulf climate, for streets, gardens and government and private projects. Some varieties need little water and suit the Gulf environment, supporting sustainability and long-term planting.' },
      { key: 'farms', title: 'Garden & farm management', where: 'Oman | UAE | Qatar', text: 'Management and follow-up of gardens and farms, with specialised field expertise in caring for Sidr and the trees of the Gulf environment.' },
      { key: 'fruit', title: 'Premium Sidr fruit', text: 'Selected Sidr fruit in the production season, high-quality varieties suited to fresh sale and food manufacturing.' },
      { key: 'care', title: 'Sidr extract care products', text: 'A complete range of natural care products inspired by the Omani Sidr, for hair, skin and body.' },
      { key: 'food', title: 'Food from Sidr fruit', text: 'Innovative food products inspired by Sidr fruit, combining quality with a modern heritage character.' },
      { key: 'workshops', title: 'Workshops & experiences', text: 'Specialised educational workshops and experiences about the world of Sidr, combining knowledge, practice and field expertise.' },
    ],
    why: {
      title: 'Why Thilal Al Sidr?',
      points: ['More than 70 Sidr varieties from around the world', 'Documented field experience since 2020', 'Work and services in several Gulf countries', 'Products inspired by the Omani Sidr', 'Solutions suited to the Gulf climate', 'Documented field work and trials'],
      line: 'A vision that brings together farming, identity and sustainability',
    },
    identity: { title: 'Our identity', text: 'We turn the Sidr tree from a heritage symbol into an integrated agricultural and commercial system.' },
    contact: {
      title: 'Contact us',
      whatsapp: 'WhatsApp us directly',
      email: 'Email us',
      store: 'Order from the online store',
      profile: 'Company profile',
      catalogue: 'Sidr varieties catalogue',
      place: 'Sultanate of Oman',
    },
    follow: { title: 'Follow us', instagram: 'Instagram', tiktok: 'TikTok' },
    footer: { rights: 'All rights reserved.' },
  },
};
