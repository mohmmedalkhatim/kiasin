import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
} from 'react-router-dom';
import App from '../App';
import Dashborad from '../screens/dashborad';
import Areas from '../screens/areas';
import Notes from '../screens/notes';
import Note from '../note';
import Databases from '../screens/Databases';
import Archive from '../screens/archive';
import Area from '../screens/areas/area';
import EventsPage from '../EventsBase';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<Dashborad />} index />
      <Route path="/Areas" element={<Areas />} />
      <Route path="/Notes" element={<Notes />} />
      <Route path="/note/:id" element={<Note />} />
      <Route path="/Area/:id" element={<Area />} />
      <Route path="/Archive" element={<Archive />} />
      <Route path="/databases" element={<Databases />} />
      <Route path="/events" element={<EventsPage />} />
    </Route>
  )
);
