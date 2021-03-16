//Grenzwerttest einer Xesar 2.2 Anlage im Bezug auf die Bereiche mit Zuweisung mehrerer Berechtigungsprofile
//die Xesar2.2-APP muss dafür gestartet sein

//Tests XS3-2705

const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
   headless: false,
   ignoreHTTPSerrors: true,
   //slowMo: 50,
   args: [
   '--ignore-certificate-errors', // zwingend notwendig
   '--ignore-certificate-errors-spki-list '
   ]
 });
  const page = await browser.newPage();

  await page.goto('https://localhost:6443/Frontend');

  await page.waitFor('#LFF_usernameField').then(() => page.type('#LFF_usernameField', 'admin'));
  await page.type('#LFF_passwordField', 'Aess123');
  await page.keyboard.press('Enter');

  for (var i = 1; i <= 95; i++){ //95 Bereiche und Berechtigungsprofile
    await page.waitFor('#megamenu span:nth-child(2)').then(() => page.hover('#megamenu span:nth-child(2)'));
    await page.waitFor('#MM_doorID').then(() => page.click('#MM_doorID'));

    if (i == 1){
      await page.waitFor('#DLV_addDoorGroupButton').then(() => page.click('#DLV_addDoorGroupButton'));
    } else {
      await page.waitFor('#DLV_doorAreaFilter tr:nth-child('+(i-1)+')').then(() => page.click('#DLV_addDoorGroupButton'));
    }
    if(i < 10){
      await page.waitFor('#DGFF_doorGroupNameField').then(() => page.type('#DGFF_doorGroupNameField', 'area0'+i));
    } else {
      await page.waitFor('#DGFF_doorGroupNameField').then(() => page.type('#DGFF_doorGroupNameField', 'area'+i));
    }
    await page.keyboard.press('Enter');
    await page.waitFor('#ADGPV_AddDoorGroupPopupView', {hidden : true});

    await page.waitFor('#megamenu span:nth-child(3)').then(() => page.hover('#megamenu span:nth-child(3)'));
    await page.waitFor('#MM_accessPermissionProfiles').then(() => page.click('#MM_accessPermissionProfiles'));

    await page.waitFor('#APPLV_addButton').then(() => page.click('#APPLV_addButton'));

    await page.waitFor('#APPFF_name').then(() => page.type('#APPFF_name', 'authorizationprofile'+i));

    await page.evaluate(_ => {
      document.querySelector('#EGV_accessListAvailable > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr:last-child').scrollIntoView(true);
    });

    await page.click('#EGV_accessListAvailable > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr:last-child > td > div.v-table-cell-wrapper');
    await page.waitFor('#EGV_accessListAvailable tr.v-selected').then(() => page.click('#EGV_moveRightButton'));
    await page.waitFor('#EGV_accessListSelected tr:nth-child(1)').then(() => page.click('#APPDV_saveButton'));

    await page.waitFor('#APPLV_addButton');
  }

  await page.waitFor('#APPLV_addButton').then(() => page.click('#APPLV_addButton'));
  await page.waitFor('#APPFF_name').then(() => page.type('#APPFF_name', 'authorizationprofile_all'));

  for(var j = 1; j <= 95; j++){//zuweisung der Berechtigungen
    if(j == 1){
      await page.click('#EGV_accessListAvailable .v-table-cell-wrapper');
    } else {
      await page.waitFor('#EGV_accessListSelected tr:nth-child('+(j-1)+')').then(() => page.click('#EGV_accessListAvailable > div.v-scrollable.v-table-body-wrapper.v-table-body > div:nth-child(1) > table > tbody > tr > td > div.v-table-cell-wrapper'));
    }
    await page.waitFor('#EGV_accessListAvailable tr.v-selected').then(() => page.click('#EGV_moveRightButton'));
  }
  await page.waitFor('#EGV_accessListSelected tr:nth-child('+(j-1)+')').then(() => page.click('#APPDV_saveButton'));

  await page.waitFor('#megamenu span:nth-child(1)').then(() => page.click('#megamenu span:nth-child(1)'));

//browser.close();
}

run();