import { create,} from 'zustand'
interface Card {
  id: number
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
    this.sort_list = this.list?.map(item=>item.id.toString())
    this.set = set
  }
  updatalists (sort_list: string[]) {
    let set =  this.set;
    if(set){
      set((state)=>{
        state.sort_list = sort_list
        return state
      })
    }
  }
}

export let useLayout = create<Layout>()