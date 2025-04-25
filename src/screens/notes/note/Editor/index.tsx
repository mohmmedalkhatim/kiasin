import { useEditor, EditorContent, JSONContent, Editor } from '@tiptap/react';
import { } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import textStyle from '@tiptap/extension-text-style';
import { Toolbar } from './toolbar';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight'
import './style.css';
import { useState } from 'react';

const RichTextEditor = ({ editor }: { editor:Editor }) => {
  let [text, setText] = useState<JSONContent>()

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
    editor.on("update",(e)=>{
      setText(e.editor.getJSON())
      console.log(text)
    })
    editor.on("destroy",(e)=>{
      editor.getJSON()
    })
    return (
      <div className="eidtor_container">
        <Toolbar editor={editor} />
        <EditorContent cols={10}  className="editor" editor={editor} />
      </div>
    );
  }
};

export default RichTextEditor;
