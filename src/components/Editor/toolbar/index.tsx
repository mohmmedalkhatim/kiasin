import React from "react";
import { Editor } from "@tiptap/react";
import { IconAlignCenter, IconAlignJustified, IconAlignLeft, IconAlignRight, IconBold, IconH1, IconH2, IconH3, IconH4, IconH5, IconH6, IconItalic, IconUnderline } from "@tabler/icons-react"

interface ToolbarProps {
  editor: Editor | null;
}


export const Toolbar: React.FC<ToolbarProps> = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className="toolbar">
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
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 1 }).run()}
        className="toolbar_button"
      >
        <IconH1 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 2 }).run()}
        className="toolbar_button"
      >
        <IconH2 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 3 }).run()}
        className="toolbar_button"
      >
        <IconH3 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 4 }).run()}
        className="toolbar_button"
      >
        <IconH4 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 5 }).run()}
        className="toolbar_button"
      >
        <IconH5 />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        disabled={!editor.can().chain().focus().toggleHeading({ level: 6 }).run()}
        className="toolbar_button"
      >
        <IconH6 />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        disabled={!editor.can().chain().focus().setTextAlign("center").run()}
        className="toolbar_button"
      >
        <IconAlignCenter />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        disabled={!editor.can().chain().focus().setTextAlign("right").run()}
        className="toolbar_button"
      >
        <IconAlignRight />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        disabled={!editor.can().chain().focus().setTextAlign("left").run()}
        className="toolbar_button"
      >
        <IconAlignLeft />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        disabled={!editor.can().chain().focus().setTextAlign("justify").run()}
        className="toolbar_button"
      >
        <IconAlignJustified />
      </button>
      <button
        onClick={() => editor.chain().focus().setUnderline().run()}
        disabled={!editor.can().chain().focus().setUnderline().run()}
        className="toolbar_button"
      >
        <IconUnderline />
      </button>
      {/* Add more buttons for other formatting options */}
    </div>
  );
};