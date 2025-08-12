import { EditorContent } from "@tiptap/react";
import { Note } from "../../../../../types/notes";
import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import NoteHeader from "../../../../../note/NoteHeader/indxe";
import Underline from "@tiptap/extension-underline";
import Highlight from '@tiptap/extension-highlight';
import textStyle from '@tiptap/extension-text-style';
import '../style.css';
import { Toolbar } from "../../../../../note/Editor/toolbar";

function Rich_Editor({ note }: { note: Note }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure(),
      textStyle,
      Placeholder.configure({ placeholder: 'start writing ...' }),
    ],
    content:note.content,
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
        <div className="px-24 py-6">
        <Toolbar editor={editor}/>
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
