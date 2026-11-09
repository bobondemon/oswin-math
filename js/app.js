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
  const s = Store.get(), lv = Store.level();
  document.getElementById('lv').textContent = 'Lv.' + lv;
  document.getElementById('xp').textContent = s.xp + ' XP';
  document.getElementById('xpfill').style.width = (s.xp % 100) + '%';
  document.getElementById('streak').textContent = '🔥' + s.streak;
  const p = s.profile;
  document.getElementById('me').textContent = p ? `${p.avatar} ${p.name}` : '';
}

function status(lv, idx, list) {
  if (Store.stars(lv.id)) return 'done';
  if (UNLOCK_ALL) return 'open';
  const firstOpen = list.findIndex(l => !Store.stars(l.id));
  return idx === firstOpen ? 'open' : 'locked';
}

function renderMap() {
  const list = allLevels();
  const p = Store.profile() || { avatar: '🧙', name: '家長' };
  let html = `<div class="card npc"><div class="face">${esc(p.avatar)}</div><div>
    <b>歡迎,${esc(p.name)}!</b><br>每一關都有講解、互動和練習。答錯不會扣分,只會給你提示。<br>
    通關拿星星、累積經驗值,一路升級吧!</div></div>`;
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
        const idx = list.indexOf(l), st = status(l, idx, list), n = Store.stars(l.id);
        html += `<button class="node ${st}" data-id="${l.id}" ${st === 'locked' ? 'disabled' : ''}>
          ${st === 'locked' ? '🔒' : l.icon || '⚔️'}<small>${n ? '⭐'.repeat(n) : ''}</small><span class="lbl">${l.title.replace(/^[^\s]+\s/, '')}</span></button>`;
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
    if (confirm('確定要清除這台瀏覽器上孩子的全部進度(XP、星星、暱稱)嗎?此動作無法復原。')) { Store.reset(); location.reload(); }
  };
  const rb = document.getElementById('resume');
  if (rb) rb.onclick = () => { location.hash = `#/play/${r.id}@${r.i}`; };
  v.querySelectorAll('.node:not(.locked)').forEach(b => b.onclick = () => { location.hash = '#/play/' + b.dataset.id; });
}

const AVATARS = ['🦸', '🧙', '🥷', '🧝', '🦊', '🐉', '🦄', '🤖', '🐱', '🐼', '🚀', '🧛'];
const esc = t => t.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderOnboard(editing) {
  const cur = Store.profile() || { name: '', avatar: AVATARS[0] };
  let pick = cur.avatar;
  const v = document.getElementById('view');
  v.innerHTML = `<div class="card pop" style="text-align:center">
    <h2>${editing ? '更改角色' : '歡迎來到數學冒險王國!'}</h2>
    <p>選一個你的角色頭像,再取個冒險者名字吧!</p>
    <div class="avs">${AVATARS.map(a => `<button class="av ${a === pick ? 'sel' : ''}" data-a="${a}">${a}</button>`).join('')}</div>
    <input class="ans" id="nick" maxlength="10" placeholder="你的暱稱" value="${esc(cur.name)}" style="text-align:center">
    <div class="row" style="justify-content:center"><button class="btn" id="go">${editing ? '儲存' : '出發!🚀'}</button>
    ${editing ? '<button class="btn sec" id="cancel">取消</button>' : ''}</div></div>`;
  v.querySelectorAll('.av').forEach(b => b.onclick = () => {
    pick = b.dataset.a; v.querySelectorAll('.av').forEach(x => x.classList.toggle('sel', x === b));
  });
  const nick = document.getElementById('nick');
  const done = () => {
    const name = nick.value.trim();
    if (!name) { nick.focus(); nick.style.borderColor = 'var(--bad)'; return; }
    Store.setProfile({ name, avatar: pick }); location.hash = '#/'; route();
  };
  document.getElementById('go').onclick = done;
  nick.onkeydown = e => { if (e.key === 'Enter') done(); };
  const c = document.getElementById('cancel'); if (c) c.onclick = () => { location.hash = '#/'; route(); };
}

function route() {
  refreshStats();
  if (!Store.profile() && !Store.gold()) return renderOnboard(false);
  if (location.hash === '#/profile') return renderOnboard(true);
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

document.getElementById('me').onclick = () => { location.hash = '#/profile'; };
function toast(msg) {
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
}
const JSON_TYPE = [{ description: '數學冒險存檔', accept: { 'application/json': ['.json'] } }];

// 存檔:支援的瀏覽器(Chrome/Edge)會跳出視窗讓使用者選位置與檔名;其他瀏覽器改問檔名後下載
async function saveGame() {
  if (Store.gold()) return toast('金手指模式下不能存檔');
  const p = Store.profile();
  const defName = `數學冒險-${p ? p.name : '存檔'}.json`;
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
