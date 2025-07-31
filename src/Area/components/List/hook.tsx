import { useState, useEffect } from "react";
import { useAreas } from "../../../context/para/areas";
import { useLayoutDialog } from "../../../context/para/Dialog";

function useAreaList(id:number) {
    let list = useAreas(state => state.list);
    let card = useAreas(state => state.get_Card)(id);
    let update_card = useAreas(state => state.update_card);
    let changeMode = useLayoutDialog(state => state.changeMode)
    let [areas, setAreas] = useState<number[]>();
    useEffect(
        () => {
            setAreas(card.props.list);
        }, []
    );
    return { list, update_card,card, changeMode, areas }
}
export default useAreaList