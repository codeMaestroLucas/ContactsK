const getTimesUsed = require("./src/utils/count");
const main = require("./src/main");

const spawn = require("child_process").spawn;
const os = require("os");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${ PORT }`);

  const { default: open } = await import("open");
  open(`http://localhost:${ PORT }`);
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
    console.error(`Error executing command: ${ error.message }`);
    res.status(500).send(`Error: ${ error.message }`);
  });
}

app.post("/search", async (req, res) => {
  try {
    res.status(200).send({ alert: "Starting the search. Don't close the window." });

    await main();

    const commitMessage = await getTimesUsed();
    const commands = [
      "git add .",
      `git commit -m \"${ commitMessage }\"`,
      "git push -u origin main",
    ].join(" && ");

    runCommand(commands, res);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});


const { exec } = require("child_process");

app.post("/update", async (req, res) => {
  try {
    const command = "git pull origin main";

    // Execute the command and handle the result
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send({ alert: "Error while pulling the repository.", details: error.message });
        return;
      }

      if (stderr) {
        console.warn(`Warning: ${stderr}`);
        res.status(400).send({ alert: "Warning detected during pull operation.", details: stderr });
        return;
      }

      if (stdout.includes("Already up to date.")) {
        res.status(200).send({ alert: "Repository is already up to date." });

      } else if (stdout.includes("Updating")) {
        res.status(200).send({ alert: "Repository successfully updated.", details: stdout });

      } else {
        res.status(200).send({ alert: "Unexpected output from git pull.", details: stdout });
      }
      
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ alert: "An unexpected error occurred.", details: err.message });
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
