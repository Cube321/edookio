
let push = 0;

$(document).ready(function() {
    //GET DATA FOR CARD
    function getNextCard(direction, side){
        let nextCardUrl = "/"
        if(direction === "next"){
            if($("#btn-dalsi").length){
                nextCardUrl = $("#btn-dalsi").attr("href");
            }
            if($("#btn-dalsi-rendered").length){
                nextCardUrl = $("#btn-dalsi-rendered").attr("href");
            }
            
        }
        if(direction === "previous"){
            nextCardUrl = $("#predchozi-karticka-link").attr("name");
            console.log(nextCardUrl)
        }
        $.ajax({
            method: "GET",
            url: nextCardUrl
        })
        .then(data => {
            console.log(data);
            if(side !== "front"){$("#flip-card").toggleClass('flipped');}
            //conditional logic for content
            let starEmpty = "";
            let starFull = "";
            let starActivateModal = "";
            let starPlaceholder = "";
            //handle request for first card when requesting previous card
            let previousCard = 0;
            if(data.nextNum === 3){
                previousCard = 0;
            } else {
                previousCard = data.nextNum - 2;
            }
            if(data.user && data.user.isPremium && data.isCardSaved) {starFull = `<div id="save-star-div" name="${data.user.email}/${data.card._id}" class="save-star clicked" style="cursor:pointer"><i class="fas fa-star fa-lg"></i></div>`}
            if(data.user && data.user.isPremium && !data.isCardSaved) {starEmpty = `<div id="save-star-div" name="${data.user.email}/${data.card._id}" class="save-star" style="cursor:pointer"><i class="far fa-star fa-lg"></i></div>`}
            if(data.user && !data.user.isPremium) {starActivateModal = `<div id="" class="save-star" style="cursor:pointer"><a href="#" data-bs-toggle="modal" data-bs-target="#savePremium"><i class="far fa-star fa-lg"></i></a></div>`}
            if(!data.user) {starPlaceholder = `<div style="width:14px"></div>`} 
            //update card content
            $("#flip-card").empty();
            $("#flip-card").append(`
            <div class="border-grey flip-card-inner">
                <div class="card-body flip-card-front pb-0">
                <div class="front-main-content d-flex justify-content-center align-items-center">
                    <div id="loaderA"></div>
                    <div class="card-text m-4 text-center" id="pageA">${data.card.pageA}</div>
                </div>
                <div class="front-menu d-flex justify-content-between align-items-center">
                    <a href=""></a>
                    <div class="">
                    <a href="#" class="btn btn-lg btn-outline-danger" id='btn-otocit'>Otočit</a>
                    </div>
                    <a href=""></a>
                </div>
                </div>
                <div class="card-body flip-card-back pb-0">
                <div class="back-main-content d-flex justify-content-center align-items-center text-gradient">
                    <div id="loaderB"></div>
                    <div class="card-text m-4" id="pageB">${data.card.pageB}</div>
                </div>
                <div class="back-menu d-flex justify-content-between align-items-center">
                    <div class="nezobrazovat-na-mobilu" id="rotate-back"><i class="fas fa-sync-alt fa-lg"></i></div><div class="zobrazovat-jen-na-mobilu" id="rotate-back-mobile"><i class="fas fa-sync-alt fa-lg"></i></div>
                    <div>
                    <a href="/category/${data.card.category}/section/${data.card.section}/cardAjax/${data.nextNum}" class="btn btn-lg btn-danger easy-btn" id="btn-dalsi">Další</a>
                    </div>
                    ${starEmpty}
                    ${starFull}
                    ${starActivateModal}
                    ${starPlaceholder}
                </div>
                </div>
            </div>
            `);

            //update progress bar
            $("#progressCardNumMobile").text(data.nextNum - 1);
            $("#progressCardNumMac").text(data.nextNum - 1);
            $("#progressBarStatusMobile").text(data.progressStatus + "%");
            $("#progressBarStatusMac").text(data.progressStatus + "%");
            $("#progressBarMobile").css('width', data.progressStatus + "%");
            $("#progressBarMac").css('width', data.progressStatus + "%");
            $("#predchozi-karticka-link").attr("name", `/category/${data.card.category}/section/${data.card.section}/cardAjax/${previousCard}`);

            $("#flip-card #btn-otocit").click((e) => {
                e.preventDefault();
                $("#flip-card").toggleClass('flipped');
                push++;
              })

            $("#flip-card #btn-dalsi").click(function(e){
                e.preventDefault();
                $(this).addClass('disabled')
                $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                $("#pageB").remove();
                if(data.numOfCards + 1 === data.nextNum){
                    let finishedPageRedirectUrl = $("#btn-dalsi").attr("href");
                    window.location.replace(finishedPageRedirectUrl);
                } else {
                    getNextCard("next");
                }
            })

            $("#flip-card #rotate-back").click((e) => {
                $("#flip-card").toggleClass('flipped');
                push--;
            })

            /*
            $("#flip-card #rotate-back-mobile").click(() => {
                alert("clicked rendered")
                $("#flip-card").toggleClass('flipped');
                push--;
            })
            */

            //flip with space
            document.body.onkeyup = function(e) {
                if (e.key == " " ||
                    e.code == "Space"      
                ) {
                    push++;
                    if(push === 1){
                        $("#flip-card").toggleClass('flipped');
                    }
                    if(push === 2){
                        $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                        $("#pageB").remove();
                        if(data.numOfCards + 1 === data.nextNum){
                            let finishedPageRedirectUrl = $("#btn-dalsi").attr("href");
                            window.location.replace(finishedPageRedirectUrl);
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
            $("#flip-card #save-star-div").click(() => {
                //remove card from saved
                if($("#flip-card #save-star-div").hasClass("clicked")){
                    $("#flip-card #save-star-div").empty();
                    $("#flip-card #save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    const saveUrl = $('#save-star-div').attr('name');
                    $.ajax({
                        method: "POST",
                        url: `/cards/unsave/${saveUrl}`
                    })
                    .then(res => {
                        $("#flip-card #save-star-div").empty()
                        $("#flip-card #save-star-div").removeClass("clicked");
                        $("#flip-card #save-star-div").append("<i class='far fa-star fa-lg'></i>")
                    })
                    .catch(err => console.log(err)); 
                //add card to saved
                } else {
                    $("#flip-card #save-star-div").empty();
                    $("#flip-card #save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    const saveUrl = $('#save-star-div').attr('name');
                    $.ajax({
                        method: "POST",
                        url: `/cards/save/${saveUrl}`
                    })
                    .then(res => {
                        $("#flip-card #save-star-div").empty()
                        $("#flip-card #save-star-div").addClass("clicked");
                        $("#flip-card #save-star-div").append("<i class='fas fa-star fa-lg'></i>")
                    })
                    .catch(err => console.log(err)); 
                }
            })

            push = 0;
        })
        .catch(err => console.log(err));
    }

      $("#btn-otocit-rendered").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        push++;
      })

    $("#btn-dalsi-rendered").click(function(e){
        e.preventDefault();
        $(this).addClass('disabled');
        $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
        getNextCard("next");
    })

    $("#flip-card #rotate-back-rendered").click((e) => {
        e.preventDefault();
        $("#flip-card").toggleClass('flipped');
        push--;
    })

    $("#predchozi-karticka-link").click(function(e){
        $("#flip-card #pageB").remove();
        $("#flip-card #pageA").remove();
        if($("#flip-card").hasClass("flipped")){
            $("#flip-card #loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
            getNextCard('previous');
        } else {
            $("#flip-card #loaderA").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
            getNextCard('previous','front');
        }
        
    })

    /*
    $("#rotate-back-mobile-rendered").click(() => {
        $("#flip-card").toggleClass('flipped');
        push--;
    })
    */

    $('#flip-card').on('touchstart click', '#rotate-back-mobile-rendered', function() {
        alert("clicked rendered")
        $("#flip-card").toggleClass('flipped');
        push--;
      });

      $('#flip-card').on('touchstart click', '#rotate-back-mobile', function() {
        alert("clicked ajax")
        $("#flip-card").toggleClass('flipped');
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
                }
                if(push === 2){
                    $("#loaderB").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                    $("#pageB").remove();
                    if($("#btn-dalsi-last-card").length){
                            let finishedPageRedirectUrl = $("#btn-dalsi-last-card").attr("href");
                            window.location.replace(finishedPageRedirectUrl);
                    } else {
                        getNextCard("next");
                    }
                    
                }
            }
        }

    

    //saving card to favourites (page rendered)
    $("#save-star-div-rendered").click(() => {
        console.log("clicked")
        //remove card from saved
        if($("#save-star-div-rendered").hasClass("clicked")){
            $("#save-star-div-rendered").empty();
            $("#save-star-div-rendered").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/unsave/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div-rendered").empty()
                $("#save-star-div-rendered").removeClass("clicked");
                $("#save-star-div-rendered").append("<i class='far fa-star fa-lg'></i>")
            })
            .catch(err => console.log(err)); 
        //add card to saved
        } else {
            $("#save-star-div-rendered").empty();
            $("#save-star-div-rendered").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div-rendered').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/save/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div-rendered").empty()
                $("#save-star-div-rendered").addClass("clicked");
                $("#save-star-div-rendered").append("<i class='fas fa-star fa-lg'></i>")
            })
            .catch(err => console.log(err)); 
        }
    })
});