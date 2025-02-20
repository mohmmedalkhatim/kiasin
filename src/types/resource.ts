import { Note } from "./notes"
import { Project } from "./project"
import { Todo } from "./todos"

export interface Resource {
    title: string
    discription: string
    ui_schema: string
    cover: string
    icon: String
  }
  
  export interface AreaPage {
    info: Resource
    projects: Project[]
    notes: Note[]
    todos: Todo[]
  }
  export interface Payload {
    command: String
    item: Resource
    id: number
  }
  