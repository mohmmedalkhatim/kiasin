import { storage } from "../main"

export interface RecentDashboard {
  dashboardId: number
  timestamp: number
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface ViewPrefs {
  mode: 'grid' | 'list'
  sort: 'name' | 'recent' | 'created'
}

const KEYS = {
  recent: "recent_dashboards",
  pinned: "pinned_dashboards",
  categories: "categories",
  dashboardCategories: "dashboard_categories",
  viewPrefs: "view_prefs",
} as const

const MAX_RECENT = 8

export async function getRecentDashboards(): Promise<RecentDashboard[]> {
  return (await storage.get<RecentDashboard[]>(KEYS.recent)) ?? []
}

export async function trackRecentDashboard(dashboardId: number) {
  let recents = await getRecentDashboards()
  recents = recents.filter(r => r.dashboardId !== dashboardId)
  recents.unshift({ dashboardId, timestamp: Date.now() })
  recents = recents.slice(0, MAX_RECENT)
  await storage.set(KEYS.recent, recents)
  await storage.save()
}

export async function getPinnedDashboards(): Promise<number[]> {
  return (await storage.get<number[]>(KEYS.pinned)) ?? []
}

export async function togglePinDashboard(dashboardId: number): Promise<boolean> {
  let pinned = await getPinnedDashboards()
  const isPinned = pinned.includes(dashboardId)
  if (isPinned) {
    pinned = pinned.filter(id => id !== dashboardId)
  } else {
    pinned.push(dashboardId)
  }
  await storage.set(KEYS.pinned, pinned)
  await storage.save()
  return !isPinned
}

export async function getCategories(): Promise<Category[]> {
  return (await storage.get<Category[]>(KEYS.categories)) ?? []
}

export async function saveCategories(categories: Category[]) {
  await storage.set(KEYS.categories, categories)
  await storage.save()
}

export async function addCategory(name: string, color: string): Promise<Category> {
  const categories = await getCategories()
  const cat: Category = { id: crypto.randomUUID(), name, color }
  categories.push(cat)
  await saveCategories(categories)
  return cat
}

export async function deleteCategory(id: string) {
  let categories = await getCategories()
  categories = categories.filter(c => c.id !== id)
  await saveCategories(categories)
  const mapping = await getDashboardCategories()
  for (const dashboardId of Object.keys(mapping)) {
    mapping[Number(dashboardId)] = mapping[Number(dashboardId)].filter(cid => cid !== id)
  }
  await storage.set(KEYS.dashboardCategories, mapping)
  await storage.save()
}

export async function getDashboardCategories(): Promise<Record<number, string[]>> {
  return (await storage.get<Record<number, string[]>>(KEYS.dashboardCategories)) ?? {}
}

export async function setDashboardCategory(dashboardId: number, categoryId: string) {
  const mapping = await getDashboardCategories()
  const current = mapping[dashboardId] ?? []
  if (current.includes(categoryId)) {
    mapping[dashboardId] = current.filter(id => id !== categoryId)
  } else {
    mapping[dashboardId] = [...current, categoryId]
  }
  await storage.set(KEYS.dashboardCategories, mapping)
  await storage.save()
}

export async function getViewPrefs(): Promise<ViewPrefs> {
  return (await storage.get<ViewPrefs>(KEYS.viewPrefs)) ?? { mode: 'grid', sort: 'name' }
}

export async function setViewPrefs(prefs: ViewPrefs) {
  await storage.set(KEYS.viewPrefs, prefs)
  await storage.save()
}
