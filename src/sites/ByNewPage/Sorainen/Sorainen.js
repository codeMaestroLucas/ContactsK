const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class Sorainen extends ByNewPage {
  constructor(
    name = "Sorainen",
    link = "https://www.sorainen.com/people/?s_role=board&action=sorainenfilter",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);

    await driver
      .findElement(By.xpath('/html/body/div[2]/div/div/div/div[2]/button[2]'))
      .click();

    const loadMoreBtn = await driver.findElement(By.id("sorainen_loadmore"));
    for (let i = 0; i < 2; i++) {
      await new Promise(resolve => setTimeout(resolve, 400));
      await loadMoreBtn.click();
      await new Promise(resolve => setTimeout(resolve, 800));
    }
  }


  async getLawyersInPage() {
    await new Promise(resolve => setTimeout(resolve, 500));
    const lawyers = await driver
      .findElement(By.id("sorainen_posts_wrap"))
      .findElements(By.css("li > a"));
    return lawyers;
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .getAttribute("href");

    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className("personHeader__name"))
      .getText();

    
    return nameElement
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElement(By.className("personHeader__field personHeader__field--l"))
      .findElements(By.css("a"));

    let email;
    let ddd;
    
    for (let social of socials) {
      const href = await social.getAttribute("href");
      if (href.includes("tel:+")) ddd = href;
      else if (href.includes("mailto:")) email = href;

      if (email && ddd) break;
    }

    return { email, ddd };
  }

  
  async getLawyer(lawyer) {
    const details = await driver.findElement(By.className("personHeader__main"));

    const { email, ddd } = await this.#getSocials(details);

    return {
      name: await this.#getName(details),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = Sorainen;
