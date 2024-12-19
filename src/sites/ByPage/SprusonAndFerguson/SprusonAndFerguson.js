const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


//! TODO this firm is conclued, but i think that would be better to include this firm on Filter
//! to get more lawyers -> DIRECTORS, MANAGING DIRECTORS, PRINCIPALS
    // Just getting the Directors

class SprusonAndFerguson extends ByPage {
  constructor(
    name = "Spruson And Ferguson",
    link = "https://www.spruson.com/our-people/?post_type=our_people&s=&people_position=director&practice_group=&people_industry=&people_office=",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("post-entry")
      ), 100000
    );
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("post-name h3"))
      .findElement(By.css("a"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("post-contact"))
      .findElements(By.css("a"))

    let email;
    let ddd;

    for(let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) ddd = href;

      if (email && ddd) break;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer)

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = SprusonAndFerguson;
