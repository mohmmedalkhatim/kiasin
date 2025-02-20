import { Note } from "./notes"
import { Todo } from "./todos"

export interface Project {
  title: string
  discription: string
  ui_schema: string
  cover: string
  icon: String
}

export interface ProjectPage {
  info: Project
  notes: Note[]
  todos: Todo[]
}
export interface Payload {
  command: String
  item: Project
  id: number
}
