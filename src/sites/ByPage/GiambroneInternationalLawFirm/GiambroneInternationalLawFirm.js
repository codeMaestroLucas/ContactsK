const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GiambroneInternationalLawFirm extends ByPage {
  constructor(
    name = "Giambrone International Law Firm",
    link = "https://www.giambronelaw.com/site/people/senior-lawyers/",
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
      until.elementsLocated(By.className("staff-attributes")),
      100000
    );
    const webRole = [By.className("staff-details"), By.className("jobtitle")];
    const partners = await super.filterPartnersInPage(lawyers, webRole, false);

    return partners;
  }

  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.className("staff-details"))
      .findElement(By.className("name"))
      .findElement(By.css("a"))
      .getAttribute("outerHTML");
    return await super.getContentFromTag(html);
  }

  async #getEmail(lawyer) {
    let socials = await lawyer
      .findElement(By.className("staff-contact"))
      .findElements(By.className("icon-link"));
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const { email } = await this.#getEmail(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email.replace('?subject=email%20from%20website:', ''),
      // Couldn't find the phone in the HTML page
      country: 'Not Found',
    };
  }
}

module.exports = GiambroneInternationalLawFirm;
