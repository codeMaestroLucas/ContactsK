const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LeeAndKo extends ByPage {
  constructor(
    name = "Lee And Ko",
    link = "https://www.leeko.com/leenko/member/memberSearchResultList.do?lang=EN&pageNo=2&schKeyword=a",
    totalPages = 1,
    maxLawyersForSite = 1
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
        By.className("leeko-member-item")
      ), 100000
    );

    const webRole = [
      By.className("leeko-member-item__title"),
      By.css("p")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async #getLink(lawyer) {
    const lawyerID = await lawyer.getAttribute("onclick");

    let match = lawyerID.match(/goView\('(\d+)'/);
    if (match) {
      let number = match[1];
      return `https://www.leeko.com/leenko/member/memberDetail.do?lang=EN&memberNo=${ number }&schReturnType=REDIRECT`
    }
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("leeko-member-item__title"))
      .getText();
  }


  async #getSocials(lawyer) {
    const details = await lawyer.findElement(By.className("leeko-member-item__info"));
    const phone = await details
      .findElement(By.css('p:first-child')).getText();
    const email = await details
      .findElement(By.css('p:last-child')).getText();
    return { email, phone };
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email.replace("E", ""),
      phone: phone,
      country: "Korea (South)"
    };
  }
}

module.exports = LeeAndKo;

async function main() {
  t = new LeeAndKo();
  // t.accessPage(0);
  t.searchForLawyers();
}

main();
//todo: test it