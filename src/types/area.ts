import { Card } from "../context/page_schema"
import { Note } from "./notes"
import { Project } from "./project"
import { Todo } from "./todos"

export interface Area {
  title: string
  discription: string
  ui_schema: {item:Card[]}
  cover: number[]  | string
  icon: number[] | string
  id:string
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
