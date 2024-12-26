const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class SprusonAndFerguson extends ByPage {
  constructor(
    name = "Spruson And Ferguson",
    link = "https://www.spruson.com/our-people/",
    totalPages = 5,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherLink = "https://www.spruson.com/our-people/page/${ index + 1 }/"
    await super.accessPage(index, otherLink);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("post-entry")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
     .findElement(By.className("post-name h3"))
     .findElement(By.css("a"))
     .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("post-name h3"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("post-contact"))
      .findElements(By.css("a"))

    let email;
    let phone;

    for(let social of socials) {
      const href = await social.getAttribute("href");

      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) phone = href;

      if (email && phone) break;
    }

    return { email, phone };
  }


  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer)

    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = SprusonAndFerguson;

async function main() {
  t = new SprusonAndFerguson();
  t.searchForLawyers();
}

main();