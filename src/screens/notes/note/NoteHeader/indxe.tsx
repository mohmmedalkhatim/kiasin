import { IconWheat } from '@tabler/icons-react';
import Icon from '../../../../components/Icon';
import { useEffect, useRef } from 'react';
import { Editor } from '@tiptap/react';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

function NoteHeader ({ editor, id }: { editor: Editor; id: number }) {
  const update = useNotes(state => state.updata_note);
  let ref = useRef<HTMLDivElement>(null);
  editor.once('update', e => {
    const content = editor.getJSON();
    const text = editor.getText().split('\n');
    const title = text.shift();
    const description = text
      .filter(s => s.trim())
      .map(s => s.replace(/\s+/g, ' ').trim())
      .join(' ');
    console.log(description);
    if (content && title) {
      const note = { title, content, description, id } as Note;
      update(id, note);
    }
  });
  useEffect(() => {}, []);
  return (
    <header className=' w-full m_borde h-[12rem]' ref={ref}>
      <div className='bg-[url(/girl.jpg)] bg-cover h-full '></div>
      <div>
        <Icon svg={<IconWheat />} />
      </div>
    </header>
  );
}
export default NoteHeader;
