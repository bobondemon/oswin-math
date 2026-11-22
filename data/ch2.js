// 第 2 章:直線與圓(需先載入 ch0.js、ch1gen.js、ch2gen.js;用到 ex、Q)
const g2 = G2;
window.COURSE.push({
  id: 'ch2', icon: '🛤️', title: '第 2 章:直線與圓',
  story: '町上來了一位脾氣古怪的漫畫家,還有一條傳說中「進得去、出不來」的小巷。畫直線、量距離、算圓——把這些基本功練熟,才找得到巷子的規則!',
  subtopics: [
    { id: 'c2s1', title: '① 坐標與對稱', levels: [
      { id: 'c2s1l1', icon: '🪞', title: '🪞 對軸與原點對稱', learned: '對 x 軸對稱:(x, y) → (x, −y);對 y 軸:(x, y) → (−x, y);對原點:(x, y) → (−x, −y)。',
        steps: [
          ex(`<b>對稱</b>就像照鏡子:鏡子是一條線(或一個點),原來的點和它的「鏡中像」到鏡子的距離一樣遠。<br>
              對 <b>x 軸</b>:上下翻面,$y$ 變號;對 <b>y 軸</b>:左右翻面,$x$ 變號;對<b>原點</b>:轉半圈,$x$、$y$ 都變號。拖拖看:`, 'reflect'),
          Q(g2.reflect), Q(g2.reflect), Q(g2.reflect),
          ex(`口訣:<b>誰是鏡子,誰就不動、另一個變號</b>。對 x 軸 → $x$ 不動、$y$ 變號;對 y 軸 → $y$ 不動、$x$ 變號。`),
          Q(g2.reflect), Q(g2.reflect)
        ] },
      { id: 'c2s1l2', icon: '↗️', title: '↗️ 對稱於斜線與任意直線', learned: '對 y = x 對稱:x、y 互換;對 y = −x 對稱:x、y 互換並變號;對 x = a:(x, y) → (2a − x, y);對 y = b:(x, y) → (x, 2b − y)。',
        steps: [
          ex(`鏡子斜斜的也可以!<br>
              對<b>直線 $y = x$</b>:$x$ 和 $y$ <b>互換</b>,$(3, 1) \\to (1, 3)$。<br>
              對<b>直線 $y = -x$</b>:互換之後<b>都變號</b>,$(3, 1) \\to (-1, -3)$。上面的小元件選到這兩個,拖拖看!`, 'reflect'),
          Q(g2.reflect), Q(g2.reflect), Q(g2.reflect),
          ex(`鏡子是「別的鉛直線或水平線」時:<br>
              對 $x = a$:y 不變,x 到 $a$ 的距離不變、跑到另一邊,新 $x = 2a - x$。<br>
              對 $y = b$:x 不變,新 $y = 2b - y$。`),
          Q(g2.reflectLine), Q(g2.reflectLine), Q(g2.reflect)
        ] },
      { id: 'c2s1l3', icon: '📍', title: '📍 中點、對稱點與距離', learned: '中點 = 兩點座標的平均;對點 M 的對稱點 A′ = 2M − A;兩點距離 = √(Δx² + Δy²)。',
        steps: [
          ex(`<b>中點</b>就是兩端點「座標的平均」:$A(x_1, y_1)$、$B(x_2, y_2)$ 的中點是 $\\left(\\frac{x_1 + x_2}{2}, \\frac{y_1 + y_2}{2}\\right)$。`),
          Q(g2.midpoint), Q(g2.midpoint),
          ex(`<b>對某一點對稱</b>,這個點就是兩點的<b>中點</b>。已知 $A$ 和中點 $M$,另一端 $A' = 2M - A$。`),
          Q(g2.reflectPt), Q(g2.reflectPt),
          ex(`<b>距離公式</b>(畢氏定理):$AB = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$。<br>
              這一章的題目常用「勾股數」:3-4-5、5-12-13、6-8-10,算起來剛好是整數。`),
          Q(g2.dist2), Q(g2.dist2)
        ] }
    ] },
    { id: 'c2s2', title: '② 直線方程式與斜率', levels: [
      { id: 'c2s2l1', icon: '📈', title: '📈 斜率:直線有多陡', learned: '斜率 m = (y 的變化量)÷(x 的變化量),同一條直線上任兩點算出來都一樣;鉛直線斜率不存在,水平線斜率是 0。',
        steps: [
          ex(`<b>斜率</b>描述直線「陡不陡」:往右走 1 格,上升(正)或下降(負)幾格。<br>
              $$m = \\frac{y_2 - y_1}{x_2 - x_1}$$
              拖拖看兩個點,看斜率怎麼變:`, 'slope2'),
          Q(g2.slopeTwo), Q(g2.slopeTwo), Q(g2.slopeTwo),
          ex(`兩個特例:<b>水平線</b>($y$ 不變)斜率是 $0$;<b>鉛直線</b>($x$ 不變)斜率<b>不存在</b>(分母會變成 0)。`),
          Q(g2.slopeVert), Q(g2.slopeVert), Q(g2.slopeTwo)
        ] },
      { id: 'c2s2l2', icon: '📌', title: '📌 點斜式', learned: '已知一點 (x₁, y₁) 與斜率 m:y − y₁ = m(x − x₁)。',
        steps: [
          ex(`已知直線<b>通過一點 $(x_1, y_1)$</b> 且<b>斜率 $m$</b>,方程式是(<b>點斜式</b>):$$y - y_1 = m(x - x_1)$$
              為什麼?直線上任何一點 $(x, y)$ 到 $(x_1, y_1)$ 的斜率都是 $m$,寫出來就是 $\\frac{y - y_1}{x - x_1} = m$。<br>
              例:過 $(2, 3)$、斜率 4:$y - 3 = 4(x - 2)$。`),
          Q(g2.pointSlope), Q(g2.pointSlope), Q(g2.pointSlope),
          ex(`想求「$x = 0$ 時的 $y$」(y 截距),就把 $x = 0$ 代進點斜式;想求其他位置也一樣,<b>代進去算</b>就好。`),
          Q(g2.pointSlope), Q(g2.pointSlope), Q(g2.slopeTwo)
        ] },
      { id: 'c2s2l3', icon: '🧾', title: '🧾 一般式與截距', learned: '一般式 ax + by + c = 0 的斜率是 −a/b;令 y = 0 得 x 截距,令 x = 0 得 y 截距。',
        steps: [
          ex(`直線有兩種常見寫法:<br>
              <b>斜截式</b> $y = mx + k$(一眼看出斜率 $m$ 與截距 $k$)<br>
              <b>一般式</b> $ax + by + c = 0$(不管斜或直都能寫)<br>
              一般式的斜率:把 $y$ 留在左邊整理就知道 $m = -\\frac{a}{b}$。`),
          Q(g2.slopeGeneral), Q(g2.slopeGeneral),
          ex(`<b>截距</b>:直線和兩軸相交的位置。<br>
              令 $y = 0$ 求 <b>x 截距</b>(和 x 軸的交點);令 $x = 0$ 求 <b>y 截距</b>。`),
          Q(g2.intercepts), Q(g2.intercepts), Q(g2.xIntercept), Q(g2.xIntercept)
        ] },
      { id: 'c2s2l4', icon: '🔗', title: '🔗 兩點求直線與共線', learned: '兩點決定一條直線:先求斜率,再代入求截距;三點共線 ⟺ 任兩點間的斜率都相等。',
        steps: [
          ex(`已知兩點求直線:<br>
              ① 用兩點算斜率 $m$。 ② 把其中一點代進 $y = mx + k$ 解出 $k$。<br>
              例:過 $(0, 1)$ 與 $(2, 5)$:$m = 2$,代入得 $k = 1$,所以 $y = 2x + 1$。`),
          Q(g2.lineTwo), Q(g2.lineTwo), Q(g2.lineTwo),
          ex(`<b>三點共線</b>:算「第 1、2 點」的斜率與「第 1、3 點」的斜率,<b>相等就共線</b>。`),
          Q(g2.collinear), Q(g2.collinear), Q(g2.xIntercept)
        ] }
    ] },
    { id: 'c2s3', title: '③ 平行、垂直與距離', levels: [
      { id: 'c2s3l1', icon: '‖', title: '‖ 平行線', learned: '兩直線平行 ⟺ 斜率相同(一般式的 x、y 係數成比例)。',
        steps: [
          ex(`<b>平行</b>:兩條直線永遠不相交。條件:<b>斜率相同</b>。<br>
              一般式 $a_1x + b_1y = c_1$ 與 $a_2x + b_2y = c_2$ 平行,代表 $a_1 : b_1 = a_2 : b_2$(<b>x、y 係數成比例</b>)。<br>
              例:$2x + 3y = 5$ 與 $4x + 6y = 7$ 平行(係數都是 2 倍)。`),
          Q(g2.parGen), Q(g2.parGen),
          ex(`<b>過一點作平行線</b>:斜率照抄,再用點斜式。`),
          Q(g2.parThrough), Q(g2.parThrough), Q(g2.slopeTwo)
        ] },
      { id: 'c2s3l2', icon: '⊥', title: '⊥ 垂直線', learned: '兩直線垂直 ⟺ 斜率相乘 = −1(a₁a₂ + b₁b₂ = 0)。',
        steps: [
          ex(`<b>垂直</b>:兩條線夾 90 度。條件:<b>斜率相乘等於 $-1$</b>。<br>
              斜率 $\\frac{2}{3}$ 的垂線,斜率是 $-\\frac{3}{2}$(<b>倒過來、再變號</b>)。<br>
              水平線和鉛直線互相垂直(這是特例,斜率公式用不上)。`),
          Q(g2.perpSlope), Q(g2.perpSlope), Q(g2.perpSlope),
          ex(`一般式的垂直條件:$a_1x + b_1y = c_1$ 與 $a_2x + b_2y = c_2$ 垂直 ⟺ <b>$a_1a_2 + b_1b_2 = 0$</b>。`),
          Q(g2.perpK), Q(g2.perpK)
        ] },
      { id: 'c2s3l3', icon: '📏', title: '📏 點到直線的距離', learned: '點 (x₀, y₀) 到直線 ax + by + c = 0 的距離 = |ax₀ + by₀ + c| ÷ √(a² + b²)。',
        steps: [
          ex(`<b>點到直線的距離</b>:從點作垂線到直線,這段垂線的長度。公式:<br>
              $$d = \\frac{|ax_0 + by_0 + c|}{\\sqrt{a^2 + b^2}}$$
              用法:<b>直線先整理成 $ax + by + c = 0$</b>,把點座標代進分子,分母是 x、y 係數平方和開根號。`),
          Q(g2.pointLine), Q(g2.pointLine),
          ex(`題目的係數常取 $(3, 4)$、$(5, 12)$、$(6, 8)$ 這種勾股數,分母開出來剛好是整數(5、13、10)。`),
          Q(g2.pointLine), Q(g2.pointLine)
        ] },
      { id: 'c2s3l4', icon: '🔺', title: '🔺 平行線距離與三角形面積', learned: '平行線距離 = |c₁ − c₂| ÷ √(a² + b²);三角形面積可用「交叉相乘再相減」的一半。',
        steps: [
          ex(`<b>兩條平行線的距離</b>:$ax + by + c_1 = 0$ 與 $ax + by + c_2 = 0$ 的距離是 $$\\frac{|c_1 - c_2|}{\\sqrt{a^2 + b^2}}$$
              注意:兩條線的 $x$、$y$ 係數要<b>一樣</b>才能用。`),
          Q(g2.parDist), Q(g2.parDist),
          ex(`<b>三角形面積</b>:頂點 $A$、$B$、$C$,先算兩個「邊向量」$AB = (a, b)$、$AC = (c, d)$,面積 $= \\frac{1}{2}|ad - bc|$。`),
          Q(g2.triArea), Q(g2.triArea), Q(g2.pointLine)
        ] }
    ] },
    { id: 'c2s4', title: '④ 二元一次不等式與區域', levels: [
      { id: 'c2s4l1', icon: '🧭', title: '🧭 半平面:哪一邊才對', learned: '直線把平面分成兩個「半平面」;代入一個測試點(如原點),就知道它在不等式的哪一邊。',
        steps: [
          ex(`一條直線 $ax + by + c = 0$ 把平面切成<b>兩半</b>。不等式 $ax + by + c > 0$ 表示其中一半;$ax + by + c < 0$ 表示另一半。<br>
              怎麼知道是哪一半?<b>找一個測試點代進去</b>(最方便是原點 $(0, 0)$),成立就是那一側。`),
          Q(g2.ineqPt), Q(g2.ineqPt), Q(g2.ineqPt),
          ex(`有等號($\\ge$、$\\le$)時,<b>直線上的點也算</b>(畫實線);沒有等號($>$、$<$)時,直線上的點<b>不算</b>(畫虛線)。`),
          Q(g2.ineqPt), Q(g2.ineqPt)
        ] },
      { id: 'c2s4l2', icon: '🎨', title: '🎨 看圖找不等式', learned: '在直線上方 → y > 直線;在直線下方 → y < 直線;虛線沒有等號,實線有等號。',
        steps: [
          ex(`把不等式寫成 $y > mx + k$ 的樣子,就很好看圖:<br>
              <b>$y >$ 直線</b>:解區域在直線的<b>上方</b>。<b>$y <$ 直線</b>:在直線的<b>下方</b>。<br>
              邊界是虛線 → 不含等號;實線 → 含等號。`),
          Q(g2.ineqRegion), Q(g2.ineqRegion), Q(g2.ineqRegion),
          ex(`多看幾張圖,練習「先看上下,再看虛實」兩步驟。`),
          Q(g2.ineqRegion), Q(g2.ineqRegion), Q(g2.ineqRegion)
        ] },
      { id: 'c2s4l3', icon: '🏁', title: '🏁 聯立不等式與區域', learned: '幾個不等式同時成立的區域,是半平面的「重疊部分」;可數整數點、算區域的面積。',
        steps: [
          ex(`很多條件同時成立,就是把半平面<b>疊起來</b>,留下重疊的部分。<br>
              例:$x \\ge 0$、$y \\ge 0$、$x + y \\le 4$ 圍出一個直角三角形(兩邊在座標軸、斜邊是 $x + y = 4$)。<br>
              <b>整數點</b>:一個 $x$ 一個 $x$ 數,看對應的 $y$ 有幾個。`),
          Q(g2.latticeCount), Q(g2.latticeCount),
          ex(`區域是三角形時,面積 = $\\frac{1}{2}$ × (x 截距) × (y 截距)。這就是「找最佳方案」類題目的第一步:先畫出可行的區域。`),
          Q(g2.regionArea), Q(g2.regionArea), Q(g2.ineqPt)
        ] }
    ] },
    { id: 'c2s5', title: '⑤ 圓方程式', levels: [
      { id: 'c2s5l1', icon: '⭕', title: '⭕ 圓的標準式', learned: '圓心 (h, k)、半徑 r 的圓:(x − h)² + (y − k)² = r²。',
        steps: [
          ex(`<b>圓</b>:到圓心距離都等於半徑的點。圓心 $(h, k)$、半徑 $r$ 的圓,方程式(<b>標準式</b>)是$$(x - h)^2 + (y - k)^2 = r^2$$
              這就是距離公式!(到圓心的距離平方 = 半徑平方)。注意<b>括號裡是減號</b>:圓心 $(3, -2)$ 的圓寫成 $(x - 3)^2 + (y + 2)^2$。拖拖看:`, 'circleplot'),
          Q(g2.circleRead), Q(g2.circleRead), Q(g2.circleRead),
          ex(`讀圓心的小訣竅:<b>括號裡符號反過來</b>。$(x + 4)^2$ → 圓心 $x$ 座標是 $-4$;右邊是 $r^2$,要<b>開根號</b>才是半徑。`),
          Q(g2.circleRead), Q(g2.circleRead)
        ] },
      { id: 'c2s5l2', icon: '✏️', title: '✏️ 寫出圓的方程式', learned: '已知圓心與半徑,直接代入標準式;右邊要填半徑的平方。',
        steps: [
          ex(`已知圓心 $(h, k)$、半徑 $r$,把它們代進 $(x - h)^2 + (y - k)^2 = r^2$ 就完成了。<br>
              常見小錯誤:<b>忘了把半徑平方</b>。半徑 5,右邊要寫 $25$,不是 5。`),
          Q(g2.circleEqn), Q(g2.circleEqn), Q(g2.circleEqn),
          ex(`<b>直徑兩端點</b>已知時:中點 = 圓心;圓心到端點的距離(平方)= 半徑(平方)。`),
          Q(g2.diameter), Q(g2.circleRead)
        ] },
      { id: 'c2s5l3', icon: '🧮', title: '🧮 一般式與配方法', learned: '一般式 x² + y² + dx + ey + f = 0 用配方法化回標準式;圓心 (−d/2, −e/2)。',
        steps: [
          ex(`圓有時寫成<b>一般式</b>:$x^2 + y^2 + dx + ey + f = 0$。要看圓心、半徑,就用<b>配方法</b>:<br>
              例:$x^2 + y^2 - 6x + 4y - 12 = 0$<br>
              ① 把 $x$ 的項、$y$ 的項配成平方:$(x^2 - 6x + 9) + (y^2 + 4y + 4) = 12 + 9 + 4$<br>
              ② 得 $(x - 3)^2 + (y + 2)^2 = 25$,圓心 $(3, -2)$,半徑 5。`),
          Q(g2.circleGeneral), Q(g2.circleGeneral),
          ex(`捷徑:圓心 $= \\left(-\\frac{d}{2}, -\\frac{e}{2}\\right)$,半徑平方 $= \\left(\\frac{d}{2}\\right)^2 + \\left(\\frac{e}{2}\\right)^2 - f$。`),
          Q(g2.circleGeneral), Q(g2.circleGeneral)
        ] },
      { id: 'c2s5l4', icon: '🎯', title: '🎯 點與圓的位置', learned: '點到圓心的距離 < r 在圓內、= r 在圓上、> r 在圓外(比較平方就好)。',
        steps: [
          ex(`判斷點在圓的<b>內、上、外</b>:算「點到圓心的距離」,跟半徑比。<br>
              距離 $<$ 半徑 → 圓內;$=$ → 圓上;$>$ → 圓外。<br>
              為了省開根號,可以<b>直接比平方</b>:$(x - h)^2 + (y - k)^2$ 與 $r^2$ 比大小。`),
          Q(g2.pointCircle), Q(g2.pointCircle), Q(g2.pointCircle),
          ex(`再練習「由直徑端點求圓」,混著前面的題型。`),
          Q(g2.diameter), Q(g2.diameter), Q(g2.circleGeneral)
        ] }
    ] },
    { id: 'c2s6', title: '⑥ 圓與直線', levels: [
      { id: 'c2s6l1', icon: '🔍', title: '🔍 相割、相切、相離', learned: '圓心到直線的距離 d 與半徑 r:d < r 相割(2 交點)、d = r 相切(1 交點)、d > r 相離(沒交點)。',
        steps: [
          ex(`圓和直線有三種關係:<br>
              <b>相割</b>($d < r$):兩個交點;<b>相切</b>($d = r$):剛好一個交點(直線「剛好碰到」);<b>相離</b>($d > r$):沒有交點。<br>
              做法:<b>算圓心到直線的距離 $d$</b>(上一節學的公式),跟半徑 $r$ 比。`),
          Q(g2.relation), Q(g2.relation), Q(g2.relation),
          ex(`相切是最特別的:這條直線叫圓的<b>切線</b>,而且切線一定<b>垂直於</b>圓心到切點的半徑。`),
          Q(g2.relation), Q(g2.relation)
        ] },
      { id: 'c2s6l2', icon: '✂️', title: '✂️ 弦長與切線', learned: '弦長 = 2√(r² − d²);圓 x² + y² = r² 在 (x₀, y₀) 的切線:x₀x + y₀y = r²。',
        steps: [
          ex(`直線和圓相割時,圓內那一段叫<b>弦</b>。從圓心作垂線到弦,垂足是弦的中點,出現一個直角三角形:<br>
              半弦長$^2$ + $d^2$ = $r^2$,所以 <b>弦長 $= 2\\sqrt{r^2 - d^2}$</b>。`),
          Q(g2.chord), Q(g2.chord), Q(g2.chord),
          ex(`<b>切線</b>:圓 $x^2 + y^2 = r^2$ 在圓上一點 $(x_0, y_0)$ 的切線是 $$x_0x + y_0y = r^2$$
              理由:切線垂直於 $OP$(O 是原點),$OP$ 的斜率是 $\\frac{y_0}{x_0}$,所以切線斜率是 $-\\frac{x_0}{y_0}$,再用點斜式就得到這個式子。`),
          Q(g2.tangentAt), Q(g2.tangentAt)
        ] },
      { id: 'c2s6l3', icon: '🏹', title: '🏹 圓上最遠與最近', learned: '圓外一點 P 到圓上點的距離:最近 = PC − r、最遠 = PC + r;圓上點到直線的距離:最小 = d − r、最大 = d + r。',
        steps: [
          ex(`圓外一點 $P$ 到圓上各點的距離,<b>最近的點</b>在 $P$ 與圓心 $C$ 的連線上:<br>
              最近 $= PC - r$,最遠 $= PC + r$。<br>
              圓上的點到<b>直線</b>的距離也是一樣道理:最小 $= d - r$,最大 $= d + r$($d$ 是圓心到直線的距離,圓與直線相離)。`),
          Q(g2.nearest), Q(g2.nearest), Q(g2.nearest),
          ex(`最後混合練習:判斷關係、求弦長、找切線,看你記得幾成。`),
          Q(g2.nearest), Q(g2.relation), Q(g2.chord)
        ] }
    ] },
    // Boss 關:混合直線與圓。三個回合,講解頁的小劇情只有文字
    { id: 'c2boss', title: '⑦ Boss:小巷的規則', levels: [
      { id: 'c2bossl1', icon: '🌀', title: '🌀 Boss:小巷的規則',
        learned: '第 2 章全部通過!你已經會:對稱與中點、直線與斜率、平行垂直與距離、不等式區域、圓方程式、圓與直線。',
        steps: [
          ex(`巷子口的空氣忽然冷了下來,一道聲音說:「想進來?先通過我的<b>三道規則</b>。」<br>
              🌀 <b>第一道:對稱與斜率</b>——這條巷子是對稱的,每個腳步都有鏡像。`, null, '🌀'),
          Q(g2.reflect), Q(g2.slopeTwo),
          ex(`巷子裡的牆是一條一條筆直的線,有的互相平行、有的互相垂直。<br>
              🌀 <b>第二道:牆與距離</b>——算準你和牆之間的距離,別撞上去!`, null, '🌀'),
          Q(g2.pointLine), Q(g2.perpSlope), Q(g2.ineqPt),
          ex(`巷子的盡頭是一個圓形廣場,據說走進去的人,繞著圓心走,永遠出不來。<br>
              🌀 <b>第三道:圓形廣場</b>——找出圓心和半徑,看出直線和它的關係。`, null, '🌀'),
          Q(g2.circleGeneral), Q(g2.relation),
          ex(`最後一關:廣場上有一條弦形的小路,量出它的長度,才能找到出口。`, null, '🌀'),
          Q(g2.chord)
        ] }
    ] }
  ]
});
