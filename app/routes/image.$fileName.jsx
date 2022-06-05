import { readFileSync } from 'fs';
import puppeteer from 'puppeteer-core';
import chrome from 'chrome-aws-lambda';
import { marked } from 'marked';
// const exePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const chromeExecPaths = {
  win32: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  linux: '/usr/bin/google-chrome',
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
};

const exePath = chromeExecPaths[process.platform];

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
  if (!src) return '';
  return `<img class="logo" alt="logo" src="${src}" width="${width}" height="${height}"/>`;
}

function getPlusSign(i) {
  return i === 0 ? '' : '<div class="plus">+</div>';
}

function getCss({
  theme = null,
  fontSize = '45px',
  foreground = 'black',
  background = '#fff',
  backgroundImage = '',
  fontWeight = 'regular',
  font = 'Vera',
  plusColor = '#BBB',
  full = false,
}) {
  if (theme && theme === 'cc') {
    // background = 'linear-gradient(90deg, #575CE8 0%, #423FEB 100%)';
    background =
      'linear-gradient(295deg, #FD7CFF 2%, #575CE8 60%,#423FEB 100%)';
    foreground = 'white';
    plusColor = '#EEE';
  }
  if (theme && theme === 'dark') {
    background = 'linear-gradient(45deg, #333 0%, #232527 100%)';
    foreground = 'white';
    plusColor = '#EEE';
  }
  if (theme && theme === 'dato') {
    background = 'linear-gradient(135deg, #F6693D, #884290)';
    foreground = 'white';
    plusColor = '#EEE';
  }
  if (theme && theme === 'light') {
    background = '#f9f9f9';
    foreground = 'black';
    plusColor = '#111';
  }

  // if (backgroundImage) {
  //   background = `url(${backgroundImage}) center cover no-repeat`;
  //   console.log('backgroundImage', background);
  // }

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

  body,
  .root {
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  ${full ? `body` : `.root`} {
    background: ${background || 'transparent'};
    height: 100vh;
    display: flex;
    flex-direction: column;
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
    margin-top: 100px;
  }
  .plus {
    color: ${plusColor};
    font-family: Times New Roman, Verdana;
    font-size: 100px;
  }
  .heading {
    text-align: center;
    font-family: '${font}', sans-serif;
    font-size: ${fontSize};
    font-style: normal;
    font-weight: ${fontWeight};
    color: ${foreground};
    line-height: 1.0;
    letter-spacing: -0.02em;
  }



`;
}

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

  const text = qs.text ? qs.text : 'HELLU!';
  const bgImg = qs.backgroundImage
    ? decodeURIComponent(qs.backgroundImage)
    : null;

  const images = [qs?.icon1, qs?.icon2].filter(Boolean);
  let imagePart = '';
  if (images && images.length > 0) {
    imagePart = `
    <div class="spacer">
    <div class="logo-wrapper">
        ${images
          .map((img, i) => {
            return img ? getPlusSign(i) + getImage(img) : '';
          })
          .join('')
          .trim()}
    </div>
    `;
  }

  const content = `
  <!DOCTYPE html>
  <html>
    <meta charset="utf-8">
    <title>Generated Image</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>${getCss({ ...qs })}</style>
    <body>
        <div class="root"  ${
          bgImg
            ? `style="background-image: url(${bgImg});background-size:cover;background-position:center;`
            : ''
        }>
              ${imagePart}
            <div class="spacer">
            <div class="heading">${
              qs.md === 'true' ? marked(text) : sanitizeHtml(text)
            }
            </div>
        </div>
    </body>
  </html>`;

  let options;
  let viewport = preview
    ? { width: 2048, height: 1170, deviceScaleFactor: 0.5 }
    : { width: 2048, height: 1170, deviceScaleFactor: 1 };

  const isDev = process.env.IS_DEV ? true : false;
  console.log('isDev', isDev);
  if (isDev) {
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
  try {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    page.setViewport(viewport);
    await page.setContent(content);
    // path: `/tmp/${name}-${Date.now()}.${type}`,
    const pic = await page.screenshot({
      type: type,
    });
    await browser.close();
    return new Response(pic, {
      status: 200,
      headers: {
        'Content-Type': `image/${type}`,
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
}
