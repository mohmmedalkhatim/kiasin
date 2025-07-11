import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useAreas } from '../../../../context/para/areas';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

function Rich_Editor ({ id, content }: { content: any; id: number }) {
  const active = useNotes(state => state.active);
  let get_card = useAreas(state => state.get_Card);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({ placeholder: 'start writing..' }),
    ],

    content: content,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });
  useEffect(() => {
    editor?.chain().focus().run();
    editor?.once('update', e => {
      const content = editor.getJSON();
      const description = editor.getText();
      let card = get_card(id);
      if (content) {
        const note = { title: active.title, content, description, id } as Note;
        update_note(card.props.note_id, note);
      }
    });
  }, []);

  const update_note = useNotes(state => state.updata_note);

  return (
    <EditorContent
      className='editor'
      placeholder='start writing'
      editor={editor}
    />
  );
}
export default Rich_Editor;
