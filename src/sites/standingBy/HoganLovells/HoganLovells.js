const { getCountryByDDD } = require("../../../../utils/getNationality");
let { driver } = require("../../../../config/driverConfig");
const Site = require("../../Site");

const { until, By } = require("selenium-webdriver");

// FILTER
class HoganLovells extends Site {
  constructor(
    name = "Hogan Lovells",
    link = "https://www.hoganlovells.com/en/people?searchtext=&personposition=e7ed6b5ccdeb4f2d897a18d3cc9ed0de&personrelatedlocation_sm=&industryrelationships_sm=&practices=&practicegroupt=",
    totalPages = 77
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    if (index === 0) {
      await super.accessPage(index);
    }
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.className("card-panel")),
      20000
    );
  }

  async #getName(lawyer) {
    const elementDiv1 = await lawyer.findElement(By.className("card-inner"));
    const elementDiv = await elementDiv1.findElement(By.className("mobile-desc"));
    const nameDiv = await elementDiv.findElement(By.className("name"));
    const name = await nameDiv.findElement(By.className("inner-link"))
    const name2 = await name.getText();
    console.log("Name: ", name2);
    return name2;
  }

  async #getSocialLinks(lawyer) {
    const linksDiv = await lawyer.findElement(By.className("card-btn"));
    const anchorsElements = await linksDiv.findElements(By.css("a"));

    let email = null;
    let ddd = null;

    for (let anchor of anchorsElements) {
      const href = await anchor.getAttribute("href");

      if (href.includes("mailto:")) {
        email = href.replace("mailto:", "");

      } else if (href.includes("tel:+")) {
        ddd = href.replace("tel:+", "");
      }
    }

    return { email, ddd }
  }

  async getLawyer(lawyer) {
    const name = await this.#getName(lawyer);
    const { email, ddd } = await this.#getSocialLinks(lawyer);
    // console.log(name, email, ddd);

    return {
      name: name,
      email: email,
      country: getCountryByDDD(ddd),
    };
  }

  async searchForLawyers(numberOfIterations) {
    await super.searchForLawyers(numberOfIterations);
  }
}

module.exports = HoganLovells;

async function main() {
  const hoganLovells = new HoganLovells();
  await hoganLovells.searchForLawyers();
}

main();
