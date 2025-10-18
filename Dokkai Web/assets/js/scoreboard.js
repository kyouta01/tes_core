const API_URL = "https://script.google.com/macros/s/AKfycbzq47PujMyZZIrGe2_yy6H3DjjVESw2z7961QJCh7VohlnmoG3YHuHHlfhtwF6zXVWVOw/exec";

const listEl = document.getElementById('scoreList');
const emptyMsg = document.getElementById('emptyMsg');

function loadScores(){
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      if (data.length === 0){
        emptyMsg.style.display = "block";
        return;
      }
      emptyMsg.style.display = "none";

      // Sort skor tertinggi dulu
      data.sort((a,b) => b.score - a.score);

      listEl.innerHTML = "";
      data.forEach((item, i) => {
        const li = document.createElement("li");
        li.className = "score-item";
        li.innerHTML = `
          <div><strong>${i+1}. ${item.name}</strong> (${item.theme})</div>
          <div><strong>${item.score}</strong>/5</div>
        `;
        listEl.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      emptyMsg.textContent = "Gagal memuat data dari server!";
      emptyMsg.style.display = "block";
    });
}

loadScores();
