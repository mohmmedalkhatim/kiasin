import { IconUpload } from '@tabler/icons-react';
import { useMedia } from '../../../context/para/media';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useAreas } from '../../../context/para/areas';
import { useParams } from 'react-router-dom';
import { useDebounce } from 'react-use';

function Image({ id }: { id: number }) {
  const [url, setUrl] = useState('');

  const handleFileChange = useMedia(state => state.handleFileChange);
  const get_Card = useAreas(state => state.get_Card);
  const one = useMedia(state => state.get_image_url);
  const ref = useRef<HTMLInputElement>(null);
  const active = useAreas(state => state.active);
  const { id: area_id } = useParams()
  const [loading, setLoading] = useState(false)
  const calls = useCallback(() => {
    let card = get_Card(id);
    one(card.props, setUrl, setLoading);
  }, [area_id])

  useDebounce(() => {if (url == '') calls()}, 500, [active]);
  useDebounce(calls, 500, [area_id]);
  return (
    <div
      className='bg-cover w-full h-full'
      style={{ backgroundImage: `url(${url})`, transition: "none" }}
    >
      <div className='w-full h-full p-4 '>
        {url == '' ? (
          <div
            className='upload_area cursor-pointer'
            onClick={() => {
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
