const { getCountryByDDD } = require("../../../utils/getNationality");

const ByNewPage = require("../../../entities/BaseSites/ByNewPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class TillekeAndGibbins extends ByNewPage {
  constructor(
    name = "Tilleke And Gibbins",
    link = "https://www.tilleke.com/professionals/?fl_name=wpcf-professional_given_name&alpha=&position[]=4553&location=&keyword=",
    totalPages = 1,
    maxLawyersForSite = 1
  ) {
    super(name, link, totalPages, maxLawyersForSite);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    const lawyersDiv = await driver.wait(
      until.elementLocated(
        By.className('ecs-posts elementor-posts-container elementor-posts   elementor-grid elementor-posts--skin-custom')
      ), 100000
    );

    const lawyers = await lawyersDiv.findElements(By.className("elementor-widget-container"));
    return lawyers.splice(1, 35);
  }

  
  async openNewTab(lawyer) {
    const link = await lawyer
      .findElement(By.css("a"))
      .getAttribute("href");
    await super.openNewTab(link);
  }


  async #getName(lawyer) {
    const nameElement = await lawyer
      .findElement(By.className("elementor-heading-title elementor-size-default"))
      .getText();

    
    return nameElement
  }


  async #getSocials(lawyer) {
    console.log(await lawyer.getAttribute("outerHTML"))
    const socials = await lawyer
      // .findElement(By.css("div.elementor-element.elementor-element-19ae5f3.elementor-icon-list--layout-traditional.elementor-list-item-link-full_width.elementor-widget.elementor-widget-icon-list"))
      // .findElement(By.className("elementor-widget-container"))
      .findElement(By.className("elementor-icon-list-items"))
      .findElements(By.className("elementor-icon-list-item"));

    let email;
    let ddd;

    for (let social of socials) {
      const href = await social
       .findElement(By.css("a"))
       .getAttribute("href");
      
      if (href.includes("mailto:")) email = href;
      else if (href.includes("tel:")) ddd = href;

      if (email && ddd) break;
    }

      
    return { email, ddd };
  }

  
  async getLawyer(lawyer) {
    const details = await driver
      .findElement(By.className("elementor-widget-wrap elementor-element-populated"));

    // const role = (await details
    //   .findElement(By.className("elementor-heading-title elementor-size-default"))
    //   .getAttribute("outerHTML")
    // ).toLowerCase();

    // if (!role.includes("partner")) return "Not Partner"
    
    const { email, ddd } = await this.#getSocials(details);

    return {
      name: await this.#getName(details),
      email: email,
      country: getCountryByDDD(ddd),
    };
  }
}

module.exports = TillekeAndGibbins;

async function main() {
  t = new TillekeAndGibbins();
  await t.searchForLawyers();
}

main();
