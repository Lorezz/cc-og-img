import { useState, useEffect } from 'react';
import { json } from '@remix-run/node';
import { useActionData, useTransition, Link } from '@remix-run/react';

import unsplashSearch from '~/lib/unsplash.js';
import brandSearch from '~/lib/brandfetch.js';
import Preview from '~/components/Preview';
import UnsplashForm from '~/components/UnsplashForm';
import BrandForm from '~/components/BrandForm';
import MyForm from '~/components/Form';

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
  const picUrl = `/image/pic.png?bg=pink`;
  const previewUrl = `${picUrl}&preview=true`;

  const data = actionData?.data || {};
  console.log('data', data);

  const [formState, setFomState] = useState({
    fileType: 'png',
    fontSize: '25px',
    theme: 'light',
    md: false,
    text: 'CIAO MONDO',
    images: [],
    bg: '',
    bgImage: '',
    widths: [],
    heights: [],
    showToast: false,
    messageToast: '',
    loading: true,
    selectedImageIndex: 0,
    overrideUrl: null,
    name: 'pic',
  });

  useEffect(() => {
    function getUrl(data) {
      const host = 'http://localhost:3000';
      const url = new URL(`${host}/image/pic.${data.fileType || 'png'}`);
      url.searchParams.append('text', ` ${encodeURIComponent(data.text)}`);
      url.searchParams.append('theme', data.theme);
      url.searchParams.append('md', data.mdValue);
      url.searchParams.append('fontSize', data.fontSize);
      for (let image of data.images) {
        url.searchParams.append('images', image);
      }
      for (let width of data.widths) {
        url.searchParams.append('widths', width);
      }
      for (let height of data.heights) {
        url.searchParams.append('heights', height);
      }
      return url;
    }
    const url = getUrl(formState);
    console.log('url', url);
  }, [formState]);

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
        <Preview data={{ picUrl, previewUrl }} />
        <div>
          <UnsplashForm transition={transition} data={data.tags} />
        </div>
        <div>
          <BrandForm transition={transition} data={data.brand} />
        </div>
        <div>
          <MyForm state={formState} setState={(data) => setFomState(data)} />
        </div>
      </div>
    </div>
  );
}
