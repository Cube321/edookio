$(document).ready(function() {
    setTimeout(function(){
        $("#back").removeClass("invisible");
    }, 100)

    $("#card").flip({
        trigger: "manual"
    });

    $("#btn-flip-front").click(function(){
        $("#card").flip('toggle');
    })

    $("#btn-flip-back").click(function(){
        $("#card").flip('toggle');
    })
    
});