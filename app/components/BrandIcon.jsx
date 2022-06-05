import { useState } from 'react';

export default function BrandIcForm({ current, handleSelect }) {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  async function getData(brand = null) {
    if (!brand) return;
    setLoading(true);
    try {
      console.log('call resource brand:', brand);
      const response = await fetch('/brandResource', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `brand=${brand.trim()}`,
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
        <div className="">
          <img src={current} alt="" className="h-[50px]" />
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
          <label>BRAND ICON</label>
          <div className="flex">
            <input
              className="rounded p-4"
              type="text"
              name="brand"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              required
              placeholder="datocms.com,cantierecreativo.net,leanpanda.com"
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
            {data?.logos
              ?.reduce((formats, logo) => {
                return [...formats, ...logo.formats];
              }, [])
              .flat()
              .map((img) => (
                <div
                  onClick={() => handleSelect(img.src)}
                  key={img.src}
                  className="flex-shrink-0 flex flex-col m-2"
                >
                  <img
                    className="h-[50px]"
                    src={img.src}
                    alt={img.src + ' ' + img.format}
                    heigth={50}
                  />
                  <p className="text-xs">{img.format}</p>
                </div>
              ))}
          </div>
        </>
      )}
    </>
  );
}
