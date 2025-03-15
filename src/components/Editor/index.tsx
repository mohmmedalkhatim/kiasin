import { useEditor, EditorContent} from '@tiptap/react';
import { } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import textStyle from '@tiptap/extension-text-style';
import { Toolbar } from './toolbar';
import './style.css';


const RichTextEditor = ({content}:{content:string}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ["heading", 'paragraph'],
            }),
            textStyle,
        ],
        content,
        editorProps: {
            attributes: {
                class: 'editor',
            },
        }
    });

    return (
        <div className='eidtor_container'>
            <Toolbar editor={editor} />
            <EditorContent cols={10} className='editor' editor={editor} />
        </div>
    )
};

export default RichTextEditor;