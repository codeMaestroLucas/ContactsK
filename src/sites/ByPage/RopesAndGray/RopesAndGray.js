const { getCountryByDDD } = require("../../../utils/getNationality");
const ByPage = require("../../../entities/BaseSites/ByPage");
let { driver } = require("../../../config/driverConfig");

const { until, By } = require("selenium-webdriver");

class RopesAndGray extends ByPage {
  constructor(
    name = "Ropes And Gray",
    link = "https://www.ropesgray.com/en/people?offices=acb21c29-c05e-40e2-b68e-81e3bc3df395&offices=46cc9841-9e34-4565-87b2-c4a2042a1721&offices=284963e5-38ec-45fb-87d0-99b21caebd21&offices=f3d1a787-ec2c-4c9b-85ea-0e2a31a295e7&offices=0e008de0-c344-4e56-9126-8426580d8ab5&offices=a18c20e3-f8c9-4d23-afda-cbf49edc31c3&offices=e4299641-e33e-4ba2-abb0-702e9ed9aec9&titles=3ddd81da-24f7-4570-b68b-894a3f82dae0&page=3",
    totalPages = 1,
  ) {
    super(name, link, totalPages);
  }


  async accessPage(index) {
    await super.accessPage(index);
  }


  async getLawyersInPage() {
    return await driver.wait(
      until.elementsLocated(
        By.className("BaseContactCard_contact-card__content-inner__gSj7i")
      ), 100000
    );
  }


  async #getLink(lawyer) {
    return await lawyer
      .findElement(By.className("BaseContactCard_contact-card__name__wNFoV"))
      .findElement(By.css("a"))
      .getAttribute("href");
  }


  async #getName(lawyer) {
    return await lawyer
      .findElement(By.className("BaseContactCard_contact-card__name__wNFoV"))
      .findElement(By.css("a"))
      .getText();
  }


  async #getSocials(lawyer) {
    const socials = await lawyer
      .findElements(By.css("a"))
    return await super.getSocials(socials);
  }
  

  async getLawyer(lawyer) {
    const { email, phone } = await this.#getSocials(lawyer);
    
    return {
      link: await this.#getLink(lawyer),
      name: await this.#getName(lawyer),
      email: email,
      phone: phone,
      country: getCountryByDDD(phone)
    };
  }
}

module.exports = RopesAndGray;
