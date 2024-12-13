const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class PaviaAndAnsaldo extends ByNewPage {
  constructor(
    name = "Pavia And Ansaldo",
    link = "https://www.pavia-ansaldo.it/en/lawyers/",
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
      until.elementsLocated(By.className("exp-arrow  extp-exlink")),
      100000
    );
    let partners = [];

    for (let lawyer of lawyers) {
      const role = (
        await lawyer
          .findElement(By.className("tpstyle-6-info"))
          .findElement(By.css("h5"))
          .getText()
          ).toLowerCase().trim();

      if (role.includes("partner")) partners.push(lawyer);
    }

    return partners;
  }


  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.className("tpstyle-6-image"))
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName() {
    const alt = await driver
      .findElement(By.className("wpb_wrapper"))
      .findElement(By.className("vc_single_image-img"))
      .getAttribute("alt");
    return alt.replace("Pea_585_", "").replace(/_/g, " ");
  }


  async #getEmail() {
    const divElements = await driver
      .findElements(By.className("mega-info-desc"));

    for (let div of divElements) {
      const href = await div.getText();

      if (href.includes("@pavia-ansaldo.it")) return href;
    }
  }
  

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(),
      email: await this.#getEmail(),
      country: "Italy",
    };
  }
}

module.exports = PaviaAndAnsaldo;
