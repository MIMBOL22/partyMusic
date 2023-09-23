import React, {useState} from "react";
import {toast, ToastContainer} from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../css/index.css";


export default function IndexPage() {
    return (
        <>
            <div className="wrapper">
                <h1>Hi</h1>
            </div>
            <ToastContainer limit={3}/>
        </>
    );
}
