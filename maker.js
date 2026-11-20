// صفحة التجهيز: مشرف الحملة يكتب بيانات الحملة مرة، ثم يضيف الحجاج، وتطلع بطاقة برمز لكل حاج.
(() => {
  const $ = (id) => document.getElementById(id);
  const AR = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  const BASE = new URL('c.html', location.href).href.split('#')[0];
  const list = $('pilgrims'), tpl = $('pilTpl');

  function addPilgrim(d = {}) {
    const node = tpl.content.firstElementChild.cloneNode(true), sel = node.querySelector('.l');
    for (const [k, v] of Object.entries(LANGS)) { const o = el('option', '', v.name); o.value = k; sel.append(o); }
    node.querySelector('.n').value = d.n || ''; sel.value = d.l || 'ur';
    node.querySelector('.f').value = d.f || ''; node.querySelector('.h').value = d.h || '';
    node.querySelector('.del').addEventListener('click', () => { node.remove(); if (!list.children.length) addPilgrim(); render(); });
    list.append(node); return node;
  }

  function card(d) {
    const url = BASE + '#' + packCard(d), q = QR.svg(url);
    const tag = el('article', 'tag');
    const top = el('div', 'tag-top'); top.append(el('b', '', 'فزعة'), el('span', '', 'حاج تائه · LOST PILGRIM'));
    const qr = el('div', 'tag-qr'); qr.innerHTML = q.markup;   // الرمز من مولّدنا نحن: مسار أرقام فقط
    qr.firstElementChild.setAttribute('aria-label', 'رمز بطاقة ' + (d.n || 'الحاج'));
    const txt = el('div', 'tag-txt');
    const a = el('p', '', PHRASES.ar.card), b = el('p', '', PHRASES.en.card); b.lang = 'en'; b.dir = 'ltr';
    txt.append(a, b);
    if (d.l !== 'ar' && d.l !== 'en') { const c = el('p', '', PHRASES[d.l].card); c.lang = d.l; c.dir = LANGS[d.l].dir; txt.append(c); }
    const nm = el('div', 'tag-name', d.n || '—'); nm.append(el('small', '', LANGS[d.l].name + (d.g ? ' · ' + d.g : ''))); txt.append(nm);
    const go = el('a', 'tag-try', 'جرّب كأنك مسحتها'); go.href = url; go.target = '_blank'; go.rel = 'noopener';
    tag.append(top, qr, txt, go); tag.dataset.url = url; tag.dataset.v = q.version;
    return tag;
  }

  function render() {
    const common = { g: $('g').value, s: $('s').value, c: $('c').value, m: $('m').value };
    const cards = [];
    [...list.children].forEach((node, i) => {
      node.querySelector('.num').textContent = 'الحاج ' + AR(i + 1);
      const d = { ...common, n: node.querySelector('.n').value, l: node.querySelector('.l').value, f: node.querySelector('.f').value, h: node.querySelector('.h').value };
      if (d.n.trim()) { try { cards.push(card(d)); } catch (e) { cards.push(el('p', '', 'بيانات هذا الحاج أطول من سعة الرمز. اختصر النص.')); } }
    });
    $('cards').replaceChildren(...(cards.length ? cards : [el('p', '', 'اكتب اسم حاج واحد على الأقل وتظهر بطاقته هنا.')]));
    $('print').disabled = !cards.length;
  }

  $('add').addEventListener('click', () => { addPilgrim().querySelector('.n').focus(); render(); });
  $('demo').addEventListener('click', () => {
    $('g').value = 'حملة الصفا (مثال)'; $('s').value = '+966500000000'; $('c').value = 'منى، مخيم ٤٥، شارع ٢٠٤'; $('m').value = '';
    list.replaceChildren();
    addPilgrim({ n: 'محمد إقبال', l: 'ur', h: 'سكري، دواؤه في حقيبته' }); addPilgrim({ n: 'Siti Rahmah', l: 'id' }); addPilgrim({ n: 'Musa Abubakar', l: 'ha' }); addPilgrim({ n: 'রহিম উদ্দিন', l: 'bn' });
    render();
  });
  $('print').addEventListener('click', () => window.print());
  document.querySelector('.maker').addEventListener('input', render);
  addPilgrim(); render();
})();
