import { Note } from './notes'
import { Todo } from './todos'

export interface Card {
  id: number
  cols: number
  rows: number
  type: string
  props: any | undefined
}

export interface Area {
  title: string
  discription: string
  ui_schema: { item: Card[] }
  cover: number[] | string
  icon: number[] | string
  links: { list: string[] }
  id: number
}

export interface AreaPage {
  info: Area
  notes: Note[]
  todos: Todo[]
  media: string[] | number[]
}
export interface Payload {
  command: String
  item: Area
  id: number
}
