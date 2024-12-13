const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class VeritasLegal extends ByPage {
  constructor(
    name = "Veritas Legal",
    link = "https://veritaslegal.in/our-partners/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
    try {
      const addBtn = await driver.wait(
        until.elementLocated(By.id("wpdp-close")),
        5000
      );
      await addBtn.click();
    } catch (e) {}
  }
  
  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("staff-entry-details entry-details wpex-first-mt-0 wpex-last-mb-0 wpex-clr")
      ),60000
    );
  
    let partners = [];
    for (const lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("staff-entry-position entry-position wpex-text-sm wpex-text-3 wpex-leading-snug wpex-mb-5"))
        .getText()).toLowerCase();
      if (role.includes("partner")) partners.push(lawyer);

    }
    return partners;
  }
  

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("staff-entry-title entry-title wpex-mb-5"))
      .findElement(By.css("a"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("staff-entry-social-links wpex-clr"))
      .findElement(By.className("staff-social wpex-social-btns wpex-mt-10 wpex-last-mr-0"))
      .findElement(By.className("wpex-email wpex-social-btn wpex-social-btn-no-style wpex-mr-5 wpex-mt-5"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "India",
    };
  }

}

module.exports = VeritasLegal;
