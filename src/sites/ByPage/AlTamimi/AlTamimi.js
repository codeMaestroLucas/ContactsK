const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class AlTamimi extends ByPage {
  constructor(
    name = "Al Tamimi",
    link = "https://www.tamimi.com/find-a-lawyer/?paged=1&designation_id=Partner",
    totalPages = 6
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.tamimi.com/find-a-lawyer/?paged=${ index + 1 }&designation_id=Partner`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("key-contact-detail")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
        .findElement(By.className("txt-magenta heading5 key-title"))
        .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.css(".key-contact-info a")
    );

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:+")) ddd = href;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer)

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = AlTamimi;
