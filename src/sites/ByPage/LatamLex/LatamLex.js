const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LatamLex extends ByPage {
  constructor(
    name = "Latam Lex",
    link = "https://latamlex.com/en/equipo/",
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
      until.elementsLocated(By.css(".info > div")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const html = await lawyer
        .findElement(By.css('p[style*="text-transform:uppercase"]'))
        .getAttribute("outerHTML");

      const regex = />([^<]+)<\/p>/;

      const match = html.match(regex);
      const role = match[1].trim().toLowerCase();
      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("nombreEquipo"))
      .findElement(By.css("b"))
      .getText();
  }

  async #getEmail(lawyer) {
    const html = await lawyer
      .findElement(By.css("p:nth-child(3)"))
      .getAttribute("outerHTML");
    return this.getContentFromTag(html);
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("nombreEquipo"))
      .findElement(By.css("img"))
      .getAttribute("src");

    if (dddElement.includes("costa-rica")) return "Costa Rica";
    else if (dddElement.includes("el-salvador")) return "El Salvador";
    else if (dddElement.includes("nicaragua")) return "Nicaragua";
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: await this.#getDDD(lawyer),
    };
  }
}

module.exports = LatamLex;
