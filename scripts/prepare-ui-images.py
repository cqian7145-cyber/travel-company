"""Build responsive web renditions of the eight user-supplied photos. Requires existing Pillow."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

ROOT = Path(__file__).resolve().parent.parent
DOWNLOADS = Path('C:/Users/29644/Downloads')
OUTPUT = ROOT / 'public' / 'photography'
SOURCES = [
    ('shanghai-greeting', 'greetings from Shanghai (1).jpg'),
    ('pudong-blue-hour', 'Night lights of Shanghai ✨🌃 (1).jpg'),
    ('bund-clocktower', 'the bund shanghai.jpg'),
    ('pudong-night', 'The bund.jpg'),
    ('bund-dusk', 'pexels-olivia-cai-2152171456-32062049.jpg'),
    ('shanghai-street', 'pexels-throughnislens-31772157.jpg'),
    ('bund-night-street', 'pexels-biravencrow-35367634.jpg'),
    ('riverside-evening', 'pexels-yan-zhang-210144339-25792280.jpg'),
]
OUTPUT.mkdir(parents=True, exist_ok=True)
records = []
for identity, filename in SOURCES:
    source = DOWNLOADS / filename
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        renditions = []
        for width in (640, 1600):
            copy = image.copy()
            copy.thumbnail((width, 2000), Image.Resampling.LANCZOS)
            destination = OUTPUT / f'{identity}-{width}.webp'
            copy.save(destination, 'WEBP', quality=82, method=6)
            renditions.append({'src': '/photography/' + destination.name, 'width': copy.width, 'height': copy.height, 'bytes': destination.stat().st_size})
        records.append({'id': identity, 'suppliedFilename': filename, 'originalSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'rightsStatus': 'unverified-user-supplied-local-preview', 'renditions': renditions})
(OUTPUT / 'provenance.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(records)} photographs, {sum(r["bytes"] for p in records for r in p["renditions"]):,} bytes of responsive WebP assets. Originals unchanged.')
