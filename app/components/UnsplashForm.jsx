import { useActionData, Form, useTransition } from '@remix-run/react';
export default function UnsplashForm({ transition, data }) {
  return (
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
      <div style={{ display: 'flex', width: '100%', overflowX: 'scroll' }}>
        {data?.images?.map((img) => (
          <div
            key={img.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              pagging: 10,
              margin: 2,
              border: '1px solid black',
            }}
          >
            <img src={img.urls.small} alt={img.alt_description} width={150} />
            <p>
              {img.author} - {img.descriptions}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
