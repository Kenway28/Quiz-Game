let title = document.querySelector(".title");
let options = Array.from(document.querySelectorAll(".options li"));
// let steps = Array.from(document.querySelectorAll(".step"));
let QuestionsBar = document.querySelector(".Questions-bar");
let timer = document.querySelector(".timer");
let mainArray = [];
let counter = -1;
let currentIndex = 0;

function createQuestionsBar(length) {
  for (let index = 0; index < length; index++) {
    let question = document.createElement("span");
    question.className = "step";
    question.textContent = index + 1;
    QuestionsBar.appendChild(question);
  }
}

async function getData() {
  const response = await fetch("./questions.json");
  const data = await response.json();
  mainArray = data.sort(() => Math.random() - 0.5);
  createQuestionsBar(mainArray.length);
  createQuestion(mainArray, currentIndex);
}

getData();

/***************** */
function createQuestion(questionData, questionIndex) {
  Array.from(QuestionsBar.children)[questionIndex].classList.add("current");
  title.textContent = `${questionData[questionIndex].title}`;

  const answers = Object.entries(questionData[questionIndex])
    .filter((e) => {
      if (e[0].includes("answer_")) {
        return e;
      }
    })
    .map((e) => (e = e[1]))
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < 4; i++) {
    options[i].textContent = answers[i];
  }
  selectFunction(questionData);
  let answer = questionData[currentIndex][`right_answer`];
  startCounting(answer);
}
/**/
function checkAnswer(answer) {
  let selected = document.querySelector(".selected");
  let current = document.querySelector(".current");
  setTimeout(() => {
    if (selected.textContent === answer) {
      selected.classList.add("correct");
      current.classList.add("correct", "fas", "fa-check");
    } else {
      revealAnswer(answer);
      selected.classList.add("wrong");
      current.classList.add("wrong", "fas", "fa-times");
    }
    current.classList.remove("current");
    current.innerHTML = "";
    setTimeout(() => {
      options.forEach((element) => (element.className = ""));
      ++currentIndex;
      if (currentIndex != mainArray.length) {
        createQuestion(mainArray, currentIndex);
      } else {
        console.log("game End");
      }
    }, 1000);
  }, 000);
}

function selectFunction(questionData) {
  options.forEach((e) => {
    e.addEventListener("click", () => {
      clearInterval(counter);
      let answer = questionData[currentIndex][`right_answer`];
      // console.log(answer, currentIndex);
      let selectedLength = document.querySelectorAll(".selected").length;
      let correctLength = document.querySelectorAll(".correct").length;
      if (selectedLength == 0 && timer.textContent != 0) {
        e.classList.add("selected");
        checkAnswer(answer);
      }
    });
  });
}

/// when the countdown reach 0 without selected answer
// function noAnswer() {
//   clearInterval(counter);
// }

function startCounting(answer) {
  clearInterval(counter);
  timer.textContent = 10;
  counter = setInterval(() => {
    timer.textContent -= 1;
    if (timer.textContent == 0) {
      clearInterval(counter);
      let myAnswer = document.querySelector(".selected");
      // console.log(myAnswer);
      if (myAnswer == null) {
        revealAnswer(answer);
        let current = document.querySelector(".current");
        current.classList.add("wrong", "fas", "fa-times");
        current.innerHTML = "";
        current.classList.remove("current");
        setTimeout(() => {
          options.forEach((element) => (element.className = ""));
          ++currentIndex;
          if (currentIndex != mainArray.length) {
            createQuestion(mainArray, currentIndex);
          } else {
            console.log("game End");
            getResults();
          }
        }, 1000);
      }
    }
  }, 1000);
}

/// reveal Answer if my answer is wrong or no answer at all
function revealAnswer(answer) {
  options.forEach((element) => {
    if (answer == element.textContent) {
      setTimeout(() => {
        element.classList.add("correct");
      }, 200);
    }
  });
}

function getResults() {
  let steps = Array.from(document.querySelectorAll(".step"));
  let correct = steps.filter((e) => {
    if (e.classList.contains("correct")) {
      return e;
    }
  });

  console.log(correct.length);
  console.log(mainArray.length - correct.length);
}
