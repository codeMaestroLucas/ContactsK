const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");


const { until, By } = require("selenium-webdriver");

let countries = [
  { "country": "Kazakhstan", "value": "841" },
  { "country": "Australia", "value": "AU" },
  { "country": "Canada", "value": "CA" },
  { "country": "China", "value": "CN" },
  { "country": "Germany", "value": "DE" },
  { "country": "India", "value": "IN" },
  { "country": "Israel", "value": "IL" },
  { "country": "Luxembourg", "value": "102071" },
  { "country": "Mexico", "value": "MX" },
  { "country": "Singapore", "value": "SG" },
  { "country": "Switzerland", "value": "CH" },
  { "country": "Thailand", "value": "TH" },
  { "country": "United Arab Emirates", "value": "AE" }
]

//! I had to get contry by country to access the lawyers

class WhiteAndCase extends ByPage {
  constructor(
    name = "White and Case",
    link = "https://www.whitecase.com/people/all/partner/all/841/all/all/search_api_relevance/DESC",
    totalPages = 13
  ) {
    super(name, link, totalPages);
    this._currentPage = 0
  }


  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);

      const cookieBtn = await driver.findElements(
        By.xpath('//*[@id="onetrust-accept-btn-handler"]')
      );
      if (cookieBtn.length > 0) {
        await cookieBtn[0].click();
      }

    } else {
      this._currentPage++;
      let actualUrl = countries[this._currentPage].value
      let url = `https://www.whitecase.com/people/all/partner/all/${actualUrl}/all/all/search_api_relevance/DESC`
      await super.accessPage(index, url);
    }
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("bio-body")),
      20000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("lawyer-name"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("lawyer-name"))
      .getText();
  }

  
  async #getEmail(lawyer) {
    return await lawyer
      .findElement(By.className(
        "field field--name-field-email field--type-email field--label-hidden field--item"
      ))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getPhone(lawyer) {
    return await lawyer
      .findElement(By.className("lawyer-contact-info"))
      .findElement(By.className("field field--name-field-phone field--type-entity-reference-revisions item-list contact-data__list contact-data__list--phones"))
      .findElement(By.css("li > a"))
      .getAttribute("href");
  }


  async getLawyer(lawyer) {
    const country = countries[this._currentPage].country;
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: await this.#getEmail(lawyer),
      phone: (await this.#getPhone(lawyer)).replace("%2B", ""),
      country: country
    };
  }
}

module.exports = WhiteAndCase;
