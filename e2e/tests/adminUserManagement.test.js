const { createDriver } = require("../helpers/setup");
const { login, logout } = require("../helpers/auth");
const { waitForElement, waitForXpath, sleep, waitForUrlContains } = require("../helpers/wait");
const { BASE_URL } = require("../config/selenium.config");
const { By } = require("selenium-webdriver");

const ADMIN_EMAIL = "lual-99@hotmail.com";
const ADMIN_PASSWORD = "test1234";
const TEST_COLLABORATOR_EMAIL = "selenium-collab-" + Date.now() + "@test.com";
const TEST_COLLABORATOR_PASSWORD = "TempPass123";

let driver;

describe("Admin User Management", () => {
  beforeAll(async () => {
    driver = await createDriver();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it("debe hacer login como administrador", async () => {
    await login(driver, ADMIN_EMAIL, ADMIN_PASSWORD);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain(BASE_URL);
  });

  it("debe navegar a la gestion de usuarios", async () => {
    await driver.get(BASE_URL + "/administracion/usuarios");
    await sleep(3000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).toContain("/administracion/usuarios");
  });

  it("debe ver la tabla de usuarios staff", async () => {
    const heading = await waitForXpath(driver, "//*[contains(text(), 'Gestión de Usuarios')]");
    const text = await heading.getText();
    expect(text).toContain("Gestión de Usuarios");
  });

  it("debe abrir el modal de crear usuario", async () => {
    const createButton = await waitForXpath(driver, "//button[contains(text(), 'Crear usuario')]");
    await createButton.click();
    await sleep(1000);

    const modalTitle = await waitForXpath(driver, "//*[contains(text(), 'Crear usuario')]");
    const text = await modalTitle.getText();
    expect(text).toContain("Crear usuario");
  });

  it("debe cerrar el modal de crear usuario", async () => {
    const cancelButton = await waitForXpath(driver, "//button[contains(text(), 'Cancelar')]");
    await cancelButton.click();
    await sleep(500);
  });

  it("debe hacer logout", async () => {
    await logout(driver);
    await sleep(1000);
  });
});
