import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Theme from './pages/Theme';
import Grade from './pages/Grade';
import Auth from './pages/Auth';
import Layout from './Layout';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/intro',
                element: <Intro />,
            },
            {
                path: '/theme',
                element: <Theme />,
            },
            {
                path: '/grade',
                element: <Grade />,
            },
            {
                path: '/auth',
                element: <Auth />,
            },
        ],
    },
]);

export default function App() {
    return (
        <RouterProvider router={router} />
    );
}