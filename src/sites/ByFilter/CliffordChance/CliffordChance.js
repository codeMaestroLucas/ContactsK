const ByFilterP = require("../../../entities/BaseSites/ByFilterP");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");


class CliffordChance extends ByFilterP {
  constructor(
    name = "Clifford Chance",
    link = "https://www.example.com/",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
    
    this._filterOptions = {
      "abu_dhabi&x=22&y=4&": "The UAE",       "amsterdam&x=2&y=16&": "Netherlands",
      "barcelona&x=6&y=16&": "Spain",         "beijing&x=40&y=21&": "China",
      "brussels&x=16&y=11&": "Brussels",      "bucharest&x=4&y=16&": "Romania",
      "dubai&x=11&y=16&": "the UAE",          "dusseldorf&x=12&y=17&": "Germany",
      "frankfurt&x=16&y=16&": "Germany",      "hong_kong&x=0&y=0&": "Hong Kong",
      "istanbul&x=30&y=18&": "Turkey",        "london&x=29&y=14&": "England",
      "luxembourg&x=14&y=22&": "Luxembourg",  "madrid&x=11&y=19&": "Spain",
      "milan&x=37&y=18&": "Italy",            "munich&x=26&y=16&": "Germany",
      "paris&x=15&y=8&": "France",            "perth&x=9&y=20&": "Australia",
      "prague&x=14&y=14&": "Czech Republic",  "riyadh&x=18&y=16&": "the UAE",
      "rome&x=20&y=12&": "Italy",             "sao_paulo&x=18&y=17&": "Brazil",
      "shanghai&x=10&y=24&": "China",         "shanghai&x=10&y=24&": "Australia",
      "tokyo&x=13&y=16&": "Japan",            "warsaw&x=55&y=5&": "Poland",
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
    const otherUrl = `https://www.cliffordchance.com/people_and_places.html?_charset_=UTF-8&fname=&lname=&tags=all&%20tags=all&office=%2Fcontent%2Fcliffordchance%2Fpeople_and_places%2Fpeople%2Foffices%2F${ this._otherLink }pageitems=50&partnersview=true#partners`;
    await super.accessPage(index + 1, otherUrl);
    try {} catch (e) {}
    this._realCountry = this._currentCountry;

  }


  async getLawyersInPage() {
    const lawyersDiv = await driver.wait(
      until.elementLocated(
        By.id("peopledirectory1")
      ), 100000
    );

    return await lawyersDiv.findElements(By.className("article_result"));
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h1 > a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const email = await lawyer
      .findElement(By.css("p:nth-child(7) > a"))
      .getAttribute("href");

    const phone = await lawyer
      .findElement(By.css("p:nth-child(6)"))
      .getText();
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


module.exports = CliffordChance;
