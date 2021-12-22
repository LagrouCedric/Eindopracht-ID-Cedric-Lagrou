let tl;
let elem = ``;
let questionIndex = 0;
let score = 0;
let options = [];
let correctAnswer = ``;
let correctAnswerIndex = 0;
var timeLeft = 30;
let optionChosen = false;
letcorrectAnswer = false;
let scoreCircles = [];
let questionLength = 0;
let downloadTimer;

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;
const COLOR_CODES = {
  info: {
    color: 'blue',
  },
  warning: {
    color: 'orange',
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: 'red',
    threshold: ALERT_THRESHOLD,
  },
};
let remainingPathColor = COLOR_CODES.info.color;
const TIME_LIMIT = 30;
let timePassed = 0;
const GetRandomoptions = function (question) {
  array = [];
  let length = 1;
  for (item in question.incorrect_answers) {
    length += 1;
  }
  console.log(length);
  correctAnswerIndex = Math.floor(Math.random() * length) + 1;
  // console.log(`length: ${length}  `);
  let incorrectAnswers = question.incorrect_answers;
  console.log(`coorectAnswerIndex: ${correctAnswerIndex}`);
  let arrayLenght = incorrectAnswers.lenght + 1;
  let incorrectIndex = 0;
  for (let i = 1; i <= length; i++) {
    if (i == correctAnswerIndex) {
      //   console.log(`correctanswer: ${question.correct_answer}`);
      let item = atob(question.correct_answer);
      array.push(item);
    } else {
      //   console.log(`incorrectanswer: ${incorrectAnswers[incorrectIndex]} `);
      let item = atob(incorrectAnswers[incorrectIndex]);
      array.push(item);
      incorrectIndex += 1;
    }
  }
  //console.log(`array ${array}`);
  return array;
};

const showQuestion = function (question) {
  let html_title = ``;
  let htmlOptions = ``;
  let optionIndex = 1;
  let optionText = ``;
  questionLength = question.lenght;
  document.querySelectorAll('.js-question-option').forEach((option) => {
    option.disabled = false;
  });
  document.querySelector('.js-questionIndex').innerHTML = `question ${questionIndex + 1}`;
  document.querySelector('.js-question-button').disabled = true;
  correctAnswer = question.correct_answer;
  title_decoded = atob(question.question);
  html_title += title_decoded;
  options = GetRandomoptions(question);
  //   console.log('options');
  //   console.log(options);
  for (let option in options) {
    htmlOptions += `<button class="c-question-option js-question-option" data-index="${optionIndex}"><p class="c-question-option--text " data-index="${optionIndex}">${options[option]}</p></button>`;
    optionIndex += 1;
  }
  //   console.log(`optionshtml = ${htmlOptions}`);
  document.querySelector('.js-options').innerHTML = htmlOptions;
  //   console.log(options);

  elem = document.querySelector('.js-timer');
  elemP = document.querySelector('.js-timer span');

  elem.innerHTML = ` <div class="base-timer">
  <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <g class="base-timer__circle">
      <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
      <path
        id="base-timer-path-remaining"
        stroke-dasharray="283"
        class="base-timer__path-remaining ${remainingPathColor}"
        d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
      ></path>
    </g>
  </svg>
  <span id="base-timer-label" class="base-timer__label">${timeLeft}</span>
</div>`;
  downloadTimer = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById('base-timer-label').innerHTML = timeLeft;
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(downloadTimer);
      checkAnswer(-1, null);
    }
  }, 1000);

  document.querySelectorAll('.js-question-option').forEach((option) => {
    option.addEventListener('click', (e) => {
      //console.log('inner');
      let test = e.target.innerHTML;
      //console.log(e.target.innerHTML);
      if (optionChosen != true) {
        selectOption(e);
      }
    });

    document.querySelector('.js-question-title').innerHTML = html_title;
  });
};

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document.getElementById('base-timer-path-remaining').classList.remove(warning.color);
    document.getElementById('base-timer-path-remaining').classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document.getElementById('base-timer-path-remaining').classList.remove(info.color);
    document.getElementById('base-timer-path-remaining').classList.add(warning.color);
  }
}

function setCircleDasharray() {
  let rawTimeFraction = timeLeft / TIME_LIMIT;
  let TimeFraction = rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);

  const circleDasharray = `${(TimeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
  document.getElementById('base-timer-path-remaining').setAttribute('stroke-dasharray', circleDasharray);
}

let getApi = async () => {
  const ENDPOINT = `https://opentdb.com/api.php?amount=10&encode=base64`;
  const request = await fetch(`${ENDPOINT}`);
  const data = await request.json();
  //console.log(data);
  questionArray = data.results;
  // console.log(questionArray[questionIndex])
  let circles = ``;
  i = 1;
  while (i <= 5) {
    circles += `<div style="width: 10px; height: 10px; background-color: grey; border-radius: 50%"></div>`;
    i += 1;
  }
  document.querySelector('.js-scoreCircles').innerHTML = circles;

  showQuestion(questionArray[questionIndex]);
};
const selectOption = function (e) {
  //console.log('selectoptions function');
  document.querySelectorAll('.js-question-option').forEach((option) => {
    option.classList.remove('c-question-option--selected');
  });
  let showBox = e.currentTarget;
  console.log(e.target);
  let optionIndex = Number(e.target.dataset.index);
  //   console.log(`indexRaw ${e.target.dataset.index}`);

  //   console.log(`index ${optionIndex}`);
  showBox.classList.add('c-question-option--selected');
  checkAnswer(optionIndex, showBox);
};
const showPercentages = function () {
  percentage = Math.floor(Math.random() * 80 + 15);
  let percent = document.querySelector('.js-percentages');
  percent.innerHTML = percentage + '% of people chose the same answer as you!';
  percent.classList.add('c-question-subtitle--zoom');
  tl.set('.js-percentage', {
    transformOrigin: '50% 100%',
  }).to(
    '.js-percentage',
    {
      scale: 0.9,
    },
    '-=.75'
  );
};

const checkAnswer = function (index, showBox) {
  document.querySelector('.js-question-button').disabled = false;
  clearInterval(downloadTimer);
  optionChosen = true;
  if (index != -1) {
    showPercentages();
  } else {
    let percent = document.querySelector('.js-percentages');
    percent.innerHTML = 'Time ran out, better luck next time ';
    percent.classList.add('c-question-subtitle--zoom');
  }
  if (showBox != null) {
    showBox.classList.remove('c-question-option--selected');
  }

  document.querySelectorAll('.js-question-option').forEach((option) => {
    option.classList.add('c-question-option--incorrect');
    // option.disabled = true;
  });
  if (index == correctAnswerIndex) {
    //console.log(atob(correctAnswer));
    // console.log('correct');
    if (showBox != null) {
      showBox.classList.remove('c-question-option--incorrect');
      showBox.classList.add('c-question-option--correct');

      score += 1;
      correctAnswer = true;
    }
    // make other answers red
  } else {
    correctAnswer = false;

    document.querySelectorAll('.js-question-option').forEach((option) => {
      let indexValue = parseInt(option.getAttribute('data-index'));
      //   console.log('check correct');
      //   console.log(correctAnswerIndex, typeof correctAnswerIndex);
      //   console.log(`indexvalue: ${indexValue} ${typeof indexValue}`);

      if (indexValue == correctAnswerIndex) {
        // console.log('corrected');
        // console.log(option);
        option.classList.add('c-question-option--corrected');
      }
    });
    if (showBox != null) {
      showBox.classList.add('c-question-option--false');
      showBox.classList.add('c-shake');
    }
  }

  if (correctAnswer == true) {
    scoreCircles.push(`<div><svg style="margin: 0 0 4px 4px;" viewBox="0 0 24 24">
    <path fill="green" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
</svg></div>`);
  } else {
    scoreCircles.push(`<div><svg viewBox="0 0 24 24">
    <path fill="red" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg></div>`);
  }
  console.log(`scorecircles: ${scoreCircles}`);

  x = 4 - questionIndex;
  console.log(`count: ${x}`);

  let circles = ``;
  for (div of scoreCircles) {
    circles += div;
  }
  i = 0;
  while (i < x) {
    circles += `<div style="width: 10px; height: 10px; background-color: grey; border-radius: 50%"></div>`;
    i += 1;
  }
  console.log(`circles: ${circles}`);

  document.querySelector('.js-scoreCircles').innerHTML = circles;
  correctAnswer = false;
};
const playAgain = function () {
  scoreCircles = [];
  console.log('play again');
  score = 0;
  questionIndex = 0;
  timeLeft = 30;
  timePassed = 0;
  document.querySelector('.js-questionscreen').classList.remove('o-hide-accessible');
  document.querySelector('.js-scorescreen').classList.add('o-hide-accessible');
  document.querySelector('.c-score-circle').classList.remove('c-score-circle--zoom');
  document.querySelector('.js-play-again').classList.toggle('c-shake-infinite');
  getApi();
};
const showScoreScreen = function () {
  console.log('scorescreren show');
  let questionMain = document.querySelector('.js-questionscreen');
  let scoreMain = document.querySelector('.js-scorescreen');
  console.log(questionMain, scoreMain);
  questionMain.classList.add('o-hide-accessible');
  scoreMain.classList.remove('o-hide-accessible');
  document.querySelector('.c-score-circle').classList.add('c-score-circle--zoom');
  document.querySelector('.js-play-again').classList.toggle('c-shake-infinite');

  document.querySelector('.js-play-again').addEventListener('click', playAgain);
  document.querySelector('.js-score').innerHTML = score + '/5';
};
const nextAnswer = function () {};
const QuestionButton = function () {
  console.log(questionIndex, typeof questionIndex);
  document.querySelector('.js-percentages').innerHTML = '';
  document.querySelector('.js-percentages').classList.remove('c-question-subtitle--zoom');
  questionIndex += 1;
  optionChosen = false;
  if (questionIndex >= 5) {
    console.log(`score: ${score}`);
    showScoreScreen();
  } else {
    timeLeft = 30;

    timePassed = 0;
    showQuestion(questionArray[questionIndex]);
  }
};

const startFunction = function () {
  console.log('strat');
  document.querySelector('.js-startScreen').classList.add('o-hide-accessible');

  document.querySelector('.js-questionscreen').classList.remove('o-hide-accessible');
  console.log('Script loaded!');
  tl = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power1.inOut',
    },
    repeat: -1,
    yoyo: true,
  });
  atl = gsap.timeline({
    defaults: {
      duration: 1,
      ease: 'power1.inOut',
    },
  });
  document.querySelector('.js-question-button').addEventListener('click', QuestionButton);
  getApi();
};
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('.js-start').addEventListener('click', startFunction);
});
// animate css js

// score bolltejes toevoegen antw juist of fout is DONE
// button doen shaken als antw verkeerd is  DOne
// timer fixen Done
// button positive animate als antw juist is MEH

// next button disabled als je er nog niet op mag drukken Meh
