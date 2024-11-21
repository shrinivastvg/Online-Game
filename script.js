const phaseQuestions = {
    basic: [
        { question: "What is the main water source for the town?", options: ["Amaravathi River", "Groundwater", "Rainwater Harvesting"], answer: "Amaravathi River" },
        { question: "What technology is proposed for real-time monitoring?", options: ["SCADA", "IoT", "GPS"], answer: "SCADA" },
        { question: "What is the issue with the current water distribution network?", options: ["Too modern", "Outdated and inefficient", "Overcapacity"], answer: "Outdated and inefficient" },
    ],
    intermediate: [
        { question: "Which practice is crucial for river rejuvenation?", options: ["Sustainable practices", "Rapid industrialization", "Increased groundwater extraction"], answer: "Sustainable practices" },
        { question: "What is the purpose of SCADA technology?", options: ["Real-time monitoring", "Improving aesthetics", "Financial tracking"], answer: "Real-time monitoring" },
    ],
    advanced: [
        { question: "What should the ESCMF framework ensure?", options: ["Compliance with climate guidelines", "Random selection of guidelines", "No guidelines needed"], answer: "Compliance with climate guidelines" },
        { question: "What should be avoided in water management projects?", options: ["Community involvement", "Sustainability", "Excessive groundwater extraction"], answer: "Excessive groundwater extraction" },
    ],
};

let currentQuestionIndex = 0;
let score = 0;
let currentPhase = "basic"; // Default phase
let timeLeft = 20;
let timer;
const completedPhases = { basic: false, intermediate: false, advanced: false };

// Get the audio element
const backgroundMusic = document.getElementById("background-music");

// Function to start the music
function startMusic() {
    backgroundMusic.play();
}

// Function to stop the music
function stopMusic() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset to the beginning
}

// Function to display the quiz and start the music
function showQuiz() {
    document.getElementById("quiz-container").style.display = "flex";
    document.getElementById("scenario-page").style.display = "none";
    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("congratulations-page").style.display = "none";
    startMusic(); // Start the music when the quiz is displayed
}

// Function to hide the quiz and stop the music
function hideQuiz() {
    document.getElementById("quiz-container").style.display = "none";
    stopMusic(); // Stop the music when the quiz is hidden
}

function toggleMute() {
    if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        document.getElementById("mute-button").innerText = "Mute";
    } else {
        backgroundMusic.muted = true;
        document.getElementById("mute-button").innerText = "Unmute";
    }
}

// Function to show the Scenario Page
function showScenarioPage() {
    hideQuiz(); // Stop music and hide the quiz container
    document.getElementById("scenario-page").style.display = "flex";
}

// Function to show the Congratulations Page
function showCongratulationsPage() {
    hideQuiz(); // Stop music and hide the quiz container
    document.getElementById("congratulations-page").style.display = "flex";
}

// Function to navigate from the Welcome Page to the Scenario Page
function navigateToScenario() {
    const name = document.getElementById("name").value;
    const department = document.getElementById("department").value;
    const designation = document.getElementById("designation").value;

    if (!name || !department || !designation) {
        alert("Please enter your name, designation, and department.");
        return;
    }

    document.getElementById("welcome-page").style.display = "none";
    document.getElementById("scenario-page").style.display = "flex";
}

// Function to start a quiz phase
function startPhase(phase) {
    currentPhase = phase; // Set the current phase
    currentQuestionIndex = 0; // Reset question index
    score = 0; // Reset score for the phase
    document.getElementById("score-value").innerText = score;

    // Display the quiz and start music
    showQuiz();

    loadQuestion(); // Load the first question for the phase
}

// Function to update the phase and handle transitions
function updatePhase() {
    const questions = phaseQuestions[currentPhase];

    // Check if all answers in the current phase are correct
    if (score === questions.length) {
        if (currentPhase === "basic") {
            completedPhases.basic = true;
            document.getElementById("intermediate-btn").disabled = false; // Enable Intermediate button
            alert("Congratulations! You unlocked the Intermediate Phase!");
            showScenarioPage(); // Show the scenario page and stop music
        } else if (currentPhase === "intermediate") {
            completedPhases.intermediate = true;
            document.getElementById("advanced-btn").disabled = false; // Enable Advanced button
            alert("Great work! You unlocked the Advanced Phase!");
            showScenarioPage(); // Show the scenario page and stop music
        } else if (currentPhase === "advanced") {
            completedPhases.advanced = true;
            alert("Quiz Completed!");
            showCongratulationsPage(); // Show the congratulations page and stop music
        }
    } else {
        alert(`You scored ${score}/${questions.length}. Try again to unlock the next phase!`);
        showScenarioPage(); // Show the scenario page and stop music
    }
}

// Function to check the answer
function checkAnswer(selectedOption, correctAnswer, element) {
    if (selectedOption === correctAnswer) {
        score++;
        element.classList.add("correct");
        document.getElementById("score-value").innerText = score; // Update displayed score
    } else {
        element.classList.add("incorrect");
        document.querySelectorAll("#options li").forEach(li => {
            if (li.innerText === correctAnswer) {
                li.classList.add("correct");
            }
        });
    }

    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 1000); // Delay before loading the next question
}

// Function to load a question
function loadQuestion() {
    const questions = phaseQuestions[currentPhase];
    if (currentQuestionIndex >= questions.length) {
        updatePhase(); // Handle phase completion
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById("question").innerText = question.question;
    const optionsList = document.getElementById("options");
    optionsList.innerHTML = "";

    question.options.forEach(option => {
        const li = document.createElement("li");
        li.innerText = option;
        li.onclick = () => checkAnswer(option, question.answer, li);
        optionsList.appendChild(li);
    });

    resetTimer(); // Start/reset the timer for the current question

}

// Function to reset the timer
function resetTimer() {
    clearInterval(timer); // Clear any existing timer
    timeLeft = 20; // Reset time to 20 seconds
    updateTimerDisplay(); // Update the visual display of the timer

    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timer); // Stop the timer
            document.getElementById("timer").classList.add("time-up");
            setTimeout(() => {
                currentQuestionIndex++;
                loadQuestion(); // Move to the next question
            }, 1000);
        }
    }, 1000); // Decrement timer every second
}

function updateTimerDisplay() {
    document.getElementById("time-left").innerText = timeLeft;
    const circleCircumference = 339.12; // Circumference of the circle (2πr where r=54)
    document.getElementById("timer-circle").style.strokeDashoffset =
        circleCircumference - (circleCircumference * timeLeft) / 20;
    document.getElementById("timer").classList.remove("time-up");
}

// Function to restart the quiz
function restartQuiz() {
    location.reload(); // Refresh the page to restart
}
