// One shared <dialog> for every artwork, filled on open.
const ALLOWED = new Set(['P', 'BR', 'EM', 'I', 'STRONG', 'B', 'A', 'UL', 'OL', 'LI', 'BLOCKQUOTE']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META']);
const URL_RE = /(https?:\/\/[^\s<>"']*[^\s<>"'.,;:)])/;

function link(href, text) {
  const a = document.createElement('a');
  a.href = href; a.textContent = text; a.target = '_blank'; a.rel = 'noopener noreferrer';
  return a;
}

// Keep a short allowlist of tags; strip every attribute except a safe http(s)/mailto href;
// turn bare URLs in text into links.
export function sanitize(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (child.parentElement.closest('a')) return;
        const parts = child.nodeValue.split(URL_RE);
        if (parts.length < 2) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p, k) => frag.append(k % 2 ? link(p, p) : p));
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        if (DROP.has(child.tagName)) { child.remove(); return; }
        walk(child);
        if (!ALLOWED.has(child.tagName)) { child.replaceWith(...child.childNodes); return; }
        [...child.attributes].forEach(a => { if (!(child.tagName === 'A' && a.name === 'href')) child.removeAttribute(a.name); });
        if (child.tagName === 'A') {
          if (/^(https?:\/\/|mailto:)/i.test(child.getAttribute('href') || '')) {
            child.target = '_blank'; child.rel = 'noopener noreferrer';
          } else child.removeAttribute('href');
        }
      } else child.remove();
    });
  };
  walk(doc.body);
  return doc.body.innerHTML;
}

export class DetailView {
  constructor() {
    document.body.insertAdjacentHTML('beforeend',
      `<dialog id="detail" aria-labelledby="detail-title">
         <div class="detail-bar"><button type="button" class="detail-close">Close</button></div>
         <div class="detail-scroll">
           <img class="detail-img" alt="">
           <h2 id="detail-title"></h2>
           <p class="detail-artist"></p>
           <div class="detail-text"></div>
           <p class="detail-credit"></p>
           <p class="detail-perm"></p>
           <a class="detail-directions" target="_blank" rel="noopener noreferrer">Directions</a>
         </div>
       </dialog>`);
    this.dlg = document.getElementById('detail');
    this.q = s => this.dlg.querySelector(s);
    this.q('.detail-close').addEventListener('click', () => this.dlg.close());
    this.dlg.addEventListener('click', e => { if (e.target === this.dlg) this.dlg.close(); });  // backdrop tap
    this.dlg.addEventListener('close', () => {
      const el = this.opener && document.contains(this.opener) ? this.opener : document.getElementById('map');
      el?.focus?.();
    });
  }

  show(site, opener) {
    this.opener = opener || null;
    const img = this.q('.detail-img');
    img.hidden = !site.image;
    img.src = site.image;
    img.alt = site.alt || site.title;            // CSV column "alt" wins; the title is the fallback
    this.q('#detail-title').textContent = site.title;
    const artist = this.q('.detail-artist');
    artist.textContent = site.artist ? `By ${site.artist}` : '';
    artist.hidden = !site.artist;
    this.q('.detail-text').innerHTML = sanitize(site.description);
    [['.detail-credit', site.credit], ['.detail-perm', site.permission]].forEach(([sel, text]) => {
      this.q(sel).textContent = text; this.q(sel).hidden = !text;
    });
    this.q('.detail-directions').href = `https://www.google.com/maps/dir/?api=1&destination=${site.lat},${site.lng}`;
    this.q('.detail-scroll').scrollTop = 0;
    if (!this.dlg.open) this.dlg.showModal();
  }
}
