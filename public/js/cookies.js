    //cookies approval
		$("#btn-agree").on("click", function(e){
			e.preventDefault();
			$.ajax({
				method: "GET",
				url: "/cookies-agreed"
			})
			.then(res => {
				$(".cookies-warning").fadeOut();
			})
			.catch(err => console.log(err));
		});

$(document).ready(function() {

});