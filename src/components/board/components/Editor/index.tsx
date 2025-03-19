import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {Placeholder} from '@tiptap/extension-placeholder';
import './style.css';
import { useState } from 'react';



const Editor_card = ({content}:{content:string,title:string}) => {
    let [shadow,setShadow]= useState(content)
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['paragraph','heading'],
            }),
            Placeholder.configure({placeholder:"start writing.."})
        ],
        
        content:shadow,
        onSelectionUpdate:(e)=>setShadow(e.editor.getHTML()),
        editorProps: {
            attributes: {
                class: 'editor',
            },
        }
    });

    return (
        <div className='eidtor_container'>
            <EditorContent className='editor' placeholder='start writing' editor={editor}  />
        </div>
    )
};

export default Editor_card;