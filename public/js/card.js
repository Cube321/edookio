
let push = 0;
let nextCardData = {};
let previousCardData = {};
let currentCardData = {};

$(document).ready(function() {

    //GET DATA FOR CURRENT CARD
    let currentCardUrl = "/"
    currentCardUrl = $("#flip-card-inner").attr("currentCardUrl");
    $.ajax({
        method: "GET",
        url: currentCardUrl + "?requestType=primaryData"
    })
    .then(data => {
        currentCardData = data;   
    })
    .catch(err => console.log(err));

    //GET DATA FOR NEXT CARD
    let nextCardUrl = "/"
    if($("#btn-dalsi").length){
        nextCardUrl = $("#btn-dalsi").attr("href");
    }
    if($("#btn-dalsi-rendered").length){
        nextCardUrl = $("#btn-dalsi-rendered").attr("href");
    }
    $.ajax({
        method: "GET",
        url: nextCardUrl + "?requestType=primaryData"
    })
    .then(data => {
        nextCardData = data;          
    })
    .catch(err => console.log(err));

    //GET DATA FOR PREVIOUS CARD
    let previousCardUrl = "/"
    if($("#predchozi-karticka-link").length){
        previousCardUrl = $("#predchozi-karticka-link").attr("name");
    }
    $.ajax({
        method: "GET",
        url: previousCardUrl + "?requestType=primaryData"
    })
    .then(data => {
        previousCardData = data;       
    })
    .catch(err => console.log(err));
    
    function getNextCard(direction, side){
        
        rebuildCard(nextCardData, side);

        checkIfDemoLimitReached(nextCardData.demoCardsSeen, nextCardData.user);
    
        $.ajax({
            method: "GET",
            url: `/category/${nextCardData.card.category}/section/${nextCardData.card.section}/cardAjax/${nextCardData.nextNum}`
        })
        .then(data => {
            previousCardData = currentCardData;
            currentCardData = nextCardData;
            nextCardData = data;
        })
        .catch(err => console.log(err));  
    }

    function getPreviousCard(direction, side){
        
        rebuildCard(previousCardData, side);
        
        let previousCardNum = previousCardData.nextNum - 2;
        if(previousCardData.nextNum === 3){
            previousCardNum = 0
        }
        if(previousCardData.nextNum === 2){
            $("#predchozi-karticka-filler").removeClass("hide");
            $("#predchozi-karticka-link").addClass("hide");
        }

    
        $.ajax({
            method: "GET",
            url: `/category/${previousCardData.card.category}/section/${previousCardData.card.section}/cardAjax/${previousCardNum}?requestType=primaryData`
        })
        .then(data => {
            nextCardData = currentCardData;
            currentCardData = previousCardData;
            previousCardData = data;
            
        })
        .catch(err => console.log(err));  
    }

    function rebuildCard(data, side){
        if(side !== "front"){$("#flip-card").toggleClass('flipped');}
            //conditional logic for content
            let starEmpty = "";
            let starFull = "";
            let starActivateModal = "";
            let starPlaceholder = "";
            //handle request for first card when requesting previous card
            let previousCard = 0;

            if(data.user && data.user.isPremium && data.isCardSaved) {starFull = `<div id="save-star-div" name="${data.user.email}/${data.card._id}" class="save-star clicked" style="cursor:pointer"><i class="fas fa-star fa-lg"></i></div>`}
            if(data.user && data.user.isPremium && !data.isCardSaved) {starEmpty = `<div id="save-star-div" name="${data.user.email}/${data.card._id}" class="save-star" style="cursor:pointer"><i class="far fa-star fa-lg"></i></div>`}
            if(!data.user || !data.user.isPremium) {starActivateModal = `<div id="" class="save-star" style="cursor:pointer"><a href="#" data-bs-toggle="modal" data-bs-target="#savePremium"><i class="far fa-star fa-lg"></i></a></div>`}
            //update card content
            $("#flip-card").empty();
            $("#flip-card").append(`
            <div class="border-grey flip-card-inner">
                <div class="card-body flip-card-front pb-0 px-0">
                    <div class="front-main-content d-flex justify-content-center align-items-center">
                        <div id="loaderA"></div>
                        <div class="card-text m-4 text-center" id="pageA">${data.card.pageA}</div>
                    </div>
                </div>
                <div class="card-body flip-card-back p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="back-main-content d-flex justify-content-center align-items-center text-gradient">
                        <div id="loaderB"></div>
                        <div class="card-text m-4" id="pageB">${data.card.pageB}</div>
                    </div>
                </div>
            </div>
            `);

           if($("#predchozi-karticka-link").hasClass('back')){
                $("#front-menu-row").toggleClass('hide');
                $("#back-menu-row").toggleClass('hide');
                $("#predchozi-karticka-link").removeClass('back');
           }
            
            
            
            $("#back-menu-row").empty().append(`
            <div class="col-lg-6 offset-lg-2">
                <div class="back-menu d-flex justify-content-between align-items-center border-grey">
                <div class="">
                    ${starEmpty}
                    ${starFull}
                    ${starActivateModal}
                </div>
                <div>
                    <a href="/category/${data.card.category}/section/${data.card.section}/cardAjax/${data.nextNum}" class="btn btn-lg btn-danger easy-btn" id="btn-dalsi">Další</a>
                </div>
                <div>
                    <a href="#" class="nezobrazovat-na-mobilu" id="rotate-back"><i class="fas fa-sync-alt fa-lg"></i></a>
                    <a href="#" class="zobrazovat-jen-na-mobilu" id="rotate-back-mobile"><i class="fas fa-sync-alt fa-lg"></i></a>
                </div>
                </div>
            </div>
            `)

            

            //update progress bar
            $("#progressCardNumMobile").text(data.nextNum - 1);
            $("#progressCardNumMac").text(data.nextNum - 1);
            $("#progressBarStatusMobile").text(data.progressStatus + "%");
            $("#progressBarStatusMac").text(data.progressStatus + "%");
            $("#progressBarMobile").css('width', data.progressStatus + "%");
            $("#progressBarMac").css('width', data.progressStatus + "%");
            $("#predchozi-karticka-link").attr("name", `/category/${data.card.category}/section/${data.card.section}/cardAjax/${data.nextNum - 2}`);
            $("#predchozi-karticka-filler").addClass("hide");
            $("#predchozi-karticka-link").removeClass("hide");

            //SERVIS BTNs 
            $("#upravit-kartu-div").empty().append(`<a href="/cards/edit/${data.card._id}" class="text-muted" >Upravit kartu</a>`)
            $("#odstranit-kartu-div").empty().append(`<a href="/cards/remove/${data.card._id}" class="text-muted mx-3" id="odstranit-kartu">Odstranit kartu</a>`)
            $("#nahlasit-kartu-div").empty().append(`<a href="/cards/report/${data.card._id}" target="_blank" class="text-muted px-3" id="nahlasit-chybu">Nahlásit chybu</a>`)
            
            $("#front-menu-row #btn-otocit").click((e) => {
                e.preventDefault();
                $("#flip-card").toggleClass('flipped');
                $("#back-menu-row").toggleClass('hide');
                $("#front-menu-row").toggleClass('hide');
                $("#predchozi-karticka-link").toggleClass('back');
                push++;
              })

            $("#back-menu-row #btn-dalsi").click(function(e){
                e.preventDefault();
                $(this).addClass('disabled')
                $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                $("#pageB").remove();
                if(data.numOfCards + 1 === data.nextNum){
                    let finishedPageRedirectUrl = $("#btn-dalsi").attr("href");
                    window.location.replace(finishedPageRedirectUrl + "?requestType=primaryData");
                } else {
                    getNextCard("next");
                }
            })

            $("#back-menu-row #rotate-back").click((e) => {
                e.preventDefault();
                $("#flip-card").toggleClass('flipped');
                $("#back-menu-row").toggleClass('hide');
                $("#front-menu-row").toggleClass('hide');
                $("#predchozi-karticka-link").toggleClass('back');
                push--;
            })

            //flip with space
            document.body.onkeyup = function(e) {
                if (e.key == " " ||
                    e.code == "Space"      
                ) {
                    push++;
                    if(push === 1){
                        $("#flip-card").toggleClass('flipped');
                        $("#back-menu-row").toggleClass('hide');
                        $("#front-menu-row").toggleClass('hide');
                        $("#predchozi-karticka-link").toggleClass('back');
                    }
                    if(push === 2){
                        $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                        $("#pageB").remove();
                        if(data.numOfCards + 1 === data.nextNum){
                            let finishedPageRedirectUrl = $("#btn-dalsi").attr("href");
                            window.location.replace(finishedPageRedirectUrl + "?requestType=primaryData");
                        } else {
                            getNextCard("next");
                        }
                    }
                }
            }

            //remove gradient on scroll
            $("#flip-card .back-main-content").scroll(function(){
                $("#flip-card .back-main-content").removeClass('text-gradient');
            })

            //saving card to favourites (page rendered)
            $("#main-container #save-star-div").click(() => {
                //remove card from saved
                if($("#main-container #save-star-div").hasClass("clicked")){
                    $("#main-container #save-star-div").empty();
                    $("#main-container #save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    const saveUrl = $('#main-container #save-star-div').attr('name');
                    $.ajax({
                        method: "POST",
                        url: `/cards/unsave/${saveUrl}`
                    })
                    .then(res => {
                        $("#main-container #save-star-div").empty()
                        $("#main-container #save-star-div").removeClass("clicked");
                        $("#main-container #save-star-div").append("<i class='far fa-star fa-lg'></i>")
                        currentCardData.isCardSaved = false;
                    })
                    .catch(err => console.log(err)); 
                //add card to saved
                } else {
                    $("#main-container #save-star-div").empty();
                    $("#main-container #save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    const saveUrl = $('#main-container #save-star-div').attr('name');
                    $.ajax({
                        method: "POST",
                        url: `/cards/save/${saveUrl}`
                    })
                    .then(res => {
                        $("#main-container #save-star-div").empty()
                        $("#main-container #save-star-div").addClass("clicked");
                        $("#main-container #save-star-div").append("<i class='fas fa-star fa-lg'></i>")
                        currentCardData.isCardSaved = true;
                    })
                    .catch(err => console.log(err)); 
                }
            })

            push = 0;
    }

    function checkIfDemoLimitReached(demoCardsSeen, user){
        if(!user && demoCardsSeen > 5){
            $(".flip-card-inner").empty();
            $(".flip-card-inner").append(`
            <div class="card-body flip-card-front pb-0 px-0">
                <div class="row height-100 demo-finished-card">
                <div class="col-12 d-flex flex-column justify-content-center align-items-center ">
                    <p class="demo-finished-main text-center mb-4">Super! Tohle bylo tvých 5 ukázkových kartiček.</p>
                    <p class="demo-finished-text text-center text-smaller text-muted mt-3 mb-4">Teď už víš, jak InLege funguje. Zaregistruj se a získej přístup k dalším <b>více než 1 500 kartičkám</b>. Je to zdarma!</p>
                    <a href="/auth/user/new" class="btn btn-lg btn-danger my-3">Registrace zdarma</a>
                </div>
                </div>
            </div>
            `);
            $("#front-menu-row").remove();
            $("#back-menu-row").remove();
            $("#mini-menu").remove();
        }
    }

      $("#btn-otocit-rendered").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        $("#predchozi-karticka-link").toggleClass('back');
        push++;
      })

    $("#btn-dalsi-rendered").click(function(e){
        e.preventDefault();
        $(this).addClass('disabled');
        $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
        getNextCard("next");
    })

    $("#rotate-back-rendered").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        $("#predchozi-karticka-link").toggleClass('back');
        push--;
    })

    $("#predchozi-karticka-link").click(function(e){
        $("#flip-card #pageB").remove();
        $("#flip-card #pageA").remove();
        if($("#flip-card").hasClass("flipped")){
            $("#flip-card #loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
            getPreviousCard('previous');
        } else {
            $("#flip-card #loaderA").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
            getPreviousCard('previous','front');
        }
        
    })

    
    $('#rotate-back-mobile-rendered').on('click', function(e) {
        e.preventDefault(e);
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        $("#predchozi-karticka-link").toggleClass('back');
        push--;
      });

      $('#back-menu-row').on('click', '#rotate-back-mobile', function(e) {
        e.preventDefault(e);
        $("#flip-card").toggleClass('flipped');
        $("#back-menu-row").toggleClass('hide');
        $("#front-menu-row").toggleClass('hide');
        $("#predchozi-karticka-link").toggleClass('back');
        push--;
      });

      

    //text-gradient on scrollable content
        //remove gradient on scroll
        $("#flip-card .back-main-content").scroll(function(){
            $("#flip-card .back-main-content").removeClass('text-gradient');
        })

        //flip with space
        document.body.onkeyup = function(e) {
            if (e.key == " " ||
                e.code == "Space"      
            ) {
                e.preventDefault();
                push++;
                if(push === 1){
                    $("#flip-card").toggleClass('flipped');
                    $("#back-menu-row").toggleClass('hide');
                    $("#front-menu-row").toggleClass('hide');
                    $("#predchozi-karticka-link").toggleClass('back');
                }
                if(push === 2){
                    $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    $("#pageB").remove();
                    if($("#btn-dalsi-last-card").length){
                            let finishedPageRedirectUrl = $("#btn-dalsi-last-card").attr("href");
                            window.location.replace(finishedPageRedirectUrl + "?requestType=primaryData");
                    } else {
                        getNextCard("next");
                    }
                    
                }
            }
        }

    

    //saving card to favourites (page rendered)
    $("#save-star-div-rendered-bottom").click(() => {
        //remove card from saved
        if($("#save-star-div-rendered-bottom").hasClass("clicked")){
            $("#save-star-div-rendered-bottom").empty();
            $("#save-star-div-rendered-bottom").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div-rendered-bottom').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/unsave/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div-rendered-bottom").empty()
                $("#save-star-div-rendered-bottom").removeClass("clicked");
                $("#save-star-div-rendered-bottom").append("<i class='far fa-star fa-lg'></i>")
                currentCardData.isCardSaved = false;
            })
            .catch(err => console.log(err)); 
        //add card to saved
        } else {
            $("#save-star-div-rendered-bottom").empty();
            $("#save-star-div-rendered-bottom").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div-rendered-bottom').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/save/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div-rendered-bottom").empty()
                $("#save-star-div-rendered-bottom").addClass("clicked");
                $("#save-star-div-rendered-bottom").append("<i class='fas fa-star fa-lg'></i>")
                currentCardData.isCardSaved = true;
            })
            .catch(err => console.log(err)); 
        }
    })
});