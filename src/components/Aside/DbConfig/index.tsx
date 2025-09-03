import { useState, useEffect, useRef } from "react";
import { DB, useDatabase } from "../../../context/para/database";
import { useAside } from "../../../context/aside";
import Field from "./field";

function DBConfig() {
  const [DataB, setDataB] = useState<DB>();
  const one = useDatabase(state => state.get);
  const id = useAside(state => state.id);
  const [value_one, setValue_one] = useState("")
  const [value, setValue] = useState("")
  useEffect(() => {
    one(Number(id), setDataB)
  }, [id])
  if (DataB) {
    let map = new Map(DataB.data)
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col gap-4">
          {DataB.fields.map((name) => (<>
            <Field name={value} list={["hello", "world"]} value={value} setValue={setValue} DB_ID={id} />
          </>))}
          <div></div>
        </div>
      </div>
    )
  }
}
export default DBConfig