const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class CollasCrill extends ByPage {
  constructor(
    name = "Collas Crill",
    link = "https://www.collascrill.com/people/all-locations/partners/all-practices/",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("overlay-contents")
      ), 100000
    );
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("name name-desktop"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("icons"))
      .findElements(By.css("a"));
    return await super.getSocials(socials, true);
  }

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = CollasCrill;
