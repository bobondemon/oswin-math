// 劇情推進:每完成一個關卡 → 解鎖一張劇情畫面(window.STORY[關卡id],見 data/story.js)
// 一個子主題的劇情分成多張畫面(每關一張),連起來就是 docs/03 對應表裡的那一段劇情。
// 圖片/聲音為選填:有 img/sound 就顯示,沒有就用 scene(emoji 場景)當佔位。
const Story = (() => {
  const levels = () => (window.COURSE || []).flatMap(c => c.subtopics.flatMap(s => s.levels));
  const beatOf = lv => (window.STORY || {})[lv.id] || null;
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // 已解鎖的劇情畫面(依關卡順序);金手指模式全部解鎖
  function unlocked() {
    return levels().filter(l => beatOf(l) && (Store.gold() || Store.isDone(l.id)));
  }
  function total() { return levels().filter(l => beatOf(l)).length; }
  // 圖片依檔名慣例自動尋找:assets/story/{關卡id}.webp → .png → .jpg → .jpeg;都沒有就用 emoji 佔位。
  // (資料裡若指定 img 就優先使用。)音效同理:assets/sound/{關卡id}.mp3,沒有檔案就不顯示播放器。
  const EXTS = ['webp', 'png', 'jpg', 'jpeg'];
  function imgFallback(el) {
    const n = (+el.dataset.n || 0) + 1;
    if (n < EXTS.length && el.dataset.id) { el.dataset.n = n; el.src = `assets/story/${el.dataset.id}.${EXTS[n]}`; return; }
    const ph = document.createElement('div');
    ph.className = 'art ph'; ph.textContent = el.dataset.scene || '🎬';
    el.replaceWith(ph);
  }
  function html(lv) {
    const b = beatOf(lv);
    const src = b.img || `assets/story/${lv.id}.${EXTS[0]}`;
    const art = `<img class="art" src="${esc(src)}" alt="${esc(b.alt || b.title)}" data-id="${b.img ? '' : esc(lv.id)}" data-scene="${esc(b.scene || '🎬')}" onerror="Story.imgFallback(this)">`;
    const snd = `<audio controls preload="metadata" src="${esc(b.sound || `assets/sound/${lv.id}.mp3`)}" onerror="this.remove()"></audio>`;
    return `<div class="beat pop">${art}<h3>📖 ${b.title}</h3><div class="btext">${b.text}</div>${snd}</div>`;
  }
  return { beatOf, unlocked, total, html, imgFallback };
})();
