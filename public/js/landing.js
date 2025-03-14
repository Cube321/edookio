document.addEventListener("DOMContentLoaded", function () {
  // Get the elements to animate
  const heading = document.querySelector(".jumbotron-heading");
  const lead = document.querySelector(".lead");
  const callBtn = document.querySelector(".call-to-action");
  const callBtn2 = document.querySelector(".call-to-action2");

  // Add CSS classes to trigger animations
  heading.classList.add("animate");
  lead.classList.add("animate");
  callBtn.classList.add("animate");

  if (callBtn2) {
    callBtn2.classList.add("animate");
  }

  $("#add-category-form").submit(function () {
    $("#add-category-btn-on-home").addClass("disabled");
    $("#add-category-btn-on-home").empty();
    $("#add-category-btn-on-home").append(
      "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
    );
  });
});
