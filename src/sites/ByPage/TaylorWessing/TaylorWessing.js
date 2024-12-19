const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class TaylorWessing extends ByPage {
  constructor(
    name = "Taylor Wessing",
    link = "https://www.taylorwessing.com/en/people?page=1#people-listing",
    totalPages = 33,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    const otherUrl = `https://www.taylorwessing.com/en/people?role=84587aa0-6bf5-4213-9543-57ad20a63c2c&page=${ index + 1 }#people-listing`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("team-members__item--content team-members__item--card equal-height-item person__description")
      ), 100000
    );

    const webRole = [
      By.className('team-members__item--title person__description-title')
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("team-members__item--name person__description-name"))
      .getText();
  }

  async #getEmail(lawyer) {
    const onclickContent = await lawyer
      .findElement(By.className("email-link person__description-contact-item-link"))
      .getAttribute("onclick");

    if (!onclickContent) return "";

    const emailPartsRegex = /'([^']+)'/g;
    const parts = [];
    let match;

    while ((match = emailPartsRegex.exec(onclickContent)) !== null) {
        parts.push(match[1]);
    }

    // Combine the parts into the full email
    const email = parts.join("");
    return email;
  }


  async #getDDD(lawyer) {
    return await lawyer
      .findElement(
        By.className("item telephone team-members__contact-item person__description-contact-item")
      )
      .findElement(By.className("person__description-contact-item-link"))
      .getText();
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }
}

module.exports = TaylorWessing;
// TODO: Test this 