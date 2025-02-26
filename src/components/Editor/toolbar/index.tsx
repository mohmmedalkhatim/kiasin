import React from "react";
import { Editor } from "@tiptap/react";
import {IconBold,IconItalic} from "@tabler/icons-react"

interface ToolbarProps {
    editor: Editor | null;
}


export const Toolbar:React.FC<ToolbarProps> = ({ editor }) => {
    if (!editor) return null;
  
    return (
      <div className="toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className="toolbar_button"
        >
          <IconBold/>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className="toolbar_button"
        >
          <IconItalic/>
        </button>
        {/* Add more buttons for other formatting options */}
      </div>
    );
  };