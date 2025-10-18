/* dokkai.js
   - Meng-handle loading tema, teks, 5 soal, scoring dan menyimpan hasil ke localStorage
*/

(() => {
  // ----- DATA: tiap tema punya teks dan 5 soal (jawaban index 0/1/2)
  const DATA = {
    makan: {
      title: "Makan — ラーメンの思い出",
      story: `ラーメン屋での小さな出来事を読むテキスト。太郎は新しいラーメンを食べ、店主と話をしました。最後に彼は...`,
      questions: [
        { q: "太郎は何を食べましたか？", choices: ["ラーメン","そば","寿司"], answer: 0 },
        { q: "店主と太郎は何をしましたか？", choices: ["話した","走った","勉強した"], answer: 0 },
        { q: "テキストの最後で太郎はどうしましたか？", choices: ["満足した","悲しくなった","眠った"], answer: 0 },
        { q: "太郎はどこで食べましたか？", choices: ["店で","家で","公園で"], answer: 0 },
        { q: "テキストはどんな雰囲気ですか？", choices: ["暖かい","怖い","冷たい"], answer: 0 }
      ]
    },
    belanja: {
      title: "Belanja — スーパーの一日",
      story: `今日は買い物の話。花子はスーパーで特売を見つけて喜びました。...`,
      questions: [
        { q: "花子はどこへ行きましたか？", choices: ["スーパー","図書館","学校"], answer: 0 },
        { q: "花子は何を見つけましたか？", choices: ["特売","友達","犬"], answer: 0 },
        { q: "花子の気持ちは？", choices: ["嬉しい","悲しい","退屈"], answer: 0 },
        { q: "話は何についてですか？", choices: ["買い物","旅行","勉強"], answer: 0 },
        { q: "花子は最終的にどうしましたか？", choices: ["買った","立ち去った","忘れた"], answer: 0 }
      ]
    },
    hokkaido: {
      title: "Tentang Hokkaido",
      story: `北海道人々の風景や食べ物の紹介。自然や海産物が豊かです。`,
      questions: [
        { q: "北海道は何で有名ですか？", choices: ["自然","砂漠","都会"], answer: 0 },
        { q: "何が豊かですか？", choices: ["海産物","石油","金"], answer: 0 },
        { q: "人々は何をするのが好き？", choices: ["観光","鉱山","採掘"], answer: 0 },
        { q: "気候は？", choices: ["寒い","非常に暑い","乾燥"], answer: 0 },
        { q: "これはどこについてのテキストですか？", choices: ["北海道","沖縄","東京"], answer: 0 }
      ]
    },
    "gedung-seni": {
      title: "Gedung Seni",
      story: `美術館の展示の説明文。作品は色鮮やかで訪問者は感動しました。`,
      questions: [
        { q: "どこが舞台ですか？", choices: ["美術館","駅","市場"], answer: 0 },
        { q: "訪問者の反応は？", choices: ["感動した","無関心だった","怒った"], answer: 0 },
        { q: "作品はどうでしたか？", choices: ["色鮮やか","黒白","見えない"], answer: 0 },
        { q: "主題は何ですか？", choices: ["芸術","料理","スポーツ"], answer: 0 },
        { q: "人々はどこに訪れましたか？", choices: ["展示","海","山"], answer: 0 }
      ]
    },
    olahraga: {
      title: "Olahraga",
      story: `今日の運動会で学生たちはチームワークを学びました。勝っても負けても笑顔でした。`,
      questions: [
        { q: "何のイベントですか？", choices: ["運動会","映画","試験"], answer: 0 },
        { q: "学生たちは何を学んだ？", choices: ["チームワーク","数学","歴史"], answer: 0 },
        { q: "結果はどうでしたか？", choices: ["笑顔","悲劇","混乱"], answer: 0 },
        { q: "イベントの様子は？", choices: ["楽しい","退屈","静か"], answer: 0 },
        { q: "これはどこで起きましたか？", choices: ["学校","レストラン","図書館"], answer: 0 }
      ]
    }
  };

  // ----- helper: get query param
  function getParam(key){
    return new URLSearchParams(location.search).get(key);
  }

  // ----- DOM refs
  const themeKey = getParam('tema') || 'makan';
  const temaTitle = document.getElementById('temaTitle');
  const storyBox = document.getElementById('storyBox');
  const qIndex = document.getElementById('qIndex');
  const qText = document.getElementById('qText');
  const optionsEl = document.getElementById('options');
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  const playerNameInput = document.getElementById('playerName');

  // state
  let current = 0;
  let answers = []; // store selected index per question

  // load theme
  const theme = DATA[themeKey] || DATA['makan'];
  temaTitle.textContent = theme.title;
  storyBox.textContent = theme.story;

  // render question
  function renderQuestion(){
    const item = theme.questions[current];
    qIndex.textContent = `Soal ${current + 1} dari ${theme.questions.length}`;
    qText.textContent = item.q;
    optionsEl.innerHTML = '';
    item.choices.forEach((c, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<strong>${String.fromCharCode(65 + i)}.</strong> &nbsp; ${c}`;
      btn.onclick = () => selectOption(i, btn);
      // highlight selected
      if (answers[current] === i) btn.style.borderColor = 'rgba(107,17,51,0.45)';
      optionsEl.appendChild(btn);
    });

    prevBtn.disabled = current === 0;
    nextBtn.textContent = (current === theme.questions.length - 1) ? 'Selesai' : 'Lanjut';
  }

  function selectOption(index, btn){
    answers[current] = index;
    // re-render to update highlights
    renderQuestion();
  }

  nextBtn.addEventListener('click', () => {
    if (!playerNameInput.value.trim()){
      alert('Masukkan nama terlebih dahulu pada kotak Nama.');
      playerNameInput.focus();
      return;
    }
    // require choose before proceeding
    if (answers[current] === undefined){
      const proceed = confirm('Kamu belum memilih jawaban untuk soal ini. Lanjutkan tanpa memilih?');
      if (!proceed) return;
    }
    if (current < theme.questions.length - 1){
      current++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (current > 0){ current--; renderQuestion(); }
  });

 const API_URL = "https://script.google.com/macros/s/AKfycbzq47PujMyZZIrGe2_yy6H3DjjVESw2z7961QJCh7VohlnmoG3YHuHHlfhtwF6zXVWVOw/exec";

function finishQuiz(){
  let score = 0;
  theme.questions.forEach((it, idx) => {
    if (answers[idx] === it.answer) score++;
  });
  const player = playerNameInput.value.trim();

  // Kirim ke Google Sheets
  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: player,
      theme: themeKey,
      score: score
    })
  })
  .then(res => res.json())
  .then(() => {
    alert(`Selesai, ${player}! Skor kamu: ${score}`);
    location.href = "scoreboard.html";
  })
  .catch(err => {
    alert("Gagal mengirim skor! Periksa koneksi.");
    console.error(err);
  });
}


  // init
  renderQuestion();

})();
