import { useEditor, EditorContent} from '@tiptap/react';
import { } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import textStyle from '@tiptap/extension-text-style';
import './style.css';


const Editor_card = ({content,title}:{content:string,title:string}) => {
    const titleEditor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading"],
            }),
        ],
        content:`<h4>${title}<h4/>`,
        editorProps: {
            attributes: {
                class: 'editor',
            },
        }
    });
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
            <EditorContent cols={1} className='editor' editor={titleEditor} />
            <EditorContent cols={10} className='editor' editor={editor} />
        </div>
    )
};

export default Editor_card;