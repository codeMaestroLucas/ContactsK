const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");
const { headersToString } = require("selenium-webdriver/http");

class DittmarAndIndrenius extends ByPage {
  constructor(
    name = "Dittmar And Indrenius",
    link = "https://www.dittmar.fi/people/?type=partners",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("person--data")
      ), 100000
    );
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("entry-title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("contact-row"))
      .findElements(By.css("ul > li > a"));

    let email;
    let phone;
    let link;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.toLowerCase().includes("mailto:")) email = href;
      else if (href.toLowerCase().includes("tel:")) phone = href.replace(/%20/g, "");
      else if (href.toLowerCase().includes("https://www.dittmar.fi/people")) link = href;

      if (email  && phone && link) break;
    }

    return { email, phone, link };
  }


  async getLawyer(lawyer) {
    const { email, phone, link } = await this.#getSocials(lawyer);

    return {
      link: link,
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: "Finland"
    };
  }
}

module.exports = DittmarAndIndrenius;
