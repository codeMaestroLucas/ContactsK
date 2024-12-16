const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Walkers extends ByPage {
  constructor(
    name = "Walkers",
    link = "https://www.walkersglobal.com/en/People?position=Partner&page=1",
    totalPages = 13
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.walkersglobal.com/en/People?position=Partner&page=${ index + 1 }`;
    super.accessPage(index, otherUrl);
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("search-item-card")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("title"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("email-wrapper"))
      .getAttribute("href");
  }

  async #getDDD(lawyer) {
    return await lawyer
      .findElement(By.className("number-wrapper"))
      .getAttribute("href");
  }

  async getLawyer(lawyer) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }
}

module.exports = Walkers;
