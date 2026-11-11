import { useState } from "react"
import {
  IconSearch, IconLayoutGrid, IconList,
  IconSortAscending, IconChevronDown
} from "@tabler/icons-react"
import type { Category } from "../../../lib/storage"

function SortMenu({ value, onChange }: { value: string; onChange: (v: 'name' | 'recent' | 'created') => void }) {
  const [open, setOpen] = useState(false)
  const options = [
    { value: 'name' as const, label: 'Name' },
    { value: 'recent' as const, label: 'Recent' },
    { value: 'created' as const, label: 'Created' },
  ]
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] text-support-500 hover:text-support-300 transition-colors px-2 py-1 rounded-md hover:bg-hover-main"
      >
        <IconSortAscending size={13} />
        {options.find(o => o.value === value)?.label}
        <IconChevronDown size={11} className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 z-50 bg rounded-lg border border-border-main shadow-xl shadow-dark-900/50 py-1 min-w-32 animate-[selectEnter_120ms_ease-out]">
            {options.map(opt => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false) }}
                className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors duration-100 ${
                  value === opt.value ? 'text-primary-400 bg-primary-600/8' : 'text-support-300 hover:bg-hover-main'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Toolbar({ search, onSearch, categories, activeFilter, onFilter, sort, onSort, mode, onMode }: {
  search: string
  onSearch: (v: string) => void
  categories: Category[]
  activeFilter: string | null
  onFilter: (v: string | null) => void
  sort: string
  onSort: (v: 'name' | 'recent' | 'created') => void
  mode: string
  onMode: (v: 'grid' | 'list') => void
}) {
  return (
    <div className="flex items-center gap-1">
      <div className="relative mr-1">
        <IconSearch size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-support-600 pointer-events-none" />
        <input
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search"
          className="h-7 w-36 pl-7 pr-2 text-xs rounded-md border border-border-main bg-transparent text-support-200 placeholder:text-support-500 focus:outline-none focus:border-primary-600/50 focus:w-52 transition-all duration-200"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex items-center gap-0.5 px-1 border-l border-border-main ml-1">
          <button
            onClick={() => onFilter(null)}
            className={`text-[11px] px-2 py-1 rounded-md transition-colors duration-100 ${
              !activeFilter ? 'bg-primary-600/15 text-primary-400' : 'text-support-500 hover:text-support-300 hover:bg-hover-main'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onFilter(activeFilter === cat.id ? null : cat.id)}
              className="text-[11px] px-2 py-1 rounded-md transition-colors duration-100 hover:bg-hover-main flex items-center gap-1.5"
              style={{
                backgroundColor: activeFilter === cat.id ? cat.color + "18" : undefined,
                color: activeFilter === cat.id ? cat.color : undefined
              }}
            >
              <span className="size-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="border-l border-border-main pl-1 ml-1">
        <SortMenu value={sort} onChange={onSort} />
      </div>

      <div className="flex items-center border border-border-main rounded-md overflow-hidden ml-1">
        <button
          onClick={() => onMode('grid')}
          className={`p-1.5 transition-colors duration-100 ${mode === 'grid' ? 'bg-hover-main text-support-200' : 'text-support-600 hover:text-support-400'}`}
        >
          <IconLayoutGrid size={14} />
        </button>
        <button
          onClick={() => onMode('list')}
          className={`p-1.5 transition-colors duration-100 ${mode === 'list' ? 'bg-hover-main text-support-200' : 'text-support-600 hover:text-support-400'}`}
        >
          <IconList size={14} />
        </button>
      </div>
    </div>
  )
}
