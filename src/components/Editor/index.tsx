import { useEditor, EditorContent} from '@tiptap/react';
import { } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import textStyle from '@tiptap/extension-text-style';
import { Toolbar } from './toolbar';

import './style.css';


const RichTextEditor = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextAlign.configure({
                types: ["heading", 'paragraph'],
            }),
            textStyle,
        ],
        content: '<p>Hello, world!</p>',
        editorProps: {
            attributes: {
                class: 'editor',
            },
        }
    });

    return (
        <div className='eidtor_container'>
            <Toolbar editor={editor} />
            <EditorContent className='editor' editor={editor} />
        </div>
    )
};

export default RichTextEditor;