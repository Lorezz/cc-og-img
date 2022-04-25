import { createApi } from 'unsplash-js';
import { fetch } from '@remix-run/node';
import orderBy from 'lodash/orderBy';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch,
});

const search = async (query) => {
  try {
    // console.log("search", query);
    const r = await unsplash.search.getPhotos({
      query,
      page: 1,
      perPage: 10,
    });
    const data = r?.response?.results;
    // console.log('data', data);

    if (!data) {
      return { query, images: [], total: 0 };
    }
    const { total } = r?.response;
    let images = orderBy(data, 'likes', 'desc');
    images = images.map((image) => {
      const { id, alt_description, descriptions, urls, user } = image;
      const author = user?.name;
      return { id, alt_description, descriptions, urls, author };
    });
    return { query, images, total };
  } catch (err) {
    console.log('ERROR');
    console.error(err);
  }
};
export default search;
