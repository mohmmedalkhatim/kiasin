import { IconSend2 } from "@tabler/icons-react";
import Input from "../../../../components/Input";
import { Dispatch, SetStateAction, useState } from "react";
import { useTasks } from "../../../../context/para/tasks";


function Form({ column_id, card_id}: { column_id: number, card_id: number,setActive:Dispatch<SetStateAction<number>> }) {
    const [title, setTitle] = useState<string>('');
    const create_task = useTasks(state => state.create);
    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                if (title != '') {
                    await create_task(title, card_id, column_id);
                    setTitle('');
                }
            }}
            className='cols-full px-2 pt-2'
        >
            <Input
                placeholder='create a task'
                onChange={setTitle}
                value={title}
                icon={
                    <button type='submit'>
                        <IconSend2 size={'1rem'} />
                    </button>
                }
            />
        </form>
    )
}
export default Form