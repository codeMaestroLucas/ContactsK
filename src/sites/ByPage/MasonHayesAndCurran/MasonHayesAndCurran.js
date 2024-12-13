const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MasonHayesAndCurran extends ByPage {
  constructor(
    name = "Mason Hayes And Curran",
    link = "https://www.mhc.ie/people",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
    this.rollDown(4, 1.5);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("card-body")
      ), 100000
    );
    return lawyers;
  }


  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("card-title sans"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML");
    return this.getContentFromTag(html);
  }
  

  async #getEmail(lawyer) {
    const email = await lawyer
      .findElement(By.className("card-email sans"))
      .getAttribute("href")
    return email.replace("?subject=Web%20Enquiry", "").trim();
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Ireland"
    };
  }
}

module.exports = MasonHayesAndCurran;
