import React from "react";

import "react-toastify/dist/ReactToastify.css";
import "../css/index.css";
import {NavBar} from "../сomponents/NavBar";
import { NewSong } from "../сomponents/NewSong";
import { SongList } from "../сomponents/SongList";
import useLocalStorage from "use-local-storage";
import {AuthorsWarning} from "../сomponents/AuthorsWarning";


export const IndexPage = () => {
    return (
        <>
            <NavBar/>
            <NewSong/>
            <SongList/>
        </>
    );
}
