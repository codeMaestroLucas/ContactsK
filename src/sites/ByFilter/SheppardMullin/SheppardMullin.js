const { getCountryByDDD } = require("../../../utils/getNationality");
const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


class SheppardMullin extends ByFilterP {
  constructor(
    name = "Sheppard Mullin",
    link = "",  // The link will be constructed by the Functions SelectRandomCountry and AccessPage
    totalPages = 1,
  ) {
    super(name, link, totalPages, 100);
    
    this._filterOptions = {
      "13": "Brussels",       "15": "England",
      "17": "Korea (South)",  "10": "China",
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
    const otherUrl = `https://www.sheppardmullin.com/people?do_item_search=1&fullname=&position=**&office=${this._otherLink}&area=**&industry=**&bars=&school=**&undergrad=**&language=**&keyword=&search=Search`;
    await super.accessPage(index + 1, otherUrl);
    await new Promise(resolve => setTimeout(resolve, 800));

    this._realCountry = this._currentCountry;
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.className("bioItem odd")
      ), 100000
    );

    const webRole = [
      By.className("bioListPosition")
    ]
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("attyListName"))
      .findElement(By.className("title"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("attyListName"))
      .findElement(By.className("title"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.className("email"))
      .findElement(By.css("a"))
      .getAttribute("href");

    const phone = await lawyer
      .findElement(By.className("phone"))
      .findElement(By.css("a"))
      .getAttribute("href");

    return { email, phone };
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


module.exports = SheppardMullin;
