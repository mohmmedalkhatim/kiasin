import { createBrowserRouter, Route, createRoutesFromElements } from 'react-router-dom'
import App from '../App'
import Dashborad from '../screens/dashborad'
import Areas from '../screens/areas'
import Area from '../screens/areas/area_card'
import Archive from '../screens/archive'

export const router =
    createBrowserRouter(
        createRoutesFromElements(
            <Route path='/' element={<App />}>
                <Route path='/' element={<Dashborad/>} index/>
                <Route path='/Areas' element={<Areas/>} />
                <Route path='/Area/:id'element={<Area/>}/>
                <Route path='/Archive'element={<Archive/>} />
            </Route>
        )
    )