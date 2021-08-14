const puppeteer = require("puppeteer");
const groups = require("./groups.json");

const readEnv = () => {
  const {
    GROUP: group,
    URL: url,
    PROPERTY_NAME: propertyName,
    RADIO_VALUE: radioValue,
    ACCESS_CODE: accessCode,
    APT_NUMBER: aptNumber,
    CONFIRMATION_EMAIL: confirmationEmail,
  } = process.env;

  return {
    group,
    url,
    propertyName,
    radioValue,
    accessCode,
    aptNumber,
    confirmationEmail,
  };
};

const timeout = (page) => {
  return page.waitForTimeout(1000);
};

const createGuestPass = async (browser, groupMember) => {
  const { name, make, model, plate } = groupMember;

  const {
    url,
    propertyName,
    radioValue,
    accessCode,
    aptNumber,
    confirmationEmail,
  } = readEnv();

  // New Page
  const page = await browser.newPage();

  // Enter URL and Load
  await page.goto(url);

  // Form 1 - Enter property name into search bar
  await page.type("#propertyName", propertyName);
  await page.click("#confirmProperty");
  await timeout(page);

  // Form 2 - Select properties returned from search
  await page.click(`input[value="${radioValue}"]`);
  await page.click(`#confirmPropertySelection`);
  await timeout(page);

  // Form 3 - Select visitor pass registration type
  await page.click(`#registrationTypeVisitor`);
  await timeout(page);

  // Form 4 - Enter property password
  await page.type("#accessCode", accessCode);
  await page.click(`#propertyPassword`);
  await timeout(page);

  // Form 5 - Fill out visitor information
  await page.type("#vehicleApt", aptNumber);
  await page.type("#vehicleMake", make);
  await page.type("#vehicleModel", model);
  await page.type("#vehicleLicensePlate", plate);
  await page.type("#vehicleLicensePlateConfirm", plate);
  await page.click(`#vehicleInformation`);
  await timeout(page);

  // Confirmation Page - Fill out email information for follow-up
  await page.click(`#email-confirmation`);
  await timeout(page);
  await page.type("#emailConfirmationEmailView", confirmationEmail);
  await page.click(`#email-confirmation-send-view`);

  console.log(`Created Guest Pass for ${name}`);
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: true });

  const { group } = readEnv();
  const groupMembers = groups[group];

  for (let i = 0; i < groupMembers.length; i++) {
    await createGuestPass(browser, groupMembers[i]);
  }

  browser.close();
};

main();
