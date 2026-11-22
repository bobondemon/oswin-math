// 互動小元件:Widgets.mount(name, el)
const Widgets = (() => {
  const bar = (n, d) => `<div class="bar">${Array.from({ length: d }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div>`;
  const tex = s => `$${s}$`;

  // 畫 -10~10 的數線(SVG);點 v(紅)、可選起點 from(藍)與走過的箭頭
  function line(v, from) {
    const X = n => 20 + (n + 10) * 22, ticks = [];
    for (let n = -10; n <= 10; n++) {
      ticks.push(`<line x1="${X(n)}" y1="26" x2="${X(n)}" y2="${n % 5 === 0 ? 38 : 34}" stroke="currentColor"/>`);
      if (n % 5 === 0) ticks.push(`<text x="${X(n)}" y="54" text-anchor="middle" font-size="12" fill="currentColor">${n}</text>`);
    }
    const clamp = n => Math.max(-10, Math.min(10, n));
    const dot = (n, c, r) => `<circle cx="${X(clamp(n))}" cy="30" r="${r}" fill="${c}"/>`;
    const arrow = from === undefined || from === v ? '' : `<line x1="${X(clamp(from))}" y1="18" x2="${X(clamp(v))}" y2="18" stroke="#6c5ce7" stroke-width="3"/>`;
    return `<svg viewBox="0 0 480 64" style="max-width:480px;width:100%"><line x1="10" y1="30" x2="470" y2="30" stroke="currentColor" stroke-width="2"/>${ticks.join('')}${arrow}${from !== undefined ? dot(from, '#4a90d9', 6) : ''}${dot(v, '#e17055', 8)}</svg>`;
  }

  const W = {
    // 座標平面:拖曳 x、y,看點的位置與象限
    coordpt(el) {
      el.innerHTML = `<div class="wd"><div id="pl"></div>
        <div>x:<input type="range" id="x" min="-6" max="6" value="3"> <b id="xv">3</b>
          &nbsp; y:<input type="range" id="y" min="-6" max="6" value="2"> <b id="yv">2</b></div>
        <div class="big" id="ft"></div></div>`;
      const x = el.querySelector('#x'), y = el.querySelector('#y');
      const draw = () => {
        const xv = +x.value, yv = +y.value;
        el.querySelector('#xv').textContent = xv; el.querySelector('#yv').textContent = yv;
        el.querySelector('#pl').innerHTML = G.plane({ pts: [{ x: xv, y: yv, label: `(${xv}, ${yv})` }] });
        const q = xv === 0 || yv === 0 ? '在座標軸上' : xv > 0 && yv > 0 ? '第一象限' : xv < 0 && yv > 0 ? '第二象限' : xv < 0 && yv < 0 ? '第三象限' : '第四象限';
        el.querySelector('#ft').innerHTML = `點 (${xv}, ${yv}):<b>${q}</b>`;
      };
      x.oninput = y.oninput = draw; draw();
    },
    // 函數機器:輸入 x,輸出 f(x)=mx+b
    funcmachine(el) {
      el.innerHTML = `<div class="wd">
        <div>m:<input type="range" id="m" min="-5" max="5" value="2"> <b id="mv">2</b>
          &nbsp; b:<input type="range" id="b" min="-9" max="9" value="1"> <b id="bv">1</b></div>
        <div>輸入 x:<input type="range" id="x" min="-6" max="6" value="3"> <b id="xv">3</b></div>
        <div class="big" id="ft"></div></div>`;
      const m = el.querySelector('#m'), b = el.querySelector('#b'), x = el.querySelector('#x');
      const draw = () => {
        const mv = +m.value, bv = +b.value, xv = +x.value, r = mv * xv + bv;
        el.querySelector('#mv').textContent = mv; el.querySelector('#bv').textContent = bv; el.querySelector('#xv').textContent = xv;
        const f = `${mv === 1 ? '' : mv === -1 ? '-' : mv}x${bv === 0 ? '' : bv > 0 ? ' + ' + bv : ' - ' + (-bv)}`;
        el.querySelector('#ft').innerHTML = tex(`f(x) = ${f}`) + '<br>' + tex(`f(${xv}) = ${mv}\\times${xv < 0 ? '(' + xv + ')' : xv}${bv < 0 ? '-' + (-bv) : '+' + bv} = ${r}`);
        Widgets.render(el.querySelector('#ft'));
      };
      m.oninput = b.oninput = x.oninput = draw; draw();
    },
    // 直線圖形:拖曳斜率 m 與截距 b
    linegraph(el) {
      el.innerHTML = `<div class="wd"><div id="pl"></div>
        <div>斜率 m:<input type="range" id="m" min="-3" max="3" value="1"> <b id="mv">1</b>
          &nbsp; 截距 b:<input type="range" id="b" min="-5" max="5" value="2"> <b id="bv">2</b></div>
        <div class="big" id="ft"></div></div>`;
      const m = el.querySelector('#m'), b = el.querySelector('#b');
      const draw = () => {
        const mv = +m.value, bv = +b.value;
        el.querySelector('#mv').textContent = mv; el.querySelector('#bv').textContent = bv;
        el.querySelector('#pl').innerHTML = G.plane({ line: { m: mv, b: bv }, pts: [{ x: 0, y: bv, label: `(0, ${bv})` }] });
        const f = `${mv === 0 ? '' : (mv === 1 ? '' : mv === -1 ? '-' : mv) + 'x'}${bv === 0 ? (mv === 0 ? '0' : '') : mv === 0 ? bv : bv > 0 ? ' + ' + bv : ' - ' + (-bv)}`;
        el.querySelector('#ft').innerHTML = tex(`y = ${f}`) + `<div style="font-size:15px;color:var(--mut)">每往右 1 格,${mv > 0 ? '上升 ' + mv : mv < 0 ? '下降 ' + (-mv) : '高度不變'} 格;與 y 軸交在 (0, ${bv})</div>`;
        Widgets.render(el.querySelector('#ft'));
      };
      m.oninput = b.oninput = draw; draw();
    },
    // 面積模型:(x+a)(x+b) 切成四塊,看展開式怎麼來
    areamodel(el) {
      el.innerHTML = `<div class="wd"><div id="am"></div>
        <div>a:<input type="range" id="a" min="1" max="6" value="3"> <b id="av">3</b>
          &nbsp; b:<input type="range" id="b" min="1" max="6" value="2"> <b id="bv">2</b></div>
        <div class="big" id="ft"></div></div>`;
      const a = el.querySelector('#a'), b = el.querySelector('#b');
      const draw = () => {
        const av = +a.value, bv = +b.value, X = 90, u = 22;
        el.querySelector('#av').textContent = av; el.querySelector('#bv').textContent = bv;
        const W1 = X + av * u, H1 = X + bv * u;
        const rect = (x, y, w, h, c, t) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="currentColor" stroke-width="2"/><text x="${x + w / 2}" y="${y + h / 2 + 5}" text-anchor="middle" font-size="15" fill="#222">${t}</text>`;
        el.querySelector('#am').innerHTML = `<svg viewBox="0 0 ${W1 + 20} ${H1 + 20}" style="max-width:300px;width:100%">
          ${rect(10, 10, X, X, '#ffeaa7', 'x²')}${rect(10 + X, 10, av * u, X, '#81ecec', `${av}x`)}
          ${rect(10, 10 + X, X, bv * u, '#fab1a0', `${bv}x`)}${rect(10 + X, 10 + X, av * u, bv * u, '#dfe6e9', av * bv)}</svg>`;
        el.querySelector('#ft').innerHTML = tex(`(x+${av})(x+${bv}) = x^2 + ${av + bv}x + ${av * bv}`);
        Widgets.render(el.querySelector('#ft'));
      };
      a.oninput = b.oninput = draw; draw();
    },
    // 天平:對 ax+b=c 的兩邊同時做相同運算,觀察方程式怎麼變(目標:化成 x=…)
    eqstep(el) {
      const init = { a: 2, b: 3, c: 11 };
      let s = { ...init }, hist = [];
      const fmt = n => String(Math.round(n * 100) / 100);
      const side = t => {
        const co = t.a === 1 ? '' : t.a === -1 ? '-' : fmt(t.a);
        const x = t.a === 0 ? '' : `${co}x`;
        const b = t.b === 0 ? '' : (t.a === 0 ? fmt(t.b) : (t.b > 0 ? ` + ${fmt(t.b)}` : ` - ${fmt(-t.b)}`));
        return (x + b) || '0';
      };
      const eq = t => `${side(t)} = ${fmt(t.c)}`;
      const apply = (kind, k) => {
        if (kind === `兩邊 +${k}`) { s.b += k; s.c += k; }
        else if (kind === `兩邊 −${k}`) { s.b -= k; s.c -= k; }
        else if (kind === `兩邊 ×${k}`) { s.a *= k; s.b *= k; s.c *= k; }
        else if (kind === `兩邊 ÷${k}`) { s.a /= k; s.b /= k; s.c /= k; }
        hist.push(`${kind} → ${eq(s)}`);
        draw();
      };
      const ops = [['兩邊 −3', 3], ['兩邊 +3', 3], ['兩邊 ÷2', 2], ['兩邊 ×2', 2]];
      const draw = () => {
        const solved = s.a === 1 && s.b === 0;
        el.innerHTML = `<div class="wd"><div class="big">${tex(eq(s))}</div>
          ${solved ? `<div class="fb ok">🎉 解出來了:x = ${fmt(s.c)}</div>` : '<div style="color:var(--mut)">目標:把方程式變成「x = 某數」</div>'}
          <div class="row" style="justify-content:center">${ops.map(([k]) => `<button class="btn sec op" data-k="${k}">${k}</button>`).join('')}<button class="btn sec" id="rs">↺ 重來</button></div>
          <div style="margin-top:8px;font-size:14px;color:var(--mut);text-align:left;max-width:360px;margin-inline:auto">${hist.map(h => '• ' + h).join('<br>')}</div></div>`;
        el.querySelectorAll('.op').forEach((b, i) => b.onclick = () => apply(b.dataset.k, ops[i][1]));
        el.querySelector('#rs').onclick = () => { s = { ...init }; hist = []; draw(); };
        Widgets.render(el);
      };
      draw();
    },
    // 數線:拖曳看數字的位置、與 0 的距離
    numline(el) {
      el.innerHTML = `<div class="wd"><div id="nl"></div>
        <div>數字 x:<input type="range" id="x" min="-10" max="10" value="-3"> <b id="xv">-3</b></div>
        <div class="big" id="ft"></div></div>`;
      const x = el.querySelector('#x');
      const draw = () => {
        const v = +x.value; el.querySelector('#xv').textContent = v;
        el.querySelector('#nl').innerHTML = line(v);
        const side = v > 0 ? '在 0 的<b>右邊</b>(正數)' : v < 0 ? '在 0 的<b>左邊</b>(負數)' : '就是原點 0';
        el.querySelector('#ft').innerHTML = `${side},離 0 有 <b>${Math.abs(v)}</b> 格`;
      };
      x.oninput = draw; draw();
    },
    // 數線上走路:起點 a,走 b 步(正往右、負往左)
    numwalk(el) {
      el.innerHTML = `<div class="wd"><div id="nl"></div>
        <div>起點:<input type="range" id="a" min="-8" max="8" value="2"> <b id="av">2</b></div>
        <div>走:<input type="range" id="b" min="-8" max="8" value="-5"> <b id="bv">-5</b>(正=往右,負=往左)</div>
        <div class="big" id="ft"></div></div>`;
      const a = el.querySelector('#a'), b = el.querySelector('#b');
      const draw = () => {
        const av = +a.value, bv = +b.value, r = av + bv;
        el.querySelector('#av').textContent = av; el.querySelector('#bv').textContent = bv;
        el.querySelector('#nl').innerHTML = line(r, av);
        const bt = bv < 0 ? `(${bv})` : bv;
        el.querySelector('#ft').innerHTML = tex(`${av} + ${bt} = ${r}`);
        Widgets.render(el.querySelector('#ft'));
      };
      a.oninput = b.oninput = draw; draw();
    },
    // 拖曳分子/分母,看巧克力條
    fracbar(el) {
      el.innerHTML = `<div class="wd"><div id="fb"></div>
        <div>分母(平均分成幾份):<input type="range" id="d" min="1" max="12" value="8"> <b id="dv">8</b></div>
        <div>分子(取幾份):<input type="range" id="n" min="0" max="8" value="3"> <b id="nv">3</b></div>
        <div class="big" id="ft"></div></div>`;
      const d = el.querySelector('#d'), n = el.querySelector('#n');
      const draw = () => {
        const dv = +d.value; n.max = dv; if (+n.value > dv) n.value = dv;
        el.querySelector('#dv').textContent = dv; el.querySelector('#nv').textContent = n.value;
        el.querySelector('#fb').innerHTML = bar(+n.value, dv);
        el.querySelector('#ft').innerHTML = tex(G.frac(n.value, dv));
        Widgets.render(el.querySelector('#ft'));
      };
      d.oninput = n.oninput = draw; draw();
    },
    // 分子分母同乘 k,條的長度不變 → 大小相同
    fracequiv(el) {
      el.innerHTML = `<div class="wd"><div id="b1"></div><div id="b2"></div>
        <div>同時乘以 <input type="range" id="k" min="1" max="6" value="2"> <b id="kv">2</b></div>
        <div class="big" id="ft"></div></div>`;
      const k = el.querySelector('#k');
      const draw = () => {
        const kv = +k.value;
        el.querySelector('#kv').textContent = kv;
        el.querySelector('#b1').innerHTML = bar(1, 2);
        el.querySelector('#b2').innerHTML = bar(kv, 2 * kv);
        el.querySelector('#ft').innerHTML = tex(`${G.frac(1, 2)} = ${G.frac(kv, 2 * kv)}`);
        Widgets.render(el.querySelector('#ft'));
      };
      k.oninput = draw; draw();
    },
    // 絕對值:拖曳 x 與中心 a,看距離 |x - a|
    absdist(el) {
      el.innerHTML = `<div class="wd"><div id="ln"></div>
        <div>中心 a:<input type="range" id="a" min="-8" max="8" value="2"> <b id="av">2</b>
          &nbsp; 點 x:<input type="range" id="x" min="-10" max="10" value="-3"> <b id="xv">-3</b></div>
        <div class="big" id="ft"></div></div>`;
      const a = el.querySelector('#a'), x = el.querySelector('#x');
      const draw = () => {
        const av = +a.value, xv = +x.value;
        el.querySelector('#av').textContent = av; el.querySelector('#xv').textContent = xv;
        el.querySelector('#ln').innerHTML = line(xv, av);
        el.querySelector('#ft').innerHTML = tex(`|x - a| = |${xv} - ${av < 0 ? '(' + av + ')' : av}| = ${Math.abs(xv - av)}`) + `<br>藍點 a 到紅點 x 的距離是 <b>${Math.abs(xv - av)}</b>`;
        Widgets.render(el.querySelector('#ft'));
      };
      a.oninput = x.oninput = draw; draw();
    },
    // 科學記號:拖曳 10 的指數,看小數點怎麼搬家
    sci(el) {
      el.innerHTML = `<div class="wd"><div>指數 n:<input type="range" id="n" min="-6" max="9" value="4"> <b id="nv">4</b></div>
        <div class="big" id="ft"></div></div>`;
      const n = el.querySelector('#n');
      const draw = () => {
        const nv = +n.value, d = '345'; // 3.45
        const plain = nv >= 2 ? d + '0'.repeat(nv - 2) : nv >= 0 ? d.slice(0, nv + 1) + (nv < 2 ? '.' + d.slice(nv + 1) : '') : '0.' + '0'.repeat(-nv - 1) + d;
        const shown = nv >= 3 ? plain.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : plain;
        el.querySelector('#nv').textContent = nv;
        el.querySelector('#ft').innerHTML = tex(`3.45\\times10^{${nv}}`) + `<br>= <b>${shown}</b><br><small>n 是正的 → 小數點往右搬 ${nv > 0 ? nv : 0} 位;n 是負的 → 往左搬 ${nv < 0 ? -nv : 0} 位</small>`;
        Widgets.render(el.querySelector('#ft'));
      };
      n.oninput = draw; draw();
    },
    // 對稱:選對稱的對象,拖曳點 A,看對稱點 A'
    reflect(el) {
      const K = [
        { n: 'x 軸', f: (x, y) => [x, -y] }, { n: 'y 軸', f: (x, y) => [-x, y] }, { n: '原點', f: (x, y) => [-x, -y] },
        { n: '直線 y = x', f: (x, y) => [y, x], line: { m: 1, b: 0 } }, { n: '直線 y = -x', f: (x, y) => [-y, -x], line: { m: -1, b: 0 } }
      ];
      el.innerHTML = `<div class="wd"><div id="pl"></div>
        <div>x:<input type="range" id="x" min="-6" max="6" value="3"> <b id="xv">3</b>
          &nbsp; y:<input type="range" id="y" min="-6" max="6" value="2"> <b id="yv">2</b></div>
        <div>對稱於:<select id="k">${K.map((k, i) => `<option value="${i}">${k.n}</option>`).join('')}</select></div>
        <div class="big" id="ft"></div></div>`;
      const x = el.querySelector('#x'), y = el.querySelector('#y'), k = el.querySelector('#k');
      const draw = () => {
        const xv = +x.value, yv = +y.value, K1 = K[+k.value], [rx, ry] = K1.f(xv, yv);
        el.querySelector('#xv').textContent = xv; el.querySelector('#yv').textContent = yv;
        el.querySelector('#pl').innerHTML = G.plane({ pts: [{ x: xv, y: yv, label: 'A' }, { x: rx, y: ry, label: "A'" }], line: K1.line, segs: [{ x1: xv, y1: yv, x2: rx, y2: ry }] });
        el.querySelector('#ft').innerHTML = tex(`A(${xv}, ${yv}) \\to A'(${rx}, ${ry})`);
        Widgets.render(el.querySelector('#ft'));
      };
      x.oninput = y.oninput = k.oninput = draw; draw();
    },
    // 斜率:拖曳兩點 A、B,看斜率 = 上升量 ÷ 水平量
    slope2(el) {
      el.innerHTML = `<div class="wd"><div id="pl"></div>
        <div>A:x <input type="range" id="x1" min="-5" max="5" value="-2"> <b id="x1v"></b>,y <input type="range" id="y1" min="-5" max="5" value="-1"> <b id="y1v"></b></div>
        <div>B:x <input type="range" id="x2" min="-5" max="5" value="2"> <b id="x2v"></b>,y <input type="range" id="y2" min="-5" max="5" value="3"> <b id="y2v"></b></div>
        <div class="big" id="ft"></div></div>`;
      const q = s => el.querySelector(s), ids = ['x1', 'y1', 'x2', 'y2'];
      const draw = () => {
        const [x1, y1, x2, y2] = ids.map(i => +q('#' + i).value);
        ids.forEach(i => { q('#' + i + 'v').textContent = q('#' + i).value; });
        const vert = x1 === x2, m = vert ? 0 : (y2 - y1) / (x2 - x1), b = y1 - m * x1;
        q('#pl').innerHTML = G.plane({ pts: [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y2, label: 'B' }], line: vert ? null : { m, b }, segs: vert ? [{ x1, y1, x2, y2 }] : [] });
        const dy = y2 - y1, dx = x2 - x1, g = G.gcd(dy, dx) || 1;
        q('#ft').innerHTML = vert ? '兩點的 x 一樣:鉛直線,<b>斜率不存在</b>' :
          tex(`m = \\frac{${y2} - ${y1 < 0 ? '(' + y1 + ')' : y1}}{${x2} - ${x1 < 0 ? '(' + x1 + ')' : x1}} = \\frac{${dy}}{${dx}} = ${(() => { const n = (dx < 0 ? -dy : dy) / g, d = Math.abs(dx) / g; return d === 1 ? n : `${n < 0 ? '-' : ''}\\frac{${Math.abs(n)}}{${d}}`; })()}`);
        Widgets.render(q('#ft'));
      };
      ids.forEach(i => { q('#' + i).oninput = draw; }); draw();
    },
    // 圓:拖曳圓心 (h, k) 與半徑 r,看標準式
    circleplot(el) {
      el.innerHTML = `<div class="wd"><div id="pl"></div>
        <div>圓心 h:<input type="range" id="h" min="-4" max="4" value="1"> <b id="hv"></b>
          &nbsp; k:<input type="range" id="k" min="-4" max="4" value="-1"> <b id="kv"></b>
          &nbsp; 半徑 r:<input type="range" id="r" min="1" max="5" value="3"> <b id="rv"></b></div>
        <div class="big" id="ft"></div></div>`;
      const q = s => el.querySelector(s), sub = (v, a) => (a === 0 ? v + '^2' : `(${v} ${a < 0 ? '+' : '-'} ${Math.abs(a)})^2`);
      const draw = () => {
        const h = +q('#h').value, k = +q('#k').value, r = +q('#r').value;
        q('#hv').textContent = h; q('#kv').textContent = k; q('#rv').textContent = r;
        q('#pl').innerHTML = G.plane({ range: 8, size: 320, circles: [{ h, k, r }], pts: [{ x: h, y: k, label: 'O' }] });
        q('#ft').innerHTML = tex(`${sub('x', h)} + ${sub('y', k)} = ${r * r}`) + `<br>圓心 (${h}, ${k}),半徑 ${r}`;
        Widgets.render(q('#ft'));
      };
      ['h', 'k', 'r'].forEach(i => { q('#' + i).oninput = draw; }); draw();
    }
  };
  return {
    mount(name, el) { if (W[name]) W[name](el); },
    render(el) {
      if (window.renderMathInElement) try {
        renderMathInElement(el, { delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }], throwOnError: false });
      } catch (e) {}
    }
  };
})();
