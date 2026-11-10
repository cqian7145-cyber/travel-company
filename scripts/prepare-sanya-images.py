"""Create bounded WebP assets, record duplicate uploads, and preserve originals."""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib
import json

root = Path(__file__).resolve().parent.parent
output = root / 'public' / 'sanya-photography'
downloads = Path('C:/Users/29644/Downloads')
sources = [
    ('sanya-cover', downloads / 'AI_1794215163473.png'),
    ('nanshan', downloads / 'AI_1794215275127.png'),
    ('west-island', downloads / 'AI_1794215287402.png'),
    ('dadonghai-bar', downloads / 'AI_1794215427060.png'),
    ('coconut-corridor', downloads / 'AI_1794215556195.png'),
    ('tianya-haijiao', downloads / 'AI_1794215623256.png'),
    ('sun-bay', downloads / 'AI_1794215704838.png'),
    ('haitang-bay', downloads / 'AI_1794215715187.png'),
    ('dadonghai-beach', downloads / 'AI_1794215729653.png'),
    ('tianya-duplicate', Path('C:/Users/29644/AppData/Local/Temp/codex-clipboard-be36d2f9-4ffd-4701-b9a3-d956a10534b7.png')),
    ('wuzhizhou', downloads / 'AI_1794215228214.png'),
]
output.mkdir(parents=True, exist_ok=True)
records, hashes = [], {}
for index, (identity, source) in enumerate(sources, 1):
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    record = {'id': identity, 'uploadIndex': index, 'suppliedFilename': source.name,
              'originalSha256': digest, 'rightsStatus': 'unverified-user-supplied',
              'labelStatus': 'user-supplied-by-photo-order'}
    if digest in hashes:
        record.update({'duplicateOf': hashes[digest], 'renditions': [],
                       'note': 'Contributor confirmed showing one copy under Tianya Haijiao.'})
    else:
        hashes[digest] = identity
        with Image.open(source) as raw:
            picture = ImageOps.exif_transpose(raw).convert('RGB')
            renditions = []
            for width in (640, 1600):
                image = picture.copy()
                image.thumbnail((width, 1800), Image.Resampling.LANCZOS)
                path = output / f'{identity}-{width}.webp'
                image.save(path, 'WEBP', quality=79, method=6)
                renditions.append({'src': '/sanya-photography/' + path.name,
                                   'width': image.width, 'height': image.height, 'bytes': path.stat().st_size})
            record['renditions'] = renditions
    records.append(record)
(output / 'provenance.json').write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'{len(records)} uploads; {len(hashes)} unique photos; originals preserved.')
