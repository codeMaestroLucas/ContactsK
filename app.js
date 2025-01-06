const getTimesUsed = require("./src/utils/count");
const main = require("./src/main");

const express = require("express");
const path = require('path');
const { exec } = require("child_process");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);

  const { default: open } = await import("open");
  open(`http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, "public")));


/**
 * Function used to execute a command in the CLI
 * @param {string} command to be executed
 */
function runCommand(command) {
  const execSync = require('child_process').execSync;
  execSync(command, { encoding: 'utf-8' });
}


app.post("/search", async (req, res) => {
  await main();

  try {
    const commitMessage = await getTimesUsed();

    const commands = [
      "git add .",
      `git commit -m "${ commitMessage }"`,
      "git push -u origin K --force"
    ];

    for (const command of commands) {
      try {
        await runCommand(command);

      } catch (err) {
        console.error(`Error executing command: ${command}`, err);
        console.log("\tExecuting GIT RESET");

        await runCommand("git reset");
        return res.status(500).json({ alert: `Error: ${err.message}` });
      }
    }

    res.status(200).json({ alert: "Commands executed successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ alert: "An unexpected error occurred.", details: err.message });
  }
});


app.post("/update", async (req, res) => {
  try {
    const command = "git pull origin K";

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send({ alert: "Error while pulling the repository.", details: error.message });
        return;
      }

      if (stdout.includes("Already up to date.")) {
        console.log(stdout);
        res.status(200).send({ alert: "Files are already up to date." });

      } else if (stdout.includes("Updating")) {
        res.status(200).send({ alert: "Files successfully updated.", details: stdout });

      } else {
        res.status(200).send({ alert: "Unexpected output from git pull.", details: stdout });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ alert: "An unexpected error occurred.", details: err.message });
  }
});


// POST endpoint to shut down the server
app.post("/shutdown", (req, res) => {
  console.log("Shutting down the server...");
  res.send("Server is shutting down...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
