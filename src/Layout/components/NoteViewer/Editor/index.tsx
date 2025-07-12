import { Editor, EditorContent } from "@tiptap/react";
import { useNotes } from "../../../../context/para/notes";
import { useState } from "react";
import { Note } from "../../../../types/notes";


function Rich_Editor({ editor, id }: { editor: Editor, id: number }) {
  const update_note = useNotes(state => state.updata_note);
  const get_note = useNotes(state => state.note);
  const [note, setNote] = useState({} as Note);
  let editing = () => {
    get_note(id, setNote);
      if (editor) {
        editor.chain().focus().run();
        editor.once('update', e => {
          const content = e.editor.getJSON();
          const description = editor.getText();
          if (content) {
            const updated = { title: note.title, content, description, id } as Note;
            update_note(note.id, updated);
          }
        });
    }
  }

  return (
    <EditorContent
      onFocus={editing}
      className='editor'
      placeholder='start writing'
      editor={editor}
    />
  );
}
export default Rich_Editor;
