"""Create bounded WebP assets from the Guiyang photo uploads; keep originals."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

root = Path(__file__).resolve().parent.parent
output = root / 'public' / 'guiyang-photography'
sources = [
    ('taiping-road', Path('C:/Users/29644/Downloads/AI_1794204545485.png')),
    ('eco-center', Path('C:/Users/29644/AppData/Local/Temp/codex-clipboard-4a2d55bd-8fb5-4024-a3b9-680bf28b71c6.png')),
    ('white-house', Path('C:/Users/29644/AppData/Local/Temp/codex-clipboard-c3010039-0c21-43c9-ba2a-d43ddf05a0cd.png')),
    ('jiaxiu-night', Path('C:/Users/29644/AppData/Local/Temp/codex-clipboard-e9b2fa22-f6af-42a0-a76c-7d25f4760e8f.png')),
    ('dolphin-square', Path('C:/Users/29644/Downloads/AI_1794204245398.png')),
    ('qianling-mountain', Path('C:/Users/29644/Downloads/AI_1794215938802.png')),
    ('huaxi-park', Path('C:/Users/29644/Downloads/AI_1794216013328.png')),
]
output.mkdir(parents=True, exist_ok=True)
records = []
for identity, source in sources:
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGB')
        renditions = []
        for width in (640, 1600):
            rendition = image.copy()
            rendition.thumbnail((width, 1800), Image.Resampling.LANCZOS)
            destination = output / f'{identity}-{width}.webp'
            rendition.save(destination, 'WEBP', quality=79, method=6)
            renditions.append({'src': '/guiyang-photography/' + destination.name, 'width': rendition.width, 'height': rendition.height, 'bytes': destination.stat().st_size})
        records.append({
            'id': identity,
            'suppliedFilename': source.name,
            'originalSha256': hashlib.sha256(source.read_bytes()).hexdigest(),
            'rightsStatus': 'unverified-user-supplied',
            'labelStatus': 'user-supplied-by-photo-order',
            'renditions': renditions,
        })
(output / 'provenance.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(records)} Guiyang photos; {sum(r["bytes"] for p in records for r in p["renditions"]):,} rendition bytes. Originals preserved.')
