let push = 0;
let cards = [];
let isPremium = false;
let userEmail = "";
let previousCard = 0;
let nextCard = 0;
let currentCard = 0;
let sectionId = "";
let receivedData = {};
let demoCardsSeen = 0;

$(document).ready(function() {
    //get section ID from DOM element 
    sectionId = $("#sectionId").attr("name");
    
    //create getCardsUrl
    let getCardsUrl = `/api/getCards/section/${sectionId}`

    //get cards
    $.ajax({
        method: "GET",
        url: getCardsUrl
    })
    .then(data => {
        cards = data.cards;
        receivedData = data;
        if(data.user){
            isPremium = data.user.isPremium;
            userEmail = data.user.email;
            startAt = data.startAt;
            demoCardsSeen = data.demoCardsSeen;
        }
        $("#btn-otocit").removeClass('disabled'); 
        renderCard(startAt);
    })
    .catch(err => console.log(err));


    function renderCard(index){
        console.log(demoCardsSeen);
        if(demoCardsSeen >= 5){
            return showDemoFinishedPage();
        }
        currentCard = index;
        previousCard = currentCard - 1;
        if(previousCard < 0) {
            previousCard = 0;
        }
        nextCard = currentCard + 1;
        let cardFront = cards[index].pageA;
        let cardBack = cards[index].pageB;
        let progressStatus = Math.round(index * 100 / cards.length);

        //check demo limit
        if(receivedData.user === "none"){
            console.log('neni user');
        }
        
        //update card content
        $("#flip-card").empty();
        $("#flip-card").append(`
            <div class="border-grey flip-card-inner" id="flip-card-inner">
                <div class="card-body flip-card-front p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="front-main-content d-flex justify-content-center align-items-center">
                    <div class="card-text m-4 text-center" id="pageA">${cardFront}</div>
                    </div>
                </div>
                <div class="card-body flip-card-back p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="back-main-content d-flex justify-content-center align-items-center text-gradient">
                    <div class="card-text m-4" id="pageB">${cardBack}</div>
                    </div>
                </div>
            </div>
        `);

        //previous btns disabled on first card
        $("#btn-predchozi-front").removeClass('disabled');
        if(currentCard === 0){
            $("#btn-predchozi-front").addClass('disabled');
        }

        $("#btn-predchozi-back").removeClass('disabled');
        if(currentCard === 0){
            $("#btn-predchozi-back").addClass('disabled');
        }

        //update star icon - save/unsaved when rendering
        if(isPremium){
            if(cards[index].isSaved){
                $("#star-div").empty().append(`<div id="save-star-unsave" class="save-star" style="cursor:pointer"><i class="fas fa-star fa-lg"></i></div>`);
            } else {
                $("#star-div").empty().append(`<div id="save-star-save" class="save-star" style="cursor:pointer"><i class="far fa-star fa-lg"></i></div>`);
            }
        } else {
            $("#star-div").empty().append(`<div id="" class="save-star" style="cursor:pointer"><a href="#" data-bs-toggle="modal" data-bs-target="#savePremium"><i class="far fa-star fa-lg menu-icon"></i></a></div>`)
        }

        //update service btns
        $('#btn-upravit').attr('href', `/cards/edit/${cards[index]._id}`);
        $('#btn-odstranit').attr('href', `/cards/remove/${cards[index]._id}`);
        $('#btn-nahlasit').attr('href', `/cards/report/${cards[index]._id}`);

        //update progress bars
        $("#progressNumMac").text(currentCard + 1);
        $("#progressBarMac").css("width", `${progressStatus}%`);
        $("#progressBarStatusMacNum").text(`${progressStatus}`);
        $("#progressBarMobile").css("width", `${progressStatus}%`);
        $("#progressNumMobile").text(currentCard + 1);
        $("#progressBarStatusMobileNum").text(`${progressStatus}`);


        //remove gradient on scroll
        $(".back-main-content").scroll(function(){
            $("#flip-card .back-main-content").removeClass('text-gradient');
        })
    }

    //handle moving between cards
    $("#btn-dalsi").click((e) => {
        e.preventDefault();
        //redirect if finished
        if(nextCard === cards.length){
            $("#pageB").empty().append(`<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`);
            return window.location.replace(`/category/section/${sectionId}/finished`);
        } else {
            //render next card
            $("#flip-card").toggleClass('flipped');
            $("#back-menu-row").toggleClass('hide');
            $("#front-menu-row").toggleClass('hide');
            //render next card
            renderCard(nextCard);

            //update last seen card in DB
            updateLastSeenCardInDB(nextCard);

            //set push to 0
            push = 0;
        }
      })

    $("#btn-predchozi-front").click((e) => {
        e.preventDefault();
        renderCard(previousCard);
        push = 0;
        //update lastSeenCard in DB
        updateLastSeenCardInDB(nextCard);
    })

    $("#btn-predchozi-back").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        renderCard(previousCard);
        push = 0;
        //update lastSeenCard in DB
        updateLastSeenCardInDB(nextCard);
    })

    //favorite cards logic
    //save
    $("#star-div").on('click','#save-star-save', function(){
        //add loader
        $("#star-div").empty().append(`<div class='spinner-border spinner-border-small save-star-spinner' role='status'><span class='visually-hidden'>Loading...</span></div>`);

        //save on object localy
        cards[currentCard].isSaved = true;

        //create saveUrl
        let saveUrl = `/cards/save/${userEmail}/${cards[currentCard]._id}`;
        
        //save in DB
        $.ajax({
            method: "POST",
            url: `${saveUrl}`
        })
        .then(res => {
            $("#star-div").empty().append(`<div id="save-star-unsave" class="save-star" style="cursor:pointer"><i class="fas fa-star fa-lg"></i></div>`);
        })
        .catch(err => console.log(err)); 
    })
    
    $("#star-div").on('click','#save-star-unsave', function(){
        //add loader
        $("#star-div").empty().append(`<div class='spinner-border spinner-border-small save-star-spinner' role='status'><span class='visually-hidden'>Loading...</span></div>`);

        //save on object localy
        cards[currentCard].isSaved = false;

        //create saveUrl
        let saveUrl = `/cards/unsave/${userEmail}/${cards[currentCard]._id}`;
        
        //save in DB
        $.ajax({
            method: "POST",
            url: `${saveUrl}`
        })
        .then(res => {
            $("#star-div").empty().append(`<div id="save-star-save" class="save-star" style="cursor:pointer"><i class="far fa-star fa-lg"></i></div>`);
        })
        .catch(err => console.log(err)); 
    })

    //handle flipping
    $("#btn-otocit").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        push++;
    })

    $("#rotate-back").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        push--;
    })

    //flip with space
    document.body.onkeyup = function(e) {
        if ((e.key == " " || e.code == "Space") && ($("#data-loaded").length || push === 0)) {
            push++;
            if(push === 1){
                $("#flip-card").toggleClass('flipped');
                $("#back-menu-row").toggleClass('hide');
                $("#front-menu-row").toggleClass('hide');
            }
            if(push === 2){
                //redirect if finished
                if(nextCard === cards.length){
                    $("#pageB").empty().append(`<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`);
                    return window.location.replace(`/category/section/${sectionId}/finished`);
                } else {
                //else render next card
                    $("#flip-card").toggleClass('flipped');
                    $("#back-menu-row").toggleClass('hide');
                    $("#front-menu-row").toggleClass('hide');
                    renderCard(nextCard);
                    push = 0;
                    //update lastSeenCard in DB
                    updateLastSeenCardInDB(nextCard);
                }
            }
        }
    }
});

function updateLastSeenCardInDB(card){
    let updateLastCardUrl = `/api/updateLastSeenCard/section/${sectionId}/${card}`
        $.ajax({
            method: "POST",
            url: `${updateLastCardUrl}`
        })
        .then(res => {
            return demoCardsSeen = res.demoCardsSeen;
        })
        .catch(err => console.log(err)); 
}

function showDemoFinishedPage(){
        $(".flip-card-inner").empty();
        $(".flip-card-inner").append(`
        <div class="card-body flip-card-front pb-0 px-0">
            <div class="row height-100 demo-finished-card">
            <div class="col-12 d-flex flex-column justify-content-center align-items-center ">
                <p class="demo-finished-main text-center mb-4">Super! Tohle bylo tvých 5 ukázkových kartiček.</p>
                <p class="demo-finished-text text-center text-smaller text-muted mt-3 mb-4">Teď už víš, jak InLege funguje. Vytvoř si účet a získej přístup k dalším <b>více než 3 000 kartičkám</b>. Je to zdarma!</p>
                <a href="/auth/user/new" class="btn btn-lg btn-danger my-3">Vytvořit účet zdarma</a>
            </div>
            </div>
        </div>
        `);
        $("#front-menu-row").remove();
        $("#back-menu-row").remove();
        $("#mini-menu").remove();
        $.ajax({
            method: "GET",
            url: `/stats/demoLimitReached`
        })
        .then(res => {
            console.log(res);
        })
        push = 3;
}