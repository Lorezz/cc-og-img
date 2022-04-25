import { json } from '@remix-run/node';
import unsplashSearch from '~/lib/unsplash.js';

export async function action({ request }) {
  const form = await request.formData();
  const tags = form.get('tags');
  console.log('tags', tags);
  // const tags = 'shoes';
  let data = null;
  if (tags) {
    data = await unsplashSearch(tags);
    return json(data);
  }
  return nulll;
}
