const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { By, until } = require("selenium-webdriver");

class Kinstellar extends ByPage {
  constructor(
    name = "Kinstellar",
    link = "https://www.kinstellar.com/our-team?filter%5Bname%5D=&filter%5Bposition%5D=16%2C14%2C13%2C29%2C1%2C30&filter%5Bexpertise%5D=&filter%5Blocation%5D=&filter%5Bsent%5D=true",
    totalPages = 1
  ) {
    super(name, link, totalPages);
  }

  async accessPage(index) {
    await super.accessPage(index);
    await this.rollDown(6, 3);

    try {
      const addBtn = await driver.wait(
        until.elementLocated(
          By.id("CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")
        ),
        2000
      );
      await addBtn.click();
    } catch (e) {}
  }

  async getLawyersInPage() {
    const lawyers = await driver.wait(
      until.elementsLocated(By.className("row table_row"))
    );
    return lawyers;
  }

  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className(
        "col-md-8 col-sm-8 col-xs-12 table_1stcol table_fiter_nameposition"
      ))
      .findElement(By.css("div > div > a"))
      .getText();
  }

  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.css("div:nth-child(2)")) // It has a class, but not all the divs have it
      .findElement(By.css("div > div"))
      .findElements(By.css("a"));

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("tel:")) ddd = href;
      else if (href.includes("@kinstellar.com"))email = href;

    }
    return { email, ddd };
  }

  async getLawyer(lawyer) {
    const { email, ddd } = await this.#getSocials(lawyer);

    return {
      name: await this.#getName(lawyer),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = Kinstellar;
