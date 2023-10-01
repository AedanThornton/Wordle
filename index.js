let currentLetter = 0;
let currentGuessNumber = 0;
let originalAnswer = "potat";
let answer = originalAnswer;

let gameRunning = true;

function isLetter(key) {
    return key.length === 1 && key.match(/[a-z]/i);
}

//check if adding a letter is valid
function handleLetter(key) {
    if (currentLetter < 5){
        $(".letter").eq(currentLetter + currentGuessNumber * 5).text(key.toUpperCase());
    
        currentLetter++;
    }
}

function compareLetterToAnswer(letterBox, pos) {
    let letterPos = answer.toUpperCase().indexOf(letterBox.text().toUpperCase());

    if (letterPos === -1){
        $(".key").filter(function() {
            return $(this).text().toUpperCase() === letterBox.text().toUpperCase();
        }).addClass("incorrect");
        return;
    }

    if (letterBox.text().toUpperCase() === answer[pos].toUpperCase()) {
        letterBox.addClass("correct");
        $(".key").filter(function() {
            return $(this).text().toUpperCase() === letterBox.text().toUpperCase();
        }).removeClass("partially-correct").addClass("correct");
    } else {
        letterBox.addClass("partially-correct");
        $(".key").filter(function() {
            return $(this).text().toUpperCase() === letterBox.text().toUpperCase();
        }).addClass("partially-correct");
    }

    let answer2 = answer.split(""); //replace checked letter with non-letter
    answer2[letterPos] = "/";       //to avoid double checking it
    answer = answer2.join("");

    return letterBox.text();
}

function submitAnswer() {
    if (currentLetter < 5) {
        return;
    }

    let submittedWord = "";

    for (let i = 0; i < 5; i++){
        submittedWord += compareLetterToAnswer($(".letter").eq(i + currentGuessNumber * 5), i);
    }

    if (submittedWord.toUpperCase() === originalAnswer.toUpperCase()){
        $("body").addClass("correct");
        $(".overlay").css("display", "flex");
        $("h2").text(originalAnswer.toUpperCase());
        gameRunning = false;
    } else if (currentGuessNumber === 5) {
        $("body").addClass("failure");
        $(".overlay").css("display", "flex");
        $("h2").text(originalAnswer.toUpperCase());
        gameRunning = false;
    } else {
        currentGuessNumber++;
        currentLetter = 0;
        answer = originalAnswer;
    }
}

function removeLetter(){
    if (currentLetter > 0){
        currentLetter--;
        $(".letter").eq(currentLetter + currentGuessNumber * 5).text("");
    }
}

function inputHandler(key) {
    if (gameRunning){
        $(".key").filter(function() {
            return $(this).text().toUpperCase() === key.toUpperCase();
        }).addClass("pressed");
        setTimeout(async function () {
            $(".key").filter(function() {
                return $(this).text().toUpperCase() === key.toUpperCase();
            }).removeClass("pressed");
        }, 300);

        if (key === "Enter"){
            submitAnswer();
            return;
        }

        if (key === "Backspace" || key === "Back"){
            removeLetter();
            return;
        }

        if (!isLetter(key)){
            return;
        }

        handleLetter(key);
    }
}

$(document).keydown(function(e) {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior
    }
    inputHandler(e.key);
})

$(".key").click(function () {
    inputHandler($(this).text());
})

async function pickRandomWord() {
    const response = await fetch("wordlist.txt");
    const text = await response.text();

    const words = text.split(/\s+/);

    const randomIndex = Math.floor(Math.random() * words.length);

    return words[randomIndex];
}

async function gameInit() {
    gameRunning = true;
    currentLetter = 0;
    currentGuessNumber = 0;
    $(".overlay").css("display", "none");
    $("body").removeClass("failure correct");
    $(".letter").removeClass("correct partially-correct incorrect").text("");
    $(".key").removeClass("correct partially-correct incorrect");
    
    originalAnswer = await pickRandomWord();

    answer = originalAnswer;
}

$(document).ready(async function() {
    await gameInit();
});

$(".btn").click(async function () {
    await gameInit();
})