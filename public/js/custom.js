$(document).ready(function() {
    let type = $("#rating-type").attr("name");
    let ratingSent = false;
    $(".radio-btn-rating").click(function(){
        let selectedValue = $("input[name='rate']:checked").val();
        $("#text-feedback-link").removeClass('hidden');
        //send data to db
        let sectionId = $("#rating-form").attr("name");
        let updateRatingUrl = `/api/updateRating/section/${sectionId}/${selectedValue}?type=${type}`
        if(!ratingSent){
            ratingSent = true;
            $.ajax({
                method: "POST",
                url: `${updateRatingUrl}`
            }).catch(err => console.log(err)); 
        }
    });

    $("#submit-text-feedback").click(function(){
        let text = $("#feedback-textarea").val();
        //send data to db
        let sectionId = $("#rating-form").attr("name");
        let saveFeedbackUrl = `/api/saveFeedback/section/${sectionId}?type=${type}`
        $.ajax({
            method: "POST",
            url: `${saveFeedbackUrl}`,
            data: {
                text
            }
        }).catch(err => console.log(err)); 

        $(".modal-body").empty();
        $(".modal-body").append('<p>Odesláno, díky!</p>');
    });
});