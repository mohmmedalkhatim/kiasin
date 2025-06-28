import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor, EditorContent } from '@tiptap/react';
import { useAreas } from '../../../context/para/areas';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import './style.css';

const Editor_card = ({
  content,
  id,
}: {
  content: string;
  title: string;
  id: number;
}) => {
  const [shadow, setShadow] = useState(content);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({ placeholder: 'start writing..' }),
    ],

    content: shadow,
    onSelectionUpdate: e => setShadow(e.editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });
  useEffect(() => {
    editor?.chain().focus().run();
  }, []);
  useDebounce(
    () => {
      editor?.on('update', data => {
        let content = data.editor.getText();
        if (content) {
          let card = useAreas.getState().get_Card(id);
          card.props = content;
          useAreas.getState().update_card(id, card);
        }
      });
    },
    400,
    []
  );

  return (
    <div className=' border-none outline-none'>
      <EditorContent
        className='editor'
        placeholder='start writing'
        editor={editor}
      />
    </div>
  );
};

export default Editor_card;
