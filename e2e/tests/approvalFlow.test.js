const { createDriver } = require("../helpers/setup");
const { login, logout } = require("../helpers/auth");
const { waitForXpath, sleep } = require("../helpers/wait");
const { BASE_URL } = require("../config/selenium.config");

const ADMIN_EMAIL = "lual-99@hotmail.com";
const ADMIN_PASSWORD = "test1234";

let driver;

describe("Approval Flow", () => {
  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("debe hacer login como admin", async () => {
    await login(driver, ADMIN_EMAIL, ADMIN_PASSWORD);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain(BASE_URL);
  });

  it("debe navegar a la pagina de aprobaciones", async () => {
    await driver.get(BASE_URL + "/administracion/aprobaciones");
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/administracion/aprobaciones");
  });

  it("debe mostrar el titulo de aprobaciones pendientes", async () => {
    const heading = await waitForXpath(driver, "//*[contains(text(), 'Aprobaciones pendientes')]");
    const text = await heading.getText();
    expect(text).toContain("Aprobaciones pendientes");
  });

  it("debe mostrar la campana de notificaciones", async () => {
    const bells = await driver.findElements(
      require("selenium-webdriver").By.css("[data-testid='NotificationsIcon'], svg.MuiSvgIcon-root")
    );
    expect(bells.length).toBeGreaterThan(0);
  });

  it("debe hacer logout", async () => {
    await logout(driver);
    await sleep(1000);
  });
});
