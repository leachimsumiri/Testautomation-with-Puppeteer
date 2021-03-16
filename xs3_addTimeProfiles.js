//Zeitprofile zu einer Xesar3 Installation hinzufügen
const puppeteer = require('puppeteer');

var timeprofiles = 5; //gewünschte Anzahl an Zeitprofilen

async function run(){
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
  await page.goto('https://localhost:8080');

   //Fenstergröße anpassen
  //https://github.com/GoogleChrome/puppeteer/issues/1183  
  const height = 1080;//manuelle Eingabe je nach Bedarf
  const width = 1800;
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
  await username.type('admin');
  await page.type('[data-selenium="input-password"]', 'xesar3');
  await username.press('Enter');

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
}
run();