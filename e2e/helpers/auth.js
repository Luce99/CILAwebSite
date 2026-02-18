const { By } = require("selenium-webdriver");
const { BASE_URL } = require("../config/selenium.config");
const { waitForElement, sleep } = require("./wait");

/** Navega a la pagina de login y autentica con correo y contrasena. */
async function login(driver, correo, contrasena) {
  await driver.get(BASE_URL + "/signin");
  await sleep(2000);

  const emailField = await waitForElement(driver, "input[name='email']");
  await emailField.clear();
  await emailField.sendKeys(correo);

  const passwordField = await waitForElement(driver, "input[name='password']");
  await passwordField.clear();
  await passwordField.sendKeys(contrasena);

  const submitButton = await waitForElement(driver, "button[type='submit']");
  await submitButton.click();
  await sleep(3000);
}

/** Cierra la sesion del usuario actual. */
async function logout(driver) {
  await driver.get(BASE_URL);
  await sleep(1000);

  try {
    const salirButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Salir')]"));
    if (salirButtons.length > 0) {
      await salirButtons[0].click();
      await sleep(1000);
    }
  } catch (_err) {
    /* no session active */
  }
}

module.exports = { login, logout };
