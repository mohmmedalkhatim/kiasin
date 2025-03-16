import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import App from '../App'
import Dashborad from '../screens/dashborad'
import Areas from '../screens/areas'
import Projects from '../screens/projects'
import Project from '../screens/projects/project'
import Area from '../screens/areas/area_card'
import Resources from '../screens/resources'
import Resource from '../screens/resources/resource'
import Archive from '../screens/archive'

export const router =
    createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<App />}>
                <Route path='/' element={<Dashborad/>} index/>
                <Route path='/Areas' element={<Areas/>} />
                <Route path='/Area/:id'element={<Area/>}/>
                <Route path='/Projects'element={<Projects/>} />
                <Route path='/Project/:id'element={<Project/>} />
                <Route path='/Resources'element={<Resources/>} />
                <Route path='/Resource/:id'element={<Resource/>} />
                <Route path='/Archive'element={<Archive/>} />
            </Route>
        )
    )