import { EditorContent, Editor } from '@tiptap/react';
import { Toolbar } from './toolbar';
import './style.css';

const RichTextEditor = ({ editor, id }: { editor: Editor; id: number }) => {
  if (editor) {
    return (
      <div className="editor_container">
        <Toolbar editor={editor} />
        <EditorContent cols={10} className="editor" editor={editor} />
      </div>
    );
  }
};

export default RichTextEditor;
