const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class JSA extends ByNewPage {
  constructor(
    name = "JSA",
    link = "https://www.jsalaw.com/our-people/?service=&sector=&people_role=Partner&location=",
    totalPages = 12,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    const otherUrl = `${this._link}&p_num=${index + 1}`;
    await super.accessPage(index, otherUrl);
    try {
      const addBtn = await driver.findElement(By.id("wpdp-close"));
      await addBtn.click();
    } catch (e) {}
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(By.css(".team-list-seprate a")),
      100000
    );
  }


  async openNewTab(lawyer) {
    const link = await lawyer.getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("ourPeopleTitle"))
      .findElement(By.className("peopleLeft"))
      .findElement(By.css("h2"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("blog-post"))
      .findElements(By.css("ul > li > span"));

    let email;
    let phone;

    for (let social of socials) {
      const text = await social.getText();
      if (text.includes("@jsalaw")) email = text;
      else if (text.includes("+")) phone = text;

      if (email && phone) break;
    }

    return { email, phone };
  }


  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("col-sm-8"));

    const { phone, email } = await this.#getSocials(details);

    return {
      link: await driver.getCurrentUrl(),
      name: await this.#getName(details),
      email: email,
      phone: phone,
      country: "India"
    };
  }
}

module.exports = JSA;
