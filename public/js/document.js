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
      const {
        jobId,
        creditsRequired,
        creditsLeft,
        error,
        errorHeadline,
        showPremiumButton,
        expectedTimeInSeconds,
        isPremium,
      } = await response.json();

      if (error && !creditsRequired) {
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
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
        }

        return;
      }

      if (creditsRequired) {
        document.getElementById("document-progress-container").style.display =
          "none";
        document.getElementById("document-error-container").style.display =
          "block";
        document.getElementById(
          "document-error-headline"
        ).textContent = `Nemáš dostatek AI kreditů`;
        document.getElementById(
          "document-error-text"
        ).textContent = `Nemáš dostatek AI kreditů. Potřebuješ ${creditsRequired} AI kreditů a zbývá ti pouze ${creditsLeft} AI kreditů.`;
        if (isPremium) {
          document.getElementById("premium-button-sub").style.display = "none";
          document.getElementById(
            "premium-button-credits-one-time"
          ).style.display = "block";
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
        } else {
          document.getElementById("premium-button-sub").style.display = "block";
          document.getElementById("premium-button-credits").style.display =
            "block";
          document.getElementById(
            "premium-advantages-container"
          ).style.display = "block";
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
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
          fetchJobProgress(jobId, progressInterval);
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      document.getElementById("progress-text").textContent =
        "Zpracování selhalo. Zkuste to prosím znovu.";
    }
  });

document
  .getElementById("add-section-with-ai-form-topic")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent the default form submission
    //remove the form
    document.getElementById("add-section-with-ai-form-topic").style.display =
      "none";
    document.getElementById("document-formats-container").style.display =
      "none";
    // Display progress
    document.getElementById("document-progress-container").style.display =
      "flex";

    const form = event.target;

    //get the value of topic input
    const topic = document.getElementById("topic").value;

    try {
      // Display a loading state
      document.getElementById("progress-text").textContent = "Nahrávám...";

      // Submit the form data using fetch
      const response = await fetch(form.action, {
        method: form.method,
        body: { topic },
      });

      if (!response.ok) {
        throw new Error("Formulář se nepodařilo odeslat.");
      }

      // Parse the JSON response to get the job ID
      const {
        jobId,
        creditsRequired,
        creditsLeft,
        error,
        errorHeadline,
        showPremiumButton,
        expectedTimeInSeconds,
        isPremium,
      } = await response.json();

      if (error && !creditsRequired) {
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
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
        }

        return;
      }

      if (creditsRequired) {
        document.getElementById("document-progress-container").style.display =
          "none";
        document.getElementById("document-error-container").style.display =
          "block";
        document.getElementById(
          "document-error-headline"
        ).textContent = `Nemáš dostatek AI kreditů`;
        document.getElementById(
          "document-error-text"
        ).textContent = `Nemáš dostatek AI kreditů. Potřebuješ ${creditsRequired} AI kreditů a zbývá ti pouze ${creditsLeft} AI kreditů.`;
        if (isPremium) {
          document.getElementById("premium-button-sub").style.display = "none";
          document.getElementById(
            "premium-button-credits-one-time"
          ).style.display = "block";
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
        } else {
          document.getElementById("premium-button-sub").style.display = "block";
          document.getElementById("premium-button-credits").style.display =
            "block";
          document.getElementById(
            "premium-advantages-container"
          ).style.display = "block";
          document.getElementById("retry-generate-content-btn").style.display =
            "none";
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
        ).textContent = `Zbývá ti ještě ${credits} AI kreditů.`;
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
  const showBodyGenerateDocument = document.getElementById(
    "show-body-generate-document"
  );
  const showBodyGenerateTopic = document.getElementById(
    "show-body-generate-topic"
  );

  const retryGenerateContentBtn = document.getElementById(
    "retry-generate-content-btn"
  );

  showBodyGenerateDocument.addEventListener("click", () => {
    document.getElementById("body-generate").style.display = "block";
    document.getElementById("add-section-with-ai-form").style.display = "block";
    document.getElementById("body-generate-btns").style.display = "none";
  });

  showBodyGenerateTopic.addEventListener("click", () => {
    document.getElementById("body-generate").style.display = "block";
    document.getElementById("add-section-with-ai-form").style.display = "none";
    document.getElementById("body-generate-btns").style.display = "none";
    document.getElementById("add-section-with-ai-form-topic").style.display =
      "block";
  });

  retryGenerateContentBtn.addEventListener("click", () => {
    document.getElementById("add-section-with-ai-form").style.display = "block";
    documentErrorContainer.style.display = "none";
  });

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
        "none";
      documentErrorContainer.style.display = "none";
      document.getElementById("body-generate-btns").style.display = "block";
      document.getElementById("body-generate").style.display = "none";
      document.getElementById("add-section-with-ai-form-topic").style.display =
        "none";
    } else {
      document.getElementById("add-section-with-ai-form").style.display =
        "none";
      document.getElementById("body-generate-btns").style.display = "block";
      document.getElementById("body-generate").style.display = "none";
      document.getElementById("add-section-with-ai-form-topic").style.display =
        "none";
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
