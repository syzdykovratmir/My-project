"""Разбирает src/data/script.txt -> spoken text per scene + display tokens.
Usage: python3 parse_script.py <script.txt> <out.json>"""
import re, json, sys
src = open(sys.argv[1], encoding='utf-8').read()
scenes = {}
cur = None
for line in src.splitlines():
    if line.startswith('#'): continue
    if line.startswith('@@'):
        cur = line[2:].strip(); scenes[cur] = []; continue
    if cur and line.strip(): scenes[cur].append(line.strip())
out = {}
for sid, paras in scenes.items():
    spoken_paras, tokens = [], []  # tokens: {display, spoken:[words]}
    for p in paras:
        sp = re.sub(r'\{([^|}]*)\|([^}]*)\}', r'\2', p)
        spoken_paras.append(sp)
        # tokenise display: braces become one display token with spoken words
        pos = 0
        for m in re.finditer(r'\{([^|}]*)\|([^}]*)\}|(\S+)', p):
            if m.group(3):
                w = m.group(3)
                tokens.append({'d': w, 's': [w]})
            else:
                tokens.append({'d': m.group(1), 's': m.group(2).split(), 'num': True})
        # glue punctuation directly after braces (e.g. "{1867|...}." -> handled since '.' becomes separate token?)
        tokens[-1]['para_end'] = True
    # merge punctuation-only tokens into previous
    merged = []
    for t in tokens:
        if merged and re.fullmatch(r'[.,:;!?»)]+', t['d']):
            merged[-1]['d'] += t['d']
            if t.get('para_end'): merged[-1]['para_end'] = True
        else:
            merged.append(t)
    out[sid] = {'spoken': '\n\n'.join(spoken_paras), 'tokens': merged}
json.dump(out, open(sys.argv[2], 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
for k, v in out.items():
    print(k, len(v['spoken'].split()), 'words', len(v['spoken']), 'chars')
