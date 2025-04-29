const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { By } = require("selenium-webdriver");

class BaeKimAndLee extends ByPage {
  constructor(
    name = "Bae Kim And Lee",
    link = "https://www.bkl.co.kr/law/member/allList.do?isMain=&pageIndex=1&searchCondition=&url=all&job=&lang=en&memberNo=&searchYn=Y&logFunction=&searchKeyword=a#,5,1,1",
    // To load more just increase the number after the #
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
    const otherUrl = `https://www.bkl.co.kr/law/member/allList.do?isMain=&pageIndex=1&searchCondition=&url=all&job=&lang=en&memberNo=&searchYn=Y&logFunction=&searchKeyword=${ letter }#,5,1,1`;
    await super.accessPage(index, otherUrl);
  }


  async getLawyersInPage() {
    const lawyers = await driver
      .findElement(By.id("isMainY"))
      .findElements(By.css("ul > li"))
    const webRole = [
      By.className("txt2")
    ];
    return await super.filterPartnersInPage(lawyers, webRole, true);
  }


  async getLawyer(lawyer) {
    return {
      name: await lawyer.findElement(By.className("txt1")).getText(),
      email: await lawyer.findElement(By.className("email")).getAttribute("href"),
      country: 'Korea (South)'
    };
  }
}

module.exports = BaeKimAndLee;
