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
export class Layout {
  public list?: Card[]
  public sort_list?: string[]
  public set?:setType
  constructor (set: setType, schema: string) {
    this.list = JSON.parse(schema).items
    this.set = set
  }
  updatalists (Cardlist: string[]) {
    let set =  this.set;
    if(set){
      set((state)=>(this))
    }
  }
}

export let useLayout = create<Layout>()