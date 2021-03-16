//Personen zu einer Xesar3 Installation hinzufügen
const puppeteer = require('puppeteer');

var persons = 5; //gewünschte Anzahl an Personen

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
}
run();