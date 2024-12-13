const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ArnoldAndPorter extends ByPage {
  constructor(
    name = "Arnold And Porter",
    link = "https://www.arnoldporter.com/en/people?offices=6345e0f4-64a2-4698-8117-fb2c8311cfc5,4dfbc043-3bdf-df98-7dbd-9579ed375007,dfcf7436-a067-b337-91ac-e8f2ff7e912a,effc1763-f448-4d06-94f5-9bb5a082a8f8,ef390be5-f9a7-434a-927e-22f81d498b35&titles=c9a37860-0e03-294c-b0ba-bdca9259042b&skip=20&sort=0&reload=false&scroll=4332.7998046875",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person-item col-row")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("person-item-info col col2-5"))
      .findElement(By.css("a"))
      .getText();
  }

  async #getEmail(lawyer) {
    const ancors =  await lawyer
      .findElement(By.className("person-item-contact-info col col2-5"))
      .findElements(By.css("a"))

    for (let a of ancors) {
      const href = await a.getAttribute("href");

      if (href.includes("mailto:")) return href;
    }
  }

  async #getDDD(lawyer) {
    const phones = await lawyer
      .findElement(By.className("person-item-contact-info col col2-5"))
      .findElements(By.className("phone"))

    for (let phone of phones) {
      const ddd = await phone.findElement(By.css("a")).getAttribute("href");

      if (ddd.startsWith("tel:++1")) {
        continue; // Skip US ddd
      }

      return ddd;
    }
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = ArnoldAndPorter;
