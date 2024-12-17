const { getCountryByDDD } = require("../../../utils/getNationality");
const ByClicking = require("../../../entities/BaseSites/ByClicking");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Kennedys extends ByPage {
  constructor(
    name = "Kennedys",
    link = "https://kennedyslaw.com/en/search/?q=&facet=6843&profileType=6723",
    totalPages = 27,
  ) {
    super(name, link, totalPages);
  }



  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index, otherUrl);
    await this.#selectCountryOption();
    try {} catch (e) {}
  }

  async #selectCountryOption() {
    const options = await driver.findElements((By.className("search-details")));

    for (let i = 0; i < options.length - 1; i++) { // Loop through all except the last one
      await options[i].click();
    }
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(until.elementsLocated(By.className("")));
    console.log(lawyers.length);
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""));

    console.log("NAME HTML: " + await nameElement.getAttribute("outerHTML"));
    console.log("NAME TXT: " + await nameElement.getText());
    console.log('\n\n');
    
    return await nameElement.getText();
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className(""));

    console.log("EMAIL HTML: " + await emailElement.getAttribute("outerHTML"));
    console.log("EMAIL HREF: " + await emailElement.getAttribute("href"));
    console.log("EMAIL TXT: " + await emailElement.getText());
    console.log('\n\n');

    return await emailElement.getAttribute("href");
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className(""));
      
    console.log("DDD HTML: " + await dddElement.getAttribute("outerHTML"));
    console.log("DDD HREF: " + await dddElement.getAttribute("href"));
    console.log("DDD TXT: " + await dddElement.getText());
    console.log('\n\n');
    return await dddElement.getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = Kennedys;
