import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../../contexts/store"
import { IconLayersIntersect, IconPlus, IconSettings, IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Dialog } from "../../../../components/Dialog"
import { Area } from "../../../../contexts/area"
import { Channel, invoke } from "@tauri-apps/api/core"
import { update_card } from "../../../../contexts/area/functions/card/update"
import { Link } from "react-router-dom"

function AreasLinkList({ id }: { id: number }) {
    const dispatch = useDispatch<AppDispatch>()
    const card = useSelector((root: RootState) => root.area.active.area.structure.cards)[id]
    const currentAreaId = useSelector((root: RootState) => root.area.active.area.id)
    const [open, setOpen] = useState(false)
    const [allAreas, setAllAreas] = useState<Area[]>([])
    const [linkedAreas, setLinkedAreas] = useState<Area[]>([])

    const linkedIds = card?.store?.list ?? []

    useEffect(() => {
        if (!open) return
        let cancelled = false
        const channel = new Channel<Area[]>((items) => {
            if (!cancelled) setAllAreas(items)
        })
        invoke("areas_control", { payload: { command: "list" }, channel }).catch(console.error)
        return () => { cancelled = true }
    }, [open])

    useEffect(() => {
        if (linkedIds.length === 0) { setLinkedAreas([]); return }
        let cancelled = false
        const channel = new Channel<Area[]>((items) => {
            if (!cancelled) setLinkedAreas(items)
        })
        invoke("areas_control", { payload: { command: "find_by_ids", ids: linkedIds }, channel }).catch(console.error)
        return () => { cancelled = true }
    }, [linkedIds.join(",")])

    const availableAreas = allAreas.filter(
        a => a.id !== currentAreaId && !linkedIds.includes(a.id)
    )

    const updateList = (newList: number[]) => {
        dispatch(update_card({
            index: id,
            card: { ...card, store: { ...card.store, list: newList } },
        }))
    }

    const addArea = (areaId: number) => {
        updateList([...linkedIds, areaId])
    }

    const removeArea = (areaId: number) => {
        updateList(linkedIds.filter(i => i !== areaId))
    }

    const [overflowOpen, setOverflowOpen] = useState(false)

    if (!card) return null

    const configured = linkedIds.length > 0

    if (!configured) {
        return (
            <div className="p-4 flex flex-col items-center justify-center gap-3 h-full">
                <Dialog open={open} onClose={() => setOpen(false)} title="Link Areas" widthClass="w-80">
                    <AreaPicker areas={availableAreas} onAdd={addArea} />
                </Dialog>
                <IconLayersIntersect size={24} className="text-support-600" />
                <p className="text-xs text-support-500">No areas linked</p>
                <button
                    className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                    onClick={() => setOpen(true)}
                >
                    Link areas
                </button>
            </div>
        )
    }

    const singleRow = card.size.rows === 1

    const capacity = card.size.columns * card.size.rows
    const hasOverflow = linkedAreas.length > capacity
    const visibleAreas = hasOverflow ? linkedAreas.slice(0, capacity - 1) : linkedAreas
    const overflowAreas = hasOverflow ? linkedAreas.slice(capacity - 1) : []

    return (
        <div className="flex flex-col h-full group/card relative">
            <Dialog open={overflowOpen} onClose={() => setOverflowOpen(false)} title={`+${overflowAreas.length} more`} widthClass="w-80">
                <div className="flex flex-col gap-1 px-6">
                    {overflowAreas.map(area => (
                        <div key={area.id} className="flex items-center justify-between px-2 py-1.5 rounded text-sm hover:bg-hover-main transition-colors duration-100">
                            <Link
                                to={`/area/${area.id}`}
                                viewTransition
                                className="truncate flex-1"
                                onClick={() => setOverflowOpen(false)}
                            >
                                {area.name}
                            </Link>
                            <button
                                className="p-2 rounded text-support-600 hover:text-support-300 hover:bg-hover-main shrink-0 ml-2 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                                onClick={() => removeArea(area.id)}
                                aria-label={`Unlink ${area.name}`}
                            >
                                <IconX size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </Dialog>
            <Dialog open={open} onClose={() => setOpen(false)} title="Link Areas" widthClass="w-80">
                <div className="flex flex-col gap-3 px-6">
                    {linkedIds.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-support-600 uppercase tracking-wide">Linked</span>
                            {linkedIds.map(aid => {
                                const a = allAreas.find(x => x.id === aid)
                                return (
                                    <div key={aid} className="flex items-center justify-between px-2 py-1.5 rounded border border-border-main text-sm">
                                        <span className="truncate">{a?.name ?? `Area #${aid}`}</span>
                                        <button
                                            className="p-2 rounded hover:bg-hover-main text-support-500 hover:text-support-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                                            onClick={() => removeArea(aid)}
                                            aria-label={`Unlink ${a?.name ?? `Area #${aid}`}`}
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <AreaPicker areas={availableAreas} onAdd={addArea} />
                </div>
            </Dialog>
            <div className={`flex items-center justify-between px-3 py-2 border-b border-border-main bg-background-main z-10 ${singleRow ? "absolute top-0 left-0 right-0" : ""}`}>
                <span className="text-xs font-medium text-support-400 truncate">{card.type}</span>
                <button
                    className="p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                    onClick={() => setOpen(true)}
                    aria-label="Manage linked areas"
                >
                    <IconSettings size={14} />
                </button>
            </div>
            <div className="flex-1 overflow-hidden p-3 min-h-0">
                <div
                    className="h-full grid gap-2"
                    style={{ gridTemplateColumns: `repeat(auto-fill,minmax(8rem,1fr))`, gridTemplateRows: `repeat(auto-fill,minmax(8rem,1fr))` }}
                >
                    {visibleAreas.map(area => (
                        <div key={area.id} className="group/tile flex flex-col justify-end rounded-sm border border-border-main text-xs hover:bg-hover-subtle transition-colors duration-100">
                            <Link
                                to={`/area/${area.id}`}
                                viewTransition
                                className="flex-1"
                            />
                            <div className="border-t border-border-main p-2 flex items-center justify-between gap-1">
                                <Link to={`/area/${area.id}`} viewTransition className="truncate">{area.name}</Link>
                                <button
                                    className="p-2 rounded text-support-600 opacity-0 group-hover/tile:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main shrink-0 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                                    onClick={() => removeArea(area.id)}
                                    aria-label={`Unlink ${area.name}`}
                                >
                                    <IconX size={12} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {hasOverflow && (
                        <button
                            className="w-full h-full flex items-center justify-center rounded-sm border border-border-main text-xs text-support-400 hover:bg-hover-subtle transition-colors duration-100"
                            onClick={() => setOverflowOpen(true)}
                        >
                            +{overflowAreas.length} more
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

function AreaPicker({ areas, onAdd }: { areas: Area[]; onAdd: (id: number) => void }) {
    if (areas.length === 0) {
        return <p className="text-xs text-support-500 px-2">No more areas available to link.</p>
    }
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] text-support-600 uppercase tracking-wide">Available</span>
            {areas.map(a => (
                <button
                    key={a.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left hover:bg-hover-main transition-colors duration-100"
                    onClick={() => onAdd(a.id)}
                >
                    <IconPlus size={14} className="text-support-500 shrink-0" />
                    <span className="truncate">{a.name}</span>
                </button>
            ))}
        </div>
    )
}

export default AreasLinkList
