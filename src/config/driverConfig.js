const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const options = new chrome.Options();
options.addArguments('headless');                                           // Run Chrome in headless mode
options.addArguments('--disable-gpu');                                      // Disable GPU acceleration for headless
options.addArguments('--ignore-certificate-errors');                        // Ignore SSL certificate errors
options.addArguments('--disable-web-security');                             // Disable web security
options.addArguments('--allow-insecure-localhost');                         // Allow insecure localhost connections
options.addArguments('--no-proxy-server');                                  // Disable proxy if you're not using one
options.addArguments('--disable-features=IsolateOrigins,site-per-process'); // Disable site isolation
options.addArguments('--incognito');



const driver = new Builder()
  .forBrowser('chrome')
  .setChromeOptions(options)
  .build();

module.exports = { driver };
