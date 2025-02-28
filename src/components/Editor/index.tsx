import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Heading } from '@tiptap/extension-heading';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Toolbar } from './toolbar';
import './style.css';

const RichTextEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit, Heading, Underline, TextAlign.configure({types:["heading", "paragraph"]})],
        content: '<p>Hello, world!</p>',
        injectCSS: true,
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