const questions = coQuestions; // 题库变量
let usedIndexes = [];
let currentIndex = 0;
let quizMode = 'random'; // 默认顺序刷题
let orderedIndex = 0;
let currentPaper = 1; // 当前试卷编号，1~6

function getPaperStartIndex(paperNum) {
  return (paperNum - 1) * 20;
}

// 统计变量
let totalAnswered = 0;
let totalCorrect = 0;

// 判断多选题和单选题
function isMulti(q) {
  return Array.isArray(q.answer);
}

// 选项内容打乱（ABCD顺序不乱）
function shuffleOptionContents(q) {
  const originalContent = [...q.options];
  const shuffledContent = originalContent.slice().sort(() => Math.random() - 0.5);
  // 重新计算正确答案的新下标
  let showAnswer;
  if (isMulti(q)) {
    showAnswer = q.answer.map(ai => shuffledContent.indexOf(originalContent[ai]));
  } else {
    showAnswer = shuffledContent.indexOf(originalContent[q.answer]);
  }
  return {shuffledContent, showAnswer};
}

// 渲染题目
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

  // 固定选项字母，内容乱序
  const {shuffledContent, showAnswer} = shuffleOptionContents(q);

  // 显示题目来源
  document.getElementById("meta").innerText = q.source || "";

  document.getElementById("question").innerText = q.question;
  // 当前题号
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

  // 禁用下一题按钮，直到选择
  const nextButton = document.querySelector('button[onclick="nextQuestion()"]');
  nextButton.disabled = true;
  nextButton.style.backgroundColor = '#cccccc';
  nextButton.style.cursor = 'not-allowed';

  let selected = [];
  shuffledContent.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    // 固定ABCD字母顺序
    const optionLetter = String.fromCharCode(65 + idx);
    div.innerText = optionLetter + ". " + opt;
    div.onclick = () => {
      document.querySelectorAll(".option").forEach(e => e.onclick = null);
      totalAnswered++;
      // 多选
      if (Array.isArray(showAnswer)) {
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
              showAnswer.map(i => String.fromCharCode(65+i) + ". " + shuffledContent[i]).join('，') + " 解析：" + q.explanation;
          }
          nextButton.disabled = false;
          nextButton.style.backgroundColor = '#4285f4';
          nextButton.style.cursor = 'pointer';
        }
      } else {
        // 单选
        if (idx === showAnswer) {
          div.classList.add("correct");
          totalCorrect++;
          document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
        } else {
          div.classList.add("wrong");
          document.getElementById("explanation").innerText =
            "你选错了！正确答案是：" +
            String.fromCharCode(65 + showAnswer) + ". " + shuffledContent[showAnswer] + " 解析：" + q.explanation;
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

// 下一题
function nextQuestion() {
  renderQuestion();
}

// 切换模式
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

// 新增：左下角试卷选择按钮
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

// 页面加载后默认显示试卷1第1题
window.onload = function() {
  quizMode = 'ordered';
  currentPaper = 1;
  orderedIndex = getPaperStartIndex(1);
  totalAnswered = 0;
  totalCorrect = 0;
  renderQuestion();
  document.getElementById('paperButtonsContainer').style.display = 'flex';
};
