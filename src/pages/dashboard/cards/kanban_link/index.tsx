import { useSelector, useDispatch } from "react-redux"
import { AppDispatch, RootState } from "../../../../contexts/store"
import { IconLayoutKanban, IconPlus, IconSettings, IconX } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { Dialog } from "../../../../components/Dialog"
import { update_card } from "../../../../contexts/dashboard/functions/card/update"
import { Link } from "react-router-dom"
import { Channel, invoke } from "@tauri-apps/api/core"
import type { Sheet } from "../../../../contexts/sheets/objects"

function isKanbanSheet(sheet: Sheet): boolean {
    try { return JSON.parse(sheet.description)?.kanban === true } catch { return false }
}

export default function KanbanLinkCard({ id }: { id: number }) {
    const dispatch = useDispatch<AppDispatch>()
    const card = useSelector((root: RootState) => root.dashboard.active.dashboard.structure.cards)[id]
    const [open, setOpen] = useState(false)
    const [allBoards, setAllBoards] = useState<Sheet[]>([])
    const [linkedBoards, setLinkedBoards] = useState<Sheet[]>([])

    const linkedIds: number[] = card?.store?.list ?? []

    useEffect(() => {
        let cancelled = false
        const channel = new Channel<Sheet[]>((items) => {
            if (!cancelled) {
                const kanbanSheets = items.filter(isKanbanSheet)
                setAllBoards(kanbanSheets)
                setLinkedBoards(kanbanSheets.filter(s => linkedIds.includes(s.id!)))
            }
        })
        invoke("sheets_control", { payload: { command: "list" }, channel }).catch(console.error)
        return () => { cancelled = true }
    }, [open, linkedIds.join(",")])

    const availableBoards = allBoards.filter(b => !linkedIds.includes(b.id!))

    const updateList = (newList: number[]) => {
        dispatch(update_card({
            index: id,
            card: { ...card, store: { ...card.store, list: newList } },
        }))
    }

    const addBoard = (boardId: number) => updateList([...linkedIds, boardId])
    const removeBoard = (boardId: number) => updateList(linkedIds.filter(i => i !== boardId))

    if (!card) return null

    const configured = linkedIds.length > 0

    if (!configured) {
        return (
            <div className="p-4 flex flex-col items-center justify-center gap-3 h-full">
                <Dialog open={open} onClose={() => setOpen(false)} title="Link Kanban Boards" widthClass="w-80">
                    <BoardPicker boards={availableBoards} onAdd={addBoard} />
                </Dialog>
                <IconLayoutKanban size={24} className="text-support-600" />
                <p className="text-xs text-support-500">No boards linked</p>
                <button
                    className="text-xs text-primary-400 hover:text-primary-300 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                    onClick={() => setOpen(true)}
                >
                    Link boards
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full group/card relative">
            <Dialog open={open} onClose={() => setOpen(false)} title="Link Kanban Boards" widthClass="w-80">
                <div className="flex flex-col gap-3 px-6">
                    {linkedIds.length > 0 && (
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-support-600 uppercase tracking-wide">Linked</span>
                            {linkedIds.map(bid => {
                                const b = allBoards.find(x => x.id === bid) ?? linkedBoards.find(x => x.id === bid)
                                return (
                                    <div key={bid} className="flex items-center justify-between px-2 py-1.5 rounded border border-border-main text-sm">
                                        <span className="truncate">{b?.name ?? `Board #${bid}`}</span>
                                        <button
                                            className="p-2 rounded hover:bg-hover-main text-support-500 hover:text-support-300 focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                                            onClick={() => removeBoard(bid)}
                                            aria-label={`Unlink ${b?.name ?? `Board #${bid}`}`}
                                        >
                                            <IconX size={14} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <BoardPicker boards={availableBoards} onAdd={addBoard} />
                </div>
            </Dialog>
            <div className="flex items-center justify-between px-3 py-2 border-b border-border-main">
                <span className="text-xs font-medium text-support-400 truncate">Kanban</span>
                <button
                    className="p-2 rounded text-support-600 opacity-0 group-hover/card:opacity-100 focus-visible:opacity-100 transition-opacity duration-150 hover:text-support-300 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                    onClick={() => setOpen(true)}
                    aria-label="Manage linked boards"
                >
                    <IconSettings size={14} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 min-h-0 flex flex-col gap-0.5">
                {linkedBoards.map(b => (
                    <Link
                        key={b.id}
                        to={`/kanban/${b.id}`}
                        viewTransition
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-support-300 hover:bg-hover-subtle transition-colors duration-100"
                    >
                        <IconLayoutKanban size={14} className="text-support-500 shrink-0" />
                        <span className="truncate">{b.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

function BoardPicker({ boards, onAdd }: { boards: Sheet[]; onAdd: (id: number) => void }) {
    if (boards.length === 0) {
        return <p className="text-xs text-support-500 px-2">No more boards available to link.</p>
    }
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[10px] text-support-600 uppercase tracking-wide">Available</span>
            {boards.map(b => (
                <button
                    key={b.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left hover:bg-hover-main transition-colors duration-100"
                    onClick={() => onAdd(b.id!)}
                >
                    <IconPlus size={14} className="text-support-500 shrink-0" />
                    <span className="truncate">{b.name}</span>
                </button>
            ))}
        </div>
    )
}
