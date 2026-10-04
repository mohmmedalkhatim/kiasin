import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../../contexts/store"
import { IconChevronsDown, IconChevronsLeft, IconChevronsRight, IconChevronsUp, IconTrash } from "@tabler/icons-react"
import { update_card } from "../../../../../contexts/area/functions/card/update"
import { Card } from "../../../../../contexts/area"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { delete_card } from "../../../../../contexts/area/functions/card/delete"

type CardControllerProps = {
    id: number
}
function card_action(card: Card, id: number, action: string,): Card {
    let actions = new Map<string, Card>(
        [
            ["incr_col",
                {
                    id,
                    type: card.type,
                    store: card.store,
                    size:
                    {
                        columns: (card.size.columns + 1) == 8 ? card.size.columns : card.size.columns + 1,
                        rows: card.size.rows
                    },
                }
            ],
            ["decr_col",
                {
                    id,
                    type: card.type,
                    store: card.store,
                    size:
                    {
                        columns: (card.size.columns - 1) > 1 ? card.size.columns - 1 : 1,
                        rows: card.size.rows
                    },
                }
            ],
            ["decr_row",
                {
                    id,
                    type: card.type,
                    store: card.store,
                    size:
                    {
                        columns: card.size.columns,
                        rows: (card.size.rows - 1) > 1 ? card.size.rows - 1 : 1,
                    },
                }
            ],
            ["incr_row",
                {
                    id,
                    type: card.type,
                    store: card.store,
                    size:
                    {
                        rows: (card.size.rows + 1) == 4 ? card.size.rows : card.size.rows + 1,
                        columns: card.size.columns
                    },
                }
            ]
        ]
    )
    return actions.get(action) ||
    {
        id,
        type: card.type,
        store: card.store,
        size:
        {
            columns: card.size.columns,
            rows: card.size.rows
        },
    }

}


function CardController({ id }: CardControllerProps) {
    let structure = useSelector((state: RootState) => state.area.active.area.structure)
    let card = structure.cards.find(item => item.id == id)
    let dispatch = useDispatch<AppDispatch>()
    if (card) {
        let index = structure.cards.indexOf(card)
        return (
            <AnimatePresence mode="popLayout">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className='absolute top-0 left-0 w-full h-full z-90 bg flex justify-between flex-col rounded-sm'>
                    <div className="flex min-w-40 max-w-44 items-center bg-dark-800 h-12 self-start justify-around px-2 rounded-sm">
                        <div onClick={() => dispatch(update_card({ index, card: card_action(card, id, "decr_col") }))} children={<IconChevronsLeft size={"1.3rem"} />} />
                        <div onClick={() => dispatch(update_card({ index, card: card_action(card, id, "incr_col") }))} children={<IconChevronsRight size={"1.3rem"} />} />
                        <div onClick={() => dispatch(update_card({ index, card: card_action(card, id, "incr_row") }))} children={<IconChevronsDown size={"1.3rem"} />} />
                        <div onClick={() => dispatch(update_card({ index, card: card_action(card, id, "decr_row") }))} children={<IconChevronsUp size={"1.3rem"} />} />
                        <div onClick={() => {
                            dispatch(delete_card({ id }))
                        }} children={<IconTrash size={"1.3rem"} />} />
                    </div>
                    <legend className="p-3">{card.type} {id}</legend>
                </motion.div>
            </AnimatePresence>
        )
    }
}
export default CardController
