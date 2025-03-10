$(document).ready(function () {
  let type = $("#rating-type").attr("name");
  let ratingSent = false;
  $(".radio-btn-rating").click(function () {
    let selectedValue = $("input[name='rate']:checked").val();
    //send data to db
    let sectionId = $("#rating-form").attr("name");
    let updateRatingUrl = `/api/updateRating/section/${sectionId}/${selectedValue}?type=${type}`;
    if (!ratingSent) {
      ratingSent = true;
      $.ajax({
        method: "POST",
        url: `${updateRatingUrl}`,
      }).catch((err) => console.log(err));
    }
  });

  if ($("#successOverlay")) {
    setTimeout(function () {
      var alertElement = document.getElementById("successOverlay");
      if (alertElement) {
        // Bootstrap's built-in close method
        var bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
      }
    }, 3000);
  }

  $("#generate-ai").click(function () {
    $(this).addClass("disabled");
    $(this).empty();
    $(this).append(
      "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
    );
  });

  $("#shareLinkButton").on("click", function () {
    // 1. Add the disabled class
    $(this).addClass("disabled");

    // 2. Get the value of the input
    const shareText = $("#shareLink").val();

    // 3. Use the Clipboard API to copy the text
    navigator.clipboard
      .writeText(shareText)
      .then(() => {
        $("#copy-confirmation-text").removeClass("hidden");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  });

  $(".delete-question-btn").click(function (e) {
    e.preventDefault();
    let wrapperCard = $(this).closest(".card");
    let url = $(this).closest(".delete-question-form").attr("action");
    url = url + "&api=true";
    wrapperCard
      .empty()
      .append(
        "<div class='col-12 d-flex justify-content-center align-items-center h-100'><div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div></div>"
      );
    //send data to db
    $.ajax({
      method: "POST",
      url,
    })
      .then(() => {
        wrapperCard.empty();
        wrapperCard.append(
          "<div class='col-12 d-flex justify-content-center align-items-center h-100'><p class='text-bold'>Otázka byla odstraněna.</p></div>"
        );
      })
      .catch((err) => {
        console.log(err);
        wrapperCard.empty();
        wrapperCard.append(
          "<div class='col-12 d-flex justify-content-center align-items-center h-100'><p class='text-bold'>Něco se nepovedlo :/</p></div>"
        );
      });
  });

  // Get the elements to animate
  const heading = document.querySelector(".jumbotron-heading");
  const lead = document.querySelector(".lead");
  const callBtn = document.querySelector(".call-to-action");

  // Add CSS classes to trigger animations
  if (heading) {
    heading.classList.add("animate");
    lead.classList.add("animate");
    callBtn.classList.add("animate");
  }
});
