$(document).ready(function() {
    //saving card to favourites
    $("#save-star-div").click(() => {
        //remove card from saved
        if($("#save-star-div").hasClass("clicked")){
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
        }
    })

    //remove saved card from favourites and from the page
    $(".remove-from-saved-link").on('click', function(){
        //get info
        let userEmail = $(this).attr("title");
        let cardId = $(this).attr("name");
        let link = userEmail + "/" + cardId;
        let removableElementId = "#accordion-" + cardId;
        
        //send request to backend to remove saved card from users profile
        $.ajax({
            method: "POST",
            url: `/cards/unsave/${link}`
        })
        .then(res => {
            console.log("ok");
        })
        .catch(err => console.log(err)); 

        //remove element from page
        $(removableElementId).fadeOut();
    })

});