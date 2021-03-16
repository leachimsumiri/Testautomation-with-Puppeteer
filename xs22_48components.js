//Grenzwerttest einer Xesar 2.2 Anlage im Bezug auf die Bereiche und Einbauorte mit Zuweisung an genau 1 Berechtigungsprofil
//die Xesar2.2-APP muss dafür gestartet sein
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
   headless: false,
   ignoreHTTPSerrors: true,
   args: [
    '--ignore-certificate-errors', // zwingend notwendig
    '--ignore-certificate-errors-spki-list '
   ]
  });
  const page = await browser.newPage();
  await page.goto('https://localhost:6443/Frontend');

  //Einloggen
  await page.waitFor('#LFF_usernameField').then(() => page.type('#LFF_usernameField', 'admin'));
  await page.type('#LFF_passwordField', 'Aess123');
  await page.keyboard.press('Enter');

  //Einbauort anlegen
  for (var i = 1; i <= 48; i++){
    await page.waitFor('#megamenu span:nth-child(2)').then(() => page.hover('#megamenu span:nth-child(2)'));
    await page.waitFor('#MM_doorID').then(() => page.click('#MM_doorID'));
    await page.waitFor('#DLV_addDoorButton').then(() => page.click('#DLV_addDoorButton'));

    if(i < 10){
      await page.waitFor('#DDFF_nameField').then(() => page.type('#DDFF_nameField', 'component0'+i));
    } else {
      await page.waitFor('#DDFF_nameField').then(() => page.type('#DDFF_nameField', 'component'+i));
    }

    await page.click('#ADV_saveButton');
  }
}

run();