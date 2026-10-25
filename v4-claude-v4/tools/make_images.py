#!/usr/bin/env python3
"""
make_images.py -- prepare web images for the storymap, and audit what the CSV points at.

  python make_images.py build originals media
      For every .jpg/.jpeg/.png in 'originals', write
        media/<name>.jpg         display image, longest edge <= 1600 px
        media/<name>-thumb.jpg   thumbnail,     longest edge <= 400 px
      Never enlarges. Applies EXIF rotation, then strips all metadata (including GPS).
      Skips files that are already up to date; use --force to redo everything.
      Keep your full-size originals in 'originals' (outside the website folder).

  python make_images.py audit csv/sites.csv .
      Lists the image files each CSV row references: missing files, file size and pixel size,
      and a warning for anything too heavy for a phone.

Install:  pip install pillow
"""
import argparse, csv, shutil, sys
from pathlib import Path
from PIL import Image, ImageOps

DISPLAY_MAX, THUMB_MAX, QUALITY = 1600, 400, 82
EXTS = {'.jpg', '.jpeg', '.png'}


def load(path):
    img = ImageOps.exif_transpose(Image.open(path))
    if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
        img = img.convert('RGBA')
        flat = Image.new('RGB', img.size, 'white')       # JPEG has no transparency
        flat.paste(img, mask=img.split()[-1])
        return flat
    return img.convert('RGB')


def is_light(f, img):
    """Already web-sized? Then keep the file untouched instead of re-compressing it."""
    if f.suffix.lower() not in ('.jpg', '.jpeg'):
        return False
    with Image.open(f) as raw:
        has_meta = bool(raw.getexif())
    return max(img.size) <= DISPLAY_MAX and f.stat().st_size <= 600 * 1024 and not has_meta


def save(img, path, max_edge):
    out = img.copy()
    out.thumbnail((max_edge, max_edge), Image.LANCZOS)   # only ever shrinks
    out.save(path, 'JPEG', quality=QUALITY, optimize=True, progressive=True)
    return out.size


def build(src, dst, force):
    src, dst = Path(src), Path(dst)
    dst.mkdir(parents=True, exist_ok=True)
    for f in sorted(src.iterdir()):
        if f.suffix.lower() not in EXTS or f.stem.endswith('-thumb'):
            continue
        main, thumb = dst / f'{f.stem}.jpg', dst / f'{f.stem}-thumb.jpg'
        if not force and main.exists() and thumb.exists() and min(main.stat().st_mtime, thumb.stat().st_mtime) > f.stat().st_mtime:
            print(f'up to date  {f.name}')
            continue
        img = load(f)
        light = is_light(f, img)
        if light:
            if f.resolve() != main.resolve():
                shutil.copyfile(f, main)
            w, h = img.size
        else:
            w, h = save(img, main, DISPLAY_MAX)
        tw, th = save(img, thumb, THUMB_MAX)
        print(f'{f.name:34} {f.stat().st_size/1024:8.0f} KB -> {main.name} {w}x{h} {main.stat().st_size/1024:.0f} KB{" (kept as is)" if light else ""}, '
              f'{thumb.name} {tw}x{th} {thumb.stat().st_size/1024:.0f} KB')


def audit(csv_path, root):
    root = Path(root)
    with open(csv_path, newline='', encoding='utf-8-sig') as fh:
        rows = list(csv.DictReader(fh))
    norm = lambda r: {k.strip().lower().replace(' ', ''): (v or '').strip() for k, v in r.items()}
    limits = {'medialink': (800, 2000, 600), 'thumbnail': (150, 600, 280)}   # (max KB, max px, min px) before a warning
    problems = 0
    for n, r in enumerate(map(norm, rows), start=2):
        print(f"\nCSV line {n}: {r.get('chapter', '')}")
        for field, (max_kb, max_px, min_px) in limits.items():
            ref = r.get(field, '')
            if not ref:
                print(f'  {field:10} (empty)'); continue
            p = root / ref
            if not p.exists():
                print(f'  {field:10} MISSING  {ref}'); problems += 1; continue
            kb = p.stat().st_size / 1024
            with Image.open(p) as im:
                w, h = im.size
            flag = ''
            if kb > max_kb or max(w, h) > max_px:
                flag = '  <-- too heavy'
            elif max(w, h) < min_px:
                flag = '  <-- low resolution'
            problems += bool(flag)
            print(f'  {field:10} {w}x{h}  {kb:.0f} KB  {ref}{flag}')
    print(f'\n{problems} problem(s) found.')


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest='cmd', required=True)
    b = sub.add_parser('build'); b.add_argument('src'); b.add_argument('dst'); b.add_argument('--force', action='store_true')
    a = sub.add_parser('audit'); a.add_argument('csv'); a.add_argument('root')
    args = ap.parse_args()
    build(args.src, args.dst, args.force) if args.cmd == 'build' else audit(args.csv, args.root)
