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

    const webRole = [
      By.className("tpstyle-6-info"),
      By.css("h5")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
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


  async #getPhone() {
    const divElements = await driver
      .findElement(By.className("mega-info-desc"))
      .findElements(By.css("a"));

    for (let div of divElements) {
      const href = await div.getText();

      if (href.includes("+39")) return href;
    }
  }

  async getLawyer(lawyer) {
    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(),
      email: await this.#getEmail(),
      phone: await this.#getPhone(),
      country: "Italy"
    };
  }
}

module.exports = PaviaAndAnsaldo;
