const questions = [
  {
    question: 'Which game has the slogan "The cake is a lie"?',
    options: ['Half-Life 2', 'Portal', 'Left 4 Dead 2', 'Garry\'s Mod'],
    correctAnswer: 1
  },
  {
    question: 'In Minecraft, what material is needed to make a Nether Portal?',
    options: ['Diamond', 'Obsidian', 'Gold', 'Iron'],
    correctAnswer: 1
  },
  {
    question: 'Which game is known for the phrase "Rock and Stone!"?',
    options: ['Helldivers 2', 'Deep Rock Galactic', 'Valheim', 'Risk of Rain 2'],
    correctAnswer: 1
  },
  {
    question: 'What is the main objective in Among Us?',
    options: ['Escape the island', 'Defeat the zombies', 'Complete tasks while identifying the impostor', 'Build a spaceship'],
    correctAnswer: 2
  },
  {
    question: 'Which game features the character Gordon Freeman?',
    options: ['Team Fortress 2', 'Half-Life', 'Portal', 'Counter-Strike'],
    correctAnswer: 1
  },
  {
    question: 'In Stardew Valley, what is the first season?',
    options: ['Summer', 'Winter', 'Spring', 'Autumn'],
    correctAnswer: 2
  },
  {
    question: 'Which Valve game is a competitive 5v5 tactical shooter?',
    options: ['Left 4 Dead', 'Counter-Strike 2', 'Dota 2', 'Deadlock'],
    correctAnswer: 1
  },
  {
    question: 'Which game lets players survive in a Viking-inspired world?',
    options: ['Terraria', 'Valheim', 'Rust', 'Raft'],
    correctAnswer: 1
  },
  {
    question: 'What type of game is RimWorld?',
    options: ['Racing', 'Colony management simulator', 'Battle Royale', 'Puzzle'],
    correctAnswer: 1
  },
  {
    question: 'In Terraria, which boss is usually fought first?',
    options: ['Moon Lord', 'Eye of Cthulhu', 'Wall of Flesh', 'Skeletron Prime'],
    correctAnswer: 1
  },
  {
    question: 'Which game is developed by Coffee Stain Studios?',
    options: ['Satisfactory', 'Factorio', 'Dyson Sphere Program', 'Cities: Skylines'],
    correctAnswer: 0
  },
  {
    question: 'Which game takes place in the fictional city of Los Santos?',
    options: ['Cyberpunk 2077', 'Grand Theft Auto V', 'Sleeping Dogs', 'Watch Dogs'],
    correctAnswer: 1
  },
  {
    question: 'Which game is famous for "Prepare to Die"?',
    options: ['Elden Ring', 'Dark Souls', 'Sekiro', 'Lies of P'],
    correctAnswer: 1
  },
  {
    question: 'In Phasmophobia, what do players hunt?',
    options: ['Aliens', 'Ghosts', 'Vampires', 'Monsters'],
    correctAnswer: 1
  },
  {
    question: 'Which game has a scientist named GLaDOS?',
    options: ['BioShock', 'Portal', 'Half-Life', 'Prey'],
    correctAnswer: 1
  },
  {
    question: 'What is the maximum number of players in a standard Counter-Strike 2 competitive match?',
    options: ['8', '10', '12', '16'],
    correctAnswer: 1
  },
  {
    question: 'Which game is about automating factories on an alien planet?',
    options: ['Satisfactory', 'Factorio', 'Rust', 'Oxygen Not Included'],
    correctAnswer: 1
  },
  {
    question: 'In Lethal Company, what is your main goal?',
    options: ['Build a base', 'Collect scrap to meet the company quota', 'Defeat monsters', 'Escape a prison'],
    correctAnswer: 1
  },
  {
    question: 'Which game features Steve as the default player character?',
    options: ['Roblox', 'Minecraft', 'Terraria', 'Lego Worlds'],
    correctAnswer: 1
  },
  {
    question: 'Which game has won the Steam "Labor of Love" Award multiple times?',
    options: ['Cyberpunk 2077', 'No Man\'s Sky', 'GTA V', 'Rust'],
    correctAnswer: 1
  }
];

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  isQuizFinished: false,
  answered: false
};

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const progressTextEl = document.getElementById('progressText');
const feedbackEl = document.getElementById('feedback');
const nextButtonEl = document.getElementById('nextButton');

function renderQuestion() {
  const currentQuestion = questions[quizState.currentQuestionIndex];
  questionEl.textContent = currentQuestion.question;
  progressTextEl.textContent = `Question ${quizState.currentQuestionIndex + 1} / ${questions.length}`;
  scoreEl.textContent = quizState.score;
  feedbackEl.textContent = '';
  nextButtonEl.classList.add('hidden');
  optionsEl.innerHTML = '';

  currentQuestion.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(index));
    optionsEl.appendChild(button);
  });

  quizState.answered = false;
}

function checkAnswer(selectedOptionIndex) {
  if (quizState.isQuizFinished || quizState.answered) return;

  quizState.answered = true;
  const currentQuestion = questions[quizState.currentQuestionIndex];
  const buttons = optionsEl.querySelectorAll('.option-btn');

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === currentQuestion.correctAnswer) {
      button.classList.add('correct');
    }
    if (index === selectedOptionIndex && index !== currentQuestion.correctAnswer) {
      button.classList.add('wrong');
    }
  });

  if (selectedOptionIndex === currentQuestion.correctAnswer) {
    quizState.score += 10;
    feedbackEl.textContent = 'Correct!';
  } else {
    feedbackEl.textContent = `Not quite. The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`;
  }

  scoreEl.textContent = quizState.score;
  nextButtonEl.classList.remove('hidden');
}

function nextQuestion() {
  if (quizState.currentQuestionIndex < questions.length - 1) {
    quizState.currentQuestionIndex += 1;
    renderQuestion();
  } else {
    quizState.isQuizFinished = true;
    showResults();
  }
}

function showResults() {
  questionEl.textContent = 'Quiz Complete!';
  progressTextEl.textContent = 'Finished';
  optionsEl.innerHTML = '';
  feedbackEl.innerHTML = `<div class="result-box">You scored ${quizState.score} points out of ${questions.length * 10}.</div>`;
  nextButtonEl.textContent = 'Play Again';
  nextButtonEl.classList.remove('hidden');
}

function resetGame() {
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.isQuizFinished = false;
  quizState.answered = false;
  nextButtonEl.textContent = 'Next Question';
  renderQuestion();
}

nextButtonEl.addEventListener('click', () => {
  if (quizState.isQuizFinished) {
    resetGame();
  } else {
    nextQuestion();
  }
});

renderQuestion();
