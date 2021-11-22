$(document).ready(function() {
    $('#btn-flip').click(function(){
        $('#pageB').fadeIn();
        $('.hard-btn').removeClass('disabled');
        $('.easy-btn').removeClass('disabled');
        $('#btn-flip').addClass('disabled');
    });
});