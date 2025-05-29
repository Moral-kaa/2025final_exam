const questions = cnQuestions;
// 记录状态
let usedIndexes = [];
let currentIndex = 0;
let totalAnswered = 0, totalCorrect = 0;

// 判断多选题和单选题
function isMulti(q) {
  return Array.isArray(q.answer);
}

// 渲染题目
function renderQuestion() {
  if (usedIndexes.length === questions.length) usedIndexes = [];
  do {
    currentIndex = Math.floor(Math.random() * questions.length);
  } while (usedIndexes.includes(currentIndex) && questions.length > 1);
  usedIndexes.push(currentIndex);

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
  document.getElementById("question").innerText = q.question;
  document.getElementById("progress").innerText =
    `第 ${usedIndexes.length} 题 / 共 ${questions.length} 题　正确率：${totalAnswered > 0 ? ((totalCorrect / totalAnswered) * 100).toFixed(1) : '0'}%`;
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  // 支持多选判分
  let selected = [];
  q.options.forEach((opt, idx) => {
    const div = document.createElement("div");
    div.className = "option";
    div.innerText = opt;
    div.onclick = () => {
      // 单选题逻辑
      if (!isMulti(q)) {
        document.querySelectorAll(".option").forEach(e => e.onclick = null);
        totalAnswered++;
        if (idx === q.answer) {
          div.classList.add("correct");
          totalCorrect++;
          document.getElementById("explanation").innerText = "你选对了！解析：" + q.explanation;
        } else {
          div.classList.add("wrong");
          document.getElementById("explanation").innerText = "你选错了！正确答案是：" + q.options[q.answer] + " 解析：" + q.explanation;
        }
        document.getElementById("progress").innerText =
          `第 ${usedIndexes.length} 题 / 共 ${questions.length} 题　正确率：${((totalCorrect / totalAnswered) * 100).toFixed(1)}%`;
      } else {
        // 多选题
        if (!div.classList.contains("selected")) {
          div.classList.add("selected");
          selected.push(idx);
        } else {
          div.classList.remove("selected");
          selected = selected.filter(x => x !== idx);
        }
        // 多选题：自动判分（比如全部选对就判分，也可加“确定”按钮）
        if (selected.length === q.answer.length) {
          document.querySelectorAll(".option").forEach(e => e.onclick = null);
          totalAnswered++;
          const correct = q.answer.sort().toString() === selected.sort().toString();
          if (correct) {
            selected.forEach(i => optionsDiv.children[i].classList.add("correct"));
            totalCorrect++;
            document.getElementById("explanation").innerText = "你全选对了！解析：" + q.explanation;
          } else {
            selected.forEach(i => optionsDiv.children[i].classList.add("wrong"));
            q.answer.forEach(i => optionsDiv.children[i].classList.add("correct"));
            document.getElementById("explanation").innerText = "有误！正确答案是：" +
              q.answer.map(i => q.options[i]).join('，') + " 解析：" + q.explanation;
          }
          document.getElementById("progress").innerText =
            `第 ${usedIndexes.length} 题 / 共 ${questions.length} 题　正确率：${((totalCorrect / totalAnswered) * 100).toFixed(1)}%`;
        }
      }
    };
    optionsDiv.appendChild(div);
  });
  document.getElementById("explanation").innerText = "";
}

// 下一题
function nextQuestion() {
  renderQuestion();
}

// 首页跳转
function goHome() {
  window.location.href = "../index.html";
}

// 初始化
renderQuestion();
