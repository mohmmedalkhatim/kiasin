import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../../contexts/store"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp, IconTrash } from "@tabler/icons-react"
import { update_card } from "../../../../../contexts/dashboard/functions/card/update"
import { Card } from "../../../../../contexts/dashboard"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"
import { delete_card } from "../../../../../contexts/dashboard/functions/card/delete"

function resizeCard(card: Card, id: number, action: string): Card {
  const { columns, rows } = card.size
  const sizes: Record<string, { columns: number; rows: number }> = {
    incr_col: { columns: Math.min(columns + 1, 7), rows },
    decr_col: { columns: Math.max(columns - 1, 1), rows },
    incr_row: { columns, rows: Math.min(rows + 1, 3) },
    decr_row: { columns, rows: Math.max(rows - 1, 1) },
  }
  return { ...card, id, size: sizes[action] ?? card.size }
}

function ControlButton({
  onClick,
  children,
  label,
  variant = "default",
}: {
  onClick: () => void
  children: React.ReactNode
  label: string
  variant?: "default" | "danger"
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-1.5 rounded-md transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 ${
        variant === "danger"
          ? "text-support-500 hover:text-danger-400 hover:bg-danger-500/10"
          : "text-support-400 hover:text-support-100 hover:bg-hover-main"
      }`}
    >
      {children}
    </button>
  )
}

export default function CardController({ id }: { id: number }) {
  const structure = useSelector((s: RootState) => s.dashboard.active.dashboard.structure)
  const card = structure.cards.find(item => item.id === id)
  const dispatch = useDispatch<AppDispatch>()

  if (!card) return null
  const index = structure.cards.indexOf(card)

  const needsConfig = ['summary', 'chart', 'comparison', 'bar_chart', 'line_chart', 'donut_chart', 'area_chart'].includes(card.type) && !card.store?.sheetId
  if (needsConfig) return null

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="absolute inset-0 z-90 flex flex-col justify-between rounded-lg bg-dark-900/85 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-0.5 bg-dark-800 rounded-lg p-0.5">
            <ControlButton
              onClick={() => dispatch(update_card({ index, card: resizeCard(card, id, "decr_col") }))}
              label="Decrease width"
            >
              <IconChevronLeft size={16} />
            </ControlButton>
            <ControlButton
              onClick={() => dispatch(update_card({ index, card: resizeCard(card, id, "incr_col") }))}
              label="Increase width"
            >
              <IconChevronRight size={16} />
            </ControlButton>

            <div className="w-px h-4 bg-hover-strong mx-0.5" />

            <ControlButton
              onClick={() => dispatch(update_card({ index, card: resizeCard(card, id, "decr_row") }))}
              label="Decrease height"
            >
              <IconChevronUp size={16} />
            </ControlButton>
            <ControlButton
              onClick={() => dispatch(update_card({ index, card: resizeCard(card, id, "incr_row") }))}
              label="Increase height"
            >
              <IconChevronDown size={16} />
            </ControlButton>
          </div>

          <ControlButton
            onClick={() => dispatch(delete_card({ id }))}
            label="Delete card"
            variant="danger"
          >
            <IconTrash size={16} />
          </ControlButton>
        </div>

        <div className="flex items-center justify-between px-3 pb-2">
          <span className="text-xs text-support-500 capitalize">{card.type.replaceAll('_', ' ')}</span>
          <span className="text-[10px] text-support-600 tabular-nums">
            {card.size.columns}×{card.size.rows}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
