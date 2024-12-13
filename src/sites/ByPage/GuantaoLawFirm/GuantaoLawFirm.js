const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class GuantaoLawFirm extends ByPage {
  constructor(
    name = "Guantao Law Firm",
    link = "http://en.guantao.com/pro.aspx?FId=n3:82:3",
    totalPages = 15,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = `http://en.guantao.com/pro.aspx?FId=n3:82:3&TypeId=82&pageindex=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("xn_c_products_230_proli"))
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const pTag = await lawyer
        .findElement(By.className("EIMS_C_40100_Accessories"))
        .findElements(By.css("p"));

      for (let p of pTag) {
        try {
          const role = (await p
            .findElement(By.css("span"))
            .getText()
          ).toLowerCase();

          if (role.includes("partner")) {
            partners.push(lawyer);
            break;
          }
        } catch (error) {} // Tag doesn't have the <span> in it
      }
    }

    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("EIMS_C_40100_proname"))
      .findElement(By.css("a"))
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

module.exports = GuantaoLawFirm;
