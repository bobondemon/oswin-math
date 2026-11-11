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
