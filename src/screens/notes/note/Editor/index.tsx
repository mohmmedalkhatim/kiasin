import { EditorContent, JSONContent, Editor } from '@tiptap/react';
import { Toolbar } from './toolbar';
import { useState } from 'react';
import './style.css';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

const RichTextEditor = ({ editor, id }: { editor: Editor, id: number }) => {
  let [note, setNote] = useState<Note>({} as Note)
  let update = useNotes(state => state.updata_note)
  if (editor) {

    editor.once('create', (e) => {
      e.editor.chain().focus()
        .setHeading({ level: 2 })
        .insertContent("<h1>untitle</h1>").setHighlight()
        .setTextAlign("left").setNodeSelection(1).run();
      editor.once("selectionUpdate", (e) => {
        e.transaction.setNodeAttribute(1, "headding", { level: 2 })
      })
    })
    editor.on("update", (e) => {
      let content = e.editor.getJSON();
      setNote({ title: content[0].text, content, id })
      update(id, note)
    })
    editor.on("destroy", (e) => {
      editor.getJSON()
    })
    return (
      <div className="editor_container">
        <Toolbar editor={editor} />
        <EditorContent cols={10} className="editor" editor={editor} />
      </div>
    );
  }
};

export default RichTextEditor;
