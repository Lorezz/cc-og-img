import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
const exePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export async function loader({ request, params }) {
  const url = new URL(request.url);
  let qs = {};
  for (const [key, value] of url.searchParams.entries()) {
    qs[key] = value;
  }
  const { preview } = qs;
  console.log('qs', qs);
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
        background:${qs?.bg || '#222'};
        color:#fefefe;
        display:flex;
        align-items:center;
        justify-content:center;
      }
    </style>
    <h1>HELLO WORLD</h1>
  </body>
  </html>`;

  let options;
  let viewport = preview
    ? { width: 612, height: 252, deviceScaleFactor: 1 }
    : { width: 2048, height: 1170, deviceScaleFactor: 1 };
  const isDev = process.env.NODE_ENV
    ? process.env.NODE_ENV === 'development'
    : true;
  console.log('isDev', isDev);
  if (isDev) {
    //viewport = { ...viewport, deviceScaleFactor: 0.5 };
    // viewport = { width: 612, height: 252, deviceScaleFactor: 1 };
    options = {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    options = {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }

  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  page.setViewport(viewport);
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
