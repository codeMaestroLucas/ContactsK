const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

// TODO: Transform into ByNewPage
class GuantaoLaw extends ByPage {
  constructor(
    name = "Guantao Law",
    link = "https://www.guantao.com/en/column41",
    totalPages = 29,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.guantao.com/en/column41?page26=${ index + 1 }&go=goto26`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("gt_jg_hhr_itemr"))
    );
    const webRole = [
      By.className("gt_jg_hhr_itemr_ltitle"),
    ];
    const p = await super.filterPartnersInPage(lawyers, webRole, true);
    return p;
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("gt_jg_hhr_itemr_title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("EIMS_C_40100_Accessories"))
      .findElements(By.css("p > span, a")); // Selects both <span> and <a> tags

    let email = null;
    let country = null;

    for (const social of socials) {
      const text = (await social.getText()).trim().toLowerCase();

      if (!text) continue;

      if (text.includes("@guantao.com")) {
        email = text.replace("email:", "").trim();

      } else if (text.includes("hong")) {
        country = "Hong Kong";
      }
      
      if (email && country) break;
    }

    if (!country) country = "China";

    return { email, country };
  }


  async getLawyer(lawyer) {
    const { email, country } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: country,
    };
  }
}

module.exports = GuantaoLaw;

async function main() {
  t = new GuantaoLawFirm();
  t.searchForLawyers();
}

main();