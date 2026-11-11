import { useDispatch } from "react-redux"
import { useCallback, useEffect, useState } from "react"
import { create_dashboard_async_function } from "../../contexts/dashboard/functions/create"
import Header from "../../components/header"
import { AppDispatch } from "../../contexts/store"
import Button from "../../components/Button"
import { Dashboard } from "../../contexts/dashboard"
import { list as List } from "../../contexts/dashboard/functions/list"
import { IconPinFilled, IconClock, IconPlus, IconTag, IconSearch } from "@tabler/icons-react"
import {
  getRecentDashboards, getPinnedDashboards, togglePinDashboard,
  getCategories, addCategory, deleteCategory,
  getDashboardCategories, setDashboardCategory, getViewPrefs, setViewPrefs,
  type Category, type ViewPrefs, type RecentDashboard
} from "../../lib/storage"
import { delete_dashboard } from "../../contexts/dashboard/functions/delete"
import { CATEGORY_COLORS } from "./types"
import SectionLabel from "./SectionLabel"
import RecentStrip from "./RecentStrip"
import Toolbar from "./Toolbar"
import DashboardCard from "./DashboardCard"
import DashboardListItem from "./DashboardListItem"
import CategoryDialog from "./CategoryDialog"
import DeleteDialog from "./DeleteDialog"

function MainPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [recentEntries, setRecentEntries] = useState<RecentDashboard[]>([])
  const [pinnedIds, setPinnedIds] = useState<number[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dashboardCategories, setDashboardCategoriesState] = useState<Record<number, string[]>>({})
  const [viewPrefs, setViewPrefsState] = useState<ViewPrefs>({ mode: 'grid', sort: 'name' })
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [newCatName, setNewCatName] = useState("")
  const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0])
  const [deleteConfirm, setDeleteConfirm] = useState<Dashboard | null>(null)
  const [tagPopover, setTagPopover] = useState<number | null>(null)
  const [search, setSearch] = useState("")

  const loadAll = useCallback(async () => {
    dispatch(List(setDashboards))
    setRecentEntries(await getRecentDashboards())
    setPinnedIds(await getPinnedDashboards())
    setCategories(await getCategories())
    setDashboardCategoriesState(await getDashboardCategories())
    setViewPrefsState(await getViewPrefs())
  }, [dispatch])

  useEffect(() => { loadAll() }, [loadAll])

  const handlePin = async (dashboardId: number) => {
    const nowPinned = await togglePinDashboard(dashboardId)
    setPinnedIds(prev => nowPinned ? [...prev, dashboardId] : prev.filter(id => id !== dashboardId))
  }

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    const cat = await addCategory(newCatName.trim(), newCatColor)
    setCategories(prev => [...prev, cat])
    setNewCatName("")
    setNewCatColor(CATEGORY_COLORS[(categories.length + 1) % CATEGORY_COLORS.length])
  }

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
    if (activeFilter === id) setActiveFilter(null)
    setDashboardCategoriesState(await getDashboardCategories())
  }

  const handleTagDashboard = useCallback((dashboardId: number, categoryId: string) => {
    setDashboardCategoriesState(prev => {
      const current = prev[dashboardId] ?? []
      const has = current.includes(categoryId)
      return { ...prev, [dashboardId]: has ? current.filter(c => c !== categoryId) : [...current, categoryId] }
    })
    setDashboardCategory(dashboardId, categoryId)
  }, [])

  const handleViewMode = async (mode: 'grid' | 'list') => {
    const prefs = { ...viewPrefs, mode }
    setViewPrefsState(prefs)
    await setViewPrefs(prefs)
  }

  const handleSort = async (sort: 'name' | 'recent' | 'created') => {
    const prefs = { ...viewPrefs, sort }
    setViewPrefsState(prefs)
    await setViewPrefs(prefs)
  }

  const pinnedDashboards = dashboards.filter(a => pinnedIds.includes(a.id))
  const recentDashboards = recentEntries
    .map(r => dashboards.find(a => a.id === r.dashboardId))
    .filter((a): a is Dashboard => !!a)
    .filter(a => !pinnedIds.includes(a.id))
    .slice(0, 6)

  let filteredDashboards = dashboards
  if (activeFilter) {
    filteredDashboards = filteredDashboards.filter(a => (dashboardCategories[a.id] ?? []).includes(activeFilter))
  }
  if (search.trim()) {
    const q = search.toLowerCase()
    filteredDashboards = filteredDashboards.filter(a => a.name.toLowerCase().includes(q) || a.description?.toLowerCase().includes(q))
  }
  if (viewPrefs.sort === 'name') {
    filteredDashboards = [...filteredDashboards].sort((a, b) => a.name.localeCompare(b.name))
  } else if (viewPrefs.sort === 'recent') {
    const recentMap = new Map(recentEntries.map(r => [r.dashboardId, r.timestamp]))
    filteredDashboards = [...filteredDashboards].sort((a, b) => (recentMap.get(b.id) ?? 0) - (recentMap.get(a.id) ?? 0))
  }

  return (
    <div className="min-h-screen">
      <Header>
        <h1 className="text-xl font-semibold">Dashboards</h1>
        <div className="flex items-center gap-2">
          <Button variant="tonal" size="sm" onClick={() => setCategoryDialogOpen(true)} icon={<IconTag size={16} />}>
            Categories
          </Button>
          <Button size="sm" onClick={() => {
            dispatch(create_dashboard_async_function())
            setTimeout(loadAll, 300)
          }} icon={<IconPlus size={16} />}>
            Create Dashboard
          </Button>
        </div>
      </Header>

      <div className="px-8 pt-24 pb-12 space-y-10 max-w-[1400px]">

        {pinnedDashboards.length > 0 && (
          <section>
            <SectionLabel icon={<IconPinFilled size={15} />} label="Pinned" />
            <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3">
              {pinnedDashboards.map(area => (
                <DashboardCard
                  key={area.id}
                  area={area}
                  pinned
                  onPin={handlePin}
                  onDelete={setDeleteConfirm}
                  categories={categories}
                  dashCats={dashboardCategories[area.id] ?? []}
                  onTag={handleTagDashboard}
                  tagPopoverOpen={tagPopover === area.id}
                  onTagPopover={setTagPopover}
                />
              ))}
            </div>
          </section>
        )}

        {recentDashboards.length > 0 && (
          <section>
            <SectionLabel icon={<IconClock size={15} />} label="Recent" />
            <RecentStrip dashboards={recentDashboards} categories={categories} dashboardCategories={dashboardCategories} />
          </section>
        )}

        <section>
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-[15px] font-semibold text-support-100">All Dashboard</h2>
            <Toolbar
              search={search}
              onSearch={setSearch}
              categories={categories}
              activeFilter={activeFilter}
              onFilter={setActiveFilter}
              sort={viewPrefs.sort}
              onSort={handleSort}
              mode={viewPrefs.mode}
              onMode={handleViewMode}
            />
          </div>

          {viewPrefs.mode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-3">
              {filteredDashboards.map(area => (
                <DashboardCard
                  key={area.id}
                  area={area}
                  pinned={pinnedIds.includes(area.id)}
                  onPin={handlePin}
                  onDelete={setDeleteConfirm}
                  categories={categories}
                  dashCats={dashboardCategories[area.id] ?? []}
                  onTag={handleTagDashboard}
                  tagPopoverOpen={tagPopover === area.id}
                  onTagPopover={setTagPopover}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border-main divide-y divide-border-main overflow-hidden">
              {filteredDashboards.map(area => (
                <DashboardListItem
                  key={area.id}
                  area={area}
                  pinned={pinnedIds.includes(area.id)}
                  onPin={handlePin}
                  onDelete={setDeleteConfirm}
                  categories={categories}
                  dashCats={dashboardCategories[area.id] ?? []}
                  onTag={handleTagDashboard}
                  tagPopoverOpen={tagPopover === area.id}
                  onTagPopover={setTagPopover}
                />
              ))}
            </div>
          )}

          {filteredDashboards.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-support-500">
              <div className="size-12 rounded-xl bg-hover-main flex items-center justify-center mb-4">
                <IconSearch size={20} className="text-support-600" />
              </div>
              <p className="text-sm font-medium text-support-400 mb-1">
                {activeFilter || search ? "No matching dashboards" : "No dashboards yet"}
              </p>
              <p className="text-xs text-support-600">
                {activeFilter || search ? "Try a different filter or search term" : "Create your first area to get started"}
              </p>
            </div>
          )}
        </section>
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        categories={categories}
        newCatName={newCatName}
        onNameChange={setNewCatName}
        newCatColor={newCatColor}
        onColorChange={setNewCatColor}
        onAdd={handleAddCategory}
        onDelete={handleDeleteCategory}
      />

      <DeleteDialog
        area={deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            dispatch(delete_dashboard(deleteConfirm.id))
            setDeleteConfirm(null)
            setTimeout(loadAll, 300)
          }
        }}
      />
    </div>
  )
}

export default MainPage
