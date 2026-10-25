import {config} from './config.js';
import {StoryMarker} from './storyMarker.js';
import {DetailView} from './detailView.js';
import {Layout} from './layout.js';
import {addLocateControl} from './locate.js';

const clean = v => String(v ?? '').trim();
const normalizeHeader = h => h.trim().toLowerCase().replace(/\s+/g, '');   // "Media Link" -> "medialink"

export class Main {
  constructor() {
    this.sites = [];
    this.markers = [];
    this.cards = [];
    this.categories = [];
    this.skipped = [];
    this.grid = document.getElementById('thumbnail-grid');
    this.detail = new DetailView();
    this.map = L.map('map', {scrollWheelZoom: true, zoomControl: true, tap: false})
      .setView(config.mapCenter, config.mapZoom);
    L.tileLayer(config.tileUrl, {maxZoom: 19, attribution: config.tileAttribution}).addTo(this.map);
    this.sel = -1;
    this.layout = new Layout(this.map, n => this.openDetail(n));
    this.layout.onDismiss = () => this.select(-1);
    addLocateControl(this.map);
  }

  async start() {
    try {
      this.sites = await this.loadSites(config.csvPath);
    } catch (e) {
      console.error('Could not load', config.csvPath, e);
      this.notice('The artwork list could not be loaded. Please try again later.');
      return;
    }
    if (this.skipped.length) {
      console.warn('Skipped CSV lines with bad coordinates:', this.skipped);
      if (location.search.includes('debug')) {
        this.notice(`Skipped CSV lines with bad coordinates: ${this.skipped.join(', ')}`);
      }
    }
    this.categories = [...new Set(this.sites.flatMap(s => s.categories))];
    this.buildNav();
    this.sites.forEach((s, i) => {
      this.cards.push(this.addCard(i, s));
      this.markers.push(new StoryMarker(i, this.map, s, n => this.onMarker(n)));
    });
    this.fitToVisible();
    this.checkOverlaps();
    this.setActive(config.allLabel);
  }

  loadSites(path) {
    return new Promise((resolve, reject) => {
      Papa.parse(path, {
        download: true, header: true, skipEmptyLines: true,
        transformHeader: normalizeHeader,
        complete: res => resolve(this.toSites(res.data)),
        error: reject
      });
    });
  }

  toSites(rows) {
    const sites = [];
    rows.forEach((r, n) => {
      const lat = parseFloat(r.latitude), lng = parseFloat(r.longitude);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) { this.skipped.push(n + 2); return; }  // +2: header row, 1-based
      const image = clean(r.medialink);
      sites.push({
        title: clean(r.chapter) || 'Untitled',
        lat, lng,
        description: clean(r.description),
        image,
        thumbnail: clean(r.thumbnail) || image,
        artist: clean(r.artist),
        categories: clean(r.categories).split(';').map(clean).filter(Boolean),
        alt: clean(r.alt),
        credit: clean(r.credit),
        permission: clean(r.permission)
      });
    });
    return sites;
  }

  buildNav() {
    const ul = document.querySelector('#navbar ul');
    ul.innerHTML = '';
    [config.allLabel, ...this.categories].forEach(label => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.dataset.category = label;
      b.addEventListener('click', () => this.filter(label));
      li.append(b);
      ul.append(li);
    });
  }

  filter(category) {
    this.layout.hidePreview();
    const all = category === config.allLabel;
    this.sites.forEach((s, i) => {
      const show = all || s.categories.includes(category);
      this.cards[i].hidden = !show;
      if (show) this.markers[i].marker.addTo(this.map); else this.markers[i].marker.remove();
    });
    this.fitToVisible();
    this.setActive(category);
  }

  setActive(category) {
    document.querySelectorAll('#navbar button')
      .forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === category)));
  }

  addCard(i, s) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    b.id = `thumbnail-${i}`;
    const img = document.createElement('img');
    img.className = 'thumbnail';
    img.src = s.thumbnail;
    img.alt = '';                      // the title below names the work
    img.loading = 'lazy';
    const t = document.createElement('span');
    t.textContent = s.title;
    b.append(img, t);
    b.addEventListener('click', () => { this.select(i); this.openDetail(i, b); });
    this.grid.append(b);
    return b;
  }

  onMarker(n) {
    this.select(n);
    if (this.layout.isPhone()) this.layout.preview(this.sites[n], n);
    else this.openDetail(n);
  }

  select(i) {
    if (this.sel >= 0) this.markers[this.sel]?.setSelected(false);
    this.sel = i;
    if (i >= 0) this.markers[i]?.setSelected(true);
  }

  fitToVisible() {
    const pts = this.markers.filter((m, i) => !this.cards[i].hidden).map(m => m.getLatLng());
    if (!pts.length) return;
    const [x, y] = config.fitPadding;
    const bottom = this.layout.isPhone() ? config.fitPaddingBottomPhone : y;
    this.map.fitBounds(pts, {paddingTopLeft: [x, y], paddingBottomRight: [x, bottom], maxZoom: 16});
  }

  // Markers closer than 20 m are hard to tap apart; report them (visible with ?debug).
  checkOverlaps() {
    const close = [];
    for (let a = 0; a < this.markers.length; a++) {
      for (let b = a + 1; b < this.markers.length; b++) {
        if (this.map.distance(this.markers[a].getLatLng(), this.markers[b].getLatLng()) < 20) {
          close.push(`${this.sites[a].title} / ${this.sites[b].title}`);
        }
      }
    }
    if (!close.length) return;
    console.warn('Markers within 20 m:', close);
    if (location.search.includes('debug')) this.notice(`Markers within 20 m: ${close.join('; ')}`);
  }

  openDetail(i, opener) { this.detail.show(this.sites[i], opener); }

  notice(text) {
    const d = document.createElement('div');
    d.className = 'notice';
    d.setAttribute('role', 'status');
    d.textContent = text;
    this.grid.before(d);
  }
}
