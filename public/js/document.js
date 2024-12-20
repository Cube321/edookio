document
  .getElementById("add-section-with-ai-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission
    //remove the form
    document.getElementById("add-section-with-ai-form").style.display = "none";
    document.getElementById("document-formats-container").style.display =
      "none";
    // Display progress
    document.getElementById("document-progress-container").style.display =
      "flex";

    const form = event.target;
    const formData = new FormData(form);

    try {
      // Display a loading state
      document.getElementById("progress-text").textContent = "Nahrávám...";

      // Submit the form data using fetch
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Formulář se nepodařilo odeslat.");
      }

      // Parse the JSON response to get the job ID
      const { jobId, creditsRequired, creditsLeft } = await response.json();

      if (creditsRequired) {
        document.getElementById("document-progress-container").style.display =
          "none";
        document.getElementById("document-error-container").style.display =
          "block";
        document.getElementById(
          "document-error-text"
        ).textContent = `Nemáte dostatek kreditů. Potřebujete ${creditsRequired} kreditů a zbývá vám pouze ${creditsLeft}.`;

        return;
      }

      if (jobId) {
        // Start polling for progress
        const progressInterval = setInterval(() => {
          fetchJobProgress(jobId, progressInterval);
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("progress-text").textContent =
        "Zpracování selhalo. Zkuste to prosím znovu.";
    }
  });

async function fetchJobProgress(jobId, progressInterval) {
  try {
    const response = await fetch(`/job/${jobId}/progress`);
    if (!response.ok) {
      throw new Error("Nepodařilo se načíst stav zpracování.");
    }

    const { progress, state, lastJobCredits, credits } = await response.json();

    // Update the progress UI
    updateProgressUI(progress, state);

    // Stop polling if the job is completed or failed
    if (state === "completed" || state === "failed") {
      clearInterval(progressInterval);

      if (state === "completed") {
        document.getElementById("document-progress-container").style.display =
          "none";
        document.getElementById("document-success-container").style.display =
          "block";
        document.getElementById(
          "document-success-text"
        ).textContent = `Zbývá vám ještě ${credits} kreditů.`;
      } else {
        document.getElementById("progress-text").textContent =
          "Omlouváme se, zpracování selhalo.";
      }
    }
  } catch (error) {
    console.error("Error fetching job progress:", error);
  }
}

//on close of createWithAIModal reload the page
document.addEventListener("DOMContentLoaded", () => {
  const createWithAIModal = document.getElementById("createWithAIModal");
  const documentSuccessContainer = document.getElementById(
    "document-success-container"
  );
  const documentErrorContainer = document.getElementById(
    "document-error-container"
  );
  const sectionsContainer = document.getElementById("sections-container");
  const addSectionContainer = document.getElementById("add-section-container");
  const loader = document.getElementById("loader");

  createWithAIModal.addEventListener("hidden.bs.modal", () => {
    // Check if the success container is visible
    if (documentSuccessContainer.style.display !== "none") {
      if (loader) loader.style.display = "block";
      if (sectionsContainer) sectionsContainer.style.display = "none";
      if (addSectionContainer) addSectionContainer.style.display = "none";
      window.location.reload();
    }
    // Check if the error container is visible
    if (documentErrorContainer.style.display !== "none") {
      document.getElementById("add-section-with-ai-form").style.display =
        "block";
      documentErrorContainer.style.display = "none";
    }
  });
});

function updateProgressUI(progress, state) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (progressBar) {
    progressBar.style.width = `${progress}%`;
  }

  if (progressText) {
    progressText.textContent = `Zpracováno ${progress} %`;
  }
}
