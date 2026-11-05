import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Area from "../pages/area";
import App from "../App";
import Databases from "../pages/sheets";
import MainPage from "../pages/main";
import FormBuilder from "../pages/form_builder";


export let router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />}>
            <Route path="/" index element={<MainPage/> } />
            <Route path="/databases" element={<Databases />} />
            <Route path="/area/:id" element={<Area />} />
            <Route path="/form_builder" element={<FormBuilder />} />
        </Route>
    )
)