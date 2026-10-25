const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export class StoryDialog {
  constructor(i, site) {
    this.site = site;
    const id = `dialog-${i}`;
    // site.description is trusted HTML from the CSV; sanitizing it comes in a later step.
    document.body.insertAdjacentHTML('beforeend',
      `<dialog id="${id}" class="image-container" aria-label="${esc(site.title)}">` +
        `<button type="button" class="dialog-close" style="float: right; margin:20px;">close</button>` +
        `<img src="${esc(site.image)}" style="margin: 0 auto; width: 50%" alt="${esc(site.title)}" loading="lazy">` +
        `<div style="overflow-y: auto; padding: 30px; padding-top:0px; padding-bottom: 0px;">` +
          `<h4>${esc(site.title)}</h4>${site.description}` +
        `</div>` +
      `</dialog>`);
    document.querySelector(`#${id} .dialog-close`)
      .addEventListener('click', () => document.getElementById(id).close());
  }
}
