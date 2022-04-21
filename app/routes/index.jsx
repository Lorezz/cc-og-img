import { json } from '@remix-run/node';
import { useActionData, Form, useTransition } from '@remix-run/react';

import unsplashSearch from '~/lib/unsplash.js';
import brandSearch from '~/lib/brandfetch.js';

export async function action({ request }) {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  let results = {};
  if (values.tags) {
    const tags = values.tags.trim(); //.split(',');
    results['tags'] = await unsplashSearch(tags);
  } else if (values.brand) {
    const brand = values.brand.trim(); //.split(',');
    results['brand'] = await brandSearch(brand);
    console.log('results', results);
  }
  return json({ values, results });
}

export default function Index() {
  const transition = useTransition();
  const actionData = useActionData();
  console.log('actionData', actionData);
  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        width: '100%',
      }}
    >
      <h1>Welcome to Remix</h1>
      <div
        style={{
          display: 'flex',
          background: '#fefefe',
        }}
      >
        <div>
          <Form method="post">
            <label>SEARCH UNSPLASH</label>
            <input
              type="text"
              name="tags"
              required
              placeholder="tags: shoes,bags,phones"
            ></input>
            <button type="submit">
              {transition.state === 'submitting' ? 'Searching...' : 'Search'}
            </button>
          </Form>
          <hr />
          <Form method="post">
            <label>SEARCH BRAND</label>
            <input
              type="text"
              name="brand"
              required
              placeholder="tags: datocms,cantierecreativo,lorezz.me"
            ></input>
            <button type="submit">
              {transition.state === 'submitting' ? 'Searching...' : 'Search'}
            </button>
          </Form>

          {actionData?.results?.tags &&
            actionData.results?.tags?.images?.map((img) => (
              <div key={img.id}>
                <img src={img.urls.small} alt={img.alt_description} />
                <p>
                  {img.author} - {img.descriptions}
                </p>
              </div>
            ))}
        </div>
        <div>
          <img src="/image/pic.png" alt="pic" />
        </div>
      </div>
    </div>
  );
}