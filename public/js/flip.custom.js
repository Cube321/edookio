let pushes = 0;

$(document).ready(function() {
    setTimeout(function(){
        $("#back").removeClass("invisible");
    }, 100)

    $("#card").flip({
        trigger: "manual"
    });

    $("#btn-flip-front").click(function(){
        $("#card").flip('toggle');
        pushes++; 
    })

    $("#btn-flip-back").click(function(){
        $("#card").flip('toggle');
    })

    document.body.onkeyup = function(e) {
        if (e.key == " " ||
            e.code == "Space"      
        ) {
            pushes++;
            if(pushes === 1){
                $("#card").flip('toggle');
            }
            if(pushes === 2){
                $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
                $("#pageB").remove();
                const redirectLink = $("#next-btn").prop("href");
                window.location.href = redirectLink;
            }
        }
      }
    
});