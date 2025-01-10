// Initialize Quill Editors
var quillPageA = new Quill("#editorPageA", {
  theme: "snow",
  modules: {
    toolbar: [["bold", "italic", { list: "bullet" }]],
  },
});

var quillPageB = new Quill("#editorPageB", {
  theme: "snow",
  modules: {
    toolbar: [["bold", "italic", { list: "bullet" }]],
  },
});

// Form Submission Handler
function submitForm() {
  let isPageAValid = true;
  let isPageBValid = true;
  // Get HTML content from Quill editor
  var pageAContent = quillPageA.root.innerHTML;
  var pageBContent = quillPageB.root.innerHTML;

  // Set the hidden input values to the Quill content
  document.getElementById("hiddenPageA").value = pageAContent;
  document.getElementById("hiddenPageB").value = pageBContent;

  if (pageAContent === "<p><br></p>" || pageAContent === "") {
    //add ".red-border" class to the editor
    document.getElementById("editorPageA").classList.add("red-border");
    //add the red-border class to the previous sibling
    document
      .getElementById("editorPageA")
      .previousElementSibling.classList.add("red-border");
    document.getElementById("error-warning").classList.remove("hidden");
    isPageAValid = false;
  } else {
    //remove the red-border class from the editor
    document.getElementById("editorPageA").classList.remove("red-border");
    //remove the red-border class from the previous sibling
    document
      .getElementById("editorPageA")
      .previousElementSibling.classList.remove("red-border");
    isPageAValid = true;
  }

  if (pageBContent === "<p><br></p>" || pageBContent === "") {
    //add ".red-border" class to the editor
    document.getElementById("editorPageB").classList.add("red-border");
    //add the red-border class to the previous sibling
    document
      .getElementById("editorPageB")
      .previousElementSibling.classList.add("red-border");
    document.getElementById("error-warning").classList.remove("hidden");
    isPageBValid = false;
  } else {
    //remove the red-border class from the editor
    document.getElementById("editorPageB").classList.remove("red-border");
    //remove the red-border class from the previous sibling
    document
      .getElementById("editorPageB")
      .previousElementSibling.classList.remove("red-border");
    isPageBValid = true;
  }

  // Allow form submission
  if (isPageAValid && isPageBValid) {
    document.getElementById("error-warning").classList.add("hidden");
    document.getElementById("save-card-btn").classList.add("disabled");
    document.getElementById("save-card-btn").innerHTML =
      "<div class='spinner-border spinner-border-small' role='status'><span class='visually-hidden'>Loading...</span></div>";
    return true;
  } else {
    return false;
  }
}
