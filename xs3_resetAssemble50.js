//Einbauorte(Zylinder) zu einer Xesar3 Installation hinzufügen
const puppeteer = require('puppeteer');

var components = 50; //gewünschte Anzahl an Einbauorten
var rows = 0;
var componentPages = 0;

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

  await page.waitFor('[data-selenium="tile-componentsSafe"]').then(() => page.click('[data-selenium="tile-componentsSafe"]'));

  //Hinzufügen ruckgängig machen
  for(componentPages = 0; componentPages <= Math.ceil(components/10); componentPages++){
    //if(componentPages == 0){
      while(rows < 10){
        await page.waitFor('[data-selenium="row-'+rows+'"]', {visible:true}).then(() => page.click('[data-selenium="row-'+rows+'"]'));
        await page.waitFor('[data-selenium="btn-resetAssemble"]').then(() => page.click('[data-selenium="btn-resetAssemble"]'));
        await page.waitFor('[data-selenium="validation-input-installationId"]').then(() => page.goto('https://localhost:8080/app/installationPoints')); //Achtung bei remote!
      for(var j = 0; j < componentPages; j++){
        await page.waitFor('[aria-label="Next"]').then(() => page.click('[aria-label="Next"]'));
      }
        rows++;
      }
      await page.waitFor('[aria-label="Next"]').then(() => page.click('[aria-label="Next"]'));
      rows=0;
  }

  await page.waitFor('[data-selenium="btn-create"]').then(() => page.click('[data-selenium="link-home"]'));
}
run();