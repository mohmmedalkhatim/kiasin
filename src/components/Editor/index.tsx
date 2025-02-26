import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Toolbar } from './toolbar';
import './style.css';

const RichTextEditor = () => {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello, world!</p>',
        injectCSS: true,
        editorProps: {
            attributes: {    
                class: 'editor',
            },}
    });

    return (
        <div className='eidtor_container'>
            <Toolbar editor={editor} />
            <EditorContent className='editor' editor={editor} />
        </div>
    )
};

export default RichTextEditor;