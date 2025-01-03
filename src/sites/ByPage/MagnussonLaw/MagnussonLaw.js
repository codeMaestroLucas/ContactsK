const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class MagnussonLaw extends ByPage {
  constructor(
    name = "Magnusson Law",
    link = "https://www.magnussonlaw.com/people/?search-text=partner",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
    // Just 2 countries in the firm
  }


  async accessPage(index) {
    await super.accessPage(index);
    for (let c = 0; c < 2; c++) {
        try {
          await driver
            .findElement(
              By.className("btn btn-tertiary w-100 js-archive-load-more")
            )
            .click();
          await new Promise((resolve) => setTimeout(resolve, 2000));
        } catch (error) {}
    }
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("d-flex flex-column h-100 people-list-post-content")
      ), 100000
    );

    const webRole = [
      By.className("entry-content people-list-post-body"),
      By.className("text-small font-weight-normal mb-1")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("mt-auto people-list-post-footer"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer.findElement(By.css("h6")).getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.className("d-block mb-2 meta-small")
    );
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const details = await lawyer.findElement(By.className("entry-content people-list-post-body"));
    const { email, phone } = await this.#getSocials(details);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = MagnussonLaw;
