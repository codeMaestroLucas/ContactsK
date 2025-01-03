const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

const cityToCountry = {
  abidjan: "Ivory Coast",
  casablanca: "Morocco",
  johannesburg: "South Africa",
  london: "England",
  mombasa: "Kenya",
  nairobi: "Kenya",
  paris: "France",
  "washington dc": "USA",
};

class AsafoAndCo extends ByNewPage {
  constructor(
    name = "Asafo And Co",
    link = "https://www.asafoandco.com/people/?_sft_positions=partner&sf_paged=1",
    totalPages = 2
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.asafoandco.com/people/?_sft_positions=partner&sf_paged=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("membre cell small-6 medium-4 large-2")
      ),
      100000
    );

    const webRole = [
      By.className("meta"),
      By.className("position"),
      By.css("span.poste")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, false);
  }


  async openNewTab(lawyer) {
    const link = await lawyer.findElement(By.css("a")).getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    try {
      return await driver
        .findElement(By.className("portrait"))
        .findElement(By.css("img"))
        .getAttribute("alt");
    } catch (error) {}
    // Some lawyers doesn't have the portrait div - the name will be catch further on
  }


  async #getEmail() {
    const html = await driver
      .findElement(By.className("portrait"))
      .findElement(By.css("div"))
      .findElement(By.className("phone"))
      .getAttribute("outerHTML");

    const socials = html.split("<br>") || html;

    for (let social of socials) {
      const text = social
        .split("</span>")[1]
        .replace(/\.com.*/, ".com")
        .replace("</p>", "")
        .trim();
      if (text.includes("@")) return text;
    }
  }


  async #getContry() {
    try {
      const html = await driver
        .findElement(By.className("portrait"))
        .findElement(By.css("div"))
        .findElement(By.className("ville or"))
        .getAttribute("outerHTML");

      const city = html
        .split('class="poste">')[1]
        .split("</span>")[0]
        .trim()
        .toLowerCase();

      return cityToCountry[city] || "Unknown";
    } catch (error) {}
  }


  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: await this.#getContry(),
    };
  }
}

module.exports = AsafoAndCo;
