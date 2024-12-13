const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DittmarAndIndrenius extends ByPage {
  constructor(
    name = "Dittmar And Indrenius",
    link = "https://www.dittmar.fi/people/?type=partners",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person--data")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("entry-title"))
      .getText();
  }

  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElement(By.className("contact-row"))
      .findElements(By.css("ul > li > a"));

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.toLowerCase().includes("mailto:")) return href;
    }
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Finland"
    };
  }

}

module.exports = DittmarAndIndrenius;
