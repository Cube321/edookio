$(document).ready(function() {
    $("#next-btn").click(function(){
        $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
    })

    $("#pageB").scroll(function(){
        $(this).removeClass('text-gradient');
    })
});