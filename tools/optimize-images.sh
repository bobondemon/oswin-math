#!/bin/bash
# 自動把 assets/story/ 裡過大的劇情圖縮成:寬 ≤ 1280px、檔案 ≤ 300KB、格式 webp。
# 用法(在專案根目錄):  bash tools/optimize-images.sh
# - 只處理「太大」的圖(寬 > 1280 或 > 300KB 或不是 webp 且偏大);符合規格的不動。
# - 原圖不會被刪:會備份到 assets/_originals/(已加入 .gitignore,不會被推上 GitHub)。
# - 輸出檔名 = 關卡id.webp(例 c0s1l1.webp)。需要 macOS 的 sips 與 cwebp。
set -euo pipefail
cd "$(dirname "$0")/.."

MAX_W=1280
MAX_BYTES=300000
DIR="assets/story"
BACKUP="assets/_originals"

command -v sips >/dev/null || { echo "找不到 sips(需要 macOS)"; exit 1; }
command -v cwebp >/dev/null || { echo "找不到 cwebp,請先安裝:brew install webp"; exit 1; }
mkdir -p "$BACKUP"

shopt -s nullglob nocaseglob
changed=0
for f in "$DIR"/*.{webp,png,jpg,jpeg}; do
  name=$(basename "$f"); id="${name%.*}"; ext=$(echo "${name##*.}" | tr 'A-Z' 'a-z')
  w=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  bytes=$(stat -f%z "$f")
  if [ "$ext" = "webp" ] && [ "$w" -le "$MAX_W" ] && [ "$bytes" -le "$MAX_BYTES" ]; then
    echo "OK    $name (${w}px, $((bytes/1024))KB)"; continue
  fi
  if [ "$ext" != "webp" ] && [ "$w" -le "$MAX_W" ] && [ "$bytes" -le "$MAX_BYTES" ]; then
    echo "OK    $name (${w}px, $((bytes/1024))KB;非 webp 但已夠小,保留)"; continue
  fi

  tmp=$(mktemp -d)
  src="$f"
  # webp 輸入 sips 可能讀不了,先備份再處理
  cp "$f" "$BACKUP/$name"
  if [ "$w" -gt "$MAX_W" ]; then
    sips --resampleWidth "$MAX_W" -s format png "$f" --out "$tmp/in.png" >/dev/null
  else
    sips -s format png "$f" --out "$tmp/in.png" >/dev/null
  fi
  ok=0
  for q in 85 78 70 62 55 48 40; do
    cwebp -quiet -q "$q" "$tmp/in.png" -o "$tmp/out.webp"
    if [ "$(stat -f%z "$tmp/out.webp")" -le "$MAX_BYTES" ]; then ok=1; break; fi
  done
  [ "$ok" = 1 ] || echo "警告:$name 在最低品質仍超過 $((MAX_BYTES/1024))KB,已使用最小結果"
  rm -f "$f"
  mv "$tmp/out.webp" "$DIR/$id.webp"
  nw=$(sips -g pixelWidth "$tmp/in.png" | awk '/pixelWidth/{print $2}')
  echo "FIXED $name (${w}px, $((bytes/1024))KB) → $id.webp (${nw}px, $(( $(stat -f%z "$DIR/$id.webp")/1024 ))KB, q=$q);原圖備份在 $BACKUP/$name"
  rm -rf "$tmp"
  changed=$((changed+1))
done
echo "完成:處理 $changed 張。"
