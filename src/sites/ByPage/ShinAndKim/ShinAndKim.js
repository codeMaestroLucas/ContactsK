const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ShinAndKim extends ByPage {
  constructor(
    name = "Shin And Kim",
    link = "https://www.shinkim.com/eng/member/list?page=0&size=10&name=a&bizCode=",
    totalPages = 1,
    maxLawyersForSite = 100
  ) {
    super(name, link, totalPages, maxLawyersForSite);

    this._letters = ["e", "i", "o", "u", "y", "n", "g", "k", "s"]
    this._totalPages = this._letters.length;
  }

  
  _getRandomLetter() {
    const randomIndex = Math.floor(Math.random() * this._letters.length);
    return this._letters.splice(randomIndex, 1)[0];
    // Remove and return the letter
  }


  async accessPage(index) {
    const letter = this._getRandomLetter();
    const otherUrl = `https://www.shinkim.com/eng/member/list?page=0&size=10&name=${ letter }&bizCode=`;
    await super.accessPage(index, otherUrl);
    try {} catch (e) {}
  }


  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(
        By.css("li.data-item > div.data-wrap")
      ), 100000
    );

    const webRole = [
      By.className("data-frame"),
      By.className("data-head"),
      By.className("sort"),
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("data-frame"))
      .findElement(By.className("data-head"))
      .findElement(By.className("text"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("data-frame"))
      .findElement(By.className("data-head"))
      .findElement(By.className("text"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("data-info"))
      .findElements(By.css("a"));
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = ShinAndKim;
