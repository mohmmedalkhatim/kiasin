import { create, createStore } from 'zustand'
interface Card {
  id: string
  props: any
  content: string
  width: number
  height: number
}
type setType = {
  (
    partial:
      | Layout
      | Partial<Layout>
      | ((state: Layout) => Layout | Partial<Layout>),
    replace?: false
  ): void
  (state: Layout | ((state: Layout) => Layout), replace: true): void
}
class Layout {
  public list?: Card[]
  public sort_list?: string[]
  constructor (set: setType, schema: string) {
    this.list = JSON.parse(schema)
    this.sort_list = this.list?.map(item => item.id)
  }
  updatalists (Cardlist: string[]) {
    this.sort_list = Cardlist
  }
}

let useLayout = create<Layout>()