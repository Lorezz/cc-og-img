import { useLoaderData } from '@remix-run/react';
import { useState, useCallback } from 'react';
// import debounce from 'lodash.debounce';
// import throttle from 'lodash.throttle';
import Preview from '~/components/Preview';
import Unsplash from '~/components/Unsplash';
import BrandIcon from '~/components/BrandIcon';

export async function loader({ request, params }) {
  const currentUrl = new URL(request.url);
  console.log('CURRENT URL', currentUrl);
  return request.url;
}

export default function Index() {
  const origin = useLoaderData();
  console.log('ORIGIN', origin);
  const [formState, setFomState] = useState({
    font: 'Colfax',
    fileType: 'jpeg',
    fontSize: '125px',
    fontWeight: 'regular',
    theme: '',
    md: true,
    text: 'Hello **World**!',
    background: '#111111',
    foreground: '#fefefe',
    backgroundImage: null,
    icon: null,
    icon2: null,
  });

  function getUrl(data) {
    console.log('change url');
    const url = new URL(`${origin}image/pic.${data.fileType || 'png'}`);
    url.searchParams.append('text', data.text);
    url.searchParams.append('theme', data.theme);
    url.searchParams.append('md', data.md);
    url.searchParams.append('fontSize', data.fontSize);
    url.searchParams.append('fontWeight', data.fontWeight);
    url.searchParams.append('font', data.font);
    url.searchParams.append('foreground', data.foreground);
    url.searchParams.append('background', data.background);

    if (data.backgroundImage) {
      url.searchParams.append(
        'backgroundImage',
        encodeURIComponent(data.backgroundImage)
      );
    }
    if (data.icon) {
      url.searchParams.append('icon1', data.icon);
    }
    if (data.icon2) {
      url.searchParams.append('icon2', data.icon2);
    }
    return url;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    console.log('handleChange', name, value);
    setFomState((prev) => ({ ...prev, [name]: value }));
    return;
  }

  const generateUrl = useCallback(() => {
    return getUrl(formState).toString();
  }, [formState]);

  const url = generateUrl();
  return (
    <div className="mainWrap">
      {url && <Preview picUrl={url} preview={true} />}
      <div className="formWrap">
        <div className="formContainer">
          <div className="formField max-w-[350px]">
            <Unsplash
              current={formState.backgroundImage}
              handleSelect={(backgroundImage) =>
                handleChange({
                  target: { name: 'backgroundImage', value: backgroundImage },
                })
              }
            />
          </div>
          <div className="formField">
            <BrandIcon
              current={formState.icon}
              handleSelect={(icon) =>
                handleChange({
                  target: { name: 'icon', value: icon },
                })
              }
            />
          </div>
          <div className="formField">
            <BrandIcon
              current={formState.icon2}
              handleSelect={(icon) =>
                handleChange({
                  target: { name: 'icon2', value: icon },
                })
              }
            />
          </div>
        </div>
        <div className="formContainer">
          <div className="formField">
            <label>Text</label>
            <input
              className="rows-3"
              type="text"
              value={formState.text}
              name="text"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="formField">
            <label>MArkdown</label>
            <input
              type="checkbox"
              name="md"
              defaultChecked={formState.md}
              value={formState.md}
              onChange={(e) =>
                handleChange({
                  target: { name: 'md', value: e.target.checked },
                })
              }
            />
          </div>
          <div className={`flex ${formState.theme ? 'hidden' : ''}`}>
            <div className="formField">
              <label>Text Color</label>
              <input
                type="color"
                value={formState.foreground}
                name="foreground"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="formField">
              <label>Bg Color</label>
              <input
                type="color"
                value={formState.background}
                name="background"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </div>
          <div className={`formField ${formState.theme ? 'hidden' : ''}`}>
            <label>Font</label>
            <select
              type="select"
              name="font"
              onChange={(e) => handleChange(e)}
              value={formState.font}
            >
              <option value=""> - </option>
              <option value="Tiempos">Tiempos</option>
              <option value="Colfax">Colfax</option>
              <option value="Vera">Vera</option>
            </select>
          </div>
          <div className="formField">
            <label>Font Weight</label>
            <select
              type="select"
              name="fontWeight"
              onChange={(e) => handleChange(e)}
              value={formState.fontWeight}
            >
              <option value="regular">Regular</option>
              <option value="bold">Bold</option>
            </select>
          </div>
          <div className="formField">
            <label>Font Size</label>
            <input
              type="text"
              value={formState.fontSize}
              name="fontSize"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="formField">
            <label>Theme</label>
            <select
              type="select"
              value={formState.theme}
              name="theme"
              onChange={(e) => handleChange(e)}
            >
              <option value={''}> - </option>
              <option value="cc">CC</option>
              <option value="light">light</option>
              <option value="dato">dato</option>
              <option value="dark">dark</option>
            </select>
          </div>
          <div className="formField">
            <label>Image Type</label>
            <select
              type="select"
              value={formState.fileType}
              name="fileType"
              onChange={(e) => handleChange(e)}
            >
              <option value="png">png</option>
              <option value="jpeg">jpeg</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
