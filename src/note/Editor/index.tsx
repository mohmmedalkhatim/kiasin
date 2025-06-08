import { EditorContent, Editor } from '@tiptap/react';
import { Toolbar } from './toolbar';
import { useState } from 'react';
import './style.css';

const RichTextEditor = ({ editor, id }: { editor: Editor; id: number }) => {

  if (editor) {

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
