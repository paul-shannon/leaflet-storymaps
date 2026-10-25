// Phone layouts: "panel" (map plus bottom gallery sheet) and "toggle" (Map | Gallery switch).
// Choice order: ?layout= in the URL, then the visitor's saved choice, then config.defaultLayout.
import {config} from './config.js';

const KEY = 'artTourLayout';
const VALID = ['panel', 'toggle'];
const $ = s => document.querySelector(s);
const NEXT = {peek: 'half', half: 'full', full: 'peek'};
const HANDLE = {peek: 'Show gallery', half: 'Make gallery taller', full: 'Hide gallery'};

export class Layout {
  constructor(map, onOpen) {
    this.map = map;
    this.onOpen = onOpen;
    this.idx = -1;
    this.phoneQuery = matchMedia('(max-width: 799px)');
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) { /* storage unavailable */ }
    const fromUrl = new URLSearchParams(location.search).get('layout');
    this.setLayout([fromUrl, saved, config.defaultLayout].find(v => VALID.includes(v)) || 'panel');
    this.setSheet('peek');
    this.setView('map');

    $('#sheetHandle').addEventListener('click', () => this.setSheet(NEXT[document.body.dataset.sheet]));
    document.querySelectorAll('#viewToggle [data-view]')
      .forEach(b => b.addEventListener('click', () => this.setView(b.dataset.view)));
    document.querySelectorAll('input[name="layout"]').forEach(r => r.addEventListener('change', () => {
      this.setLayout(r.value);
      try { localStorage.setItem(KEY, r.value); } catch (e) { /* ignore */ }
    }));
    $('#preview .pv-open').addEventListener('click', () => this.onOpen(this.idx));
    $('#preview .pv-close').addEventListener('click', () => this.hidePreview());
    this.addExpandControl();
    this.phoneQuery.addEventListener('change', () => this.refresh());
  }

  isPhone() { return this.phoneQuery.matches; }

  setLayout(name) {
    document.body.dataset.layout = name;
    document.querySelectorAll('input[name="layout"]').forEach(r => { r.checked = r.value === name; });
    this.hidePreview();
    this.refresh();
  }

  setSheet(state) {
    document.body.dataset.sheet = state;
    const h = $('#sheetHandle');
    h.textContent = HANDLE[state];
    h.setAttribute('aria-expanded', String(state !== 'peek'));
    this.refresh();
  }

  setView(view) {
    document.body.dataset.view = view;
    document.querySelectorAll('#viewToggle [data-view]')
      .forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    this.hidePreview();
    this.refresh();
  }

  preview(site, i) {
    this.idx = i;
    if (document.body.dataset.layout === 'panel') this.setSheet('peek');   // keep the map and card visible
    const p = $('#preview');
    p.querySelector('img').src = site.thumbnail;
    p.querySelector('strong').textContent = site.title;
    p.querySelector('span').textContent = site.artist;
    p.hidden = false;
  }

  hidePreview() { $('#preview').hidden = true; this.onDismiss?.(); }

  refresh() { requestAnimationFrame(() => this.map.invalidateSize()); }

  addExpandControl() {
    const layout = this;
    const Control = L.Control.extend({
      options: {position: 'topleft'},
      onAdd() {
        const b = L.DomUtil.create('button', 'map-expand');
        b.type = 'button';
        b.textContent = 'Expand map';
        L.DomEvent.disableClickPropagation(b);
        b.addEventListener('click', () => {
          const on = document.body.classList.toggle('map-full');
          b.textContent = on ? 'Shrink map' : 'Expand map';
          layout.refresh();
        });
        return b;
      }
    });
    new Control().addTo(this.map);
  }
}
