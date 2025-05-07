import { useParams } from 'react-router-dom';
import { JSONContent, useEditor } from '@tiptap/react';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import textStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import '../style.css';
import HeaderBar from '../headersbar';
import Editor from '../Editor';

function NotePage({ content }: { content: JSONContent }) {
  const { id } = useParams();
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
