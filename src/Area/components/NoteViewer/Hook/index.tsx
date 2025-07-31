import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useState } from 'react';
import { useNotes } from '../../../../context/para/notes';
import { Note } from '../../../../types/notes';

const useNoteCard = (id: number) => {
    const update_note = useNotes(state => state.updata_note);
    const get_note = useNotes(state => state.note);
    const [note, setNote] = useState({} as Note);

    useEffect(() => {
        get_note(id, setNote).then(() => {
            if (editor) {
                editor.once('update', e => {
                    const content = e.editor.getJSON();
                    const description = editor.getText();
                    if (content) {
                        const updated = { title: note.title, content: note.content, description, id } as Note;
                        update_note(note.id, updated);
                    }
                });
            }
        })

    }, [])

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['paragraph', 'heading'],
            }),
            Placeholder.configure({ placeholder: 'start writing..' }),
        ],

        content: (async () => {
            if (note) {
                return note.content
            }
        })(),
        editorProps: {
            attributes: {
                class: 'editor',
            },
        },
    });


    return { editor }

}
export default useNoteCard