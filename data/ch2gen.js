// 第 2 章「直線與圓」題目產生器(需先載入 gen.js、ch0.js、ch1gen.js:用到 nz、LIN、T、choose、shuffle、PN)
const PT = (x, y) => `(${x}, ${y})`;
const SUB = (v, a) => (a === 0 ? v : `${v} ${a < 0 ? '+' : '-'} ${Math.abs(a)}`);
// 化簡分數 [n, d],分母取正
const NF = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = G.gcd(n, d) || 1; return [n / g, d / g]; };
const FRL = (n, d) => { const [a, b] = NF(n, d); return b === 1 ? `${a}` : `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{${b}}`; };
const PYT = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10]];
// 一般式 ax + by + c = 0 的左邊
const GE = (a, b, c) => {
  let s = '';
  const add = (k, v) => {
    if (k === 0) return;
    const ab = Math.abs(k), co = v && ab === 1 ? '' : String(ab);
    s += (s === '' ? (k < 0 ? '-' : '') : (k < 0 ? ' - ' : ' + ')) + co + v;
  };
  add(a, 'x'); add(b, 'y'); add(c, '');
  return s || '0';
};
const SQ = (v, h) => (h === 0 ? `${v}^2` : `(${SUB(v, h)})^2`);
const CIR = (h, k, r2) => `${SQ('x', h)} + ${SQ('y', k)} = ${r2}`;
const CG = (d, e, f) => {
  let s = 'x^2 + y^2';
  const add = (k, v) => { if (!k) return; const ab = Math.abs(k), co = v && ab === 1 ? '' : ab; s += `${k < 0 ? ' - ' : ' + '}${co}${v}`; };
  add(d, 'x'); add(e, 'y'); add(f, '');
  return s;
};

const G2 = {
  // ================= 坐標與對稱 =================
  reflect() {
    const K = [
      { n: '$x$ 軸', f: (x, y) => [x, -y], h: '對 x 軸對稱:x 不變,y 變號。' },
      { n: '$y$ 軸', f: (x, y) => [-x, y], h: '對 y 軸對稱:y 不變,x 變號。' },
      { n: '原點', f: (x, y) => [-x, -y], h: '對原點對稱:x、y 都變號。' },
      { n: '直線 $y = x$', f: (x, y) => [y, x], h: '對直線 y = x 對稱:x 和 y 互換。' },
      { n: '直線 $y = -x$', f: (x, y) => [-y, -x], h: '對直線 y = -x 對稱:x、y 互換,而且都變號。' }
    ];
    for (;;) {
      const k = G.pick(K), x = nz(-6, 6), y = nz(-6, 6), [rx, ry] = k.f(x, y);
      if (rx === x && ry === y) continue;
      return { type: 'multi', answer: [rx, ry], template: '對稱點 $= ($ {} $,$ {} $)$',
        text: `點 ${T('A' + PT(x, y))} 對 ${k.n} 的對稱點是哪一點?`, hint: k.h,
        sol: `${k.h}所以對稱點是 ${T(PT(rx, ry))}。` };
    }
  },
  reflectLine() {
    const vert = Math.random() < 0.5, c = G.ri(-4, 4), x = nz(-6, 6), y = nz(-6, 6);
    if (vert) {
      if (x === c) return G2.reflectLine();
      return { type: 'multi', answer: [2 * c - x, y], template: '對稱點 $= ($ {} $,$ {} $)$',
        text: `點 ${T('A' + PT(x, y))} 對直線 ${T('x = ' + c)} 的對稱點是哪一點?`,
        hint: `直線 x = ${c} 是鉛直線。對稱後 y 不變;x 座標到 ${c} 的距離不變,但跑到另一邊(新 x = 2 × ${c} − 舊 x)。`,
        sol: `$2\\times${PN(c)} - ${PN(x)} = ${2 * c - x}$,y 不變,所以是 ${T(PT(2 * c - x, y))}。` };
    }
    if (y === c) return G2.reflectLine();
    return { type: 'multi', answer: [x, 2 * c - y], template: '對稱點 $= ($ {} $,$ {} $)$',
      text: `點 ${T('A' + PT(x, y))} 對直線 ${T('y = ' + c)} 的對稱點是哪一點?`,
      hint: `直線 y = ${c} 是水平線。對稱後 x 不變;新 y = 2 × ${c} − 舊 y。`,
      sol: `$2\\times${PN(c)} - ${PN(y)} = ${2 * c - y}$,x 不變,所以是 ${T(PT(x, 2 * c - y))}。` };
  },
  reflectPt() {
    const h = G.ri(-4, 4), k = G.ri(-4, 4), x = G.ri(-6, 6), y = G.ri(-6, 6);
    if (x === h && y === k) return G2.reflectPt();
    return { type: 'multi', answer: [2 * h - x, 2 * k - y], template: '對稱點 $= ($ {} $,$ {} $)$',
      text: `點 ${T('A' + PT(x, y))} 對點 ${T('M' + PT(h, k))} 的對稱點 $A'$ 是哪一點?`,
      hint: 'M 是 A 和 A′ 的<b>中點</b>。中點座標 = 兩端點座標的平均,所以 A′ = 2M − A。',
      sol: `x:$2\\times${PN(h)} - ${PN(x)} = ${2 * h - x}$;y:$2\\times${PN(k)} - ${PN(y)} = ${2 * k - y}$。` };
  },
  midpoint() {
    const mx = G.ri(-5, 5), my = G.ri(-5, 5), x1 = G.ri(-7, 7), y1 = G.ri(-7, 7), x2 = 2 * mx - x1, y2 = 2 * my - y1;
    if (x1 === x2 && y1 === y2) return G2.midpoint();
    return { type: 'multi', answer: [mx, my], template: '中點 $= ($ {} $,$ {} $)$',
      text: `${T('A' + PT(x1, y1))}、${T('B' + PT(x2, y2))} 兩點連線的<b>中點</b>座標是?`,
      hint: '中點座標 = 兩點 x 座標的平均、y 座標的平均。',
      sol: `$x = \\frac{${x1} + ${PN(x2)}}{2} = ${mx}$,$y = \\frac{${y1} + ${PN(y2)}}{2} = ${my}$。` };
  },
  dist2() {
    const [p, q, r] = G.pick(PYT), dx = p * G.pick([1, -1]), dy = q * G.pick([1, -1]), x1 = G.ri(-5, 5), y1 = G.ri(-5, 5);
    return { type: 'num', answer: r, text: `${T('A' + PT(x1, y1))}、${T('B' + PT(x1 + dx, y1 + dy))} 兩點的距離是多少?`,
      hint: '距離公式:$\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$。先算 x 差、y 差,再平方相加開根號。',
      sol: `x 差 ${Math.abs(dx)}、y 差 ${Math.abs(dy)}:$\\sqrt{${p * p} + ${q * q}} = \\sqrt{${r * r}} = ${r}$。` };
  },

  // ================= 直線方程式與斜率 =================
  slopeTwo() {
    for (;;) {
      const x1 = G.ri(-5, 5), y1 = G.ri(-5, 5), x2 = G.ri(-5, 5), y2 = G.ri(-5, 5), dx = x2 - x1, dy = y2 - y1;
      if (dx === 0 || dy === 0) continue;
      return { type: 'frac', answer: NF(dy, dx), text: `過 ${T('A' + PT(x1, y1))}、${T('B' + PT(x2, y2))} 兩點的直線,斜率是多少?(寫成最簡分數或整數)`,
        hint: '斜率 = (y 的變化量)÷(x 的變化量),要用同一個順序(B 減 A)。',
        sol: `$m = \\frac{${y2} - ${PN(y1)}}{${x2} - ${PN(x1)}} = \\frac{${dy}}{${dx}}${NF(dy, dx)[1] === Math.abs(dx) && NF(dy, dx)[0] === dy * Math.sign(dx) ? "" : " = " + FRL(dy, dx)}$。` };
    }
  },
  slopeVert() {
    const c = nz(-6, 6), vert = Math.random() < 0.5;
    const right = vert ? '斜率不存在(鉛直線)' : '斜率是 0(水平線)';
    const cs = choose(right, [vert ? '斜率是 0(水平線)' : '斜率不存在(鉛直線)', `斜率是 ${c}`]);
    return { type: 'choice', ...cs, text: `直線 ${T((vert ? 'x' : 'y') + ' = ' + c)} 的斜率是?`,
      hint: vert ? '這條線是鉛直的:x 一直不變,「往右 0 格」不能當分母。' : '這條線是水平的:y 一直不變,上升量是 0。',
      sol: vert ? '鉛直線上任兩點 x 差為 0,分母是 0,所以斜率<b>不存在</b>。' : '水平線上任兩點 y 差為 0,所以斜率是 0。' };
  },
  pointSlope() {
    const x1 = nz(-4, 4), y1 = G.ri(-6, 6), m = nz(-4, 4);
    if (Math.random() < 0.5) {
      return { type: 'num', answer: y1 - m * x1, text: `直線通過 ${T(PT(x1, y1))},斜率是 ${m}。它在 y 軸上的截距(x = 0 時的 y 值)是多少?`,
        hint: `點斜式:$${SUB('y', y1)} = ${m}(${SUB('x', x1)})$,令 x = 0 代入。`,
        sol: `$y = ${y1} + ${PN(m)}\\times(0 - ${PN(x1)}) = ${y1 - m * x1}$。` };
    }
    const t = G.ri(-5, 5);
    if (t === x1) return G2.pointSlope();
    return { type: 'num', answer: y1 + m * (t - x1), text: `直線通過 ${T(PT(x1, y1))},斜率是 ${m}。當 $x = ${t}$ 時,$y$ 是多少?`,
      hint: `點斜式:$${SUB('y', y1)} = ${m}(${SUB('x', x1)})$,把 x = ${t} 代進去。`,
      sol: `$y = ${y1} + ${PN(m)}\\times(${t} - ${PN(x1)}) = ${y1 + m * (t - x1)}$。` };
  },
  slopeGeneral() {
    const a = nz(-6, 6), b = nz(-6, 6), c = nz(-9, 9);
    return { type: 'frac', answer: NF(-a, b), text: `直線 ${T(GE(a, b, c) + ' = 0')} 的斜率是多少?(寫成最簡分數或整數)`,
      hint: '把它改寫成 $y = mx + k$ 的形式:先把 y 項留在左邊,其他移到右邊,再除以 y 的係數。',
      sol: `$${b}y = ${GE(-a, 0, -c)}$,所以斜率 $m = -${PN(a)}\\div${PN(b)} = ${FRL(-a, b)}$。` };
  },
  intercepts() {
    const p = nz(-6, 6), q = nz(-6, 6), t = G.pick([1, 1, 2]);
    const a = q * t, b = p * t, c = p * q * t;
    return { type: 'multi', answer: [p, q], template: 'x 截距 = {},y 截距 = {}',
      text: `直線 ${T(GE(a, b, 0) + ' = ' + c)} 與兩軸相交,求 x 截距(與 x 軸交點的 x)和 y 截距:`,
      hint: '令 y = 0 解出 x(x 截距);令 x = 0 解出 y(y 截距)。',
      sol: `令 y = 0:$${a}x = ${c}$,$x = ${p}$;令 x = 0:$${b}y = ${c}$,$y = ${q}$。` };
  },
  collinear() {
    const m = nz(-3, 3), b = G.ri(-4, 4), xs = shuffle([-3, -2, -1, 0, 1, 2, 3]).slice(0, 3), ok = Math.random() < 0.5;
    const pts = xs.map(x => [x, m * x + b]);
    if (!ok) pts[2][1] += G.pick([-2, -1, 1, 2]);
    return { type: 'choice', choices: ['在同一直線上', '不在同一直線上'], answer: ok ? 0 : 1,
      text: `三點 ${pts.map(p => T(PT(p[0], p[1]))).join('、')} 是否在同一條直線上?`,
      hint: '算「第 1 點到第 2 點」與「第 1 點到第 3 點」的斜率,看是否相等。',
      sol: `斜率 ${T(FRL(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]))} 與 ${T(FRL(pts[2][1] - pts[0][1], pts[2][0] - pts[0][0]))}${ok ? ' 相等,共線' : ' 不相等,不共線'}。` };
  },
  lineTwo() {
    const m = nz(-4, 4), b = G.ri(-5, 5), x1 = G.ri(-3, 0), x2 = G.ri(1, 3);
    return { type: 'multi', answer: [m, b], template: '$y = $ {} $x + $ {}',
      text: `直線通過 ${T(PT(x1, m * x1 + b))}、${T(PT(x2, m * x2 + b))},求方程式 $y = mx + k$ 的 m 與 k(k 可以是負數):`,
      hint: '先用兩點算斜率 m,再把其中一點代入求 k。',
      sol: `$m = \\frac{${m * x2 + b} - ${PN(m * x1 + b)}}{${x2} - ${PN(x1)}} = ${m}$;代入 $${PT(x1, m * x1 + b)}$ 得 $k = ${b}$。` };
  },
  xIntercept() {
    const m = G.pick([-4, -3, -2, -1, 1, 2, 3, 4]), x0 = nz(-6, 6);
    return { type: 'num', answer: x0, text: `直線 ${T('y = ' + LIN(m, -m * x0))} 與 x 軸交在哪裡?(求交點的 x 座標)`,
      hint: '與 x 軸相交 → y = 0。把 y = 0 代進去解 x。',
      sol: `令 $y = 0$:$${LIN(m, -m * x0)} = 0$,解得 $x = ${x0}$。` };
  },

  // ================= 平行、垂直與距離 =================
  parGen() {
    const a = nz(-5, 5), b = nz(-5, 5), t = G.pick([2, 3, -2, -3]), c1 = nz(-9, 9), c2 = nz(-9, 9);
    return { type: 'num', answer: t * b, text: `直線 ${T(GE(a, b, 0) + ' = ' + c1)} 與直線 ${T(t * a + 'x + ky = ' + c2)} <b>互相平行</b>,k = ?`,
      hint: '平行 → 斜率相同 → x 係數與 y 係數的<b>比例</b>要相同:$a_1 : b_1 = a_2 : b_2$。',
      sol: `第二條的 x 係數是第一條的 ${t} 倍,所以 y 係數也要是 ${t} 倍:$k = ${t}\\times${PN(b)} = ${t * b}$。` };
  },
  parThrough() {
    const m = nz(-4, 4), b0 = G.ri(-5, 5), p = nz(-4, 4), q = G.ri(-6, 6);
    return { type: 'num', answer: q - m * p, text: `一條直線通過 ${T(PT(p, q))},且和直線 ${T('y = ' + LIN(m, b0))} <b>平行</b>。它的 y 截距是多少?`,
      hint: '平行 → 斜率一樣。用點斜式,令 x = 0 求截距。',
      sol: `斜率 ${m}:$y = ${q} + ${PN(m)}\\times(0 - ${PN(p)}) = ${q - m * p}$。` };
  },
  perpSlope() {
    const p = nz(-6, 6), q = G.pick([1, 1, 2, 3, 4, 5]);
    if (G.gcd(Math.abs(p), q) !== 1) return G2.perpSlope();
    return { type: 'frac', answer: NF(-q, p), text: `直線的斜率是 ${T(FRL(p, q))},與它<b>垂直</b>的直線斜率是多少?(最簡分數或整數)`,
      hint: '兩條垂直直線的斜率<b>相乘 = −1</b>(倒過來、再變號)。',
      sol: `$${FRL(p, q)}\\times m = -1$,$m = ${FRL(-q, p)}$。` };
  },
  perpK() {
    for (;;) {
      const a1 = nz(-5, 5), b1 = nz(-4, 4), a2 = nz(-5, 5);
      if ((a1 * a2) % b1 !== 0) continue;
      const k = -(a1 * a2) / b1;
      if (k === 0) continue;
      return { type: 'num', answer: k, text: `直線 ${T(GE(a1, b1, 0) + ' = 1')} 與直線 ${T(a2 + 'x + ky = 5')} <b>互相垂直</b>,k = ?`,
        hint: '一般式 $a_1x + b_1y = c_1$ 與 $a_2x + b_2y = c_2$ 垂直 ⟺ $a_1a_2 + b_1b_2 = 0$。',
        sol: `$${a1}\\times${PN(a2)} + ${PN(b1)}\\times k = 0$,所以 $k = ${k}$。` };
    }
  },
  pointLine() {
    for (;;) {
      const [a0, b0, H] = G.pick(PYT), a = a0 * G.pick([1, -1]), b = b0 * G.pick([1, -1]), c = G.ri(-9, 9), x0 = G.ri(-6, 6), y0 = G.ri(-6, 6), n = a * x0 + b * y0 + c;
      if (n === 0) continue;
      return { type: 'frac', answer: NF(Math.abs(n), H), text: `點 ${T('P' + PT(x0, y0))} 到直線 ${T(GE(a, b, c) + ' = 0')} 的距離是多少?(最簡分數或整數)`,
        hint: '點到直線距離公式:$d = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$。',
        sol: `分子 $|${PN(a)}\\times${PN(x0)} + ${PN(b)}\\times${PN(y0)} + ${PN(c)}| = ${Math.abs(n)}$,分母 $\\sqrt{${a * a} + ${b * b}} = ${H}$,所以 $d = ${FRL(Math.abs(n), H)}$。` };
    }
  },
  parDist() {
    for (;;) {
      const [a0, b0, H] = G.pick(PYT), a = a0 * G.pick([1, -1]), b = b0 * G.pick([1, -1]), c1 = G.ri(-9, 9), c2 = G.ri(-9, 9);
      if (c1 === c2) continue;
      return { type: 'frac', answer: NF(Math.abs(c1 - c2), H), text: `兩條平行線 ${T(GE(a, b, c1) + ' = 0')} 與 ${T(GE(a, b, c2) + ' = 0')} 的距離是多少?(最簡分數或整數)`,
        hint: '平行線距離 = 在其中一條線上任取一點,算它到另一條線的距離。公式:$\\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}$(x、y 係數要相同)。',
        sol: `$\\frac{|${c1} - ${PN(c2)}|}{\\sqrt{${a * a} + ${b * b}}} = \\frac{${Math.abs(c1 - c2)}}{${H}} = ${FRL(Math.abs(c1 - c2), H)}$。` };
    }
  },
  triArea() {
    for (;;) {
      const x1 = G.ri(-5, 5), y1 = G.ri(-5, 5), x2 = G.ri(-5, 5), y2 = G.ri(-5, 5), x3 = G.ri(-5, 5), y3 = G.ri(-5, 5);
      const D = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
      if (D === 0) continue;
      return { type: 'frac', answer: NF(D, 2), text: `三角形三頂點為 ${T('A' + PT(x1, y1))}、${T('B' + PT(x2, y2))}、${T('C' + PT(x3, y3))},面積是多少?(最簡分數或整數)`,
        hint: '以 A 為基準,算向量 AB = (x₂−x₁, y₂−y₁)、AC = (x₃−x₁, y₃−y₁),面積 = ½ |x₂′y₃′ − x₃′y₂′|(「交叉相乘再相減」)。',
        sol: `$AB = (${x2 - x1}, ${y2 - y1})$,$AC = (${x3 - x1}, ${y3 - y1})$,面積 = $\\frac{1}{2}|${x2 - x1}\\times${PN(y3 - y1)} - ${PN(x3 - x1)}\\times${PN(y2 - y1)}| = ${FRL(D, 2)}$。` };
    }
  },

  // ================= 二元一次不等式與區域 =================
  ineqPt() {
    for (;;) {
      const a = nz(-4, 4), b = nz(-4, 4), c = G.ri(-6, 6), x0 = G.ri(-4, 4), y0 = G.ri(-4, 4), n = a * x0 + b * y0 + c;
      if (n === 0) continue;
      const op = G.pick(['>', '<']), ok = op === '>' ? n > 0 : n < 0;
      return { type: 'choice', choices: ['是解(符合)', '不是解(不符合)'], answer: ok ? 0 : 1,
        text: `點 ${T(PT(x0, y0))} 是不等式 ${T(GE(a, b, c) + ' ' + op + ' 0')} 的解嗎?`,
        hint: '把點的座標代進去,看不等式成不成立。',
        sol: `代入:$${PN(a)}\\times${PN(x0)} + ${PN(b)}\\times${PN(y0)} + ${PN(c)} = ${n}$,${n > 0 ? '大於' : '小於'} 0,所以${ok ? '符合' : '不符合'}。` };
    }
  },
  ineqRegion() {
    const m = nz(-2, 2), b = G.ri(-3, 3), above = Math.random() < 0.5, strict = Math.random() < 0.5;
    const op = (above ? (strict ? '>' : '\\ge') : (strict ? '<' : '\\le')), L = LIN(m, b);
    const all = ['>', '<', '\\ge', '\\le'].filter(o => o !== op).map(o => T('y ' + o + ' ' + L));
    const c = choose(T('y ' + op + ' ' + L), all);
    return { type: 'choice', ...c,
      text: `圖中紫色區域是哪一個不等式的解?(虛線代表邊界<b>不算</b>,實線代表邊界<b>算</b>)${G.plane({ line: { m, b, dash: strict }, shade: { m, b, above }, range: 6, size: 260 })}`,
      hint: '先看<b>在直線的上方還是下方</b>(上方 → y 大於直線),再看<b>實線或虛線</b>(實線 → 有等號)。',
      sol: `紫色在直線${above ? '上方' : '下方'},邊界是${strict ? '虛線' : '實線'},所以是 ${T('y ' + op + ' ' + L)}。` };
  },
  latticeCount() {
    const a = G.ri(1, 3), b = G.ri(1, 3), c = G.ri(4, 9);
    let tot = 0; const parts = [];
    for (let x = 0; a * x <= c; x++) { const k = Math.floor((c - a * x) / b) + 1; tot += k; parts.push(`x = ${x}:${k} 個`); }
    return { type: 'num', answer: tot, text: `滿足 ${T('x \\ge 0,\\ y \\ge 0,\\ ' + GE(a, b, 0) + ' \\le ' + c)} 的<b>整數點</b> $(x, y)$ 共有幾個?`,
      hint: '一個一個 x 值來:x = 0、1、2…,看對應的 y 可以是哪些非負整數,把個數加起來。',
      sol: `${parts.join(';')},合計 ${tot} 個。` };
  },
  regionArea() {
    const a = G.ri(1, 4), b = G.ri(1, 4), t = G.ri(1, 3), c = G.lcm(a, b) * t, xi = c / a, yi = c / b;
    return { type: 'frac', answer: NF(xi * yi, 2), text: `${T('x \\ge 0,\\ y \\ge 0,\\ ' + GE(a, b, 0) + ' \\le ' + c)} 圍成的區域是一個三角形,面積是多少?(最簡分數或整數)`,
      hint: '先求直線與兩軸的交點,這個三角形是直角三角形:面積 = ½ × x 截距 × y 截距。',
      sol: `x 截距 ${xi}、y 截距 ${yi},面積 $\\frac{1}{2}\\times${xi}\\times${yi} = ${FRL(xi * yi, 2)}$。` };
  },

  // ================= 圓方程式 =================
  circleRead() {
    const h = G.ri(-5, 5), k = G.ri(-5, 5), r = G.ri(1, 8);
    return { type: 'multi', answer: [h, k, r], template: '圓心 ( {} , {} ),半徑 {}',
      text: `圓 ${T(CIR(h, k, r * r))} 的圓心與半徑是?`,
      hint: '標準式 $(x - h)^2 + (y - k)^2 = r^2$。圓心是 (h, k)(注意括號裡的符號要<b>反過來</b>),半徑 r 是右邊那個數開根號。',
      sol: `圓心 ${T(PT(h, k))},半徑 $\\sqrt{${r * r}} = ${r}$。` };
  },
  circleEqn() {
    const h = G.ri(-5, 5), k = G.ri(-5, 5), r = G.ri(1, 7);
    return { type: 'multi', answer: [h, k, r * r], template: '$(x - $ {} $)^2 + (y - $ {} $)^2 = $ {}',
      text: `圓心在 ${T(PT(h, k))}、半徑是 ${r} 的圓,方程式寫成 $(x - h)^2 + (y - k)^2 = r^2$,填入 h、k、$r^2$(可以是負數):`,
      hint: '圓心的座標就是 (h, k);右邊要填「半徑的平方」。',
      sol: `$h = ${h}$,$k = ${k}$,$r^2 = ${r}^2 = ${r * r}$。` };
  },
  circleGeneral() {
    const h = G.ri(-5, 5), k = G.ri(-5, 5), r = G.ri(1, 7), d = -2 * h, e = -2 * k, f = h * h + k * k - r * r;
    return { type: 'multi', answer: [h, k, r], template: '圓心 ( {} , {} ),半徑 {}',
      text: `圓 ${T(CG(d, e, f) + ' = 0')} 的圓心與半徑是?`,
      hint: '用<b>配方法</b>:把 x 的項、y 的項各自配成完全平方,常數移到右邊。一般式 $x^2 + y^2 + dx + ey + f = 0$ 的圓心是 $(-\\frac{d}{2}, -\\frac{e}{2})$。',
      sol: `配方:$(${SUB('x', h)})^2 + (${SUB('y', k)})^2 = ${r * r}$,圓心 ${T(PT(h, k))},半徑 ${r}。` };
  },
  pointCircle() {
    const [p, q, r] = G.pick(PYT), sx = G.pick([1, -1]), sy = G.pick([1, -1]), h = G.ri(-3, 3), k = G.ri(-3, 3), kind = G.ri(0, 2);
    let dx = sx * p, dy = sy * q;
    if (kind === 0) { dx = Math.trunc(dx / 2); dy = Math.trunc(dy / 2); } else if (kind === 2) { dx += sx; dy += sy; }
    const d2 = dx * dx + dy * dy, cls = d2 < r * r ? 0 : d2 === r * r ? 1 : 2;
    return { type: 'choice', choices: ['在圓內', '在圓上', '在圓外'], answer: cls,
      text: `圓 ${T(CIR(h, k, r * r))},點 ${T('P' + PT(h + dx, k + dy))} 在圓內、圓上還是圓外?`,
      hint: '算 P 到圓心的距離(的平方),和半徑(的平方)比比看。',
      sol: `$(${h + dx} - ${PN(h)})^2 + (${k + dy} - ${PN(k)})^2 = ${d2}$,半徑平方 ${r * r}:${d2} ${cls === 0 ? '<' : cls === 1 ? '=' : '>'} ${r * r},所以${['在圓內', '在圓上', '在圓外'][cls]}。` };
  },
  diameter() {
    const h = G.ri(-4, 4), k = G.ri(-4, 4), a = nz(-4, 4), b = nz(-4, 4);
    return { type: 'multi', answer: [h, k, a * a + b * b], template: '圓心 ( {} , {} ),半徑平方 $r^2 = $ {}',
      text: `${T('A' + PT(h - a, k - b))}、${T('B' + PT(h + a, k + b))} 是一個圓的<b>直徑兩端點</b>,求圓心與半徑的平方:`,
      hint: '直徑的中點就是圓心;圓心到 A 的距離就是半徑(先算平方,不用開根號)。',
      sol: `中點 ${T(PT(h, k))};$r^2 = ${PN(a)}^2 + ${PN(b)}^2 = ${a * a + b * b}$。` };
  },

  // ================= 圓與直線 =================
  relation() {
    const [a0, b0, H] = G.pick(PYT), a = a0 * G.pick([1, -1]), b = b0 * G.pick([1, -1]), h = G.ri(-3, 3), k = G.ri(-3, 3), r = G.ri(2, 6);
    const delta = G.pick([-H, -2, 0, 2, H]), s = G.pick([1, -1]), n = s * (r * H + delta), c = n - (a * h + b * k);
    const cls = Math.abs(n) < r * H ? 0 : Math.abs(n) === r * H ? 1 : 2;
    return { type: 'choice', choices: ['相割(兩個交點)', '相切(一個交點)', '相離(沒有交點)'], answer: cls,
      text: `圓 ${T(CIR(h, k, r * r))} 與直線 ${T(GE(a, b, c) + ' = 0')} 的關係是?`,
      hint: '算圓心到直線的距離 d,和半徑 r 比:d < r 相割、d = r 相切、d > r 相離。',
      sol: `$d = \\frac{|${PN(a)}\\times${PN(h)} + ${PN(b)}\\times${PN(k)} + ${PN(c)}|}{${H}} = \\frac{${Math.abs(n)}}{${H}}$,半徑 ${r}(= $\\frac{${r * H}}{${H}}$):${['d < r,相割', 'd = r,相切', 'd > r,相離'][cls]}。` };
  },
  chord() {
    const [r, d, half] = G.pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [13, 12, 5], [17, 8, 15], [17, 15, 8]]);
    const h = G.ri(-3, 3), k = G.ri(-3, 3);
    let line;
    if (Math.random() < 0.5) line = `x = ${h + d}`;
    else { const [a, b] = G.pick([[3, 4], [4, 3]]), c = 5 * d - (a * h + b * k); line = GE(a, b, c) + ' = 0'; }
    return { type: 'num', answer: 2 * half, text: `圓 ${T(CIR(h, k, r * r))} 被直線 ${T(line)} 截出一條弦,弦長是多少?(圓心到這條直線的距離是 ${d})`,
      hint: '從圓心作弦的垂線,垂足是弦的中點。用直角三角形:半弦長² + 距離² = 半徑²。',
      sol: `半弦長 $= \\sqrt{${r}^2 - ${d}^2} = \\sqrt{${r * r - d * d}} = ${half}$,弦長 = 2 × ${half} = ${2 * half}。` };
  },
  tangentAt() {
    const [x0, y0] = G.pick([[3, 4], [4, 3], [-3, 4], [3, -4], [-4, 3], [5, 0], [0, 5], [-5, 0], [0, -5], [6, 8], [8, 6], [-6, 8], [6, -8]]);
    return { type: 'multi', answer: [x0, y0, x0 * x0 + y0 * y0], template: '{} $x + $ {} $y = $ {}',
      text: `圓 ${T('x^2 + y^2 = ' + (x0 * x0 + y0 * y0))} 上一點 ${T('P' + PT(x0, y0))} 的<b>切線</b>方程式,可以寫成 $ax + by = c$,填入 a、b、c:`,
      hint: '圓心 O(0, 0) 與切點 P 的連線 OP 垂直於切線。切線公式(圓心在原點):$x_0x + y_0y = r^2$。',
      sol: `切線 $${GE(x0, y0, 0)} = ${x0 * x0 + y0 * y0}$(a = ${x0},b = ${y0},c = ${x0 * x0 + y0 * y0})。` };
  },
  nearest() {
    const t = G.ri(1, 3), [p, q] = G.pick([[3, 4], [4, 3]]), h = G.ri(-3, 3), k = G.ri(-3, 3), far = Math.random() < 0.5, r = G.ri(1, 5 * t - 1);
    if (Math.random() < 0.5) {
      return { type: 'num', answer: far ? 5 * t + r : 5 * t - r, text: `圓心 ${T('C' + PT(h, k))}、半徑 ${r} 的圓外有一點 ${T('P' + PT(h + p * t, k + q * t))}。圓上的點到 P 的<b>${far ? '最遠' : '最近'}距離</b>是多少?`,
        hint: `先求 P 到圓心的距離 $PC$;最近 = $PC - r$,最遠 = $PC + r$(在 P、圓心的連線上)。`,
        sol: `$PC = \\sqrt{${(p * t) ** 2} + ${(q * t) ** 2}} = ${5 * t}$,${far ? '最遠' : '最近'} = ${5 * t} ${far ? '+' : '-'} ${r} = ${far ? 5 * t + r : 5 * t - r}。` };
    }
    const d = 5 * t, c = d * 5 - (3 * h + 4 * k) + 0; // 直線 3x+4y+c=0 與圓心距離 = |5d|/5 = d
    const cc = 5 * d - (3 * h + 4 * k), rr = G.ri(1, d - 1);
    return { type: 'num', answer: far ? d + rr : d - rr, text: `圓 ${T(CIR(h, k, rr * rr))} 上的點到直線 ${T(GE(3, 4, cc) + ' = 0')} 的<b>${far ? '最大' : '最小'}距離</b>是多少?(圓心到這條直線的距離是 ${d})`,
      hint: '圓上最近的點在「圓心到直線的垂線」上:最小 = d − r,最大 = d + r。',
      sol: `${far ? '最大' : '最小'} = ${d} ${far ? '+' : '-'} ${rr} = ${far ? d + rr : d - rr}。` };
  }
};
