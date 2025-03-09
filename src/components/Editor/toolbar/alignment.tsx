import { IconAlignCenter, IconAlignJustified, IconAlignLeft, IconAlignRight } from "@tabler/icons-react"
import { Editor } from "@tiptap/react"

function Alignment({editor}: {editor:Editor}) {
  return (
        <div className="tooltip-container">
            <button aria-describedby="help-tooltip" className="help-button">
              <IconAlignCenter />
            </button>
            <div role="tooltip" id="help-tooltip" className="tooltip">
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
            </div>
          </div>
  )
}
export default Alignment