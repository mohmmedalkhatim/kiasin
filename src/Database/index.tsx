import { useParams } from "react-router-dom"
import { DB, DB_DTO, useDatabase } from "../context/para/database"
import { useEffect, useState } from "react"
import Fields from "./components/Feilds";
import Header from "./components/Header";
import Record from "./components/Record";
import Input from "../components/Input";
import "./style.css"
import Button from "../components/Button";
import { IconPlus } from "@tabler/icons-react";

function Database() {
    const [DataB, setDataB] = useState<DB_DTO>();
    const { id } = useParams();
    let one = useDatabase(state => state.get);
    useEffect(() => {
        one(Number(id), setDataB)
    }, [id])
    if (DataB) {
        return (
            <>
                <Header />
                <main className="flex content px-4 flex-col items-center">
                    <div className="flex justify-between w-full px-4 py-4">
                        <Input className="w-[18rem] border-0 outline-0" value={DataB.name} />
                        <Button className="text-xs" size="sm">new record</Button>
                    </div>
                    <div className="w-full flex flex-col max-w-full overflow-x-auto">
                        <Fields list={DataB.data.fields} />
                        {DataB.data.records.map((record) => (<Record list={record} />))}
                        <div className=" flex py-2 hover:bg-[#e2e2e210] w-full border border-t-0 border-[#e2e2e220] items-center justify-center">
                            <div className="flex items-center gap-2 text-[#e2e2e240]">
                                <IconPlus size={"1rem"} />
                            </div>
                        </div>
                    </div>
                </main></>
        )
    }
}
export default Database