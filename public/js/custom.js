$(document).ready(function() {
	$(".btn-spustit").click(function() {
		$(this).addClass('disabled');
	})

	$(".btn-opakovat").click(function(e) {
		console.log($(this));
		$(this).addClass('disabled');
	})

	$(".btn-pokracovat").click(function(e) {
		console.log($(this));
		$(this).addClass('disabled');
	})
});