import { Popover, PopoverPanel, PopoverButton, CloseButton } from "@headlessui/react";
import {
  IconX,
  IconGrid3x3,
  IconForms,
  IconSum,
  IconChartBar,
  IconScale,
  IconChartAreaLine,
  IconTrendingUp,
  IconChartPie,
  IconList,
  IconWallet,
  IconHash,
  IconReportMoney,
  IconTargetArrow,
} from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import Button from "../../../../components/Button";
import { create_card } from "../../../../contexts/area/functions/card/create";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../contexts/store";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";

const CARD_TYPES = [
  { type: "areas_links" as const, icon: IconGrid3x3, label: "Areas" },
  { type: "form" as const, icon: IconForms, label: "Form" },
  { type: "summary" as const, icon: IconSum, label: "Summary", columns: 2 },
  { type: "chart" as const, icon: IconChartBar, label: "Chart", columns: 3, rows: 2 },
  { type: "comparison" as const, icon: IconScale, label: "Compare", columns: 2 },
  { type: "bar_chart" as const, icon: IconChartBar, label: "Bar Chart", columns: 3, rows: 2 },
  { type: "line_chart" as const, icon: IconTrendingUp, label: "Line Chart", columns: 3, rows: 2 },
  { type: "donut_chart" as const, icon: IconChartPie, label: "Donut", columns: 2, rows: 2 },
  { type: "area_chart" as const, icon: IconChartAreaLine, label: "Area Chart", columns: 3, rows: 2 },
  { type: "balance" as const, icon: IconWallet, label: "Balance", columns: 3, rows: 2 },
  { type: "value" as const, icon: IconHash, label: "Value" },
  { type: "revenue" as const, icon: IconReportMoney, label: "Revenue", columns: 2 },
  { type: "progress" as const, icon: IconTargetArrow, label: "Progress" },
];

const DECEL = [0.16, 1, 0.3, 1] as [number, number, number, number];

const ICON_MAP: Record<string, typeof IconGrid3x3> = {
  areas_links: IconGrid3x3,
  form: IconForms,
  summary: IconSum,
  chart: IconChartBar,
  comparison: IconScale,
  bar_chart: IconChartBar,
  line_chart: IconTrendingUp,
  donut_chart: IconChartPie,
  area_chart: IconChartAreaLine,
  balance: IconWallet,
  value: IconHash,
  revenue: IconReportMoney,
  progress: IconTargetArrow,
};

function CardPicker() {
  const dispatch = useDispatch<AppDispatch>();
  const cards = useSelector((s: RootState) => s.area.active.area.structure.cards);
  let ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [showCards, setShowCards] = useState(false);

  useEffect(() => { setMounted(true) }, []);

  return (
    <div className="relative w-full" ref={ref}>
      {mounted && (
        <Popover className="w-full relative">
          {({ open }) => (
            <>
              <AnimatePresence>
                {open && (
                  <PopoverPanel
                    static
                    className="absolute bottom-full right-full mb-0 mr-2"
                    style={{ zIndex: 20000 }}
                  >
                    <div className="flex items-end gap-2">
                      <AnimatePresence>
                        {showCards && (
                          <motion.div
                            initial={{ opacity: 0, x: 8, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 8, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: DECEL }}
                            className="border-border-main border bg overflow-hidden origin-right w-[13rem]"
                          >
                            <div className="w-full justify-between p-3 px-4 flex items-center border-b border-border-main">
                              <span className="text-sm font-medium">Cards</span>
                              <span className="text-xs text-support-500 tabular-nums">{cards.length}</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                              {CARD_TYPES.map(({ type, icon: Icon, label, columns, rows }, i) => (
                                <motion.div
                                  key={type}
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.12, delay: i * 0.025, ease: DECEL }}
                                >
                                  <CloseButton
                                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-support-300 transition-colors duration-150 hover:bg-hover-subtle cursor-pointer"
                                    onClick={() =>
                                      dispatch(create_card({ type: type as any, columns: columns ?? 1, rows: rows ?? 1 }))
                                    }
                                  >
                                    <Icon size={16} stroke={1.5} className="text-support-500 shrink-0" />
                                    <span className="capitalize truncate">{label}</span>
                                    <span className="ml-auto text-[10px] text-support-600 tabular-nums shrink-0">
                                      {columns ?? 1}×{rows ?? 1}
                                    </span>
                                  </CloseButton>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        initial={{ opacity: 0, x: 12, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 8, scale: 0.97 }}
                        transition={{ duration: 0.2, ease: DECEL }}
                        className="border-border-main border bg overflow-hidden origin-right w-[14rem]"
                      >
                        <div className="w-full justify-between p-3 px-4 flex items-center border-b border-border-main">
                          <span className="text-sm font-medium">Add card</span>
                          <CloseButton className="p-2 rounded-full text-support-500 transition-colors duration-150 hover:text-support-200 hover:bg-hover-main focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none" aria-label="Close">
                            <IconX size={14} />
                          </CloseButton>
                        </div>
                        <div className="relative">
                          <div className="grid grid-cols-3">
                            {CARD_TYPES.map(({ type, icon: Icon, label, columns, rows }, i) => (
                              <motion.div
                                key={type}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.15, delay: 0.04 + i * 0.03, ease: DECEL }}
                                whileTap={{ scale: 0.92 }}
                              >
                                <CloseButton
                                  aria-label={label}
                                  className="flex items-center justify-center w-full aspect-square rounded-lg text-support-400 transition-colors duration-150 hover:bg-hover-main hover:text-support-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500"
                                  onClick={() =>
                                    dispatch(create_card({ type: type as any, columns: columns ?? 1, rows: rows ?? 1 }))
                                  }
                                  onMouseEnter={(e) => {
                                    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                                    const parentRect = ref.current?.getBoundingClientRect();
                                    if (parentRect) {
                                      setTooltip({
                                        label,
                                        x: rect.left - parentRect.left + rect.width / 2,
                                        y: rect.top - parentRect.top,
                                      });
                                    }
                                  }}
                                  onMouseLeave={() => setTooltip(null)}
                                >
                                  <Icon size={20} stroke={1.5} />
                                </CloseButton>
                              </motion.div>
                            ))}
                          </div>
                          <AnimatePresence>
                            {tooltip && (
                              <motion.div
                                initial={{ opacity: 0, y: 2 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.1 }}
                                className="absolute px-2 py-1 rounded-md bg-dark-800 border border-border-main text-xs text-support-200 whitespace-nowrap pointer-events-none -translate-x-1/2"
                                style={{ left: tooltip.x, top: tooltip.y - 28 }}
                              >
                                {tooltip.label}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={() => setShowCards(s => !s)}
                          className="w-full flex items-center justify-center gap-2 p-2.5 text-xs text-support-400 border-t border-border-main transition-colors duration-150 hover:bg-hover-subtle hover:text-support-200 rounded focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:outline-none"
                        >
                          <IconList size={14} />
                          <span>{showCards ? "hide" : "cards"}</span>
                        </button>
                      </motion.div>
                    </div>
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
  );
}
export default CardPicker;
