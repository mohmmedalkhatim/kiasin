export interface Project {
  title: string
  discription: string
  ui_schema: string
  cover: string
  icon: String
}

export interface ProjectPage {
  info: Project
  notes: note[]
  todos: todo[]
}
export interface Payload {
  command: String
  item: Project
  id: number
}
