window.addEventListener("beforeunload", async () => {
  await fetch("/shutdown", { method: "POST" });
});


const searchBtn = document.getElementById("search");
const updateBtn = document.getElementById("update");

searchBtn.addEventListener("click", async () => {
    await fetch("/search", { method: "POST" });
});

updateBtn.addEventListener("click", async () => {
    await fetch("/update", { method: "POST" });
});
