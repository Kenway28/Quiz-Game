let title = document.querySelector(".title");
let overlay = document.querySelector(".settings-overlay");
let options = Array.from(document.querySelectorAll(".options li"));
let HistoryBar = document.querySelector(".History-bar");
let topics = document.querySelectorAll(".topic");
let timer = document.querySelector(".timer");
let timerValue = document.querySelector(".timer-value");
let indicator = document.querySelector(".indicator");
let mainArray = [];
let History = [];
let counter = -1;
let gameIndex = 0;

function createHistoryBar() {
  for (let index = 0; index < mainArray.length; index++) {
    let question = document.createElement("span");
    question.className = "step";
    HistoryBar.appendChild(question);
  }
}

async function getData(theField) {
  const response = await fetch("./questions.json");
  const data = await response.json();
  // console.log(data);

  data.forEach((element) => {
    if (element.field == theField) {
      mainArray = element["Questions"].sort(() => Math.random() - 0.5);
    }
  });
  createHistoryBar();
  createQuestion();
}

topics.forEach((topic) => {
  topic.addEventListener("click", () => {
    getData(topic.textContent.toLowerCase());
    overlay.style.display = "none";
  });
});

/***************** */
function createQuestion() {
  title.textContent = `${mainArray[gameIndex].title}`;

  const answers = Object.entries(mainArray[gameIndex])
    .filter((e) => {
      if (e[0].includes("answer_")) {
        return e;
      }
    })
    .map((e) => (e = e[1]))
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < 4; i++) {
    options[i].className = "";
    options[i].textContent = answers[i];
  }
  startPlay();
}
/// reveal Answer if my answer is wrong or no answer at all
function revealAnswer(answer) {
  options.forEach((element) => {
    if (answer == element.textContent) {
      setTimeout(() => {
        element.classList.add("correct");
      }, 500);
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

/** new script*/
function startPlay() {
  clearInterval(counter);
  timerValue.textContent = 10;
  indicator.style.strokeDashoffset = 0;
  counter = setInterval(() => {
    timerValue.textContent -= 1;
    indicator.style.strokeDashoffset = 600 - +timer.textContent * 60;
    // user click an option
    options.forEach((e) => {
      e.addEventListener("click", (event) => {
        clearInterval(counter);
        let selectedLength = document.querySelectorAll(".selected").length;
        if (selectedLength == 0 && timerValue.textContent != 0) {
          e.classList.add("selected");
          let myAnswer = document.querySelector(".selected");
          let rightAnswer = mainArray[gameIndex][`right_answer`];
          console.log(myAnswer.textContent, rightAnswer);
          if (myAnswer.textContent === rightAnswer) {
            myAnswer.classList.add("correct");
            History.push("correct");
            nextStep();
          } else {
            myAnswer.classList.add("wrong");
            History.push("wrong");
            revealAnswer(rightAnswer);
            nextStep();
          }
        } else {
          event.preventDefault();
        }
      });
    });
    /// time out

    if (timer.textContent == 0) {
      clearInterval(counter);
      let rightAnswer = mainArray[gameIndex][`right_answer`];
      revealAnswer(rightAnswer);
      History.push("wrong");
      nextStep();
    }
  }, 1000);
}

// move to next question or end game
function nextStep() {
  Array.from(HistoryBar.children)[gameIndex].classList.add(History[gameIndex]);
  ++gameIndex;
  if (gameIndex != mainArray.length) {
    setTimeout(() => {
      createQuestion(mainArray, gameIndex);
    }, 1500);
  } else {
    console.log("game End");
    // getResults();
  }
}
