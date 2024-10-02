import {useEffect, useRef, useState} from "react";

export const TwinkVideo = ({magic}: {magic: boolean}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        window.onbeforeunload = function( ) {
            return true;
        };
    }, []);

    useEffect(() => {
        if(magic){
            if(videoRef.current) videoRef.current.play();
            if(document.documentElement.requestFullscreen) document.documentElement.requestFullscreen()
        }
    }, [magic]);

    return (
        <div className="tvideo_container" hidden={!magic}>
            <video className="tt" src="/video.mp4" loop ref={videoRef}></video>
        </div>
    )
}