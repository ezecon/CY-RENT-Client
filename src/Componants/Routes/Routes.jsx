import { createBrowserRouter } from "react-router-dom";
import Main from "../Layout/Main/Main";
import Home from "../../Pages/Home/Home";
import { Register } from "../../Pages/Register/Register";
import { Login } from "../../Pages/Login/Login";
import NIDverify from "../../Pages/NIDVerify/NIDverify";
import AddCycle from "../../Pages/AddCycle/AddCyble";
import Profile from "../../Pages/Profile/Profile";
import Dashboard from "../../Pages/Profile/Dashboard";
import RentRequest from "../../Pages/Profile/Dashboard/RentRequest";
import RentHistory from "../../Pages/Profile/Dashboard/RentHistory";
import PostHistory from "../../Pages/Profile/Dashboard/PostHistory";
import RentCycle from "../../Pages/Rent/RentCycle";
import SingleCycle from "../Single-Cycle/SingleCycle";
import User from "../../Pages/User/User";
import ProfileUpdate from "../../Pages/Profile/ProfileUpdate";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/add-cycle',
                element: <AddCycle />
            },
            {
                path: '/profile',
                element: <Profile />
            },
            {
                path: '/profile-update',
                element: <ProfileUpdate />
            },
            {
                path: '/nid-verify',
                element: <NIDverify />
            },
            {
                path: '/dashboard',
                element: <Dashboard/>,
                children: [
                    {
                        path: 'rent-request',
                        element: <RentRequest />,
                    },
                    {
                        path: 'rent-history',
                        element: <RentHistory />,
                    },
                    {
                        path: 'post-history',
                        element: <PostHistory
                         />,
                    },
                ]
            },
            {
                path: '/user/:id',
                element: <User />
            },
            {
                path: '/rent-now',
                element: <RentCycle />
            },
            {
                path: '/rent-now/:id',
                element: <SingleCycle />
            }
        ]
    },
    {
        path: '/login',
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: '*',
        element: <div>404 Not Found</div>
    }
]);

export default router;
