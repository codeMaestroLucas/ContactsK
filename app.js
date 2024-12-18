const getTimesUsed = require("./src/utils/count");
const main = require("./src/main");

const spawn = require("child_process").spawn;
const os = require("os");
const express = require("express");
const path = require("path");

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


function runCommand(command) {
    // const shell = os.platform() === "win32" ? "cmd.exe" : "bash";
    // const shellArgs = os.platform() === "win32" ? ["/c", command] : ["-c", command];

    // const child = spawn(shell, shellArgs, {
    //   stdio: "inherit",
    // });
    
    const execSync = require('child_process').execSync;
    // import { execSync } from 'child_process';  // replace ^ if using ES modules
    
    const output = execSync(command, { encoding: 'utf-8' });  // the default is 'buffer'

    // child.on("close", (code) => {
    //   if (code === 0) {
    //     resolve(); // Resolve when the command succeeds
    //   } else {
    //     reject(new Error(`Command failed with code ${code}`)); // Reject on failure
    //   }
    // });

    // child.on("error", (error) => {
    //   reject(error); // Reject on error
    // });
}


app.post("/search", async (req, res) => {
  try {
    const commitMessage = await getTimesUsed();

    const commands = [
      "git add .",
      `git commit -m "${ commitMessage }"`,
      "git push -u origin main --force"
    ];

    for (const command of commands) {
      try {
        await runCommand(command);

      } catch (err) {
        console.error(`Error executing command: ${command}`, err);
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
    const command = "git pull origin main";

    // Execute the command and handle the result
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.status(500).send({ alert: "Error while pulling the repository.", details: error.message });
        return;
      }

      // if (stderr) {
      //   console.warn(`Warning: ${stderr}`);
      //   res.status(400).send({ alert: "Warning detected during pull operation.", details: stderr });
      //   return;
      // }

      if (stdout.includes("Already up to date.")) {
        console.log(stdout);
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

// POST endpoint to shut down the server
app.post("/shutdown", (req, res) => {
  console.log("Shutting down the server...");
  res.send("Server is shutting down...");
  server.close(() => {
    console.log("Server stopped.");
    process.exit(0);
  });
});
