import { useActionData, Form, useTransition } from '@remix-run/react';
export default function BrandForm({ transition, data }) {
  return (
    <div>
      <Form method="post">
        <label>SEARCH BRAND</label>
        <input
          type="text"
          name="brand"
          required
          placeholder="brand: datocms.com,cantierecreativo.net,lorezz.me"
        ></input>
        <button type="submit">
          {transition.state === 'submitting' ? 'Searching...' : 'Search'}
        </button>
      </Form>
      <div style={{ display: 'flex', width: '100%', overflowX: 'scroll' }}>
        {data?.logos
          ?.reduce((formats, logo) => {
            return [...formats, ...logo.formats];
          }, [])
          .flat()
          .map((img) => (
            <div
              key={img.src}
              style={{
                display: 'flex',
                flexDirection: 'column',
                pagging: 10,
                margin: 2,
                border: '1px solid black',
              }}
            >
              <img src={img.src} alt="logo" width={70} />
              <p>.{img.format}</p>
              {/* {img?.background && <p>bg:{img.background}</p>} */}
            </div>
          ))}
      </div>
    </div>
  );
}
