import { Note } from "./notes"
import { Project } from "./project"
import { Todo } from "./todos"

export  interface Card{
  id:number
  cols:number,
  rows:number,
  props:any | undefined,
}

export interface Area {
  title: string
  discription: string
  ui_schema: {item:Card[]}
  cover: number[]  | string
  icon: number[] | string
  id:number
}

export interface AreaPage {
  info: Area
  projects: Project[]
  notes: Note[]
  todos: Todo[]
}
export interface Payload {
  command: String
  item: Area
  id: number
}
