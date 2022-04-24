const imageLightOptions = [
  {
    text: 'Icon',
    value:
      'https://www.datocms.com/images/brand-assets/svg/icon/color/color_d_icon.svg',
  },
  {
    text: 'Icon + Text',
    value:
      'https://www.datocms.com/images/brand-assets/svg/icon-text/color/color_full_logo.svg',
  },
];

const imageDarkOptions = [
  {
    text: 'Icon',
    value:
      'https://www.datocms.com/images/brand-assets/svg/icon/white/white_d_icon.svg',
  },
  {
    text: 'Icon + Text',
    value:
      'https://www.datocms.com/images/brand-assets/svg/icon-text/white/white_full_logo.svg',
  },
];

const widthOptions = [
  { text: 'width', value: 'auto' },
  { text: '50', value: '50' },
  { text: '100', value: '100' },
  { text: '150', value: '150' },
  { text: '200', value: '200' },
  { text: '250', value: '250' },
  { text: '300', value: '300' },
  { text: '350', value: '350' },
];

const heightOptions = [
  { text: 'height', value: 'auto' },
  { text: '50', value: '50' },
  { text: '100', value: '100' },
  { text: '150', value: '150' },
  { text: '200', value: '200' },
  { text: '250', value: '250' },
  { text: '300', value: '300' },
  { text: '350', value: '350' },
];

const Dropdown = ({ options, value, onchange, small }) => {
  const wrapper = small ? 'select-wrapper small' : 'select-wrapper';
  const arrow = small ? 'select-arrow small' : 'select-arrow';

  return (
    <div className={wrapper}>
      <select
        onChange={(e) => onchange(e.target.value)}
        value={value}
        defaultValue={value}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.text}
          </option>
        ))}
      </select>
      <div className={arrow}>'▼'</div>
    </div>
  );
};

const TextInput = ({ value, oninput }) => {
  return (
    <div className={'input-outer-wrapper'}>
      <div className={'input-inner-wrapper'}>
        <input
          type={'text'}
          value={value}
          onInput={(e) => oninput(e.target.value)}
        />
      </div>
    </div>
  );
};

const Button = ({ label, onclick }) => {
  return <button onClick={onclick}> {label} </button>;
};

const Field = ({ label, children }) => {
  return (
    <div className={'field'}>
      <label>
        <div className={'field-label'}>{label}</div>
        <div className={'field-value'}>{children}</div>
      </label>
    </div>
  );
};

const Toast = ({ show, message }) => {
  const style = { transform: show ? 'translate3d(0,-0px,-0px) scale(1)' : '' };
  return (
    <div className="toast-area">
      <div className="toast-outer" style={style}>
        <div className="toast-inner">
          <div className="toast-message">{message}</div>
        </div>
      </div>
    </div>
  );
};

const themeOptions = [
  { text: 'Light', value: 'light' },
  { text: 'Dark', value: 'dark' },
];

const fileTypeOptions = [
  { text: 'PNG', value: 'png' },
  { text: 'JPEG', value: 'jpeg' },
];

const fontSizeOptions = Array.from({ length: 10 })
  .map((_, i) => i * 25)
  .filter((n) => n > 0)
  .map((n) => ({ text: n + 'px', value: n + 'px' }));

const markdownOptions = [
  { text: 'Plain Text', value: '0' },
  { text: 'Markdown', value: '1' },
];

export default function Index({ state, setState }) {
  let timeout;
  const setLoadingState = (newState) => {
    clearTimeout(timeout);
    if (state.overrideUrl && state.overrideUrl !== newState.overrideUrl) {
      newState.overrideUrl = state.overrideUrl;
    }
    if (newState.overrideUrl) {
      timeout = setTimeout(() => setState({ overrideUrl: null }), 200);
    }
    setState({ ...newState, loading: true });
  };
  const {
    fileType = 'png',
    fontSize = '25px',
    theme = 'light',
    md = true,
    text = '**DatoCMS and ZEIT Now** integration is online!',
    images = [imageLightOptions[0].value],
    widths = [],
    heights = [],
    selectedImageIndex = 0,
  } = state;
  const mdValue = md ? '1' : '0';
  const imageOptions = theme === 'light' ? imageLightOptions : imageDarkOptions;

  return (
    <div>
      <Field label="Theme">
        <Dropdown
          options={themeOptions}
          value={theme}
          onchange={(val) => {
            const options =
              val === 'light' ? imageLightOptions : imageDarkOptions;
            let clone = [...images];
            clone[0] = options[selectedImageIndex].value;
            setLoadingState({ theme: val, images: clone });
          }}
        />
      </Field>
      <Field label="File Type">
        <Dropdown
          options={fileTypeOptions}
          value={fileType}
          onchange={(val) => setLoadingState({ fileType: val })}
        />
      </Field>
      <Field label="Font Size">
        <Dropdown
          options={fontSizeOptions}
          value={fontSize}
          onchange={(val) => setLoadingState({ fontSize: val })}
        />
      </Field>
      <Field label="Text Type">
        <Dropdown
          options={markdownOptions}
          value={mdValue}
          onchange={(val) => setLoadingState({ md: val === '1' })}
        />
      </Field>
      <Field label="Text Input">
        <TextInput
          value={text}
          oninput={(val) => setLoadingState({ text: val, overrideUrl: url })}
        />
      </Field>
      <Field label="Image 1">
        <Dropdown
          options={imageOptions}
          value={imageOptions[selectedImageIndex].value}
          onchange={(val) => {
            let clone = [...images];
            clone[0] = val;
            const selected = imageOptions.map((o) => o.value).indexOf(val);
            setLoadingState({
              images: clone,
              selectedImageIndex: selected,
            });
          }}
        />
        <div className="field-flex">
          <Dropdown
            options={widthOptions}
            value={widths[0]}
            small={true}
            onchange={(val) => {
              let clone = [...widths];
              clone[0] = val;
              setLoadingState({ widths: clone });
            }}
          />
          <Dropdown
            options={heightOptions}
            value={heights[0]}
            small={true}
            onchange={(val) => {
              let clone = [...heights];
              clone[0] = val;
              setLoadingState({ heights: clone });
            }}
          />
        </div>
      </Field>
      {images.slice(1).map((image, i) => (
        <Field key={i} label={`Image ${i + 2}`}>
          <TextInput
            value={image}
            oninput={(val) => {
              let clone = [...images];
              clone[i + 1] = val;
              setLoadingState({ images: clone, overrideUrl: url });
            }}
          />
          <div className="field-flex">
            <Dropdown
              options={widthOptions}
              value={widths[i + 1]}
              small={true}
              onchange={(val) => {
                let clone = [...widths];
                clone[i + 1] = val;
                setLoadingState({ widths: clone });
              }}
            />
            <Dropdown
              options={heightOptions}
              value={heights[i + 1]}
              small={true}
              onchange={(val) => {
                let clone = [...heights];
                clone[i + 1] = val;
                setLoadingState({ heights: clone });
              }}
            />
          </div>
        </Field>
      ))}
      <Field label={`Image ${images.length + 1}`}>
        <Button
          label={`Add Image ${images.length + 1}`}
          onclick={() => {
            const nextImage =
              images.length === 1
                ? 'https://cdn.jsdelivr.net/gh/remojansen/logo.ts@master/ts.svg'
                : '';
            setLoadingState({ images: [...images, nextImage] });
          }}
        />
      </Field>
    </div>
  );
}
