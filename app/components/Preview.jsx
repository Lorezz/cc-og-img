export default function Preview({ picUrl, preview }) {
  return (
    <div>
      <div
        style={{
          background: '#fff',
          width: 612,
          height: 252,
          overflow: 'hidden',
          backgroundImage: `url(${picUrl}${preview ? '&preview=true' : ''})`,
          backgroundSize: 'fit',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <a href={picUrl} target="preview">
        final image
      </a>
    </div>
  );
}
