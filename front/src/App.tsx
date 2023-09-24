import React, {useEffect} from "react";
import {Route, Routes} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {IndexPage} from "./pages/IndexPage";
import { Config } from "@vkontakte/superappkit";

export default function App() {
    useEffect(() => {
        Config.init({
            appId: 51756153, // идентификатор приложения
        });
    }, []);

    return (
        <Routes>
            <Route path="/" element={<IndexPage/>}/>
        </Routes>
    );
}
