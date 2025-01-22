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
      document.getElementById("progress-text").textContent =
        "Generuji obsah...";

      // Submit the form data using fetch
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Formulář se nepodařilo odeslat.");
      }

      // Parse the JSON response to get the job ID
      const { jobId, error, errorHeadline, expectedTimeInSeconds, categoryId } =
        await response.json();

      if (error) {
        document.getElementById("document-progress-container").style.display =
          "none";
        document.getElementById("document-error-container").style.display =
          "block";
        document.getElementById(
          "document-error-headline"
        ).textContent = `${errorHeadline}`;
        document.getElementById("document-error-text").textContent = error;

        if (showPremiumButton) {
          document.getElementById("premium-button").style.display = "block";
        }

        return;
      }

      document.getElementById(
        "expected-time"
      ).textContent = `Očekávaná doba generování je ${expectedTimeInSeconds} sekund`;

      //take the expectedTimeInSeconds and reduce it by 1 every secods and update the UI
      let timeLeft = expectedTimeInSeconds;
      const timeInterval = setInterval(() => {
        timeLeft -= 1;
        document.getElementById(
          "expected-time"
        ).textContent = `Očekávaná doba generování je ${timeLeft} sekund`;
        if (timeLeft <= 0) {
          clearInterval(timeInterval);
        }
      }, 1000);

      if (jobId) {
        // Start polling for progress
        const progressInterval = setInterval(() => {
          fetchJobProgress(jobId, progressInterval, categoryId);
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("progress-text").textContent =
        "Zpracování selhalo. Zkuste to prosím znovu.";
    }
  });

async function fetchJobProgress(jobId, progressInterval, categoryId) {
  try {
    const response = await fetch(
      `/demoJob/${jobId}/progress?categoryId=${categoryId}`
    );
    if (!response.ok) {
      throw new Error("Nepodařilo se načíst stav zpracování.");
    }

    const { progress, state, sectionId } = await response.json();

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
        //add href to show-generated-content-btn
        document.getElementById(
          "show-generated-content-btn"
        ).href = `/demo/${sectionId}/showAll`;
      } else {
        document.getElementById("progress-text").textContent =
          "Omlouváme se, zpracování selhalo.";
      }
    }
  } catch (error) {
    console.error("Error fetching job progress:", error);
  }
}

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
