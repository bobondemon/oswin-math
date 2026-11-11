// 題目產生器共用工具
const G = {
  ri: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  gcd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; },
  lcm: (a, b) => a / G.gcd(a, b) * b,
  frac: (n, d) => `\\frac{${n}}{${d}}`,
  // 化為最簡分數 → [n, d]
  reduce(n, d) { const g = G.gcd(n, d); return [n / g, d / g]; },
  // 解析使用者輸入 → {val, n, d, isFrac} 或 null
  parse(s) {
    s = String(s).trim().replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 65248))
      .replace(/[／÷]/g, '/').replace(/．/g, '.').replace(/[－−–]/g, '-').replace(/\s+/g, '');
    let m;
    if ((m = s.match(/^(-?\d+)\/(\d+)$/)) && +m[2] !== 0) return { val: +m[1] / +m[2], n: +m[1], d: +m[2], isFrac: true };
    if (/^-?\d+(\.\d+)?$/.test(s)) return { val: parseFloat(s), isFrac: false };
    return null;
  },
  // 檢查答案:回傳 'ok' | 'bad' | 'unreduced' | 'invalid'
  check(q, input) {
    if (q.type === 'choice') return input === q.answer ? 'ok' : 'bad';
    // multi:多格填空,answer 是數字陣列;unordered=true 時不分先後(例如兩個根)
    if (q.type === 'multi') {
      if (!Array.isArray(input)) return 'invalid';
      const ps = input.map(G.parse);
      if (ps.some(p => !p)) return 'invalid';
      const vals = ps.map(p => p.val), ans = q.answer.slice();
      if (q.unordered) { vals.sort((a, b) => a - b); ans.sort((a, b) => a - b); }
      return vals.every((v, i) => Math.abs(v - ans[i]) < 1e-9) ? 'ok' : 'bad';
    }
    const p = G.parse(input);
    if (!p) return 'invalid';
    if (q.type === 'num') return Math.abs(p.val - q.answer) < 1e-9 ? 'ok' : 'bad';
    // frac: answer = [n, d]
    const [n, d] = q.answer;
    if (Math.abs(p.val - n / d) > 1e-9) return 'bad';
    if (p.isFrac && !q.noreduce && G.gcd(p.n, p.d) !== 1) return 'unreduced';
    if (!p.isFrac && d !== 1 && !q.noreduce) return 'bad'; // 要分數格式
    return 'ok';
  }
};

// 座標平面 SVG:G.plane({pts:[{x,y,label}], line:{m,b}, range:6, size:260}) → HTML 字串
// (供題目文字與互動小元件共用;出現在題目裡時,學生要從圖上讀座標或斜率)
G._pid = 0;
G.plane = function (o) {
  o = o || {};
  const R = o.range || 6, S = o.size || 320, pad = 16, u = (S - 2 * pad) / (2 * R), C = S / 2;
  const X = x => C + x * u, Y = y => C - y * u, id = 'pl' + (G._pid++);
  let s = `<svg viewBox="0 0 ${S} ${S}" style="max-width:${S}px;width:100%;display:block;margin:6px auto" role="img" aria-label="座標平面">`;
  s += `<defs><clipPath id="${id}"><rect x="${X(-R)}" y="${Y(R)}" width="${2 * R * u}" height="${2 * R * u}"/></clipPath></defs>`;
  for (let i = -R; i <= R; i++) {
    s += `<line x1="${X(i)}" y1="${Y(-R)}" x2="${X(i)}" y2="${Y(R)}" stroke="currentColor" stroke-opacity="${i === 0 ? 0.9 : 0.18}" stroke-width="${i === 0 ? 2 : 1}"/>`;
    s += `<line x1="${X(-R)}" y1="${Y(i)}" x2="${X(R)}" y2="${Y(i)}" stroke="currentColor" stroke-opacity="${i === 0 ? 0.9 : 0.18}" stroke-width="${i === 0 ? 2 : 1}"/>`;
    if (i !== 0 && i % 2 === 0) {
      s += `<text x="${X(i)}" y="${Y(0) + 13}" text-anchor="middle" font-size="10" fill="currentColor">${i}</text>`;
      s += `<text x="${X(0) - 4}" y="${Y(i) + 3}" text-anchor="end" font-size="10" fill="currentColor">${i}</text>`;
    }
  }
  s += `<text x="${X(R) - 2}" y="${Y(0) - 5}" text-anchor="end" font-size="11" fill="currentColor">x</text><text x="${X(0) + 6}" y="${Y(R) + 10}" font-size="11" fill="currentColor">y</text>`;
  if (o.line) {
    const m = o.line.m, b = o.line.b;
    s += `<line clip-path="url(#${id})" x1="${X(-R)}" y1="${Y(m * -R + b)}" x2="${X(R)}" y2="${Y(m * R + b)}" stroke="#6c5ce7" stroke-width="3"/>`;
  }
  (o.pts || []).forEach(p => {
    s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="5" fill="#e17055"/>`;
    if (p.label) s += `<text x="${X(p.x) + 8}" y="${Y(p.y) - 8}" font-size="13" font-weight="700" fill="currentColor">${p.label}</text>`;
  });
  return s + '</svg>';
};
