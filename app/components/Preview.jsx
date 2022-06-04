export default function Preview({ picUrl, preview }) {
  return (
    <div className="absolute flex flex-col z-0 w-full h-full">
      <div className="m-2 max-w-xs">
        <a href={picUrl} target="preview" className="button">
          final image
        </a>
      </div>
      <div
        style={{
          background: '#fff',
          width: 1024,
          height: 585,
          // width: 2048,
          // height: 1170,
          overflow: 'hidden',
          backgroundImage: `url(${picUrl}${preview ? '&preview=true' : ''})`,
          backgroundSize: 'fit',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
    </div>
  );
}
