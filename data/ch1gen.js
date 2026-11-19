// 第 1 章「數與式」題目產生器(需先載入 gen.js 與 ch0.js:用到 nz、LIN、sgn、F)
const T = s => `$${s}$`;
const PN = n => (n < 0 ? `(${n})` : `${n}`);
const rep0 = k => '0'.repeat(Math.max(0, k));
const choose = (right, wrongs) => {
  const arr = [right, ...wrongs].map((c, i) => ({ c, r: i === 0 })).sort(() => Math.random() - 0.5);
  return { choices: arr.map(o => o.c), answer: arr.findIndex(o => o.r) };
};
const shuffle = a => a.map(v => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map(x => x[1]);
const NSQ = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99];
const withComma = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
// digits 字串 'M' 表示 d.ddd × 10^e,轉成一般寫法
const decStr = (digits, e) => {
  const len = digits.length;
  if (e >= len - 1) return withComma(digits + rep0(e - (len - 1)));
  if (e >= 0) return digits.slice(0, e + 1) + '.' + digits.slice(e + 1);
  return '0.' + rep0(-e - 1) + digits;
};
const num10 = (digits, e) => Number(`${digits}e${e - (digits.length - 1)}`);
const randDigits = (L, lastNonzero) => {
  let s = String(G.ri(1, 9));
  for (let i = 1; i < L; i++) s += String(i === L - 1 && lastNonzero ? G.ri(1, 9) : G.ri(0, 9));
  return s;
};
const digitsCount = (a, n) => String(BigInt(a) ** BigInt(n)).length;
const mantStr = digits => digits[0] + (digits.length > 1 ? '.' + digits.slice(1) : '');
const LG = { 2: [3010, '$\\log 2 = 0.3010$'], 3: [4771, '$\\log 3 = 0.4771$'], 6: [7781, '$\\log 2 = 0.3010$、$\\log 3 = 0.4771$(所以 $\\log 6 = 0.7781$)'] };

const G1 = {
  // ================= 實數 =================
  irrational() {
    const RAT = ['\\frac{22}{7}', '0.75', '\\sqrt{16}', '\\sqrt{25}', '-3', '0.\\overline{3}', '\\frac{5}{8}', '\\sqrt{49}', '0', '1.2'];
    const IRR = ['\\sqrt{2}', '\\sqrt{3}', '\\sqrt{5}', '\\sqrt{7}', '\\sqrt{10}', '\\pi'];
    const r = G.pick(IRR), w = shuffle(RAT).slice(0, 2);
    const c = choose(T(r), w.map(T));
    return { type: 'choice', ...c, text: '下列哪一個是<b>無理數</b>?',
      hint: '能寫成「整數 ÷ 整數」的是有理數(整數、分數、有限小數、循環小數、能開盡的根號)。',
      sol: `${T(r)} 是無限不循環小數(開不盡的根號或 π),是無理數;其他都能寫成分數(例如 $\\sqrt{16}=4$),是有理數。` };
  },
  ratKind() {
    const sq = [4, 9, 16, 25, 36, 49, 64, 81], ns = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17];
    const isRat = Math.random() < 0.5, n = G.pick(isRat ? sq : ns);
    return { type: 'choice', choices: ['有理數', '無理數'], answer: isRat ? 0 : 1,
      text: `${T('\\sqrt{' + n + '}')} 是有理數還是無理數?`,
      hint: '看根號裡的數能不能「開盡」:能開出整數 → 有理數;開不盡 → 無理數。',
      sol: isRat ? `$\\sqrt{${n}} = ${Math.sqrt(n)}$,是整數,所以是有理數。` : `${n} 不是完全平方數,$\\sqrt{${n}}$ 開不盡(無限不循環),是無理數。` };
  },
  fracToDec() {
    const d = G.pick([2, 4, 5, 8, 10, 16, 20, 25]); let n; do { n = G.ri(1, d * 2 - 1); } while (G.gcd(n, d) !== 1);
    return { type: 'num', answer: n / d, text: `${F(n, d)} 化成小數是多少?`,
      hint: `把分子除以分母:${n} ÷ ${d}。`, sol: `${n} ÷ ${d} = ${n / d}。` };
  },
  decType() {
    const fin = shuffle([2, 4, 5, 8, 10, 20, 25]).slice(0, 2), rec = G.pick([3, 6, 7, 9, 11, 12, 15]);
    const mk = d => { let n; do { n = G.ri(1, d - 1); } while (G.gcd(n, d) !== 1); return F(n, d); };
    const right = mk(rec), c = choose(right, fin.map(mk));
    return { type: 'choice', ...c, text: '下列哪一個分數化成小數是<b>無限循環小數</b>?',
      hint: '分母(最簡分數)只含質因數 2 和 5 → 有限小數;含有其他質因數(3、7、11…)→ 循環小數。',
      sol: `${right} 的分母 ${rec} 含有 2、5 以外的質因數,所以會一直循環;其他兩個分母只含 2 或 5,除得盡。` };
  },
  recToFrac() {
    if (Math.random() < 0.4) {
      const a = G.ri(1, 8); return { type: 'frac', answer: G.reduce(a, 9), text: `把 ${T('0.\\overline{' + a + '}')} 化成最簡分數:`,
        hint: `令 $x = 0.\\overline{${a}}$,兩邊乘 10 再相減:$10x - x = ${a}$。`,
        sol: `$x = 0.\\overline{${a}}$,$10x = ${a}.\\overline{${a}}$,相減得 $9x = ${a}$,$x = ${F(a, 9).slice(1, -1)}$,約分後 ${F(...G.reduce(a, 9))}。` };
    }
    const ab = G.ri(1, 98), s = String(ab).padStart(2, '0');
    return { type: 'frac', answer: G.reduce(ab, 99), text: `把 ${T('0.\\overline{' + s + '}')} 化成最簡分數:`,
      hint: `兩個數字一組在循環,所以乘 100:$100x - x = ${ab}$。`,
      sol: `$x = 0.\\overline{${s}}$,$100x = ${s}.\\overline{${s}}$,相減得 $99x = ${ab}$,$x = ${F(ab, 99).slice(1, -1)}$,約分後 ${F(...G.reduce(ab, 99))}。` };
  },
  recMixed() {
    const a = G.ri(1, 9), b = G.ri(1, 8), n = 9 * a + b;
    return { type: 'frac', answer: G.reduce(n, 90), text: `把 ${T('0.' + a + '\\overline{' + b + '}')} 化成最簡分數:`,
      hint: `令 $x = 0.${a}\\overline{${b}}$。先乘 10、再乘 100,讓循環的部分對齊,然後相減。`,
      sol: `$10x = ${a}.\\overline{${b}}$,$100x = ${a}${b}.\\overline{${b}}$,相減得 $90x = ${n}$,$x = ${F(n, 90).slice(1, -1)}$,約分後 ${F(...G.reduce(n, 90))}。` };
  },
  sqrtBetween() {
    const n = G.pick(NSQ.filter(v => v > 1)), lo = Math.floor(Math.sqrt(n));
    return { type: 'multi', answer: [lo, lo + 1], template: `${T('\\sqrt{' + n + '}')} 介於 {} 和 {} 之間`,
      text: `${T('\\sqrt{' + n + '}')} 介於哪兩個<b>連續整數</b>之間?(小的先填)`,
      hint: `找平方剛好小於 ${n} 和剛好大於 ${n} 的兩個整數。`,
      sol: `$${lo}^2 = ${lo * lo} < ${n} < ${(lo + 1) ** 2} = ${lo + 1}^2$,所以 $${lo} < \\sqrt{${n}} < ${lo + 1}$。` };
  },
  cmpSqrt() {
    const a = G.pick(NSQ.filter(v => v <= 50)), t = Math.round(Math.sqrt(a) * 10), B = t + G.pick([-1, 1]), b = (B / 10).toFixed(1);
    const rootBig = a * 100 > B * B;
    return { type: 'choice', choices: [`${T('\\sqrt{' + a + '}')} 比較大`, `${b} 比較大`], answer: rootBig ? 0 : 1,
      text: `比較 ${T('\\sqrt{' + a + '}')} 和 ${b} 的大小:`,
      hint: `兩個正數比大小,可以比它們的<b>平方</b>:算算 $${b}^2$ 和 ${a}。`,
      sol: `$${b}^2 = ${(B * B / 100).toFixed(2)}$,${rootBig ? '小於' : '大於'} ${a},所以 ${rootBig ? `$\\sqrt{${a}}$ 比較大` : `${b} 比較大`}。` };
  },

  // ================= 絕對值 =================
  absVal() {
    const t = G.ri(0, 3);
    if (t === 0) { const k = nz(-12, 12); return { type: 'num', answer: Math.abs(k), text: `${T('|' + k + '|')} = ?`, hint: '絕對值 = 這個數到 0 的距離,一定不是負的。', sol: `${k} 到 0 的距離是 ${Math.abs(k)}。` }; }
    if (t === 1) { const a = nz(-9, 9), b = nz(-9, 9); return { type: 'num', answer: Math.abs(a) + Math.abs(b), text: `${T('|' + a + '| + |' + b + '|')} = ?`, hint: '先各自去掉絕對值,再相加。', sol: `$|${a}| = ${Math.abs(a)}$,$|${b}| = ${Math.abs(b)}$,相加 ${Math.abs(a) + Math.abs(b)}。` }; }
    if (t === 2) { const a = nz(-9, 9), b = nz(-9, 9); return { type: 'num', answer: Math.abs(a - b), text: `${T('|' + a + ' - ' + PN(b) + '|')} = ?`, hint: '先算絕對值裡面的減法,再取絕對值。', sol: `$${a} - ${PN(b)} = ${a - b}$,取絕對值得 ${Math.abs(a - b)}。` }; }
    const k = nz(-9, 9); return { type: 'num', answer: -Math.abs(k), text: `${T('-|' + k + '|')} = ?`, hint: '負號在絕對值的外面:先算絕對值,再加上負號。', sol: `$|${k}| = ${Math.abs(k)}$,前面還有負號,所以是 $-${Math.abs(k)}$。` };
  },
  dist() {
    let a, b; do { a = G.ri(-9, 9); b = G.ri(-9, 9); } while (a === b);
    return { type: 'num', answer: Math.abs(a - b), text: `數線上 A 點在 ${a},B 點在 ${b},兩點的距離是多少?`,
      hint: '距離 = 大的減小的,或寫成 $|a-b|$。', sol: `$|${a} - ${PN(b)}| = ${Math.abs(a - b)}$。` };
  },
  absEq() {
    const a = G.ri(-6, 6), b = G.ri(1, 8);
    return { type: 'multi', unordered: true, answer: [a - b, a + b], template: '$x = $ {} 或 $x = $ {}',
      text: `解方程式 ${T('|' + LIN(1, -a) + '| = ' + b)} 。(兩個解,順序不拘)`,
      hint: `$|${LIN(1, -a)}| = ${b}$ 的意思是:x 到 ${a} 的距離是 ${b}。左右各走 ${b} 步。`,
      sol: `x 在 ${a} 的左邊 ${b} 步或右邊 ${b} 步:$x = ${a - b}$ 或 $x = ${a + b}$。` };
  },
  absEq2() {
    for (;;) {
      const p = G.ri(2, 4), q = nz(-8, 8), r = G.ri(1, 9);
      if ((q + r) % p !== 0 || (r - q) % p !== 0) continue;
      return { type: 'multi', unordered: true, answer: [(-q + r) / p, (-q - r) / p], template: '$x = $ {} 或 $x = $ {}',
        text: `解方程式 ${T('|' + LIN(p, q) + '| = ' + r)} 。(兩個解,順序不拘)`,
        hint: `裡面的東西 $${LIN(p, q)}$ 可以是 ${r} 或 $-${r}$,分兩種情況各解一次。`,
        sol: `$${LIN(p, q)} = ${r}$ 得 $x = ${(-q + r) / p}$;$${LIN(p, q)} = -${r}$ 得 $x = ${(-q - r) / p}$。` };
    }
  },
  absNoSol() {
    const a = G.ri(-6, 6), t = G.ri(0, 2), r = t === 0 ? -G.ri(1, 6) : t === 1 ? 0 : G.ri(1, 6);
    return { type: 'choice', choices: ['無解', '恰有一個解', '恰有兩個解'], answer: t === 0 ? 0 : t === 1 ? 1 : 2,
      text: `方程式 ${T('|' + LIN(1, -a) + '| = ' + r)} 有幾個解?`,
      hint: '絕對值是距離,不可能是負的;距離等於 0 時只有一個點。',
      sol: t === 0 ? `絕對值不會是負數,所以無解。` : t === 1 ? `距離為 0 → x 就在 ${a} 這一點,只有一個解。` : `距離是正數 ${r},左右各一個,共兩個解。` };
  },
  absLess() {
    const a = G.ri(-6, 6), b = G.ri(1, 8);
    return { type: 'multi', answer: [a - b, a + b], template: '{} $< x <$ {}',
      text: `解不等式 ${T('|' + LIN(1, -a) + '| < ' + b)} ,填出 x 的範圍:`,
      hint: `距離小於 ${b},就是 x 落在 ${a} 左右各 ${b} 步<b>以內</b>。`,
      sol: `$${a} - ${b} < x < ${a} + ${b}$,即 $${a - b} < x < ${a + b}$。` };
  },
  absGreater() {
    const a = G.ri(-6, 6), b = G.ri(1, 8);
    return { type: 'multi', answer: [a - b, a + b], template: '$x <$ {} 或 $x >$ {}',
      text: `解不等式 ${T('|' + LIN(1, -a) + '| > ' + b)} ,填出 x 的範圍:`,
      hint: `距離大於 ${b},就是 x 落在 ${a} 左右各 ${b} 步<b>以外</b>(分成兩段)。`,
      sol: `$x < ${a} - ${b} = ${a - b}$ 或 $x > ${a} + ${b} = ${a + b}$。` };
  },
  tolerance() {
    const L = G.ri(10, 50), e = G.ri(1, 4);
    return { type: 'multi', answer: [L - e, L + e], template: '最短 {} 公分,最長 {} 公分',
      text: `規定零件的長度是 ${L} 公分,<b>誤差不能超過 ${e} 公分</b>(即 $|x - ${L}| \\le ${e}$)。合格的零件最短、最長各幾公分?`,
      hint: `誤差 ≤ ${e},長度就在 ${L} 的左右各 ${e} 以內。`, sol: `$${L} - ${e} = ${L - e}$,$${L} + ${e} = ${L + e}$。` };
  },
  intCount() {
    const a = G.ri(-5, 5), b = G.ri(2, 7), eq = Math.random() < 0.5;
    return { type: 'num', answer: eq ? 2 * b + 1 : 2 * b - 1,
      text: `滿足 ${T('|' + LIN(1, -a) + '| ' + (eq ? '\\le' : '<') + ' ' + b)} 的<b>整數 x</b> 有幾個?`,
      hint: `先寫出範圍 $${a - b}${eq ? ' \\le ' : ' < '}x${eq ? ' \\le ' : ' < '}${a + b}$,再數整數(端點${eq ? '算' : '不算'})。`,
      sol: `範圍是 $${a - b}${eq ? ' \\le ' : ' < '}x${eq ? ' \\le ' : ' < '}${a + b}$,整數有 ${eq ? 2 * b + 1 : 2 * b - 1} 個。` };
  },

  // ================= 式的運算 =================
  cube() {
    const k = nz(-4, 4);
    return { type: 'multi', answer: [3 * k, 3 * k * k, k * k * k], template: '$x^3 + $ {} $x^2 + $ {} $x + $ {}',
      text: `展開 ${T('(x ' + (k > 0 ? '+ ' : '- ') + Math.abs(k) + ')^3')} ,填入各項係數(可以是負數):`,
      hint: '公式 $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$。這裡 a = x、b = ' + k + '。',
      sol: `$a = x,\\ b = ${k}$:$3b = ${3 * k}$,$3b^2 = ${3 * k * k}$,$b^3 = ${k ** 3}$。` };
  },
  cubeSum() {
    const c = nz(-4, 4), c3 = c ** 3;
    return { type: 'multi', answer: [c, -c, c * c], template: '$= (x + $ {} $)(x^2 + $ {} $x + $ {} $)$',
      text: `因式分解 ${T('x^3 ' + (c3 > 0 ? '+ ' : '- ') + Math.abs(c3))} ,填入空格(可以是負數):`,
      hint: `把 ${c3} 看成 $${PN(c)}^3$,套公式 $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$,a = x、b = ${c}。`,
      sol: `$x^3 + ${PN(c)}^3 = (x + ${PN(c)})(x^2 - ${PN(c)}x + ${PN(c)}^2) = (${LIN(1, c)})(x^2 ${c > 0 ? '- ' + c : '+ ' + (-c)}x + ${c * c})$。` };
  },
  sumSq() {
    const t = G.ri(0, 2), s = G.ri(2, 8);
    if (t === 0) { const p = G.ri(1, Math.floor(s * s / 4)); return { type: 'num', answer: s * s - 2 * p, text: `已知 $a + b = ${s}$,$ab = ${p}$,求 $a^2 + b^2$ = ?`, hint: '$(a+b)^2 = a^2 + 2ab + b^2$,所以 $a^2 + b^2 = (a+b)^2 - 2ab$。', sol: `$${s}^2 - 2\\times${p} = ${s * s - 2 * p}$。` }; }
    if (t === 1) { const p = G.ri(1, 12); return { type: 'num', answer: s * s + 2 * p, text: `已知 $a - b = ${s}$,$ab = ${p}$,求 $a^2 + b^2$ = ?`, hint: '$(a-b)^2 = a^2 - 2ab + b^2$,所以 $a^2 + b^2 = (a-b)^2 + 2ab$。', sol: `$${s}^2 + 2\\times${p} = ${s * s + 2 * p}$。` }; }
    const p = G.ri(1, Math.floor(s * s / 4)); return { type: 'num', answer: s ** 3 - 3 * p * s, text: `已知 $a + b = ${s}$,$ab = ${p}$,求 $a^3 + b^3$ = ?`, hint: '$(a+b)^3 = a^3 + b^3 + 3ab(a+b)$,所以 $a^3 + b^3 = (a+b)^3 - 3ab(a+b)$。', sol: `$${s}^3 - 3\\times${p}\\times${s} = ${s ** 3 - 3 * p * s}$。` };
  },
  radSimp() {
    for (;;) {
      const k = G.ri(2, 6), m = G.pick([2, 3, 5, 6, 7]), N = k * k * m;
      if (N > 250) continue;
      return { type: 'multi', answer: [k, m], template: '係數 k = {},根號內 m = {}',
        text: `把 ${T('\\sqrt{' + N + '}')} 化簡成 ${T('k\\sqrt{m}')} 的形式(m 要盡量小):`,
        hint: `${N} 裡面有沒有一個完全平方數的因數?例如 4、9、16、25、36。`,
        sol: `$${N} = ${k * k}\\times${m}$,所以 $\\sqrt{${N}} = \\sqrt{${k * k}}\\times\\sqrt{${m}} = ${k}\\sqrt{${m}}$。` };
    }
  },
  radAdd() {
    const m = G.pick([2, 3, 5, 6, 7]), a = G.ri(2, 9), b = G.ri(1, 9), sub = Math.random() < 0.5 && a !== b;
    return { type: 'num', answer: sub ? a - b : a + b, text: `${T(a + '\\sqrt{' + m + '}' + (sub ? ' - ' : ' + ') + b + '\\sqrt{' + m + '}')} ${'= ' + T('?\\sqrt{' + m + '}')} ,問號是多少?`,
      hint: `根號部分一樣,像「同類項」一樣把係數相加減。`, sol: `$(${a} ${sub ? '-' : '+'} ${b})\\sqrt{${m}} = ${sub ? a - b : a + b}\\sqrt{${m}}$。` };
  },
  radAdd2() {
    const m = G.pick([2, 3, 5]), k1 = G.ri(1, 5), k2 = G.ri(1, 5), sub = Math.random() < 0.4 && k1 > k2;
    return { type: 'num', answer: sub ? k1 - k2 : k1 + k2,
      text: `${T('\\sqrt{' + k1 * k1 * m + '}' + (sub ? ' - ' : ' + ') + '\\sqrt{' + k2 * k2 * m + '}')} ${'= ' + T('?\\sqrt{' + m + '}')} ,問號是多少?`,
      hint: '先把每個根號化簡成「數字 × 根號' + m + '」,再加減。',
      sol: `$\\sqrt{${k1 * k1 * m}} = ${k1}\\sqrt{${m}}$,$\\sqrt{${k2 * k2 * m}} = ${k2}\\sqrt{${m}}$,所以答案是 ${sub ? k1 - k2 : k1 + k2}。` };
  },
  radMul() {
    const m = G.pick([2, 3, 5, 6, 7]), k = G.ri(2, 4), N = m * k * k;
    return { type: 'num', answer: m * k, text: `${T('\\sqrt{' + m + '}\\times\\sqrt{' + N + '}')} = ?`,
      hint: '$\\sqrt{a}\\times\\sqrt{b} = \\sqrt{ab}$,乘出來再開根號。',
      sol: `$\\sqrt{${m}\\times${N}} = \\sqrt{${m * N}} = ${m * k}$(因為 $${m * k}^2 = ${m * N}$)。` };
  },
  rationalMono() {
    const a = G.pick([2, 3, 5, 6, 7]), t = G.ri(1, 5);
    return { type: 'num', answer: t, text: `把分母有理化:${T('\\frac{' + a * t + '}{\\sqrt{' + a + '}} = ?\\sqrt{' + a + '}')} ,問號是多少?`,
      hint: `分子分母同乘 $\\sqrt{${a}}$,分母就變成 ${a}。`,
      sol: `$\\frac{${a * t}}{\\sqrt{${a}}}\\times\\frac{\\sqrt{${a}}}{\\sqrt{${a}}} = \\frac{${a * t}\\sqrt{${a}}}{${a}} = ${t}\\sqrt{${a}}$。` };
  },
  conj() {
    const a = G.pick(NSQ.filter(v => v <= 13)), b = G.ri(1, 4);
    return { type: 'num', answer: a - b * b, text: `${T('(\\sqrt{' + a + '} + ' + b + ')(\\sqrt{' + a + '} - ' + b + ')')} = ?`,
      hint: '這是平方差公式 $(p+q)(p-q) = p^2 - q^2$。', sol: `$(\\sqrt{${a}})^2 - ${b}^2 = ${a} - ${b * b} = ${a - b * b}$。` };
  },
  rationalBin() {
    for (;;) {
      const a = G.pick([3, 5, 6, 7, 10, 11, 13]), b = G.ri(1, 3);
      if (a <= b * b) continue;
      return { type: 'multi', answer: [b, a - b * b], template: 'p = {},q = {}',
        text: `把 ${T('\\frac{1}{\\sqrt{' + a + '} - ' + b + '}')} 的分母有理化,結果是 ${T('\\frac{\\sqrt{' + a + '} + p}{q}')} ,求 p 與 q:`,
        hint: `分子分母同乘「共軛」$\\sqrt{${a}} + ${b}$,分母會變成平方差。`,
        sol: `$\\frac{1}{\\sqrt{${a}} - ${b}}\\times\\frac{\\sqrt{${a}} + ${b}}{\\sqrt{${a}} + ${b}} = \\frac{\\sqrt{${a}} + ${b}}{${a} - ${b * b}}$,所以 p = ${b},q = ${a - b * b}。` };
    }
  },
  fracSimp() {
    const k = nz(-6, 6);
    return { type: 'num', answer: k, text: `化簡 ${T('\\frac{x^2 - ' + k * k + '}{' + LIN(1, -k) + '}')} ${'= ' + T('x + ?')} ,問號是多少?`,
      hint: `分子 $x^2 - ${k * k}$ 是平方差,先因式分解,再跟分母約分。`,
      sol: `$x^2 - ${k * k} = (${LIN(1, -k)})(${LIN(1, k)})$,約掉 $(${LIN(1, -k)})$ 得 $${LIN(1, k)}$,所以問號是 ${k}。` };
  },
  fracSame() {
    const c = nz(-4, 4), q = nz(-6, 6), k = nz(-4, 4), d = nz(-5, 5), a = c + k, p = q - k * d;
    return { type: 'num', answer: k,
      text: `化簡 ${T('\\frac{' + LIN(a, p) + '}{' + LIN(1, -d) + '} - \\frac{' + LIN(c, q) + '}{' + LIN(1, -d) + '}')} ,結果是一個常數,是多少?`,
      hint: '分母相同,分子直接相減(第二個分子要整個減掉,記得變號),再看能不能約分。',
      sol: `分子:$(${LIN(a, p)}) - (${LIN(c, q)}) = ${LIN(k, p - q)}$,恰好是 $${k}(${LIN(1, -d)})$,約分後得 ${k}。` };
  },
  fracMul() {
    const a = nz(-7, 7), b = nz(-6, 6);
    return { type: 'num', answer: a,
      text: `化簡 ${T('\\frac{x^2 - ' + a * a + '}{' + LIN(1, b) + '}\\times\\frac{' + LIN(1, b) + '}{' + LIN(1, -a) + '}')} ${'= ' + T('x + ?')} ,問號是多少?`,
      hint: '分子先因式分解,再把上下相同的因式約掉。',
      sol: `$x^2 - ${a * a} = (${LIN(1, -a)})(${LIN(1, a)})$,約掉 $(${LIN(1, b)})$ 與 $(${LIN(1, -a)})$,剩 $${LIN(1, a)}$,所以問號是 ${a}。` };
  },
  amgmMax() {
    const S = 2 * G.ri(2, 10);
    return { type: 'num', answer: (S / 2) ** 2, text: `兩個正數 a、b 滿足 $a + b = ${S}$,則 $ab$ 的<b>最大值</b>是多少?`,
      hint: '算幾不等式:$\\frac{a+b}{2} \\ge \\sqrt{ab}$,等號成立時 a = b。', sol: `a = b = ${S / 2} 時乘積最大,為 ${S / 2} × ${S / 2} = ${(S / 2) ** 2}。` };
  },
  amgmMin() {
    const t = G.ri(0, 1);
    if (t === 0) { const Pq = G.ri(2, 10); return { type: 'num', answer: 2 * Pq, text: `兩個正數 a、b 滿足 $ab = ${Pq * Pq}$,則 $a + b$ 的<b>最小值</b>是多少?`, hint: '算幾不等式:$a + b \\ge 2\\sqrt{ab}$。', sol: `$a + b \\ge 2\\sqrt{${Pq * Pq}} = ${2 * Pq}$,a = b = ${Pq} 時等號成立。` }; }
    const [al, be] = G.pick([[4, 9], [2, 8], [3, 12], [1, 16], [5, 20], [9, 4], [1, 4], [2, 18]]), s = Math.sqrt(al * be);
    return { type: 'num', answer: 2 * s, text: `$x > 0$ 時,${T(al === 1 ? 'x' : al + 'x')} + ${T('\\frac{' + be + '}{x}')} 的<b>最小值</b>是多少?`,
      hint: '兩個正數相加:$A + B \\ge 2\\sqrt{AB}$。乘起來 x 會消掉!', sol: `$${al === 1 ? '' : al}x\\times\\frac{${be}}{x} = ${al * be}$,所以最小值 $2\\sqrt{${al * be}} = ${2 * s}$。` };
  },

  // ================= 指數 =================
  signPow() {
    const a = G.ri(2, 4), n = G.ri(2, 4), par = Math.random() < 0.5;
    return { type: 'num', answer: par ? (-a) ** n : -(a ** n), text: `${T(par ? '(-' + a + ')^{' + n + '}' : '-' + a + '^{' + n + '}')} = ?`,
      hint: par ? `括號把負號也包起來了:連乘 ${n} 次 ${-a}。` : `指數只管 ${a},負號是最後才加上去的。`,
      sol: par ? `$(${-a})$ 連乘 ${n} 次 = ${(-a) ** n}。` : `$${a}^{${n}} = ${a ** n}$,再加負號 = ${-(a ** n)}。` };
  },
  zeroExp() {
    const a = G.ri(2, 9), b = G.ri(2, 9), c = G.ri(2, 6);
    return { type: 'num', answer: 1 + b, text: `${T(a + '^0 + ' + b + '^1')} = ?`, hint: '任何不是 0 的數,0 次方都是 1;1 次方是它自己。', sol: `$${a}^0 = 1$,$${b}^1 = ${b}$,相加 ${1 + b}。` };
  },
  negExp() {
    if (Math.random() < 0.5) {
      const a = G.ri(2, 6), n = G.ri(1, 4); return { type: 'frac', noreduce: true, answer: [1, a ** n], text: `${T(a + '^{-' + n + '}')} = ?(寫成分數)`,
        hint: '負指數 = 倒數:$a^{-n} = \\frac{1}{a^n}$。', sol: `$${a}^{-${n}} = \\frac{1}{${a}^{${n}}} = ${F(1, a ** n).slice(1, -1)}$。` };
    }
    const [p, q] = G.pick([[2, 3], [1, 2], [2, 5], [3, 4]]), n = G.ri(1, 3);
    return { type: 'frac', answer: [q ** n, p ** n], text: `${T('\\left(\\frac{' + p + '}{' + q + '}\\right)^{-' + n + '}')} = ?(寫成最簡分數或整數)`,
      hint: '負指數 → 把分數上下顛倒,指數變正的。', sol: `顛倒得 $\\left(\\frac{${q}}{${p}}\\right)^{${n}} = \\frac{${q ** n}}{${p ** n}}$。` };
  },
  lawMul() {
    const b = G.pick(['2', '3', '5', 'x', 'a']), m = nz(-5, 9), n = nz(-5, 9);
    return { type: 'num', answer: m + n, text: `${T(b + '^{' + m + '}\\times ' + b + '^{' + n + '} = ' + b + '^{?}')} ,問號是多少?`,
      hint: '同底數相乘,指數相加。', sol: `$${m} + ${PN(n)} = ${m + n}$。` };
  },
  lawDiv() {
    const b = G.pick(['2', '3', '5', 'x', 'a']), m = G.ri(1, 9), n = G.ri(1, 9);
    return { type: 'num', answer: m - n, text: `${T('\\frac{' + b + '^{' + m + '}}{' + b + '^{' + n + '}} = ' + b + '^{?}')} ,問號是多少?`,
      hint: '同底數相除,指數相減(上面減下面)。', sol: `$${m} - ${n} = ${m - n}$。` };
  },
  lawPow() {
    const b = G.pick(['2', '3', '5', 'x', 'a']), m = G.ri(2, 6) * G.pick([1, -1]), n = G.ri(2, 5);
    return { type: 'num', answer: m * n, text: `${T('(' + b + '^{' + m + '})^{' + n + '} = ' + b + '^{?}')} ,問號是多少?`,
      hint: '次方再次方,指數相乘。', sol: `$${m} \\times ${n} = ${m * n}$。` };
  },
  lawMix() {
    const b = G.pick([2, 3]), e = G.ri(1, b === 2 ? 6 : 4);
    if (Math.random() < 0.5) {
      const p = G.ri(1, 6), q = G.ri(1, 6), r = p + q - e;
      if (r < 0) return G1.lawMix();
      return { type: 'num', answer: b ** e, text: `${T('\\frac{' + b + '^{' + p + '}\\times ' + b + '^{' + q + '}}{' + b + '^{' + r + '}}')} = ?(算出數值)`,
        hint: '先用指數律合併成一個次方,再算數值。', sol: `指數:$${p} + ${q} - ${r} = ${e}$,所以 $${b}^{${e}} = ${b ** e}$。` };
    }
    const p = G.ri(1, 3), q = G.ri(2, 3), r = p * q - e;
    if (r < 0) return G1.lawMix();
    return { type: 'num', answer: b ** e, text: `${T('\\frac{(' + b + '^{' + p + '})^{' + q + '}}{' + b + '^{' + r + '}}')} = ?(算出數值)`,
      hint: '分子先用「次方再次方」,再和分母相除。', sol: `分子 $${b}^{${p * q}}$,再除 $${b}^{${r}}$ → $${b}^{${e}} = ${b ** e}$。` };
  },
  fracExp() {
    for (;;) {
      const n = G.pick([2, 3, 4]), r = G.ri(2, 5), p = G.pick([1, 2, 3, -1, -2]);
      if (G.gcd(Math.abs(p), n) !== 1 || r ** n > 256 || (p === 1 && n === 2 && r > 5)) continue;
      const N = r ** n, ex_ = `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${n}}`, val = r ** Math.abs(p);
      const base = { text: `${T(N + '^{' + ex_ + '}')} = ?`,
        hint: `分母 ${n} 代表開 ${n} 次方根,分子代表再取次方。先想:什麼數的 ${n} 次方是 ${N}?`,
        sol: `$${N} = ${r}^{${n}}$,所以 $${N}^{${ex_}} = ${r}^{${n}\\times(${ex_})} = ${r}^{${p}}$ = ${p < 0 ? F(1, val) : val}。` };
      return p < 0 ? { type: 'frac', noreduce: true, answer: [1, val], ...base } : { type: 'num', answer: val, ...base };
    }
  },
  cmpBase() {
    const bases = [{ t: '2', v: 2 }, { t: '3', v: 3 }, { t: '5', v: 5 }, { t: '\\frac{1}{2}', v: 0.5 }, { t: '\\frac{1}{3}', v: 1 / 3 }, { t: '\\frac{2}{3}', v: 2 / 3 }];
    const b = G.pick(bases); let m, n; do { m = G.ri(-4, 6); n = G.ri(-4, 6); } while (m === n);
    const wrap = s => (s.includes('frac') ? `\\left(${s}\\right)` : s);
    const firstBig = b.v > 1 ? m > n : m < n;
    return { type: 'choice', choices: ['前者較大', '後者較大'], answer: firstBig ? 0 : 1,
      text: `比較 ${T(wrap(b.t) + '^{' + m + '}')} 與 ${T(wrap(b.t) + '^{' + n + '}')} 的大小:`,
      hint: b.v > 1 ? '底數大於 1:指數越大,值越大。' : '底數介於 0 和 1 之間:指數越大,值反而越小。',
      sol: b.v > 1 ? `底數大於 1,指數大的比較大,${m > n ? '前者' : '後者'}較大。` : `底數小於 1,指數小的反而比較大,${m < n ? '前者' : '後者'}較大。` };
  },
  cmpExp() {
    for (;;) {
      const a = G.pick([2, 3, 5, 6, 7]), b = G.pick([2, 3, 5, 6, 7]), u = G.ri(1, 4), v = G.ri(1, 4), g = G.pick([5, 10, 15]);
      if (a ** u === b ** v || a ** u > 150 || b ** v > 150) continue;
      const left = a ** u > b ** v;
      return { type: 'choice', choices: ['前者較大', '後者較大'], answer: left ? 0 : 1,
        text: `比較 ${T(a + '^{' + u * g + '}')} 與 ${T(b + '^{' + v * g + '}')} 的大小:`,
        hint: `兩個指數都是 ${g} 的倍數,把它提出來:$a^{${u * g}} = (a^{${u}})^{${g}}$,比較括號裡的數。`,
        sol: `$${a}^{${u * g}} = (${a ** u})^{${g}}$,$${b}^{${v * g}} = (${b ** v})^{${g}}$。指數相同,比底數:${a ** u} ${left ? '>' : '<'} ${b ** v},所以${left ? '前者' : '後者'}較大。` };
    }
  },

  // ================= 科學記號 =================
  sciValid() {
    const m = G.ri(11, 99) / 10, e = G.ri(2, 8), ok = `${m.toFixed(1)}\\times10^{${e}}`;
    const c = choose(T(ok), [T(`${(m * 10).toFixed(0)}\\times10^{${e - 1}}`), T(`${(m / 10).toFixed(2)}\\times10^{${e + 1}}`), T(`${(m * 100).toFixed(0)}\\times10^{${e - 2}}`)]);
    return { type: 'choice', ...c, text: '下列哪一個才是正確的<b>科學記號</b>?', hint: '科學記號 $a\\times10^n$ 的 a 必須滿足 $1 \\le a < 10$。',
      sol: `只有 ${T(ok)} 的前面那個數介於 1 和 10 之間(包含 1,不含 10)。` };
  },
  sciExp() {
    const L = G.ri(1, 3), M = randDigits(L, true), big = Math.random() < 0.6;
    const e = big ? G.ri(Math.max(3, L - 1), 9) : -G.ri(2, 8), s = decStr(M, e);
    return { type: 'num', answer: e, text: `把 ${s} 寫成科學記號 ${T('a\\times10^n')} ,n = ?`,
      hint: big ? '小數點要往左移幾位,才會變成只有一位整數的 a?移幾位,n 就是幾。' : '小數點要往右移幾位,才會變成 a(1 到 10 之間)?移幾位,n 就是「負的」幾。',
      sol: `${s} = ${T(mantStr(M) + '\\times10^{' + e + '}')},所以 n = ${e}。` };
  },
  sciBack() {
    const L = G.ri(1, 3), M = randDigits(L, true), big = Math.random() < 0.55;
    const e = big ? G.ri(Math.max(2, L - 1), 7) : -G.ri(2, 6);
    return { type: 'num', answer: num10(M, e), text: `把 ${T(mantStr(M) + '\\times10^{' + e + '}')} 寫成一般的數(不用逗號):`,
      hint: e > 0 ? `10 的 ${e} 次方 → 小數點往右移 ${e} 位(不夠就補 0)。` : `10 的 ${e} 次方 → 小數點往左移 ${-e} 位(前面補 0)。`,
      sol: `小數點向${e > 0 ? '右' : '左'}移 ${Math.abs(e)} 位,得 ${decStr(M, e).replace(/,/g, '')}。` };
  },
  sciMul() {
    const a = G.ri(2, 9), b = G.ri(2, 9), m = G.ri(-5, 8), n = G.ri(-5, 8), pr = a * b;
    const coef = pr >= 10 ? pr / 10 : pr, e = m + n + (pr >= 10 ? 1 : 0);
    return { type: 'multi', answer: [coef, e], template: 'a = {},n = {}',
      text: `計算 ${T('(' + a + '\\times10^{' + m + '})\\times(' + b + '\\times10^{' + n + '})')} ,結果寫成 ${T('a\\times10^n')}(a 介於 1 和 10 之間):`,
      hint: '係數乘係數,10 的次方相加。如果係數乘出來大於等於 10,要再調整成科學記號。',
      sol: `$${a}\\times${b} = ${pr}$,$10^{${m}}\\times10^{${n}} = 10^{${m + n}}$,得 $${pr}\\times10^{${m + n}}${pr >= 10 ? ` = ${coef}\\times10^{${e}}` : ''}$。` };
  },
  sciDiv() {
    const b = G.ri(2, 4), q = G.ri(1, Math.floor(9 / b)), a = b * q, m = G.ri(-3, 9), n = G.ri(-3, 8);
    return { type: 'multi', answer: [q, m - n], template: 'a = {},n = {}',
      text: `計算 ${T('\\frac{' + a + '\\times10^{' + m + '}}{' + b + '\\times10^{' + n + '}}')} ,結果寫成 ${T('a\\times10^n')} :`,
      hint: '係數除係數,10 的次方相減(上面減下面)。', sol: `$${a}\\div${b} = ${q}$,$10^{${m}}\\div10^{${n}} = 10^{${m - n}}$,得 $${q}\\times10^{${m - n}}$。` };
  },
  sigCount() {
    const L = G.ri(2, 5), M = randDigits(L, false), t = G.ri(0, 2);
    let shown;
    if (t === 0) shown = '0.' + rep0(G.ri(1, 3)) + M;
    else if (t === 1) shown = mantStr(M);
    else shown = T(mantStr(M) + '\\times10^{' + G.ri(2, 7) + '}');
    return { type: 'num', answer: L, text: `${shown} 有幾位<b>有效數字</b>?`,
      hint: '從第一個「不是 0」的數字開始算起,一直算到最後(小數點後面最末尾的 0 也要算)。前面的 0 只是在標位置,不算。',
      sol: `有效數字是 ${M},共 ${L} 位。` };
  },
  sigRound() {
    let D; do { D = G.ri(10000, 99999); } while (D % 10 === 0);
    const s = G.pick([-4, -4, -7, -1]), k = G.ri(2, 4), cut = 10 ** (5 - k), R = Math.floor(D / cut + 0.5);
    const shown = Number(`${D}e${s}`), ans = Number(`${R}e${s + (5 - k)}`);
    return { type: 'num', answer: ans, text: `把 ${shown} 四捨五入到 <b>${k} 位有效數字</b>:`,
      hint: `從第一個不是 0 的數字數起,數到第 ${k} 位;看下一位數字,≥ 5 就進位,< 5 就捨去。`,
      sol: `取前 ${k} 位有效數字,看第 ${k + 1} 位${String(D)[k]}:${+String(D)[k] >= 5 ? '≥ 5 進位' : '< 5 捨去'},答案 ${ans}。` };
  },

  // ================= 常用對數 =================
  logPow() {
    const k = nz(-5, 6), str = k > 0 ? '1' + rep0(k) : '0.' + rep0(-k - 1) + '1';
    const shown = Math.random() < 0.5 ? str : `10^{${k}}`;
    return { type: 'num', answer: k, text: `${T('\\log ' + shown)} = ?`,
      hint: '$\\log$ 問的是:10 的幾次方等於它?', sol: `${shown === str ? str + ' = ' : ''}$10^{${k}}$,所以 $\\log = ${k}$。` };
  },
  logRoot() {
    for (;;) {
      const n = G.pick([2, 3]), p = G.ri(1, 5);
      if (G.gcd(p, n) !== 1) continue;
      const N = 10 ** p, rt = n === 2 ? `\\sqrt{${N}}` : `\\sqrt[3]{${N}}`;
      return { type: 'frac', noreduce: true, answer: [p, n], text: `${T('\\log ' + rt)} = ?(寫成分數)`,
        hint: `根號可以寫成分數指數:$\\sqrt[${n}]{10^{${p}}} = 10^{\\frac{${p}}{${n}}}$。`,
        sol: `$\\sqrt[${n}]{10^{${p}}} = 10^{\\frac{${p}}{${n}}}$,所以 $\\log = \\frac{${p}}{${n}}$。` };
    }
  },
  logInv() {
    const k = G.ri(-3, 5);
    return { type: 'num', answer: Number('1e' + k), text: `若 ${T('\\log x = ' + k)} ,則 x = ?`,
      hint: '$\\log x = k$ 的意思就是 $x = 10^k$。', sol: `$x = 10^{${k}} = ${k >= 0 ? 10 ** k : '0.' + rep0(-k - 1) + '1'}$。` };
  },
  logLaw() {
    const laws = [
      { q: '\\log (ab)', r: '\\log a + \\log b' }, { q: '\\log \\frac{a}{b}', r: '\\log a - \\log b' },
      { q: '\\log a^{3}', r: '3\\log a' }, { q: '\\log \\frac{1}{a}', r: '-\\log a' }
    ];
    const L = G.pick(laws), pool = ['\\log a + \\log b', '\\log a - \\log b', '3\\log a', '-\\log a', '\\log a \\times \\log b', '\\frac{\\log a}{\\log b}', '\\log a + 3', '\\log (a+b)'];
    const wr = shuffle(pool.filter(x => x !== L.r)).slice(0, 3);
    const c = choose(T(L.r), wr.map(T));
    return { type: 'choice', ...c, text: `下列何者等於 ${T(L.q)} ?(a、b 為正數)`,
      hint: '對數律:乘變加、除變減、次方變係數。', sol: `${T(L.q + ' = ' + L.r)}。` };
  },
  logOf() {
    for (;;) {
      const a = G.ri(0, 4), b = G.ri(0, 3), c = G.ri(0, 2), n = 2 ** a * 3 ** b * 5 ** c;
      if (n < 4 || n > 300 || [5, 10, 100].includes(n) || (a + b + c === 1 && c === 0)) continue;
      if (n === 3) continue;
      const tot = 3010 * a + 4771 * b + 6990 * c;
      const parts = [a ? `${a === 1 ? '' : a}\\log 2` : '', b ? `${b === 1 ? '' : b}\\log 3` : '', c ? `${c === 1 ? '' : c}\\log 5` : ''].filter(Boolean).join(' + ');
      const fac = [a ? `2^{${a}}` : '', b ? `3^{${b}}` : '', c ? `5^{${c}}` : ''].filter(Boolean).join('\\times ');
      return { type: 'num', answer: tot / 10000, text: `已知 $\\log 2 = 0.3010$,$\\log 3 = 0.4771$。求 ${T('\\log ' + n)} 。(直接用已知的數字算,答案取到小數第 4 位)`,
        hint: `先把 ${n} 分解成 2、3、5 的乘積;而 $\\log 5 = \\log\\frac{10}{2} = 1 - \\log 2 = 0.6990$。`,
        sol: `$${n} = ${fac}$,所以 $\\log ${n} = ${parts}$ = ${tot / 10000}。` };
    }
  },
  digitsFromLog() {
    const g = G.ri(0, 12), f = G.ri(5, 95) * 100 + G.ri(0, 99);
    const v = (g + f / 10000).toFixed(4);
    return { type: 'num', answer: g + 1, text: `已知 ${T('\\log N = ' + v)} ,則 N 是幾位數?`,
      hint: '整數部分是 g,N 就是 g+1 位數(例如 log N = 2.5 → 100 到 1000 之間 → 3 位數)。',
      sol: `$\\log N = ${v}$,整數部分是 ${g},所以 N 有 ${g + 1} 位。` };
  },
  decimalFromLog() {
    const k = G.ri(1, 7), f = G.ri(10, 90) / 100, v = -(k + f);
    return { type: 'num', answer: k + 1, text: `已知 ${T('\\log x = ' + v.toFixed(2))} ,則 x 化成小數後,小數點後第幾位才出現第一個不是 0 的數字?`,
      hint: `把 $${v.toFixed(2)}$ 寫成「負整數 + 小數」:$${v.toFixed(2)} = -${k + 1} + ${(1 - f).toFixed(2)}$,看那個負整數。`,
      sol: `$${v.toFixed(2)} = -${k + 1} + ${(1 - f).toFixed(2)}$,所以 x 在 $10^{-${k + 1}}$ 到 $10^{-${k}}$ 之間,第 ${k + 1} 位開始不是 0。` };
  },
  digitsPow() {
    for (;;) {
      const a = G.pick([2, 3, 6]), n = G.ri(10, a === 2 ? 70 : 50), [L, given] = LG[a], x = n * L, d = Math.floor(x / 10000) + 1;
      if (d !== digitsCount(a, n)) continue;
      return { type: 'num', answer: d, text: `已知 ${given} ,則 ${T(a + '^{' + n + '}')} 是幾位數?`,
        hint: `先算 $\\log ${a}^{${n}} = ${n}\\log ${a}$,整數部分 + 1 就是位數。`,
        sol: `$\\log ${a}^{${n}} = ${n}\\times${L / 10000} = ${x / 10000}$,整數部分 ${Math.floor(x / 10000)},所以是 ${d} 位數。` };
    }
  },
  decimalPos() {
    for (;;) {
      const a = G.pick([2, 3, 6]), n = G.ri(8, a === 2 ? 50 : 40), [L, given] = LG[a], x = n * L, d = Math.floor(x / 10000) + 1;
      if (d !== digitsCount(a, n)) continue;
      return { type: 'num', answer: d, text: `已知 ${given} ,則 ${T('\\left(\\frac{1}{' + a + '}\\right)^{' + n + '}')} 化成小數後,小數點後第幾位才出現第一個不是 0 的數字?`,
        hint: `$\\left(\\frac{1}{${a}}\\right)^{${n}} = ${a}^{-${n}}$,$\\log$ 是 $-${n}\\log ${a}$,寫成「負整數 + 小數」。`,
        sol: `$\\log ${a}^{-${n}} = -${x / 10000}$,寫成 $-${d} + ${(d - x / 10000).toFixed(4)}$,所以是第 ${d} 位。` };
    }
  },
  expSolve() {
    for (;;) {
      const a = G.pick([2, 3]), k = G.ri(1, 6), L = a === 2 ? 0.3010 : 0.4771, x = k / L, x10 = x * 10;
      if (Math.abs(x10 - Math.floor(x10) - 0.5) < 0.05) continue;
      return { type: 'num', answer: Number((Math.round(x10) / 10).toFixed(1)), text: `已知 $\\log ${a} = ${L.toFixed(4)}$。解 ${T(a + '^x = ' + 10 ** k)} ,x ≈ ?(四捨五入到小數第一位)`,
        hint: `兩邊取 $\\log$:$x\\log ${a} = ${k}$,所以 $x = \\frac{${k}}{${L.toFixed(4)}}$,用計算機算。`,
        sol: `$x = \\frac{\\log ${10 ** k}}{\\log ${a}} = \\frac{${k}}{${L.toFixed(4)}} \\approx ${x.toFixed(3)}$,四捨五入得 ${(Math.round(x10) / 10).toFixed(1)}。` };
    }
  }
};
