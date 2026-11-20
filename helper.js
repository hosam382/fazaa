// صفحة المساعد: تنفتح عند مسح رمز البطاقة. تعرض بيانات الحاج بلغة الماسح، وتترجم بين الاثنين.
(() => {
  const $ = (id) => document.getElementById(id);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const card = unpackCard(location.hash);

  // لغة المساعد: من لغة جواله، وإلا العربية
  const guess = () => { for (const l of navigator.languages || [navigator.language || 'ar']) { const k = String(l).slice(0, 2).toLowerCase(); if (LANGS[k]) return k; } return 'ar'; };
  let me = guess();

  if (!card) {
    $('badTxt').textContent = UI[me].bad; $('bad').hidden = false;
    document.documentElement.lang = me; document.documentElement.dir = LANGS[me].dir;
    return;
  }
  const him = card.l;   // لغة الحاج
  const sel = $('lang');
  for (const [k, v] of Object.entries(LANGS)) { const o = el('option', '', v.name); o.value = k; sel.append(o); }
  sel.addEventListener('change', () => { me = sel.value; draw(); });

  // شاشة «أرِه الشاشة»
  let showing = null;
  function show(text, lang, cap, sub) {
    showing = { text, lang };
    $('showCap').textContent = cap; $('showTxt').textContent = text; $('showSub').textContent = sub || '';
    $('showTxt').lang = lang; $('showTxt').dir = LANGS[lang].dir;
    $('showSay').hidden = !Voice.has(lang);
    $('show').classList.add('on'); $('showBack').focus();
    if (Voice.has(lang)) Voice.say(text, lang);
  }
  function hide() { $('show').classList.remove('on'); showing = null; try { speechSynthesis.cancel(); } catch (e) { } }
  $('showBack').addEventListener('click', hide);
  $('showSay').addEventListener('click', () => showing && Voice.say(showing.text, showing.lang));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && showing) hide(); });

  // الترجمة الحرة: اتجاهان
  let toHim = true;
  async function free() {
    const text = $('freeIn').value.trim(); if (!text) return;
    const from = toHim ? me : him, to = toHim ? him : me;
    if (from === to) { $('freeOut').textContent = text; return; }
    $('freeOut').textContent = '…';
    let out = null; try { out = await Translate.run(text, from, to); } catch (e) { out = null; }
    if (out == null) { $('freeOut').textContent = ''; $('freeNote').textContent = UI[me].nofree; return; }
    $('freeOut').textContent = out; $('freeOut').lang = to; $('freeOut').dir = LANGS[to].dir; $('freeNote').textContent = '';
    if (Voice.has(to)) Voice.say(out, to);
  }
  $('freeGo').addEventListener('click', free);
  $('freeIn').addEventListener('keydown', (e) => { if (e.key === 'Enter') free(); });
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    $('freeMic').hidden = false;
    $('freeMic').addEventListener('click', () => {
      try { const r = new SR(); r.lang = LANGS[toHim ? me : him].tts; r.onresult = (ev) => { $('freeIn').value = ev.results[0][0].transcript; free(); }; r.start(); } catch (e) { }
    });
  }

  function draw() {
    const t = UI[me], d = LANGS[me];
    document.documentElement.lang = me; document.documentElement.dir = d.dir; sel.value = me; document.title = 'فزعة · ' + t.found;
    $('found').textContent = t.found;
    $('nm').textContent = card.n || '—';
    $('tSpeaks').textContent = t.speaks; $('speaks').textContent = LANGS[him].name;
    $('tPlace').textContent = t.place; $('place').textContent = card.c || ''; $('rowPlace').hidden = !card.c;
    $('tGroup').textContent = t.group; $('group').textContent = card.g || ''; $('rowGroup').hidden = !card.g;
    const call = $('call'); call.hidden = !card.s; call.textContent = t.call; if (card.s) call.href = 'tel:' + card.s;
    const fam = $('fam'); fam.hidden = !card.f; fam.textContent = t.fam; if (card.f) fam.href = 'tel:' + card.f;
    const map = $('map'); map.hidden = !card.m; map.textContent = t.map; if (card.m) map.href = card.m;
    $('health').hidden = !card.h; $('tHealth').textContent = t.health; $('healthTxt').textContent = card.h || '';
    $('tSay').textContent = t.say; $('tHint').textContent = t.hint; $('tAsk').textContent = t.ask; $('tFree').textContent = t.free;
    $('showSay').textContent = t.listen; $('showBack').textContent = t.back;
    // جمل المساعد: مكتوبة بلغته، وتُعرض للحاج بلغة الحاج
    $('phr').replaceChildren(...PHRASES[me].h.map((s, i) => {
      const b = el('button', '', s); b.type = 'button';
      b.addEventListener('click', () => show(PHRASES[him].h[i], him, LANGS[him].name, s));
      return b;
    }));
    // حاجات الحاج: مكتوبة بلغته مع صورة، وتُعرض للمساعد بلغة المساعد
    $('needs').replaceChildren(...PHRASES[him].p.map((s, i) => {
      const b = el('button'); b.type = 'button'; b.lang = him; b.dir = LANGS[him].dir;
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + NEED_ICONS[i] + '</svg>';   // أيقونات ثابتة من ملفنا
      b.append(el('span', '', s));
      b.addEventListener('click', () => show(PHRASES[me].p[i], me, t.hesays, s));
      return b;
    }));
    // الترجمة الحرة (تختفي إذا المساعد والحاج بنفس اللغة)
    document.querySelector('.free').hidden = me === him;
    $('freeGo').textContent = t.go; $('freeMic').textContent = t.mic; $('freeIn').placeholder = t.type;
    const mk = (label, val) => { const b = el('button', '', label); b.type = 'button'; b.setAttribute('aria-pressed', String(toHim === val)); b.addEventListener('click', () => { toHim = val; draw(); }); return b; };
    $('dir').replaceChildren(mk(d.name + ' → ' + LANGS[him].name, true), mk(LANGS[him].name + ' → ' + d.name, false));
    Translate.ready(toHim ? me : him, toHim ? him : me).then((how) => { $('freeNote').textContent = how || me === him ? '' : t.nofree; });
  }
  // الأصوات تتحمّل متأخرة في بعض المتصفحات
  try { speechSynthesis.addEventListener('voiceschanged', () => { if (showing) $('showSay').hidden = !Voice.has(showing.lang); }); } catch (e) { }
  $('page').hidden = false; draw();
})();
