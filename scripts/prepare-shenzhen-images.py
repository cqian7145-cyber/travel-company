"""Preserve supplied originals; create bounded, uncropped local WebP renditions."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

root = Path(__file__).resolve().parent.parent
temp = Path('C:/Users/29644/AppData/Local/Temp')
downloads = Path('C:/Users/29644/Downloads')
sources = [
    ('shanghai', 'fuxing-park', downloads / 'AI_1794893631997.png'),
    ('shanghai', 'breakfast', downloads / 'AI_1794893676623.png'),
    ('shenzhen', 'seafront-boardwalk', temp / 'codex-clipboard-0c178161-9b31-4cd9-a3b4-7508a52fc736.png'),
    ('shenzhen', 'coastal-walk', temp / 'codex-clipboard-421cb05b-ab0b-43d1-bbd3-4738b7b7bf82.png'),
    ('shenzhen', 'bay-sunset', temp / 'codex-clipboard-5abeb8c4-04ed-4956-b233-c677810c83b4.png'),
    ('shenzhen', 'qianhai-stone-park', temp / 'codex-clipboard-60c7f586-e62d-4da2-8431-69743d10a9fa.png'),
    ('shenzhen', 'sea-world', temp / 'codex-clipboard-a75285a4-d5c9-46a1-93d3-9d32371bfc38.png'),
    ('shenzhen', 'fairy-lake', temp / 'codex-clipboard-9d31d9d0-05f9-4a0e-8c2b-79ecc0939358.png'),
    ('shenzhen', 'dameisha', temp / 'codex-clipboard-c092451f-6ff9-419d-9cf7-18b9a1f2e5ad.png'),
    ('shenzhen', 'waterfront-night', temp / 'codex-clipboard-72c218d9-f412-49dc-b04e-ee9e310f5b79.png'),
    ('shenzhen', 'shenzhen-bay-park', temp / 'codex-clipboard-f8c7b926-63a0-4d90-806b-6cccfb928292.png'),
]
records = {'shanghai': [], 'shenzhen': []}
for index, (city, identity, source) in enumerate(sources, 1):
    output = root / 'public' / f'{city}-photography'
    output.mkdir(parents=True, exist_ok=True)
    record = dict(id=identity, uploadIndex=index, suppliedFilename=source.name,
                  originalSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                  rightsStatus='unverified-user-supplied', cityLabelStatus='user-supplied', renditions=[])
    with Image.open(source) as raw:
        picture = ImageOps.exif_transpose(raw).convert('RGB')
        for width in (640, 1600):
            image = picture.copy()
            image.thumbnail((width, 2000), Image.Resampling.LANCZOS)
            path = output / f'{identity}-{width}.webp'
            image.save(path, 'WEBP', quality=82, method=6)
            record['renditions'].append(dict(src=f'/{city}-photography/{path.name}',
                                            width=image.width, height=image.height, bytes=path.stat().st_size))
    records[city].append(record)
for city, entries in records.items():
    (root / 'public' / f'{city}-photography' / 'november-17-provenance.json').write_text(
        json.dumps(entries, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('11 supplied images prepared; originals and collage labels preserved.')
