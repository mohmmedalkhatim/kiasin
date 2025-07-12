import { useNotes } from '../../context/para/notes';
import { useEffect, useRef, useState } from 'react';
import { IconWheat } from '@tabler/icons-react';
import Icon from '../../components/Icon';
import { Note } from '../../types/notes';
import { Editor } from '@tiptap/react';
import Input from '../Input';

function NoteHeader ({
  editor,
  id,
  Title,
}: {
  editor: Editor;
  id: number;
  Title: string | undefined;
}) {
  const update = useNotes(state => state.updata_note);
  const [title, setTitle] = useState(Title);
  let ref = useRef<HTMLDivElement>(null);
  editor.once('update', e => {
    console.log("count")
    const content = e.editor.getJSON();
    const description = editor.getText();
    if (content && title) {
      const note = { title, content, description, id } as Note;
      update(id, note);
    }
  });
  useEffect(() => {
    const content = editor.getJSON();
    const description = editor.getText();
    if (content && title) {
      const note = { title, content, description, id } as Note;
      update(id, note);
    }
  }, [title]);

  useEffect(() => {
    document.onscroll = e => {
      let element = ref.current;
      if (element) {
        if (scrollY !== 0) {
          element.style.height = '5rem';
        } else {
          element.style.height = '12rem';
        }
      }
    };
  }, []);
  return (
    <header className=' w-full m_border'>
      <div
        className='bg-[url(/universe.jpg)] h-[12rem] bg-cover 1 transition-all  duration-300'
        ref={ref}
      ></div>
      <div className='flex items-center pl-20 gap-4 py-4'>
        <Icon svg={<IconWheat size={'3rem'} />} />
        <form action=''>
          <Input className='' value={title} onChange={setTitle} />
        </form>
      </div>
    </header>
  );
}
export default NoteHeader;
