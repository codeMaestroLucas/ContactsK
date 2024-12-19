const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");
const { Name } = require("selenium-webdriver/lib/command");

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
    const t = await driver.wait(
      until.elementsLocated(
        By.className("overlay-contents")
      ), 100000
    );
    return t;
  }

  async #getName(lawyer) {
    const nameDivs = await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("name name-desktop"))
      .getText();

    return nameDivs;
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("icons"))
      .findElements(By.css("a"));

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) {
        email = href;

      } else if (href.includes("tel:")) {
        ddd = href;

        if (ddd.startsWith("00")) {
          ddd = ddd.replace("00", "");
        }
      }

      if (email && ddd) break;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

}

module.exports = CollasCrill;
