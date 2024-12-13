const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class PaulHastings extends ByPage {
  constructor(
    name = "Paul Hastings",
    link = "https://www.paulhastings.com/professionals?refinementList%5Boffices.title%5D%5B0%5D=Beijing&refinementList%5Boffices.title%5D%5B1%5D=Brussels&refinementList%5Boffices.title%5D%5B2%5D=Frankfurt&refinementList%5Boffices.title%5D%5B3%5D=Hong%20Kong&refinementList%5Boffices.title%5D%5B4%5D=London&refinementList%5Boffices.title%5D%5B5%5D=Paris&refinementList%5Boffices.title%5D%5B6%5D=Seoul&refinementList%5Boffices.title%5D%5B7%5D=Shanghai&refinementList%5Boffices.title%5D%5B8%5D=Tokyo&refinementList%5Boffices.title%5D%5B9%5D=S%C3%A3o%20Paulo&refinementList%5BrelatedTitle.titleGroup.title%5D%5B0%5D=Partners",
    totalPages = 5,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.paulhastings.com/professionals?page=${ index + 1 }&refinementList%5Boffices.title%5D%5B0%5D=Beijing&refinementList%5Boffices.title%5D%5B1%5D=Brussels&refinementList%5Boffices.title%5D%5B2%5D=Frankfurt&refinementList%5Boffices.title%5D%5B3%5D=Hong%20Kong&refinementList%5Boffices.title%5D%5B4%5D=London&refinementList%5Boffices.title%5D%5B5%5D=Paris&refinementList%5Boffices.title%5D%5B6%5D=Seoul&refinementList%5Boffices.title%5D%5B7%5D=Shanghai&refinementList%5Boffices.title%5D%5B8%5D=Tokyo&refinementList%5Boffices.title%5D%5B9%5D=S%C3%A3o%20Paulo&refinementList%5BrelatedTitle.titleGroup.title%5D%5B0%5D=Partners`;
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("flex flex-col gap-2 w-full")
      ), 100000
    );
  }

  async #getName(lawyer) {
    const html = await lawyer
      .findElement(By.css("h2"))
      .getAttribute("outerHTML");
    return this.getContentFromTag(html);
  }

  async #getSocials(lawyer) {
    const ancors = await lawyer
      .findElements(
        By.className("styles__StyledBaseA-sc-1h7u3so-1 eRSSFd text-sm hover:text-[#B4A06E] hover:underline break-all")
      )

    let email;
    let ddd;

    for (let a of ancors) {
      const href = await a.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) ddd = href;
    }

    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const data = await lawyer
      .findElements(By.className("flex flex-col"));

    const nameDiv = data[0];
    const contactDiv = data[2];

    const { email, ddd } = await this.#getSocials(contactDiv);

    return {
      name: await this.#getName(nameDiv),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = PaulHastings;
