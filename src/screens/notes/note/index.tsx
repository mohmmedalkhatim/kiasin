import { useParams } from 'react-router-dom';
import Editor from './Editor';
import { useNotes } from '../../../context/para/notes';
import { useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import textStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import HeaderBar from './headersbar';
import "./style.css"

function NotePage() {
  const get = useNotes((state) => state.note);
  let note = useNotes(state => state.active)
  const { id } = useParams();
  let content = note?.content;
  useEffect(() => {
    get(Number(id));

  }, []);
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
    content,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });
  if (editor) {
    return (
      <div className="content">
        <HeaderBar editor={editor} />
        <Editor editor={editor} id={Number(id)} />
      </div>
    );
  }
}
export default NotePage;
