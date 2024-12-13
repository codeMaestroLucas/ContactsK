const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments('headless');              // Run Chrome in headless mode
options.addArguments('window-size=1920x1080'); // Set a large window size (e.g., Full HD)
options.addArguments('--disable-gpu');         // Disable GPU acceleration for headless
options.addArguments('--no-sandbox');          // Additional argument for security
options.addArguments('--ignore-certificate-errors');


const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

module.exports = { driver };
