const { createDriver } = require("../helpers/setup");
const { login, logout } = require("../helpers/auth");
const { waitForXpath, waitForElement, sleep } = require("../helpers/wait");
const { BASE_URL } = require("../config/selenium.config");

let driver;

describe("Password Change", () => {
  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("debe navegar a la pagina de cuenta", async () => {
    await driver.get(BASE_URL + "/accountPage");
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/accountPage");
  });

  it("debe mostrar la pagina de cuenta o redirigir a signin", async () => {
    const currentUrl = await driver.getCurrentUrl();
    const isAccountOrSignin =
      currentUrl.includes("/accountPage") || currentUrl.includes("/signin");
    expect(isAccountOrSignin).toBe(true);
  });
});
