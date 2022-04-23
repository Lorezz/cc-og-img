import { readFileSync } from 'fs';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import marked from 'marked';
const exePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const tiempos = readFileSync(
  `${__dirname}/../public/fonts/tiempos-headline-web-semibold.woff2`
).toString('base64');
const rglr = readFileSync(
  `${__dirname}/../public/fonts/colfax-web-regular.woff2`
).toString('base64');
const bold = readFileSync(
  `${__dirname}/../public/fonts/colfax-web-bold.woff2`
).toString('base64');
const mono = readFileSync(
  `${__dirname}/../public/fonts/Vera-Mono.woff2`
).toString('base64');

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
};

function sanitizeHtml(html) {
  return String(html).replace(/[&<>"'\/]/g, (key) => entityMap[key]);
}

function getImage(src, width = 'auto', height = '180') {
  return `<img
        class="logo"
        alt="Generated Image"
        src="${sanitizeHtml(src)}"
        width="${sanitizeHtml(width)}"
        height="${sanitizeHtml(height)}"
    />`;
}

function getPlusSign(i) {
  return i === 0 ? '' : '<div class="plus">+</div>';
}

function getCss({
  theme = 'light',
  fontSize = '15px',
  foreground = 'black',
  background = '#fff',
  font = 'Vera',
  plusColor = '#BBB',
  full = true,
}) {
  if (theme === 'dark') {
    background = 'linear-gradient(135deg, #F6693D, #884290)';
    // background =
    //   'url(https://images.unsplash.com/photo-1647893767164-8a231e5a5ce9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80) center center';
    foreground = 'white';
    font = 'Vera';
    plusColor = '#EEE';
  }

  return `
  @font-face {
    font-family: 'Tiempos';
    font-style:  normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${tiempos}) format('woff2');
  }

  @font-face {
    font-family: 'Colfax';
    font-style:  normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
  }

  @font-face {
    font-family: 'Colfax';
    font-style:  normal;
    font-weight: bold;
    src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
  }

  @font-face {
    font-family: 'Vera';
    font-style: normal;
    font-weight: normal;
    src: url(data:font/woff2;charset=utf-8;base64,${mono})  format("woff2");
  }

  ${full ? `body` : `.root`} {
    background: #efefef;
    background: ${background};
    height: 100vh;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
  }

  code {
    color: #d400ff;
    font-family: 'Vera';
    white-space: pre-wrap;
    letter-spacing: -5px;
  }

  code:before,
  code:after {
    content: '\`';
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: center;
    justify-items: center;
  }
  .logo {
    margin: 0 75px;
  }
  .spacer {
    margin: 150px;
  }
  .emoji {
    height: 1em;
    width: 1em;
    margin: 0 0.05em 0 0.1em;
    vertical-align: -0.1em;
  }
  .plus {
    color: ${plusColor};
    font-family: Times New Roman, Verdana;
    font-size: 100px;
  }
  .heading {
    font-family: '${font}', sans-serif;
    font-size: ${fontSize};
    font-style: normal;
    color: ${foreground};
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  ${
    theme === 'light' &&
    `
      strong {
        background-image: linear-gradient(120deg, #f4cf58 0%, #f4cf58 100%);
        background-repeat: no-repeat;
        background-size: 100% 0.4em;
        background-position: 0 88%;
        font-weight: inherit;
      }

      .heading {
        position: relative;
      }

      .heading:before {
        content: '';
        display: block;
        width: 40vw;
        z-index: -1;
        position: absolute;
        top: 0%;
        bottom: 0%;
        left: 50%;
        transform: translate(-50%, 0) skew(0deg, -10deg);
        background: linear-gradient(45deg, #f9ecfe, #fefae4);
      }
      `
  }
`;
}

/*

*/

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

  const text = qs.text || 'CIAO MONDO!';
  const sample_content = `
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

  const content = `
  <!DOCTYPE html>
  <html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${getCss({ background: qs.bg, fontSize: '20px' })}</style>
    <body>
        <div>
            <div class="spacer">
            <div class="logo-wrapper">
                ${qs.images
                  ?.map(
                    (img, i) =>
                      getPlusSign(i) + getImage(img, widths[i], heights[i])
                  )
                  .join('')}
            </div>
            <div class="spacer">
            <div class="heading">${qs.md ? marked(text) : sanitizeHtml(text)}
            </div>
        </div>
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
