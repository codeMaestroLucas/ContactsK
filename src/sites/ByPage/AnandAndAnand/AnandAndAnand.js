const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class AnandAndAnand extends ByPage {
  constructor(
    name = "Anand And Anand",
    link = "https://www.anandandanand.com/our-team/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("member_discription")
      ), 100000
    );
    return lawyers.slice(1); // The fisrt doesnt have any contact information
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h4"))
      .getText();
  }

  async #getEmail(lawyer) {
    const socials = await lawyer
      .findElement(By.className("member_profile"))
      .findElements(By.css("div > a"))

    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("mailto:")) return href;
    }
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }

}

module.exports = AnandAndAnand;
