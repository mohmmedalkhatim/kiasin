import { Editor, EditorContent } from "@tiptap/react";

function Rich_Editor({ editor, id }: { editor: Editor, id: number }) {

  return (
    <EditorContent
      className='editor'
      placeholder='start writing'
      editor={editor}
    />
  );
}
export default Rich_Editor;
