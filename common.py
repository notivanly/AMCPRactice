"""Shared helpers for building the AMC problem bank.

Every problem is written once with a `correct` answer and four `wrong` answers.
The build script sorts the five choices by numeric value (as the real AMC does),
works out the answer letter, and *verifies* the correct answer against `chk`
(an independently computed value) so a typo can never ship a wrong key.
"""
import re, math, itertools
from fractions import Fraction
import sympy as sp
from sympy import Rational as R, sqrt, pi, log, binomial, factorial, divisors, factorint, Integer
from sympy.parsing.sympy_parser import (parse_expr, standard_transformations,
                                        implicit_multiplication_application, convert_xor)

TR = standard_transformations + (implicit_multiplication_application, convert_xor)
PROBLEMS = []
_counts = {}
LETTERS = "ABCDE"

def lat2py(s):
    s = s.replace(r'\dfrac', r'\frac').replace(r'\tfrac', r'\frac')
    s = s.replace('{,}', '').replace(r'\%', '').replace(r'^\circ', '').replace(r'\,', '')
    s = s.replace(r'\cdot', '*').replace(r'\pi', 'pi')
    s = re.sub(r'\\ln\s*\(?(\d+)\)?', r'log(\1)', s)
    s = re.sub(r'\\sqrt\{([^{}]*)\}', r'sqrt(\1)', s)
    s = re.sub(r'\\sqrt(\d)', r'sqrt(\1)', s)
    while True:
        m = re.search(r'\\frac\{([^{}]*)\}\{([^{}]*)\}', s)
        if not m:
            break
        s = s[:m.start()] + '((' + m.group(1) + ')/(' + m.group(2) + '))' + s[m.end():]
    s = re.sub(r'\\frac(\d)(\d)', r'((\1)/(\2))', s)
    s = s.replace('{', '(').replace('}', ')')
    s = re.sub(r'(\d|\))(?=(sqrt|pi|log|\())', r'\1*', s)
    s = re.sub(r'\)(?=\d)', r')*', s)
    return s

def val(choice):
    e = parse_expr(lat2py(choice), transformations=TR,
                   local_dict={'pi': sp.pi, 'sqrt': sp.sqrt, 'log': sp.log})
    return float(sp.N(e, 30))

def P(lv, cat, d, topic, q, ans, wrong, chk, hint, sol):
    """lv: 8/10/12   cat: alg|geo|nt|cp   d: difficulty 1-5"""
    assert len(wrong) == 4, (q, wrong)
    allc = [ans] + list(wrong)
    vals = [val(c) for c in allc]
    assert len({round(v, 9) for v in vals}) == 5, ("duplicate choice values", q, allc)
    # verify the key
    got = float(sp.N(chk, 30)) if not isinstance(chk, (int, float)) else float(chk)
    assert abs(got - vals[0]) < 1e-9, f"KEY MISMATCH lv{lv} {cat} :: {q[:60]} :: chk={got} ans={vals[0]}"
    order = sorted(range(5), key=lambda i: vals[i])
    choices = [allc[i] for i in order]
    letter = LETTERS[order.index(0)]
    n = _counts.get((lv, cat), 0) + 1
    _counts[(lv, cat)] = n
    PROBLEMS.append(dict(id=f"{lv}-{cat}-{n:02d}", lv=lv, cat=cat, d=d, topic=topic,
                         q=q.strip(), ch=choices, a=LETTERS.index(letter),
                         hint=hint.strip(), sol=sol.strip()))
