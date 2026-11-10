// 劇情推進:每個子主題全部過關 → 解鎖一段劇情(window.STORY,見 data/story.js)
// 劇情圖片/聲音為選填:有 img/sound 就顯示,沒有就用 scene(emoji 場景)當佔位。
const Story = (() => {
  const courses = () => window.COURSE || [];
  const subs = () => courses().flatMap(c => c.subtopics);
  const subOf = id => subs().find(s => s.levels.some(l => l.id === id)) || null;
  const isSubDone = s => s.levels.length > 0 && s.levels.every(l => Store.isDone(l.id));
  const beatOf = s => (window.STORY || {})[s.id] || null;
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // 已解鎖的劇情(依子主題順序);金手指模式全部解鎖
  function unlocked() {
    return subs().filter(s => beatOf(s) && (Store.gold() || isSubDone(s)));
  }
  function html(s) {
    const b = beatOf(s);
    const art = b.img
      ? `<img class="art" src="${esc(b.img)}" alt="${esc(b.alt || b.title)}">`
      : `<div class="art ph">${b.scene || '🎬'}</div>`;
    const snd = b.sound ? `<audio controls preload="none" src="${esc(b.sound)}"></audio>` : '';
    return `<div class="beat pop">${art}<h3>📖 ${b.title}</h3><div class="btext">${b.text}</div>${snd}</div>`;
  }
  return { subOf, isSubDone, beatOf, unlocked, html };
})();
