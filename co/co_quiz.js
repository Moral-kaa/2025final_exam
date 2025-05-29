const questions = coQuestions;
  // ------------- 题库结尾 ----------------------------
  let usedIndexes = [];
  let currentIndex = 0;
  let quizMode = 'random'; // 默认顺序刷题
  let orderedIndex = 0;
  let currentPaper = 1; // 当前试卷编号，1~6
  
  function getPaperStartIndex(paperNum) {
    // 试卷1第1题在questions[0]，试卷2第1题在questions[20]，以此类推，每套20题
    return (paperNum - 1) * 20;
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
// 打乱选项并记录新答案位置
const originalOptions = [...q.options];
const originalAnswer = q.answer;

let shuffled = originalOptions.map((opt, idx) => ({ opt, idx }));
shuffled = shuffled.sort(() => Math.random() - 0.5);  // 洗牌

// 更新题目选项
q.options = shuffled.map(item => item.opt);

// 更新答案下标
if (Array.isArray(originalAnswer)) {
  // 多选题：更新为新下标
  q.answer = originalAnswer.map(a =>
    shuffled.findIndex(item => item.idx === a)
  );
} else {
  // 单选题：找到新下标
  q.answer = shuffled.findIndex(item => item.idx === originalAnswer);
}
    
    // 显示题目来源
    document.getElementById("meta").innerText = q.source || "";
    document.getElementById("question").innerText = q.question;
    // 在顺序模式下，根据当前试卷和题目索引计算当前题号，随机模式下使用已答题数量
    let currentQuestionNumber = quizMode === 'ordered' ? 
      (currentPaper - 1) * 20 + (orderedIndex - getPaperStartIndex(currentPaper)) : 
      usedIndexes.length;
    // 确保题号从1开始显示
    if (quizMode === 'ordered' && currentQuestionNumber === 0) {
      currentQuestionNumber = 1;
    } else if (quizMode === 'ordered') {
      currentQuestionNumber = currentQuestionNumber === 0 ? 20 : currentQuestionNumber;
    } else {
      currentQuestionNumber = currentQuestionNumber === 0 ? 1 : currentQuestionNumber;
    }
    document.getElementById("progress").innerText =
      `当前第 ${currentQuestionNumber} 题 / 共 ${questions.length} 题    正确率：${totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : '0'}%`;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    
    // 禁用下一题按钮，直到用户选择了选项
    const nextButton = document.querySelector('button[onclick="nextQuestion()"]');
    nextButton.disabled = true;
    nextButton.style.backgroundColor = '#cccccc';
    nextButton.style.cursor = 'not-allowed';
    
    q.options.forEach((opt, idx) => {
      const div = document.createElement("div");
      div.className = "option";
      div.innerText = opt;
      div.onclick = () => {
        document.querySelectorAll(".option").forEach(e => e.onclick = null); // 禁止再次点击
        totalAnswered++;
        if (idx === q.answer) {
          div.classList.add("correct");
          totalCorrect++;
          document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
        } else {
          div.classList.add("wrong");
          document.getElementById("explanation").innerText =
            "你选错了！正确答案是：" +
            q.options[q.answer] + " 解析：" + q.explanation;
        }
        // 在顺序模式下，根据当前试卷和题目索引计算当前题号，随机模式下使用已答题数量
        let currentQuestionNumber = quizMode === 'ordered' ? 
          (currentPaper - 1) * 20 + (orderedIndex - getPaperStartIndex(currentPaper)) : 
          usedIndexes.length;
        // 确保题号从1开始显示
        if (quizMode === 'ordered' && currentQuestionNumber === 0) {
          currentQuestionNumber = 1;
        } else if (quizMode === 'ordered') {
          currentQuestionNumber = currentQuestionNumber === 0 ? 20 : currentQuestionNumber;
        } else {
          currentQuestionNumber = currentQuestionNumber === 0 ? 1 : currentQuestionNumber;
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
    if (quizMode === 'random') {
      renderQuestion();
    } else {
      renderQuestion();
    }
  }
  
  // 统计变量
  let totalAnswered = 0;
  let totalCorrect = 0;
  
  document.getElementById('modeSwitchBtn').onclick = function() {
    if (quizMode === 'random') {
      quizMode = 'ordered';
      orderedIndex = getPaperStartIndex(currentPaper);
      alert('已切换为顺序刷题模式');
      // 显示试卷选择按钮
      document.getElementById('paperButtonsContainer').style.display = 'flex';
    } else {
      quizMode = 'random';
      usedIndexes = [];
      alert('已切换为随机刷题模式');
      // 隐藏试卷选择按钮
      document.getElementById('paperButtonsContainer').style.display = 'none';
    }
    totalAnswered = 0;
    totalCorrect = 0;
    renderQuestion();
  };
  
  // 新增：左下角试卷选择按钮
  (function addPaperButtons() {
    const btnContainer = document.createElement('div');
    btnContainer.id = 'paperButtonsContainer'; // 添加ID以便后续引用
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
        // 高亮当前按钮
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
    
    // 确保试卷选择按钮在初始化时显示（因为默认是顺序模式）
    document.getElementById('paperButtonsContainer').style.display = 'flex';
  };
  
