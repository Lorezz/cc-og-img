export default function Preview({ data }) {
  const { previewUrl, picUrl } = data;
  return (
    <div>
      <div
        style={{
          background: '#eee',
          width: 612,
          height: 252,
          overflow: 'hidden',
          backgroundImage: `url(${previewUrl})`,
          backgroundSize: 'object-fit',
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
