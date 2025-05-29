// 题库变量，建议你的题库js文件导出 questions 变量，此处直接引用
const questions = coQuestions; // 或 cnQuestions，看你页面

let usedIndexes = [];
let currentIndex = 0;
let quizMode = 'random'; // 默认随机
let orderedIndex = 0;
let currentPaper = 1;
let totalAnswered = 0, totalCorrect = 0;

function getPaperStartIndex(paperNum) {
  // 每套试卷20题，按你的题库分布
  return (paperNum - 1) * 20;
}

// 判断是否多选题
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

  // --------- 选项乱序处理 START ---------
  const optionIndexArr = q.options.map((_, idx) => idx);
  const shuffledIdx = optionIndexArr.slice().sort(() => Math.random() - 0.5);
  const showOptions = shuffledIdx.map(i => q.options[i]);

  // 乱序后新正确答案下标
  let showAnswer;
  if (Array.isArray(q.answer)) {
    showAnswer = q.answer.map(ansIdx => shuffledIdx.indexOf(ansIdx));
  } else {
    showAnswer = shuffledIdx.indexOf(q.answer);
  }
  // --------- 选项乱序处理 END ---------

  document.getElementById("meta").innerText = q.source || "";
  document.getElementById("question").innerText = q.question;
  let currentQuestionNumber = quizMode === 'ordered'
    ? (currentPaper - 1) * 20 + (orderedIndex - getPaperStartIndex(currentPaper))
    : usedIndexes.length;
  if (quizMode === 'ordered' && currentQuestionNumber === 0) currentQuestionNumber = 1;
  document.getElementById("progress").innerText =
    `当前第 ${currentQuestionNumber} 题 / 共 ${questions.length} 题    正确率：${totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : '0'}%`;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  const nextButton = document.querySelector('button[onclick="nextQuestion()"]');
  nextButton.disabled = true;
  nextButton.style.backgroundColor = '#cccccc';
  nextButton.style.cursor = 'not-allowed';

  let selected = [];
  showOptions.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => {
      document.querySelectorAll(".option").forEach(e => e.onclick = null);
      totalAnswered++;
      if (Array.isArray(showAnswer)) {
        // 多选题：需用户全选（或加确认按钮，这里自动）
        selected.push(idx);
        if (selected.length === showAnswer.length) {
          let isAllRight = selected.slice().sort().toString() === showAnswer.slice().sort().toString();
          if (isAllRight) {
            selected.forEach(i => optionsDiv.children[i].classList.add("correct"));
            totalCorrect++;
            document.getElementById("explanation").innerText = "你全选对了！解析：" + q.explanation;
          } else {
            selected.forEach(i => optionsDiv.children[i].classList.add("wrong"));
            showAnswer.forEach(i => optionsDiv.children[i].classList.add("correct"));
            document.getElementById("explanation").innerText =
              "有误！正确答案是：" +
              showAnswer.map(i => showOptions[i]).join('，') + " 解析：" + q.explanation;
          }
          nextButton.disabled = false;
          nextButton.style.backgroundColor = '#4285f4';
          nextButton.style.cursor = 'pointer';
        }
      } else {
        if (idx === showAnswer) {
          div.classList.add("correct");
          totalCorrect++;
          document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
        } else {
          div.classList.add("wrong");
          document.getElementById("explanation").innerText =
            "你选错了！正确答案是：" +
            showOptions[showAnswer] + " 解析：" + q.explanation;
        }
        nextButton.disabled = false;
        nextButton.style.backgroundColor = '#4285f4';
        nextButton.style.cursor = 'pointer';
      }
      document.getElementById("progress").innerText =
        `当前第 ${currentQuestionNumber} 题 / 共 ${questions.length} 题    正确率：${((totalCorrect / totalAnswered) * 100).toFixed(1)}%`;
    };
    optionsDiv.appendChild(div);
  });
  document.getElementById("explanation").innerText = "";
}

function nextQuestion() {
  renderQuestion();
}

document.getElementById('modeSwitchBtn').onclick = function() {
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

// 左下角试卷选择
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
    btn.onclick = function() {
      currentPaper = i;
      quizMode = 'ordered';
      orderedIndex = getPaperStartIndex(i);
      totalAnswered = 0;
      totalCorrect = 0;
      renderQuestion();
      Array.from(btnContainer.children).forEach((b, idx) => {
        b.style.background = (idx+1) === i ? '#4285f4' : '#ff9800';
      });
    };
    btnContainer.appendChild(btn);
  }
  document.body.appendChild(btnContainer);
})();

window.onload = function() {
  quizMode = 'ordered';
  currentPaper = 1;
  orderedIndex = getPaperStartIndex(1);
  totalAnswered = 0;
  totalCorrect = 0;
  renderQuestion();
  document.getElementById('paperButtonsContainer').style.display = 'flex';
};
