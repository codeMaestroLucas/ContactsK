window.addEventListener("beforeunload", async () => {
  await fetch("/shutdown", { method: "POST" });
});


const searchBtn = document.getElementById("search");
const updateBtn = document.getElementById("update");

searchBtn.addEventListener("click", async () => {
  try {
    alert("Starting the search. Please don't close the window.");

    const response = await fetch("/search", { method: "POST" });

    if (response.ok) {
      const result = await response.json();
      alert(result.alert + "\nSearch completed successfully.");

    } else {
      alert("An error occurred while starting the search.");
    }
  } catch (error) {
    alert("An unexpected error occurred.");
    console.error(error);
  }
});

updateBtn.addEventListener("click", async () => {
  try {
    alert("Checking for updates. Please don't close the window.");

    // Send request to the server
    const response = await fetch("/update", { method: "POST" });

    if (response.ok) {
      const result = await response.json();
      alert(result.alert + "\nUpdate completed successfully.");
      if (result.details) {
        console.log(result.details);
        // Optionally log the details for debugging
      }
    } else {
      alert("An error occurred while checking for updates.");
    }

  } catch (error) {
    alert("An unexpected error occurred.");
    console.error(error);
  }
});
