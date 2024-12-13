const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class HFW extends ByPage {
  constructor(
    name = "HFW",
    link = "https://www.hfw.com/people/?_people_type_archive=partner",
    totalPages = 9
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.hfw.com/people/?_people_type_archive=partner&_paged=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("parent relative overflow-hidden bg-white")
      )
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(
        By.className(
          "break-keep text-base font-bold uppercase text-primary-dark-grey lg:text-lg"
        ))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.className(
        "text-base decoration-transparent transition-colors ease-in hover:decoration-current"
      )
    );

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) ddd = href;
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

module.exports = HFW;
