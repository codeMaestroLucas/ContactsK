const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class ALMTLegal extends ByPage {
  constructor(
    name = "ALMT Legal",
    link = "https://almtlegal.com/mumbai-partner/",
    totalPages = 2,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }

  async accessPage(index) {
    const otherUrl = 'https://almtlegal.com/bangalore-partner/';
    await super.accessPage(index, otherUrl);
  }

  async getLawyersInPage() {
    return await driver
      .findElement(By.xpath(`//*[@id="content"]/div/div/div[2]/div/div[2]/div/div/div`))
      .findElements(By.className("e-con-inner"));
  }


  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(By.css('a'));

    for (const social of socials) {
      const href = await social.getAttribute('href');
      if (href && href.toLowerCase().includes('mailto:')) {
        return href;
      }
    }
  }
  

  async getLawyer(lawyer) {
    const email = await this.#getSocials(lawyer);

    return {
      name: '', // Name is not available on the page
      email: email,
      country: "India",
    };
  }
}

module.exports = ALMTLegal;
