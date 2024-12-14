const getTimesUsed = require("./src/utils/count");
const main = require("./src/main");

const spawn = require("child_process").spawn;
const os = require("os");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

// Start the server
const PORT = 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  const { default: open } = await import("open");
  open(`http://localhost:${PORT}`);
});


app.use(express.static(path.join(__dirname, "public")));


function runCommand(command, res) {
  const shell = os.platform() === "win32" ? "cmd.exe" : "bash";
  const shellArgs = os.platform() === "win32" ? ["/c", command] : ["-c", command];

  const child = spawn(shell, shellArgs, {
    stdio: "inherit", // Ensure the output is shown in the terminal
  });

  child.on("close", (code) => {
    if (code === 0) {
      res.send("Commands executed successfully");
    } else {
      res.status(500).send(`Error: Command execution failed with code ${code}`);
    }
  });

  child.on("error", (error) => {
    console.error(`Error executing command: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  });
}

app.post("/search", async (req, res) => {
  try {
    await main();

    const commitMessage = await getTimesUsed();
    const commands = [
      "git add .",
      `git commit -m \"${commitMessage}\"`,
      "git push -u origin main",
    ].join(" && ");

    runCommand(commands, res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


app.post("/update", async (req, res) => {
  try {
    const command = "git pull origin main";
    runCommand(command, res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
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
