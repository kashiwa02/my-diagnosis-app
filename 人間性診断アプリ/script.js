const questions=[
{ text:"人の失敗を見た時、正直どう思う？", choices:[
{ text:"安心する", effects:{闇深度:10} },
{ text:"何も思わない", effects:{} },
{ text:"助けたくなる", effects:{社交性:10} }
]},
{ text:"誰にも見られてないならルール破る？", choices:[
{ text:"破る", effects:{狂気:15} },
{ text:"状況による", effects:{} },
{ text:"守る", effects:{理性:10} }
]},
{ text:"本気で怒った時の自分は？", choices:[
{ text:"制御できない", effects:{狂気:15} },
{ text:"ある程度抑える", effects:{} },
{ text:"冷静", effects:{ストレス耐性:10} }
]},
{ text:"孤独についてどう思う？", choices:[
{ text:"心地いい", effects:{闇深度:10,知性:5} },
{ text:"普通", effects:{} },
{ text:"無理", effects:{社交性:10} }
]},
{ text:"直感で動くことは？", choices:[
{ text:"多い", effects:{隠れた才能:10,狂気:5} },
{ text:"たまに", effects:{} },
{ text:"ほぼない", effects:{} }
]},
{ text:"人に裏切られたら？", choices:[
{ text:"仕返し考える", effects:{闇深度:15} },
{ text:"距離置く", effects:{} },
{ text:"気にしない", effects:{ストレス耐性:10} }
]},
{ text:"自分は普通だと思う？", choices:[
{ text:"思わない", effects:{狂気:10} },
{ text:"たぶん普通", effects:{} },
{ text:"普通でいたい", effects:{社交性:10} }
]},
{ text:"リスクを取るタイプ？", choices:[
{ text:"取る", effects:{行動力:10} },
{ text:"状況次第", effects:{} },
{ text:"取らない", effects:{} }
]},
{ text:"一番怖いのは？", choices:[
{ text:"孤独", effects:{闇深度:10} },
{ text:"失敗", effects:{} },
{ text:"退屈", effects:{狂気:5} }
]},
{ text:"自分の中に“別の自分”を感じる？", choices:[
{ text:"よくある", effects:{闇深度:10,狂気:5} },
{ text:"たまに", effects:{} },
{ text:"ない", effects:{} }
]}];

let current=0, selected=null;
let stats={知性:0,社交性:0,行動力:0,ストレス耐性:0,狂気:0,闇深度:0,隠れた才能:0,理性:0};

function updateProgress(){
  const pct=Math.floor((current/questions.length)*100);
  document.getElementById("progressBar").style.width=pct+"%";
  document.getElementById("progressText").innerText=`質問 ${current+1}/${questions.length}`;
}

function showQuestion(){
  const q=questions[current];
  const questionBox=document.getElementById("questionBox");
  questionBox.style.opacity=0;
  setTimeout(()=>{
    document.getElementById("question").innerText=q.text;
    let html="";
    q.choices.forEach((c,i)=>html+=`<button class="choice-btn" onclick="select(${i},this)">${c.text}</button>`);
    document.getElementById("choices").innerHTML=html;
    document.getElementById("nextBtn").classList.remove("active");
    questionBox.style.opacity=1;
  },200);
  updateProgress();
}

function select(i,el){
  selected=i;
  document.querySelectorAll(".choice-btn").forEach(btn=>btn.classList.remove("selected"));
  el.classList.add("selected");
  document.getElementById("nextBtn").classList.add("active");
}

function next(){
  if(selected===null) return;
  const effects=questions[current].choices[selected].effects;
  for(let key in effects) stats[key]+=effects[key];
  selected=null;
  current++;
  if(current<questions.length) showQuestion();
  else showResult();
}

function getRank(avg){
  if(avg>80) return"S";
  if(avg>65) return"A";
  if(avg>50) return"B";
  if(avg>35) return"C";
  return"D";
}

function getComment(s){
  if(s["狂気"]>80||s["闇深度"]>80)
    return"あなたの内面は常人を超える狂気と闇を秘めています。周囲が気づかない力が潜む…";
  if(s["狂気"]>60)
    return"普通ではない思考パターンを持っています。人はあなたの本質を理解できないかも…";
  if(s["社交性"]>70)
    return"周囲の信頼を集め、人を惹きつける魅力があります。";
  return"知性・行動力・社交性・才能がバランスよく整った、希少なタイプです。";
}

function showResult(){
  document.getElementById("questionBox").classList.add("hidden");
  document.getElementById("progressContainer").classList.add("hidden");
  const box=document.getElementById("resultBox");
  box.classList.remove("hidden");
  let total=0,html="<h2>診断結果</h2>";
  for(let key in stats){
    total+=stats[key];
    let cls="";
    if(key==="狂気"&&stats[key]>70) cls="high";
    if(key==="闇深度"&&stats[key]>70) cls="dark";
    html+=`<div class="stat ${cls}">${key}: ${stats[key]}</div>`;
  }
  const avg=total/Object.keys(stats).length;
  const rank=getRank(avg);
  const percent=Math.floor(Math.random()*100);
  html+=`<hr><div>総合ランク: ${rank}</div>`;
  html+=`<div>あなたは上位 ${percent}% の人間です</div>`;
  html+=`<p>${getComment(stats)}</p>`;
  html+=`<button onclick="share()">シェア</button>`;
  html+=`<button onclick="restart()">もう一度</button>`;
  box.innerHTML=html;
}

function share(){
  const text="あなたの人間ステータス診断結果はこちら！";
  const url=location.href;
  window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`);
}

function restart(){
  current=0; selected=null;
  stats={知性:0,社交性:0,行動力:0,ストレス耐性:0,狂気:0,闇深度:0,隠れた才能:0,理性:0};
  document.getElementById("resultBox").classList.add("hidden");
  document.getElementById("questionBox").classList.remove("hidden");
  document.getElementById("progressContainer").classList.remove("hidden");
  showQuestion();
}

showQuestion();