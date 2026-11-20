// «فزعة»: اللغات والعبارات وترميز بيانات البطاقة والصوت والترجمة.
// البيانات كلها داخل الرابط بعد علامة # (ما تروح لأي سيرفر).

/* اللغات: الاسم كما يكتبه أهلها، اتجاه الكتابة، ورمز الصوت */
const LANGS = {
  ar: { name: 'العربية', dir: 'rtl', tts: 'ar-SA' },
  en: { name: 'English', dir: 'ltr', tts: 'en-US' },
  ur: { name: 'اردو', dir: 'rtl', tts: 'ur-PK' },
  id: { name: 'Bahasa Indonesia', dir: 'ltr', tts: 'id-ID' },
  bn: { name: 'বাংলা', dir: 'ltr', tts: 'bn-BD' },
  tr: { name: 'Türkçe', dir: 'ltr', tts: 'tr-TR' },
  fa: { name: 'فارسی', dir: 'rtl', tts: 'fa-IR' },
  ha: { name: 'Hausa', dir: 'ltr', tts: 'ha-NG' },
  fr: { name: 'Français', dir: 'ltr', tts: 'fr-FR' },
};

/* نصوص صفحة المساعد (اللي مسح الباركود)، بلغته هو */
const UI = {
  ar: { found: 'حاج تائه يحتاج مساعدتك', speaks: 'لغته', place: 'مكان سكنه', group: 'حملته', call: 'اتصل بمشرف الحملة', fam: 'اتصل بأهله', map: 'افتح الخريطة', say: 'قل للحاج', ask: 'دع الحاج يختار ما يحتاجه', free: 'ترجمة حرة', health: 'ملاحظة صحية', hint: 'اضغط الجملة ثم أرِه الشاشة', back: 'رجوع', hesays: 'الحاج يقول', listen: 'استمع', type: 'اكتب ما تريد قوله', go: 'ترجم', mic: 'تكلّم', nofree: 'الترجمة الحرة تحتاج ربط خدمة الترجمة. العبارات الجاهزة تعمل الآن.', bad: 'لم تُقرأ البطاقة. امسح الرمز مرة ثانية.' },
  en: { found: 'A lost pilgrim needs your help', speaks: 'Language', place: 'Where the pilgrim stays', group: 'Group', call: 'Call the group leader', fam: 'Call the family', map: 'Open the map', say: 'Tell the pilgrim', ask: 'Let the pilgrim choose a need', free: 'Free translation', health: 'Health note', hint: 'Tap a sentence, then show the screen', back: 'Back', hesays: 'The pilgrim says', listen: 'Listen', type: 'Type what you want to say', go: 'Translate', mic: 'Speak', nofree: 'Free translation needs the translation service to be connected. The ready phrases work now.', bad: 'The card could not be read. Scan the code again.' },
  ur: { found: 'ایک بھٹکے ہوئے حاجی کو آپ کی مدد چاہیے', speaks: 'زبان', place: 'رہائش', group: 'گروپ', call: 'گروپ لیڈر کو فون کریں', fam: 'گھر والوں کو فون کریں', map: 'نقشہ کھولیں', say: 'حاجی سے کہیں', ask: 'حاجی کو اپنی ضرورت چننے دیں', free: 'آزاد ترجمہ', health: 'صحت کا نوٹ', hint: 'جملہ دبائیں، پھر اسکرین دکھائیں', back: 'واپس', hesays: 'حاجی کہتا ہے', listen: 'سنیں', type: 'جو کہنا ہے وہ لکھیں', go: 'ترجمہ کریں', mic: 'بولیں', nofree: 'آزاد ترجمے کے لیے ترجمے کی سروس جوڑنا ضروری ہے۔ تیار جملے ابھی کام کرتے ہیں۔', bad: 'کارڈ نہیں پڑھا جا سکا۔ کوڈ دوبارہ اسکین کریں۔' },
  id: { found: 'Seorang jemaah tersesat butuh bantuan Anda', speaks: 'Bahasa', place: 'Tempat tinggal', group: 'Rombongan', call: 'Telepon ketua rombongan', fam: 'Telepon keluarganya', map: 'Buka peta', say: 'Katakan kepada jemaah', ask: 'Biarkan jemaah memilih kebutuhannya', free: 'Terjemahan bebas', health: 'Catatan kesehatan', hint: 'Ketuk kalimat, lalu tunjukkan layarnya', back: 'Kembali', hesays: 'Jemaah berkata', listen: 'Dengarkan', type: 'Tulis yang ingin Anda katakan', go: 'Terjemahkan', mic: 'Bicara', nofree: 'Terjemahan bebas perlu layanan terjemahan yang terhubung. Kalimat siap pakai sudah berfungsi.', bad: 'Kartu tidak terbaca. Pindai kodenya lagi.' },
  bn: { found: 'একজন পথ হারানো হাজির আপনার সাহায্য দরকার', speaks: 'ভাষা', place: 'থাকার জায়গা', group: 'দল', call: 'দলনেতাকে ফোন করুন', fam: 'পরিবারকে ফোন করুন', map: 'মানচিত্র খুলুন', say: 'হাজিকে বলুন', ask: 'হাজিকে তার প্রয়োজন বেছে নিতে দিন', free: 'মুক্ত অনুবাদ', health: 'স্বাস্থ্য নোট', hint: 'বাক্যে চাপ দিন, তারপর স্ক্রিন দেখান', back: 'ফিরে যান', hesays: 'হাজি বলছেন', listen: 'শুনুন', type: 'যা বলতে চান লিখুন', go: 'অনুবাদ করুন', mic: 'বলুন', nofree: 'মুক্ত অনুবাদের জন্য অনুবাদ সেবা যুক্ত করতে হবে। তৈরি বাক্যগুলো এখনই কাজ করে।', bad: 'কার্ডটি পড়া যায়নি। কোডটি আবার স্ক্যান করুন।' },
  tr: { found: 'Kaybolmuş bir hacının yardımınıza ihtiyacı var', speaks: 'Dili', place: 'Kaldığı yer', group: 'Kafilesi', call: 'Kafile başkanını arayın', fam: 'Ailesini arayın', map: 'Haritayı açın', say: 'Hacıya söyleyin', ask: 'Hacı ihtiyacını seçsin', free: 'Serbest çeviri', health: 'Sağlık notu', hint: 'Cümleye dokunun, sonra ekranı gösterin', back: 'Geri', hesays: 'Hacı diyor ki', listen: 'Dinle', type: 'Söylemek istediğinizi yazın', go: 'Çevir', mic: 'Konuş', nofree: 'Serbest çeviri için çeviri hizmetinin bağlanması gerekir. Hazır cümleler şimdi çalışıyor.', bad: 'Kart okunamadı. Kodu tekrar okutun.' },
  fa: { found: 'یک زائر گم‌شده به کمک شما نیاز دارد', speaks: 'زبان', place: 'محل اقامت', group: 'کاروان', call: 'تماس با مدیر کاروان', fam: 'تماس با خانواده', map: 'باز کردن نقشه', say: 'به زائر بگویید', ask: 'بگذارید زائر نیازش را انتخاب کند', free: 'ترجمهٔ آزاد', health: 'یادداشت سلامت', hint: 'روی جمله بزنید، سپس صفحه را نشان دهید', back: 'بازگشت', hesays: 'زائر می‌گوید', listen: 'بشنوید', type: 'آنچه می‌خواهید بگویید بنویسید', go: 'ترجمه کن', mic: 'صحبت کنید', nofree: 'ترجمهٔ آزاد به اتصال سرویس ترجمه نیاز دارد. جمله‌های آماده اکنون کار می‌کنند.', bad: 'کارت خوانده نشد. رمز را دوباره اسکن کنید.' },
  ha: { found: 'Wani alhaji da ya ɓace yana bukatar taimakonka', speaks: 'Harshe', place: 'Wurin zama', group: 'Tawaga', call: 'Kira shugaban tawaga', fam: 'Kira iyalinsa', map: 'Buɗe taswira', say: 'Gaya wa alhaji', ask: 'Bari alhaji ya zaɓi abin da yake bukata', free: 'Fassara kyauta', health: 'Bayanin lafiya', hint: 'Danna jumla, sannan ka nuna masa allon', back: 'Koma', hesays: 'Alhaji yana cewa', listen: 'Saurara', type: 'Rubuta abin da kake son faɗa', go: 'Fassara', mic: 'Yi magana', nofree: 'Fassara kyauta tana bukatar haɗa sabis na fassara. Jumlolin da aka shirya suna aiki yanzu.', bad: 'Ba a iya karanta katin ba. Sake duba lambar.' },
  fr: { found: 'Un pèlerin égaré a besoin de votre aide', speaks: 'Langue', place: 'Lieu d’hébergement', group: 'Groupe', call: 'Appeler le responsable du groupe', fam: 'Appeler sa famille', map: 'Ouvrir la carte', say: 'Dites au pèlerin', ask: 'Laissez le pèlerin choisir son besoin', free: 'Traduction libre', health: 'Note de santé', hint: 'Touchez une phrase, puis montrez l’écran', back: 'Retour', hesays: 'Le pèlerin dit', listen: 'Écouter', type: 'Écrivez ce que vous voulez dire', go: 'Traduire', mic: 'Parler', nofree: 'La traduction libre nécessite de connecter le service de traduction. Les phrases prêtes fonctionnent déjà.', bad: 'La carte n’a pas pu être lue. Scannez le code à nouveau.' },
};

/* عبارات جاهزة: h = المساعد يقولها للحاج، p = الحاج يختار حاجته، card = سطر البطاقة المطبوعة */
const PHRASES = {
  ar: { h: ['لا تخف، سأساعدك', 'سأوصلك إلى مخيمك', 'ابقَ معي ولا تذهب', 'سنتصل بمشرف حملتك الآن', 'هل تريد ماءً؟', 'اجلس واسترح قليلاً'], p: ['أريد ماءً', 'أحتاج دوائي', 'أريد دورة المياه', 'أنا متعب وأشعر بدوار', 'أبحث عن أهلي', 'أريد العودة إلى مخيمي'], card: 'إذا وجدتني تائهاً، امسح الرمز بكاميرا جوالك' },
  en: { h: ['Don’t be afraid, I will help you', 'I will take you to your camp', 'Stay with me, don’t walk away', 'We will call your group leader now', 'Do you want water?', 'Sit down and rest a little'], p: ['I need water', 'I need my medicine', 'I need the toilet', 'I feel tired and dizzy', 'I am looking for my family', 'I want to go back to my camp'], card: 'If you find me lost, scan this code with your phone camera' },
  ur: { h: ['گھبرائیں نہیں، میں آپ کی مدد کروں گا', 'میں آپ کو آپ کے خیمے تک پہنچا دوں گا', 'میرے ساتھ رہیں، کہیں نہ جائیں', 'ہم ابھی آپ کے گروپ لیڈر کو فون کرتے ہیں', 'کیا آپ کو پانی چاہیے؟', 'بیٹھ جائیں اور تھوڑا آرام کریں'], p: ['مجھے پانی چاہیے', 'مجھے اپنی دوا چاہیے', 'مجھے بیت الخلا جانا ہے', 'میں تھکا ہوا ہوں اور چکر آ رہے ہیں', 'میں اپنے گھر والوں کو ڈھونڈ رہا ہوں', 'مجھے اپنے خیمے واپس جانا ہے'], card: 'اگر میں راستہ بھول جاؤں تو یہ کوڈ اپنے فون کے کیمرے سے اسکین کریں' },
  id: { h: ['Jangan takut, saya akan membantu Anda', 'Saya akan mengantar Anda ke tenda Anda', 'Tetap bersama saya, jangan pergi', 'Kami akan menelepon ketua rombongan Anda sekarang', 'Apakah Anda mau air?', 'Duduk dan istirahat sebentar'], p: ['Saya butuh air', 'Saya butuh obat saya', 'Saya perlu ke toilet', 'Saya lelah dan pusing', 'Saya mencari keluarga saya', 'Saya ingin kembali ke tenda saya'], card: 'Jika saya tersesat, pindai kode ini dengan kamera ponsel Anda' },
  bn: { h: ['ভয় পাবেন না, আমি আপনাকে সাহায্য করব', 'আমি আপনাকে আপনার তাঁবুতে পৌঁছে দেব', 'আমার সাথে থাকুন, কোথাও যাবেন না', 'আমরা এখনই আপনার দলনেতাকে ফোন করছি', 'আপনি কি পানি চান?', 'বসুন, একটু বিশ্রাম নিন'], p: ['আমার পানি দরকার', 'আমার ওষুধ দরকার', 'আমি টয়লেটে যেতে চাই', 'আমি ক্লান্ত, মাথা ঘুরছে', 'আমি আমার পরিবারকে খুঁজছি', 'আমি আমার তাঁবুতে ফিরতে চাই'], card: 'আমি পথ হারালে এই কোডটি আপনার ফোনের ক্যামেরা দিয়ে স্ক্যান করুন' },
  tr: { h: ['Korkmayın, size yardım edeceğim', 'Sizi çadırınıza götüreceğim', 'Benimle kalın, ayrılmayın', 'Şimdi kafile başkanınızı arayacağız', 'Su ister misiniz?', 'Oturun, biraz dinlenin'], p: ['Suya ihtiyacım var', 'İlacıma ihtiyacım var', 'Tuvalete gitmem lazım', 'Yorgunum ve başım dönüyor', 'Ailemi arıyorum', 'Çadırıma dönmek istiyorum'], card: 'Kaybolursam bu kodu telefonunuzun kamerasıyla okutun' },
  fa: { h: ['نترسید، من به شما کمک می‌کنم', 'شما را به چادرتان می‌رسانم', 'کنار من بمانید، جایی نروید', 'الان با مدیر کاروان شما تماس می‌گیریم', 'آب می‌خواهید؟', 'بنشینید و کمی استراحت کنید'], p: ['آب می‌خواهم', 'داروی خودم را لازم دارم', 'باید به دستشویی بروم', 'خسته‌ام و سرم گیج می‌رود', 'دنبال خانواده‌ام می‌گردم', 'می‌خواهم به چادرم برگردم'], card: 'اگر گم شدم، این رمز را با دوربین گوشی خود اسکن کنید' },
  ha: { h: ['Kada ka ji tsoro, zan taimake ka', 'Zan kai ka sansaninka', 'Ka tsaya tare da ni, kada ka tafi', 'Za mu kira shugaban tawagarka yanzu', 'Kana son ruwa?', 'Zauna ka huta kaɗan'], p: ['Ina bukatar ruwa', 'Ina bukatar maganina', 'Ina son zuwa banɗaki', 'Na gaji, ina jin jiri', 'Ina neman iyalina', 'Ina so in koma sansanina'], card: 'Idan na ɓace, ka duba wannan lamba da kyamarar wayarka' },
  fr: { h: ['N’ayez pas peur, je vais vous aider', 'Je vais vous conduire à votre camp', 'Restez avec moi, ne partez pas', 'Nous allons appeler le responsable de votre groupe', 'Voulez-vous de l’eau ?', 'Asseyez-vous et reposez-vous un peu'], p: ['J’ai besoin d’eau', 'J’ai besoin de mon médicament', 'J’ai besoin d’aller aux toilettes', 'Je suis fatigué et j’ai des vertiges', 'Je cherche ma famille', 'Je veux retourner à mon camp'], card: 'Si je suis perdu, scannez ce code avec l’appareil photo de votre téléphone' },
};

/* أيقونات الحاجات الست (مرسومة بخط واحد) */
const NEED_ICONS = [
  '<path d="M12 3c3 4.2 5.5 7.3 5.5 10.6a5.5 5.5 0 0 1-11 0C6.5 10.3 9 7.200 12 3Z"/>',
  '<rect x="3.5" y="9" width="17" height="7" rx="3.5" transform="rotate(-38 12 12.5)"/><path d="m9.300 8.400 4.700 6"/>',
  '<circle cx="8" cy="5" r="1.800"/><path d="M5.500 20v-5H4l1.500-6h5L12 15h-1.500v5"/><circle cx="17" cy="5" r="1.800"/><path d="M15 20v-5.500h-1V9h6v5.500h-1V20"/>',
  '<path d="M12 20s-7-4.300-7-9.600A3.900 3.900 0 0 1 12 8a3.900 3.900 0 0 1 7 2.400c0 5.300-7 9.600-7 9.600Z"/><path d="M4 13h4l1.500-3 2.500 5 1.500-2H20"/>',
  '<circle cx="8" cy="7" r="2.600"/><path d="M3 20v-2.500A4.500 4.500 0 0 1 7.500 13h1A4.500 4.500 0 0 1 13 17.500V20"/><circle cx="17" cy="9" r="2"/><path d="M15.500 14.200A3.500 3.500 0 0 1 21 17v3"/>',
  '<path d="M3 20 12 4l9 16H3Z"/><path d="M12 20v-6m-2.500 6 2.500-6 2.500 6"/>',
];

/* ---------- ترميز بيانات البطاقة داخل الرابط ---------- */
const FIELDS = { n: 40, l: 2, c: 120, g: 60, s: 20, f: 20, m: 200, h: 120 };   // الحقل: أقصى طول
const cleanPhone = (s) => String(s || '').replace(/[^\d+]/g, '').slice(0, 20);
const MAP_OK = ['https://maps.app.goo.gl/', 'https://www.google.com/maps', 'https://maps.google.com/', 'https://goo.gl/maps/', 'https://maps.apple.com/'];
const cleanMap = (s) => { const u = String(s || '').trim(); return MAP_OK.some((p) => u.startsWith(p)) ? u.slice(0, 200) : ''; };
function packCard(o) {
  const d = { v: 1 };
  for (const k of Object.keys(FIELDS)) { let x = String(o[k] || '').trim().slice(0, FIELDS[k]); if (k === 's' || k === 'f') x = cleanPhone(x); if (k === 'm') x = cleanMap(x); if (x) d[k] = x; }
  if (!LANGS[d.l]) d.l = 'ar';
  const bytes = new TextEncoder().encode(JSON.stringify(d)); let b = '';
  bytes.forEach((c) => { b += String.fromCharCode(c); });
  return btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unpackCard(t) {
  try {
    const b = atob(String(t).replace(/^#/, '').replace(/-/g, '+').replace(/_/g, '/')), u = new Uint8Array(b.length);
    for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    const o = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(u));
    if (!o || typeof o !== 'object' || o.v !== 1) return null;
    const d = {};
    for (const k of Object.keys(FIELDS)) if (typeof o[k] === 'string') d[k] = o[k].slice(0, FIELDS[k]);
    d.s = cleanPhone(d.s); d.f = cleanPhone(d.f); d.m = cleanMap(d.m); if (!LANGS[d.l]) d.l = 'ar';
    return d.n || d.c || d.s ? d : null;
  } catch (e) { return null; }
}

/* ---------- الصوت: نطق الجملة بلغتها إذا الجهاز عنده صوت لها ---------- */
const Voice = {
  has(lang) { try { return 'speechSynthesis' in window && speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith(lang)); } catch (e) { return false; } },
  say(text, lang) {
    try {
      const u = new SpeechSynthesisUtterance(text); u.lang = LANGS[lang].tts; u.rate = 0.9;
      const v = speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith(lang)); if (v) u.voice = v;
      speechSynthesis.cancel(); speechSynthesis.speak(u);
    } catch (e) { }
  },
};

/* ---------- الترجمة الحرة ----------
   ١) خدمة الترجمة (Cloudflare Worker) إذا انربطت: يُكتب رابطها في FAZAA_API
   ٢) مترجم المتصفح المدمج (كروم الحاسب الحديث) كتجربة بدون خدمة
   وإلا ترجع null وتبقى العبارات الجاهزة. */
const FAZAA_API = '';
const Translate = {
  async ready(from, to) {
    if (FAZAA_API) return 'api';
    try { if ('Translator' in self && (await self.Translator.availability({ sourceLanguage: from, targetLanguage: to })) !== 'unavailable') return 'browser'; } catch (e) { }
    return '';
  },
  async run(text, from, to) {
    const how = await Translate.ready(from, to); if (!how) return null;
    if (how === 'api') {
      const r = await fetch(FAZAA_API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text: text.slice(0, 300), from, to }) });
      if (!r.ok) return null; const j = await r.json(); return typeof j.text === 'string' ? j.text : null;
    }
    const t = await self.Translator.create({ sourceLanguage: from, targetLanguage: to });
    return t.translate(text.slice(0, 300));
  },
};

if (typeof module !== 'undefined') module.exports = { LANGS, UI, PHRASES, NEED_ICONS, packCard, unpackCard, cleanPhone, cleanMap };
