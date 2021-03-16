//Grenzwerttest einer Xesar 2.2 Anlage im Bezug auf die Bereiche und Einbauorte mit Zuweisung an genau 1 Berechtigungsprofil
//die Xesar2.2-APP muss dafür gestartet sein

//Tests XS3-2648

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
  for (var i = 1; i <= 32; i++){
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

  //Bereiche anlegen
  await page.waitFor('#megamenu span:nth-child(2)').then(() => page.hover('#megamenu span:nth-child(2)'));
  await page.waitFor('#MM_doorID').then(() => page.click('#MM_doorID'));
  for (var k = 1; k <= 95; k++){
    await page.waitFor('#DLV_addDoorGroupButton').then(() => page.click('#DLV_addDoorGroupButton > span > span'));
    if(k < 10){
      await page.waitFor('#DGFF_doorGroupNameField').then(() => page.type('#DGFF_doorGroupNameField', 'area0'+k));
    } else {
      await page.waitFor('#DGFF_doorGroupNameField').then(() => page.type('#DGFF_doorGroupNameField', 'area'+k));
    }
    await page.keyboard.press('Enter');
    await page.waitFor('#ADGPV_AddDoorGroupPopupView', {hidden : true});
  }

  //1 Berechtigungsprofil anlegen
  await page.waitFor('#megamenu span:nth-child(3)').then(() => page.hover('#megamenu span:nth-child(3)'));
  await page.waitFor('#MM_accessPermissionProfiles').then(() => page.click('#MM_accessPermissionProfiles'));
  await page.waitFor('#APPLV_addButton > span > span').then(() => page.click('#APPLV_addButton > span > span'));
  await page.waitFor('#APPFF_name').then(() => page.type('#APPFF_name', 'Berechtigungsprofil_ALL'));

  //Anzahl Einbauorte + Bereiche ermitteln
  var tl = await page.evaluate(() => document.querySelectorAll('#EGV_accessListAvailable > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr').length);

  //Alle Einbauorte & Bereiche dem Berechtigungsprofil zuweisen
  for(var j = 1; j <= tl; j++){
    if(j == 1){
      await page.click('#EGV_accessListAvailable .v-table-cell-wrapper');
    } else {
      await page.waitFor('#EGV_accessListSelected > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr:nth-child('+(j-1)+')').then(() => page.click('#EGV_accessListAvailable > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr > td > div.v-table-cell-wrapper'));
    }
    await page.waitFor('#EGV_accessListAvailable tr.v-selected').then(() => page.click('#EGV_moveRightButton'));
  }
  await page.waitFor('#EGV_accessListSelected > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr:nth-child('+(j-1)+')').then(() => page.click('#APPDV_saveButton'));
  await page.waitFor('#megamenu span:nth-child(1)').then(() => page.click('#megamenu span:nth-child(1)'));

  //33ter Einbauort
  await page.waitFor('#megamenu span:nth-child(2)').then(() => page.hover('#megamenu span:nth-child(2)'));
  await page.waitFor('#MM_doorID').then(() => page.click('#MM_doorID'));
  await page.waitFor('#DLV_addDoorButton').then(() => page.click('#DLV_addDoorButton'));
  await page.waitFor('#DDFF_nameField').then(() => page.type('#DDFF_nameField', 'component33'));
  await page.click('#ADV_saveButton');

  await page.waitFor('#megamenu span:nth-child(1)').then(() => page.click('#megamenu span:nth-child(1)'));
}

run();