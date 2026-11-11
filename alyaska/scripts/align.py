"""Align ElevenLabs Scribe word timings to the display tokens of the script.
Usage: python3 -I align.py script_parsed.json transcripts_raw.json captions.json"""
import json, sys, re, difflib
parsed = json.load(open(sys.argv[1], encoding='utf-8'))
raw = json.load(open(sys.argv[2], encoding='utf-8'))
order = ['s01','s03','s04','s05','s06','s07','s08','s09','s10','s11']
norm = lambda w: re.sub(r'[^\w]', '', w.lower().replace('ё', 'е'))
out = {}
for sid, tr in zip(order, raw):
    toks = parsed[sid]['tokens']
    spoken = []  # (norm word, token index)
    for ti, t in enumerate(toks):
        for w in t['s']:
            for part in re.split(r'[\s]+', w):
                if norm(part): spoken.append((norm(part), ti))
    words = [w for w in tr['words'] if norm(w['text'])]
    a = [s[0] for s in spoken]; b = [norm(w['text']) for w in words]
    sm = difflib.SequenceMatcher(a=a, b=b, autojunk=False)
    times = [None] * len(a)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size):
            w = words[blk.b + k]; times[blk.a + k] = (w['start'], w['end'])
    matched = sum(t is not None for t in times)
    # interpolate unmatched
    for i in range(len(times)):
        if times[i] is None:
            prev = next((times[j][1] for j in range(i - 1, -1, -1) if times[j]), 0.0)
            nxt = next((times[j][0] for j in range(i + 1, len(times)) if times[j]), tr['duration'])
            times[i] = (prev, max(prev, nxt))
    res = []
    for ti, t in enumerate(toks):
        idx = [i for i, s in enumerate(spoken) if s[1] == ti]
        if not idx: continue
        st = min(times[i][0] for i in idx); en = max(times[i][1] for i in idx)
        d = t['d']
        res.append({'text': d, 'startMs': round(st * 1000), 'endMs': round(en * 1000),
                    'em': bool(t.get('num')) or bool(re.search(r'\d', d)), 'paraEnd': bool(t.get('para_end'))})
    out[sid] = {'durationMs': round(tr['duration'] * 1000), 'words': res}
    print(sid, f'matched {matched}/{len(a)}', 'tokens', len(res))
json.dump(out, open(sys.argv[3], 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
