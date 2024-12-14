const { exec } = require("child_process");
const express = require("express");
const path = require("path");

const getTimesUsed = require("./src/utils/count");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Start the server
const PORT = 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  const { default: open } = await import("open");
  open(`http://localhost:${PORT}`);
});

// Serve static files (including HTML and CSS)
app.use(express.static(path.join(__dirname, "public")));

app.post("/search", async (req, res) => {
  try {
    // Get the commit message by calling the asynchronous getTimesUsed function
    const commitMessage = await getTimesUsed();

    // Define the git commands
    const commands = [
      "git add .",
      `git commit -m "${commitMessage}"`,
      "git push -u origin main",
    ];

    // Execute each command sequentially
    exec(commands.join(" && "), (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        return res.status(500).send(`Stderr: ${stderr}`);
      }

      console.log(`Command stdout: ${stdout}`);
      res.send(stdout); // Send the output back to the client
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

// Endpoint to shut down the server
app.post("/shutdown", (req, res) => {
  console.log("Shutting down the server...");
  res.send("Server is shutting down...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
