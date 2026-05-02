let questions = [];

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

async function fetchQuestions() {
    const res = await fetch("https://opentdb.com/api.php?amount=10&difficulty=medium&type=multiple");
    const data = await res.json();

    questions = data.results.map(q => {
        const incorrect = q.incorrect_answers.map(a => ({ text: a, correct: false }));
        const correct = { text: q.correct_answer, correct: true };

        const allAnswers = [...incorrect, correct];

        // shuffle answers
        allAnswers.sort(() => Math.random() - 0.5);

        return {
            question: q.question,
            answers: allAnswers
        };
    });

    startQuiz();
}

function decodeHTML(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}


function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + decodeHTML(currentQuestion.question);

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = decodeHTML(answer.text);
        button.classList.add("btn");
        answerButtons.appendChild(button);  
        if(answer.correct){
            button.dataset.correct = answer.correct;
        } 
        button.addEventListener("click", selectAnswer) ;    
    });
}

function resetState() {
    nextButton.style.display = "none";
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild)
    }
}

function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    if(isCorrect){
        selectedBtn.classList.add("correct");
        score++;
    }else{    
        selectedBtn.classList.add("incorrect");
    }
    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    })
    nextButton.style.display = "block";

}

function showScore() {
    resetState();
    questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

function handleNextButton() {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener("click", ()=>{
    if(currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
})
fetchQuestions();
