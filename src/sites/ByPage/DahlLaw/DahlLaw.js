const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class DahlLaw extends ByPage {
  constructor(
    name = "DahlLaw",
    link = "https://www.dahllaw.dk/en/people/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    await super.accessPage(index);
    const addBtn = await driver.wait(
      until.elementLocated(By.xpath('//*[@id="coiPage-1"]/div[2]/div[1]/button[3]'))
    )
    await addBtn.click();

    await this.rollDown(2, 1);
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("employeecard__content span5-mobile-dwarf push0-mobile-dwarf")
      ), 100000
    );

    const webRole = [
      By.className("employeecard__jobtitle")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("employeecard__name"))
      .findElement(By.css("h4"))
      .getText();
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("employeecard__contact"))
      .findElement(By.css("li:nth-child(3)"))
      .findElement(By.className("employeecard__contact-link"))
      .getAttribute("href");
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Denmark",
    };
  }
}

module.exports = DahlLaw;
