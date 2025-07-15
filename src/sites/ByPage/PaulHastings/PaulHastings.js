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
    this.currentUrl = link;
  }


  async accessPage(index) {
    const otherUrl = `https://www.paulhastings.com/professionals?page=${ index + 1 }&refinementList%5Boffices.title%5D%5B0%5D=Beijing&refinementList%5Boffices.title%5D%5B1%5D=Brussels&refinementList%5Boffices.title%5D%5B2%5D=Frankfurt&refinementList%5Boffices.title%5D%5B3%5D=Hong%20Kong&refinementList%5Boffices.title%5D%5B4%5D=London&refinementList%5Boffices.title%5D%5B5%5D=Paris&refinementList%5Boffices.title%5D%5B6%5D=Seoul&refinementList%5Boffices.title%5D%5B7%5D=Shanghai&refinementList%5Boffices.title%5D%5B8%5D=Tokyo&refinementList%5Boffices.title%5D%5B9%5D=S%C3%A3o%20Paulo&refinementList%5BrelatedTitle.titleGroup.title%5D%5B0%5D=Partners`;
    if (index !== 0) this.currentUrl = otherUrl;
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
    return await super.getContentFromTag(html);
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElements(
        By.className("styles__StyledBaseA-sc-1h7u3so-1 eRSSFd text-sm hover:text-[#B4A06E] hover:underline break-all")
      )
    return await super.getSocials(socials);
  }

  async getLawyer(lawyer) {
    const details = await lawyer
      .findElements(By.className("flex flex-col"));

    const nameDiv = details[0];
    const contactDiv = details[2];

    const { email, phone } = await this.#getSocials(contactDiv);

    return {
      link: this.currentUrl,
      name: await this.#getName(nameDiv),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = PaulHastings;
