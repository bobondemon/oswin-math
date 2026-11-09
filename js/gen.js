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
      .replace(/[／÷]/g, '/').replace(/．/g, '.').replace(/－/g, '-').replace(/\s+/g, '');
    let m;
    if ((m = s.match(/^(-?\d+)\/(\d+)$/)) && +m[2] !== 0) return { val: +m[1] / +m[2], n: +m[1], d: +m[2], isFrac: true };
    if (/^-?\d+(\.\d+)?$/.test(s)) return { val: parseFloat(s), isFrac: false };
    return null;
  },
  // 檢查答案:回傳 'ok' | 'bad' | 'unreduced' | 'invalid'
  check(q, input) {
    if (q.type === 'choice') return input === q.answer ? 'ok' : 'bad';
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
