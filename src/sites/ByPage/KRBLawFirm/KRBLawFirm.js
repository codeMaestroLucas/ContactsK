const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KRBLawFirm extends ByPage {
  constructor(
    name = "KRB Law Firm",
    link = "https://www.krblawfirm.com/?todo=staff&lang=en",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    await driver.wait(until.elementsLocated(By.className("row")));

    const lawyers = await driver
      .findElement(By.id("staff-div"))
      .findElements(By.css("div.col-20-c.col-12.p-0.p-fix-mobile > a"))
      
    const wbeRole = [
      By.className("text-center"),
      By.css("div:nth-of-type(2)"),
      By.className("font-size-22px")
    ];
    return await super.filterPartnersInPage(lawyers, wbeRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("text-center"))
      .findElement(By.css("div:nth-of-type(1)"))
      .findElement(By.className("font-weight-bold font-size-28px"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("text-center"))
      .findElement(By.css("div:nth-of-type(3)"))
      .findElement(By.className("font-size-22px"))
      .getText();
  }

  async getLawyer(lawyer) {
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: "Israel",
    };
  }
}

module.exports = KRBLawFirm;
// TODO: TRANSFOR INTO NEWPAGE