import { createBrowserRouter, RouterProvider } from 'react-router';
import Home from './pages/Home';
import Intro from './pages/Intro';
import Theme from './pages/Theme';
import Grade from './pages/Grade';
import Auth from './pages/Auth';
import Todo from './pages/Todo';
import Layout from './Layout';
import Shop from './pages/Shop';
import Settings from './pages/Settings';
import Ranking from './pages/Ranking';
import LessonsAndTopics from './pages/LessonsAndTopics';

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
            {
                path: '/todo',
                element: <Todo />,
            },
            {
                path: '/shop',
                element: <Shop />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: "/ranking",
                element: <Ranking />
            },
            {
                path: `/book/:grade/:route`,
                element: <LessonsAndTopics />
            }
        ],
    },
]);

export default function App() {
    return (
        <RouterProvider router={router} />
    );
}