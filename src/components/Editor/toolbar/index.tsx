import React from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { IconAlignCenter, IconAlignJustified, IconAlignLeft, IconAlignRight, IconBold, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconHeading, IconItalic, IconUnderline } from "@tabler/icons-react"
import Heading from "./heading";
import Alignment from "./alignment";

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
          <IconBold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className="toolbar_button"
        >
          <IconItalic />
        </button>

        <div className="flex">
          <Alignment editor={editor}/>
          <Heading editor={editor}/>
        </div>
      </div>
      <button
        onClick={() => editor.chain().focus().setUnderline().run()}
        disabled={!editor.can().chain().focus().setUnderline().run()}
        className="toolbar_button"
      >
        <IconUnderline />
      </button>
    </BubbleMenu>
  );

};