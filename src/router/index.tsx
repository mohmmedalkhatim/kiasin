import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import App from '../App'
import Dashborad from '../screens/dashborad'
import Areas from '../screens/areas'
import Projects from '../screens/projects'
import Project from '../screens/projects/project'
import Area from '../screens/areas/area'

export const router =
    createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<App />}>
                <Route path='/' element={<Dashborad/>} index/>
                <Route path='' element={<Areas/>} />
                <Route path=''element={<Area/>}/>
                <Route path=''element={<Projects/>} />
                <Route path=''element={<Project/>} />
            </Route>
        )
    )