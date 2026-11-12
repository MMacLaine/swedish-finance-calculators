#!/usr/bin/env python3
"""Pilot criterion (ii): every quoted string in a judge's output must appear word for word
in the page it cites (a dump file, or the URL fetched fresh). Non-match = fabricated.

  python3 -I quote-match.py results/judge-run1.jsonl [dumps_dir]

Walks every JSON object in the file, finds each dict with a "quote" (string or list) and
its nearest "source". Normalisation is whitespace only: any run of whitespace, including
no-break and narrow no-break spaces, becomes one space. A second, looser tier (case and
typographic quotes/dashes folded) is printed for diagnosis but does not count as a match.
"""
import html, json, re, sys, urllib.request
from pathlib import Path

WS = re.compile(r'[\s   ​]+')
def norm(s): return WS.sub(' ', s).strip()
def loose(s):
    s = norm(s).lower()
    for a, b in (('–', '-'), ('—', '-'), ('−', '-'), ('“', '"'), ('”', '"'), ('’', "'"), ('‘', "'"), ('«', '"'), ('»', '"')):
        s = s.replace(a, b)
    return s

def page_text(src, dumps, cache):
    if src in cache: return cache[src]
    text = None
    name = Path(src.split(' ')[0].split('@')[0]).name
    if name.endswith('.json') and (dumps / name).exists():
        text = json.loads((dumps / name).read_text())['text']
    else:
        m = re.search(r'https?://\S+', src)
        if m:
            url = m.group(0).rstrip(').,;')
            # a dump of the same URL counts too: the judge may have read either
            parts = [json.loads(p.read_text())['text'] for p in dumps.glob('*.json')
                     if json.loads(p.read_text())['url'].rstrip('/').split('#')[0] == url.rstrip('/').split('#')[0]]
            try:
                req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 quote-match'})
                raw = urllib.request.urlopen(req, timeout=20).read().decode('utf-8', 'replace')
                raw = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', raw)
                parts.append(html.unescape(re.sub(r'<[^>]+>', ' ', raw)))
                parts.append(html.unescape(raw))  # quotes from meta/attributes
            except Exception as e:
                parts.append('')
                print(f'  fetch failed {url}: {e}', file=sys.stderr)
            text = '\n'.join(parts)
    cache[src] = text
    return text

def walk(o, src=None, path=''):
    if isinstance(o, dict):
        src = o.get('source') or o.get('source_url') or o.get('dump') or src
        if isinstance(src, list): src = ' '.join(map(str, src))
        for key in ('quote', 'quotes', 'extra_quotes'):
            q = o.get(key)
            for qq in (q if isinstance(q, list) else [q] if q else []):
                if isinstance(qq, str): yield f'{path}.{key}', qq, src
        for k, v in o.items():
            if k not in ('quote', 'quotes', 'extra_quotes'): yield from walk(v, src, f'{path}.{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from walk(v, src, f'{path}[{i}]')

def main():
    out = Path(sys.argv[1]); dumps = Path(sys.argv[2]) if len(sys.argv) > 2 else out.parent.parent / 'dumps'
    objs, dec, s, i = [], json.JSONDecoder(), out.read_text(), 0
    while True:
        m = re.compile(r'\S').search(s, i)
        if not m: break
        o, i = dec.raw_decode(s, m.start()); objs.append(o)
    cache, rows = {}, []
    for n, o in enumerate(objs):
        for path, q, src in walk(o, path=f'#{n}'):
            text = page_text(str(src or ''), dumps, cache) if src else None
            if text is None: verdict = 'NO-SOURCE'
            elif norm(q) in norm(text): verdict = 'MATCH'
            elif loose(q) in loose(text): verdict = 'LOOSE-ONLY'
            else: verdict = 'FABRICATED?'
            rows.append({'verdict': verdict, 'path': path, 'source': src, 'quote': q})
    counts = {}
    for r in rows: counts[r['verdict']] = counts.get(r['verdict'], 0) + 1
    print(json.dumps({'file': str(out), 'quotes': len(rows), 'counts': counts}, ensure_ascii=False))
    for r in rows:
        if r['verdict'] != 'MATCH': print(json.dumps(r, ensure_ascii=False))
    (out.parent / (out.stem + '.quote-match.json')).write_text(json.dumps(rows, ensure_ascii=False, indent=1))

if __name__ == '__main__': main()
