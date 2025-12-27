import { Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Equipment from "../pages/Equipments"
import Layout from "../layout/layout"


const routes = (
    <Route>
    <Route path="/" element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/equipment" element={<Equipment />} />
    </Route>
    </Route>
)

export default routes;