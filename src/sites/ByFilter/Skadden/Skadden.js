const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


class Skadden extends ByFilterP {
  constructor(
    name = "Skadden",
    link = "",  // The link will be constructed by the Functions SelectRandomCountry and AccessPage
    totalPages = 1,
  ) {
    super(name, link, totalPages, 100);
    
    this._filterOptions = {
      "000064": "Brussels",       "000041": "Germany",        "000066": "Hong Kong",
      "000068": "England",        "000072": "Germany",        "000074": "France",
      "108027": "Korea (South)",  "000002": "China",          "000076": "Singapore",
      "000078": "Japan",          "000075": "Brazil",
      // "000079": "Canada",
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
  

  async accessPage(index) {
    if (index === 0) this.selectRandomCountry();
    const otherUrl = `https://www.skadden.com/professionals?skip=0&office=74507339-7adf-4528-ba0d-000000${ this._otherLink }&position=64063c2e-9576-4f66-91fa-166f4bede9b8&hassearched=true`;
    await super.accessPage(index + 1, otherUrl);

    this._realCountry = this._currentCountry;


    await driver.findElement(By.id("onetrust-accept-btn-handler")).click();

    while (true) {
      try {
        const loadMoreBtn = await driver.wait(
          until.elementLocated(By.className("professionals-landing-results-load-more btn-text-load-more  js-load-more")
          ), 1000
        );
        await loadMoreBtn.click();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        break;
      }
    }
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("professional-result-card ng-scope")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("professional-result-card-details"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("professional-result-card-details"))
      .findElement(By.css("a"))
      .findElement(By.css("h3"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("professional-result-card-contact"))
      .findElements(By.css("a"))
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: this._realCountry
    };
  }
}


module.exports = Skadden;
