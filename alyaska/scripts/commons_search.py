"""Search Wikimedia Commons files and print title, size, license, author.
Usage: python3 commons_search.py "query" [limit]"""
import sys, json, urllib.request, urllib.parse, re, time
UA = 'DocumentaryAssetFetcher/1.0 (educational documentary video)'
def api(params):
    params.update(format='json')
    url = 'https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)
    for i in range(6):
        try:
            return json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=30))
        except Exception as e:
            time.sleep(6 * (i + 1))
    raise SystemExit('api failed')
def strip(h): return re.sub('<[^>]+>', '', h or '').strip()[:80]
q = sys.argv[1]; lim = int(sys.argv[2]) if len(sys.argv) > 2 else 8
r = api({'action': 'query', 'generator': 'search', 'gsrsearch': q, 'gsrnamespace': 6, 'gsrlimit': lim,
         'prop': 'imageinfo', 'iiprop': 'url|size|extmetadata|mime'})
for p in sorted(r.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
    ii = p['imageinfo'][0]; m = ii.get('extmetadata', {})
    if not ii['mime'].startswith('image'): continue
    print(f"{p['title']} | {ii['width']}x{ii['height']} | {strip(m.get('LicenseShortName',{}).get('value'))} | {strip(m.get('Artist',{}).get('value'))} | {strip(m.get('DateTimeOriginal',{}).get('value'))}")
