import { EditorContent, JSONContent, Editor } from '@tiptap/react';
import { Toolbar } from './toolbar';
import { useState } from 'react';
import './style.css';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

const RichTextEditor = ({
  editor,
  id,
  store,
}: {
  editor: Editor;
  id: number;
  store: Note;
}) => {
  let [note, setNote] = useState<Note>({} as Note);
  let update = useNotes((state) => state.updata_note);
  if (editor) {
    if (store.title) {
      editor.once('create', (e) => {
        e.editor
          .chain()
          .focus()
          .setHeading({ level: 2 })
          .insertContent('<h1>untitle</h1>')
          .setHighlight()
          .setTextAlign('left')
          .setNodeSelection(1)
          .run();
        editor.once('selectionUpdate', (e) => {
          e.transaction.setNodeAttribute(1, 'headding', { level: 2 });
        });
      });
    }
    editor.once('update', (e) => {
      let content = editor.getJSON();
      let text = editor.getText().split('\n');
      let title = text.shift();
      let description = text.join(' ');
      console.log(content);
      if (content && title) {
        let note = { title, content, description, id } as Note;
        setNote(note);
        update(id, note);
      }
    });
    editor.on('destroy', (e) => {
      editor.getJSON();
    });
    return (
      <div className="editor_container">
        <Toolbar editor={editor} />
        <EditorContent cols={10} className="editor" editor={editor} />
      </div>
    );
  }
};

export default RichTextEditor;
