// 地圖與路由
const COURSE_DATA = window.COURSE || [];
const allLevels = () => COURSE_DATA.flatMap(c => c.subtopics.flatMap(s => s.levels));
const UNLOCK_ALL = Store.gold();
const GOLD_HASH = '063488d63e624b69f5778d7bbb88b7c5c356bc4482861882547c89d519df4abc'; // 密碼的 SHA-256
async function sha256(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
async function toggleGold() {
  try {
    if (Store.gold()) { sessionStorage.removeItem('mathquest-gold'); }
    else {
      const pw = prompt('請輸入金手指密碼:');
      if (pw === null) return;
      if (await sha256(pw.trim()) !== GOLD_HASH) return alert('密碼不正確');
      sessionStorage.setItem('mathquest-gold', '1');
    }
  } catch (e) { return alert('此瀏覽器無法啟用金手指'); }
  location.hash = '#/'; location.reload();
}

function refreshStats() {
  const n = Story.unlocked().length;
  document.getElementById('storybtn').textContent = '📖 劇情回顧' + (n ? ` (${n})` : '');
}

function status(lv, idx, list) {
  if (Store.isDone(lv.id)) return 'done';
  if (UNLOCK_ALL) return 'open';
  const firstOpen = list.findIndex(l => !Store.isDone(l.id));
  return idx === firstOpen ? 'open' : 'locked';
}

function renderMap() {
  const list = allLevels();
  let html = `<div class="card npc"><div class="face">🌊</div><div>
    <b>歡迎來到杜王町的夏天!</b><br>每一關都有講解、互動和練習,答錯不會被處罰,只會給你提示。<br>
    把一個主題的關卡全部通過,就能解鎖下一段<b>荒謬又離譜的劇情</b>!</div></div>`;
  if (Store.gold()) html = `<div class="fb hint">🔑 <b>金手指模式</b>:所有關卡已開放,可自由瀏覽。此模式下的作答<b>不會</b>記錄到孩子的進度。
    <button class="btn sec" id="goldoff" style="margin-left:8px;padding:4px 12px;font-size:14px">關閉</button>
    <button class="btn sec" id="goldreset" style="margin-left:8px;padding:4px 12px;font-size:14px">🗑 清除孩子進度</button></div>` + html;
  const r = Store.resume(), rl = r && list.find(l => l.id === r.id);
  if (rl) html += `<div class="card"><b>📍 上次玩到:${esc(rl.title)}(第 ${r.i + 1}/${rl.steps.length} 步)</b>
    <div class="row"><button class="btn" id="resume">繼續上次進度 ➜</button></div></div>`;
  COURSE_DATA.forEach(c => {
    html += `<section class="chap"><h2>${c.icon} ${c.title}</h2><p class="sub">${c.story}</p>`;
    c.subtopics.forEach(s => {
      html += `<div class="sub-title">${s.title}</div>`;
      if (!s.levels.length) { html += `<div class="sub" style="color:var(--mut)">🔒 即將開放</div>`; return; }
      html += `<div class="path" style="margin-bottom:26px">`;
      s.levels.forEach(l => {
        const idx = list.indexOf(l), st = status(l, idx, list);
        html += `<button class="node ${st}" data-id="${l.id}" ${st === 'locked' ? 'disabled' : ''}>
          ${st === 'locked' ? '🔒' : l.icon || '⚔️'}<small>${st === 'done' ? '✔' : ''}</small><span class="lbl">${l.title.replace(/^[^\s]+\s/, '')}</span></button>`;
      });
      html += `</div>`;
    });
    html += `</section>`;
  });
  const v = document.getElementById('view');
  v.innerHTML = html;
  const go = document.getElementById('goldoff'); if (go) go.onclick = toggleGold;
  const gr = document.getElementById('goldreset');
  if (gr) gr.onclick = () => {
    if (confirm('確定要清除這台瀏覽器上孩子的全部進度(已完成的關卡與劇情)嗎?此動作無法復原。')) { Store.reset(); location.reload(); }
  };
  const rb = document.getElementById('resume');
  if (rb) rb.onclick = () => { location.hash = `#/play/${r.id}@${r.i}`; };
  v.querySelectorAll('.node:not(.locked)').forEach(b => b.onclick = () => { location.hash = '#/play/' + b.dataset.id; });
}

const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderStory() {
  const subs = Story.unlocked();
  const all = COURSE_DATA.flatMap(c => c.subtopics).filter(x => Story.beatOf(x));
  let html = `<h2>📖 劇情回顧</h2><p class="sub">過完每個子主題就會解鎖一段劇情。${Store.gold() ? '(金手指:全部解鎖)' : ''}</p>`;
  if (!subs.length) html += `<div class="card">還沒有解鎖任何劇情。先去通關一個子主題吧!</div>`;
  subs.forEach(x => { html += Story.html(x); });
  const locked = all.length - subs.length;
  if (locked > 0) html += `<div class="card" style="color:var(--mut)">🔒 還有 ${locked} 段劇情等你解鎖…</div>`;
  html += `<div class="row"><button class="btn sec" id="back">回地圖</button></div>`;
  const v = document.getElementById('view'); v.innerHTML = html;
  document.getElementById('back').onclick = () => { location.hash = '#/'; };
  Widgets.render(v);
}

function route() {
  refreshStats();
  if (location.hash === '#/story') return renderStory();
  const m = location.hash.match(/^#\/play\/([^@]+)(?:@(\d+))?$/);
  if (m) {
    const list = allLevels(), i = list.findIndex(l => l.id === m[1]);
    if (i >= 0) {
      window.scrollTo(0, 0);
      return Engine.start(list[i], list[i + 1] && list[i + 1].id, () => { location.hash = '#/'; }, +m[2] || 0, list[i - 1] && list[i - 1].id);
    }
  }
  renderMap();
}

function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
}
const JSON_TYPE = [{ description: '數學冒險存檔', accept: { 'application/json': ['.json'] } }];

// 存檔:支援的瀏覽器(Chrome/Edge)會跳出視窗讓使用者選位置與檔名;其他瀏覽器改問檔名後下載
async function saveGame() {
  if (Store.gold()) return toast('金手指模式下不能存檔');
  const defName = '數學冒險-存檔.json';
  const data = Store.exportJSON();
  if (window.showSaveFilePicker) {
    try {
      const h = await showSaveFilePicker({ suggestedName: defName, types: JSON_TYPE });
      const w = await h.createWritable(); await w.write(data); await w.close();
      return toast('✅ 已存檔:' + h.name);
    } catch (e) { if (e.name === 'AbortError') return; /* 使用者取消 */ }
  }
  let name = prompt('存檔檔名:', defName);
  if (!name) return;
  if (!/\.json$/i.test(name)) name += '.json';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = name; a.click();
  toast('✅ 已存檔(在瀏覽器的下載位置)');
}

function loadText(t) {
  try {
    Store.importJSON(t);
    const r = Store.resume();
    if (r && allLevels().some(l => l.id === r.id)) location.hash = `#/play/${r.id}@${r.i}`; // 直接回到上次的關卡
    else location.hash = '#/';
    route(); toast('✅ 讀檔完成');
  } catch (err) { alert('存檔格式不正確'); }
}

async function loadGame() {
  if (Store.gold()) return toast('金手指模式下不能讀檔');
  if (window.showOpenFilePicker) {
    try {
      const [h] = await showOpenFilePicker({ types: JSON_TYPE });
      return loadText(await (await h.getFile()).text());
    } catch (e) { if (e.name === 'AbortError') return; }
  }
  document.getElementById('impfile').click();
}
const gb = document.getElementById('goldbtn');
gb.textContent = Store.gold() ? '🔑 關閉金手指' : '🔑 金手指';
gb.onclick = toggleGold;
document.getElementById('exp').onclick = saveGame;
document.getElementById('imp').onclick = loadGame;
document.getElementById('impfile').onchange = e => {
  const f = e.target.files[0]; if (!f) return;
  f.text().then(loadText); e.target.value = '';
};
window.addEventListener('hashchange', route);
route();
