let push = 0;
let cards = [];
let isPremium = false;
let userEmail = "";
let previousCard = 0;
let nextCard = 0;
let currentCard = 0;
let sectionId = "";
let receivedData = {};
let knowsAllCards = false;

$(document).ready(function () {
  //get section ID from DOM element
  sectionId = $("#sectionId").attr("name");
  mode = $("#show-mode").attr("name");

  //create getCardsUrl
  let getCardsUrl = `/api/getCards/section/${sectionId}`;

  if (mode === "unknown") {
    getCardsUrl = `/api/getCardsUnknown/section/${sectionId}`;
  }

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
        startAt = data.startAt;
        knowsAllCards = data.knowsAllCards;
      }
      $("#btn-otocit").removeClass("disabled");
      renderCard(startAt);
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

    //check if user knows all cards
    if (knowsAllCards) {
      console.log("knows all cards");
      $("#knows-all-badge").removeClass("hide");
    } else {
      console.log("doesnt know all cards");
      $("#knows-all-badge").addClass("hide");
    }

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

    //update cardsLoadedCount
    $(".cardsLoadedCount").text(`${cards.length}`);

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
        `/category/section/${sectionId}/finished?cardsCount=${cards.length}`
      );
    } else {
      //render next card
      $("#flip-card").toggleClass("flipped");
      $("#back-menu-row").toggleClass("hide");
      $("#front-menu-row").toggleClass("hide");
      //render next card
      renderCard(nextCard);

      //update last seen card in DB
      updateLastSeenCardInDB(nextCard);

      //set push to 0
      push = 0;
    }
  });

  //handle moving between cards
  $("#btn-dont-know").click((e) => {
    e.preventDefault();

    //mark card as not known
    markCardKnowledge(false, cards[currentCard]._id);

    //change knowsAllCards badge
    knowsAllCards = false;

    //redirect if finished
    if (nextCard === cards.length) {
      $("#pageB")
        .empty()
        .append(
          `<div class='spinner-border' role='status'><span class='visually-hidden'>Loading...</span></div>`
        );
      $("#btn-dont-know").addClass("disabled");
      return window.location.replace(
        `/category/section/${sectionId}/finished?cardsCount=${cards.length}`
      );
    } else {
      //render next card
      $("#flip-card").toggleClass("flipped");
      $("#back-menu-row").toggleClass("hide");
      $("#front-menu-row").toggleClass("hide");
      //render next card
      renderCard(nextCard);

      //update last seen card in DB
      updateLastSeenCardInDB(nextCard);

      //set push to 0
      push = 0;
    }
  });

  $("#btn-predchozi-front").click((e) => {
    e.preventDefault();
    if ($("#btn-predchozi-front").hasClass("chevron-back-disabled")) {
      return;
    }
    renderCard(previousCard);
    push = 0;
    //update lastSeenCard in DB
    updateLastSeenCardInDB(nextCard);
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
    //update lastSeenCard in DB
    updateLastSeenCardInDB(nextCard);
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
    // 1) SPACE or M key logic
    if (
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
            `/category/section/${sectionId}/finished?cardsCount=${cards.length}`
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
          // update lastSeenCard in DB
          updateLastSeenCardInDB(nextCard);
        }
      }
    }
    // 2) "N" key logic (mark unknown)
    else if (
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
            `/category/section/${sectionId}/finished?cardsCount=${cards.length}`
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
          // update lastSeenCard in DB
          updateLastSeenCardInDB(nextCard);
        }
      }
    }
  };
});

function updateLastSeenCardInDB(card) {
  let updateLastCardUrl = `/api/updateLastSeenCard/section/${sectionId}/${card}`;
  $.ajax({
    method: "POST",
    url: `${updateLastCardUrl}`,
  })
    .then((res) => {
      return null;
    })
    .catch((err) => console.log(err));
}

function markCardKnowledge(known, cardId) {
  fetch(`/api/markCardKnown/${cardId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ known: known }),
  });
}
