import { useState } from 'react';

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
    <>
      {current && (
        <div className="flex flex-col">
          <img src={current + '?w=150'} alt="" width={150} />
          <button
            className="button"
            type="button"
            onClick={() => handleSelect(null)}
          >
            reset
          </button>
        </div>
      )}
      {!current && (
        <>
          <label>SEARCH UNSPLASH</label>
          <div className="flex">
            <input
              className="rounded p-4"
              type="text"
              name="tags"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
              placeholder="tags: shoes,bags,phones"
            />

            <button
              type="button"
              className="button"
              onClick={() => getData(search)}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="flex overflow-x-auto w-full">
            {data?.images?.map((img) => (
              <div
                onClick={() => handleSelect(img.urls.raw)}
                key={img.id}
                className="flex-shrink-0 flex flex-col m-2"
              >
                <img
                  className="max-h-[150px]"
                  src={img.urls.small}
                  alt={img.alt_description}
                />
                <p className="text-xs">
                  {img.author} - {img.descriptions}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
