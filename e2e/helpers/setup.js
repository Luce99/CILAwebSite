const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { IMPLICIT_WAIT_MS } = require("../config/selenium.config");

/** Crea y configura un driver de Chrome para tests e2e usando Selenium Manager. */
async function createDriver() {
  const options = new chrome.Options();
  options.addArguments("--headless=new");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments("--disable-gpu");
  options.addArguments("--window-size=1280,900");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: IMPLICIT_WAIT_MS });
  return driver;
}

module.exports = { createDriver };
