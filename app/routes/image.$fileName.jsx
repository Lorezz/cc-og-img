import puppeteer from 'puppeteer';
export async function loader({ params }) {
  console.log('params', params);
  const { fileName } = params;
  const [name, type] = fileName.split('.');
  console.log('name', name);
  const content = `
  <html>
  <body>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Roboto');
      body {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        margin:0;
        padding:0;
        width:100vw;
        height:100vh;
        background: #222 ;
        color:#fefefe;
        display:flex;
        align-items:center;
        justify-content:center;
      }
    </style>
    <h1>HELLO WORLD</h1>
  </body>
  </html>`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  page.setViewport({ width: 800, height: 600, deviceScaleFactor: 1 });
  await page.setContent(content);
  const pic = await page.screenshot({
    // path: `/tmp/${name}-${Date.now()}.${type}`,
    type: type,
  });
  await browser.close();
  return new Response(pic, {
    status: 200,
    headers: {
      'Content-Type': `image/${type}`,
    },
  });
}
