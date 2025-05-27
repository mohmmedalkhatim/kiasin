import { useNotes } from '../../../context/para/notes';

function Notes_templates () {
  let note = useNotes(state => state);
  return (
    <div className='grid area_templates_grid '>
      <div
        className='m_border area_templates_element'
        onClick={() => {
          note.create_blank();
        }}
      >
        <div></div>
        <div className='text-center'>create blank</div>
      </div>
    </div>
  );
}
export default Notes_templates;
