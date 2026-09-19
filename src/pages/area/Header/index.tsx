import { IconDatabasePlus, IconEdit, IconForms, IconGrid3x3 } from "@tabler/icons-react"
import { useSelector, useDispatch } from "react-redux"
import { areas } from "../../../contexts/area"
import { update } from "../../../contexts/area/functions/update"
import { RootState, AppDispatch } from "../../../contexts/store"
import Header from "../../../components/header"
import HeaderAction from "./action"

interface headerProps {
    setDense: (nextValue?: any) => void
}

function AreaHeader({ setDense }: headerProps) {
    let { area } = useSelector((state: RootState) => state.area.active)
    let dispatch = useDispatch<AppDispatch>()
    let name = useSelector((state: RootState) => state.area.active.area.name)
    return (
        <Header className="bg">
            <h1 className="text-xl font-semibold">{name}</h1>
            <div className="flex items-center gap-2">
                <HeaderAction
                    className="flex flex-col items-center"
                    onClick={() => dispatch(areas.actions.toggle_editing())}
                    aria-label="Toggle edit mode"
                >
                    <IconEdit size={24} stroke={1.5} />
                    <span className="text-xs">Edit</span>
                </HeaderAction>
                <HeaderAction
                    className="flex flex-col items-center"
                    onClick={async () => {
                        setDense(!area.structure.dense)
                        await dispatch(update({ ...area, structure: { cards: area.structure.cards, dense: !area.structure.dense } }))
                        dispatch(areas.actions.update_active({ ...area, structure: { cards: area.structure.cards, dense: !area.structure.dense } }))
                    }}
                    aria-label="Toggle dense layout"
                >
                    <IconGrid3x3 size={24} stroke={1.5} />
                    <span className="text-xs">Auto Fill</span>
                </HeaderAction>
                <HeaderAction
                    className="flex flex-col items-center"
                    description="Add a form"
                    onClick={() => {
                        // TODO: Implement form addition
                    }}
                    aria-label="Add form"
                >
                    <IconForms size={24} stroke={1.5} />
                    <span className="text-xs">Forms</span>
                </HeaderAction>
                <HeaderAction
                    className="flex flex-col items-center"
                    description="Link a database"
                    onClick={() => {
                        // TODO: Implement database linking
                    }}
                    aria-label="Link database"
                >
                    <IconDatabasePlus size={24} stroke={1.5} />
                    <span className="text-xs">Database</span>
                </HeaderAction>
            </div>
        </Header>
    )
}
export default AreaHeader