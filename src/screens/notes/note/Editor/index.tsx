import { EditorContent, Editor } from '@tiptap/react';
import { Toolbar } from './toolbar';
import { useState } from 'react';
import './style.css';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

const RichTextEditor = ({ editor, id }: { editor: Editor; id: number }) => {
  const store = useNotes((state) => state.active);
  const update = useNotes((state) => state.updata_note);
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
      const content = editor.getJSON();
      const text = editor.getText().split('\n');
      const title = text.shift();
      const description = text
        .filter((s) => s.trim())
        .map((s) => s.replace(/\s+/g, ' ').trim())
        .join(' ');
      console.log(description);
      if (content && title) {
        const note = { title, content, description, id } as Note;
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
