// 互動小元件:Widgets.mount(name, el)
const Widgets = (() => {
  const bar = (n, d) => `<div class="bar">${Array.from({ length: d }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</div>`;
  const tex = s => `$${s}$`;

  const W = {
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
