import { Project } from "./project"

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
    notes: note[]
    todos: todo[]
  }
  export interface Payload {
    command: String
    item: Resource
    id: number
  }
  