// 進度存檔 (localStorage,失敗時退回記憶體)
const Store = (() => {
  const KEY = 'mathquest-v1';
  const fresh = () => ({ xp: 0, stars: {}, streak: 0, last: '', wrong: [], profile: null });
  let s = fresh();
  try { const r = localStorage.getItem(KEY); if (r) s = Object.assign(s, JSON.parse(r)); } catch (e) {}
  // 金手指(家長瀏覽)模式:完全唯讀,不改記憶體也不寫入,不會留下任何作答痕跡
  // 旗標只放 sessionStorage:關閉分頁/瀏覽器後自動失效
  let gold = false;
  try { localStorage.removeItem('mathquest-gold'); } catch (e) {} // 清掉舊版留下的旗標
  try { gold = sessionStorage.getItem('mathquest-gold') === '1'; } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} };
  const today = () => new Date().toISOString().slice(0, 10);
  return {
    get: () => s,
    level: () => Math.floor(s.xp / 100) + 1,
    gold: () => gold,
    resume: () => s.resume || null,
    setResume(r) { if (gold) return; s.resume = r; save(); },
    profile: () => s.profile,
    setProfile(p) { if (gold) return; s.profile = p; save(); },
    addXP(n) { if (gold) return; s.xp += n; save(); },
    touchDay() {
      if (gold) return;
      const t = today();
      if (s.last === t) return;
      const y = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      s.streak = s.last === y ? s.streak + 1 : 1;
      s.last = t; save();
    },
    setStars(id, n) { if (gold) return; if ((s.stars[id] || 0) < n) s.stars[id] = n; save(); },
    stars: id => s.stars[id] || 0,
    addWrong(w) { if (gold) return; s.wrong.push(w); s.wrong = s.wrong.slice(-100); save(); },
    exportJSON: () => JSON.stringify(s),
    importJSON(t) { if (gold) return; s = Object.assign(fresh(), JSON.parse(t)); save(); },
    // 清除孩子的全部進度(金手指模式下由家長按鈕觸發)
    reset() { try { localStorage.removeItem(KEY); } catch (e) {} s = fresh(); }
  };
})();
