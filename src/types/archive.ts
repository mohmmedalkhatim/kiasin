import { Area } from './area'
import { Note } from './notes'
import { Project } from './project'
import { Todo } from './todos'

export interface Archive {
  projects: Project[]
  areas: Area[]
  notes: Note[]
  todos: Todo[]
}
