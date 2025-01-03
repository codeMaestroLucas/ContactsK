const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Deacons extends ByPage {
  constructor(
    name = "Deacons",
    link = "https://www.deacons.com/people/",
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
        By.className("details")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("name"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("name"))
      .findElement(By.css("a"))
      .getText();
  }
  

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className('contact'))
      .findElements(By.css('a'));
    return await super.getSocials(socials);
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Hong Kong"
    };
  }
}

module.exports = Deacons;
