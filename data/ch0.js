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
    { id: 'c0s2', title: '② 正負數運算', levels: [] },
    { id: 'c0s3', title: '③ 一次方程式', levels: [] },
    { id: 'c0s4', title: '④ 乘法公式與因式分解', levels: [] },
    { id: 'c0s5', title: '⑤ 座標與一次函數', levels: [] }
  ]
}];
