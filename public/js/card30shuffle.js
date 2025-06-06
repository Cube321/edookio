let push = 0;
let cards = [];
let isPremium = false;
let userEmail = "";
let previousCard = 0;
let nextCard = 0;
let currentCard = 0;
let categoryId = "";
let receivedData = {};

$(document).ready(function () {
  //get section ID from DOM element
  categoryId = $("#categoryId").attr("name");

  //create getCardsUrl
  let getCardsUrl = `/api/getRandomCards/category/${categoryId}`;

  //get cards
  $.ajax({
    method: "GET",
    url: getCardsUrl,
  })
    .then((data) => {
      return JSON.parse(data);
    })
    .then((data) => {
      cards = data.cards;
      receivedData = data;
      if (data.user) {
        isPremium = data.user.isPremium;
        userEmail = data.user.email;
      }
      if (cards.length < 1) {
        return handleError();
      }
      $(".cards-length-span").empty().append(cards.length);
      $("#btn-otocit").removeClass("disabled");
      renderCard(0);
    })
    .catch((err) => console.log(err));

  function renderCard(index) {
    currentCard = index;
    previousCard = currentCard - 1;
    if (previousCard < 0) {
      previousCard = 0;
    }
    nextCard = currentCard + 1;
    let cardFront = cards[index].pageA;
    let cardBack = cards[index].pageB;
    let progressStatus = Math.round((index * 100) / cards.length);

    //update card content
    $("#flip-card").empty();
    $("#flip-card").append(`
            <div class="border-grey flip-card-inner" id="flip-card-inner">
                <div class="card-body flip-card-front p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="front-main-content d-flex justify-content-center align-items-center">
                    <div class="card-text m-4 text-center" id="pageA">${cardFront}</div>
                    </div>
                </div>
                <div class="card-body flip-card-back p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="back-main-content d-flex justify-content-center align-items-center text-gradient">
                    <div class="card-text m-4" id="pageB">${cardBack}</div>
                    </div>
                </div>
            </div>
        `);

    //previous btns disabled on first card
    $("#btn-predchozi-front").removeClass("chevron-back-disabled");
    if (currentCard === 0) {
      $(".chevron-back").addClass("chevron-back-disabled");
    }

    $("#btn-predchozi-back").removeClass("chevron-back-disabled");
    if (currentCard === 0) {
      $(".chevron-back").addClass("chevron-back-disabled");
    }

    //update star icon - save/unsaved when rendering
    if (isPremium) {
      if (cards[index].isSaved) {
        $("#star-div")
          .empty()
          .append(
            `<div id="save-star-unsave" class="save-star" style="cursor:pointer"><i class="fas fa-star"></i></div>`
          );
      } else {
        $("#star-div")
          .empty()
          .append(
            `<div id="save-star-save" class="save-star" style="cursor:pointer"><i class="far fa-star"></i></div>`
          );
      }
    } else {
      $("#star-div")
        .empty()
        .append(
          `<div id="" class="save-star" style="cursor:pointer"><a href="#" data-bs-toggle="modal" data-bs-target="#savePremium"><i class="far fa-star menu-icon"></i></a></div>`
        );
    }

    //update service btns
    $("#btn-upravit").attr("href", `/cards/edit/${cards[index]._id}`);
    $("#btn-odstranit").attr("href", `/cards/remove/${cards[index]._id}`);

    //update progress bars
    $("#progressNumMac").text(currentCard + 1);
    $("#progressBarMac").css("width", `${progressStatus}%`);
    $("#progressBarStatusMacNum").text(`${progressStatus}`);
    $("#progressBarMobile").css("width", `${progressStatus}%`);
    $("#progressNumMobile").text(currentCard + 1);
    $("#progressBarStatusMobileNum").text(`${progressStatus}`);

    //remove gradient on scroll
    $(".back-main-content").scroll(function () {
      $("#flip-card .back-main-content").removeClass("text-gradient");
    });

    //update counters
    updateUsersCardsCounters();
  }

  //handle moving between cards
  $("#btn-know").click((e) => {
    e.preventDefault();

    //mark card as known
    markCardKnowledge(true, cards[currentCard]._id);

    //redirect if finished
    if (nextCard === cards.length) {
      $("#pageB")
        .empty()
        .append(
          `<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`
        );
      $("#btn-know").addClass("disabled");
      return window.location.replace(
        `/category/${categoryId}/finishedRandomCards`
      );
    } else {
      //render next card
      $("#flip-card").toggleClass("flipped");
      $("#back-menu-row").toggleClass("hide");
      $("#front-menu-row").toggleClass("hide");
      //render next card
      renderCard(nextCard);

      //set push to 0
      push = 0;
    }
  });

  $("#btn-dont-know").click((e) => {
    e.preventDefault();

    //mark card as known
    markCardKnowledge(false, cards[currentCard]._id);

    //redirect if finished
    if (nextCard === cards.length) {
      $("#pageB")
        .empty()
        .append(
          `<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`
        );
      $("#btn-dont-know").addClass("disabled");
      return window.location.replace(
        `/category/${categoryId}/finishedRandomCards`
      );
    } else {
      //render next card
      $("#flip-card").toggleClass("flipped");
      $("#back-menu-row").toggleClass("hide");
      $("#front-menu-row").toggleClass("hide");
      //render next card
      renderCard(nextCard);

      //set push to 0
      push = 0;
    }
  });

  $("#btn-predchozi-front").click((e) => {
    e.preventDefault();
    if ($("#btn-predchozi-front").hasClass("chevron-back-disabled")) {
      return;
    }
    e.preventDefault();
    renderCard(previousCard);
    push = 0;
  });

  $("#btn-predchozi-back").click((e) => {
    e.preventDefault();
    if ($("#btn-predchozi-back").hasClass("chevron-back-disabled")) {
      return;
    }
    $("#flip-card").toggleClass("flipped");
    $("#back-menu-row").toggleClass("hide");
    $("#front-menu-row").toggleClass("hide");
    renderCard(previousCard);
    push = 0;
  });

  //favorite cards logic
  //save
  $("#star-div").on("click", "#save-star-save", function () {
    //add loader
    $("#star-div")
      .empty()
      .append(
        `<div class='spinner-border spinner-border-small save-star-spinner' role='status'><span class='visually-hidden'>Loading...</span></div>`
      );

    //save on object localy
    cards[currentCard].isSaved = true;

    //create saveUrl
    let saveUrl = `/cards/save/${userEmail}/${cards[currentCard]._id}`;

    //save in DB
    $.ajax({
      method: "POST",
      url: `${saveUrl}`,
    })
      .then((res) => {
        $("#star-div")
          .empty()
          .append(
            `<div id="save-star-unsave" class="save-star" style="cursor:pointer"><i class="fas fa-star"></i></div>`
          );
      })
      .catch((err) => console.log(err));
  });

  $("#star-div").on("click", "#save-star-unsave", function () {
    //add loader
    $("#star-div")
      .empty()
      .append(
        `<div class='spinner-border spinner-border-small save-star-spinner' role='status'><span class='visually-hidden'>Loading...</span></div>`
      );

    //save on object localy
    cards[currentCard].isSaved = false;

    //create saveUrl
    let saveUrl = `/cards/unsave/${userEmail}/${cards[currentCard]._id}`;

    //save in DB
    $.ajax({
      method: "POST",
      url: `${saveUrl}`,
    })
      .then((res) => {
        $("#star-div")
          .empty()
          .append(
            `<div id="save-star-save" class="save-star" style="cursor:pointer"><i class="far fa-star"></i></div>`
          );
      })
      .catch((err) => console.log(err));
  });

  //handle flipping
  $("#btn-otocit").click((e) => {
    e.preventDefault();
    $("#flip-card").toggleClass("flipped");
    $("#back-menu-row").toggleClass("hide");
    $("#front-menu-row").toggleClass("hide");
    push++;
  });

  $("#rotate-back").click((e) => {
    e.preventDefault();
    $("#flip-card").toggleClass("flipped");
    $("#back-menu-row").toggleClass("hide");
    $("#front-menu-row").toggleClass("hide");
    push--;
  });

  document.body.onkeyup = function (e) {
    // 1) SPACE key logic
    if (
      (e.key === "n" || e.key === "N" || e.code === "KeyN") &&
      ($("#data-loaded").length || push === 0)
    ) {
      push++;
      if (push === 1) {
        $("#flip-card").toggleClass("flipped");
        $("#back-menu-row").toggleClass("hide");
        $("#front-menu-row").toggleClass("hide");
      }
      if (push === 2) {
        // mark card as known
        markCardKnowledge(true, cards[currentCard]._id);

        // redirect if finished
        if (nextCard === cards.length) {
          $("#pageB")
            .empty()
            .append(
              `<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`
            );
          return window.location.replace(
            `/category/${categoryId}/finishedRandomCards`
          );
        } else {
          $("#m-key").addClass("vibrate");
          // remove after 300ms
          setTimeout(() => {
            $("#m-key").removeClass("vibrate");
          }, 300);
          // else render next card
          $("#flip-card").toggleClass("flipped");
          $("#back-menu-row").toggleClass("hide");
          $("#front-menu-row").toggleClass("hide");
          renderCard(nextCard);
          push = 0;
        }
      }
    }
    // 2) "U" key logic (mark unknown)
    else if (
      (e.key === " " ||
        e.code === "Space" ||
        e.key === "m" ||
        e.key === "M" ||
        e.code === "KeyM") &&
      ($("#data-loaded").length || push === 0)
    ) {
      push++;
      if (push === 1) {
        $("#flip-card").toggleClass("flipped");
        $("#back-menu-row").toggleClass("hide");
        $("#front-menu-row").toggleClass("hide");
      }
      if (push === 2) {
        // Directly mark card as unknown:
        markCardKnowledge(false, cards[currentCard]._id);

        // Move to the next card the same way as for known
        if (nextCard === cards.length) {
          $("#pageB")
            .empty()
            .append(
              `<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`
            );
          return window.location.replace(
            `/category/${categoryId}/finishedRandomCards`
          );
        } else {
          $("#n-key").addClass("vibrate");
          // remove after 300ms
          setTimeout(() => {
            $("#n-key").removeClass("vibrate");
          }, 300);
          // else render next card
          $("#flip-card").toggleClass("flipped");
          $("#back-menu-row").toggleClass("hide");
          $("#front-menu-row").toggleClass("hide");
          renderCard(nextCard);
          // reset push for the next card
          push = 0;
        }
      }
    }
  };

  function handleError() {
    $("#flip-card").empty();
    $("#flip-card").append(`
            <div class="border-grey flip-card-inner" id="flip-card-inner">
                <div class="card-body flip-card-front p-sm-3 pt-sm-4 px-0 pt-3">
                    <div class="front-main-content d-flex justify-content-center align-items-center text-center">
                        <div>
                            <h4 class="">Je nám líto, nenalezli jsme žádné kartičky.</h4>
                            <p class="">Je možné, že kartičky zatím nebyly zveřejněny pro studenty nebo jsou dostupné pouze s předplatným Premium.</p>
                        </div>
                    </div>
                </div>
            </div>
        `);

    push = 3;
  }
});

function updateUsersCardsCounters() {
  $.ajax({
    method: "POST",
    url: "/api/updateUsersCardsCounters",
  });
}

function markCardKnowledge(known, cardId) {
  fetch(`/api/markCardKnown/${cardId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ known: known }),
  });
}
