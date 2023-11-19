let push = 0;

$(document).ready(function() {
    //NEW CARD DESIGN
      $("#btn-otocit").click((e) => {
        e.preventDefault();
        $(".flip-card").toggleClass('flipped');
        push++;
      })

    $("#btn-dalsi").click(function(){
        $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
    })

    //disable "next" btn after click event
    $("#btn-dalsi").click(function(){
        $(this).addClass('disabled ');
    })

    //flip with space
    document.body.onkeyup = function(e) {
        if (e.key == " " ||
            e.code == "Space"      
        ) {
            push++;
            if(push === 1){
                $(".flip-card").toggleClass('flipped');
            }
            if(push === 2){
                $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                $("#pageB").remove();
                const redirectLink = $("#btn-dalsi").prop("href");
                window.location.href = redirectLink;
            }
        }
      }

      $("#rotate-back").click((e) => {
        e.preventDefault();
        $(".flip-card").toggleClass('flipped');
        push--;
    })

    //disable "previous" btn after click event
    $("#previous-btn-pageA").click(function(){
        $(this).addClass('disabled ');
    })

    $("#previous-btn-pageB").click(function(){
        $(this).addClass('disabled ');
    })

    //text-gradient on scrollable content
        //remove gradient on scroll
        $(".back-main-content").scroll(function(){
            $(".back-main-content").removeClass('text-gradient');
        })

        //add gradient only if certaing height
        //var pageB = document.getElementById('pageB');
        //if (pageB.scrollHeight > pageB.clientHeight) {
            //pageB.classList.add('text-gradient');
        //} 

    //OLD SCRIPTS 


    //saving card to favourites
    $("#save-star-div").click(() => {
        //remove card from saved
        if($("#save-star-div").hasClass("clicked")){
            $("#save-star-div").empty();
            $("#save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/unsave/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div").empty()
                $("#save-star-div").removeClass("clicked");
                $("#save-star-div").append("<i class='far fa-star fa-lg'></i>")
            })
            .catch(err => console.log(err)); 
        //add card to saved
        } else {
            $("#save-star-div").empty();
            $("#save-star-div").append("<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>");
            const saveUrl = $('#save-star-div').attr('name');
            $.ajax({
                method: "POST",
                url: `/cards/save/${saveUrl}`
            })
            .then(res => {
                $("#save-star-div").empty()
                $("#save-star-div").addClass("clicked");
                $("#save-star-div").append("<i class='fas fa-star fa-lg'></i>")
            })
            .catch(err => console.log(err)); 
        }
    })
});