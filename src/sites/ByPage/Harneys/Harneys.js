const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Harneys extends ByPage {
  constructor(
    name = "Harneys",
    link = "https://www.harneys.com/people/?filters=1226%2C1227%2C1800&sort=5",
    totalPages = 7
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.harneys.com/people/?filters=1226%2C1227%2C1800&sort=5&page=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("profile-card-content-info")
      ), 100000
    );
  }

  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("profile-card-content-info__name"))
      .getAttribute("outerHTML");
    return await this.getContentFromTag(html);
  }

  async #getEmail(lawyer) {
    const html = await lawyer
      .findElement(By.className("profile-card-content-info__email"))
      .getAttribute("outerHTML");
    return await this.getContentFromTag(html);
  }

  async #getDDD(lawyer) {
    const html = await lawyer
      .findElement(By.css(".profile-card-content-info__phone > span"))
      .getAttribute("outerHTML");
    return await this.getContentFromTag(html);
  }

  async getLawyer(lawyer) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Without this sleep the data would be invalid
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }
}

module.exports = Harneys;
