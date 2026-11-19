// 第 1 章:數與式(需先載入 ch0.js 與 ch1gen.js;用到 ex、Q)
const g1 = G1;
window.COURSE.push({
  id: 'ch1', icon: '⚡', title: '第 1 章:數與式',
  story: '杜王町的怪事越來越多:靠罪惡感作祟的、複製別人的、迷戀康一的……連電線裡都好像有東西在跑。先把「數」和「式」的基本功練紮實,才能應付這些怪人!',
  subtopics: [
    { id: 'c1s1', title: '① 實數與數線', levels: [
      { id: 'c1s1l1', icon: '🔢', title: '🔢 有理數與無理數', learned: '能寫成「整數 ÷ 整數」的是有理數;無限不循環的小數(開不盡的根號、π)是無理數;有理數加無理數合起來叫實數。',
        steps: [
          ex(`數可以分成兩大家族:<br>
              <b>有理數</b>:能寫成「整數 ÷ 整數」的數,例如 $3$、$-2$、$\\frac{5}{8}$、$0.75$、$0.\\overline{3}$。<br>
              <b>無理數</b>:怎麼寫都寫不成分數的數,小數展開<b>無限不循環</b>,例如 $\\sqrt{2}$、$\\sqrt{3}$、$\\pi$。<br>
              兩家族合起來,填滿整條數線,叫做<b>實數</b>。`),
          Q(g1.irrational), Q(g1.ratKind),
          ex(`判斷根號:<b>能開盡 → 有理數</b>($\\sqrt{16}=4$);<b>開不盡 → 無理數</b>($\\sqrt{2}=1.41421356\\ldots$ 一直下去不重複)。<br>
              小提醒:$\\sqrt{2}$ 是無理數這件事,古希臘人證明出來的時候,據說震撼了整個數學界!`),
          Q(g1.ratKind), Q(g1.irrational)
        ] },
      { id: 'c1s1l2', icon: '🔁', title: '🔁 小數展開:有限與循環', learned: '分數化成小數,不是「有限小數」就是「循環小數」;最簡分數的分母只含質因數 2、5,才會是有限小數。',
        steps: [
          ex(`每一個有理數(分數)化成小數,只有兩種結果:<br>
              ① <b>有限小數</b>,例如 $\\frac{3}{8} = 0.375$。<br>
              ② <b>無限循環小數</b>,例如 $\\frac{1}{3} = 0.333\\ldots = 0.\\overline{3}$、$\\frac{1}{7} = 0.\\overline{142857}$。<br>
              想知道是哪一種?把分數<b>約成最簡</b>,看分母:只含質因數 2、5 → 有限;含別的質因數 → 循環。`),
          Q(g1.fracToDec), Q(g1.fracToDec), Q(g1.decType),
          ex(`為什麼?因為 10 = 2 × 5。分母只有 2 和 5,就能乘上適當的數變成 10、100、1000……,除得盡;<br>
              有別的因數(如 3、7)就永遠除不盡,只好一直循環。`),
          Q(g1.decType), Q(g1.fracToDec), Q(g1.decType)
        ] },
      { id: 'c1s1l3', icon: '♾️', title: '♾️ 循環小數化成分數', learned: '循環小數也是有理數:設 x,乘 10 的次方讓循環對齊,兩式相減就能消掉無限的尾巴。',
        steps: [
          ex(`循環小數看起來沒完沒了,但它其實是分數!有個漂亮的技巧:<br>
              求 $0.\\overline{3}$:令 $x = 0.333\\ldots$,則 $10x = 3.333\\ldots$。<br>
              兩式相減,無限的尾巴對消:$10x - x = 3$,所以 $9x = 3$,$x = \\frac{1}{3}$。`),
          Q(g1.recToFrac), Q(g1.recToFrac),
          ex(`兩位數一組在循環(如 $0.\\overline{36}$),就乘 100:$100x - x = 36$,$x = \\frac{36}{99} = \\frac{4}{11}$。<br>
              規律:<b>一位循環 ÷ 9、兩位循環 ÷ 99</b>。`),
          Q(g1.recToFrac), Q(g1.recToFrac),
          ex(`如果小數點後<b>先有幾位不循環</b>(如 $0.1\\overline{6}$),就要乘兩次:先乘 10 讓循環開始,再乘 100 讓下一輪對齊,相減。`),
          Q(g1.recMixed), Q(g1.recMixed)
        ] },
      { id: 'c1s1l4', icon: '📏', title: '📏 根號與數線上的大小', learned: '比較根號的大小,可以比平方;估計根號的值,可以夾在兩個連續整數的平方之間。',
        steps: [
          ex(`無理數在數線上也有位置!要怎麼估 $\\sqrt{10}$ 在哪裡?<br>
              $3^2 = 9$、$4^2 = 16$,而 $9 < 10 < 16$,所以 $3 < \\sqrt{10} < 4$,大約 3.16。<br>
              技巧:<b>找兩個連續整數,它們的平方把這個數夾在中間</b>。`),
          Q(g1.sqrtBetween), Q(g1.sqrtBetween),
          ex(`要比較 $\\sqrt{7}$ 和 $2.6$ 誰大?兩個正數,<b>比平方</b>就好:$\\sqrt{7}^2 = 7$、$2.6^2 = 6.76$,7 比較大,所以 $\\sqrt{7}$ 比較大。`),
          Q(g1.cmpSqrt), Q(g1.cmpSqrt), Q(g1.cmpSqrt), Q(g1.sqrtBetween)
        ] }
    ] },
    { id: 'c1s2', title: '② 絕對值', levels: [
      { id: 'c1s2l1', icon: '📐', title: '📐 什麼是絕對值', learned: '絕對值是「到 0 的距離」,所以永遠不是負的:正數的絕對值是自己,負數的絕對值是它的相反數。',
        steps: [
          ex(`<b>絕對值</b>記作 $|a|$,意思是「$a$ 這個點到 0 的<b>距離</b>」。<br>
              距離不會是負的,所以:$|5| = 5$、$|-5| = 5$、$|0| = 0$。<br>
              口訣:<b>正的不變,負的變正</b>。`),
          Q(g1.absVal), Q(g1.absVal),
          ex(`有算式的時候,<b>先算絕對值裡面,再取絕對值</b>。<br>
              注意負號的位置:$-|5| = -5$(負號在外面,最後才加上去)。`),
          Q(g1.absVal), Q(g1.absVal), Q(g1.absVal)
        ] },
      { id: 'c1s2l2', icon: '↔️', title: '↔️ 絕對值就是距離', learned: '|a − b| 是數線上 a、b 兩點之間的距離;|x − a| 就是 x 到 a 的距離。',
        steps: [
          ex(`絕對值最重要的意義:<b>$|a - b|$ = 數線上 $a$ 和 $b$ 兩點的距離</b>。<br>
              拖拖看:藍點是 $a$,紅點是 $x$,$|x - a|$ 就是它們中間隔了幾格。`, 'absdist'),
          Q(g1.dist), Q(g1.dist),
          ex(`所以 $|x - 3|$ 讀成「<b>$x$ 到 3 的距離</b>」,$|x + 2|$ 可以改寫成 $|x - (-2)|$,讀成「x 到 $-2$ 的距離」。<br>
              不管誰減誰,距離都一樣:$|a - b| = |b - a|$。`),
          Q(g1.dist), Q(g1.absVal), Q(g1.dist)
        ] },
      { id: 'c1s2l3', icon: '🎯', title: '🎯 解絕對值方程式', learned: '|x − a| = b(b > 0)有兩個解:x = a − b 或 x = a + b;b = 0 只有一個解;b < 0 無解。',
        steps: [
          ex(`$|x - 3| = 2$ 的意思是:<b>$x$ 到 3 的距離是 2</b>。<br>
              從 3 出發,向左走 2 步到 $1$,向右走 2 步到 $5$,所以 $x = 1$ 或 $x = 5$。<br>
              一般來說:$|x - a| = b$ 的解是 $x = a - b$ 或 $x = a + b$(當 $b > 0$)。`),
          Q(g1.absEq), Q(g1.absEq),
          ex(`特別的情況:距離不可能是負的,所以 $|x - 3| = -2$ <b>無解</b>;距離是 0 的點只有一個,所以 $|x - 3| = 0$ 只有 $x = 3$。`),
          Q(g1.absNoSol), Q(g1.absNoSol),
          ex(`裡面不是單純的 $x - a$ 時,就分成兩種情況:裡面的東西等於 $+b$ 或 $-b$。<br>
              例:$|2x - 4| = 6$ → $2x - 4 = 6$ 或 $2x - 4 = -6$ → $x = 5$ 或 $x = -1$。`),
          Q(g1.absEq2), Q(g1.absEq2), Q(g1.absEq)
        ] },
      { id: 'c1s2l4', icon: '🚧', title: '🚧 絕對值不等式與誤差', learned: '|x − a| < b 表示 a − b < x < a + b(以內);|x − a| > b 表示 x < a − b 或 x > a + b(以外)。',
        steps: [
          ex(`距離「小於」某個數 → 在範圍<b>以內</b>:<br>
              $|x - 3| < 2$:x 到 3 的距離小於 2 → $1 < x < 5$(一整段)。<br>
              距離「大於」某個數 → 在範圍<b>以外</b>:<br>
              $|x - 3| > 2$:x 到 3 的距離大於 2 → $x < 1$ 或 $x > 5$(兩段)。`),
          Q(g1.absLess), Q(g1.absLess), Q(g1.absGreater), Q(g1.absGreater),
          ex(`絕對值不等式在生活中最常用在<b>誤差</b>:「規定值為 $L$,誤差不超過 $e$」就是 $|x - L| \\le e$,也就是 $L - e \\le x \\le L + e$。<br>
              有「等於」的時候,端點也算。`),
          Q(g1.tolerance), Q(g1.tolerance), Q(g1.intCount), Q(g1.intCount)
        ] }
    ] },
    { id: 'c1s3', title: '③ 式的運算', levels: [
      { id: 'c1s3l1', icon: '🧊', title: '🧊 三次的乘法公式', learned: '$(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$;$a^3 + b^3 = (a+b)(a^2 - ab + b^2)$;$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$。',
        steps: [
          ex(`序章學過的平方公式,有「立方版」:<br>
              $(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$<br>
              $(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$<br>
              係數 1、3、3、1,正負號看 $b$ 是正還是負。`),
          Q(g1.cube), Q(g1.cube),
          ex(`還有兩個因式分解用的公式:<br>
              $a^3 + b^3 = (a+b)(a^2 - ab + b^2)$<br>$a^3 - b^3 = (a-b)(a^2 + ab + b^2)$<br>
              把 $b$ 當成「可以是負的」,兩條其實是同一個公式。`),
          Q(g1.cubeSum), Q(g1.cubeSum),
          ex(`公式也可以用來「<b>整體代換</b>」:已知 $a + b$ 和 $ab$,不用知道 $a$、$b$ 是多少,就能算 $a^2 + b^2$ 等。<br>
              關鍵:$a^2 + b^2 = (a+b)^2 - 2ab$。`),
          Q(g1.sumSq), Q(g1.sumSq)
        ] },
      { id: 'c1s3l2', icon: '√', title: '√ 根式的化簡與加減乘', learned: '根號裡的完全平方因數可以搬到外面;根號部分相同才能加減(像同類項);√a × √b = √(ab)。',
        steps: [
          ex(`<b>化簡根號</b>:把根號裡的數拆成「完全平方數 × 別的數」,完全平方的部分開出來。<br>
              $\\sqrt{12} = \\sqrt{4\\times3} = 2\\sqrt{3}$、$\\sqrt{72} = \\sqrt{36\\times2} = 6\\sqrt{2}$。<br>
              目標:根號裡面的數盡量小。`),
          Q(g1.radSimp), Q(g1.radSimp),
          ex(`<b>加減</b>:根號部分一樣,才能像同類項一樣合併。<br>
              $3\\sqrt{2} + 5\\sqrt{2} = 8\\sqrt{2}$;但 $\\sqrt{2} + \\sqrt{3}$ 不能合併。<br>
              所以遇到 $\\sqrt{12} + \\sqrt{27}$,要先化簡:$2\\sqrt{3} + 3\\sqrt{3} = 5\\sqrt{3}$。`),
          Q(g1.radAdd), Q(g1.radAdd2),
          ex(`<b>乘法</b>:$\\sqrt{a}\\times\\sqrt{b} = \\sqrt{ab}$。<br>例:$\\sqrt{2}\\times\\sqrt{8} = \\sqrt{16} = 4$。`),
          Q(g1.radMul), Q(g1.radMul), Q(g1.radAdd2)
        ] },
      { id: 'c1s3l3', icon: '🪄', title: '🪄 分母有理化', learned: '分母有根號時,同乘根號(或共軛)讓分母變成整數;共軛相乘用平方差公式。',
        steps: [
          ex(`分母有根號很難看,數學家喜歡把它「搬走」,這叫<b>有理化</b>。<br>
              分母是單一根號:上下同乘那個根號。<br>
              $\\frac{6}{\\sqrt{3}} = \\frac{6\\times\\sqrt{3}}{\\sqrt{3}\\times\\sqrt{3}} = \\frac{6\\sqrt{3}}{3} = 2\\sqrt{3}$。`),
          Q(g1.rationalMono), Q(g1.rationalMono),
          ex(`分母是 $\\sqrt{a} - b$ 這種「根號 ± 數」時,用<b>共軛</b>($\\sqrt{a} + b$)來乘,配合平方差公式:<br>
              $(\\sqrt{a} + b)(\\sqrt{a} - b) = a - b^2$,根號就消失了!`),
          Q(g1.conj), Q(g1.conj),
          ex(`例:$\\frac{1}{\\sqrt{5} - 2}$,上下同乘 $\\sqrt{5} + 2$:分母 $= 5 - 4 = 1$,結果是 $\\sqrt{5} + 2$。`),
          Q(g1.rationalBin), Q(g1.rationalBin), Q(g1.rationalMono)
        ] },
      { id: 'c1s3l4', icon: '➗', title: '➗ 分式的約分與運算', learned: '分式要先因式分解再約分;分母相同,分子直接加減(減的要整個變號)。',
        steps: [
          ex(`分式 = 多項式 ÷ 多項式。化簡的核心:<b>先因式分解,再把上下相同的因式約掉</b>。<br>
              例:$\\frac{x^2 - 9}{x - 3} = \\frac{(x-3)(x+3)}{x-3} = x + 3$。(分母不能為 0,所以 $x \\ne 3$。)`),
          Q(g1.fracSimp), Q(g1.fracSimp),
          ex(`<b>分母相同</b>的加減,分母不動,分子直接加減。<br>
              減的時候,<b>第二個分子要整個加括號</b>再變號:$\\frac{3x+1}{x-2} - \\frac{x+5}{x-2} = \\frac{3x+1-(x+5)}{x-2} = \\frac{2x-4}{x-2} = 2$。`),
          Q(g1.fracSame), Q(g1.fracSame),
          ex(`<b>乘法</b>:分子乘分子、分母乘分母,過程中能約的先約。`),
          Q(g1.fracMul), Q(g1.fracMul), Q(g1.fracSimp)
        ] },
      { id: 'c1s3l5', icon: '⚖️', title: '⚖️ 算幾不等式', learned: '兩個正數的算術平均數 ≥ 幾何平均數:(a+b)/2 ≥ √(ab),當 a = b 時等號成立;可用來求最大、最小值。',
        steps: [
          ex(`對兩個<b>正數</b> $a$、$b$,有一個重要的不等式:<br>
              $$\\frac{a+b}{2} \\ge \\sqrt{ab}$$<br>
              左邊叫<b>算術平均數</b>,右邊叫<b>幾何平均數</b>。只有 $a = b$ 的時候,兩邊才相等。<br>
              小例子:$a=1$、$b=9$:左邊 $5$,右邊 $3$。`),
          Q(g1.amgmMax), Q(g1.amgmMax),
          ex(`整理成兩個好用的結論:<br>
              ① <b>和一定,積最大</b>:$a + b = S$ → $ab \\le \\left(\\frac{S}{2}\\right)^2$(當 $a=b$)。<br>
              ② <b>積一定,和最小</b>:$ab = P$ → $a + b \\ge 2\\sqrt{P}$(當 $a=b$)。<br>
              用的時候要記得:數必須是<b>正數</b>!`),
          Q(g1.amgmMin), Q(g1.amgmMin), Q(g1.amgmMax), Q(g1.amgmMin)
        ] }
    ] },
    { id: 'c1s4', title: '④ 指數', levels: [
      { id: 'c1s4l1', icon: '🔋', title: '🔋 零次方與負指數', learned: '$a^0 = 1$;$a^{-n} = \\frac{1}{a^n}$(負指數就是倒數);括號會影響負號:$(-2)^4 = 16$,$-2^4 = -16$。',
        steps: [
          ex(`$a^n$ 表示 $n$ 個 $a$ 連乘。小心<b>括號</b>:<br>
              $(-2)^4 = (-2)(-2)(-2)(-2) = 16$,但 $-2^4 = -(2\\times2\\times2\\times2) = -16$。`),
          Q(g1.signPow), Q(g1.signPow),
          ex(`新的規定:<br>
              ① <b>零次方</b>:$a^0 = 1$($a \\ne 0$)。<br>
              ② <b>負指數</b>:$a^{-n} = \\frac{1}{a^n}$,例 $2^{-3} = \\frac{1}{8}$。<br>
              為什麼?因為每少一次 $\\times 2$ 就是 $\\div 2$:$2^3 = 8$、$2^2 = 4$、$2^1 = 2$、$2^0 = 1$、$2^{-1} = \\frac{1}{2}$……`),
          Q(g1.zeroExp), Q(g1.negExp), Q(g1.negExp), Q(g1.negExp)
        ] },
      { id: 'c1s4l2', icon: '⚙️', title: '⚙️ 指數律', learned: '同底相乘指數加、相除指數減、次方再次方指數乘:$a^m a^n = a^{m+n}$,$a^m \\div a^n = a^{m-n}$,$(a^m)^n = a^{mn}$。',
        steps: [
          ex(`三條指數律(底數相同時):<br>
              ① $a^m \\times a^n = a^{m+n}$(乘 → 指數加)<br>
              ② $\\frac{a^m}{a^n} = a^{m-n}$(除 → 指數減)<br>
              ③ $(a^m)^n = a^{mn}$(次方再次方 → 指數乘)<br>
              指數可以是負的,規則照樣適用。`),
          Q(g1.lawMul), Q(g1.lawMul), Q(g1.lawDiv), Q(g1.lawDiv),
          ex(`再練一下「次方再次方」,然後挑戰把三條律<b>混在一起</b>用。`),
          Q(g1.lawPow), Q(g1.lawPow), Q(g1.lawMix)
        ] },
      { id: 'c1s4l3', icon: '🌱', title: '🌱 分數指數', learned: '$a^{\\frac{1}{n}}$ 是 $a$ 的 $n$ 次方根;$a^{\\frac{m}{n}} = (a^{\\frac{1}{n}})^m$;指數律對分數指數同樣成立。',
        steps: [
          ex(`指數還可以是分數!規定:$a^{\\frac{1}{n}}$ 是「<b>$n$ 次方根</b>」。<br>
              $4^{\\frac{1}{2}} = 2$(因為 $2^2 = 4$)、$8^{\\frac{1}{3}} = 2$(因為 $2^3 = 8$)。<br>
              一般:$a^{\\frac{m}{n}} = \\left(a^{\\frac{1}{n}}\\right)^m$,先開根、再取次方。`),
          Q(g1.fracExp), Q(g1.fracExp), Q(g1.fracExp),
          ex(`做法小技巧:先把底數寫成「某數的 $n$ 次方」(如 $27 = 3^3$),用 $\\left(3^3\\right)^{\\frac{2}{3}} = 3^{3\\times\\frac{2}{3}} = 3^2$ 一步到位。<br>
              負的分數指數:先處理負號(倒數),再處理分數。`),
          Q(g1.fracExp), Q(g1.fracExp), Q(g1.lawMix)
        ] },
      { id: 'c1s4l4', icon: '📊', title: '📊 指數的大小比較', learned: '底數大於 1,指數越大值越大;底數介於 0 和 1,指數越大值越小;底數不同時,想辦法把指數化成一樣再比。',
        steps: [
          ex(`比較 $a^m$ 和 $a^n$ 的大小,看<b>底數</b>:<br>
              底數 $> 1$(如 2):指數越大,值越大。$2^5 > 2^3$。<br>
              底數 $0 < a < 1$(如 $\\frac{1}{2}$):指數越大,值越小。$\\left(\\frac{1}{2}\\right)^5 < \\left(\\frac{1}{2}\\right)^3$。`),
          Q(g1.cmpBase), Q(g1.cmpBase),
          ex(`<b>底數不同</b>怎麼比?把指數化成一樣!例如 $2^{30}$ 和 $3^{20}$:<br>
              $2^{30} = (2^3)^{10} = 8^{10}$,$3^{20} = (3^2)^{10} = 9^{10}$,指數相同,比底數:$8 < 9$,所以 $3^{20}$ 比較大。`),
          Q(g1.cmpExp), Q(g1.cmpExp), Q(g1.cmpExp), Q(g1.cmpBase)
        ] }
    ] },
    { id: 'c1s5', title: '⑤ 科學記號與有效位數', levels: [
      { id: 'c1s5l1', icon: '🔭', title: '🔭 科學記號的寫法', learned: '科學記號寫成 $a\\times10^n$,其中 $1 \\le a < 10$、$n$ 是整數;大數 n 為正、小數 n 為負。',
        steps: [
          ex(`太大或太小的數,寫起來很累(光速約 300000000 公尺/秒)。<b>科學記號</b>把它們寫成:<br>
              $$a\\times10^n,\\quad 1 \\le a < 10$$
              光速 $= 3\\times10^8$。拖拖看,小數點怎麼隨著 $n$ 搬家:`, 'sci'),
          Q(g1.sciValid), Q(g1.sciExp), Q(g1.sciExp),
          ex(`<b>怎麼判斷 n?</b>把小數點移到第一個非零數字後面,<b>移了幾位,n 的絕對值就是幾</b>:<br>
              大數(往左移)→ n 是正的;小於 1 的數(往右移)→ n 是負的。<br>
              例:$0.00045 = 4.5\\times10^{-4}$。`),
          Q(g1.sciExp), Q(g1.sciBack), Q(g1.sciBack)
        ] },
      { id: 'c1s5l2', icon: '✖️', title: '✖️ 科學記號的運算', learned: '乘法:係數乘係數、10 的次方相加;除法:係數除係數、次方相減;結果的係數要調回 1 到 10 之間。',
        steps: [
          ex(`科學記號相乘:<b>係數乘係數,10 的次方用指數律相加</b>。<br>
              $(2\\times10^3)\\times(3\\times10^4) = 6\\times10^7$。<br>
              如果係數乘出來 $\\ge 10$,要再調整:$(4\\times10^3)(5\\times10^4) = 20\\times10^7 = 2\\times10^8$。`),
          Q(g1.sciMul), Q(g1.sciMul), Q(g1.sciMul),
          ex(`相除:<b>係數除係數,10 的次方相減</b>。<br>
              $\\frac{6\\times10^8}{2\\times10^3} = 3\\times10^5$。`),
          Q(g1.sciDiv), Q(g1.sciDiv), Q(g1.sciMul)
        ] },
      { id: 'c1s5l3', icon: '🎚️', title: '🎚️ 有效位數與四捨五入', learned: '有效數字從第一個非零數字算起,到最後一位(小數點後末尾的 0 也算);四捨五入到 k 位有效數字,看第 k+1 位。',
        steps: [
          ex(`量出來的數字有「可信的位數」,叫<b>有效數字</b>。算法:<br>
              從<b>第一個不是 0 的數字</b>開始,一路數到最後。前面的 0 只是在標位置,不算。<br>
              例:$0.00450$ 有 3 位有效數字(4、5、<b>0</b> 都算,因為最後的 0 是量出來的);$3.20\\times10^5$ 也是 3 位。`),
          Q(g1.sigCount), Q(g1.sigCount), Q(g1.sigCount),
          ex(`<b>四捨五入到 $k$ 位有效數字</b>:數到第 $k$ 位,看第 $k+1$ 位,$\\ge 5$ 進位、$< 5$ 捨去。<br>
              例:$3.14159$ 取 3 位有效數字 → 看第 4 位 1,捨去,得 $3.14$。<br>
              計算機的答案常有一長串數字,但原始資料只有幾位有效,答案也只該有那麼多位。`),
          Q(g1.sigRound), Q(g1.sigRound), Q(g1.sigRound)
        ] }
    ] },
    { id: 'c1s6', title: '⑥ 常用對數', levels: [
      { id: 'c1s6l1', icon: '🔟', title: '🔟 對數:10 的次方的反向', learned: '$\\log x = k$ 就是 $x = 10^k$;$\\log$ 是在問「10 的幾次方等於它」。',
        steps: [
          ex(`指數問的是:「10 的 3 次方是多少?」→ $10^3 = 1000$。<br>
              <b>對數</b>反過來問:「1000 是 10 的幾次方?」→ 答案是 3,寫成 $\\log 1000 = 3$。<br>
              所以 $\\log x = k$ 和 $x = 10^k$ 說的是同一件事(這裡的 $\\log$ 底數是 10,叫<b>常用對數</b>)。`),
          Q(g1.logPow), Q(g1.logPow), Q(g1.logPow),
          ex(`$x$ 不一定是整數次方:$\\sqrt{10} = 10^{\\frac{1}{2}}$,所以 $\\log\\sqrt{10} = \\frac{1}{2}$。<br>
              再看反過來:已知 $\\log x = k$,就直接寫 $x = 10^k$。`),
          Q(g1.logRoot), Q(g1.logInv), Q(g1.logInv)
        ] },
      { id: 'c1s6l2', icon: '🧮', title: '🧮 對數律', learned: '$\\log(ab) = \\log a + \\log b$;$\\log\\frac{a}{b} = \\log a - \\log b$;$\\log a^k = k\\log a$。',
        steps: [
          ex(`指數律「乘 → 加」搬到對數,就成了對數律(a、b 都是正數):<br>
              ① $\\log(ab) = \\log a + \\log b$<br>
              ② $\\log\\frac{a}{b} = \\log a - \\log b$<br>
              ③ $\\log a^k = k\\log a$<br>
              小心陷阱:$\\log(a+b)$ <b>不能</b>拆成 $\\log a + \\log b$!`),
          Q(g1.logLaw), Q(g1.logLaw),
          ex(`有了這些律,只要知道 $\\log 2 \\approx 0.3010$、$\\log 3 \\approx 0.4771$,就能算出一大堆數的對數!<br>
              例:$\\log 6 = \\log 2 + \\log 3 = 0.7781$。<br>
              $\\log 5$ 怎麼來?$5 = \\frac{10}{2}$,所以 $\\log 5 = 1 - \\log 2 = 0.6990$。`),
          Q(g1.logOf), Q(g1.logOf), Q(g1.logOf), Q(g1.logOf)
        ] },
      { id: 'c1s6l3', icon: '🔍', title: '🔍 首數、尾數與位數', learned: '$\\log N$ 的整數部分叫首數,小數部分叫尾數;$N$ 的整數部分有 (首數 + 1) 位;可用來估計大數的位數。',
        steps: [
          ex(`$\\log N$ 的<b>整數部分</b>叫<b>首數</b>,<b>小數部分</b>叫<b>尾數</b>(介於 0 和 1)。<br>
              如果 $\\log N = 4.7$,那 $N = 10^{4.7}$ 介於 $10^4 = 10000$ 和 $10^5 = 100000$ 之間,所以 $N$ 是 <b>5 位數</b>。<br>
              規則:<b>位數 = 首數 + 1</b>。`),
          Q(g1.digitsFromLog), Q(g1.digitsFromLog),
          ex(`對於小於 1 的小數:$\\log x = -3.7 = -4 + 0.3$,所以 $x$ 介於 $10^{-4}$ 和 $10^{-3}$ 之間,第一個非零數字在<b>小數第 4 位</b>。<br>
              記得先把它寫成「負整數 + 正小數」。`),
          Q(g1.decimalFromLog),
          ex(`最厲害的應用:<b>估計超大數的位數</b>。$2^{100}$ 有幾位?<br>
              $\\log 2^{100} = 100\\times0.3010 = 30.10$,首數 30,所以是 <b>31 位數</b>!(不用真的算出來)`),
          Q(g1.digitsPow), Q(g1.digitsPow), Q(g1.digitsPow)
        ] },
      { id: 'c1s6l4', icon: '🕵️', title: '🕵️ 小數第一位與解指數', learned: '$(\\frac{1}{a})^n$ 的第一個非零位置可用 $\\log$ 求;解 $a^x = b$ 就兩邊取 $\\log$:$x = \\frac{\\log b}{\\log a}$。',
        steps: [
          ex(`很小的數也可以用 $\\log$ 找位置。例:$\\left(\\frac{1}{2}\\right)^{20}$ 的 $\\log = -20\\times0.3010 = -6.02 = -7 + 0.98$,所以小數第 <b>7</b> 位才出現不是 0 的數字。<br>
              捷徑:位置就是 $2^{20}$ 的位數!`),
          Q(g1.decimalPos), Q(g1.decimalPos),
          ex(`<b>解指數方程式</b>:$2^x = 100$,想知道 $x$,兩邊取 $\\log$:<br>
              $x\\log 2 = \\log 100 = 2$,所以 $x = \\frac{2}{\\log 2} \\approx \\frac{2}{0.3010} \\approx 6.6$。`),
          Q(g1.expSolve), Q(g1.expSolve), Q(g1.expSolve), Q(g1.decimalPos)
        ] }
    ] },
    // Boss 關:混合第 0~1 章。三個回合,講解頁的小劇情只有文字
    { id: 'c1boss', title: '⑦ Boss:音石明', levels: [
      { id: 'c1bossl1', icon: '⚡', title: '⚡ Boss:音石明',
        learned: '第 1 章全部通過!你已經會:實數、絕對值、式的運算、指數、科學記號、常用對數。',
        steps: [
          ex(`電線嗡嗡作響,音石明的聲音從插座裡傳出來:「我已經化成<b>電流</b>了,你們抓不到我!」<br>
              ⚔️ <b>第一回合:電流的大數字</b>(科學記號、指數)——電力的數值大到要用科學記號才寫得下!`, null, '⚡'),
          Q(g1.sciMul), Q(g1.lawMix),
          ex(`電流沿著電線亂竄,忽左忽右。<br>
              ⚔️ <b>第二回合:電線上的追逐</b>(絕對值、根號、因式分解)——預測他的位置,別讓他溜走!`, null, '⚡'),
          Q(g1.absEq), Q(g1.radSimp), Q(genF.cross),
          ex(`音石躲進了超大的電塔,位置難以估計。<br>
              ⚔️ <b>第三回合:縮短距離</b>(常用對數)——用 $\\log$ 把巨大的數縮小,算出他的位數!`, null, '⚡'),
          Q(g1.digitsPow), Q(g1.logOf),
          ex(`最後一擊!音石明想把所有電力集中起來反擊——但只要算出<b>最小值</b>,就能在他用盡力氣之前拿下他!`, null, '⚡'),
          Q(g1.amgmMin)
        ] }
    ] }
  ]
});
