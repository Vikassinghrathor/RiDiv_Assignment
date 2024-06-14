import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importing components and styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import Home from '../src/pages/Home'
import Error from '../src/pages/Error'
import App from './App'

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error />,
        children: [
            {
                index: true,
        element: <Home/>,
            },

        ],
    },
  ]);

  ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
  );