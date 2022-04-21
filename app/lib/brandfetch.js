import { fetch } from '@remix-run/node';

const search = async (query) => {
  try {
    console.log('brand search', query);
    const response = await fetch(
      `https://api.brandfetch.io/v2/brands/${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.BRAND_FETCH}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();
    console.log('DATA', JSON.stringify(data, null, 2));

    if (!data) {
      return null;
    }

    return data;
  } catch (err) {
    console.log('ERROR');
    console.error(err);
  }
};
export default search;
