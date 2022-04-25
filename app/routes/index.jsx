import { useState, useCallback } from 'react';
// import debounce from 'lodash.debounce';
import Preview from '~/components/Preview';
import Unsplash from '~/components/Unsplash';

export default function Index() {
  const host = 'http://localhost:3000';

  const [formState, setFomState] = useState({
    fileType: 'png',
    fontSize: '25px',
    theme: null,
    md: false,
    text: 'Hellow World!',
    images: [],
    background: '#ffffff',
    foreground: '#111111',
    backgroundImage: null,
  });

  function getUrl(data) {
    const url = new URL(`${host}/image/pic.${data.fileType || 'png'}`);
    url.searchParams.append('text', data.text);
    url.searchParams.append('theme', data.theme || '');
    url.searchParams.append('md', data.md);
    url.searchParams.append('fontSize', data.fontSize);
    url.searchParams.append('foreground', data.foreground);
    url.searchParams.append('background', data.background);

    if (data.backgroundImage) {
      url.searchParams.append(
        'backgroundImage',
        encodeURIComponent(data.backgroundImage)
      );
    }
    for (let image of data.images) {
      url.searchParams.append('images', image);
    }
    return url;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFomState((prev) => ({ ...prev, [name]: value }));
    return;
  }

  const url = getUrl(formState).toString();
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        width: '100%',
      }}
    >
      <h1>CC OG Image</h1>
      <div>
        {url && <Preview picUrl={url} preview={true} />}

        <div>
          <label>Text</label>
          <input
            type="text"
            value={formState.text}
            name="text"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Text Color</label>
          <input
            type="color"
            value={formState.foreground}
            name="foreground"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Bg Color</label>
          <input
            type="color"
            value={formState.background}
            name="background"
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>Theme</label>
          <select
            type="select"
            value={formState.fileType}
            name="theme"
            onChange={(e) => handleChange(e)}
          >
            <option value={null}>none</option>
            <option value="cc">CC</option>
            <option value="light">light</option>
            <option value="dato">dato</option>
            <option value="dark">dark</option>
          </select>
        </div>
        <div>
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
        <div>
          <Unsplash
            current={formState.backgroundImage}
            handleSelect={(backgroundImage) =>
              handleChange({
                target: { name: 'backgroundImage', value: backgroundImage },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}
