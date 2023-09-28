import React from "react";

import "react-toastify/dist/ReactToastify.css";
import "../css/index.css";
import {NavBar} from "../сomponents/NavBar";
import { NewSong } from "../сomponents/NewSong";
import { SongList } from "../сomponents/SongList";
import useLocalStorage from "use-local-storage";


export const IndexPage = () => {
    const [log, setLog] = useLocalStorage("log","");
    return (
        <>
            <NavBar/>
            <NewSong/>
            <SongList/>
            {log}
        </>
    );
}
