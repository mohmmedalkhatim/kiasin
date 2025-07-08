import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import './style.css';
import { useNotes } from '../../../context/para/notes';
import { Note } from '../../../types/notes';
import { useAreas } from '../../../context/para/areas';
import { IconLink } from '@tabler/icons-react';

const NoteViewer = ({ id }: { id: number }) => {
  const [loading, setloading] = useState(true);
  let active = useNotes(state => state.active);
  let get_note = useNotes(state => state.note);
  let active_area = useAreas(state => state.active)?.at(-1);
  let get_card = useAreas(state => state.get_Card);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({ placeholder: 'start writing..' }),
    ],

    content: active.content,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });
  useEffect(() => {
    editor?.chain().focus().run();
    let card = get_card(id);
    get_note(card.props.id || active_area?.note_id, setloading);
  }, []);
  const update = useNotes(state => state.updata_note);
  if (editor) {
    editor.once('update', e => {
      const content = editor.getJSON();
      const description = editor.getText();
      let card = get_card(id);
      if (content) {
        const note = { title: active.title, content, description, id } as Note;
        console.log(Number(card.props),active_area?.note_id)
        update(card.props.note_id || active_area?.note_id, note);
      }
    });
    return (
      <div className=' border-none outline-none'>
        <EditorContent
          className='editor'
          placeholder='start writing'
          editor={editor}
        />
        <div className='absolute bottom-4 right-4' onClick={()=>{}}>
          <IconLink color='#e2e2e280' size={"1.4rem"}/>
        </div>
      </div>
    );
  }
};

export default NoteViewer;
