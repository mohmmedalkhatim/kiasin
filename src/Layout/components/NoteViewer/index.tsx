import { Placeholder } from '@tiptap/extension-placeholder';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import TextAlign from '@tiptap/extension-text-align';
import StarterKit from '@tiptap/starter-kit';
import { IconLink } from '@tabler/icons-react';
import { useNotes } from '../../../context/para/notes';
import Rich_Editor from './Editor';
import { useEffect, useRef, useState } from 'react';
import './style.css';
import { Note } from '../../../types/notes';

const NoteViewer = ({ id }: { id: number }) => {
  const active = useNotes(state => state.active);
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['paragraph', 'heading'],
      }),
      Placeholder.configure({ placeholder: 'start writing..' }),
    ],

    content: active.content,
    editorProps: {
      attributes: {
        class: 'editor',
      },
    },
  });
  if (editor)
    return (
      <div className=' border-none outline-none'>
        <Rich_Editor editor={editor} id={id} />
        <div className='absolute bottom-4 right-4' onClick={() => { }}>
          <IconLink color='#e2e2e280' size={'1.4rem'} />
        </div>
      </div>
    );
}

export default NoteViewer;
