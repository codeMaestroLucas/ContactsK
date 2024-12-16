const { getCountryByDDD } = require("../../../utils/getNationality");

const ByFilter = require("../../../entities/BaseSites/ByFilter");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


let countries = [
  "Africa", "Australia", "Belgium", "Burundi", "Canada", "China", "France",
  "Germany", "Greece", "Hong%20Kong%20SAR", "India", "Indonesia", "Israel",
  "Italy", "Japan", "Kenya", "Korea", "Luxembourg", "Netherlands",
  "Monaco", "Morocco", "Pakistan", "Poland", "Singapore", "South%20Africa",
  "Thailand", "Türkiye", "Uganda", "United%20Kingdom",
  "Papua%20New%20Guinea",
  "Latin%20America,Brazil", "Latin%20America,Mexico",
  "Marshall%20Islands", "Middle%20East",
];

/** COUNTRIES-IN-SITE - TO-BE-REGISTERED
 * Hong%20Kong%20SAR - Hong Kong
 * Latin%20America,Brazil - Brazil
 * Latin%20America,Mexico - Mexico
 * United%20Kingdom - South Korea
 * Türkiye - Turkey
 * Middle%20East,Dubai - the UAE
 */


class Template extends ByFilter {
  constructor(
    name = "Template",
    link = "https://www.example.com/",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  /**
   * 
   */

  async accessPage(index) {
    const otherUrl = ``;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("")
      ), 100000
    );
    return lawyers;
  }

  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className(""))

    
    return nameElement
  }

  async #getEmail(lawyer) {
    const emailElement = await lawyer
      .findElement(By.className(""))


    return emailElement
  }

  async #getDDD(lawyer) {
    const dddElement = await lawyer
      .findElement(By.className(""))
      
    return dddElement
  }

  async getLawyer(lawyer) {
    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      country: getCountryByDDD(await this.#getDDD(lawyer)),
    };
  }

}

module.exports = Template;

async function main() {
  t = new Template();
  t.accessPage(0);
  // t.searchForLawyers();
}

main();
