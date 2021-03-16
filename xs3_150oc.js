//fügt 150 Einbauorte vom Typ Online Wandleser in eine Xesar3 Anlage innerhalb von ~3 Minuten hinzu
const puppeteer = require('puppeteer');

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
  
  await page.goto('https://192.168.192.55:8080'); //IP Adresse vom Synology im Xesar Testlabor. Bei Bedarf abändern

  await page.waitFor('[data-selenium="input-username"]');
  var username = await page.$('[data-selenium="input-username"]');

  await username.type('admin');
  await page.type('[data-selenium="input-password"]', 'rnRm7nW9JZ');
  await username.press('Enter');	
  
  await page.waitFor('[data-selenium="tile-componentsSafe"]').then(() => page.click('[data-selenium="tile-componentsSafe"]'));
  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));

  for (var i = 1; i <= 150; i++) { //beliebige Anzahl an OWL's hier eingeben
  await page.waitFor('[data-selenium="select-componentType"]').then(() => page.click('[data-selenium="select-componentType"]'));

  await page.waitFor('[data-selenium="select-componentType"]').then(() => page.select('[data-selenium="select-componentType"]', 'OnlineWallReader'));
  await page.click('[data-selenium="btn-continue"]');

  await page.waitFor('[data-selenium="input-installationId"]').then(() => page.type('[data-selenium="input-installationId"]', ''+i));
  await page.type('[data-selenium="input-name"]', ''+i);
  
  //Bugfix 3.0.207:
	page.evaluate(_ => {
	  document.querySelector('[data-selenium="btn-save"]').scrollIntoView(true);
	});
	//await page.click('[data-selenium="btn-save"]');
	page.evaluate(_ => {
	  document.querySelector('[data-selenium="btn-save"]').focus();
	});
    await page.keyboard.press('Enter');

  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="btn-create"]'));

}
  await page.waitFor('[data-selenium="link-home"]').then(() => page.click('[data-selenium="link-home"]'));
  //browser.close();
}

run();