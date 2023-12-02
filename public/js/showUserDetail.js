$(document).ready(function() {
    //get section name over AJAX
    $(".unfinishedSectionId").click(function() {
        let sectionId = $(this).text();
        let clickedElement = $(this);
        $.ajax({
            method: "GET",
            url: `/admin/${sectionId}/getNameOfSection`
        })
        .then(res => {
            clickedElement.text(res.name)
        })
        .catch(err => console.log(err)); 
        
    })

});