// 關卡引擎:講解 → 題目 → 提示。答錯不懲罰,只給提示與解答。
// 沒有 XP/星星/血條:過關的回饋是「劇情推進」(見 js/story.js)。
const Engine = (() => {
  const PRAISE = ['答對了!👏', '太棒了!🎉', '漂亮!✨', '就是這樣!💪', '你學得好快!🚀', '穩穩的!😎'];
  const view = () => document.getElementById('view');

  function start(level, nextId, exit, startIdx, prevId) {
    const steps = level.steps;
    const run = { i: Math.min(startIdx || 0, steps.length - 1) };

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
      Store.setResume({ id: level.id, i: run.i }); // 記住進度,讀檔後可接續
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
        $('hint').onclick = () => fb('hint', '💡 ' + q.hint);
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
          $('inp').querySelectorAll('input,button').forEach(e => e.disabled = true);
          fb('ok', `${PRAISE[Math.floor(Math.random() * PRAISE.length)]}${attempts ? '(錯了還願意再試,最棒!)' : ''}${q.sol ? '<div style="font-weight:400;margin-top:6px">' + q.sol + '</div>' : ''}`);
          return next();
        }
        attempts++;
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
      const sub = Story.subOf(level.id);
      const wasComplete = !!sub && Story.isSubDone(sub);
      Store.markDone(level.id);
      Store.setResume(null);
      const isLast = !!sub && sub.levels[sub.levels.length - 1].id === level.id;
      // 正常模式:這關讓子主題「剛好」全部過關才推進劇情;金手指模式不記錄進度,走到子主題最後一關就預覽
      const showBeat = !!sub && Story.beatOf(sub) && (Store.gold() ? isLast : (!wasComplete && Story.isSubDone(sub)));
      view().innerHTML = `<div class="card pop" style="text-align:center">
        <h2>🎉 過關!</h2>
        ${level.learned ? `<div class="fb ok" style="text-align:left">📝 你學會了:${level.learned}</div>` : ''}
        ${showBeat ? '<p class="big">🎬 這個子主題全部完成,劇情繼續!</p>' : ''}
        </div>
        ${showBeat ? Story.html(sub) : ''}
        <div class="row" style="justify-content:center">
          ${nextId ? '<button class="btn" id="nx">下一關 ➜</button>' : ''}
          <button class="btn sec" id="map">回地圖</button>
        </div>`;
      Widgets.render(view());
      if (nextId) document.getElementById('nx').onclick = () => { location.hash = '#/play/' + nextId; };
      document.getElementById('map').onclick = exit;
    }
    show();
  }
  return { start };
})();
