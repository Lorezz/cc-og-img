import { json } from '@remix-run/node';
import brandSearch from '~/lib/brandfetch.js';

export async function action({ request }) {
  const form = await request.formData();
  const brand = form.get('brand');
  console.log('brand', brand);
  let data = null;
  if (brand) {
    data = await brandSearch(brand);
    console.log('data', data);
    return json(data);
  }
  return nulll;
}
