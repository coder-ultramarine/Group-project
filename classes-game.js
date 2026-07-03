const allQuestions = [
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
  },
  {
    question: 'Which game is a survival game set in the ocean?',
    options: ['Raft', 'Rust', 'Subnautica', 'The Forest'],
    correctAnswer: 0
  },
  {
    question: 'What is the main enemy in Subnautica?',
    options: ['Dragons', 'Reaper Leviathan', 'Sharks', 'Pirates'],
    correctAnswer: 1
  },
  {
    question: 'Which game features the Companion Cube?',
    options: ['Half-Life', 'Portal', 'Team Fortress 2', 'Left 4 Dead'],
    correctAnswer: 1
  },
  {
    question: 'Which game is played on Summoner\'s Rift?',
    options: ['Dota 2', 'League of Legends', 'Smite', 'Heroes of the Storm'],
    correctAnswer: 1
  },
  {
    question: 'What color is Luigi\'s hat?',
    options: ['Red', 'Blue', 'Green', 'Yellow'],
    correctAnswer: 2
  },
  {
    question: 'Which game has Creepers?',
    options: ['Terraria', 'Minecraft', 'Roblox', 'Valheim'],
    correctAnswer: 1
  },
  {
    question: 'Which game lets you build conveyor belts?',
    options: ['Factorio', 'Cities: Skylines', 'RimWorld', 'Raft'],
    correctAnswer: 0
  },
  {
    question: 'Which game features Demogorgons?',
    options: ['Dead by Daylight', 'Phasmophobia', 'Lethal Company', 'Dying Light'],
    correctAnswer: 0
  },
  {
    question: 'What is the maximum level in vanilla Minecraft?',
    options: ['100', 'No maximum', '999', '50'],
    correctAnswer: 1
  },
  {
    question: 'Which game has the map Dust II?',
    options: ['Valorant', 'Counter-Strike 2', 'Rainbow Six Siege', 'PUBG'],
    correctAnswer: 1
  },
  {
    question: 'Which company created Steam?',
    options: ['Blizzard', 'Valve', 'EA', 'Ubisoft'],
    correctAnswer: 1
  },
  {
    question: 'Which game has a Battle Bus?',
    options: ['PUBG', 'Fortnite', 'Apex Legends', 'Warzone'],
    correctAnswer: 1
  },
  {
    question: 'Which game takes place in Night City?',
    options: ['GTA V', 'Cyberpunk 2077', 'Watch Dogs', 'Sleeping Dogs'],
    correctAnswer: 1
  },
  {
    question: 'What do you collect in Lethal Company?',
    options: ['Weapons', 'Scrap', 'Fuel', 'Coins'],
    correctAnswer: 1
  },
  {
    question: 'Which game features Kratos?',
    options: ['God of War', 'Assassin\'s Creed', 'Hades', 'Elden Ring'],
    correctAnswer: 0
  },
  {
    question: 'What color are health potions in Terraria?',
    options: ['Red', 'Blue', 'Green', 'Purple'],
    correctAnswer: 0
  },
  {
    question: 'Which game includes zombies called "Biters"?',
    options: ['Factorio', 'Rust', '7 Days to Die', 'Project Zomboid'],
    correctAnswer: 2
  },
  {
    question: 'Which game has "The End" dimension?',
    options: ['Terraria', 'Minecraft', 'Valheim', 'Core Keeper'],
    correctAnswer: 1
  },
  {
    question: 'Which game is famous for "Praise the Sun"?',
    options: ['Dark Souls', 'Elden Ring', 'Bloodborne', 'Sekiro'],
    correctAnswer: 0
  },
  {
    question: 'Which game has a character named Wheatley?',
    options: ['Portal 2', 'Half-Life 2', 'BioShock', 'Doom'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Silent Assassins?',
    options: ['Hitman', 'Assassin\'s Creed', 'Dishonored', 'Splinter Cell'],
    correctAnswer: 0
  },
  {
    question: 'What is the highest rarity in Rocket League?',
    options: ['Rare', 'Exotic', 'Black Market', 'Common'],
    correctAnswer: 2
  },
  {
    question: 'Which game has vault hunters?',
    options: ['Borderlands', 'Destiny', 'Warframe', 'Fallout'],
    correctAnswer: 0
  },
  {
    question: 'Which game has the Moon Lord?',
    options: ['Terraria', 'Minecraft', 'Valheim', 'Stardew Valley'],
    correctAnswer: 0
  },
  {
    question: 'Which game features Steve?',
    options: ['Roblox', 'Minecraft', 'Terraria', 'Lego Worlds'],
    correctAnswer: 1
  },
  {
    question: 'Which game has "Operators"?',
    options: ['Rainbow Six Siege', 'Counter-Strike', 'Valorant', 'Apex Legends'],
    correctAnswer: 0
  },
  {
    question: 'Which game features the Citadel?',
    options: ['Half-Life 2', 'Doom', 'Fallout', 'BioShock'],
    correctAnswer: 0
  },
  {
    question: 'Which game is made by Mojang?',
    options: ['Terraria', 'Minecraft', 'Roblox', 'Valheim'],
    correctAnswer: 1
  },
  {
    question: 'Which game has the Ghost Face killer?',
    options: ['Dead by Daylight', 'Friday the 13th', 'Phasmophobia', 'Resident Evil'],
    correctAnswer: 0
  },
  {
    question: 'Which game lets you farm crops?',
    options: ['Stardew Valley', 'Terraria', 'Rust', 'GTA V'],
    correctAnswer: 0
  },
  {
    question: 'Which game has the Combine?',
    options: ['Half-Life 2', 'Portal', 'Doom', 'Quake'],
    correctAnswer: 0
  },
  {
    question: 'Which game has an Eye of Cthulhu boss?',
    options: ['Terraria', 'Minecraft', 'Core Keeper', 'Valheim'],
    correctAnswer: 0
  },
  {
    question: 'Which game has creepers that explode?',
    options: ['Minecraft', 'Terraria', 'Rust', 'Raft'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Arthur Morgan?',
    options: ['Red Dead Redemption 2', 'GTA V', 'Mafia', 'Max Payne'],
    correctAnswer: 0
  },
  {
    question: 'Which game has CJ?',
    options: ['GTA: San Andreas', 'GTA V', 'Saints Row', 'Mafia'],
    correctAnswer: 0
  },
  {
    question: 'Which game is about escaping monsters while repairing generators?',
    options: ['Dead by Daylight', 'Friday the 13th', 'Left 4 Dead', 'Phasmophobia'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Link?',
    options: ['The Legend of Zelda', 'Skyrim', 'Witcher', 'Elden Ring'],
    correctAnswer: 0
  },
  {
    question: 'Which game features Aloy?',
    options: ['Horizon Zero Dawn', 'Tomb Raider', 'Assassin\'s Creed', 'Skyrim'],
    correctAnswer: 0
  },
  {
    question: 'Which game has vaults and Pip-Boys?',
    options: ['Fallout', 'Metro', 'S.T.A.L.K.E.R.', 'BioShock'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Big Daddies?',
    options: ['BioShock', 'Fallout', 'Half-Life', 'Doom'],
    correctAnswer: 0
  },
  {
    question: 'Which game has a Gravity Gun?',
    options: ['Half-Life 2', 'Portal', 'Doom', 'Quake'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Slimes as common enemies?',
    options: ['Terraria', 'Minecraft', 'Stardew Valley', 'Core Keeper'],
    correctAnswer: 0
  },
  {
    question: 'Which game has the dragon Alduin?',
    options: ['Skyrim', 'Oblivion', 'Witcher 3', 'Elden Ring'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Geralt?',
    options: ['The Witcher 3', 'Skyrim', 'Dragon Age', 'Elden Ring'],
    correctAnswer: 0
  },
  {
    question: 'Which game features the Lands Between?',
    options: ['Elden Ring', 'Dark Souls', 'Bloodborne', 'Skyrim'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Master Chief?',
    options: ['Halo', 'Doom', 'Destiny', 'Titanfall'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Doom Slayer?',
    options: ['DOOM', 'Quake', 'Halo', 'Wolfenstein'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Vault Boy?',
    options: ['Fallout', 'Borderlands', 'BioShock', 'Metro'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Claptrap?',
    options: ['Borderlands', 'Destiny', 'Warframe', 'Halo'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Isaac Clarke?',
    options: ['Dead Space', 'Alien Isolation', 'Doom', 'Resident Evil'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Nemesis?',
    options: ['Resident Evil 3', 'Dead Space', 'Left 4 Dead', 'Outlast'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Pyramid Head?',
    options: ['Silent Hill', 'Resident Evil', 'Dead by Daylight', 'Outlast'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Joel and Ellie?',
    options: ['The Last of Us', 'Days Gone', 'Resident Evil', 'Metro'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Jin Sakai?',
    options: ['Ghost of Tsushima', 'Sekiro', 'Nioh', 'Assassin\'s Creed'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Zagreus?',
    options: ['Hades', 'Diablo', 'Bastion', 'Transistor'],
    correctAnswer: 0
  },
  {
    question: 'Which game has a ghost named Boo?',
    options: ['Super Mario', 'Luigi\'s Mansion', 'Kirby', 'Donkey Kong'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Yoshi?',
    options: ['Super Mario', 'Kirby', 'Sonic', 'Zelda'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Sonic?',
    options: ['Sonic the Hedgehog', 'Crash Bandicoot', 'Rayman', 'Spyro'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Crash?',
    options: ['Crash Bandicoot', 'Spyro', 'Ratchet & Clank', 'Jak & Daxter'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Spyro?',
    options: ['Spyro Reignited Trilogy', 'Crash Bandicoot', 'Rayman', 'Banjo-Kazooie'],
    correctAnswer: 0
  },
  {
    question: 'Which game has the character Kirby?',
    options: ['Kirby', 'Mario', 'Zelda', 'Metroid'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Samus Aran?',
    options: ['Metroid', 'Halo', 'Doom', 'Destiny'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Pikachu?',
    options: ['Pokémon', 'Digimon', 'Palworld', 'Temtem'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Pal spheres?',
    options: ['Palworld', 'Pokémon', 'Ark', 'Rust'],
    correctAnswer: 0
  },
  {
    question: 'Which game has dinosaurs?',
    options: ['ARK: Survival Ascended', 'Rust', 'Raft', 'Valheim'],
    correctAnswer: 0
  },
  {
    question: 'Which game has a train called Karl?',
    options: ['Choo-Choo Charles', 'Thomas Simulator', 'Train Sim World', 'Metro'],
    correctAnswer: 0
  },
  {
    question: 'Which game has animatronics?',
    options: ['Five Nights at Freddy\'s', 'Outlast', 'Lethal Company', 'Poppy Playtime'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Huggy Wuggy?',
    options: ['Poppy Playtime', 'FNAF', 'Bendy', 'Little Nightmares'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Ink Demon?',
    options: ['Bendy and the Ink Machine', 'Outlast', 'FNAF', 'Resident Evil'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Mono and Six?',
    options: ['Little Nightmares II', 'Limbo', 'Inside', 'Bramble'],
    correctAnswer: 0
  },
  {
    question: 'Which game has The Lamb?',
    options: ['Cult of the Lamb', 'Hades', 'Binding of Isaac', 'Hollow Knight'],
    correctAnswer: 0
  },
  {
    question: 'Which game features Hornet?',
    options: ['Hollow Knight', 'Ori', 'Dead Cells', 'Celeste'],
    correctAnswer: 0
  },
  {
    question: 'Which game stars Ori?',
    options: ['Ori and the Blind Forest', 'Hollow Knight', 'Celeste', 'Limbo'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Madeline?',
    options: ['Celeste', 'Ori', 'Hollow Knight', 'Gris'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Isaac?',
    options: ['The Binding of Isaac', 'Dead Space', 'Fallout', 'BioShock'],
    correctAnswer: 0
  },
  {
    question: 'Which game has Guy Spelunky?',
    options: ['Spelunky', 'Dead Cells', 'Rogue Legacy', 'Noita'],
    correctAnswer: 0
  },
  {
    question: 'Which game lets you dig almost every pixel?',
    options: ['Noita', 'Terraria', 'Minecraft', 'Core Keeper'],
    correctAnswer: 0
  },
  {
    question: 'Which game has a talking potato named GLaDOS?',
    options: ['Portal 2', 'Half-Life 2', 'BioShock', 'Team Fortress 2'],
    correctAnswer: 0
  },
  {
    question: 'Which game\'s mascot is Heavy?',
    options: ['Team Fortress 2', 'Counter-Strike 2', 'Overwatch', 'Left 4 Dead 2'],
    correctAnswer: 0
  },
  {
    question: 'Which Steam game has the slogan "Mann vs. Machine"?',
    options: ['Team Fortress 2', 'Counter-Strike 2', 'Dota 2', 'Left 4 Dead 2'],
    correctAnswer: 0
  }
];

const quizState = {
  currentQuestionIndex: 0,
  score: 0,
  isQuizFinished: false,
  answered: false,
  questions: []
};

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const scoreEl = document.getElementById('score');
const progressTextEl = document.getElementById('progressText');
const feedbackEl = document.getElementById('feedback');
const nextButtonEl = document.getElementById('nextButton');

function shuffleArray(items) {
  const clonedItems = [...items];
  for (let index = clonedItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [clonedItems[index], clonedItems[swapIndex]] = [clonedItems[swapIndex], clonedItems[index]];
  }
  return clonedItems;
}

function pickQuestionSet() {
  return shuffleArray(allQuestions).slice(0, 20);
}

function renderQuestion() {
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const shuffledOptions = shuffleArray(
    currentQuestion.options.map((option, index) => ({ option, originalIndex: index }))
  );
  currentQuestion.displayOptions = shuffledOptions.map((item) => item.option);
  currentQuestion.correctDisplayIndex = shuffledOptions.findIndex((item) => item.originalIndex === currentQuestion.correctAnswer);

  questionEl.textContent = currentQuestion.question;
  progressTextEl.textContent = `Question ${quizState.currentQuestionIndex + 1} of ${quizState.questions.length}`;
  scoreEl.textContent = quizState.score;
  feedbackEl.textContent = '';
  nextButtonEl.classList.add('hidden');
  optionsEl.innerHTML = '';

  const answerLabels = ['A', 'B', 'C', 'D'];
  currentQuestion.displayOptions.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.dataset.label = answerLabels[index] || '';
    button.textContent = option;
    button.addEventListener('click', () => checkAnswer(index));
    optionsEl.appendChild(button);
  });

  quizState.answered = false;
}

function checkAnswer(selectedOptionIndex) {
  if (quizState.isQuizFinished || quizState.answered) return;

  quizState.answered = true;
  const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
  const buttons = optionsEl.querySelectorAll('.option-btn');
  const correctIndex = currentQuestion.correctDisplayIndex;

  buttons.forEach((button, index) => {
    button.disabled = true;
    if (index === correctIndex) {
      button.classList.add('correct');
    }
    if (index === selectedOptionIndex && index !== correctIndex) {
      button.classList.add('wrong');
    }
  });

  if (selectedOptionIndex === correctIndex) {
    quizState.score += 10;
    feedbackEl.textContent = 'Correct!';
  } else {
    feedbackEl.textContent = `Not quite. The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`;
  }

  scoreEl.textContent = quizState.score;
  nextButtonEl.classList.remove('hidden');
}

function nextQuestion() {
  if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
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
  feedbackEl.innerHTML = `<div class="result-box">You scored ${quizState.score} points out of ${quizState.questions.length * 10}.</div>`;
  nextButtonEl.textContent = 'Play Again';
  nextButtonEl.classList.remove('hidden');
}

function resetGame() {
  quizState.currentQuestionIndex = 0;
  quizState.score = 0;
  quizState.isQuizFinished = false;
  quizState.answered = false;
  quizState.questions = pickQuestionSet();
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

resetGame();