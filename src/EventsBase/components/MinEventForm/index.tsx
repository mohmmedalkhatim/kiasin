import { IconAlarm, IconFileDownload, IconH1, IconH2, IconH6, IconLocation, IconMap, IconMapQuestion, IconTrash } from "@tabler/icons-react"
import Button from "../../../components/Button"
import Input from "../../../components/Input"
import "./style.css"

function MinEventForm() {
    return (
        <div className="w-[20rem] gap-1 p-3 flex flex-col m_border min_form">
            <div className="flex items-center justify-between p-[6px]">
                <Button size="sm" className="px-1 gap-1" >save <IconFileDownload size={"1rem"} /></Button>
                <IconTrash size={"1.2rem"} />
            </div>
            <Input placeholder="title" icon={<IconH1 size={"1rem"} />}></Input>
            <div className="flex">
                <Input className="w-1/2" label="start" type="time"></Input>
                <Input className="w-1/2" label="end" type="time"></Input>
            </div>
            <div className="px-1 flex items-center gap-2">
                <div className="p-1 rounded w-full m_border pr-2">
                    <select defaultValue={"5"}  className="pl-0  focus:outline-none px-3 text-xs text-[#e2e2e2e2] w-full  bg-[#181818] rounded">
                        <option value="5">5 min</option>
                        <option value="10">10 min</option>
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">1 hour</option>
                    </select>
                </div>
                <div><IconAlarm size={"1.3rem"}/></div>
            </div>
            <Input placeholder="description" icon={<IconH6 size={"1rem"} />}></Input>
            <Input placeholder="location" icon={<IconMap size={"1rem"} />}></Input>
        </div>
    )
}
export default MinEventForm