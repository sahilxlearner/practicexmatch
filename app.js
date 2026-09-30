let questionNumber = 1;
let currentQuestion = [];
let shuffledMatches = [];

async function loadQuestions() {
    try {
        const response = await fetch("data/english/vocabulary.json");
        const data = await response.json();

        generateQuestion(data);
    } catch (error) {
        console.error("Error loading questions:", error);
    }
}


// ========================================
// SHUFFLE
// ========================================

function shuffle(array) {
    const newArray = [...array];

    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [newArray[i], newArray[j]] =
        [newArray[j], newArray[i]];
    }

    return newArray;
}


// ========================================
// GENERATE QUESTION
// ========================================

function generateQuestion(data) {

    // Pick 4 random pairs
    currentQuestion = shuffle(data).slice(0, 4);

    // Shuffle meanings for Column B
    shuffledMatches = shuffle(currentQuestion);

    const columnA = document.getElementById("column-a");
    const columnB = document.getElementById("column-b");

    columnA.innerHTML = "";
    columnB.innerHTML = "";


    // ========================================
    // COLUMN A
    // ========================================

    currentQuestion.forEach((item, index) => {

        const div = document.createElement("div");

        div.className = "match-item";

        div.innerHTML = `
            <strong>${String.fromCharCode(65 + index)}.</strong>

            <span class="term">
                ${item.term}
            </span>

            <select>
                <option value="">Select match</option>

                ${shuffledMatches.map((match) => `
                    <option value="${match.term}">
                        ${match.match}
                    </option>
                `).join("")}

            </select>
        `;

        columnA.appendChild(div);
    });


    // ========================================
    // COLUMN B
    // ========================================

    shuffledMatches.forEach((item, index) => {

        const div = document.createElement("div");

        div.className = "match-item";

        div.innerHTML = `
            <span class="number">
                ${index + 1}.
            </span>

            <span>
                ${item.match}
            </span>
        `;

        columnB.appendChild(div);
    });


    // ========================================
    // RESET
    // ========================================

    const result = document.getElementById("result");

    result.textContent = "";
    result.classList.add("hidden");

    document.getElementById("submit-btn")
        .classList.remove("hidden");

    document.getElementById("next-btn")
        .classList.add("hidden");

    document.getElementById("question-number")
        .textContent = `Question ${questionNumber}`;
}


// ========================================
// CHECK ANSWERS
// ========================================

function checkAnswer() {

    const selects =
        document.querySelectorAll("#column-a select");

    let score = 0;


    selects.forEach((select, index) => {

        const selectedTerm = select.value;

        const correctTerm =
            currentQuestion[index].term;


        // Check answer
        if (selectedTerm === correctTerm) {

            score++;

            select.classList.add("correct");

        } else {

            select.classList.add("wrong");
        }


        // ====================================
        // LOCK ANSWER
        // ====================================

        select.disabled = true;

    });


    // ========================================
    // SHOW SCORE
    // ========================================

    const result =
        document.getElementById("result");

    result.textContent =
        `Score: ${score} / 4`;

    result.classList.remove("hidden");


    // ========================================
    // LOCK SUBMIT
    // ========================================

    document.getElementById("submit-btn")
        .classList.add("hidden");


    // ========================================
    // SHOW NEXT
    // ========================================

    document.getElementById("next-btn")
        .classList.remove("hidden");
}


// ========================================
// NEXT QUESTION
// ========================================

function nextQuestion() {

    questionNumber++;

    loadQuestions();
}


// ========================================
// BUTTON EVENTS
// ========================================

document.getElementById("submit-btn")
    .addEventListener("click", checkAnswer);

document.getElementById("next-btn")
    .addEventListener("click", nextQuestion);


// ========================================
// START
// ========================================

loadQuestions();