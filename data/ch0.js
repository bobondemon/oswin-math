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
    { id: 'c0s3', title: '③ 一次方程式', levels: [] },
    { id: 'c0s4', title: '④ 乘法公式與因式分解', levels: [] },
    { id: 'c0s5', title: '⑤ 座標與一次函數', levels: [] }
  ]
}];
