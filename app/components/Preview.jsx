export default function Preview({ picUrl, preview }) {
  return (
    <div>
      <div
        style={{
          background: '#fff',
          width: 1024,
          height: 585,
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
