const quizState = {
    currentQuestionIndex: 0,
    score: 0,
    isQuizFinished: false
};

function checkAnswer(selectedOptionIndex) {
    if (quizState.isQuizFinished) return;

    const currentQuestion = questions[quizState.currentQuestionIndex];

    if (selectedOptionIndex === currentQuestion.correctAnswer) {
        quizState.score += 10;
    } else {
    }

    if (quizState.currentQuestionIndex < questions.length - 1) {
        quizState.currentQuestionIndex++;
    } else {
        quizState.isQuizFinished = true;
    }

    updateUI(); 
}
//////////////////////////////////////////////////////////////