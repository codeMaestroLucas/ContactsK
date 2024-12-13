const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ApplebyGlobal extends ByPage {
  constructor(
    name = "Appleby Global",
    link = "https://www.applebyglobal.com/people/page/1/?position=13",
    totalPages = 4
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    super.accessPage(index,
      `https://www.applebyglobal.com/people/page/${index + 1}/?position=13`
    );
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("grid-item__content")
      ), 60000 // This site loads Slowly
    );

    let partners = [];
    for (let lawyer of lawyers) {
      const role = (await lawyer
        .findElement(
          By.className(
            "u-font-size-12 u-font-weight-normal u-uppercase u-letter-spacing-supersmall u-margin-bottom-10"
          )
        )
        .getText()
      ).toLowerCase();

      if (role.includes("partner")) partners.push(lawyer);
    }
    return partners;
  }

  async #getName(lawyer) {
    let name;
    try {
      await driver.wait(until.elementIsVisible(lawyer), 4000);
      name = await lawyer.findElement(By.className("u-margin-bottom-5")).getText();

    } catch (error) {
      await driver.wait(until.elementIsVisible(lawyer), 4000);
      name = await lawyer.findElement(
        By.className("u-decoration-none u-font-weight-normal grid-item__title")
      )
      .getText();
    } finally {
      return name;
    }
  }
  
  async #getSocials(lawyer) {
    await driver.wait(until.elementIsVisible(lawyer), 10000);
    const contacts = await lawyer.findElements(By.className("u-decoration-none u-nowrap"));
    let email = null;
    let ddd = null;
  
    for (let contact of contacts) {
      const href = (await contact.getAttribute("href")).trim();

      if (href.startsWith("mailto:")) {
        email = href.replace(/\?subject=.*$/, "");

      } else if (href.startsWith("tel:+")) {
        ddd = href;
      }
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

module.exports = ApplebyGlobal;
