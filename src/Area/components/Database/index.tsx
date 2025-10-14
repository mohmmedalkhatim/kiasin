import { IconDatabase } from "@tabler/icons-react"
import { useAreas } from "../../../context/para/areas"
import { useEffect, useState } from "react";
import { DB_DTO, useDatabase } from "../../../context/para/database";

function Database({ id }: { id: number }) {
    let card = useAreas(state => state.get_Card)(id);
    let update = useAreas(state => state.update_card);
    let get_database = useDatabase(state => state.get);
    let create = useDatabase(state => state.create);
    let [DB, setDB] = useState<DB_DTO | undefined>()
    useEffect(() => {
        if (card.props.db_id) {
            get_database(card.props.db_id, setDB);
        } else {
            create(setDB)
            card.props.db_id = DB?.id;
            update(id,card)
        }
    }, [])
    if (DB) {
        return (
            <div className="flex items-center justify-center">
                <IconDatabase />
                <div>{DB.name}</div>
            </div>
        )
    }
}
export default Database