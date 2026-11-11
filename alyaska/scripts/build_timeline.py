"""Build src/data/timeline.json (frame-exact scene layout) and out/alyaska.srt.
Scene k starts at sum(previous durations) - k*TRANSITION, matching TransitionSeries.
Usage: python3 -I build_timeline.py <alyaska dir>"""
import json, sys, os, re
root = sys.argv[1]
FPS, T = 30, 15
scenes = json.load(open(os.path.join(root, 'src/data/scenes.json'), encoding='utf-8'))
caps = json.load(open(os.path.join(root, 'src/data/captions.json'), encoding='utf-8'))
out, start = [], 0
for i, s in enumerate(scenes):
    if s['id'] in caps:
        audio = caps[s['id']]['durationMs'] / 1000
        dur = round((s['lead'] + audio + s['tail']) * FPS)
        narr = start + round(s['lead'] * FPS)
    else:
        audio, dur, narr = 0, round(s['fixed'] * FPS), None
    out.append({**s, 'from': start, 'durationInFrames': dur, 'narrationFrom': narr,
                'leadFrames': round(s.get('lead', 0) * FPS), 'audioFrames': round(audio * FPS)})
    start += dur - T
total = start + T
json.dump({'fps': FPS, 'transition': T, 'totalFrames': total, 'scenes': out},
          open(os.path.join(root, 'src/data/timeline.json'), 'w'), ensure_ascii=False, indent=1)
print('total', total, 'frames =', f'{int(total / FPS // 60)}:{total / FPS % 60:04.1f}')
for s in out: print(s['id'], s['from'], s['durationInFrames'], f"{int(s['from']/FPS//60)}:{s['from']/FPS%60:04.1f}")

# --- SRT: pages of max 2 lines x 42 chars, same rules as Subtitles.tsx ---
def fits(txt):
    if len(' '.join(txt)) <= 42: return True
    return any(max(len(' '.join(txt[:k])), len(' '.join(txt[k:]))) <= 42 for k in range(1, len(txt)))
def pages(words):
    res, cur = [], []
    for i, w in enumerate(words):
        if cur and not fits([x['text'] for x in cur + [w]]):
            res.append(cur); cur = []
        cur.append(w)
        if w['paraEnd'] or (re.search(r'[.?!]$', w['text']) and len(' '.join(x['text'] for x in cur)) > 38):
            res.append(cur); cur = []
    if cur: res.append(cur)
    return res
def lines(ws):
    txt = [w['text'] for w in ws]
    if len(' '.join(txt)) <= 42: return [' '.join(txt)]
    best = None
    for k in range(1, len(txt)):
        a, b = ' '.join(txt[:k]), ' '.join(txt[k:])
        sc = max(len(a), len(b))
        if best is None or sc < best[0]: best = (sc, a, b)
    return [best[1], best[2]]
def ts(sec):
    ms = int(round(sec * 1000)); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); s, ms = divmod(ms, 1000)
    return f'{h:02}:{m:02}:{s:02},{ms:03}'
n, srt = 0, []
for s in out:
    if s['narrationFrom'] is None: continue
    base = s['narrationFrom'] / FPS
    pg = pages(caps[s['id']]['words'])
    for j, p in enumerate(pg):
        st = base + p[0]['startMs'] / 1000
        en = base + p[-1]['endMs'] / 1000 + 0.3
        if j + 1 < len(pg): en = min(en, base + pg[j + 1][0]['startMs'] / 1000 - 0.02)
        n += 1
        srt.append(f"{n}\n{ts(st)} --> {ts(en)}\n" + '\n'.join(lines(p)) + '\n')
os.makedirs(os.path.join(root, 'out'), exist_ok=True)
open(os.path.join(root, 'out/alyaska.srt'), 'w', encoding='utf-8').write('\n'.join(srt))
print('srt cues', n)
