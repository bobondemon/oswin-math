// 序章:杜王町的夏天(國中銜接)
const F = (n, d) => `$${G.frac(n, d)}$`;
const fr = (n, d) => ({ type: 'frac', answer: G.reduce(n, d) });

// ---- 題目產生器 ----
const gen = {
  // 平均分成 d 份,取 n 份
  partOf() {
    const d = G.ri(4, 12), n = G.ri(1, d - 1);
    const items = [['一塊披薩', '片', '吃了'], ['一條巧克力', '格', '吃了'], ['一條緞帶', '段', '用了']];
    const [o, u, v] = G.pick(items);
    return { type: 'frac', noreduce: true, answer: [n, d],
      text: `${o}平均分成 ${d} ${u},${v} ${n} ${u},${v}幾分之幾?(用分數表示)`,
      hint: `分母 = 平均分成幾份(${d}),分子 = 取了幾份(${n})。`,
      sol: `分成 ${d} ${u} → 分母是 ${d};${v} ${n} ${u} → 分子是 ${n}。答案 ${F(n, d)}。` };
  },
  leftOf() {
    const d = G.ri(4, 12), n = G.ri(1, d - 1);
    return { type: 'frac', noreduce: true, answer: [d - n, d],
      text: `一條緞帶平均分成 ${d} 段,用了 ${n} 段,<b>剩下</b>幾分之幾?`,
      hint: `先算剩下幾段:${d} − ${n}。分母還是 ${d}。`,
      sol: `剩下 ${d} − ${n} = ${d - n} 段,所以是 ${F(d - n, d)}。` };
  },
  compareSameDen() {
    const d = G.ri(5, 12);
    let a = G.ri(1, d - 1), b = G.ri(1, d - 1); while (a === b) b = G.ri(1, d - 1);
    const sw = Math.random() < 0.5, c = sw ? [b, a] : [a, b];
    return { type: 'choice', choices: [F(c[0], d), F(c[1], d)], answer: c[0] > c[1] ? 0 : 1,
      text: `哪一個分數比較<b>大</b>?`,
      hint: '分母一樣時,分子越大,代表取的份數越多。',
      sol: `分母都是 ${d},比分子:${Math.max(a, b)} > ${Math.min(a, b)},所以 ${F(Math.max(a, b), d)} 比較大。` };
  },
  fillEquiv() {
    const b = G.ri(2, 6), a = G.ri(1, b - 1), k = G.ri(2, 5);
    return { type: 'num', answer: a * k,
      text: `填空:${F(a, b)} = $\\frac{?}{${b * k}}$`,
      hint: `分母從 ${b} 變成 ${b * k},是乘以 ${k}。分子也要乘以同一個數。`,
      sol: `${b} × ${k} = ${b * k},所以分子也要 × ${k}:${a} × ${k} = ${a * k}。` };
  },
  reduceEasy() {
    const pairs = [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5], [3, 7], [5, 6]];
    const [a, b] = G.pick(pairs), k = G.ri(2, 5);
    return { ...fr(a, b), text: `約分成最簡分數:${F(a * k, b * k)}`,
      hint: `分子分母可以同時除以 ${k}。`,
      sol: `${a * k} ÷ ${k} = ${a},${b * k} ÷ ${k} = ${b}。答案 ${F(a, b)}。` };
  },
  reduceHard() {
    const pairs = [[3, 4], [5, 8], [4, 9], [7, 12], [5, 6], [7, 10], [8, 15], [11, 12]];
    const [a, b] = G.pick(pairs), k = G.ri(3, 9), g = k;
    return { ...fr(a, b), text: `約分成最簡分數:${F(a * k, b * k)}`,
      hint: `找分子 ${a * k} 與分母 ${b * k} 的<b>最大公因數</b>,再同除。`,
      sol: `${a * k} 和 ${b * k} 的最大公因數是 ${g}。同除以 ${g} 得 ${F(a, b)}。` };
  },
  equalTo() {
    const [a, b] = G.pick([[1, 2], [2, 3], [3, 4], [1, 3], [2, 5]]), k = G.ri(2, 4);
    const right = F(a * k, b * k);
    let w1 = F(a * k, b * k + 1), w2 = F(a * k + 1, b * k);
    const opts = [right, w1, w2].map((c, i) => ({ c, i })).sort(() => Math.random() - 0.5);
    return { type: 'choice', choices: opts.map(o => o.c), answer: opts.findIndex(o => o.i === 0),
      text: `哪一個分數和 ${F(a, b)} 大小<b>相等</b>?`,
      hint: `把 ${F(a, b)} 的分子分母同乘一個數,看看會變成誰。`,
      sol: `${F(a, b)} 分子分母同乘 ${k} 得 ${right}。` };
  },
  addSame() {
    const d = G.ri(4, 12), a = G.ri(1, d - 2), b = G.ri(1, d - 1 - a);
    return { ...fr(a + b, d), text: `計算(約成最簡分數):${F(a, d)} + ${F(b, d)}`,
      hint: '分母相同,分母不變,只把分子加起來。',
      sol: `分子 ${a} + ${b} = ${a + b},分母不變 → ${F(a + b, d)},約分得 ${F(...G.reduce(a + b, d))}。` };
  },
  addDiff() {
    const [b, d] = G.pick([[2, 3], [2, 5], [3, 4], [3, 5], [2, 4], [3, 6], [4, 6], [5, 10], [4, 5]]);
    const a = G.ri(1, b - 1), c = G.ri(1, d - 1), L = G.lcm(b, d);
    const n = a * (L / b) + c * (L / d);
    return { ...fr(n, L), text: `計算(約成最簡分數):${F(a, b)} + ${F(c, d)}`,
      hint: `先通分:找 ${b} 和 ${d} 的最小公倍數 ${L},兩個分數都化成分母 ${L}。`,
      sol: `通分:${F(a * (L / b), L)} + ${F(c * (L / d), L)} = ${F(n, L)}${G.gcd(n, L) > 1 ? ',約分得 ' + F(...G.reduce(n, L)) : ''}。` };
  },
  subDiff() {
    const [b, d] = G.pick([[2, 3], [2, 5], [3, 4], [3, 5], [4, 6], [2, 4], [5, 6]]);
    const L = G.lcm(b, d);
    let a, c;
    do { a = G.ri(1, b - 1); c = G.ri(1, d - 1); } while (a / b === c / d);
    let big = { n: a, d: b }, small = { n: c, d: d };
    if (a / b < c / d) { big = { n: c, d: d }; small = { n: a, d: b }; }
    const n = big.n * (L / big.d) - small.n * (L / small.d);
    return { ...fr(n, L), text: `計算(約成最簡分數):${F(big.n, big.d)} − ${F(small.n, small.d)}`,
      hint: `先通分成分母 ${L},再把分子相減。`,
      sol: `通分:${F(big.n * (L / big.d), L)} − ${F(small.n * (L / small.d), L)} = ${F(n, L)}${G.gcd(n, L) > 1 ? ',約分得 ' + F(...G.reduce(n, L)) : ''}。` };
  },
  addStory() {
    const [b, d] = G.pick([[2, 3], [3, 4], [2, 5], [3, 6]]);
    const L = G.lcm(b, d), a = 1, c = 1, n = L / b + L / d;
    return { ...fr(n, L), text: `小明早上喝了 ${F(a, b)} 瓶水,下午又喝了 ${F(c, d)} 瓶,一共喝了幾瓶?(最簡分數)`,
      hint: `「一共」就是相加。先通分成分母 ${L}。`,
      sol: `${F(a, b)} + ${F(c, d)} = ${F(L / b, L)} + ${F(L / d, L)} = ${F(n, L)}${G.gcd(n, L) > 1 ? ' = ' + F(...G.reduce(n, L)) : ''}。` };
  },
  fracToDec() {
    const [n, d] = G.pick([[1, 2], [3, 4], [1, 4], [2, 5], [3, 5], [1, 5], [7, 10], [3, 8], [1, 8], [9, 20], [3, 20], [7, 25], [4, 5]]);
    return { type: 'num', answer: n / d, text: `把 ${F(n, d)} 寫成小數`,
      hint: `分數就是除法:${n} ÷ ${d}。`,
      sol: `${n} ÷ ${d} = ${n / d}。` };
  },
  decToFrac() {
    const [x, n, d] = G.pick([[0.5, 1, 2], [0.25, 1, 4], [0.75, 3, 4], [0.2, 1, 5], [0.4, 2, 5], [0.6, 3, 5], [0.8, 4, 5], [0.125, 1, 8], [0.35, 7, 20], [0.45, 9, 20], [0.05, 1, 20], [0.15, 3, 20]]);
    const place = String(x).length - 2, den = Math.pow(10, place);
    return { ...fr(n, d), text: `把 ${x} 寫成最簡分數`,
      hint: `${x} 有 ${place} 位小數,先寫成分母 ${den} 的分數,再約分。`,
      sol: `${x} = ${F(Math.round(x * den), den)} = ${F(n, d)}。` };
  },
  compareMix() {
    const [n, d, x] = G.pick([[3, 4, 0.7], [2, 5, 0.45], [4, 5, 0.75], [1, 4, 0.3], [3, 8, 0.4], [7, 10, 0.65]]);
    const fv = n / d, left = Math.random() < 0.5;
    const A = left ? F(n, d) : String(x), B = left ? String(x) : F(n, d);
    const av = left ? fv : x, bv = left ? x : fv;
    return { type: 'choice', choices: [A, B], answer: av > bv ? 0 : 1,
      text: `哪一個比較<b>大</b>?`,
      hint: `把分數化成小數,再比較。${F(n, d)} = ${fv}。`,
      sol: `${F(n, d)} = ${fv},和 ${x} 比較,${fv > x ? F(n, d) : x} 比較大。` };
  }
};

// ---- 正負數題目產生器 ----
const P = n => (n < 0 ? `(${n})` : `${n}`); // 負數加括號:5 + (-3)
const sgn = n => (n < 0 ? '−' + (-n) : String(n)); // 顯示用
const nz = (a, b) => { let x; do { x = G.ri(a, b); } while (x === 0); return x; };
const gen0 = {
  cmpInt() {
    let a, b; do { a = G.ri(-9, 9); b = G.ri(-9, 9); } while (a === b);
    const big = Math.max(a, b);
    return { type: 'choice', choices: [`$${a}$`, `$${b}$`], answer: a > b ? 0 : 1,
      text: `哪一個數比較<b>大</b>?`,
      hint: '在數線上,越往右越大;負數離 0 越遠反而越小。',
      sol: `數線上 ${big} 在比較右邊,所以 $${big}$ 比較大。` };
  },
  tempChange() {
    const a = G.ri(-8, 3), d = G.ri(3, 12), up = Math.random() < 0.5;
    const ans = up ? a + d : a - d;
    return { type: 'num', answer: ans,
      text: `杜王町早上氣溫 $${a}$°C,到了中午${up ? '上升' : '下降'} ${d}°C,現在是幾°C?`,
      hint: `${up ? '上升就往右(加)' : '下降就往左(減)'},從 ${a} 開始走 ${d} 格。`,
      sol: `$${a} ${up ? '+' : '-'} ${d} = ${ans}$,所以是 ${ans}°C。` };
  },
  distance() {
    let a, b; do { a = G.ri(-9, 9); b = G.ri(-9, 9); } while (a >= b || b - a < 3);
    return { type: 'num', answer: b - a,
      text: `數線上的點 $${a}$ 和點 $${b}$ 相距幾格?`,
      hint: '大的減小的,或是從左邊那個點走到右邊那個點數格子。',
      sol: `$${b} - ${P(a)} = ${b - a}$,相距 ${b - a} 格。` };
  },
  addInt() {
    let a, b; do { a = G.ri(-12, 12); b = G.ri(-12, 12); } while ((a >= 0 && b >= 0) || a === 0 || b === 0);
    return { type: 'num', answer: a + b,
      text: `計算:$${a} + ${P(b)}$`,
      hint: b < 0 ? `加上負數,就是往左走 ${-b} 格。` : `從 ${a} 往右走 ${b} 格。`,
      sol: `$${a} + ${P(b)} = ${a + b}$。` };
  },
  subInt() {
    const a = G.ri(-10, 10), b = nz(-9, 9);
    return { type: 'num', answer: a - b,
      text: `計算:$${a} - ${P(b)}$`,
      hint: '減去一個數 = 加上它的<b>相反數</b>。',
      sol: `$${a} - ${P(b)} = ${a} + ${P(-b)} = ${a - b}$。` };
  },
  scoreStory() {
    const a = G.ri(2, 9) * 10, d = G.ri(2, 9) * 10, up = Math.random() < 0.5;
    const ans = up ? -a + d : -a - d;
    return { type: 'num', answer: ans,
      text: `逃獄犯安十郎的「信用分數」本來是 $-${a}$ 分,今天${up ? '加' : '又被扣'}了 ${d} 分,現在是幾分?`,
      hint: `${up ? '加分是 +' : '扣分是 −'}${d}:算 $-${a} ${up ? '+' : '-'} ${d}$。`,
      sol: `$-${a} ${up ? '+' : '-'} ${d} = ${ans}$ 分。` };
  },
  mulInt() {
    let a, b; do { a = nz(-9, 9); b = nz(-9, 9); } while (a > 0 && b > 0);
    return { type: 'num', answer: a * b,
      text: `計算:$${P(a)} \\times ${P(b)}$`,
      hint: '先決定正負:同號為正,異號為負;再把數字相乘。',
      sol: `${a < 0 && b < 0 ? '負 × 負 = 正' : '一正一負 = 負'},$${Math.abs(a)} \\times ${Math.abs(b)} = ${Math.abs(a * b)}$,答案 ${a * b}。` };
  },
  divInt() {
    const b = nz(-9, 9), q = nz(-9, 9), a = b * q;
    return { type: 'num', answer: q,
      text: `計算:$${a} \\div ${P(b)}$`,
      hint: '除法的正負規則和乘法一樣:同號為正,異號為負。',
      sol: `$${a} \\div ${P(b)} = ${q}$(因為 $${P(b)} \\times ${P(q)} = ${a}$)。` };
  },
  signOnly() {
    const a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9);
    const ans = a * b * c;
    return { type: 'choice', choices: ['正數', '負數'], answer: ans > 0 ? 0 : 1,
      text: `$${P(a)} \\times ${P(b)} \\times ${P(c)}$ 的結果是正數還是負數?`,
      hint: '算算有幾個負數:偶數個負數結果為正,奇數個為負。',
      sol: `有 ${[a, b, c].filter(x => x < 0).length} 個負數,所以結果是${ans > 0 ? '正' : '負'}數(${ans})。` };
  },
  mixed() {
    const a = G.ri(-9, 9), b = nz(-5, 5), c = nz(-5, 5);
    if (Math.random() < 0.5) {
      return { type: 'num', answer: a + b * c,
        text: `計算:$${a} + ${P(b)} \\times ${P(c)}$`,
        hint: '先乘除、後加減。先算 $' + P(b) + ' \\times ' + P(c) + '$。',
        sol: `先算乘法:$${P(b)} \\times ${P(c)} = ${b * c}$;再 $${a} + ${P(b * c)} = ${a + b * c}$。` };
    }
    return { type: 'num', answer: (a + b) * c,
      text: `計算:$(${a} + ${P(b)}) \\times ${P(c)}$`,
      hint: '括號裡面最先算。',
      sol: `括號內:$${a} + ${P(b)} = ${a + b}$;再 $${P(a + b)} \\times ${P(c)} = ${(a + b) * c}$。` };
  },
  floorStory() {
    const start = G.ri(-3, 5), floors = nz(-4, 4) , times = G.ri(2, 4);
    const ans = start + floors * times;
    return { type: 'num', answer: ans,
      text: `電梯在 $${start}$ 樓(負數是地下樓層),每次按鈕都${floors > 0 ? '上' : '下'} ${Math.abs(floors)} 層,連按 ${times} 次,最後在幾樓?`,
      hint: `一共移動 ${times} × ${floors} 層(上為正、下為負),再加到起點。`,
      sol: `$${start} + ${times} \\times ${P(floors)} = ${start} + ${P(floors * times)} = ${ans}$,所以在 ${ans} 樓。` };
  }
};

// ---- 一次方程式題目產生器 ----
// 係數與常數項組成 "ax + b" 的顯示字串(處理 1、-1、0 與正負號)
const LIN = (a, b) => {
  const co = a === 1 ? '' : a === -1 ? '-' : String(a);
  const x = a === 0 ? '' : `${co}x`;
  const k = b === 0 ? '' : (a === 0 ? String(b) : (b > 0 ? ` + ${b}` : ` - ${-b}`));
  return (x + k) || '0';
};
const genE = {
  oneStep() {
    const t = G.pick(['add', 'sub', 'mul']), x = nz(-9, 12);
    if (t === 'add') { const a = G.ri(2, 15); return { type: 'num', answer: x, text: `解方程式:$x + ${a} = ${x + a}$,x = ?`,
      hint: `x 被加上了 ${a},要「倒著做」:兩邊同時減 ${a}。`, sol: `兩邊同減 ${a}:$x = ${x + a} - ${a} = ${x}$。` }; }
    if (t === 'sub') { const a = G.ri(2, 15); return { type: 'num', answer: x, text: `解方程式:$x - ${a} = ${x - a}$,x = ?`,
      hint: `x 被減了 ${a},要倒著做:兩邊同時加 ${a}。`, sol: `兩邊同加 ${a}:$x = ${x - a} + ${a} = ${x}$。` }; }
    const a = G.ri(2, 9);
    return { type: 'num', answer: x, text: `解方程式:$${a}x = ${a * x}$,x = ?`,
      hint: `x 被乘上了 ${a},要倒著做:兩邊同時除以 ${a}。`, sol: `兩邊同除以 ${a}:$x = ${a * x} \\div ${a} = ${x}$。` };
  },
  twoStep() {
    let a = nz(-9, 9); if (Math.abs(a) < 2) a = a < 0 ? -2 : 2;
    const x = nz(-9, 9), b = nz(-12, 12), c = a * x + b;
    return { type: 'num', answer: x, text: `解方程式:$${LIN(a, b)} = ${c}$,x = ?`,
      hint: `先把常數項 ${b} 移到右邊(倒著做),再把係數 ${a} 除掉。`,
      sol: `兩邊${b > 0 ? '減' : '加'} ${Math.abs(b)}:$${a}x = ${c - b}$;兩邊同除以 ${a}:$x = ${x}$。` };
  },
  fracEq() {
    const a = G.ri(2, 6), x = a * nz(-6, 6), b = nz(-9, 9), c = x / a + b;
    return { type: 'num', answer: x, text: `解方程式:$\\frac{x}{${a}} ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${c}$,x = ?`,
      hint: `先把 ${b > 0 ? '+' : '-'} ${Math.abs(b)} 移到右邊,再兩邊同乘以 ${a}。`,
      sol: `$\\frac{x}{${a}} = ${c - b}$,兩邊同乘 ${a}:$x = ${x}$。` };
  },
  bothSides() {
    let a, c; do { a = G.ri(1, 9); c = G.ri(1, 9); } while (a === c);
    const x = nz(-9, 9), b = nz(-10, 10), d = (a - c) * x + b;
    return { type: 'num', answer: x, text: `解方程式:$${LIN(a, b)} = ${LIN(c, d)}$,x = ?`,
      hint: '把有 x 的項移到同一邊、常數移到另一邊,<b>移過等號要變號</b>。',
      sol: `移項:$${a - c}x = ${d - b}$(x 的項移到左邊、常數移到右邊),兩邊同除 ${a - c}:$x = ${x}$。` };
  },
  paren() {
    const a = G.ri(2, 6), x = nz(-9, 9), b = nz(-8, 8), c = a * (x + b);
    return { type: 'num', answer: x, text: `解方程式:$${a}(x ${b > 0 ? '+' : '-'} ${Math.abs(b)}) = ${c}$,x = ?`,
      hint: `可以先兩邊同除以 ${a},再解 $x ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${c / a}$;或先把括號展開。`,
      sol: `兩邊同除 ${a}:$x ${b > 0 ? '+' : '-'} ${Math.abs(b)} = ${c / a}$,所以 $x = ${x}$。` };
  },
  shop() {
    const p = G.pick([30, 40, 50, 60, 80]), n = G.ri(2, 5), fee = G.pick([10, 20, 30]);
    return { type: 'num', answer: p, text: `買 ${n} 片披薩再加外送費 ${fee} 元,一共付 ${n * p + fee} 元。每片披薩幾元?`,
      hint: `設每片 x 元,列方程式:$${n}x + ${fee} = ${n * p + fee}$。`,
      sol: `$${n}x + ${fee} = ${n * p + fee}$,$${n}x = ${n * p}$,$x = ${p}$。` };
  },
  run() {
    const a = G.ri(2, 9) * 10, b = G.pick([100, 150, 200, 250, 300]), t = G.ri(3, 12), c = b + a * t;
    return { type: 'num', answer: t, text: `逃獄犯安十郎已經逃了 ${b} 公尺,之後每分鐘再逃 ${a} 公尺。幾分鐘後他總共逃了 ${c} 公尺?`,
      hint: `設 x 分鐘後,列式:$${b} + ${a}x = ${c}$。`,
      sol: `$${b} + ${a}x = ${c}$,$${a}x = ${c - b}$,$x = ${t}$ 分鐘。` };
  },
  chase() {
    const v1 = G.ri(4, 8) * 10, k = G.ri(1, 4) * 10, t = G.ri(3, 10), d = k * t, v2 = v1 + k;
    return { type: 'num', answer: t, text: `安十郎先跑了 ${d} 公尺,每分鐘跑 ${v1} 公尺;仗助從原點出發追,每分鐘跑 ${v2} 公尺。幾分鐘後仗助追上他?`,
      hint: `設 x 分鐘追上:仗助跑的距離 = 安十郎跑的距離,即 $${v2}x = ${v1}x + ${d}$。`,
      sol: `$${v2}x = ${v1}x + ${d}$,移項 $${k}x = ${d}$,$x = ${t}$ 分鐘。` };
  }
};

// ---- 乘法公式與因式分解題目產生器 ----
// 顯示 (x + a) 或 (x - a)
const XA = a => `(x ${a < 0 ? '-' : '+'} ${Math.abs(a)})`;
const genF = {
  expand() { // (x+a)(x+b) = x² + □x + □
    const a = nz(-9, 9), b = nz(-9, 9);
    return { type: 'multi', answer: [a + b, a * b], template: '$x^2 + $ {} $x + $ {}',
      text: `展開:$${XA(a)}${XA(b)}$ (填入 x 項係數與常數項,可為負數)`,
      hint: '分配律:$(x+a)(x+b) = x^2 + ax + bx + ab$。x 的係數是 a+b,常數項是 a×b。',
      sol: `x 項:$${a} + ${P(b)} = ${a + b}$;常數項:$${P(a)} \\times ${P(b)} = ${a * b}$。所以 $x^2 ${a + b < 0 ? '-' : '+'} ${Math.abs(a + b)}x ${a * b < 0 ? '-' : '+'} ${Math.abs(a * b)}$。` };
  },
  square() { // (x±a)² = x² + □x + □
    const a = nz(-9, 9);
    return { type: 'multi', answer: [2 * a, a * a], template: '$x^2 + $ {} $x + $ {}',
      text: `用公式展開:$${XA(a)}^2$`,
      hint: '$(x+a)^2 = x^2 + 2ax + a^2$(a 是負數時也適用,直接代入)。',
      sol: `$2a = ${2 * a}$,$a^2 = ${a * a}$。所以 $x^2 ${2 * a < 0 ? '-' : '+'} ${Math.abs(2 * a)}x + ${a * a}$。` };
  },
  diffSq() { // (x+a)(x-a) = x² - □
    const a = G.ri(2, 12);
    return { type: 'num', answer: a * a, text: `展開 $(x + ${a})(x - ${a}) = x^2 - \\square$,方格中應填什麼數?`,
      hint: '平方差公式:$(x+a)(x-a) = x^2 - a^2$。',
      sol: `$(x+${a})(x-${a}) = x^2 - ${a}^2 = x^2 - ${a * a}$。` };
  },
  sqNum() { // 速算平方
    const n = G.pick([10, 20, 30, 40, 50, 100]), d = G.pick([1, 2, 3]) * (Math.random() < 0.5 ? 1 : -1);
    const v = n + d;
    return { type: 'num', answer: v * v, text: `用公式速算:$${v}^2 = ?$`,
      hint: `把 ${v} 拆成 ${n} ${d < 0 ? '-' : '+'} ${Math.abs(d)},用 $(a ${d < 0 ? '-' : '+'} b)^2 = a^2 ${d < 0 ? '-' : '+'} 2ab + b^2$。`,
      sol: `$${v}^2 = (${n} ${d < 0 ? '-' : '+'} ${Math.abs(d)})^2 = ${n * n} ${d < 0 ? '-' : '+'} ${2 * n * Math.abs(d)} + ${d * d} = ${v * v}$。` };
  },
  diffSqNum() { // 速算平方差
    const n = G.pick([20, 30, 40, 50, 100]), d = G.pick([1, 2, 3, 4, 5]);
    return { type: 'num', answer: n * n - d * d, text: `用平方差公式速算:$${n + d} \\times ${n - d} = ?$`,
      hint: `$${n + d} \\times ${n - d} = (${n}+${d})(${n}-${d}) = ${n}^2 - ${d}^2$。`,
      sol: `$${n}^2 - ${d}^2 = ${n * n} - ${d * d} = ${n * n - d * d}$。` };
  },
  common() { // 提公因式
    const g = G.ri(2, 6), p = G.ri(1, 5), q = G.ri(1, 6);
    return { type: 'multi', answer: [p, q], template: `$${LIN(g * p, g * q)} = ${g}($ {} $x + $ {} $)$`,
      text: `提出公因式 ${g}:`,
      hint: `把每一項都除以 ${g}:$${g * p} \\div ${g}$ 和 $${g * q} \\div ${g}$。`,
      sol: `$${g * p}x \\div ${g} = ${p}x$,$${g * q} \\div ${g} = ${q}$,所以 $${g}(${LIN(p, q)})$。` };
  },
  cross() { // x² + bx + c = (x+p)(x+q)
    const p = nz(-9, 9), q = nz(-9, 9), b = p + q, c = p * q;
    return { type: 'multi', unordered: true, answer: [p, q],
      template: `$x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = (x + $ {} $)(x + $ {} $)$`,
      text: `因式分解(兩格先後次序不拘,可填負數):`,
      hint: `找兩個數:<b>相乘 = ${c}</b>、<b>相加 = ${b}</b>。`,
      sol: `${p} × ${P(q)} = ${c},${p} + ${P(q)} = ${b},所以是 $${XA(p)}${XA(q)}$。` };
  },
  diffSqFactor() { // x² - a² = (x+a)(x-a)
    const a = G.ri(2, 12);
    return { type: 'multi', answer: [a, a], template: `$x^2 - ${a * a} = (x + $ {} $)(x - $ {} $)$`,
      text: `用平方差公式因式分解:`,
      hint: `$${a * a}$ 是哪個數的平方?`,
      sol: `$${a * a} = ${a}^2$,所以 $x^2 - ${a}^2 = (x+${a})(x-${a})$。` };
  },
  roots() { // 解 x² + bx + c = 0
    const p = nz(-9, 9), q = nz(-9, 9), b = p + q, c = p * q;
    return { type: 'multi', unordered: true, answer: [-p, -q], template: '$x = $ {} 或 $x = $ {}',
      text: `解方程式 $x^2 ${b < 0 ? '-' : '+'} ${Math.abs(b)}x ${c < 0 ? '-' : '+'} ${Math.abs(c)} = 0$(兩個根先後不拘):`,
      hint: `先因式分解成 $(x+□)(x+□)=0$:兩數相乘 ${c}、相加 ${b};再讓每個括號等於 0。`,
      sol: `$${XA(p)}${XA(q)} = 0$,所以 $x = ${-p}$ 或 $x = ${-q}$。` };
  }
};

// ---- 座標與一次函數題目產生器 ----
const QUAD = ['第一象限', '第二象限', '第三象限', '第四象限'];
const quadOf = (x, y) => (x > 0 && y > 0 ? 0 : x < 0 && y > 0 ? 1 : x < 0 && y < 0 ? 2 : 3);
const FN = (m, b) => `f(x) = ${LIN(m, b)}`;
const genG = {
  readPoint() {
    const x = nz(-5, 5), y = nz(-5, 5);
    return { type: 'multi', answer: [x, y], template: '$P = ($ {} $,$ {} $)$',
      text: `${G.plane({ pts: [{ x, y, label: 'P' }] })}<div>寫出點 P 的座標(先 x、後 y):</div>`,
      hint: '先看點在 y 軸的左邊(負)還是右邊(正)、離 y 軸幾格,這是 x;再看在 x 軸上方或下方幾格,這是 y。',
      sol: `P 的橫向位置是 ${x}、縱向位置是 ${y},所以 $P = (${x}, ${y})$。` };
  },
  quadrant() {
    const x = nz(-9, 9), y = nz(-9, 9), a = quadOf(x, y);
    return { type: 'choice', choices: QUAD, answer: a, text: `點 $(${x}, ${y})$ 在哪一個象限?`,
      hint: '第一象限(+,+)、第二象限(−,+)、第三象限(−,−)、第四象限(+,−)。',
      sol: `x ${x > 0 ? '為正' : '為負'}、y ${y > 0 ? '為正' : '為負'},所以在${QUAD[a]}。` };
  },
  axisDist() {
    const x = nz(-9, 9), y = nz(-9, 9), toX = Math.random() < 0.5;
    return { type: 'num', answer: Math.abs(toX ? y : x), text: `點 $(${x}, ${y})$ 到 ${toX ? 'x' : 'y'} 軸的距離是多少?`,
      hint: toX ? '到 x 軸的距離只看 y 座標,距離不會是負的。' : '到 y 軸的距離只看 x 座標,距離不會是負的。',
      sol: `到 ${toX ? 'x' : 'y'} 軸的距離 = ${toX ? 'y' : 'x'} 座標的絕對值 = ${Math.abs(toX ? y : x)}。` };
  },
  evalF() {
    const m = nz(-5, 5), b = nz(-9, 9), x = nz(-6, 6);
    return { type: 'num', answer: m * x + b, text: `$${FN(m, b)}$,求 $f(${x})$ 的值。`,
      hint: `把 x 換成 ${P(x)} 代進去算。`,
      sol: `$f(${x}) = ${P(m)} \\times ${P(x)} + ${P(b)} = ${m * x + b}$。` };
  },
  solveF() {
    const m = nz(-5, 5), b = nz(-9, 9), x = nz(-6, 6), y = m * x + b;
    return { type: 'num', answer: x, text: `$${FN(m, b)}$,若 $f(x) = ${y}$,則 x = ?`,
      hint: `列方程式 $${LIN(m, b)} = ${y}$,用上一個主題學的方法解。`,
      sol: `$${LIN(m, b)} = ${y}$,$${m}x = ${y - b}$,$x = ${x}$。` };
  },
  table() {
    const m = nz(-4, 4), b = nz(-6, 6);
    return { type: 'multi', answer: [m + b, 2 * m + b, 3 * m + b], template: '$f(1) = $ {} $,\\ f(2) = $ {} $,\\ f(3) = $ {}',
      text: `$${FN(m, b)}$,填表:`,
      hint: '依序把 x = 1、2、3 代進去。注意每次 x 加 1,答案會固定增加(或減少)一個數。',
      sol: `$f(1) = ${m + b}$,$f(2) = ${2 * m + b}$,$f(3) = ${3 * m + b}$(每次增加 ${m})。` };
  },
  readLine() {
    const m = nz(-3, 3), b = G.ri(-4, 4);
    return { type: 'multi', answer: [m, b], template: '$y = $ {} $x + $ {}',
      text: `${G.plane({ line: { m, b } })}<div>寫出這條直線的方程式 $y = mx + b$(填 m 與 b,可為負數):</div>`,
      hint: 'b:直線和 y 軸相交的高度。m:從交點每往右走 1 格,上升(正)或下降(負)幾格。',
      sol: `與 y 軸交在 (0, ${b}),所以 b = ${b};每往右 1 格${m > 0 ? '上升' : '下降'} ${Math.abs(m)} 格,所以 m = ${m}。` };
  },
  passPt() {
    const m = nz(-5, 5), b = nz(-9, 9), x0 = nz(-5, 5), y0 = m * x0 + b;
    return { type: 'num', answer: b, text: `直線 $y = ${m}x + b$ 通過點 $(${x0}, ${y0})$,求 b。`,
      hint: '點在直線上,代進去一定成立:把 x、y 代入求 b。',
      sol: `$${y0} = ${P(m)} \\times ${P(x0)} + b$,$b = ${y0} - ${P(m * x0)} = ${b}$。` };
  },
  parallel() {
    const m = nz(-4, 4); let m2, m3;
    do { m2 = nz(-4, 4); } while (m2 === m);
    do { m3 = nz(-4, 4); } while (m3 === m || m3 === m2);
    const k = G.ri(-5, 5), opts = [[m, G.ri(-5, 5)], [m2, G.ri(-5, 5)], [m3, G.ri(-5, 5)]];
    if (opts[0][1] === k) opts[0][1] = k + 1;
    const order = [0, 1, 2].sort(() => Math.random() - 0.5);
    return { type: 'choice', choices: order.map(i => `$y = ${LIN(opts[i][0], opts[i][1])}$`), answer: order.indexOf(0),
      text: `哪一條直線和 $y = ${LIN(m, k)}$ <b>平行</b>?`,
      hint: '平行線的斜率(x 前面的係數)相同。',
      sol: `平行線斜率相同,都是 ${m},所以選 $y = ${LIN(opts[0][0], opts[0][1])}$。` };
  },
  twoPoints() {
    const m = nz(-4, 4), b = G.ri(-6, 6), x1 = G.ri(-4, 0), x2 = x1 + G.ri(1, 4), y1 = m * x1 + b, y2 = m * x2 + b;
    return { type: 'multi', answer: [m, b], template: '$y = $ {} $x + $ {}',
      text: `一條直線通過 $(${x1}, ${y1})$ 和 $(${x2}, ${y2})$,求方程式 $y = mx + b$:`,
      hint: `先算斜率 m = (y 的變化)÷(x 的變化);再把一個點代入求 b。`,
      sol: `$m = \\frac{${y2} - ${P(y1)}}{${x2} - ${P(x1)}} = ${m}$;代入 $(${x1}, ${y1})$:$b = ${y1} - ${P(m)}\\times${P(x1)} = ${b}$。` };
  },
  intersect() {
    let a, c; do { a = nz(-4, 4); c = nz(-4, 4); } while (a === c);
    const x = nz(-5, 5), y = G.ri(-8, 8), b = y - a * x, d = y - c * x;
    return { type: 'multi', answer: [x, y], template: '交點 $= ($ {} $,$ {} $)$',
      text: `兩條直線 $y = ${LIN(a, b)}$ 與 $y = ${LIN(c, d)}$ 相交,求交點座標:`,
      hint: '交點的 y 相同:令 $' + LIN(a, b) + ' = ' + LIN(c, d) + '$ 先解出 x,再代回求 y。',
      sol: `$${LIN(a, b)} = ${LIN(c, d)}$ → $${a - c}x = ${d - b}$ → $x = ${x}$;代入得 $y = ${y}$。` };
  },
  taxi() {
    const b = G.pick([60, 70, 80, 100]), m = G.pick([15, 20, 25, 30]), x = G.ri(3, 12), tot = b + m * x;
    if (Math.random() < 0.5) return { type: 'num', answer: tot, text: `計程車起跳價 ${b} 元,之後每公里 ${m} 元。搭 ${x} 公里要付多少元?`,
      hint: `費用 y 與公里數 x 的關係是 $y = ${m}x + ${b}$。`, sol: `$y = ${m} \\times ${x} + ${b} = ${tot}$ 元。` };
    return { type: 'num', answer: x, text: `計程車起跳價 ${b} 元,之後每公里 ${m} 元。付了 ${tot} 元,搭了幾公里?`,
      hint: `列方程式 $${m}x + ${b} = ${tot}$,解出 x。`, sol: `$${m}x = ${tot - b}$,$x = ${x}$ 公里。` };
  }
};

const ex = (html, widget, face) => ({ t: 'explain', html, widget, face });
const Q = g => ({ t: 'q', gen: g });

window.COURSE = [{
  id: 'ch0', icon: '🌊', title: '序章:杜王町的夏天',
  story: '1999 年夏天,海邊小城杜王町來了一位怪大叔,一連串離奇事件即將展開。先把國中學過的基礎一件件撿回來,後面的路才會好走!',
  subtopics: [
    { id: 'c0s1', title: '① 分數與小數', levels: [
      { id: 'c0s1l1', icon: '🍫', title: '🍫 分數是什麼', learned: '分母 = 平均分成幾份,分子 = 取了幾份;分母相同時,分子越大分數越大。',
        steps: [
          ex(`歡迎來到杜王町的夏天!我是你的嚮導。🧙<br>先從最基本的開始:一條巧克力平均分成 <b>8 格</b>,你吃了 <b>3 格</b>,就說你吃了 ${F(3, 8)}。<br>
              👉 <b>分母</b>(下面):平均分成幾份<br>👉 <b>分子</b>(上面):取了幾份<br>拖拖看下面的拉桿,觀察分數怎麼變:`, 'fracbar'),
          Q(gen.partOf), Q(gen.partOf), Q(gen.leftOf),
          ex(`很好!接下來學比大小。<br>如果<b>分母相同</b>(每一份一樣大),那取得越多的當然越大 —— 看分子就好!`),
          Q(gen.compareSameDen), Q(gen.compareSameDen)
        ] },
      { id: 'c0s1l2', icon: '✂️', title: '✂️ 約分與通分', learned: '分子分母同乘(或同除)一個不為 0 的數,分數大小不變;約分是同除以最大公因數。',
        steps: [
          ex(`你有沒有發現:半塊披薩 ${F(1, 2)},切成 4 片拿 2 片 ${F(2, 4)},切成 6 片拿 3 片 ${F(3, 6)},吃到的量其實<b>一樣多</b>!<br>
              分子分母<b>同時乘以</b>同一個數,大小不變。拖拖看:`, 'fracequiv'),
          Q(gen.fillEquiv), Q(gen.fillEquiv), Q(gen.equalTo),
          ex(`反過來就是<b>約分</b>:分子分母<b>同時除以</b>同一個數。<br>例:${F(12, 18)},12 和 18 的最大公因數是 6,同除 6 得 ${F(2, 3)}。<br>約到不能再約,叫做<b>最簡分數</b>。`),
          Q(gen.reduceEasy), Q(gen.reduceEasy), Q(gen.reduceHard)
        ] },
      { id: 'c0s1l3', icon: '➕', title: '➕ 分數加減', learned: '分母相同:分子相加減、分母不變;分母不同:先通分(找最小公倍數)再加減,最後記得約分。',
        steps: [
          ex(`加法很直覺:${F(2, 7)} + ${F(3, 7)} —— 兩份加三份,共<b>五份</b>,每份是七分之一,所以 = ${F(5, 7)}。<br>
              ✅ <b>分母相同:分母不變,分子相加。</b>(減法也一樣)`),
          Q(gen.addSame), Q(gen.addSame),
          ex(`分母不同怎麼辦?因為「每一份」大小不一樣,不能直接加。<br>先<b>通分</b>:把它們變成相同分母。<br>
              例:${F(1, 2)} + ${F(1, 3)}:2 和 3 的最小公倍數是 6<br>$= ${G.frac(3, 6)} + ${G.frac(2, 6)} = ${G.frac(5, 6)}$`),
          Q(gen.addDiff), Q(gen.addDiff), Q(gen.subDiff), Q(gen.addStory)
        ] },
      { id: 'c0s1l4', icon: '🔁', title: '🔁 分數與小數', learned: '分數 = 分子 ÷ 分母;小數可以先寫成分母是 10、100… 的分數再約分。',
        steps: [
          ex(`分數線其實就是「除號」:${F(3, 4)} = 3 ÷ 4 = <b>0.75</b>。<br>反過來,0.75 = 75 個百分之一 = ${F(75, 100)},約分後 = ${F(3, 4)}。`),
          Q(gen.fracToDec), Q(gen.fracToDec), Q(gen.decToFrac), Q(gen.decToFrac),
          ex(`最後一招:要比較分數和小數誰大,<b>把它們變成同一種形式</b>(都變小數)就能比。`),
          Q(gen.compareMix), Q(gen.compareMix)
        ] }
    ] },
    { id: 'c0s2', title: '② 正負數運算', levels: [
      { id: 'c0s2l1', icon: '🌡️', title: '🌡️ 數線上的正負數', learned: '正數在 0 的右邊、負數在左邊;越往右越大,所以 −8 比 −2 小。',
        steps: [
          ex(`天氣預報說今天低溫「零下 3 度」、大樓有「地下 2 樓」、帳戶「欠了 50 元」——這些「比 0 還少」的數,就是<b>負數</b>。<br>
              把它們放到<b>數線</b>上:0 的右邊是正數,左邊是負數。拖拖看:`, 'numline'),
          Q(gen0.cmpInt), Q(gen0.cmpInt),
          ex(`溫度升降也能用數線:<b>上升 = 往右走</b>,<b>下降 = 往左走</b>。<br>兩點之間相差幾格,就是「大的減小的」。`),
          Q(gen0.tempChange), Q(gen0.tempChange), Q(gen0.distance)
        ] },
      { id: 'c0s2l2', icon: '➕', title: '➕ 正負數的加減', learned: '加負數 = 往左走;減去一個數 = 加上它的相反數。',
        steps: [
          ex(`加法就是在數線上「走路」:加正數往右走,<b>加負數往左走</b>。<br>例:$2 + (-5)$ 從 2 往左走 5 格,到 $-3$。試試看:`, 'numwalk'),
          Q(gen0.addInt), Q(gen0.addInt),
          ex(`減法有個好用的招式:<b>減去一個數,等於加上它的相反數</b>。<br>例:$3 - (-2) = 3 + 2 = 5$(減掉負的,反而變多了!)`),
          Q(gen0.subInt), Q(gen0.subInt), Q(gen0.scoreStory), Q(gen0.scoreStory)
        ] },
      { id: 'c0s2l3', icon: '✖️', title: '✖️ 正負數的乘除', learned: '同號相乘(除)為正,異號為負;負負得正。',
        steps: [
          ex(`乘除的符號規則只要記一句話:<b>同號得正,異號得負</b>。<br>
              $(+)\\times(+)=+$、$(-)\\times(-)=+$、$(+)\\times(-)=-$、$(-)\\times(+)=-$。<br>除法的規則完全一樣。`),
          Q(gen0.mulInt), Q(gen0.mulInt),
          Q(gen0.divInt), Q(gen0.divInt),
          ex(`連乘幾個數時,<b>數一數有幾個負數</b>:偶數個負數 → 正;奇數個負數 → 負。`),
          Q(gen0.signOnly), Q(gen0.signOnly)
        ] },
      { id: 'c0s2l4', icon: '🧮', title: '🧮 混合運算與應用', learned: '運算順序:括號 → 乘除 → 加減;正負數的問題先想清楚往哪個方向走。',
        steps: [
          ex(`多個運算混在一起時,順序是:<b>括號最先,再乘除,最後加減</b>。<br>例:$2 + (-3)\\times 4 = 2 + (-12) = -10$。`),
          Q(gen0.mixed), Q(gen0.mixed), Q(gen0.mixed),
          ex(`最後來幾題生活應用:想清楚「往上是正、往下是負」,再列式計算。`),
          Q(gen0.floorStory), Q(gen0.floorStory), Q(gen0.scoreStory)
        ] }
    ] },
    { id: 'c0s3', title: '③ 一次方程式', levels: [
      { id: 'c0s3l1', icon: '⚖️', title: '⚖️ 天平與等量公理', learned: '方程式像一個天平:兩邊同時做相同的運算,等號就不會變;解方程式就是「倒著做」把 x 單獨留下來。',
        steps: [
          ex(`方程式就像一個<b>天平</b>:左邊等於右邊。只要<b>兩邊同時做一樣的事</b>(同加、同減、同乘、同除),天平就不會歪。<br>
              例:$2x + 3 = 11$。目標是把它變成「$x = $ 某數」。試試看按按鈕,看看怎麼一步步解出來:`, 'eqstep'),
          Q(genE.oneStep), Q(genE.oneStep),
          ex(`解方程式的口訣:<b>x 被怎麼對待,就「倒著做」</b>。被加就減、被減就加、被乘就除、被除就乘。`),
          Q(genE.oneStep), Q(genE.oneStep), Q(genE.oneStep)
        ] },
      { id: 'c0s3l2', icon: '🔧', title: '🔧 兩步驟方程式', learned: '先把常數項移走(倒著做),再處理 x 的係數;答案可以代回原式檢查。',
        steps: [
          ex(`$2x + 3 = 11$ 有兩步驟:x 先被乘 2,再被加 3。倒著做就是<b>先減 3、再除以 2</b>:<br>
              $2x = 8 \\Rightarrow x = 4$。<br>答案可以<b>代回去檢查</b>:$2\\times4+3 = 11$ ✓`),
          Q(genE.twoStep), Q(genE.twoStep), Q(genE.twoStep),
          ex(`有分數的也一樣:例 $\\frac{x}{3} + 1 = 5$ → 先減 1 得 $\\frac{x}{3} = 4$,再<b>兩邊同乘 3</b>,得 $x = 12$。`),
          Q(genE.fracEq), Q(genE.fracEq)
        ] },
      { id: 'c0s3l3', icon: '🌉', title: '🌉 移項與括號', learned: '移項:把項搬過等號要變號;有括號可以先除以括號外的數,或先展開。',
        steps: [
          ex(`方程式兩邊都有 x 時,要把 x 都集中到同一邊:<b>把一項搬過等號,正負號要變</b>(這叫<b>移項</b>)。<br>
              例:$3x + 2 = x + 10$ → $3x - x = 10 - 2$ → $2x = 8$ → $x = 4$。`),
          Q(genE.bothSides), Q(genE.bothSides), Q(genE.bothSides),
          ex(`遇到括號,有兩種做法:<br>① 先把括號外的數除過去:$2(x+3)=10 \\Rightarrow x+3=5$。<br>② 先展開括號:$2x + 6 = 10$。兩種都會得到 $x = 2$。`),
          Q(genE.paren), Q(genE.paren)
        ] },
      { id: 'c0s3l4', icon: '🏃', title: '🏃 列方程式解應用題', learned: '應用題的步驟:設未知數 x → 找出等量關係 → 列方程式 → 解出 → 檢查。',
        steps: [
          ex(`應用題的步驟:<br>① <b>設</b>:把要找的東西設成 $x$。<br>② <b>找等量關係</b>(誰等於誰)。<br>③ <b>列方程式</b>。<br>④ <b>解</b>。<br>⑤ <b>檢查</b>答案合不合理。`),
          Q(genE.shop), Q(genE.shop), Q(genE.run),
          ex(`<b>追趕問題</b>很常見:追的人跑的距離 = 對方先跑的距離 + 對方之後跑的距離。把時間設成 $x$,兩邊列出來就是方程式。`),
          Q(genE.chase), Q(genE.chase), Q(genE.run)
        ] }
    ] },
    { id: 'c0s4', title: '④ 乘法公式與因式分解', levels: [
      { id: 'c0s4l1', icon: '🧩', title: '🧩 分配律與展開', learned: '分配律:每一項都要乘到;$(x+a)(x+b)=x^2+(a+b)x+ab$。',
        steps: [
          ex(`兩個括號相乘,要<b>每一項都乘到</b>,這叫<b>分配律</b>(展開)。<br>
              可以用「面積」來看:長 $x+a$、寬 $x+b$ 的長方形,切成四塊,加起來就是展開式。拖拖看:`, 'areamodel'),
          Q(genF.expand), Q(genF.expand), Q(genF.expand),
          ex(`規律很好記:<b>x 項係數 = 兩個數相加,常數項 = 兩個數相乘</b>。(數字是負的也一樣,符號跟著走。)`),
          Q(genF.expand), Q(genF.expand)
        ] },
      { id: 'c0s4l2', icon: '📐', title: '📐 三大乘法公式', learned: '$(a+b)^2=a^2+2ab+b^2$、$(a-b)^2=a^2-2ab+b^2$、$(a+b)(a-b)=a^2-b^2$。',
        steps: [
          ex(`三個最常用的公式,背起來很划算:<br>
              ① $(a+b)^2 = a^2 + 2ab + b^2$<br>② $(a-b)^2 = a^2 - 2ab + b^2$<br>③ $(a+b)(a-b) = a^2 - b^2$(平方差)<br>
              其實它們都是上一關「展開」的特例。`),
          Q(genF.square), Q(genF.square), Q(genF.diffSq), Q(genF.diffSq),
          ex(`公式還能拿來<b>速算</b>:$51^2 = (50+1)^2 = 2500 + 100 + 1 = 2601$;$99\\times101 = (100-1)(100+1) = 10000 - 1 = 9999$。`),
          Q(genF.sqNum), Q(genF.sqNum), Q(genF.diffSqNum), Q(genF.diffSqNum)
        ] },
      { id: 'c0s4l3', icon: '🔍', title: '🔍 因式分解入門', learned: '因式分解是展開的反向:先提公因式;$x^2+bx+c$ 找兩個數,相乘得 c、相加得 b。',
        steps: [
          ex(`<b>因式分解 = 展開倒著做</b>:把一個式子寫成「括號 × 括號」。<br>
              第一招:<b>提公因式</b>。例:$6x + 9 = 3(2x + 3)$,每一項都有因數 3。`),
          Q(genF.common), Q(genF.common), Q(genF.common),
          ex(`第二招:$x^2 + bx + c$ 怎麼分?找<b>兩個數:相乘等於 c、相加等於 b</b>。<br>
              例:$x^2 + 5x + 6$,2×3=6、2+3=5,所以 $=(x+2)(x+3)$。<br>第三招:平方差反過來用,$x^2 - a^2 = (x+a)(x-a)$。`),
          Q(genF.cross), Q(genF.cross), Q(genF.cross), Q(genF.diffSqFactor)
        ] },
      { id: 'c0s4l4', icon: '🎯', title: '🎯 因式分解的妙用', learned: '把方程式分解成「括號 × 括號 = 0」,每個括號等於 0,就得到解。',
        steps: [
          ex(`因式分解最大的用處:<b>解方程式</b>。<br>
              如果 $A \\times B = 0$,那麼 $A=0$ 或 $B=0$。<br>
              例:$x^2 + 5x + 6 = 0 \\Rightarrow (x+2)(x+3)=0 \\Rightarrow x=-2$ 或 $x=-3$。`),
          Q(genF.roots), Q(genF.roots), Q(genF.roots),
          ex(`再練習一下前面學的技巧:展開、公式、因式分解,混著來。`),
          Q(genF.cross), Q(genF.expand), Q(genF.roots), Q(genF.diffSqNum)
        ] }
    ] },
    { id: 'c0s5', title: '⑤ 座標與一次函數', levels: [
      { id: 'c0s5l1', icon: '📍', title: '📍 座標平面', learned: '點用 (x, y) 表示:先橫向 x、再縱向 y;座標平面被兩軸分成四個象限。',
        steps: [
          ex(`座標平面有兩條數線:橫的<b>x 軸</b>、直的<b>y 軸</b>,交在原點 $(0,0)$。<br>
              一個點用 $(x, y)$ 表示:<b>先橫向、再縱向</b>。兩軸把平面分成四個<b>象限</b>。拖拖看:`, 'coordpt'),
          Q(genG.readPoint), Q(genG.readPoint),
          ex(`象限的符號規律:第一象限 $(+,+)$、第二象限 $(-,+)$、第三象限 $(-,-)$、第四象限 $(+,-)$。<br>
              點到 x 軸的距離看 <b>y 座標</b>的絕對值,到 y 軸的距離看 <b>x 座標</b>的絕對值。`),
          Q(genG.quadrant), Q(genG.quadrant), Q(genG.axisDist), Q(genG.axisDist)
        ] },
      { id: 'c0s5l2', icon: '🎛️', title: '🎛️ 函數機器', learned: '函數 f(x) 就是一台機器:輸入 x,按規則算出唯一的輸出;一次函數 f(x)=mx+b。',
        steps: [
          ex(`<b>函數</b>像一台機器:丟進去一個 $x$,按照規則,吐出<b>唯一</b>的一個結果 $f(x)$。<br>
              <b>一次函數</b>的規則是 $f(x) = mx + b$(m 和 b 是固定的數)。調調看:`, 'funcmachine'),
          Q(genG.evalF), Q(genG.evalF), Q(genG.table),
          ex(`反過來也可以問:輸出是 $y$,輸入的 $x$ 是多少?這就是解方程式 $mx + b = y$。`),
          Q(genG.solveF), Q(genG.solveF), Q(genG.table)
        ] },
      { id: 'c0s5l3', icon: '📈', title: '📈 一次函數的圖形', learned: '一次函數的圖形是直線:斜率 m 是每往右 1 格上升的量,截距 b 是與 y 軸交點的高度;斜率相同的直線互相平行。',
        steps: [
          ex(`把每個 $x$ 對應的 $(x, f(x))$ 點出來,連起來就是一條<b>直線</b>。<br>
              <b>斜率 m</b>:每往右走 1 格,上升(正)或下降(負)幾格。<b>截距 b</b>:直線和 y 軸相交的高度。拖拖看:`, 'linegraph'),
          Q(genG.readLine), Q(genG.readLine), Q(genG.passPt),
          ex(`斜率相同的兩條直線<b>互相平行</b>(永遠不會相交)。`),
          Q(genG.parallel), Q(genG.parallel), Q(genG.readLine)
        ] },
      { id: 'c0s5l4', icon: '🔗', title: '🔗 求直線與應用', learned: '兩點可決定一條直線:先求斜率再求截距;兩直線的交點滿足兩個方程式。',
        steps: [
          ex(`已知直線經過兩點,怎麼求 $y = mx + b$?<br>
              ① 斜率 $m$ = (y 的變化量)÷(x 的變化量)。 ② 把其中一點代進去,解出 $b$。<br>
              例:過 $(0,1)$ 與 $(2,5)$:$m = \\frac{5-1}{2-0} = 2$,代入得 $b = 1$,所以 $y = 2x + 1$。`),
          Q(genG.twoPoints), Q(genG.twoPoints), Q(genG.twoPoints),
          ex(`<b>兩條直線的交點</b>:交點同時在兩條直線上,所以兩個式子的 y 相等 —— 令右邊相等,解出 x,再代回求 y。<br>
              生活中的收費(起跳價 + 每公里費用)就是一次函數!`),
          Q(genG.intersect), Q(genG.intersect), Q(genG.taxi), Q(genG.taxi)
        ] }
    ] },
    // Boss 關:混合複習序章全部內容。三個回合,講解頁的小劇情只有文字(劇情圖在過關後出現)
    { id: 'c0boss', title: '⑥ Boss:虹村形兆', levels: [
      { id: 'c0bossl1', icon: '👹', title: '👹 Boss:虹村形兆',
        learned: '序章全部通過!你已經會:分數小數、正負數、一次方程式、乘法公式與因式分解、座標與一次函數。',
        steps: [
          ex(`虹村形兆慢條斯理地整理領帶:「你們打贏了我弟弟?那就嚐嚐我的<b>微型軍隊</b>吧!」<br>
              ⚔️ <b>第一回合:小兵部隊</b>(分數、小數、正負數)——小兵一個一個衝上來,把他們擊退!`, null, '🕴️'),
          Q(gen.addDiff), Q(gen0.mixed),
          ex(`小兵潰散,形兆臉色一沉:「哼,不過是熱身。」他掏出一疊「方程式炸彈」。<br>
              ⚔️ <b>第二回合:方程式炸彈</b>(一次方程式、展開、因式分解)——一個個拆解!`, null, '🕴️'),
          Q(genE.bothSides), Q(genF.expand), Q(genF.cross),
          ex(`形兆節節敗退,往海邊的方向逃去。仗助、億泰、康一在後面窮追不捨。<br>
              ⚔️ <b>第三回合:座標追擊戰</b>(座標與一次函數)——算出他的逃跑路線,攔住他!`, null, '🕴️'),
          Q(genG.readLine), Q(genG.intersect),
          ex(`最後一擊!形兆一邊跑、你們一邊追,只要算出<b>幾分鐘後追上他</b>,就能結束這場戰鬥。`, null, '🕴️'),
          Q(genE.chase)
        ] }
    ] }
  ]
}];
