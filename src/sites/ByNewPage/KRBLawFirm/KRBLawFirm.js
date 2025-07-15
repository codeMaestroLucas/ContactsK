const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class KRBLawFirm extends ByNewPage {
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


  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("mb-4"))
      .findElement(By.className("green-text font-size-48px mb-0"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("green-aqua-bg staff-details-info mb-4"))
      .findElement(By.className("row"))
      .findElements(By.css("div > a"));
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("max-width-576px mt-4"));

    const { email, phone } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "Israel"
    };
  }
}

module.exports = KRBLawFirm;
