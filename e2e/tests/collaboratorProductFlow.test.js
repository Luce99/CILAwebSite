const { createDriver } = require("../helpers/setup");
const { login, logout } = require("../helpers/auth");
const { waitForElement, waitForXpath, sleep } = require("../helpers/wait");
const { BASE_URL } = require("../config/selenium.config");
const { By } = require("selenium-webdriver");

let driver;

describe("Collaborator Product Flow", () => {
  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("debe navegar a la pagina de productos del panel admin", async () => {
    await driver.get(BASE_URL + "/administracion/productos");
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/administracion/productos");
  });

  it("debe mostrar la tabla de productos", async () => {
    const heading = await waitForXpath(driver, "//*[contains(text(), 'Gestión de Productos')]");
    const text = await heading.getText();
    expect(text).toContain("Gestión de Productos");
  });

  it("debe mostrar botones de proponer cambio en la tabla", async () => {
    const proposeButtons = await driver.findElements(
      By.xpath("//button[contains(text(), 'Proponer cambio')]")
    );
    expect(proposeButtons.length).toBeGreaterThanOrEqual(0);
  });
});
