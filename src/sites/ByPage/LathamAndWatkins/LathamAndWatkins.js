const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class LathamAndWatkins extends ByPage {
  constructor(
    name = "Latham And Watkins",
    link = "https://www.lw.com/en/people#sort=%40peoplerankbytitle%20ascending%3B%40peoplelastname%20ascending&f:@peopleoffices=[Austin,Brussels,Dubai,D%C3%BCsseldorf,Frankfurt,Hamburg,Hong%20Kong,London,Madrid,Milan,Munich,Orange%20County,Riyadh,Singapore,Tokyo]&f:@peoplebuckettitle=[Partner]",
    totalPages = 5,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    const otherUrl = `https://www.lw.com/en/people#first=${ index * 20 }&sort=%40peoplerankbytitle%20ascending%3B%40peoplelastname%20ascending&f:@peopleoffices=[Austin,Brussels,Dubai,D%C3%BCsseldorf,Frankfurt,Hamburg,Hong%20Kong,London,Madrid,Milan,Munich,Orange%20County,Riyadh,Singapore,Tokyo]&f:@peoplebuckettitle=[Partner]`;
    await super.accessPage(index, otherUrl);
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      const addBtn = await driver.wait(
        until.elementLocated(By.id("onetrust-accept-btn-handler")),
        2000
      );
      await addBtn.click();
    } catch (e) {}
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("contacts__card-content")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("CoveoResultLink"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.css("h3 > a.CoveoResultLink > span > span"))
      .getText();
  }
  

  async #getSocials(lawyer) {
    const socials = await lawyer.findElements(
      By.className("CoveoFieldValue contacts__card-detail")
    );

    let email;
    let phone;

    for (let social of socials) {
      const span = (await social
        .findElement(By.css("span"))
        .getText()).toLowerCase();

      if (span.includes("@lw.com")) email = span;
      else if (span.includes("+")) phone = span;

      if (email && phone) break;
    }

    return { email, phone }
  }

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone),
    };
  }
}

module.exports = LathamAndWatkins;
