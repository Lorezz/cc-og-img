import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import { useActionData, useTransition, Link } from '@remix-run/react';

import unsplashSearch from '~/lib/unsplash.js';
import brandSearch from '~/lib/brandfetch.js';
import Preview from '~/components/Preview';
import UnsplashForm from '~/components/UnsplashForm';
import BrandForm from '~/components/BrandForm';
// import MyForm from '~/components/Form';

import style from '~/styles/global.css';

export async function action({ request }) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  let data = {};
  if (values.tags) {
    const tags = values.tags.trim(); //.split(',');
    data['tags'] = await unsplashSearch(tags);
  } else if (values.brand) {
    const brand = values.brand.trim(); //.split(',');
    data['brand'] = await brandSearch(brand);
    console.log('data', data);
  }
  return json({ values, data });
}

export function links() {
  return [
    {
      rel: 'stylesheet',
      href: style,
    },
  ];
}

export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();
  const host = 'http://localhost:3000';
  const picUrl = `/image/pic.png?theme=cc`;
  // const [url, setUrl] = useState(picUrl);
  const data = actionData?.data || {};
  console.log('data', data);

  const [formState, setFomState] = useState({
    fileType: 'png',
    fontSize: '25px',
    theme: 'cc',
    md: false,
    text: 'Hellow World!',
    images: [],
    background: '#fff',
    foreground: '#111',
    backgroundImage: '',
  });

  function getUrl(data) {
    const url = new URL(`${host}/image/pic.${data.fileType || 'png'}`);
    url.searchParams.append('text', data.text);
    url.searchParams.append('theme', data.theme);
    url.searchParams.append('md', data.md);
    url.searchParams.append('fontSize', data.fontSize);
    for (let image of data.images) {
      url.searchParams.append('images', image);
    }
    return url;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    console.log(name, value);
    setFomState((prev) => ({ ...prev, [name]: value }));
    return;
  }
  const url = getUrl(formState).toString();
  console.log('url', url);
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
          <UnsplashForm transition={transition} data={data.tags} />
        </div>
        <div>
          <BrandForm transition={transition} data={data.brand} />
        </div>
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
            value={formState.forergound}
            name="forergound"
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
      </div>
    </div>
  );
}
