const { until, By } = require("selenium-webdriver");
const { TIMEOUT_MS } = require("../config/selenium.config");

/** Espera hasta que un elemento con el selector CSS dado sea visible. */
async function waitForElement(driver, cssSelector) {
  const element = await driver.wait(
    until.elementLocated(By.css(cssSelector)),
    TIMEOUT_MS
  );
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS);
  return element;
}

/** Espera hasta que un elemento con el xpath dado sea visible. */
async function waitForXpath(driver, xpath) {
  const element = await driver.wait(
    until.elementLocated(By.xpath(xpath)),
    TIMEOUT_MS
  );
  await driver.wait(until.elementIsVisible(element), TIMEOUT_MS);
  return element;
}

/** Espera un tiempo fijo en milisegundos. */
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Espera a que la URL contenga un texto especifico. */
async function waitForUrlContains(driver, text) {
  await driver.wait(until.urlContains(text), TIMEOUT_MS);
}

module.exports = { waitForElement, waitForXpath, sleep, waitForUrlContains };
