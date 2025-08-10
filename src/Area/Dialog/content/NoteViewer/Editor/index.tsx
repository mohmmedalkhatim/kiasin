import { Editor, EditorContent } from "@tiptap/react";
import { Note } from "../../../../../types/notes";
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import NoteHeader from "../../../../../note/NoteHeader/indxe";

function Rich_Editor({ note }: { note: Note }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({ placeholder: 'start writing..' }),
    ],

    content: (async () => {
      if (note) {
        return note.content
      }
    })(),
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });

  if (editor) {
    return (
      <div className="relative">
        <NoteHeader editor={editor} hide_background id={note.id} Title={note.title}></NoteHeader>
        <div className="px-20">
          <EditorContent
            className='editor'
            placeholder='start writing'
            editor={editor}
          />
        </div>
      </div>
    );
  }
}
export default Rich_Editor;
