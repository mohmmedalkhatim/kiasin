import { useState, useEffect } from "react";
import { useAreas } from "../../../context/para/areas";
import { useLayoutDialog } from "../../../context/para/Dialog";
import { useDebounce } from "react-use";

function useAreaList(id: number) {
    let list = useAreas(state => state.list);
    let card = useAreas(state => state.get_Card)(id);
    let update_card = useAreas(state => state.update_card);
    let changeMode = useLayoutDialog(state => state.changeMode)
    let [areas, setAreas] = useState<number[]>();
    let active = useAreas(state => state.active)?.at(-1)
    useDebounce(
        () => {
            setAreas(card.props.list);
        }, 40, [active]
    );
    return { list, update_card, card, changeMode, areas }
}
export default useAreaList