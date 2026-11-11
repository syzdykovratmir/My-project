"""Download Commons files straight from upload.wikimedia.org (no API calls).
URL path = md5(filename)[0]/md5[0:2]/filename; all files use the
standard 960/1280 px thumbnail. Writes src/data/assets.json from assets_meta.tsv.
Usage: python3 -I fetch_direct.py <assets_meta.tsv> <photos dir> <assets.json>"""
import sys, os, json, time, hashlib, urllib.parse, urllib.request
UA = 'DocumentaryAssetFetcher/1.0 (educational documentary video)'
meta, outdir, outjson = sys.argv[1:4]
assets = json.load(open(outjson)) if os.path.exists(outjson) else {}
def get(url):
    for i in range(10):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=60).read()
        except Exception as e:
            print('retry', e, file=sys.stderr); time.sleep(30)
    return None
for line in open(meta, encoding='utf-8'):
    if line.startswith('#') or not line.strip(): continue
    aid, title, cap, used, w, h, lic, author, date = line.rstrip('\n').split('\t')
    w, h = int(w), int(h)
    name = title[5:].replace(' ', '_')
    md = hashlib.md5(name.encode('utf-8')).hexdigest()
    q = urllib.parse.quote(name)
    base = f'https://upload.wikimedia.org/wikipedia/commons/{md[0]}/{md[:2]}/{q}'
    low = name.lower()
    # Wikimedia throttles original downloads; standard thumbnail widths (960/1280) are served from cache.
    tw = 1280 if w >= 1280 else 960
    src = f'https://upload.wikimedia.org/wikipedia/commons/thumb/{md[0]}/{md[:2]}/{q}/{tw}px-{q}'
    if low.endswith(('.tif', '.tiff')): src += '.jpg'
    ext = '.png' if low.endswith('.png') else '.jpg'
    dw, dh = tw, round(h * tw / w)
    fn = aid + ext
    if not os.path.exists(os.path.join(outdir, fn)):
        data = get(src)
        if not data: print('FAILED', aid, src); continue
        open(os.path.join(outdir, fn), 'wb').write(data)
        time.sleep(12)
    assets[aid] = {'file': fn, 'title': title, 'caption': cap, 'used_in': used, 'author': author, 'date': date,
                   'license': lic, 'source': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')),
                   'width': dw, 'height': dh}
    json.dump(assets, open(outjson, 'w'), ensure_ascii=False, indent=1)
    print('ok', aid, fn)
