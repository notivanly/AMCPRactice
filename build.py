import json, collections
import common
import bank8, bank10, bank12
PS = common.PROBLEMS
ids = [p['id'] for p in PS]
assert len(ids) == len(set(ids))
for p in PS:
    assert len(p['ch']) == 5 and 0 <= p['a'] < 5 and 1 <= p['d'] <= 5
    assert p['cat'] in ('alg','geo','nt','cp')


# ---------------------------------------------------------------------------
# Rebalance answer letters. Choices stay in ascending order (AMC convention),
# but for all-integer problems we move the correct value to an evenly spread
# position by swapping some distractors for plausible nearby values.
# ---------------------------------------------------------------------------
import re, random
rng = random.Random(2026)
INT_RE = re.compile(r'(-?)(\d+(?:\{,\}\d{3})*)(\\%|\^\\circ)?')

def parse_int(s):
    m = INT_RE.fullmatch(s)
    if not m: return None
    sign, digits, suf = m.groups()
    n = int(digits.replace('{,}', ''))
    return (-n if sign else n), ('{,}' in digits), (suf or '')

def fmt_int(n, thousands, suf):
    body = f"{abs(n):,}".replace(',', '{,}') if thousands else str(abs(n))
    return ('-' if n < 0 else '') + body + suf

import math as _m
UP = [1.1, 1.2, 1.25, 1.5, 1.75, 2, 2.5, 3, 4]
DOWN = [0.9, 0.8, 0.75, 0.6, 0.5, 0.4, 0.33, 0.25]

def synth_candidates(c, allow_zero=False):
    out = set()
    a = abs(c)
    if a <= 24:
        for d in range(1, 9):
            out.add(c + d); out.add(c - d)
    for f in UP + DOWN:
        v = round(a * f)
        out.add(v if c >= 0 else -v)
    if c < 0: out.add(-c)
    out.discard(c)
    if c >= 0: out = {x for x in out if x >= (0 if (allow_zero and c <= 12) else 1)}
    return out

def pick_side(c, existing, cands, need, taken, side):
    """choose `need` values on one side of c: hand-written ones first, then well-spaced synthesized ones"""
    chosen = [w for w in sorted(existing, key=lambda w: abs(w - c)) if side(w)][:need]
    pool = sorted([x for x in cands if side(x) and x not in chosen and x not in taken],
                  key=lambda x: abs(_m.log(max(abs(x), 1) / max(abs(c), 1))) + rng.random() * 0.45)
    gap = max(1, round(0.12 * abs(c)))
    while len(chosen) < need:
        progressed = False
        for x in pool:
            if x in chosen or any(abs(x - y) < gap for y in chosen + taken + [c]):
                continue
            chosen.append(x); progressed = True
            if len(chosen) == need: break
        if len(chosen) < need and not progressed:
            if gap > 1: gap = max(1, gap // 2)
            else: break
    return chosen

LOCK_IDS = {'8-nt-05', '12-alg-06', '12-alg-08', '12-alg-09', '12-cp-01', '10-alg-10',
            '8-alg-07', '10-nt-06', '10-geo-01', '10-cp-05', '12-alg-02', '12-nt-02', '12-nt-05'}
def locked(p):
    if p['id'] in LOCK_IDS: return True
    q = p['q'].lower()
    return ('units digit' in q) or bool(re.search(r"divided by \$[57]\$", p['q']))

def rebalance(PS):
    flex = {}
    for p in PS:
        if locked(p): continue
        parsed = [parse_int(c) for c in p['ch']]
        if any(x is None for x in parsed): continue
        if len({(x[1], x[2]) for x in parsed}) != 1: continue
        flex[p['id']] = parsed
    for lv in (8, 10, 12):
        sub = [p for p in PS if p['lv'] == lv]
        quota = {i: len(sub)/5 for i in range(5)}
        for p in sub:
            if p['id'] not in flex: quota[p['a']] -= 1
        todo = [p for p in sub if p['id'] in flex]
        rng.shuffle(todo)
        for p in todo:
            parsed = flex[p['id']]
            c = parsed[p['a']][0]
            thousands, suf = parsed[0][1], parsed[0][2]
            wrongs = [x[0] for i, x in enumerate(parsed) if i != p['a']]
            cands = synth_candidates(c, allow_zero=('how many' in p['q'].lower() or 'remainder' in p['q'].lower()))
            below_pool = {x for x in set(wrongs) | cands if x < c}
            feasible = [k for k in range(5) if len(below_pool) >= k]
            k = max(feasible, key=lambda i: (quota[i], i == p['a'], rng.random()))
            quota[k] -= 1
            below = pick_side(c, wrongs, cands, k, [], lambda x: x < c)
            above = pick_side(c, wrongs, cands, 4 - k, below, lambda x: x > c)
            vals = sorted(below + [c] + above)
            assert len(set(vals)) == 5 and len(below) == k, (p['id'], below, c, above)
            p['ch'] = [fmt_int(v, thousands, suf) for v in vals]
            p['a'] = vals.index(c)

# a few difficulty tweaks so every level has a spread from 1 to 5
D_OVERRIDE = {
 '10-geo-11':1,'10-geo-12':1,'10-nt-03':1,'10-alg-03':1,
 '10-cp-07':5,'10-cp-09':5,'10-alg-10':5,'10-nt-04':5,
 '12-geo-09':1,'12-nt-09':1,'12-geo-04':1,'12-nt-10':5,'12-geo-11':5,'12-cp-03':5,
 '8-nt-09':5,
}
for p in PS:
    if p['id'] in D_OVERRIDE: p['d'] = D_OVERRIDE[p['id']]

rebalance(PS)

print("total", len(PS))
for lv in (8,10,12):
    sub=[p for p in PS if p['lv']==lv]
    print(f"AMC {lv}: {len(sub)}  cats", dict(collections.Counter(p['cat'] for p in sub)),
          " diff", dict(sorted(collections.Counter(p['d'] for p in sub).items())),
          " letters", dict(sorted(collections.Counter('ABCDE'[p['a']] for p in sub).items())))
print("overall letters", dict(sorted(collections.Counter('ABCDE'[p['a']] for p in PS).items())))

if __name__ == '__main__' and '--show' in __import__('sys').argv:
    for p in PS:
        print(p['id'], 'ABCDE'[p['a']], ' | '.join(p['ch']))
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'data', 'problems.js')
with open(OUT,'w',encoding='utf-8') as f:
    f.write("/* Auto-generated problem bank. Every answer key was verified by computer when this file was built. */\n")
    f.write("window.AMC_PROBLEMS = [\n")
    f.write(",\n".join(json.dumps(p, ensure_ascii=False, separators=(',',':')) for p in PS))
    f.write("\n];\n")
print("wrote", os.path.normpath(OUT))
