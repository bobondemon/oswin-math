// 進度存檔 (localStorage,失敗時退回記憶體)
// 只記「哪些關卡完成」與續玩位置;沒有 XP/星星/等級/暱稱。劇情推進由「子主題全部過關」推導。
const Store = (() => {
  const KEY = 'mathquest-v1';
  const fresh = () => ({ done: {}, wrong: [] });
  let s = fresh();
  try { const r = localStorage.getItem(KEY); if (r) s = Object.assign(s, JSON.parse(r)); } catch (e) {}
  // 舊版存檔相容:舊的 stars 欄位有紀錄的關卡視為已完成
  if (s.stars) { Object.keys(s.stars).forEach(k => { if (s.stars[k]) s.done[k] = 1; }); }
  // 金手指(家長瀏覽)模式:完全唯讀,不改記憶體也不寫入,不會留下任何作答痕跡
  // 旗標只放 sessionStorage:關閉分頁/瀏覽器後自動失效
  let gold = false;
  try { localStorage.removeItem('mathquest-gold'); } catch (e) {} // 清掉舊版留下的旗標
  try { gold = sessionStorage.getItem('mathquest-gold') === '1'; } catch (e) {}
  const save = () => {
    // 只寫出新格式欄位
    const out = { done: s.done, wrong: s.wrong, resume: s.resume || null };
    try { localStorage.setItem(KEY, JSON.stringify(out)); } catch (e) {}
  };
  return {
    get: () => s,
    gold: () => gold,
    resume: () => s.resume || null,
    setResume(r) { if (gold) return; s.resume = r; save(); },
    isDone: id => !!s.done[id],
    markDone(id) { if (gold) return; s.done[id] = 1; save(); },
    addWrong(w) { if (gold) return; s.wrong.push(w); s.wrong = s.wrong.slice(-100); save(); },
    exportJSON: () => JSON.stringify({ done: s.done, wrong: s.wrong, resume: s.resume || null }),
    importJSON(t) { if (gold) return; s = Object.assign(fresh(), JSON.parse(t)); if (s.stars) { Object.keys(s.stars).forEach(k => { if (s.stars[k]) s.done[k] = 1; }); } save(); },
    // 清除孩子的全部進度(金手指模式下由家長按鈕觸發)
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} s = fresh(); }
  };
})();
