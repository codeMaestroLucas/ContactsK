const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Legance extends ByNewPage {
  constructor(
    name = "Legance",
    link = "https://www.legance.com/professionals/page/1/?wpv_view_count=199&wpv-role=partner-en&wpv-area=0&wpv-office=0&wpv-language=0&wpv_post_search&wpv_filter_submit=Search",
    totalPages = 9,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `https://www.legance.com/professionals/page/${ index + 1 }/?wpv_view_count=199&wpv-role=partner-en&wpv-area=0&wpv-office=0&wpv-language=0&wpv_post_search&wpv_filter_submit=Search`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("col-12 col-sm-6 col-md-4 col-lg-3")
      ), 100000
    );
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("professional-banner-header py-10 py-md-20 w-100"))
      .findElement(By.className("h2 entry-title w-100 mb-6"))
      .getText();
  }


  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className("w-100 pb-4"))
      .findElement(By.className("d-flex align-items-center justify-content-between"))
      .findElement(By.css("div:last-child"))
      .findElement(By.className("text-decoration-none h5 d-inline-block mb-0"))
      .getAttribute("href");
  }

  
  async getLawyer(lawyer) {
    const details = await driver.wait(
      until.elementLocated(By.className("col-md-6 col-lg-5 offset-lg-1 col-12 d-flex flex-column flex-wrap pr-4")
      ), 5000
    );

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: await this.#getEmail(details),
      // phone: // Phone on CV
      country: "Italy"
    };
  }
}

module.exports = Legance;
