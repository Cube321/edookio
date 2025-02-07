(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          $("#submit-registration").addClass("disabled");
          $("#submit-registration").empty();
          $("#submit-registration").append(
            "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
          );
          $("#submit-login").addClass("disabled");
          $("#submit-login").empty();
          $("#submit-login").append(
            "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
          );
          $("#save-question-btn").addClass("disabled");
          $("#save-question-btn").empty();
          $("#save-question-btn").append(
            "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>"
          );
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();
