import { useState, useEffect, useRef } from "react";
import { DB, DB_DTO, useDatabase } from "../../../context/para/database";
import { useAside } from "../../../context/aside";

function DBConfig() {
  const [DataB, setDataB] = useState<DB>();
  const one = useDatabase(state => state.get);
  const id = useAside(state => state.id);
  useEffect(() => {
    one(Number(id), setDataB)
  }, [id])
  if (DataB) {
    let map = new Map(DataB.data)
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full">
          {DataB.fields
            .map((value) => (
              value
            ))}
        </div>
      </div>
    )
  }
}
export default DBConfig