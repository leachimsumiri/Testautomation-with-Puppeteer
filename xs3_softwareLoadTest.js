//Goal: Betestung wie sich die Software nach Ausschöpfen mehrerer Leistungskriterien in Kombination verhält
//last edit: v3.0.105

const puppeteer = require('puppeteer');

//Hier jeweils die gewünschte Menge an Last angeben
var components = 32; //Einbauorte
var areas = 95; //Bereiche
var profiles = 300; //Berechtigungsprofile
var timeprofiles = 300; //Zeitprofile
var persons = 6000; //Personen

var areaComponentSites;
var profileAreaSites;
var profileComponentSites;

async function run() {
  const browser = await puppeteer.launch({
  	headless: false,
  	ignoreHTTPSerrors: true,
    //slowMo: 50,
  	args: [
        '--ignore-certificate-errors',            //zwingend notwendig
        '--ignore-certificate-errors-spki-list '
    ]
  });
  const page = await browser.newPage();
  page.bringToFront();
  await page.goto('https://192.168.192.55:8080');
  
  //JQUERY
  //await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.3.1.min.js'});

  //Fenstergröße anpassen
  //https://github.com/GoogleChrome/puppeteer/issues/1183  
  const height = 975;//manuelle Eingabe je nach Bedarf
  const width = 1650;
  await page.setViewport({height, width});
  // Any tab.
  const {targetInfos: [{targetId}]} = await browser._connection.send(
    'Target.getTargets'
  );
  // Tab window. 
  const {windowId} = await browser._connection.send(
    'Browser.getWindowForTarget',
    {targetId}
  );
  // Resize.
  await browser._connection.send('Browser.setWindowBounds', {
    bounds: {height, width},
    windowId
  });
  //----------------------------------------------------

  //Einloggen
  await page.waitFor('[data-selenium="input-username"]');
  var username = await page.$('[data-selenium="input-username"]');
  await username.type('Michi');
  await page.type('[data-selenium="input-password"]', 'md0RideqBR');
  await username.press('Enter');	
 
  //Einbauorte(Zylinder) anlegen
  
  await page.waitFor('[data-selenium="tile-componentsSafe"]').then(() => page.click('[data-selenium="tile-componentsSafe"]'));
  for (var c1 = 1; c1 <= components; c1++) {
    await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));
    await page.waitFor('[data-selenium="select-componentType"]').then(() => page.click('[data-selenium="select-componentType"]'));

    await page.waitFor('[data-selenium="select-componentType"]').then(() => page.select('[data-selenium="select-componentType"]', 'Cylinder'));
    await page.click('[data-selenium="btn-continue"]');

    if(c1 < 10){
      await page.waitFor('[data-selenium="input-installationId"]').then(() => page.type('[data-selenium="input-installationId"]', 'component00'+c1));
      await page.type('[data-selenium="input-name"]', 'component00'+c1);
    } else if(c1 > 9 && c1 < 100){
      await page.waitFor('[data-selenium="input-installationId"]').then(() => page.type('[data-selenium="input-installationId"]', 'component0'+c1));
      await page.type('[data-selenium="input-name"]', 'component0'+c1);
    } else {
      await page.waitFor('[data-selenium="input-installationId"]').then(() => page.type('[data-selenium="input-installationId"]', 'component'+c1));
      await page.type('[data-selenium="input-name"]', 'component'+c1);
    }

      //Bugfix 3.0.207:
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
  });
  //await page.click('[data-selenium="btn-save"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').focus();
  });

    await page.keyboard.press('Enter');
  }
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));
  
  //Bereiche anlegen
  await page.waitFor('[data-selenium="tile-zones"]').then(() => page.click('[data-selenium="tile-zones"]'));
  for(var c2 = 1; c2 <= areas; c2++){
    await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));
    if(c2 < 10){
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'zone00'+c2));
    } else if(c2 > 9 && c2 < 100){
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'zone0'+c2));
    } else {
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'zone'+c2));
    }

    //Bugfix 3.0.207:
    page.evaluate(_ => {
      document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
    });
    //await page.click('[data-selenium="btn-save"]');
    page.evaluate(_ => {
      document.querySelector('[data-selenium="btn-save"]').focus();
    });

    await page.keyboard.press('Enter');
  }
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));

  //Berechtigungsprofil anlegen
  await page.waitFor('[data-selenium="tile-authorizationProfile"]').then(() => page.click('[data-selenium="tile-authorizationProfile"]'));
  for(var c3 = 1; c3 <= profiles; c3++){
    await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));
    if(c3 < 10){
      await page.waitFor('[data-selenium="name"]').then(() => page.type('[data-selenium="name"]', 'profile00'+c3));
    } else if(c3 > 9 && c3 < 100){
      await page.waitFor('[data-selenium="name"]').then(() => page.type('[data-selenium="name"]', 'profile0'+c3));
    } else{
      await page.waitFor('[data-selenium="name"]').then(() => page.type('[data-selenium="name"]', 'profile'+c3));
    }
     //Bugfix 3.0.207:
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
  });
  //await page.click('[data-selenium="btn-save"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').focus();
  });

    await page.keyboard.press('Enter');
  }
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));

  //Zeitprofile anlegen
  await page.waitFor('[data-selenium="tile-timeProfiles"]').then(() => page.click('[data-selenium="tile-timeProfiles"]'));
  for(var c4 = 1; c4 <= timeprofiles; c4++){
    await page.waitFor('[data-selenium="addAuthorizationTimeProfile"]').then(() => page.click('[data-selenium="addAuthorizationTimeProfile"]'));
    if(c4 < 10){
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'timeprofile00'+c4));
    } else if(c4 > 9 && c4 < 100){
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'timeprofile0'+c4));
    } else{
      await page.waitFor('[data-selenium="input-name"]').then(() => page.type('[data-selenium="input-name"]', 'timeprofile'+c4));
    }
   
     //Bugfix 3.0.207:
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
  });
  //await page.click('[data-selenium="btn-save"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').focus();
  });

    await page.keyboard.press('Enter');
  }
  await page.waitFor('[data-selenium="addAuthorizationTimeProfile"]').then(() => page.click('[data-selenium="link-home"]'));

  //Personen anlegen
  await page.waitFor('[data-selenium="tile-persons"]').then(() => page.click('[data-selenium="tile-persons"]'));
  for(var c5 = 1; c5 <= persons; c5++){
    await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));
    if(c5 < 10){
      await page.waitFor('[data-selenium="input-firstName"]').then(() => page.type('[data-selenium="input-firstName"]', 'person000'+c5));
      await page.type('[data-selenium="input-lastName"]', 'person000'+c5);
    } else if(c5 > 9 && c5 < 100){
      await page.waitFor('[data-selenium="input-firstName"]').then(() => page.type('[data-selenium="input-firstName"]', 'person00'+c5));
      await page.type('[data-selenium="input-lastName"]', 'person00'+c5);
    } else if(c5 > 99 && c5 < 1000){
      await page.waitFor('[data-selenium="input-firstName"]').then(() => page.type('[data-selenium="input-firstName"]', 'person0'+c5));
      await page.type('[data-selenium="input-lastName"]', 'person0'+c5);
    } else {
      await page.waitFor('[data-selenium="input-firstName"]').then(() => page.type('[data-selenium="input-firstName"]', 'person'+c5));
      await page.type('[data-selenium="input-lastName"]', 'person'+c5);
    }
     //Bugfix 3.0.207:
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
  });
  //await page.click('[data-selenium="btn-save"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').focus();
  });
    await page.keyboard.press('Enter');
  }
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));

  //Alle Einbauorte einem Bereich zuweisen
  await page.waitFor('[data-selenium="tile-zones"]').then(() => page.click('[data-selenium="tile-zones"]'));
  await page.waitFor('[data-selenium="row-1"]').then(() => page.click('[data-selenium="row-1"]'));
  await page.waitFor('[data-selenium="btn-edit-picker"]').then(() => page.click('[data-selenium="btn-edit-picker"]'));
  await page.waitFor('[data-selenium="row-0"]', {visible:true});
  var rows = await page.evaluate(() => document.querySelector('[data-selenium="panel-body-installationPoints"]').querySelectorAll('tbody tr').length);
  page.evaluate(_ => {
    document.querySelector('[data-selenium="panel-body-installationPoints"], tbody tr:last-child').scrollIntoView(true);
  });
  
  for(var c6 = 0; c6 < rows; c6++){ //wähle alle Einbauorte in der Tabelle aus
      await page.click('[data-selenium="row-'+c6+'"]');
  }

  if(components > 10){ //wenn mehr als 10 Einbauorte vorhanden, wähle die Einbauorte aus und blättere weiter
    if(components % 10 != 0){
      while(rows > 9){
        await page.click('[aria-label="Next"]');
        await page.waitFor('[data-selenium="row-0"]', {visible:true});
        rows = await page.evaluate(() => document.querySelector('[data-selenium="panel-body-installationPoints"]').querySelectorAll('tbody tr').length);
        for(var c6 = 0; c6 < rows; c6++){
          await page.click('[data-selenium="row-'+c6+'"]');
        }
      }
    } else {
      areaComponentSites = components/10;
      while(areaComponentSites >= 1){
        await page.click('[aria-label="Next"]');
        await page.waitFor('[data-selenium="row-0"]', {visible:true});
        for(var c6 = 0; c6 < 10; c6++){
          await page.click('[data-selenium="row-'+c6+'"]');
        }
        areaComponentSites--;
      }
    }
  }
  //await page.click('[data-selenium="btn-save"]');

  page.evaluate(_ => {
      document.querySelector('[data-selenium="btn-save"]').focus();
    });

  await page.keyboard.press('Enter');
  
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));

  //Einem Berechtigungsprofil alle Bereiche und alle Einbauorte zuweisen
  await page.waitFor('[data-selenium="tile-authorizationProfile"]').then(() => page.click('[data-selenium="tile-authorizationProfile"]'));
  await page.waitFor('[data-selenium="row-0"]').then(() => page.click('[data-selenium="row-0"]'));

    // 1. Bereiche zum Berechtigungsprofil hinzufügen
  await page.waitFor('[data-selenium="panel-body-zones"] [data-selenium="btn-edit-picker"]').then(() => page.click('[data-selenium="panel-body-zones"] [data-selenium="btn-edit-picker"]'));
  page.evaluate(_ => {
    document.querySelector('[data-selenium="zones-picker-table"], [data-selenium="table-pagination"]').scrollIntoView(true);
  });
  var rows2 = await page.evaluate(() => document.querySelector('[data-selenium="zones-picker-table"]').querySelectorAll('tbody tr').length);

  for(var c7 = 0; c7 < rows2; c7++){ //wähle alle Bereiche in der Tabelle aus
      await page.click('[data-selenium="zones-picker-table"] [data-selenium="row-'+c7+'"]');
  }
  if(areas > 10){
    if(areas % 10 != 0){
      while(rows2 > 9){
        await page.click('[aria-label="Next"]');
        await page.waitFor('[data-selenium="zones-picker-table"], tbody tr', {visible:true});
        rows2 = await page.evaluate(() => document.querySelector('[data-selenium="zones-picker-table"]').querySelectorAll('tbody tr').length);
        for(var c7 = 0; c7 < rows2; c7++){
          await page.click('[data-selenium="zones-picker-table"] [data-selenium="row-'+c7+'"]');
        }
      }
    } else {
      profileAreaSites = areas/10;
      while(profileAreaSites > 1){
        await page.click('[aria-label="Next"]');
        await page.waitFor('[data-selenium="zones-picker-table"], tbody tr', {visible:true});
        for(var c7 = 0; c7 < rows2; c7++){
          await page.click('[data-selenium="zones-picker-table"] [data-selenium="row-'+c7+'"]');
        }
        profileAreaSites--;
      }
    }
  }
  await page.click('[data-selenium="panel-body-zones"] [data-selenium="btn-edit-picker"]');
    
    // 2. Einbauorte zum Berechtigungsprofil hinzufügen
  await page.click('[data-selenium="panel-body-installation-points"] [data-selenium="btn-edit-picker"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="panel-body-installation-points"], [data-selenium="table-pagination"]').scrollIntoView(true);
  });
  var rows3 = await page.evaluate(() => document.querySelector('[data-selenium="panel-body-installation-points"]').querySelectorAll('tbody tr').length);
  await page.evaluate((rows3) => {console.log(rows3)},rows3);

  for(var c8 = 0; c8 < rows3; c8++){
    page.evaluate((c8) => {document.querySelector('[data-selenium="panel-body-installation-points"] [data-selenium="row-'+c8+'"]').scrollIntoView(true)},c8);
    await page.click('[data-selenium="panel-body-installation-points"] [data-selenium="row-'+c8+'"]');
  }

  if(components > 10 && components < 33){
    if(components % 10 != 0){
      while(rows3 > 9){
        await page.click('[data-selenium="panel-body-installation-points"] [aria-label="Next"]');
        await page.waitFor('[data-selenium="panel-body-installation-points"], tbody tr', {visible:true});
        rows3 = await page.evaluate(() => document.querySelector('[data-selenium="panel-body-installation-points"]').querySelectorAll('tbody tr').length);
        for(var c8 = 0; c8 < rows3; c8++){
          await page.click('[data-selenium="panel-body-installation-points"] [data-selenium="row-'+c8+'"]');
        }
      }
    } else if(components < 33){
      profileComponentSites = components/10;
      while(profileComponentSites >= 1){
        await page.click('[data-selenium="panel-body-installation-points"] [aria-label="Next"]');
        await page.waitFor('[data-selenium="panel-body-installation-points"], tbody tr', {visible:true});
        for(var c8 = 0; c8 < rows3; c8++){
          await page.click('[data-selenium="panel-body-installation-points"] [data-selenium="row-'+c8+'"]');
        }
        profileComponentSites--;
      }
    }
  }
  await page.click('[data-selenium="panel-body-installation-points"] [data-selenium="btn-edit-picker"]');
  //Bugfix 3.0.207:
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
  });
  //await page.click('[data-selenium="btn-save"]');
  page.evaluate(_ => {
    document.querySelector('[data-selenium="btn-save"]').focus();
  });
    await page.keyboard.press('Enter');
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));
  //browser.close(); //optional
}

run();