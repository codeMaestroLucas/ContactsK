const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ConsortiumLegal extends ByPage {
  constructor(
    name = "Consortium Legal",
    link = "https://consortiumlegal.com/nuestros-profesionales/?fwp_buscador_cargo=20732f9c371af01701522b5f992c19b4",
    totalPages = 3
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `${ this._link }&fwp_paged=${ index + 1 }`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("contenido-abogado")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer.findElement(By.css("a")).getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .findElement(By.className("title-abogado"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css('div[style*="display:flex"]'))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getCountry(lawyer) {
    return (await lawyer
    .findElement(By.css('div[style*="display:flex"]'))
    .getText())
    .replace("-", "").trim();
  }


  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: await this.#getCountry(lawyer),
    };
  }
}

module.exports = ConsortiumLegal;
