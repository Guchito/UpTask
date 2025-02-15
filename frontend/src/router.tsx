import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import DashboardView from '@/views/DashboardView'
import CreateProjectViews from './views/projects/CreateProjectViews'
import EditProjectView from './views/projects/EditProjectView'

export default function Router(){


    return(
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<DashboardView />} index />
                    <Route path="/projects/create" element={<CreateProjectViews />} />
                    <Route path="/projects/:projectId/edit" element={<EditProjectView />} />

                </Route>
            </Routes>
        </BrowserRouter>
    )
}