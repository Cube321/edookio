$(document).ready(function() {
    $("#next-btn").click(function(){
        $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
    })

    var pageB = document.getElementById('pageB');
    if (pageB.scrollHeight > pageB.clientHeight) {
        pageB.classList.add('text-gradient');
    }


    $("#pageB").scroll(function(){
        $(this).removeClass('text-gradient');
    })

    //disable "next" btn after click event
    $("#next-btn").click(function(){
        $(this).addClass('disabled ');
    })


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