import { useEditor, EditorContent} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import {Placeholder} from '@tiptap/extension-placeholder';
import './style.css';



const Editor_card = ({content,title}:{content:string,title:string}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['paragraph'],
            }),
            Placeholder.configure({placeholder:"start writing.."})
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
            <EditorContent className='editor' placeholder='start writing' editor={editor} />
        </div>
    )
};

export default Editor_card;