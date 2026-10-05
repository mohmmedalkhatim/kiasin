import { Popover, PopoverPanel, PopoverButton, CloseButton } from "@headlessui/react"
import { IconX, IconGrid3x3, IconForms, IconSum, IconChartBar, IconScale } from "@tabler/icons-react"
import { useRef } from "react"
import Button from "../../../../components/Button"
import { create_card } from "../../../../contexts/area/functions/card/create"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../../contexts/store"
import * as motion from "motion/react-client"
import { AnimatePresence } from "motion/react"

const CARD_TYPES = [
  { type: 'areas_links' as const, icon: IconGrid3x3, label: 'Areas' },
  { type: 'form' as const, icon: IconForms, label: 'Form' },
  { type: 'summary' as const, icon: IconSum, label: 'Summary', columns: 2 },
  { type: 'chart' as const, icon: IconChartBar, label: 'Chart', columns: 3, rows: 2 },
  { type: 'comparison' as const, icon: IconScale, label: 'Compare', columns: 2 },
]

const DECEL = [0.16, 1, 0.3, 1] as [number, number, number, number]

function CardPopover() {
  const dispatch = useDispatch<AppDispatch>()
  let ref = useRef<HTMLDivElement>(null)

  return (
    <div className="flex justify-center w-full" ref={ref}>
      {ref.current && (
        <Popover className="w-full">
          {({ open }) => (
            <>
              <AnimatePresence>
                {open && (
                  <PopoverPanel static>
                    <motion.div
                      initial={{ opacity: 0, y: 12, scaleY: 0.95 }}
                      animate={{ opacity: 1, y: 0, scaleY: 1 }}
                      exit={{ opacity: 0, y: 8, scaleY: 0.97 }}
                      transition={{ duration: 0.2, ease: DECEL }}
                      className="mb-2 border-border-main border bg rounded-lg overflow-hidden origin-bottom"
                      style={{ zIndex: 20000 }}
                    >
                      <div className="w-full justify-between p-3 px-4 flex items-center border-b border-border-main">
                        <span className="text-sm font-medium">Add card</span>
                        <CloseButton className="p-1 rounded-full text-support-500 transition-colors duration-150 hover:text-support-200 hover:bg-[#e2e2e210]">
                          <IconX size={14} />
                        </CloseButton>
                      </div>
                      <div className="p-3 grid grid-cols-3 gap-2">
                        {CARD_TYPES.map(({ type, icon: Icon, label, columns, rows }, i) => (
                          <motion.div
                            key={type}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.15, delay: 0.04 + i * 0.03, ease: DECEL }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <CloseButton
                              className="flex flex-col items-center gap-1.5 p-3 w-full rounded-lg border border-border-main text-support-400 transition-colors duration-150 hover:bg-[#e2e2e210] hover:text-support-200 hover:border-primary-600/30 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                              onClick={() => dispatch(create_card({ type: type as any, columns: columns ?? 1, rows: rows ?? 1 }))}
                            >
                              <Icon size={20} stroke={1.5} />
                              <span className="text-xs">{label}</span>
                            </CloseButton>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </PopoverPanel>
                )}
              </AnimatePresence>
              <PopoverButton className="w-full">
                <Button className="w-full">create</Button>
              </PopoverButton>
            </>
          )}
        </Popover>
      )}
    </div>
  )
}
export default CardPopover
