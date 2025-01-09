// review.js
document.addEventListener("DOMContentLoaded", (event) => {
  //delete question
  $(".review-delete-question-btn").click(function (e) {
    e.preventDefault();

    let wrapperCard = $(this).closest(".card");
    let url = $(this).attr("href");
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
          "<div class='col-12 d-flex justify-content-center align-items-center h-100'><p class='text-muted'>Otázka byla odstraněna.</p></div>"
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

  //delete card
  $(".review-delete-card-btn").click(function (e) {
    e.preventDefault();

    let wrapperCard = $(this).closest(".card");
    let url = $(this).attr("href");
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
          "<div class='col-12 d-flex justify-content-center align-items-center h-100'><p class='text-muted'>Kartička byla odstraněna.</p></div>"
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
});
