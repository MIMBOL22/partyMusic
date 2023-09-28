import React from "react";
import App from "./App";

import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";


createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <React.StrictMode>
            <App/>
            <ToastContainer
                position="bottom-right"
                autoClose={1000}
            />
        </React.StrictMode>
    </BrowserRouter>
);
