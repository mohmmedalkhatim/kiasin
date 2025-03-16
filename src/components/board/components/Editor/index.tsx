import { useEditor, EditorContent} from '@tiptap/react';
import { } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import './style.css';


const Editor_card = ({content,title}:{content:string,title:string}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['paragraph'],
            }),
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
            <EditorContent className='editor' editor={editor} />
        </div>
    )
};

export default Editor_card;