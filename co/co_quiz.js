const questions = coQuestions; // 你原题库

let usedIndexes = [];
let currentIndex = 0;
let quizMode = 'random'; // 默认顺序刷题
let orderedIndex = 0;
let currentPaper = 1; // 当前试卷编号，1~6
let totalAnswered = 0;
let totalCorrect = 0;

function getPaperStartIndex(paperNum) {
  return (paperNum - 1) * 20;
}

// 判断多选题
function isMulti(q) {
  return Array.isArray(q.answer);
}

function renderQuestion() {
  if (quizMode === 'random') {
    if (usedIndexes.length === questions.length) usedIndexes = [];
    do {
      currentIndex = Math.floor(Math.random() * questions.length);
    } while (usedIndexes.includes(currentIndex));
    usedIndexes.push(currentIndex);
  } else {
    currentIndex = orderedIndex;
    orderedIndex = (orderedIndex + 1) % questions.length;
  }
  
    const q = questions[currentIndex];

// ---选项乱序核心代码---
const optionIdxArr = q.options.map((_, idx) => idx);
const shuffledIdx = optionIdxArr.slice().sort(() => Math.random() - 0.5);
// 根据乱序下标生成显示用的新选项数组
const showOptions = shuffledIdx.map(i => q.options[i]);

// 新答案下标：单选或多选
let showAnswer;
if (Array.isArray(q.answer)) {
  showAnswer = q.answer.map(a => shuffledIdx.indexOf(a));
} else {
  showAnswer = shuffledIdx.indexOf(q.answer);
}

// 渲染
document.getElementById("meta").innerText = q.source || "";
document.getElementById("question").innerText = q.question;
...
const optionsDiv = document.getElementById("options");
optionsDiv.innerHTML = "";
showOptions.forEach((opt, idx) => {
  const div = document.createElement("div");
  div.className = "option";
  div.innerText = opt;
  div.onclick = () => {
    document.querySelectorAll(".option").forEach(e => e.onclick = null);
    totalAnswered++;
    if (
      (Array.isArray(showAnswer) && showAnswer.includes(idx)) ||
      (!Array.isArray(showAnswer) && idx === showAnswer)
    ) {
      div.classList.add("correct");
      totalCorrect++;
      document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
    } else {
      div.classList.add("wrong");
      // 多选题需显示全部正确答案
      let ans = Array.isArray(showAnswer)
        ? showAnswer.map(i => showOptions[i]).join('，')
        : showOptions[showAnswer];
      document.getElementById("explanation").innerText =
        "你选错了！正确答案是：" + ans + " 解析：" + q.explanation;
    }
    // ...其余进度、按钮控制...
  };
  optionsDiv.appendChild(div);
});
  document.getElementById("explanation").innerText = "";
}

function nextQuestion() {
  renderQuestion();
}

// 统计变量和按钮事件绑定
document.getElementById('modeSwitchBtn').onclick = function () {
  if (quizMode === 'random') {
    quizMode = 'ordered';
    orderedIndex = getPaperStartIndex(currentPaper);
    alert('已切换为顺序刷题模式');
    document.getElementById('paperButtonsContainer').style.display = 'flex';
  } else {
    quizMode = 'random';
    usedIndexes = [];
    alert('已切换为随机刷题模式');
    document.getElementById('paperButtonsContainer').style.display = 'none';
  }
  totalAnswered = 0;
  totalCorrect = 0;
  renderQuestion();
};

(function addPaperButtons() {
  const btnContainer = document.createElement('div');
  btnContainer.id = 'paperButtonsContainer';
  btnContainer.style.position = 'fixed';
  btnContainer.style.left = '20px';
  btnContainer.style.bottom = '20px';
  btnContainer.style.zIndex = '999';
  btnContainer.style.display = 'flex';
  btnContainer.style.flexDirection = 'column';
  btnContainer.style.maxWidth = '100px';
  for (let i = 1; i <= 6; i++) {
    const btn = document.createElement('button');
    btn.innerText = '试卷' + i;
    btn.style.margin = '4px 0';
    btn.style.background = i === 1 ? '#4285f4' : '#ff9800';
    btn.style.color = '#fff';
    btn.style.borderRadius = '8px';
    btn.style.fontSize = '16px';
    btn.style.padding = '10px 0';
    btn.style.width = '100%';
    btn.onclick = function () {
      currentPaper = i;
      quizMode = 'ordered';
      orderedIndex = getPaperStartIndex(i);
      totalAnswered = 0;
      totalCorrect = 0;
      renderQuestion();
      Array.from(btnContainer.children).forEach((b, idx) => {
        b.style.background = (idx + 1) === i ? '#4285f4' : '#ff9800';
      });
    };
    btnContainer.appendChild(btn);
  }
  document.body.appendChild(btnContainer);
})();

window.onload = function () {
  quizMode = 'ordered';
  currentPaper = 1;
  orderedIndex = getPaperStartIndex(1);
  totalAnswered = 0;
  totalCorrect = 0;
  renderQuestion();
  document.getElementById('paperButtonsContainer').style.display = 'flex';
};
