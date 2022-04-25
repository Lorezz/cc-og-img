import { useState, useRef } from 'react';

export default function UnsplashForm({ current, handleSelect }) {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  async function getData(tags = null) {
    if (!tags) return;
    setLoading(true);
    try {
      console.log('tags', tags);
      const response = await fetch('/unsplashResource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `tags=${tags.trim()}`,
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {current && (
        <div>
          <img src={current + '?w=150'} alt="" width={150} />
          <button type="button" onClick={() => handleSelect(null)}>
            reset
          </button>
        </div>
      )}
      {!current && (
        <div>
          <label>SEARCH UNSPLASH</label>
          <input
            type="text"
            name="tags"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
            placeholder="tags: shoes,bags,phones"
          />
          <button type="button" onClick={() => getData(search)}>
            {loading ? 'Searching...' : 'Search'}
          </button>

          <div style={{ display: 'flex', width: '100%', overflowX: 'scroll' }}>
            {data?.images?.map((img) => (
              <div
                onClick={() => handleSelect(img.urls.raw)}
                key={img.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  pagging: 10,
                  margin: 2,
                  border: '1px solid black',
                }}
              >
                <img
                  src={img.urls.small}
                  alt={img.alt_description}
                  width={150}
                />
                <p>
                  {img.author} - {img.descriptions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
