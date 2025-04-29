const { getCountryByDDD } = require("../../../utils/getNationality");
const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Ashurst extends ByFilterP {
  constructor(
    name = "Ashurst",
    link = "https://www.example.com/",
    totalPages = 1,
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);

    this._filterOptions = {
      // "Abu%20Dhabi": "the UAE",
      // Beijing: "China",
      // Brisbane: "Australia",
      // "Brisbane%20-%20Ann%20St": "Australia",
      // Brussels: "Belgium",
      // Canberra: "Australia",
      // Dubai: "the UAE",
      // Dublin: "Ireland",
      // Frankfurt: "Germany",
      // Glasgow: "England",
      // "Hong Kong": "China",
      // Jakarta: "Indonesia",
      // Jeddah: "Saudi Arabia",
      // London: "England",
      // Luxembourg: "Luxembourg",
      // Madrid: "Spain",
      // Melbourne: "Australia",
      // Milan: "Italy",
      // Munich: "Germany",
      Paris: "France",
      // Perth: "Australia",
      // "Port%20Moresby": "Papua New Guinea",
      // Riyadh: "Saudi Arabia",
      // Seoul: "Korea (South)",
      // Shanghai: "China",
      // Singapore: "Singapore",
      // Sydney: "Australia",
      // Tokyo: "Japan",
    };

    this._totalPages = new Set(Object.values(this._filterOptions)).size;

    this._otherLink = "";
    this._realCountry = "";
  }

  /**
   * @returns {boolean} true for SKIP the country and false to search in the contry
   */
  selectRandomCountry() {
    const { randomCity, selectedCountry } = super.selectRandomCountry();
    if (selectedCountry === "No more countries to search.") {
      return true;
    }

    this._otherLink = randomCity;
    return false;
  }

  // TODO: how to change the page from a country to have more than one page?
  async accessPage(index) {
    if (index === 0) this.selectRandomCountry();
    const otherUrl = `https://www.ashurst.com/en/people/#e=0&locationscomputed=${this._otherLink}`;
    await super.accessPage(index + 1, otherUrl);
    this._realCountry = this._currentCountry;
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("profile-card__info")),
      100000
    );

    let partners = [];
    let html;

    for (let lawyer of lawyers) {
      try {
        html = await lawyer
          .findElement(By.className("people-info"))
          .getAttribute("outerHTML");
      } catch (error) {
        html = await lawyer
          .findElement(By.css("div:nth-child(1)")) // This avoid some mistakes
          .getAttribute("outerHTML");
      }

      if (html.toLowerCase().includes("partner")) partners.push(lawyer);
    }

    return partners;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("people-info"))
      .findElement(By.css("a"))
      .getAttribute("title")
  }

  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.css("a:nth-child(3)"))
      .getAttribute("href");
  }

  async #getPhone(lawyer) {
    return await lawyer
      // .findElement(By.css("a:nth-child(2)"))
      .findElement(By.className("profile-call-number hide"))
      .getAttribute("href");
  }

  async getLawyer(lawyer) {
    const data = await lawyer.findElement(By.className("profile-contact"));

    return {
      name: await this.#getName(lawyer),
      email: await this.#getEmail(data),
      country: getCountryByDDD(await this.#getPhone(data)),
    };
  }
}

module.exports = Ashurst;

async function main() {
  t = new Ashurst();
  // t.accessPage(0)
  t.searchForLawyers();
}

main();
