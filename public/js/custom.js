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

$(document).ready(function() {

});