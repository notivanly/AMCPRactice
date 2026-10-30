/* Endless drills. Every generator computes its own answer and writes its own solution,
   so there is no answer key to get wrong. */
const Gen = (() => {
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const lcm = (a, b) => (a / gcd(a, b)) * b;
  const fact = n => { let x = 1; for (let i = 2; i <= n; i++) x *= i; return x; };
  const C = (n, k) => { if (k < 0 || k > n) return 0; let x = 1; for (let i = 1; i <= k; i++) x = (x * (n - k + i)) / i; return Math.round(x); };
  const num = n => (Math.abs(n) >= 10000 ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '{,}') : String(n));
  const frac = (n, d) => { const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const fracTex = ([n, d]) => (d === 1 ? String(n) : `\\frac{${n}}{${d}}`);
  const fracVal = ([n, d]) => n / d;
  const paren = n => (n < 0 ? `(${n})` : String(n));
  const sg = n => (n < 0 ? `-${-n}` : `+${n}`);
  const termX = c => (c === 1 ? 'x' : c === -1 ? '-x' : `${c}x`);
  const lin = (a, b) => `${termX(a)}${b === 0 ? '' : sg(b)}`;
  const quad = (p, q) => { const cb = -p; return `x^2${cb === 0 ? '' : cb === 1 ? '+x' : cb === -1 ? '-x' : cb > 0 ? `+${cb}x` : `${cb}x`}${q === 0 ? '' : sg(q)}`; };
  const factorize = n => { const f = {}; for (let p = 2; p * p <= n; p++) while (n % p === 0) { f[p] = (f[p] || 0) + 1; n /= p; } if (n > 1) f[n] = (f[n] || 0) + 1; return f; };
  const facTex = f => Object.keys(f).map(Number).sort((a, b) => a - b).map(p => (f[p] === 1 ? `${p}` : `${p}^{${f[p]}}`)).join('\\cdot') || '1';
  const posInt = x => Number.isInteger(x) && x > 0;

  const G = [];
  const add = (key, cat, topic, make) => G.push({ key, cat, topic, make });

  /* ---------------- Algebra ---------------- */
  add('linear', 'alg', 'Linear equations', (r, lv) => {
    const m = [5, 8, 12][lv - 1], a = ri(r, 2, m); let c = ri(r, 1, m); if (c === a) c = a + 1;
    let x = ri(r, -8, 10); if (x === 0) x = 3;
    const b = ri(r, -12, 12), d = (a - c) * x + b;
    return { cat: 'alg', topic: 'Linear equations', q: `Solve for $x$: $${lin(a, b)}=${lin(c, d)}$.`, ans: x,
      wrong: [x + 1, x - 1, -x, x + 2, x - 2, x * 2], ok: () => true, step: 1,
      hint: 'Collect the $x$ terms on one side and the constants on the other.',
      sol: `Collect the $x$ terms on the left and the constants on the right: $(${a - c})x=${d - b}$. So $x=${x}$.` };
  });

  add('arith', 'alg', 'Sequences', (r, lv) => {
    const n = ri(r, [8, 10, 12][lv - 1], [16, 22, 30][lv - 1]), a = ri(r, 1, 9), dd = ri(r, 2, [5, 7, 9][lv - 1]);
    const last = a + (n - 1) * dd, sum = (n * (a + last)) / 2;
    return { cat: 'alg', topic: 'Sequences', q: `What is the sum of the first $${n}$ terms of the arithmetic sequence $${a},\\ ${a + dd},\\ ${a + 2 * dd},\\ \\ldots$?`, ans: sum,
      wrong: [n * (a + last), (n * (a + last + dd)) / 2, (n * (a + last - dd)) / 2, ((n - 1) * (a + last)) / 2, sum - last].filter(Number.isInteger),
      hint: 'Use $\\text{sum}=\\frac{n}{2}(\\text{first}+\\text{last})$.',
      sol: `The $${n}$th term is $${a}+${n - 1}\\cdot${dd}=${last}$. The sum is $\\frac{${n}}{2}(${a}+${last})=${sum}$.` };
  });

  add('vieta', 'alg', 'Quadratics & Vieta', (r) => {
    let s1 = ri(r, -7, 9), s2 = ri(r, -7, 9); if (!s1) s1 = 2; if (!s2) s2 = -3;
    const p = s1 + s2, q = s1 * s2; if (p === 0) return null;
    const ans = p * p - 2 * q;
    return { cat: 'alg', topic: 'Quadratics & Vieta', q: `Let $r$ and $s$ be the roots of $${quad(p, q)}=0$. What is $r^2+s^2$?`, ans,
      wrong: [p * p - q, p * p + 2 * q, p * p, 2 * q + p, ans + 2 * Math.abs(p)], ok: x => x > 0, step: 2,
      hint: 'Write $r^2+s^2$ using $r+s$ and $rs$.',
      sol: `By Vieta’s formulas, $r+s=${p}$ and $rs=${q}$. Then $r^2+s^2=(r+s)^2-2rs=${paren(p)}^2-2(${q})=${ans}$.` };
  });

  add('percent', 'alg', 'Percents', (r) => {
    const X = pick(r, [200, 300, 400, 500, 600, 800, 1000, 1200]), a = pick(r, [10, 20, 25, 50]), b = pick(r, [10, 20, 25, 40, 50]);
    const mid = (X * (100 + a)) / 100, fin = (mid * (100 - b)) / 100;
    if (!Number.isInteger(fin)) return null;
    return { cat: 'alg', topic: 'Percents', q: `A jacket costs $\\$${X}$. Its price is increased by $${a}\\%$, and then the new price is decreased by $${b}\\%$. What is the final price, in dollars?`, ans: fin,
      wrong: [(X * (100 + a - b)) / 100, mid, (X * (100 - b)) / 100, X, fin + X / 10].filter(Number.isInteger),
      hint: 'Percent changes multiply; they do not add.',
      sol: `After the increase the price is $${X}\\cdot${(100 + a) / 100}=${mid}$ dollars. After the decrease it is $${mid}\\cdot${(100 - b) / 100}=${fin}$ dollars.` };
  });

  add('logs', 'alg', 'Exponents & logs', (r, lv) => {
    if (lv < 3) {
      const b1 = pick(r, [2, 3, 5]), b2 = pick(r, [2, 3, 4]), k1 = ri(r, 2, 6), k2 = ri(r, 2, 5), prod = lv === 2;
      const ans = prod ? k1 * k2 : k1 + k2;
      return { cat: 'alg', topic: 'Exponents & logs', q: `What is $\\log_{${b1}} ${b1 ** k1} ${prod ? '\\cdot' : '+'} \\log_{${b2}} ${b2 ** k2}$?`, ans,
        wrong: prod ? [k1 + k2, ans + 1, ans - 1, b1 * k2, b2 * k1] : [k1 * k2, ans + 1, ans - 1, b1 + b2, ans + 2],
        hint: 'Remember that $\\log_b b^k=k$.',
        sol: `Since $${b1}^{${k1}}=${b1 ** k1}$ and $${b2}^{${k2}}=${b2 ** k2}$, the two logarithms are $${k1}$ and $${k2}$. Their ${prod ? 'product' : 'sum'} is $${ans}$.` };
    }
    const a = ri(r, 1, 6), b = ri(r, 1, 6), ans = 2 * a + 3 * b;
    return { cat: 'alg', topic: 'Exponents & logs', q: `If $\\log_2 x=${a}$ and $\\log_2 y=${b}$, what is $\\log_2\\left(x^2y^3\\right)$?`, ans,
      wrong: [6 * a * b, 5 * (a + b), a + b, 3 * a + 2 * b, ans + 2],
      hint: 'Use $\\log_2(x^2y^3)=2\\log_2x+3\\log_2y$.',
      sol: `$\\log_2(x^2y^3)=2\\log_2x+3\\log_2y=2\\cdot${a}+3\\cdot${b}=${ans}$.` };
  });

  add('system', 'alg', 'Systems of equations', (r) => {
    const x = ri(r, 4, 15), y = ri(r, 1, x - 1), S = x + y, D = x - y, ans = x * y;
    return { cat: 'alg', topic: 'Systems of equations', q: `Two numbers have sum $${S}$ and positive difference $${D}$. What is their product?`, ans,
      wrong: [x * x + y * y, x * x - y * y, 2 * ans, ans + x, ans - y],
      hint: 'Find each number from the sum and difference.',
      sol: `The numbers are $\\frac{${S}+${D}}{2}=${x}$ and $\\frac{${S}-${D}}{2}=${y}$, so the product is $${x}\\cdot${y}=${ans}$.` };
  });

  /* ---------------- Number theory ---------------- */
  add('divisors', 'nt', 'Divisors', (r, lv) => {
    const pairs = U.shuffle([2, 3, 5, 7, 11], r).slice(0, lv === 1 ? 2 : 3).sort((a, b) => a - b).map(p => [p, ri(r, 1, lv === 1 ? 4 : 5)]);
    const N = pairs.reduce((t, [p, e]) => t * p ** e, 1); if (N > 60000) return null;
    const es = pairs.map(x => x[1]), ans = es.reduce((t, e) => t * (e + 1), 1);
    return { cat: 'nt', topic: 'Divisors', q: `How many positive divisors does $${num(N)}$ have?`, ans,
      wrong: [es.reduce((a, b) => a * b, 1), es.reduce((a, b) => a + b, 0) + 1, ans + es[0] + 1, ans * 2, ans - es.length],
      hint: 'Prime-factorize, then add $1$ to each exponent and multiply.',
      sol: `The prime factorization is $${num(N)}=${pairs.map(([p, e]) => (e === 1 ? p : `${p}^{${e}}`)).join('\\cdot')}$. The number of divisors is $${es.map(e => `(${e}+1)`).join('')}=${ans}$.` };
  });

  add('modexp', 'nt', 'Modular arithmetic', (r, lv) => {
    const m = pick(r, [5, 7, 9, 11, 13]); let a; do { a = ri(r, 2, m - 1); } while (gcd(a, m) !== 1);
    const b = ri(r, 20, [200, 900, 3000][lv - 1]), seq = []; let v = 1;
    do { v = (v * a) % m; seq.push(v); } while (v !== 1);
    const t = seq.length, s = b % t || t, ans = seq[s - 1], wrong = [];
    for (let i = 0; i < m; i++) if (i !== ans) wrong.push(i);
    return { cat: 'nt', topic: 'Modular arithmetic', q: `What is the remainder when $${a}^{${b}}$ is divided by $${m}$?`, ans, wrong, ok: () => true,
      hint: 'Powers modulo $m$ repeat in a cycle. Find its length.',
      sol: `Modulo $${m}$, the powers of $${a}$ are $${seq.join(',\\ ')},\\ \\ldots$ and the pattern repeats every $${t}$ steps. Since $${b}$ leaves remainder $${b % t}$ when divided by $${t}$, ${b % t === 0 ? `the exponent is a whole number of cycles, so the remainder is $${ans}$` : `the remainder is the ${U.ord(s)} number in the list, $${ans}$`}.` };
  });

  add('lcm3', 'nt', 'GCD & LCM', (r) => {
    const t = U.shuffle([4, 6, 8, 9, 10, 12, 14, 15, 18, 20, 21, 24, 28, 30, 35, 36], r).slice(0, 3).sort((x, y) => x - y);
    const [a, b, c] = t, L = lcm(lcm(a, b), c); if (L === c || L > 2000) return null;
    const mx = {}; t.forEach(n => { const f = factorize(n); for (const p in f) mx[p] = Math.max(mx[p] || 0, f[p]); });
    return { cat: 'nt', topic: 'GCD & LCM', q: `What is the least common multiple of $${a}$, $${b}$, and $${c}$?`, ans: L,
      wrong: [lcm(a, b), lcm(b, c), lcm(a, c), L * 2, L / 2, a * b * c < 5000 ? a * b * c : L + a].filter(posInt),
      hint: 'Take the highest power of each prime that appears.',
      sol: `Factor each number: ${t.map(n => `$${n}=${facTex(factorize(n))}$`).join(', ')}. Taking the highest power of each prime gives $${facTex(mx)}=${L}$.` };
  });

  add('inex', 'nt', 'Inclusion–exclusion', (r) => {
    const [a, b] = pick(r, [[3, 5], [4, 6], [6, 10], [4, 7], [5, 8], [6, 9], [3, 7], [9, 12], [4, 10], [5, 6]]);
    const N = pick(r, [100, 150, 200, 250, 300, 360, 400, 500]);
    const x = Math.floor(N / a), y = Math.floor(N / b), l = lcm(a, b), z = Math.floor(N / l), ans = x + y - 2 * z;
    return { cat: 'nt', topic: 'Inclusion–exclusion', q: `How many integers from $1$ to $${N}$, inclusive, are divisible by exactly one of $${a}$ and $${b}$?`, ans,
      wrong: [x + y - z, x + y, z, x - z, ans + 1, ans - 1],
      hint: 'Multiples of both numbers are multiples of their least common multiple.',
      sol: `There are $\\lfloor ${N}/${a}\\rfloor=${x}$ multiples of $${a}$, $\\lfloor ${N}/${b}\\rfloor=${y}$ multiples of $${b}$, and $\\lfloor ${N}/${l}\\rfloor=${z}$ multiples of $\\operatorname{lcm}(${a},${b})=${l}$. Numbers divisible by exactly one are $(${x}-${z})+(${y}-${z})=${ans}$.` };
  });

  add('zeros', 'nt', 'Factorials', (r) => {
    const n = pick(r, [60, 75, 100, 120, 150, 200, 250, 300, 400, 500]), parts = []; let ans = 0;
    for (let p = 5; p <= n; p *= 5) { const k = Math.floor(n / p); ans += k; parts.push(k); }
    return { cat: 'nt', topic: 'Factorials', q: `How many trailing zeros does $${n}!$ have?`, ans,
      wrong: [Math.floor(n / 5), Math.floor(n / 10), ans - parts[parts.length - 1], ans + 1, parts[0] + 2 * (parts[1] || 0)],
      hint: 'Each trailing zero needs a factor of $5$. Count them.',
      sol: `Each trailing zero needs a factor $10=2\\cdot5$, and factors of $2$ are plentiful, so count factors of $5$: $\\lfloor ${n}/5\\rfloor+\\lfloor ${n}/25\\rfloor+\\cdots=${parts.join('+')}=${ans}$.` };
  });

  /* ---------------- Counting & probability ---------------- */
  const WORDS = ['BANANA', 'LETTER', 'COFFEE', 'PEPPER', 'BALLOON', 'ARRANGE', 'COMMITTEE', 'STATISTICS', 'BOOKKEEPER', 'MISSISSIPPI', 'TENNESSEE', 'ALABAMA'];
  add('words', 'cp', 'Permutations', (r, lv) => {
    const w = pick(r, lv === 1 ? WORDS.slice(0, 5) : lv === 2 ? WORDS.slice(2, 9) : WORDS.slice(5));
    const cnt = {}; for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
    const reps = Object.entries(cnt).filter(([, k]) => k > 1), n = w.length;
    let ans = fact(n); reps.forEach(([, k]) => (ans /= fact(k)));
    const maxk = Math.max(...reps.map(x => x[1]));
    return { cat: 'cp', topic: 'Permutations', q: `How many distinct arrangements are there of the letters in the word ${w}?`, ans,
      wrong: [fact(n), fact(n) / fact(maxk), ans * 2, ans / 2, ans + fact(n - 2)].filter(posInt),
      hint: 'Repeated letters make some orderings identical. Divide them out.',
      sol: `The word has $${n}$ letters, but ${reps.map(([ch, k]) => `${ch} appears ${k} times`).join(' and ')}. Dividing out the repeats gives $\\frac{${n}!}{${reps.map(([, k]) => `${k}!`).join('\\cdot')}}=${num(ans)}$.` };
  });

  add('committee', 'cp', 'Combinations', (r) => {
    const m = ri(r, 4, 8), w = ri(r, 3, 6), k = ri(r, 3, Math.min(5, m)), tot = C(m + w, k), none = C(m, k), ans = tot - none;
    return { cat: 'cp', topic: 'Combinations', q: `A club has $${m}$ boys and $${w}$ girls. A committee of $${k}$ members is chosen. How many committees contain at least one girl?`, ans,
      wrong: [tot, none, w * C(m + w - 1, k - 1), ans + w, w * C(m, k - 1)],
      hint: 'Count all committees, then subtract the ones with no girls.',
      sol: `There are $\\binom{${m + w}}{${k}}=${tot}$ committees in all. Those with no girls use only boys: $\\binom{${m}}{${k}}=${none}$. So $${tot}-${none}=${ans}$ committees have at least one girl.` };
  });

  const validProb = x => x[0] > 0 && x[0] < x[1];
  add('dice', 'cp', 'Probability', (r, lv) => {
    const kinds = [
      () => { const s = ri(r, 3, 11); return { d: `the sum is $${s}$`, f: (x, y) => x + y === s }; },
      () => { const s = ri(r, 8, 11); return { d: `the sum is at least $${s}$`, f: (x, y) => x + y >= s }; },
      () => { const s = ri(r, 3, 6); return { d: `the sum is at most $${s}$`, f: (x, y) => x + y <= s }; },
      () => { const k = pick(r, [3, 4, 5]); return { d: `the sum is a multiple of $${k}$`, f: (x, y) => (x + y) % k === 0 }; },
      () => ({ d: 'at least one die shows a $6$', f: (x, y) => x === 6 || y === 6 }),
      () => ({ d: 'the product of the two numbers is a perfect square', f: (x, y) => Number.isInteger(Math.sqrt(x * y)) })
    ];
    const kind = kinds[ri(r, 0, lv === 1 ? 1 : lv === 2 ? 3 : 5)](); let cnt = 0;
    for (let x = 1; x <= 6; x++) for (let y = 1; y <= 6; y++) if (kind.f(x, y)) cnt++;
    if (cnt < 2 || cnt > 34) return null;
    const ans = frac(cnt, 36), red = fracTex(ans);
    return { cat: 'cp', topic: 'Probability', q: `Two fair six-sided dice are rolled. What is the probability that ${kind.d}?`, ans,
      wrong: [frac(cnt + 1, 36), frac(cnt - 1, 36), frac(cnt + 2, 36), frac(36 - cnt, 36), frac(cnt, 12), frac(cnt, 6)],
      ok: validProb, val: fracVal, fmt: fracTex,
      hint: 'List the favorable outcomes among the $36$ equally likely outcomes.',
      sol: `There are $36$ equally likely outcomes, and $${cnt}$ of them work. The probability is $\\frac{${cnt}}{36}${red === `\\frac{${cnt}}{36}` ? '' : `=${red}`}$.` };
  });

  add('marbles', 'cp', 'Probability', (r) => {
    const Rd = ri(r, 3, 8), B = ri(r, 3, 8), T = C(Rd + B, 2), same = C(Rd, 2) + C(B, 2), ans = frac(same, T);
    return { cat: 'cp', topic: 'Probability', q: `A bag has $${Rd}$ red marbles and $${B}$ blue marbles. Two marbles are drawn at random without replacement. What is the probability that they are the same color?`, ans,
      wrong: [frac(Rd * Rd + B * B, (Rd + B) * (Rd + B)), frac(C(Rd, 2), T), frac(C(B, 2), T), frac(Rd * B, T), frac(same + 1, T), frac(same - 1, T)],
      ok: validProb, val: fracVal, fmt: fracTex,
      hint: 'Count pairs of marbles rather than ordered draws.',
      sol: `There are $\\binom{${Rd + B}}{2}=${T}$ equally likely pairs. Both red: $\\binom{${Rd}}{2}=${C(Rd, 2)}$. Both blue: $\\binom{${B}}{2}=${C(B, 2)}$. The probability is $\\frac{${C(Rd, 2)}+${C(B, 2)}}{${T}}=${fracTex(ans)}$.` };
  });

  add('paths', 'cp', 'Paths & grids', (r, lv) => {
    const m = ri(r, 3, 6), n = ri(r, 3, 6), total = C(m + n, m);
    if (lv === 1) return { cat: 'cp', topic: 'Paths & grids', q: `How many paths go from $(0,0)$ to $(${m},${n})$ if every step is one unit right or one unit up?`, ans: total,
      wrong: [m * n, total / 2, total + m + n, C(m + n, m - 1), C(m + n, m + 1)].filter(posInt),
      hint: 'Each path is a choice of which steps go right.',
      sol: `Every path has $${m + n}$ steps, and exactly $${m}$ of them go right. Choosing which ones gives $\\binom{${m + n}}{${m}}=${total}$ paths.` };
    const i = ri(r, 1, m - 1), j = ri(r, 1, n - 1), a = C(i + j, i), b = C(m - i + n - j, m - i), through = a * b;
    if (lv === 2) return { cat: 'cp', topic: 'Paths & grids', q: `How many paths go from $(0,0)$ to $(${m},${n})$ through the point $(${i},${j})$, if every step is one unit right or one unit up?`, ans: through,
      wrong: [total, a + b, a * b + a, total - through, C(m + n, m) - a].filter(posInt),
      hint: 'Count paths to the point, then from the point to the end, and multiply.',
      sol: `Paths from $(0,0)$ to $(${i},${j})$: $\\binom{${i + j}}{${i}}=${a}$. Paths from $(${i},${j})$ to $(${m},${n})$: $\\binom{${m - i + n - j}}{${m - i}}=${b}$. Total: $${a}\\cdot${b}=${through}$.` };
    return { cat: 'cp', topic: 'Paths & grids', q: `How many paths go from $(0,0)$ to $(${m},${n})$ that avoid the point $(${i},${j})$, if every step is one unit right or one unit up?`, ans: total - through,
      wrong: [through, total, total - a, total - b, total - through + a].filter(posInt),
      hint: 'Subtract the paths that do pass through the point from all paths.',
      sol: `All paths: $\\binom{${m + n}}{${m}}=${total}$. Paths through $(${i},${j})$: $${a}\\cdot${b}=${through}$. So $${total}-${through}=${total - through}$ paths avoid it.` };
  });

  add('stars', 'cp', 'Stars & bars', (r, lv) => {
    const k = ri(r, 3, 5), n = ri(r, 8, 16);
    if (lv < 3) { const ans = C(n + k - 1, k - 1);
      return { cat: 'cp', topic: 'Stars & bars', q: `How many ordered lists $(x_1,\\ldots,x_${k})$ of nonnegative integers satisfy $x_1+\\cdots+x_${k}=${n}$?`, ans,
        wrong: [C(n + k, k), C(n, k), C(n - 1, k - 1), C(n + k - 1, k)],
        hint: 'Use stars and bars: $n$ stars and $k-1$ bars.',
        sol: `Arrange $${n}$ stars and $${k - 1}$ bars in a row. The number of arrangements is $\\binom{${n + k - 1}}{${k - 1}}=${ans}$.` }; }
    const ans = C(n - 1, k - 1);
    return { cat: 'cp', topic: 'Stars & bars', q: `How many ordered lists $(x_1,\\ldots,x_${k})$ of positive integers satisfy $x_1+\\cdots+x_${k}=${n}$?`, ans,
      wrong: [C(n + k - 1, k - 1), C(n, k), C(n - 1, k), C(n + 1, k - 1)],
      hint: 'Each $x_i\\ge1$, so first give every variable $1$.',
      sol: `Put the $${n}$ units in a row. There are $${n - 1}$ gaps between them, and choosing $${k - 1}$ of the gaps to cut gives $${k}$ positive parts: $\\binom{${n - 1}}{${k - 1}}=${ans}$.` };
  });

  /* ---------------- Geometry ---------------- */
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [6, 8, 10]];
  add('pyth', 'geo', 'Right triangles', (r, lv) => {
    const t = pick(r, TRI), s = lv === 1 ? ri(r, 1, 2) : ri(r, 1, 3); let [a, b, c] = t.map(x => x * s);
    if (r() < 0.5) [a, b] = [b, a];
    if (lv === 1) return { cat: 'geo', topic: 'Right triangles', q: `A right triangle has legs of length $${a}$ and $${b}$. What is the length of its hypotenuse?`, ans: c,
      wrong: [a + b, c + 1, c - 1, c + 2, Math.abs(a - b)], step: 1,
      hint: 'Use the Pythagorean theorem.',
      sol: `The hypotenuse is $\\sqrt{${a}^2+${b}^2}=\\sqrt{${a * a + b * b}}=${c}$.` };
    if (lv === 2) return { cat: 'geo', topic: 'Right triangles', q: `A right triangle has hypotenuse $${c}$ and one leg of length $${a}$. What is its area?`, ans: (a * b) / 2,
      wrong: [a * b, (a * c) / 2, (b * c) / 2, (a * b) / 2 + a, (a * b) / 2 - b].filter(posInt),
      hint: 'Find the other leg first.',
      sol: `The other leg is $\\sqrt{${c}^2-${a}^2}=${b}$, so the area is $\\frac12\\cdot${a}\\cdot${b}=${(a * b) / 2}$.` };
    const ans = (a + b - c) / 2;
    return { cat: 'geo', topic: 'Right triangles', q: `A right triangle has legs of length $${a}$ and $${b}$. What is the radius of its inscribed circle?`, ans,
      wrong: [(a + b + c) / 2, (a * b) / c, a + b - c, (a * b) / (2 * (a + b)), ans + 1].filter(posInt), step: 1,
      hint: 'For a right triangle, $r=\\frac{a+b-c}{2}$.',
      sol: `The hypotenuse is $${c}$. For a right triangle, $r=\\frac{a+b-c}{2}=\\frac{${a}+${b}-${c}}{2}=${ans}$.` };
  });

  add('polygon', 'geo', 'Polygons', (r, lv) => {
    const kind = ri(r, 0, lv === 1 ? 1 : 2);
    if (kind === 0) { const n = ri(r, 7, 14), ans = (n * (n - 3)) / 2;
      return { cat: 'geo', topic: 'Polygons', q: `How many diagonals does a convex polygon with $${n}$ sides have?`, ans,
        wrong: [(n * (n - 1)) / 2, n * (n - 3), ans + n, ans - n, (n * (n - 2)) / 2].filter(posInt),
        hint: 'Each vertex connects to $n-3$ others by diagonals. Don’t count twice.',
        sol: `Each of the $${n}$ vertices has $${n}-3=${n - 3}$ diagonals, and each diagonal is counted twice. So $\\frac{${n}\\cdot${n - 3}}{2}=${ans}$.` }; }
    if (kind === 1) { const n = ri(r, 7, 14), ans = 180 * (n - 2);
      return { cat: 'geo', topic: 'Polygons', q: `What is the sum of the interior angles of a convex polygon with $${n}$ sides, in degrees?`, ans,
        wrong: [180 * n, 180 * (n - 1), 360 * (n - 2), 180 * (n - 3), 360], hint: 'Split the polygon into triangles from one vertex.',
        sol: `From one vertex you can draw diagonals splitting the polygon into $${n}-2=${n - 2}$ triangles, each with angle sum $180^\\circ$. The total is $180\\cdot${n - 2}=${ans}$ degrees.` }; }
    const n = pick(r, [5, 6, 8, 9, 10, 12, 15, 18, 20, 24]), ans = 180 - 360 / n;
    return { cat: 'geo', topic: 'Polygons', q: `What is the measure of each interior angle of a regular polygon with $${n}$ sides?`, ans, fmt: x => `${x}^\\circ`,
      wrong: [360 / n, 180 * (n - 2), 180 - 180 / n, ans + 6, ans - 6].filter(posInt),
      hint: 'The exterior angles of a regular polygon are equal and add to $360^\\circ$.',
      sol: `Each exterior angle is $\\frac{360^\\circ}{${n}}=${360 / n}^\\circ$, so each interior angle is $180^\\circ-${360 / n}^\\circ=${ans}^\\circ$.` };
  });

  add('circle', 'geo', 'Circles', (r, lv) => {
    const fmt = k => (k === 1 ? '\\pi' : `${k}\\pi`);
    if (lv === 1) { const d = 2 * ri(r, 2, 12), rad = d / 2, ans = rad * rad;
      return { cat: 'geo', topic: 'Circles', q: `A circle has diameter $${d}$. What is its area?`, ans, fmt, wrong: [d * d, d, 2 * rad, rad * rad * 2, d * rad], ok: posInt,
        hint: 'Area is $\\pi r^2$, and the radius is half the diameter.', sol: `The radius is $${rad}$, so the area is $\\pi\\cdot${rad}^2=${ans}\\pi$.` }; }
    if (lv === 2) { const rad = ri(r, 3, 15), ans = rad * rad;
      return { cat: 'geo', topic: 'Circles', q: `A circle has circumference $${2 * rad}\\pi$. What is its area?`, ans, fmt, wrong: [4 * rad * rad, 2 * rad, rad, 2 * rad * rad, rad * rad + rad], ok: posInt,
        hint: 'The circumference is $2\\pi r$. Solve for $r$ first.', sol: `Since $2\\pi r=${2 * rad}\\pi$, we have $r=${rad}$. The area is $\\pi r^2=${ans}\\pi$.` }; }
    const s = 2 * ri(r, 2, 9), ans = (s * s) / 2;
    return { cat: 'geo', topic: 'Circles', q: `A square with side length $${s}$ is inscribed in a circle. What is the area of the circle?`, ans, fmt, wrong: [s * s, (s * s) / 4, 2 * s * s, s, s * s - s].filter(posInt), ok: posInt,
      hint: 'The diagonal of the square is a diameter of the circle.', sol: `The square’s diagonal is $${s}\\sqrt2$, which is the diameter. So $r^2=\\left(\\frac{${s}\\sqrt2}{2}\\right)^2=${ans}$ and the area is $${ans}\\pi$.` };
  });

  add('trineq', 'geo', 'Triangles', (r) => {
    const a = ri(r, 3, 20); let b = ri(r, 3, 20); if (b === a) b = a + 2;
    const lo = Math.abs(a - b), hi = a + b, ans = hi - lo - 1;
    return { cat: 'geo', topic: 'Triangles', q: `Two sides of a triangle have lengths $${a}$ and $${b}$. How many different integer lengths are possible for the third side?`, ans,
      wrong: [hi - 1, ans + 1, ans - 1, ans + 2, lo].filter(posInt), step: 1,
      hint: 'Use the triangle inequality: the third side is between the difference and the sum.',
      sol: `The third side $x$ must satisfy $|${a}-${b}|<x<${a}+${b}$, that is $${lo}<x<${hi}$. The integers $${lo + 1},\\ldots,${hi - 1}$ give $${ans}$ possibilities.` };
  });

  add('coord', 'geo', 'Coordinate geometry', (r) => {
    const pt = () => [ri(r, -3, 8), ri(r, -3, 8)], A = pt(), B = pt(), D = pt();
    const det = A[0] * (B[1] - D[1]) + B[0] * (D[1] - A[1]) + D[0] * (A[1] - B[1]), ad = Math.abs(det);
    if (ad % 2 || ad < 8) return null;
    const ans = ad / 2, P = p => `(${p[0]},${p[1]})`;
    return { cat: 'geo', topic: 'Coordinate geometry', q: `What is the area of the triangle with vertices $${P(A)}$, $${P(B)}$, and $${P(D)}$?`, ans,
      wrong: [ad, ans + 1, ans - 1, ans + 3, ans - 2].filter(posInt), step: 1,
      hint: 'Use the shoelace formula, or enclose the triangle in a rectangle.',
      sol: `By the shoelace formula, the area is $\\frac12\\left|${paren(A[0])}(${B[1] - D[1]})+${paren(B[0])}(${D[1] - A[1]})+${paren(D[0])}(${A[1] - B[1]})\\right|=\\frac12\\cdot${ad}=${ans}$.` };
  });

  /* ---------------- assembling a question ---------------- */
  function assemble(spec, r) {
    const key = x => String(x), val = spec.val || (x => x), fmt = spec.fmt || (x => String(x));
    const ok = spec.ok || (x => (typeof x === 'number' ? Number.isFinite(x) && x >= 0 : true));
    const seen = new Set([key(spec.ans)]), wrong = [];
    for (const x of spec.wrong) if (!seen.has(key(x)) && ok(x)) { seen.add(key(x)); wrong.push(x); }
    if (typeof spec.ans === 'number') {
      const step = spec.step || Math.max(1, Math.round(Math.abs(spec.ans) * 0.1));
      for (let k = 1; wrong.length < 4 && k < 60; k++)
        for (const x of [spec.ans + k * step, spec.ans - k * step])
          if (wrong.length < 4 && !seen.has(key(x)) && ok(x)) { seen.add(key(x)); wrong.push(x); }
    }
    if (wrong.length < 4) return null;
    const all = [spec.ans, ...U.shuffle(wrong, r).slice(0, 4)].sort((p, q) => val(p) - val(q));
    return { q: spec.q, ch: all.map(fmt), a: all.findIndex(x => key(x) === key(spec.ans)), hint: spec.hint, sol: spec.sol, cat: spec.cat, topic: spec.topic };
  }

  // lvl: 1 warm-up, 2 standard, 3 challenge
  function make(cat, lvl) {
    const pool = G.filter(g => cat === 'all' || g.cat === cat);
    for (let tries = 0; tries < 80; tries++) {
      const g = pick(Math.random, pool), seed = Math.floor(Math.random() * 1e9), r = U.rng(seed);
      const spec = g.make(r, lvl); if (!spec) continue;
      const out = assemble(spec, r); if (!out) continue;
      return Object.assign(out, { id: `gen:${g.key}:${seed}`, gen: true, lv: null, d: lvl + 1 });
    }
    throw new Error('Could not generate a drill question.');
  }

  return { make, keys: () => G.map(g => g.key), generators: G, assemble };
})();
