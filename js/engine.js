// 關卡引擎:講解 → 題目 → 提示 → 評分(星星/XP)。答錯不扣血,只給提示與解答。
const Engine = (() => {
  const PRAISE = ['答對了!👏', '太棒了!🎉', '漂亮!✨', '就是這樣!💪', '你學得好快!🚀', '穩穩的!😎'];
  const view = () => document.getElementById('view');

  function start(level, nextId, exit, startIdx, prevId) {
    const steps = level.steps;
    const run = { i: Math.min(startIdx || 0, steps.length - 1), mistakes: 0, hints: 0, xp: 0, qDone: 0 };
    const gain = n => { run.xp += n; Store.addXP(n); window.refreshStats && refreshStats(); };

    function frame(inner) {
      const pct = Math.round(run.i / steps.length * 100);
      view().innerHTML = `<div class="prog"><div style="width:${pct}%"></div></div>
        <h3>${level.title}</h3><div class="card">${inner}</div>
        <div class="row"><button class="btn sec" id="quit">離開</button>
        ${Store.gold() ? `${run.i > 0 ? '<button class="btn sec" id="gprev">⏮ 上一題</button>' : ''}<button class="btn sec" id="gskip">⏭ 跳下一題</button>` : ''}</div>`;
      document.getElementById('quit').onclick = exit;
      const gp = document.getElementById('gprev'), gs = document.getElementById('gskip');
      if (gp) gp.onclick = () => { run.i = Math.max(0, run.i - 1); show(); };
      if (gs) gs.onclick = advance;
    }
    const after = () => { Widgets.render(view()); };
    const advance = () => { run.i++; show(); };

    function show() {
      if (run.i >= steps.length) return finish();
      Store.setResume({ id: level.id, i: run.i }); // 記住進度,匯入存檔後可接續
      const st = steps[run.i];
      if (st.t === 'explain') return showExplain(st);
      showQ(st);
    }

    function showExplain(st) {
      frame(`<div class="npc"><div class="face">${st.face || '🧙'}</div><div>${st.html}</div></div>
        <div id="wd"></div><div class="row"><button class="btn" id="go">我懂了,繼續 ➜</button></div>`);
      if (st.widget) Widgets.mount(st.widget, document.getElementById('wd'));
      document.getElementById('go').onclick = advance;
      after();
    }

    function showQ(st) {
      let q = st.gen ? st.gen() : st.q;
      let attempts = 0, solved = false;
      frame(`<div class="big" id="qt"></div><div id="inp"></div><div id="fb"></div>
        <div class="row" id="btns"></div>`);
      const $ = id => document.getElementById(id);
      const draw = () => {
        attempts = 0; solved = false;
        $('qt').innerHTML = q.text; $('fb').innerHTML = '';
        if (q.type === 'choice') {
          $('inp').innerHTML = q.choices.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join('');
          $('inp').querySelectorAll('.choice').forEach(b => b.onclick = () => submit(+b.dataset.i));
          $('btns').innerHTML = `<button class="btn sec" id="hint">💡 提示</button>`;
        } else {
          $('inp').innerHTML = `<input class="ans" id="a" autocomplete="off" inputmode="text" placeholder="${q.type === 'frac' ? '例如 3/4' : '輸入數字'}">`;
          $('btns').innerHTML = `<button class="btn" id="ok">檢查</button><button class="btn sec" id="hint">💡 提示</button>`;
          $('ok').onclick = () => submit($('a').value);
          $('a').onkeydown = e => { if (e.key === 'Enter') submit($('a').value); };
          $('a').focus();
        }
        $('hint').onclick = () => { run.hints++; fb('hint', '💡 ' + q.hint); };
        after();
      };
      const fb = (cls, html) => { $('fb').innerHTML = `<div class="fb ${cls}">${html}</div>`; after(); };
      const next = label => {
        $('btns').innerHTML = `<button class="btn" id="nx">${label || '下一步 ➜'}</button>`;
        $('nx').onclick = advance;
      };
      function submit(v) {
        if (solved) return;
        const r = G.check(q, v);
        if (r === 'invalid') return fb('hint', '請輸入數字或分數(像 3/4)喔');
        if (r === 'unreduced') return fb('hint', '數值對了!👍 不過還可以再約分成最簡分數,再試一次~');
        if (r === 'ok') {
          solved = true;
          gain(attempts === 0 ? 10 : 5);
          run.qDone++;
          $('inp').querySelectorAll('input,button').forEach(e => e.disabled = true);
          fb('ok', `${PRAISE[Math.floor(Math.random() * PRAISE.length)]} ${attempts === 0 ? '+10 XP' : '+5 XP(錯了還願意再試,最棒!)'}${q.sol ? '<div style="font-weight:400;margin-top:6px">' + q.sol + '</div>' : ''}`);
          return next();
        }
        attempts++; run.mistakes++;
        Store.addWrong({ id: level.id, text: q.text, ts: Date.now() });
        if (attempts === 1) return fb('hint', '差一點點!看看提示再試一次 💪<br>' + q.hint);
        // 第二次還是錯:給完整解答,再換一題同類型
        $('inp').querySelectorAll('input,button').forEach(e => e.disabled = true);
        fb('sol', `沒關係,這題我們一起看:<br>${q.sol}`);
        $('btns').innerHTML = st.gen
          ? `<button class="btn" id="re">換一題再挑戰 🔄</button>`
          : `<button class="btn" id="re">繼續 ➜</button>`;
        $('re').onclick = () => { if (st.gen) { q = st.gen(); draw(); } else advance(); };
      }
      draw();
    }

    function finish() {
      const score = run.mistakes + Math.floor(run.hints / 2);
      const stars = score === 0 ? 3 : score <= 2 ? 2 : 1;
      const bonus = 20 + stars * 5;
      gain(bonus);
      Store.setStars(level.id, stars);
      Store.setResume(null);
      Store.touchDay();
      window.refreshStats && refreshStats();
      view().innerHTML = `<div class="card pop" style="text-align:center">
        <div class="stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
        <h2>${['', '完成了!每一步都在進步 🌱', '很棒!再接再厲 🌟', '完美通關!🏆'][stars]}</h2>
        <p>本關獲得 <b>${run.xp} XP</b>(含通關獎勵 +${bonus})</p>
        ${level.learned ? `<div class="fb ok" style="text-align:left">📝 你學會了:${level.learned}</div>` : ''}
        <div class="row" style="justify-content:center">
          ${nextId ? '<button class="btn" id="nx">下一關 ➜</button>' : ''}
          <button class="btn sec" id="map">回地圖</button>
          ${stars < 3 ? '<button class="btn sec" id="again">再挑戰拿 3 星</button>' : ''}
        </div></div>`;
      Widgets.render(view());
      if (nextId) document.getElementById('nx').onclick = () => { location.hash = '#/play/' + nextId; };
      document.getElementById('map').onclick = exit;
      const ag = document.getElementById('again');
      if (ag) ag.onclick = () => start(level, nextId, exit);
    }
    show();
  }
  return { start };
})();
