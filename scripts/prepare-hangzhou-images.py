"""Create bounded WebP assets from the user's Hangzhou image uploads; keep originals."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

root = Path(__file__).resolve().parent.parent
uploads = Path('C:/Users/29644/Downloads')
output = root / 'public' / 'hangzhou-photography'
sources = [
    ('lake-blue', 'AI_1794146758287.png'),
    ('city-colours', 'AI_1794146855883.png'),
    ('lakeside-road', 'AI_1794146630118.png'),
    ('tea-green', 'AI_1794146664849.png'),
    ('river-towers', 'AI_1794146595648.png'),
    ('golden-lane', 'AI_1794146617024.png'),
    ('river-evening', 'AI_1794146579800.png'),
    ('city-blue', 'AI_1794146586746.png'),
    ('pagoda-lake', 'pexels-oner-st-2156053648-37254296.jpg'),
]
output.mkdir(parents=True, exist_ok=True)
records = []
for identity, filename in sources:
    source = uploads / filename
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        renditions = []
        for width in (640, 1600):
            rendition = image.copy()
            rendition.thumbnail((width, 1800), Image.Resampling.LANCZOS)
            destination = output / f'{identity}-{width}.webp'
            rendition.save(destination, 'WEBP', quality=79, method=6)
            renditions.append({'src': '/hangzhou-photography/' + destination.name, 'width': rendition.width, 'height': rendition.height, 'bytes': destination.stat().st_size})
        records.append({'id': identity, 'suppliedFilename': filename, 'originalSha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'rightsStatus': 'unverified-user-supplied', 'locationStatus': 'illustrative-not-location-verified', 'renditions': renditions})
(output / 'provenance.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(records)} Hangzhou mood photographs; {sum(r["bytes"] for p in records for r in p["renditions"]):,} rendition bytes. Originals preserved.')
