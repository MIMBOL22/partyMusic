import React from "react";
import {Route, Routes} from "react-router-dom";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<></>}/>
            <Route path="/schedule" element={<></>}/>
            <Route path="/announcement" element={<></>}/>
        </Routes>
    );
}
