//Berechtigungsprofile zu einer Xesar3 Installation hinzufügen
const puppeteer = require('puppeteer');

var profiles = 5; //gewünschte Anzahl an Berechtigungsprofilen

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
    page.evaluate(_ => {
      document.querySelector('#root > div > div._2q8UjhGmLRJ63Gb9v5FsW3._2V33v6qF7jBn9O-BwK4zfc > div._1tb06vnS_GaD7SOgH8IVv- > div:nth-child(3) > div > button:nth-child(2)').scrollIntoView(true);
    });
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
}
run();