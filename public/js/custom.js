$(document).ready(function() {
    $("#next-btn").click(function(){
        $("#loader").append("<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>");
        $("#pageB").remove();
    })

    $("#pageB").scroll(function(){
        $(this).removeClass('text-gradient');
    })

    //cookies approval
		$("#btn-agree").on("click", function(){
			$.ajax({
				method: "GET",
				url: "/cookies-agreed"
			})
			.then(res => {
				$(".cookies-warning").addClass("d-none");
			})
			.catch(err => console.log(err));
		});
});