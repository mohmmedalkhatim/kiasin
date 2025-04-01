import React from 'react';
import { BubbleMenu, Editor } from '@tiptap/react';
import { IconBold, IconItalic, IconUnderline } from '@tabler/icons-react';
import Heading from './heading';
import Alignment from './alignment';

interface ToolbarProps {
  editor: Editor | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <BubbleMenu editor={editor} className="bubble_menu">
      <div className="flex">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className="toolbar_button"
        >
          <IconBold size={'1rem'} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className="toolbar_button"
        >
          <IconItalic size={'1rem'} />
        </button>

        <div className="flex">
          <Alignment editor={editor} />
          <Heading editor={editor} />
        </div>
      </div>
      <button
        onClick={() => editor.chain().focus().setUnderline().run()}
        disabled={!editor.can().chain().focus().setUnderline().run()}
        className="toolbar_button"
      >
        <IconUnderline size={'1rem'} />
      </button>
    </BubbleMenu>
  );
};
