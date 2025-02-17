import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { 
    INSERT_PARAGRAPH_COMMAND
} from 'lexical';

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="toolbar">
    </div>
  );
}