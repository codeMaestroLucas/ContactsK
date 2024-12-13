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
        By.className("entry-content people-list-post-body")
      ), 100000
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(By.className("text-small font-weight-normal mb-1"))
        .getText())
        .toLowerCase();
      if (role.includes("partner")) partners.push(lawyer);
    }

    return partners;
  }

  async #getName(lawyer) {
    return await lawyer.findElement(By.css("h6")).getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.className("d-block mb-2 meta-small")
    );

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) ddd = href;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);
    
    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = MagnussonLaw;
