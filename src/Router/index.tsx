import { lazy } from "react";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import App from "../App";

const Dashboard = lazy(() => import("../pages/dashboard"));
const Databases = lazy(() => import("../pages/sheets"));
const MainPage = lazy(() => import("../pages/main"));
const FormBuilder = lazy(() => import("../pages/form_builder"));
const KanbanPage = lazy(() => import("../pages/kanban"));


export let router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<App />}>
            <Route path="/" index element={<MainPage/> } />
            <Route path="/databases" element={<Databases />} />
            <Route path="/dashboard/:id" element={<Dashboard />} />
            <Route path="/form_builder" element={<FormBuilder />} />
            <Route path="/kanban" element={<KanbanPage />} />
        </Route>
    )
)