//alle IDM sperren
const puppeteer = require('puppeteer');

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
  await page.goto('https://192.168.192.39:18080');

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

  await page.waitFor('[data-selenium="tile-identificationMedia"]');

  //Anzahl der IDM in der Installation evaluieren
  var idmlength = await page.evaluate(el => el.innerHTML, await page.$('[data-selenium="identificationMediaCount"]'));
  console.log(idmlength);

  await page.click('[data-selenium="tile-identificationMedia"]');

  //Listenansicht so anpassen, dass alle IDM gesehen werden
  if(idmlength > 10){
    await page.waitFor('[data-selenium="table-settings"]').then(() => page.click('[data-selenium="table-settings"]'));
    var dif = idmlength-10;
    for(var j = 0; j < dif; j++){
      await page.waitFor('[data-selenium="btn-plus"]').then(() => page.click('[data-selenium="btn-plus"]'));
    }
    await page.waitFor('[data-selenium="btn-save-table-settings"]').then(() => page.click('[data-selenium="btn-save-table-settings"]'));
  }

  //IDM nacheinander sperren
  for(var i = 0; i <= idmlength; i++){
    await page.waitFor('[data-selenium="row-'+i+'"]').then(() => page.click('[data-selenium="row-'+i+'"]'));
    await page.waitFor('[data-selenium="btn-lock"]').then(() => page.click('[data-selenium="btn-lock"]'));
    await page.waitFor('[data-selenium="modal-body"]');
    await page.keyboard.press('Tab');  
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
  }

  await page.waitFor('[data-selenium="bulk-add"]').then(() => page.click('[data-selenium="link-home"]'));
}
run();
