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

  // --- 只在渲染时打乱选项 ---
  const indices = Array.from({length: q.options.length}, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const shuffledOptions = indices.map(i => q.options[i]);
  // 新的正确下标
  let correctIdx;
  if (isMulti(q)) {
    correctIdx = q.answer.map(a => indices.indexOf(a)).sort((a, b) => a - b);
  } else {
    correctIdx = indices.indexOf(q.answer);
  }

  // 显示题目来源
  document.getElementById("meta").innerText = q.source || "";
  document.getElementById("question").innerText = q.question;

  // 题号计算逻辑略（你原本的currentQuestionNumber计算这里加上即可）

  let currentQuestionNumber = quizMode === 'ordered'
    ? (currentPaper - 1) * 20 + (orderedIndex - getPaperStartIndex(currentPaper))
    : usedIndexes.length;
  if (quizMode === 'ordered' && currentQuestionNumber === 0) currentQuestionNumber = 1;
  else if (quizMode === 'ordered') currentQuestionNumber = currentQuestionNumber === 0 ? 20 : currentQuestionNumber;
  else currentQuestionNumber = currentQuestionNumber === 0 ? 1 : currentQuestionNumber;

  document.getElementById("progress").innerText =
    `当前第 ${currentQuestionNumber} 题 / 共 ${questions.length} 题    正确率：${totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : '0'}%`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // 禁用下一题按钮
  const nextButton = document.querySelector('button[onclick="nextQuestion()"]');
  nextButton.disabled = true;
  nextButton.style.backgroundColor = '#cccccc';
  nextButton.style.cursor = 'not-allowed';

  let selected = [];
  shuffledOptions.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => {
      document.querySelectorAll(".option").forEach(e => e.onclick = null);

      totalAnswered++;

      if (!isMulti(q)) {
        if (idx === correctIdx) {
          div.classList.add("correct");
          totalCorrect++;
          document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
        } else {
          div.classList.add("wrong");
          document.getElementById("explanation").innerText =
            "你选错了！正确答案是：" + shuffledOptions[correctIdx] + " 解析：" + q.explanation;
        }
      } else {
        if (!div.classList.contains("selected")) {
          div.classList.add("selected");
          selected.push(idx);
        } else {
          div.classList.remove("selected");
          selected = selected.filter(i => i !== idx);
        }
        if (selected.length === correctIdx.length) {
          document.querySelectorAll(".option").forEach(e => e.onclick = null);
          const ok = selected.sort().toString() === correctIdx.toString();
          if (ok) {
            selected.forEach(i => optionsDiv.children[i].classList.add("correct"));
            totalCorrect++;
            document.getElementById("explanation").innerText = "你全选对了！解析：" + q.explanation;
          } else {
            selected.forEach(i => optionsDiv.children[i].classList.add("wrong"));
            correctIdx.forEach(i => optionsDiv.children[i].classList.add("correct"));
            document.getElementById("explanation").innerText =
              "有误！正确答案是：" + correctIdx.map(i => shuffledOptions[i]).join('，') + " 解析：" + q.explanation;
          }
        }
      }
      document.getElementById("progress").innerText =
        `当前第 ${currentQuestionNumber} 题 / 共 ${questions.length} 题    正确率：${((totalCorrect / totalAnswered) * 100).toFixed(1)}%`;
      // 启用下一题按钮
      nextButton.disabled = false;
      nextButton.style.backgroundColor = '#4285f4';
      nextButton.style.cursor = 'pointer';
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
