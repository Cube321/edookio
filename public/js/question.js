let questions = [];
let editedQuestions = [];
let previousQuestion = 0;
let nextQuestion = 0;
let currentQuestion = 0;
let sectionId = "";
let categoryId = "";

$(document).ready(function() {
    //get section ID from DOM element 
    sectionId = $("#sectionId").attr("name");
    
    //create getCardsUrl
    let getQuestionsUrl = `/api/getQuestions/section/${sectionId}`

    if(sectionId === "random_test"){
        let category = $("#sectionId").attr("cat");
        getQuestionsUrl = `/api/getQuestions/section/${sectionId}?category=${category}`
    }

    //get cards
    $.ajax({
        method: "GET",
        url: getQuestionsUrl
    })
    .then(data => {
        return JSON.parse(data);
    })
    .then(data => {
        questions = data.questions;
        questions.forEach(question => {
            let editedQuestion = {
                status: 'none',
                answersArray: [],
                _id: question._id,
                section: question.section,
                category: question.category,
                question: question.question,
                correctAns: {ans: question.correctAnswers[0], clicked: false, type: "correct"},
                wrongAns1: {ans: question.wrongAnswers[0], clicked: false, type: "wrong1"},
                wrongAns2: {ans: question.wrongAnswers[1], clicked: false, type: "wrong2"}
            }
            editedQuestions.push(editedQuestion);
        })
        if(editedQuestions.length < 1){
            return handleError();
        }
        if(sectionId === "random_test"){
            $(".questions-length-span").empty().append(editedQuestions.length);
        }
        categoryId = questions[0].category;
        renderListOfQuestions();
        renderQuestion(0);
    })
    .catch(err => console.log(err));


    function renderQuestion(index){
        currentQuestion = index;
        previousQuestion = currentQuestion - 1;
        if(previousQuestion < 0) {
            previousQuestion = 0;
        }
        nextQuestion = currentQuestion + 1;

        let questionData = editedQuestions[currentQuestion];
        let question = questionData.question;
        let correctAnswer = questionData.correctAns;
        let wrongAnswer1 = questionData.wrongAns1;
        let wrongAnswer2 = questionData.wrongAns2;
        let progressStatus = Math.round(index * 100 / questions.length);
        let answersArray = [correctAnswer, wrongAnswer1, wrongAnswer2];
        if(questionData.answersArray.length > 0){
            answersArray = questionData.answersArray;
        } else {
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  // Swap array[i] and array[j]
                  [array[i], array[j]] = [array[j], array[i]];
                }
              }
              shuffleArray(answersArray);
        }
        
        //update card content
        $("#question-card").empty();
        $("#question-card").append(`
            <div class="" id="question-content">
                <p class="question">${question}</p>
                <ul class="answers-list">
                    ${answersArray.map(ans => `
                    <li class="answer-item ${ans.type === "correct" && ans.clicked ? 'correct' : null} ${ans.type === "wrong1" && ans.clicked ? 'wrong' : null} ${ans.type === "wrong2" && ans.clicked ? 'wrong' : null}"
                        id=${ans.type}>${ans.ans}
                    </li>`).join('')}
                </ul>
            </div>
        `);

        //previous btns disabled on first card
        $("#btn-predchozi-back").removeClass('disabled');
        if(currentQuestion === 0){
            $("#btn-predchozi-back").addClass('disabled');
        }


        //update service btns
        $('#btn-upravit').attr('href', `/category/${questionData.category}/section/${questionData.section}/questions/${questionData._id}/edit`);
        $('#btn-nahlasit').attr('href', `/category/${questionData.category}/section/${questionData.section}/questions/${questionData._id}/reportMistake`);

        //update progress bars
        $("#progressNumMac").text(currentQuestion + 1);
        $("#progressBarMac").css("width", `${progressStatus}%`);
        $("#progressBarStatusMacNum").text(`${progressStatus}`);
        $("#progressBarMobile").css("width", `${progressStatus}%`);
        $("#progressNumMobile").text(currentQuestion + 1);
        $("#progressBarStatusMobileNum").text(`${progressStatus}`);

        //update list of questions
        renderListOfQuestions();

        //update counters
        updateQuestionsCounters();

        //evaluate answer
        $('.answer-item').click(function() {
            if(editedQuestions[currentQuestion].status === "none" || editedQuestions[currentQuestion].status === "skipped"){
                editedQuestions[currentQuestion].correctAns.clicked = true;
                editedQuestions[currentQuestion].answersArray = answersArray;
                if($(this).attr('id') === "correct"){
                    $(this).addClass("correct");
                    editedQuestions[currentQuestion].status = 'correct';
                    renderListOfQuestions();
                } else {
                    $(this).addClass("wrong");
                    $("#correct").addClass('correct');
                    if($(this).attr('id') === "wrong1"){
                        editedQuestions[currentQuestion].wrongAns1.clicked = true;
                    }
                    if($(this).attr('id') === "wrong2"){
                        editedQuestions[currentQuestion].wrongAns2.clicked = true;
                    }
                    editedQuestions[currentQuestion].status = 'wrong';
                    renderListOfQuestions();
                }
            }
        })

        //remove gradient on scroll
        $("#question-card").scroll(function(){
            $(this).removeClass('text-gradient');
        })

    }

    function renderListOfQuestions(){
        $("#questions-list").empty().append(`
            ${editedQuestions.map((question, i) => `<div class="questions-list-item ${question._id === editedQuestions[currentQuestion]._id ? "active" : null} ${question.status === "correct" ? "correct" : null}  ${question.status === "wrong" ? "wrong" : null}">${i + 1}</div>`).join('')}
        `)

        $("#questions-list-mobile").empty().append(`
            ${editedQuestions.map((question, i) => `<div class="questions-list-item ${question._id === editedQuestions[currentQuestion]._id ? "active" : null} ${question.status === "correct" ? "correct" : null}  ${question.status === "wrong" ? "wrong" : null}">${i + 1}</div>`).join('')}
        `)

        //update list of questions
        $(".questions-list-item").click(function(){
            let selectedQuestion = parseInt($(this).text()) - 1;
            renderQuestion(selectedQuestion);
        })
    }

    function handleError(){
        $("#question-card").empty();
        $("#question-card").append(`
            <div class="mt-5 pt-5 text-center" id="question-content">
                <h4 class="">Je nám líto, nenalezli jsme žádné otázky.</h4>
                <p class="">Je možné, že otázky zatím nebyly zveřejněny pro studenty nebo jsou dostupné pouze s předplatným Premium.</p>
            </div>
        `);

        $("#questions-list").empty().append(` `);
        $("#questions-list-mobile").empty().append(` `);
        $(".back-menu").empty().append(` `)
    }

    function updateQuestionsCounters(){
        $.ajax({
            method: "POST",
            url: "/api/updateUsersQuestionsCounters"
        })
    }


    //handle moving between cards
    $("#btn-dalsi").click((e) => {
        e.preventDefault();
        //redirect if finished
        if(nextQuestion === questions.length){
            $("#question-card").empty().append(`
            <div id="question-content" class="d-flex justify-content-center align-items-center" style="height: 100%">
                <div class="card-text m-4 text-center"><div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div></div>
            </div>`
            );
            let counters = {
                correct: 0,
                wrong: 0,
                skipped: 0
            }
            editedQuestions.forEach(question => {
                if(question.status === "correct"){counters.correct++};
                if(question.status === "wrong"){counters.wrong++};
                if(question.status === "none"){counters.skipped++};
                if(question.status === "skipped"){counters.skipped++};
            })
            if(sectionId === "random_test"){
                return window.location.replace(`/category/${categoryId}/testRandomFinished?correct=${counters.correct}&wrong=${counters.wrong}&skipped=${counters.skipped}&`);
            }
            return window.location.replace(`/category/${categoryId}/section/${sectionId}/testFinished?correct=${counters.correct}&wrong=${counters.wrong}&skipped=${counters.skipped}&`);
        } else {
            //render next card
            if(editedQuestions[currentQuestion].status === 'none'){
                editedQuestions[currentQuestion].status = 'skipped'
            }
            renderQuestion(nextQuestion);

        }
      })

    $("#btn-predchozi-back").click((e) => {
        e.preventDefault();
        renderQuestion(previousQuestion);
    })
});