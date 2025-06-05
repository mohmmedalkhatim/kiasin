import { IconUpload } from '@tabler/icons-react';
import { useMedia } from '../../../context/para/media';
import { useRef, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { useDebounce } from 'react-use';

function Image ({ id }: { id: number }) {
  const [url, setUrl] = useState('');

  const handleFileChange = useMedia(state => state.handleFileChange);
  const get_Card = useAreas(state => state.get_Card);
  let one = useMedia(state => state.get_image_url);
  let ref = useRef<HTMLInputElement>(null);
  let active = useAreas(state => state.active);
  useDebounce(
    () => {
      if (url == '') {
        let card = get_Card(id);
        one(card.props, setUrl);
      }
    },
    50,
    [active]
  );
  return (
    <div
      className='bg-cover w-full h-full'
      style={{ backgroundImage: `url(${url})` }}
    >
      <div className='w-full h-full p-4 '>
        {url == '' ? (
          <div
            className='upload_area cursor-pointer'
            onClick={() => {
              console.log(ref.current);
              ref.current?.click();
            }}
          >
            <IconUpload />
          </div>
        ) : (
          ''
        )}
      </div>

      <input
        type='file'
        ref={ref}
        className='hidden'
        onChange={e => handleFileChange(e, id)}
      />
    </div>
  );
}

export default Image;
