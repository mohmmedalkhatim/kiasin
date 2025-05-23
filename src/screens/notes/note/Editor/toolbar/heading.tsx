import {
  IconHeading,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
} from '@tabler/icons-react';
import { Editor } from '@tiptap/react';

function Heading({ editor }: { editor: Editor }) {
  return (
    <div className="tooltip-container">
      <button aria-describedby="help-tooltip" className="help-button">
        <IconHeading size={'1rem'} />
      </button>
      <div role="tooltip" id="help-tooltip" className="tooltip">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 1 }).run()
          }
          className="toolbar_button"
        >
          <IconH1 size={'1rem'} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 2 }).run()
          }
          className="toolbar_button"
        >
          <IconH2 size={'1rem'} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 3 }).run()
          }
          className="toolbar_button"
        >
          <IconH3 size={'1rem'} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 4 }).run()
          }
          className="toolbar_button"
        >
          <IconH4 size={'1rem'} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 5 }).run()
          }
          className="toolbar_button"
        >
          <IconH5 size={'1rem'} />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          disabled={
            !editor.can().chain().focus().toggleHeading({ level: 6 }).run()
          }
          className="toolbar_button"
        >
          <IconH6 size={'1rem'} />
        </button>
      </div>
    </div>
  );
}
export default Heading;
